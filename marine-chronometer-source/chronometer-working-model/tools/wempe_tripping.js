// The Wempe's detent as a frame (tripping.js --model wempe runs this): does a tooth ever get past the locking stone? tripping.js takes the Hamilton's detent as a frame of
// thin parts; this takes the Wempe's (1436: the steel spring, the square, the blade in its two sections, the pipe with the stone, the horn; the gold spring 05 04 01-2), on
// tripping.js's beams, modes and solvers, and dynamics.js --model wempe's contacts and bodies. Needs only Node.js:
//   node tripping.js --model wempe          (about 6 minutes, its runs in child processes many at once; exits with 1 if, at the model's settings, a tooth gets past the stone, a held tooth's stone uses half the depth of
//                                            lock, a blow under 20 g across the plate trips it, or the frame made rigid on a hinge parts from dynamics.js --model wempe)
//   node tripping.js --model wempe --quick  (the frame, its modes and the validation, about a minute)
// The frame (makeEsc's frame: t along the detent from its flexure Ft toward the stone, n the way the stone lifts; metres), from the pieces escapement.js draws, in the detent's
// own frame there (t from the stone toward the foot, n toward the wheel) put through MK: the spring 0.07 × 1.9, 5 long, clamped at the foot (1436), as beams; the square 2 ×
// 0.5 × 1.9 rigid, with the gold spring's head, its fixed arm to its bending point (05 04_1's "Biegungspunkt") and its screw; the blade 0.50 × 1.0 for 2.9, then 0.28 × 1.0 to
// the pipe, as beams; the pipe Ø 1.15 × 2 with the stone (Ø 0.75 ruby, the half below it) rigid, with the horn's root; the horn 0.22 × 0.8 to 4.4 from the stone (1436's figure, Wempe 3955's photograph) as beams; the
// gold spring 0.15 × 1.0 from its bending point along its drawn path to its square tip as beams (333 gold, about 90 GPa and 11.0 g/cm³: estimated, as WESC.SET and
// wempe-inertia.js), resting on the horn 5 µm off (escapement.js); steel 205 GPa (200-210), 7.85 g/cm³. The banking, the block's cross screw's domed head (escapement.js; its
// head not drawn): the pipe's side toward the wheel rests on its face at the stone (05 04 01-4's 18.8, the 6MX's block photographed: likely; until 15 October 2026 under
// the blade 0.7-1.4 mm from the stone, where makeEsc puts the Hamilton's stop button, estimated). The preload WESC.SET's, 0.63 g at the stone (estimated), a moment at the spring's end; as
// drawn (the spring straight at its banking) none.
// Contacts, each a spring with a dashpot set for its restitution (tripping.js's): the discharge stone on the gold spring (its bevelled end on the strip's square end, by
// separating axes: the depth and its gradient in the tip's place and the balance's angle; on the active swing at the horn's end carried to the tip, backed by the horn, as
// makeEsc and dynamics.js take it, on the return at the gold spring's own tip), the gold spring on the horn at three places, the pipe on the banking, the locked tooth
// on the stone (makeEsc's recoil), the tooth on the impulse stone (makeEsc's bite) and, the Wempe's, the stone on the tooth it has let go (dynamics.js's ride: the stone's
// least lift over that tooth, its friction MU against the wheel's turn).
const fs=require('fs'),path=require('path');
if(!process.argv.includes('--model'))process.argv.push('--model','wempe');
const DY=require('./dynamics.js'),TR=require('./tripping.js');
const{ESC,WL,WJ,polyM}=DY,{assemble,modes,rows,dot,gsolve,tn,xy,kU,cT,LV,VF,zetaOf}=TR;
/* the locked tooth on the stone, the Wempe's: its flat draws −3.7° (on the wheel's radius), so lifting the stone lets the tooth on, not back (makeEsc's recoil, held at 0 or
   more, is 0 all the way: tripping.js's rec). From makeEsc's toothBack, the tooth's most forward place with the stone lifted l: a straight line (the flat; toothBack's
   own outline sampling leaves steps of 0.005°), to where the tooth is free, lFr: the tip past the flat's inner end, the depth of lock (lPk = lFr: past it nothing holds it) */
const lFr=(()=>{let lo=0,hi=ESC.lRel;for(let i=0;i<50;i++){const m=(lo+hi)/2;ESC.toothBack(m)>-1e8?lo=m:hi=m;}return lo;})(),lPk=lFr;
const RSL=(()=>{const a0=ESC.toothBack(0);let sxy=0,sxx=0;for(let k=1;k<=60;k++){const l=0.98*lFr*k/60,y=ESC.toothBack(l)-a0;sxy+=l*y;sxx+=l*l;}return sxy/sxx;})();
const rec=l=>l<=0||l>=lFr?0:RSL*l,recD=l=>l<=0||l>=lFr?0:RSL;
const ES=DY.ES,D=Math.PI/180,TAU=2*Math.PI,G0=9.80665,S=ESC.settings,X=WL.WESC,WD=WL.WD,dB=ESC.dirB,nB=ESC.nB;
/* the detent's own frame in escapement.js (t from the stone toward the foot, n toward the wheel, mm): Dp(t, n) its plan point, P the stone's centre, DPIV its flexure (TP) */
const tH_={x:(X.DPIV[0]-X.P[0])/X.TP,y:(X.DPIV[1]-X.P[1])/X.TP},nH_=(()=>{let n={x:-tH_.y,y:tH_.x};if(n.x*(X.W[0]-X.P[0])+n.y*(X.W[1]-X.P[1])<0)n={x:-n.x,y:-n.y};return n;})();
const Dp=(t,n)=>[X.P[0]+t*tH_.x+n*nH_.x,X.P[1]+t*tH_.y+n*nH_.y],toDp=q=>{const v=[q[0]-X.P[0],q[1]-X.P[1]];return[v[0]*tH_.x+v[1]*tH_.y,v[0]*nH_.x+v[1]*nH_.y];};
const U=(t,n)=>X.MK(Dp(t,n)),Q=(t,n)=>tn(U(t,n));   /* makeEsc's unit frame, and its (t, n) in metres from Ft */
/* escapement.js's numbers (05 04_1, 1436, 05 04 01-2; its comments say how each was read) */
const TP=X.TP,FOOT0=TP+2.5,SPR0=TP-2.5,SQ0=SPR0-2,[tB,nBp]=toDp(X.B),GT=tB+1.54,GN=nBp+0.005,GW=0.15,GNB=GN-GW/2,GB=[6.7,0.325],HEAD=SQ0+2.2,H0=HEAD-2.4;
const GPATH=[[GB[0],GB[1]],[3.0,0.62],[0.6,0.72],[0,0.72],[-0.5,0.55],[-0.85,0.15],[-1.2,-0.25],[-1.6,GN],[GT,GN]];   /* the gold spring's free part, its bending point to its tip */
const HORN_L=4.4,HORN=[[-0.2,-0.40],[-0.45,-0.25],[-0.7,GNB-0.005],[-HORN_L,GNB-0.005],[-HORN_L,GNB-0.225],[-0.5,GNB-0.225],[-0.15,-0.52]],HN=GNB-0.115,HT0=-0.6,HT1=-HORN_L;   /* the horn (escapement.js's HORN_L), its beam's line */
const BANK=[0,0.575];   /* where the banking screw's head meets the pipe: its side toward the wheel at the stone (escapement.js's t, n; mm) */
const TI=-WD.INNER,yd=d=>TI+d,STONE_LO=yd(X.PIPE0)-(X.Y.ew0-0.06);   /* the stone's half below the pipe, down to 0.06 under the wheel's teeth (escapement.js's PIPE0: 3.3 until 15 October 2026) */
const RHO={st:7850,gold:11000,ruby:3980},EST=S.EB*1e9,EGO=S.ET*1e9;
const rectP=(t0,t1,n0,n1)=>[[t0,n0],[t1,n0],[t1,n1],[t0,n1]].map(([t,n])=>U(t,n)),discP=(c,r,k=48)=>[...Array(k)].map((_,i)=>U(c[0]+r*Math.cos(TAU*i/k),c[1]+r*Math.sin(TAU*i/k)));
const pm=(pts,h,rho,f=1)=>{const q=polyM(pts,h*1e-3,rho);return{m:f*q.m,mx:f*q.mx,my:f*q.my,I:f*q.I};};

