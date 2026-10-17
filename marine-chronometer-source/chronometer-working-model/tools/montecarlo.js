// The whole movement made to a maker's tolerances at once (errorbudget.js does the escapement's own settings, gearing.js one mesh at a time): each made movement
// draws every tolerance together and is judged on everything the checks above say it must do. Drawn (normal, the tolerance its 95 % band; estimated where said):
//   the arbors' holes: each hole's place off by up to ±13 µm in each direction (gearing.js: a CNC boring them), so each mesh's centre distance moves;
//   each mesh's tooth friction: μ 0.10-0.20 (physics.js A6), its torque ratio gearing.js's at that μ;
//   the mainspring's strip ±0.005 mm (estimated), its torque as the thickness cubed; the detent spring's and the trip spring's ±0.005 mm (estimated);
//   the sustaining spring's band, made to the drawn section (sustaining.js: banked it pushes SPU of the drive), its width and height ±0.02 mm (estimated);
//   the winding pawls' springs set on the bench to twice what ratchets.js finds they need, ±0.05 mm, and the sustaining pawl's wire's 0.12 ±0.04 rad.
// Each is then judged: the train turns (every mesh inside its depthing window: gearing.json), the balance swings (the escapement adjusted to the manual's
// figures, as errorbudget.js's adjuster leaves it: ESC.atK at the drive and the springs' stiffness), the swing in the manual's 1⅜-1½ turns as made and after
// the mainspring's set-up is turned to bring it back (Op. 13), the maintaining work drives the train five minutes, the winding pawls follow the fusee down when
// the key lets go (ratchets.js's need). Then the bench's tests (bench.js, by bench.json's own figures) applied to each as a maker would: the depths (a mesh
// closer than its window less the pivots' shake re-bushed on the drawn centre, benchcheck.py), the pawls' springs (one under its least set, or a wire that doesn't
// press its pawl in, bent back to the aim), the swing (out of the band, the set-up turned, Op. 13), the maintaining work (timed; nothing on the bench re-makes
// the sustaining spring). As made, every fault counts; after the bench, what its adjustments leave. Which tolerance spoils most, by each one alone. Node.js only:
//   node montecarlo.js [--n 2000] [--json OUT]   (about 30 s; exits 1 if under 95 % of movements work after the bench's adjustments, or one fails for a
//   reason no bench test catches: bench.json's figures short of what the analyses need)
const fs=require('fs'),PH=require('./physics.js'),{build}=require('./escapement.js'),GJ=require('./gearing.json'),SU=require('./sustaining.js'),RA=require('./ratchets.js'),MJ=require('./mechanisms.json');
const ESC=build().ESC,D=180/Math.PI,f=(x,n=1)=>(+x).toFixed(n),rows=[],out={};let fail=0;const say=s=>rows.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;rows.push(`${ok?'  ok ':'  !! '} ${s}`);};
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?+process.argv[i+1]:d;},N=arg('--n',2000);
let seed=20261013;const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
const gauss=()=>{let u=0;while(!u)u=rnd();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*rnd());},N2=tol=>gauss()*tol/1.96;
/* the arbors' places (plan, mm) and the meshes between them, fusee wheel to escape; a hole's error in each direction, the plate's and the bridge's averaged (the
   arbor stands between them), so the centre distance's error is the two arbors' errors along their line */
