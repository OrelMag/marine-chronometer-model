/* maker.js: what a maker takes away from the model (PLAN-self-contained.md, Phases B and C): each part card's maker's sheet (its lines of the manual's parts
   list with their measured fits, materials, finishes and heat treatments from js/makers.js, and its sizes, volume and mass measured on the built solids),
   its drawing (plan and elevation from the solids' edges, to scale, dimensioned) and its STL; the measuring tool; the whole build book to print; the
   model's numbers as JSON. One IIFE; the page sees only MAKER. app.js calls MAKER.bind() once the model is built, with what it needs */
"use strict";
const MAKER=(()=>{
  let A=null;   /* app.js's: mv, meshes, cam, cv, scene, M, PARTS, INFO, units(), wake(), R */
  const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const mm=v=>A&&A.units()==='in'?(v/25.4).toFixed(3)+' in':v.toFixed(2)+' mm';
  /* densities (g/cm³) by the model's material: steel 7.85, brass 8.5, Invar 8.1, stainless 7.9, corundum 4.0, glass 2.5, mahogany 0.6, gold 17, silver 10.5 */
  const DENS={steel:7.85,steelD:7.85,blued:7.85,brass:8.5,gilt:8.5,brassD:8.5,invar:8.1,ruby:4.0,glass:2.5,wood:0.6,gold:17,silver:10.5,nickel:8.9,chain:7.85,chain2:7.85};
  let matName=null;
  const nameOf=m=>{if(!matName){matName=new Map();for(const[k,v]of Object.entries(A.M))if(v&&v.isMaterial)matName.set(v,k);}return matName.get(m)||'';};
  /* the part's meshes as built (the merged copies are drawing only: the pieces are still under the movement), visible or not, without the engravings */
  const meshesOf=p=>A.meshes.filter(o=>o.userData.part===p&&!o.userData.decal&&!o.userData.surface&&o.geometry&&o.geometry.attributes.position);
  const toMv=o=>{const m=new THREE.Matrix4().copy(A.mv.matrixWorld).invert();return m.multiply(o.matrixWorld);};
  /* each triangle of a mesh in the movement's frame (mm), instances included */
  function tris(o,f){const g=o.geometry,P=g.attributes.position,I=g.index,mats=[];const base=toMv(o);
    if(o.isInstancedMesh){const im=new THREE.Matrix4();for(let i=0;i<o.count;i++){o.getMatrixAt(i,im);mats.push(base.clone().multiply(im));}}else mats.push(base);
    const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),n=I?I.count:P.count;
    for(const m of mats)for(let k=0;k<n;k+=3){const i0=I?I.getX(k):k,i1=I?I.getX(k+1):k+1,i2=I?I.getX(k+2):k+2;
      a.fromBufferAttribute(P,i0).applyMatrix4(m);b.fromBufferAttribute(P,i1).applyMatrix4(m);c.fromBufferAttribute(P,i2).applyMatrix4(m);f(a,b,c);}}
  /* a part measured: its box (mm), and each material's volume (signed, of the closed solids: solids.py keeps them closed) and mass */
  function measure(p){const box=new THREE.Box3(),by={};
    for(const o of meshesOf(p)){const k=nameOf(o.userData.mat0||o.material)||'other';let v=0;tris(o,(a,b,c)=>{box.expandByPoint(a);box.expandByPoint(b);box.expandByPoint(c);v+=a.dot(b.clone().cross(c))/6;});
      by[k]=(by[k]||0)+Math.abs(v);}
    const vol=Object.values(by).reduce((s,v)=>s+v,0),mass=Object.entries(by).reduce((s,[k,v])=>s+v*(DENS[k]||8)/1000,0);return{box,by,vol,mass};}
  function sheetHTML(p){const L=MAKERS.filter(l=>l.part===p),m=measure(p),s=m.box.getSize(new THREE.Vector3()),q=A.PARTS[p]||{};
    const rows=L.map(l=>`<tr><td>${esc(l.idx)}</td><td>${esc(l.no)}</td><td>${esc(l.name)}</td><td class="n">${esc(l.qty)}</td><td>${esc(l.mat)}<i>${l.cls==='manual'?'the manual':'practice'}</i></td><td>${esc(l.treat)}</td><td>${esc(l.fit)}</td></tr>`).join('');
    return`<table class="mk"><thead><tr><th>Idx</th><th>No.</th><th>Name</th><th class="n">Units</th><th>Material</th><th>Finish, heat treatment</th><th>Fit, as measured on the model</th></tr></thead><tbody>${rows||'<tr><td colspan="7">No line of the parts list is on this card.</td></tr>'}</tbody></table>
      <p class="mkm">As built: ${mm(s.x)} × ${mm(s.y)} × ${mm(s.z)} (along the movement's x, its axis y, z), ${m.vol.toFixed(1)} mm³, about ${m.mass.toFixed(2)} g (${Object.entries(m.by).filter(([,v])=>v>0.01).map(([k,v])=>`${k} ${v.toFixed(1)} mm³`).join(', ')}).
      Source of its shape: ${q.src?esc(A.SRC[q.src][0]):'—'}${q.sn?': '+esc(q.sn):''}. Sizes the model estimates are listed in its README's "Estimated, not from the manual".</p>`;}
  /* the drawing: the solids' edges (creases over 30°) projected to the plan (x, z, seen from the cock's side) and an elevation (x, y), to scale, with the overall sizes */
  function drawingSVG(p,title){const segP=[],segE=[],box=new THREE.Box3();
    for(const o of meshesOf(p)){const eg=new THREE.EdgesGeometry(o.geometry,30),P=eg.attributes.position,m=toMv(o),mats=[];
      if(o.isInstancedMesh){const im=new THREE.Matrix4();for(let i=0;i<Math.min(o.count,60);i++){o.getMatrixAt(i,im);mats.push(m.clone().multiply(im));}}else mats.push(m);
      const a=new THREE.Vector3(),b=new THREE.Vector3();for(const mt of mats)for(let i=0;i<P.count;i+=2){a.fromBufferAttribute(P,i).applyMatrix4(mt);b.fromBufferAttribute(P,i+1).applyMatrix4(mt);box.expandByPoint(a);box.expandByPoint(b);segP.push([a.x,a.z,b.x,b.z]);segE.push([a.x,-a.y,b.x,-b.y]);}
      eg.dispose();}
    if(box.isEmpty())return'';const s=box.getSize(new THREE.Vector3()),pad=Math.max(4,0.12*Math.max(s.x,s.z)),W=s.x+2*pad,Hp=s.z+2*pad,He=s.y+2*pad,gap=6;
    const line=(q,ox,oy)=>`<line x1="${(q[0]-ox).toFixed(3)}" y1="${(q[1]-oy).toFixed(3)}" x2="${(q[2]-ox).toFixed(3)}" y2="${(q[3]-oy).toFixed(3)}"/>`;
    const oxP=box.min.x-pad,oyP=box.min.z-pad,oxE=box.min.x-pad,oyE=-box.max.y-pad-Hp-gap,fs=Math.max(1.2,W/45);
    const dim=(x1,y1,x2,y2,t,ox,oy,vert)=>`<g class="d"><line x1="${x1-ox}" y1="${y1-oy}" x2="${x2-ox}" y2="${y2-oy}"/><text x="${(x1+x2)/2-ox+(vert?-fs*0.6:0)}" y="${(y1+y2)/2-oy+(vert?0:-fs*0.5)}" font-size="${fs}" text-anchor="middle"${vert?` transform="rotate(-90 ${(x1+x2)/2-ox-fs*0.6} ${(y1+y2)/2-oy})"`:''}>${t}</text></g>`;
    const H=Hp+He+gap;
    return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(2)} ${H.toFixed(2)}" width="${W.toFixed(1)}mm" height="${H.toFixed(1)}mm" class="mkd"><title>${esc(title)}: plan and elevation, mm</title>
      <g fill="none" stroke="currentColor" stroke-width="${(W/600).toFixed(3)}">${segP.map(q=>line(q,oxP,oyP)).join('')}${segE.map(q=>line(q,oxE,oyE)).join('')}</g>
      <g stroke="currentColor" stroke-width="${(W/900).toFixed(3)}" fill="currentColor">${dim(box.min.x,box.max.z+pad*0.5,box.max.x,box.max.z+pad*0.5,s.x.toFixed(2)+' mm',oxP,oyP)}${dim(box.min.x-pad*0.5,box.min.z,box.min.x-pad*0.5,box.max.z,s.z.toFixed(2)+' mm',oxP,oyP,1)}
      ${dim(box.min.x-pad*0.5,-box.max.y,box.min.x-pad*0.5,-box.min.y,s.y.toFixed(2)+' mm',oxE,oyE,1)}</g>
      <text x="${pad*0.3}" y="${fs*1.2}" font-size="${fs}" fill="currentColor">${esc(title)}: plan (from the cock's side), and below it the elevation; 1 unit = 1 mm</text></svg>`;}
  /* a binary STL of meshes, in the movement's frame (mm) */
  function stl(ms){let n=0;for(const o of ms)tris(o,()=>{n++;});const buf=new ArrayBuffer(84+50*n),dv=new DataView(buf);let off=84;dv.setUint32(80,n,true);
    const e1=new THREE.Vector3(),e2=new THREE.Vector3();
    for(const o of ms)tris(o,(a,b,c)=>{e1.subVectors(b,a);e2.subVectors(c,a);e1.cross(e2).normalize();for(const v of[e1,a,b,c]){dv.setFloat32(off,v.x,true);dv.setFloat32(off+4,v.y,true);dv.setFloat32(off+8,v.z,true);off+=12;}off+=2;});
    return new Blob([buf],{type:'model/stl'});}
  function save(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);}
  /* the card: a sheet below the description, opened on demand */
  function card(p){const info=$('#info');let mk=info.querySelector('.mkc');if(!mk){mk=document.createElement('div');mk.className='mkc';info.appendChild(mk);}
    mk.innerHTML=`<div class="seg"><button data-a="sheet">Maker's sheet</button><button data-a="dwg">Drawing</button><button data-a="stl">STL</button></div><div class="mkb"></div>`;
    const body=mk.querySelector('.mkb'),title=(A.INFO[p]||[p])[0];
    mk.querySelector('[data-a=sheet]').onclick=()=>{body.innerHTML=body.dataset.v==='s'?'':sheetHTML(p);body.dataset.v=body.dataset.v==='s'?'':'s';};
    mk.querySelector('[data-a=dwg]').onclick=()=>save(new Blob([drawingSVG(p,title)],{type:'image/svg+xml'}),`model21-${p}.svg`);
    mk.querySelector('[data-a=stl]').onclick=()=>save(stl(meshesOf(p)),`model21-${p}.stl`);}
  /* measuring: two points picked on the model, their distance */
  let meas=null;
  function measureOn(on){const b=$('#mkMeasure');b.setAttribute('aria-pressed',on?'true':'false');if(!on){if(meas){A.scene.remove(meas.line);meas=null;}$('#mkRead').textContent='';A.wake();return;}
    meas={pts:[],line:new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:0xd03020,depthTest:false}))};meas.line.renderOrder=9;A.scene.add(meas.line);$('#mkRead').textContent='Click two points on the model.';}
  function measureHit(hit){if(!meas||!hit)return false;const w=hit.point.clone(),p=A.mv.worldToLocal(w.clone());if(meas.pts.length===2)meas.pts=[];meas.pts.push({w,p});
    meas.line.geometry.setFromPoints(meas.pts.map(q=>q.w));const r=$('#mkRead');
    if(meas.pts.length===2){const d=meas.pts[0].p.distanceTo(meas.pts[1].p),dl=meas.pts[1].p.clone().sub(meas.pts[0].p);r.innerHTML=`<b>${d.toFixed(3)} mm</b> (${(d/25.4).toFixed(4)} in): across ${Math.abs(dl.x).toFixed(2)}, along the axis ${Math.abs(dl.y).toFixed(2)}, ${Math.abs(dl.z).toFixed(2)} mm`;}
    else r.textContent=`First point (${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}) mm; click the second.`;A.wake();return true;}
  /* the build book: every card's sheet and drawing, printed alone */
  function book(){let pr=document.getElementById('bookPrint');if(!pr){pr=document.createElement('div');pr.id='bookPrint';document.body.appendChild(pr);}
    const parts=Object.keys(A.INFO).filter(p=>meshesOf(p).length);
    pr.innerHTML=`<h1>The Hamilton Model 21: a build book</h1><p>Generated from the working model: every part card's lines of the manual's parts list (NAVSHIPS 250-624, Sec. XI), each line's fit as measured on the model, its material and treatment (the manual's where it names them, else watchmaking practice), and the part's drawing from the model's solids, in millimetres. What the model estimates is listed in its README's "Estimated, not from the manual"; the hairspring's and the escapement's design figures are in the essay and the README.</p>`+
      parts.map(p=>`<section class="bk"><h2>${esc(A.INFO[p][0])}</h2><p>${esc(A.INFO[p][1])}</p>${sheetHTML(p)}${drawingSVG(p,A.INFO[p][0])}</section>`).join('');
    document.documentElement.classList.add('book-print');const done=()=>{document.documentElement.classList.remove('book-print');removeEventListener('afterprint',done);};addEventListener('afterprint',done);
    if(!navigator.webdriver)print();else done();}
  /* the model's numbers: the train, the fusee's profile, the escapement's cycle, the hairspring's design, the parts list with its fits and materials */
  function data(){const R=A.R,fs=R.fs,N=FUSEE_TURNS,prof=[];for(let i=0;i<=70;i++){const m=N*i/70;prof.push({turn:+m.toFixed(4),r:+fs.rf(m).toFixed(4),barrelTurns:+fs.I(m).toFixed(4)});}
    const cyc=[];for(let i=0;i<=360;i++){const s=ESC.state(i/360);cyc.push({phase:i/360,balanceDeg:+(s.th*180/Math.PI).toFixed(4),detentLift:+s.lift.toFixed(5),tripSpring:+s.psDef.toFixed(5),wheelTeeth:+s.prog.toFixed(5)});}
    const hs=R.hsDesign;
    const out={made:'The Marine Chronometer working model, '+(document.querySelector('meta[name=version]')||{}).content,units:'mm, degrees, g·mm², s',TRAIN,MOD,arbors:L,
      fusee:{turns:N,profile:prof},escapement:{settings:ESC.settings,measure:ESC.measure(),cycle:cyc},
      hairspring:{coilR:5.1,turns:hs.turns,freeLength:hs.L,width:hs.b,thickness:hs.t,innerEnd:hs.rIn,outer:{length:hs.outer.l,junction:hs.outer.a,curvature:hs.outer.c},inner:{length:hs.inner.l,junction:hs.inner.a,curvature:hs.inner.c},pivotForce:hs.lat,centreline:hs.pts},
      balance:{I_TableII:R.I_T2,pitch:R.pitch},partsList:MAKERS};
    save(new Blob([JSON.stringify(out,null,1)],{type:'application/json'}),'model21-data.json');}
  return{bind(api){A=api;
      $('#mkMeasure').addEventListener('click',()=>measureOn(!meas));$('#mkBook').addEventListener('click',book);$('#mkData').addEventListener('click',data);
      $('#mkSTL').addEventListener('click',()=>save(stl(A.meshes.filter(o=>!o.userData.decal&&!o.userData.surface&&o.geometry&&o.geometry.attributes.position&&(()=>{for(let q=o;q;q=q.parent)if(!q.visible)return false;return true;})())),'model21-movement.stl'));},
    card,measuring:()=>!!meas,measureHit,sheetHTML,drawingSVG,stl,measure};
})();
