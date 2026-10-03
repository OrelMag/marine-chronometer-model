/* core.js: helpers, materials (damascened nickel, gilt), textures, engraving, gear/spring/hand/pawl/escape-wheel geometry, dial, cross-section patch, drawing (tinted or in ink)
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
/* plainFaces(m,uv0,top): the damascening kept only on a plate's faces turned to the train side (their normal toward -y in the movement), or on none (top false):
   on every other face (the underside, the edges, a bevel) each vertex's uv is pinned to uv0 (M.plateCrest), so those faces read plain, as the restoration video
   shows the bridges' undersides and polished edges. An indexed geometry is made non-indexed first, so a corner's vertex isn't shared between faces */
function plainFaces(m,uv0,top=true,root=null){let g=m.geometry;if(!g.attributes.uv)return;if(g.index){const u=g.userData;g=g.toNonIndexed();g.userData=u;m.geometry=g;}
  const R=new THREE.Matrix4().copy(m.matrixWorld);if(root)R.premultiply(new THREE.Matrix4().copy(root.matrixWorld).invert());const N=new THREE.Matrix3().getNormalMatrix(R);
  const p=g.attributes.position,uv=g.attributes.uv,a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3();
  for(let i=0;i+2<p.count;i+=3){a.fromBufferAttribute(p,i);b.fromBufferAttribute(p,i+1).sub(a);c.fromBufferAttribute(p,i+2).sub(a);const n=b.cross(c).applyMatrix3(N).normalize();
    if(top&&n.y<-0.9)continue;for(let k=0;k<3;k++)uv.setXY(i+k,uv0[0],uv0[1]);}
  uv.needsUpdate=true;}
/* Damascening (Hamilton Model 21 plates): broad parallel ridges ~2.5 mm apart with a gentle wave, as on the photographed movement.
   Returns {map, normal}; one 1024 px tile = 40 mm = 16 ridges. */
function stripeTex(){
  const N=1024,P=64,cm=document.createElement('canvas'),cn=document.createElement('canvas');cm.width=cm.height=cn.width=cn.height=N;
  const xm=cm.getContext('2d'),xn=cn.getContext('2d'),im=xm.createImageData(N,N),inn=xn.createImageData(N,N);
  /* height h(x,y) = sin(pi*t)^1.6 of the ridge phase t, the ridges waving with x. Each h is computed once, in three rolling rows (rows y-1, y, y+1 over
     x = -1..N), not five times over for the slopes, and the wave per column once: the same pixels as the direct formula, about a fifth of the time */
  const A=new Float64Array(N+2),B=new Float64Array(N+2);for(let x=-1;x<=N;x++){A[x+1]=7*Math.sin(TAU*x/N);B[x+1]=2.5*Math.sin(TAU*3*x/N+1.3);}
  const row=(y,o)=>{for(let i=0;i<N+2;i++){const w=y+A[i]+B[i],t=(w%P+P)%P/P;o[i]=Math.pow(Math.sin(Math.PI*t),1.6);}return o;};
  let r0=row(-1,new Float64Array(N+2)),r1=row(0,new Float64Array(N+2)),r2=new Float64Array(N+2);const dm=im.data,dn=inn.data;
  for(let y=0;y<N;y++){row(y+1,r2);
    for(let x=0;x<N;x++){const k=4*(y*N+x),v=r1[x+1],dy=(r2[x+1]-r0[x+1])*0.5,dx=(r1[x+2]-r1[x])*0.5;
      const g=Math.round(255*(0.7+0.3*v));dm[k]=dm[k+1]=dm[k+2]=g;dm[k+3]=255;
      let nx=-dx*5,ny=dy*5,nz=1;const l=Math.sqrt(nx*nx+ny*ny+1);nx/=l;ny/=l;nz/=l;
      dn[k]=Math.round((nx*0.5+0.5)*255);dn[k+1]=Math.round((ny*0.5+0.5)*255);dn[k+2]=Math.round((nz*0.5+0.5)*255);dn[k+3]=255;}
    const t=r0;r0=r1;r1=r2;r2=t;}
  xm.putImageData(im,0,0);xn.putImageData(inn,0,0);
  const mk=(cv,srgb)=>{const t=new THREE.CanvasTexture(cv);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1/40,1/40);t.rotation=STRIPE_ANGLE;t.anisotropy=8;if(srgb)t.encoding=THREE.sRGBEncoding;return t;};
  return{map:mk(cm,true),normal:mk(cn,false)};
}
const STRIPE_ANGLE=(-82.3-19.42)*Math.PI/180;   /* ridge direction, in plate (shape) coordinates, from the photograph, turned with the photographed group (movement.js, PHOTO_TURN 19.42 deg) */
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
/* letters of t spread (or squeezed) to width w, centred on the origin; gx narrows each letter first, as on the engraved plates */
function fillTracked(x,t,w,gx=1){const cs=[...t],ws=cs.map(q=>x.measureText(q).width),n=ws.reduce((s,v)=>s+v,0),W=w/gx,g=cs.length>1?Math.max(0,(W-n)/(cs.length-1)):0;
  x.save();x.scale(gx*Math.min(1,W/n),1);x.textAlign='left';let px=-(n+g*(cs.length-1))/2;cs.forEach((q,i)=>{x.fillText(q,px,0);px+=ws[i]+g;});x.restore();}
function engraveLines(x,S,k,lines,cx,cz,size,gap,rotDeg=0){x.save();x.translate(S/2+cx*k,S/2-cz*k);x.rotate(rotDeg*D2R);lines.forEach((t,i)=>{const sz=Array.isArray(t)?t[1]:size;x.font=`600 ${sz*k}px Spectral, Georgia, serif`;x.fillText(Array.isArray(t)?t[0]:t,0,(i-(lines.length-1)/2)*gap*k);});x.restore();}
/* flat decal with the outline of a bridge, UV-mapped to the engraving canvas */
function decalGeo(poly,uvOf=q=>q){const s=new THREE.Shape();poly.forEach(([x,z],i)=>i?s.lineTo(x,z):s.moveTo(x,z));const g=new THREE.ShapeGeometry(s,24);
  const p=g.attributes.position,uv=g.attributes.uv,n=g.attributes.normal;
  for(let i=0;i<p.count;i++){const X=p.getX(i),Z=p.getY(i),[U,V]=uvOf([X,Z]);p.setXYZ(i,X,0,Z);uv.setXY(i,(U+48)/96,(V+48)/96);n.setXYZ(i,0,-1,0);}   /* uvOf: an engraving drawn in another frame (the photographs', PTi) */
  p.needsUpdate=uv.needsUpdate=n.needsUpdate=true;return g;}
/* escape wheel (Figs. 14, 90; an original photographed in chronometerbook post 30): a thin plate (0.5 mm), its rim (0.5 mm wide) and four crossed spokes to a round collet,
   and on the plate's edge 16 thorn teeth standing the wheel's full 1.3 mm (Fig. 14's cut-away: tall teeth on a thin rim), each its outline E.toothPts from the escapement's solver
   closed along the root circle, where the plate ends (no face of the one lies on a face of the other). The tooth tips lie at angles k*P in the wheel's frame */
function escapeWheel(parent,M,rt,y,E){
  const R=rt*E.r0,gs=[];
  for(let k=0;k<16;k++){const a=k*E.P,q=E.toothPts(a).slice(0,-1),a0=a+E.settings.B*E.P,a1=a+E.U*E.P;for(let i=1;i<12;i++)q.push([E.r0,a0+(a1-a0)*i/12]);   /* back root to front root along the root circle */
    gs.push([extrude(new THREE.Shape(q.map(([r,b])=>new THREE.Vector2(r*rt*Math.cos(b),-r*rt*Math.sin(b)))),{depth:1.3,bevelEnabled:false}),new THREE.Matrix4()]);}
  const tg=mergeGeo(gs);tg.rotateX(-Math.PI/2);tg.translate(0,-0.65,0);
  const teeth=new THREE.Mesh(tg,M.gilt);teeth.position.y=y-0.1;parent.add(teeth);
  const web=new THREE.Shape(),R1=R-0.5,R0=1.5,sw=0.5;web.absarc(0,0,R,0,TAU,false);
  for(let j=0;j<4;j++){const a0=j/4*TAU+0.3,a1=(j+1)/4*TAU+0.3,d1=Math.asin(sw/2/R1),d0=Math.asin(sw/2/R0),h=new THREE.Path();h.absarc(0,0,R1,a0+d1,a1-d1,false);h.absarc(0,0,R0,a1-d0,a0+d0,true);web.holes.push(h);}
  const hb=new THREE.Path();hb.absarc(0,0,0.5,0,TAU,true);web.holes.push(hb);
  const wg=extrude(web,{depth:0.5,bevelEnabled:false,curveSegments:128});wg.rotateX(-Math.PI/2);wg.translate(0,-0.25,0);
  const wm=new THREE.Mesh(wg,M.gilt);wm.position.y=y+0.3;parent.add(wm);
  return teeth;
}
const PLATE_FINISH={nickel:0xeceeea,gilt:0xe0bd74};
const SERIAL='2E12055';   /* the photographed movement's serial: engraved on the plates, printed on the Hamilton dial */
function mats(){
  const S=(c,m,r,x={})=>new THREE.MeshStandardMaterial(Object.assign({color:sc(c),metalness:m,roughness:r},x));
  const stx=stripeTex(),st=stx.map,wt=woodTex();
  /* Plates and bridges: nickel with damascening (Hamilton Model 21 plates were nickel). Wheels, fusee, barrel: gilt brass, slightly tarnished. */
  const M={plate:S(PLATE_FINISH.nickel,1,0.2,{map:st,normalMap:stx.normal,normalScale:new THREE.Vector2(0.7,0.7)}),plateSolid:S(PLATE_FINISH.nickel,1,0.3),gilt:S(0xcaa45a,1,0.34),brass:S(0xd4a955,1,0.3),brass2:S(0xb8903f,1,0.42),copper:S(0xc98d52,1,0.34),
    steel:S(0xdcdfe4,1,0.17),steelD:S(0x8f959d,1,0.3),steelS:S(0xbcc0c5,1,0.36),blued:S(0x1a2c7a,0.9,0.24),ruby:S(0xc8163c,0.1,0.12,{emissive:sc(0x3a0010)}),
    chain:S(0x8c9199,1,0.3),chain2:S(0x6c717a,1,0.35),delrin:S(0xf1e8d6,0,0.55),mspring:S(0x3c4a70,0.9,0.3),
    wood:S(0x9c7466,0,0.36,{map:wt}),woodEdge:S(0x3a130a,0,0.45),felt:S(0x1d3a2e,0,0.95),packing:S(0x1c1c1e,0,0.93),glass:S(0xffffff,0,0.02,{transparent:true,opacity:0.12,depthWrite:false}),
    invar:S(0xa7aaa6,1,0.28)};
  /* plateCrest: a uv on one of the damascening's ridge crests (row 29.6 of the tile at its left edge, where the map is brightest and its normal flat), through the
     map's transform: plainFaces pins a plate's faces off its train side there, so they read as plain nickel */
  M.plateCrest=(()=>{st.updateMatrix();const v=new THREE.Vector3(0.5/1024,1-30.1/1024,1).applyMatrix3(st.matrix.clone().invert());return[v.x,v.y];})();
  M.brassDS=M.brass.clone();M.brassDS.side=THREE.DoubleSide;
  M.setPlateFinish=k=>{const c=sc(PLATE_FINISH[k]);for(const m of[M.plate,M.plateSolid])m.color.copy(c);};   /* see-through and faded copies follow on the next look() (syncMat) */
  const eng=t=>{const m=new THREE.MeshStandardMaterial({map:t,transparent:true,metalness:0.6,roughness:0.6,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});m.userData.inkDecal=true;return m;};   /* inkDecal: the ink drawing inks it under its alpha */
  /* engraving as on a photographed movement (serial 2E12055): text runs along -x, lines stack toward +z. Lengths, sizes and offsets measured on that photograph
     against the top-view tracing (tools/engr.json); the three-line block sits 2.5 mm nearer the rim than traced, so its full-length lines clear the dust-seal flange and the barrel pillar screw */
  const engr=(x,S,k,cols)=>{for(const[t,cx,cz,len,sz]of cols){x.save();x.translate(S/2+cx*k,S/2-cz*k);x.rotate(Math.atan2(-0.2161,-0.9764));
    x.font=`600 ${sz*k}px "Instrument Sans", Arial, sans-serif`;fillTracked(x,t,len*k,0.8);x.restore();}};
  M.engraveB=eng(engraveCanvas((x,S,k)=>engr(x,S,k,[["MODEL 21, 14 JEWELS",-0.01,-32.94,17.6,1.9],["HAMILTON WATCH CO.",0.71,-30.34,24.4,2.5],["LANCASTER, PENNA.",1.01,-27.64,15.9,1.95],
    ["MADE IN U.S.A.",-11.55,-21.89,10.9,1.9],[SERIAL,-7.24,-17.82,8.1,2.7]])));
  M.engraveT=eng(engraveCanvas((x,S,k)=>engr(x,S,k,[[SERIAL,10.53,35.06,9.3,2.7]])));   /* the serial again on the train bridge at 6 o'clock, where the barrel bridge is cut away */
  return M;
}
/* ---------- cross-section support: clip plane + hatched caps on back faces ---------- */
const SEC={on:{value:0},col:{value:new THREE.Color(0.58,0.12,0.09)},mats:new Set()};
/* a cut face (a back face seen through the cut) is drawn 0.015 mm nearer than it lies: at its own depth it z-fought the part lying on that face (the barrel
   bridge on the train bridge, a plate on its pillar) and showed it through the cut in patches. Not at the plane itself: the far side of an uncut part is a back
   face too, and would cover everything. Compiled in only while a section is on (setSection recompiles), as a shader that writes depth loses early depth testing */
