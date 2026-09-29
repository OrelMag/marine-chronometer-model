/* Fine interference check (run by fine.py): for each pair of meshes whose boxes meet, cast vertical rays through only the shared box, on a 0.05 mm grid
   (coarser if that box is large), and add up where both meshes are solid; exact in y. Unlike interference-check.js it includes instanced meshes (each chain
   link) and tubes (hairspring, trip spring), and it skips pairs in one rotating group (parts fixed to each other), not pairs in one part. */
(()=>{const mv=window.__mv;mv.updateMatrixWorld(true);
 const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert(),items=[];
 const vis=o=>{while(o){if(!o.visible)return false;if(o===mv)return true;o=o.parent;}return true;};
 const partOf=o=>{while(o){if(o.userData&&o.userData.partName)return o.userData.partName;o=o.parent;}return '?';};
 const EXTRA=[];mv.traverse(o=>{if(!o.isMesh||!vis(o))return;const g=o.geometry;if(!g.attributes||!g.attributes.position||g.attributes.position.count<3)return;
   if(o.isInstancedMesh){const im=new THREE.Matrix4();for(let i=0;i<o.count;i++){o.getMatrixAt(i,im);EXTRA.push({o,mat:new THREE.Matrix4().multiplyMatrices(o.matrixWorld,im),tag:'link'+(i%2)});}return;}
   const m=o.userData.mat0||o.material;if(g.type==='TubeGeometry'){items.push({o,mat:o.matrixWorld,tube:1});return;}
   if(o.userData.noCap&&g.type==='CylinderGeometry'&&g.parameters.openEnded){const q=g.parameters;items.push({o,mat:o.matrixWorld,geo:new THREE.CylinderGeometry(q.radiusTop,q.radiusBottom,q.height,q.radialSegments),tag2:'(drum)'});return;}   /* an open drum (the barrel wall) as the solid it encloses */
   if(m.transparent||m.side===THREE.DoubleSide||o.userData.noCap||o.userData.noShadow)return;items.push({o,mat:o.matrixWorld});});
 for(const e of EXTRA)items.push(e);
 const M4=new THREE.Matrix4(),v=new THREE.Vector3();
 const D=items.map(it=>{const o=it.o;M4.multiplyMatrices(inv,it.mat);const g=it.geo||o.geometry,p=g.attributes.position,idx=g.index;
   const P=new Float64Array(p.count*3);let x0=1e9,y0=1e9,z0=1e9,x1=-1e9,y1=-1e9,z1=-1e9;
   for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(M4);P[3*i]=v.x;P[3*i+1]=v.y;P[3*i+2]=v.z;x0=Math.min(x0,v.x);x1=Math.max(x1,v.x);y0=Math.min(y0,v.y);y1=Math.max(y1,v.y);z0=Math.min(z0,v.z);z1=Math.max(z1,v.z);}
   const nt=idx?idx.count/3:p.count/3,T=new Uint32Array(nt*3);for(let t=0;t<nt*3;t++)T[t]=idx?idx.array[t]:t;
   const TB=new Float64Array(nt*4);for(let t=0;t<nt;t++){const a=T[3*t],b=T[3*t+1],c=T[3*t+2];TB[4*t]=Math.min(P[3*a],P[3*b],P[3*c]);TB[4*t+1]=Math.max(P[3*a],P[3*b],P[3*c]);TB[4*t+2]=Math.min(P[3*a+2],P[3*b+2],P[3*c+2]);TB[4*t+3]=Math.max(P[3*a+2],P[3*b+2],P[3*c+2]);}
   return{P,T,TB,nt,bb:[x0,y0,z0,x1,y1,z1],part:partOf(o),name:o.geometry.type.replace('Geometry','')+(it.tube?'(tube)':'')+(it.tag2||''),par:it.tag?null:o.parent,inst:!!it.tag};});
 const cols=(d,X,r,nx,nz)=>{const C=new Array(nx*nz);const{P,T,TB,nt}=d;
   for(let t=0;t<nt;t++){if(TB[4*t+1]<X[0]||TB[4*t]>X[3]||TB[4*t+3]<X[2]||TB[4*t+2]>X[5])continue;
     const a=T[3*t],b=T[3*t+1],c=T[3*t+2],ax=P[3*a],ay=P[3*a+1],az=P[3*a+2],bx=P[3*b],by=P[3*b+1],bz=P[3*b+2],cx=P[3*c],cy=P[3*c+1],cz=P[3*c+2];
     const den=(bz-cz)*(ax-cx)+(cx-bx)*(az-cz);if(Math.abs(den)<1e-14)continue;
     const i0=Math.max(0,Math.ceil((TB[4*t]-X[0])/r-0.5)),i1=Math.min(nx-1,Math.floor((TB[4*t+1]-X[0])/r-0.5)),k0=Math.max(0,Math.ceil((TB[4*t+2]-X[2])/r-0.5)),k1=Math.min(nz-1,Math.floor((TB[4*t+3]-X[2])/r-0.5));
     for(let i=i0;i<=i1;i++)for(let k=k0;k<=k1;k++){const x=X[0]+(i+0.5)*r,z=X[2]+(k+0.5)*r;
       const l1=((bz-cz)*(x-cx)+(cx-bx)*(z-cz))/den,l2=((cz-az)*(x-cx)+(ax-cx)*(z-cz))/den,l3=1-l1-l2;if(l1<0||l2<0||l3<0)continue;
       const q=i*nz+k;(C[q]||(C[q]=[])).push(l1*ay+l2*by+l3*cy);}}
   return C;};
 const out=[];
 for(let a=0;a<D.length;a++)for(let b=a+1;b<D.length;b++){const A=D[a],B=D[b];if(A.inst&&B.inst)continue;if(A.par&&A.par===B.par)continue;
   const X=[Math.max(A.bb[0],B.bb[0]),Math.max(A.bb[1],B.bb[1]),Math.max(A.bb[2],B.bb[2]),Math.min(A.bb[3],B.bb[3]),Math.min(A.bb[4],B.bb[4]),Math.min(A.bb[5],B.bb[5])];
   if(X[3]-X[0]<=0.005||X[4]-X[1]<=0.005||X[5]-X[2]<=0.005)continue;
   let r=0.05;const ar=(X[3]-X[0])*(X[5]-X[2]);if(ar/(r*r)>200000)r=Math.sqrt(ar/200000);
   const nx=Math.max(1,Math.ceil((X[3]-X[0])/r)),nz=Math.max(1,Math.ceil((X[5]-X[2])/r));
   const CA=cols(A,X,r,nx,nz),CB=cols(B,X,r,nx,nz);let vol=0,mx=0,n=0,sx=0,sy=0,sz=0;
   for(let q=0;q<nx*nz;q++){const u=CA[q],w=CB[q];if(!u||!w||u.length<2||w.length<2)continue;u.sort((p,s)=>p-s);w.sort((p,s)=>p-s);
     let L=0,ym=0;for(let i=0;i+1<u.length;i+=2)for(let j=0;j+1<w.length;j+=2){const lo=Math.max(u[i],w[j],X[1]),hi=Math.min(u[i+1],w[j+1],X[4]);if(hi>lo){L+=hi-lo;ym=(hi+lo)/2;}}
     if(L>0.005){vol+=L*r*r;mx=Math.max(mx,L);n++;const i=Math.floor(q/nz),k=q%nz;sx+=X[0]+(i+0.5)*r;sz+=X[2]+(k+0.5)*r;sy+=ym;}}
   if(n>=2&&vol>0.0005)out.push({a:A.part+':'+A.name,b:B.part+':'+B.name,vol:+vol.toFixed(4),n,r:+r.toFixed(3),maxY:+mx.toFixed(3),span:+(Math.sqrt(n)*r).toFixed(2),at:[sx/n,sy/n,sz/n].map(c=>+c.toFixed(2))});}
 return JSON.stringify({items:items.length,out});})()
