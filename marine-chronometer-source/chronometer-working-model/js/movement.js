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
   - Escapement proportions: plan view after Rawlings (chronometerbook.com post 4).
   - Third wheel, escape wheel position and the going-train modules (0.29 / 0.30 / 0.31): solved as a constraint problem
     so that every arbor clears every wheel and the barrel (solve.py).
   ===================================================================== */
const L={C:[0,0],T:[-4.86,12.11],F:[0,23.9],E:[8.0,16.97],B:[8.0,6.77],Fu:[11.59,-19.8],Ba:[-18.56,0.19],Ud:[0,-23.9],Mw:[-9.6,0]};
const PP_R=87.57/2,PP_T=3.86,BR_R=40.5;   /* bridge radius: the top-view photograph (the fusee wheel is hidden under it, as photographed) */          /* pillar plate; bridges */
const PILLARS={barrel:[-15.3,-26.58],train:[[-16.63,22.48],[18.17,26.92],[32.11,-4.1]]};
const COCK_FOOT=[28.3,6.4],BAL_R=14.5;
/* Fusee: 7 half-turns of the key per 24 h (manual Sec. III) = 6.857 h per fusee turn = fusee wheel 96 : centre pinion 14 */
const FUSEE_PER_HOUR=14/96,FUSEE_TURNS=8.75; /* 17-1/2 half turns for a full wind */
const UD={pin:8,wheel:98,m:0.2319};             /* wind indicator: wheel radius 12.4 mm, as Fig. 107 */
const MOD={fusee:0.4171,train:0.30,centre:0.29,fourth:0.31};
/* going train (counts give the ratios; centre-escape counts are not published): */
const TRAIN={cw:80,tp:10,tw:75,fp:10,fw:60,ep:8,ew:16};
const EU=(()=>{const dx=L.B[0]-L.E[0],dz=L.B[1]-L.E[1],l=Math.hypot(dx,dz);return[dx/l,dz/l];})(),BETA=Math.atan2(-EU[1],EU[0]);
/* Spring detent escapement in a unit 2D frame: balance at origin, escape wheel centre at x=EX, unit = escape-wheel radius.
   The detent's lift, the wheel's release and the passing spring's bending are solved from the contact of the discharge jewel with
   the passing spring's tip (tables below), so the parts touch where they are drawn. */
const ES=13.16/2,ESC=(()=>{
  /* balance motion 1-3/8 to 1-1/2 turns (manual Sec. II) -> amplitude ~255 deg each side */
  const NT=16,P=TAU/NT,EX=-1.55,A=255*D2R,G=3.5,rp=0.6,rRoll=0.48,rd=0.305,rDR=0.22,wI=0.06,wD=0.048,rho=0.1/ES,dL=0.03,t0=P/2,lockA=t0-2*P,aI=178*D2R,aD=256*D2R;
  /* rd: the discharge jewel reaches past the passing spring's tip (r 0.292) but stops short of the horn (r 0.343); dL: depth of lock on the stone */
  /* locking tooth at -33.75 deg (Rawlings plan: ~38 deg), the waiting tooth just outside the impulse jewel's path */
  const S={x:EX+Math.cos(lockA),y:Math.sin(lockA)};
  /* detent after the Rawlings plan: long blade from the foot to the locking jewel, then an arm bent toward the rollers */
  const dirB={x:0.46,y:0.887},Ft={x:S.x-1.4*dirB.x,y:S.y-1.4*dirB.y},hornAng=247*D2R,H={x:0.36*Math.cos(hornAng),y:0.36*Math.sin(hornAng)};
  const LEN=Math.hypot(H.x-Ft.x,H.y-Ft.y),vx=(H.x-Ft.x)/LEN,vy=(H.y-Ft.y)/LEN,nH={x:vy,y:-vx};   /* nH: direction the horn moves when unlocking */
  const nB={x:dirB.y,y:-dirB.x};                                                                /* nB: direction the locking jewel moves (away from the wheel); the passing spring bends along -nB */
  /* passing spring: parallel to the blade, pointing at the balance staff; its tip projects past the horn toward the staff. Root held on an angle bracket from the blade */
  const Pt={x:H.x+0.06*dirB.x-0.035*nH.x,y:H.y+0.06*dirB.y-0.035*nH.y},Ps0={x:H.x-0.9*dirB.x-0.035*nH.x,y:H.y-0.9*dirB.y-0.035*nH.y};
  const bT=(Ps0.x-S.x)*dirB.x+(Ps0.y-S.y)*dirB.y,bN=(Ps0.x-S.x)*nB.x+(Ps0.y-S.y)*nB.y;
  const aIc=aI+Math.asin(wI/2/rp);   /* impulse jewel centre line: its driven face runs through the pallet tip at aI */
  const rot=(q,l)=>{const d=-l/LEN,c=Math.cos(d),s=Math.sin(d);return{x:Ft.x+(q.x-Ft.x)*c-(q.y-Ft.y)*s,y:Ft.y+(q.x-Ft.x)*s+(q.y-Ft.y)*c};};
  const off=(p,a,b)=>({x:p.x+dirB.x*a+nB.x*b,y:p.y+dirB.y*a+nB.y*b});
  /* lift at which the stone's inner edge clears the tooth tips' path (with 0.02 mm to spare) */
  const clear=l=>Math.min(...[off(S,0,-dL),off(S,-0.055,-dL)].map(q=>{const r=rot(q,l);return Math.hypot(r.x-EX,r.y);}))>1+0.003;
  let lo=0,hi=0.3;for(let i=0;i<40;i++){const m=(lo+hi)/2;clear(m)?hi=m:lo=m;}const lRel=hi;
  /* contact tables over the balance angle. Active swing (th rising): the jewel's leading face pushes the spring tip, and with it the horn,
     along nH until the tip slides off the jewel's end; the detent then springs back to its banking. Return swing (th falling): the jewel
     bends the spring tip along -nB, the detent staying on its banking, until the tip slides off. */
  const TH0=-70*D2R,DT=0.02*D2R,NTB=5001,RET=1.5*D2R,LI=new Float32Array(NTB),PS=new Float32Array(NTB),reach=rd+0.5*rho;
  const push=(th,dir,sg)=>{const ps=aD+th,u={x:Math.cos(ps),y:Math.sin(ps)},m={x:-u.y,y:u.x},pm=Pt.x*m.x+Pt.y*m.y,dm=dir.x*m.x+dir.y*m.y;
    if(Pt.x*u.x+Pt.y*u.y<0)return 0;const d=sg>0?(wD/2+rho-pm)/dm:(pm+wD/2+rho)/dm;if(d<=0)return 0;
    const q={x:Pt.x+sg*d*dir.x,y:Pt.y+sg*d*dir.y};return q.x*u.x+q.y*u.y>reach?-d:d;};   /* negative: tip has slid off at that displacement */
  const hold=(th,dir,sg,d,sl)=>{const ps=aD+th,u={x:Math.cos(ps),y:Math.sin(ps)},m={x:-u.y,y:u.x},q={x:Pt.x+sg*d*dir.x,y:Pt.y+sg*d*dir.y};   /* after sliding off: stay clear of the jewel's end while it moves away */
    if(Math.abs(q.x*m.x+q.y*m.y)>=wD/2+rho||q.x*u.x+q.y*u.y>=reach)return d;return Math.min(sl,Math.max(d,(reach-Pt.x*u.x-Pt.y*u.y)/(sg*(dir.x*u.x+dir.y*u.y))));};
  { let sl=-1,thS=0,lm=0;for(let i=0;i<NTB;i++){const th=TH0+i*DT;if(sl<0){const d=push(th,nH,1);if(d<0){sl=lm;thS=th;}else{LI[i]=d;lm=d;continue;}}LI[i]=hold(th,nH,1,sl*Math.max(0,1-(th-thS)/RET),sl);}
    sl=-1;lm=0;for(let i=NTB-1;i>=0;i--){const th=TH0+i*DT;if(sl<0){const d=push(th,nB,-1);if(d<0){sl=lm;thS=th;}else{PS[i]=d;lm=d;continue;}}PS[i]=hold(th,nB,-1,sl*Math.max(0,1-(thS-th)/RET),sl);} }
  const tab=(T,th)=>{const f=(th-TH0)/DT,i=Math.floor(f);return i<0||i>=NTB-1?0:T[i]+(T[i+1]-T[i])*(f-i);};
  let thRel=0;for(let i=0;i<NTB;i++)if(LI[i]>=lRel){thRel=TH0+i*DT;break;}
  function state(p){
    const th=-A*Math.cos(TAU*p),ccw=Math.sin(TAU*p)>0;
    const lift=ccw?tab(LI,th):0,psDef=ccw?0:tab(PS,th);let prog;
    if(ccw&&th>thRel){const psi=aI+th,yp=rp*Math.sin(psi),xp=rp*Math.cos(psi),cx=EX+Math.sqrt(Math.max(0,1-yp*yp));
      const inL=xp<cx&&Math.cos(psi)<0,pf=-(th-thRel)*G,pc=inL?Math.asin(clamp(yp,-1,1))-t0:-1e9,phi=Math.max(pf,pc);prog=phi<=-P?1:-phi/P;}
    else prog=ccw?0:1;
    return{th,lift,psDef,prog};
  }
  /* passing spring as root, control point and tip (unit frame) for a state: rides with the detent, tip bent along -nB on the return swing */
  function springPts(s){const a0=rot(Ps0,s.lift),am=rot({x:(Ps0.x+Pt.x)/2,y:(Ps0.y+Pt.y)/2},s.lift),tp=rot(Pt,s.lift);tp.x-=nB.x*s.psDef;tp.y-=nB.y*s.psDef;return[a0,am,tp];}
  /* detent outline pieces (unrotated, 2D unit frame); rotate about Ft by -lift/LEN when drawing */
  const K=off(S,0.03,0.02),ax=(H.x-K.x),ay=(H.y-K.y),al=Math.hypot(ax,ay),an={x:-ay/al,y:ax/al};
  const armP=(p,w)=>[{x:K.x+an.x*w,y:K.y+an.y*w},{x:H.x+an.x*w*0.7,y:H.y+an.y*w*0.7},{x:H.x-an.x*w*0.7,y:H.y-an.y*w*0.7},{x:K.x-an.x*w,y:K.y-an.y*w}];
  const pieces={
    spring:[off(Ft,0,0.012),off(Ft,0.3,0.012),off(Ft,0.3,-0.012),off(Ft,0,-0.012)],
    blade:[off(Ft,0.28,0.04),off(S,0.04,0.04),off(S,0.04,-0.04),off(Ft,0.28,-0.04)],
    arm:armP(null,0.03),
    horn:[{x:H.x-nH.x*0.01+an.x*0.02,y:H.y-nH.y*0.01+an.y*0.02},{x:H.x+nH.x*0.05+an.x*0.02,y:H.y+nH.y*0.05+an.y*0.02},{x:H.x+nH.x*0.05-an.x*0.02,y:H.y+nH.y*0.05-an.y*0.02},{x:H.x-nH.x*0.01-an.x*0.02,y:H.y-nH.y*0.01-an.y*0.02}],
    bracket:[off(S,bT-0.035,0.03),off(S,bT+0.035,0.03),off(S,bT+0.035,bN+0.03),off(S,bT-0.035,bN+0.03)],
    stone:[off(S,0,0.03),off(S,-0.055,0.03),off(S,-0.055,-dL),off(S,0,-dL)]   /* the tooth tip rests on its face, dL below the tip */
  };
  return{NT,P,EX,A,rp,rRoll,rd,rDR,wI,wD,t0,aI,aIc,aD,S,Ft,H,Pt,Ps0,LEN,nH,nB,dirB,pieces,state,springPts,lRel,thRel,LI,PS,TH0,DT};
})();

