/* mechanisms-wempe.js: run in the Wempe's page by mechanisms.py --model wempe. What wempe_ratchets.js needs from the built model: each pawl on its ratchet as the model
   seats it, in the ratchet's own frame (its centre the origin, plan x and z of the movement's frame, mm): the two maintaining clicks (05 06 02-3) on the click wheel
   (05 06 04-3; they turn on the maintaining ratchet, the click wheel with the fusee), the maintaining detent (05 05 05-1, at hole 4) on the maintaining ratchet (05 06 02-1),
   the set-up click (05 08 05-2, the barrel bridge's, at hole 46) on the set-up ratchet (05 07 00-3). Each solid's outline is the top edges of its side walls; the ratchet is
   turned against the pawl the way its load turns it (the click wheel forward, rotation.y rising, as the fusee drives running; the maintaining ratchet back, falling, as its
   spring pushes it while the key turns; the barrel arbor rising, anticlockwise from the dial, as the mainspring pulls it: README, the set-up ratchet) until its outline first
   takes in a point of the pawl's that wasn't in it as drawn, or a corner of its own enters the pawl's (and the other way, for how far it turns before meeting the pawl
   there). Gives the contact C, the ratchet's outward normal there (the force on the
   pawl), the pivot, how deep the pawl reaches into the teeth, the faces' common height (the bearing's width); each pawl's mass and moment of inertia about its pivot and
   the fusee's and barrel's about their axes (closed solids at brass 8.45 and steel 7.85, as wempe_inertia.py). Returns JSON. */
