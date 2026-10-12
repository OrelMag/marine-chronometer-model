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
const fs=require('fs'),path=require('path');
const {build}=require('./escapement.js'),ESC=build().ESC;
const rd=f=>fs.readFileSync(path.join(__dirname,f),'utf8'),mv=rd('../js/movement.js'),phys=rd('physics.js');
const num=(re,s,what)=>{const m=re.exec(s);if(!m)throw Error('not found: '+what);return+m[1];};
const D=Math.PI/180,TAU=2*Math.PI,G0=9.80665,ES=ESC.ES/1000,day=x=>86400*x;   /* ES: the unit frame's length (the escape wheel's radius) in metres */

/* ---------- the bodies ---------- */
const I=num(/const I=([\d.e-]+),k=/,phys,'the balance (physics.js)'),T0=ESC.T,W0=TAU/T0,K=I*W0*W0;   /* Table II's balance; the hairspring's stiffness for 0.5 s */
const TF=ESC.settings.TF,C=2*I/TF;   /* the balance's damping, viscous, from the free run-down TF (physics.js: inside what the parts give and the budget needs) */
const JE=num(/const J=([\d.e-]+);/,phys,'the escape wheel\'s inertia (physics.js)');
/* the fourth wheel turns with the escape wheel through its pinion (the drive keeps the mesh closed), so its inertia counts, reflected by (10/75)²: a brass
   disc of the drawn module, teeth and thickness, 0.7 of it left by the spokes (estimated); the third wheel, reflected again by (10/80)², is negligible */
const TR=Function('return '+/TRAIN=(\{[^}]*\})/.exec(mv)[1])(),M4=0.2457,r4=M4*TR.fw/2/1000,J4=0.7*0.5*8500*Math.PI*r4**4*0.9e-3,JT=JE+J4*(TR.ep/TR.fw)**2;
const TAUE=ESC.run.cl.w*K;   /* the escape wheel's torque the model is calibrated at (255°): physics.js's budget checks the train gives it */
/* the detent: its pieces as movement.js draws them (poly(R.det, piece, bottom, top, material)), their plan ESC.pieces about the point of flexure Ft;
   beryllium copper (C17200, 8.25 g/cm³), the locking stone ruby (3.98), the trip spring Elinvar-type (8.15) 7.9 mm long, tsT thick and 0.3 deep (movement.js) */
const RHO={Cu:8250,ruby:3980,El:8150},Ft=ESC.Ft,H={};
for(const m of mv.matchAll(/poly\(R\.det,'(\w+)',(-?[\d.]+),(-?[\d.]+),(\w+(?:\.\w+)?)/g))(H[m[1]]=H[m[1]]||[]).push([(+m[3]-+m[2])/1000,/ruby/.test(m[4])?'ruby':'Cu']);
{const m=/poly\(R\.det,\(\)=>\{const b=E\.pieces\.block[\s\S]*?\},(-?[\d.]+),(-?[\d.]+),Cu/.exec(mv);if(!m)throw Error('not found: the jewel block (movement.js)');H.block=[[(+m[2]-+m[1])/1000,'Cu']];}
for(const k of['spring','cross','blade','block','arm','horn','bracket','stone'])if(!H[k])throw Error('not found in movement.js: the detent\'s '+k);
const polyM=(pts,h,rho)=>{let A=0,cx=0,cy=0,J0=0;for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],x0=(a.x-Ft.x)*ES,y0=(a.y-Ft.y)*ES,x1=(b.x-Ft.x)*ES,y1=(b.y-Ft.y)*ES,c=x0*y1-x1*y0;
  A+=c/2;cx+=(x0+x1)*c/6;cy+=(y0+y1)*c/6;J0+=c*(x0*x0+x0*x1+x1*x1+y0*y0+y0*y1+y1*y1)/12;}const s=Math.sign(A)*rho*h;return{m:A*s,mx:cx*s,my:cy*s,I:J0*s};};
const DM={m:0,mx:0,my:0,I:0},add=(q,f=1)=>{for(const k in DM)DM[k]+=f*q[k];};
for(const[k,ls]of Object.entries(H))for(const[h,mat]of ls)add(polyM(ESC.pieces[k],h,RHO[mat]));
{const hB=H.block[0][0],n=24,disc=[...Array(n)].map((_,i)=>({x:ESC.Jc.x+ESC.rJ*Math.cos(TAU*i/n),y:ESC.Jc.y+ESC.rJ*Math.sin(TAU*i/n)}));add(polyM(disc,hB,RHO.Cu),-1);}   /* the block's hole for the stone */
const P0=ESC.Ps0,PT=ESC.Pt,tsT=ESC.settings.tsT/1000,LTS=Math.hypot(PT.x-P0.x,PT.y-P0.y)*ES;
{const a={x:(P0.x-Ft.x)*ES,y:(P0.y-Ft.y)*ES},b={x:(PT.x-Ft.x)*ES,y:(PT.y-Ft.y)*ES},m=RHO.El*LTS*tsT*0.3e-3;add({m,mx:m*(a.x+b.x)/2,my:m*(a.y+b.y)/2,I:m*(a.x*a.x+a.x*b.x+b.x*b.x+a.y*a.y+a.y*b.y+b.y*b.y)/3});}
const ID=DM.I,rCM=Math.hypot(DM.mx,DM.my)/DM.m;
/* its spring: two strips (heights H.spring) of the drawn thickness and length, bending about Ft; a rigid body on a short flexure turns about its root with
   stiffness E I / l. E 125-131 GPa for hardened beryllium copper; 128 taken. Preload: Op. 78, a 0.770 g weight on the locking jewel just parts the spring
   from its stop button */
