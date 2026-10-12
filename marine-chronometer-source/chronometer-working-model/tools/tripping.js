// The escapement with a flexible detent: does a tooth ever get past the stone (tripping, the wheel escaping twice in a swing, the chronometer gaining)? dynamics.js
// takes the detent as one rigid body turning about the root of its spring; this takes it as what it is, a frame of thin parts, and lets every part bend and ring.
// Needs only Node.js:
//   node tripping.js            (about 4 minutes; exits with 1 if, at the model's settings, a tooth gets past the stone, or the frame taken rigid on a hinge
//                                disagrees with dynamics.js beyond the stated bounds)
//   node tripping.js --quick    (the frame, its modes and the validation only, about 30 s)
//   node tripping.js --json OUT (also writes the figures for the report, verification/build-verification)
// The detent as a plane frame (beam elements with stretching, bending and their consistent mass; Przemieniecki 1968, ch. 5 and 11) from the pieces movement.js draws
// (ESC.pieces): the two-strip spring, the blade, the arm to the horn and the trip spring as elements, the cross-piece with the bracket and the jewel block with the stone as
// rigid bodies; the trip spring rests on the horn. Its modes (the frame clamped at the foot) carry it in time, with the balance and the escape wheel, as in dynamics.js, but
// every contact elastic, a spring with a dashpot set for its restitution (penalty contacts, Wriggers 2006, ch. 2): the discharge jewel on the trip spring's tip (the jewel's
// own outline, dynamics.js's distance field), the trip spring on the horn, the blade on its stop button, the tooth on the locking stone (the stone's outline, makeEsc's
// recoil: the flat's draw pushing the tooth back as the stone lifts, its edge after) and on the impulse jewel (makeEsc's bite). The preload is Op. 78's: the spring
// bent so a 0.770 g weight on the locking jewel just parts the blade from its button.
// What it answers:
//   0. The frame: its mass and inertia against dynamics.js's, its stiffness at the stone against the hinge dynamics.js takes, its modes.
//   1. Validated: the frame made rigid and hinged at its root as dynamics.js has it runs as dynamics.js does (swing, rate, release, the detent's fall).
//   2. Running: the frame as drawn; how far the stone rings after it lands and the next tooth arrives, against the lift that frees the tooth.
//   3. The swing pushed (the drive raised) until a tooth gets past; the knocks (a blow across the plate, a twist about the staff) that trip it, against the rigid detent's.
// Every number from outside the model (moduli, densities, restitution, damping) is a published range or marked estimated, as in physics.js.
const fs=require('fs'),path=require('path');
const DY=require('./dynamics.js'),{ESC,H,RHO,polyM}=DY,ES=DY.ES;   /* ES: metres in the unit frame's length (the escape wheel's radius) */
const D=Math.PI/180,TAU=2*Math.PI,G0=9.80665,S=ESC.settings;
const Ft=ESC.Ft,dB=ESC.dirB,nB=ESC.nB;
/* the detent's own frame: t along it from the root of its spring (Ft), n across, + the way the stone lifts off the wheel; metres */
const tn=p=>({t:((p.x-Ft.x)*dB.x+(p.y-Ft.y)*dB.y)*ES,n:((p.x-Ft.x)*nB.x+(p.y-Ft.y)*nB.y)*ES});
const xy=(t,n)=>({x:Ft.x+(t*dB.x+n*nB.x)/ES,y:Ft.y+(t*dB.y+n*nB.y)/ES});
const ext_=(pts)=>{const q=pts.map(tn);return{t0:Math.min(...q.map(p=>p.t)),t1:Math.max(...q.map(p=>p.t)),n0:Math.min(...q.map(p=>p.n)),n1:Math.max(...q.map(p=>p.n))};};
const PC=ESC.pieces,X={};for(const k of['spring','cross','blade','block','arm','horn','bracket','stone'])X[k]=ext_(PC[k]);X.button=ext_(ESC.fixed.button);
const rectU=(t0,t1,n0,n1)=>[xy(t0,n0),xy(t1,n0),xy(t1,n1),xy(t0,n1)];
const hOf=k=>H[k].reduce((s,[h])=>s+h,0);
/* materials: hardened beryllium copper (C17200) E 125-131 GPa, 128 taken (dynamics.js); the trip spring Elinvar-type, ET (180 GPa, as hairspring.js) */
const EBC=S.EB*1e9,ETS=S.ET*1e9;

/* ---------- the frame ---------- */
/* o: hinge (the spring as a pin at its root with dynamics.js's stiffness KD, as dynamics.js takes it), stiff (blade, block and arm one rigid body with the cross-piece),
   eiB (the blade's bending stiffness, times), tsK (the trip spring's, times) */
function frame(o={}){
  const N=[],E=[],B=[];   /* nodes {t,n,k:'free'|'clamp'|'pin'|'slave',m}, elements, rigid bodies {a: node, m, St, Sn, Io} */
  const nd=(t,n,k='free',m=-1)=>{N.push({t,n,k,m});return N.length-1;};
  const el=(i,j,Em,b,h,rho,grp)=>E.push({i,j,E:Em,A:b*h,I:h*b**3/12,rA:rho*b*h,grp});
  const line=(i,j,ne,Em,b,h,rho,grp,extra=[])=>{const a=N[i],c=N[j],ts=[...new Set([0,1,...extra])].sort((x,y)=>x-y);let all=[];for(let k=0;k<ts.length-1;k++){const f0=ts[k],f1=ts[k+1],m=Math.max(1,Math.round(ne*(f1-f0)));for(let s=0;s<m;s++)all.push(f0+(f1-f0)*s/m);}all.push(1);
    let p=i;const out=[i];for(let k=1;k<all.length;k++){const q=k===all.length-1?j:nd(a.t+(c.t-a.t)*all[k],a.n+(c.n-a.n)*all[k]);el(p,q,Em,b,h,rho,grp);out.push(q);p=q;}return out;};
  /* the spring: X.spring, two strips (H.spring) of the drawn thickness, the root at t 0 held by the foot */
  const nS=(X.spring.n0+X.spring.n1)/2,tD=X.spring.n1-X.spring.n0,hS=hOf('spring'),lS=X.spring.t1;
  const R0=nd(0,o.hinge?0:nS,o.hinge?'pin':'clamp'),F1=nd(lS,nS);   /* hinged, the pin is at Ft itself, as dynamics.js turns the detent */
  const sp=line(R0,F1,6,EBC,tD,hS,RHO.Cu,'spring');
  if(o.hinge)for(const i of sp.slice(1))N[i].k='slave',N[i].m=R0;
  /* the blade, from the cross-piece to the jewel block: X.blade's section; its ends inside the cross-piece and the block go with them */
  const nBl=(X.blade.n0+X.blade.n1)/2,wB=X.blade.n1-X.blade.n0,hB=hOf('blade');
  const b0=nd(X.cross.t1,nBl,'slave',F1),Kt=ESC.BL*ESC.ES/1000,K=nd(Kt,0),b1=nd(X.block.t0,nBl,'slave',K);   /* K: the block's own node, at the locking face's middle S */
  const bt=X.button,bl=line(b0,b1,10,EBC*(o.eiB??1),wB,hB,RHO.Cu,'blade',[(bt.t0-X.cross.t1)/(X.block.t0-X.cross.t1),(bt.t1-X.cross.t1)/(X.block.t0-X.cross.t1)]);
  const nb=[bl.find(i=>Math.abs(N[i].t-bt.t0)<1e-9),bl.find(i=>Math.abs(N[i].t-bt.t1)<1e-9)];   /* the blade's nodes over the button's ends */
  /* the arm: thick(centre line, 0.025) in escapement.js, 0.33 mm wide, from inside the block out to the horn; the horn a rigid end piece */
  const rho=ESC.rho,cl=[ESC.D(ESC.BL+0.06,0),ESC.D(ESC.BL+0.2,0),ESC.D(ESC.tH-0.025,ESC.nR+rho-0.03),ESC.D(ESC.tH-0.025,ESC.nR+rho)].map(tn),wA=2*0.025*ESC.ES/1000,hA=hOf('arm');
  let pa=nd(cl[0].t,cl[0].n,'slave',K);const arm=[pa];for(let k=1;k<cl.length;k++){const q=nd(cl[k].t,cl[k].n);arm.push(...line(pa,q,k===2?4:2,EBC,wA,hA,RHO.Cu,'arm').slice(1));pa=q;}
  const Hn=pa;   /* the horn's lower face, middle */
  /* the trip spring: Ps0 to Pt on the line n = nR, tsT x tsH, its root screwed to the bracket (rigid with the cross-piece) */
  const ts0=tn(ESC.Ps0),ts1=tn(ESC.Pt),hTs=S.tsH/1000,tT=S.tsT/1000,hornT=[ESC.tH-0.05,ESC.tH-0.025,ESC.tH].map(t=>t*ESC.ES/1000);
  const r0=nd(ts0.t,ts0.n,'slave',F1),r1=nd(ts1.t,ts1.n);
  const tsN=line(r0,r1,10,ETS*(o.tsK??1),tT,hTs,RHO.El,'trip',hornT.map(t=>(t-ts0.t)/(ts1.t-ts0.t)));
  const nh=hornT.map(t=>tsN.find(i=>Math.abs(N[i].t-t)<1e-9));
  if(o.stiff){for(const i of[...bl.slice(1,-1),K,...arm.slice(1)])N[i].k='slave',N[i].m=F1;}
  /* the rigid bodies: their pieces' mass about their node (polyM: area, first moments, inertia about Ft in the unit frame's axes) */
  const body=(a,parts)=>{let m=0,mx=0,my=0,I=0;for(const q of parts){m+=q.m;mx+=q.mx;my+=q.my;I+=q.I;}const St=mx*dB.x+my*dB.y,Sn=mx*nB.x+my*nB.y,A=N[a];
    B.push({a,m,St:St-m*A.t,Sn:Sn-m*A.n,Io:I-2*(A.t*St+A.n*Sn)+m*(A.t**2+A.n**2)});};
  const pm=(k,f=1)=>H[k].map(([h,mat])=>{const q=polyM(PC[k],h,RHO[mat]);return{m:f*q.m,mx:f*q.mx,my:f*q.my,I:f*q.I};});
  const hole=(()=>{const n=24,d=[...Array(n)].map((_,i)=>({x:ESC.Jc.x+ESC.rJ*Math.cos(TAU*i/n),y:ESC.Jc.y+ESC.rJ*Math.sin(TAU*i/n)}));const q=polyM(d,H.block[0][0],RHO.Cu);return{m:-q.m,mx:-q.mx,my:-q.my,I:-q.I};})();
  const bladeEnds=[rectU(X.blade.t0,X.cross.t1,X.blade.n0,X.blade.n1),rectU(X.block.t0,X.blade.t1,X.blade.n0,X.blade.n1)].map(r=>polyM(r,hB,RHO.Cu));
  body(F1,[...pm('cross'),...pm('bracket'),bladeEnds[0]]);
  body(K,[...pm('block'),hole,...pm('stone'),bladeEnds[1]]);
  body(Hn,pm('horn'));
  return{N,E,B,R0,F1,K,Hn,nb,nh,tip:r1,sp,bl,arm,tsN,o,lS,nS};
}

