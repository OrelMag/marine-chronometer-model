"use strict";
const TAU=Math.PI*2, D2R=Math.PI/180;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
const lerp=(a,b,t)=>a+(b-a)*t;
const $=(s,r=document)=>r.querySelector(s);
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const HAS3D=typeof THREE!=='undefined';
const PAL={};
function readPal(){const s=getComputedStyle(document.documentElement);['ink','muted','brass','blue','red','rule','paper','bg','steel'].forEach(k=>PAL[k]=s.getPropertyValue('--'+k).trim());}
readPal();

const FIGS=[];
const io=new IntersectionObserver(es=>{for(const e of es){const f=e.target._fig;if(f){f.visible=e.isIntersecting;if(f.visible)f.dirty=true;}}},{rootMargin:'150px'});
function addFig(el,tick){const f={el,tick,visible:false,dirty:true};el._fig=f;FIGS.push(f);io.observe(el);return f;}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{readPal();FIGS.forEach(f=>f.dirty=true);});

function bindRange(input,fn){const out=input.parentElement.querySelector('output');const h=()=>{const t=fn(parseFloat(input.value));if(out&&t!=null)out.textContent=t;};input.addEventListener('input',h);h();return h;}
function bindPlay(btn,get,set){const upd=()=>btn.textContent=get()?'Pause':'Play';btn.addEventListener('click',()=>{set(!get());upd();});upd();return upd;}
function bindSeg(seg,fn){const bs=[...seg.querySelectorAll('button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));fn(b.dataset.v);}));}

/* ---------- 2D canvas ---------- */
function canvas2D(stage,aspect){
  const cv=stage.querySelector('canvas');
  const o={cv,ctx:cv.getContext('2d'),w:1,h:1,fig:null};
  const rs=()=>{const w=stage.clientWidth||300;const a=typeof aspect==='function'?aspect(w):aspect;const h=Math.round(w*a);
    if(cv.style.height!==h+'px')cv.style.height=h+'px';const d=Math.min(window.devicePixelRatio||1,2);
    const W=Math.round(w*d),H=Math.round(h*d);if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;}
    o.ctx.setTransform(d,0,0,d,0,0);o.w=w;o.h=h;if(o.fig)o.fig.dirty=true;};
  new ResizeObserver(rs).observe(stage);rs();return o;
}
function chart(C,o){
  const {ctx,w,h}=C;ctx.clearRect(0,0,w,h);
  const L=44,R=16,T=16,B=36,pw=w-L-R,ph=h-T-B;
  const X=x=>L+(x-o.x0)/(o.x1-o.x0)*pw, Y=y=>T+(1-(y-o.y0)/(o.y1-o.y0))*ph;
  ctx.font='12px "Instrument Sans",system-ui,sans-serif';ctx.lineWidth=1;
  if(o.band){ctx.fillStyle=o.band.color;ctx.fillRect(L,Y(o.band.y1),pw,Y(o.band.y0)-Y(o.band.y1));}
  ctx.strokeStyle=PAL.rule;ctx.fillStyle=PAL.muted;ctx.textAlign='center';ctx.textBaseline='top';
  for(const x of o.xt){ctx.beginPath();ctx.moveTo(X(x),T);ctx.lineTo(X(x),T+ph);ctx.stroke();ctx.fillText(o.xf?o.xf(x):x,X(x),T+ph+5);}
  ctx.textAlign='right';ctx.textBaseline='middle';
  for(const y of o.yt){ctx.beginPath();ctx.moveTo(L,Y(y));ctx.lineTo(L+pw,Y(y));ctx.stroke();ctx.fillText(o.yf?o.yf(y):y,L-6,Y(y));}
  if(o.y0<0&&o.y1>0){ctx.strokeStyle=PAL.muted;ctx.beginPath();ctx.moveTo(L,Y(0));ctx.lineTo(L+pw,Y(0));ctx.stroke();}
  ctx.textAlign='center';ctx.textBaseline='bottom';ctx.fillText(o.xl,L+pw/2,h-1);
  ctx.textAlign='left';ctx.textBaseline='top';ctx.fillText(o.yl,L+4,2);
  ctx.save();ctx.beginPath();ctx.rect(L,T,pw,ph);ctx.clip();
  for(const s of o.series){ctx.strokeStyle=s.color;ctx.lineWidth=s.width||2.2;ctx.setLineDash(s.dash||[]);ctx.beginPath();
    for(let i=0;i<=240;i++){const x=o.x0+(o.x1-o.x0)*i/240;const y=s.f(x);i?ctx.lineTo(X(x),Y(y)):ctx.moveTo(X(x),Y(y));}ctx.stroke();}
  ctx.setLineDash([]);
  if(o.cursor!=null){ctx.strokeStyle=PAL.muted;ctx.lineWidth=1;ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(X(o.cursor),T);ctx.lineTo(X(o.cursor),T+ph);ctx.stroke();ctx.setLineDash([]);}
  for(const m of (o.marks||[])){const yy=clamp(m.y,o.y0,o.y1);ctx.fillStyle=m.color;ctx.strokeStyle=PAL.paper;ctx.lineWidth=2;ctx.beginPath();ctx.arc(X(m.x),Y(yy),5,0,TAU);ctx.fill();ctx.stroke();}
  ctx.restore();
  ctx.textBaseline='middle';
  for(const s of o.series){if(!s.label)continue;ctx.fillStyle=s.color;ctx.textAlign=s.la||'left';const yy=clamp(s.f(s.lx),o.y0,o.y1);ctx.fillText(s.label,X(s.lx)+(s.dx||0),Y(yy)+(s.dy||-12));}
}

/* ---------- 3D ---------- */
function envTex(r){
  const pm=new THREE.PMREMGenerator(r);const s=new THREE.Scene();
  const g=new THREE.SphereGeometry(20,48,24);const pos=g.attributes.position;const col=[];
  for(let i=0;i<pos.count;i++){const t=(pos.getY(i)/20+1)/2;const k=Math.pow(t,1.6);col.push(0.06+0.95*k,0.06+0.9*k,0.07+0.85*k);}
  g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
  s.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide})));
  const pa=new THREE.Mesh(new THREE.PlaneGeometry(16,7),new THREE.MeshBasicMaterial({color:new THREE.Color(6,5.6,5),side:THREE.DoubleSide}));pa.position.set(-8,12,7);pa.lookAt(0,0,0);s.add(pa);
  const pb=new THREE.Mesh(new THREE.PlaneGeometry(6,12),new THREE.MeshBasicMaterial({color:new THREE.Color(2.4,2.6,3),side:THREE.DoubleSide}));pb.position.set(13,3,-7);pb.lookAt(0,0,0);s.add(pb);
  const t=pm.fromScene(s,0.03).texture;pm.dispose();return t;
}
const sc=h=>new THREE.Color(h).convertSRGBToLinear();
function mats(){
  const S=(c,m,r,x={})=>new THREE.MeshStandardMaterial(Object.assign({color:sc(c),metalness:m,roughness:r},x));
  const M={brass:S(0xdcae58,1,0.28),brass2:S(0xc39340,1,0.4),gilt:S(0xeccb78,1,0.22),steel:S(0xd6d9de,1,0.2),
    blued:S(0x2b4cb0,0.8,0.28),wood:S(0x4a1d10,0,0.38),wood2:S(0x4a1c0e,0,0.55),ruby:S(0xc8163c,0.1,0.15,{emissive:sc(0x3a0010)}),
    chain:S(0x5c616a,1,0.33),enamel:S(0xf3f0e8,0,0.45),glass:S(0xffffff,0,0.03,{transparent:true,opacity:0.13,depthWrite:false}),
    felt:S(0x1f4032,0,0.95)};
  M.brassDS=M.brass.clone();M.brassDS.side=THREE.DoubleSide;
  return M;
}
class View3D{
  constructor(stage,o={}){
    this.stage=stage;const cv=this.cv=stage.querySelector('canvas');this.aspect=o.aspect||0.75;
    const r=this.r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
    r.setPixelRatio(Math.min(window.devicePixelRatio||1,2));r.outputEncoding=THREE.sRGBEncoding;
    r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.05;
    this.scene=new THREE.Scene();this.scene.environment=envTex(r);
    this.scene.add(new THREE.HemisphereLight(0xffffff,0x3a3a3a,0.35));
    const dl=new THREE.DirectionalLight(0xffffff,1.0);dl.position.set(3,6,4);this.scene.add(dl);
    this.cam=new THREE.PerspectiveCamera(o.fov||30,1,0.03,200);
    this.yaw=o.yaw??0.6;this.pitch=o.pitch??0.5;this.dist=o.dist??4;this.target=new THREE.Vector3(...(o.target||[0,0,0]));
    this.minP=o.minPitch??-1.2;this.maxP=o.maxPitch??1.5;this.labels=[];this.labelBox=stage.querySelector('.labels');this.fig=null;
    let pid=null,lx=0,ly=0;
    cv.addEventListener('pointerdown',e=>{pid=e.pointerId;lx=e.clientX;ly=e.clientY;try{cv.setPointerCapture(pid);}catch(_){}stage.classList.add('grab');});
    cv.addEventListener('pointermove',e=>{if(e.pointerId!==pid)return;const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;
      this.yaw-=dx*0.009;this.pitch=clamp(this.pitch+dy*0.009,this.minP,this.maxP);if(this.fig)this.fig.dirty=true;});
    const up=e=>{if(e.pointerId===pid){pid=null;stage.classList.remove('grab');}};
    cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
    new ResizeObserver(()=>this.resize()).observe(stage);this.resize();
  }
  resize(){const w=this.stage.clientWidth||300;const a=typeof this.aspect==='function'?this.aspect(w):this.aspect;const h=Math.round(w*a);
    if(w===this.w&&h===this.h)return;this.cv.style.height=h+'px';this.r.setSize(w,h,false);this.cam.aspect=w/h;this.cam.updateProjectionMatrix();this.w=w;this.h=h;if(this.fig)this.fig.dirty=true;}
  label(title,sub,getPos){const el=document.createElement('div');el.className='lbl';el.innerHTML='<span>'+title+(sub?'<i>'+sub+'</i>':'')+'</span>';this.labelBox.appendChild(el);const L={el,getPos,show:true};this.labels.push(L);return L;}
  render(){
    const c=Math.cos(this.pitch);
    this.cam.position.set(this.target.x+this.dist*c*Math.sin(this.yaw),this.target.y+this.dist*Math.sin(this.pitch),this.target.z+this.dist*c*Math.cos(this.yaw));
    this.cam.lookAt(this.target);this.r.render(this.scene,this.cam);
    const v=new THREE.Vector3();
    for(const L of this.labels){if(!L.show){L.el.style.opacity=0;continue;}L.getPos(v);v.project(this.cam);
      const x=(v.x+1)/2*this.w,y=(1-v.y)/2*this.h;L.el.style.opacity=(v.z<1&&x>-20&&x<this.w+20)?1:0;L.el.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;}
  }
}
function worldOf(obj,x=0,y=0,z=0){return v=>{v.set(x,y,z);obj.localToWorld(v);};}