const SP=ESC.pieces.spring,tD=(Math.max(...SP.map(p=>-(p.x-Ft.x)*ESC.dirB.y+(p.y-Ft.y)*ESC.dirB.x))-Math.min(...SP.map(p=>-(p.x-Ft.x)*ESC.dirB.y+(p.y-Ft.y)*ESC.dirB.x)))*ES,
  lD=(Math.max(...SP.map(p=>(p.x-Ft.x)*ESC.dirB.x+(p.y-Ft.y)*ESC.dirB.y))-Math.min(...SP.map(p=>(p.x-Ft.x)*ESC.dirB.x+(p.y-Ft.y)*ESC.dirB.y)))*ES;
const EBC=128e9,KD=EBC*H.spring.reduce((s,[h])=>s+h*tD**3/12,0)/lD,rJ=Math.hypot(ESC.Jc.x-Ft.x,ESC.Jc.y-Ft.y)*ES,MPRE=0.770e-3*G0*rJ;
/* the trip spring, a cantilever 7.9 mm long, Elinvar-type (180 GPa, as hairspring.js), bent at its tip by the discharge jewel on the return swing */
const KTIP=3*180e9*(0.3e-3*tsT**3/12)/LTS**3;
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
const mk=()=>new Float64Array(NTB).fill(NaN),G=mk(),S1=mk(),S2=mk(),Q1=mk(),Q2=mk(),mB={x:-ESC.nB.x,y:-ESC.nB.y};
for(let i=0;i<NTB;i++){const th=-Math.PI+i*HT,b=ESC.bite(th);if(b>-1e8)G[i]=b-ESC.t0;const a=slab(th,ESC.nH);if(a){S1[i]=a[0];S2[i]=a[1];}const c=slab(th,mB);if(c){Q1[i]=c[0];Q2[i]=c[1];}}
const dif=(T)=>{const d=mk();for(let i=1;i<NTB-1;i++){const a=T[i-1],b=T[i],c=T[i+1];d[i]=!isNaN(a)&&!isNaN(c)?(c-a)/(2*HT):!isNaN(b)&&!isNaN(c)?(c-b)/HT:!isNaN(a)&&!isNaN(b)?(b-a)/HT:NaN;}return d;};
const G1=dif(G),G2=dif(G1),S21=dif(S2),S22=dif(S21),Q21=dif(Q2);
const at=(T,x)=>{const f=ti(x),i=Math.floor(f),a=T[i],b=T[i+1];if(isNaN(a))return isNaN(b)||f-i<0.5?NaN:b;if(isNaN(b))return f-i>0.5?NaN:a;return a+(b-a)*(f-i);};

/* ---------- the integration ---------- */
/* one run. o: drive s (the escape wheel's torque, times the calibrated), mode 'avg' (the model's springs, the detent all but massless and dead on its stop,
   as makeEsc takes it) or 'phys' (the same springs, the detent's own inertia, bouncing on its stop), kD/kP
   (their stiffness, times), pre (the preload, times), dI (the detent's inertia, times), J (the wheel and train's), eB (the detent's restitution on its stop
   button: estimated 0.3, metal on a steel button, its range tried below), eW (the tooth on the impulse jewel: plastic), A (start, degrees), T, from (when
   the rate is measured from), ideal (no escapement: a kick at the dead point, which by Airy changes no rate, to measure the damping's own share), ext(t):
   the case's angular acceleration al (rad/s²) about the staff and its linear acceleration ax, ay (m/s², unit frame); TF (the balance's run-down, s); bE (degrees: out of beat, the hairspring at rest with the balance that far from the escapement's zero);
   trace: an array that collects each event as [t, event, θ°, θ', lift/release lift, detent mode, wheel mode, wheel/pitch] (events: 4 the jewel meets the passing spring, 2 the wheel
   released, 5 the detent leaves the jewel, 3 it lands on its stop, 0 the tooth strikes the impulse jewel, 1 the next tooth locks; on the return swing 8 the jewel
   meets the trip spring, 9 the spring comes clear: acoustic.py times them against recordings) */
