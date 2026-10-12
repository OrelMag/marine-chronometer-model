// The hairspring checked by another method. hairspring.js solves the designed spring at large swings as an inextensible elastica by shooting (HSPR.large);
// this solves the same path (HSPR.path, as hairspring.js designs it) as a chain of co-rotational beam elements (Crisfield, Non-linear Finite Element
// Analysis of Solids and Structures, vol. 1, ch. 7: each element straight between its nodes, axial and bending stiffness, the tangent consistent), the stud's
// end clamped and the collet's end turned about the staff with its heading, in steps of 2.5° to 300° each way, each step to equilibrium by Newton's method
// (the stiffness block-tridiagonal: one 3 x 3 block a node). The strip is extensible here (the Elinvar strip's section: hairspring.js, 0.221 mm thick), the
// shooting's is not, so the two agree only as far as the physics does. Needs only Node.js:
//   node hairspring-fe.js     (about 20 s, hairspring.js's design included; exits with 1 if the couple, the force on the pivots or the rate they give part from
//                             the elastica's by more than a test's tolerance: a few in 10⁵ of the couple, the rate to 0.01 s a day)
const {HSPR}=require('../../shared/hairspring.js'),H=require('./hairspring.js');
const D=Math.PI/180,f=(x,n=3)=>(+x).toFixed(n),rows=[];let fail=0;
const say=s=>rows.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;rows.push(`${ok?'  ok ':'  !! '} ${s}`);};
const t=0.221,EI=1,EA=12/(t*t);   /* EI taken 1, as HSPR.large; EA / EI = 12 / t² for a rectangular strip (mm⁻²) */

/* the nodes: every other point of the designed path (about 0.3 mm apart) */
const P=H.P.pts.filter((_,i,a)=>i%2===0||i===a.length-1).map(p=>[p[0],p[1]]),N=P.length,L0=[],B0=[];
for(let i=0;i<N-1;i++){const dx=P[i+1][0]-P[i][0],dy=P[i+1][1]-P[i][1];L0.push(Math.hypot(dx,dy));B0.push(Math.atan2(dy,dx));}
const Ltot=L0.reduce((a,b)=>a+b,0),wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));

/* one element's internal force (6) and tangent (6 x 6) at the nodes' current state u = [x, y, θ] each */
function elem(i,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy),c=dx/l,s=dy/l,be=Math.atan2(dy,dx),db=wrap(be-B0[i]),L=L0[i];
  const t1=wrap(a[2]-db),t2=wrap(b[2]-db),Nf=EA*(l-L)/L,M1=EI/L*(4*t1+2*t2),M2=EI/L*(2*t1+4*t2);
  const r=[-c,-s,0,c,s,0],z=[s,-c,0,-s,c,0],b1=[-s/l,c/l,1,s/l,-c/l,0],b2=[-s/l,c/l,0,s/l,-c/l,1];
  const F=r.map((x,k)=>x*Nf+b1[k]*M1+b2[k]*M2),K=[];
  for(let p=0;p<6;p++){K.push([]);for(let q=0;q<6;q++)K[p][q]=EA/L*r[p]*r[q]+EI/L*(4*b1[p]*b1[q]+2*b1[p]*b2[q]+2*b2[p]*b1[q]+4*b2[p]*b2[q])+Nf/l*z[p]*z[q]+(M1+M2)/(l*l)*(r[p]*z[q]+z[p]*r[q]);}
  return{F,K};}
/* 3 x 3 helpers */
const inv3=m=>{const[a,b,c]=m[0],[d,e,g]=m[1],[h,k,l]=m[2],A=e*l-g*k,B=-(d*l-g*h),C=d*k-e*h,det=a*A+b*B+c*C;return[[A,-(b*l-c*k),b*g-c*e],[B,a*l-c*h,-(a*g-c*d)],[C,-(a*k-b*h),a*e-b*d]].map(r=>r.map(x=>x/det));};
const mm=(A,B)=>A.map(r=>[0,1,2].map(j=>r[0]*B[0][j]+r[1]*B[1][j]+r[2]*B[2][j])),mv=(A,v)=>A.map(r=>r[0]*v[0]+r[1]*v[1]+r[2]*v[2]),tr=A=>[0,1,2].map(i=>A.map(r=>r[i]));

/* the state: nodes' places and turns; node 0 (the collet's end) set by θ, node N-1 (the stud's) held. Newton on nodes 1..N-2 */
let U=P.map(p=>[p[0],p[1],0]);
const S=[0];for(let i=0;i<N-1;i++)S.push(S[i]+L0[i]);
/* the predictor: from the last state, each node turned about the staff by dθ (1 - s/L), as linear theory winds a Phillips spring */
function predict(dth){for(let i=0;i<N-1;i++){const w=dth*(1-S[i]/Ltot),c=Math.cos(w),s=Math.sin(w),[x,y,r]=U[i];U[i]=[c*x-s*y,s*x+c*y,r+w];}}
let thNow=0;
/* to θ from the last equilibrium, the step halved until Newton converges */
function stepTo(th,depth=0){const keep=U.map(u=>u.slice()),t0=thNow;predict(th-t0);const q=equilibrium(th);if(q.R){thNow=th;return q;}
  U=keep;if(depth>6)return q;const mid=(t0+th)/2,a=stepTo(mid,depth+1);if(!a.R)return a;return stepTo(th,depth+1);}
