/* movement.js: the Model 21 movement: photo-measured layout, Rawlings-based escapement, bridges, crescent cock, train, maintaining work, fusee, chain and winding key
   Part of 'The Marine Chronometer, working' (three.js r128). See README.md. */
/* =====================================================================
   movement.js: the Hamilton Model 21 movement.
   Units: mm. Movement frame: dial side = +y, 12 o'clock = -z, 3 o'clock = +x.

   SOURCES FOR THE LAYOUT (see README):
   - Pillar plate 87.57 mm diameter, 3.86 mm thick (new-old-stock Hamilton part, Cas-Ker listing).
   - Balance, fusee arbor and barrel arbor: triangulated from two photographs (the manual's Fig. 2 and a near-top
     view of a 1941 movement) with an independent camera for each (bundle.py), then scaled so the fusee wheel
     (fixed at 96:14 by the winding figures) stays inside the 87.57 mm pillar plate.
   - Bridge shapes, balance cock, setup cover, screw positions, engraving columns and damascene direction:
     traced on the top-view photograph and mapped into this frame (p3map.json).
   - Dial orientation: wind-indicator wheel under the 12 (manual Fig. 107, radius ~12 mm), driven by the
     fusee-arbor pinion; seconds (fourth wheel) at 6.
   - Escape wheel: 16 teeth, 13.16 mm, 1.3 mm thick (Hamilton spec quoted in chronometerbook.com post 30).
   - Escapement: plan view of the manual's Fig. 90 (redrawn by Rawlings, chronometerbook.com post 4); escape wheel 9.40 mm from the balance,
     where the 0.249 in impulse roller leaves 0.002 in roller shake (Op. 84) and the teeth dip into its crescent (Ops. 76, 83).
   - Third wheel, escape wheel position and the going-train modules (0.29 / 0.30 / 0.3113): solved as a constraint problem
     so that every arbor clears every wheel and the barrel (solve.py).
   ===================================================================== */
const L={C:[0,0],T:[-4.86,12.11],F:[0,23.9],E:[7.193,16.135],B:[8.0,6.77],Fu:[11.59,-19.8],Ba:[-18.56,0.19],Ud:[0,-23.9],Mw:[-9.6,0]};
const PP_R=87.57/2,PP_T=3.86,BR_R=40.5;
/* levels (y) from a side photograph of the movement, scaled by the pillar plate's 3.86 mm edge: train bridge 16.8-19.9 mm above the plate (TB_U, TB_T),
   barrel bridge 3.4 mm on it (BB_T), cock foot 14.2 mm tall on the train bridge (CK_T); the escape wheel runs just under the train bridge, the fourth
   wheel and escape pinion 3.6 mm above the plate and the centre wheel lowest (see README, 'How the layout was measured') */
const TB_U=-20.66,TB_T=-23.76,BB_T=-27.16,CK_T=-37.96;
const EY=-18.96,LB_T=-14.76,BAL_Y=-26.3;   /* escape wheel (teeth 0.95 below the train bridge), balance lower bridge's top face (photograph: 7.9-10.9 mm above the plate), balance rim */   /* bridge radius: the top-view photograph (the fusee wheel is hidden under it, as photographed) */          /* pillar plate; bridges */
const PILLARS={barrel:[-15.3,-26.58],train:[[-16.63,22.48],[18.17,26.92],[32.11,-4.1]]};
const COCK_FOOT=[28.3,6.4],BAL_R=14.5;
/* going train (counts give the ratios; centre-escape counts are not published). fu : cp, fusee wheel 96 : centre pinion 14, from the winding figures:
   7 half-turns of the key per 24 h (manual Sec. III) = 6.857 h per fusee turn. Every count shown in the page (labels, part cards, walkthrough tables) comes from here */
const TRAIN={fu:96,cp:14,cw:80,tp:10,tw:75,fp:10,fw:60,ep:8,ew:16};
const MW={cp:12,mw:36,mp:10,hw:40};   /* motion work: cannon pinion 12 : minute wheel 36, minute pinion 10 : hour wheel 40 */
/* escape-wheel turns per turn of the fourth, third, centre and fusee wheels: 7.5, 56.25, 450, 3086 */
const ESC_PER=(()=>{const fw=TRAIN.fw/TRAIN.ep,tw=fw*TRAIN.tw/TRAIN.fp,cw=tw*TRAIN.cw/TRAIN.tp;return{fw,tw,cw,gw:cw*TRAIN.fu/TRAIN.cp};})();
const FUSEE_PER_HOUR=TRAIN.cp/TRAIN.fu,FUSEE_TURNS=8.75; /* 17-1/2 half turns for a full wind */
const RUN_H=FUSEE_TURNS/FUSEE_PER_HOUR;         /* 60 h: runs down when the chain is all on the barrel (the dial's UP-DOWN scale covers the rated 56 h) */
const UD={pin:8,wheel:98,m:0.2319};             /* wind indicator: wheel radius 12.4 mm, as Fig. 107 */
const MOD={fusee:0.4171,train:0.30,centre:0.29,fourth:0.3113};   /* fourth: the escape pinion meshes at the 10.585 mm the escape wheel's 9.40 mm from the balance leaves */
const EU=(()=>{const dx=L.B[0]-L.E[0],dz=L.B[1]-L.E[1],l=Math.hypot(dx,dz);return[dx/l,dz/l];})(),BETA=Math.atan2(-EU[1],EU[0]);
/* Spring detent escapement: solved by makeEsc in ../shared/escapement.js (shared with the essay and tools/escapement.js), with the centre distance in L (9.40 mm).
   Unit frame: balance at origin, escape wheel centre at x=EX, unit = escape-wheel radius ES */
const ES=13.16/2,ESC=makeEsc({EX:-Math.hypot(L.B[0]-L.E[0],L.B[1]-L.E[1])/ES});

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
/* polygon of a disc clipped by half-planes z*s > a + b*x  (s=+1 keeps above the line, -1 below) */
function discClip(R,cuts,N=160){
  let poly=[];for(let i=0;i<N;i++){const a=i/N*TAU;poly.push([R*Math.cos(a),R*Math.sin(a)]);}
  for(const[a,b,s]of cuts){const f=p=>s*(p[1]-(a+b*p[0]));const out=[];
    for(let i=0;i<poly.length;i++){const P0=poly[i],P1=poly[(i+1)%poly.length],f0=f(P0),f1=f(P1);
      if(f0>=0)out.push(P0);if((f0>=0)!==(f1>=0)){const t=f0/(f0-f1);out.push([P0[0]+(P1[0]-P0[0])*t,P0[1]+(P1[1]-P0[1])*t]);}}
    poly=out;}
  return poly;
}
/* a hole that crosses the outline or overlaps another hole silently breaks the triangulation: report it */
function checkHoles(tag,holes,inside){holes.forEach(([x,z,r],i)=>{if(inside(x,z)<r+0.05)console.warn(tag+': hole at '+x.toFixed(2)+','+z.toFixed(2)+' r'+r+' crosses the outline');
  holes.forEach(([x2,z2,r2],j)=>{if(j>i&&Math.hypot(x-x2,z-z2)<r+r2+0.05)console.warn(tag+': holes at '+x.toFixed(2)+','+z.toFixed(2)+' and '+x2.toFixed(2)+','+z2.toFixed(2)+' overlap');});});}
function polyGeo(pts,th,holes=[],bev=0){const polyH=holes.filter(h=>h.pts);holes=holes.filter(h=>!h.pts);   /* holes: circles [x,z,r], or {pts} outlines */
  checkHoles('polyGeo',holes,(x,z)=>{let d=1e9;for(let k=0;k<pts.length;k++){const[ax,az]=pts[k],[bx,bz]=pts[(k+1)%pts.length],l2=(bx-ax)**2+(bz-az)**2,t=l2?clamp(((x-ax)*(bx-ax)+(z-az)*(bz-az))/l2,0,1):0;d=Math.min(d,Math.hypot(x-ax-t*(bx-ax),z-az-t*(bz-az)));}return d-bev;});
  const s=new THREE.Shape();pts.forEach(([x,z],i)=>i?s.lineTo(x,-z):s.moveTo(x,-z));s.closePath();
  /* the bevel narrows every hole by 0.8·bev at both faces; a screw hole (4th element set) is drawn that much larger, so it has its size at the faces and a thread fits it */
  for(const[hx,hz,hr,sc]of holes){const h=new THREE.Path();h.absarc(hx,-hz,hr+(sc?bev*0.8:0),0,TAU,true);s.holes.push(h);}
  for(const{pts:hp}of polyH){const h=new THREE.Path();hp.forEach(([x,z],i)=>i?h.lineTo(x,-z):h.moveTo(x,-z));h.closePath();s.holes.push(h);}
  const g=new THREE.ExtrudeGeometry(s,{depth:th-2*bev,bevelEnabled:bev>0,bevelThickness:bev,bevelSize:bev*0.8,bevelOffset:-bev*0.8,bevelSegments:1,curveSegments:32});g.rotateX(-Math.PI/2);g.translate(0,bev,0);return g;}
function stadiumPts(p0,p1,w){const dx=p1[0]-p0[0],dz=p1[1]-p0[1],l=Math.hypot(dx,dz),nx=-dz/l*w/2,nz=dx/l*w/2,pts=[];
  const a0=Math.atan2(nz,nx);for(let i=0;i<=16;i++){const a=a0+Math.PI*i/16;pts.push([p0[0]+w/2*Math.cos(a),p0[1]+w/2*Math.sin(a)]);}
  for(let i=0;i<=16;i++){const a=a0+Math.PI+Math.PI*i/16;pts.push([p1[0]+w/2*Math.cos(a),p1[1]+w/2*Math.sin(a)]);}return pts;}
function stadium(p0,p1,w,th,holes=[]){return polyGeo(stadiumPts(p0,p1,w),th,holes);}

/* screw holes: thread radius sR for a head of radius r; a clearance hole (hC) where the screw passes through a part, a tapped hole (hT) where it screws in; [x, z, r, 1] as polyGeo takes (the 1: polyGeo keeps its size at the faces, below) */
const sR=r=>r*0.5,hC=(x,z,r,rs=sR(r))=>[x,z,+(rs*1.12+0.01).toFixed(3),1],hT=(x,z,r,rs=sR(r))=>[x,z,+(rs+0.02).toFixed(3),1];   /* rs: a thread radius other than half the head's */

/* ratchet tooth profile (as gearGeo's ratchet) in the wheel's own XZ frame: radius at XZ angle b */
function ratchetProf(n,m,flip){const rp=m*n/2,ro=rp+m*0.95,ri=ro-2.25*m,p=TAU/n;
  return{ro,ri,p,r:b=>{const a=flip?b:-b,t=(((a%p)+p)%p)/p;return t<0.9?ri+(ro-ri)*t/0.9:t<0.97?ro-(ro-ri)*(t-0.9)/0.07:ri;}};}
/* outline of pawlGeo(len,w) in the pawl's own XZ frame (pivot at the origin, tip toward -x); point PAWL_TIP is the tip corner */
const PAWL_TIP=50;
function pawlPts(len,w){const r=w*0.72,S=[[0,r]];for(let k=1;k<=12;k++){const a=Math.PI/2-Math.PI*k/12;S.push([r*Math.cos(a),r*Math.sin(a)]);}
  const E=[[-len*0.8,-w*0.26],[-len,-w*0.62],[-len*0.96,w*0.08]];for(let k=1;k<=32;k++)S.push([-len*0.8*k/32,-r*(1-k/32)-w*0.26*k/32]);
  for(let i=0;i<2;i++)for(let k=1;k<=6;k++){const[a0,b0]=E[i],[a1,b1]=E[i+1];S.push([a0+(a1-a0)*k/6,b0+(b1-b0)*k/6]);}
  for(let k=1;k<=30;k++){const t=k/30,x0=-len*0.96,y0=w*0.08,cx=-len*0.5,cy=w*0.42;S.push([(1-t)**2*x0+2*t*(1-t)*cx,(1-t)**2*y0+2*t*(1-t)*cy+t*t*r]);}
  return S.map(([x,y])=>[x,-y]);}
/* flat spring: a strip w wide along a polyline in XZ, th tall from y 0 up (+y) */
function stripGeo(pts,w,th){const L2=[],R2=[];pts.forEach((p,i)=>{const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz);
  L2.push([p[0]-dz/l*w/2,p[1]+dx/l*w/2]);R2.push([p[0]+dz/l*w/2,p[1]-dx/l*w/2]);});return polyGeo(L2.concat(R2.reverse()),th);}
/* the point where a spring bears on a pawl's arm, c mm from its pivot, on the side facing away from its ratchet's centre (pawl at q, angle th,
   ratchet centre at o, all in one XZ frame): returns the point and that side's outward normal */
function pawlBack(pts,c,q,th,o){const co=Math.cos(th),sn=Math.sin(th),W=(x,z)=>[q[0]+x*co+z*sn,q[1]-x*sn+z*co];let best=null;
  for(const s of[1,-1]){const zs=pts.filter(([x])=>Math.abs(x+c)<0.25).map(([,z])=>z),z=s>0?Math.max(...zs):Math.min(...zs),p=W(-c,z),n=[s*sn,s*co];
    if(!best||n[0]*(p[0]-o[0])+n[1]*(p[1]-o[1])>best.out)best={p,n,out:n[0]*(p[0]-o[0])+n[1]*(p[1]-o[1])};}return best;}
/* pawl resting on a ratchet: pivot q and pawl angle th0 given in the ratchet's frame (centre at the origin); returns the pawl angle at which it just
   touches the teeth, rotating it in from th0. Pawl rotation as three.js rotation.y */
function seatPawl(pts,q,th0,pr){
  const f=th=>{const c=Math.cos(th),sn=Math.sin(th);let m=1e9;for(const[x,z]of pts){const X=q[0]+x*c+z*sn,Z=q[1]-x*sn+z*c,r=Math.hypot(X,Z);if(r<pr.ro+0.5)m=Math.min(m,r-pr.r(Math.atan2(Z,X)));}return m;};
  const tip=pts[PAWL_TIP],tr=th=>{const c=Math.cos(th),sn=Math.sin(th);return Math.hypot(q[0]+tip[0]*c+tip[1]*sn,q[1]-tip[0]*sn+tip[1]*c);};
  const so=tr(th0+0.01)>tr(th0)?1:-1;let a=th0+so*0.5,b=th0-so*0.5;if(f(b)>=0)return b;if(f(a)<0)return a;
  for(let i=0;i<28;i++){const m=(a+b)/2;f(m)>=0?a=m:b=m;}return a;}
/* wheel rotation (within one tooth) at which a pawl, pivot q and angle th0 in the parent frame (wheel centre at the origin), rests at the bottom of a
   tooth space against a steep face; dir = +1: the face meets it when the wheel turns with rotation.y rising, -1: falling. Returns wheel and pawl angles */