function sim(o={}){
  /* o.split [air, endstone, rest]: the balance's damping in its parts (physics.js's shares of the loss at 255 deg, summing to 1), not all viscous: the air on the screws
     and arm a drag in the square of the speed (its loss a swing in A³), the staff's flat end on its endstone a constant friction (in A), the rest (the spring's material,
     its side friction) viscous (in A²); together they lose at 255 deg what TF's viscous damping does, so the running swing and rate hold, and the start and run-down change */
  const sp=o.split,dE=2*Math.PI*(0.5*I*W0*W0*(255*D)**2)/(Math.PI*(o.TF??TF)/T0),Ca=sp?3*sp[0]*dE/(8*W0*W0*(255*D)**3):0,Tc=sp?sp[1]*dE/(4*255*D):0;
  const s=o.s??1,C=sp?sp[2]*dE/(Math.PI*W0*(255*D)**2):2*I/(o.TF??TF),phys=(o.mode??'phys')==='phys',tauE=TAUE*s,J=JT*(o.J??1),eB=o.eB??(phys?0.3:0),eW=o.eW??0,ext=o.ext,T=o.T??80,from=o.from??40,ideal=!!o.ideal,bE=(o.bE??0)*D;
  const id=phys?ID*(o.dI??1):ID*1e-4,kr=KD*(o.kD??1),pre=MPRE*(o.pre??1),kp=KTIP*ES*ES*(o.kP??1);
  const cd=2*Math.sqrt(kr*id)/(2*(o.Qd??100)),mDraw=tauE*CDR/DREL;   /* the detent's own damping (Q 100, estimated); the draw's resistance spread over the lift to release */
  const hf=o.hf??4e-6,hc=o.hc??1e-4;
  let t=0,th=-(o.A??ESC.A/D)*D,w=0,d=0,dv=0,ph=0,pv=0,wm=0,dm=0,pc=false,pp=0,passed=true;   /* wm: wheel locked 0, free 1, on the jewel 2; dm: detent on its stop 0, free 1, pushed 2 */
  if(o.phase!=null){th=(o.A??ESC.A/D)*D*Math.cos(TAU*o.phase);w=-(o.A??ESC.A/D)*D*W0*Math.sin(TAU*o.phase);}
  const st={pass:[],cross:[],beats:0,esc:0,caught:false,lastBeat:-1,trips:0,land:[],rel:[],off:[],offF:[],offTh:NaN,margin:[],liftAt:[],bounce:0,maxBack:0,lastBank:-1,lastOff:-1,bnc:0,home:[],stopAt:null,kicks:0,missed:0};
  const X={al:0,ax:0,ay:0};
  const lift=()=>(phys?DM.mx*X.ay-DM.my*X.ax:0)+id*X.al;   /* the case's acceleration as a moment lifting the detent: its unbalance about Ft (DM.mx, DM.my: m·r), and the yaw */
  let ddd=0,phd=0,lamD=0,lamW=0;
  /* accelerations for the current modes; sets ddd, phd (the slaved coordinates' too) and the contact forces lamD, lamW */
  const acc=(tt,th,w,d,dv,ph,pv)=>{
    if(ext){const e=ext(tt);X.al=e.al||0;X.ax=e.ax||0;X.ay=e.ay||0;}
    const Ml=lift(),draw=wm===0&&d>0?mDraw:0;
    let M=I,F=-K*(th-bE)-C*w-Ca*w*Math.abs(w)-Tc*Math.tanh(w/0.05)-I*X.al,h1=0,h2=0,g1=0,g2=0;
    if(pc){const p=at(Q2,th),q=at(Q21,th);if(!isNaN(p)&&!isNaN(q))F-=kp*p*q;}   /* the trip spring bent on the return, quasi-static */
    if(dm===2){h1=at(S21,th)/LEN;h2=at(S22,th)/LEN;if(isNaN(h1))h1=0;if(isNaN(h2))h2=0;M+=id*h1*h1;F+=-id*h1*h2*w*w+h1*(Ml-pre-kr*d-cd*h1*w-draw);}
    if(wm===2){g1=at(G1,th);g2=at(G2,th);if(isNaN(g1))g1=0;if(isNaN(g2))g2=0;M+=J*g1*g1;F+=-J*g1*g2*w*w+g1*(-tauE-J*X.al);}
    const a=F/M;
    if(dm===2){ddd=h2*w*w+h1*a;lamD=id*ddd-(Ml-pre-kr*d-cd*dv-draw);}else if(dm===1)ddd=(Ml-pre-kr*d-cd*dv-draw)/id;else ddd=0;
    if(wm===2){phd=g2*w*w+g1*a;lamW=J*phd+tauE+J*X.al;}else if(wm===1)phd=-tauE/J-X.al;else phd=0;
    return a;};
  const out=new Float64Array(6),R8=[1,1,1,1,1,1,1,1],y=new Float64Array(6),k1=new Float64Array(6),k2=new Float64Array(6),k3=new Float64Array(6),k4=new Float64Array(6),tmp=new Float64Array(6);
  const der=(tt,v,out)=>{const a=acc(tt,v[0],v[1],v[2],v[3],v[4],v[5]);out[0]=v[1];out[1]=a;out[2]=v[3];out[3]=ddd;out[4]=v[5];out[5]=phd;};
  const rk=(v,tt,h,out)=>{der(tt,v,k1);for(let i=0;i<6;i++)tmp[i]=v[i]+h/2*k1[i];der(tt+h/2,tmp,k2);for(let i=0;i<6;i++)tmp[i]=v[i]+h/2*k2[i];der(tt+h/2,tmp,k3);
    for(let i=0;i<6;i++)tmp[i]=v[i]+h*k3[i];der(tt+h,tmp,k4);for(let i=0;i<6;i++)out[i]=v[i]+h/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i]);
    if(dm===2){const h0=at(S2,out[0]);if(!isNaN(h0)){out[2]=h0/LEN;const h1=at(S21,out[0]);out[3]=(isNaN(h1)?0:h1/LEN)*out[1];}}
    if(wm===2){const g0=at(G,out[0]);if(!isNaN(g0)){out[4]=g0;const g1=at(G1,out[0]);out[5]=(isNaN(g1)?0:g1)*out[1];}}
    if(dm===0){out[2]=0;out[3]=0;}if(wm===0){out[4]=0;out[5]=0;}};
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
      if(dm===0)r[7]=pre+(wm===0?0:0)-lift()+1e-12;}
    return r;};
  const hit=(c,inv,e)=>-(1+e)*c/inv;   /* the impulse a contact takes: c the closing velocity along it, inv the sum of the inverse effective inertias */
  let A0=null,lastW=0,thM=0;const amps=[],ampT=[];
  const t1=T;let guard=0;
  while(t<t1){
    const tw=wrap(th),near=(tw>-0.8&&tw<0.55)||wm!==0||dm!==0||pc||(ext&&o.extFine&&o.extFine(t));
    let h=Math.min(near?hf:hc,t1-t);
    /* states an event can't catch because its threshold is already passed as the step begins (a blow that lifts the detent off its stop in one step) */
    if(!ideal){acc(t,th,w,d,dv,ph,pv);if(dm===0&&lift()>pre+(wm===0?0:0))dm=1;if(wm===0&&d>=DREL){wm=1;pv=0;st.rel.push(th/D);}}
    y[0]=th;y[1]=w;y[2]=d;y[3]=dv;y[4]=ph;y[5]=pv;
    const e0=evs(y,t).slice();rk(y,t,h,out);let e1=evs(out,t+h),hit_=-1;
    for(let i=0;i<8;i++)if(e0[i]>0&&e1[i]<=0){hit_=i;break;}
    if(hit_>=0){let lo=0,hi=h;for(let it=0;it<40;it++){const m=(lo+hi)/2;rk(y,t,m,out);const e=evs(out,t+m);let any=false;for(let i=0;i<8;i++)if(e0[i]>0&&e[i]<=0){any=true;break;}any?hi=m:lo=m;if(hi-lo<1e-11)break;}
      h=hi;rk(y,t,h,out);e1=evs(out,t+h);hit_=-1;for(let i=0;i<8;i++)if(e0[i]>0&&e1[i]<=0){hit_=i;break;}}
    const thO=th,wO=w;t+=h;th=out[0];w=out[1];d=out[2];dv=out[3];ph=out[4];pv=out[5];
    /* the rate: the return swing's dead point, interpolated */
    if(thO>0&&th<=0&&w<0)st.cross.push(t-h+h*thO/(thO-th));
    if(wO>0&&w<=0){amps.push(Math.abs(th));ampT.push(t);thM=th;}if(wO<0&&w>=0){amps.push(Math.abs(th));ampT.push(t);}
    if(ideal&&thO<0&&th>=0&&w>0){w+=o.kick;st.kicks++;}
    /* the trip spring: bent while the jewel holds its tip on the return swing; let go, its energy is lost */
    /* the trip spring, massless: once the jewel bends it on the return it stays on the jewel (on its face, then its end) while the jewel is in the way. The jewel
       is past it (passed: the next active swing can unlock) only if the tip comes clear while the return swing goes on; turned back first, the spring follows
       the jewel back and the detent stays on its stop (makeEsc's AMIN) */
    if(!ideal){const a=at(Q1,th),b=at(Q2,th);
      if(pc){if(!isNaN(b)&&b>0&&a<pp)pp=b;else{pc=false;pp=0;passed=w<0;if(passed)st.pass.push(th/D);if(o.trace)o.trace.push([t.toFixed(5),9,(th/D).toFixed(2),w.toFixed(2),'','','','']);}}
      else if(w<0&&!isNaN(b)&&b>0&&a<0){pc=true;pp=b;passed=false;if(o.trace)o.trace.push([t.toFixed(5),8,(th/D).toFixed(2),w.toFixed(2),'','','','']);}}   /* traced as 8 (the jewel meets the trip spring) and 9 (it comes clear): the return swing's clicks (acoustic.py) */
    if(ideal)continue;
    if(o.trace&&hit_>=0)o.trace.push([t.toFixed(5),hit_,(th/Math.PI*180).toFixed(2),(w).toFixed(2),(d/DREL).toFixed(3),dm,wm,(ph/P).toFixed(3)]);
    switch(hit_){
      case 0:{const g=at(G,th),g1=at(G1,th)||0,h1=dm===2?(at(S21,th)||0)/LEN:0,Mb=I+id*h1*h1,c=pv-g1*w,L=hit(c,1/J+g1*g1/Mb,eW);pv+=L/J;w-=L*g1/Mb;if(eW===0||Math.abs(pv-g1*w)<1e-6){wm=2;ph=g;pv=g1*w;}
        st.land.push(th/D);st.caught=true;break;}
      case 1:{const sl=d*LEN;if(sl<ESC.lRel){st.beats++;st.lastBeat=t;if(!st.caught)st.esc++;st.caught=false;st.liftAt.push(sl/ESC.lRel);if(st.lastBank>0)st.margin.push(t-st.lastBank);wm=0;ph=0;pv=0;}else{st.trips++;ph+=P;wm=1;}break;}
      case 2:{wm=1;pv=0;st.rel.push(th/D);break;}
      case 3:{if(st.lastBank<st.lastOff){st.lastBank=t;st.home.push(th/D);st.offF.push(st.offTh);}st.bnc++;dv=-eB*dv;d=0;if(eB===0||Math.abs(dv)<1e-3||2*id*Math.abs(dv)/(pre+1e-30)<4*hf){dm=0;dv=0;}break;}   /* rebounds too short to resolve (a ball's bounces) end on the stop */
      case 4:{const h1=(at(S21,th)||0)/LEN,g1=wm===2?(at(G1,th)||0):0,Mb=I+J*g1*g1,c=dv-h1*w,L=hit(c,1/id+h1*h1/Mb,0);dv+=L/id;w-=L*h1/Mb;dm=2;d=at(S2,th)/LEN;dv=h1*w;break;}
      case 5:{dm=1;st.off.push(th/D);st.lastOff=t;st.offTh=th/D;break;}
      case 6:{wm=1;break;}
      case 7:{dm=1;break;}}
    /* contacts whose surface ends (no bisection: a step's error) */
    if(dm===2&&isNaN(at(S2,th))){dm=1;st.off.push(th/D);st.lastOff=t;st.offTh=th/D;}
    if(wm===2&&(isNaN(at(G,th))||at(G,th)<=-P))wm=1;
    if(dm===2||wm===2){y[0]=th;y[1]=w;y[2]=d;y[3]=dv;y[4]=ph;y[5]=pv;acc(t,th,w,d,dv,ph,pv);if(dm===2&&lamD<-1e-12){dm=1;st.off.push(th/D);st.lastOff=t;st.offTh=th/D;}if(wm===2&&lamW<-1e-12)wm=1;}
    if(dm===1&&d<0){acc(t,th,w,0,0,ph,pv);if(dv<0&&eB>0&&Math.abs(dv)>1e-3&&2*id*Math.abs(dv)/(pre+1e-30)>=4*hf){d=0;dv=-eB*dv;}else if(lift()>pre){d=0;dv=Math.max(dv,0);}else{dm=0;d=0;dv=0;}}
    if(dm===1&&st.lastOff>st.lastBank)st.maxBack=Math.max(st.maxBack,d/DREL);
    if(++guard>5e8)throw Error('dynamics: runaway');
  }
  const c=st.cross.filter(x=>x>=from),n=c.length,Tm=n>1?(c[n-1]-c[0])/(n-1):NaN;
  const am=amps.slice(-8),A=am.length?am.reduce((a,b)=>a+b,0)/am.length/D:0;
  const mean=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:NaN,tail=a=>a.slice(Math.floor(a.length/2));
  return{A,rate:day(T0/Tm-1),n,beats:st.beats,trips:st.trips+st.esc,esc:st.esc,lastBeat:st.lastBeat,land:mean(tail(st.land)),rel:mean(tail(st.rel)),pass:mean(tail(st.pass)),off:mean(tail(st.off)),offF:mean(tail(st.offF)),margin:Math.min(...tail(st.margin)),
    liftAt:Math.max(...tail(st.liftAt),0),maxBack:st.maxBack,home:mean(tail(st.home)),amps,ampT,cross:st.cross,stopped:st.beats===0};
}
module.exports={sim,ESC,I,K,C,TF,JT,JE,J4,TAUE,ID,DM,rCM,KD,MPRE,KTIP,DREL,LEN,lD,tD,LTS,CDR,day,S2};
if(require.main!==module)return;