/* ---------- the frame ---------- */
/* o: hinge (the spring as a pin at Ft with dynamics.js's stiffness KD, as dynamics.js takes it), stiff (blade, pipe and horn rigid with the square), tS (the spring's
   thickness, times the drawn), tsK (the gold spring's stiffness, times) */
function frame(o={}){
  const N=[],E=[],B=[];
  const nd=(p,k='free',m=-1)=>{N.push({t:p.t,n:p.n,k,m});return N.length-1;};
  const el=(i,j,Em,b,h,rho,grp)=>E.push({i,j,E:Em,A:b*h,I:h*b**3/12,rA:rho*b*h,grp});
  const line=(i,j,ne,Em,b,h,rho,grp,extra=[])=>{const a=N[i],c=N[j],ts=[...new Set([0,1,...extra])].sort((x,y)=>x-y);let all=[];for(let k=0;k<ts.length-1;k++){const f0=ts[k],f1=ts[k+1],m=Math.max(1,Math.round(ne*(f1-f0)));for(let s=0;s<m;s++)all.push(f0+(f1-f0)*s/m);}all.push(1);
    let p=i;const out=[i];for(let k=1;k<all.length;k++){const q=k===all.length-1?j:nd({t:a.t+(c.t-a.t)*all[k],n:a.n+(c.n-a.n)*all[k]});el(p,q,Em,b,h,rho,grp);out.push(q);p=q;}return out;};
  /* the spring, its foot clamped (drawn) or a pin at Ft (hinged: its stiffness KD there, the spring's free half slaved to it, its foot half left out) */
  const tS=0.07e-3*(o.tS??1);let R0,F1,sp;
  if(o.hinge){R0=nd({t:0,n:0},'pin');F1=nd(Q(SPR0,0),'slave',R0);sp=[R0,F1];}
  else{R0=nd(Q(FOOT0,0),'clamp');const Mf=nd(Q(TP,0));F1=nd(Q(SPR0,0));sp=[...line(R0,Mf,5,EST,tS,1.9e-3,RHO.st,'springFoot'),...line(Mf,F1,5,EST,tS,1.9e-3,RHO.st,'spring').slice(1)];}
  /* the blade: 0.50 thick for 2.9 from the square, then 0.28 to the pipe's wall (its nodes where makeEsc puts a stop button, the banking until 15 October 2026, kept: nb) */
  const bt=TR.X.button,b0=nd(Q(SQ0,0),'slave',F1),b1=nd(Q(SQ0-2.9,0)),K=nd({t:ESC.BL*ESC.ES/1000,n:0}),b2=nd(Q(0.575,0),'slave',K);   /* K: the stone's body node at the locking face's middle S */
  const bl1=line(b0,b1,6,EST,0.5e-3,1.0e-3,RHO.st,'blade'),fr=t=>(t-N[b1].t)/(N[b2].t-N[b1].t),bl2=line(b1,b2,10,EST,0.28e-3,1.0e-3,RHO.st,'blade',[fr(bt.t0),fr(bt.t1)]);
  const nb=[bl2.find(i=>Math.abs(N[i].t-bt.t0)<1e-9),bl2.find(i=>Math.abs(N[i].t-bt.t1)<1e-9)];
  /* the horn: its root with the pipe, a beam on its line from 0.6 to 3.5 past the stone; nodes over the gold spring's straight end, where it rests */
  const HC=[-1.6,-2.55,HT1],h0=nd(Q(HT0,HN),'slave',K),h1=nd(Q(HT1,HN)),fh=t=>(t-HT0)/(HT1-HT0),hn=line(h0,h1,8,EST,0.22e-3,0.8e-3,RHO.st,'horn',HC.slice(0,2).map(fh));
  const nh=HC.map(t=>hn.find(i=>Math.abs(N[i].t-Q(t,HN).t)<1e-12));
  /* the gold spring: its bending point rigid with the square (its head screwed to it), beams along its drawn path to its tip; the nodes over the horn */
  const g0=nd(Q(GB[0],GB[1]),'slave',F1);let gp=g0;const gs=[g0];
  for(let k=1;k<GPATH.length;k++){const[t,n]=GPATH[k],q=nd(Q(t,n)),L=Math.hypot(t-GPATH[k-1][0],n-GPATH[k-1][1]),last=k===GPATH.length-1;
    const ex=last?[(-2.55-GPATH[k-1][0])/(t-GPATH[k-1][0]),(HT1-GPATH[k-1][0])/(t-GPATH[k-1][0])]:[];gs.push(...line(gp,q,Math.max(1,Math.round(L/0.4)),EGO*(o.tsK??1),GW*1e-3,1.0e-3,RHO.gold,'gold',ex).slice(1));gp=q;}
  const tip=gp,ng=HC.map(t=>gs.find(i=>Math.abs(N[i].t-Q(t,GN).t)<1e-12));
  if(nh.some(i=>i==null)||ng.some(i=>i==null)||nb.some(i=>i==null))throw Error('wempe_tripping: a contact node not found');
  if(o.stiff){for(const i of[b1,...bl1.slice(1,-1),...bl2.slice(1,-1),K,...hn.slice(1)])N[i].k='slave',N[i].m=F1;}
  /* the rigid bodies: their pieces' mass about their node (polyM, as tripping.js) */
  const body=(a,parts)=>{let m=0,mx=0,my=0,I=0;for(const q of parts){m+=q.m;mx+=q.mx;my+=q.my;I+=q.I;}const St=mx*dB.x+my*dB.y,Sn=mx*nB.x+my*nB.y,A=N[a];
    B.push({a,m,St:St-m*A.t,Sn:Sn-m*A.n,Io:I-2*(A.t*St+A.n*Sn)+m*(A.t**2+A.n**2)});};
  const n0=GB[1]-GW/2,n1=GB[1]+GW/2,scr=(()=>{const c=U(HEAD-1.2,GB[1]+GW/2+0.15),m=WJ.detent.byHn['WN-14'].m*1e-3,x=(c.x-ESC.Ft.x)*ES,y=(c.y-ESC.Ft.y)*ES;return{m,mx:m*x,my:m*y,I:m*(x*x+y*y)};})();   /* the screw WN-14: its mass weighed, at its centre */
  body(F1,[pm(rectP(SQ0,SPR0,-0.25,0.25),1.9,RHO.st),pm(rectP(H0,HEAD,n0,n1),2.0,RHO.gold),pm(rectP(GB[0],H0,n0,n1),1.0,RHO.gold),scr]);
  const hornAll=pm(HORN.map(([t,n])=>U(t,n)),0.8,RHO.st),hornBeam=pm(rectP(HT1,HT0,GNB-0.225,GNB-0.005),0.8,RHO.st);   /* the horn's root: the whole less what its beam carries */
  body(K,[pm(discP([0,0],0.575),2.0,RHO.st),pm(discP([0,0],0.377),2.0,RHO.st,-1),pm(discP([0,0],0.375),2.0,RHO.ruby),pm(discP([0,0],0.375,48).slice(0,25),STONE_LO,RHO.ruby),
    pm(rectP(0.4,0.575,-0.14,0.14),1.0,RHO.st),{m:hornAll.m-hornBeam.m,mx:hornAll.mx-hornBeam.mx,my:hornAll.my-hornBeam.my,I:hornAll.I-hornBeam.I}]);
  return{N,E,B,R0,F1,K,nb,nh,ng,tip,hn,gs,o};
}
/* the half disc below the pipe: discP's first 25 points run half way round (the stone's lower half is ground to its flat; which half doesn't change its mass, and its moments by
   under 0.2 mm in 13) */

