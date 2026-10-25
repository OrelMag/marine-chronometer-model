/* The assembly's clearance (run by assembly.py --model wempe): every part (mv.userData.parts, its visible meshes, the screws among them with it) rastered as it
   stands assembled into vertical columns on an r mm grid (overhaul-check.js's and exploded-check.js's method: each column the y intervals where the body is solid),
   and for every two bodies sharing a column the union over their shared columns of (a0 - b1, a1 - b0): every relative rise d = riseB - riseA at which they meet.
   Returns the bodies' names and the pairs' meeting sets; assembly.py follows the sequence along them. */
(opt)=>{const mv=window.__mv,r=opt.r,P=mv.userData.parts,names=Object.keys(P).filter(n=>P[n].visible);
 mv.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert(),v=new THREE.Vector3(),B=[];
 const addCol=(C,key,ys)=>{ys.sort((a,b)=>a-b);const c=C.get(key)||[];for(let i=0;i+1<ys.length;i+=2)c.push(ys[i],ys[i+1]);C.set(key,c);};
 const K=(i,k)=>(i+50000)*100000+k+50000,KI=q=>Math.floor(q/100000)-50000,KK=q=>q%100000-50000;
 for(const nm of names){const b={name:nm,cols:new Map(),bb:[1e9,1e9,-1e9,-1e9]};
  P[nm].traverse(o=>{if(!o.isMesh||o.userData.decal||o.userData.surface||o.userData.devPlate)return;
   let h=o,vis=true;while(h&&h!==mv){if(!h.visible)vis=false;h=h.parent;}if(!vis)return;
   const geo=o.geometry;if(!geo.attributes||!geo.attributes.position)return;const mats=[];
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
  if(b.cols.size)B.push(b);}
 for(const b of B)for(const[q,c]of b.cols){const s=[];for(let i=0;i<c.length;i+=2)s.push([c[i],c[i+1]]);s.sort((x,y)=>x[0]-y[0]);const m=[];for(const[a,e]of s){if(m.length&&a<=m[m.length-1][1]+1e-4)m[m.length-1][1]=Math.max(m[m.length-1][1],e);else m.push([a,e]);}b.cols.set(q,m.flat());}
 const out=[];
 for(let a=0;a<B.length;a++)for(let c=a+1;c<B.length;c++){const A=B[a],C=B[c];
   if(A.bb[2]<C.bb[0]||C.bb[2]<A.bb[0]||A.bb[3]<C.bb[1]||C.bb[3]<A.bb[1])continue;
   const[S,T,sw]=A.cols.size<=C.cols.size?[A,C,1]:[C,A,-1],seen=new Set(),iv=[];
   for(const[q,sa]of S.cols){const ta=T.cols.get(q);if(!ta)continue;
     for(let i=0;i<sa.length;i+=2)for(let j=0;j<ta.length;j+=2){const[a0,a1,b0,b1]=sw>0?[sa[i],sa[i+1],ta[j],ta[j+1]]:[ta[j],ta[j+1],sa[i],sa[i+1]],lo=+(a0-b1).toFixed(2),hi=+(a1-b0).toFixed(2),key=lo+','+hi;
       if(hi-lo>0.01&&!seen.has(key)){seen.add(key);iv.push([lo,hi]);}}}
   if(!iv.length)continue;iv.sort((x,y)=>x[0]-y[0]);const m=[];for(const[lo,hi]of iv){if(m.length&&lo<=m[m.length-1][1])m[m.length-1][1]=Math.max(m[m.length-1][1],hi);else m.push([lo,hi]);}
   out.push({a:a,b:c,f:m});}
 if(opt.pair){const[A,C]=opt.pair.map(n=>B.find(b=>b.name===n)),[lo,hi]=opt.range,w=[];   /* --where: the columns where two bodies meet at a relative rise in [lo, hi] */
   for(const[q,sa]of A.cols){const ta=C.cols.get(q);if(!ta)continue;for(let i=0;i<sa.length;i+=2)for(let j=0;j<ta.length;j+=2){const l=sa[i]-ta[j+1],h=sa[i+1]-ta[j];if(h>lo&&l<hi)w.push([+((KI(q)+0.5)*r).toFixed(1),+((KK(q)+0.5)*r).toFixed(1),+sa[i].toFixed(2),+sa[i+1].toFixed(2),+ta[j].toFixed(2),+ta[j+1].toFixed(2)]);}}
   return JSON.stringify({where:w});}
 return JSON.stringify({bodies:B.map(b=>({name:b.name,cols:b.cols.size})),pairs:out});}
