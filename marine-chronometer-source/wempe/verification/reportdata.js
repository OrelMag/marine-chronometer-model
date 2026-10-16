// The data of the report "The Wempe Einheits-Chronometer: does the model hold to its drawings, and would it keep time?" (index.html here, build_report.py): every
// Wempe check run as ci.py runs it (its full runs where there is one: dynamics.js, tripping.js, gearing.js and gimbals.js with --model wempe; the build checks, the tolerances, the bench, the Monte Carlo and keystone.js), its exit code and its
// output kept as it prints it, and the figures the page charts, worked out by the tools' own modules or read from the JSON they wrote, gathered into assets/data.json.
// Needs Node.js (and Python for wempe_mainspring.py --check):
//   node reportdata.js               every check and figure (about 9 minutes: the full runs at once, in their own processes; gearing.js the longest)
//   node reportdata.js --only a,b    those runs again (names as in RUNS), the rest kept from assets/data.json
// The browser checks (solids, fine, the screw audit, exploded, bom) write assets/geometry.json: python geometry.py.
const fs=require('fs'),path=require('path'),cp=require('child_process');
const HERE=__dirname,T=path.join(HERE,'..','..','chronometer-working-model','tools'),WE=path.join(HERE,'..'),REF=path.join(HERE,'..','..','..','References','wempe'),OUT=path.join(HERE,'assets','data.json');
const PY=process.env.PYTHON||(process.platform==='win32'?'python':'python3'),TMP=path.join(HERE,'assets');
const r=(x,n=3)=>Number.isFinite(+x)?+(+x).toFixed(n):null;
/* the checks: [key, command, its arguments (run in tools/), what it checks] */
const RUNS=[
  ['escapement','node',['wempe_escapement.js'],'The escapement as makeEsc solves it from the layout (05 04_1): its frames, its bodies against the weighed solids, the hairspring and the period, the drive through the train, the damping, the escapement\'s figures, the swing and the rate over the wind, stopping and starting, the locking stone swept against the teeth.'],
  ['dynamics','node',['dynamics.js','--model','wempe'],'The escapement integrated in time through every contact, against makeEsc: the swing, the landing, the detent\'s fall and return, its estimates varied, starting, the least drive, knocks and the ship\'s motion.'],
  ['tripping','node',['tripping.js','--model','wempe','--json',path.join(TMP,'_trip.json')],'The detent as a plane frame of beam elements (wempe_tripping.js): its modes, validated rigid against dynamics.js, then running as drawn, its estimates varied, the swing pushed and the knocks that trip it.'],
  ['mainspring','py',['wempe_mainspring.py','--check'],'The mainspring solved (mainspring.py) at twelve lengths and sets and fitted to 05 06_20\'s measured force through the drawn fusee; checks wempe_mainspring.json is up to date.'],
  ['friction','py',['wempe_mainspring.py','--friction','--check'],'The mainspring\'s coil friction over the wind (mainspring_friction.py on the solved spring); checks mainspring_friction_wempe.json is up to date.'],
  ['physics','node',['wempe_physics.js'],'The energy budget from the mainspring through the fusee, chain, train and escapement to the balance\'s damping: does it close?'],
  ['gearing','node',['gearing.js','--model','wempe'],'The going train\'s four meshes tooth by tooth on the page\'s own outlines; the train in time; each mesh\'s depthing window and the holes\' tolerance.'],
  ['strength','node',['wempe_strength.js'],'Every loaded part fully wound against its material\'s published range.'],
  ['hairspring','node',['wempe_hairspring.js'],'The hairspring as drawn: its length\'s readings, 05 03_7\'s curve against Phillips\' conditions, the force on the pivots, its isochronism by elastica and by beam elements.'],
  ['thermal','node',['wempe_thermal.js'],'The cut bimetallic balance and steel spring in heat and cold: the linear term against the masses\' place, the secondary error.'],
  ['gimbals','node',['gimbals.js','--model','wempe','--json',path.join(TMP,'_gim.json')],'The case and gimbal ring weighed on the model, levelled as 05 01 says, run in a seaway; what reaches the escapement.'],
  ['errorbudget','node',['wempe_errorbudget.js'],'The chronometer through the 6MX\'s TU trial (35 days at 36/20/4/20/36 °C), as adjusted and as drawn, and the error a navigator carries over a 60-day voyage.'],
  ['tolerances','node',['wempe_tolerances.js'],'How closely the parts the drawings don’t size must be made: each range keeping the swing in the guard band over the whole wind; checks tolerances_wempe.json is up to date.'],
  ['bench','node',['wempe_bench.js'],'The tests on the bench for a Wempe made to the model, each with how and what it must read; checks bench_wempe.json is up to date.'],
  ['montecarlo','node',['wempe_montecarlo.js'],'The whole Wempe made to a maker’s tolerances at once, judged as made and after the bench’s tests; checks montecarlo_wempe.json is up to date.'],
  ['keystone','node',['keystone.js','--model','wempe'],'The escapement against the rules of a period text, Watch and Clock Escapements (1904), Ch. III: reports, never judges; checks keystone_wempe.json is up to date.'],
  ['soviet','node',['wempe_6mx.js'],'The Soviet 6MX against the drawings: its jewels\' shake and the holes\' tolerance, its escapement\'s bodies at the first-drawn heights through makeEsc (the swing and rate over the wind); checks wempe_6mx.json is up to date.'],
  ['startup','node',['wempe_startup.js','--json',path.join(TMP,'_su.json')],'A running 6MX\'s swing read off video (wempe_swing.py, wempe_swing.json) fitted with the Wempe\'s balance equation for its free run-down TF.']];