/* ---------- matrices, the reduction to the free coordinates, modes ---------- */
const zeros=(r,c)=>[...Array(r)].map(()=>new Float64Array(c));
function assemble(F){
  const nN=F.N.length,nf=3*nN,Kf=zeros(nf,nf),Mf=zeros(nf,nf);
  for(const e of F.E){const a=F.N[e.i],b=F.N[e.j],dt=b.t-a.t,dn=b.n-a.n,L=Math.hypot(dt,dn),c=dt/L,s=dn/L;
    const EA=e.E*e.A/L,EI=e.E*e.I,k=[[EA,0,0,-EA,0,0],[0,12*EI/L**3,6*EI/L**2,0,-12*EI/L**3,6*EI/L**2],[0,6*EI/L**2,4*EI/L,0,-6*EI/L**2,2*EI/L],[-EA,0,0,EA,0,0],[0,-12*EI/L**3,-6*EI/L**2,0,12*EI/L**3,-6*EI/L**2],[0,6*EI/L**2,2*EI/L,0,-6*EI/L**2,4*EI/L]];
    const q=e.rA*L,m=[[q/3,0,0,q/6,0,0],[0,156*q/420,22*L*q/420,0,54*q/420,-13*L*q/420],[0,22*L*q/420,4*L*L*q/420,0,13*L*q/420,-3*L*L*q/420],[q/6,0,0,q/3,0,0],[0,54*q/420,13*L*q/420,0,156*q/420,-22*L*q/420],[0,-13*L*q/420,-3*L*L*q/420,0,-22*L*q/420,4*L*L*q/420]];
    const R=[[c,s,0],[-s,c,0],[0,0,1]],T6=(i,j)=>Math.floor(i/3)===Math.floor(j/3)?R[i%3][j%3]:0,ix=[3*e.i,3*e.i+1,3*e.i+2,3*e.j,3*e.j+1,3*e.j+2];
    e.ke=zeros(6,6);for(let i=0;i<6;i++)for(let j=0;j<6;j++){let sk=0,sm=0;for(let p=0;p<6;p++){const tp=T6(p,i);if(!tp)continue;for(let r=0;r<6;r++){const tr=T6(r,j);if(tr){sk+=tp*k[p][r]*tr;sm+=tp*m[p][r]*tr;}}}e.ke[i][j]=sk;Kf[ix[i]][ix[j]]+=sk;Mf[ix[i]][ix[j]]+=sm;}
    e.ix=ix;}
  for(const b of F.B){const i=3*b.a;Mf[i][i]+=b.m;Mf[i+1][i+1]+=b.m;Mf[i][i+2]-=b.Sn;Mf[i+2][i]-=b.Sn;Mf[i+1][i+2]+=b.St;Mf[i+2][i+1]+=b.St;Mf[i+2][i+2]+=b.Io;}
  if(F.o.hinge){const i=3*F.R0+2;Kf[i][i]+=DY.KD;}
  /* T: the full coordinates (u, v, theta at every node) from the free ones; a slave follows its master as a rigid body */
  const ms=i=>{let k=i;while(F.N[k].k==='slave')k=F.N[k].m;return k;},col=[];let nr=0;
  for(let i=0;i<nN;i++){const k=F.N[i].k;col.push(k==='free'?[nr++,nr++,nr++]:k==='pin'?[-1,-1,nr++]:null);}
  const T=zeros(nf,nr);
  for(let i=0;i<nN;i++){const k=F.N[i].k;if(k==='clamp')continue;const m=ms(i),cm=col[m],a=F.N[m],p=F.N[i];
    if(cm[0]>=0){T[3*i][cm[0]]=1;T[3*i+1][cm[1]]=1;}T[3*i][cm[2]]-=p.n-a.n;T[3*i+1][cm[2]]+=p.t-a.t;T[3*i+2][cm[2]]=1;}
  const TtAT=A=>{const AT=zeros(nf,nr);for(let i=0;i<nf;i++)for(let j=0;j<nr;j++){let s=0;for(let k=0;k<nf;k++){const t=T[k][j];if(t)s+=A[i][k]*t;}AT[i][j]=s;}
    const R=zeros(nr,nr);for(let i=0;i<nr;i++)for(let j=0;j<nr;j++){let s=0;for(let k=0;k<nf;k++){const t=T[k][i];if(t)s+=t*AT[k][j];}R[i][j]=s;}return R;};
  return{Kf,Mf,T,nf,nr,Kr:TtAT(Kf),Mr:TtAT(Mf),ms};
}
/* the symmetric eigenproblem K x = w² M x: M = L Lᵀ, then Jacobi on L⁻¹ K L⁻ᵀ; modes mass-normalised (columns of Phi), ascending */
function chol(A){const n=A.length,L=zeros(n,n);for(let i=0;i<n;i++)for(let j=0;j<=i;j++){let s=A[i][j];for(let k=0;k<j;k++)s-=L[i][k]*L[j][k];if(i===j){if(!(s>0))throw Error('chol: not positive definite at '+i);L[i][i]=Math.sqrt(s);}else L[i][j]=s/L[j][j];}return L;}
function solveL(L,b){const n=L.length,y=new Float64Array(n);for(let i=0;i<n;i++){let s=b[i];for(let k=0;k<i;k++)s-=L[i][k]*y[k];y[i]=s/L[i][i];}return y;}
function solveLt(L,y){const n=L.length,x=new Float64Array(n);for(let i=n-1;i>=0;i--){let s=y[i];for(let k=i+1;k<n;k++)s-=L[k][i]*x[k];x[i]=s/L[i][i];}return x;}
function jacobi(A){const n=A.length,a=A.map(r=>Float64Array.from(r)),V=zeros(n,n);for(let i=0;i<n;i++)V[i][i]=1;
  for(let sw=0;sw<100;sw++){let off=0;for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)off+=a[i][j]**2;if(off<1e-22*n*n)break;
    for(let p=0;p<n;p++)for(let q=p+1;q<n;q++){if(Math.abs(a[p][q])<1e-300)continue;const th=(a[q][q]-a[p][p])/(2*a[p][q]),t=Math.sign(th||1)/(Math.abs(th)+Math.sqrt(th*th+1)),c=1/Math.sqrt(t*t+1),s=t*c;
      for(let k=0;k<n;k++){const akp=a[k][p],akq=a[k][q];a[k][p]=c*akp-s*akq;a[k][q]=s*akp+c*akq;}for(let k=0;k<n;k++){const apk=a[p][k],aqk=a[q][k];a[p][k]=c*apk-s*aqk;a[q][k]=s*apk+c*aqk;}
      for(let k=0;k<n;k++){const vkp=V[k][p],vkq=V[k][q];V[k][p]=c*vkp-s*vkq;V[k][q]=s*vkp+c*vkq;}}}
  return{w:a.map((r,i)=>r[i]),V};}