/* ---------- the detent built, reduced, preloaded, its modes ---------- */
function detent(o={}){
  const F=frame(o),Am=assemble(F),nr=Am.nr,rS=rows(F,Am,F.K),qb=Q(...BANK),rb=[rows(F,Am,F.K,qb.t,qb.n),null];   /* the banking: one contact, the pipe on the screw's head (rigid with the stone's body K) */
  /* the preload: WESC.SET's (W78 at the stone, no Op. 78: the spring unbent at its banking), a moment MPRE at the spring's end pressing the detent onto its banking */
  const fm=new Float64Array(nr);{const c=Am.T[3*F.F1+2];for(let j=0;j<nr;j++)fm[j]=c[j];}const alpha=-DY.MPRE*(o.pre??1),fpre=fm.map(x=>x*alpha);
  const fS=rS.rv,uS=gsolve(Am.Kr,fS),kS=1/dot(rS.rv,uS);
  /* mass and inertia about Ft of the moving parts (the spring's foot half left out, as wempe-inertia.js weighs the detent): the elements' and the bodies' */
  let mass=0,Ift=0;for(const e of F.E){if(e.grp==='springFoot')continue;const a=F.N[e.i],b=F.N[e.j],L=Math.hypot(b.t-a.t,b.n-a.n),m=e.rA*L,ct=(a.t+b.t)/2,cn=(a.n+b.n)/2;mass+=m;Ift+=m*(ct*ct+cn*cn+L*L/12);}
  for(const b of F.B){const A=F.N[b.a];mass+=b.m;Ift+=b.Io+2*(A.t*b.St+A.n*b.Sn)+b.m*(A.t**2+A.n**2);}
  return{F,Am,nr,rS,rb,alpha,fpre,kS,mass,Ift,o};
}
function modal(dt,fMax){
  const ms=modes(dt.Am),F=dt.F,Am=dt.Am,out=[];
  for(const md of ms){const f=md.w/TAU;if(f>fMax)break;const full=new Float64Array(Am.nf);for(let i=0;i<Am.nf;i++){let s=0;for(let j=0;j<Am.nr;j++)s+=Am.T[i][j]*md.phi[j];full[i]=s;}
    const sh={};let tot=0;for(const e of F.E){let s=0;for(let a=0;a<6;a++)for(let b=0;b<6;b++)s+=full[e.ix[a]]*e.ke[a][b]*full[e.ix[b]];const g=e.grp==='springFoot'?'spring':e.grp;sh[g]=(sh[g]||0)+s/2;tot+=s/2;}
    if(F.o.hinge)sh.spring=(sh.spring||0)+DY.KD*full[3*F.R0+2]**2/2,tot+=DY.KD*full[3*F.R0+2]**2/2;
    for(const k in sh)sh[k]/=tot;out.push({f,w:md.w,phi:md.phi,share:sh,stone:dot(dt.rS.rv,md.phi)});}
  return out;}

/* ---------- the escapement in time with the frame ---------- */
const{I,K:KB,C:CB,JT,TAUE,LEN,W0,T0}=DY,P=ESC.P,lRel=ESC.lRel,BLu=ESC.BL,day=DY.day,at=DY.at,Gt=DY.G,G1t=DY.G1,rdA=DY.rdA,rd1=DY.rd1;
const wrap=a=>a-TAU*Math.floor((a+Math.PI)/TAU);
/* the discharge stone on the gold spring's square end, as dynamics.js's slabP but a depth: the stone (makeEsc's bevelled slab at the balance's angle th) and the strip's end
   (its tip displaced du along t and dv along n, metres) overlap by pen (unit frame) along the axis that parts them least; 0 apart */
const SJ=(()=>{const w=ESC.wD/2,ra=ESC.rd-0.5*ESC.rho,bv=S.BEV;return[[0,-w],[ra-bv,-w],[ra,w],[0,w]];})(),TIPL=DY.TIPL,RHOU=ESC.rho;
const pen=(th,du,dv)=>{const u={x:Math.cos(ESC.aD+th),y:Math.sin(ESC.aD+th)},m={x:-u.y,y:u.x},e={x:-dB.x,y:-dB.y},px=ESC.Pt.x+(du*dB.x+dv*nB.x)/ES,py=ESC.Pt.y+(du*dB.y+dv*nB.y)/ES;
  const J=SJ.map(([a,b])=>({x:a*u.x+b*m.x,y:a*u.y+b*m.y})),Tp=[[0,-RHOU],[TIPL,-RHOU],[TIPL,RHOU],[0,RHOU]].map(([a,b])=>({x:px+a*e.x+b*nB.x,y:py+a*e.y+b*nB.y}));
  let best=Infinity;for(const Pg of[J,Tp])for(let k=0;k<4;k++){const p=Pg[k],q=Pg[(k+1)%4],l=Math.hypot(q.x-p.x,q.y-p.y),ax=-(q.y-p.y)/l,ay=(q.x-p.x)/l;let j0=Infinity,j1=-Infinity,t0=Infinity,t1=-Infinity;
    for(const v of J){const s=v.x*ax+v.y*ay;j0=Math.min(j0,s);j1=Math.max(j1,s);}for(const v of Tp){const s=v.x*ax+v.y*ay;t0=Math.min(t0,s);t1=Math.max(t1,s);}const o=Math.min(j1-t0,t1-j0);if(o<=0)return 0;best=Math.min(best,o);}
  return best;};
/* model: the frame and its modes for options o (frame's; fMax, Q, the contacts' stiffness and restitution as tripping.js's model: kB banking, kT tooth on stone and on the impulse
   stone, kJ stone on the gold spring on the active swing, kR on the return, kH gold spring on horn; eB, eL, eI, eJ, eH), MU the tooth's friction on the stone, qsDraw/relRel
   as tripping.js */
function model(o={}){
  const dt=detent(o),md=modal(dt,o.fMax??30000),N=md.length,F=dt.F,Am=dt.Am;
  const proj=r=>Float64Array.from(md,m=>dot(r,m.phi));
  const tP=tn(ESC.Pt),hEnd=F.hn[F.hn.length-1];
  const R={S:{u:proj(dt.rS.ru),v:proj(dt.rS.rv)},b:dt.rb.map(r=>r?proj(r.rv):new Float64Array(md.length)),tip:(()=>{const r=rows(F,Am,F.tip);return{u:proj(r.ru),v:proj(r.rv)};})(),
    hx:(()=>{const r=rows(F,Am,hEnd,tP.t,tP.n);return{u:proj(r.ru),v:proj(r.rv)};})(),h:F.ng.map((g,k)=>{const a=rows(F,Am,g).rv,b=rows(F,Am,F.nh[k]).rv;return proj(a.map((x,j)=>x-b[j]));})};
  const fpre=proj(dt.fpre),w=Float64Array.from(md,m=>m.w),z=new Float64Array(N).fill(1/(2*(o.Q??100)));
  const gam=fn=>{const v=new Float64Array(Am.nf);for(let i=0;i<F.N.length;i++){const p=F.N[i],q=xy(p.t,p.n),[ax,ay,al]=fn(q.x*ES,q.y*ES);v[3*i]=ax*dB.x+ay*dB.y;v[3*i+1]=ax*nB.x+ay*nB.y;v[3*i+2]=al;}
    const mv=new Float64Array(Am.nf);for(let i=0;i<Am.nf;i++){let s=0;for(let j=0;j<Am.nf;j++)s+=Am.Mf[i][j]*v[j];mv[i]=s;}const red=new Float64Array(Am.nr);for(let j=0;j<Am.nr;j++){let s=0;for(let i=0;i<Am.nf;i++)s+=Am.T[i][j]*mv[i];red[j]=s;}return proj(red);};
  const Gx=gam(()=>[1,0,0]),Gy=gam(()=>[0,1,0]),Ga=gam((x,y)=>[-y,x,1]);
  const kB=o.kB??1e6,kT=o.kT??1e6,kJ=o.kJ??2e5,kR=o.kR??500,kH=o.kH??2e4;
  const r2=r=>r.reduce((s_,x)=>s_+x*x,0),mLoc=(...rs)=>1/rs.reduce((s_,r)=>s_+r2(r),0);
  const mW=JT/(cT*cT),mBt=mLoc(R.b[0]),mTip=mLoc(R.hx.u,R.hx.v),mTs=mLoc(R.tip.u,R.tip.v),mHn=mLoc(R.h[1]),mT=1/(1/mW+1/mLoc(R.S.u,R.S.v)),mRd=1/(1/(JT/(ES*ES))+1/mLoc(R.S.v));
  const cd=(k,m,e)=>2*zetaOf(e)*Math.sqrt(k*m);
  const C={B:cd(kB,mBt,o.eB??0.3),L:cd(kT,mT,o.eL??0.3),I:cd(kT,mW,o.eI??0),J:cd(kJ,mTip,o.eJ??0),Jr:cd(kR,mTs,o.eR??0),H:cd(kH,mHn,o.eH??0.3),Rd:cd(kT,mRd,o.eD??0)};
  const lim=[Math.max(...w),Math.sqrt(kB*r2(R.b[0])),C.B*r2(R.b[0]),Math.sqrt(kT*(r2(R.S.u)+r2(R.S.v))),C.L*(r2(R.S.u)+r2(R.S.v)),
    Math.sqrt(kJ*(r2(R.hx.u)+r2(R.hx.v))),C.J*(r2(R.hx.u)+r2(R.hx.v)),Math.sqrt(kR*(r2(R.tip.u)+r2(R.tip.v))),C.Jr*(r2(R.tip.u)+r2(R.tip.v)),Math.sqrt(kH*r2(R.h[1])),C.H*r2(R.h[1]),(o.MU??S.MU)*TAUE*(o.sMax??1.6)/cT/VF*(r2(R.S.v))],hf=Math.min(1e-6,0.9/Math.max(...lim));
  return{o,dt,md,N,R,fpre,w,z,Gx,Gy,Ga,kB,kT,kJ,kR,kH,C,mu:o.MU??S.MU,hf,lim};
}