/* polygon minus a circle that crosses its boundary: keep the part outside the circle, close it with the arc that runs through the polygon */
function subtractCircle(poly,c,r){
  const dense=[];for(let k=0;k<poly.length;k++){const a=poly[k],b=poly[(k+1)%poly.length],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/0.25));for(let t=0;t<n;t++)dense.push([a[0]+(b[0]-a[0])*t/n,a[1]+(b[1]-a[1])*t/n]);}
  const ins=p=>Math.hypot(p[0]-c[0],p[1]-c[1])<r,N=dense.length;
  let s0=-1;for(let k=0;k<N;k++)if(!ins(dense[k])&&ins(dense[(k+N-1)%N])){s0=k;break;}
  if(s0<0)return dense;                       /* circle does not cross the boundary */
  const run=[];let k=s0;while(!ins(dense[k%N])&&run.length<N){run.push(dense[k%N]);k++;}
  const aOf=p=>Math.atan2(p[1]-c[1],p[0]-c[0]),aE=aOf(run[run.length-1]),aS=aOf(run[0]);
  const inPoly=p=>{let w=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const[xi,zi]=poly[i],[xj,zj]=poly[j];if((zi>p[1])!==(zj>p[1])&&p[0]<(xj-xi)*(p[1]-zi)/(zj-zi)+xi)w=!w;}return w;};
  let d=((aS-aE)%TAU+TAU)%TAU;const mid=aE+d/2;if(!inPoly([c[0]+r*Math.cos(mid),c[1]+r*Math.sin(mid)]))d=d-TAU;
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
function polyGeo(pts,th,holes=[],bev=0){checkHoles('polyGeo',holes,(x,z)=>{let d=1e9;for(let k=0;k<pts.length;k++){const[ax,az]=pts[k],[bx,bz]=pts[(k+1)%pts.length],l2=(bx-ax)**2+(bz-az)**2,t=l2?clamp(((x-ax)*(bx-ax)+(z-az)*(bz-az))/l2,0,1):0;d=Math.min(d,Math.hypot(x-ax-t*(bx-ax),z-az-t*(bz-az)));}return d-bev;});
  const s=new THREE.Shape();pts.forEach(([x,z],i)=>i?s.lineTo(x,-z):s.moveTo(x,-z));s.closePath();
  for(const[hx,hz,hr]of holes){const h=new THREE.Path();h.absarc(hx,-hz,hr,0,TAU,true);s.holes.push(h);}
  const g=new THREE.ExtrudeGeometry(s,{depth:th-2*bev,bevelEnabled:bev>0,bevelThickness:bev,bevelSize:bev*0.8,bevelOffset:-bev*0.8,bevelSegments:1,curveSegments:32});g.rotateX(-Math.PI/2);g.translate(0,bev,0);return g;}
function stadium(p0,p1,w,th,holes=[]){const dx=p1[0]-p0[0],dz=p1[1]-p0[1],l=Math.hypot(dx,dz),nx=-dz/l*w/2,nz=dx/l*w/2,pts=[];
  const a0=Math.atan2(nz,nx);for(let i=0;i<=16;i++){const a=a0+Math.PI*i/16;pts.push([p0[0]+w/2*Math.cos(a),p0[1]+w/2*Math.sin(a)]);}
  for(let i=0;i<=16;i++){const a=a0+Math.PI+Math.PI*i/16;pts.push([p1[0]+w/2*Math.cos(a),p1[1]+w/2*Math.sin(a)]);}return polyGeo(pts,th,holes);}

