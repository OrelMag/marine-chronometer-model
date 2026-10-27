// How closely the Wempe's parts the drawings don't size, or size without a tolerance that matters, must be made: tolerances.js's method for the Wempe (Node.js, no
// browser; tools/wempe_load.js runs the Wempe page's own scripts). From the Wempe's escapement as the page runs it (WPHYS.ESC: makeEsc with WESC.SET, driven by
// 05 06_20's force through the train), its atK: the swing and rate with the escape wheel's torque s times the reference's and the detent's and gold spring's stiffness
// kd and kp times the drawn (a strip's stiffness goes as its thickness cubed, the preload left as set). Each part's range is the one that keeps the swing in a band over
// the whole wind (the drive from 05 06_20 at every hour, 0-56 h):
//   the guard band, 180-270° (wempe_escapement.js's: the model's own swing is under the sources' band, so the guard is set 14° under the reference's 194.3°; 185° under 199.4° until the lock was re-laid, the preload set to 0.8 g and TF refitted to 111 s, 19 October 2026, and 193° under 207° until 15 October 2026);
//   and the sources' band, 225-270° (the 1954 Soviet instruction for chronometers in general; the Hamilton manual's 247.5-270°), reported: the model is under it (open).
// The parts: the mainspring's strip (05 06_20's "15 × 0,37", no tolerance) against 05 06_20's measured pull; the detent's spring (1436's "0,07", faint, its other figure
// "0,09") and its preload (the banking, not drawn: WESC.SET.W78 0.8 g at the stone, estimated); the gold spring (05 04 01-2: 0.15, sure; its 333 gold's modulus, 98 GPa,
// likely); the depth of lock (05 04_1: 0.235, set by the banking against a wheel 14 +0.03); the hairspring's strip and coil (05 03_6: 0.285, boxed, no tolerance;
// the coil Ø 12.8 ±0.05, boxed) against the period, which the timing weights must take up. Into tools/tolerances_wempe.json for the Wempe's verification report and
// wempe_bench.js, wempe_montecarlo.js:
//   node wempe_tolerances.js            prints the analysis; exit 1 if tools/tolerances_wempe.json is not what it finds
//   node wempe_tolerances.js --write    writes it
// About 30 s (the Wempe's escapement solves slowly: each atK about 0.15 s, each makeEsc built about 0.5 s).
const fs=require('fs'),path=require('path'),W=require('./wempe_load.js')(),{WPHYS:P,WESC}=W,E=P.ESC,S=P.SET,PHY=require('./wempe_physics.js');
const D=180/Math.PI,G0=9.80665,f=(x,n=2)=>Number.isFinite(+x)?(+x).toFixed(n):'-',sg=(x,n=2)=>(x>=0?'+':'−')+Math.abs(x).toFixed(n),pc=x=>(x>=1?'+':'−')+f(Math.abs(x-1)*100,0)+' %',r4=x=>+(+x).toFixed(4);
const rows=[],say=s=>rows.push('  '+s),head=s=>rows.push('\n'+s),tStart=Date.now();
const GUARD=[180,270],SRC=[225,270];
/* a build (MC_WREV=build40 or build: PLAN-wempe-navigation.md, README "The build"): its own file, its strip (WESC.BSEL), and the figures the drawn version takes from
   wempe_tripping.js's runs from its own (tools/wempe_build.json: the held tooth's ring, the preload's floors) */
