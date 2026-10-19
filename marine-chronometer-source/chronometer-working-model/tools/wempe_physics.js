// The Wempe's energy budget (phase 2b), as tools/physics.js for the Hamilton: from its mainspring through the fusee and chain, the going train and the escapement to the
// balance's damping, each from the Wempe's own parts, and whether the measured drive (05 06_20) closes it. Needs only Node.js:
//   node wempe_physics.js      (about 30 s: the Wempe's escapement solves slowly; exits 1 if the budget can't close inside the ranges below)
// Reads: the Wempe's page scripts through wempe_load.js (WD, WESC, WPHYS: the escapement, the measured drive, the train's parts); wempe_mainspring.json (the spring solved
// by mainspring.py and fitted to 05 06_20 by wempe_mainspring.py); mainspring_friction_wempe.json (its coils' friction); gearing_wempe.json (gearing.js --model wempe: each
// mesh tooth by tooth). Every number from outside the sheets is a published range or an estimate, said where it is used, and the result is given over its range.
const fs=require('fs'),path=require('path'),J=f=>JSON.parse(fs.readFileSync(path.join(__dirname,f),'utf8')),has=f=>fs.existsSync(path.join(__dirname,f));
const W=require('./wempe_load.js')(),{WPHYS:P}=W,E=P.ESC,S=P.SET,D=Math.PI/180,TAU=2*Math.PI;
const rows=[];let fail=0;const say=s=>rows.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;rows.push(`${ok?'  ok ':'  !! '} ${s}`);},note=(ok,s)=>rows.push(`${ok?'  ok ':'  ~~ '} ${s}`),head=s=>rows.push('\n'+s);
const f=(x,n=2)=>Number.isFinite(x)?x.toFixed(n):'-',rg=(a,b,n=2,k=1)=>`${f(Math.min(a,b)*k,n)}-${f(Math.max(a,b)*k,n)}`;
const MSJ=J('wempe_mainspring.json'),FN=MSJ.final;if(!FN)throw Error('wempe_mainspring.json has no final spring: python wempe_mainspring.py --final L');
const MF=has('mainspring_friction_wempe.json')?J('mainspring_friction_wempe.json').summary:null,GW=has('gearing_wempe.json')?J('gearing_wempe.json'):null;
const b=MSJ.strip.b/1000,t=MSJ.strip.t/1000,EGPa=MSJ.strip.E,G0=9.80665;
const HPT=P.HPT,xOf=h=>P.MF-h/HPT,tqAt=(x,k=1)=>{const q=FN.tq;const u=x/0.25,i=Math.max(0,Math.min(q.length-2,Math.floor(u))),w=u-i;return q[i][k]*(1-w)+q[i+1][k]*w;};   /* the solved spring's fusee arbor torque at fusee turn x (k 1 frictionless, 2 less its coils' friction) */
const RF=[17.25,9.30],RB=41.6/2+1.02;   /* the fusee's groove radii at its ends (05 06_20) and the chain's pitch radius on the drum (05 07 01-1, 05 07 04: 1.02 out) */