const only=(i=>i>0?process.argv[i+1].split(','):null)(process.argv.indexOf('--only'));
if(only)for(const k of only)if(!RUNS.some(q=>q[0]===k)){console.error(`no run ${k}; runs: ${RUNS.map(q=>q[0]).join(', ')}`);process.exit(2);}
const prev=only&&fs.existsSync(OUT)?JSON.parse(fs.readFileSync(OUT,'utf8')):null;
fs.mkdirSync(TMP,{recursive:true});
const exec=(cmd,args,opt={})=>new Promise(ok=>{const t0=Date.now();cp.execFile(cmd==='py'?PY:cmd==='node'?process.execPath:cmd,args,{cwd:T,encoding:'utf8',maxBuffer:1<<28,windowsHide:true,...opt},(e,o,er)=>
  ok({rc:e?(typeof e.code==='number'?e.code:1):0,out:((o||'')+(er&&er.trim()?'\n'+er:'')).replace(/\r/g,'').replace(/\s+$/,''),secs:Math.round((Date.now()-t0)/1000)}));});
const node=(code,env)=>exec('node',['-e',code],env?{env:{...process.env,...env}}:{}).then(q=>{if(q.rc)throw Error('a figure\'s child failed: '+q.out.slice(-2000));return JSON.parse(q.out.trim().split('\n').pop());});
/* the figures the page charts, each from the tools' own modules in a process of its own (gearing.js reads --model at require) */
const FIG={
  /* the swing and the rate over the wind (wempe_escapement.js's table, every 2 h): makeEsc's ampAt and rateAt at the drive n fusee turns from full wind; the rate with the drawn
     hairspring's isochronism (SET.HS) and the escapement's alone */
  wind:h0=>`const W=require('./wempe_load.js')(),P=W.WPHYS,E=P.ESC,D=Math.PI/180,A12=E.A/D,HS=P.SET.HS||0,o=[];for(let h=${h0};h<${h0}+30&&h<=56.3;h+=2){const s=P.drv(h/P.HPT),a=E.ampAt(s),re=E.rateAt(a,s);o.push([h,+s.toFixed(4),+(a/D).toFixed(2),+re.toFixed(3),+(re-HS*(a/D-A12)/10).toFixed(3)]);}console.log(JSON.stringify({A12,TF:P.SET.TF,HS,rows:o}))`,
  /* the meshes over a pitch at their drawn centres (gearing.js's stage, D0 the holes' centres against m(z1+z2)/2) and six hours of the train, the swing every 20 s */
  gear:`process.argv.push('--model','wempe');const G=require('./gearing.js'),WT=require('./wempe_train.js'),r=(x,n=4)=>+(+x).toFixed(n);
    const base=G.STG.map(([nm,zA,zB,m],k)=>G.stage(zA,zB,m,WT.D0[k]));G.setBase(base);
    const meshes=G.STG.map(([nm,zA,zB,m],k)=>{const s=base[k],a0=s.al[0],span=s.al[s.al.length-1]-a0;return{name:nm,zA,zB,m,approach:r(s.approach,3),drop:s.drop,backlash:r(s.blmm*1000,1),tip:r(s.tip*1000,1),
      stats:s.fac.map(f=>{const q=G.st(f);return{mn:r(q.mn),mx:r(q.mx),mean:r(q.mean)};}),curve:s.al.map((a,i)=>[r((a-a0)/span,4),...s.fac.map(f=>r(f[i],5))])};});
    const days=[1,2].map(j=>{const q=G.day(base,j,6,undefined,undefined,20);return{mu:G.MU[j],amin:r(q.amin,2),amax:r(q.amax,2),wander:q.wander,trace:q.tr.filter(p=>p[0]>0.1).map(p=>p.map(x=>r(x,3)))};});
    console.log(JSON.stringify({meshes,days,mu:G.MU}))`,
  /* the drawn hairspring at large swings (wempe_hairspring.js's spring and HSPR.large, its section 4): the couple's departure from linear against its stiffness at 5 deg, the force
     on the pivots, and the rate the spring alone gives against small swings */
  hair:`const l=console.log;console.log=()=>{};const HS=require('./wempe_hairspring.js');console.log=l;const{HSPR}=require('../../shared/hairspring.js'),W=require('./wempe_load.js')(),D=Math.PI/180,E=W.WPHYS.ESC;
    const q=HS.resample(HS.spring(W.WESC.HSP.TURNS),0.15),ths=[];for(let a=-300;a<=300;a+=5)ths.push(a*D);
    const big=HSPR.large(q.pts.map(p=>[p[0],p[1]]),ths),Ts=big.map(x=>x.T),th=big.map(x=>x.th),k5=big.find(x=>Math.abs(x.th-5*D)<1e-9).T/(5*D),rate=a=>86400*(1/HSPR.period(th,Ts,a*D).ratio-1);
    const dep=big.filter(x=>x.th>0.01).map(x=>[Math.round(x.th/D),+((x.T/(x.th*k5)-1)*1e6).toFixed(1),+(x.F*HS.R/Math.abs(x.T)).toFixed(5)]),rt=[];for(let a=100;a<=300;a+=5)rt.push([a,+rate(a).toFixed(3)]);
    console.log(JSON.stringify({dep,rate:rt,A12:E.A/D,L:q.L,turns:W.WESC.HSP.TURNS,curve:HS.curve,lateral:HS.lateral}))`,
  /* the 6MX's swing (wempe_swing.json) with wempe_startup.json's fits drawn through it: the split damping's (the Wempe's escapement work, makeEsc's wn) and the plain A^2 law's,
     each stretch from its fitted start (wempe_startup.js's run, its stretches and their times) */
  swing:`const W=require('./wempe_load.js')(),E=W.WPHYS.ESC,D=Math.PI/180,T=0.5,J=JSON.parse(require('fs').readFileSync(process.env.MC_SU,'utf8')),SW=require('./wempe_swing.json').moMvyx8eXfo;
    const SEG=[[1073,1092],[1098,1114],[1119,1126],[1130,1190]],P=SW.A_t,segs=SEG.map(([a,b])=>P.filter(q=>q[0]>=a&&q[0]<=b)).filter(p=>p.length>1);
    const A0m=E.A,S=J.split_shares,fac=a=>S[0]*a/A0m+S[1]*A0m/a+S[2],run=(g,a0,t0,t1)=>{let u=(a0*D)**2,t=t0;const o=[[t,a0]];const h=0.25;while(t<t1-1e-9){const k1=g(u),k2=g(u+h/2*k1),k3=g(u+h/2*k2),k4=g(u+h*k3);u+=h/6*(k1+2*k2+2*k3+k4);t+=h;if(Math.abs(t/0.5-Math.round(t/0.5))<1e-6)o.push([+t.toFixed(2),+(Math.sqrt(Math.max(u,0))/D).toFixed(2)]);}return o;};
    const sp=J.split,fl=J.flat,gS=x=>{const a=Math.sqrt(Math.max(x,1e-9));return 2*E.wn(sp.drive,a)/T-2*x*fac(a)/sp.TF;},gF=x=>2*((fl.steady*D)**2-x)/fl.TF;
    const split=segs.map((p,i)=>run(gS,sp.starts[i],p[0][0],p[p.length-1][0])),flat=segs.map((p,i)=>run(gF,fl.starts[i],p[0][0],p[p.length-1][0]));
    console.log(JSON.stringify({pts:P.map(q=>[q[0],q[1]]),split,flat,A0:A0m/D}))`,
  /* the energy budget's exported ranges (wempe_physics.js: the losses to the fusee arbor, the level, the train, the parts' damping) */
  phys:`const l=console.log;console.log=()=>{};const P=require('./wempe_physics.js');console.log=l;console.log(JSON.stringify({LS:P.LS,LV:P.LV,TR:P.TR,DQ:P.DQ,FN:{L:P.FN.L,set:P.FN.set,rms:P.FN.rms,max:P.FN.max,eta:P.FN.eta,Mdown:P.FN.Mdown,Mfull:P.FN.Mfull,Tdown:P.FN.Tdown,Tup:P.FN.Tup,slack:P.FN.slack,friction:{rms:P.FN.friction.rms,eta:P.FN.friction.eta}}}))`};