const BREV=/^build/.test(process.env.MC_WREV||'')?process.env.MC_WREV:'',SUF=BREV?'_'+BREV:'',BJ=BREV?JSON.parse(fs.readFileSync(path.join(__dirname,'wempe_build.json'),'utf8')).builds[BREV]:null,STRIP=BREV&&WESC.BSEL.strip;
/* the drive over the wind (05 06_20 through the train, times the reference's at 12 h): its least and greatest, every quarter hour from full wind to run down */
const HRS=P.MF*P.HPT,dr=[];for(let h=0;h<=HRS+1e-9;h+=0.25)dr.push(P.drv(h/P.HPT));const dmin=Math.min(...dr),dmax=Math.max(...dr),hMin=dr.indexOf(dmin)/4,hMax=dr.indexOf(dmax)/4;
/* the value of x at which g(x) crosses y, g monotone between a and b */
const cross=(g,y,a,b,n=30)=>{let ga=g(a)-y;for(let i=0;i<n;i++){const m=(a+b)/2,gm=g(m)-y;if((gm>0)===(ga>0)){a=m;ga=gm;}else b=m;}return(a+b)/2;};
const A=(s,kd=1,kp=1)=>E.atK(s,kd,kp).A*D,sAt=a=>cross(s=>E.ampAt(s)*D,a,0.3,3,40);   /* the swing at drive s; the drive that swings a */
const over=(s,kd=1,kp=1)=>[A(s*dmin,kd,kp),A(s*dmax,kd,kp)];   /* the swing at the wind's least and greatest drive */
const A0=over(1);
head('The swing\'s band over the wind');
say(`the drive over the wind (05 06_20 through the train): ${f(dmin,3)} of the reference at ${f(hMin,1)} h to ${f(dmax,3)} at ${f(hMax,1)} h; the swing ${f(A0[0],1)}-${f(A0[1],1)}° (at 12 h ${f(E.A*D,1)}°)`);
say(`the guard band ${GUARD.join('-')}° (wempe_escapement.js's: the model's own swing is under the sources'), and the sources' ${SRC.join('-')}° (the 1954 instruction; the Hamilton manual 247.5-270°), reported`);

/* ---------- the mainspring ---------- */
head('The mainspring (05 06_20: "Zugfeder 15 × 0,37", no tolerance; its length on no sheet, solved 1,240 mm)');
/* its torque goes as E b t³ (the fusee evening its shape as drawn, set up ¾ turn as the sheet says), so the drive does: s = (t / t0)³ at the drawn width and length */
const sLo=sAt(GUARD[0])/dmin,sHi=sAt(GUARD[1])/dmax,sLoS=sAt(SRC[0])/dmin,t0=STRIP?STRIP.t:0.37,tm=PHY.LV.tMid;
const gMean=P.KV.reduce((a,x)=>a+x[1],0)/P.KV.length,gFull=P.KV[P.KV.length-1][1],gLow=Math.min(...P.KV.map(x=>x[1]));
const sM=6*PHY.MupM/(15e-3*(t0*1e-3)**2),sLim=STRIP?[STRIP.lim,STRIP.lim]:[2.5e9,2.6e9],sStress=(sLim[1]/sM)**3;   /* the strip's stress fully wound at the measured level (wempe_physics.js), and the drive at which a strip of the same curvature (stress as t, torque as t³) reaches a mainspring's limit */
const sTop=Math.min(sHi,sStress),rLo=E.atK(sLo).rate,rHi=E.atK(sTop).rate;
say(`the swing stays in the guard band over the whole wind for a drive ${f(sLo,3)}-${f(sHi,3)} of 05 06_20's (${pc(sLo)} to ${pc(sHi)}); the strip's stress fully wound at the measured level is ${f(sM/1e9,2)} GPa (wempe_physics.js), which a strip of the same set reaches at a mainspring's limit, 2.6 GPa, at ${f(sStress,3)} of the drive: ${sStress<sHi?'the stress, not the swing, sets the top':'under the swing\'s top'}`);
say(`  so ${f(sLo,3)}-${f(sTop,3)} (${pc(sLo)} to ${pc(sTop)}): the strip ${f(t0*Math.cbrt(sLo),3)}-${f(t0*Math.cbrt(sTop),3)} mm at the drawn 15 mm and solved 1,240 mm, if 0.370 gives the measured pull; at the measured level the solved spring's strip is ${f(tm,3)} (wempe_physics.js), so ${f(tm*Math.cbrt(sLo),3)}-${f(tm*Math.cbrt(sTop),3)} on it`);
say(`  read as 05 06_20 reads it (g on a 262 mm lever on the fusee arbor, running down): its 24 readings' mean ${f(gMean,1)} g (the sheet's own 131.5) within ${f(gMean*sLo,1)}-${f(gMean*sTop,1)} g, fully wound ${f(gFull,1)} within ${f(gFull*sLo,1)}-${f(gFull*sTop,1)}; the escapement's rate at the 12 h reference moves ${sg(rLo,2)} to ${sg(rHi,2)} s a day there (the timing takes it up)`);
say(`  the sources' band wants at least ${f(sLoS,3)} of the measured drive at the wind's lowest (${pc(sLoS)}: the strip ${f(t0*Math.cbrt(sLoS),3)} mm on the drawn 0.370, ${f(gMean*sLoS,1)} g mean on 05 06_20's lever)${sLoS>sStress?`, past the stress limit's ${f(sStress,3)}: not by the strip alone`:`, just under the stress limit's ${f(sStress,3)}`}: the drive's level is the open question (README, Unresolved)`);

