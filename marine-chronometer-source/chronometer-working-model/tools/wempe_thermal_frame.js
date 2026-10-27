// Does the Wempe still fit when it's cold or hot? thermal.js's question for the Wempe (Node.js, no browser; wempe_load.js): over the 6MX TU's working range, 4 to 36 °C
// (6MX-figures.md, TU 2 and §1.3.1; the trial's periods), the movement put together at 20 °C. The frame is brass where it holds (the plates, pillars, bridges, cocks,
// bushes: "Messingblech ... Ms 58", "Rundmessing ... Ms 58") and so are the wheels (Ms 58) and, unlike the Hamilton's, the escape wheel (05 04 05-1, "Ms 63 federhart");
// the pinions and arbors are steel ("Präz. Rundstahl"), the detent steel (1436, "Stahl"), the gold spring gold, the impulse roller beryllium copper (02 04 02), the chain
// and mainspring steel. So in the escapement the plates and the wheel grow alike and what moves is what isn't brass: the detent from its brass-held foot, the gold spring
// on it, the rollers on the steel staff; and the springs' moduli fall as they warm.
//   1. The train's depths: each wheel and its holes brass, the pinion steel: the depth changes by the pinion's pitch radius times the difference (thermal.js's), against
//      gearing_wempe.json's windows, and the holes' tolerance the window leaves.
//   2. Endshake: each arbor's gap (brass) and its length between shoulders (steel), wempe_endshake.js's stacks, against the 1958 MX repair book's bands.
//   3. The escapement through makeEsc, in the escape wheel's own frame (its radius the unit, growing with the brass): the locking stone's place moved by the detent's
//      length from its foot (the depth of lock and the wheel's angle at rest), the gold spring's tip with it, the impulse roller's and discharge roller's radii, the
//      detent spring's and the gold spring's stiffness and the detent's preload by their thermoelastic coefficients, the drive by the mainspring's (its torque E b t³/L);
//      the depth of lock against wempe_tolerances.js's window, the figures, the swing over the wind against the guard band, the stone against the teeth (stoneClash),
//      and the rate this share gives against 20 °C: its C and S beside the TU's (the balance and hairspring's own are wempe_thermal.js's, the air's wempe_errorbudget.js's).
//   4. The chain against the fusee's and barrel's brass.
// Two sets of constants: their middle, and the corner of the published ranges that moves each part most (brass the most, steel the least); judged on the corner.
// What it found (27 October 2026): the lock hardly moves (0.13 µm), but the gold spring's tip does, 1.8-2.3 µm from the staff at 36 °C (the steel detent from its
// brass-held foot), and the Wempe has little let-off to give (1.50° drawn, the cliff about 1.0-1.1°, where the tooth runs a pitch before it lands on the impulse stone:
// makeEsc and dynamics.js --model wempe in time agree). So the lock window that holds over 4-36 °C is about half the one at 20 °C alone; since that day (the owner's
// choice) wempe_tolerances.js takes it as its window (wempe_escheat.js), and this tool checks the bench's aim inside it and searches its top again.
// Exits 1 if a mesh's depth moves a tenth of its window's side, no endshake set at 20 °C holds its band at both ends, or, with the drawn lock and the constants' middle,
// the escapement loses its impulse, the swing leaves the guard band, the stone passes 1 µm into a tooth, or the rate's share passes the TU's C or S. The drawn lock at the
// constants' corner, the bench's lock and the window over the range are reported (~~): the owner's to settle. About 2½ minutes.
//   node wempe_thermal_frame.js [--json OUT]       (MC_WREV=build / build40: a build's tolerances, as wempe_bench.js)
const fs=require('fs'),path=require('path'),W=require('./wempe_load.js')(),{WPHYS:P}=W,E0=P.ESC,S=P.SET,{stoneClash}=require('./escapement.js'),T=require('./wempe_train.js'),{ARB}=require('./wempe_endshake.js');
const BREV=/^build/.test(process.env.MC_WREV||'')?process.env.MC_WREV:'',SUF=BREV?'_'+BREV:'';
const J=f=>JSON.parse(fs.readFileSync(path.join(__dirname,f),'utf8')),GW=J('gearing_wempe.json'),TOL=J(`tolerances_wempe${SUF}.json`),LK=TOL.lock,G=TOL.band;
const D=180/Math.PI,f=(x,n=2)=>(+x).toFixed(n),sg=(x,n=2)=>(x>=0?'+':'−')+Math.abs(x).toFixed(n),r6=x=>+(+x).toFixed(6),rows=[];let fail=0;
const say=s=>rows.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;rows.push(`${ok?'  ok ':'  !! '} ${s}`);},warn=(ok,s)=>rows.push(`${ok?'  ok ':'  ~~ '} ${s}`),head=s=>rows.push('\n'+s);
const HT=require('./wempe_escheat.js'),{MAT,K}=HT,{at}=HT(W);   /* the constants and the escapement moved in heat and cold */
const{T0,TS}=HT,DA=K.most.b-K.most.s,OUT={MAT,T:TS,T0,depth:[],endshake:[],esc:[],rate:{}};
say(`brass grows ${f(MAT.b[0]*1e6,1)}-${f(MAT.b[1]*1e6,1)} × 10⁻⁶ a °C, steel ${f(MAT.s[0]*1e6,1)}-${f(MAT.s[1]*1e6,1)}: brass up to ${f(DA*1e6,1)} more; from ${T0} °C to the TU's ${TS[0]} °C (${sg(TS[0]-T0,0)}) and ${TS[1]} °C (${sg(TS[1]-T0,0)})`);

