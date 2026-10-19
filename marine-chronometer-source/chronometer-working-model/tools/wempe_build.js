// The Wempe built to navigate by: the two builds' own checks (PLAN-wempe-navigation.md; the Wempe README's "The build"). Each build is the drawings as last revised with
// the user's choices of 19 October 2026 (js/escapement.js: BUILD40, the 1940s build, carbon steel at the drawings' drive; BUILD, the 1950s build, Nivaflex 45/5 at 1.26
// times it; both with the gold spring thinned at its bend, the maintaining work, endshake and temperature adjustment as the bench sets them). The drawn version's
// cross-checks between makeEsc, dynamics.js and the tripping frame are calibrated on the drawn detent and stay its own; these are what decide whether a made one works:
//   node wempe_build.js [--write] [--json OUT]   (about 5 minutes, its runs in child processes, MC_PROCS; exits 1 if either build fails a check or tools/wempe_build.json is stale)
// Each build (MC_WREV=build40, build, which wempe_load.js applies and every child inherits):
//   the swing over the whole wind (makeEsc at the fusee's drive each quarter turn): inside the guard band, 180-270°; the sources' 225-270° reported;
//   the depth of lock's window (wempe_detent_study.js's method: the deepest the discharge stone unlocks, and twice the lift a held tooth's stone rings to in the frame):
//     the drawn 0.235 inside it with room for a maker's setting, 50 µm or more;
//   running in time (dynamics.js, 600 beats; the frame as drawn): no tooth past, the detent home before the next tooth;
//   pushed to 300° of swing (the frame): no tooth past; knocks across the plate (the frame): a 3 ms blow of 20 g or more to let a tooth go;
//   wempe_physics.js, wempe_strength.js and wempe_sustaining.js at the build (their exit codes); wempe_errorbudget.js: 8 s or less after 30 days at sea, the masses to ±0.1°.
const fs=require('fs'),path=require('path'),{spawn}=require('child_process'),D=Math.PI/180,f=(x,n=2)=>(+x).toFixed(n);
const REVS=[['build40','the 1940s build: carbon steel at the drawings\' drive'],['build','the 1950s build: Nivaflex 45/5 at 1.26 times the drive']];

/* a child: this build's makeEsc figures and dynamics.js */
if(process.argv.includes('--esc')){const W=require('./wempe_load.js')(),P=W.WPHYS,E=P.ESC,S=P.SET,ES=S.ES,d0=S.dL*ES,ns=[];for(let n=0;n<=P.MF+1e-9;n+=0.25)ns.push(n);
  const A=ns.map(n=>E.ampAt(P.drv(n))/D),unl=d=>W.makeEsc({...S,dL:d/ES},S).measure().runs;let a=d0,b=d0+0.08;for(let i=0;i<16;i++){const m=(a+b)/2;unl(m)?a=m:b=m;}
  process.stdout.write(JSON.stringify({A12:E.A/D,Amin:Math.min(...A),Amax:Math.max(...A),d0,deep:a,lift:Math.max(...E.LI)*E.BL/E.LEN*ES})+'\n');return;}
if(process.argv.includes('--dyn')){process.argv.push('--model','wempe');const q=require('./dynamics.js').sim({mode:'phys',T:300,from:2});
  process.stdout.write(JSON.stringify({A:q.A,beats:q.beats,trips:q.trips,margin:q.margin,home:q.home})+'\n');return;}

const kid=(args,rev,env={},raw=false)=>new Promise((res,rej)=>{const p=spawn(process.execPath,args,{cwd:__dirname,env:{...process.env,MC_WREV:rev,...env}});let o='';p.stdout.on('data',d=>o+=d);
  p.stderr.on('data',d=>{if(!raw)process.stderr.write(d);});p.on('close',code=>raw?res({code,out:o}):code?rej(Error(args.join(' ')+' ('+rev+') exited '+code)):res(JSON.parse(o.trim().split('\n').pop())));});