const L=MJ.L,AR=['Fu','C','T','F','E'],HT=0.013,u=(a,b)=>{const d=[L[b][0]-L[a][0],L[b][1]-L[a][1]],l=Math.hypot(...d);return[d[0]/l,d[1]/l];},UV=[0,1,2,3].map(i=>u(AR[i],AR[i+1]));
/* each mesh's torque ratio against μ (gearing.js's means at the drawn centres: 0, 0.10, 0.20), interpolated */
const ETA=[[1,0.981,0.963],[1,0.980,0.961],[1,0.977,0.955],[1,0.976,0.954]],eta=(i,mu)=>mu<=0.1?ETA[i][0]+(ETA[i][1]-ETA[i][0])*mu/0.1:ETA[i][1]+(ETA[i][2]-ETA[i][1])*(mu-0.1)/0.1;
const etaN=[0,1,2,3].reduce((p,i)=>p*eta(i,0.15),1);   /* the model's drive is calibrated with the train as it is: μ 0.15 taken as the model's */
const t0={ms:PH.MS.t,det:0.079,trip:0.060},TOL={ms:0.005,det:0.005,trip:0.005,band:0.02,set:0.05,wire:0.04};
const ss=SU.spring,kNeed=SU.spring.kt,WP=RA.pawls.filter(p=>/winding/.test(p.name)),SP=RA.pawls.find(p=>/sustaining/.test(p.name));
/* the bench's figures (bench.js --write): each test's limit, judged as a maker judges the made movement */
const BC=require('./bench.json').criteria,BAND=[247.5,270],inB=(A,b=BAND)=>A>=b[0]&&A<=b[1],T5=300;   /* the manual's 1⅜-1½ turns (Sec. II, IX) and five minutes (Sec. IV) */
const TF=ESC.settings.TF,FPH=PH.TRAIN.cp/PH.TRAIN.fu*2*Math.PI/3600;
/* the sustaining spring, banked (or, were it made stronger than the drive, closed only as far as the drive takes it), pushes k c0 and less as the train opens it; the
   swing follows with TF: the time it keeps the chronometer running (sustaining.js's reading of the manual's five to ten minutes since 17 October 2026; the time
   over a turn until then), for a stiffness */
const runFor=k=>{let A=ESC.ampAt(1),t=0;const T0=PH.Tf,c0=Math.min(T0/k,ss.SMAX);while(t<3600){const Dd=Math.max(0,k*(c0-FPH*t)/T0),Ae=Dd>0?ESC.ampAt(Dd):0;A=Math.sqrt(Ae*Ae+(A*A-Ae*Ae)*Math.exp(-2*2/TF));if(A<ESC.AMIN)return t;t+=2;}return 3600;};
const RUN={};const runK=k=>{const q=Math.round(Math.log(k)*100);return RUN[q]??(RUN[q]=runFor(Math.exp(q/100)));};   /* by 1 % of stiffness */
const one=(only)=>{const use=k=>!only||only===k,o={};
  /* the meshes' centres: each arbor's holes off by e; a mesh jams outside its depthing window */
  const e=AR.map(()=>use('holes')?[N2(HT),N2(HT)]:[0,0]),dds=()=>[0,1,2,3].map(i=>(e[i+1][0]-e[i][0])*UV[i][0]+(e[i+1][1]-e[i][1])*UV[i][1]),jams=d=>d.some((x,i)=>x<GJ.stages[i].lo||x>GJ.stages[i].hi);
  o.dd=dds();o.jam=jams(o.dd);
  /* the bench's depths test (benchcheck.py): a mesh closer than its window's close side less the pivots' shake, or wide past the window, is caught; a close one is
     re-bushed, the hole further down the train bored again on the drawn centre (to the same tolerance) until the pair passes */
  const close=d=>d.map((x,i)=>x<BC.depths.windows[i][0]+BC.depths.shake),bad=d=>close(d).map((c,i)=>c||d[i]>BC.depths.windows[i][1]);o.cDepth=bad(o.dd).some(x=>x);
  for(let n=0;n<20;n++){const j=close(dds()).indexOf(true);if(j<0)break;e[j+1]=[N2(HT),N2(HT)];}
  o.jam1=jams(dds());
  /* the drive at the escape wheel: the mainspring's strip, the meshes' friction */
  const tms=t0.ms+(use('mainspring')?N2(TOL.ms):0),mu=[0,1,2,3].map(()=>use('friction')?0.10+0.10*rnd():0.15),eta4=mu.reduce((p,m,i)=>p*eta(i,m),1);
  const s=(tms/t0.ms)**3*eta4/etaN,kd=((t0.det+(use('detent')?N2(TOL.det):0))/t0.det)**3,kp=((t0.trip+(use('trip')?N2(TOL.trip):0))/t0.trip)**3;
  const r=ESC.atK(s,kd,kp);o.A=r.A*D;o.runs=!o.jam&&o.A>ESC.AMIN*D;o.band=o.runs&&inB(o.A);
  /* the set-up turned to bring the swing back (Op. 13): the drive restored to the model's, the springs' stiffness left as made */
  const r2=ESC.atK(1,kd,kp);o.A2=r2.A*D;o.band2=!o.jam1&&o.A2>ESC.AMIN*D&&inB(o.A2);
  /* the bench's swing test (and the mainspring's): out of its band, the set-up is turned; in it, left alone */
  o.cSetup=!o.jam1&&!inB(o.A,BC.swing);o.Aa=o.cSetup?o.A2:o.A;o.band1=!o.jam1&&o.Aa>ESC.AMIN*D&&inB(o.Aa);o.cSwing=o.jam1||o.Aa<=ESC.AMIN*D||!inB(o.Aa,BC.swing);
  /* the maintaining work: timed on the bench (Sec. IV's five to ten minutes); short, it is caught, but no adjustment there re-makes the spring */
  const kS=kNeed*(1+(use('sustaining')?N2(TOL.band)/ss.H:0))*(1+(use('sustaining')?N2(TOL.band)/ss.SSW:0))**3;o.tS=runK(kS);o.sust=o.tS>=T5;o.cMaint=o.tS<60*BC.maintaining[0];
  /* the two winding pawls' springs, each set to the bench's aim (twice the larger need), and the sustaining pawl's wire: as made each must meet its own need
     (ratchets.js); the bench's pawls test catches a spring under its least set or a wire that doesn't press its pawl in, and bends it back to the aim */
  const sets=WP.map(()=>BC.pawls.aim+(use('pawls')?N2(TOL.set):0));let wire=BC.pawls.wire[1]+(use('pawls')?N2(TOL.wire):0);
  const need=(sp,w)=>sp.every((x,i)=>x>=WP[i].set)&&w>SP.wireNeed;o.pawls=need(sets,wire);
  o.nSprings=sets.filter(x=>x<BC.pawls.set).length+(wire<=BC.pawls.wire[0]?1:0);o.cPawls=o.nSprings>0;
  for(let i=0;i<sets.length;i++)while(sets[i]<BC.pawls.set)sets[i]=BC.pawls.aim+N2(TOL.set);while(wire<=BC.pawls.wire[0])wire=BC.pawls.wire[1]+N2(TOL.wire);
  o.pawls1=need(sets,wire);
  o.worksAsMade=o.runs&&o.band&&o.sust&&o.pawls;o.works=!o.jam1&&o.band1&&o.sust&&o.pawls1;
  /* a fault left after the bench that none of its tests catches: the bench's figures short of what the analyses need */
  o.unc=[o.jam1&&!bad(dds()).some(x=>x)&&'the train jams',!o.band1&&!o.cSwing&&'the swing',!o.sust&&!o.cMaint&&'the maintaining work',!o.pawls1&&'the pawls'].filter(x=>x);
  return o;};
