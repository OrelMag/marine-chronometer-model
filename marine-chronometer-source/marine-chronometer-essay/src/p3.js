
/* ---------- complete chronometer ---------- */
const POS={T:[-0.3255,0.2493],F:[0,0.378],E:[0.3,0.489],B:[0.191,0.3117],Fu:[0.12,-0.40],Ba:[-0.40,-0.30]};
function buildChrono(M,dialTex,full){
  const root=new THREE.Group();const W=1.5,y0=-1.32,top=0.02,wh=top-y0;
  mesh(root,new THREE.BoxGeometry(2*W,0.1,2*W),M.wood,0,y0-0.05,0);
  mesh(root,new THREE.BoxGeometry(2*W,wh,0.1),M.wood,0,y0+wh/2,W-0.05);
  mesh(root,new THREE.BoxGeometry(2*W,wh,0.1),M.wood,0,y0+wh/2,-(W-0.05));
  mesh(root,new THREE.BoxGeometry(0.1,wh,2*W-0.2),M.wood,W-0.05,y0+wh/2,0);
  mesh(root,new THREE.BoxGeometry(0.1,wh,2*W-0.2),M.wood,-(W-0.05),y0+wh/2,0);
  mesh(root,new THREE.BoxGeometry(2*W-0.2,0.02,2*W-0.2),M.felt,0,y0+0.01,0);
  for(const[sx,sz]of[[1,1],[1,-1],[-1,1],[-1,-1]]){mesh(root,new THREE.BoxGeometry(0.17,0.035,0.17),M.brass,sx*(W-0.075),top+0.004,sz*(W-0.075));mesh(root,new THREE.BoxGeometry(0.17,0.035,0.17),M.brass,sx*(W-0.075),y0-0.09,sz*(W-0.075));}
  for(const sx of[1,-1]){const hd=new THREE.Mesh(new THREE.TorusGeometry(0.2,0.022,8,28,Math.PI),M.brass);hd.rotation.set(Math.PI,Math.PI/2,0);hd.position.set(sx*(W+0.03),-0.3,0);root.add(hd);
    for(const sz of[1,-1])mesh(root,new THREE.BoxGeometry(0.03,0.08,0.06),M.brass,sx*(W+0.01),-0.3,sz*0.2);}
  const lidPivot=new THREE.Group();lidPivot.position.set(0,top,-W);root.add(lidPivot);
  mesh(lidPivot,new THREE.BoxGeometry(2*W+0.04,0.12,2*W+0.04),M.wood,0,0.06,W);
  mesh(lidPivot,new THREE.BoxGeometry(2*W-0.3,0.01,2*W-0.3),M.felt,0,-0.002,W);
  mesh(lidPivot,new THREE.BoxGeometry(0.7,0.012,0.28),M.brass,0,0.126,W+0.9);
  mesh(lidPivot,new THREE.BoxGeometry(0.2,0.08,0.02),M.brass,0,0.06,2*W+0.03);
  for(const sx of[0.8,-0.8]){const h=mesh(root,cylY(0.03,0.32,12),M.brass,sx,top+0.01,-W-0.02);h.rotation.z=Math.PI/2;}
  for(const sx of[1,-1])mesh(root,new THREE.BoxGeometry(0.1,0.2,0.2),M.brass,sx*(W-0.15),-0.12,0);
  const ring=new THREE.Group();ring.position.y=-0.12;root.add(ring);
  const V2=(a,b)=>new THREE.Vector2(a,b);
  mesh(ring,new THREE.LatheGeometry([V2(1.0,-0.06),V2(1.07,-0.06),V2(1.07,0.06),V2(1.0,0.06),V2(1.0,-0.06)],96),M.brass);
  for(const sx of[1,-1]){const p=mesh(ring,cylY(0.026,0.34,12),M.brass,sx*1.235,0,0);p.rotation.z=Math.PI/2;}
  const bowl=new THREE.Group();ring.add(bowl);
  for(const sz of[1,-1]){const p=mesh(bowl,cylY(0.024,0.1,12),M.brass,0,0,sz*1.0);p.rotation.x=Math.PI/2;}
  const bp=[V2(0.001,-0.97)];for(let i=0;i<=10;i++){const a=i/10*Math.PI/2;bp.push(V2(0.715+0.22*Math.sin(a),-0.75-0.22*Math.cos(a)));}bp.push(V2(0.935,0.05));
  mesh(bowl,new THREE.LatheGeometry(bp,80),M.brassDS);
  const bz=mesh(bowl,new THREE.TorusGeometry(0.945,0.03,12,96),M.brass,0,0.07,0);bz.rotation.x=Math.PI/2;
  const glass=mesh(bowl,new THREE.CircleGeometry(0.93,64).rotateX(-Math.PI/2),M.glass,0,0.088,0);glass.renderOrder=2;
  const mv=new THREE.Group();bowl.add(mv);
  const dm=new THREE.MeshStandardMaterial({map:dialTex,roughness:0.5,metalness:0});
  mesh(mv,new THREE.CircleGeometry(0.9,96).rotateX(-Math.PI/2),dm,0,0.013,0);
  mesh(mv,cylY(0.9,0.012,72),M.brass,0,0.006,0);
  const hr=mesh(mv,handGeo(0.44,0.03,0.07,true),M.blued,0,0.02,0);
  const mn=mesh(mv,handGeo(0.72,0.022,0.09,false),M.blued,0,0.03,0);
  mesh(mv,cylY(0.028,0.03,20),M.blued,0,0.028,0);
  const sp=new THREE.Group();sp.position.set(0,0.02,0.378);mv.add(sp);mesh(sp,handGeo(0.2,0.008,0.05,false),M.blued);mesh(sp,cylY(0.012,0.012,14),M.blued,0,0.004,0);
  const up=new THREE.Group();up.position.set(0,0.02,-0.378);mv.add(up);mesh(up,handGeo(0.17,0.009,0.03,false),M.blued);mesh(up,cylY(0.012,0.012,14),M.blued,0,0.004,0);
  const C={root,ring,bowl,lidPivot,mv,hr,mn,sp,up,full};
  if(full){
    mesh(mv,cylY(0.86,0.04,72),M.brass,0,-0.03,0);
    const ts=new THREE.Shape();ts.absarc(0,0,0.86,0,TAU,false);const hole=new THREE.Path();hole.absarc(-0.12,-0.12,0.36,0,TAU,true);ts.holes.push(hole);
    const tg=new THREE.ExtrudeGeometry(ts,{depth:0.04,bevelEnabled:false,curveSegments:48});tg.rotateX(-Math.PI/2);mesh(mv,tg,M.brass,0,-0.44,0);
    for(const a of[45,135,225,315])mesh(mv,cylY(0.028,0.36,14),M.brass2,0.8*Math.cos(a*D2R),-0.23,0.8*Math.sin(a*D2R));
    C.cw=wheelSet(mv,M,0,0,{wheel:{n:90,r:0.36,y:-0.12,spokes:4},pin:{r:0.05,y:-0.36,th:0.03},arbor:[-0.44,0.03]});
    C.tw=wheelSet(mv,M,...POS.T,{wheel:{n:75,r:0.3,y:-0.18,spokes:4},pin:{r:0.05,y:-0.12},arbor:[-0.42,-0.04]});
    C.fw=wheelSet(mv,M,...POS.F,{wheel:{n:80,r:0.28,y:-0.26,spokes:4},pin:{r:0.05,y:-0.18},arbor:[-0.42,0.02]});
    C.ew=wheelSet(mv,M,...POS.E,{wheel:{n:15,r:0.15,y:-0.33,escape:true,flip:true,depth:0.045,spokes:4,mat:M.gilt},pin:{r:0.04,y:-0.26},arbor:[-0.42,-0.05]});
    C.gw=wheelSet(mv,M,...POS.Fu,{wheel:{n:96,r:0.368,y:-0.365,spokes:4}});
    const[bx,bzz]=POS.Ba,[fx,fz]=POS.Fu;const dx=fx-bx,dz=fz-bzz;
    const fs=makeFuseeSet(M,{H:0.24,rmin:0.06,drop:0.45,N:8,Rb:0.15,d:Math.hypot(dx,dz),wire:0.005});
    fs.g.position.set((fx+bx)/2,-0.345,(fz+bzz)/2);fs.g.rotation.y=Math.atan2(-dz,dx);mv.add(fs.g);fs.setWind(2.6);C.fs=fs;
    const[Bx,Bz]=POS.B;const bal=makeBalance(M,0.25,{staff:0.5});bal.position.set(Bx,-0.5,Bz);mv.add(bal);C.bal=bal;
    mesh(bal,cylY(0.05,0.012,24),M.steel,0,0.17,0);mesh(bal,new THREE.BoxGeometry(0.02,0.014,0.014),M.ruby,0.058,0.17,0);
    mesh(bal,cylY(0.03,0.01,20),M.steel,0,0.14,0);mesh(bal,new THREE.BoxGeometry(0.018,0.012,0.01),M.ruby,0.035,0.14,0);
    const spr=new THREE.Mesh(undefined,M.blued);spr.position.y=-0.03;spr.rotation.x=Math.PI;C.spr=spr;
    const sw=new THREE.Group();sw.position.set(Bx,-0.5,Bz);mv.add(sw);sw.add(spr);C.springWrap=sw;
    const bl=Math.hypot(Bx,Bz),ux=Bx/bl,uz=Bz/bl,Qx=ux*0.78,Qz=uz*0.78,cl=0.78-bl+0.05;
    const ck=mesh(mv,new THREE.BoxGeometry(cl,0.035,0.08),M.brass,(Bx+Qx)/2-ux*0.02,-0.76,(Bz+Qz)/2-uz*0.02);ck.rotation.y=Math.atan2(-uz,ux);
    mesh(mv,new THREE.BoxGeometry(0.09,0.32,0.09),M.brass,Qx,-0.6,Qz);
    mesh(mv,cylY(0.012,0.04,10),M.steel,Bx+0.02,-0.735,Bz);
    const[Ex,Ez]=POS.E;const dEx=(Bx-Ex),dEz=(Bz-Ez),dl=Math.hypot(dEx,dEz),nx=dEx/dl,nz=dEz/dl,px=-nz,pz=nx;
    const Kx=Ex+px*0.2+nx*0.02,Kz=Ez+pz*0.2+nz*0.02,Tx=Bx+px*0.035,Tz=Bz+pz*0.035,len=Math.hypot(Tx-Kx,Tz-Kz);
    const det=new THREE.Group();det.position.set(Kx,-0.36,Kz);det.userData.base=Math.atan2(-(Tz-Kz),Tx-Kx);det.rotation.y=det.userData.base;mv.add(det);
    mesh(det,new THREE.BoxGeometry(len,0.02,0.012),M.steel,len/2,0,0);mesh(det,new THREE.BoxGeometry(0.06,0.05,0.05),M.brass,0,0,0);
    mesh(det,new THREE.BoxGeometry(0.012,0.022,0.024),M.ruby,len*0.4,0,-0.014);
    mesh(det,new THREE.BoxGeometry(len*0.7,0.006,0.003),M.gilt,len*0.62,0.004,-0.009);C.det=det;
    mesh(mv,new THREE.BoxGeometry(0.02,0.46,0.02),M.steel,POS.Fu[0],-0.67,POS.Fu[1]);
  }
  C.update=(t,s)=>{
    C.lidPivot.rotation.x=-s.lid*1.9;
    root.rotation.set(s.pitch||0,0,s.roll||0,'ZYX');
    ring.rotation.x=s.lock?0:-(s.pitch||0);bowl.rotation.z=s.lock?0:-(s.roll||0);
    const L=s.lift||0;mv.position.y=smooth(L/0.5)*1.25+smooth((L-0.4)/0.6)*1.2;mv.rotation.x=smooth((L-0.45)/0.55)*Math.PI;
    const k=Math.floor(t*2),fr=t*2-k,e=smooth(fr/0.12),ts=(k+e)/2;
    mn.rotation.y=-((t/3600)%1)*TAU;hr.rotation.y=-((t/43200)%1)*TAU;sp.rotation.y=-((ts/60)%1)*TAU;
    up.rotation.y=-(-120+240*18/56)*D2R;
    if(full){
      C.fw.rotation.y=-((ts/60)%1)*TAU;C.ew.rotation.y=((ts/7.5)%1)*TAU;C.tw.rotation.y=((ts/450)%1)*TAU;C.cw.rotation.y=-((ts/3600)%1)*TAU;
      C.gw.rotation.y=((ts/28800)%1)*TAU;
      const th=220*D2R*Math.sin(TAU*t*2);C.bal.rotation.y=th;
      C.det.rotation.y=C.det.userData.base+(fr<0.1?-0.05*Math.sin(Math.PI*fr/0.1):0);
      if(L>0.05){C.spr.geometry.dispose();C.spr.geometry=springGeo(0.075,0.19,10,th,true,0.0035);}
    }
  };
  return C;
}

