// The Hamilton's whole transmission, every part that moves, nonlinear and in time (the model README's "The whole transmission in time"), wempe_transmission.js's bodies,
// elements and runs on the Model 21's own parts: the mainspring in its barrel, the chain, the fusee with its winding ratchet, the two winding pawls, the sustaining ratchet,
// its spring and pawl, the fusee wheel and the going train to the escape wheel, the motion work and the hands, the wind indicator, the key and the stop, each a body (its
// inertia weighed on the model's solids: mechanisms.json; or estimated, said where) joined by the elements a real movement has, each with its own law, none linearised:
//   the mainspring: its solved torque through the fusee (mainspring_friction.json's fusee table: the drum's turns Ib(n) for the fusee's n, the torque on the fusee arbor
//     frictionless and running at mu 0.10, on physics.js's Tf) and its coils' friction as a stick-slip element (frictionless less running, state by state: winding takes as
//     much more as running gives less), so it turns from one branch to the other as the barrel reverses;
//   the chain: tension only (it goes slack), its stiffness from its plates and rivets (Fig. 38's chain as movement.js draws it: 0.9 × 0.18 plates at a 1.7 pitch; the
//     sections strength.js loads), its lever on the fusee where the chain leaves it (r_B dIb/dn, the fusee table's own: 7.5 fully wound to 14.3 at its last turn) and on
//     the drum (physics.js rB, 18.79), each lever rising and falling as a link comes onto it (the polygon a chain of 1.7 links makes round a drum);
//   the two winding pawls (pivoted on the sustaining ratchet, opposite each other on the fusee's 36-tooth winding ratchet, so both bear at once: ratchets.js) and the
//     sustaining pawl (pivoted on the frame, on the sustaining ratchet's 120 teeth): each a body on its pivot under its spring (ratchets.js's: the winding pawls' bands
//     0.3 × 0.5, the sustaining pawl's wire r 0.12 set 0.12 rad in), riding the teeth's backs, falling into the gaps and catching a face only if it is down;
//   the sustaining spring (42016): a split ring weaker than the drive, BANKED in running (unlike the Wempe's maintaining spring, which runs open): its push opening
//     from its bank (sustaining.js's stiffness by Castigliano on the traced section, 0.36 N·m a radian over its 16.9°: 28 % of the drive banked), its bank where its lobes
//     meet stiff (estimated), so in running it carries the drive through its banking and only opens while the key winds;
//   every mesh (the train's four, the motion work's two, the wind indicator's): tooth by tooth on the model's own outlines (gearing.js's mesh on core.js gearOutline, the
//     going train's modules solve.py's, the motion work's and the indicator's from their arbors' places as motionwork.js takes them), the driven gear's angle under load for
//     each angle of the driver, the backlash to the back flank, the torque ratio with the teeth's friction, the teeth's give as cantilevers (traindyn.js's);
//   the cannon pinion's friction fit on the centre arbor (it slips past its torque: motionwork.js's window), the motion work's and the indicator's friction on their studs;
//   the key: the Model 21's plain key on the fusee's square (Sec. III: no one-way key; deviations.js's one-way key is the build's deviation, not modelled here), so when the
//     hand lets go the key runs forward with the fusee to the pawls; the stop-bar on the winding stop's stud at full wind (overwind.js's sizes);
//   the escapement: dynamics.js's own (the balance, the escape wheel and the detent through every contact), driven by the train through the escape pinion's mesh each step
//     (dynamics.js's o.tq), or locked on its stone while the key turns.
// Its sections:
//   1. the bodies and the elements, every moving part with what moves it;
//   2. the whole wind quasi-statically: every part's load from full wind to run down, the sustaining spring's closure past its bank, the swing and rate; then the drive in
//      time over a whole run with every ripple at once (the chain's polygon on both drums, each mesh's ratio through its pitch) and what they do to the swing and the time;
//   3. the running transmission's modes (linearised at 12 h only to find them);
//   4. a beat: the train as bodies on its meshes driving dynamics.js's escapement, against the same escapement on a rigid train;
//   5. winding: the key put on (the sustaining ratchet falling back to its pawl), a stroke of the key, and the key let go at every place the winding pawls can be (the fusee,
//      key and barrel running free to the pawls): the blow on the winding ratchet's teeth, the sustaining spring thrown towards its bank, the blow passed to the locking stone;
//      with the estimates it rests on varied;
//   6. the stop at full wind: the key wound into it and forced by a strong hand: the stop-bar and stud, the chain;
//   7. the motion work and the wind indicator: their backlash as the hands' play, the cannon pinion's friction window.
// The drive: the escapement is calibrated at 255° on the page's 12-hour drive (makeEsc's TAUE; app.js's drvF is the fusee's torque against its 12-hour value), and the
// solved spring through the train gives the escape wheel more than that (physics.js's budget, the gap kept open by the owner's choice: the model's TF 67 s): so the runs
// that drive the escapement (the beat, the ripple) take the mainspring scaled to the page's level (KDRV), the loads of the winds and the stop take its own, and a beat's
// peaks are judged as their factor over running times strength.js's fully wound force, as wempe_transmission.js judges the Wempe's.
// Needs only Node.js:   node hamilton_transmission.js [--json OUT]   (about 1-2 minutes, as loaded as the machine is: the meshes' tables, then the beat and the winds, each in
// a thread of its own, the coupled beat the longest; MC_TR_TABS=FILE keeps the tables between runs; MC_TR_PROF=1 times each on stderr). Exits 1 if a mesh jams, the coupled beat
// misses or trips a beat, parts from the rigid train's swing by 8° or rate by 0.5 s a day (the Wempe's tolerance), the cannon pinion slips running, the sustaining spring opens off its
// bank running, the pawls catch less than a quarter of their face, or a peak load passes its part's strength (strength.js's, ratchets.js's and overwind.js's lines) running, in the
// beat, with the key eased back or at the stop (the key let go outright, a misuse, is judged softly: reported, ~~)
const {Worker,isMainThread,parentPort,workerData}=require('worker_threads');
const MU=0.15;   /* the teeth's friction: the middle of gearing.js's 0.10-0.20 (steel leaves on brass teeth) */
/* a mesh's table over one pitch of the driver (gearing.js's mesh and lag on core.js's outlines): the driven gear's angle at contact (ee, its lag), the backlash to its back flank
   (bl), the torque ratio against the nominal at mu 0, 0.10, 0.20 (fac, as gearing.js's stage works it) */
function meshTab({zA,zB,m,dd}){const G=require('./gearing.js');
  const A=G.gear(zA,m,zB),B=G.gear(zB,m),d=m*(zA+zB)/2+dd,M=G.mesh(A,B,d),NS=120,span=A.p,start=M.a0-span/2,ee=[],bl=[],fac=[[],[],[]];let e=0;
  const tip=Math.min(d-A.ro-B.ri,d-B.ro-A.ri);if(tip<=0)return{jam:true,tip};
  for(let pass=0;pass<2;pass++)for(let i=0;i<=NS;i++){const al=start+span*i/NS,x=M.lag(al,e,pass?24:10);if(x===null)return{jam:true,tip};e=x;if(!pass)continue;
    ee.push(x);bl.push(i%12===0||i===NS?M.back(al,x):NaN);
    const be=M.b0-M.k*(al-M.a0)+x,[,w,Pt]=M.pen(al,be+1e-9),n=M.normal(al,be,w,Pt),nB=w==='A'?[-n[0],-n[1]]:n;
    const vA=[-Pt[1],Pt[0]],vB=[M.k*Pt[1],-M.k*(Pt[0]-d)],vr=[vA[0]-vB[0],vA[1]-vB[1]],vn=vr[0]*nB[0]+vr[1]*nB[1],t=[vr[0]-vn*nB[0],vr[1]-vn*nB[1]],tl=Math.hypot(...t)||1;
    [0,0.10,0.20].forEach((mu,j)=>{const F=[nB[0]+mu*t[0]/tl,nB[1]+mu*t[1]/tl],tB=(Pt[0]-d)*F[1]-Pt[1]*F[0],tA=-(Pt[0]*F[1]-Pt[1]*F[0]);fac[j].push((tB/tA)*M.k);});}
  for(let i=0;i<=NS;i++)if(isNaN(bl[i])){const a=i-(i%12),b=Math.min(NS,a+12);bl[i]=bl[a]+(bl[b]-bl[a])*(i-a)/(b-a);}
  return{zA,zB,m,d,k:M.k,p:span,start,a0:M.a0,b0:M.b0,ee,bl,fac,NS,tip,ro:[A.ro,B.ro],ri:[A.ri,B.ri]};}
if(!isMainThread&&!workerData.job){parentPort.postMessage(meshTab(workerData));return;}

const fs=require('fs'),path=require('path');
const quiet=f=>{const o=console.log;console.log=()=>{};try{return f();}finally{console.log=o;}};
const PH=require('./physics.js'),DY=require('./dynamics.js'),G=require('./gearing.js'),MJ=require('./mechanisms.json'),MF=require('./mainspring_friction.json').summary;
const E=DY.ESC,TR=PH.TRAIN,MO=PH.MODS,A_=MJ.arbors,LL=MJ.L;
const D=Math.PI/180,TAU=2*Math.PI,G0=9.80665,f=(x,n=0)=>Number.isFinite(+x)?(+x).toFixed(n):'-',rows=[],out={};let fail=0;
const say=s=>rows.push('  '+s),head=s=>rows.push('\n'+s),chk=(ok,s,soft)=>{if(!ok&&!soft)fail=1;rows.push(`${ok?'  ok ':soft?'  ~~ ':'  !! '} ${s}`);};
const mv=fs.readFileSync(path.join(__dirname,'..','js','movement.js'),'utf8'),T0=Date.now();

/* ===================== 1. the bodies and the elements ===================== */
/* the fusee: mainspring_friction.json's table every quarter turn n from full wind (the page's fusee: movement.js makeFusee, its set-up by the fusee's rule): the drum's turns
   Ib(n), the torque on the fusee arbor against physics.js's Tf (the solved spring's pull fully wound on the chain's pitch line there, 7.51 mm) frictionless and running at
   mu 0.10. The chain's lever on the fusee, where it leaves it, is the drum's radius times dIb/dn (the chain off the fusee goes onto the drum); the table ends at 8.5 turns,
   where the chain's last turn leaves the cone (the end pin then swings round to run down, the last quarter of FUSEE_TURNS' 8.75) */