function phaseAgainst(pr,pts,q,th0,dir){let best=null;const N=240;
  for(let i=0;i<N;i++){const psi=pr.p*i/N,ql=toWheel(q,[0,0],psi),th=seatPawl(pts,ql,th0-psi,pr),c=Math.cos(th),sn=Math.sin(th),t=pts[PAWL_TIP];
    const r=Math.hypot(ql[0]+t[0]*c+t[1]*sn,ql[1]-t[0]*sn+t[1]*c);(best=best||[]).push([psi,r,th+psi]);}
  const rmin=Math.min(...best.map(b=>b[1]));let k=best.findIndex(b=>b[1]<rmin+0.004);
  /* walk along the plateau of deepest rest in the direction the face arrives from, to its end */
  for(let j=0;j<N;j++){const n=(k+dir+N)%N;if(best[n][1]<rmin+0.004)k=n;else break;}
  k=(k-4*dir+N)%N;   /* back off 0.6 % of a tooth: the teeth are drawn as chords, the profile interpolates by angle */
  return{psi:best[k][0],th:best[k][2]};}
/* point / angle from a parent frame into a wheel's frame (wheel at c, rotation.y psi) */
const toWheel=(p,c,psi)=>{const x=p[0]-c[0],z=p[1]-c[1],co=Math.cos(psi),sn=Math.sin(psi);return[x*co-z*sn,x*sn+z*co];};