const secDepth=m=>!!m.userData.secCap&&SEC.on.value>0.5;
const SEC_DEPTH='\n#if NUM_CLIPPING_PLANES>0&&(__VERSION__>=300||defined(GL_EXT_frag_depth))\n{float fd=gl_FragCoord.z;'+
  'if(uSecOn>0.5&&!gl_FrontFacing&&!isOrthographic){vec3 q=-vClipPosition;vec4 c=projectionMatrix*vec4(q*(1.0-0.015/length(q)),1.0);fd=0.5*c.z/c.w+0.5;}gl_FragDepthEXT=fd;}\n#endif';
function patchSection(m,cap){
  if(!m||m.userData.secPatched)return;m.userData.secPatched=true;m.userData.secCap=cap;m.userData.side0=m.side;m.clipShadows=true;if(!m.clippingPlanes)m.clippingPlanes=[];SEC.mats.add(m);
  if(cap)m.extensions={fragDepth:true};
  m.onBeforeCompile=sh=>{sh.uniforms.uSecOn=SEC.on;sh.uniforms.uSecCol=SEC.col;const dp=secDepth(m);
    sh.fragmentShader='uniform float uSecOn;\nuniform vec3 uSecCol;\n'+(dp?'uniform mat4 projectionMatrix;\n':'')+sh.fragmentShader.replace('#include <dithering_fragment>','#include <dithering_fragment>\n'+(cap?
      'if(uSecOn>0.5&&!gl_FrontFacing){float st=step(0.5,fract((gl_FragCoord.x+gl_FragCoord.y)/9.0));vec3 cc=mix(uSecCol,diffuseColor.rgb,0.28)*(0.78+0.22*st);gl_FragColor=vec4(pow(max(cc,vec3(0.0)),vec3(1.0/2.2)),1.0);}':'')+(dp?SEC_DEPTH:''));};
  m.customProgramCacheKey=()=>'sec'+(cap?1:0)+(secDepth(m)?1:0);
  m.needsUpdate=true;
}
function setSection(on,plane){SEC.on.value=on?1:0;SEC.plane=plane;for(const m of SEC.mats){m.clippingPlanes=on?[plane]:[];m.side=on&&m.userData.secCap?THREE.DoubleSide:m.userData.side0;m.needsUpdate=true;}}
const GHOST=new Map();
/* a derived copy (see-through, faded) takes its source's current texture and colour, so a dial style or plate finish chosen while it is shown carries over */
function syncMat(d,s){if(d.map!==s.map){d.map=s.map;d.needsUpdate=true;}if(s.color&&d.color)d.color.copy(s.color);return d;}
function ghostOf(m){let g=GHOST.get(m);if(!g){g=m.clone();g.transparent=true;g.opacity=Math.min(0.16,m.opacity??1);g.depthWrite=false;g.userData={};patchSection(g,false);
  if(SEC.on.value>0.5)g.clippingPlanes=[...(m.clippingPlanes||[])];GHOST.set(m,g);}return syncMat(g,m);}
/* ---------- drawing: the model drawn live as a pen-and-wash drawing, tinted or in ink ----------
   drawOf(m): m's wash. A Phong copy (per-pixel diffuse under the scene's lights and shadows, no specular) whose output is the drawing's colour: the albedo in
   sRGB lifted toward the paper, chroma boosted and capped, the lit value in soft bands, laid as pigment density, left white where metal catches the light.
   In ink (INK.ink 1) it is paper, inked only where the albedo is printed: under 55% of the material's median (uRef, inkRef), as the dial's figures; an
   engraving (userData.inkDecal) is ink under its own alpha, and any other transparent source (a faded part) paper at its opacity. Alpha carries the band (0.45 band; 1 is bare paper, cleared to white: a clear colour is
   premultiplied), which tells the sheet the drawing from the paper; a transparent source keeps the alpha beneath it */
const DRAW=new Map(),INK={shMax:{value:1.1},wash:{value:0.75},ink:{value:0}};   /* wash: pigment density, light enough that the live model reads through it */
const WASH=(tr,dec)=>'float dL=dot(diffuseColor.rgb,vec3(0.3,0.55,0.15)),shd=dot(outgoingLight,vec3(0.3,0.55,0.15))/max(dL,1e-4);diffuseColor.rgb=mix(diffuse,diffuseColor.rgb,uTex);vec3 alb=pow(clamp(diffuseColor.rgb,0.0,1.0),vec3(1.0/2.2));'+
  'float aL=dot(alb,vec3(0.3,0.55,0.15));vec3 chr=(alb-aL)*1.6;chr*=min(1.0,0.3/max(length(chr),1e-6));vec3 wc=clamp(0.45+0.5225*aL+chr,0.0,1.0);'+
  'float bd=clamp((pow(clamp(shd/uShMax,0.0,1.0),1.0/2.2)-0.25)/0.7,0.0,1.0),bq=bd*3.0;bd=0.5*bd+0.5*(floor(bq)+smoothstep(0.3,0.7,fract(bq)))/3.0;'+
  'vec3 dens=(1.0-wc)+(1.0-bd)*(0.26+0.55*(1.0-wc));float hl=clamp((dot(normalize(normal),vec3(-0.3521,0.5533,0.7646))-0.9)/0.07,0.0,1.0)*clamp(uMetal*1.3,0.0,1.0);'+
  'gl_FragColor=vec4(exp(-dens*(1.0-0.85*hl)*uWash),'+(tr?'diffuseColor.a':'0.45*bd')+');'+
  (dec?'if(uInkOn>0.5)gl_FragColor=vec4(0.1725,0.1569,0.1412,diffuseColor.a);':'if(uInkOn>0.5)gl_FragColor=vec4(mix(vec3(1.0),vec3(0.1725,0.1569,0.1412),0.9*clamp((0.55*uRef-aL)/(0.2*uRef+1e-3),0.0,1.0)),'+(tr?'diffuseColor.a':'0.45*bd')+');');
/* inkRef(d,tx): the median sRGB luminance of d's albedo (its colour times its map, the map mixed in by tx as the wash does), which the ink compares with; a map's
   texels are sampled once, 48 x 48, and the median kept per colour */
const INKREF=new WeakMap();
function inkRef(d,tx){const c=d.color||new THREE.Color(1,1,1),t=d.map,cs=[c.r,c.g,c.b],w=[0.3,0.55,0.15],L=f=>w.reduce((a,wc,i)=>a+wc*Math.pow(Math.max(f(i),0),1/2.2),0);
  if(!t||!t.image)return L(i=>cs[i]);let e=INKREF.get(t);
  if(!e){e={k:new Map(),px:null};INKREF.set(t,e);try{const cv=document.createElement('canvas');cv.width=cv.height=48;const x=cv.getContext('2d');x.drawImage(t.image,0,0,48,48);
    const a=x.getImageData(0,0,48,48).data,s=t.encoding===THREE.sRGBEncoding;e.px=new Float32Array(48*48*3);for(let i=0;i<48*48;i++)for(let j=0;j<3;j++){const v=a[i*4+j]/255;e.px[i*3+j]=s?Math.pow(v,2.2):v;}}catch(_){}}
  if(!e.px)return L(i=>cs[i]);const key=c.getHex()+':'+tx;if(!e.k.has(key)){const v=[];for(let i=0;i<e.px.length;i+=3)v.push(L(j=>cs[j]*(tx*e.px[i+j]+1-tx)));v.sort((p,q)=>p-q);e.k.set(key,v[v.length>>1]);}
  return e.k.get(key);}
