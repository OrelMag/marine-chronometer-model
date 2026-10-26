// Would the train run, made on a CNC? The going train's four meshes worked tooth by tooth, on the outlines the model draws (core.js gearOutline: BS 978 Part 2's
// cycloidal teeth), what the escapement makes of them, and how closely the arbors' holes must be placed. Needs only Node.js:
//   node gearing.js             (about 30 s; exits with 1 if a mesh jams or loses contact at its drawn centres, or the swing leaves the manual's band there)
//   node gearing.js --quick     (the drawn centres only, no depthing windows: a few seconds)
//   node gearing.js --model wempe [--quick] [--write]   the Wempe's train (wempe_train.js: its four meshes on the page's own tables and tooth forms, its holes' places, its
//                               escapement and drive from escphys.js); its band 185-270° (wempe_escapement.js's: the sources' 225-270° less the damping's estimate, the
//                               model swinging 193° at 12 h (199.4° until the per-part audit), its floor 14° under it as 193° was under 207° and 200° under 214° until 15 October 2026), the pivots' shake each mesh's own; into gearing_wempe.json, with each mesh's mean torque ratio (about 2 min)
// For each stage the wheel (A) drives the pinion (B) at its centre distance m(z1+z2)/2 (tools/solve.py: the modules are the arbors' places'). A is turned through
// a pitch in small steps; at each, B is turned back against its load until its flank meets A's (B lags as far as the teeth allow, the outlines densified so the
// meeting is found to well under a micrometre). That gives where they touch, the line the force acts along (the touching outline's normal) and the slip, so
// the torque B receives against A's, with tooth friction mu (physics.js A6: 0.10-0.20, steel leaves on brass teeth run dry), and where B is caught by the next
// tooth after losing the last (the drop), the backlash, and how much of the action comes before the line of centres (engaging friction, the rough part).
// Then the train in time: the four stages' torque ratios multiplied as their arbors turn, the escape wheel's drive relative to the mean, the balance's swing
// following it as the escapement's own equation has it (shared/escapement.js: A² relaxes to ampAt(drive)² as exp(-2t/TF)), its rate (rateAt) and the time it
// gains and loses over a day. Last, each mesh's depthing window: how far its centres may be off before it jams (no backlash, a tip on the root) or the swing
// leaves the manual's 247.5-270° (Sec. IX) at some moment of the day, which gives the hole positions a CNC must hold (the two holes and the pivots' shake).
const WEMPE=(i=>i>=0&&process.argv[i+1]==='wempe')(process.argv.indexOf('--model')),WT=WEMPE?require('./wempe_train.js'):null;
const fs=require('fs'),path=require('path'),PH=WEMPE?null:require('./physics.js'),{build}=WEMPE?{}:require('./escapement.js');
const core=fs.readFileSync(path.join(__dirname,'..','js','core.js'),'utf8'),QUICK=process.argv.includes('--quick');
const TAU=2*Math.PI,D=Math.PI/180,f=(x,n=2)=>(+x).toFixed(n),rows=[];let fail=0;
const say=s=>rows.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;rows.push(`${ok?'  ok ':'  !! '} ${s}`);};
/* the model's own outline, with its curves sampled finer (the drawing's 24 points an addendum and 12 a tip are enough to see, not to mesh) */
let src=/function gearOutline\(n,m,o=\{\}\)\{[\s\S]*?\n  return\{xy,ro,ri\};\}/.exec(core);if(!src)throw Error('gearOutline not found in core.js');src=src[0];
for(const[a,b]of[['k<=24;k++){const t=0.6*k/24','k<=400;k++){const t=0.6*k/400'],['k<12;k++){const t=Math.PI*k/12','k<240;k++){const t=Math.PI*k/240']]){if(!src.includes(a))throw Error('gearOutline changed: '+a);src=src.split(a).join(b);}
const gearOutline=Function('TAU',src+';return gearOutline;')(TAU);