/* ---------- hero dial ---------- */
function initHero(){
  const cv=$('#hero');const ctx=cv.getContext('2d');let S=0;
  const rs=()=>{const w=cv.clientWidth||300;const d=Math.min(window.devicePixelRatio||1,2);S=Math.round(w*d);cv.width=cv.height=S;};
  new ResizeObserver(rs).observe(cv);rs();
  const hand=(cx,cy,ang,len,w,tail,spade)=>{ctx.save();ctx.translate(cx,cy);ctx.rotate(ang);ctx.beginPath();ctx.moveTo(-w/2,tail);ctx.lineTo(w/2,tail);
    if(spade){ctx.lineTo(w*0.3,-len*0.55);ctx.lineTo(w*1.7,-len*0.7);ctx.lineTo(0,-len);ctx.lineTo(-w*1.7,-len*0.7);ctx.lineTo(-w*0.3,-len*0.55);}
    else{ctx.lineTo(w*0.3,-len*0.85);ctx.lineTo(0,-len);ctx.lineTo(-w*0.3,-len*0.85);}
    ctx.closePath();ctx.fillStyle='#233f96';ctx.fill();ctx.beginPath();ctx.arc(0,0,w*0.9,0,TAU);ctx.fill();ctx.restore();};
  let lastK=-1;
  const f=addFig(cv,()=>{const now=Date.now()/1000-new Date().getTimezoneOffset()*60;const k=Math.floor(now*2);if(k===lastK&&!f.dirty)return;lastK=k;f.dirty=false;
    const ts=k/2,c=S/2;ctx.clearRect(0,0,S,S);ctx.drawImage(dialCanvas(),0,0,S,S);
    hand(c,c-c*0.42,(-120+240*18/56)*D2R,c*0.19,S*0.009,c*0.03,false);
    hand(c,c,((now/43200)%1)*TAU,c*0.5,S*0.03,c*0.08,true);
    hand(c,c,((now/3600)%1)*TAU,c*0.8,S*0.022,c*0.1,false);
    hand(c,c+c*0.42,((ts/60)%1)*TAU,c*0.22,S*0.008,c*0.06,false);});
}