/* ---------- the report ---------- */
const PH=require('./physics.js'),quick=process.argv.includes('--quick'),rows=[];let fail=0;
const say=s=>rows.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;rows.push(`${ok?'  ok ':'  !! '} ${s}`);};
const f=(x,n=2)=>(+x).toFixed(n),sg=(x,n=2)=>(x>=0?'+':'−')+Math.abs(x).toFixed(n),t0=Date.now(),flush=()=>{console.log(rows.splice(0).join('\n'));console.log(`  (${f((Date.now()-t0)/1000,0)} s)`);};
say('The bodies');
say(`the balance ${I*1e9} g·mm² on k ${f(K*1e6,1)} µN·m a radian, damped as its free run-down TF ${TF} s (Q ${f(Math.PI*TF/T0,0)})`);
say(`the escape wheel ${f(JE*1e9,2)} g·mm² (physics.js) and the fourth wheel's reflected ${f(J4*(TR.ep/TR.fw)**2*1e9,2)} (estimated): ${f(JT*1e9,2)}; driven at ${f(TAUE*1e6,1)} µN·m, the torque the model is calibrated at`);
chk(Math.abs(JT*1e9-S.JW)<0.1&&Math.abs(ID*1e9-S.ID)<0.01&&Math.abs(KD/(ESC.KD*ESC.kB)-1)<0.01&&Math.abs(MPRE/(ESC.MP*ESC.kB)-1)<0.01&&Math.abs(KTIP*ES*ES/(ESC.KP*ESC.kB)-1)<0.01,`the model's bodies and springs (JW ${S.JW}, the detent's inertia ID ${S.ID}, its spring's ${f(ESC.KD*ESC.kB*1e3,3)} mN·m a radian and ${f(ESC.MP*ESC.kB*1e6,1)} µN·m, the trip spring's) are these, from the drawn parts`);
say(`the detent: ${f(DM.m*1e6,1)} mg, ${f(ID*1e9,3)} g·mm² about its flexure, its centre of mass ${f(rCM*1000,2)} mm from it (the drawn pieces, the trip spring with it)`);
say(`its spring: two strips ${H.spring.map(([h])=>f(h*1000,2)).join(' + ')} mm tall, ${f(tD*1000,3)} thick, ${f(lD*1000,2)} long: ${f(KD*1e3,3)} mN·m a radian (beryllium copper, 128 GPa), preloaded ${f(MPRE*1e6,1)} µN·m by Op. 78 (as if bent ${f(MPRE/KD/D,2)}° past its stop)`);
say(`the wheel is free at ${f(DREL/D,3)}° of the detent (lRel ${f(ESC.lRel*ESC.ES,3)} mm at the passing spring's tip); the trip spring ${f(LTS*1000,1)} × ${f(tsT*1000,2)} × 0.3 mm, ${f(KTIP,1)} N/m at its tip (Elinvar-type, 180 GPa)`);
{let dl=0,dp=0,nl=0,np=0;for(let i=0;i<5001;i++){const th=ESC.TH0+i*ESC.DT,l=ESC.LI[i];if(l>0&&ESC.LI[i+1]>0){const s=at(S2,th);if(!isNaN(s)){dl=Math.max(dl,Math.abs(s-l));nl++;}}}
  for(let i=5000;i>0;i--){const th=ESC.TH0+i*ESC.DT,p=ESC.PS[i];if(p>0&&ESC.PS[i-1]>0){const s=at(Q2,th);if(!isNaN(s)){dp=Math.max(dp,Math.abs(s-p));np++;}}}
  chk(nl>100&&np>100&&dl<1e-4&&dp<1e-4,`the contacts are makeEsc's, worked out apart: the detent's lift over the whole active swing (${nl} points, to ${f(dl*ESC.ES*1000,2)} µm) and the trip spring's bending (${np} points, to ${f(dp*ESC.ES*1000,2)} µm)`);}
