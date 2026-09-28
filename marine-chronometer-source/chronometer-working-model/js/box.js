/* box.js: mounting box (glass lid hinged to the box, outer lid hinged to the glass lid), gimbal ring, case, winding key
   Part of 'The Marine Chronometer, working' (three.js r128). See README.md. */

/* ================= box, bowl, gimbals ================= */
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
  /* key block and winding key */
  wood(34,30,34,W-T-17,yF+T+15,W-T-17,root,M.woodEdge);
  const key=new THREE.Group();key.userData.partName='key';key.position.set(W-T-17,yF+T+30.5,W-T-17);root.add(key);key.rotation.y=0.6;
  const kb=mesh(key,cylY(2.2,34,16),M.brass,0,2.5,0);kb.rotation.z=Math.PI/2;
  const kt=mesh(key,new THREE.CylinderGeometry(3,3,24,20),M.brass,-14,4,0);kt.rotation.x=Math.PI/2;for(const sz of[12,-12])mesh(key,new THREE.SphereGeometry(3,20,12),M.brass,-14,4,sz);mesh(key,new THREE.SphereGeometry(4.2,20,14),M.brass,-14,4,0);mesh(key,cylY(3.2,5,16),M.brass2,15,2.8,0).rotation.z=Math.PI/2;
  /* gimbal ring and bowl */
  const ring=new THREE.Group();ring.userData.partName='ring';ring.position.y=-24;root.add(ring);
  const V2=(a,b)=>new THREE.Vector2(a,b);
  mesh(ring,new THREE.LatheGeometry([V2(67,-6),V2(73,-6),V2(73,6),V2(67,6),V2(67,-6)],128),M.brass);
  for(const sx of[1,-1]){const pin=mesh(ring,cylY(2.4,W-T-73+2,12),M.brass,sx*(73+(W-T-73)/2),0,0);pin.rotation.z=Math.PI/2;
    mesh(root,new THREE.BoxGeometry(8,22,22),M.brass,sx*(W-T-4),-24,0);}
  const bowl=new THREE.Group();bowl.userData.partName='bowl';ring.add(bowl);
  for(const sz of[1,-1]){const pin=mesh(bowl,cylY(2.2,5,12),M.brass,0,0,sz*66);pin.rotation.x=Math.PI/2;}
  const bp=[V2(0.01,-66)];for(let i=0;i<=12;i++){const a=i/12*Math.PI/2;bp.push(V2(44+20*Math.sin(a),-46-20*Math.cos(a)));}bp.push(V2(64,6),V2(66.5,6),V2(66.5,8.5),V2(62,8.5));
  mesh(bowl,new THREE.LatheGeometry(bp,120),M.brassDS);
  const shutter=mesh(bowl,cylY(5,0.8,24),M.brass2,L.Fu[0],-66.4,L.Fu[1]);
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
  return{root,ring,bowl,mid,top};
}
function shadowTex(){const cv=document.createElement('canvas');cv.width=cv.height=256;const x=cv.getContext('2d');const g=x.createRadialGradient(128,128,20,128,128,128);g.addColorStop(0,'rgba(0,0,0,0.42)');g.addColorStop(0.6,'rgba(0,0,0,0.16)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,256,256);return new THREE.CanvasTexture(cv);}

