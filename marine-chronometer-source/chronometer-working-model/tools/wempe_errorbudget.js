// Would the Wempe pass its trial, and keep time at sea? errorbudget.js's method for the Wempe (Node.js, no browser):
//   node wempe_errorbudget.js           (about 30 s; exits with 1 if the model as adjusted fails the TU's trial)
//   node wempe_errorbudget.js --n 4000  (more trials and voyages)
// 1. The TU's trial (the 6MX's TU 25-07-1533-84, 6MX-figures.md; GOST 8916-58's class II): 35 days in five periods of seven at 36, 20, 4, 20 and 36 °C, the first two days
//    of each not counted; wound daily after the comparison to "8" on the up-and-down dial (8 h short of full wind: the spring runs between 8 and 32 h down), to "0" at
//    each period's end; daily rates read to 0.01 s. Its figures, losing positive: E the mean of |each counted rate - its period's mean| (±0.35), R = ω_V - ω_I (±2.00),
//    D the largest change between consecutive rates in a period (±2.30), C = (ω36 - ω4)/32 (±0.10 s a day a °C), S = (ω36 + ω4)/2 - ω20 (±1.20), every period's mean
//    within ±3.50, and N = 42E + 4.5R + 60C + 2.4S ≤ 30. Each day's rate (gaining positive here) is the sum of
//      the temperature curve    [wempe_thermal.js: the masses at their compensating place, set by an adjuster on trial to ±0.25° (estimated) of it, so C's residual;
//                                the secondary error S of Guillaume's integral balance, +0.46 to +0.68 s (estimated); the drawn place's -3.0 s a day a °C beside it]
//      the air's density        [it falls 11 % from 4 to 36 °C and takes its share of the balance's damping (wempe_escapement.js's parts): the swing, through makeEsc]
//      the swing over the wind  [the drawn spring's isochronism, -0.72 s a day for each 10° (wempe_hairspring.js: WESC.SET.HS) with the escapement's own, makeEsc's rate at
//                                05 06_20's drive each hour: the day's mean from 8 to 32 h, and 0 to 24 h on the first day of a period]
//      scatter and drift        [the Hamilton's, calibrated on No. 3390's card as errorbudget.js calibrates them: an estimate, no Wempe card being to hand]
//      the barometer, the oil   [the Hamilton's estimates: 1 % of air density day to day; the drive lost 0-10 % a year as the oil thickens; through makeEsc]
// 2. At sea: errorbudget.js's voyage (60 days from a port at 55 °F into the tropics at 85 °F, rated over 10 days in port), with these terms and the sea's (the gimbals'
//    heavy sea, gimbals.js --model wempe's "beyond NORDFORSK's limit", one day in five, through makeEsc as wempe_gimbals.js works it). 4 s of time is a mile of longitude.
const fs=require('fs'),path=require('path'),W=require('./wempe_load.js')(),P=W.WPHYS,E=P.ESC,S=P.SET,TH=require('./wempe_thermal.js');
const rd=f=>fs.readFileSync(path.join(__dirname,'..','js',f),'utf8'),app=rd('app.js'),core=rd('core.js');
const f=(x,n=2)=>Number.isFinite(+x)?(+x).toFixed(n):'-',sg=(x,n=2)=>(x>=0?'+':'−')+Math.abs(x).toFixed(n),rows=[];let fail=0;
const say=s=>rows.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;rows.push(`${ok?'  ok ':'  !! '} ${s}`);},head=s=>rows.push('\n'+s),t0=Date.now();
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?+process.argv[i+1]:d;},NV=arg('--n',2000);
let seed=20261015;const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
const gauss=()=>{let u=0;while(!u)u=rnd();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*rnd());};
const pct=(a,p)=>{const b=[...a].sort((x,y)=>x-y);return b[Math.min(b.length-1,Math.floor(p*b.length))];},D=Math.PI/180;

