// The Wempe's whole transmission, every part that moves, nonlinear and in time (the Wempe README's "Physics: the transmission"): the mainspring in its barrel, the chain, the
// fusee with its clicks, the maintaining ratchet, its spring and detent, the fusee wheel and the going train to the escape wheel, the motion work and the hands, the up-and-down
// work, the key and the stop, each a body (its inertia weighed on the model's solids: wempe_inertia.json, mechanisms_wempe.json; or estimated, said where) joined by the
// elements a real movement has, each with its own law, none linearised:
//   the mainspring: its solved torque (wempe_mainspring.json at 05 06_20's level) and its coils' friction as a stick-slip element (mainspring_friction_wempe.json: winding
//     takes more than running gives), so it turns from one branch to the other as the barrel reverses;
//   the chain: tension only (it goes slack), its stiffness from its plates and rivets, its lever on the fusee where the chain lies (05 06_20's radii, fusee.js RFT) and on the
//     drum, each lever rising and falling as a link comes onto it (the polygon a chain of 2.05 links makes round a drum);
//   the clicks (05 06 02-3, two, half a tooth apart) on the click wheel (05 06 04-3, 35 teeth) and the maintaining detent (05 05 05-1) on the maintaining ratchet (05 06 02-1,
//     120 teeth): each a body on its pivot under its spring (wempe_ratchets.js's), riding the teeth's backs, falling into the gaps and catching a face only if it is down;
//   the maintaining spring (05 06 01-1): its drawn ring's push, stiffening as it closes, and its bank where its eye meets its square end (WPHYS's MSK, MSK2, MSB, which
//     wempe_sustaining.js works out from the ring and checks against escphys.js);
//   every mesh (the train's four, the motion work's two, the up-and-down work's): tooth by tooth on the page's own outlines (gearing.js's mesh on wempe_train.js's tables), the
//     driven gear's angle under load for each angle of the driver (its ratio varying through a pitch), the backlash to the back flank, the torque ratio with the teeth's
//     friction, the teeth's give as cantilevers; contact on either flank or none (the gears rattle in their backlash);
//   the cannon pinion's friction fit on the centre arbor (it slips past its torque), the motion work's and the up-and-down wheel's friction on their studs;
//   the key's one-way coil spring (51 00 11: "Linksaufzug b. Rechtsdrehung entspannt sich die Feder": it grips winding and slips the other way, so a winder can't let the
//     fusee back: each time the hand stops, the fusee runs free to the nearest click), the stop bar on the stop pin (05 06 03-1, 05 08 01-5) at full wind;
//   the escapement: dynamics.js --model wempe's own (the balance, the escape wheel and the detent through every contact), driven by the train through the escape pinion's
//     mesh each step (dynamics.js's o.tq), or locked on its stone while the key turns.
// Its sections:
//   1. the bodies and the elements, every moving part with what moves it;
//   2. the whole wind quasi-statically: every part's load from full wind to run down, the maintaining spring's lead against its bank, the swing and rate; then the drive in
//      time over a whole run with every ripple at once (the chain's polygon on both drums, each mesh's ratio through its pitch) and what they do to the swing and the time;
//   3. the running transmission's modes (linearised at 12 h only to find them);
//   4. a beat: the train as bodies on its meshes driving dynamics.js's escapement, against the same escapement on a rigid train: the work an impulse gives, the swing and rate it
//      comes to, every mesh's force through the beat, which mesh rattles, the seconds hand's bounce, the motion work and the cannon pinion;
//   5. winding: the key put on (the maintaining ratchet falling back to its detent), a stroke of the key (the clicks over the click wheel, the chain, the hand's torque), and
//      the key let go at every place the clicks can be (the fusee and barrel running free to the nearest click): the blow on the click wheel's tooth, the maintaining spring
//      thrown to its bank and the blow passed through the train to the locking stone; the click wheel's teeth against brass's endurance over the blows a wind gives;
//   6. the stop at full wind: the key wound into it and forced by a strong hand: the stop pin and bar, the chain, the slack chain's snatch;
//   7. the motion work and the up-and-down work: their backlash as the hands' play, the cannon pinion's friction between what a knock needs and what setting the hands may give.
// Needs only Node.js:   node wempe_transmission.js [--json OUT]   (about a minute with the meshes' tables kept between runs, MC_TR_TABS=FILE; 2-7 minutes fresh, as loaded
// as the machine is: the tables, then the beat and the winds, each in a thread of its own; MC_TR_PROF=1 times each on stderr. Exits 1 if a mesh
// jams, the coupled beat misses or trips a beat, parts from the rigid train's swing by 3° or rate by 0.3 s a day, the cannon pinion slips running, the maintaining spring banks
// running, the clicks catch less than a quarter of their face, or a peak load passes its part's strength (wempe_strength.js's static margins over the peak's factor))
if(!process.argv.includes('--model'))process.argv.push('--model','wempe');
const {Worker,isMainThread,parentPort,workerData}=require('worker_threads');
const MU=0.15;   /* the teeth's friction: the middle of gearing.js's 0.10-0.20 (oiled brass on steel) */
/* a mesh's table over one pitch of the driver (gearing.js's mesh and lag on the page's outlines): the driven gear's angle at contact (ee, its lag), the backlash to its back flank (bl),
   the torque ratio against the nominal at mu 0, 0.10, 0.20 (fac, as gearing.js's stage works it) */
function meshTab({zA,zB,m,dd,add}){const G=require('./gearing.js'),WT=require('./wempe_train.js');if(add)for(const a of add)WT.addOutline(a[0],a[1],TEO(a));
  const A=G.gear(zA,m,zB),B=G.gear(zB,m),d=m*(zA+zB)/2+dd,M=G.mesh(A,B,d),NS=120,span=A.p,start=M.a0-span/2,ee=[],bl=[],fac=[[],[],[]];let e=0;
  const tip=Math.min(d-A.ro-B.ri,d-B.ro-A.ri);if(tip<=0)return{jam:true,tip};
  for(let pass=0;pass<2;pass++)for(let i=0;i<=NS;i++){const al=start+span*i/NS,x=M.lag(al,e,pass?24:10);if(x===null)return{jam:true,tip};e=x;if(!pass)continue;
    ee.push(x);bl.push(i%12===0||i===NS?M.back(al,x):NaN);   /* the backlash every tenth of a pitch (it varies smoothly; gearing.js samples it so), between them linear */
    const be=M.b0-M.k*(al-M.a0)+x,[,w,Pt]=M.pen(al,be+1e-9),n=M.normal(al,be,w,Pt),nB=w==='A'?[-n[0],-n[1]]:n;
    const vA=[-Pt[1],Pt[0]],vB=[M.k*Pt[1],-M.k*(Pt[0]-d)],vr=[vA[0]-vB[0],vA[1]-vB[1]],vn=vr[0]*nB[0]+vr[1]*nB[1],t=[vr[0]-vn*nB[0],vr[1]-vn*nB[1]],tl=Math.hypot(...t)||1;
    [0,0.10,0.20].forEach((mu,j)=>{const F=[nB[0]+mu*t[0]/tl,nB[1]+mu*t[1]/tl],tB=(Pt[0]-d)*F[1]-Pt[1]*F[0],tA=-(Pt[0]*F[1]-Pt[1]*F[0]);fac[j].push((tB/tA)*M.k);});}
  for(let i=0;i<=NS;i++)if(isNaN(bl[i])){const a=i-(i%12),b=Math.min(NS,a+12);bl[i]=bl[a]+(bl[b]-bl[a])*(i-a)/(b-a);}
  return{zA,zB,m,d,k:M.k,p:span,start,a0:M.a0,b0:M.b0,ee,bl,fac,NS,tip,ro:[A.ro,B.ro],ri:[A.ri,B.ri]};}
/* the motion work's and the up-and-down work's gears, as dial.js cuts them (its tables: the change wheel 56 and its pinion 18, the hour wheel 54, the cannon pinion 14, the
   up-and-down wheel 120 and its pinion 12; dial.js's PIN for the pinions it gives no root) */
function TEO([z,m,D,dg,mate,l]){const WT=require('./wempe_train.js'),TE=WT.W.WTRAIN.teeth;return TE(z,m,D??m*z+1.588*m,dg??m*z-4.26*m,mate,l);}
if(!isMainThread&&!workerData.job){parentPort.postMessage(meshTab(workerData));return;}

const fs=require('fs'),path=require('path');
const W=require('./wempe_load.js')(),P=W.WPHYS,E=P.ESC,WD=W.WD,H=WD.H,WT=require('./wempe_train.js');
const quiet=f=>{const o=console.log;console.log=()=>{};try{return f();}finally{console.log=o;}};
const WP=quiet(()=>require('./wempe_physics.js')),DY=require('./dynamics.js'),WJ=require('./wempe_inertia.json'),MJ=require('./mechanisms_wempe.json'),MF=require('./mainspring_friction_wempe.json');
const D=Math.PI/180,TAU=2*Math.PI,G0=9.80665,f=(x,n=0)=>Number.isFinite(+x)?(+x).toFixed(n):'-',rows=[],out={};let fail=0;
const say=s=>rows.push('  '+s),head=s=>rows.push('\n'+s),chk=(ok,s,soft)=>{if(!ok&&!soft)fail=1;rows.push(`${ok?'  ok ':soft?'  ~~ ':'  !! '} ${s}`);};
const FUS=fs.readFileSync(path.join(__dirname,'..','..','wempe','js','fusee.js'),'utf8'),T0=Date.now();
const num=(re,s,what)=>{const m=re.exec(s);if(!m)throw Error('wempe_transmission: not found: '+what);return m;};

/* ===================== 1. the bodies and the elements ===================== */
/* the chain's lever on the fusee: the groove's floor radius where the chain lies (fusee.js RFT, 05 06_20's, by quarter turns from the large end), the pitch line 1.02 out;
   n turns from full wind the chain is on the curve's turn MF - n (WPHYS.MF); on the drum 41.6 / 2 + 1.02 (05 07 01-1, 05 07 04) */
const RFT=JSON.parse('['+num(/const RFT=\[([\d.,\s]+)\]/,FUS,'RFT')[1].replace(/\s/g,'')+']'),rfOf=m=>{const u=Math.max(0,Math.min(RFT.length-1,m*4)),i=Math.min(RFT.length-2,Math.floor(u));return RFT[i]+(RFT[i+1]-RFT[i])*(u-i);};
const RB=41.6/2+1.02,rho=n=>rfOf(P.MF-n)+1.02,NRUN=P.MF,HPT=P.HPT;   /* mm; NRUN: the fusee's turns, full wind to run down (05 06_20's curve) */
const fusT=n=>P.fusT(Math.max(0,Math.min(NRUN,n)));   /* the fusee arbor's torque n turns from full wind, measured running (N·m): the spring's, chain's and barrel's losses in it */
/* the drum's turn from full wind for the fusee's n (the chain's length off the fusee onto the drum: ∫ ρ dφ / RB), tabled; and back */
const NB=400,bTab=[0];for(let i=1;i<=NB;i++){const a=NRUN*(i-1)/NB,b=NRUN*i/NB;bTab.push(bTab[i-1]+TAU*(rho(a)+4*rho((a+b)/2)+rho(b))/6*(b-a)/RB);}
const betaOf=n=>{const u=Math.max(0,Math.min(NB,n/NRUN*NB)),i=Math.min(NB-1,Math.floor(u));return bTab[i]+(bTab[i+1]-bTab[i])*(u-i);};
const nOfBeta=b=>{if(b<=0)return 0;if(b>=bTab[NB])return NRUN;let lo=0,hi=NB;while(hi-lo>1){const md=(lo+hi)>>1;bTab[md]<=b?lo=md:hi=md;}return NRUN*(lo+(b-bTab[lo])/(bTab[hi]-bTab[lo]))/NB;};   /* by the table, bisected */
/* the mainspring on the drum, running: what gives the fusee arbor 05 06_20's torque through the chain's levers; its coils' friction (mainspring_friction.py on the solved spring,
   mu 0.10, the model's): winding takes hyst more than running gives, a stick-slip element of half that each way about the frictionless */
