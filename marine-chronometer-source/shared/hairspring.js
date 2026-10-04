// @ts-check
/* hairspring.js: the Model 21's hairspring designed, not drawn by eye: the strip's section from the stiffness the balance needs, and terminal curves that meet
   Phillips' conditions, so that the spring's pull on the balance is a pure couple, with no force on the pivots, at any angle. Shared by the working model
   (js/movement.js builds the spring from it) and its check (chronometer-working-model/tools/hairspring.js, Node.js). Nothing is declared at the top level but HSPR.

   Sources (named in the model README): E. Phillips, "Mémoire sur le spiral réglant des chronomètres et des montres" (Annales des Mines, 1861), the conditions;
   small-deflection beam theory (Castigliano's theorem) for the check; the strip's moduli from published ranges for Elinvar-type alloys and spring steel.
   The Model 21's coil (radius, turns, height), its ends' places (the collet's face, the stud's clamp) and the strip's width are measured (movement.js, README).

   Plan coordinates, mm: the balance staff at the origin, angles counterclockwise; the spring runs from the collet (its inner end) round the coil
   counterclockwise to the stud (its outer end). A terminal curve is solved from its junction with the coil, where it leaves the coil's circle along it,
   to its fixed end: its curvature κ(s) = κ0 + c1 s + c2 s² + c3 s³ (κ0 the coil's, so the curvature runs on), and five conditions: its end's place (2) and
   heading (1), and Phillips' (2): its centroid G on the perpendicular through the staff to the radius at the junction, at R²/l from the staff, on the
   side the curve goes. Five unknowns: the junction's angle, the length l, c1, c2, c3. With both curves so, the spring's centroid stays on the staff as the
   coil winds and unwinds, and under a couple at the collet both ends turn about the staff with no force between them and the pivots. */
/** @typedef {{a:number,l:number,c:number[],pts:number[][],res:number,G:number[]}} Curve  a terminal curve: the junction's angle, its length, curvature's
    coefficients, points [x, y, heading, s] from the junction to the fixed end, and the largest residual of its five conditions */
