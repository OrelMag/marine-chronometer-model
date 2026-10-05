// The physics derived, not fitted (PLAN-self-contained.md, Phase A: A3 the energy budget, A4 the escape wheel with mass, A5 temperature from the materials).
// Needs only Node.js:   node physics.js      (under a second; exits with 1 if the budget can't close inside the ranges below, or a figure leaves the manual's)
// The model's numbers are read from movement.js and core.js where they are constants (the train's counts, the mainspring's section and length); the rest are
// the model's measured or computed figures checked elsewhere (invariants.py: the moment of inertia, the fusee's radii; tools/escapement.js: the amplitude),
// copied here with where they come from. Every assumption from outside the model (moduli, stresses, efficiencies, expansion coefficients) is a published
// range, named where it is used, and the result is given over the range, not at one value.
const fs=require('fs'),path=require('path'),rd=f=>fs.readFileSync(path.join(__dirname,'..','js',f),'utf8'),mv=rd('movement.js'),core=rd('core.js');
const TRAIN=Function('return '+/TRAIN=(\{[^}]*\})/.exec(mv)[1])(),MS={t:+/MSPRING=\{t:([\d.]+)/.exec(core)[1],len:+/MSPRING=\{[^}]*len:([\d.]+)/.exec(core)[1]};
const {build}=require('./escapement.js'),ESC=build().ESC,ESm=ESC.measure(),FU=ESC.run.fu,LIFT=ESm.lRel;   /* the model's escapement (shared/escapement.js through tools/escapement.js): unlocking's share of the work, the lift at release (mm) */
const rows=[];let fail=0;const say=s=>rows.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;rows.push(`${ok?'  ok ':'  !! '} ${s}`);},f=(x,n=2)=>x.toFixed(n),D=Math.PI/180;
const range=(fn,lo,hi)=>[fn(lo),fn(hi)].sort((a,b)=>a-b);

/* ---------- A3: the energy budget, mainspring to balance ---------- */
say('A3: the energy budget');
const I=578.5e-9,k=I*(4*Math.PI)**2,A=255*D,Eb=k*A*A/2;   /* the balance (Table II, invariants.py), its stiffness, the swing (tools/escapement.js), its energy */
const b=0.01355,t=MS.t/1000,L=MS.len/1000,E=207e9;   /* the mainspring: the parts list's 0.0165 in (0.419 mm); its width, 13.55 (the cap-side edge 1.45 under the cap's seat on KLUwI2UUCMQ 15:54: movement.js, MSY1); its length (estimated, 1,064); spring steel's modulus (207 GPa) */
const m1=2*Math.PI*E*b*t**3/(12*L);   /* its stiffness: N·m a turn, linear (a strip bent in its plane; set and coil friction left out) */
const IN=4.85,ratio=14.8/7.0,rB=17.6+0.45+0.04;   /* the barrel's turns over the 56 h (the chain's run on the drum), the fusee's run-down and full-wind radii (7.0, 14.8: invariants.py), the chain's pitch radius on the barrel */
/* the fusee is cut so its torque is even: pull x radius constant, so the spring's moment falls in the ratio of the radii over the barrel's IN turns. With the
   moment falling m1 a turn, Mup - IN m1 = Mup / ratio */
const Mup=IN*m1/(1-1/ratio),Mdn=Mup/ratio,sUp=6*Mup/(b*t*t),Tf=Mup*7.0/rB;
say(`the mainspring: ${f(m1*1000,1)} mN·m a turn (E b t³ / 12 L, 2π); the fusee's ${f(ratio,2)}:1 over ${IN} turns asks ${f(Mup,3)} N·m fully wound, ${f(Mdn,3)} run down`);
chk(sUp>1.2e9&&sUp<2.6e9,`its bending stress fully wound ${f(sUp/1e9,2)} GPa (6M / b t²): inside a hardened, tempered steel mainspring's working range (about 1.5-2.5 GPa)`);
say(`the fusee's even torque: ${f(Tf,3)} N·m at its wheel (the pull ${f(Mup/rB*1000,1)} N on the chain)`);
const ratioT=TRAIN.fu/TRAIN.cp*TRAIN.cw/TRAIN.tp*TRAIN.tw/TRAIN.fp*TRAIN.fw/TRAIN.ep;
const esc=eta=>Tf*0.95*eta**4/ratioT;   /* the chain and fusee 0.95; each of four stages eta (cycloidal teeth, jewelled or bushed pivots: 0.85-0.95) */
say(`the train fusee wheel to escape wheel ${f(ratioT,0)}:1; the escape wheel's torque ${range(esc,0.85,0.95).map(x=>f(x*1e6,0)).join('-')} µN·m (each stage 0.85-0.95)`);