const FT=MF.fusee,NRUN=FT.frictionless[FT.frictionless.length-1][0],NQ=FT.frictionless.length,RB=PH.rB,HPT=TR.fu/TR.cp;   /* turns; mm; hours a fusee turn (6.43) */
const IbN=FT.frictionless.map(r=>r[1]),fr0=FT.frictionless.map(r=>r[2]),fr1=FT.running['0.1'].map(r=>r[2]),dn=NRUN/(NQ-1);
const rhoN=IbN.map((_,i)=>RB*(i===0?(-3*IbN[0]+4*IbN[1]-IbN[2])/(2*dn):i===NQ-1?(3*IbN[i]-4*IbN[i-1]+IbN[i-2])/(2*dn):(IbN[i+1]-IbN[i-1])/(2*dn)));   /* second-order differences */
const lin=Y=>n=>{const u=Math.max(0,Math.min(NQ-1,n/dn)),i=Math.min(NQ-2,Math.floor(u)),w=u-i;return Y[i]*(1-w)+Y[i+1]*w;};
const rho=lin(rhoN),fusT=n=>PH.Tf*lin(fr1)(Math.max(0,Math.min(NRUN,n))),fusT0=n=>PH.Tf*lin(fr0)(Math.max(0,Math.min(NRUN,n)));   /* mm; N·m on the fusee arbor, running and frictionless */
/* the drum's turn from full wind for the fusee's n (the chain off the fusee onto the drum: ∫ ρ dφ / RB, the table's own levers), tabled; and back */
const NB=400,bTab=[0];for(let i=1;i<=NB;i++){const a=NRUN*(i-1)/NB,b=NRUN*i/NB;bTab.push(bTab[i-1]+TAU*(rho(a)+4*rho((a+b)/2)+rho(b))/6*(b-a)/RB);}
const betaOf=n=>{const u=Math.max(0,Math.min(NB,n/NRUN*NB)),i=Math.min(NB-1,Math.floor(u));return bTab[i]+(bTab[i+1]-bTab[i])*(u-i);};
const nOfBeta=b=>{if(b<=0)return 0;if(b>=bTab[NB])return NRUN;let lo=0,hi=NB;while(hi-lo>1){const md=(lo+hi)>>1;bTab[md]<=b?lo=md:hi=md;}return NRUN*(lo+(b-bTab[lo])/(bTab[hi]-bTab[lo]))/NB;};
/* the mainspring on the drum: running, what gives the fusee arbor its running torque through the chain's levers (Mrun); its coils' friction (mainspring_friction.py on the solved
   spring, mu 0.10, the model's) the frictionless less the running, state by state (Fc: 2-5 % of the torque, the most fully wound), a stick-slip element of Fc each way about the
   frictionless (Mfl) */
const Mrun=n=>fusT(n)*RB/rho(n),Mfl=n=>fusT0(n)*RB/rho(n),Fcf=n=>Math.max(0,Mfl(n)-Mrun(n));
/* the inertias (g·mm², about each body's own axis): weighed on the model's solids (mechanisms.json: mechanisms.py on the built model) or estimated where no solid is weighed:
   the mainspring's moving half on the drum (2,100, overwind.js's and ratchets.js's estimate); the chain (Fig. 38's: three plates 0.9 × 0.18 a pitch of 1.7, two of them an outer
   link's, and a rivet r 0.17, about 0.55 mm³ of steel a pitch; IN 4.46 turns of the 18.79 drum plus the span, about 560 mm: 1.4 g, all moving at the chain's speed, so at the drum
   m RB²); the wind indicator's wheel and hand (a 120-tooth brass wheel of r 15.1 (motionwork.js's module), spoked, 0.5 thick, and its hand as half the hour hand: about 200); the key
   (core.js windingKey, brass, kw 4.4: the pipe, the collar Ø 9.7 × 4 and the paddle 13.6 × 12.8 × 3.5, about 10 g: about 120 about its axis) */
const MCH=560/1.7*0.55*7.85e-3,JI={barrel:A_.barrel.I+2100+MCH*RB*RB,fusee:A_.fusee.I+A_.square.I,ratchet:A_.sratchet.I+A_.sspring.I/2+2*0.0335*(Math.hypot(7.6945,4.2289))**2,fw:A_.fuseeWheel.I+A_.sspring.I/2,
  centre:A_.centre.I,cannon:A_.cannon.I+A_.minuteHand.I,change:A_.minuteWheel.I,hour:A_.hourWheel.I+A_.hourHand.I,inter:A_.third.I,sec:A_.fourth.I+A_.secondsHand.I,esc:A_.escape.I,ud:200,key:120};
/* the parts' figures from their own tools (computed once in the main thread, handed to the runs' threads): the sustaining spring (sustaining.js), the pawls and their springs
   (ratchets.js, off mechanisms.json), the stop (overwind.js), the cannon pinion's window (motionwork.js) */
let HP=null;
function params(){const SU=quiet(()=>require('./sustaining.js')),RA=require('./ratchets.js'),OW=require('./overwind.js'),MW=quiet(()=>require('./motionwork.js'));
  const pw=nm=>RA.pawls.find(p=>p.name===nm),SR=Math.hypot(LL.Fu[0]-4.0,LL.Fu[1]+19.9),Fst=(OW.hand.TH-PH.Tf)*1000/SR;   /* the stud's centre 11.6 from the fusee's axis (overwind.js) */
  const ln=(o,i)=>({F:o.F,s:o.lines[i].sig,what:o.lines[i].what,lo:o.lines[i].lo,hi:o.lines[i].hi});
  return{KT:SU.spring.kt,SMAX:SU.spring.SMAX,SSB:SU.spring.SSB,SSG:SU.spring.SSG,SPU:SU.spring.SPU,
    w1:{k:pw('winding pawl 1').k,arm:pw('winding pawl 1').arm2,need:pw('winding pawl 1').set},w2:{k:pw('winding pawl 2').k,arm:pw('winding pawl 2').arm2,need:pw('winding pawl 2').set},
    sp:{k:pw('sustaining pawl').k,arm:pw('sustaining pawl').arm2,pre:MJ.pawls.find(p=>p.name==='sustaining pawl').spring.preTurn},
    strW:ln(pw('winding pawl 1'),0),strS:ln(pw('sustaining pawl'),0),
    stop:{k:OW.notes[0].k,SR,bar:OW.forward[0].sig/Fst,stud:OW.forward[1].sig/Fst,barY:[OW.forward[0].lo,OW.forward[0].hi],studY:[OW.forward[1].lo,OW.forward[1].hi]},TH:OW.hand.TH,
    can:{lo:MW.cannon.Tlo,hi:MW.cannon.Thi,mid:MW.cannon.mid,Tc:MW.cannon.Tc,x60:MW.cannon.x60}};}
const setHP=h=>{HP=h;};
/* the sustaining spring: its push for a closure ψ of the ratchet on the wheel from its free gap, KT ψ (sustaining.js: linear, the band bent in its plane), banking at SMAX (its
   lobes meeting, SSB short of closed) stiff past it (PAR.kbank: estimated, its ends butted, the ring a strut between its pins, about 40 times its running stiffness, as the Wempe's) */
const msT=ps=>HP.KT*ps+(ps>HP.SMAX?PAR.kbank*(ps-HP.SMAX):0),msPh=T=>T<=HP.KT*HP.SMAX?T/HP.KT:HP.SMAX+(T-HP.KT*HP.SMAX)/PAR.kbank;
/* the elements' stiffnesses (estimated, each from its parts; their ranges tried below where a result rests on them):
   a mesh: the teeth as cantilevers, E b s³ / 4 h³ (the brass wheel's 1.57 m root on a 2.25 m tooth, the steel pinion leaf's 1.05 m), in series and halved for the contact
   (traindyn.js's), b the face where wheel and pinion overlap (traindyn.js's fc): 1,624 N/mm a millimetre of face at the pitch circle;
   the chain: a pitch 5.6 kN/mm (the inner link's one plate 14 and the outer link's two 28 kN/mm of steel over 1.7, at the waist's 0.115 mm² that strength.js's stress gives; each rivet
   joint, r 0.17, about 8 kN/mm in bending and bearing), over the free span between the drums (37.6 mm, the arbors' L.Fu to L.Ba) and the turns on each drum it lets the tension into (as
   far as the links' friction on the groove, mu 0.15, lets it reach: about rho / mu on each drum): 37-253 N/mm, the geometric middle 100 taken;
   the winding pawls' faces on the winding ratchet's teeth (hardened steel, 0.5 thick) 10 kN/mm, the sustaining pawl's on the sustaining ratchet's (brass, 1.18) 5 kN/mm; the escape
   wheel's tooth on the locking stone 2 kN/mm (wempe_transmission.js's estimates); the stop-bar's end and the stud in series (overwind.js: 3 E I / L³ each), at the stud's 11.6 from
   the fusee's axis; the sustaining spring banked about 40 times its running stiffness; the cannon pinion's grip on the centre arbor 50 N·m a radian (a friction-tight tube, as the Wempe's);
   the key on the fusee's square 50 N·m a radian (the arbor's neck, Ø 2.4 and about 5 long, in torsion, the socket's play left out); damping 3 % of critical in the meshes (oil), 5 % in
   the chain, the contacts and the cannon pinion, 2 % in the springs */
const KM=b=>1624*b,KDT=5e3,KST=2e3,KCAN=50,KKEY=50,rE=E.ES/1000;   /* N/mm (KM a mm of face); N·m a radian; the escape wheel's radius, m (6.58 mm) */
const ZM=0.03,ZS=0.02,PAR={hy:1,kcl:1e4,kbank:0,zc:0.05,kch:100,tsl:3e-3,set:0.2};   /* PAR: the estimates section 5 varies (the pawls' faces, the bank, the contacts' damping, the chain, the winding pawls' springs' set); kbank set from HP */
const KB=()=>PAR.kbank||40*HP.KT;
/* the pawls (mechanisms.json: their pivots, their contacts on the faces as drawn, the teeth's depth): the nose's lever about the pivot (how far it rises a radian of the pawl),
   the lift that clears a tip; their springs (ratchets.js's: the winding pawls' bands 290 and 121 mN/mm at their ends 0.96 from the pivot, set PAR.set (0.2 mm: estimated, against
   the 0.03-0.08 ratchets.js finds they need to follow the fusee down when the key lets go); the sustaining pawl's wire 49 mN/mm 2.62 from its pivot, set 0.12 rad in, the model's) */
const pawl=nm=>{const q=MJ.pawls.find(p=>p.name===nm),C=q.face.C,Pv=q.pivot,v=[C[0]-Pv[0],C[1]-Pv[1]],rc=Math.hypot(...C),dr=Math.abs((-v[1]*C[0]+v[0]*C[1])/rc);
  return{q,rc:rc*1e-3,ell:dr*1e-3,hmax:(q.ro-rc)/dr,depth:q.ro-rc,z:q.z,p:TAU/q.z,gap:q.face.gap};};
