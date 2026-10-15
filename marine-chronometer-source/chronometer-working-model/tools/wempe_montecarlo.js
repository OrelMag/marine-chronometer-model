// The whole Wempe made to a maker's tolerances at once: montecarlo.js's method for the Wempe (Node.js, no browser). Each made movement draws every tolerance together and is
// judged on what the Wempe's analyses say it must do, as made and after the bench's tests (wempe_bench.js, by bench_wempe.json's own figures) as a maker applies them.
// The tolerances, drawn where the sheets give them (uniform within their limits: a part made to the drawing and inspected), estimated where they don't (normal, the
// figure its 95 % band), each named:
//   the arbors' holes: the hole tables (05 09 01, 05 08 02-1) give the places to 0.001 mm and no tolerance: ±13 µm each way (estimated: a CNC boring them, the Hamilton's);
//   endshake, every term of each arbor's stack from its sheet (bench_wempe.json: the pillars 19.6 ±0.01, their seats 0.3 +0.03, the bushes', the arbors' lengths), the
//     top plate, the jewel's depth, the escape arbor's endstones, the fusee bush and the barrel's bearings estimated;
//   the mainspring's strip 0.37 ±0.005 (estimated), the drive as its thickness cubed; each mesh's tooth friction μ 0.10-0.20 (gearing_wempe.json's torque ratios);
//   the detent's spring 0.07 ±0.005 and the gold spring 0.15 ±0.005 (estimated), their stiffness as the thickness cubed;
//   the depth of lock: the wheel's tips Ø 14 +0.03 (05 04_23, drawn: the tip) and the banking as first set, ±0.02 (estimated); the preload as first set, 0.63 ±0.3 g
//     (estimated: by eye, before the bench's riders);
//   the hairspring: its strip 0.285 ±0.003 (boxed, no tolerance: estimated), its coil Ø 12.8 ±0.05 (boxed, drawn), its cut length ±0.3 mm (estimated), the steel's
//     modulus 200-210 GPa (published).
// Judged: the train turns (each mesh in its depthing window, gearing_wempe.json; every arbor free, its endshake at least 0.01 mm at 20 °C: bench_wempe.json); the
// escapement unlocks and holds (the lock between its window's ends, tolerances_wempe.json); the swing in the guard band, 193-270°, over the whole wind (makeEsc's atK
// at the drive and the springs' stiffness, the preload and the lock rebuilt; the sources' 225-270° reported); and, apart, whether it times (the period within the
// timing weights' reach) and the temperature (the masses at their drawn place fail the TU's C in every one: the trial moves them). The bench, in its order: the depths
// (a close mesh re-bushed on the drawn centre), endshake (out of 0.01-0.08 set again), the detent's ring (its spring out of the band replaced), the escapement (the
// banking set to 0.175 deep ±0.005, the preload to the aim ±0.05 g: estimated), the mainspring's pull (out of its band, another strip), the swing (out of the guard
// band, the set-up turned to bring the drive back to the model's), the balance vibrated (the spring matched to the period). Then which tolerance spoils most alone,
// and the holes' estimate against ±25 and ±50 µm. Into tools/montecarlo_wempe.json for the Wempe's verification report:
//   node wempe_montecarlo.js [--n 2000]   (about 40 s; exits 1 if under 95 % work after the bench, one fails for a reason no bench test catches, or the json is stale)
//   node wempe_montecarlo.js --write      writes tools/montecarlo_wempe.json
const fs=require('fs'),path=require('path'),W=require('./wempe_load.js')(),{WPHYS:P,WD}=W,E=P.ESC,S=P.SET;
const J=f=>JSON.parse(fs.readFileSync(path.join(__dirname,f),'utf8')),BC=J('bench_wempe.json').criteria,TOL=J('tolerances_wempe.json'),GW=J('gearing_wempe.json'),TH=require('./wempe_thermal.js');
const D=180/Math.PI,f=(x,n=1)=>(+x).toFixed(n),r4=x=>+(+x).toFixed(4),rows=[],tStart=Date.now();let fail=0;const say=s=>rows.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;rows.push(`${ok?'  ok ':'  !! '} ${s}`);};
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?+process.argv[i+1]:d;},N=arg('--n',2000);
let seed=20261015;const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
const gauss=()=>{let u=0;while(!u)u=rnd();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*rnd());},N2=tol=>gauss()*tol/1.96,U=(a,b)=>a+(b-a)*rnd();
const G=TOL.band,dmin=G.wind.dmin,dmax=G.wind.dmax,AMIN=E.AMIN*D,inB=(lo,hi,b)=>lo>=b[0]&&hi<=b[1];