function modes(Am){const n=Am.nr,L=chol(Am.Mr),C=zeros(n,n);
  for(let j=0;j<n;j++){const x=solveL(L,Am.Kr.map(r=>r[j]));for(let i=0;i<n;i++)C[i][j]=x[i];}   /* L⁻¹ K */
  const A=zeros(n,n);for(let i=0;i<n;i++){const x=solveL(L,C[i]);for(let j=0;j<n;j++)A[i][j]=x[j];}   /* (L⁻¹ (L⁻¹ K)ᵀ)ᵀ = L⁻¹ K L⁻ᵀ, symmetric */
  for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){const m=(A[i][j]+A[j][i])/2;A[i][j]=A[j][i]=m;}
  const{w,V}=jacobi(A),ord=[...w.keys()].sort((a,b)=>w[a]-w[b]);
  return ord.map(k=>({w:Math.sqrt(Math.max(0,w[k])),phi:solveLt(L,V.map(r=>r[k]))}));}
/* a dense solve (Gauss, partial pivoting) */
function gsolve(A,b){const n=b.length,M=A.map((r,i)=>[...r,b[i]]);for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;[M[c],M[p]]=[M[p],M[c]];
  for(let r=c+1;r<n;r++){const f=M[r][c]/M[c][c];if(f)for(let k=c;k<=n;k++)M[r][k]-=f*M[c][k];}}const x=new Float64Array(n);for(let r=n-1;r>=0;r--){let s=M[r][n];for(let k=r+1;k<n;k++)s-=M[r][k]*x[k];x[r]=s/M[r][r];}return x;}

/* a point's displacement (u along t, v along n) as rows over the free coordinates: on node i, or rigidly offset from it to (t, n) */
function rows(F,Am,i,t,n){const ru=new Float64Array(Am.nr),rv=new Float64Array(Am.nr),p=F.N[i],T=Am.T;t=t??p.t;n=n??p.n;
  for(let j=0;j<Am.nr;j++){ru[j]=T[3*i][j]-T[3*i+2][j]*(n-p.n);rv[j]=T[3*i+1][j]+T[3*i+2][j]*(t-p.t);}return{ru,rv};}
const dot=(a,b)=>{let s=0;for(let i=0;i<a.length;i++)s+=a[i]*b[i];return s;};

/* the detent built, reduced, its preload set by Op. 78 and its modes up to fMax */
function detent(o={}){
  const F=frame(o),Am=assemble(F),nr=Am.nr;
  const Jc=tn(ESC.Jc),rS=rows(F,Am,F.K),rJ=rows(F,Am,F.K,Jc.t,Jc.n),rb=F.nb.map(i=>rows(F,Am,i)),rbm={rv:rb[0].rv.map((x,j)=>(x+rb[1].rv[j])/2)};
  /* Op. 78: a weight W78 on the locking jewel just parts the blade from its button. The spring's unstressed shape is the drawn one bent by a moment at its end (its
     curvature uniform, the rest following rigidly): f_pre, the constant force that bend leaves, is that moment, alpha, set so the weight leaves the button's middle at rest */
  const fm=new Float64Array(nr);{const c=Am.T[3*F.F1+2];for(let j=0;j<nr;j++)fm[j]=c[j];}
  const um=gsolve(Am.Kr,fm),fW=rJ.rv.map(x=>x*S.W78*1e-3*G0),uW=gsolve(Am.Kr,fW),alpha=-dot(rbm.rv,uW)/dot(rbm.rv,um),fpre=fm.map(x=>x*alpha);   /* -K(q - alpha um) = -K q + alpha fm */
  /* the stiffness at the stone: a force lifting the locking face's middle, the frame free of its button */
  const fS=rS.rv,uS=gsolve(Am.Kr,fS),kS=1/dot(rS.rv,uS);
  /* mass and inertia about Ft: the reduced mass matrix on a rigid translation and a rigid turn about the root */
  const rig=(f)=>{const v=new Float64Array(Am.nf);for(let i=0;i<F.N.length;i++){const[a,b,c]=f(F.N[i]);v[3*i]=a;v[3*i+1]=b;v[3*i+2]=c;}return v;};
  const mq=v=>{let s=0;for(let i=0;i<Am.nf;i++){if(!v[i])continue;for(let j=0;j<Am.nf;j++)s+=v[i]*Am.Mf[i][j]*v[j];}return s;};
  const mass=mq(rig(()=>[0,1,0])),Ift=mq(rig(p=>[-p.n,p.t,1]));
  return{F,Am,nr,rS,rJ,rb,alpha,fpre,kS,mass,Ift,o};
}
/* modes of the detent clamped at its foot, with the strain energy's share in each group of parts (where it bends) and the motion at the stone */
function modal(dt,fMax){
  const ms=modes(dt.Am),F=dt.F,Am=dt.Am,out=[];
  for(const md of ms){const f=md.w/TAU;if(f>fMax)break;const full=new Float64Array(Am.nf);for(let i=0;i<Am.nf;i++){let s=0;for(let j=0;j<Am.nr;j++)s+=Am.T[i][j]*md.phi[j];full[i]=s;}
    const sh={};let tot=0;for(const e of F.E){let s=0;for(let a=0;a<6;a++)for(let b=0;b<6;b++)s+=full[e.ix[a]]*e.ke[a][b]*full[e.ix[b]];sh[e.grp]=(sh[e.grp]||0)+s/2;tot+=s/2;}
    if(F.o.hinge)sh.spring=(sh.spring||0)+DY.KD*full[3*F.R0+2]**2/2,tot+=DY.KD*full[3*F.R0+2]**2/2;
    for(const k in sh)sh[k]/=tot;out.push({f,w:md.w,phi:md.phi,share:sh,stone:dot(dt.rS.rv,md.phi)});}
  return out;}

/* ---------- the escapement in time with the frame ---------- */
const{I,K:KB,C:CB,JT,TAUE,LEN,W0,T0}=DY,P=ESC.P,lRel=ESC.lRel,BLu=ESC.BL,day=DY.day,at=DY.at,Gt=DY.G,G1t=DY.G1,jd=DY.jd,rhoU=ESC.rho;
const wrap=a=>a-TAU*Math.floor((a+Math.PI)/TAU);
/* the tooth on the stone: it moves into the flat almost square (tau.nF -0.9995); c turns the wheel's angle into the tooth tip's travel along the flat's normal; kU: the
   wheel's angle the stone's travel along t (towards the tooth) is worth; the stone's lift l (unit frame, at the trip spring's tip as dynamics.js counts it) from its travel v */
