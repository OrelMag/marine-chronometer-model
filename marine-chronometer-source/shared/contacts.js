/* contacts.js: the contacts between a model's parts, a debug view through viewer.js (the panel's Contacts; contacts=1, or contacts=sweep, in the link). Declares only CONTACTS.
   What it finds: every pair of solids in different parts that touch, come close or pass into each other, on the built solids as fine.py finds overlaps (fine-interference.js),
   but along all three axes and with the gap as well as the overlap: rays on a grid (R0, coarser where the box two solids share is large) through that box grown by the band,
   each solid's intervals along a ray from its surface's crossings (even-odd, as the solids are closed), and for each pair of intervals their overlap (negative, the gap).
   Within TOUCH either way they touch; a gap up to the band (Close within) is close; past TOUCH they overlap, expected where the model's checks list the pair (fine.py's
   EXPECTED, which the page gives as cfg.expected) and not otherwise. Pieces of one part are left out, as fine.py leaves them, unless the part is picked with Inside the part.
   When: This moment scans the model as it stands (the clock stopped as it turns on), and again, only the pairs where something moved, once the model stands still; Over a
   beat and the wind poses the model in each of the page's states (cfg.states, the model's fine.py states; cfg.pose) and keeps what each finds, with the states each pair meets in.
   Shown: each contact on both solids, in each one's own frame, merged into cells of VOX, so a part carries its contacts as it moves or explodes; drawn over everything
   (X-ray), every part a faint ghost, the picked part a little less faint. A part hidden, faded away, isolated out or hidden by Moving parts only takes its contacts with it,
   on both sides. Picking a part shows its contacts alone, and the list its pairs; a pair in the list, that pair alone; the legend's kinds turn on and off.
   CONTACTS.bind(env) (viewer.js): env {mv, r, stage, st, look, wake, name(key), pick(key), stop(), hid(mesh), QA, cfg: {expected {'a:Type|b:Type': why}, states [...], pose(state, update),
   label(state)}}; returns {on(), mat(mesh), look(), frame(now), sig(), hashWrite(h), hashRead(get)}. ?qa: window.__ct (busy, pairs, counts, run). */