/* a gear as a star-shaped outline: R(a), the outline's radius at angle a (the outline runs round with its angle never falling: radial flanks are steps) */
function gear(z,m,mate,ha){const{xy,ro,ri}=WEMPE?WT.outline(z,m):gearOutline(z,m,z>20?{mate,ha}:{}),n=xy.length,ang=[],P=[];let off=0,prev=-Infinity;
  for(const[x,y]of xy){let a=Math.atan2(y,x)+off;while(a<prev-1e-9){off+=TAU;a+=TAU;}ang.push(a);P.push([x,y]);prev=a;}
  ang.push(ang[0]+TAU);P.push(P[0]);const a0=ang[0];
  const R=a=>{a=a0+((a-a0)%TAU+TAU)%TAU;let lo=0,hi=n;while(hi-lo>1){const md=(lo+hi)>>1;if(ang[md]<=a)lo=md;else hi=md;}
    while(lo<n&&ang[lo+1]-ang[lo]<1e-12)lo++;const[x0,y0]=P[lo],[x1,y1]=P[lo+1],c=Math.cos(a),s=Math.sin(a),den=c*(y1-y0)-s*(x1-x0);
    const t=den?-(c*y0-s*x0)/den:0;return Math.hypot(x0+t*(x1-x0),y0+t*(y1-y0));};
  /* points along the outline no more than m/150 apart, with their segment (for the normal) */
  const pts=[];for(let i=0;i<n;i++){const[x0,y0]=P[i],[x1,y1]=P[i+1],L=Math.hypot(x1-x0,y1-y0),k=Math.max(1,Math.ceil(L/(m/150)));for(let j=0;j<k;j++){const t=j/k;pts.push([x0+t*(x1-x0),y0+t*(y1-y0),i]);}}
  return{z,m,ro,ri,R,P,pts,p:TAU/z};}

/* a mesh: A (wheel) at the origin turning +, B (pinion) at (d, 0) turning -. phase(al): B's angle as A drives it under load, contact, normal */
function mesh(A,B,d){const k=A.z/B.z,a0=-0.375*A.p,b0=Math.PI-0.875*B.p;
  /* the points that can reach the other gear, sorted by their angle, so a window about the line of centres is two binary searches */
  const near=(G,rO)=>{const q=G.pts.filter(([x,y])=>Math.hypot(x,y)>d-rO-1e-3).map(p=>[p[0],p[1],p[2],(Math.atan2(p[1],p[0])+TAU)%TAU]).sort((a,b)=>a[3]-b[3]);return{q,a:q.map(p=>p[3])};},nearA=near(A,B.ro),nearB=near(B,A.ro);
  const bs=(a,x)=>{let lo=0,hi=a.length;while(lo<hi){const md=(lo+hi)>>1;if(a[md]<x)lo=md+1;else hi=md;}return lo;};
  const win=(N,th,dir,W)=>{const c=((dir-th)%TAU+TAU)%TAU,lo=c-W,hi=c+W,o=[];const take=(x0,x1)=>{for(let i=bs(N.a,x0),e=bs(N.a,x1);i<e;i++)o.push(N.q[i]);};
    if(lo<0){take(lo+TAU,TAU);take(0,hi);}else if(hi>TAU){take(lo,TAU);take(0,hi-TAU);}else take(lo,hi);return o;};
  /* the deepest point of either outline inside the other: [depth, which, point (world), its index] */
  const pen=(al,be,full)=>{let best=[-Infinity];const cA=Math.cos(al),sA=Math.sin(al),cB=Math.cos(be),sB=Math.sin(be);
    const pa=win(nearA,al,0,1.6*A.p),pb=win(nearB,be,Math.PI,1.6*B.p);
    for(const q of pa){const X=cA*q[0]-sA*q[1],Y=sA*q[0]+cA*q[1],u=X-d,v=Y,r=Math.hypot(u,v),a=Math.atan2(v,u)-be,dp=B.R(a)-r;if(dp>best[0])best=[dp,'A',[X,Y],q];}
    for(const q of pb){const X=cB*q[0]-sB*q[1]+d,Y=sB*q[0]+cB*q[1],r=Math.hypot(X,Y),a=Math.atan2(Y,X)-al,dp=A.R(a)-r;if(dp>best[0])best=[dp,'B',[X,Y],q];}
    return best;};
  const TOL=2e-7,ok=(al,e)=>pen(al,b0-k*(al-a0)+e)[0]<TOL;
  /* B as far back as it goes: from a guess, step to the edge, then halve */
  const lag=(al,g,it=24)=>{const h=B.p/400;let lo=g,hi;if(ok(al,lo)){hi=lo+h;let n=0;while(ok(al,hi)){lo=hi;hi+=h;if(++n>800)return null;}}
    else{hi=lo;lo-=h;let n=0;while(!ok(al,lo)){hi=lo;lo-=h;if(++n>800)return null;}}
    for(let i=0;i<it;i++){const md=(lo+hi)/2;ok(al,md)?lo=md:hi=md;}return lo;};
  const back=(al,e)=>{const h=B.p/100;let x=e-h,n=0;while(ok(al,x)){x-=h;if(++n>200)return Infinity;}let lo=x,hi=x+h;for(let i=0;i<20;i++){const md=(lo+hi)/2;ok(al,md)?hi=md:lo=md;}return e-hi;};   /* backlash, B's angle */
  /* the contact's normal: the segment of the other outline nearest the deepest point (its direction steps about 0.01 rad from one segment to the next,
     which shows as a zigzag of about 0.003 in the torque ratio from one step to the next: the sampling, not the teeth) */
  const normal=(al,be,w,Pt)=>{const G=w==='A'?B:A,th=w==='A'?be:al,ox=w==='A'?d:0,c=Math.cos(-th),s=Math.sin(-th),x=c*(Pt[0]-ox)-s*Pt[1],y=s*(Pt[0]-ox)+c*Pt[1];let bd=Infinity,bi=0;
    for(let i=0;i<G.P.length-1;i++){const[x0,y0]=G.P[i],[x1,y1]=G.P[i+1],dx=x1-x0,dy=y1-y0,L2=dx*dx+dy*dy;if(!L2)continue;const t=Math.max(0,Math.min(1,((x-x0)*dx+(y-y0)*dy)/L2)),dd=Math.hypot(x-x0-t*dx,y-y0-t*dy);
      if(dd<bd){bd=dd;bi=i;}}
    const[x0,y0]=G.P[bi],[x1,y1]=G.P[bi+1],nl=Math.hypot(x1-x0,y1-y0),bn=[(y1-y0)/nl,-(x1-x0)/nl];
    const C=Math.cos(th),S=Math.sin(th);return[C*bn[0]-S*bn[1],S*bn[0]+C*bn[1]];};   /* outward, world */
  return{k,a0,b0,lag,back,pen,normal,d};}

