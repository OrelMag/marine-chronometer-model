// The Wempe's design values that rest on estimates, each swept over the range its sources allow with the bench's correction applied, to show a Wempe made to the model still
// works whichever value the real part turns out to have: estimates.js's method for the Wempe (Node.js, no browser). wempe_tolerances.js already sweeps the parts the
// drawings don't size (the mainspring's strip, the detent spring and its preload, the gold spring, the depth of lock, the hairspring's thickness) and keeps each range in the
// guard band; wempe_motionwork.js the cannon pinion's fit, wempe_overwind.js the key's coil spring. Here what is left:
//   1. the balance's free run-down (TF): the model's 111 s, set from a running 6MX's video (wempe_startup.json: 102-129 s at the model's swing), against 80-200 s (a made
//      balance's damping: its pivots, oil and air): unadjusted, the drawn strip's swing; with the strip the bench's run-down test chooses (wempe_bench.js: the drive as the
//      strip's thickness cubed), the swing over the whole wind against the guard band, the strip's stress against its limit, and the rate's spread over the wind;
//   2. the pivots' shake in their bushes (0.02-0.05, the drawn bores; the WN bush sheets aren't in the set: estimated) against each mesh's depthing window
//      (gearing_wempe.json): the hole position a CNC must then hold;
//   3. the hairspring's length, read from 05 03_7 four ways (WESC.HSL: "13 turns less 3.5 mm" as the whole strip, 14 and 15 turns, 13 turns of helix): the period each gives
//      and the length the bench's vibrating lets out or takes in for 0.5 s (wempe_bench.js's balance test), against the strip a maker leaves long;
//   4. the hairspring's outer terminal curve (05 03_7's table) formed by hand: a smooth error across it, its ends held, against the force it leaves on the pivots.
//   node wempe_estimates.js [--json OUT] [--fault]   (about 30 s; MC_WREV=build or build40 for a build's escapement, drive and tolerances; exits 1 if any value in its range
//                                                    leaves the Wempe short of working after the bench; --fault: the strip's stress limit taken 10 % under the model's
//                                                    own, which must fail)
const fs=require('fs'),path=require('path'),W=require('./wempe_load.js')(),{WPHYS:P,WESC}=W,E=P.ESC,S=P.SET;
const BREV=/^build/.test(process.env.MC_WREV||'')?process.env.MC_WREV:'',SUF=BREV?'_'+BREV:'',J=f=>JSON.parse(fs.readFileSync(path.join(__dirname,f),'utf8'));
const TOL=J(`tolerances_wempe${SUF}.json`),GW=J('gearing_wempe.json'),FAULT=process.argv.includes('--fault');
const D=180/Math.PI,f=(x,n=0)=>(+x).toFixed(n),rows=[],out={rev:BREV||'last'};let fail=0;const say=s=>rows.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;rows.push(`${ok?'  ok ':'  !! '} ${s}`);};
const G=TOL.band.guard,WD=TOL.band.wind,A12=TOL.band.wind.A12;
const sAt=(e,a)=>{let lo=0.3,hi=3;for(let i=0;i<30;i++){const md=(lo+hi)/2;e.ampAt(md)*D<a?lo=md:hi=md;}return(lo+hi)/2;};
say(`${BREV?`The ${BREV} build`:'As last revised'}: the swing ${f(TOL.band.wind.A[0],1)}-${f(TOL.band.wind.A[1],1)}° over the wind (the drive ${f(WD.dmin,4)}-${f(WD.dmax,4)} of 12 h's), the guard band ${G.join('-')}° (tolerances_wempe${SUF}.json)`);
/* ---------- 1. the balance's damping ---------- */
say('');say(`1. The balance's free run-down (TF): the model's ${S.TF} s`);
const sMax=FAULT?0.9:TOL.mainspring.sStress,T1=[];
/* the bench's choice (wempe_bench.js's run-down test: the guard's floor at the wind's lowest wants ×s193): the drawn strip kept if the swing over the wind stands 5° inside the guard band,
   else the strip that brings the nearer end 5° inside it */
const MG=5,pick=e=>{const a0=e.ampAt(WD.dmin)*D,a1=e.ampAt(WD.dmax)*D;if(a0>=G[0]+MG&&a1<=G[1]-MG)return 1;return a0<G[0]+MG?sAt(e,G[0]+MG)/WD.dmin:sAt(e,G[1]-MG)/WD.dmax;};
for(const TF of[...new Set([80,100,125,160,200,S.TF])].sort((a,b)=>a-b)){const e=TF===S.TF?E:W.makeEsc({...S,TF},S),A0=e.ampAt(1)*D,s=pick(e),lo=e.ampAt(s*WD.dmin)*D,hi=e.ampAt(s*WD.dmax)*D;
  const r0=e.rateAt(lo/D,s*WD.dmin),r1=e.rateAt(hi/D,s*WD.dmax);T1.push({TF,A0,s,t:Math.cbrt(s),A:[lo,hi],spread:r1-r0});}
