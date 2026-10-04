// @ts-check
/* box.js: mounting box (glass lid hinged to the box, outer lid hinged to the glass lid), gimbal ring, case, winding key
   Part of 'The Marine Chronometer, working' (three.js r128). See README.md. */

/* ================= box, bowl, gimbals ================= */
/* the latch: the ring's slot and the case's keeper face the front right corner (LatheGeometry angle, from +z toward +x); the lever turns on its pin
   from LATCH_OFF (along the right wall) to LATCH_ON (toward the centre) */
const LATCH_A=Math.PI/4,LATCH_OFF=Math.PI/2,LATCH_ON=Math.PI*3/4;
function buildBox(M){
  const root=hn(new THREE.Group(),'42201');root.userData.partName='box';const W=98.5,T=10,yF=-100,H0=100;
  const wood=(w,h,d,x,y,z,p=root,m=M.wood)=>mesh(p,new THREE.BoxGeometry(w,h,d),m,x,y,z);
  wood(2*W,T,2*W,0,yF+T/2,0);
  wood(2*W,H0,T,0,yF+H0/2,W-T/2);wood(2*W,H0,T,0,yF+H0/2,-W+T/2);
  wood(T,H0,2*W-2*T,W-T/2,yF+H0/2,0);wood(T,H0,2*W-2*T,-W+T/2,yF+H0/2,0);
  wood(2*W-2*T,1,2*W-2*T,0,yF+T+0.5,0,root,M.felt);
  const brassCorner=(p,x,y,z,h,cz=0)=>{const sx=Math.sign(x),sz=Math.sign(z-cz);mesh(p,new THREE.BoxGeometry(12,h,1.2),M.brass,x-sx*5.4,y,z+sz*0.6);mesh(p,new THREE.BoxGeometry(1.2,h,12),M.brass,x+sx*0.6,y,z-sz*5.4);};
  /* brass corner caps, two to each vertical edge, 0.2 of the base's height: one from 0.05 to 0.25 of it below the top, one at the foot (Fig. 1, the far front corner seen upright;
     the near one fits; KLUwI2UUCMQ 0:45, 1:15). Until 4 October 2026 one strip the full height of each edge */
  for(const sx of[1,-1])for(const sz of[1,-1]){brassCorner(root,sx*W,-0.15*H0,sz*W,0.2*H0);brassCorner(root,sx*W,yF+0.1*H0,sz*W,0.2*H0);}
  /* the side handles as KLUwI2UUCMQ 0:45 shows them (the box's side, oblique): a bail between two round rosettes, the rosettes at the gimbal pivot's height either side of its
     boss, their centres 0.31 of the box's width apart (61 mm) and r 15 (0.15 of it), the bail hanging below between them; read along the face against the box's 197 mm (+-10 %). The
     bail's section and swan neck, and the rosettes' thickness, estimated. Until 4 October 2026 a plate with a half-ring below the pivot */
  const V2=(a,b)=>new THREE.Vector2(a,b),HY=-20;   /* HY: the gimbal pivots' height (RY, below) */
  for(const sx of[1,-1]){const RZ=30.5,RR=15;for(const sz of[1,-1]){const ro=mesh(root,cylY(RR,1.6,40),M.brass,sx*(W+0.8),HY,sz*RZ);ro.rotation.z=Math.PI/2;const ey=mesh(root,cylY(3.2,5,20),M.brass,sx*(W+1.6+2.5),HY,sz*RZ);ey.rotation.z=Math.PI/2;}
    const hd=new THREE.Mesh(closeGeo(new THREE.TorusGeometry(RZ,2.4,10,40,Math.PI)),M.brass);hd.rotation.set(Math.PI,Math.PI/2,0);hd.position.set(sx*(W+5.5),HY,0);root.add(hd);}
  /* winding key standing in a socket on a corner block at the back right (Fig. 1), low enough for the lids to close */
  /* the key as KLUwI2UUCMQ 0:45 shows it held up: a pipe (the socket for the fusee's square) up to a short neck, a cone widening to a collar, and a flat paddle with a rounded top,
     in proportion to the pipe's width (traced on the frame: total 10.6 widths, the pipe 4.1 of them, cone 2.0, collar 0.9 and 2.2 wide, paddle 2.9 tall and 3.1 wide); the pipe's
     outside r 2.2 as before, so the scale is estimated (+-15 %). Until 4 October 2026 a T bar with balls. KB: its foot, standing in its socket on the corner block, which is lower
     by as much as the longer key needs to stay under the glass lid */
  const KX=W-T-12,KB=-50.5,kw=4.4;wood(24,59-23,24,KX,yF+T+30.5-11.5,-KX,root,M.woodEdge);   /* stands on the felt */mesh(root,cylY(4.2,4,20),M.brass2,KX,KB-2,-KX);
  const key=hn(new THREE.Group(),'42044');key.userData.partName='key';key.position.set(KX,KB,-KX);root.add(key);key.rotation.y=Math.PI/4;
  mesh(key,new THREE.LatheGeometry([V2(0,0),V2(kw/2,0),V2(kw/2,4.1*kw),V2(0.6*kw,4.4*kw),V2(1.1*kw,6.1*kw),V2(1.1*kw,7.0*kw),V2(0,7.0*kw)],24),M.brass);   /* pipe, neck, cone, collar */
  { const pw=3.1*kw/2,ph=2.9*kw,pt=0.8*kw,sh=new THREE.Shape();sh.moveTo(-1.05*kw,0);sh.lineTo(-pw,ph-pw);sh.absarc(0,ph-pw,pw,Math.PI,0,true);sh.lineTo(1.05*kw,0);sh.closePath();
    const pg=extrude(sh,{depth:pt,bevelEnabled:false,curveSegments:24});pg.translate(0,7.0*kw,-pt/2);mesh(key,pg,M.brass); }   /* the paddle on the collar, as wide as it at its foot, widening to its rounded top; its thickness (0.8 of the pipe's width) estimated */
    /* slotted screw along an axis: 'x' or 'z', outward sign s, head from r0 to r0+h, and its shank (half the head's radius) sh mm back into the part under it */
  const sHead=(p0,ax,s,r0,rad,h,y,t,sh=2.5)=>{const p=new THREE.Group();p0.add(p);p.userData.sc={r:rad,h,len:sh,rs:rad*0.5};const X=ax==='x',m=mesh(p,cylY(rad,h,20),M.brass2,0,y,0),sl=mesh(p,X?new THREE.BoxGeometry(0.6,rad*2.02,rad*0.35):new THREE.BoxGeometry(rad*0.35,rad*2.02,0.6),M.steelD,0,y,0),k=mesh(p,cylY(rad*0.5,sh,12),M.brass2,0,y,0);
    if(X){for(const q of[m,k])q.rotation.z=Math.PI/2;m.position.x=s*(r0+h/2);k.position.x=s*(r0-sh/2);sl.position.x=s*(r0+h-0.25);m.position.z=sl.position.z=k.position.z=t||0;}
    else{for(const q of[m,k])q.rotation.x=Math.PI/2;m.position.z=s*(r0+h/2);k.position.z=s*(r0-sh/2);sl.position.z=s*(r0+h-0.25);m.position.x=sl.position.x=k.position.x=t||0;}return p;};   /* one group: the screw's parts-list line goes on it */
  /* knurled lock nut: a body with 30 ridges, merged into one mesh */
  const knurl=(p,ax,s,r0,rad,h,bore)=>{const gs=[[bore?ringGeo(rad,bore,h):cylY(rad,h,48),new THREE.Matrix4()]];   /* bore: a nut's thread */for(let k=0;k<30;k++){const a=k/30*TAU;gs.push([new THREE.BoxGeometry(0.5,h,0.5),new THREE.Matrix4().makeTranslation(rad*Math.cos(a),0,rad*Math.sin(a))]);}
    const m=mesh(p,mergeGeo(gs),M.brass2,0,0,0);if(ax==='x'){m.rotation.z=Math.PI/2;m.position.x=s*(r0+h/2);}else{m.rotation.x=Math.PI/2;m.position.z=s*(r0+h/2);}return m;};
  /* gimbal ring: a flat brass band (Fig. 106), pivoted at 3 and 9 on two screws that come in through the box sides, each with a washer and lock nut.
     Slotted support straps on the ring carry the bushings for the gimbal pivot at 3 and the front case pivot at 6 (Fig. 94) */
  /* the case's sizes, from the movement it holds (movement.js): a recess round its top edge (DB) takes the mounting ring's flange, which sits on the shoulder at its foot (SH, outside the dial screws' heads under the flange); the
     dial lies in it, as it does when the movement is put upside down on the case to be started (Sec. III: "the dial carefully located in the shoulder recess around the top edge
     of the case"), and the bezel screws on outside the rim (TR). The rim's 105 across and the gimbal ring's 66-68 radius are from the top-view photographs (estimated); the
     rest estimated. YT the rim's top, YTB the thread's foot; FD the floor's inside depth, FR the floor's edge (the bowl's inside rounds into it with radius SH-FR) */
  const DB=MR_RO+0.05,SH=DB-0.9,CR=DB+1.5,TR=DB+4.5,YT=MR_Y+DIAL_T+0.6,YTB=5.2,FD=64,FR=38;
  /* NUT_R: the four pivots' knurled lock nuts (42121), r 8.5: KLUwI2UUCMQ 1:15, against the bezel in the frame (12.5 px/mm): one at least 16 mm across where it shows, deeper in the box;
     Fig. 106 draws all four as large discs and Sec. III calls the case rear one "the large, knurled lock nut". Until 4 October 2026 r 4.2 and 5. Their thickness (2.5) estimated */
  const RY=-20,RI=CR+16.5,RO=RI+2,NUT_R=8.5;
  const ring=hn(new THREE.Group(),'42106');ring.userData.partName='ring';ring.position.y=RY;root.add(ring);
  /* the band, with a slot at the front right (Fig. 106) that the latch lever passes through to the case: the band round the rest of the ring, the band above and
     below the slot, and the slot's two side walls */
  { const SL=0.045,pr=(a,b)=>[V2(RI,a),V2(RO,a),V2(RO,b),V2(RI,b),V2(RI,a)];mesh(ring,closeGeo(new THREE.LatheGeometry(pr(-7,7),158,LATCH_A+SL,TAU-2*SL)),M.brass);
    for(const[a,b]of[[-7,-2.2],[2.2,7]])mesh(ring,closeGeo(new THREE.LatheGeometry(pr(a,b),2,LATCH_A-SL,2*SL)),M.brass);
    for(const s of[1,-1]){const f=LATCH_A+s*SL,w=mesh(ring,new THREE.BoxGeometry(RO-RI,4.4,0.02),M.brass,(RI+RO)/2*Math.sin(f),0,(RI+RO)/2*Math.cos(f));w.rotation.y=f-Math.PI/2;} }
  /* the straps on the ring (Fig. 106): curved pieces of band on its outside, each held by two screws into the band (a turned band can't be holed across: drawn inside it) */
  const strap=(ax,s)=>{const f=ax==='x'?s*Math.PI/2:(s>0?0:Math.PI),w=11/RO,pr=[V2(RO,-8),V2(RO+1.2,-8),V2(RO+1.2,8),V2(RO,8),V2(RO,-8)];
    hn(mesh(ring,closeGeo(new THREE.LatheGeometry(pr,24,f-w,2*w)),M.brass2),ax==='x'?'42107':'42108');
    for(const t of[-7.5,7.5]){const g=new THREE.Group();g.rotation.y=t/RO;ring.add(g);hn(sHead(g,ax,s,RO+1.2,1.3,0.7,-4,0),ax==='x'?'42116.gs':'42116.cs');}};   /* each screw square to the band, where it lies */
  /* a boss on the ring or a strap, bored for its pivot bushing (42214) or its pivot screw's thread */
  const boss=(ax,s,r0,r1,rad,bore)=>{const m=mesh(ring,ringGeo(rad,bore,r1-r0),M.brass2,0,0,0);if(ax==='x'){m.rotation.z=Math.PI/2;m.position.x=s*(r0+r1)/2;}else{m.rotation.x=Math.PI/2;m.position.z=s*(r0+r1)/2;}return m;};
  const bush=(ax,s,r0,r1,id)=>{const m=hn(mesh(ring,ringGeo(1.4,0.82,r1-r0),M.steel,0,0,0),id);if(ax==='x'){m.rotation.z=Math.PI/2;m.position.x=s*(r0+r1)/2;}else{m.rotation.x=Math.PI/2;m.position.z=s*(r0+r1)/2;}};
  strap('x',1);hn(boss('x',1,RO+1.2,RO+3.2,3.2,1.4),'42107',{sub:1});bush('x',1,RO+1.2,RO+3.2,'42214.s');boss('x',-1,RO,RO+2.4,3.2,1.4);bush('x',-1,RO,RO+2.4,'42214.r');   /* the gimbal pivots' bushings: in the support strap at 3, in the ring at 9 */
  const gp=new THREE.Group();gp.userData.partName='ring';hn(gp,'42106',{sub:1});gp.position.y=RY;root.add(gp);
  /* each gimbal ring pivot screw (Fig. 106): in through the box side, a washer under its head outside (its thickness sets the ring's freedom, Op. 104) and the lock nut
     inside against the wall; its point (r 0.8) runs in the bushing, its shoulder just clear of it */
  for(const sx of[1,-1]){const r0=sx>0?RO+3.2:RO+2.4,sh=hn(mesh(gp,cylY(1.6,W+0.8-(r0+0.05),12),M.steel,sx*(r0+0.05+W+0.8)/2,0,0),'42120',{sub:1});sh.rotation.z=Math.PI/2;
    const pt=hn(mesh(gp,cylY(0.8,1.85,12),M.steel,sx*(r0+0.05-0.925),0,0),'42120',{sub:1});pt.rotation.z=Math.PI/2;
    const ws=hn(mesh(gp,ringGeo(5.5,1.62,0.8),M.brass2,sx*(W+0.4),0,0),'42122');ws.rotation.z=Math.PI/2;const g=new THREE.Group();gp.add(g);hn(knurl(g,'x',-sx,-(W-T),NUT_R,2.5,1.62),'42121.g');hn(sHead(gp,'x',sx,W+0.8,3.6,2.2,0,0,0.05),'42120');}
  /* gimbal latch at the front right (Figs. 1, 8, 106): the support bracket in the corner of the box, held by two screws from outside with washers; the lever turns on the
     knurled clamping screw, which goes down through the clamping bracket and the lever into the support bracket, so tightening it clamps the lever; the take-up spring,
     screwed to the support bracket, presses up on a collar under the lever to take up its play. Released, the lever lies along the right wall; latched, it swings in 45°
     through the slot in the ring to the keeper on the case, locking both. Knurled handle on the lever. Sizes estimated */
  const lat=new THREE.Group();lat.userData.partName='latch';root.add(lat);const LP=W-T-9,LY=RY+0.6,BY=RY-2.2;   /* LY: the lever's middle; the support bracket's top at BY+1.5 */
  const vScrew=(p,x,z,y,r,h,len,id)=>{const g=hn(new THREE.Group(),id);p.add(g);g.userData.sc={r,h,len,rs:r*0.5};mesh(g,cylY(r,h,20),M.brass2,x,y+h/2,z);mesh(g,new THREE.BoxGeometry(r*2.02,0.3,r*0.35),M.steelD,x,y+h-0.1,z);mesh(g,cylY(r*0.5,len,12),M.brass2,x,y-len/2,z);g.userData.axis=g.children[2];return g;};   /* a screw put in from above: head from y up, shank len down */
  { const bt=BY+1.5,bp=[[LP-3.5,LP-3.5],[W-T,LP-3.5],[W-T,W-T],[LP-3.5,W-T]];
    hn(mesh(lat,polyGeo(bp,3,[hT(LP,LP,1.8),hT(LP+4.2,LP,0.5),hT(LP+5.6,LP,0.5)]),M.brass2,0,BY-1.5,0),'42109');   /* tapped for the clamping screw and the take-up spring's screws */
    for(const[ax,t]of/** @type {[string,number][]} */([['x',LP+2.5],['z',LP+2.5]])){hn(sHead(lat,ax,1,W+0.4,1.1,0.6,BY,t,T+2.4),'42115');const w=hn(mesh(lat,ringGeo(1.6,0.62,0.4),M.brass2,ax==='x'?W+0.2:t,BY,ax==='x'?t:W+0.2),'42123');if(ax==='x')w.rotation.z=Math.PI/2;else w.rotation.x=Math.PI/2;}   /* through the box wall (drawn without a hole) into the bracket */
    hn(mesh(lat,polyGeo(stadiumPts([LP+1.6,LP],[LP+6.3,LP],1.2),0.3,[hC(LP+4.2,LP,0.5),hC(LP+5.6,LP,0.5)]),M.blued,0,bt,0),'42277');   /* the take-up spring, its free end under the lever's collar */
    for(const x of[LP+4.2,LP+5.6])vScrew(lat,x,LP,bt+0.3,0.5,0.35,0.3+1.5,'42276');
    const ct=LY+0.7+0.6;hn(mesh(lat,polyGeo([[LP-2.2,LP-2.2],[LP+2.2,LP-2.2],[LP+3.2,LP+2.2],[LP+2.2,LP+3.2],[LP-2.2,LP+2.2]],0.6,[hC(LP,LP,1.8)]),M.brass2,0,ct,0),'42110');   /* the clamping bracket on the lever's boss */
    hn(cylBetween(lat,0.6,bt,ct,M.brass2,LP+2.5,LP+2.5),'42110',{sub:1});   /* its leg down to the support bracket, which keeps it from turning */
    const cs=hn(new THREE.Group(),'42114');lat.add(cs);cs.userData.sc={r:1.8,h:1.5,len:ct+0.6-(bt-2.5),rs:0.9};const kg=new THREE.Group();kg.position.set(LP,ct+0.6,LP);kg.rotation.x=-Math.PI/2;cs.add(kg);knurl(kg,'z',1,0,8.5,5);   /* the clamping screw's knurled head, r 8.5 (KLUwI2UUCMQ 1:15, against the bezel: 17-20 mm across, nearer the camera; Fig. 1 and Fig. 106 item 17 a large disc on a post); r 2.0 until 4 October 2026; its thickness (5) estimated */
    cs.userData.axis=cylBetween(cs,0.9,bt-2.5,ct+0.6,M.steel,LP,LP); }   /* the clamping screw: knurled head on the clamping bracket, its shank the lever's pivot, 2.5 into the support bracket */
  const lv=hn(new THREE.Group(),'42111');lv.position.set(LP,LY,LP);lv.rotation.y=LATCH_OFF;lat.add(lv);
  { const len=Math.SQRT2*LP-(CR+0.3);mesh(lv,polyGeo([[-1.5,-1.5],[len,-1.5],[len,1.5],[-1.5,1.5]],1.4,[[0,0,0.95]]),M.brass,0,-0.7,0);mesh(lv,ringGeo(1.3,0.95,0.6),M.brass,0,1.0,0);mesh(lv,ringGeo(1.3,0.95,0.3),M.brass,0,-0.85,0);   /* the lever, bored for the clamping screw, with a boss above and a collar below */
    hn(cylBetween(lv,1.2,0.7,5.5,M.brass2,6,0),'42112',{sub:1});const kn=hn(new THREE.Group(),'42112');kn.position.set(6,5.5,0);kn.rotation.x=-Math.PI/2;lv.add(kn);knurl(kn,'z',1,0,2.6,2.2);   /* knob on a post, its axis upright */ }
  /* case (bowl) pivoted in the ring at 6 and 12 (Figs. 94, 106, 107): a support bracket on the case at each, shaped to the case, with a bushing (drawn in it) its pivot
     screw's point runs in; each pivot screw is threaded through the ring (and at 6 the case support strap) and locked by a knurled nut against it (Sec. III) */
  const bowl=new THREE.Group();bowl.userData.partName='bowl';ring.add(bowl);
  for(const sz of[1,-1]){const bs=new THREE.Shape();bs.moveTo(-7,-7);bs.lineTo(7,-7);bs.lineTo(7,5);bs.lineTo(-7,5);bs.closePath();for(const[x,y,r]of[[0,0,1.4],[-4.5,-4.5,0.66],[4.5,-4.5,0.66]]){const h=new THREE.Path();h.absarc(x,y,r,0,TAU,true);bs.holes.push(h);}
    const bm=hn(mesh(bowl,extrude(bs,{depth:6.5,bevelEnabled:false,curveSegments:24}),M.brass2,0,0,sz*CR),'42105');if(sz<0)bm.rotation.y=Math.PI;   /* its back flat on the case, bored for the bushing and its two screws */
    for(const t of[-4.5,4.5])hn(sHead(bowl,'z',sz,CR+6.5,1.2,0.6,-4.5,t,7.8),'42117');   /* through the bracket into the case's wall (drawn without a hole) */
    const b=hn(mesh(bowl,ringGeo(1.4,0.82,2.5),M.steel,0,0,sz*(CR+5.25)),'42214.c');b.rotation.x=Math.PI/2;   /* pressed into the bracket's outer end */
    const rE=sz>0?RO+3.2:RO+2.4,sh=hn(mesh(ring,cylY(1.6,rE-(CR+6.55),12),M.steel,0,0,sz*(rE+CR+6.55)/2),sz>0?'42119':'42118',{sub:1});sh.rotation.x=Math.PI/2;
    const pt=hn(mesh(ring,cylY(0.8,2.05,12),M.steel,0,0,sz*(CR+6.55-1.025)),sz>0?'42119':'42118',{sub:1});pt.rotation.x=Math.PI/2;}   /* the shank through the ring to its shoulder, 0.05 off the bushing, and its point in it */
  strap('z',1);hn(boss('z',1,RO+1.2,RO+3.2,3.2,1.6),'42108',{sub:1});{const g=new THREE.Group();ring.add(g);hn(knurl(g,'z',1,RO+3.2,NUT_R,2.5,1.62),'42121.cf');}hn(sHead(ring,'z',1,RO+5.7,3.4,2,0),'42119');
  boss('z',-1,RO,RO+2.4,3.2,1.6);{const g=new THREE.Group();ring.add(g);hn(knurl(g,'z',-1,RO+2.4,NUT_R,2.5,1.62),'42121.cr');}hn(sHead(ring,'z',-1,RO+4.9,3.4,2,0),'42118');
  /* latch keeper on the case, facing the latch through the ring's slot: a back on a separating washer (42128) against the wall, held by its screw (42116) from inside the
     case, and two cheeks, the lever's tip between them against the back when latched */
  { const kp=hn(new THREE.Group(),'42113');kp.position.set(0,0,0);kp.rotation.y=LATCH_A-Math.PI/2;bowl.add(kp);
    mesh(kp,new THREE.BoxGeometry(0.6,4,6),M.brass2,CR+0.6,0,0);for(const s of[1,-1])mesh(kp,new THREE.BoxGeometry(2,4,1.3),M.brass2,CR+1.4,0,s*2.35);
    hn(mesh(kp,ringGeo(1.4,0.5,0.3),M.brass2,CR+0.15,0,0),'42128').rotation.z=Math.PI/2;
    hn(sHead(kp,'x',-1,-SH,0.9,0.6,0,0,CR-SH+0.8),'42116.k'); }
  const KH=2.3,fu=L.Fu,BT=1;   /* key hole through the flat bottom at the fusee axis (Fig. 7). The bottom is BT thick (inside face at -FD, outside at -FD-BT), the wall CR-DB; both
     solids. The shield plate under the bottom sits a full millimetre behind the floor seen from inside: at 0.05 mm its outline showed through the floor (depth precision) */
  let bot;   /* the case's bottom: rebuilt below with the shield plate's screw holes */
  const botG=hs=>{const bs=new THREE.Shape();bs.absarc(0,0,FR,0,TAU,false);for(const[x,z,r]of[[fu[0],fu[1],KH],...hs]){const h=new THREE.Path();h.absarc(x,-z,r,0,TAU,true);bs.holes.push(h);}const fl=extrude(bs,{depth:BT,bevelEnabled:false,curveSegments:60});fl.rotateX(-Math.PI/2);return fl;};
  /* the bottom's outside (KLUwI2UUCMQ 47:35, the case from below, nearly face-on): a flat annulus out to an edge rounded about 1.6 mm (RF), a raised ring at r 33.5-36 round a recess
     the shield plate fills (0.728 and 0.676 of the outer edge, read across the centre; the case's outside taken as CR). Until 4 October 2026 the bottom curved into the wall on r 11.5 */
  { const YS=MR_FL,RF=1.6,FRo=CR-RF,arc=(r,cy,a0,a1,c0=FR)=>{const o=[];for(let i=0;i<=12;i++){const a=a0+(a1-a0)*i/12;o.push(V2(c0+r*Math.sin(a),cy-r*Math.cos(a)));}return o;};
    /* the wall's section below the recess, one closed outline: inside face up from the floor's edge to the shoulder, out to the outside face and down it to the bottom's outside face */
    const pr=[...arc(SH-FR,-FD+SH-FR,0,Math.PI/2),V2(SH,YS),V2(CR,YS),...arc(RF,-FD-BT+RF,Math.PI/2,0,FRo),V2(FR,-FD-BT),V2(FR,-FD)];
    hn(mesh(bowl,new THREE.LatheGeometry(pr.reverse(),120),M.brass),'42101');   /* one front-facing solid: its inside face faces in (a double-sided sheet had its shadow normalBias pushed the wrong way: speckled floor) */
    bot=hn(mesh(bowl,botG([]),M.brass,0,-FD-BT,0),'42101',{sub:1});hn(mesh(bowl,ringGeo(36,33.5,0.5+0.8),M.brass,0,-FD-BT-(0.5+0.8)/2,0),'42101',{sub:1});   /* the raised ring round the shield plate, its face flush with the plate's (the height estimated) */   /* 60: the rim's 120 points, the lathe's own */
    /* the recess's wall, slotted at 12 o'clock down to the shoulder for the movement's alignment pin (Sec. III), so the pin goes in as the movement is lowered: below the
       thread, and the rim with the band outside it the bezel screws onto */
    const w=0.75/DB,a0=-Math.PI/2,bore=[...Array(121).keys()].map(k=>{const a=a0+w+(TAU-2*w)*k/120;return[DB*Math.cos(a),DB*Math.sin(a)];}),circ=r=>[...Array(120).keys()].map(k=>{const a=k/120*TAU;return[r*Math.sin(a),r*Math.cos(a)];});
    bore.push([-0.75,-(MR_RO+1.0)],[0.75,-(MR_RO+1.0)]);
    hn(mesh(bowl,polyGeo(circ(CR),YTB-YS,[{pts:bore}]),M.brass,0,YS,0),'42101',{sub:1});hn(mesh(bowl,polyGeo(circ(TR),YT-YTB,[{pts:bore}]),M.brass,0,YTB,0),'42101',{sub:1}); }
  /* winding-hole shield plate (42104; Fig. 107 and its parts list, the case's description, Sec. III and Fig. 7): a disc nearly the size of the case's flat bottom, turning on its
     shoulder screw (42124) at the case's centre. Its hole, as far out as the case's key hole, lines up with it when the plate is turned clockwise (seen from below); let go, the
     return spring (42126) turns it back: an open ring of wire between the plate and the bottom, its hooked end round the stop screw (42125), which goes up through the plate and
     the hook into the bottom, its other end turned in to a pin in the plate. Fig. 107 draws the plate's three holes (the shoulder's at its centre, the key's, the stop screw's on
     the other side) and the ring with its two ends. Estimated: the sizes, the half-radian turn, and the stop screw's hole an arc slot whose ends set the rest and open places
     (Fig. 107 draws it round; the parts list names no other stop). shield.rotation.y = 0 open, SH_REST closed */
  const SH_REST=-0.5,KD=Math.hypot(fu[0],fu[1]),ah=Math.atan2(fu[1],fu[0]),as=ah+Math.PI,SR=33.3,RS=17,SW=0.8,PT=0.8,GAP=0.5,YO=-FD-BT,Y0=YO-GAP,YB=Y0-PT,YH=YB-0.05,WR=0.18,PR=4.5,PA=as+4.6;
  const shield=hn(new THREE.Group(),'42104');shield.position.set(0,Y0,0);bowl.add(shield);shield.userData.partName='bowl';
  const at=(r,a)=>[r*Math.cos(a),r*Math.sin(a)];   /* a: the angle in the xz plane, atan2(z, x); a plate point at a stands at a - rotation.y in the case */
  {const sh=new THREE.Shape();sh.absarc(0,0,SR,0,TAU,false);const hole=(c,r)=>{const p=new THREE.Path();p.absarc(c[0],c[1],r,0,TAU,true);sh.holes.push(p);};hole(at(KD,ah),KH);hole([0,0],1.55);
    {const sp=[],N=24,sg=Math.sign(SH_REST),cap=(a,t0)=>{const c=at(RS,a);for(let i=1;i<N/2;i++){const t=t0+sg*i/(N/2)*Math.PI;sp.push([c[0]+SW*Math.cos(t),c[1]+SW*Math.sin(t)]);}};   /* arc slot for the stop screw, round-ended */
      for(let i=0;i<=N;i++)sp.push(at(RS+SW,as+SH_REST*i/N));cap(as+SH_REST,as+SH_REST);for(let i=N;i>=0;i--)sp.push(at(RS-SW,as+SH_REST*i/N));cap(as,as+Math.PI);
      sh.holes.push(new THREE.Path(sp.map(q=>new THREE.Vector2(q[0],q[1]))));}
    const pg=extrude(sh,{depth:PT,bevelEnabled:false,curveSegments:48});pg.rotateX(Math.PI/2);   /* rotateX(+90): (x,y,z) -> (x,-z,y), so the outline's y is world z and the plate hangs from Y0 */
    mesh(shield,pg,M.brass2);const q=at(PR,PA);hn(mesh(shield,cylY(0.35,0.9,10),M.steel,q[0],-0.05,q[1]),'42126',{sub:1}); }   /* the spring's pin, pressed into the plate, standing up into the gap */
  /* fixed to the case: shoulder screw (its shoulder from the bottom through the plate, slotted head under it) and stop screw (shank through the plate's slot and the spring's hook) */
  const yScrew=(x,z,rs,rh,hh,rt)=>{const g=new THREE.Group();bowl.add(g);mesh(g,cylY(rs,YO-YH,16),M.steel,x,(YO+YH)/2,z);mesh(g,cylY(rh,hh,24),M.steel,x,YH-hh/2,z);const sl=mesh(g,new THREE.BoxGeometry(rh*2.02,0.6,rh*0.35),M.steelD,x,YH-hh+0.25,z);sl.rotation.y=0.6;
    g.userData.axis=mesh(g,cylY(rt,BT+0.1,12),M.steel,x,YO+BT/2-0.05,z);return g;};   /* rt: its thread, up through the case's bottom (tapped), from 0.1 inside the shoulder (not flush with the bottom's face) */
  hn(yScrew(0,0,1.5,2.8,0.8,1.0),'42124');
  const ss=at(RS,as);hn(yScrew(ss[0],ss[1],0.7,1.3,0.8,0.5),'42125');
  bot.geometry.dispose();bot.geometry=botG([[0,0,1.02],[ss[0],ss[1],0.52]]);
  /* the return spring, in the case's frame: a hook round the stop screw, the ring (r RS-0.92) round the long way to the plate's pin, and its end turned in to the pin. It is
     built for the plate's turn and rebuilt in place (reclose) when it turns (shield.userData.turn, which app.js calls), so the hook stays on the screw and the end on the pin */
  { const ys=YO-GAP/2,ring=RS-0.92,V=(r,a)=>new THREE.Vector3(r*Math.cos(a),ys,r*Math.sin(a));
    const geo=(rot,old)=>{const pe=PA-rot,P=[],hc=new THREE.Vector3(ss[0],ys,ss[1]);
      for(let i=0;i<=8;i++){const t=as-Math.PI/2+(Math.PI/2+Math.PI)*i/8;P.push(hc.clone().add(new THREE.Vector3(0.92*Math.cos(t),0,0.92*Math.sin(t))));}   /* the hook, three quarters round the screw, ending on the ring */
      const n=Math.max(8,Math.round((pe-as)/0.08));for(let i=1;i<=n;i++)P.push(V(ring,as+(pe-as)*i/n));
      for(let i=1;i<=6;i++)P.push(V(ring-(ring-PR-0.35-WR)*i/6,pe));   /* the end turned in, to the pin */
      return reclose(old,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P,false,'centripetal'),P.length*3,WR,6,false));};
    const sp=hn(mesh(bowl,geo(SH_REST,null),M.steel),'42126');let last=SH_REST;
    shield.userData.turn=r=>{shield.rotation.y=r;if(Math.abs(r-last)>1e-4){last=r;sp.geometry=geo(r,sp.geometry);}}; }
  shield.userData.turn(SH_REST);shield.userData.hole={p:at(KD,ah),c:fu,r:KH,rest:SH_REST};   /* for bom.py's check: the plate's hole (plate frame), the case's (case frame) */
  /* the bezel (42102), screwed onto the rim, rising to hold the crystal (42103) in a groove clear of the hands' square; its section estimated */
  const YC=MR_Y+5.6,BL=DIAL_R-1.6,GR=DIAL_R+0.1,bz=hn(mesh(bowl,new THREE.LatheGeometry([V2(TR,YTB),V2(TR+1.8,YTB),V2(TR+1.8,YT+1.2),V2(DB+0.9,YC+1.4),V2(BL,YC+1.4),V2(BL,YC+0.8),V2(GR,YC+0.8),V2(GR,YC),V2(BL,YC),V2(BL,YC-0.5),V2(DB+0.1,YC-0.5),V2(DB+0.1,YT),V2(TR,YT),V2(TR,YTB)],128),M.brass),'42102');
  const gl=hn(mesh(bowl,new THREE.CylinderGeometry(GR,GR,0.8,96),M.glass,0,YC+0.4,0),'42103');gl.renderOrder=5;bz.userData.bezel=gl.userData.bezel=true;   /* the bezel with its crystal, taken off to set the hands with the key (app.js) */
  /* lids hinged at the back */
  /* glass lid hinged to the back of the box; the outer lid hinged to the back-top edge of the glass lid, so it opens on its own and never swings through the glass lid */
  const mid=new THREE.Group(),top=new THREE.Group();mid.userData.partName='lidGlass';top.userData.partName='lid';mid.position.set(0,0,-W);top.position.set(0,38,0);root.add(mid);mid.add(top);
  const lidBody=(p,y0,h,glass)=>{
    if(glass){const fw=26;wood(2*W,h,fw,0,y0+h/2,2*W-fw/2,p);wood(2*W,h,fw,0,y0+h/2,fw/2,p);wood(fw,h,2*W-2*fw,W-fw/2,y0+h/2,W,p);wood(fw,h,2*W-2*fw,-W+fw/2,y0+h/2,W,p);
      const g=mesh(p,new THREE.BoxGeometry(2*W-2*fw,0.8,2*W-2*fw),M.glass,0,y0+h-3,W);g.renderOrder=6;}
    else{wood(2*W,h,2*W,0,y0+h/2,W,p);mesh(p,new THREE.BoxGeometry(70,0.8,26),M.brass,0,y0+h+0.4,W+50);mesh(p,new THREE.BoxGeometry(14,18,1.2),M.brass,0,y0+h/2,2*W+0.6);}
    for(const sx of[1,-1])for(const sz of[0,2*W])brassCorner(p,sx*W,y0+h/2,sz,h,W);
  };
  lidBody(mid,0,38,true);lidBody(top,0,38,false);
  for(const sx of[1,-1]){const h=mesh(root,cylY(2.6,30,14),M.brass,sx*55,0,-W-2);h.rotation.z=Math.PI/2;const h2=mesh(mid,cylY(2.6,30,14),M.brass,sx*55,38,-2);h2.rotation.z=Math.PI/2;}
  return{root,ring,bowl,mid,top,shield,shRest:SH_REST,latch:lv,RO,CR};
}
function shadowTex(){const cv=document.createElement('canvas');cv.width=cv.height=256;const x=cv.getContext('2d');const g=x.createRadialGradient(128,128,20,128,128,128);g.addColorStop(0,'rgba(0,0,0,0.42)');g.addColorStop(0.6,'rgba(0,0,0,0.16)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,256,256);return new THREE.CanvasTexture(cv);}