/* a stage through one pitch of A: the torque ratio (B's over A's, against the nominal zB/zA) at each step for each mu, drop, backlash, approach */
const MU=[0,0.10,0.20],NS0=120;
function stage(zA,zB,m,dd=0,NS=NS0,haB){const A=gear(zA,m,zB),B=gear(zB,m,undefined,haB),d=m*(zA+zB)/2+dd,M=mesh(A,B,d),out={al:[],fac:MU.map(()=>[]),approach:0,drop:0,bl:Infinity,jam:false,phi:0,tip:Math.min(d-A.ro-B.ri,d-B.ro-A.ri)};
  if(out.tip<=0){out.jam=true;return out;}
  let e=0,prev=null;const span=A.p,start=M.a0-span/2;
  /* go round once first, so the step at the pitch's start is caught from the tooth before */
  for(let pass=0;pass<2;pass++)for(let i=0;i<=NS;i++){const al=start+span*i/NS,ee=M.lag(al,e,pass?24:10);if(ee===null){out.jam=true;return out;}
    if(pass===0){e=ee;continue;}
    if(prev!==null&&ee-prev>M.k*span/NS*1.5+1e-6)out.drop=Math.max(out.drop,(ee-prev)/M.k/A.p);   /* B fell back to the next tooth: A ran free that far (a fraction of its pitch) */
    prev=ee;e=ee;const be=M.b0-M.k*(al-M.a0)+ee,pp=M.pen(al,be+1e-9),[,w,Pt]=pp,n=M.normal(al,be,w,Pt),nB=w==='A'?[-n[0],-n[1]]:n;
    if(i<NS){out.approach+=(Pt[1]<0?1:0)/NS;out.phi+=Math.atan2(Math.abs(nB[0]),Math.abs(nB[1]))/NS;}   /* the pressure angle: the force's lean off the tangent (the line of centres along x) */
    if(i%10===0)out.bl=Math.min(out.bl,M.back(al,ee));
    const vA=[-Pt[1],Pt[0]],vB=[M.k*Pt[1],-M.k*(Pt[0]-d)],vr=[vA[0]-vB[0],vA[1]-vB[1]],vn=vr[0]*nB[0]+vr[1]*nB[1],t=[vr[0]-vn*nB[0],vr[1]-vn*nB[1]],tl=Math.hypot(...t)||1;
    out.al.push(al);MU.forEach((mu,j)=>{const F=[nB[0]+mu*t[0]/tl,nB[1]+mu*t[1]/tl],tB=(Pt[0]-d)*F[1]-Pt[1]*F[0],tA=-(Pt[0]*F[1]-Pt[1]*F[0]);out.fac[j].push((tB/tA)*M.k);});}
  if(!Number.isFinite(out.bl)||out.bl<=0)out.jam=true;
  out.blmm=out.bl*m*zB/2;return out;}