/* the integrator: with the escapement replaced by a kick at the dead point (Airy: no rate), the balance keeps a damped oscillator's -ζ²/2 */
const kick=Math.PI*C*ESC.A/I,ref=sim({ideal:true,kick,T:50,from:10}),zeta=C/(2*I*W0),theo=day(Math.sqrt(1-zeta*zeta)-1),ref2=sim({ideal:true,kick,T:50,from:10,hf:2e-6,hc:5e-5});
chk(Math.abs(ref.rate-theo)<0.01&&Math.abs(ref2.rate-ref.rate)<0.003,`the integrator: kicked at the dead point the balance keeps ${sg(ref.rate,3)} s a day, the damping's own (−ζ²/2: ${sg(theo,3)}; at half the steps ${sg(ref2.rate,3)})`);
flush();

say('1. The model, beat by beat (its springs, the detent all but massless and dead on its stop, as makeEsc has it)');
const avg=sim({mode:'avg',T:70,from:40}),avgH=sim({mode:'avg',T:70,from:40,hf:2e-6}),own=avg.rate-ref.rate,RU=ESC.run;
say(`makeEsc: the swing ${f(ESC.A/D,1)}°, the tooth lands on the impulse jewel ${f((RU.land-ESC.thRel)/D,1)}° after the release, the detent falls back at ${f(ESC.thOff/D,1)}°, the escapement's own rate ${sg(RU.own)} s a day`);
say(`in time:  the swing ${f(avg.A,1)}°, the tooth lands ${f(avg.land-avg.rel,1)}° after the release, the detent falls back at ${f(avg.off,1)}°, the escapement's own rate ${sg(own)} s a day (at half the step ${sg(avgH.rate-ref.rate)})`);
chk(avg.trips===0&&avg.beats>100,`it runs, beat by beat: ${avg.beats} beats, no tooth lost or gained`);
chk(Math.abs(avg.A-ESC.A/D)<3,`the swing within 3° of the model's: ${sg(avg.A-ESC.A/D,1)}° (the wheel's chase from rest, its strike on the jewel and the springs as the model counts them)`);
chk(Math.abs(avg.land-avg.rel-(RU.land-ESC.thRel)/D)<1.5,`the tooth lands where the model has it, within 1.5° of the balance`);
chk(Math.abs(avg.off-ESC.thOff/D)<1,`the detent falls back where the model has it, within 1°`);
chk(Math.abs(own-RU.own)<0.3,`the escapement's own rate within 0.3 s a day of Airy's sum: ${sg(own-RU.own)} s a day apart`);
{const lo=sim({mode:'avg',s:0.95,A:ESC.ampAt(0.95)/D,T:70,from:40}),hi=sim({mode:'avg',s:1.11,A:ESC.ampAt(1.11)/D,T:70,from:40}),pa=x=>ESC.rateAt(ESC.ampAt(x),x);
  const dT=hi.rate-lo.rate,dM=pa(1.11)-pa(0.95),sl=dT/(hi.A-lo.A)*10;
  say(`the drive 95 % → 111 %: the model ${f(ESC.ampAt(0.95)/D,0)}° → ${f(ESC.ampAt(1.11)/D,0)}°, the rate ${sg(dM)} s a day; in time ${f(lo.A,0)}° → ${f(hi.A,0)}°, ${sg(dT)} s a day (${sg(sl,3)} s a day for each 10° of swing)`);
  chk(Math.abs(dT-dM)<0.1,`isochronism (the rate's change over the manual's range of swing) within 0.1 s a day of the model's`);
  chk(Math.abs(sl)<0.5,`and small (under 0.5 s a day for each 10° of swing): what the fusee keeps even, the escapement doesn't undo`);}