const rW={x:ESC.S.x-S.EX,y:ESC.S.y},tF={x:rW.y,y:-rW.x},tnF=tF.x*ESC.nF.x+tF.y*ESC.nF.y,cT=ES*Math.abs(tnF),kU=(dB.x*ESC.nF.x+dB.y*ESC.nF.y)/cT,LV=LEN/(BLu*ES);
/* the stone's friction on the tooth, Coulomb's smoothed below VF (the stone slides at about 0.08 m/s as it lifts): stiffer, it would be a dashpot RK4 can't carry on the blade's mass */
const VF=1e-3;
/* makeEsc's recoil: the wheel's turn back as the stone lifts l. It rises while the tooth's tip slides along the flat (the draw), peaks where the tip reaches the flat's inner end
   (lPk: the depth of lock, Op. 85) and falls to 0 as the tip rides round the stone's edge, where the tooth's pressure pushes the stone out; from lFr the tip is free. makeEsc
   keeps the rest of the lift to lRel as room to spare and takes the release there; the frame lets the tooth go at lFr (the validation, as dynamics.js, at lRel), and a held
   tooth's stone past lPk is lost: the tooth throws it off. The slope is the secant over 1 % of lRel (the table steps with the stone's outline) */
const NRC=400,RCt=Float64Array.from({length:NRC+1},(_,k)=>ESC.recoil(lRel*k/NRC));let kPk=0;for(let k=1;k<=NRC;k++)if(RCt[k]>RCt[kPk])kPk=k;let kFr=kPk;while(kFr<NRC&&RCt[kFr]>1e-9)kFr++;
const lPk=lRel*kPk/NRC,lFr=lRel*kFr/NRC;
const rec=l=>l<=0?0:l>=lRel?0:ESC.recoil(l),recD=l=>{const d=lRel/100,a=Math.max(0,l-d/2),b=Math.min(lRel,l+d/2);return l<=-d||l>=lRel?0:(rec(b)-rec(a))/(b-a);};
/* the restitution a spring and dashpot in contact gives (the force held at or above 0) is near exp(-zeta pi / sqrt(1-zeta²)): the damping ratio for e */
const zetaOf=e=>e<=0?1:-Math.log(e)/Math.sqrt(Math.PI**2+Math.log(e)**2);

/* model: the detent's frame and modes for options o (frame's, plus fMax the highest mode kept, Hz, 30 kHz: the blade's and arm's first three, the trip spring's first four; Q the modes' quality factor, estimated 100 as dynamics.js's; contacts kB
   (button, each end), kT (tooth on stone and on the impulse jewel), kJ (discharge jewel on the trip spring's tip), kH (trip spring on the horn), N/m; restitutions eB (button,
   0.3 estimated as dynamics.js), eL (the tooth on the stone, 0.3 estimated), eI (the tooth on the impulse jewel, 0: dynamics.js's plastic), eJ (jewel on tip, 0), eH (trip
   spring on the horn, 0.3 estimated); MU the tooth's friction on the stone (steel on sapphire, makeEsc's)) */
function model(o={}){
  const dt=detent(o),md=modal(dt,o.fMax??30000),N=md.length,F=dt.F,Am=dt.Am;
  const proj=r=>Float64Array.from(md,m=>dot(r,m.phi));
  const tP=tn(ESC.Pt);
  const R={S:{u:proj(dt.rS.ru),v:proj(dt.rS.rv)},b:dt.rb.map(r=>proj(r.rv)),tip:(()=>{const r=rows(F,Am,F.tip);return{u:proj(r.ru),v:proj(r.rv)};})(),hx:(()=>{const r=rows(F,Am,F.Hn,tP.t,tP.n);return{u:proj(r.ru),v:proj(r.rv)};})(),
    h:F.nh.map((i,k)=>{const sp=rows(F,Am,i).rv,hr=rows(F,Am,F.Hn,F.N[i].t,F.N[F.Hn].n).rv;return proj(sp.map((x,j)=>x-hr[j]));})};
  const fpre=proj(dt.fpre),w=Float64Array.from(md,m=>m.w),z=new Float64Array(N).fill(1/(2*(o.Q??100)));
  /* the case's acceleration: the inertia each mode feels, for a unit acceleration along the unit frame's x and y and a unit turn about the balance staff */
  const gam=fn=>{const v=new Float64Array(Am.nf);for(let i=0;i<F.N.length;i++){const p=F.N[i],q=xy(p.t,p.n),[ax,ay,al]=fn(q.x*ES,q.y*ES);v[3*i]=ax*dB.x+ay*dB.y;v[3*i+1]=ax*nB.x+ay*nB.y;v[3*i+2]=al;}
    const mv=new Float64Array(Am.nf);for(let i=0;i<Am.nf;i++){let s=0;for(let j=0;j<Am.nf;j++)s+=Am.Mf[i][j]*v[j];mv[i]=s;}const red=new Float64Array(Am.nr);for(let j=0;j<Am.nr;j++){let s=0;for(let i=0;i<Am.nf;i++)s+=Am.T[i][j]*mv[i];red[j]=s;}return proj(red);};
  const Gx=gam(()=>[1,0,0]),Gy=gam(()=>[0,1,0]),Ga=gam((x,y)=>[-y,x,1]);
  const kB=o.kB??1e6,kT=o.kT??1e6,kJ=o.kJ??2e5,kR=o.kR??500,kH=o.kH??2e4;
  /* each contact's dashpot is set on the mass the contact meets where it touches, 1/|r|² over the kept modes (r its row): the rigid detent's at that point for a stiff frame,
     the blade's or the arm's own near it for the frame as drawn (what a jewel striking a thin arm does is ring the arm, which the modes carry); the tooth with the wheel's */
  const r2=r=>r.reduce((s_,x)=>s_+x*x,0),mLoc=(...rs)=>1/rs.reduce((s_,r)=>s_+r2(r),0);
  const mW=JT/(cT*cT),mBt=mLoc(R.b[0]),mTip=mLoc(R.hx.u,R.hx.v),mTs=mLoc(R.tip.u,R.tip.v),mHn=mLoc(R.h[1]),mT=1/(1/mW+1/mLoc(R.S.u,R.S.v));
  const cd=(k,m,e)=>2*zetaOf(e)*Math.sqrt(k*m);
  const C={B:cd(kB,mBt,o.eB??0.3),L:cd(kT,mT,o.eL??0.3),I:cd(kT,mW,o.eI??0),J:cd(kJ,mTip,o.eJ??0),Jr:cd(kR,mTs,o.eR??0),H:cd(kH,mHn,o.eH??0.3)};
  /* the step: RK4 holds while h times each contact's own frequency and damping rate (over the kept modes: k|r|², c|r|²) and the highest mode stay under about 1 */
  const lim=[Math.max(...w),Math.sqrt(kB*r2(R.b[0])),C.B*r2(R.b[0]),Math.sqrt(kT*(r2(R.S.u)+r2(R.S.v))),C.L*(r2(R.S.u)+r2(R.S.v)),
    Math.sqrt(kJ*(r2(R.hx.u)+r2(R.hx.v))),C.J*(r2(R.hx.u)+r2(R.hx.v)),Math.sqrt(kR*(r2(R.tip.u)+r2(R.tip.v))),C.Jr*(r2(R.tip.u)+r2(R.tip.v)),Math.sqrt(kH*r2(R.h[1])),C.H*r2(R.h[1]),(o.MU??S.MU)*TAUE*(o.sMax??1.6)/cT/VF*(r2(R.S.v))],hf=Math.min(1e-6,0.9/Math.max(...lim));
  return{o,dt,md,N,R,fpre,w,z,Gx,Gy,Ga,kB,kT,kJ,kR,kH,C,mu:o.MU??S.MU,hf,lim};
}

/* one run, as dynamics.js's sim: s (drive, times the calibrated), A (start, degrees), T, from, ext(t) {al, ax, ay}, extFine(t) (fine steps there), trace (events). Returns the
   swing, rate, beats, trips (a tooth let go with the discharge jewel not on the trip spring, or a tooth arriving with the stone lifted past the release), and the ringing: the
   stone's highest lift while a tooth is held and the jewel is clear of the trip spring (as a share of the release), and its lift as each tooth arrives */