/* one run, as tripping.js's run, with the Wempe's contacts: the stone's depth on the gold spring (pen) and the stone on the tooth it let go (the ride) */
function run(M,o={}){
  const{N,R,fpre,w,z,Gx,Gy,Ga,kB,kT,kJ,kR,kH,C,mu}=M,s=o.s??1,tauE=TAUE*s,qD=!!M.o.qsDraw,mDq=tauE*DY.CDR/DY.DREL,ext=o.ext,T=o.T??20,from=o.from??10,GAP=5e-6;
  const nY=4+2*N,Y=new Float64Array(nY),Yt=new Float64Array(nY),k1=new Float64Array(nY),k2=new Float64Array(nY),k3=new Float64Array(nY),k4=new Float64Array(nY);
  let held=true;const dg={jew:0,btn:0,tooth:0,imp:0,horn:0,l:0,ride:0};
  const der=(t,y,out,save)=>{
    const th=y[0],om=y[1],ph=y[2],pv=y[3];let ax=0,ay=0,al=0;if(ext){const e=ext(t);ax=e.ax||0;ay=e.ay||0;al=e.al||0;}
    let vS=0,uS=0,vSd=0,uSd=0,tu=0,tv=0,tud=0,tvd=0;const act=om>0,Ru=act?R.hx.u:R.tip.u,Rv=act?R.hx.v:R.tip.v;const b=[0,0],bd=[0,0],h=[0,0,0],hd=[0,0,0];
    for(let i=0;i<N;i++){const q=y[4+i],qd=y[4+N+i];vS+=R.S.v[i]*q;uS+=R.S.u[i]*q;vSd+=R.S.v[i]*qd;uSd+=R.S.u[i]*qd;tu+=Ru[i]*q;tv+=Rv[i]*q;tud+=Ru[i]*qd;tvd+=Rv[i]*qd;
      b[0]+=R.b[0][i]*q;b[1]+=R.b[1][i]*q;bd[0]+=R.b[0][i]*qd;bd[1]+=R.b[1][i]*qd;for(let k=0;k<3;k++){h[k]+=R.h[k][i]*q;hd[k]+=R.h[k][i]*qd;}}
    let Mth=-KB*th-CB*om-I*al,Mph=-tauE-JT*al;let fS_v=0,fS_u=0,fT_u=0,fT_v=0;const fb=[0,0],fh=[0,0,0];
    const l=vS*LV,dl=vSd*LV,Rr=rec(l),Rd=recD(l),dph=Rr+kU*uS-(held?ph:ph+P),dphd=Rd*dl+kU*uSd-pv;let Ft_=0;
    if(qD&&held){Ft_=tauE;Mph=0;if(l>0)fS_v-=mDq/(BLu*ES);}
    else if(dph>0&&(held||l<(M.o.relRel?lRel:lFr))){Ft_=Math.max(0,kT*cT*cT*dph+M.C.L*cT*cT*dphd);Mph+=Ft_;fS_v-=Ft_*Rd*LV;fS_u-=Ft_*kU;const fn=Ft_/cT;fS_v-=mu*fn*Math.tanh(vSd/VF);}
    /* the stone on the tooth it let go: its lift held at least the ride's (dynamics.js's RDT) while that tooth is under it */
    let Fr=0;if(!held&&ph<0&&ph>-P){const rr=rdA(ph)*LEN;if(rr>0){const pn=(rr-l)/LV;if(pn>0){const r1=rd1(ph)*LEN/LV,pnd=r1*pv-vSd;Fr=Math.max(0,kT*pn+C.Rd*pnd);fS_v+=Fr;Mph+=-Fr*r1+mu*Fr*ES*Math.tanh(-pv/0.05);}}}
    let Fi=0,g1S=0;if(!held){const g=at(Gt,th);if(!isNaN(g)){const g1=at(G1t,th)||0,d=g-ph;if(d>0){g1S=g1;Fi=Math.max(0,kT*ES*ES*d+C.I*ES*ES*(g1*om-pv));Mph+=Fi;Mth-=Fi*g1;}}}
    /* the stone on the gold spring: its depth and how it changes with the tip's place and the balance's angle, by differences */
    let Fj=0,gthS=0;{const tw_=wrap(th),p0=tw_>-0.6&&tw_<0.4?pen(th,tu,tv):0;if(p0>0){const e=1e-9,et=1e-7,gu=(pen(th,tu+e,tv)-pen(th,tu-e,tv))/(2*e)*ES,gv=(pen(th,tu,tv+e)-pen(th,tu,tv-e))/(2*e)*ES,gth=(pen(th+et,tu,tv)-pen(th-et,tu,tv))/(2*et)*ES;
      const dd=gu*tud+gv*tvd+gth*om;Fj=Math.max(0,(act?kJ:kR)*p0*ES+(act?C.J:C.Jr)*dd);Mth-=Fj*gth;gthS=gth;fT_u-=Fj*gu;fT_v-=Fj*gv;}}
    let Fb=0;for(let k=0;k<2;k++){if(b[k]<0){fb[k]=Math.max(0,-kB*b[k]-C.B*bd[k]);Fb+=fb[k];}}
    let Fh=0;for(let k=0;k<3;k++){if(h[k]>GAP){fh[k]=Math.max(0,kH*(h[k]-GAP)+C.H*hd[k]);Fh+=fh[k];}}
    out[0]=om;out[1]=Mth/I;out[2]=pv;out[3]=qD&&held?0:Mph/JT;
    for(let i=0;i<N;i++){const q=y[4+i],qd=y[4+N+i];
      const f=fpre[i]+fS_v*R.S.v[i]+fS_u*R.S.u[i]+fT_u*Ru[i]+fT_v*Rv[i]+fb[0]*R.b[0][i]+fb[1]*R.b[1][i]-fh[0]*R.h[0][i]-fh[1]*R.h[1][i]-fh[2]*R.h[2][i]-(Gx[i]*ax+Gy[i]*ay+Ga[i]*al);
      out[4+i]=qd;out[4+N+i]=f-2*z[i]*w[i]*qd-w[i]*w[i]*q;}
    if(save){dg.fu=fT_u;dg.fv=fT_v;dg.mJ=-Fj*gthS;dg.mI=-Fi*g1S;dg.jew=Fj;dg.btn=Fb;dg.tooth=Ft_;dg.imp=Fi;dg.horn=Fh;dg.ride=Fr;dg.l=l;dg.ld=dl;dg.uS=uS;}};
  const step=(t,h)=>{der(t,Y,k1,true);for(let i=0;i<nY;i++)Yt[i]=Y[i]+h/2*k1[i];der(t+h/2,Yt,k2);for(let i=0;i<nY;i++)Yt[i]=Y[i]+h/2*k2[i];der(t+h/2,Yt,k3);
    for(let i=0;i<nY;i++)Yt[i]=Y[i]+h*k3[i];der(t+h,Yt,k4);for(let i=0;i<nY;i++)Y[i]+=h/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i]);};
  /* rest: the detent on its banking with the tooth held, the balance far off (tripping.js's: Newton, else let settle and polish) */
  const rest=()=>{const yy=new Float64Array(nY),o_=new Float64Array(nY);yy[0]=Math.PI;
    const res=v=>{for(let i=0;i<N;i++)yy[4+i]=v[i];yy[2]=v[N];for(let i=0;i<N;i++)yy[4+N+i]=0;yy[1]=0;yy[3]=0;der(0,yy,o_);return[...Array(N).keys()].map(i=>o_[4+N+i]).concat([qD?v[N]:o_[3]*JT]);};
    const newton=x=>{for(let it=0;it<30;it++){const r0=res(x),J=[];const e=1e-12;for(let j=0;j<=N;j++){const xp=Float64Array.from(x);xp[j]+=j<N?e:1e-9;const r1=res(xp);J.push(r1.map((v,i)=>(v-r0[i])/(j<N?e:1e-9)));}
      const A=r0.map((_,i)=>J.map(c=>c[i])),dx=gsolve(A,r0.map(v=>-v));let mx=0;for(let j=0;j<=N;j++){x[j]+=dx[j];mx=Math.max(mx,Math.abs(dx[j]));}if(!(mx<1e3))return false;if(mx<1e-15)return true;}return false;};
    const x0=new Float64Array(N+1);for(let i=0;i<N;i++)x0[i]=1e-3*fpre[i]/(w[i]*w[i]);x0[N]=-1.0001*tauE/(kT*cT*cT);
    let x=Float64Array.from(x0);if(newton(x)&&x.every(Number.isFinite))return x;
    const h=M.hf,cw=2*Math.sqrt(kT*cT*cT/JT);yy.fill(0);yy[0]=Math.PI;for(let i=0;i<N;i++)yy[4+i]=x0[i];yy[2]=x0[N];
    for(let k=0;k<0.2/h;k++){der(0,yy,o_);let v=0;for(let i=0;i<N;i++){yy[4+N+i]+=h*(o_[4+N+i]-2*w[i]*yy[4+N+i]);yy[4+i]+=h*yy[4+N+i];v=Math.max(v,Math.abs(yy[4+N+i]/w[i]));}
      if(!qD){yy[3]+=h*(o_[3]-cw*yy[3]);yy[2]+=h*yy[3];}if(k>1000&&v<1e-14&&Math.abs(yy[3])<1e-9)break;}
    x=Float64Array.from([...yy.slice(4,4+N),yy[2]]);const xr=Float64Array.from(x);
    if(!(newton(x)&&x.every(Number.isFinite)))x=xr;
    if(!x.every(Number.isFinite))throw Error('wempe_tripping.js: the detent\'s rest not found');
    return x;};
  const ext0=o.ext;o.ext=null;const xs=rest();o.ext=ext0;
  const qs=xs.slice(0,N),ps=xs[N];
  Y[0]=-(o.A??ESC.A/D)*D;Y[1]=0;Y[2]=ps;Y[3]=0;for(let i=0;i<N;i++)Y[4+i]=qs[i];
  const st={jt:-1,offs:[],offL:NaN,swRel:0,twice:0,beats:0,rel:[],trips:0,knock:0,pass:0,land:[],off:[],home:[],cross:[],amps:[],ampT:[],ring:0,arrive:[],lastRel:-1,jewOn:false,offT:-1,homeT:-1,maxL:0,steps:0,frozen:0,rideOn:[],rideT:-1};
  const hf=o.hf??M.hf,hc=o.hc??1e-4;
  const quiet=()=>{let aS=0,aT=0;for(let i=0;i<N;i++){const a=Math.abs(Y[4+N+i]/w[i]);aS+=a*Math.abs(R.S.v[i]);aT+=a*(Math.abs(R.tip.v[i])+Math.abs(R.tip.u[i]));}return aS<1e-9&&aT<1e-8&&Math.abs(Y[3])<1e-5;};
  let t=0,frozen=false;
  while(t<T){
    const tw=wrap(Y[0]),near=(ext&&!o.extFine)||(tw>-0.8&&tw<0.55)||!held||(ext&&o.extFine&&o.extFine(t));
    if(!near&&!frozen&&quiet()){frozen=true;for(let i=0;i<N;i++)Y[4+N+i]=0;Y[3]=0;}
    if(near)frozen=false;
    const h=Math.min(frozen?hc:hf,T-t),thO=Y[0],wO=Y[1];
    if(frozen){const f=(th,om)=>(-KB*th-CB*om)/I;const a1=f(Y[0],Y[1]),v1=Y[1],a2=f(Y[0]+h/2*v1,Y[1]+h/2*a1),v2=Y[1]+h/2*a1,a3=f(Y[0]+h/2*v2,Y[1]+h/2*a2),v3=Y[1]+h/2*a2,a4=f(Y[0]+h*v3,Y[1]+h*a3),v4=Y[1]+h*a3;
      Y[0]+=h/6*(v1+2*v2+2*v3+v4);Y[1]+=h/6*(a1+2*a2+2*a3+a4);st.frozen++;}
    else{step(t,h);st.steps++;}
    t+=h;const th=Y[0],om=Y[1];
    if(thO>0&&th<=0&&om<0)st.cross.push(t-h+h*thO/(thO-th));
    if((wO>0&&om<=0)||(wO<0&&om>=0)){st.amps.push(Math.abs(th));st.ampT.push(t);if(wO<0)st.swRel=0;}
    if(frozen)continue;
    der(t,Y,k1,true);const l=dg.l,jewOn=dg.jew>0;
    if(jewOn&&om>0)st.jt=t;
    if(st.jewOn&&!jewOn&&om>0&&!held){if(!(st.offT>st.lastRel))st.off.push(th/D);st.offT=t;st.offL=th/D;}
    st.jewOn=jewOn;
    if(dg.ride>0&&st.rideT<st.lastRel){st.rideT=t;st.rideOn.push(th/D);}
    if(held){
      if(l>=(qD||M.o.relRel?lRel:lFr)){held=false;st.rel.push(th/D);st.lastRel=t;st.homeT=-1;if(st.swRel++>0){st.trips++;st.twice++;if(o.trace)o.trace.push([t,'twice',th/D]);}else if(!(t-st.jt<2e-3&&om>0)){st.trips++;st.knock++;if(o.trace)o.trace.push([t,'knocked',th/D]);}if(o.trace)o.trace.push([t,'release',th/D,jewOn]);}
      else if(t-st.jt>2e-3||om<0){if(l>st.maxL){st.maxL=l;st.maxTh=th/D;st.maxOm=om;}if(st.homeT>0&&l>st.ring)st.ring=l;}}
    else{if(rec(l)+kU*dg.uS-(Y[2]+P)>=0){Y[2]+=P;if(l<(qD||M.o.relRel?lRel:lFr)){held=true;st.beats++;if(M.o.qsDraw){Y[2]=ps;Y[3]=0;}if(!isNaN(st.offL))st.offs.push(st.offL);st.arrive.push(l/lPk);if(o.trace)o.trace.push([t,'lock',th/D,l/lRel]);}else{st.trips++;st.pass++;if(o.trace)o.trace.push([t,'passed',th/D,l/lRel]);}}}
    if(st.lastRel>0&&st.homeT<0&&dg.btn>0&&!jewOn&&dg.ride===0&&t>st.offT&&st.offT>st.lastRel){st.homeT=t;st.home.push(th/D);}
    if(o.watch)o.watch(t,Y,dg,held);
    if(o.rec&&t>=o.rec.t0&&t<=o.rec.t1&&t>=o.rec.next){o.rec.next=t+o.rec.dt;o.rec.out.push([+t.toFixed(6),+(th/D).toFixed(3),+(l/lPk).toFixed(5),+(dg.btn*1e3).toFixed(3),+(dg.jew*1e3).toFixed(3),+(dg.tooth/cT*1e3).toFixed(3),held?1:0]);}
  }
  const c=st.cross.filter(x=>x>=from),n=c.length,Tm=n>1?(c[n-1]-c[0])/(n-1):NaN,am=st.amps.slice(-8);
  const mean=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:NaN,tail=a=>a.slice(Math.floor(a.length/2));
  return{A:am.length?am.reduce((a,b)=>a+b,0)/am.length/D:0,rate:day(T0/Tm-1),beats:st.beats,trips:st.trips,knock:st.knock,pass:st.pass,twice:st.twice,rel:mean(tail(st.rel)),off:mean(tail(st.off)),offF:mean(tail(st.offs)),home:mean(tail(st.home)),
    rideOn:mean(tail(st.rideOn)),ring:st.ring/lPk,maxL:st.maxL/lPk,maxTh:st.maxTh,maxRet:st.maxOm<0,arrive:Math.max(0,...tail(st.arrive)),steps:st.steps,frozen:st.frozen,amps:st.amps,ampT:st.ampT};
}