/* ---------- F1a longitude ---------- */
function initLon(){
  const st=$('#f-lon');const C=canvas2D(st,w=>w<520?0.8:0.52);let lam=-40;
  const f=C.fig=addFig(st,()=>{if(!f.dirty)return;f.dirty=false;draw();});
  const fmt=h=>{h=((h%24)+24)%24;const H=Math.floor(h),m=Math.round((h-H)*60);return String(m===60?H+1:H).padStart(2,'0')+':'+String(m%60).padStart(2,'0');};
  bindRange($('input',st.parentElement),v=>{lam=v;f.dirty=true;const g=12-v/15;
    $('#lon-read').innerHTML=`Local noon at the ship. The chronometer, still on Greenwich time, reads <b>${fmt(g)}</b>. ${Math.abs(g-12)<1e-9?'No difference: the ship is on the Greenwich meridian.':`That is ${Math.abs(v/15).toFixed(2).replace(/\.?0+$/,'')} h ${v<0?'after':'before'} noon, and each hour is 15°, so the ship is at <b>${Math.abs(v)}° ${v<0?'W':'E'}</b>.`}`;
    return Math.abs(v)+'° '+(v<0?'W':v>0?'E':'');});
  function draw(){
    const{ctx,w,h}=C;ctx.clearRect(0,0,w,h);const cx=w*0.42,cy=h/2,R=Math.min(w*0.3,h*0.4);
    ctx.strokeStyle=PAL.brass;ctx.lineWidth=1.5;ctx.globalAlpha=0.5;
    for(let i=-3;i<=3;i++){const y=cy+i*R*0.3;ctx.beginPath();ctx.moveTo(w*0.8,y);ctx.lineTo(w-8,y);ctx.stroke();}
    ctx.globalAlpha=1;ctx.fillStyle=PAL.brass;ctx.beginPath();ctx.arc(w-4,cy,R*0.35,0,TAU);ctx.fill();
    ctx.fillStyle=PAL.muted;ctx.font='13px "Instrument Sans",sans-serif';ctx.textAlign='right';ctx.fillText('sunlight',w-10,cy-R*0.95);
    ctx.fillStyle=PAL.paper;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.fill();
    ctx.fillStyle=PAL.blue;ctx.globalAlpha=0.16;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.fill();
    ctx.globalAlpha=0.35;ctx.fillStyle=PAL.ink;ctx.beginPath();ctx.arc(cx,cy,R,Math.PI/2,Math.PI*1.5);ctx.fill();ctx.globalAlpha=1;
    ctx.strokeStyle=PAL.ink;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.stroke();
    const P=(L,r)=>{const a=(L-lam)*D2R;return[cx+r*Math.cos(a),cy-r*Math.sin(a)];};
    ctx.strokeStyle=PAL.muted;ctx.lineWidth=0.6;
    for(let L=-165;L<=180;L+=15){const[x,y]=P(L,R);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.stroke();}
    for(const f of[0.33,0.66]){ctx.beginPath();ctx.arc(cx,cy,R*f,0,TAU);ctx.stroke();}
    const a0=0,a1=-lam*D2R;ctx.strokeStyle=PAL.red;ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,R*0.5,-Math.max(a0,a1),-Math.min(a0,a1));ctx.stroke();
    const[gx,gy]=P(0,R*1.02);ctx.strokeStyle=PAL.red;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(gx,gy);ctx.stroke();
    const[sx,sy]=P(lam,R);ctx.strokeStyle=PAL.blue;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(sx,sy);ctx.stroke();
    ctx.fillStyle=PAL.blue;ctx.beginPath();ctx.moveTo(sx+10,sy);ctx.lineTo(sx-6,sy-7);ctx.lineTo(sx-6,sy+7);ctx.closePath();ctx.fill();
    ctx.fillStyle=PAL.ink;ctx.beginPath();ctx.arc(cx,cy,3,0,TAU);ctx.fill();
    ctx.font='13px "Instrument Sans",sans-serif';ctx.textAlign='center';ctx.fillStyle=PAL.red;
    const[lx,ly]=P(0,R+16);ctx.fillText('Greenwich',lx,ly+4);
    ctx.fillStyle=PAL.blue;ctx.fillText('Ship',sx+10,sy-12);
    ctx.fillStyle=PAL.muted;ctx.fillText('North Pole',cx,cy+18);
    ctx.strokeStyle=PAL.muted;ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(cx,cy,R+26,-2.3,-1.7);ctx.stroke();
    const ex=cx+(R+26)*Math.cos(-2.3),ey=cy+(R+26)*Math.sin(-2.3);ctx.fillStyle=PAL.muted;ctx.beginPath();ctx.moveTo(ex-2,ey-7);ctx.lineTo(ex+6,ey+4);ctx.lineTo(ex-9,ey+3);ctx.closePath();ctx.fill();
  }
}