const st=(a)=>{const n=a.length,mn=Math.min(...a),mx=Math.max(...a),mean=a.reduce((s,x)=>s+x,0)/n;return{mn,mx,mean};};
const STG=WEMPE?WT.STG.map(s=>s.slice(0,5)):(()=>{const T=PH.TRAIN,M=PH.MODS;return[['fusee wheel → centre pinion',T.fu,T.cp,M.fusee,90/14*3600],['centre wheel → third pinion',T.cw,T.tp,M.centre,3600],['third wheel → fourth pinion',T.tw,T.fp,M.third,3600/(T.cw/T.tp)],['fourth wheel → escape pinion',T.fw,T.ep,M.fourth,60]];})();   /* name, teeth, leaves, module, seconds a turn of the wheel */
/* the drawn centres against m (z1 + z2) / 2 (the Hamilton's are, by tools/solve.py's modules; the Wempe's are its holes'), the swing's band and its name */
const D0=WEMPE?WT.D0:[0,0,0,0],BAND=WEMPE?[180,270]:[247.5,270],BN=WEMPE?'the band\'s 180-270°':'the manual\'s 247.5-270°';   /* the Wempe's: wempe_escapement.js's guard, 14° under its reference swing (185 until 19 October 2026's physics pass) */
let base=null;   /* the drawn meshes, set below (or by a caller through setBase) */
const ESC=WEMPE?WT.ESC:build().ESC,TF=ESC.settings.TF,A1=ESC.A,AMIN=ESC.AMIN;
/* the Wempe's escapement solves a swing slowly (its impulse ends past where the swing first releases: makeEsc's slow start), so its swing and rate are tabled for the day's
   steps, linear between (the swing every 0.005 of the drive, the rate every 2° and 0.05; off the table, solved): the Hamilton's are called as they are */
const lut=(fn,x0,x1,n)=>{const v=[];for(let i=0;i<=n;i++)v.push(fn(x0+(x1-x0)*i/n));return x=>{const u=(x-x0)/(x1-x0)*n;if(!(u>=0&&u<=n))return fn(x);const i=Math.min(n-1,Math.floor(u)),t=u-i;return v[i]*(1-t)+v[i+1]*t;};};
const AMP=WEMPE?lut(s=>ESC.ampAt(s),0.5,1.5,200):ESC.ampAt,RATE=WEMPE?(()=>{const rows=[];for(let j=0;j<=20;j++){const s=0.5+j*0.05;rows.push(lut(a=>ESC.rateAt(a,s),150*D,300*D,75));}
  return(a,s)=>{const u=(s-0.5)/0.05;if(!(u>=0&&u<=20))return ESC.rateAt(a,s);const j=Math.min(19,Math.floor(u)),t=u-j;return rows[j](a)*(1-t)+rows[j+1](a)*t;};})():ESC.rateAt;
const interp=(s,j,al)=>{const n=s.al.length-1,u=((al-s.al[0])/(s.al[n]-s.al[0])%1+1)%1*n,i=Math.floor(u),t=u-i;return s.fac[j][i]*(1-t)+s.fac[j][Math.min(n,i+1)]*t;};
/* a day of the train (or `hours`), every stage's wheel at its own speed; stages[] may replace one stage; returns the swing's range and the time's wander (and with trace, the swing every trace seconds: [hours, degrees]) */
function day(stages,j,hours=24,ph=[0.13,0.57,0.31,0.89],means=base.map(s=>st(s.fac[j]).mean),trace=0){
  /* the swing stepped every 0.1 s; the rate taken each second at the swing and the second's mean drive; the wander against the mean rate, which the navigator finds.
     means: what each stage's ratio is taken against (the drawn mesh's mean: the set-up as drawn; or the stage's own: the set-up restoring the mean swing) */
  const dt=0.1,N=Math.round(hours*3600/dt),R=[],tr=[];let A2=null,amin=Infinity,amax=-Infinity,aS=0,aN=0,sS=0,nS=0;
  for(let i=0;i<N;i++){const t=i*dt;let s=1;stages.forEach((S,k)=>{s*=interp(S,j,TAU*(t/STG[k][4]+ph[k]))/means[k];});
    const aT=AMP(s);if(A2===null)A2=aT*aT;A2+=(aT*aT-A2)*(1-Math.exp(-2*dt/TF));const a=Math.sqrt(A2);if(trace&&i%Math.round(trace/dt)===0)tr.push([+(t/3600).toFixed(4),+(a/D).toFixed(3)]);
    if(t>4*TF){amin=Math.min(amin,a);amax=Math.max(amax,a);aS+=a;aN++;sS+=s;nS++;if(nS===10){R.push(RATE(a,sS/nS));sS=0;nS=0;}}}
  const mr=R.reduce((q,x)=>q+x,0)/R.length;let err=0,emin=0,emax=0;for(const r of R){err+=(r-mr)/86400;emin=Math.min(emin,err);emax=Math.max(emax,err);}
  return{amin:amin/D,amax:amax/D,amean:aS/aN/D,wander:emax-emin,rate:mr,tr};}