/* ---------- A4: the escape wheel with mass: its chase onto the impulse jewel ---------- */
say('A4: the escape wheel with mass');
const J=4.80e-9;   /* the escape wheel, its pinion and arbor about their axis, kg·m²: the drawn solid in steel (7.85), integrated on the mesh (invariants.py checks this against it; 4.72e-9 before the arbor and pinion were measured, 4-5 October 2026) */
const rI=6.32/2/1000,rE=13.16/2/1000,wB=A*4*Math.PI;   /* the impulse roller's radius (0.249 in), the wheel's (13.16 mm), the balance's speed through the middle of its swing */
const chase=tq=>{const vJ=wB*rI,we=vJ/rE,a=tq/J,tc=we/a,phw=a*tc*tc/2,phb=wB*tc,ke=J*we*we/2;return{tc,phw,phb,ke};};
const c9=chase(esc(0.9));
say(`unlocked, the wheel must reach the jewel's speed (${f(wB*rI,3)} m/s at the roller, ${f(wB*rI/rE,1)} rad/s at the wheel): ${f(c9.tc*1000,1)} ms, ${f(c9.phw/D,1)}° of the wheel, ${f(c9.phb/D,1)}° of the balance (each stage 0.9)`);
chk(c9.phb<41*D,`the chase ends inside the impulse arc (the jewel driven from -20.6° to 20.7°, 41°: tools/escapement.js): ${f(c9.phb/D,1)}° of it is spent catching up`);
const Wtooth=tq=>tq*2*Math.PI/TRAIN.ew,etaE=tq=>{const c=chase(tq),W=Wtooth(tq);return Math.max(0,(W-c.ke)/W*(1-FU)*(1-ESm.drop/22.5));};   /* the tooth's work, less the wheel's speed lost when it strikes the jewel, the unlocking's share (FU) and the drop's degrees of each 22.5° */
say(`the escapement's own efficiency: ${f(100*etaE(esc(0.9)),0)} % (the strike, the unlocking ${f(100*FU,1)} %, the drop ${f(ESm.drop,1)}° of 22.5°)`);

/* ---------- A3 again: the balance's Q the budget needs ---------- */
const Pin=eta=>{const tq=esc(eta);return Wtooth(tq)*etaE(tq)*2;};   /* to the balance, W per oscillation x 2 a second */
const Qneed=eta=>2*Math.PI*Eb*2/Pin(eta),TF=Q=>Q*0.5/Math.PI;
const [q0,q1]=range(Qneed,0.85,0.95);
say(`the balance at 255°: ${f(Eb*1e3,3)} mJ; it is given ${range(Pin,0.85,0.95).map(x=>f(x*1e6,0)).join('-')} µW, so it holds 255° if its Q is ${f(q0,0)}-${f(q1,0)} (its free swing decaying in ${f(TF(q0),0)}-${f(TF(q1),0)} s)`);
const TFm=+/TF:([\d.]+)/.exec(fs.readFileSync(path.join(__dirname,'..','..','shared','escapement.js'),'utf8'))[1],Qm=Math.PI*TFm/0.5;   /* the model's, shared/escapement.js */
chk(q0<400&&q1>100,`the budget closes: that Q is inside a balance's (about 100-400, mechanical watch and chronometer balances in air)`);
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
const MODS={fusee:0.392,centre:0.3245,third:0.251,fourth:0.2614};   /* tools/solve.py: from the arbors' places and the counts */
const STG=[['centre',MODS.fusee,TRAIN.fu,TRAIN.cp,MODS.centre*TRAIN.cw/2,pvC],['third',MODS.centre,TRAIN.cw,TRAIN.tp,MODS.third*TRAIN.tw/2,pvT],['fourth',MODS.third,TRAIN.tw,TRAIN.fp,MODS.fourth*TRAIN.fw/2,pvF],['escape',MODS.fourth,TRAIN.fw,TRAIN.ep,rE*1000,pvE]];   /* the arbor driven, the module of its pinion's mesh, the driving wheel's teeth, its pinion's leaves, its own wheel's radius (mm; the escape wheel's to the tooth's tip), its pivots' radii */
const stage=(s,mp,mt,c)=>{const[,m,zw,zp,rw,p]=s,rp=m*zp/2,rpv=(p[0]+p[1])/2,dp=mp*rpv*(1/rp+1/rw),dm=mt*Math.PI*(1/zw+1/zp)*c;return{eta:(1-dp)*(1-dm),dp,dm};};
const lo=STG.map(s=>stage(s,0.15,0.20,1)),hi=STG.map(s=>stage(s,0.10,0.10,0.5)),Plo=lo.reduce((q,s)=>q*s.eta,1),Phi=hi.reduce((q,s)=>q*s.eta,1);
STG.forEach((s,i)=>say(`  the ${s[0]} arbor (pivots r ${s[5].join(', ')}): pivots ${f(100*hi[i].dp,1)}-${f(100*lo[i].dp,1)} %, mesh ${f(100*hi[i].dm,1)}-${f(100*lo[i].dm,1)} %: the stage ${f(lo[i].eta,3)}-${f(hi[i].eta,3)}`));
const etaEq=P=>P**0.25;   /* the even stage the four multiply to */
say(`the four stages together ${f(Plo,3)}-${f(Phi,3)} (as ${f(etaEq(Plo),3)}-${f(etaEq(Phi),3)} each), against the ${f(0.85**4,3)}-${f(0.95**4,3)} the budget assumed (0.85-0.95 each)`);
chk(etaEq(Plo)>=0.85-1e-9&&etaEq(Phi)<=0.97,`the train's efficiency from its pivots and teeth lies inside or at the top of the budget's assumed range`);
/* the balance's damping, each source over its range; its Q is 2 pi E / (the energy lost an oscillation, E the balance's at 255 deg), the losses adding as 1/Q */
const T0=0.5,w0=2*Math.PI/T0,Wmax=A*w0,cub=4/(3*Math.PI),rho=1.2;   /* the period, the balance's top speed (rad/s), the mean of |cos|³ over a period, air (kg/m³) */
const airQ=Cd=>{const parts=[[8,3.1e-3,[1.5e-3,2.5e-3],(BAL_RR+2)/1000],[2,2.1e-3,[2.3e-3,2.3e-3],(BAL_RR+0.35+1.15)/1000],[2,1.3e-3,[1.3e-3,1.3e-3],(BAL_RR-1.6)/1000]];   /* 8 screws' heads (2.9-3.2 across, KLUwI2UUCMQ 6:47.5; standing out 1.5-2.5), the 2 timing weights' nuts (TR, TWL), the 2 verniers inside the rim: count, across, length, radius */
  return[0,1].map(j=>{let E=0;for(const[n,d,Ls,r]of parts){const Af=d*Ls[j];E+=n*0.5*rho*Cd*Af*r**3*Wmax**3*T0*cub;}
    const arm=2*0.5*rho*Cd*1.1e-3*(BAL_RR/1000)**4/4*Wmax**3*T0*cub;return 2*Math.PI*Eb/(E+arm);});};   /* the arm edgewise (1.1 thick, to the rim): a pressure drag growing as r³ */
