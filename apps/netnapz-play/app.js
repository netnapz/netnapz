(() => {
"use strict";
const one=s=>document.querySelector(s);
const state={product:"sportsbook",config:null};
one("#year").textContent=String(new Date().getFullYear());
const textFor={
 sportsbook:["Sportsbook experience","Preparing the sportsbook connection.","When the licensed operator approves NetNapz and supplies the sportsbook launch URL, its hosted sportsbook can load here. No bets or deposits are processed by this site."],
 casino:["Casino experience","Preparing the casino connection.","When the licensed operator approves NetNapz and supplies the casino launch URL, its hosted games can load here. No deposits or payouts are processed by this site."]
};
function urlIsApproved(raw,origin){
 try{if(!raw||!origin)return false;
  const u=new URL(raw),o=new URL(origin);
  return u.protocol==="https:" && o.protocol==="https:" && u.origin===o.origin && !u.username && !u.password && !o.username && !o.password;
 }catch{return false;}
}
function approved(c){return !!(c && c.enabled===true && c.operatorApproved===true && c.jurisdiction==="GB" &&
 typeof c.operatorName==="string" && c.operatorName.length>1 && /^\d{4,8}$/.test(String(c.ukgcAccountNumber || "")) &&
 ["iframe","redirect"].includes(c.mode));}
function render(){
 document.querySelectorAll("[data-product]").forEach(b=>{let active=b.dataset.product===state.product;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));});
 let [title,empty,detail]=textFor[state.product];
 one("#product-title").textContent=title;one("#placeholder-title").textContent=empty;one("#placeholder-desc").textContent=detail;
 const c=state.config,raw=c?.launchUrls?.[state.product];
 const permitted=approved(c)&&urlIsApproved(raw,c.operatorOrigin);
 const frame=one("#operator-frame"),fallback=one("#external-fallback");
 frame.removeAttribute("src");frame.hidden=true;one("#redirect").hidden=true;one("#placeholder").hidden=false;fallback.hidden=true;
 one("#connection-badge").textContent="Awaiting approved connection";
 if(permitted){one("#placeholder").hidden=true;fallback.href=raw;fallback.hidden=false;
   one("#connection-badge").textContent="Hosted by "+c.operatorName;
   if(c.mode==="redirect"){one("#redirect").hidden=false;one("#redirect-link").href=raw;}
   else {frame.src=raw;frame.hidden=false;}
 }
}
document.querySelectorAll("[data-product]").forEach(b=>b.addEventListener("click",()=>{state.product=b.dataset.product;render();}));
async function load(){
 try{const response=await fetch("./operator.json",{cache:"no-store"});if(!response.ok)throw new Error("Configuration not found");
 state.config=await response.json();const c=state.config;
 if(approved(c) && Object.values(c.launchUrls||{}).some(v=>urlIsApproved(v,c.operatorOrigin))){
  one("#banner-title").textContent="Operator integration configured";
  one("#banner-message").textContent="Gambling facilities are operated by "+c.operatorName+". 18+ only.";
  one("#operator-badge").textContent="Operator: "+c.operatorName;
 }
 }catch(e){console.info("No approved operator configuration:",e instanceof Error?e.message:"unknown");}
 render();
}load();
})();