module.exports={frame,detent,modal,model,run,pen,main};
function main(){
/* ---------- the report ---------- */
const quick=process.argv.includes('--quick'),ji=process.argv.indexOf('--json'),JOUT=ji>0?process.argv[ji+1]:null,RW=[],J={made:new Date().toISOString().slice(0,10),model:'wempe'};let fail=0;
const say=s=>RW.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;RW.push(`${ok?'  ok ':'  !! '} ${s}`);},note=(ok,s)=>RW.push(`${ok?'  ok ':'  ~~ '} ${s}`);
const f=(x,n=2)=>(+x).toFixed(n),sg=(x,n=2)=>(x>=0?'+':'−')+Math.abs(x).toFixed(n),pc=x=>f(100*x,x<0.1?2:1)+' %',t0=Date.now(),flush=()=>{console.log(RW.splice(0).join('\n'));console.log(`  (${f((Date.now()-t0)/1000,0)} s)`);};
const LR=lPk*ESC.ES*BLu/LEN,LF=lFr*ESC.ES*BLu/LEN,LRel=lRel*ESC.ES*BLu/LEN;
const pick=r=>({A:+f(r.A,2),rate:+f(r.rate,3),rel:+f(r.rel,2),offF:+f(r.offF,2),home:+f(r.home,2),beats:r.beats,trips:r.trips,maxL:+f(r.maxL,5),maxTh:+f(r.maxTh??NaN,1),maxRet:!!r.maxRet,arrive:+f(r.arrive,5)});

