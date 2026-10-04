// The hairspring designed (HSPR in ../../shared/hairspring.js), from the model's measured coil and ends (movement.js). Needs only Node.js:
//   node hairspring.js          (about 3 s; exits with 1 if a designed curve misses Phillips' conditions or leaves a force on the pivots)
// 1. The stiffness the balance needs, k = I (2π/T)², T 0.5 s, with I Table II's (invariants.py checks it), and the strip's thickness from it, k = E b t³ / 12 L,
//    at the width measured on the restoration video (KLUwI2UUCMQ 6:49.5, side-on: the ribbon's height at the coil's edge, 9-11 px of 45 px/mm, and its
//    share of the 0.56 mm pitch down the stack, 0.38-0.50) and published moduli (Elinvar-type alloys 165-195 GPa, spring steel 207); the stress at the swing.
// 2. Hamilton's patent US 2,379,780: "a change in length of five one-hundred-thousandths of an inch in the usual chronometer hairspring will cause a change
//    of rate of one-tenth second per day": the length that implies (the rate goes as L^-1/2), against the designed spring's.
// 3. The outer terminal curve, from the coil to the stud's clamp (HS_R from the staff, along the stud's bar into the clamp), solved to Phillips' conditions;
//    the inner one, to the collet's face (HS_RI, running along it), and the end radius at which a short inner curve exists.
// 4. The check that matters: the force the spring leaves on the pivots under a couple (HSPR.lateral), for the designed ends and for the ends the model draws.
const fs=require('fs'),path=require('path'),{HSPR}=require('../../shared/hairspring.js');
const src=fs.readFileSync(path.join(__dirname,'..','js','movement.js'),'utf8'),num=re=>{const m=re.exec(src);if(!m)throw Error('not found in movement.js: '+re);return+m[1];};
const D=Math.PI/180,R=num(/HS_RC=([\d.]+)/),N=num(/HS_N=(\d+)/),RI=num(/HS_RI=([\d.]+)/);
/* the stud's clamp, in the frame of SPD (the staff toward the cock's screw) as movement.js lays it: the inner pin SPH(2.08,-3.28), the small pin SPH(8.51,-6.11),
   the clamp SP_CL inside the inner pin along their line */
const hc=/SPHc=SPH\(([-\d.]+),([-\d.]+)\)/.exec(src),ha=/SPHa=SPH\(([-\d.]+),([-\d.]+)\)/.exec(src),SP_CL=num(/SP_CL=([\d.]+)/),SP_ST=num(/SP_ST=([\d.]+)/),pc=[+hc[1],+hc[2]],pa=[+ha[1],+ha[2]],
  ul=Math.hypot(pa[0]-pc[0],pa[1]-pc[1]),u=[(pa[0]-pc[0])/ul,(pa[1]-pc[1])/ul],cl=[pc[0]-SP_CL*u[0],pc[1]-SP_CL*u[1]],RS=Math.hypot(...cl),
  bar=Math.atan2(cl[0]*u[1]-cl[1]*u[0],cl[0]*u[0]+cl[1]*u[1]),
  st=[pc[0]-SP_ST*u[0],pc[1]-SP_ST*u[1]],stL=[(st[0]*cl[0]+st[1]*cl[1])/RS,(cl[0]*st[1]-cl[1]*st[0])/RS];   /* where the clamp takes the spring, at its step, in the spring's frame (x toward the wedge pin's radius) */   /* the bar's angle from the clamp's radius, in the spring's own frame (counterclockwise seen as springGeo draws it) */
