/* core.js: helpers, materials (damascened nickel, gilt), textures, engraving, gear/spring/hand/pawl/escape-wheel geometry, dial, cross-section patch, pen-and-wash drawing
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
/* letters of t spread (or squeezed) to width w, centred on the origin; gx narrows each letter first, as on the engraved plates */
function fillTracked(x,t,w,gx=1){const cs=[...t],ws=cs.map(q=>x.measureText(q).width),n=ws.reduce((s,v)=>s+v,0),W=w/gx,g=cs.length>1?Math.max(0,(W-n)/(cs.length-1)):0;
  x.save();x.scale(gx*Math.min(1,W/n),1);x.textAlign='left';let px=-(n+g*(cs.length-1))/2;cs.forEach((q,i)=>{x.fillText(q,px,0);px+=ws[i]+g;});x.restore();}
function engraveLines(x,S,k,lines,cx,cz,size,gap,rotDeg=0){x.save();x.translate(S/2+cx*k,S/2-cz*k);x.rotate(rotDeg*D2R);lines.forEach((t,i)=>{const sz=Array.isArray(t)?t[1]:size;x.font=`600 ${sz*k}px Spectral, Georgia, serif`;x.fillText(Array.isArray(t)?t[0]:t,0,(i-(lines.length-1)/2)*gap*k);});x.restore();}
/* flat decal with the outline of a bridge, UV-mapped to the engraving canvas */
function decalGeo(poly){const s=new THREE.Shape();poly.forEach(([x,z],i)=>i?s.lineTo(x,z):s.moveTo(x,z));const g=new THREE.ShapeGeometry(s,24);
  const p=g.attributes.position,uv=g.attributes.uv,n=g.attributes.normal;
  for(let i=0;i<p.count;i++){const X=p.getX(i),Z=p.getY(i);p.setXYZ(i,X,0,Z);uv.setXY(i,(X+48)/96,(Z+48)/96);n.setXYZ(i,0,-1,0);}
  p.needsUpdate=uv.needsUpdate=n.needsUpdate=true;return g;}
