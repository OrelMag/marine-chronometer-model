// The Wempe's numbers for Node tools: its page's own scripts run in a vm context, as the page runs them, with what they need from the browser stubbed (the Wempe model,
// marine-chronometer-source/wempe/). Loads js/dims.js (WD), js/escapement.js (WESC: the layout, WESC.SET the escapement's settings for makeEsc), the shared
// ../shared/escapement.js (makeEsc) and js/escphys.js (WPHYS: the drive, the balance and the escapement in time). Only their constants and pure functions run: every
// builder (WESC.build and the like) needs three.js and the page's helpers and is never called here. THREE and KIT are empty objects; TAU, D2R, clamp, smooth are core.js's.
//   const W=require('./wempe_load.js')();   W.WD, W.WESC, W.WPHYS, W.makeEsc
// With {train:true} it also loads js/train.js (WTRAIN: the arbors' tables, teeth(), the sheets' tooth forms) and the Hamilton's core.js gearOutline it draws its pinions
// with (cut out of core.js, as tools/gearing.js does); xf(file, source) may rewrite a file's source first (gearing.js samples the outlines finer).
//   const W=require('./wempe_load.js')({train:true});   W.WTRAIN
// With {rev:'6mx'} (or the environment's MC_WREV=6mx, which a tool's child processes inherit) WPHYS is the Soviet 6MX's: WESC.SET takes its bodies, WESC.SET6, before
// js/escphys.js builds the escapement, so any Wempe tool runs as the page runs the 6MX (WPHYS.rev('6mx')): wempe_essaydata.js's 6MX tables, wempe_6mx.js.
// With {rev:'build'} (MC_WREV=build) it is the 1950s build's (WESC.BUILD; build40, WESC.BUILD40, the 1940s build's: the drive WESC.KB times 05 06_20's, the gold spring thinned at its bend, WESC.GBEND, for the frames).
const fs=require('fs'),path=require('path'),vm=require('vm');
const WE=path.join(__dirname,'..','..','wempe'),SH=path.join(__dirname,'..','..','shared');
const FILES=[path.join(WE,'js','dims.js'),path.join(WE,'js','escapement.js'),path.join(SH,'escapement.js'),path.join(WE,'js','escphys.js')];
function load(o={}){
  const ctx=vm.createContext({Math,console,Object,Array,Number,Float32Array,Float64Array,Map,Set,JSON,Error,Infinity,NaN,isNaN,isFinite,
    THREE:{},KIT:{},TAU:Math.PI*2,D2R:Math.PI/180,clamp:(x,a,b)=>Math.max(a,Math.min(b,x)),smooth:t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);}});
  const xf=o.xf||((f,s)=>s),run=f=>vm.runInContext(xf(f,fs.readFileSync(f,'utf8')),ctx,{filename:f});
  const rev=o.rev||process.env.MC_WREV||'last';
  for(const f of FILES){if(f===FILES[3]&&rev==='6mx')vm.runInContext('WESC.SET={...WESC.SET,...WESC.SET6};',ctx);if(f===FILES[3]&&(rev==='build'||rev==='build40')){const B=rev==='build'?'WESC.BUILD':'WESC.BUILD40';vm.runInContext(`WESC.SET={...WESC.SET,...${B}.set};WESC.KB=${B}.k;WESC.GBEND=${B}.bend;WESC.BSEL=${B};`,ctx);}run(f);}
  if(o.train){const core=path.join(__dirname,'..','js','core.js'),src=/function gearOutline\(n,m,o=\{\}\)\{[\s\S]*?\n  return\{xy,ro,ri\};\}/.exec(fs.readFileSync(core,'utf8'));
    if(!src)throw Error('gearOutline not found in core.js');vm.runInContext(xf(core,src[0]),ctx,{filename:core});run(path.join(WE,'js','train.js'));}
  return vm.runInContext('({WD,WESC,makeEsc,WPHYS'+(o.train?',WTRAIN,gearOutline':'')+'})',ctx);}   /* top-level const and function declarations of classic scripts share the context's scope */
module.exports=load;