module.exports={gear,mesh,stage,st,MU,STG,day,ESC,setBase:b=>{base=b;}};if(require.main!==module)return;

/* ---------- 1. each mesh at its drawn centres ---------- */
say('1. Each mesh at its drawn centres (the model\'s cycloidal outlines; the wheel drives, the pinion lags under load); torque ratio against the nominal, at mu 0 / 0.10 / 0.20');
base=STG.map(([nm,zA,zB,m],k)=>{const s=stage(zA,zB,m,D0[k]);if(s.jam){chk(false,`${nm}: jams at its drawn centres`);return s;}
  const S=s.fac.map(st);
  chk(!s.jam&&S[2].mn>0.5,`${nm} (${zA}:${zB}, m ${m}): ${S.map(x=>`${f(x.mn,3)}-${f(x.mx,3)}`).join(' / ')} (mean ${S.map(x=>f(x.mean,3)).join(' / ')}); ${f(100*s.approach,0)} % of the action before the line of centres; drop ${f(100*s.drop,1)} % of a pitch; backlash ${f(s.blmm*1000,0)} µm; tip clearance ${f(s.tip*1000,0)} µm`);
  return s;});
if(fail){console.log(rows.join('\n'));process.exit(1);}

/* ---------- 2. the train in time: the escape wheel's drive, the swing, the rate ---------- */
say('');say('2. The train in time: the four stages\' ratios as their wheels turn (the centre once an hour), the escape wheel\'s drive against its mean, the balance\'s swing following');
say(`   it as the escapement's equation has it (A² towards ampAt(drive)², TF ${TF} s), its rate (rateAt) and the time it gains and loses over a day against its mean rate`);
const DAY=QUICK?6:24;
for(const j of[1,2]){const r=day(base,j,DAY);
  chk(r.amin>=BAND[0]&&r.amax<=BAND[1],`mu ${MU[j]}: the swing ${f(r.amin,1)}-${f(r.amax,1)}° over ${DAY} h (${BN}; the drive's dips are each a few minutes at most, and the balance takes ${f(TF/2,0)} s to follow), the time wanders ${f(r.wander*1e6,0)} µs about the mean rate`);}
say('   the teeth change the drive within the hour, the same every day, so a navigator\'s daily rate takes it in: what matters is that the swing stays in the band');

