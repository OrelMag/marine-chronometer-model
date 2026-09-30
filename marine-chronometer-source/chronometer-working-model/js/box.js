/* box.js: mounting box (glass lid hinged to the box, outer lid hinged to the glass lid), gimbal ring, case, winding key
   Part of 'The Marine Chronometer, working' (three.js r128). See README.md. */

/* ================= box, bowl, gimbals ================= */
/* the latch: the ring's slot and the case's keeper face the front right corner (LatheGeometry angle, from +z toward +x); the lever turns on its pin
   from LATCH_OFF (along the right wall) to LATCH_ON (toward the centre) */
const LATCH_A=Math.PI/4,LATCH_OFF=Math.PI/2,LATCH_ON=Math.PI*3/4;
function buildBox(M){
  const root=new THREE.Group();root.userData.partName='box';const W=98.5,T=10,yF=-100,H0=100;
  const wood=(w,h,d,x,y,z,p=root,m=M.wood)=>mesh(p,new THREE.BoxGeometry(w,h,d),m,x,y,z);
  wood(2*W,T,2*W,0,yF+T/2,0);
  wood(2*W,H0,T,0,yF+H0/2,W-T/2);wood(2*W,H0,T,0,yF+H0/2,-W+T/2);
  wood(T,H0,2*W-2*T,W-T/2,yF+H0/2,0);wood(T,H0,2*W-2*T,-W+T/2,yF+H0/2,0);
  wood(2*W-2*T,1,2*W-2*T,0,yF+T+0.5,0,root,M.felt);
  const brassCorner=(p,x,y,z,h,cz=0)=>{const sx=Math.sign(x),sz=Math.sign(z-cz);mesh(p,new THREE.BoxGeometry(12,h,1.2),M.brass,x-sx*5.4,y,z+sz*0.6);mesh(p,new THREE.BoxGeometry(1.2,h,12),M.brass,x+sx*0.6,y,z-sz*5.4);};
  for(const sx of[1,-1])for(const sz of[1,-1]){brassCorner(root,sx*W,yF+H0/2,sz*W,H0);}
  for(const sx of[1,-1]){const hp=mesh(root,new THREE.BoxGeometry(1.2,22,52),M.brass,sx*(W+0.6),-38,0);
    const hd=new THREE.Mesh(new THREE.TorusGeometry(20,2.2,10,32,Math.PI),M.brass);hd.rotation.set(Math.PI,Math.PI/2,0);hd.position.set(sx*(W+3),-34,0);root.add(hd);}
  /* winding key standing in a socket on a corner block at the back right (Fig. 1), low enough for the lids to close */
  const KX=W-T-12;wood(24,59,24,KX,yF+T+30.5,-KX,root,M.woodEdge);   /* stands on the felt */mesh(root,cylY(4.2,4,20),M.brass2,KX,yF+T+62,-KX);
  const key=new THREE.Group();key.userData.partName='key';key.position.set(KX,-26,-KX);root.add(key);key.rotation.y=Math.PI/4;
  mesh(key,cylY(2.2,20,16),M.brass,0,10,0);
  const kt=mesh(key,new THREE.CylinderGeometry(3,3,20,20),M.brass,0,21,0);kt.rotation.x=Math.PI/2;for(const sz of[10,-10])mesh(key,new THREE.SphereGeometry(3,20,12),M.brass,0,21,sz);mesh(key,new THREE.SphereGeometry(4.2,20,14),M.brass,0,21,0);
  const V2=(a,b)=>new THREE.Vector2(a,b);
  /* slotted screw along an axis: 'x' or 'z', outward sign s, head from r0 to r0+h, and its shank (half the head's radius) sh mm back into the part under it */
  const sHead=(p,ax,s,r0,rad,h,y,t,sh=2.5)=>{const X=ax==='x',m=mesh(p,cylY(rad,h,20),M.brass2,0,y,0),sl=mesh(p,X?new THREE.BoxGeometry(0.6,rad*2.02,rad*0.35):new THREE.BoxGeometry(rad*0.35,rad*2.02,0.6),M.steelD,0,y,0),k=mesh(p,cylY(rad*0.5,sh,12),M.brass2,0,y,0);
    if(X){for(const q of[m,k])q.rotation.z=Math.PI/2;m.position.x=s*(r0+h/2);k.position.x=s*(r0-sh/2);sl.position.x=s*(r0+h-0.25);m.position.z=sl.position.z=k.position.z=t||0;}
    else{for(const q of[m,k])q.rotation.x=Math.PI/2;m.position.z=s*(r0+h/2);k.position.z=s*(r0-sh/2);sl.position.z=s*(r0+h-0.25);m.position.x=sl.position.x=k.position.x=t||0;}};
  /* knurled lock nut: a body with 30 ridges, merged into one mesh */
  const knurl=(p,ax,s,r0,rad,h)=>{const gs=[[cylY(rad,h,48),new THREE.Matrix4()]];for(let k=0;k<30;k++){const a=k/30*TAU;gs.push([new THREE.BoxGeometry(0.5,h,0.5),new THREE.Matrix4().makeTranslation(rad*Math.cos(a),0,rad*Math.sin(a))]);}
    const m=mesh(p,mergeGeo(gs),M.brass2,0,0,0);if(ax==='x'){m.rotation.z=Math.PI/2;m.position.x=s*(r0+h/2);}else{m.rotation.x=Math.PI/2;m.position.z=s*(r0+h/2);}};
  /* gimbal ring: a flat brass band (Fig. 106), pivoted at 3 and 9 on two screws that come in through the box sides, each with a washer and lock nut.
     Slotted support straps on the ring carry the bushings for the gimbal pivot at 3 and the front case pivot at 6 (Fig. 94) */
  const RY=-20,RI=80,RO=82;
  const ring=new THREE.Group();ring.userData.partName='ring';ring.position.y=RY;root.add(ring);
  /* the band, with a slot at the front right (Fig. 106) that the latch lever passes through to the case: the band round the rest of the ring, the band above and
     below the slot, and the slot's two side walls */
  { const SL=0.045,pr=(a,b)=>[V2(RI,a),V2(RO,a),V2(RO,b),V2(RI,b),V2(RI,a)];mesh(ring,new THREE.LatheGeometry(pr(-7,7),158,LATCH_A+SL,TAU-2*SL),M.brass);
    for(const[a,b]of[[-7,-2.2],[2.2,7]])mesh(ring,new THREE.LatheGeometry(pr(a,b),2,LATCH_A-SL,2*SL),M.brass);
    for(const s of[1,-1]){const f=LATCH_A+s*SL,w=mesh(ring,new THREE.BoxGeometry(RO-RI,4.4,0.02),M.brass,(RI+RO)/2*Math.sin(f),0,(RI+RO)/2*Math.cos(f));w.rotation.y=f-Math.PI/2;} }
  const strap=(ax,s)=>{const b=mesh(ring,ax==='x'?new THREE.BoxGeometry(1.2,16,22):new THREE.BoxGeometry(22,16,1.2),M.brass2,ax==='x'?s*(RO+0.6):0,0,ax==='z'?s*(RO+0.6):0);
    for(const t of[-7.5,7.5])sHead(ring,ax,s,RO+1.2,1.3,0.7,-4,t);};
  const boss=(ax,s,r0,r1,rad)=>{const m=mesh(ring,cylY(rad,r1-r0,20),M.brass2,0,0,0);if(ax==='x'){m.rotation.z=Math.PI/2;m.position.x=s*(r0+r1)/2;}else{m.rotation.x=Math.PI/2;m.position.z=s*(r0+r1)/2;}};
  strap('x',1);boss('x',1,RO+1.2,RO+3.2,3.2);boss('x',-1,RO,RO+2.4,3.2);
  const gp=new THREE.Group();gp.userData.partName='ring';gp.position.y=RY;root.add(gp);
  /* each gimbal pivot screw: washer between ring and box (its thickness sets the ring's freedom, Sec. VIII Op. 105), lock nut outside */
  for(const sx of[1,-1]){const r0=sx>0?RO+3.2:RO+2.4,sh=mesh(gp,cylY(1.6,W+2-r0,12),M.steel,sx*(r0+W+2)/2,0,0);sh.rotation.z=Math.PI/2;
    const ws=mesh(gp,cylY(5.5,0.8,24),M.brass2,sx*(W-T-0.4),0,0);ws.rotation.z=Math.PI/2;const g=new THREE.Group();gp.add(g);knurl(g,'x',sx,W,4.2,2);sHead(gp,'x',sx,W+2,3.6,2.2,0);}
  /* gimbal latch at the front right (Figs. 1, 8, 106): a support bracket in the corner of the box, and a lever on a pin in it, at the height of the ring's pivots.
     Released, the lever lies along the right wall; latched, it swings in 45° through the slot in the ring to the keeper on the case, locking both. Knurled handle
     on the lever. The take-up spring and clamping screw are left out */
  const lat=new THREE.Group();lat.userData.partName='latch';root.add(lat);const LP=W-T-8.5;
  mesh(lat,new THREE.BoxGeometry(12,3,12),M.brass2,LP+2.5,RY-2.2,LP+2.5);sHead(lat,'x',1,W,1.1,0.6,RY-2.2,LP+2.5);sHead(lat,'z',1,W,1.1,0.6,RY-2.2,LP+2.5);   /* its two screws come in from outside the box (Fig. 106) */
  cylBetween(lat,0.9,RY-3.4,RY+0.9,M.steel,LP,LP);   /* the lever's pin, from inside the bracket up into the cap on the lever */
  const lv=new THREE.Group();lv.position.set(LP,RY,LP);lv.rotation.y=LATCH_OFF;lat.add(lv);
  { const len=Math.SQRT2*LP-65.3;mesh(lv,new THREE.BoxGeometry(len+2,1.4,3),M.brass,len/2-1,0,0);cylBetween(lv,1.3,0.7,1.3,M.steel,0,0,20);
    cylBetween(lv,1.2,0.7,5.5,M.brass2,6,0);const kn=new THREE.Group();kn.position.set(6,5.5,0);kn.rotation.x=-Math.PI/2;lv.add(kn);knurl(kn,'z',1,0,2.6,2.2);   /* knob on a post, its axis upright */ }
  /* case (bowl) pivoted in the ring at 6 and 12: support brackets on the case, pivot screws through the ring, each with a knurled lock nut (Figs. 94, 106, 107) */
  const bowl=new THREE.Group();bowl.userData.partName='bowl';ring.add(bowl);
  for(const sz of[1,-1]){mesh(bowl,new THREE.BoxGeometry(14,12,8),M.brass2,0,-1,sz*67.5);for(const t of[-4.5,4.5])sHead(bowl,'z',sz,71.5,1.2,0.6,-4.5,t);
    const sh=mesh(ring,cylY(1.6,RO-69,12),M.steel,0,0,sz*(RO+69)/2);sh.rotation.x=Math.PI/2;}
  strap('z',1);boss('z',1,RO+1.2,RO+3.2,3.2);{const g=new THREE.Group();ring.add(g);knurl(g,'z',1,RO+3.2,5,2.5);}sHead(ring,'z',1,RO+5.7,3.4,2,0);
  boss('z',-1,RO,RO+2.4,3.2);{const g=new THREE.Group();ring.add(g);knurl(g,'z',-1,RO+2.4,5,2.5);}sHead(ring,'z',-1,RO+4.9,3.4,2,0);
  /* latch keeper on the case, facing the latch through the ring's slot: a back on the wall and two cheeks, the lever's tip between them when latched */
  { const kp=new THREE.Group();kp.position.set(0,0,0);kp.rotation.y=LATCH_A-Math.PI/2;bowl.add(kp);
    mesh(kp,new THREE.BoxGeometry(1.1,4,6),M.brass2,64.55,0,0);for(const s of[1,-1])mesh(kp,new THREE.BoxGeometry(2,4,1.3),M.brass2,66.1,0,s*2.35); }
  const bp=[V2(0.01,-66)];for(let i=0;i<=12;i++){const a=i/12*Math.PI/2;bp.push(V2(44+20*Math.sin(a),-46-20*Math.cos(a)));}bp.push(V2(64,6),V2(66.5,6),V2(66.5,8.5),V2(62,8.5));
  const KH=2.3,fu=L.Fu,BT=1;   /* key hole through the flat bottom at the fusee axis (Fig. 7). The wall is a zero-thickness sheet; the bottom is BT thick (inside face at -66, outside at -66-BT, chamfered into the wall),
     so the shield plate under it sits a full millimetre behind the floor seen from inside: at 0.05 mm its outline showed through the floor (depth precision) */
  const botG=(r,hz)=>{const bs=new THREE.Shape();bs.absarc(0,0,r,0,TAU,false);const h=new THREE.Path();h.absarc(fu[0],hz,KH,0,TAU,true);bs.holes.push(h);return new THREE.ShapeGeometry(bs,60);};   /* 60 gives the rim 120 points, the lathe's own vertices: other counts leave slivers open along the seam */
  mesh(bowl,botG(44,-fu[1]).rotateX(-Math.PI/2),M.brass,0,-66,0);mesh(bowl,botG(43.2,fu[1]).rotateX(Math.PI/2),M.brass,0,-66-BT,0);
  mesh(bowl,new THREE.LatheGeometry([V2(KH,-66),V2(KH,-66-BT)],32),M.brass,fu[0],0,fu[1]);   /* the key hole's wall, facing the hole */
  const bp1=bp.slice(1);mesh(bowl,new THREE.LatheGeometry([V2(43.2,-66-BT),...bp1],120),M.brass);mesh(bowl,new THREE.LatheGeometry(bp1.slice().reverse(),120),M.brass); /* inner face is its own front-facing shell: a back face gets its shadow normalBias pushed the wrong way (speckled floor) */
  /* winding-hole shield plate (the manual's case description and winding instructions, and its parts list: plate, shoulder screw, stop screw, return spring; its shape is estimated): a plate turning on a shoulder screw beside the hole.
     At rest its solid part covers the case's hole; turned clockwise (seen from below) through 0.75 rad its own hole lines up with it. The stop screw runs in an arc slot in the plate, whose ends set both positions,
     and a torsion spring on the shoulder (one leg on the stop screw, one on a pin in the plate) turns it back. Everything hangs 0.05 mm clear of the bottom's outside face. shield.rotation.y = 0 open, SH_REST closed */
  const SH_D=9,SH_REST=-0.75,SH_A=Math.atan2(-1,0.3),pv=[fu[0]+SH_D*Math.cos(SH_A),fu[1]+SH_D*Math.sin(SH_A)],Y0=-66-BT-0.05,PT=0.8,YB=Y0-PT,YH=YB-1.1,RS=4.5,SW=0.8;
  const shield=new THREE.Group();shield.position.set(pv[0],Y0,pv[1]);bowl.add(shield);shield.userData.partName='bowl';
  const ah=Math.atan2(fu[1]-pv[1],fu[0]-pv[0]),at=(r,a)=>[r*Math.cos(a),r*Math.sin(a)];   /* ah: the hole's direction from the pivot; the plate's angles run from ah (the hole) to ah+SH_REST (the part that covers it at rest) */
  {const pts=[],circ=(c,r)=>{for(let i=0;i<48;i++){const t=i/48*TAU;pts.push([c[0]+r*Math.cos(t),c[1]+r*Math.sin(t)]);}};circ([0,0],4);circ(at(SH_D,ah),4.2);circ(at(SH_D,ah+SH_REST),4.2);
    pts.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),hl=[];for(const q of pts){while(hl.length>1&&cr(hl[hl.length-2],hl[hl.length-1],q)<=0)hl.pop();hl.push(q);}const n0=hl.length+1;for(let i=pts.length-2;i>=0;i--){const q=pts[i];while(hl.length>=n0&&cr(hl[hl.length-2],hl[hl.length-1],q)<=0)hl.pop();hl.push(q);}hl.pop();
    const sh=new THREE.Shape(hl.map(q=>new THREE.Vector2(q[0],q[1])));const hole=(c,r)=>{const p=new THREE.Path();p.absarc(c[0],c[1],r,0,TAU,true);sh.holes.push(p);};hole(at(SH_D,ah),KH);hole([0,0],1.55);
    {const sp=[],N=24,sg=Math.sign(SH_REST),cap=(a,t0)=>{const c=at(RS,a);for(let i=1;i<N/2;i++){const t=t0+sg*i/(N/2)*Math.PI;sp.push([c[0]+SW*Math.cos(t),c[1]+SW*Math.sin(t)]);}};   /* arc slot for the stop screw, round-ended */
      for(let i=0;i<=N;i++)sp.push(at(RS+SW,ah+SH_REST*i/N));cap(ah+SH_REST,ah+SH_REST);for(let i=N;i>=0;i--)sp.push(at(RS-SW,ah+SH_REST*i/N));cap(ah,ah+Math.PI);
      sh.holes.push(new THREE.Path(sp.map(q=>new THREE.Vector2(q[0],q[1]))));}
    const pg=extrude(sh,{depth:PT,bevelEnabled:false,curveSegments:24});pg.rotateX(Math.PI/2);   /* rotateX(+90): (x,y,z) -> (x,-z,y), so the outline's y is world z and the plate hangs from Y0 */
    mesh(shield,pg,M.brass2);const q=at(3.3,ah+SH_REST/2+Math.PI);mesh(shield,cylY(0.35,0.6,10),M.steel,q[0],-PT-0.3,q[1]);   /* the spring's pin, under the plate opposite the slot */
    const lg=mesh(shield,cylY(0.2,1.0,8),M.steel,2.8*Math.cos(ah+SH_REST/2+Math.PI),YB-0.3-Y0,2.8*Math.sin(ah+SH_REST/2+Math.PI));lg.rotation.set(0,-(ah+SH_REST/2+Math.PI),Math.PI/2);}   /* moving leg, from the coil to the pin */
  /* fixed to the case: shoulder screw (shoulder through the plate, slotted head wider than the spring), the spring's coil and fixed leg, stop screw (shank through the slot, head under the plate) */
  const yScrew=(x,z,rs,rh,hh)=>{const m=mesh(bowl,cylY(rs,Y0-YH,16),M.steel,x,(Y0+YH)/2,z),h=mesh(bowl,cylY(rh,hh,24),M.steel,x,YH-hh/2,z),sl=mesh(bowl,new THREE.BoxGeometry(rh*2.02,0.6,rh*0.35),M.steelD,x,YH-hh+0.25,z);sl.rotation.y=0.6;return m;};
  yScrew(pv[0],pv[1],1.5,2.8,0.8);
  for(const y of[YB-0.3,YB-0.8]){const c=mesh(bowl,new THREE.TorusGeometry(2.3,0.25,8,32),M.steel,pv[0],y,pv[1]);c.rotation.x=Math.PI/2;}   /* return spring: two turns round the shoulder */
  const ss=[pv[0]+RS*Math.cos(ah),pv[1]+RS*Math.sin(ah)];yScrew(ss[0],ss[1],0.7,1.3,0.8);
  {const lg=mesh(bowl,cylY(0.2,1.5,8),M.steel,pv[0]+3.05*Math.cos(ah),YB-0.8,pv[1]+3.05*Math.sin(ah));lg.rotation.set(0,-ah,Math.PI/2);}   /* fixed leg, bearing on the stop screw */
  shield.rotation.y=SH_REST;
  const bz=mesh(bowl,new THREE.TorusGeometry(63.5,2.6,14,128),M.brass,0,9.5,0);bz.rotation.x=Math.PI/2;
  const gl=mesh(bowl,new THREE.CircleGeometry(62,96).rotateX(-Math.PI/2),M.glass,0,10.5,0);gl.renderOrder=5;
  /* lids hinged at the back */
  /* glass lid hinged to the back of the box; the outer lid hinged to the back-top edge of the glass lid, so it opens on its own and never swings through the glass lid */
  const mid=new THREE.Group(),top=new THREE.Group();mid.userData.partName='lidGlass';top.userData.partName='lid';mid.position.set(0,0,-W);top.position.set(0,38,0);root.add(mid);mid.add(top);
  const lidBody=(p,y0,h,glass)=>{
    if(glass){const fw=26;wood(2*W,h,fw,0,y0+h/2,2*W-fw/2,p);wood(2*W,h,fw,0,y0+h/2,fw/2,p);wood(fw,h,2*W-2*fw,W-fw/2,y0+h/2,W,p);wood(fw,h,2*W-2*fw,-W+fw/2,y0+h/2,W,p);
      const g=mesh(p,new THREE.PlaneGeometry(2*W-2*fw,2*W-2*fw).rotateX(-Math.PI/2),M.glass,0,y0+h-3,W);g.renderOrder=6;}
    else{wood(2*W,h,2*W,0,y0+h/2,W,p);mesh(p,new THREE.BoxGeometry(70,0.8,26),M.brass,0,y0+h+0.4,W+50);mesh(p,new THREE.BoxGeometry(14,18,1.2),M.brass,0,y0+h/2,2*W+0.6);}
    for(const sx of[1,-1])for(const sz of[0,2*W])brassCorner(p,sx*W,y0+h/2,sz,h,W);
  };
  lidBody(mid,0,38,true);lidBody(top,0,38,false);
  for(const sx of[1,-1]){const h=mesh(root,cylY(2.6,30,14),M.brass,sx*55,0,-W-2);h.rotation.z=Math.PI/2;const h2=mesh(mid,cylY(2.6,30,14),M.brass,sx*55,38,-2);h2.rotation.z=Math.PI/2;}
  return{root,ring,bowl,mid,top,shield,shRest:SH_REST,latch:lv};
}
function shadowTex(){const cv=document.createElement('canvas');cv.width=cv.height=256;const x=cv.getContext('2d');const g=x.createRadialGradient(128,128,20,128,128,128);g.addColorStop(0,'rgba(0,0,0,0.42)');g.addColorStop(0.6,'rgba(0,0,0,0.16)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,256,256);return new THREE.CanvasTexture(cv);}