/* ---------- 1. the train's depths ---------- */
/* the wheel and its holes brass, the pinion steel: the wheels' teeth go deeper into the pinion as the brass shrinks more, by the pinion's pitch radius times the
   difference (the close side of the window, lo); warm, shallower (hi). rp: the stage's module times the pinion's leaves over 2 (wempe_train.js's STG) */
head('1. The train\'s depths (each mesh\'s window: gearing_wempe.json, gearing.js --model wempe)');
let tpT=Infinity;
GW.stages.forEach((w,i)=>{const st=T.STG[i],rp=st[3]*st[2]/2,cold=rp*DA*(T0-TS[0]),hot=rp*DA*(TS[1]-T0),tp=(-w.lo-w.sh-cold)/2;tpT=Math.min(tpT,tp);
  OUT.depth.push({stage:w.stage,rp:r6(rp),cold:r6(cold),hot:r6(hot),lo:w.lo,hi:w.hi,tp:r6(tp),tp0:w.tp});
  chk(cold<0.1*-w.lo&&hot<0.1*w.hi,`${w.stage}: the pinion r ${f(rp,3)}: ${f(cold*1000,2)} µm deeper at ${TS[0]} °C, ${f(hot*1000,2)} µm shallower at ${TS[1]} °C, against the ${f(-w.lo*1000,0)} µm closer and ${f(w.hi*1000,0)} wider its window allows; the holes ±${f(tp*1000,1)} µm with it (±${f(w.tp*1000,1)} without)`);});
say(`the wheels and their holes are both brass, so the depths hardly notice: the holes' tolerance stays ±${f(tpT*1000,0)} µm`);

/* ---------- 2. endshake ---------- */
/* each arbor between its bearings: the gap brass (the pillars, plates, bridge, bush; the escape arbor's endstones in brass settings), the arbor steel between its
   shoulders. Its change (αb gap - αs arbor) ΔT, both at the corner that moves it most; the band at 20 °C narrowed by the change at each end */
head('2. Endshake (the 1958 MX repair book\'s bands, wempe_endshake.js\'s stacks)');
for(const a of ARB){const gap=a.gap.reduce((s,x)=>s+x[1],0),arb=a.arbor.reduce((s,x)=>s+x[1],0),ch=t=>(K.most.b*gap-K.most.s*arb)*(t-T0),c=ch(TS[0]),h=ch(TS[1]);
  const set=[a.band[0]-c,a.band[1]-h],in20=a.drawn>=a.band[0]-1e-9&&a.drawn<=a.band[1]+1e-9,drawnIn=a.drawn>=set[0]-1e-9&&a.drawn<=set[1]+1e-9;
  OUT.endshake.push({id:a.id,name:a.name,gap:r6(gap),arbor:r6(arb),cold:r6(c),hot:r6(h),band:a.band,drawn:a.drawn,range:a.range,set:set.map(r6),in20,drawnIn});
  chk(set[1]>set[0],`${a.name}: the gap ${f(gap,2)} mm of brass, the arbor ${f(arb,2)} of steel: ${sg(c*1000,1)} µm at ${TS[0]} °C, ${sg(h*1000,1)} at ${TS[1]} °C; set at ${T0} °C between ${f(set[0],3)} and ${f(set[1],3)} mm it stays in the book's ${f(a.band[0],2)}-${f(a.band[1],2)} at both (drawn ${f(a.drawn,3)}${in20?(drawnIn?', inside':', in the band at 20 °C but not at both ends'):`, under the band at ${T0} °C already: the bench sets it (wempe_bench.js)`})`);}