head('The rate\'s parts, from the model (makeEsc with the Wempe\'s settings; wempe_thermal.js)');
const r0=E.rateAt(E.ampAt(1),1),T0=0.5,Q0=Math.PI*S.TF/T0;
/* the air's share of the damping: wempe_escapement.js's parts at the model's swing (air Q 1,036-1,812 over Cd 1.4-0.8; the model's Q its total's middle) */
const qAir=Math.sqrt(1036*1812),share=Q0/qAir;
/* a relative change x of the air's density: 1/Q moves by share x/Q0, the swing solved at the new TF, the rate at it (s a day for x = 1) */
const airK=(()=>{const x=0.02,TF2=(1/(1/Q0+share*x/Q0))*T0/Math.PI,E2=W.makeEsc({...S,TF:TF2},S);return(E.rateAt(E2.A,1)-r0)/x;})();
const rho=T=>293.15/(273.15+T)-1,air=T=>airK*rho(T);   /* the air's density at T against 20 °C, at the same pressure */
say(`the air takes ${f(100*share,0)} % of the balance's damping (Q ${f(Q0,0)} against the air's ${f(qAir,0)}); 1 % denser air: ${sg(airK/100,4)} s a day; from 20 °C to 4 °C the air is ${f(100*rho(4),1)} % denser (${sg(air(4),3)} s a day), at 36 °C ${f(-100*rho(36),1)} % thinner (${sg(air(36),3)})`);
/* the swing over the wind: hourly, h hours from full wind */
const rAt=h=>{const s=P.drv(h/P.HPT);return E.rateAt(E.ampAt(s),s)-r0;},mean=(a,b)=>{let x=0,n=0;for(let h=a;h<b;h+=0.25){x+=rAt(h+0.125);n++;}return x/n;};
const w8=mean(8,32),w0=mean(0,24);
say(`the swing over the daily wind: wound daily to "8", the spring runs from 8 to 32 h down: the swing ${f(E.ampAt(P.drv(8/P.HPT))/D,1)}° to ${f(E.ampAt(P.drv(32/P.HPT))/D,1)}°, the rate ${sg(rAt(8),3)} to ${sg(rAt(32),3)} s a day against 12 h (the drawn spring's ${S.HS} s a day for each 10° with the escapement's own): the day's mean ${sg(w8,3)}, every day the same; on a period's first day, wound to "0" the evening before, ${sg(w0,3)} (0 to 24 h: not counted)`);
/* the oil: the drive lost as it thickens, at the drive s */
const oilK=(()=>{const s=0.95,a=E.ampAt(s);return(E.rateAt(a,s)-r0)/0.05;})();   /* s a day for each unit of the drive lost */
say(`the oil thickening (the Hamilton's estimate: the drive lost 0-10 % a year): 1 % of the drive lost costs the swing ${f((E.ampAt(1)-E.ampAt(0.99))/D,2)}° and moves the rate ${sg(oilK/100,4)} s a day`);
/* temperature (wempe_thermal.js): the linear term at the compensating place nulled by the adjuster, to ±0.25° of the masses' place (estimated: the rim's "8 Körner in 60
   Teilung", eight punch marks of a 60-division, 6° a division, the masses set between them by trial); the secondary error as Guillaume's integral balance made it (estimated) */
const LIN=TH.linear,SEC=TH.secondary,perDeg=Math.abs(LIN.perDeg),SET0=0.25,cRes=perDeg*SET0,Sint=SEC.Sintegral;
say(`temperature (wempe_thermal.js): at the masses' drawn place (30° from the cuts' line, Wempe 3955's) the balance ${LIN.drawn<0?'loses':'gains'} ${f(Math.abs(LIN.drawn),2)} s a day a °C; they null it at ${f(90-LIN.zero,1)}° from the cuts' line, a degree along the rim ${f(perDeg,3)} s a day a °C. The rim is graduated "8 Körner in 60 Teilung" (05 03 01-1: eight punch marks of a 60-division, 6° a division, ${f(6*perDeg,2)} s a day a °C each): the adjuster sets the masses between them by trial, to ±${SET0}° (estimated), so C's residual within ±${f(cRes,3)}. The secondary error (Guillaume's integral balance, estimated) S ${sg(Sint[0],2)} to ${sg(Sint[1],2)} s, a steel spring on a brass and plain nickel steel rim ${sg(SEC.Splain[0],2)} to ${sg(SEC.Splain[1],2)}`);
console.log(rows.splice(0).join('\n'));

/* ---------- the scatter and drift: the Hamilton's, calibrated as errorbudget.js calibrates them on No. 3390's card (its 30-day Navy test) ---------- */
const c2H=+/uncut:t=>(-?[\d.]+)\*\(t-72\.5\)\*\*2/.exec(core)[1],card=Function('return '+/C3390=(\{[^}]*\})/.exec(app)[1])(),c1card=(-0.02-0.00)/35,TS=[90,72.5,55,55,72.5,90];
function navy(p){let e=0,day=0;const q=v=>Math.round(v*100)/100,Pp=TS.map(T=>{const e0=e,rs=[];for(let d=0;d<5;d++){day++;const r=p.c1*(T-72.5)+c2H*(T-72.5)**2+p.dr*day+p.sd*gauss();const e1=q(e+r);rs.push(q(e1-e));e=e1;}
  const m=(e-e0)/5;return{m,dev:rs.reduce((a,x)=>a+Math.abs(x-m),0)/5};});return{dev:Pp.reduce((a,x)=>a+x.dev,0)/6,rec:Math.max(Math.abs(Pp[0].m-Pp[5].m),Math.abs(Pp[1].m-Pp[4].m),Math.abs(Pp[2].m-Pp[3].m))};}
