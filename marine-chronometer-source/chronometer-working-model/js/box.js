// @ts-check
/* box.js: mounting box (glass lid hinged to the box, outer lid hinged to the glass lid), gimbal ring, case, winding key
   Part of 'The Marine Chronometer, working' (three.js r128). See README.md. */

/* ================= box, bowl, gimbals ================= */
/* the latch: its pivot against the right wall (LATCH_X from the case's axis, the wall's inner face 0.5 mm off the clamping screw's head) and LATCH_Z (30) toward the front: KLUwI2UUCMQ 0:28.7
   (4K, nearly top-down), the knurled head's centre 750 px right of the dial's centre and 320 px toward the front, at the head's own 11.2 px/mm (its 17 mm, 190 px; the bezel's
   105 mm gives 11.1), so about 67 and 29-31 mm, read as if the view were top-down; it is not: the bezel's ellipse there is 1168 by 738 px, so the forward
   offset is foreshortened by 0.632 and the head stands 46-49 mm forward (47 taken; 0:42.5, the head unprojected through the box's corners, gives 41-46, and the support bracket's two
   screws on the box's side stand 50-58 forward: rough, but the three agree). 30 until 5 October 2026. Bonhams' photograph of 2E11795 (another box) has it the same way, against a
   wall well away from the corner. It was in the front right corner, 9 in from both walls (a clearance fit), until 5 October 2026. The ring's slot and the case's keeper face the
   pivot (LATCH_A, LatheGeometry angle, from +z toward +x); the lever turns on its pin from LATCH_OFF (along the right wall toward the front) to LATCH_ON (toward the centre).
   LATCH_H: the clamping screw's knurled head, r 9.75 (19-20 across: Jones-Horan lot 63662_06, from above, at the box camera's scale, 20 October 2026, E:\mc-video\oq\ledger\box\REPORT.md; rough);
   r 8.5 until then, so LATCH_X 68.5; the video's 67 (above) agrees with 67.25 */
/* BOX_S: the box's size against the survey's (20 October 2026, REPORT.md), which scaled its photographs by a 197 width (a sale listing's 7 3/4 in; another's 7 1/2): since 26 October 2026
   172 (0.873 of it), the walls 7.5 thick round the same inside, 157 (KLUwI2UUCMQ 0:28.7 and photo-movement-2E12055.jpg, at the bezel's scale, below). Two photographs at the bezel's scale (its
   knurl 108.3 across, the box's top 6.7 mm under it): Jones-Horan 63662_04 (open, from above the front) the outside 1,835 px against the bezel's 1,178 along the row through the case's centre,
   171, and KLUwI2UUCMQ 0:28.7 (4K) 1,810 against 1,173, 169; the inside over the outside along a row of 63662_04, which needs no scale, 0.908-0.915 (the tops' brass edging at their inner
   edges, the walls' inner faces below them), so walls of 7.3-8.0 round the inside's 157 (likely +-1.5; the outside +-3). The listings' 190-197 likely take in the handles. Everything the survey
   read at the box's scale (the tiers, the pivots' height, corner caps, handles, hasps, nameplate, the latch bracket's screws) is scaled by BOX_S; what it read against the ring or the case
   (the key block's face, the lock nuts, the latch's head) is not. Until then 197 outside and walls 21 */
