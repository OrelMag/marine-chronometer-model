// @ts-check
/* escapement.js: the Wempe Einheits-Chronometer's balance and spring detent escapement (drawing groups 05 03 and 05 04), built from the sheets as last revised
   (References/wempe/transcriptions/05-03-05-04-balance-escapement.md, checked on the sheets themselves, cropped and enlarged where a number mattered). Part of the Wempe
   model (three.js r128). Declares only WESC: WESC.ESC, the escapement's motion (makeEsc's, solved in time, once js/escphys.js has called WESC.adapt; the layout's
   kinematic motion ESC.layout), and WESC.build(mv, M, K), which adds the parts to the
   movement group and returns update(s) for movement.js.
   The layout is 05 04_1 (Hemmung für Feder-Chronometer, 10:1): the balance at hole 23 and the escape wheel at hole 26 of the plates' tables, 10.00 apart (the tables give
   10.000: sure); the locking stone 7.2 from the wheel's centre (scaled), 36.5 deg on from the line of centres in the wheel's turn (scaled on the sheet, 24.4 px/mm; it is the
   angle that leaves both teeth either side of the line clear of the impulse roller when the wheel is locked, 0.05 and 0.12 mm, and the impulse 21 deg either side of the line
   of centres, the sheet's "21°", with drops of 1.7 and 2.7 deg of the wheel: inferred). The sheet's plan is seen from above (through the top plate), as the frame's sheets:
   the wheel turns clockwise there, so counterclockwise from the dial (rotation.y rising with E), and the balance the other way during the impulse.
   Heights (y, the movement frame) from the balance staff 05 04 02 (29.5.46) and the hairspring's sheets: the balance's seat (the hub's flange top, the arm on it) FY, set so
   the spring's collet sits clear over the arm with the spring 0.75 under the cock's arm (05 03_5: 3.15 and 13.4 under the stud's bar; the cock 15 high, 05 08 03-1), which
   puts the rim 0.45 over the top plate (the coloured section draws 0.53: agrees); the impulse roller under the staff's collar 5.6 below the seat (05 04 02); the escape wheel
   level with it, its arbor's pivots in both plates (05 04 05-1, 22.8 −0.02 overall). 05 04_1 (1941) and the coloured section draw the rollers about 1.4 higher: superseded by
   05 04 02's 5.6 (README). Units mm; the movement frame: dial side +y, 12 o'clock −z, 3 o'clock +x (x = the sheets' W, z = their S). Plan angles here are measured as the
   plan point (r cos a, −r sin a): counterclockwise seen from the dial. */