/* ---------- the detent's spring and its preload ---------- */
head('The detent\'s spring (1436: "0,07", faint; its other figure "0,09") and its preload (the banking, not drawn)');
const td=(S.SN1-S.SN0)*S.ES,kdHi=cross(k=>A(dmin,k,1),GUARD[0],1,60,26),tdHi=td*Math.cbrt(kdHi),k09=(0.09/td)**3,A09=over(1,k09,1),Ak0=A(1,1e-6,1);
say(`its stiffness E b t³/12 L (steel, 1.9 wide, 5 long) goes as its thickness cubed; the preload is the banking's (makeEsc's W78, ${S.W78} g at the stone, estimated), left as set. The swing stays above ${GUARD[0]}° at the wind's lowest drive up to ${f(kdHi,1)} times the drawn stiffness (${f(tdHi,3)} mm thick); with no stiffness at all it swings ${f(Ak0,1)}° at 12 h: its work sets no lower limit`);
say(`  1436's other figure, 0.09 (${f(k09,2)} times as stiff): ${f(A09[0],1)}-${f(A09[1],1)}° over the wind; the spring's lower limit is the detent's return in time, which dynamics.js --model wempe checks from half to twice the drawn stiffness (${f(td/Math.cbrt(2),3)}-${f(td*Math.cbrt(2),3)} mm): home before the next tooth over all of it`);
/* the preload: makeEsc rebuilt with W78 (OP78 0: the preload itself, g at the stone). wempe_tripping.js's sweep with the lock re-laid at 0.235 (19 October 2026, at the 0.8 g
   estimate) has a held tooth's stone ring 49 % of the depth of lock, under half from 0.98 times it (0.78 g: the margin's floor; 0.8× 56 %, 1.5× 35 %), and a 3 ms blow of 20 g let
   no tooth go from under 0.8 times it (0.64 g: the knock's floor, its sweep's lowest; 22.6 g there, 25.6 g at the estimate). Before (18 October 2026, the horn curved and the gold spring's bow closing
   onto it near its end, as escapement.js draws them) has a held tooth's stone ring 44 % of the depth of lock at the estimate, under its margin of half from about 0.81 times it
   (0.51 g; 0.5× 73 %, 0.8× 50.4 %), and teeth get past at 0.2× and under (0.2×, 0.1× and none): the margin's floor is the least (0.49 g, 0.78×, with the straight horn and the
   gold spring lying along it, until 18 October 2026; its 0.72 g, 1.1 times, was for the banking under the blade, before; the estimate itself until 16 October 2026, the sweep
   not run under it). The knock's floor (18 October 2026, the user's choice): wempe_tripping.js's 3 ms blow across the plate lets a tooth go at 17.9 g at 0.8× the estimate,
   20.4 g at it and 22.6 g at 1.2× (17.6, 20.0, 22.5 before the horn was traced), so a preload that takes the 20 g its check asks wants about 0.97 times the estimate (0.61 g),
   the margin a hair at the estimate. The floor is the higher of the two.
   The swing falls as the preload grows (the stone pressed on the tooth it has let go, RW) */