const med=(p,k,n=600)=>pct([...Array(n)].map(()=>navy({...p,dr:p.drS*gauss()})[k]),0.5);
const SC=(()=>{const p={c1:c1card,sd:0.04,drS:0.002};for(let it=0;it<3;it++){let a=0.001,b=1;for(let i=0;i<14;i++){const m=Math.sqrt(a*b);med({...p,sd:m},'dev')<card.dev?a=m:b=m;}p.sd=Math.sqrt(a*b);
  a=1e-5;b=0.05;for(let i=0;i<14;i++){const m=Math.sqrt(a*b);med({...p,drS:m},'rec')<card.rec?a=m:b=m;}p.drS=Math.sqrt(a*b);}return p;})();
/* the barometer (1 % of the air's density day to day, a few days' memory: the Hamilton's estimate) */
const baro=()=>{let b=gauss()*0.01;return()=>(b=0.7*b+0.71*0.01*gauss());};

/* ---------- 1. the TU's trial ---------- */
head('1. The TU\'s trial: 35 days at 36/20/4/20/36 °C, the first two days of each period not counted, wound daily to "8" (the 6MX\'s TU, 6MX-figures.md)');
say(`scatter ${f(SC.sd,3)} s a day and drift ±${f(SC.drS*1000,2)} ms a day each day: the Hamilton's, calibrated on No. 3390's card (rating ${card.dev}, recovery ${card.rec}) as errorbudget.js does, taken for the Wempe (estimated: no Wempe card to hand)`);
const TU=[36,20,4,20,36],LIM={E:0.35,R:2.00,D:2.30,C:0.10,S:1.20,w:3.50,N:30};
/* a chronometer: o.c1 its linear term (s a day a °C gained, against 20 °C), o.Sv its secondary error (s, losing at the extremes), o.k the scatter and drift's scale, o.only one term */
function trial(o){const use=k=>!o.only||o.only===k,c2=-o.Sv/256,dr=o.k*SC.drS*gauss(),oil=0.10*rnd(),off=(rnd()-0.5)*1.0,b=baro();   /* off: the regulation at 20 °C, ±0.5 s a day (estimated) */
  const q=v=>Math.round(v*100)/100;let e=0,day=0;const per=[];
  for(const T of TU){const rs=[];for(let d=0;d<7;d++){day++;let r=off;
      if(use('temp'))r+=o.c1*(T-20)+c2*(T-20)**2+air(T);if(use('wind'))r+=d===0&&day>1?w0:w8;if(use('scatter'))r+=o.k*SC.sd*gauss();if(use('drift'))r+=dr*day;
      if(use('baro'))r+=airK*b();if(use('oil'))r+=-oil*day/365*oilK;const e1=q(e-r);rs.push(q(e1-e));e=e1;}   /* the error, losing positive as the TU counts it, read to 0.01 s */
    per.push(rs.slice(2));}
  const m=per.map(rs=>rs.reduce((a,x)=>a+x,0)/rs.length),Ev=per.reduce((a,rs,k)=>a+rs.reduce((s,x)=>s+Math.abs(x-m[k]),0),0)/25;
  const Dv=Math.max(...per.map(rs=>Math.max(...rs.slice(1).map((x,i)=>Math.abs(x-rs[i]))))),w36=(m[0]+m[4])/2,w20=(m[1]+m[3])/2,w4=m[2];
  const r={E:Ev,R:m[4]-m[0],D:Dv,C:(w36-w4)/32,S:(w36+w4)/2-w20,w:Math.max(...m.map(Math.abs))};r.N=42*Math.abs(r.E)+4.5*Math.abs(r.R)+60*Math.abs(r.C)+2.4*Math.abs(r.S);
  r.pass=['E','R','D','C','S','w'].every(k=>Math.abs(r[k])<=LIM[k])&&r.N<=LIM.N;return r;}
