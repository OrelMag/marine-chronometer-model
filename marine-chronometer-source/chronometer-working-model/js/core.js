/* core.js: helpers, materials (damascened nickel, gilt), textures, engraving, gear/spring/hand/pawl/escape-wheel geometry, dial, cross-section patch
   Part of 'The Marine Chronometer, working' (three.js r128). See README.md. */
"use strict";
const TAU=Math.PI*2,D2R=Math.PI/180;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),lerp=(a,b,t)=>a+(b-a)*t;
const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
const $=s=>document.querySelector(s);
const sc=h=>new THREE.Color(h).convertSRGBToLinear();

function envTex(r){
  const pm=new THREE.PMREMGenerator(r),s=new THREE.Scene();
  const g=new THREE.SphereGeometry(20,48,24),pos=g.attributes.position,col=[];
  for(let i=0;i<pos.count;i++){const t=(pos.getY(i)/20+1)/2,k=Math.pow(t,1.5);col.push(0.07+0.95*k,0.07+0.92*k,0.08+0.88*k);}
  g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
  s.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide})));
  const pl=(w,h,c,p)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:c,side:THREE.DoubleSide}));m.position.set(...p);m.lookAt(0,0,0);s.add(m);};
  pl(16,7,new THREE.Color(6,5.7,5.2),[-8,12,7]);pl(6,12,new THREE.Color(2.6,2.7,3),[13,3,-7]);pl(10,3,new THREE.Color(1.6,1.5,1.4),[0,-2,-15]);
  const t=pm.fromScene(s,0.025).texture;pm.dispose();return t;
}
/* Damascening (Hamilton Model 21 plates): broad parallel ridges ~2.5 mm apart with a gentle wave, as on the photographed movement.
   Returns {map, normal}; one 1024 px tile = 40 mm = 16 ridges. */
function stripeTex(){
  const N=1024,P=64,cm=document.createElement('canvas'),cn=document.createElement('canvas');cm.width=cm.height=cn.width=cn.height=N;
  const xm=cm.getContext('2d'),xn=cn.getContext('2d'),im=xm.createImageData(N,N),inn=xn.createImageData(N,N);
  const h=(x,y)=>{const w=y+7*Math.sin(TAU*x/N)+2.5*Math.sin(TAU*3*x/N+1.3);const t=(w%P+P)%P/P;return Math.pow(Math.sin(Math.PI*t),1.6);};
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const k=4*(y*N+x),v=h(x,y),dy=(h(x,y+1)-h(x,y-1))*0.5,dx=(h(x+1,y)-h(x-1,y))*0.5;
    const g=Math.round(255*(0.7+0.3*v));im.data[k]=im.data[k+1]=im.data[k+2]=g;im.data[k+3]=255;
    let nx=-dx*5,ny=dy*5,nz=1;const l=Math.hypot(nx,ny,nz);nx/=l;ny/=l;nz/=l;
    inn.data[k]=Math.round((nx*0.5+0.5)*255);inn.data[k+1]=Math.round((ny*0.5+0.5)*255);inn.data[k+2]=Math.round((nz*0.5+0.5)*255);inn.data[k+3]=255;}
  xm.putImageData(im,0,0);xn.putImageData(inn,0,0);
  const mk=(cv,srgb)=>{const t=new THREE.CanvasTexture(cv);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1/40,1/40);t.rotation=STRIPE_ANGLE;t.anisotropy=8;if(srgb)t.encoding=THREE.sRGBEncoding;return t;};
  return{map:mk(cm,true),normal:mk(cn,false)};
}
const STRIPE_ANGLE=-82.3*Math.PI/180;   /* ridge direction, in plate (shape) coordinates, from the photograph */
function woodTex(){
  const c=document.createElement('canvas');c.width=512;c.height=1024;const x=c.getContext('2d');
  x.fillStyle='#5a2413';x.fillRect(0,0,512,1024);
  let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  for(let i=0;i<260;i++){const xx=rnd()*512,w=0.6+rnd()*2.6,a=0.05+rnd()*0.14,ph=rnd()*6,amp=2+rnd()*9;
    x.strokeStyle=rnd()<0.5?`rgba(20,6,2,${a})`:`rgba(150,70,35,${a*0.8})`;x.lineWidth=w;x.beginPath();
    for(let y=0;y<=1024;y+=16){const px=xx+Math.sin(y/140+ph)*amp+Math.sin(y/37+ph*2)*amp*0.25;y?x.lineTo(px,y):x.moveTo(px,y);}x.stroke();}
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;
}
/* Engraving textures are mapped to the movement: canvas centre = movement centre, 96 mm across,
   canvas up = 6 o'clock (+z), so text reads upright when the movement is viewed from the bridge side. */