const CK=pawl('winding pawl 1'),CK2=pawl('winding pawl 2'),DT=pawl('sustaining pawl');
const KSW=w=>w.k*1e3*(w.arm*1e-3)**2,PSW=w=>PAR.set/w.arm;   /* N·m a radian; preload (rad) */
/* the meshes: [name, driver, driven, z, z, module, the centres' offset from m (z1 + z2) / 2 (mm), face (mm), the driver's place in its pitch at the start]. The going train at its
   drawn centres (solve.py's modules: gearing.js D0 0); the motion work and the indicator at their arbors' distances (motionwork.js's modules), their faces 1.0 (estimated) */
const arb=n=>{const m=new RegExp(`R\\.${n}=hn\\(arbor\\((.*?)\\),'`).exec(mv);if(!m)throw Error('hamilton_transmission: arbor '+n);const s=m[1],w=/wheel:\{[^}]*?th:([\d.]+)/.exec(s),p=/pin:\{[^}]*?th:([\d.]+)/.exec(s),wy=/wheel:\{[^}]*?\by:([-\d.]+)[,}]/.exec(s),py=/pin:\{[^}]*?\by:([-\d.]+)[,}]/.exec(s);return{w:w&&+w[1],p:p&&+p[1],wy:wy&&+wy[1],py:py&&+py[1]};};
const fc=(W,P)=>W.wy!=null&&P.py!=null?Math.max(0,Math.min(W.wy+W.w/2,P.py+P.p/2)-Math.max(W.wy-W.w/2,P.py-P.p/2)):Math.min(W.w,P.p);   /* traindyn.js's: where the wheel's and the pinion's heights overlap */
const FA={gw:arb('gw'),cw:arb('cw'),tw:arb('tw'),fw:arb('fw'),esc:arb('esc')},FACE=[fc(FA.gw,FA.cw),fc(FA.cw,FA.tw),fc(FA.tw,FA.fw),fc(FA.fw,FA.esc)];
const MWc=(re=>{const m=re.exec(mv);if(!m)throw Error('hamilton_transmission: MW');return m.slice(1).map(Number);})(/const MW=\{cp:(\d+),mw:(\d+),mp:(\d+),hw:(\d+)\}/),UD=(m=>[+m[1],+m[2]])(/Ud:\[(-?[\d.]+),(-?[\d.]+)\]/.exec(mv));
const dMW=Math.hypot(LL.Mw[0]-LL.C[0],LL.Mw[1]-LL.C[1]),dUD=Math.hypot(LL.Fu[0]-UD[0],LL.Fu[1]-UD[1]),M_CH=2*dMW/(MWc[0]+MWc[1]),M_HR=2*dMW/(MWc[2]+MWc[3]),M_UD=2*dUD/(12+120);
const MESH=[...G.STG.map(([nm,zA,zB,m],k)=>({nm,A:['fw','centre','inter','sec'][k],B:['centre','inter','sec','esc'][k],zA,zB,m,dd:0,b:FACE[k],ph:[0.13,0.57,0.31,0.89][k]})),
  {nm:'cannon pinion → minute wheel',A:'cannon',B:'change',zA:MWc[0],zB:MWc[1],m:M_CH,dd:0,b:1.0,ph:0.41},
  {nm:'minute pinion → hour wheel',A:'change',B:'hour',zA:MWc[2],zB:MWc[3],m:M_HR,dd:0,b:1.0,ph:0.77},
  {nm:'fusee pinion → wind indicator',A:'fusee',B:'ud',zA:12,zB:120,m:M_UD,dd:0,b:1.0,ph:0.23}];
/* the pivots' friction (physics.js A6: the driven arbor's pivots carry the pinion's and its own wheel's tooth loads, mu_p r_p of it; physics.js STG's pivots and wheels) */
const MUP=0.12,LP=PH.STG.map(([,m,,zp,rw,p])=>MUP*(p[0]+p[1])/2*(1/(m*zp/2)+1/rw));

/* the integrator: bodies (angles forward in the running sense, kg·m²), elements adding torques, semi-implicit Euler steps of 1 µs (wempe_transmission.js's) */
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
/* a pawl: its body ψ (0 down in its gap, lifting +) under its spring, riding a ratchet's teeth (wempe_transmission.js's). x the ratchet's place against the pawl (the winding
   ratchet against a winding pawl: the fusee's lead over the sustaining ratchet; the sustaining ratchet against its pawl: its own angle), the pawl's face catching when x reaches a face
   from behind with the pawl down, the teeth's backs a straight rise of hmax over a pitch (estimated); dirn +1 the pawl holds x from passing forward (the winding pawls), -1 from back
   (the sustaining pawl) */
function pawlEl(mc,ip,xa,xb,pw,ks,ps0,kf,dirn,x0){const B=mc.B,p=pw.p,hm=pw.hmax,kb=1e7*pw.ell*pw.ell,cb=crit(kb,B[ip].J,1e9,PAR.zc),cs=crit(ks,B[ip].J,1e9,ZS),Jx=xb>=0?1/(1/B[xa].J+1/B[xb].J):B[xa].J,cf=crit(kf,Jx,1e9,PAR.zc);
  const el={n:0,x0,L:0,maxL:0,eng:[],catchE:null,hits:0,on:false,maxImp:0};
  const X=()=>dirn*(B[xa].q-(xb>=0?B[xb].q:0)-el.x0),Xv=()=>dirn*(B[xa].v-(xb>=0?B[xb].v:0));
  el.f=()=>{let x=X()-el.n*p;const ps=B[ip].q;
    while(x<=-p){el.n--;x+=p;}while(x>p){el.n++;x-=p;}if(x>0&&ps>=hm*0.98){el.n++;x-=p;}
    const h=x>0?0:-hm*x/p,g=h-ps,dh=x>0?0:-hm/p;let Lb=0;if(g>0)Lb=Math.max(0,kb*g+cb*(dh*Xv()-B[ip].v));
    B[ip].F+=Lb-(ks*(ps+ps0)+cs*B[ip].v);
    let L=0;if(x>0&&ps<hm){L=Math.max(0,kf*x+cf*Xv());if(!el.on&&L>0){el.hits++;el.catchE=1-ps/hm;el.eng.push(el.catchE);}}
    el.on=L>0;el.L=L;const Q=-Lb*dh-L;
    B[xa].F+=dirn*Q;if(xb>=0)B[xb].F-=dirn*Q;};
  el.rec=()=>{el.maxL=Math.max(el.maxL,el.L);};return mc.add(el);}

/* ---------- the meshes' tables, in parallel ---------- */
const TC=process.env.MC_TR_TABS,tabs=()=>TC&&fs.existsSync(TC)?Promise.resolve(JSON.parse(fs.readFileSync(TC,'utf8'))):Promise.all(MESH.map(q=>new Promise((ok,no)=>{const w=new Worker(__filename,{workerData:{zA:q.zA,zB:q.zB,m:q.m,dd:q.dd}});w.on('message',ok);w.on('error',no);})));

/* the bodies and elements of the whole movement at n turns from full wind, in static running equilibrium (the escape wheel on its stone): every element's torque from the
   fusee arbor's torque down the train (each mesh's mean torque ratio at MU, the pivots' friction). o.kdrv scales the mainspring (the page's level: KDRV, above) */