flush();

say('2. The detent as a body: its inertia, bouncing on its stop');
const ph=sim({mode:'phys',T:70,from:40}),ownP=ph.rate-ref.rate;
say(`the swing ${f(ph.A,1)}°, the escapement's own rate ${sg(ownP)} s a day; the tooth lands ${f(ph.land-ph.rel,1)}° after the release`);
chk(Math.abs(ph.A-ESC.A/D)<3&&Math.abs(ownP-RU.own)<0.3,`the detent's own inertia and bounce change little: the swing ${sg(ph.A-ESC.A/D,1)}°, the rate ${sg(ownP-RU.own)} s a day against the model`);
/* the detent's fall as makeEsc shows it (ESC.state: off the jewel where its end runs away faster than the detent can follow, then a preloaded spring and mass in closed
   form, hopping on its stop; caught again by the jewel's end if it falls onto it): where it leaves the jewel for the last time and first lands, against the integration's,
   at the integration's swing */
{const am=ph.A*D,fD=ESC.depart(am),land=fD.land/D;
  say(`the detent leaves the discharge jewel for the last time at ${f(ph.offF,2)}°${Math.abs(ph.off-ph.offF)>0.05?` (first at its acting corner, falling back onto its end)`:''} and first lands on its stop at ${f(ph.home,2)}° (makeEsc's fall: ${f(fD.th/D,2)}° and ${f(land,2)}°; home for good at ${f(ESC.homeAt(am)/D,2)}°)`);
  chk(Math.abs(ph.offF-fD.th/D)<0.5&&Math.abs(ph.home-land)<0.5,`the detent's fall back to its stop in the model is the integration's, within 0.5° of the balance (it went home in one step at ${f(ESC.thOff/D,1)}° until 11 October 2026)`);}
