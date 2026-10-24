// @ts-check
/* kit.js: the pieces a movement is built from, shared by the models (the Wempe's movement.js; the Hamilton keeps its own copies in its movement.js, which
   these were copied from on 14 October 2026, unchanged). Declares only KIT:
   - KIT.parts(mv, M): the part and screw makers of the Hamilton's buildMovement, for another movement group mv: part(name, off, ef) a part's group (its key as
     userData.partName, off its rise in the Exploded view, ef [x, z, turn] a frame inside it, returned), screw(p, x, z, y, r, h, len, rs) a fillister-headed screw
     seated at y in frame p (head toward -y, shank toward +y), loose(g, lift) a piece the Exploded view lifts on its own, headOn(g, p, q) a screw of part p put in
     through part q, SCREWS the screws and loose pieces, parts the parts by key, and done() the API the page and the tools read (mv.userData.parts, lifted,
     explode). Every userData field (off, partName, ef, y0, lift, sc, screw) is the Hamilton's, which tools/audit.py, exploded.py and bom.py read.
   - the plan helpers (outlines in the movement's plan [x, z], mm, and the solids made from them): subtractCircle, hull, hullSplice, crescent, twoCircles,
     lobedCircle, clipPoly, clipUnder, discClip, stepGeo, cbGeo, checkHoles, polyGeo, stadiumPts, stadium, barBossPts, stripGeo, sdfOutline, and the screw holes'
     radii sR, hC (clearance), hT (tapped). Each keeps its comment from movement.js. They use core.js (TAU, clamp, extrude, mesh, STRIPE_ANGLE). */