function engraveCanvas(draw){const S=1024,c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d');const k=S/96;
  x.fillStyle='rgba(38,40,42,0.78)';x.textAlign='center';x.textBaseline='middle';draw(x,S,k);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t;}
function engraveArc(x,S,k,txt,r,psiDeg,spreadDeg,size){x.font=`600 ${size*k}px Spectral, Georgia, serif`;const ch=[...txt],n=ch.length,phi0=-psiDeg*D2R,sp=spreadDeg*D2R;
  ch.forEach((q,i)=>{const phi=phi0+((n-1)/2-i)*sp;x.save();x.translate(S/2+r*k*Math.cos(phi),S/2+r*k*Math.sin(phi));x.rotate(phi-Math.PI/2);x.fillText(q,0,0);x.restore();});}
function engraveLines(x,S,k,lines,cx,cz,size,gap,rotDeg=0){x.save();x.translate(S/2+cx*k,S/2-cz*k);x.rotate(rotDeg*D2R);lines.forEach((t,i)=>{const sz=Array.isArray(t)?t[1]:size;x.font=`600 ${sz*k}px Spectral, Georgia, serif`;x.fillText(Array.isArray(t)?t[0]:t,0,(i-(lines.length-1)/2)*gap*k);});x.restore();}
/* flat decal with the outline of a bridge, UV-mapped to the engraving canvas */
function decalGeo(poly){const s=new THREE.Shape();poly.forEach(([x,z],i)=>i?s.lineTo(x,z):s.moveTo(x,z));const g=new THREE.ShapeGeometry(s,24);
  const p=g.attributes.position,uv=g.attributes.uv,n=g.attributes.normal;
  for(let i=0;i<p.count;i++){const X=p.getX(i),Z=p.getY(i);p.setXYZ(i,X,0,Z);uv.setXY(i,(X+48)/96,(Z+48)/96);n.setXYZ(i,0,-1,0);}
  p.needsUpdate=uv.needsUpdate=n.needsUpdate=true;return g;}
