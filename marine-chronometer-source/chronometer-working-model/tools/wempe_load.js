// The Wempe's numbers for Node tools: its page's own scripts run in a vm context, as the page runs them, with what they need from the browser stubbed (the Wempe model,
// marine-chronometer-source/wempe/). Loads js/dims.js (WD), js/escapement.js (WESC: the layout, WESC.SET the escapement's settings for makeEsc), the shared
// ../shared/escapement.js (makeEsc) and js/escphys.js (WPHYS: the drive, the balance and the escapement in time). Only their constants and pure functions run: every
// builder (WESC.build and the like) needs three.js and the page's helpers and is never called here. THREE and KIT are empty objects; TAU, D2R, clamp, smooth are core.js's.
//   const W=require('./wempe_load.js')();   W.WD, W.WESC, W.WPHYS, W.makeEsc
const fs=require('fs'),path=require('path'),vm=require('vm');
const WE=path.join(__dirname,'..','..','wempe'),SH=path.join(__dirname,'..','..','shared');
const FILES=[path.join(WE,'js','dims.js'),path.join(WE,'js','escapement.js'),path.join(SH,'escapement.js'),path.join(WE,'js','escphys.js')];
function load(){
  const ctx=vm.createContext({Math,console,Object,Array,Number,Float32Array,Float64Array,Map,Set,JSON,Error,Infinity,NaN,isNaN,isFinite,
    THREE:{},KIT:{},TAU:Math.PI*2,D2R:Math.PI/180,clamp:(x,a,b)=>Math.max(a,Math.min(b,x)),smooth:t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);}});
  for(const f of FILES)vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
  return vm.runInContext('({WD,WESC,makeEsc,WPHYS})',ctx);}   /* top-level const and function declarations of classic scripts share the context's scope */
module.exports=load;