(()=>{const mv=window.__mv,T=THREE,TAU=2*Math.PI,H=WD.H,M=window.__M,KEY=new Map(Object.entries(M).map(([k,v])=>[v,k]));
  if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
  const s=ESC.state(0.4);mv.userData._u({E:1000+s.prog,th:s.th,lift:s.lift,psDef:s.psDef,n:3,winding:false,slip:0});mv.updateMatrixWorld(true);
  const r4=x=>+(+x).toFixed(4),P2=p=>[r4(p[0]),r4(p[1])];
  const vis=o=>{for(let h=o;h&&h!==mv;h=h.parent)if(!h.visible)return false;return true;};
  const find=id=>{const o=[];mv.traverse(m=>{if(m.isMesh&&m.userData.hn===id&&vis(m))o.push(m);});return o;};
  const inv=new T.Matrix4(),loc=o=>{mv.updateMatrixWorld(true);inv.copy(mv.matrixWorld).invert();return new T.Matrix4().multiplyMatrices(inv,o.matrixWorld);};
  const rot=(p,a)=>{const c=Math.cos(a),s=Math.sin(a);return[p[0]*c-p[1]*s,p[0]*s+p[1]*c];};
  /* a solid's outline in plan (movement frame): the top edges of its side walls (triangles standing upright), each a segment with the wall's outward normal; unordered,
     which is all a crossing count needs (a cap's own triangulation can leave T-junctions, its walls don't); its y range */
  const outline=o=>{const M4=loc(o),g=o.geometry,P=g.attributes.position,I=g.index,n=I?I.count:P.count,V=[],v=new T.Vector3();
    for(let i=0;i<n;i++){v.fromBufferAttribute(P,I?I.getX(i):i).applyMatrix4(M4);V.push([v.x,v.y,v.z]);}
    const y1=Math.max(...V.map(p=>p[1])),y0=Math.min(...V.map(p=>p[1])),S=[];
    for(let t=0;t<n;t+=3){const a=V[t],b=V[t+1],c=V[t+2],u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],w=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],nn=[u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0]],l=Math.hypot(...nn);
      if(l<1e-12||Math.abs(nn[1])>0.1*l)continue;const q=[a,b,c];for(let k=0;k<3;k++){const p1=q[k],p2=q[(k+1)%3];if(Math.abs(p1[1]-y1)<1e-4&&Math.abs(p2[1]-y1)<1e-4&&Math.hypot(p1[0]-p2[0],p1[2]-p2[2])>1e-6)S.push({a:[p1[0],p1[2]],b:[p2[0],p2[2]],n:[nn[0]/Math.hypot(nn[0],nn[2]),nn[2]/Math.hypot(nn[0],nn[2])]});}}
    return{S,y:[y0,y1]};};
  /* a solid of several levels (one mesh: the maintaining detent's thick part and thin tip, merged 21 October 2026) as its levels: its side walls grouped by the heights they
     span, each group's top edges the outline at that level, so each level is tested at its own height as separate solids were */
  const levels=o=>{const M4=loc(o),g=o.geometry,P=g.attributes.position,I=g.index,n=I?I.count:P.count,V=[],v=new T.Vector3(),G=new Map();
    for(let i=0;i<n;i++){v.fromBufferAttribute(P,I?I.getX(i):i).applyMatrix4(M4);V.push([v.x,v.y,v.z]);}
    for(let t=0;t<n;t+=3){const q=[V[t],V[t+1],V[t+2]],u=[q[1][0]-q[0][0],q[1][1]-q[0][1],q[1][2]-q[0][2]],w=[q[2][0]-q[0][0],q[2][1]-q[0][1],q[2][2]-q[0][2]],nn=[u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0]],l=Math.hypot(...nn);
      if(l<1e-12||Math.abs(nn[1])>0.1*l)continue;const lo=Math.min(...q.map(p=>p[1])),hi=Math.max(...q.map(p=>p[1])),k=lo.toFixed(4)+'|'+hi.toFixed(4);if(!G.has(k))G.set(k,{S:[],y:[lo,hi]});
      for(let j=0;j<3;j++){const p1=q[j],p2=q[(j+1)%3];if(Math.abs(p1[1]-hi)<1e-4&&Math.abs(p2[1]-hi)<1e-4&&Math.hypot(p1[0]-p2[0],p1[2]-p2[2])>1e-6)G.get(k).S.push({a:[p1[0],p1[2]],b:[p2[0],p2[2]],n:[nn[0]/Math.hypot(nn[0],nn[2]),nn[2]/Math.hypot(nn[0],nn[2])]});}}
    const L=[...G.values()];return L.length>1?L:[outline(o)];};
  const shift=(S,c)=>S.map(e=>({a:[e.a[0]-c[0],e.a[1]-c[1]],b:[e.b[0]-c[0],e.b[1]-c[1]],n:e.n}));
  const turnS=(S,a)=>S.map(e=>({a:rot(e.a,a),b:rot(e.b,a),n:rot(e.n,a)}));
  const inS=(S,x,z)=>{let w=false;for(const{a:[xi,zi],b:[xj,zj]}of S)if((zi>z)!==(zj>z)&&x<(xj-xi)*(z-zi)/(zj-zi)+xi)w=!w;return w;};
  /* inside the ratchet: crossings of the ray outward from its centre through the point (only its outline's walls beyond the point count, so a window of them, whole or
     cut, counts right: the bore and the screws' holes lie inside) */
  const inR=(S,x,z)=>{const r=Math.hypot(x,z),u=[x/r,z/r];let w=false;for(const{a,b}of S){const d=[b[0]-a[0],b[1]-a[1]],den=u[0]*d[1]-u[1]*d[0];if(Math.abs(den)<1e-12)continue;
      const t=(a[0]*d[1]-a[1]*d[0])/den,s2=(a[0]*u[1]-a[1]*u[0])/den;if(t>r&&s2>=0&&s2<1)w=!w;}return w;};
  const denseS=(S,h)=>{const d=[];for(const e of S){const k=Math.max(1,Math.ceil(Math.hypot(e.b[0]-e.a[0],e.b[1]-e.a[1])/h));for(let j=0;j<k;j++)d.push([e.a[0]+(e.b[0]-e.a[0])*j/k,e.a[1]+(e.b[1]-e.a[1])*j/k]);}return d;};
  /* the masses: each closed solid at its material's density, about an axis through c (plan), tetrahedra from the axis (massprops-check.js's way) */
  const RHO=k=>/steel|blue|chain|mspring/i.test(k)?7.85:/brass|gilt|plate|copper/i.test(k)?8.45:null;
  const weigh=(ms,c)=>{let m=0,I=0;const A=new T.Vector3(),B=new T.Vector3(),C=new T.Vector3(),miss={};for(const o of ms){const rho=RHO(KEY.get(o.material)||'');if(rho==null){const k=KEY.get(o.material)||'?';miss[k]=(miss[k]||0)+1;continue;}
      const M4=loc(o),P=o.geometry.attributes.position,X=o.geometry.index,n=X?X.count:P.count;
      for(let k=0;k+2<n;k+=3){A.fromBufferAttribute(P,X?X.getX(k):k).applyMatrix4(M4);B.fromBufferAttribute(P,X?X.getX(k+1):k+1).applyMatrix4(M4);C.fromBufferAttribute(P,X?X.getX(k+2):k+2).applyMatrix4(M4);
        for(const q of[A,B,C]){q.x-=c[0];q.z-=c[1];}const v=A.dot(B.clone().cross(C))/6,a=[A.x,A.z],b=[B.x,B.z],cc=[C.x,C.z],q=[a[0]+b[0]+cc[0],a[1]+b[1]+cc[1]];let S=0;for(let i=0;i<2;i++)S+=(a[i]*a[i]+b[i]*b[i]+cc[i]*cc[i]+q[i]*q[i])/20;
        m+=v*rho;I+=v*rho*S;}}return{m:r4(m/1000),I:r4(I/1000),missing:miss};};   /* g, g·mm² */
  const meshesOf=name=>{const o=[];mv.traverse(m=>{if(!m.isMesh||!vis(m)||m.userData.decal||m.userData.surface||m.isInstancedMesh)return;for(let p=m;p&&p!==mv;p=p.parent)if(p.userData.partName===name){o.push(m);break;}});return o;};
  /* one pawl on one ratchet */
  const pair=(name,ratId,pawlMs,centre,pivot,z,LD,note)=>{const ro_=l=>Math.max(...l.S.map(e=>Math.hypot(e.a[0]-centre[0],e.a[1]-centre[1]))),R0=levels(find(ratId)[0]).reduce((b,l)=>ro_(l)>ro_(b)?l:b);   /* the ratchet's toothed level: a ratchet merged with its plate and cup (the maintaining ratchet, 21 October 2026) read at its teeth, as its toothed solid alone was */
    const Rl=shift(R0.S,centre),ry=R0.y,pitch=TAU/z;
    const ro=Math.max(...Rl.map(e=>Math.hypot(...e.a)));
    const PW=pawlMs.flatMap(levels).filter(o=>o.y[1]>ry[0]+1e-3&&o.y[0]<ry[1]-1e-3);   /* the pawl's solids at the ratchet's height */
    const W=PW.map(o=>shift(o.S,centre)),near=W.flatMap(w=>denseS(w,0.005)).filter(p=>Math.hypot(p[0],p[1])<ro+0.2);
    const da=(p,a)=>Math.abs(Math.atan2(Math.sin(Math.atan2(p[1],p[0])-a),Math.cos(Math.atan2(p[1],p[0])-a)));
    const ang0=Math.atan2(near.reduce((q,p)=>q+p[1],0),near.reduce((q,p)=>q+p[0],0)),Rw=Rl.filter(e=>(da(e.a,ang0)<2.5*pitch||da(e.b,ang0)<2.5*pitch)&&Math.max(Math.hypot(...e.a),Math.hypot(...e.b))>0.6*ro),win=denseS(Rw,0.005).filter(p=>da(p,ang0)<2*pitch);
    /* the root found from the outline's outer envelope (the farthest point at each angle, in bins of a hundredth of a pitch), so a hole inside the teeth (the click wheel's three M2
       holes on r 5.75, under a click as A-B places the clicks) doesn't read as one: until 16 October 2026 the least radius of any edge within a pitch */
    const env=new Map();for(const p of denseS(Rw,0.005)){const d=Math.atan2(Math.sin(Math.atan2(p[1],p[0])-ang0),Math.cos(Math.atan2(p[1],p[0])-ang0));if(Math.abs(d)>=pitch)continue;const k=Math.round(d/pitch*100),r=Math.hypot(p[0],p[1]);if(!(env.get(k)>=r))env.set(k,r);}
    const eR=Math.min(...env.values()),root=Math.min(...denseS(Rw,0.005).filter(p=>da(p,ang0)<pitch).map(p=>Math.hypot(p[0],p[1])).filter(r=>r>=eR-0.5*(ro-eR)));   /* then the least radius within half the envelope's depth below its root: under an undercut face's overhang, short of any hole */
    const hit=(d,dir)=>{const Rr=turnS(Rw,dir*d);return{a:near.map(p=>da(p,ang0)<2*pitch&&inR(Rr,p[0],p[1])),b:win.map(p=>rot(p,dir*d)).map(p=>W.some(w=>inS(w,p[0],p[1])))};};
    const run=dir=>{const h0=hit(0,dir),grow=h=>h.a.some((x,i)=>x&&!h0.a[i])||h.b.some((x,i)=>x&&!h0.b[i]);let lo=0,hi=null;
      for(let d=2e-4;d<0.3;d+=2e-4){if(grow(hit(d,dir))){hi=d;break;}lo=d;}if(hi===null)return null;
      for(let k=0;k<25;k++){const m=(lo+hi)/2;grow(hit(m,dir))?hi=m:lo=m;}const h=hit(hi,dir),Rr=turnS(Rw,dir*hi);
      /* the contact: the pawl's points newly inside, or the ratchet's newly inside the pawl; their middle (the pawl's frame: the pawl as drawn) */
      const pts=[...near.filter((_,i)=>h.a[i]&&!h0.a[i]),...win.map(p=>rot(p,dir*hi)).filter((_,i)=>h.b[i]&&!h0.b[i])],C=pts.reduce((q,p)=>[q[0]+p[0]/pts.length,q[1]+p[1]/pts.length],[0,0]);
      /* the ratchet's outward normal at C: its nearest wall's */
      let best=null;for(const e of Rr){const ev=[e.b[0]-e.a[0],e.b[1]-e.a[1]],l2=ev[0]*ev[0]+ev[1]*ev[1],t=Math.max(0,Math.min(1,((C[0]-e.a[0])*ev[0]+(C[1]-e.a[1])*ev[1])/l2)),q=[e.a[0]+ev[0]*t,e.a[1]+ev[1]*t],dd=Math.hypot(C[0]-q[0],C[1]-q[1]);if(!best||dd<best.d)best={d:dd,n:e.n};}
      const Cb=C,nb=best.n,rC=Math.hypot(...Cb),tg=[-Cb[1]/rC,Cb[0]/rC];   /* at the touch: the pawl as drawn, the ratchet turned on by the gap */
      return{dir,gap:hi*rC,C:Cb,n:nb,face:Math.abs(nb[0]*tg[0]+nb[1]*tg[1]),r:[Math.min(...pts.map(p=>Math.hypot(...p))),Math.max(...pts.map(p=>Math.hypot(...p)))],np:pts.length};};
    /* LD: the way the load turns the ratchet against the pawl, as rotation.y (+1 rising): turned here in plan, where rot's +1 is rotation.y falling */
    const load=run(-LD),back=run(LD);if(!load)return{name,z,error:'no contact the way of its load within 0.3 rad'};const aC=Math.atan2(load.C[1],load.C[0]);
    const depth=ro-Math.min(...near.filter(p=>da(p,aC)<pitch/2).map(p=>Math.hypot(...p)));
    const hgt=Math.max(...PW.map(o=>Math.min(o.y[1],ry[1])-Math.max(o.y[0],ry[0]))),wt=weigh(pawlMs,pivot);
    return{name,z,ro:r4(ro),ri:r4(root),p:r4(pitch),pivot:P2([pivot[0]-centre[0],pivot[1]-centre[1]]),load:LD,face:{kind:load.face>0.5?'on the face':'tip corner on the pawl',along:r4(load.face),C:P2(load.C),n:P2(load.n),gap:r4(load.gap),r:load.r.map(r4),depth:r4(depth),np:load.np},
      back:back?{gap:r4(back.gap),along:r4(back.face),r:back.r.map(r4)}:null,height:r4(hgt),mass:wt.m,I:wt.I,note};};
  const FX=[H[10][0],H[10][1]],BX=[H[45][0],H[45][1]],CK=find('050602-3');
  const out={pawls:[]};
  CK.forEach((m,i)=>{const p=new T.Vector3().setFromMatrixPosition(m.parent.matrixWorld).applyMatrix4(new T.Matrix4().copy(mv.matrixWorld).invert());
    out.pawls.push(pair('click '+(i+1),'050604-3',[m],FX,[p.x,p.z],35,1,"a maintaining click (05 06 02-3) on the click wheel 05 06 04-3: running, the fusee's drive through it to the maintaining ratchet"));});
  /* the maintaining detent as it works: its nose down in a gap, the ratchet then turned back onto the steep face (pair's run). Running it rides the teeth, so where the frozen
     state leaves it depends on the train's phase and on how fusee.js seats it: re-frozen at the train's place over a ratchet tooth (E, every 0.5 over 420, a tooth and more)
     that puts its nose nearest the ratchet's axis (until 27 October 2026 measured where E 1000 left it: on 27 October fusee.js's finer seat left it on a tooth's tip there,
     and the contact read at the tip, r 18.59 of 18.6, so wempe_transmission.js's detent barely lifted) */
  {const D=find('050505-1'),nose=()=>{mv.updateMatrixWorld(true);let m=1e9;const v=new T.Vector3();for(const o of D){const M=loc(o),P=o.geometry.attributes.position;for(let i=0;i<P.count;i+=1){v.fromBufferAttribute(P,i).applyMatrix4(M);m=Math.min(m,Math.hypot(v.x-FX[0],v.z-FX[1]));}}return m;};
    const at=E=>{mv.userData._u({E:E+s.prog,th:s.th,lift:s.lift,psDef:s.psDef,n:3,winding:false,slip:0});return nose();};let bE=1000,bm=at(1000);for(let E=1000.5;E<=1420;E+=0.5){const m=at(E);if(m<bm-1e-6){bm=m;bE=E;}}at(bE);out.detentE=bE;}
  out.pawls.push(pair('maintaining detent','050602-1',find('050505-1'),FX,[H[4][0],H[4][1]],120,-1,"the maintaining detent (05 05 05-1, hole 4) on the maintaining ratchet 05 06 02-1: winding, it holds the ratchet against the maintaining spring"));
  out.pawls.push(pair('set-up click','050700-3',find('050805-2'),BX,[H[46][0],H[46][1]],16,1,"the set-up click (05 08 05-2, hole 46) on the set-up ratchet 05 07 00-3: it holds the mainspring's set-up and its wind on the barrel arbor"));
  /* the arbors that move with the clicks when the key lets go: the fusee (with its click wheel, cover plate, stop work, dust plate and Vorreiber), the barrel with its spring */
  out.arbors={fusee:weigh([...meshesOf('fusee'),...meshesOf('coverPlate'),...meshesOf('stopWork'),...meshesOf('dustPlate'),...meshesOf('vorreiber')],FX),barrel:weigh([...meshesOf('barrel'),...meshesOf('mainspring')],BX)};
  return JSON.stringify(out);})()
