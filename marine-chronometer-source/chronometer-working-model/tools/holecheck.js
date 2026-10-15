/* holecheck.js: run in the page by holecheck.py. Every round hole in a flat face of every mesh of the movement (an inner loop of that face's outline that is a
   circle: bores, screw holes, pivot holes, jewel holes, pin holes) is followed along its axis, and points a quarter, half and three quarters down it (the mesh's
   depth along the axis, or the hole's own floor if it is blind) are tested against every other closed mesh: inside one (an odd number of crossings on a ray out
   of the point), the hole holds something (a pivot, a screw's shank, a pin, a setting, an arbor). Returns one row per hole: its part, line (hn), centre in the
   movement's frame, axis, radius, depth, and what is in it (or nothing). Parts shown as the page opens, Performance mode off (merged copies set aside). */
(opt)=>{const mv=window.__mv,rmin=opt.rmin,rmax=opt.rmax;mv.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert();
  const vis=o=>{for(let h=o;h&&h!==mv;h=h.parent)if(!h.visible&&!(h===o&&o.userData.onlyDrive))return false;return true;};
  const ms=[];mv.traverse(o=>{if(o.isMesh&&!o.userData.decal&&!o.userData.surface&&vis(o)&&o.geometry&&o.geometry.attributes&&o.geometry.attributes.position)ms.push(o);});
  const pn=o=>{for(let m=o;m&&m!==mv;m=m.parent)if(m.userData.partName)return m.userData.partName;return '?';};
  const hnOf=o=>{for(let m=o;m&&m!==mv;m=m.parent){const h=m.userData.hn;if(h)return Array.isArray(h)?h.join('|'):h;}return '';};
  /* each mesh in the movement's frame: its triangles, and a box */
  const W=new Map();for(const o of ms){const M=new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld),g=o.geometry,p=g.attributes.position,ix=g.index?g.index.array:null,n=ix?ix.length:p.count,T=new Float64Array(n*3),bb=new THREE.Box3(),v=new THREE.Vector3();
    for(let i=0;i<n;i++){v.fromBufferAttribute(p,ix?ix[i]:i).applyMatrix4(M);T[3*i]=v.x;T[3*i+1]=v.y;T[3*i+2]=v.z;bb.expandByPoint(v);}W.set(o,{T,bb});}
  /* a point inside a mesh: crossings of a ray from it (a slanted direction, so it misses edges), counted odd */
  const hits=(o,q,D)=>{const{T}=W.get(o),out=[];
    for(let i=0;i<T.length;i+=9){const ax=T[i],ay=T[i+1],az=T[i+2],e1=[T[i+3]-ax,T[i+4]-ay,T[i+5]-az],e2=[T[i+6]-ax,T[i+7]-ay,T[i+8]-az];
      const h=[D[1]*e2[2]-D[2]*e2[1],D[2]*e2[0]-D[0]*e2[2],D[0]*e2[1]-D[1]*e2[0]],a=e1[0]*h[0]+e1[1]*h[1]+e1[2]*h[2];if(Math.abs(a)<1e-12)continue;
      const f=1/a,s=[q.x-ax,q.y-ay,q.z-az],u=f*(s[0]*h[0]+s[1]*h[1]+s[2]*h[2]);if(u<0||u>1)continue;const qq=[s[1]*e1[2]-s[2]*e1[1],s[2]*e1[0]-s[0]*e1[2],s[0]*e1[1]-s[1]*e1[0]],w=f*(D[0]*qq[0]+D[1]*qq[1]+D[2]*qq[2]);
      if(w<0||u+w>1)continue;const t=f*(e2[0]*qq[0]+e2[1]*qq[1]+e2[2]*qq[2]);if(t>1e-9)out.push(t);}return out;};
  const SL=[0.5773,0.5784,0.5762],inside=(o,q)=>W.get(o).bb.containsPoint(q)&&hits(o,q,SL).length%2===1;
  /* the holes: per mesh, its flat faces (triangles grouped by normal and plane), each face's boundary loops, the inner ones that are circles */
  const out=[];
  for(const o of ms){const{T}=W.get(o),F=new Map();
    for(let i=0;i<T.length;i+=9){const a=new THREE.Vector3(T[i],T[i+1],T[i+2]),b=new THREE.Vector3(T[i+3],T[i+4],T[i+5]),c=new THREE.Vector3(T[i+6],T[i+7],T[i+8]),nn=b.clone().sub(a).cross(c.clone().sub(a));
      const A=nn.length();if(A<1e-9)continue;nn.divideScalar(A);const k=[nn.x,nn.y,nn.z].map(x=>Math.round(x*200)).join(',')+'|'+Math.round(nn.dot(a)*100);(F.get(k)||F.set(k,{n:nn,t:[]}).get(k)).t.push([a,b,c]);}
    for(const{n,t}of F.values()){if(t.length<4)continue;const K=v=>Math.round(v.x*1e4)+','+Math.round(v.y*1e4)+','+Math.round(v.z*1e4),E=new Map(),P=new Map();
      for(const tr of t)for(let k=0;k<3;k++){const a=K(tr[k]),b=K(tr[(k+1)%3]);P.set(a,tr[k]);P.set(b,tr[(k+1)%3]);const e=a<b?a+'|'+b:b+'|'+a;E.set(e,(E.get(e)||0)+1);}
      const adj=new Map();for(const[e,c]of E)if(c===1){const[a,b]=e.split('|');(adj.get(a)||adj.set(a,[]).get(a)).push(b);(adj.get(b)||adj.set(b,[]).get(b)).push(a);}
      const seen=new Set(),loops=[];for(const st of adj.keys()){if(seen.has(st))continue;const L=[];let c=st,pr=null;while(c&&!seen.has(c)){seen.add(c);L.push(P.get(c));const nx=(adj.get(c)||[]).find(x=>x!==pr&&!seen.has(x));pr=c;c=nx;}if(L.length>=8)loops.push(L);}
      if(loops.length<2)continue;
      for(const L of loops){const cen=L.reduce((s,v)=>s.add(v),new THREE.Vector3()).divideScalar(L.length),rs=L.map(v=>v.distanceTo(cen)),r=rs.reduce((s,x)=>s+x,0)/rs.length;
        if(r<rmin||r>rmax||Math.max(...rs.map(x=>Math.abs(x-r)))>0.06*r+0.005)continue;   /* a circle */
        if(!loops.some(M=>M!==L&&M.some(v=>v.distanceTo(cen)>r*1.05)))continue;   /* inside another loop of the face: a hole, not the face's own rim */
        /* which way the metal is: the face's normal points out of it, so the hole runs along -n; its depth: the mesh's extent that way, or its floor */
        const ax=n.clone().negate();let dep=0;const{T:TT}=W.get(o);for(let i=0;i<TT.length;i+=3){const d=(TT[i]-cen.x)*ax.x+(TT[i+1]-cen.y)*ax.y+(TT[i+2]-cen.z)*ax.z;if(d>dep)dep=d;}
        const fl=hits(o,cen.clone().addScaledVector(ax,1e-3),[ax.x,ax.y,ax.z]).filter(t=>t>1e-3);if(fl.length)dep=Math.min(dep,Math.min(...fl)+1e-3);   /* a blind hole: its floor */
        if(dep<0.02)continue;
        if([0.25,0.5,0.75].some(f=>inside(o,cen.clone().addScaledVector(ax,dep*f))))continue;   /* its own metal on the axis: a turned part's step (a shoulder round its narrower part), not a hole */
        /* points through the whole depth (every 0.05 mm, at most 40), on the axis and on rings at 0.6 and 0.9 of the radius (a pipe in a hole is hollow on its axis; a
           pivot may fill only the hole's last part) */
        const e1=new THREE.Vector3(1,0,0);if(Math.abs(ax.x)>0.9)e1.set(0,1,0);e1.sub(ax.clone().multiplyScalar(e1.dot(ax))).normalize();const e2=ax.clone().cross(e1),nd=Math.min(40,Math.ceil(dep/0.05)),qs=[];
        for(let i=0;i<nd;i++){const c0=cen.clone().addScaledVector(ax,dep*(i+0.5)/nd);qs.push(c0);for(const f of[0.6,0.9])for(let k=0;k<4;k++){const t=k*Math.PI/2+f;qs.push(c0.clone().addScaledVector(e1,f*r*Math.cos(t)).addScaledVector(e2,f*r*Math.sin(t)));}}
        const box=new THREE.Box3().setFromPoints(qs),cand=ms.filter(m=>m!==o&&W.get(m).bb.intersectsBox(box)),who=new Set();   /* its own metal on the axis: a turned part's step (a shoulder round its narrower part), not a hole */
        for(const m of cand){if(qs.some(q=>inside(m,q)))who.add(pn(m)+':'+(hnOf(m)||m.geometry.type.replace('Geometry','')));}
        let near=[];if(!who.size){const seenN=new Map();for(let d=-2;d<=dep+2.001;d+=0.1){if(d>0&&d<dep)continue;const q=cen.clone().addScaledVector(ax,d);for(const m of ms){if(m===o)continue;const k=pn(m)+':'+(hnOf(m)||m.geometry.type.replace('Geometry',''));if(!seenN.has(k)&&inside(m,q))seenN.set(k,+(d<0?d:d-dep).toFixed(1));}}near=[...seenN].map(([k,d])=>k+' '+(d<0?d+' before':'+'+d+' past'));}   /* empty: what is on its axis just beyond it */
        out.push({near,part:pn(o),hn:hnOf(o),geo:o.geometry.type.replace('Geometry',''),c:[cen.x,cen.y,cen.z].map(x=>+x.toFixed(2)),ax:[ax.x,ax.y,ax.z].map(x=>+x.toFixed(2)),r:+r.toFixed(3),depth:+dep.toFixed(2),in:[...who]});}}}
  /* a hole met from both faces of a through piece is one hole: keep it once (the same centre line, the first face's) */
  const key=h=>h.part+'|'+h.hn+'|'+h.r.toFixed(2)+'|'+[0,1,2].map(i=>Math.round((h.c[i]-(h.c[0]*h.ax[0]+h.c[1]*h.ax[1]+h.c[2]*h.ax[2])*h.ax[i])*20)).join(',');
  const one=new Map();for(const h of out){const k=key(h),p=one.get(k);if(!p)one.set(k,h);else{p.in=[...new Set([...p.in,...h.in])];p.depth=Math.max(p.depth,h.depth);}}
  return [...one.values()];}