function build(TB,n,o={}){const mc=Mach(),b={},kd=o.kdrv??1;for(const k of['barrel','fusee','ratchet','fw','centre','cannon','change','hour','inter','sec','esc','ud'])b[k]=mc.body(k,JI[k]);
  if(o.key){b.key=mc.body('key',JI.key);}
  const JP=MJ.pawls.find(p=>p.name==='winding pawl 1').I,JD=MJ.pawls.find(p=>p.name==='sustaining pawl').I;
  b.c1=mc.body('click 1',JP);b.c2=mc.body('click 2',JP);b.det=mc.body('maintaining detent',JD);   /* the Wempe's names, so the trace reads alike: winding pawls 1 and 2, the sustaining pawl */
  const B=mc.B,rh=rho(n)*1e-3,rb=RB*1e-3,S={n,rh};
  const Tf=fusT(n)*kd,mean=t=>{const a=t.fac[1].slice(0,-1),c=t.fac[2].slice(0,-1),pe=(MU-0.1)/0.1;return a.reduce((s,x,i)=>s+x*(1-pe)+c[i]*pe,0)/a.length;};
  const tq={fw:Tf};let T=Tf;const piv=[];MESH.slice(0,4).forEach((q,i)=>{const t=TB[i],T1=T/t.k*mean(t);piv.push(T1*LP[i]);T=T1*(1-LP[i]);tq[q.B]=T;});
  S.tq=tq;S.escT=tq.esc;S.lp=LP;S.Tf=Tf;S.kd=kd;
  /* the mainspring and its coils' friction (stick-slip: kz takes the friction up over 0.05° of the drum) */
  const nB=betaOf(n),kz=Mrun(n)*kd*0.04/(0.05*D);let zq=0;
  const ms=mc.add({f:()=>{const be=B[b.barrel].q,nn=nOfBeta(nB+be),M=Mfl(nn)*kd,Fc=Fcf(nn)*kd*PAR.hy;let Fh=kz*(be-zq);if(mc.fd)Fh=Fc;else if(Fh>Fc){Fh=Fc;zq=be-Fc/kz;}else if(Fh<-Fc){Fh=-Fc;zq=be+Fc/kz;}
    ms.M=M-Fh;ms.n=nn;B[b.barrel].F+=M-Fh;}});ms.preset=()=>{const nn=nOfBeta(nB+B[b.barrel].q);zq=B[b.barrel].q-Fcf(nn)*kd*PAR.hy/kz;};ms.preset();
  /* the chain: tension only; the fusee's lever where the chain leaves it as the fusee turns (n with it), the chain off the fusee integrated; the polygon's lever by the link's phase */
  const PC=1.7,ch={sF:0,qF:0,d0:0,T:0,maxT:0,minT:Infinity,slack:0,poly:!!o.poly},kc=PAR.kch*1e3,cc=crit(kc*rb*rb,B[b.barrel].J,B[b.fusee].J,PAR.zc)/(rb*rb);
  const pf=(s,r)=>{if(!ch.poly)return 1;const a=2*Math.asin(PC/(2*r)),u=((s/(PC*1e-3))%1+1)%1;return Math.cos((u-0.5)*a)/(Math.sin(a/2)/(a/2));};
  ch.f=()=>{const nf=n+B[b.fusee].q/TAU,rf=rho(Math.max(0,Math.min(NRUN,nf)))*1e-3,s=rb*B[b.barrel].q,d=s-ch.sF-rf*(B[b.fusee].q-ch.qF)+ch.d0,dv=rb*B[b.barrel].v-rf*B[b.fusee].v;
    let Tn=d>0?Math.max(0,kc*d+cc*dv):0;ch.T=Tn;ch.rf=rf;B[b.barrel].F-=Tn*rb*pf(s,RB);B[b.fusee].F+=Tn*rf*pf(s+0.37*PC*1e-3,rf*1e3);};
  ch.post=()=>{ch.sF+=ch.rf*(B[b.fusee].q-ch.qF);ch.qF=B[b.fusee].q;};ch.rec=()=>{ch.maxT=Math.max(ch.maxT,ch.T);ch.minT=Math.min(ch.minT,ch.T);if(ch.T===0)ch.slack++;};mc.add(ch);
  ch.d0=Mrun(n)*kd/rb/kc;
  /* the winding pawls between the fusee (its winding ratchet) and the sustaining ratchet, both on their faces (opposite on 36 teeth: ratchets.js); the sustaining pawl on the
     sustaining ratchet, its face half a tooth behind it running (where it creeps as the ratchet runs on) */
  const kfc=PAR.kcl*1e3*CK.rc*CK.rc,kfd=KDT*1e3*DT.rc*DT.rc,ks1=KSW(HP.w1),ks2=KSW(HP.w2);
  const c1=pawlEl(mc,b.c1,b.fusee,b.ratchet,CK,ks1,PSW(HP.w1),kfc,1,0),c2=pawlEl(mc,b.c2,b.fusee,b.ratchet,CK2,ks2,PSW(HP.w2),kfc,1,0);
  const dt_=pawlEl(mc,b.det,b.ratchet,-1,DT,KSW(HP.sp),HP.sp.pre,kfd,-1,0);
  /* the sustaining spring, ratchet to fusee wheel, banked in running */
  const sp=springEl(mc,b.ratchet,b.fw,msT,KB(),ZS);
  /* the train's meshes and the motion work's, the indicator's */
  const me=MESH.map((q,i)=>meshEl(mc,TB[i],b[q.A],b[q.B],KM(q.b)*1e3*(q.m*q.zB/2e3)**2,{ph:q.ph}));
  /* the cannon pinion's friction fit on the centre arbor: elastic to its slip torque (o.tsl), then slipping */
  const tsl=o.tsl??PAR.tsl;let zc=0;const cn={T:0,slip:0,maxT:0};cn.f=()=>{const d=B[b.centre].q-B[b.cannon].q-zc,dv=B[b.centre].v-B[b.cannon].v;let Tc=KCAN*d+crit(KCAN,B[b.centre].J,B[b.cannon].J,PAR.zc)*dv;
    if(Tc>tsl){zc+=(Tc-tsl)/KCAN;cn.slip+=Math.abs(Tc-tsl)/KCAN;Tc=tsl;}else if(Tc<-tsl){zc+=(Tc+tsl)/KCAN;cn.slip+=Math.abs(Tc+tsl)/KCAN;Tc=-tsl;}cn.T=Tc;B[b.centre].F-=Tc;B[b.cannon].F+=Tc;};
  cn.rec=()=>{cn.maxT=Math.max(cn.maxT,Math.abs(cn.T));};mc.add(cn);
  /* friction on the studs and pivots, Coulomb (tanh over 1e-4 rad/s): the minute wheel on its stud and the hour wheel on the cannon tube, their weights on their shoulders (mu 0.15,
     the bores' radii 0.75 and 1.5: estimated); the indicator's wheel the same on its stud (0.75, its 1.2 g estimated); the going train's pivots under their static loads (mu_p 0.12) */
  const cou=(i,T)=>mc.add({f:()=>{B[i].F-=T*Math.tanh(B[i].v/1e-4);}});
  MESH.slice(0,4).forEach((q,i)=>cou(b[q.B],piv[i]));cou(b.change,0.15*A_.minuteWheel.m*1e-3*G0*0.75e-3);cou(b.hour,0.15*(A_.hourWheel.m+A_.hourHand.m)*1e-3*G0*1.5e-3);cou(b.ud,0.15*1.2e-3*G0*0.75e-3);
  /* the escape wheel on its locking stone (o.free: driven from outside, dynamics.js's) */
  let st=null;if(!o.free){st=stopEl(mc,b.esc,0,1,KST*1e3*rE**2,PAR.zc);}else B[b.esc].pres=true;
  /* the key and the hand (o.key): the Model 21's plain key on the fusee's square (stiff both ways: a hand let go leaves the key to run with the fusee); the hand on the key through
     the fingers' grip (1 N·m a radian, estimated), following its speed up to its strongest torque */
  let hd=null,ow=null;if(o.key){const ck=crit(KKEY,B[b.key].J,B[b.fusee].J,PAR.zc);ow={T:0,maxT:0};
    ow.f=()=>{const d=B[b.key].q-B[b.fusee].q,dv=B[b.key].v-B[b.fusee].v,Tk=KKEY*d+ck*dv;ow.T=Tk;B[b.key].F-=Tk;B[b.fusee].F+=Tk;};
    ow.rec=()=>{ow.maxT=Math.max(ow.maxT,-ow.T);};mc.add(ow);
    hd={th:0,w:0,Tmax:o.Tmax??HP.TH,kh:o.kh??1.0,T:0,on:false,maxT:0};const chh=crit(hd.kh,B[b.key].J,1e3,0.5);
    hd.f=()=>{if(!hd.on){hd.T=0;return;}let Th=hd.kh*(hd.th-B[b.key].q)+chh*(hd.w-B[b.key].v);if(Th<-hd.Tmax){Th=-hd.Tmax;hd.th=B[b.key].q-hd.Tmax/hd.kh;}else if(Th>hd.Tmax){Th=hd.Tmax;hd.th=B[b.key].q+hd.Tmax/hd.kh;}hd.T=Th;B[b.key].F+=Th;};
    hd.post=(m,dt)=>{if(hd.on)hd.th+=hd.w*dt;};hd.rec=()=>{hd.maxT=Math.max(hd.maxT,-hd.T);};mc.add(hd);}
  /* the stop at full wind (the stop-bar's end on the stud, within the fusee's last turn) */
  const KSTOP=HP.stop.k*1e3*(HP.stop.SR*1e-3)**2,sw=n<1?stopEl(mc,b.fusee,-n*TAU,-1,KSTOP,PAR.zc):null;if(sw)sw.on=false;
  /* the static state: the sustaining spring closed past its bank, each mesh pressed by its torque; the bodies at rest */
  const lead=msPh(Tf);B[b.ratchet].q=lead;
  me.forEach((e,i)=>{const t=i<4?tq[MESH[i].B]:1e-6;e.set(t/e.K);});
  if(st){st.q0=B[b.esc].q-tq.esc/(KST*1e3*rE**2);}
  /* the winding pawls both on their faces, each pressed by half the drive: q_fusee - q_ratchet = x on their faces */
  B[b.fusee].q=lead+Tf/(2*kfc);B[b.c2].q=0;dt_.x0=lead-0.5*DT.p;B[b.det].q=DT.hmax/2;
  return{mc,b,S,ms,ch,c1,c2,dt:dt_,sp,me,cn,st,hd,ow,sw,lead,kfc};}
/* settle a built movement to rest: every body slowed each step (wempe_transmission.js's) */
function settle(X,T=0.06){const{mc}=X,dt=1e-6,N=Math.round(T/dt);mc.fd=true;for(let i=0;i<N;i++){mc.step(dt);for(const b of mc.B)if(!b.pres)b.v*=0.9994;}for(const b of mc.B)if(!b.pres)b.v=0;mc.fd=false;X.ms.preset();}
const recAll=(X,dt)=>{for(const e of X.mc.El)if(e.rec)e.rec(dt);};

/* ---------- the runs in time (section 4's beat and its rigid twin, section 5's winds, section 6's stop), each a thread of its own; each returns its figures ---------- */
/* a beat at 12 h: the train as bodies on its meshes driving dynamics.js's escapement, or the same escapement on a rigid train given the torque the train gives at its place (each
   mesh's ratio where its driver stands, less the pivots' friction: no give, no inertia of its own, no backlash: dynamics.js's JT behind the wheel). The work an impulse gives: the
   balance's energy from before the unlocking (-0.85 rad) to after the impulse (+0.6 rad) on the active swing. The coupled escape wheel's own inertia mechanisms.json's escape arbor */
function beat(TB,rigid,kdrv){const n=12/HPT,X=build(TB,n,{free:true,kdrv}),{mc,b,me,sp,c1,c2,cn,ch}=X,B=mc.B;
  B[b.esc].q=0;B[b.esc].v=0;settle(X,0.08);
  const P_=E.P,J0=A_.escape.I*1e-9/DY.JT,T=24,from=12,cs0=cn.slip;
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
    if(wmO===0&&wm===1&&t>from&&Number.isFinite(sMax))bnc.push(sMax-B[b.sec].q);
    wmO=wm;tO=t;qeO=qe;};
  const r=DY.sim({T,from,J:J0,tq:()=>me[3].lam,watch});
  return{beats:r.beats,trips:r.trips,rate:r.rate,A:r.A,W:trk.W,S:trk.S,T,from,meshes:me.map(e=>({maxL:e.maxL,back:e.back,free:e.free,freeMax:e.freeMax})),bnc,
    sp:[sp.minPsi,sp.maxPsi],ch:[ch.minT,ch.maxT],c1:c1.maxL,c2:c2.maxL,cn:cn.maxT,slip:cn.slip-cs0,lead:X.lead,tq:X.S.tq};}
/* the drive over a whole run with every ripple at once (section 2): the page's drive (the fusee's torque against its 12-hour value, app.js drvF), the swing stepped every second
   (A² towards ampAt's at the drive, TF), the rate each second; the swing's and the rate's tables over drives 0.3-1.7 and swings 150-300°, linear between */