chk(ph.trips===0&&ph.beats>100&&ph.margin>0,`no tooth gets past the stone: ${ph.beats} beats; the detent is back on its stop ${f(1000*ph.margin,2)} ms before the next tooth reaches it, still ${f(100*ph.liftAt,1)} % lifted as it arrives`);
const sweep=[];
for(const[nm,o]of[['spring half as stiff',{kD:0.5}],['spring twice as stiff',{kD:2}],[`spring 0.06 mm thick (${f((0.06/(tD*1000))**3,2)}× as stiff)`,{kD:(0.06/(tD*1000))**3}],['preload half',{pre:0.5}],['preload 1.5×',{pre:1.5}],
  ['detent twice its inertia',{dI:2}],['bouncy stop (restitution 0.7)',{eB:0.7}],['dead stop (restitution 0)',{eB:0}],['the train 1.5× its inertia',{J:1.5}]]){
  const r=sim({mode:'phys',T:20,from:10,...o});sweep.push([nm,r]);
  say(`  ${nm.padEnd(38)} ${f(r.A,0)}°, trips ${r.trips}, back ${f(1000*r.margin,2)} ms before the tooth, ${f(100*r.liftAt,0)} % lifted as it arrives`);}
chk(sweep.every(([,r])=>r.trips===0&&r.margin>0),`over all of these the detent is home before the next tooth: what brings it back is the preload Op. 78 sets, not the spring's thickness`);
{const ok=m=>{const r=sim({mode:'phys',T:8,from:4,pre:m});return r.trips===0&&r.beats>8;};
  if(ok(0))say(`with no preload at all the spring's own stiffness still brings the detent home in time: Op. 78's preload is for the locking's safety against knocks (below), not for the return`);
  else{let lo=1e-3,hi=1;for(let i=0;i<8;i++){const m=Math.sqrt(lo*hi);ok(m)?hi=m:lo=m;}say(`the preload could fall to about ${f(100*hi,1)} % of Op. 78's (a ${f(770*hi,0)} mg weight) before a tooth gets past`);}}
flush();
if(quick){if(fail)process.exitCode=1;return;}