function buildMovement(M){
  const mv=new THREE.Group(),parts={},R={};const V2=(a,b)=>new THREE.Vector2(a,b);
  const part=(name,off,ef)=>{const g=new THREE.Group();g.userData.off=off;g.userData.partName=name;mv.add(g);parts[name]=g;
    if(ef){const e=new THREE.Group();e.position.set(L.B[0],0,L.B[1]);e.rotation.y=BETA;g.add(e);g.userData.ef=e;return e;}return g;};
  const screw=(p,x,z,y,r=2.2,h=1.1)=>{const c=Math.min(0.35,r*0.14),pr=[V2(0.01,0),V2(r,0),V2(r,-h+c),V2(r-c,-h),V2(0.01,-h)].reverse();
    const hd=mesh(p,new THREE.LatheGeometry(pr,28),M.steel,x,y,z);hd.userData.screw=r;const sl=mesh(p,new THREE.BoxGeometry(r*2.02,Math.min(0.55,h*0.45),Math.max(0.35,r*0.2)),M.steelD,x,y-h+Math.min(0.55,h*0.45)/2-0.02,z);sl.rotation.y=(x*7+z*3)%3;};
  const ring=ringGeo;R.ring=ring;
  const jewel=(p,x,z,y,cap)=>{mesh(p,ring(2.1,1.0,0.5),M.gilt,x,y-0.25,z);mesh(p,ring(0.95,0.57,0.25),M.ruby,x,y-0.6,z);   /* bar-hole jewel: setting and pierced stone */
   
    if(cap){for(let k=0;k<2;k++){const a=k*Math.PI+0.7;mesh(p,cylY(0.5,0.5,10),M.steel,x+2.7*Math.cos(a),y-0.25,z+2.7*Math.sin(a));}}};
  const y0=-PP_T;
  /* ---------- pillar plate 87.57 x 3.86 mm, movement ring, lower train bridge ---------- */
  const pp=part('pillar',0);
  /* sustaining pawl pivot: 21 mm from the fusee (so the pawl reaches the sustaining ratchet), where its arbor can run up to solid train bridge
     (manual Sec. VIII, Op. 15 note) clear of the centre wheel, the chain and the opening round the balance */
  const SPv=[L.Fu[0]+21*Math.cos(60*D2R),L.Fu[1]+21*Math.sin(60*D2R)];
  R.pillarPlate=mesh(pp,discGeo(PP_R,PP_T,[[...L.C,1.5],[...L.T,0.8],[...L.F,1.2],[...L.Fu,1.4],[...L.Ud,0.57],[...L.Mw,0.72],[...L.Ba,1.9],[...L.E,1.3],[...SPv,0.72]]),M.plate,0,y0,0);
  /* lower bushings and settings in the pillar plate (parts list, Fig. 110): centre, fusee, barrel; escape lower jewel. Proud 0.1 on the train side */
  const bushR=(p,x,z,y1,y2,ro,ri,mat)=>mesh(p,ringGeo(ro,ri,Math.abs(y2-y1)),mat||M.brass2,x,(y1+y2)/2,z);
  bushR(pp,...L.C,y0-0.1,0,1.5,0.78);bushR(pp,...L.Fu,y0-0.1,0,1.4,0.58);bushR(pp,...L.Ba,y0-0.1,0,1.9,1.43);bushR(pp,...L.E,y0-0.1,0,1.3,0.58,M.gilt);
  R.flange=mesh(pp,ringGeo(47,PP_R-0.1,2.2),M.plate,0,y0+1.1,0);
  /* lower train bridge on the dial side of the pillar plate, screwed from the dial side (manual Figs. 29, 67, 110); jewels and screw built in a flipped frame so they face the dial */
  const lt=part('ltb',8);R.ltb=mesh(lt,stadium(L.T,L.F,6,1.2,[[...L.T,0.57],[...L.F,0.57]]),M.plate,0,0,0);
  const ltf=new THREE.Group();ltf.rotation.x=Math.PI;lt.add(ltf);jewel(ltf,L.F[0],-L.F[1],-1.2);jewel(ltf,L.T[0],-L.T[1],-1.2);
  screw(ltf,(L.T[0]+L.F[0])/2,-(L.T[1]+L.F[1])/2,-1.2,1.4,0.8);
  /* ---------- pillars (two measured on Fig. 2, two placed clear of the fusee wheel and balance) ---------- */
  const pl=part('pillars',-30);
  const pillar=(x,z,top)=>{const pr=[V2(0.01,y0),V2(3.4,y0),V2(3.4,y0-1.3),V2(2.9,y0-1.9),V2(2.7,(top+y0)*0.5),V2(2.3,top+2.4),V2(2.9,top+1.7),V2(2.9,top),V2(0.01,top)].reverse();
    mesh(pl,new THREE.LatheGeometry(pr,32),M.plateSolid,x,0,z);};
  PILLARS.train.forEach(([x,z])=>pillar(x,z,-26));pillar(...PILLARS.barrel,-29);
  /* ---------- upper train bridge (y -29..-26) and barrel bridge (y -33..-29). The barrel bridge sits on the train bridge and is cut around the
               balance; the train bridge's outline under it is not photographed, so it is drawn as a full disc ---------- */
  const tb=part('trainBridge',-62);
  const WSd=(()=>{const Fl=Math.hypot(...L.Fu);return[L.Fu[0]+7.2*L.Fu[0]/Fl,L.Fu[1]+7.2*L.Fu[1]/Fl];})();
  const TBpoly=discClip(BR_R,[],240);   /* opening round the balance staff and rollers, r 9.1: the centre and escape pivots (10.5 and 10.2 mm from the staff) stay in solid bridge */
  R.trainBridge=mesh(tb,polyGeo(TBpoly,3,[[...L.C,1.2],[...L.T,1],[...L.E,0.9],[...L.B,9.1],[...L.Fu,1.3],[...L.Ba,1.7],[...WSd,1.0],[...PILLARS.barrel,3.1],[...SPv,0.72]],0.22),M.plate,0,-29,0);
  PILLARS.train.slice(0,2).forEach(([x,z])=>screw(tb,x,z,-29,2.9,1.6));screw(tb,-8.5,27.7,-29,2.9,1.6);
  /* centre and third upper bushings in the train bridge (42166, 42167); they lie in the opening round the balance, so they can be oiled with the barrel bridge on (Sec. VIII, Op. 46) */
  bushR(tb,...L.C,-29.1,-26,1.2,0.78);bushR(tb,...L.T,-29.1,-26,1.0,0.58);
  /* escape upper bridge with jewel and endstone cap */
  const eb=part('escBridge',-66);const eo=[L.E[0]-L.B[0],L.E[1]-L.B[1]],el=Math.hypot(...eo),eu=[eo[0]/el,eo[1]/el];
  R.escBridge=mesh(eb,stadium([L.E[0]-eu[0]*1.5,L.E[1]-eu[1]*1.5],[L.E[0]+eu[0]*7.5,L.E[1]+eu[1]*7.5],4.0,0.9),M.plate,0,-29.9,0);
  screw(eb,L.E[0]+eu[0]*6,L.E[1]+eu[1]*6,-29.9,0.9,0.5);
  /* escape upper setting and endstone cap with its two screws, kept on the 4 mm bridge */
  mesh(eb,ring(1.6,0.3,0.5),M.gilt,L.E[0],-30.15,L.E[1]);mesh(eb,cylY(0.95,0.25,16),M.ruby,L.E[0],-30.5,L.E[1]);
  for(const k of[1,-1]){const q=[L.E[0]+eu[0]*2.4-eu[1]*k,L.E[1]+eu[1]*2.4+eu[0]*k];mesh(eb,cylY(0.45,0.5,10),M.steel,q[0],-30.15,q[1]);}
  const bb=part('barrelBridge',-72);
  /* barrel bridge (the large upper plate of the photographs): everything except the 6 o'clock sector, with an S-shaped cut round the balance */
  const cutR=BAL_R+3.2;const BBpoly=subtractCircle(discClip(BR_R,[[14.5,-0.1,-1]],360),L.B,cutR);
  R.barrelBridge=mesh(bb,polyGeo(BBpoly,4,[[...L.Fu,1.1],[...L.Ba,1.5]],0.25),M.plate,0,-33,0);
  screw(bb,...PILLARS.barrel,-33,2.9,1.6);screw(bb,...PILLARS.train[2],-33,2.9,1.6);screw(bb,29.24,-12.28,-33,2.9,1.6);
  const eg2=mesh(bb,decalGeo(BBpoly),M.engraveB,0,-33.02,0);eg2.userData.noShadow=true;eg2.userData.noCap=true;eg2.userData.decal=true;
  /* winding stop on the underside of the barrel bridge, reached by the stop-bar in the fusee top */
  const Fl=Math.hypot(...L.Fu),fo=[L.Fu[0]/Fl,L.Fu[1]/Fl],WS=WSd;
  cylBetween(bb,0.9,-29,-20.35,M.steel,...WS);mesh(bb,new THREE.BoxGeometry(2.2,1,2.2),M.steel,WS[0],-29.5,WS[1]);
  /* ---------- dial (4 in), hands, motion work ---------- */
  const dl=part('dial',32);
  mesh(dl,discGeo(50.8,0.6,[[...L.C,2.4],[...L.F,1.2],[...L.Ud,1.2]]),M.brass2,0,3.3,0);
  const dtex=new THREE.CanvasTexture(dialCanvas());dtex.encoding=THREE.sRGBEncoding;dtex.anisotropy=8;
  const dface=mesh(dl,new THREE.RingGeometry(2.4,50.8,128,1).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({map:dtex,metalness:0.35,roughness:0.42}),0,3.92,0);dface.userData.noCap=true;
  for(const a of[30,150,270])cylBetween(dl,0.9,0,3.3,M.brass,39*Math.cos(a*D2R),39*Math.sin(a*D2R));
  const hd=part('hands',48);
  R.hour=new THREE.Group();R.hour.position.y=5.2;hd.add(R.hour);mesh(R.hour,handGeo(30,2.3,6,'spade'),M.blued);
  R.min=new THREE.Group();R.min.position.y=6.0;hd.add(R.min);mesh(R.min,handGeo(44,1.6,8,'plain'),M.blued);
  mesh(hd,cylY(2,1.2,24),M.blued,0,6.3,0);
  R.sec=new THREE.Group();R.sec.position.set(L.F[0],4.35,L.F[1]);   /* sub-dial hands under the hour hand's sweep (5.2) */hd.add(R.sec);mesh(R.sec,handGeo(11.5,0.6,3.5,'plain'),M.blued);mesh(R.sec,cylY(0.9,0.8,16),M.blued,0,0.3,0);
  R.ud=new THREE.Group();R.ud.position.set(L.Ud[0],4.35,L.Ud[1]);hd.add(R.ud);mesh(R.ud,handGeo(10.5,0.7,2.5,'plain'),M.blued);mesh(R.ud,cylY(0.9,0.8,16),M.blued,0,0.3,0);
  const mw=part('motion',16);
  R.cannon=arbor(mw,M,...L.C,{pin:{n:12,m:0.4,y:1.2,th:2,bore:0.85}});mesh(R.cannon,ring(1.4,0.85,4.6),M.steel,0,2.6,0);
  R.minW=arbor(mw,M,...L.Mw,{wheel:{n:36,m:0.4,y:1.2,th:0.8,spokes:4},pin:{n:10,m:0.384,y:2.4,th:1.6},ar:[0,3.2],r:0.7});
  R.hourW=arbor(mw,M,...L.C,{wheel:{n:40,m:0.384,y:2.6,th:0.8,spokes:4,collet:0,bore:1.45}});mesh(R.hourW,ring(2.2,1.45,2.6),M.brass2,0,3.9,0);
  R.udW=arbor(mw,M,...L.Ud,{wheel:{n:UD.wheel,m:UD.m,y:1.5,th:0.8,spokes:4},ar:[y0,4.6]});
  R.fp=arbor(mw,M,...L.Fu,{pin:{n:UD.pin,m:UD.m,y:1.5,th:2,bore:0.56}});
  /* ---------- fusee wheel (96 : centre pinion 14, module 0.417) with its maintaining work ---------- */
  const gw=part('gw',-8);
  R.gw=arbor(gw,M,...L.Fu,{wheel:{n:96,m:MOD.fusee,y:-6.5,th:1.2,spokes:0,mat:M.copper,collet:0,bore:1.05}});
  mesh(R.gw,ring(17.3,15.2,1.8),M.copper,0,-8.0,0);mesh(R.gw,ring(15.2,1.05,0.5),M.copper,0,-7.35,0);
  const ssp=new THREE.Shape();{const r0=13.2,r1=13.9,a0=0.35,a1=a0+4.4;ssp.absarc(0,0,r1,a0,a1,false);ssp.absarc(0,0,r0,a1,a0,true);}
  const sspg=new THREE.ExtrudeGeometry(ssp,{depth:1.2,bevelEnabled:false,curveSegments:48});sspg.rotateX(-Math.PI/2);R.sspring=mesh(R.gw,sspg,M.blued,0,-8.75,0);
  mesh(R.gw,cylY(0.4,1.5,10),M.steel,13.55*Math.cos(0.35),-8.1,-13.55*Math.sin(0.35));
  R.sr=new THREE.Group();R.sr.position.set(L.Fu[0],0,L.Fu[1]);gw.add(R.sr);
  mesh(R.sr,gearGeo(120,0.27,0.7,{ratchet:true,flip:true,bore:3}),M.steel,0,-9.45,0);   /* steep faces lead against the running direction, so the sustaining pawl holds it */
  /* two winding pawls on the sustaining ratchet wheel, their tips on the fusee's winding ratchet (rp 9.4): pushed by its steep faces when running, slipping over them when winding */
  for(let k=0;k<2;k++){const a=k*Math.PI+0.4,P=[12.3*Math.cos(a),12.3*Math.sin(a)],T=[8.95*Math.cos(a+0.3),8.95*Math.sin(a+0.3)],pw=mesh(R.sr,pawlGeo(Math.hypot(T[0]-P[0],T[1]-P[1])+0.2,0.9,0.5),M.steel,P[0],-10.05,P[1]);pw.rotation.y=Math.atan2(T[1]-P[1],-(T[0]-P[0]));}
  const sp=part('spawl',-9);cylBetween(sp,0.7,-27.5,y0+2,M.steel,...SPv);
  /* sustaining pawl: its tip rests in the sustaining ratchet's teeth (rp 16.2), trailing the pivot so the teeth can only pass it one way */
  const SPt=[L.Fu[0]+16.35*Math.cos(54*D2R),L.Fu[1]+16.35*Math.sin(54*D2R)];
  R.spawl=new THREE.Group();R.spawl.position.set(SPv[0],-9.45,SPv[1]);sp.add(R.spawl);mesh(R.spawl,pawlGeo(Math.hypot(SPt[0]-SPv[0],SPt[1]-SPv[1]),1.2,0.6),M.steel,0,0,0);
  R.spawl.userData.base=Math.atan2(SPt[1]-SPv[1],-(SPt[0]-SPv[0]));R.spawl.rotation.y=R.spawl.userData.base;
  /* ---------- going train (modules 0.29 / 0.30 / 0.31): centre 80/14, third 75/10, fourth 60/10, escape pinion 8 ---------- */
  const m=MOD.train;
  const cw=part('cw',-26);R.cw=arbor(cw,M,...L.C,{wheel:{n:TRAIN.cw,m:MOD.centre,y:-21.4,th:1.0,spokes:5},pin:{n:14,m:MOD.fusee,y:-6.5,th:2.6},ar:[-29.1,4.8],r:0.75});
  const tw=part('tw',-34);R.tw=arbor(tw,M,...L.T,{wheel:{n:TRAIN.tw,m,y:-19.2,th:0.9,spokes:4},pin:{n:TRAIN.tp,m:MOD.centre,y:-21.4,th:2.0},ar:[-29.1,1.2]});
  const fw=part('fw',-42);R.fw=arbor(fw,M,...L.F,{wheel:{n:TRAIN.fw,m:MOD.fourth,y:-16.6,th:0.9,spokes:4},pin:{n:TRAIN.fp,m,y:-19.2,th:1.7},ar:[-22.6,4.6]});
  const E=ESC,ew=part('escW',-52,true);
  R.esc=arbor(ew,M,E.EX*ES,0,{pin:{n:TRAIN.ep,m:MOD.fourth,y:-16.6,th:2.0},ar:[-29.4,y0+2]});
  R.esc.userData.wheel=escapeWheel(R.esc,M,ES,-25.1);
  /* ---------- balance lower bridge: lower balance cap jewel and the fourth wheel upper setting ---------- */
  const lb=part('lowerBridge',-46);R.lowerBridge=mesh(lb,stadium(L.B,L.F,4.6,1.1,[[...L.B,0.5],[...L.F,0.5]]),M.plate,0,-23.3,0);
  const lbd=[L.F[0]-L.B[0],L.F[1]-L.B[1]],lbl=Math.hypot(...lbd),LBm=[L.B[0]+lbd[0]*0.85,L.B[1]+lbd[1]*0.85];
  cylBetween(lb,1.3,-26,-23.3,M.plate,...LBm);
  /* ---------- detent after the Rawlings plan: support block, detent spring, blade, bent arm, horn, locking jewel, passing spring ---------- */
  const dt=part('det',-48,true);
  R.det=new THREE.Group();R.det.position.set(E.Ft.x*ES,-23.9,E.Ft.y*ES);dt.add(R.det);
  const poly=(pts,depth,mat,y)=>{const s=new THREE.Shape();pts.forEach((p,i)=>{const x=(p.x-E.Ft.x)*ES,z=(p.y-E.Ft.y)*ES;i?s.lineTo(x,z):s.moveTo(x,z);});s.closePath();
    const g=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false});g.rotateX(Math.PI/2);g.translate(0,depth/2+(y||0),0);return mesh(R.det,g,mat);};
  const Pc=E.pieces;poly(Pc.spring,0.35,M.steel);poly(Pc.blade,0.9,M.steel);poly(Pc.arm,0.8,M.steel);poly(Pc.horn,0.9,M.steel);poly(Pc.bracket,0.5,M.steel);poly(Pc.stone,1.6,M.ruby,-0.8);
  const blk=new THREE.Group();blk.position.set(E.Ft.x*ES,-24.7,E.Ft.y*ES);blk.rotation.y=-Math.atan2(E.dirB.y,E.dirB.x);dt.add(blk);
  mesh(blk,new THREE.BoxGeometry(6,2.5,2.6),M.plateSolid,-2.4,0,0);screw(blk,-1.2,0,-1.25+1.1,0.9,0.5);
  R.pspring=mesh(dt,new THREE.BufferGeometry(),M.gilt);
  /* ---------- balance (rim r 14.5, measured on the top-view photograph) and hairspring ---------- */
  const bl=part('bal',-80,true);
  R.staff=new THREE.Group();bl.add(R.staff);
  cylBetween(R.staff,0.45,-42.3,-22.8,M.steel,0,0,12);
  /* impulse roller with its hollow in front of the impulse jewel (shape angle = minus the unit-frame angle) */
  const rR=E.rRoll*ES,ir=new THREE.Shape(),n0=-E.aI,n1=n0+0.6;ir.absarc(0,0,rR,n1,n0+TAU,false);ir.lineTo(rR*0.55*Math.cos(n0),rR*0.55*Math.sin(n0));ir.absarc(0,0,rR*0.55,n0,n1,false);
  const irg=new THREE.ExtrudeGeometry(ir,{depth:0.8,bevelEnabled:false,curveSegments:32});irg.rotateX(-Math.PI/2);irg.translate(0,-0.4,0);
  const irm=mesh(R.staff,irg,M.steel,0,-25.1,0);irm.rotation.y=0;
  const pal=(ang,r0,r1,w,y,h)=>{const q=mesh(R.staff,new THREE.BoxGeometry(r1-r0,h,w),M.ruby,(r0+r1)/2*Math.cos(ang),y,(r0+r1)/2*Math.sin(ang));q.rotation.y=-ang;};
  pal(E.aIc,rR-0.9,E.rp*ES,E.wI*ES,-25.1,0.9);
  mesh(R.staff,cylY(E.rDR*ES,0.6,32),M.steel,0,-23.9,0);pal(E.aD,E.rDR*ES-0.4,E.rd*ES,E.wD*ES,-23.9,0.7);
  mesh(R.staff,new THREE.CylinderGeometry(1.4,1.4,0.9,6),M.brass2,0,-33.2,0);
  const BR=BAL_R,BY=-31.5;R.balU=new THREE.Group();R.balU.position.y=BY;R.staff.add(R.balU);
  mesh(R.balU,ring(BR,BR-1.4,2.4),M.steel);
  mesh(R.balU,new THREE.BoxGeometry(2*BR-1,1.1,2.4),M.invar);mesh(R.balU,cylY(2.4,2.4,24),M.invar);
  for(let k=0;k<60;k++){const a=k/60*TAU;if(Math.abs(Math.sin(a))<0.05)continue;const h=mesh(R.balU,cylY(0.28,0.2,8),M.steelD,(BR+0.05)*Math.cos(a),0,(BR+0.05)*Math.sin(a));h.rotation.set(0,-a,Math.PI/2);}
  const bscrew=(a,len,rr,mat)=>{const q=mesh(R.balU,cylY(rr,len,12),mat,(BR+len/2)*Math.cos(a),0,(BR+len/2)*Math.sin(a));q.rotation.set(0,-a,Math.PI/2);};
  /* balance screws per the parts list: 6 of 0.049 in head height, 2 of 0.080 in, 2 of 0.101 in, in diametric pairs about the quarters;
     2 timing weights and 2 vernier timing weights beside the arm ends (manual Fig. 3) */
  for(const c of[Math.PI/2,-Math.PI/2])for(const[d,hh]of[[-0.5,1.24],[-0.25,2.57],[0,2.03],[0.25,1.24],[0.5,1.24]])bscrew(c+d,hh,0.75,M.brass);
  for(const c of[0,Math.PI]){bscrew(c+0.2,2.1,1.1,M.steelD);bscrew(c-0.2,1.3,0.65,M.steelD);}
  R.balS=new THREE.Group();R.balS.position.y=BY;R.balS.visible=false;R.staff.add(R.balS);
  mesh(R.balS,new THREE.BoxGeometry(2*BR-1,1.4,2.2),M.steel);mesh(R.balS,cylY(2.2,2.2,24),M.steel);
  const span=160*D2R,band=(a0,r0,r1)=>{const s=new THREE.Shape(),N=48;for(let i=0;i<=N;i++){const a=a0+span*i/N;i?s.lineTo(r1*Math.cos(a),r1*Math.sin(a)):s.moveTo(r1*Math.cos(a),r1*Math.sin(a));}
    for(let i=N;i>=0;i--){const a=a0+span*i/N;s.lineTo(r0*Math.cos(a),r0*Math.sin(a));}const g=new THREE.ExtrudeGeometry(s,{depth:2.4,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,-1.2,0);return g;};
  for(let k=0;k<2;k++){const a0=k*Math.PI;mesh(R.balS,band(a0,BR-1.6,BR-0.9),M.steel);mesh(R.balS,band(a0,BR-0.9,BR),M.brass);
    const wa=a0+span*0.62,w=mesh(R.balS,cylY(2.3,4.2,24),M.brass2,(BR+1.9)*Math.cos(wa),0,-(BR+1.9)*Math.sin(wa));w.rotation.set(0,wa,Math.PI/2);}
  /* helical hairspring: ~8 mm tall, ~5.5 mm radius, many turns (Fig. 2) */
  const spg=part('spr',-88,true);R.spring=mesh(spg,new THREE.BufferGeometry(),M.steel,0,-33.8,0);R.spring.rotation.x=Math.PI;
  mesh(spg,new THREE.BoxGeometry(2.4,0.9,1.8),M.gilt,5.5*0.3+0.6,-41.5,0);
  /* balance cock: massive bridge from a foot at the right-back (Fig. 2) over the balance */
  const ck=part('cock',-96);
  /* balance cock traced on the top-view photograph: a broad crescent whose outer edge follows the plate rim (top-left
     in the photo), a straight edge to the endstone over the staff and a concave arc back to the rim. Outline shifted
     by the cock's parallax so the endstone sits over the balance staff. */
  const COCK_POLY=[[25.38, 31.05], [26.19, 30.36], [26.99, 29.66], [27.77, 28.93], [28.53, 28.18], [29.26, 27.42], [29.98, 26.63], [30.68, 25.82], [31.35, 25.0], [32.0, 24.16], [32.63, 23.3], [33.24, 22.43], [33.82, 21.54], [34.38, 20.63], [34.92, 19.71], [35.43, 18.78], [35.92, 17.83], [36.38, 16.87], [36.81, 15.9], [37.22, 14.92], [37.6, 13.93], [37.96, 12.92], [38.29, 11.91], [38.59, 10.89], [38.87, 9.86], [39.12, 8.83], [39.34, 7.79], [39.53, 6.74], [39.69, 5.69], [39.83, 4.63], [39.94, 3.58], [32.87, 3.03], [26.51, 2.76], [20.15, 2.49], [13.87, 2.62], [8.04, 2.86], [5.77, 3.99], [5.53, 5.72], [6.88, 7.11], [13.2, 9.07], [17.2, 11.96], [19.38, 16.1], [20.84, 20.82], [21.82, 25.22]];
  R.cock=mesh(ck,polyGeo(COCK_POLY,3.2,[],0.3),M.plate,0,-45.1,0);   /* the staff's upper pivot runs in the setting pressed into the cock (not drawn: the staff is 0.7 mm from the cock's edge) */
  /* foot: a solid block under the outer part of the crescent, standing on the upper train bridge beside the barrel bridge's straight edge
     (the cock is mounted to the train bridge, manual Sec. II; its screw is where the top-view photograph shows it). Annular sector r 31-39.8,
     up to 32 deg, kept 0.25 mm off the barrel bridge edge z = 14.5 - 0.1x */
  const FOOT=[],edge=(r)=>{let lo=0,hi=32*D2R;for(let i=0;i<40;i++){const m=(lo+hi)/2;(r*Math.sin(m)-(14.75-0.1*r*Math.cos(m))>0)?hi=m:lo=m;}return hi;};
  { const a0=edge(39.8),a1=edge(31),A=32*D2R;for(let k=0;k<=16;k++){const a=a0+(A-a0)*k/16;FOOT.push([39.8*Math.cos(a),39.8*Math.sin(a)]);}
    for(let k=16;k>=0;k--){const a=a1+(A-a1)*k/16;FOOT.push([31*Math.cos(a),31*Math.sin(a)]);}}
  R.cockFoot=mesh(ck,polyGeo(FOOT,12.9,[],0.2),M.plateSolid,0,-41.9,0);
  /* one balance cock screw (parts list 42192), at its position on the top-view photograph (p3map scr_cockfoot) */
  const Q=[33.11,12.32];screw(ck,...Q,-45.1,2.8,1.5);
  /* endstone plate over the staff: small steel plate with two screws and the cap jewel */
  const ep=new THREE.Group();ep.position.set(L.B[0],-45.1,L.B[1]);ep.rotation.y=Math.atan2(-(L.B[1]-Q[1]),L.B[0]-Q[0]);ck.add(ep);
  mesh(ep,new THREE.BoxGeometry(7.4,0.7,4.6),M.steel,1.2,-0.35,0);mesh(ep,cylY(1.0,0.3,16),M.ruby,0,-0.8,0);
  screw(ep,3.6,0,-0.7,0.7,0.4);screw(ep,-1.6,1.5,-0.7,0.7,0.4);
  /* ---------- fusee (8-3/4 turns), chain, barrel (radius 13.5, below the third wheel) ---------- */
  const fsP=part('fs',-16);const dx=L.Fu[0]-L.Ba[0],dz=L.Fu[1]-L.Ba[1],fd=Math.hypot(dx,dz);
  const fs=makeFusee(M,{yS:-20.1,yB:-10.9,rmin:6.5,rmax:14,N:FUSEE_TURNS,Rb:13.5,bT:-17.9,bB:-7.4,d:fd,stopAng:Math.atan2(-fo[1],fo[0])-Math.atan2(-dz,dx)});   /* stop-bar faces the winding stop at full wind */
  fs.g.position.set((L.Fu[0]+L.Ba[0])/2,0,(L.Fu[1]+L.Ba[1])/2);fs.g.rotation.y=Math.atan2(-dz,dx);fsP.add(fs.g);R.fs=fs;
  /* setup ratchet, click and cover plate on the barrel arbor above the barrel bridge (manual Figs. 24, 80), measured on the top-view photograph:
     a bow-shaped cover straddling the arbor, ends ~13 mm out along 107 deg / 287 deg, the right end an arc about the arbor; the waist on the
     centre side just uncovers the ratchet teeth, and on the rim side a curved slot (r 7.1-7.95) shows the teeth and the click */
  const rt=part('ratchet',-76),P2=(r,a)=>[L.Ba[0]+r*Math.cos(a*D2R),L.Ba[1]+r*Math.sin(a*D2R)];
  mesh(rt,gearGeo(52,0.289,1.0,{ratchet:true,flip:true,bore:1.4}),M.steel,L.Ba[0],-33.85,L.Ba[1]);   /* steep faces meet the click against the mainspring's pull */
  cylBetween(rt,1.4,-35.5,-1,M.steel,L.Ba[0],L.Ba[1]);cylBetween(rt,2.3,-35.8,-34.35,M.steel,L.Ba[0],L.Ba[1],28);
  mesh(rt,new THREE.BoxGeometry(2.2,3.0,2.2),M.steel,L.Ba[0],-37.3,L.Ba[1]);
  { const Pv=P2(8.9,250.6),Tp=P2(7.5,220),clk=mesh(rt,pawlGeo(Math.hypot(Tp[0]-Pv[0],Tp[1]-Pv[1])+0.3,1.3,0.8),M.steel,Pv[0],-33.85,Pv[1]);clk.rotation.y=Math.atan2(Tp[1]-Pv[1],-(Tp[0]-Pv[0]));}
  const nBefore=rt.children.length;
  { /* outline in polar coordinates about the arbor: left end arc, rim-side concave edge, right end, centre-side concave edge */
    const arc3=(a,b,c,n)=>{const[ax,az]=a,[bx,bz]=b,[cx2,cz2]=c,d=2*(ax*(bz-cz2)+bx*(cz2-az)+cx2*(az-bz)),
        ux=((ax*ax+az*az)*(bz-cz2)+(bx*bx+bz*bz)*(cz2-az)+(cx2*cx2+cz2*cz2)*(az-bz))/d,uz=((ax*ax+az*az)*(cx2-bx)+(bx*bx+bz*bz)*(ax-cx2)+(cx2*cx2+cz2*cz2)*(bx-ax))/d,
        r=Math.hypot(ax-ux,az-uz),t0=Math.atan2(az-uz,ax-ux),tm=Math.atan2(bz-uz,bx-ux);let t1=Math.atan2(cz2-uz,cx2-ux);
      const w=t=>((t-t0)%TAU+TAU)%TAU;let dt=w(t1);if(w(tm)>dt)dt-=TAU;const o=[];for(let k=1;k<n;k++){const t=t0+dt*k/n;o.push([ux+r*Math.cos(t),uz+r*Math.sin(t)]);}return o;};
    const TL=P2(12.8,69.4),BL=P2(13.1,145.6),BR=P2(12.97,249.2),TR=P2(12.61,325.9),pts=[],polar=(r0,r1,a0,a1,n)=>{const o=[];for(let k=0;k<=n;k++){const t=k/n;o.push(P2(lerp(r0,r1,t),lerp(a0,a1,t)));}return o;};
    pts.push(TL,...arc3(TL,P2(13.1,106),BL,20),BL,P2(9.8,153),...polar(8.7,8.7,163,236,30),BR,...polar(12.97,12.61,249.2,325.9,30).slice(1,-1),TR,...arc3(TR,P2(6.4,17),TL,40));
    const s=new THREE.Shape();pts.forEach(([x,z],i)=>i?s.lineTo(x,-z):s.moveTo(x,-z));s.closePath();
    const h=new THREE.Path();h.absarc(L.Ba[0],-L.Ba[1],2.6,0,TAU,true);s.holes.push(h);
    /* the curved slot on the rim side, round-ended */
    { const r0=7.1,r1=7.95,rc=(r0+r1)/2,rh=(r1-r0)/2,a0=161,a1=236,sl=[...polar(r1,r1,a0,a1,30)],e1=P2(rc,a1),e0=P2(rc,a0);
      for(let k=1;k<12;k++){const t=a1*D2R+k/12*Math.PI;sl.push([e1[0]+rh*Math.cos(t),e1[1]+rh*Math.sin(t)]);}
      sl.push(...polar(r0,r0,a1,a0,30));for(let k=1;k<12;k++){const t=a0*D2R+Math.PI+k/12*Math.PI;sl.push([e0[0]+rh*Math.cos(t),e0[1]+rh*Math.sin(t)]);}
      const hp=new THREE.Path();sl.forEach(([x,z],i)=>i?hp.lineTo(x,-z):hp.moveTo(x,-z));hp.closePath();s.holes.push(hp);}
    const cvg=new THREE.ExtrudeGeometry(s,{depth:0.8,bevelEnabled:true,bevelThickness:0.15,bevelSize:0.15,bevelSegments:1,curveSegments:24});cvg.rotateX(-Math.PI/2);cvg.translate(0,0.15,0);
    R.cover=mesh(rt,cvg,M.plateSolid,0,-35.5,0);
    /* two screws near the ends, on feet down to the bridge; the pin near the lower-right corner is the setup pawl pivot */
    for(const[r,a]of[[11.1,107],[11.6,288]]){const q=P2(r,a);cylBetween(rt,1.1,-34.4,-33.35,M.plateSolid,...q);screw(rt,...q,-35.5,0.9,0.55);}
    const pv=P2(8.9,250.6);cylBetween(rt,0.45,-35.65,-35.4,M.steel,...pv);}
  rt.children.slice(nBefore).forEach(o=>o.userData.driveHide=true);
  /* dust seal around the fusee arbor (manual Fig. 24): nickel body on a flange held by two screws, capped by three packing rings; the arbor's squared end takes the key */
  const wp=part('post',-78);
  mesh(wp,new THREE.LatheGeometry([V2(1.3,-33.02),V2(6.6,-33.02),V2(6.6,-34.2),V2(6.2,-34.6),V2(5.9,-34.8),V2(5.9,-38.4),V2(1.3,-38.4),V2(1.3,-33.02)].reverse(),56),M.plateSolid,L.Fu[0],0,L.Fu[1]);
  for(let k=0;k<3;k++){const a=-38.4-1.733*k,b=a-1.733;mesh(wp,new THREE.LatheGeometry([V2(3.4,a),V2(6.2,a),V2(6.45,a-0.22),V2(6.45,b+0.22),V2(6.2,b),V2(3.4,b),V2(3.4,a)].reverse(),56),M.brass2,L.Fu[0],0,L.Fu[1]);}
  const fl=mesh(wp,ringGeo(8.6,6.7,1.0),M.plateSolid,L.Fu[0],-33.52,L.Fu[1]);screw(wp,L.Fu[0]+7.6*Math.cos(2.2),L.Fu[1]+7.6*Math.sin(2.2),-34.02,1.0,0.5);screw(wp,L.Fu[0]+7.6*Math.cos(-1.0),L.Fu[1]+7.6*Math.sin(-1.0),-34.02,1.0,0.5);
  const sqP=part('sq',-84);R.sq=new THREE.Group();R.sq.position.set(L.Fu[0],0,L.Fu[1]);sqP.add(R.sq);cylBetween(R.sq,1.2,-42.4,-33,M.steel);mesh(R.sq,new THREE.BoxGeometry(2.4,1.6,2.4),M.steel,0,-43.0,0);
  /* winding key: its socket fits the fusee arbor square and turns it (never the barrel arbor, which the setup ratchet holds) */
  R.wkey=new THREE.Group();R.wkey.visible=false;R.sq.add(R.wkey);
  mesh(R.wkey,ringGeo(2.6,1.35,5),M.brass,0,-45.3,0);cylBetween(R.wkey,1.7,-47.8,-68,M.brass);
  const kbar=mesh(R.wkey,new THREE.CylinderGeometry(2.4,2.4,26,20),M.brass,0,-70,0);kbar.rotation.x=Math.PI/2;
  for(const sz of[13,-13])mesh(R.wkey,new THREE.SphereGeometry(2.4,18,12),M.brass,0,-70,sz);mesh(R.wkey,new THREE.SphereGeometry(3.4,18,12),M.brass,0,-70,0);
  /* ---------- tooth phasing: driver tooth centred on the line of centres, driven gap centred there ---------- */
  const ph=(A,pa,na,extA,B,pb,nb,extB)=>{const phi=Math.atan2(-(pb[1]-pa[1]),pb[0]-pa[0]);A.rotation.y=phi-0.375*TAU/na-(extA||0);B.rotation.y=phi+Math.PI-0.875*TAU/nb-(extB||0);};
  const U=R.gw.userData,CW=R.cw.userData,TW=R.tw.userData,FW=R.fw.userData,EW=R.esc.userData;
  ph(U.wheel,L.Fu,96,0,CW.pin,L.C,14,0);
  ph(CW.wheel,L.C,TRAIN.cw,0,TW.pin,L.T,TRAIN.tp,0);
  ph(TW.wheel,L.T,TRAIN.tw,0,FW.pin,L.F,TRAIN.fp,0);
  ph(FW.wheel,L.F,TRAIN.fw,0,EW.pin,L.E,TRAIN.ep,BETA+(-ESC.t0+0.03*ESC.P));
  ph(R.cannon.userData.pin,L.C,12,0,R.minW.userData.wheel,L.Mw,36,0);
  ph(R.minW.userData.pin,L.Mw,10,0,R.hourW.userData.wheel,L.C,40,0);
  ph(R.fp.userData.pin,L.Fu,UD.pin,0,R.udW.userData.wheel,L.Ud,UD.wheel,0);
  /* ---------- API ---------- */
  mv.userData.parts=parts;mv.userData.R=R;
  mv.userData.explode=e=>{for(const k in parts)parts[k].position.y=parts[k].userData.off*e;};
  mv.userData.balance=kind=>{R.balU.visible=kind!=='split';R.balS.visible=kind==='split';};
  const RF=TRAIN.fw/TRAIN.ep,RT=RF*TRAIN.tw/TRAIN.fp,RC=RT*TRAIN.cw/TRAIN.tp;   /* escape turns per fourth, third, centre turn: 7.5, 56.25, 450 */
  let lastN=-1,srA=0;
  mv.userData.update=(s)=>{
    const P=E.P,esc=s.E*P;
    R.esc.rotation.y=-E.t0+0.03*P+esc;
    R.fw.rotation.y=-esc/RF;R.sec.rotation.y=-esc/RF;
    R.tw.rotation.y=esc/RT;
    const cA=esc/RC;R.cw.rotation.y=-cA;R.cannon.rotation.y=-cA;R.min.rotation.y=-cA;
    R.minW.rotation.y=cA/3;R.hourW.rotation.y=-cA/12;R.hour.rotation.y=-cA/12;
    const gA=cA*14/96;R.gw.rotation.y=gA;
    if(!s.winding)srA+=(gA-srA)*0.25;R.sr.rotation.y=srA;
    R.spawl.rotation.y=R.spawl.userData.base+(s.winding?0.1*Math.abs(Math.sin(s.n*TAU*40)):0);
    R.staff.rotation.y=-s.th;
    R.det.rotation.y=s.lift/E.LEN;
    const fa=s.n*TAU;R.fp.rotation.y=fa;R.sq.rotation.y=fa;R.wkey.visible=!!s.keyOn;
    const udA=fa*UD.pin/UD.wheel;R.udW.rotation.y=-udA;R.ud.rotation.y=-60*D2R-udA;
    if(Math.abs(s.n-lastN)>0.0008){fs.setWind(s.n);lastN=s.n;}
    fs.stopBar.position.x=lerp(0,3.0,smooth(1-s.n/0.25));
    if(s.msOn){const In=fs.I(s.n);fs.ms.geometry.dispose();fs.ms.geometry=mainspringGeo(1-In/fs.IN,2.6,13.1,-8.2,-17.1,6+fs.IN-In);}
    if(s.springOn){R.spring.geometry.dispose();R.spring.geometry=springGeo(5.5,7.5,14,s.th,0.17);}
    /* passing spring: rides with the detent while unlocking; bends aside by itself on the return swing */
    const[a0,am,tp2]=E.springPts(s),V=p=>new THREE.Vector3(p.x*ES,-24.0,p.y*ES);
    R.pspring.geometry.dispose();R.pspring.geometry=new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(V(a0),V(am),V(tp2)),20,0.1,5,false);
  };
  mv.userData.explode(0);
  return mv;
}

