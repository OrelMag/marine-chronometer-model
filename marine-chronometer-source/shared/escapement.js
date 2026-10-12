// @ts-check
/* escapement.js: the Hamilton Model 21 spring detent escapement, solved in a unit 2D frame. Shared by the working model (js/movement.js), the essay's
   detent figure (src/p4.js) and the check against the manual (chronometer-working-model/tools/escapement.js, Node.js).
   makeEsc(settings) builds it; any setting below can be given, angles in degrees. Nothing is declared at the top level but makeEsc, since the pages
   declare their own TAU and D2R.

   Frame: balance at origin, escape wheel centre at x=EX, unit = escape-wheel radius (13.16/2 mm). Layout after the manual's Fig. 90 plan view. The detent's
   lift, the wheel's release and the passing spring's bending are solved from the contact of the discharge jewel with the passing spring's tip, and the
   wheel's advance from the contact of its teeth with the impulse jewel, so the parts touch where they are drawn. */
/** @typedef {{EX?:number,A?:number,rRoll?:number,rp?:number,rT?:number,rd?:number,rDR?:number,wI?:number,wD?:number,rB?:number,dL?:number,DRAW?:number,aI?:number,aD?:number,r0?:number,U?:number,land?:number,B?:number,tsT?:number,tsH?:number,TF?:number,MU?:number,I?:number,JW?:number,W78?:number,hD?:number,EB?:number,ET?:number,ID?:number,eS?:number,HS?:number}} EscSettings
    any of DEF below (angles in degrees); a misspelt one is a type error, as it is an error at run time */
/** @typedef {{th:number,ccw:boolean,lift:number,psDef:number,prog:number,drop:boolean,run:boolean}} EscState
    state(p): the balance's angle (rad), swinging counterclockwise, the detent's lift, the passing spring's bending, the escape wheel's progress through a tooth (0 to 1; a
    little under 0 while the unlocking draws the locked tooth back), the wheel running free (drop: from the release to the impulse jewel; run: from the jewel on to the locking stone) */
