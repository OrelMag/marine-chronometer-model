// A real start against the model's: the balance of We1dLNXiBj0, turned by hand and let go at 0:55.2, its swing read frame by frame as the escapement builds
// it up (swing.py, swing.json's A_t), and the same start in dynamics.js's escapement in time, the drive s (times the calibrated torque) and the balance's free
// run-down TF (s, its damping) free. How fast the swing grows says how little the balance loses: the model's TF (shared/escapement.js, physics.js's budget) against what this
// movement shows. Needs only Node.js and the two JSON files (swing.json from swing.py, acoustic_stretches.json from acoustic.py --every), so it runs without
// the video:
//   node startup.js            (about 8 minutes: 8 run-downs x 13 drives, each start integrated for 70 s; it reports, never fails)
//   node startup.js --chase    (a few seconds: the escape wheel's chase onto the impulse jewel heard through the start, and the build-up fitted with the
//                               escapement's work against the swing as the model's, the clicks' and flat; below)
//   node startup.js --split    (the same with the balance's damping in its parts, physics.js's shares at 255 deg and the model's TF: the air (its range's
//                               middle), the endstone's constant friction (measured, Jd2c3x8VKsE), the rest viscous; dynamics.js's o.split: TF is then the
//                               run-down at 255 deg. The air 0.35 and the endstone 0.51 until 12 October 2026, the endstone's friction worked out then)
// The drive and the run-down trade against each other along the fit (a slower run-down wants less drive for the same build-up), so the rms is ragged at
// the drive's 5 % steps; read the least run-down that fits, not the best one.
// swing.json's A_t is the mean of the video's readings; its aliases (a whole screw hole in the growth, half a hole at the start) are fitted too: low (A0 62.6,
// growth 181.8 deg), middle, high (70.1, 196.8; the likeliest, swing.json's "sure"). The sound's swings (strike to lock, read on the corrected model) are a
// second, independent curve of the same start.
const fs=require('fs'),path=require('path'),{sim}=require('./dynamics.js'),D=Math.PI/180,f=(x,n=0)=>x.toFixed(n);
const W=JSON.parse(fs.readFileSync(path.join(__dirname,'swing.json'),'utf8')).We1dLNXiBj0,At=W.A_t,T0=55.2,a0=At[0][1],g0=At[At.length-1][1]-a0;
let S=[];try{S=JSON.parse(fs.readFileSync(path.join(__dirname,'acoustic_stretches.json'),'utf8').replace(/\bNaN\b/g,'null')).recordings.We1dLNXiBj0.stretches.map(r=>[r.t,r.corrected.A_strike_lock]).filter(([t,a])=>a!=null&&a===a&&t<T0+70);}catch(e){}
const curves={low:[62.6,181.8],middle:[a0,g0],high:[70.1,196.8]},series=(A0,G)=>At.map(([t,A])=>[t,A0+(A-a0)*G/g0]);
/* the model's start: from rest at the release's swing; its swing at time t the mean of the turning points round it (two a period) */
const P=require('./physics.js'),gm=a=>Math.sqrt(a[0]*a[1]),TFM=P.TFm,SPLIT=process.argv.includes('--split')?(()=>{const a=P.Qm/gm(P.qAir),e=P.Qm/gm(P.qEnd);return[a,e,1-a-e];})():undefined;
if(SPLIT)console.log(`  the damping split at 255 deg (physics.js, the model's TF ${TFM} s): air ${SPLIT[0].toFixed(2)}, the endstone's constant friction ${SPLIT[1].toFixed(2)}, the rest viscous ${SPLIT[2].toFixed(2)}`);
const run=(s,TF,A0,T=70)=>{const a=sim({mode:'phys',T,from:T-1,s,TF,A:A0,split:SPLIT}).amps;return t=>{const k=Math.round(t/0.25),w=a.slice(Math.max(0,k-2),k+2);return w.reduce((x,y)=>x+y,0)/w.length/D;};};
const rms=(m,pts)=>Math.sqrt(pts.reduce((q,[t,A])=>q+(m(t-T0)-A)**2,0)/pts.length);
/* --chase (14 October 2026). The sound's stretches through the start (acoustic_stretches.json: the first click, the strike, the lock) read against the video's swing,
   not the model's timing: the first click taken as the discharge jewel meeting the trip spring (makeEsc's contact), the balance moving as A sin(4πt) through
   its centre, each interval turns into the balance's angle at the strike and the lock. Against makeEsc's landing (impulse(): its wheel let go from rest
   chases the jewel) with the wheel's acceleration scaled. Then the averaged build-up law d(A²)/dt = c w(A) - (2/TF) A², the escapement's work w falling
   linearly from 60° to 255° by the model's ratio (impulse()'s E), the clicks' (the model's landing moved as the clicks move it: about a third) and none,
   TF and the steady swing free, and TF held at the model's. And which event the loud click is: the strike, or the detent home on its stop button (its
   last landing, the bounces dying away), each interval's trend at the video's swing against dynamics.js's events with a constant offset allowed; and the
   steady stretch's return swing (acoustic.json: the jewel meeting the trip spring to the spring coming clear, which involves neither), read as a swing.
   The first click is taken as the jewel meeting the passing spring whatever the fit names it (with the detent home among its events, since 14 October
   2026, it names it the release; read from either, the landing's trend is the same) */