/* ---------- geometry ---------- */
function gearPts(n,r,o){
  const depth=o.depth??Math.min(r*0.1,Math.max(0.006,2.3*r/n));const ri=r-depth,p=TAU/n,pts=[];
  for(let i=0;i<n;i++){const a=i*p;
    if(o.escape){pts.push([ri,a],[r,a+p*0.03]);for(let k=1;k<=5;k++){const f=k/5;pts.push([r-(r-ri)*Math.pow(f,0.55),a+p*(0.03+0.62*f)]);}pts.push([ri,a+p*0.97]);}
    else pts.push([ri,a],[ri,a+p*0.1],[r-depth*0.3,a+p*0.2],[r,a+p*0.3],[r,a+p*0.45],[r-depth*0.3,a+p*0.55],[ri,a+p*0.65]);}
  let xy=pts.map(([rr,a])=>[rr*Math.cos(a),rr*Math.sin(a)]);
  if(o.flip)xy=xy.map(([x,y])=>[x,-y]).reverse();
  return {xy,ri};
}
function gearGeo(n,r,th,o={}){
  const {xy,ri}=gearPts(n,r,o);const s=new THREE.Shape();s.moveTo(xy[0][0],xy[0][1]);for(let i=1;i<xy.length;i++)s.lineTo(xy[i][0],xy[i][1]);s.closePath();
  if(o.spokes){const R1=ri-(o.rim??Math.max(0.012,r*0.1)),R0=o.hub??Math.max(0.022,r*0.2),sw=o.sw??Math.max(0.012,r*0.09);
    if(R1>R0+0.015)for(let j=0;j<o.spokes;j++){const a0=j/o.spokes*TAU,a1=(j+1)/o.spokes*TAU;const d1=Math.asin(Math.min(0.9,sw/2/R1)),d0=Math.asin(Math.min(0.9,sw/2/R0));
      const h=new THREE.Path();h.absarc(0,0,R1,a0+d1,a1-d1,false);h.absarc(0,0,R0,a1-d0,a0+d0,true);s.holes.push(h);}}
  const g=new THREE.ExtrudeGeometry(s,{depth:th,bevelEnabled:false,curveSegments:10});g.rotateX(-Math.PI/2);return g;
}
function mesh(parent,geo,mat,x=0,y=0,z=0){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);return m;}
function cylY(r,h,seg=16){return new THREE.CylinderGeometry(r,r,h,seg);}
/* wheel on an arbor: returns group to rotate about y */
function wheelSet(parent,M,x,z,o){
  const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);
  if(o.wheel){const w=o.wheel;const m=new THREE.Mesh(gearGeo(w.n,w.r,w.th||0.02,{spokes:w.spokes??4,escape:w.escape,flip:w.flip,depth:w.depth}),w.mat||M.brass);m.position.y=w.y-(w.th||0.02)/2;g.add(m);}
  if(o.pin){const p=o.pin;const m=new THREE.Mesh(gearGeo(10,p.r,p.th||0.04,{depth:p.r*0.32}),M.steel);m.position.y=p.y-(p.th||0.04)/2;g.add(m);}
  if(o.arbor){const[a,b]=o.arbor;mesh(g,cylY(o.ar||0.011,b-a,12),M.steel,0,(a+b)/2,0);}
  return g;
}