/* escape wheel after the manual's Fig. 14: thin four-spoke rim carrying tall crown teeth */
function escapeWheel(parent,M,rt,y){
  const teeth=new THREE.Mesh(gearGeo(15,1,1.3,{escape:true,flip:true,rt,depth:rt*0.23,bore:rt*0.7}),M.gilt);teeth.position.y=y-0.1;parent.add(teeth);
  const web=new THREE.Shape();web.absarc(0,0,rt*0.72,0,TAU,false);for(let j=0;j<4;j++){const a0=j/4*TAU+0.12,a1=(j+1)/4*TAU-0.12,h=new THREE.Path();h.absarc(0,0,rt*0.62,a0,a1,false);h.absarc(0,0,1.3,a1,a0,true);web.holes.push(h);}
  const hb=new THREE.Path();hb.absarc(0,0,0.5,0,TAU,true);web.holes.push(hb);
  const wg=new THREE.ExtrudeGeometry(web,{depth:0.5,bevelEnabled:false,curveSegments:24});wg.rotateX(-Math.PI/2);wg.translate(0,-0.25,0);
  const wm=new THREE.Mesh(wg,M.gilt);wm.position.y=y+0.3;parent.add(wm);
  return teeth;
}
const PLATE_FINISH={nickel:0xeceeea,gilt:0xe0bd74};
function mats(){
  const S=(c,m,r,x={})=>new THREE.MeshStandardMaterial(Object.assign({color:sc(c),metalness:m,roughness:r},x));
  const stx=stripeTex(),st=stx.map,wt=woodTex();
  /* Plates and bridges: nickel with damascening (Hamilton Model 21 plates were nickel). Wheels, fusee, barrel: gilt brass, slightly tarnished. */
  const M={plate:S(PLATE_FINISH.nickel,1,0.2,{map:st,normalMap:stx.normal,normalScale:new THREE.Vector2(0.7,0.7)}),plateSolid:S(PLATE_FINISH.nickel,1,0.3),gilt:S(0xcaa45a,1,0.34),brass:S(0xd4a955,1,0.3),brass2:S(0xb8903f,1,0.42),copper:S(0xc98d52,1,0.34),
    steel:S(0xdcdfe4,1,0.17),steelD:S(0x8f959d,1,0.3),blued:S(0x1a2c7a,0.9,0.24),ruby:S(0xc8163c,0.1,0.12,{emissive:sc(0x3a0010)}),
    chain:S(0x8c9199,1,0.3),chain2:S(0x6c717a,1,0.35),delrin:S(0xf1e8d6,0,0.55),mspring:S(0x3c4a70,0.9,0.3,{side:THREE.DoubleSide}),
    wood:S(0x9c7466,0,0.36,{map:wt}),woodEdge:S(0x3a130a,0,0.45),felt:S(0x1d3a2e,0,0.95),glass:S(0xffffff,0,0.02,{transparent:true,opacity:0.12,depthWrite:false}),
    invar:S(0xa7aaa6,1,0.28)};
  M.brassDS=M.brass.clone();M.brassDS.side=THREE.DoubleSide;
  M.setPlateFinish=k=>{const c=sc(PLATE_FINISH[k]);for(const m of[M.plate,M.plateSolid]){m.color.copy(c);const g=GHOST.get(m);if(g)g.color.copy(c);}};
  const eng=t=>new THREE.MeshStandardMaterial({map:t,transparent:true,metalness:0.6,roughness:0.6,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});
  /* engraving in columns as on the photographed movement (text runs along -x, lines stack toward +z; maker's name omitted); the two lines nearest the fusee are shortened to clear the dust-seal flange */
  M.engraveB=eng(engraveCanvas((x,S,k)=>{const cols=[["MODEL 21, 14 JEWELS",0.53,-30.50,17.84,1.64],["MARINE CHRONOMETER",-2.56,-26.57,17.58,2.2],["TWO-DAY, 56 HOURS",-2.03,-24.19,11.12,1.4],["\u24c3 1761-1941",-7.28,-17.85,13.54,2.79],["MADE IN U.S.A.",-11.74,-19.05,9.84,1.80]];
    x.save();for(const[t,cx,cz,len,sz]of cols){x.save();x.translate(S/2+cx*k,S/2-cz*k);x.rotate(Math.atan2(-0.2161,-0.9764));
      x.font=`600 ${sz*k}px "Instrument Sans", Arial, sans-serif`;const w=x.measureText(t).width;const f=Math.min(1,len*k/w);x.scale(f,1);x.fillText(t,0,0);x.restore();}x.restore();}));
  M.engraveT=eng(engraveCanvas(()=>{}));
  return M;
}
/* ---------- cross-section support: clip plane + hatched caps on back faces ---------- */
const SEC={on:{value:0},col:{value:new THREE.Color(0.58,0.12,0.09)},mats:new Set()};
function patchSection(m,cap){
  if(!m||m.userData.secPatched)return;m.userData.secPatched=true;m.userData.secCap=cap;m.userData.side0=m.side;m.clipShadows=true;if(!m.clippingPlanes)m.clippingPlanes=[];SEC.mats.add(m);
  m.onBeforeCompile=sh=>{sh.uniforms.uSecOn=SEC.on;sh.uniforms.uSecCol=SEC.col;
    sh.fragmentShader='uniform float uSecOn;\nuniform vec3 uSecCol;\n'+sh.fragmentShader.replace('#include <dithering_fragment>','#include <dithering_fragment>\n'+(cap?
      'if(uSecOn>0.5&&!gl_FrontFacing){float st=step(0.5,fract((gl_FragCoord.x+gl_FragCoord.y)/9.0));vec3 cc=mix(uSecCol,diffuseColor.rgb,0.28)*(0.78+0.22*st);gl_FragColor=vec4(pow(max(cc,vec3(0.0)),vec3(1.0/2.2)),1.0);}':''));};
  m.customProgramCacheKey=()=>'sec'+(cap?1:0);
  m.needsUpdate=true;
}
function setSection(on,plane){SEC.on.value=on?1:0;for(const m of SEC.mats){m.clippingPlanes=on?[plane]:[];m.side=on&&m.userData.secCap?THREE.DoubleSide:m.userData.side0;m.needsUpdate=true;}}
const GHOST=new Map();
function ghostOf(m){let g=GHOST.get(m);if(!g){g=m.clone();g.transparent=true;g.opacity=Math.min(0.16,m.opacity??1);g.depthWrite=false;g.userData={};patchSection(g,false);
  if(SEC.on.value>0.5)g.clippingPlanes=[...(m.clippingPlanes||[])];GHOST.set(m,g);}return g;}