const preA=w=>{const e=W.makeEsc({...S,W78:w},S);return[e.ampAt(dmin)*D,e.ampAt(dmax)*D,e.A*D];},wTrip=BJ?BJ.floor.margin:0.78,wKnock=BJ?BJ.floor.knock:0.64,wLo=Math.max(wTrip,wKnock);
/* the preload's ceiling (25 October 2026): dynamics.js's stone landing on the escaping tooth's back with brass's restitution, 0.80-0.95 (King, White, Maxwell and Menon, EPL 93,
   14002, 2011), lands on it during the impulse from 0.85 g (at 0.80 restitution; 1.0 g at 0.95) and never at 0.80 g: above it the models part (the README's Closed). The lower of
   that and the swing's ceiling */
const WBACK=0.80,wSw=cross(w=>preA(w)[0],GUARD[0],S.W78,4,14),wHi=Math.min(wSw,WBACK),PRE=[0.3,S.W78,1.0,1.5].map(w=>({w:r4(w),A:preA(w).map(r4)}));
say(`the preload: ${PRE.map(p=>`${p.w} g ${f(p.A[0],1)}-${f(p.A[1],1)}°`).join(', ')} over the wind; at least ${f(wLo,2)} g, the higher of the margin's floor, ${f(wTrip,2)} g (wempe_tripping.js: a held tooth's stone rings under half the depth of lock from there, 49 % at the estimate ${S.W78} g; at 0.2 times the estimate and under teeth get past), and the knock's, ${f(wKnock,2)} g (a 3 ms blow of 20 g across the plate lets no tooth go from there: 25.6 g at the estimate), at most ${f(wHi,2)} g, the lower of the stone's landing on the escaping tooth's back during the impulse, which it never does up to ${f(WBACK,2)} g (dynamics.js, brass's restitution 0.80-0.95), and the swing at the wind's lowest at ${GUARD[0]}° (${f(wSw,2)} g)`);

/* ---------- the gold spring ---------- */
head(`The gold spring (05 04 01-2: 0.15 thick, sure; 333 gold, its modulus ${S.ET} GPa: Au/Ag/Cu 333-333, likely)`);
const kpHi=cross(k=>A(dmin,1,k),GUARD[0],1,30,26),Ap0=A(1,1,1e-6),Ap5=over(1,1,0.5);
say(`it bends on the return swing as the discharge stone passes and its work is lost: the swing stays above ${GUARD[0]}° at the wind's lowest drive up to ${f(kpHi,2)} times its stiffness (E t³: the strip ${f(0.15*Math.cbrt(kpHi),3)} mm at ${S.ET} GPa, or the alloy's modulus ${f(S.ET*kpHi,0)} GPa at 0.15); with none ${f(Ap0,1)}° at 12 h; half as stiff ${f(Ap5[0],1)}-${f(Ap5[1],1)}° over the wind`);
say(`  softer is free for the swing but not for the lock: wempe_tripping.js's sweep (19 October 2026, the lock 0.235 and the preload 0.8 g) has a held tooth's stone ringing 71 % of the depth of lock with the gold spring half as stiff, against 49 % as drawn (64 % and 44 % at 0.175 and 0.63 g; 51 % and 42 % with the straight horn): its alloy's modulus is the open part (README, Unresolved)`);

