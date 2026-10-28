/* seatcheck.js: run in the page by seatcheck.py. Every piece whose line (hn) is in opt.hns (pins, screws, pipes, bushes, hooks: straight pieces that are held by
   going into another part) is followed along its own long axis (the principal axis of its vertices) in steps of opt.step mm; at each step its radius is its
   vertices' farthest from that axis there, and twelve points on a ring opt.gap mm outside it are tested against every other closed mesh (not the piece's own
   line). A step is held where one other mesh is round at least opt.need of the twelve: the piece passes through a hole there (a slit or a cross hole's breakout
   may take a point or two). A pin lying in a slot has metal on two sides only, a loose one on none. Returns one row per piece: its part, line, centre, axis,
   length, the steps held and by what, and the best step's count. The holes' own check (every hole filled) is holecheck.js; this is its other half. */
(opt)=>{const mv=window.__mv;mv.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert();
  const vis=o=>{for(let h=o;h&&h!==mv;h=h.parent)if(!h.visible&&!(h===o&&o.userData.onlyDrive))return false;return true;};
  const pn=o=>{for(let m=o;m&&m!==mv;m=m.parent)if(m.userData.partName)return m.userData.partName;return '?';};
  const hnOf=o=>{for(let m=o;m&&m!==mv;m=m.parent){const h=m.userData.hn;if(h)return Array.isArray(h)?h.join('|'):h;}return '';};
  const ms=[];mv.traverse(o=>{if(o.isMesh&&!o.isInstancedMesh&&!o.userData.decal&&!o.userData.surface&&vis(o)&&o.geometry&&o.geometry.attributes&&o.geometry.attributes.position)ms.push(o);});
  const W=new Map();for(const o of ms){const M=new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld),g=o.geometry,p=g.attributes.position,ix=g.index?g.index.array:null,n=ix?ix.length:p.count,T=new Float64Array(n*3),bb=new THREE.Box3(),v=new THREE.Vector3();
    for(let i=0;i<n;i++){v.fromBufferAttribute(p,ix?ix[i]:i).applyMatrix4(M);T[3*i]=v.x;T[3*i+1]=v.y;T[3*i+2]=v.z;bb.expandByPoint(v);}W.set(o,{T,bb});}
  const hits=(o,q,D)=>{const{T}=W.get(o);let c=0;
    for(let i=0;i<T.length;i+=9){const ax=T[i],ay=T[i+1],az=T[i+2],e1=[T[i+3]-ax,T[i+4]-ay,T[i+5]-az],e2=[T[i+6]-ax,T[i+7]-ay,T[i+8]-az];
      const h=[D[1]*e2[2]-D[2]*e2[1],D[2]*e2[0]-D[0]*e2[2],D[0]*e2[1]-D[1]*e2[0]],a=e1[0]*h[0]+e1[1]*h[1]+e1[2]*h[2];if(Math.abs(a)<1e-12)continue;
      const f=1/a,s=[q.x-ax,q.y-ay,q.z-az],u=f*(s[0]*h[0]+s[1]*h[1]+s[2]*h[2]);if(u<0||u>1)continue;const qq=[s[1]*e1[2]-s[2]*e1[1],s[2]*e1[0]-s[0]*e1[2],s[0]*e1[1]-s[1]*e1[0]],w=f*(D[0]*qq[0]+D[1]*qq[1]+D[2]*qq[2]);
      if(w<0||u+w>1)continue;if(f*(e2[0]*qq[0]+e2[1]*qq[1]+e2[2]*qq[2])>1e-9)c++;}return c;};
  const SL=[0.5773,0.5784,0.5762],inside=(o,q)=>W.get(o).bb.containsPoint(q)&&hits(o,q,SL)%2===1;
  const want=new Set(opt.hns),out=[];
  /* a piece: every mesh of the line under one part (a pin drawn in two meshes is one piece), split where the meshes stand apart (a line made several times) */
  const groups=new Map();for(const o of ms){const h=hnOf(o);if(!want.has(h.split('|')[0]))continue;const k=pn(o)+'|'+h;(groups.get(k)||groups.set(k,[]).get(k)).push(o);}
  for(const[k,os]of groups){let cl=os.map(o=>({os:[o],bb:W.get(o).bb.clone()}));   /* joined while any two touch (a screw's head and shank meet only through its thread) */
    for(let j=true;j;){j=false;for(let a=0;a<cl.length&&!j;a++)for(let b=a+1;b<cl.length;b++)if(cl[a].bb.clone().expandByScalar(0.02).intersectsBox(cl[b].bb)){cl[a].os.push(...cl[b].os);cl[a].bb.union(cl[b].bb);cl.splice(b,1);j=true;break;}}
    for(const{os:P}of cl){const V=[];for(const o of P){const{T}=W.get(o);for(let i=0;i<T.length;i+=3)V.push([T[i],T[i+1],T[i+2]]);}
      const m=[0,1,2].map(j=>V.reduce((s,v)=>s+v[j],0)/V.length),C=[[0,0,0],[0,0,0],[0,0,0]];for(const v of V)for(let a=0;a<3;a++)for(let b=0;b<3;b++)C[a][b]+=(v[a]-m[a])*(v[b]-m[b]);
      /* its axis: of the three principal axes, the one it is roundest about (a pin's is its longest, a bush's or a setting's, wider than long, its shortest):
         each axial step's farthest vertex in twelve sectors round it, their spread over their mean */
      const pa=[];let Cd=C.map(r=>r.slice());for(let j=0;j<2;j++){let v=[1,0.7,0.3];for(let it=0;it<80;it++){const n=[0,1,2].map(a=>Cd[a][0]*v[0]+Cd[a][1]*v[1]+Cd[a][2]*v[2]),l=Math.hypot(...n)||1;v=n.map(x=>x/l);}
        const lam=[0,1,2].reduce((s,a)=>s+v[a]*(Cd[a][0]*v[0]+Cd[a][1]*v[1]+Cd[a][2]*v[2]),0);pa.push(v);Cd=Cd.map((r,a)=>r.map((x,b)=>x-lam*v[a]*v[b]));}
      pa.push([pa[0][1]*pa[1][2]-pa[0][2]*pa[1][1],pa[0][2]*pa[1][0]-pa[0][0]*pa[1][2],pa[0][0]*pa[1][1]-pa[0][1]*pa[1][0]]);
      const round=a=>{const A=new THREE.Vector3(...a),u=new THREE.Vector3(1,0,0);if(Math.abs(A.x)>0.9)u.set(0,1,0);u.sub(A.clone().multiplyScalar(u.dot(A))).normalize();const w=A.clone().cross(u),B=new Map();
        for(const v of V){const d=new THREE.Vector3(v[0]-m[0],v[1]-m[1],v[2]-m[2]),t=d.dot(A),x=d.dot(u),y=d.dot(w),k=Math.round(t/0.1)+'|'+Math.floor((Math.atan2(y,x)+Math.PI)/(2*Math.PI)*12),r=Math.hypot(x,y);if(!(B.get(k)>=r))B.set(k,r);}
        const S=new Map();for(const[k,r]of B){const s=k.split('|')[0];(S.get(s)||S.set(s,[]).get(s)).push(r);}let e=0,n=0;
        for(const rs of S.values()){if(rs.length<12)continue;const mu=rs.reduce((a,b)=>a+b,0)/rs.length;if(mu<1e-3)continue;e+=Math.sqrt(rs.reduce((a,b)=>a+(b-mu)**2,0)/rs.length)/mu;n++;}return n?e/n:9;};
      const ax=pa.map(a=>[a,round(a)]).sort((p,q)=>p[1]-q[1])[0][0];
      const A=new THREE.Vector3(...ax),M0=new THREE.Vector3(...m),e1=new THREE.Vector3(1,0,0);if(Math.abs(A.x)>0.9)e1.set(0,1,0);e1.sub(A.clone().multiplyScalar(e1.dot(A))).normalize();const e2=A.clone().cross(e1);
      const t=V.map(v=>(v[0]-m[0])*ax[0]+(v[1]-m[1])*ax[1]+(v[2]-m[2])*ax[2]),t0=Math.min(...t),t1=Math.max(...t),len=t1-t0,ns=Math.max(1,Math.round(len/opt.step)),R=new Array(ns).fill(0);
      V.forEach((v,i)=>{const s=Math.min(ns-1,Math.floor((t[i]-t0)/len*ns)),d=new THREE.Vector3(v[0]-m[0],v[1]-m[1],v[2]-m[2]),r=d.sub(A.clone().multiplyScalar(t[i])).length();if(r>R[s])R[s]=r;});
      /* a step with no vertex in it (a plain cylinder's or a prism's sides run from end to end) takes the smaller of the nearest steps' each side */
      {const R0=R.slice();for(let s=0;s<ns;s++)if(!R0[s]){let a=s,b=s;while(a>=0&&!R0[a])a--;while(b<ns&&!R0[b])b++;R[s]=Math.min(a>=0?R0[a]:1e9,b<ns?R0[b]:1e9);}}
      const others=ms.filter(o=>!P.includes(o)&&hnOf(o).split('|')[0]!==hnOf(P[0]).split('|')[0]),held=[];let best=0,bestBy='',emb=0;const embBy=new Set(),embAt=[];
      /* the piece's outside along a ray from its axis: its farthest crossing of the piece's own triangles (a bush's bore and oil sink lie inside it) */
      const far=(c,d)=>{let tm=0;for(const o of P){const{T}=W.get(o);for(let i=0;i<T.length;i+=9){const ax_=T[i],ay=T[i+1],az=T[i+2],f1=[T[i+3]-ax_,T[i+4]-ay,T[i+5]-az],f2=[T[i+6]-ax_,T[i+7]-ay,T[i+8]-az];
        const h=[d.y*f2[2]-d.z*f2[1],d.z*f2[0]-d.x*f2[2],d.x*f2[1]-d.y*f2[0]],a=f1[0]*h[0]+f1[1]*h[1]+f1[2]*h[2];if(Math.abs(a)<1e-12)continue;const f=1/a,s0=[c.x-ax_,c.y-ay,c.z-az],u=f*(s0[0]*h[0]+s0[1]*h[1]+s0[2]*h[2]);if(u<0||u>1)continue;
        const qq=[s0[1]*f1[2]-s0[2]*f1[1],s0[2]*f1[0]-s0[0]*f1[2],s0[0]*f1[1]-s0[1]*f1[0]],w=f*(d.x*qq[0]+d.y*qq[1]+d.z*qq[2]);if(w<0||u+w>1)continue;const t=f*(f2[0]*qq[0]+f2[1]*qq[1]+f2[2]*qq[2]);if(t>tm)tm=t;}}return tm;};
      for(let s=0;s<ns;s++){if(!R[s])continue;const c=M0.clone().addScaledVector(A,t0+(s+0.5)*len/ns),qs=[];
        /* the step's outside the largest of its twelve rays (a thread's crest: a ray on its flank would probe the thread's clearance) */
        const ds=[...Array(12).keys()].map(k=>{const a=k/12*2*Math.PI+0.13;return e1.clone().multiplyScalar(Math.cos(a)).addScaledVector(e2,Math.sin(a));}),rs=Math.max(...ds.map(d=>far(c,d)))||R[s];
        for(const d of ds)qs.push(c.clone().addScaledVector(d,rs+opt.gap));
        /* buried: points in the piece's own metal (its axis and half its radius) inside another part too, a pin in solid metal with no hole for it (a press fit's
           hundredths don't reach so deep): the Wempe's stop bar's and stop spring's pins (marine-chronometer-1b's drawing check, 27 October 2026) */
        {const ins=[c,...ds.filter((_,k)=>k%3===0).map(d=>c.clone().addScaledVector(d,rs*0.5))].filter(q=>P.some(o=>inside(o,q)));
          for(const o of others){if(ins.some(q=>inside(o,q))){emb++;embAt.push(s);embBy.add(pn(o)+':'+hnOf(o));break;}}}
        /* held: the points in other metal at least opt.need of twelve, and one part round at least half of them (a pin wedging a spring's end in its hole has the
           strip on one side: the Wempe's at the collet and the stud) */
        const bq=new THREE.Box3().setFromPoints(qs),any=new Set();let top=0,topBy='';
        for(const o of others){if(!W.get(o).bb.intersectsBox(bq))continue;const ins=qs.map((q,i)=>inside(o,q)?i:-1).filter(i=>i>=0),n=ins.length;ins.forEach(i=>any.add(i));
          if(opt.detail&&n)(out.detail=out.detail||[]).push([hnOf(P[0]),s,+R[s].toFixed(3),pn(o)+':'+hnOf(o),n]);if(n>top){top=n;topBy=pn(o)+':'+hnOf(o);}}
        if(any.size>best){best=any.size;bestBy=topBy;}if(any.size>=opt.need&&top>=6)held.push(topBy);}
      const by=[...new Set(held)];out.push({part:pn(P[0]),hn:hnOf(P[0]),c:m.map(x=>+x.toFixed(2)),ax:ax.map(x=>+x.toFixed(2)),len:+len.toFixed(2),r:+Math.min(...R.filter(x=>x>0)).toFixed(3),steps:ns,held:held.length,by,best,bestBy,emb,embAt,embBy:[...embBy]});}}
  return out;}