const J=f=>JSON.parse(fs.readFileSync(path.join(T,f),'utf8'));
/* the works drawings' transcriptions (References/wempe/transcriptions/): each group's sheets and every figure read in its tables of dimensions, by how sure */
function transcriptions(){const out=[];for(const f of fs.readdirSync(path.join(REF,'transcriptions')).filter(f=>f.endsWith('.md')).sort()){const t=fs.readFileSync(path.join(REF,'transcriptions',f),'utf8'),n={sure:0,likely:0,unsure:0,other:0};let rows=0,head=null;
  const title=(/^# (.+)$/m.exec(t)||[])[1]||f,sheets=(t.match(/^## .*`[^`]*\.jpg`/gm)||[]).length;
  for(const ln of t.split('\n')){if(!ln.startsWith('|')){head=null;continue;}const c=ln.split('|').slice(1,-1).map(s=>s.trim());if(!head){head=c.map(s=>s.toLowerCase());continue;}if(/^-+$/.test(c[0].replace(/:/g,'')))continue;
    const k=head.findIndex(h=>h==='how sure'||h==='sure');if(k<0)continue;rows++;const v=(c[k]||'').toLowerCase();n[/^unsure/.test(v)?'unsure':/^likely/.test(v)?'likely':/^(sure|certain)/.test(v)?'sure':'other']++;}
  out.push({file:f,title:title.replace(/^Wempe works drawings,\s*/,''),sheets,figures:rows,...n});}return out;}
(async()=>{const t0=Date.now(),want=RUNS.filter(q=>!only||only.includes(q[0]));
  console.log(`running ${want.map(q=>q[0]).join(', ')} at once, and the figures${only?'':' (about 9 minutes)'}`);
  const runs=prev?{...prev.runs}:{};
  const jobs=want.map(([k,cmd,args,what])=>exec(cmd,args).then(q=>{runs[k]={cmd:(cmd==='py'?'python':'node')+' '+args.map(a=>a.startsWith(TMP)?'OUT.json':a).join(' '),what,...q};console.log(`  ${k}: exit ${q.rc} in ${q.secs} s`);}));
  const figs=only?null:Promise.all([node(FIG.wind(0)),node(FIG.wind(30)),node(FIG.gear),node(FIG.hair),node(FIG.phys)]);
  await Promise.all(jobs);const F=figs?await figs:null;
  /* the 6MX's fit as wempe_startup.js finds it now (its --json): the committed wempe_startup.json, which wempe_escapement.js reads, is kept beside it to show whether it is current */
  const suNow=path.join(TMP,'_su.json'),SUN=fs.existsSync(suNow)?JSON.parse(fs.readFileSync(suNow,'utf8')):(prev&&prev.swing&&prev.swing.startup)||J('wempe_startup.json');
  const FS=only&&!only.includes('startup')?null:await node(FIG.swing,{MC_SU:fs.existsSync(suNow)?suNow:path.join(T,'wempe_startup.json')});if(fs.existsSync(suNow))fs.unlinkSync(suNow);
  const rd=f=>{const p=path.join(TMP,f);if(!fs.existsSync(p))return null;const j=JSON.parse(fs.readFileSync(p,'utf8'));fs.unlinkSync(p);return j;};
  const trip=rd('_trip.json')||(prev&&prev.trip),gim=rd('_gim.json')||(prev&&prev.gim);
  const WED=(()=>{const s=fs.readFileSync(path.join(WE,'js','essaydata.js'),'utf8');return Function(s+';return WEDATA;')();})();
  const MS=J('wempe_mainspring.json'),MF=J('mainspring_friction_wempe.json'),GI=J('gimbals_wempe.json'),IN=J('wempe_inertia.json'),GW=J('gearing_wempe.json'),SU=J('wempe_startup.json'),SW=J('wempe_swing.json').moMvyx8eXfo;
  const build={tol:J('tolerances_wempe.json'),bench:J('bench_wempe.json'),mc:J('montecarlo_wempe.json'),key:J('keystone_wempe.json')};
  const data=prev&&only?{...prev,runs,trip,gim,build,soviet:J('wempe_6mx.json'),...(FS?{swing:{...prev.swing,...FS,startup:SUN,committed:J('wempe_startup.json')}}:{}),made:new Date().toISOString().slice(0,10)}:{made:new Date().toISOString().slice(0,10),runs,trip,gim,build,
    wind:{A12:F[0].A12,TF:F[0].TF,HS:F[0].HS,rows:[...F[0].rows,...F[1].rows]},gear:{...F[2],windows:GW},hair:F[3],swing:{...FS,json:{A_range:SW.A_range_deg,windows:SW.windows,f:SW.f_Hz,stretches:SW.stretches,sure:SW.sure},startup:SUN,committed:SU},phys:F[4],
    ms:{strip:MS.strip,setup:MS.setup,barrelTurns:MS.barrelTurns,marks:MS.marks,tries:MS.tries,Lfit:MS.Lfit,setFit:MS.setFit,rmsFit:MS.rmsFit,final:{...MS.final,fit:MS.final.fit,tq:MS.final.tq}},
    friction:MF.summary,mass:{bowl:{m:GI.bowl.m,cg:GI.bowl.cg,byPart:GI.bowl.byPart},ring:{m:GI.ring.m},alt:GI.alt},inertia:Object.fromEntries(Object.entries(IN).filter(([k])=>k!=='note').map(([k,v])=>[k,{m:v.m,I:v.I}])),
    soviet:J('wempe_6mx.json'),essay:{fusee:WED.fusee,heat:WED.heat,trial:WED.trial,hs:WED.hs,sheets:WED.sheets,phys:WED.phys},transcriptions:transcriptions()};
  fs.writeFileSync(OUT,JSON.stringify(data));
  console.log(`wrote assets/data.json (${(fs.statSync(OUT).size/1024).toFixed(0)} KB): ${Object.keys(runs).length} runs, ${Object.values(runs).filter(q=>q.rc).length} failing, in ${((Date.now()-t0)/1000).toFixed(0)} s`);})().catch(e=>{console.error(e);process.exit(1);});
