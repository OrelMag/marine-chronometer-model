// The escapement in time: the balance, the escape wheel (with the fourth wheel behind it) and the detent as masses on springs, integrated through every
// contact, instead of the swing-averaged equations the model runs on (shared/escapement.js: the swing from the work done an oscillation, the rate by Airy's
// sum). Needs only Node.js:
//   node dynamics.js            (about a minute; exits with 1 if the time-domain escapement disagrees with the model's beyond the stated bounds,
//                                misses a beat at the model's settings, or the detent comes back too late to lock the next tooth)
//   node dynamics.js --quick    (the cross-check and the detent only, about 15 s)
// What it answers that the averaged model can't, or checks it on:
//   1. Whether the averaging holds: the swing, where the tooth lands after the wheel's chase from rest, where the detent falls back and the escapement's own
//      rate, integrated beat by beat, against makeEsc's figures at the same settings and springs (they agree, since makeEsc took up the chase, the jewel's
//      rounded end and the springs' own work on 11 October 2026: this is what found them missing).
//   2. Whether the detent is back on its banking in time to lock the next tooth (OPEN-QUESTIONS.md 2): the detent as a body on its beryllium-copper spring,
//      preloaded as Op. 78 sets it, its inertia from the drawn pieces (movement.js), bouncing off its stop button.
//   3. Starting, the least drive that keeps it going, a held train's run-down (makeEsc's freeStep: the springs' work as well as the air's), and what knocks it out: a twist about the staff (it trips or stops) and a blow across the plate
//      (the detent is not poised about its flexure, so a hard enough blow lifts it off its stop and lets a tooth go).
//   4. The ship's motion: yaw about the staff and the lateral accelerations of a roll, and what they do to the rate.
// Every number from outside the model (moduli, densities, restitution) is a published range or marked estimated, as in physics.js.
//   node dynamics.js --model wempe [--quick]   the Wempe's escapement (makeEsc with WESC.SET, through wempe_load.js; the README's "Physics: in time"): its balance, train and
//                               detent weighed on its solids (wempe_inertia.json), its drive 05 06_20's at 12 h, its contacts the bevelled discharge stone on the gold spring's
//                               square end, and the stone riding the tooth it has just let go (the Wempe's detent falls back before that tooth has passed: below). The Hamilton's runs
//                               are as they were, figure for figure (about 2½ minutes; --quick about 70 s)
const fs=require('fs'),path=require('path');
const WEMPE=(i=>i>=0&&process.argv[i+1]==='wempe')(process.argv.indexOf('--model')),WL=WEMPE?require('./wempe_load.js')():null,WJ=WEMPE?require('./wempe_inertia.json'):null;   /* the Wempe: its page's scripts, its bodies weighed */
const {build}=require('./escapement.js'),ESC=WEMPE?(process.env.MC_ESC?WL.makeEsc({...WL.WPHYS.SET,...JSON.parse(process.env.MC_ESC)},WL.WPHYS.SET):WL.WPHYS.ESC):build(process.env.MC_ESC?JSON.parse(process.env.MC_ESC):{}).ESC;   /* MC_ESC: makeEsc's settings overridden, as JSON (tripping.js runs the escapement at other depths of lock so) */
const rd=f=>fs.readFileSync(path.join(__dirname,f),'utf8'),mv=WEMPE?'':rd('../js/movement.js'),phys=WEMPE?'':rd('physics.js');
const num=(re,s,what)=>{const m=re.exec(s);if(!m)throw Error('not found: '+what);return+m[1];};
const D=Math.PI/180,TAU=2*Math.PI,G0=9.80665,ES=ESC.ES/1000,day=x=>86400*x;   /* ES: the unit frame's length (the escape wheel's radius) in metres */

/* ---------- the bodies ---------- */
/* the Wempe's balance weighed on its solids with its rollers, collet and a third of its spring (wempe_inertia.json: makeEsc's I); run, as makeEsc runs it, at the train's 0.5 s */
const I=WEMPE?(WJ.balance.I+WJ.rollers.I+WJ.collet.I+WJ.spring.I/3)*1e-9:num(/const I=([\d.e-]+),k=/,phys,'the balance (physics.js)'),T0=ESC.T,W0=TAU/T0,K=I*W0*W0;   /* Table II's balance; the hairspring's stiffness for 0.5 s */
const TF=ESC.settings.TF,C=2*I/TF;   /* the balance's damping, viscous, from the free run-down TF (physics.js: inside what the parts give and the budget needs) */
const JE=WEMPE?WJ.escape.I*1e-9:num(/const J=([\d.e-]+);/,phys,'the escape wheel\'s inertia (physics.js)');
/* the train behind the escape wheel turns with it through the pinions (the drive keeps the meshes closed), so its inertia counts, each arbor's reflected by its
   ratio squared: since 14 October 2026 every arbor weighed on its drawn solids at their densities (mechanisms.json, as traindyn.js sums it: the escape wheel with
   its pinion and arbor, the fourth with the seconds hand, the third, the centre with the motion work and hands, the fusee wheel with half the sustaining spring),
   6.05 g·mm² where the wheel's 4.80 and the fourth's estimate (a brass disc 0.7 left by the spokes) gave 5.88 */
/* the Wempe's (wempe_inertia.json, 15 October 2026): the escape arbor, the seconds arbor and hand, the intermediate, the centre with the cannon tube, change wheel, hour wheel and
   hands (56/14 · 54/18, as the Hamilton's), the fusee wheel with the maintaining work that turns with it running; the ratios its tables' (escphys.js STG: 80/10, 80/10, 90/12, 90/14) */
const WR=WEMPE?(i=>WL.WPHYS.STG[i][1]/WL.WPHYS.STG[i][2]):null,TR=WEMPE?null:Function('return '+/TRAIN=(\{[^}]*\})/.exec(mv)[1])(),MA=WEMPE?null:require('./mechanisms.json').arbors,
  ra=WEMPE?[WR(3),WR(3)*WR(2),WR(3)*WR(2)*WR(1),WR(3)*WR(2)*WR(1)*WR(0)]:[TR.fw/TR.ep,TR.fw/TR.ep*TR.tw/TR.fp,TR.fw/TR.ep*TR.tw/TR.fp*TR.cw/TR.tp,TR.fw/TR.ep*TR.tw/TR.fp*TR.cw/TR.tp*TR.fu/TR.cp],
  JcM=WEMPE?WJ.centre.I+WJ.cannon.I+WJ.minuteHand.I+WJ.changeWheel.I*(14/56)**2+WJ.hourWheel.I*(14/56*18/54)**2+WJ.hourHand.I*(1/12)**2:MA.centre.I+MA.cannon.I+MA.minuteHand.I+MA.minuteWheel.I*(14/56)**2+MA.hourWheel.I*(14/56*18/54)**2+MA.hourHand.I*(1/12)**2,
  J4=WEMPE?(WJ.seconds.I+WJ.secondsHand.I)*1e-9:(MA.fourth.I+MA.secondsHand.I)*1e-9,JT=WEMPE?(WJ.escape.I+(WJ.seconds.I+WJ.secondsHand.I)/ra[0]**2+WJ.intermediate.I/ra[1]**2+JcM/ra[2]**2+(WJ.fuseeWheel.I+WJ.maintaining.I)/ra[3]**2)*1e-9:(MA.escape.I+(MA.fourth.I+MA.secondsHand.I)/ra[0]**2+MA.third.I/ra[1]**2+JcM/ra[2]**2+(MA.fuseeWheel.I+MA.sspring.I/2)/ra[3]**2)*1e-9;
const TAUE=ESC.run.cl.w*K;   /* the escape wheel's torque the model is calibrated at (255°): physics.js's budget checks the train gives it */
/* the detent: its pieces as movement.js draws them (poly(R.det, piece, bottom, top, material)), their plan ESC.pieces about the point of flexure Ft;
   beryllium copper (C17200, 8.25 g/cm³), the locking stone ruby (3.98), the trip spring Elinvar-type (8.15) 7.9 mm long, tsT thick and 0.3 deep (movement.js) */
const RHO={Cu:8250,ruby:3980,El:8150},Ft=ESC.Ft,H={};
const polyM=(pts,h,rho)=>{let A=0,cx=0,cy=0,J0=0;for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],x0=(a.x-Ft.x)*ES,y0=(a.y-Ft.y)*ES,x1=(b.x-Ft.x)*ES,y1=(b.y-Ft.y)*ES,c=x0*y1-x1*y0;
  A+=c/2;cx+=(x0+x1)*c/6;cy+=(y0+y1)*c/6;J0+=c*(x0*x0+x0*x1+x1*x1+y0*y0+y0*y1+y1*y1)/12;}const s=Math.sign(A)*rho*h;return{m:A*s,mx:cx*s,my:cy*s,I:J0*s};};