/* ---------- 1. the mainspring: solved, against the drawing ---------- */
head('1. The mainspring, solved (mainspring.py) and fitted to the drawing (wempe_mainspring.py)');
{const tr=MSJ.tries.filter(x=>x.set===1);
  say(`the strip ${MSJ.strip.t} × ${MSJ.strip.b} (05 06_20) in the drum's Ø 38.5 on the core's Ø 13.3 (05 07 01-1, 05 07 02); its length on no sheet: solved at ${MSJ.tries.map(x=>x.L+(x.set!==1?` (set ×${x.set})`:'')).join(', ')} mm`);
  for(const x of MSJ.tries)say(`  ${x.L} mm${x.set!==1?`, its free curve's turns ×${x.set}`:''}: slack at ${f(x.slack)} turns; set up ¾ turn and wound ${f(MSJ.barrelTurns)} barrel turns its fusee arbor's torque against 05 06_20's ${f(100*x.rms,2)} % rms (worst ${f(100*x.max,1)} %), measured over solved ${f(x.eta,3)}`);
  if(MSJ.Lfit){const nr=MSJ.tries.reduce((a,x)=>Math.hypot((x.L-MSJ.Lfit)/100,x.set-MSJ.setFit)<Math.hypot((a.L-MSJ.Lfit)/100,a.set-MSJ.setFit)?x:a);
    say(`a quadratic in the length and the set through the tries near the best (it misses them by ${f(100*MSJ.surf,2)} % rms) has its least at ${f(MSJ.Lfit,0)} mm and ×${MSJ.setFit}${MSJ.edge?' (held at the edge of the tries)':''}, ${f(100*MSJ.rmsFit,2)} %; solved there (${nr.L} mm, ×${nr.set}) the spring fits ${f(100*nr.rms,2)} %: the solves scatter by about a percent (the energy nearly flat, mainspring.py), so the length is fitted to about ±50 mm, and the model takes the best solved, ${FN.L} mm ×${FN.set}`);}
  say(`the drawn fusee and drum take ${f(MSJ.barrelTurns,3)} barrel turns over the fusee's 8.75 (05 06_20 marks 5; its barrel marks fall at ${MSJ.marks.map(m=>m[2]).join(', ')} turns from full wind against its ${MSJ.marks.map(m=>m[1]).join(', ')}): the sheet's fusee and its barrel agree to 0.08 turn`);
  const flat=(()=>{const g=FN.fit.map(r=>r[1]),m=g.reduce((a,x)=>a+x,0)/g.length;return Math.sqrt(g.reduce((a,x)=>a+(x/m-1)**2,0)/g.length);})();
  say(`the model's spring (mainspring_wempe.js, ${FN.L} mm, its free curve's turns ×${FN.set}): slack at ${f(FN.slack)} turns, run down (¾ turn set up) ${f(FN.Tdown)}, fully wound ${f(FN.Tup)} (the table solves to ${FN.top}, coil-bound past it); its torque ${f(FN.Mdown*1000,0)} mN·m run down to ${f(FN.Mfull*1000,0)} fully wound (${f(FN.Mfull/FN.Mdown,2)}:1)`);
  note(FN.rms<flat,`through the drawn fusee it gives the fusee arbor 05 06_20's profile to ${f(100*FN.rms,2)} % rms (worst ${f(100*FN.max,1)} %; the sheet's own reading ±0.7 g, 0.5 %), against ${f(100*flat,2)} % for an even pull: set up 0.65 / 0.85 turn ${f(100*FN.su[0],2)} / ${f(100*FN.su[1],2)} %`);
  const U=FN.tq.reduce((a,r,i,q)=>i?a+(r[1]+q[i-1][1])/2*TAU*0.25:0,0);
  say(`the work it gives the fusee arbor over the wind, frictionless: ${f(U,2)} J (${f(U/(P.MF*HPT*3600)*1e6,1)} µW over ${f(P.MF*HPT,1)} h)`);}

/* ---------- 2. the fusee, chain and barrel: the losses to the fusee arbor ---------- */
head('2. The fusee, chain and barrel: what reaches the fusee arbor');
const LS=(()=>{const mu=[0.10,0.15],cf=MF?[MF.loss['0.08'],MF.loss['0.16']]:[0.02,0.05],coil=[cf[0],Math.max(cf[1],0.2/1.8)];
  /* the spring's own losses: its coils' friction worked out on the solved spring, up to what mainsprings measure (running 10-20 % under winding, ICMFF9: x up to 0.2/1.8),
     which takes in the strip's edges on the barrel's floor and lid and the steel's own hysteresis too: as physics.js takes the Hamilton's */
  /* the barrel turns on its arbor's journals (Ø 4.48 in the drum's bosses, 05 07 02 and 05 07 01) under the chain's pull: mu r_j / its lever on the drum */
  const barrel=mu.map(m=>m*2.24/RB);
  /* the chain's links turn on their rivets (Ø 0.55, 05 07 04) as they leave the drum and come onto the fusee: mu r (1/rho_b + 1/rho_f), rho_f its mean lever */
  const rhoF=(RF[0]+RF[1])/2+1.02,chain=mu.map(m=>m*0.275*(1/RB+1/rhoF));
  /* the fusee arbor's pivots (Ø 2.8 in the pillar plate, the journal Ø 4.5 in the fusee bush: 05 06 04-1) carry the pull: mu r / rho_f, r their mean; whether the lever on
     the arbor (05 06_20) counted them depends on the rig, which the sheet doesn't draw: 0 to that (estimated) */
  const fusee=[0,mu[1]*(1.4+2.25)/2/rhoF];
  const lo=(1-coil[1])*(1-barrel[1])*(1-chain[1])*(1-fusee[1]),hi=(1-coil[0])*(1-barrel[0])*(1-chain[0])*(1-fusee[0]);
  say(`the mainspring's coils, rubbing as it runs down (mainspring_friction.py on the solved spring, mu 0.08-0.16${MF?'':': not yet run, the Hamilton\'s 2-5 %'}): ${rg(cf[0],cf[1],1,100)} % of its work (winding against running ${MF?rg(MF.hyst['0.08'],MF.hyst['0.16'],1,100):'-'} %); with the strip's edges and the steel's hysteresis, up to what mainsprings measure, ${rg(coil[0],coil[1],1,100)} %`);
  say(`the barrel on its arbor's journals (r 2.24) under the chain's pull: ${rg(barrel[0],barrel[1],2,100)} %; the chain's links on their rivets (r 0.275) on and off the drums: ${rg(chain[0],chain[1],2,100)} %; the fusee arbor's pivots (mean r 1.8), if the lever counted them: 0-${f(100*fusee[1],2)} % (mu 0.10-0.15, oiled steel on brass)`);
  say(`together the fusee arbor gets ${rg(lo,hi,3)} of the spring's frictionless torque`);return{lo,hi,coil,barrel,chain,fusee};})();
/* the level: the measured (05 06_20, the losses in it) over the solved frictionless; the solve's torque scales with E t³, the modulus 200-210 GPa (207 taken) and the strip's
   thickness 0.37 untoleranced (its 7 a little overwritten: 0.365-0.375 taken), so the losses it implies lie over that range */
const LV=(()=>{const kE=[200/EGPa*(0.365/0.37)**3,210/EGPa*(0.375/0.37)**3],kW=200/EGPa*(0.35/0.37)**3,imp=[FN.eta/kE[1],FN.eta/kE[0]],ov=imp[1]>=LS.lo&&imp[0]<=LS.hi,ovW=FN.eta/kW>=LS.lo&&imp[0]<=LS.hi;
  /* the strip that closes it at the losses' middle and 207 GPa: t (eta / middle)^(1/3) */
  const tMid=0.37*Math.cbrt(FN.eta/Math.sqrt(LS.lo*LS.hi));
  say(`05 06_20's mean, ${f(P.KV.reduce((a,x)=>a+x[1],0)/P.KV.length,1)} g on 262 mm, is ${f(FN.eta,3)} of the solved spring's frictionless torque at ${EGPa} GPa and 0.370 mm; over 200-210 GPa and 0.365-0.375 mm the losses it implies are ${rg(1-imp[1],1-imp[0],1,100)} % (the model's estimate ${rg(1-LS.hi,1-LS.lo,1,100)} %); at the losses' middle it asks a strip ${f(tMid,3)} thick at 207 GPa`);
  if(ov)chk(true,`the level closes: the measured torque is what the solved strip gives less the losses worked out above, within the modulus's and the thickness's ranges`);
  else{chk(ovW,`the level closes only toward a thinner strip: 0.35-0.36 (05 06_20's "0,37" has its 7 written over another figure) or the losses at their top; the shape, not the level, sets the fit (README)`);if(ovW)note(false,`the level, with the strip 0.365-0.375: the losses it implies don't meet the estimate`);}
  /* the spring at the level 05 06_20 measures (its losses taken out at their middle): the solved shape, the measured strength */
  const Kl=FN.eta/Math.sqrt(LS.lo*LS.hi),MupM=FN.Mfull*Kl,sS=6*FN.Mfull/(b*t*t),sM=6*MupM/(b*t*t);
  note(sS<2.6e9,`as solved (0.37, 207 GPa) the strip's bending stress fully wound is ${f(sS/1e9,2)} GPa (6M / b t²)${sS<2.6e9?'':`: past a steel mainspring's limit, about 2.5-2.6 GPa (strength.js), so the strip as solved can't be the strip: thinner or less stiff, as the level says`}`);
  chk(sM>1.5e9&&sM<2.6e9,`at the measured level (×${f(Kl,3)}: ${f(MupM*1000,0)} mN·m fully wound, ${f(FN.Mdown*Kl*1000,0)} run down) ${f(sM/1e9,2)} GPa in the 15 × 0.37 strip (2a's planning estimate 2.2): inside a hardened, tempered steel mainspring's working range, about 1.5-2.5 GPa (physics.js)`);
  return{imp,kE,tMid,Kl,MupM};})();
/* the build's mainspring (MC_WREV=build: WESC.BUILD.strip, the user's choice, 19 October 2026): its own solved table (wempe_mainspring.py --t), its torque the table's times
   E/207, set up as the drawn spring (¾ turn) and wound the drawn fusee's barrel turns; it must give the build's drive (WESC.KB times the measured, the losses at their middle
   as above) and stay under its alloy's limit */
const BS=W.WESC.BSEL&&W.WESC.BSEL.strip?(()=>{const B=W.WESC.BSEL.strip,d=JSON.parse(/const MSHAPE=(\{.*?\});/s.exec(fs.readFileSync(path.join(__dirname,B.table),'utf8'))[1]),kE=B.E/207;
  const ip=(T)=>{const q=d.T;let i=0;while(i<q.length-2&&q[i+1]<T)i++;const w=(T-q[i])/(q[i+1]-q[i]);return(d.pull[i]*(1-w)+d.pull[i+1]*w)*d.M1*kE;};
  let sl=d.T0;for(let i=0;i+1<d.T.length;i++)if(d.pull[i]<=0&&d.pull[i+1]>0)sl=d.T[i]-d.pull[i]*(d.T[i+1]-d.T[i])/(d.pull[i+1]-d.pull[i]);
  const Td=sl+0.75,Tu=Td+MSJ.barrelTurns,Md=ip(Td),Mu=ip(Tu),want=FN.Mfull*LV.Kl*W.WESC.KB,s=6*Mu/(b*(B.t/1000)**2);
  head(`The build's mainspring: ${B.name} ${B.t} × ${MSJ.strip.b} × ${FN.L} mm (WESC.BUILD.strip)`);
  say(`solved (${B.table}) at ${B.E} GPa: ${f(Md*1000,0)} mN·m run down to ${f(Mu*1000,0)} fully wound (${f(Mu/Md,2)}:1); fully wound at the turn ${f(Tu,2)} of a table solved to ${d.T[d.T.length-1]} (coil-bound past it)`);
  chk(Math.abs(Mu/want-1)<0.03,`it gives the build's drive: fully wound ${f(Mu*1000,0)} mN·m against ${f(want*1000,0)} (the drawn spring's at the measured level, ${f(FN.Mfull*LV.Kl*1000,0)}, times ${W.WESC.KB}), within 3 %`);
  chk(s<B.lim,`its bending stress fully wound ${f(s/1e9,2)} GPa (6M / b t²), under ${B.name}'s ${f(B.lim/1e9,1)} GPa: margin ${f(B.lim/s,2)}`);
  return{B,Md,Mu,s,Kl:Mu/FN.Mfull};})():null;

/* ---------- 3. the going train ---------- */
head('3. The going train, fusee wheel to escape pinion (90/14 · 90/12 · 80/10 · 80/10)');
const TR=(()=>{const piv=(st,mp)=>{const[m,,zp,rw,p]=st;return 1-mp*(p[0]+p[1])/2*(2/(m*zp)+1/rw);},est=(st,mt,c)=>1-mt*Math.PI*(1/st[1]+1/st[2])*c;
  const names=['the centre arbor','the intermediate','the seconds','the escape arbor'];let lo=1,hi=1;
  P.STG.forEach((st,i)=>{const pl=piv(st,0.15),ph=piv(st,0.10),g=GW&&GW.stages[i].eff,ml=g?g[2]/g[0]:est(st,0.20,1),mh=g?g[1]/g[0]:est(st,0.10,0.5);lo*=pl*ml;hi*=ph*mh;
    say(`${names[i].padEnd(17)} pivots (r ${st[4].join(', ')}) ${rg(1-ph,1-pl,1,100)} %, its mesh ${rg(1-mh,1-ml,1,100)} %${g?` (tooth by tooth, gearing.js --model wempe: its mean torque ratio at mu 0.10-0.20 over the frictionless)`:' (estimated, mu pi (1/z1 + 1/z2) c)'}: the stage ${rg(pl*ml,ph*mh,3)}`);});
  say(`the train ${rg(lo,hi,3)} (escphys.js's ${f(P.ETA_LO,3)}-${f(P.ETA_HI,3)}, the model taking ${f(P.ETA,3)}${GW?`; the meshes worked tooth by tooth put the model's at ${f(Math.sqrt(lo*hi),3)}`:''})`);
  if(GW)chk(Math.abs(P.ETA-Math.sqrt(lo*hi))<5e-4&&Math.abs(P.ETA_LO-lo)<5e-4&&Math.abs(P.ETA_HI-hi)<5e-4,`the model's train efficiency ${f(P.ETA,3)} (escphys.js's MESH) is the train worked tooth by tooth, ${f(Math.sqrt(lo*hi),3)}, its range ${rg(lo,hi,3)} (after gearing.js --model wempe --write, copy its meshes' ratios into MESH)`);
  else note(P.ETA>=lo&&P.ETA<=hi,`the model's train efficiency ${f(P.ETA,3)} (escphys.js) lies inside the range the parts give`);return{lo,hi};})();
const escFrom=(fus,eta)=>fus/P.RATIO*eta*1e6,hrs=Array.from({length:57},(_,i)=>i);   /* the escape wheel's torque, µN·m */
{const n12=12/HPT,x12=P.MF-n12,mes=P.fusT(n12),sol=[tqAt(x12)*LV.kE[0]*LS.lo,tqAt(x12)*LV.kE[1]*LS.hi];
  say(`at 12 h from full wind (fusee turn ${f(x12)}): the fusee arbor measured ${f(mes*1000,1)} mN·m, the solved spring less the losses ${rg(sol[0],sol[1],1,1000)} mN·m`);
  say(`the escape wheel's torque: from the measured drive ${rg(escFrom(mes,TR.lo),escFrom(mes,TR.hi),1)} µN·m (2a's ${f(P.TQ,1)} at its ${f(P.ETA,3)}, ${rg(Math.min(...hrs.map(h=>P.escT(h/HPT))),Math.max(...hrs.map(h=>P.escT(h/HPT))),1)} over the wind); from the solved spring ${rg(escFrom(sol[0],TR.lo),escFrom(sol[1],TR.hi),1)} µN·m`);}

/* ---------- 4. the escapement: what a beat costs and gives ---------- */
head('4. The escapement at the reference drive (12 h from full wind)');
const kB=E.kB,w=E.run.cl.w,A=E.A,Wt=w*E.P,Wn=E.wn(1,A),u=E.run;
{const Eb=kB*A*A/2;
  say(`the escape wheel's ${f(S.TQ,1)} µN·m through a tooth's ${f(E.P/D,0)}° each oscillation: ${f(Wt*kB*1e6,2)} µJ; the balance nets ${f(Wn*kB*1e6,2)} µJ of it at ${f(A/D,1)}° (${f(100*Wn/Wt,0)} %): the strike ${f(100*u.strike,1)} % of the impulse, the unlocking ${f(100*u.fu,1)} % (the detent's spring and preload ${f(100*u.detent,1)} %), the rest the wheel's speed lost at each lock`);
  say(`the balance at ${f(A/D,1)}°: ${f(Eb*1e6,1)} µJ (k ${f(kB*1e6,0)} µN·m a radian, I ${S.I} g·mm²); it loses 2π/Q of it an oscillation, at the model's TF ${S.TF} s (Q ${f(Math.PI*S.TF/0.5,0)}) ${f(TAU*Eb/(Math.PI*S.TF/0.5)*1e6,2)} µJ, ${f(2*TAU*Eb/(Math.PI*S.TF/0.5)*1e6,2)} µW`);}

/* ---------- 5. the balance's damping (as wempe_escapement.js: each loss from the parts) ---------- */
head('5. The balance\'s damping from its parts (wempe_escapement.js)');
const DQ=(()=>{const parts=[[4,6.46,12.55,18.85],[2,3.8,16.95,20.25],[2,0.9,20.25,21.05],[2,1.65,13.95,15.25],[2,1.15,1.05,15.24],[2,3.8,15.24,16.15]];
  const T=0.5,w0=TAU/T,cub=4/(3*Math.PI),rho=1.2,Ji=J('wempe_inertia.json'),m=(Ji.balance.m+Ji.rollers.m+Ji.collet.m+Ji.spring.m/2)/1000;
  const Q=(a,Cd,mu,qm)=>{const Eb=kB*a*a/2;let air=0;for(const[n,h,r1,r2]of parts)air+=n*0.5*rho*Cd*h*1e-3*((r2/1000)**4-(r1/1000)**4)/4*(a*w0)**3*T*cub;const end=4*(2/3)*mu*m*G0*0.105e-3*a;
    return 1/(air/(TAU*Eb)+end/(TAU*Eb)+1/qm);};
  const lo=Q(A,1.4,0.012,1000),hi=Q(A,0.8,0.008,5000);
  chk(S.TF>=lo*T/Math.PI&&S.TF<=hi*T/Math.PI,`air on its masses, weights and arm, the endstone and the spring: Q ${f(lo,0)}-${f(hi,0)} at ${f(A/D,0)}° (TF ${f(lo*T/Math.PI,0)}-${f(hi*T/Math.PI,0)} s, their middle ${f(Math.sqrt(lo*hi)*T/Math.PI,0)}), the model's TF ${S.TF} s inside them: taken from a running 6MX on video at the model's own swing (wempe_startup.json; the parts' middle until 15 October 2026)`);return{lo,hi,Q};})();

/* ---------- 6. does it close? ---------- */
head('6. Does it close: the Q the drive needs to hold the swing, against the Q the parts give');
{const Qneed=(s,a)=>{const wn=E.wn(s,a);return wn>0?Math.PI*a*a/wn:Infinity;};   /* πa²/Q = Wn(a): the Q at which drive s keeps swing a */
  const n12=12/HPT,mes=P.fusT(n12),sMes=[escFrom(mes,TR.lo)/S.TQ,escFrom(mes,TR.hi)/S.TQ],sSol=[escFrom(tqAt(P.MF-n12)*LV.kE[0]*LS.lo,TR.lo)/S.TQ,escFrom(tqAt(P.MF-n12)*LV.kE[1]*LS.hi,TR.hi)/S.TQ];
  const band=[225,270],need=s=>[Qneed(s,band[0]*D),Qneed(s,band[1]*D)];
  const nm=[...need(sMes[0]),...need(sMes[1])].filter(Number.isFinite),qn=[Math.min(...nm),Math.max(...nm)];
  say(`the drive at 12 h, measured and through the train's ${rg(TR.lo,TR.hi,3)}: ${rg(sMes[0],sMes[1],3)} of the reference; from the solved spring with its losses ${rg(sSol[0],sSol[1],3)}`);
  say(`to swing the sources' band, ${band[0]}-${band[1]}° (the 1954 instruction; the Hamilton manual's 247.5-270°), that drive needs Q ${f(qn[0],0)}-${f(qn[1],0)}; the parts give ${f(DQ.lo,0)}-${f(DQ.hi,0)}`);
  chk(qn[0]<=DQ.hi&&qn[1]>=DQ.lo,`the budget closes: some balance within its parts' damping swings the band on the measured drive through the train as built (Q ${f(Math.max(qn[0],DQ.lo),0)}-${f(Math.min(qn[1],DQ.hi),0)})`);
  const Am=[E.ampAt(sMes[0]),E.ampAt(sMes[1])],Qm=Math.PI*S.TF/0.5;
  say(`at the model's Q ${f(Qm,0)} (TF ${S.TF} s) the measured drive through the train's range swings ${rg(Am[0],Am[1],1,1/D)}° at 12 h (the model's ${f(A/D,1)}° at its ${f(P.ETA,3)}); the band's 225° wants Q ${f(Qneed(1,225*D),0)} at the model's drive`);
  const pw=TAU*kB*A*A/2/Qm*2,pin=P.fusT(n12)*TAU/(HPT*3600);
  say(`the power at 12 h: the fusee arbor gives ${f(pin*1e6,1)} µW (measured), the escape wheel ${f(escFrom(mes,P.ETA)*TAU/7.5,1)} µW at ${f(P.ETA,3)} (a turn every 7.5 s), the balance loses ${f(pw*1e6,2)} µW: ${f(100*pw/pin,1)} % of what the spring gives reaches the balance`);
  say(`the measured drive's swing over the wind (2a, through ${f(P.ETA,3)}): ${[0,24,54].map(h=>f(E.ampAt(P.drv(h/HPT))/D,1)+'° at '+h+' h').join(', ')}`);}

module.exports={MSJ,FN,LS,LV,TR,DQ,BS,MupM:BS?BS.Mu:LV.MupM,Kl:BS?BS.Kl:LV.Kl};   /* BS: the build's spring (MC_WREV=build), which wempe_strength.js and the bench then take */
if(require.main===module){console.log(rows.join('\n'));if(fail)process.exitCode=1;}