say('0. The Wempe\'s detent as a frame (the pieces escapement.js draws, 1436 and 05 04 01-2)');
const V={drawn:{},stiff:{stiff:true},hinge:{hinge:true,stiff:true}},DT={},MD={};
for(const[k,o]of Object.entries(V)){DT[k]=detent(o);MD[k]=modal(DT[k],30000);}
{const d=DT.drawn,F=d.F;say(`${F.E.length} beam elements on ${F.N.length} nodes (${d.nr} free coordinates): the spring 0.070 × 1.9 mm, 5.0 long, clamped at its foot; the blade 0.50 × 1.0 for 2.9, then 0.28 × 1.0 to the pipe; the horn 0.22 × 0.8 to ${f(HORN_L,1)} past the stone; the gold spring 0.15 × 1.0 along its path, ${f(GPATH.reduce((s,p,k)=>k?s+Math.hypot(p[0]-GPATH[k-1][0],p[1]-GPATH[k-1][1]):0,0),1)} mm from its bending point to its tip; the square with the gold spring's head and the pipe with the stone rigid`);
  chk(Math.abs(d.mass/DY.DM.m-1)<0.03&&Math.abs(d.Ift/DY.ID-1)<0.03,`its moving parts' mass ${f(d.mass*1e6,2)} mg and inertia about the flexure ${f(d.Ift*1e9,3)} g·mm² are the page's solids' as weighed (wempe_inertia.json: ${f(DY.DM.m*1e6,2)}, ${f(DY.ID*1e9,3)}) within 3 %`);
  const h=DT.hinge;chk(Math.abs(h.kS*(BLu*ES)**2/DY.KD-1)<1e-3&&Math.abs(-h.alpha/DY.MPRE-1)<1e-3&&Math.abs(MD.hinge[0].w/Math.sqrt(DY.KD/h.Ift)-1)<1e-2,`hinged at Ft and rigid, it is dynamics.js's detent: ${f(h.kS,2)} N/m at the stone (KD/r² ${f(DY.KD/(BLu*ES)**2,2)}), the preload ${f(-h.alpha*1e6,1)} µN·m (${f(DY.MPRE*1e6,1)}), its first mode ${f(MD.hinge[0].f,1)} Hz (√(KD/I): ${f(Math.sqrt(DY.KD/h.Ift)/TAU,1)}; the gold spring, a third of its mass, left flexible on it)`);
  say(`as drawn its spring bends along its whole 5 mm from the foot, the detent turning near its middle: ${f(d.kS,2)} N/m at the stone (${sg(100*(d.kS/h.kS-1),0)} % against the hinge makeEsc and dynamics.js take at its middle, the blade's own bending in series)`);
  say(`its modes up to 30 kHz, clamped at the foot (where the strain energy is):`);
  for(const m of MD.drawn)say(`  ${f(m.f,0).padStart(6)} Hz  ${Object.entries(m.share).sort((a,b)=>b[1]-a[1]).filter(([,v])=>v>0.05).map(([k,v])=>`${k} ${f(100*v,0)} %`).join(', ')}`);
  J.frame={nodes:F.N.length,elements:F.E.length,mass:d.mass,Ift:d.Ift,dm:DY.DM.m,did:DY.ID,kS:d.kS,kSh:h.kS,mpre:DY.MPRE,f1h:MD.hinge[0].f,modes:MD.drawn.map(m=>({f:+f(m.f,1),share:Object.fromEntries(Object.entries(m.share).map(([k,v])=>[k,+f(v,3)]))}))};}
flush();

say('1. Validated: the frame made rigid and hinged at Ft, the draw as dynamics.js takes it, against dynamics.js --model wempe');
const dyn=DY.sim({mode:'phys',T:12,from:6}),Mq=model({hinge:true,stiff:true,qsDraw:true,eL:0}),rq=run(Mq,{T:12,from:6}),rq2=run(Mq,{T:12,from:6,hf:Mq.hf/2,hc:5e-5});   /* 12 s: the Hamilton's 20 cost the Wempe's finer steps (its gold spring's modes) twice the time */
say(`dynamics.js: the swing ${f(dyn.A,2)}°, rate ${sg(dyn.rate,3)} s a day, release ${f(dyn.rel,2)}°, off the stone ${f(dyn.offF,2)}°, on the escaping tooth ${f(dyn.rOn,2)}°, home ${f(dyn.home,2)}°, ${dyn.beats} beats`);
say(`the frame:   the swing ${f(rq.A,2)}°, rate ${sg(rq.rate,3)} s a day, release ${f(rq.rel,2)}°, off the stone ${f(rq.offF,2)}°, on the escaping tooth ${f(rq.rideOn,2)}°, home ${f(rq.home,2)}°, ${rq.beats} beats (at half the step: ${f(rq2.A,2)}°, ${sg(rq2.rate,3)})`);
chk(Math.abs(rq.A-dyn.A)<1&&Math.abs(rq.rate-dyn.rate)<0.3&&Math.abs(rq.rel-dyn.rel)<0.2&&Math.abs(rq.offF-dyn.offF)<0.3&&Math.abs(rq.home-dyn.home)<0.5&&rq.beats===dyn.beats&&rq.trips===0,
  `the frame's escapement is dynamics.js's: the swing within 1°, the rate 0.3 s a day, the release 0.2°, the detent's departure 0.3° and its home 0.5° (after the ride, its hops), every beat`);