const BOX_S=172/197,BOX_W=86,BOX_T=7.5,LATCH_H=9.75,LATCH_X=BOX_W-BOX_T-LATCH_H-0.5,LATCH_Z=47,LATCH_A=Math.atan2(LATCH_X,LATCH_Z),LATCH_OFF=Math.PI*3/2,LATCH_ON=Math.atan2(LATCH_Z,-LATCH_X);
function buildBox(M){
  /* the heights (20 October 2026; REPORT.md above: a cuboid camera fitted to the box's edges on Jones-Horan 63662_17 (right side), 63662_19 (left), 38240_21 (right) and 38240_05 (front),
     0.75-1.6 px rms, scaled by the box's 197 width): closed 196.4 +-1.5 (0.994-0.999 of the width), the base 105.1 +-0.6, the glass lid's tier 71.4 +-0.8, the outer lid 19.8 +-0.8 (sure).
     H0, HG, HL those times BOX_S (above): 91.8, 62.3, 17.3 since 26 October 2026 (105, 71, 20 until then). The bottom stays at yF -100 (the floor's shadow, app.js), so the base's top, the lower
     seam, is YL -8.2. Until 20 October 2026 100 + 38 + 38 (176, estimated) */
  const root=hn(new THREE.Group(),'42201');root.userData.partName='box';const W=BOX_W,T=BOX_T,yF=-100,H0=105.1*BOX_S,HG=71.4*BOX_S,HL=19.8*BOX_S,YL=yF+H0;   /* T: the walls 7.5 thick (21 until 26 October 2026: BOX_S above), so the inside is 157 across: KLUwI2UUCMQ 0:28.7, the right wall's inner face 77 mm from the case's axis at the bezel's scale (the latch head against it), and photo-movement-2E12055.jpg about 155 (SHAPE-PASS 106-3); the outside, 197 until 26 October 2026, the sale listings' 190-197. T 10 (estimated) until 5 October 2026 */
  /* RY: the gimbal ring's pivots, 92.7 and 93.1 over the box's bottom on Jones-Horan 63662_17 and _19 (90.3 on 38240_21; likely +-1.5): 92.9, so -7.1 (12.1 under the base's top).
     -20 (80 over the bottom, raised only to clear the box's floor, eae5358) until 20 October 2026. The case's lowest point (the shield plate's screw, 46 under the pivots) stands 25 over the felt */
  const RY=yF+92.9*BOX_S;   /* 81.1 over the bottom at the box's 172 (BOX_S), 10.7 under the base's top */
  const wood=(w,h,d,x,y,z,p=root,m=M.wood)=>mesh(p,new THREE.BoxGeometry(w,h,d),m,x,y,z);
  wood(2*W,T,2*W,0,yF+T/2,0);
  wood(2*W,H0,T,0,yF+H0/2,W-T/2);wood(2*W,H0,T,0,yF+H0/2,-W+T/2);
  wood(T,H0,2*W-2*T,W-T/2,yF+H0/2,0);wood(T,H0,2*W-2*T,-W+T/2,yF+H0/2,0);
  wood(2*W-2*T,1,2*W-2*T,0,yF+T+0.5,0,root,M.felt);
  /* a plate on a face of the box: an outline [u, v] (u across, v up) extruded th out of the face along +z (rotate it for another face) */
  const facePlate=(pts,th,holes=[])=>{const g=polyGeo(pts,th,holes);g.rotateX(-Math.PI/2);g.translate(0,0,th);return g;};
  /* brass corner caps (20 October 2026; REPORT.md: Jones-Horan 63662_17, 38240_05, 38240_21): about 10 tall, legs 26.5 along each face, one to each vertical edge on each tier at Y 184-195
     (the outer lid's, up to its top, a plate over the top's corner), 132-142 (the glass lid's), 63-74 and 2-11 (the base's) over the bottom; likely +-1.5. Legs 1.2 thick (estimated); the top's plates a
     quarter disc r 26.5 round the corner (the photographs' rounded inner edge; its radius estimated). Until then two caps 0.2 of the base tall, legs 12, on the base only and full-height strips on the lids */
  const CL=26.5*BOX_S,CT=1.2,brassCorner=(p,x,y,z,h,cz=0)=>{const sx=Math.sign(x),sz=Math.sign(z-cz);return fuse([mesh(p,new THREE.BoxGeometry(CL,h,CT),M.brass,x+sx*(CT-CL/2),y,z+sz*CT/2),mesh(p,new THREE.BoxGeometry(CT,h,CL-CT),M.brass,x+sx*CT/2,y,z-sz*(CL-CT)/2)]);};   /* one cap, one mesh (fuse, core.js): its legs' faces ran flush, a line down its corner in Edges until 21 October 2026 */
  for(const sx of[1,-1])for(const sz of[1,-1]){brassCorner(root,sx*W,yF+68.5*BOX_S,sz*W,10*BOX_S);brassCorner(root,sx*W,yF+6.5*BOX_S,sz*W,10*BOX_S);}   /* the survey's sizes at the box's scale (BOX_S) */
  /* the side handles (20 October 2026; REPORT.md): Jones-Horan 38240_21's round rosettes 29.2 across, 68.5 apart (63662_17's are ovals 22.5 x 30, 82-83 apart: another pattern), their centres
     8-10 under the pivot (9 taken), the bail's lowest point 39-43 under it (41: 32 under the rosettes); its form a swan neck as 63662_17 shows it, each leg dropping from its knuckle on the
     rosette nearly straight, rounding into a flat grip (the path's points traced by eye on that photograph at its rosettes' scale: estimated within +-2), on a knuckle r 3.2 standing 5 off the rosette.
     The bail's section r 2.4 and the rosettes' thickness estimated. Until then (KLUwI2UUCMQ 0:45, +-10 %) rosettes r 15, 61 apart, at the pivot's height, the bail a half circle */
  const V2=(a,b)=>new THREE.Vector2(a,b),RZ=34.25*BOX_S,RR=14.6*BOX_S,HY=RY-9*BOX_S;   /* at the box's scale (BOX_S) */   /* HY: the rosettes' centres; the bail's drop under them, 32 (its path's last point), scaled with it */
  for(const sx of[1,-1]){for(const sz of[1,-1]){const ro=mesh(root,cylY(RR,1.6,40),M.brass,sx*(W+0.8),HY,sz*RZ);ro.rotation.z=Math.PI/2;const ey=mesh(root,cylY(3.2,5,20),M.brass,sx*(W+1.6+2.5),HY,sz*RZ);ey.rotation.z=Math.PI/2;}
    const q=[[0,0],[-1.5,-5],[-3.5,-12],[-5.5,-20],[-8,-26.5],[-12.5,-30.6],[-19,-32]].map(([z,y])=>[z*BOX_S,y*BOX_S]),P=[...q.map(([z,y])=>new THREE.Vector3(0,y,RZ+z)),...q.slice().reverse().map(([z,y])=>new THREE.Vector3(0,y,-RZ-z))];
    mesh(root,closeGeo(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P,false,'centripetal'),96,2.4,12,false)),M.brass,sx*(W+5.5),HY,0);}
  /* the winding key's corner block at the back right (Fig. 1, 106; 20 October 2026, REPORT.md, Jones-Horan 63662_06 from above, KLUwI2UUCMQ 0:38.5-0:47.5): a concave quarter block, its face
     about concentric with the ring, r 70.5 +-3 from the case's axis, its legs 36-40 along each wall (38), its top near the base's top (1.5 under it, estimated) (the form likely); the key's socket a hole
     7.1 across at (54, -56.5) +-3 (rough; back right is +x, -z, as the photograph shows it beside the hinge and the latch's opposite corner; KLUwI2UUCMQ 0:44 the same, on the block's top about
     three quarters of the way from the corner to its face). The key goes in pipe first (0:46.5): its pipe (Ø 6, 39 long, core.js) in the hole, its neck ring (Ø 8.2) on the block's top, so the hole
     is 41 deep (estimated: as deep as the pipe and a little); its paddle across the corner, square to the line from the case's axis, clear of both walls. Until 26 October 2026 the hole 25 deep and the
     key, 46.6 long, standing in it on its cone. Until 20 October 2026 a square block 24 x 24 x 36 low enough for the 38 mm glass lid, the key's foot on a brass socket at (65.5, -65.5) */
  const KR=70.5,KI=W-T,KC=KI-38,KS=Math.sqrt(KR*KR-KC*KC),KT=YL-1.5,KHD=41,KP=[54,-57],kpts=[[KC,-KI],[KI,-KI],[KI,-KC]];
  {const a1=Math.atan2(-KC,KS),a2=Math.atan2(-KS,KC);for(let i=0;i<=32;i++){const a=a1+(a2-a1)*i/32;kpts.push([KR*Math.cos(a),KR*Math.sin(a)]);}}
  const ky0=yF+T+1;fuse([mesh(root,polyGeo(kpts,KT-KHD-ky0),M.woodEdge,0,ky0,0),mesh(root,polyGeo(kpts,KHD,[[KP[0],KP[1],3.55]]),M.woodEdge,0,KT-KHD,0)]);   /* one block, one mesh (fuse) */   /* stands on the felt; the socket's hole through the upper part */
  const KB=KT-39;   /* the key's foot: its neck ring (39 over the pipe's end, core.js) on the block's top */
  const key=hn(new THREE.Group(),'42044');key.userData.partName='key';key.position.set(KP[0],KB,KP[1]);root.add(key);key.rotation.y=Math.atan2(-KP[0],-KP[1]);   /* the paddle's width square to the radius */
  windingKey(key,M);   /* the key itself (core.js), the same one the movement shows on the fusee's square and the hands' */
    /* slotted screw along an axis: 'x' or 'z', outward sign s, head from r0 to r0+h, and its shank (half the head's radius) sh mm back into the part under it */
  const sHead=(p0,ax,s,r0,rad,h,y,t,sh=2.5)=>{const p=new THREE.Group();p0.add(p);p.userData.sc={r:rad,h,len:sh,rs:rad*0.5};const X=ax==='x',m=mesh(p,cylY(rad,h,20),M.brass2,0,y,0),sl=mesh(p,X?new THREE.BoxGeometry(0.6,rad*2.02,rad*0.35):new THREE.BoxGeometry(rad*0.35,rad*2.02,0.6),M.steelD,0,y,0),k=mesh(p,cylY(rad*0.5,sh,12),M.brass2,0,y,0);
    if(X){for(const q of[m,k])q.rotation.z=Math.PI/2;m.position.x=s*(r0+h/2);k.position.x=s*(r0-sh/2);sl.position.x=s*(r0+h-0.25);m.position.z=sl.position.z=k.position.z=t||0;}
    else{for(const q of[m,k])q.rotation.x=Math.PI/2;m.position.z=s*(r0+h/2);k.position.z=s*(r0-sh/2);sl.position.z=s*(r0+h-0.25);m.position.x=sl.position.x=k.position.x=t||0;}return p;};   /* one group: the screw's parts-list line goes on it */
  /* a slotted screw head along x, slightly domed (outward sign s, its seat at x0 from the box's centre, at y, z): turned (a lathe run to its axis), its side h tall, the dome rising dm over it to the
     middle, the slot a band 1.2 wide following the dome 0.6 deep; its shank rs, sh back into the part under it (the group's children: head, slot, shank, as sHead's) */
  const dHead=(p0,s,x0,rad,h,dm,y,z,sh,rs)=>{const g=new THREE.Group();p0.add(g);g.position.set(s*x0,y,z);g.rotation.z=-s*Math.PI/2;g.userData.sc={r:rad,h:h+dm,len:sh,rs};
    const R=(rad*rad+dm*dm)/(2*dm),c=h+dm-R,top=u=>c+Math.sqrt(R*R-u*u),pr=[V2(0,0),V2(rad,0)];for(let i=0;i<=12;i++){const u=rad*(1-i/12);pr.push(V2(u,top(u)));}
    mesh(g,new THREE.LatheGeometry(pr,32),M.brass2);const sp=[];for(let i=0;i<=16;i++){const u=-rad+2*rad*i/16;sp.push([u,top(u)+0.05]);}for(let i=16;i>=0;i--){const u=-rad+2*rad*i/16;sp.push([u,top(u)-0.6]);}
    const sg=facePlate(sp,1.2);sg.translate(0,0,-0.6);mesh(g,sg,M.steelD);mesh(g,cylY(rs,sh,12),M.brass2,0,-sh/2,0);return g;};
  /* a cup washer along x under such a head: a flat ring ro over ri, its inside dished to a seat (sd over the face it lies on) inside a rim rising to rh at r rr, the head's radius and a little */
  const cupW=(p0,s,x0,ro,ri,sd,rr,rh,y,z)=>{const m=mesh(p0,closeGeo(new THREE.LatheGeometry([V2(ri,0),V2(ro,0),V2(ro,0.4),V2(rr+0.5,rh),V2(rr,rh),V2(rr,sd),V2(ri,sd),V2(ri,0)],48)),M.brass2,s*x0,y,z);m.rotation.z=-s*Math.PI/2;return m;};
  /* knurled lock nut: a body with 30 ridges, merged into one mesh */
  const knurl=(p,ax,s,r0,rad,h,bore)=>{const gs=[[bore?ringGeo(rad,bore,h):cylY(rad,h,48),new THREE.Matrix4()]];   /* bore: a nut's thread */for(let k=0;k<30;k++){const a=k/30*TAU;gs.push([new THREE.BoxGeometry(0.5,h,0.5),new THREE.Matrix4().makeTranslation(rad*Math.cos(a),0,rad*Math.sin(a))]);}
    const m=mesh(p,mergeGeo(gs),M.brass2,0,0,0);if(ax==='x'){m.rotation.z=Math.PI/2;m.position.x=s*(r0+h/2);}else{m.rotation.x=Math.PI/2;m.position.z=s*(r0+h/2);}return m;};
  /* gimbal ring: a flat brass band (Fig. 106), pivoted at 3 and 9 on two screws that come in through the box sides, each with a washer and lock nut.
     Slotted support straps on the ring carry the bushings for the gimbal pivot at 3 and the front case pivot at 6 (Fig. 94) */
  /* the case's sizes, from the movement it holds (movement.js): a recess round its top edge (DB) takes the mounting ring's flange, which sits on the shoulder at its foot (SH, outside the dial screws' heads under the flange); the
     dial lies in it, as it does when the movement is put upside down on the case to be started (Sec. III: "the dial carefully located in the shoulder recess around the top edge
     of the case"), and the bezel screws on outside the rim (TR). The rim's 105 across and the gimbal ring's 66-68 radius are from the top-view photographs (estimated); the
     rest estimated. YT the rim's top, YTB the thread's foot; FD the floor's inside depth, FR the floor's edge (the bowl's inside rounds into it with radius SH-FR) */
  /* the case's height on the movement (26 October 2026): the dial's face level with where the bezel starts to taper, outside (its cove, 6.97 over its foot on LPEC109-4, below) and
     inside (its sight cone, from the dial's edge to the glass: KLUwI2UUCMQ 0:28.7, the bright cone round the dial, the glass at the bezel's top; the owner's reading, 26 October 2026), so the
     thread's foot YTB 6.97 under the dial's face; the rim's top YT flush with the dial's face, as Sec. III seats the dial in the recess round the case's top edge, the thread (YTT)
     5.5 over its foot and the rim plain above it. Everything on the case is measured from the thread or the bezel (the 49 to the bottom, the pivots, the lip), so it moved with them: the
     movement stands 5.03 higher in the case than drawn until then (YTB 5.2: the rim 3.5 over the dial, the bezel's cove 5 over it and its glass on a bore 10 deep) */
  const DB=MR_RO+0.05,SH=DB-0.9,CR=DB+1.5,YTB=MR_Y+DIAL_T-6.97,YTT=YTB+5.5,YT=MR_Y+DIAL_T,FD=48-YTB,FR=38,CW0=CR*0.962,YLIP=YTB-3.06;   /* CW0, YLIP: the wall's radius and the lip's foot, 3.06 under the thread (the profile below, YB); FD: the bottom (1 thick, BT) 49 under the thread's foot */
  /* the bezel screws onto the case's rim (26 October 2026, the Wempe's way: wempe/js/case.js, TH): a thread outside the rim from the lip (YTB) up 5.5 to its top (YT), five grooves on
     KLUwI2UUCMQ 47:22.5 (the case upside down, the bezel off: 5.3-5.7 tall at the tab's 22.0 px/mm) and Jones-Horan 63662_07 (five grooves), so a pitch of 1.1 (a 24 tpi's 1.058
     inside it; likely), the 60 deg basic form 0.595 deep; right-hand (estimated). Its radii fit between the movement's ring's recess (DB, r 48.0) and the bezel's skirt (r 49.45 on
     LPEC109-4, below): the rim's roots r 48.35 (0.35 of wall over the recess), crests 48.95; the bezel's inside thread 0.03 clear of it radially, on one helix (yr). The rim's top
     YT 7.74 (just over the dial, estimated) and the thread 2.54 tall, its radius TR 52.5 (the top-view photographs' 105 across), until then */
  const TH={p:1.1,d:0.595,R:48.35,c:0.03,yr:YTB};
  /* the thread's machinery, as the Wempe's (wempe/js/case.js: iso, rowsY, thread, lathT, smoothRev): the ISO basic profile along the pitch, the heights a sixteenth of it apart */
  const iso=u=>{const a=Math.abs(u-Math.round(u));return a<0.125?0:a>0.4375?1:(a-0.125)/0.3125;};
  const rowsY=(y0,y1,yr,p)=>{const dy=p/16,lo=Math.min(y0,y1),hi=Math.max(y0,y1),o=[];for(let k=Math.floor((lo-yr)/dy)+1;yr+k*dy<hi-1e-6;k++)if(yr+k*dy>lo+1e-6)o.push(yr+k*dy);return y1<y0?o.reverse():o;};
  /* turned faces shaded smooth round the axis, the flanks sharp */
  const smoothRev=g=>{const P=g.attributes.position,Nm=g.attributes.normal;for(let t=0;t<P.count;t+=3){const cx=(P.getX(t)+P.getX(t+1)+P.getX(t+2))/3,cz=(P.getZ(t)+P.getZ(t+1)+P.getZ(t+2))/3,cr=Math.hypot(cx,cz);if(cr<1e-6)continue;
    const nx=Nm.getX(t),ny=Nm.getY(t),nz=Nm.getZ(t),h=Math.hypot(nx,nz);if(h<0.05||Math.abs(nx*cz-nz*cx)/(h*cr)>0.05)continue;const sg=Math.sign(nx*cx+nz*cz);
    for(let k=t;k<t+3;k++){const x=P.getX(k),z=P.getZ(k),r=Math.hypot(x,z)||1;Nm.setXYZ(k,sg*h*x/r,ny,sg*h*z/r);}}Nm.needsUpdate=true;return g;};
  /* a thread chased on a turned face: a band from y0 to y1 between a plain face at rp and the threaded face r(t, y) = R + d s(y) (iso(u) - (inside ? 1 : 0)), u = (y - yr)/p + t/TAU,
     R the outside thread's root or the inside one's; s(y) runs out over e0, e1 at the ends; slot: a slot's half-width cut through it at angle a. One closed solid */
  const thread=({R,rp,d,p,yr,y0,y1,e0=0.5,e1=0.5,inside=false,slot=0,a=0})=>{const NT=360,Y=[y0,...rowsY(y0,y1,yr,p),y1],NY=Y.length-1,q=inside?1:0,P=[],out=inside?-1:1;
    const s=y=>Math.min(1,e0?(y-y0)/e0:1,e1?(y1-y)/e1:1),rf=(t,y)=>R+d*Math.max(0,s(y))*(iso((y-yr)/p+t/TAU)-q);   /* e0, e1 0: no runout there (a band that a band on the same helix carries on) */
    const ang=(r,i)=>slot?a+slot/r+(TAU-2*slot/r)*i/NT:i/NT*TAU,ni=slot?NT+1:NT,ix=i=>i%ni;
    const T=[],Q=[];for(let i=0;i<ni;i++){const tt=ang(R,i),tp=ang(rp,i),A=[],B=[];for(const y of Y){const r=rf(tt,y);A.push([r*Math.cos(tt),y,r*Math.sin(tt)]);B.push([rp*Math.cos(tp),y,rp*Math.sin(tp)]);}T.push(A);Q.push(B);}
    const tr=(a,b,c,n)=>{const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],x=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];P.push(...(x[0]*n[0]+x[1]*n[1]+x[2]*n[2]<0?[a,c,b]:[a,b,c]));};
    const quad=(a,b,c,e,n)=>{tr(a,b,c,n);tr(a,c,e,n);},rad=(pt,k)=>{const r=Math.hypot(pt[0],pt[2]);return[k*pt[0]/r,0,k*pt[2]/r];};
    for(let i=0;i<NT;i++){const i1=ix(i+1);
      for(let j=0;j<NY;j++){quad(T[i][j],T[i1][j],T[i1][j+1],T[i][j+1],rad(T[i][j],out));quad(Q[i][j],Q[i1][j],Q[i1][j+1],Q[i][j+1],rad(Q[i][j],-out));}
      quad(T[i][NY],T[i1][NY],Q[i1][NY],Q[i][NY],[0,1,0]);quad(T[i][0],T[i1][0],Q[i1][0],Q[i][0],[0,-1,0]);}
    if(slot)for(const[i,k]of[[0,-1],[NT,1]]){const t=ang(R,i),n=[-k*Math.sin(t),0,k*Math.cos(t)];for(let j=0;j<NY;j++)quad(T[i][j],Q[i][j],Q[i][j+1],T[i][j+1],n);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P.flat(),3));g.computeVertexNormals();return smoothRev(g);};
  /* a turned part with a thread on one edge of its closed profile pr ([r, y]): the edge pr[k] to pr[k+1] threaded as thread() threads a band (th: R, d, p, yr, k, inside) */
  const lathT=(pr,th)=>{const NT=360,{R,d,p,yr,k,inside=false,e0=0.5,e1=0.5}=th,q=inside?1:0,s0=Math.min(pr[k][1],pr[(k+1)%pr.length][1]),s1=Math.max(pr[k][1],pr[(k+1)%pr.length][1]);
    const s=y=>Math.min(1,(y-s0)/e0,(s1-y)/e1),rf=(t,y)=>R+d*Math.max(0,s(y))*(iso((y-yr)/p+t/TAU)-q);
    const n=pr.length,k1=(k+1)%n,rg=[];for(let i=0;i<n;i++){const[r,y]=pr[i],on=i===k||i===k1;rg.push({y,r:on?t=>rf(t,y):()=>r});if(i===k)for(const yy of rowsY(y,pr[k1][1],yr,p))rg.push({y:yy,r:t=>rf(t,yy)});}
    const ar=pr.reduce((a,c,i)=>{const e=pr[(i+1)%n];return a+c[0]*e[1]-e[0]*c[1];},0)>0?1:-1,P=[];
    const tr=(a,b,c,nn)=>{const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],x=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];if(Math.hypot(...x)<1e-12)return;P.push(...(x[0]*nn[0]+x[1]*nn[1]+x[2]*nn[2]<0?[a,c,b]:[a,b,c]));};
    const V=rg.map(g=>[...Array(NT).keys()].map(i=>{const t=i/NT*TAU,r=g.r(t);return[r*Math.cos(t),g.y,r*Math.sin(t)];}));
    for(let a=0;a<V.length;a++){const b=(a+1)%V.length,dy=rg[b].y-rg[a].y;
      for(let i=0;i<NT;i++){const i1=(i+1)%NT,t=(i+0.5)/NT*TAU,dr=rg[b].r(t)-rg[a].r(t),nr=ar*dy,ny=-ar*dr,nn=[nr*Math.cos(t),ny,nr*Math.sin(t)];tr(V[a][i],V[a][i1],V[b][i1],nn);tr(V[a][i],V[b][i1],V[b][i],nn);}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P.flat(),3));g.computeVertexNormals();return smoothRev(g);};   /* FD: the case 49 mm from the bezel's edge (YTB) to its outside bottom on Renaissance Antiques' photograph (LPEC109-4, the band's 712 px as CR's 99 mm: the base to the bezel 352 px), the floor 1 thick (BT); the movement's lowest part, the balance cock, at -37.96, so the floor clears it by 4.8. 64, set for clearance, until 5 October 2026 */
  /* NUT_R: the four pivots' knurled lock nuts (42121), r 12.5: 24.9, 25.2 and about 25 across on Jones-Horan lots 63662 and 38240 from above (ellipses fitted on their rims, at the
     box camera's scale), one at least 22.0 where it is half hidden (20 October 2026, REPORT.md; likely +-1.5); TN24H's 26 (3SFDplGq6vs 4:21) agrees. Fig. 106 draws all four as large discs and
     Sec. III calls the case rear one "the large, knurled lock nut". r 8.5 (KLUwI2UUCMQ 1:15: at least 16 across) until 20 October 2026, r 4.2 and 5 until 4 October. Their thickness (2.5) estimated */
  const RI=CR+16.5,RO=RI+2,NUT_R=12.5;
  /* the latch keeper on the case (below), its top at the thread's foot (YTB), just under the bezel's lower edge (KLUwI2UUCMQ 1:22.5: the case in the ring, the bezel on; 1:21.5-1:24.5), 1.3 lower
     in the case than drawn until 25 October 2026 (its top 6.5, by the bezel's knurl); so its window's middle stands LSC from the pivots, where the lever latches (LY) and the ring's slot (SLY) is cut.
     The lever's height and the slot were estimated at the pivots' height (+0.6) until then, the band's height (14) still estimated */
  const KPY=YTB-6.5,LSC=0.6+KPY-4.0,SLH=1.5;
  const ring=hn(new THREE.Group(),'42106');ring.userData.partName='ring';ring.position.y=RY;root.add(ring);
  /* the band, with a slot at the front right (Fig. 106) that the latch lever passes through to the case: the band round the rest of the ring, the band above and
     below the slot, and the slot's two side walls */
  /* the slot spans the angles at which the lever, swinging from released to latched, crosses the band (Fig. 106 draws it a long horizontal slot), 2 deg spare each end */
  const SLOT=(()=>{const len=Math.hypot(LATCH_X,LATCH_Z)-(CR+0.3);let a0=LATCH_A,a1=LATCH_A;for(let k=0;k<=200;k++){const th=LATCH_ON+(LATCH_OFF-LATCH_ON)*k/200,dx=Math.cos(th),dz=-Math.sin(th);
      for(let t=0;t<=len;t+=0.25){const x=LATCH_X+t*dx,z=LATCH_Z+t*dz,r=Math.hypot(x,z);if(r>=RI-1.6&&r<=RO+1.6){const f=Math.atan2(x,z);a0=Math.min(a0,f);a1=Math.max(a1,f);}}}return[a0-2*D2R,a1+2*D2R];})();
  { const S0=SLOT[0],S1=SLOT[1],pr=(a,b)=>[V2(RI,a),V2(RO,a),V2(RO,b),V2(RI,b),V2(RI,a)],rgM=[mesh(ring,closeGeo(new THREE.LatheGeometry(pr(-7,7),158,S1,TAU-(S1-S0))),M.brass)];
    for(const[a,b]of[[-7,LSC-SLH],[LSC+SLH,7]])rgM.push(mesh(ring,closeGeo(new THREE.LatheGeometry(pr(a,b),Math.max(2,Math.ceil((S1-S0)/0.02)),S0,S1-S0)),M.brass));
    for(const f of[S0,S1]){const w=mesh(ring,new THREE.BoxGeometry(RO-RI,2*SLH,0.02),M.brass,(RI+RO)/2*Math.sin(f),LSC,(RI+RO)/2*Math.cos(f));w.rotation.y=f-Math.PI/2;}fuse(rgM); }   /* the ring one mesh (fuse): its band either side of the slot drew lines at the slot's ends in Edges until 21 October 2026 */
  /* the straps on the ring (Fig. 106): curved pieces of band on its outside, each held by two screws into the band (a turned band can't be holed across: drawn inside it) */
  /* SL, SS: each strap's length and its screws' spacing (20 October 2026, REPORT.md, Jones-Horan lots 63662 and 38240 from above at the box camera's scale, likely): the gimbal strap at 3,
     44.5 +-2 long, its screws 30.2 +-1.5 apart (45, 31); the case strap at 6, 53 +-2, its screws about 36.5 +-3 (52, 35; the earlier photograph's 32.6 for its screws lies inside both). Until then both 50, screws 32.6 apart */
  const SL={x:45,z:52},SS={x:31,z:35};
  const strap=(ax,s)=>{const f=ax==='x'?s*Math.PI/2:(s>0?0:Math.PI),w=SL[ax]/2/RO,pr=[V2(RO,-8),V2(RO+1.2,-8),V2(RO+1.2,8),V2(RO,8),V2(RO,-8)];
    hn(mesh(ring,closeGeo(new THREE.LatheGeometry(pr,24,f-w,2*w)),M.brass2),ax==='x'?'42107':'42108');
    for(const t of[-SS[ax]/2,SS[ax]/2]){const g=new THREE.Group();g.rotation.y=t/RO;ring.add(g);hn(sHead(g,ax,s,RO+1.2,ax==='x'?3.3:3.75,ax==='x'?2.0:4.8,-4,0),ax==='x'?'42116.gs':'42116.cs');}};   /* each screw square to the band, where it lies: cheese heads
     7.3-7.7 across, standing 4.8 out, 16.3 either side of the pivot, the strap about 50 long (the top-view photograph of 2E11795, at the ring's 15.65 px/mm: the case strap's; the gimbal
     strap's screws about 30 apart there, its sizes not read; drawn as the case strap's); the video's unit (N5892) gives 7.5-8.8 across and 11-13 apart (0:36.33, 0:47.5, rough); the photograph's
     straps are straight bars, drawn as pieces of band. Heads r 1.3, 0.7 tall, 7.5 either side, the strap 22 long, until 5 October 2026. The gimbal strap's (at 3) measured on TN24H's box from straight above (3SFDplGq6vs 4:21, 1080 px: scaled by the box's
     outside, 678 px for its 190-197 mm, 3.44-3.57 px/mm at its rim, and about 4 % for the strap's depth): heads 22.5 px across (r 3.2-3.4), standing 6.5 px off the strap
     (1.9 +-0.6), 115 px apart (32-35, the model's 32.6 kept), the strap 176 px long (49-51); drawn r 3.3 and 2.0 out (r 3.75 and 4.8, the case strap's, until 5 October 2026);
     about +-10 % with the box's size */
  /* a boss on the ring or a strap, bored for its pivot bushing (42214) or its pivot screw's thread */
  const boss=(ax,s,r0,r1,rad,bore)=>{const m=mesh(ring,ringGeo(rad,bore,r1-r0),M.brass2,0,0,0);if(ax==='x'){m.rotation.z=Math.PI/2;m.position.x=s*(r0+r1)/2;}else{m.rotation.x=Math.PI/2;m.position.z=s*(r0+r1)/2;}return m;};
  const bush=(ax,s,r0,r1,id)=>{const m=hn(mesh(ring,ringGeo(3.5,2.25,r1-r0),M.steel,0,0,0),id);if(ax==='x'){m.rotation.z=Math.PI/2;m.position.x=s*(r0+r1)/2;}else{m.rotation.x=Math.PI/2;m.position.z=s*(r0+r1)/2;}};
  strap('x',1);hn(boss('x',1,RO+1.2,RO+3.2,4.5,3.5),'42107',{sub:1});bush('x',1,RO+1.2,RO+3.2,'42214.s');boss('x',-1,RO,RO+2.4,4.5,3.5);bush('x',-1,RO,RO+2.4,'42214.r');   /* the gimbal pivots' bushings: in the support strap at 3, in the ring at 9. Inferred: the parts list gives these and the case brackets' one number, 42214, so they are drawn as the case brackets' (below: 7.0 across, bored 4.5; KLUwI2UUCMQ 52:27.5), none of them seen on the ring; their bosses r 4.5 bored 3.5 to hold them (estimated). r 1.4 bored 0.82 in bosses r 3.2 until 25 October 2026 */
  const gp=new THREE.Group();gp.userData.partName='ring';hn(gp,'42106',{sub:1});gp.position.y=RY;root.add(gp);
  /* each gimbal ring pivot screw (Fig. 106): in through the box side, a washer under its head outside (its thickness sets the ring's freedom, Op. 104) and the lock nut
     inside against the wall; its point runs in the bushing, its shoulder just clear of it. Inferred: shank and point r 2.2, as the case pivot screws' for the same bushing (42214, below); r 1.6 and a point r 0.8 until 25 October 2026 */
  for(const sx of[1,-1]){const r0=sx>0?RO+3.2:RO+2.4,sh=hn(mesh(gp,cylY(2.22,W+0.8-(r0+0.05),32),M.steel,sx*(r0+0.05+W+0.8)/2,0,0),'42120',{sub:1});sh.rotation.z=Math.PI/2;
    const pt=hn(mesh(gp,cylY(2.22,1.85,32),M.steel,sx*(r0+0.05-0.925),0,0),'42120',{sub:1});pt.rotation.z=Math.PI/2;
    hn(cupW(gp,sx,W,9.1,2.25,0.8,6.35,2.0,0,0),'42122');const g=new THREE.Group();gp.add(g);hn(knurl(g,'x',-sx,-(W-T),NUT_R,2.5,2.25),'42121.g');hn(dHead(gp,sx,W+0.8,6.2,3.6,1.2,0,0,0.05,2.2),'42120');}   /* the washer's and nut's bores 2.25 to the shank (1.62 until 25 October 2026) */
  /* the heads 12.4 across, slotted and slightly domed, each in a cup washer 18.0-18.3 across (20 October 2026, REPORT.md: Jones-Horan 63662_17 and _19 square-on, 38240_21, at the box camera's
     scale; the head likely +-1, the washer's diameter sure); the head's side 3.6 and its dome 1.2 (the frames' 5-6 tall in all), the cup's depth and rim estimated. Until then flat heads r 8.5 x 5.5
     on flat washers r 9.25 (KLUwI2UUCMQ 0:75.24, 0:47.5: 16-19 across with the washer, rough); r 3.6 and 2.2 tall, washers r 5.5, until 5 October 2026 */
  /* gimbal latch at the front right (Figs. 1, 8, 106): the support bracket in the corner of the box, held by two screws from outside with washers; the lever turns on the
     knurled clamping screw, which goes down through the clamping bracket and the lever into the support bracket, so tightening it clamps the lever; the take-up spring,
     screwed to the support bracket, presses up on a collar under the lever to take up its play. Released, the lever lies along the right wall; latched, it swings in 45°
     through the slot in the ring to the keeper on the case, locking both. Knurled handle on the lever. Sizes estimated */
  const lat=new THREE.Group();lat.userData.partName='latch';root.add(lat);const LP=LATCH_X,LZ=LATCH_Z,LY=RY+LSC,BY=LY-2.8;   /* LP: the lever's pivot 10.25 in from the right wall, a clearance fit (the clamping head, r 9.75, clears it by 0.5 mm; the video's 67 agrees: README "Estimated"); LY: the lever's middle, at the keeper's window (LSC, below); the support bracket's top at BY+1.5 */
  const vScrew=(p,x,z,y,r,h,len,id)=>{const g=hn(new THREE.Group(),id);p.add(g);g.userData.sc={r,h,len,rs:r*0.5};mesh(g,cylY(r,h,20),M.brass2,x,y+h/2,z);mesh(g,new THREE.BoxGeometry(r*2.02,0.3,r*0.35),M.steelD,x,y+h-0.1,z);mesh(g,cylY(r*0.5,len,12),M.brass2,x,y-len/2,z);g.userData.axis=g.children[2];return g;};   /* a screw put in from above: head from y up, shank len down */
  /* the support bracket an L as Fig. 106 draws it (item 16): a plate under the head, its leg down the right wall, held by its two screws from outside. The screws (20 October 2026, REPORT.md:
     Jones-Horan 63662_17 and 38240_21 square-on, at the box camera's scale; likely) one above the other, 34.2-34.7 from the front corner (34.5: z 64), 11-12 and 31-34 under the pivot (11.5,
     32.5), in cup washers 9.9-10.0 across; their heads about 0.75 of the cups' width on 63662_17 (r 3.7, rough), slotted, domed. The plate 14 wide from the head to the wall and on to
     the leg; the leg 12 wide, 3 thick, down to 6 under the lower screw: estimated. Until then a plate 12.5 x 14, its screws side by side 2.2 under the pivot, heads r 1.1 */
  { const bt=BY+1.5,SZ=W-34.5*BOX_S,SY=[RY-11.5*BOX_S,RY-32.5*BOX_S],LB=SY[1]-6,bp=[[LP-3.5,LZ-7],[W-T,LZ-7],[W-T,SZ+6],[LP-3.5,SZ+6]];
    fuse([hn(mesh(lat,polyGeo(bp,3,[hT(LP,LZ,1.8),hT(LP+4.2,LZ,0.5),hT(LP+5.6,LZ,0.5)]),M.brass2,0,BY-1.5,0),'42109'),   /* tapped for the clamping screw and the take-up spring's screws */
    hn(mesh(lat,new THREE.BoxGeometry(3,BY-1.5-LB,12),M.brass2,W-T-1.5,(BY-1.5+LB)/2,SZ),'42109',{sub:1})]);   /* the leg against the wall; the L one mesh (fuse) */
    for(const y of SY){hn(dHead(lat,1,W+0.6,3.7,2.2,0.8,y,SZ,T+3.0,1.5),'42115');hn(cupW(lat,1,W,5,1.52,0.6,3.85,1.5,y,SZ),'42123');}   /* through the box wall (drawn without a hole) 2.4 into the leg */
    hn(mesh(lat,polyGeo(stadiumPts([LP+1.6,LZ],[LP+6.3,LZ],1.2),0.3,[hC(LP+4.2,LZ,0.5),hC(LP+5.6,LZ,0.5)]),M.blued,0,bt,0),'42277');   /* the take-up spring, its free end under the lever's collar */
    for(const x of[LP+4.2,LP+5.6])vScrew(lat,x,LZ,bt+0.3,0.5,0.35,0.3+1.5,'42276');
    const ct=LY+0.7+0.6;hn(mesh(lat,polyGeo([[LP-2.2,LZ-2.2],[LP+2.2,LZ-2.2],[LP+3.2,LZ+2.2],[LP+2.2,LZ+3.2],[LP-2.2,LZ+2.2]],0.6,[hC(LP,LZ,1.8)]),M.brass2,0,ct,0),'42110');   /* the clamping bracket on the lever's boss */
    hn(cylBetween(lat,0.6,bt,ct,M.brass2,LP+2.5,LZ+2.5),'42110',{sub:1});   /* its leg down to the support bracket, which keeps it from turning */
    const HP=5.5,cs=hn(new THREE.Group(),'42114');lat.add(cs);cs.userData.sc={r:LATCH_H,h:5,len:ct+0.6+HP-(bt-2.5),rs:0.9};   /* HP: the knurled head stands on a brass post 7.1 mm across and 5.5 long above the lever's end: Bonhams' photograph of 2E11795 in its box (sale 22389, lot 1128, image 2; References/README.md), the post 63 px against the head's 152 px for its 17 mm, its length 45-53 px (the view about 15 deg above the head's plane); the head sat on the clamping bracket until 5 October 2026 (SHAPE-PASS: about 10 mm too low against Fig. 1 and 1:15). Which part the post is (the screw's shoulder or the clamping bracket's boss) isn't seen: drawn with the screw */hn(cylBetween(cs,3.55,ct+0.6,ct+0.6+HP,M.brass2,LP,LZ,32),'42114',{sub:1});   /* its knurled head as drawn below (r 9.75 x 5), for the maker's sheet */const kg=new THREE.Group();kg.position.set(LP,ct+0.6+HP,LZ);kg.rotation.x=-Math.PI/2;cs.add(kg);knurl(kg,'z',1,0,LATCH_H,5);   /* the clamping screw's knurled head, r 9.75 (Jones-Horan 63662_06, 19-20 across, rough: LATCH_H; KLUwI2UUCMQ 1:15, against the bezel: 17-20 mm across, nearer the camera; Fig. 1 and Fig. 106 item 17 a large disc on a post); r 8.5 until 20 October 2026, r 2.0 until 4 October 2026; its thickness (5) estimated */
    cs.userData.axis=cylBetween(cs,0.9,bt-2.5,ct+0.6,M.steel,LP,LZ); }   /* the shank below the post */   /* the clamping screw: knurled head on the clamping bracket, its shank the lever's pivot, 2.5 into the support bracket */
  const lv=hn(new THREE.Group(),'42111');lv.position.set(LP,LY,LZ);lv.rotation.y=LATCH_OFF;lat.add(lv);
  { const len=Math.hypot(LP,LZ)-(CR+0.3);mesh(lv,polyGeo([[-1.5,-1.5],[len,-1.5],[len,1.5],[-1.5,1.5]],1.4,[[0,0,0.95]]),M.brass,0,-0.7,0);mesh(lv,ringGeo(1.3,0.95,0.6),M.brass,0,1.0,0);mesh(lv,ringGeo(1.3,0.95,0.3),M.brass,0,-0.85,0);   /* the lever, bored for the clamping screw, with a boss above and a collar below */
    hn(cylBetween(lv,2.7,0.7,8.7,M.brass2,11.5,0),'42112',{sub:1});const kn=hn(new THREE.Group(),'42112');kn.position.set(11.5,8.7,0);kn.rotation.x=-Math.PI/2;lv.add(kn);knurl(kn,'z',1,0,2.7,2.5);   /* the handle: an upright cylinder 5.4 mm across, its top 1 below the head's, 12 mm along the lever from the pivot (KLUwI2UUCMQ 0:28.7: 65 px across and 135 px from the head's centre at 11.2 px/mm; its height read at a slant, about 11); knurled at its top (Fig. 106 item 24; not resolved on the frame). A knob r 2.6 on a post r 1.2 until 5 October 2026 */ }
  /* case (bowl) pivoted in the ring at 6 and 12 (Figs. 94, 106, 107): a support bracket on the case at each, shaped to the case, with a bushing (drawn in it) its pivot
     screw's point runs in; each pivot screw is threaded through the ring (and at 6 the case support strap) and locked by a knurled nut against it (Sec. III) */
  const bowl=new THREE.Group();bowl.userData.partName='bowl';ring.add(bowl);
  /* the case's own frame (cs, the movement's: app.js and blender.js put the movement in it) CSY under the pivots' (bowl, which turns on them; the brackets and their bushings in it). The pivots stand
     4.0 +-0.6 nearer the bezel than the thread's foot less 5.2 drawn until 25 October 2026 (the bowl's frame was the case's): KLUwI2UUCMQ 47:22.5 (4K, the case upside down, the bezel off) the bushing's
     centre 24 +-10 px (1.0-1.1 mm) under the thread's first groove, 1,111 of the 1,135 px from the case's outside bottom (0.979 against 0.894 drawn: +4.2 on either datum); Jones-Horan 63662_07
     (No. 2E12225, the bracket side-on) the lock nut's centre 1-2 under the thread's lip (+3.2 to +4.2); E:/mc-video/oq/ledger/run2_bracket. Likely. So 1.2 under the thread's foot: 4.0 until the case was set on the dial (26 October 2026, above), the case and the gimbals where they were */
  const CSY=YTB-1.2,cs=new THREE.Group();cs.position.y=-CSY;bowl.add(cs);
  /* each case support bracket (42105) a bent brass strap (Fig. 107 draws a strap with flanges for its screws), not a block (20 October 2026). Form: KLUwI2UUCMQ 47:43.0-47:46.0 (one lying loose
     on the mat), 52:27.5 (one in the hand), 52:25.0 and 47:22.5 (on the case): two wings bent to the case's wall, each slotted round its screw, and between them the strap joggled out in a
     hat whose flat runs on toward the bezel as a tab holding the bushing, its bore radial. Sizes on 47:22.5 (4K, the case upside down and nearly square-on to the bracket, rotated 6.5 deg),
     at 22.0 px/mm, the scale the tab's width sets: 10.4 on Jones-Horan 63662_06 from above at the case rim's own scale there (12.2 px/mm for its 105; 127 px), 227-235 px here, the
     screws' spacing against the tab the same on both (0.30 of it): the tab 10.5 wide; the hat 16.0 across at the wall (350 px); the strap 9.6 tall (206-217 px); the screws +-17.2 round
     the wall (801 px apart, put back on the wall's radius at the heads' height), their heads 8.1 across (175-183 px), slotted and domed; the slots 14.0 x 4.6 (305 and 285 px long put back
     on the wall, 97-108 wide), centred on the screws; the wings' ends +-27.3 round the wall (1,173 px across); the bushing 12.4 over the screws' line (274 px) and 5.8 short of the tab's end
     (127 px). Form sure; sizes likely +-10 % (one frame, the scale resting on the tab). Drawn: the screws' line 12.4 under the pivot (47:22.5 271 px, 12.3; 63662_07 11.9; +-0.5; 13.15, lowered 0.75 to stand under the band's step, until 25 October 2026), the strap on
     the wall (CR*0.962), all of it under the lip (YB). Estimated: the strip 1.5 thick (1.2-1.7 edge-on on 47:43.0, blurred, at its tab's scale; the tab's end 1.9 deep on 52:25.0 and 3.4 from above on 63662_06, foreshortened or with the bushing behind it), the walls' run 2.7 (the hat less the tab), the heads' side 2.0 and dome 0.8, their
     thread r 1.75. The tab's outer face kept at CR+6.5, so the bushing (42214) and the case pivots stand where they did. Open: the tab's hole reads 5.3-5.5 across with a lighter ring to
     6.6 on 47:22.5 (about 3.3 in 4.7 on 52:25.0), larger than the drawn bushing (r 1.4) and the pivots' points (r 0.8); the pivots' height on the case, since 25 October 2026 (CSY above). The box report's 17.7 (63662_06 at the box camera's scale, a farther plane) is the tab's end. Until then a flat-backed block
     17.7 x 12 x 6.5 with two screws r 1.2 */
  const RW=CR*0.962,BT2=1.5,TA=5.25,UA=8.0,UL=27.3,US=17.2,VS=-12.4,SH2=9.6,yb0=VS-SH2/2,yb1=VS+SH2/2,RT1=CR+6.5,RT0=RT1-BT2,YE=5.0,SLW=4.6,SLL=14.0;   /* RW: the wall's radius (the lathe's CW below); YE: the tab's end 5.0 past the bushing's centre (KLUwI2UUCMQ 52:27.5, a bracket loose and nearly face-on: 247 of the tab's 519 px across; 47:22.5 107 px at 22.0 px/mm, 4.9; likely +-0.4), 5.8 (47:22.5's 127 px) until 25 October 2026 */
  /* a plate laid out flat (x along the wall, y up, z out of it from 0) bent round the wall at radius R: its triangles split until no edge runs more than du along x (an edge is split
     the same way from both its triangles, so the solid stays closed), each point then put at the angle x/R and the radius R+z; the faces along the wall smooth (normals radial), the rest flat */
  const bendGeo=(g0,R,du=0.8)=>{const p=(g0.index?g0.toNonIndexed():g0).attributes.position.array,V=[],id=new Map();let T=[];
    const vi=(x,y,z)=>{const k=Math.round(x*1e4)+','+Math.round(y*1e4)+','+Math.round(z*1e4);if(!id.has(k)){id.set(k,V.length);V.push([x,y,z]);}return id.get(k);};
    for(let i=0;i<p.length;i+=9)T.push([vi(p[i],p[i+1],p[i+2]),vi(p[i+3],p[i+4],p[i+5]),vi(p[i+6],p[i+7],p[i+8])]);
    for(let it=0;it<24;it++){const Mm=new Map(),N=[];let any=0;const mid=(a,b)=>{const k=a<b?a+'_'+b:b+'_'+a;if(!Mm.has(k)){if(Math.abs(V[a][0]-V[b][0])<=du)Mm.set(k,-1);else{Mm.set(k,V.length);V.push(V[a].map((c,j)=>(c+V[b][j])/2));}}return Mm.get(k);};
      for(const t of T){const E=[0,1,2].map(k=>[t[k],t[(k+1)%3],mid(t[k],t[(k+1)%3])]),s=E.filter(e=>e[2]>=0).length;if(!s){N.push(t);continue;}any=1;
        if(s===3){const[a,b,c]=t,[ab,bc,ca]=E.map(e=>e[2]);N.push([a,ab,ca],[ab,b,bc],[ca,bc,c],[ab,bc,ca]);}
        else if(s===1){const k=E.findIndex(e=>e[2]>=0),[x,y,m]=E[k],o=E[(k+1)%3][1];N.push([x,m,o],[m,y,o]);}
        else{const k=E.findIndex(e=>e[2]<0),[x,y]=E[k],[,o,m1]=E[(k+1)%3],m2=E[(k+2)%3][2];N.push([m1,o,m2],[x,y,m1],[x,m1,m2]);}}
      T=N;if(!any)break;}
    const P=[],Nn=[],U=[],A=new THREE.Vector3(),B=new THREE.Vector3(),C=new THREE.Vector3(),at=v=>{const a=v[0]/R,r=R+v[2];return[r*Math.sin(a),v[1],r*Math.cos(a)];};
    for(const t of T){const q=t.map(i=>at(V[i]));A.fromArray(q[0]);B.fromArray(q[1]).sub(A);C.fromArray(q[2]).sub(A);const n=B.cross(C).normalize(),rad=t.every(i=>Math.abs(V[i][2]-V[t[0]][2])<1e-6);
      for(let k=0;k<3;k++){const v=V[t[k]];P.push(...q[k]);U.push(v[0],v[1]);if(rad){const a=v[0]/R,s=Math.sign(n.x*Math.sin(a)+n.z*Math.cos(a));Nn.push(s*Math.sin(a),0,s*Math.cos(a));}else Nn.push(n.x,n.y,n.z);}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(Nn,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g0.dispose();return g;};
  /* a wing (s: +1 toward +x), its slot a stadium round the screw */
  const wingG=s=>{const sh=new THREE.Shape(),u0=s>0?UA:-UL,u1=s>0?UL:-UA,e=(SLL-SLW)/2;sh.moveTo(u0,yb0);sh.lineTo(u1,yb0);sh.lineTo(u1,yb1);sh.lineTo(u0,yb1);sh.closePath();
    sh.holes.push(new THREE.Path(stadiumPts([s*US-e,VS],[s*US+e,VS],SLW).map(([x,y])=>new THREE.Vector2(x,y))));return bendGeo(extrude(sh,{depth:BT2,bevelEnabled:false,curveSegments:12}),RW);};
  /* the hat in plan, over the strap's height: from each wing's end (UA round the wall) a wall out to the tab's flat (TA either side, its outer face at RT1), BT2 thick across the wall: its
     inner face parallel to the outer, meeting the wall's radius a little inside the wing's end and the tab's inner face at TI */
  const hatPts=(()=>{const f=UA/RW,P1=[RW*Math.sin(f),RW*Math.cos(f)],P2=[(RW+BT2)*Math.sin(f),(RW+BT2)*Math.cos(f)],d=[TA-P2[0],RT1-P2[1]],l=Math.hypot(d[0],d[1]),D=[d[0]/l,d[1]/l],Q=[P2[0]-BT2*D[1],P2[1]+BT2*D[0]];
    const qd=Q[0]*D[0]+Q[1]*D[1],s=-qd+Math.sqrt(qd*qd-(Q[0]*Q[0]+Q[1]*Q[1])+RW*RW),P3=[Q[0]+s*D[0],Q[1]+s*D[1]],TI=[Q[0]+(RT0-Q[1])/D[1]*D[0],RT0],R=[TA,RT1,...P2,...P1,...P3,...TI],o=[];
    for(let k=0;k<10;k+=2)o.push([-R[k],R[k+1]]);for(let k=8;k>=0;k-=2)o.push([R[k],R[k+1]]);return o.reverse();})();
  const tabG=()=>{const sh=new THREE.Shape();sh.moveTo(-TA,yb1);sh.lineTo(TA,yb1);sh.lineTo(TA,YE);sh.lineTo(-TA,YE);sh.closePath();const h=new THREE.Path();h.absarc(0,0,3.5,0,TAU,true);sh.holes.push(h);
    const g=extrude(sh,{depth:BT2,bevelEnabled:false,curveSegments:48});g.translate(0,0,RT0);return g;};   /* the tab above the hat, bored for the bushing (42214, pressed: r 3.5; r 1.4 until 25 October 2026) */
  for(const sz of[1,-1]){const bk=hn(new THREE.Group(),'42105');if(sz<0)bk.rotation.y=Math.PI;bowl.add(bk);
    fuse([mesh(bk,wingG(1),M.brass2),mesh(bk,wingG(-1),M.brass2),mesh(bk,polyGeo(hatPts,SH2),M.brass2,0,yb0,0),mesh(bk,tabG(),M.brass2)]);   /* one bent strap, one mesh (fuse) */
    for(const s of[1,-1]){const g=new THREE.Group();g.rotation.y=(sz<0?Math.PI:0)+s*US/RW-Math.PI/2;bowl.add(g);hn(dHead(g,1,RW+BT2,4.05,2.0,0.8,VS,0,BT2+1.0,1.75),'42117');}   /* square to the wall, through the slot into the case's wall (drawn without a hole), 0.2 short of its inside */
    const b=hn(mesh(bowl,ringGeo(3.5,2.25,3.0),M.steel,0,0,sz*(CR+5.0)),'42214.c');b.rotation.x=Math.PI/2;   /* the bushing (42214) a steel ring 7.0 across, bored 4.5: KLUwI2UUCMQ 52:27.5 (a bracket loose, its tab nearly face-on: the bore's ellipse 224 x 228 px, the ring's 350 x 360) 0.684 and 0.435 of the tab's 519 px, at the tab's 10.5 (+-6 %: 9.9 if 63662_06's tab is read at its near and far scales); 47:22.5 a dark disc 5.0-5.45 in a lighter ring to 6.5, 52:25.0 the same 0.63; countersunk at its face (52:25.0, 52:10.0). Pressed into the tab, its outer end flush with the tab's face, 1.5 standing in behind it (52:10.0 shows it about 1-1.5 proud of one face, rough; its length estimated). r 1.4 bored 0.82, 2.5 long, until 25 October 2026 */
    const rE=sz>0?RO+3.2:RO+2.4,sh=hn(mesh(ring,cylY(2.22,rE-(CR+6.55),32),M.steel,0,0,sz*(rE+CR+6.55)/2),sz>0?'42119':'42118',{sub:1});sh.rotation.x=Math.PI/2;
    const pt=hn(mesh(ring,cylY(2.22,2.5,32),M.steel,0,0,sz*(CR+6.55-1.25)),sz>0?'42119':'42118',{sub:1});pt.rotation.x=Math.PI/2;}   /* the shank through the ring to its shoulder, 0.05 off the bushing, and its point in it: both r 2.22, a plain end running 0.03 clear in the bushing's 4.5 bore (inferred from the bore, the fit estimated; 63662_06 the rear screw's thread 48 px between the tab and the nut, 4.2 +-0.4 at the far side's 11.5 px/mm). Shanks r 1.6 and 1.85, points r 0.8 x 2.05, until 25 October 2026 */
  /* the case pivots' lock nuts inside the ring, between it and the case's bracket, the screws' heads outside (the top-view photograph at 12: the head outside the ring, the knurled nut
     inside, 23 across; at 6 no nut shows outside the strap, its shank inside the ring); the front head 12.3 across, at least 5 long, slotted the whole face (the photograph; 0:36.33), the rear's
     at least 10.6 across (half hidden behind the ring), its thread 3.7 +-0.4 across. Until 5 October 2026 the nuts outside, both heads r 3.4 and 2 long, the threads r 1.6 */
  strap('z',1);hn(boss('z',1,RO+1.2,RO+3.2,3.2,2.25),'42108',{sub:1});{const g=new THREE.Group();ring.add(g);hn(knurl(g,'z',1,RI-2.5,NUT_R,2.5,2.25),'42121.cf');}hn(sHead(ring,'z',1,RO+3.2,6.15,5,0,0,0.05),'42119');
  boss('z',-1,RO,RO+2.4,3.2,2.25);{const g=new THREE.Group();ring.add(g);hn(knurl(g,'z',-1,RI-2.5,NUT_R,2.5,2.25),'42121.cr');}   /* the bosses' and nuts' bores 2.25 to the shanks r 2.2 (1.6/1.85 and 1.62/1.87 until 25 October 2026) */hn(sHead(ring,'z',-1,RO+2.4,5.3,2,0,0,0.05),'42118');
  /* latch keeper on the case, facing the latch through the ring's slot (KLUwI2UUCMQ 1:21.5-1:24.5, its top at 0:28.7; scaled on the case's wall, 1,315 px for the band's 99 mm, the 17 deg
     turn undone; two frames within +-4 %): a block 11 wide and about 21 tall, its top just under the band, standing 4.5 proud, with a window 6.3 wide and about 4 tall that the lever's tip
     goes into when latched; below it a plate with a round hole 4.4 across (taken as the counterbore of its screw, 42116, from outside) and a steady pin's mark. On a separating washer
     (42128) against the wall. The plate's depth (1.5), the screw's place in the hole and its length estimated. Until 5 October 2026 a back 4 by 6 with two cheeks */
  { const kp=hn(new THREE.Group(),'42113');kp.position.set(0,KPY,0);kp.rotation.y=LATCH_A-Math.PI/2;cs.add(kp);
    const x0=CR+0.3,xb=CW0+0.3,xf=x0+4.5,KT=6.5,KW=5.5,WY0=-1.4,WY1=2.6,WW=3.15,PB=-14.5,PY=-8,YL=YLIP-KPY;   /* xb: its back on the wall (CW0) under the lip, x0 over it (YL, its own frame); the front 4.5 proud of the lip (xf) */
    const blk=(y0,y1,w,z,xa=xb)=>mesh(kp,new THREE.BoxGeometry(xf-xa,y1-y0,w),M.brass2,(xa+xf)/2,(y0+y1)/2,z);
    const kpM=[blk(WY1,YL,2*KW,0),blk(YL,KT,2*KW,0,x0),blk(-4.5,WY0,2*KW,0)];   /* the block above and below the window, stepped over the lip */
    for(const s of[1,-1])kpM.push(blk(WY0,WY1,KW-WW,s*(KW+WW)/2));kpM.push(mesh(kp,new THREE.BoxGeometry(0.3,WY1-WY0,2*WW),M.brass2,CW0+0.15,(WY0+WY1)/2,0));   /* its sides and the window's back */
    { const pl=(h,r)=>{const s=new THREE.Shape();s.moveTo(-KW,PB);s.lineTo(KW,PB);s.lineTo(KW,-4.5);s.lineTo(-KW,-4.5);s.closePath();const p=new THREE.Path();p.absarc(0,PY,r,0,TAU,true);s.holes.push(p);const g=extrude(s,{depth:h,bevelEnabled:false,curveSegments:24});g.rotateY(Math.PI/2);return g;};
      kpM.push(mesh(kp,pl(0.7,1.12),M.brass2,xb,0,0),mesh(kp,pl(0.8,2.2),M.brass2,xb+0.7,0,0));fuse(kpM); }   /* the keeper one piece, one mesh (fuse): its block's pieces' faces ran flush, lines across it in Edges until 21 October 2026 */   /* the plate below, counterbored for the screw */
    hn(mesh(kp,ringGeo(1.6,1.12,0.3),M.brass2,CW0+0.15,PY,0),'42128').rotation.z=Math.PI/2;
    hn(sHead(kp,'x',1,xb+0.7,2.0,0.8,PY,0,0.7+0.3+1.0),'42116.k'); }
  const KH=3.34,fu=L.Fu,BT=1;   /* key hole through the flat bottom at the fusee axis (Fig. 7), r 3.34 +-0.15: the shield plate's, the plate turned open with the mat seen through both
     (KLUwI2UUCMQ 47:36.5, rectified on the plate's edge and its shoulder screw, scaled by the key hole's 20.38 mm from the centre); the case's taken the same (r 2.3 until 5 October 2026). The bottom is BT thick (inside face at -FD, outside at -FD-BT), the wall CR-DB; both
     solids. The shield plate under the bottom sits a full millimetre behind the floor seen from inside: at 0.05 mm its outline showed through the floor (depth precision) */
  let bot;const BOWL=[];   /* the bowl's pieces, one solid: merged once the bottom has its holes (below) */   /* the case's bottom: rebuilt below with the shield plate's screw holes */
  const botG=hs=>{const bs=new THREE.Shape();bs.absarc(0,0,FR,0,TAU,false);for(const[x,z,r]of[[fu[0],fu[1],KH],...hs]){const h=new THREE.Path();h.absarc(x,-z,r,0,TAU,true);bs.holes.push(h);}const fl=extrude(bs,{depth:BT,bevelEnabled:false,curveSegments:60});fl.rotateX(-Math.PI/2);return fl;};
  /* the bottom's outside (KLUwI2UUCMQ 47:35, the case from below, nearly face-on): a flat annulus out to an edge rounded about 1.6 mm (RF), a raised ring at r 33.5-36 round a recess
     the shield plate fills (0.728 and 0.676 of the outer edge, read across the centre; the case's outside taken as CR). Until 4 October 2026 the bottom curved into the wall on r 11.5 */
  { const YS=MR_FL,RF=1.6,FRo=CR-RF,arc=(r,cy,a0,a1,c0=FR)=>{const o=[];for(let i=0;i<=12;i++){const a=a0+(a1-a0)*i/12;o.push(V2(c0+r*Math.sin(a),cy-r*Math.cos(a)));}return o;};
    /* the wall's section below the recess, one closed outline: inside face up from the floor's edge to the shoulder, out to the outside face and down it to the bottom's outside face */
    /* its outside as a real case's (Renaissance Antiques' photograph of a Model 21's case side-on, LPEC109-4, 900 px, its silhouette traced column by column; KLUwI2UUCMQ 8:33, the case
       upside down): under the bezel a band, then a step in to a straight wall 0.962 of the band across (685 px against 712), then a chamfer over the bottom 11 mm (80 px) to a base 0.82
       of the band across (584 px). The band is kept at CR, which holds the movement's ring, so the scale rests on it (the photograph's bezel then reads 108 against the top-view
       photograph's 105: ±3 %); from the bezel's edge (YTB) down: a cove 5.6 mm (40 px), the band 7.9 (57 px), the wall 24 (173 px), the chamfer 11.4 (82 px). The cove, flaring from the band to about
       r 54 at the bezel, is drawn as the band (the bezel's own r 52.5 limits it; not modelled). Until 5 October 2026 the wall was a plain cylinder r CR to a 1.6 mm round at the bottom */
    const CW=CW0,CI=CW-1.2,YB=YLIP,YBI=YTB-13.5,YC=-FD-BT+11.4,RB=CR*0.82;   /* YB: the lip under the thread, 3.06 at the shoulder (YS: the movement's ring, r 47.95, needs the lip round it; Jones-Horan 63662_07 2.7, 60 px under the five grooves' 120 px
       for their 5.5 mm; KLUwI2UUCMQ 47:22.5 the silhouette stepping out only there, the wall plain from the strap up to it; rough +-0.7); YTB-13.5 (the bezel's cove and band on LPEC109-4, read as the case's)
       until 25 October 2026. YBI: the inside's step to the shoulder's radius, where it was (estimated; the wall 0.5 thick over it now, OPEN-QUESTIONS). Since 26 October 2026 the shoulder (YS)
       stands 1.97 over the thread's foot, so the lathe runs up inside the thread to it (SH to DB) and out under the thread to the band (CR) */
    const pr=[V2(FR,-FD),V2(RB-1.2,-FD),V2(CI,YC+0.6),V2(CI,YBI-0.6),V2(SH,YBI+0.6),V2(SH,YS),V2(DB,YS),V2(DB,YTB),V2(CR,YTB),V2(CR,YB),V2(CW,YB),V2(CW,YC),V2(RB,-FD-BT),V2(FR,-FD-BT),V2(FR,-FD)];
    BOWL.push(hn(mesh(cs,new THREE.LatheGeometry(pr.reverse(),120),M.brass),'42101'));   /* one front-facing solid: its inside face faces in (a double-sided sheet had its shadow normalBias pushed the wrong way: speckled floor) */
    bot=hn(mesh(cs,botG([]),M.brass,0,-FD-BT,0),'42101',{sub:1});BOWL.push(bot,hn(mesh(cs,ringGeo(33.7,30.5,0.5+0.8+0.3),M.brass,0,-FD-BT-(0.5+0.8+0.3)/2,0),'42101',{sub:1}));   /* the raised ring round the shield plate, r 30.5-33.7 (47:36.5, rough: its crest about 32), the plate sitting 0.3 below its top (the far side's inner wall shows; the depth estimated); r 33.5-36 and flush with the plate until 5 October 2026 */   /* 60: the rim's 120 points, the lathe's own */
    /* the recess's wall, slotted at 12 o'clock down to the shoulder for the movement's alignment pin (Sec. III), so the pin goes in as the movement is lowered: the rim the bezel
       screws onto, threaded, and plain over the thread to the dial's face (since 26 October 2026 the shoulder stands inside the thread: a slotted band, outside it, under the thread until then) */
    const a0=-Math.PI/2,thr=(y0,y1,o)=>hn(mesh(cs,thread({R:TH.R,rp:DB,d:TH.d,p:TH.p,yr:TH.yr,y0,y1,...o}),M.brass),'42101',{sub:1});
    BOWL.push(thr(YTB,YS,{e1:0}),thr(YS,YTT,{e0:0,slot:0.75,a:a0}),thr(YTT,YT,{R:TH.R+TH.d,d:0,slot:0.75,a:a0})); }   /* the rim threaded on one helix, the alignment pin's slot cut through it above the shoulder; its plain top a band of no depth, slotted the same */
  /* winding-hole shield plate (42104; Fig. 107 and its parts list, the case's description, Sec. III and Fig. 7): a disc nearly the size of the case's flat bottom, turning on its
     shoulder screw (42124) at the case's centre. Its hole, as far out as the case's key hole, lines up with it when the plate is turned clockwise (seen from below); let go, the
     return spring (42126) turns it back: an open ring of wire between the plate and the bottom, its hooked end round the stop screw (42125), which goes up through the plate and
     the hook into the bottom, its other end turned in to a pin in the plate. Fig. 107 draws the plate's three holes (the shoulder's at its centre, the key's, the stop screw's on
     the other side) and the ring with its two ends. Measured (KLUwI2UUCMQ 47:24.0 at rest, 47:36.5 turned open: the plate's edge traced, 268 and 274 points, rectified on it and the
     shoulder screw, scaled by the key hole's place): the plate r 30.1 +-0.8, the key hole r 3.34, the stop screw's head 4.6 across, 16.0-16.6 out and 179.4-179.8 deg from the key
     hole in both states, so it is screwed into the plate and turns with it; a fourth hole r 1.6-1.85 at the key hole's radius, 88-91 deg from it (clockwise seen from below), brass
     showing through it in both states. So the screw's end stands up into the gap, the return spring's hook round it, the spring's other end on a pin in the case's bottom; what
     stops the plate's turn lies under it, unseen (the spring holds it at rest). Estimated: the thicknesses, the gap, the half-radian turn (not seen: 47:20-47:44, 8:33). Until 5 October
     2026 the plate was r 33.3 with an arc slot round a stop screw fixed in the case. shield.rotation.y = 0 open, SH_REST closed */
  const SH_REST=-0.5,KD=Math.hypot(fu[0],fu[1]),ah=Math.atan2(fu[1],fu[0]),as=ah+Math.PI,SR=30.1,RS=16.3,PT=0.8,GAP=0.5,YO=-FD-BT,Y0=YO-GAP,YB=Y0-PT,YH=YB-0.05,WR=0.18,PR=4.5,PA=as+5.6;
  const shield=hn(new THREE.Group(),'42104');shield.position.set(0,Y0,0);cs.add(shield);shield.userData.partName='bowl';
  const at=(r,a)=>[r*Math.cos(a),r*Math.sin(a)];   /* a: the angle in the xz plane, atan2(z, x); a plate point at a stands at a - rotation.y in the case */
  {const sh=new THREE.Shape();sh.absarc(0,0,SR,0,TAU,false);const hole=(c,r)=>{const p=new THREE.Path();p.absarc(c[0],c[1],r,0,TAU,true);sh.holes.push(p);};hole(at(KD,ah),KH);hole([0,0],1.55);hole(at(RS,as),0.52);hole(at(KD,ah-Math.PI/2),1.7);   /* the key's, the shoulder's, the stop screw's (tapped), the fourth hole (its use unknown) */
    const pg=extrude(sh,{depth:PT,bevelEnabled:false,curveSegments:48});pg.rotateX(Math.PI/2);   /* rotateX(+90): (x,y,z) -> (x,-z,y), so the outline's y is world z and the plate hangs from Y0 */
    mesh(shield,pg,M.brass2);const q=at(PR,PA);hn(mesh(cs,cylY(0.35,0.9,10),M.steel,q[0],YO-0.025,q[1]),'42126',{sub:1}); }   /* the spring's pin, pressed into the case's bottom, standing down into the gap */
  /* fixed to the case: shoulder screw (its shoulder from the bottom through the plate, slotted head under it); the stop screw in the plate, turning with it */
  const yScrew=(x,z,rs,rh,hh,rt)=>{const g=new THREE.Group();cs.add(g);mesh(g,cylY(rs,YO-YH,16),M.steel,x,(YO+YH)/2,z);mesh(g,cylY(rh,hh,24),M.steel,x,YH-hh/2,z);const sl=mesh(g,new THREE.BoxGeometry(rh*2.02,0.6,rh*0.35),M.steelD,x,YH-hh+0.25,z);sl.rotation.y=0.6;
    g.userData.axis=mesh(g,cylY(rt,BT+0.1,12),M.steel,x,YO+BT/2-0.05,z);return g;};   /* rt: its thread, up through the case's bottom (tapped), from 0.1 inside the shoulder (not flush with the bottom's face) */
  hn(yScrew(0,0,1.5,4.55,0.8,1.0),'42124');   /* its head 9.0-9.3 across (47:24.0, 47:36.5, scaled as the plate; 0.136 of the plate's width by eye agrees); r 2.8 until 5 October 2026 */
  const ss=at(RS,as);{const g=new THREE.Group();shield.add(g);mesh(g,cylY(2.3,0.8,24),M.steel,ss[0],-PT-0.4,ss[1]);const sl=mesh(g,new THREE.BoxGeometry(4.65,0.6,0.8),M.steelD,ss[0],-PT-0.55,ss[1]);sl.rotation.y=0.6;
    g.userData.axis=mesh(g,cylY(0.5,PT+GAP-0.05,12),M.steel,ss[0],(GAP-0.05-PT)/2,ss[1]);hn(g,'42125');}   /* its head 4.6 across (47:24.0) under the plate, its thread up through the plate into the gap, 0.05 under the bottom */
  bot.geometry.dispose();bot.geometry=botG([[0,0,1.02]]);fuse(BOWL);   /* the bowl one mesh (fuse): its wall, bottom, ring and rim drew lines where their faces ran flush in Edges until 21 October 2026 */
  /* the return spring, in the case's frame: a hook round the stop screw's end (in the plate, so it moves as the plate turns), the ring (r RS-0.92) round the long way to the case's pin, and its end turned in to the pin. It is
     built for the plate's turn and rebuilt in place (reclose) when it turns (shield.userData.turn, which app.js calls), so the hook stays on the screw and the end on the pin */
  { const ys=YO-GAP/2,ring=RS-0.92,V=(r,a)=>new THREE.Vector3(r*Math.cos(a),ys,r*Math.sin(a));
    const geo=(rot,old)=>{const hA=as-rot,pe=PA,c=at(RS,hA),P=[],hc=new THREE.Vector3(c[0],ys,c[1]);
      for(let i=0;i<=8;i++){const t=hA-Math.PI/2+(Math.PI/2+Math.PI)*i/8;P.push(hc.clone().add(new THREE.Vector3(0.92*Math.cos(t),0,0.92*Math.sin(t))));}   /* the hook, three quarters round the screw, ending on the ring */
      const n=Math.max(8,Math.round((pe-hA)/0.08));for(let i=1;i<=n;i++)P.push(V(ring,hA+(pe-hA)*i/n));
      for(let i=1;i<=6;i++)P.push(V(ring-(ring-PR-0.35-WR)*i/6,pe));   /* the end turned in, to the pin */
      return reclose(old,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P,false,'centripetal'),P.length*3,WR,6,false));};
    const sp=hn(mesh(cs,geo(SH_REST,null),M.steel),'42126');let last=SH_REST;
    shield.userData.turn=r=>{shield.rotation.y=r;if(Math.abs(r-last)>1e-4){last=r;sp.geometry=geo(r,sp.geometry);}}; }
  shield.userData.turn(SH_REST);shield.userData.hole={p:at(KD,ah),c:fu,r:KH,rest:SH_REST};   /* for bom.py's check: the plate's hole (plate frame), the case's (case frame) */
  /* the bezel (42102), screwed onto the rim, rising to hold the crystal (42103) in a groove clear of the hands' square (its section below). YC, the crystal's underside, MR_Y+5.6 until 5 October 2026,
     MR_Y+10.4 (2.4 over the square's top) until 26 October 2026 */
  /* its case end knurled (19 October 2026): KLUwI2UUCMQ 2:42 (the bezel upside down under the movement, the plate's 87.57 as the scale; PROVENANCE.md, "The bezel on 2:42 and
     48:30") and 48:30 (the bezel alone): a diamond knurl, its pitch about 0.85 mm both ways (23 px at 26.96 px/mm, so about 400 round r 54.2, where the end's ellipse puts the band:
     the model's TR+1.8, 54.3), the band about 5.1 mm tall (rows 1995-2128 at about 18 deg); the rows 0.8 apart (21 px); the knurl's depth 0.3 estimated. The lathe's band at the knurl's root (BZK.r0), the knurl a
     closed shell on it (knurlBand), crests at TR+1.8. Until then a plain band 3.7 mm tall (YTB to YT+1.2) */
  /* the knurl's sizes (BZK) with the bezel, below. rp: the rows of diamonds 0.8 mm apart along the axis (21 px on 2:42, foreshortened by about cos 18 deg), each row's offset half a pitch from the last. Since 20 October 2026
     h 3.4 and rp 0.85: KLUwI2UUCMQ 48:27.61 (the bezel alone, edge-on) has about 4 rows in a band of 125-130 px, the rows 29-33 px apart against the knurl's round pitch
     of 32.6 px (autocorrelation), that pitch the model's 0.853 (400 diamonds on r 54.3): 3.3-3.6 mm; 5.1 on 2:42 at 18 deg took in part of the cove (E:/mc-video/oq/ledger/ring_dial) */
  const knurlBand=(r1,d,y0,h,n,rp)=>{const m=Math.max(2,Math.round(h/rp)),N=2*n,P=[],I=[],r0=r1-d,ri=r0-0.05,ix=(i,j)=>j*N+(i%N);
    for(let j=0;j<=m;j++)for(let i=0;i<N;i++){const t=i/N*2*Math.PI,H=((i+j)%2)?1:0,r=r0+d*H;P.push(r*Math.cos(t),y0+h*j/m,-r*Math.sin(t));}   /* a checkerboard of crests and roots, two samples a pitch: the diamonds */
    const B=P.length/3;for(const y of[y0,y0+h])for(let i=0;i<N;i++){const t=i/N*2*Math.PI;P.push(ri*Math.cos(t),y,-ri*Math.sin(t));}
    const q=(a,b,c,e)=>I.push(a,b,c,a,c,e);
    for(let j=0;j<m;j++)for(let i=0;i<N;i++){const a=ix(i,j),b=ix(i+1,j),c=ix(i+1,j+1),e=ix(i,j+1);if((i+j)%2)I.push(a,b,e,b,c,e);else q(a,b,c,e);}   /* outside: each cell split on its root-to-root diagonal, so every crest is a four-sided pyramid (a diamond) */
    for(let i=0;i<N;i++){const a0=B+i,a1=B+(i+1)%N,b0=B+N+i,b1=B+N+(i+1)%N;q(a0,b0,b1,a1);q(ix(i,0),B+i,B+(i+1)%N,ix(i+1,0));q(ix(i+1,m),B+N+(i+1)%N,B+N+i,ix(i,m));}   /* inside, bottom, top */
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setIndex(I);const f=g.toNonIndexed();f.computeVertexNormals();return f;};   /* flat facets: each pyramid's faces lit apart, as the knurl's are */
  /* the bezel's section (26 October 2026): its outside traced on Renaissance Antiques' LPEC109-4 (the case side-on), both edges of the silhouette every 2 px (E:/mc-video/oq/ledger/run3_case/
     bezel_prof.py), scaled by the knurl's r 54.2 (KLUwI2UUCMQ 2:42, the plate's 87.57 as the scale): 7.17 px/mm. From its foot on the case's lip: a short chamfer, a plain skirt
     r 49.45-49.6 over the rim's thread, at 7.0 a cove flaring to the knurl, r 53.85 at 13.7, the knurled band (3.4: 48:27.61) at the top, r 54.15, the top at 17.6. The knurl at the
     glass end, with a plain skirt under it, as KLUwI2UUCMQ 0:28.7 and 1:22.5 show it on the case and 2:33-2:43 the bezel alone (a knurl, a flare and a band); likely. Inside: the
     skirt threaded on the rim's thread (TH), a plain bore over the rim's plain top. Since 26 October 2026 the sight cone runs from the dial up to the glass, as KLUwI2UUCMQ 0:28.7
     shows it (the bright cone wide on the far side, a thin edge on the near: it rises from the dial's edge to the glass at the bezel's top): its foot a lip YLB 0.05 over the dial's face at the
     dial photograph's opening (BL, r 45.9), its top under the glass's seat, the glass (GR, r 53.0, the top's inner edge as read before; estimated) 0.3 under the top, held by a lip
     0.3 over its edge (estimated), YC its underside 2.17 over the hands' square (14.5). Until then the glass sat on a ledge at r 45.9 over a plain bore 10 deep from the rim's top, the
     cone over the glass (YC 2.4 over the square), the bezel 5.03 higher on the dial. Until 26 October 2026 a cone from the knurl, at the case end, up to the crystal: the knurl was
     read as the case end on 48:30 and LPEC109-4's cove and band as the case's */
  const YZ=YTB+17.6,YC=YZ-1.1,YLB=YT+0.05,BL=DIAL_R-1.6,GR=53.0,RSK=49.45,RBz=TH.R+TH.d+TH.c,h=v=>YTB+v;
  const BZK={n:400,h:3.4,d:0.3,rp:0.85,r1:54.15},BZr0=BZK.r1-BZK.d;   /* the knurl: a diamond knurl about 0.85 round (400 on r 54.3, 2:42) and its rows 0.85 apart (48:27.61), 0.3 deep (estimated) */
  const COVE=[[49.61,6.97],[49.75,7.81],[50.03,8.65],[50.37,9.48],[50.93,10.32],[51.42,10.88],[51.97,11.44],[52.6,11.99],[53.23,12.55],[53.85,13.11]];   /* [r, h over the foot], LPEC109-4 x 544-588 */
  const bpr=[[RBz,YTB],[RSK-0.25,YTB],[RSK,h(0.25)],[RSK,h(1.4)],...COVE.map(([r,v])=>[r,h(v)]),[BZr0,h(13.67)],[BZr0,YZ],[GR-0.3,YZ],[GR-0.3,YC+0.8],[GR+0.1,YC+0.8],[GR+0.1,YC],[GR-0.6,YC],[BL,YLB],[RBz,YLB],[RBz,YTT]];
  const bz=hn(mesh(cs,lathT(bpr,{R:RBz,d:TH.d,p:TH.p,yr:TH.yr,k:bpr.length-1,inside:true}),M.brass),'42102');
  fuse([bz,hn(mesh(bz,knurlBand(BZK.r1,BZK.d,YZ-BZK.h,BZK.h,BZK.n,BZK.rp),M.brass),'42102',{sub:1})]);   /* its knurled band on it, one mesh (fuse) */
  const gl=hn(mesh(cs,new THREE.CylinderGeometry(GR,GR,0.8,96),M.glass,0,YC+0.4,0),'42103');gl.renderOrder=5;bz.userData.bezel=gl.userData.bezel=true;   /* the bezel with its crystal, taken off to set the hands with the key (app.js) */
  /* lids hinged at the back: the glass lid (HG tall) on the box, the outer lid (HL) on the glass lid, so it opens on its own and never swings through the glass lid. Each turns about the
     knuckles of its piano hinge, HR behind the back (mid at the lower seam's axis, top at the upper's), so each lid's back face is at z HR in its own frame (LO its middle).
     The glass lid's walls 11 thick (its frame round the glass about 11 +-2 wide from above, REPORT.md: rough; 26, estimated, until 20 October 2026), the glass 3 under its top (estimated) */
  const HR=2.6,LO=HR+W,mid=new THREE.Group(),top=new THREE.Group();mid.userData.partName='lidGlass';mid.userData.pc='cover';top.userData.partName='lid';mid.position.set(0,YL,-W-HR);top.position.set(0,HG,0);root.add(mid);mid.add(top);
  { const fw=T,p=mid,h=HG;   /* fw: the glass lid's walls as thick as the base's (the survey's frame 11 +-2 wide at its 197 scale, 9.6 at the box's; 11 until 26 October 2026: the lid stay's bar, against the base's wall, then ran inside the lid's) */
   wood(2*W,h,fw,0,h/2,HR+2*W-fw/2,p);wood(2*W,h,fw,0,h/2,HR+fw/2,p);wood(fw,h,2*W-2*fw,W-fw/2,h/2,LO,p);wood(fw,h,2*W-2*fw,-W+fw/2,h/2,LO,p);
    const g=pc(mesh(p,new THREE.BoxGeometry(2*W-2*fw,0.8,2*W-2*fw),M.glass,0,h-3,LO),'glass');g.renderOrder=6; }   /* its own piece (lidGlass.glass), so a click can pick it */
  wood(2*W,HL,2*W,0,HL/2,LO,top);
  for(const sx of[1,-1])for(const sz of[HR,HR+2*W]){brassCorner(mid,sx*W,137*BOX_S-H0,sz,10*BOX_S,LO);const tc=brassCorner(top,sx*W,HL-5*BOX_S,sz,10*BOX_S,LO);   /* the glass lid's at Y 132-142; the outer lid's up to its top (Y 186-196 against the photographs' 184-195) */
    const zc=sz+Math.sign(sz-LO)*CT,cx=sx*(W+CT),q=[[cx,zc]];for(let i=0;i<=16;i++){const a=Math.PI/2*i/16;q.push([cx-sx*CL*Math.cos(a),zc-Math.sign(sz-LO)*CL*Math.sin(a)]);}fuse([tc,mesh(top,polyGeo(q,CT),M.brass,0,HL,0)]);}   /* the plate over the top's corner */
  /* the hinges (20 October 2026, REPORT.md: Jones-Horan 63662_18 from behind, lots 63662 and 38240 open): one piano hinge on each seam, 157-159 long, centred (likely +-5); its leaves 0.6 thick on
     the back faces, 8 wide from the seam, the knuckle r 2.6 on the axis, in seven lengths, the lower part's four and the upper's three (estimated; leaves wider would run under the outer lid's
     corner caps). Each leaf stops where it meets the knuckle's surface (hk from the seam), not under the other half's knuckles. Until then two hinges r 2.6 x 30 at x +-55 */
  { const HGL=158*BOX_S,HGW=8,HGT=0.6,hk=Math.sqrt(HR*HR-(HR-HGT)**2),lf=(p,y0,y1,z)=>mesh(p,new THREE.BoxGeometry(HGL,Math.abs(y1-y0),HGT),M.brass,0,(y0+y1)/2,z),
      kn=(p,y,z,odd)=>{const o=[];for(let i=odd?1:0;i<7;i+=2){const k=mesh(p,cylY(HR,HGL/7,20),M.brass,-HGL/2+HGL/7*(i+0.5),y,z);k.rotation.z=Math.PI/2;o.push(k);}return o;};   /* each half's leaf and knuckles one piece, one mesh (fuse) */
    fuse([lf(root,YL-HGW,YL-hk,-W-HGT/2),...kn(root,YL,-W-HR,0)]);fuse([lf(mid,hk,HGW,HR-HGT/2),...kn(mid,0,0,1)]);   /* the lower: the box's half and the glass lid's */
    fuse([lf(mid,HG-HGW,HG-hk,HR-HGT/2),...kn(mid,HG,0,0)]);fuse([lf(top,hk,HGW,HR-HGT/2),...kn(top,0,0,1)]); }   /* the upper: the glass lid's and the outer lid's */
  /* the hasps (20 October 2026, REPORT.md: Jones-Horan 38240_05 square-on, 63662's): two, each 51 x 22 split at its seam (Y 92-115 at the lower, 164-186 at the upper; likely +-1), a half on
     each side, its outer corners cut (about 2.5, estimated), two screws to a half, a turn knob about 10 across on the lower half; 1.2 thick, the screws' heads r 1.6 and the knob 4 proud,
     estimated. Until then one plate 14 x 18 on the outer lid's front */
  const hasp=(p,y,zf,up,knob)=>{const S=BOX_S,sg=up?1:-1,v0=sg*0.25,v1=sg*11.25*S,c=2.5,hw=25.5*S,q=[[-hw,v0],[hw,v0],[hw,v1-sg*c],[hw-c,v1],[-hw+c,v1],[-hw,v1-sg*c]];   /* at the box's scale (BOX_S) */
    mesh(p,facePlate(q,1.2),M.brass,0,y,zf);for(const x of[-21*S,21*S])mesh(p,cylY(1.6,0.6,16),M.brass2,x,y+sg*5.75*S,zf+1.5).rotation.x=Math.PI/2;
    if(knob)mesh(p,cylY(5*S,4,32),M.brass2,0,y+sg*5.75*S,zf+3.2).rotation.x=Math.PI/2;};
  hasp(root,YL,W,false,true);hasp(mid,0,HR+2*W,true,false);hasp(mid,HG,HR+2*W,false,true);hasp(top,0,HR+2*W,true,false);
  /* the nameplate on the glass lid's front (Fig. 106 draws one; 20 October 2026, REPORT.md: Jones-Horan 38240_05, the Hamilton plate 87 x 17 at Y 148; boxes vary, likely): its ends cut
     (3, estimated), 0.8 thick, a screw at each end (estimated). Until then a plate 70 x 26 on the outer lid's top */
  { const q=[[-40.5,-8.5],[40.5,-8.5],[43.5,-5.5],[43.5,5.5],[40.5,8.5],[-40.5,8.5],[-43.5,5.5],[-43.5,-5.5]].map(([u,v])=>[u*BOX_S,v*BOX_S]);mesh(mid,facePlate(q,0.8),M.brass,0,148*BOX_S-H0,HR+2*W);   /* at the box's scale (BOX_S) */
    for(const x of[-40,40])mesh(mid,cylY(1.2,0.5,16),M.brass2,x*BOX_S,148*BOX_S-H0,HR+2*W+1.05).rotation.x=Math.PI/2; }
  /* the lid stay (20 October 2026, REPORT.md: a brass slotted stay on the glass lid's left, inside, on Jones-Horan 63662's and 38240's open boxes; Fig. 106 draws a bar in the open lid): the
     form only, its sizes estimated, as the Wempe's (wempe/js/case.js, Wempe 6161's): a bar 6 wide and 1.5 thick against the base's left wall's inside (x -(W-T)), on a pivot 5 over the seam and
     40 from the back on a post 10.1 long out of the glass lid's wall, riding by its slot (2.4 wide, 23.5 to 85 from the pivot) on a headed pin 20 under the seam and 45 from the back in the box's wall:
     the pin 25.5 from the pivot shut and 82.4 open (1.6 rad), the bar's end 1.7 over the felt shut. stay() turns it to lie on the pin (app.js, the essay and the export call it after the lids) */
  const STA=5*BOX_S,STB=HR+40*BOX_S,SPY=-20*BOX_S,SPZ=45*BOX_S,STL=88*BOX_S,stayP=new THREE.Group();stayP.position.set(-(W-T)+0.85,STA,STB);mid.add(stayP);
  { const g=polyGeo(stadiumPts([0,0],[0,-STL+3],6),1.5,[{pts:stadiumPts([0,-23.5*BOX_S],[0,-85*BOX_S],2.4)},[0,0,1]]);   /* the stay's estimated sizes with the box's (BOX_S) */g.translate(0,-0.75,0);g.rotateZ(Math.PI/2);g.rotateX(-Math.PI/2);mesh(stayP,g,M.brass);   /* along -y from its pivot, its thickness across the wall */
    const cx=(r,l,x)=>{const c=mesh(stayP,cylY(r,l,16),M.brass,x,0,0);c.rotation.z=Math.PI/2;};cx(2,10.1,-0.75-5.05);cx(1,1.5,0);cx(1.6,0.8,1.15);   /* the post from the lid's wall, the pivot through the bar, its head */
    for(const[r,l,x]of[[1,2,-(W-T)+1],[2,0.8,-(W-T)+2.1]]){const pn=mesh(root,cylY(r,l,16),M.brass,x,YL+SPY,-W+SPZ);pn.rotation.z=Math.PI/2;} }   /* the pin, out of the box's wall through the slot, its head (r 2, 0.1 off the bar) keeping the bar on it */
  const stay=()=>{const al=mid.rotation.x,dy=SPY,dz=SPZ+HR,y=dy*Math.cos(al)+dz*Math.sin(al),z=-dy*Math.sin(al)+dz*Math.cos(al);stayP.rotation.x=Math.atan2(-(z-STB),-(y-STA));};stay();
  /* the Exploded view's All (app.js, e 0 to 1): the box and case taken apart up the bowl's axis, under the movement lifted out of it: the gimbal ring with its pivot screws
     70 over the box, the case (bowl) 85 over the ring, its shield plate with its screw and spring 20 under the case, the bezel 45 and the crystal 75 over it; the latch and the key
     out to the right, the glass lid back off its hinge and the outer lid back off the glass lid's. Each moved from where it was built (ex0) */
  const EXP=[[ring,0,70,0],[gp,0,70,0],[bowl,0,85,0],[shield,0,-20,0],[lat,70,0,0],[key,150,60,0],[mid,0,0,-45],[top,0,45,0]];
  for(const c of cs.children){const h=c.userData.hn,d=h==='42102'?45:h==='42103'?75:h==='42124'||h==='42126'?-20:0;if(d)EXP.push([c,0,d,0]);}
  const explode=e=>{for(const[g,dx,dy,dz]of EXP){const p=g.userData.ex0||(g.userData.ex0=g.position.clone());g.position.set(p.x+dx*e,p.y+dy*e,p.z+dz*e);}};
  return{root,ring,bowl,cs,mid,top,stay,shield,shRest:SH_REST,latch:lv,RO,CR,explode};
}
/* ================= motions the page (app.js) and the export (blender.js) both play: the gimbals, the twist, the banked balance ================= */
/* the escape wheel held by the train-blocking screw's dog point a fraction f of a tooth past its lock (the next unlocking let it go until a spoke met the point): the tooth
   stands in the impulse jewel's path where ESC.PA (the wheel's angle the jewel holds it at, along the balance's angle) comes to -f P, and the jewel strikes it there on each
   return swing. bankAt(f): that angle of the balance, null where the tooth is clear of the jewel's path (f under 0.04 or over 0.96) */
