// The design values that rest on estimates, each swept over the range its sources allow, with the bench's correction applied where it has one, to show the
// chronometer made to the model still works whichever value the real part turns out to have (OPEN-QUESTIONS.md, "Closed by design"; 14 October 2026):
//   1. the balance's free run-down (TF): the model's 67 s against 40-200 s (chronometer balances' Q 300-700; one real start reads 120 s and more). Unadjusted,
//      the drawn strip's swing; with the strip the bench's run-down test chooses, the swing, the escapement's isochronism and its own error at each;
//   2. the detent spring's and the trip spring's thicknesses, across the bench's ring band (the detent; Op. 78's looser bound reported) and 0.04 mm to the swing's
//      bound (the trip): the swing with the set-up turned to bring it back, the isochronism, and how far a held tooth's stone rings (tripping.json);
//   3. the discharge jewel's back radius, 0.066-0.158 mm: whether the adjusting screws (the lock's depth, the detent's place) and the trip spring's tip bent to
//      its figure bring Ops. 85-87's figures back at each;
//   4. the sustaining spring's band and lobes (the height ±0.02, each lobe ±15°, the gap 18-22°): its push, whether the drive still banks it, and the time it
//      keeps the balance over a turn (the manual's five to ten minutes);
//   5. the hairspring's upper terminal curve formed by hand: a smooth error across the curve, ends held, against the force it leaves on the pivots.
// Needs only Node.js (about 30 s):   node estimates.js [--json OUT]   exits 1 if any value in its range leaves the chronometer short of working after the bench.
const fs=require('fs'),path=require('path'),{build}=require('./escapement.js'),SU=require('./sustaining.js'),TJ=require('./tripping.json');
const D=Math.PI/180,f=(x,n=0)=>(+x).toFixed(n),rows=[],out={};let fail=0;const say=s=>rows.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;rows.push(`${ok?'  ok ':'  !! '} ${s}`);};
const E0=build().ESC,BAND=[247.5,270];
/* the escapement's rate against swing, s a day per 10°, across the band, at drive s0 (ampAt / rateAt) */
const sAt=(E,A)=>{let lo=0.3,hi=3;for(let i=0;i<50;i++){const m=(lo+hi)/2;E.ampAt(m)/D<A?lo=m:hi=m;}return(lo+hi)/2;};
const iso=E=>{const s1=sAt(E,BAND[0]),s2=sAt(E,BAND[1]);return E.rateAt(BAND[1]*D,s2)-E.rateAt(BAND[0]*D,s1);};
/* ---------- 1. the balance's damping ---------- */
say('1. The balance\'s free run-down (TF): the model\'s '+E0.settings.TF+' s');
const T1=[];for(const tf of[40,50,67,90,120,160,200]){const E=build({TF:tf}).ESC,s=E0.run.drive/E.run.drive,A0=E.ampAt(s)/D,q=Math.cbrt(1/s);
  T1.push({tf,A0,q,iso:iso(E),own:E.run.own});}
say(`the drawn strip unadjusted: ${T1.map(r=>`TF ${r.tf} s ${f(r.A0)}°`).join(', ')}: the band is ${BAND.join('-')}°, so the strip must suit the balance`);
say(`with the strip the run-down test chooses (${T1.map(r=>f(r.q,3)).join(', ')} times the drawn): the swing 255° at each; the escapement's rate over the band ${T1.map(r=>(r.iso>=0?'+':'')+f(r.iso,2)).join(', ')} s a day, its own error ${T1.map(r=>f(r.own,2)).join(', ')} (the timing takes it up)`);
chk(T1.every(r=>Math.abs(r.iso)<0.5),`at every TF from ${T1[0].tf} to ${T1[T1.length-1].tf} s, with its strip chosen, the escapement's isochronism over the manual's band stays under 0.5 s a day (the Navy's isochronism limit)`);
out.tf=T1;
/* ---------- 2. the detent's springs ---------- */
say('');say('2. The detent spring\'s and the trip spring\'s thicknesses (their stiffness as the cube, against the drawn 0.079 and 0.06 mm)');
const RB=TJ.ring.t,T2=[];for(const td of[RB[0],(RB[0]+RB[1])/2,RB[1]])for(const tp of[0.04,0.06,0.081]){const kd=(td/0.079)**3,kp=(tp/0.06)**3,a=E0.atK(1,kd,kp);
  let lo=0.3,hi=3;for(let i=0;i<40;i++){const m=(lo+hi)/2;E0.atK(m,kd,kp).A/D<255?lo=m:hi=m;}const s=(lo+hi)/2,r1=E0.atK(s*0.95,kd,kp),r2=E0.atK(s*1.11,kd,kp);
  T2.push({td,tp,A:a.A/D,s,isoK:(r2.rate-r1.rate),A1:r1.A/D,A2:r2.A/D});}