say(`the drawn strip unadjusted: ${T1.map(r=>`TF ${r.TF} s ${f(r.A0)}°`).join(', ')}: the strip must suit the balance (wempe_bench.js's run-down test chooses it)`);
say(`with the strip the run-down test chooses, the drawn kept while the swing stands ${MG}° inside the guard band over the wind (${T1.map(r=>`×${f(r.s,3)} the drive, ×${f(r.t,3)} the thickness`).join('; ')}): the swing over the wind ${T1.map(r=>`${f(r.A[0])}-${f(r.A[1])}°`).join(', ')}; the rate's spread over the wind ${T1.map(r=>(r.spread>=0?'+':'')+f(r.spread,2)).join(', ')} s a day (daily the same, which the navigator's rate takes in)`);
chk(T1.every(r=>r.A[0]>=G[0]&&r.A[1]<=G[1]),`at every TF from ${T1[0].TF} to ${T1[T1.length-1].TF} s, with its strip chosen, the swing stays in the guard band over the whole wind`);
chk(T1.every(r=>r.s<=sMax),`and the strip it wants carries the drive within its stress: ×${f(Math.max(...T1.map(r=>r.s)),3)} at most against ×${f(sMax,3)}, the most the strip takes before its stress passes the limit (tolerances_wempe${SUF}.json)`);
out.tf=T1;
/* ---------- 2. the pivots' shake against the depthing windows ---------- */
say('');say('2. The pivots\' shake in their bushes (0.02-0.05, estimated) against each mesh\'s depthing window (gearing_wempe.json): the hole position a CNC must hold, (the close side − shake) / 2');
const T2=GW.stages.map(st=>{const c=Math.min(-st.lo,st.hi),tp=[0.02,0.035,0.05].map(sh=>(c-sh)/2);return{stage:st.stage,c,tp,drawn:st.sh};});
for(const r of T2)say(`  ${r.stage}: its close side ${f(r.c*1000)} µm; the holes to ±${r.tp.map(x=>f(x*1000)).join(', ±')} µm at a shake of 20, 35, 50 µm (as drawn ${f(r.drawn*1000)})`);
const tpMin=Math.min(...T2.map(r=>r.tp[2]));
chk(tpMin>=0.005,`at the loosest shake every mesh still leaves the holes ±${f(tpMin*1000,1)} µm or more: within a jig borer's or a good CNC's ±5 µm`);
out.shake=T2;
/* ---------- 3. the hairspring's length ---------- */
say('');say('3. The hairspring\'s length from 05 03_7, four readings (WESC.HSL): the period each gives (as the square root of the length, from the model\'s), and the length the bench lets out or takes in for 0.5 s');
const H0=WESC.HSL,T0=TOL.hairspring.T,L0=H0.L,T3=[];
for(const k of['n13','n14','n15','h13']){const q=H0[k];if(!q)continue;const T=T0*Math.sqrt(q.L/L0),Ln=q.L*(0.5/T)**2;T3.push({k,turns:q.turns,L:q.L,T,dL:Ln-q.L,rel:(Ln-q.L)/q.L});}
for(const r of T3)say(`  ${r.k}: ${f(r.turns,2)} turns, ${f(r.L,1)} mm: ${f(r.T,4)} s; for 0.5 s ${r.dL>=0?'let out':'take in'} ${f(Math.abs(r.dL),1)} mm (${f(100*Math.abs(r.rel),1)} %)`);
chk(T3.every(r=>r.rel<0.06),`a strip drawn 6 % long (estimated), vibrated against a master and pinned where it times, covers whichever reading is the sheet's: those that run fast want ${f(100*Math.max(0,...T3.map(r=>r.rel)),1)} % more strip at most, those that run slow are cut shorter`);
out.hs=T3;
/* ---------- 4. the outer terminal curve formed by hand ---------- */
say('');say('4. The hairspring\'s outer terminal curve (05 03_7\'s table into the stud), formed with an error: a smooth bump across it, its ends held');
const HS=require('./wempe_hairspring.js'),{HSPR}=require('../../shared/hairspring.js'),R=HS.R,n0=Math.round(220/0.25),pts0=HS.resample(HS.spring(H0.turns),0.15).pts,L4=pts0[pts0.length-1][2],s2=L4-(HS.curve?HS.curve.outer.l:30),i2=pts0.findIndex(p=>p[2]>=s2);
const bump=a=>{const n=pts0.length-1-i2;return pts0.map((p,i)=>{if(i<=i2||i===pts0.length-1)return p;const u=(i-i2)/n,j=Math.min(i+1,pts0.length-1),k0=Math.max(i-1,0),tx=pts0[j][0]-pts0[k0][0],ty=pts0[j][1]-pts0[k0][1],l=Math.hypot(tx,ty),w=a*Math.sin(Math.PI*u)**2;return[p[0]-ty/l*w,p[1]+tx/l*w,p[2]];});};
const T4=[0,0.1,0.2,0.5,1.0].map(a=>({a,lat:HSPR.lateral(bump(a),R).ratio}));
say(`the force on the pivots, × R over the couple: ${T4.map(r=>`${f(r.a,2)} mm off ${f(r.lat,3)}`).join(', ')} (wempe_hairspring.js fails the drawn spring past 0.1; the balance runs dial up in its gimbals, so the force bears on the pivots' sides)`);
const lim=T4.filter(r=>r.lat<0.1).pop();
chk(lim&&lim.a>=0.1,`formed to within ${lim?f(lim.a,2):'?'} mm of 05 03_7's table it leaves the pivots under 0.1: a maker forms it against a 10:1 drawing to a tenth of a millimetre`);
out.curve=T4;
out.rows=rows;module.exports=out;
if(require.main===module){console.log(rows.join('\n'));const jo=process.argv.indexOf('--json');if(jo>0)fs.writeFileSync(process.argv[jo+1],JSON.stringify(out));process.exitCode=fail;}
