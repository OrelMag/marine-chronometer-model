// The Wempe's banking screw turned (the page's Swing and isochronism, Banking screw: js/app.js): the escapement rebuilt with the depth of lock it sets, for each depth on a
// grid the swing and the escapement's rate it settles at against the drive, its lock and let-off, whether it unlocks at all, and the least swing that works. A makeEsc
// rebuild takes about a second and each swing solve 0.05-0.3 s, so they are worked out here and the page reads between them (as WEDATA.swing). Needs only Node.js:
//   node wempe_banking.js           exits 1 if js/bankdata.js isn't what it finds (about 1 minute: two processes for each version)
//   node wempe_banking.js --write   writes marine-chronometer-source/wempe/js/bankdata.js (WBANK)
// What it gives (WBANK): last, the drawings' escapement (every version but the 6MX's: they share its physics, js/escphys.js), and 6mx, the Soviet 6MX's (its own bodies),
//   each {d0, rows: [[depth mm, unlocks 1/0, lock deg, let-off deg, AMIN deg, [[swing deg, rate s a day or null] at each drive in S]], ...]}; S the drives (times the
//   reference's: the wind's 0.89-1.05 inside them); win, the bench's window (tolerances_wempe.json's lock: the shallowest whose held tooth's stone rings under half the depth,
//   ring twice its ring, taken the same at every depth as wempe_tolerances.js takes it; the deepest that unlocks with the swing in the guard band); pitch, the banking
//   screw's M1.2 thread, 0.25 mm a turn, the head bearing on the pipe at the stone (escapement.js), so a turn moves the stone 0.25 nearer the wheel or away. The 6MX's window is
//   the drawings' (no tolerances run is made for it).
// Run it after changing the Wempe's escapement, detent or drive (makeEsc's settings, WESC.SET, escphys.js), then the build.
const fs=require('fs'),path=require('path'),cp=require('child_process');
const OUT=path.join(__dirname,'..','..','wempe','js','bankdata.js');
const TOL=JSON.parse(fs.readFileSync(path.join(__dirname,'tolerances_wempe.json'),'utf8')).lock;
/* the depths (mm): every 5 µm from 0.150 to the drawn 0.235, then every micron to 0.250, where the lock nears what the discharge stone can lift (0.268) and the swing falls away */
const DS=[];for(let d=150;d<235;d+=5)DS.push(d/1000);for(let d=235;d<=250;d++)DS.push(d/1000);
const S=[0.6,0.7,0.8,0.85,0.9,0.95,1,1.05,1.1,1.2,1.3];
const r=(x,n)=>x==null||!Number.isFinite(x)?null:+x.toFixed(n);
const kid=(rev,a,b)=>new Promise((ok,no)=>cp.execFile(process.execPath,['-e',
  `const W=require('./wempe_load.js')(),P=W.WPHYS,T=P.SET,D=Math.PI/180,DS=${JSON.stringify(DS)},S=${JSON.stringify(S)},o=[];
   for(let i=${a};i<${b};i++){const d=DS[i],e=W.makeEsc({...T,dL:d/T.ES},T),m=e.measure();
     o.push([d,m.runs?1:0,m.lock,m.letoff,e.AMIN/D,S.map(s=>{if(!m.runs)return[0,null];const a=e.ampAt(s);return[a/D,a>=e.AMIN?e.rateAt(a,s):null];})]);}
   console.log(JSON.stringify({d0:T.dL*T.ES,o}))`],{cwd:__dirname,encoding:'utf8',maxBuffer:1<<26,env:{...process.env,MC_WREV:rev}},(e,o)=>e?no(e):ok(JSON.parse(o))));
const half=Math.ceil(DS.length/2),run=rev=>Promise.all([kid(rev,0,half),kid(rev,half,DS.length)]).then(([p,q])=>({d0:r(p.d0,4),
  rows:[...p.o,...q.o].map(([d,u,lk,lo,am,sw])=>[d,u,r(lk,2),r(lo,2),r(am,2),sw.map(([a,t])=>[r(a,2),r(t,3)])])}));
Promise.all([run('last'),run('6mx')]).then(([last,six])=>{
  const WB={S,pitch:0.25,win:{shallow:TOL.shallow,deep:TOL.deep,ring:TOL.ring,tip:TOL.tip,liftMax:TOL.liftMax},last,'6mx':six};
  const js=`/* bankdata.js: the Wempe's banking screw turned (Swing and isochronism, Banking screw), written by marine-chronometer-source/chronometer-working-model/tools/wempe_banking.js
   --write: generated, don't edit (rerun the tool; without --write it checks this file). Part of the Wempe model; declares only WBANK (the tool's header says what it holds). */
const WBANK=${JSON.stringify(WB)};
`;
  for(const[k,v]of[['last',last],['6mx',six]]){const z=v.rows.find(q=>Math.abs(q[0]-v.d0)<1e-6),i=S.indexOf(1),fail=v.rows.find(q=>!q[1]),cliff=v.rows.find(q=>q[1]&&q[5][i][0]<z[5][i][0]-30);
    console.log(`${k}: drawn ${v.d0} mm, lock ${z[2]}°, let-off ${z[3]}°, ${z[5][i][0]}° at the reference's drive; ${cliff?`the swing falls ${(z[5][i][0]-cliff[5][i][0]).toFixed(0)}° by ${cliff[0]} mm`:'no fall in the swing'}; ${fail?`won't unlock from ${fail[0]} mm`:'unlocks at every depth'}`);}
  if(process.argv.includes('--write')){fs.writeFileSync(OUT,js);console.log(`wrote ${path.relative(process.cwd(),OUT)} (${js.length} bytes, ${DS.length} depths at ${S.length} drives, two versions)`);}
  else{const ok=fs.existsSync(OUT)&&fs.readFileSync(OUT,'utf8')===js;console.log(`${ok?'  ok ':'  !! '} js/bankdata.js ${ok?'is up to date':'is stale: node wempe_banking.js --write'}`);if(!ok)process.exitCode=1;}
}).catch(e=>{console.error(e);process.exitCode=1;});