chk(Math.abs(rq2.A-rq.A)<0.05&&Math.abs(rq2.rate-rq.rate)<0.02,`and converged in its step (${sg(rq2.A-rq.A,3)}°, ${sg(rq2.rate-rq.rate,3)} s a day at half)`);
J.valid={dyn:{A:dyn.A,rate:dyn.rate,rel:dyn.rel,offF:dyn.offF,home:dyn.home,beats:dyn.beats},frame:pick(rq),half:pick(rq2),lPk:lPk/lRel,lFr:lFr/lRel};
flush();
if(quick){if(fail)process.exitCode=1;if(JOUT)fs.writeFileSync(JOUT,JSON.stringify(J));return;}

/* sections 2-4 run as jobs in child processes, many at once (the Wempe's detent rings at 82 Hz with Q 100 and is never quiet between beats, so the frame steps 1 µs all the way:
   about 5 s of computing a second run) */
const SW=[['the modes\' damping Q 30',{Q:30}],['Q 1000',{Q:1000}],['the banking dead (restitution 0)',{eB:0}],['the banking lively (0.6)',{eB:0.6}],
  ['the tooth on the stone lively (0.6)',{eL:0.6}],['every contact 4× stiffer',{kB:4e6,kT:4e6,kJ:8e5,kH:8e4,kR:2e3}],['every contact 4× softer',{kB:2.5e5,kT:2.5e5,kJ:5e4,kH:5e3,kR:125}],['the stone on the gold spring, returning, 4× stiffer (kR 2,000)',{kR:2000}],['and 4× softer (kR 125)',{kR:125}],
  ['the gold spring half as stiff (its alloy)',{tsK:0.5}],['the spring 0.09 thick (1436\'s first figure)',{tS:0.09/0.07}],['no preload (the banking where drawn)',{pre:0}],['the stone on the tooth: μ 0.10',{MU:0.10}],['μ 0.20',{MU:0.20}],['the preload 1.5×',{pre:1.5}],['the preload 2×',{pre:2}],['the preload 3×',{pre:3}]];
const R2K=[['hinged at Ft, rigid (dynamics.js\'s)',{hinge:true,stiff:true}],['the spring as drawn, the rest rigid',{stiff:true}],['as drawn',{}],['as drawn, no preload',{pre:0}]];
const PUSH=[240,270,300,320,335,340,345,350,355,360],KN=[['preloaded (0.63 g, estimated)',1],['as drawn (no preload)',0]],KK=[['a blow across the plate, 0.5 ms','b05',2,400,'g'],['a blow across the plate, 3 ms','b3',1,400,'g'],['a twist about the staff, 2 ms','tw',1,80,'rad/s']];
const jobs=[...R2K.map(([,o])=>({k:'run',mo:o,ro:{T:6,from:3}})),...SW.map(([,o])=>({k:'run',mo:o,ro:{T:3,from:1.5}})),...PUSH.map(A=>({k:'push',A})),
  ...KN.flatMap(([,pre])=>KK.slice(0,pre?3:2).flatMap(([,kind,lo,hi])=>[false,true].map(rigid=>({k:'knock',pre,kind,lo,hi,rigid}))))];
const pool=async()=>{const{spawn}=require('child_process'),out=new Array(jobs.length),N=Math.max(1,Math.min(jobs.length,+process.env.MC_PROCS||require('os').cpus().length-4));let next=0;
  const kid=spec=>new Promise((res,rej)=>{const p=spawn(process.execPath,[__filename,'--child'],{env:{...process.env,MC_WJOB:JSON.stringify(spec)}});let s='';
    p.stdout.on('data',d=>s+=d);p.stderr.on('data',d=>process.stderr.write(d));p.on('close',code=>code?rej(Error('wempe_tripping.js --child '+JSON.stringify(spec)+' exited '+code)):res(JSON.parse(s.trim().split('\n').pop())));});
  await Promise.all([...Array(N)].map(async()=>{while(next<jobs.length){const i=next++;out[i]=await kid(jobs[i]);}}));return out;};