const rg=TJ.ring.rows.filter(r=>r.t>=RB[0]-1e-9&&r.t<=RB[1]+1e-9),lift=Math.max(...rg.map(r=>r.lift)),outB=TJ.ring.rows.filter(r=>r.t<RB[0]-1e-9||r.t>RB[1]+1e-9);
say(`unadjusted, the swing ${f(Math.min(...T2.map(r=>r.A)))}-${f(Math.max(...T2.map(r=>r.A)))}°; the set-up turned back to 255° asks ${f(Math.min(...T2.map(r=>r.s)),3)}-${f(Math.max(...T2.map(r=>r.s)),3)} of the drawn torque (Op. 53 gives about ±10 % a turn); the rate across the fusee's −5 to +11 % then ${f(Math.min(...T2.map(r=>r.isoK)),2)} to +${f(Math.max(...T2.map(r=>r.isoK)),2)} s a day`);
say(`a held tooth's stone rings up to ${f(100*lift,0)} % of the depth of lock for a detent spring in the bench's ring band, ${RB[0]}-${RB[1]} mm (${TJ.ring.band.map(x=>f(x,0)).join('-')} Hz; tripping.json; half is the limit); outside it, ${outB.map(r=>`${r.t} mm ${r.trips?'lets a tooth past':f(100*r.lift,0)+' %'}`).join(', ')}: Op. 78's bound (0.137 mm) is looser than the ring's, so the ring test, not Op. 78, keeps the detent safe`);
chk(T2.every(r=>r.s>0.75&&r.s<1.25&&Math.abs(r.isoK)<0.5)&&lift<0.5,`every detent spring the bench's ring test passes, with any trip spring from 0.04 to 0.081 mm, runs in the band with the set-up turned, isochronous to 0.5 s a day, and holds a tooth`);
out.det={rows:T2,lift};
/* ---------- 3. the discharge jewel's back radius ---------- */
say('');say('3. The discharge jewel\'s back radius (the British Museum: a radius on the back; no size); the model 0.158 mm');
const ES=E0.ES,mm=x=>x/ES,base=E0.settings,T3=[];
for(const rb of[0.066,0.105,0.132,0.158]){let made=null,adj=null;const tryo=o=>{try{const E=build(o).ESC,m=E.measure();if(!m.runs)return null;const cs=E.checks();return{ok:cs.every(c=>c.ok),m,bad:cs.filter(c=>!c.ok).map(c=>c.k)};}catch(e){return null;}};
  made=tryo({rB:mm(rb)});
  if(made&&made.ok)adj={dL:0,aD:0,rT:0};else for(const dL of[0,-0.001,0.001,-0.002,0.002])for(const aD of[0,-1,1,-2,2])for(const rT of[0,-0.01,0.01,-0.02,0.02]){if(adj)break;const r=tryo({rB:mm(rb),dL:base.dL+mm(dL),aD:base.aD+aD,rT:base.rT+mm(rT)});if(r&&r.ok)adj={dL,aD,rT,m:r.m};}
  T3.push({rb,made:made?{ok:made.ok,bad:made.bad,overall:made.m.overall,letoff:made.m.letoff}:null,adj});}