/* ---------- F1b error ---------- */
function initErr(){
  const st=$('#f-err');const C=canvas2D(st,w=>w<520?0.5:0.3);let rate=2,days=42;
  const f=C.fig=addFig(st,()=>{if(!f.dirty)return;f.dirty=false;draw();});
  const [ri,di]=st.parentElement.querySelectorAll('input');
  const upd=()=>{const s=rate*days,nm=s/4;$('#err-read').innerHTML=`Accumulated error <b>${s.toFixed(0)} s</b>, which is <b>${(s/4).toFixed(1)}′</b> of longitude, or <b>${nm.toFixed(1)} nautical miles</b> at the equator. ${nm<=30?'Inside':'Outside'} the Act’s half degree.`;f.dirty=true;};
  bindRange(ri,v=>{rate=v;upd();return v.toFixed(1)+' s/day';});bindRange(di,v=>{days=v;upd();return v+' days';});
  function draw(){
    const{ctx,w,h}=C;ctx.clearRect(0,0,w,h);const nm=rate*days/4;const span=Math.max(45,nm*1.25);
    const cx=w*0.62,sc=(w*0.55)/span,y=h*0.5,X=d=>cx-d*sc;
    ctx.fillStyle=PAL.blue;ctx.globalAlpha=0.1;ctx.fillRect(0,y-h*0.32,w,h*0.64);ctx.globalAlpha=1;
    ctx.fillStyle=PAL.brass;ctx.globalAlpha=0.18;ctx.fillRect(X(30),y-h*0.32,60*sc,h*0.64);ctx.globalAlpha=1;
    ctx.strokeStyle=PAL.muted;ctx.lineWidth=1;ctx.font='12px "Instrument Sans",sans-serif';ctx.fillStyle=PAL.muted;ctx.textAlign='center';
    const step=span>150?50:span>70?20:10;
    for(let d=-Math.floor(span/step)*step;d<=span;d+=step){const x=X(d);if(x<4||x>w-4)continue;ctx.beginPath();ctx.moveTo(x,y+h*0.32);ctx.lineTo(x,y+h*0.32-6);ctx.stroke();ctx.fillText(Math.abs(d)+'',x,y+h*0.32+14);}
    ctx.textAlign='left';ctx.fillText('nautical miles west →',4,y+h*0.32+14);
    const ship=(x,col,label,dy)=>{ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x-12,y-4);ctx.lineTo(x+12,y-4);ctx.lineTo(x+8,y+5);ctx.lineTo(x-8,y+5);ctx.closePath();ctx.fill();ctx.fillRect(x-1,y-20,2,16);ctx.beginPath();ctx.moveTo(x+1,y-20);ctx.lineTo(x+10,y-9);ctx.lineTo(x+1,y-9);ctx.fill();ctx.textAlign='center';ctx.fillText(label,x,y+dy);};
    ship(X(0),PAL.ink,'True position',24);
    if(nm>0.3){ctx.strokeStyle=PAL.red;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(X(0),y-26);ctx.lineTo(X(nm),y-26);ctx.stroke();ctx.setLineDash([]);ship(X(nm),PAL.red,'Believed position',-30);}
  }
}