/* balance with bimetallic split rim */
function makeBalance(M,R=0.3,o={}){
  const g=new THREE.Group();const h=o.h||0.045,w=o.w||R*0.15;
  mesh(g,new THREE.BoxGeometry(2*R-w*0.4,h*0.75,R*0.13),M.steel);
  mesh(g,cylY(R*0.12,h*1.1,20),M.steel);
  mesh(g,cylY(0.008,o.staff||0.42,10),M.steel);
  const rims=[0,1].map(()=>{const st=new THREE.Mesh(undefined,M.steel),br=new THREE.Mesh(undefined,M.brass);g.add(st,br);return[st,br];});
  const plain=new THREE.Mesh(undefined,M.brass);g.add(plain);
  const wts=[0,1].map(()=>{const piv=new THREE.Group();const wm=new THREE.Mesh(new THREE.CylinderGeometry(R*0.1,R*0.1,h*1.15,18),M.brass2);wm.rotation.z=Math.PI/2;piv.add(wm);g.add(piv);return{piv,wm};});
  for(const s of[-1,1]){const n=new THREE.Mesh(new THREE.CylinderGeometry(R*0.055,R*0.055,R*0.1,12),M.gilt);n.rotation.z=Math.PI/2;n.position.x=s*(R+w*0.5+R*0.04);g.add(n);}
  const span=162*D2R;
  const band=(a0,rf,w0,w1)=>{const s=new THREE.Shape(),N=40;for(let i=0;i<=N;i++){const u=i/N,a=a0+span*u,r=rf(u)+w1;i?s.lineTo(r*Math.cos(a),r*Math.sin(a)):s.moveTo(r*Math.cos(a),r*Math.sin(a));}
    for(let i=N;i>=0;i--){const u=i/N,a=a0+span*u,r=rf(u)+w0;s.lineTo(r*Math.cos(a),r*Math.sin(a));}
    const geo=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:false});geo.rotateX(-Math.PI/2);geo.translate(0,-h/2,0);return geo;};
  g.userData.wts=wts;
  g.userData.set=(curl,bimetal=true,expand=0)=>{
    for(let k=0;k<2;k++){const a0=k*Math.PI;const rf=u=>R-curl*R*0.32*u*u;const[st,br]=rims[k];
      st.geometry.dispose();br.geometry.dispose();
      if(bimetal){st.geometry=band(a0,rf,-w/2,-w/2+w*0.42);br.geometry=band(a0,rf,-w/2+w*0.42,w/2);}
      else{st.geometry=new THREE.BufferGeometry();br.geometry=new THREE.BufferGeometry();}
      const u=0.62,a=a0+span*u;wts[k].piv.rotation.y=a;wts[k].wm.position.x=rf(u)+w/2+R*0.05;wts[k].piv.visible=bimetal;}
    plain.geometry.dispose();
    if(!bimetal){const Ro=R*(1+expand)+w/2,Ri=R*(1+expand)-w/2;const s=new THREE.Shape();s.absarc(0,0,Ro,0,TAU,false);const hp=new THREE.Path();hp.absarc(0,0,Ri,0,TAU,true);s.holes.push(hp);
      const geo=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:false,curveSegments:64});geo.rotateX(-Math.PI/2);geo.translate(0,-h/2,0);plain.geometry=geo;}
    else plain.geometry=new THREE.BufferGeometry();
  };
  g.userData.set(0,true);return g;
}