const WESC=(()=>{
  const H=WD.H,TT=-WD.INNER-WD.TOP_T,TI=-WD.INNER,PPT=WD.PP_T,{ring,bool,solidGeo,stadiumPts}=KIT;
  const add=(p,u,k=1)=>[p[0]+u[0]*k,p[1]+u[1]*k],sub=(p,q)=>[p[0]-q[0],p[1]-q[1]],hyp=v=>Math.hypot(v[0],v[1]),unit=v=>{const l=hyp(v);return[v[0]/l,v[1]/l];};
  const brg=b=>[-Math.sin(b*D2R),-Math.cos(b*D2R)],al=v=>Math.atan2(-v[1],v[0])/D2R,dir=a=>[Math.cos(a*D2R),-Math.sin(a*D2R)],pol=(c,r,a)=>add(c,dir(a),r),wrap=a=>((a%360)+540)%360-180;
  const V2=(a,b)=>new THREE.Vector2(a,b),smooth01=x=>{x=clamp(x,0,1);return x*x*(3-2*x);};
  /* a turned solid from [r, y] points, from the axis round to it (closed) */
  const lathe=(pr,seg=32)=>{let q=pr[0][0]>0&&pr[pr.length-1][0]>0?[...pr,pr[0]]:pr;if(KIT.area(q)<0)q=q.slice().reverse();return new THREE.LatheGeometry(q.map(([r,y])=>V2(r,y)),seg);};   /* a ring's profile closed back to its start; wound so it faces out */
  const ccw=L=>KIT.area(L)>0?L:L.slice().reverse();   /* cells of one solid all one way round, so a shared edge runs opposite ways in the two */
  /* a turned piece lying across: its axis along the plan direction d, centred at plan point p and height y */
  const across=(par,g,mt,p,d,y)=>{const m=mesh(par,g,mt,p[0],y,p[1]);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(d[0],0,d[1]).normalize());return m;};
  const C=(p,r,n=0)=>ring(p[0],p[1],r,n);

  /* ================= the layout (05 04_1) ================= */
  const W=H[26],B=H[23],aB=al(sub(B,W)),aBW=al(sub(W,B));   /* the escape wheel's and balance's centres; the line of centres seen from each */
  /* the wheel's tips Ø 14.00 (05 04_1, 05 04_23: 14 +0.03; 05 04_7.1's "D = 15,0" is the only other figure and its own drawing scales 14.1: a slip). The tooth (05 04_23, 25:1,
     its lines traced and circles fitted at 82.8 px/mm by the tips' Ø 14, the centre on the hub's bore and the gaps' floor, rms 0.25 px: sure): the gaps' floor Ø 11.7 (the
     sheet's "11,7", fitted 11.66), the locking face running straight down to it; the back the ∅ 6 cutter's arc (fitted r 3.02, its centre 9.03 from the wheel's) from the
     tip's land to Ø 12.1 (the "12,1", fitted 12.05) 15° behind the tip (the sheet's "15°", fitted 14.9), where a step 0.2 falls to the floor (its foot 15.6 behind, fitted).
     RR the floor, RB0 the step's top, BK and BF its top's and foot's angles behind the tip. Until 15 October 2026 the floor was read as Ø 12.1 (the step's top), the step
     0.15 up to Ø 12.4 and the back's foot 11.9° behind the tip: the sheet's "11,7" was taken for a recess */
  const RT=7.0,RR=5.85,RB0=6.05,BK=15.0,BF=15.6,FL=25,P_R=7.2,P_A=aB+36.5;   /* FL: the locking face's lean back from the radius through the tip (05 04_23's "25°", fitted 25.2; 15° until 15 October 2026) */
  const P=pol(W,P_R,P_A);   /* the locking stone's centre: 7.2 from the wheel's (05 04_1 scaled, 24.4 px/mm), 36.5 deg on from the line of centres (scaled; inferred above) */
  const RS=0.375,LOCK=P_R-RS,DEPTH=RT-LOCK;   /* the locking stone Ø 0.75 (05 04_1 "Ruhestein∅ 0,75": sure), half-round, its flat on the line from the wheel's centre: the tips lock 0.175 deep */
  const D0=0.01/RT/D2R;   /* the locked tooth's tip 0.01 short of the stone's flat (a contact drawn as a gap, for the tools) */
  /* the detent's own frame (t along the blade from the stone toward the foot, n across toward the wheel): the block's screw at hole 13 (the plate's table, 05 09 01) and the
     block's sheet (05 04 01-4, 8.7.43): its screw 7.3 from the end the detent's foot is clamped to, its cross screw 18.8 ±0.03 from the screw's row along the upright, which
     05 04_1 gives as the stone's distance from the block's screw ("18,8"); the detent's centre plane 0.30 off that end (half the foot's 0.60, 1436), the stone on it (1436's left
     view draws the pipe on the blade's line). With the stone where 05 04_1 puts it, the block's turn about 13 follows, and the stone lands 18.73 along from the screw's row, 0.07
     short of 18.8: fitted (README) */
  const ACR=7.3+0.30,dS=sub(H[13],P),LS=hyp(dS),ALG=Math.sqrt(LS*LS-ACR*ACR);
  const TD=(()=>{const u=unit(dS),g=-Math.atan2(ACR,ALG),t=[u[0]*Math.cos(g)-u[1]*Math.sin(g),u[0]*Math.sin(g)+u[1]*Math.cos(g)];let n=[-t[1],t[0]];if(n[0]*(W[0]-P[0])+n[1]*(W[1]-P[1])<0)n=[-n[0],-n[1]];return{t,n};})();
  const D=(t,n)=>[P[0]+t*TD.t[0]+n*TD.n[0],P[1]+t*TD.t[1]+n*TD.n[1]],toD=q=>{const v=sub(q,P);return[v[0]*TD.t[0]+v[1]*TD.t[1],v[0]*TD.n[0]+v[1]*TD.n[1]];};
  const ROW=ALG,[tB,nB]=toD(B);   /* the block screw's row along the detent; the balance's centre in the detent's frame */
  /* the detent (Gangfeder 1436, Grießbach 17.2.43; the bracketed second figures are read as the finished sizes, below): foot 6.6 long, its screw 3.35 from its upper end (pins 1.3
     and 1.15 from its ends, 4.2 apart, scaled); the spring (Federung) 5 long (scaled); the square (Viereck) 2 (sure); the blade on to the stone (8.07 here; 8.4 scaled on 1436) */
  const FOOT0=ROW-3.35,SPR0=FOOT0-5,SQ0=SPR0-2,TP=(FOOT0+SPR0)/2;   /* t: the foot's end, the spring's, the square's; TP the spring's middle, where the detent bends (05 04_1 "Biegungspunkt der Gangfeder") */
  /* the gold passing spring (Goldfeder 05 04 01-2): its free tip 1.54 from the balance's centre toward the stone and 0.08 to the wheel's side of it (05 04_1 scaled), its face toward
     the wheel pushed by the discharge stone's end; the detent's horn (1436's "Spitze") under it. The discharge stone's end reaches RD from the staff: the detent turns about TP
     until the stone has lifted 0.245, 0.07 past the depth of lock, as the stone's end leaves the gold spring's tip (inferred: the sheet scales 1.7-1.75) */
  const GT=tB+1.54,GN=nB+0.005,GW=0.15,GNF=GN+GW/2,GNB=GN-GW/2;
  const RD=Math.hypot(1.54,(DEPTH+0.07)*(TP-GT)/TP-(GNF-nB)),DSW=0.4;   /* the discharge stone's end; its width across 0.4 (scaled) */
  const GB=[6.7,0.325];   /* the gold spring's bending point (05 04_1 "Biegungspunkt der Goldfeder", 6.7 from the stone, scaled) */
  /* the impulse: the tooth's tip on the impulse stone's face, a line from the staff (05 04_6: its face on the roller's centre line), s from the staff */
  const s_=f=>{const c=Math.cos(f*D2R),dd=hyp(sub(W,B));return dd*c-Math.sqrt(Math.max(0,dd*dd*c*c-(dd*dd-RT*RT)));};
  const psiOf=f=>wrap(al(sub(pol(B,s_(f),aBW-f),W))-aB);   /* the impulsing tooth's tip angle from the line of centres (deg, in the wheel's turn) with the stone's face at f */
  const PHI0=-24;   /* the balance at rest: the impulse stone's face 24 deg before the line of centres, the discharge stone leaving the gold spring (05 04_1 as drawn: "24°") */
  const PHI_C=-21,SIMP=3.33;   /* the tooth falls on the impulse stone 21 deg before the line (05 04_1 "21°"); the stone's slanted end (05 04_6: 1.55 + 1.8) */
  const PHI_E=(()=>{let lo=0,hi=40;for(let i=0;i<60;i++){const m=(lo+hi)/2;s_(m)<SIMP?lo=m:hi=m;}return lo;})();   /* the tip leaves the stone */
  const PSI0=36.5-D0-48,PROG_C=(psiOf(PHI_C)-PSI0)/24,PROG_E=(psiOf(PHI_E)-PSI0)/24,RUN=3;   /* the impulsing tooth (two behind the locked one) starts 11.58 deg before the line */
  /* the escaping tooth's outline radius at g deg behind its tip (the back an arc r 3, 05 04_23's ∅6 cutter), for the stone that rides on it */
  const TOOTH=(()=>{const tip=[RT,0],A=pol([0,0],RT,-1.5),Bk=pol([0,0],RB0,-BK),M=[(A[0]+Bk[0])/2,(A[1]+Bk[1])/2],c=hyp(sub(A,Bk)),h=Math.sqrt(9-c*c/4),u=unit(sub(A,Bk)),pp=[-u[1],u[0]];
    const body=pol([0,0],6.7,-3.5),c1=add(M,pp,h),c2=add(M,pp,-h),cc=hyp(sub(c1,body))>hyp(sub(c2,body))?c1:c2;   /* the hollow back: its centre on the gap's side (9.03 from the wheel's centre, as 05 04_23 draws it) */
    const a0=Math.atan2(A[1]-cc[1],A[0]-cc[0]),a1=Math.atan2(Bk[1]-cc[1],Bk[0]-cc[0]);let da=a1-a0;while(da>Math.PI)da-=TAU;while(da<-Math.PI)da+=TAU;
    const arc=[];for(let i=0;i<=24;i++){const a=a0+da*i/24;arc.push([cc[0]+3*Math.cos(a),cc[1]+3*Math.sin(a)]);}   /* from the tip's back corner to the back's foot */
    const faceAt=r=>{const k=Math.cos(FL*D2R),b=2*RT*k,cq=RT*RT-r*r,ss=(b-Math.sqrt(b*b-4*cq))/2;return pol([0,0],r,-Math.atan2(ss*Math.sin(FL*D2R),RT-ss*k)/D2R);};   /* the straight face at radius r */
    const face=faceAt(RR),face0=faceAt(RB0);   /* the face leans 25 deg back from the radius: its root on the floor 5.38 deg behind the tip (05 04_23 fits 5.43; 2.43 until 15 October 2026), 4.27 deg at Ø 12.1 */
    const rAt=g=>{if(g<0)return 0;if(g<=1.5)return RT;if(g>=BK)return g<=BK+3.1?RR:0;for(let i=0;i<arc.length-1;i++){const p=arc[i],q=arc[i+1],gp=-al(p),gq=-al(q);if(g>=gp&&g<=gq){const f=(g-gp)/(gq-gp);return hyp(p)+(hyp(q)-hyp(p))*f;}}return RR;};
    return{arc,face,face0,rAt,tip,cc};})();
  const rideNeed=d=>{let s=0;const eM=Math.asin(RS/P_R)/D2R;for(let i=0;i<=24;i++){const e=eM*i/24,g=d-e;if(g<0)continue;const r=TOOTH.rAt(g);if(!r)continue;const x=P_R*Math.sin(e*D2R);s=Math.max(s,r+0.01-(P_R-Math.sqrt(Math.max(0,RS*RS-x*x))));}return s;};   /* radial lift the stone needs over the escaping tooth, its tip d deg past the flat */
  /* points along the discharge stone's end, in the detent's frame, the balance turned th deg from rest; BETA the stone's plan angle at rest (set below). The stone's end slants back 0.3 from its leading corner (the side it turns toward in the impulse) to its trailing one (scaled on 05 04_1: the end drawn bevelled), so only the
     leading corner acts and the stone leaves the spring once */
  let BETA=0;const DS=0.3,uu=Math.sqrt(RD*RD-DSW*DSW/4);
  const corners=th=>{const u=dir(BETA-th),w=[u[1],-u[0]],o=[];for(let k=0;k<=8;k++){const f=k/8;o.push(toD(add(add(B,u,uu-DS*f),w,(f-0.5)*DSW)));}return o;};   /* along the end, leading (k 0) to trailing */
  /* the active swing: how far the stone pushes the gold spring's face toward the block, and the detent's turn (rad) it makes; the return: how far it bends the spring the other way */
  const unlockAt=th=>{let l=0;for(const[t,n]of corners(th))if(t>=GT&&n<GNF+0.01)l=Math.max(l,(GNF+0.01-n)/(TP-t));return l;};   /* 0.01 kept between them */
  const passAt=th=>{let l=0;for(const[t,n]of corners(th))if(t>=GT-0.05&&n>GNB-0.01)l=Math.max(l,(n-GNB+0.01)/(GB[0]-t));return l;};
  /* BETA: the stone leaves the gold spring's tip with the balance at rest (05 04_1 as drawn) */
  {const slip=()=>{let last=null;for(let th=-40;th<=40;th+=0.005)if(unlockAt(th)>0)last=th;return last;};BETA=al(sub(D(GT,GN),B));const s0=slip();if(s0===null)console.error('WESC: the discharge stone misses the gold spring');else BETA-=s0;}
  const TH_REL=(()=>{for(let th=-40;th<=40;th+=0.005)if(unlockAt(th)*TP>=DEPTH+0.01)return th;return 0;})(),PHI_REL=TH_REL+PHI0;   /* the locked tooth is free */
  const A0=225*D2R,AMIN=(PHI_E-PHI0+RUN+1)*D2R;   /* the swing the drawing takes by default: 225 deg each side until js/escphys.js sets ESC.A to the swing the measured drive keeps (no Wempe sheet gives it; README, Physics) */
  /* the layout's own motion (kinematic, timed from 05 04_1: the tooth on the impulse stone at once, PHI_C), the page's until 15 October 2026; since then ESC.layout, the
     page moving as makeEsc solves it (adapt, below) */
  /** @param {number} p @param {number} [amp] @returns {{th:number,ccw:boolean,lift:number,psDef:number,prog:number,drop:boolean,run:boolean,p:number}} */
  function state(p,amp=ESC.layout.A){
    const q=p-Math.floor(p),th=-amp*Math.cos(TAU*q),ccw=q<0.5,thd=th/D2R,f=thd+PHI0;let lift=0,psDef=0,prog=0,drop=false,run=false;
    if(amp<AMIN)return{th,ccw,lift:0,psDef:ccw?0:passAt(thd),prog:ccw?0:1,drop,run,p};
    if(ccw){
      if(f<PHI_REL)prog=0;
      else if(f<PHI_C){prog=PROG_C*smooth01((f-PHI_REL)/(PHI_C-PHI_REL))**1.5;drop=true;}   /* released, the wheel gathers speed toward the impulse stone */
      else if(f<PHI_E)prog=(psiOf(f)-PSI0)/24;
      else{const x=clamp((f-PHI_E)/RUN,0,1);prog=PROG_E+(1-PROG_E)*x*x;run=x<1;}   /* off the stone, on to the next tooth's lock */
      const ride=prog>0&&prog<1?rideNeed(prog*24-D0)/TP:0;lift=Math.max(unlockAt(thd),ride);}
    else{prog=1;psDef=passAt(thd);}
    return{th,ccw,lift,psDef,prog,drop,run,p:q};}
  /* holes in the frame's parts for this group's screws and pins (frame.js cuts them): the detent block's two steady pins in the top plate's inner face (not in its table:
     drilled at assembly), the stud's screw in the upper cock (not on its sheet) */
  const VO=brg(75),AX=brg(345),STUD=(u,v)=>add(add(B,AX,u),VO,v),BLK_NE=-0.30,HOLES={blockPins:[D(ROW-2,BLK_NE-2.3),D(ROW+2,BLK_NE-12.3)],studScrew:STUD(4.1,4.35)};
  /** @type {any} */
  const ESC={A:A0,AMIN,state,PHI0,PHI_REL,PHI_C,PHI_E,PROG_C,PROG_E,RD,BETA:()=>BETA,TP,LOCK:DEPTH,layout:{A:A0,AMIN,state},at:null,beat:null,E:null};
  /* the hairspring's strip and coil (05 03_6, 05 03_7: below, where it is built): the terminal curves' radii to the strip's inside every 10 deg from where each leaves the coil,
     pinned at 220 deg; the strip 0.285 thick (radial: the coil bends it in that direction) and 0.52 high; the coil's middle radius RC; TURNS of helix between the curves;
     the outer curve the same as the inner (kU 1), pinned as far from the staff in the stud as the inner is in the collet; each end runs on past its pinning point into the
     collet's hole and the stud's slot (TE_L, TE_U, deg). The stud's upright leans 8° toward the axis (05 03 02-3's 98°, along the cock's slot's 82° wall), which brings its slot
     in to there: the spring 3.55 out and its pin side by side in the slot's 1.2 (likely). Until 15 October 2026 the outer curve was drawn in proportion (kU 0.883) to end 3.87
     out, where an upright square to the bar let the stud stand */
  const TBL=[6.12,6.07,6.01,5.96,5.90,5.83,5.78,5.74,5.72,5.65,5.59,5.49,5.34,5.19,5.01,4.79,4.54,4.31,4.11,3.88,3.69,3.52,3.41,3.37,3.37,3.37];
  const tbl=th=>{const i=clamp(Math.floor(th/10),0,24),f=clamp(th/10-i,0,1);return TBL[i]+(TBL[i+1]-TBL[i])*f;};
  const HT=0.285,HB=0.52,RC=12.8/2-HT/2,PITCH=0.73,RSTUD=tbl(220)+HT/2,kU=(RC-RSTUD)/(RC-(tbl(220)+HT/2)),TE_L=220+1.35/3.51/D2R,TE_U=220+0.9/RSTUD/D2R;
  const rL=th=>tbl(th)+HT/2,rU=th=>RC-(RC-rL(th))*kU;   /* the inner curve's strip middle (05 03_7's table) and the outer's (the same: kU 1) */
  const cv=(k,a,b)=>{let s=0;const n=Math.round((b-a)*10);for(let i=0;i<n;i++){const t0=a+(b-a)*i/n,t1=a+(b-a)*(i+1)/n,r0=k(t0),r1=k(t1);s+=Math.hypot((r0+r1)/2*(t1-t0)*D2R,r1-r0);}return s;};   /* a curve's length between two of its angles */
  /* the length (README, Physics: hairspring and temperature). 05 03_7: "vorm biegen der Kurve auf 13 Umgänge −3,5 mm kürzen", before bending the curve shorten to 13
     turns less 3.5 mm: the whole strip cut to 13 turns of the coil as wound (05 03_6's, its middle radius RC), less 3.5 mm, both curves then bent from its ends; the helix
     between them is what is left, TURNS (11.8). Read so, the two pinning points come out 10 deg apart in plan, where 05 03_1 and 05 03_5 draw them together (15 and 20 deg
     on 05 03_1): the 3.5 mm is what brings them in line. The sheet carries the lever chronometer's number, but its balance (05 03_1) is this one and the spring, collet and
     stud (05 03_5) are 05 03 02-1 to -3: shared (likely). Until 15 October 2026 (phase 2a) the 13 turns less 3.5 mm were read as the helix alone (12.911 turns), which
     leaves the pins 48 deg apart. HSL: the working length pin to pin and the turns for each reading (n turns less 3.5 mm of whole strip; Lh, phase 2a's) */
  const LH=Math.hypot(TAU*RC,PITCH),CV0=cv(rL,0,220)+cv(rU,0,220),TAIL=cv(rL,220,TE_L)+cv(rU,220,TE_U),turnsOf=n=>(n*TAU*RC-3.5-CV0-TAIL)/LH,TURNS=turnsOf(13);
  const HSL=(()=>{const rd=t=>({turns:t,L:t*LH+CV0,pins:wrap(360*t+440)});
    return{...rd(TURNS),n13:rd(TURNS),n14:rd(turnsOf(14)),n15:rd(turnsOf(15)),h13:rd(13-3.5/(TAU*RC)),STRIP:13*TAU*RC-3.5,TAIL,CV0,LH,HT,HB,RC,PITCH};})();
  /* the spring in plan, [r, a (deg), u] from its lower end to its upper (u its height, 0 at the lower curve, 1 at the upper), the balance turned tw (rad) at the collet,
     every st deg on the curves; pin: from pinning point to pinning point only (the working length), else end to end as drawn */
  const aVO=al(VO),a0U=aVO-220,a0L=a0U-360*TURNS,aPinL=a0L-220;
  const hsRA=(tw,pin=false,st=4)=>{const o=[],td=tw/D2R,eL=pin?220:TE_L,eU=pin?220:TE_U;
    for(let th=eL;th>0;th-=st)o.push([rL(th),a0L-th+td,0]);   /* the lower curve from its end in the collet outward */
    const n=Math.ceil(TURNS*360/st);for(let i=0;i<=n;i++){const u=i/n;o.push([RC,a0L+360*TURNS*u+td*(1-u),u]);}
    for(let th=st;th<=eU+1e-9;th+=st)o.push([rU(th),a0U+th,1]);
    o.push([rU(eU),a0U+eU,1]);return o;};
  /* hsBend(tw): the spring the page draws, [x, z, u] in plan from the collet's end to the stud's, the collet turned tw (rad, as hsRA's) and the stud held. It breathes, as the
     Hamilton's (R.spPath, movement.js): its pull on the balance taken as a pure couple (the drawn curves leave 0.018 of it on the pivots: tools/wempe_hairspring.js), the bending moment
     is the same all along the strip, so every part of it changes its curvature by tw/L and the heading at s (from the collet) turns tw(1 - s/L). The coils close as the
     collet is turned against the way they run from it and open the other way, each by tw/(2π TURNS) of its radius, 4.9 % (0.31 mm) at the model's 207° swing (12 h), concentric, the
     terminal curves curling by as much; the length is kept (each segment turns, none stretches). Built from the stud's end back, each segment turned at its middle; what
     second order leaves at the collet's end is taken out along the strip in proportion to 1 - s/L. Against the strip solved as an elastica (HSPR.large) it lies within
     0.010 mm from -300° to 300° (tools/wempe_hairspring.js checks it). Until 15 October 2026 hsRA(tw) drew it, every coil turned rigidly by tw(1 - u) at its radius: about
     1.2 mm off the elastica at the model's swing (1.7 at 300°), the strip 4.5 % longer or shorter (6.5 %) */
  const HS0=hsRA(0),HSX=HS0.map(([r,a])=>pol([0,0],r,a)),HSS=[0];for(let i=1;i<HSX.length;i++)HSS.push(HSS[i-1]+Math.hypot(HSX[i][0]-HSX[i-1][0],HSX[i][1]-HSX[i-1][1]));
  const HSLF=HSS[HSS.length-1],turnA=(x,z,d)=>{const c=Math.cos(d),s=Math.sin(d);return[x*c+z*s,z*c-x*s];};   /* turnA: a plan vector turned d (rad) the way hsRA's angles run */
  const hsBend=tw=>{const n=HSX.length,q=new Float64Array(2*n);let x=HSX[n-1][0],z=HSX[n-1][1];q[2*n-2]=x;q[2*n-1]=z;
    for(let i=n-2;i>=0;i--){const v=turnA(HSX[i+1][0]-HSX[i][0],HSX[i+1][1]-HSX[i][1],tw*(1-(HSS[i]+HSS[i+1])/2/HSLF));x-=v[0];z-=v[1];q[2*i]=x;q[2*i+1]=z;}
    const e=turnA(HSX[0][0],HSX[0][1],tw),ex=q[0]-e[0],ez=q[1]-e[1];
    return HS0.map(([,,u],i)=>{const f=HSS[i]/HSLF;return[q[2*i]-ex*(1-f),q[2*i+1]-ez*(1-f),u];});};
  const HSP={TBL,tbl,rL,rU,RC,HT,HB,PITCH,TURNS,RSTUD,kU,TE_L,TE_U,aVO,a0U,a0L,aPinL,ra:hsRA,bend:hsBend,xy:(r,a)=>pol([0,0],r,a)};
  /* ================= the escapement's settings for makeEsc (shared/escapement.js), solved in time by js/escphys.js ================= */
  /* makeEsc's frame: the balance at its origin, the escape wheel at (EX, 0), the unit the wheel's radius (ES), seen as the sheets draw the escapement (from above, through the
     top plate): the wheel turning clockwise (its angle falling), the balance's active swing anticlockwise (rising). This file's plan is seen from the dial, the other way
     round: a plan point q goes to MK(q), its angle about the balance mirrored about the line of centres and turned so that the wheel lies on -x. Each setting from this
     file's layout above (05 04_1 and the parts' sheets); makeEsc's own names for them (its header). Lengths in units of ES, angles in degrees */
  const ES_=RT,MK=q=>{const v=sub(q,B),f=(180+aBW-al(v))*D2R,r=hyp(v)/ES_;return{x:r*Math.cos(f),y:r*Math.sin(f)};},dt=(a,b)=>a.x*b.x+a.y*b.y,DST=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  const SET=(()=>{const S=MK(pol(W,RT,P_A)),F=MK(D(TP,0)),BL=DST(S,F),dB={x:(S.x-F.x)/BL,y:(S.y-F.y)/BL},nB={x:dB.y,y:-dB.x};   /* the locked tooth's tip on the stone's flat (the 0.01 the drawing leaves is for the tools); the detent's flexure, its spring's middle */
    const Wm=MK(W),Pc=MK(P),fl=Math.hypot(Wm.x-Pc.x,Wm.y-Pc.y),fF={x:(Wm.x-Pc.x)/fl,y:(Wm.y-Pc.y)/fl},rho=GW/2/ES_,Pt=MK(D(GT,GN)),Gb=MK(D(GB[0],GB[1]));   /* the flat along the wheel's radius; the gold spring's square end's middle (TSQ), its bending point */
    return{NT:15,ES:ES_,EX:Wm.x,LK:2,LO:-(P_A-aB)+1.5*24,   /* 15 teeth (24 deg), the locked tooth two pitches on from the pair across the line of centres, at 36.5 deg (makeEsc's lockA = t0 - 2 P) */
      DA:Math.atan2(dB.y,dB.x)/D2R,BL,DRAW:Math.atan2(dt(fF,dB),-dt(fF,nB))/D2R,   /* the detent's line from its flexure (the spring's middle, TP) to the locked tip; the flat's draw against it */
      dL:DEPTH/ES_,rJ:RS/ES_,eJ:0,   /* the lock 0.175 deep; the stone Ø 0.75 half round, its flat through its centre */
      rT:-dt(Pt,dB),PSO:dt(Pt,nB),PSL:DST(Pt,Gb),TSQ:1,tsT:GW,tsH:1.0,ET:90,   /* the gold spring: its square end 1.54 from the staff, free from its bending point (6.7 from the stone); 0.15 × 1 (05 04 01-2); 333 gold's modulus about 90 GPa (estimated: its alloy isn't given) */
      rd:uu/ES_+0.5*rho,wD:DSW/ES_,BEV:DS/ES_,rB:0,aD:180+aBW-BETA,   /* the discharge stone: its acting corner's reach along it (makeEsc's rd is that and half the tip), 0.4 across, its end bevelled 0.3 back to the other corner; at rest */
      rRoll:6.78/2/ES_,rp:3.35/ES_,wI:0.5/ES_,fI:0,aI:180+PHI0,rDR:1.2/ES_,   /* the impulse roller Ø 6.78, the stone's face on its radius to 3.35, 0.5 thick, 24 deg before the line of centres at rest */
      r0:RB0/ES_,U:-al(TOOTH.face0)/24,land:1.5/24,B:BK/24,TBR:3,   /* the tooth (05 04_23): the tip 1.5 deg, the back the ∅ 6 cutter's arc to Ø 12.1 15 deg behind the tip, the face leaning 25 deg (4.27 deg behind
        the tip at Ø 12.1): makeEsc's root circle the back's foot, Ø 12.1, its face run to it (the floor 0.2 under it, Ø 11.7, is out of every stone's reach: the locking stone
        comes no nearer the wheel's centre than 6.825, the impulse stone 6.65). Until 15 October 2026 the floor Ø 12.1, the face leaning 15 deg, the back to 11.9 deg */
      SPL:5/ES_,SN0:-0.035/ES_,SN1:0.035/ES_,hD:1.9,EB:205,   /* the detent's spring 0.07 × 1.9, 5 long (1436, its bracketed sizes), steel ("Stahl": 200-210 GPa) */
      OP78:0,W78:0.63,   /* no Op. 78 here: W78 the preload itself, g at the stone. No Wempe source gives it (a banking screw sets the lock, the 1954 instruction's п. 11): the Hamilton's after Op. 78, 0.63 g (estimated) */
      MU:0.15,eS:0.3,   /* the brass tooth on the sapphire stone; the detent's restitution on its banking (estimated, as the Hamilton's) */
      HS:-0.499,   /* the drawn hairspring's own isochronism, s a day for each 10 deg the swing is above the reference's: it loses as the swing grows (tools/wempe_hairspring.js: the spring as drawn, an elastica, at the model's swing) */
      I:2560.7,JW:9.96,ID:8.46,   /* the balance with its rollers, collet and a third of its spring; the escape arbor with the seconds arbor and hand reflected (÷ 8²); the detent's moving part about its flexure: g·mm², weighed on the solids (tools/wempe_inertia.py, checked by tools/wempe_escapement.js) */
      DEP:1,RW:1,   /* checked in time (tools/dynamics.js --model wempe, 15 October 2026): the detent, flung off the discharge stone's square corner, never rides its bevel back
                       down, so its preload's and spring's work up to there is lost (DEP); and the locking stone falls back onto the tooth it has just let go, the wheel slow to get
                       it out from under, and drags on its land and is pushed on by its back (RW). Together 4.6° of swing at 12 h (README, Physics: in time) */
      TH1:60,TF:108};})();   /* the balance's free run-down (s): estimated from its parts' damping (tools/wempe_escapement.js, README Physics) */
  /* makeEsc's lift (the gold spring tip's travel, units of ES) as this file's detent turn (rad, rotation.y about TP): makeEsc turns the detent by -lift/LEN about its flexure,
     clockwise in its frame, anticlockwise seen from the dial (tools/wempe_escapement.js checks the stone's place both ways) */
  const toKin=(l,LEN)=>l/LEN;
  /* ================= the escapement as solved: the page's motion (since 15 October 2026) ================= */
  /* adapt(E): js/escphys.js hands over makeEsc built with SET (WPHYS.ESC) and ESC.state becomes its state, at the live swing amp and drive s (the escape wheel's torque times
     the reference's), as the Hamilton's app.js drives its own; ESC.A and ESC.AMIN become its. Returned in this file's terms, so update() and the tools take it as before:
     lift, the detent's turn about TP (toKin), and psDef, the gold spring's about its bending point (makeEsc's tip travel over its free length PSL), both rad; prog, makeEsc's
     (the wheel let go from rest chasing the impulse stone, the strike, the drive, the run on to the next lock; a little under 0 while the stone's lift draws the locked tooth
     back); ride, the locking stone fallen back onto the tooth it let go (the detent higher than its own fall); mk, makeEsc's own state.
     The balance's angle: makeEsc keeps the phase a sine of the swing; here it is the motion the solved work gives it through the beat (beat): each push (makeEsc's pushes:
     the strike and the drive, the stone's draw, the detent's springs and blows, the gold spring's bend on the return) changes the balance's energy where it acts, the air's and
     pivots' loss (TF) spread as a viscous one, scaled so the beat closes on itself (the swing kept), and the swing at the far turn after the impulse is amp. Between pushes
     it swings as the hairspring alone would. Each state is makeEsc's at the balance's angle (the sine's phase that gives that angle on that swing), so the escapement's
     parts stand exactly where makeEsc puts them for the balance as drawn; the chase's and the detent's fall's time is counted on that sine (README, Physics: the page's
     motion, for how far the two differ). Below makeEsc's AMIN, or with no drive (the train held: run down, or a swing too small to see the impulse through), the wheel stays
     locked: the balance a sine, the detent lifted by the discharge stone (and falling as makeEsc's), the locked tooth drawn back by the stone's lift (prog under 0), the gold
     spring bent on the return */
  /* the swing as the page draws it, to AQ (0.011 deg), and the drive to 0.001: a new beat costs about 7 ms (makeEsc's chase and impulse at that swing and drive, then
     the beat), so the page doesn't work one out each frame while the swing relaxes */
  const AQ=2e-4,qa=(/** @type {number} */a)=>Math.round(a/AQ)*AQ;
  const adapt=(/** @type {any} */E)=>{const T=E.T,W0=TAU/T,TF=E.settings.TF,PSL=E.settings.PSL,N=720,dph=TAU/N,dt=dph/W0,BM=new Map();
    const tab=(L,th)=>{const f=(th-E.TH0)/E.DT,i=Math.floor(f);return i<0||i>=L.length-1?0:L[i]+(L[i+1]-L[i])*(f-i);};
    /* the detent alone, as makeEsc's detLift: carried by the discharge stone until it leaves it (depart), then its fall back to the banking */
    const detL=(q,th,a)=>{const l=tab(E.LI,th),f=E.depart(a);if(!f||q<=f.p)return l;return Math.max(th<E.thOff?l:0,E.fallD(f.d0,f.v0,(q-f.p)*T)*E.LEN);};
    /* one oscillation from the turn at -√u0, φ in steps dph (dt of time), θ = -√u cos φ: each push as θ passes it (G on the active swing, θ rising; Rt on the return), the
       damping lam times the free run-down's, du = -lam 4/TF (u - θ²) dt (a sine's mean -2u/TF); after each step φ turned to keep θ on the new u */
    const run=(u0,lam,G,Rt)=>{const th=new Float64Array(N+3);let u=u0,ph=0,k=0,gi=0,ri=0,tT=0,tE=0,A2=0,W2=0,Dm=0;th[0]=-Math.sqrt(u0);   /* W2, Dm: the pushes' and the damping's (lam 1) sums in u */
      for(;k<=N+1;k++){const ph1=ph+dph;if(ph<Math.PI&&ph1>=Math.PI){tT=(k+(Math.PI-ph)/dph)*dt;A2=Math.sqrt(u);}
        if(ph1>=TAU){th[k+1]=-Math.sqrt(u);tE=(k+(TAU-ph)/dph)*dt;break;}
        const t1=-Math.sqrt(u)*Math.cos(ph1),act=ph1<Math.PI;let e=0;
        if(act)while(gi<G.length&&G[gi][0]<=t1)e+=G[gi++][1];else while(ri<Rt.length&&Rt[ri][0]>=t1)e+=Rt[ri++][1];
        const dm=4/TF*(u-t1*t1)*dt,un=Math.max(1e-9,u+2*e-lam*dm),c=clamp(-t1/Math.sqrt(un),-1,1);W2+=2*e;Dm+=dm;
        ph=act?Math.acos(c):TAU-Math.acos(c);u=un;th[k+1]=-Math.sqrt(u)*Math.cos(ph);}
      return{th,n:k+1,tT,tE,A2,uEnd:u,lam,u0,W2,Dm};};
    /* the beat at swing a and drive s: the pushes at that swing, the damping that closes it (lam: the pushes' sum over the damping's, from a first pass at lam 1), its start
       set so the far turn is a; then the beat itself */
    const beat=(a,s)=>{const key=a+'|'+s;let b=BM.get(key);if(b!==undefined)return b;b=null;const pu=E.pushes(a,s);
      if(pu){const G=pu.gain.concat(pu.loss.map(([m,e])=>[m,-e])).sort((x,y)=>x[0]-y[0]),Rt=pu.ret.map(([m,e])=>[m,-e]).sort((x,y)=>y[0]-x[0]);let u0=a*a;
        for(let it=0,lam=1;it<4;it++){b=run(u0,lam,G,Rt);if(it<3){lam=b.W2>0&&b.Dm>0?b.W2/b.Dm:0;u0*=(a/b.A2)**2;}}}
      if(BM.size>64)BM.clear();BM.set(key,b);return b;};
    /* the balance's angle at phase q (0 to 1 of the beat's time) and whether on the active swing */
    const thAt=(b,q)=>{const tq=q*b.tE;let i=Math.floor(tq/dt),f;if(i>=b.n-1){i=b.n-1;f=(tq-i*dt)/Math.max(1e-12,b.tE-i*dt);}else f=tq/dt-i;return{th:b.th[i]+(b.th[i+1]-b.th[i])*f,ccw:tq<b.tT};};
    /* makeEsc's state z as drawn: the wheel stands D0 behind makeEsc's (the locked tooth 0.01 short of the stone's flat, as built), so a stone riding the escaping tooth is
       lifted over the tooth where it is drawn (makeEsc's ride at the progress less D0's share of a pitch); and each contact makeEsc solves exactly is drawn GAP apart, as the
       layout kept them (0.01 at the gold spring's tip: the discharge stone carrying it or bending it on the return, the locking stone on the tooth), for the tools. The gold
       spring's bend: makeEsc moves its strip bodily across (PS, the tip's travel), the drawing turns it about its bending point, PSL from the tip; the stone, reaching 0.02
       past the tip (RD 1.560 against 1.54), meets it at its square end, so the two agree there */
    const GAP=0.01/E.ES,DP=D0/24;
    const conv=(z,q,a)=>{const dl=z.ccw?detL(q,z.th,a):0,l0=z.ccw?tab(E.LI,z.th):0,rd=z.ccw&&z.prog>0&&z.prog<1?E.ride(z.prog-DP):0,ride=rd>0&&rd>=dl,
        lift=Math.max(dl>0?dl+(l0>0&&dl<=l0+1e-12?GAP:0):0,ride?rd+GAP:0);
      return{th:z.th,ccw:z.ccw,lift:toKin(lift,E.LEN),psDef:z.psDef>0?(z.psDef+GAP)/PSL:0,prog:z.prog,drop:z.drop,run:z.run,ride,p:q,mk:z};};
    const held=(q,a)=>{const th=-a*Math.cos(TAU*q),ccw=q<0.5,pass=E.thPass!==null&&a>=-E.thPass,lift=ccw&&pass?detL(q,th,a):0;
      return conv({th,ccw,lift,psDef:ccw&&pass?0:tab(E.PS,th),prog:ccw?(lift>0?-E.recoil(lift)/E.P:0):1,drop:false,run:false},q,a);};
    /* the state at the balance's angle th on the active swing (ccw) or the return, swing a, drive s (the essay's plan sets the balance's angle) */
    const at=(th,ccw,a=ESC.A,s=1)=>{const c=Math.acos(clamp(-th/a,-1,1))/TAU,ps=ccw?Math.min(c,0.5-1e-9):1-c,z=E.state(ps,a,s);return conv(z,ps,a);};
    /** @param {number} p the phase, 0 to 1 @param {number} [amp] the swing (rad) @param {number} [s] the drive, times the reference's */
    function st(p,amp=ESC.A,s=1){const q=p-Math.floor(p),a=qa(amp),sd=Math.round(s*1e3)/1e3;
      if(!(a>=E.AMIN)||!(sd>0))return held(q,a);
      const b=beat(a,sd);if(!b)return conv(E.state(q,a,sd),q,a);
      const g=thAt(b,q),r=at(g.th,g.ccw,a,sd);r.p=q;return r;}
    Object.assign(ESC,{A:E.A,AMIN:E.AMIN,GAP:GAP*E.ES,AQ,qa,state:st,at,beat:(a=ESC.A,s=1)=>beat(qa(a),Math.round(s*1e3)/1e3),thAt,E});return ESC;};

  /* ================= heights ================= */
  const FY=-22.8;   /* the balance's seat (the hub's flange top, 05 04 02), above */
  const Y={rimT:FY-3.8,armT:FY-1.15,flB:FY+1.8,hubB:FY+4.1,col:FY+5.6,ir0:FY+5.6,ir1:FY+7.2,dr0:FY+7.2,dr1:FY+8.8,
    tipU:-35.83,tipL:-9.97,   /* the staff's pivot ends, 0.02 off the endstones (the cock's setting and the lug's: below) */
    ew0:-17.11,ew1:-15.71,ewWeb:-16.51,etU:-19.49,etL:3.29};   /* the escape wheel's faces (1.4 at the rim, 0.8 in the web, 05 04_1 and 05 04_7.1), its arbor's pivot ends (22.8 −0.02 apart less 0.04 of endshake).
      The wheel's pinion-side face 19 from the arbor's pinion end (05 04_7.2's "19", sure), so its other face 2.38 from the top-plate end: the sheet's "2" runs from the end to
      the arbor's shoulder, 0.4 under the wheel (scaled 0.57 at 17.6 px/mm). Its teeth then lie 1.89-3.29 under the top plate, inside the impulse roller's 1.8-3.4 (0.09 and
      0.11 to spare). Until 15 October 2026 the wheel 2.0 from that end (the "2" read to the wheel), its teeth 1.51-2.91 under the plate */
  /* the heights as first drawn (the page's Variants: the sheets of 1940-41, which Wempe 3955 has: its escape wheel just under the top plate, 10_Wempe_3955_Feder_plus.jpg).
     05 04_1's elevation (10:1): the balance's seat 4.1 over the top plate's inner face ("4,1 bis Unruhauflage", sure), 0.3 higher than 05 04 02's; the 1941 staff's brass
     collar (05 04_5, 4.4.41) to 4.7 −0.05 under the seat (boxed, sure), the impulse roller under it, 1.6 thick ("1,6", sure; 05 04_1 scales its top 0.42 under the plate
     against the collar's 0.6: the figures win), the discharge roller 1.6 under that ("1,6", sure); the escape wheel's teeth 0.5 under the plate, 1.4 thick ("0,5", "1,4",
     sure), the web 0.8 on the pinion's side (scaled 0.74). Its arbor 05 04_7.1 (4.4.41): the pinion's far face 15.2 from the wheel's plate face (likely), 17.7 from the
     arbor's top-plate end (sure), 5.3 from its dial end (likely: the figure overwritten), 23 −0.2 overall (sure), less 0.04 of endshake at the dial end. The seconds wheel's
     rim (train.js: 5.33 to 4.33 over the pillar plate) lies wholly in the pinion's 3 */
  const FY1=TI-4.1,Y1={rimT:FY1-3.8,armT:FY1-1.15,col:FY1+4.7,ir0:FY1+4.7,ir1:FY1+6.3,dr0:FY1+6.3,dr1:FY1+7.9,ew0:TI+0.5,ew1:TI+1.9,ewWeb:TI+1.1,etU:TI+15.7-17.7,etL:TI+15.7+5.3-0.04,pf:TI+15.7};
  const SH1=FY1-FY;   /* the balance, its arm, rim and hairspring, stand this much higher as first drawn (-0.3) */

  function build(mv,M,K){const{part,screw}=K,tag=(o,id,s)=>hn(o,id,s?{sub:1}:undefined),R={};
    const flip=g=>{const f=new THREE.Group();f.rotation.x=Math.PI;g.add(f);return f;};
    /* the sheets' two states (movement.js's setRev): rv(par, 'last' or 'first') a group of the pieces only that state has; onRev(f) runs f(first) when the state changes */
    const rv=(par,v)=>{const g=new THREE.Group();g.userData.rev=v;par.add(g);return g;},onRev=f=>mv.userData.onRev.push(f);
    const BL=v=>[v[0]-B[0],v[1]-B[1]],WL=v=>[v[0]-W[0],v[1]-W[1]];   /* plan points into the balance's and the wheel's own frames (both turn about y only) */
    const OFFB=-58;   /* the balance comes out with the upper cock, hanging from it by the hairspring and its stud (the frame's cock rises 58) */

    /* ================= the balance (Unruh 05 03 01; rim 05 03 01-1) ================= */
    /* The rim (05 03 01-1, 31.7.41, N.gepr. 27.4.43): nickel steel inside, brass outside ("Nickelstahl Sonderlegierung u. Messing"), Ø 32.32 −0.04, the joint Ø 31.29 −0.04,
       inside Ø 30.48 +0.04, 3.8 high; the arm in one with the steel, across the rim's lower part, 1.15 thick (written with its comma low; scaled 1.17), 3.2 wide at the rim,
       4 where it swells in two hollow arcs r 20 to a point 6.5 across at the hub (the sheet's "4", "20 r", "6,5": below); the hub's hole 2 H7 (plan; its side view's 1.8 H7 is taken as the other figure's leader), its two
       holes Ø 1 at 2.14 +0.02 either side along the arm for the hub's screws; the rim cut 1.5 +0.2 at 90 deg from the arm, so each quarter is a cantilever from the arm's end.
       Drawn at the middle of the fits. The arm along 12-6 with the balance at rest (05 03_1: "Die Zeitschrauben müssen in Ruhestellung die Richtung von 6-12 einnehmen") */
    const balP=part('balance',OFFB,[B[0],B[1],0]),bal=hn(new THREE.Group(),'050402-1');balP.add(bal);R.bal=balP;   /* the staff's line holds the whole balance: its pieces move with it */
    const balL=rv(bal,'last');onRev(f=>{bal.position.y=f?SH1:0;});   /* the 1946 staff, hub and screws; as first drawn the rim and arm stand 0.3 higher (Y1) */
    {const r0=30.5/2,r1=31.27/2,r2=32.30/2,y0=Y.rimT,y1=FY,gap=0.75,N=720,ya=Y.armT;
      /* the arm's outline (05 03_4's plan, its flanks traced at 6.81 px/mm by the rim's Ø 32.32; sure: Wempe 3955's arm, 9_Wempe_3955_Hemmung.jpg, shows the same hollow
         flanks swelling to a point at the hub): straight from 3.2 at the rim's inside ("3,2"; traced 3.2-3.45) widening to 4 ("4", traced 3.8 at 6.6 out), where each flank runs
         on as an arc r 20 ("20 r") curving away from the arm's line, its centre outside the arm (the sheet marks it, 7.2 along and 21.95 across from the centre: here 7.01
         and 21.98), the two arcs meeting in a point at the centre 6.5 across ("6,5"; traced 6.46). The arc tangent to the straight flank where the arm is 4 wide, 6.13 from
         the centre (solved; traced widths 5.29 at 2 out, 4.4-4.6 at 4, 3.6 at 10: the drawn 5.24, 4.42, 3.66). Until 15 October 2026 the flanks were straight 3.2 to 7.53 out and swelled in convex arcs to 6.17 at the
         centre ("6,5" read as where the arm is 4 wide) */
      const sw=Math.sqrt(r0*r0-1.6*1.6),AT=(()=>{const f=x0=>{const L=Math.hypot(sw-x0,0.4),zc=x0+20*0.4/L,hc=2+20*(sw-x0)/L;return{zc,hc,e:Math.hypot(zc,hc-3.25)-20};};
        let lo=2,hi=12;for(let i=0;i<60;i++){const m=(lo+hi)/2;f(m).e>0?hi=m:lo=m;}const r=f(lo);return{x0:lo,zc:r.zc,hc:r.hc};})();   /* the arm's flank meets the rim's inside at ±sw; AT the arcs' tangent point x0 and centre (zc, hc) */
      const hw=z=>{const a=Math.abs(z);return a>=AT.x0?2-0.4*(a-AT.x0)/(sw-AT.x0):AT.hc-Math.sqrt(400-(a-AT.zc)**2);};   /* the arm's half-width at z along it */
      const flank=s=>{const o=[],Z=[-sw,-AT.x0,0,AT.x0,sw],n=[1,24,24,1];for(let j=0;j<4;j++)for(let i=0;i<n[j];i++){const z=Z[j]+(Z[j+1]-Z[j])*i/n[j];o.push([s*hw(z),z]);}o.push([s*1.6,sw]);return o;};   /* local x, z: the arm along z */
      const aIn=Math.asin(1.6/r0)/D2R;   /* the arm's half-width at the rim, as a plan angle */
      /* the arm's ends: arcs of the rim's inside, the same points in the arm's outline and the rim's */
      const endArc=(c)=>{const o=[];for(let i=0;i<=8;i++){const a=c+aIn-2*aIn*i/8;o.push(pol([0,0],r0,a));}return o;};   /* from c+aIn round to c-aIn */
      const eTop=endArc(90),eBot=endArc(270);   /* 12 o'clock end (−z) and 6 o'clock end (+z) */
      const R2=flank(1),L2=flank(-1).reverse();   /* the right flank from 6 o'clock's end (z −sw... ) */
      /* arm outline: up the right flank (x +1.6) from z −sw to +sw, the 6 o'clock end's arc, down the left flank, the 12 o'clock end's arc */
      const armLoop=[...R2.slice(1,-1),...eBot,...L2.slice(1,-1),...eTop];
      /* the rim's halves of steel: from a cut round through an arm's end to the other cut; its inside carries that end's arc */
      const half=(c,e)=>{const g=gap/r1/D2R,a0=c-90+g,a1=c+90-g,o=[],n=Math.ceil(N/2);for(let i=0;i<=n;i++)o.push(pol([0,0],r1,a0+(a1-a0)*i/n));
        const inn=[];const m=Math.ceil(n*(90-g-aIn)/(180-2*g));for(let i=0;i<=m;i++)inn.push(pol([0,0],r0,a1-(a1-c-aIn)*i/m));inn.pop();
        const inn2=[];for(let i=0;i<=m;i++)inn2.push(pol([0,0],r0,c-aIn-(c-aIn-a0)*i/m));inn2.shift();
        return[...o,...inn,...e,...inn2];};   /* counterclockwise outside, back round the inside past the arm's end (e, from c+aIn to c−aIn) */
      const brass=(c)=>{const g=gap/r1/D2R,a0=c-90+g,a1=c+90-g,o=[],n=Math.ceil(N/2);for(let i=0;i<=n;i++)o.push(pol([0,0],r2,a0+(a1-a0)*i/n));for(let i=0;i<=n;i++)o.push(pol([0,0],r1,a1-(a1-a0)*i/n));return o;};
      const hubF=[{p:C([0,0],2.009/2,64),a:ya,b:y1},...[-1,1].map(s=>({p:C([0,s*2.14],0.5,40),a:ya,b:y1}))];
      tag(mesh(bal,solidGeo([{loop:ccw(armLoop),y0:ya,y1,F:hubF},{loop:ccw(half(90,eTop)),y0,y1},{loop:ccw(half(270,eBot)),y0,y1}]),M.steel),'050301-1');
      for(const c of[90,270])tag(mesh(bal,solidGeo([{loop:brass(c),y0,y1}]),M.brass),'050301-1',1);}
    /* the compensation masses (Masse 05 03 01-4; 05 03_2, a poor copy): round brass, Ø 6.3 (scaled; 05 03_1's Anker balance Ø 6.35 boxed), across the rim, their centres on its
       middle, each held by a screw WN-12 with its nut WN-12a across the rim (05 03_2's side view and plan, the screw dashed radially), a slot from below for the rim.
       Their place, MASS_A deg from the 3-9 (the cuts') line: 30, Wempe 3955's (9_Wempe_3955_Hemmung.jpg, its rim rectified on its two cuts and the arm's ends: the four
       masses at 28.2, 30.0, 32.0 and 29.6 deg, ±1-2; the 6MX's book, Fig. 5.62, 30 deg), where 05 03_2 scales 32.5 (likely). Their height, MASS_H0 to MASS_H1 over the rim's
       lower face: 05 03_2's side view (12.18 px/mm by the rim's 3.8) draws the near pair from that face to 6.40 (its end chamfered about 0.4, not drawn) and the far pair from
       1.24, where the arm's cut section (1.15) hides their foot; Wempe 3955's side view (5_Wempe_3955_O.jpg) measures 6.0-6.3 high against their Ø 6.3 (height/diameter
       0.98-1.00, two masses) and its plan view the masses' faces flush with the rim's (within about 0.3); Lange 5829 (stahl_113510_lange_4.jpg) 5.8 (likely: until
       15 October 2026 1.08 to 6.46, the far pair's outline) */
    const MASS_A=30,MASS_H0=0,MASS_H1=6.46;
    {const rc=(30.5/2+32.3/2)/2,mr=3.15,y0=FY-MASS_H1,y1=FY-MASS_H0,ys=Y.rimT-0.02,ri=30.5/2-0.02,ro=32.3/2+0.02;
      /* the mass's circle cut by the slot's two arcs (r ri, ro about the staff) into three cells: inside the rim, over it (the slot below), outside it */
      const cells=c=>{const N=120,L=[];for(let i=0;i<N;i++){const a0=TAU*i/N,a1=TAU*(i+1)/N,p=[c[0]+mr*Math.cos(a0),c[1]+mr*Math.sin(a0)],q=[c[0]+mr*Math.cos(a1),c[1]+mr*Math.sin(a1)];L.push({p});
          for(const r of[ri,ro]){const fp=hyp(p)-r,fq=hyp(q)-r;if(fp*fq<0){let lo=0,hi=1;for(let k=0;k<50;k++){const m=(lo+hi)/2;((hyp([p[0]+(q[0]-p[0])*m,p[1]+(q[1]-p[1])*m])-r)*fp>0)?lo=m:hi=m;}L.push({p:[p[0]+(q[0]-p[0])*lo,p[1]+(q[1]-p[1])*lo],x:r});}}}
        const n=L.length,X=r=>L.map((q,i)=>q.x===r?i:-1).filter(i=>i>=0),run=(i0,i1)=>{const o=[];for(let i=i0;;i=(i+1)%n){o.push(L[i].p);if(i===i1)break;}return o;};
        const arcR=(r,p,q)=>{const a0=Math.atan2(p[1],p[0]),a1=Math.atan2(q[1],q[0]);let da=a1-a0;while(da>Math.PI)da-=TAU;while(da<-Math.PI)da+=TAU;const o=[],m=Math.max(4,Math.ceil(Math.abs(da)*r/0.1));for(let i=1;i<m;i++){const a=a0+da*i/m;o.push([r*Math.cos(a),r*Math.sin(a)]);}return o;};
        const[i1,i2]=X(ri),[o1,o2]=X(ro),inS=hyp(L[(i1+1)%n].p)<ri?i1:i2,inE=inS===i1?i2:i1,ouS=hyp(L[(o1+1)%n].p)>ro?o1:o2,ouE=ouS===o1?o2:o1;
        const aI=arcR(ri,L[inE].p,L[inS].p),aO=arcR(ro,L[ouE].p,L[ouS].p);   /* the arcs closing the inner and outer cells */
        return[[...run(inS,inE),...aI],[...run(ouS,ouE),...aO],[...run(inE,ouS),...aO.slice().reverse(),...run(ouE,inS),...aI.slice().reverse()]];};
      for(const a of[MASS_A,180-MASS_A,180+MASS_A,360-MASS_A]){const c=pol([0,0],rc,a),[cI,cO,cS]=cells(c);
        tag(mesh(bal,solidGeo([{loop:ccw(cI),y0,y1},{loop:ccw(cO),y0,y1},{loop:ccw(cS),y0,y1:ys}]),M.brass),'050301-4');
        /* its screw across, its slotted head sunk flush in the mass's outer face, its nut in the inner (WN-12, WN-12a): Wempe 3955's masses (9_Wempe_3955_Hemmung.jpg, the two
           nearest seen side-on at 15 px/mm: sure) show the head flush in the outer face, Ø 1.56 against the mass's 6.3, its slot across, and nothing standing out of the
           inner face; the nut WN-12a (05 03_2's label) is drawn sunk the same way (estimated: no photograph shows it). The faces are the mass's round side, which can't be counterbored here (a solid of
           vertical walls): head and nut 0.02 under its outermost line, 0.08 out of it at their sides. Drawn without a hole across the rim (a turned part cut by a radial hole isn't drawn). Until 15 October 2026 the
           head Ø 1.7 stood 0.55 proud of the outer face and the nut as much of the inner */
        const u=unit(c),yS=FY-2.45,rIn=rc-mr,rOut=rc+mr;   /* 2.45 over the rim's lower face: 05 03_2's slotted head 2.83, Wempe 3955's 2.55 and Lange 5829's 2.0 (5_Wempe_3955_O.jpg, stahl_113510_lange_4.jpg; likely) */
        tag(across(bal,lathe([[0,rIn+0.02],[0.42,rIn+0.02],[0.42,rOut-0.57],[0,rOut-0.57]],16),M.steel,[0,0],u,yS),'WN-12');
        tag(across(bal,lathe([[0,rOut-0.57],[0.8,rOut-0.57],[0.8,rOut-0.02],[0,rOut-0.02]],24),M.steel,[0,0],u,yS),'WN-12',1);   /* its head, sunk in the mass's outer side */
        tag(across(bal,new THREE.BoxGeometry(1.62,0.25,0.25).translate(0,rOut-0.02-0.125+0.02,0),M.steelD,[0,0],u,yS),'WN-12',1);   /* its slot, 0.02 out of the head's face as screw() draws them */
        tag(across(bal,lathe([[0,rIn+0.02],[0.8,rIn+0.02],[0.8,rIn+0.57],[0,rIn+0.57]],24),M.steel,[0,0],u,yS),'WN-12a');}}
    /* the timing screws (Zeitschraube 05 03 01-2) and their weights (Zeitmasse 05 03 01-3, by the coloured section's labels), at the arm's ends: the screw across the rim in its
       tapped hole Ø 0.9, 0.16 pitch, 2.15 over the rim's lower face (05 03 01-1: sure), its slotted head inside the rim on the rim's inner face, the weight on it outside
       the rim, its tip 42.1 over both screws' ends (05 03_2's plan, both screws: the head inside drawn with its slot, Ø 1.65 × 1.3 scaled at 12.07 px/mm, the weight
       0.8 short of the tip; likely, a poor copy). The weight split to grip the thread: 05 03_2 draws two saw cuts, from its outer end 1.3 deep and from its inner end 1.7
       deep (scaled), and Wempe 3955's (9_Wempe_3955_Hemmung.jpg) show a cut across the outer end's whole face, the screw's tip in it, and one along the side near the
       inner end: two cuts across the diameter from either end, at right angles (likely; 0.15 wide, estimated). No head outside the weight (the photograph: sure). The
       weight's size: 05 03_2 scales its two Ø 3.5 and 4.3 by 3.3 and 3.1 long; Wempe 3955's measure Ø 3.0-3.9 against the masses, the arm and the rim (perspective
       and blur, ±0.4). Built Ø 3.8 × 3.3 (the sheet's length; Ø the middle of the readings: unsure, ±0.4). Until 15 October 2026 the head Ø 1.5 × 0.6 outside the
       weight, the weight Ø 3.0 × 4.0, uncut, from 16.45 */
    {const yS=FY-2.15,rI=30.5/2,TIP=21.05,W1=TIP-0.8,W0=W1-3.3;
      /* a cylinder r R bored rb along y from y0 to y1, cut across its diameter w wide from y1 dA deep (along x) and from y0 dB deep (along z): its cells */
      const split=(R,rb,y0,y1,w,dA,dB)=>{const h=w/2,xb=Math.sqrt(rb*rb-h*h),xo=Math.sqrt(R*R-h*h),A=(r,a0,a1,n=12)=>{const o=[];for(let i=1;i<n;i++){const t=a0+(a1-a0)*i/n;o.push([r*Math.cos(t),r*Math.sin(t)]);}return o;};
        const cells=[];for(const sx of[1,-1])for(const sz of[1,-1]){const ai=Math.atan2(h,xb),ao=Math.atan2(h,xo),Q=(x,z)=>[sx*x,sz*z];
          const L=[Q(h,xb),...A(rb,Math.PI/2-ai,ai).map(([x,z])=>Q(x,z)),Q(xb,h),Q(xo,h),...A(R,ao,Math.PI/2-ao,24).map(([x,z])=>Q(x,z)),Q(h,xo)];cells.push({loop:ccw(L),y0,y1});}
        for(const sx of[1,-1])cells.push({loop:ccw([[sx*xb,-h],[sx*xo,-h],[sx*xo,h],[sx*xb,h]]),y0,y1:y1-dA});
        for(const sz of[1,-1])cells.push({loop:ccw([[-h,sz*xb],[-h,sz*xo],[h,sz*xo],[h,sz*xb]]),y0:y0+dB,y1});
        return solidGeo(cells);};
      for(const a of[90,270]){const u=dir(a);
        tag(across(bal,lathe([[0,rI],[0.45,rI],[0.45,TIP-0.05],[0.4,TIP],[0,TIP]],16),M.steel,[0,0],u,yS),'050301-2');
        tag(across(bal,lathe([[0,rI-1.3],[0.825,rI-1.3],[0.825,rI],[0,rI]],24),M.steel,[0,0],u,yS),'050301-2',1);   /* its head, on the rim's inner face */
        tag(across(bal,new THREE.BoxGeometry(1.67,0.3,0.25).translate(0,rI-1.3+0.15-0.02,0),M.steelD,[0,0],u,yS),'050301-2',1);   /* its slot, toward the staff */
        tag(across(bal,split(1.9,0.45,W0,W1,0.15,1.3,1.7),M.brass,[0,0],u,yS),'050301-3');}}
    /* the balance staff (Unruhwelle 05 04 02-1, kompl. 05 04 02, 29.5.46: hardened, tempered at 240 deg): from its top, the arm Ø 1.2 ±0.02 tapering 1:30 to the pivot's
       shoulder; the hairspring collet's seat 1:70 from Ø 1.58 to Ø 1.65 s6 over the 6.1 above the hub's flange; the arm's seat Ø 2 h6, 1.1 high; inside the brass hub
       (Unruhbutzen 05 04 02-2) on 1:70; the collar Ø 2.14 below the hub, to 5.6 under the flange's top; the impulse roller's seat Ø 1.65 s6, the discharge roller's Ø 1.2 r6,
       the lower arm 1:70 to the pivot. 05 04 02 draws the staff as a blank between centres, its ends Ø (1.1): the pivots, Ø 0.21 × 0.4 ("in Lagerstein einpassen") with their
       cones 2 long, are 05 03_3.2's (13.3.65, 25.6 overall, the same 6.1, 4.1, 5.6-5.7 and 1.65), each end to its endstone less 0.02. 05 03_3.2 (1965, numbered 05 04 01 in pencil,
       one piece with its flange) is the later production staff; 05 04 02 is the one of the drawings' time and the coloured section's (05 04 02-1, -2): built */
    {const pv=0.105,sh=[[0,Y.tipU],[pv,Y.tipU],[pv,Y.tipU+0.4],[0.55,Y.tipU+2.4],[0.6,FY-6.1-1.53],[0.6,FY-6.1],[0.79,FY-6.1],[0.8225,FY-1.1],[1.0,FY-1.1],[1.0,FY],
      [1.0293,Y.hubB],[1.07,Y.hubB],[1.07,Y.col],[0.825,Y.col],[0.825,Y.ir1],[0.6,Y.ir1],[0.6,Y.dr1],[0.55,Y.tipL-2.4],[pv,Y.tipL-0.4],[pv,Y.tipL],[0,Y.tipL]];
      mesh(balL,lathe(sh,32),M.steel);R.staff=sh;}
    /* the hub (Unruhbutzen 05 04 02-2, brass): its flange Ø 6.3 −0.1 × 1.8 with the arm's screws' two M1 (05 04 02: sure; 05 03_3.2's "nach Bohrlehre 2 x M1"), its neck Ø 2.63 −0.06
       down to 4.1 +0.05 under the flange's top, pressed on the staff's 1:70 */
    {const F=[{p:C([0,0],1.0+0.0015,64),a:FY,b:Y.flB},...[-1,1].map(s=>({p:C([0,s*2.14],0.52,40),a:FY,b:Y.flB}))];
      tag(mesh(balL,solidGeo([{loop:C([0,0],6.25/2,160),y0:FY,y1:Y.flB,F}]),M.brass),'050402-2');
      tag(mesh(balL,lathe([[1.0+0.0015+0.0001,Y.flB],[2.6/2,Y.flB],[2.6/2,Y.hubB],[1.0293+0.0015,Y.hubB]],48),M.brass),'050402-2',1);}
    /* the hub's screws (Schraube WN-10, the coloured section): from under the flange, as the coloured section draws them, through its M1 into the arm's holes, their ends flush with
       the arm's top; heads Ø 1.5 × 0.4 (estimated). They stay in when the balance comes out */
    {const f=flip(balL);for(const s of[-1,1])tag(screw(f,0,-s*2.14,-Y.flB,0.75,0.4,Y.flB-Y.armT,0.48),'WN-10').userData.lift=0;}
    /* As first drawn: the staff 040401-1 with its brass collar 040401-2 (05 04_5, Unruhwelle, 4.4.41; "05 04 02-1" pencilled on it), the sheet a blank between centres. The
       collar: a neck Ø 2.1 ±0.03 standing 1.3 over the flange, the arm riveted on it (drawn flush with the arm's top, its 0.15 spread into the arm's hole, and turned to the
       arm's 2 H7 of 05 03 01-1: estimated); the flange Ø 6.3, 1.8 thick, its edge straight for 0.4 and then undercut 10° (to Ø 5.81 at its foot); the tube Ø 2.6 ±0.03 to
       4.7 −0.05 under the flange's top (boxed); every figure sure. No screws: the sheet's collar has no holes, so the arm's two (05 03 01-1, 31.7.41, drilled for the 1946
       hub's) are left empty. The staff: its turned form isn't on the sheet, only the blank: its ends and the collet's seat as 05 04 02's, the seats through the collar and the
       impulse roller Ø 1.645 (the roller's bore, 02 04 02), the discharge roller's Ø 1.2 (estimated) */
    /* Both are issues of the same lines: 05 04_5 carries "05 04 02-1" pencilled on it, its collar the hub's first form (05 04 02-2). Built in the balance's group, which as
       first drawn stands SH1 higher: each height less SH1 */
    {const balF=rv(bal,'first'),pv=0.105,cr=0.8225,tn=Math.tan(10*D2R),q=y=>y-SH1;
      const sh=[[0,Y.tipU],[pv,Y.tipU],[pv,Y.tipU+0.4],[0.55,Y.tipU+2.4],[0.6,FY1-7.63],[0.6,FY1-6.1],[0.79,FY1-6.1],[cr,Y1.armT],[cr,Y1.ir1],[0.6,Y1.ir1],[0.6,Y1.dr1],
        [0.55,Y.tipL-2.4],[pv,Y.tipL-0.4],[pv,Y.tipL],[0,Y.tipL]].map(([r,y])=>[r,q(y)]);
      mesh(balF,lathe(sh,32),M.steel);
      tag(mesh(balF,lathe([[cr+0.0015,Y1.armT],[1.0,Y1.armT],[1.0,FY1],[3.15,FY1],[3.15,FY1+0.4],[3.15-1.4*tn,FY1+1.8],[1.3,FY1+1.8],[1.3,Y1.col],[cr+0.0015,Y1.col]].map(([r,y])=>[r,q(y)]),64),M.brass),'050402-2');}

    /* ================= the hairspring (Spiralfeder 05 03 02-1, Spiralrolle -2, Klötzchen -3, Spiralstift -4) ================= */
    /* The helical spring (05 03_6, 02 03 10: Bandstahl 0,52 × 0,285 poliert, hardened, tempered dark blue): Ø 12.8 ±0.05 outside (boxed), the strip 0.285 thick and 0.52 high
       (boxed), 0.21 between the coils, 15 turns left-hand ("links") 11.5 high as wound; "before bending the curve shorten to 13 turns less 3.5 mm" (05 03_7): 12.911 turns
       between the two terminal curves. Both ends are curved inward on 05 03_7's table (Spiralkurve: the radii to the strip's inside every 10 deg from where the curve leaves the
       coil, 6.12 at 0 to 3.37 at 230-250, the pinning point at 220 deg, boxed): the inner end into the collet's hole 3.5 from the staff (05 03 02-2); the outer end into the stud's
       slot, 3.55 from the staff as the inner end is in the collet, the stud's leaning upright reaching in to it (05 03 02-3; above).
       Going up the helix the coils turn counterclockwise seen from the dial (left-hand). The spring's lower end turns with the balance, the coils share the turn */
    const colB=Y.armT-0.05,yL=colB-0.75,yU=yL-PITCH*TURNS;   /* the collet's underside 0.05 over the arm; the spring's lower end 0.75 over it (05 03_5) */
    const spPath=tw=>hsBend(tw).map(([x,z,u])=>[x,yL-PITCH*TURNS*u,z]);   /* breathing (hsBend, above) */
    const hs=part('hairspring',OFFB,[B[0],B[1],0]),hsRot=new THREE.Group();hs.add(hsRot);R.hsRot=hsRot;
    onRev(f=>{hs.position.y=f?SH1:0;});   /* as first drawn the collet rides 0.3 higher with the arm, the spring's top curve 0.3 higher in the stud's slot (3.69 under its bar), the
       stud's pin with it (its hole drilled at assembly, 05 03 02-3) */
    const spring=tag(mesh(hs,ribbonGeo(spPath(0),HB,HT),M.mspring),'050302-1');R.spring=spring;R.spPath=spPath;
    /* the collet (Spiralrolle 05 03 02-2, 24.2.43: Messingblech Ms 58): a bar 9.1 −0.2 long, 3.8 −0.2 wide at its slit end and 2.7 −0.2 at the other, 3.3 high; bored 1.6 H7 at
       1:70 for the staff; slit 0.2 +0.1 from the wide end to 0.1 +0.05 short of the bore (built 0.25 and 0.125, the fits' middles); the spring's hole Ø 0.8 (Kegel 1:90)
       across its narrow end 3.5 −0.02 from the bore, 0.75 ±0.05 from its face (sure). Its plan traced (34.5 px/mm by its 9.1): the bore in the middle of its length (4.58 and
       4.52 from the ends, built 4.55 each: likely), both ends arcs about the bore (the traced ends' corners and middles on circles r 4.58 and 4.52 about it, 1 px: sure),
       the slit stopping 0.19 short of the bore (traced). The hole across isn't drawn (a solid of vertical walls). Until 15 October 2026 the ends straight, the bore 4.25
       from the wide end and 4.85 from the narrow, the slit run into the bore */
    {const ax=dir(aPinL),pp=[-ax[1],ax[0]],RE=4.55,L=(e,w)=>add(add([0,0],ax,e),pp,w),cw=Math.sqrt(RE*RE-1.9*1.9),cn=Math.sqrt(RE*RE-1.35*1.35),rb=0.8225+0.0015;
      const end=(a0,a1)=>{const o=[];for(let i=1;i<24;i++){const t=(a0+(a1-a0)*i/24)*D2R;o.push(L(RE*Math.cos(t),RE*Math.sin(t)));}return o;};   /* an end: an arc r RE about the bore, a0 to a1 deg from the narrow end's middle */
      const an=Math.atan2(1.35,cn)/D2R,aw=180-Math.atan2(1.9,cw)/D2R;
      const out=[L(-cw,-1.9),L(cn,-1.35),...end(-an,an),L(cn,1.35),L(-cw,1.9),...end(aw,360-aw)],slit=[L(-RE-0.5,-0.125),L(-rb-0.125,-0.125),L(-rb-0.125,0.125),L(-RE-0.5,0.125)];
      const cut=bool(out,slit).dAB;
      tag(mesh(hsRot,solidGeo([{loop:ccw(cut[0]),y0:colB-3.3,y1:colB,F:[{p:C([0,0],rb,64),a:colB-3.3,b:colB}]}]),M.brass),'050302-2');
      /* its taper pin (Spiralstift 05 03 02-4) in the hole beside the spring's end, Ø 0.22 × 1.2 (estimated) */
      tag(across(hsRot,lathe([[0,-0.6],[0.11,-0.6],[0.11,0.6],[0,0.6]],12),M.steel,pol([0,0],3.2,aPinL),[ax[1]*-1,ax[0]],yL),'050302-4.c');}
    /* the stud (Klötzchen 05 03 02-3, 6.6.41: Flachmessing 15 × 7 Ms 58; every figure sure but where said): a bar 14.6 −0.2 long and 1.6 −0.2 thick (the side view's head),
       2.5 −0.2 wide at its square end and 3.1 −0.2 at its hole, Ø 1.5 H7, 5 ±0.1 from that end; from the hole it tapers to its point, where two facets, ground from the V the
       plan draws (its apex 6.6 −0.2 on from the hole, its arms running to the bar's widest corners beside the hole) down to the point, meet along the middle: the section draws
       that ridge falling from the V's apex to a knife edge at the point, on the face under it, and Wempe 3955 (2_Wempe_3955_A.jpg) shows the two facets, one lit and one dark,
       meeting along it. The plan's Ø 0.8 round at the point is left out: flat facets from the V's arms to a knife edge there leave no room for it (they cut the outline back to
       within 0.35 of it), and Wempe 3955's point shows sharp. The upright: 1.8 g6 thick along the bar, flush with its square end, 1.9 −0.2 across (drawn 1.86, so its inner face
       clears the cock's slot by 0.01 with the bar's middle on the hole), 6.1 −0.2 from the bar's top to its end, cut square to the bar; it leans 8° toward the balance's axis
       (the side view's 98°, its end's far edge 1.6 −0.2 from the bar's middle in the plan: 1.57 here), along the cock's slot's inner wall (05 08 03-1, Schnitt C-D: 82°;
       frame.js). Its end's slot, 1.2 −0.1 (drawn 1.15), takes the spring and the pin across it (the pin's hole Ø 0.7 drilled at assembly): the slot in the upright's middle
       brings it 0.56 nearer the axis at the spring's height than an upright square to the bar would, so the spring lies 3.55 out, as in the collet, its pin beside it against the
       slot's outer wall; the slot's depth, 2.0, is estimated. On the cock's top, the bar
       along the arm toward the foot (Wempe 3955), the upright down through the slot; screwed down through its hole (Schraube WN-11, the coloured section). Until 15 October
       2026 the bar was 1.4 thick and 3.1 wide to its square end, its hole 5.9 from that end, a V cut through its point 2.1 deep, and the upright square to it */
    {const st=part('stud',OFFB),ck=TT-15,SBT=1.6,yB=ck-SBT,yE=yB+6.1,L=STUD,uw=0.895,c=4.35,tn=Math.tan(8*D2R),hw=0.93/Math.cos(8*D2R),HU=4.1;
      const Ep=L(-uw,c+1.25),Em=L(-uw,c-1.25),Cp=L(HU,c+1.55),Cm=L(HU,c-1.55),Ap=L(HU+6.6,c),Tp=L(13.7,c);
      const plane=(P,Q,S)=>{const u=[Q[0]-P[0],Q[1]-P[1],Q[2]-P[2]],v=[S[0]-P[0],S[1]-P[1],S[2]-P[2]],n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
        return p=>P[2]-(n[0]*(p[0]-P[0])+n[1]*(p[1]-P[1]))/n[2];},fac=q=>plane([...q,yB],[...Ap,yB],[...Tp,ck-0.05]);   /* a facet: through the V's arm on the top and the point, 0.05 thick */
      tag(mesh(st,solidGeo([{loop:ccw([Em,Cm,Ap,Cp,Ep]),y0:yB,y1:ck,F:[{p:C(L(HU,c),0.75+0.0045,48),a:yB,b:ck}]},{loop:ccw([Cp,Ap,Tp]),y0:fac(Cp),y1:ck},{loop:ccw([Cm,Tp,Ap]),y0:fac(Cm),y1:ck}]),M.brass),'050302-3');
      /* the upright, built square to the bar from its underside and leant by a shear about that face; the slot in its middle */
      const v0=c-hw,v1=c+hw,s0=c-0.575,s1=c+0.575,up=solidGeo([{loop:ccw([L(-uw,v0),L(uw,v0),L(uw,s0),L(-uw,s0)]),y0:ck,y1:yE},
        {loop:ccw([L(-uw,s0),L(uw,s0),L(uw,s1),L(-uw,s1)]),y0:ck,y1:yE-2.0},{loop:ccw([L(-uw,s1),L(uw,s1),L(uw,v1),L(-uw,v1)]),y0:ck,y1:yE}]);
      up.applyMatrix4(new THREE.Matrix4().set(1,-VO[0]*tn,0,VO[0]*tn*ck,0,1,0,0,0,-VO[1]*tn,1,VO[1]*tn*ck,0,0,0,1));tag(mesh(st,up,M.brass),'050302-3',1);
      const sp=tag(across(st,lathe([[0,-0.4],[0.33,-0.4],[0.33,0.4],[0,0.4]],16),M.steel,L(-0.5,RSTUD+HT/2+0.335),AX,yU),'050302-4.s');   /* the pin beside the spring's end in the slot, outside it, 0.005 clear of it, past the pinning point (4.36 out with the spring at 3.87 until 15 October 2026) */
      onRev(f=>{sp.position.y=yU+(f?SH1:0);});
      tag(screw(st,L(HU,c)[0],L(HU,c)[1],yB,1.2,0.8,SBT+2.0,0.7),'WN-11');R.studL=L;}

    /* ================= the rollers (Heberolle 05 04 03-1 = 02 04 02; Auslöserolle 05 04 04-1) ================= */
    /* The impulse roller (02 04 02, 11.2.41, revised 10.9.41: Kupfer Beryllium, Saphir): Ø 6.78 ±0.01, 1.6 +0.1 thick, bored 1.627/1.65 on 1:70; a hollow in its edge for the
       teeth, its bottom r 3.5 between corners 3.5 apart, the stone's face 2 from the one corner (the other 1.5 the other side; sure); the impulse stone (Hebestein 05 04 03-2,
       sapphire set in shellac) 0.5 thick, 1.8 long from 1.55 from the centre (its end slanted), 1.7 wide along the staff, its face on the roller's centre line; a hole Ø 1.3
       1.9 below the centre and 0.7 to the side (all sure); the stone's end bevelled 45 deg (below). The hollow lies behind the face, where the tooth comes (inferred from the motion). At rest the face is 24 deg before
       the line of centres (PHI0) */
    const rol=part('rollers',OFFB,[B[0],B[1],0]);R.rol=rol;
    /* each state's rollers at its own heights (Y, Y1): the same parts, 05 04_1's plan the same in both */
    for(const[Q,g]of[[Y,rv(rol,'last')],[Y1,rv(rol,'first')]]){const af=aBW-PHI0,u=dir(af),vl=[Math.sin(af*D2R),Math.cos(af*D2R)],rr=6.78/2,RF=(r,w)=>add(add([0,0],u,r),vl,w);   /* vl: toward the leading side (the way it turns in the impulse) */
      const cT=pol([0,0],rr,af+Math.asin(2.0/rr)/D2R),cL=pol([0,0],rr,af-Math.asin(1.5/rr)/D2R),cm=[(cT[0]+cL[0])/2,(cT[1]+cL[1])/2],ch=hyp(sub(cT,cL)),out=unit(cm),cc=add(cm,out,Math.sqrt(3.5*3.5-ch*ch/4));
      const a0=Math.atan2(cL[1]-cc[1],cL[0]-cc[0]),a1=Math.atan2(cT[1]-cc[1],cT[0]-cc[0]);let da=a1-a0;while(da>Math.PI)da-=TAU;while(da<-Math.PI)da+=TAU;
      const rec=[add(cL,unit(cL),0.8)];for(let i=0;i<=40;i++){const a=a0+da*i/40;rec.push([cc[0]+3.5*Math.cos(a),cc[1]+3.5*Math.sin(a)]);}rec.push(add(cT,unit(cT),0.8));
      const slot=[RF(1.5,-0.003),RF(3.0,-0.003),RF(3.0,0.503),RF(1.5,0.503)],notch=bool(rec,slot).uni[0],outl=bool(C([0,0],rr,360),notch).dAB[0];
      const ph=add(add([0,0],u,-1.9),vl,0.7);   /* 1.9 below the centre, 0.7 to the stone's side (02 04 02's plan, the stone at the top, its face on the right) */
      tag(mesh(g,solidGeo([{loop:outl,y0:Q.ir0,y1:Q.ir1,F:[{p:C([0,0],0.825+0.0015,64),a:Q.ir0,b:Q.ir1},{p:C(ph,0.65,48),a:Q.ir0,b:Q.ir1}]}]),M.copper),'050403-1');
      /* the stone: its end bevelled 45 deg from 3.35 at the face (1.8 from 1.55, the sheet's "1,8") to 2.85 at its back (02 04 02's plan traced at 33 px/mm: the back's
         corner 1.36 out from the stone's foot, the bevel 46.5 deg: sure); until 15 October 2026 slanted only to 3.2 at the back (scaled). makeEsc takes the face to 3.35 and
         no more of the stone (rp, wI; fI 0) */
      tag(mesh(g,solidGeo([{loop:[RF(1.55,0),RF(3.35,0),RF(2.85,0.5),RF(1.55,0.5)],y0:Q.ir0-0.05,y1:Q.ir1+0.05}]),M.ruby),'050403-2');R.impFace=af;}
    /* The discharge roller (Auslöserolle 05 04 04-1; no sheet in the set): a small brass block on the staff's Ø 1.2 seat (Wempe 3955's, 9_Wempe_3955_Hemmung.jpg, beyond its
       impulse roller: brass, likely; steel until 15 October 2026, no sheet giving its material), drawn dashed on 05 04_1 as an oblong 2.77 × 2.15
       about the staff (traced again 15 October 2026 at 24.4 px/mm: round at the far end, the dashes at the stone's end too faint to read square or round, the far end
       1.28 from the staff and the near 1.73 with the stone; a square end there would put its corners 1.55 from the staff, at the gold spring's tip: not drawn), and the discharge stone (Auslösestein 05 04 04-2) 1.7 wide along the staff (05 04_1: sure) at its end, 0.4 across (scaled), reaching RD from the staff
       (above). Its thickness 1.6, as 05 04_1 draws it. Its turn: the stone leaves the gold spring with the balance at rest. Its end bevelled back DS from the acting corner
       (full reach, the side toward the gold spring's tip) to the other, as the layout's corners and makeEsc's BEV take it (until 15 October 2026 drawn square). Measured
       again on 05 04_1 (24.4 px/mm, the dashed outline at (180-198, 453-463) px): the acting corner at the gold spring's tip, the other corner 4-5 px back, 0.15-0.2,
       the stone 8 px across (0.33); ±3 px, the faint dashes and the "1°" figures beside the lower corner: DS's 0.3 is kept (README, Estimated) */
    for(const[Q,g]of[[Y,rv(rol,'last')],[Y1,rv(rol,'first')]]){const b=BETA,u=dir(b),pp=[u[1],-u[0]],L=(e,w)=>add(add([0,0],u,e),pp,w),rf=Math.sqrt(RD*RD-DSW*DSW/4);
      const body=stadiumPts(L(-0.255,0),L(0.355,0),2.15),slot=[L(0.85,-DSW/2-0.003),L(2.0,-DSW/2-0.003),L(2.0,DSW/2+0.003),L(0.85,DSW/2+0.003)],outl=bool(body,slot).dAB[0];
      tag(mesh(g,solidGeo([{loop:outl,y0:Q.dr0,y1:Q.dr1,F:[{p:C([0,0],0.6+0.0015,48),a:Q.dr0,b:Q.dr1}]}]),M.brass),'050404-1');
      tag(mesh(g,solidGeo([{loop:[L(0.9,-DSW/2),L(rf,-DSW/2),L(rf-DS,DSW/2),L(0.9,DSW/2)],y0:Q.dr0+0.05,y1:Q.dr1+0.15}]),M.ruby),'050404-2');}

    /* ================= the escape wheel (Gangrad 05 04 05-1, its pinion Gangtrieb 05 04 05-2, collet Gangradbutzen 05 04 05-3) ================= */
    /* The wheel (05 04_23, 02 04 08a, 20.1.42: Messingblech 1,6 Ms 63 federhart; 05 04_7.2, 19.7.43): 15 teeth (05 04_7.1 "z = 15"; 05 04_1's drawn teeth 24 deg apart), tips
       Ø 14 +0.03, the gaps' floor Ø 11.7 (RR); the locking face straight, leaning 25 deg back from the radius (FL), the tip flat 0.1834 (1½ deg), the back hollow (the ∅ 6
       cutter) to Ø 12.1, stepped 0.2 there down to the floor (RB0), the tooth 1 wide at the root (all sure; until 15 October 2026 the floor 12.1, the lean 15 deg, the step
       0.15); the rim inside Ø 10.9, 1.4 thick at the teeth and 0.8 in the web, flush on the pinion's side (05 04_1's elevation: "1,4"; 05 04_7.1 "0,8"), the recess Ø 11.62
       on the top plate's side; three openings each bounded by one arc r 7.9 (05 04_23), the crossings 0.6 wide at the rim (below); the bore 1.7 H7 (05 04_7.2's fit table:
       its callout reads 1.8). A crossing under the locked tooth, as 05 04_1 draws it (estimated). Gilt, as Wempe 3955's */
    const ew=part('escapeWheel',-30,[W[0],W[1],0]);R.ew=ew;
    /* each state's wheel at its own heights (Y, Y1); as first drawn its bore 1.8 (05 04_1's "1,8", sure). 05 04_7.1 draws its recess on the pinion's side, Ø 11.9 altered to
       12.4, 0.7 deep, against 05 04_1's elevation (the teeth standing over the web toward the plate) and the 1942 tooth form's roots Ø 12.1, which 12.4 would cut: the wheel is
       drawn as 05 04_1 and 05 04_23 (README, As first drawn) */
    for(const[Q,g,bo]of[[Y,rv(ew,'last'),1.7],[Y1,rv(ew,'first'),1.8]]){const tip0=P_A-D0,o=[];
      for(let j=0;j<15;j++){const a=tip0+24*j,T=p=>{const r=hyp(p),b=al(p);return pol([0,0],r,a+b);};
        o.push(pol([0,0],RR,a-BF),pol([0,0],RB0,a-BK));for(let i=TOOTH.arc.length-2;i>0;i--)o.push(T(TOOTH.arc[i]));o.push(pol([0,0],RT,a-1.5),pol([0,0],RT,a));
        const fr=-al(TOOTH.face);o.push(pol([0,0],RR,a-fr));for(let k=1;k<12;k++)o.push(pol([0,0],RR,a-fr+(24-BF+fr)*k/12));}
      /* the openings (05 04_23's crossing, its two flanks traced and fitted: r 7.93 and 7.92, the sheet's "7,9 r", their centres 9.43 from the wheel's on the openings' middle
         lines, 60.2 and 60.1 deg either side of the crossing, rms 0.24 px: sure): each opening bounded by the rim's inside and ONE arc r 7.9 from a centre 9.43 out, which comes
         within 1.53 of the wheel's centre (05 04_23 fits 1.50, 05 04_1 1.54) and leaves the crossings 0.53 wide at their narrowest, 4.7 out, 0.6 at the rim (05 04_23
         draws 0.51 at 4.9 out). Until 15 October 2026 two arcs r 7.9 met at a point 1.4 from the centre, the crossings 0.7 wide at the rim. The recess on the top plate's
         side, 0.6 deep, Ø 11.62: 05 04_7.2's dashed recess scales 11.65 (17.6 px/mm), the teeth's floor (11.7): drawn 0.04 inside it, so the floor keeps an edge */
      const g0=tip0-6,rim=10.9/2,OC=9.43,OR=7.9,F=[{p:C([0,0],11.62/2,240),a:Q.ew0,b:Q.ew0+0.6},{p:C([0,0],bo/2+0.004,48),a:Q.ew0,b:Q.ew1}];
      for(let k=0;k<3;k++){const bis=g0+120*k+60,ph=Math.acos((OC*OC+rim*rim-OR*OR)/(2*OC*rim))/D2R,Qc=pol([0,0],OC,bis),p1=pol([0,0],rim,bis-ph),p2=pol([0,0],rim,bis+ph),rimArc=[];
        for(let i=1;i<48;i++)rimArc.push(pol([0,0],rim,bis-ph+2*ph*i/48));
        const b0=Math.atan2(p2[1]-Qc[1],p2[0]-Qc[0]),b1=Math.atan2(p1[1]-Qc[1],p1[0]-Qc[0]),bc=Math.atan2(-Qc[1],-Qc[0]);let db=b1-b0;while(db>Math.PI)db-=TAU;while(db<-Math.PI)db+=TAU;
        {let dc=bc-b0;while(dc>Math.PI)dc-=TAU;while(dc<-Math.PI)dc+=TAU;if(Math.sign(dc)!==Math.sign(db)||Math.abs(dc)>Math.abs(db))db-=Math.sign(db)*TAU;}   /* the way round past the side toward the wheel's centre */
        const arcP=[];for(let i=1;i<48;i++){const b=b0+db*i/48;arcP.push([Qc[0]+OR*Math.cos(b),Qc[1]+OR*Math.sin(b)]);}
        F.push({p:[p1,...rimArc,p2,...arcP],a:Q.ew0,b:Q.ew1});}   /* each opening: round the rim's inside, back along its one arc */
      tag(mesh(g,solidGeo([{loop:o,y0:Q.ew0,y1:Q.ew1,F}]),M.gilt),'050405-1');}
    /* its arbor and pinion (05 04 05-2, Hz 7.6.40: Präz. Rundstahl 3,4; 05 04_7.2): 10 leaves of m 0.263 (tips Ø 2.97, roots 1.6: sure), 3 long (05 04_7.1); its face 5.3 from the
       arbor's pinion end (05 04_7.2: sure), the wheel 19 from it (sure), 22.8 −0.02 overall; pivots Ø 0.24 (boxed) × 0.5 (sure); the arbor Ø 1.2 under the pinion (05 04_7.1,
       likely); under the wheel Ø 1.0 to its shoulder 2 from the top-plate end ("2", sure; Ø scaled 1.0-1.08 at 17.6 px/mm), a cone from there to the pivot (until 15 October
       2026 the cone 0.4 long, ending 0.9 from the end). The collet (05 04 05-3 = 05 04 10 on 05 04_7.2), brass, 4.7 long (sure), as the sheet draws it (scaled, 17.6 px/mm by
       the 22.8, its lines' middles, ±0.03): Ø 2.8 for 1.6 over the wheel, then Ø 1.7 to its end, each step's top edge chamfered 0.15 (the sheet's drawn bevels, 3 px); its
       spigot Ø 1.7 in the wheel's bore. Until 15 October 2026 a cone Ø 2.6 at the wheel to Ø 1.5 */
    {const g=ew.children.find(c=>c.userData.rev==='last'),pv=0.12,yP1=Y.etL-5.3,yP0=yP1-3,ar=[[0,Y.etU],[pv,Y.etU],[pv,Y.etU+0.5],[0.5,Y.etU+2.0],[0.5,Y.ewWeb-0.002],[0.6,Y.ewWeb-0.002],[0.6,Y.etL-0.9],[pv,Y.etL-0.5],[pv,Y.etL],[0,Y.etL]];
      tag(mesh(g,lathe(ar,24),M.steel),'050405-2');
      const pn=tag(mesh(g,WTRAIN.gear(WTRAIN.teeth(10,0.263,2.97,1.6),3),M.steel,0,(yP0+yP1)/2,0),'050405-2',1);   /* the leaves on the sheet's tip and root, as the train's pinions (train.js) */pn.userData.gear={z:10,m:0.263};R.pinion=pn;
      const c0=Y.ew1,c1=c0+1.6,c2=c0+4.7,ch=0.15;
      tag(mesh(g,lathe([[0.6+0.0015,Y.ewWeb],[0.85,Y.ewWeb],[0.85,c0],[1.4,c0],[1.4,c1-ch],[1.4-ch,c1],[0.85,c1],[0.85,c2-ch],[0.85-ch,c2],[0.6+0.0015,c2]],40),M.brass),'050405-3');}
    /* As first drawn, the arbor 05 04_7.1 (Gangrad 050408 bis 10, 4.4.41; Y1 above): the pinion's far face 5.3 from the dial end, the leaves as 05 04 05-2's; the arbor Ø 1.2
       under the pinion ("1,2", likely; "Kegel 1:70" drawn straight); from the wheel's plate face Ø 1.05 for 0.5 (scaled), a cone to the pivot Ø 0.24 (boxed) × 0.5 (sure),
       2.5 in all (17.7 − 15.2; the sheet's "2" runs from the cylinder's end); the collet a cone Ø 3.0 at the wheel to Ø 2.2 at 1.8 (sure, but 2.2 scaled), then a pipe Ø 1.8
       to 5 over the wheel (sure), its spigot through the wheel's bore (estimated). The same lines as the later issue's: 05 04_7.2 is this sheet renumbered 05 04 05 */
    {const g=ew.children.find(c=>c.userData.rev==='first'),pv=0.12,yP1=Y1.pf,yP0=yP1-3,ar=[[0,Y1.etU],[pv,Y1.etU],[pv,Y1.etU+0.5],[0.525,Y1.etU+2.0],[0.525,Y1.ewWeb-0.002],[0.6,Y1.ewWeb-0.002],[0.6,Y1.etL-0.9],[pv,Y1.etL-0.5],[pv,Y1.etL],[0,Y1.etL]];
      tag(mesh(g,lathe(ar,24),M.steel),'050405-2');
      const pn=tag(mesh(g,WTRAIN.gear(WTRAIN.teeth(10,0.263,2.97,1.6),3),M.steel,0,(yP0+yP1)/2,0),'050405-2',1);pn.userData.gear={z:10,m:0.263};R.pinion1=pn;
      tag(mesh(g,lathe([[0.6+0.0015,Y1.ewWeb],[0.9,Y1.ewWeb],[0.9,Y1.ew1],[1.5,Y1.ew1],[1.1,Y1.ew1+1.8],[0.9,Y1.ew1+1.8],[0.9,Y1.ew1+5],[0.6+0.0015,Y1.ew1+5]],40),M.brass),'050405-3');}

    /* ================= the detent (Gangfeder 05 04 01-1 = 1436, Ruhestein -3, Goldfeder -2) ================= */
    /* 1436 (Rud. Grießbach, 17.2.43, "Stahl"), its figures each followed by a second in brackets: 0,25 (0,22), 0,33 (0,28), 0,55 (0,50), 0,65 (0,60), 0,8 (0,75), 2 (1,9), 1 (0,9),
       5,4 (4,9). Every pair differs by 0.03-0.1, the bracketed always the smaller: read as the size to grind it to from the first (the blank's): the finished sizes are
       built (inferred; README). The foot 0.60 × 1.9 × 6.6, clamped to the block's end (05 04 01-4) by a screw M1 along it, two steady pins; the spring 0.07 thick (0.09 at the
       foot: likely), 1.9 wide, 5 long (scaled); the square 1.9 × 2 (Viereck); the blade 0.50 then 0.28 thick, 0.9 wide; the pipe Ø 1.15 (likely) × 1.9 across the blade for the
       stone; the horn ("Spitze", 0.22 × 0.75) on past the stone, bent toward the block (1436's "Anschrägen") so the gold spring rests on it, HORN_L long from the stone. Heights: the foot 3.2-5.2 under the plate (its screw 2.3 from the block's lower face, 05 04 01-4), the blade 1 wide at its lower
       half (1436's right view: the narrow blade flush with one edge), the pipe from 0.1 under the wheel's teeth down 1.9 (1436's 1.9 across the blade; until 15 October 2026 from 3.3 under the plate down 2.0, which
       the wheel 0.38 lower (05 04_7.2's 19) would leave 0.01 under its teeth): PIPE0, its top's depth under the plate */
    const PIPE0=Y.ew1-TI+0.1;
    const det=part('detent',-30),detS=new THREE.Group(),detM=new THREE.Group();det.add(detS,detM);R.det=detM;
    const piv=D(TP,0);detM.position.set(piv[0],0,piv[1]);const dm=new THREE.Group();dm.position.set(-piv[0],0,-piv[1]);detM.add(dm);   /* the detent turns about its spring's middle */
    /* each state's detent (dv below): its two groups, fixed (sS) and turning (sM); as last revised the heights above and the bracketed sizes. As first drawn (05 04_1's
       elevation): the detent 2 wide from 1.3 to 3.3 under the plate ("1,3", sure; 1436's width), the blade's 1 flush with its lower edge (scaled 2.34 to 3.36), so 1.9 nearer
       the plate; 1436's first sizes (the unbracketed figures): the foot 0.65, the square and the blade's thicker part 0.55, the blade 0.33, the horn 0.25; the pipe Ø 1.15 from
       1.95 to 3.65 under the plate, between the wheel's teeth and the block's arm (05 04_1's elevation draws pipe and stone over the wheel's arbor and can't be read apart: estimated), the stone
       out of it to the teeth; its lengths and plan the same (05 04_1's plan: 8.4 pipe to square, the square 2, the spring 5, the foot 6.6 under the block's edge, 18.8 from the
       stone to the block's screw). The gold spring lies on the thicker square 0.025 further out */
    /* the horn's length from the stone, HORN_L: 1436's figure, 4.4 to the pipe's centre (its drawing scales 5.2: not to scale there); Wempe 3955's detent seen along its
       pipe (10_Vergleich_CWW-6MX_Gangfeder_mit_Kloben.jpg, 21.7 px/mm by the pipe's Ø 1.15) measures 4.4-4.55, the gold spring's tip just past it, as on the 6MX's
       (8_Gangfeder_mit_Kloben_Rus_einfach.jpg). Its end then lies 1.598 from the staff, 0.038 outside the discharge stone's reach (RD 1.560), and the gold spring's tip
       (1.54) 0.056 past it (likely; 3.5 until 15 October 2026, an estimate kept 1 short of the tip). An unbracketed figure, so the first drawn detent's too */
    const HORN_L=4.4;
    const dv=(sS,sM,o)=>{const yd=d=>TI+d,y0F=yd(o.d0),y1F=yd(o.d0+2),y0b=yd(o.d0+1),y1b=yd(o.d0+2),rect=(t0,t1,n0,n1)=>[D(t0,n0),D(t1,n0),D(t1,n1),D(t0,n1)],fh=o.tf/2;
      tag(mesh(sS,solidGeo([{loop:rect(FOOT0,FOOT0+6.6,-fh,fh),y0:y0F,y1:y1F}]),M.steel),'050401-1');
      const sp0=rect(TP,FOOT0,-0.035,0.035),sp1=rect(SPR0,TP,-0.035,0.035);
      tag(mesh(sS,solidGeo([{loop:sp0,y0:y0F+0.05,y1:y1F-0.05}]),M.steel),'050401-1',1);
      tag(mesh(sM,solidGeo([{loop:sp1,y0:y0F+0.05,y1:y1F-0.05}]),M.steel),'050401-1',1);
      tag(mesh(sM,solidGeo([{loop:rect(SQ0,SPR0,-o.tq/2,o.tq/2),y0:y0F+0.05,y1:y1F-0.05}]),M.steel),'050401-1',1);   /* the square */
      tag(mesh(sM,solidGeo([{loop:rect(SQ0-2.9,SQ0,-o.tq/2,o.tq/2),y0:y0b,y1:y1b}]),M.steel),'050401-1',1);   /* the blade's thicker part, 2.9 long (scaled on 1436's left view) */
      tag(mesh(sM,solidGeo([{loop:rect(0.4,SQ0-2.9,-o.tb/2,o.tb/2),y0:y0b,y1:y1b}]),M.steel),'050401-1',1);   /* the blade, into the pipe's wall */
      tag(mesh(sM,solidGeo([{loop:C(P,1.15/2,96),y0:yd(o.pp),y1:yd(o.pp+o.pl),F:[{p:C(P,RS+0.002,64),a:yd(o.pp),b:yd(o.pp+o.pl)}]}]),M.steel),'050401-1',1);   /* the pipe */
      tag(mesh(sM,solidGeo([{loop:[D(-0.2,-0.40),D(-0.45,-0.25),D(-0.7,GNB-0.005),D(-HORN_L,GNB-0.005),D(-HORN_L,GNB-0.005-o.th),D(-0.5,GNB-0.005-o.th),D(-0.15,-0.52)],y0:yd(o.d0+1.1),y1:yd(o.d0+1.9)}]),M.steel),'050401-1',1);   /* the horn */
      /* the locking stone (Ruhestein 05 04 01-3): Ø 0.75 in the pipe, ground half away below it to its flat, which faces the oncoming tooth along the line from the wheel's
         centre (05 04_1's plan: the hatched half); it stands out of the pipe to 0.1 over the teeth (estimated) */
      const hd=[];for(let i=0;i<=24;i++)hd.push(add([0,0],dir(P_A+180*i/24),RS));   /* the round half lies on the side the wheel turns toward, its flat on the line from the wheel's centre */
      tag(mesh(sM,solidGeo([{loop:C([0,0],RS,64),y0:yd(o.pp),y1:yd(o.pp+o.pl)}]),M.ruby,P[0],0,P[1]),'050401-3');   /* built about its axis, placed at the stone's centre */
      tag(mesh(sM,solidGeo([{loop:ccw(hd),y0:o.ew0-0.06,y1:yd(o.pp)}]),M.ruby,P[0],0,P[1]),'050401-3',1);
      /* the gold spring (Goldfeder 05 04 01-2, 16.9.42: Goldblech 333 federhart): 0.15 thick, its head 2 wide and 2.4 long with a hole Ø 0.7 1.2 from its end, the arm 1 wide
         flush with one edge, 15.4 overall (sure); screwed to the square's face toward the wheel (Schrb. WN-14), round the pipe to rest on the horn, its tip where 05 04_1 puts it.
         Past its bending point it bends away from the horn as the discharge stone passes on the return swing */
      const g1=GB[1]+o.gs,head=SQ0+2.2,path=[[head,g1],[GB[0],g1],[3.0,0.62],[0.6,0.72],[0,0.72],[-0.5,0.55],[-0.85,0.15],[-1.2,-0.25],[-1.6,GN],[GT,GN]];
      const offs=(pts,w)=>{const L=[],Rr=[];for(let i=0;i<pts.length;i++){const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],u=unit(sub(b,a)),nn=[-u[1],u[0]];L.push(add(pts[i],nn,w/2));Rr.push(add(pts[i],nn,-w/2));}return[...L,...Rr.reverse()];};
      const free=path.slice(1);
      {const n0=g1-GW/2,n1=g1+GW/2,h0=head-2.4,Q=pts=>ccw(pts.map(([t,n])=>D(t,n)));   /* the head 2 wide, the arm 1 */
        tag(mesh(sM,solidGeo([{loop:Q([[GB[0],n0],[h0,n0],[h0,n1],[GB[0],n1]]),y0:y0b,y1:y1b},{loop:Q([[h0,n0],[head,n0],[head,n1],[h0,n1]]),y0:y0F,y1:y1b}]),M.gilt),'050401-2');}
      const gf=new THREE.Group(),bp=D(GB[0],GB[1]);gf.position.set(bp[0],0,bp[1]);sM.add(gf);const gfi=new THREE.Group();gfi.position.set(-bp[0],0,-bp[1]);gf.add(gfi);R.golds.push(gf);
      tag(mesh(gfi,solidGeo([{loop:offs(free,GW).map(([t,n])=>D(t,n)),y0:y0b,y1:y1b}]),M.gilt),'050401-2',1);
      /* its screw (WN-14), across into the square: head Ø 1.2 × 0.4, M0.7 (estimated) */
      tag(across(sM,lathe([[0,0],[0.6,0],[0.6,0.4],[0.33,0.4],[0.33,0.4+0.55],[0,0.95]],20),M.blued,D(head-1.2,g1+GW/2+0.4),TD.n.map(v=>-v),yd(o.d0+1)),'WN-14');
      /* the foot's screw M1 along it into the block (number not read) and its two steady pins (Stellstift 2, WN-201 in the coloured section), drawn without holes across */
      tag(across(sS,lathe([[0,0],[0.8,0],[0.8,0.45],[0.5,0.45],[0.5,0.45+3.4],[0,3.85]],20),M.steel,D(ROW,fh+0.45),TD.n.map(v=>-v),yd(o.d0+1)),'WN-gf');
      for(const s of[-2.1,2.1])tag(across(sS,lathe([[0,-1.6],[0.225,-1.6],[0.225,1.6],[0,1.6]],12),M.steel,D(ROW+s,-fh),TD.n,yd(o.d0+1)),'WN-201.d');};
    R.golds=[];
    dv(rv(detS,'last'),rv(dm,'last'),{d0:3.2,pp:PIPE0,pl:1.9,tf:0.60,tq:0.50,tb:0.28,th:0.22,gs:0,ew0:Y.ew0});
    dv(rv(detS,'first'),rv(dm,'first'),{d0:1.3,pp:1.95,pl:1.7,tf:0.65,tq:0.55,tb:0.33,th:0.25,gs:0.025,ew0:Y1.ew0});
    R.gold=R.golds[0];

    /* ================= the detent block (Gangfederkloben 05 04 01-4, 8.7.43) ================= */
    /* An L (tolerances ±0.1): the base 14.6 long and 7.5 deep (the sheet's 25 overall less 17.5 to the base), 6.5 thick; the upright 3 wide and 3 thick, 25 from the base's foot,
       its left edge 1.4 +0.1 in from the base's end, joined to the base by a fillet r 3, its end slit 0.3 for 7 and a cross screw M1.2 there, 18.8 ±0.03 from the base's hole row;
       in the base: the fixing M1.7 7.3 +0.04 from the end, a hole Ø 1.3 × 3 deep at 2.8 with the M1 for the detent's foot along it from the end face, steady pins Ø 0.9 at 2.3
       and 12.3, 2 either side of the row; the row 3.75 from the base's foot (all sure). The base is 6.5 deep only next to its end: the view under the front view draws it
       6.5 deep for 6.4 from the end ("6,5"; drawn 6.37-6.41 at 17.3 px/mm, the front view's dashed line there at 6.41) and 3 deep beyond ("3"), the thin part flush with
       the face the fixing screw and the far steady pin come through, so with the plate (sure: a base standing off the plate there couldn't be screwed to it). Built 6.4,
       as drawn: the figure would cut 0.05 into the M1.7's thread, whose edge the front view draws touching the step. Until 15 October 2026 the base was 6.5 deep over its
       whole 14.6. The front view is the face on the plate seen from above, as the frame's plans are: only so does the base's end the detent's foot is clamped to face the
       detent. Its side view is read as the right end (third angle), which puts the upright flush with the plate and the M1 2.3 from the free face, at the escapement's level
       (inferred; the hole Ø 1.3 is drilled from the free face to meet it). The sheet itself reads as first-angle (DIN's): its side view draws the M1 hole in the end face
       as seen (a view of the left end, placed right), the view under the front view draws the upright and its fillet as seen (a view from above, placed below), and only so
       does the Ø 1.3, 3 deep from the front face, meet the M1 2.3 from that face; read so, the upright lies at the free face and the detent's foot 1.3-3.3 under the plate,
       as 05 04_1 draws the 1941 detent, where the 1946 staff's discharge roller (05 04 02: 3.4-5.0 under the plate) couldn't reach its gold spring. Kept as built (README,
       Unresolved). Screwed up from the top plate's outer face through hole 13, the pins in the plate (holes drilled at assembly: estimated). The 0.4 step at the base's top
       and the 90 +0.5 deg end are left out. The cone Wempe 3955's block carries at the stone (10_, 11_Wempe_3955) belongs to the 1941 block of 05 04_1, not this one */
    const blk=part('detentBlock',-30),blkL=rv(blk,'last'),blkF=rv(blk,'first');
    /* As first drawn the block's arm lies over the lower cock's lug, 0.28 above it, so in the Exploded view the arm leaves first: the block, with the detent clamped to it
       and the escape wheel whose teeth lie 0.05 over the detent's pipe, rises 30.3 and the cock 29.9 (frame.js's 31 as last revised), which keeps the 0.5 exploded.py asks
       from the block and from the seconds wheel under the cock's lug (33) */
    {const P=K.parts;onRev(f=>{P.lowerCock.userData.off=f?-29.9:-31;for(const k of['detentBlock','detent','escapeWheel'])P[k].userData.off=f?-30.3:-30;});}
    {const yP=TI,nE=-0.30,L=(t,n)=>D(t,n),tF=ROW+3.75,tT=ROW-3.75,tU=tF-25,nUl=nE-1.4,nUr=nUl-3,sl0=nUl-1.35,sl1=sl0-0.3,fr=[];
      for(let i=1;i<12;i++){const a=Math.PI/2*i/12;fr.push(L(tT-3+3*Math.sin(a),nUr-3+3*Math.cos(a)));}
      const upCell={loop:[L(tT,nUl),L(tU+7,nUl),L(tU,nUl),L(tU,sl0),L(tU+7,sl0),L(tU+7,sl1),L(tU,sl1),L(tU,nUr),L(tT-3,nUr),...fr,L(tT,nUr-3),L(tT,nE-6.4)],y0:yP,y1:yP+3};
      const base={loop:[L(tT,nE),L(tT,nUl),L(tT,nE-6.4),L(tF,nE-6.4),L(tF,nE)],y0:yP,y1:yP+6.5,
        F:[{p:C(L(ROW-2,nE-2.3),0.45,32),a:yP,b:yP+6.5},{p:C(L(ROW,nE-2.8),0.65,32),a:yP+3.5,b:yP+6.5}]};   /* the boss at the end, 6.5 deep */
      const thin={loop:[L(tT,nE-6.4),L(tT,nUr-3),L(tT,nE-14.6),L(tF,nE-14.6),L(tF,nE-6.4)],y0:yP,y1:yP+3,
        F:[{p:C(H[13],0.87,48),a:yP,b:yP+3},{p:C(L(ROW+2,nE-12.3),0.45,32),a:yP,b:yP+3}]};   /* the rest, 3 deep on the plate */
      upCell.loop=ccw(upCell.loop);base.loop=ccw(base.loop);thin.loop=ccw(thin.loop);
      tag(mesh(blkL,solidGeo([base,thin,upCell]),M.brass),'050401-4');
      /* the cross screw M1.2 across the upright's slit end (its number not read), drawn without its hole. It is the detent's banking (15 October 2026, likely): the 6MX's
         block of this form (8_Gangfeder_mit_Kloben_Rus_einfach.jpg, 10_Vergleich_CWW-6MX_Gangfeder_mit_Kloben.jpg) has a screw through its upright with a domed brass head
         on the detent's far side, the pipe resting on its face, the slit gripping its thread; Wempe 3955's earlier block the same at its stone; the 1954 instruction's п. 11
         and the 6MX's book: a banking screw sets the depth of lock. Its head and its length to it aren't drawn: where it passes the detent depends on which face of the block
         the upright is flush with (README, Unresolved) */
      tag(across(blkL,lathe([[0,0],[0.9,0],[0.9,0.5],[0.6,0.5],[0.6,0.5+3.0],[0,3.5]],20),M.steel,L(ROW-18.8,nUr-0.5),TD.n,yP+1.5),'WN-gkA');
      /* the fixing screw from the plate's outer face through 13 (drilled 1.8): head Ø 3.0 × 1.2 (Wempe 3955's, 11_), M1.7, 3.0 into the block (estimated) */
      {const fx=K.headOn(tag(screw(blk,H[13][0],H[13][1],TT,1.5,1.2,3.35+3.0,0.85),'WN-gk'),'detentBlock','topPlate'),l0=fx.userData.lift;onRev(f=>{fx.userData.lift=l0+(f?-0.3:0);});}   /* its lift through the plate follows the block's (above) */
      /* its steady pins Ø 0.9 through the block, 1.3 into the plate: as last revised the far one through the thin part, 3 (until 15 October 2026 6.5, as the first drawn block's) */
      for(const[g,e2]of[[blkL,3],[blkF,6.5]])for(const[q,e]of[[L(ROW-2,nE-2.3),6.5],[L(ROW+2,nE-12.3),e2]])tag(cylBetween(g,0.45,TI-1.3,TI+e,M.steel,q[0],q[1],16),'WN-gkP');
      R.blkPins=[L(ROW-2,nE-2.3),L(ROW+2,nE-12.3)];
      /* As first drawn: 05 04_1's block (no sheet of its own; the plan at 10:1, 24.4 px/mm), as on Wempe 3955 (11_Wempe_3955_Gangfeder_plus.jpg, 10_Vergleich_CWW-6MX). The
         same base, its fixing screw, steady pins and the detent's foot under its edge (the plan's holes fall on 05 04 01-4's: sure), the foot's face 0.025 further out for
         1436's thicker foot; in place of the upright a long arm toward the stone, 2.8 thick on the base's free side, 3.7 to 6.5 under the plate ("2,8", "6,5", sure), 3.56 wide
         and flush with the base's edge, as both photographs have it (11_, 10_Vergleich_CWW-6MX: 3.6 wide at 22.3 px/mm by the base's 14.6); 05 04_1 sets it back 1.06 and
         draws it 2.5 wide, its far edge 3.56 behind the base's edge as the photographs' (scaled, 24.4 px/mm). Its end 2.9 past the stone (scaled 21.84 from the block's screw),
         joined to the base by a cove r 1.82 and a ledge 0.78 to the base's face (scaled; the photographs show the cove). Through the arm, on the stone's line, the banking screw that ends in a brass cone standing out past the
         arm (05 04_1's "pointed piece", its slotted end seen in the elevation 5.1 under the plate, "1,4" over the arm's face: sure): Ø 0.85, the cone 2.5 long (on Wempe 3955's
         photograph, 30 px/mm: the sheet scales Ø 1.2-1.3 and 3.3; the photograph wins), its near end in the arm's face (no head in the plan). The arm's end is slit along the screw
         to clamp it (05 04_1's elevation, the photograph): not cut, a slit inside the arm's depth. The hole Ø 1.3 to the foot's screw, 2.8 from the edge (05 04 01-4), is
         drilled from the plate's side, 3 deep to meet the screw 2.3 under the plate: Wempe 3955's base shows it on that face, 2.4-2.5 from the edge (scaled, 28.4 px/mm).
         The photograph puts the fixing screw 9.1 from the edge, the plate's hole 13 and 05 04_1 7.6: drawn at 13. The gilt dish both photographs show at the detent's tip is
         on no sheet: not built (README) */
      {const nF=-0.325,tE=-2.9,nA0=nF,nA1=nF-3.56,rc=1.82,nC=nA1-rc,tC=tT-2.6,arc=[];
        for(let i=1;i<16;i++){const a=Math.PI/2*i/16;arc.push(L(tC+rc*Math.cos(a),nC+rc*Math.sin(a)));}
        const plate={loop:ccw([L(tT,nF),L(tT,nC),L(tT,nE-14.6),L(tF,nE-14.6),L(tF,nF)]),y0:yP,y1:yP+6.5,
          F:[{p:C(H[13],0.87,48),a:yP,b:yP+6.5},{p:C(L(ROW-2,nE-2.3),0.45,32),a:yP,b:yP+6.5},{p:C(L(ROW+2,nE-12.3),0.45,32),a:yP,b:yP+6.5},{p:C(L(ROW,nE-2.8),0.65,32),a:yP,b:yP+3.0}]};
        const arm={loop:ccw([L(tE,nA0),L(tT,nA0),L(tT,nC),L(tC+rc,nC),...arc,L(tC,nA1),L(tE,nA1)]),y0:yP+3.7,y1:yP+6.5};   /* its near face on the base's edge, sharing its corner */
        tag(mesh(blkF,solidGeo([plate,arm]),M.brass),'050401-4');
        const u1=nA0-nA1;tag(across(blkF,lathe([[0,0],[0.425,0],[0.425,u1],[0,u1+2.5]],20),M.brass,D(0,nA0),TD.n.map(v=>-v),yP+5.1),'cone41');}}

    /* ================= jewels: the balance's (05 04 06, 05 04 07, 05 04 08 by the coloured section's labels) ================= */
    /* Each bearing a hole jewel in its setting (Lagerstein in its Fassung) and an endstone in its own (Deckstein, Fassung 05 04 08-2), as the coloured section draws them; no
       sheet of them is in the set: Ø 5.2 to the seats (05 08 03-1, 05 08 00-2: H7), the stones Ø 2.0 × 0.35 and their holes 0.02 over the pivots, 0.03 between hole jewel and
       endstone (estimated). Upper: in the cock, the endstone's setting from its top face held by two screws (WN-55 by the coloured section's label, M1.2, at the cock's two tapped
       holes) over its edge, the hole jewel's from below with its flange Ø 6 in the cock's sink (05 08 03-1, U30). Lower: in the lug, both from below, held by two screws (WN-16).
       Wempe 3955's cock (2_Wempe_3955_A.jpg, 8.81 px/mm by the top plate's 85) shows the upper endstone through its setting, a clear domed stone (a Wempe's is described as
       a diamond endstone: Bonhams), the setting gilt and its screws brass: the setting open over the stone (Ø 1.6), the stone drawn bright (likely). Until 16 October 2026 the
       setting closed over a ruby and its screws steel */
    const bju=part('balanceJewelsUp',OFFB,[B[0],B[1],0]),bjl=part('balanceJewelsLow',-24,[B[0],B[1],0]);
    {const ck=TT-15,eY=Y.tipU-0.02,hY=eY+0.03;
      tag(mesh(bju,lathe([[0.8,ck],[2.6,ck],[2.6,eY],[1.003,eY],[1.003,eY-0.35],[0.8,eY-0.35]],48),M.gilt),'050408-2.bu');
      tag(mesh(bju,lathe([[0,eY-0.5],[0.6,eY-0.47],[1.0,eY-0.35],[1.0,eY],[0,eY]],32),M.steel),'050408-1.bu');   /* domed on its outside, under the setting's opening; drawn bright and opaque, as the photograph's white stone (a clear one would show the ruby under it) */
      tag(mesh(bju,lathe([[0.45,hY+0.35],[1.003,hY+0.35],[1.003,hY],[2.6,hY],[2.6,ck+2.4-0.5],[2.998,ck+2.4-0.5],[2.998,ck+2.4],[0.45,ck+2.4]],48),M.brass),'050406-2.bu');
      tag(mesh(bju,stoneGeo(1.0,0.125,0.35,'olive'),M.ruby,0,hY+0.175,0),'050407-1.bu');
      for(const s of[-1,1]){const q=BL(add(B,AX,3.525*s));tag(screw(bju,q[0],q[1],ck,1.0,0.6,2.0,0.46,M.brass),'WN-55.ck');}}
    {const lf=TI+10,eY=Y.tipL+0.02,hY=eY-0.03,o=H[36],bu=unit(sub(H[37],H[22])),nv=(q=>q[0]*(B[0]-o[0])+q[1]*(B[1]-o[1])>0?q:[-q[0],-q[1]])([-bu[1],bu[0]]);
      tag(mesh(bjl,lathe([[0.45,lf-3.22+0.5],[2.6,lf-3.22+0.5],[2.6,eY],[1.003,eY],[1.003,hY-0.35],[0.45,hY-0.35]],48),M.brass),'050406-2.bl');
      tag(mesh(bjl,stoneGeo(1.0,0.125,0.35,'olive'),M.ruby,0,hY-0.175,0),'050407-1.bl');
      tag(mesh(bjl,lathe([[0,lf],[2.6,lf],[2.6,eY],[1.003,eY],[1.003,eY+0.35],[0,eY+0.35]],48),M.brass),'050408-2.bl');
      tag(mesh(bjl,lathe([[0,eY],[1.0,eY],[1.0,eY+0.35],[0,eY+0.35]],32),M.ruby),'050408-1.bl');
      const f=flip(bjl);for(const s of[-1,1]){const q=BL(add(B,nv,3.5*s));tag(screw(f,q[0],-q[1],-lf,1.0,0.6,2.0,0.6),'WN-16');}}
    /* ================= jewels: the escape wheel's ================= */
    /* Upper, in the top plate's seat 26 (05 09 01 P-Q: Ø 5.2 H7 from the inner face to 0.5 under the outer, Ø 4.5 H7 through that): the endstone's setting from the inside,
       its spigot Ø 4.5 through the lip (the H7 is its fit) flush with the outer face, held by two screws M1.2 from the outside (the plate's two at ±3.5 on the O-W line), their
       heads Ø 2.6 over the spigot's edge; the hole jewel's setting under it flush with the inner face. Wempe 3955 (2_Wempe_3955_A.jpg, 8.81 px/mm by the plate's 85): a gilt
       setting Ø 4.5 flush in the plate showing a domed ruby, the two slotted brass screws' heads 2.5 across and 6.94 apart at its edge; its inner face (13_) shows their ends:
       sure. The stone Ø 2.5 seen through Ø 2.2 (estimated). Until 16 October 2026 the setting stood under the lip, closed over the stone, the screws in from the inside.
       Lower, in the pillar plate's 26 (reamed 2.50, 05 08 02-1): the hole jewel in a bush pressed in; the endstone in a round setting Ø 4.6 flush in a seat 0.25 deep in the
       dial face, a boss Ø 2.6 in its middle standing 0.36 over the face round the stone (Ø 2.2, seen through Ø 1.9) (the pivot's end is at the face), held by the plate's two M1.2 (05 08 02-1, on the
       line 37 deg below O toward S) whose heads Ø 2.6 lap its rim: Wempe 3955's dial side (3_Wempe_3955_uZ.jpg, 8.33 px/mm by the plate's 85): the setting Ø 4.6 in its seat
       (5.1 outside), the ruby showing, the screws' heads 2.6 lapping it 7.7 apart (the sheet's 7.0 kept): likely. Until 16 October 2026 a stadium cap 7 × 3 over both
       screws. Their sizes otherwise as the balance's (estimated) */
    const eeu=part('escEndstoneUp',-37,[W[0],W[1],0]),eju=part('escJewelUp',-34,[W[0],W[1],0]),ejl=part('escJewelLow',-4,[W[0],W[1],0]),eel=part('escEndstoneLow',6,[W[0],W[1],0]);
    /* each state's at its arbor's ends (Y, Y1). As first drawn (05 04_7.1) the top-plate end lies 2.0 into the plate: the hole jewel's setting fills the seat down to it, its
       bore opened to 0.6 for the arbor's cone; the dial end 1.96 into the pillar plate: the bush shortened to it and the endstone in a plug set from the dial face under the
       cap, which is then plain (estimated, as the settings themselves: no sheet of them) */
    for(const[Q,v]of/** @type {[any,string][]} */([[Y,'last'],[Y1,'first']])){const eY=Q.etU-0.02,hY=eY+0.06,ge=rv(eeu,v),gj=rv(eju,v),bo=v==='first'?0.6:0.45;
      tag(mesh(ge,lathe([[1.1,TT],[2.25,TT],[2.25,TT+0.5],[2.6,TT+0.5],[2.6,eY],[1.253,eY],[1.253,eY-0.35],[1.1,eY-0.35]],48),M.gilt),'050408-2.eu');
      tag(mesh(ge,lathe([[0,eY-0.5],[0.7,eY-0.46],[1.25,eY-0.35],[1.25,eY],[0,eY]],32),M.ruby),'050408-1.eu');
      tag(mesh(gj,lathe([[bo,TI],[2.6,TI],[2.6,hY],[0.903,hY],[0.903,hY+0.35],[bo,hY+0.35]],48),M.brass),'050406-2.eu');
      tag(mesh(gj,stoneGeo(0.9,0.135,0.35,'olive'),M.ruby,0,hY+0.175,0),'050406-1.eu');}
    for(const s of[-1,1])tag(screw(eeu,3.5*s,0,TT,1.3,0.3,3.4,0.6,M.brass),'WN-es').userData.lift=0;   /* from the outside, their ends just through the inner face; their heads 0.3 high, under the balance's rim, which passes 0.47 over the plate's face */
    {const u=[-Math.cos(37*D2R),Math.sin(37*D2R)];
      for(const[Q,v]of/** @type {[any,string][]} */([[Y,'last'],[Y1,'first']])){const eY=Q.etL+0.02,hY=eY-0.20,gj=rv(ejl,v),ge=rv(eel,v),f1=v==='first';
        tag(mesh(gj,lathe([[0.7,hY-0.5],[1.25,hY-0.5],[1.25,f1?eY:PPT-0.25],[0.4,f1?eY:PPT-0.25],[0.4,hY],[0.803,hY],[0.803,hY-0.35],[0.7,hY-0.35]],48),M.brass),'050406-2.el');
        tag(mesh(gj,stoneGeo(0.8,0.135,0.35,'olive'),M.ruby,0,hY-0.175,0),'050406-1.el');
        if(f1){tag(mesh(ge,lathe([[0,PPT-0.25],[2.3,PPT-0.25],[2.3,PPT],[0,PPT]],48),M.gilt),'050408-2.el');   /* as first drawn: the setting plain over the plug (its stone deep in the plate) */
          tag(mesh(ge,lathe([[0,eY+0.35],[0.803,eY+0.35],[0.803,eY],[1.25,eY],[1.25,PPT-0.25],[0,PPT-0.25]],48),M.brass),'050408-2.el',1);}   /* the plug, the stone in its end */
        else{tag(mesh(ge,lathe([[0.95,eY+0.35],[1.103,eY+0.35],[1.103,PPT-0.25],[2.3,PPT-0.25],[2.3,PPT],[1.3,PPT],[1.3,eY+0.4],[0.95,eY+0.4]],48),M.gilt),'050408-2.el');
          tag(mesh(ge,lathe([[0,eY],[1.1,eY],[1.1,eY+0.35],[0.7,eY+0.4],[0,eY+0.42]],32),M.ruby),'050408-1.el');}
        if(f1)tag(mesh(ge,lathe([[0,eY],[0.8,eY],[0.8,eY+0.35],[0,eY+0.35]],32),M.ruby),'050408-1.el');}
      const f=flip(eel);for(const s of[-1,1]){const q=add([0,0],u,3.5*s);tag(screw(f,q[0],-q[1],-PPT,1.3,0.5,2.5,0.6,M.brass),'WN-ec');}}   /* the last state's; as first drawn they hold the cap, through it */

    /* ================= motion ================= */
    let lastTw=null;
    const update=(/** @type {any} */s)=>{const th=s.th||0;
      ew.rotation.y=(s.E||0)*TAU/15;
      for(const g of[balP,rol,hsRot])g.rotation.y=-th;
      detM.rotation.y=(s.lift||0);for(const g of R.golds)g.rotation.y=-(s.psDef||0);
      if(th!==lastTw){R.spring.geometry=ribbonGeo(spPath(-th),HB,HT,R.spring.geometry);lastTw=th;}};
    return{update,R};}
  return{build,ESC,W,B,P,FY,Y,HOLES,SET,toKin,adapt,MK,HSL,HSP,TP,DPIV:D(TP,0),DSPH:2-0.1,PIPE0:Y.ew1-TI+0.1};   /* PIPE0: the detent pipe's top under the top plate's inner face (as last revised); DSPH: the detent spring's height as dv draws it (2 wide less 0.05 at each edge), in both states: tools/dynamics.js */
})();
