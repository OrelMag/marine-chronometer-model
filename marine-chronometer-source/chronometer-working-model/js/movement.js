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
/* Spring detent escapement in a unit 2D frame: balance at origin, escape wheel centre at x=EX, unit = escape-wheel radius. */
const ES=13.16/2,ESC=(()=>{
  /* balance motion 1-3/8 to 1-1/2 turns (manual Sec. II) -> amplitude ~255 deg each side */
  const NT=16,P=TAU/NT,EX=-1.55,A=255*D2R,TU=-6*D2R,WB=4*D2R,G=3.5,rp=0.6,rRoll=0.48,rd=0.4,rDR=0.22,t0=P/2,lockA=t0-2*P,aI=178*D2R;
  /* locking tooth at -33.75 deg (Rawlings plan: ~38 deg), the waiting tooth just outside the impulse jewel's path */
  const S={x:EX+Math.cos(lockA),y:Math.sin(lockA)};
  /* detent after the Rawlings plan: long blade from the foot to the locking jewel, then an arm bent toward the rollers */
  const dirB={x:0.46,y:0.887},Ft={x:S.x-1.4*dirB.x,y:S.y-1.4*dirB.y},hornAng=247*D2R,H={x:0.36*Math.cos(hornAng),y:0.36*Math.sin(hornAng)};
  const LEN=Math.hypot(H.x-Ft.x,H.y-Ft.y),vx=(H.x-Ft.x)/LEN,vy=(H.y-Ft.y)/LEN,nH={x:vy,y:-vx};   /* nH: direction the horn moves when unlocking */
  const nB={x:dirB.y,y:-dirB.x};                                                                /* nB: direction the locking jewel moves (away from the wheel) */
  const aD=hornAng-TU,thRel=TU-WB*Math.sqrt(0.45);
  const Pt={x:H.x+0.06*dirB.x-0.035*nH.x,y:H.y+0.06*dirB.y-0.035*nH.y},Ps0={x:H.x-0.9*dirB.x-0.035*nH.x,y:H.y-0.9*dirB.y-0.035*nH.y};
  function state(p){
    const th=-A*Math.cos(TAU*p),ccw=Math.sin(TAU*p)>0,bump=Math.max(0,1-((th-TU)/WB)**2);
    const lift=ccw?0.13*bump:0,psDef=ccw?0:0.09*bump;let prog;
    if(ccw&&th>thRel){const psi=aI+th,yp=rp*Math.sin(psi),xp=rp*Math.cos(psi),cx=EX+Math.sqrt(Math.max(0,1-yp*yp));
      const inL=xp<cx&&Math.cos(psi)<0,pf=-(th-thRel)*G,pc=inL?Math.asin(clamp(yp,-1,1))-t0:-1e9,phi=Math.max(pf,pc);prog=phi<=-P?1:-phi/P;}
    else prog=ccw?0:1;
    return{th,lift,psDef,prog};
  }
  /* detent outline pieces (unrotated, 2D unit frame); rotate about Ft by -lift/LEN when drawing */
  const off=(p,a,b)=>({x:p.x+dirB.x*a+nB.x*b,y:p.y+dirB.y*a+nB.y*b});
  const K=off(S,0.03,0.02),ax=(H.x-K.x),ay=(H.y-K.y),al=Math.hypot(ax,ay),an={x:-ay/al,y:ax/al};
  const armP=(p,w)=>[{x:K.x+an.x*w,y:K.y+an.y*w},{x:H.x+an.x*w*0.7,y:H.y+an.y*w*0.7},{x:H.x-an.x*w*0.7,y:H.y-an.y*w*0.7},{x:K.x-an.x*w,y:K.y-an.y*w}];
  const pieces={
    spring:[off(Ft,0,0.012),off(Ft,0.3,0.012),off(Ft,0.3,-0.012),off(Ft,0,-0.012)],
    blade:[off(Ft,0.28,0.04),off(S,0.04,0.04),off(S,0.04,-0.04),off(Ft,0.28,-0.04)],
    arm:armP(null,0.03),
    horn:[{x:H.x-nH.x*0.01+an.x*0.02,y:H.y-nH.y*0.01+an.y*0.02},{x:H.x+nH.x*0.05+an.x*0.02,y:H.y+nH.y*0.05+an.y*0.02},{x:H.x+nH.x*0.05-an.x*0.02,y:H.y+nH.y*0.05-an.y*0.02},{x:H.x-nH.x*0.01-an.x*0.02,y:H.y-nH.y*0.01-an.y*0.02}],
    stone:[off(S,0,-0.02),off(S,-0.055,-0.02),off(S,-0.055,-0.1),off(S,0,-0.1)]
  };
  return{NT,P,EX,A,rp,rRoll,rd,rDR,t0,aI,aD,S,Ft,H,Pt,Ps0,LEN,nH,nB,dirB,pieces,state};
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
function polyGeo(pts,th,holes=[],bev=0){const s=new THREE.Shape();pts.forEach(([x,z],i)=>i?s.lineTo(x,-z):s.moveTo(x,-z));s.closePath();
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
    const hd=mesh(p,new THREE.LatheGeometry(pr,28),M.steel,x,y,z);const sl=mesh(p,new THREE.BoxGeometry(r*2.02,Math.min(0.55,h*0.45),Math.max(0.35,r*0.2)),M.steelD,x,y-h+Math.min(0.55,h*0.45)/2-0.02,z);sl.rotation.y=(x*7+z*3)%3;};
  const ring=ringGeo;R.ring=ring;
  const bush=(p,x,z,y,r=2.2,hole=1.1)=>{mesh(p,ring(r,hole,0.5),M.brass2,x,y-0.25,z);};
  const jewel=(p,x,z,y,cap)=>{mesh(p,ring(2.1,1.0,0.5),M.gilt,x,y-0.25,z);mesh(p,cylY(0.95,0.25,16),M.ruby,x,y-0.6,z);
    if(cap){for(let k=0;k<2;k++){const a=k*Math.PI+0.7;mesh(p,cylY(0.5,0.5,10),M.steel,x+2.7*Math.cos(a),y-0.25,z+2.7*Math.sin(a));}}};
  const y0=-PP_T;
  /* ---------- pillar plate 87.57 x 3.86 mm, movement ring, lower train bridge ---------- */
  const pp=part('pillar',0);
  R.pillarPlate=mesh(pp,discGeo(PP_R,PP_T,[[...L.C,1.5],[...L.F,1.2],[...L.Fu,1.4],[...L.Ud,1.0],[...L.Mw,0.8]]),M.plate,0,y0,0);
  R.flange=mesh(pp,ringGeo(47,PP_R-0.1,2.2),M.plate,0,y0+1.1,0);
  const lt=part('ltb',-4);R.ltb=mesh(lt,stadium(L.T,L.F,6,1.2,[[...L.T,0.8],[...L.F,0.8]]),M.plate,0,y0-1.2,0);jewel(lt,...L.F,y0-1.2);jewel(lt,...L.T,y0-1.2);
  screw(lt,(L.T[0]+L.F[0])/2,(L.T[1]+L.F[1])/2,y0-1.2,1.4,0.8);
  /* ---------- pillars (two measured on Fig. 2, two placed clear of the fusee wheel and balance) ---------- */
  const pl=part('pillars',-30);
  const pillar=(x,z,top)=>{const pr=[V2(0.01,y0),V2(3.4,y0),V2(3.4,y0-1.3),V2(2.9,y0-1.9),V2(2.7,(top+y0)*0.5),V2(2.3,top+2.4),V2(2.9,top+1.7),V2(2.9,top),V2(0.01,top)].reverse();
    mesh(pl,new THREE.LatheGeometry(pr,32),M.plateSolid,x,0,z);};
  PILLARS.train.forEach(([x,z])=>pillar(x,z,-26));pillar(...PILLARS.barrel,-29);
  /* ---------- upper train bridge (y -29..-26) and barrel bridge (y -33..-29), split along z = -1.5 - 0.9x;
               the barrel bridge rests on a 5 mm strip of the train bridge and is cut around the balance ---------- */
  const tb=part('trainBridge',-62);
  const WSd=(()=>{const Fl=Math.hypot(...L.Fu);return[L.Fu[0]+7.2*L.Fu[0]/Fl,L.Fu[1]+7.2*L.Fu[1]/Fl];})();
  const TBpoly=discClip(BR_R,[],240);
  R.trainBridge=mesh(tb,polyGeo(TBpoly,3,[[...L.C,1.2],[...L.T,1],[...L.E,0.9],[...L.B,11.5],[...L.Fu,1.3],[...L.Ba,1.7],[...WSd,1.0],[...PILLARS.barrel,3.1]],0.22),M.plate,0,-29,0);
  PILLARS.train.slice(0,2).forEach(([x,z])=>screw(tb,x,z,-29,2.9,1.6));screw(tb,-8.5,27.7,-29,2.9,1.6);bush(tb,...L.T,-29,2.0,0.9);
  /* escape upper bridge with jewel and endstone cap */
  const eb=part('escBridge',-66);const eo=[L.E[0]-L.B[0],L.E[1]-L.B[1]],el=Math.hypot(...eo),eu=[eo[0]/el,eo[1]/el];
  R.escBridge=mesh(eb,stadium([L.E[0]-eu[0]*1.5,L.E[1]-eu[1]*1.5],[L.E[0]+eu[0]*7.5,L.E[1]+eu[1]*7.5],4.0,0.9),M.plate,0,-29.9,0);
  screw(eb,L.E[0]+eu[0]*6,L.E[1]+eu[1]*6,-29.9,0.9,0.5);
  jewel(eb,...L.E,-29.9,true);
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
  R.sec=new THREE.Group();R.sec.position.set(L.F[0],5.0,L.F[1]);hd.add(R.sec);mesh(R.sec,handGeo(11.5,0.6,3.5,'plain'),M.blued);mesh(R.sec,cylY(0.9,0.8,16),M.blued,0,0.3,0);
  R.ud=new THREE.Group();R.ud.position.set(L.Ud[0],5.0,L.Ud[1]);hd.add(R.ud);mesh(R.ud,handGeo(10.5,0.7,2.5,'plain'),M.blued);mesh(R.ud,cylY(0.9,0.8,16),M.blued,0,0.3,0);
  const mw=part('motion',16);
  R.cannon=arbor(mw,M,...L.C,{pin:{n:12,m:0.4,y:1.2,th:2,bore:0.85}});mesh(R.cannon,ring(1.4,0.85,4.6),M.steel,0,2.6,0);
  R.minW=arbor(mw,M,...L.Mw,{wheel:{n:36,m:0.4,y:1.2,th:0.8,spokes:4},pin:{n:10,m:0.384,y:2.4,th:1.6},ar:[0,3.2],r:0.7});
  R.hourW=arbor(mw,M,...L.C,{wheel:{n:40,m:0.384,y:2.6,th:0.8,spokes:4,collet:0,bore:1.45}});mesh(R.hourW,ring(2.2,1.45,2.6),M.brass2,0,3.9,0);
  R.udW=arbor(mw,M,...L.Ud,{wheel:{n:UD.wheel,m:UD.m,y:1.5,th:0.8,spokes:4},ar:[y0,5]});
  R.fp=arbor(mw,M,...L.Fu,{pin:{n:UD.pin,m:UD.m,y:1.5,th:2}});
  /* ---------- fusee wheel (96 : centre pinion 14, module 0.389) with its maintaining work ---------- */
  const gw=part('gw',-8);
  R.gw=arbor(gw,M,...L.Fu,{wheel:{n:96,m:MOD.fusee,y:-6.5,th:1.2,spokes:0,mat:M.copper,collet:0,bore:1.05}});
  mesh(R.gw,ring(17.3,15.2,1.8),M.copper,0,-8.0,0);mesh(R.gw,ring(15.2,1.05,0.5),M.copper,0,-7.35,0);
  const ssp=new THREE.Shape();{const r0=13.2,r1=13.9,a0=0.35,a1=a0+4.4;ssp.absarc(0,0,r1,a0,a1,false);ssp.absarc(0,0,r0,a1,a0,true);}
  const sspg=new THREE.ExtrudeGeometry(ssp,{depth:1.2,bevelEnabled:false,curveSegments:48});sspg.rotateX(-Math.PI/2);R.sspring=mesh(R.gw,sspg,M.blued,0,-8.75,0);
  mesh(R.gw,cylY(0.4,1.5,10),M.steel,13.55*Math.cos(0.35),-8.1,-13.55*Math.sin(0.35));
  R.sr=new THREE.Group();R.sr.position.set(L.Fu[0],0,L.Fu[1]);gw.add(R.sr);
  mesh(R.sr,gearGeo(120,0.27,0.7,{ratchet:true,bore:3}),M.steel,0,-9.45,0);
  for(let k=0;k<2;k++){const a=k*Math.PI+0.4,pw=mesh(R.sr,pawlGeo(3.8,0.9,0.5,true),M.steel,11.2*Math.cos(a)-1.2*Math.sin(a),-10.05,-(11.2*Math.sin(a)+1.2*Math.cos(a)));pw.rotation.y=a+Math.PI/2+0.35;}
  const sp=part('spawl',-9);const spA=Math.atan2(fo[1],fo[0])+Math.PI*5/6,SPv=[L.Fu[0]+21*Math.cos(spA),L.Fu[1]+21*Math.sin(spA)];cylBetween(sp,0.7,-10,y0,M.steel,...SPv);
  R.spawl=new THREE.Group();R.spawl.position.set(SPv[0],-9.45,SPv[1]);sp.add(R.spawl);mesh(R.spawl,pawlGeo(4.9,1.2,0.6),M.steel,0,0,0);
  R.spawl.userData.base=Math.atan2(-(L.Fu[1]-SPv[1]),L.Fu[0]-SPv[0])-0.1;R.spawl.rotation.y=R.spawl.userData.base;
  /* ---------- going train (module 0.29): centre 80/14, third 75/10, fourth 60/10, escape pinion 8 ---------- */
  const m=MOD.train;
  const cw=part('cw',-26);R.cw=arbor(cw,M,...L.C,{wheel:{n:TRAIN.cw,m:MOD.centre,y:-21.4,th:1.0,spokes:5},pin:{n:14,m:MOD.fusee,y:-6.5,th:2.6},ar:[-29,1.2],r:0.75});
  const tw=part('tw',-34);R.tw=arbor(tw,M,...L.T,{wheel:{n:TRAIN.tw,m,y:-19.2,th:0.9,spokes:4},pin:{n:TRAIN.tp,m:MOD.centre,y:-21.4,th:2.0},ar:[-29,y0-1.2]});
  const fw=part('fw',-42);R.fw=arbor(fw,M,...L.F,{wheel:{n:TRAIN.fw,m:MOD.fourth,y:-16.6,th:0.9,spokes:4},pin:{n:TRAIN.fp,m,y:-19.2,th:1.7},ar:[-22.6,5.0]});
  const E=ESC,ew=part('escW',-52,true);
  R.esc=arbor(ew,M,E.EX*ES,0,{pin:{n:TRAIN.ep,m:MOD.fourth,y:-16.6,th:2.0},ar:[-29.4,y0]});
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
  const Pc=E.pieces;poly(Pc.spring,0.35,M.steel);poly(Pc.blade,0.9,M.steel);poly(Pc.arm,0.8,M.steel);poly(Pc.horn,0.9,M.steel);poly(Pc.stone,1.6,M.ruby,-0.8);
  const blk=new THREE.Group();blk.position.set(E.Ft.x*ES,-24.7,E.Ft.y*ES);blk.rotation.y=-Math.atan2(E.dirB.y,E.dirB.x);dt.add(blk);
  mesh(blk,new THREE.BoxGeometry(6,2.5,2.6),M.plateSolid,-2.4,0,0);screw(blk,-1.2,0,-1.25+1.1,0.9,0.5);
  R.pspring=mesh(dt,new THREE.BufferGeometry(),M.gilt);
  /* ---------- balance (rim r 18 from Fig. 2) and hairspring ---------- */
  const bl=part('bal',-80,true);
  R.staff=new THREE.Group();bl.add(R.staff);
  cylBetween(R.staff,0.45,-41.9,-22.8,M.steel,0,0,12);
  const rR=E.rRoll*ES,ir=new THREE.Shape();ir.absarc(0,0,rR,0.35,TAU-0.35,false);ir.lineTo(rR*0.55*Math.cos(-0.35),rR*0.55*Math.sin(-0.35));ir.absarc(0,0,rR*0.55,-0.35,0.35,false);
  const irg=new THREE.ExtrudeGeometry(ir,{depth:0.8,bevelEnabled:false,curveSegments:32});irg.rotateX(-Math.PI/2);irg.translate(0,-0.4,0);
  const irm=mesh(R.staff,irg,M.steel,0,-25.1,0);irm.rotation.y=-(E.aI)+Math.PI;
  const pal=(ang,r0,r1,w,y,h)=>{const q=mesh(R.staff,new THREE.BoxGeometry(r1-r0,h,w),M.ruby,(r0+r1)/2*Math.cos(ang),y,(r0+r1)/2*Math.sin(ang));q.rotation.y=-ang;};
  pal(E.aI+0.18,rR-0.9,E.rp*ES,0.4,-25.1,0.9);
  mesh(R.staff,cylY(E.rDR*ES,0.6,32),M.steel,0,-23.9,0);pal(E.aD,E.rDR*ES-0.4,E.rd*ES,0.32,-23.9,0.7);
  mesh(R.staff,new THREE.CylinderGeometry(1.4,1.4,0.9,6),M.brass2,0,-33.2,0);
  const BR=BAL_R,BY=-31.5;R.balU=new THREE.Group();R.balU.position.y=BY;R.staff.add(R.balU);
  mesh(R.balU,ring(BR,BR-1.4,2.4),M.steel);
  mesh(R.balU,new THREE.BoxGeometry(2*BR-1,1.1,2.4),M.invar);mesh(R.balU,cylY(2.4,2.4,24),M.invar);
  for(let k=0;k<60;k++){const a=k/60*TAU;if(Math.abs(Math.sin(a))<0.05)continue;const h=mesh(R.balU,cylY(0.28,0.2,8),M.steelD,(BR+0.05)*Math.cos(a),0,(BR+0.05)*Math.sin(a));h.rotation.set(0,-a,Math.PI/2);}
  const bscrew=(a,len,rr,mat)=>{const q=mesh(R.balU,cylY(rr,len,12),mat,(BR+len/2)*Math.cos(a),0,(BR+len/2)*Math.sin(a));q.rotation.set(0,-a,Math.PI/2);};
  /* 14 balance screws (Whitney) grouped about the quarters, 2 timing weights and 2 vernier timing weights (manual Fig. 3) */
  for(const c of[Math.PI/2,-Math.PI/2])for(const d of[-0.63,-0.45,-0.27,0,0.27,0.45,0.63])bscrew(c+d,1.5,0.75,M.brass);
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
  R.cock=mesh(ck,polyGeo(COCK_POLY,3.2,[],0.3),M.plate,0,-45.1,0);
  /* foot: the outer part of the crescent is a solid block down to the barrel bridge (Fig. 2) */
  const FOOT=[];for(let k=0;k<=12;k++){const a=(5+15*k/12)*D2R;FOOT.push([39.8*Math.cos(a),39.8*Math.sin(a)]);}for(let k=12;k>=0;k--){const a=(5+15*k/12)*D2R;FOOT.push([30.5*Math.cos(a),30.5*Math.sin(a)]);}
  R.cockFoot=mesh(ck,polyGeo(FOOT,12.1,[],0.2),M.plateSolid,0,-45.1,0);
  for(const a of[9,16])screw(ck,35.2*Math.cos(a*D2R),35.2*Math.sin(a*D2R),-45.1,2.8,1.5);
  const Q=[35.2*Math.cos(12*D2R),35.2*Math.sin(12*D2R)];
  /* endstone plate over the staff: small steel plate with two screws and the cap jewel */
  const ep=new THREE.Group();ep.position.set(L.B[0],-45.1,L.B[1]);ep.rotation.y=Math.atan2(-(L.B[1]-Q[1]),L.B[0]-Q[0]);ck.add(ep);
  mesh(ep,new THREE.BoxGeometry(7.4,0.7,4.6),M.steel,1.2,-0.35,0);mesh(ep,cylY(1.0,0.3,16),M.ruby,0,-0.8,0);
  screw(ep,3.6,0,-0.7,0.7,0.4);screw(ep,-1.6,1.5,-0.7,0.7,0.4);
  /* ---------- fusee (8-3/4 turns), chain, barrel (radius 13.5, below the third wheel) ---------- */
  const fsP=part('fs',-16);const dx=L.Fu[0]-L.Ba[0],dz=L.Fu[1]-L.Ba[1],fd=Math.hypot(dx,dz);
  const fs=makeFusee(M,{yS:-20.1,yB:-10.9,rmin:6.5,rmax:14,N:FUSEE_TURNS,Rb:13.5,bT:-17.9,bB:-7.4,d:fd});
  fs.g.position.set((L.Fu[0]+L.Ba[0])/2,0,(L.Fu[1]+L.Ba[1])/2);fs.g.rotation.y=Math.atan2(-dz,dx);fsP.add(fs.g);R.fs=fs;
  /* setup ratchet, click and cover plate on the barrel arbor above the barrel bridge */
  const rt=part('ratchet',-76);
  mesh(rt,gearGeo(40,0.42,1.4,{ratchet:true,bore:1.4}),M.steel,L.Ba[0],-34.3,L.Ba[1]);
  cylBetween(rt,1.4,-38,y0,M.steel,L.Ba[0],L.Ba[1]);mesh(rt,new THREE.BoxGeometry(2.4,2.4,2.4),M.steel,L.Ba[0],-37.4,L.Ba[1]);
  const clk=mesh(rt,pawlGeo(6,1.5,1,true),M.steel,L.Ba[0]-8.5,-34.3,L.Ba[1]-5);clk.rotation.y=-0.9;
  const nBefore=rt.children.length;
  { const cx=L.Ba[0],cz=L.Ba[1],A0=60*D2R,A1=280*D2R,ro=13.5,ri=2.3,pts=[];
    for(let k=0;k<=60;k++){const a=A0+(A1-A0)*k/60;pts.push([cx+ro*Math.cos(a),cz+ro*Math.sin(a)]);}
    for(let k=60;k>=0;k--){const a=A0+(A1-A0)*k/60,r=k===0||k===60?ri+1.5:ri+4.5;pts.push([cx+(k%60===0?ri+2:ri+2)*Math.cos(a),cz+(ri+2)*Math.sin(a)]);}
    const s=new THREE.Shape();pts.forEach(([x,z],i)=>i?s.lineTo(x,-z):s.moveTo(x,-z));s.closePath();
    const win=new THREE.Path(),W0=195*D2R,W1=250*D2R;win.moveTo(cx+9.6*Math.cos(W0),-(cz+9.6*Math.sin(W0)));
    for(let k=0;k<=20;k++){const a=W0+(W1-W0)*k/20;win.lineTo(cx+9.6*Math.cos(a),-(cz+9.6*Math.sin(a)));}
    for(let k=20;k>=0;k--){const a=W0+(W1-W0)*k/20;win.lineTo(cx+6.6*Math.cos(a),-(cz+6.6*Math.sin(a)));}
    s.holes.push(win);
    const cvg=new THREE.ExtrudeGeometry(s,{depth:0.5,bevelEnabled:true,bevelThickness:0.15,bevelSize:0.15,bevelSegments:1,curveSegments:24});cvg.rotateX(-Math.PI/2);cvg.translate(0,0.15,0);
    R.cover=mesh(rt,cvg,M.plateSolid,0,-35.9,0);
    screw(rt,cx+11*Math.cos(100*D2R),cz+11*Math.sin(100*D2R),-35.9,1.4,0.7);screw(rt,cx+11*Math.cos(250*D2R),cz+11*Math.sin(250*D2R),-35.9,1.4,0.7);}
  rt.children.slice(nBefore).forEach(o=>o.userData.driveHide=true);
  /* winding post (bushing and seal) around the fusee arbor; the arbor's squared end takes the key */
  const wp=part('post',-78);
  const post=mesh(wp,new THREE.LatheGeometry([V2(1.3,-33.02),V2(6.6,-33.02),V2(6.6,-34.2),V2(6.2,-34.6),V2(6.2,-41.8),V2(6.5,-42.2),V2(6.5,-43.6),V2(3.4,-43.6),V2(3.4,-41.4),V2(1.3,-41.4),V2(1.3,-33.02)].reverse(),56),M.brass2,L.Fu[0],0,L.Fu[1]);
  const fl=mesh(wp,ringGeo(8.6,6.7,1.0),M.steel,L.Fu[0],-33.52,L.Fu[1]);screw(wp,L.Fu[0]+7.6*Math.cos(2.2),L.Fu[1]+7.6*Math.sin(2.2),-34.02,1.0,0.5);screw(wp,L.Fu[0]+7.6*Math.cos(-1.0),L.Fu[1]+7.6*Math.sin(-1.0),-34.02,1.0,0.5);
  const sqP=part('sq',-84);R.sq=new THREE.Group();R.sq.position.set(L.Fu[0],0,L.Fu[1]);sqP.add(R.sq);cylBetween(R.sq,1.2,-42.4,-41.4,M.steel);mesh(R.sq,new THREE.BoxGeometry(2.4,1.6,2.4),M.steel,0,-43.0,0);
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
    const udA=fa*UD.pin/UD.wheel;R.udW.rotation.y=-udA;R.ud.rotation.y=120*D2R-udA;
    if(Math.abs(s.n-lastN)>0.0008){fs.setWind(s.n);lastN=s.n;}
    fs.stopBar.position.x=lerp(0,3.0,smooth(1-s.n/0.25));
    if(s.msOn){const In=fs.I(s.n);fs.ms.geometry.dispose();fs.ms.geometry=mainspringGeo(1-In/fs.IN,2.6,13.1,-8.2,-17.1,6+fs.IN-In);}
    if(s.springOn){R.spring.geometry.dispose();R.spring.geometry=springGeo(5.5,7.5,14,s.th,0.17);}
    /* passing spring: rides with the detent while unlocking; bends aside by itself on the return swing */
    const del=-s.lift/E.LEN,cd=Math.cos(del),sd=Math.sin(del),Ft=E.Ft;
    const rot=p=>({x:Ft.x+(p.x-Ft.x)*cd-(p.y-Ft.y)*sd,y:Ft.y+(p.x-Ft.x)*sd+(p.y-Ft.y)*cd});
    const a0=rot(E.Ps0),am=rot({x:(E.Ps0.x+E.Pt.x)/2,y:(E.Ps0.y+E.Pt.y)/2}),tp2=rot(E.Pt);tp2.x-=E.nH.x*s.psDef;tp2.y-=E.nH.y*s.psDef;
    const V=p=>new THREE.Vector3(p.x*ES,-24.0,p.y*ES);
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
  mesh(fz,new THREE.LatheGeometry(pr,72),M.gilt);cylBetween(fz,1,-33,-4,M.steel,0,0,12);
  mesh(fz,gearGeo(40,0.47,0.5,{ratchet:true,bore:1}),M.steel,0,c.yB+0.85,0);
  const stopBar=new THREE.Group();stopBar.position.y=c.yS-0.4;fz.add(stopBar);
  mesh(stopBar,new THREE.BoxGeometry(3,0.4,1.4),M.steel,2.6,0,0);mesh(stopBar,new THREE.BoxGeometry(3,0.4,1.4),M.steel,-2.6,0,0);
  const bz=new THREE.Group();bz.position.x=bx;bz.userData.partName='barrel';g.add(bz);
  const bw=new THREE.Mesh(new THREE.CylinderGeometry(c.Rb,c.Rb,Math.abs(c.bT-c.bB),72,1,true),M.brassDS);bw.position.y=(c.bT+c.bB)/2;bz.add(bw);bw.userData.driveGhost=true;bw.userData.noCap=true;
  for(const y of[c.bT+0.3,c.bB-0.3]){const cp=mesh(bz,ringGeo(c.Rb+0.7,1.5,0.6),M.gilt,0,y,0);cp.userData.driveGhost=true;}
  mesh(bz,new THREE.BoxGeometry(1.2,3,1.5),M.steel,0,(c.bT+c.bB)/2,-(c.Rb-0.9));
  const ms=new THREE.Mesh(new THREE.BufferGeometry(),M.mspring);ms.position.x=bx;ms.userData.partName='mainspring';ms.userData.onlyDrive=true;ms.userData.noCap=true;g.add(ms);
  mesh(bz,ringGeo(4,1.5,0.4),M.brass2,0,c.bT-0.25,0).userData.driveGhost=true;
  for(let k=0;k<3;k++){const a=k/3*TAU;mesh(bz,cylY(0.7,0.4,10),M.steel,2.7*Math.cos(a),c.bT-0.5,2.7*Math.sin(a));}
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