function drawOf(m){let d=DRAW.get(m);
  if(!d){const tr=!!m.transparent,dec=tr&&!!m.userData.inkDecal,cap=!!m.userData.secCap,mt={value:m.metalness||0},tx={value:m.normalMap?0.3:1};   /* damascening (a map with a normal map) muted: washed, it read as hatching */
    d=new THREE.MeshPhongMaterial({color:m.color?m.color.clone():new THREE.Color(1,1,1),map:m.map||null,specular:0,shininess:1,transparent:tr,depthWrite:m.depthWrite,toneMapped:false,
      polygonOffset:m.polygonOffset,polygonOffsetFactor:m.polygonOffsetFactor,polygonOffsetUnits:m.polygonOffsetUnits});
    if(tr)Object.assign(d,{blending:THREE.CustomBlending,blendSrc:THREE.SrcAlphaFactor,blendDst:THREE.OneMinusSrcAlphaFactor,blendSrcAlpha:THREE.ZeroFactor,blendDstAlpha:THREE.OneFactor});
    patchSection(d,cap);d.userData.side0=m.userData.side0??m.side;d.side=m.side;d.clippingPlanes=[...(m.clippingPlanes||[])];
    const ref=d.userData.ref={value:1};d.userData.tx=tx.value;
    const sec=d.onBeforeCompile;d.onBeforeCompile=sh=>{sh.uniforms.uMetal=mt;sh.uniforms.uTex=tx;sh.uniforms.uShMax=INK.shMax;sh.uniforms.uWash=INK.wash;sh.uniforms.uInkOn=INK.ink;sh.uniforms.uRef=ref;
      sh.fragmentShader='uniform float uMetal;\nuniform float uTex;\nuniform float uShMax;\nuniform float uWash;\nuniform float uInkOn;\nuniform float uRef;\n'+sh.fragmentShader.replace('#include <dithering_fragment>',WASH(tr,dec)+'\n#include <dithering_fragment>');sec(sh);
      sh.fragmentShader=sh.fragmentShader.replace('vec3(1.0/2.2)),1.0);','vec3(1.0/2.2)),0.45);');};   /* a cut face (patchSection) is drawing, not paper */
    d.customProgramCacheKey=()=>'draw'+(cap?1:0)+(tr?1:0)+(dec?1:0)+(secDepth(d)?1:0);DRAW.set(m,d);}
  d.opacity=m.opacity??1;syncMat(d,m);if(INK.ink.value>0.5)d.userData.ref.value=inkRef(d,d.userData.tx);return d;}
/* makeInk(r): draws a frame as a drawing, tinted or in ink. Hidden meshes stay hidden; a mesh whose material is under half opaque (glass, see-through and faded parts) is a
   ghost, drawn in outline only, lighter, and left out of the wash. Passes: view normals and a part id (solids, then ghosts) with their depths; the wash (the
   meshes' drawOf materials, with the scene's shadows: the only pass that draws the shadow map); then two full-screen passes: ink lines where depth jumps (0.6 mm
   + 1.2% of the distance) or the drawing ends, lighter ones at creases (over ~37 degrees) and between parts; and the sheet: the wash on paper, true to the
   lines, inked with a varying pen pressure.
   lines(): the Edges option, the same line pass over the normal frame instead of the wash. Ids are per mesh, not per part, and the box draws no lines */
/* a mesh's ids: inkId its part's, hashed (the drawing), inkIdM its own, given in turn (Edges), 0 on the box (userData.inkBox: no line). app.js gives them up front, in the
   order of the meshes, so a merged copy (drawMerge) carries each piece's own; a mesh first drawn later gets its own then */
let INK_N=0;const inkHash=s=>{let h=7;for(const c of String(s))h=(h*31+c.charCodeAt(0))%251;return(h+3)/255;};
function inkTag(o){const u=o.userData;if(u.inkIdM==null){u.inkId=inkHash(u.part);u.inkIdM=u.inkBox?0:(INK_N++%251+3)/255;}}
function makeInk(r){
  const T=THREE,rt=(nearest,depth)=>{const t=new T.WebGLRenderTarget(1,1,nearest?{minFilter:T.NearestFilter,magFilter:T.NearestFilter}:{});if(depth)t.depthTexture=new T.DepthTexture(1,1,T.UnsignedIntType);return t;};
  const rtN=rt(1,1),rtG=rt(1,1),rtC=rt(0,1),rtE=rt(0,0);rtE.depthBuffer=false;   /* depth textures are 24-bit; a target's own depth buffer is 16-bit in r128, and the box's brass fought its wood */
  /* noise: white noise blurred to a 3-texel sigma, tiled, normalized to unit deviation (stored as 0.5 + 0.18 v), four independent channels (the pen's pressure
     reads one). Made when the drawing first draws: Edges, on from the start, doesn't need it */
  const noise=()=>{const NZ=256,nz=new Uint8Array(NZ*NZ*4);{const g=[],K=9;for(let i=-K;i<=K;i++)g.push(Math.exp(-i*i/18));
    for(let c=0;c<4;c++){let a=Float32Array.from({length:NZ*NZ},()=>Math.random()-0.5);
      for(const hz of[1,0]){const b=new Float32Array(NZ*NZ);for(let y=0;y<NZ;y++)for(let x=0;x<NZ;x++){let s=0;for(let i=-K;i<=K;i++)s+=g[i+K]*(hz?a[y*NZ+((x+i+NZ)%NZ)]:a[((y+i+NZ)%NZ)*NZ+x]);b[y*NZ+x]=s;}a=b;}
      let s2=0;for(const v of a)s2+=v*v;const k=1/Math.sqrt(s2/a.length);for(let i=0;i<a.length;i++)nz[i*4+c]=clamp(Math.round((0.5+0.18*a[i]*k)*255),0,255);}}
    const t=new T.DataTexture(nz,NZ,NZ,T.RGBAFormat);t.wrapS=t.wrapT=T.RepeatWrapping;t.magFilter=t.minFilter=T.LinearFilter;t.needsUpdate=true;return t;};
  /* normals and part id; the id is a uniform set per mesh as it is drawn (onBeforeRender, with uniformsNeedUpdate: an override material is otherwise uploaded once),
     and so is the mesh's own polygon offset: without it the dial's face, 0.02 above its brass disc, fought it, and Edges drew the fight as streaks across the dial */
  const nid=new T.ShaderMaterial({clipping:true,side:T.DoubleSide,toneMapped:false,extensions:{fragDepth:true},uniforms:{uId:{value:0},uSecOn:SEC.on},   /* a cut face nearer, as patchSection draws it (SEC_DEPTH, compiled only with the plane): else it fought the part on it and Edges drew the fight */
    vertexShader:'#include <common>\n#include <clipping_planes_pars_vertex>\nvarying vec3 vN;\nvoid main(){\n#include <beginnormal_vertex>\n#include <defaultnormal_vertex>\n#include <begin_vertex>\n#include <project_vertex>\n#include <clipping_planes_vertex>\nvN=transformedNormal;}',
    fragmentShader:'#include <clipping_planes_pars_fragment>\nuniform float uId,uSecOn;uniform mat4 projectionMatrix;varying vec3 vN;\nvoid main(){\n#include <clipping_planes_fragment>\nvec3 n=normalize(vN)*(gl_FrontFacing?1.0:-1.0);gl_FragColor=vec4(n*0.5+0.5,uId);'+SEC_DEPTH+'\n}'});
  /* the id is the part's (the drawing) or, for Edges, the mesh's (inkTag): a pawl lies on its own part's wheel */
  let idOn=false,idM=false;function setId(){if(idOn){const m=this.material;nid.uniforms.uId.value=idM?this.userData.inkIdM:this.userData.inkId;nid.uniformsNeedUpdate=true;nid.polygonOffset=!!m.polygonOffset;nid.polygonOffsetFactor=m.polygonOffsetFactor||0;nid.polygonOffsetUnits=m.polygonOffsetUnits||0;}}
  const U=(o={})=>Object.assign({uPx:{value:new T.Vector2()},uPr:{value:1}},o);
  const VS='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}';
  const edge=new T.ShaderMaterial({toneMapped:false,depthTest:false,depthWrite:false,vertexShader:VS,uniforms:U({tN:{value:rtN.texture},tD:{value:rtN.depthTexture},tG:{value:rtG.texture},tGD:{value:rtG.depthTexture},uNF:{value:new T.Vector2()},uTwo:{value:0},uGh:{value:0},uMv:{value:0}}),
    fragmentShader:`#include <packing>
uniform sampler2D tN,tD,tG,tGD;uniform vec2 uPx,uNF;uniform float uTwo,uGh,uMv;varying vec2 vUv;
float vz(float d){return -perspectiveDepthToViewZ(d,uNF.x,uNF.y);}
vec2 ed(sampler2D tn,sampler2D td,vec2 u,vec2 o){float d0=texture2D(td,u).x,d1=texture2D(td,u+o).x;bool b0=d0>0.999999,b1=d1>0.999999;
  if(b0&&b1)return vec2(0.0);vec4 n0=texture2D(tn,u),n1=texture2D(tn,u+o);if(uMv>0.5&&((!b0&&n0.a<0.001)||(!b1&&n1.a<0.001)))return vec2(0.0);   /* Edges: none on or at the box (id 0) */
  if(b0!=b1)return vec2(1.0,0.0);float z0=vz(d0),z1=vz(d1);if(abs(z0-z1)>0.6+0.012*min(z0,z1))return vec2(1.0,0.0);
  float c=dot(normalize(n0.xyz*2.0-1.0),normalize(n1.xyz*2.0-1.0))<0.8?0.75:0.0;return vec2(0.0,max(c,abs(n0.a-n1.a)>0.002?(uMv>0.5?0.75:0.6):0.0));}
vec2 lines(sampler2D tn,sampler2D td){vec2 e=vec2(0.0);vec2 D[4];D[0]=vec2(1.0,0.0);D[1]=vec2(0.0,1.0);D[2]=vec2(1.0,1.0);D[3]=vec2(1.0,-1.0);
  for(int i=0;i<4;i++){e=max(e,ed(tn,td,vUv,D[i]*uPx));if(uTwo>0.5)e=max(e,ed(tn,td,vUv,-D[i]*uPx));}return e;}
void main(){vec2 s=lines(tN,tD),g=uGh>0.5?lines(tG,tGD):vec2(0.0);gl_FragColor=vec4(s,max(g.x,g.y*0.8),1.0);}`});
  const comp=new T.ShaderMaterial({toneMapped:false,depthTest:false,depthWrite:false,vertexShader:VS,uniforms:U({tC:{value:rtC.texture},tE:{value:rtE.texture},tZ:{value:null},uPaper:{value:new T.Color(0xf5f0e4)},uInk:{value:new T.Color(0x2c2824)}}),
    fragmentShader:`uniform sampler2D tC,tE,tZ;uniform vec2 uPx;uniform float uPr;uniform vec3 uPaper,uInk;varying vec2 vUv;
float nz(vec2 p,float s,int c){vec4 t=texture2D(tZ,p*3.0/(s*256.0));return ((c==0?t.r:c==1?t.g:c==2?t.b:t.a)-0.5)/0.18;}
void main(){vec2 p=gl_FragCoord.xy/uPr;
  vec4 c=texture2D(tC,vUv);float fg=clamp((1.0-c.a)*2.0,0.0,1.0);
  vec2 h=0.5*uPx;vec4 e=0.25*(texture2D(tE,vUv+h)+texture2D(tE,vUv-h)+texture2D(tE,vUv+vec2(h.x,-h.y))+texture2D(tE,vUv-vec2(h.x,-h.y)));
  float pr=clamp(0.85+0.15*nz(p,12.0,3),0.55,1.0),ink=max(e.r,e.g*0.8)*pr;
  float g=e.b*0.55*(1.0-0.8*fg);gl_FragColor=vec4(uPaper*mix(mix(c.rgb,uInk,g),uInk,ink),1.0);}`});
  /* Edges: the lines alone, laid over the normal rendering, softened as the sheet does */
  const over=new T.ShaderMaterial({toneMapped:false,depthTest:false,depthWrite:false,transparent:true,vertexShader:VS,uniforms:U({tE:{value:rtE.texture},uInk:{value:new T.Color(0x1c1a18)}}),
    fragmentShader:`uniform sampler2D tE;uniform vec2 uPx;uniform vec3 uInk;varying vec2 vUv;
void main(){vec2 h=0.5*uPx;vec4 e=0.25*(texture2D(tE,vUv+h)+texture2D(tE,vUv-h)+texture2D(tE,vUv+vec2(h.x,-h.y))+texture2D(tE,vUv-vec2(h.x,-h.y)));
  gl_FragColor=vec4(uInk,0.8*max(max(e.r,e.g*0.8),e.b*0.45));}`});
  const qs=new T.Scene(),q=new T.Mesh(new T.PlaneGeometry(2,2),edge),qc=new T.OrthographicCamera(-1,1,1,-1,0,1);q.frustumCulled=false;qs.add(q);
  const bs=new T.Vector2(),cc=new T.Color();
  /* normals and ids: the solids, then the ghosts alone (for Edges, mv: mesh ids, the box masked, hide left out); no shadow map is drawn for these.
     Leaves the ghosts hidden and the line pass's uniforms set */
  function ids(scene,cam,meshes,mv,hide){
    const pr=r.getPixelRatio(),gh=[],so=[];
    for(const o of meshes){if(!o.visible)continue;if(o.onBeforeRender!==setId){o.onBeforeRender=setId;inkTag(o);}const m=o.material;(m.transparent&&m.opacity<0.5?gh:so).push(o);}
    /* targets at the drawing's size only while used, else 1 px (setSize frees the old one): the ghosts' while there are ghosts, the wash's while the drawing draws.
       Each is 4 bytes a pixel, 8 with a depth texture: Edges without ghosts keeps 12 a pixel, not 28 */
    r.getDrawingBufferSize(bs);const fit=(t,on)=>{const w=on?bs.x:1,h=on?bs.y:1;if(t.width!==w||t.height!==h)t.setSize(w,h);};fit(rtN,1);fit(rtE,1);fit(rtG,gh.length>0);fit(rtC,!mv);
    r.getClearColor(cc);const s={gh,ca:r.getClearAlpha(),au:r.shadowMap.autoUpdate},ov=scene.overrideMaterial,hv=hide.map(o=>o.visible);
    nid.clippingPlanes=SEC.on.value>0.5&&SEC.plane?[SEC.plane]:[];
    r.shadowMap.autoUpdate=false;scene.overrideMaterial=nid;idOn=true;idM=mv;r.setClearColor(0x000000,0);hide.forEach(o=>o.visible=false);
    gh.forEach(o=>o.visible=false);r.setRenderTarget(rtN);r.clear();r.render(scene,cam);
    so.forEach(o=>o.visible=false);gh.forEach(o=>o.visible=true);r.setRenderTarget(rtG);r.clear();if(gh.length)r.render(scene,cam);
    so.forEach(o=>o.visible=true);gh.forEach(o=>o.visible=false);hide.forEach((o,i)=>o.visible=hv[i]);scene.overrideMaterial=ov;idOn=idM=false;
    /* lines about one CSS pixel wide (both sides of an edge from 1.5 device pixels per CSS pixel) */
    for(const m of[edge,comp,over]){m.uniforms.uPx.value.set(1/bs.x,1/bs.y);m.uniforms.uPr.value=pr;}
    edge.uniforms.uNF.value.set(cam.near,cam.far);edge.uniforms.uTwo.value=pr>=1.5?1:0;edge.uniforms.uGh.value=gh.length?1:0;edge.uniforms.uMv.value=mv?1:0;
    return s;}
  return{render(scene,cam,meshes){
    if(!comp.uniforms.tZ.value)comp.uniforms.tZ.value=noise();
    const{gh,ca,au}=ids(scene,cam,meshes,false,[]);
    /* the wash, with the shadows */
    r.shadowMap.needsUpdate=true;r.setClearColor(0xffffff,1);r.setRenderTarget(rtC);r.clear();r.render(scene,cam);
    gh.forEach(o=>o.visible=true);r.shadowMap.autoUpdate=au;
    /* lines, then the sheet */
    q.material=edge;r.setRenderTarget(rtE);r.render(qs,qc);q.material=comp;r.setRenderTarget(null);r.setClearColor(cc,ca);r.render(qs,qc);},
  /* Edges: the frame rendered as usual (with the shadows), then the lines over it; hide: scene objects not in meshes (the floor shadow) */
  lines(scene,cam,meshes,hide){
    const{gh,ca,au}=ids(scene,cam,meshes,true,hide);gh.forEach(o=>o.visible=true);
    r.shadowMap.needsUpdate=true;r.setRenderTarget(null);r.setClearColor(cc,ca);r.clear();r.render(scene,cam);r.shadowMap.autoUpdate=au;
    q.material=edge;r.setRenderTarget(rtE);r.render(qs,qc);q.material=over;r.setRenderTarget(null);const ac=r.autoClear;r.autoClear=false;r.render(qs,qc);r.autoClear=ac;}};
}
/* mainspring: a strip t thick (0.0165 in, the parts list) and len long (estimated: filling half the room between arbor and wall, which gives the most turns),
   coiled in two packs, one on the arbor (from ra) and one on the wall (out to Rw), joined by k free turns. Its coils in a pack lie gap apart (the grease).
   Running peels coils off the arbor pack onto the wall pack. msPack(la,o): the packs with la mm on the arbor; T, the turns from the inner end to the outer.
   ra 1.8 (the arbor's core, estimated). Rw: the barrel's wall less its thickness and the brace's (the barrel r 17.6, C Spinner's video: Review-results.md, Elsewhere 23).
   len: half the room between them (the rule above), 1,063 mm; the video's coils (15:54) and free spring (32:30) give about 1.1 m (0.9-1.25) */
