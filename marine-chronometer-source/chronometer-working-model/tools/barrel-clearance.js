/* Barrel clearance (run by fine.py): how close every other part comes to the solid the barrel sweeps as it turns, and where the mainspring lies.
   The envelope is every mesh of the barrel (wall, caps, cap screws, hook, boss) turned about the barrel's axis: one solid cylinder per mesh, radius
   = its furthest point from the axis, over its height. Signed distance to each such solid is convex, so the tangent plane at a triangle's centre
   bounds it from below; a triangle is split into four only where that bound could beat the best so far (branch and bound), down to 0.002 mm
   (2 % of the depth once inside). Margins are good to about 0.002 mm. Negative = inside, by that depth. */
(()=>{const mv=window.__mv;mv.updateMatrixWorld(true);
 let bz=null;mv.traverse(o=>{if(!bz&&o.userData&&o.userData.partName==='barrel')bz=o;});
 const inv=new THREE.Matrix4().copy(bz.matrixWorld).invert(),M4=new THREE.Matrix4(),v=new THREE.Vector3(),back=bz.matrixWorld.clone(),toMv=new THREE.Matrix4().copy(mv.matrixWorld).invert().multiply(back);
 const vis=o=>{while(o){if(!o.visible)return false;if(o===mv)return true;o=o.parent;}return true;};
 const partOf=o=>{while(o){if(o.userData&&o.userData.partName)return o.userData.partName;o=o.parent;}return '?';};
 const inB=o=>{while(o){if(o===bz)return true;o=o.parent;}return false;};
 const env=[];bz.traverse(o=>{if(!o.isMesh)return;M4.multiplyMatrices(inv,o.matrixWorld);const p=o.geometry.attributes.position;let r=0,y0=1e9,y1=-1e9;
   for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(M4);r=Math.max(r,Math.hypot(v.x,v.z));y0=Math.min(y0,v.y);y1=Math.max(y1,v.y);}
   const nm=o.userData.barrelWall?'wall':o.geometry.type.replace('Geometry','')+' r'+r.toFixed(1);if(!env.some(e=>e.name===nm&&Math.abs(e.y0-y0)<1e-6&&Math.abs(e.y1-y1)<1e-6))env.push({r,y0,y1,name:nm});});   /* one per shape: the cap screws sweep the same ring */
 { const W=env.filter(e=>e.name==='wall');if(W.length>1){const w={r:W[0].r,y0:Math.min(...W.map(e=>e.y0)),y1:Math.max(...W.map(e=>e.y1)),name:'wall'};for(const e of W)env.splice(env.indexOf(e),1);env.push(w);} }   /* the wall's bands (round the chain hook's hole) as one */
 const R=Math.max(...env.map(e=>e.r)),Y0=Math.min(...env.map(e=>e.y0)),Y1=Math.max(...env.map(e=>e.y1)),MG=2.5;
 /* signed distance to one piece (exact: outside, the distance; inside, minus the depth to the nearest face) and its gradient; it is convex */
 const sdf=(e,x,y,z)=>{const r=Math.hypot(x,z),ux=r>1e-9?x/r:1,uz=r>1e-9?z/r:0,dr=r-e.r,dt=e.y0-y,db=y-e.y1,dy=Math.max(dt,db),sy=dt>db?-1:1;
   if(dr<=0&&dy<=0)return dr>dy?[dr,ux,0,uz]:[dy,0,sy,0];const a=Math.max(dr,0),b=Math.max(dy,0),f=Math.hypot(a,b);return[f,ux*a/f,sy*b/f,uz*a/f];};
 const dist=(x,y,z)=>{let best=1e9,bn='';for(const e of env){const d=sdf(e,x,y,z)[0];if(d<best){best=d;bn=e.name;}}return[best,bn];};
 const far=(x0,x1,y0,y1,z0,z1)=>{const nx=Math.max(x0,Math.min(0,x1)),nz=Math.max(z0,Math.min(0,z1));return Math.hypot(nx,nz)>R+MG||y0>Y1+MG||y1<Y0-MG;};
 const res={};
 const tri=(A,B,C,part,type)=>{if(far(Math.min(A[0],B[0],C[0]),Math.max(A[0],B[0],C[0]),Math.min(A[1],B[1],C[1]),Math.max(A[1],B[1],C[1]),Math.min(A[2],B[2],C[2]),Math.max(A[2],B[2],C[2])))return;
   const st=[[A,B,C]];let best=res[part]?res[part].d:MG,bp=null,bn='';
   while(st.length){const[a,b,c]=st.pop(),m=[(a[0]+b[0]+c[0])/3,(a[1]+b[1]+c[1])/3,(a[2]+b[2]+c[2])/3];let lb=1e9;
     for(const q of[m,a,b,c]){const d=dist(...q);if(d[0]<best){best=d[0];bp=q;bn=d[1];}}
     for(const e of env){const[f,gx,gy,gz]=sdf(e,...m);let lo=0;for(const q of[a,b,c])lo=Math.min(lo,gx*(q[0]-m[0])+gy*(q[1]-m[1])+gz*(q[2]-m[2]));lb=Math.min(lb,f+lo);}   /* tangent plane at the centre: a lower bound over the triangle */
     const tol=Math.max(0.002,-0.02*best),rad=Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2])+Math.hypot(b[0]-c[0],b[1]-c[1],b[2]-c[2]);
     if(lb<best-tol&&rad>tol){const ab=[(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2],bc=[(b[0]+c[0])/2,(b[1]+c[1])/2,(b[2]+c[2])/2],ca=[(c[0]+a[0])/2,(c[1]+a[1])/2,(c[2]+a[2])/2];st.push([a,ab,ca],[ab,b,bc],[ca,bc,c],[ab,bc,ca]);}}
   if(bp){const m=new THREE.Vector3(...bp).applyMatrix4(toMv);res[part]={part,type,d:best,piece:bn,at:[m.x,m.y,m.z].map(c=>+c.toFixed(2))};}};
 mv.traverse(o=>{if(!o.isMesh||!vis(o)||inB(o)||o.userData.hookNose)return;const part=partOf(o);   /* the chain's hook nose stands in its hole in the wall */if(part==='mainspring')return;const g=o.geometry;if(!g.attributes||!g.attributes.position)return;
   const mats=[];if(o.isInstancedMesh){const im=new THREE.Matrix4();for(let i=0;i<o.count;i++){o.getMatrixAt(i,im);mats.push(new THREE.Matrix4().multiplyMatrices(o.matrixWorld,im));}}else mats.push(o.matrixWorld);
   const p=g.attributes.position,idx=g.index,nt=idx?idx.count/3:p.count/3,type=g.type.replace('Geometry','');
   for(const mw of mats){M4.multiplyMatrices(inv,mw);const P=[];let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9,z0=1e9,z1=-1e9;
     for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(M4);P.push([v.x,v.y,v.z]);x0=Math.min(x0,v.x);x1=Math.max(x1,v.x);y0=Math.min(y0,v.y);y1=Math.max(y1,v.y);z0=Math.min(z0,v.z);z1=Math.max(z1,v.z);}
     if(far(x0,x1,y0,y1,z0,z1))continue;
     for(let t=0;t<nt;t++){const a=idx?idx.array[3*t]:3*t,b=idx?idx.array[3*t+1]:3*t+1,c=idx?idx.array[3*t+2]:3*t+2;tri(P[a],P[b],P[c],part,type);}}});
 /* mainspring: its radii from the barrel axis and its height, against the barrel arbor, the wall and the caps' inner faces */
 let ms=null,sp=null;mv.traverse(o=>{if(o.isMesh&&o.userData.partName==='mainspring')ms=o;});
 if(ms&&ms.geometry.attributes.position){M4.multiplyMatrices(inv,ms.matrixWorld);const p=ms.geometry.attributes.position;let r0=1e9,r1=0,y0=1e9,y1=-1e9;
   for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(M4);const r=Math.hypot(v.x,v.z);r0=Math.min(r0,r);r1=Math.max(r1,r);y0=Math.min(y0,v.y);y1=Math.max(y1,v.y);}
   const wall=env.find(e=>e.name==='wall'),ends=env.filter(e=>e!==wall&&e.r>wall.r*0.5),top=ends.filter(e=>Math.abs(e.y1-wall.y0)<0.05)[0]||{y1:wall.y0},bot=ends.filter(e=>Math.abs(e.y0-wall.y1)<0.05)[0]||{y0:wall.y1};   /* the caps' inner faces on the wall's two ends */
   sp={rMin:+r0.toFixed(3),rMax:+r1.toFixed(3),yTop:+y0.toFixed(3),yBottom:+y1.toFixed(3),wall:+wall.r.toFixed(3),capTopInner:+top.y1.toFixed(3),capBottomInner:+bot.y0.toFixed(3)};}
 return JSON.stringify({env:env.map(e=>({name:e.name,r:+e.r.toFixed(3),y0:+e.y0.toFixed(3),y1:+e.y1.toFixed(3)})),parts:Object.values(res).map(o=>({...o,d:+o.d.toFixed(4)})),spring:sp});})()
