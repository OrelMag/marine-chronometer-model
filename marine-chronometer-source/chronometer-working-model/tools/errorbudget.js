// Would it keep time? An error budget: what each source of rate change adds to the error a navigator carries, and how a chronometer made to the page
// comes out of the shop. Needs only Node.js:
//   node errorbudget.js           (about 20 s; exits with 1 if the stochastic model can't reproduce the factory test card it is calibrated on)
//   node errorbudget.js --n 4000  (more voyages)
// 1. As made: makeEsc's escapement with every setting off by a maker's tolerance (Monte Carlo, the reference torque and balance): how many run, swing
//    in the manual's band and meet the manual's adjustment figures before adjusting; which figure fails most (what the adjuster will spend time on).
// 2. At sea: a chronometer rated in port, then carried 60 days into the tropics. Each day's rate is the sum of
//      the temperature curve       [the test card: its linear and middle-temperature terms; or the Navy's limits]
//      day-to-day scatter, drift   [the test card's rating and recovery, which calibrate them; or the Navy's limits]
//      the barometer               [model: the air's share of the balance's damping (physics.js), the swing, the escapement's isochronism (dynamics.js)]
//      the oil thickening          [estimated rate of the drive's loss, through the same isochronism]
//      the ship's motion           [dynamics.js: yaw and a roll's sideways acceleration, on heavy-weather days]
//    and the navigator carries the rate found over the last 10 days in port. The error is the sum of each day's rate less that, and 4 s of time is a
//    mile of longitude on the equator.
// The empirical terms are the test card's (manual Sec. IX: No. 3390), not physics: the model has no source for a chronometer's day-to-day scatter, and
// its temperature curve (core.js MTE.uncut) is the card's. What the physics adds is how the rest scale and what they add up to.
const fs=require('fs'),path=require('path'),{makeEsc}=require('../../shared/escapement.js'),PH=require('./physics.js'),DY=require('./dynamics.js'),{ESC,sim}=DY;
const rd=f=>fs.readFileSync(path.join(__dirname,'..','js',f),'utf8'),app=rd('app.js'),core=rd('core.js');
const D=Math.PI/180,f=(x,n=2)=>(+x).toFixed(n),sg=(x,n=2)=>(x>=0?'+':'−')+Math.abs(x).toFixed(n),rows=[];let fail=0;
const say=s=>rows.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;rows.push(`${ok?'  ok ':'  !! '} ${s}`);},t0=Date.now();
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?+process.argv[i+1]:d;},NV=arg('--n',2000),NM=arg('--nm',1000);
/* a seeded generator, so a run is repeatable */
let seed=20261011;const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
const gauss=()=>{let u=0;while(!u)u=rnd();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*rnd());};
const pct=(a,p)=>{const b=[...a].sort((x,y)=>x-y);return b[Math.min(b.length-1,Math.floor(p*b.length))];};

/* ---------- 1. as made ---------- */
/* a maker's tolerances, one standard deviation (estimated: a careful hand with a lathe, a depthing tool and jewelling tools): turned and ground diameters
   ±0.005 mm, positions set by hand (the trip spring's tip, the discharge jewel's reach) ±0.02, depth of lock ±0.005, the jewels' faces and the stone's
   flat ±0.5° and ±1°, jewel and strip thicknesses ±0.005, the teeth's form ±0.01 mm and ±0.01 of a pitch. Each is drawn round the model's value */