const MSPRING={t:0.419,gap:0.01,ra:1.8,Rw:17.6-0.46,len:Math.round(Math.PI*((17.6-0.46)**2-1.8**2)/2/(0.419+0.01)),k:1};
function msPack(la,o=MSPRING){const p=o.t+o.gap,a0=o.ra+o.t/2,R0=o.Rw-o.t/2,ni=(Math.sqrt(a0*a0+la*p/Math.PI)-a0)/p,ri=a0+ni*p;let ro=R0,lf=0,no=0;
  for(let i=0;i<30;i++){lf=o.k*Math.PI*(ri+ro);no=(R0-Math.sqrt(Math.max(0,R0*R0-Math.max(0,o.len-la-lf)*p/Math.PI)))/p;ro=R0-no*p;}
  return{p,a0,R0,ni,ri,no,ro,lf,T:ni+o.k+no};}
/* the turns it can take: Tmin with nothing on the arbor, Tmax with the arbor pack as large as leaves the free turn its length and room (ro - ri >= p); laMax, that pack's length */
function msRange(o=MSPRING){let a=0,b=o.len;for(let i=0;i<50;i++){const m=(a+b)/2,q=msPack(m,o);if(q.ro-q.ri>=q.p&&m+q.lf<=o.len)a=m;else b=m;}return{Tmin:msPack(0,o).T,Tmax:msPack(a,o).T,laMax:a};}
/* the solid for T turns, between y0 and y1: its centre line r(theta) along the arbor pack, the free turn (its slope that of the packs at both ends, so each turn lies
   at least p outside the one before) and the wall pack, theta rising from the inner end. An eye through the strip near the inner end (ey: [theta0, theta1, yLo, yHi])
   takes the arbor's hook. Faces: outer and inner (in three bands, the middle one open over the eye), top, bottom, the eye's floor, roof and ends, the strip's ends */
function mainspringGeo(T,y0,y1,ey,o=MSPRING){
  const R=msRange(o);let a=0,b=R.laMax;for(let i=0;i<50;i++){const m=(a+b)/2;if(msPack(m,o).T<T)a=m;else b=m;}
  const q=msPack(a,o),{p,a0,ni,ri,ro}=q,k=o.k,end=TAU*T,rad=u=>u<=ni?a0+p*u:u<=ni+k?ri+p*(u-ni)+(ro-ri-p*k)*smooth((u-ni)/k):ro+p*(u-ni-k);
  const th=[...new Set([...Array(Math.ceil(T*72)+1)].map((_,i)=>Math.min(end,i*TAU/72)).concat([ey[0],ey[1],end]))].sort((x,z)=>x-z),N=th.length-1,s0=th.indexOf(ey[0]),s1=th.indexOf(ey[1]);
  const Y=[y0,ey[2],ey[3],y1],C=th.map(t=>{const r=rad(t/TAU),c=Math.cos(t),s=Math.sin(t),ro_=r+o.t/2,ri_=r-o.t/2;return{O:Y.map(y=>[ro_*c,y,ro_*s]),I:Y.map(y=>[ri_*c,y,ri_*s])};});
  const pos=[],idx=[];
  /* a ribbon from corner A to corner B over samples i0..i1, facing (B - A) x the strip's direction */
  const rib=(A,B,i0,i1)=>{const b=pos.length/3;for(let i=i0;i<=i1;i++)pos.push(...A(C[i]),...B(C[i]));for(let i=0;i<i1-i0;i++){const j=b+i*2;idx.push(j,j+1,j+3,j,j+3,j+2);}};
  const quad=(P,Q,Rr,S)=>{const b=pos.length/3;pos.push(...P,...Q,...Rr,...S);idx.push(b,b+1,b+2,b,b+2,b+3);};   /* faces (Q - P) x (R - P) */
  for(const[l,h]of[[0,1],[2,3]]){rib(c=>c.O[l],c=>c.O[h],0,N);rib(c=>c.I[h],c=>c.I[l],0,N);}
  for(const[i0,i1]of[[0,s0],[s1,N]]){rib(c=>c.O[1],c=>c.O[2],i0,i1);rib(c=>c.I[2],c=>c.I[1],i0,i1);}
  rib(c=>c.O[3],c=>c.I[3],0,N);rib(c=>c.I[0],c=>c.O[0],0,N);rib(c=>c.O[1],c=>c.I[1],s0,s1);rib(c=>c.I[2],c=>c.O[2],s0,s1);
  const wall=(c,f)=>{for(const[l,h]of[[0,1],[1,2],[2,3]]){if(f===2&&l!==1)continue;const P=c.O[l],Q=c.O[h],Rr=c.I[h],S=c.I[l];if(f>0)quad(P,Q,Rr,S);else quad(P,S,Rr,Q);}};
  wall(C[0],0);wall(C[N],1);wall(C[s0],2);const e=C[s1];quad(e.O[1],e.I[1],e.I[2],e.O[2]);   /* the ends; the eye's two ends face into it */
  let v=0;const P=k=>new THREE.Vector3(pos[3*k],pos[3*k+1],pos[3*k+2]);for(let i=0;i<idx.length;i+=3)v+=P(idx[i]).dot(P(idx[i+1]).cross(P(idx[i+2])));
  if(v<0)for(let i=0;i<idx.length;i+=3){const t=idx[i+1];idx[i+1]=idx[i+2];idx[i+2]=t;}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();g.userData={la:a,...q};return g;
}
/* extrude(s,o): ExtrudeGeometry with every hole's wall facing into the hole. r128 turns the holes only when it reverses a counterclockwise outline, so with a
   clockwise outline a clockwise hole got its wall wound into the metal: culled, the plate looked a hollow shell round its holes and cut-outs, and a section
   showed that wall's face instead of the hatched cut. Its triangles are turned over; the shape is unchanged (a clockwise hole's bevel still narrows it) */