/* ---------- the swing as a response surface (each atK about 0.15 s, each makeEsc 0.5 s: too slow for thousands of movements) ----------
   A(s, kd, kp, preload, depth) = A0(s) + dKd(s, kd) + dKp(s, kp) + dPre(preload) + dLk(depth): A0 on a grid of the drive, the springs' terms on a grid of the drive and the
   stiffness (bilinear), the preload's and the lock's from makeEsc rebuilt, on a grid of the drive too. Checked against makeEsc rebuilt at random points */
const SG=[];for(let s=0.7;s<=1.55+1e-9;s+=0.05)SG.push(+s.toFixed(2));const A0g=SG.map(s=>E.atK(s,1,1).A*D);
const lin=(xs,ys,x)=>{if(x<=xs[0])return ys[0]+(ys[1]-ys[0])*(x-xs[0])/(xs[1]-xs[0]);for(let i=1;i<xs.length;i++)if(x<=xs[i])return ys[i-1]+(ys[i]-ys[i-1])*(x-xs[i-1])/(xs[i]-xs[i-1]);const n=xs.length;return ys[n-2]+(ys[n-1]-ys[n-2])*(x-xs[n-2])/(xs[n-1]-xs[n-2]);};
const S2=[0.8,1.0,1.2,1.4],KD=[0.5,0.75,1,1.4,2],KP=[0.6,0.8,1,1.2,1.4];
const grid=(K,fn)=>S2.map(s=>{const a0=E.atK(s,1,1).A*D;return K.map(k=>k===1?0:fn(s,k)-a0);}),dKdG=grid(KD,(s,k)=>E.atK(s,k,1).A*D),dKpG=grid(KP,(s,k)=>E.atK(s,1,k).A*D);
const bil=(Gd,K,s,k)=>lin(S2,S2.map((_,i)=>lin(K,Gd[i],k)),s);
const S3=[0.85,1.0,1.15],A3=S3.map(s=>E.atK(s,1,1).A*D),reb=(K,o)=>{const g=S3.map(()=>[]);K.forEach(k=>{const e=W.makeEsc({...S,...o(k)},S);S3.forEach((s,i)=>g[i].push(e.atK(s,1,1).A*D-A3[i]));});return g;};
const PREG=[0.1,0.35,S.W78,0.9,1.2,1.6],dPreG=reb(PREG,w=>({W78:w}));
const LKG=[0.12,0.13,0.14,0.15,0.155,0.16,0.163,0.167,0.17,0.175,0.18,0.185,TOL.lock.deep-0.001],dLkG=reb(LKG,d=>({dL:d/S.ES}));
const bi3=(Gd,K,s,k)=>lin(S3,S3.map((_,i)=>lin(K,Gd[i],k)),s);
const Asurf=(s,kd,kp,pre,dep)=>lin(SG,A0g,s)+bil(dKdG,KD,s,kd)+bil(dKpG,KP,s,kp)+bi3(dPreG,PREG,s,pre)+bi3(dLkG,LKG,s,Math.min(dep,LKG[LKG.length-1]));
const VAL=[[0.92,0.8,1.15,0.9,0.16],[1.1,1.3,0.85,0.4,0.18],[0.97,1.2,1.25,1.3,0.145],[1.05,0.6,0.7,0.63,0.175],[0.9,1.5,1.0,1.1,0.17]].map(([s,kd,kp,w,d])=>{const e=W.makeEsc({...S,W78:w,dL:d/S.ES},S),a=e.atK(s,kd,kp).A*D;return{s,kd,kp,w,d,a,sf:Asurf(s,kd,kp,w,d)};});
const vErr=Math.max(...VAL.map(v=>Math.abs(v.a-v.sf)));