/** @param {number} f */
function bankAt(f){const P=ESC.PA,g=-f*ESC.P;for(let i=0;i<P.length-1;i++)if(P[i]>=g&&P[i+1]<g)return ESC.TH0+(i+(P[i]-g)/(P[i]-P[i+1]))*ESC.DT;return null;}
/* the balance's state (ESC.state) at phase p, swing a and drive s, banked at angle b (bankAt; null: free): it was on the far side of the tooth when the wheel stopped, so it
   swings only there, turning back where the jewel meets the tooth (the free swing's part from b round through its far turn, repeated), and once its swing is less than b it
   lies against the tooth, if b is past its rest (b > 0), or swings free short of it */
/** @param {number} p @param {number} a @param {number} s @param {number|null} b */
function bankState(p,a,s,b){if(b==null||a<=Math.abs(b)&&b<=0)return ESC.state(p,a,s);if(a<=b)return ESC.state(0.5,b,s);
  const ps=Math.acos(clamp(-b/a,-1,1))/TAU,L=1-2*ps,r=((p-ps)%1+1)%1;return ESC.state(ps+r%L,a,s);}
/* the gimbals with inertia (2.5 in IDEAS.md): the case (with the ring, about the ring's pivots) hangs below each axis as a pendulum, ψ its angle from the vertical and φ the box's.
   At sea the box rolls and pitches about the ship's axes, GIM.RD metres below it (5, illustrative: a chart room above the ship's centre of roll), so the pivots move with the box and
   their acceleration a leans the case toward the apparent vertical, gravity less a. Per axis, ψ'' = -ω0² ((1 + av/g) sin ψ - (ah/g) cos ψ) - 2ζω0 (ψ' - φ'), with
   ah = RD (φ'' cos φ - φ'² sin φ) and av = -RD (φ'' sin φ + φ'² cos φ) from the ship's angle and its rates (sea: [φ, φ', φ''] each and rd, the RD used, or null); the box being above the axis, at the ends of
   a roll the case leans against it by RD ω²/g of the roll, about 6° at the default 7 s and 14°. The pivots' friction pulls it after the box (φ' from the box's angles, a jolt with them).
   ω0: the case's own period, 0.7 s: tools/gimbals.js finds 0.67 s on the case's pivots and 0.77 s on the ring's from the model's own masses (massprops.py: 1,250 g, its centre of gravity 9.9 mm under the pivots, radius of gyration 33 mm; 0.66 and 0.74 s until the box was measured, 20 October 2026; until 18 October 2026 0.72 and 0.68 s, the Laid out view's schematic plates weighed with it), levelled as the manual levels it (p. 13); ζ estimated. fr: how free
   the gimbals are (0 latched: the case goes with the box). It stops against the ring 25° off the box (estimated; in the drawn box nothing stops the case, which turns over in the ring to be wound (Sec. III), and the ring meets the box at 63.5° and 73.5°: massprops.py; the case's bottom met the felt at 29.5° until its pivots were measured, 20 October 2026). G: {p, r: [ψ, ψ'], lp, lr: the box's last angles, ap, ar: the apparent vertical} */