function extrude(s,o){const g=new THREE.ExtrudeGeometry(s,o),U=THREE.ShapeUtils,p=s.extractPoints(o.curveSegments??12),dd=v=>{if(v.length>2&&v[v.length-1].equals(v[0]))v.pop();return v;},sh=dd(p.shape),hs=p.holes.map(dd);
  if(!U.isClockWise(sh)||!hs.length)return g;const sl=6*((o.steps??1)+(o.bevelEnabled?2*(o.bevelSegments??3):0)),side=g.groups[1];let i=side.start+sh.length*sl,f=0;   /* the side walls: the outline's, then each hole's, 6·sl vertices a point */
  if(side.start+side.count!==i+hs.reduce((a,h)=>a+h.length*sl,0)){console.error('extrude: side walls not as counted');return g;}
  for(const h of hs){const e=i+h.length*sl;if(U.isClockWise(h)){f=1;for(const a of Object.values(g.attributes))for(let v=i;v<e;v+=3)for(let c=0;c<a.itemSize;c++){const k=(v+1)*a.itemSize+c,m=(v+2)*a.itemSize+c,t=a.array[k];a.array[k]=a.array[m];a.array[m]=t;}}i=e;}
  if(f)g.computeVertexNormals();return g;}
/* closeGeo(g): g made a closed solid: each loop of open edges (a tube's ends, a part-turned lathe's or torus's ends, all flat) filled with a flat cap, wound to
   face out. Returns an indexed copy with g's type and parameters (or g, if already closed); its userData.capOf gives, for each cap vertex, the vertex of g it copies (for reclose) */
function closeGeo(g){const p=g.attributes.position,ix=g.index?g.index.array:null,n=ix?ix.length:p.count,id=new Map(),V=[],P=[],S=[];
  for(let i=0;i<p.count;i++){const k=Math.round(p.getX(i)*1e4)+','+Math.round(p.getY(i)*1e4)+','+Math.round(p.getZ(i)*1e4);if(!id.has(k)){id.set(k,P.length);P.push(new THREE.Vector3().fromBufferAttribute(p,i));S.push(i);}V.push(id.get(k));}
  const E=new Set(),nx=new Map();for(let t=0;t<n;t+=3){const a=V[ix?ix[t]:t],b=V[ix?ix[t+1]:t+1],c=V[ix?ix[t+2]:t+2];if(a!==b&&b!==c&&c!==a)for(const[u,v]of[[a,b],[b,c],[c,a]])E.add(u+'_'+v);}
  for(const k of E){const[u,v]=k.split('_').map(Number);if(!E.has(v+'_'+u))nx.set(v,u);}   /* an open edge u->v: its cap runs v->u */
  if(!nx.size)return g;const pos=[],nor=[],src=[],done=new Set();
  for(const s of nx.keys()){if(done.has(s))continue;const L=[],Q=[];let q=s;while(q!==undefined&&!done.has(q)&&L.length<=nx.size){done.add(q);L.push(P[q]);Q.push(S[q]);q=nx.get(q);}if(L.length<3)continue;
    const N=new THREE.Vector3();L.forEach((a,i)=>{const b=L[(i+1)%L.length];N.x+=(a.y-b.y)*(a.z+b.z);N.y+=(a.z-b.z)*(a.x+b.x);N.z+=(a.x-b.x)*(a.y+b.y);});N.normalize();   /* Newell: the cap's normal */
    const e1=new THREE.Vector3().subVectors(L[1],L[0]).projectOnPlane(N).normalize(),e2=new THREE.Vector3().crossVectors(N,e1),o=L[0];
    const c2=L.map(a=>{const d=a.clone().sub(o);return new THREE.Vector2(d.dot(e1),d.dot(e2));});
    for(const f of THREE.ShapeUtils.triangulateShape(c2,[])){const[a,b,c]=f.map(i=>L[i]);const fl=new THREE.Vector3().subVectors(b,a).cross(new THREE.Vector3().subVectors(c,a)).dot(N)<0;
      for(const i of fl?[f[0],f[2],f[1]]:f){const v=L[i];pos.push(v.x,v.y,v.z);nor.push(N.x,N.y,N.z);src.push(Q[i]);}}}
  if(!pos.length)return g;const h=g.index?g:g.toNonIndexed(),o0=h.attributes.position.count,m=pos.length/3,out=new THREE.BufferGeometry(),I=[];
  for(const k in h.attributes){const a=h.attributes[k],w=a.itemSize,arr=new Float32Array((o0+m)*w);arr.set(a.array.subarray(0,o0*w));if(k==='position')arr.set(pos,o0*w);else if(k==='normal')arr.set(nor,o0*w);out.setAttribute(k,new THREE.BufferAttribute(arr,w));}
  if(h.index)I.push(...h.index.array);else for(let i=0;i<o0;i++)I.push(i);for(let i=0;i<m;i++)I.push(o0+i);out.setIndex(I);out.type=g.type;out.parameters=g.parameters;out.userData.capOf=Int32Array.from(src);g.dispose();return out;}   /* type and parameters kept: the checks know a tube by them */
/* reclose(old,g): closeGeo(g) written into old, in place, when old is closeGeo's output for a geometry of g's counts (a spring rebuilt as it moves: the same tube, bent
   differently). The weld and the caps' triangulation are old's; only positions and normals change, so there is no hashing and no new buffer each frame (closeGeo on the
   hairspring was about 9 ms a frame). Else, or if old is missing, old is disposed and closeGeo(g) returned */
function reclose(old,g){const u=old&&old.userData.capOf,p=g.attributes.position,o0=p.count;
  if(!u||!g.index||old.attributes.position.count!==o0+u.length||old.index.count!==g.index.count+u.length){if(old)old.dispose();return closeGeo(g);}
  const A=old.attributes.position,Nm=old.attributes.normal,a=A.array,nm=Nm.array,s=p.array,e1=new THREE.Vector3(),e2=new THREE.Vector3();a.set(s);nm.set(g.attributes.normal.array);
  for(let k=0;k<u.length;k++){const j=3*u[k],o=3*(o0+k);a[o]=s[j];a[o+1]=s[j+1];a[o+2]=s[j+2];}
  for(let k=0;k<u.length;k+=3){const o=3*(o0+k);e1.set(a[o+3]-a[o],a[o+4]-a[o+1],a[o+5]-a[o+2]);e2.set(a[o+6]-a[o],a[o+7]-a[o+1],a[o+8]-a[o+2]);e1.cross(e2).normalize();   /* each cap flat and wound to face out */
    for(let c=0;c<9;c+=3){nm[o+c]=e1.x;nm[o+c+1]=e1.y;nm[o+c+2]=e1.z;}}
  A.needsUpdate=Nm.needsUpdate=true;old.computeBoundingSphere();if(old.boundingBox)old.computeBoundingBox();g.dispose();return old;}
function ringGeo(ro,ri,h){const s=new THREE.Shape();s.absarc(0,0,ro,0,TAU,false);const hp=new THREE.Path();hp.absarc(0,0,ri,0,TAU,true);s.holes.push(hp);
  const g=extrude(s,{depth:h,bevelEnabled:false,curveSegments:48});g.rotateX(-Math.PI/2);g.translate(0,-h/2,0);return g;}
/* a round collet or socket with a square hole a across (a hand broached square, a key's socket), centred on its y like ringGeo */
function sqRingGeo(ro,a,h){const s=new THREE.Shape();s.absarc(0,0,ro,0,TAU,false);s.holes.push(sqPath(a));
  const g=extrude(s,{depth:h,bevelEnabled:false,curveSegments:48});g.rotateX(-Math.PI/2);g.translate(0,-h/2,0);return g;}
function sqPath(a){const q=a/2,h=new THREE.Path();h.moveTo(q,q);h.lineTo(q,-q);h.lineTo(-q,-q);h.lineTo(-q,q);h.closePath();return h;}   /* clockwise, a hole */
/* pawl / click: round pivot boss at the origin, tapered arm along -x ending in a hooked tip */
function pawlGeo(len,w,th,centre,bore){const s=new THREE.Shape(),r=w*0.72;   /* bore: the pivot hole's radius (default 0.35 of the boss's) */s.moveTo(0,r);s.absarc(0,0,r,Math.PI/2,-Math.PI/2,true);
  s.lineTo(-len*0.8,-w*0.26);s.lineTo(-len,-w*0.62);s.lineTo(-len*0.96,w*0.08);s.quadraticCurveTo(-len*0.5,w*0.42,0,r);
  const h=new THREE.Path();h.absarc(0,0,bore??r*0.35,0,TAU,true);s.holes.push(h);
  const g=extrude(s,{depth:th,bevelEnabled:false,curveSegments:16});g.rotateX(-Math.PI/2);g.translate(centre?len/2:0,-th/2,0);return g;}
function mesh(p,geo,mat,x=0,y=0,z=0){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);p.add(m);return m;}
/* the parts-list line a piece is (its id in bom.json: the Hamilton number, with a suffix where the number is on several lines), tagged on one object per piece;
   x: data for tools/bom.py (a gear's {z, m}). Untagged meshes belong to the nearest tagged ancestor ("complete with pins") */
