// A real start against the model's: the balance of We1dLNXiBj0, turned by hand and let go at 0:55.2, its swing read frame by frame as the escapement builds
// it up (swing.py, swing.json's A_t), and the same start in dynamics.js's escapement in time, the drive s (times the calibrated torque) and the balance's free
// run-down TF (s, its damping) free. How fast the swing grows says how little the balance loses: the model's TF (52 s, physics.js's budget) against what this
// movement shows. Needs only Node.js and the two JSON files (swing.json from swing.py, acoustic_stretches.json from acoustic.py --every), so it runs without
// the video:
//   node startup.js            (about 5 minutes: 7 run-downs x 10 drives, each start integrated for 70 s; it reports, never fails)
//   node startup.js --split    (the same with the balance's damping in its parts, physics.js's shares at 255 deg: air 0.35, the endstone's friction 0.51,
//                               the rest viscous; dynamics.js's o.split: TF is then the run-down at 255 deg)
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
const SPLIT=process.argv.includes('--split')?[0.35,0.51,0.14]:undefined;
const run=(s,TF,A0,T=70)=>{const a=sim({mode:'phys',T,from:T-1,s,TF,A:A0,split:SPLIT}).amps;return t=>{const k=Math.round(t/0.25),w=a.slice(Math.max(0,k-2),k+2);return w.reduce((x,y)=>x+y,0)/w.length/D;};};
const rms=(m,pts)=>Math.sqrt(pts.reduce((q,[t,A])=>q+(m(t-T0)-A)**2,0)/pts.length);
const TFS=[52,80,120,160,200,260,320],SS=[0.45,0.5,0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9];
console.log(`  the video's start (swing.py, We1dLNXiBj0 0:55.4-2:03.4): ${At.length} points, ${f(a0)} to ${f(At[At.length-1][1])} deg on the middle reading`);
for(const[nm,[A0,G]]of Object.entries(curves)){
  const pts=series(A0,G),grid=[];
  for(const TF of TFS)for(const s of SS)grid.push({TF,s,r:rms(run(s,TF,A0),pts)});
  const best=grid.reduce((a,b)=>b.r<a.r?b:a),byTF=TFS.map(TF=>grid.filter(g=>g.TF===TF).reduce((a,b)=>b.r<a.r?b:a));
  const m=run(best.s,best.TF,A0,3*best.TF),Ainf=m(3*best.TF-1);   /* where that drive and damping settle: three run-downs on */
  const lo=Math.min(...byTF.filter(g=>g.r<=2*best.r).map(g=>g.TF)),i52=TFS.indexOf(52);   /* the least run-down that fits within twice the best's rms: a bound from below */
  console.log(`  ${nm.padEnd(6)} (start ${f(A0,1)}, growth ${f(G,1)}, ${f(pts[pts.length-1][1])} deg at 2:03.4): best TF ${best.TF} s at ${f(100*best.s)} % of the torque, rms ${f(best.r,1)} deg, settling at ${f(Ainf)} deg; `+
    `within twice that from TF ${lo} s${best.TF===TFS[TFS.length-1]?' up to the end of the grid (no bound from above)':''}; at the model's 52 s the best is rms ${f(byTF[i52].r,1)} deg (${f(100*byTF[i52].s)} %)`);
  console.log('         per TF (best drive, rms): '+byTF.map(g=>`${g.TF}: ${f(100*g.s)} %, ${f(g.r,1)}`).join('; '));
  if(S.length&&nm==='high')console.log(`         against the sound's swings (acoustic.py --every, ${S.length} stretches): rms ${f(rms(run(best.s,best.TF,A0),S),1)} deg at that fit, ${f(rms(run(byTF[i52].s,52,A0),S),1)} at TF 52`);
}
