(()=>{
 const mv=window.__mv;mv.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert();
 const partOf=o=>{while(o){if(o.userData&&o.userData.partName)return o.userData.partName;o=o.parent;}return '?';};
 const vis=o=>{while(o){if(!o.visible)return false;if(o===mv)return true;o=o.parent;}return true;};
 const meshes=[];mv.traverse(o=>{if(o.isMesh&&!o.isInstancedMesh&&vis(o)&&o.geometry.attributes.position&&o.geometry.attributes.position.count>2)meshes.push(o);});
 const L=o=>new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld);
 const box=o=>{o.geometry.computeBoundingBox();return o.geometry.boundingBox.clone().applyMatrix4(L(o));};
 const B=new Map(meshes.map(o=>[o,box(o)]));
 const name=o=>partOf(o)+':'+o.geometry.type.replace('Geometry','');
 const out={dupScrews:[],floatScrews:[],looseEnds:[],zfight:[],isolated:[]};
 /* raycasting against both faces */
 const sides=new Map();for(const o of meshes){sides.set(o,o.material.side);o.material.side=THREE.DoubleSide;}
 const rc=new THREE.Raycaster();
 const hitsFrom=(p,d,far,ex)=>{const P=p.clone().applyMatrix4(mv.matrixWorld),D=d.clone().transformDirection(mv.matrixWorld);rc.set(P,D);rc.far=far;
   return rc.intersectObjects(meshes,false).filter(h=>!ex.has(h.object)&&!h.object.material.transparent);};
 const inside=(p,ex)=>{/* parity along 3 axes, majority */let v=0;for(const d of[[1,0,0],[0,1,0],[0,0,1]]){const h=hitsFrom(p,new THREE.Vector3(...d),400,ex);
     const per=new Map();for(const x of h)per.set(x.object,(per.get(x.object)||0)+1);let any=false;for(const[o,n]of per)if(n%2)any=true;if(any)v++;}return v>=2;};
 /* screws */
 const screws=meshes.filter(o=>o.userData.screw!=null);
 for(const s of screws){const p=new THREE.Vector3().setFromMatrixPosition(L(s)),r=s.userData.screw,sl=s.parent.children.filter(c=>c!==s&&c.isMesh&&Math.hypot(c.position.x-s.position.x,c.position.z-s.position.z)<0.01);
   const ex=new Set([s,...sl]);
   /* seat is at the head's +y face (profile 0..-h placed at y); probe just past it, on the axis and at 0.85 of the head's radius: under the head, outside the screw's own hole */
   /* in the screw's own frame, on the axis and round the head every 45 deg: a seat at least 0.15 mm wide (a thin leg) has three of them in it whatever its heading */
   const up=new THREE.Vector3(0,1,0).transformDirection(L(s)),ex1=new THREE.Vector3(1,0,0).transformDirection(L(s)),ez1=new THREE.Vector3(0,0,1).transformDirection(L(s));let ok=0;
   for(const[dx,dz]of[[0,0],...[0,1,2,3,4,5,6,7].map(k=>[0.85*Math.cos(k*Math.PI/4),0.85*Math.sin(k*Math.PI/4)])]){const q=p.clone().addScaledVector(ex1,dx*r).addScaledVector(ez1,dz*r).addScaledVector(up,0.15);if(inside(q,ex))ok++;}
   if(ok<3)out.floatScrews.push([name(s),p.toArray().map(v=>+v.toFixed(2)),r,ok]);
   for(const t of screws){if(t===s||t.id<s.id)continue;const q=new THREE.Vector3().setFromMatrixPosition(L(t));if(Math.abs(q.y-p.y)<2&&Math.hypot(q.x-p.x,q.z-p.z)<r+t.userData.screw-0.05)out.dupScrews.push([name(s),name(t),p.toArray().map(v=>+v.toFixed(1)),q.toArray().map(v=>+v.toFixed(1))]);}}
 /* arbor-like cylinders: both ends should sit in something */
 for(const o of meshes){const g=o.geometry;if(g.type!=='CylinderGeometry')continue;const pr=g.parameters;if(pr.radiusTop>1.5||pr.height<2.5||pr.radiusTop!==pr.radiusBottom)continue;
   const M4=L(o),c=new THREE.Vector3().setFromMatrixPosition(M4),ax=new THREE.Vector3(0,1,0).transformDirection(M4);
   for(const sgn of[1,-1]){const e=c.clone().addScaledVector(ax,sgn*(pr.height/2+0.25));const ex=new Set([o]);
     const e0=c.clone().addScaledVector(ax,sgn*(pr.height/2-0.25)),u=new THREE.Vector3(1,0,0);if(Math.abs(ax.x)>0.9)u.set(0,1,0);u.sub(ax.clone().multiplyScalar(u.dot(ax))).normalize();const w=new THREE.Vector3().crossVectors(ax,u);
     let held=inside(e,ex);for(let k=0;k<6&&!held;k++){const t=k/6*TAU,q=e0.clone().addScaledVector(u,(pr.radiusTop+0.15)*Math.cos(t)).addScaledVector(w,(pr.radiusTop+0.15)*Math.sin(t));if(inside(q,ex))held=true;}
     if(!held)out.looseEnds.push([name(o),e.toArray().map(v=>+v.toFixed(2)),'r'+pr.radiusTop,'h'+pr.height.toFixed(1)]);}}
 /* coplanar horizontal faces of different meshes that overlap: z-fighting */
 const lv=new Map();
 for(const o of meshes){const g=o.geometry,P=g.attributes.position,I=g.index,M4=L(o),n=I?I.count/3:P.count/3,a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),nn=new THREE.Vector3();const m=new Map();
   for(let t=0;t<n;t++){const i0=I?I.array[3*t]:3*t,i1=I?I.array[3*t+1]:3*t+1,i2=I?I.array[3*t+2]:3*t+2;a.fromBufferAttribute(P,i0).applyMatrix4(M4);b.fromBufferAttribute(P,i1).applyMatrix4(M4);c.fromBufferAttribute(P,i2).applyMatrix4(M4);
     nn.subVectors(b,a).cross(new THREE.Vector3().subVectors(c,a));const A=nn.length();if(A<1e-6)continue;nn.divideScalar(A);if(Math.abs(nn.y)<0.999)continue;
     const k=(nn.y>0?'+':'-')+(Math.round(a.y*50)/50).toFixed(2);let bb=m.get(k);if(!bb){bb=[1e9,1e9,-1e9,-1e9,0];m.set(k,bb);}for(const v of[a,b,c]){bb[0]=Math.min(bb[0],v.x);bb[1]=Math.min(bb[1],v.z);bb[2]=Math.max(bb[2],v.x);bb[3]=Math.max(bb[3],v.z);}bb[4]+=A/2;}
   lv.set(o,m);}
 for(let i=0;i<meshes.length;i++)for(let j=i+1;j<meshes.length;j++){const A=meshes[i],Bm=meshes[j];if(A.material===Bm.material&&partOf(A)===partOf(Bm))continue;
   for(const[k,ba]of lv.get(A)){const bb=lv.get(Bm).get(k);if(!bb)continue;const ox=Math.min(ba[2],bb[2])-Math.max(ba[0],bb[0]),oz=Math.min(ba[3],bb[3])-Math.max(ba[1],bb[1]);
     if(ox>0.3&&oz>0.3&&Math.min(ba[4],bb[4])>0.2)out.zfight.push([name(A),name(Bm),k,+ox.toFixed(1),+oz.toFixed(1)]);}}
 /* isolated meshes: bbox touches nothing else */
 for(const o of meshes){const b=B.get(o).clone().expandByScalar(0.25);let t=false;for(const q of meshes){if(q!==o&&b.intersectsBox(B.get(q))){t=true;break;}}if(!t)out.isolated.push([name(o),B.get(o).getCenter(new THREE.Vector3()).toArray().map(v=>+v.toFixed(1))]);}
 for(const[o,s]of sides)o.material.side=s;
 return JSON.stringify(out);
})()