const HSPR=(()=>{
  /* integrate the curve from the junction: start on the circle r R at angle a, heading σ along it (σ 1: counterclockwise), curvature σ/R + c1 s + c2 s² + c3 s³ */
  function run(R,a,l,c,sig,n=400){const pts=[];let x=R*Math.cos(a),y=R*Math.sin(a),h=a+sig*Math.PI/2,gx=0,gy=0;const ds=l/n,k=s=>sig/R+c[0]*s+c[1]*s*s+c[2]*s*s*s;
    pts.push([x,y,h,0]);
    for(let i=0;i<n;i++){const s0=i*ds,k1=k(s0),k2=k(s0+ds/2),k3=k(s0+ds);   /* heading by Simpson, place by the midpoint heading (second order) */
      const hm=h+ds/2*(k1+k2)/2,h1=h+ds*(k1+4*k2+k3)/6,xm=x+ds/2*Math.cos((h+hm)/2),ym=y+ds/2*Math.sin((h+hm)/2),x1=xm+ds/2*Math.cos((hm+h1)/2),y1=ym+ds/2*Math.sin((hm+h1)/2);
      gx+=ds*(x+4*xm+x1)/6;gy+=ds*(y+4*ym+y1)/6;x=x1;y=y1;h=h1;pts.push([x,y,h,s0+ds]);}
    return{pts,G:[gx/l,gy/l],end:[x,y,h]};}
  const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
  /** the five conditions' residuals (mm, and radians × R for the heading) of a trial curve */
  function resid(R,sig,P,hP,v){const[a,l,c1,c2,c3]=v;if(l<=0.5)return[1e3,1e3,1e3,1e3,1e3];const r=run(R,a,l,[c1,c2,c3],sig),h0=a+sig*Math.PI/2,g=R*R/l;
    return[r.end[0]-P[0],r.end[1]-P[1],R*wrap(r.end[2]-hP),r.G[0]-g*Math.cos(h0),r.G[1]-g*Math.sin(h0)];}
  /** solve a terminal curve: the coil's radius R, σ the direction it runs from the junction (1 counterclockwise: the outer curve; -1: the inner, traced
      back from its junction to the collet), its fixed end P [x, y] and the heading hP (rad) it arrives at P with, from a first guess v0 [a, l, c1, c2, c3]
      (Newton's method with a numerical Jacobian, the step halved until the residual falls) */
  function solve(R,sig,P,hP,v0){let v=v0.slice(),f=resid(R,sig,P,hP,v),n2=f.reduce((q,x)=>q+x*x,0);
    for(let it=0;it<80&&n2>1e-22;it++){const J=[],e=[1e-6,1e-6,1e-7,1e-8,1e-9];
      for(let j=0;j<5;j++){const w=v.slice();w[j]+=e[j];const g=resid(R,sig,P,hP,w);J.push(g.map((x,i)=>(x-f[i])/e[j]));}
      const A=[...Array(5)].map((_,i)=>[...J.map(col=>col[i]),-f[i]]);   /* rows: conditions; columns: unknowns, then the right-hand side */
      for(let i=0;i<5;i++){let p=i;for(let r=i+1;r<5;r++)if(Math.abs(A[r][i])>Math.abs(A[p][i]))p=r;[A[i],A[p]]=[A[p],A[i]];if(Math.abs(A[i][i])<1e-14)return null;
        for(let r=0;r<5;r++)if(r!==i){const m=A[r][i]/A[i][i];for(let q=i;q<6;q++)A[r][q]-=m*A[i][q];}}
      const d=A.map((row,i)=>row[5]/row[i]);let t=1,ok=false;
      for(let k=0;k<30;k++){const w=v.map((x,i)=>x+t*d[i]),g=resid(R,sig,P,hP,w),m2=g.reduce((q,x)=>q+x*x,0);if(m2<n2){v=w;f=g;n2=m2;ok=true;break;}t/=2;}
      if(!ok)break;}
    const r=run(R,v[0],v[1],v.slice(2),sig,800);return{a:v[0],l:v[1],c:v.slice(2),pts:r.pts,G:r.G,res:Math.sqrt(Math.max(...f.map(x=>x*x)))};}
  /** the best of several first guesses: converged (residual under 1e-7 mm), staying between the staff's ri and the coil's R + 0.2, and the smoothest
      (least ∫κ′² ds); ri keeps it off the collet and the staff */
  function design(R,sig,P,hP,ri){let best=null;
    for(const span of[0.6,0.9,1.2,1.5,1.8])for(const a0 of[-2.5,-2,-1.5,-1,-0.5,0,0.5,1,1.5,2,2.5,3]){
      const aP=Math.atan2(P[1],P[0]),a=aP-sig*(Math.PI*span)+a0*0.3,l=Math.PI*span*(R+Math.hypot(...P))/2,s=solve(R,sig,P,hP,[a,l,0,0,0]);
      if(!s||s.res>1e-7)continue;const rr=s.pts.map(p=>Math.hypot(p[0],p[1]));if(Math.min(...rr)<ri||Math.max(...rr)>R+0.2)continue;
      let sm=0;for(let i=0;i<=40;i++){const q=s.l*i/40,d=s.c[0]+2*s.c[1]*q+3*s.c[2]*q*q;sm+=d*d*s.l/41;}   /* ∫κ′² ds */
      if(!best||sm<best.sm)best={...s,sm};}
    return best;}
  /** the whole spring's path in plan, from the collet's end to the stud's: the inner curve (traced from the collet), the coil counterclockwise, the outer curve;
      [x, y, s] every ds or less, and the junctions' arc lengths. nT: the coil's turns between the junctions are rounded so the whole has nTot turns */
  function path(R,inner,outer,nTot){const out=[],add=(x,y)=>{const p=out[out.length-1],s=p?p[2]+Math.hypot(x-p[0],y-p[1]):0;out.push([x,y,s]);};
    for(const p of inner.pts.slice().reverse())add(p[0],p[1]);const s1=out[out.length-1][2];
    const a0=inner.a,a1t=outer.a,turnsCurves=(Math.abs(wrap(inner.pts[inner.pts.length-1][2]-inner.pts[0][2]))+Math.abs(wrap(outer.pts[outer.pts.length-1][2]-outer.pts[0][2])))/(2*Math.PI);
    let a1=a1t;while(a1<=a0)a1+=2*Math.PI;while((a1-a0)/(2*Math.PI)+turnsCurves<nTot-0.5)a1+=2*Math.PI;
    const nb=Math.ceil((a1-a0)/(2*Math.PI)*96);for(let i=1;i<=nb;i++){const a=a0+(a1-a0)*i/nb;add(R*Math.cos(a),R*Math.sin(a));}const s2=out[out.length-1][2];
    for(const p of outer.pts.slice(1))add(p[0],p[1]);
    return{pts:out,s1,s2,L:out[out.length-1][2],turns:(a1-a0)/(2*Math.PI)+turnsCurves};}
  /** the check: a couple at the collet, the stud held, the collet's end made to turn δ about the staff as the balance's would. Castigliano's theorem on the
      path as a slender beam (small deflections, one EI throughout) gives the force and couple the collet's end needs; returns the force × R over the couple:
      0 for a spring whose pull on the balance is a pure couple (Phillips' aim), about 1 for a spring with plain ends */
  function lateral(pts,R){const C=pts[0];let K=[[0,0,0],[0,0,0],[0,0,0]];
    for(let i=1;i<pts.length;i++){const[x0,y0]=pts[i-1],[x1,y1]=pts[i],ds=Math.hypot(x1-x0,y1-y0),x=(x0+x1)/2,y=(y0+y1)/2,a=[1,-(C[1]-y),C[0]-x];
      for(let p=0;p<3;p++)for(let q=0;q<3;q++)K[p][q]+=a[p]*a[q]*ds;}
    const D=[1,-C[1],C[0]],inv=m=>{const[a,b,c]=m[0],[d,e,f]=m[1],[g,h,k]=m[2],A=e*k-f*h,B=-(d*k-f*g),Cc=d*h-e*g,det=a*A+b*B+c*Cc;
      return[[A,-(b*k-c*h),b*f-c*e],[B,a*k-c*g,-(a*f-c*d)],[Cc,-(a*h-b*g),a*e-b*d]].map(r=>r.map(x=>x/det));},Ki=inv(K),q=Ki.map(r=>r[0]*D[0]+r[1]*D[1]+r[2]*D[2]);
    return{ratio:Math.hypot(q[1],q[2])*R/Math.abs(q[0]),M:q[0],F:[q[1],q[2]]};}
  /** the strip's section: thickness t (radial, mm) for stiffness k (N·m a radian) over length L (mm) at width b (axial, mm) and modulus E (GPa),
      k = E b t³ / 12 L; and the bending stress (MPa) at a swing of A radians */
  function section(k,L,b,E){const t=Math.cbrt(12*k*(L/1000)/(E*1e9*b/1000))*1000;return{t,stress:A=>6*k*A/((b/1000)*(t/1000)**2)/1e6};}
  /** the spring at large swings: the path as an inextensible strip (a planar elastica, one EI, taken 1) with its drawn curvature unstressed, the stud's end
      clamped, the collet's end turned th (rad) about the staff with its heading; the end loads (couple m0, force F at the collet's end) found by Newton's
      method so the strip arrives at the stud as it was. Returns per angle: U the strain energy, T the couple that holds the balance there against the spring
      (about the staff), F the force on the pivots (both × EI); T from the end loads and dU/dθ agree (virtual work), a check of the solution. ths: the angles, from 0 out each way */
  function large(pts,ths){const n=pts.length-1,ds=[],h0=[];for(let i=0;i<n;i++){const dx=pts[i+1][0]-pts[i][0],dy=pts[i+1][1]-pts[i][1];ds.push(Math.hypot(dx,dy));h0.push(Math.atan2(dy,dx));}
    const dh=[0];for(let i=1;i<n;i++)dh.push(wrap(h0[i]-h0[i-1]));const P0=pts[0],PN=pts[n];
    /* integrate from the collet's end: heading of segment i = h0[0] + θ + Σ drawn turns + Σ m ds (the moment at each node from the end's loads) */
    function shoot(th,v){const[m0,fx,fy]=v,c=Math.cos(th),s=Math.sin(th),x0=c*P0[0]-s*P0[1],y0=s*P0[0]+c*P0[1];let x=x0,y=y0,h=h0[0]+th,U=0;
      for(let i=0;i<n;i++){const L=i?(ds[i-1]+ds[i])/2:ds[0]/2,m=m0+(x0-x)*fy-(y0-y)*fx;if(i)h+=dh[i];h+=m*L;U+=m*m*L/2;x+=ds[i]*Math.cos(h);y+=ds[i]*Math.sin(h);}
      const m=m0+(x0-x)*fy-(y0-y)*fx,Ln=ds[n-1]/2;h+=m*Ln;U+=m*m*Ln/2;
      return{f:[x-PN[0],y-PN[1],wrap(h-h0[n-1])],U,x0,y0};}
    function at(th,v){let r=shoot(th,v);
      for(let it=0;it<40;it++){const e2=r.f.reduce((q,x)=>q+x*x,0);if(e2<1e-26)break;const J=[];
        for(let j=0;j<3;j++){const w=v.slice(),e=1e-7*Math.max(1,Math.abs(v[j]));w[j]+=e;const g=shoot(th,w).f;J.push(g.map((x,i)=>(x-r.f[i])/e));}
        const A=[0,1,2].map(i=>[J[0][i],J[1][i],J[2][i],-r.f[i]]);for(let i=0;i<3;i++){let p=i;for(let q=i+1;q<3;q++)if(Math.abs(A[q][i])>Math.abs(A[p][i]))p=q;[A[i],A[p]]=[A[p],A[i]];
          for(let q=0;q<3;q++)if(q!==i){const k=A[q][i]/A[i][i];for(let c=i;c<4;c++)A[q][c]-=k*A[i][c];}}
        const d=A.map((row,i)=>row[3]/row[i]);let t=1;for(let k=0;k<20;k++){const w=v.map((x,i)=>x+t*d[i]),g=shoot(th,w);if(g.f.reduce((q,x)=>q+x*x,0)<e2){v=w;r=g;break;}t/=2;}}
      const[m0,fx,fy]=v;return{v,th,U:r.U,T:-(m0+r.x0*fy-r.y0*fx),F:Math.hypot(fx,fy),res:Math.sqrt(r.f.reduce((q,x)=>q+x*x,0))};}
    const out=[];for(const sg of[1,-1]){let v=[0,0,0];for(const th of ths.filter(t=>sg>0?t>=0:t<0).sort((a,b)=>sg*(a-b))){const q=at(th,v);v=q.v;out.push(q);}}
    return out.sort((a,b)=>a.th-b.th);}
  /** the balance's period under a couple T(θ) (sampled, rising through 0 at θ 0) against its period at small swings, at amplitude A (rad) one way: the
      energy's turning points either side, the time over the swing by the substitution θ = mid + half·sin u (no singularity at the ends) */
  function period(ths,Ts,A){const i0=ths.findIndex(t=>t===0),k0=(Ts[i0+1]-Ts[i0-1])/(ths[i0+1]-ths[i0-1]),Ug=ths.map(()=>0);   /* U on the grid: T piecewise linear, integrated exactly from θ 0 */
    for(let i=i0+1;i<ths.length;i++){const h=ths[i]-ths[i-1];Ug[i]=Ug[i-1]+h*(Ts[i]+Ts[i-1])/2;}for(let i=i0-1;i>=0;i--){const h=ths[i]-ths[i+1];Ug[i]=Ug[i+1]+h*(Ts[i]+Ts[i+1])/2;}
    const U=th=>{let i=0;while(i<ths.length-2&&ths[i+1]<th)i++;const d=th-ths[i],g=(Ts[i+1]-Ts[i])/(ths[i+1]-ths[i]);return Ug[i]+Ts[i]*d+g*d*d/2;},E=U(A);
    let lo=-A*1.2,hi=0;for(let k=0;k<60;k++){const m=(lo+hi)/2;if(U(m)>E)lo=m;else hi=m;}const B=(lo+hi)/2,mid=(A+B)/2,half=(A-B)/2;
    let t=0;const N=2000;for(let j=0;j<N;j++){const u=-Math.PI/2+Math.PI*(j+0.5)/N,th=mid+half*Math.sin(u),d=E-U(th);t+=d>0?half*Math.cos(u)*Math.PI/N/Math.sqrt(2*d):0;}
    return{ratio:2*t/(2*Math.PI/Math.sqrt(k0)),back:B};}
  return{run,solve,design,path,lateral,section,large,period};
})();
if(typeof module!=='undefined')module.exports={HSPR};
