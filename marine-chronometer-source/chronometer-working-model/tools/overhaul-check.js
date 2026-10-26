/* The overhaul's clearance (run by overhaul.py): does each of the manual's operations (js/overhaul.js) take its parts off, or put them on, without one passing
   through another? The overhaul moves every piece only along the movement's y, as the Exploded view does: each mover (OVH.check.movers()) by its own rise,
   whatever is inside it with it. Here every mover, every part and every screw or loose piece the movers leave is a body, rastered as it stands assembled into
   vertical columns on an r mm grid (exploded-check.js's method: each column the y intervals where the body is solid). For two bodies A and B the union over
   their shared columns of (a0 - b1, a1 - b0) is every relative rise d = riseB - riseA at which they meet. Each step is followed along its path (OVH.check.rises,
   n samples, as the page moves the step's parts, all by the same share), giving each pair's d along it; what the step leaves in the tray (OVH.check.away) is
   out of the way. Returns the bodies, the pairs' meeting sets and, for each step, the bodies' rises along it and those put away. */
(opt)=>{const mv=window.__mv,r=opt.r,n=opt.n;
 /* a threaded shank (userData.thread: KIT's ISO thread) stood in for by the cylinder of its root, over its length (26 October 2026: screws and their tapped holes are threaded, KIT.matchThreads) */
 const RC=new Map(),rootCyl=o=>{const t=o.userData.thread,g=o.geometry;if(!RC.has(g)){g.computeBoundingBox();const b=g.boundingBox,r=t.rs-(0.015+0.011*t.p)/2-0.5413*t.p;RC.set(g,new THREE.CylinderGeometry(r,r,b.max.y-b.min.y,24).translate(0,(b.max.y+b.min.y)/2,0));}return RC.get(g);};
 const MV=OVH.check.movers(),MVS=new Set(MV),scr=new Set(mv.userData.lifted.filter(g=>g.userData.lift)),P=mv.userData.parts;
 const bodyOf=o=>{while(o&&o!==mv){if(MVS.has(o)||scr.has(o))return o;if(o.userData.partName&&P[o.userData.partName]===o)return o;o=o.parent;}return null;};
 const nameOf=g=>{if(MVS.has(g))return g.userData.ovId+(MV.filter(o=>o.userData.ovId===g.userData.ovId).length>1?' #'+MV.filter(o=>o.userData.ovId===g.userData.ovId).indexOf(g):'');
   if(!scr.has(g))return g.userData.partName;let o=g.parent;while(o&&!(o.userData.partName&&P[o.userData.partName]===o))o=o.parent;
   return (o?o.userData.partName:'?')+(g.children.some(m=>m.userData.screw)?' screw @':' loose @')+g.position.x.toFixed(1)+','+g.position.z.toFixed(1);};
 /* a body's rise: its own, if a mover; else its nearest mover's above it in the scene, or none */
 const moverOf=g=>{for(let o=g;o&&o!==mv;o=o.parent)if(MVS.has(o))return o;return null;};
 mv.userData.explode(0);mv.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert(),v=new THREE.Vector3();
 const B=new Map();
 const addCol=(C,key,ys)=>{ys.sort((a,b)=>a-b);const c=C.get(key)||[];for(let i=0;i+1<ys.length;i+=2)c.push(ys[i],ys[i+1]);C.set(key,c);};
 const K=(i,k)=>(i+50000)*100000+k+50000,KI=q=>Math.floor(q/100000)-50000,KK=q=>q%100000-50000;
 mv.traverse(o=>{if(!o.isMesh||o.userData.decal||o.userData.surface||o.userData.devPlate)return;const g=bodyOf(o);if(!g)return;
   let h=o,vis=true;while(h&&h!==mv){if(!h.visible&&!(h===o&&o.userData.onlyDrive))vis=false;h=h.parent;}if(!vis)return;
   const geo=o.userData.thread?rootCyl(o):o.geometry;if(!geo.attributes||!geo.attributes.position)return;   /* a threaded shank as the cylinder of its root: it comes out turning, through its tapped hole's thread (rootCyl) */
   if(!B.has(g))B.set(g,{name:nameOf(g),mv:moverOf(g),cols:new Map(),bb:[1e9,1e9,-1e9,-1e9]});
   const b=B.get(g),mats=[];
   if(o.isInstancedMesh){const im=new THREE.Matrix4();for(let i=0;i<o.count;i++){o.getMatrixAt(i,im);mats.push(new THREE.Matrix4().multiplyMatrices(inv,new THREE.Matrix4().multiplyMatrices(o.matrixWorld,im)));}}
   else mats.push(new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld));
   const pos=geo.attributes.position,idx=geo.index,nt=idx?idx.count/3:pos.count/3;
   for(const m of mats){const X=new Float64Array(pos.count*3);for(let i=0;i<pos.count;i++){v.fromBufferAttribute(pos,i).applyMatrix4(m);X[3*i]=v.x;X[3*i+1]=v.y;X[3*i+2]=v.z;}
     const C=new Map();
     for(let t=0;t<nt;t++){const a=idx?idx.array[3*t]:3*t,bb=idx?idx.array[3*t+1]:3*t+1,c=idx?idx.array[3*t+2]:3*t+2;
       const ax=X[3*a],ay=X[3*a+1],az=X[3*a+2],bx=X[3*bb],by=X[3*bb+1],bz=X[3*bb+2],cx=X[3*c],cy=X[3*c+1],cz=X[3*c+2];
       const den=(bz-cz)*(ax-cx)+(cx-bx)*(az-cz);if(Math.abs(den)<1e-14)continue;
       const i0=Math.ceil(Math.min(ax,bx,cx)/r-0.5),i1=Math.floor(Math.max(ax,bx,cx)/r-0.5),k0=Math.ceil(Math.min(az,bz,cz)/r-0.5),k1=Math.floor(Math.max(az,bz,cz)/r-0.5);
       for(let i=i0;i<=i1;i++)for(let k=k0;k<=k1;k++){const x=(i+0.5)*r,z=(k+0.5)*r;
         const l1=((bz-cz)*(x-cx)+(cx-bx)*(z-cz))/den,l2=((cz-az)*(x-cx)+(ax-cx)*(z-cz))/den,l3=1-l1-l2;if(l1<0||l2<0||l3<0)continue;
         const q=K(i,k);(C.get(q)||C.set(q,[]).get(q)).push(l1*ay+l2*by+l3*cy);}}
     for(const[q,ys]of C){if(ys.length<2)continue;addCol(b.cols,q,ys);const i=KI(q),k=KK(q);b.bb[0]=Math.min(b.bb[0],i);b.bb[1]=Math.min(b.bb[1],k);b.bb[2]=Math.max(b.bb[2],i);b.bb[3]=Math.max(b.bb[3],k);}}});
 for(const b of B.values())for(const[q,c]of b.cols){const s=[];for(let i=0;i<c.length;i+=2)s.push([c[i],c[i+1]]);s.sort((x,y)=>x[0]-y[0]);const m=[];for(const[a,e]of s){if(m.length&&a<=m[m.length-1][1]+1e-4)m[m.length-1][1]=Math.max(m[m.length-1][1],e);else m.push([a,e]);}b.cols.set(q,m.flat());}
 const L=[...B.values()],out=[];
 for(let a=0;a<L.length;a++)for(let c=a+1;c<L.length;c++){const A=L[a],C=L[c];if(A.mv===C.mv)continue;   /* two bodies that always move together stay as assembled (fine.py checks those) */
   if(A.bb[2]<C.bb[0]||C.bb[2]<A.bb[0]||A.bb[3]<C.bb[1]||C.bb[3]<A.bb[1])continue;
   const[S,T,sw]=A.cols.size<=C.cols.size?[A,C,1]:[C,A,-1],seen=new Set(),iv=[];
   for(const[q,sa]of S.cols){const ta=T.cols.get(q);if(!ta)continue;
     for(let i=0;i<sa.length;i+=2)for(let j=0;j<ta.length;j+=2){const[a0,a1,b0,b1]=sw>0?[sa[i],sa[i+1],ta[j],ta[j+1]]:[ta[j],ta[j+1],sa[i],sa[i+1]],lo=+(a0-b1).toFixed(2),hi=+(a1-b0).toFixed(2),key=lo+','+hi;
       if(hi-lo>0.01&&!seen.has(key)){seen.add(key);iv.push([lo,hi]);}}}
   if(!iv.length)continue;iv.sort((x,y)=>x[0]-y[0]);const m=[];for(const[lo,hi]of iv){if(m.length&&lo<=m[m.length-1][1])m[m.length-1][1]=Math.max(m[m.length-1][1],hi);else m.push([lo,hi]);}
   out.push({a:a,b:c,f:m});}
 /* each step's path: every body's rise at n+1 points along it */
 const ix=new Map(MV.map((o,j)=>[o,j])),steps=[];
 for(const q of['d','r']){const seq=q==='d'?OVH.DIS:OVH.RE;
   for(let k=0;k<seq.length;k++){const path=[];for(let j=0;j<=n;j++){const w=OVH.check.rises(q,k,j/n);path.push(L.map(b=>b.mv?+w[ix.get(b.mv)].toFixed(3):0));}
     const aw=OVH.check.away(q,k);steps.push({q,op:seq[k].op,t:seq[k].t,path,away:L.map((b,j)=>j).filter(j=>L[j].mv&&aw[ix.get(L[j].mv)])});}}   /* away: the bodies put away in the tray during this step, out of the way */
 return JSON.stringify({bodies:L.map(b=>({name:b.name,cols:b.cols.size})),pairs:out,steps});}
