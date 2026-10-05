/* bom-check.js: run in the page by bom.py with the parts list (bom.json). Every piece of the model carries its parts-list line as userData.hn (hn() in core.js);
   this counts them and measures, on the built meshes in world space, how each part is held, what it runs in, what it meshes with and what it rests on:
   - in:   rays out from the part's axis (a screw's thread, an arbor's pivot, a pin or post, a setting's outside) at steps along it: the part that surrounds it
           and the gap to it (negative: the part's metal is inside, no hole), and over how long; kinds tap, clear, run, free, press (bom.json 'relations')
   - on:   the least distance between the two parts' surfaces
   - mesh: the two gears' centre distance against m(z1+z2)/2, their modules, how far their faces overlap, and their turns as update() drives them
   - endshake: how far the arbor can move along its axis each way before it meets something that doesn't move with it (rays from its vertices)
   - jewels: the 14 stones, each seated in its setting (rays from its axis) and at its arbor's end
   Returns {counts, untagged, doubled, rel, jewels, gears} for bom.py to judge and write up */
(BOM)=>{const T=THREE,mv=window.__mv;let root=mv;while(root.parent)root=root.parent;
 if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
 const s0=ESC.state(0.4),ST={E:1000+s0.prog,th:s0.th,lift:s0.lift,psDef:s0.psDef,n:2.5,winding:false,springOn:true,msOn:true,blk:0,arm:0};
 const set=s=>{mv.userData._u(Object.assign({},ST,s));root.updateMatrixWorld(true);};set({});
 const L={};for(const l of BOM.lines)L[l.id]=l;
 const vis=o=>{for(let p=o;p;p=p.parent)if(!p.visible&&(!p.isMesh||p.userData.dk))return false;return true;};   /* variants are hidden by group (dial styles, the split balance, the keys); a mesh hidden by look() is still a part (the mainspring) */
 const pn=o=>{for(let p=o;p;p=p.parent)if(p.userData.partName)return p.userData.partName;return'?';};
 /* ---- instances and counts ---- */
 const INST={},SUB={},untagged={},doubled=[];
 root.traverse(o=>{if(!vis(o)||o.userData.devPlate)return;const id=o.userData.hn;
   if(id){(o.userData.sub?SUB:INST)[id]=((o.userData.sub?SUB:INST)[id]||[]).concat([o]);if(!o.userData.sub)for(let p=o.parent;p;p=p.parent)if(p.userData.hn===id&&!p.userData.sub)doubled.push(id);}
   else if(o.isMesh&&!o.userData.decal&&!o.userData.surface){let p=o.parent;while(p&&!p.userData.hn)p=p.parent;if(!p){const k=pn(o);untagged[k]=(untagged[k]||0)+1;}}});
 const counts={};for(const k in INST)counts[k]=INST[k].length;
 const tagOf=o=>{for(let p=o;p;p=p.parent)if(p.userData.hn)return p;return null;};
 /* ---- every solid mesh, with its line and instance ---- */
 const MS=[];root.traverse(o=>{if(!o.isMesh||!vis(o)||o.userData.devPlate||o.userData.decal||o.userData.surface)return;const g=o.geometry;if(!g.attributes||!g.attributes.position||g.attributes.position.count<3)return;
   const t=tagOf(o);if(!t)return;const b=new T.Box3().setFromObject(o);MS.push({m:o,id:t.userData.hn,tag:t,b});});
 /* each sub-tagged piece goes with the nearest instance of its line */
 const cen=o=>new T.Box3().setFromObject(o).getCenter(new T.Vector3());
 const instOf=new Map();for(const x of MS){if(!x.tag.userData.sub){instOf.set(x,x.tag);continue;}const c=INST[x.id];if(!c){instOf.set(x,x.tag);continue;}
   const p=cen(x.m);let best=c[0],bd=1e9;for(const q of c){const d=cen(q).distanceTo(p);if(d<bd){bd=d;best=q;}}instOf.set(x,best);}
 const own=A=>MS.filter(x=>instOf.get(x)===A);
 /* rays hit faces either side, so a ray from inside a part's metal is seen as such */
 const sides=new Map();for(const x of MS)for(const mt of[].concat(x.m.material))if(mt&&!sides.has(mt)){sides.set(mt,mt.side);mt.side=T.DoubleSide;}
 const RC=new T.Raycaster(),nrm=new T.Vector3(),M3=new T.Matrix3();RC.layers.enableAll();   // the pieces drawn merged are on layer 2 (drawMerge)
 const cast=(o,d,list,far)=>{RC.set(o,d);RC.near=0;RC.far=far;const h=[];for(const x of list){const k=h.length;x.m.raycast(RC,h);for(let i=k;i<h.length;i++)h[i].x=x;}
   for(const q of h){if(q.face){M3.getNormalMatrix(q.object.matrixWorld);nrm.copy(q.face.normal).applyMatrix3(M3).normalize();q.back=nrm.dot(d)>0;}else q.back=false;}return h.sort((a,b)=>a.distance-b.distance);};
 /* a part's axis: its own +y (a screw from sHead: its shank's), through its origin; the extent of its meshes along it */
 const axisOf=A=>{const k=A.userData.axis||(A.userData.sc&&A.children.length===3&&A.children[2].geometry&&A.children[2].geometry.type==='CylinderGeometry'?A.children[2]:null);   /* userData.axis: the mesh a part turns about, where its group's origin is off it */
   const ref=k||A,P=new T.Vector3().setFromMatrixPosition(ref.matrixWorld),D=new T.Vector3(0,1,0).transformDirection(ref.matrixWorld).normalize();
   if(!k&&!A.userData.ar&&!A.userData.sc){const c=boxOf(own(A)).getCenter(new T.Vector3()).sub(P),off=c.addScaledVector(D,-c.dot(D));if(off.length()>0.2)P.add(off);}   /* a piece built off its origin (the jewels, the barrel arbor's group): its axis through its middle */
   let lo=1e9,hi=-1e9;for(const x of own(A)){const b=x.b;for(const cx of[b.min.x,b.max.x])for(const cy of[b.min.y,b.max.y])for(const cz of[b.min.z,b.max.z]){const t=new T.Vector3(cx,cy,cz).sub(P).dot(D);lo=Math.min(lo,t);hi=Math.max(hi,t);}}
   return{P,D,lo,hi};};
 /* runs of metal along a ray, per mesh: [from, to, mesh]; a ray that starts inside a mesh's metal (its first hit a back face) runs from 0 */
 const spans=(h,inside)=>{const st=new Map(),out=[];for(const q of h){const k=q.x;if(!st.has(k)){if(q.back&&inside&&!inside.has(k)){st.set(k,null);continue;}st.set(k,q.back?0:null);}if(!q.back)st.set(k,q.distance);else{const a=st.get(k);if(a!=null||!inside||inside.has(k))out.push([a==null?0:a,q.distance,k]);st.set(k,null);}}   /* inside: the meshes the ray starts in (a back face first elsewhere: a seam slipped through, ignored) */
   for(const[k,a]of st)if(a!=null)out.push([a,9,k]);return out.sort((a,b)=>a[0]-b[0]);};
 const perp=D=>{const a=Math.abs(D.y)<0.9?new T.Vector3(0,1,0):new T.Vector3(1,0,0),u=new T.Vector3().crossVectors(D,a).normalize(),v=new T.Vector3().crossVectors(D,u).normalize();return[u,v];};
 const near=(b,r)=>MS.filter(x=>x.b.intersectsBox(b.clone().expandByScalar(r)));
 const boxOf=xs=>{const b=new T.Box3();for(const x of xs)b.union(x.b);return b;};
 /* in: samples along A's axis; at each, 8 rays out: A's own outermost surface (ownR), and the first other part and its gap */
 function radial(A,{lo,hi,need=5,nearest=false}={}){   /* nearest: the part nearest the axis at each step, not the one most rays meet (a stone in a slot) */const ax=axisOf(A),[u,v]=perp(ax.D),mine=new Set(own(A)),cand=near(boxOf(own(A)),4),oth=cand.filter(x=>!mine.has(x)),ow=cand.filter(x=>mine.has(x));
   const a=lo??ax.lo,b=hi??ax.hi,n=Math.min(160,Math.max(8,Math.ceil((b-a)/0.05))),out=[];
   for(let i=0;i<=n;i++){const t=a+(b-a)*(i+0.5)/(n+1),P=ax.P.clone().addScaledVector(ax.D,t),rays=[];
     const HO=[],HX=[];for(let k=0;k<8;k++){const th=(k+0.37)/8*Math.PI*2,d=u.clone().multiplyScalar(Math.cos(th)).addScaledVector(v,Math.sin(th));HO.push(cast(P,d,ow,8));HX.push(cast(P,d,oth,60));}   /* far: a thread in a tall wall runs a long way inside it */   /* the fan turned off +z, where a turned part's seam lies */
     /* a mesh the point is inside: its first hit a back face both ways (one ray alone can slip through a seam between faces) */
     const ins=H=>{const s=new Set();for(let k=0;k<4;k++){const f1=new Map(),f2=new Map();for(const q of H[k])if(!f1.has(q.x))f1.set(q.x,q.back);for(const q of H[k+4])if(!f2.has(q.x))f2.set(q.x,q.back);for(const[x,b]of f1)if(b&&f2.get(x))s.add(x);}return s;};
     const inO=ins(HO),inX=ins(HX);
     for(let k=0;k<8;k++){const oI=spans(HO[k],inO);if(!oI.length){rays.push({oR:0,id:null,gap:null});continue;}const oR=oI[0][1];   /* A's surface: where its first run of metal out from the axis ends */
       let f=null;for(const q of spans(HX[k],inX))if(q[1]>oR-1e-6&&(!f||q[0]<f[0]))f=q;   /* the first other metal at or beyond it; starting inside it: no hole, or too small a one */
       rays.push({oR,id:f?f[2].id:null,gap:f?Math.max(f[0],0)-oR:null});}
     const tally={};for(const r of rays)if(r.id)tally[r.id]=(tally[r.id]||0)+1;let sid=null,sc=0;for(const k in tally)if(tally[k]>sc){sc=tally[k];sid=k;}
     if(nearest){let g=1e9;for(const r of rays)if(r.id&&r.gap<g){g=r.gap;sid=r.id;sc=need;}}
     const gaps=rays.filter(r=>r.id===sid).map(r=>r.gap).sort((a,b)=>a-b);out.push({t,oR:Math.min(...rays.map(r=>r.oR)),id:sc>=need?sid:null,inst:null,gmin:gaps.length?gaps[0]:null,gmed:gaps.length?gaps[gaps.length>>1]:null,gmax:gaps.length?gaps[gaps.length-1]:null});}
   return{ax,samples:out,step:(b-a)/(n+1)};}
 /* on: least distance between the surfaces of two sets of meshes (vertices of each against the triangles of the other, bucketed in 0.25 mm cells) */
 const tris=xs=>{const out=[];for(const x of xs){const g=x.m.geometry,p=g.attributes.position,ix=g.index?g.index.array:null,n=ix?ix.length:p.count,mw=x.m.matrixWorld;
   const V=[];for(let i=0;i<p.count;i++)V.push(new T.Vector3().fromBufferAttribute(p,i).applyMatrix4(mw));for(let t=0;t<n;t+=3){const a=V[ix?ix[t]:t],b=V[ix?ix[t+1]:t+1],c=V[ix?ix[t+2]:t+2];out.push(new T.Triangle(a,b,c));}}return out;};
 const verts=(xs,max)=>{const out=[];for(const x of xs){const p=x.m.geometry.attributes.position,mw=x.m.matrixWorld;for(let i=0;i<p.count;i++)out.push(new T.Vector3().fromBufferAttribute(p,i).applyMatrix4(mw));}
   if(out.length<=max)return out;const k=out.length/max,o=[];for(let i=0;i<max;i++)o.push(out[Math.floor(i*k)]);return o;};
 function minDist(As,Bs,lim=0.5){const ba=boxOf(As).expandByScalar(lim),bb=boxOf(Bs).expandByScalar(lim);if(!ba.intersectsBox(bb))return 99;const reg=ba.clone().intersect(bb);
   let best=99;const cp=new T.Vector3();
   for(const[X,Y]of[[As,Bs],[Bs,As]]){const G=new Map(),C=0.25,key=(i,j,k)=>i+','+j+','+k,tb=new T.Box3();
     for(const tr of tris(Y)){tb.setFromPoints([tr.a,tr.b,tr.c]);if(!tb.intersectsBox(reg))continue;tb.expandByScalar(lim);
       for(let i=Math.floor(tb.min.x/C);i<=Math.floor(tb.max.x/C);i++)for(let j=Math.floor(tb.min.y/C);j<=Math.floor(tb.max.y/C);j++)for(let k=Math.floor(tb.min.z/C);k<=Math.floor(tb.max.z/C);k++){const q=key(i,j,k);if(!G.has(q))G.set(q,[]);G.get(q).push(tr);}}
     const pts=[],clip=(u,w)=>{let t0=0,t1=1;for(const k of['x','y','z']){const d=w[k]-u[k];if(Math.abs(d)<1e-12){if(u[k]<reg.min[k]||u[k]>reg.max[k])return null;continue;}let a=(reg.min[k]-u[k])/d,b=(reg.max[k]-u[k])/d;if(a>b)[a,b]=[b,a];t0=Math.max(t0,a);t1=Math.min(t1,b);if(t0>t1)return null;}return[t0,t1];};
     for(const tr of tris(X)){tb.setFromPoints([tr.a,tr.b,tr.c]);if(!tb.intersectsBox(reg))continue;for(const[u,w]of[[tr.a,tr.b],[tr.b,tr.c],[tr.c,tr.a]]){const c=clip(u,w);if(!c)continue;const L=u.distanceTo(w)*(c[1]-c[0]),n=Math.min(4000,Math.max(1,Math.ceil(L/0.05)));for(let i=0;i<=n;i++)pts.push(u.clone().lerp(w,c[0]+(c[1]-c[0])*i/n));}}   /* points along the edges where they are in the region, 0.05 mm apart, not the corners alone: two faces nearly parallel come closest between them */
     for(const p of pts){if(!reg.containsPoint(p))continue;const l=G.get(key(Math.floor(p.x/C),Math.floor(p.y/C),Math.floor(p.z/C)));if(!l)continue;for(const tr of l){tr.closestPointToPoint(p,cp);const d=cp.distanceTo(p);if(d<best)best=d;}}}
   return best;}
 const carried=id=>{const s=new Set([id]);let grew=true;while(grew){grew=false;for(const l of BOM.lines)for(const r of l.rel||[])if((r[0]==='in'||r[0]==='round')&&r[2]==='press'&&s.has(r[1])&&!s.has(l.id)){s.add(l.id);grew=true;}}return s;};   /* what moves with a part: pressed on it or in it */
 /* endshake: rays along the axis from A's vertices, each way, against every part that doesn't move with it */
 const under=(o,A)=>{for(let p=o;p;p=p.parent)if(p===A)return true;return false;};
 function endshake(A,id){const ax=axisOf(A),car=carried(id),mine=MS.filter(x=>under(x.m,A)||car.has(x.id)),ms=new Set(mine),bx=boxOf(mine),cand=near(bx,1).filter(x=>!ms.has(x));const res={};
   const all=verts(mine,Infinity);for(const[sg,k]of[[1,'dial'],[-1,'train']]){const d=ax.D.clone().multiplyScalar(sg);let best=9,by=null;   /* the 3,000 vertices furthest along the way (where an end meets its endstone) and a sample of the rest: a sample alone can miss a pivot's end among many vertices */
     const ext=all.slice().sort((a,b)=>b.dot(d)-a.dot(d)),pick=ext.length<=6000?ext:[...ext.slice(0,3000),...ext.slice(3000).filter((_,i,r)=>i%Math.ceil(r.length/3000)===0)];for(const p of pick){const h=cast(p.clone().addScaledVector(d,-1e-4),d,cand,best);if(h.length&&h[0].distance<best){best=h[0].distance;by=h[0].x.id;}}res[k]=[+best.toFixed(4),by];}
   return res;}
 /* gears: the meshes of an instance with userData.gear, and their world angle about y (summed rotation.y, flipped frames counted) */
 const gearsOf=A=>{const o=[];A.traverse(q=>{if(q.userData.gear&&vis(q))o.push(q);});return o;};
 const angle=o=>{const ch=[];for(let p=o;p;p=p.parent)ch.unshift(p);let a=0,s=1;for(const p of ch){a+=s*p.rotation.y;if(Math.abs(Math.abs(p.rotation.x)-Math.PI)<1e-6)s=-s;}return a;};
 const wp=o=>new T.Vector3().setFromMatrixPosition(o.matrixWorld);
 const yr=o=>{const b=new T.Box3().setFromObject(o);return[b.min.y,b.max.y];};
 const rel=[],gears=[];
 for(const l of BOM.lines){if(!l.rel||!l.rel.length||!INST[l.id])continue;
   for(const r of l.rel){const[kind,tgt]=r,T2=tgt.split('|');
     INST[l.id].forEach((A,ai)=>{const row={id:l.id,i:ai,kind,tgt,how:r[2]||null};
       try{
       if(kind==='in'||kind==='round'){let R,eng;
         if(kind==='in'){R=radial(A);eng=R.samples.filter(q=>q.id&&T2.includes(q.id));
          if(r[2]==='embed'){const ax=R.ax,[u]=perp(ax.D),Bm=MS.filter(x=>T2.includes(x.id));let n=0;   /* a thread drawn without its hole: the steps along it that lie inside the part's metal (the first hit a back face both ways) */
           for(const q of R.samples){const P=ax.P.clone().addScaledVector(ax.D,q.t);if(Bm.some(x=>{if(!x.b.containsPoint(P))return false;const a=cast(P,u,[x],1000),b=cast(P,u.clone().negate(),[x],1000);return a.length&&b.length&&a[0].back&&b[0].back;}))n++;}   /* mesh by mesh: parts that meet face to face (a box's walls) put another's face first */
           row.embed=+(n*R.step).toFixed(3);}}
         else{const Bs=T2.flatMap(t=>INST[t]||[]),pa=cen(A);let B=Bs[0],bd=1e9;for(const q of Bs){const d=cen(q).distanceTo(pa);if(d<bd){bd=d;B=q;}}if(!B)throw'no '+tgt;R=radial(B);eng=R.samples.filter(q=>q.id===l.id);}
         const g=eng.map(q=>q.gmin).filter(v=>v!=null).sort((a,b)=>a-b),G=eng.map(q=>q.gmed).filter(v=>v!=null).sort((a,b)=>a-b);
         row.len=+(eng.length*R.step).toFixed(3);row.step=+R.step.toFixed(4);row.g=eng.map(q=>q.gmin==null?null:+q.gmin.toFixed(4));row.gmin=g.length?+g[Math.floor(g.length*0.05)].toFixed(4):null;row.gabs=g.length?+g[0].toFixed(4):null;   /* least gap, less the lowest 5 % of samples (a ray in a face's plane) */row.gmed=G.length?+G[G.length>>1].toFixed(4):null;row.gmax=G.length?+G[G.length-1].toFixed(4):null;row.by=[...new Set(eng.map(q=>q.id))];
         row.path=[];let cur=null;for(const q of R.samples){const k=q.id||'-';if(!cur||cur[0]!==k){cur=[k,0,q.gmin];row.path.push(cur);}cur[1]+=R.step;if(q.gmin!=null)cur[2]=Math.min(cur[2]??9,q.gmin);}
         row.path=row.path.map(([k,len,g])=>[k,+len.toFixed(2),g==null?null:+g.toFixed(3)]);
         if(eng.length){const oR=eng.map(q=>q.oR);row.rIn=+Math.min(...oR).toFixed(3);const t0=Math.min(...eng.map(q=>q.t)),t1=Math.max(...eng.map(q=>q.t)),outer=R.samples.filter(q=>q.t<t0-0.3||q.t>t1+0.3).map(q=>q.oR).filter(v=>v>0&&v<3);row.rOut=outer.length?+Math.max(...outer).toFixed(3):null;}}
       else if(kind==='on'){const Bs=MS.filter(x=>T2.includes(x.id));row.d=+minDist(own(A),Bs).toFixed(4);}
       else if(kind==='mesh'){const GB=[...(INST[tgt]||[]),...(SUB[tgt]||[])].flatMap(gearsOf);if(!GB.length){row.err='no gears in '+tgt;}else{let best=null;
           for(const ga of[...(INST[l.id]||[]),...(SUB[l.id]||[])].flatMap(gearsOf))for(const gb of GB){const[a0,a1]=yr(ga),[b0,b1]=yr(gb),ov=Math.min(a1,b1)-Math.max(a0,b0);if(ov<=0)continue;
             const pa=wp(ga),pb=wp(gb),d=Math.hypot(pa.x-pb.x,pa.z-pb.z),za=ga.userData.gear.z,zb=gb.userData.gear.z,ma=ga.userData.gear.m,mb=gb.userData.gear.m,want=ma*(za+zb)/2;
             if(!best||Math.abs(d-want)<Math.abs(best.d-best.want))best={ga,gb,d,want,za,zb,ma,mb,ov};}
           if(!best)row.err='no gears with overlapping faces';else{Object.assign(row,{d:+best.d.toFixed(4),want:+best.want.toFixed(4),za:best.za,zb:best.zb,ma:best.ma,mb:best.mb,ov:+best.ov.toFixed(3)});
             const a0=angle(best.ga),b0=angle(best.gb);set({E:ST.E+97*1000,n:ST.n+1.37});const da=angle(best.ga)-a0,db=angle(best.gb)-b0;set({});row.ratio=+(db/da).toFixed(6);row.wantRatio=+(-best.za/best.zb).toFixed(6);
             gears.push({a:l.id,b:tgt,...Object.fromEntries(['d','want','za','zb','ma','mb','ov','ratio','wantRatio'].map(k=>[k,row[k]]))});}}}
       else if(kind==='endshake'){Object.assign(row,endshake(A,l.id));}
       }catch(e){row.err=String(e);}
       rel.push(row);});}}
 /* jewels: each seated in its holder (rays from its own axis), and at its arbor's end */
 const jewels=[];for(const l of BOM.lines){if(l.kind!=='jewel')continue;const I=INST[l.id]||[];for(const A of I){const R=radial(A,{need:l.jewel.type==='pallet'?1:5,nearest:l.jewel.type==='pallet'}),   /* a pallet stone stands in a slot: its holder on one side is enough */mid=R.samples.filter(q=>q.id),tally={};for(const q of mid)tally[q.id]=(tally[q.id]||0)+1;
   const by=Object.entries(tally).sort((a,b)=>b[1]-a[1]).map(([k,n])=>[k,+(n*R.step).toFixed(2)]),g=mid.map(q=>q.gmin).filter(v=>v!=null);
   jewels.push({id:l.id,type:l.jewel.type,arbor:l.jewel.arbor||null,end:l.jewel.end||null,holder:l.jewel.holder||l.parent,len:+(R.samples.length*R.step).toFixed(2),by,gmin:g.length?+Math.min(...g).toFixed(4):null,oR:+Math.max(...R.samples.map(q=>q.oR)).toFixed(3)});}}
 for(const[mt,sd]of sides)mt.side=sd;set({});
 return{counts,untagged,doubled,rel,jewels,gears};}