const hn=(o,id,x)=>{o.userData.hn=id;if(x)Object.assign(o.userData,x);return o;};
function cylY(r,h,seg=20){return new THREE.CylinderGeometry(r,r,h,seg);}
/* several geometries as one mesh's, each placed by its matrix ([[geometry, Matrix4], ...]): one draw call (and one shadow-pass call) instead of many */
function mergeGeo(list){const gs=list.map(([g,m])=>{const q=(g.index?g.toNonIndexed():g.clone()).applyMatrix4(m);g.dispose();return q;}),out=new THREE.BufferGeometry();
  for(const[k,n]of[['position',3],['normal',3],['uv',2]]){if(!gs.every(g=>g.attributes[k]))continue;const a=new Float32Array(gs.reduce((t,g)=>t+g.attributes[k].array.length,0));let o=0;for(const g of gs){a.set(g.attributes[k].array,o);o+=g.attributes[k].array.length;}out.setAttribute(k,new THREE.BufferAttribute(a,n));}
  gs.forEach(g=>g.dispose());return out;}
function cylBetween(p,r,y0,y1,mat,x=0,z=0,seg=16){return mesh(p,cylY(r,Math.abs(y1-y0),seg),mat,x,(y0+y1)/2,z);}
function discGeo(r,th,holes=[]){if(typeof checkHoles==='function')checkHoles('discGeo',holes,(x,z)=>r-Math.hypot(x,z));const s=new THREE.Shape();s.absarc(0,0,r,0,TAU,false);for(const[hx,hz,hr]of holes){const h=new THREE.Path();h.absarc(hx,-hz,hr,0,TAU,true);s.holes.push(h);}
  const g=extrude(s,{depth:th,bevelEnabled:false,curveSegments:64});g.rotateX(-Math.PI/2);return g;}
/* gear: pitch radius = m*n/2 */
/* toothed wheel or pinion, n teeth of module m, th thick. Teeth centred at a + 0.375 of a pitch (spaces at 0.875), as ph() phases them. Cycloidal clock teeth, in
   BS 978 Part 2's proportions (the manual gives no profiles: estimated): a wheel's tooth 1.41 m thick at the pitch circle, radial flanks inside it, an epicycloidal
   addendum rolled by a circle half its pinion's pitch radius (o.mate leaves, default 10), capped at 1.15 m; a pinion's leaf (20 or fewer) 1.05 m thick, radial
   flanks and a round tip (addendum 0.525 m); both 1.3 m deep below the pitch circle, clear of the other's addendum. o.ratchet: a ratchet's saw teeth.
   userData: ro (tip radius), ri (root), hub (the spokes' hub radius) */
function gearGeo(n,m,th,o={}){
  const rp=m*n/2,p=TAU/n,pts=[],roS=rp+m*0.95,ri=rp-1.3*m;let ro;
  const root=(a0,a1)=>{for(let k=1;k<3;k++)pts.push([ri,a0+(a1-a0)*k/3]);};   /* the root between two teeth, rounded */
  if(o.ratchet){ro=roS;const r0=ro-2.25*m;for(let i=0;i<n;i++){const a=i*p;pts.push([r0,a],[ro,a+p*0.9],[r0,a+p*0.97]);}}
  else if(n<=20){const b=0.525*m/rp,rt=0.525*m;ro=rp+rt;
    for(let i=0;i<n;i++){const c=i*p+0.375*p;pts.push([ri,c-b],[rp,c-b]);
      for(let k=1;k<12;k++){const t=Math.PI*k/12,u=rp+rt*Math.sin(t),v=-rt*Math.cos(t);pts.push([Math.hypot(u,v),c+Math.atan2(v,u)]);}   /* the round tip, a semicircle on the pitch circle */
      pts.push([rp,c+b],[ri,c+b]);root(c+b,c+p-b);}}
  else{const b=0.705*m/rp,rg=m*(o.mate||10)/4,hm=1.15*m,K=(rp+rg)/rg,ep=[];
    for(let k=0;k<=24;k++){const t=0.6*k/24,x=(rp+rg)*Math.cos(t)-rg*Math.cos(K*t),y=(rp+rg)*Math.sin(t)-rg*Math.sin(K*t),r=Math.hypot(x,y),a=Math.atan2(y,x);
      if(a>=b||r>=rp+hm){ep.push([Math.min(r,rp+hm),Math.min(a,b)]);break;}ep.push([r,a]);}   /* the addendum's left side from the pitch point, until it reaches the tooth's centre or the cap */
    ro=ep[ep.length-1][0];
    for(let i=0;i<n;i++){const c=i*p+0.375*p;pts.push([ri,c-b]);for(const[r,a]of ep)pts.push([r,c-b+a]);for(let k=ep.length-1;k>=0;k--){const[r,a]=ep[k];if(a<b-1e-9||k<ep.length-1)pts.push([r,c+b-a]);}pts.push([ri,c+b]);root(c+b,c+p-b);}}
  let xy=pts.map(([r,a])=>[r*Math.cos(a),r*Math.sin(a)]);if(o.flip)xy=xy.map(([x,y])=>[x,-y]).reverse();
  const s=new THREE.Shape();s.moveTo(...xy[0]);for(let i=1;i<xy.length;i++)s.lineTo(...xy[i]);s.closePath();
  const R0=o.hub??Math.max(1.6,roS*0.18);
  if(o.spokes){const R1=ri-(o.rim??Math.max(0.9,roS*0.09)),sw=o.sw??Math.max(0.9,roS*0.08);
    if(R1>R0+1)for(let j=0;j<o.spokes;j++){const a0=j/o.spokes*TAU,a1=(j+1)/o.spokes*TAU,d1=Math.asin(Math.min(0.9,sw/2/R1)),d0=Math.asin(Math.min(0.9,sw/2/R0));
      const h=new THREE.Path();h.absarc(0,0,R1,a0+d1,a1-d1,false);h.absarc(0,0,R0,a1-d0,a0+d0,true);s.holes.push(h);}}
  if(o.bore){const h=new THREE.Path();h.absarc(0,0,o.bore,0,TAU,true);s.holes.push(h);}
  for(const[hx,hz,hr]of o.holes||[]){const h=new THREE.Path();h.absarc(hx,-hz,hr,0,TAU,true);s.holes.push(h);}   /* holes [x, z, r] in the wheel's own frame (screw holes) */
  const g=extrude(s,{depth:th,bevelEnabled:false,curveSegments:24});g.rotateX(-Math.PI/2);g.translate(0,-th/2,0);Object.assign(g.userData,{ro,ri,hub:R0});return g;
}
/* a turned arbor or staff: prof [[y, r], ...] is radius r from y to the next y (the last entry's y is the end), so a pivot steps up to the body at a shoulder; one closed solid */
function shaftGeo(prof,seg=16){const V2=(a,b)=>new THREE.Vector2(a,b),pr=[V2(0,prof[0][0])];for(let i=0;i+1<prof.length;i++){pr.push(V2(prof[i][1],prof[i][0]),V2(prof[i][1],prof[i+1][0]));}
  pr.push(V2(0,prof[prof.length-1][0]));return new THREE.LatheGeometry(pr,seg);}
/* a jewel stone, centred on y 0, h thick, outside radius ro, hole rb: 'olive' a hole rounded through its thickness (rb at the middle, 0.06 wider at the faces), 'bar' a straight hole
   with an oil sink on its +y face; one closed solid */
function stoneGeo(ro,rb,h,kind){const V2=(a,b)=>new THREE.Vector2(a,b),y0=-h/2,y1=h/2,pr=[V2(kind==='olive'?rb+0.06:rb,y0),V2(ro,y0),V2(ro,y1)];
  if(kind==='olive'){for(let i=0;i<=12;i++){const s=1-i/6;pr.push(V2(rb+0.06*s*s,s*h/2));}}
  else{pr.push(V2(rb+0.18,y1),V2(rb,y1-0.14),V2(rb,y0));}
  return new THREE.LatheGeometry(pr,32);}