/* escape wheel after the manual's Fig. 14: thin four-spoke rim carrying tall crown teeth */
function escapeWheel(parent,M,rt,y){
  const teeth=new THREE.Mesh(gearGeo(16,1,1.3,{escape:true,flip:true,rt,depth:rt*0.23,bore:rt*0.7}),M.gilt);teeth.position.y=y-0.1;parent.add(teeth);
  const web=new THREE.Shape();web.absarc(0,0,rt*0.72,0,TAU,false);for(let j=0;j<4;j++){const a0=j/4*TAU+0.12,a1=(j+1)/4*TAU-0.12,h=new THREE.Path();h.absarc(0,0,rt*0.62,a0,a1,false);h.absarc(0,0,1.3,a1,a0,true);web.holes.push(h);}
  const hb=new THREE.Path();hb.absarc(0,0,0.5,0,TAU,true);web.holes.push(hb);
  const wg=new THREE.ExtrudeGeometry(web,{depth:0.5,bevelEnabled:false,curveSegments:24});wg.rotateX(-Math.PI/2);wg.translate(0,-0.25,0);
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
    steel:S(0xdcdfe4,1,0.17),steelD:S(0x8f959d,1,0.3),blued:S(0x1a2c7a,0.9,0.24),ruby:S(0xc8163c,0.1,0.12,{emissive:sc(0x3a0010)}),
    chain:S(0x8c9199,1,0.3),chain2:S(0x6c717a,1,0.35),delrin:S(0xf1e8d6,0,0.55),mspring:S(0x3c4a70,0.9,0.3,{side:THREE.DoubleSide}),
    wood:S(0x9c7466,0,0.36,{map:wt}),woodEdge:S(0x3a130a,0,0.45),felt:S(0x1d3a2e,0,0.95),glass:S(0xffffff,0,0.02,{transparent:true,opacity:0.12,depthWrite:false}),
    invar:S(0xa7aaa6,1,0.28)};
  M.brassDS=M.brass.clone();M.brassDS.side=THREE.DoubleSide;
  M.setPlateFinish=k=>{const c=sc(PLATE_FINISH[k]);for(const m of[M.plate,M.plateSolid])m.color.copy(c);};   /* see-through and faded copies follow on the next look() (syncMat) */
  const eng=t=>new THREE.MeshStandardMaterial({map:t,transparent:true,metalness:0.6,roughness:0.6,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});
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
function patchSection(m,cap){
  if(!m||m.userData.secPatched)return;m.userData.secPatched=true;m.userData.secCap=cap;m.userData.side0=m.side;m.clipShadows=true;if(!m.clippingPlanes)m.clippingPlanes=[];SEC.mats.add(m);
  m.onBeforeCompile=sh=>{sh.uniforms.uSecOn=SEC.on;sh.uniforms.uSecCol=SEC.col;
    sh.fragmentShader='uniform float uSecOn;\nuniform vec3 uSecCol;\n'+sh.fragmentShader.replace('#include <dithering_fragment>','#include <dithering_fragment>\n'+(cap?
      'if(uSecOn>0.5&&!gl_FrontFacing){float st=step(0.5,fract((gl_FragCoord.x+gl_FragCoord.y)/9.0));vec3 cc=mix(uSecCol,diffuseColor.rgb,0.28)*(0.78+0.22*st);gl_FragColor=vec4(pow(max(cc,vec3(0.0)),vec3(1.0/2.2)),1.0);}':''));};
  m.customProgramCacheKey=()=>'sec'+(cap?1:0);
  m.needsUpdate=true;
}
function setSection(on,plane){SEC.on.value=on?1:0;SEC.plane=plane;for(const m of SEC.mats){m.clippingPlanes=on?[plane]:[];m.side=on&&m.userData.secCap?THREE.DoubleSide:m.userData.side0;m.needsUpdate=true;}}
const GHOST=new Map();
/* a derived copy (see-through, faded) takes its source's current texture and colour, so a dial style or plate finish chosen while it is shown carries over */
function syncMat(d,s){if(d.map!==s.map){d.map=s.map;d.needsUpdate=true;}if(s.color&&d.color)d.color.copy(s.color);return d;}
function ghostOf(m){let g=GHOST.get(m);if(!g){g=m.clone();g.transparent=true;g.opacity=Math.min(0.16,m.opacity??1);g.depthWrite=false;g.userData={};patchSection(g,false);
  if(SEC.on.value>0.5)g.clippingPlanes=[...(m.clippingPlanes||[])];GHOST.set(m,g);}return syncMat(g,m);}
/* ---------- pen and wash: the model drawn live as the Illustration tab is drawn (tools/illustration.py, stylize(); the numbers are its) ----------
   drawOf(m): m's wash. A Phong copy (per-pixel diffuse under the scene's lights and shadows, no specular) whose output is stylize()'s colour: the albedo in
   sRGB lifted toward the paper, chroma boosted and capped, the lit value in soft bands, laid as pigment density, left white where metal catches the light.
   Alpha carries the band (0.45 band; 1 is bare paper, cleared to white: a clear colour is premultiplied) for the hatching; a transparent source (the
   engraving) keeps the alpha beneath it */
const DRAW=new Map(),INK={shMax:{value:1.1},wash:{value:0.75}};   /* wash: pigment density; stylize() lays 1.25, lighter here so the live model reads through it */
const WASH=tr=>'float dL=dot(diffuseColor.rgb,vec3(0.3,0.55,0.15)),shd=dot(outgoingLight,vec3(0.3,0.55,0.15))/max(dL,1e-4);diffuseColor.rgb=mix(diffuse,diffuseColor.rgb,uTex);vec3 alb=pow(clamp(diffuseColor.rgb,0.0,1.0),vec3(1.0/2.2));'+
  'float aL=dot(alb,vec3(0.3,0.55,0.15));vec3 chr=(alb-aL)*1.6;chr*=min(1.0,0.3/max(length(chr),1e-6));vec3 wc=clamp(0.45+0.5225*aL+chr,0.0,1.0);'+
  'float bd=clamp((pow(clamp(shd/uShMax,0.0,1.0),1.0/2.2)-0.25)/0.7,0.0,1.0),bq=bd*3.0;bd=0.5*bd+0.5*(floor(bq)+smoothstep(0.3,0.7,fract(bq)))/3.0;'+
  'vec3 dens=(1.0-wc)+(1.0-bd)*(0.26+0.55*(1.0-wc));float hl=clamp((dot(normalize(normal),vec3(-0.3521,0.5533,0.7646))-0.9)/0.07,0.0,1.0)*clamp(uMetal*1.3,0.0,1.0);'+
  'gl_FragColor=vec4(exp(-dens*(1.0-0.85*hl)*uWash),'+(tr?'diffuseColor.a':'0.45*bd')+');';