function run(M,o={}){
  const{N,R,fpre,w,z,Gx,Gy,Ga,kB,kT,kJ,kR,kH,C,mu}=M,s=o.s??1,tauE=TAUE*s,qD=!!M.o.qsDraw,mDq=tauE*DY.CDR/DY.DREL,ext=o.ext,T=o.T??20,from=o.from??10;
  const nY=4+2*N,Y=new Float64Array(nY),Yt=new Float64Array(nY),k1=new Float64Array(nY),k2=new Float64Array(nY),k3=new Float64Array(nY),k4=new Float64Array(nY);
  let held=true;const dg={jew:0,btn:0,tooth:0,imp:0,horn:0,l:0};   /* diagnostics of the last derivative */
  const der=(t,y,out,save)=>{
    const th=y[0],om=y[1],ph=y[2],pv=y[3];let ax=0,ay=0,al=0;if(ext){const e=ext(t);ax=e.ax||0;ay=e.ay||0;al=e.al||0;}
    let vS=0,uS=0,vSd=0,uSd=0,tu=0,tv=0,tud=0,tvd=0;const act=om>0,Ru=act?R.hx.u:R.tip.u,Rv=act?R.hx.v:R.tip.v;const b=[0,0],bd=[0,0],h=[0,0,0],hd=[0,0,0];
    for(let i=0;i<N;i++){const q=y[4+i],qd=y[4+N+i];vS+=R.S.v[i]*q;uS+=R.S.u[i]*q;vSd+=R.S.v[i]*qd;uSd+=R.S.u[i]*qd;tu+=Ru[i]*q;tv+=Rv[i]*q;tud+=Ru[i]*qd;tvd+=Rv[i]*qd;
      b[0]+=R.b[0][i]*q;b[1]+=R.b[1][i]*q;bd[0]+=R.b[0][i]*qd;bd[1]+=R.b[1][i]*qd;for(let k=0;k<3;k++){h[k]+=R.h[k][i]*q;hd[k]+=R.h[k][i]*qd;}}
    let Mth=-KB*th-CB*om-I*al,Mph=-tauE-JT*al;let fS_v=0,fS_u=0,fT_u=0,fT_v=0;const fb=[0,0],fh=[0,0,0];
    /* the tooth on the stone: held, the locked tooth; free, the next one (a pitch on) */
    const l=vS*LV,dl=vSd*LV,Rr=rec(l),Rd=recD(l),dph=Rr+kU*uS-(held?ph:ph+P),dphd=Rd*dl+kU*uSd-pv;let Ft_=0;
    if(qD&&held){Ft_=tauE;Mph=0;if(l>0)fS_v-=mDq/(BLu*ES);}   /* dynamics.js's draw: the wheel held still, the draw a steady moment on the detent while it lifts */
    else if(dph>0&&(held||l<(M.o.relRel?lRel:lFr))){Ft_=Math.max(0,kT*cT*cT*dph+M.C.L*cT*cT*dphd);Mph+=Ft_;fS_v-=Ft_*Rd*LV;fS_u-=Ft_*kU;const fn=Ft_/cT;fS_v-=mu*fn*Math.tanh(vSd/VF);}
    /* the tooth on the impulse jewel, once let go */
    let Fi=0,g1S=0;if(!held){const g=at(Gt,th);if(!isNaN(g)){const g1=at(G1t,th)||0,d=g-ph;if(d>0){g1S=g1;Fi=Math.max(0,kT*ES*ES*d+C.I*ES*ES*(g1*om-pv));Mph+=Fi;Mth-=Fi*g1;}}}
    /* the discharge jewel on the trip spring's tip: the jewel's own outline (dynamics.js's distance field), the tip a disc rho round */
    let Fj=0,gthS=0;{const px=ESC.Pt.x+(tu*dB.x+tv*nB.x)/ES,py=ESC.Pt.y+(tu*dB.y+tv*nB.y)/ES,ux=Math.cos(ESC.aD+th),uy=Math.sin(ESC.aD+th),pu=px*ux+py*uy,pm=-px*uy+py*ux;
      if(pu>-0.05&&pu<DY.JR+0.05&&Math.abs(pm)<DY.JH+0.05){const d0=jd(pu,pm);if(d0<rhoU){const e=1e-7,gu=(jd(pu+e,pm)-jd(pu-e,pm))/(2*e),gm=(jd(pu,pm+e)-jd(pu,pm-e))/(2*e);
        const gx=gu*ux-gm*uy,gy=gu*uy+gm*ux,gth=gu*pm-gm*pu,vx=(tud*dB.x+tvd*nB.x)/ES,vy=(tud*dB.y+tvd*nB.y)/ES,dd=(gx*vx+gy*vy+gth*om)*ES;
        Fj=Math.max(0,(act?kJ:kR)*(rhoU-d0)*ES-(act?C.J:C.Jr)*dd);Mth+=Fj*ES*gth;gthS=gth;fT_u+=Fj*(gx*dB.x+gy*dB.y);fT_v+=Fj*(gx*nB.x+gy*nB.y);}}}
    /* the blade on its button; the trip spring on the horn */
    let Fb=0;for(let k=0;k<2;k++){if(b[k]<0){fb[k]=Math.max(0,-kB*b[k]-C.B*bd[k]);Fb+=fb[k];}}
    let Fh=0;for(let k=0;k<3;k++){if(h[k]>0){fh[k]=Math.max(0,kH*h[k]+C.H*hd[k]);Fh+=fh[k];}}
    out[0]=om;out[1]=Mth/I;out[2]=pv;out[3]=qD&&held?0:Mph/JT;
    for(let i=0;i<N;i++){const q=y[4+i],qd=y[4+N+i];
      const f=fpre[i]+fS_v*R.S.v[i]+fS_u*R.S.u[i]+fT_u*Ru[i]+fT_v*Rv[i]+fb[0]*R.b[0][i]+fb[1]*R.b[1][i]-fh[0]*R.h[0][i]-fh[1]*R.h[1][i]-fh[2]*R.h[2][i]-(Gx[i]*ax+Gy[i]*ay+Ga[i]*al);
      out[4+i]=qd;out[4+N+i]=f-2*z[i]*w[i]*qd-w[i]*w[i]*q;}
    if(save){dg.mJ=Fj*ES*(Fj>0?(gthS):0);dg.mI=-Fi*(Fi>0?g1S:0);dg.jew=Fj;dg.btn=Fb;dg.tooth=Ft_;dg.imp=Fi;dg.horn=Fh;dg.l=l;dg.ld=dl;dg.uS=uS;}};
  const step=(t,h)=>{der(t,Y,k1,true);for(let i=0;i<nY;i++)Yt[i]=Y[i]+h/2*k1[i];der(t+h/2,Yt,k2);for(let i=0;i<nY;i++)Yt[i]=Y[i]+h/2*k2[i];der(t+h/2,Yt,k3);
    for(let i=0;i<nY;i++)Yt[i]=Y[i]+h*k3[i];der(t+h,Yt,k4);for(let i=0;i<nY;i++)Y[i]+=h/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i]);};
  /* rest: the detent on its button with the tooth held, the balance far off (Newton on the modes and the wheel) */
  const rest=()=>{const x=new Float64Array(N+1);for(let i=0;i<N;i++)x[i]=1e-3*fpre[i]/(w[i]*w[i]);x[N]=-1.0001*tauE/(kT*cT*cT);const yy=new Float64Array(nY),o_=new Float64Array(nY);yy[0]=Math.PI;const res=v=>{for(let i=0;i<N;i++)yy[4+i]=v[i];yy[2]=v[N];for(let i=0;i<N;i++)yy[4+N+i]=0;yy[1]=0;yy[3]=0;der(0,yy,o_);return[...Array(N).keys()].map(i=>o_[4+N+i]).concat([qD?v[N]:o_[3]*JT]);};
    for(let it=0;it<30;it++){const r0=res(x),J=[];const e=1e-12;for(let j=0;j<=N;j++){const xp=Float64Array.from(x);xp[j]+=j<N?e:1e-9;const r1=res(xp);J.push(r1.map((v,i)=>(v-r0[i])/(j<N?e:1e-9)));}
const A=r0.map((_,i)=>J.map(c=>c[i])),dx=gsolve(A,r0.map(v=>-v));let mx=0;for(let j=0;j<=N;j++){x[j]+=dx[j];mx=Math.max(mx,Math.abs(dx[j]));}if(mx<1e-15)break;}
    return x;};
  const ext0=o.ext;o.ext=null;const xs=rest();o.ext=ext0;
  const qs=xs.slice(0,N),ps=xs[N];
  Y[0]=-(o.A??ESC.A/D)*D;Y[1]=0;Y[2]=ps;Y[3]=0;for(let i=0;i<N;i++)Y[4+i]=qs[i];
  const st={jt:-1,offs:[],offL:NaN,swRel:0,twice:0,beats:0,rel:[],relJ:0,trips:0,knock:0,pass:0,land:[],off:[],home:[],cross:[],amps:[],ampT:[],ring:0,ringT:0,arrive:[],ringMax:[],lastRel:-1,jewOn:false,offT:-1,homeT:-1,maxL:0,steps:0,frozen:0};
  const hf=o.hf??M.hf,hc=o.hc??1e-4;
  /* the detent quiet: its motion (each mode's speed over its frequency) under 1 nm at the stone (1e-5 of the lift that frees the tooth) and 10 nm at the tip, the wheel still. It is then held where it is: the stone's
     friction on the tooth holds it there (the regularised friction would let it creep, over a second or so, to where it rests without) */
  const quiet=()=>{let aS=0,aT=0;for(let i=0;i<N;i++){const a=Math.abs(Y[4+N+i]/w[i]);aS+=a*Math.abs(R.S.v[i]);aT+=a*(Math.abs(R.tip.v[i])+Math.abs(R.tip.u[i]));}return aS<1e-9&&aT<1e-8&&Math.abs(Y[3])<1e-5;};
  let t=0,frozen=false,ringOn=false;
  while(t<T){
    const tw=wrap(Y[0]),near=(ext&&!o.extFine)||(tw>-0.8&&tw<0.55)||!held||(ext&&o.extFine&&o.extFine(t));
    if(!near&&!frozen&&quiet()){frozen=true;for(let i=0;i<N;i++)Y[4+N+i]=0;Y[3]=0;}
    if(near)frozen=false;
    const h=Math.min(frozen?hc:hf,T-t),thO=Y[0],wO=Y[1];
    if(frozen){/* the balance alone, the detent and wheel at rest (ext would need them stepped: extFine keeps those runs out of here) */
      const f=(th,om)=>(-KB*th-CB*om)/I;const a1=f(Y[0],Y[1]),v1=Y[1],a2=f(Y[0]+h/2*v1,Y[1]+h/2*a1),v2=Y[1]+h/2*a1,a3=f(Y[0]+h/2*v2,Y[1]+h/2*a2),v3=Y[1]+h/2*a2,a4=f(Y[0]+h*v3,Y[1]+h*a3),v4=Y[1]+h*a3;
      Y[0]+=h/6*(v1+2*v2+2*v3+v4);Y[1]+=h/6*(a1+2*a2+2*a3+a4);st.frozen++;}
    else{step(t,h);st.steps++;}
    t+=h;const th=Y[0],om=Y[1];
    if(thO>0&&th<=0&&om<0)st.cross.push(t-h+h*thO/(thO-th));
    if((wO>0&&om<=0)||(wO<0&&om>=0)){st.amps.push(Math.abs(th));st.ampT.push(t);if(wO<0)st.swRel=0;}   /* an active swing begins */
    if(frozen)continue;
    der(t,Y,k1,true);const l=dg.l,jewOn=dg.jew>0;if(o.work){const wk=o.work;wk[om>0?'ja':'jr']+=dg.mJ*om*h;wk.imp+=dg.mI*om*h;if(wk.bins&&om>0){const b=Math.floor(th/D)+40;if(b>=0&&b<80)wk.bins[b]+=dg.mJ*om*h;}}
    if(jewOn&&om>0)st.jt=t;   /* the jewel on the trip spring's tip on the active swing: unlocking, or carrying the detent after the release */
    if(st.jewOn&&!jewOn&&om>0&&!held){if(!(st.offT>st.lastRel))st.off.push(th/D);st.offT=t;st.offL=th/D;}
    st.jewOn=jewOn;
    if(held){
      if(l>=(qD||M.o.relRel?lRel:lFr)){held=false;st.rel.push(th/D);st.lastRel=t;st.homeT=-1;if(st.swRel++>0){st.trips++;st.twice++;if(o.trace)o.trace.push([t,'twice',th/D]);}else if(!(t-st.jt<2e-3&&om>0)){st.trips++;st.knock++;if(o.trace)o.trace.push([t,'knocked',th/D]);}if(o.trace)o.trace.push([t,'release',th/D,jewOn]);}
      else if(t-st.jt>2e-3||om<0){if(l>st.maxL){st.maxL=l;st.maxTh=th/D;st.maxOm=om;}if(st.homeT>0&&l>st.ring)st.ring=l;}}
    else{if(rec(l)+kU*dg.uS-(Y[2]+P)>=0){Y[2]+=P;if(l<(qD||M.o.relRel?lRel:lFr)){held=true;st.beats++;if(M.o.qsDraw){Y[2]=ps;Y[3]=0;}if(!isNaN(st.offL))st.offs.push(st.offL);st.arrive.push(l/lPk);if(o.trace)o.trace.push([t,'lock',th/D,l/lRel]);}else{st.trips++;st.pass++;if(o.trace)o.trace.push([t,'passed',th/D,l/lRel]);}}}
    if(st.lastRel>0&&st.homeT<0&&dg.btn>0&&!jewOn&&t>st.offT&&st.offT>st.lastRel){st.homeT=t;st.home.push(th/D);}
    if(o.watch)o.watch(t,Y,dg,held);
    if(o.rec&&t>=o.rec.t0&&t<=o.rec.t1&&t>=o.rec.next){o.rec.next=t+o.rec.dt;o.rec.out.push([+t.toFixed(6),+(th/D).toFixed(3),+(l/lPk).toFixed(5),+(dg.btn*1e3).toFixed(3),+(dg.jew*1e3).toFixed(3),+(dg.tooth/cT*1e3).toFixed(3),held?1:0]);}
  }
  const c=st.cross.filter(x=>x>=from),n=c.length,Tm=n>1?(c[n-1]-c[0])/(n-1):NaN,am=st.amps.slice(-8);
  const mean=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:NaN,tail=a=>a.slice(Math.floor(a.length/2));
  return{A:am.length?am.reduce((a,b)=>a+b,0)/am.length/D:0,rate:day(T0/Tm-1),beats:st.beats,trips:st.trips,knock:st.knock,pass:st.pass,twice:st.twice,rel:mean(tail(st.rel)),off:mean(tail(st.off)),offF:mean(tail(st.offs)),home:mean(tail(st.home)),
    ring:st.ring/lPk,maxL:st.maxL/lPk,maxTh:st.maxTh,maxRet:st.maxOm<0,arrive:Math.max(0,...tail(st.arrive)),steps:st.steps,frozen:st.frozen,amps:st.amps,ampT:st.ampT};
}

