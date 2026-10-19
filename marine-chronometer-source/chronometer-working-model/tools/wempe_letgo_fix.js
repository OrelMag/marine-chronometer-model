// The Wempe's key let go outright, and what would take the blow (19 October 2026; PLAN-motion-3d.md, "The let-go blow"). wempe_transmission.js finds the key let go with
// the fingers off its paddle throws the fusee, the key and the barrel forward under the chain onto the nearer click: the click wheel's brass tooth (05 06 04-3, Ms 58 spring-hard)
// takes 295 N, 605 MPa against its yield's 300-450, and the clicks and the maintaining ratchet past theirs in motion3d_fe.py. Eased back, the blow is 66 N. This runs that let-go
// (wempe_transmission.js's windRun, its threads) at the worst place (the nearer click 97 % of the way to the next) and half way, eased beside it, with the fixes a maker could make:
//   more clicks, evenly spaced over a tooth (the free run the fusee may take is a tooth over their number);
//   a brake: friction between the click wheel and the maintaining ratchet (a spring washer), which the clicks hold still running, so it costs the train nothing, but which the
//     key works against winding and the fusee running free (its torque a share of the fusee arbor's at 24 h);
//   the click's face cushioned (4 times softer);
//   the click wheel in hardened steel (the same blow against steel's range).
// Prints each case's blow on the click wheel's tooth, its stress (scaled from wempe_strength.js's static line, as wempe_transmission.js scales it), the fusee wheel's teeth,
// the hand's torque winding and the maintaining spring's throw. Reports, never fails.
// Needs only Node.js:   node wempe_letgo_fix.js [--json OUT]   (default ../../wempe/verification/assets/letgo_fix.json, for the Wempe report's section 13)    (about 5-10 minutes: the meshes' tables, then the runs in threads; MC_TR_TABS=FILE keeps the tables)
'use strict';
process.argv.push('--model','wempe');
const fs=require('fs'),path=require('path'),{Worker}=require('worker_threads');
const T=require('./wempe_transmission.js'),D=Math.PI/180,f=(x,d=1)=>Number.isFinite(x)?x.toFixed(d):'-';
const TC=process.env.MC_TR_TABS;
(async()=>{const TB=TC&&fs.existsSync(TC)?JSON.parse(fs.readFileSync(TC,'utf8')):await T.tabs();if(TC&&!fs.existsSync(TC))fs.writeFileSync(TC,JSON.stringify(TB));
  const n24=24/(90/14),Tf=T.fusT(n24);
  /* the static line wempe_transmission.js judges the click wheel's tooth by (wempe_strength.js: the tooth under the click) */
  const so=require('child_process').execFileSync(process.execPath,[path.join(__dirname,'wempe_strength.js')],{cwd:__dirname,maxBuffer:1<<26}).toString().replace(/\r/g,'').split('\n');
  const m=/\)\s+([\d.]+) N.*?\s([\d.]+) MPa/.exec(so.find(x=>x.includes('the click wheel\'s tooth under the click'))),sPerN=+m[2]/+m[1];
  const LIM=Math.max(2,Math.min(12,require('os').cpus().length-2));let run=0;const q=[];
  const next=()=>{while(run<LIM&&q.length){const[o,par,ok,no]=q.shift();run++;const w=new Worker(path.join(__dirname,'wempe_transmission.js'),{workerData:{job:'wind',TB,o,par:{tsl:3e-3,...par}},argv:['--model','wempe']});
    w.on('message',r=>{run--;ok(r);next();});w.on('error',e=>{run--;no(e);next();});}};
  const job=(o,par)=>new Promise((ok,no)=>{q.push([o,par,ok,no]);next();});
  const CASES=[['as drawn: two clicks, no brake',{}],['three clicks',{nck:3}],['four clicks',{nck:4}],['six clicks',{nck:6}],
    ['a brake, a quarter of the fusee\'s torque',{brk:0.25*Tf}],['a brake, half',{brk:0.5*Tf}],['a brake, three quarters',{brk:0.75*Tf}],
    ['four clicks and a brake of half',{nck:4,brk:0.5*Tf}],['the click\'s face cushioned (×0.25)',{kcl:2.5e3}],['four clicks, the face cushioned',{nck:4,kcl:2.5e3}]];
  const R=await Promise.all(CASES.map(([lab,par])=>Promise.all([job({u:0.97,after:0.3},par),job({u:0.5,after:0.3},par),job({u:0.97,after:0.3,ease:0.15},par)]).then(([w,h,e])=>({lab,par,w,h,e}))));
  /* the 3D stress (motion3d_fe.py, as drawn, at its worst load: the viewer's data beside the report) scaled to each case's force, each part linear in its load: the clicks by
     their blow on the click wheel, the maintaining ratchet and detent by the detent's blow on the ratchet, the fusee wheel by its teeth's load */
  const MP=JSON.parse(fs.readFileSync(path.join(__dirname,'../../wempe/verification/assets/motion3d/meta.json'),'utf8')).versions.last.parts;
  const FE={clicks:['maintaining.clicks','Fc'],ratchet:['maintaining.ratchet','Fd'],detent:['maintDetent','Fd'],fw:['fuseeWheel','fw']},per={},lim={};
  for(const[k,[nm]]of Object.entries(FE)){const q=MP[nm],F=+/([\d.]+) N(?!·)/.exec(q.load)[1];per[k]=q.peak/F;lim[k]={mat:q.mat,lim:q.limit};}
  const sts=(w,e)=>({wheel:w.Fc*sPerN,...Object.fromEntries(Object.entries(FE).map(([k,[,f_]])=>[k,w[f_]*per[k]]))});
  const out=[];console.log(`the key let go at 24 h (the fusee arbor's torque ${f(Tf*1e3,0)} mN·m); the click wheel's tooth ${f(sPerN,2)} MPa a newton (wempe_strength.js's static line), brass 300-450, hardened steel 1200-1800`);
  console.log('');console.log(`${'case'.padEnd(46)} ${'free'.padStart(6)}  outright: click  tooth    fusee wheel  spring    detent   half way: click   eased: click  winding: hand`);
  for(const x of R){const s=x.w.Fc*sPerN;
    console.log(`${x.lab.padEnd(46)} ${f(x.w.free/D,2).padStart(5)}°  ${f(x.w.Fc,0).padStart(13)} N ${f(s,0).padStart(5)} MPa ${f(x.w.fw,1).padStart(8)} N  ${f(x.w.sp/D,2).padStart(6)}° ${f(x.w.Fd,0).padStart(5)} N  ${f(x.h.Fc,0).padStart(13)} N  ${f(x.e.Fc,0).padStart(9)} N  ${f(x.w.hand*1e3,0).padStart(9)} mN·m`);
    out.push({st:sts(x.w),stE:sts(x.e),lab:x.lab,par:x.par,free:x.w.free,Fc:x.w.Fc,s,fw:x.w.fw,sp:x.w.sp,Fd:x.w.Fd,halfFd:x.h.Fd,easedFd:x.e.Fd,half:x.h.Fc,eased:x.e.Fc,hand:x.w.hand,stone:x.w.stone,catchE:x.w.catchE});}
  console.log('');console.log(`the stress (MPa) each case leaves, let go outright (and eased), from motion3d_fe.py's at its load: the click wheel's tooth (brass 300-450), the clicks (${lim.clicks.mat} ${lim.clicks.lim.join('-')}), the maintaining ratchet (${lim.ratchet.mat} ${lim.ratchet.lim.join('-')}), the maintaining detent (${lim.detent.mat} ${lim.detent.lim.join('-')}), the fusee wheel's teeth (${lim.fw.mat} ${lim.fw.lim.join('-')})`);
  for(const x of out)console.log(`${x.lab.padEnd(46)} `+['wheel','clicks','ratchet','detent','fw'].map(k=>`${f(x.st[k],0).padStart(5)} (${f(x.stE[k],0).padStart(4)})`).join('  '));
  const J=process.argv.indexOf('--json'),JF=J>0?process.argv[J+1]:path.join(__dirname,'../../wempe/verification/assets/letgo_fix.json');
  fs.writeFileSync(JF,JSON.stringify({Tf,sPerN,per,lim,cases:out},null,1));console.log('wrote',path.relative(process.cwd(),JF));
})().catch(e=>{console.error(e);process.exit(2);});
