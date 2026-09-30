/* Exploded-view clearance (run by exploded.py). The Exploded view moves each part, and each screw, only along the movement's y, by a fixed offset times
   the spread e. Here every part (without its screws) and every screw is a body; each is rastered as it stands assembled (explode 0) into vertical columns
   on an r mm grid, each column holding the y intervals where the body is solid (ray crossings taken in pairs). For two bodies A and B, a column where A
   holds [a0,a1] and B holds [b0,b1] makes them meet when d = offB - offA lies in (a0 - b1, a1 - b0); the union over their shared columns is every d at which
   they meet. Returns, for each pair of bodies that share a column, that union, and each body's offset (measured: its shift from explode 0 to explode 1). */
(opt)=>{const mv=window.__mv,r=opt.r;
 const scr=new Set(mv.userData.lifted.filter(g=>g.userData.lift));   /* screws and loose pieces: each its own body (one that stays in, lift 0, is its part's) */
 const P=mv.userData.parts,roots=new Map();
 const bodyOf=o=>{while(o&&o!==mv){if(scr.has(o))return o;if(o.userData.partName&&P[o.userData.partName]===o)return o;o=o.parent;}return null;};
 const nameOf=g=>{if(!scr.has(g))return g.userData.partName;let o=g.parent;while(o&&!(o.userData.partName&&P[o.userData.partName]===o))o=o.parent;
   return (o?o.userData.partName:'?')+(g.children.some(m=>m.userData.screw)?' screw @':' loose @')+g.position.x.toFixed(1)+','+g.position.z.toFixed(1)+(g.parent===o?'':' in '+g.parent.id);};   /* in its parent's frame, so the name holds as wheels turn */
 const inv=new THREE.Matrix4(),M4=new THREE.Matrix4(),v=new THREE.Vector3(),at=g=>{const p=new THREE.Vector3();g.getWorldPosition(p);return mv.worldToLocal(p);};
 mv.userData.explode(1);mv.updateMatrixWorld(true);const p1=new Map();
 mv.traverse(o=>{const g=bodyOf(o);if(g&&!p1.has(g))p1.set(g,at(g));});
 mv.userData.explode(0);mv.updateMatrixWorld(true);inv.copy(mv.matrixWorld).invert();
 const B=new Map();   /* body -> {name, off, cols: Map(column key -> sorted merged [y0,y1,...])} */
 const addCol=(C,key,ys)=>{ys.sort((a,b)=>a-b);const c=C.get(key)||[];for(let i=0;i+1<ys.length;i+=2)c.push(ys[i],ys[i+1]);C.set(key,c);};
 const K=(i,k)=>(i+50000)*100000+k+50000,KI=q=>Math.floor(q/100000)-50000,KK=q=>q%100000-50000;   /* column key from grid indices, and back */
 mv.traverse(o=>{if(!o.isMesh||o.userData.decal||o.userData.surface||o.userData.devPlate)return;const g=bodyOf(o);if(!g)return;
   let h=o,vis=true;while(h&&h!==mv){if(!h.visible&&!(h===o&&o.userData.onlyDrive)&&!(opt.hidden||[]).includes(h.userData.partName))vis=false;h=h.parent;}if(!vis)return;
   const geo=o.geometry;if(!geo.attributes||!geo.attributes.position)return;
   if(!B.has(g)){const q=at(g),s=p1.get(g);B.set(g,{name:nameOf(g),off:+(s.y-q.y).toFixed(3),drift:Math.hypot(s.x-q.x,s.z-q.z),cols:new Map(),bb:[1e9,1e9,-1e9,-1e9]});}
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
 for(let a=0;a<L.length;a++)for(let c=a+1;c<L.length;c++){const A=L[a],C=L[c];if(A.bb[2]<C.bb[0]||C.bb[2]<A.bb[0]||A.bb[3]<C.bb[1]||C.bb[3]<A.bb[1])continue;
   const pr=opt.probe&&A.name===opt.probe.a&&C.name===opt.probe.b?opt.probe:null;if(pr)pr.at=[];
   const[S,T,sw]=A.cols.size<=C.cols.size?[A,C,1]:[C,A,-1],seen=new Set(),iv=[];
   for(const[q,sa]of S.cols){const ta=T.cols.get(q);if(!ta)continue;
     for(let i=0;i<sa.length;i+=2)for(let j=0;j<ta.length;j+=2){   /* d = off(C) - off(A): A's interval [a0,a1], C's [b0,b1] -> (a0-b1, a1-b0) */
       const[a0,a1,b0,b1]=sw>0?[sa[i],sa[i+1],ta[j],ta[j+1]]:[ta[j],ta[j+1],sa[i],sa[i+1]],lo=+(a0-b1).toFixed(2),hi=+(a1-b0).toFixed(2),key=lo+','+hi;
       if(pr&&lo<pr.d&&pr.d<hi&&pr.at.length<400){pr.at.push([(KI(q)+0.5)*r,(KK(q)+0.5)*r,a0,a1,b0,b1].map(x=>+x.toFixed(2)));}
       if(hi-lo>0.01&&!seen.has(key)){seen.add(key);iv.push([lo,hi]);}}}
   if(!iv.length)continue;iv.sort((x,y)=>x[0]-y[0]);const m=[];for(const[lo,hi]of iv){if(m.length&&lo<=m[m.length-1][1])m[m.length-1][1]=Math.max(m[m.length-1][1],hi);else m.push([lo,hi]);}
   out.push({a:A.name,b:C.name,f:m,at:pr?pr.at:undefined});}   /* at (probe only): columns x, z where the two meet at probe.d, with A's and B's intervals */
 return JSON.stringify({bodies:L.map(b=>({name:b.name,off:b.off,drift:+b.drift.toFixed(3),cols:b.cols.size})),pairs:out});}