const CONTACTS=(()=>{
 const TOUCH=0.006,R0=0.07,MAXC=40000,OFF=0.0137,VOX=0.04,SEV=[1,0,2,3],   /* SEV: the kinds' order of severity: close, touching, expected overlap, unexpected overlap */
   COL=[[0.2,0.95,0.35],[0.25,0.75,1],[1,0.68,0.1],[1,0.16,0.16]],HEX=['#33f259','#40bfff','#ffad1a','#ff2929'],KN=['touching','close','overlap, expected','overlap, not expected'],
   EPS=[0.01,0.03,0.1,0.3,1],EPS0=0.03,AX=[[1,0,2],[0,1,2],[0,2,1]];   /* AX: the ray's axis, then the grid's two */
 const partOf=o=>{for(;o;o=o.parent)if(o.userData&&o.userData.partName)return o.userData.partName;return '?';};
 const TRI=new WeakMap(),M4=new THREE.Matrix4(),V=new THREE.Vector3();
 function tris(g){const idx=g.index,n=idx?idx.count:g.attributes.position.count,v=idx?idx.version:-1,c=TRI.get(g);if(c&&c.n===n&&c.v===v)return c.T;
   const T=new Uint32Array(n);for(let i=0;i<n;i++)T[i]=idx?idx.array[i]:i;TRI.set(g,{T,n,v});return T;}
 /* the solids: meshes under mv whose groups are shown (a mesh the viewer hides still counts, so showing it again needs no scan), as fine-interference.js takes them */
 function collect(mv,keep,only){mv.updateMatrixWorld(true);const out=[],anc=o=>{for(let q=o.parent;q;q=q.parent){if(!q.visible)return false;if(q===mv)return true;}return true;};
   mv.traverse(o=>{if(!o.isMesh||o.userData.ctDebug)return;const g=o.geometry,u=o.userData;if(!g||!g.attributes||!g.attributes.position||g.attributes.position.count<3||u.decal||u.surface)return;
     if(!anc(o)||!(o.visible||keep(o)))return;const m=u.mat0||o.material,tube=g.type==='TubeGeometry';
     if(!tube&&!o.isInstancedMesh&&(m.transparent||m.side===THREE.DoubleSide||u.noCap||u.noShadow))return;
     const part=u.part||partOf(o),pk=u.pk||part;if(only&&part!==only)return;const name=part+':'+g.type.replace('Geometry','')+(tube?'(tube)':'')+(u.barrelWall?'(drum)':'');
     if(u.barrelWall){out.push({o,inst:-1,part,pk,name,ver:0,geo:drum(o)});return;}   /* the Hamilton's barrel wall, an open turned wall: as fine-interference.js tests it, the solid it encloses over its height */
     if(o.isInstancedMesh)for(let i=0;i<o.count;i++)out.push({o,inst:i,part,pk,name,ver:0});else out.push({o,inst:-1,part,pk,name,ver:0});});
   return out;}
 const DRUM=new WeakMap();
 function drum(o){const g=o.geometry;let d=DRUM.get(g);if(d)return d;g.computeBoundingBox();const bb=g.boundingBox,R=o.userData.barrelWall;d=new THREE.CylinderGeometry(R,R,bb.max.y-bb.min.y,72);d.translate(0,(bb.max.y+bb.min.y)/2,0);DRUM.set(g,d);return d;}
 const xf=(it,inv)=>{const Mo=new THREE.Matrix4().multiplyMatrices(inv,it.o.matrixWorld),Mt=Mo.clone();if(it.inst>=0){it.o.getMatrixAt(it.inst,M4);Mt.multiply(M4);}return[Mo,Mt];};
 const pver=it=>{const g=it.o.geometry;return g.attributes.position.version*1e6+(g.index?g.index.version:0);};
 /* an item's solid in mv's frame (P, its box, its triangles' boxes); false if it hasn't moved or changed since it was last placed */
 function place(it,inv){const g=it.geo||it.o.geometry,pv=pver(it),[Mo,Mt]=xf(it,inv);if(it.g===g&&it.pv===pv&&it.Mt&&it.Mt.equals(Mt))return false;   /* g: the solid tested (the drum for a barrel wall) */
  
   it.g=g;it.pv=pv;it.pc=pv;it.Mt=Mt;it.Mc=Mt;it.Moi=Mo.clone().invert();it.ver++;const p=g.attributes.position,T=tris(g),nt=T.length/3,P=new Float64Array(p.count*3),bb=[1e9,1e9,1e9,-1e9,-1e9,-1e9];
   for(let i=0;i<p.count;i++){V.fromBufferAttribute(p,i).applyMatrix4(Mt);P[3*i]=V.x;P[3*i+1]=V.y;P[3*i+2]=V.z;for(let a=0;a<3;a++){const c=P[3*i+a];if(c<bb[a])bb[a]=c;if(c>bb[a+3])bb[a+3]=c;}}
   const TB=new Float64Array(nt*6);for(let t=0;t<nt;t++)for(let a=0;a<3;a++){const x=P[3*T[3*t]+a],y=P[3*T[3*t+1]+a],z=P[3*T[3*t+2]+a];TB[6*t+a]=Math.min(x,y,z);TB[6*t+a+3]=Math.max(x,y,z);}
   Object.assign(it,{P,T,TB,nt,bb});return true;}
 /* each ray's crossings of a solid's surface, on the grid over the shared box X: rays along h, the grid along u and w */
 function cols(d,h,u,w,X,r,nu,nw){const C=new Array(nu*nw),{P,T,TB,nt}=d;
   for(let t=0;t<nt;t++){if(TB[6*t+u+3]<X[u]||TB[6*t+u]>X[u+3]||TB[6*t+w+3]<X[w]||TB[6*t+w]>X[w+3])continue;
     const a=3*T[3*t],b=3*T[3*t+1],c=3*T[3*t+2],au=P[a+u],aw=P[a+w],ah=P[a+h],bu=P[b+u],bw=P[b+w],bh=P[b+h],cu=P[c+u],cw=P[c+w],ch=P[c+h];
     const den=(bw-cw)*(au-cu)+(cu-bu)*(aw-cw);if(Math.abs(den)<1e-14)continue;
     const i0=Math.max(0,Math.ceil((TB[6*t+u]-X[u])/r-0.5-OFF)),i1=Math.min(nu-1,Math.floor((TB[6*t+u+3]-X[u])/r-0.5-OFF)),k0=Math.max(0,Math.ceil((TB[6*t+w]-X[w])/r-0.5-OFF)),k1=Math.min(nw-1,Math.floor((TB[6*t+w+3]-X[w])/r-0.5-OFF));
     for(let i=i0;i<=i1;i++)for(let k=k0;k<=k1;k++){const x=X[u]+(i+0.5+OFF)*r,z=X[w]+(k+0.5+OFF)*r,l1=((bw-cw)*(x-cu)+(cu-bu)*(z-cw))/den,l2=((cw-aw)*(x-cu)+(au-cu)*(z-cw))/den,l3=1-l1-l2;
       if(l1<0||l2<0||l3<0)continue;const q=i*nw+k;(C[q]||(C[q]=[])).push(l1*ah+l2*bh+l3*ch);}}
   return C;}
 const near=(A,B,eps)=>A.bb[0]-eps<B.bb[3]&&B.bb[0]-eps<A.bb[3]&&A.bb[1]-eps<B.bb[4]&&B.bb[1]-eps<A.bb[4]&&A.bb[2]-eps<B.bb[5]&&B.bb[2]-eps<A.bb[5];
 /* a pair's contacts: emit(kind, x, y, z, overlap) in mv's frame, ov the overlap (negative: the gap) */
 function scanPair(A,B,eps,ovKind,emit){const X=[0,1,2].map(a=>Math.max(A.bb[a],B.bb[a])-eps).concat([0,1,2].map(a=>Math.min(A.bb[a+3],B.bb[a+3])+eps));
   if(X[3]<=X[0]||X[4]<=X[1]||X[5]<=X[2])return;const c=[0,0,0];
   for(const[h,u,w]of AX){let r=R0;const ar=(X[u+3]-X[u])*(X[w+3]-X[w]);if(ar/(r*r)>MAXC)r=Math.sqrt(ar/MAXC);
     const nu=Math.max(1,Math.ceil((X[u+3]-X[u])/r)),nw=Math.max(1,Math.ceil((X[w+3]-X[w])/r)),CA=cols(A,h,u,w,X,r,nu,nw),CB=cols(B,h,u,w,X,r,nu,nw);
     for(let q=0;q<nu*nw;q++){const U=CA[q],W=CB[q];if(!U||!W||U.length<2||W.length<2)continue;U.sort((p,s)=>p-s);W.sort((p,s)=>p-s);
       for(let i=0;i+1<U.length;i+=2)for(let j=0;j+1<W.length;j+=2){const lo=Math.max(U[i],W[j]),hi=Math.min(U[i+1],W[j+1]),ov=hi-lo,m=(lo+hi)/2;if(ov<-eps||m<X[h]||m>X[h+3])continue;
         c[h]=m;c[u]=X[u]+(Math.floor(q/nw)+0.5+OFF)*r;c[w]=X[w]+(q%nw+0.5+OFF)*r;emit(ov>TOUCH?ovKind:ov>=-TOUCH?0:1,c[0],c[1],c[2],ov);}}}}
 /* a pair's record (ent): its contacts on each side in that side's mesh frame, merged into VOX cells (the most severe kind kept), its counts, least gap, deepest overlap, and the states each kind was met in */
 const side=()=>({m:new Map(),x:[],y:[],z:[],k:[]});
 function put(S,Moi,x,y,z,k){V.set(x,y,z).applyMatrix4(Moi);const key=((Math.round(V.x/VOX)+4096)*8192+(Math.round(V.y/VOX)+4096))*8192+(Math.round(V.z/VOX)+4096),j=S.m.get(key);
   if(j===undefined){S.m.set(key,S.x.length);S.x.push(V.x);S.y.push(V.y);S.z.push(V.z);S.k.push(k);}else if(SEV[k]>SEV[S.k[j]])S.k[j]=k;}
 const gkey=(A,B)=>[A.pk,B.pk].sort().join('|');
 function scanInto(ents,key,A,B,eps,exp,si,inside){const nk=[A.name,B.name].sort().join('|'),why=exp[nk]??(inside?INWHY:undefined);let e=ents.get(key),mask=0;
   scanPair(A,B,eps,why!=null?2:3,(k,x,y,z,ov)=>{if(!e)ents.set(key,e={A,B,a:side(),b:side(),n:[0,0,0,0],gap:Infinity,depth:0,st:[new Set(),new Set(),new Set(),new Set()],why,nk,g:gkey(A,B),inside});
     e.n[k]++;mask|=1<<k;if(ov<-TOUCH)e.gap=Math.min(e.gap,-ov);if(ov>e.depth)e.depth=ov;put(e.a,A.Moi,x,y,z,k);put(e.b,B.Moi,x,y,z,k);});
   if(e){for(let k=0;k<4;k++)if(mask>>k&1)e.st[k].add(si);e.mask=mask;e.last=si;}return e;}
 const INWHY='pieces of one part, fixed together (a pin, screw or press fit in a solid drawn without its hole); the interference check leaves them out';   /* Inside the part: its overlaps count as expected */
 let E=null;
 const S={on:false,mode:'now',eps:EPS0,inside:false,kinds:[true,true,true,true],pair:null,items:[],ent:new Map(),inItems:[],inEnt:new Map(),inPart:null,labels:[],
   tok:0,busy:'',prog:'',stale:false,ver:0,pts:[],chk:0,quiet:0,hold:null,ghost:null,ghostP:null};
 const yieldF=()=>new Promise(res=>setTimeout(res,0));
 const ready=()=>S.on&&!S.busy;
 function status(t){S.prog=t;draw();}
 /* scans: the moment (moved: only the pairs where something moved since, unless full), the sweep over cfg.states, the picked part's own pieces */
 async function scanNow(full){const tok=++S.tok,mv=E.mv;S.busy='now';S.stale=false;holdOn(false);try{mv.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert();
   if(full){S.items=collect(mv,E.hid);S.ent.clear();}const I=S.items,N=I.length,moved=I.map(it=>place(it,inv)),exp=E.cfg.expected||{};let t0=performance.now(),done=0,tot=N*(N-1)/2;
   for(let ia=0;ia<N;ia++){for(let ib=ia+1;ib<N;ib++){const A=I[ia],B=I[ib],key=ia*N+ib;if(!moved[ia]&&!moved[ib])continue;S.ent.delete(key);
       if(A.part===B.part||A.inst>=0&&B.inst>=0||!near(A,B,S.eps))continue;scanInto(S.ent,key,A,B,S.eps,exp,0,false);
       if(performance.now()-t0>30){status(`Finding contacts… ${Math.round(100*(done+ib-ia)/tot)}%`);await yieldF();if(tok!==S.tok)return;t0=performance.now();}}
     done+=N-1-ia;}
   S.labels=[];if(S.inside)await scanInside(true,tok);}finally{if(tok===S.tok)holdOff();}if(tok!==S.tok)return;S.busy='';S.prog='';build();}
 async function sweep(){const tok=++S.tok,mv=E.mv,C=E.cfg,states=C.states||[];if(!states.length){S.mode='now';return scanNow(true);}
   S.busy='sweep';holdOn(true);try{S.labels=states.map((s,i)=>C.label?C.label(s,i):'state '+(i+1));const exp=C.expected||{};S.ent.clear();S.items=collect(mv,E.hid);
     const I=S.items,N=I.length;I.forEach(it=>{it.g=null;});let t0=performance.now();
     for(let si=0;si<states.length;si++){C.pose(states[si],S.hold.u);mv.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert(),moved=I.map(it=>place(it,inv));
       for(let ia=0;ia<N;ia++)for(let ib=ia+1;ib<N;ib++){const A=I[ia],B=I[ib],key=ia*N+ib;if(A.part===B.part||A.inst>=0&&B.inst>=0)continue;
         if(!moved[ia]&&!moved[ib]){const e=S.ent.get(key);if(e&&e.last===si-1){for(let k=0;k<4;k++)if(e.mask>>k&1)e.st[k].add(si);e.last=si;}continue;}   /* neither moved: as it was the state before */
         if(!near(A,B,S.eps))continue;scanInto(S.ent,key,A,B,S.eps,exp,si,false);
         if(performance.now()-t0>30){status(`Over ${states.length} states: ${si+1}, ${S.labels[si]}`);await yieldF();if(tok!==S.tok)return;t0=performance.now();}}}
     if(S.inside)await scanInside(true,tok);}finally{if(tok===S.tok)holdOff();}
   if(tok!==S.tok)return;S.busy='';S.prog='';build();}
 async function scanInside(force,within){const p=pickPart();if(!S.inside||!p){S.inEnt.clear();S.inPart=null;return;}if(!force&&S.inPart===p)return;
   const tok=within??++S.tok,mv=E.mv,b0=S.busy;S.busy=S.busy||'inside';if(within==null)holdOn(false);try{mv.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert(),I=collect(mv,E.hid,p),N=I.length,exp=E.cfg.expected||{};
   I.forEach(it=>place(it,inv));S.inEnt.clear();S.inItems=I;S.inPart=p;let t0=performance.now();
   for(let ia=0;ia<N;ia++)for(let ib=ia+1;ib<N;ib++){const A=I[ia],B=I[ib];if(A.o===B.o||A.inst>=0&&B.inst>=0||!near(A,B,S.eps))continue;scanInto(S.inEnt,ia*N+ib,A,B,S.eps,exp,0,true);
     if(performance.now()-t0>30){status('Finding contacts inside '+E.name(p)+'…');await yieldF();if(tok!==S.tok)return;t0=performance.now();}}
   }finally{if(within==null&&tok===S.tok)holdOff();}if(!b0)S.busy='';S.prog='';}
 /* while a scan runs the model stands assembled (its explode held at 0: contacts are found on the parts as they go together, and carried out with them), and while the
    sweep poses the model the page's own loop doesn't (its update held); the Hamilton's laid-out view (develop) held as the explode */
 function holdOn(upd){const ud=E.mv.userData;if(S.hold)return;S.hold={u:ud.update,x:ud.explode,d:ud.develop};for(const k of['explode','develop'])if(ud[k]){ud[k](0);ud[k]=()=>{};}if(upd&&ud.update)ud.update=()=>{};}   /* develop: the Hamilton's laid-out train */
 function holdOff(){if(!S.hold)return;const ud=E.mv.userData;ud.update=S.hold.u;if(S.hold.x)ud.explode=S.hold.x;if(S.hold.d)ud.develop=S.hold.d;S.hold=null;E.wake();}
 const pickPart=()=>E.st.pick?E.st.pick.split('.')[0]:null;
 const isPick=it=>!!E.st.pick&&(it.pk===E.st.pick||it.part===E.st.pick);
 /* the pairs after the filters (hidden parts, the pick), grouped by the two pieces (or parts) they join */
 function groups(){const out=new Map(),pk=E.st.pick,ip=pickPart(),hc=new Map(),hid=it=>{let v=hc.get(it.o);if(v===undefined)hc.set(it.o,v=!!E.hid(it.o)||!shown(it.o));return v;};
   const ents=[...S.ent.values(),...(S.inside&&ip&&S.inPart===ip?S.inEnt.values():[])];
   for(const e of ents){if(hid(e.A)||hid(e.B))continue;if(pk&&!e.inside&&!isPick(e.A)&&!isPick(e.B))continue;
     let g=out.get(e.g);if(!g)out.set(e.g,g={key:e.g,a:e.A.pk,b:e.B.pk,ents:[],n:[0,0,0,0],gap:Infinity,depth:0,st:[new Set(),new Set(),new Set(),new Set()],why:new Set(),inside:e.inside});
     g.ents.push(e);for(let k=0;k<4;k++){g.n[k]+=e.n[k];e.st[k].forEach(s=>g.st[k].add(s));}g.gap=Math.min(g.gap,e.gap);g.depth=Math.max(g.depth,e.depth);if(e.why!=null&&e.n[2])g.why.add(e.why);}
   return out;}
 const shown=o=>{for(let q=o.parent;q;q=q.parent){if(!q.visible)return false;if(q===E.mv)return true;}return true;};
 const worst=g=>[3,2,0,1].find(k=>g.n[k]);
 let G=new Map();
 /* the points: one Points per mesh, child of it, from every pair it is in that passes the filters */
 function build(){for(const p of S.pts){p.parent&&p.parent.remove(p);p.geometry.dispose();}S.pts=[];G=groups();if(!S.on){draw();return;}
   const acc=new Map(),add=(o,sd)=>{let a=acc.get(o);if(!a)acc.set(o,a={p:[],c:[]});for(let i=0;i<sd.x.length;i++){const k=sd.k[i];if(!S.kinds[k])continue;a.p.push(sd.x[i],sd.y[i],sd.z[i]);a.c.push(...COL[k]);}};
   for(const g of G.values()){if(S.pair&&g.key!==S.pair)continue;for(const e of g.ents){add(e.A.o,e.a);add(e.B.o,e.b);}}
   const planes=secPlanes();
   for(const[o,a]of acc){if(!a.p.length)continue;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(a.p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(a.c,3));
     const m=new THREE.PointsMaterial({size:2.2,sizeAttenuation:false,vertexColors:true,depthTest:false,depthWrite:false,transparent:true,opacity:S.stale?0.25:0.92,toneMapped:false,clippingPlanes:planes});
     const p=new THREE.Points(g,m);p.userData.ctDebug=1;p.renderOrder=20;p.frustumCulled=false;p.raycast=()=>{};p.layers.enableAll();o.add(p);S.pts.push(p);}
   S.ver++;draw();E.wake();}
 const secPlanes=()=>typeof SEC!=='undefined'&&SEC.on&&SEC.on.value&&SEC.plane?[SEC.plane]:[];
 /* the legend on the stage, and the panel's list */
 let leg=null,listEl=null;
 const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
 const nm=k=>esc(E.name(k));
 function detail(g){const k=worst(g),ns=S.labels.length,st=new Set();for(let q=0;q<4;q++)g.st[q].forEach(s=>st.add(s));
   const d=k===3||k===2?`overlap ${g.depth.toFixed(3)} mm`:k===0?'touching':`gap ${g.gap.toFixed(3)} mm`;
   return d+(ns?`, in ${st.size} of ${ns} states`:'');}
 function draw(){if(!E)return;if(!leg){leg=document.createElement('div');leg.className='ct-leg hidden';E.stage.appendChild(leg);leg.addEventListener('click',ev=>{const b=ev.target.closest('[data-k]');if(b){S.kinds[+b.dataset.k]=!S.kinds[+b.dataset.k];build();}});}
   leg.classList.toggle('hidden',!S.on);if(!S.on){if(listEl)listEl.innerHTML='';return;}
   const n=[0,0,0,0];for(const g of G.values())for(let k=0;k<4;k++)if(g.n[k])n[k]++;const pk=E.st.pick;
   leg.innerHTML=`<b>Contacts</b> <span class="ct-dim">${S.labels.length?`over ${S.labels.length} states`:'at this moment'}${pk?` · ${nm(pk)}`:''}${S.pair?' · one pair':''}</span>`+
     KN.map((t,k)=>`<button data-k="${k}" aria-pressed="${S.kinds[k]}" title="Show or hide these"><i style="background:${HEX[k]}"></i>${t}${k===0?` (within ${TOUCH} mm)`:k===1?` (gap to ${S.eps} mm)`:''}: ${n[k]}</button>`).join('')+
     (S.prog||S.stale?`<span class="ct-st">${esc(S.prog||'The model moved: contacts again when it stands still')}</span>`:'');
   if(S.cnt)S.cnt.textContent=`${G.size} pairs`;
   if(!listEl)return;const L=[...G.values()].sort((p,q)=>SEV[worst(q)]-SEV[worst(p)]||q.depth-p.depth||p.gap-q.gap).slice(0,300);
   listEl.innerHTML=L.length?L.map(g=>{const k=worst(g),other=pk&&(g.a===pk||kpOf(g.a)===pk)?g.b:pk&&(g.b===pk||kpOf(g.b)===pk)?g.a:null,why=[...g.why].join(' / '),ns=S.labels.length,when=[];
       if(ns){const s=[...g.st[k]].sort((x,y)=>x-y);for(const i of s.slice(0,8))when.push(S.labels[i]);if(s.length>8)when.push('…');}
       return `<div class="ct-row${S.pair===g.key?' on':''}"><button class="ct-p" data-g="${esc(g.key)}" title="${esc((why?'Why: '+why+'\n':'')+(when.length?'When ('+KN[k]+'): '+when.join('; '):'Show this pair alone'))}"><i style="background:${HEX[k]}"></i>${other?nm(other):`${nm(g.a)} – ${nm(g.b)}`}${g.inside?' <em>(inside)</em>':''}<span>${esc(detail(g))}</span></button>${other?`<button class="ct-go" data-p="${esc(other)}" title="Pick ${nm(other)}">›</button>`:''}</div>`;}).join('')
     :`<p class="note">${S.busy?'Finding contacts…':'No contacts among the parts shown.'}</p>`;}
 const kpOf=k=>k.split('.')[0];
 function setOn(v){if(v===S.on)return;S.on=v;S.tok++;holdOff();S.busy='';S.prog='';S.stale=false;
   if(v){E.r.setClearColor(0x0b0e13,1);if(S.mode==='now')E.stop();start();}else{E.r.setClearColor(0x000000,0);S.ent.clear();S.inEnt.clear();S.inPart=null;S.items=[];S.pair=null;build();}
   sync();E.look();}
 function start(){if(!S.on)return;requestAnimationFrame(()=>requestAnimationFrame(()=>{if(S.mode==='sweep')sweep();else scanNow(true);}));}
 function sync(){const c=document.getElementById('ctOn');if(c)c.checked=S.on;document.querySelectorAll('#ctMode button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===S.mode?'true':'false'));
   const e=document.getElementById('ctEps');if(e)e.value=String(S.eps);const i=document.getElementById('ctIn');if(i){i.checked=S.inside;i.disabled=!E.st.pick;}
   const w=document.getElementById('ctOpts');if(w)w.classList.toggle('hidden',!S.on);}
 /* the ghosts: every part faint, the picked one less; sections cut them as they cut the parts */
 function mat(m){if(!S.ghost){S.ghost=new THREE.MeshBasicMaterial({color:0x9fb3c8,transparent:true,opacity:0.045,depthWrite:false,clippingPlanes:[]});S.ghostP=new THREE.MeshBasicMaterial({color:0xd9e4f0,transparent:true,opacity:0.16,depthWrite:false,clippingPlanes:[]});}
   const g=E.st.pick&&(m.userData.pk===E.st.pick||m.userData.part===E.st.pick)?S.ghostP:S.ghost,pl=secPlanes();if(g.clippingPlanes.length!==pl.length){S.ghost.clippingPlanes=pl;S.ghostP.clippingPlanes=pl;S.ghost.needsUpdate=S.ghostP.needsUpdate=true;}return g;}
 let lastPick=null,lastSec=0;
 function look(){if(!S.on)return;sync();const p=E.st.pick,sc=secPlanes().length;if(p!==lastPick||sc!==lastSec){lastPick=p;lastSec=sc;if(p==null)S.pair=null;
     if(S.inside&&pickPart()!==S.inPart&&!S.busy){scanInside(false).then(build);return;}}build();}
 /* each 0.25 s: has anything moved since the scan (This moment: scan again once it has stood still 0.4 s), or the parts shown changed (a version, a balance) */
 function frame(now){if(!S.on||S.busy||S.mode!=='now'||now-S.chk<250||E.exploded())return;S.chk=now;const mv=E.mv;mv.updateMatrixWorld(true);
   const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert(),I=collect(mv,E.hid);
   if(I.length!==S.items.length||I.some((it,i)=>it.o!==S.items[i].o||it.inst!==S.items[i].inst)){S.quiet=now;S.stale=true;S.items=[];S.chk=now+150;setTimeout(()=>{if(S.on&&!S.busy)scanNow(true);},400);build();return;}
   let moving=false,moved=false;for(const it of S.items){const Mt=xf(it,inv)[1],pv=pver(it);if(!it.Mc.equals(Mt)||it.pc!==pv){moving=true;it.Mc=Mt;it.pc=pv;}if(!it.Mt.equals(Mt)||it.pv!==pv||it.g!==(it.geo||it.o.geometry))moved=true;}
   if(moving)S.quiet=now;if(moved&&!S.stale){S.stale=true;build();}if(moved&&!moving&&now-S.quiet>=400)scanNow(false);}
 function hashWrite(h){if(!S.on)return;h.set('contacts',S.mode==='sweep'?'sweep':1);if(S.inside)h.set('ctin',1);if(S.eps!==EPS0)h.set('ceps',S.eps);}
 function hashRead(g){const c=g('contacts'),e=+g('ceps');const eps=EPS.includes(e)?e:EPS0,inside=g('ctin')==='1',mode=c==='sweep'?'sweep':'now';
   if(!c){if(S.on)setOn(false);return;}const re=S.on&&(mode!==S.mode||eps!==S.eps);S.mode=mode;S.eps=eps;S.inside=inside;if(!S.on)setOn(true);else if(re){S.tok++;holdOff();S.busy='';start();}
   if(mode==='now'&&g('speed')==null)E.stop();}   /* a link with contacts at this moment stands the model still, as turning them on does (a speed in it, kept) */
 function bindUI(){const on=(id,ev,f)=>{const e=document.getElementById(id);if(e)e.addEventListener(ev,f);};
   on('ctOn','change',e=>setOn(e.target.checked));
   document.querySelectorAll('#ctMode button').forEach(b=>b.addEventListener('click',()=>{const m=b.dataset.v;if(m===S.mode&&!S.on)return;S.mode=m;sync();if(!S.on){setOn(true);return;}S.tok++;holdOff();S.busy='';S.stale=false;if(m==='now')E.stop();start();E.wake();}));
   on('ctEps','change',e=>{S.eps=+e.target.value||EPS0;if(S.on){S.tok++;holdOff();S.busy='';start();}E.wake();});
   on('ctIn','change',e=>{S.inside=e.target.checked;if(S.on&&!S.busy)scanInside(true).then(build);else build();E.wake();});
   listEl=document.getElementById('ctList');S.cnt=document.getElementById('ctCount');
   if(listEl)listEl.addEventListener('click',ev=>{const go=ev.target.closest('.ct-go');if(go){E.pick(go.dataset.p);return;}const b=ev.target.closest('.ct-p');if(b){S.pair=S.pair===b.dataset.g?null:b.dataset.g;build();}});
   if(!document.getElementById('ct-css')){const s=document.createElement('style');s.id='ct-css';s.textContent=CSS;document.head.appendChild(s);}}
 const CSS=`.ct-leg{position:absolute;right:10px;top:92px;z-index:5;max-width:calc(100% - 20px);font:12.5px/1.45 system-ui,sans-serif;color:#dfe6ee;background:rgba(10,13,18,.84);padding:8px 11px;border:1px solid #2a3340;border-radius:6px;pointer-events:auto}
.ct-leg.hidden{display:none}.ct-leg b{font-weight:600}.ct-leg .ct-dim{opacity:.7}.ct-leg button{display:block;background:none;border:0;padding:1px 0;color:inherit;font:inherit;cursor:pointer;text-align:left}
.ct-leg button[aria-pressed=false]{opacity:.38;text-decoration:line-through}.ct-leg i,#ctList i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:7px;vertical-align:-1px}
.ct-leg .ct-st{display:block;margin-top:3px;color:#ffd27a}#ctList{max-height:340px;overflow:auto;margin-top:6px}.ct-row{display:flex;gap:4px;align-items:stretch}
.ct-row .ct-p{flex:1;text-align:left;font-size:13px;padding:3px 6px;border:1px solid transparent;border-radius:4px;background:none;color:inherit;cursor:pointer}
.ct-row .ct-p span{display:block;opacity:.7;font-size:12px;margin-left:17px}.ct-row.on .ct-p{border-color:currentColor}.ct-row .ct-go{padding:0 8px;border-radius:4px;border:1px solid var(--line,#8884);background:none;color:inherit;cursor:pointer}`;
 return{bind(env){E=env;bindUI();sync();
   if(E.QA)window.__ct={busy:()=>!!S.busy||(S.on&&S.stale),on:()=>S.on,pairs:()=>[...G.values()].map(g=>({a:g.a,b:g.b,an:E.name(g.a),bn:E.name(g.b),kind:KN[worst(g)],n:g.n,gap:Number.isFinite(g.gap)?+g.gap.toFixed(4):null,depth:+g.depth.toFixed(4),
     why:[...g.why],inside:g.inside,states:g.st.map(s=>[...s].sort((x,y)=>x-y))})),labels:()=>S.labels,counts:()=>{const n=[0,0,0,0];for(const g of G.values())for(let k=0;k<4;k++)if(g.n[k])n[k]++;return n;},points:()=>S.pts.reduce((a,p)=>a+p.geometry.attributes.position.count,0),dbg:()=>({busy:S.busy,stale:S.stale,prog:S.prog,tok:S.tok,mode:S.mode,eps:S.eps,items:S.items.length,ents:S.ent.size,hold:!!S.hold})};
   return{on:()=>S.on,mat,look,frame,sig:()=>[S.ver],hashWrite,hashRead};}};})();