say('1. As made: the escapement with a maker\'s tolerances (Monte Carlo, the reference torque and balance)');
{const ES=ESC.ES,mm=x=>x/ES,TOL={rRoll:mm(0.005),rp:mm(0.005),rT:mm(0.02),rd:mm(0.02),dL:mm(0.005),DRAW:1,aI:0.5,aD:0.5,wI:mm(0.005),wD:mm(0.005),tsT:0.005,r0:mm(0.01),U:0.01,land:0.01};
  const base=ESC.settings,fails={},A=[],slope=[];let runs=0,band=0,all=0;
  const iso=E=>{const a=E.ampAt(0.95),b=E.ampAt(1.11);return(E.rateAt(b,1.11)-E.rateAt(a,0.95))/((b-a)/D)*10;};
  for(let i=0;i<NM;i++){const o={EX:base.EX};for(const[k,s]of Object.entries(TOL))o[k]=base[k]+s*gauss();o.rp=Math.min(o.rp,o.rRoll);   /* the jewel flush with the roller or inside it (Ops. 76, 83) */
    let E;try{E=makeEsc(o);}catch(e){fails.build=(fails.build||0)+1;continue;}
    const m=E.measure(),cs=E.checks();if(!m.runs){fails.runs=(fails.runs||0)+1;continue;}runs++;
    const a=E.run.A/D;A.push(a);if(a>=247.5&&a<=270)band++;let ok=true;for(const c of cs)if(!c.ok){ok=false;fails[c.k]=(fails[c.k]||0)+1;}if(ok)all++;
    const s=iso(E);if(Number.isFinite(s))slope.push(s);}
  say(`${NM} escapements: ${f(100*runs/NM,1)} % run; their swing ${f(pct(A,0.05),0)}-${f(pct(A,0.95),0)}° (5-95 %), ${f(100*band/NM,0)} % inside the manual's 247.5-270°; ${f(100*all/NM,0)} % meet every adjustment figure as made`);
  const nm={runs:'would not run',build:'could not be built',shake:'roller shake (Op. 84)',dip:"the teeth's dip (Op. 76)",lock:'lock (Op. 85)',letoff:'let-off (Op. 86)',overall:'overall (Op. 87)',drop:'drop (Op. 97)',horn:'horn clearance (Op. 88)',jewels:'the jewels\' angle'};
  say(`out of the manual's figures, as made: ${Object.entries(fails).sort((a,b)=>b[1]-a[1]).map(([k,n])=>`${nm[k]||k} ${f(100*n/NM,0)} %`).join(', ')}: the adjuster's work (the lock-adjusting and detent-adjusting screws, Ops. 84-97, set lock and the detent's place; the trip spring's tip is bent to its figure)`);
  say(`the escapement's isochronism over them (averaged model): ${sg(pct(slope,0.05),2)} to ${sg(pct(slope,0.95),2)} s a day for each 10° of swing (5-95 %); the model's own ${sg(slope.length?iso(ESC):NaN,2)}`);}
console.log(rows.splice(0).join('\n'));console.log(`  (${f((Date.now()-t0)/1000,0)} s)`);