const adj=()=>({c1:-(air(36)-air(4))/32+(2*rnd()-1)*cRes,Sv:Sint[0]+(Sint[1]-Sint[0])*rnd(),k:1});   /* adjusted: the masses null the whole linear term, the air's with the balance's */
const drawn=()=>({c1:LIN.drawn,Sv:Sint[0]+(Sint[1]-Sint[0])*rnd(),k:1});
const many=(mk,n=NV)=>[...Array(n)].map(()=>trial(mk()));
const show=(nm,R)=>{const md=k=>pct(R.map(r=>r[k]),0.5),p95=k=>pct(R.map(r=>Math.abs(r[k])),0.95),pass=R.filter(r=>r.pass).length/R.length;
  say(`${nm}: (median, and 95 % of |x|) E ${f(md('E'),3)} (${f(p95('E'),3)}), R ${sg(md('R'),2)} (${f(p95('R'),2)}), D ${f(md('D'),2)} (${f(p95('D'),2)}), C ${sg(md('C'),3)} (${f(p95('C'),3)}), S ${sg(md('S'),2)} (${f(p95('S'),2)}), the largest period mean ${f(md('w'),2)} (${f(p95('w'),2)}), N ${f(md('N'),1)} (${f(p95('N'),1)}); it passes ${f(100*pass,1)} % of ${R.length} trials`);return pass;};
say(`the TU's limits: E ±${LIM.E}, R ±${LIM.R}, D ±${LIM.D}, C ±${LIM.C} s a day a °C, S ±${LIM.S}, each period's mean ±${LIM.w}, N = 42E + 4.5R + 60C + 2.4S ≤ ${LIM.N}`);
const RA=many(adj),pA=show('as adjusted (the masses at their compensating place)',RA);
const RD=many(drawn,Math.min(NV,500));show('the masses at their drawn place',RD);
say(`  at the drawn place C is ${sg(pct(RD.map(r=>r.C),0.5),2)} (the balance losing as it warms), N ${f(pct(RD.map(r=>r.N),0.5),0)}: the drawn place fails the TU by its temperature coefficient alone; the adjuster's trial moves them ${f(LIN.zero-60,0)}° along the rim toward the cuts, about ${f((LIN.zero-60)/6,1)} divisions of the graduation`);
say('what each source adds, as adjusted (median, alone):');
for(const[k,nm]of[['temp','the temperature curve (the residual C, S and the air)'],['wind','the swing over the daily wind'],['scatter','day-to-day scatter'],['drift','drift'],['baro','the barometer'],['oil','the oil thickening']]){
  const R=[...Array(Math.min(NV,600))].map(()=>trial({...adj(),only:k})),md=x=>pct(R.map(r=>Math.abs(r[x])),0.5);say(`  ${nm.padEnd(52)} E ${f(md('E'),3)}, R ${f(md('R'),3)}, D ${f(md('D'),2)}, C ${f(md('C'),3)}, S ${f(md('S'),2)}, N ${f(md('N'),1)}`);}
/* how far the scatter and drift could grow before the adjusted chronometer passes only half the time */
const kHalf=(()=>{let a=1,b=60;for(let i=0;i<12;i++){const m=Math.sqrt(a*b),R=[...Array(400)].map(()=>trial({...adj(),k:m}));R.filter(r=>r.pass).length/R.length>0.5?a=m:b=m;}return Math.sqrt(a*b);})();
say(`a borderline chronometer: with the scatter and drift ${f(kHalf,1)} times the card's (${f(kHalf*SC.sd,2)} s a day, ±${f(kHalf*SC.drS*1000,1)} ms a day each day) the adjusted Wempe passes half its trials`);
chk(pA>=0.95,`as adjusted the model passes the TU's trial in ${f(100*pA,1)} % of trials (wanted 95 %): its figures are the temperature curve's and the card's scatter; the drawn place of the masses would not`);
console.log(rows.splice(0).join('\n'));console.log(`  (${f((Date.now()-t0)/1000,0)} s)`);