const HY0=MF.summary.hyst['0.1'],Mrun=n=>fusT(n)*RB/rho(n),Mfl=n=>Mrun(n)*(1+(HY0*PAR.hy)/2);
/* the inertias (g·mm², about each body's own axis): weighed on the model's solids (wempe_inertia.json; mechanisms_wempe.json for the barrel, the fusee and the pawls) or
   estimated where no solid is weighed: the chain (375 links of 05 07 04's plates and rivets, 2.9 mm³ of steel a pitch: 8.6 g, all moving at the chain's speed, so at the drum m RB²),
   the up-and-down wheel and its hand (05 02 04-1's rim, spokes and hub in brass 1.0 thick, the hand as half the hour hand's: about 560), the key (51 00 11: its paddle Ø 34.5 × 3
   and body Ø 14.5, steel, about 2,200 about its axis; its tube with the fusee, about 50) */
const A_=MJ.arbors,MCH=375*2.9*7.85e-3,JI={barrel:A_.barrel.I+MCH*RB*RB,fusee:A_.fusee.I+50,ratchet:WJ.maintaining.I,fw:WJ.fuseeWheel.I,centre:WJ.centre.I,cannon:WJ.cannon.I+WJ.minuteHand.I,
  change:WJ.changeWheel.I,hour:WJ.hourWheel.I+WJ.hourHand.I,inter:WJ.intermediate.I,sec:WJ.seconds.I+WJ.secondsHand.I,esc:WJ.escape.I,ud:560,key:2200,
  click:MJ.pawls.find(p=>p.name==='click 1').I,det:MJ.pawls.find(p=>p.name==='maintaining detent').I};
/* the maintaining spring: its push for a lead ψ of the ratchet over the wheel, MSK ψ + MSK2 ψ², banking at MSB (WPHYS's, which
   wempe_sustaining.js works out from the drawn ring and checks); MBK: how far, on average, the ratchet falls back to its detent when the key goes on (half a tooth of 120) */
const MSK=P.MSK,MSK2=P.MSK2,MSB=P.MSB,msT=ph=>ph>0?MSK*ph+MSK2*ph*ph:MSK*ph,msPh=T=>(-MSK+Math.sqrt(MSK*MSK+4*MSK2*Math.max(0,T)))/(2*MSK2);
/* the elements' stiffnesses (estimated, each from its parts; their ranges tried below where a result rests on them):
   a mesh: the teeth as cantilevers, E b s³ / 4 h³ (the brass wheel's 1.57 m root on a 2.25 m tooth, the steel pinion leaf's 1.05 m), in series and halved for the contact
   (traindyn.js's), b the narrower face: 1,620 N/mm a millimetre of face at the pitch circle;
   the chain: a pitch 13.5 kN/mm (the inner plate 31.5 and the outer two 63 kN/mm of steel over 2.05, each rivet joint about 20 kN/mm in bending and bearing), over the free span
   between the drums (the drums' tangent, 40-41 mm) and the turns on each drum it lets the tension into (as far as the links' friction on the groove, mu 0.15, lets it reach:
   about rho / mu on each drum): 120-700 N/mm, the middle 290 taken;
   the click's face on the click wheel's tooth (brass 2 thick, 0.75 deep) and the detent's on the ratchet's (brass 1.02): 10 and 5 kN/mm; the escape wheel's tooth on the locking
   stone 2 kN/mm; the stop bar (2 × 1.45 hardened, 3.6 out of its slot) on the stop pin (Ø 1.6, 0.71 under the load): their bending in series, 6.7 kN/mm at 14.0 from the
   fusee's axis (wempe_strength.js's sizes); the maintaining spring banked: its ends butted, the ring a strut between its pins, about 40 times its running stiffness;
   the cannon pinion's grip on the centre arbor 50 N·m a radian (its tube's 1:80 taper, a press);
   damping 3 % of critical in the meshes (oil), 5 % in the chain, the contacts and the clutch, 2 % in the springs */
const KM=b=>1624*b,KCH=290,KDT=5e3,KST=2e3,KSTOP=6.68e3*14.0**2*1e-3,KCAN=50;   /* N/mm (KM a mm of face); KSTOP N·m a radian */
const ZM=0.03,ZS=0.02,PAR={hy:1,kcl:1e4,kbank:40*MSK,zc:0.05,kch:KCH,tsl:3e-3,nck:2,brk:0};   /* PAR: the estimates section 5 varies (the click's face, the bank, the contacts' damping, the chain); nck the clicks, evenly spaced over a tooth, and brk a brake's torque (N·m) between the click wheel and the maintaining ratchet: the let-go fixes wempe_letgo_fix.js tries (the drawn 2 and 0) */
/* the pawls (mechanisms_wempe.json: the clicks' and the detent's pivots, their contacts on the faces as drawn, the teeth's depth): the nose's lever about the pivot (how far it
   rises a radian of the pawl), the lift that clears a tip; their springs (wempe_ratchets.js's: the clicks' bronze 1.5 × 0.4, 586-1667 mN/mm at their backs 3 from the pivot, the
   geometric middle; the detent's wire Ø 0.25, 64 mN/mm 4.73 from its pivot), set 0.3 and 0.5 mm there (estimated) */
const pawl=nm=>{const q=MJ.pawls.find(p=>p.name===nm),C=q.face.C,Pv=q.pivot,v=[C[0]-Pv[0],C[1]-Pv[1]],rc=Math.hypot(...C),dr=Math.abs((-v[1]*C[0]+v[0]*C[1])/rc);
  return{q,rc:rc*1e-3,ell:dr*1e-3,hmax:(q.ro-rc)/dr,depth:q.ro-rc,z:q.z,p:TAU/q.z,gap:q.face.gap};};
const CK=pawl('click 1'),DT=pawl('maintaining detent'),KSC=Math.sqrt(586*1667)*1e-3*(3e-3)**2*1e3,PSC=0.3/3,KSD=64e-3*(4.73e-3)**2*1e3,PSD=0.5/4.73;   /* N·m a radian; preload (rad) */
/* the meshes: [name, driver, driven, z, z, module, the centres' offset from m (z1 + z2) / 2 (mm), face (mm), the driver's place in its pitch at the start] */
const M_CH=20.16/56,M_HR=18.90/54,M_UD=33.454/120,dist=(a,b)=>Math.hypot(H[a][0]-H[b][0],H[a][1]-H[b][1]);
const MESH=[...WT.STG.map(([nm,zA,zB,m,,,,,,b],k)=>({nm,A:['fw','centre','inter','sec'][k],B:['centre','inter','sec','esc'][k],zA,zB,m,dd:WT.D0[k],b:Math.min(...b),ph:[0.13,0.57,0.31,0.89][k]})),
  {nm:'cannon pinion → change wheel',A:'cannon',B:'change',zA:14,zB:56,m:M_CH,dd:dist(19,1)-M_CH*70/2,b:1.0,ph:0.41,add:[[14,M_CH,5.86],[56,M_CH,21.05,19.03,14,0.555]]},
  {nm:'change pinion → hour wheel',A:'change',B:'hour',zA:18,zB:54,m:M_HR,dd:0,b:1.0,ph:0.77,add:[[18,M_HR,6.9,5.4,54,0.55],[54,M_HR,19.7,17.89,18,0.5]]},
  {nm:'up-and-down pinion → its wheel',A:'fusee',B:'ud',zA:12,zB:120,m:M_UD,dd:dist(2,10)-M_UD*132/2,b:1.0,ph:0.23,add:[[12,M_UD,4.0,2.4],[120,M_UD,34.33,32.57,12,0.40]]}];
/* the train's static efficiency and the pivots' friction (the bearing loads its torques give, mu 0.12 on the pivots' radii: WPHYS.STG's) */
const MUP=0.12;

/* the integrator: bodies (angles forward in the running sense, kg·m²), elements adding torques, semi-implicit Euler steps of 1 µs */
function Mach(){const B=[],El=[];const m={B,El,t:0,
  body(n,J){B.push({n,J:J*1e-9,q:0,v:0,F:0,pres:false});return B.length-1;},
  add(e){El.push(e);return e;},
  force(){for(const b of B)b.F=0;for(const e of El)e.f(m);},
  step(dt){m.force();for(const b of B)if(!b.pres){b.v+=b.F/b.J*dt;b.q+=b.v*dt;}for(const e of El)if(e.post)e.post(m,dt);m.t+=dt;},
  run(T,dt,cb){const n=Math.round(T/dt);for(let i=0;i<n;i++){m.step(dt);if(cb&&cb(m)===false)break;}}};return m;}
const crit=(k,Ja,Jb,z)=>2*z*Math.sqrt(k/(1/Ja+1/Jb));   /* damping at fraction z of critical for a spring k between two bodies */
/* a mesh element: the driver a, the driven b; pen the driven's lag past contact (rad of b): contact on the driving flank, on the back flank past the backlash, or none */
function meshEl(mc,T,ia,ib,K,o={}){const NS=T.NS,k=T.k,pe=MU>=0.1?(MU-0.1)/0.1:0,el={T,K,maxL:0,minL:Infinity,back:0,free:0,freeMax:0,run:0,offA:T.start+(o.ph||0)*T.p,offB:0,on:true,lam:0};
  const tab=a=>{const u=(a-T.start)/T.p,n=Math.floor(u),x=(u-n)*NS,i=Math.min(NS-1,Math.floor(x)),w=x-i;
    return{qc:k*(a-T.a0)-T.b0-(T.ee[i]*(1-w)+T.ee[i+1]*w),d:k-(T.ee[i+1]-T.ee[i])*NS/T.p,bl:T.bl[i]*(1-w)+T.bl[i+1]*w,fac:(T.fac[1][i]*(1-w)+T.fac[1][i+1]*w)*(1-pe)+(T.fac[2][i]*(1-w)+T.fac[2][i+1]*w)*pe};};
  const B=mc.B,c=crit(K,B[ia].J/(k*k),B[ib].J,ZM);el.tab=tab;
  el.pen=()=>{const x=tab(B[ia].q+el.offA);return x.qc-(B[ib].q+el.offB);};
  el.set=pen0=>{const x=tab(B[ia].q+el.offA);el.offB=x.qc-pen0-B[ib].q;};
  el.f=()=>{const x=tab(B[ia].q+el.offA),qb=B[ib].q+el.offB,pen=x.qc-qb,dv=x.d*B[ia].v-B[ib].v;let L=0;
    if(pen>0)L=Math.max(0,K*pen+c*dv);else if(-pen>x.bl)L=Math.min(0,K*(pen+x.bl)+c*dv);
    el.lam=L;if(!el.on)return;B[ib].F+=L;B[ia].F-=L>0?L*k/x.fac:L*k;};
  el.rec=dt=>{const L=el.lam;el.maxL=Math.max(el.maxL,L);el.minL=Math.min(el.minL,L);if(L<0)el.back++;if(L===0){el.run+=dt;el.freeMax=Math.max(el.freeMax,el.run);el.free+=dt;}else el.run=0;};
  return mc.add(el);}