/* helical balance spring */
function springGeo(R,H,N,th,term=true,wire=0.0045){
  const c=new THREE.Curve();c.arcLengthDivisions=1200;
  const Re=R*N/(N+th/TAU*0.8),a0=0.1,tot=TAU*N+TAU,rc=R*0.2,rs=R*0.28;
  c.getPoint=(t,v=new THREE.Vector3())=>{let ang,r,y,ox=0,f;
    if(term){
      if(t<a0){const s=t/a0;ang=Math.PI*s;r=rc+(Re-rc)*Math.sin(s*Math.PI/2);y=H*0.05*s;}
      else if(t>1-a0){const s=(t-1+a0)/a0;ang=Math.PI+TAU*N+Math.PI*s;r=Re-(Re-rs)*(1-Math.cos(s*Math.PI/2));y=H*0.95+H*0.05*s;}
      else{const s=(t-a0)/(1-2*a0);ang=Math.PI+TAU*N*s;r=Re;y=H*0.05+H*0.9*s;}
      f=ang/tot;
    }else{
      if(t<0.04){const s=t/0.04;ang=0;r=rc+(Re-rc)*s;y=0;}
      else if(t>0.96){const s=(t-0.96)/0.04;ang=TAU*N;r=Re-(Re-rs)*s;y=H;}
      else{const s=(t-0.04)/0.92;ang=TAU*N*s;r=Re;y=H*s;ox=Math.sin(Math.PI*s)*0.45*R*(th/(TAU*0.6));}
      f=ang/(TAU*N);
    }
    const a=ang+th*(1-f);return v.set(r*Math.cos(a)+ox,y,-r*Math.sin(a));};
  return new THREE.TubeGeometry(c,Math.round(N*44),wire,6,false);
}