/* ---------- 3. the depthing windows, and the holes a CNC must hold ---------- */
const OUT=path.join(__dirname,WEMPE?'gearing_wempe.json':'gearing.json');
if(!QUICK){say('');say(`3. Each mesh's depthing window: its centres moved (the others as drawn) until it jams; or its friction takes the day's mean swing out of ${BAND[0]}-${BAND[1]}°`);
  say('   with the set-up as drawn; or, the set-up raised or lowered to restore the mean (Op. 13), its teeth\'s ripple takes the swing out of the band at some moment (mu 0.10 and 0.20)');
  const win=[];
  for(let k=0;k<4;k++){const[nm,zA,zB,m]=STG[k],okAt=dd=>{const s=stage(zA,zB,m,D0[k]+dd,60);if(s.jam)return'it jams';for(const j of[1,2]){const st2=base.slice();st2[k]=s;const h=Math.min(24,4*STG[k][4]/zA/3600+1),r=day(st2,j,h);
      if(!(r.amean>=BAND[0]&&r.amean<=BAND[1]))return`the mean swing ${f(r.amean,1)}° (mu ${MU[j]})`;
      const own=base.map(b=>st(b.fac[j]).mean);own[k]=st(s.fac[j]).mean;const q=day(st2,j,h,undefined,own);if(!(q.amin>=BAND[0]&&q.amax<=BAND[1]))return`the swing ${f(q.amin,1)}-${f(q.amax,1)}° (mu ${MU[j]}, the mean restored)`;}return'';};
    /* bisect from the drawn centres (which pass) to the search's end (0.3 m closer, 1 m wider: the teeth then engage 0.7 m, little left for a knock; the Wempe's 0.8 m closer, its tips
       standing well clear of the roots), to a micrometre */
    const edge=sg=>{let lo=0,hi=(sg<0?(WEMPE?0.8:0.3):1.0)*m,why=okAt(sg*hi);if(!why)return[sg*hi,'passes to the end of the search'];while(hi-lo>0.001){const md=(lo+hi)/2,w=okAt(sg*md);if(w){hi=md;why=w;}else lo=md;}return[sg*lo,why];};
    const[lo,wl]=edge(-1),[hi,wh]=edge(1);win.push({stage:nm,lo,hi,phi:+(base[k].phi*180/Math.PI).toFixed(2)});
    say(`  ${nm}: ${f(lo*1000,0)} to +${f(hi*1000,0)} µm about its drawn centres (closer: ${wl}; wider: ${wh})`);}
  /* a CNC's hole positions: each of the mesh's two arbors has two holes (plate and bridge), each off by up to tp in any direction, and its pivots' shake s;
     the centres come closer or part by at most 2 tp + s (the arbors' two ends moving alike, the worst case). Aimed at the drawn centres (BS 978's depth), the closer side
     (the wheel's tips on the pinion's root) sets it: tp = (-lo - s) / 2. Aiming wider would give more room, but the teeth would engage less deeply, leaving less for
     wear, the pivots' shake and knocks, so the drawn centres are kept */
  const SH=0.010;   /* pivots' shake in their holes: about 0.005-0.01 mm, a jewelled hole's 1-2 % of its pivot (estimated) */
  win.forEach((w,k)=>{w.tp=(Math.min(-w.lo,w.hi)-(WEMPE?WT.SH[k]:SH))/2;if(WEMPE)w.sh=WT.SH[k];});
  const worst=win.reduce((a,b)=>a.tp<b.tp?a:b),tp=worst.tp;
  chk(tp>=0.005,`aimed at the drawn centres, the holes must sit within ±${f(tp*1000,0)} µm of their places (the ${worst.stage.split(' →')[0]}'s mesh, its tip clearance less the pivots' ${f((WEMPE?worst.sh:SH)*1000,0)} µm shake): ${tp>=0.02?'a hobby CNC holds it':tp>=0.01?'a good CNC holds it with the holes bored, not drilled, and checked on a measuring machine or with gauge pins':'a jig borer\'s work, or the depthing set by hand as watchmakers do (a depthing tool, then the bushes or jewels moved)'}`);
  say(`  every mesh tolerates far more wide than close (the wide side's limit is the ripple, or the search's end at 1 m): a hole that errs should err wide`);
  const J=WEMPE?{note:'tools/gearing.js --model wempe: the Wempe\'s meshes, each one\'s depthing window about its drawn centres (mm), the hole position tolerance (mm) aimed at them, its pivots\' shake (sh, mm), its mean pressure angle (deg, frictionless contact) and its mean torque ratio against the nominal at mu 0, 0.10, 0.20 (eff: the mesh\'s efficiency); read by wempe_physics.js',
      stages:win.map((w,k)=>({...w,eff:base[k].fac.map(a=>+st(a).mean.toFixed(5))}))}:{note:'tools/gearing.js: each mesh\'s depthing window about its drawn centres (mm), the hole position tolerance (mm) aimed at the drawn centres, and its mean pressure angle (deg, frictionless contact); read by thermal.js and fea.py',SH,stages:win};
  if(process.argv.includes('--write'))fs.writeFileSync(OUT,JSON.stringify(J,null,1)+'\n');
  else if(!fs.existsSync(OUT)||JSON.stringify(JSON.parse(fs.readFileSync(OUT,'utf8')).stages.map(w=>[w.lo,w.hi].map(x=>Math.round(x*1e4))))!==JSON.stringify(win.map(w=>[w.lo,w.hi].map(x=>Math.round(x*1e4)))))chk(false,'tools/gearing.json is not what this finds: run node gearing.js --write');}

console.log(rows.join('\n'));process.exit(fail);
