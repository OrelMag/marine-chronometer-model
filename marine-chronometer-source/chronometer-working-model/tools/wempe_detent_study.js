// The Wempe's detent studied as a whole for the build (the user's choice, 19 October 2026: "study them together"): the depth of lock's window a maker must set the banking
// in, against the gold spring's thickness, the preload and the discharge stone's reach, at the build's drive (1.26 times 05 06_20's: the 1958 MX repair book's mainspring
// torque) and the drawings'. Needs only Node.js:
//   node wempe_detent_study.js [--json OUT]   (about 5 minutes on 12 processes, MC_PROCS; reports, never fails)
// The window (wempe_tolerances.js's method): its top the deepest lock the discharge stone still unlocks (makeEsc rebuilt with dL, the stone lifted at most as far as the
// discharge stone carries the gold spring's tip), its floor twice the lift a held tooth's stone rings to (wempe_tripping.js's frame run at that setting and drive: the
// margin of half the depth of lock, tripping.js's). Each setting's swing is makeEsc's; dynamics.js --model wempe is run beside the frame, since past about 0.85 g of preload
// its falling stone catches the escaping tooth's back (the physics pass, README) and parts from makeEsc: a setting where they part by over 1° is marked.
// The settings: the gold spring 05 04 01-2's 0.15 (sure), 0.10, and Belyakov's 0.06 (1957, Table 3: Lange's MX at its bend), taken the whole length (EI as t³, its mass kept:
// thinned only at the bend it is stiffer than this); the preload 0.8 g (the model's estimate), 1.0 and 1.2 g; the discharge stone's reach as drawn and 0.03 and 0.06 mm
// further from the staff (a stone set further out in its roller: escapement.js's rd).
const fs=require('fs'),path=require('path'),{spawn}=require('child_process');
if(!process.argv.includes('--model'))process.argv.push('--model','wempe');
const D=Math.PI/180,f=(x,n=2)=>(+x).toFixed(n);

/* a child: the setting's makeEsc figures (does it run, its swing at drive s, the deepest lock it unlocks) and dynamics.js with MC_ESC's settings beside them */
if(process.argv.includes('--esc')){const s=+process.env.MC_S,W=require('./wempe_load.js')(),S=W.WPHYS.SET,ES=S.ES,o={...S,...JSON.parse(process.env.MC_ESC)},e=W.makeEsc(o,S),out={runs:e.measure().runs,A:e.ampAt(s)/D};
  if(out.runs){const unl=d=>W.makeEsc({...o,dL:d/ES},S).measure().runs,d0=S.dL*ES;let a=d0-0.05,b=d0+0.06;out.deep=null;
    if(unl(a)){for(let i=0;i<16;i++){const q=(a+b)/2;unl(q)?a=q:b=q;}out.deep=a;}
    const DY=require('./dynamics.js'),q=DY.sim({mode:'phys',s,A:out.A,T:6,from:3});out.dyn={A:q.A,rate:q.rate,trips:q.trips,beats:q.beats};}
  process.stdout.write(JSON.stringify(out)+'\n');return;}

const W=require('./wempe_load.js')(),S=W.WPHYS.SET,ES=S.ES;
const GOLD=[0.15,0.10,0.06],PRE=[0.8,1.0,1.2],RDX=[0,0.03,0.06],DRV=[1,1.26];
/* --gold: the gold spring's profile at the build's drive, the reach as drawn: thinned the whole length (0.06-0.09) or only from its bending point (0.06 over 1-4 mm of
   its 11.4, the rest 0.15); makeEsc takes a thinned one as the uniform strip with the same tip stiffness (a cantilever's: the integral of (L - x)² / EI) */
