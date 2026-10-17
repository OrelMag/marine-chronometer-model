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
  /* what can fill a hole: every mesh, and each instance of an instanced one where it is drawn (a chain's rivets in its hooks' eyes: the Wempe's, 17 October 2026);
     an instanced mesh's own holes are still read off its one copy at its origin, as before */
  const fill=[...ms];for(const o of ms)if(o.isInstancedMesh){const g=o.geometry,p=g.attributes.position,ix=g.index?g.index.array:null,n=ix?ix.length:p.count,IM=new THREE.Matrix4();
    for(let k=0;k<o.count;k++){o.getMatrixAt(k,IM);const M=new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld).multiply(IM),T=new Float64Array(n*3),bb=new THREE.Box3(),v=new THREE.Vector3();
      for(let i=0;i<n;i++){v.fromBufferAttribute(p,ix?ix[i]:i).applyMatrix4(M);T[3*i]=v.x;T[3*i+1]=v.y;T[3*i+2]=v.z;bb.expandByPoint(v);}
      const q={geometry:g,userData:{},parent:o};W.set(q,{T,bb});fill.push(q);}}
  /* a point inside a mesh: crossings of a ray from it (a slanted direction, so it misses edges), counted odd */
  const hits=(o,q,D)=>{const{T}=W.get(o),out=[];
    for(let i=0;i<T.length;i+=9){const ax=T[i],ay=T[i+1],az=T[i+2],e1=[T[i+3]-ax,T[i+4]-ay,T[i+5]-az],e2=[T[i+6]-ax,T[i+7]-ay,T[i+8]-az];
      const h=[D[1]*e2[2]-D[2]*e2[1],D[2]*e2[0]-D[0]*e2[2],D[0]*e2[1]-D[1]*e2[0]],a=e1[0]*h[0]+e1[1]*h[1]+e1[2]*h[2];if(Math.abs(a)<1e-12)continue;
      const f=1/a,s=[q.x-ax,q.y-ay,q.z-az],u=f*(s[0]*h[0]+s[1]*h[1]+s[2]*h[2]);if(u<0||u>1)continue;const qq=[s[1]*e1[2]-s[2]*e1[1],s[2]*e1[0]-s[0]*e1[2],s[0]*e1[1]-s[1]*e1[0]],w=f*(D[0]*qq[0]+D[1]*qq[1]+D[2]*qq[2]);
      if(w<0||u+w>1)continue;const t=f*(e2[0]*qq[0]+e2[1]*qq[1]+e2[2]*qq[2]);if(t>1e-9)out.push(t);}return out;};
  const SL=[0.5773,0.5784,0.5762],inside=(o,q)=>W.get(o).bb.containsPoint(q)&&hits(o,q,SL).length%2===1;
  /* the holes: per mesh, its flat faces (triangles grouped by normal and plane), each face's boundary loops, the inner ones that are circles */
  const out=[],skipped=[];
  for(const o of ms){const{T}=W.get(o),F=new Map();
    for(let i=0;i<T.length;i+=9){const a=new THREE.Vector3(T[i],T[i+1],T[i+2]),b=new THREE.Vector3(T[i+3],T[i+4],T[i+5]),c=new THREE.Vector3(T[i+6],T[i+7],T[i+8]),nn=b.clone().sub(a).cross(c.clone().sub(a));
      const A=nn.length();if(A<1e-9)continue;nn.divideScalar(A);
      /* grouped by plane, not by which way a triangle faces: at a bevelled hole's start the extrusion leaves a tiny triangle folded back, which would split the
         hole's edge between two groups; the group's normal is its larger area's */
      const sg=(nn.x<-1e-6||(Math.abs(nn.x)<=1e-6&&(nn.y<-1e-6||(Math.abs(nn.y)<=1e-6&&nn.z<0))))?-1:1,u=nn.clone().multiplyScalar(sg),k=[u.x,u.y,u.z].map(x=>Math.round(x*200)).join(',')+'|'+Math.round(u.dot(a)*100);
      const fg=F.get(k)||F.set(k,{n:null,w:new THREE.Vector3(),t:[]}).get(k);fg.t.push([a,b,c]);fg.w.addScaledVector(nn,A);}
    for(const fg of F.values())fg.n=fg.w.clone().normalize();
    for(const{n,t}of F.values()){if(t.length<4)continue;const K=v=>Math.round(v.x*1e4)+','+Math.round(v.y*1e4)+','+Math.round(v.z*1e4),E=new Map(),P=new Map();
      for(const tr of t)for(let k=0;k<3;k++){const a=K(tr[k]),b=K(tr[(k+1)%3]);P.set(a,tr[k]);P.set(b,tr[(k+1)%3]);const e=a<b?a+'|'+b:b+'|'+a;E.set(e,(E.get(e)||0)+1);}
      const adj=new Map();for(const[e,c]of E)if(c===1){const[a,b]=e.split('|');(adj.get(a)||adj.set(a,[]).get(a)).push(b);(adj.get(b)||adj.set(b,[]).get(b)).push(a);}
      /* the face's boundary walked into chains (a hole's circle can come out of the extrusion in arcs, where its edge touches another at a point), each fitted
         with a circle; the arcs of one circle merged; a circle is a hole if the face isn't at its centre and is all round it just outside */
      const seen=new Set(),chains=[];for(const st of adj.keys()){if(seen.has(st))continue;const L=[];let c=st,pr=null;while(c&&!seen.has(c)){seen.add(c);L.push(P.get(c));const nx=(adj.get(c)||[]).find(x=>x!==pr&&!seen.has(x));pr=c;c=nx;}if(L.length>=5)chains.push(L);}
      const f1=new THREE.Vector3(1,0,0);if(Math.abs(n.x)>0.9)f1.set(0,1,0);f1.sub(n.clone().multiplyScalar(f1.dot(n))).normalize();const f2=n.clone().cross(f1),o0=t[0][0];
      const to2=v=>{const d=v.clone().sub(o0);return[d.dot(f1),d.dot(f2)];},T2=t.map(tr=>tr.map(to2));
      const onFace=([x,y])=>T2.some(([a,b,c])=>{const s1=(b[0]-a[0])*(y-a[1])-(b[1]-a[1])*(x-a[0]),s2=(c[0]-b[0])*(y-b[1])-(c[1]-b[1])*(x-b[0]),s3=(a[0]-c[0])*(y-c[1])-(a[1]-c[1])*(x-c[0]);return(s1>=0&&s2>=0&&s3>=0)||(s1<=0&&s2<=0&&s3<=0);});
      /* each chain split at its sharp turns (a circle turns about 11 deg a segment; where a pinch joins two loops, the chain turns sharply) */
      const parts=[];for(const L of chains){const Q=L.map(to2);let cur=[Q[0]];for(let i=1;i<Q.length;i++){if(cur.length>=2){const a=cur[cur.length-2],b=cur[cur.length-1],c=Q[i],u=[b[0]-a[0],b[1]-a[1]],v=[c[0]-b[0],c[1]-b[1]],
          cs=(u[0]*v[0]+u[1]*v[1])/(Math.hypot(...u)*Math.hypot(...v)+1e-12);if(cs<Math.cos(35*Math.PI/180)){if(cur.length>=5)parts.push(cur);cur=[b];}}cur.push(Q[i]);}if(cur.length>=5)parts.push(cur);}
      const fits=[];for(const Q of parts){const m=Q.length;let sx=0,sy=0,sxx=0,syy=0,sxy=0,sxz=0,syz=0,sz=0;for(const[x,y]of Q){const z=x*x+y*y;sx+=x;sy+=y;sxx+=x*x;syy+=y*y;sxy+=x*y;sxz+=x*z;syz+=y*z;sz+=z;}
        const A=new THREE.Matrix3().set(sxx,sxy,sx,sxy,syy,sy,sx,sy,m);if(Math.abs(A.determinant())<1e-12)continue;const k=new THREE.Vector3(sxz,syz,sz).applyMatrix3(A.clone().invert());
        const cx=k.x/2,cy=k.y/2,r=Math.sqrt(Math.max(0,k.z+cx*cx+cy*cy));if(!(r>=rmin&&r<=rmax))continue;if(Math.max(...Q.map(([x,y])=>Math.abs(Math.hypot(x-cx,y-cy)-r)))>0.06*r+0.005)continue;
        const ang=Q.map(([x,y])=>Math.atan2(y-cy,x-cx));fits.push({cx,cy,r,ang});}
      const holes2=[];for(const f of fits){const h=holes2.find(g=>Math.hypot(g.cx-f.cx,g.cy-f.cy)<0.15&&Math.abs(g.r-f.r)<0.08);if(h)h.ang.push(...f.ang);else holes2.push({...f,ang:[...f.ang]});}
      const circ=[];for(const h of holes2){const bins=new Set(h.ang.map(a=>Math.floor((a+Math.PI)/(2*Math.PI)*36)));if(bins.size<15)continue;   /* round 150 deg of the circle at least (a folded sliver can take the edges of the rest), the face all round it (below) */
        if(onFace([h.cx,h.cy]))continue;let ring=0;for(let i=0;i<12;i++){const a=i/12*2*Math.PI;if(onFace([h.cx+(h.r+0.08)*Math.cos(a),h.cy+(h.r+0.08)*Math.sin(a)]))ring++;}if(ring<10)continue;
        circ.push({cen:o0.clone().addScaledVector(f1,h.cx).addScaledVector(f2,h.cy),r:h.r});}
      /* and the closed loops that are circles inside another loop of the face (the first way: it finds what the arcs' fits can miss) */
      const loops=chains.filter(L=>L.length>=8);
      for(const L of loops){const cen=L.reduce((s,v)=>s.add(v),new THREE.Vector3()).divideScalar(L.length),rs=L.map(v=>v.distanceTo(cen)),r=rs.reduce((s,x)=>s+x,0)/rs.length;
        if(r<rmin||r>rmax||Math.max(...rs.map(x=>Math.abs(x-r)))>0.06*r+0.005)continue;if(!loops.some(M=>M!==L&&M.some(v=>v.distanceTo(cen)>r*1.05)))continue;
        if(!circ.some(c=>c.cen.distanceTo(cen)<0.15&&Math.abs(c.r-r)<0.08))circ.push({cen,r});}
      for(const{cen,r}of circ){
        /* which way the metal is: the face's normal points out of it, so the hole runs along -n; its depth: the mesh's extent that way, or its floor */
        const ax=n.clone().negate();let dep=0;const{T:TT}=W.get(o);for(let i=0;i<TT.length;i+=3){const d=(TT[i]-cen.x)*ax.x+(TT[i+1]-cen.y)*ax.y+(TT[i+2]-cen.z)*ax.z;if(d>dep)dep=d;}
        const fl=hits(o,cen.clone().addScaledVector(ax,1e-3),[ax.x,ax.y,ax.z]).filter(t=>t>1e-3);if(fl.length)dep=Math.min(dep,Math.min(...fl)+1e-3);   /* a blind hole: its floor */
        /* opt.wall (the Wempe's: checks.py's HOLE_WALL): a through hole in a part deeper than the metal round it (its upper cock, one solid 15 deep, its hole 20 through the
           arm's 2.4 over the balance) is as deep as the metal round its edge, followed along the axis from 0.03 outside it at four places (where at least two are in the
           metal); else the part's whole depth, so a hole through a thin arm takes what passes under it for its pin. The Hamilton's keeps the whole depth: with the wall its
           barrel bridge's opening over the third pillar screw reads 0.12 deep and holding the screw's head (16 October 2026, not looked into) */
        if(opt.wall){const b1=new THREE.Vector3(1,0,0);if(Math.abs(ax.x)>0.9)b1.set(0,1,0);b1.sub(ax.clone().multiplyScalar(b1.dot(ax))).normalize();const b2=ax.clone().cross(b1),wd=[];
          for(let k=0;k<4;k++){const t=k*Math.PI/2+0.3,p=cen.clone().addScaledVector(b1,(r+0.03)*Math.cos(t)).addScaledVector(b2,(r+0.03)*Math.sin(t)).addScaledVector(ax,1e-3);
            if(inside(o,p)){const h=hits(o,p,[ax.x,ax.y,ax.z]);if(h.length)wd.push(Math.min(...h)+1e-3);}}
          if(wd.length>=2)dep=Math.min(dep,Math.max(...wd));}
        if(dep<0.02)continue;
        if([0.25,0.5,0.75].some(f=>inside(o,cen.clone().addScaledVector(ax,dep*f)))){skipped.push({part:pn(o),hn:hnOf(o),c:[cen.x,cen.y,cen.z].map(x=>+x.toFixed(2)),r:+r.toFixed(3),depth:+dep.toFixed(2),why:'own metal on its axis'});continue;}   /* its own metal on the axis: a turned part's step (a shoulder round its narrower part), not a hole */
        /* points through the whole depth (every 0.05 mm, at most 40), on the axis and on rings at 0.6 and 0.9 of the radius (a pipe in a hole is hollow on its axis; a
           pivot may fill only the hole's last part) */
        const e1=new THREE.Vector3(1,0,0);if(Math.abs(ax.x)>0.9)e1.set(0,1,0);e1.sub(ax.clone().multiplyScalar(e1.dot(ax))).normalize();const e2=ax.clone().cross(e1),nd=Math.min(40,Math.ceil(dep/0.05)),qs=[];
        for(let i=0;i<nd;i++){const c0=cen.clone().addScaledVector(ax,dep*(i+0.5)/nd);qs.push(c0);for(const f of[0.6,0.9])for(let k=0;k<4;k++){const t=k*Math.PI/2+f;qs.push(c0.clone().addScaledVector(e1,f*r*Math.cos(t)).addScaledVector(e2,f*r*Math.sin(t)));}}
        const box=new THREE.Box3().setFromPoints(qs),cand=fill.filter(m=>m!==o&&m.parent!==o&&W.get(m).bb.intersectsBox(box)),who=new Set();   /* its own metal on the axis: a turned part's step (a shoulder round its narrower part), not a hole */
        for(const m of cand){if(qs.some(q=>inside(m,q)))who.add(pn(m)+':'+(hnOf(m)||m.geometry.type.replace('Geometry','')));}
        let near=[];if(!who.size){const seenN=new Map();for(let d=-2;d<=dep+2.001;d+=0.1){if(d>0&&d<dep)continue;const q=cen.clone().addScaledVector(ax,d);for(const m of fill){if(m===o||m.parent===o)continue;const k=pn(m)+':'+(hnOf(m)||m.geometry.type.replace('Geometry',''));if(!seenN.has(k)&&inside(m,q))seenN.set(k,+(d<0?d:d-dep).toFixed(1));}}near=[...seenN].map(([k,d])=>k+' '+(d<0?d+' before':'+'+d+' past'));}   /* empty: what is on its axis just beyond it */
        out.push({near,part:pn(o),hn:hnOf(o),geo:o.geometry.type.replace('Geometry',''),c:[cen.x,cen.y,cen.z].map(x=>+x.toFixed(2)),ax:[ax.x,ax.y,ax.z].map(x=>+x.toFixed(2)),r:+r.toFixed(3),depth:+dep.toFixed(2),in:[...who]});}}}
  /* a hole met from both faces of a through piece is one hole: keep it once (the same centre line, the first face's) */
  const key=h=>h.part+'|'+h.hn+'|'+h.r.toFixed(2)+'|'+[0,1,2].map(i=>Math.round((h.c[i]-(h.c[0]*h.ax[0]+h.c[1]*h.ax[1]+h.c[2]*h.ax[2])*h.ax[i])*20)).join(',');
  const one=new Map();for(const h of out){const k=key(h),p=one.get(k);if(!p)one.set(k,h);else{p.in=[...new Set([...p.in,...h.in])];p.depth=Math.max(p.depth,h.depth);}}
  const res=[...one.values()];res.skipped=skipped;return {holes:res,skipped};}
