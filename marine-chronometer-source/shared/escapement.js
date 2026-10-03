/* escapement.js: the Hamilton Model 21 spring detent escapement, solved in a unit 2D frame. Shared by the working model (js/movement.js), the essay's
   detent figure (src/p4.js) and the check against the manual (chronometer-working-model/tools/escapement.js, Node.js).
   makeEsc(settings) builds it; any setting below can be given, angles in degrees. Nothing is declared at the top level but makeEsc, since the pages
   declare their own TAU and D2R.

   Frame: balance at origin, escape wheel centre at x=EX, unit = escape-wheel radius (13.16/2 mm). Layout after the manual's Fig. 90 plan view. The detent's
   lift, the wheel's release and the passing spring's bending are solved from the contact of the discharge jewel with the passing spring's tip, and the
   wheel's advance from the contact of its teeth with the impulse jewel, so the parts touch where they are drawn. */
function makeEsc(o={}){
  const TAU=Math.PI*2,D2R=Math.PI/180,ES=13.16/2;
  /* balance motion 1-3/8 to 1-1/2 turns (manual Sec. II) -> amplitude A ~255 deg each side at the model's settings (ESC.A, the running amplitude, follows other settings: below).
     TF: the balance's free run-down (s, estimated); MU: steel on sapphire; fD, fP: the detent and trip springs' share of the impulse's work at the model's settings (estimated). EX: the centre distance (9.40 mm; the model passes the one in its L).
     HS: the hairspring's own isochronism, s a day gained for each 10 deg the swing is above A (0: isochronous, the model's default; the adjuster's bench sets it).
     rRoll: impulse roller O.D. 0.249 in (parts list); rp: the impulse jewel ends flush with it, so a tooth reaches the jewel by dipping into the crescent (Ops. 76, 83).
     rT: passing-spring tip; rd: discharge jewel reach; dL: depth of lock; aI, aD: impulse and discharge jewels at rest. These set lock, let-off, overall and drop (Ops. 85-87, 97) */
  /* the teeth (Fig. 90, and an original wheel photographed in chronometerbook post 30): a narrow land at the tip (0.13 mm), the locking face undercut so the tip leads its root
     (U: the root trails the tip by that fraction of a pitch), a hollow back falling to the root circle (r0: 5.5 mm) over B of a pitch and meeting it tangentially
     (traced from Fig. 90: depth below the tip 1-(1-f)^1.6 at f of the back's length). tsT: the trip spring's thickness, a flat Elinvar strip (mm) */
  const DEF={EX:-9.3997/ES,A:255,G:3.5,rRoll:0.48,rp:0.48,rT:0.286,rd:0.305,rDR:0.22,wI:0.06,wD:0.048,dL:0.019,DRAW:10,aI:181.3,aD:269.6,r0:5.5/ES,U:0.14,land:0.05,B:0.55,tsT:0.06,TF:25,MU:0.15,fD:0.03,fP:0.005,HS:0};
  for(const k in o)if(!(k in DEF))throw Error('makeEsc: no setting '+k);
  const c={...DEF,...o},NT=16,P=TAU/NT,EX=c.EX,A0=c.A*D2R,G=c.G,rRoll=c.rRoll,rp=c.rp,rT=c.rT,rd=c.rd,rDR=c.rDR,wI=c.wI,wD=c.wD,rho=c.tsT/2/ES,dL=c.dL,r0=c.r0,U=c.U,DRAW=c.DRAW*D2R,t0=P/2,lockA=t0-2*P,aI=c.aI*D2R,aD=c.aD*D2R;
  /* locking tooth two pitches past the pair that straddles the roller (Fig. 90: ~36 deg from the line of centres) */
  const S={x:EX+Math.cos(lockA),y:Math.sin(lockA)};
  /* detent (Fig. 90): straight, 68 deg to the line of centres, the locking face 11.3 mm from the point of flexure Ft. The passing spring runs parallel to it
     on the line through the balance staff, 7.9 mm long, its tip at rT; the horn meets it behind the tip, 0.25 mm outside the discharge jewel's path (Op. 88) */
  const dirB={x:Math.cos(68*D2R),y:Math.sin(68*D2R)},nB={x:dirB.y,y:-dirB.x},BL=1.72,Ft={x:S.x-BL*dirB.x,y:S.y-BL*dirB.y};   /* nB: direction the locking jewel moves (away from the wheel); the passing spring bends along -nB */
  const Pt={x:-rT*dirB.x,y:-rT*dirB.y},Ps0={x:Pt.x-1.2*dirB.x,y:Pt.y-1.2*dirB.y};
  const LEN=Math.hypot(Pt.x-Ft.x,Pt.y-Ft.y),nH={x:(Pt.y-Ft.y)/LEN,y:-(Pt.x-Ft.x)/LEN};   /* nH: direction the spring tip moves as the detent unlocks; lift = that travel */
  const aIc=aI+Math.asin(wI/2/rp);   /* impulse jewel centre line: its driven face runs through the pallet tip at aI */
  const rot=(q,l)=>{const d=-l/LEN,c=Math.cos(d),s=Math.sin(d);return{x:Ft.x+(q.x-Ft.x)*c-(q.y-Ft.y)*s,y:Ft.y+(q.x-Ft.x)*s+(q.y-Ft.y)*c};};
  const off=(p,a,b)=>({x:p.x+dirB.x*a+nB.x*b,y:p.y+dirB.y*a+nB.y*b}),D=(t,n)=>off(Ft,t,n);
  /* locking jewel: round, 0.6 mm, with a large flat (Figs. 57-59) set at 10 deg of draw (8-12 deg, chronometerbook post 30), so the tooth's pressure
     holds the detent against its stop button. The tooth tip rests on the flat at S, whose inner end is dL inside the tip circle */
  const cD=Math.cos(DRAW),sD=Math.sin(DRAW),nF={x:dirB.x*cD+nB.x*sD,y:dirB.y*cD+nB.y*sD},fF={x:dirB.x*sD-nB.x*cD,y:dirB.y*sD-nB.y*cD};   /* nF: the flat's normal, fF: along it into the wheel */
  const rJ=0.046,eJ=0.012,hJ=Math.sqrt(rJ*rJ-eJ*eJ),Jc=off(S,0,0),stone=[];Jc.x+=(dL-hJ)*fF.x-eJ*nF.x;Jc.y+=(dL-hJ)*fF.y-eJ*nF.y;
  { const al=Math.atan2(eJ,hJ);for(let k=0;k<=14;k++){const a=al-(Math.PI+2*al)*k/14;stone.push({x:Jc.x+rJ*(Math.cos(a)*fF.x+Math.sin(a)*nF.x),y:Jc.y+rJ*(Math.cos(a)*fF.y+Math.sin(a)*nF.y)});} }
  /* lift at which the whole stone clears the tooth tips' path (with 0.02 mm to spare) */
  const clear=l=>Math.min(...stone.map(q=>{const r=rot(q,l);return Math.hypot(r.x-EX,r.y);}))>1+0.003;
  let lo=0,hi=0.3;for(let i=0;i<40;i++){const m=(lo+hi)/2;clear(m)?hi=m:lo=m;}const lRel=hi;
  /* contact tables over the balance angle. Active swing (th rising): the jewel's leading face pushes the spring tip, and with it the horn,
     along nH until the tip slides off the jewel's end; the detent then springs back to its stop. Return swing (th falling): the jewel
     bends the spring tip along -nB, the detent staying on its stop, until the tip slides off. */
  const TH0=-70*D2R,DT=0.02*D2R,NTB=5001,RET=1.5*D2R,LI=new Float32Array(NTB),PS=new Float32Array(NTB),reach=rd+0.5*rho;
  const push=(th,dir,sg)=>{const ps=aD+th,u={x:Math.cos(ps),y:Math.sin(ps)},m={x:-u.y,y:u.x},pm=Pt.x*m.x+Pt.y*m.y,dm=dir.x*m.x+dir.y*m.y;
    if(Pt.x*u.x+Pt.y*u.y<0)return 0;const d=sg>0?(wD/2+rho-pm)/dm:(pm+wD/2+rho)/dm;if(d<=0)return 0;
    const q={x:Pt.x+sg*d*dir.x,y:Pt.y+sg*d*dir.y};return q.x*u.x+q.y*u.y>reach?-d:d;};   /* negative: tip has slid off at that displacement */
  const hold=(th,dir,sg,d,sl)=>{const ps=aD+th,u={x:Math.cos(ps),y:Math.sin(ps)},m={x:-u.y,y:u.x},q={x:Pt.x+sg*d*dir.x,y:Pt.y+sg*d*dir.y};   /* after sliding off: stay clear of the jewel's end while it moves away */
    if(Math.abs(q.x*m.x+q.y*m.y)>=wD/2+rho||q.x*u.x+q.y*u.y>=reach)return d;return Math.min(sl,Math.max(d,(reach-Pt.x*u.x-Pt.y*u.y)/(sg*(dir.x*u.x+dir.y*u.y))));};
  let thOff=null,thPass=null;   /* where the spring's tip leaves the jewel: the detent falls back (active swing), the trip spring flies back (return swing). Not where the push
     peaks, as the tip slides off the jewel's side: it then rides on the jewel's end for another degree or so, until that has swept past */
  { let sl=-1,thS=0,lm=0;for(let i=0;i<NTB;i++){const th=TH0+i*DT;if(sl<0){const d=push(th,nH,1);if(d<0){sl=lm;thS=th;}else{LI[i]=d;lm=d;continue;}}
      const f=sl*Math.max(0,1-(th-thS)/RET);LI[i]=hold(th,nH,1,f,sl);if(thOff===null&&sl>0&&th>thS&&LI[i]<=f+1e-12)thOff=th;}
    sl=-1;lm=0;for(let i=NTB-1;i>=0;i--){const th=TH0+i*DT;if(sl<0){const d=push(th,nB,-1);if(d<0){sl=lm;thS=th;}else{PS[i]=d;lm=d;continue;}}
      const f=sl*Math.max(0,1-(thS-th)/RET);PS[i]=hold(th,nB,-1,f,sl);if(thPass===null&&sl>0&&th<thS&&PS[i]<=f+1e-12)thPass=th;} }
  const tab=(T,th)=>{const f=(th-TH0)/DT,i=Math.floor(f);return i<0||i>=NTB-1?0:T[i]+(T[i+1]-T[i])*(f-i);};
  let thRel=0,released=false;for(let i=0;i<NTB;i++)if(LI[i]>=lRel){thRel=TH0+i*DT;released=true;break;}
  /* wheel angle (tooth tip, from the line of centres) at which a tooth meets the impulse jewel at balance angle th: its locking face on the jewel's
     tip, or its tip on the jewel's driven face, whichever holds it back more; -1e9 while the jewel is outside the teeth's path */
  const bite=th=>{const c=aIc+th,u={x:Math.cos(c),y:Math.sin(c)},h=wI/2,sT=Math.sqrt(rp*rp-h*h),ox=h*u.y,oy=-h*u.x;let a=-1e9;   /* driven face: s*u+(ox,oy) */
    const qx=sT*u.x+ox,qy=sT*u.y+oy,rq=Math.hypot(qx-EX,qy);if(qx<0&&rq<1)a=Math.atan2(qy,qx-EX)-U*P*Math.min(1,(1-rq)/(1-r0));   /* the undercut face reaches the jewel's tip that much after the tooth's tip */
    const cx=ox-EX,b=u.x*cx+u.y*oy,dc=b*b-(cx*cx+oy*oy-1);if(dc>0){const s=-b-Math.sqrt(dc);if(s>0&&s<=sT){const px=s*u.x+ox;if(px<0)a=Math.max(a,Math.atan2(s*u.y+oy,px-EX));}}
    return a;};
  /* one tooth's outline (unit frame, polar [r, angle]) with its tip at angle a, the back trailing (+angle, the wheel turning to -angle): front root, tip, land, hollow back,
     root circle to the next tooth's front root. Drawn by the model's wheel (core.js escapeWheel) and the 2D inset */
  const toothPts=a=>{const q=[[r0,a+U*P],[1,a],[1,a+c.land*P]];for(let k=1;k<=16;k++){const f=k/16;q.push([1-(1-r0)*(1-Math.pow(1-f,1.6)),a+P*(c.land+(c.B-c.land)*f)]);}q.push([r0,a+P*(c.B+1+U)/2]);return q;};
  /* state at balance phase p (0..1 over one 0.5 s oscillation): balance angle, detent lift, passing-spring deflection, escape-wheel tooth progress.
     amp: the swing's amplitude in radians (A, the running amplitude, by default); smaller while the balance starts or runs down. Below the angle that unlocks
     the detent, completes the impulse and passes the trip spring (AMIN) the wheel stays locked, which the caller keeps (the progress it reports assumes a running escapement).
     A swing that doesn't carry the discharge jewel back past the trip spring's tip (amp below -thPass) never gets it behind the spring to unlock: the spring stays bent
     against the jewel and follows it back, and the detent stays on its stop. drop: the wheel runs free, between release and the tooth landing on the impulse jewel */
  function state(p,amp=A){
    const th=-amp*Math.cos(TAU*p),ccw=Math.sin(TAU*p)>0,pass=thPass!==null&&amp>=-thPass;
    const lift=ccw&&pass?tab(LI,th):0,psDef=ccw&&pass?0:tab(PS,th);let prog,drop=false;
    if(ccw&&pass&&th>thRel){const a=bite(th),pf=-(th-thRel)*G,pa=a>-1e8?a-t0:-1e9,phi=Math.max(pf,pa);prog=phi<=-P?1:-phi/P;drop=pf>pa&&phi>-P;}
    else prog=ccw?0:1;
    return{th,ccw,lift,psDef,prog,drop};
  }
  /* passing spring as root, control point and tip (unit frame) for a state: rides with the detent, tip bent along -nB on the return swing */
  function springPts(s){const a0=rot(Ps0,s.lift),am=rot({x:(Ps0.x+Pt.x)/2,y:(Ps0.y+Pt.y)/2},s.lift),tp=rot(Pt,s.lift);tp.x-=nB.x*s.psDef;tp.y-=nB.y*s.psDef;return[a0,am,tp];}
  /* plan outlines in detent coordinates (t along the detent from Ft, n toward nB), after Fig. 90 and the detent photograph in chronometerbook post 4.
     Moving (rotate about Ft by -lift/LEN): two-strip detent spring, cross-piece, blade, jewel block, arm, horn, Z bracket. Fixed: foot, support block (shortened to clear the train pillar behind it) and stop button */
  const rect=(t0,t1,n0,n1)=>[D(t0,n0),D(t1,n0),D(t1,n1),D(t0,n1)],tR=(Ps0.x-Ft.x)*dirB.x+(Ps0.y-Ft.y)*dirB.y,nR=(Ps0.x-Ft.x)*nB.x+(Ps0.y-Ft.y)*nB.y;
  const tH=tR+1.2-(rd+0.038-rT);   /* horn's inner face: 0.25 mm outside the discharge jewel's reach */
  const brO=nR+0.015+0.36/ES;   /* the angle bracket's upright leg, 0.36 mm thick (estimated), to take the trip spring's screw: its outer face */
  const thick=(pts,w)=>{const L2=[],R2=[];pts.forEach((p,i)=>{const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy);L2.push({x:p.x-dy/l*w,y:p.y+dx/l*w});R2.push({x:p.x+dy/l*w,y:p.y-dx/l*w});});return L2.concat(R2.reverse());};
  const pieces={
    spring:rect(0,0.58,-0.058,-0.046),cross:rect(0.58,0.68,-0.075,0.083),blade:rect(0.66,BL-0.07,-0.06,-0.03),block:rect(BL-0.08,BL+0.08,-0.08,0.08),
    arm:thick([D(BL+0.06,0),D(BL+0.2,0),D(tH-0.025,nR+rho-0.03),D(tH-0.025,nR+rho),D(tH-0.025,nR+rho+0.05)],0.025),horn:rect(tH-0.05,tH,nR+rho,nR+rho+0.05),   /* the arm ends square over the horn, their outlines one */
    bracket:[D(0.58,0.083),D(0.68,0.083),D(0.68,nR+0.015),D(tR+0.06,nR+0.015),D(tR+0.06,brO),D(0.58,brO)],   /* its leg continues the cross-piece (same t); its upright leg 0.36 mm thick, to take the trip spring's screw (brO: its outer face) */
    stone
  };
  /* the detent-adjusting screw (Fig. 90; Ops. 84, 93): threaded into the block's end, its head (r 0.9 mm, 0.45 thick, 0.3 mm off the block) standing 0.3 mm deep in a slot
     across the foot, which runs on 0.6 mm past it, so turning it slides the detent along; adj: the head's inner and outer faces (t) and its centre (n) */
  const BE=-15.0/ES,aS=BE-0.3/ES,aH=aS-0.45/ES,aN=-0.083+(0.3-0.9)/ES,adj={tS:aS,tH:aH,n:aN,r:0.9,BE},sDp=-0.083+0.35/ES,fE=aH-0.63/ES;
  /* blockFront: split along its length by a slot open at the stop button's end (Fig. 90), so the button stands on a strip sprung from the block's root: the lock-adjusting
     screw, threaded in the outer part, bears on the strip and moves the button ("working through the locking jewel button", Sec. IV); the clamp screw, through the outer
     part into the strip, holds it. The slot and strip in Fig. 90's proportions of the front (0.24 and 0.36 mm) */
  const fixed={foot:[D(fE,-0.083),D(aH-0.03/ES,-0.083),D(aH-0.03/ES,sDp),D(aS,sDp),D(aS,-0.083),D(0,-0.083),D(0,0.083),D(fE,0.083)],blockMain:rect(BE,0.9,-0.5,-0.083),blockFront:[D(0.9,-0.3),D(BL-0.1,-0.3),D(BL-0.1,-0.173),D(0.93,-0.173),D(0.93,-0.137),D(BL-0.1,-0.137),D(BL-0.1,-0.083),D(0.9,-0.083)],button:rect(BL-0.2,BL-0.1,-0.083,-0.06)};
  /* AMIN: the least amplitude that keeps the escapement going, with 2 degrees to spare: the swing must carry the discharge jewel past the trip spring on the return
     (where the spring falls off it, thPass), unlock the wheel (thRel) and see the impulse to its end (thEnd). Below it the balance swings on without unlocking */
  let thEnd=thRel;for(let th=thRel;th<A0;th+=0.001){const a=bite(th),pf=-(th-thRel)*G,phi=Math.max(pf,a>-1e8?a-t0:-1e9);if(phi<=-P){thEnd=th;break;}}
  const AMIN=Math.max(-thRel,thEnd,-(thPass??TH0))+2*D2R;
  /* the running amplitude A and the escapement's rate (the adjuster's bench changes both). Work per oscillation, in units of the hairspring's stiffness k (rad²): the
     impulse, w (the wheel's torque over k) times the wheel's turn while it drives the jewel (a pitch less the drop onto it and the tooth's fall off its tip to the locking jewel, spread as bite() gives it), less the
     unlocking: the locking jewel drawn back against the tooth and rubbing on it (dL(tan DRAW+MU)/(1-MU tan DRAW) of the wheel's turn, over the lift to release), the
     detent spring lifted (Kd LI²/2, lost as the detent falls back) and the trip spring bent on the return (Kp PS²/2, lost as it flies back). The swing loses πA²/Q a
     time, Q=πTF/T from the free run-down TF, so A=√(QW/π). w, Kd and Kp are fitted at the model's settings (the reference: the bench's six settings at DEF), the springs
     taking fD and fP of the impulse's work (estimated), so there A is c.A and the rate 0. Rate: Airy's result, each push τ|dθ| (τ toward +θ) at θ advancing the
     phase by -(τ|dθ|/k)θ/(A²√(A²-θ²)) an oscillation: before the dead point a push gains and a resistance loses, after it the reverse. In s a day against the reference */
  let a0=null;for(let i=0;i<NTB;i++)if(LI[i]>0){a0=TH0+i*DT;break;}                                // unlocking swing: discharge jewel meets the trip spring
  const T=0.5,Q=Math.PI*c.TF/T,CAL=['EX','A','TF','MU','fD','fP'],isRef=Object.keys(o).every(k=>CAL.includes(k)||Math.abs(o[k]-DEF[k])<1e-9),RF=makeEsc.refs||(makeEsc.refs={}),rk=CAL.map(k=>c[k]).join();
  let wk=null;
  if(a0!==null&&released&&thOff!==null&&thPass!==null){
    const paAt=th=>{const a=bite(th);return a>-1e8?a-t0:-1e9;},pfAt=th=>-(th-thRel)*G,phiAt=th=>clampP(Math.max(pfAt(th),paAt(th))),clampP=x=>Math.min(0,Math.max(-P,x));
    let tl=thRel;if(paAt(thRel)<0){let th=thRel;while(paAt(th)<pfAt(th)&&pfAt(th)>-P&&th<A0)th+=DT;
      if(paAt(th)>=pfAt(th)){let lo=th-DT,hi=th;for(let k=0;k<40;k++){const m=(lo+hi)/2;paAt(m)>=pfAt(m)?hi=m:lo=m;}tl=hi;}else tl=null;}   /* where the tooth lands on the impulse jewel */
    if(tl!==null){const I=[],R=[],Dt=[],Tp=[];
      for(let th=tl,ph=phiAt(tl);ph>-P&&th<A0;th+=DT){const t2=th+DT,p2=phiAt(t2),m=th+DT/2;if(paAt(m)>=pfAt(m))I.push([m,ph-p2]);ph=p2;}   /* the wheel driving: τ|dθ| = w × its turn */
      const cdr=dL*(Math.tan(DRAW)+c.MU)/(1-c.MU*Math.tan(DRAW));let rs=0;
      for(let i=0;i<NTB-1;i++){const th=TH0+i*DT,m=th+DT/2,l1=LI[i],l2=LI[i+1],p1=PS[i],p2=PS[i+1];
        if(th>=a0&&th+DT<=thRel){const d=Math.min(l2,lRel)-Math.min(l1,lRel);if(d>0){R.push([m,d]);rs+=d;}}
        if(th>=a0&&th+DT<=thOff&&l2>l1)Dt.push([m,(l2*l2-l1*l1)/2]);
        if(th>=thPass&&p1>p2)Tp.push([m,(p1*p1-p2*p2)/2]);}
      if(rs>0)for(const r of R)r[1]*=cdr/rs;
      const sum=g=>g.reduce((s,r)=>s+r[1],0);wk={I,R,Dt,Tp,EI:sum(I),ER:sum(R),ED:sum(Dt),ET:sum(Tp),tl};} }
  /* phase gained an oscillation (rad) at amplitude a: the impulse pushes with the swing (+θ), the unlocking against it (-θ), the trip spring against the return (+θ) */
  const airy=(g,s,a)=>{let q=0;for(const[th,e]of g)if(Math.abs(th)<a)q+=s*e*th/Math.sqrt(a*a-th*th);return-q/(a*a);};
  const parts=(cl,a)=>({imp:cl.w*airy(wk.I,1,a),draw:cl.w*airy(wk.R,-1,a),detent:cl.Kd*airy(wk.Dt,-1,a),trip:cl.Kp*airy(wk.Tp,1,a)}),sumP=p=>p.imp+p.draw+p.detent+p.trip,day=x=>86400*x/TAU;
  let run,CL=null,PH0=0;
  if(isRef){let cl=null,ph=0,br=null;if(wk){const w=Math.PI*A0*A0/Q/(wk.EI*(1-c.fD-c.fP)-wk.ER);cl={w,Kd:wk.ED>0?c.fD*w*wk.EI/wk.ED:0,Kp:wk.ET>0?c.fP*w*wk.EI/wk.ET:0};br=parts(cl,A0);ph=sumP(br);}
    RF[rk]={cl,ph};CL=cl;PH0=ph;run={A:A0,rate:0,own:day(ph),parts:br,cl};}
  else{const R0=RF[rk]||(makeEsc(Object.fromEntries(CAL.map(k=>[k,c[k]]))),RF[rk]),cl=R0.cl,Wn=wk&&cl?cl.w*(wk.EI-wk.ER)-cl.Kd*wk.ED-cl.Kp*wk.ET:0,a=Wn>0?Math.sqrt(Q*Wn/Math.PI):0,br=a>=AMIN?parts(cl,a):null;
    CL=cl;PH0=R0.ph;run={A:a,rate:br?day(sumP(br)-R0.ph)+c.HS*(a-A0)/D2R/10:NaN,own:br?day(sumP(br)):NaN,parts:br,cl};}
  if(wk&&run.cl){const cl=run.cl;Object.assign(run,{Q,Wi:cl.w*wk.EI,fu:(cl.w*wk.ER+cl.Kd*wk.ED+cl.Kp*wk.ET)/(cl.w*wk.EI),land:wk.tl,drive:wk.EI});}
  const A=run.A;
  /* the balance's equation of motion, averaged over a swing (the model's clock keeps the phase; this gives the amplitude and the rate). The escape wheel's torque is s times
     the model's (1: the mainspring through the fusee, as calibrated): the impulse's work and the locking jewel's draw go with it, the detent and trip springs' don't. ampAt(s):
     the amplitude it settles at, √(Q Wn/π) as above. In ½A² (units of k) a swing gains Wn and loses πA²/Q, so A² relaxes to ampAt(s)² as exp(-2t/TF), exactly for a steady
     torque: the caller steps it so. rateAt(a, s): the escapement's rate at amplitude a, s a day against the reference at its own amplitude (Airy, as run.rate); NaN under AMIN.
     The rate's change with amplitude is the escapement's isochronism error, plus the hairspring's own, HS s a day for each 10 deg above A: 0 by default, the spring taken as
     isochronous (Hamilton's Elinvar spring, held without bending at its ends, "minimum isochronal error", Sec. II); an adjuster can set the spring against the escapement */
  const wnAt=s=>wk&&CL?s*CL.w*(wk.EI-wk.ER)-CL.Kd*wk.ED-CL.Kp*wk.ET:0,ampAt=s=>{const w=wnAt(s);return w>0?Math.sqrt(Q*w/Math.PI):0;};
  /* TRIP: a swing past a full turn and the angle where the discharge jewel meets the trip spring brings the jewel round to unlock the detent a second time in the swing: the
     wheel trips, escaping an extra tooth (app.js's jolt) */
  const TRIP=a0===null?Infinity:TAU+a0;
  const rateAt=(a,s=1)=>{if(!wk||!CL||!(a>=AMIN))return NaN;const p=parts(CL,a);return day(s*(p.imp+p.draw)+p.detent+p.trip-PH0)+c.HS*(a-A0)/D2R/10;};
  /* the manual's adjustment figures (Sec. VIII, Ops. 76, 84-88, 97), measured with its own definitions: printed by chronometer-working-model/tools/escapement.js, shown
     live by the model's adjuster's bench. runs: false, with why, when the escapement would not run at these settings (its other figures are then NaN where they can't be had) */
  let meas=null;
  function measure(){if(meas)return meas;const mm=u=>u*ES,deg=a=>a==null?NaN:a/D2R,th=i=>TH0+i*DT,r={runs:true,why:''},no=w=>{if(r.runs){r.runs=false;r.why=w;}};
    const tip=a=>Math.hypot(EX+Math.cos(a),Math.sin(a));
    r.D=mm(-EX);r.shake=mm(tip(t0)-rRoll);r.dip=mm(rRoll-(-EX-1));
    const off=thOff,poff=thPass;                                                                 // the tip slides off the jewel: detent falls back / trip spring returns
    if(a0===null)no('the discharge jewel never meets the trip spring');else if(!released)no('the detent never lifts far enough to free the wheel');else if(off===null)no('the trip spring never slides off the discharge jewel');
    if(poff===null)no('the discharge jewel never passes the trip spring on the return swing');
    r.contact=deg(a0);r.rel=deg(thRel);r.off=deg(off);r.poff=deg(poff);
    r.lock=deg(a0==null?null:thRel-a0);r.letoff=deg(off==null?null:off-thRel);r.overall=deg(off==null||poff==null?null:off-poff);
    let tIn=null;for(let t=TH0;t<1.2;t+=0.01*D2R)if(bite(t)>-1e8){tIn=t;break;}
    if(tIn===null)no('no tooth reaches the impulse jewel');
    r.drop=deg(tIn==null?null:thRel-tIn);r.ahead=deg(t0-bite(thRel));                                    // drop (Op. 97); >0: jewel is past the waiting tooth at release
    let tE=null;for(let k=0;k<=40000;k++){const p=0.5*k/40000;if(Math.sin(TAU*p)<=0)continue;const s=state(p,A0);if(tE===null&&s.prog>=1){tE=s.th;break;}}
    if(tE===null)no('the tooth never finishes its impulse: the wheel would not advance');
    r.impEnd=deg(tE);r.hornClr=mm(Math.min(...pieces.horn.map(q=>Math.hypot(q.x,q.y)))-rd);r.jewels=deg(aD-aI);r.lRel=mm(lRel);
    r.A=deg(A);r.AMIN=deg(AMIN);r.rate=run.rate;r.fu=run.fu;
    if(A<AMIN)no(A>0?`the balance would swing only ${Math.round(A/D2R)}°, less than the ${Math.round(AMIN/D2R)}° it needs to unlock the wheel and see the impulse through`:'unlocking would take more from the balance than the impulse gives it');
    return meas=r;}
  /* each figure against the manual's: k, name, the value as text, what the manual wants, ok */
  function checks(){const r=measure(),f=(x,n=1)=>x.toFixed(n);
    return[{k:'D',name:'centre distance',v:f(r.D,2)+' mm',want:'',ok:true},
      {k:'shake',name:'roller shake (Op. 84)',v:f(r.shake,3)+' mm',want:'about 0.002 in (0.051 mm)',ok:r.shake>0.03&&r.shake<0.08},
      {k:'dip',name:"teeth dip into the roller's crescent (Op. 76)",v:f(r.dip,2)+' mm',want:'> 0',ok:r.dip>0},
      {k:'lock',name:'lock (Op. 85)',v:f(r.lock)+'°',want:'about 6°',ok:Math.abs(r.lock-6)<1},
      {k:'letoff',name:'let-off (Op. 86)',v:f(r.letoff)+'°',want:'at least 6°',ok:r.letoff>=6},
      {k:'overall',name:'overall (Op. 87)',v:f(r.overall)+'°',want:'26-30°',ok:r.overall>=26&&r.overall<=30},
      {k:'drop',name:'drop (Op. 97)',v:f(r.drop)+'°',want:'about 2°',ok:Math.abs(r.drop-2)<1&&r.ahead>0},
      {k:'horn',name:'horn clearance to the unlocking jewel (Op. 88)',v:f(r.hornClr,2)+' mm',want:'about 0.010 in (0.25 mm)',ok:Math.abs(r.hornClr-0.254)<0.08},
      {k:'jewels',name:'angle between the jewels',v:f(r.jewels)+'°',want:'about 90° (Fig. 90)',ok:Math.abs(r.jewels-90)<10}];}
  return{settings:c,ES,NT,P,EX,A,A0,AMIN,TRIP,run,ampAt,rateAt,T,measure,checks,rp,rRoll,rd,rT,rDR,wI,wD,rho,t0,aI,aIc,aD,S,Ft,Pt,Ps0,LEN,nH,nB,dirB,BL,tR,nR,tH,brO,D,pieces,fixed,adj,state,springPts,toothPts,r0,U,Jc,nF,rJ,lRel,thRel,thPass,LI,PS,TH0,DT,bite};
}
if(typeof module!=='undefined')module.exports={makeEsc};