function equilibrium(th){const c=Math.cos(th),s=Math.sin(th);U[0]=[c*P[0][0]-s*P[0][1],s*P[0][0]+c*P[0][1],th];let res=Infinity,it=0;
  for(;it<30;it++){const Dg=U.map(()=>[[0,0,0],[0,0,0],[0,0,0]]),Up=U.map(()=>[[0,0,0],[0,0,0],[0,0,0]]),R=U.map(()=>[0,0,0]);
    for(let i=0;i<N-1;i++){const{F,K}=elem(i,U[i],U[i+1]);for(let p=0;p<3;p++){R[i][p]+=F[p];R[i+1][p]+=F[p+3];for(let q=0;q<3;q++){Dg[i][p][q]+=K[p][q];Dg[i+1][p][q]+=K[p+3][q+3];Up[i][p][q]+=K[p][q+3];}}}
    res=0;for(let i=1;i<N-1;i++)res=Math.max(res,...R[i].map(Math.abs));if(res<1e-9*Math.max(1,Math.abs(R[0][2])))return{R,it,res};if(!(res<1e6))return{R:null,it,res};
    /* block Thomas: Dg[i] du[i] + Up[i] du[i+1] + Up[i-1]ᵀ du[i-1] = -R[i] */
    const Cm=[],dv=[];for(let i=1;i<N-1;i++){let Di=Dg[i],ri=R[i].map(x=>-x);if(i>1){const Lt=tr(Up[i-1]),G=mm(Lt,Cm[i-2]);Di=Di.map((r,p)=>r.map((x,q)=>x-G[p][q]));const g=mv(Lt,dv[i-2]);ri=ri.map((x,p)=>x-g[p]);}
      const Ii=inv3(Di);Cm.push(mm(Ii,Up[i]));dv.push(mv(Ii,ri));}
    const du=[];du[N-3]=dv[N-3];for(let k=N-4;k>=0;k--){const g=mv(Cm[k],du[k+1]);du[k]=dv[k].map((x,p)=>x-g[p]);}
    for(let i=1;i<N-1;i++)for(let p=0;p<3;p++)U[i][p]+=du[i-1][p];}
  return{R:null,it,res};}
/* the couple that holds the collet's end at θ, about the staff, and the force on it: the reaction at node 0 */
const out=[];for(const sg of[1,-1]){U=P.map(p=>[p[0],p[1],0]);thNow=0;for(let a=0;a<=300;a+=2.5){const th=sg*a*D,q=stepTo(th);if(!q.R){chk(false,`no equilibrium at ${sg*a}° (residual ${q.res.toExponential(1)})`);break;}
    const[fx,fy,m]=q.R[0],[x0,y0]=U[0];if(a%5===0&&!(sg<0&&a===0))out.push({th,T:m+x0*fy-y0*fx,F:Math.hypot(fx,fy),it:q.it});}}
out.sort((a,b)=>a.th-b.th);if(fail){console.log(rows.join('\n'));process.exit(1);}
const sh=H.big,at=(A,a)=>A.find(q=>Math.abs(q.th-a*D)<1e-9),k0=1/Ltot;
say(`the designed spring (${H.P.L.toFixed(1)} mm) as ${N-1} co-rotational beam elements (${(Ltot/(N-1)).toFixed(2)} mm each), the strip ${t} mm thick (EA/EI ${EA.toFixed(0)} mm⁻²); Newton took ${Math.max(...out.map(q=>q.it))} iterations at most a step`);
const own=(A,a)=>at(A,a).T/a/(at(A,5).T/5),dT=Math.max(...[90,180,270,-270].map(a=>Math.abs(own(out,a)/own(sh,a)-1))),off=at(out,90).T/at(sh,90).T-1;   /* each against its own stiffness at 5°: the curve's shape */
say(`the couple over θ EI / L, the elements: ${[90,180,270,-270].map(a=>`${a}° ${f(at(out,a).T/(a*D*k0),6)}`).join(', ')}; the elastica: ${[90,180,270,-270].map(a=>`${f(at(sh,a).T/(a*D*k0),6)}`).join(', ')}`);
chk(dT<2e-5,`the couple's departure from linear, each against its own stiffness at 5°: the two agree to ${dT.toExponential(1)}; their stiffnesses differ by ${off.toExponential(1)}, the chords' ${f(Ltot,1)} mm against the curve's ${f(H.P.L,1)} (0.3 mm chords on a coil of r 3-5)`);
const fr=a=>at(out,a).F*H.R/Math.abs(at(out,a).T),fs=a=>at(sh,a).F*H.R/Math.abs(at(sh,a).T);
say(`the force on the pivots, × R / couple, the elements: ${[90,180,270].map(a=>`${a}° ${fr(a).toExponential(1)}`).join(', ')}; the elastica: ${[90,180,270].map(a=>fs(a).toExponential(1)).join(', ')}`);
chk(Math.abs(fr(270)-fs(270))<1e-3&&fr(270)<5e-3,`at 270° the spring leaves ${fr(270).toExponential(1)} of couple / R on the pivots (the elastica ${fs(270).toExponential(1)}): its pull on the balance is all but a pure couple, as Phillips' curves mean it to be`);
const th=out.map(q=>q.th),Ts=out.map(q=>q.T),rate=a=>86400*(1/HSPR.period(th,Ts,a*D).ratio-1),r=[247.5,255,270].map(rate),rs=[H.rates.r1,H.rates.r0,H.rates.r2],dr=Math.max(...r.map((x,i)=>Math.abs(x-rs[i])));
chk(dr<0.01,`the rate against small swings: 247.5° ${f(r[0])}, 255° ${f(r[1])}, 270° ${f(r[2])} s a day (the elastica ${rs.map(x=>f(x)).join(', ')}): the spring's own isochronism, ${f(r[2]-r[0],2)} s a day over the manual's band, agrees to ${dr.toExponential(1)}`);
say('what neither method holds: the strip\'s own mass (about a hundredth of the balance\'s inertia, which the timing takes up), its coils touching (they stand apart in the helix), and the elastic coefficient\'s change with temperature, which is measured');
console.log(rows.join('\n'));process.exit(fail);