/* ---------- F2 balance ---------- */
function initBalance(){
  const st=$('#f-bal');const V=new View3D(st,{aspect:w=>w<520?0.9:0.6,yaw:0.5,pitch:0.6,dist:1.8,target:[0,0.06,0]});
  const M=mats();const bal=makeBalance(M,0.3,{staff:0.44});V.scene.add(bal);
  const spr=new THREE.Mesh(undefined,M.blued);spr.position.y=0.03;V.scene.add(spr);
  mesh(V.scene,new THREE.BoxGeometry(0.66,0.03,0.08),M.brass,0.27,0.265,0);
  mesh(V.scene,new THREE.BoxGeometry(0.08,0.49,0.08),M.brass,0.56,0.035,0);
  mesh(V.scene,cylY(0.012,0.03,10),M.steel,0.03,0.237,0);
  mesh(V.scene,cylY(0.55,0.03,64),M.brass2,0.1,-0.225,0);
  V.label('Balance','',v=>v.set(-0.3,0.03,0.05));V.label('Balance spring','',v=>v.set(-0.12,0.16,0));V.label('Balance cock','',v=>v.set(0.45,0.29,0));
  const ins=st.parentElement.querySelectorAll('.ctl input[type=range]');let m=1,k=1,ph=0,playing=!RM,slow=false;
  const ro=st.parentElement.querySelector('.readout');
  const upd=()=>{const T=0.5*Math.sqrt(m/k);ro.innerHTML=`Period <b>${T.toFixed(3)} s</b>, or <b>${Math.round(7200/T).toLocaleString('en-US')}</b> vibrations an hour`;f.dirty=true;};
  const f=V.fig=addFig(st,dt=>{if(playing){ph+=dt*(slow?0.2:1)/(0.5*Math.sqrt(m/k));f.dirty=true;}if(!f.dirty)return;f.dirty=false;
    const th=220*D2R*Math.sin(TAU*ph);bal.rotation.y=th;spr.geometry.dispose();spr.geometry=springGeo(0.1,0.2,11,th,true,0.0045*Math.cbrt(k));V.render();});
  bindRange(ins[0],v=>{m=v;bal.userData.wts.forEach(o=>o.wm.scale.set(Math.sqrt(v),1,Math.sqrt(v)));upd();return '×'+v.toFixed(2);});
  bindRange(ins[1],v=>{k=v;upd();return '×'+v.toFixed(2);});
  $('.slow',st.parentElement).addEventListener('change',e=>slow=e.target.checked);
  bindPlay($('.play',st.parentElement),()=>playing,v=>playing=v);
}

