'use strict';
/* NetNapz DEX Radar. Read-only market discovery and explicitly external trading/launch routes.
   This application NEVER creates, signs or submits a blockchain transaction. */
(()=>{
const $=id=>document.getElementById(id);
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const BASE='https://jup.ag/swap',PUMP='https://pump.fun/create';
const KNOWN_TOKENS={
 'So11111111111111111111111111111111111111112':{symbol:'SOL',name:'Wrapped SOL'},
 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v':{symbol:'USDC',name:'USD Coin'},
 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB':{symbol:'USDT',name:'Tether USD'}
};
const CHAINS={solana:'Solana',base:'Base',ethereum:'Ethereum',arbitrum:'Arbitrum',bsc:'BNB Chain',polygon:'Polygon'};
const state={chain:'solana',view:'volume',page:'discover',pools:[],selected:null,selectedId:'',interval:'1h',status:'starting',minLiquidity:50000,query:'',asOf:null,loading:false,poolDetails:null,chart:null,favorites:new Set(),timer:null,searchTimer:null,stamp:0,metadata:Object.create(null),metadataRetryAt:0};
try{const settings=JSON.parse(localStorage.getItem('netnapzDexRadar')||'{}');if(Array.isArray(settings.favorites))state.favorites=new Set(settings.favorites.filter(x=>typeof x==='string'&&x.length<180).slice(0,250));if(CHAINS[settings.chain])state.chain=settings.chain;if([0,10000,50000,100000,1000000].includes(settings.minLiquidity))state.minLiquidity=settings.minLiquidity}catch{}
function save(){try{localStorage.setItem('netnapzDexRadar',JSON.stringify({chain:state.chain,minLiquidity:state.minLiquidity,favorites:[...state.favorites]}))}catch{}}
function toNumber(x){const n=Number(x);return Number.isFinite(n)?n:null}
function amount(n){if(n==null)return '—';const x=Number(n);if(!Number.isFinite(x))return '—';if(Math.abs(x)>=1e9)return '$'+(x/1e9).toFixed(2)+'B';if(Math.abs(x)>=1e6)return '$'+(x/1e6).toFixed(2)+'M';if(Math.abs(x)>=1e3)return '$'+(x/1e3).toFixed(1)+'K';return '$'+x.toLocaleString('en-US',{maximumFractionDigits:2})}
function priceText(n){const x=Number(n);if(!Number.isFinite(x)||x<=0)return '—';return '$'+x.toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:x<.000001?10:x<.001?8:x<1?6:3})}
function pct(n){const x=toNumber(n);return x==null?'—':(x>0?'+':'')+x.toFixed(2)+'%'}
function deltaClass(n){return n==null?'dim':Number(n)>0?'up':Number(n)<0?'down':'dim'}
function shortAddr(s){s=String(s||'');return s.length>19?s.slice(0,8)+'…'+s.slice(-7):s}
function age(ts){if(!ts)return '—';const ms=Date.parse(ts);if(!Number.isFinite(ms))return '—';const diff=Math.max(0,Date.now()-ms);return diff<3600000?Math.max(1,Math.floor(diff/60000))+'m':diff<86400000?Math.floor(diff/3600000)+'h':diff<2592000000?Math.floor(diff/86400000)+'d':Math.floor(diff/2592000000)+'mo'}
function since(ts){if(!ts)return '—';const n=Date.parse(ts);return Number.isFinite(n)?new Date(n).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'}):'—'}
function tokensOf(raw){return Array.isArray(raw?.tokens)?raw.tokens:[]}
function normalise(raw,chain){
 const tokens=tokensOf(raw),stable=['USDC','USDT','DAI','USD1','USDS','USDE'];
 const mintId=t=>String(t?.id||t?.address||t?.token_address||'');
 const metaOf=t=>state.metadata[mintId(t)]||KNOWN_TOKENS[mintId(t)]||t||{};
 const first=tokens.find(t=>!stable.includes(String(metaOf(t).symbol||'').toUpperCase()))||tokens[0]||{};
 const second=tokens.find(t=>t!==first)||tokens[1]||{};
 const mint=mintId(first),quoteMint=mintId(second);
 const pool=String(raw.id||raw.pool_address||raw.address||'');
 if(!pool)return null;
 const symbol=String(metaOf(first).symbol||shortAddr(mint)||'Unknown').slice(0,22);
 const quote=String(metaOf(second).symbol||shortAddr(quoteMint)||'Quote').slice(0,22);
 return {id:pool,chain:raw.chain||raw.network||chain,market:symbol+'/'+quote,symbol,quote,name:String(metaOf(first).name||symbol).slice(0,65),verified:metaOf(first).isVerified===true,
  mint,dex:String(raw.dex_name||raw.dex_id||'DEX').slice(0,52),price:toNumber(raw.price_usd),change5:toNumber(raw.price_change_percentage_5m),change1:toNumber(raw.price_change_percentage_1h),change24:toNumber(raw.price_change_percentage_24h),
  volume:toNumber(raw.volume_usd_24h),liquidity:toNumber(raw.liquidity_usd),transactions:toNumber(raw.transactions_24h??raw.txns_24h),
  created:raw.created_at||null,original:raw};
}
function keyFor(p){return p.chain+':'+p.id}
function toast(msg){const e=$('toast');e.textContent=msg;e.hidden=false;clearTimeout(window.__radarToast);window.__radarToast=setTimeout(()=>e.hidden=true,3900)}
function apiUrl(params){return '/api/market?'+new URLSearchParams(params)}
async function getData(params){const ac=new AbortController(),timer=setTimeout(()=>ac.abort(),15000);try{
 const r=await fetch(apiUrl(params),{signal:ac.signal,cache:'no-store'});
 const data=await r.json();if(!r.ok)throw Error(data.error||'Market service '+r.status);
 return data;
 }finally{clearTimeout(timer)}}
function displayStatus(text,good=true){$('network-status').textContent=text;document.querySelector('.status-small i').style.background=good?'var(--green)':'var(--red)'}
function setStats(items){
 $('stat-pools').textContent=items.length.toLocaleString();
 $('stat-volume').textContent=items.length?amount(items.reduce((sum,x)=>sum+(x.volume||0),0)):'—';
 $('stat-liquidity').textContent=items.length?amount(items.reduce((sum,x)=>sum+(x.liquidity||0),0)):'—';
 const up=items.filter(x=>x.change24!=null).sort((a,b)=>b.change24-a.change24)[0];
 $('stat-mover').textContent=up?pct(up.change24):'—';$('stat-mover').className=up?deltaClass(up.change24):'';
 $('stat-mover-name').textContent=up?up.market:'Based on the visible pools';
}
function availablePools(){
 let items=state.pools.filter(x=>x.liquidity==null?state.minLiquidity===0:x.liquidity>=state.minLiquidity);
 if(state.view==='watchlist'||state.page==='watchlist')items=items.filter(x=>state.favorites.has(keyFor(x)));
 if(state.view==='pump')items=items.filter(x=>/pump/i.test(x.dex));
 const search=state.query.trim().toLowerCase();
 if(search)items=items.filter(x=>[x.market,x.name,x.mint,x.id,x.dex].some(s=>String(s).toLowerCase().includes(search)));
 if(state.view==='trending')items.sort((a,b)=>(b.change1??-99999)-(a.change1??-99999));
 return items;
}
function renderTable(){
 const list=availablePools();
 setStats(list);$('result-count').textContent=list.length+' pools shown · '+CHAINS[state.chain]+(state.minLiquidity?' · min '+amount(state.minLiquidity)+' liquidity':'');
 const body=$('markets-body');
 if(!list.length){
  body.innerHTML='<tr><td class="loading-cell" colspan="10">'+(state.status==='error'?'Data unavailable. Use Refresh to retry.':'No matching pools in this snapshot. Try lowering the liquidity filter, switching networks, or changing your search.')+'</td></tr>';
  return;
 }
 body.innerHTML=list.map((p,i)=>{
  const saved=state.favorites.has(keyFor(p));
  return '<tr data-pool-index="'+i+'" class="'+(state.selectedId===keyFor(p)?'selected':'')+'"><td>'+(i+1)+'</td>'+
   '<td><div class="pair-name"><div class="token-icon">'+escape(p.symbol.slice(0,1))+'</div><div class="pair-label"><strong>'+escape(p.market)+'</strong><small>'+escape(p.dex)+' · '+escape(shortAddr(p.id))+'</small></div></div></td>'+
   '<td class="price-number">'+priceText(p.price)+'</td><td class="'+deltaClass(p.change5)+'">'+pct(p.change5)+'</td><td class="'+deltaClass(p.change1)+'">'+pct(p.change1)+'</td><td class="'+deltaClass(p.change24)+'">'+pct(p.change24)+'</td>'+
   '<td>'+amount(p.volume)+'</td><td>'+amount(p.liquidity)+'</td><td>'+age(p.created)+'</td><td><button class="save-btn '+(saved?'saved':'')+'" data-watch-index="'+i+'" title="'+(saved?'Remove from watchlist':'Add to watchlist')+'" aria-label="'+(saved?'Remove':'Add')+' '+escape(p.market)+' to watchlist">'+(saved?'★':'☆')+'</button></td></tr>';
 }).join('');
 body.querySelectorAll('tr[data-pool-index]').forEach(row=>row.onclick=()=>{
  const p=list[Number(row.dataset.poolIndex)];
  if(p)selectPool(p);
 });
 body.querySelectorAll('[data-watch-index]').forEach(button=>button.onclick=e=>{
  e.preventDefault();e.stopPropagation();const p=list[Number(button.dataset.watchIndex)];if(!p)return;
  const id=keyFor(p);if(state.favorites.has(id))state.favorites.delete(id);else state.favorites.add(id);
  save();updateWatchCount();renderTable();toast(state.favorites.has(id)?'Added '+p.market+' to watchlist':'Removed '+p.market+' from watchlist');
 });
}
function updateWatchCount(){$('watch-count').textContent=state.favorites.size}
async function enrichSolanaTokens(request,chain){
 if(chain!=='solana'||Date.now()<state.metadataRetryAt)return;
 const ids=[...new Set(state.pools.flatMap(p=>tokensOf(p.original).map(t=>String(t.id||t.address||''))))]
 .filter(id=>/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(id)&&!state.metadata[id]&&!KNOWN_TOKENS[id]).slice(0,90);
 if(!ids.length)return;
 try{
  const response=await getData({chain,type:'metadata',mints:ids.join(',')});
  if(request!==state.stamp||chain!==state.chain)return;
  if(Array.isArray(response.data)){
   for(const token of response.data){
    const id=String(token.id||'');
    if(!ids.includes(id)||!token.symbol)continue;
    state.metadata[id]={symbol:String(token.symbol).slice(0,22),name:String(token.name||token.symbol).slice(0,75),isVerified:token.isVerified===true};
   }
   state.pools=state.pools.map(p=>normalise(p.original,chain));
   const selected=state.pools.find(p=>keyFor(p)===state.selectedId);
   if(selected){state.selected=selected;renderDetail(selected,{keepChart:true})}
   renderTable();
  }
 }catch(e){state.metadataRetryAt=Date.now()+180000}
}
async function loadPools({silent=false}={}){
 if(state.loading&&silent)return;
 const chain=state.chain,view=state.view,request=++state.stamp;state.loading=true;state.status='loading';
 if(!silent){$('markets-body').innerHTML='<tr><td colspan="10" class="loading-cell"><span class="loading-orbit"></span>Loading '+escape(CHAINS[chain])+' pool data…</td></tr>'}
 displayStatus('Updating pools');
 $('refresh').disabled=true;
 try{
  const result=await getData({chain,type:'list',view:view==='watchlist'?'volume':view});
  if(request!==state.stamp||chain!==state.chain)return;
  const values=Array.isArray(result.data?.results)?result.data.results:Array.isArray(result.data?.pools)?result.data.pools:Array.isArray(result.data)?result.data:[];
  state.pools=values.map(p=>normalise(p,chain)).filter(Boolean);
  if(chain==='solana')void enrichSolanaTokens(request,chain);
  state.asOf=result.asOf;state.status='ok';displayStatus('Pools available');
  $('updated').textContent='Updated '+since(result.asOf)+' · Auto refresh 45s';
  renderTable();
  if(state.selectedId){
   const found=state.pools.find(p=>keyFor(p)===state.selectedId);
   if(found){state.selected=found;renderDetail(found,{keepChart:true})}
  }
 }catch(e){
  if(request!==state.stamp)return;
  state.status='error';displayStatus('Data delayed',false);
  $('updated').textContent='Provider unavailable · try Refresh';
  if(!silent||!state.pools.length){state.pools=[];renderTable()}
  toast(String(e?.message||e).slice(0,160));
 }finally{if(request===state.stamp){state.loading=false;$('refresh').disabled=false}}
}
function selectPool(p){
 state.selected=p;state.selectedId=keyFor(p);state.chart=null;renderDetail(p);
 renderTable();
 $('detail-panel').classList.add('is-open');loadChart();
}
function renderDetail(p,{keepChart=false}={}){
 if(!p)return;
 const link=state.chain==='solana'?'https://solscan.io/account/'+encodeURIComponent(p.id):state.chain==='base'?'https://basescan.org/address/'+encodeURIComponent(p.id):state.chain==='arbitrum'?'https://arbiscan.io/address/'+encodeURIComponent(p.id):state.chain==='ethereum'?'https://etherscan.io/address/'+encodeURIComponent(p.id):state.chain==='bsc'?'https://bscscan.com/address/'+encodeURIComponent(p.id):'https://polygonscan.com/address/'+encodeURIComponent(p.id);
 const trade=state.chain==='solana'?BASE:state.chain==='bsc'?'https://pancakeswap.finance/swap':'https://app.uniswap.org/swap';
 $('pool-panel-content').innerHTML='<div class="pool-detail">'+
  '<div class="detail-pair-head"><div class="token-icon detail-symbol">'+escape(p.symbol.slice(0,1))+'</div><div><h3>'+escape(p.market)+'</h3><small>'+escape(CHAINS[state.chain])+' · '+escape(p.dex)+'</small></div></div>'+
  '<div class="detail-price">'+priceText(p.price)+'</div><div class="detail-price-label">POOL USD PRICE · PROVIDER ESTIMATE</div>'+
  '<span class="detail-change '+deltaClass(p.change24)+'">'+pct(p.change24)+' / 24h</span>'+
  '<div class="chart-card"><div class="chart-top"><strong>POOL PRICE CHART</strong><select class="chart-select" id="chart-interval" aria-label="Chart timeframe"><option value="1h" '+(state.interval==='1h'?'selected':'')+'>1H</option><option value="6h" '+(state.interval==='6h'?'selected':'')+'>6H</option><option value="12h" '+(state.interval==='12h'?'selected':'')+'>12H</option><option value="24h" '+(state.interval==='24h'?'selected':'')+'>24H</option></select></div><canvas id="pool-chart" width="600" height="350" aria-label="Pool OHLC chart"></canvas><div class="chart-caption" id="chart-status">Loading actual pool candles…</div></div>'+
  '<div class="detail-tiles"><div class="detail-tile"><small>24H VOLUME</small><strong>'+amount(p.volume)+'</strong></div><div class="detail-tile"><small>LIQUIDITY</small><strong>'+amount(p.liquidity)+'</strong></div><div class="detail-tile"><small>24H TRANSACTIONS</small><strong>'+(p.transactions==null?'—':p.transactions.toLocaleString())+'</strong></div><div class="detail-tile"><small>POOL AGE</small><strong>'+age(p.created)+'</strong></div></div>'+
  '<div class="detail-token"><label>'+escape(state.chain==='solana'?'TOKEN MINT ADDRESS':'TOKEN CONTRACT ADDRESS')+'</label><div class="address-field"><code id="detail-mint">'+escape(p.mint||'Unavailable')+'</code><button id="copy-mint" '+(p.mint?'':'disabled')+'>Copy</button></div></div>'+
  '<p class="detail-risk"><strong>Check before trading:</strong> Token names can be copied, liquidity can disappear and pool stats are not a security audit. Always verify the mint address and swap quote, fees and price impact.</p>'+
  '<div class="trade-actions"><button class="btn trade-buy" id="buy-pool" '+(p.mint?'':'disabled')+'>BUY ↗</button><button class="btn trade-sell" id="sell-pool" '+(p.mint?'':'disabled')+'>SELL ↗</button></div>'+
  '<div class="detail-links"><a href="'+escape(link)+'" target="_blank" rel="noopener noreferrer">View on block explorer ↗</a><a href="'+escape(trade)+'" target="_blank" rel="noopener noreferrer">Open swap provider ↗</a></div>'+
  '<p class="chart-caption" style="margin-top:15px">Buy / Sell opens '+escape(state.chain==='solana'?'Jupiter':state.chain==='bsc'?'PancakeSwap':'Uniswap')+' externally. No orders execute on NetNapz Radar in this release.</p>'+
  '</div>';
 $('chart-interval').onchange=e=>{state.interval=e.target.value;state.chart=null;loadChart()};
 $('copy-mint').onclick=()=>copyText(p.mint,'Token address copied');
 $('buy-pool').onclick=()=>openSwap(p,'buy',trade);
 $('sell-pool').onclick=()=>openSwap(p,'sell',trade);
 if(keepChart&&state.chart){drawChart(state.chart)}else chartPlaceholder('Loading pool candles…');
}
function chartPlaceholder(text){
 const canvas=$('pool-chart');if(!canvas)return;const rect=canvas.getBoundingClientRect(),w=Math.max(250,Math.round(rect.width)),h=220;
 canvas.width=w*devicePixelRatio;canvas.height=h*devicePixelRatio;const ctx=canvas.getContext('2d');if(!ctx)return;ctx.scale(devicePixelRatio,devicePixelRatio);
 ctx.fillStyle='#101c22';ctx.fillRect(0,0,w,h);ctx.fillStyle='#78938c';ctx.font='12px DM Sans';ctx.textAlign='center';ctx.fillText(text,w/2,h/2);
}
async function loadChart(){
 const p=state.selected,interval=state.interval;if(!p)return;
 const id=keyFor(p);const status=$('chart-status');if(status)status.textContent='Loading '+interval+' candles from DexPaprika…';
 try{
  const response=await getData({type:'chart',chain:state.chain,pool:p.id,interval});
  if(state.selectedId!==id||state.interval!==interval)return;
  let data=response.data;
  if(!Array.isArray(data))data=Array.isArray(data?.data)?data.data:Array.isArray(data?.ohlcv)?data.ohlcv:Array.isArray(data?.results)?data.results:[];
  const bars=data.map(x=>({
   time:Date.parse(x.time_open||x.timestamp||x.time),o:toNumber(x.open),h:toNumber(x.high),l:toNumber(x.low),c:toNumber(x.close),v:toNumber(x.volume)||0
  })).filter(x=>Number.isFinite(x.time)&&x.o!=null&&x.h!=null&&x.l!=null&&x.c!=null&&x.h>=x.l&&x.o>0&&x.c>0).sort((a,b)=>a.time-b.time);
  if(!bars.length)throw Error('No OHLC data available for this pool/interval');
  state.chart=bars;drawChart(bars);
  const caption=$('chart-status');if(caption)caption.textContent=bars.length+' actual '+interval+' candles · Pool price ratio, not a guaranteed USD quote';
 }catch(e){
  if(state.selectedId!==id)return;
  state.chart=null;chartPlaceholder('Chart not available');
  const caption=$('chart-status');if(caption)caption.textContent='Candles unavailable: '+String(e?.message||e).slice(0,130);
 }
}
function drawChart(bars){
 const canvas=$('pool-chart');if(!canvas||!bars?.length)return;
 const w=Math.max(240,Math.round(canvas.getBoundingClientRect().width)),h=220,scale=Math.min(window.devicePixelRatio||1,2);
 canvas.width=Math.floor(w*scale);canvas.height=Math.floor(h*scale);const ctx=canvas.getContext('2d');if(!ctx)return;ctx.scale(scale,scale);
 const left=9,right=8,top=20,bottom=27,plotH=h-top-bottom,plotW=w-left-right;
 const lows=bars.map(x=>x.l),highs=bars.map(x=>x.h);
 let min=Math.min(...lows),max=Math.max(...highs);const diff=max-min||Math.max(.00000001,max*.02);min-=diff*.06;max+=diff*.06;
 const y=v=>top+(max-v)/(max-min)*plotH;
 ctx.fillStyle='#101b22';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#264039';ctx.lineWidth=.6;
 ctx.font='9px DM Sans';ctx.fillStyle='#6e8d88';ctx.textAlign='left';
 for(let i=0;i<=4;i++){const yy=top+i*plotH/4;ctx.beginPath();ctx.moveTo(left,yy);ctx.lineTo(w-right,yy);ctx.stroke();ctx.fillText((max-i*(max-min)/4).toPrecision(4),left+3,yy-3)}
 const spacing=plotW/bars.length,body=Math.max(1,Math.min(9,spacing*.58));
 for(let i=0;i<bars.length;i++){
  const b=bars[i],x=left+spacing*(i+.5),up=b.c>=b.o;
  ctx.strokeStyle=up?'#49de99':'#ff607a';ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(x,y(b.h));ctx.lineTo(x,y(b.l));ctx.stroke();
  const yt=y(Math.max(b.o,b.c)),yb=y(Math.min(b.o,b.c));
  ctx.fillRect(x-body/2,yt,body,Math.max(1,yb-yt));
 }
 ctx.fillStyle='#78948d';ctx.textAlign='left';ctx.fillText(new Date(bars[0].time).toLocaleDateString([], {month:'short',day:'numeric'}),left,h-8);
 ctx.textAlign='right';ctx.fillText(new Date(bars[bars.length-1].time).toLocaleDateString([], {month:'short',day:'numeric'}),w-right,h-8);
}
function copyText(text,label){
 if(!text){toast('No token address available');return}
 if(navigator.clipboard?.writeText){navigator.clipboard.writeText(text).then(()=>toast(label)).catch(()=>toast('Copy address manually: '+shortAddr(text)))}else toast('Copy the token address from the detail panel');
}
function openSwap(p,side,url){
 if(!p.mint){toast('This pool has no verified token mint address');return}
 const w=window.open(url,'_blank','noopener,noreferrer');if(!w)toast('Popup blocked; open the swap provider link below');
 if(navigator.clipboard?.writeText)navigator.clipboard.writeText(p.mint).then(()=>toast('Token mint copied. Paste it into '+(state.chain==='solana'?'Jupiter':'the swap app')+' and check the '+side+' quote.')).catch(()=>toast('Copy the token mint before trading.'));
 else toast('Copy the token mint from the pool details before trading.');
}
function setPage(page){
 state.page=page;document.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page===page));
 $('breadcrumb').textContent=page==='new'?'New pairs':page==='trending'?'Trending':page==='watchlist'?'Watchlist':page==='launch'?'Launchpad':'Discover';
 const isLaunch=page==='launch';$('hero').hidden=isLaunch;document.querySelector('.metric-row').hidden=isLaunch;
 $('scanner-section').hidden=isLaunch;$('launch-section').hidden=!isLaunch;
 if(page==='new')state.view='new';else if(page==='trending')state.view='trending';else if(page==='watchlist')state.view='watchlist';else if(page==='discover'&&state.view==='watchlist')state.view='volume';
 $('section-title').textContent=page==='new'?'Fresh / New pools':page==='trending'?'Trending / Gainers':page==='watchlist'?'Your / Watchlist':'Discover / Markets';
 document.querySelectorAll('[data-view]').forEach(el=>el.classList.toggle('active',el.dataset.view===state.view));
 $('sidebar').classList.remove('is-open');
 if(!isLaunch){renderTable();if(!state.pools.length||page==='new'||page==='trending')loadPools()}
}
function setChain(chain){
 if(!CHAINS[chain]||chain===state.chain)return;
 state.chain=chain;state.selectedId='';state.selected=null;state.chart=null;state.pools=[];state.stamp++;
 state.view=state.page==='new'?'new':state.page==='trending'?'trending':state.page==='watchlist'?'watchlist':'volume';
 document.querySelectorAll('[data-chain]').forEach(b=>b.classList.toggle('selected',b.dataset.chain===chain));
 $('pool-panel-content').innerHTML='<div class="detail-placeholder"><div class="placeholder-orbit">◈</div><h3>Inspect any pool</h3><p>Select a market to view its on-chain liquidity, chart and token address.</p></div>';
 $('detail-panel').classList.remove('is-open');save();renderTable();loadPools();
}
function setView(view){
 if(!['volume','new','trending','liquidity','pump'].includes(view))return;
 if(view==='pump'&&state.chain!=='solana'){toast('Pump ecosystem view is Solana-only');setChain('solana')}
 state.page='discover';state.view=view;document.querySelectorAll('[data-page]').forEach(el=>el.classList.toggle('active',el.dataset.page==='discover'));
 document.querySelectorAll('[data-view]').forEach(el=>el.classList.toggle('active',el.dataset.view===view));
 $('breadcrumb').textContent='Discover';$('section-title').textContent=view==='new'?'Fresh / New pairs':view==='trending'?'Trending / Gainers':view==='pump'?'Pump / Indexed pools':view==='liquidity'?'Deep / Liquidity':'Discover / Markets';
 loadPools();
}
function init(){
 document.querySelectorAll('[data-chain]').forEach(b=>{b.classList.toggle('selected',b.dataset.chain===state.chain);b.onclick=()=>setChain(b.dataset.chain)});
 document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>setPage(b.dataset.page));
 document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
 $('hero-discover').onclick=()=>document.getElementById('scanner-section').scrollIntoView({behavior:'smooth'});
 $('hero-launch').onclick=()=>window.open(PUMP,'_blank','noopener,noreferrer');
 $('mobile-nav').onclick=()=>$('sidebar').classList.toggle('is-open');
 $('close-detail').onclick=()=>$('detail-panel').classList.remove('is-open');
 $('refresh').onclick=()=>loadPools();
 $('min-liquidity').value=String(state.minLiquidity);$('min-liquidity').onchange=e=>{state.minLiquidity=Number(e.target.value);save();renderTable()};
 $('search').addEventListener('input',e=>{state.query=e.target.value;clearTimeout(state.searchTimer);state.searchTimer=setTimeout(renderTable,120)});
 $('search').addEventListener('keydown',e=>{if(e.key==='Escape'){$('search').value='';state.query='';renderTable()}});
 window.addEventListener('keydown',e=>{if(e.key==='/'&&document.activeElement?.tagName!=='INPUT'&&document.activeElement?.tagName!=='TEXTAREA'){e.preventDefault();$('search').focus()}});
 $('copy-launch').onclick=()=>{
  const name=$('launch-name').value.trim(),symbol=$('launch-symbol').value.trim().toUpperCase(),description=$('launch-description').value.trim();
  if(!name||!symbol){toast('Enter a token name and symbol first');return}
  copyText('Token name: '+name+'\nTicker: '+symbol+'\nDescription: '+description,'Launch details copied. Continue on the official Pump.fun page.');
 };
 updateWatchCount();setPage('discover');loadPools();
 window.addEventListener('resize',()=>{if(state.chart)drawChart(state.chart)});
 state.timer=setInterval(()=>{if(!state.loading&&state.page!=='launch'&&document.visibilityState==='visible')loadPools({silent:true})},45000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();