/* a spring between two bodies (or to the frame, j < 0): torque fn(ψ), ψ = q_i - q_j + off */
function springEl(mc,i,j,fn,kt,z,off=0){const B=mc.B,c=crit(kt,B[i].J,j<0?1e9:B[j].J,z),el={psi:0,T:0,maxPsi:-Infinity,minPsi:Infinity,maxT:0};
  el.f=()=>{const ps=B[i].q-(j<0?0:B[j].q)+off,dv=B[i].v-(j<0?0:B[j].v),T=fn(ps)+c*dv;el.psi=ps;el.T=T;B[i].F-=T;if(j>=0)B[j].F+=T;};
  el.rec=()=>{el.maxPsi=Math.max(el.maxPsi,el.psi);el.minPsi=Math.min(el.minPsi,el.psi);el.maxT=Math.max(el.maxT,el.T);};return mc.add(el);}
/* a one-sided stop on body i (dir +1: it may not pass forward of q0; -1: back of it), stiffness k */
function stopEl(mc,i,q0,dir,k,z){const B=mc.B,c=crit(k,B[i].J,1e9,z),el={q0,L:0,maxL:0,hits:0,on:false};
  el.f=()=>{const pen=dir*(B[i].q-el.q0);let L=0;if(pen>0)L=Math.max(0,k*pen+c*dir*B[i].v);if(L>0&&!el.on)el.hits++;el.on=L>0;el.L=L;B[i].F-=dir*L;};
  el.rec=()=>{el.maxL=Math.max(el.maxL,el.L);};return mc.add(el);}
/* a pawl: its body ψ (0 down in its gap, lifting +) under its spring, riding a ratchet's teeth. x the ratchet's place against the pawl (the click wheel against the click: the
   fusee's lead over the maintaining ratchet; the ratchet against the detent: its own angle), the pawl's face catching when x reaches a face from behind with the pawl down,
   the teeth's backs a straight rise of hmax over a pitch (estimated: the backs drawn straight); dirn +1 the pawl holds x from passing forward (the clicks), -1 from back (the detent) */
function pawlEl(mc,ip,xa,xb,pw,ks,ps0,kf,dirn,x0){const B=mc.B,p=pw.p,hm=pw.hmax,kb=1e7*pw.ell*pw.ell,cb=crit(kb,B[ip].J,1e9,PAR.zc),cs=crit(ks,B[ip].J,1e9,ZS),Jx=xb>=0?1/(1/B[xa].J+1/B[xb].J):B[xa].J,cf=crit(kf,Jx,1e9,PAR.zc);
  const el={n:0,x0,L:0,maxL:0,eng:[],catchE:null,hits:0,on:false,maxImp:0};
  const X=()=>dirn*(B[xa].q-(xb>=0?B[xb].q:0)-el.x0),Xv=()=>dirn*(B[xa].v-(xb>=0?B[xb].v:0));
  el.f=()=>{let x=X()-el.n*p;const ps=B[ip].q;
    while(x<=-p){el.n--;x+=p;}while(x>p){el.n++;x-=p;}if(x>0&&ps>=hm*0.98){el.n++;x-=p;}   /* over a tip into the next gap; forward over a face with the pawl up */
    const h=x>0?0:-hm*x/p,g=h-ps,dh=x>0?0:-hm/p;let Lb=0;if(g>0)Lb=Math.max(0,kb*g+cb*(dh*Xv()-B[ip].v));
    B[ip].F+=Lb-(ks*(ps+ps0)+cs*B[ip].v);
    let L=0;if(x>0&&ps<hm){L=Math.max(0,kf*x*1e0+cf*Xv());if(!el.on&&L>0){el.hits++;el.catchE=1-ps/hm;el.eng.push(el.catchE);}}
    el.on=L>0;el.L=L;const Q=-Lb*dh-L;   /* on x: the back's push resisting its rise, the face holding */
    B[xa].F+=dirn*Q;if(xb>=0)B[xb].F-=dirn*Q;};
  el.rec=()=>{el.maxL=Math.max(el.maxL,el.L);};return mc.add(el);}

/* ---------- the meshes' tables, in parallel ---------- */
const TC=process.env.MC_TR_TABS,tabs=()=>TC&&fs.existsSync(TC)?Promise.resolve(JSON.parse(fs.readFileSync(TC,'utf8'))):Promise.all(MESH.map(q=>new Promise((ok,no)=>{const w=new Worker(__filename,{workerData:{zA:q.zA,zB:q.zB,m:q.m,dd:q.dd,add:q.add},argv:['--model','wempe']});w.on('message',ok);w.on('error',no);})));

/* the bodies and elements of the whole movement at n turns from full wind, in static running equilibrium (the escape wheel on its stone): every element's torque from the
   fusee arbor's measured torque down the train (each mesh's mean torque ratio at MU, the pivots' friction), so the drive's level at the escape wheel is the meshes' own */