if(process.argv.includes('--chase')){const E=require('./escapement.js').build().ESC,M=E.measure(),w=E.run.cl.w,W0=4*Math.PI,rows=[];
  const S2=JSON.parse(fs.readFileSync(path.join(__dirname,'acoustic_stretches.json'),'utf8').replace(/\bNaN\b/g,'null')).recordings.We1dLNXiBj0.stretches;
  const vid=(t,A0,G)=>{let i=At.findIndex(p=>p[0]>=t);if(i<0)return null;if(i===0)i=1;const[p,q]=[At[i-1],At[i]];return A0+(p[1]+(q[1]-p[1])*(t-p[0])/(q[0]-p[0])-a0)*G/g0;};
  const fwd=(A,th0,ms)=>Math.asin(Math.min(1,Math.sin(Math.asin(th0/A)+W0*ms/1000)))*A;   /* the angle reached ms after th0, A and th in degrees */
  const land=(k,A)=>{const im=E.impulse(k,A*D,w);return im?im.land/D:NaN;};
  for(const r of S2){const p=r.corrected.pairs,f1=p['jewel meets passing spring']??p['wheel released'];if(p.strike==null||p.lock==null||f1==null)continue;const vm=vid(r.t,a0,g0),vh=vid(r.t,...curves.high);if(vm==null)continue;
    rows.push({t:r.t,d1:p.strike-f1,d2:p.lock-p.strike,vm,vh,sm:fwd(vm,M.contact,p.strike-f1),sh:fwd(vh,M.contact,p.strike-f1)});}
  console.log(`  the clicks through the start, read on the video's swing (first click: the discharge jewel meeting the trip spring, ${f(M.contact,1)}°; the release ${f(M.rel,1)}°)`);
  for(const q of rows)console.log(`    ${f(q.t)} s: the video ${f(q.vm)}° (middle) / ${f(q.vh)}° (likeliest); first click to strike ${f(q.d1,2)} ms, strike to lock ${f(q.d2,2)} ms: the strike at ${f(q.sm,1)}° / ${f(q.sh,1)}°, the model's tooth lands at ${f(land(1,q.vm),1)}° / ${f(land(1,q.vh),1)}°`);
  const span=k=>rows[rows.length-1][k]-rows[0][k],mv=a=>land(1,a);
  console.log(`  over ${f(span('vm'))}° of swing the strike moves ${f(span('sm'),1)}° (middle) / ${f(span('sh'),1)}° (likeliest); the model's tooth ${f(mv(rows[rows.length-1].vm)-mv(rows[0].vm),1)}°`);
  for(const k of[1,1.5,2,4,30])console.log(`    the wheel's acceleration × ${k}: lands at ${[100,200,255,300].map(A=>`${A}°: ${f(land(k,A),1)}`).join(', ')}; rms against the clicks ${f(Math.sqrt(rows.reduce((q,r)=>q+(land(k,r.vm)-r.sm)**2,0)/rows.length),2)}° (middle)`);
  const e=A=>E.impulse(1,A*D,w).E,rM=e(60)/e(255)-1,rC=rM*(1-span('sm')/(mv(rows[rows.length-1].vm)-mv(rows[0].vm)));
  const law=(A0,c,TF,k)=>{const o=[];let A2=A0*A0;for(let t=0;t<=70.01;t+=0.05){o.push(Math.sqrt(A2));A2+=0.05*(c*(1+k*(255-Math.sqrt(A2))/195)-2/TF*A2);}return o;};
  const rl=(m,pts)=>Math.sqrt(pts.reduce((q,[t,A])=>q+(m[Math.round((t-T0)/0.05)]-A)**2,0)/pts.length),cOf=(TF,Ai,k)=>2/TF*Ai*Ai/(1+k*(255-Ai)/195);
  console.log(`  the averaged build-up, the escapement's work at 60° ${f(1+rM,2)} times that at 255° (the model's), ${f(1+rC,2)} (the clicks'), 1 (flat):`);
  for(const[lab,k]of[['the model\'s',rM],['the clicks\'',rC],['flat',0]])for(const nm of['middle','high']){const[A0,G]=curves[nm],pts=series(A0,G);let b={r:1e9},b0={r:1e9};
    for(let TF=40;TF<=260;TF+=2)for(let Ai=230;Ai<=340;Ai+=2){const r=rl(law(A0,cOf(TF,Ai,k),TF,k),pts);if(r<b.r)b={TF,Ai,r};}
    for(let Ai=200;Ai<=340;Ai+=1){const r=rl(law(A0,cOf(TFM,Ai,k),TFM,k),pts);if(r<b0.r)b0={Ai,r};}
    console.log(`    ${lab.padEnd(12)} ${nm.padEnd(6)}: TF ${b.TF} s, settling at ${b.Ai}°, rms ${f(b.r,2)}°; at the model's ${TFM} s settling at ${b0.Ai}°, rms ${f(b0.r,2)}°`);}
  /* the loud click: the strike, or the detent home? */
  const evs=A0=>{const tr=[];sim({mode:'phys',T:1.6,from:1.5,trace:tr,s:1,A:A0});const e=tr.map(x=>[+x[0],x[1]]),t0=e.filter(x=>x[1]===4&&x[0]>0.6)[0][0],L=[];
    for(const[t,k]of e){const d=(t-t0)*1e3;if(d>=-1&&d<=40)L.push([k,d]);}const g=k=>{const x=L.find(([kk])=>kk===k);return x?x[1]:NaN;},h=L.filter(([k])=>k===3).map(x=>x[1]).filter(d=>d<g(1));return{strike:g(0),home:h[h.length-1],lock:g(1)};};
  const tr=(ms,mod)=>{const r=ms.map((x,i)=>x-mod[i]),m=r.reduce((a,b)=>a+b,0)/r.length;return[m,Math.sqrt(r.reduce((q,x)=>q+(x-m)**2,0)/r.length)];};
  console.log('  the loud click: each interval\'s offset and the rms its trend leaves (ms), at the video\'s swing');
  for(const nm of['middle','high']){const ev=rows.map(q=>evs(nm==='middle'?q.vm:q.vh));
    for(const c of['strike','home']){const[o1,r1]=tr(rows.map(q=>q.d1),ev.map(m=>m[c])),[o2,r2]=tr(rows.map(q=>q.d2),ev.map(m=>m.lock-m[c]));console.log(`    ${nm.padEnd(6)} as the ${c==='strike'?'strike':'detent home'}: first to loud ${f(o1,2)}, rms ${f(r1,2)}; loud to lock ${f(o2,2)}, rms ${f(r2,2)}`);}}
  try{const J=JSON.parse(fs.readFileSync(path.join(__dirname,'acoustic.json'),'utf8').replace(/\bNaN\b/g,'null')).recordings.We1dLNXiBj0,iv=J.intervals['jewel meets trip spring -> trip spring clear'];
    if(iv)console.log(`  the steady stretch's return swing (${J.stretch.join('-')}, acoustic.json): the jewel meets the trip spring to the spring coming clear ${f(iv.ms,2)} ms, read as ${f(iv.A)}° (${iv.A_range.map(v=>v==null||isNaN(v)?'-':f(v)).join(', ')} at ±1 sigma), involving neither click: the detent home's reading of the steady swing (6.3-6.4 ms from the first click, about 255°) would want 7.5 ms`);}catch(e){console.log("  (no return swing: "+e.message+")");}
  return;}