/* barrel + chain + fusee */
function makeFuseeSet(M,c){
  const g=new THREE.Group();const rf=m=>c.rmin/(1-c.drop*m/c.N),yf=m=>c.H*(1-m/c.N);const fx=c.d/2,bx=-c.d/2;
  const fz=new THREE.Group();fz.position.x=fx;g.add(fz);
  const pts=[new THREE.Vector2(0.001,0)];for(let i=0;i<=40;i++){const m=c.N*(1-i/40);pts.push(new THREE.Vector2(rf(m)-0.004,yf(m)));}pts.push(new THREE.Vector2(0.001,c.H));
  mesh(fz,new THREE.LatheGeometry(pts,56),M.brass);
  const gc=new THREE.Curve();gc.getPoint=(t,v=new THREE.Vector3())=>{const m=c.N*t,a=TAU*m;const r=rf(m)-0.003;return v.set(r*Math.cos(a),yf(m),r*Math.sin(a));};
  mesh(fz,new THREE.TubeGeometry(gc,c.N*40,0.0025,4,false),M.chain);
  mesh(fz,cylY(0.012,c.H+0.12,10),M.steel,0,c.H/2+0.02,0);
  mesh(fz,new THREE.BoxGeometry(0.018,0.05,0.018),M.steel,0,c.H+0.09,0);
  const bz=new THREE.Group();bz.position.x=bx;g.add(bz);
  mesh(bz,new THREE.CylinderGeometry(c.Rb,c.Rb,c.H,56),M.brass2,0,c.H/2,0);
  for(const y of[0.004,c.H-0.004])mesh(bz,new THREE.CylinderGeometry(c.Rb+0.012,c.Rb+0.012,0.012,56),M.brass,0,y,0);
  mesh(bz,cylY(0.014,0.02,10),M.steel,c.Rb*0.55,c.H+0.006,0);
  mesh(bz,cylY(0.012,c.H+0.12,10),M.steel,0,c.H/2,0);
  const chain=new THREE.Mesh(undefined,M.chain);g.add(chain);
  const I=m=>(c.rmin*(-c.N/c.drop)*Math.log(1-c.drop*m/c.N))/c.Rb;
  function setWind(n){
    fz.rotation.y=n*TAU;bz.rotation.y=I(n)*TAU;
    const P=[],V=(x,y,z)=>P.push(new THREE.Vector3(x,y,z));
    for(let m=c.N;m>n;m-=0.03){const a=-Math.PI/2+TAU*(m-n),r=rf(m);V(fx+r*Math.cos(a),yf(m),r*Math.sin(a));}
    const r0=rf(n),y0=yf(n);V(fx,y0,-r0);
    for(const s of[0.2,0.4,0.6,0.8])V(lerp(fx,bx,s),y0,-lerp(r0,c.Rb,s));
    V(bx,y0,-c.Rb);const In=I(n);
    for(let m=n-0.03;m>=0;m-=0.03){const b=-Math.PI/2-TAU*(In-I(m));V(bx+c.Rb*Math.cos(b),yf(m),c.Rb*Math.sin(b));}
    if(P.length<4)V(bx-c.Rb,y0,0);
    chain.geometry.dispose();chain.geometry=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P,false,'centripetal'),Math.min(1600,P.length*3),c.wire||0.0065,5,false);
  }
  return{g,fz,bz,setWind,rf,yf,fx,bx,I};
}