const DM={m:0,mx:0,my:0,I:0},add=(q,f=1)=>{for(const k in DM)DM[k]+=f*q[k];};
const P0=ESC.Ps0,PT=ESC.Pt,tsT=ESC.settings.tsT/1000,LTS=Math.hypot(PT.x-P0.x,PT.y-P0.y)*ES;
if(!WEMPE){
for(const m of mv.matchAll(/poly\(R\.det,'(\w+)',(-?[\d.]+),(-?[\d.]+),(\w+(?:\.\w+)?)/g))(H[m[1]]=H[m[1]]||[]).push([(+m[3]-+m[2])/1000,/ruby/.test(m[4])?'ruby':'Cu']);
{const m=/poly\(R\.det,\(\)=>\{const b=E\.pieces\.block[\s\S]*?\},(-?[\d.]+),(-?[\d.]+),Cu/.exec(mv);if(!m)throw Error('not found: the jewel block (movement.js)');H.block=[[(+m[2]-+m[1])/1000,'Cu']];}
for(const k of['spring','cross','blade','block','arm','horn','bracket','stone'])if(!H[k])throw Error('not found in movement.js: the detent\'s '+k);
for(const[k,ls]of Object.entries(H))for(const[h,mat]of ls)add(polyM(ESC.pieces[k],h,RHO[mat]));
{const hB=H.block[0][0],n=24,disc=[...Array(n)].map((_,i)=>({x:ESC.Jc.x+ESC.rJ*Math.cos(TAU*i/n),y:ESC.Jc.y+ESC.rJ*Math.sin(TAU*i/n)}));add(polyM(disc,hB,RHO.Cu),-1);}   /* the block's hole for the stone */
{const a={x:(P0.x-Ft.x)*ES,y:(P0.y-Ft.y)*ES},b={x:(PT.x-Ft.x)*ES,y:(PT.y-Ft.y)*ES},m=RHO.El*LTS*tsT*0.3e-3;add({m,mx:m*(a.x+b.x)/2,my:m*(a.y+b.y)/2,I:m*(a.x*a.x+a.x*b.x+b.x*b.x+a.y*a.y+a.y*b.y+b.y*b.y)/3});}
}else{/* the Wempe's detent as the page draws it (1436: blade, square, pipe, stone, horn, the gold spring and its screw, the spring's free half), weighed about its flexure with
  the detent at rest (wempe_inertia.json; its centre of mass in the plan, put in makeEsc's frame by MK); its spring 0.07 × 1.9 × 5, steel (1436), the heights escapement.js draws it at */
  const dj=WJ.detent,q=WL.WESC.MK([WL.WESC.DPIV[0]+dj.cg[0],WL.WESC.DPIV[1]+dj.cg[2]]),m=dj.m*1e-3;add({m,mx:m*(q.x-Ft.x)*ES,my:m*(q.y-Ft.y)*ES,I:dj.I*1e-9});
  const s=fs.readFileSync(path.join(__dirname,'..','..','wempe','js','escapement.js'),'utf8'),a=/y0F=yd\(([\d.]+)\),y1F=yd\(([\d.]+)\)/.exec(s),b=/\{loop:sp1,y0:y0F\+([\d.]+),y1:y1F-([\d.]+)\}/.exec(s);
  if(WL.WESC.DSPH)H.spring=[[WL.WESC.DSPH/1000,'steel']];   /* escapement.js gives it (the detent drawn by dv, in both states of the sheets) */
  else{if(!a||!b)throw Error('not found in the Wempe\'s escapement.js: the detent spring\'s heights');H.spring=[[(+a[2]-b[2]-(+a[1]+ +b[1]))/1000,'steel']];}}
const ID=DM.I,rCM=Math.hypot(DM.mx,DM.my)/DM.m;
/* its spring: two strips (heights H.spring) of the drawn thickness and length, bending about Ft; a rigid body on a short flexure turns about its root with
   stiffness E I / l. E 125-131 GPa for hardened beryllium copper; 128 taken. Preload: Op. 78, a 0.770 g weight on the locking jewel parts the spring
   from its stop button by about 0.005 in (p. 61, Fig. 88): the weight's moment less the spring's over that bend (makeEsc's th78); a spring scaled (kD) is set up by the same test */
const SP=ESC.pieces.spring,tD=(Math.max(...SP.map(p=>-(p.x-Ft.x)*ESC.dirB.y+(p.y-Ft.y)*ESC.dirB.x))-Math.min(...SP.map(p=>-(p.x-Ft.x)*ESC.dirB.y+(p.y-Ft.y)*ESC.dirB.x)))*ES,
  lD=(Math.max(...SP.map(p=>(p.x-Ft.x)*ESC.dirB.x+(p.y-Ft.y)*ESC.dirB.y))-Math.min(...SP.map(p=>(p.x-Ft.x)*ESC.dirB.x+(p.y-Ft.y)*ESC.dirB.y)))*ES;
const EBC=WEMPE?ESC.settings.EB*1e9:128e9,KD=EBC*H.spring.reduce((s,[h])=>s+h*tD**3/12,0)/lD,rJ=Math.hypot(ESC.Jc.x-Ft.x,ESC.Jc.y-Ft.y)*ES,MW78=ESC.settings.W78*1e-3*G0*rJ,MPRE=MW78-KD*ESC.th78;   /* the Wempe's: steel, 205 GPa (200-210), its preload W78 itself (no Op. 78: th78 0) */
/* the trip spring, a cantilever 7.9 mm long, Elinvar-type (180 GPa, as hairspring.js), bent at its tip by the discharge jewel on the return swing; the Wempe's gold spring 0.15 × 1.0,
   free 11.18 from its bending point (05 04 01-2, 05 04_1), 333 gold about 90 GPa (estimated), taken straight as makeEsc takes it (tripping.js bends it along its drawn path) */
const KTIP=3*(WEMPE?ESC.settings.ET*1e9:180e9)*((WEMPE?ESC.settings.tsH*1e-3:0.3e-3)*tsT**3/12)/LTS**3;
/* the lift: the passing spring's tip moves l (unit frame) along nH as the detent turns l/LEN about Ft (makeEsc's rot), so the detent's angle is d = l/LEN;
   the wheel is free once the stone clears the teeth, at lRel */
const LEN=ESC.LEN,DREL=ESC.lRel/LEN,P=ESC.P,S=ESC.settings,CDR=S.dL*(Math.tan(S.DRAW*D)+S.MU)/(1-S.MU*Math.tan(S.DRAW*D));   /* the wheel's turn back as the stone is drawn out against the tooth (makeEsc) */

/* ---------- contact tables over the balance's angle (the roller's jewels, periodic in 2π) ---------- */
/* the discharge jewel as makeEsc has it, worked out apart: a slab wD thick along the direction aD + θ, from the staff out to reach, its end's acting corner (+m, leading on
   the active swing) square and its back corner rounded rB (makeEsc's rB), and the passing spring's tip a disc radius ρ at Pt + s dir. The tip overlaps the jewel where its
   centre is within ρ of the jewel (the jewel's distance field, convex: its least along the line by golden section, the run's ends by bisection), for s in (s1, s2); the jewel
   pushes it out to s2 (dir nH: the detent, backed by the horn, on the active swing; -nB: the trip spring bending on the return). makeEsc grows the outline instead and cuts
   it into boxes and discs. Checked against makeEsc's LI and PS below */
const HT=2e-5,NTB=Math.ceil(TAU/HT)+3,wrap=a=>a-TAU*Math.floor((a+Math.PI)/TAU),ti=a=>(wrap(a)+Math.PI)/HT;
const JH=ESC.wD/2,JR=ESC.rd-0.5*ESC.rho,JB=Math.min(ESC.settings.rB,JH);   /* the jewel itself: half its width, its reach (the grown outline's less ρ), the back corner's radius */
const jd=(pu,pm)=>{const r=pu>JR/2&&pm<0?JB:0,qx=Math.abs(pu-JR/2)-JR/2+r,qy=Math.abs(pm)-JH+r;return Math.hypot(Math.max(qx,0),Math.max(qy,0))+Math.min(Math.max(qx,qy),0)-r;};   /* signed distance to the slab, the corner at the back of its end rounded */
const slab=(th,dir)=>{const u={x:Math.cos(ESC.aD+th),y:Math.sin(ESC.aD+th)},m={x:-u.y,y:u.x},rho=ESC.rho,w=JH+rho;
  const pm=PT.x*m.x+PT.y*m.y,dm=dir.x*m.x+dir.y*m.y,pu=PT.x*u.x+PT.y*u.y,du=dir.x*u.x+dir.y*u.y,f=s=>jd(pu+s*du,pm+s*dm)-rho;let lo=-Infinity,hi=Infinity;
  const cut=(p,d,a,b)=>{if(Math.abs(d)<1e-12){if(p<=a||p>=b){lo=1;hi=0;}return;}let x=(a-p)/d,y=(b-p)/d;if(x>y)[x,y]=[y,x];lo=Math.max(lo,x);hi=Math.min(hi,y);};
  cut(pm,dm,-w,w);cut(pu,du,-rho,JR+rho);if(!(lo<hi))return null;   /* the box round it first */
  let a=lo,b=hi;for(let k=0;k<80;k++){const c=b-(b-a)*0.618034,d=a+(b-a)*0.618034;f(c)<f(d)?b=d:a=c;}const s0=(a+b)/2;if(!(f(s0)<0))return null;
  const end=(x,y)=>{for(let k=0;k<60;k++){const z=(x+y)/2;f(z)<0?x=z:y=z;}return(x+y)/2;};return[end(s0,lo),end(s0,hi)];};
/* the Wempe's (makeEsc's BEV and TSQ): the discharge stone's end bevelled straight back from its square acting corner (BEV short at its back corner), and the gold spring's tip
   the square end of its strip, 2ρ thick, running back along the detent as far as the drawn spring runs straight (05 04_1 traced: from its last bend 1.6 past the stone to
   its tip, 2.86 mm; makeEsc runs it back its whole free length). Both convex: the run of the line Pt + s dir over which they overlap, by separating axes (each edge's normal:
   the shadows on it overlap for s in an interval, the run the intersection), where makeEsc takes the jewel grown by the strip's outline */
const TIPL=WEMPE?(()=>{const X=WL.WESC,t={x:(X.DPIV[0]-X.P[0])/X.TP,y:(X.DPIV[1]-X.P[1])/X.TP},tB=(X.B[0]-X.P[0])*t.x+(X.B[1]-X.P[1])*t.y;return(-1.6-(tB+1.54))/ESC.ES;})():0;
const slabP=(th,dir)=>{const u={x:Math.cos(ESC.aD+th),y:Math.sin(ESC.aD+th)},m={x:-u.y,y:u.x},w=ESC.wD/2,ra=ESC.rd-0.5*ESC.rho,bv=ESC.settings.BEV,rho=ESC.rho,e={x:-ESC.dirB.x,y:-ESC.dirB.y},nb=ESC.nB;
  const J=[[0,-w],[ra-bv,-w],[ra,w],[0,w]].map(([a,b])=>({x:a*u.x+b*m.x,y:a*u.y+b*m.y})),Tp=[[0,-rho],[TIPL,-rho],[TIPL,rho],[0,rho]].map(([a,b])=>({x:PT.x+a*e.x+b*nb.x,y:PT.y+a*e.y+b*nb.y}));
  let lo=-Infinity,hi=Infinity;
  for(const Pg of[J,Tp])for(let k=0;k<4;k++){const p=Pg[k],q=Pg[(k+1)%4],l=Math.hypot(q.x-p.x,q.y-p.y),ax=-(q.y-p.y)/l,ay=(q.x-p.x)/l,pr=Q=>Q.map(v=>v.x*ax+v.y*ay),a=pr(J),b=pr(Tp),da=dir.x*ax+dir.y*ay;
    const j0=Math.min(...a),j1=Math.max(...a),t0=Math.min(...b),t1=Math.max(...b);
    if(Math.abs(da)<1e-15){if(!(t0<j1&&t1>j0))return null;continue;}let x=(j1-t0)/da,y=(j0-t1)/da;if(x>y)[x,y]=[y,x];lo=Math.max(lo,x);hi=Math.min(hi,y);}
  return lo<hi?[lo,hi]:null;};
const mk=()=>new Float64Array(NTB).fill(NaN),G=mk(),S1=mk(),S2=mk(),Q1=mk(),Q2=mk(),mB={x:-ESC.nB.x,y:-ESC.nB.y},slabM=WEMPE?slabP:slab;
for(let i=0;i<NTB;i++){const th=-Math.PI+i*HT,b=ESC.bite(th);if(b>-1e8)G[i]=b-ESC.t0;const a=slabM(th,ESC.nH);if(a){S1[i]=a[0];S2[i]=a[1];}const c=slabM(th,mB);if(c){Q1[i]=c[0];Q2[i]=c[1];}}
const dif=(T)=>{const d=mk();for(let i=1;i<NTB-1;i++){const a=T[i-1],b=T[i],c=T[i+1];d[i]=!isNaN(a)&&!isNaN(c)?(c-a)/(2*HT):!isNaN(b)&&!isNaN(c)?(c-b)/HT:!isNaN(a)&&!isNaN(b)?(b-a)/HT:NaN;}return d;};
const G1=dif(G),G2=dif(G1),S21=dif(S2),S22=dif(S21),Q21=dif(Q2);
/* the Wempe's: the lift's corners, where the square end of the gold spring passes over the stone's square corner and the lift turns down within a cell of the table (its
   curvature there past 2,000 units a radian squared, the lift itself 0.04): a step that straddles one ends on the jewel's far side, where the detent pressed back on it is held again, and misses its
   leaving; so a step on the jewel ends inside such a cell (KN: the cells, by the balance's angle rising) */
const KN=WEMPE?(()=>{const o=[];for(let i=1;i<NTB-1;i++)if(S22[i]<-2e3&&!(S22[i-1]<-2e3))o.push(-Math.PI+i*HT);return o;})():[];
const at=(T,x)=>{const f=ti(x),i=Math.floor(f),a=T[i],b=T[i+1];if(isNaN(a))return isNaN(b)||f-i<0.5?NaN:b;if(isNaN(b))return f-i>0.5?NaN:a;return a+(b-a)*(f-i);};
/* ---------- the stone riding the escaping tooth (the Wempe's) ---------- */
/* The Wempe's wheel, let go from rest, is slow to get its tooth out from under the stone (the jewel lets the detent down within 2° of the release, the tooth's tip still under
   the stone's flat), so the stone falls onto the land of the tooth it has just released and rides it, and down its back, until the tooth has passed (makeEsc's ride: the
   detent's lift the most of its fall and of what the tooth leaves it). RDT: the detent's least angle (rad) that keeps the stone out of that tooth, its tip at lockA + ph (ph
   the wheel's angle from its locked place, 0 to -P), worked out apart from makeEsc's: the tooth's outer edge as the radius over the angle behind its tip, from the drawn arcs
   (05 04_23: the land on the tips' circle for 1.5°, the back the ∅ 6 cutter's arc down to Ø 12.1 at 15°, the face below the tip leaning 25°, 4.27° behind it there; 11.9° and 2.43° until 15 October 2026), the
   stone the drawn half round (Ø 0.75, its flat through its centre: rJ, the flat's frame nF, fF) sampled every 0.1 µm of the unit along its outline, a point inside the tooth
   where it lies between the face and that edge; bisection on the detent's angle. In time the detent is held on the tooth while it presses on it (a contact, the detent's preload
   and spring on the tooth and through it on the wheel: the land's friction, MU, against its turn, the back's slope pushing it on), landing plastically (estimated) */
const RIDE=WEMPE,NR=1600,RDT=new Float64Array(NR+3);
if(RIDE){const EX=ESC.EX,PP=ESC.P,S_=ESC.settings,g1=S_.land*PP,g2=S_.B*PP,UP=ESC.U*PP,r0=ESC.r0,Rb=S_.TBR/ESC.ES;
  /* the back's arc: through the land's end (r 1 at g1) and the root (r0 at g2), radius Rb, its centre in the gap (the farther of the two from the wheel's centre) */
  const x1=Math.cos(g1),y1=Math.sin(g1),x2=r0*Math.cos(g2),y2=r0*Math.sin(g2),hc=Math.hypot(x2-x1,y2-y1)/2,sc=Math.sqrt(Rb*Rb-hc*hc),mx=(x1+x2)/2,my=(y1+y2)/2,nx=-(y2-y1)/(2*hc),ny=(x2-x1)/(2*hc),
    Cs=[[mx+sc*nx,my+sc*ny],[mx-sc*nx,my-sc*ny]],Cb=Math.hypot(...Cs[0])>Math.hypot(...Cs[1])?Cs[0]:Cs[1];
  const edge=g=>{if(g<=g1)return 1;const ux=Math.cos(g),uy=Math.sin(g),b=Cb[0]*ux+Cb[1]*uy,q=b*b-(Cb[0]**2+Cb[1]**2-Rb*Rb);if(q<0)return r0;const ra=b-Math.sqrt(q),rb=b+Math.sqrt(q);return ra>=r0-1e-9&&ra<=1+1e-9?ra:rb;};
  const fx1=1,fy1=0,fx2=r0*Math.cos(UP),fy2=r0*Math.sin(UP),face=g=>{const ux=Math.cos(g),uy=Math.sin(g),dx=fx2-fx1,dy=fy2-fy1,den=ux*dy-uy*dx;return(fx1*dy-fy1*dx)/den;};   /* the ray at g against the face's line */
  const Jc=ESC.Jc,rJ=ESC.rJ,pts=[];
  {const sF=ESC.pieces.stone,f0=sF[0],v={x:f0.x-Jc.x,y:f0.y-Jc.y},u={x:v.x/rJ,y:v.y/rJ},w={x:-u.y,y:u.x},sg=Math.sign((sF[1].x-Jc.x)*w.x+(sF[1].y-Jc.y)*w.y)||1;   /* the round half from the flat's first end, the way makeEsc's outline runs */
    const nA=Math.ceil(Math.PI*rJ/1e-4);for(let j=0;j<=nA;j++){const a=Math.PI*j/nA;pts.push({x:Jc.x+rJ*(Math.cos(a)*u.x+sg*Math.sin(a)*w.x)-Ft.x,y:Jc.y+rJ*(Math.cos(a)*u.y+sg*Math.sin(a)*w.y)-Ft.y});}
    const nC=Math.ceil(2*rJ/1e-4);for(let j=1;j<nC;j++){const a=-1+2*j/nC;pts.push({x:Jc.x+rJ*a*u.x-Ft.x,y:Jc.y+rJ*a*u.y-Ft.y});}}   /* and the flat, its chord */
  const inside=(d,tip)=>{const c=Math.cos(-d),s=Math.sin(-d);for(const p of pts){const x=Ft.x+p.x*c-p.y*s-EX,y=Ft.y+p.x*s+p.y*c,r=Math.hypot(x,y);if(r>=1||r<=r0)continue;let g=Math.atan2(y,x)-tip;g-=TAU*Math.round(g/TAU);
    if(g<=0||g>=g2)continue;if(r<edge(g)&&(g>=UP||r>face(g)))return true;}return false;};
  for(let k=0;k<=NR;k++){const tip=ESC.lockA-PP*k/NR;if(!inside(0,tip))continue;let lo=0,hi=0.05;for(let i=0;i<44;i++){const m=(lo+hi)/2;inside(m,tip)?lo=m:hi=m;}RDT[k]=hi;}}
/* its slopes in ph (the table runs the other way: k = -ph/hR), central differences over 2 steps either side (the outline sampled, the bisection to 1e-15: the steps' noise
   left out of the second) */
const RD1=new Float64Array(NR+1),RD2=new Float64Array(NR+1),hR=ESC.P/NR;
for(let k=2;k<NR-1;k++)RD1[k]=-(RDT[k+2]-RDT[k-2])/(4*hR);for(let k=4;k<NR-3;k++)RD2[k]=-(RD1[k+2]-RD1[k-2])/(4*hR);
const rdq=(T,ph)=>{const f=-ph/hR;if(!(f>0)||f>=NR)return 0;const i=Math.floor(f);return T[i]+(T[i+1]-T[i])*(f-i);},rdA=ph=>rdq(RDT,ph),rd1=ph=>rdq(RD1,ph),rd2=ph=>rdq(RD2,ph);

/* ---------- the integration ---------- */
/* one run. o: drive s (the escape wheel's torque, times the calibrated), mode 'avg' (the model's springs, the detent all but massless and dead on its stop,
   as makeEsc takes it) or 'phys' (the same springs, the detent's own inertia, bouncing on its stop), kD/kP
   (their stiffness, times), pre (the preload, times), dI (the detent's inertia, times), J (the wheel and train's), eB (the detent's restitution on its stop
   button: estimated 0.3, metal on a steel button, its range tried below), eW (the tooth on the impulse jewel: plastic), A (start, degrees), T, from (when
   the rate is measured from), ideal (no escapement: a kick at the dead point, which by Airy changes no rate, to measure the damping's own share), ext(t):
   the case's angular acceleration al (rad/s²) about the staff and its linear acceleration ax, ay (m/s², unit frame); TF (the balance's run-down, s); bE (degrees: out of beat, the hairspring at rest with the balance that far from the escapement's zero);
   trace: an array that collects each event as [t, event, θ°, θ', lift/release lift, detent mode, wheel mode, wheel/pitch] (events: 4 the jewel meets the passing spring, 2 the wheel
   released, 5 the detent leaves the jewel, 3 it lands on its stop, 0 the tooth strikes the impulse jewel, 1 the next tooth locks; on the return swing 8 the jewel
   meets the trip spring, 9 the spring comes clear: acoustic.py times them against recordings; the Wempe's, 10 the stone lands on the tooth it let go, 11 it leaves it, 12 it
   rides down its back onto the stop, 13 the tooth takes the detent off the discharge stone). The Wempe's ride: rideW, its force on the wheel (1 in 'phys'; 0 in 'avg', the
   detent kinematic on the tooth as makeEsc has it), muR the stone's friction on the tooth (makeEsc's MU in 'phys', 0 in 'avg') */
function sim(o={}){
  /* o.split [air, endstone, rest]: the balance's damping in its parts (physics.js's shares of the loss at 255 deg, summing to 1), not all viscous: the air on the screws
     and arm a drag in the square of the speed (its loss a swing in A³), the staff's flat end on its endstone a constant friction (in A), the rest (the spring's material,
     its side friction) viscous (in A²); together they lose at 255 deg what TF's viscous damping does, so the running swing and rate hold, and the start and run-down change */
  const sp=o.split,dE=2*Math.PI*(0.5*I*W0*W0*(255*D)**2)/(Math.PI*(o.TF??TF)/T0),Ca=sp?3*sp[0]*dE/(8*W0*W0*(255*D)**3):0,Tc=sp?sp[1]*dE/(4*255*D):0;
  const s=o.s??1,C=sp?sp[2]*dE/(Math.PI*W0*(255*D)**2):2*I/(o.TF??TF),phys=(o.mode??'phys')==='phys',tauE=TAUE*s,J=JT*(o.J??1),eB=o.eB??(phys?0.3:0),eW=o.eW??0,ext=o.ext,T=o.T??80,from=o.from??40,ideal=!!o.ideal,bE=(o.bE??0)*D;
  const id=phys?ID*(o.dI??1):ID*1e-4,kr=KD*(o.kD??1),pre=(MW78-kr*ESC.th78)*(o.pre??1),kp=KTIP*ES*ES*(o.kP??1);
  const cd=2*Math.sqrt(kr*id)/(2*(o.Qd??100)),mDraw=tauE*CDR/DREL;   /* the detent's own damping (Q 100, estimated); the draw's resistance spread over the lift to release */
  const hf=o.hf??4e-6,hc=o.hc??1e-4,kW=o.rideW??(phys?1:0),muR=o.muR??(phys?ESC.settings.MU:0),NEV=RIDE?12:8;
  let t=0,th=-(o.A??ESC.A/D)*D,w=0,d=0,dv=0,ph=0,pv=0,wm=0,dm=0,pc=false,pp=0,passed=true;   /* wm: wheel locked 0, free 1, on the jewel 2; dm: detent on its stop 0, free 1, pushed 2, on the escaping tooth 3 (the Wempe's) */
  if(o.phase!=null){th=(o.A??ESC.A/D)*D*Math.cos(TAU*o.phase);w=-(o.A??ESC.A/D)*D*W0*Math.sin(TAU*o.phase);}
  const st={swRel:0,twice:0,pass:[],cross:[],beats:0,esc:0,caught:false,lastBeat:-1,trips:0,land:[],rel:[],off:[],offF:[],offTh:NaN,margin:[],liftAt:[],bounce:0,maxBack:0,lastBank:-1,lastOff:-1,bnc:0,home:[],stopAt:null,kicks:0,missed:0,rOn:[],rOff:[],rEnd:[],rFirst:[],rLand:-1};
  const X={al:0,ax:0,ay:0};
  const lift=()=>(phys?DM.mx*X.ay-DM.my*X.ax:0)+id*X.al;   /* the case's acceleration as a moment lifting the detent: its unbalance about Ft (DM.mx, DM.my: m·r), and the yaw */
  let ddd=0,phd=0,lamD=0,lamW=0,lamR=0;
  /* accelerations for the current modes; sets ddd, phd (the slaved coordinates' too) and the contact forces lamD, lamW, lamR (the Wempe's stone on the escaping tooth: the
     detent's angle held at RDT(ph); the tooth's push on it λ and, as kW asks, on the wheel (cR - R') λ: the back's slope, and the land's friction μ λ / BL, the stone at BL
     from the flexure and the tooth's tip at the wheel's radius) */
  const acc=(tt,th,w,d,dv,ph,pv)=>{
    if(ext){const e=ext(tt);X.al=e.al||0;X.ax=e.ax||0;X.ay=e.ay||0;}
    const Ml=lift(),draw=wm===0&&d>0?mDraw:0;
    let M=I,F=-K*(th-bE)-C*w-Ca*w*Math.abs(w)-Tc*Math.tanh(w/0.05)-I*X.al,h1=0,h2=0,g1=0,g2=0,R1=0,R2=0,Fd=0,cR=0;
    if(pc){const p=at(Q2,th),q=at(Q21,th);if(!isNaN(p)&&!isNaN(q))F-=kp*p*q;}   /* the trip spring bent on the return, quasi-static */
    if(dm===3){R1=rd1(ph);R2=rd2(ph);Fd=Ml-pre-kr*d-cd*dv;cR=muR*Math.tanh(-pv/0.05)/ESC.BL;}
    if(dm===2){h1=at(S21,th)/LEN;h2=at(S22,th)/LEN;if(isNaN(h1))h1=0;if(isNaN(h2))h2=0;M+=id*h1*h1;F+=-id*h1*h2*w*w+h1*(Ml-pre-kr*d-cd*h1*w-draw);}
    if(wm===2){g1=at(G1,th);g2=at(G2,th);if(isNaN(g1))g1=0;if(isNaN(g2))g2=0;M+=J*g1*g1;F+=-J*g1*g2*w*w+g1*(-tauE-J*X.al);
      if(dm===3){h1=R1*g1;h2=R2*g1*g1+R1*g2;M+=kW*(id*h1*h1-g1*cR*id*h1);F+=kW*(-id*h1*h2*w*w+h1*Fd+g1*cR*(id*h2*w*w-Fd));}}
    const a=F/M;
    if(dm===2){ddd=h2*w*w+h1*a;lamD=id*ddd-(Ml-pre-kr*d-cd*dv-draw);}else if(dm===1)ddd=(Ml-pre-kr*d-cd*dv-draw)/id;else if(dm===3){
      if(wm===2)ddd=h2*w*w+h1*a;else{phd=(-tauE-J*X.al+kW*(cR-R1)*(id*R2*pv*pv-Fd))/(J+kW*id*R1*(R1-cR));ddd=R2*pv*pv+R1*phd;}lamR=id*ddd-Fd;}else ddd=0;
    if(wm===2){phd=g2*w*w+g1*a;lamW=J*phd+tauE+J*X.al-(dm===3?kW*(cR-R1)*lamR:0);}else if(wm===1){if(dm!==3)phd=-tauE/J-X.al;}else phd=0;
    return a;};
  const out=new Float64Array(6),R8=RIDE?Array(NEV).fill(1):[1,1,1,1,1,1,1,1],y=new Float64Array(6),k1=new Float64Array(6),k2=new Float64Array(6),k3=new Float64Array(6),k4=new Float64Array(6),tmp=new Float64Array(6);
  const der=(tt,v,out)=>{const a=acc(tt,v[0],v[1],v[2],v[3],v[4],v[5]);out[0]=v[1];out[1]=a;out[2]=v[3];out[3]=ddd;out[4]=v[5];out[5]=phd;};
  const rk=(v,tt,h,out)=>{der(tt,v,k1);for(let i=0;i<6;i++)tmp[i]=v[i]+h/2*k1[i];der(tt+h/2,tmp,k2);for(let i=0;i<6;i++)tmp[i]=v[i]+h/2*k2[i];der(tt+h/2,tmp,k3);
    for(let i=0;i<6;i++)tmp[i]=v[i]+h*k3[i];der(tt+h,tmp,k4);for(let i=0;i<6;i++)out[i]=v[i]+h/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i]);
    if(dm===2){const h0=at(S2,out[0]);if(!isNaN(h0)){out[2]=h0/LEN;const h1=at(S21,out[0]);out[3]=(isNaN(h1)?0:h1/LEN)*out[1];}}
    if(wm===2){const g0=at(G,out[0]);if(!isNaN(g0)){out[4]=g0;const g1=at(G1,out[0]);out[5]=(isNaN(g1)?0:g1)*out[1];}}
    if(dm===3){out[2]=rdA(out[4]);out[3]=rd1(out[4])*out[5];}
    if(dm===0){out[2]=0;out[3]=0;}if(wm===0){out[4]=0;out[5]=0;}};
  /* the Wempe's stone landing on the escaping tooth, plastically (estimated): the detent's speed made the tooth's there, the wheel (and the balance with it, the tooth on the
     impulse stone) taking kW of the blow */
  const landR=()=>{const R1=rd1(ph),g1=wm===2?(at(G1,th)||0):0,Mi=wm===2?(I+J*g1*g1)/(g1*g1||1e-30):J,c=dv-R1*pv,L=-c/(1/id+kW*R1*R1/Mi);
    if(wm===2){w-=kW*L*R1*g1/(I+J*g1*g1);pv=g1*w;}else pv-=kW*L*R1/J;dm=3;d=rdA(ph);dv=R1*pv;st.rOn.push(th/D);if(st.rLand<st.lastOff){st.rLand=t;st.rFirst.push(th/D);}};
  /* event functions, crossing from > 0 to <= 0: the tooth reaching the impulse jewel, the next tooth reaching the stone, the stone clearing the tooth,
     the detent reaching its stop, the jewel meeting the passing spring's tip, a contact letting go, the detent leaving its stop */
  const evs=(v,tt)=>{const th=v[0],w=v[1],d=v[2],ph=v[4],r=R8;r.fill(1);acc(tt,v[0],v[1],v[2],v[3],v[4],v[5]);
    if(!ideal){
      if(wm===1&&w>0){const g=at(G,th);if(!isNaN(g))r[0]=ph-g;}
      if(wm!==0)r[1]=ph+P;
      if(wm===0)r[2]=DREL-d;
      if(dm===1)r[3]=d;
      if(dm!==2&&w>0&&passed){const a=at(S1,th),b=at(S2,th),sl=d*LEN;if(!isNaN(b)&&sl>a)r[4]=sl-b;}
      if(dm===2)r[5]=lamD;if(wm===2)r[6]=lamW;
      if(dm===0)r[7]=pre+(wm===0?0:0)-lift()+1e-12;
      if(RIDE&&wm!==0){const q=rdA(ph);if(dm===1&&q>0)r[8]=d-q;if(dm===3){r[9]=lamR;r[10]=q;}if(dm===2&&q>0)r[11]=d-q;}}   /* the Wempe's: the stone onto the escaping tooth, off it, past it onto the stop; the tooth over the jewel's hold */
    return r;};
  const hit=(c,inv,e)=>-(1+e)*c/inv;   /* the impulse a contact takes: c the closing velocity along it, inv the sum of the inverse effective inertias */
  let A0=null,lastW=0,thM=0;const amps=[],ampT=[];
  const t1=T;let guard=0;
  while(t<t1){
    const tw=wrap(th),near=(tw>-0.8&&tw<0.55)||wm!==0||dm!==0||pc||(ext&&o.extFine&&o.extFine(t));
    let h=Math.min(near?hf:hc,t1-t);
    if(KN.length&&dm===2&&w>0){for(const k of KN)if(k>th&&k<th+w*h){h=Math.max(1e-9,(k+HT/2-th)/w);break;}}   /* the Wempe's: end the step in a corner's cell (KN) */
    /* states an event can't catch because its threshold is already passed as the step begins (a blow that lifts the detent off its stop in one step) */
    if(!ideal){acc(t,th,w,d,dv,ph,pv);if(dm===0&&lift()>pre+(wm===0?0:0))dm=1;if(wm===0&&d>=DREL){wm=1;pv=0;st.rel.push(th/D);if(st.swRel++>0){st.trips++;st.twice++;}}
      if(RIDE&&wm!==0&&(dm===1||dm===2)&&d<rdA(ph)){dm=1;landR();}}
    y[0]=th;y[1]=w;y[2]=d;y[3]=dv;y[4]=ph;y[5]=pv;
    const e0=evs(y,t).slice();rk(y,t,h,out);let e1=evs(out,t+h),hit_=-1;
    for(let i=0;i<NEV;i++)if(e0[i]>0&&e1[i]<=0){hit_=i;break;}
    if(hit_>=0){let lo=0,hi=h;for(let it=0;it<40;it++){const m=(lo+hi)/2;rk(y,t,m,out);const e=evs(out,t+m);let any=false;for(let i=0;i<NEV;i++)if(e0[i]>0&&e[i]<=0){any=true;break;}any?hi=m:lo=m;if(hi-lo<1e-11)break;}
      h=hi;rk(y,t,h,out);e1=evs(out,t+h);hit_=-1;for(let i=0;i<NEV;i++)if(e0[i]>0&&e1[i]<=0){hit_=i;break;}}
    const thO=th,wO=w;t+=h;th=out[0];w=out[1];d=out[2];dv=out[3];ph=out[4];pv=out[5];
    /* the rate: the return swing's dead point, interpolated */
    if(thO>0&&th<=0&&w<0)st.cross.push(t-h+h*thO/(thO-th));
    if(wO>0&&w<=0){amps.push(Math.abs(th));ampT.push(t);thM=th;}if(wO<0&&w>=0){amps.push(Math.abs(th));ampT.push(t);st.swRel=0;}
    if(ideal&&thO<0&&th>=0&&w>0){w+=o.kick;st.kicks++;}
    /* the trip spring: bent while the jewel holds its tip on the return swing; let go, its energy is lost */
    /* the trip spring, massless: once the jewel bends it on the return it stays on the jewel (on its face, then its end) while the jewel is in the way. The jewel
       is past it (passed: the next active swing can unlock) only if the tip comes clear while the return swing goes on; turned back first, the spring follows
       the jewel back and the detent stays on its stop (makeEsc's AMIN) */
    if(!ideal){const a=at(Q1,th),b=at(Q2,th);
      if(pc){if(!isNaN(b)&&b>0&&a<pp)pp=b;else{pc=false;pp=0;passed=w<0;if(passed)st.pass.push(th/D);if(o.trace)o.trace.push([t.toFixed(5),9,(th/D).toFixed(2),w.toFixed(2),'','','','']);}}
      else if(w<0&&!isNaN(b)&&b>0&&a<0){pc=true;pp=b;passed=false;if(o.trace)o.trace.push([t.toFixed(5),8,(th/D).toFixed(2),w.toFixed(2),'','','','']);}}   /* traced as 8 (the jewel meets the trip spring) and 9 (it comes clear): the return swing's clicks (acoustic.py) */
    if(ideal)continue;
    if(o.trace&&hit_>=0)o.trace.push([t.toFixed(5),hit_>=8?hit_+2:hit_,(th/Math.PI*180).toFixed(2),(w).toFixed(2),(d/DREL).toFixed(3),dm,wm,(ph/P).toFixed(3)]);
    switch(hit_){
      case 0:{const g=at(G,th),g1=at(G1,th)||0,h1=dm===2?(at(S21,th)||0)/LEN:0,Mb=I+id*h1*h1,R1=dm===3?rd1(ph):0,Je=dm===3?J+kW*id*R1*R1:J,c=pv-g1*w,L=hit(c,1/Je+g1*g1/Mb,eW);pv+=L/Je;w-=L*g1/Mb;if(eW===0||Math.abs(pv-g1*w)<1e-6){wm=2;ph=g;pv=g1*w;}
        if(dm===3){d=rdA(ph);dv=R1*pv;}st.land.push(th/D);st.caught=true;break;}
      case 1:{const sl=d*LEN;if(sl<ESC.lRel){st.beats++;st.lastBeat=t;if(!st.caught)st.esc++;st.caught=false;st.liftAt.push(sl/ESC.lRel);if(st.lastBank>0)st.margin.push(t-st.lastBank);wm=0;ph=0;pv=0;}else{st.trips++;ph+=P;wm=1;}break;}
      case 2:{wm=1;pv=0;st.rel.push(th/D);if(st.swRel++>0){st.trips++;st.twice++;}break;}   /* a second release in one active swing (past makeEsc's TRIP, the jewel come round again) is a trip: until 12 October 2026 it counted as a beat (tripping.js) */
      case 10:dm=1;dv=rd1(ph)*pv;st.rEnd.push(th/D);   /* the Wempe's: the tooth passed, the stone rides off its back onto the stop: on as case 3 */
      case 3:{if(st.lastBank<st.lastOff){st.lastBank=t;st.home.push(th/D);st.offF.push(st.offTh);}st.bnc++;dv=-eB*dv;d=0;if(eB===0||Math.abs(dv)<1e-3||2*id*Math.abs(dv)/(pre+1e-30)<4*hf){dm=0;dv=0;}break;}   /* rebounds too short to resolve (a ball's bounces) end on the stop */
      case 4:{const h1=(at(S21,th)||0)/LEN,g1=wm===2?(at(G1,th)||0):0,Mb=I+J*g1*g1,c=dv-h1*w,L=hit(c,1/id+h1*h1/Mb,0);dv+=L/id;w-=L*h1/Mb;dm=2;d=at(S2,th)/LEN;dv=h1*w;break;}
      case 5:{dm=1;st.off.push(th/D);st.lastOff=t;st.offTh=th/D;break;}
      case 6:{wm=1;break;}
      case 7:{dm=1;break;}
      case 11:st.off.push(th/D);st.lastOff=t;st.offTh=th/D;   /* off the jewel, onto the tooth: on as case 8 */
      case 8:{dm=1;landR();break;}
      case 9:{dm=1;st.rOff.push(th/D);break;}}
    /* contacts whose surface ends (no bisection: a step's error) */
    if(dm===2&&isNaN(at(S2,th))){dm=1;st.off.push(th/D);st.lastOff=t;st.offTh=th/D;}
    if(wm===2&&(isNaN(at(G,th))||at(G,th)<=-P))wm=1;
    if(dm===2||wm===2||dm===3){y[0]=th;y[1]=w;y[2]=d;y[3]=dv;y[4]=ph;y[5]=pv;acc(t,th,w,d,dv,ph,pv);if(dm===2&&lamD<-1e-12){dm=1;st.off.push(th/D);st.lastOff=t;st.offTh=th/D;}if(wm===2&&lamW<-1e-12)wm=1;if(dm===3&&lamR<-1e-12){dm=1;st.rOff.push(th/D);}}
    if(dm===1&&d<0){acc(t,th,w,0,0,ph,pv);if(dv<0&&eB>0&&Math.abs(dv)>1e-3&&2*id*Math.abs(dv)/(pre+1e-30)>=4*hf){d=0;dv=-eB*dv;}else if(lift()>pre){d=0;dv=Math.max(dv,0);}else{dm=0;d=0;dv=0;}}
    if(dm===1&&st.lastOff>st.lastBank)st.maxBack=Math.max(st.maxBack,d/DREL);
    if(o.watch)o.watch(t,th,w,d,dv,ph,pv,dm,wm);
    if(++guard>5e8)throw Error('dynamics: runaway');
  }
  const c=st.cross.filter(x=>x>=from),n=c.length,Tm=n>1?(c[n-1]-c[0])/(n-1):NaN;
  const am=amps.slice(-8),A=am.length?am.reduce((a,b)=>a+b,0)/am.length/D:0;
  const mean=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:NaN,tail=a=>a.slice(Math.floor(a.length/2));
  return{A,rate:day(T0/Tm-1),n,beats:st.beats,trips:st.trips+st.esc,esc:st.esc,twice:st.twice,lastBeat:st.lastBeat,land:mean(tail(st.land)),rel:mean(tail(st.rel)),pass:mean(tail(st.pass)),off:mean(tail(st.off)),offF:mean(tail(st.offF)),margin:Math.min(...tail(st.margin)),
    liftAt:Math.max(...tail(st.liftAt),0),maxBack:st.maxBack,home:mean(tail(st.home)),amps,ampT,cross:st.cross,stopped:st.beats===0,
    ...(RIDE?{rOn:mean(tail(st.rFirst)),rOff:mean(tail(st.rOff)),rEnd:mean(tail(st.rEnd)),rN:st.rOn.length/Math.max(1,st.beats)}:{})};   /* the Wempe's: where the stone first lands on the escaping tooth, leaves it, rides off it; its landings a beat */
}
module.exports={sim,ESC,I,K,C,TF,JT,JE,J4,TAUE,ID,DM,rCM,KD,MPRE,MW78,KTIP,DREL,LEN,lD,tD,LTS,CDR,day,S2,G,G1,at,jd,JR,JH,JB,H,RHO,polyM,ES,W0,T0,WEMPE,WL,WJ,RIDE,RDT,rdA,rd1,slabP,TIPL};   /* tripping.js builds the detent as a frame from the same pieces and contacts */
if(require.main!==module)return;