function rippleRun(TB){const v=[];for(let i=0;i<=70;i++)v.push(E.ampAt(0.3+0.02*i));const AMP=s=>{const u=Math.max(0,Math.min(70,(s-0.3)/0.02)),i=Math.min(69,Math.floor(u)),w=u-i;return v[i]*(1-w)+v[i+1]*w;};
  const g=[];for(let j=0;j<=14;j++){const sd=0.3+0.1*j,r=[];for(let i=0;i<=60;i++)r.push(E.rateAt((150+2.5*i)*D,sd));g.push(r);}
  const RT=(a,sd)=>{const u=Math.max(0,Math.min(14,(sd-0.3)/0.1)),q=Math.max(0,Math.min(60,(a/D-150)/2.5)),j=Math.min(13,Math.floor(u)),i=Math.min(59,Math.floor(q)),wj=u-j,wi=q-i;return(g[j][i]*(1-wi)+g[j][i+1]*wi)*(1-wj)+(g[j+1][i]*(1-wi)+g[j+1][i+1]*wi)*wj;};
  const poly=r=>{const a=2*Math.asin(1.7/(2*r));return u=>Math.cos((((u%1)+1)%1-0.5)*a)/(Math.sin(a/2)/(a/2));};
  const mfac=MESH.slice(0,4).map((q,i)=>{const t=TB[i],pe=(MU-0.1)/0.1,a=t.fac[1].map((x,j)=>x*(1-pe)+t.fac[2][j]*pe),m=a.slice(0,-1).reduce((s,x)=>s+x,0)/(a.length-1);return u=>{const x=(((u%1)+1)%1)*t.NS,j=Math.min(t.NS-1,Math.floor(x)),w=x-j;return(a[j]*(1-w)+a[j+1]*w)/m;};});
  const per=[HPT*3600/TR.fu,3600/TR.cw,3600/(TR.cw/TR.tp)/TR.tw,60/TR.fw],T12=fusT(12/HPT);   /* seconds a tooth of each driver: the fusee wheel, centre, third, fourth */
  const runs=src=>{const dt=1,N=Math.floor(NRUN*HPT*3600/dt)-3600;let A2=null,amin=Infinity,amax=-Infinity;const R=new Float64Array(N);
    for(let i=0;i<N;i++){const t=i*dt,n=t/(HPT*3600),s0=fusT(n)/T12;let k=1;
      if(src.chain){const r=rho(n),sC=(betaOf(n)*RB)/1.7;k*=poly(r)(sC+0.37)/poly(RB)(sC);}
      if(src.mesh)for(const j of src.mesh)k*=mfac[j](t/per[j]+[0.13,0.57,0.31,0.89][j]);
      const sd=s0*k,aT=AMP(sd);if(A2===null)A2=aT*aT;A2+=(aT*aT-A2)*(1-Math.exp(-2*dt/E.settings.TF));const a=Math.sqrt(A2);
      if(t>3*E.settings.TF){amin=Math.min(amin,a);amax=Math.max(amax,a);}R[i]=RT(a,sd);}
    return{R,amin:amin/D,amax:amax/D};};
  const wander=(R,R0)=>{let w=0;for(let d=0;(d+1)*86400<=R.length;d++){let e=0,mn=0,mx=0,m=0;for(let i=d*86400;i<(d+1)*86400;i++)m+=(R[i]-R0[i])/86400;m/=86400;for(let i=d*86400;i<(d+1)*86400;i++){e+=(R[i]-R0[i])/86400-m;mn=Math.min(mn,e);mx=Math.max(mx,e);}w=Math.max(w,mx-mn);}return w;};
  const base=runs({}),ch=runs({chain:1}),me=runs({mesh:[0,1,2,3]}),all=runs({chain:1,mesh:[0,1,2,3]}),sw=x=>({amin:x.amin,amax:x.amax});
  return{base:sw(base),ch:sw(ch),me:sw(me),all:sw(all),wc:wander(ch.R,base.R),wm:wander(me.R,base.R),wa:wander(all.R,base.R)};}
/* a stroke of the key at n turns from full wind: the hand takes the key up to a turn a second, turns the fusee back `stroke`, slows to rest over 50 ms, creeps on until the winding
   pawls are u of a tooth short of their faces (both drop together: up to a whole tooth of free run, where the Wempe's two clicks half a tooth apart leave half), holds, then lets
   go: outright (the fingers off the plain key's paddle: the fusee, the key and the barrel run free to the pawls) or eased (the torque the hand holds it with relaxed to nothing over
   `ease` s). o.par: the estimates varied */
function windRun(TB,o){const sv={...PAR};Object.assign(PAR,o.par||{});try{
  const X=build(TB,o.n??24/HPT,{key:true,Tmax:o.Tmax,kh:o.kh});const{mc,b,hd,c1,c2,dt,sp,ch,me,st}=X,B=mc.B;settle(X,0.06);
  dt.x0=B[b.ratchet].q-(o.fd??0.5)*DT.p;dt.n=0;B[b.det].q=DT.hmax*(o.fd??0.5);B[b.key].q=B[b.fusee].q;
  const reset=()=>{for(const e of mc.El){if(e.maxL!=null)e.maxL=0;if(e.eng)e.eng=[];}ch.maxT=0;ch.minT=Infinity;ch.slack=0;sp.maxPsi=-Infinity;sp.minPsi=Infinity;hd.maxT=0;};reset();
  const near=()=>Math.min(...[c1,c2].map(c=>{const x=B[b.fusee].q-B[b.ratchet].q-c.n*CK.p;return -x;})),tgt=(o.u??0.5)*CK.p;
  const r0=B[b.ratchet].q,q0=B[b.fusee].q,dtS=1e-6,res={lead:X.lead,tq:X.S.tq};hd.on=true;hd.th=B[b.key].q;let t=0,ph='wind',t1=0,fall=0,spMin=Infinity;
  while(t<6){if(ph==='wind'){hd.w=-TAU*Math.min(1,t/0.03);if(q0-B[b.fusee].q>=(o.stroke??Math.PI)){ph='slow';t1=t;}}
    else if(ph==='slow'){hd.w=-TAU*Math.max(0,1-(t-t1)/0.05);if(t-t1>0.08){ph='creep';t1=t;}}
    else if(ph==='creep'){const d=near(),ok=d>=tgt-2e-4&&d<=tgt+3e-3;hd.w=ok?0:-0.3;if(ok&&t-t1>0.05){ph='hold';t1=t;}}
    else if(ph==='hold'){hd.w=0;if(t-t1>0.05){Object.assign(res,{fall,detL:dt.maxL,hand:hd.maxT,chain:[ch.minT,ch.maxT],free:near(),spMin});reset();ph='let';t1=t;if(!o.ease)hd.on=false;else hd.T0=Math.abs(hd.T);}}
    else{if(o.ease)hd.Tmax=hd.T0*Math.max(0,1-(t-t1)/o.ease);if(t-t1>(o.after??0.3)+(o.ease||0))break;}
    mc.step(dtS);t+=dtS;recAll(X,dtS);if(ph!=='let'){fall=Math.max(fall,r0-B[b.ratchet].q);spMin=Math.min(spMin,sp.psi);}}
  const cl=[c1,c2].filter(c=>c.eng.length);
  return Object.assign(res,{u:o.u,catchE:cl.length?Math.min(...cl.map(c=>c.eng[0])):NaN,Fc:Math.max(c1.maxL,c2.maxL)/CK.rc,Fc2:[c1.maxL,c2.maxL].map(x=>x/CK.rc),sp:sp.maxPsi,stone:st.maxL/rE,fw:me[0].maxL/(MESH[0].m*MESH[0].zB/2e3),esc:me[3].maxL,chainL:[ch.minT,ch.maxT],slack:ch.slack*1e-6,detF:dt.maxL/DT.rc});}finally{Object.assign(PAR,sv);}}
/* the stop at full wind: the key wound into it at a turn a second from 0.12 turn short, then held there by a strong hand (overwind.js's) */
function stopRun(TB){const X=build(TB,0.12,{key:true,Tmax:HP.TH});const{mc,b,hd,sw,ch}=X,B=mc.B;settle(X,0.06);sw.on=true;sw.q0=-0.12*TAU;B[b.key].q=B[b.fusee].q;
  for(const e of mc.El)if(e.maxL!=null)e.maxL=0;ch.maxT=0;ch.minT=Infinity;ch.slack=0;hd.on=true;hd.th=B[b.key].q;let t=0,tHit=null,Fhit=0;const SR=HP.stop.SR*1e-3;
  while(t<1.2){hd.w=-TAU*Math.min(1,t/0.03);mc.step(1e-6);t+=1e-6;recAll(X,1e-6);if(sw.L>0&&tHit===null)tHit=t;if(tHit!==null&&t-tHit<0.02)Fhit=Math.max(Fhit,sw.L);}
  return{Fhit:Fhit/SR,Fp:sw.maxL/SR,chain:[ch.minT,ch.maxT],slack:ch.slack*1e-6,hand:hd.maxT};}

module.exports={build,settle,MESH,JI,rho,fusT,Mrun,msT,msPh,CK,CK2,DT,meshTab,beat,windRun,stopRun,rippleRun,params,setHP,PAR,HPT,RB,NRUN,LL,UD,rE,get HP(){return HP;}};
if(!isMainThread&&['beat','wind','ripple','stop'].includes(workerData.job)){const{job,TB,o,par,hp}=workerData;   /* its own jobs only: a thread of another tool may load this module (hamilton_transmission_trace.js) */
  HP=hp;Object.assign(PAR,par||{});parentPort.postMessage(job==='beat'?beat(TB,o.rigid,o.kdrv):job==='wind'?windRun(TB,o):job==='ripple'?rippleRun(TB):stopRun(TB));return;}