/* ---------- the holes: the arbors' places and the meshes between them ---------- */
const AR=[10,1,38,35,26],HT=0.013,UV=[0,1,2,3].map(i=>{const a=WD.H[AR[i]],b=WD.H[AR[i+1]],d=[b[0]-a[0],b[1]-a[1]],l=Math.hypot(...d);return[d[0]/l,d[1]/l];});
const WIN=GW.stages.map(w=>[w.lo,w.hi]),SHK=GW.stages.map(w=>w.sh);
/* each mesh's torque ratio against μ (gearing_wempe.json's, 0, 0.10, 0.20), interpolated; the model's drive taken at μ 0.15 */
const eta=(i,mu)=>{const e=GW.stages[i].eff;return mu<=0.1?e[0]+(e[1]-e[0])*mu/0.1:e[1]+(e[2]-e[1])*(mu-0.1)/0.1;},etaN=[0,1,2,3].reduce((p,i)=>p*eta(i,0.15),1);
/* ---------- endshake: each arbor's stack, its terms shared where they are one part (the pillars and their seats, the top plate) ---------- */
const ESB=BC.endshake.band,ARBS=BC.endshake.arbors;
const term=(t,cache,use)=>{const k=t[0]+'|'+t[5];if(k in cache)return cache[k];const[,v,lo,hi,how]=t;return cache[k]=!use?v:how==='drawn'?v+U(lo,hi):v+(lo+hi)/2+N2((hi-lo)/2);};
const stack=(a,cache,use)=>a.gap.reduce((s,t)=>s+term(t,cache,use),0)-a.arbor.reduce((s,t)=>s+term(t,cache,use),0);
/* ---------- the hairspring: its rate as made (s a day against 0.5 s) ---------- */
const HS=TOL.hairspring,h0=0.285,REACH=[-HS.weights.gain,0];   /* the weights, against their heads, only gain: a spring slow by up to their reach times */
const hsRate=o=>{const dT=-1.5*o.dh/h0+0.5*o.dc/12.8+0.5*o.dl/505.4-0.5*(o.E-206)/206;return 86400*(0.5/(HS.T*(1+dT))-1);};