function build(TB,n,o={}){const mc=Mach(),b={};for(const k of['barrel','fusee','ratchet','fw','centre','cannon','change','hour','inter','sec','esc','ud'])b[k]=mc.body(k,JI[k]*(k==='fusee'&&o.key?1:1));
  if(o.key){b.key=mc.body('key',JI.key);}
  b.c1=mc.body('click 1',JI.click);b.c2=mc.body('click 2',JI.click);b.cx=[];for(let k=2;k<PAR.nck;k++)b.cx.push(mc.body('click '+(k+1),JI.click));b.det=mc.body('maintaining detent',JI.det);
  const B=mc.B,rh=rho(n)*1e-3,rb=RB*1e-3,S={n,rh};
  /* the torques down the line, static: the fusee arbor's; the fusee wheel's (the clicks and the maintaining spring carry it whole); each pinion's by the mesh's mean ratio, less the
     pivots' friction (mu_p r_p the pinion's load over its radius); the escape wheel's */
  const Tf=fusT(n),mean=t=>{const a=t.fac[1].slice(0,-1),c=t.fac[2].slice(0,-1),pe=(MU-0.1)/0.1;return a.reduce((s,x,i)=>s+x*(1-pe)+c[i]*pe,0)/a.length;};
  const tq={fw:Tf},rp=[[0.6,1.1],[0.425,0.425],[0.41,0.38],[0.12,0.12]];let T=Tf;
  const piv=[],lpA=[];MESH.slice(0,4).forEach((q,i)=>{const t=TB[i],rw=i<3?MESH[i+1].m*MESH[i+1].zA/2:7.0,T1=T/t.k*mean(t),lp=MUP*(rp[i][0]+rp[i][1])/2*(2/(q.m*q.zB)+1/rw);piv.push(T1*lp);lpA.push(lp);T=T1*(1-lp);tq[q.B]=T;});
  S.tq=tq;S.escT=tq.esc;S.lp=lpA;S.Tf=Tf;
  /* the mainspring and its friction (stick-slip: kz takes the friction up over 0.05° of the drum) */
  const nB=betaOf(n),kz=Mrun(n)*HY0/2/(0.05*D);let zq=0;
  const ms=mc.add({f:()=>{const be=B[b.barrel].q,nn=nOfBeta(nB+be),M=Mfl(nn),Fc=Mrun(nn)*(HY0*PAR.hy)/2;let Fh=kz*(be-zq);if(mc.fd)Fh=Fc;else if(Fh>Fc){Fh=Fc;zq=be-Fc/kz;}else if(Fh<-Fc){Fh=-Fc;zq=be+Fc/kz;}   /* mc.fd: probed for the modes, the coils sliding as they creep running (their state untouched) */
    ms.M=M-Fh;ms.n=nn;B[b.barrel].F+=M-Fh;}});ms.preset=()=>{zq=B[b.barrel].q-Mrun(nOfBeta(nB+B[b.barrel].q))*(HY0*PAR.hy)/2/kz;};ms.preset();   /* on the running branch where the drum stands */
  /* the chain: tension only; the fusee's lever where the chain lies as the fusee turns (n with it), the chain off the fusee integrated; the polygon's lever by the link's phase */
  const ch={sF:0,qF:0,d0:0,T:0,maxT:0,minT:Infinity,slack:0,poly:!!o.poly},kc=PAR.kch*1e3,cc=crit(kc*rb*rb,B[b.barrel].J,B[b.fusee].J,PAR.zc)/(rb*rb);
  const pf=(s,r)=>{if(!ch.poly)return 1;const a=2*Math.asin(2.05/(2*r)),u=((s/2.05e-3)%1+1)%1;return Math.cos((u-0.5)*a)/(Math.sin(a/2)/(a/2));};
  ch.f=()=>{const nf=n+B[b.fusee].q/TAU,rf=rho(Math.max(0,Math.min(NRUN,nf)))*1e-3,s=rb*B[b.barrel].q,d=s-ch.sF-rf*(B[b.fusee].q-ch.qF)+ch.d0,dv=rb*B[b.barrel].v-rf*B[b.fusee].v;
    let Tn=d>0?Math.max(0,kc*d+cc*dv):0;ch.T=Tn;ch.rf=rf;B[b.barrel].F-=Tn*rb*pf(s,RB);B[b.fusee].F+=Tn*rf*pf(s+0.37*2.05e-3,rf*1e3);};
  ch.post=()=>{ch.sF+=ch.rf*(B[b.fusee].q-ch.qF);ch.qF=B[b.fusee].q;};   /* the chain off the fusee: its lever where it lies times the fusee's turn, step by step (and within a step, so a turn of the fusee alone stretches it) */ch.rec=()=>{ch.maxT=Math.max(ch.maxT,ch.T);ch.minT=Math.min(ch.minT,ch.T);if(ch.T===0)ch.slack++;};mc.add(ch);
  ch.d0=Mrun(n)/rb/kc;
  /* the clicks between the fusee (the click wheel) and the ratchet, click 1 bearing, click 2 half a tooth on; the maintaining detent on the ratchet, its face a quarter tooth
     behind it running (where it creeps as the ratchet runs on) */
  const kfc=PAR.kcl*1e3*CK.rc*CK.rc,kfd=KDT*1e3*DT.rc*DT.rc;
  const c1=pawlEl(mc,b.c1,b.fusee,b.ratchet,CK,KSC,PSC,kfc,1,0),c2=pawlEl(mc,b.c2,b.fusee,b.ratchet,CK,KSC,PSC,kfc,1,CK.p/PAR.nck),cx=b.cx.map((bi,i)=>pawlEl(mc,bi,b.fusee,b.ratchet,CK,KSC,PSC,kfc,1,(i+2)*CK.p/PAR.nck));
  /* the brake (PAR.brk): Coulomb friction between the click wheel and the ratchet, nothing while the clicks hold them together running, against the key winding and the fusee running free */
  if(PAR.brk)mc.add({f:()=>{const T=PAR.brk*Math.tanh((B[b.fusee].v-B[b.ratchet].v)/1e-3);B[b.fusee].F-=T;B[b.ratchet].F+=T;}});
  const dt_=pawlEl(mc,b.det,b.ratchet,-1,DT,KSD,PSD,kfd,-1,0);
  /* the maintaining spring, ratchet to fusee wheel, with its bank */
  const kms=MSK+2*MSK2*0.27;const sp=springEl(mc,b.ratchet,b.fw,ps=>msT(ps)+(ps>MSB?PAR.kbank*(ps-MSB):0),kms,ZS);
  /* the train's meshes and the motion work's, the up-and-down work's */
  const me=MESH.map((q,i)=>meshEl(mc,TB[i],b[q.A],b[q.B],KM(q.b)*1e3*(q.m*q.zB/2e3)**2,{ph:q.ph}));
  /* the cannon pinion's friction fit on the centre arbor: elastic to its slip torque TSL (o.tsl), then slipping */
  const tsl=o.tsl??PAR.tsl;let zc=0;const cn={T:0,slip:0,maxT:0};cn.f=()=>{const d=B[b.centre].q-B[b.cannon].q-zc,dv=B[b.centre].v-B[b.cannon].v;let Tc=KCAN*d+crit(KCAN,B[b.centre].J,B[b.cannon].J,PAR.zc)*dv;
    if(Tc>tsl){zc+=(Tc-tsl)/KCAN;cn.slip+=Math.abs(Tc-tsl)/KCAN;Tc=tsl;}else if(Tc<-tsl){zc+=(Tc+tsl)/KCAN;cn.slip+=Math.abs(Tc+tsl)/KCAN;Tc=-tsl;}cn.T=Tc;B[b.centre].F-=Tc;B[b.cannon].F+=Tc;};
  cn.rec=()=>{cn.maxT=Math.max(cn.maxT,Math.abs(cn.T));};mc.add(cn);
  /* friction on the studs and pivots, Coulomb (tanh over 1e-4 rad/s): the change wheel on its stud and the hour wheel on the cannon tube, their weights on their shoulders (mu 0.15,
     the bores' radii 0.76 and 1.8); the up-and-down wheel the same on its stud (0.76); the going train's pivots under their static loads (mu_p 0.12) */
  const cou=(i,T)=>mc.add({f:()=>{B[i].F-=T*Math.tanh(B[i].v/1e-4);}});
  MESH.slice(0,4).forEach((q,i)=>cou(b[q.B],piv[i]));cou(b.change,0.15*WJ.changeWheel.m*1e-3*G0*1.2e-3);cou(b.hour,0.15*(WJ.hourWheel.m+WJ.hourHand.m)*1e-3*G0*2.2e-3);cou(b.ud,0.15*2.6e-3*G0*1.0e-3);
  /* the escape wheel on its locking stone (o.free: driven from outside, dynamics.js's) */
  let st=null;if(!o.free){st=stopEl(mc,b.esc,0,1,KST*1e3*(7e-3)**2,PAR.zc);}else B[b.esc].pres=true;
  /* the key and the hand (o.key): the key's body on the fusee through its one-way coil spring (stiff winding, slipping running against a drag, 5 mN·m estimated); the hand on the
     key through the fingers' grip (1 N·m a radian, estimated), following its speed to its strongest torque */
  let hd=null,ow=null;if(o.key){const kk=20,ck=crit(kk,B[b.key].J,B[b.fusee].J,PAR.zc);ow={T:0,maxT:0,drag:o.drag??5e-3};
    ow.f=()=>{const d=B[b.key].q-B[b.fusee].q,dv=B[b.key].v-B[b.fusee].v;let Tk=0;if(d<0)Tk=Math.min(0,kk*d+ck*dv);else Tk=ow.drag*Math.tanh(-dv/1e-3)*-1;ow.T=Tk;B[b.key].F-=Tk;B[b.fusee].F+=Tk;};
    ow.rec=()=>{ow.maxT=Math.max(ow.maxT,-ow.T);};mc.add(ow);
    hd={th:0,w:0,Tmax:o.Tmax??1.06,kh:o.kh??1.0,T:0,on:false,maxT:0};const chh=crit(hd.kh,B[b.key].J,1e3,0.5);
    hd.f=()=>{if(!hd.on){hd.T=0;return;}let Th=hd.kh*(hd.th-B[b.key].q)+chh*(hd.w-B[b.key].v);if(Th<-hd.Tmax){Th=-hd.Tmax;hd.th=B[b.key].q-hd.Tmax/hd.kh;}else if(Th>hd.Tmax){Th=hd.Tmax;hd.th=B[b.key].q+hd.Tmax/hd.kh;}hd.T=Th;B[b.key].F+=Th;};
    hd.post=(m,dt)=>{if(hd.on)hd.th+=hd.w*dt;};hd.rec=()=>{hd.maxT=Math.max(hd.maxT,-hd.T);};mc.add(hd);}
  /* the stop at full wind (the bar out on the chain's top turn: within its last turn) */
  const sw=n<1?stopEl(mc,b.fusee,-n*TAU,-1,KSTOP,PAR.zc):null;if(sw)sw.on=false;
  /* the static state: the maintaining spring's lead, each mesh pressed by its torque; the bodies at rest */
  const lead=msPh(Tf);B[b.ratchet].q=lead;
  me.forEach((e,i)=>{const q=MESH[i],t=i<4?tq[q.B]:i===4?1e-6:i===5?1e-6:1e-6;e.set(t/e.K);});
  if(st){st.q0=B[b.esc].q-tq.esc/(KST*1e3*(7e-3)**2);}
  /* the clicks: click 1 on its face pressed by the drive, click 2 on a back; the fusee's place: q_fusee - q_ratchet = x on click 1's face */
  B[b.fusee].q=lead+Tf/kfc;B[b.c2].q=CK.hmax/PAR.nck;b.cx.forEach((bi,i)=>B[bi].q=CK.hmax*(i+2)/PAR.nck);dt_.x0=lead-0.5*DT.p;B[b.det].q=DT.hmax/2;
  const all={mc,b,S,ms,ch,c1,c2,cks:[c1,c2,...cx],dt:dt_,sp,me,cn,st,hd,ow,sw,lead};return all;}
/* settle a built movement to rest: every body slowed each step (0.06 % a microsecond: about critical for the slowest mode, the barrel and fusee on the maintaining spring at 50 Hz;
   heavier would overdamp it, and it would creep to rest slower than the settle) */
function settle(X,T=0.06){const{mc}=X,dt=1e-6,N=Math.round(T/dt);mc.fd=true;for(let i=0;i<N;i++){mc.step(dt);for(const b of mc.B)if(!b.pres)b.v*=0.9994;}for(const b of mc.B)if(!b.pres)b.v=0;mc.fd=false;X.ms.preset();}   /* the coils sliding as running while it settles, then on the running branch where the drum has come to (settling, it may turn back a little: held, the coils would keep part of the winding branch) */
const recAll=(X,dt)=>{for(const e of X.mc.El)if(e.rec)e.rec(dt);};

/* ---------- the runs in time (section 4's beat and its rigid twin, section 5's winds, section 6's stop), each a thread of its own; each returns its figures ---------- */
/* a beat at 12 h: the train as bodies on its meshes driving dynamics.js's escapement (rigid false), or the same escapement on a rigid train given the torque the train gives at its
   place (each mesh's ratio where its driver stands, every driver turned with the escape wheel by the ratios behind it, less the pivots' friction: no give, no inertia of its own, no
   backlash). The work an impulse gives: the balance's energy from before the unlocking (-0.85 rad) to after the impulse (+0.6 rad) on the active swing */
function beat(TB,rigid){const n=12/HPT,X=build(TB,n,{free:true}),{mc,b,me,sp,c1,c2,cn,ch}=X,B=mc.B;
  B[b.esc].q=0;B[b.esc].v=0;settle(X,0.08);   /* settled with the escape wheel held where it locks */
  const P_=E.P,J0=DY.JE/DY.JT,T=24,from=12,cs0=cn.slip;
  const A0s=me.slice(0,4).map((e,i)=>B[b[MESH[i].A]].q+e.offA),kk=me.slice(0,4).map(e=>e.T.k);
  const qsT=qe=>{let T=X.S.Tf;for(let i=0;i<4;i++){let r=1;for(let j=i;j<4;j++)r*=kk[j];const x=me[i].tab(A0s[i]+qe/r);T=T/kk[i]*x.fac*(1-X.S.lp[i]);}return T;};
  me.forEach(e=>{e.maxL=0;e.minL=Infinity;e.back=0;e.free=0;e.freeMax=0;e.run=0;});sp.maxPsi=-Infinity;sp.minPsi=Infinity;ch.maxT=0;ch.minT=Infinity;c1.maxL=0;c2.maxL=0;cn.maxT=0;
  const Eb=(th,w)=>0.5*DY.I*w*w+0.5*DY.K*th*th;
  const trk={W:[],S:[],qe:0,e0:null,l:null,nl:0,phO:0,f(t,th,w,ph){if(this.phO<-0.5*P_&&ph>-1e-12)this.nl++;this.phO=ph;this.qe=this.nl*P_-ph;
    if(w>0&&this.l!==null&&this.l<=-0.85&&th>-0.85){this.e0=Eb(th,w);if(t>from)this.S.push(qsT(this.qe));}if(w>0&&this.e0!==null&&this.l<=0.6&&th>0.6){if(t>from)this.W.push(Eb(th,w)-this.e0);this.e0=null;}this.l=th;}};
  if(rigid){const r=DY.sim({T,from,tq:()=>qsT(trk.qe),watch:(t,th,w,d,dv,ph)=>trk.f(t,th,w,ph)});return{beats:r.beats,trips:r.trips,rate:r.rate,A:r.A,W:trk.W,S:trk.S};}
  let qeO=0,tO=0,wmO=0,sMax=-Infinity,nlO=0;const bnc=[];
  const watch=(t,th,w,d,dv,ph,pv,dm,wm)=>{trk.f(t,th,w,ph);const qe=trk.qe,dtt=t-tO;if(Math.round(qe/P_)!==nlO&&wm===0){nlO=Math.round(qe/P_);sMax=-Infinity;}
    if(dtt>0){const ns=Math.max(1,Math.ceil(dtt/1e-6)),h=dtt/ns,ve=(qe-qeO)/dtt;for(let i=0;i<ns;i++){B[b.esc].q=qeO+ve*h*(i+1);B[b.esc].v=ve;mc.step(h);if(t>from)recAll(X,h);if(wm===0)sMax=Math.max(sMax,B[b.sec].q);}}
    if(wmO===0&&wm===1&&t>from&&Number.isFinite(sMax))bnc.push(sMax-B[b.sec].q);   /* the seconds arbor's overshoot past where it rests on the stone, as the next release comes */
    wmO=wm;tO=t;qeO=qe;};
  const r=DY.sim({T,from,J:J0,tq:()=>me[3].lam,watch});
  return{beats:r.beats,trips:r.trips,rate:r.rate,A:r.A,W:trk.W,S:trk.S,T,from,meshes:me.map(e=>({maxL:e.maxL,back:e.back,free:e.free,freeMax:e.freeMax})),bnc,
    sp:[sp.minPsi,sp.maxPsi],ch:[ch.minT,ch.maxT],c1:c1.maxL,c2:c2.maxL,cn:cn.maxT,slip:cn.slip-cs0,lead:X.lead,tq:X.S.tq};}