function buildMovement(M){
  const mv=new THREE.Group(),parts={},R={};const V2=(a,b)=>new THREE.Vector2(a,b);
  const part=(name,off,ef)=>{const g=new THREE.Group();g.userData.off=off;g.userData.partName=name;mv.add(g);parts[name]=g;
    if(ef){const e=new THREE.Group();e.position.set(L.B[0],0,L.B[1]);e.rotation.y=BETA;g.add(e);g.userData.ef=e;return e;}return g;};
  /* screw: a fillister head seated at y (in p's frame), the head toward -y, and a threaded shank len mm long toward +y, into the parts it holds (Figs. 108-110 draw
     every screw with its shank). Thread diameter half the head's (sR); the parts it passes through have clearance holes (hC) and the part it screws into a tapped hole (hT).
     Head, shank and slot are one group, which the Exploded view lifts out of its holes along the screw's axis, as the manual's exploded views draw them (SCREWS) */
  const SCREWS=[];
  const screw=(p,x,z,y,r=2.2,h=1.1,len=0,rs=sR(r))=>{const c=Math.min(0.35,r*0.14),pr=[V2(0.01,-h),V2(r-c,-h),V2(r,-h+c),V2(r,0)];
    if(len>0){const pt=clamp(rs*0.42,0.06,0.3),d=pt*0.3,n=Math.max(1,Math.floor((len-pt*0.6)/pt));pr.push(V2(rs,0),V2(rs,len-n*pt-d));   /* rings of thread (drawn as turned grooves, not a helix), a chamfered tip */
      for(let i=0;i<n;i++){const a=len-(n-i)*pt-d;pr.push(V2(rs-d,a+pt/2),V2(rs,a+pt));}pr.push(V2(rs-d,len),V2(0.01,len));}
    else pr.push(V2(0.01,0));
    const g=new THREE.Group();g.position.set(x,y,z);p.add(g);g.userData.y0=y;g.userData.lift=len+h+1.5;SCREWS.push(g);
    const hd=mesh(g,new THREE.LatheGeometry(pr,28),M.steel);hd.userData.screw=r;const sl=mesh(g,new THREE.BoxGeometry(r*2.02,Math.min(0.55,h*0.45),Math.max(0.35,r*0.2)),M.steelD,0,-h+Math.min(0.55,h*0.45)/2-0.02,0);sl.rotation.y=(x*7+z*3)%3;return g;};
  const ring=ringGeo;R.ring=ring;
  const jewel=(p,x,z,y,cap)=>{mesh(p,ring(2.1,1.0,0.5),M.gilt,x,y-0.25,z);mesh(p,ring(0.95,0.57,0.25),M.ruby,x,y-0.6,z);   /* bar-hole jewel: setting and pierced stone */
   
    if(cap){for(let k=0;k<2;k++){const a=k*Math.PI+0.7;mesh(p,cylY(0.5,0.5,10),M.steel,x+2.7*Math.cos(a),y-0.25,z+2.7*Math.sin(a));}}};
  /* endstone cap (42159, 42160): a steel plate over a setting with the cap jewel showing through its centre, two screws (20762) at ±2.1 mm along u into the part under it.
     Built in frame g with the part's face at y and the cap toward -y; depth: how far the screws go into the part */
  const endCap=(g,x,z,u,y,depth,sp=2.1)=>{const a=[x-u[0]*sp,z-u[1]*sp],b=[x+u[0]*sp,z+u[1]*sp];
    mesh(g,stadium(a,b,1.3,0.3,[[x,z,0.45],hC(...a,ESCAP),hC(...b,ESCAP)]),M.steel,0,y-0.3,0);mesh(g,cylY(0.6,0.26,20),M.ruby,x,y-0.15,z);
    for(const q of[a,b])screw(g,...q,y-0.3,ESCAP,0.2,0.3+depth);};
  const y0=-PP_T;
  /* ---------- screw positions (x, z), worked out before the plates are cut: a clearance hole where a screw passes through a part (hC), a tapped hole where it holds (hT).
       42055 (pillar, bridge and mounting-ring screws) have heads r 2.9; ESCAP: the endstone caps' screws (20762) ---------- */
  const add=(a,b,k=1)=>[a[0]+b[0]*k,a[1]+b[1]*k],sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],unit=a=>{const l=Math.hypot(...a);return[a[0]/l,a[1]/l];},ry=(a,[x,z])=>[x*Math.cos(a)+z*Math.sin(a),-x*Math.sin(a)+z*Math.cos(a)];
  const eu=unit(sub(L.E,L.B)),lbu=unit(sub(L.F,L.B)),lbn=[-lbu[1],lbu[0]],LBm=add(L.B,sub(L.F,L.B),0.9),ESCAP=0.45,PSR=2.9,RSR=1.8;   /* RSR: the mounting ring's screws, on its narrow lip */
  const S={ltb:[0.35,0.65].map(f=>add(L.T,sub(L.F,L.T),f)),pil:[...PILLARS.train,PILLARS.barrel],tb:[PILLARS.train[0],PILLARS.train[1],[-8.5,27.7]],bb:[PILLARS.barrel,PILLARS.train[2],[29.24,-12.28]],
    ring:[90,210,330].map(a=>[42.0*Math.cos(a*D2R),42.0*Math.sin(a*D2R)]),eb:[4.3,6.6].map(f=>add(L.E,eu,f)),ebc:[2.1,-2.1].map(f=>add(L.E,eu,f)),elc:[2.1,-2.1].map(f=>add(L.E,eu,f)),
    lb:[1,-1].map(k=>add(LBm,lbn,1.1*k)),blc:[1.9,-1.9].map(f=>add(L.B,lbu,f)),blk:(q=>add(L.B,ry(BETA,[q.x*ES,q.y*ES])))(ESC.D(-1.2,-0.35)),cock:[33.11,12.62]};   /* cock screw: 0.3 mm off its traced position (within the tracing's 0.4 mm), so its thread clears the foot's edge */
  /* balance locking arm (42299, Fig. 9): its screw (37204, with washer 42251) in the train bridge under the balance, 10.6 mm from the staff */
  const ARM_S=0.8,TBS_R=0.84;S.arm=add(L.B,[Math.cos(-60*D2R),Math.sin(-60*D2R)],10.6);
  /* train-blocking screw (42247): over the fourth wheel's spokes, 3.5 mm from its arbor on the 6 o'clock side, on a lobe of the balance lower bridge. Nearer the bridge's line it
     would come down through the third wheel (which runs between the bridge and the fourth wheel) or beside the escape wheel */
  const TBd=[0,1];S.tBlock=add(L.F,TBd,3.5);
  const EPa=Math.atan2(-(L.B[1]-S.cock[1]),L.B[0]-S.cock[0]);S.ep=[[3.6,0],[-1.6,1.5]].map(q=>add(L.B,ry(EPa,q)));   /* balance upper endstone cap: its screws in the cock */
  const PB=(r,a)=>[L.Ba[0]+r*Math.cos(a*D2R),L.Ba[1]+r*Math.sin(a*D2R)];S.cover=[PB(11.1,107),PB(11.6,288)];S.click=PB(8.9,250.6);
  S.dial=[30,150,270].map(a=>[39*Math.cos(a*D2R),39*Math.sin(a*D2R)]);
  S.seal=[2.2,-1.0].map(a=>[L.Fu[0]+7.6*Math.cos(a),L.Fu[1]+7.6*Math.sin(a)]);
  /* ---------- pillar plate 87.57 x 3.86 mm, mounting ring, lower train bridge ---------- */
  const pp=part('pillar',0);
  /* sustaining pawl pivot: 21.35 mm from the fusee (so the pawl reaches the sustaining ratchet, and its arbor clears the fusee wheel's tips at 20.42), where it can run up to solid train bridge
     (manual Sec. VIII, Op. 15 note) clear of the centre wheel, the chain and the opening round the balance */
  const SPv=[L.Fu[0]+21.35*Math.cos(60*D2R),L.Fu[1]+21.35*Math.sin(60*D2R)];
  R.pillarPlate=mesh(pp,discGeo(PP_R,PP_T,[[...L.C,1.5],[...L.T,0.8],[...L.F,1.2],[...L.Fu,1.4],hC(...L.Ud,0.8),hC(...L.Mw,0.8),[...L.Ba,1.9],[...L.E,1.3],[...SPv,0.72],
    ...S.ltb.map(q=>hT(...q,1.4)),...S.pil.map(q=>hC(...q,PSR)),...S.ring.map(q=>hT(...q,RSR)),...S.elc.map(q=>hT(...q,ESCAP)),...S.dial.map(q=>hC(...q,1.0))]),M.plate,0,y0,0);
  /* lower bushings and settings in the pillar plate (parts list, Fig. 110): centre, fusee, barrel; escape lower jewel. Proud 0.1 on the train side */
  const bushR=(p,x,z,y1,y2,ro,ri,mat)=>mesh(p,ringGeo(ro,ri,Math.abs(y2-y1)),mat||M.brass2,x,(y1+y2)/2,z);
  bushR(pp,...L.C,y0-0.1,0,1.5,0.78);bushR(pp,...L.Fu,y0-0.1,0,1.4,0.58);bushR(pp,...L.Ba,y0-0.1,0,1.9,1.43);bushR(pp,...L.E,y0-0.1,0,1.3,0.95,M.gilt);bushR(pp,...L.E,-1.2,0,0.95,0.58,M.ruby);   /* escape lower setting (42162) with its jewel */
  /* mounting ring (42057, Fig. 110) round the plate's edge, with a lip under its dial side held by three screws (42055) from the dial side; section and screw positions estimated */
  R.flange=mesh(pp,new THREE.LatheGeometry([V2(PP_R-0.1,y0),V2(47,y0),V2(47,-0.01),V2(PP_R-0.1,-0.01),V2(PP_R-0.1,y0)],160),M.plate);mesh(pp,discGeo(47,1.0,[[0,0,40.2],...S.ring.map(q=>hC(...q,RSR))]),M.plate,0,0.01,0);
  { const rg=new THREE.Group();rg.rotation.x=Math.PI;pp.add(rg);
    for(const q of S.ring)screw(rg,q[0],-q[1],-1.01,RSR,1.2,1.01+3.86-0.4);   /* through the lip and into the plate */
    /* the pillars' screws (42055) from the dial side, through the plate into the pillars (Fig. 110) */
    for(const q of S.pil)screw(rg,q[0],-q[1],0,PSR,1.6,3.86+3.2);
    /* escape lower endstone cap (42159) with its jewel and two screws (20762), on the dial side over the escape lower setting (Fig. 110) */
    endCap(rg,L.E[0],-L.E[1],[eu[0],-eu[1]],0,3.86-0.4); }
  /* lower train bridge on the dial side of the pillar plate, screwed from the dial side (manual Figs. 29, 67, 110); jewels and screw built in a flipped frame so they face the dial */
  const lt=part('ltb',8);R.ltb=mesh(lt,stadium(L.T,L.F,6,1.2,[[...L.T,0.57],[...L.F,0.57],...S.ltb.map(q=>hC(...q,1.4))]),M.plate,0,0,0);
  const ltf=new THREE.Group();ltf.rotation.x=Math.PI;lt.add(ltf);jewel(ltf,L.F[0],-L.F[1],-1.2);jewel(ltf,L.T[0],-L.T[1],-1.2);
  for(const q of S.ltb)screw(ltf,q[0],-q[1],-1.2,1.4,0.8,1.2+3.46);   /* two screws (42163; Ops. 7, 53) into the pillar plate */
  /* ---------- pillars (two measured on Fig. 2, two placed clear of the fusee wheel and balance) ---------- */
  const pl=part('pillars',-30);
  /* tapped at both ends: for its screw from the dial side through the pillar plate, and for the bridge screw at its top (3.5 mm deep) */
  const pillar=(x,z,top)=>{const hb=hT(0,0,PSR)[2],pr=[V2(0.01,y0-3.5),V2(hb,y0-3.5),V2(hb,y0),V2(3.4,y0),V2(3.4,y0-1.3),V2(2.9,y0-1.9),V2(2.7,(top+y0)*0.5),V2(2.3,top+2.4),V2(2.9,top+1.7),V2(2.9,top),V2(hb,top),V2(hb,top+3.5),V2(0.01,top+3.5)].reverse();
    mesh(pl,new THREE.LatheGeometry(pr,32),M.plateSolid,x,0,z);};
  PILLARS.train.forEach(([x,z])=>pillar(x,z,TB_U));pillar(...PILLARS.barrel,TB_T);
  /* ---------- upper train bridge (y TB_T..TB_U) and barrel bridge (y BB_T..TB_T). The barrel bridge sits on the train bridge and is cut around the
               balance; the train bridge's outline under it is not photographed, so it is drawn as a full disc ---------- */
  const tb=part('trainBridge',-62);
  const WSd=(()=>{const Fl=Math.hypot(...L.Fu);return[L.Fu[0]+7.2*L.Fu[0]/Fl,L.Fu[1]+7.2*L.Fu[1]/Fl];})();
  const TBc=[L.Ba[0]*22.56/18.56,L.Ba[1]*22.56/18.56],TBpoly=subtractCircle(discClip(BR_R,[],240),TBc,19.2);   /* cut round the barrel, which rises past the train bridge to the barrel bridge (Figs. 108, 110) */   /* opening round the balance staff and rollers, r 8.0: the escape and centre pivots (9.4 and 10.5 mm from the staff) stay in solid bridge */
  /* the train bridge leaves the fusee's top open to the barrel bridge, which holds the fusee's upper bushing (Figs. 24, 29, 67, 77; parts list 108-45): a pocket round the top plate
     (r 5.9), the winding stop (r 2.8 round it) and the stop-bar's outer end as it slides out over the last quarter turn, turned on by up to a winding tooth when the key lets go
     (0.3 clear). It stays under the barrel bridge, 0.5 mm inside its straight edge, where the top-view photograph shows the train bridge; the bar's sweep leads away from that edge */
  const FUpocket=(()=>{const fl=Math.hypot(...L.Fu),C=[[L.Fu,5.9],[WSd,2.8]],a0=Math.atan2(WSd[1]-L.Fu[1],WSd[0]-L.Fu[0]),o=[];
    for(let i=0;i<=60;i++){const n=0.3*i/60,x=3.2*smooth(1-n/0.25),a=a0-n*TAU,e=4.3+x,m=Math.hypot(e,2.5);   /* bar end (4.3 + travel out, 1.1-2.5 off its axis) in its direction a, and turned on by up to a tooth */
      for(const da of[0.03,-0.08,-0.19]){const b=a+da;C.push([[L.Fu[0]+(e-0.6)*Math.cos(b),L.Fu[1]+(e-0.6)*Math.sin(b)],Math.hypot(0.6,2.5)+0.3]);}}
    for(let i=0;i<240;i++){const v=[Math.cos(i/240*TAU),Math.sin(i/240*TAU)];let t=0;for(const[c,r]of C){const w=[L.Fu[0]-c[0],L.Fu[1]-c[1]],b=w[0]*v[0]+w[1]*v[1],d=b*b-(w[0]*w[0]+w[1]*w[1]-r*r);if(d>=0)t=Math.max(t,-b+Math.sqrt(d));}o.push([L.Fu[0]+t*v[0],L.Fu[1]+t*v[1]]);}return o;})();
  R.trainBridge=mesh(tb,polyGeo(TBpoly,3.1,[[...L.C,1.2],[...L.T,1],[...L.E,0.9],[...L.B,8.0],{pts:FUpocket},[...PILLARS.barrel,3.1],[...SPv,0.72],
    hC(...S.tb[0],PSR),hC(...S.tb[1],PSR),hT(...S.tb[2],PSR),hC(...S.bb[1],PSR),hT(...S.bb[2],PSR),...S.eb.map(q=>hT(...q,0.9)),...S.lb.map(q=>hC(...q,0.8)),hC(...S.blk,0.9),hT(...S.cock,2.8,0.8),
    hT(...S.arm,ARM_S),[...S.tBlock,0.72]],0.22),M.plate,0,TB_T,0);
  {const C=[10.53,35.06],A=[-0.9764,0.2161],P=[0.2161,0.9764],q=(a,p)=>[C[0]+a*A[0]+p*P[0],C[1]+a*A[1]+p*P[1]];   /* decal only round the serial, so it can't catch picks over the bridge's openings */
    const eg=mesh(tb,decalGeo([q(-5.5,-1.8),q(5.5,-1.8),q(5.5,1.8),q(-5.5,1.8)]),M.engraveT,0,TB_T-0.02,0);eg.userData.noShadow=true;eg.userData.noCap=true;eg.userData.decal=true;}
  /* three pillar screws (42055): two into their pillars; the third, where the top-view photograph shows it, has no pillar under it in the model (the fourth wheel is there), so it is drawn threaded into the bridge alone */
  S.tb.forEach(([x,z],i)=>screw(tb,x,z,TB_T,PSR,1.6,i<2?3.1+3.0:2.8));
  /* centre and third upper bushings in the train bridge (42166, 42167); they lie in the opening round the balance, so they can be oiled with the barrel bridge on (Sec. VIII, Op. 46) */
  bushR(tb,...L.C,TB_T-0.1,TB_U,1.2,0.78);bushR(tb,...L.T,TB_T-0.1,TB_U,1.0,0.58);
  /* balance wheel locking arm (42299, Fig. 9; fitted from 1947, Bureau of Ships sketch 023263): a flat arm on the train bridge under the balance, turning on its screw (37204) and
     washer (42251). Locked, its end lies under the rim and a pad on it bears on the rim; unlocked, it lies against its stop pin (42300) with the pad inside the rim, under the arm's
     sweep. Fig. 9 shows the arm, screw and positions, not the arm's shape or how it holds the rim: those are estimated. R.arm turns: rotation.y = armL locked, armL - 90 deg unlocked */
  { const ap=part('lockArm',-62),dL=unit(sub(S.arm,L.B)),U=[-dL[1],dL[0]],W=[-U[1],U[0]];R.armL=Math.atan2(-dL[1],dL[0]);
    R.arm=new THREE.Group();R.arm.position.set(S.arm[0],TB_T,S.arm[1]);ap.add(R.arm);R.arm.rotation.y=R.armL-Math.PI/2;
    mesh(R.arm,polyGeo(subtractCircle([[0,-0.5],[3.6,-0.5],[3.6,0.5],[0,0.5]],[0,0],1.1,true),0.45,[hC(0,0,ARM_S)]),M.blued,0,-0.45,0);
    mesh(R.arm,new THREE.BoxGeometry(0.8,0.88,0.8),M.blued,3.2,-0.89,0);   /* pad, 0.01 under the rim */
    mesh(ap,ringGeo(1.1,hC(0,0,ARM_S)[2],0.15),M.steel,S.arm[0],TB_T-0.525,S.arm[1]);screw(ap,...S.arm,TB_T-0.6,ARM_S,0.35,0.15+0.45+2.5);
    const pin=add(add(S.arm,U,2.0),W,0.82);cylBetween(ap,0.3,TB_T,TB_T-0.8,M.steel,...pin); }
  /* escape upper bridge with jewel and endstone cap */
  const eb=part('escBridge',-66);
  R.escBridge=mesh(eb,stadium([L.E[0]-eu[0]*1.5,L.E[1]-eu[1]*1.5],[L.E[0]+eu[0]*7.5,L.E[1]+eu[1]*7.5],4.0,0.9,[[...L.E,1.6],...S.eb.map(q=>hC(...q,0.9)),...S.ebc.map(q=>hT(...q,ESCAP))]),M.plate,0,TB_T-0.9,0);
  for(const q of S.eb)screw(eb,...q,TB_T-0.9,0.9,0.3,0.9+2.0);   /* two screws (20762; Op. 22) into the train bridge; low heads, 0.14 mm clear of the balance rim and timing weights that pass over them */
  /* escape upper setting (42162: gilt setting, pierced jewel) pressed into the bridge, and the endstone cap (42159) over it with its two screws (Fig. 110) */
  mesh(eb,ring(1.6,0.95,0.9),M.gilt,L.E[0],TB_T-0.45,L.E[1]);mesh(eb,ring(0.95,0.58,0.5),M.ruby,L.E[0],TB_T-0.65,L.E[1]);endCap(eb,...L.E,eu,TB_T-0.9,0.8);
  const bb=part('barrelBridge',-72);
  /* barrel bridge (the large upper plate of the photographs): everything except the 6 o'clock sector, with an S-shaped cut round the balance */
  const cutR=BAL_R+3.2;const BBpoly=subtractCircle(discClip(BR_R,[[14.5,-0.1,-1]],360),L.B,cutR);
  R.barrelBridge=mesh(bb,polyGeo(BBpoly,TB_T-BB_T,[[...L.Fu,1.6],[...L.Ba,1.95],...S.bb.map(q=>hC(...q,PSR)),...S.seal.map(q=>hT(...q,1.0)),...S.cover.map(q=>hT(...q,0.9)),hT(...S.click,0.6)],0.25),M.plate,0,BB_T,0);
  bushR(bb,...L.Fu,BB_T,TB_T,1.6,1.02);bushR(bb,...L.Ba,BB_T,TB_T,1.95,1.42);   /* fusee and barrel upper bushings (42164) */
  /* barrel bridge pillar screw (42055) into the barrel pillar; two barrel bridge screws: one through the train bridge into its pillar, one into the train bridge */
  S.bb.forEach((q,i)=>screw(bb,...q,BB_T,PSR,1.6,[3.4+3.0,3.4+3.1+3.0,3.4+2.6][i]));
  const eg2=mesh(bb,decalGeo(BBpoly),M.engraveB,0,BB_T-0.02,0);eg2.userData.noShadow=true;eg2.userData.noCap=true;eg2.userData.decal=true;
  /* winding stop on the underside of the barrel bridge, reached by the stop-bar in the fusee top */
  const Fl=Math.hypot(...L.Fu),fo=[L.Fu[0]/Fl,L.Fu[1]/Fl],WS=WSd;
  for(const o of[cylBetween(bb,0.9,TB_T,-20.45,M.steel,...WS),mesh(bb,new THREE.BoxGeometry(2.2,1,2.2),M.steel,WS[0],TB_T-0.5,WS[1])])o.userData.wstop=true;   /* a stud screwed into the barrel bridge (left-hand thread, Op. 42), down through the train bridge's pocket to the stop-bar's level (the bar is at -20.97..-20.52), clear above the chain's top turn; kept solid while the key winds (app.js) */
  /* ---------- dial (4 in), hands, motion work ---------- */
  const dl=part('dial',32);
  mesh(dl,discGeo(50.8,0.6,[[...L.C,2.4],[...L.F,1.2],[...L.Ud,1.2]]),M.brass2,0,3.3,0);
  const dtex=new THREE.CanvasTexture(dialCanvas());dtex.encoding=THREE.sRGBEncoding;dtex.anisotropy=8;
  /* the face lies 0.02 above the brass disc's top; polygon offset keeps it in front in the depth buffer, else the brass shows through in streaks when zoomed out */
  const dface=mesh(dl,new THREE.RingGeometry(2.4,50.8,128,1).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({map:dtex,metalness:0.35,roughness:0.42,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),0,3.92,0);dface.userData.noCap=true;
  /* three feet, each held by a dial screw (35756, Fig. 107) from the train side of the pillar plate into its tapped end */
  for(const q of S.dial){mesh(dl,new THREE.LatheGeometry([V2(0.01,2.0),V2(hT(0,0,1.0)[2],2.0),V2(hT(0,0,1.0)[2],0),V2(0.9,0),V2(0.9,3.3),V2(0.01,3.3)],20),M.brass,...[q[0],0,q[1]]);screw(pp,...q,y0,1.0,0.5,PP_T+1.8);}
  const hd=part('hands',48),hg=new THREE.MeshStandardMaterial({color:sc(0xd9b25e),metalness:1,roughness:0.2}),hb=new THREE.MeshStandardMaterial({color:sc(0x7a6240),metalness:1,roughness:0.45});   /* hg gilt (Roman), hb aged gilt (Soviet) */
  /* Hamilton hands as on the photographed dial: blued hour hand with a bulb two-thirds out and a long spear point, plain minute hand to the track, a long seconds hand with a spear counterpoise */
  const dk=(o,k)=>{const g=new THREE.Group();g.userData.dk=k;o.parent.add(g);g.add(o);return o;};   /* hands of one dial style ('hamilton', 'roman', 'swiss' or 'soviet'), grouped so app.js's per-mesh visibility leaves the choice alone */
  R.hour=new THREE.Group();R.hour.position.y=5.2;hd.add(R.hour);dk(mesh(R.hour,handGeo(41,1.2,2.5,'pear',0.68),M.blued),'hamilton');dk(mesh(R.hour,handGeo(29,1.3,6,'leaf'),hg),'roman');
  R.min=new THREE.Group();R.min.position.y=6.0;hd.add(R.min);dk(mesh(R.min,handGeo(47.5,1.5,3,'plain'),M.blued),'hamilton');dk(mesh(R.min,handGeo(45,0.9,8,'lance'),hg),'roman');
  dk(mesh(hd,cylY(2,1.2,24),M.blued,0,6.3,0),'hamilton');dk(mesh(hd,cylY(2.3,1.2,24),hg,0,6.3,0),'roman');dk(mesh(hd,cylY(1,0.5,6),M.steel,0,7.1,0),'roman');
  R.sec=new THREE.Group();R.sec.position.set(L.F[0],4.35,L.F[1]);   /* sub-dial hands under the hour hand's sweep (5.2) */hd.add(R.sec);dk(mesh(R.sec,handGeo(21,0.5,-10,'plain'),M.blued),'hamilton');dk(mesh(R.sec,handGeo(16.5,0.55,4,'plain'),M.blued),'roman');mesh(R.sec,cylY(0.9,0.8,16),M.blued,0,0.3,0);
  R.ud=new THREE.Group();R.ud.position.set(L.Ud[0],4.35,L.Ud[1]);hd.add(R.ud);dk(mesh(R.ud,handGeo(11,0.6,2.5,'plain'),M.blued),'hamilton');dk(mesh(R.ud,handGeo(10,0.6,2.5,'leaf'),hg),'roman');mesh(R.ud,cylY(0.9,0.8,16),M.blued,0,0.3,0);
  /* Nardin-pattern dials: pear hands (blued, or aged gilt on the Soviet copies); a long thin seconds hand to the track with a spear counterpoise */
  for(const[k,m]of[['swiss',M.blued],['soviet',hb]]){dk(mesh(R.hour,handGeo(31,1.4,6,'pear'),m),k);dk(mesh(R.min,handGeo(46.5,0.9,8,'pear'),m),k);dk(mesh(hd,cylY(2.3,1.2,24),m,0,6.3,0),k);
    dk(mesh(R.sec,handGeo(19,0.45,-8,'plain'),M.blued),k);dk(mesh(R.ud,handGeo(k==='swiss'?11.5:8.5,0.6,2.5,'plain'),M.blued),k);}
  const DTEX={hamilton:dtex};hd.traverse(o=>{if(o.userData.dk&&o.userData.dk!=='hamilton')o.visible=false;});
  mv.userData.dial=kind=>{if(!DTEX[kind]){const t=DTEX[kind]=new THREE.CanvasTexture(dialCanvas(kind));t.encoding=THREE.sRGBEncoding;t.anisotropy=8;}
    const m=dface.userData.mat0||dface.material;m.map=DTEX[kind];m.needsUpdate=true;hd.traverse(o=>{if(o.userData.dk)o.visible=o.userData.dk===kind;});};   /* the face's own material (app.js may be showing a see-through or faded copy of it, which follows on the next look()) */
  const mw=part('motion',16);
  R.cannon=arbor(mw,M,...L.C,{pin:{n:MW.cp,m:0.4,y:1.2,th:2,bore:0.85}});mesh(R.cannon,ring(1.4,0.85,4.6),M.steel,0,2.6,0);
  /* the minute wheel and the wind indicator wheel turn on posts (42085, 42084) fixed to the pillar plate by screws (35779) from its train side (Fig. 110) */
  const post=(x,z,r,top)=>{const hr=hT(0,0,0.8)[2];mesh(pp,new THREE.LatheGeometry([V2(0.01,2.0),V2(hr,2.0),V2(hr,0),V2(r,0),V2(r,top),V2(0.01,top)],24),M.steel,x,0,z);screw(pp,x,z,y0,0.8,0.4,PP_T+1.8);};
  post(...L.Mw,0.7,3.2);post(...L.Ud,0.5,4.1);
  R.minW=arbor(mw,M,...L.Mw,{wheel:{n:MW.mw,m:0.4,y:1.2,th:0.8,spokes:4,collet:0,bore:0.72},pin:{n:MW.mp,m:0.384,y:2.4,th:1.6,bore:0.72}});mesh(R.minW,ring(1.6,0.72,2.0),M.brass2,0,1.2,0);
  R.hourW=arbor(mw,M,...L.C,{wheel:{n:MW.hw,m:0.384,y:2.6,th:0.8,spokes:4,collet:0,bore:1.45}});mesh(R.hourW,ring(2.2,1.45,2.6),M.brass2,0,3.9,0);
  R.udW=arbor(mw,M,...L.Ud,{wheel:{n:UD.wheel,m:UD.m,y:1.5,th:0.8,spokes:4,collet:0,bore:0.55}});mesh(R.udW,ring(1.6,0.55,2.0),M.brass2,0,1.5,0);mesh(R.udW,ring(0.9,0.55,2.7),M.steel,0,2.85,0);cylBetween(R.udW,0.55,4.2,4.6,M.steel);   /* its pipe carries the hand */
  R.fp=arbor(mw,M,...L.Fu,{pin:{n:UD.pin,m:UD.m,y:1.5,th:2,bore:0.56}});
  /* ---------- fusee wheel (TRAIN.fu : centre pinion TRAIN.cp, module 0.417) with its maintaining work ---------- */
  const gw=part('gw',-8);
  R.gw=arbor(gw,M,...L.Fu,{wheel:{n:TRAIN.fu,m:MOD.fusee,y:-6.5,th:1.2,spokes:0,mat:M.copper,collet:0,bore:1.05}});
  mesh(R.gw,ring(17.3,15.2,1.8),M.copper,0,-8.0,0);mesh(R.gw,ring(15.2,1.05,0.5),M.copper,0,-7.35,0);
  /* sustaining spring: fixed to the fusee wheel by the pin at XZ -0.35 and curving back (against the running direction) to a free end on which the
     sustaining ratchet's pin presses, so the ratchet drives the wheel forward through it; e = XZ angle of the free end in the wheel's frame */
  const sspGeo=e=>{const s=new THREE.Shape(),r0=13.2,r1=13.9;s.absarc(0,0,r1,0.35,-e,true);s.absarc(0,0,r0,-e,0.35,false);
    const g=new THREE.ExtrudeGeometry(s,{depth:1.13,bevelEnabled:false,curveSegments:48});g.rotateX(-Math.PI/2);return g;};   /* 0.02 under the wheel's web */
  /* the sustaining spring (42016) and its fixing pin: its own part, turning with the fusee wheel, in whose recess it lies (Figs. 28, 71) */
  const ssP=part('sspring',-10);R.ssg=new THREE.Group();R.ssg.position.set(L.Fu[0],0,L.Fu[1]);ssP.add(R.ssg);
  const SSP_PIN=4.05;R.sspring=mesh(R.ssg,sspGeo(SSP_PIN-0.031),M.blued,0,-8.75,0);
  mesh(R.ssg,cylY(0.4,1.5,10),M.steel,13.55*Math.cos(0.35),-8.1,-13.55*Math.sin(0.35));
  /* sustaining ratchet wheel (42009): free on the fusee arbor, open in the middle round the fusee's winding ratchet and its screws (Fig. 28) */
  const srP=part('sratchet',-12);R.sr=new THREE.Group();R.sr.position.set(L.Fu[0],0,L.Fu[1]);srP.add(R.sr);
  const WPS=[0,1].map(k=>{const a=k*Math.PI+0.4;return[[12.9*Math.cos(a+0.85),12.9*Math.sin(a+0.85)],[12.5*Math.cos(a+0.6),12.5*Math.sin(a+0.6)]];});   /* the winding pawl springs' screws */
  mesh(R.sr,gearGeo(120,0.27,0.7,{ratchet:true,flip:true,bore:5,holes:WPS.flat().map(q=>hT(...q,0.4))}),M.steel,0,-9.45,0);   /* steep faces lead against the running direction, so the sustaining pawl holds it */
  mesh(R.sr,cylY(0.4,1.45,10),M.steel,13.55*Math.cos(SSP_PIN),-8.375,13.55*Math.sin(SSP_PIN));   /* pin pressing the sustaining spring's free end */
  /* two winding pawls on the sustaining ratchet wheel, their tips on the fusee's winding ratchet (rp 9.4): pushed by its steep faces when running, slipping over them when winding.
     Each is held in by a flat winding-pawl spring (42007) under two screws (42012), bearing on the arm's outer side near the pivot (Figs. 28, 69).
     wpsGeo: the spring for pawl angle th, its free part bent so the end stays on the arm; update() rebuilds it as the pawl rides the teeth in winding */
  const wpsGeo=(pw,th)=>{const u=pw.userData,bk=pawlBack(u.pts,0.96,u.q,th,[0,0]),E=[bk.p[0]+bk.n[0]*0.095,bk.p[1]+bk.n[1]*0.095],[,,r1]=u.sp,m=[(r1[0]+E[0])/2+bk.n[0]*0.25,(r1[1]+E[1])/2+bk.n[1]*0.25];
    return stripGeo([add(r1,unit(sub(m,r1)),0.45),m,E],0.3,0.3);};   /* the free part, from its foot (screwed down, drawn once) to its end on the arm */
  R.wp=[];for(let k=0;k<2;k++){const a=k*Math.PI+0.4,P=[12.3*Math.cos(a),12.3*Math.sin(a)],T=[8.95*Math.cos(a+0.3),8.95*Math.sin(a+0.3)],ln=Math.hypot(T[0]-P[0],T[1]-P[1])+0.2,pw=mesh(R.sr,pawlGeo(ln,0.9,0.5),M.steel,P[0],-10.05,P[1]);
    pw.userData.q=P;pw.userData.th0=Math.atan2(T[1]-P[1],-(T[0]-P[0]));pw.userData.pts=pawlPts(ln,0.9);R.wp.push(pw);
    const pol=(r,t)=>[r*Math.cos(a+t),r*Math.sin(a+t)],r0=pol(12.9,0.85),r1=pol(12.5,0.6);pw.userData.sp=[pol(13.0,0.97),r0,r1];
    pw.userData.spr=mesh(R.sr,wpsGeo(pw,pw.userData.th0),M.blued,0,-10.1,0);pw.userData.sprTh=pw.userData.th0;
    mesh(R.sr,stadium(r0,r1,1.0,0.3,[r0,r1].map(q=>hC(...q,0.4))),M.blued,0,-10.1,0);for(const q of[r0,r1])screw(R.sr,...q,-10.1,0.4,0.2,0.3+0.5);}   /* the spring's foot and its two screws (42012) */
  const sp=part('spawl',-12);cylBetween(sp,0.7,TB_U-0.7,y0+2,M.steel,...SPv);
  /* sustaining pawl: its tip rests in the sustaining ratchet's teeth (rp 16.2), trailing the pivot so the teeth can only pass it one way */
  const SPt=[L.Fu[0]+16.35*Math.cos(54*D2R),L.Fu[1]+16.35*Math.sin(54*D2R)];
  R.spawl=new THREE.Group();R.spawl.position.set(SPv[0],-9.45,SPv[1]);sp.add(R.spawl);mesh(R.spawl,pawlGeo(Math.hypot(SPt[0]-SPv[0],SPt[1]-SPv[1]),1.2,0.6),M.steel,0,0,0);
  R.spawl.userData.base=Math.atan2(SPt[1]-SPv[1],-(SPt[0]-SPv[0]));R.spawl.rotation.y=R.spawl.userData.base;R.spawl.userData.pts=pawlPts(Math.hypot(SPt[0]-SPv[0],SPt[1]-SPv[1]),1.2);
  /* sustaining pawl's spring (part of 42096, "complete with arbor and springs"; shape estimated): a wire from a collet on the arbor under the train bridge, bent round a
     steady pin in the bridge so it turns the pawl's tip into the ratchet. Drawn with the pawl at rest (R.spS turns with it); the pin stands in the bridge */
  R.spS=new THREE.Group();R.spS.position.set(SPv[0],0,SPv[1]);sp.add(R.spS);mesh(R.spS,ringGeo(1.2,0.7,0.6),M.steel,0,-19.6,0);
  mesh(R.spS,new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0.05,-19.6,1.15),new THREE.Vector3(0.35,-19.6,2.6),new THREE.Vector3(0.1,-19.6,4.3)),16,0.12,6,false),M.steel);
  cylBetween(tb,0.35,TB_U-0.6,-19.25,M.steel,SPv[0]-0.3,SPv[1]+3.9);
  /* ---------- going train (modules 0.29 / 0.30 / 0.3113; counts in TRAIN) ---------- */
  const m=MOD.train;
  const cw=part('cw',-26);R.cw=arbor(cw,M,...L.C,{wheel:{n:TRAIN.cw,m:MOD.centre,y:-5.2,th:1.0,spokes:5},pin:{n:TRAIN.cp,m:MOD.fusee,y:-6.5,th:2.6},ar:[TB_T-0.1,4.8],r:0.75});
  const tw=part('tw',-34);R.tw=arbor(tw,M,...L.T,{wheel:{n:TRAIN.tw,m,y:-8.6,th:0.9,spokes:4},pin:{n:TRAIN.tp,m:MOD.centre,y:-5.2,th:1.6},ar:[TB_T-0.1,1.2]});
  const fw=part('fw',-42);R.fw=arbor(fw,M,...L.F,{wheel:{n:TRAIN.fw,m:MOD.fourth,y:-7.46,th:0.9,spokes:4,cside:1},pin:{n:TRAIN.fp,m,y:-8.6,th:1.7},ar:[LB_T+0.7,4.6]});
  const E=ESC,ew=part('escW',-52,true);
  R.esc=arbor(ew,M,E.EX*ES,0,{pin:{n:TRAIN.ep,m:MOD.fourth,y:-6.96,th:2.0},ar:[TB_T-0.86,-0.05]});   /* pinion runs from the fourth wheel toward the plate: centred on the wheel, its top end reached the third wheel's teeth */
  R.esc.userData.wheel=escapeWheel(R.esc,M,ES,EY);
  /* ---------- balance lower bridge: lower balance cap jewel and the fourth wheel upper setting ---------- */
  /* a lobe for the train-blocking screw (42247, Sec. II, Fig. 110), whose head sits in a counterbore 0.6 deep in the bridge's top: the bridge is drawn as two layers, the top one cut for the counterbore */
  const lb=part('lowerBridge',-46),LBpoly=subtractCircle(stadiumPts(L.B,L.F,4.6),add(L.F,TBd,2.6),2.3,true),LBh=[[...L.B,1.2],[...L.F,1.2],...S.blc.map(q=>hT(...q,ESCAP))];
  R.lowerBridge=mesh(lb,polyGeo(LBpoly,0.6,[...LBh,[...S.tBlock,0.95]]),M.plate,0,LB_T,0);mesh(lb,polyGeo(LBpoly,2.4,[...LBh,hT(...S.tBlock,TBS_R)]),M.plate,0,LB_T+0.6,0);
  /* boss up to the train bridge, two screws (42055) from the train bridge's top into it (Op. 50) */
  mesh(lb,stadium(add(LBm,lbn,-1.1),add(LBm,lbn,1.1),3.0,LB_T-TB_U,S.lb.map(q=>hT(...q,0.8))),M.plate,0,TB_U,0);for(const q of S.lb)screw(lb,...q,TB_T,0.8,0.45,3.1+3.0);
  /* balance lower setting (42162) in the bridge, and the lower endstone cap (42159) with its screws on the bridge's underside (Fig. 110) */
  mesh(lb,ring(1.2,0.9,3.0),M.gilt,L.B[0],LB_T+1.5,L.B[1]);mesh(lb,ring(1.2,0.9,3.0),M.gilt,L.F[0],LB_T+1.5,L.F[1]);mesh(lb,ring(0.9,0.6,0.6),M.ruby,L.F[0],LB_T+1.0,L.F[1]);   /* and the fourth wheel upper setting (42161) */mesh(lb,ring(0.9,0.5,0.6),M.ruby,L.B[0],LB_T+2.6,L.B[1]);
  { const lbf=new THREE.Group();lbf.rotation.x=Math.PI;lb.add(lbf);endCap(lbf,L.B[0],-L.B[1],[lbu[0],-lbu[1]],-(LB_T+3),2.0,1.9); }
  /* train-blocking screw (42247, Sec. II, Fig. 110): threaded through the lower bridge's lobe. Screwed down, its head stops in the counterbore and its dog point stands between
     the fourth wheel's spokes, so the train can turn only until a spoke meets it; screwed up (as it runs), the chamfer on its head seats in the countersunk access hole in the
     train bridge. The thread (6.2 mm) stays in the bridge at both ends of its 5.6 mm travel. R.tbs.userData: seat heights and the dog point's place for blockRoom */
  { const bs=part('tblock',-46),r=TBS_R,h=0.9,c=0.25,rs=0.42,pt=0.176,d=pt*0.3,Lt=6.2,Ld=6.81,rd=0.25,pr=[V2(0.01,-h),V2(r-c,-h),V2(r,-h+c),V2(r,0),V2(rs,0)];
    const n=Math.floor(Lt/pt);for(let i=0;i<n;i++){const a=Lt-(n-i)*pt;pr.push(V2(rs-d,a+pt/2),V2(rs,a+pt));}pr.push(V2(rs-d,Lt),V2(rd,Lt+0.05),V2(rd,Ld),V2(0.01,Ld));
    R.tbs=new THREE.Group();R.tbs.position.set(...[S.tBlock[0],0,S.tBlock[1]]);bs.add(R.tbs);mesh(R.tbs,new THREE.LatheGeometry(pr,28),M.steel);
    mesh(R.tbs,new THREE.BoxGeometry(r*2.02,0.35,0.3),M.steelD,0,-h+0.155,0);
    const up=TB_U+h+0.03,down=LB_T+0.6;R.tbs.userData={up,down,turns:(down-up)/pt,rho:3.5,sig:Math.atan2(-TBd[1],TBd[0]),half:Math.asin((0.45+rd)/3.5)};R.tbs.position.y=up; }
  /* ---------- detent (manual Figs. 14, 90, 110; detent photograph in chronometerbook post 4). Beryllium-copper detent (parts list 42087): foot clamped to the
       support block, two-strip detent spring, cross-piece carrying the Z bracket of the Elinvar trip (passing) spring, blade, jewel block with the locking jewel,
       and the arm whose horn the trip spring rests on. It lies between the escape wheel and the balance lower bridge (Op. 82); the arm crosses over the trip spring
       and the horn drops to it (Fig. 14). Support block hung from the upper train bridge by one screw, with the stop button beside the jewel (Figs. 14, 90) ---------- */
  const dt=part('det',-48,true);
  R.det=new THREE.Group();R.det.position.set(E.Ft.x*ES,0,E.Ft.y*ES);dt.add(R.det);const fx=new THREE.Group();fx.position.copy(R.det.position);dt.add(fx);   /* moving about the point of flexure; fixed */
  const poly=(g,pts,ya,yb,mat,holes=[])=>{const s=new THREE.Shape();pts.forEach((p,i)=>{const x=(p.x-E.Ft.x)*ES,z=(p.y-E.Ft.y)*ES;i?s.lineTo(x,z):s.moveTo(x,z);});s.closePath();
    for(const[p,r]of holes){const h=new THREE.Path();h.absarc((p.x-E.Ft.x)*ES,(p.y-E.Ft.y)*ES,r,0,TAU,true);s.holes.push(h);}   /* holes: [unit-frame point, radius in mm] */
    const ge=new THREE.ExtrudeGeometry(s,{depth:yb-ya,bevelEnabled:false,curveSegments:12});ge.rotateX(Math.PI/2);ge.translate(0,yb,0);return mesh(g,ge,mat);};
  const Pc=E.pieces,Fx=E.fixed,Cu=M.copper;
  poly(fx,Fx.foot,-19.26,-17.36,Cu);poly(R.det,Pc.spring,-19.26,-18.76,Cu);poly(R.det,Pc.spring,-17.86,-17.41,Cu);poly(R.det,Pc.cross,-19.26,-17.36,Cu);   /* bottoms staggered so no two faces are coplanar */
  poly(R.det,Pc.blade,-18.21,-17.41,Cu);poly(R.det,Pc.block,-18.26,-17.36,Cu);poly(R.det,Pc.arm,-18.16,-17.86,Cu);poly(R.det,Pc.horn,-17.86,-17.41,Cu);poly(R.det,Pc.bracket,-17.86,-17.46,Cu,[[E.D(E.tR+0.01,E.nR+0.033),hT(0,0,0.22,0.07)[2]]]);
  poly(R.det,Pc.stone,-19.81,-17.33,M.ruby);
  poly(fx,Fx.blockMain,TB_U,-17.46,M.plateSolid,[[E.D(-1.2,-0.35),hT(0,0,0.9)[2]]]);poly(fx,Fx.blockFront,-18.26,-17.46,M.plateSolid);poly(fx,Fx.button,-18.16,-17.51,M.steel);
  /* screws in detent coordinates (t along the detent, n across it): block screw from the train bridge's top; clamp screw and two steady pins across the foot;
     detent-adjusting screw at the block's end; lock-adjusting screw and its clamp screw across the block's front, under the wheel; trip-spring screw on the bracket */
  const dd=new THREE.Group();dd.position.copy(R.det.position);dd.rotation.y=-Math.atan2(E.dirB.y,E.dirB.x);dt.add(dd);const T=(t,n)=>[t*ES,-n*ES];
  screw(dd,...T(-1.2,-0.35),TB_T,0.9,0.5,3.1+2.4);   /* detent support block screw (42056), through the train bridge into the block,  the train bridge is uncovered by the barrel bridge: fitted with the movement assembled (Op. 81) */
  const across=(g,t,n0,n1,r,y,mat)=>{const q=mesh(g,cylY(r,(n1-n0)*ES,16),mat,t*ES,y,-(n0+n1)/2*ES);q.rotation.x=Math.PI/2;return q;};
  across(dd,-0.75,0.083,0.083+1.4/ES,0.95,-18.31,M.steel);across(dd,-0.75,0.083,0.083+0.25/ES,1.25,-18.31,M.steel);for(const t of[-1.2,-0.3])across(dd,t,-0.2,0.12,0.22,-18.31,M.steel);
  across(dd,-0.75,-0.35,0.083,0.45,-18.31,M.steel);   /* the clamp screw's shank, through the foot into the block */
  for(const[r,l,x]of[[0.8,0.5,-1.5*ES-0.25],[0.35,1.2,-1.5*ES+0.6]]){const q=mesh(dd,cylY(r,l,16),M.steel,x,-18.61,0.3*ES);q.rotation.z=Math.PI/2;}   /* detent-adjusting screw: head, and shank into the block */
  for(const t of[E.BL-0.15,1.2]){across(dd,t,-0.3-0.3/ES,-0.3,0.42,-17.81,M.steel);across(dd,t,-0.3,-0.12,0.2,-17.81,M.steel);}   /* lock-adjusting screw and its clamp screw: heads and shanks */
  { const rp=E.D(E.tR+0.01,E.nR+0.033);screw(R.det,(rp.x-E.Ft.x)*ES,(rp.y-E.Ft.y)*ES,-17.86,0.22,0.25,0.4,0.07);   /* trip spring screw (1770): a fine thread in the bracket's 0.23 mm leg */ }
  R.pspring=mesh(dt,new THREE.BufferGeometry(),M.steel);
  /* ---------- balance (rim r 14.5, measured on the top-view photograph) and hairspring ---------- */
  const bl=part('bal',-80,true);
  R.staff=new THREE.Group();bl.add(R.staff);
  cylBetween(R.staff,0.45,CK_T+1.1,LB_T+2.98,M.steel,0,0,12);   /* lower pivot through its setting to the endstone */
  /* impulse roller (O.D. 0.249 in, as thick as the escape wheel, post 30) with its crescent: the large portion behind the impulse jewel, where each tooth
     drops in and meets the jewel, and the small portion ahead of it, which the teeth never enter (Ops. 76, 83). Shape angle = minus the unit-frame angle */
  const rR=E.rRoll*ES,ir=new THREE.Shape(),n0=-E.aI,n1=n0+0.6;ir.absarc(0,0,rR,n1,n0-0.16+TAU,false);ir.absarc(0,0,rR*0.86,n0-0.16,n0,false);ir.absarc(0,0,rR*0.55,n0,n1,false);
  const irg=new THREE.ExtrudeGeometry(ir,{depth:1.3,bevelEnabled:false,curveSegments:32});irg.rotateX(-Math.PI/2);irg.translate(0,-0.65,0);
  mesh(R.staff,irg,M.steel,0,EY-0.07,0);
  const pal=(ang,r0,r1,w,y,h)=>{const q=mesh(R.staff,new THREE.BoxGeometry(r1-r0,h,w),M.ruby,(r0+r1)/2*Math.cos(ang),y,(r0+r1)/2*Math.sin(ang));q.rotation.y=-ang;};
  pal(E.aIc,rR-0.9,E.rp*ES,E.wI*ES,EY-0.09,1.56);   /* the wheel centred on the impulse jewel, jewel showing above and below it (Op. 82) */
  mesh(R.staff,cylY(E.rDR*ES,0.6,32),M.steel,0,EY+1.2,0);pal(E.aD,E.rDR*ES-0.4,E.rd*ES,E.wD*ES,EY+1.2,0.7);
  mesh(R.staff,new THREE.CylinderGeometry(1.4,1.4,0.9,6),M.brass2,0,BAL_Y-1.7,0);
  const BR=BAL_R,BY=BAL_Y;R.balU=new THREE.Group();R.balU.position.y=BY;R.staff.add(R.balU);
  mesh(R.balU,ring(BR,BR-1.4,2.4),M.steel);
  /* the arm on the hub (Fig. 4): the hub (42186, on the staff) has a flange under the arm and a boss up through the arm's clearance hole; the cap (42248) over the arm
     and two hold-down screws (42249) through cap and arm into the flange. The arm is widened round the hub. Sizes estimated */
  const HD=[[1.7,0],[-1.7,0]];
  mesh(R.balU,polyGeo(subtractCircle([[-(BR-0.5),-1.2],[BR-0.5,-1.2],[BR-0.5,1.2],[-(BR-0.5),1.2]],[0,0],2.2,true),1.1,[[0,0,1.2],...HD.map(q=>hC(...q,0.4))]),M.invar,0,-0.55,0);
  mesh(R.balU,discGeo(2.2,0.6,[[0,0,0.45],...HD.map(q=>hT(...q,0.4))]),M.steel,0,0.55,0);cylBetween(R.balU,1.1,1.15,-0.9,M.steel,0,0,24);
  mesh(R.balU,polyGeo([...Array(64)].map((_,i)=>[2.2*Math.cos(i/64*TAU),2.2*Math.sin(i/64*TAU)]),0.35,[[0,0,1.15],...HD.map(q=>hC(...q,0.4))]),M.steel,0,-0.9,0);
  for(const q of HD)screw(R.balU,...q,-0.9,0.4,0.25,0.35+1.1+0.5);
  { const hs=[];for(let k=0;k<60;k++){if(k%30===0||k%30===2||k%30===28)continue;const a=k/60*TAU;hs.push([cylY(0.28,0.2,8),new THREE.Matrix4().compose(new THREE.Vector3((BR+0.05)*Math.cos(a),0,(BR+0.05)*Math.sin(a)),new THREE.Quaternion().setFromEuler(new THREE.Euler(0,-a,Math.PI/2)),new THREE.Vector3(1,1,1))]);}mesh(R.balU,mergeGeo(hs),M.steelD); }   /* none at the arm ends or under the weights' screws */
  const radial=(a,r0,len,rr,mat,seg=12)=>{const q=mesh(R.balU,cylY(rr,len,seg),mat,(r0+len/2)*Math.cos(a),0,(r0+len/2)*Math.sin(a));q.rotation.set(0,-a,Math.PI/2);return q;};
  const BW=[],bscrew=(a,len,rr,mat,mg,kind,off=0)=>BW.push({q:radial(a,BR+off,len,rr,mat),a,len,rr,mg,kind,off});
  /* balance screws per the parts list (p. 82): 6 of 0.049 in head height (125-130 mg), 2 of 0.080 in (200-205 mg), 2 of 0.101 in (250-255 mg), in diametric
     pairs about the quarters. The masses are for the moment of inertia below; the drawn heads are smaller than those masses need */
  for(const c of[Math.PI/2,-Math.PI/2])for(const[d,hh,mg]of[[-0.5,1.24,127.5],[-0.25,2.57,252.5],[0,2.03,202.5],[0.25,1.24,127.5],[0.5,1.24,127.5]])bscrew(c+d,hh,0.75,M.brass,mg);
  /* 2 timing weights (93 mg) and 2 vernier timing weights (10.5 mg) beside the arm ends, each a nut on a screw in one of the rim's holes (Fig. 3). Drawn at
     mid-travel, where the manual starts them (p. 70), off the rim by more than the 3 turns in that the rate panel allows */
  const WT=2/60*TAU;
  for(const c of[0,Math.PI])for(const[a,len,rr,mg,kind,off,sr]of[[c+WT,1.7,1.2,93,'t',0.55,0.4],[c-WT,1.3,0.65,10.5,'v',0.4,0.25]]){bscrew(a,len,rr,M.steelD,mg,kind,off);radial(a,BR-1.5,2*off+len+1.55,sr,M.steel,10);}
  /* moment of inertia of the uncut balance about the staff, in g·mm²: steel rim, hub and cap (7.9 mg/mm³), Invar arm (8.1), and the screws and weights at their
     parts-list masses, each spread along its drawn cylinder. The rim's holes, the weights' screws and the staff are left out */
  const I_FIX=(7.9*Math.PI*2.4*(BR**4-(BR-1.4)**4)/2+8.1*(2*BR-1)*1.1*2.4*((2*BR-1)**2+2.4**2)/12+7.9*Math.PI*(0.6*2.2**4+2.05*1.1**4+0.35*(2.2**4-1.15**4))/2)/1000;   /* rim, arm, and the hub's flange and boss and the cap (steel) */
  const inertia=(xt,xv)=>{let I=I_FIX;for(const w of BW){const d=BR+w.off+w.len/2+(w.kind==='t'?xt:w.kind==='v'?xv:0);I+=w.mg*(d*d+w.len*w.len/12+w.rr*w.rr/4)/1000;}return I;};
  /* the weights' thread pitch, set so that a full turn of a pair changes the rate by the manual's figures, about 40 s a day for the timing weights and 2.8 s
     for the verniers (p. 70). The period goes as √I, so moving a pair x mm out loses 86400·(dI/dx)·x/(2I) s a day */
  const I0=inertia(0,0),dIdx=k=>BW.reduce((s,w)=>s+(w.kind===k?2*w.mg*(BR+w.off+w.len/2)/1000:0),0);
  R.pitch={t:40*2*I0/86400/dIdx('t'),v:2.8*2*I0/86400/dIdx('v')};
  /* timing(nt,nv): turns both timing weights nt turns out and both verniers nv (negative: in), so the balance stays in poise, and returns the new moment */
  R.timing=(nt,nv)=>{const xt=nt*R.pitch.t,xv=nv*R.pitch.v;for(const w of BW)if(w.kind){const d=BR+w.off+w.len/2+(w.kind==='t'?xt:xv);w.q.position.set(d*Math.cos(w.a),0,d*Math.sin(w.a));}return inertia(xt,xv);};
  R.balS=new THREE.Group();R.balS.position.y=BY;R.balS.visible=false;R.staff.add(R.balS);
  mesh(R.balS,new THREE.BoxGeometry(2*BR-1,1.4,2.2),M.steel);mesh(R.balS,cylY(2.2,2.2,24),M.steel);
  const span=160*D2R,band=(a0,r0,r1)=>{const s=new THREE.Shape(),N=48;for(let i=0;i<=N;i++){const a=a0+span*i/N;i?s.lineTo(r1*Math.cos(a),r1*Math.sin(a)):s.moveTo(r1*Math.cos(a),r1*Math.sin(a));}
    for(let i=N;i>=0;i--){const a=a0+span*i/N;s.lineTo(r0*Math.cos(a),r0*Math.sin(a));}const g=new THREE.ExtrudeGeometry(s,{depth:2.4,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,-1.2,0);return g;};
  for(let k=0;k<2;k++){const a0=k*Math.PI;mesh(R.balS,band(a0,BR-1.6,BR-0.9),M.steel);mesh(R.balS,band(a0,BR-0.9,BR),M.brass);
    const wa=a0+span*0.62,w=mesh(R.balS,cylY(2.3,4.2,24),M.brass2,(BR+1.9)*Math.cos(wa),0,-(BR+1.9)*Math.sin(wa));w.rotation.set(0,wa,Math.PI/2);}
  /* helical hairspring: ~8 mm tall, ~5.5 mm radius, many turns (Fig. 2) */
  const spg=part('spr',-88,true);R.spring=mesh(spg,new THREE.BufferGeometry(),M.steel,0,BAL_Y-2.3,0);R.spring.rotation.x=Math.PI;
  mesh(spg,new THREE.BoxGeometry(2.4,0.9,1.8),M.gilt,5.5*0.3+0.6,CK_T+3.05,0);
  /* balance cock: massive bridge from a foot at the right-back (Fig. 2) over the balance */
  const ck=part('cock',-96);
  /* balance cock traced on the top-view photograph: a broad crescent whose outer edge follows the plate rim (top-left
     in the photo), a straight edge to the endstone over the staff and a concave arc back to the rim. Outline shifted
     by the cock's parallax so the endstone sits over the balance staff. */
  const COCK_POLY=[[25.38, 31.05], [26.19, 30.36], [26.99, 29.66], [27.77, 28.93], [28.53, 28.18], [29.26, 27.42], [29.98, 26.63], [30.68, 25.82], [31.35, 25.0], [32.0, 24.16], [32.63, 23.3], [33.24, 22.43], [33.82, 21.54], [34.38, 20.63], [34.92, 19.71], [35.43, 18.78], [35.92, 17.83], [36.38, 16.87], [36.81, 15.9], [37.22, 14.92], [37.6, 13.93], [37.96, 12.92], [38.29, 11.91], [38.59, 10.89], [38.87, 9.86], [39.12, 8.83], [39.34, 7.79], [39.53, 6.74], [39.69, 5.69], [39.83, 4.63], [39.94, 3.58], [32.87, 3.03], [26.51, 2.76], [20.15, 2.49], [13.87, 2.62], [8.04, 2.86], [5.77, 3.99], [5.53, 5.72], [6.88, 7.11], [13.2, 9.07], [17.2, 11.96], [19.38, 16.1], [20.84, 20.82], [21.82, 25.22]];
  R.cock=mesh(ck,polyGeo(COCK_POLY,2.6,[hC(...S.cock,2.8,0.8),...S.ep.map(q=>hT(...q,0.7))],0.3),M.plate,0,CK_T,0);   /* the staff's upper pivot runs in the setting pressed into the cock (not drawn: the staff is 0.7 mm from the cock's edge) */
  /* foot: a solid block under the outer part of the crescent, standing on the upper train bridge beside the barrel bridge's straight edge
     (the cock is mounted to the train bridge, manual Sec. II; its screw is where the top-view photograph shows it). Annular sector r 31-39.8,
     up to 32 deg, kept 0.25 mm off the barrel bridge edge z = 14.5 - 0.1x */
  const FOOT=[],edge=(r)=>{let lo=0,hi=32*D2R;for(let i=0;i<40;i++){const m=(lo+hi)/2;(r*Math.sin(m)-(14.75-0.1*r*Math.cos(m))>0)?hi=m:lo=m;}return hi;};
  { const a0=edge(39.8),a1=edge(31),A=32*D2R;for(let k=0;k<=16;k++){const a=a0+(A-a0)*k/16;FOOT.push([39.8*Math.cos(a),39.8*Math.sin(a)]);}
    for(let k=16;k>=0;k--){const a=a1+(A-a1)*k/16;FOOT.push([31*Math.cos(a),31*Math.sin(a)]);}}
  R.cockFoot=mesh(ck,polyGeo(FOOT,TB_T-CK_T-2.6,[hC(...S.cock,2.8,0.8)],0.2),M.plateSolid,0,CK_T+2.6,0);
  /* one balance cock screw (parts list 42192), at its position on the top-view photograph (p3map scr_cockfoot) */
  const Q=S.cock;screw(ck,...Q,CK_T,2.8,1.5,2.6+11.6+2.5,0.8);   /* through the cock and its foot into the train bridge */
  /* endstone plate over the staff: small steel plate with two screws and the cap jewel */
  const ep=new THREE.Group();ep.position.set(L.B[0],CK_T,L.B[1]);ep.rotation.y=Math.atan2(-(L.B[1]-Q[1]),L.B[0]-Q[0]);ck.add(ep);
  mesh(ep,polyGeo([[-2.5,-2.3],[4.9,-2.3],[4.9,2.3],[-2.5,2.3]],0.7,[hC(3.6,0,0.7),hC(-1.6,1.5,0.7)]),M.steel,0,-0.7,0);mesh(ep,cylY(1.0,0.3,16),M.ruby,0,-0.8,0);
  screw(ep,3.6,0,-0.7,0.7,0.4,0.7+1.8);screw(ep,-1.6,1.5,-0.7,0.7,0.4,0.7+1.8);   /* 20762, into the cock */
  /* ---------- fusee (8-3/4 turns), chain, barrel (radius 13.5, below the third wheel) ---------- */
  const fsP=part('fs',-16);const dx=L.Fu[0]-L.Ba[0],dz=L.Fu[1]-L.Ba[1],fd=Math.hypot(dx,dz);
  const fs=makeFusee(M,{yS:-19.86,yB:-10.9,rmin:6.5,rmax:14,N:FUSEE_TURNS,Rb:13.5,bT:TB_T+1.0,bB:-9.6,cT:-19.86,cB:-10.9,aT:BB_T,d:fd,cap:0.64,capR:5.6,screw,sbZ:-1.8,stopAng:Math.atan2(-fo[1],fo[0])-Math.atan2(-dz,dx)+Math.asin((0.7+0.9-1.8)/7.2)});   /* at full wind the stop-bar's side (half-width 0.7, 1.8 off the axis beside the arbor) meets the winding stop pin (r 0.9, 7.2 mm out) */
  fs.g.position.set((L.Fu[0]+L.Ba[0])/2,0,(L.Fu[1]+L.Ba[1])/2);fs.g.rotation.y=Math.atan2(-dz,dx);fsP.add(fs.g);R.fs=fs;
  /* setup ratchet, click and cover plate on the barrel arbor above the barrel bridge (manual Figs. 24, 80), measured on the top-view photograph:
     a bow-shaped cover straddling the arbor, ends ~13 mm out along 107 deg / 287 deg, the right end an arc about the arbor; the waist on the
     centre side just uncovers the ratchet teeth, and on the rim side a curved slot (r 7.1-7.95) shows the teeth and the click */
  const rt=part('ratchet',-76),P2=(r,a)=>[L.Ba[0]+r*Math.cos(a*D2R),L.Ba[1]+r*Math.sin(a*D2R)];
  const srw=mesh(rt,gearGeo(52,0.289,1.0,{ratchet:true,flip:true,bore:1.4}),M.steel,L.Ba[0],-28.01,L.Ba[1]);   /* steep faces meet the click against the mainspring's pull */
  cylBetween(rt,1.4,-29.66,-1,M.steel,L.Ba[0],L.Ba[1]);cylBetween(rt,2.3,-29.96,-28.51,M.steel,L.Ba[0],L.Ba[1],28);
  /* the barrel arbor's core inside the barrel, with the hook for the mainspring's inner end (Figs. 26, 75; arbor 42170). The spring's inner end lies at -90 deg in the
     fusee/barrel group's frame (mainspringGeo's start, turned by ms.rotation), so the hook is there, and the core stays 0.1 clear of the turning caps */
  { const ga=-Math.PI/2-fs.g.rotation.y,hk=mesh(rt,new THREE.BoxGeometry(0.5,2.4,0.9),M.steel,L.Ba[0]+2.55*Math.cos(ga),(TB_T+1.9-10.4)/2,L.Ba[1]+2.55*Math.sin(ga));hk.rotation.y=-ga;
    cylBetween(rt,2.4,TB_T+1.71,-10.3,M.steel,L.Ba[0],L.Ba[1],32); }
  mesh(rt,new THREE.BoxGeometry(2.2,3.0,2.2),M.steel,L.Ba[0],-31.46,L.Ba[1]);
  { const Pv=P2(8.9,250.6),Tp=P2(7.5,220),clk=mesh(rt,pawlGeo(Math.hypot(Tp[0]-Pv[0],Tp[1]-Pv[1])+0.3,1.3,0.8),M.steel,Pv[0],-28.01,Pv[1]);clk.rotation.y=Math.atan2(Tp[1]-Pv[1],-(Tp[0]-Pv[0]));
    /* turn the ratchet (it is fixed in running) so a steep face bears on the click's tip, then rest the click on it */
    const pr=ratchetProf(52,0.289,true),pts=pawlPts(Math.hypot(Tp[0]-Pv[0],Tp[1]-Pv[1])+0.3,1.3),ph=phaseAgainst(pr,pts,[Pv[0]-L.Ba[0],Pv[1]-L.Ba[1]],clk.rotation.y,-1);
    srw.rotation.y=ph.psi;clk.rotation.y=ph.th;
    /* setup pawl spring (42028, Figs. 17, 24, 80): a curved flat spring on two steady pins in the barrel bridge, bearing on the click's outer side (shape estimated) */
    const bk=pawlBack(pts,1.1,Pv,ph.th,L.Ba),E=[bk.p[0]+bk.n[0]*0.17,bk.p[1]+bk.n[1]*0.17],s0=P2(10.9,272),s1=P2(10.4,259);
    mesh(rt,stripGeo([s0,s1,[(s1[0]+E[0])/2+bk.n[0]*0.3,(s1[1]+E[1])/2+bk.n[1]*0.3],E],0.3,0.6),M.blued,0,-28.31,0);
    for(const q of[s0,s1])cylBetween(rt,0.25,-27.71,-27.16,M.steel,...q);}
  const nBefore=rt.children.length;
  { /* outline in polar coordinates about the arbor: left end arc, rim-side concave edge, right end, centre-side concave edge */
    const arc3=(a,b,c,n)=>{const[ax,az]=a,[bx,bz]=b,[cx2,cz2]=c,d=2*(ax*(bz-cz2)+bx*(cz2-az)+cx2*(az-bz)),
        ux=((ax*ax+az*az)*(bz-cz2)+(bx*bx+bz*bz)*(cz2-az)+(cx2*cx2+cz2*cz2)*(az-bz))/d,uz=((ax*ax+az*az)*(cx2-bx)+(bx*bx+bz*bz)*(ax-cx2)+(cx2*cx2+cz2*cz2)*(bx-ax))/d,
        r=Math.hypot(ax-ux,az-uz),t0=Math.atan2(az-uz,ax-ux),tm=Math.atan2(bz-uz,bx-ux);let t1=Math.atan2(cz2-uz,cx2-ux);
      const w=t=>((t-t0)%TAU+TAU)%TAU;let dt=w(t1);if(w(tm)>dt)dt-=TAU;const o=[];for(let k=1;k<n;k++){const t=t0+dt*k/n;o.push([ux+r*Math.cos(t),uz+r*Math.sin(t)]);}return o;};
    const TL=P2(12.8,69.4),BL=P2(13.1,145.6),BR=P2(12.97,249.2),TR=P2(12.61,325.9),pts=[],polar=(r0,r1,a0,a1,n)=>{const o=[];for(let k=0;k<=n;k++){const t=k/n;o.push(P2(lerp(r0,r1,t),lerp(a0,a1,t)));}return o;};
    pts.push(TL,...arc3(TL,P2(13.1,106),BL,20),BL,P2(9.8,153),...polar(8.7,8.7,163,236,30),BR,...polar(12.97,12.61,249.2,325.9,30).slice(1,-1),TR,...arc3(TR,P2(6.4,17),TL,40));
    const s=new THREE.Shape();pts.forEach(([x,z],i)=>i?s.lineTo(x,-z):s.moveTo(x,-z));s.closePath();
    for(const[x,z,r]of[[...L.Ba,2.6],...S.cover.map(q=>hC(...q,0.9)),hC(...S.click,0.6)]){const h=new THREE.Path();h.absarc(x,-z,r,0,TAU,true);s.holes.push(h);}
    /* the curved slot on the rim side, round-ended */
    { const r0=7.1,r1=7.95,rc=(r0+r1)/2,rh=(r1-r0)/2,a0=161,a1=236,sl=[...polar(r1,r1,a0,a1,30)],e1=P2(rc,a1),e0=P2(rc,a0);
      for(let k=1;k<12;k++){const t=a1*D2R+k/12*Math.PI;sl.push([e1[0]+rh*Math.cos(t),e1[1]+rh*Math.sin(t)]);}
      sl.push(...polar(r0,r0,a1,a0,30));for(let k=1;k<12;k++){const t=a0*D2R+Math.PI+k/12*Math.PI;sl.push([e0[0]+rh*Math.cos(t),e0[1]+rh*Math.sin(t)]);}
      const hp=new THREE.Path();sl.forEach(([x,z],i)=>i?hp.lineTo(x,-z):hp.moveTo(x,-z));hp.closePath();s.holes.push(hp);}
    const cvg=new THREE.ExtrudeGeometry(s,{depth:0.8,bevelEnabled:true,bevelThickness:0.15,bevelSize:0.15,bevelSegments:1,curveSegments:24});cvg.rotateX(-Math.PI/2);cvg.translate(0,0.15,0);
    R.cover=mesh(rt,cvg,M.plateSolid,0,-29.66,0);
    /* two screws near the ends, on feet down to the bridge; the pin near the lower-right corner is the setup pawl pivot */
    for(const q of S.cover){mesh(rt,ringGeo(1.1,hC(0,0,0.9)[2],1.4),M.plateSolid,q[0],-27.86,q[1]);screw(rt,...q,-29.66,0.9,0.55,1.1+1.4+2.2);}   /* 42056, into the barrel bridge */
    screw(rt,...S.click,-29.66,0.6,0.3,4.5);}   /* setup pawl pivot screw (42036): through the cover and the click's pivot into the barrel bridge */
  rt.children.slice(nBefore).forEach(o=>o.userData.driveHide=true);
  /* dust seal around the fusee arbor (manual Fig. 24): nickel body on a flange held by two screws, capped by three packing rings; the arbor's squared end takes the key */
  const wp=part('post',-78);
  mesh(wp,new THREE.LatheGeometry([V2(1.3,-27.18),V2(6.6,-27.18),V2(6.6,-28.36),V2(6.2,-28.76),V2(5.9,-28.96),V2(5.9,-32.56),V2(1.3,-32.56),V2(1.3,-27.18)].reverse(),56),M.plateSolid,L.Fu[0],0,L.Fu[1]);
  for(let k=0;k<3;k++){const a=-32.56-1.733*k,b=a-1.733;mesh(wp,new THREE.LatheGeometry([V2(3.4,a),V2(6.2,a),V2(6.45,a-0.22),V2(6.45,b+0.22),V2(6.2,b),V2(3.4,b),V2(3.4,a)].reverse(),56),M.brass2,L.Fu[0],0,L.Fu[1]);}
  const fl=mesh(wp,polyGeo([...Array(96)].map((_,i)=>[8.6*Math.cos(i/96*TAU),8.6*Math.sin(i/96*TAU)]),1.0,[[0,0,6.7],...S.seal.map(q=>hC(q[0]-L.Fu[0],q[1]-L.Fu[1],1.0))]),M.plateSolid,L.Fu[0],-28.18,L.Fu[1]);
  for(const q of S.seal)screw(wp,...q,-28.18,1.0,0.5,1.0+2.0);   /* dust seal screws (42056) into the barrel bridge */
  const sqP=part('sq',-84);R.sq=new THREE.Group();R.sq.position.set(L.Fu[0],0,L.Fu[1]);sqP.add(R.sq);cylBetween(R.sq,1.2,-36.56,-27.16,M.steel);mesh(R.sq,new THREE.BoxGeometry(2.4,1.6,2.4),M.steel,0,-37.16,0);
  /* winding key: its socket fits the fusee arbor square and turns it (never the barrel arbor, which the setup ratchet holds) */
  R.wkey=new THREE.Group();R.wkey.visible=false;R.sq.add(R.wkey);
  mesh(R.wkey,ringGeo(2.6,1.35,5),M.brass,0,-39.46,0);cylBetween(R.wkey,1.7,-41.96,-71,M.brass);   /* handle low enough to turn clear of the case's shield plate and its screws (lowest at -69.8, box.js) */
  const kbar=mesh(R.wkey,new THREE.CylinderGeometry(2.4,2.4,26,20),M.brass,0,-73,0);kbar.rotation.x=Math.PI/2;
  for(const sz of[13,-13])mesh(R.wkey,new THREE.SphereGeometry(2.4,18,12),M.brass,0,-73,sz);mesh(R.wkey,new THREE.SphereGeometry(3.4,18,12),M.brass,0,-73,0);
  /* ---------- tooth phasing: driver tooth centred on the line of centres, driven gap centred there ---------- */
  const ph=(A,pa,na,extA,B,pb,nb,extB)=>{const phi=Math.atan2(-(pb[1]-pa[1]),pb[0]-pa[0]);A.rotation.y=phi-0.375*TAU/na-(extA||0);B.rotation.y=phi+Math.PI-0.875*TAU/nb-(extB||0);};
  const U=R.gw.userData,CW=R.cw.userData,TW=R.tw.userData,FW=R.fw.userData,EW=R.esc.userData;
  ph(U.wheel,L.Fu,TRAIN.fu,0,CW.pin,L.C,TRAIN.cp,0);
  ph(CW.wheel,L.C,TRAIN.cw,0,TW.pin,L.T,TRAIN.tp,0);
  ph(TW.wheel,L.T,TRAIN.tw,0,FW.pin,L.F,TRAIN.fp,0);
  ph(FW.wheel,L.F,TRAIN.fw,0,EW.pin,L.E,TRAIN.ep,BETA+(-ESC.t0+0.03*ESC.P));
  ph(R.cannon.userData.pin,L.C,MW.cp,0,R.minW.userData.wheel,L.Mw,MW.mw,0);
  ph(R.minW.userData.pin,L.Mw,MW.mp,0,R.hourW.userData.wheel,L.C,MW.hw,0);
  ph(R.fp.userData.pin,L.Fu,UD.pin,0,R.udW.userData.wheel,L.Ud,UD.wheel,0);
  /* ---------- laid out (the textbooks' developed drawing): the barrel and fusee stay; each later arbor goes onto the barrel-fusee line at its real centre
       distance from the one before, so every pair still meshes; the escape wheel, detent and balance turn together about the escape arbor (by DEV.g) ---------- */
  const DEV=(()=>{const sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],fi=p=>Math.atan2(-p[1],p[0]),d=sub(L.Fu,L.Ba),l=Math.hypot(...d),w=[d[0]/l,d[1]/l],P={Fu:L.Fu};
    for(const[a,b]of[['Fu','C'],['C','T'],['T','F'],['F','E'],['E','B']]){const r=Math.hypot(...sub(L[b],L[a]));P[b]=[P[a][0]+w[0]*r,P[a][1]+w[1]*r];}
    return{w,P,fi,sub,g:fi(w)-fi(sub(L.B,L.E)),mid:[(L.Ba[0]+P.B[0])/2,(L.Ba[1]+P.B[1])/2],len:Math.hypot(...sub(P.B,L.Ba))};})();
  /* driven pinions: when a pair's line of centres turns by D, the driver standing, the pinion turns D(1 + n driver / n pinion) to stay in mesh (a coin rolled
     round a coin); the escape pinion less the turn of its frame. Taken within half a pitch */
  const DPH=[[CW.pin,'Fu','C',TRAIN.fu,TRAIN.cp,0],[TW.pin,'C','T',TRAIN.cw,TRAIN.tp,0],[FW.pin,'T','F',TRAIN.tw,TRAIN.fp,0],[EW.pin,'F','E',TRAIN.fw,TRAIN.ep,DEV.g]].map(([m,a,b,na,nb,x])=>{
    const p=TAU/nb,c=(DEV.fi(DEV.w)-DEV.fi(DEV.sub(L[b],L[a])))*(1+na/nb)-x;return{m,r0:m.rotation.y,c:(((c+p/2)%p)+p)%p-p/2};});
  const dOf=k=>DEV.sub(DEV.P[k],L[k]),dC=dOf('C'),dF=dOf('F'),dE=dOf('E'),EFP=['escW','det','bal','spr'].map(k=>parts[k]);
  const DMV=[[parts.cw,dC],[parts.motion,dC],[parts.hands,dC],[parts.tw,dOf('T')],[parts.fw,dF],[R.udW,[-dC[0],-dC[1]]],[R.fp,[-dC[0],-dC[1]]],[R.sec,DEV.sub(dF,dC)],[R.ud,[-dC[0],-dC[1]]]];
  for(const[o]of DMV)o.userData.xz0=[o.position.x,o.position.z];
  /* schematic plates for the laid-out view, drawn see-through (app.js): pillar plate and train bridge along the line, barrel bridge over the barrel and fusee,
     a cock over the balance on a foot, and pillars beside the line clear of the wheels. Not parts: no partName, so they can't be picked, listed or sectioned */
  const dp=new THREE.Group();mv.add(dp);
  { const w=DEV.w,n=[-w[1],w[0]],at=(t,s=0)=>[L.Ba[0]+w[0]*t+n[0]*s,L.Ba[1]+w[1]*t+n[1]*s],tB=DEV.len,tF=Math.hypot(...DEV.sub(L.Fu,L.Ba));
    mesh(dp,stadium(at(6),at(tB),44,PP_T),M.plate,0,y0,0);mesh(dp,stadium(at(tF),at(tB),44,TB_U-TB_T),M.plate,0,TB_T,0);mesh(dp,stadium(at(6),at(tF),44,TB_T-BB_T),M.plate,0,BB_T,0);
    mesh(dp,stadium(at(tB),at(tB+20.5),9,2.6),M.plate,0,CK_T,0);cylBetween(dp,2.8,TB_T,CK_T+2.6,M.plateSolid,...at(tB+20.5));
    for(const[t,s,top]of[[8,19,TB_T],[62,-19,TB_U],[tB-8,19,TB_U]])cylBetween(dp,2.6,y0,top,M.plateSolid,...at(t,s),32); }
  dp.traverse(o=>{if(o.isMesh){o.userData.devPlate=true;o.userData.noCap=true;}});
  /* ---------- API ---------- */
  mv.userData.parts=parts;mv.userData.R=R;mv.userData.DEV=DEV;
  mv.userData.explode=e=>{for(const k in parts)parts[k].position.y=parts[k].userData.off*e;for(const g of SCREWS)g.position.y=g.userData.y0-g.userData.lift*e;};
  /* develop(e): 0 as built, 1 laid out in a line; moves only x, z and the turn about y, so it combines with explode */
  mv.userData.develop=e=>{for(const[o,d]of DMV){o.position.x=o.userData.xz0[0]+d[0]*e;o.position.z=o.userData.xz0[1]+d[1]*e;}
    const a=DEV.g*e,c=Math.cos(a),s=Math.sin(a);for(const g of EFP){g.rotation.y=a;g.position.x=L.E[0]+dE[0]*e-(L.E[0]*c+L.E[1]*s);g.position.z=L.E[1]+dE[1]*e-(-L.E[0]*s+L.E[1]*c);}
    for(const q of DPH)q.m.rotation.y=q.r0+q.c*e;};
  mv.userData.balance=kind=>{R.balU.visible=kind!=='split';R.balS.visible=kind==='split';};
  /* train-blocking screw: with its dog point down between the fourth wheel's spokes, how many beats (E) the train can still turn before the next spoke meets it (blockRoom),
     and whether a spoke is under the dog point now, so it can't be screwed down (blockClear). The fourth wheel turns with its spokes' angles falling as E rises */
  { const u=R.tbs.userData,q=Math.PI/2,sp=E=>[0,1,2,3].map(j=>-(E*ESC.P)/ESC_PER.fw+FW.wheel.rotation.y+j*q-u.sig);
    u.vFace=(-7.46-0.45-(u.up+6.81))/(u.down-u.up);   /* screw travel (0 up, 1 down) at which the dog point reaches the fourth wheel's face */
    R.blockRoom=E=>Math.min(...sp(E).map(a=>(((a-u.half)%q)+q)%q))*ESC_PER.fw/ESC.P;
    R.blockClear=E=>sp(E).every(a=>Math.abs((((a%q)+q+q/2)%q)-q/2)>=u.half); }
  const RF=ESC_PER.fw,RT=ESC_PER.tw,RC=ESC_PER.cw,MR=MW.cp/MW.mw,HR=MR*MW.mp/MW.hw;   /* escape turns per fourth, third, centre turn; minute wheel and hour wheel per centre turn */
  let lastN=-1,srA=0,holding=false,lastD=1e9,eps=null,nW0=0,eps0=0;
  /* ratchet profiles; WPH: fusee-ratchet angle (in the sustaining ratchet's frame) at which the winding pawls bear on its steep faces */
  const FPR=ratchetProf(40,0.47,false),SRP=ratchetProf(120,0.27,true),WPH=phaseAgainst(FPR,R.wp[0].userData.pts,R.wp[0].userData.q,R.wp[0].userData.th0,1).psi;
  /* the sustaining spring's travel from loaded (running) to spent: 5 to 10 minutes of drive (Sec. IV) is 4.4 to 8.75 deg of the fusee wheel; 10 deg drawn, estimated */
  const SMAX=10*D2R;R.WPH=WPH;R.SMAX=SMAX;
  /* when winding starts the spring turns the sustaining ratchet back until a steep face meets the sustaining pawl */
  const holdBack=a=>{const q0=[SPv[0]-L.Fu[0],SPv[1]-L.Fu[1]],tr=psi=>{const q=toWheel(q0,[0,0],psi),th=seatPawl(R.spawl.userData.pts,q,R.spawl.userData.base-psi,SRP),t=R.spawl.userData.pts[PAWL_TIP],c=Math.cos(th),sn=Math.sin(th);return Math.hypot(q[0]+t[0]*c+t[1]*sn,q[1]-t[0]*sn+t[1]*c);};
    let b=a,r=tr(a);for(let i=0;i<60;i++){const nb=b-SRP.p/40,nr=tr(nb);if(nr>r+0.004)break;b=nb;r=Math.min(r,nr);}return b;};
  mv.userData.update=(s)=>{
    const P=E.P,esc=s.E*P;
    R.esc.rotation.y=-E.t0+0.03*P+esc;
    R.fw.rotation.y=-esc/RF;R.sec.rotation.y=-esc/RF;
    R.tw.rotation.y=esc/RT;
    const cA=esc/RC;R.cw.rotation.y=-cA;R.cannon.rotation.y=-cA;R.min.rotation.y=-cA;
    R.minW.rotation.y=cA*MR;R.hourW.rotation.y=-cA*HR;R.hour.rotation.y=-cA*HR;
    const gA=cA*TRAIN.cp/TRAIN.fu;R.gw.rotation.y=gA;R.ssg.rotation.y=gA;
    if(Math.abs(s.n-lastN)>0.0008){fs.setWind(s.n);lastN=s.n;}
    /* Maintaining work. Running: fusee -> winding ratchet -> winding pawls -> sustaining ratchet -> spring (loaded, d = 0) -> fusee wheel, so the sustaining ratchet turns
       with the fusee wheel, and the fusee sits eps past its n turns, where its ratchet's steep faces bear on the pawls (eps follows the train and any jump of the slider).
       Winding: the key turns the fusee back; the spring turns the sustaining ratchet back until the sustaining pawl holds it (holdBack), then relaxes as it alone drives the
       train; eps runs down to 0 with n, so the stop-bar meets the stop at full wind. When the key lets go, the mainspring turns the fusee forward until its ratchet catches
       the pawls, and drives the sustaining ratchet forward to load the spring again: nothing turns back */
    const base=fs.g.rotation.y+s.n*TAU,p=FPR.p,wrap=x=>((x%p)+p)%p,target=gA+WPH-base;if(eps===null)eps=wrap(target);
    if(!s.winding){if(holding){eps+=wrap(target-eps);holding=false;}else eps+=wrap(target-eps+p/2)-p/2;srA=gA;}
    else{if(!holding){holding=true;srA=holdBack(srA);nW0=s.n;eps0=eps;}eps=nW0>0?eps0*Math.min(1,s.n/nW0):0;}
    fs.fz.rotation.y=s.n*TAU+eps;const fzW=base+eps;
    R.sr.rotation.y=srA;
    { const d=Math.min(SMAX,gA-srA);if(Math.abs(d-lastD)>0.002){R.sspring.geometry.dispose();R.sspring.geometry=sspGeo(SSP_PIN+d-0.031);lastD=d;} }
    for(const pw of R.wp){const psi=fzW-srA,u=pw.userData;pw.rotation.y=seatPawl(u.pts,toWheel(u.q,[0,0],psi),u.th0-psi,FPR)+psi;
      if(Math.abs(pw.rotation.y-u.sprTh)>0.002){u.spr.geometry.dispose();u.spr.geometry=wpsGeo(pw,pw.rotation.y);u.sprTh=pw.rotation.y;}}   /* the spring follows its pawl */
    { const q=toWheel([SPv[0]-L.Fu[0],SPv[1]-L.Fu[1]],[0,0],srA);R.spawl.rotation.y=seatPawl(R.spawl.userData.pts,q,R.spawl.userData.base-srA,SRP)+srA;R.spS.rotation.y=R.spawl.rotation.y-R.spawl.userData.base; }
    R.staff.rotation.y=-s.th;
    { const b=s.blk||0,u=R.tbs.userData;R.tbs.position.y=u.up+(u.down-u.up)*b;R.tbs.rotation.y=b*u.turns*TAU;R.arm.rotation.y=R.armL-(1-(s.arm||0))*Math.PI/2; }   /* screwed down turns it clockwise seen from its head */
    R.det.rotation.y=s.lift/E.LEN;
    const fa=s.n*TAU+eps;R.fp.rotation.y=fa;R.sq.rotation.y=fa;R.wkey.visible=!!s.keyOn;   /* the arbor, its square and pinion turn with the fusee */
    const udA=fa*UD.pin/UD.wheel;R.udW.rotation.y=-udA;R.ud.rotation.y=-60*D2R-udA;
    fs.setBar(lerp(0,3.2,smooth(1-s.n/0.25)));
    if(s.msOn){const In=fs.I(s.n);fs.ms.geometry.dispose();fs.ms.geometry=mainspringGeo(1-In/fs.IN,2.6,13.1,-10.4,TB_T+1.9,6+fs.IN-In);}
    if(s.springOn){R.spring.geometry.dispose();R.spring.geometry=springGeo(5.5,6.7,14,s.th,0.17);}
    /* passing spring: rides with the detent while unlocking; bends aside by itself on the return swing */
    const[a0,am,tp2]=E.springPts(s),V=p=>new THREE.Vector3(p.x*ES,EY+1.3,p.y*ES);
    R.pspring.geometry.dispose();R.pspring.geometry=new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(V(a0),V(am),V(tp2)),20,0.1,5,false);
  };
  mv.userData.explode(0);
  return mv;
}