const rows=[];let fail=0;const say=s=>rows.push(s),chk=(ok,s)=>{if(!ok)fail=1;say(`${ok?'  ok ':'  !! '} ${s}`);};
/* 1. the stiffness and the strip */
const I=578.5,k=I*1e-9*(4*Math.PI)**2,A=255*D;
say(`  the coil: r ${R}, ${N} turns; the stud's clamp ${RS.toFixed(2)} from the staff, the bar ${(bar/D).toFixed(1)}° off its radius; the collet's face ${RI.toFixed(2)}`);
say(`  the stiffness the balance needs: I ${I} g·mm² (Table II), k = I (4π)² = ${(k*1e6).toFixed(1)} µN·m a radian`);
/* 3 before 2: the curves give the length */
const outer=HSPR.design(R,1,stL,bar+Math.PI,1.2),outerOut=HSPR.design(R,1,stL,bar,1.2);   /* the bar at +bar from the clamp's radius: in toward its end is bar + π */
chk(!!outer&&outer.res<1e-7,`the outer curve, from the coil to the clamp's step (${Math.hypot(...stL).toFixed(2)} from the staff), along the bar toward its end: ${outer?`${outer.l.toFixed(2)} mm, turning ${((outer.pts[outer.pts.length-1][2]-outer.pts[0][2])/D).toFixed(0)}°, r ${Math.min(...outer.pts.map(p=>Math.hypot(p[0],p[1]))).toFixed(2)}-${R}, Phillips' conditions to ${outer.res.toExponential(1)} mm`:'none'}`);
say(`       along the bar the other way, out toward the wedge pin: ${outerOut?`${outerOut.l.toFixed(2)} mm`:'no curve meets the conditions inside the coil'}`);
const innerAt=re=>{let b=null;for(const span of[0.4,0.6,0.8,1,1.2,1.4,1.6,1.8,2,2.2])for(let a0=-3;a0<=3;a0+=0.25){const s=HSPR.solve(R,-1,[re,0],-Math.PI/2,[Math.PI*span+a0*0.3,Math.PI*span*(R+re)/2,0,0,0]);
  if(!s||s.res>1e-7)continue;const rr=s.pts.map(p=>Math.hypot(p[0],p[1]));if(Math.min(...rr)<re-0.06||Math.max(...rr)>R+0.2)continue;if(!b||s.l<b.l)b=s;}return b;};
const inner=innerAt(RI);
chk(!!inner,`the inner curve, from the coil to the collet's face along it: ${inner?`${inner.l.toFixed(1)} mm, turning ${(-(inner.pts[inner.pts.length-1][2]-inner.pts[0][2])/D).toFixed(0)}° (the shortest that meets the conditions and keeps off the collet)`:'none'}`);
say(`       the shortest inner curve by where its end is held: ${[3.0,3.3,RI].map(re=>{const c=innerAt(re);return`r ${re.toFixed(2)}: ${c?c.l.toFixed(0)+' mm, '+(-(c.pts[c.pts.length-1][2]-c.pts[0][2])/D).toFixed(0)+'°':'none'}`;}).join('; ')}`);
/* the designed spring, and 2: the length, the strip, the patent */
if(outer&&inner){const P=HSPR.path(R,inner,outer,N),L=P.L;
  say(`  the designed spring: ${L.toFixed(1)} mm long, ${P.turns.toFixed(2)} turns in all`);
  for(const[name,E,b]of[['Elinvar-type, 180 GPa',180,0.23],['  at 165 GPa, b 0.28',165,0.28],['  at 195 GPa, b 0.20',195,0.20],['spring steel, 207 GPa',207,0.23]]){const s=HSPR.section(k,L,b,E);
    say(`       ${name.padEnd(24)} b ${b.toFixed(2)} mm: t ${s.t.toFixed(3)} mm, ${(b/s.t).toFixed(2)} b/t, bending stress at 255° ${s.stress(A).toFixed(0)} MPa`);}
  const Lp=25.4*5e-5/(2*0.1/86400);say(`       the patent's "usual chronometer hairspring": L = ΔL / (2 Δrate) = ${Lp.toFixed(0)} mm, against ${L.toFixed(0)} here (${(100*(L/Lp-1)).toFixed(0)} %); 1 µm of length is ${(1e-3/L/2*86400).toFixed(3)} s a day`);
  /* 4. the force on the pivots */
  const lat=pts=>HSPR.lateral(pts,R).ratio,ramp=(r0,r1,a0,a1,n)=>[...Array(n+1)].map((_,i)=>{const f=i/n,a=a0+(a1-a0)*f,r=r0+(r1-r0)*Math.sin(f*Math.PI/2);return[r*Math.cos(a),r*Math.sin(a)];}),
    body=(a0,a1,n)=>[...Array(n)].map((_,i)=>{const a=a0+(a1-a0)*(i+1)/n;return[R*Math.cos(a),R*Math.sin(a)];});
  const ae=Math.PI+2*Math.PI*(N-1),old=[...ramp(RI,R,0,Math.PI,200),...body(Math.PI,ae,96*(N-1)),...[...Array(201)].map((_,i)=>{const f=i/200,a=ae+Math.PI*f,r=R-(R-RS)*(1-Math.cos(f*Math.PI/2));return[r*Math.cos(a),r*Math.sin(a)];}).slice(1)];
  let a1=outer.a;while(a1<Math.PI)a1+=2*Math.PI;while((a1-Math.PI)/(2*Math.PI)<N-1.5)a1+=2*Math.PI;const half=[...ramp(RI,R,0,Math.PI,200),...body(Math.PI,a1,96*(N-1)),...outer.pts.slice(1).map(p=>[p[0],p[1]])];
  const fd=lat(P.pts);chk(fd<1e-3,`the force on the pivots under a couple, as a share of couple / R: both ends designed ${fd.toExponential(1)}; the outer designed, the inner as drawn ${lat(half).toFixed(3)}; both as drawn (springGeo's ramps) ${lat(old).toFixed(3)}`);}
console.log(rows.join('\n'));if(fail)process.exitCode=1;