/* mainspring: w=1 fully wound (coils on the arbor), w=0 run down (coils against the wall) */
function mainspringGeo(w,ra,Rw,y0,y1,turns){
  const N=900,pos=[],idx=[],tot=TAU*turns,pack=2.6;
  for(let i=0;i<=N;i++){const t=i/N;let r=lerp(Rw-0.25-(1-t)*pack,ra+0.2+t*pack,w);
    if(t>0.965)r=lerp(r,Rw-0.2,(t-0.965)/0.035);if(t<0.02)r=lerp(ra,r,t/0.02);
    const a=-tot*t,x=r*Math.cos(a),z=-r*Math.sin(a);pos.push(x,y0,z,x,y1,z);if(i<N){const k=i*2;idx.push(k,k+1,k+2,k+1,k+3,k+2);}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;
}
function ringGeo(ro,ri,h){const s=new THREE.Shape();s.absarc(0,0,ro,0,TAU,false);const hp=new THREE.Path();hp.absarc(0,0,ri,0,TAU,true);s.holes.push(hp);
  const g=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:false,curveSegments:48});g.rotateX(-Math.PI/2);g.translate(0,-h/2,0);return g;}
/* pawl / click: round pivot boss at the origin, tapered arm along -x ending in a hooked tip */
function pawlGeo(len,w,th,centre){const s=new THREE.Shape(),r=w*0.72;s.moveTo(0,r);s.absarc(0,0,r,Math.PI/2,-Math.PI/2,true);
  s.lineTo(-len*0.8,-w*0.26);s.lineTo(-len,-w*0.62);s.lineTo(-len*0.96,w*0.08);s.quadraticCurveTo(-len*0.5,w*0.42,0,r);
  const h=new THREE.Path();h.absarc(0,0,r*0.35,0,TAU,true);s.holes.push(h);
  const g=new THREE.ExtrudeGeometry(s,{depth:th,bevelEnabled:false,curveSegments:16});g.rotateX(-Math.PI/2);g.translate(centre?len/2:0,-th/2,0);return g;}
function mesh(p,geo,mat,x=0,y=0,z=0){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);p.add(m);return m;}
function cylY(r,h,seg=20){return new THREE.CylinderGeometry(r,r,h,seg);}
function cylBetween(p,r,y0,y1,mat,x=0,z=0,seg=16){return mesh(p,cylY(r,Math.abs(y1-y0),seg),mat,x,(y0+y1)/2,z);}
function discGeo(r,th,holes=[]){const s=new THREE.Shape();s.absarc(0,0,r,0,TAU,false);for(const[hx,hz,hr]of holes){const h=new THREE.Path();h.absarc(hx,-hz,hr,0,TAU,true);s.holes.push(h);}
  const g=new THREE.ExtrudeGeometry(s,{depth:th,bevelEnabled:false,curveSegments:64});g.rotateX(-Math.PI/2);return g;}
