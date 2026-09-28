(()=>{
 const mv=window.__mv;mv.updateMatrixWorld(true);
 const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert(),RES=0.4,OFF=0.137,items=[];
 const vis=o=>{while(o){if(!o.visible)return false;if(o===mv)return true;o=o.parent;}return true;};
 const partOf=o=>{while(o){if(o.userData&&o.userData.partName)return o.userData.partName;o=o.parent;}return '?';};
 mv.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||!vis(o))return;const m=o.userData.mat0||o.material;
   if(m.transparent||m.side===THREE.DoubleSide||o.userData.noCap||o.userData.noShadow)return;
   const g=o.geometry;if(!g.attributes||!g.attributes.position||g.attributes.position.count<3)return;
   if(g.type==='TubeGeometry')return;
   items.push(o);});
 const M4=new THREE.Matrix4(),v=new THREE.Vector3();
 const sets=items.map(o=>{
   M4.multiplyMatrices(inv,o.matrixWorld);const g=o.geometry,p=g.attributes.position,idx=g.index;
   const P=[];for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(M4);P.push(v.x,v.y,v.z);}
   const tri=idx?idx.array:null,nt=idx?idx.count/3:p.count/3,cols=new Map();
   for(let t=0;t<nt;t++){const a=tri?tri[3*t]:3*t,b=tri?tri[3*t+1]:3*t+1,c=tri?tri[3*t+2]:3*t+2;
     const ax=P[3*a],ay=P[3*a+1],az=P[3*a+2],bx=P[3*b],by=P[3*b+1],bz=P[3*b+2],cx=P[3*c],cy=P[3*c+1],cz=P[3*c+2];
     const den=(bz-cz)*(ax-cx)+(cx-bx)*(az-cz);if(Math.abs(den)<1e-12)continue;
     const i0=Math.ceil((Math.min(ax,bx,cx)-OFF)/RES-0.5),i1=Math.floor(Math.max(ax,bx,cx)/RES-0.5),k0=Math.ceil(Math.min(az,bz,cz)/RES-0.5),k1=Math.floor(Math.max(az,bz,cz)/RES-0.5);
     for(let i=i0;i<=i1;i++)for(let k=k0;k<=k1;k++){const x=(i+0.5)*RES,z=(k+0.5)*RES;
       const l1=((bz-cz)*(x-cx)+(cx-bx)*(z-cz))/den,l2=((cz-az)*(x-cx)+(ax-cx)*(z-cz))/den,l3=1-l1-l2;
       if(l1<0||l2<0||l3<0)continue;const y=l1*ay+l2*by+l3*cy,key=i*4096+k;let arr=cols.get(key);if(!arr){arr=[];cols.set(key,arr);}arr.push(y);}}
   const S=new Set();
   for(const[key,arr]of cols){arr.sort((a,b)=>a-b);const i=Math.floor(key/4096+0.5*0)|0;const ii=Math.round((key-((key%4096+4096)%4096))/4096),kk=((key%4096)+4096)%4096;
     const kx=kk>2048?kk-4096:kk,ix=kk>2048?ii+1:ii;
     for(let q=0;q+1<arr.length;q+=2){for(let j=Math.ceil(arr[q]/RES-0.5);j<=Math.floor(arr[q+1]/RES-0.5);j++)S.add((ix+400)*1e6+(j+400)*1e3+(kx+400));}}
   return S;});
 const bb=items.map(o=>new THREE.Box3().setFromObject(o));
 const out=[];
 for(let a=0;a<items.length;a++)for(let b=a+1;b<items.length;b++){
   if(!bb[a].intersectsBox(bb[b]))continue;
   const A=sets[a].size<sets[b].size?sets[a]:sets[b],B=A===sets[a]?sets[b]:sets[a];let n=0;for(const x of A)if(B.has(x))n++;
   if(n>2){const oa=items[a],ob=items[b];const c=new THREE.Vector3();
     out.push({n,vol:+(n*RES**3).toFixed(1),a:partOf(oa)+':'+oa.geometry.type,b:partOf(ob)+':'+ob.geometry.type,sameParent:oa.parent===ob.parent,
       at:(()=>{const bx=bb[a].clone().intersect(bb[b]);bx.getCenter(c).applyMatrix4(inv);return[c.x.toFixed(1),c.y.toFixed(1),c.z.toFixed(1)].join(',');})()});}}
 out.sort((x,y)=>y.n-x.n);return JSON.stringify({items:items.length,out});
})()