const TFS=[...new Set([52,TFM,80,120,160,200,260,320])].sort((a,b)=>a-b),SS=[0.45,0.5,0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9,0.95,1,1.05];   /* to 1.05: the model runs at 1 (its calibrated torque at 12 h), which since TF 68 s (12 October 2026) a fast run-down wants */
console.log(`  the video's start (swing.py, We1dLNXiBj0 0:55.4-2:03.4): ${At.length} points, ${f(a0)} to ${f(At[At.length-1][1])} deg on the middle reading`);
for(const[nm,[A0,G]]of Object.entries(curves)){
  const pts=series(A0,G),grid=[];
  for(const TF of TFS)for(const s of SS)grid.push({TF,s,r:rms(run(s,TF,A0),pts)});
  const best=grid.reduce((a,b)=>b.r<a.r?b:a),byTF=TFS.map(TF=>grid.filter(g=>g.TF===TF).reduce((a,b)=>b.r<a.r?b:a));
  const m=run(best.s,best.TF,A0,3*best.TF),Ainf=m(3*best.TF-1);   /* where that drive and damping settle: three run-downs on */
  const lo=Math.min(...byTF.filter(g=>g.r<=2*best.r).map(g=>g.TF)),i52=TFS.indexOf(TFM);   /* the least run-down that fits within twice the best's rms: a bound from below */
  console.log(`  ${nm.padEnd(6)} (start ${f(A0,1)}, growth ${f(G,1)}, ${f(pts[pts.length-1][1])} deg at 2:03.4): best TF ${best.TF} s at ${f(100*best.s)} % of the torque, rms ${f(best.r,1)} deg, settling at ${f(Ainf)} deg; `+
    `within twice that from TF ${lo} s${best.TF===TFS[TFS.length-1]?' up to the end of the grid (no bound from above)':''}; at the model's ${TFM} s the best is rms ${f(byTF[i52].r,1)} deg (${f(100*byTF[i52].s)} %)`);
  console.log('         per TF (best drive, rms): '+byTF.map(g=>`${g.TF}: ${f(100*g.s)} %, ${f(g.r,1)}`).join('; '));
  if(S.length&&nm==='high')console.log(`         against the sound's swings (acoustic.py --every, ${S.length} stretches): rms ${f(rms(run(best.s,best.TF,A0),S),1)} deg at that fit, ${f(rms(run(byTF[i52].s,TFM,A0),S),1)} at TF ${TFM}`);
}