const R={};for(const[r]of REVS)R[r]={};
const job=(r,k,go)=>async()=>{R[r][k]=await go();};
const jobs=REVS.flatMap(([r])=>[
  job(r,'esc',()=>kid([__filename,'--esc'],r)),job(r,'dyn',()=>kid([__filename,'--dyn'],r)),
  job(r,'run',()=>kid(['wempe_tripping.js','--child'],r,{MC_WJOB:JSON.stringify({k:'run',mo:{},ro:{T:3,from:1.5}})})),
  job(r,'push',()=>kid(['wempe_tripping.js','--child'],r,{MC_WJOB:JSON.stringify({k:'push',A:300})})),
  job(r,'b3',()=>kid(['wempe_tripping.js','--child'],r,{MC_WJOB:JSON.stringify({k:'knock',pre:1,kind:'b3',lo:1,hi:400,rigid:false})})),
  job(r,'b05',()=>kid(['wempe_tripping.js','--child'],r,{MC_WJOB:JSON.stringify({k:'knock',pre:1,kind:'b05',lo:2,hi:400,rigid:false})})),
  /* the preload's floors, as wempe_tripping.js finds the drawn detent's: a held tooth's stone ringing under half the depth of lock, and a 3 ms blow of 20 g let through */
  ...[0.5,0.8].map(m=>job(r,'run'+m,()=>kid(['wempe_tripping.js','--child'],r,{MC_WJOB:JSON.stringify({k:'run',mo:{pre:m},ro:{T:3,from:1.5}})}))),
  ...[0.8,1.2].map(m=>job(r,'b3_'+m,()=>kid(['wempe_tripping.js','--child'],r,{MC_WJOB:JSON.stringify({k:'knock',pre:m,kind:'b3',lo:1,hi:400,rigid:false})}))),
  ...['wempe_physics.js','wempe_strength.js','wempe_sustaining.js','wempe_errorbudget.js'].map(t=>job(r,t,()=>kid([t],r,{},true)))]);