const EC=BC.escapement,DW=EC.depth.window,PRA=EC.preload,TS=[TOL.detent.inTime[0],TOL.detent.inTime[1]],MSB=BC.mainspring.s;
const one=(only)=>{const use=k=>!only||only===k,o={};
  /* the meshes' centres, each arbor's holes off by e; a mesh jams outside its window */
  const HTn=only==='holes25'?0.025:only==='holes50'?0.05:HT,uH=use('holes')||HTn!==HT,e=AR.map(()=>uH?[N2(HTn),N2(HTn)]:[0,0]);
  const dds=()=>[0,1,2,3].map(i=>(e[i+1][0]-e[i][0])*UV[i][0]+(e[i+1][1]-e[i][1])*UV[i][1]),jams=d=>d.some((x,i)=>x<WIN[i][0]||x>WIN[i][1]);
  o.jam=jams(dds());const close=d=>d.map((x,i)=>x<WIN[i][0]+SHK[i]),bad=d=>close(d).map((c,i)=>c||d[i]>WIN[i][1]);o.cDepth=bad(dds()).some(x=>x);
  for(let n=0;n<20;n++){const j=close(dds()).indexOf(true);if(j<0)break;e[j+1]=[N2(HTn),N2(HTn)];}o.jam1=jams(dds());
  /* endshake: every arbor free (at least the band's floor at 20 °C); the bench's test sets one out of the band again, within 0.01 of its drawn figure */
  const cache={},es=ARBS.map(a=>stack(a,cache,use('endshake')));o.es=es;o.bind=es.some(x=>x<ESB[0]);o.cEnd=es.filter(x=>x<ESB[0]||x>ESB[1]).length;
  const es1=es.map((x,i)=>x<ESB[0]||x>ESB[1]?ARBS[i].drawn+U(-0.01,0.01):x);o.bind1=es1.some(x=>x<ESB[0]);
  /* the drive: the mainspring's strip and the meshes' friction; the springs' stiffness */
  let tms=0.37+(use('mainspring')?N2(0.005):0);const mu=[0,1,2,3].map(()=>use('friction')?U(0.10,0.20):0.15),eta4=mu.reduce((p,m,i)=>p*eta(i,m),1)/etaN;
  let tdt=0.07+(use('detent')?N2(0.005):0);const kp=((0.15+(use('gold')?N2(0.005):0))/0.15)**3;
  /* the escapement as first assembled: the lock's depth (the wheel's tips and the banking) and the preload */
  let dep=0.175+(use('tip')?U(0,0.015):0)+(use('banking')?N2(0.02):0),pre=use('preload')?Math.max(0,S.W78+N2(0.3)):S.W78;
  const swing=(sm,td,w,d)=>{const s=(sm/0.37)**3*eta4,kd=(td/0.07)**3;return[Asurf(s*dmin,kd,kp,w,d),Asurf(s*dmax,kd,kp,w,d)];};
  const lockOk=(d,w)=>d>=DW[0]&&d<=DW[1]&&w>=PRA.window[0]-1e-9;   /* the lock in its window and the preload no less than the frame was run at (wempe_tripping.js) */
  o.unlocks=dep<=TOL.lock.deep;o.lock=lockOk(dep,pre);
  [o.Alo,o.Ahi]=o.unlocks?swing(tms,tdt,pre,dep):[0,0];o.goes=o.unlocks&&o.Alo>AMIN;o.runs=!o.jam&&!o.bind&&o.goes;o.band=o.goes&&inB(o.Alo,o.Ahi,G.guard);o.src=o.goes&&inB(o.Alo,o.Ahi,G.sources);
  /* the timing: the spring as made against 0.5 s */
  const hs={dh:use('hairspring')?N2(0.003):0,dc:use('hairspring')?U(-0.05,0.05):0,dl:use('hairspring')?N2(0.3):0,E:use('hairspring')?U(200,210):206};o.rate=hsRate(hs);o.times=o.rate>=REACH[0]&&o.rate<=REACH[1];
  o.worksAsMade=o.runs&&o.band&&o.lock;o.bindAt=es.map(x=>x<ESB[0]);
  /* the bench, in its order. The detent's ring: a spring out of its band (half to twice the drawn stiffness) replaced */
  o.cRing=tdt<TS[0]||tdt>TS[1];while(tdt<TS[0]||tdt>TS[1])tdt=0.07+N2(0.005);
  /* the escapement: the banking set to the drawn depth, the preload to its aim (estimated: a feeler's and the riders' steps) */
  o.cLock=!lockOk(dep,pre)||Math.abs(dep-EC.depth.aim)>0.01||Math.abs(pre-PRA.aim)>0.1;dep=EC.depth.aim+N2(0.005);pre=PRA.aim+N2(0.05);
  /* the mainspring's pull (and the fusee's): out of its band, another strip */
  const sm0=(tms/0.37)**3;o.cSpring=sm0<MSB[0]||sm0>MSB[1];for(let n=0;n<50&&((tms/0.37)**3<MSB[0]||(tms/0.37)**3>MSB[1]);n++)tms=0.37+N2(0.005);
  /* the swing: out of the guard band, the set-up turned to bring the drive back to the model's (the springs, the preload and the lock as now set) */
  let[Alo,Ahi]=swing(tms,tdt,pre,dep);o.cSetup=!o.jam1&&!inB(Alo,Ahi,G.guard);
  if(o.cSetup){const kd=(tdt/0.07)**3;Alo=Asurf(dmin,kd,kp,pre,dep);Ahi=Asurf(dmax,kd,kp,pre,dep);}
  o.Alo1=Alo;o.Ahi1=Ahi;o.band1=!o.jam1&&!o.bind1&&Alo>AMIN&&inB(Alo,Ahi,G.guard);o.src1=o.band1&&inB(Alo,Ahi,G.sources);o.cSwing=!o.band1;
  /* the balance vibrated: the spring matched to the period (chosen or ground) */
  o.cVib=!o.times;o.times1=true;o.lock1=lockOk(dep,pre);
  o.works=!o.jam1&&!o.bind1&&o.band1&&o.lock1;
  /* a fault left after the bench that none of its tests catches */
  o.unc=[o.jam1&&!bad(dds()).some(x=>x)&&'the train jams',o.bind1&&'an arbor binds',!o.band1&&!o.cSwing&&'the swing',!o.lock1&&'the lock'].filter(x=>x);
  return o;};
