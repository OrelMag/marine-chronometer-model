// Navigating by a Wempe made to the model: the whole chain from the made chronometer to the ship's position (Node.js, no browser; the Wempe README's "Navigating by it").
//   1. the made chronometer: as wempe_montecarlo.js makes them, after the bench (montecarlo_wempe*.json's swing after the bench, its mean over the wind drawn normal with the
//      file's 5-50-95 % spread): its swing sets how much the oil's thickening moves its rate (makeEsc's rate at the swing it has, as wempe_errorbudget.js's oilK at the model's);
//      adjusted as the version is: as last revised the masses to ±0.45° of their compensating place (the TU's trial, the 6MX passports' C spread: wempe_errorbudget.js),
//      the two builds to ±0.1° on further rounds of the trial (wempe_bench.js, BUILD/BUILD40);
//   2. the voyage: wempe_errorbudget.js's own (its section 2): 60 days from a port in winter (55 °F) into the tropics (85 °F) over the first 20, each day's rate the
//      temperature curve with the air, the swing over the daily wind, the scatter and drift calibrated on the 6MX's test cards, the barometer, the oil, heavy weather one day
//      in five (gimbals.js --model wempe through makeEsc);
//   3. the navigator: rates it over the 10 days in port and carries that rate (the ten-day rate carried on, as rating.py's backtest works a log), so at sea the error is what
//      the rate has drifted from the rated one, summed;
//   4. the position: 4 s of time are 1′ of longitude, cos(latitude) nautical miles; the route (estimated: no source gives one) from 45° N in port to 15° N by day 20,
//      where the box reaches 85 °F, the error given there and at the equator, where a second of time is worth most; and the fix's own error, a celestial fix by an
//      experienced observer in favourable conditions "seldom in error by more than 2 miles", a probable error of ±2 miles (N. Bowditch, The American Practical Navigator,
//      Pub. No. 9, 2019 ed., Vol. 2, Ch. 3, Navigational Errors): taken as a circular normal whose median is 2 miles (σ 1.70 a side), the clock's error along the parallel.
// The criterion (stated before the results were known): after 30 days without a time signal the chronometer adds no more than the sight itself: its error in longitude at
// the equator under 2 miles (8 s) in the median, Bowditch's probable error of the fix (and the user's aim for the build, about 2 miles a month, 19 October 2026), and in 19
// voyages of 20 under the fix's own 95 % radius (4.16 miles). The 1950s build must pass (exit 1); the drawings as last revised and the 1940s build are judged and reported.
//   node wempe_navigation.js [--n 2000] [--json OUT]   (about 1-2 minutes: a child process for each version, MC_WREV; exits 1 if the 1950s build fails or the file is stale)
//   node wempe_navigation.js --write                    writes tools/navigation_wempe.json (the Wempe report's section 21)
//   node wempe_navigation.js --fault                    the 1950s build's masses left at their drawn place: must fail
const fs=require('fs'),path=require('path'),cp=require('child_process');
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?+process.argv[i+1]:d;},N=arg('--n',2000),FAULT=process.argv.includes('--fault');
const PE=2,SIG=PE/Math.sqrt(2*Math.log(2)),R95=SIG*Math.sqrt(-2*Math.log(0.05)),DAYS=[10,30,60],LAT=d=>45-30*Math.min(d/20,1);   /* the fix: its median radius PE; the route's latitude (° N) on day d */
const OUT=path.join(__dirname,'navigation_wempe.json'),VERS=[['last','as last revised (the drawings, the masses set on the TU\'s trial)'],['build40','the 1940s build'],['build','the 1950s build']];
const pct=(a,p)=>{const b=Float64Array.from(a).sort();return b[Math.min(b.length-1,Math.floor(p*b.length))];},f=(x,n=1)=>(+x).toFixed(n),r4=x=>+(+x).toFixed(4);