for(const r of T3)say(`back radius ${r.rb} mm: as drawn ${r.made?r.made.ok?'every figure in the manual\'s':`out on ${r.made.bad.join(', ')} (overall ${f(r.made.overall,1)}°, let-off ${f(r.made.letoff,1)}°)`:'won\'t run'}; ${r.adj?(r.adj.dL||r.adj.aD||r.adj.rT)?`brought in by the lock ${r.adj.dL>=0?'+':''}${r.adj.dL} mm, the detent ${r.adj.aD>=0?'+':''}${r.adj.aD}°, the trip spring's tip ${r.adj.rT>=0?'+':''}${r.adj.rT} mm`:'nothing to adjust':'not brought in by the screws and the tip'}`);
chk(T3.every(r=>r.adj),'at every radius the adjusting screws and the trip spring\'s tip bring the escapement to the manual\'s figures');
out.rb=T3;
/* ---------- 4. the sustaining spring ---------- */
say('');say('4. The sustaining spring: its band\'s height (1.25 designed), its lobes (estimated) and its gap (20° measured, rough)');
const F=SU.fn,T4=[],S0=SU.spring;for(const h of[S0.H-0.02,S0.H,S0.H+0.02])for(const dl of[-15,0,15])for(const g of[18,20,22]){const sfl=(62+dl)*D,swl=(35+dl)*D,sb=0.5*D,G=g*D,smax=G-sb,k=F.stiffOf({h,sfl,swl,sb}),P=k*smax/F.T0,q=F.sim(k,Math.min(F.T0/k,smax),3600);T4.push({h,dl,g,k,P,tTurn:q.tTurn,tStop:q.tStop});}
const P4=T4.map(r=>r.P),tt=T4.map(r=>r.tTurn/60);
say(`over the ${T4.length} combinations its push banked ${f(100*Math.min(...P4))}-${f(100*Math.max(...P4))} % of the drive, over a turn ${f(Math.min(...tt),1)}-${f(Math.max(...tt),1)} minutes, the train running ${f(Math.min(...T4.map(r=>r.tStop/60)),0)}-${f(Math.max(...T4.map(r=>r.tStop/60)),0)}`);
const weak=T4.filter(r=>r.tTurn<300),strong=T4.filter(r=>r.P>=0.95);
say(`${weak.length} combinations keep it over a turn under five minutes and ${strong.length} push 95 % or more (the drive's low reading may not bank them): the bench's maintaining test finds both (its ends standing open in running; under five minutes held), and the band is thinned or made up`);
chk(T4.every(r=>r.tTurn>=180)&&T4.every(r=>r.P<1.05),'none fails to carry the train through a wind (three minutes over a turn) or holds the drive off its banking by more than 5 %');
out.sus={rows:T4};
/* ---------- 5. the hairspring's upper curve formed by hand ---------- */
say('');say('5. The hairspring\'s upper terminal curve (designed to Phillips\' conditions, an S: no frame shows the real one), formed with an error');
const HS=require('./hairspring.js'),{HSPR}=require('../../shared/hairspring.js'),P=HS.P,R=HS.R,pts=P.pts,i2=pts.findIndex(p=>p[2]>=P.s2),T5=[];
const bump=a=>{const n=pts.length-1-i2;return pts.map((p,i)=>{if(i<=i2||i===pts.length-1)return p;const u=(i-i2)/n,j=Math.min(i+1,pts.length-1),k0=Math.max(i-1,0),tx=pts[j][0]-pts[k0][0],ty=pts[j][1]-pts[k0][1],l=Math.hypot(tx,ty),w=a*Math.sin(Math.PI*u)**2;return[p[0]-ty/l*w,p[1]+tx/l*w,p[2]];});};
for(const a of[0,0.05,0.1,0.2,0.3])T5.push({a,lat:HSPR.lateral(bump(a),R).ratio});
say(`the force on the pivots, × R over the couple: ${T5.map(r=>`${f(r.a,2)} mm off ${r.lat.toExponential(1)}`).join(', ')} (the curve as designed ${T5[0].lat.toExponential(1)}; the ramps the model drew before, 0.017; the balance runs dial up in its gimbals, so the force bears on the pivots' sides, not on the rate in positions)`);
const lim=T5.filter(r=>r.lat<0.017).pop();
chk(lim&&lim.a>=0.1,`formed to within ${lim?f(lim.a,2):'?'} mm of the drawing it leaves the pivots no more force than the plain ramps did: a maker forms it against a 10:1 drawing (the build book) to a tenth of a millimetre`);
out.hs=T5;
out.ring=TJ.ring.rows.map(r=>({t:r.t,f1:r.f1,lift:r.lift,trips:r.trips}));out.rows=rows;module.exports=out;
if(require.main===module){console.log(rows.join('\n'));const jo=process.argv.indexOf('--json');if(jo>0)fs.writeFileSync(process.argv[jo+1],JSON.stringify(out));process.exitCode=fail;}