const all=[...Array(N)].map(()=>one()),frac=(a,k)=>a.filter(x=>x[k]).length/a.length,cnt=(a,fn)=>a.filter(fn).length,pc=x=>f(100*x,1)+' %';
say(`${N} movements, each tolerance drawn at once (holes ±${HT*1000} µm, μ 0.10-0.20, the mainspring's strip ±${TOL.ms}, the detent and trip springs ±${TOL.det}, the sustaining spring's band ±${TOL.band}, the winding pawls' springs' set ${f(BC.pawls.aim,2)}±${TOL.set} mm and the sustaining pawl's wire ${BC.pawls.wire[1]}±${TOL.wire} rad (the bench's aims): estimated where the sources give none)`);
say(`the train turns: ${pc(1-frac(all,'jam'))}; the balance swings: ${pc(frac(all,'runs'))}`);
const As=all.filter(x=>x.runs).map(x=>x.A).sort((a,b)=>a-b),pq=p=>As[Math.floor(p*(As.length-1))];
say(`its swing as made ${f(pq(0.05))}-${f(pq(0.95))}° (5-95 %): in the manual's band ${pc(frac(all,'band'))}; with the set-up turned to bring the drive back (Op. 13) ${pc(frac(all,'band2'))}`);
say(`the maintaining work drives the train five minutes: ${pc(frac(all,'sust'))}; the winding pawls follow the fusee when the key lets go and the sustaining pawl's wire presses it in (each spring's own need, ratchets.js: ${WP.map(p=>f(p.set,3)).join(' and ')} mm, the wire ${f(SP.wireNeed,2)} rad): ${pc(frac(all,'pawls'))}`);
const W=frac(all,'works'),W0=frac(all,'worksAsMade');
say(`as made, everything: ${pc(W0)}`);
/* what each bench test catches, what its adjustment mends */
const B={depths:{caught:cnt(all,x=>x.cDepth),jam:cnt(all,x=>x.jam),left:cnt(all,x=>x.jam1)},
  pawls:{caught:cnt(all,x=>x.cPawls),springs:all.reduce((a,x)=>a+x.nSprings,0),wouldFail:cnt(all,x=>x.cPawls&&!x.pawls),left:cnt(all,x=>!x.pawls1)},
  setup:{caught:cnt(all,x=>x.cSetup),mended:cnt(all,x=>x.cSetup&&x.band1)},maint:{caught:cnt(all,x=>x.cMaint)},swing:{caught:cnt(all,x=>x.cSwing)}};