function drawOf(m){let d=DRAW.get(m);
  if(!d){const tr=!!m.transparent,cap=!!m.userData.secCap,mt={value:m.metalness||0},tx={value:m.normalMap?0.3:1};   /* damascening (a map with a normal map) muted: washed, it read as hatching */
    d=new THREE.MeshPhongMaterial({color:m.color?m.color.clone():new THREE.Color(1,1,1),map:m.map||null,specular:0,shininess:1,transparent:tr,depthWrite:m.depthWrite,toneMapped:false,
      polygonOffset:m.polygonOffset,polygonOffsetFactor:m.polygonOffsetFactor,polygonOffsetUnits:m.polygonOffsetUnits});
    if(tr)Object.assign(d,{blending:THREE.CustomBlending,blendSrc:THREE.SrcAlphaFactor,blendDst:THREE.OneMinusSrcAlphaFactor,blendSrcAlpha:THREE.ZeroFactor,blendDstAlpha:THREE.OneFactor});
    patchSection(d,cap);d.userData.side0=m.userData.side0??m.side;d.side=m.side;d.clippingPlanes=[...(m.clippingPlanes||[])];
    const sec=d.onBeforeCompile;d.onBeforeCompile=sh=>{sh.uniforms.uMetal=mt;sh.uniforms.uTex=tx;sh.uniforms.uShMax=INK.shMax;sh.uniforms.uWash=INK.wash;
      sh.fragmentShader='uniform float uMetal;\nuniform float uTex;\nuniform float uShMax;\nuniform float uWash;\n'+sh.fragmentShader.replace('#include <dithering_fragment>',WASH(tr)+'\n#include <dithering_fragment>');sec(sh);
      sh.fragmentShader=sh.fragmentShader.replace('vec3(1.0/2.2)),1.0);','vec3(1.0/2.2)),0.45);');};   /* a cut face (patchSection) is drawing, not paper */
    d.customProgramCacheKey=()=>'draw'+(cap?1:0)+(tr?1:0);DRAW.set(m,d);}
  d.opacity=m.opacity??1;return syncMat(d,m);}
/* makeInk(r): draws a frame in pen and wash. Hidden meshes stay hidden; a mesh whose material is under half opaque (glass, see-through and faded parts) is a
   ghost, drawn in outline only, lighter, and left out of the wash. Passes: view normals and a part id (solids, then ghosts) with their depths; the wash (the
   meshes' drawOf materials, with the scene's shadows: the only pass that draws the shadow map); then two full-screen passes: ink lines where depth jumps (0.6 mm
   + 1.2% of the distance) or the drawing ends, lighter ones at creases (over ~37 degrees) and between parts; and the sheet: the wash laid a little off the
   lines, mottled and pooled at edges, on paper, hatched in deep shade, inked with a varying pen pressure.
   lines(): the Edges option, the same line pass over the normal frame instead of the wash. Ids are per mesh, not per part, and the box draws no lines */