/* ---------- the depth of lock ---------- */
head(`The depth of lock (05 04_1: the tips ${f(S.dL*S.ES,3)} into the stone's flat; the wheel Ø 14 +0.03, 05 04_23; the banking sets it)`);
/* makeEsc rebuilt with dL (the stone's place against the tips): the deepest that still unlocks (the discharge stone lifts the gold spring's tip, and the stone with it, only so far)
   and keeps the swing in the guard band at the wind's lowest (since 26 October 2026: past about 0.243 the escapement in time collapses to about 70°, the tooth landing on the impulse
   stone at once and the detent leaving the discharge stone early, on main's escape wheel as on the drawn one; makeEsc follows it since its ride carries through the impulse, RWD),
   and the shallowest that keeps a held tooth's stone ringing under half the depth (wempe_tripping.js as drawn, 19 October 2026: 49 % of 235 µm, 116 µm, at the 0.8 g preload, the longer discharge reach bending the gold spring 0.39 on the return: twice it; 44 % of 175 µm, 77 µm, until the lock was re-laid, and 41 % before the horn was traced) */
const lockAt=d=>{const e=W.makeEsc({...S,dL:d/S.ES},S),m=e.measure();return m.runs?{A:e.A*D,Amin:e.ampAt(dmin)*D,lock:m.lock,letoff:m.letoff,lRel:e.lRel*e.BL/e.LEN*e.ES}:null;};
const d0=S.dL*S.ES;let dDeep=(()=>{let a=d0,b=d0+(BREV?0.08:0.03);for(let i=0;i<14;i++){const m=(a+b)/2,L=lockAt(m);L&&L.Amin>=GUARD[0]?a=m:b=m;}return a;})();const RING=BJ?BJ.window.ring:0.493*0.235,dShal=2*RING,dTip=d0+0.015;
/* in heat (wempe_thermal_frame.js; the owner's choice, 27 October 2026: the window over the TU's 4-36 °C is the window): the steel detent draws the gold spring's tip from the
   staff as the brass frame grows, taking let-off, so the deepest lock set at 20 °C that keeps the swing in the guard band at the wind's lowest at 36 °C (wempe_escheat.js, the
   published constants' middle; at their corner none does: README, Unresolved) caps the window; the lock moves only 0.1 µm, so its floor stays */
const HT=require('./wempe_escheat.js')(W),hotOk=d=>{const{E:e,kd}=HT.at(HT.K.mid,HT.TS[1],d/S.ES),m=e.measure();return m.runs&&e.ampAt(dmin*kd)*D>=GUARD[0];};
const dHot=(()=>{let a=d0-0.006,b=dDeep;if(hotOk(b))return b;for(let i=0;i<14;i++){const m=(a+b)/2;hotOk(m)?a=m:b=m;}return a;})(),dDeep20=dDeep;dDeep=Math.min(dDeep,dHot);
const L0=lockAt(d0),LS=lockAt(dShal),LD=lockAt(dDeep-0.002),liftMax=Math.max(...E.LI)*E.BL/E.LEN*E.ES;
say(`as drawn ${f(d0,3)} mm deep: lock ${f(L0.lock,1)}°, let-off ${f(L0.letoff,1)}°, the stone lifted ${f(L0.lRel,3)} mm at the release; ${f(L0.Amin,1)}-${f(L0.A,1)}° (the wind's lowest, 12 h)`);
say(`deepest that unlocks with the swing in the guard band: ${f(dDeep20,4)} mm at 20 °C, ${f(dHot,4)} set at 20 °C to hold at 36 °C (wempe_thermal_frame.js: the gold spring's tip drawn back, the let-off taken; the window's top ${f(dDeep,4)})`);
say(`at ${f(dDeep,4)} mm (the discharge stone lifts the stone at most ${f(liftMax,3)} mm); there lock ${f(LD.lock,1)}°, let-off ${f(LD.letoff,1)}°, ${f(LD.Amin,1)}° at the wind's lowest`);
say(`shallowest with a held tooth's stone ringing under half the depth (wempe_tripping.js: ${f(RING*1000,0)} µm as drawn): ${f(dShal,3)} mm; there lock ${f(LS.lock,1)}°, ${f(LS.Amin,1)}-${f(LS.A,1)}° (a shallower lock gives the swing back: the unlocking costs less)`);
say(`the wheel's tips Ø 14 +0.03: with the banking left where the drawn wheel puts it, a wheel at the top of its tolerance locks ${f(dTip,3)} deep, ${dTip>dDeep?`past ${f(dDeep,3)}: it would not unlock. The banking is set to the wheel as made`:'inside the window'}`);