pool().then(out=>{let o=0;const take=n=>{const r=out.slice(o,o+n);o+=n;return r;};
  say('2. Running: the detent as drawn, the wheel free to recoil, every contact elastic');
  say(`at the stone the depth of lock is ${f(LR*1000,0)} µm (makeEsc's recoil peaks: the flat's inner end); the tip is free at ${f(LF*1000,0)} µm (makeEsc keeps ${f(LRel*1000,0)}). The margin is the lift a held tooth's stone reaches against the depth of lock`);
  const R2=take(R2K.length);R2K.forEach(([nm],i)=>{const r=R2[i];say(`${nm.padEnd(38)} the swing ${f(r.A,1)}°, rate ${sg(r.rate,2)}, release ${f(r.rel,2)}°, home ${f(r.home,2)}°; ${r.beats} beats, ${r.trips} trips; a held tooth's stone lifted at most ${pc(r.maxL)} of the depth of lock (at ${f(r.maxTh,0)}°, ${r.maxRet?'the return swing':'after the lock'}), ${pc(r.arrive)} as the next tooth arrives`);});
  const dr=R2[2];
  chk(dr.trips===0&&dr.beats>=10,`as drawn no tooth gets past the stone: ${dr.beats} beats`);
  /* the margin (tripping.js's: a held tooth's stone under half the depth of lock) is reported, not failed: it rests on two estimates, the preload and the gold spring's alloy, and the
     sources' figures for neither; what fails is a tooth let go at the model's settings */
  note(dr.maxL<0.5,`a held tooth's stone uses at most ${pc(dr.maxL)} of the depth of lock, ${f(LR*1000,0)} µm (${f(dr.maxL*LR*1000,1)} µm), at ${f(dr.maxTh,0)}°${dr.maxRet?` on the return swing: the gold spring, bent ${f(Math.max(...ESC.PS)*ESC.ES,2)} mm at its tip as the discharge stone passes it (${f(0.5*DY.KTIP*(Math.max(...ESC.PS)*ESC.ES/1000)**2*1e6,1)} µJ), comes clear at ${f(ESC.thPass/D,1)}° and slams back onto the horn, and the detent takes its blow (dynamics.js and makeEsc take the gold spring massless, its energy lost)`:''}; tripping.js's margin for the Hamilton is half`);
  J.running=Object.fromEntries(R2K.map(([nm],i)=>[nm,R2[i]]));J.LR=LR;J.LF=LF;J.LRel=LRel;
  const sw=take(SW.length).map((r,i)=>({name:SW[i][0],...r}));for(const r of sw)say(`  ${r.name.padEnd(46)} ${r.trips} trips, the stone at most ${pc(r.maxL).padStart(8)} (${r.maxRet?'return':'lock'}), the swing ${f(r.A,1)}°`);
  /* hard: the estimates at the contacts' own stiffness (tripping.js's) and the preload as estimated or more; reported: the contacts' stiffness, on which the return pass turns */
  const swH=sw.filter(r=>!/no preload|4× st|4× so|kR/.test(r.name)),swK=sw.filter(r=>/4× st|4× so|kR/.test(r.name));
  chk(swH.every(r=>r.trips===0),`preloaded, over the other estimates no tooth gets past; a held tooth's stone uses at most ${pc(Math.max(...swH.map(r=>r.maxL)))} of the depth of lock`);
  note(swK.every(r=>r.trips===0),`the contacts' stiffness (penalties, tripping.js's): ${swK.map(r=>`${r.name}, ${r.trips} teeth past, the stone at most ${pc(r.maxL)}`).join('; ')}. The one that matters is the discharge stone on the gold spring on the return (kR, 500 N/m): stiffer, the stone, meeting the spring's square end with its bevel, pushes it partly lengthwise, the loop round the pipe gives, and the tip is carried on past makeEsc's pass (−17.6°) to about −25° before it slips off, storing several times the energy, whose release throws the detent. The tip is taken square and unturning, the gold spring's alloy and its path's free shape are estimates, the horn's length 4.4 (1436's figure, Wempe 3955's photograph: likely): open (README, Unresolved)`);
  {const pr=[[1,dr.maxL],...[1.5,2,3].map(m=>[m,sw.find(r=>r.name==='the preload '+m+'×').maxL])],i=pr.findIndex(([,x])=>x<0.5);
    say(`unpreloaded (the banking where the detent is drawn) ${sw.find(r=>/no preload/.test(r.name)).trips} teeth get past in 3 s: the gold spring's blow throws the stone off. Under half the depth of lock wants the preload ${i<0?'past 3×':i===0?'as estimated':`about ${f(pr[i-1][0]+(pr[i][0]-pr[i-1][0])*(pr[i-1][1]-0.5)/(pr[i-1][1]-pr[i][1]),1)}× the estimate (${f((pr[i-1][0]+(pr[i][0]-pr[i-1][0])*(pr[i-1][1]-0.5)/(pr[i-1][1]-pr[i][1]))*S.W78,2)} g at the stone)`}: ${pr.map(([m,x])=>`${m}× ${pc(x)}`).join(', ')}`);}
  J.sweep=sw;flush();
  say('3. Pushed: the swing raised by the drive until a tooth gets past');
  {const P_=take(PUSH.length);let lastOk=null,firstBad=null;
    for(const q of P_){say(`  drive ${f(q.s,2)}× (the model's swing ${f(q.Am,0)}°): the frame ${f(q.frame.A,0)}°, ${q.frame.trips} trips${q.frame.twice?` (${q.frame.twice} unlocked twice in a swing)`:''}, the stone at most ${pc(q.frame.maxL)}; dynamics.js ${f(q.dyn.A,0)}°, ${q.dyn.trips} trips`);
      if(q.frame.trips===0&&q.frame.beats>0){if(firstBad==null)lastOk=q.frame.A;}else if(firstBad==null)firstBad=q.frame.A;}
    say(`the largest swing that never trips: about ${f(lastOk,0)}°, the first that does ${firstBad==null?'(none)':f(firstBad,0)+'°'}: makeEsc's TRIP (${f(ESC.TRIP/D,0)}°) is where the discharge stone comes round to the gold spring again`);
    chk(lastOk!=null&&lastOk>300,`the frame trips only past 300° of swing, far above the 225-270° the sources give`);
    J.push={rows:P_,lastOk,firstBad,TRIP:ESC.TRIP/D};}
  flush();
  say('4. Knocks: the smallest that lets a tooth go or loses a beat, the frame as drawn against the rigid detent (dynamics.js)');
  {const K4=[];for(const[pn,pre]of KN)for(const[nm,kind,,,unit]of KK.slice(0,pre?3:2)){const[gF,gD]=take(2);K4.push({preload:pn,name:nm,unit,frame:+f(gF,1),rigid:+f(gD,1)});
      say(`  ${pn.padEnd(30)} ${nm.padEnd(34)} the frame as drawn: about ${f(gF,unit==='g'?0:1)} ${unit}; the rigid detent: ${f(gD,unit==='g'?0:1)} ${unit} (${sg(100*(gF/gD-1),0)} %)`);}
    const gS=DY.MPRE/(DY.DM.m*DY.rCM*G0);
    say(`a steady push lifts the rigid detent off its banking at ${f(gS,0)} g (its preload's; none as drawn); the knocks a chronometer meets in its box at sea are a few g (the gimbals and the box take the rest)`);
    chk(K4.every(k=>k.unit!=='g'||k.preload!==KN[0][0]||k.frame>20),`preloaded, it takes a blow over 20 g across the plate to let a tooth go`);
    J.knocks={rows:K4,gS};}
  flush();
  J.time=(Date.now()-t0)/1000;if(JOUT)fs.writeFileSync(JOUT,JSON.stringify(J));if(fail)process.exitCode=1;}).catch(e=>{console.error(e);process.exitCode=1;});
}
/* a job, in a child process (MC_WJOB): a run of the frame (pick), a pushed swing (the frame and dynamics.js), or a knock's least size (the frame or the rigid detent) */
function child(){const spec=JSON.parse(process.env.MC_WJOB),f=(x,n=2)=>+(+x).toFixed(n),pick=r=>({A:f(r.A,2),rate:f(r.rate,3),rel:f(r.rel,2),offF:f(r.offF,2),home:f(r.home,2),beats:r.beats,trips:r.trips,twice:r.twice??0,maxL:f(r.maxL,5),maxTh:f(r.maxTh??NaN,1),maxRet:!!r.maxRet,arrive:f(r.arrive,5)});
  let out;
  if(spec.k==='run')out=pick(run(model(spec.mo),spec.ro));
  else if(spec.k==='push'){const A=spec.A,sFor=x=>{let lo=0.5,hi=6;for(let i=0;i<40;i++){const m=(lo+hi)/2;ESC.ampAt(m)<x*D?lo=m:hi=m;}return(lo+hi)/2;},s=sFor(A),r=run(model({}),{s,A,T:2.5,from:1}),q=DY.sim({mode:'phys',s,A,T:2.5,from:1});
    out={A,s:f(s,3),Am:f(ESC.ampAt(s)/D,1),frame:pick(r),dyn:{A:f(q.A,1),trips:q.trips,beats:q.beats}};}
  else{const{pre,kind,lo:lo0,hi:hi0,rigid}=spec,A0=214,M4=rigid?null:model({pre}),B={},pulse=(t1,dur,fn)=>tt=>{const u=(tt-t1)/dur;return u>0&&u<1?fn(Math.sin(Math.PI*u)):{al:0,ax:0,ay:0};};
    const ang=Math.atan2(DY.DM.my,DY.DM.mx)+Math.PI/2,ux=Math.cos(ang),uy=Math.sin(ang),go=o=>rigid?DY.sim({mode:'phys',pre,...o}):run(M4,o);
    const base=p=>B[p]??=go({A:A0,T:0.3+p*T0+0.55,from:0.2});
    const mk=(g,p)=>{const t1=0.3+p*T0,o={A:A0,T:t1+0.55,from:0.2};if(kind==='tw'){const dur=0.002;return go({...o,ext:pulse(t1,dur,x=>({al:g*Math.PI/(2*dur)*x,ax:0,ay:0})),extFine:tt=>tt>t1-0.005&&tt<t1+dur+0.03});}
      const dur=kind==='b05'?0.0005:0.003,a=g*G0;return go({...o,ext:pulse(t1,dur,x=>({al:0,ax:a*x*ux,ay:a*x*uy})),extFine:tt=>tt>t1-0.005&&tt<t1+dur+0.03});};
    const bad=g=>{for(const p of[0.1,0.35,0.6,0.85])for(const sgn of[1,-1]){const r=mk(g*sgn,p);if(r.trips>0||r.beats!==base(p).beats)return true;}return false;};
    let lo=lo0,hi=hi0;for(let i=0;i<6;i++){const m=Math.sqrt(lo*hi);bad(m)?hi=m:lo=m;}out=hi;}
  process.stdout.write(JSON.stringify(out)+'\n');}
if(require.main===module){if(process.argv.includes('--child'))child();else main();}