/* arbor with wheel & pinion: returns rotating group */
function arbor(parent,M,x,z,o){
  const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);
  let wy=null,cy=null;   /* the wheel's and the collet's y ranges, and the collet's radius, for the check below */
  if(o.wheel){const w=o.wheel,th=w.th||1;g.userData.wheel=mesh(g,gearGeo(w.n,w.m,th,{spokes:w.spokes??4,flip:w.flip,bore:w.bore,hub:w.hub,mate:w.mate}),w.mat||M.gilt,0,w.y,0);g.userData.nw=w.n;g.userData.wheel.userData.gear={z:w.n,m:w.m};
    const gu=g.userData.wheel.geometry.userData;wy=[w.y-th/2,w.y+th/2,w.spokes===0?gu.ro:gu.hub];
    /* cside ±1: collet on that side of the wheel only, cp proud of it there (0.6) and 0.05 proud of the other face, not flush with it */
    if(w.collet!==0){const cp=w.cp??0.6,h=w.cside?th+0.05+cp:th+1.2,c=w.y+(w.cside||0)*(cp-0.05)/2;mesh(g,cylY(w.collet||1.6,h,20),M.brass2,0,c,0);cy=[c-h/2,c+h/2,w.collet||1.6];}}
  if(o.pin){const p=o.pin,n=p.n||10,th=p.th||2.5;g.userData.pin=mesh(g,gearGeo(n,p.m,th,{bore:p.bore}),M.steel,0,p.y,0);g.userData.np=n;g.userData.pin.userData.gear={z:n,m:p.m};
    /* a pinion's leaves must end at its wheel's boss: where the pinion shares heights with the wheel or its collet, its tips must lie inside the hub or the collet */
    const rt=g.userData.pin.geometry.userData.ro,y0=p.y-th/2+1e-6,y1=p.y+th/2-1e-6,over=r=>r&&y0<r[1]&&y1>r[0]&&rt>r[2];
    if(over(wy)||over(cy))console.error('arbor: pinion inside its wheel',{x,z,y:p.y,rt,wheel:wy,collet:cy});}
  if(o.prof)g.userData.ar=mesh(g,shaftGeo(o.prof),M.steel);   /* a turned arbor: pivots and shoulders (shaftGeo) */
  else if(o.ar){const[a,b]=o.ar;g.userData.ar=cylBetween(g,o.r||0.55,a,b,M.steel,0,0,12);}
  return g;
}
function springGeo(R,H,N,th,wire,rc=R*0.2,rs=R*0.3,into){   /* rc, rs: radii of the inner (collet) and outer (stud) ends, where the terminal curves end; into: the previous geometry, rewritten in place (reclose) */
  const c=new THREE.Curve();c.arcLengthDivisions=1400;
  const Re=R*N/(N+th/TAU*0.8),a0=0.09,tot=TAU*N+TAU;
  c.getPoint=(t,v=new THREE.Vector3())=>{let ang,r,y;
    if(t<a0){const s=t/a0;ang=Math.PI*s;r=rc+(Re-rc)*Math.sin(s*Math.PI/2);y=H*0.05*s;}
    else if(t>1-a0){const s=(t-1+a0)/a0;ang=Math.PI+TAU*N+Math.PI*s;r=Re-(Re-rs)*(1-Math.cos(s*Math.PI/2));y=H*0.95+H*0.05*s;}
    else{const s=(t-a0)/(1-2*a0);ang=Math.PI+TAU*N*s;r=Re;y=H*0.05+H*0.9*s;}
    const a=ang+th*(1-ang/tot);return v.set(r*Math.cos(a),y,-r*Math.sin(a));};
  return reclose(into,new THREE.TubeGeometry(c,Math.round(N*46),wire,6,false));
}
function handShape(len,w,tail,kind,at,o){   /* the hand's outline, pointing +y from its arbor (handGeo extrudes it; the essay draws it flat). tail<0: a spear counterpoise -tail long in place of the flat tail; at: the pear's bulb at at·len; o {boss, bore|sq}: a round boss of radius boss with a round or square hole (a tail shorter than the boss is left off) */
  const s=new THREE.Shape(),b=o&&o.boss,yb=b&&Math.sqrt(b*b-w*w/4),ab=b&&Math.acos(w/2/b);
  if(b){if(tail>yb){s.moveTo(-w/2,-tail);s.lineTo(w/2,-tail);s.lineTo(w/2,-yb);s.absarc(0,0,b,-ab,ab,false);}else s.moveTo(w/2,yb);}
  else if(tail<0){const T=-tail,b=w*1.3;s.moveTo(-w/2,0);s.lineTo(-w*0.35,-T*0.55);s.quadraticCurveTo(-b,-T*0.74,-b*0.85,-T*0.8);s.quadraticCurveTo(-b*0.45,-T*0.86,0,-T);s.quadraticCurveTo(b*0.45,-T*0.86,b*0.85,-T*0.8);s.quadraticCurveTo(b,-T*0.74,w*0.35,-T*0.55);s.lineTo(w/2,0);}
  else{s.moveTo(-w/2,-tail);s.lineTo(w/2,-tail);}
  if(kind==='spade'){s.lineTo(w*0.3,len*0.6);s.quadraticCurveTo(w*1.3,len*0.68,w*0.95,len*0.8);s.lineTo(0,len);s.lineTo(-w*0.95,len*0.8);s.quadraticCurveTo(-w*1.3,len*0.68,-w*0.3,len*0.6);}
  else if(kind==='leaf'||kind==='lance'){const b=kind==='leaf'?w*1.9:w*1.25,m=kind==='leaf'?0.68:0.8;   /* leaf widest at m·len, drawn to a point */
    s.lineTo(w*0.35,len*(m-0.25));s.quadraticCurveTo(b,len*(m-0.06),b*0.85,len*m);s.quadraticCurveTo(b*0.45,len*(m+0.14),0,len);s.quadraticCurveTo(-b*0.45,len*(m+0.14),-b*0.85,len*m);s.quadraticCurveTo(-b,len*(m-0.06),-w*0.35,len*(m-0.25));}
  else if(kind==='pear'){const b=w*1.5,h=w*1.8,m=at?len*at:len*0.86-h;   /* poire: the stem swells to a bulb (widest at m) and runs out to a spear point */
    s.lineTo(w*0.35,m-h*1.3);s.quadraticCurveTo(b,m-h*1.1,b,m);s.quadraticCurveTo(b,m+h*0.9,w*0.12,m+h*1.4);s.lineTo(0,len);s.lineTo(-w*0.12,m+h*1.4);s.quadraticCurveTo(-b,m+h*0.9,-b,m);s.quadraticCurveTo(-b,m-h*1.1,-w*0.35,m-h*1.3);}
  else{s.lineTo(w*0.3,len*0.85);s.lineTo(0,len);s.lineTo(-w*0.3,len*0.85);}
  if(b){s.lineTo(-w/2,yb);s.absarc(0,0,b,Math.PI-ab,tail>yb?Math.PI+ab:TAU+ab,false);if(o.sq)s.holes.push(sqPath(o.sq));else{const h=new THREE.Path();h.absarc(0,0,o.bore,0,TAU,true);s.holes.push(h);}}
  s.closePath();return s;
}
function handGeo(len,w,tail,kind,at,o){const g=extrude(handShape(len,w,tail,kind,at,o),{depth:0.35,bevelEnabled:false,curveSegments:o&&o.boss?32:12});g.rotateX(-Math.PI/2);return g;}
/* silvered dial, 4 inch. Default: the Hamilton Model 21 (below). kind 'roman': the German style of the A. Lange & Söhne deck chronometers (radial Roman chapter, IIII, the VI under a
   large seconds sub-dial, railroad tracks, AUF–AB wind scale), without the maker's name or number; the wind scale is drawn on this movement's sweep (UDA, movement.js).
   'swiss' and 'soviet': the Ulysse Nardin deck chronometers (Roman hours, UP/HAUT–DOWN/BAS) and the First Moscow Watch Factory's copies of them
   (Arabic hours, ЗАВОД–СПУСК, СДЕЛАНО В СССР): white face, railroad track, a large seconds sub-dial with lines at 5, 15 … 55 s; makers' names
   and numbers left off, wind scales on the movement's sweep (UDA) */
