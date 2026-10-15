// The physics derived, not fitted (PLAN-self-contained.md, Phase A: A3 the energy budget, A4 the escape wheel with mass, A5 temperature from the materials).
// Needs only Node.js:   node physics.js      (under a second; exits with 1 if the budget can't close inside the ranges below, or a figure leaves the manual's)
// The model's numbers are read from movement.js and core.js where they are constants (the train's counts, the mainspring's section and length); the rest are
// the model's measured or computed figures checked elsewhere (invariants.py: the moment of inertia, the fusee's radii; tools/escapement.js: the amplitude),
// copied here with where they come from. Every assumption from outside the model (moduli, stresses, efficiencies, expansion coefficients) is a published
// range, named where it is used, and the result is given over the range, not at one value.
const fs=require('fs'),path=require('path'),rd=f=>fs.readFileSync(path.join(__dirname,'..','js',f),'utf8'),mv=rd('movement.js'),core=rd('core.js');
const TRAIN=Function('return '+/TRAIN=(\{[^}]*\})/.exec(mv)[1])(),MS={t:+/MSPRING=\{t:([\d.]+)/.exec(core)[1],len:+/MSPRING=\{[^}]*len:([\d.]+)/.exec(core)[1]};
const {build}=require("./escapement.js"),ESC=build().ESC,ESm=ESC.measure(),LIFT=ESm.lRel;   /* the model's escapement (shared/escapement.js through tools/escapement.js): unlocking's share of the work, the lift at release (mm) */
const rows=[];let fail=0;const say=s=>rows.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;rows.push(`${ok?'  ok ':'  !! '} ${s}`);},f=(x,n=2)=>x.toFixed(n),D=Math.PI/180;
const range=(fn,lo,hi)=>[fn(lo),fn(hi)].sort((a,b)=>a-b);

/* ---------- A3: the energy budget, mainspring to balance ---------- */
say('A3: the energy budget');
const I=578.5e-9,k=I*(4*Math.PI)**2,A=255*D,Eb=k*A*A/2;   /* the balance (Table II, invariants.py), its stiffness, the swing (tools/escapement.js), its energy */
const b=0.01355,t=MS.t/1000,L=MS.len/1000,E=207e9;   /* the mainspring: 0.394 mm, the videos' coils' pitch in the measured barrel (the parts list's 0.0165 in, 0.419 mm, until 12 October 2026: core.js MSPRING); its width, 13.55 (the cap-side edge 1.45 under the cap's seat on KLUwI2UUCMQ 15:54: movement.js, MSY1); its length (1,064: the videos' L/t, about 2,700); spring steel's modulus (207 GPa) */
const m1=2*Math.PI*E*b*t**3/(12*L);   /* its stiffness: N·m a turn, linear (a strip bent in its plane; set and coil friction left out) */
const IN=4.51,ratio=14.72/7.51,rB=18.3+0.45+0.04;   /* the barrel's turns while the chain leaves the fusee, its lever rising from 7.51 to 14.72 (makeFusee's INT, and its pitch line where it leaves the fusee, fully wound and as the last turn leaves; then the end pin swings round to run down: the groove's floor, 14.8 and 7.0, over 4.67 turns until 11 October 2026; 4.85 turns in the r 17.6 barrel until 5 October), the chain's pitch radius on the barrel */
/* the fusee is cut so its torque is even: pull x lever constant, so the spring's moment falls in the ratio of the levers over the barrel's IN turns. With the
   moment falling m1 a turn, Mup - IN m1 = Mup / ratio */
const Mup=IN*m1/(1-1/ratio),Mdn=Mup/ratio,sUp=6*Mup/(b*t*t),Tf=Mup*7.51/rB;   /* the fusee's torque: the pull fully wound on its smallest lever */
say(`the mainspring: ${f(m1*1000,1)} mN·m a turn (E b t³ / 12 L, 2π); the fusee's ${f(ratio,2)}:1 over ${IN} turns asks ${f(Mup,3)} N·m fully wound, ${f(Mdn,3)} run down`);
chk(sUp>1.2e9&&sUp<2.6e9,`its bending stress fully wound ${f(sUp/1e9,2)} GPa (6M / b t²): inside a hardened, tempered steel mainspring's working range (about 1.5-2.5 GPa)`);
say(`the fusee's even torque: ${f(Tf,3)} N·m at its wheel (the pull ${f(Mup/rB*1000,1)} N on the chain)`);
const ratioT=TRAIN.fu/TRAIN.cp*TRAIN.cw/TRAIN.tp*TRAIN.tw/TRAIN.fp*TRAIN.fw/TRAIN.ep;
const esc=eta=>Tf*0.95*eta**4/ratioT;   /* the chain and fusee 0.95; each of four stages eta (cycloidal teeth, jewelled or bushed pivots: 0.85-0.95) */
say(`the train fusee wheel to escape wheel ${f(ratioT,0)}:1; the escape wheel's torque ${range(esc,0.85,0.95).map(x=>f(x*1e6,0)).join('-')} µN·m (each stage 0.85-0.95)`);