/* ---------- 2. at sea ---------- */
head('2. At sea: 60 days from a port in winter (55 °F, 12.8 °C) into the tropics (85 °F, 29.4 °C), rated over 10 days in port, the error the navigator carries (errorbudget.js\'s voyage)');
/* the heavy sea, as the gimbals pass it on: gimbals.js --model wempe's "a cargo ship beyond" NORDFORSK's limit, 120 s, through makeEsc as wempe_gimbals.js works it */
const seaK=(()=>{const av=process.argv.slice();process.argv.push('--model','wempe');const G=require('./gimbals.js');process.argv.length=0;process.argv.push(...av);
  const r=G.run(G.bodies(),G.ship({Tr:14,roll:8,Tp:8,pitch:3,Ty:14,yaw:2,Th:8,heave:0.15,rd:8,lz:20},7),{T:140,from:20,rec:0.002,stop:60}),R=r.rec,mB=(()=>{const J=JSON.parse(fs.readFileSync(path.join(__dirname,'wempe_inertia.json'),'utf8'));return(J.balance.m+J.rollers.m+J.collet.m+J.spring.m/2)/1000;})();
  const Eb=E.kB*E.A*E.A/2,Qx=2*Math.PI*Eb/(4*0.15*mB*9.80665*0.05*0.105e-3*E.A),E2=W.makeEsc({...S,TF:(1/(1/Q0+1/Qx))*T0/Math.PI},S),dRf=(E.rateAt(E2.A,1)-r0)/0.05;
  let fa=0;for(const q of R)fa+=Math.hypot(q[3],q[4])/9.80665;fa/=R.length;return{k:dRf*fa,fa,lat:r.boxLat};})();
say(`heavy weather (the gimbals in a sea beyond NORDFORSK's limit, ${f(seaK.lat,2)} g rms athwartships at the box): ${f(seaK.fa*1000,1)} mg across the staff on average, ${sg(seaK.k,4)} s a day (the balance's pivots loaded sideways, makeEsc)`);
const TV=d=>d<0?12.8:12.8+16.7*Math.min(d/20,1)+1.7*gauss();   /* its box's daily mean (°C): errorbudget.js's 55 → 85 °F over 20 days, ±3 °F */
function voyage(p,on={}){const use=k=>!on.only||on.only===k,days=60,port=10,rates=[];const c2=-p.Sv/256,dr=p.k*SC.drS*gauss(),oil=0.10*rnd(),b=baro();
  for(let d=-port;d<days;d++){const T=TV(d);let r=w8;if(use('temp'))r+=p.c1*(T-20)+c2*(T-20)**2+air(T);if(use('scatter'))r+=p.k*SC.sd*gauss();if(use('drift'))r+=dr*(d+port);
    if(use('baro'))r+=airK*b();if(use('oil'))r+=-oil*(d+port)/365*oilK;if(use('sea')&&d>=0&&rnd()<0.2)r+=seaK.k;rates.push(r);}
  const rated=rates.slice(0,port).reduce((a,x)=>a+x,0)/port;let e=0;const out={};for(let d=0;d<days;d++){e+=rates[port+d]-rated;if(d===9||d===29||d===59)out[d+1]=e;}return out;}
const runV=(mk,on)=>{const R=[...Array(NV)].map(()=>voyage(mk(),on));return k=>R.map(r=>Math.abs(r[k]));};
const line=(nm,mk)=>{const r=runV(mk,{});say(`${nm.padEnd(40)} ${[10,30,60].map(k=>{const a=r(k);return`${k} days: ${f(pct(a,0.5),1)} s (${f(pct(a,0.5)/4,1)} mi), 95 % ${f(pct(a,0.95),1)} s (${f(pct(a,0.95)/4,1)} mi)`;}).join('; ')}`);return r;};
say(`the error the navigator carries (median, and 95 % of ${NV} voyages; in miles of longitude on the equator, 4 s of time a mile):`);
const v1=line('as adjusted, the card\'s scatter',adj);line(`borderline (the scatter ×${f(kHalf,1)})`,()=>({...adj(),k:kHalf}));line('the masses at their drawn place',drawn);
say('what each source adds at 30 days, as adjusted (median |error|, alone):');
for(const[k,nm]of[['temp','the temperature curve (12.8 → 29.4 °C)'],['scatter','day-to-day scatter'],['drift','drift'],['oil','the oil thickening'],['baro','the barometer'],['sea','heavy weather one day in five']]){
  const a=runV(adj,{only:k})(30);say(`  ${nm.padEnd(40)} ${f(pct(a,0.5),2)} s`);}
{const m30=pct(v1(30),0.5);chk(m30<30,`as adjusted it carries ${f(m30,1)} s (${f(m30/4,1)} miles of longitude) after a month at sea, under 30 s (7½ miles; errorbudget.js's test for the Hamilton): most of it the residual of the masses' setting (±${SET0}°, estimated: ±0.1° would leave two fifths of it)`);}
console.log(rows.join('\n'));console.log(`  (${f((Date.now()-t0)/1000,0)} s)`);if(fail)process.exitCode=1;