/* the drive over a whole run with every ripple at once (section 2): the swing stepped every second (A² towards ampAt's at the drive, TF), the rate each second; the swing's
   and the rate's tables over drives 0.3-1.7 (the meshes' ratios take it down to about 0.6 at the intermediate's dip) and swings 150-300°, linear between */
function rippleRun(TB){const v=[];for(let i=0;i<=70;i++)v.push(E.ampAt(0.3+0.02*i));const AMP=s=>{const u=Math.max(0,Math.min(70,(s-0.3)/0.02)),i=Math.min(69,Math.floor(u)),w=u-i;return v[i]*(1-w)+v[i+1]*w;};
  const g=[];for(let j=0;j<=14;j++){const sd=0.3+0.1*j,r=[];for(let i=0;i<=60;i++)r.push(E.rateAt((150+2.5*i)*D,sd));g.push(r);}
  const RT=(a,sd)=>{const u=Math.max(0,Math.min(14,(sd-0.3)/0.1)),q=Math.max(0,Math.min(60,(a/D-150)/2.5)),j=Math.min(13,Math.floor(u)),i=Math.min(59,Math.floor(q)),wj=u-j,wi=q-i;return(g[j][i]*(1-wi)+g[j][i+1]*wi)*(1-wj)+(g[j+1][i]*(1-wi)+g[j+1][i+1]*wi)*wj;};
  const poly=r=>{const a=2*Math.asin(2.05/(2*r));return u=>Math.cos((((u%1)+1)%1-0.5)*a)/(Math.sin(a/2)/(a/2));};
  const mfac=MESH.slice(0,4).map((q,i)=>{const t=TB[i],pe=(MU-0.1)/0.1,a=t.fac[1].map((x,j)=>x*(1-pe)+t.fac[2][j]*pe),m=a.slice(0,-1).reduce((s,x)=>s+x,0)/(a.length-1);return u=>{const x=(((u%1)+1)%1)*t.NS,j=Math.min(t.NS-1,Math.floor(x)),w=x-j;return(a[j]*(1-w)+a[j+1]*w)/m;};});
  const per=[90/14*3600/90,3600/90,3600/(90/12)/80,60/80];   /* seconds a tooth of each driver: the fusee wheel, centre, intermediate, seconds */
  const runs=src=>{const dt=1,N=Math.floor(NRUN*HPT*3600/dt)-3600;let A2=null,amin=Infinity,amax=-Infinity;const R=new Float64Array(N);
    for(let i=0;i<N;i++){const t=i*dt,n=t/(HPT*3600),s0=fusT(n)/P.RATIO*P.ETA*1e6/P.TQ;let k=1;
      if(src.chain){const r=rho(n),sC=(betaOf(n)*RB)/2.05;k*=poly(r)(sC+0.37)/poly(RB)(sC);}
      if(src.mesh)for(const j of src.mesh)k*=mfac[j](t/per[j]+[0.13,0.57,0.31,0.89][j]);
      const sd=s0*k,aT=AMP(sd);if(A2===null)A2=aT*aT;A2+=(aT*aT-A2)*(1-Math.exp(-2*dt/P.SET.TF));const a=Math.sqrt(A2);
      if(t>3*P.SET.TF){amin=Math.min(amin,a);amax=Math.max(amax,a);}R[i]=RT(a,sd);}
    return{R,amin:amin/D,amax:amax/D};};
  /* the time's wander over each day against the day's mean rate (what a navigator, rating the chronometer daily, carries) */
  const wander=(R,R0)=>{let w=0;for(let d=0;(d+1)*86400<=R.length;d++){let e=0,mn=0,mx=0,m=0;for(let i=d*86400;i<(d+1)*86400;i++)m+=(R[i]-R0[i])/86400;m/=86400;for(let i=d*86400;i<(d+1)*86400;i++){e+=(R[i]-R0[i])/86400-m;mn=Math.min(mn,e);mx=Math.max(mx,e);}w=Math.max(w,mx-mn);}return w;};
  const base=runs({}),ch=runs({chain:1}),me=runs({mesh:[0,1,2,3]}),all=runs({chain:1,mesh:[0,1,2,3]}),sw=x=>({amin:x.amin,amax:x.amax});
  return{base:sw(base),ch:sw(ch),me:sw(me),all:sw(all),wc:wander(ch.R,base.R),wm:wander(me.R,base.R),wa:wander(all.R,base.R)};}
/* a stroke of the key at n turns from full wind: the hand takes the key up to a turn a second, turns the fusee back `stroke`, slows to rest over 50 ms, creeps on until the nearer
   click is u of half a tooth short of its face, holds, then lets go. The key's coil spring grips whenever the hand holds the key against the fusee (it slips only if the key is turned
   the wrong way), so how the hand lets go decides the blow: outright (the fingers off the paddle: the fusee, the key and the barrel run free to the nearer click), or eased (the
   torque the hand holds it with relaxed to nothing over `ease` s, the fusee let forward under it). o.par: the estimates varied */
function windRun(TB,o){const sv={...PAR};Object.assign(PAR,o.par||{});try{
  const X=build(TB,o.n??24/HPT,{key:true,Tmax:o.Tmax,kh:o.kh,drag:o.drag});const{mc,b,hd,cks,dt,sp,ch,me,st}=X,B=mc.B;settle(X,0.06);
  dt.x0=B[b.ratchet].q-(o.fd??0.5)*DT.p;dt.n=0;B[b.det].q=DT.hmax*(o.fd??0.5);B[b.key].q=B[b.fusee].q;
  const reset=()=>{for(const e of mc.El){if(e.maxL!=null)e.maxL=0;if(e.eng)e.eng=[];}ch.maxT=0;ch.minT=Infinity;ch.slack=0;sp.maxPsi=-Infinity;sp.minPsi=Infinity;hd.maxT=0;};reset();
  const near=()=>Math.min(...cks.map(c=>{const x=B[b.fusee].q-B[b.ratchet].q-c.x0-c.n*CK.p;return -x;})),tgt=(o.u??0.5)*CK.p/PAR.nck;
  const r0=B[b.ratchet].q,q0=B[b.fusee].q,dtS=1e-6,res={lead:X.lead,tq:X.S.tq};hd.on=true;hd.th=B[b.key].q;let t=0,ph='wind',t1=0,fall=0;
  while(t<6){if(ph==='wind'){hd.w=-TAU*Math.min(1,t/0.03);if(q0-B[b.fusee].q>=(o.stroke??Math.PI)){ph='slow';t1=t;}}
    else if(ph==='slow'){hd.w=-TAU*Math.max(0,1-(t-t1)/0.05);if(t-t1>0.08){ph='creep';t1=t;}}
    else if(ph==='creep'){const d=near(),ok=d>=tgt-2e-4&&d<=tgt+3e-3;hd.w=ok?0:-0.3;if(ok&&t-t1>0.05){ph='hold';t1=t;}}
    else if(ph==='hold'){hd.w=0;if(t-t1>0.05){Object.assign(res,{fall,detL:dt.maxL,hand:hd.maxT,chain:[ch.minT,ch.maxT],free:near()});reset();ph='let';t1=t;if(!o.ease)hd.on=false;else hd.T0=Math.abs(hd.T);}}
    else{if(o.ease)hd.Tmax=hd.T0*Math.max(0,1-(t-t1)/o.ease);if(t-t1>(o.after??0.3)+(o.ease||0))break;}
    mc.step(dtS);t+=dtS;recAll(X,dtS);if(ph!=='let')fall=Math.max(fall,r0-B[b.ratchet].q);}
  const cl=cks.filter(c=>c.eng.length);
  return Object.assign(res,{u:o.u,catchE:cl.length?Math.min(...cl.map(c=>c.eng[0])):NaN,Fc:Math.max(...cks.map(c=>c.maxL))/CK.rc,Fd:dt.maxL/DT.rc,sp:sp.maxPsi,stone:st.maxL/7e-3,fw:me[0].maxL/(MESH[0].m*MESH[0].zB/2e3),esc:me[3].maxL,chainL:[ch.minT,ch.maxT],slack:ch.slack*1e-6});}finally{Object.assign(PAR,sv);}}
/* the stop at full wind: the key wound into it at a turn a second from 0.12 turn short, then held there by a strong hand (1.06 N·m) */
function stopRun(TB){const X=build(TB,0.12,{key:true,Tmax:1.06});const{mc,b,hd,sw,ch}=X,B=mc.B;settle(X,0.06);sw.on=true;sw.q0=-0.12*TAU;B[b.key].q=B[b.fusee].q;
  for(const e of mc.El)if(e.maxL!=null)e.maxL=0;ch.maxT=0;ch.minT=Infinity;ch.slack=0;hd.on=true;hd.th=B[b.key].q;let t=0,tHit=null,Fhit=0;
  while(t<1.2){hd.w=-TAU*Math.min(1,t/0.03);mc.step(1e-6);t+=1e-6;recAll(X,1e-6);if(sw.L>0&&tHit===null)tHit=t;if(tHit!==null&&t-tHit<0.02)Fhit=Math.max(Fhit,sw.L);}
  return{Fhit:Fhit/14e-3,Fp:sw.maxL/14e-3,chain:[ch.minT,ch.maxT],slack:ch.slack*1e-6,hand:hd.maxT};}

module.exports={tabs,PAR,build,settle,MESH,JI,rho,fusT,Mrun,msT,msPh,MSB,CK,DT,meshTab,beat,windRun,stopRun,rippleRun};
if(!isMainThread&&['beat','wind','ripple','stop'].includes(workerData.job)){const{job,TB,o,par}=workerData;   /* its own jobs only: a thread of another tool may load this module (wempe_transmission_trace.js) */
  Object.assign(PAR,par||{});parentPort.postMessage(job==='beat'?beat(TB,o.rigid):job==='wind'?windRun(TB,o):job==='ripple'?rippleRun(TB):stopRun(TB));return;}

