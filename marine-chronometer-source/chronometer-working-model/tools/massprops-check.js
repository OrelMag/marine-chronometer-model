/* massprops-check.js: run in the page by massprops.py (?snap&qa). The gimbals' two swinging bodies as the model builds them: the bowl (the case and everything in it: the
   movement, dial, hands, bezel, crystal) about the case pivots at 6 and 12, and the gimbal ring (with its straps, bosses, bushings and the case pivots' screws and nuts) about
   the ring's pivots at 3 and 9. Every closed solid is integrated (tetrahedra from the origin: volume, first and second moments; signed, so a hole counts out) at its material's
   density; surfaces (userData.decal, userData.surface) are left out. Everything is in the ring's frame at rest, the gimbal centre (both axes) its origin, mm and g.
   Then each axis turned a step at a time, both ways, until a vertex of the case or the ring first comes inside anything else of the box (each piece's bounding box in the box's
   frame, the box's walls being boxes): the angle each swings before it stops. Returns JSON. */
(()=>{const M=window.__M,BX=window.__BX,ring=BX.ring,bowl=BX.bowl,root=BX.root,mv=window.__mv;
  const KEY=new Map(Object.entries(M).map(([k,v])=>[v,k]));
  /* densities, g/cm³ = mg/mm³: brass (clock brass CuZn39Pb2-3, 8.4-8.5; the fusee wheel's "copper" colour and the gilt and nickel-plated plates are brass too), carbon steel
     7.85 (physics.js), ruby 3.98 (dynamics.js), Invar 36 8.05, soda-lime glass 2.5, and the small parts' estimated (packing 1.2, fibre 1.35, felt 0.3, mahogany 0.55) */
  const RHO={plate:8.5,plateSolid:8.5,gilt:8.5,brass:8.5,brass2:8.5,copper:8.5,steel:7.85,steelD:7.85,steelS:7.85,blued:7.85,blue310:7.85,giltH:8.5,bakelite:1.37,steelK:7.85,chain:7.85,chain2:7.85,mspring:7.85,
    ruby:3.98,clear:3.98,delrin:1.41,invar:8.05,glass:2.5,packing:1.2,fibre:1.35,felt:0.3,wood:0.55,woodEdge:0.55};
  root.updateMatrixWorld(true);const toRing=new THREE.Matrix4().copy(ring.matrixWorld).invert(),A=new THREE.Vector3(),B=new THREE.Vector3(),C=new THREE.Vector3(),im=new THREE.Matrix4();
  const body=()=>({m:0,s:[0,0,0],S:[[0,0,0],[0,0,0],[0,0,0]],byMat:{},byPart:{},missing:{}});
  const add=(Bd,o,mat)=>{let key=KEY.get(mat)||'?';if(key==='?'){let p=o,pn=null;while(p&&!pn){pn=p.userData.partName;p=p.parent;}if(pn==='hands')key='steel';}const rho=(window.__mpRho&&window.__mpRho(o,key,mat))??RHO[key];   /* __mpRho: another model's densities (massprops.py --model, its checks.py) */   /* the hands have their own material: blued steel */if(rho==null){let p=o,pn=null;while(p&&!pn){pn=p.userData.partName;p=p.parent;}const k=key+' '+(pn||'?')+' '+(o.material&&o.material.type);Bd.missing[k]=(Bd.missing[k]||0)+1;return;}
    const g=o.geometry,P=g.attributes.position,I=g.index,n=I?I.count:P.count;
    const mats=o.isInstancedMesh?[...Array(o.count).keys()].map(i=>{o.getMatrixAt(i,im);return toRing.clone().multiply(o.matrixWorld).multiply(im);}):[toRing.clone().multiply(o.matrixWorld)];
    let m=0;const s=[0,0,0],S=[[0,0,0],[0,0,0],[0,0,0]];
    for(const T of mats)for(let k=0;k+2<n;k+=3){A.fromBufferAttribute(P,I?I.getX(k):k).applyMatrix4(T);B.fromBufferAttribute(P,I?I.getX(k+1):k+1).applyMatrix4(T);C.fromBufferAttribute(P,I?I.getX(k+2):k+2).applyMatrix4(T);
      const v=A.dot(B.clone().cross(C))/6,a=[A.x,A.y,A.z],b=[B.x,B.y,B.z],c=[C.x,C.y,C.z],q=[a[0]+b[0]+c[0],a[1]+b[1]+c[1],a[2]+b[2]+c[2]];m+=v;for(let i=0;i<3;i++){s[i]+=v*q[i]/4;for(let j=0;j<3;j++)S[i][j]+=v/20*(a[i]*a[j]+b[i]*b[j]+c[i]*c[j]+q[i]*q[j]);}}
    m*=rho;Bd.m+=m;for(let i=0;i<3;i++){Bd.s[i]+=rho*s[i];for(let j=0;j<3;j++)Bd.S[i][j]+=rho*S[i][j];}Bd.byMat[key]=(Bd.byMat[key]||0)+m;
    let p=o,pn=null;while(p&&!pn){pn=p.userData.partName;p=p.parent;}Bd.byPart[pn||'?']=(Bd.byPart[pn||'?']||0)+m;};
  const under=(o,anc)=>{for(let p=o;p;p=p.parent)if(p===anc)return true;return false;};
  if(window.__mpMode==='springs'){const SP=body(),inv=new THREE.Matrix4().copy(mv.matrixWorld).invert();mv.updateMatrixWorld(true);
    mv.traverse(o=>{let p=o,pn=null;while(p&&!pn){pn=p.userData.partName;p=p.parent;}if(o.isMesh&&(pn==='mainspring'||pn==='hairspring')&&o.geometry.attributes.position){const keep=toRing.clone();toRing.copy(inv);add(SP,o,o.userData.mat0||o.material);toRing.copy(keep);}});
    return JSON.stringify({m:SP.m,s:SP.s,S:SP.S,byPart:SP.byPart});}
  const BW=body(),RG=body();
  const offRev=o=>{for(let p=o;p;p=p.parent)if(p.userData&&p.userData.rev&&!p.visible)return true;return false;};   /* the pieces of the drawings' other state (the Wempe's setRev), hidden: not weighed */
  bowl.traverse(o=>{if(o.isMesh&&!offRev(o)&&!o.userData.decal&&!o.userData.surface&&o.geometry.attributes.position)add(BW,o,o.userData.mat0||o.material);});
  ring.traverse(o=>{if(o.isMesh&&!offRev(o)&&!under(o,bowl)&&!o.userData.decal&&!o.userData.surface&&o.geometry.attributes.position)add(RG,o,o.userData.mat0||o.material);});
  const fin=Bd=>{const c=Bd.s.map(x=>x/Bd.m),S=Bd.S,I=[[S[1][1]+S[2][2],-S[0][1],-S[0][2]],[-S[0][1],S[0][0]+S[2][2],-S[1][2]],[-S[0][2],-S[1][2],S[0][0]+S[1][1]]];   /* the inertia tensor about the gimbal centre */
    const r=x=>+x.toFixed(4);return{m:r(Bd.m),cg:c.map(r),I:I.map(row=>row.map(r)),byMat:Object.fromEntries(Object.entries(Bd.byMat).map(([k,v])=>[k,r(v)]).sort((a,b)=>b[1]-a[1])),
      byPart:Object.fromEntries(Object.entries(Bd.byPart).map(([k,v])=>[k,r(v)]).sort((a,b)=>b[1]-a[1]).slice(0,25)),missing:Bd.missing};};
  /* the stops: obstacles are every mesh of the box but the ring, the bowl and the ring's pivot screws (their groups' meshes), as bounding boxes in the box's frame; the moving
     points are the vertices of the case's and the ring's own meshes (not the movement inside the case), every 3rd */
  const toRoot=new THREE.Matrix4().copy(root.matrixWorld).invert(),obs=[],movers=[];
  root.traverse(o=>{if(!o.isMesh||under(o,ring)||offRev(o)||!o.geometry.attributes.position)return;let p=o;   /* another version's pieces (hidden) aren't there to meet */while(p&&p.parent!==root)p=p.parent;
    if(p&&p.userData.partName==='ring')return;   /* the ring's pivot screws, washers and nuts (gp) */
    o.geometry.computeBoundingBox();obs.push({b:o.geometry.boundingBox.clone().applyMatrix4(toRoot.clone().multiply(o.matrixWorld)),o});});
  ring.traverse(o=>{if(o.isMesh&&!under(o,mv)&&!offRev(o)&&!o.userData.decal&&!o.userData.surface&&o.geometry.attributes.position)movers.push(o);});
  /* __mpExact (another model's, massprops.py --model): a point in an obstacle's bounding box counts only inside the solid itself (a ray's crossings of its faces) */
  const EX=window.__mpExact,inside=(q,v)=>{if(q.o.isInstancedMesh)return true;q.inv=q.inv||toRoot.clone().multiply(q.o.matrixWorld).invert();const p=v.clone().applyMatrix4(q.inv),P=q.o.geometry.attributes.position,I=q.o.geometry.index,n=I?I.count:P.count,d=new THREE.Vector3(1,0.0013,0.0021).normalize();
    const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),e1=new THREE.Vector3(),e2=new THREE.Vector3(),h=new THREE.Vector3(),s=new THREE.Vector3(),qq=new THREE.Vector3();let x=0;
    for(let k=0;k+2<n;k+=3){a.fromBufferAttribute(P,I?I.getX(k):k);b.fromBufferAttribute(P,I?I.getX(k+1):k+1);c.fromBufferAttribute(P,I?I.getX(k+2):k+2);e1.subVectors(b,a);e2.subVectors(c,a);h.crossVectors(d,e2);const det=e1.dot(h);if(Math.abs(det)<1e-12)continue;
      const f=1/det;s.subVectors(p,a);const u=f*s.dot(h);if(u<0||u>1)continue;qq.crossVectors(s,e1);const w=f*d.dot(qq);if(w<0||u+w>1)continue;if(f*e2.dot(qq)>0)x++;}return x%2===1;};
  const hits=()=>{root.updateMatrixWorld(true);const set=new Set();const v=new THREE.Vector3();
    for(const o of movers){const T=toRoot.clone().multiply(o.matrixWorld),P=o.geometry.attributes.position;for(let i=0;i<P.count;i+=3){v.fromBufferAttribute(P,i).applyMatrix4(T);
      for(let k=0;k<obs.length;k++)if(obs[k].b.containsPoint(v)&&(!EX||inside(obs[k],v)))set.add(k);}}return set;};
  const base=hits(),stop=(set,ax)=>{for(let d=0.5;d<=60;d+=0.5){set(d*Math.PI/180);const h=hits();for(const k of h)if(!base.has(k)){set(0);let p=obs[k].o,pn=null;while(p&&!pn){pn=p.userData.partName;p=p.parent;}return{deg:d,against:pn||obs[k].o.name||'?'};}}set(0);return{deg:null};};
  const stops=window.__mpNoStops?{}:{ring:[stop(a=>{ring.rotation.x=a;},'x'),stop(a=>{ring.rotation.x=-a;},'x')],bowl:[stop(a=>{bowl.rotation.z=a;},'z'),stop(a=>{bowl.rotation.z=-a;},'z')]};
  root.updateMatrixWorld(true);
  const mvM=toRing.clone().multiply(mv.matrixWorld).elements;   /* the movement's frame in the ring's (column-major) */
  return JSON.stringify({mvM,raw:{bowl:{m:BW.m,s:BW.s,S:BW.S},ring:{m:RG.m,s:RG.s,S:RG.S}},bowl:fin(BW),ring:fin(RG),stops,obstacles:obs.length,baseHits:base.size,ringY:ring.position.y,RO:BX.RO,CR:BX.CR});})()
