// wempe_6mx_contact.js: the Soviet 6MX's electrical seconds contact as a load on the train (WEMPE-VARIANT-PHYSICS-GAPS.md, gap 13). Reports, never fails.
//   node wempe_6mx_contact.js [--json OUT]   (under a second; runs as the 6MX: MC_WREV=6mx is set here)
// The contact (wempe/README.md, The Soviet 6MX, "The electrical contact"; Romanov 1975, p. 208-209: "Волосок 59 осуществляет контакт между винтом 54 и диском 55", the
// spiral 59 a hairspring-like strip that is both the lead and the lever's return): the contact wheel 62 on the seconds arbor, 60 teeth, turns 3° a beat (half a tooth); on
// one beat a tooth's slope (r 9.3 to 10.2 over 55 % of the 6° pitch: train.js's c6r) lifts the lever's stone 61 and the lever 60 turns against the spiral, its screw 54 off
// the disc 55; on the next the radial face lets it fall and the spiral closes the contact. The seconds arbor moves only with the escape wheel (80/10: 8 times slower),
// so the lift takes its work out of one impulse in two. This works that load from the page's own geometry (WD.CONTACT6, train.js's c6r and C6K) through the 6MX's own
// makeEsc (WESC.SET6, wempe_inertia_6mx.json through wempe_load.js): the swing and rate against the contact's force at the screw. The spiral's section, its preload and
// so that force are given by no source (Romanov's figure doesn't dimension it, the TU gives only the current, 5 mA at 1.5-6 V): the force is swept, and bracketed by
// hairspring-like copper-alloy spirals of the measured size (7 turns, Ø 8.9: estimated sections).
process.env.MC_WREV='6mx';
const fs=require('fs'),W=require('./wempe_load.js')(),E=W.WPHYS.ESC,S=W.WPHYS.SET,C=W.WD.CONTACT6,D=Math.PI/180,G0=9.80665;
const ji=process.argv.indexOf('--json'),JOUT=ji>0?process.argv[ji+1]:null,f=(x,n=2)=>(+x).toFixed(n),J={made:new Date().toISOString().slice(0,10)};
/* the escape wheel's torque at the reference drive (dynamics.js's TAUE: run.cl.w times the balance's I w0²), N·m */
const I=S.I*1e-9,W0=2*Math.PI/E.T,TE=E.run.cl.w*I*W0*W0,DTH_E=2*Math.PI/15;   /* a beat moves the escape wheel one of its 15 teeth */
/* the lever (train.js): the stone's move out from the seconds arbor for a radian of the lever, C6K; the lift, the slope's 0.9 over 3.3° at r 9.3-10.2 less the stone's
   0.4 rest over the root, its chamfered end kept 0.08 clear: the stone 0.58 out at the tip */
