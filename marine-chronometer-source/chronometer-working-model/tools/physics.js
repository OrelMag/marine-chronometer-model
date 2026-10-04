// The physics derived, not fitted (PLAN-self-contained.md, Phase A: A3 the energy budget, A4 the escape wheel with mass, A5 temperature from the materials).
// Needs only Node.js:   node physics.js      (under a second; exits with 1 if the budget can't close inside the ranges below, or a figure leaves the manual's)
// The model's numbers are read from movement.js and core.js where they are constants (the train's counts, the mainspring's section and length); the rest are
// the model's measured or computed figures checked elsewhere (invariants.py: the moment of inertia, the fusee's radii; tools/escapement.js: the amplitude),
// copied here with where they come from. Every assumption from outside the model (moduli, stresses, efficiencies, expansion coefficients) is a published
// range, named where it is used, and the result is given over the range, not at one value.
const fs=require('fs'),path=require('path'),rd=f=>fs.readFileSync(path.join(__dirname,'..','js',f),'utf8'),mv=rd('movement.js'),core=rd('core.js');
const TRAIN=Function('return '+/TRAIN=(\{[^}]*\})/.exec(mv)[1])(),MS={t:+/MSPRING=\{t:([\d.]+)/.exec(core)[1],len:(()=>{const Rw=17.6-0.46,ra=1.8,t=0.419,gap=0.01;return Math.round(Math.PI*(Rw**2-ra**2)/2/(t+gap));})()};
const {build}=require('./escapement.js'),ESC=build().ESC,ESm=ESC.measure(),FU=ESC.run.fu,LIFT=ESm.lRel;   /* the model's escapement (shared/escapement.js through tools/escapement.js): unlocking's share of the work, the lift at release (mm) */
const rows=[];let fail=0;const say=s=>rows.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;rows.push(`${ok?'  ok ':'  !! '} ${s}`);},f=(x,n=2)=>x.toFixed(n),D=Math.PI/180;
const range=(fn,lo,hi)=>[fn(lo),fn(hi)].sort((a,b)=>a-b);

/* ---------- A3: the energy budget, mainspring to balance ---------- */
say('A3: the energy budget');
const I=578.5e-9,k=I*(4*Math.PI)**2,A=255*D,Eb=k*A*A/2;   /* the balance (Table II, invariants.py), its stiffness, the swing (tools/escapement.js), its energy */
const b=0.0148,t=MS.t/1000,L=MS.len/1000,E=207e9;   /* the mainspring: the parts list's 0.0165 in (0.419 mm); its width, the barrel's room between the caps (14.8, fine.py's coils' extent); its length (estimated, 1,064); spring steel's modulus (207 GPa) */
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
const J=4.72e-9;   /* the escape wheel, its pinion and arbor about their axis, kg·m²: the drawn solid in steel (7.85), integrated on the mesh (invariants.py checks this against it) */
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
{const want={Mup:f(Mup,2),sUp:f(sUp/1e9,2),esc:range(esc,0.85,0.95).map(x=>f(x*1e6,0)).join('-'),chase:f(c9.phb/D,0),Q:`${f(q0,0)}-${f(q1,0)}`,steelRate:f(-rate(eSt,aSt,aSt),1),comp:f(comp,1),eNeed:`${f(e0*1e6,0)} to ${f(e1*1e6,0)}`};
 const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8'),got={};for(const m of html.matchAll(/data-phys="(\w+)"[^>]*>([^<]*)</g))got[m[1]]=m[2];
 for(const[k,v]of Object.entries(want))chk(got[k]===v,`the essay quotes ${k} as ${got[k]??'(missing)'}: found ${v}`);}
console.log(rows.join('\n'));if(fail)process.exitCode=1;