/* ---------- the report ---------- */
const PH=require('./physics.js'),quick=process.argv.includes('--quick'),rows=[];let fail=0;
const say=s=>rows.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;rows.push(`${ok?'  ok ':'  !! '} ${s}`);};
const f=(x,n=2)=>(+x).toFixed(n),sg=(x,n=2)=>(x>=0?'+':'−')+Math.abs(x).toFixed(n),t0=Date.now(),flush=()=>{console.log(rows.splice(0).join('\n'));console.log(`  (${f((Date.now()-t0)/1000,0)} s)`);};
say('The bodies');
/* the Wempe's words where the parts differ (its stones, its gold spring), the Hamilton's text otherwise as it was */
const JW_=WEMPE?'stone':'jewel',TS_=WEMPE?'the gold spring':'the trip spring',PHI0=WEMPE?WL.WESC.ESC.PHI0:0;
if(!WEMPE){
say(`the balance ${I*1e9} g·mm² on k ${f(K*1e6,1)} µN·m a radian, damped as its free run-down TF ${TF} s (Q ${f(Math.PI*TF/T0,0)})`);
say(`the train at the escape wheel ${f(JT*1e9,2)} g·mm² (its arbors' solids, mechanisms.json: the fourth wheel's reflected ${f(J4*(TR.ep/TR.fw)**2*1e9,2)}); driven at ${f(TAUE*1e6,1)} µN·m, the torque the model is calibrated at`);
}else{const j=WJ,sc=(j.seconds.I+j.secondsHand.I)/ra[0]**2,it=j.intermediate.I/ra[1]**2,ce=JcM/ra[2]**2,fu=(j.fuseeWheel.I+j.maintaining.I)/ra[3]**2;
  say(`the balance ${f(I*1e9,1)} g·mm² (weighed on its solids with its rollers, collet and a third of its spring: wempe_inertia.json) on k ${f(K*1e6,1)} µN·m a radian, the train's 0.5 s as makeEsc runs it (the drawn hairspring gives ${f(WL.WPHYS.HS.T,3)} s: the timing a maker sets), damped as its free run-down TF ${TF} s (Q ${f(Math.PI*TF/T0,0)}; estimated from its parts, wempe_escapement.js)`);
  say(`the train at the escape wheel ${f(JT*1e9,3)} g·mm² (its arbors' solids, wempe_inertia.json: the escape arbor ${f(j.escape.I,2)}, the seconds arbor and hand reflected ${f(sc,3)}, the intermediate ${f(it,4)}, the centre with the motion work and hands ${f(ce,4)}, the fusee wheel with the maintaining work ${f(fu,5)}); driven at ${f(TAUE*1e6,1)} µN·m, 05 06_20's drive 12 h from full wind through the train (the reference)`);}
