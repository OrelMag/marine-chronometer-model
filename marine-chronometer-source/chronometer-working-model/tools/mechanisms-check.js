/* mechanisms-check.js: run in the page by mechanisms.py (?snap&qa). What the analyses of the mechanisms (ratchets.js, sustaining.js, motionwork.js, traindyn.js,
   wear.js, montecarlo.js) need from the built model and can't read off movement.js's constants:
   - each pawl on its ratchet, as the model seats it under load (the setup click on the setup ratchet, the two winding pawls on the fusee's winding ratchet, the
     sustaining pawl on the sustaining ratchet), in the ratchet's own frame (its centre the origin, mm): the profile, the locking face it bears on (its angle, the
     normal out of the tooth), the contact (where the pawl's outline lies on that face: its middle and its extent along the face), the pivot, and the pawl's mass
     and moment of inertia about its pivot from its outline and thickness (steel 7.85); the outline and the teeth round it, for the report's drawings;
   - every turning arbor's moment of inertia about its own axis, each closed solid integrated at its material's density (tetrahedra from a point on the axis, as
     massprops-check.js does), with what it carries (the hands on theirs);
   - the hands' masses and their out-of-balance (mass times the centre of mass's distance from the arbor).
   Returns JSON. */
(()=>{const mv=window.__mv,R=mv.userData.R,M=window.__M,TAU=2*Math.PI;
  const KEY=new Map(Object.entries(M).map(([k,v])=>[v,k]));
  const RHO={plate:8.5,plateSolid:8.5,gilt:8.5,brass:8.5,brass2:8.5,copper:8.5,steel:7.85,steelD:7.85,steelS:7.85,blued:7.85,blue310:7.85,giltH:8.5,bakelite:1.37,steelK:7.85,chain:7.85,chain2:7.85,mspring:7.85,ruby:3.98,clear:3.98,invar:8.05};
  const r4=x=>+(+x).toFixed(4),r2=x=>+(+x).toFixed(2),P2=p=>[r4(p[0]),r4(p[1])];
  /* ---------- pawls on ratchets ---------- */
  const tr=(pts,q,th)=>{const c=Math.cos(th),s=Math.sin(th);return pts.map(([x,z])=>[q[0]+x*c+z*s,q[1]-x*s+z*c]);};
  const dense=pts=>{const d=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/0.02));for(let k=0;k<n;k++)d.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n]);}return d;};
  /* area, centroid and polar second moment about the origin of a closed outline (Green's theorem), per unit thickness */
  const poly=pts=>{let A=0,cx=0,cz=0,J=0;for(let i=0;i<pts.length;i++){const[x0,z0]=pts[i],[x1,z1]=pts[(i+1)%pts.length],c=x0*z1-x1*z0;A+=c/2;cx+=(x0+x1)*c/6;cz+=(z0+z1)*c/6;J+=(x0*x0+x0*x1+x1*x1+z0*z0+z0*z1+z1*z1)*c/12;}return{A:Math.abs(A),cx:cx/A,cz:cz/A,J:Math.abs(J)};};
  /* where the load meets a pawl: the ratchet turned on in the way its load turns it (dir, as phaseAgainst's: +1 rotation.y rising) until its teeth first reach into
     the pawl's outline (a point at ratchet angle φ, radius ρ is inside a tooth when ρ < r(φ); turning the ratchet on by dψ moves a fixed point to φ + dir dψ). The
     points reached first are the contact (C their middle, their spread along the face its length); the normal is the profile's, out of the tooth, where a face takes
     it, or the pawl's own outline's, into the pawl, where a tooth's tip corner meets the pawl's side. gap: how far the ratchet turns at C before it touches (negative:
     the seated outline already 0.0x mm into the tooth, as drawn) */
  const inPoly=(P,x,z)=>{let w=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const[xi,zi]=P[i],[xj,zj]=P[j];if((zi>z)!==(zj>z)&&x<(xj-xi)*(z-zi)/(zj-zi)+xi)w=!w;}return w;};
  const contact=(pr,W,dir)=>{const D=dense(W).map(([x,z])=>[x,z,Math.hypot(x,z),Math.atan2(z,x)]),pen=d=>D.map(([x,z,r,a])=>pr.r(a+dir*d)-r),p0=pen(0).map(v=>Math.max(v,0));   /* p0: where the seated outline already lies a few µm into a tooth, as drawn; only a contact that grows as the ratchet turns counts */
    let d=0,hit=null;while(d<0.05){const p=pen(d);if(p.some((v,i)=>v>p0[i]+0.001)){hit=d;break;}d+=2e-5;}
    const p=pen(hit),on=D.filter((_,i)=>p[i]>p0[i]+0.001),C=[on.reduce((q,v)=>q+v[0],0)/on.length,on.reduce((q,v)=>q+v[1],0)/on.length],rC=Math.hypot(...C);
    let n,kind=undefined;if(rC>pr.ro-0.03){kind='tip corner on the pawl';let bi=0,bd=1e9;D.forEach(([x,z],i)=>{const e=Math.hypot(x-C[0],z-C[1]);if(e<bd){bd=e;bi=i;}});const a=D[(bi+D.length-3)%D.length],b=D[(bi+3)%D.length],t=[b[0]-a[0],b[1]-a[1]],l=Math.hypot(...t);
      n=[-t[1]/l,t[0]/l];if(!inPoly(W,C[0]+0.02*n[0],C[1]+0.02*n[1]))n=[-n[0],-n[1]];}
    /* the face's own normal at C: the faces are radial (ratchetProf), so the tangent, away from the side the tooth stands on; a face undercut by pr.uc (the setup
       ratchet's) turns it in toward the centre by as much, its root behind its tip, so the load draws the pawl in */
    const ang=Math.atan2(C[1],C[0]),aT=ang+dir*hit,e=0.02*pr.p,u=[-Math.sin(ang),Math.cos(ang)],nR=pr.r(aT+e)>pr.r(aT-e)?[-u[0],-u[1]]:u,uc=pr.uc||0,nF=[nR[0]*Math.cos(uc)-Math.cos(ang)*Math.sin(uc),nR[1]*Math.cos(uc)-Math.sin(ang)*Math.sin(uc)];
    if(kind===undefined){kind='on the face';n=nF;}
    const win=D.filter(([,,,a])=>Math.abs(((a-ang+3*Math.PI)%TAU)-Math.PI)<pr.p),depth=pr.ro-Math.min(...win.map(v=>v[2])),rF=pr.ro-depth/2;
    /* fit: the pawl's end cut to bear on the face over its depth in the teeth, as a fitted pawl does: the load at the face's middle there, along its normal */
    const jump=Math.abs(pr.r(aT+e)-pr.r(aT-e));   /* the profile's step at the contact: a face's (or a tip corner's) is most of the teeth's depth, a tooth's back has none */
    return{C,n,kind,gap:hit*rC,r:[Math.min(...on.map(v=>v[2])),Math.max(...on.map(v=>v[2]))],depth,b:ang,jump,dir,fit:{C:[rF*Math.cos(ang),rF*Math.sin(ang)],n:nF}};};
  /* which way the load turns the ratchet into its pawl: the way whose first contact is on a locking face or a tooth's tip corner, not on a tooth's back (turned
     the other way the backs slide under the pawl, as in winding) */
  const contactLoad=(pr,W)=>{const c=[1,-1].map(d=>contact(pr,W,d)),ok=c.filter(x=>x.jump>0.3*(pr.ro-pr.ri));return(ok.length?ok:c).sort((a,b)=>a.gap-b.gap)[0];};
  const teeth=(pr,b0)=>{const o=[];for(let a=b0-2.5*pr.p;a<=b0+2.5*pr.p;a+=pr.p/60){const r=pr.r(a);o.push([r4(r*Math.cos(a)),r4(r*Math.sin(a))]);}return o;};
  const pawl=(name,pr,z,m,rd,thick,thR,pts,Q,th,dir,spring)=>{const W=tr(pts,Q,th),c=contactLoad(pr,W),G=poly(pts),mass=G.A*thick*7.85e-3,I=G.J*thick*7.85e-3;   /* g, g·mm² about the pivot */
    return{name,z,m:r4(m),ro:r4(pr.ro),ri:r4(pr.ri),p:r4(pr.p),rd:r4(rd),thick:thR,pawlThick:thick,pivot:P2(Q),th:r4(th),dir:c.dir,face:{jump:r4(c.jump),kind:c.kind,b:r4(c.b),n:P2(c.n),gap:r4(c.gap),C:P2(c.C),r:[r4(c.r[0]),r4(c.r[1])],depth:r4(c.depth),fit:{C:P2(c.fit.C),n:P2(c.fit.n)}},
      mass:r4(mass),I:r4(I),cg:P2(tr([[G.cx,G.cz]],Q,th)[0]),outline:W.filter((_,i)=>i%Math.max(1,Math.floor(W.length/90))===0).map(P2),teeth:teeth(pr,c.b),spring};};
  const out={pawls:[]};
  { const su=R.su,psi=su.base,Qr=toWheel(su.q,[0,0],psi),thR=su.seat-psi;   /* the click's pivot and turn in the setup ratchet's frame */
    out.pawls.push(pawl('setup click',su.pr,42,su.pr.ro/(42/2+0.95),su.pr.ro-su.pr.ri,0.8,1.0,su.pts,Qr,thR,-1,{kind:'band',w:0.3,h:0.85,len:r4(1.273*7.05/1.039*174*Math.PI/180),note:'steel band on edge, half a turn round the ratchet at r 9 to the click\'s back'})); }
  for(let k=0;k<2;k++){const u=R.wp[k].userData,Q=toWheel(u.q,[0,0],R.WPH),th=seatPawl(u.pts,Q,u.th0-R.WPH,R.FPR);let len=0;for(let i=1;i<u.arc.length;i++)len+=Math.hypot(u.arc[i][0]-u.arc[i-1][0],u.arc[i][1]-u.arc[i-1][1]);
    const bk=pawlBack(u.pts,0.96,Q,th,[0,0]);out.pawls.push(pawl('winding pawl '+(k+1),R.FPR,36,R.FPR.ro/(36/2+0.95),R.FPR.ro-R.FPR.ri,0.5,0.5,u.pts,Q,th,1,{kind:'band',w:0.3,h:0.5,len:r4(len),bear:P2(bk.p),bearN:P2(bk.n),arm:0.96,note:'a long arc in its bed round the sustaining ratchet, its end on the pawl\'s arm'}));}
  { const sp=R.spawl,pts=sp.userData.pts,SPv=[sp.position.x,sp.position.z],Fu=[R.ssg.position.x,R.ssg.position.z],q=[SPv[0]-Fu[0],SPv[1]-Fu[1]],psi=((R.holdBack(0)%R.SRP.p)+R.SRP.p)%R.SRP.p,
      Q=toWheel(q,[0,0],psi),th=seatPawl(pts,Q,sp.userData.base-psi,R.SRP);
    out.pawls.push(pawl('sustaining pawl',R.SRP,120,R.SRP.ro/(120/2+0.95),R.SRP.ro-R.SRP.ri,0.6,0.7,pts,Q,th,-1,{kind:'wire',r:0.12,len:r4(Math.abs(-20.66-1.0+9.75)),preTurn:0.12,foot:[-2.0,1.7],note:'a straight steel wire upright from the pawl\'s root to a hole in the train bridge, set 0.12 rad further in'})); }
  /* ---------- arbors' moments of inertia about their own axes ---------- */
  mv.updateMatrixWorld(true);const toMv=new THREE.Matrix4().copy(mv.matrixWorld).invert(),A=new THREE.Vector3(),B=new THREE.Vector3(),C=new THREE.Vector3();
  const shown=o=>{for(let p=o;p&&p!==mv;p=p.parent)if(!p.visible)return false;return true;};
  const weigh=(groups,ax,all)=>{let m=0,I=0,sx=0,sz=0;const miss={};   /* all: hidden pieces too (the winding key, shown only while winding) */
    for(const g of groups)g.traverse(o=>{if(!o.isMesh||!o.geometry||o.userData.decal||o.userData.surface||(!all&&!shown(o)))return;let key=KEY.get(o.material)||'?';const rho=RHO[key];if(rho==null){miss[key]=(miss[key]||0)+1;return;}
      const T=toMv.clone().multiply(o.matrixWorld),P=o.geometry.attributes.position,X=o.geometry.index,n=X?X.count:P.count;
      for(let k=0;k+2<n;k+=3){A.fromBufferAttribute(P,X?X.getX(k):k).applyMatrix4(T);B.fromBufferAttribute(P,X?X.getX(k+1):k+1).applyMatrix4(T);C.fromBufferAttribute(P,X?X.getX(k+2):k+2).applyMatrix4(T);
        for(const v of[A,B,C]){v.x-=ax[0];v.z-=ax[1];}
        const v=A.dot(B.clone().cross(C))/6,a=[A.x,A.z],b=[B.x,B.z],c=[C.x,C.z],q=[a[0]+b[0]+c[0],a[1]+b[1]+c[1]];let S=0;for(let i=0;i<2;i++)S+=(a[i]*a[i]+b[i]*b[i]+c[i]*c[i]+q[i]*q[i])/20;
        m+=v*rho;I+=v*rho*S;sx+=v*rho*q[0]/4;sz+=v*rho*q[1]/4;}});
    return{m:r4(m/1000),I:r4(I/1000),off:r4(Math.hypot(sx,sz)/Math.max(m,1e-9)),missing:miss};};   /* g, g·mm², the centre of mass's distance from the axis (mm) */
  const LL=L;out.arbors={escape:weigh([R.esc],LL.E),fourth:weigh([R.fw],LL.F),secondsHand:weigh([R.sec],LL.F),third:weigh([R.tw],LL.T),centre:weigh([R.cw],LL.C),
    cannon:weigh([R.cannon],LL.C),minuteHand:weigh([R.min],LL.C),minuteWheel:weigh([R.minW],LL.Mw),hourWheel:weigh([R.hourW],LL.C),hourHand:weigh([R.hour],LL.C),
    fuseeWheel:weigh([R.gw],LL.Fu),sspring:weigh([R.ssg],LL.Fu),sratchet:weigh([R.sr],LL.Fu),balance:weigh([R.staff],LL.B)};
  { let bz=null;R.fs.g.traverse(o=>{if(o.userData.partName==='barrel'&&!bz)bz=o;});out.arbors.fusee=weigh([R.fs.fz],LL.Fu);out.arbors.square=weigh([R.sq],LL.Fu,true);out.arbors.barrel=weigh([bz],LL.Ba); }   /* the fusee (with its winding ratchet and stop-bar), the arbor's square and the winding key on it, the barrel; the mainspring isn't built until shown */
  out.L={E:LL.E,F:LL.F,T:LL.T,C:LL.C,Fu:LL.Fu,Mw:LL.Mw,B:LL.B,Ba:LL.Ba};
  return JSON.stringify(out);})()