module.exports={frame,assemble,modes,detent,modal,rows,dot,gsolve,tn,xy,X,model,run};
if(require.main!==module)return;

/* ---------- the report ---------- */
const quick=process.argv.includes('--quick'),ji=process.argv.indexOf('--json'),JOUT=ji>0?process.argv[ji+1]:null,RW=[],J={made:new Date().toISOString().slice(0,10)};let fail=0;
const say=s=>RW.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;RW.push(`${ok?'  ok ':'  !! '} ${s}`);};
const f=(x,n=2)=>(+x).toFixed(n),sg=(x,n=2)=>(x>=0?'+':'−')+Math.abs(x).toFixed(n),pc=x=>f(100*x,x<0.1?2:1)+' %',t0=Date.now(),flush=()=>{console.log(RW.splice(0).join('\n'));console.log(`  (${f((Date.now()-t0)/1000,0)} s)`);};
const LR=lPk*ESC.ES*BLu/LEN,LF=lFr*ESC.ES*BLu/LEN,LRel=lRel*ESC.ES*BLu/LEN;   /* at the stone (mm): the depth of lock (the flat's inner end), where the tip is free, makeEsc's release */
const pick=r=>({A:+f(r.A,2),rate:+f(r.rate,3),rel:+f(r.rel,2),offF:+f(r.offF,2),home:+f(r.home,2),beats:r.beats,trips:r.trips,maxL:+f(r.maxL,5),maxTh:+f(r.maxTh??NaN,1),maxRet:!!r.maxRet,arrive:+f(r.arrive,5)});

