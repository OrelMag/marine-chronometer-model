/* overlaps.js (overlaps.py runs it in the page): metal counted twice. Every closed solid weighed by the tools (massprops-check.js, wempe-inertia.js, mechanisms-*.js)
   is integrated as its signed volume, which is the integral of its winding number w; where two pieces of one mesh (fused) or two meshes of one part overlap, w is 2
   there and the weight counts that metal twice. Rays on a grid of cells over each part's box (at most __OVN cells across, no finer than __OVMIN mm), each crossing of
   a triangle adding the sign of its normal against the ray, the crossings sorted along the ray giving w between them. Per mesh: its own excess ∫max(w-1,0) (pieces of
   one mesh overlapping) and ∫min(w,0) (inside out); per part: the excess of all its meshes' w summed (pieces of one part overlapping, pressed pins included).
   A ray that runs exactly through an edge counts both its triangles: a lathe's radial edges lie on the grid's diagonals where the box is square, so each figure is
   taken along the three axes (__OVAXES, 'xyz') and the median reported, an edge's false count showing along one axis only. Mode as seams.js: __OVBOX. */
(()=>{
 const MV=window.__mv,box=window.__OVBOX,root=box?(window.__BX?window.__BX.root:MV.parent.parent.parent):MV;root.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(root.matrixWorld).invert();
 const AXES=window.__OVAXES||'xyz',NC=window.__OVN||400,CMIN=window.__OVMIN||0.01,ONLY=window.__OVONLY||null,NEX=window.__OVEX||0;
 const partOf=o=>{while(o){if(o.userData&&o.userData.partName)return o.userData.partName;o=o.parent;}return '?';};
 const hnOf=o=>{while(o){if(o.userData&&o.userData.hn)return o.userData.hn;o=o.parent;}return '';};
 const vis=o=>{while(o){if(box&&o===MV)return false;if(!o.visible)return false;if(o===root)return true;o=o.parent;}return true;};
 const meshes=[];root.traverse(o=>{if(o.isMesh&&!o.isInstancedMesh&&vis(o)&&!o.userData.decal&&!o.userData.surface&&o.geometry.attributes.position&&o.geometry.attributes.position.count>2)meshes.push(o);});
 const MN=new Map();for(const src of[window.__M,window.M,window.mats])if(src)for(const[k,v]of Object.entries(src))if(v&&v.isMaterial&&!MN.has(v))MN.set(v,k);
 const mn=o=>MN.get(o.material)||o.material.name||o.material.uuid.slice(0,6);
 /* each mesh's triangles in root's frame, as flat arrays [x0,y0,z0,x1,...], and its box */
 const tris=new Map(),bb=new Map();
 for(const o of meshes){const g=o.geometry,P=g.attributes.position,I=g.index,M4=new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld),n=I?I.count/3:P.count/3,T=new Float64Array(n*9),p=new THREE.Vector3();
   const lo=[1e9,1e9,1e9],hi=[-1e9,-1e9,-1e9];
   for(let t=0;t<n;t++)for(let k=0;k<3;k++){const i=I?I.array[3*t+k]:3*t+k;p.fromBufferAttribute(P,i).applyMatrix4(M4);const a=p.toArray();for(let c=0;c<3;c++){T[9*t+3*k+c]=a[c];lo[c]=Math.min(lo[c],a[c]);hi[c]=Math.max(hi[c],a[c]);}}
   tris.set(o,T);bb.set(o,[lo,hi]);}
 /* one axis: the rays along ai on a grid in (u,v); for each cell the crossings [t, sign, mesh] */
 const along=(ms,lo,hi,ai)=>{const u=(ai+1)%3,v=(ai+2)%3,du=hi[u]-lo[u],dv=hi[v]-lo[v],C=Math.max(CMIN,Math.max(du,dv)/NC),nu=Math.max(1,Math.ceil(du/C)),nv=Math.max(1,Math.ceil(dv/C)),X=new Array(nu*nv);
   const ju=0.3183099*C,jv=0.7071068*C;   /* the ray inside its cell, off the grid's lines and its diagonals (1/π, 1/√2: their sum and difference no whole cell) */
   ms.forEach((o,mi)=>{const T=tris.get(o),n=T.length/9;
     for(let t=0;t<n;t++){const b=9*t,au=T[b+u],av=T[b+v],bu=T[b+3+u],bv=T[b+3+v],cu=T[b+6+u],cv=T[b+6+v];
       const d=(bu-au)*(cv-av)-(cu-au)*(bv-av);if(Math.abs(d)<1e-14)continue;   /* edge-on to the ray */
       const s=d>0?1:-1;   /* the normal's component along the ray: (b-a)×(c-a) along ai is d, (u,v,ai) right-handed */
       const i0=Math.max(0,Math.floor((Math.min(au,bu,cu)-lo[u]-ju)/C)),i1=Math.min(nu-1,Math.ceil((Math.max(au,bu,cu)-lo[u]-ju)/C)),j0=Math.max(0,Math.floor((Math.min(av,bv,cv)-lo[v]-jv)/C)),j1=Math.min(nv-1,Math.ceil((Math.max(av,bv,cv)-lo[v]-jv)/C));
       for(let i=i0;i<=i1;i++){const pu=lo[u]+ju+i*C;for(let j=j0;j<=j1;j++){const pv=lo[v]+jv+j*C;
         const w0=((bu-pu)*(cv-pv)-(cu-pu)*(bv-pv))/d,w1=((cu-pu)*(av-pv)-(au-pu)*(cv-pv))/d,w2=1-w0-w1;if(w0<0||w1<0||w2<0)continue;
         const ta=w0*T[b+ai]+w1*T[b+3+ai]+w2*T[b+6+ai],k=i*nv+j;(X[k]||(X[k]=[])).push([ta,s,mi]);}}}});
   /* walk each column: w per mesh and summed (an outward face the ray enters through has its normal against the ray, s -1: w -= s) */
   const nm=ms.length,A=C*C,self=new Float64Array(nm),neg=new Float64Array(nm),ex=[];let tot=0,vol=0,open=0;const B=[[1e9,1e9,1e9],[-1e9,-1e9,-1e9]],cen=[0,0,0];
   for(let k=0;k<X.length;k++){const L=X[k];if(!L)continue;L.sort((a,b)=>a[0]-b[0]);const w=new Int32Array(nm);let W=0;
     for(let q=0;q<L.length-1;q++){const[t,s,mi]=L[q];w[mi]-=s;W-=s;const len=L[q+1][0]-t;if(len<=0)continue;vol+=W*len*A;
       if(W>1){const e=(W-1)*len*A;tot+=e;const P=[0,0,0];P[u]=lo[u]+ju+Math.floor(k/nv)*C;P[v]=lo[v]+jv+(k%nv)*C;P[ai]=t+len/2;
         if(ex.length<NEX&&Math.random()<0.05)ex.push({at:P.map(x=>+x.toFixed(3)),from:+t.toFixed(3),len:+len.toFixed(3),ray:L.map(c=>[+c[0].toFixed(3),c[1],c[2]])});
         for(let c=0;c<3;c++){B[0][c]=Math.min(B[0][c],P[c]);B[1][c]=Math.max(B[1][c],P[c]);cen[c]+=P[c]*e;}}
       for(let m=0;m<nm;m++){if(w[m]>1)self[m]+=(w[m]-1)*len*A;else if(w[m]<0)neg[m]+=-w[m]*len*A;}}
     if(W-L[L.length-1][1]!==0)open++;}   /* a column left with w ≠ 0: an edge counted twice, or the solid open */
   return{C,tot,vol,open,self,neg,ex,box:tot>0?B:null,cen:tot>0?cen.map(c=>c/tot):null};};
 const med=a=>{const s=a.slice().sort((x,y)=>x-y);return s[(s.length-1)>>1];},r3=a=>a&&a.map(x=>+x.toFixed(2)),f4=x=>+x.toFixed(4);
 const axes=[...AXES].map(c=>'xyz'.indexOf(c));
 /* the axes' runs, the median of each figure; where, and the samples, from the run giving the median */
 const run=(ms,lo,hi)=>{const R=axes.map(ai=>along(ms,lo,hi,ai)),m=med(R.map(r=>r.tot)),k=R.findIndex(r=>r.tot===m);
   return{tot:m,axes:R.map(r=>f4(r.tot)),vol:med(R.map(r=>r.vol)),neg:ms.map((_,i)=>med(R.map(r=>r.neg[i]))),open:R.map(r=>r.open),C:R[k].C,cen:R[k].cen,box:R[k].box,ex:R[k].ex};};
 const byPart=new Map();for(const o of meshes){const p=partOf(o);if(ONLY&&!ONLY.includes(p))continue;if(!byPart.has(p))byPart.set(p,[]);byPart.get(p).push(o);}
 const out=[];
 for(const[part,ms]of byPart){const lo=[1e9,1e9,1e9],hi=[-1e9,-1e9,-1e9];for(const o of ms){const[a,b]=bb.get(o);for(let c=0;c<3;c++){lo[c]=Math.min(lo[c],a[c]);hi[c]=Math.max(hi[c],b[c]);}}
   const Q=run(ms,lo,hi);
   /* each mesh alone too, on its own (finer) grid: its own pieces' overlap */
   const per=ms.map(o=>{const[a,b]=bb.get(o),q=run([o],a,b);return{i:meshes.indexOf(o),hn:hnOf(o),pc:o.userData.pc||'',geo:o.geometry.type.replace('Geometry',''),mat:mn(o),
     self:f4(q.tot),axes:q.axes,neg:f4(q.neg[0]),open:q.open,cell:f4(q.C),vol:+q.vol.toFixed(3),where:r3(q.cen),box:q.box&&q.box.map(r3),ex:q.ex};});
   out.push({part,meshes:ms.length,cell:f4(Q.C),excess:f4(Q.tot),axes:Q.axes,where:r3(Q.cen),box:Q.box&&Q.box.map(r3),per});}
 return JSON.stringify(out);
})()