const dAJ=WEMPE?(WL.makeEsc({...WL.WPHYS.SET,JW:JT*1e9},WL.WPHYS.SET).A-ESC.A)/D:0;   /* the Wempe's JW is its escape and seconds arbors': the rest of the train, put in, moves makeEsc's swing so much */
chk(Math.abs(JT*1e9-S.JW)<0.1&&Math.abs(ID*1e9-S.ID)<0.01&&Math.abs(KD/(ESC.KD*ESC.kB)-1)<0.01&&Math.abs(MPRE/(ESC.MP*ESC.kB)-1)<0.01&&Math.abs(KTIP*ES*ES/(ESC.KP*ESC.kB)-1)<0.01,WEMPE?`makeEsc's bodies and springs (JW ${S.JW}, the escape and seconds arbors': the rest of the train adds ${f(JT*1e9-S.JW,3)}, which would move its swing ${sg(dAJ,2)}°; the detent's inertia ID ${S.ID}, its spring's ${f(ESC.KD*ESC.kB*1e3,3)} mN·m a radian and ${f(ESC.MP*ESC.kB*1e6,1)} µN·m, the gold spring's) are these, from the drawn parts`:`the model's bodies and springs (JW ${S.JW}, the detent's inertia ID ${S.ID}, its spring's ${f(ESC.KD*ESC.kB*1e3,3)} mN·m a radian and ${f(ESC.MP*ESC.kB*1e6,1)} µN·m, the trip spring's) are these, from the drawn parts`);
if(!WEMPE){
say(`the detent: ${f(DM.m*1e6,1)} mg, ${f(ID*1e9,3)} g·mm² about its flexure, its centre of mass ${f(rCM*1000,2)} mm from it (the drawn pieces, the trip spring with it)`);
say(`its spring: two strips ${H.spring.map(([h])=>f(h*1000,2)).join(' + ')} mm tall, ${f(tD*1000,3)} thick, ${f(lD*1000,2)} long: ${f(KD*1e3,3)} mN·m a radian (beryllium copper, 128 GPa), preloaded ${f(MPRE*1e6,1)} µN·m by Op. 78 (as if bent ${f(MPRE/KD/D,2)}° past its stop)`);
say(`the wheel is free at ${f(DREL/D,3)}° of the detent (lRel ${f(ESC.lRel*ESC.ES,3)} mm at the passing spring's tip); the trip spring ${f(LTS*1000,1)} × ${f(tsT*1000,2)} × 0.3 mm, ${f(KTIP,1)} N/m at its tip (Elinvar-type, 180 GPa)`);
}else{
  say(`the detent: ${f(DM.m*1e6,1)} mg, ${f(ID*1e9,3)} g·mm² about its flexure (its spring's middle), its centre of mass ${f(rCM*1000,2)} mm from it (the page's solids weighed with the detent at rest: blade, square, pipe, stone, horn, the gold spring and its screw, the spring's free half)`);
  say(`its spring: ${f(tD*1000,3)} thick, ${f(H.spring[0][0]*1000,2)} tall, ${f(lD*1000,2)} long (1436): ${f(KD*1e3,3)} mN·m a radian (steel, ${ESC.settings.EB} GPa: 200-210), preloaded ${f(MPRE*1e6,1)} µN·m, ${ESC.settings.W78} g at the stone (estimated: no Wempe source gives it), as if bent ${f(MPRE/KD/D,2)}° past its banking (${f(MPRE/KD*rJ*1000,2)} mm at the stone)`);
  say(`as drawn the foot, the spring and the blade lie on one line with the stone at its lock (escapement.js): a banking where the detent is drawn leaves the spring straight, no preload; the banking isn't drawn, nor its setting given (README, Unresolved): the preload is the banking's, set at assembly`);
  say(`the wheel is free at ${f(DREL/D,3)}° of the detent (lRel ${f(ESC.lRel*ESC.ES,3)} mm at the gold spring's tip, ${f(ESC.lRel*ESC.BL/ESC.LEN*ESC.ES,3)} at the stone); the gold spring ${f(LTS*1000,1)} × ${f(tsT*1000,2)} × ${ESC.settings.tsH} mm from its bending point, ${f(KTIP,1)} N/m at its tip (333 gold, ${ESC.settings.ET} GPa estimated), straight as makeEsc takes it (tripping.js --model wempe bends it along its drawn path)`);}
{let dl=0,dp=0,nl=0,np=0;for(let i=0;i<5001;i++){const th=ESC.TH0+i*ESC.DT,l=ESC.LI[i];if(l>0&&ESC.LI[i+1]>0){const s=at(S2,th);if(!isNaN(s)){dl=Math.max(dl,Math.abs(s-l));nl++;}}}
  for(let i=5000;i>0;i--){const th=ESC.TH0+i*ESC.DT,p=ESC.PS[i];if(p>0&&ESC.PS[i-1]>0){const s=at(Q2,th);if(!isNaN(s)){dp=Math.max(dp,Math.abs(s-p));np++;}}}
  chk(nl>100&&np>100&&dl<1e-4&&dp<1e-4,`the contacts are makeEsc's, worked out apart${WEMPE?` (the bevelled discharge stone on the gold spring's square end, ${f(TIPL*ESC.ES,2)} mm of it straight as drawn, by separating axes)`:''}: the detent's lift over the whole active swing (${nl} points, to ${f(dl*ESC.ES*1000,2)} µm) and ${TS_}'s bending (${np} points, to ${f(dp*ESC.ES*1000,2)} µm)`);}
/* the Wempe's stone on the tooth it let go: RDT against makeEsc's ride, through ESC.state at five drives (prog, the escaping tooth's place), where the ride holds the stone
   higher than the detent's fall (makeEsc's own: the jewel's table, then fallD from depart) */
if(RIDE){const tab=th=>{const g=(th-ESC.TH0)/ESC.DT,i=Math.floor(g);return i<0||i>=ESC.LI.length-1?0:ESC.LI[i]+(ESC.LI[i+1]-ESC.LI[i])*(g-i);};let dx=0,n=0,dS=0;
  for(const s of[0.6,0.8,1,1.25,1.6]){const am=ESC.ampAt(s),dp=ESC.depart(am);if(!(am>0)||!dp)continue;
    for(let q=dp.p;q<0.5;q+=1e-5){const z=ESC.state(q,am,s);if(!(z.prog>0&&z.prog<1))continue;const det=Math.max(z.th<ESC.thOff?tab(z.th):0,ESC.fallD(dp.d0,dp.v0,(q-dp.p)*T0)*LEN),my=rdA(-z.prog*P)*LEN;
      if(my>det+1e-6){n++;dx=Math.max(dx,Math.abs(z.lift-Math.max(det,my)));}}}
  for(let k=0;k+NR/400<=NR;k++)dS=Math.max(dS,Math.abs(RDT[k+NR/400]-RDT[k])*LEN);   /* makeEsc's table steps a 400th of a pitch and takes the higher side: its own error */
  chk(n>500&&dx<=dS+2e-4,`the stone on the tooth it has let go is makeEsc's ride, worked out apart (the tooth's outer edge as a radius over the angle behind its tip, the stone's outline sampled along its edges): ${n} points at five drives, to ${f(dx*ESC.ES*1000,1)} µm at the gold spring's tip, inside makeEsc's own step (its table takes the higher side of each 400th of a pitch: up to ${f(dS*ESC.ES*1000,1)} µm on the back's steep end); the stone on the land ${f(Math.max(...RDT)*LEN*ESC.ES*1000,1)} µm up at the tip (${f(100*Math.max(...RDT)*LEN/ESC.lRel,0)} % of the release)`);}
/* the integrator: with the escapement replaced by a kick at the dead point (Airy: no rate), the balance keeps a damped oscillator's -ζ²/2 */
const kick=Math.PI*C*ESC.A/I,ref=sim({ideal:true,kick,T:50,from:10}),zeta=C/(2*I*W0),theo=day(Math.sqrt(1-zeta*zeta)-1),ref2=sim({ideal:true,kick,T:50,from:10,hf:2e-6,hc:5e-5});
chk(Math.abs(ref.rate-theo)<0.01&&Math.abs(ref2.rate-ref.rate)<0.003,`the integrator: kicked at the dead point the balance keeps ${sg(ref.rate,3)} s a day, the damping's own (−ζ²/2: ${sg(theo,3)}; at half the steps ${sg(ref2.rate,3)})`);
flush();

say(WEMPE?`1. The model, beat by beat (its springs, the detent dead on its stop, its inertia where makeEsc takes it: flung off the stone's corner, onto the tooth it has let go)`:'1. The model, beat by beat (its springs, the detent all but massless and dead on its stop, as makeEsc has it)');
/* the Wempe's: makeEsc counts the detent's inertia (DEP, RW: its fall and its ride on the escaping tooth), so the integration's detent is the drawn one, dead on its stop; and the
   Wempe's balance settles slowly (TF 124 s: A² relaxes over 62 s), so its runs are longer */
const M1=WEMPE?{mode:'phys',eB:0,T:150,from:110}:{mode:'avg',T:70,from:40},MP2=WEMPE?{mode:'phys',T:150,from:110}:{mode:'phys',T:70,from:40};
const avg=sim(M1),avgH=sim({...M1,hf:2e-6}),own=avg.rate-ref.rate,RU=ESC.run;
const FB=WEMPE?'the detent leaves the discharge stone at':'the detent falls back at',FBt=FB,thOffM=WEMPE?ESC.depart(ESC.A).th:ESC.thOff;   /* the Wempe's leaves it at depart, flung off the corner */
/* makeEsc's ride's end (the Wempe's): where ESC.state's lift comes back to 0 after the release, at swing am and drive s */
const mkEnd=(am,s=1)=>{let last=null;for(let q=0;q<0.5;q+=2e-6){const z=ESC.state(q,am,s);if(z.lift>0&&z.prog>0)last=z.th;}return last;};
say(`makeEsc: the swing ${f(ESC.A/D,1)}°, the tooth lands on the impulse ${JW_} ${f((RU.land-ESC.thRel)/D,1)}° after the release, ${FB} ${f(thOffM/D,1)}°, the escapement's own rate ${sg(RU.own)} s a day`);
say(`in time:  the swing ${f(avg.A,1)}°, the tooth lands ${f(avg.land-avg.rel,1)}° after the release, ${FBt} ${f(avg.off,1)}°, the escapement's own rate ${sg(own)} s a day (at half the step ${sg(avgH.rate-ref.rate)})`);
if(RIDE){const e=mkEnd(ESC.A)/D;say(`the stone, fallen onto the land of the tooth it has just released at ${f(avg.rOn,2)}° (the wheel slow to get it out from under: makeEsc's ride), rides it down its back and is on its banking at ${f(avg.home,2)}° (makeEsc's state: off the tooth at ${f(e,2)}°), ${f(avg.land-avg.home,1)}° of the balance before the tooth lands on the impulse stone`);
  chk(Math.abs(avg.home-e)<1,`the stone rides the escaping tooth as the model has it: home within 1° of makeEsc's (${sg(avg.home-e,2)}°)`);}
chk(avg.trips===0&&avg.beats>100,`it runs, beat by beat: ${avg.beats} beats, no tooth lost or gained`);
chk(Math.abs(avg.A-ESC.A/D)<3,`the swing within 3° of the model's: ${sg(avg.A-ESC.A/D,1)}° (the wheel's chase from rest, its strike on the jewel and the springs as the model counts them)`);
chk(Math.abs(avg.land-avg.rel-(RU.land-ESC.thRel)/D)<1.5,`the tooth lands where the model has it, within 1.5° of the balance`);
chk(Math.abs(avg.off-thOffM/D)<1,`${WEMPE?'the detent leaves the discharge stone':'the detent falls back'} where the model has it, within 1°`);
chk(Math.abs(own-RU.own)<0.3,`the escapement's own rate within 0.3 s a day of Airy's sum: ${sg(own-RU.own)} s a day apart`);
/* the drive over its range: the Hamilton's manual's 95-111 %; the Wempe's 05 06_20 over the wind, its hairspring's own isochronism (HS, in makeEsc's rate) taken out: the hairspring here is linear */
{const[s0,s1]=WEMPE?(()=>{const P8=WL.WPHYS;let a=9,b=0;for(let h=0;h<=P8.MF*P8.HPT;h+=0.25){const x=P8.drv(h/P8.HPT);a=Math.min(a,x);b=Math.max(b,x);}return[a,b];})():[0.95,1.11];
  const lo=sim({...M1,s:s0,A:ESC.ampAt(s0)/D}),hi=sim({...M1,s:s1,A:ESC.ampAt(s1)/D}),pa=x=>ESC.rateAt(ESC.ampAt(x),x);
  const dT=hi.rate-lo.rate,dH=WEMPE?ESC.settings.HS*(ESC.ampAt(s1)-ESC.ampAt(s0))/D/10:0,dM=pa(s1)-pa(s0)-dH,sl=dT/(hi.A-lo.A)*10;
  say(`the drive ${f(100*s0,0)} % → ${f(100*s1,0)} %${WEMPE?' (05 06_20 over the wind)':''}: the model ${f(ESC.ampAt(s0)/D,0)}° → ${f(ESC.ampAt(s1)/D,0)}°, the rate ${sg(dM)} s a day${WEMPE?` (the escapement's; with the drawn hairspring's ${sg(dH)}, ${sg(dM+dH)})`:''}; in time ${f(lo.A,0)}° → ${f(hi.A,0)}°, ${sg(dT)} s a day (${sg(sl,3)} s a day for each 10° of swing)`);
  chk(Math.abs(dT-dM)<0.1,`isochronism (the rate's change over the ${WEMPE?'wind\'s':'manual\'s'} range of swing) within 0.1 s a day of the model's`);
  /* the Wempe's: the escapement with its drawn hairspring's own isochronism (HS), the chronometer as made (since 15 October 2026, when the masses' height made its balance 10 % heavier and its
     swing 7° smaller: the escapement alone +0.51 s a day for each 10°, its hairspring −0.66); the Hamilton's spring is linear, its escapement the whole */
  const slC=WEMPE?(dT+dH)/(hi.A-lo.A)*10:sl;
  chk(Math.abs(slC)<0.5,`and small (under 0.5 s a day for each 10° of swing${WEMPE?`, the escapement ${sg(sl,3)} with its drawn hairspring's ${sg(ESC.settings.HS,3)}: ${sg(slC,3)}`:''}): what the fusee keeps even, the escapement doesn't undo`);}
flush();

say('2. The detent as a body: its inertia, bouncing on its stop');
const ph=sim(MP2),ownP=ph.rate-ref.rate;
say(`the swing ${f(ph.A,1)}°, the escapement's own rate ${sg(ownP)} s a day; the tooth lands ${f(ph.land-ph.rel,1)}° after the release${WEMPE?`, the balance at ${f(ph.land,2)}°: the impulse stone's face ${f(ph.land+PHI0,1)}° from the line of centres (makeEsc's ${f(RU.land/D+PHI0,1)}°; 05 04_1's layout draws the tooth falling on it at ${f(WL.WESC.ESC.PHI_C,1)}°, where the impulse begins, as if the wheel were there at once)`:''}`);
chk(Math.abs(ph.A-ESC.A/D)<3&&Math.abs(ownP-RU.own)<0.3,`the detent's own inertia and bounce change little: the swing ${sg(ph.A-ESC.A/D,1)}°, the rate ${sg(ownP-RU.own)} s a day against the model`);
/* the detent's fall as makeEsc shows it (ESC.state: off the jewel where its end runs away faster than the detent can follow, then a preloaded spring and mass in closed
   form, hopping on its stop; caught again by the jewel's end if it falls onto it): where it leaves the jewel for the last time and first lands, against the integration's,
   at the integration's swing */
if(!WEMPE){const am=ph.A*D,fD=ESC.depart(am),land=fD.land/D;
  say(`the detent leaves the discharge jewel for the last time at ${f(ph.offF,2)}°${Math.abs(ph.off-ph.offF)>0.05?` (first at its acting corner, falling back onto its end)`:''} and first lands on its stop at ${f(ph.home,2)}° (makeEsc's fall: ${f(fD.th/D,2)}° and ${f(land,2)}°; home for good at ${f(ESC.homeAt(am)/D,2)}°)`);
  chk(Math.abs(ph.offF-fD.th/D)<0.5&&Math.abs(ph.home-land)<0.5,`the detent's fall back to its stop in the model is the integration's, within 0.5° of the balance (it went home in one step at ${f(ESC.thOff/D,1)}° until 11 October 2026)`);}
else{/* the Wempe's: off the stone's acting corner, flung up, onto the escaping tooth's land, down its back onto the banking. makeEsc's (ESC.state at the integration's swing): its fall from
  depart (the stone's speed it came up with, since 15 October 2026), where the ride first holds it, where the ride lets it down */
  const am=ph.A*D,fD=ESC.depart(am),tab=th=>{const g=(th-ESC.TH0)/ESC.DT,i=Math.floor(g);return i<0||i>=ESC.LI.length-1?0:ESC.LI[i]+(ESC.LI[i+1]-ESC.LI[i])*(g-i);};
  let on=null;for(let q=fD.p;q<0.5&&on==null;q+=2e-6){const z=ESC.state(q,am,1),fl=Math.max(z.th<ESC.thOff?tab(z.th):0,ESC.fallD(fD.d0,fD.v0,(q-fD.p)*T0)*LEN);if(z.lift>fl+1e-9)on=z.th/D;}const e=mkEnd(am)/D;
  say(`the detent leaves the discharge stone's acting corner at ${f(ph.offF,2)}°, flung up (${f(ESC.LEN*fD.v0*ES*1000,0)} mm/s at the gold spring's tip), lands on the land of the tooth it let go at ${f(ph.rOn,2)}°, ${ph.rN>1.5?`hops down its back (${f(ph.rN,0)} landings a beat) `:''}and comes off it onto its banking at ${f(ph.home,2)}° (makeEsc: ${f(fD.th/D,2)}°, ${f(on,2)}° and ${f(e,2)}°; on its banking for good at ${f(ESC.homeAt(am)/D,2)}° without the tooth)`);
  chk(Math.abs(ph.offF-fD.th/D)<0.5&&Math.abs(ph.rOn-on)<0.5&&Math.abs(ph.home-e)<0.5,`the detent's fall in the model is the integration's, within 0.5° of the balance: off the stone, onto the tooth, home (makeEsc's fall took the stone's speed across its corner until 15 October 2026, and landed on the tooth 1.2° early)`);
  chk(Math.abs(ph.land-ph.rel-(RU.land-ESC.thRel)/D)<1.5,`with the detent's inertia and the stone's friction on the tooth's land (μ ${ESC.settings.MU}, against the wheel's chase), the tooth lands on the impulse stone where the model has it, within 1.5° of the balance: ${sg(ph.land-ph.rel-(RU.land-ESC.thRel)/D,2)}°`);}
if(WEMPE){/* the stone's friction on the escaping tooth (estimated, makeEsc's MU): where the tooth lands and the swing over its range */
  const L=[0,0.10,0.20].map(m=>[m,sim({...MP2,muR:m})]);say(`the stone's friction on the tooth it let go, μ ${L.map(([m])=>m.toFixed(2)).join(', ')} (${ESC.settings.MU} taken): the tooth lands with the impulse stone's face ${L.map(([,r])=>f(r.land+PHI0,1)+'°').join(', ')} from the line of centres, the swing ${L.map(([,r])=>f(r.A,1)+'°').join(', ')}`);}
chk(ph.trips===0&&ph.beats>100&&ph.margin>0,`no tooth gets past the stone: ${ph.beats} beats; the detent is back on its stop ${f(1000*ph.margin,2)} ms before the next tooth reaches it, still ${f(100*ph.liftAt,1)} % lifted as it arrives`);
const sweep=[];
for(const[nm,o]of[['spring half as stiff',{kD:0.5}],['spring twice as stiff',{kD:2}],[`spring 0.06 mm thick (${f((0.06/(tD*1000))**3,2)}× as stiff)`,{kD:(0.06/(tD*1000))**3}],['preload half',{pre:0.5}],['preload 1.5×',{pre:1.5}],
  ['detent twice its inertia',{dI:2}],['bouncy stop (restitution 0.7)',{eB:0.7}],['dead stop (restitution 0)',{eB:0}],['the train 1.5× its inertia',{J:1.5}]]){
  const r=sim({mode:'phys',T:20,from:10,...o});sweep.push([nm,r]);
  say(`  ${nm.padEnd(38)} ${f(r.A,0)}°, trips ${r.trips}, back ${f(1000*r.margin,2)} ms before the tooth, ${f(100*r.liftAt,0)} % lifted as it arrives`);}
chk(sweep.every(([,r])=>r.trips===0&&r.margin>0),`over all of these the detent is home before the next tooth: what brings it back is the preload ${WEMPE?'the banking sets':'Op. 78 sets'}, not the spring's thickness`);
{const ok=m=>{const r=sim({mode:'phys',T:8,from:4,pre:m});return r.trips===0&&r.beats>8;};
  if(ok(0))say(WEMPE?`with no preload at all (the banking where the detent is drawn, the spring straight) the spring's own stiffness still brings the detent home in time: the preload is for the locking's safety against knocks (below), not for the return`:`with no preload at all the spring's own stiffness still brings the detent home in time: Op. 78's preload is for the locking's safety against knocks (below), not for the return`);
  else{let lo=1e-3,hi=1;for(let i=0;i<8;i++){const m=Math.sqrt(lo*hi);ok(m)?hi=m:lo=m;}say(WEMPE?`the preload could fall to about ${f(100*hi,1)} % of the estimated ${ESC.settings.W78} g (${f(hi*MPRE/(G0*rJ)*1e6,0)} mg at the stone) before a tooth gets past`:`the preload could fall to about ${f(100*hi,1)} % of Op. 78's (Op. 78's weight ${f((hi*MPRE+KD*ESC.th78)/(G0*rJ)*1e6,0)} mg for the same 0.005 in) before a tooth gets past`);}}
flush();
if(quick){if(fail)process.exitCode=1;return;}

say('3. Starting, the least drive, knocks');
{const TW=WEMPE?0.6*ESC.ampAt(1)/D:67,r=sim({mode:'phys',A:TW,T:240,from:230}),am=r.amps,tgt=r.A;let tS=null;for(let i=0;i<am.length;i++)if(Math.abs(am[i]/D-tgt)<2){tS=i*T0/2;break;}   /* the Wempe's Twist: 0.6 of the running swing (app.js; estimated, the 6MX's "light jerk") */
  say(`started by Twist (${WEMPE?`${f(TW,0)}°, the page's: 0.6 of the running swing, estimated`:`67°, the page's from rest: box.js TWIST`}), the swing comes within 2° of its ${f(tgt,0)}° in ${tS==null?'(never)':f(tS,1)+' s'} (the averaged model's exp(-2t/TF): ${f(-TF/2*Math.log(((tgt-2)**2-tgt**2)/((WEMPE?TW:160)**2-tgt**2)),1)} s)`);}
{/* started just above where the escapement unlocks: a drive too weak lets the swing fall under it within a few seconds (TF ln(70/50)) and the beats stop */
  /* the Wempe's balance runs down slowly (TF 124 s) and needs 46°: started 8° above it, 60 s (it would fall under it in about 20 s) */
  const[LA,LT]=WEMPE?[ESC.AMIN/D+8,60]:[70,30];let lo=0.02,hi=1,r=null;for(let i=0;i<8;i++){const m=(lo+hi)/2,q=sim({mode:'phys',s:m,A:LA,T:LT,from:LT-10});if(q.lastBeat>LT-2){hi=m;r=q;}else lo=m;}
  const am=(()=>{let a=0.01,b=1;for(let i=0;i<40;i++){const m=(a+b)/2;ESC.ampAt(m)<ESC.AMIN?a=m:b=m;}return b;})();
  say(`the least drive that keeps it going: ${f(100*hi,0)} % of the calibrated torque, the balance then swinging about ${f(r.A,0)}° (the averaged model: ${f(100*am,0)} %, at its AMIN ${f(ESC.AMIN/D,0)}°)${WEMPE&&r.A<ESC.AMIN/D?`: under AMIN the impulse stone, turning back with the tooth still on it, carries it out of the teeth's path and lets it run on to the locking stone, a tooth a swing all the same, so in time the least swing is the one that passes the gold spring (${f(-ESC.thPass/D,1)}°), not the impulse's end (makeEsc's AMIN asks it to finish)`:''}`);
  chk(Math.abs(ph.pass-ESC.thPass/D)<1,`${TS_} comes clear on the return where the model has it (${f(ph.pass,1)}°, the model ${f(ESC.thPass/D,1)}°), so ${WEMPE?`the least swing that keeps it going is that pass, ${f(-ESC.thPass/D,0)}° (makeEsc's AMIN ${f(ESC.AMIN/D,0)}°, above)`:`the least swing that keeps it going is the model's AMIN, ${f(ESC.AMIN/D,0)}°`}: far below any swing it runs at`);
  }
/* the train held with no torque (run down): the balance swings free, but while it carries the discharge jewel back past the trip spring it still lifts the detent and bends
   the trip spring every oscillation; makeEsc's freeStep (app.js's run-down) against the integration */
{const A0=150,r=sim({mode:'phys',s:0,A:A0,T:60,from:50}),at=t=>{let i=r.ampT.findIndex(x=>x>=t);if(i<0)i=r.ampT.length-1;return r.amps.slice(Math.max(0,i-1),i+1).reduce((a,b)=>a+b,0)/Math.min(2,i+1)/D;};
  const m=t=>ESC.freeStep(A0*D,t)/D,ts=[5,10,20,30,45],dev=Math.max(...ts.map(t=>Math.abs(at(t)-m(t))));
  say(`run down from ${A0}° with the train held: ${ts.map(t=>`${t} s ${f(at(t),1)}° (model ${f(m(t),1)}°, viscous alone ${f(A0*Math.exp(-t/TF),1)}°)`).join(', ')}`);
  chk(dev<2,`the held balance runs down as makeEsc's freeStep has it, within 2° (${f(dev,2)}°): the springs take ${f(ESC.EHd(150*D),4)}-${f(ESC.EHd(ESC.AH+1e-3),4)} k an oscillation (the drawn detent leaving the jewel still moving; ${f(ESC.EH,4)} for a massless one) down to ${f(ESC.AH/D,1)}°, the air and pivots the rest`);}
const pulse=(t1,dur,fn)=>tt=>{const u=(tt-t1)/dur;return u>0&&u<1?fn(Math.sin(Math.PI*u)):{al:0,ax:0,ay:0};};
const base=sim({mode:'phys',A:215,T:4,from:3});
const upset=r=>r.trips>0||Math.abs(r.beats-base.beats)>0;
/* a twist about the staff: a half-sine of angular acceleration 2 ms long at the worst of six phases of the swing */
{const knock=(dw,p)=>{const dur=0.002,t1=1.5+p*T0;return sim({mode:'phys',A:215,T:4,from:3,ext:pulse(t1,dur,x=>({al:dw*Math.PI/(2*dur)*x,ax:0,ay:0})),extFine:tt=>tt>t1-0.005&&tt<t1+dur+0.005});};
  const worst=dw=>{for(const p of[0,1/6,2/6,3/6,4/6,5/6])for(const s of[1,-1]){const r=knock(s*dw,p);if(upset(r))return r;}return null;};
  let lo=0,hi=60;for(let i=0;i<7;i++){const m=(lo+hi)/2;worst(m)?hi=m:lo=m;}const r=worst(hi);
  say(`a twist about the staff upsets it at about ${f(hi,1)} rad/s in 2 ms (${f(hi/(W0*ph.A*D),2)} of the balance's top speed): ${r&&r.trips?'a tooth escapes':r&&r.beats>base.beats?'it gains a beat':'it loses beats'}`);
  }
/* a swing past a full turn: the discharge jewel comes round to the trip spring again (makeEsc's TRIP) and, far enough past, unlocks a second time in the swing */
{const sFor=A=>{let lo=0.5,hi=6;for(let i=0;i<40;i++){const m=(lo+hi)/2;ESC.ampAt(m)<A*D?lo=m:hi=m;}return(lo+hi)/2;},at=A=>sim({mode:'phys',s:sFor(A),A,T:3,from:1.5}),lo=at(WEMPE?Math.round(ESC.TRIP/D-15):330),hi=at(WEMPE?Math.round(ESC.TRIP/D+(ESC.thRel-ESC.TH0-ESC.LI.findIndex(x=>x>0)*ESC.DT)/D+4):345);   /* the Wempe's TRIP 348°: 15° short of it, and past it by the lock and 4° */
  chk(lo.trips===0&&hi.twice>0,`driven to a ${f(lo.A,0)}° swing it keeps one unlocking a swing; to ${f(hi.A,0)}° the jewel, come round past makeEsc's TRIP (${f(ESC.TRIP/D,0)}°), unlocks again in the same swing, a trip each time (${hi.twice} in ${hi.beats} beats: counted as beats until 12 October 2026)`);}
/* a blow across the plate: the balance and wheels are poised, the detent is not: m r × a lifts it, worst at right angles to its centre of mass */
{const ang=Math.atan2(DM.my,DM.mx)+Math.PI/2,ux=Math.cos(ang),uy=Math.sin(ang),gS=MPRE/(DM.m*rCM*G0),gR=(MPRE+KD*DREL+TAUE*CDR/DREL)/(DM.m*rCM*G0);
  for(const dur of[0.0005,0.003]){const blow=(g,p,s)=>{const t1=1.5+p*T0,a=s*g*G0;return sim({mode:'phys',A:215,T:4,from:3,ext:pulse(t1,dur,x=>({al:0,ax:a*x*ux,ay:a*x*uy})),extFine:tt=>tt>t1-0.005&&tt<t1+dur+0.02});};
    const bad=g=>{for(const p of[0.1,0.35,0.6,0.85])for(const s of[1,-1])if(upset(blow(g,p,s)))return true;return false;};
    let lo=gS/4,hi=gS*20;for(let i=0;i<7;i++){const m=Math.sqrt(lo*hi);bad(m)?hi=m:lo=m;}
    say(`a blow across the plate lasting ${f(dur*1000,1)} ms lets a tooth go at about ${f(hi,0)} g (a steady push lifts the detent off its stop at ${f(gS,0)} g and frees the wheel at ${f(gR,0)} g)`);
    if(WEMPE){/* as drawn, the banking where the detent is drawn: no preload, the tooth's draw and the spring all that hold the lock */
      const b0=g=>{for(const p of[0.1,0.35,0.6,0.85])for(const s of[1,-1]){const t1=1.5+p*T0,a=s*g*G0;if(upset(sim({mode:'phys',pre:0,A:215,T:4,from:3,ext:pulse(t1,dur,x=>({al:0,ax:a*x*ux,ay:a*x*uy})),extFine:tt=>tt>t1-0.005&&tt<t1+dur+0.02})))return true;}return false;};
      let l0=0.2,h0=gR*20;for(let i=0;i<8;i++){const m=Math.sqrt(l0*h0);b0(m)?h0=m:l0=m;}
      say(`  with no preload (the banking where the detent is drawn) about ${f(h0,0)} g (frees the wheel steadily at ${f((KD*DREL+TAUE*CDR/DREL)/(DM.m*rCM*G0),0)} g)`);}
}}
flush();

say('4. At sea (gimballed, so the staff stays upright: yaw turns the case about it, a roll swings it sideways)');
{const calm=sim({mode:'phys',A:215,T:110,from:20}),ang=Math.atan2(DM.my,DM.mx)+Math.PI/2,res=[];
  for(const[nm,Ts,yaw,lat]of[['yaw ±3° over 8 s',8,3,0],['yaw ±10° over 8 s',8,10,0],['sideways ±0.1 g over 10 s',10,0,0.1],['heavy weather: yaw ±10°, sideways ±0.3 g, 8 s',8,10,0.3]]){
    const w=TAU/Ts,r=sim({mode:'phys',A:215,T:110,from:20,ext:tt=>({al:-yaw*D*w*w*Math.sin(w*tt),ax:lat*G0*Math.sin(w*tt)*Math.cos(ang),ay:lat*G0*Math.sin(w*tt)*Math.sin(ang)})});
    res.push(r.rate-calm.rate);say(`  ${nm.padEnd(46)} the swing ${f(r.A,1)}°, the rate ${sg(r.rate-calm.rate,3)} s a day against still water, ${r.trips} trips`);}
  chk(res.every(x=>Math.abs(x)<0.2),`the ship's motion moves the rate by under 0.2 s a day: the balance is poised and the gimbals keep the staff upright`);
}
flush();
if(fail)process.exitCode=1;