/* dial artwork */
function drawDial(ctx,S){
  const c=S/2;ctx.save();
  const g=ctx.createRadialGradient(c*0.75,c*0.65,S*0.04,c,c,c);g.addColorStop(0,'#fcfbf7');g.addColorStop(1,'#e5e1d5');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(c,c,c,0,TAU);ctx.fill();
  const ink='#1c1b18';ctx.strokeStyle=ink;ctx.fillStyle=ink;ctx.lineCap='butt';
  const r1=c*0.94,r2=c*0.87;ctx.lineWidth=S*0.0022;
  for(const r of[r1,r2]){ctx.beginPath();ctx.arc(c,c,r,0,TAU);ctx.stroke();}
  for(let i=0;i<60;i++){const a=i/60*TAU;ctx.lineWidth=i%5?S*0.0025:S*0.006;ctx.beginPath();ctx.moveTo(c+r2*Math.sin(a),c-r2*Math.cos(a));ctx.lineTo(c+r1*Math.sin(a),c-r1*Math.cos(a));ctx.stroke();}
  const RN=['XII','I','II','III','IIII','V','VI','VII','VIII','IX','X','XI'];
  ctx.font=`600 ${S*0.082}px Spectral, Georgia, serif`;ctx.textAlign='center';ctx.textBaseline='middle';
  for(let i=0;i<12;i++){if(i===0||i===6)continue;const a=i/12*TAU,r=c*0.72;ctx.fillText(RN[i],c+r*Math.sin(a),c-r*Math.cos(a)+S*0.004);}
  const sub=(cy)=>{ctx.lineWidth=S*0.0018;ctx.beginPath();ctx.arc(c,cy,c*0.24,0,TAU);ctx.stroke();};
  const sy=c+c*0.42;sub(sy);
  for(let i=0;i<60;i++){const a=i/60*TAU,ra=c*0.24,rb=i%5?c*0.215:c*0.2;ctx.lineWidth=i%5?S*0.0015:S*0.003;ctx.beginPath();ctx.moveTo(c+ra*Math.sin(a),sy-ra*Math.cos(a));ctx.lineTo(c+rb*Math.sin(a),sy-rb*Math.cos(a));ctx.stroke();}
  ctx.font=`${S*0.03}px Spectral, Georgia, serif`;
  for(let k=1;k<=6;k++){const a=k/6*TAU,r=c*0.16;ctx.fillText(String(k*10),c+r*Math.sin(a),sy-r*Math.cos(a));}
  const uy=c-c*0.42;ctx.lineWidth=S*0.0018;ctx.beginPath();ctx.arc(c,uy,c*0.24,(-90-120)*D2R,(-90+120)*D2R);ctx.stroke();
  for(let h=0;h<=56;h+=4){const a=(-120+240*h/56)*D2R,ra=c*0.24,rb=h%8?c*0.215:c*0.2;ctx.lineWidth=h%8?S*0.0015:S*0.003;ctx.beginPath();ctx.moveTo(c+ra*Math.sin(a),uy-ra*Math.cos(a));ctx.lineTo(c+rb*Math.sin(a),uy-rb*Math.cos(a));ctx.stroke();
    if(h%8===0){const r=c*0.165;ctx.font=`${S*0.026}px Spectral, Georgia, serif`;ctx.fillText(String(h),c+r*Math.sin(a),uy-r*Math.cos(a));}}
  ctx.font=`italic ${S*0.03}px Spectral, Georgia, serif`;
  ctx.fillText('Up',c-c*0.2,uy+c*0.17);ctx.fillText('Down',c+c*0.2,uy+c*0.17);
  ctx.font=`${S*0.032}px Spectral, Georgia, serif`;ctx.fillText('No. 1761',c,c-c*0.11);
  ctx.font=`italic ${S*0.03}px Spectral, Georgia, serif`;ctx.fillText('Two-day marine chronometer',c,c+c*0.11);
  ctx.restore();
}
let DIAL_CANVAS=null;
function dialCanvas(){if(!DIAL_CANVAS){DIAL_CANVAS=document.createElement('canvas');DIAL_CANVAS.width=DIAL_CANVAS.height=1024;drawDial(DIAL_CANVAS.getContext('2d'),1024);}return DIAL_CANVAS;}
function dialTexture(r){const t=new THREE.CanvasTexture(dialCanvas());t.encoding=THREE.sRGBEncoding;t.anisotropy=Math.min(8,r.capabilities.getMaxAnisotropy());return t;}
function shadowTex(){const cv=document.createElement('canvas');cv.width=cv.height=256;const x=cv.getContext('2d');const g=x.createRadialGradient(128,128,10,128,128,128);g.addColorStop(0,'rgba(0,0,0,0.45)');g.addColorStop(0.55,'rgba(0,0,0,0.2)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,256,256);return new THREE.CanvasTexture(cv);}

/* hands */
function handGeo(len,w,tail,spade){
  const s=new THREE.Shape();s.moveTo(-w/2,-tail);s.lineTo(w/2,-tail);
  if(spade){s.lineTo(w*0.3,len*0.55);s.lineTo(w*1.7,len*0.7);s.lineTo(0,len);s.lineTo(-w*1.7,len*0.7);s.lineTo(-w*0.3,len*0.55);}
  else{s.lineTo(w*0.3,len*0.85);s.lineTo(0,len);s.lineTo(-w*0.3,len*0.85);}
  s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:0.006,bevelEnabled:false});g.rotateX(-Math.PI/2);return g;
}