if(require.main===module)(async()=>{
const strP=new Promise(ok=>require('child_process').execFile(process.execPath,[path.join(__dirname,'wempe_strength.js')],{cwd:__dirname,maxBuffer:1<<26},(e,o,er)=>ok(e?{err:e,o:o||'',er:er||''}:o||'')));
const TB=await tabs(),STRO=await strP;if(TC&&!fs.existsSync(TC))fs.writeFileSync(TC,JSON.stringify(TB));   /* MC_TR_TABS: the tables kept in a file between runs (developing the tool; ci.py builds them) */
/* the strengths: wempe_strength.js's own lines (its static loads fully wound and the stresses and ranges it judges them by), so a peak here is judged as it judges the static */
const STR=(()=>{if(typeof STRO!=='string')throw Error('wempe_strength.js failed ('+STRO.err.message+'): '+STRO.o.slice(-600)+STRO.er.slice(-1200));const R=STRO.replace(/\r/g,'').split('\n'),get=(key,name)=>{const r=R.find(x=>x.includes(key));if(!r)throw Error('wempe_strength.js has no line: '+key);
  const m=/\)\s+([\d.]+) N.*?\s([\d.]+) MPa\s+(.*?)\s([\d.]+)-([\d.]+): margin/.exec(r);if(!m)throw Error('wempe_strength.js line unread: '+r);return{name,F:+m[1],s:+m[2],what:m[3],lo:+m[4],hi:+m[5]};};
  return{mesh:MESH.slice(0,4).map(q=>get(q.nm+' (',q.nm)),click:get('the click wheel\'s tooth under the click','the click wheel\'s tooth')};})();
/* a peak force F on a part whose static line is S: its stress scaled from the static (each formula linear in its load), against the line's range and, for brass, its yield */
const judge=(S,F,lab,soft)=>{const s=S.s*F/S.F,mL=S.lo/s,mH=S.hi/s,ok=mL>=1;chk(ok,`${lab}: ${f(F,F<1?3:1)} N, ${f(s,0)} MPa against ${S.what} ${S.lo}-${S.hi}: margin ${f(mL,2)}-${f(mH,2)}`,!ok&&(mH>=1||!!soft));return{F,s,mL,mH,v:ok?"ok":mH>=1||soft?"~~":"!!"};};
/* the cannon pinion's friction window (section 7 prints it): at least what a knock across the case needs to turn the hands on it (45 g, motionwork.js's: the minute hand's unbalance,
   the hour hand's through the motion work), at most what setting the hands forward may add to the centre arbor's drive fully wound before the balance swings to makeEsc's TRIP;
   the model takes the window's geometric middle */
const CAN=(()=>{const g45=45*G0,lo=WJ.minuteHand.m*1e-3*g45*Math.hypot(WJ.minuteHand.cg[0],WJ.minuteHand.cg[2])*1e-3+WJ.hourHand.m*1e-3*g45*Math.hypot(WJ.hourHand.cg[0],WJ.hourHand.cg[2])*1e-3/12;
  const Tc0=fusT(0)*14/90*0.95,Tc12=fusT(12/HPT)*14/90*0.95;let a=1,c=6;for(let k=0;k<18;k++){const m=(a+c)/2;E.ampAt(P.drv(0)*m)>=E.TRIP?c=m:a=m;}const sT=(a+c)/2,hi=(sT-1)*Tc0;
  return{lo,hi,Tc0,Tc12,sT,take:Math.sqrt(lo*hi)};})();
PAR.tsl=CAN.take;
/* the runs in time, each a thread of its own (at most 12 at once): section 4's beat and its rigid twin, section 5's winds, section 6's stop, while sections 1-3 are worked here */
const pool=(()=>{let run=0;const q=[],LIM=Math.max(2,Math.min(12,require('os').cpus().length-2));const next=()=>{while(run<LIM&&q.length){const[job,o,ok,no]=q.shift();run++;
  const w=new Worker(__filename,{workerData:{job,TB,o,par:{tsl:PAR.tsl}},argv:['--model','wempe']});const t0=Date.now();w.on('message',m=>{run--;if(process.env.MC_TR_PROF)console.error(job,JSON.stringify(o).slice(0,40),((Date.now()-t0)/1000).toFixed(1)+' s, at '+((Date.now()-T0)/1000).toFixed(0));ok(m);next();});w.on('error',e=>{run--;no(e);next();});}};
  return(job,o={})=>{const p=new Promise((ok,no)=>{q.push([job,o,ok,no]);next();});p.catch(()=>{});return p;};})();
const US=[0.05,0.25,0.5,0.75,0.97],VAR=[['the click\'s face ×0.25 (4 times softer: the click\'s screw and the ratchet\'s plate giving)',{kcl:2.5e3}],['the click\'s face ×2',{kcl:2e4}],['the contacts\' damping 2 %',{zc:0.02}],['the contacts\' damping 20 %',{zc:0.2}],
  ['the bank ×0.25',{kbank:10*MSK}],['the bank ×4',{kbank:160*MSK}],['the chain 120 N/mm',{kch:120}],['the chain 700 N/mm',{kch:700}]];
const J={ripple:pool('ripple'),beat:pool('beat',{rigid:false}),beatR:pool('beat',{rigid:true}),keyOn:pool('wind',{u:0.5}),snap:US.map(u=>pool('wind',{u,after:0.3})),eased:US.map(u=>pool('wind',{u,after:0.3,ease:0.15})),
  vary:VAR.map(([lab,par])=>pool('wind',{u:0.97,par}).then(x=>({...x,lab}))),stop:pool('stop')};
head('1. The transmission: every moving part, its inertia and what moves it');
{const L=[['barrel and mainspring (05 07 01, 05 07 00-6), the chain (05 07 04) at its speed',JI.barrel,'mechanisms_wempe.json, the chain\'s 8.6 g estimated','the mainspring; holds the chain'],
  ['fusee with its click wheel, cover, dust plate and the key\'s tube (05 06 04, 05 06 04-3)',JI.fusee,'mechanisms_wempe.json','the chain; the key winding'],
  ['two clicks (05 06 02-3) on the maintaining ratchet',JI.click,'mechanisms_wempe.json, about each pivot','their springs (05 06 02-2) and the click wheel'],
  ['maintaining ratchet and spring (05 06 02-1, 05 06 01-1)',JI.ratchet,'wempe_inertia.json','the clicks running; the spring winding'],
  ['maintaining detent (05 05 05-1)',JI.det,'mechanisms_wempe.json, about its arbor','its wire (05 05 06-1) and the ratchet'],
  ['fusee wheel (05 06 00-3)',JI.fw,'wempe_inertia.json','the maintaining spring'],
  ['centre arbor (05 05 03)',JI.centre,'wempe_inertia.json','the fusee wheel'],['cannon pinion and minute hand (05 05 03-3, 05 02 00-1)',JI.cannon,'wempe_inertia.json','its friction on the centre arbor'],
  ['change wheel and pinion (05 02 02)',JI.change,'wempe_inertia.json','the cannon pinion'],['hour wheel and hand (05 02 03, 05 02 00-2)',JI.hour,'wempe_inertia.json','the change pinion'],
  ['intermediate arbor (05 05 02)',JI.inter,'wempe_inertia.json','the centre wheel'],['seconds arbor and hand (05 05 01, 05 02 01-1)',JI.sec,'wempe_inertia.json','the intermediate wheel'],
  ['escape wheel and arbor (05 04 05)',JI.esc,'wempe_inertia.json','the seconds wheel; its locking stone; the impulse stone'],
  ['balance, rollers, collet, a third of the spring (05 03 01)',WJ.balance.I+WJ.rollers.I+WJ.collet.I+WJ.spring.I/3,'wempe_inertia.json','the hairspring; the impulse; dynamics.js'],
  ['detent (05 04 01)',WJ.detent.I,'wempe_inertia.json','dynamics.js, tripping.js'],
  ['up-and-down wheel and hand (05 02 04, 05 02 00-3)',JI.ud,'estimated (05 02 04-1\'s rim, spokes, hub)','the up-and-down pinion on the fusee arbor'],
  ['the key (51 00 11), winding',JI.key,'estimated (its paddle and body)','the hand, through its one-way coil spring']];
  for(const[nm,J,src,by]of L)say(`${nm.padEnd(92)} ${f(J,J<10?2:0).padStart(7)} g·mm²  (${src}); moved by ${by}`);
  say(`the case and its gimbals are gimbals.js --model wempe's; the balance's and detent's motion dynamics.js's and tripping.js's: here the escapement is dynamics.js's own, driven by the train`);
  out.bodies=L.map(([nm,J,src,by])=>({nm,J,src,by}));}

/* ---------- the meshes as tabled ---------- */
{say('');say(`the meshes tooth by tooth (gearing.js's mesh on the page's outlines, mu ${MU} on the teeth; the driven gear's angle under load and its backlash over a pitch of the driver):`);
  out.meshes=[];MESH.forEach((q,i)=>{const t=TB[i];if(t.jam){chk(false,`${q.nm}: jams (tip clearance ${f(t.tip*1000)} µm)`);return;}
    const lag=t.ee.map((x,j)=>x),wob=(Math.max(...lag)-Math.min(...lag))*q.m*q.zB/2*1000,blm=Math.min(...t.bl)*q.m*q.zB/2*1000,blM=Math.max(...t.bl)*q.m*q.zB/2*1000,fc=t.fac[1].concat(t.fac[2]);
    say(`  ${q.nm.padEnd(38)} ${q.zA}:${q.zB} m ${f(q.m,4)}: tips ${f(t.tip*1000)} µm clear, backlash ${f(blm)}-${f(blM)} µm, the driven's lag through a pitch ${f(wob,1)} µm at its pitch circle, the torque ratio ${f(Math.min(...fc),3)}-${f(Math.max(...fc),3)} of nominal (mu 0.10-0.20); ${f(KM(q.b))} N/mm on ${f(q.b,2)} of face`);
    out.meshes.push({nm:q.nm,zA:q.zA,zB:q.zB,m:q.m,tip:t.tip,bl:[blm,blM],wob,fac:[Math.min(...fc),Math.max(...fc)],k:KM(q.b)});});}
if(fail){console.log(rows.join('\n'));process.exitCode=1;return;}

/* ===================== 2. the whole wind, quasi-statically ===================== */
head('2. The whole wind, part by part (static, running: each element carrying the fusee arbor\'s measured torque, 05 06_20, down the train at mu '+MU+')');
const QS=[];{const Ns=[0,0.5,1,2,3,4,5,6,7,8,8.5,NRUN];
  say(`n (turns from full wind)  hours  chain lever  chain pull  click face  spring lead (bank ${f(MSB/D,2)}°)  fusee wheel teeth  centre  intermediate  seconds  escape torque  swing  rate`);
  for(const n of Ns){const X=build(TB,n);const t=X.S.tq,dr=t.esc/(P.TQ*1e-6)*(P.TQ*1e-6)/P.TQ/1e-6,sDrv=t.esc*1e6/P.TQ,A=E.ampAt(sDrv),rt=E.rateAt(A,sDrv);
    const r={n,h:n*HPT,rho:rho(n),pull:Mrun(n)/(RB*1e-3),click:fusT(n)/CK.rc,lead:X.lead,F:MESH.slice(0,4).map((q,i)=>(i===0?fusT(n):t[MESH[i].A])/(q.m*q.zA/2e3)),esc:t.esc,s:sDrv,A:A/D,rate:rt};QS.push(r);
    say(`${f(n,2).padStart(6)}  ${f(r.h,1).padStart(16)}  ${f(r.rho,2).padStart(9)}  ${f(r.pull,1).padStart(9)} N  ${f(r.click,1).padStart(7)} N  ${f(r.lead/D,2).padStart(10)}° (${f((MSB-r.lead)/D,2)}° short)  ${r.F.map(x=>f(x,x<1?3:1)+' N').join('  ')}  ${f(r.esc*1e6,1)} µN·m  ${f(r.A,1)}°  ${f(r.rate,2)} s/d`);}
  const minB=Math.min(...QS.map(r=>MSB-r.lead));out.qs=QS;
  chk(minB>0,`the maintaining spring never banks running: its lead is at most ${f(Math.max(...QS.map(r=>r.lead))/D,2)}° (fully wound, the drive at its highest), ${f(minB/D,2)}° short of where its eye meets its square end (MSB ${f(MSB/D,2)}°)`);
  const ef=QS.map(r=>r.esc/(fusT(r.n)/P.RATIO));say(`the train's static efficiency at mu ${MU} (the meshes' own mean ratios, the pivots at mu_p ${MUP}): ${f(Math.min(...ef),3)} (the model's ${f(P.ETA,3)}, escphys.js; wempe_physics.js's range ${f(WP.TR.lo,3)}-${f(WP.TR.hi,3)})`);
  chk(ef[0]>=WP.TR.lo-0.01&&ef[0]<=WP.TR.hi+0.01,`it lies in the range wempe_physics.js's parts give: the transmission's drive at the escape wheel is the budget's`);}

/* ---------- the drive over a whole run, every ripple at once ---------- */
{say('');say('The drive over a whole run with every ripple at once: the chain\'s polygon on the fusee and the drum (the line of pull swinging about the last rivet on each, a 2.05 link on its radius), each mesh\'s ratio through its pitch (its table), against the smooth');
  const{base,ch,me,all,wc,wm,wa}=await J.ripple;
  const rip=r=>1-Math.cos(Math.asin(2.05/(2*r)));
  say(`  the chain's polygon: its lever swings ${f(100*rip(rho(0)),2)} % on the fusee fully wound (r ${f(rho(0),2)}), ${f(100*rip(rho(NRUN)),2)} % run down (r ${f(rho(NRUN),2)}), ${f(100*rip(RB),2)} % on the drum, once a link (every ${f(2.05/(rho(4)*TAU/(HPT*3600)*1),0)} s at mid wind): 05 06_20's ±0.7 g reading is ${f(100*0.7/131.5,2)} %, as fine as this ripple`);
  say(`  the swing over the run (TF ${P.SET.TF} s): smooth ${f(base.amin,2)}-${f(base.amax,2)}°; with the chain's polygon ${f(ch.amin,2)}-${f(ch.amax,2)}°; with the meshes ${f(me.amin,2)}-${f(me.amax,2)}°; with both ${f(all.amin,2)}-${f(all.amax,2)}°`);
  chk(wa<0.1,`the time's wander within a day from all the ripples together ${f(wa*1000,1)} ms (the chain's ${f(wc*1000,1)}, the meshes' ${f(wm*1000,1)}): a navigator rating it daily carries nothing of it`);
  out.ripple={base:[base.amin,base.amax],chain:[ch.amin,ch.amax],mesh:[me.amin,me.amax],all:[all.amin,all.amax],wander:{chain:wc,mesh:wm,all:wa},poly:{fusFull:rip(rho(0)),fusRun:rip(rho(NRUN)),drum:rip(RB)}};}

/* ===================== 3. the modes ===================== */
head('3. The running transmission\'s modes at 12 h (the escape wheel on its stone; linearised about the running state only to find them)');
{const n=12/HPT,X=build(TB,n),{mc}=X;settle(X,0.05);const B=mc.B,N=B.length,q0=B.map(b=>b.q),h=1e-7,K=[];
  mc.fd=true;const Fs=()=>{mc.force();return B.map(b=>b.F);};for(const b of B)b.v=0;const F0=Fs();
  for(let j=0;j<N;j++){B[j].q+=h;const F1=Fs();B[j].q-=2*h;const F2=Fs();B[j].q=q0[j];K.push(F1.map((x,i)=>-(x-F2[i])/(2*h)));}mc.fd=false;
  const Ks=K.map((r,i)=>r.map((x,j)=>(x+K[j][i])/2)),Jb=B.map(b=>b.J),S=Ks.map((r,i)=>r.map((x,j)=>x/Math.sqrt(Jb[i]*Jb[j]))),V=S.map(r=>r.slice()),Z=S.map((r,i)=>r.map((_,j)=>i===j?1:0));
  for(let sw=0;sw<100;sw++)for(let p=0;p<N;p++)for(let q=p+1;q<N;q++){if(Math.abs(V[p][q])<1e-14*(Math.abs(V[p][p])+Math.abs(V[q][q])))continue;const th=0.5*Math.atan2(2*V[p][q],V[q][q]-V[p][p]),c=Math.cos(th),s=Math.sin(th);
    for(let k=0;k<N;k++){const a=V[k][p],bq=V[k][q];V[k][p]=c*a-s*bq;V[k][q]=s*a+c*bq;}for(let k=0;k<N;k++){const a=V[p][k],bq=V[q][k];V[p][k]=c*a-s*bq;V[q][k]=s*a+c*bq;}
    for(let k=0;k<N;k++){const a=Z[k][p],bq=Z[k][q];Z[k][p]=c*a-s*bq;Z[k][q]=s*a+c*bq;}}
  const md=V.map((r,i)=>({f:Math.sqrt(Math.max(0,r[i]))/TAU,v:Z.map(z=>z[i])})).sort((a,b)=>a.f-b.f).map(m=>{const e=m.v.map(x=>x*x),tot=e.reduce((s,x)=>s+x,0),top=e.map((x,i)=>[x/tot,B[i].n]).sort((a,b)=>b[0]-a[0]).slice(0,2);return{f:m.f,top};});
  const fl=md.filter(m=>m.f<=0.01).map(m=>m.top[0][1]);if(fl.length)say(`  at rest, free in their backlash (only friction loads them): ${fl.join(', ')}`);
  for(const m of md.filter(m=>m.f>0.01))say(`  ${(m.f<1000?f(m.f,1)+' Hz':f(m.f/1000,2)+' kHz').padStart(10)}  ${m.top.map(([w,nm])=>`${nm} ${f(100*w)} %`).join(', ')}`);
  const low=md.filter(m=>m.f>0.01)[0];out.modes=md.map(m=>({f:m.f,top:m.top}));
  chk(low.f>20,`the lowest, ${f(low.f,1)} Hz (${low.top.map(x=>x[1]).join(' and ')}), lies far above the beat's 2 Hz and its first harmonics: no part of the transmission is driven near its own frequency by the escapement`);}

/* ===================== 4. a beat ===================== */
head('4. A beat: the train as bodies on its meshes driving dynamics.js\'s escapement, against the same escapement on a rigid train');
{const[r1,r0]=await Promise.all([J.beat,J.beatR]),mean=a=>a.reduce((s,x)=>s+x,0)/a.length,W1=mean(r1.W),W0=mean(r0.W),s0=mean(r0.S)/DY.TAUE,sEq=s0*W1/W0,A0=E.ampAt(s0),A1=E.ampAt(sEq),n=12/HPT;
  say(`at 12 h the train gives the escape wheel ${f(mean(r0.S)*1e6,1)} µN·m on average at the releases (${f(Math.min(...r0.S)*1e6,1)}-${f(Math.max(...r0.S)*1e6,1)}: each mesh's ratio where it stands; s ${f(s0,3)} of the reference), the wheel with its own inertia (${f(DY.JE*1e9,2)} g·mm²) and the train's bodies behind it on their meshes: ${r1.beats} beats in ${r1.T} s`);
  chk(r1.trips===0&&Math.abs(r1.beats-r0.beats)<=1,`every beat taken: ${r1.beats} beats, ${r1.trips} trips or missed (the rigid train ${r0.beats}, ${r0.trips})`);
  say(`the work an impulse gives the balance (its energy before the unlocking against after the impulse): ${f(W1*1e6,3)} µJ against ${f(W0*1e6,3)} on the rigid train at the same places of its meshes (${W1>=W0?'+':''}${f(100*(W1/W0-1),2)} %): the train behind the escape wheel gives and lags as it starts`);
  const dA=(A1-A0)/D,dR=E.rateAt(A1,sEq)-E.rateAt(A0,s0);
  /* within 8° and 0.5 s a day (the user's choice, 19 October 2026; 3° and 0.3 until then): with the lock re-laid (0.235) and the preload 0.8 g the stone, pressed harder on the tooth it
     let go through the chase, lets the train's meshes give back more than a rigid train would (+3.8 % of the impulse's work at TF 111 s, +4.6° as a drive; +2.1 % at 0.175, 0.63 g and TF 108 s): the rigid train makeEsc and
     dynamics.js take reads the swing low by about that (README, Physics: the transmission) */
  chk(Math.abs(dA)<8&&Math.abs(dR)<0.5,`as a drive ${f(sEq,4)} of the reference: the swing it keeps ${f(A0/D,2)}° → ${f(A1/D,2)}° (${dA>=0?'+':''}${f(dA,2)}°), the escapement's rate ${dR>=0?'+':''}${f(dR,3)} s a day; over the run itself the escapement's rate ${f(r0.rate,3)} → ${f(r1.rate,3)} s a day, the swing ${f(r0.A,2)}° → ${f(r1.A,2)}°`);
  say('');say('  each mesh through the beats (its force at the driven gear\'s pitch circle; whether it lets go):');
  out.beat={beats:r1.beats,trips:r1.trips,W0,W1,s0,sEq,A0:A0/D,A1:A1/D,dA,dR,rate0:r0.rate,rate1:r1.rate,meshes:[]};const Ts=r1.T-r1.from;
  r1.meshes.forEach((e,i)=>{const q=MESH[i],r=q.m*q.zB/2e3,st=i<4?r1.tq[q.B]:NaN,fr=e.free/Ts,ln=e.freeMax;out.beat.meshes.push({nm:q.nm,Fmax:e.maxL/r,Fst:st/r,fac:e.maxL/st,free:fr,freeMax:ln,back:e.back*1e-6});
    const lets=i<4?(fr>0?`lets go ${f(100*fr,2)} % of the time, at most ${f(ln*1000,2)} ms at once`:'never lets go'):i<6?`rests in its backlash between steps (only friction loads the motion work; static friction holds it there) and is taken up each step`:`free in its backlash: the fusee hardly turns in a beat`;
    say(`    ${q.nm.padEnd(38)} ${f(e.maxL/r,e.maxL/r<1?4:2)} N at most${i<4?` (${f(e.maxL/st,2)} times its running ${f(st/r,st/r<1?4:2)} N)`:''}; ${lets}${e.back?`; on its back flank ${f(e.back*1e-3,2)} ms in all`:'; never on its back flank'}`);});
  say(`    (the escape wheel lands on its stone dead, as dynamics.js lands it, so the seconds wheel's way into the escape pinion's mesh is the most it can be)`);
  say('');MESH.slice(0,4).forEach((q,i)=>{const e=r1.meshes[i],Fd=e.maxL/r1.tq[q.B]*STR.mesh[i].F;   /* the peak's factor over running, on wempe_strength.js's fully wound force */
    out.beat.meshes[i].str=judge(STR.mesh[i],Fd,`  ${q.nm}, its peak fully wound (this beat's ${f(e.maxL/r1.tq[q.B],2)} times running on wempe_strength.js's ${STR.mesh[i].F} N)`);});
  const bm=r1.bnc.length?Math.max(...r1.bnc):0,stepTh=TAU/120;
  say(`  the seconds hand steps ${f(stepTh/D,1)}° a beat and overshoots where it comes to rest by ${f(bm/D*3600,1)}″ at most (${f(100*bm/stepTh,3)} % of a step): the escape pinion's mesh and the seconds wheel's teeth give, and it rings down before the next release`);
  say(`  the cannon pinion's fit carries at most ${f(r1.cn*1000,3)} mN·m (the motion work's friction and its inertia's share of each step) against its ${f(PAR.tsl*1000,1)} mN·m (section 7)`);
  chk(r1.slip<1e-9,`the cannon pinion doesn't slip running (${f(r1.slip/D*3600,4)}″)`);
  say(`  the maintaining spring's lead ${f(r1.sp[0]/D,4)}-${f(r1.sp[1]/D,4)}° through the beats (static ${f(r1.lead/D,3)}°); the chain's pull ${f(r1.ch[0],3)}-${f(r1.ch[1],3)} N; click 1's face ${f(r1.c1/CK.rc,2)} N at most, click 2 ${r1.c2>0?'bears':'stays on its tooth\'s back'}`);
  out.beat.sec=bm;out.beat.cannon={maxT:r1.cn,slip:r1.slip};out.beat.chain=r1.ch;out.beat.lead=r1.sp;}

/* ===================== 5. winding ===================== */
head('5. Winding: the key put on, a stroke, and the key let go (the escape wheel on its stone: the train hardly turns in a wind\'s few seconds)');
{const n0=24/HPT,R=await J.keyOn,Fr=fusT(n0)/CK.rc,Fw=R.tq.centre/(MESH[0].m*MESH[0].zB/2e3),Fs=R.tq.esc/7e-3;
  say(`the key put on at 24 h, the fusee wound back half a turn at a turn a second: the maintaining ratchet falls back ${f(R.fall/D,2)}° onto its detent (from half a tooth; anywhere from 0 to ${f(DT.p/D,1)}°), the detent's face taking ${f(R.detL/DT.rc,2)} N at most (it holds ${f(msT(R.lead-R.fall)/DT.rc,2)} N after)`);
  say(`while the key turns the hand needs ${f(R.hand*1000,0)} mN·m at most (the mainspring's winding branch through the chain's lever, the clicks riding the click wheel's backs, the key's coil spring), the chain ${f(R.chain[0],1)}-${f(R.chain[1],1)} N`);
  out.keyOn={fall:R.fall,detF:R.detL/DT.rc,hand:R.hand,chain:R.chain};out.runClick=Fr;out.MSB=MSB;
  const show=(lab,L)=>{say('');say(lab);for(const x of L)say(`  ${f(x.free/D,2).padStart(5)}° free: the click catches ${f(100*x.catchE)} % of its face with ${f(x.Fc,0)} N (running ${f(Fr,1)}); the maintaining spring to ${f(x.sp/D,2)}°${x.sp>MSB?` (banked ${f((x.sp-MSB)/D,2)}°)`:''}; the fusee wheel's teeth ${f(x.fw,1)} N (running ${f(Fw,1)}), the locking stone ${f(x.stone,3)} N (${f(Fs,4)}); the chain ${f(x.chainL[0],1)}-${f(x.chainL[1],1)} N${x.slack>0?`, slack ${f(x.slack*1000,1)} ms`:''}`);};
  const LS=await Promise.all(J.snap),LE=await Promise.all(J.eased);
  show('the key let go outright (the fingers off its paddle), the nearer click so far short of its face:',LS);show('the key eased back (the torque the hand holds it with relaxed to nothing over 0.15 s):',LE);
  out.letgo={snap:LS,eased:LE};const worst=L=>L.reduce((a,b)=>a.Fc>b.Fc?a:b),shallow=Math.min(...LS.concat(LE).map(l=>l.catchE));
  chk(shallow>=0.25,`every catch takes ${f(100*shallow)} % of the click's face or more: the clicks are down before the face comes (their springs follow the click wheel's backs)`);
  say('');const wS=worst(LS),wE=worst(LE),fwS=Math.max(...LS.map(l=>l.fw)),fwE=Math.max(...LE.map(l=>l.fw));
  /* judged as wempe_strength.js judges the static: the click wheel's tooth (its 51.4 N), the fusee wheel's teeth (its 19.9 N); the blows at the strokes' ends are few on each tooth, so
     against brass's yield; eased is how the key is meant to be let back, let go outright is judged softly, a misuse */
  const blows=Math.round(3.7/0.5*365*30/35),LCF={...STR.click,what:`brass's yield (blows at the end of the strokes: about ${blows} on each tooth in 30 years, a wind's 3.7 fusee turns in half-turn strokes over 35 teeth: low-cycle, where brass's fatigue strength is near its yield; the running load against its endurance is wempe_strength.js's)`,lo:300,hi:450};
  const jE=judge(LCF,wE.Fc,`eased, the click wheel's tooth at the worst catch`),jEf=judge(STR.mesh[0],fwE,`  the fusee wheel's teeth then`);
  const jS=judge({...STR.click,what:'brass\'s yield',lo:300,hi:450},wS.Fc,`let go outright, the click wheel's tooth at the worst catch`,true),jSf=judge({...STR.mesh[0],what:'brass\'s yield',lo:300,hi:450},fwS,`  the fusee wheel's teeth then`,true);
  const chS=Math.max(...LS.map(l=>l.chainL[1])),chE=Math.max(...LE.map(l=>l.chainL[1]));
  chk(chS<37.8*10.5,`the chain goes slack as the fusee is caught and the drum runs on, then snatches: ${f(chS,1)} N at most let go outright (eased ${f(chE,1)}), ${f(37.8*10.5/chS,1)} times under its weakest part's strength (the rivet in shear, wempe_strength.js: margin 10.5 at 37.8 N)`);
  say('');say('the worst outright let-go with the estimates it rests on varied:');const VA=await Promise.all(J.vary);
  for(const x of VA)say(`  ${x.lab.padEnd(86)} the click ${f(x.Fc,0)} N, the fusee wheel's teeth ${f(x.fw,1)} N, the stone ${f(x.stone,3)} N, the spring to ${f(x.sp/D,2)}°`);
  const spW=Math.max(...LS.concat(LE).map(l=>l.sp));
  chk(true,`the maintaining spring is thrown to ${f(spW/D,2)}° at most (its bank ${f(MSB/D,2)}°)${spW>MSB?`: let go outright it banks, and the blow passes through the fusee wheel and the train to the locking stone (${f(Math.max(...LS.map(l=>l.stone)),3)} N at most against ${f(Fs,4)} running: the tooth's pressure draws the detent in, so a harder push holds it the faster)`:''}`,spW>MSB);
  out.letgoSum={snap:{F:wS.Fc,fw:fwS,click:jS,fwj:jSf},eased:{F:wE.Fc,fw:fwE,click:jE,fwj:jEf},shallow,spW,vary:VA.map(x=>({lab:x.lab,Fc:x.Fc,fw:x.fw,stone:x.stone,sp:x.sp}))};}

/* ===================== 6. the stop ===================== */
head('6. The stop at full wind: the key wound into it at a turn a second, then forced by a strong hand (1.06 N·m, Swain 1970: overwind.js\'s)');
{const x=await J.stop,Fst=(1.06-fusT(0))/14e-3;
  say(`the stop bar meets the stop pin with the fusee, the key and the barrel at a turn a second: ${f(x.Fhit,0)} N in the blow's first 20 ms, ${f(x.Fp,0)} N at most with the hand behind it (held there, the hand's 1.06 less the spring's ${f(fusT(0),3)} N·m on the fusee: ${f(Fst,0)} N; wempe_strength.js takes them added, ${f((1.06+0.391)/14e-3,0)} N, which is on the safe side)`);
  say(`the chain ${f(x.chain[0],1)}-${f(x.chain[1],1)} N (fully wound running ${f(Mrun(0)/(RB*1e-3),1)} N)${x.slack?`, slack ${f(x.slack*1000,1)} ms as the drum runs on after the fusee stops`:''}`);
  const bar=532*x.Fp/104,pin=183*x.Fp/104;
  chk(bar<1200,`the stop bar's bending at that ${f(bar,0)} MPa, the pin's ${f(pin,0)} MPa (wempe_strength.js's 532 and 183 MPa at its 104 N): under hardened steel's 1200-1800`,bar>=1200/1.5);
  chk(x.chain[1]<37.8*10.5,`the chain's worst pull ${f(x.chain[1],1)} N: ${f(37.8*10.5/x.chain[1],1)} times under its weakest part's strength (the rivet in shear, wempe_strength.js: margin 10.5 at 37.8 N)`);
  out.stop={...x,Fst,bar,pin};}

/* ===================== 7. the motion work and the up-and-down work ===================== */
head('7. The motion work and the up-and-down work');
{const bl=i=>[Math.min(...TB[i].bl),Math.max(...TB[i].bl)];const b4=bl(4),b5=bl(5),b6=bl(6);
  /* the hour hand's play against the minute hand: the hour wheel's backlash and the change wheel's through the change pinion */
  const hp=[b5[0]+b4[0]*18/54,b5[1]+b4[1]*18/54].map(x=>x*720/TAU);
  say(`the hour hand's play against the minute hand: ${f(hp[0],1)}-${f(hp[1],1)} minutes of time (the hour wheel's backlash on the change pinion, the change wheel's on the cannon pinion through 18/54)`);
  chk(hp[1]<15,`under a quarter hour: the hour hand reads with the minute hand`);
  const uh=b6.map(x=>x/(0.875*TAU)*56);
  say(`the up-and-down hand's play: ${f(b6[0]/D,2)}-${f(b6[1]/D,2)}° on the dial, ${f(uh[0]*60,0)}-${f(uh[1]*60,0)} minutes of its 56-hour scale (7/8 of a turn), taken up as the fusee turns either way`);
  say(`the cannon pinion's friction: a 45 g knock across the case turns the hands on it at ${f(CAN.lo*1000,2)} mN·m (the minute hand's ${f(WJ.minuteHand.m,2)} g, ${f(Math.hypot(WJ.minuteHand.cg[0],WJ.minuteHand.cg[2]),1)} mm off its axis; the hour hand's through 1/12); setting the hands forward adds it to the centre arbor's ${f(CAN.Tc0*1000,1)} mN·m fully wound, and past ${f(CAN.hi*1000,0)} mN·m (the drive ×${f(CAN.sT,2)}) the balance swings to the escapement's trip (${f(E.TRIP/D,0)}°)`);
  chk(CAN.hi>3*CAN.lo,`the window ${f(CAN.lo*1000,1)}-${f(CAN.hi*1000,0)} mN·m is wide; the model takes its middle, ${f(CAN.take*1000,1)} mN·m (estimated: no sheet gives the fit). Set back, a fit over the centre arbor's ${f(CAN.Tc12*1000,1)} mN·m at 12 h pushes the train back on its locking stone while the hands turn`);
  out.motion={hourPlay:hp,udPlay:uh,cannon:CAN};}


head(`(${f((Date.now()-T0)/1000)} s)`);
console.log(rows.join('\n'));
const jo=process.argv.indexOf('--json');if(jo>0)fs.writeFileSync(process.argv[jo+1],JSON.stringify(out,null,0));
if(fail)process.exitCode=1;})().catch(e=>{console.error(e);process.exitCode=2;});