/* ---------- 3. the escapement ---------- */
/* makeEsc in the brass wheel's frame, each part that isn't brass moved against it: wempe_escheat.js */
head('3. The escapement (makeEsc in the brass wheel\'s frame, the steel, gold and beryllium copper parts moved against it)');
const ES=S.ES;
const HS=[0,12,24,36,48,55],wind=(e,kd)=>{let mn=1e9,mx=-1e9;for(let h=0;h<=56;h+=2){const a=e.ampAt(P.drv(h/P.HPT)*kd)*D;mn=Math.min(mn,a);mx=Math.max(mx,a);}return[mn,mx];};
const rate=(e,kd,h)=>{const s=P.drv(h/P.HPT)*kd,a=e.ampAt(s);return{A:a*D,r:e.rateAt(a,s)};},inG=w=>w[0]>=G.guard[0]&&w[1]<=G.guard[1];
const m0=E0.measure(),w0=wind(E0,1),r0=HS.map(h=>rate(E0,1,h)),aim=LK.aim??(LK.shallow+LK.deep)/2;
say(`at ${T0} °C: depth of lock ${f(S.dL*ES*1000,1)} µm (the window ${f(LK.shallow*1000,1)}-${f(LK.deep*1000,1)}, wempe_tolerances.js, its top where the let-off runs out: ${f(LK.at.deep.letoff,2)}°; the bench's aim ${f(aim*1000,1)}), lock ${f(m0.lock,2)}°, let-off ${f(m0.letoff,2)}°, overall ${f(m0.overall,2)}°, drop ${f(m0.drop,2)}°; the swing ${f(w0[0],1)}-${f(w0[1],1)}° over the wind`);
const RT={};
for(const[sn,dL0]of[['drawn',S.dL],['bench',aim/ES]])for(const[kn,k]of[['mid',K.mid],['most',K.most]])for(const t of TS){const{o,E,kd,dr,dt}=at(k,t,dL0),m=E.measure(),w=wind(E,kd);
  const rr=sn==='drawn'?HS.map(h=>rate(E,kd,h)):null;if(rr)(RT[kn]=RT[kn]||{})[t]=rr;
  let cl={d:0};if(sn==='drawn'&&kn==='mid')for(const s of[0.5,1,1.25])if(E.ampAt(s)>=E.AMIN){const q=stoneClash(E,E.ampAt(s),s);if(q.d>cl.d)cl=q;}
  const row={set:sn,consts:kn,T:t,dLum:r6(o.dL*ES*1000),stoneUm:r6(-dr*ES*1000),restDeg:r6(dt*D),rT:r6((o.rT-S.rT)*ES*1000),rRoll:r6((o.rRoll-S.rRoll)*ES*1000),drive:r6(kd-1),
    lock:m.lock,letoff:m.letoff,overall:m.overall,drop:m.drop,hornClr:r6(m.hornClr),shake:r6(m.shake),runs:m.runs,swing:w.map(r6),ok:inG(w),rates:rr?rr.map((x,i)=>({h:HS[i],A:r6(x.A),d:r6(x.r-r0[i].r)})):null,clashUm:r6(cl.d*1000)};OUT.esc.push(row);
  const lab=`${sn==='drawn'?`the drawn lock (${f(S.dL*ES*1000,1)} µm)`:`the bench's lock (${f(aim*1000,1)} µm)`}, ${t} °C, ${kn==='mid'?'the constants\' middle':'the corner moving it most'}`;
  if(sn==='drawn')say(`${t} °C, ${kn==='mid'?'the constants\' middle':'the corner'}: the stone ${sg(-dr*ES*1000,2)} µm deeper into the teeth (the wheel resting ${sg(dt*D*60,2)}' on), the gold spring's tip ${sg(row.rT,2)} µm farther from the staff along the detent, the impulse roller ${sg(row.rRoll,2)} µm; the drive ${sg(100*(kd-1),2)} %`);
  const txt=`   ${lab}: let-off ${f(m.letoff,2)}° (${f(m0.letoff,2)} at ${T0} °C), lock ${f(m.lock,2)}°, overall ${f(m.overall,2)}°; the swing over the wind ${f(w[0],1)}-${f(w[1],1)}° (the guard band ${G.guard[0]}-${G.guard[1]}°)${inG(w)?'':': the impulse lost (the tooth runs a pitch before it lands on the impulse stone; dynamics.js in time agrees)'}`;
  (sn==='drawn'&&kn==='mid'?chk:warn)(inG(w)&&m.runs,txt);
  if(sn==='drawn'&&kn==='mid')chk(cl.d<1e-3,`   the locking stone against the teeth: deepest ${f(cl.d*1000,2)} µm into a tooth at three drives (want under 1 µm)`);}
/* the deepest lock set at 20 °C that still keeps the swing in the guard band over the wind at 36 °C (the let-off's cliff), for each set of constants; at 4 °C the let-off grows */
const deepAt=k=>{const ok=x=>{const{E,kd}=at(k,TS[1],x/ES);return inG(wind(E,kd));};let lo=LK.shallow-0.004,hi=LK.deep;if(ok(hi))return hi;if(!ok(lo))return null;for(let i=0;i<9;i++){const md=(lo+hi)/2;ok(md)?lo=md:hi=md;}return lo>=LK.shallow?lo:null;};   /* null: no lock over the window's floor (the held tooth's ringing) holds at 36 °C */
OUT.window={shallow:LK.shallow,deep:LK.deep,aim,drawn:S.dL*ES};
for(const kn of['mid','most']){const dp=deepAt(K[kn]);OUT.window[kn]=dp;
  warn(dp!==null&&dp>=aim,`the lock window over ${TS[0]}-${TS[1]} °C, ${kn==='mid'?'the constants\' middle':'the corner'}: ${dp===null?`none: every lock over the floor (${f(LK.shallow*1000,1)} µm, the held tooth's ringing) runs out of let-off by ${TS[1]} °C`:`${f(LK.shallow*1000,1)}-${f(dp*1000,1)} µm set at ${T0} °C (${f((dp-LK.shallow)*1000,1)} µm wide, against ${f((LK.deep-LK.shallow)*1000,1)} at ${T0} °C alone): set deeper, the let-off runs out by ${TS[1]} °C${dp<aim?`; the bench's middle (${f(aim*1000,1)}) is past it`:''}`}`);}
/* the rate this share gives, gaining positive, against 20 °C at each hour of the wind (the drawn lock); the TU's C = (ω36 - ω4)/32 and S = (ω36 + ω4)/2 - ω20 (its sign
   convention aside: the magnitudes), each at 12 h and their largest over the wind */
for(const kn of['mid','most']){const R=RT[kn],d=t=>R[t].map((x,i)=>x.r-r0[i].r),c=d(TS[1]).map((x,i)=>(x-d(TS[0])[i])/(TS[1]-TS[0])),sv=d(TS[1]).map((x,i)=>(x+d(TS[0])[i])/2),i12=HS.indexOf(12);
  OUT.rate[kn]={C12:r6(c[i12]),S12:r6(sv[i12]),Cmax:r6(Math.max(...c.map(Math.abs))),Smax:r6(Math.max(...sv.map(Math.abs))),d4:d(TS[0]).map(r6),d36:d(TS[1]).map(r6),hours:HS};}
{const Rm=OUT.rate.mid;
  chk(Rm.Cmax<0.1&&Rm.Smax<1.2,`the escapement's and drive's share of the rate in temperature (the drawn lock, the constants' middle): C ${sg(Rm.C12,4)} s a day a °C at 12 h (at most ${f(Rm.Cmax,4)} over the wind), S ${sg(Rm.S12,3)} s (at most ${f(Rm.Smax,3)}), against the TU's ±0.10 and ±1.20: the adjuster's setting of the masses (wempe_thermal.js) takes C's share up with the balance's; S is the escapement's own`);}

/* ---------- 4. the fusee chain ---------- */
/* the chain (05 07 04: 375 links at the framed 2.05 pitch, steel) wound between the fusee's groove and the barrel's drum (brass) */
{const LCH=375*2.05,dl=LCH*DA*(TS[1]-T0),dc=LCH*DA*(T0-TS[0]);Object.assign(OUT,{m0:{lock:m0.lock,letoff:m0.letoff,overall:m0.overall,drop:m0.drop,swing:w0},LCH,dl:r6(dl),dc:r6(dc)});
  head(`4. The fusee chain: ${f(LCH,0)} mm (375 links at 2.05); the brass round it grows ${f(dl,3)} mm more at ${TS[1]} °C and shrinks ${f(dc,3)} mm more at ${TS[0]} °C, ${f(100*Math.max(dl,dc)/2.05,1)} % of a link's pitch: nothing to take up`);}

OUT.rows=rows;OUT.fail=fail;module.exports=OUT;
if(require.main===module){console.log(rows.join('\n'));const ji=process.argv.indexOf('--json');if(ji>0)fs.writeFileSync(process.argv[ji+1],JSON.stringify(OUT,null,1));process.exit(fail);}