/* the ship's motion the box shows (Display, Ship motion; illustrative): rolling 14° each way at the period chosen, pitching 0.55 of that at two thirds of its rate (so the motion repeats every three rolls, and the export's At sea loops). GIM.sea(u, w, k): u the
   roll's phase (rad), w its rate (rad/s), k how much of it (0 to 1, easing in and out; its own rate of change left out): pitch and roll, each [angle, rate, acceleration], and rd,
   the axes' distance below the box: GIM.RD at a ship's periods (4 s and up), falling to 0 at 2 s, since a box rolled faster than any ship rolls stands for one rocked about
   its own pivots (the slider's short end, which shows the case's own period) */
const GIM={W0:TAU/0.7,Z:0.05,LIM:25*D2R,RD:5,G:9.80665,PR:2/3,
  /** @param {number} u @param {number} w @param {number} k */ sea(u,w,k){const a=14*D2R*k,b=0.55*a,f=GIM.PR,v=f*u+1.1;return{r:[a*Math.sin(u),a*w*Math.cos(u),-a*w*w*Math.sin(u)],p:[b*Math.sin(v),b*f*w*Math.cos(v),-b*f*f*w*w*Math.sin(v)],rd:GIM.RD*clamp((TAU/w-2)/2,0,1)};}};
/** @param {{p:number[],r:number[],lp:number,lr:number,ap?:number,ar?:number}} G @param {number} dt @param {number} ph the box's pitch @param {number} rl its roll
    @param {{p:number[],r:number[],rd:number}|null} sea the ship's pitch and roll with their rates (GIM.sea) @param {number} fr */