/* ---------- a child: one version (MC_WREV), its voyages ---------- */
if(process.argv.includes('--one')){
  const EB=require('./wempe_errorbudget.js'),V=EB.nav(),{E,S}=V,rev=process.env.MC_WREV||'last',SUF=rev==='last'?'':'_'+rev;
  const MC=JSON.parse(fs.readFileSync(path.join(__dirname,`montecarlo_wempe${SUF}.json`),'utf8')).swing.after;   /* [5, 50, 95 %] of the swing at the wind's ends after the bench (°) */
  const D=Math.PI/180,mid=[0,1,2].map(i=>(MC.lo[i]+MC.hi[i])/2),mA=mid[1],sdA=(mid[2]-mid[0])/3.29,A1=E.ampAt(1)/D;
  /* the oil's factor at the drive s (wempe_errorbudget.js's oilK at s 1: the rate moved by the drive lost), tabulated against the swing at s once, read between */
  const oilAt=s=>(E.rateAt(E.ampAt(0.95*s),0.95*s)-E.rateAt(E.ampAt(s),s))/0.05,TB=Array.from({length:41},(_,i)=>{const s=0.6+i*0.02;return[E.ampAt(s)/D,oilAt(s)];});
  const oilOf=a=>{if(a<=TB[0][0])return TB[0][1];for(let i=1;i<TB.length;i++)if(a<=TB[i][0])return TB[i-1][1]+(TB[i][1]-TB[i-1][1])*(a-TB[i-1][0])/(TB[i][0]-TB[i-1][0]);return TB[TB.length-1][1];};
  V.reseed(20261025);const mk=rev==='last'?V.adj:FAULT&&rev==='build'?V.drawn:V.adjB,res=[];
  for(let n=0;n<N;n++){const dA=sdA*V.gauss(),rec=[];V.voyage(mk(),{rec,oilK:oilOf(A1+dA)});
    const fx=[0,1,2].map(()=>[SIG*V.gauss(),SIG*V.gauss()]);res.push({rec,dA,fx});}
  const day=Array.from({length:60},(_,d)=>{const lat=LAT(d+1)*D,c=res.map(r=>r.rec[d]/4);return{eq:c.map(Math.abs),route:c.map(x=>Math.abs(x*Math.cos(lat)))};});
  const at=DAYS.map((d,i)=>{const lat=LAT(d)*D,tot=res.map(r=>{const x=r.rec[d-1]/4*Math.cos(lat)+r.fx[i][0];return Math.hypot(x,r.fx[i][1]);});
    return{d,lat:LAT(d),eq:[0.5,0.95].map(p=>pct(day[d-1].eq,p)),route:[0.5,0.95].map(p=>pct(day[d-1].route,p)),total:[0.5,0.95].map(p=>pct(tot,p)),s:[0.5,0.95].map(p=>pct(res.map(r=>Math.abs(r.rec[d-1])),p))};});
  /* the 95 % figure's own sampling error at 30 days: 200 bootstrap resamples of the voyages, its 2.5-97.5 % range (the tool's seed: the same each run) */
  const ci95=(()=>{const a=day[29].eq,b=[];for(let k=0;k<200;k++){const x=new Float64Array(a.length);for(let i=0;i<a.length;i++)x[i]=a[Math.floor(V.rnd()*a.length)];b.push(pct(x,0.95));}return[pct(b,0.025),pct(b,0.975)];})();
  const hist=(()=>{const a=day[29].eq,b={};for(const x of a){const q=Math.min(40,Math.floor(x/0.25));b[q]=(b[q]||0)+1;}return Object.entries(b).map(([q,v])=>[+q*0.25,v/a.length]).sort((x,y)=>x[0]-y[0]);})();
  process.stdout.write(JSON.stringify({rev,n:N,swing:{median:mA,sd:sdA,model:A1},sd:V.SC.sd,drS:V.SC.drS,set:rev==='last'?V.SET0:V.SETB,ci95,
    curve:day.map((q,d)=>({d:d+1,eq:[0.5,0.95].map(p=>pct(q.eq,p)),route:[0.5,0.95].map(p=>pct(q.route,p))})),at,hist}));
  return;}

/* ---------- the parent: the three versions, judged ---------- */
const t0=Date.now(),rows=[],say=s=>rows.push('  '+s);let fail=0;const chk=(ok,s)=>{if(!ok)fail=1;rows.push(`${ok?'  ok ':'  !! '} ${s}`);};
const run=rev=>new Promise((ok,no)=>cp.execFile(process.execPath,[__filename,'--one','--n',String(N),...(FAULT?['--fault']:[])],{cwd:__dirname,env:{...process.env,MC_WREV:rev==='last'?'':rev},maxBuffer:1<<28},
  (e,o,er)=>e?no(Error(`${rev}: ${e.message}\n${er}`)):ok(JSON.parse(o))));