/* ---------- A4: the escape wheel with mass: its chase onto the impulse jewel (the model's escapement, shared/escapement.js, which tools/dynamics.js checks beat by beat) ---------- */
say('A4: the escape wheel with mass');
const rE=13.16/2/1000;   /* the escape wheel's radius */
const J=4.80e-9;   /* the escape wheel, its pinion and arbor about their axis, kg·m²: the drawn solid in steel (7.85), integrated on the mesh (invariants.py checks this against it; 4.72e-9 before the arbor and pinion were measured, 4-5 October 2026) */
const RU=ESC.run,tqCal=RU.cl.w*ESC.kB,JW=ESC.settings.JW*1e-9;   /* the torque the model is calibrated at (255°); the wheel's inertia with the fourth wheel's reflected (shared/escapement.js JW) */
chk(JW>J&&JW<1.5*J,`the escapement's wheel inertia (${f(JW*1e9,2)} g·mm²) is the escape wheel's ${f(J*1e9,2)} and the train's behind it, reflected through the pinions (${f((JW-J)*1e9,1)}: their solids weighed, mechanisms.json, dynamics.js)`);
const chaseDeg=(RU.land-ESC.thRel)/D;
say(`unlocked at ${f(ESC.thRel/D,1)}°, the wheel starts from rest at ${f(tqCal/JW,0)} rad/s² (${f(tqCal*1e6,1)} µN·m, the model's): it catches the impulse jewel, already running away at ${f(RU.vj,1)} rad/s of the wheel, ${f(chaseDeg,1)}° of the balance later (at ${f(RU.land/D,1)}°), running ${f(RU.vw,1)} rad/s: it strikes the jewel`);
chk(RU.end!==null&&RU.end<ESC.A,`the impulse ends inside the swing (the tooth leaves the jewel at ${f(RU.end/D,1)}°)`);
const effE=Math.PI*ESC.A*ESC.A/RU.Q/(RU.cl.w*ESC.P);   /* what the balance nets an oscillation over the tooth's work, both in units of k */
say(`the escapement's own efficiency: ${f(100*effE,0)} % of the tooth's work reaches the balance (the strike ${f(100*RU.strike,1)} % of the impulse, the unlocking ${f(100*RU.fu,1)} %, of it the detent's ${f(100*RU.detent,1)} %, and the wheel's speed lost at each lock)`);

/* ---------- A3 again: the balance's Q the budget needs ---------- */
const kA=ESC.kB,Wn=tq=>ESC.wn(tq/tqCal,A);   /* the work an oscillation nets the balance at 255° with the escape wheel driven at tq (units of k) */
const Pin=eta=>Math.max(0,Wn(esc(eta)))*kA*2;   /* to the balance, W per oscillation x 2 a second */
const Qneed=eta=>2*Math.PI*Eb*2/Pin(eta),TF=Q=>Q*0.5/Math.PI;
const [q0,q1]=range(Qneed,0.85,0.95);
say(`the balance at 255°: ${f(Eb*1e3,3)} mJ; it is given ${range(Pin,0.85,0.95).map(x=>f(x*1e6,0)).join('-')} µW, so it holds 255° if its Q is ${f(q0,0)}-${f(q1,0)} (its free swing decaying in ${f(TF(q0),0)}-${f(TF(q1),0)} s)`);
const TFm=ESC.settings.TF,Qm=Math.PI*TFm/0.5;   /* the model's, shared/escapement.js */
chk(q0<450&&q1>100,`the budget closes: that Q is inside a balance's (about 100-400, mechanical watch and chronometer balances in air)`);
chk(Qm>=q0&&Qm<=q1,`the model's TF ${TFm} s (Q ${f(Qm,0)}, shared/escapement.js) is inside the budget's: it swings the balance ${f(Math.sqrt(Qm/Qneed(0.9))*255,0)}° at each stage's 0.9, ${range(eta=>Math.sqrt(Qm/Qneed(eta))*255,0.85,0.95).map(x=>f(x,0)).join('-')}° over 0.85-0.95 (the manual's 1⅜-1½ turns, 247.5-270°)`);