const all=[...Array(N)].map(()=>one()),frac=(a,k)=>a.filter(x=>x[k]).length/a.length,cnt=(a,fn)=>a.filter(fn).length,pc=x=>f(100*x,1)+' %';
const Wk=frac(all,'works'),W0=frac(all,'worksAsMade');
say(`${N} movements, each tolerance drawn at once: the holes ±${HT*1000} µm (estimated: the tables give none), endshake from the sheets' fits, the mainspring 0.37 ±0.005, μ 0.10-0.20, the detent's spring 0.07 ±0.005 and the gold spring 0.15 ±0.005, the lock (the wheel 14 +0.03, the banking ±0.02), the preload 0.63 ±0.3 g, the hairspring (0.285 ±0.003, Ø 12.8 ±0.05, its length ±0.3, 200-210 GPa): estimated where the sheets give none`);
say(`the swing as a response surface over the drive, the springs, the preload and the lock: against makeEsc rebuilt at ${VAL.length} points it is within ${f(vErr,2)}° (${VAL.map(v=>f(v.sf-v.a,2)).join(', ')}: makeEsc's swing moves in steps of up to 2° as the lock's depth passes its tables' cells, 0.160-0.163 mm, which the grid takes only so far)`);
say(`the train turns: ${pc(1-frac(all,'jam'))}; every arbor free (endshake at least ${ESB[0]} mm): ${pc(1-frac(all,'bind'))}; it unlocks: ${pc(frac(all,'unlocks'))}; the lock in its window (${DW.join('-')} mm, the preload at least ${PRA.window[0]} g): ${pc(frac(all,'lock'))}`);
const As=all.filter(x=>x.goes),pq=(a,k,p)=>{const b=a.map(x=>x[k]).sort((x,y)=>x-y);return b[Math.floor(p*(b.length-1))];};
const bindBy=ARBS.map((a,i)=>all.filter(x=>x.bindAt[i]).length/N);
say(`  endshake as the sheets tolerance it (each part anywhere in its limits): an arbor under ${ESB[0]} mm in ${ARBS.map((a,i)=>`${a.id} ${pc(bindBy[i])}`).join(', ')}: the plates' seats (0.3 +0.03, twice) and the arbors' lengths leave it to be set at assembly, as the sheets' own notes set the fusee's (face a re-turned) and the bushes' depths`);
say(`the swing over the wind as made (the escapement unlocking, whatever the train): its lowest ${f(pq(As,'Alo',0.05))}-${f(pq(As,'Alo',0.95))}°, its highest ${f(pq(As,'Ahi',0.05))}-${f(pq(As,'Ahi',0.95))}° (5-95 %): in the guard band ${pc(frac(all,'band'))}; in the sources' 225-270° ${pc(frac(all,'src'))}`);
say(`as made, the train, the arbors, the lock and the swing together: ${pc(W0)}; it times as made (the spring within the weights' reach) ${pc(frac(all,'times'))}: the drawn spring on the weighed balance is ${f(HS.fast/60,0)} min a day fast, so every one is matched on the bench, as a 1940s maker matched it`);
const B={depths:{caught:cnt(all,x=>x.cDepth),jam:cnt(all,x=>x.jam),left:cnt(all,x=>x.jam1)},endshake:{caught:cnt(all,x=>x.cEnd>0),arbors:all.reduce((a,x)=>a+x.cEnd,0),bind:cnt(all,x=>x.bind),left:cnt(all,x=>x.bind1)},
  ring:{caught:cnt(all,x=>x.cRing)},lock:{caught:cnt(all,x=>x.cLock),wouldFail:cnt(all,x=>!x.lock)},spring:{caught:cnt(all,x=>x.cSpring)},setup:{caught:cnt(all,x=>x.cSetup),mended:cnt(all,x=>x.cSetup&&x.band1)},swing:{caught:cnt(all,x=>x.cSwing)},vibrated:{caught:cnt(all,x=>x.cVib)}};