(async()=>{const R=await Promise.all(VERS.map(([v])=>run(v)));
  say(`Navigating by a made Wempe: ${N} made chronometers a version, each rated over 10 days in port and carried 60 days to sea (wempe_errorbudget.js's voyage), the rated rate carried`);
  say(`the fix's own error: Bowditch's probable error of a celestial fix, ±${PE} miles (circular, σ ${f(SIG,2)} a side, 95 % within ${f(R95,2)}); the route 45° N to 15° N by day 20 (estimated)`);
  const C={day:30,median:PE,p95:R95},res={note:'tools/wempe_navigation.js: the error a navigator carries in longitude from a made Wempe, rated in port, and the position with a celestial fix\'s own error',
    n:N,fix:{pe:PE,sigma:r4(SIG),r95:r4(R95),src:'N. Bowditch, The American Practical Navigator, Pub. No. 9 (2019), Vol. 2, Ch. 3, Navigational Errors'},route:'45° N in port to 15° N by day 20, then 15° N (estimated)',criterion:C,versions:{}};
  for(const[i,[v,nm]]of VERS.entries()){const r=R[i],a30=r.at.find(q=>q.d===30),pass=a30.eq[0]<=C.median&&a30.eq[1]<=C.p95;
    say('');say(`${nm}: the masses to ±${r.set}°, its swing after the bench ${f(r.swing.median,1)}° (sd ${f(r.swing.sd,1)}°) against the model's ${f(r.swing.model,1)}°; the cards' scatter ${f(r.sd,3)} s a day`);
    for(const q of r.at)say(`  ${String(q.d).padStart(2)} days: the clock ${f(q.s[0],1)} s (95 % ${f(q.s[1],1)} s): ${f(q.eq[0],2)} miles at the equator (95 % ${f(q.eq[1],2)}), ${f(q.route[0],2)} at ${f(q.lat,0)}° N (${f(q.route[1],2)}); with the fix ${f(q.total[0],2)} miles (95 % ${f(q.total[1],2)})`);
    (v==='build'?chk:(ok,s)=>say(`${ok?'meets':'misses'} it: ${s}`))(pass,`after 30 days the clock's longitude error at the equator ${f(a30.eq[0],3)} miles in the median (under ${C.median}: the fix's probable error) and ${f(a30.eq[1],3)} in 19 voyages of 20 (under ${f(C.p95,3)}: the fix's 95 %; that figure's own sampling range over ${N} voyages ${f(r.ci95[0],2)}-${f(r.ci95[1],2)})`);
    res.versions[v]={name:nm,pass,set:r.set,ci95:r.ci95.map(r4),swing:{median:r4(r.swing.median),sd:r4(r.swing.sd),model:r4(r.swing.model)},at:r.at.map(q=>({d:q.d,lat:q.lat,s:q.s.map(r4),eq:q.eq.map(r4),route:q.route.map(r4),total:q.total.map(r4)})),
      curve:r.curve.map(q=>({d:q.d,eq:q.eq.map(r4),route:q.route.map(r4)})),hist:r.hist.map(([x,y])=>[x,r4(y)])};}
  if(FAULT)say('(--fault: the 1950s build\'s masses left at their drawn place)');
  else{const js=JSON.stringify(res,null,1)+'\n';if(process.argv.includes('--write')){fs.writeFileSync(OUT,js);say('wrote tools/navigation_wempe.json');}
    else chk(fs.existsSync(OUT)&&fs.readFileSync(OUT,'utf8')===js,'tools/navigation_wempe.json is what this run finds (else: node wempe_navigation.js --write)');}
  const jo=process.argv.indexOf('--json');if(jo>0)fs.writeFileSync(process.argv[jo+1],JSON.stringify(res));
  console.log(rows.join('\n'));console.log(`  (${f((Date.now()-t0)/1000,0)} s)`);process.exitCode=fail;})().catch(e=>{console.error(e.message);process.exitCode=1;});