/* ---------- F4 spring ---------- */
function initSpring(){
  const st=$('#f-spring');const V=new View3D(st,{aspect:w=>w<520?0.95:0.6,yaw:0.45,pitch:0.28,dist:1.0,target:[0,0.1,0]});
  const M=mats();const spr=new THREE.Mesh(undefined,M.blued);V.scene.add(spr);
  const staff=new THREE.Group();V.scene.add(staff);mesh(staff,cylY(0.008,0.36,10),M.steel,0,0.1,0);mesh(staff,cylY(0.022,0.02,20),M.brass,0,0,0);
  mesh(staff,new THREE.BoxGeometry(0.02,0.02,0.02),M.steel,0.028,0,0);
  mesh(V.scene,new THREE.BoxGeometry(0.03,0.03,0.03),M.brass,0.028,0.215,0);
  const ghost=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.2,48,1,true),new THREE.MeshBasicMaterial({color:0x888888,wireframe:true,transparent:true,opacity:0.18}));ghost.position.y=0.1;V.scene.add(ghost);
  V.label('Terminal curve','',v=>v.set(0.03,0.2,0.02));V.label('Collet on the staff','turns with the balance',v=>v.set(0.02,0,0.02));
  let th=0,term=true;
  const f=V.fig=addFig(st,()=>{if(!f.dirty)return;f.dirty=false;spr.geometry.dispose();spr.geometry=springGeo(0.1,0.2,11,th,term,0.004);staff.rotation.y=th;V.labels[0].show=term;V.render();});
  bindRange($('input[type=range]',st.parentElement),v=>{th=v*D2R;f.dirty=true;return v+'°';});
  bindSeg($('.seg',st.parentElement),v=>{term=v==='1';f.dirty=true;});
}