say('0. The detent as a frame (the pieces movement.js draws)');
const V={drawn:{},stiff:{stiff:true},hinge:{hinge:true,stiff:true}},DT={},MD={};
for(const[k,o]of Object.entries(V)){DT[k]=detent(o);MD[k]=modal(DT[k],30000);}
{const d=DT.drawn,F=d.F;say(`${F.E.length} beam elements on ${F.N.length} nodes (${d.nr} free coordinates): the spring's two strips ${f(1000*(X.spring.n1-X.spring.n0),3)} × ${f(1000*hOf('spring'),2)} mm, ${f(1000*X.spring.t1,2)} long; the blade ${f(1000*(X.blade.n1-X.blade.n0),3)} × ${f(1000*hOf('blade'),2)} mm; the arm ${f(2*0.025*ESC.ES,2)} × ${f(1000*hOf('arm'),2)}; the trip spring ${S.tsT} × ${S.tsH}, ${f(1000*(tn(ESC.Pt).t-tn(ESC.Ps0).t),1)} long; the cross-piece with the bracket, the block with the stone, the horn rigid`);
  chk(Math.abs(d.mass/DY.DM.m-1)<0.02&&Math.abs(d.Ift/DY.ID-1)<0.02,`its mass ${f(d.mass*1e6,2)} mg and inertia about the spring's root ${f(d.Ift*1e9,3)} g·mm² are dynamics.js's (${f(DY.DM.m*1e6,2)}, ${f(DY.ID*1e9,3)}) within 2 %`);
  const h=DT.hinge;chk(Math.abs(h.kS*(BLu*ES)**2/DY.KD-1)<1e-3&&Math.abs(-h.alpha/DY.MPRE-1)<1e-3&&Math.abs(MD.hinge[0].w/Math.sqrt(DY.KD/h.Ift)-1)<1e-3,`hinged at Ft and rigid, it is dynamics.js's detent: ${f(h.kS,2)} N/m at the stone (KD/r² ${f(DY.KD/(BLu*ES)**2,2)}), Op. 78's preload ${f(-h.alpha*1e6,1)} µN·m (${f(DY.MPRE*1e6,1)}), its first mode ${f(MD.hinge[0].f,1)} Hz (√(KD/I): ${f(Math.sqrt(DY.KD/h.Ift)/TAU,1)})`);
  say(`as drawn its spring bends along its length instead of turning about its root: ${f(d.kS,2)} N/m at the stone (${f(100*(d.kS/h.kS-1),0)} % stiffer: a short flexure under a long lever turns about its middle, Howell 2001), the preload a moment of ${f(-d.alpha*1e6,1)} µN·m at the spring's end for the same 0.770 g`);
  say(`its modes up to 30 kHz, clamped at the foot (where the strain energy is):`);
  for(const m of MD.drawn)say(`  ${f(m.f,0).padStart(6)} Hz  ${Object.entries(m.share).sort((a,b)=>b[1]-a[1]).filter(([,v])=>v>0.05).map(([k,v])=>`${k} ${f(100*v,0)} %`).join(', ')}`);
  J.frame={nodes:F.N.length,elements:F.E.length,mass:d.mass,Ift:d.Ift,dm:DY.DM.m,did:DY.ID,kS:d.kS,kSh:h.kS,alpha:d.alpha,mpre:DY.MPRE,f1h:MD.hinge[0].f,
    modes:MD.drawn.map(m=>({f:+f(m.f,1),share:Object.fromEntries(Object.entries(m.share).map(([k,v])=>[k,+f(v,3)]))})),modesStiff:MD.stiff.map(m=>+f(m.f,1)),modesHinge:MD.hinge.map(m=>+f(m.f,1))};}
flush();

say('1. Validated: the frame made rigid and hinged at Ft, the draw as dynamics.js takes it, against dynamics.js');
const dyn=DY.sim({mode:'phys',T:20,from:10}),Mq=model({hinge:true,stiff:true,qsDraw:true,eL:0}),rq=run(Mq,{T:20,from:10}),rq2=run(Mq,{T:20,from:10,hf:Mq.hf/2,hc:5e-5});
say(`dynamics.js: the swing ${f(dyn.A,2)}°, rate ${sg(dyn.rate,3)} s a day, release ${f(dyn.rel,2)}°, off the jewel for the last time ${f(dyn.offF,2)}°, home ${f(dyn.home,2)}°, ${dyn.beats} beats`);
say(`the frame:   the swing ${f(rq.A,2)}°, rate ${sg(rq.rate,3)} s a day, release ${f(rq.rel,2)}°, off the jewel for the last time ${f(rq.offF,2)}°, home ${f(rq.home,2)}°, ${rq.beats} beats (at half the step: ${f(rq2.A,2)}°, ${sg(rq2.rate,3)})`);
chk(Math.abs(rq.A-dyn.A)<1&&Math.abs(rq.rate-dyn.rate)<0.3&&Math.abs(rq.rel-dyn.rel)<0.2&&Math.abs(rq.offF-dyn.offF)<0.3&&Math.abs(rq.home-dyn.home)<0.3&&rq.beats===dyn.beats&&rq.trips===0,
  `the frame's escapement is dynamics.js's: the swing within 1°, the rate 0.3 s a day, the release 0.2°, the detent's last departure and its landing 0.3°, every beat`);
chk(Math.abs(rq2.A-rq.A)<0.05&&Math.abs(rq2.rate-rq.rate)<0.02,`and converged in its step (${sg(rq2.A-rq.A,3)}°, ${sg(rq2.rate-rq.rate,3)} s a day at half)`);
const rd=run(model({hinge:true,stiff:true,eL:0,relRel:true}),{T:20,from:10}),rf=run(model({hinge:true,stiff:true,eL:0}),{T:20,from:10});
say(`the wheel's own inertia in the recoil (dynamics.js holds the wheel still while the stone lifts and counts the draw as a steady moment): the jewel's strike starts the stone at once, its 10° of draw throws the wheel back at 2-3 rad/s and the tooth catches the stone up a few times before the release; against the steady moment the swing ${sg(rd.A-rq.A,2)}° at 20 s and the rate ${sg(rd.rate-rq.rate,2)} s a day: the averaged draw holds`);
say(`the tooth let go where its tip is free (${f(100*lFr/lRel,0)} % of makeEsc's release, past the stone's edge) rather than at makeEsc's release, which keeps room to spare: released ${f(Math.abs(rf.rel-rd.rel),2)}° of the balance sooner, the swing ${sg(rf.A-rd.A,2)}°, ${sg(rf.rate-rd.rate,2)} s a day`);
J.valid={dyn:pick(dyn),frame:pick(rq),half:pick(rq2),wheel:pick(rd),free:pick(rf),lPk:lPk/lRel,lFr:lFr/lRel};
flush();
if(quick){if(fail)process.exitCode=1;if(JOUT)fs.writeFileSync(JOUT,JSON.stringify(J));return;}

say('2. Running: the detent as drawn, the wheel free to recoil, every contact elastic');
say(`at the stone the depth of lock is ${f(LR*1000,0)} µm (makeEsc's recoil peaks: the flat's inner end); past it the tooth's pressure on the stone's rounded edge pushes the stone out, and the tip is free at ${f(LF*1000,0)} µm (makeEsc keeps ${f(LRel*1000,0)}, room to spare). The margin is the lift a held tooth's stone reaches against the depth of lock`);
const run20=(o,ro={})=>{const M=model(o),rec={t0:5.0,t1:5.5,dt:2e-5,next:0,out:[]};return{r:run(M,{T:10,from:5,rec,...ro}),rec:rec.out,M};};
const R2={};for(const[k,o]of[['hinge',{hinge:true,stiff:true}],['stiff',{stiff:true}],['drawn',{}]])R2[k]=run20(o);
for(const[k,nm]of[['hinge','hinged at Ft, rigid (dynamics.js\'s)'],['stiff','the spring as drawn, the blade rigid'],['drawn','as drawn']]){const r=R2[k].r;
  say(`${nm.padEnd(38)} the swing ${f(r.A,1)}°, rate ${sg(r.rate,2)}, release ${f(r.rel,2)}°, home ${f(r.home,2)}°; ${r.beats} beats, ${r.trips} trips; a held tooth's stone lifted at most ${pc(r.maxL)} of the depth of lock (at ${f(r.maxTh,0)}°, ${r.maxRet?'the return swing':'after the lock'}), ${pc(r.arrive)} as the next tooth arrives`);}