/* gear: pitch radius = m*n/2 */
function gearGeo(n,m,th,o={}){
  const rp=m*n/2,ro=o.escape?o.rt:rp+m*0.95,depth=o.escape?o.depth:2.25*m,ri=ro-depth,p=TAU/n,pts=[];
  for(let i=0;i<n;i++){const a=i*p;
    if(o.escape){pts.push([ri,a],[ro,a+p*0.03]);for(let k=1;k<=5;k++){const f=k/5;pts.push([ro-(ro-ri)*Math.pow(f,0.55),a+p*(0.03+0.62*f)]);}pts.push([ri,a+p*0.97]);}
    else if(o.ratchet){pts.push([ri,a],[ro,a+p*0.9],[ri,a+p*0.97]);}
    else pts.push([ri,a],[ri,a+p*0.1],[ro-depth*0.3,a+p*0.18],[ro,a+p*0.28],[ro,a+p*0.47],[ro-depth*0.3,a+p*0.57],[ri,a+p*0.65]);}
  let xy=pts.map(([r,a])=>[r*Math.cos(a),r*Math.sin(a)]);if(o.flip)xy=xy.map(([x,y])=>[x,-y]).reverse();
  const s=new THREE.Shape();s.moveTo(...xy[0]);for(let i=1;i<xy.length;i++)s.lineTo(...xy[i]);s.closePath();
  if(o.spokes){const R1=ri-(o.rim??Math.max(0.9,ro*0.09)),R0=o.hub??Math.max(1.6,ro*0.18),sw=o.sw??Math.max(0.9,ro*0.08);
    if(R1>R0+1)for(let j=0;j<o.spokes;j++){const a0=j/o.spokes*TAU,a1=(j+1)/o.spokes*TAU,d1=Math.asin(Math.min(0.9,sw/2/R1)),d0=Math.asin(Math.min(0.9,sw/2/R0));
      const h=new THREE.Path();h.absarc(0,0,R1,a0+d1,a1-d1,false);h.absarc(0,0,R0,a1-d0,a0+d0,true);s.holes.push(h);}}
  if(o.bore){const h=new THREE.Path();h.absarc(0,0,o.bore,0,TAU,true);s.holes.push(h);}
  const g=new THREE.ExtrudeGeometry(s,{depth:th,bevelEnabled:false,curveSegments:24});g.rotateX(-Math.PI/2);g.translate(0,-th/2,0);return g;
}
/* arbor with wheel & pinion: returns rotating group */
function arbor(parent,M,x,z,o){
  const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);
  if(o.wheel){const w=o.wheel;g.userData.wheel=mesh(g,gearGeo(w.n,w.m,w.th||1,{spokes:w.spokes??4,escape:w.escape,flip:w.flip,rt:w.rt,depth:w.depth,bore:w.bore}),w.mat||M.gilt,0,w.y,0);g.userData.nw=w.n;
    if(w.collet!==0)mesh(g,cylY(w.collet||1.6,(w.th||1)+1.2,20),M.brass2,0,w.y,0);}
  if(o.pin){const p=o.pin;g.userData.pin=mesh(g,gearGeo(p.n||10,p.m,p.th||2.5,{bore:p.bore}),M.steel,0,p.y,0);g.userData.np=p.n||10;}
  if(o.ar){const[a,b]=o.ar;cylBetween(g,o.r||0.55,a,b,M.steel,0,0,12);}
  return g;
}
function springGeo(R,H,N,th,wire){
  const c=new THREE.Curve();c.arcLengthDivisions=1400;
  const Re=R*N/(N+th/TAU*0.8),a0=0.09,tot=TAU*N+TAU,rc=R*0.2,rs=R*0.3;
  c.getPoint=(t,v=new THREE.Vector3())=>{let ang,r,y;
    if(t<a0){const s=t/a0;ang=Math.PI*s;r=rc+(Re-rc)*Math.sin(s*Math.PI/2);y=H*0.05*s;}
    else if(t>1-a0){const s=(t-1+a0)/a0;ang=Math.PI+TAU*N+Math.PI*s;r=Re-(Re-rs)*(1-Math.cos(s*Math.PI/2));y=H*0.95+H*0.05*s;}
    else{const s=(t-a0)/(1-2*a0);ang=Math.PI+TAU*N*s;r=Re;y=H*0.05+H*0.9*s;}
    const a=ang+th*(1-ang/tot);return v.set(r*Math.cos(a),y,-r*Math.sin(a));};
  return new THREE.TubeGeometry(c,Math.round(N*46),wire,6,false);
}
function handGeo(len,w,tail,kind){
  const s=new THREE.Shape();s.moveTo(-w/2,-tail);s.lineTo(w/2,-tail);
  if(kind==='spade'){s.lineTo(w*0.3,len*0.6);s.quadraticCurveTo(w*1.3,len*0.68,w*0.95,len*0.8);s.lineTo(0,len);s.lineTo(-w*0.95,len*0.8);s.quadraticCurveTo(-w*1.3,len*0.68,-w*0.3,len*0.6);}
  else{s.lineTo(w*0.3,len*0.85);s.lineTo(0,len);s.lineTo(-w*0.3,len*0.85);}
  s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:0.35,bevelEnabled:false});g.rotateX(-Math.PI/2);return g;
}
/* silvered dial, 4 inch */
function dialCanvas(){
  const S=1536,c=S/2,cv=document.createElement('canvas');cv.width=cv.height=S;const x=cv.getContext('2d');
  const g=x.createRadialGradient(c*0.7,c*0.6,S*0.05,c,c,c);g.addColorStop(0,'#f4f4f1');g.addColorStop(1,'#d9dad6');
  x.fillStyle=g;x.beginPath();x.arc(c,c,c,0,TAU);x.fill();
  x.globalAlpha=0.06;x.strokeStyle='#000';for(let r=6;r<c;r+=5){x.lineWidth=1;x.beginPath();x.arc(c,c,r,0,TAU);x.stroke();}x.globalAlpha=1;
  const ink='#17181a';x.strokeStyle=ink;x.fillStyle=ink;
  const r1=c*0.955,r2=c*0.905;x.lineWidth=S*0.0018;for(const r of[r1,r2]){x.beginPath();x.arc(c,c,r,0,TAU);x.stroke();}
  for(let i=0;i<60;i++){const a=i/60*TAU;x.lineWidth=i%5?S*0.0022:S*0.0055;const ra=i%5?r2:c*0.885;x.beginPath();x.moveTo(c+ra*Math.sin(a),c-ra*Math.cos(a));x.lineTo(c+r1*Math.sin(a),c-r1*Math.cos(a));x.stroke();}
  x.font=`600 ${S*0.085}px Spectral, Georgia, serif`;x.textAlign='center';x.textBaseline='middle';
  for(let i=1;i<=12;i++){const a=i/12*TAU,r=c*0.8;x.fillText(String(i),c+r*Math.sin(a),c-r*Math.cos(a)+S*0.003);}
  const sub=(cy,r)=>{x.lineWidth=S*0.0016;x.beginPath();x.arc(c,cy,r,0,TAU);x.stroke();};
  const k=0.472,rs=c*0.24,sy=c+c*k,uy=c-c*k;
  sub(sy,rs);for(let i=0;i<60;i++){const a=i/60*TAU,rb=i%5?rs*0.9:rs*0.82;x.lineWidth=i%5?S*0.0014:S*0.003;x.beginPath();x.moveTo(c+rs*Math.sin(a),sy-rs*Math.cos(a));x.lineTo(c+rb*Math.sin(a),sy-rb*Math.cos(a));x.stroke();}
  x.font=`${S*0.024}px Spectral, Georgia, serif`;for(let q=1;q<=12;q++){const a=q/12*TAU,r=rs*0.66;x.fillText(String(q*5),c+r*Math.sin(a),sy-r*Math.cos(a));}
  /* up/down scale as Fig. 107: UP at the upper right, hours since winding increasing clockwise round the bottom to DOWN at the upper left
     (winding turns the hand counterclockwise back to UP, manual Sec. III) */
  x.lineWidth=S*0.0016;x.beginPath();x.arc(c,uy,rs,(-30)*D2R,(210)*D2R);x.stroke();
  for(let h=0;h<=56;h+=2){const a=(60+240*h/56)*D2R,rb=h%8?rs*0.9:rs*0.8;x.lineWidth=h%8?S*0.0012:S*0.003;x.beginPath();x.moveTo(c+rs*Math.sin(a),uy-rs*Math.cos(a));x.lineTo(c+rb*Math.sin(a),uy-rb*Math.cos(a));x.stroke();
    if(h%8===0&&h>0&&h<56){const r=rs*0.62;x.font=`${S*0.024}px Spectral, Georgia, serif`;x.fillText(String(h),c+r*Math.sin(a),uy-r*Math.cos(a));}}
  x.font=`600 ${S*0.024}px Spectral, Georgia, serif`;x.fillText('UP',c+rs*0.62,uy-rs*0.72);x.fillText('DOWN',c-rs*0.62,uy-rs*0.72);
  x.font=`italic ${S*0.028}px Spectral, Georgia, serif`;x.fillText('Two-day marine chronometer',c,c+c*0.15);
  return cv;
}