/* ---------- the hairspring and the period ---------- */
head('The hairspring (05 03_6: strip 0.285 × 0.52, boxed, no tolerance; coil Ø 12.8 ±0.05, boxed; cut to 13 turns less 3.5 mm, 05 03_7) against the period');
/* k = E b h³ / 12 L, T = 2π √(I/k): T goes as h^-1.5, L^0.5 (L as the coil's radius at a given count of turns), E^-0.5. The timing weights (Zeitmasse 05 03 01-3, brass on the
   timing screws, thread 0.16 pitch, 05 03 01-1) move I by 2 m r dr: weighed on the solids (wempe_inertia.json) */
const IJ=JSON.parse(fs.readFileSync(path.join(__dirname,'wempe_inertia.json'),'utf8')),TW=IJ.balance.byHn['050301-3'],rTW=Math.sqrt(TW.I/TW.m),dIturn=2*TW.m*rTW*0.16,secTurn=86400*dIturn/(2*S.I);
const esrc=fs.readFileSync(path.join(__dirname,'..','..','wempe','js','escapement.js'),'utf8'),mR=/r2=([\d.]+)\/2/.exec(esrc),mW=/TIP=([\d.]+),W1=TIP-([\d.]+),W0=W1-([\d.]+)/.exec(esrc);if(!mR||!mW)throw Error('escapement.js: the rim\'s outside or the timing weights\' place not found');   /* the weight's inner end: the screw's tip less the weight's 0.8 short of it and its length (since 15 October 2026; before, the weight's lathe from its inner end) */
const reach=(+mW[1]-mW[2]-mW[3])-mR[1]/2,turnsIn=reach/0.16,gain=turnsIn*secTurn;
const T=P.HS.T,day=x=>86400*x,perH=day(1.5/0.285*1e-3),perC=day(0.5*0.005/WESC.HSL.RC),perL=day(0.5/WESC.HSL.L),perE=day(0.5/206),hNeed=0.285*(T/0.5)**(2/3),hE=[200,210].map(e=>hNeed*Math.cbrt(206/e));
const fast=day(0.5/T-1);
say(`as drawn (505.4 mm, 206 GPa) with the weighed balance (${S.I} g·mm²) the period is ${f(T,4)} s: ${f(fast/60,0)} min a day fast against the train's 0.5 s`);
say(`each µm of the strip's thickness moves the rate ${f(perH,0)} s a day, each 0.01 mm of the coil's Ø ${f(perC,0)} (the drawn ±0.05: ±${f(5*perC,0)}), each mm of its length ${f(perL,0)}, each GPa of the steel's modulus ${f(perE,0)} (200-210: ±${f(5*perE,0)})`);
say(`a turn of both timing weights (${f(TW.m,3)} g together at r ${f(rTW,2)}, the screws' 0.16 pitch) moves it ${f(secTurn,1)} s a day; as drawn they stand against their screws' heads ${f(reach,2)} mm off the rim (their size estimated), so they can only be screwed in, ${f(turnsIn,1)} turns, gaining up to ${f(gain,0)} s a day`);
say(`so the period is matched, not made: 0.5 s wants the strip ${f(hNeed,4)} mm at 206 GPa (${f(hE[1],4)}-${f(hE[0],4)} over 200-210), and the weights' reach is ${f(gain/perH,2)} µm of it; the coil's own ±0.05 is ${f(5*perC/gain,1)} times their reach. A 1940s spring was vibrated against the balance and chosen or ground to it; the bench's test (wempe_bench.js) times it so`);