function makeInk(r){
  const T=THREE,rt=(nearest,depth)=>{const t=new T.WebGLRenderTarget(1,1,nearest?{minFilter:T.NearestFilter,magFilter:T.NearestFilter}:{});if(depth)t.depthTexture=new T.DepthTexture(1,1,T.UnsignedIntType);return t;};
  const rtN=rt(1,1),rtG=rt(1,1),rtC=rt(0,1),rtE=rt(0,0);rtE.depthBuffer=false;   /* depth textures are 24-bit; a target's own depth buffer is 16-bit in r128, and the box's brass fought its wood */
  /* noise: white noise blurred to a 3-texel sigma, tiled, normalized to unit deviation (stored as 0.5 + 0.18 v), four independent channels. Made when pen and wash
     first draws: Edges, on from the start, doesn't need it */
  const noise=()=>{const NZ=256,nz=new Uint8Array(NZ*NZ*4);{const g=[],K=9;for(let i=-K;i<=K;i++)g.push(Math.exp(-i*i/18));
    for(let c=0;c<4;c++){let a=Float32Array.from({length:NZ*NZ},()=>Math.random()-0.5);
      for(const hz of[1,0]){const b=new Float32Array(NZ*NZ);for(let y=0;y<NZ;y++)for(let x=0;x<NZ;x++){let s=0;for(let i=-K;i<=K;i++)s+=g[i+K]*(hz?a[y*NZ+((x+i+NZ)%NZ)]:a[((y+i+NZ)%NZ)*NZ+x]);b[y*NZ+x]=s;}a=b;}
      let s2=0;for(const v of a)s2+=v*v;const k=1/Math.sqrt(s2/a.length);for(let i=0;i<a.length;i++)nz[i*4+c]=clamp(Math.round((0.5+0.18*a[i]*k)*255),0,255);}}
    const t=new T.DataTexture(nz,NZ,NZ,T.RGBAFormat);t.wrapS=t.wrapT=T.RepeatWrapping;t.magFilter=t.minFilter=T.LinearFilter;t.needsUpdate=true;return t;};
  /* normals and part id; the id is a uniform set per mesh as it is drawn (onBeforeRender, with uniformsNeedUpdate: an override material is otherwise uploaded once),
     and so is the mesh's own polygon offset: without it the dial's face, 0.02 above its brass disc, fought it, and Edges drew the fight as streaks across the dial */
  const nid=new T.ShaderMaterial({clipping:true,side:T.DoubleSide,toneMapped:false,uniforms:{uId:{value:0}},
    vertexShader:'#include <common>\n#include <clipping_planes_pars_vertex>\nvarying vec3 vN;\nvoid main(){\n#include <beginnormal_vertex>\n#include <defaultnormal_vertex>\n#include <begin_vertex>\n#include <project_vertex>\n#include <clipping_planes_vertex>\nvN=transformedNormal;}',
    fragmentShader:'#include <clipping_planes_pars_fragment>\nuniform float uId;varying vec3 vN;\nvoid main(){\n#include <clipping_planes_fragment>\nvec3 n=normalize(vN)*(gl_FrontFacing?1.0:-1.0);gl_FragColor=vec4(n*0.5+0.5,uId);}'});
  /* the id is the part's (pen and wash) or, for Edges, the mesh's: a pawl lies on its own part's wheel. Edges gives box meshes (userData.inkBox) id 0, no line */
  let idOn=false,idM=false,nM=0;function setId(){if(idOn){const m=this.material;nid.uniforms.uId.value=idM?this.userData.inkIdM:this.userData.inkId;nid.uniformsNeedUpdate=true;nid.polygonOffset=!!m.polygonOffset;nid.polygonOffsetFactor=m.polygonOffsetFactor||0;nid.polygonOffsetUnits=m.polygonOffsetUnits||0;}}
  const hash=s=>{let h=7;for(const c of String(s))h=(h*31+c.charCodeAt(0))%251;return(h+3)/255;};
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
  vec4 c=texture2D(tC,vUv+vec2(nz(p,18.0,0),nz(p,18.0,1))*1.4*uPr*uPx);float fg=clamp((1.0-c.a)*2.0,0.0,1.0),bd=clamp(c.a/0.45,0.0,1.0);
  vec2 h=0.5*uPx;vec4 e=0.25*(texture2D(tE,vUv+h)+texture2D(tE,vUv-h)+texture2D(tE,vUv+vec2(h.x,-h.y))+texture2D(tE,vUv-vec2(h.x,-h.y)));
  float pl=0.0;for(int i=0;i<8;i++){float a=float(i)*0.7854;vec4 q=texture2D(tE,vUv+vec2(cos(a),sin(a))*2.5*uPr*uPx);pl+=max(q.r,q.g);}pl/=8.0;
  float m=(1.0+0.07*nz(p,10.0,2)+0.035*nz(p,2.0,3))*(1.0+0.25*clamp(pl*3.0,0.0,1.0));vec3 w=pow(max(c.rgb,vec3(1e-4)),vec3(m));
  float pr=clamp(0.85+0.15*nz(p,12.0,3),0.55,1.0),ink=max(e.r,e.g*0.8)*pr;
  float hat=1.0-smoothstep(0.05,0.13,abs(fract((p.x-p.y)/5.5)-0.5));ink=max(ink,hat*clamp((0.4-bd)/0.25,0.0,1.0)*fg*0.55*pr);
  float g=e.b*0.55*(1.0-0.8*fg);gl_FragColor=vec4(uPaper*mix(mix(w,uInk,g),uInk,ink),1.0);}`});
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
    for(const o of meshes){if(!o.visible)continue;if(o.onBeforeRender!==setId){o.onBeforeRender=setId;o.userData.inkId=hash(o.userData.part);o.userData.inkIdM=o.userData.inkBox?0:(nM++%251+3)/255;}const m=o.material;(m.transparent&&m.opacity<0.5?gh:so).push(o);}
    /* targets at the drawing's size only while used, else 1 px (setSize frees the old one): the ghosts' while there are ghosts, the wash's while pen and wash draws.
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
/* several geometries as one mesh's, each placed by its matrix ([[geometry, Matrix4], ...]): one draw call (and one shadow-pass call) instead of many */
function mergeGeo(list){const gs=list.map(([g,m])=>{const q=(g.index?g.toNonIndexed():g.clone()).applyMatrix4(m);g.dispose();return q;}),out=new THREE.BufferGeometry();
  for(const[k,n]of[['position',3],['normal',3],['uv',2]]){if(!gs.every(g=>g.attributes[k]))continue;const a=new Float32Array(gs.reduce((t,g)=>t+g.attributes[k].array.length,0));let o=0;for(const g of gs){a.set(g.attributes[k].array,o);o+=g.attributes[k].array.length;}out.setAttribute(k,new THREE.BufferAttribute(a,n));}
  gs.forEach(g=>g.dispose());return out;}
function cylBetween(p,r,y0,y1,mat,x=0,z=0,seg=16){return mesh(p,cylY(r,Math.abs(y1-y0),seg),mat,x,(y0+y1)/2,z);}
function discGeo(r,th,holes=[]){if(typeof checkHoles==='function')checkHoles('discGeo',holes,(x,z)=>r-Math.hypot(x,z));const s=new THREE.Shape();s.absarc(0,0,r,0,TAU,false);for(const[hx,hz,hr]of holes){const h=new THREE.Path();h.absarc(hx,-hz,hr,0,TAU,true);s.holes.push(h);}
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
    if(w.collet!==0)mesh(g,cylY(w.collet||1.6,(w.th||1)+(w.cside?0.65:1.2),20),M.brass2,0,w.y+(w.cside||0)*0.275,0);}   /* cside ±1: collet on that side of the wheel only (0.05 proud of the other face, not flush with it) */
  if(o.pin){const p=o.pin;g.userData.pin=mesh(g,gearGeo(p.n||10,p.m,p.th||2.5,{bore:p.bore}),M.steel,0,p.y,0);g.userData.np=p.n||10;}
  if(o.ar){const[a,b]=o.ar;cylBetween(g,o.r||0.55,a,b,M.steel,0,0,12);}
  return g;
}
function springGeo(R,H,N,th,wire,rc=R*0.2,rs=R*0.3){   /* rc, rs: radii of the inner (collet) and outer (stud) ends, where the terminal curves end */
  const c=new THREE.Curve();c.arcLengthDivisions=1400;
  const Re=R*N/(N+th/TAU*0.8),a0=0.09,tot=TAU*N+TAU;
  c.getPoint=(t,v=new THREE.Vector3())=>{let ang,r,y;
    if(t<a0){const s=t/a0;ang=Math.PI*s;r=rc+(Re-rc)*Math.sin(s*Math.PI/2);y=H*0.05*s;}
    else if(t>1-a0){const s=(t-1+a0)/a0;ang=Math.PI+TAU*N+Math.PI*s;r=Re-(Re-rs)*(1-Math.cos(s*Math.PI/2));y=H*0.95+H*0.05*s;}
    else{const s=(t-a0)/(1-2*a0);ang=Math.PI+TAU*N*s;r=Re;y=H*0.05+H*0.9*s;}
    const a=ang+th*(1-ang/tot);return v.set(r*Math.cos(a),y,-r*Math.sin(a));};
  return new THREE.TubeGeometry(c,Math.round(N*46),wire,6,false);
}
function handGeo(len,w,tail,kind,at){   /* tail<0: a spear counterpoise -tail long in place of the flat tail; at: the pear's bulb at at·len */
  const s=new THREE.Shape();if(tail<0){const T=-tail,b=w*1.3;s.moveTo(-w/2,0);s.lineTo(-w*0.35,-T*0.55);s.quadraticCurveTo(-b,-T*0.74,-b*0.85,-T*0.8);s.quadraticCurveTo(-b*0.45,-T*0.86,0,-T);s.quadraticCurveTo(b*0.45,-T*0.86,b*0.85,-T*0.8);s.quadraticCurveTo(b,-T*0.74,w*0.35,-T*0.55);s.lineTo(w/2,0);}
  else{s.moveTo(-w/2,-tail);s.lineTo(w/2,-tail);}
  if(kind==='spade'){s.lineTo(w*0.3,len*0.6);s.quadraticCurveTo(w*1.3,len*0.68,w*0.95,len*0.8);s.lineTo(0,len);s.lineTo(-w*0.95,len*0.8);s.quadraticCurveTo(-w*1.3,len*0.68,-w*0.3,len*0.6);}
  else if(kind==='leaf'||kind==='lance'){const b=kind==='leaf'?w*1.9:w*1.25,m=kind==='leaf'?0.68:0.8;   /* leaf widest at m·len, drawn to a point */
    s.lineTo(w*0.35,len*(m-0.25));s.quadraticCurveTo(b,len*(m-0.06),b*0.85,len*m);s.quadraticCurveTo(b*0.45,len*(m+0.14),0,len);s.quadraticCurveTo(-b*0.45,len*(m+0.14),-b*0.85,len*m);s.quadraticCurveTo(-b,len*(m-0.06),-w*0.35,len*(m-0.25));}
  else if(kind==='pear'){const b=w*1.5,h=w*1.8,m=at?len*at:len*0.86-h;   /* poire: the stem swells to a bulb (widest at m) and runs out to a spear point */
    s.lineTo(w*0.35,m-h*1.3);s.quadraticCurveTo(b,m-h*1.1,b,m);s.quadraticCurveTo(b,m+h*0.9,w*0.12,m+h*1.4);s.lineTo(0,len);s.lineTo(-w*0.12,m+h*1.4);s.quadraticCurveTo(-b,m+h*0.9,-b,m);s.quadraticCurveTo(-b,m-h*1.1,-w*0.35,m-h*1.3);}
  else{s.lineTo(w*0.3,len*0.85);s.lineTo(0,len);s.lineTo(-w*0.3,len*0.85);}
  s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:0.35,bevelEnabled:false});g.rotateX(-Math.PI/2);return g;
}
/* silvered dial, 4 inch. Default: the Hamilton Model 21 (below). kind 'roman': the German style of the A. Lange & Söhne deck chronometers (radial Roman chapter, IIII, the VI under a
   large seconds sub-dial, railroad tracks, AUF–AB wind scale), without the maker's name or number; the wind scale keeps this model's 240° arc.
   'swiss' and 'soviet': the Ulysse Nardin deck chronometers (Roman hours, UP/HAUT–DOWN/BAS) and the First Moscow Watch Factory's copies of them
   (Arabic hours, ЗАВОД–СПУСК, СДЕЛАНО В СССР): white face, railroad track, a large seconds sub-dial with lines at 5, 15 … 55 s; makers' names
   and numbers left off, wind scales on the 240° arc */
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
    const k=0.472,sy=c+c*k,uy=c-c*k,rs=c*(sov?0.375:0.39),ru=c*(sov?0.27:0.255),A=h=>(60+240*h/56)*D2R;
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
    const k=0.472,sy=c+c*k,uy=c-c*k,rs=c*0.36,ru=c*0.25;
    /* seconds: railroad track, 5 s marks long, figures upright every 10 */
    circ(c,sy,rs,S*0.0018);circ(c,sy,rs*0.9,S*0.0012);circ(c,sy,rs*0.52,S*0.0012);
    for(let i=0;i<60;i++)ln(c,sy,i/60*TAU,i%5?rs*0.9:rs*0.8,rs,i%5?S*0.0012:S*0.0024);
    x.font=`400 ${S*0.03}px Spectral, Georgia, serif`;for(let q=1;q<=6;q++){const a=q/6*TAU,r=rs*0.67;x.fillText(String(q*10),c+r*Math.sin(a),sy-r*Math.cos(a)+S*0.002);}
    /* wind: double arc with 2 h marks, figures every 8 h set radially; AUF at the wound end, AB at the run-down end */
    const a0=60*D2R,a1=300*D2R;circ(c,uy,ru,S*0.0016,a0,a1);circ(c,uy,ru*0.84,S*0.0012,a0,a1);
    for(let h=0;h<=56;h+=2){const a=(60+240*h/56)*D2R;ln(c,uy,a,h%8?ru*0.84:ru*0.76,ru,h%8?S*0.0011:S*0.0024);
      if(h%8===0){x.font=`400 ${S*0.021}px Spectral, Georgia, serif`;rad(String(h),c,uy,a,ru*0.6);}}
    x.font=`600 ${S*0.026}px Spectral, Georgia, serif`;x.fillText('AUF',c+ru*0.92,uy-ru*0.92);x.fillText('AB',c-ru*0.92,uy-ru*0.92);
    return cv;}
  /* Hamilton, after a photographed Model 21 dial of the U.S. Maritime Commission contract: railroad minute track with triangles at the hours; large Arabic hours
     (the 6 under the seconds) set just inside it; HAMILTON and LANCASTER, PA., U.S.A. across the centre; a large seconds sub-dial meeting the track at 6, with
     the serial and U.S. MARITIME COMMISSION; the UP–DOWN scale open at the top round the 12. The sub-dial centres are fixed by their arbors, which lie nearer the
     centre than on the dial photographed, so the sub-dials sit lower on this face and the inscriptions are closer together; the scale keeps this movement's
     240° sweep (the photographed dial's spans about 310°) */
  const r1=c*0.955,r2=c*0.905,k=0.472,sy=c+c*k,uy=c-c*k,rs=r2-c*k,ru=c*0.255;
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
  const A=h=>(60+240*h/56)*D2R;circ(c,uy,ru,S*0.0016,A(0),A(56));circ(c,uy,ru*0.89,S*0.0014,A(0),A(56));for(let h=0;h<=56;h+=8)ln(c,uy,A(h),ru*0.89,ru,S*0.003);
  x.font=`600 ${S*0.029}px ${SANS}`;for(let h=8;h<=48;h+=8)rad(String(h),c,uy,A(h),ru*0.69,1,up(A(h)));
  x.font=`600 ${S*0.02}px ${SANS}`;arcT('UP',c,uy,ru*1.1,45*D2R);arcT('DOWN',c,uy,ru*1.1,-45*D2R);
  /* inscriptions: maker and town across the centre, split round the hands' boss; serial and contract in the seconds sub-dial */
  x.font=`600 ${S*0.042}px ${SANS}`;trk('HAMILTON',c,c-c*0.13,c*0.5);
  x.font=`600 ${S*0.027}px ${SANS}`;trk('LANCASTER,',c-c*0.32,c-c*0.005,c*0.35);trk('PA., U.S.A.',c+c*0.31,c-c*0.005,c*0.33);
  trk(SERIAL,c,sy-c*0.145,c*0.23);trk('U.S. MARITIME',c,sy+c*0.1,c*0.44);trk('COMMISSION',c,sy+c*0.215,c*0.41);
  return cv;
}
