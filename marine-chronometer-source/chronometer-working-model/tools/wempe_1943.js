// The escapement of 1943's physics against the drawings' (the Wempe page's fourth version, Escapement of 1943 as photographed: wempe/README.md, "The escapement of 1943
// as photographed"): the revised sheets but for the escapement, which stands at the first-drawn heights with the first-drawn balance, rollers and escape wheel, the 6MX's
// detent (1436's bracketed sizes) and the 1943 block with its banking screw. Its plan is the drawings' (the banking screw sets the depth of lock the drawings give, 05 04_1's
// 0.235), so, as for the 6MX (wempe_6mx.js), only its bodies change: weighed on the page's solids in that version (wempe_inertia.py --rev 1943, tools/wempe_inertia_1943.json):
// the balance (its period, the rate before timing), the escape arbor with the train behind it and the detent, run through makeEsc with WESC.SET (the page runs the
// drawings' escapement for this version: escphys.js WPHYS.rev; this works out what its own bodies would run): the swing and rate over the wind, measure()'s figures,
// and the locking stone against the teeth (stoneClash) through the period.
//   node wempe_1943.js            prints them; exit 1 if tools/wempe_1943.json is stale, the swing leaves wempe_escapement.js's guard (180-270°) over the wind, the escapement
//                                 doesn't run, or the stone passes 1 µm into a tooth
//   node wempe_1943.js --write    writes tools/wempe_1943.json (the report's figures)
// About a minute. Run it after wempe_inertia.py --write (any version) or a change to the Wempe's escapement.
const fs=require('fs'),path=require('path'),W=require('./wempe_load.js')(),P=W.WPHYS,S=P.SET,D=Math.PI/180,{stoneClash}=require('./escapement.js');
const J=n=>JSON.parse(fs.readFileSync(path.join(__dirname,n),'utf8')),f=(x,n=1)=>x.toFixed(n),say=s=>console.log(s);
let bad=0;const chk=(c,s)=>{say((c?'  ok  ':'  !!  ')+s);if(!c)bad++;};
/* the bodies as wempe_6mx.js reads them: the balance with its rollers, collet and a third of its spring; the escape arbor with the seconds arbor and hand behind it (8:1) */
const body=j=>({I:j.balance.I+j.rollers.I+j.collet.I+j.spring.I/3,JW:j.escape.I+(j.seconds.I+j.secondsHand.I)/64,ID:j.detent.I}),b0=body(J('wempe_inertia.json')),b6=body(J('wempe_inertia_6mx.json')),b3=body(J('wempe_inertia_1943.json'));
const E0=P.ESC,S3={...S,I:+b3.I.toFixed(1),JW:+b3.JW.toFixed(2),ID:+b3.ID.toFixed(2)},E3=W.makeEsc(S3,S3);   /* its own reference, as escphys.js builds the 6MX's: the rate as the timing weights would set it */
const rel=(a,b)=>`${b>=a?'+':''}${f(100*(b/a-1),2)} %`;
say('the bodies, weighed in each version (g·mm²): as last revised, the 6MX, the escapement of 1943');
say(`  the balance ${f(b0.I,1)}, ${f(b6.I,1)}, ${f(b3.I,1)} (${rel(b0.I,b3.I)}: its first-drawn staff and rollers weigh as the revised ones within 0.3 g·mm²; the 6MX's lighter balance is its own)`);
say(`  the escape arbor and the train behind it ${f(b0.JW,2)}, ${f(b6.JW,2)}, ${f(b3.JW,2)} (${rel(b0.JW,b3.JW)}: the first-drawn escape wheel and arbor)`);
say(`  the detent ${f(b0.ID,2)}, ${f(b6.ID,2)}, ${f(b3.ID,2)} (${rel(b0.ID,b3.ID)}: the 6MX's detent, 1436's bracketed sizes)`);
const dRate=86400*(Math.sqrt(b0.I/b3.I)-1);
say(`the balance's period ${f(Math.abs(1-Math.sqrt(b3.I/b0.I))*0.5e6,1)} µs a beat ${dRate>0?'shorter':'longer'}: ${f(Math.abs(dRate),1)} s a day ${dRate>0?'fast':'slow'} before timing, which the timing weights take out`);
/* measure()'s figures: the plan the drawings', so lock, let-off, overall and drop as last revised; the swing the bodies' */
const m0=E0.measure(),m3=E3.measure();
chk(m3.runs,`it runs: lock ${f(m3.lock,2)}° (${f(m0.lock,2)} as last revised), let-off ${f(m3.letoff,2)}° (${f(m0.letoff,2)}), overall ${f(m3.overall,2)}° (${f(m0.overall,2)}), drop ${f(m3.drop,2)}° (${f(m0.drop,2)}); the swing at the reference's drive ${f(E3.A/D,1)}° (${f(E0.A/D,1)})${m3.runs?'':': '+m3.why}`);
/* the swing and rate over the wind, at the measured drive (escphys.js), against 12 h */
const H=[0,12,24,36,48,54],row=E=>H.map(h=>{const s=P.drv(h/P.HPT),a=E.ampAt(s);return{h,a:a/D,r:E.rateAt(a,s)};});
const R0=row(E0),R3=row(E3),r12=R=>R.find(q=>q.h===12).r;
say('the swing and the escapement\'s rate over the wind (against 12 h), as last revised and the escapement of 1943:');
for(let i=0;i<H.length;i++)say(`  ${String(H[i]).padStart(2)} h  ${f(R0[i].a,1)}°  ${f(R3[i].a,1)}°   ${f(R0[i].r-r12(R0),2)}  ${f(R3[i].r-r12(R3),2)} s a day`);
let mn=1e9,mx=-1e9;for(let h=0;h<=56.3;h+=1){const s=P.drv(h/P.HPT),a=E3.ampAt(s)/D;mn=Math.min(mn,a);mx=Math.max(mx,a);}
chk(mn>=180&&mx<=270,`its swing stays within 180-270° over the wind (wempe_escapement.js's guard): ${f(mn,1)}-${f(mx,1)}°`);
/* the locking stone never inside a tooth, as wempe_escapement.js runs it */
{const cases=[...[0.15,0.3,0.5,0.75,0.9,1,1.1,1.25,1.5].map(s=>[E3.ampAt(s),s]).filter(([a])=>a>=E3.AMIN),[E3.AMIN+0.2*D,0.15],[300*D,1],[340*D,1]];let w={d:0};
  for(const[a,s]of cases){const q=stoneClash(E3,a,s);if(q.d>=w.d)w=q;}
  chk(w.d<1e-3,`the locking stone through the period at ${cases.length} swings, ${f(E3.AMIN/D,0)}° to 340°: deepest ${f(w.d*1000,2)} µm into a tooth (want under 1 µm)`);}