function gimStep(G,dt,ph,rl,sea,fr){if(dt<=0){G.lp=ph;G.lr=rl;return;}
  const n=Math.ceil(dt/0.002),h=dt/n,W2=GIM.W0*GIM.W0,ZW=2*GIM.Z*GIM.W0,rd=sea?sea.rd:0;
  for(const[q,f,f0,m,k]of/** @type {[number[],number,number,number[]|null,string][]} */([[G.p,ph,G.lp,sea&&sea.p,'ap'],[G.r,rl,G.lr,sea&&sea.r,'ar']])){const v=(f-f0)/dt;
    const ah=m?rd*(m[2]*Math.cos(m[0])-m[1]*m[1]*Math.sin(m[0]))/GIM.G:0,av=m?1-rd*(m[2]*Math.sin(m[0])+m[1]*m[1]*Math.cos(m[0]))/GIM.G:1;G[k]=Math.atan2(ah,av);   /* av: 1 + the vertical acceleration over g */
    if(fr<1e-3){q[0]=f;q[1]=v;continue;}
    for(let i=0;i<n;i++){q[1]+=h*(-W2*(av*Math.sin(q[0])-ah*Math.cos(q[0]))-ZW*(q[1]-v));q[0]+=h*q[1];}
    if(Math.abs(q[0]-f)>GIM.LIM){q[0]=f+Math.sign(q[0]-f)*GIM.LIM;q[1]=v;}}
  G.lp=ph;G.lr=rl;}