const BAL_RR=14.5,[qa0]=airQ(1.4),[,qa1]=airQ(0.8);   /* Cd 0.8-1.4: a short cylinder across the flow at Re about 180 (v 0.85 m/s, 3.1 mm) */
const qAir=[Math.min(qa0,qa1),Math.max(qa0,qa1)];
const mBal=[I/(13e-3)**2,I/(11e-3)**2],g=9.80665,Es=150e9;   /* the balance's mass from its moment of inertia, the radius of gyration 11-13 mm (the rim at 14.2, screws at 16.5, arm and hub inside): kg; steel on ruby, E* about 150 GPa */
/* the staff on its lower endstone (the chronometer dial up in its gimbals). The pivot's end is flat: on KLUwI2UUCMQ 7:08 it is its full 0.345 mm across 0.05 mm
   from the end (tools: the 7:08 trace, References/VIDEOS.md), so it bears on the endstone across its face, spin friction (2/3) mu W r; domed, it would be
   Hertz contact (3 pi / 16) mu W a, a few um across, and about 60 times less */
const endQ=(m,mu)=>2*Math.PI*Eb/(4*(2/3)*mu*m*g*(pvB[0]/1000)*A),qEnd=[endQ(mBal[1],0.15),endQ(mBal[0],0.10)];
const domeQ=2*Math.PI*Eb/(4*3*Math.PI/16*0.15*mBal[1]*g*Math.cbrt(3*mBal[1]*g*(pvB[0]/1000)/(4*Es))*A);
const sideQ=2*Math.PI*Eb/(2*0.15*(pvB[0]/1000)*2.4e-3*k*A*A/(5.1e-3));   /* the side friction the hairspring's residual force leaves at the swing (tools/hairspring.js: 2.4e-3 of couple / R at 270 deg) */
const qMat=[1000,5000];   /* the spring's own damping: Elinvar-type alloys' internal Q, about 1e3-5e3 (published, by treatment) */
const tot=(...q)=>1/q.reduce((s,x)=>s+1/x,0),qLo=tot(qAir[0],qEnd[0],sideQ,qMat[0]),qHi=tot(qAir[1],qEnd[1],sideQ,qMat[1]);
say(`the balance's damping: air on its screws, nuts and arm Q ${f(qAir[0],0)}-${f(qAir[1],0)}; its pivot's flat end on the endstone ${f(qEnd[0],0)}-${f(qEnd[1],0)} (domed, it would be ${f(domeQ,0)}); side friction from the spring ${f(sideQ,0)}; the spring itself ${qMat.join('-')}`);
const qN=P=>2*Math.PI*Eb*2/(Wtooth(Tf*0.95*P/ratioT)*etaE(Tf*0.95*P/ratioT)*2),qn=[qN(Phi),qN(Plo)].sort((a,b)=>a-b);
say(`together the balance's Q is ${f(qLo,0)}-${f(qHi,0)} (free decay ${f(TF(qLo),0)}-${f(TF(qHi),0)} s); with the train's efficiency from its parts the budget needs ${f(qn[0],0)}-${f(qn[1],0)} to hold 255°`);
chk(qLo<=qn[1]&&qHi>=qn[0],`the two overlap: the balance as built loses about what the train, as built, gives it (the model's TF ${TFm} s, Q ${f(Qm,0)}: ${Qm>=qLo&&Qm<=qHi?'inside':'outside'} the damping's range, ${Qm>=qn[0]&&Qm<=qn[1]?'inside':'outside'} the budget's)`);
say(`the swing the two give together: ${range(q=>Math.sqrt(q/qN(Math.sqrt(Plo*Phi)))*255,qLo,qHi).map(x=>f(x,0)).join('-')}° at the train's middle efficiency (the manual's 247.5-270°)`);
/* the mainspring's own losses, left out of its torque above (coil friction and set: about 5-15 % of the torque in a barrel spring, published): the budget then
   needs a higher Q, which is where the parts put it */