/* ---------- 2. at sea ---------- */
say('2. At sea: 60 days from a port in winter (55 °F) into the tropics (85 °F), rated over 10 days in port, the error the navigator carries');
/* the escapement's isochronism in time (dynamics.js, the drawn springs, near the manual's swing): s a day for each degree of swing */
const lo=sim({mode:'phys',s:1.24,A:248,T:40,from:25}),hi=sim({mode:'phys',s:1.40,A:262,T:40,from:25}),isoS=(hi.rate-lo.rate)/(hi.A-lo.A);
say(`the escapement's isochronism in time, near 255°: ${sg(isoS*10,3)} s a day for each 10° of swing (dynamics.js; ${f(lo.A,0)}° → ${f(hi.A,0)}°)`);
chk(Math.abs(isoS*10)<0.5,`small, as the fusee and the detent escapement are meant to make it`);
/* the swing's response: A ∝ √(Q W), so dA/A = dQ/2Q; the drive's from makeEsc's ampAt */
const A0=255,dAdQ=A0/2,dAds=(ESC.ampAt(1.01)-ESC.ampAt(0.99))/0.02/ESC.A*A0;
/* the barometer: air takes 1/Q_air of the balance's 1/Q (physics.js A6); the air's density follows the pressure, day-to-day about 1 % at sea (10 hPa, estimated) */
const qAir=(PH.qAir[0]+PH.qAir[1])/2,airShare=PH.Qm/qAir,baroK=-airShare*dAdQ/A0*A0*isoS;   /* s a day for a 1 (100 %) change of the air's density */
say(`the barometer: the air takes ${f(100*airShare,0)} % of the balance's damping, so 1 % denser air swings it ${f(airShare*dAdQ/100,2)}° less: ${sg(baroK/100,4)} s a day`);
/* the ship's motion on heavy-weather days (dynamics.js) */
const ang=Math.atan2(DY.DM.my,DY.DM.mx)+Math.PI/2,w=2*Math.PI/8,calm=sim({mode:'phys',A:215,T:70,from:15}),heavy=sim({mode:'phys',A:215,T:70,from:15,ext:tt=>({al:-10*D*w*w*Math.sin(w*tt),ax:0.3*9.80665*Math.sin(w*tt)*Math.cos(ang),ay:0.3*9.80665*Math.sin(w*tt)*Math.sin(ang)})}),seaK=heavy.rate-calm.rate;
say(`heavy weather (yaw ±10°, ±0.3 g sideways, 8 s): ${sg(seaK,3)} s a day (dynamics.js)`);
/* the temperature curve, the card's (core.js MTE.uncut: the middle-temperature term) and its linear term from the card's period means (90 °F −0.02, 72½ +0.06, 55 0.00) */
const c2=+/uncut:t=>(-?[\d.]+)\*\(t-72\.5\)\*\*2/.exec(core)[1],card=Function('return '+/C3390=(\{[^}]*\})/.exec(app)[1])();
const lim={};for(const m of app.matchAll(/\['(\w+)','[^']*',([\d.]+),'/g))lim[m[1]]=+m[2];
const c1card=(-0.02-0.00)/35;   /* the card's 90 and 55 °F means (README, "Temperature") */
/* the Navy's 30-day test (Sec. IX), as app.js's testCalc reads it: six periods of five days at 90, 72½, 55, 55, 72½, 90 °F, rates read to 0.01 s */
const TS=[90,72.5,55,55,72.5,90];
function navy(p){let e=0,day=0;const q=v=>Math.round(v*100)/100,P=TS.map(T=>{const e0=e,rs=[];for(let d=0;d<5;d++){day++;const r=p.c1*(T-72.5)+p.c2*(T-72.5)**2+p.dr*day+p.sd*gauss();const e1=q(e+r);rs.push(q(e1-e));e=e1;}
  const m=(e-e0)/5;return{m,dev:rs.reduce((a,x)=>a+Math.abs(x-m),0)/5,dif:Math.max(...rs)-Math.min(...rs)};});const M=k=>(P[k[0]].m+P[k[1]].m)/2,m90=M([0,5]),m72=M([1,4]),m55=M([2,3]);
  return{reg:Math.max(...P.map(x=>Math.abs(x.m))),dev:P.reduce((a,x)=>a+x.dev,0)/6,dif:Math.max(...P.map(x=>x.dif)),t1:Math.abs(m90-m72),t2:Math.abs(m72-m55),t3:Math.abs(m90-m55),
    rec:Math.max(Math.abs(P[0].m-P[5].m),Math.abs(P[1].m-P[4].m),Math.abs(P[2].m-P[3].m))};}
const med=(p,k,n=600)=>pct([...Array(n)].map(()=>navy({...p,dr:p.drS*gauss()})[k]),0.5);
/* calibrate the scatter (sd) and the drift's spread (drS) so the test's median rating and recovery are the card's, or a share of the Navy's limits */
const calib=(dev,rec,c1)=>{const p={c1,c2,sd:0.04,drS:0.002};for(let it=0;it<3;it++){let a=0.001,b=1;for(let i=0;i<14;i++){const m=Math.sqrt(a*b);med({...p,sd:m},'dev')<dev?a=m:b=m;}p.sd=Math.sqrt(a*b);
  a=1e-5;b=0.05;for(let i=0;i<14;i++){const m=Math.sqrt(a*b);med({...p,drS:m},'rec')<rec?a=m:b=m;}p.drS=Math.sqrt(a*b);}return p;};