if(require.main===module)(async()=>{
const strP=new Promise(ok=>require('child_process').execFile(process.execPath,[path.join(__dirname,'strength.js')],{cwd:__dirname,maxBuffer:1<<26},(e,o)=>ok(o||'')));
HP=params();PAR.kbank=40*HP.KT;PAR.tsl=HP.can.mid;
const TB=await tabs(),STRO=await strP;if(TC&&!fs.existsSync(TC))fs.writeFileSync(TC,JSON.stringify(TB));   /* MC_TR_TABS: the tables kept in a file between runs */
/* the strengths: strength.js's own lines (its static loads fully wound and the stresses and ranges it judges them by), ratchets.js's for the ratchets' teeth, so a peak here is
   judged as they judge the static; the chain's weakest part: each of strength.js's chain lines' load at the weak end of its range */
const SL=STRO.replace(/\r/g,'').split('\n');
const STR=(()=>{const get=(key,name)=>{const r=SL.find(x=>x.includes(key));if(!r)throw Error('strength.js has no line: '+key);
  const m=/\)\s+([\d.]+) N.*?\s([\d.]+) MPa\s+(.*?)\s([\d.]+)-([\d.]+): margin/.exec(r);if(!m)throw Error('strength.js line unread: '+r);return{name,F:+m[1],s:+m[2],what:m[3],lo:+m[4],hi:+m[5]};};
  return{mesh:MESH.slice(0,4).map(q=>get(q.nm+' (',q.nm))};})();
const CHN=(()=>{const i0=SL.findIndex(x=>/The fusee chain/.test(x)),i1=SL.findIndex((x,i)=>i>i0&&/The springs/.test(x)),pull=+/pull ([\d.]+) N/.exec(SL[i0+1])[1];let w=null;
  for(const r of SL.slice(i0+2,i1)){const m=/^\s+(ok|~~|!!)\s+(.*?)\s{2,}([\d.]+) N\s+([\d.]+) MPa\s+(.*?)\s([\d.]+)-([\d.]+): margin/.exec(r);if(!m)continue;const F=+m[3]*(+m[6])/(+m[4]),Fh=+m[3]*(+m[7])/(+m[4]);if(!w||F<w.F)w={nm:m[2].trim(),F,Fh,what:m[5]};}
  if(!w)throw Error('strength.js: no chain lines');return{...w,pull};})();
/* a peak force F on a part whose static line is S: its stress scaled from the static (each formula linear in its load), against the line's range */
const judge=(S,F,lab,soft)=>{const s=S.s*F/S.F,mL=S.lo/s,mH=S.hi/s,ok=mL>=1;chk(ok,`${lab}: ${f(F,F<1?3:1)} N, ${f(s,0)} MPa against ${S.what} ${S.lo}-${S.hi}: margin ${f(mL,2)}-${f(mH,2)}`,!ok&&(mH>=1||!!soft));return{F,s,mL,mH,v:ok?"ok":mH>=1||soft?"~~":"!!"};};
/* the drive at the page's level: the escape wheel's torque at 12 h, statically through the meshes' mean ratios and the pivots, against makeEsc's TAUE (255° at 12 h) */
const KDRV=(()=>{const X=build(TB,12/HPT);return DY.TAUE/X.S.escT;})();
/* the runs in time, each a thread of its own (at most 12 at once) */
const pool=(()=>{let run=0;const q=[],LIM=Math.max(2,Math.min(12,require('os').cpus().length-2));const next=()=>{while(run<LIM&&q.length){const[job,o,ok,no]=q.shift();run++;
  const w=new Worker(__filename,{workerData:{job,TB,o,par:{tsl:PAR.tsl,kbank:PAR.kbank},hp:HP}});const t0=Date.now();w.on('message',m=>{run--;if(process.env.MC_TR_PROF)console.error(job,JSON.stringify(o).slice(0,40),((Date.now()-t0)/1000).toFixed(1)+' s, at '+((Date.now()-T0)/1000).toFixed(0));ok(m);next();});w.on('error',e=>{run--;no(e);next();});}};
  return(job,o={})=>{const p=new Promise((ok,no)=>{q.push([job,o,ok,no]);next();});p.catch(()=>{});return p;};})();
const US=[0.05,0.25,0.5,0.75,0.97],KBk=PAR.kbank,VAR=[['the winding pawls\' faces ×0.25 (4 times softer: the pawls\' studs and the ratchet\'s plate giving)',{kcl:2.5e3}],['the pawls\' faces ×2',{kcl:2e4}],['the contacts\' damping 2 %',{zc:0.02}],['the contacts\' damping 20 %',{zc:0.2}],
  ['the bank ×0.25',{kbank:KBk/4}],['the bank ×4',{kbank:KBk*4}],['the chain 37 N/mm',{kch:37}],['the chain 253 N/mm',{kch:253}],['the winding pawls\' springs set 0.05 mm (their least: ratchets.js)',{set:0.05}],['the winding pawls\' springs set 0.5 mm',{set:0.5}]];
const J={ripple:pool('ripple'),beat:pool('beat',{rigid:false,kdrv:KDRV}),beatR:pool('beat',{rigid:true,kdrv:KDRV}),keyOn:pool('wind',{u:0.5}),snap:US.map(u=>pool('wind',{u,after:0.3})),eased:US.map(u=>pool('wind',{u,after:0.3,ease:0.15})),
  vary:VAR.map(([lab,par])=>pool('wind',{u:0.97,par}).then(x=>({...x,lab}))),stop:pool('stop')};
head('1. The transmission: every moving part, its inertia and what moves it');
{const L=[['barrel and mainspring (42027, 42028), its moving half (2,100 estimated), the chain (42030) at its speed',JI.barrel,'mechanisms.json, the chain\'s 1.4 g estimated','the mainspring; holds the chain'],
  ['fusee with its winding ratchet and the arbor\'s square (42018)',JI.fusee,'mechanisms.json','the chain; the key winding'],
  ['two winding pawls (on the sustaining ratchet, opposite on the winding ratchet\'s 36 teeth)',MJ.pawls.find(p=>p.name==='winding pawl 1').I,'mechanisms.json, about each pivot','their band springs and the winding ratchet'],
  ['sustaining ratchet, half its spring and the winding pawls (42015, 42016)',JI.ratchet,'mechanisms.json','the winding pawls running; the sustaining spring winding'],
  ['sustaining pawl (42019)',MJ.pawls.find(p=>p.name==='sustaining pawl').I,'mechanisms.json, about its arbor','its wire and the sustaining ratchet'],
  ['fusee wheel and half the sustaining spring (42014)',JI.fw,'mechanisms.json','the sustaining spring, banked'],
  ['centre arbor (42005)',JI.centre,'mechanisms.json','the fusee wheel'],['cannon pinion and minute hand',JI.cannon,'mechanisms.json','its friction on the centre arbor'],
  ['minute wheel and pinion',JI.change,'mechanisms.json','the cannon pinion'],['hour wheel and hand',JI.hour,'mechanisms.json','the minute pinion'],
  ['third arbor',JI.inter,'mechanisms.json','the centre wheel'],['fourth arbor and seconds hand',JI.sec,'mechanisms.json','the third wheel'],
  ['escape wheel and arbor',JI.esc,'mechanisms.json','the fourth wheel; its locking stone; the impulse jewel'],
  ['balance (Table II)',DY.I*1e9,'physics.js','the hairspring; the impulse; dynamics.js'],['detent',DY.ID*1e9,'dynamics.js, its drawn pieces','dynamics.js, tripping.js'],
  ['wind indicator wheel and hand',JI.ud,'estimated (a spoked brass wheel of r 15.1, its hand half the hour hand)','the fusee arbor\'s 12-leaf pinion'],
  ['the key (plain, on the fusee\'s square), winding',JI.key,'estimated (core.js windingKey\'s brass)','the hand']];
  for(const[nm,J,src,by]of L)say(`${nm.padEnd(100)} ${f(J,J<10?2:0).padStart(7)} g·mm²  (${src}); moved by ${by}`);
  say(`the case and its gimbals are gimbals.js's; the balance's and detent's motion dynamics.js's and tripping.js's: here the escapement is dynamics.js's own, driven by the train`);
  say(`the sustaining spring (sustaining.js): ${f(HP.KT,3)} N·m a radian over ${f(HP.SMAX/D,1)}° to its bank, pushing ${f(HP.KT*HP.SMAX,3)} N·m banked (${f(100*HP.KT*HP.SMAX/PH.Tf)} % of the drive fully wound): weaker than the drive, so banked in running; its bank ${f(KB(),1)} N·m a radian (estimated, 40 times)`);
  say(`the winding pawls' springs ${f(HP.w1.k*1000)} and ${f(HP.w2.k*1000)} mN/mm at ${f(HP.w1.arm,2)} from their pivots, set ${PAR.set} mm (estimated; they need ${f(HP.w1.need,2)} and ${f(HP.w2.need,2)}, ratchets.js); the sustaining pawl's wire ${f(HP.sp.k*1000,1)} mN/mm at ${f(HP.sp.arm,2)}, set ${HP.sp.pre} rad`);
  say(`the drive: the fusee arbor's ${f(fusT(0)*1000,1)} mN·m running fully wound, ${f(fusT(12/HPT)*1000,1)} at 12 h, ${f(fusT(NRUN)*1000,1)} at ${NRUN} turns (mainspring_friction.json's on physics.js's Tf ${f(PH.Tf*1000,1)}); the chain's lever on the fusee ${f(rho(0),2)}-${f(rho(NRUN),2)} mm (r_B dIb/dn), on the drum ${f(RB,2)}`);
  out.bodies=L.map(([nm,J,src,by])=>({nm,J,src,by}));}

/* ---------- the meshes as tabled ---------- */
{say('');say(`the meshes tooth by tooth (gearing.js's mesh on the model's outlines, mu ${MU} on the teeth; the driven gear's angle under load and its backlash over a pitch of the driver):`);
  out.meshes=[];MESH.forEach((q,i)=>{const t=TB[i];if(t.jam){chk(false,`${q.nm}: jams (tip clearance ${f(t.tip*1000)} µm)`);return;}
    const wob=(Math.max(...t.ee)-Math.min(...t.ee))*q.m*q.zB/2*1000,blm=Math.min(...t.bl)*q.m*q.zB/2*1000,blM=Math.max(...t.bl)*q.m*q.zB/2*1000,fcs=t.fac[1].concat(t.fac[2]);
    say(`  ${q.nm.padEnd(38)} ${q.zA}:${q.zB} m ${f(q.m,4)}: tips ${f(t.tip*1000)} µm clear, backlash ${f(blm)}-${f(blM)} µm, the driven's lag through a pitch ${f(wob,1)} µm at its pitch circle, the torque ratio ${f(Math.min(...fcs),3)}-${f(Math.max(...fcs),3)} of nominal (mu 0.10-0.20); ${f(KM(q.b))} N/mm on ${f(q.b,2)} of face`);
    out.meshes.push({nm:q.nm,zA:q.zA,zB:q.zB,m:q.m,tip:t.tip,bl:[blm,blM],wob,fac:[Math.min(...fcs),Math.max(...fcs)],k:KM(q.b)});});}
if(fail){console.log(rows.join('\n'));process.exitCode=1;return;}

/* ===================== 2. the whole wind, quasi-statically ===================== */
head('2. The whole wind, part by part (static, running: each element carrying the fusee arbor\'s torque, the solved spring\'s, down the train at mu '+MU+')');
const QS=[];{const Ns=[0,0.5,1,2,3,4,5,6,7,8,8.25,NRUN],T12=fusT(12/HPT);
  say(`n (turns from full wind)  hours  chain lever  chain pull  each winding pawl  spring closure (bank ${f(HP.SMAX/D,2)}°)  fusee wheel teeth  centre  third  fourth  escape torque  the page's drive, its swing and rate`);
  for(const n of Ns){const X=build(TB,n);const t=X.S.tq,sDrv=fusT(n)/T12,A=E.ampAt(sDrv),rt=E.rateAt(A,sDrv);
    const r={n,h:n*HPT,rho:rho(n),pull:Mrun(n)/(RB*1e-3),click:fusT(n)/(2*CK.rc),lead:X.lead,F:MESH.slice(0,4).map((q,i)=>(i===0?fusT(n):t[MESH[i].A])/(q.m*q.zA/2e3)),esc:t.esc,s:sDrv,sAbs:t.esc/DY.TAUE,A:A/D,rate:rt};QS.push(r);
    say(`${f(n,2).padStart(6)}  ${f(r.h,1).padStart(16)}  ${f(r.rho,2).padStart(9)}  ${f(r.pull,1).padStart(9)} N  ${f(r.click,1).padStart(7)} N  ${f(r.lead/D,2).padStart(10)}° (${f((r.lead-HP.SMAX)/D,2)}° past)  ${r.F.map(x=>f(x,x<1?3:1)+' N').join('  ')}  ${f(r.esc*1e6,1)} µN·m  ${f(r.s,3)}: ${f(r.A,1)}° ${f(r.rate,2)} s/d`);}
  const minB=Math.min(...QS.map(r=>r.lead-HP.SMAX));out.qs=QS;
  chk(minB>0,`the sustaining spring stays banked running from full wind to run down: closed at least ${f(minB/D,3)}° past its bank (the drive at its weakest, ${f(Math.min(...QS.map(r=>fusT(r.n)))*1000,0)} mN·m, against its ${f(HP.KT*HP.SMAX*1000,0)} banked): it carries the drive through its banking, as Sec. IV's split ring weaker than the drive does`);
  const ef=QS.map(r=>r.esc/(fusT(r.n)/PH.ratioT));say(`the train's static efficiency at mu ${MU} (the meshes' own mean ratios, the pivots at mu_p ${MUP}): ${f(Math.min(...ef),3)}-${f(Math.max(...ef),3)} (physics.js's from its parts ${f(PH.Plo,3)}-${f(PH.Phi,3)})`);
  chk(ef[0]>=PH.Plo-0.02&&ef[0]<=PH.Phi+0.02,`it lies in the range physics.js's parts give: the transmission's drive at the escape wheel is the budget's`);
  const sa=QS.find(r=>Math.abs(r.n-12/HPT)<1.5);
  chk(false,`the solved spring's own torque reaches the escape wheel at ${f(QS[0].sAbs,2)}-${f(Math.min(...QS.map(r=>r.sAbs)),2)} times the torque makeEsc is calibrated at (TAUE ${f(DY.TAUE*1e6,1)} µN·m, 255° on the page's 12-hour drive): physics.js's budget gap (the model's TF 67 s kept, the owner's choice; OPEN-QUESTIONS.md). The runs that drive the escapement take the mainspring ×${f(KDRV,3)} (KDRV), the page's level; the winds and the stop its own`,true);
  out.KDRV=KDRV;}

/* ---------- the drive over a whole run, every ripple at once ---------- */
{say('');say('The drive over a whole run with every ripple at once: the chain\'s polygon on the fusee and the drum (the line of pull swinging about the last rivet on each, a 1.7 link on its radius), each mesh\'s ratio through its pitch (its table), against the smooth');
  const{base,ch,me,all,wc,wm,wa}=await J.ripple;
  const rip=r=>1-Math.cos(Math.asin(1.7/(2*r)));
  say(`  the chain's polygon: its lever swings ${f(100*rip(rho(0)),2)} % on the fusee fully wound (r ${f(rho(0),2)}), ${f(100*rip(rho(NRUN)),2)} % run down (r ${f(rho(NRUN),2)}), ${f(100*rip(RB),2)} % on the drum, once a link (every ${f(1.7/(rho(4)*TAU/(HPT*3600)),0)} s at mid wind)`);
  say(`  the swing over the run (TF ${E.settings.TF} s, the page's drive): smooth ${f(base.amin,2)}-${f(base.amax,2)}°; with the chain's polygon ${f(ch.amin,2)}-${f(ch.amax,2)}°; with the meshes ${f(me.amin,2)}-${f(me.amax,2)}°; with both ${f(all.amin,2)}-${f(all.amax,2)}°`);
  chk(wa<0.1,`the time's wander within a day from all the ripples together ${f(wa*1000,1)} ms (the chain's ${f(wc*1000,1)}, the meshes' ${f(wm*1000,1)}): a navigator rating it daily carries nothing of it`);
  out.ripple={base:[base.amin,base.amax],chain:[ch.amin,ch.amax],mesh:[me.amin,me.amax],all:[all.amin,all.amax],wander:{chain:wc,mesh:wm,all:wa},poly:{fusFull:rip(rho(0)),fusRun:rip(rho(NRUN)),drum:rip(RB)}};}

/* ===================== 3. the modes ===================== */
head('3. The running transmission\'s modes at 12 h (the escape wheel on its stone; linearised about the running state only to find them)');
{const n=12/HPT,X=build(TB,n),{mc}=X;settle(X,0.05);const B=mc.B,N=B.length,q0=B.map(b=>b.q),h=1e-7,K=[];
  mc.fd=true;const Fs=()=>{mc.force();return B.map(b=>b.F);};for(const b of B)b.v=0;
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
head('4. A beat: the train as bodies on its meshes driving dynamics.js\'s escapement, against the same escapement on a rigid train (the mainspring at the page\'s level, ×'+f(KDRV,3)+')');
{const[r1,r0]=await Promise.all([J.beat,J.beatR]),mean=a=>a.reduce((s,x)=>s+x,0)/a.length,W1=mean(r1.W),W0=mean(r0.W),s0=mean(r0.S)/DY.TAUE,sEq=s0*W1/W0,A0=E.ampAt(s0),A1=E.ampAt(sEq);
  say(`at 12 h the train gives the escape wheel ${f(mean(r0.S)*1e6,1)} µN·m on average at the releases (${f(Math.min(...r0.S)*1e6,1)}-${f(Math.max(...r0.S)*1e6,1)}: each mesh's ratio where it stands; s ${f(s0,3)} of makeEsc's), the wheel with its own inertia (${f(A_.escape.I,2)} g·mm²) and the train's bodies behind it on their meshes: ${r1.beats} beats in ${r1.T} s`);
  chk(r1.trips===0&&Math.abs(r1.beats-r0.beats)<=1,`every beat taken: ${r1.beats} beats, ${r1.trips} trips or missed (the rigid train ${r0.beats}, ${r0.trips})`);
  say(`the work an impulse gives the balance (its energy before the unlocking against after the impulse): ${f(W1*1e6,3)} µJ against ${f(W0*1e6,3)} on the rigid train at the same places of its meshes (${W1>=W0?'+':''}${f(100*(W1/W0-1),2)} %)`);
  const dA=(A1-A0)/D,dR=E.rateAt(A1,sEq)-E.rateAt(A0,s0);
  /* within 8° and 0.5 s a day: wempe_transmission.js's tolerance for the same comparison (the user's choice for the Wempe's, 19 October 2026; 3° and 0.3 until then), applied alike.
     The train's meshes give back a little of the escape wheel's landing and starting, so an impulse gives the balance a few per cent more than a rigid train lets it: the rigid
     train dynamics.js and makeEsc take reads the swing low by about that (the README's "The whole transmission in time") */
  chk(Math.abs(dA)<8&&Math.abs(dR)<0.5,`as a drive ${f(sEq,4)} of makeEsc's: the swing it keeps ${f(A0/D,2)}° → ${f(A1/D,2)}° (${dA>=0?'+':''}${f(dA,2)}°), the escapement's rate ${dR>=0?'+':''}${f(dR,3)} s a day (within 8° and 0.5 s a day, the Wempe's tolerance); over the run itself the escapement's rate ${f(r0.rate,3)} → ${f(r1.rate,3)} s a day, the swing ${f(r0.A,2)}° → ${f(r1.A,2)}°`);
  say('');say('  each mesh through the beats (its force at the driven gear\'s pitch circle; whether it lets go):');
  out.beat={beats:r1.beats,trips:r1.trips,W0,W1,s0,sEq,A0:A0/D,A1:A1/D,dA,dR,rate0:r0.rate,rate1:r1.rate,Arun0:r0.A,Arun1:r1.A,meshes:[]};const Ts=r1.T-r1.from;
  r1.meshes.forEach((e,i)=>{const q=MESH[i],r=q.m*q.zB/2e3,st=i<4?r1.tq[q.B]:NaN,fr=e.free/Ts,ln=e.freeMax;out.beat.meshes.push({nm:q.nm,Fmax:e.maxL/r,Fst:st/r,fac:e.maxL/st,free:fr,freeMax:ln,back:e.back*1e-6});
    const lets=i<4?(fr>0?`lets go ${f(100*fr,2)} % of the time, at most ${f(ln*1000,2)} ms at once`:'never lets go'):i<6?`rests in its backlash between steps (only friction loads the motion work) and is taken up each step`:`free in its backlash: the fusee hardly turns in a beat`;
    say(`    ${q.nm.padEnd(38)} ${f(e.maxL/r,e.maxL/r<1?4:2)} N at most${i<4?` (${f(e.maxL/st,2)} times its running ${f(st/r,st/r<1?4:2)} N)`:''}; ${lets}${e.back?`; on its back flank ${f(e.back*1e-3,2)} ms in all`:'; never on its back flank'}`);});
  say('');MESH.slice(0,4).forEach((q,i)=>{const e=r1.meshes[i],Fd=e.maxL/r1.tq[q.B]*STR.mesh[i].F;   /* the peak's factor over running, on strength.js's fully wound force */
    out.beat.meshes[i].str=judge(STR.mesh[i],Fd,`  ${q.nm}, its peak fully wound (this beat's ${f(e.maxL/r1.tq[q.B],2)} times running on strength.js's ${STR.mesh[i].F} N)`);});
  const bm=r1.bnc.length?Math.max(...r1.bnc):0,stepTh=TAU/120;
  say(`  the seconds hand steps ${f(stepTh/D,1)}° a beat and overshoots where it comes to rest by ${f(bm/D*3600,1)}″ at most (${f(100*bm/stepTh,3)} % of a step)`);
  say(`  the cannon pinion's fit carries at most ${f(r1.cn*1000,3)} mN·m (the motion work's friction and its inertia's share of each step) against its ${f(PAR.tsl*1000,1)} mN·m (section 7)`);
  chk(r1.slip<1e-9,`the cannon pinion doesn't slip running (${f(r1.slip/D*3600,4)}″)`);
  chk(r1.sp[0]>HP.SMAX,`the sustaining spring stays on its bank through the beats: closed ${f(r1.sp[0]/D,4)}-${f(r1.sp[1]/D,4)}° (its bank ${f(HP.SMAX/D,3)}°, static ${f(r1.lead/D,3)}°); the chain's pull ${f(r1.ch[0],3)}-${f(r1.ch[1],3)} N; the winding pawls' faces ${f(r1.c1/CK.rc,2)} and ${f(r1.c2/CK.rc,2)} N at most`);
  out.beat.sec=bm;out.beat.cannon={maxT:r1.cn,slip:r1.slip};out.beat.chain=r1.ch;out.beat.lead=r1.sp;}

/* ===================== 5. winding ===================== */
head('5. Winding: the key put on, a stroke, and the key let go (the escape wheel on its stone: the train hardly turns in a wind\'s few seconds; the mainspring\'s own torque)');
{const n0=24/HPT,R=await J.keyOn,Fr=fusT(n0)/(2*CK.rc),Fw=R.tq.centre/(MESH[0].m*MESH[0].zB/2e3),Fs=R.tq.esc/rE;
  say(`the key put on at 24 h, the fusee wound back half a turn at a turn a second: the sustaining ratchet falls back ${f(R.fall/D,2)}° onto its pawl (from half a tooth; anywhere from 0 to ${f(DT.p/D,1)}°), the pawl's face taking ${f(R.detL/DT.rc,2)} N at most (it holds ${f(msT(R.lead-R.fall)/DT.rc,2)} N after: the spring off its bank, ${f((R.spMin)/D,2)}° closed at least)`);
  say(`while the key turns the hand needs ${f(R.hand*1000,0)} mN·m at most (the mainspring's winding branch through the chain's lever, the winding pawls riding the ratchet's backs), the chain ${f(R.chain[0],1)}-${f(R.chain[1],1)} N`);
  out.keyOn={fall:R.fall,detF:R.detL/DT.rc,hand:R.hand,chain:R.chain,spMin:R.spMin};out.runClick=Fr;
  const show=(lab,L)=>{say('');say(lab);for(const x of L)say(`  ${f(x.free/D,2).padStart(5)}° free: the pawls catch ${f(100*x.catchE)} % of their faces with ${f(x.Fc2[0],0)} and ${f(x.Fc2[1],0)} N (running ${f(Fr,1)} each); the sustaining spring to ${f(x.sp/D,2)}°${x.sp>HP.SMAX?` (onto its bank, ${f((x.sp-HP.SMAX)/D,2)}° past)`:''}; the fusee wheel's teeth ${f(x.fw,1)} N (running ${f(Fw,1)}), the locking stone ${f(x.stone,3)} N (${f(Fs,4)}); the sustaining pawl ${f(x.detF,1)} N; the chain ${f(x.chainL[0],1)}-${f(x.chainL[1],1)} N${x.slack>0?`, slack ${f(x.slack*1000,1)} ms`:''}`);};
  const LS=await Promise.all(J.snap),LE=await Promise.all(J.eased);
  show('the key let go outright (the fingers off its paddle), the pawls so far short of their faces:',LS);show('the key eased back (the torque the hand holds it with relaxed to nothing over 0.15 s):',LE);
  out.letgo={snap:LS,eased:LE};const worst=L=>L.reduce((a,b)=>a.Fc>b.Fc?a:b),shallow=Math.min(...LS.concat(LE).map(l=>l.catchE));
  chk(shallow>=0.25,`every catch takes ${f(100*shallow)} % of the pawls' faces or more: they are down before the faces come (their springs follow the winding ratchet's backs)`);
  say('');const wS=worst(LS),wE=worst(LE),fwS=Math.max(...LS.map(l=>l.fw)),fwE=Math.max(...LE.map(l=>l.fw));
  /* the winding ratchet (hardened steel, ratchets.js's line), its blows at the strokes' ends few on each tooth: a day's 3.73 fusee turns in half-turn strokes over 36 teeth, about
     2,300 on each in 30 years, low-cycle, against the steel's yield; the fusee wheel's teeth (strength.js's 21.8 N fully wound) against brass's yield. Eased is how the key is meant to
     be let back (the hand following it to the pawls), judged hard; let go outright (the fingers off the plain key, the fusee and barrel flung forward up to a tooth of 10°) is judged
     softly, a misuse, as wempe_transmission.js judges the Wempe's: what it does is reported */
  const blows=Math.round(3.73/0.5*365*30/36);
  const jE=judge({...HP.strW,what:`hardened steel's yield (about ${blows} blows on each tooth in 30 years)`},wE.Fc,`eased, the winding ratchet's tooth at the worst catch`),jEf=judge(STR.mesh[0],fwE,`  the fusee wheel's teeth then`);
  const jS=judge({...HP.strW,what:`hardened steel's yield`},wS.Fc,`let go outright, the winding ratchet's tooth at the worst catch`,true),jSf=judge({...STR.mesh[0],what:'brass\'s yield',lo:300,hi:450},fwS,`  the fusee wheel's teeth then`,true);
  const jD=judge(HP.strS,Math.max(...LE.map(l=>l.detF),out.keyOn.detF),`the sustaining ratchet's tooth under its pawl at the worst, the key put on or eased back`),
    jDs=judge(HP.strS,Math.max(...LS.map(l=>l.detF)),`  let go outright, the sustaining ratchet thrown back onto its pawl as the blow rebounds off the bank`,true);
  const chS=Math.max(...LS.map(l=>l.chainL[1])),chE=Math.max(...LE.map(l=>l.chainL[1]));
  chk(chE<CHN.F,`eased, the chain ${f(chE,1)} N at most: ${f(CHN.F/chE,2)} times under its weakest part's strength (${CHN.nm}, strength.js: ${f(CHN.F,0)}-${f(CHN.Fh,0)} N at its range's ends)`);
  chk(chS<CHN.F,`let go outright, the chain goes slack as the fusee is caught and the drum runs on, then snatches: ${f(chS,1)} N at most, ${f(chS/CHN.F,2)} times its weakest part's load at the weak end of its range (${CHN.nm}: ${f(CHN.F,0)}-${f(CHN.Fh,0)} N)`,true);
  say('');say('the worst outright let-go with the estimates it rests on varied:');const VA=await Promise.all(J.vary);
  for(const x of VA)say(`  ${x.lab.padEnd(92)} the pawls ${f(x.Fc,0)} N, catching ${f(100*x.catchE)} %, the fusee wheel's teeth ${f(x.fw,1)} N, the stone ${f(x.stone,3)} N, the spring to ${f(x.sp/D,2)}°, the chain ${f(x.chainL[1],1)} N`);
  const vmax=VA.reduce((a,b)=>a.Fc>b.Fc?a:b);judge({...HP.strW,what:'hardened steel\'s yield'},vmax.Fc,`  the worst of them (${vmax.lab.split(' (')[0]}), the winding ratchet's tooth`,true);
  const spW=Math.max(...LS.concat(LE).map(l=>l.sp));
  say(`the sustaining spring is thrown to ${f(spW/D,2)}° at most (its bank ${f(HP.SMAX/D,2)}°)${spW>HP.SMAX?`: the fusee's blow closes it onto its bank and passes through the fusee wheel and the train to the locking stone (${f(Math.max(...LS.map(l=>l.stone)),3)} N at most against ${f(Fs,4)} running: the tooth's pressure draws the detent in)`:''}`);
  out.letgoSum={snap:{F:wS.Fc,fw:fwS,click:jS,fwj:jSf},eased:{F:wE.Fc,fw:fwE,click:jE,fwj:jEf},sus:jD,susSnap:jDs,shallow,spW,chain:{snap:chS,eased:chE,weak:CHN},vary:VA.map(x=>({lab:x.lab,Fc:x.Fc,fw:x.fw,stone:x.stone,sp:x.sp,catchE:x.catchE,chain:x.chainL[1]}))};}

/* ===================== 6. the stop ===================== */
head(`6. The stop at full wind: the key wound into it at a turn a second, then forced by a strong hand (${f(HP.TH,2)} N·m: overwind.js's)`);
{const x=await J.stop,SR=HP.stop.SR,Fst=(HP.TH-fusT(0))*1000/SR;
  say(`the stop-bar meets the winding stop's stud (${f(SR,1)} mm from the fusee's axis) with the fusee, the key and the barrel at a turn a second: ${f(x.Fhit,0)} N in the blow's first 20 ms, ${f(x.Fp,0)} N at most with the hand behind it (held there, the hand's ${f(HP.TH,2)} less the spring's ${f(fusT(0),3)} N·m on the fusee: ${f(Fst,0)} N)`);
  say(`the chain ${f(x.chain[0],1)}-${f(x.chain[1],1)} N (fully wound running ${f(Mrun(0)/(RB*1e-3),1)} N)${x.slack?`, slack ${f(x.slack*1000,1)} ms as the drum runs on after the fusee stops`:''}`);
  const bar=HP.stop.bar*x.Fp,stud=HP.stop.stud*x.Fp;
  chk(bar<HP.stop.barY[0],`the stop-bar's end bent ${f(bar,0)} MPa, the stud ${f(stud,0)} MPa at that (overwind.js's sections): under hardened and tempered steel's ${HP.stop.barY.join('-')}`,bar<HP.stop.barY[1]);
  chk(x.chain[1]<CHN.F,`the chain's worst pull ${f(x.chain[1],1)} N: ${f(CHN.F/x.chain[1],2)} times under its weakest part's strength (${CHN.nm}, strength.js)`);
  out.stop={...x,Fst,bar,stud};}

/* ===================== 7. the motion work and the wind indicator ===================== */
head('7. The motion work and the wind indicator');
{const bl=i=>[Math.min(...TB[i].bl),Math.max(...TB[i].bl)];const b4=bl(4),b5=bl(5),b6=bl(6);
  const hp=[b5[0]+b4[0]*MWc[2]/MWc[3],b5[1]+b4[1]*MWc[2]/MWc[3]].map(x=>x*720/TAU),UDS=56/HPT*12/120*TAU;
  say(`the hour hand's play against the minute hand: ${f(hp[0],1)}-${f(hp[1],1)} minutes of time (the hour wheel's backlash on the minute pinion, the minute wheel's on the cannon pinion through ${MWc[2]}/${MWc[3]}; motionwork.js's at its drawn centres)`);
  chk(hp[1]<15,`under a quarter hour: the hour hand reads with the minute hand`);
  const uh=b6.map(x=>x/UDS*56);
  say(`the wind indicator's hand's play: ${f(b6[0]/D,2)}-${f(b6[1]/D,2)}° on the dial, ${f(uh[0]*60,0)}-${f(uh[1]*60,0)} minutes of its 56 hours (${f(UDS/TAU,3)} of a turn), taken up as the fusee turns either way`);
  const C=HP.can;
  say(`the cannon pinion's friction (motionwork.js): a 45 g knock turns the hands on it at ${f(C.lo*1000,2)} mN·m; set forward, past ${f(C.hi*1000,1)} mN·m added to the centre arbor's ${f(C.Tc*1000,1)} the balance reaches the trip within a minute's setting`);
  chk(C.hi>3*C.lo,`the window ${f(C.lo*1000,2)}-${f(C.hi*1000,1)} mN·m is wide; the model takes its middle, ${f(C.mid*1000,2)} mN·m (estimated: Op. 58 gives no figure)`);
  out.motion={hourPlay:hp,udPlay:uh,cannon:C};}

head(`(${f((Date.now()-T0)/1000)} s)`);
console.log(rows.join('\n'));
const jo=process.argv.indexOf('--json');if(jo>0)fs.writeFileSync(process.argv[jo+1],JSON.stringify(out,null,0));
if(fail)process.exitCode=1;})().catch(e=>{console.error(e);process.exitCode=2;});