function dialCanvas(kind){
  const S=1536,c=S/2,cv=document.createElement('canvas');cv.width=cv.height=S;const x=cv.getContext('2d'),nard=kind==='swiss'||kind==='soviet';
  const g=x.createRadialGradient(c*0.7,c*0.6,S*0.05,c,c,c);g.addColorStop(0,nard?'#f8f7f2':'#f4f4f1');g.addColorStop(1,nard?'#e2e0d8':'#d9dad6');
  x.fillStyle=g;x.beginPath();x.arc(c,c,c,0,TAU);x.fill();
  if(!nard){x.globalAlpha=0.06;x.strokeStyle='#000';for(let r=6;r<c;r+=5){x.lineWidth=1;x.beginPath();x.arc(c,c,r,0,TAU);x.stroke();}x.globalAlpha=1;}   /* graining on the silvered dials; the Nardin-pattern faces are white */
  const ink='#17181a';x.strokeStyle=ink;x.fillStyle=ink;
  const ln=(cx,cy,a,ra,rb,w)=>{x.lineWidth=w;x.beginPath();x.moveTo(cx+ra*Math.sin(a),cy-ra*Math.cos(a));x.lineTo(cx+rb*Math.sin(a),cy-rb*Math.cos(a));x.stroke();};
  const circ=(cx,cy,r,w,a0=0,a1=TAU)=>{x.lineWidth=w;x.beginPath();x.arc(cx,cy,r,a0-Math.PI/2,a1-Math.PI/2);x.stroke();};
  const rad=(t,cx,cy,a,r,sx=1,ro=a)=>{x.save();x.translate(cx+r*Math.sin(a),cy-r*Math.cos(a));x.rotate(ro);x.scale(sx,1);x.fillText(t,0,0);x.restore();};
  const SANS='"Instrument Sans", Arial, sans-serif',up=a=>Math.cos(a)<-1e-6?a+Math.PI:a;   /* figures set radially, those in the lower half turned to read upright */
  const arcT=(t,cx,cy,r,a,low)=>{const cs=[...t],w=cs.map(ch=>x.measureText(ch).width);let th=a+w.reduce((s,v)=>s+v,0)/r/2*(low?1:-1);   /* letters along an arc, centred on a; low: along the bottom, tops inward */
    cs.forEach((ch,i)=>{const d=w[i]/r/2*(low?-1:1);th+=d;x.save();x.translate(cx+r*Math.sin(th),cy-r*Math.cos(th));x.rotate(low?th+Math.PI:th);x.fillText(ch,0,0);x.restore();th+=d;});};
  const tri=(r1,a)=>{const p=(r,d)=>[c+r*Math.sin(a+d),c-r*Math.cos(a+d)];x.beginPath();x.moveTo(...p(r1,0.012));x.lineTo(...p(r1,-0.012));x.lineTo(...p(r1-c*0.028,0));x.closePath();x.fill();};   /* hour mark: a small triangle on the outer line, pointing in */
  if(nard){
    const sov=kind==='soviet',CYR='Arial, "Helvetica Neue", Roboto, "DejaVu Sans", sans-serif';   /* Cyrillic is outside the vendored fonts' subset: system sans */
    x.textAlign='center';x.textBaseline='middle';
    const r1=c*0.96,r2=c*0.925;circ(c,c,r1,S*0.0018);circ(c,c,r2,S*0.0016);for(let i=0;i<60;i++)ln(c,c,i/60*TAU,r2,r1,S*0.0014);
    for(let i=0;i<12;i++){const a=i/12*TAU;if(sov)ln(c,c,a,r2,r1,S*0.009);else tri(r1,a);}   /* hour marks: bars (Soviet), triangles (Nardin) */
    const k=L.F[1]/DIAL_R,sy=c+c*k,uy=c+c*k*L.Ud[1]/L.F[1],rs=c*(sov?0.375:0.39),ru=c*(sov?0.27:0.255),A=UDA;
    /* wind: Nardin, a double arc ticked every 8 h round figures 8–48, UP/HAUT at the wound end, DOWN/BAS at the run-down end, an inner arc open under the XII;
       Soviet, figures 0–56 inside an outer circle open under the 12, round a ticked double arc, ЗАВОД (wound) and СПУСК (run down) */
    x.font=`500 ${S*0.026}px ${SANS}`;
    if(sov){circ(c,uy,ru,S*0.0016,22*D2R,338*D2R);circ(c,uy,ru*0.62,S*0.0014,A(0),A(56));circ(c,uy,ru*0.53,S*0.0014,A(0),A(56));
      for(let h=8;h<56;h+=8)ln(c,uy,A(h),ru*0.53,ru*0.62,S*0.0014);for(const h of[0,56])ln(c,uy,A(h),ru*0.4,ru*0.62,S*0.0022);
      for(let h=0;h<=56;h+=8)rad(String(h),c,uy,A(h),ru*0.8,1,up(A(h)));
      x.font=`600 ${S*0.021}px ${CYR}`;arcT('ЗАВОД',c,uy,ru*1.1,45*D2R);arcT('СПУСК',c,uy,ru*1.1,-45*D2R);}
    else{circ(c,uy,ru,S*0.0016,A(0),A(56));circ(c,uy,ru*0.92,S*0.0012,A(0),A(56));circ(c,uy,ru*0.55,S*0.0012,25*D2R,335*D2R);
      for(let h=0;h<=56;h+=8)ln(c,uy,A(h),ru*0.92,ru,S*(h%56?0.0012:0.0035));
      for(let h=8;h<=48;h+=8)rad(String(h),c,uy,A(h),ru*0.74,1,up(A(h)));
      x.font=`500 ${S*0.02}px ${SANS}`;for(const[t,r,s]of[['UP',1.24,1],['HAUT',1.07,1],['DOWN',1.24,-1],['BAS',1.07,-1]])arcT(t,c,uy,ru*r,s*39*D2R);}
    /* hours, the 6 under the seconds sub-dial */
    if(sov){x.font=`600 ${S*0.12}px ${SANS}`;x.lineWidth=S*0.0045;x.lineJoin='round';   /* stroked over the fill: the vendored face has no bold */
      for(let i=1;i<=12;i++){if(i===6)continue;const a=i/12*TAU,r=c*(i===5||i===7?0.8:0.72),px=c+r*Math.sin(a),py=c-r*Math.cos(a)+S*0.004;x.fillText(String(i),px,py);x.strokeText(String(i),px,py);}}
    else{x.font=`600 ${S*0.125}px Spectral, Georgia, serif`;['XII','I','II','III','IIII','V','','VII','VIII','IX','X','XI'].forEach((t,i)=>{if(t)rad(t,c,c,i/12*TAU,c*(i===5||i===7?0.8:0.775),[0,0.85,0.75,0.68,0.56][t.length]);});}
    /* seconds: railroad track, lines at 5, 15 … 55 s in to an inner circle, figures between; the V and VII pass under it */
    x.fillStyle=g;x.beginPath();x.arc(c,sy,rs+S*0.003,0,TAU);x.fill();x.fillStyle=ink;
    circ(c,sy,rs,S*0.0018);circ(c,sy,rs*0.9,S*0.0014);circ(c,sy,rs*0.64,S*0.0014);for(let i=0;i<60;i++)ln(c,sy,i/60*TAU,rs*0.9,rs,S*0.0012);
    for(let q=0;q<6;q++)ln(c,sy,(q+0.5)/6*TAU,rs*0.64,rs*0.9,S*0.0022);
    x.font=`500 ${S*0.032}px ${SANS}`;for(let q=1;q<=6;q++){const a=q/6*TAU;rad(String(q*10),c,sy,a,rs*0.77,1,up(a));}
    if(sov){x.font=`600 ${S*0.022}px ${CYR}`;arcT('СДЕЛАНО В СССР',c,sy,rs*0.53,Math.PI,true);}
    return cv;}
  if(kind==='roman'){
    const r1=c*0.965,r2=c*0.925;circ(c,c,r1,S*0.0018);circ(c,c,r2,S*0.0014);
    for(let i=0;i<60;i++)ln(c,c,i/60*TAU,r2,r1,i%5?S*0.0016:S*0.0026);
    x.beginPath();x.moveTo(c,c-r1-S*0.004);x.lineTo(c-S*0.006,c-r1-S*0.016);x.lineTo(c+S*0.006,c-r1-S*0.016);x.closePath();x.fill();   /* index at 60 */
    x.font=`600 ${S*0.097}px Spectral, Georgia, serif`;x.textAlign='center';x.textBaseline='middle';
    ['XII','I','II','III','IIII','V','','VII','VIII','IX','X','XI'].forEach((t,i)=>{if(t)rad(t,c,c,i/12*TAU,c*0.826,t.length>3?0.62:0.78);});
    const k=L.F[1]/DIAL_R,sy=c+c*k,uy=c+c*k*L.Ud[1]/L.F[1],rs=c*0.36,ru=c*0.25;
    /* seconds: railroad track, 5 s marks long, figures upright every 10 */
    circ(c,sy,rs,S*0.0018);circ(c,sy,rs*0.9,S*0.0012);circ(c,sy,rs*0.52,S*0.0012);
    for(let i=0;i<60;i++)ln(c,sy,i/60*TAU,i%5?rs*0.9:rs*0.8,rs,i%5?S*0.0012:S*0.0024);
    x.font=`400 ${S*0.03}px Spectral, Georgia, serif`;for(let q=1;q<=6;q++){const a=q/6*TAU,r=rs*0.67;x.fillText(String(q*10),c+r*Math.sin(a),sy-r*Math.cos(a)+S*0.002);}
    /* wind: double arc with 2 h marks, figures every 8 h set radially; AUF at the wound end, AB at the run-down end */
    const a0=UDA(0),a1=UDA(56);circ(c,uy,ru,S*0.0016,a0,a1);circ(c,uy,ru*0.84,S*0.0012,a0,a1);
    for(let h=0;h<=56;h+=2){const a=UDA(h);ln(c,uy,a,h%8?ru*0.84:ru*0.76,ru,h%8?S*0.0011:S*0.0024);
      if(h%8===0){x.font=`400 ${S*0.021}px Spectral, Georgia, serif`;rad(String(h),c,uy,a,ru*0.6);}}
    x.font=`600 ${S*0.026}px Spectral, Georgia, serif`;x.fillText('AUF',c+ru*0.92,uy-ru*0.92);x.fillText('AB',c-ru*0.92,uy-ru*0.92);
    return cv;}
  /* Hamilton, after a photographed Model 21 dial of the U.S. Maritime Commission contract: railroad minute track with triangles at the hours; large Arabic hours
     (the 6 under the seconds) set just inside it; HAMILTON and LANCASTER, PA., U.S.A. across the centre; a large seconds sub-dial meeting the track at 6, with
     the serial and U.S. MARITIME COMMISSION; the UP–DOWN scale open at the top round the 12. The sub-dial centres are fixed by their arbors (the UP–DOWN one farther out than the seconds, as on the photographed dial), which lie nearer the
     centre than on the dial photographed, so the sub-dials sit lower on this face and the inscriptions are closer together; the scale keeps this movement's
     sweep, UD_SWEEP (313.6°: the photographed dial's ticks, 8 h apart, give 315.7°) */
  /* its proportions measured on the photograph (face-on, scaled by the seconds' centre, which is on the fourth arbor, 21.6 mm out): the minute track r 40.4-42.2 (0.851-0.888 of the
     dial's radius; it was 0.905-0.955 until 3 October 2026, which with the fourth's measured place left no room for the seconds), the seconds track to r 17.9, 0.9 inside the minute track at 6,
     the UP-DOWN ring r 11.2; the dial shows to r 45.9 inside the bezel, as the photograph's */
  const r1=c*42.2/DIAL_R,r2=c*40.4/DIAL_R,k=L.F[1]/DIAL_R,sy=c+c*k,uy=c+c*L.Ud[1]/DIAL_R,rs=Math.min(r2-c*k-c*0.9/DIAL_R,(SEC_L+0.27)/DIAL_R*c),ru=c*11.2/DIAL_R;   /* the sub-dials on their arbors (k was a fixed 0.472, the fourth's place on a 50.8 mm dial, until 2 October 2026: 1.5 mm off it on this one); the seconds track to the hand's reach (SEC_L) */
  circ(c,c,r1,S*0.0018);circ(c,c,r2,S*0.0016);for(let i=0;i<60;i++)ln(c,c,i/60*TAU,r2,r1,S*0.0014);for(let i=0;i<12;i++)tri(r1,i/12*TAU);
  /* hours, sized so the figures stand 0.18 c tall: each numeral's box just inside the track; the 5 and 7 edged round toward the 4 and 8 until they clear the seconds sub-dial */
  x.font='600 100px Spectral, Georgia, serif';{const m=x.measureText('1234567890');x.font=`600 ${100*c*0.18/(m.actualBoundingBoxAscent+m.actualBoundingBoxDescent)}px Spectral, Georgia, serif`;}
  x.textAlign='left';x.textBaseline='alphabetic';
  for(let i=1;i<=12;i++){if(i===6)continue;const t=String(i),m=x.measureText(t),w=m.actualBoundingBoxLeft+m.actualBoundingBoxRight,h=m.actualBoundingBoxAscent+m.actualBoundingBoxDescent;let a=i/12*TAU,px,py;
    for(let j=0;j<60;j++){const sn=Math.sin(a),cs=Math.cos(a),r=r2-c*0.012-Math.abs(sn)*w/2-Math.abs(cs)*h/2;px=c+r*sn;py=c-r*cs;
      const dx=px-c,dy=py-sy,d=Math.hypot(dx,dy);if(d-(Math.abs(dx)*w/2+Math.abs(dy)*h/2)/d>rs+c*0.015)break;a+=(i<6?-1:1)*0.005;}
    x.fillText(t,px-(m.actualBoundingBoxRight-m.actualBoundingBoxLeft)/2,py+(m.actualBoundingBoxAscent-m.actualBoundingBoxDescent)/2);}
  x.textAlign='center';x.textBaseline='middle';
  const trk=(t,px,py,w)=>{x.save();x.translate(px,py);fillTracked(x,t,w);x.restore();};
  /* seconds: railroad track, bars across it every 10 s, lines at 5, 15 … 55 s inside, figures set radially */
  circ(c,sy,rs,S*0.0018);circ(c,sy,rs*0.915,S*0.0014);for(let i=0;i<60;i++)ln(c,sy,i/60*TAU,rs*0.915,rs,i%10?S*0.0012:S*0.003);
  for(let q=0;q<6;q++)ln(c,sy,(q+0.5)/6*TAU,rs*0.79,rs*0.915,S*0.0016);
  x.font=`500 ${S*0.031}px ${SANS}`;for(let q=1;q<=6;q++){const a=q/6*TAU;rad(String(q*10),c,sy,a,rs*0.78,1,up(a));}
  /* up/down scale as Fig. 107: UP at the upper right, hours since winding increasing clockwise round the bottom to DOWN at the upper left
     (winding turns the hand counterclockwise back to UP, manual Sec. III); a double ring with bars every 8 h, figures inside set radially, UP and DOWN past its ends */
  const A=UDA;circ(c,uy,ru,S*0.0016,A(0),A(56));circ(c,uy,ru*0.89,S*0.0014,A(0),A(56));for(let h=0;h<=56;h+=8)ln(c,uy,A(h),ru*0.89,ru,S*0.003);
  x.font=`600 ${S*0.029}px ${SANS}`;for(let h=8;h<=48;h+=8)rad(String(h),c,uy,A(h),ru*0.69,1,up(A(h)));
  x.font=`600 ${S*0.02}px ${SANS}`;arcT('UP',c,uy,ru*1.1,45*D2R);arcT('DOWN',c,uy,ru*1.1,-45*D2R);
  /* inscriptions: maker and town across the centre, split round the hands' boss; serial and contract in the seconds sub-dial */
  x.font=`600 ${S*0.042}px ${SANS}`;trk('HAMILTON',c,c-c*0.13,c*0.5);
  x.font=`600 ${S*0.027}px ${SANS}`;trk('LANCASTER,',c-c*0.32,c-c*0.005,c*0.35);trk('PA., U.S.A.',c+c*0.31,c-c*0.005,c*0.33);
  trk(SERIAL,c,sy-c*0.145,c*0.23);trk('U.S. MARITIME',c,sy+c*0.1,c*0.44);trk('COMMISSION',c,sy+c*0.215,c*0.41);
  return cv;
}