const dr=R2.drawn.r;
chk(dr.trips===0&&dr.beats>15,`as drawn no tooth gets past the stone: ${dr.beats} beats`);
chk(dr.maxL<0.5,`and a held tooth's stone never uses half the depth of lock: at most ${pc(dr.maxL)} of its ${f(LR*1000,0)} µm (${f(dr.maxL*LR*1000,1)} µm; past it the tooth throws the stone off)`);
/* the trace kept as its envelope: each 0.1 ms, the time (ms from the window's start), the balance's angle, the stone's least and greatest lift (shares of the release), whether
   the discharge jewel touched the trip spring and whether a tooth was held */
const env=tr=>{const o=[];for(let i=0;i<tr.length;i+=5){const b=tr.slice(i,i+5),ls=b.map(r=>r[2]);o.push([+f((b[0][0]-tr[0][0])*1000,2),+f(b[0][1],2),+f(Math.min(...ls),5),+f(Math.max(...ls),5),b.some(r=>r[4]>0)?1:0,b.every(r=>r[6])?1:0]);}return o;};
J.running=Object.fromEntries(Object.entries(R2).map(([k,v])=>[k,{...pick(v.r),trace:env(v.rec)}]));J.LR=LR;J.LF=LF;J.LRel=LRel;
/* how much each estimate moves it: the detent's damping, the contacts' restitution and stiffness, the blade's stiffness, the modes kept */
const SW=[['the modes\' damping Q 30',{Q:30}],['Q 1000 (hardened beryllium copper rings long)',{Q:1000}],['the button dead (restitution 0)',{eB:0}],['the button lively (0.6)',{eB:0.6}],
  ['the tooth on the stone dead (0)',{eL:0}],['the tooth lively (0.6)',{eL:0.6}],['the jewel on the tip lively (0.5)',{eJ:0.5}],['every contact 4× stiffer',{kB:4e6,kT:4e6,kJ:8e5,kH:8e4,kR:2e3}],
  ['every contact 4× softer',{kB:2.5e5,kT:2.5e5,kJ:5e4,kH:5e3,kR:125}],['the blade half as stiff',{eiB:0.5}],['modes kept to 60 kHz',{fMax:60000}]];
const sw=[];for(const[nm,o]of SW){const r=run(model(o),{T:5,from:2.5});sw.push({name:nm,...pick(r)});say(`  ${nm.padEnd(48)} ${r.trips} trips, the stone at most ${pc(r.maxL).padStart(8)} (${r.maxRet?'return':'lock'}), the swing ${f(r.A,1)}°`);}
chk(sw.every(r=>r.trips===0&&r.maxL<0.5),`over all of these no tooth gets past and a held tooth's stone uses under half the depth of lock: at most ${pc(Math.max(...sw.map(r=>r.maxL)))}`);
J.sweep=sw;
flush();

say('3. Pushed: the swing raised by the drive until a tooth gets past');
{const sFor=A=>{let lo=0.5,hi=6;for(let i=0;i<40;i++){const m=(lo+hi)/2;ESC.ampAt(m)<A*D?lo=m:hi=m;}return(lo+hi)/2;};
  const Md2=model({}),out=[];let lastOk=null,firstBad=null;
  for(const A of[270,290,310,320,330,333,335,337,338,339,340,345,350]){const s=sFor(A);if(!(ESC.ampAt(s)>0))continue;const r=run(Md2,{s,A,T:3,from:1.5}),q=DY.sim({mode:'phys',s,A,T:3,from:1.5}),qT=q.trips+Math.max(0,q.beats-Math.ceil(3/T0));   /* dynamics.js books a second unlocking in a swing as a beat */
    out.push({A,s:+f(s,3),frame:{...pick(r),twice:r.twice},dyn:{A:+f(q.A,1),trips:qT,beats:q.beats}});
    say(`  drive ${f(s,2)}× (the model's swing ${f(ESC.ampAt(s)/D,0)}°): the frame ${f(r.A,0)}°, ${r.trips} trips${r.twice?` (${r.twice} unlocked twice in a swing)`:''}, the stone at most ${pc(r.maxL)}; dynamics.js ${f(q.A,0)}°, ${qT} trips`);
    if(r.trips===0&&r.beats>0){if(firstBad==null)lastOk=r.A;}else if(firstBad==null)firstBad=r.A;}
  say(`the largest swing that never trips: about ${f(lastOk,0)}°, the first that does ${firstBad==null?"(none)":f(firstBad,0)+"°"}: makeEsc's TRIP (${f(ESC.TRIP/D,0)}°) is where the discharge jewel comes round to the trip spring again; it lets the tooth go some 5° on, as at -21°. The manual's band ends at 270°`);
  chk(lastOk!=null&&lastOk>300,`the frame trips only past 300° of swing, far above the 270° the manual allows`);
  J.push={rows:out,lastOk,firstBad,TRIP:ESC.TRIP/D};}
flush();

say('4. Knocks: the smallest that lets a tooth go or loses a beat, the frame as drawn against the rigid detent (the same runs in dynamics.js)');
{const M4=model({}),A0=255;
  const pulse=(t1,dur,fn)=>tt=>{const u=(tt-t1)/dur;return u>0&&u<1?fn(Math.sin(Math.PI*u)):{al:0,ax:0,ay:0};};
  const ang=Math.atan2(DY.DM.my,DY.DM.mx)+Math.PI/2,ux=Math.cos(ang),uy=Math.sin(ang);
  const BF={},BD={},bOf=(p,isD)=>{const C_=isD?BD:BF;if(!(p in C_)){const o={A:A0,T:0.3+p*T0+0.55,from:0.2};C_[p]=isD?DY.sim({mode:'phys',...o}):run(M4,o);}return C_[p];};   /* unknocked, the same length */
  const upset=(r,p,isD)=>{const b=bOf(p,isD);return r.trips>0||r.beats!==b.beats;};
  const ph=[0.1,0.35,0.6,0.85],find=(mk,lo,hi,isD)=>{const bad=g=>{for(const p of ph)for(const sgn of[1,-1]){const r=mk(g*sgn,p,isD);if(upset(r,p,isD))return true;}return false;};for(let i=0;i<7;i++){const m=Math.sqrt(lo*hi);bad(m)?hi=m:lo=m;}return hi;};
  const blow=dur=>(g,p,isD)=>{const t1=0.3+p*T0,a=g*G0,o={A:A0,T:t1+0.55,from:0.2,ext:pulse(t1,dur,x=>({al:0,ax:a*x*ux,ay:a*x*uy})),extFine:tt=>tt>t1-0.005&&tt<t1+dur+0.03};return isD?DY.sim({mode:'phys',...o}):run(M4,o);};
  const twist=(dw,p,isD)=>{const dur=0.002,t1=0.3+p*T0,o={A:A0,T:t1+0.55,from:0.2,ext:pulse(t1,dur,x=>({al:dw*Math.PI/(2*dur)*x,ax:0,ay:0})),extFine:tt=>tt>t1-0.005&&tt<t1+dur+0.03};return isD?DY.sim({mode:'phys',...o}):run(M4,o);};
  const K4=[];
  for(const[nm,mk,lo,hi,unit]of[['a blow across the plate, 0.5 ms',blow(0.0005),5,400,'g'],['a blow across the plate, 3 ms',blow(0.003),5,400,'g'],['a twist about the staff, 2 ms',twist,1,80,'rad/s']]){
    const gF=find(mk,lo,hi,false),gD=find(mk,lo,hi,true);K4.push({name:nm,unit,frame:+f(gF,1),rigid:+f(gD,1)});
    say(`  ${nm.padEnd(34)} the frame as drawn: about ${f(gF,unit==='g'?0:1)} ${unit}; the rigid detent: ${f(gD,unit==='g'?0:1)} ${unit} (${sg(100*(gF/gD-1),0)} %)`);}
  const gS=DY.MPRE/(DY.DM.m*DY.rCM*G0);
  say(`a steady push lifts the rigid detent off its stop at ${f(gS,0)} g; the knocks a chronometer meets in its box at sea are a few g (the gimbals and the box's padding take the rest)`);
  chk(K4.every(k=>k.unit!=='g'||k.frame>20),`as drawn it takes a blow over 20 g across the plate to let a tooth go`);
  J.knocks={rows:K4,gS};}
flush();
J.time=(Date.now()-t0)/1000;
if(JOUT)fs.writeFileSync(JOUT,JSON.stringify(J));
if(fail)process.exitCode=1;