/* ---------- the record ---------- */
const J={note:'tools/wempe_tolerances.js: how closely the Wempe\'s parts the drawings don\'t size must be made, each range keeping the swing in the guard band over the whole wind (and the sources\' band, reported); read by wempe_bench.js, wempe_montecarlo.js and the Wempe\'s verification report',
  band:{guard:GUARD,sources:SRC,wind:{dmin:r4(dmin),hMin,dmax:r4(dmax),hMax,A:A0.map(r4),A12:r4(E.A*D)}},
  mainspring:{t:t0,tMeasured:r4(tm),s:[r4(sLo),r4(sTop)],sSwing:[r4(sLo),r4(sHi)],t_mm:[r4(t0*Math.cbrt(sLo)),r4(t0*Math.cbrt(sTop))],tMeasured_mm:[r4(tm*Math.cbrt(sLo)),r4(tm*Math.cbrt(sTop))],g262:{mean:r4(gMean),full:gFull,low:gLow,band:[r4(gMean*sLo),r4(gMean*sTop)]},rate:[r4(rLo),r4(rHi)],stressGPa:r4(sM/1e9),sStress:r4(sStress),sources:{s:r4(sLoS),t_mm:r4(t0*Math.cbrt(sLoS)),g262:r4(gMean*sLoS)}},
  detent:{t:r4(td),k:[0,r4(kdHi)],t_mm:[0,r4(tdHi)],inTime:[r4(td/Math.cbrt(2)),r4(td*Math.cbrt(2))],t09:{k:r4(k09),A:A09.map(r4)},A0:r4(Ak0),preload:{g:S.W78,min:r4(wLo),max:r4(wHi),back:WBACK,swing:r4(wSw),margin:r4(wTrip),knock:r4(wKnock),rows:PRE}},
  gold:{t:0.15,E:90,k:[0,r4(kpHi)],t_mm:r4(0.15*Math.cbrt(kpHi)),E_max:r4(90*kpHi),A0:r4(Ap0),half:Ap5.map(r4)},
  lock:{d:r4(d0),deep:r4(dDeep),deep20:r4(dDeep20),hot:r4(dHot),shallow:r4(dShal),ring:r4(RING),tip:r4(dTip),liftMax:r4(liftMax),at:{drawn:{lock:r4(L0.lock),letoff:r4(L0.letoff),A:r4(L0.A),Amin:r4(L0.Amin)},deep:{lock:r4(LD.lock),letoff:r4(LD.letoff),Amin:r4(LD.Amin)},shallow:{lock:r4(LS.lock),A:r4(LS.A),Amin:r4(LS.Amin)}}},
  hairspring:{T:r4(T),fast:r4(fast),perUm:r4(perH),perCoil001:r4(perC),perMm:r4(perL),perGPa:r4(perE),hNeed:r4(hNeed),hNeedE:hE.map(r4).reverse(),weights:{m:TW.m,r:r4(rTW),secTurn:r4(secTurn),reach:r4(reach),turnsIn:r4(turnsIn),gain:r4(gain)}}};
const OUT=path.join(__dirname,`tolerances_wempe${SUF}.json`),txt=JSON.stringify(J,null,1)+'\n';
console.log(rows.join('\n'));
if(process.argv.includes('--write')){fs.writeFileSync(OUT,txt);console.log(`\n  wrote tools/tolerances_wempe${SUF}.json`);}
else{const ok=fs.existsSync(OUT)&&fs.readFileSync(OUT,'utf8').replace(/\r/g,'')===txt;console.log(ok?`\n  ok  tools/tolerances_wempe${SUF}.json is what this finds`:`\n  !!  tools/tolerances_wempe${SUF}.json is not what this finds: ${BREV?'MC_WREV='+BREV+' ':''}node wempe_tolerances.js --write`);if(!ok)process.exitCode=1;}
console.log(`  (${f((Date.now()-tStart)/1000,0)} s)`);
