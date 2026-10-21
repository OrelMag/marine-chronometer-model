/* seams.js (seams.py runs it in the page): pairs of meshes of one part whose flat faces lie in one plane, facing the same way, and meet or overlap there.
   The page's Edges pass outlines each mesh, so two meshes of one solid sharing a visible face (or with flush walls) draw a line where the real part has none.
   Each mesh's flat triangles are bucketed by plane (normal to 0.002, offset to 0.01 mm) and rastered on a 0.05 mm grid in that plane; a pair counts the cells
   of one's faces within a cell of the other's (meeting along a line or overlapping). MODE (set by the caller): 'movement' or 'box'. */
(()=>{
 const MV=window.__mv,box=window.__SEAMBOX,root=box?(window.__BX?window.__BX.root:MV.parent.parent.parent):MV;root.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(root.matrixWorld).invert();
 const partOf=o=>{while(o){if(o.userData&&o.userData.partName)return o.userData.partName;o=o.parent;}return '?';};
 const hnOf=o=>{while(o){if(o.userData&&o.userData.hn)return o.userData.hn;o=o.parent;}return '';};
 const vis=o=>{while(o){if(box&&o===MV)return false;if(!o.visible)return false;if(o===root)return true;o=o.parent;}return true;};
 const meshes=[];root.traverse(o=>{if(o.isMesh&&!o.isInstancedMesh&&vis(o)&&!o.userData.decal&&!o.userData.surface&&o.geometry.attributes.position&&o.geometry.attributes.position.count>2)meshes.push(o);});
 const MN=new Map();for(const src of[window.__M,window.M,window.mats])if(src)for(const[k,v]of Object.entries(src))if(v&&v.isMaterial&&!MN.has(v))MN.set(v,k);
 const mn=o=>MN.get(o.material)||o.material.name||o.material.uuid.slice(0,6),bx=o=>{const b=new THREE.Box3().setFromObject(o);return[...b.min.toArray(),...b.max.toArray()].map(v=>+v.toFixed(2));};
 const C=0.05,planes=new Map();   /* mesh -> Map(planeKey -> {n,d,tris:[[a,b,c]...]}) */
 for(const o of meshes){const g=o.geometry,P=g.attributes.position,I=g.index,M4=new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld),n=I?I.count/3:P.count/3,m=new Map();
   const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),nn=new THREE.Vector3(),e=new THREE.Vector3();
   for(let t=0;t<n;t++){const i0=I?I.array[3*t]:3*t,i1=I?I.array[3*t+1]:3*t+1,i2=I?I.array[3*t+2]:3*t+2;a.fromBufferAttribute(P,i0).applyMatrix4(M4);b.fromBufferAttribute(P,i1).applyMatrix4(M4);c.fromBufferAttribute(P,i2).applyMatrix4(M4);
     nn.subVectors(b,a).cross(e.subVectors(c,a));const A=nn.length();if(A<1e-5)continue;nn.divideScalar(A);
     const q=[Math.round(nn.x*500),Math.round(nn.y*500),Math.round(nn.z*500)],d=Math.round(nn.dot(a)*100),k=q.join(',')+'|'+d;let s=m.get(k);if(!s){s={n:nn.clone(),d:nn.dot(a),tris:[]};m.set(k,s);}s.tris.push([a.clone(),b.clone(),c.clone()]);}
   planes.set(o,m);}
 const raster=(s,n,dil)=>{const u=new THREE.Vector3(1,0,0);if(Math.abs(n.x)>0.9)u.set(0,1,0);u.sub(n.clone().multiplyScalar(u.dot(n))).normalize();const v=new THREE.Vector3().crossVectors(n,u),cells=new Set();
   for(const[a,b,c]of s.tris){const p=[a,b,c].map(x=>[x.dot(u)/C,x.dot(v)/C]);const x0=Math.floor(Math.min(...p.map(q=>q[0]))),x1=Math.ceil(Math.max(...p.map(q=>q[0]))),y0=Math.floor(Math.min(...p.map(q=>q[1]))),y1=Math.ceil(Math.max(...p.map(q=>q[1])));
     if((x1-x0)*(y1-y0)>4e6)continue;
     const ar=(p[1][0]-p[0][0])*(p[2][1]-p[0][1])-(p[2][0]-p[0][0])*(p[1][1]-p[0][1]);if(Math.abs(ar)<1e-9)continue;
     for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++){const px=x+0.5,py=y+0.5;let ok=true,near=false;
       for(let i=0;i<3;i++){const[ax,ay]=p[i],[bx,by]=p[(i+1)%3];const cr=((bx-ax)*(py-ay)-(by-ay)*(px-ax))*Math.sign(ar),L=Math.hypot(bx-ax,by-ay)||1;if(cr/L<-0.75){ok=false;break;}}
       if(ok)for(let dx=-dil;dx<=dil;dx++)for(let dy=-dil;dy<=dil;dy++)cells.add((x+dx)+','+(y+dy));}}
   return cells;};
 const byPart=new Map();for(const o of meshes){const p=partOf(o);if(!byPart.has(p))byPart.set(p,[]);byPart.get(p).push(o);}
 const out=[];
 for(const[part,ms]of byPart)for(let i=0;i<ms.length;i++)for(let j=i+1;j<ms.length;j++){const A=ms[i],B=ms[j],pa=planes.get(A),pb=planes.get(B);
   for(const[k,sa]of pa){const sb=pb.get(k);if(!sb)continue;const ca=raster(sa,sa.n,0),cb=raster(sb,sa.n,1);let sh=0;for(const x of ca)if(cb.has(x))sh++;
     if(sh<4)continue;const n=sa.n;
     out.push({part,a:[A.geometry.type.replace('Geometry',''),hnOf(A),mn(A),A.userData.pc||A.userData.hn||''],b:[B.geometry.type.replace('Geometry',''),hnOf(B),mn(B),B.userData.pc||B.userData.hn||''],
       sameMat:A.material===B.material,n:[+n.x.toFixed(3),+n.y.toFixed(3),+n.z.toFixed(3)],d:+sa.d.toFixed(2),cells:sh,len:+(sh*C).toFixed(2),
       ca:[...new THREE.Box3().setFromObject(A).getCenter(new THREE.Vector3()).toArray().map(v=>+v.toFixed(1))],cb:[...new THREE.Box3().setFromObject(B).getCenter(new THREE.Vector3()).toArray().map(v=>+v.toFixed(1))],ia:meshes.indexOf(A),ib:meshes.indexOf(B),ba:bx(A),bb:bx(B)});}}
 window.__SEAMMESH=meshes;
 return JSON.stringify(out);
})()