say(`the bench's tests: the depths catch ${B.depths.caught} (${B.depths.jam} would jam), re-bushed: ${B.depths.left} left jammed; the pawls' springs catch ${B.pawls.caught} movements (${B.pawls.springs} springs under the least set, ${B.pawls.wouldFail} of the movements failing their need as made), bent back to the aim: ${B.pawls.left} left short`);
say(`the swing out of the band in ${B.setup.caught}, the set-up turned (Op. 13): ${B.setup.mended} brought into it; still out after it ${B.swing.caught}; the maintaining work under five minutes ${B.maint.caught} (caught, nothing on the bench mends it)`);
const unc=all.filter(x=>!x.works&&x.unc.length),why={};for(const x of unc)for(const k of x.unc)why[k]=(why[k]||0)+1;
chk(W>=0.95,`works, after all the bench's adjustments (the escapement set to the manual's figures, the depths re-bushed, the pawls' springs re-set, the set-up turned): ${pc(W)}; as made ${pc(W0)}`);
chk(!unc.length,unc.length?`${unc.length} fail for a reason no bench test catches (${Object.entries(why).map(([k,v])=>`${k} ${v}`).join(', ')}): bench.json's figures fall short of the analyses' (run node bench.js --write)`:`every movement that still fails (${cnt(all,x=>!x.works)}) is caught by a bench test: none leaves the bench unknown`);
/* which tolerance spoils most: each alone */
const ONLY=['holes','friction','mainspring','detent','trip','sustaining','pawls'],alone={};
for(const k of ONLY){const a=[...Array(Math.round(N/4))].map(()=>one(k));alone[k]={works:frac(a,'works'),asMade:frac(a,'worksAsMade'),band:frac(a,'band')};}
say(`each tolerance alone (as made / after adjusting): ${ONLY.map(k=>`${k} ${pc(alone[k].asMade)} / ${pc(alone[k].works)}`).join('; ')}`);
const worst=ONLY.slice().sort((a,b)=>alone[a].asMade-alone[b].asMade)[0];
say(alone[worst].asMade<1-0.002?`the one that spoils most as made: ${worst} (${pc(1-alone[worst].asMade)} of movements alone)`:`no tolerance alone takes a movement out; together the drive's spread (the mainspring's strip and the meshes' friction, ${f(100*(1-frac(all,'band')),1)} % out of the band) does, and the set-up's turn brings it back`);
out.worst=worst;
out.N=N;out.frac={jam:frac(all,'jam'),runs:frac(all,'runs'),band:frac(all,'band'),band2:frac(all,'band2'),sust:frac(all,'sust'),pawls:frac(all,'pawls'),works:W,asMade:W0};out.after={turns:1-frac(all,'jam1'),runs:cnt(all,x=>!x.jam1&&x.Aa>ESC.AMIN*D)/N,band:frac(all,'band1'),sust:frac(all,'sust'),pawls:frac(all,'pawls1')};B.any=cnt(all,x=>x.cDepth||x.cPawls||x.cSetup||x.cMaint||x.cSwing);out.bench=B;out.uncaught=unc.length;out.failAfter=cnt(all,x=>!x.works);
out.need={set:WP.map(p=>p.set),wire:SP.wireNeed,benchSet:BC.pawls.set,aim:BC.pawls.aim};out.alone=alone;out.swing=[pq(0.05),pq(0.5),pq(0.95)];
out.hist=(()=>{const b={};for(const a of As){const k=Math.floor(a/2.5)*2.5;b[k]=(b[k]||0)+1;}return Object.entries(b).map(([k,v])=>[+k,v]).sort((x,y)=>x[0]-y[0]);})();
out.rows=rows;module.exports=out;
if(require.main===module){console.log(rows.join('\n'));const jo=process.argv.indexOf('--json');if(jo>0)fs.writeFileSync(process.argv[jo+1],JSON.stringify(out));process.exitCode=fail;}
