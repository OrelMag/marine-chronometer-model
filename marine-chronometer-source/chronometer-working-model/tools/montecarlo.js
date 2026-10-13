// The whole movement made to a maker's tolerances at once (errorbudget.js does the escapement's own settings, gearing.js one mesh at a time): each made movement
// draws every tolerance together and is judged on everything the checks above say it must do. Drawn (normal, the tolerance its 95 % band; estimated where said):
//   the arbors' holes: each hole's place off by up to ±13 µm in each direction (gearing.js: a CNC boring them), so each mesh's centre distance moves;
//   each mesh's tooth friction: μ 0.10-0.20 (physics.js A6), its torque ratio gearing.js's at that μ;
//   the mainspring's strip ±0.005 mm (estimated), its torque as the thickness cubed; the detent spring's and the trip spring's ±0.005 mm (estimated);
//   the sustaining spring's band, made to the section the manual's ten minutes ask (sustaining.js), its width and height ±0.02 mm (estimated);
//   the winding pawls' springs set on the bench to twice what ratchets.js finds they need, ±0.05 mm, and the sustaining pawl's wire's 0.12 ±0.04 rad.
// Each is then judged: the train turns (every mesh inside its depthing window: gearing.json), the balance swings (the escapement adjusted to the manual's
// figures, as errorbudget.js's adjuster leaves it: ESC.atK at the drive and the springs' stiffness), the swing in the manual's 1⅜-1½ turns as made and after
// the mainspring's set-up is turned to bring it back (Op. 13), the maintaining work drives the train five minutes, the winding pawls follow the fusee down when
// the key lets go (ratchets.js's need). Which tolerance spoils most, by each one alone. Needs only Node.js:
//   node montecarlo.js [--n 2000] [--json OUT]   (about 10 s; exits 1 if under 95 % of movements work after the bench's adjustments)
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
const kSpec=SU.out?null:null,ss=SU.spring,kNeed=SU.need.k10,setNeed=Math.max(...RA.pawls.filter(p=>/winding/.test(p.name)).map(p=>p.set));
const TF=ESC.settings.TF,FPH=PH.TRAIN.cp/PH.TRAIN.fu*2*Math.PI/3600;
/* the sustaining spring drives the train until its push, falling as it opens, can't keep the balance over AMIN (the swing following with TF): its time for a stiffness */
const runFor=k=>{let A=ESC.ampAt(1),t=0;const T0=PH.Tf;while(t<3600){const Dd=Math.max(0,1-k*FPH*t/T0),Ae=Dd>0?ESC.ampAt(Dd):0;A=Math.sqrt(Ae*Ae+(A*A-Ae*Ae)*Math.exp(-2*2/TF));if(A<ESC.AMIN)return t;t+=2;}return 3600;};
const RUN={};const runK=k=>{const q=Math.round(Math.log(k)*100);return RUN[q]??(RUN[q]=runFor(Math.exp(q/100)));};   /* by 1 % of stiffness */
const one=(only)=>{const use=k=>!only||only===k,o={};
  /* the meshes' centres */
  const e=AR.map(()=>use('holes')?[N2(HT),N2(HT)]:[0,0]);o.jam=false;o.dd=[];
  for(let i=0;i<4;i++){const dd=(e[i+1][0]-e[i][0])*UV[i][0]+(e[i+1][1]-e[i][1])*UV[i][1],w=GJ.stages[i];o.dd.push(dd);if(dd<w.lo||dd>w.hi)o.jam=true;}
  /* the drive at the escape wheel: the mainspring's strip, the meshes' friction */
  const tms=t0.ms+(use('mainspring')?N2(TOL.ms):0),mu=[0,1,2,3].map(()=>use('friction')?0.10+0.10*rnd():0.15),eta4=mu.reduce((p,m,i)=>p*eta(i,m),1);
  const s=(tms/t0.ms)**3*eta4/etaN,kd=((t0.det+(use('detent')?N2(TOL.det):0))/t0.det)**3,kp=((t0.trip+(use('trip')?N2(TOL.trip):0))/t0.trip)**3;
  const r=ESC.atK(s,kd,kp);o.A=r.A*D;o.runs=!o.jam&&o.A>ESC.AMIN*D;o.band=o.runs&&o.A>=247.5&&o.A<=270;
  /* the set-up turned to bring the swing back (Op. 13): the drive restored to the model's, the springs' stiffness left as made */
  const r2=ESC.atK(1,kd,kp);o.A2=r2.A*D;o.band2=o.runs&&o.A2>=247.5&&o.A2<=270;
  /* the maintaining work */
  const kS=kNeed*(1+(use('sustaining')?N2(TOL.band)/ss.H:0))*(1+(use('sustaining')?N2(TOL.band)/ss.SSW:0))**3;o.sust=runK(kS)>=300;
  /* the winding pawls' springs' set, the sustaining pawl's wire */
  const set=2*setNeed+(use('pawls')?N2(TOL.set):0),wire=0.12+(use('pawls')?N2(TOL.wire):0);o.pawls=set>=setNeed&&wire>0.03;
  o.works=o.runs&&o.band2&&o.sust&&o.pawls;o.worksAsMade=o.runs&&o.band&&o.sust&&o.pawls;return o;};