/* the twist that starts a stopped chronometer (Sec. III: "a single quick twist to the right or the left", the box grasped with both hands on its table): the box turned TWIST.A about
   the vertical in TWIST.T1 and back as quickly, TWIST.T2 later, on smoothsteps (35°, 0.1 s and 0.25 s: illustrative). The balance, free on its jewelled pivots but for the
   hairspring, stays where it is in space while the box turns under it, so its angle in the movement goes as θ'' = -ω²θ - α''; turning back half its period later doubles what
   the first turn gave, and a twist from rest leaves it swinging about 67°, a little more than a real start by hand (62-66°: References/VIDEOS.md, We1dLNXiBj0 0:55), well over
   the 42° the escapement needs. TWIST.at(t): the box's angle t s into the twist; TWIST.run(th, u, w, sg): the balance's θ and θ'/ω at the twist's end from th and u at its start (ω = w), the box turned sg = 1 or -1 */
const TWIST={A:35*D2R,T1:0.1,T2:0.25,T:0.35,
  /** @param {number} t */ at:t=>TWIST.A*(smooth(t/TWIST.T1)-smooth((t-TWIST.T2)/TWIST.T1)),
  /** @param {number} th @param {number} u @param {number} w @param {number} sg */ run(th,u,w,sg){const p=TWIST.path(th,u,w,sg);return[p.th,p.u];},
  /* the same, with the balance's angle at every step of the twist (P[i] at i/n of TWIST.T), so the page draws it turning with the box, not jumping to its end state */
  /** @param {number} th @param {number} u @param {number} w @param {number} sg @returns {{P:Float64Array,th:number,u:number}} */
  path(th,u,w,sg){const n=700,h=TWIST.T/n,c=sg*TWIST.A/(TWIST.T1*TWIST.T1),a2=/** @param {number} x */x=>x<=0||x>=1?0:6-12*x,P=new Float64Array(n+1);let v=u*w;P[0]=th;
    for(let i=0;i<n;i++){const t=(i+0.5)*h;v+=h*(-w*w*th-c*(a2(t/TWIST.T1)-a2((t-TWIST.T2)/TWIST.T1)));th+=h*v;P[i+1]=th;}return{P,th,u:v/w};}};
function shadowTex(){const cv=document.createElement('canvas');cv.width=cv.height=256;const x=cv.getContext('2d');const g=x.createRadialGradient(128,128,20,128,128,128);g.addColorStop(0,'rgba(0,0,0,0.42)');g.addColorStop(0.6,'rgba(0,0,0,0.16)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,256,256);return new THREE.CanvasTexture(cv);}