say('3. Starting, the least drive, knocks');
{const r=sim({mode:'phys',A:67,T:240,from:230}),am=r.amps,tgt=r.A;let tS=null;for(let i=0;i<am.length;i++)if(Math.abs(am[i]/D-tgt)<2){tS=i*T0/2;break;}
  say(`started by Twist (67°, the page's from rest: box.js TWIST), the swing comes within 2° of its ${f(tgt,0)}° in ${tS==null?'(never)':f(tS,1)+' s'} (the averaged model's exp(-2t/TF): ${f(-TF/2*Math.log(((tgt-2)**2-tgt**2)/(160**2-tgt**2)),1)} s)`);}
{/* started just above where the escapement unlocks: a drive too weak lets the swing fall under it within a few seconds (TF ln(70/50)) and the beats stop */
  let lo=0.02,hi=1,r=null;for(let i=0;i<8;i++){const m=(lo+hi)/2,q=sim({mode:'phys',s:m,A:70,T:30,from:20});if(q.lastBeat>28){hi=m;r=q;}else lo=m;}
  const am=(()=>{let a=0.01,b=1;for(let i=0;i<40;i++){const m=(a+b)/2;ESC.ampAt(m)<ESC.AMIN?a=m:b=m;}return b;})();
  say(`the least drive that keeps it going: ${f(100*hi,0)} % of the calibrated torque, the balance then swinging about ${f(r.A,0)}° (the averaged model: ${f(100*am,0)} %, at its AMIN ${f(ESC.AMIN/D,0)}°)`);
  chk(Math.abs(ph.pass-ESC.thPass/D)<1,`the trip spring comes clear on the return where the model has it (${f(ph.pass,1)}°, the model ${f(ESC.thPass/D,1)}°), so the least swing that keeps it going is the model's AMIN, ${f(ESC.AMIN/D,0)}°: far below any swing it runs at`);
  }
/* the train held with no torque (run down): the balance swings free, but while it carries the discharge jewel back past the trip spring it still lifts the detent and bends
   the trip spring every oscillation; makeEsc's freeStep (app.js's run-down) against the integration */
{const A0=150,r=sim({mode:'phys',s:0,A:A0,T:60,from:50}),at=t=>{let i=r.ampT.findIndex(x=>x>=t);if(i<0)i=r.ampT.length-1;return r.amps.slice(Math.max(0,i-1),i+1).reduce((a,b)=>a+b,0)/Math.min(2,i+1)/D;};
  const m=t=>ESC.freeStep(A0*D,t)/D,ts=[5,10,20,30,45],dev=Math.max(...ts.map(t=>Math.abs(at(t)-m(t))));
  say(`run down from ${A0}° with the train held: ${ts.map(t=>`${t} s ${f(at(t),1)}° (model ${f(m(t),1)}°, viscous alone ${f(A0*Math.exp(-t/TF),1)}°)`).join(', ')}`);
  chk(dev<2,`the held balance runs down as makeEsc's freeStep has it, within 2° (${f(dev,2)}°): the springs take ${f(ESC.EH,4)} k an oscillation down to ${f(ESC.AH/D,1)}°, the air and pivots the rest`);}
const pulse=(t1,dur,fn)=>tt=>{const u=(tt-t1)/dur;return u>0&&u<1?fn(Math.sin(Math.PI*u)):{al:0,ax:0,ay:0};};
const base=sim({mode:'phys',A:215,T:4,from:3});
const upset=r=>r.trips>0||Math.abs(r.beats-base.beats)>0;
/* a twist about the staff: a half-sine of angular acceleration 2 ms long at the worst of six phases of the swing */
{const knock=(dw,p)=>{const dur=0.002,t1=1.5+p*T0;return sim({mode:'phys',A:215,T:4,from:3,ext:pulse(t1,dur,x=>({al:dw*Math.PI/(2*dur)*x,ax:0,ay:0})),extFine:tt=>tt>t1-0.005&&tt<t1+dur+0.005});};
  const worst=dw=>{for(const p of[0,1/6,2/6,3/6,4/6,5/6])for(const s of[1,-1]){const r=knock(s*dw,p);if(upset(r))return r;}return null;};
  let lo=0,hi=60;for(let i=0;i<7;i++){const m=(lo+hi)/2;worst(m)?hi=m:lo=m;}const r=worst(hi);
  say(`a twist about the staff upsets it at about ${f(hi,1)} rad/s in 2 ms (${f(hi/(W0*ph.A*D),2)} of the balance's top speed): ${r&&r.trips?'a tooth escapes':r&&r.beats>base.beats?'it gains a beat':'it loses beats'}`);
  }
/* a blow across the plate: the balance and wheels are poised, the detent is not: m r × a lifts it, worst at right angles to its centre of mass */
{const ang=Math.atan2(DM.my,DM.mx)+Math.PI/2,ux=Math.cos(ang),uy=Math.sin(ang),gS=MPRE/(DM.m*rCM*G0),gR=(MPRE+KD*DREL+TAUE*CDR/DREL)/(DM.m*rCM*G0);
  for(const dur of[0.0005,0.003]){const blow=(g,p,s)=>{const t1=1.5+p*T0,a=s*g*G0;return sim({mode:'phys',A:215,T:4,from:3,ext:pulse(t1,dur,x=>({al:0,ax:a*x*ux,ay:a*x*uy})),extFine:tt=>tt>t1-0.005&&tt<t1+dur+0.02});};
    const bad=g=>{for(const p of[0.1,0.35,0.6,0.85])for(const s of[1,-1])if(upset(blow(g,p,s)))return true;return false;};
    let lo=gS/4,hi=gS*20;for(let i=0;i<7;i++){const m=Math.sqrt(lo*hi);bad(m)?hi=m:lo=m;}
    say(`a blow across the plate lasting ${f(dur*1000,1)} ms lets a tooth go at about ${f(hi,0)} g (a steady push lifts the detent off its stop at ${f(gS,0)} g and frees the wheel at ${f(gR,0)} g)`);
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