/* ---------- F3 temperature ---------- */
function initTemp(){
  const st=$('#f-temp');const V=new View3D(st,{aspect:w=>w<520?0.8:0.5,yaw:0.3,pitch:1.15,dist:1.55,target:[0,0,0]});
  const M=mats();const bal=makeBalance(M,0.3,{staff:0.1});V.scene.add(bal);
  const cst=$('#f-temp-chart');const C=canvas2D(cst,w=>w<520?0.62:0.34);
  let T=20,bim=true;const ro=st.parentElement.querySelector('.readout');
  const plain=t=>-11*(t-20),comp=t=>1.5*(1-((t-19.5)/12.5)**2);
  V.label('Brass outside, steel inside','',v=>v.set(-0.29,0,-0.12));V.label('Compensation weight','',v=>{const w=bal.userData.wts[0];w.wm.getWorldPosition(v);});
  const upd=()=>{bal.userData.set(bim?(T-20)/25*0.6:0,bim,(T-20)/25*0.05);V.labels.forEach(l=>l.show=bim);
    const r=bim?comp(T):plain(T);ro.innerHTML=`${bim?'Compensation':'Plain'} balance at ${T.toFixed(1)} °C: ${r>=0?'gains':'loses'} <b>${Math.abs(r).toFixed(1)} s/day</b>`;f.dirty=true;cf.dirty=true;};
  const f=V.fig=addFig(st,()=>{if(!f.dirty)return;f.dirty=false;V.render();});
  const cf=C.fig=addFig(cst,()=>{if(!cf.dirty)return;cf.dirty=false;
    chart(C,{x0:-5,x1:45,y0:-8,y1:8,xt:[0,10,20,30,40],yt:[-8,-4,0,4,8],xf:x=>x+' °C',yf:y=>(y>0?'+':'')+y,xl:'Temperature',yl:'Rate, s/day',cursor:T,
      series:[{f:plain,color:PAL.red,label:'plain: about −11 s/day per °C',lx:15.5,la:'right',dx:-8,dy:0},{f:comp,color:PAL.blue,label:'compensated',lx:19.5,dy:-14,la:'center'}],
      marks:[{x:T,y:bim?comp(T):plain(T),color:bim?PAL.blue:PAL.red}]});});
  bindRange($('input[type=range]',st.parentElement),v=>{T=v;upd();return v.toFixed(1)+' °C';});
  bindSeg($('.seg',st.parentElement),v=>{bim=v==='1';upd();});
}