/** @param {EscSettings} [o] */
function makeEsc(o={}){
  const TAU=Math.PI*2,D2R=Math.PI/180,ES=13.16/2;
  /* balance motion 1-3/8 to 1-1/2 turns (manual Sec. II) -> amplitude A ~255 deg each side at the model's settings (ESC.A, the running amplitude, follows other settings: below).
     TF: the balance's free run-down (s), set so the escape wheel's torque the model is calibrated at is what the train gives (tools/physics.js A6: the fusee through the
     measured pivots and teeth, less the mainspring's own losses) and inside the decay the balance's parts allow (the same, 65-113 s with the endstone's friction measured
     on BunnSpecial's Jd2c3x8VKsE, 12 October 2026). 68 since 12 October 2026, when the mainspring became the videos' 0.394 mm strip (its torque 0.83 of the parts list's
     0.419): the calibrated torque, 62.6 µN·m, is within 0.4 % of what that spring gives the escape
     wheel through the same train and losses as 52 s took for the old one (62.4 µN·m against 75.0: 0.611 of the fusee's torque reaching the escape wheel); 52 until then, and 34 until 11 October 2026, when the escapement's work still left out the wheel's chase and the detent's whole lift
     (tools/dynamics.js). MU: steel on sapphire. EX: the centre distance (9.40 mm; the model passes the one in its L).
     The bodies and springs, physical rather than fitted (since 11 October 2026; fD and fP, their shares of the work, were fitted before): I, the balance (g·mm², Table II);
     JW, the escape wheel and arbor (4.80 g·mm², its drawn solid: tools/physics.js) with the fourth wheel's inertia reflected through its pinion (about 1.1, estimated: tools/dynamics.js; 6.2 with 1.4 until 12 October 2026, the fourth larger at the escape arbor's old place);
     W78, Op. 78's weight (g): hung on the locking jewel it just parts the detent spring from its stop button, so that is the spring's preload; hD, the detent spring's two
     strips' height together (mm: 0.50 + 0.45 as movement.js draws them, estimated) and EB its modulus (GPa, hardened beryllium copper); tsH, the trip spring's depth (mm,
     estimated) and ET its modulus (GPa, Elinvar-type). ID: the detent's moment of inertia about its flexure (g·mm², its drawn pieces with the trip spring: tools/dynamics.js
     works it out from movement.js and checks this), and eS its restitution on the stop button (estimated, metal on a steel button), for its fall back after the unlocking (state).
     rB: the radius stoned on the back corner of the discharge jewel's end (unit frame), its acting corner left square: "set with a jewel with a radius to the back of
     the acting part of the tip" (the British Museum's Model 21, Catalogue of Watches VI, 1990, no. 117A), and KLUwI2UUCMQ 6:58.17-6:58.33 shows the acting face flat to
     a sharp corner. 0 is a square end, wD/2 (the most) the back half of a half round. The radius isn't given (estimated): wD/2, 0.158 mm, with rd at 0.296, where the
     jewel stands 0.50 mm proud of its roller (the frames: 0.4-0.5, its most), and rT 0.2894 puts overall in the middle of Op. 87's 26-30° (28.0°) with the most lift to
     spare past the release (0.28 mm at the tip against 0.18): the square acting corner holds the trip spring's tip on the return, so overall wants less overlap of the
     jewel past the tips, and less overlap leaves less lift; a larger radius lets the detent off sooner at the same overlap (rB 0.010, 0.066 mm, the least within 30°, gave
     29.7° and 0.27 mm). Until 12 October 2026 the end was a half round (rnd), both corners, and rT 0.290, rd 0.300 and aD 271
     HS: the hairspring's own isochronism, s a day gained for each 10 deg the swing is above A (0: isochronous, the model's default; the adjuster's bench sets it).
     rRoll: impulse roller O.D. 0.249 in (parts list); rp: the impulse jewel ends flush with it, so a tooth reaches the jewel by dipping into the crescent (Ops. 76, 83).
     rT: passing-spring tip; rd: discharge jewel reach (its grown outline's; the frames at 6:58 put the jewel 0.4-0.5 mm proud of its roller); dL: depth of lock; aI, aD: impulse and discharge jewels at rest. These set lock, let-off, overall and drop (Ops. 85-87, 97) */
  /* the teeth (Fig. 90, and an original wheel photographed in chronometerbook post 30): a narrow land at the tip (0.13 mm), the locking face undercut so the tip leads its root
     (U: the root trails the tip by that fraction of a pitch), a hollow back falling to the root circle (r0: 5.5 mm) over B of a pitch and meeting it tangentially
     (traced from Fig. 90: depth below the tip 1-(1-f)^1.6 at f of the back's length). tsT: the trip spring's thickness, a flat Elinvar strip (mm) */
  const DEF={EX:-9.3997/ES,A:255,rRoll:0.48,rp:0.48,rT:0.2894,rd:0.296,rDR:0.22,wI:0.06,wD:0.048,rB:0.024,dL:0.017,DRAW:10,aI:181.3,aD:269.1,r0:5.5/ES,U:0.14,land:0.05,B:0.55,tsT:0.06,tsH:0.3,TF:68,MU:0.15,
    I:578.5,JW:5.9,W78:0.770,hD:0.95,EB:128,ET:180,ID:2.67,eS:0.3,HS:0};
  for(const k in o)if(!(k in DEF))throw Error('makeEsc: no setting '+k);
  const c={...DEF,...o},NT=16,P=TAU/NT,EX=c.EX,A0=c.A*D2R,rRoll=c.rRoll,rp=c.rp,rT=c.rT,rd=c.rd,rDR=c.rDR,wI=c.wI,wD=c.wD,rho=c.tsT/2/ES,dL=c.dL,r0=c.r0,U=c.U,DRAW=c.DRAW*D2R,t0=P/2,lockA=t0-2*P,aI=c.aI*D2R,aD=c.aD*D2R;
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
  /* contact tables over the balance angle, from the shapes. The discharge jewel is a slab wD thick from the staff out to its reach, its end square at the acting
     face (+m, leading on the active swing) and rounded rB at its back (-m); the passing spring's tip is a disc rho round, moving along a line: along nH as the detent lifts (the horn backs the spring), along -nB as the trip spring bends.
     Where that line runs through the jewel (grown by the tip's radius: its corners rounded rho and rB + rho), the jewel holds the tip at the run's far end. Active swing (th rising): the jewel's face pushes
     the tip, and with it the detent, the tip sliding along the face and round the jewel's end until it comes clear; the detent then falls back to its stop. Return swing
     (th falling): the jewel bends the trip spring the same way, the detent staying on its stop, until the tip comes clear. Until 11 October 2026 the end was square and the
     detent was let fall over 1.5° once the tip slid off the face, through the jewel's end, and until 12 October 2026 a half round; tools/dynamics.js checks these tables beat by beat */
  const TH0=-70*D2R,DT=0.02*D2R,NTB=5001,LI=new Float32Array(NTB),PS=new Float32Array(NTB),reach=rd+0.5*rho,wJ=wD/2+rho,cA=rho,cB=Math.min(c.rB+rho,wJ);
  /* the run (s1, s2) of the line Pt + s dir inside the jewel at balance angle th, or null */
  const span=(th,dir)=>{const u={x:Math.cos(aD+th),y:Math.sin(aD+th)},m={x:-u.y,y:u.x},pm=Pt.x*m.x+Pt.y*m.y,dm=dir.x*m.x+dir.y*m.y,pu=Pt.x*u.x+Pt.y*u.y,du=dir.x*u.x+dir.y*u.y;
    /** @type {number[]|null} */let r=null;const add=(a,b)=>{if(a<b)r=r?[Math.min(r[0],a),Math.max(r[1],b)]:[a,b];};
    const box=(m0,m1,u1)=>{let lo=-Infinity,hi=Infinity;const cut=(p,d,a,b)=>{if(Math.abs(d)<1e-12){if(p<=a||p>=b){lo=1;hi=0;}return;}let x=(a-p)/d,y=(b-p)/d;if(x>y)[x,y]=[y,x];lo=Math.max(lo,x);hi=Math.min(hi,y);};
      if(m0<m1){cut(pm,dm,m0,m1);cut(pu,du,0,u1);add(lo,hi);}};
    const disc=(cu,cm,R)=>{const cx=Pt.x-cu*u.x-cm*m.x,cy=Pt.y-cu*u.y-cm*m.y,b=cx*dir.x+cy*dir.y,q=b*b-(cx*cx+cy*cy-R*R);if(q>0)add(-b-Math.sqrt(q),-b+Math.sqrt(q));};
    box(-wJ+cB,wJ-cA,reach);box(-wJ,-wJ+cB,reach-cB);box(wJ-cA,wJ,reach-cA);disc(reach-cB,-wJ+cB,cB);disc(reach-cA,wJ-cA,cA);   /* the grown outline as boxes and its corners' discs: convex, so the run is their runs' hull */
    return r;};
  /* the tip held at the run's far end while the jewel is round it, from where the run first takes in the tip's rest to where the jewel has passed it; T: the travel */
  const scan=(T,dir,i0,di)=>{let s=0,on=false,done=false,iOff=null;for(let i=i0;i>=0&&i<NTB;i+=di){const r=done?null:span(TH0+i*DT,dir);
      if(on){if(r&&r[0]<s&&r[1]>0)s=r[1];else{on=false;done=true;s=0;iOff=i;}}else if(!done&&r&&r[0]<0&&r[1]>0){on=true;s=r[1];}
      T[i]=s;}return iOff;};
  const iOff=scan(LI,nH,0,1),iPass=scan(PS,{x:-nB.x,y:-nB.y},NTB-1,-1);
  const thOff=iOff===null?null:TH0+iOff*DT,thPass=iPass===null?null:TH0+iPass*DT;   /* where the tip comes clear: the detent falls back (active swing), the trip spring flies back (return swing) */
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
  /* the unlocking's recoil: the locked tooth's tip rests on the stone's flat, set at DRAW, so drawing the stone out pushes the tooth back along the flat (the wheel recoils,
     which the work counts as cdr below) until the flat's inner end has passed the tip, which then rides round the stone's edge until the stone is clear (lRel). toothBack(l):
     the tooth tip's angle with the stone lifted l, from the shapes: the most forward place where no point of the stone is inside the tooth (its tip at r 1, its undercut face
     below it, as bite); RC: the wheel's turn back from its locked place over the lift (until 11 October 2026 the wheel stood still and the stone passed 0.007 mm into the tip) */
  const toothBack=l=>{let a=-Infinity;const q=stone.map(s=>rot(s,l)),n=q.length;
    for(let k=0;k<n;k++){const p0=q[k],p1=q[(k+1)%n],m=Math.max(2,Math.ceil(Math.hypot(p1.x-p0.x,p1.y-p0.y)/2e-4));
      for(let j=0;j<=m;j++){const x=p0.x+(p1.x-p0.x)*j/m-EX,y=p0.y+(p1.y-p0.y)*j/m,r=Math.hypot(x,y);if(r<=1&&r>=r0)a=Math.max(a,Math.atan2(y,x)-U*P*(1-r)/(1-r0));}}
    return a;};
  /* past the flat's end the tip slides round the stone's edge and is free about 0.025 mm short of lRel, which keeps 0.02 mm to spare (above): the tooth is held at its
     locked place over that last stretch, the release taken at lRel as everywhere else in the model */
  const NL=300,a00=toothBack(0),RC=new Float64Array(NL+1);for(let j=0;j<=NL;j++){const b=toothBack(lRel*j/NL);RC[j]=b>-1e8?Math.max(0,b-a00):0;}
  const recoil=l=>{const f=Math.min(1,Math.max(0,l/lRel))*NL,j=Math.min(NL-1,Math.floor(f));return RC[j]+(RC[j+1]-RC[j])*(f-j);};
  /* the stone riding the escaping tooth: a detent that falls back before the tooth has passed (a swing larger than the drive keeps: after a jolt, or while the key turns
     and only the sustaining spring drives) lands on its land or hollow back and rides it down. SR: the least lift that keeps the stone out of the escaping tooth with its
     tip at lockA + φ, φ from 0 to -P (the stone's outline sampled every 1e-3, inside the tooth's; the tooth's corners inside the stone's), by bisection */
  const NQ=400,SR=new Float64Array(NQ+1),stE=[],pin=(q,pl)=>{let k=false;for(let i=0,j=pl.length-1;i<pl.length;j=i++){const a=pl[i],b=pl[j];if((a.y>q.y)!==(b.y>q.y)&&q.x<(b.x-a.x)*(q.y-a.y)/(b.y-a.y)+a.x)k=!k;}return k;};
  for(let k=0;k<stone.length;k++){const a=stone[k],b=stone[(k+1)%stone.length],m=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/1e-3));for(let j=0;j<m;j++)stE.push({x:a.x+(b.x-a.x)*j/m,y:a.y+(b.y-a.y)*j/m});}
  { const hits=(l,tp)=>{for(const s of stE){const r=rot(s,l);if(Math.hypot(r.x-EX,r.y)<1&&pin(r,tp))return true;}const st=stone.map(s=>rot(s,l));for(const v of tp)if(Math.hypot(v.x-EX,v.y)>0.95&&pin(v,st))return true;return false;};
    for(let j=1;j<=NQ;j++){const tp=toothPts(lockA-P*j/NQ).map(([r,g])=>({x:EX+r*Math.cos(g),y:r*Math.sin(g)}));if(!hits(0,tp))continue;let lo=0,hi=0.1;for(let i=0;i<20;i++){const m=(lo+hi)/2;hits(m,tp)?lo=m:hi=m;}SR[j]=hi;} }
  const ride=pr=>{const f=Math.min(1,Math.max(0,pr))*NQ,j=Math.min(NQ-1,Math.floor(f));return Math.max(SR[j],SR[j+1]);};   /* the higher of the two either side: the stone never inside */
  /* state at balance phase p (0..1 over one 0.5 s oscillation, 0 the active swing's start): balance angle, detent lift, passing-spring deflection, escape-wheel tooth progress.
     amp: the swing's amplitude in radians (A, the running amplitude, by default); smaller while the balance starts or runs down. Below the angle that unlocks
     the detent, completes the impulse and passes the trip spring (AMIN) the wheel stays locked, which the caller keeps (the progress it reports assumes a running escapement).
     A swing that doesn't carry the discharge jewel back past the trip spring's tip (amp below -thPass) never gets it behind the spring to unlock: the spring stays bent
     against the jewel and follows it back, and the detent stays on its stop. drop: the wheel runs free, between release and the tooth landing on the impulse jewel.
     Released, the wheel starts from rest and gathers speed under its torque (s times the calibrated) against its own and the train's inertia, chasing the jewel (chase).
     While the stone lifts, the locked tooth recoils (recoil); the detent falls back to its stop in time, as a body (detLift); the tooth leaving the impulse jewel runs on
     to the stone from where and how fast the jewel let it go (run). Until 11 October 2026 the phase's start (p 0, where sin(2πp) is 0) counted as the return swing, the
     train a tooth ahead for that instant */
  /** @param {number} p the phase, 0 to 1 @param {number} [amp] the amplitude (rad) @param {number} [s] the drive, times the calibrated @returns {EscState} */
  function state(p,amp=A,s=1){
    const q=p-Math.floor(p),th=-amp*Math.cos(TAU*q),ccw=q<0.5,pass=thPass!==null&&amp>=-thPass;
    const psDef=ccw&&pass?0:tab(PS,th);let lift=ccw&&pass?detLift(q,th,amp):0,prog,drop=false,run=false;
    if(ccw&&pass&&th>thRel){const pf=chase(th,amp,s);
      if(th>thE&&chase(thE,amp,s)<phE){const t=(Math.acos(Math.max(-1,Math.min(1,-th/amp)))-Math.acos(Math.max(-1,Math.min(1,-thE/amp))))/W0,wE=W0*Math.sqrt(Math.max(0,amp*amp-thE*thE)),
          phi=phE+gE*wE*t-0.5*s*accW*t*t;prog=phi<=-P?1:-phi/P;run=phi>-P;}   /* off the jewel (it landed before thE): on at the jewel's speed, gathering more, to the stone */
      else{const a=bite(th),pa=a>-1e8?a-t0:-1e9,phi=Math.max(pf,pa);prog=phi<=-P?1:-phi/P;drop=pf>pa&&phi>-P;}}
    else prog=ccw&&pass&&lift>0?-recoil(lift)/P:ccw?0:1;
    if(prog>0&&prog<1){const f=depart(amp);if(f&&q>f.p)lift=Math.max(lift,ride(prog));}   /* fallen back before the escaping tooth has passed: on its back */
    return{th,ccw,lift,psDef,prog,drop,run};
  }
  /* passing spring as root, control point and tip (unit frame) for a state: rides with the detent, tip bent along -nB on the return swing */
  /** @param {{lift:number,psDef:number}} s @returns {[{x:number,y:number},{x:number,y:number},{x:number,y:number}]} */
  function springPts(s){const a0=rot(Ps0,s.lift),am=rot({x:(Ps0.x+Pt.x)/2,y:(Ps0.y+Pt.y)/2},s.lift),tp=rot(Pt,s.lift);tp.x-=nB.x*s.psDef;tp.y-=nB.y*s.psDef;return[a0,am,tp];}
  /* plan outlines in detent coordinates (t along the detent from Ft, n toward nB), after Fig. 90 and the detent photograph in chronometerbook post 4.
     Moving (rotate about Ft by -lift/LEN): two-strip detent spring, cross-piece, blade, jewel block, arm, horn, Z bracket. Fixed: foot, support block (shortened to clear the train pillar behind it) and stop button */
  const rect=(t0,t1,n0,n1)=>[D(t0,n0),D(t1,n0),D(t1,n1),D(t0,n1)],tR=(Ps0.x-Ft.x)*dirB.x+(Ps0.y-Ft.y)*dirB.y,nR=(Ps0.x-Ft.x)*nB.x+(Ps0.y-Ft.y)*nB.y;
  const tH=tR+1.2-(rd+0.038-rT);   /* horn's inner face: 0.25 mm outside the discharge jewel's reach */
  const brO=nR+0.015+0.36/ES;   /* the angle bracket's upright leg, 0.36 mm thick (estimated), to take the trip spring's screw: its outer face */
  const thick=(pts,w)=>{const L2=[],R2=[];pts.forEach((p,i)=>{const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy);L2.push({x:p.x-dy/l*w,y:p.y+dx/l*w});R2.push({x:p.x+dy/l*w,y:p.y-dx/l*w});});return L2.concat(R2.reverse());};
  const SPL=0.58,SPN=[-0.058,-0.046];   /* the detent spring: its length to the cross-piece and its thickness across (unit frame), which set its stiffness below */
  const pieces={
    spring:rect(0,SPL,SPN[0],SPN[1]),cross:rect(0.58,0.68,-0.075,0.083),blade:rect(0.66,BL-0.07,-0.06,-0.03),block:rect(BL-0.08,BL+0.08,-0.08,0.08),
    arm:thick([D(BL+0.06,0),D(BL+0.2,0),D(tH-0.025,nR+rho-0.03),D(tH-0.025,nR+rho),D(tH-0.025,nR+rho+0.05)],0.025),horn:rect(tH-0.05,tH,nR+rho,nR+rho+0.05),   /* the arm ends square over the horn, their outlines one */
    bracket:[D(0.58,0.083),D(0.68,0.083),D(0.68,nR+0.015),D(tR+0.06,nR+0.015),D(tR+0.06,brO),D(0.58,brO)],   /* its leg continues the cross-piece (same t); its upright leg 0.36 mm thick, to take the trip spring's screw (brO: its outer face) */
    stone
  };
  /* the detent-adjusting screw (Fig. 90; Ops. 84, 93): threaded into the block's end, its head (r 0.9 mm, 0.45 thick, 0.3 mm off the block) standing 0.3 mm deep in a slot
     across the foot, which runs on 0.6 mm past it, so turning it slides the detent along; adj: the head's inner and outer faces (t) and its centre (n) */
  /* BE and blockMain's far end: the block's top face from t -10.5 to +3.85 mm, 3.1 wide (KLUwI2UUCMQ 11:26.435 and 11:33.443, the block held up, scaled by its two
     positioning pins' 11.45 mm: ends 1.3 past each pin; Fig. 90 at the same scale gives -10.8 to +3.5 and 3.07); -15 to +5.92 and 2.74, read from Fig. 90 by another scale,
     until 5 October 2026. The detent's foot and its adjusting screw end with the block's end, as before */
  const BE=-10.5/ES,BM=3.85/ES,aS=BE-0.3/ES,aH=aS-0.45/ES,aN=-0.083+(0.3-0.9)/ES,adj={tS:aS,tH:aH,n:aN,r:0.9,BE},sDp=-0.083+0.35/ES,fE=aH-0.63/ES;
  /* blockFront: split along its length by a slot open at the stop button's end (Fig. 90), so the button stands on a strip sprung from the block's root: the lock-adjusting
     screw, threaded in the outer part, bears on the strip and moves the button ("working through the locking jewel button", Sec. IV); the clamp screw, through the outer
     part into the strip, holds it. The slot and strip in Fig. 90's proportions of the front (0.24 and 0.36 mm) */
  const fixed={foot:[D(fE,-0.083),D(aH-0.03/ES,-0.083),D(aH-0.03/ES,sDp),D(aS,sDp),D(aS,-0.083),D(0,-0.083),D(0,0.083),D(fE,0.083)],blockMain:rect(BE,BM,-0.083-3.1/ES,-0.083),blockFront:[D(BM,-0.3),D(BL-0.1,-0.3),D(BL-0.1,-0.173),D(BM+0.03,-0.173),D(BM+0.03,-0.137),D(BL-0.1,-0.137),D(BL-0.1,-0.083),D(BM,-0.083)],button:rect(BL-0.2,BL-0.1,-0.083,-0.06)};
  /* the running amplitude A and the escapement's rate (the adjuster's bench changes both), from the work done each oscillation in units of the hairspring's stiffness k (rad²).
     The impulse: released from rest, the wheel and the train behind it (JW) gather speed under the torque w k (w: the torque over k) and chase the impulse jewel, already running
     away from it; the tooth strikes it (plastically: the balance, so much heavier, takes the wheel's surplus momentum, J v_j (v_w - v_j) of energy at the landing, v_w the
     wheel's speed, v_j the jewel's in the wheel's measure) and then drives it, w times the wheel's turn less what speeding the wheel up along with the jewel takes (J Δ(v_j²)/2,
     lost when the next tooth locks). Less the unlocking: the locking jewel drawn back against the tooth and rubbing on it (dL(tan DRAW+MU)/(1-MU tan DRAW) of the wheel's turn,
     over the lift to release); the detent lifted against Op. 78's preload and its spring's stiffness all the way the jewel carries it (lost as it falls back); the trip spring
     bent on the return (lost as it flies back). The swing loses πA²/Q a time, Q = πTF/T from the free run-down TF. w is fitted at the model's settings so that there A is c.A
     (and the rate the reference, 0); the springs are their own. Rate: Airy's result, each push of energy e (in units of k) at θ advancing the phase by -e θ/(A²√(A²-θ²)) an
     oscillation: before the dead point a push gains and a resistance loses, after it the reverse. In s a day against the reference. tools/dynamics.js checks all of this
     beat by beat; until 11 October 2026 the wheel moved as a kinematic gear (G 3.5 times the balance's angle from release, landing 0.6° after it) and the springs' work was fitted */
  let a0=null;for(let i=0;i<NTB;i++)if(LI[i]>0){a0=TH0+i*DT;break;}                                // unlocking swing: discharge jewel meets the trip spring
  const T=0.5,W0=TAU/T,Q=Math.PI*c.TF/T,kB=c.I*1e-9*W0*W0,JR=c.JW/c.I/(W0*W0),esm=ES/1000;   /* kB: the hairspring (N·m a radian); JR: the wheel's inertia over k (s²), so its energy J v²/2 is JR v²/2 in units of k */
  const MP=c.W78*1e-3*9.80665*Math.hypot(Jc.x-Ft.x,Jc.y-Ft.y)*esm/kB,KD=c.EB*1e9*c.hD*1e-3*((SPN[1]-SPN[0])*esm)**3/12/(SPL*esm)/kB;   /* the detent's preload and stiffness about its flexure, over k */
  const KP=3*c.ET*1e9*(c.tsH*1e-3*(c.tsT*1e-3)**3/12)/(Math.hypot(Pt.x-Ps0.x,Pt.y-Ps0.y)*esm)**3*esm*esm/kB;   /* the trip spring at its tip, a cantilever, over k (its tip's travel in units) */
  const CAL=['EX','A','TF','MU','I','JW','W78','hD','EB','ET','tsH'],isRef=Object.keys(o).every(k=>CAL.includes(k)||Math.abs(o[k]-DEF[k])<1e-9),RF=/** @type {any} */(makeEsc).refs||(/** @type {any} */(makeEsc).refs={}),rk=CAL.map(k=>c[k]).join();
  const PA=new Float64Array(NTB);for(let i=0;i<NTB;i++){const b=bite(TH0+i*DT);PA[i]=b>-1e8?b-t0:NaN;}   /* the wheel's angle the impulse jewel holds it at */
  const gP=i=>{const a=PA[i-1],b=PA[i+1],m=PA[i];return!isNaN(a)&&!isNaN(b)?(b-a)/(2*DT):!isNaN(b)&&!isNaN(m)?(b-m)/DT:!isNaN(a)&&!isNaN(m)?(m-a)/DT:0;};
  const iRel=Math.round((thRel-TH0)/DT);
  /* the wheel's angle from its locked place (0 to -P), running free from the release at balance angle th, amplitude amp, drive s */
  let accW=0;const chase=(th,amp,s)=>{const t=(Math.acos(Math.max(-1,Math.min(1,-th/amp)))-Math.acos(Math.max(-1,Math.min(1,-thRel/amp))))/W0;return-0.5*s*accW*t*t;};
  /* one impulse at amplitude a, drive s and torque w: the landing, the strike and the drive as pushes [θ, energy/k]; null if the tooth never lands or the swing turns first */
  const impulse=(s,a,w)=>{if(thRel>=a||!(w>0))return null;const acc=s*w/JR,aR=Math.acos(Math.max(-1,-thRel/a)),sp=th=>W0*Math.sqrt(Math.max(0,a*a-th*th));
    let land=null,pp=NaN,pf0=0;for(let i=iRel;i<NTB-1;i++){const th=TH0+i*DT;if(th>=a)return null;const t=(Math.acos(-th/a)-aR)/W0,pf=-0.5*acc*t*t,pa=PA[i];
      if(!isNaN(pa)&&pf<=pa){const f=isNaN(pp)?1:(pf0-pp)/((pf0-pp)-(pf-pa)),tl=th-DT*(1-f);land={i,th:tl,vw:acc*(Math.acos(-tl/a)-aR)/W0};break;}
      if(pf<=-P)return null;pp=pa;pf0=pf;}
    if(!land)return null;
    const vj=i=>Math.abs(gP(i))*sp(TH0+i*DT),v0=vj(land.i),Es=land.vw>v0?JR*v0*(land.vw-v0):0,I=[[land.th,Es]];let E=Es,turn=0,end=null,vPrev=v0;
    for(let j=land.i;j<NTB-1;j++){const t2=TH0+(j+1)*DT;if(t2>=a)break;const p1=PA[j],p2=PA[j+1];if(isNaN(p1)||isNaN(p2)){end=TH0+j*DT;break;}   /* the tooth leaves the jewel: it runs on free to the locking stone */
      const d=p1-Math.max(p2,-P),v2=vj(j+1),e=s*w*d-JR*(v2*v2-vPrev*vPrev)/2;I.push([t2-DT/2,e]);E+=e;turn+=d;vPrev=v2;if(p2<=-P){end=t2;break;}}
    return{I,E,land:land.th,end,strike:Es,turn,vw:land.vw,vj:v0};};
  /* the unlocking and the springs, the same at every amplitude */
  const R=[],Dp=[],Dk=[],Tp=[],cdr=dL*(Math.tan(DRAW)+c.MU)/(1-c.MU*Math.tan(DRAW));let rs=0;
  if(a0!==null&&released&&thOff!==null&&thPass!==null)for(let i=0;i<NTB-1;i++){const th=TH0+i*DT,m=th+DT/2;
    if(th>=a0&&th+DT<=thRel){const d=Math.min(LI[i+1],lRel)-Math.min(LI[i],lRel);if(d>0){R.push([m,d]);rs+=d;}}
    if(th>=a0&&i+1<iOff){const d1=LI[i]/LEN,d2=LI[i+1]/LEN;if(d2!==d1){Dp.push([m,MP*(d2-d1)]);Dk.push([m,KD*(d2*d2-d1*d1)/2]);}}   /* the detent's preload and stiffness, as far as the jewel carries it */
    if(i>iPass){const p1=PS[i],p2=PS[i+1];if(p1!==p2)Tp.push([m,KP*(p1*p1-p2*p2)/2]);}}   /* the trip spring bent on the return (θ falling) */
  if(rs>0)for(const r of R)r[1]*=cdr/rs;
  const sum=g=>g.reduce((s,r)=>s+r[1],0),ER=sum(R),EDp=sum(Dp),EDk=sum(Dk),ETp=sum(Tp),ok=R.length>0&&thPass!==null;
  const wnK=(s,a,w,kd=1,kp=1)=>{const im=ok?impulse(s,a,w):null;return im?im.E-s*w*ER-EDp-kd*EDk-kp*ETp:-Infinity;};
  /* phase gained an oscillation (rad) at amplitude a: the impulse pushes with the swing (+θ), the unlocking against it (-θ), the trip spring against the return (+θ) */
  const airy=(g,s,a)=>{let q=0;for(const[th,e]of g)if(Math.abs(th)<a)q+=s*e*th/Math.sqrt(a*a-th*th);return-q/(a*a);};
  const parts=(a,s,w,kd=1,kp=1)=>{const im=impulse(s,a,w);return im?{imp:airy(im.I,1,a),draw:s*w*airy(R,-1,a),detent:airy(Dp,-1,a)+kd*airy(Dk,-1,a),trip:kp*airy(Tp,1,a)}:null;},sumP=p=>p.imp+p.draw+p.detent+p.trip,day=x=>86400*x/TAU;
  const aLo=Math.max(-thRel,-(thPass??TH0))+0.01*D2R;
  /* the swing the drive s keeps up: πa²/Q = Wn(a), the root above where the escapement can work; 0 if there is none */
  const solveA=(s,w,kd=1,kp=1)=>{const g=a=>wnK(s,a,w,kd,kp)-Math.PI*a*a/Q;if(!(g(aLo)>0))return 0;let lo=aLo,hi=TAU*1.5;if(g(hi)>0)return hi;for(let i=0;i<44;i++){const m=(lo+hi)/2;g(m)>0?lo=m:hi=m;}return(lo+hi)/2;};
  let run,CL=null,PH0=0;
  if(isRef){let cl=null,ph=0,br=null;if(ok){const g=w=>wnK(1,A0,w)-Math.PI*A0*A0/Q;let lo=Math.log(1e-3),hi=Math.log(1e3);if(g(Math.exp(lo))<0&&g(Math.exp(hi))>0){for(let i=0;i<60;i++){const m=(lo+hi)/2;g(Math.exp(m))>0?hi=m:lo=m;}
      cl={w:Math.exp((lo+hi)/2)};br=parts(A0,1,cl.w);ph=br?sumP(br):0;}}
    RF[rk]={cl,ph};CL=cl;PH0=ph;run={A:A0,rate:0,own:day(ph),parts:br,cl};}
  else{const R0=RF[rk]||(/** @type {any} */(makeEsc)(Object.fromEntries(CAL.map(k=>[k,c[k]]))),RF[rk]),cl=R0.cl;CL=cl;PH0=R0.ph;
    const a=cl?solveA(1,cl.w):0,br=a>0?parts(a,1,cl.w):null;run={A:a,rate:br?day(sumP(br)-R0.ph)+c.HS*(a-A0)/D2R/10:NaN,own:br?day(sumP(br)):NaN,parts:br,cl};}
  if(CL)accW=CL.w/JR;
  /* the tooth leaves the impulse jewel at thE (where the jewel's tip passes out of the teeth's path, or the tooth reaches the stone on it), at phE, moving with the jewel
     (gE: the wheel's turn a radian of the balance there, over the last 0.1 deg); state runs it on from there to the stone (until 11 October 2026 it reached the stone at once) */
  let iE=null;for(let i=iRel+1;i<NTB-1;i++)if(!isNaN(PA[i])&&PA[i]>-P&&(isNaN(PA[i+1])||PA[i+1]<=-P)){iE=i;break;}
  const thE=iE===null?Infinity:TH0+iE*DT,phE=iE===null?0:PA[iE],gE=iE===null||isNaN(PA[iE-5])?0:(PA[iE]-PA[iE-5])/(5*DT);
  /* the detent's fall back to its stop button (since 11 October 2026: it went home in one step of the table where the passing spring's tip leaves the jewel, the stone
     standing in the escaping tooth's way for about 0.6 ms). Carried by the jewel, it leaves it where the jewel's end runs away faster than the detent can follow (its
     preload MP and stiffness KD against its inertia ID: the jewel's surface accelerating as LI's curvature times the balance's speed squared, plus its slope times the
     balance's acceleration); then it falls as a preloaded spring and mass, d = (d0 + e) cos ωt + (v0/ω) sin ωt - e (d the detent's angle, e = MP/KD, ω² = KD/ID), lands on
     the button and rebounds eS of its speed, each hop in closed form, until a hop is under a micrometre at the passing spring's tip. Its own damping (Q about 100,
     tools/dynamics.js) is left out. depart(amp): where it leaves the jewel at that swing (phase p, balance angle th, the detent's angle d0 and speed v0 in rad/s, and the
     balance's angle where it first lands on its stop), remembered by the swing to 1e-5 rad */
  const IDk=c.ID*1e-9/kB,eD=MP/KD,wDt=Math.sqrt(KD/IDk),depM=new Map();let iPk=0;for(let i=0;i<(iOff??0);i++)if(LI[i]>LI[iPk])iPk=i;
  /** @param {number} amp @returns {{p:number,d0:number,v0:number,th:number,land:number}|null} */
  const depart=amp=>{const k=Math.round(amp*1e5);let r=depM.get(k);if(r!==undefined)return r;r=null;
    if(iOff!==null&&amp>-thOff)for(let i=Math.max(1,iPk);i<iOff;i++){const th=TH0+i*DT,w=W0*Math.sqrt(Math.max(0,amp*amp-th*th)),last=i+1>=iOff,
      l1=last?(LI[i]-LI[i-1])/DT:(LI[i+1]-LI[i-1])/(2*DT),l2=last?-Infinity:(LI[i+1]-2*LI[i]+LI[i-1])/(DT*DT);
      if((l2*w*w-l1*W0*W0*th)/LEN<-(MP+KD*LI[i]/LEN)/IDk){const p=Math.acos(-th/amp)/TAU,d0=LI[i]/LEN,v0=l1*w/LEN,a0=Math.acos(-th/amp);
        let j=i+1;for(;j<iOff;j++){const t=(Math.acos(Math.max(-1,Math.min(1,-(TH0+j*DT)/amp)))-a0)/W0;if(t<fall1(d0,v0)&&fallD(d0,v0,t)*LEN<LI[j])break;}   /* off the acting corner, it falls back onto the jewel's end: carried on from there */
        if(j<iOff){i=j-1;continue;}r={p,d0,v0,th,land:-amp*Math.cos(TAU*(p+fall1(d0,v0)/T))};break;}}
    if(depM.size>4000)depM.clear();depM.set(k,r);return r;};
  /* the detent's angle t s after it leaves the jewel at d0, v0; fall1: the time it takes to reach its stop */
  const fall1=(d0,v0)=>(Math.atan2(v0/wDt,d0+eD)+Math.acos(Math.min(1,eD/Math.hypot(d0+eD,v0/wDt))))/wDt;
  const fallD=(d0,v0,t)=>{const R0=Math.hypot(d0+eD,v0/wDt),t1=fall1(d0,v0);
    if(t<t1)return(d0+eD)*Math.cos(wDt*t)+v0/wDt*Math.sin(wDt*t)-eD;
    t-=t1;let v=c.eS*wDt*Math.sqrt(Math.max(0,R0*R0-eD*eD));
    while(v>0&&(Math.hypot(eD,v/wDt)-eD)*LEN>1e-3/ES){const tau=2*Math.atan(v/(wDt*eD))/wDt;if(t<tau)return eD*(Math.cos(wDt*t)-1)+v/wDt*Math.sin(wDt*t);t-=tau;v*=c.eS;}
    return 0;};
  /* the lift shown at phase q of the active swing: the jewel's (the table) until the detent leaves it, then the higher of the jewel's and the detent's fall */
  const detLift=(q,th,amp)=>{const l=tab(LI,th),f=depart(amp);if(!f||q<=f.p)return l;return Math.max(th<thOff?l:0,fallD(f.d0,f.v0,(q-f.p)*T)*LEN);};
  /* the detent home: the balance's angle where it lands on its stop for good at swing amp (for tools/escapement.js and dynamics.js) */
  const homeAt=amp=>{const f=depart(amp);if(!f)return null;for(let q=f.p;q<0.5;q+=2e-6)if(detLift(q,-amp*Math.cos(TAU*q),amp)===0){let z=q+2e-6;while(z<0.5&&detLift(z,-amp*Math.cos(TAU*z),amp)>0)z+=2e-6;if(z-q<4e-6)return-amp*Math.cos(TAU*q);q=z;}return null;};
  /* AMIN: the least amplitude that keeps the escapement going: the swing must carry the discharge jewel past the trip spring on the return (where it comes clear, thPass),
     unlock the wheel (thRel) and see the impulse to its end before it turns. Below it the balance swings on without unlocking. Exactly so: the 2 degrees it was given to spare
     until 11 October 2026 had the train held while state showed the detent unlocking between 40.2 and 42.3 deg */
  let AMIN=Math.max(-thRel,-(thPass??TH0));
  if(CL){const ok=a=>{const im=impulse(1,a,CL.w);return!!im&&im.end!==null&&im.end<a;};let a=AMIN;if(!ok(a)){let lo=a;while(a<TAU&&!ok(a)){lo=a;a+=0.25*D2R;}for(let i=0;i<30;i++){const m=(lo+a)/2;ok(m)?a=m:lo=m;}}AMIN=a;}
  /* the train held (run down, or the dog point holding it), the balance swinging free: no impulse and no draw (no torque on the stone), but a swing that carries the discharge
     jewel back past the trip spring (AH, -thPass) still bends the trip spring on the return and lifts the detent on the next swing, EH of its energy an oscillation (units of k),
     lost as each flies back. freeStep(a, dt): the swing dt seconds on, A² falling as d(A²)/dt = -2A²/TF - 2EH/T above AH and -2A²/TF below it, in closed form for any step
     (app.js's ampStep; until 11 October 2026 the viscous part alone, exp(-t/TF) at every swing, where the springs take more than the air and pivots below
     about 105 deg: from 255 deg it reaches AH in 47 s, not 96) */
  const EH=EDp+EDk+ETp,AH=thPass===null?Infinity:-thPass;
  const freeStep=(a,dt)=>{if(!(dt>0)||!(a>0))return a;let u=a*a;const h=AH*AH,cc=EH*c.TF/T;
    if(u>h&&EH>0){const tx=c.TF/2*Math.log((u+cc)/(h+cc));if(dt<=tx)return Math.sqrt(Math.max(0,(u+cc)*Math.exp(-2*dt/c.TF)-cc));dt-=tx;u=h;}
    return Math.sqrt(u*Math.exp(-2*dt/c.TF));};
  if(run.A>0&&run.A<AMIN){run.rate=NaN;run.own=NaN;}
  if(CL&&run.A>0){const im=impulse(1,run.A,CL.w);if(im)Object.assign(run,{Q,Wi:im.E,fu:(CL.w*ER+EDp+EDk+ETp)/im.E,land:im.land,end:im.end,drive:im.turn,strike:im.strike/im.E,detent:(EDp+EDk)/im.E,vw:im.vw,vj:im.vj});}
  const A=run.A;
  /* the balance's equation of motion, averaged over a swing (the model's clock keeps the phase; this gives the amplitude and the rate). The escape wheel's torque is s times
     the model's (1: the mainspring through the fusee, as calibrated): the impulse's work, the wheel's chase and the locking jewel's draw go with it, the detent and trip
     springs' don't. ampAt(s): the amplitude it settles at (πA²/Q = Wn(A), as above). In ½A² (units of k) a swing gains Wn and loses πA²/Q, so A² relaxes to ampAt(s)²
     as exp(-2t/TF) for a steady torque: the caller steps it so. rateAt(a, s): the escapement's rate at amplitude a, s a day against the reference at its own amplitude
     (Airy, as run.rate); NaN under AMIN. The rate's change with amplitude is the escapement's isochronism error, plus the hairspring's own, HS s a day for each 10 deg above A:
     0 by default, the spring taken as isochronous (Hamilton's Elinvar spring, held without bending at its ends, "minimum isochronal error", Sec. II); an adjuster can set the
     spring against the escapement. Both are remembered by the drive to 1e-4 (the page asks every frame) */
  const memo=new Map(),ampAt=s=>{if(!CL)return 0;const k=Math.round(s*1e4);let v=memo.get(k);if(v===undefined){v=solveA(k/1e4,CL.w);if(memo.size>4000)memo.clear();memo.set(k,v);}return v;};
  /* TRIP: a swing past a full turn and the angle where the discharge jewel meets the trip spring brings the jewel round to unlock the detent a second time in the swing: the
     wheel trips, escaping an extra tooth (app.js's jolt) */
  const TRIP=a0===null?Infinity:TAU+a0;
  const rateAt=(a,s=1)=>{if(!CL||!(a>=AMIN))return NaN;const p=parts(a,s,CL.w);return p?day(sumP(p)-PH0)+c.HS*(a-A0)/D2R/10:NaN;};
  /* atK(s, kd, kp): the swing it settles at and its rate there with the escape wheel's torque s times the model's and the detent and trip springs' stiffness kd and kp times
     the drawn (a strip's stiffness goes as its thickness cubed; the detent's preload stays Op. 78's): what a maker's error in the mainspring or the springs does
     (tools/tolerances.js). rate NaN under AMIN */
  const atK=(s,kd=1,kp=1)=>{if(!CL)return{A:0,rate:NaN};const a=solveA(s,CL.w,kd,kp);if(!(a>=AMIN))return{A:a,rate:NaN};const p=parts(a,s,CL.w,kd,kp);return{A:a,rate:p?day(sumP(p)-PH0)+c.HS*(a-A0)/D2R/10:NaN};};
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
    let tE=null;for(let k=0;k<=40000;k++){const p=0.5*k/40000;if(Math.sin(TAU*p)<=0)continue;const s=state(p,A0);if(tE===null&&(s.prog>=1||s.run)){tE=s.th;break;}}   /* the impulse's end: the tooth leaves the jewel (it then runs on to the stone) */
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
  const wn=(s,a)=>CL?wnK(s,a,CL.w):-Infinity;   /* the work an oscillation nets the balance at drive s and swing a (units of k): tools/physics.js's budget */
  return{settings:c,ES,NT,P,EX,A,A0,AMIN,TRIP,run,ampAt,rateAt,atK,wn,T,measure,checks,kB,MP,KD,KP,JR,span,PA,impulse,chase,cdr,iOff,iPass,thOff,rp,rRoll,rd,rT,rDR,wI,wD,rho,t0,aI,aIc,aD,S,Ft,Pt,Ps0,LEN,nH,nB,dirB,BL,tR,nR,tH,brO,D,pieces,fixed,adj,state,springPts,toothPts,r0,U,Jc,nF,rJ,lRel,thRel,thPass,LI,PS,TH0,DT,bite,recoil,toothBack,thE,phE,gE,depart,fallD,homeAt,EH,AH,freeStep,lockA};
}
if(typeof module!=='undefined')module.exports={makeEsc};