const arm=[C.stone[0]-C.staff[0],C.stone[1]-C.staff[1]],la=Math.hypot(...arm),q=[C.stone[0],C.stone[1]-23],rq=Math.hypot(...q),C6K=Math.abs((-arm[1]*q[0]+arm[0]*q[1])/(la*rq))*la;
const RT=C.wheel.tip/2,RR=C.wheel.root/2,SLOPE=0.55*6*D,LIFT=RT-(RR+0.4)+0.08,THL=LIFT/C6K;   /* the lever's turn, rad */
const dRdS=(RT-RR)/SLOPE,GL=dRdS/C6K,PSI=Math.atan(dRdS/((RT+RR)/2));   /* the lever's turn for the seconds arbor's on the slope; the flank's angle to the tangent */
const MU=0.15,FF=Math.tan(PSI+Math.atan(MU))/Math.tan(PSI);   /* the stone (corundum) on the brass flank, mu 0.10-0.20 (0.15 taken, as the detent's stone on the tooth: estimated) */
const RS=Math.hypot(C.screw54.tip[0]-C.staff[0],C.screw54.tip[1]-C.staff[1])*1e-3;   /* the screw's point from the staff, m: the contact force's arm (taken whole: an upper bound on the moment for a force) */
/* the spiral 59: 7 turns, Ø 8.9 (measured), from the staff's collet (r about 1) out; a copper alloy strip (its colour: phosphor bronze or beryllium copper, E 110-130 GPa: 120 taken) */
const LSP=2*Math.PI*((4.45+1.0)/2)*7*1e-3,kSp=(t,b)=>120e9*b*1e-3*(t*1e-3)**3/12/LSP;
console.log(`\nThe 6MX's contact as a load on its train (the page's geometry, the 6MX's makeEsc)`);
console.log(`  the escape wheel's torque at the reference drive ${f(TE*1e6,1)} µN·m, a beat's turn ${f(DTH_E/D,0)}°: ${f(TE*DTH_E*1e6,1)} µJ a beat`);
console.log(`  the screw's travel off the disc ${f(RS*1e3*THL,2)} mm (unmeasured: the load scales with it; each row an upper bound for its force)`);
console.log(`  the lever: C6K ${f(C6K,2)} mm a radian (its stone arm ${f(la,2)}); the stone lifted ${f(LIFT,2)} mm (tip r ${RT}, rest r ${f(RR+0.4,1)}, 0.08 clear): the lever turns ${f(THL/D,1)}°`);
console.log(`  on the slope it turns ${f(GL,2)} rad for the seconds arbor's radian, ${f(GL/8,3)} for the escape wheel's (80/10); the flank ${f(PSI/D,1)}° to the tangent, so the stone's friction (mu ${MU}) adds ${f((FF-1)*100,0)} % to the work; the screw's point ${f(RS*1e3,1)} mm from the staff`);
J.geo={TE,C6K,LIFT,THL,GL,PSI,FF,RS,LSP};
/* the spirals of the measured size, sections estimated: the force at the screw for a preload of half a turn to one and a half */
const SPS=[[0.03,0.2],[0.05,0.3],[0.08,0.5]],PRE=[0.5,1,1.5];
console.log(`  hairspring-like spirals 7 turns Ø 8.9 (${f(LSP*1e3,0)} mm of strip, E 120 GPa), each preloaded ${PRE.join(', ')} turns: the contact's force at the screw`);
const band=[];for(const[t,b]of SPS){const k=kSp(t,b),Fs=PRE.map(p=>k*p*2*Math.PI/RS/G0*1e3);band.push(...Fs);console.log(`    ${t} × ${b} mm: k ${f(k*1e6,2)} µN·m a radian; ${Fs.map(x=>f(x,3)+' gf').join(', ')}`);}
J.spirals={SPS,PRE,band};
/* the load: on a lift beat the lever's moment M0 + k th over THL, times FF, out of the escape wheel's work that beat: the drive that beat 1 - d; the swing from makeEsc at the
   mean of the two beats' drives (the balance's energy averaged over its TF, 111 s, against a pair of beats), the escapement's rate makeEsc's at that mean drive. Each row is an
   upper bound for its force (the force's arm taken whole), and the load scales with the screw's travel off the disc (the arm times the lever's turn, about 1.15 mm), itself
   from three estimates: the contact wheel's root (Ø 18.6), the stone's rest 0.4 over it, and Fig. 100's arms */
const kMid=kSp(0.05,0.3),A0=E.ampAt(1),rows=[];
console.log(`  the drive taken by a lift, and the swing and rate (the drive the reference's, 12 h; 0.95-1.04 over the wind), the spiral's stiffness ${f(kMid*1e6,2)} µN·m a radian over the lift:`);
for(const gf of[0.05,0.1,0.2,0.5,1,2,3,5,10]){const M0=gf*1e-3*G0*RS,Wl=(M0*THL+kMid*THL*THL/2)*FF,d=Wl/(TE*DTH_E),pk=(M0+kMid*THL)*GL/8*FF/TE;
  const res=[0.95,1,1.04].map(s=>{const s2=s*(1-d/s),A=E.ampAt((s+Math.max(0,s2))/2),r=s2>0.26*s&&A>=E.AMIN?E.rateAt(A,(s+s2)/2)-E.rateAt(E.ampAt(s),s):null;   /* the escapement's rate steady at the mean drive (pairing rateAt(A, s) with a swing A not s's own scatters ±0.1 s a day) */return{s,A,dA:A-E.ampAt(s),dr:r,stall:s*(1-pk/s)<0.26};});
  const m=res[1];rows.push({gf,M0,W:Wl,d,pk,res});
  console.log(`    ${f(gf,2).padStart(5)} gf  M0 ${f(M0*1e6,2).padStart(7)} µN·m, ${f(Wl*1e9,2).padStart(7)} nJ a lift: ${f(d*100,2).padStart(6)} % of that beat's drive (the escape torque ${f(pk*100,1)} % less at the slope's steepest); the swing ${f(m.A/D,2)}° (${(m.dA>=0?'+':'')+f(m.dA/D,2)}°), the rate ${m.dr==null?'(none: a lift beat under the least drive)':(m.dr>=0?'+':'')+f(m.dr,3)+' s a day'}${res.some(x=>x.stall)?'; under the least drive (26 %) on a lift beat at '+res.filter(x=>x.stall).map(x=>x.s).join(', '):''}`);}
J.rows=rows;
const at=g=>rows.find(r=>r.gf===g),bmax=Math.max(...band);
const lim=rows.find(r=>r.res[1].dA<-1*D);
console.log(`  so a contact of up to ${f(bmax,2)} gf (the stiffest spiral, ${PRE[PRE.length-1]} turns) takes ${f(rows.filter(r=>r.gf<=Math.max(1,bmax)).slice(-1)[0].d*100,2)} % of a lift beat's drive or less;${lim?` the swing loses a degree from about ${lim.gf} gf`:''}`);
J.lim=lim?lim.gf:null;
if(JOUT)fs.writeFileSync(JOUT,JSON.stringify(J,null,1));