/* fusee + chain + barrel. Fusee's large end at the fusee wheel (pillar-plate side), small end toward the barrel bridge */
function makeFusee(M,c){
  const g=new THREE.Group(),drop=1-c.rmin/c.rmax,rf=m=>c.rmin/(1-drop*m/c.N),yf=m=>c.yS+(c.yB-c.yS)*m/c.N,cT=c.cT??c.bT+1.2,cB=c.cB??c.bB-1.2,yb=m=>cT+(cB-cT)*m/c.N,fx=c.d/2,bx=-c.d/2;
  const fz=new THREE.Group();fz.position.x=fx;fz.userData.partName='fusee';g.add(fz);
  const cap=c.cap??0.2,capR=c.capR??c.rmin-0.6,V2=(a,b)=>new THREE.Vector2(a,b),pr=[V2(1.05,c.yS)];   /* the boss on the small end (inside the chain, cap mm above the cone) is a disc of its own, tapped for the top plate's screws */
  const K=Math.round(c.N*28);for(let i=0;i<=K;i++){const m=c.N*i/K;pr.push(V2(rf(m)-0.4*(1-Math.cos(TAU*m))/2,yf(m)));}
  pr.push(V2(c.rmax+1.0,c.yB),V2(c.rmax+1.0,c.yB+0.5),V2(5,c.yB+0.5),V2(5,c.yB-1.1),V2(1.05,c.yB-1.1),V2(1.05,c.yS));   /* a recess in the large end holds a disc tapped for the winding ratchet's screws */
  mesh(fz,new THREE.LatheGeometry(pr,72),M.gilt);cylBetween(fz,1,c.aT??-33,-PP_T-0.1,M.steel,0,0,12);cylBetween(fz,0.55,-PP_T-0.1,2.5,M.steel,0,0,12);   /* arbor, then its lower pivot through the plate bushing to the wind-indicator pinion */
  /* winding ratchet wheel (42013) on the fusee's large end, fixed by two screws (42014) put in from below, their heads in the sustaining ratchet's open centre (Figs. 28, 69) */
  const WRS=[0.6,0.6+Math.PI].map(a=>[3.4*Math.cos(a),3.4*Math.sin(a)]);
  mesh(fz,gearGeo(40,0.47,0.5,{ratchet:true,bore:1,holes:WRS.map(q=>hC(...q,0.55))}),M.steel,0,c.yB+0.85,0);mesh(fz,discGeo(5,1.6,[[0,0,1.05],...WRS.map(q=>hT(...q,0.55))]),M.gilt,0,c.yB-1.1,0);
  if(c.screw){const fl=new THREE.Group();fl.rotation.x=Math.PI;fz.add(fl);for(const q of WRS)c.screw(fl,q[0],-q[1],-(c.yB+1.1),0.55,0.3,0.6+1.2);}
  /* fusee end plate (42019) under the fusee wheel, and the taper pin (42020) through the arbor below it that holds the stack on (Figs. 28, 70) */
  mesh(fz,ringGeo(2.6,1.02,0.5),M.steel,0,-5.63,0);{ const tp=mesh(fz,new THREE.CylinderGeometry(0.17,0.23,4.6,10),M.steel,0,-5.13,0);tp.rotation.z=Math.PI/2; }
  /* the fusee's top (Figs. 28, 73, 109): above the turned boss a slotted layer, the winding stop-bar (42024) in the slot beside the arbor, the stop-bar spring (42025) in a groove
     round the arbor with its end on the bar's inner end, and the top plate (42008) over them with two screws (27760). Built in the bar's frame: x along the bar, the slot across z */
  const sbR=new THREE.Group();sbR.rotation.y=c.stopAng||0;fz.add(sbR);const sbZ=c.sbZ||0,yT=c.yS-cap,zHi=sbZ+0.72,zLo=sbZ-0.75;
  const lay=(pts,holes)=>mesh(sbR,polyGeo(pts,0.5,holes||[]),M.gilt,0,yT-0.5,0);
  lay(subtractCircle(discClip(capR,[[zHi,0,1]],96),[0,0],4.55));lay(subtractCircle(discClip(capR,[[zLo,0,-1]],96),[0,0],4.55));   /* rim, either side of the slot */
  lay(discClip(4.05,[[zHi,0,1]],96),[[0,0,1.02],hC(0,3.2,0.55)]);lay(discClip(4.05,[[zLo,0,-1]],96),[hC(0,-3.3,0.55)]);   /* hub round the arbor, and its small side; the spring's groove is between (r 4.05-4.55) */
  mesh(sbR,discGeo(capR,cap,[[0,0,1.02],hT(0,3.2,0.55),hT(0,-3.3,0.55)]),M.gilt,0,c.yS-cap,0);   /* the boss */
  mesh(sbR,discGeo(capR-0.2,0.6,[[0,0,1.02],hC(0,3.2,0.55),hC(0,-3.3,0.55)]),M.gilt,0,yT-1.1,0);if(c.screw)for(const z of[3.2,-3.3])c.screw(sbR,0,z,yT-1.1,0.55,0.3,0.6+0.5+0.6);
  const stopBar=new THREE.Group();stopBar.position.y=yT-0.25;sbR.add(stopBar);   /* in the slot (0.02 off its floor, 0.03 under the plate), clear above the chain's top turn (links are 1 mm tall, centred on the cone's top edge) */
  mesh(stopBar,new THREE.BoxGeometry(8.4,0.45,1.4),M.steel,0.1,0,sbZ);   /* one bar in a slot beside the arbor (r 1), 0.1 clear of it; across the axis it would run through it */
  const bsp=mesh(sbR,new THREE.BufferGeometry(),M.steel,0,yT-0.25,0);let barX=null;
  /* the spring: fixed in the groove at one side of the slot, round the far side of the arbor, then into the slot against the bar's inner end, following it as it slides */
  const setBar=x=>{if(x===barX)return;barX=x;stopBar.position.x=x;const P=[];for(let k=0;k<=40;k++){const a=-0.2+(Math.PI+0.4)*k/40;P.push(new THREE.Vector3(4.3*Math.cos(a),0,4.3*Math.sin(a)));}
    const xe=0.1-4.2+x-0.15;P.push(new THREE.Vector3(-4.3,0,sbZ+0.55),new THREE.Vector3(xe,0,sbZ+0.3));bsp.geometry.dispose();bsp.geometry=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P),60,0.13,6,false);};
  setBar(0);
  const bz=new THREE.Group();bz.position.x=bx;bz.userData.partName='barrel';g.add(bz);
  const bw=new THREE.Mesh(new THREE.CylinderGeometry(c.Rb,c.Rb,Math.abs(c.bT-c.bB),72,1,true),M.brassDS);bw.position.y=(c.bT+c.bB)/2;bz.add(bw);bw.userData.driveGhost=true;bw.userData.noCap=true;
  for(const y of[c.bT+0.3,c.bB-0.3]){const cp=mesh(bz,ringGeo(c.Rb+0.7,1.5,0.6),M.gilt,0,y,0);cp.userData.driveGhost=true;}
  /* mainspring brace (42037, Fig. 75): a strip lining the wall where the spring's outer end hooks, as thick as the spring, between the caps' inner faces */
  { const s=new THREE.Shape(),a0=Math.PI/2-0.35,a1=Math.PI/2+0.35;s.absarc(0,0,c.Rb-0.02,a0,a1,false);s.absarc(0,0,c.Rb-0.45,a1,a0,true);
    const ge=new THREE.ExtrudeGeometry(s,{depth:Math.abs(c.bT-c.bB)-1.24,bevelEnabled:false,curveSegments:24});ge.rotateX(-Math.PI/2);mesh(bz,ge,M.steel,0,c.bT+0.62,0); }
  const ms=new THREE.Mesh(new THREE.BufferGeometry(),M.mspring);ms.position.x=bx;ms.userData.partName='mainspring';ms.userData.onlyDrive=true;ms.userData.noCap=true;g.add(ms);
  mesh(bz,ringGeo(4,1.5,0.4),M.brass2,0,c.bT-0.25,0).userData.driveGhost=true;
  /* barrel cap on the pillar-plate end, held by five screws (manual Figs. 26, 109) */
  for(let k=0;k<5;k++){const a=k/5*TAU;mesh(bz,cylY(0.7,0.4,10),M.steel,12.4*Math.cos(a),c.bB+0.2,12.4*Math.sin(a));}
  const I=m=>(c.rmin*(-c.N/drop)*Math.log(1-drop*m/c.N))/c.Rb;
  const MAX=900,geoA=new THREE.BoxGeometry(1.5,1.0,0.34),geoB=new THREE.BoxGeometry(1.25,0.7,0.56);
  const imA=new THREE.InstancedMesh(geoA,M.chain,MAX),imB=new THREE.InstancedMesh(geoB,M.chain2,MAX);g.add(imA,imB);imA.userData.partName=imB.userData.partName='chain';
  const mtx=new THREE.Matrix4(),t=new THREE.Vector3(),up=new THREE.Vector3(),nn=new THREE.Vector3(),pos=new THREE.Vector3();
  /* the chain's ends (Figs. 26, 28): a pin fastening it to the fusee's large end, and a hook at the barrel end whose nose meets the barrel's wall; placed from the chain's path */
  const endM=m=>{m.userData.partName='chain';g.add(m);return m;},fPin=endM(new THREE.Mesh(cylY(0.25,0.9,10),M.steel)),hkB=endM(new THREE.Mesh(new THREE.BoxGeometry(1.3,0.8,0.34),M.chain)),hkN=endM(new THREE.Mesh(cylY(0.28,0.3,10),M.chain));
  const Y=new THREE.Vector3(0,1,0),rad=(o,cx,p)=>new THREE.Vector3(p.x-cx,0,p.z).normalize();
  function setWind(n){
    fz.rotation.y=n*TAU;bz.rotation.y=I(n)*TAU;
    const P=[],V=(x,y,z)=>P.push(new THREE.Vector3(x,y,z));
    /* the straight run is the drums' common tangent: it leaves both at dl past their lowest point (when the chain's radii differ, joining the lowest points cuts into the larger drum) */
    const r0=rf(n)+0.2,rB=c.Rb+0.3,dl=Math.asin((rB-r0)/(fx-bx)),y0=yf(n),y1=yb(n);
    for(let m=c.N;m>n;m-=0.01){const a=-Math.PI/2+dl+TAU*(m-n),r=rf(m)+0.2;V(fx+r*Math.cos(a),yf(m),r*Math.sin(a));}
    const F0=[fx+r0*Math.sin(dl),-r0*Math.cos(dl)],B0=[bx+rB*Math.sin(dl),-rB*Math.cos(dl)];V(F0[0],y0,F0[1]);
    for(let s=0.1;s<1;s+=0.1)V(lerp(F0[0],B0[0],s),lerp(y0,y1,s),lerp(F0[1],B0[1],s));
    const In=I(n);for(let m=n;m>=0;m-=0.01){const b=-Math.PI/2+dl-TAU*(In-I(m));V(bx+rB*Math.cos(b),yb(m),rB*Math.sin(b));}
    let ia=0,ib=0,acc=0,next=0,k=0;const pitch=1.32;
    for(let i=1;i<P.length&&(ia<MAX&&ib<MAX);i++){const seg=P[i].distanceTo(P[i-1]);
      while(acc+seg>=next&&ia<MAX&&ib<MAX){const f=(next-acc)/seg;pos.lerpVectors(P[i-1],P[i],f);t.subVectors(P[i],P[i-1]).normalize();
        up.set(0,1,0).addScaledVector(t,-t.y).normalize();nn.crossVectors(t,up);mtx.makeBasis(t,up,nn).setPosition(pos);
        if(k%2===0)imA.setMatrixAt(ia++,mtx);else imB.setMatrixAt(ib++,mtx);k++;next+=pitch/2;}
      acc+=seg;}
    imA.count=ia;imB.count=ib;imA.instanceMatrix.needsUpdate=true;imB.instanceMatrix.needsUpdate=true;
    { const pf=P[0],uf=rad(0,fx,pf);fPin.position.copy(pf).addScaledVector(uf,-0.35);fPin.quaternion.setFromUnitVectors(Y,uf);   /* radial, into the cone under the end link */
      const pb=P[P.length-1],ub=rad(0,bx,pb);let j=P.length-2;while(j>0&&P[j].distanceTo(pb)<0.5)j--;const tb=new THREE.Vector3().subVectors(pb,P[j]).normalize(),nb=new THREE.Vector3().crossVectors(tb,Y).normalize();
      mtx.makeBasis(tb,Y,nb).setPosition(pb.clone().addScaledVector(tb,0.55));hkB.matrix.copy(mtx);hkB.matrix.decompose(hkB.position,hkB.quaternion,hkB.scale);
      hkN.position.copy(pb).addScaledVector(tb,0.9).addScaledVector(ub,-(rB-c.Rb)/2-0.01);hkN.quaternion.setFromUnitVectors(Y,ub);hkN.scale.set(1,(rB-c.Rb-0.02)/0.3,1); }
  }
  const IN=I(c.N);ms.rotation.y=Math.PI/2+TAU*(6+IN);
  return{g,fz,bz,setWind,rf,yf,fx,bx,ms,I,IN,stopBar,setBar};
}