/* ---------- F5 fusee ---------- */
function initFusee(){
  const st=$('#f-fusee');const V=new View3D(st,{aspect:w=>w<520?0.85:0.55,yaw:Math.PI-0.45,pitch:0.4,dist:2.1,target:[0,0.14,0]});
  const M=mats();const cfg={H:0.34,rmin:0.085,drop:0.45,N:8,Rb:0.19,d:0.62};const fs=makeFuseeSet(M,cfg);V.scene.add(fs.g);
  const gw=new THREE.Mesh(gearGeo(96,0.24,0.02,{spokes:4}),M.brass);gw.position.y=-0.035;fs.fz.add(gw);
  mesh(V.scene,cylY(0.5,0.02,64),M.brass2,0,-0.07,0);
  V.label('Barrel','mainspring inside',v=>v.set(fs.bx,0.36,0));V.label('Fusee','',v=>v.set(fs.fx,0.4,0));V.label('Chain','',v=>{v.set(0,fs.yf(n),-lerp(fs.rf(n),cfg.Rb,0.5));});V.label('Great wheel','drives the train',v=>v.set(fs.fx+0.24,-0.03,0));
  let hrs=6,n=0;const cst=$('#f-fusee-chart');const C=canvas2D(cst,w=>w<520?0.6:0.32);const ro=st.parentElement.querySelector('.readout');
  const Tsp=h=>1-0.45*h/56;
  const f=V.fig=addFig(st,()=>{if(!f.dirty)return;f.dirty=false;V.render();});
  const cf=C.fig=addFig(cst,()=>{if(!cf.dirty)return;cf.dirty=false;
    chart(C,{x0:0,x1:56,y0:0,y1:1.1,xt:[0,8,16,24,32,40,48,56],yt:[0,0.25,0.5,0.75,1],yf:y=>Math.round(y*100)+'%',xl:'Hours since winding',yl:'Torque',cursor:hrs,band:{y0:0,y1:1.1,color:'transparent'},
      series:[{f:Tsp,color:PAL.red,label:'spring pull at the barrel',lx:40,dy:14,la:'center'},{f:()=>1,color:PAL.blue,label:'torque at the fusee arbor',lx:28,dy:-12,la:'center'}],
      marks:[{x:hrs,y:Tsp(hrs),color:PAL.red},{x:hrs,y:1,color:PAL.blue}]});});
  bindRange($('input[type=range]',st.parentElement),v=>{hrs=v;n=cfg.N*v/56;fs.setWind(n);
    ro.innerHTML=`Spring pull <b>${Math.round(Tsp(v)*100)}%</b> of full, lever arm on the fusee <b>${(fs.rf(n)/cfg.rmin).toFixed(2)}×</b> the smallest radius, torque delivered <b>100%</b>`;f.dirty=true;cf.dirty=true;return v.toFixed(1)+' h';});
}
