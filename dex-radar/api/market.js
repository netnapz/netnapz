/** NETNAPZ DEX RADAR — read-only DexPaprika proxy.
 * No private keys, signing, trading, custody, tracking cookies or write operations.
 * The API response is passed through with source/as-of metadata; never invent values.
 */
'use strict';
const CHAINS=new Set(['solana','ethereum','base','arbitrum','bsc','polygon']);
const SORTS={volume:'volume_usd_24h',new:'created_at',trending:'price_change_percentage_1h',liquidity:'liquidity_usd',pump:'created_at',watchlist:'volume_usd_24h'};
const INTERVALS=new Set(['1h','6h','12h','24h']);
const HOST='https://api.dexpaprika.com';
module.exports=async function handler(req,res){
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Only read-only GET is supported'});}
 const query=req.query||{};
 const chain=String(query.chain||'solana').toLowerCase();
 if(!CHAINS.has(chain))return res.status(400).json({error:'Unsupported network'});
 const type=String(query.type||'list').toLowerCase();
 // Public metadata lookup only: resolve at most 90 Solana mints in one call.
 // Never use a user-supplied origin or execute wallet operations.
 if(type==='launches'){
  if(chain!=='solana')return res.status(400).json({error:'Launch feed is Solana-only'});
  const acLaunch=new AbortController(),launchTimeout=setTimeout(()=>acLaunch.abort(),11000);
  try{
   const headers={'Accept':'application/json'};
   if(process.env.JUPITER_API_KEY)headers['x-api-key']=process.env.JUPITER_API_KEY;
   let response=await fetch('https://api.jup.ag/tokens/v2/recent',{headers,signal:acLaunch.signal});
   if(!response.ok&&!process.env.JUPITER_API_KEY&&[401,403,429].includes(response.status)){
    response=await fetch('https://lite-api.jup.ag/tokens/v2/recent',{headers:{Accept:'application/json'},signal:acLaunch.signal});
   }
   if(!response.ok)return res.status(503).json({error:'Recent launches unavailable from provider ('+response.status+')',source:'Jupiter Tokens V2'});
   const values=await response.json();
   if(!Array.isArray(values))throw Error('Unexpected recent-launch response');
   const launches=values.filter(v=>String(v.launchpad||'').toLowerCase()==='pump.fun')
     .slice(0,30).map(v=>({
      id:String(v.id||''),name:String(v.name||'').slice(0,90),symbol:String(v.symbol||'').slice(0,22),
      createdAt:v.createdAt||v.firstPool?.createdAt||null,usdPrice:Number.isFinite(Number(v.usdPrice))?Number(v.usdPrice):null,
      liquidity:Number.isFinite(Number(v.liquidity))?Number(v.liquidity):null,
      mcap:Number.isFinite(Number(v.mcap))?Number(v.mcap):null,
      holderCount:Number.isFinite(Number(v.holderCount))?Number(v.holderCount):null,
      isVerified:v.isVerified===true,graduated:Boolean(v.graduatedPool),
      launchpad:String(v.launchpad||'')
     })).filter(v=>/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(v.id));
   res.setHeader('Cache-Control','s-maxage=25, stale-while-revalidate=45');
   return res.status(200).json({source:'Jupiter Tokens V2',asOf:new Date().toISOString(),chain,type,data:launches});
  }catch(e){return res.status(503).json({error:'Recent launch data unavailable: '+String(e?.message||e).slice(0,115),source:'Jupiter Tokens V2'})}
  finally{clearTimeout(launchTimeout)}
 }
 if(type==='metadata'){
  if(chain!=='solana')return res.status(400).json({error:'This metadata lookup is Solana-only'});
  const mints=[...new Set(String(query.mints||'').split(',').filter(v=>/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(v)))].slice(0,90);
  if(!mints.length)return res.status(400).json({error:'No valid Solana mint addresses'});
  const acMeta=new AbortController(),timerMeta=setTimeout(()=>acMeta.abort(),11000);
  try{
   const headers={'Accept':'application/json'};
   if(process.env.JUPITER_API_KEY)headers['x-api-key']=process.env.JUPITER_API_KEY;
   const url='https://api.jup.ag/tokens/v2/search?query='+encodeURIComponent(mints.join(','));
   let response=await fetch(url,{headers,signal:acMeta.signal});
   if(!response.ok&&!process.env.JUPITER_API_KEY&&[401,403,429].includes(response.status)){
    response=await fetch('https://lite-api.jup.ag/tokens/v2/search?query='+encodeURIComponent(mints.join(',')),{headers:{'Accept':'application/json'},signal:acMeta.signal});
   }
   if(!response.ok)return res.status(503).json({error:'Token metadata source unavailable ('+response.status+')',source:'Jupiter Tokens V2'});
   const json=await response.json();if(!Array.isArray(json))throw Error('Unexpected token metadata response');
   const allow=new Set(mints);
   const tokens=json.filter(t=>allow.has(String(t.id||''))).map(t=>({
    id:String(t.id),symbol:String(t.symbol||'').slice(0,22),name:String(t.name||'').slice(0,75),
    isVerified:t.isVerified===true,icon:typeof t.icon==='string'&&t.icon.startsWith('https://')?t.icon:null
   }));
   res.setHeader('Cache-Control','s-maxage=180, stale-while-revalidate=240');
   return res.status(200).json({source:'Jupiter Tokens V2',chain,asOf:new Date().toISOString(),type,data:tokens});
  }catch(e){return res.status(503).json({error:'Token metadata temporarily unavailable: '+String(e?.message||e).slice(0,120),source:'Jupiter Tokens V2'})}
  finally{clearTimeout(timerMeta)}
 }
 const params=new URLSearchParams();
 let path;
 if(type==='list'){
  const view=String(query.view||'volume').toLowerCase();
  const order=SORTS[view]||SORTS.volume;
  path='/networks/'+chain+'/pools/search';
  params.set('order_by',order);params.set('sort','desc');params.set('limit','75');
 }else if(type==='chart'||type==='pool'){
  const id=String(query.pool||'').trim();
  if(!/^(?:[a-zA-Z0-9]{24,100}|0x[0-9a-fA-F]{40})$/.test(id))return res.status(400).json({error:'Invalid pool address'});
  path='/networks/'+chain+'/pools/'+encodeURIComponent(id);
  if(type==='chart'){
   path+='/ohlcv';
   const interval=String(query.interval||'1h');
   if(!INTERVALS.has(interval))return res.status(400).json({error:'Unsupported chart interval'});
   params.set('start','-24h');params.set('interval',interval);params.set('limit','30');
  }
 }else if(type==='search'){
  const term=String(query.q||'').trim().slice(0,100);
  if(term.length<2)return res.status(400).json({error:'Enter at least two characters'});
  path='/search';params.set('query',term);
 }else return res.status(400).json({error:'Unsupported request'});
 const url=HOST+path+(params.size?'?'+params.toString():'');
 const ac=new AbortController();
 const timeout=setTimeout(()=>ac.abort(),11500);
 try{
  const headers={'Accept':'application/json'};
  if(process.env.DEXPAPRIKA_API_KEY)headers.Authorization=process.env.DEXPAPRIKA_API_KEY;
  const upstream=await fetch(url,{headers,signal:ac.signal});
  const raw=await upstream.text();
  let response;
  try{response=JSON.parse(raw)}catch{throw Error('Market data provider sent an unreadable response');}
  if(!upstream.ok){
   const msg=typeof response?.error==='string'?response.error:response?.message||'Data provider request failed';
   return res.status(upstream.status===429?429:upstream.status===403?503:502).json({error:String(msg).slice(0,150),providerStatus:upstream.status,source:'DexPaprika'});
  }
  res.setHeader('Cache-Control',type==='chart'?'s-maxage=90, stale-while-revalidate=90':'s-maxage=20, stale-while-revalidate=45');
  return res.status(200).json({source:'DexPaprika',chain,asOf:new Date().toISOString(),type,data:response});
 }catch(e){
  return res.status(502).json({error:e?.name==='AbortError'?'Market data provider timed out':String(e?.message||e).slice(0,150),source:'DexPaprika'});
 }finally{clearTimeout(timeout);}
};