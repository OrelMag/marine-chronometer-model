// The Soviet 6MX's physics against the drawings' (the Wempe page's third version, Kirov No. 247: wempe/README.md, "The Soviet 6MX"). The page runs the 6MX's own
// escapement when that version is shown (escphys.js WPHYS.rev('6mx'), its bodies WESC.SET6; the user's choice, 17 October 2026: the drawings' until then); this works out
// what the 6MX's differences change, for the README, the essay and the report, and checks the page's bodies against the weighed ones:
//  - its intermediate and seconds arbors' pivots in jewels in chatons, where the drawings press brass bushes: the friction the model's sources give oiled steel in ruby
//    and in brass is the same range (physics.js: mu_p 0.10-0.15), so the train's efficiency doesn't change; the shake does (a jewel hole the pivot's and 0.025, the
//    drawn bushes 0.035 and 0.05 loose; the escape arbor's jewels Ø 0.27 on its Ø 0.24 pivots), and with it the hole tolerance a CNC must hold (gearing.js's tp: half
//    the mesh's tip clearance at its drawn centres, gearing_wempe.json's windows, less the pivots' shake);
//  - its escapement at the heights the sheets first drew, with the first-drawn balance staff and collar (no hub screws): the escapement's plan is the same, so only its
//    bodies change, weighed on the page's solids in that version (wempe_inertia.py --rev 6mx, tools/wempe_inertia_6mx.json, against wempe_inertia.json): the balance's
//    moment of inertia (its period and the rate before timing), the escape wheel's with the train behind it and the detent's, run through makeEsc as the page's
//    escapement is (escphys.js WPHYS.rev('6mx'): WESC.SET with WESC.SET6's bodies): its swing and rate over the wind.
//   node wempe_6mx.js            prints them; exit 1 if tools/wempe_6mx.json is stale, the 6MX's swing leaves wempe_escapement.js's guard (180-270°) or a hole's
//                                tolerance falls under 5 µm
//   node wempe_6mx.js --write    writes tools/wempe_6mx.json (the report's figures)
// About a second. Run it after wempe_inertia.py --write (either version), gearing.js --model wempe --write, or a change to the Wempe's escapement or the 6MX's jewels.
const fs=require('fs'),path=require('path'),W=require('./wempe_load.js')(),P=W.WPHYS,S=P.SET,D=Math.PI/180;
const J=n=>JSON.parse(fs.readFileSync(path.join(__dirname,n),'utf8')),f=(x,n=1)=>x.toFixed(n),say=s=>console.log(s);
let bad=0;const chk=(c,s)=>{say((c?'  ok  ':'  !!  ')+s);if(!c)bad++;};
const L=J('wempe_inertia.json'),X=J('wempe_inertia_6mx.json'),G=J('gearing_wempe.json');
/* the bodies as wempe_escapement.js reads them: the balance with its rollers, collet and a third of its spring; the escape arbor with the seconds arbor and hand behind it (8:1) */
const body=j=>({I:j.balance.I+j.rollers.I+j.collet.I+j.spring.I/3,JW:j.escape.I+(j.seconds.I+j.secondsHand.I)/64,ID:j.detent.I}),b0=body(L),b6=body(X);
const E0=P.ESC,E6=P.rev('6mx').ESC,near=(a,b)=>Math.abs(a/b-1)<0.002;   /* the page's own 6MX escapement (escphys.js WPHYS.rev: WESC.SET6's bodies) */
chk(near(W.WESC.SET6.I,b6.I)&&near(W.WESC.SET6.JW,b6.JW)&&near(W.WESC.SET6.ID,b6.ID),`WESC.SET6 (js/escapement.js), the page's 6MX bodies, are the weighed ones to 0.2 %: ${W.WESC.SET6.I}, ${W.WESC.SET6.JW}, ${W.WESC.SET6.ID}`);
say('the bodies, weighed in each version (g·mm²): as last revised, the 6MX');
const rel=(a,b)=>`${f(100*(b/a-1),2)} %`;
say(`  the balance ${f(b0.I,1)}, ${f(b6.I,1)} (${rel(b0.I,b6.I)}; the 1941 collar without the hub's screws)`);
say(`  the escape arbor and the train behind it ${f(b0.JW,2)}, ${f(b6.JW,2)} (${rel(b0.JW,b6.JW)})`);
say(`  the detent ${f(b0.ID,2)}, ${f(b6.ID,2)} (${rel(b0.ID,b6.ID)})`);
const dRate=86400*(Math.sqrt(b0.I/b6.I)-1);
say(`the balance's period ${f((1-Math.sqrt(b6.I/b0.I))*0.5e6,1)} µs a beat shorter: ${f(dRate,1)} s a day fast before timing, which the timing weights take out as they do the drawings' balance's`);
/* the swing and rate over the wind, each version's escapement at the measured drive (escphys.js) */
const H=[0,12,24,36,48,54],row=E=>H.map(h=>{const n=h/P.HPT,s=P.drv(n),a=E.ampAt(s);return{h,a:a/D,r:E.rateAt(a,s)};});
const R0=row(E0),R6=row(E6),r12=R=>R.find(q=>q.h===12).r;
say('the swing and the escapement\'s rate over the wind (against 12 h), as last revised and the 6MX:');
for(let i=0;i<H.length;i++)say(`  ${String(H[i]).padStart(2)} h  ${f(R0[i].a,1)}°  ${f(R6[i].a,1)}°   ${f(R0[i].r-r12(R0),2)}  ${f(R6[i].r-r12(R6),2)} s a day`);
let mn=1e9,mx=-1e9;for(let h=0;h<=56.3;h+=1){const s=P.drv(h/P.HPT),a=E6.ampAt(s)/D;mn=Math.min(mn,a);mx=Math.max(mx,a);}
chk(mn>=180&&mx<=270,`the 6MX's swing stays within 180-270° over the wind (wempe_escapement.js's guard): ${f(mn,1)}-${f(mx,1)}°`);
/* the train: the same efficiency, the jewels' shake and the holes' tolerance */
const SH6=[0.02,0.025,0.025,0.03];   /* fusee-centre (the centre's WN-301, kept), centre-intermediate (the intermediate's jewels), intermediate-seconds, seconds-escape (the escape jewels' 0.03) */
say(`the train's efficiency: the same (oiled steel in ruby or brass, mu 0.10-0.15: physics.js); the meshes' depthing windows the same (their geometry is the drawings')`);
const T=G.stages.map((w,k)=>{const tp=(Math.min(-w.lo,w.hi)-SH6[k])/2;return{stage:w.stage,sh:w.sh,sh6:SH6[k],tp:+w.tp.toFixed(4),tp6:+tp.toFixed(4)};});
for(const t of T)say(`  ${t.stage.split(' ').slice(0,2).join(' ').padEnd(20)} shake ${f(t.sh*1000,0)} → ${f(t.sh6*1000,0)} µm: the holes within ±${f(t.tp*1000,0)} → ±${f(t.tp6*1000,0)} µm`);
const worst=Math.min(...T.map(t=>t.tp6));chk(worst>=0.005,`the tightest hole tolerance, ±${f(worst*1000,0)} µm, is a CNC's (5 µm or more)`);
const out={note:'tools/wempe_6mx.js: the Soviet 6MX against the drawings (as last revised): the bodies (g·mm²), the rate before timing (s a day), the swing (deg) and rate against 12 h (s a day) over the wind, each mesh\'s shake and hole tolerance (mm)',
  bodies:{last:b0,'6mx':b6},rateBeforeTiming:+dRate.toFixed(2),wind:H.map((h,i)=>({h,a:+R0[i].a.toFixed(2),a6:+R6[i].a.toFixed(2),r:+(R0[i].r-r12(R0)).toFixed(3),r6:+(R6[i].r-r12(R6)).toFixed(3)})),
  swing6:[+mn.toFixed(2),+mx.toFixed(2)],train:T};
for(const k of['last','6mx'])for(const q of['I','JW','ID'])out.bodies[k][q]=+out.bodies[k][q].toFixed(3);
const OUT=path.join(__dirname,'wempe_6mx.json'),txt=JSON.stringify(out,null,1)+'\n';
if(process.argv.includes('--write')){fs.writeFileSync(OUT,txt);say('wrote tools/wempe_6mx.json');}
else chk(fs.existsSync(OUT)&&fs.readFileSync(OUT,'utf8')===txt,'tools/wempe_6mx.json is up to date'+(fs.existsSync(OUT)?'':' (node wempe_6mx.js --write)'));
process.exit(bad?1:0);