const out={note:'tools/wempe_1943.js: the escapement of 1943 against the drawings (as last revised): the bodies (g·mm²), the rate before timing (s a day), measure()\'s figures (deg), the swing (deg) and rate against 12 h (s a day) over the wind',
  bodies:{last:b0,'6mx':b6,'1943':b3},rateBeforeTiming:+dRate.toFixed(2),measure:Object.fromEntries(['lock','letoff','overall','drop'].map(k=>[k,[+m0[k].toFixed(2),+m3[k].toFixed(2)]])),
  wind:H.map((h,i)=>({h,a:+R0[i].a.toFixed(2),a43:+R3[i].a.toFixed(2),r:+(R0[i].r-r12(R0)).toFixed(3),r43:+(R3[i].r-r12(R3)).toFixed(3)})),swing43:[+mn.toFixed(2),+mx.toFixed(2)]};
for(const k of['last','6mx','1943'])for(const q of['I','JW','ID'])out.bodies[k][q]=+out.bodies[k][q].toFixed(3);
const OUT=path.join(__dirname,'wempe_1943.json'),txt=JSON.stringify(out,null,1)+'\n';
if(process.argv.includes('--write')){fs.writeFileSync(OUT,txt);say('wrote tools/wempe_1943.json');}
else chk(fs.existsSync(OUT)&&fs.readFileSync(OUT,'utf8')===txt,'tools/wempe_1943.json is up to date'+(fs.existsSync(OUT)?'':' (node wempe_1943.js --write)'));
process.exit(bad?1:0);