const LG=11.41,tEff=(Lb,t1)=>{const r=(0.15/t1)**3,q=((LG-Lb)**3+r*(LG**3-(LG-Lb)**3))/LG**3;return 0.15*q**(-1/3);};
const GOLDP=[...[0.06,0.07,0.08,0.09].map(t=>({name:`${t} whole`,t,tsT:t,mo:{tsK:(t/0.15)**3}})),...[1,2,3,4].map(Lb=>({name:`0.06 over ${Lb} mm`,t:tEff(Lb,0.06),tsT:tEff(Lb,0.06),mo:{tsBend:[Lb,0.06]}}))];
const cases=[];if(process.argv.includes('--gold'))for(const g of GOLDP)for(const w of [0.8,1.0])cases.push({s:1.26,t:g.t,w,x:0,g:g.name,mo:g.mo,esc:{tsT:g.tsT,W78:w}});else for(const s of (process.env.MC_ONE?[1]:DRV))for(const t of (process.env.MC_ONE?[0.15]:GOLD))for(const w of (process.env.MC_ONE?[0.8]:PRE))for(const x of (process.env.MC_ONE?[0]:RDX))cases.push({s,t,w,x,esc:{tsT:t,W78:w,rd:S.rd+x/ES}});
const kid=(args,env)=>new Promise((res,rej)=>{const p=spawn(process.execPath,args,{cwd:__dirname,env:{...process.env,...env}});let o='';p.stdout.on('data',d=>o+=d);p.stderr.on('data',d=>process.stderr.write(d));
  p.on('close',code=>code?rej(Error(args.join(' ')+' exited '+code)):res(JSON.parse(o.trim().split('\n').pop())));});
/* each setting: its makeEsc figures and dynamics.js in one child, then the frame at its swing in another */
const jobs=cases.map(c=>async()=>{Object.assign(c,await kid(['wempe_detent_study.js','--esc'],{MC_ESC:JSON.stringify(c.esc),MC_S:String(c.s)}));
  if(c.runs&&c.deep!=null)c.frame=await kid(['wempe_tripping.js','--child'],{MC_ESC:JSON.stringify(c.esc),MC_WJOB:JSON.stringify({k:'run',mo:c.mo||{tsK:(c.t/0.15)**3},ro:{s:c.s,A:c.A,T:3,from:1.5}})});});
const N=Math.max(1,Math.min(jobs.length,+process.env.MC_PROCS||12)),t0=Date.now();let next=0;
Promise.all([...Array(N)].map(async()=>{while(next<jobs.length)await jobs[next++]();})).then(()=>{
  const d0=S.dL*ES,rows=[];
  console.log(`The Wempe's detent for the build: the depth of lock's window (drawn ${f(d0,3)} mm) against the gold spring, the preload and the discharge reach (${cases.length} settings, ${f((Date.now()-t0)/1000,0)} s)`);
  console.log('drive  gold   preload  reach   swing   deepest  ring    floor   window   trips  dynamics');
  for(const c of cases){if(!c.runs||c.deep==null){console.log(`${f(c.s,2)}x  ${f(c.t,2)}  ${f(c.w,1)} g  +${f(c.x,2)}  does not run`);continue;}
    const ring=c.frame.maxL*d0,floor=2*ring,win=c.deep-floor,part=Math.abs(c.dyn.A-c.A);
    rows.push({s:c.s,gold:c.g||c.t,pre:c.w,reach:c.x,A:+f(c.A,1),deep:+f(c.deep,4),ring:+f(ring,4),floor:+f(floor,4),window:+f(win,4),trips:c.frame.trips,frameA:c.frame.A,dynA:+f(c.dyn.A,1),dynTrips:c.dyn.trips,parts:part>1});
    console.log(`${f(c.s,2)}x  ${c.g?c.g.padEnd(16):f(c.t,2)}  ${f(c.w,1)} g  +${f(c.x,2)}  ${f(c.A,1).padStart(6)}°  ${f(c.deep,3)}  ${f(ring*1000,0).padStart(4)} µm  ${f(floor,3)}  ${(win>=0?' ':'')}${f(win*1000,0).padStart(4)} µm  ${String(c.frame.trips).padStart(3)}    ${f(c.dyn.A,1)}°${part>1?' parts from makeEsc':''}${c.dyn.trips?' '+c.dyn.trips+' trips':''}`);}
  const ji=process.argv.indexOf('--json');if(ji>0)fs.writeFileSync(process.argv[ji+1],JSON.stringify({made:new Date().toISOString().slice(0,10),d0,rows}));
}).catch(e=>{console.error(e);process.exitCode=1;});
