/* Drawing passes for illustration.py, run inside index.html?snap&qa. __passes renders the scene the page last drew (captured from __r.render) through
   replacement materials into a render target: albedo (colour and texture), shade (white Lambert under the scene's lights and shadows), normal (view space),
   depth (view distance in 1/64 mm, 24 bits in RGB), id (one colour per mesh) and mat (metalness, roughness). Each comes back as a PNG data URL. */
window.__stop=()=>{window.requestAnimationFrame=()=>0;};   /* freeze the page: its loop no longer moves anything, so a shot can be arranged by hand */
window.__passes=(W,H,opt={})=>{
  const r=__r,S=__S,cam=__C,T=THREE;S.updateMatrixWorld(true);cam.aspect=W/H;cam.updateProjectionMatrix();
  const rt=new T.WebGLRenderTarget(W,H,{depthBuffer:true}),px=new Uint8Array(W*H*4),cv=document.createElement('canvas');cv.width=W;cv.height=H;const cx=cv.getContext('2d'),im=cx.createImageData(W,H);
  const meshes=[];S.traverse(o=>{if(o.isMesh)meshes.push(o);});const sv=meshes.map(o=>({o,m:o.material,v:o.visible})),m0=o=>Array.isArray(o.material)?o.material[0]:o.material;
  const pn=o=>{const a=[];for(let p=o;p;p=p.parent)if(p.userData&&p.userData.partName)a.push(p.userData.partName);return a;};
  /* keep: only parts with one of these names (on the mesh or any parent); drop: never these; hide: JS function bodies of o; glass (opacity < 0.5) is never drawn */
  const hide=o=>{const m=m0(o);if(opt.keep&&!pn(o).some(n=>opt.keep.includes(n)))return true;if(opt.drop&&pn(o).some(n=>opt.drop.includes(n)))return true;return (m.transparent&&m.opacity<0.5)||(opt.hide||[]).some(f=>new Function('o',f)(o));};
  meshes.forEach(o=>{if(hide(o))o.visible=false;});const ids=new Map();meshes.forEach((o,i)=>ids.set(o,i+1));
  const depthMat=side=>new T.ShaderMaterial({side,vertexShader:'#include <common>\nvarying float vz;void main(){\n#include <begin_vertex>\n#include <project_vertex>\nvz=-mvPosition.z;}',
    fragmentShader:'varying float vz;void main(){float v=clamp(vz*64.0,0.0,16777215.0);float a=floor(v/65536.0),b=floor((v-a*65536.0)/256.0),c=v-a*65536.0-b*256.0;gl_FragColor=vec4(a/255.0,b/255.0,floor(c)/255.0,1.0);}'});
  const mk={albedo:m=>new T.MeshBasicMaterial({color:m.color||new T.Color(1,1,1),map:m.map||null,side:m.side,toneMapped:false}),shade:m=>new T.MeshLambertMaterial({color:0xffffff,side:m.side}),
    normal:m=>new T.MeshNormalMaterial({side:m.side}),depth:m=>depthMat(m.side),
    id:(m,o)=>{const i=ids.get(o);return new T.MeshBasicMaterial({color:new T.Color((i>>16&255)/255,(i>>8&255)/255,(i&255)/255),side:m.side,toneMapped:false});},
    mat:m=>new T.MeshBasicMaterial({color:new T.Color(m.metalness||0,m.roughness==null?1:m.roughness,0),side:m.side,toneMapped:false})};
  /* anchors for leader lines, as screen fractions: [key, part, fx, fy, fz] a point at fractions of the part's world bounding box (every mesh the page showed, hidden here or not),
     [key, '@mv', x, y, z] a point in the movement frame, [key, '@part', x, y, z] a point in that part's own frame */
  const anc={};for(const a of opt.anchors||[]){const v=new T.Vector3();
    if(a[1]==='@mv'){v.set(a[2],a[3],a[4]);__mv.localToWorld(v);}
    else if(a[1][0]==='@'){let g=null;S.traverse(o=>{if(!g&&o.userData.partName===a[1].slice(1))g=o;});v.set(a[2],a[3],a[4]);g.localToWorld(v);}
    else{const b=new T.Box3();sv.forEach(s=>{const m=m0(s.o);if(s.v&&pn(s.o).includes(a[1])&&!(m.transparent&&m.opacity<0.5))b.expandByObject(s.o);});v.set(b.min.x+(b.max.x-b.min.x)*a[2],b.min.y+(b.max.y-b.min.y)*a[3],b.min.z+(b.max.z-b.min.z)*a[4]);}
    v.project(cam);anc[a[0]]=[(v.x+1)/2,(1-v.y)/2];}
  const out={anc},bg0=S.background,cc=r.getClearColor(new T.Color()),ca=r.getClearAlpha();
  for(const k of Object.keys(mk)){
    const cache=new Map();meshes.forEach(o=>{const m=m0(o),key=k==='id'?o:m;if(!cache.has(key))cache.set(key,mk[k](m,o));o.material=cache.get(key);});
    S.background=null;r.setClearColor(k==='albedo'||k==='shade'?0xffffff:0x000000,1);
    r.setRenderTarget(rt);r.clear();r.render(S,cam);r.readRenderTargetPixels(rt,0,0,W,H,px);r.setRenderTarget(null);
    for(let y=0;y<H;y++){const s=(H-1-y)*W*4;for(let x=0;x<W*4;x+=4){const d=y*W*4+x;im.data[d]=px[s+x];im.data[d+1]=px[s+x+1];im.data[d+2]=px[s+x+2];im.data[d+3]=255;}}
    cx.putImageData(im,0,0);out[k]=cv.toDataURL('image/png');cache.forEach(m=>m.dispose());sv.forEach(s=>s.o.material=s.m);}
  sv.forEach(s=>{s.o.material=s.m;s.o.visible=s.v;});S.background=bg0;r.setClearColor(cc,ca);rt.dispose();return out;};
/* the box tilted as by the ship (pitch, roll), with the ring and case hanging level in their gimbals, as app.js does when rocking */
window.__tilt=(pitch,roll)=>{const root=__S.children.find(c=>c.userData.partName==='box'),ring=root.children.find(c=>c.userData.partName==='ring'),bowl=ring.children.find(c=>c.userData.partName==='bowl');
  root.rotation.set(pitch,0,roll,'ZYX');ring.rotation.x=-pitch;bowl.rotation.z=-roll;root.updateMatrixWorld(true);};