const all=[...Array(N)].map(()=>one()),frac=(a,k)=>a.filter(x=>x[k]).length/a.length,pc=x=>f(100*x,1)+' %';
say(`${N} movements, each tolerance drawn at once (holes ±${HT*1000} µm, μ 0.10-0.20, the mainspring's strip ±${TOL.ms}, the detent and trip springs ±${TOL.det}, the sustaining spring's band ±${TOL.band}, the pawls' springs' set ${f(2*setNeed,2)}±${TOL.set} mm (the bench's: twice the need): estimated where the sources give none)`);
say(`the train turns: ${pc(1-frac(all,'jam'))}; the balance swings: ${pc(frac(all,'runs'))}`);
const As=all.filter(x=>x.runs).map(x=>x.A).sort((a,b)=>a-b),pq=p=>As[Math.floor(p*(As.length-1))];
say(`its swing as made ${f(pq(0.05))}-${f(pq(0.95))}° (5-95 %): in the manual's band ${pc(frac(all,'band'))}; with the set-up turned to bring the drive back (Op. 13) ${pc(frac(all,'band2'))}`);
say(`the maintaining work drives the train five minutes: ${pc(frac(all,'sust'))}; the winding pawls follow the fusee when the key lets go (their springs set at least ${f(setNeed,2)} mm): ${pc(frac(all,'pawls'))}`);
const W=frac(all,'works'),W0=frac(all,'worksAsMade');
chk(W>=0.95,`works, after the bench's adjustments (the escapement set to the manual's figures, the set-up turned): ${pc(W)}; without turning the set-up ${pc(W0)}`);
/* which tolerance spoils most: each alone */
const ONLY=['holes','friction','mainspring','detent','trip','sustaining','pawls'],alone={};
for(const k of ONLY){const a=[...Array(Math.round(N/4))].map(()=>one(k));alone[k]={works:frac(a,'works'),asMade:frac(a,'worksAsMade'),band:frac(a,'band')};}
say(`each tolerance alone (as made / after adjusting): ${ONLY.map(k=>`${k} ${pc(alone[k].asMade)} / ${pc(alone[k].works)}`).join('; ')}`);
const worst=ONLY.slice().sort((a,b)=>alone[a].asMade-alone[b].asMade)[0],lost=1-W0;
say(alone[worst].asMade<1-0.002?`the one that spoils most as made: ${worst} (${pc(1-alone[worst].asMade)} of movements alone)`:`no tolerance alone takes a movement out; together the drive's spread (the mainspring's strip and the meshes' friction, ${f(100*(1-frac(all,'band')),1)} % out of the band) does, and the set-up's turn brings it back`);
out.worst=worst;
out.N=N;out.frac={jam:frac(all,'jam'),runs:frac(all,'runs'),band:frac(all,'band'),band2:frac(all,'band2'),sust:frac(all,'sust'),pawls:frac(all,'pawls'),works:W,asMade:W0};out.alone=alone;out.swing=[pq(0.05),pq(0.5),pq(0.95)];
out.hist=(()=>{const b={};for(const a of As){const k=Math.floor(a/2.5)*2.5;b[k]=(b[k]||0)+1;}return Object.entries(b).map(([k,v])=>[+k,v]).sort((x,y)=>x[0]-y[0]);})();
out.rows=rows;module.exports=out;
if(require.main===module){console.log(rows.join('\n'));const jo=process.argv.indexOf('--json');if(jo>0)fs.writeFileSync(process.argv[jo+1],JSON.stringify(out));process.exitCode=fail;}