const S1=calib(card.dev,card.rec,c1card),passP=(p,n=400)=>[...Array(n)].map(()=>navy({...p,dr:p.drS*gauss()})).filter(r=>Object.keys(lim).every(k=>k==='iso'||r[k]<=lim[k])).length/n;
/* the borderline chronometer: the card's scatter, drift and linear temperature term (its 90/72½ °F figure over 17½ °F) scaled up together until the test passes half the time */
const S2=(()=>{const at=k=>({c1:k*card.t1/17.5,c2,sd:k*S1.sd,drS:k*S1.drS});let a=1,b=40;for(let i=0;i<12;i++){const m=Math.sqrt(a*b);passP(at(m))>0.5?a=m:b=m;}const p=at(Math.sqrt(a*b));p.k=Math.sqrt(a*b);return p;})();
{const q=[...Array(1000)].map(()=>navy({...S1,dr:S1.drS*gauss()})),pass=q.filter(r=>Object.keys(lim).every(k=>k==='iso'||r[k]<=lim[k])).length/q.length;
  const mm=k=>pct(q.map(r=>r[k]),0.5);
  say(`like No. 3390: scatter ${f(S1.sd,3)} s a day, drift ±${f(S1.drS*1000,2)} ms a day each day (calibrated on its rating ${card.dev} and recovery ${card.rec}); the 30-day test then reads (median) rating ${f(mm('dev'))}, recovery ${f(mm('rec'))}, temperature ${f(mm('t1'))} / ${f(mm('t2'))} / ${f(mm('t3'))} (the card ${card.t1} / ${card.t2} / ${card.t3}); it passes ${f(100*pass,0)} % of the time`);
  chk(Math.abs(mm('dev')-card.dev)<0.015&&Math.abs(mm('rec')-card.rec)<0.03&&Math.abs(mm('t1')-card.t1)<0.06&&Math.abs(mm('t2')-card.t2)<0.06,`the stochastic model reproduces the card it is calibrated on`);}
{const q=[...Array(1000)].map(()=>navy({...S2,dr:S2.drS*gauss()})),pass=q.filter(r=>Object.keys(lim).every(k=>k==='iso'||r[k]<=lim[k])).length/q.length;
  say(`a borderline chronometer (the card's scatter, drift and linear temperature term ${f(S2.k,1)} times as large): scatter ${f(S2.sd,3)} s a day, drift ±${f(S2.drS*1000,2)} ms a day each day, ${f(S2.c1*17.5,2)} s a day over 17½ °F; it passes the Navy's test ${f(100*pass,0)} % of the time`);}
/* oil: the drive lost as the oil thickens between overhauls, 0-10 % a year (estimated: the manual's overhaul interval, Sec. I) */
const OIL=0.10;
function voyage(p,on={}){const use=k=>!on.only||on.only===k,days=60,port=10,rates=[];let dr=p.drS*gauss(),oil=OIL*rnd(),bP=gauss()*0.01;
  for(let d=-port;d<days;d++){const T=d<0?55:55+30*Math.min(d/20,1)+3*gauss(),dT=T-72.5;bP=0.7*bP+0.71*0.01*gauss();   /* daily mean temperature (°F) in its box; the air's density, 1 % day to day, a few days' memory */
    let r=0;if(use('temp'))r+=p.c1*dT+p.c2*dT*dT;if(use('scatter'))r+=p.sd*gauss();if(use('drift'))r+=dr*(d+port);if(use('baro'))r+=baroK*bP;
    if(use('oil'))r+=-oil*(d+port)/365*dAds*isoS;if(use('sea')&&d>=0&&rnd()<0.2)r+=seaK;rates.push(r);}
  const rated=rates.slice(0,port).reduce((a,b)=>a+b,0)/port;let e=0;const out={};for(let d=0;d<days;d++){e+=rates[port+d]-rated;if(d===9||d===29||d===59)out[d+1]=e;}return out;}
const run=(p,on)=>{const R=[...Array(NV)].map(()=>voyage(p,on));return k=>R.map(r=>Math.abs(r[k]));};
const line=(nm,p)=>{const r=run(p,{});say(`${nm.padEnd(34)} ${[10,30,60].map(k=>{const a=r(k);return`${k} days: ${f(pct(a,0.5),1)} s (${f(pct(a,0.5)/4,1)} mi), 95 % ${f(pct(a,0.95),1)} s (${f(pct(a,0.95)/4,1)} mi)`;}).join('; ')}`);return r;};
say(`the error the navigator carries (median, and 95 % of ${NV} voyages; in miles of longitude on the equator, 4 s of time a mile):`);
const r1=line('like No. 3390',S1);line('borderline (passes half the time)',S2);
say('what each source adds at 30 days, like No. 3390 (median |error|, alone):');
for(const[k,nm]of[['temp','the temperature curve (55 → 85 °F)'],['scatter','day-to-day scatter'],['drift','drift'],['oil','the oil thickening'],['baro','the barometer'],['sea','heavy weather one day in five']]){
  const a=run(S1,{only:k})(30);say(`  ${nm.padEnd(38)} ${f(pct(a,0.5),2)} s`);}
{const m30=pct(r1(30),0.5);chk(m30<30,`a chronometer like No. 3390 carries ${f(m30,1)} s (${f(m30/4,1)} miles of longitude) after a month at sea, well under 30 s (7½ miles): it keeps time`);}
console.log(rows.join('\n'));console.log(`  (${f((Date.now()-t0)/1000,0)} s)`);if(fail)process.exitCode=1;