const N=Math.max(1,Math.min(jobs.length,+process.env.MC_PROCS||10)),t0=Date.now();let next=0,fail=0;
Promise.all([...Array(N)].map(async()=>{while(next<jobs.length)await jobs[next++]();})).then(()=>{
  const out={made:new Date().toISOString().slice(0,10),builds:{}},rows=[];const chk=(ok,s)=>{if(!ok)fail=1;rows.push(`${ok?'  ok ':'  !! '} ${s}`);},say=s=>rows.push('  '+s);
  for(const[r,nm]of REVS){const x=R[r],e=x.esc,ring=x.run.maxL*e.d0,floor=2*ring,win=e.deep-floor;
    const line=(t,re)=>{const m=re.exec(x[t].out);return m?m[1]:null;},sus=line('wempe_sustaining.js',/keeps the train going ([\d.]+) min/),eb=line('wempe_errorbudget.js',/the build, its masses set to [^,]+, carries ([\d.]+) s/),str=/!!/.test(x['wempe_strength.js'].out);
    rows.push(`\n${nm} (MC_WREV=${r})`);
    chk(e.Amin>=180&&e.Amax<=270,`the swing over the whole wind ${f(e.Amin,1)}-${f(e.Amax,1)}° (${f(e.A12,1)}° at 12 h): inside the guard band, 180-270°; the sources' 225-270° ${e.Amin>=225?'held':`not reached at the wind's lowest (${f(225-e.Amin,1)}° under)`}`);
    chk(win>=0.05&&e.d0>floor+0.01&&e.d0<e.deep-0.01,`the depth of lock's window ${f(floor,3)}-${f(e.deep,3)} mm (${f(win*1000,0)} µm: a held tooth's stone rings ${f(ring*1000,0)} µm; the discharge stone lifts it ${f(e.lift,3)}), the drawn ${f(e.d0,3)} inside it`);
    chk(x.dyn.trips===0&&x.dyn.margin>0,`in time (dynamics.js, ${x.dyn.beats} beats at ${f(x.dyn.A,1)}°): no tooth past, the detent home ${f(x.dyn.margin*1000,1)} ms before the next tooth`);
    chk(x.run.trips===0,`the frame as drawn: no tooth past, a held tooth's stone at most ${f(100*x.run.maxL,1)} % of the depth of lock`);
    chk(x.push.frame.trips===0,`pushed to 300° (the frame): ${x.push.frame.trips} teeth past (the drive ${f(x.push.s,2)} times the build's)`);
    chk(x.b3>=20,`a blow across the plate lets a tooth go at ${f(x.b3,1)} g lasting 3 ms (20 g asked) and ${f(x.b05,0)} g lasting 0.5 ms`);
    chk(x['wempe_physics.js'].code===0,`wempe_physics.js: the energy budget${r==='build'?' and the Nivaflex strip':''} close`);
    chk(x['wempe_strength.js'].code===0&&!str,`wempe_strength.js: every loaded part fully wound inside its material's range`);
    chk(x['wempe_sustaining.js'].code===0&&sus!=null,`wempe_sustaining.js: the maintaining spring keeps the train going ${sus} min while the key turns`);
    chk(x['wempe_errorbudget.js'].code===0&&eb!=null&&+eb<=8,`wempe_errorbudget.js: the masses to ±0.1°, it carries ${eb} s (${f(eb/4,1)} miles of longitude) after 30 days at sea, 8 s asked`);
    /* the floors (× the estimate, then g): straight between the runs either side of the crossing; under the lowest run, its multiplier (a bound) */
    const W78=0.8,cr=(pts,y,up)=>{for(let i=1;i<pts.length;i++){const[a,p]=pts[i-1],[c,q]=pts[i];if(up?(p<y&&q>=y):(p>=y&&q<y))return a+(c-a)*(y-p)/(q-p);}return up?(pts[0][1]>=y?pts[0][0]:null):(pts[0][1]<y?pts[0][0]:null);};
    const mM=cr([[0.5,x['run0.5'].maxL],[0.8,x['run0.8'].maxL],[1,x.run.maxL]],0.5,false),mK=cr([[0.8,x['b3_0.8']],[1,x.b3],[1.2,x['b3_1.2']]],20,true);
    const pf={margin:+f(mM*W78,3),knock:+f(mK*W78,3),rows:{ring:[[0.5,x['run0.5'].maxL],[0.8,x['run0.8'].maxL],[1,x.run.maxL]],knock:[[0.8,x['b3_0.8']],[1,x.b3],[1.2,x['b3_1.2']]]}};
    chk(mM!=null&&mK!=null&&Math.max(mM,mK)<1,`the preload's floors under the estimate (${W78} g): a held tooth's stone rings under half the depth of lock from ${f(mM*W78,2)} g (${x['run0.5'].maxL<0.5?'already at 0.5 times: a bound':'straight between the runs'}), a 3 ms blow of 20 g lets none past from ${f(mK*W78,2)} g`);
    out.builds[r]={name:nm,floor:pf,swing:{A12:e.A12,lo:e.Amin,hi:e.Amax},window:{floor,deep:e.deep,d0:e.d0,ring,lift:e.lift},dyn:x.dyn,frame:{maxL:x.run.maxL,trips:x.run.trips},push:x.push.frame,knock:{b3:x.b3,b05:x.b05},sustain:+sus,voyage30:+eb};}
  console.log(`The Wempe built to navigate by: its two builds checked (${f((Date.now()-t0)/1000,0)} s)`+rows.join('\n'));
  /* tools/wempe_build.json: wempe_tolerances.js takes each build's ring and preload floors from it (--write; without it, exit 1 if it isn't what this finds) */
  const OUT=path.join(__dirname,'wempe_build.json'),txt=JSON.stringify({...out,made:undefined},null,1)+'\n';
  if(process.argv.includes('--write')){fs.writeFileSync(OUT,txt);console.log('  wrote tools/wempe_build.json');}
  else{const ok=fs.existsSync(OUT)&&fs.readFileSync(OUT,'utf8').replace(/\r/g,'')===txt;console.log(ok?'  ok  tools/wempe_build.json is what this finds':'  !!  tools/wempe_build.json is not what this finds: node wempe_build.js --write');if(!ok)fail=1;}
  const ji=process.argv.indexOf('--json');if(ji>0)fs.writeFileSync(process.argv[ji+1],JSON.stringify(out));if(fail)process.exitCode=1;
}).catch(e=>{console.error(e);process.exitCode=1;});