const qnM=[qN(Phi*0.95),qN(Plo*0.85)].sort((a,b)=>a-b);
say(`with the mainspring's own coil friction and set (5-15 %), the budget needs ${f(qnM[0],0)}-${f(qnM[1],0)}: against the parts' ${f(qLo,0)}-${f(qHi,0)}, the model's Q ${f(Qm,0)} in both`);
chk(Qm>=qLo&&Qm<=qHi,`the model's TF ${TFm} s is inside the decay the balance's parts give (${f(TF(qLo),0)}-${f(TF(qHi),0)} s): derived from the budget before, now from the friction and the air too`);

/* ---------- B2: the detent spring's share of the work, from the manual's test ---------- */
/* Op. 78: a 0.770 g weight hung on the locking jewel (Tool No. 8, Fig. 88) should just part the detent spring from its stop button: the spring is preloaded
   that much at the jewel. Unlocking lifts the jewel 0.20 mm (tools/escapement.js, at release), so the balance does at least the preload times the lift on the
   detent each oscillation, and it is lost when the detent falls back on its banking */
say('B2: the detent spring, from Op. 78');
const Fpre=0.770e-3*9.80665,lift=LIFT/1000,Wd=Fpre*lift,Wosc=eta=>Pin(eta)/2,fDmin=eta=>Wd/Wosc(eta),[fd0,fd1]=range(fDmin,0.85,0.95);
const fDm=+/fD:([\d.]+)/.exec(fs.readFileSync(path.join(__dirname,'..','..','shared','escapement.js'),'utf8'))[1];
say(`its preload ${f(Fpre*1000,2)} mN at the jewel; lifted ${f(LIFT,2)} mm it takes at least ${f(Wd*1e6,2)} µJ of the balance's ${range(Wosc,0.85,0.95).map(x=>f(x*1e6,1)).join('-')} µJ an oscillation: ${f(100*fd0,1)}-${f(100*fd1,1)} %`);
chk(fDm>=fd0*0.95,`the model takes the detent spring's share as ${f(100*fDm,1)} % (shared/escapement.js, fD): at least the test's preload over the lift`);

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
{const want={stage:`${f(etaEq(Plo),2)}-${f(etaEq(Phi),2)}`,Qparts:`${f(qLo,0)}-${f(qHi,0)}`,TFparts:`${f(TF(qLo),0)}-${f(TF(qHi),0)}`,Mup:f(Mup,2),sUp:f(sUp/1e9,2),esc:range(esc,0.85,0.95).map(x=>f(x*1e6,0)).join('-'),chase:f(c9.phb/D,0),Q:`${f(q0,0)}-${f(q1,0)}`,steelRate:f(-rate(eSt,aSt,aSt),1),comp:f(comp,1),eNeed:`${f(e0*1e6,0)} to ${f(e1*1e6,0)}`};
 const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8'),got={};for(const m of html.matchAll(/data-phys="(\w+)"[^>]*>([^<]*)</g))got[m[1]]=m[2];
 for(const[k,v]of Object.entries(want))chk(got[k]===v,`the essay quotes ${k} as ${got[k]??'(missing)'}: found ${v}`);}
console.log(rows.join('\n'));if(fail)process.exitCode=1;