/* fusee + chain + barrel. Fusee's large end at the fusee wheel (pillar-plate side), small end toward the barrel bridge */
function makeFusee(M,c){
  const g=new THREE.Group(),drop=1-c.rmin/c.rmax,rf=m=>c.rmin/(1-drop*m/c.N),yf=m=>c.yS+(c.yB-c.yS)*m/c.N,yb=m=>(c.bT+1.2)+((c.bB-1.2)-(c.bT+1.2))*m/c.N,fx=c.d/2,bx=-c.d/2;
  const fz=new THREE.Group();fz.position.x=fx;fz.userData.partName='fusee';g.add(fz);
  const V2=(a,b)=>new THREE.Vector2(a,b),pr=[V2(1.05,c.yS-0.2),V2(c.rmin-0.6,c.yS-0.2),V2(c.rmin-0.6,c.yS)];
  const K=Math.round(c.N*28);for(let i=0;i<=K;i++){const m=c.N*i/K;pr.push(V2(rf(m)-0.4*(1-Math.cos(TAU*m))/2,yf(m)));}
  pr.push(V2(c.rmax+1.0,c.yB),V2(c.rmax+1.0,c.yB+0.5),V2(1.05,c.yB+0.5),V2(1.05,c.yS-0.2));
  mesh(fz,new THREE.LatheGeometry(pr,72),M.gilt);cylBetween(fz,1,-33,-PP_T-0.1,M.steel,0,0,12);cylBetween(fz,0.55,-PP_T-0.1,2.5,M.steel,0,0,12);   /* arbor, then its lower pivot through the plate bushing to the wind-indicator pinion */
  mesh(fz,gearGeo(40,0.47,0.5,{ratchet:true,bore:1}),M.steel,0,c.yB+0.85,0);
  const sbR=new THREE.Group();sbR.rotation.y=c.stopAng||0;fz.add(sbR);const stopBar=new THREE.Group();stopBar.position.y=c.yS-0.4;sbR.add(stopBar);
  mesh(stopBar,new THREE.BoxGeometry(3,0.4,1.4),M.steel,2.6,0,0);mesh(stopBar,new THREE.BoxGeometry(3,0.4,1.4),M.steel,-2.6,0,0);
  const bz=new THREE.Group();bz.position.x=bx;bz.userData.partName='barrel';g.add(bz);
  const bw=new THREE.Mesh(new THREE.CylinderGeometry(c.Rb,c.Rb,Math.abs(c.bT-c.bB),72,1,true),M.brassDS);bw.position.y=(c.bT+c.bB)/2;bz.add(bw);bw.userData.driveGhost=true;bw.userData.noCap=true;
  for(const y of[c.bT+0.3,c.bB-0.3]){const cp=mesh(bz,ringGeo(c.Rb+0.7,1.5,0.6),M.gilt,0,y,0);cp.userData.driveGhost=true;}
  mesh(bz,new THREE.BoxGeometry(1.2,3,1.5),M.steel,0,(c.bT+c.bB)/2,-(c.Rb-0.9));
  const ms=new THREE.Mesh(new THREE.BufferGeometry(),M.mspring);ms.position.x=bx;ms.userData.partName='mainspring';ms.userData.onlyDrive=true;ms.userData.noCap=true;g.add(ms);
  mesh(bz,ringGeo(4,1.5,0.4),M.brass2,0,c.bT-0.25,0).userData.driveGhost=true;
  /* barrel cap on the pillar-plate end, held by five screws (manual Figs. 26, 109) */
  for(let k=0;k<5;k++){const a=k/5*TAU;mesh(bz,cylY(0.7,0.4,10),M.steel,12.4*Math.cos(a),c.bB+0.2,12.4*Math.sin(a));}
  const I=m=>(c.rmin*(-c.N/drop)*Math.log(1-drop*m/c.N))/c.Rb;
  const MAX=900,geoA=new THREE.BoxGeometry(1.5,1.0,0.34),geoB=new THREE.BoxGeometry(1.25,0.7,0.56);
  const imA=new THREE.InstancedMesh(geoA,M.chain,MAX),imB=new THREE.InstancedMesh(geoB,M.chain2,MAX);g.add(imA,imB);imA.userData.partName=imB.userData.partName='chain';
  const mtx=new THREE.Matrix4(),t=new THREE.Vector3(),up=new THREE.Vector3(),nn=new THREE.Vector3(),pos=new THREE.Vector3();
  function setWind(n){
    fz.rotation.y=n*TAU;bz.rotation.y=I(n)*TAU;
    const P=[],V=(x,y,z)=>P.push(new THREE.Vector3(x,y,z));
    for(let m=c.N;m>n;m-=0.01){const a=-Math.PI/2+TAU*(m-n),r=rf(m)+0.2;V(fx+r*Math.cos(a),yf(m),r*Math.sin(a));}
    const r0=rf(n)+0.2,y0=yf(n),y1=yb(n);V(fx,y0,-r0);
    for(let s=0.1;s<1;s+=0.1)V(lerp(fx,bx,s),lerp(y0,y1,s),-lerp(r0,c.Rb+0.3,s));
    const In=I(n);for(let m=n;m>=0;m-=0.01){const b=-Math.PI/2-TAU*(In-I(m));V(bx+(c.Rb+0.3)*Math.cos(b),yb(m),(c.Rb+0.3)*Math.sin(b));}
    let ia=0,ib=0,acc=0,next=0,k=0;const pitch=1.32;
    for(let i=1;i<P.length&&(ia<MAX&&ib<MAX);i++){const seg=P[i].distanceTo(P[i-1]);
      while(acc+seg>=next&&ia<MAX&&ib<MAX){const f=(next-acc)/seg;pos.lerpVectors(P[i-1],P[i],f);t.subVectors(P[i],P[i-1]).normalize();
        up.set(0,1,0).addScaledVector(t,-t.y).normalize();nn.crossVectors(t,up);mtx.makeBasis(t,up,nn).setPosition(pos);
        if(k%2===0)imA.setMatrixAt(ia++,mtx);else imB.setMatrixAt(ib++,mtx);k++;next+=pitch/2;}
      acc+=seg;}
    imA.count=ia;imB.count=ib;imA.instanceMatrix.needsUpdate=true;imB.instanceMatrix.needsUpdate=true;
  }
  const IN=I(c.N);ms.rotation.y=Math.PI/2+TAU*(6+IN);
  return{g,fz,bz,setWind,rf,yf,fx,bx,ms,I,IN,stopBar};
}