const KIT=(()=>{
  /* polygon minus a circle that crosses its boundary: keep the part outside the circle, close it with the arc that runs through the polygon.
     uni: the union instead, closed with the arc that runs outside the polygon */
  function subtractCircle(poly,c,r,uni){
    const dense=[];for(let k=0;k<poly.length;k++){const a=poly[k],b=poly[(k+1)%poly.length],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/0.25));for(let t=0;t<n;t++)dense.push([a[0]+(b[0]-a[0])*t/n,a[1]+(b[1]-a[1])*t/n]);}
    const ins=p=>Math.hypot(p[0]-c[0],p[1]-c[1])<r,N=dense.length;
    let s0=-1;for(let k=0;k<N;k++)if(!ins(dense[k])&&ins(dense[(k+N-1)%N])){s0=k;break;}
    if(s0<0)return dense;                       /* circle does not cross the boundary */
    const run=[];let k=s0;while(!ins(dense[k%N])&&run.length<N){run.push(dense[k%N]);k++;}
    const aOf=p=>Math.atan2(p[1]-c[1],p[0]-c[0]),aE=aOf(run[run.length-1]),aS=aOf(run[0]);
    const inPoly=p=>{let w=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const[xi,zi]=poly[i],[xj,zj]=poly[j];if((zi>p[1])!==(zj>p[1])&&p[0]<(xj-xi)*(p[1]-zi)/(zj-zi)+xi)w=!w;}return w;};
    let d=((aS-aE)%TAU+TAU)%TAU;const mid=aE+d/2;if(inPoly([c[0]+r*Math.cos(mid),c[1]+r*Math.sin(mid)])===!!uni)d=d-TAU;
    const n=Math.ceil(Math.abs(d)/0.03);for(let q=1;q<n;q++){const a=aE+d*q/n;run.push([c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)]);}
    return run;
  }
  /* convex hull of points (Andrew's monotone chain) */
  function hull(P){P=[...P].sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),h=[];
    for(const s of[P,[...P].reverse()]){const k=h.length;for(const p of s){while(h.length>=k+2&&cr(h[h.length-2],h[h.length-1],p)<=0)h.pop();h.push(p);}h.pop();}return h;}
  /* outline with its stretch from point i0 to point i1 replaced by the outer side of the hull of those two points and pts (the longer way round the hull) */
  function hullSplice(poly,i0,i1,pts){const H=hull([poly[i0],...pts,poly[i1]]),n=H.length,a=H.indexOf(poly[i0]),b=H.indexOf(poly[i1]);
    const run=d=>{const r=[];for(let k=a;;k=(k+d+n)%n){r.push(H[k]);if(k===b)break;}return r;},len=r=>r.reduce((s,p,i)=>i?s+Math.hypot(p[0]-r[i-1][0],p[1]-r[i-1][1]):0,0),f=run(1),g=run(-1);
    return[...poly.slice(0,i0),...(len(f)>len(g)?f:g),...poly.slice(i1+1)];}
  /* the upper train bridge's outline (Figs. 29, 67, 110): the disc of radius R less the cut round the barrel (circle bc, br) and the notch round the fusee,
     whose edge e (a polyline) starts outside the rim and ends inside the barrel's cut. The rim runs from the notch's mouth (angle rising) to where the barrel's
     cut meets it, the cut's arc back toward the plate's centre to where the edge enters it, and the edge back to the mouth */
  function crescent(R,bc,br,e){
    const hit=(p,q,f)=>{let a=0,b=1;for(let i=0;i<40;i++){const m=(a+b)/2;(f([p[0]+(q[0]-p[0])*m,p[1]+(q[1]-p[1])*m])>0)===(f(p)>0)?a=m:b=m;}return[p[0]+(q[0]-p[0])*a,p[1]+(q[1]-p[1])*a];};
    const fR=x=>Math.hypot(...x)-R,fB=x=>Math.hypot(x[0]-bc[0],x[1]-bc[1])-br,ang=(x,c=[0,0])=>Math.atan2(x[1]-c[1],x[0]-c[0]);
    let i0=0;while(fR(e[i0+1])>0)i0++;const M=hit(e[i0],e[i0+1],fR);
    let i1=i0+1;while(fB(e[i1])>0)i1++;const H=hit(e[i1-1],e[i1],fB);
    /* the rim and the barrel's cut meet where x = -(R²+|bc|²-br²)/(2|bc|) along bc; the meeting on the side the rim reaches first */
    const d=Math.hypot(...bc),u=[bc[0]/d,bc[1]/d],a=(R*R+d*d-br*br)/(2*d),h=Math.sqrt(R*R-a*a),J=[[u[0]*a-u[1]*h,u[1]*a+u[0]*h],[u[0]*a+u[1]*h,u[1]*a-u[0]*h]];
    const aM=ang(M),up=x=>((ang(x)-aM)%TAU+TAU)%TAU,Jr=up(J[0])<up(J[1])?J[0]:J[1],out=[];
    const n1=Math.ceil(up(Jr)/0.02);for(let k=0;k<=n1;k++){const t=aM+up(Jr)*k/n1;out.push([R*Math.cos(t),R*Math.sin(t)]);}
    let b0=ang(Jr,bc),b1=ang(H,bc);const db=((b1-b0)%TAU+TAU)%TAU-TAU;   /* the short way round the cut, toward the plate's centre */
    const n2=Math.ceil(-db/0.02);for(let k=1;k<=n2;k++){const t=b0+db*k/n2;out.push([bc[0]+br*Math.cos(t),bc[1]+br*Math.sin(t)]);}
    for(let k=i1-1;k>i0;k--)out.push(e[k]);return out;}
  /* the outline of two overlapping circles (a keyhole): each circle's arc outside the other */
  function twoCircles(c1,r1,c2,r2){
    const d=Math.hypot(c2[0]-c1[0],c2[1]-c1[1]),a1=Math.atan2(c2[1]-c1[1],c2[0]-c1[0]),h1=Math.acos((r1*r1+d*d-r2*r2)/(2*r1*d)),h2=Math.acos((r2*r2+d*d-r1*r1)/(2*r2*d)),o=[];
    for(let k=0;k<=80;k++){const t=a1+h1+(TAU-2*h1)*k/80;o.push([c1[0]+r1*Math.cos(t),c1[1]+r1*Math.sin(t)]);}
    for(let k=1;k<40;k++){const t=a1+Math.PI+h2+(TAU-2*h2)*k/40;o.push([c2[0]+r2*Math.cos(t),c2[1]+r2*Math.sin(t)]);}return o;}
  /* the outline of a circle with smaller circles [x, z, r] overlapping its rim, apart from one another (a keyhole of several lobes): its arcs between them, then each one's arc outside it */
  function lobedCircle(c,r,lobes){
    const Lb=lobes.map(([x,z,r2])=>{const d=Math.hypot(x-c[0],z-c[1]);return{x,z,r2,a:Math.atan2(z-c[1],x-c[0]),h1:Math.acos((r*r+d*d-r2*r2)/(2*r*d)),h2:Math.acos((r2*r2+d*d-r*r)/(2*r2*d))};}).sort((p,q)=>p.a-q.a),o=[];
    Lb.forEach((l,i)=>{const n=Lb[(i+1)%Lb.length],a0=l.a+l.h1;let a1=n.a-n.h1;while(a1<=a0)a1+=TAU;const N=Math.max(2,Math.ceil((a1-a0)/TAU*120));
      for(let k=0;k<=N;k++){const t=a0+(a1-a0)*k/N;o.push([c[0]+r*Math.cos(t),c[1]+r*Math.sin(t)]);}
      const M_=Math.max(8,Math.ceil(n.r2*12));for(let k=1;k<M_;k++){const t=n.a+Math.PI+n.h2+(TAU-2*n.h2)*k/M_;o.push([n.x+n.r2*Math.cos(t),n.z+n.r2*Math.sin(t)]);}});return o;}
  /* polygon clipped to where f(p) >= 0 (f continuous; exact for a half-plane, to the edges' length for anything else) */
  function clipPoly(poly,f){const out=[];
    for(let i=0;i<poly.length;i++){const P0=poly[i],P1=poly[(i+1)%poly.length],f0=f(P0),f1=f(P1);
      if(f0>=0)out.push(P0);if((f0>=0)!==(f1>=0)){const t=f0/(f0-f1);out.push([P0[0]+(P1[0]-P0[0])*t,P0[1]+(P1[1]-P0[1])*t]);}}
    return out;}
  /* polygon clipped to z <= e(x) wherever x >= x0, e a polyline [[x, z], ...] with x rising (held level past its ends): the cut follows e between the crossings */
  function clipUnder(poly,E,x0){const e=x=>{if(x<=E[0][0])return E[0][1];for(let k=1;k<E.length;k++)if(x<=E[k][0])return E[k-1][1]+(E[k][1]-E[k-1][1])*(x-E[k-1][0])/(E[k][0]-E[k-1][0]);return E[E.length-1][1];};
    const f=p=>p[0]<x0?1:e(p[0])-p[1],s=poly.findIndex(p=>f(p)>=0),P=[...poly.slice(s),...poly.slice(0,s)],out=[];let A=null;
    for(let i=0;i<P.length;i++){const P0=P[i],P1=P[(i+1)%P.length],f0=f(P0),f1=f(P1);if(f0>=0)out.push(P0);
      if((f0>=0)!==(f1>=0)){const t=f0/(f0-f1),X=[P0[0]+(P1[0]-P0[0])*t,P0[1]+(P1[1]-P0[1])*t];
        if(f0>=0){A=X;out.push(X);}else{const B=X,q=E.filter(v=>(v[0]-A[0])*(v[0]-B[0])<0);if(A[0]>B[0])q.reverse();out.push(...q,B);}}}
    return out;}
  /* polygon of a disc clipped by half-planes z*s > a + b*x  (s=+1 keeps above the line, -1 below) */
  function discClip(R,cuts,N=160){
    let poly=[];for(let i=0;i<N;i++){const a=i/N*TAU;poly.push([R*Math.cos(a),R*Math.sin(a)]);}
    for(const[a,b,s]of cuts)poly=clipPoly(poly,p=>s*(p[1]-(a+b*p[0])));
    return poly;
  }
  /* a solid in three depths, closed and facing out (like polyGeo, unbevelled): the outline at the top (y 0); the part of it outside the circle (c, r) down to tB (the
     body), with the step's wall on that circle's arc; the rest (the arm) down to tA on c's side of the line through sp.p and sp.q and to sp.t beyond it, with the step's
     wall along that line (sp {p, q, t}; without it the arm is tA throughout). Depths toward +y. Holes [x,z,r]: through tA in the arm (on c's side of the line), through
     tB in the body; a hole [x,z,r,rc,dc] is counterbored rc to dc. UVs: the top's in plan, as ExtrudeGeometry gives them, so the plate's stripes lie as on the other
     plates; the walls' along one ridge (below) */
  function stepGeo(out,c,r,tA,tB,holes,sp){
    const d=p=>Math.hypot(p[0]-c[0],p[1]-c[1]),tM=sp?sp.t:tA;
    const sd=sp?(()=>{const u=[sp.q[0]-sp.p[0],sp.q[1]-sp.p[1]],l=Math.hypot(...u),nn=[-u[1]/l,u[0]/l],f=p=>(p[0]-sp.p[0])*nn[0]+(p[1]-sp.p[1])*nn[1],s=Math.sign(f(c));return p=>-s*f(p);})():()=>-1;   /* sd > 0 beyond the line from c */
    const O=[];for(let k=0;k<out.length;k++){const a=out[k],b=out[(k+1)%out.length];O.push(a);const X=/** @type {any[]} */([]);   /* the outline, with the points where it crosses the circle (lv 0) and the line (lv 1): [u, point, lv] */
      if((d(a)<r)!==(d(b)<r)){let u=0,v=1;for(let i=0;i<40;i++){const w=(u+v)/2,q=[a[0]+(b[0]-a[0])*w,a[1]+(b[1]-a[1])*w];(d(q)<r)===(d(a)<r)?u=w:v=w;}X.push([u,[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u],0]);}
      if(sp&&(sd(a)>0)!==(sd(b)>0)){const u=sd(a)/(sd(a)-sd(b));X.push([u,[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u],1]);}
      X.sort((x,y)=>x[0]-y[0]).forEach(([,q,j])=>{q.lv=j;O.push(q);});}
    const n=O.length,X0=O.map((p,i)=>p.lv===0?i:-1).filter(i=>i>=0);if(X0.length!==2)console.error('stepGeo: the circle crosses the outline '+X0.length+' times');
    const chain=(i,j)=>{const q=[];for(let k=i;;k=(k+1)%n){q.push(O[k]);if(k===j)break;}return q;},[i0,i1]=X0,inA=d(O[(i0+1)%n])<r;
    const A=inA?chain(i0,i1):chain(i1,i0),B=inA?chain(i1,i0):chain(i0,i1);   /* A: the stretch inside the circle (the arm), from crossing to crossing; B: the rest */
    const ins=p=>{let w=false;for(let i=0,j=O.length-1;i<O.length;j=i++){const[xi,zi]=O[i],[xj,zj]=O[j];if((zi>p[1])!==(zj>p[1])&&p[0]<(xj-xi)*(p[1]-zi)/(zj-zi)+xi)w=!w;}return w;};
    const L1=A.map((p,i)=>p.lv===1?i:-1).filter(i=>i>=0);if(sp&&L1.length!==2)console.error('stepGeo: the line crosses the arm '+L1.length+' times');
    const[ka,kb]=sp?L1:[0,A.length-1];   /* A[ka..kb]: the arm's thin part, on c's side of the line; before and after it, the thick part */
    const arc=(R,p,q)=>{const a0=Math.atan2(p[1]-c[1],p[0]-c[0]);let da=Math.atan2(q[1]-c[1],q[0]-c[0])-a0;da=((da%TAU)+TAU)%TAU;const mid=a0+da/2;if(!ins([c[0]+R*Math.cos(mid),c[1]+R*Math.sin(mid)]))da-=TAU;   /* from p round to q inside the outline, ends left out */
      const na=Math.max(2,Math.ceil(Math.abs(da)*R/0.25)),o=[];for(let k=1;k<na;k++){const t=a0+da*k/na;o.push([c[0]+R*Math.cos(t),c[1]+R*Math.sin(t)]);}return o;};
    const ARC=arc(r,A[A.length-1],A[0]);   /* the circle's arc across the arm, from its outer crossing back to its inner one */
    const BP=[...B,...ARC.slice().reverse()];   /* the body's foot */
    const circ=(x,z,rr)=>{const k=Math.max(16,Math.ceil(TAU*rr/0.2)),q=[];for(let i=0;i<k;i++){const t=i/k*TAU;q.push([x+rr*Math.cos(t),z+rr*Math.sin(t)]);}return q;};
    const hA=holes.filter(h=>d(h)<r),hB=holes.filter(h=>d(h)>=r),P=[],U=[];hA.forEach(h=>{if(sd(h)>-h[2])console.warn('stepGeo: a hole in the thick part of the arm');});
    const tri=(a,b,e,ua,ub,ue)=>{P.push(...a,...b,...e);U.push(...ua,...ub,...ue);};
    const face=(poly,hs,y,up,uv=p=>[p[0],-p[1]])=>{const V=v=>new THREE.Vector2(v[0],v[1]),T=THREE.ShapeUtils.triangulateShape(poly.map(V),hs.map(h=>h.map(V))),all=[...poly,...hs.flat()];   /* up: faces -y (the top) */
      for(const[i,j,k]of T){const[a,b,e]=[all[i],all[j],all[k]],cr=(b[0]-a[0])*(e[1]-a[1])-(b[1]-a[1])*(e[0]-a[0]),f=(cr>0)===up?[a,b,e]:[a,e,b];
        tri(...f.map(p=>[p[0],y,p[1]]),...f.map(uv));}};   /* uv: the stripes' mapping (the top's), or uw: plain polished */
    const rc=Math.cos(STRIPE_ANGLE),rs=Math.sin(STRIPE_ANGLE),uw=p=>{const t=p[0]*rc-p[1]*rs;return[-rs*38.75+t*rc,rc*38.75+t*rs];},pol=p=>[-rs*38.75+p[0]*1e-3,rc*38.75+p[1]*1e-3];   /* pol: a face polished all over, the stripes' map read at one crest (a 2-D patch of it: a 1-D map leaves the normal map's tangents undefined) */   /* walls: along one ridge's crest of the stripes (38.75 mm across them), so they read polished, as the cock's are */
    const wall=(p,q,y0,y1,outward)=>{const[a,b]=outward?[p,q]:[q,p],ua=uw(a),ub=uw(b);   /* a quad p->q from y0 down to y1, its normal (dz, -dx) of p->q when outward */
      const A0=[a[0],y0,a[1]],B0=[b[0],y0,b[1]],A1=[a[0],y1,a[1]],B1=[b[0],y1,b[1]];
      tri(A0,A1,B1,ua,ua,ub);tri(A0,B1,B0,ua,ub,ub);};
    const cw=THREE.ShapeUtils.area(O.map(v=>new THREE.Vector2(v[0],v[1])))<0,loop=(L,f)=>{for(let k=0;k<L.length;k++)f(L[k],L[(k+1)%L.length]);};
    const cbr=h=>h[3]?circ(h[0],h[1],h[3]):circ(h[0],h[1],h[2]);
    face(O,[...hA.map(cbr),...hB.map(cbr)],0,true);face(BP,hB.map(h=>circ(...h)),tB,false);
    face(A.slice(ka,kb+1),hA.map(h=>circ(...h)),tA,false,pol);   /* the arm's underside, plain (the video's undersides are): its thin part, */
    if(sp)face([...A.slice(0,ka+1),...A.slice(kb),...ARC],[],tM,false,pol);   /* and its thick part, out to the body */
    for(const h of[...hA,...hB].filter(h=>h[3])){const R=circ(h[0],h[1],h[3]),I=circ(h[0],h[1],h[2]),F=[...R];face(F,[I],h[4],true);}   /* the counterbore's floor (in the arm or the body) */
    for(let k=0;k<A.length-1;k++){wall(A[k],A[k+1],0,tA,!cw);if(sp&&(k<ka||k>=kb))wall(A[k],A[k+1],tA,tM,!cw);}   /* the arm's edge, down to its underside, split at tA where the step meets it */
    for(let k=0;k<B.length-1;k++){wall(B[k],B[k+1],0,tA,!cw);if(sp)wall(B[k],B[k+1],tA,tM,!cw);wall(B[k],B[k+1],tM,tB,!cw);}   /* the body's, split where the arm's undersides meet it */
    const Arc=[A[A.length-1],...ARC,A[0]];for(let k=0;k<Arc.length-1;k++)wall(Arc[k],Arc[k+1],tM,tB,cw);   /* the step under the arm */
    if(sp){const p=A[ka],q=A[kb],m=[(p[0]+q[0])/2-c[0],(p[1]+q[1])/2-c[1]];wall(p,q,tA,tM,(q[1]-p[1])*-m[0]+(p[0]-q[0])*-m[1]>0);}   /* the step along the line, facing c */
    const hole=(L,y0,y1)=>{const ccw=THREE.ShapeUtils.area(L.map(v=>new THREE.Vector2(v[0],v[1])))>0;loop(L,(p,q)=>wall(p,q,y0,y1,!ccw));};   /* faces into the hole */
    for(const h of hA)if(h[3]){hole(circ(h[0],h[1],h[3]),0,h[4]);hole(circ(h[0],h[1],h[2]),h[4],tA);}else hole(circ(...h),0,tA);for(const h of hB)if(h[3]){hole(circ(h[0],h[1],h[3]),0,h[4]);hole(circ(h[0],h[1],h[2]),h[4],tB);}else hole(circ(...h),0,tB);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.computeVertexNormals();return g;}
  /* a plate th thick with counterbored holes, closed and facing out (as stepGeo builds it): top at y 0, depth toward +y; holes [x,z,r], or [x,z,r,rc,dc] counterbored rc to dc */
  function cbGeo(out,th,holes){const P=[],U=[],V=v=>new THREE.Vector2(v[0],v[1]),tri=(...f)=>{for(const p of f){P.push(...p);U.push(p[0],-p[2]);}};
    const circ=(x,z,r)=>{const k=Math.max(24,Math.ceil(TAU*r/0.1)),q=[];for(let i=0;i<k;i++){const t=i/k*TAU;q.push([x+r*Math.cos(t),z+r*Math.sin(t)]);}return q;};
    const face=(poly,hs,y,up)=>{const T=THREE.ShapeUtils.triangulateShape(poly.map(V),hs.map(h=>h.map(V))),all=[...poly,...hs.flat()];   /* up: faces -y (the top) */
      for(const[i,j,k]of T){const[a,b,e]=[all[i],all[j],all[k]],cr=(b[0]-a[0])*(e[1]-a[1])-(b[1]-a[1])*(e[0]-a[0]),f=(cr>0)===up?[a,b,e]:[a,e,b];tri(...f.map(p=>[p[0],y,p[1]]));}};
    const wall=(L,y0,y1,outward)=>{const ccw=THREE.ShapeUtils.area(L.map(V))>0;for(let k=0;k<L.length;k++){const[a,b]=(ccw===outward)?[L[k],L[(k+1)%L.length]]:[L[(k+1)%L.length],L[k]];
      tri([a[0],y0,a[1]],[a[0],y1,a[1]],[b[0],y1,b[1]]);tri([a[0],y0,a[1]],[b[0],y1,b[1]],[b[0],y0,b[1]]);}};   /* outward: facing out of the loop, else into it */
    const I=holes.map(h=>circ(h[0],h[1],h[2])),C=holes.map(h=>h[3]?circ(h[0],h[1],h[3]):null);
    face(out,holes.map((h,i)=>C[i]||I[i]),0,true);face(out,I,th,false);wall(out,0,th,true);
    holes.forEach((h,i)=>{if(C[i]){face(C[i],[I[i]],h[4],true);wall(C[i],0,h[4],false);wall(I[i],h[4],th,false);}else wall(I[i],0,th,false);});
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.computeVertexNormals();return g;}
  /* a hole that crosses the outline or overlaps another hole silently breaks the triangulation: report it */
  function checkHoles(tag,holes,inside){holes.forEach(([x,z,r],i)=>{if(inside(x,z)<r+0.05)console.warn(tag+': hole at '+x.toFixed(2)+','+z.toFixed(2)+' r'+r+' crosses the outline');
    holes.forEach(([x2,z2,r2],j)=>{if(j>i&&Math.hypot(x-x2,z-z2)<r+r2+0.05)console.warn(tag+': holes at '+x.toFixed(2)+','+z.toFixed(2)+' and '+x2.toFixed(2)+','+z2.toFixed(2)+' overlap');});});}
  function polyGeo(pts,th,holes=[],bev=0){const polyH=holes.filter(h=>h.pts);holes=holes.filter(h=>!h.pts);   /* holes: circles [x,z,r], or {pts} outlines */
    checkHoles('polyGeo',holes,(x,z)=>{let d=1e9;for(let k=0;k<pts.length;k++){const[ax,az]=pts[k],[bx,bz]=pts[(k+1)%pts.length],l2=(bx-ax)**2+(bz-az)**2,t=l2?clamp(((x-ax)*(bx-ax)+(z-az)*(bz-az))/l2,0,1):0;d=Math.min(d,Math.hypot(x-ax-t*(bx-ax),z-az-t*(bz-az)));}return d-bev;});
    /* the outline and its holes go to ExtrudeGeometry clockwise: given a counterclockwise outline it reverses it and turns the holes counterclockwise, and holes wound
       against the outline are bevelled outward, 0.8·bev wider at the faces (the cock, traced the other way round, had its screw holes wider than the heads over them) */
    const cwise=v=>(THREE.ShapeUtils.isClockWise(v)?v:v.reverse()),s=new THREE.Shape();cwise(pts.map(([x,z])=>new THREE.Vector2(x,-z))).forEach((q,i)=>i?s.lineTo(q.x,q.y):s.moveTo(q.x,q.y));s.closePath();
    /* the bevel narrows every hole by 0.8·bev at both faces; a screw hole (4th element set) is drawn that much larger, so it has its size at the faces and a thread fits it */
    for(const[hx,hz,hr,sc]of holes){const h=new THREE.Path();h.absarc(hx,-hz,hr+(sc?bev*0.8:0),0,TAU,true);s.holes.push(h);}
    for(const{pts:hp}of polyH){const h=new THREE.Path();cwise(hp.map(([x,z])=>new THREE.Vector2(x,-z))).forEach((q,i)=>i?h.lineTo(q.x,q.y):h.moveTo(q.x,q.y));h.closePath();s.holes.push(h);}
    const g=extrude(s,{depth:th-2*bev,bevelEnabled:bev>0,bevelThickness:bev,bevelSize:bev*0.8,bevelOffset:-bev*0.8,bevelSegments:1,curveSegments:32});g.rotateX(-Math.PI/2);g.translate(0,bev,0);return g;}
  function stadiumPts(p0,p1,w){const dx=p1[0]-p0[0],dz=p1[1]-p0[1],l=Math.hypot(dx,dz),nx=-dz/l*w/2,nz=dx/l*w/2,pts=[];
    const a0=Math.atan2(nz,nx);for(let i=0;i<=16;i++){const a=a0+Math.PI*i/16;pts.push([p0[0]+w/2*Math.cos(a),p0[1]+w/2*Math.sin(a)]);}
    for(let i=0;i<=16;i++){const a=a0+Math.PI+Math.PI*i/16;pts.push([p1[0]+w/2*Math.cos(a),p1[1]+w/2*Math.sin(a)]);}return pts;}
  function stadium(p0,p1,w,th,holes=[]){return polyGeo(stadiumPts(p0,p1,w),th,holes);}
  /* a straight bar w wide and l long overall (round ends) along the unit u through c, with a round boss of radius r at c */
  function barBossPts(c,u,l,w,r){const v=[-u[1],u[0]],P=(t,n)=>[c[0]+t*u[0]+n*v[0],c[1]+t*u[1]+n*v[1]],t0=l/2-w/2,a=Math.atan2(w/2,Math.sqrt(r*r-w*w/4)),o=[],arc=(ct,rr,f0,f1,N)=>{for(let k=0;k<=N;k++){const f=f0+(f1-f0)*k/N;o.push(P(ct+rr*Math.cos(f),rr*Math.sin(f)));}};
    arc(t0,w/2,-Math.PI/2,Math.PI/2,16);arc(0,r,a,Math.PI-a,40);arc(-t0,w/2,Math.PI/2,1.5*Math.PI,16);arc(0,r,Math.PI+a,TAU-a,40);return o;}

  /* screw holes: thread radius sR for a head of radius r; a clearance hole (hC) where the screw passes through a part, a tapped hole (hT) where it screws in; [x, z, r, 1] as polyGeo takes (the 1: polyGeo keeps its size at the faces, below) */
  const sR=r=>r*0.5,hC=(x,z,r,rs=sR(r))=>[x,z,+(rs*1.12+0.01).toFixed(3),1],hT=(x,z,r,rs=sR(r))=>[x,z,+(rs+0.02).toFixed(3),1];   /* rs: a thread radius other than half the head's */
  /* flat spring: a strip w wide along a polyline in XZ, th tall from y 0 up (+y) */
  function stripGeo(pts,w,th){const L2=[],R2=[];pts.forEach((p,i)=>{const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz);
    L2.push([p[0]-dz/l*w/2,p[1]+dx/l*w/2]);R2.push([p[0]+dz/l*w/2,p[1]-dx/l*w/2]);});return polyGeo(L2.concat(R2.reverse()),th);}
  /* outline of the region where f(x, z) < 0 inside a box, by marching squares on an h grid (each crossing on its cell edge, a saddle split by the cell's centre):
     the longest loop, thinned to within 0.004 mm (Ramer-Douglas-Peucker); the fine grid is worked only near the boundary. For parts drawn as bars joined by fillets: f a union of distances (smooth where filleted) */
  function sdfOutline(f,x0,z0,x1,z1,h){const G=8,nX=Math.ceil((x1-x0)/h/G),nZ=Math.ceil((z1-z0)/h/G),nx=nX*G,nz=nZ*G,W=nx+1,V=new Float64Array(W*(nz+1)),C=new Float64Array((nX+1)*(nZ+1)),far=0.75*G*h;
    for(let J=0;J<=nZ;J++)for(let I=0;I<=nX;I++)C[J*(nX+1)+I]=f(x0+I*G*h,z0+J*G*h);   /* a coarse grid G cells to one: a coarse cell whose corners are all farther than far from the boundary, on one side, is all on that side (f no steeper than a distance) */
    for(let j=0;j<=nz;j++)for(let i=0;i<=nx;i++){const I=Math.min(nX-1,(i/G)|0),J=Math.min(nZ-1,(j/G)|0),k=J*(nX+1)+I,a=C[k],b=C[k+1],c=C[k+nX+1],d=C[k+nX+2];
      V[j*W+i]=(a>far&&b>far&&c>far&&d>far?far:a<-far&&b<-far&&c<-far&&d<-far?-far:f(x0+i*h,z0+j*h))||1e-9;}
    const P=new Map(),adj=new Map(),key=(i,j,e)=>{const k=(j*W+i)*2+e;if(!P.has(k)){const a=V[j*W+i],b=e?V[(j+1)*W+i]:V[j*W+i+1],t=a/(a-b);P.set(k,e?[x0+i*h,z0+(j+t)*h]:[x0+(i+t)*h,z0+j*h]);}return k;},
      link=(p,q)=>{for(const[u,w]of[[p,q],[q,p]]){if(!adj.has(u))adj.set(u,[]);adj.get(u).push(w);}};
    for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){const a=V[j*W+i]<0,b=V[j*W+i+1]<0,c=V[(j+1)*W+i+1]<0,d=V[(j+1)*W+i]<0,E=[];
      if(a!==b)E.push(key(i,j,0));if(b!==c)E.push(key(i+1,j,1));if(d!==c)E.push(key(i,j+1,0));if(a!==d)E.push(key(i,j,1));
      if(E.length===2)link(E[0],E[1]);else if(E.length===4){const m=(V[j*W+i]+V[j*W+i+1]+V[(j+1)*W+i+1]+V[(j+1)*W+i])/4<0;   /* E: bottom, right, top, left */
        if(a===m){link(E[0],E[1]);link(E[2],E[3]);}else{link(E[3],E[0]);link(E[1],E[2]);}}}
    const seen=new Set();let best=[];for(const s of adj.keys()){if(seen.has(s))continue;const loop=[];let p=null,q=s;
      while(q!==undefined&&!seen.has(q)){seen.add(q);loop.push(P.get(q));const n=adj.get(q),r=n[0]===p?n[1]:n[0];p=q;q=r;}if(loop.length>best.length)best=loop;}
    const rdp=(Q,t)=>{if(Q.length<3)return Q;const[A,B]=[Q[0],Q[Q.length-1]],dx=B[0]-A[0],dz=B[1]-A[1],l=Math.hypot(dx,dz)||1e-9;let m=0,k=0;
      for(let i=1;i<Q.length-1;i++){const e=Math.abs((Q[i][0]-A[0])*dz-(Q[i][1]-A[1])*dx)/l;if(e>m){m=e;k=i;}}return m>t?[...rdp(Q.slice(0,k+1),t).slice(0,-1),...rdp(Q.slice(k),t)]:[A,B];};
    const h2=best.length>>1;return[...rdp(best.slice(0,h2+1),0.004).slice(0,-1),...rdp([...best.slice(h2),best[0]],0.004).slice(0,-1)];}
  /* ---------- solids in depth bands (added 14 October 2026 for the Wempe's frame; the Hamilton doesn't use them) ----------
     Plan outlines are [x, z] point lists (either winding). ring(x, z, r, n, ph): a circle's points, about 0.1 mm apart (n of them if given, turned ph of a step); area: the signed area (+ counterclockwise in x, z);
     cen: the centroid; pip: point in polygon. bool(A, B): two simple polygons in general position, their crossings put into both (the same point objects, so outlines built
     from the results share their vertices exactly): {A2, B2, uni (A and B joined), dAB (A less B), dBA (B less A)}, each a list of loops */
  const area=P=>{let a=0;for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length];a+=p[0]*q[1]-q[0]*p[1];}return a/2;};
  const cen=P=>{let a=0,x=0,z=0;for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length],c=p[0]*q[1]-q[0]*p[1];a+=c;x+=(p[0]+q[0])*c;z+=(p[1]+q[1])*c;}return[x/(3*a),z/(3*a)];};
  const pip=(p,P)=>{let w=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const[xi,zi]=P[i],[xj,zj]=P[j];if((zi>p[1])!==(zj>p[1])&&p[0]<(xj-xi)*(p[1]-zi)/(zj-zi)+xi)w=!w;}return w;};
  const ring=(x,z,r,n=0,ph=0)=>{n=n||Math.max(24,Math.ceil(TAU*r/0.1));const o=[];for(let i=0;i<n;i++){const t=(i+ph)/n*TAU;o.push([x+r*Math.cos(t),z+r*Math.sin(t)]);}return o;};
  function bool(A,B){const ccw=P=>area(P)>0?P.slice():P.slice().reverse();A=ccw(A);B=ccw(B);const cr=(u,v)=>u[0]*v[1]-u[1]*v[0],XA=A.map(()=>[]),XB=B.map(()=>[]);
    for(let i=0;i<A.length;i++){const a0=A[i],a1=A[(i+1)%A.length],da=[a1[0]-a0[0],a1[1]-a0[1]];
      for(let j=0;j<B.length;j++){const b0=B[j],b1=B[(j+1)%B.length],db=[b1[0]-b0[0],b1[1]-b0[1]],d=cr(da,db);if(Math.abs(d)<1e-14)continue;const w=[b0[0]-a0[0],b0[1]-a0[1]],t=cr(w,db)/d,s=cr(w,da)/d;
        if(t>0&&t<1&&s>0&&s<1){const X=[a0[0]+da[0]*t,a0[1]+da[1]*t];XA[i].push([t,X]);XB[j].push([s,X]);}}}
    const ins=(P,X)=>{const o=[];P.forEach((p,i)=>{o.push(p);X[i].sort((a,b)=>a[0]-b[0]).forEach(q=>o.push(q[1]));});return o;},A2=ins(A,XA),B2=ins(B,XB);
    const segs=(P,Q,inside,rev)=>{const o=[];for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length];if(pip([(p[0]+q[0])/2,(p[1]+q[1])/2],Q)===inside)o.push(rev?[q,p]:[p,q]);}return o;};
    const chain=S=>{const K=p=>Math.round(p[0]*1e6)+','+Math.round(p[1]*1e6),m=new Map();for(const s of S){const k=K(s[0]);if(!m.has(k))m.set(k,[]);m.get(k).push(s);}const used=new Set(),L=[];
      for(const s0 of S){if(used.has(s0))continue;const l=[];let s=s0;while(s&&!used.has(s)){used.add(s);l.push(s[0]);s=(m.get(K(s[1]))||[]).find(t=>!used.has(t));}if(l.length>2)L.push(l);}return L;};
    return{A2,B2,uni:chain([...segs(A2,B,false),...segs(B2,A,false)]),dAB:chain([...segs(A2,B,false),...segs(B2,A,true,true)]),dBA:chain([...segs(B2,A,false),...segs(A2,B,true,true)])};}
  /* solidGeo(cells): one closed solid, facing out, from plan cells, each {loop, y0, y1, F}: the cell's outline (cells that touch share their points along the boundary,
     each listing it the other way round), the depths it fills (y0 < y1; either may be a function of the plan point, for a sloped face) and its features F, which take metal
     away inside it: {p, a, b, q?, floorOut?, anchor?}: the plan outline p cut from depth a to b (one end on the cell's face y0 or y1, or both: a hole through); q an outline of as
     many points as p where the cut's wall ends (a cone: p where it starts, q where it ends); floorOut the outline of its floor where p shares part of its edge with a feature
     inside it (the floor is p less the features under it otherwise). Features are nested or apart, never crossing (cross them first with bool, and give the floor). A feature's wall
     runs from the floor of the feature it's in (or the face) to its own floor; cells with features have flat faces. Where two cells touch, the one that reaches further gets the wall
     between their depths. Walls are split where another wall at the same corner ends, so no edge has a vertex in its middle. UVs in plan, as cbGeo */
  function solidGeo(cells){
    const P=[],U=[],N=[],e=1e-6,K=p=>Math.round(p[0]*1e5)+','+Math.round(p[1]*1e5),yv=(y,p)=>typeof y==='function'?y(p):y;
    /* each triangle wound to face n, its normal worked in double precision (a flat face's exactly n: float32 normals of long thin triangles show in the Edges drawing) */
    const tri=(a,b,c,n)=>{const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],x=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(x[0],x[1],x[2]);
      if(l*l<1e-20)return;const s=x[0]*n[0]+x[1]*n[1]+x[2]*n[2]<0?-1:1;if(s<0){const t=b;b=c;c=t;}const f=!n[0]&&!n[2]&&a[1]===b[1]&&b[1]===c[1]?n:x.map(q=>q*s/l);
      for(const q of[a,b,c]){P.push(q[0],q[1],q[2]);U.push(q[0],-q[2]);N.push(f[0],f[1],f[2]);}};
    /* a face: earcut leaves out a boundary point that lies on the line between its neighbours (a crossing put into a straight edge), which the walls keep: each run of them
       left out goes back in, as a fan in the triangle on the edge that skipped them */
    const face=(out,holes,y,ny)=>{const V=v=>new THREE.Vector2(v[0],v[1]);let T=THREE.ShapeUtils.triangulateShape(out.map(V),holes.map(h=>h.map(V))),all=[...out,...holes.flat()],ar=t=>{const[a,b,c]=t.map(i=>all[i]);return Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]));};T=T.filter(t=>ar(t)>1e-9);const used=new Set(T.flat());   /* a sliver on three points in a line goes too: its middle point is put back as the rest are */
      if(used.size<all.length){const E=new Map(),ek=(i,j)=>i<j?i+'_'+j:j+'_'+i;T.forEach((t,ti)=>{for(let k=0;k<3;k++)E.set(ek(t[k],t[(k+1)%3]),ti);});let o=0;
        for(const L of[out,...holes]){const n=L.length,ix=i=>o+((i%n)+n)%n,s=[...Array(n).keys()].find(i=>used.has(ix(i)));
          if(s!=null)for(let k=0;k<n;){const a=ix(s+k);let m=k+1;const run=[];while(m<=n&&!used.has(ix(s+m))){run.push(ix(s+m));m++;}if(run.length){const b=ix(s+m),ti=E.get(ek(a,b));
            if(ti!=null&&T[ti]){const c=T[ti].find(v=>v!==a&&v!==b),ch=[a,...run,b];T[ti]=null;for(let q=0;q<ch.length-1;q++){const t=[ch[q],ch[q+1],c];T.push(t);for(let r=0;r<3;r++)E.set(ek(t[r],t[(r+1)%3]),T.length-1);}}}k=m;}o+=n;}}
      for(const t of T)if(t)tri(...t.map(i=>all[i]).map(p=>[p[0],yv(y,p),p[1]]),[0,ny,0]);};
    /* walls: [p, q, lo(p), hi(p), lo(q), hi(q), normal]; each corner's depths gathered first, so a wall is split where another ends there */
    const W=[],LV=new Map(),lev=(p,y)=>{const k=K(p);if(!LV.has(k))LV.set(k,[]);const l=LV.get(k);if(!l.some(v=>Math.abs(v-y)<e))l.push(y);};
    const nOut=(p,q,s)=>{const dx=q[0]-p[0],dz=q[1]-p[1],l=Math.hypot(dx,dz)||1;return[s*dz/l,0,-s*dx/l];};   /* s +1: away from a counterclockwise loop's inside */
    const wall=(p,q,a0,b0,a1,b1,n)=>{if(b0-a0<e&&b1-a1<e)return;W.push([p,q,a0,b0,a1,b1,n]);lev(p,a0);lev(p,b0);lev(q,a1);lev(q,b1);};
    const cone=[];   /* tapered walls: [loop at lo, loop at hi, lo, hi, s] */
    const SEG=new Map();cells.forEach((c,ci)=>{const L=c.loop;for(let i=0;i<L.length;i++)SEG.set(K(L[i])+'|'+K(L[(i+1)%L.length]),ci);});
    cells.forEach(c=>{const L=c.loop,s=Math.sign(area(L));
      for(let i=0;i<L.length;i++){const p=L[i],q=L[(i+1)%L.length],n=nOut(p,q,s),o=SEG.get(K(q)+'|'+K(p));
        const[a0,b0,a1,b1]=[yv(c.y0,p),yv(c.y1,p),yv(c.y0,q),yv(c.y1,q)];
        if(o==null){wall(p,q,a0,b0,a1,b1,n);continue;}const d=cells[o],[c0,d0,c1,d1]=[yv(d.y0,p),yv(d.y1,p),yv(d.y0,q),yv(d.y1,q)];
        if(c0>a0+e||c1>a1+e)wall(p,q,a0,Math.min(b0,c0),a1,Math.min(b1,c1),n);if(d0<b0-e||d1<b1-e)wall(p,q,Math.max(a0,d0),b0,Math.max(a1,d1),b1,n);}
      const F=c.F||[],y0=c.y0,y1=c.y1;if(F.length&&(typeof y0==='function'||typeof y1==='function'))throw new Error('solidGeo: features in a sloped cell');
      for(const f of F){f.a=Math.max(f.a,y0);f.b=Math.min(f.b,y1);f.A=f.a<=y0+e;f.B=f.b>=y1-e;f.ar=Math.abs(area(f.p));f.an=f.anchor||cen(f.p);}
      const inF=(f,g)=>f!==g&&(f.ar>g.ar+e||f.p===g.p&&!(f.A&&f.B)&&g.A&&g.B)&&pip(g.an,f.p);   /* g inside f; a hole through and a cut sharing its outline (where a cone starts): the cut holds the hole */
      for(const g of F){const ps=F.filter(f=>inF(f,g)&&!(f.A&&f.B));   /* the features g is in (a hole through holds nothing) */
        g.lo=g.A?Math.max(y0,...ps.filter(f=>f.A&&!f.B).map(f=>f.b)):g.a;g.hi=g.B?Math.min(y1,...ps.filter(f=>f.B&&!f.A).map(f=>f.a)):g.b;}
      const at=(f,y)=>f.q&&Math.abs(y-f.hi)<e?f.q:f.p;
      const maxi=S=>S.filter(g=>!S.some(f=>inF(f,g)));
      for(const g of F){if(g.hi-g.lo<e)continue;const sg=Math.sign(area(g.p));
        if(g.q){cone.push([g.p,g.q,g.lo,g.hi,sg]);continue;}for(let i=0;i<g.p.length;i++){const p=g.p[i],q=g.p[(i+1)%g.p.length];wall(p,q,g.lo,g.hi,g.lo,g.hi,nOut(p,q,-sg));}}
      /* floors: an A feature's (open on y0) at its b facing -y, none where it opens into a B feature round it; a B feature's at its a facing +y */
      for(const g of F){if(g.A&&g.B)continue;const y=g.A?g.b:g.a;if(g.A&&F.some(f=>f.B&&!f.A&&inF(f,g)&&f.a<=y+e))continue;if(g.B&&F.some(f=>f.A&&!f.B&&inF(f,g)&&f.b>=y-e))continue;
        const out=g.floorOut||(g.A?at(g,g.b):g.p),hs=maxi(F.filter(f=>f!==g&&f.a<=y+e&&f.b>=y-e&&(g.A?f.b>y+e:f.a<y-e)&&pip(f.an,out))).map(f=>at(f,y));
        if(hs.some(h=>h===out))continue;face(out,hs,y,g.A?-1:1);}
      if(typeof y0==='number')face(L,maxi(F.filter(f=>f.A)).map(f=>at(f,y0)),y0,-1);else face(L,[],y0,-1);
      if(typeof y1==='number')face(L,maxi(F.filter(f=>f.B)).map(f=>at(f,y1)),y1,1);else face(L,[],y1,1);});
    for(const[p,q,a0,b0,a1,b1,n]of W){const ls=(x,a,b)=>[a,...(LV.get(K(x))||[]).filter(v=>v>a+e&&v<b-e).sort((u,w)=>u-w),b],L0=ls(p,a0,b0),L1=ls(q,a1,b1);let i=0,j=0;   /* a ladder up the two edges, a rung wherever either edge has a depth */
      while(i<L0.length-1||j<L1.length-1){if(j>=L1.length-1||(i<L0.length-1&&L0[i+1]<=L1[j+1])){tri([p[0],L0[i],p[1]],[q[0],L1[j],q[1]],[p[0],L0[i+1],p[1]],n);i++;}else{tri([p[0],L0[i],p[1]],[q[0],L1[j],q[1]],[q[0],L1[j+1],q[1]],n);j++;}}}
    for(const[A,B,lo,hi,s]of cone)for(let i=0;i<A.length;i++){const j=(i+1)%A.length,a=A[i],b=A[j],c=B[j],d=B[i],n=nOut(a,b,-s);
      tri([a[0],lo,a[1]],[b[0],lo,b[1]],[c[0],hi,c[1]],n);tri([a[0],lo,a[1]],[c[0],hi,c[1]],[d[0],hi,d[1]],n);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));return g;}
  /* the part and screw makers (movement.js, buildMovement's closures and its API at its end) */
  const parts=(mv,M)=>{const P={},V2=(a,b)=>new THREE.Vector2(a,b);
    /** @param {string} name its key (PARTS in the page's app.js) @param {number} off its rise in the Exploded view (mm) @param {number[]} [ef] a frame in it, at [x, z] turned ef[2] about y: returns that group */
    const part=(name,off,ef)=>{const g=new THREE.Group();g.userData.off=off;g.userData.partName=name;mv.add(g);P[name]=g;
      if(ef){const e=new THREE.Group();e.position.set(ef[0],0,ef[1]);e.rotation.y=ef[2]||0;g.add(e);g.userData.ef=e;return e;}return g;};
    /* screw: a fillister head seated at y (in p's frame), the head toward -y, and a threaded shank len mm long toward +y, into the parts it holds. Thread diameter half
       the head's unless rs is given (sR); the parts it passes through have clearance holes (hC) and the part it screws into a tapped hole (hT). Head, shank and slot are
       one group, which the Exploded view lifts out of its holes along the screw's axis (SCREWS) */
    const SCREWS=[],loose=(g,lift)=>{g.userData.y0=g.position.y;g.userData.lift=lift;SCREWS.push(g);return g;};   /* loose: g moves on its own in the Exploded view, lift mm toward its frame's -y past its part */
    const headOn=(g,p,q)=>{g.userData.lift+=P[p].userData.off-P[q].userData.off;return g;};   /* a screw of part p put in through part q: it leaves with q, then lifts out of it */
    /* the head with its slot cut, one closed solid (solidGeo): two flat-topped halves inside the chamfer, the chamfer's ring (45°, c wide) round each, and between them
       the slot's strip, its floor s under the top, w wide, open at both ends. Every photograph shows slots as dark grooves; until 18 October 2026 a grey box stood 0.02 proud
       across the head (photocompare.py, Wempe 3955's N view). Cached by size */
    const HG={};
    /* domed (dome > 0, its rise over the rim): the top a spherical cap from the rim (no chamfer), built of rings so the cap is a surface, not a fan; the slot cut under it */
    const headGeo=(r,h,dome=0,sw=0,ss=0)=>{const k=r+'_'+h+'_'+dome+'_'+sw+'_'+ss;if(HG[k])return HG[k];const c=dome>0?0:Math.min(0.35,r*0.14),w=sw||Math.max(0.35,r*0.2),s=ss||Math.max(Math.min(0.55,h*0.45),c+0.05,dome>0?dome+0.3:0),hw=w/2,n=24;   /* sw, ss: a slot of another width and depth (the 6MX's block stud) */
      const RD=dome>0?(r*r+dome*dome)/(2*dome):0,yD=q=>-h+RD-Math.sqrt(Math.max(0,RD*RD-q[0]*q[0]-q[1]*q[1]));   /* the cap: -h at the middle, -h+dome at the rim */
      const arc=(rr,sg,a0,a1)=>[...Array(n+1).keys()].map(i=>{const t=a0+(a1-a0)*i/n;return[rr*Math.cos(t),sg*rr*Math.sin(t)];});
      const ccw=L=>area(L)<0?L.slice().reverse():L,cells=[];
      const A=dome>0?[0.35,0.55,0.72,0.87,1].map(f=>Math.max(f*r,hw+0.08)).filter((v,i,a)=>i===0||v>a[i-1]+0.05):[r-c,r];   /* the rings' radii: the cap's, or the flat top's and the chamfer's */
      const top=dome>0?yD:q=>-h+Math.max(0,Math.hypot(q[0],q[1])-(r-c));
      for(const sg of[1,-1]){const ARC=A.map(a=>arc(a,sg,Math.asin(hw/a),Math.PI-Math.asin(hw/a)));   /* the half on the z sg side: each arc's ends on the slot's edge */
        cells.push({loop:ccw(ARC[0]),y0:dome>0?yD:-h,y1:0});   /* the middle: the first arc closed by the slot's edge */
        for(let i=1;i<A.length;i++)cells.push({loop:ccw([...ARC[i],...ARC[i-1].slice().reverse()]),y0:top,y1:0});}   /* the rings, open at the slot */
      const X=A.map(a=>Math.sqrt(a*a-hw*hw));
      cells.push({loop:ccw([...X.slice().reverse().map(x=>[x,-hw]).reverse(),...X.slice().reverse().map(x=>[x,hw]),...X.map(x=>[-x,hw]),...X.slice().reverse().map(x=>[-x,-hw])]),y0:-h+s,y1:0});   /* the slot's strip, its ends on the rim */
      const G=solidGeo(cells),P=G.attributes.position.array,N=G.attributes.normal.array;   /* the cap's, the chamfer's and the rim's triangles shaded round (their own normals), not faceted */
      for(let t=0;t<P.length;t+=9){const nx=N[t],ny=N[t+1],nz=N[t+2],cx=(P[t]+P[t+3]+P[t+6])/3,cz=(P[t+2]+P[t+5]+P[t+8])/3,cr=Math.hypot(cx,cz)||1,rim=Math.abs(ny)<0.05&&(nx*cx+nz*cz)/cr>0.9;
        const cap=dome>0&&ny<0&&[0,3,6].every(o=>Math.abs(P[t+o+1]-yD([P[t+o],P[t+o+2]]))<1e-4),cone=!dome&&Math.abs(ny)>0.05&&Math.abs(ny)<0.95;
        if(!cone&&!rim&&!cap)continue;for(let v=t;v<t+9;v+=3){const px=P[v],pz=P[v+2],pr=Math.hypot(px,pz)||1;
          if(cap){const yy=-Math.sqrt(Math.max(0,RD*RD-px*px-pz*pz));N[v]=px/RD;N[v+1]=yy/RD;N[v+2]=pz/RD;}else if(cone){const l=Math.SQRT2;N[v]=px/pr/l;N[v+1]=-1/l;N[v+2]=pz/pr/l;}else{N[v]=px/pr;N[v+1]=0;N[v+2]=pz/pr;}}}
      G.attributes.normal.needsUpdate=true;return HG[k]=G;};
    /** @type {(p:any,x:number,z:number,y:number,r?:number,h?:number,len?:number,rs?:number,mt?:any,dome?:number,sl?:any)=>any} in frame p: x, z, y (the head's seat), then the head's radius and height, the shank's length, the thread's radius, the material (steel by default), the head's dome (its rise, 0 flat) and its slot where it isn't the usual ({w, s, a}: width, depth, heading in radians about y) */
    const screw=(p,x,z,y,r=2.2,h=1.1,len=0,rs=sR(r),mt=null,dome=0,sl=null)=>{
      const g=new THREE.Group();g.position.set(x,y,z);p.add(g);loose(g,len+h+1.5);g.userData.sc={r,h,len,rs};
      const hd=mesh(g,headGeo(r,h,dome,sl?sl.w:0,sl?sl.s:0),mt||M.steel);hd.userData.screw=r;hd.rotation.y=sl&&sl.a!=null?sl.a:(x*7+z*3)%3;   /* the slot's heading: arbitrary, as before, unless given */
      if(len>0){const pt=clamp(rs*0.42,0.06,0.3),d=pt*0.3,n=Math.max(1,Math.floor((len-pt*0.6)/pt)),pr=[V2(0,-0.1),V2(rs,-0.1),V2(rs,len-n*pt-d)];   /* the shank from 0.1 inside the head: rings of thread (turned grooves, not a helix), a chamfered tip */
        for(let i=0;i<n;i++){const a=len-(n-i)*pt-d;pr.push(V2(rs-d,a+pt/2),V2(rs,a+pt));}pr.push(V2(rs-d,len),V2(0,len));mesh(g,new THREE.LatheGeometry(pr,28),mt||M.steel);}
      return g;};
    /* the API the page and the tools read: the parts, the screws and loose pieces (exploded.py), explode(e) (0 as built, 1 spread) */
    const done=()=>{mv.userData.parts=P;mv.userData.lifted=SCREWS;
      mv.userData.explode=e=>{for(const k in P)P[k].position.y=P[k].userData.off*e;for(const g of SCREWS)g.position.y=g.userData.y0-g.userData.lift*e;};mv.userData.explode(0);};
    return{part,screw,loose,headOn,SCREWS,parts:P,done};};
  /* the jewels as the Wempe's coloured section draws them (Wempe_Einheitschronometer.jpg, its stones red): profiles [r, y] for a lathe, y0 the stone's face toward
     the endstone, s (+1 or -1) the way it runs from there. jewelPr: a hole jewel, that face domed (the crown at y0, d lower at the edge R), the edge straight to the
     face toward the arbor (T from the crown), an oil sink opening into that face as a cone from the hole to rc, hc deep, and the hole between, rb at its middle and
     0.03 wider at its two ends (olive). endPr: an endstone, flat on the pivot's side (y0), its edge e high, then domed h to its crown; domeAt its dome's height over
     the edge at r */
  /** @type {(R:number,h:number,r:number)=>number} */
  const domeAt=(R,h,r)=>{const Rs=(R*R+h*h)/(2*h);return Math.sqrt(Rs*Rs-r*r)-(Rs-h);};
  /** @type {(R:number,T:number,rb:number,d:number,rc:number,hc:number,y0:number,s:number)=>number[][]} */
  const jewelPr=(R,T,rb,d,rc,hc,y0,s)=>{const h0=rb+0.03,hl=T-hc,pr=[];
    for(let i=0;i<=8;i++){const r=h0+(R-h0)*i/8;pr.push([r,d-domeAt(R,d,r)]);}
    pr.push([R,T],[rc,T],[h0,hl]);for(let i=1;i<6;i++){const t=i/6;pr.push([rb+0.03*(1-2*t)**2,hl*(1-t)]);}
    return pr.map(([r,y])=>[r,y0+s*y]);};
  /** @type {(R:number,e:number,h:number,y0:number,s:number)=>number[][]} */
  const endPr=(R,e,h,y0,s)=>{const pr=[[0,0],[R,0],[R,e]];for(let i=1;i<=8;i++){const r=R*(1-i/8);pr.push([r,e+domeAt(R,h,r)]);}return pr.map(([r,y])=>[r,y0+s*y]);};
  return{domeAt,jewelPr,endPr,parts,subtractCircle,hull,hullSplice,crescent,twoCircles,lobedCircle,clipPoly,clipUnder,discClip,stepGeo,cbGeo,checkHoles,polyGeo,stadiumPts,stadium,barBossPts,sR,hC,hT,stripGeo,sdfOutline,area,cen,pip,ring,bool,solidGeo};
})();