/* ---------- A6: friction from the measured parts (the second round's pivots and jewels; ASSESSMENT-2026-10-05.md, next step 1) ---------- */
/* Each stage's efficiency from its parts instead of the 0.85-0.95 assumed above: the driven arbor's pivots carry the pinion's and the wheel's tooth loads,
   T (1/r_pinion + 1/r_wheel), and lose mu_p r_pivot of it (each pivot taking half, so the mean radius); the mesh loses about mu_t pi (1/z_wheel + 1/z_pinion) c,
   c 0.5-1 (cycloidal action, mostly after the line of centres; the textbooks' estimate). mu_p 0.10-0.15: oiled steel in ruby or brass; mu_t 0.10-0.20: hardened
   steel leaves against brass teeth, run dry (watch trains aren't oiled at the teeth). The pivots are the model's (movement.js), the modules tools/solve.py's */
say('A6: friction from the measured parts');
const pv=re=>{const m=re.exec(mv);if(!m)throw Error('not found in movement.js: '+re);return m.slice(1).map(Number);};
const pvC=pv(/R\.cw=hn\(arbor[^;]*?prof:\[\[TB_T-0\.1,([\d.]+)\],\[TB_U\+0\.025,[\d.]+\],\[y0-0\.125,([\d.]+)\]/),pvT=pv(/R\.tw=hn\(arbor[^;]*?prof:\[\[TB_T-0\.1,([\d.]+)\],\[TB_U\+0\.025,[\d.]+\],\[LT_H-2\.025,([\d.]+)\]/),
  pvF=pv(/R\.fw=hn\(arbor[^;]*?prof:\[\[LB_T\+2\.56,([\d.]+)\],\[LB_T\+3\.025,[\d.]+\],\[LT_H-2\.025,([\d.]+)\]/),pvE=pv(/R\.esc=hn\(arbor[^;]*?prof:\[\[TB_T\+SEAT_D\+0\.025,([\d.]+)\],\[TB_T\+SEAT_D\+0\.6,[\d.]+\],\[-0\.6,([\d.]+)\]/),pvB=pv(/const PV=([\d.]+),yT=CK_T/);
const MODS={fusee:0.392,centre:0.3245,third:0.251,fourth:0.2457};   /* tools/solve.py: from the arbors' places and the counts */
const STG=[['centre',MODS.fusee,TRAIN.fu,TRAIN.cp,MODS.centre*TRAIN.cw/2,pvC],['third',MODS.centre,TRAIN.cw,TRAIN.tp,MODS.third*TRAIN.tw/2,pvT],['fourth',MODS.third,TRAIN.tw,TRAIN.fp,MODS.fourth*TRAIN.fw/2,pvF],['escape',MODS.fourth,TRAIN.fw,TRAIN.ep,rE*1000,pvE]];   /* the arbor driven, the module of its pinion's mesh, the driving wheel's teeth, its pinion's leaves, its own wheel's radius (mm; the escape wheel's to the tooth's tip), its pivots' radii */
const stage=(s,mp,mt,c)=>{const[,m,zw,zp,rw,p]=s,rp=m*zp/2,rpv=(p[0]+p[1])/2,dp=mp*rpv*(1/rp+1/rw),dm=mt*Math.PI*(1/zw+1/zp)*c;return{eta:(1-dp)*(1-dm),dp,dm};};
const lo=STG.map(s=>stage(s,0.15,0.20,1)),hi=STG.map(s=>stage(s,0.10,0.10,0.5)),Plo=lo.reduce((q,s)=>q*s.eta,1),Phi=hi.reduce((q,s)=>q*s.eta,1);
STG.forEach((s,i)=>say(`  the ${s[0]} arbor (pivots r ${s[5].join(', ')}): pivots ${f(100*hi[i].dp,1)}-${f(100*lo[i].dp,1)} %, mesh ${f(100*hi[i].dm,1)}-${f(100*lo[i].dm,1)} %: the stage ${f(lo[i].eta,3)}-${f(hi[i].eta,3)}`));
const etaEq=P=>P**0.25;   /* the even stage the four multiply to */
say(`the four stages together ${f(Plo,3)}-${f(Phi,3)} (as ${f(etaEq(Plo),3)}-${f(etaEq(Phi),3)} each), against the ${f(0.85**4,3)}-${f(0.95**4,3)} the budget assumed (0.85-0.95 each)`);
chk(etaEq(Plo)>=0.85-1e-9&&etaEq(Phi)<=0.97,`the train's efficiency from its pivots and teeth lies inside or at the top of the budget's assumed range`);
/* the balance's damping, each source over its range; its Q is 2 pi E / (the energy lost an oscillation, E the balance's at 255 deg), the losses adding as 1/Q */
const T0=0.5,w0=2*Math.PI/T0,Wmax=A*w0,cub=4/(3*Math.PI),rho=1.2;   /* the period, the balance's top speed (rad/s), the mean of |cos|³ over a period, air (kg/m³) */
const airQ=Cd=>{const parts=[[8,3.1e-3,[1.5e-3,2.5e-3],(BAL_RR+2)/1000],[2,2.1e-3,[2.3e-3,2.3e-3],(BAL_RR+0.534+1.15)/1000],[2,1.3e-3,[1.3e-3,1.3e-3],(BAL_RR-1.6)/1000]];   /* 8 screws' heads (2.9-3.2 across, KLUwI2UUCMQ 6:47.5; standing out 1.5-2.5), the 2 timing weights' nuts (TR, TWL, TG at mid-travel), the 2 verniers inside the rim: count, across, length, radius */
  return[0,1].map(j=>{let E=0;for(const[n,d,Ls,r]of parts){const Af=d*Ls[j];E+=n*0.5*rho*Cd*Af*r**3*Wmax**3*T0*cub;}
    const arm=2*0.5*rho*Cd*1.1e-3*(BAL_RR/1000)**4/4*Wmax**3*T0*cub;return 2*Math.PI*Eb/(E+arm);});};   /* the arm edgewise (1.1 thick, to the rim): a pressure drag growing as r³ */
const BAL_RR=14.5,[qa0]=airQ(1.4),[,qa1]=airQ(0.8);   /* Cd 0.8-1.4: a short cylinder across the flow at Re about 180 (v 0.85 m/s, 3.1 mm) */
const qAir=[Math.min(qa0,qa1),Math.max(qa0,qa1)];
const mBal=[I/(13e-3)**2,I/(11e-3)**2],g=9.80665,Es=150e9;   /* the balance's mass from its moment of inertia, the radius of gyration 11-13 mm (the rim at 14.2, screws at 16.5, arm and hub inside): kg; steel on ruby, E* about 150 GPa */
/* the staff on its endstone, and any other constant friction: measured (12 October 2026). BunnSpecial's No. 2182 (Jd2c3x8VKsE 14:04.3-14:12.5 and 16:10.4-16:17.1,
   the mainspring let down and the Navy stop off, dial down, so the staff stands on one endstone as it does dial up in the gimbals; References/VIDEOS.md) swings
   freely from 2.2° and 2.0°, too little to meet the trip spring (its first contact at -26.8°: escapement.js), and its swing falls in a straight line, 0.238 ± 0.003 and
   0.231 ± 0.004° a second (an exponential misses by 0.25° rms against 0.03°; 0.16-0.22 with a viscous term let free beside it), period 0.498 s. That is a constant
   friction torque Mc: each half swing it takes 2 Mc / k off the amplitude, so 4 Mc / k a period and Mc = k c T / 4, with c the fall a second and k the hairspring's
   stiffness with Table II's balance (578.5 g·mm² at 2 Hz). At 255° it loses 4 Mc A an oscillation. One movement, not yet cleaned, so if anything high.
   Before (until 12 October 2026) it was worked out: the pivot's flat end (on KLUwI2UUCMQ 7:08 its full 0.345 mm across 0.05 mm from the end) bearing on the
   endstone across its face, spin friction (2/3) mu W r at mu 0.10-0.15, which loses 10-20 times what the video shows; domed, it would be Hertz contact
   (3 pi / 16) mu W a, a few um across, about three times less than the video shows */
const cF=[0.16,0.238],Mc=cF.map(c=>k*c*D*0.498/4),qEnd=Mc.map(m=>2*Math.PI*Eb/(4*m*A)).sort((a,b)=>a-b);
const endQ=(m,mu)=>2*Math.PI*Eb/(4*(2/3)*mu*m*g*(pvB[0]/1000)*A),qFlat=[endQ(mBal[1],0.15),endQ(mBal[0],0.10)],muEff=[Mc[1]/((2/3)*mBal[0]*g*pvB[0]/1000),Mc[1]/((2/3)*mBal[1]*g*pvB[0]/1000)];
const domeQ=2*Math.PI*Eb/(4*3*Math.PI/16*0.15*mBal[1]*g*Math.cbrt(3*mBal[1]*g*(pvB[0]/1000)/(4*Es))*A);
const sideQ=2*Math.PI*Eb/(2*0.15*(pvB[0]/1000)*2.4e-3*k*A*A/(5.1e-3));   /* the side friction the hairspring's residual force leaves at the swing (tools/hairspring.js: 2.4e-3 of couple / R at 270 deg) */
const qMat=[1000,5000];   /* the spring's own damping: Elinvar-type alloys' internal Q, about 1e3-5e3 (published, by treatment) */
const tot=(...q)=>1/q.reduce((s,x)=>s+1/x,0),qLo=tot(qAir[0],qEnd[0],sideQ,qMat[0]),qHi=tot(qAir[1],qEnd[1],sideQ,qMat[1]);
say(`the balance's constant friction, measured (Jd2c3x8VKsE 14:04, 16:10): its free swing falls ${cF.join('-')}° a second, ${f(Mc[0]*1e9,0)}-${f(Mc[1]*1e9,0)} nN·m (k c T / 4): Q ${f(qEnd[0],0)}-${f(qEnd[1],0)} at 255°, ${f(100*Qm/qEnd[1],0)}-${f(100*Qm/qEnd[0],0)} % of the model's loss there; `+
  `a flat end bearing across its face at mu 0.10-0.15 would give Q ${f(qFlat[0],0)}-${f(qFlat[1],0)} (the measured friction is that of mu ${f(muEff[1],3)}-${f(muEff[0],3)} on it), a domed end ${f(domeQ,0)}`);
chk(qEnd[0]>qFlat[1]&&qEnd[1]<domeQ,`the measured friction lies between a flat end's and a domed end's (the pivot's end bears over less than its whole face, or its oil film carries part of the load)`);
say(`the balance's damping: air on its screws, nuts and arm Q ${f(qAir[0],0)}-${f(qAir[1],0)}; the endstone and any constant friction ${f(qEnd[0],0)}-${f(qEnd[1],0)} (measured); side friction from the spring ${f(sideQ,0)}; the spring itself ${qMat.join('-')}`);
const qN=P=>2*Math.PI*Eb*2/(Math.max(0,Wn(Tf*0.95*P/ratioT))*kA*2),qn=[qN(Phi),qN(Plo)].sort((a,b)=>a-b);
say(`together the balance's Q is ${f(qLo,0)}-${f(qHi,0)} (free decay ${f(TF(qLo),0)}-${f(TF(qHi),0)} s); with the train's efficiency from its parts the budget needs ${f(qn[0],0)}-${f(qn[1],0)} to hold 255°`);
/* the mainspring's own losses, left out of its torque above: its coils' friction running, worked out on the solved spring (mainspring_friction.py: 2.7-5.4 % of its work over
   the fusee's turns at mu 0.08-0.16), up to what mainsprings measure (running 10-20 % under winding, ICMFF9: winding M (1 + x), running M (1 - x), x up to 0.2 / 1.8 = 11 %), which takes in the strip's edges on the
   barrel's floor and cap and the steel's own hysteresis too (5-15 %, a published range, until 12 October 2026): the budget then
   needs a higher Q. Until 12 October 2026 the parts' Q (202-390, the endstone's friction worked out for a flat end) met the budget without them; with the
   endstone's friction measured (a tenth of that), the balance loses less than the train would give a loss-free spring (the swing below), and only the whole
   budget, the spring's own losses in it, meets what the parts give */
const MF=JSON.parse(require('fs').readFileSync(require('path').join(__dirname,'mainspring_friction.json'),'utf8')).summary,mLo=MF.loss['0.08'],mHi=Math.max(MF.loss['0.16'],0.2/1.8);
const qnM=[qN(Phi*(1-mLo)),qN(Plo*(1-mHi))].sort((a,b)=>a-b),inM=Qm>=qnM[0]&&Qm<=qnM[1];
say(`the swing they would give a spring without its own losses: ${range(q=>Math.sqrt(q/qN(Math.sqrt(Plo*Phi)))*255,qLo,qHi).map(x=>f(x,0)).join('-')}° at the train's middle efficiency (the manual's 247.5-270°)`);
say(`with the mainspring's own losses (${f(100*mLo,1)}-${f(100*mHi,0)} %: its coils' friction, mainspring_friction.py, to what mainsprings measure, running 10-20 % under winding), the budget needs ${f(qnM[0],0)}-${f(qnM[1],0)}: against the parts' ${f(qLo,0)}-${f(qHi,0)}, the model's Q ${f(Qm,0)} ${inM?'inside':'outside'} it; the swing ${range(q=>Math.sqrt(q/qN(Math.sqrt(Plo*Phi)*0.9))*255,qLo,qHi).map(x=>f(x,0)).join('-')}° at the train's middle efficiency and 10 %`);
chk(qLo<=qnM[1]&&qHi>=qnM[0]&&inM,`the two overlap: the balance as built loses about what the train, as built, gives it, the mainspring's own losses counted (the model's TF ${TFm} s, Q ${f(Qm,0)}: ${Qm>=qLo&&Qm<=qHi?'inside':'outside'} the damping's range, inside the budget's)`);
chk(Qm>=qLo&&Qm<=qHi,`the model's TF ${TFm} s is inside the decay the balance's parts give (${f(TF(qLo),0)}-${f(TF(qHi),0)} s): derived from the budget before, now from the friction and the air too`);

/* ---------- B2: the detent spring, from the manual's test ---------- */
/* Op. 78: a 0.770 g weight hung on the locking jewel (Tool No. 8, Fig. 88) should part the detent spring from its stop button by about 0.005 in (p. 61): the
   spring is preloaded at the jewel by that weight less what its stiffness takes over the 0.005 in, and the model's detent is (shared/escapement.js W78, G78;
   the whole weight until 14 October 2026). The balance lifts it against that preload and its stiffness as far as the
   discharge jewel carries it, well past the release, and the work is lost when the detent falls back on its stop */
say('B2: the detent spring, from Op. 78');
{const rJm=Math.hypot(ESC.Jc.x-ESC.Ft.x,ESC.Jc.y-ESC.Ft.y),Fpre=ESC.MP*ESC.kB/(rJm*ESC.ES*1e-3),rel=Fpre*(LIFT/1000)*rJm/ESC.LEN,mx=Math.max(...ESC.LI)/ESC.lRel,Wd=RU.detent*RU.Wi*kA;
  say(`its preload ${f(Fpre*1000,2)} mN at the jewel (Op. 78's ${f(ESC.settings.W78,3)} g less the spring's ${f(ESC.KD*ESC.th78*ESC.kB*1e6,1)} µN·m over its ${f(ESC.settings.G78,3)} mm bend at the stop button); to the release (${f(LIFT,2)} mm at the passing spring's tip) that is ${f(rel*1e6,2)} µJ, but the jewel carries the detent on to ${f(mx,2)} times that lift: ${f(Wd*1e6,2)} µJ an oscillation, ${f(100*RU.detent,1)} % of the impulse`);
  chk(RU.detent>0&&RU.detent<0.25,`the detent's share leaves the escapement running at the manual's swing`);}

/* ---------- A5: temperature from the materials ---------- */
say('A5: temperature from the materials');
/* the rate's change a °C: df/f = (e + 3 αs - 2 αb) / 2, e the spring's thermoelastic coefficient (dE/E dT), αs its expansion, αb the balance's (the moment of
   inertia goes as its radius squared); k = E b t³ / 12 L, so k grows as e + (1 + 3 - 1) αs */
const rate=(e,as,ab)=>(e+3*as-2*ab)/2*86400;   /* s a day a °C */
const aEl=8e-6,aSt=11.5e-6,aSS=[10e-6,17e-6],aInv=1.2e-6;   /* Elinvar-type alloys about 8; carbon steel 11.5; stainless (martensitic to austenitic) 10-17; Invar 1.2 (× 10⁻⁶ a °C) */
const eSt=-2.5e-4;   /* a carbon steel spring's thermoelastic coefficient, about -250 × 10⁻⁶ a °C */
say(`a plain steel spring on a steel balance: ${f(rate(eSt,aSt,aSt),1)} s a day a °C (${f(rate(eSt,aSt,aSt)/1.8,1)} a °F): why a chronometer with one needs a compensating balance`);
/* the Model 21: an Elinvar spring on a stainless rim held by an Invar arm. The rim's radius grows between the arm's (Invar) and its own (stainless) expansion; the
   spring's e, set by its heat treatment, must cancel it */
const eNeed=ab=>2*ab-3*aEl;const [e0,e1]=range(eNeed,aInv,aSS[1]);
say(`the Model 21: for no linear error the spring's thermoelastic coefficient must be ${f(e0*1e6,0)} to ${f(e1*1e6,0)} × 10⁻⁶ a °C (the balance's expansion between the Invar arm's and the stainless rim's)`);
chk(e0>-60e-6&&e1<60e-6,`inside what an Elinvar-type spring is heat-treated to (about ±50 × 10⁻⁶ a °C round zero): the linear term is the spring maker's to set, as Table IV's screw moves then trim it`);
/* the split bimetallic balance with a steel spring (PLAN D2 b): the rim's free ends come in by R² Δκ (1 - cos φ), Δκ = 1.5 Δα ΔT / h (Timoshenko, two equal
   layers); the screws, most of the moment, stand near φ 90° on average, so the moment falls by 2 d / R of the share on the arcs */
const R0=14.5,h=1.6,dA=19e-6-11.5e-6,d=R0*R0*1.5*dA/h,share=0.8,dIrel=2*d/R0*share,comp=dIrel/2*86400;
say(`a split bimetallic rim (brass 19 on steel 11.5, 1.6 thick, r 14.5, the model's variant): the free ends come in ${f(d*1000,2)} µm a °C, gaining ${f(comp,1)} s a day a °C`);
const need=-rate(eSt,aSt,aSt);
chk(comp>0.3*need&&comp<1.7*need,`against the ${f(need,1)} s a day a °C a steel spring loses: ${f(100*comp/need,0)} % with the screws at 90° on average; moving them toward the free ends (or the rim's thickness) brings it to 100 % (Table IV's job)`);
/* the essay quotes these (spans data-phys="…" in index.html, "What the model gives a maker" and "Materials, hardening and tools"): each must be what is found here */
{const want={stage:`${f(etaEq(Plo),2)}-${f(etaEq(Phi),2)}`,Qparts:`${f(qLo,0)}-${f(qHi,0)}`,TFparts:`${f(TF(qLo),0)}-${f(TF(qHi),0)}`,Mup:f(Mup,2),sUp:f(sUp/1e9,2),esc:range(esc,0.85,0.95).map(x=>f(x*1e6,0)).join('-'),chase:f(chaseDeg,0),TFm:f(TFm,0),Q:`${f(q0,0)}-${f(q1,0)}`,steelRate:f(-rate(eSt,aSt,aSt),1),comp:f(comp,1),eNeed:`${f(e0*1e6,0)} to ${f(e1*1e6,0)}`};
 const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8'),got={};for(const m of html.matchAll(/data-phys="(\w+)"[^>]*>([^<]*)</g))got[m[1]]=m[2];
 for(const[k,v]of Object.entries(want))chk(got[k]===v,`the essay quotes ${k} as ${got[k]??'(missing)'}: found ${v}`);}
/* for dynamics.js, strength.js and errorbudget.js: the fusee's torque, the train's ratio and efficiencies, the balance's damping from its parts */
module.exports={Tf,Mup,Mdn,sUp,ratioT,Plo,Phi,qLo,qHi,qAir,qEnd,Mc,sideQ,qMat,Eb,MS,b,E,IN,rB,TFm,Qm,I,k,A,mBal,J,MODS,STG,TRAIN};
if(require.main===module){console.log(rows.join('\n'));if(fail)process.exitCode=1;}
