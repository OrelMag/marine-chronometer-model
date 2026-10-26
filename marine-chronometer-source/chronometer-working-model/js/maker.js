/* maker.js: what a maker takes away from the model (PLAN-self-contained.md, Phases B and C): each part card's maker's sheet (its lines of the manual's parts
   list with their measured fits, materials, finishes and heat treatments from js/makers.js, and its sizes, volume and mass measured on the built solids),
   its drawing (plan and elevation from the solids' edges, to scale, dimensioned) and its STL; the measuring tool; the whole build book to print; the
   model's numbers as JSON. One IIFE; the page sees only MAKER. app.js calls MAKER.bind() once the model is built, with what it needs */
"use strict";
const MAKER=(()=>{
  let A=null;   /* app.js's: mv, meshes, cam, cv, scene, M, PARTS, INFO, units(), wake(), R, changed(), and cfg: the model's words and choices (C, the Hamilton's by default) */
  /* the model's words: the Hamilton's here; another model's page (the Wempe's js/app.js) gives its own in bind's cfg */
  let C={prefix:'model21',origAs:'The Model 21 as made',origBtn:'Show the original Model 21',build:'the build\'s (1950s)',cls:{manual:'the manual'},clsElse:'practice',cols:['Idx','No.'],
    est:'Sizes the model estimates are listed in its README\'s "Estimated, not from the manual".',none:'No line of the parts list is on this card.',cardSTL:true,
    threads:'Hamilton\'s threads are not known (the manual gives none, the videos don\'t resolve them): the thread to cut is the standard metric one nearest the model\'s, a maker\'s choice; tap the part each screws into, clear the parts it passes through, as the fits above say.',
    bookTitle:'The Hamilton Model 21: a build book',bookIntro:'<p>Generated from the working model: every part card\'s lines of the manual\'s parts list (NAVSHIPS 250-624, Sec. XI), each line\'s fit as measured on the model, its material and treatment (the manual\'s where it names them, else watchmaking practice), and the part\'s drawing from the model\'s solids, in millimetres. What the model estimates is listed in its README\'s "Estimated, not from the manual"; the hairspring\'s and the escapement\'s design figures are in the essay and the README.</p>',
    devsOrig:'the Model 21\'s, as made',devsBuild:'the build\'s, a deviation from the Model 21 (the original is beside it on its sheet)',
    testsIntro:'<p>The analysis says the design works; only these say a chronometer made to it does. Each figure is the working model\'s own (its checks: tools/ in the repository) or the manual\'s. Write the measurements into the file tools/benchcheck.py makes (python benchcheck.py --template MEAS.json): python benchcheck.py MEAS.json judges each and says what to do where one fails (set-up turns, the timing weights, the stud, the manual\'s operation).</p>',
    bookMore:'',holesNote:'Holes square to the arbors, read off the solids (as tools/holes.py does): centres from the movement\'s centre (the centre arbor), x toward 3 o\'clock, z toward 6; the top is the dial side.'};
  /* the build's deviations from the Model 21 (MAKERS.devs, tools/deviations.js): on by default, each set back to the original by its card's button; ORIG holds
     those set back (the link keeps them: orig=mainspring,hairspring, app.js) */
  const ORIG=new Set(),devOn=id=>!ORIG.has(id),devsOf=p=>(MAKERS.devs||[]).filter(d=>d.parts.includes(p.split('.')[0]));
  const devHTML=(d,btn)=>`<div class="mkdev"><p class="mkm mkt"><b>${devOn(d.id)?'Changed for the build':C.origAs+'; the build changes it'}: ${esc(d.title)}</b> (${esc(d.period)}). ${esc(d.why)}${btn?'':` Sources: ${d.sources.map(esc).join('; ')}.`}</p>${btn?`<button type="button" class="mkdevb" data-dev="${d.id}">${devOn(d.id)?C.origBtn:'Show the build\'s'}</button>`:''}</div>`;
  const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const mm=v=>A&&A.units()==='in'?(v/25.4).toFixed(3)+' in':v.toFixed(2)+' mm';
  /* densities (g/cm³) by the model's material: steel 7.85, brass 8.5, Invar 8.1, stainless 7.9, corundum 4.0, glass 2.5, mahogany 0.6, gold 17, silver 10.5 */
  const DENS={steel:7.85,steelD:7.85,blued:7.85,brass:8.5,gilt:8.5,brassD:8.5,invar:8.1,ruby:4.0,clear:3.5,glass:2.5,wood:0.6,woodEdge:0.6,felt:0.3,fibre:1.3,packing:1.2,delrin:1.4,gold:17,silver:10.5,nickel:8.9,chain:7.85,chain2:7.85};
  let matName=null;
  const nameOf=m=>{if(!matName){matName=new Map();for(const[k,v]of Object.entries(A.M))if(v&&v.isMaterial)matName.set(v,k);}return matName.get(m)||'';};
  /* the part's meshes as built (the merged copies are drawing only: the pieces are still under the movement), visible or not, without the engravings and the Laid out
     view's schematic stand-ins (devPlate: the viewer tags them with the part they stand for, for its card) */
  const meshesOf=p=>(A.R&&A.R.springReady&&A.R.springReady(),[...A.meshes,...(A.boxMeshes||[])]).filter(o=>(p.includes('.')?o.userData.pk===p:o.userData.part===p)&&!o.userData.decal&&!o.userData.surface&&!o.userData.devPlate&&o.geometry&&o.geometry.attributes.position);
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
  /* the holes through a part's faces square to the arbors (as tools/holes.py reads them): on each of its meshes' top and bottom faces, the outline's inner
     loops that are round (radius within 6 % all round, under 6 mm); a hole on both faces at one place is one hole, its two diameters (a counterbore or
     countersink shows as two). Centres in the movement's frame, mm from the movement's centre (the centre arbor): x toward 3 o'clock, z toward 6 */
  function holes(p){const out=[];
    for(const o of meshesOf(p)){if(o.isInstancedMesh)continue;const g=o.geometry,P=g.attributes.position,I=g.index,m=toMv(o),n=I?I.count:P.count,V=[];const v=new THREE.Vector3();
      for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i).applyMatrix4(m);V.push([v.x,v.y,v.z]);}
      let y0=1e9,y1=-1e9;for(const q of V){if(q[1]<y0)y0=q[1];if(q[1]>y1)y1=q[1];}if(y1-y0<0.05)continue;
      for(const[lev,face]of[[y1,'top'],[y0,'bottom']]){const E=new Map(),k=q=>q[0].toFixed(3)+','+q[2].toFixed(3);
        for(let t=0;t<n;t+=3){const ix=[I?I.getX(t):t,I?I.getX(t+1):t+1,I?I.getX(t+2):t+2],T=ix.map(i=>V[i]);if(!T.every(q=>Math.abs(q[1]-lev)<2e-3))continue;
          for(let e=0;e<3;e++){const a=k(T[e]),b=k(T[(e+1)%3]);if(a===b)continue;const key=a<b?a+'|'+b:b+'|'+a;E.set(key,(E.get(key)||0)+1);}}
        const adj=new Map();for(const[e,c]of E)if(c===1){const[a,b]=e.split('|');(adj.get(a)||adj.set(a,[]).get(a)).push(b);(adj.get(b)||adj.set(b,[]).get(b)).push(a);}
        const seen=new Set();for(const s of adj.keys()){if(seen.has(s))continue;const L=[];let c=s,prev=null;
          while(c&&!seen.has(c)){seen.add(c);L.push(c.split(',').map(Number));const nx=(adj.get(c)||[]).find(x=>x!==prev&&!seen.has(x));prev=c;c=nx;}
          if(L.length<6)continue;const cx=L.reduce((a,q)=>a+q[0],0)/L.length,cz=L.reduce((a,q)=>a+q[1],0)/L.length,rs=L.map(q=>Math.hypot(q[0]-cx,q[1]-cz)),r=rs.reduce((a,x)=>a+x,0)/rs.length;
          if(r>6||r<0.05||Math.max(...rs.map(x=>Math.abs(x-r)))>0.06*r+0.01)continue;
          let h=out.find(q=>Math.hypot(q.x-cx,q.z-cz)<0.15);if(!h){h={x:cx,z:cz,top:null,bottom:null,yT:null,yB:null};out.push(h);}
          if(face==='top'){h.top=Math.max(h.top||0,r);h.yT=lev;}else{h.bottom=Math.max(h.bottom||0,r);h.yB=lev;}}}}
    out.sort((a,b)=>Math.atan2(a.z,a.x)-Math.atan2(b.z,b.x));out.forEach((h,i)=>h.n=i+1);return out;}
  const holeRows=H=>H.length?`<table class="mk"><thead><tr><th>Hole</th><th class="n">x</th><th class="n">z</th><th class="n">Ø top</th><th class="n">Ø bottom</th><th>Kind</th></tr></thead><tbody>${H.map(h=>{const dT=h.top?2*h.top:null,dB=h.bottom?2*h.bottom:null,
      kind=dT&&dB?(Math.abs(dT-dB)<0.02?'through':dT>dB?'counterbored or countersunk from the top':'counterbored or countersunk from below'):dT?'blind, from the top':'blind, from below';
      return`<tr><td>h${h.n}</td><td class="n">${mm(h.x)}</td><td class="n">${mm(h.z)}</td><td class="n">${dT?mm(dT):'—'}</td><td class="n">${dB?mm(dB):'—'}</td><td>${kind}</td></tr>`;}).join('')}</tbody></table>
      <p class="mkm">${C.holesNote}</p>`:'';
  /* the screws on a card: head, thread and length as the model draws them, grouped by parts-list line, with the ISO 261 coarse metric thread nearest the drawn
     thread for a maker to cut (Hamilton's own threads are in none of the sources: the manual gives none, the videos don't resolve them) */
  const ISO=[[0.8,0.2],[1,0.25],[1.2,0.25],[1.4,0.3],[1.6,0.35],[1.8,0.35],[2,0.4],[2.5,0.45],[3,0.5],[3.5,0.6],[4,0.7],[5,0.8],[6,1]];
  function screwRows(p){const seen=new Map();for(const o of meshesOf(p)){const g=o.parent;if(!g||!g.userData.sc||!g.userData.sc.len)continue;const c=g.userData.sc,id=g.userData.hn||'—',k=id+'|'+c.rs.toFixed(3)+'|'+c.len.toFixed(2);
      if(!seen.has(k))seen.set(k,{id,c,n:new Set()});seen.get(k).n.add(g);}
    if(!seen.size)return'';const iso=d=>ISO.reduce((b,q)=>Math.abs(q[0]-d)<Math.abs(b[0]-d)?q:b);
    return`<table class="mk"><thead><tr><th>Screw</th><th class="n">Pieces</th><th class="n">Head Ø</th><th class="n">Thread Ø</th><th class="n">Under the head</th><th>Thread to cut</th></tr></thead><tbody>${[...seen.values()].map(({id,c,n})=>{const d=2*c.rs,[M,P]=iso(d);
      return`<tr><td>${esc(id)}</td><td class="n">${n.size}</td><td class="n">${mm(2*c.r)}</td><td class="n">${mm(d)}</td><td class="n">${mm(c.len)}</td><td>M${M} × ${P} (ISO 261 coarse; the drawn ${d.toFixed(2)})</td></tr>`;}).join('')}</tbody></table>
      <p class="mkm">${C.threads}</p>`;}
  /* the parts-list lines a part's meshes carry (userData.hn, on the mesh or the group above it: a screw's), for a model whose lines' cards and meshes may differ (C.byHn) */
  const hnOf=p=>{const S=new Set();for(const o of meshesOf(p))for(let q=o;q&&q!==A.mv;q=q.parent)if(q.userData.hn){S.add(q.userData.hn);break;}return S;};
  /* a piece's sheet (part.k): the parts-list lines it lists (PIECES' h), else the line its part's card is cut on (the box glass), its own meshes, its source where it has one, else its part's */
  function sheetHTML(p){const pc=A.PCE&&A.PCE[p],q=pc&&pc.src?{src:pc.src,sn:pc.sn}:A.PARTS[p.split('.')[0]]||{},own=pc?MAKERS.filter(l=>pc.h.split(' ').includes(l.id)):MAKERS.filter(l=>l.part===p||(C.byHn&&l.part!==p&&hnOf(p).has(l.id))),sp=own.length?[]:(((A.PARTS[p.split('.')[0]]||{}).sp||'').match(/\d{5}/g)||[]),L=own.length?own:MAKERS.filter(l=>sp.includes(l.no)),m=measure(p),s=m.box.getSize(new THREE.Vector3());
    const dv=l=>l.dev&&devOn(l.dev),rows=L.map(l=>`<tr><td>${esc(l.idx)}</td><td>${esc(l.no)}</td><td>${esc(l.name)}</td><td class="n">${esc(l.qty)}</td><td>${esc(dv(l)?l.vmat:l.mat)}<i>${dv(l)?C.build:C.cls[l.cls]||C.clsElse}</i></td><td>${esc(dv(l)?l.vtreat:l.treat)}${l.how?`<i>${esc(l.how)}: ${esc(l.hown)}</i>`:''}</td><td>${esc(l.fit)}</td></tr>`).join('');
    return`<table class="mk"><thead><tr><th>${C.cols[0]}</th><th>${C.cols[1]}</th><th>Name</th><th class="n">Units</th><th>Material</th><th>Finish, heat treatment</th><th>Fit, as measured on the model</th></tr></thead><tbody>${rows||`<tr><td colspan="7">${C.none}</td></tr>`}</tbody></table>${!own.length&&L.length?`<p class="mkm">This card is cut on the line above, which the ${esc((A.INFO[L[0].part]||[L[0].part])[0])} card carries.</p>`:''}
      ${(MAKERS.devs||[]).filter(d=>L.some(l=>l.dev===d.id)).map(d=>devHTML(d,false)+(devOn(d.id)?`<p class="mkm">${C.origAs}: ${L.filter(l=>l.dev===d.id).map(l=>`${esc(l.no)}, ${esc(l.mat)}; ${esc(l.treat)}`).join('. ')}.</p>`:'')).join('')}${L.filter(l=>l.tol).map(l=>`<p class="mkm mkt"><b>Tolerance (${esc(l.no)}).</b> ${esc(l.tol)}</p>`).join('')}${L.filter(l=>l.bench).map(l=>`<p class="mkm mkt"><b>Test on the bench (${esc(l.no)}).</b> ${esc(l.bench)} The build book's last chapter says how.</p>`).join('')}
      <p class="mkm">As built: ${mm(s.x)} × ${mm(s.y)} × ${mm(s.z)} (along the movement's x, its axis y, z), ${m.vol.toFixed(1)} mm³, about ${m.mass.toFixed(2)} g (${Object.entries(m.by).filter(([,v])=>v>0.01).map(([k,v])=>`${k} ${v.toFixed(1)} mm³`).join(', ')}).
      Source of its shape: ${q.src?esc(A.SRC[q.src][0]):'—'}${q.sn?': '+esc(q.sn):''}. ${C.est}</p>${holeRows(holes(p))}${screwRows(p)}`;}
  /* the drawing: the solids' edges (creases over 30°) projected to the plan (x, z, seen from the dial side: 3 o'clock right, 12 up) and an elevation (x, y, the dial side
     up), to scale, with the overall sizes, and the holes (holes()) marked and numbered as the sheet's table lists them */
  /* a geometry's creases (over 30°), kept while the book is built (EDG: its parts' pieces are drawn again on their own sheets, screws share a geometry) */
  let EDG=null;const edgesOf=g=>{let P=EDG&&EDG.get(g);if(!P){const eg=new THREE.EdgesGeometry(g,30);P=eg.attributes.position;eg.dispose();if(EDG)EDG.set(g,P);}return P;};
  function drawingSVG(p,title){const segP=[],segE=[],box=new THREE.Box3();
    for(const o of meshesOf(p)){const P=edgesOf(o.geometry),m=toMv(o),mats=[];
      if(o.isInstancedMesh){const im=new THREE.Matrix4();for(let i=0;i<Math.min(o.count,60);i++){o.getMatrixAt(i,im);mats.push(m.clone().multiply(im));}}else mats.push(m);
      const a=new THREE.Vector3(),b=new THREE.Vector3();for(const mt of mats)for(let i=0;i<P.count;i+=2){a.fromBufferAttribute(P,i).applyMatrix4(mt);b.fromBufferAttribute(P,i+1).applyMatrix4(mt);box.expandByPoint(a);box.expandByPoint(b);segP.push([a.x,a.z,b.x,b.z]);segE.push([a.x,-a.y,b.x,-b.y]);}}
    const dd=L=>{const S=new Set();return L.filter(q=>{const a=q[0].toFixed(2)+','+q[1].toFixed(2),b=q[2].toFixed(2)+','+q[3].toFixed(2);if(a===b)return false;const k=a<b?a+'|'+b:b+'|'+a;if(S.has(k))return false;S.add(k);return true;});};   /* edges that coincide in the projection drawn once */
    segP.splice(0,segP.length,...dd(segP));segE.splice(0,segE.length,...dd(segE));
    if(box.isEmpty())return'';const s0=box.getSize(new THREE.Vector3()),
      /* printed at a standard scale (sc printed mm a model mm), the largest that fits A4's column (180 mm) and a page (250 mm); lines and text in printed mm */
      SC=[20,10,5,4,2,1,0.5,0.25],fits=k=>(s0.x*1.3+8/k)*k<=180&&((s0.z+s0.y)*1.3+30/k)*k<=250,sc=SC.find(fits)||0.2,u=1/sc,
      pad=Math.max(12*u,0.12*Math.max(s0.x,s0.z)),s=s0,W=Math.max(s.x+2*pad,160*u),Hp=s.z+2*pad,He=s.y+2*pad,gap=6*u,
      scT=sc>=1?`${sc}:1`:`1:${1/sc}`;
    /* the edges as one path of polylines, segments chained end to end, to the printed 0.02 mm (a <line> each made the Wempe's book 65 MB of SVG, which the print preview
       couldn't lay out: the tab crashed) */
    const dg=sc>=4?3:sc>=0.5?2:1,poly=(L,ox,oy)=>{const k=(x,y)=>(x-ox).toFixed(dg)+' '+(y-oy).toFixed(dg),E=L.map(q=>[k(q[0],q[1]),k(q[2],q[3])]).filter(e=>e[0]!==e[1]),adj=new Map(),used=new Uint8Array(E.length);
      E.forEach((e,i)=>{for(const v of e){if(!adj.has(v))adj.set(v,[]);adj.get(v).push(i);}});
      const walk=v=>{const out=[];for(;;){const n=adj.get(v).find(j=>!used[j]);if(n===undefined)return out;used[n]=1;v=E[n][0]===v?E[n][1]:E[n][0];out.push(v);}};
      let d='';E.forEach((e,i)=>{if(used[i])return;used[i]=1;const f=walk(e[1]),b=walk(e[0]);d+='M'+[...b.reverse(),e[0],e[1],...f].join('L');});return`<path d="${d}"/>`;};
    const oxP=box.min.x-pad-(W-s.x-2*pad)/2,oyP=box.min.z-pad-8*u,oxE=oxP,oyE=-box.max.y-pad-Hp-gap-8*u,fs=2.2*u;
    const dim=(x1,y1,x2,y2,t,ox,oy,vert)=>`<g class="d"><line x1="${x1-ox}" y1="${y1-oy}" x2="${x2-ox}" y2="${y2-oy}"/><text stroke="none" x="${(x1+x2)/2-ox+(vert?-fs*0.6:0)}" y="${(y1+y2)/2-oy+(vert?0:-fs*0.5)}" font-size="${fs}" text-anchor="middle"${vert?` transform="rotate(-90 ${(x1+x2)/2-ox-fs*0.6} ${(y1+y2)/2-oy})"`:''}>${t}</text></g>`;
    const H=Hp+He+gap+8*u,HL=holes(p),hm=HL.map(h=>{const d=2*Math.max(h.top||0,h.bottom||0),x=h.x-oxP,y=h.z-oyP,c=Math.max(1.5*u,d*0.7);return`<g class="h"><line x1="${(x-c).toFixed(3)}" y1="${y.toFixed(3)}" x2="${(x+c).toFixed(3)}" y2="${y.toFixed(3)}"/><line x1="${x.toFixed(3)}" y1="${(y-c).toFixed(3)}" x2="${x.toFixed(3)}" y2="${(y+c).toFixed(3)}"/><text stroke="none" x="${(x+c*0.8).toFixed(3)}" y="${(y-c*0.8).toFixed(3)}" font-size="${(1.6*u).toFixed(3)}">h${h.n}</text></g>`;}).join('');   /* the number only: each hole's diameters are in the sheet's table */
    return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(3)} ${H.toFixed(3)}" width="${(W*sc).toFixed(2)}mm" height="${(H*sc).toFixed(2)}mm" class="mkd"><title>${esc(title)}: plan and elevation, mm, scale ${scT}</title>
      <g fill="none" stroke="currentColor" stroke-width="${(0.18*u).toFixed(4)}">${poly(segP,oxP,oyP)}${poly(segE,oxE,oyE)}</g>
      <g stroke="currentColor" stroke-width="${(0.13*u).toFixed(4)}" fill="currentColor">${dim(box.min.x,box.max.z+pad*0.5,box.max.x,box.max.z+pad*0.5,s.x.toFixed(2)+' mm',oxP,oyP)}${dim(box.min.x-pad*0.5,box.min.z,box.min.x-pad*0.5,box.max.z,s.z.toFixed(2)+' mm',oxP,oyP,1)}
      ${dim(box.min.x-pad*0.5,-box.max.y,box.min.x-pad*0.5,-box.min.y,s.y.toFixed(2)+' mm',oxE,oyE,1)}</g>
      <g stroke="#c0392b" fill="#c0392b" stroke-width="${(0.13*u).toFixed(4)}">${hm}</g>
      <text x="${3*u}" y="${3.2*u}" font-size="${(2.6*u).toFixed(3)}" fill="currentColor">${esc(title)}: scale ${scT}, sizes in mm</text>
      <text x="${3*u}" y="${6.4*u}" font-size="${(1.8*u).toFixed(3)}" fill="currentColor">Plan from the dial side (12 o'clock up), below it the elevation (the dial side up); holes h1… as the sheet lists them</text></svg>`;}
  /* a binary STL of meshes, in the movement's frame (mm) */
  function stl(ms){let n=0;for(const o of ms)tris(o,()=>{n++;});const buf=new ArrayBuffer(84+50*n),dv=new DataView(buf);let off=84;dv.setUint32(80,n,true);
    const e1=new THREE.Vector3(),e2=new THREE.Vector3();
    for(const o of ms)tris(o,(a,b,c)=>{e1.subVectors(b,a);e2.subVectors(c,a);e1.cross(e2).normalize();for(const v of[e1,a,b,c]){dv.setFloat32(off,v.x,true);dv.setFloat32(off+4,v.y,true);dv.setFloat32(off+8,v.z,true);off+=12;}off+=2;});
    return new Blob([buf],{type:'model/stl'});}
  function save(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);}
  /* the card: a sheet below the description, opened on demand */
  function card(p){const info=$('#info');let mk=info.querySelector('.mkc');if(!mk){mk=document.createElement('div');mk.className='mkc';info.appendChild(mk);}
    mk.innerHTML=`${devsOf(p).map(d=>devHTML(d,true)).join('')}<div class="seg"><button data-a="sheet">Maker's sheet</button><button data-a="dwg">Drawing</button>${C.cardSTL?'<button data-a="stl">STL</button>':''}</div><div class="mkb"></div>`;
    for(const b of mk.querySelectorAll('.mkdevb'))b.onclick=()=>{const id=b.dataset.dev;ORIG.has(id)?ORIG.delete(id):ORIG.add(id);const open=mk.querySelector('.mkb').dataset.v==='s';card(p);if(open)mk.querySelector('[data-a=sheet]').click();if(A&&A.changed)A.changed();};
    const body=mk.querySelector('.mkb'),title=(A.INFO[p]||[p])[0];
    mk.querySelector('[data-a=sheet]').onclick=()=>{body.innerHTML=body.dataset.v==='s'?'':sheetHTML(p);body.dataset.v=body.dataset.v==='s'?'':'s';};
    mk.querySelector('[data-a=dwg]').onclick=()=>save(new Blob([drawingSVG(p,title)],{type:'image/svg+xml'}),`${C.prefix}-${p}.svg`);
    if(C.cardSTL)mk.querySelector('[data-a=stl]').onclick=()=>save(stl(meshesOf(p)),`${C.prefix}-${p}.stl`);}
  /* measuring: two points picked on the model, their distance */
  let meas=null;
  function measureOn(on){const b=$('#mkMeasure');b.setAttribute('aria-pressed',on?'true':'false');if(!on){if(meas){A.scene.remove(meas.line);meas=null;}$('#mkRead').textContent='';A.wake();return;}
    meas={pts:[],line:new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:0xd03020,depthTest:false}))};meas.line.renderOrder=9;A.scene.add(meas.line);$('#mkRead').textContent='Click two points on the model.';}
  function measureHit(hit){if(!meas||!hit)return false;const w=hit.point.clone(),p=A.mv.worldToLocal(w.clone());if(meas.pts.length===2)meas.pts=[];meas.pts.push({w,p});
    meas.line.geometry.setFromPoints(meas.pts.map(q=>q.w));const r=$('#mkRead');
    if(meas.pts.length===2){const d=meas.pts[0].p.distanceTo(meas.pts[1].p),dl=meas.pts[1].p.clone().sub(meas.pts[0].p);r.innerHTML=`<b>${d.toFixed(3)} mm</b> (${(d/25.4).toFixed(4)} in): across ${Math.abs(dl.x).toFixed(2)}, along the axis ${Math.abs(dl.y).toFixed(2)}, ${Math.abs(dl.z).toFixed(2)} mm`;}
    else r.textContent=`First point (${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}) mm; click the second.`;A.wake();return true;}
  /* the oiling chart on the model (PLAN D1): each part that takes oil or grease coloured by it, after the manual's reassembly (Ops. 18-71; the essay's
     "Oil, and where it goes"): red oil the jewelled pivots, argon oil the bushed ones, grease the mainspring and the maintaining work */
  const OIL={red:[0xc0392b,'Red oil (Hamilton No. 47): the jewelled pivots'],argon:[0x2e86c1,'Argon oil: the bushed pivots'],grease:[0xd4ac0d,'Grease (Hamilton T-324): the mainspring and maintaining work']};
  const OILED={fw:'red',escW:'red',bal:'red',tw:'red',cw:'argon',fusee:'argon',spawl:'argon',motion:'argon',barrel:'grease',gw:'grease',sspring:'grease',sratchet:'grease',ratchet:'grease'};
  let oilOn=false;const oilMat={};
  function oil(on){oilOn=on;$('#mkOil').setAttribute('aria-pressed',on?'true':'false');
    for(const o of A.meshes){const k=OILED[o.userData.part];if(!k)continue;if(on){const m=oilMat[k]||(oilMat[k]=new THREE.MeshStandardMaterial({color:OIL[k][0],roughness:0.5,metalness:0.2}));o.material=m;}else o.material=o.userData.mat0;}
    $('#mkRead').innerHTML=on?Object.values(OIL).map(([c,t])=>`<span style="display:inline-flex;gap:5px;align-items:center;margin-right:10px"><i style="width:10px;height:10px;border-radius:50%;background:#${c.toString(16).padStart(6,'0')}"></i>${t}</span>`).join('')+'<br>The escapement\'s working faces (the locking and impulse jewels, the trip spring) are not oiled.':'';A.wake();}
  /* the build book: every card's sheet and drawing, printed alone. A part with pieces (app.js PIECES) is an assembly: its card, its pieces named, its drawing as assembled,
     then each piece to make with its own sheet and drawing (none but the pieces' carry its lines, so each line is on one sheet: tools/book.py); a piece marked nb, a variant
     or another part's copy (the split balance, the winding key on the hands' square), is left out */
  function book(){let pr=document.getElementById('bookPrint');if(!pr){pr=document.createElement('div');pr.id='bookPrint';document.body.appendChild(pr);}
    EDG=new Map();const parts=Object.keys(A.INFO).filter(p=>!p.includes('.')&&meshesOf(p).length&&(!C.inBook||C.inBook(meshesOf(p)))),PCE=A.PCE||{};   /* C.inBook: the model's own choice of what is built (the Wempe's: its version's parts) */
    const sec=p=>{const q=A.PARTS[p]||{},pcs=(q.pcs||[]).map(c=>p+'.'+c.k).filter(k=>!PCE[k].nb&&meshesOf(k).length&&(!C.inBook||C.inBook(meshesOf(k))));
      if(!pcs.length)return`<section class="bk"><h2>${esc(A.INFO[p][0])}</h2><p>${esc(A.INFO[p][1])}</p>${sheetHTML(p)}${drawingSVG(p,A.INFO[p][0])}</section>`;
      return`<section class="bk asm"><h2>${esc(A.INFO[p][0])}</h2><p>${esc(A.INFO[p][1])}</p><p class="mkm">An assembly of ${pcs.length} pieces, each on its own sheet below: ${pcs.map(k=>esc(A.INFO[k][0])).join(', ')}. Its drawing as assembled.</p>${drawingSVG(p,A.INFO[p][0]+', assembled')}</section>`+
        pcs.map(k=>`<section class="bk pc"><h2>${esc(A.INFO[k][0])}</h2><p class="mkm">Part of the ${esc(A.INFO[p][0].toLowerCase())}.</p><p>${esc(A.INFO[k][1])}</p>${sheetHTML(k)}${drawingSVG(k,A.INFO[k][0])}</section>`).join('');};
    pr.innerHTML=`<h1>${C.bookTitle}</h1>${C.bookIntro}${(MAKERS.devs||[]).length?`<p>${(MAKERS.devs||[]).map(d=>`${esc(d.title)}: ${devOn(d.id)?C.devsBuild:C.devsOrig}`).join('; ')}. Each part card switches between the two.</p>`:''}`+
      parts.map(sec).join('')+
      /* putting it together: the manual's reassembly (Sec. VIII) in its own order, from the overhaul (overhaul.js) */
      (typeof OVH!=='undefined'?`<section class="bk order"><h2>Putting it together</h2><p>The manual's reassembly (Sec. VIII, Ops. 1-105), in its own order, with its tools (by the numbers of Sec. XIII), oils and checks, and the parts each operation puts on, by their lines of the parts list. Ops. 16-34 (the fusee) and 35-39 (the barrel) are usually done before Op. 1, as the manual says; it sets them where those parts go into the movement. The page's Overhaul shows each operation on the model, and tools/overhaul.py checks that every part goes on along its arbor without passing through another (where a real movement does it otherwise, sideways or tilted, it says so and why).</p>${OVH.RE.map(s=>`<h3>Op. ${s.op}. ${esc(s.t)}</h3><p>${s.x}</p>${OVH.meta(s).length?`<p class="mkm">${OVH.meta(s).join('. ')}.</p>`:''}`).join('')}</section>`:'')+
      /* the tests on the bench (tools/bench.js through makers.py): what the parts and the finished movement must read, from the model's checks and the manual's */
      (C.bookMore||'')+`<section class="bk tests"><h2>Tests on the bench</h2>${C.testsIntro}${(MAKERS.tests||[]).map((t,i)=>`<h3>${i+1}. ${esc(t.title)}</h3><p class="mkm"><b>When:</b> ${esc(t.when)}.</p><p><b>How.</b> ${esc(t.how)}</p><p><b>It must read.</b> ${esc(t.pass)}</p>`).join('')}</section>`;
    EDG=null;document.documentElement.classList.add('book-print');const done=()=>{document.documentElement.classList.remove('book-print');removeEventListener('afterprint',done);};
    if(!navigator.webdriver){addEventListener('afterprint',()=>{done();pr.innerHTML='';},{once:true});print();}else done();}   /* emptied after printing: its drawings are tens of MB of SVG */
  /* the button's: built after a paint that says so (the Wempe's takes some 15 s) */
  function bookBtn(){const b=$('#mkBook');if(b.disabled)return;const t=b.textContent;b.disabled=true;b.textContent='Building the book…';
    requestAnimationFrame(()=>setTimeout(()=>{try{book();}finally{b.disabled=false;b.textContent=t;}},30));}
  /* the model's numbers: the train, the fusee's profile, the escapement's cycle, the hairspring's design, the parts list with its fits and materials */
  function data(){const R=A.R,fs=R.fs,N=FUSEE_TURNS,prof=[];for(let i=0;i<=70;i++){const m=N*i/70;prof.push({turn:+m.toFixed(4),r:+fs.rf(m).toFixed(4),barrelTurns:+fs.I(m).toFixed(4)});}
    const cyc=[];for(let i=0;i<=360;i++){const s=ESC.state(i/360);cyc.push({phase:i/360,balanceDeg:+(s.th*180/Math.PI).toFixed(4),detentLift:+s.lift.toFixed(5),tripSpring:+s.psDef.toFixed(5),wheelTeeth:+s.prog.toFixed(5)});}
    const hs=R.hsDesign;
    const out={made:'The Marine Chronometer working model, '+(document.querySelector('meta[name=version]')||{}).content,units:'mm, degrees, g·mm², s',TRAIN,MOD,arbors:L,
      fusee:{turns:N,profile:prof},escapement:{settings:ESC.settings,measure:ESC.measure(),cycle:cyc},
      hairspring:{coilR:5.1,turns:hs.turns,freeLength:hs.L,width:hs.b,thickness:hs.t,innerEnd:hs.rIn,outer:{length:hs.outer.l,junction:hs.outer.a,curvature:hs.outer.c},inner:{length:hs.inner.l,junction:hs.inner.a,curvature:hs.inner.c},pivotForce:hs.lat,centreline:hs.pts},
      balance:{I_TableII:R.I_T2,pitch:R.pitch},partsList:MAKERS};
    save(new Blob([JSON.stringify(out,null,1)],{type:'application/json'}),'model21-data.json');}
  return{bind(api){A=api;if(api.cfg)C={...C,...api.cfg,cls:{...C.cls,...(api.cfg.cls||{})}};   /* another model's words; its data() (the model's numbers) where it has its own */
      $('#mkMeasure').addEventListener('click',()=>measureOn(!meas));if($('#mkOil'))$('#mkOil').addEventListener('click',()=>oil(!oilOn));$('#mkBook').addEventListener('click',bookBtn);if($('#mkData'))$('#mkData').addEventListener('click',C.data||data);
      if($('#mkSTL'))$('#mkSTL').addEventListener('click',()=>save(stl(A.meshes.filter(o=>!o.userData.decal&&!o.userData.surface&&o.geometry&&o.geometry.attributes.position&&(()=>{for(let q=o;q;q=q.parent)if(!q.visible)return false;return true;})())),C.prefix+'-movement.stl'));},
    card,measuring:()=>!!meas,measureHit,sheetHTML,drawingSVG,stl,measure,holes,book,orig:()=>[...ORIG].sort(),setOrig:ids=>{ORIG.clear();for(const i of ids)if((MAKERS.devs||[]).some(d=>d.id===i))ORIG.add(i);}};
})();