say(`the bench: the depths catch ${B.depths.caught} (${B.depths.jam} would jam), re-bushed: ${B.depths.left} left jammed; endshake catches ${B.endshake.caught} movements (${B.endshake.arbors} arbors out of ${ESB.join('-')} mm, ${B.endshake.bind} binding), set again: ${B.endshake.left} left binding; the detent's ring ${B.ring.caught} springs replaced`);
say(`the escapement's test resets the banking and the preload in ${B.lock.caught} (${B.lock.wouldFail} would have failed the lock's window or the preload as made); the mainspring's pull out of its band in ${B.spring.caught}, another strip; the swing out of the guard band in ${B.setup.caught}, the set-up turned: ${B.setup.mended} brought into it; still out ${B.swing.caught}; the balance vibrated and its spring matched in ${B.vibrated.caught}`);
const unc=all.filter(x=>!x.works&&x.unc.length),why={};for(const x of unc)for(const k of x.unc)why[k]=(why[k]||0)+1;
say(`after the bench, in the sources' 225-270° over the wind: ${pc(frac(all,'src1'))} (the model's swing is under it: open)`);
chk(Wk>=0.95,`works after the bench's tests and adjustments (the depths, endshake, the detent's spring, the banking and the preload, the strip, the set-up, the spring matched): ${pc(Wk)}; as made ${pc(W0)}`);
chk(!unc.length,unc.length?`${unc.length} fail for a reason no bench test catches (${Object.entries(why).map(([k,v])=>`${k} ${v}`).join(', ')}): bench_wempe.json's figures fall short of the analyses' (node wempe_bench.js --write)`:`every movement that still fails (${cnt(all,x=>!x.works)}) is caught by a bench test: none leaves the bench unknown`);
/* which tolerance spoils most: each alone; and the holes' estimate against a looser boring */
const ONLY=['holes','endshake','friction','mainspring','detent','gold','tip','banking','preload','hairspring'],alone={};
for(const k of ONLY){const a=[...Array(Math.round(N/4))].map(()=>one(k));alone[k]={asMade:frac(a,'worksAsMade'),works:frac(a,'works'),band:frac(a,'band'),times:frac(a,'times')};}
say(`each tolerance alone (as made / after the bench): ${ONLY.map(k=>`${k} ${pc(alone[k].asMade)} / ${pc(alone[k].works)}`).join('; ')} (the tip: the wheel's 14 +0.03 with the banking where the drawn wheel puts it; the banking: as first set). The hairspring alone times as made in ${pc(alone.hairspring.times)}`);
const worst=ONLY.slice().sort((a,b)=>alone[a].asMade-alone[b].asMade)[0];
say(alone[worst].asMade<1-0.002?`the one that spoils most as made: ${worst} (${pc(1-alone[worst].asMade)} of movements alone)`:'no tolerance alone takes a movement out');
const HSN={};for(const k of['holes25','holes50']){const a=[...Array(Math.round(N/4))].map(()=>one(k));HSN[k]={asMade:frac(a,'worksAsMade'),works:frac(a,'works'),jam:frac(a,'jam')};}
say(`the holes bored to ±25 µm: the train jams as made in ${pc(HSN.holes25.jam)} (${pc(HSN.holes25.works)} after the bench); to ±50 µm ${pc(HSN.holes50.jam)} (${pc(HSN.holes50.works)} after): the seconds mesh's close side, ${f(-WIN[3][0]*1000,0)} µm less its shake, is the train's tightest`);
say(`temperature, apart: at the masses' drawn place every one fails the TU's C (${f(Math.abs(TH.linear.drawn),2)} s a day a °C against ±0.10); the trial moves them (bench_wempe.json); over the materials' ranges a place on the free arc nulls it in ${TH.linear.nZero} of the 32 corners (wempe_thermal.js): the alloys, not the maker's tolerances, decide it`);
/* the record */
const ah=(a,k)=>{const b={};for(const x of a){const q=Math.floor(x[k]/2.5)*2.5;b[q]=(b[q]||0)+1;}return Object.entries(b).map(([q,v])=>[+q,v]).sort((x,y)=>x[0]-y[0]);};
const out={note:'tools/wempe_montecarlo.js: the whole Wempe made to a maker\'s tolerances (drawn where the sheets give them, estimated where not), judged as made and after the bench\'s tests (bench_wempe.json); for the Wempe\'s verification report',
  N,tol:{holes:HT,mainspring:0.005,mu:[0.10,0.20],detent:0.005,gold:0.005,tip:0.015,banking:0.02,preload:0.3,hairspring:{h:0.003,coil:0.05,L:0.3,E:[200,210]}},
  surface:{err:r4(vErr),points:VAL.map(v=>({s:v.s,kd:v.kd,kp:v.kp,w:v.w,d:v.d,A:r4(v.a),surf:r4(v.sf)}))},
  asMade:{turns:r4(1-frac(all,'jam')),free:r4(1-frac(all,'bind')),bindBy:Object.fromEntries(ARBS.map((a,i)=>[a.id,r4(bindBy[i])])),unlocks:r4(frac(all,'unlocks')),lock:r4(frac(all,'lock')),runs:r4(frac(all,'runs')),band:r4(frac(all,'band')),sources:r4(frac(all,'src')),times:r4(frac(all,'times')),works:r4(W0)},
  after:{turns:r4(1-frac(all,'jam1')),free:r4(1-frac(all,'bind1')),band:r4(frac(all,'band1')),sources:r4(frac(all,'src1')),lock:r4(frac(all,'lock1')),works:r4(Wk)},
  swing:{asMade:{lo:[0.05,0.5,0.95].map(p=>r4(pq(As,'Alo',p))),hi:[0.05,0.5,0.95].map(p=>r4(pq(As,'Ahi',p)))},after:{lo:[0.05,0.5,0.95].map(p=>r4(pq(all,'Alo1',p))),hi:[0.05,0.5,0.95].map(p=>r4(pq(all,'Ahi1',p)))},hist:ah(As,'Alo')},
  bench:B,uncaught:unc.length,why,failAfter:cnt(all,x=>!x.works),alone:Object.fromEntries(Object.entries(alone).map(([k,v])=>[k,Object.fromEntries(Object.entries(v).map(([q,x])=>[q,r4(x)]))])),worst,
  holes:Object.fromEntries(Object.entries(HSN).map(([k,v])=>[k,Object.fromEntries(Object.entries(v).map(([q,x])=>[q,r4(x)]))])),rate:{asMade:[0.05,0.5,0.95].map(p=>r4(pq(all,'rate',p))),reach:REACH.map(r4)},temperature:{drawnC:r4(-TH.linear.drawn),nZero:TH.linear.nZero}};
console.log(rows.join('\n'));
const OUT=path.join(__dirname,'montecarlo_wempe.json'),txt=JSON.stringify(out,null,1)+'\n';
if(process.argv.includes('--write')){fs.writeFileSync(OUT,txt);console.log('  wrote tools/montecarlo_wempe.json');}
else if(N===2000){const ok=fs.existsSync(OUT)&&fs.readFileSync(OUT,'utf8').replace(/\r/g,'')===txt;console.log(ok?'  ok  tools/montecarlo_wempe.json is what this finds':'  !!  tools/montecarlo_wempe.json is not what this finds: node wempe_montecarlo.js --write');if(!ok)fail=1;}
console.log(`  (${f((Date.now()-tStart)/1000,0)} s)`);process.exitCode=fail;
