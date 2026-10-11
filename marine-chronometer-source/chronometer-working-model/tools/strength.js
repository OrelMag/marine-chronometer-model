// Would it fall apart? Every part that carries a load, its stress against the material's published range, and how hard a knock it takes. Needs only Node.js:
//   node strength.js            (about 3 s; exits with 1 if a part is past even the best of its material's range)
// The loads are the model's own (physics.js: the mainspring fully wound through the fusee; dynamics.js: the detent, the wheel's speed), the sizes the drawn
// parts' (movement.js, escapement.js), the materials' strengths published ranges, named where used. Each line gives the margin at the weak and the strong end
// of that range: ok when even the weak end leaves 1.5, ~~ (reported, not failed) when it holds only toward the strong end, !! when it fails at both.
// The stresses are first estimates (a tooth by Lewis' formula, a pin as a beam), as a maker's first check is: where a margin is thin, the part is worth a
// closer look, not condemned.
const fs=require('fs'),path=require('path'),PH=require('./physics.js'),DY=require('./dynamics.js'),{ESC}=DY;
const mv=fs.readFileSync(path.join(__dirname,'..','js','movement.js'),'utf8'),num=(re,what)=>{const m=re.exec(mv);if(!m)throw Error('not found in movement.js: '+what);return m.slice(1).map(Number);};
const G0=9.80665,D=Math.PI/180,MPa=1e6,TR=PH.TRAIN,f=(x,n=0)=>(+x).toFixed(n),rows=[];let fail=0;
const line=(name,load,sig,[lo,hi],what)=>{const mL=lo/sig,mH=hi/sig,v=mL>=1.5?'ok ':mH>=1?'~~ ':'!! ';if(v==='!! ')fail=1;
  rows.push(`  ${v} ${name.padEnd(46)} ${load.padEnd(18)} ${(f(sig/MPa)+' MPa').padStart(9)}   ${what} ${f(lo/MPa)}-${f(hi/MPa)}: margin ${f(mL,1)}-${f(mH,1)}`);};
const say=s=>rows.push('  '+s);
/* published ranges (MPa → Pa). Brass: leaded clock brass (CuZn39Pb2-3), half-hard to hard; steel: hardened and tempered carbon steel (pinions, pivots, pins,
   chain); beryllium copper C17200 hardened; Elinvar-type alloys hardened. Endurance limits are for 10⁸ cycles, reversed bending */
const BRASS_Y=[300,450],BRASS_E=[120,170],STEEL_Y=[1200,1800],STEEL_UTS=[1400,2000],STEEL_SH=STEEL_UTS.map(x=>0.6*x),BECU_E=[240,310],BECU_UTS=[1140,1380],ELIN_E=[350,500];
const P=a=>a.map(x=>x*MPa);

/* ---------- the going train: tooth forces at full wind (every stage taken as lossless, the worst case), Lewis σ = F / (b m Y) ---------- */
/* Y 0.20-0.35: cycloidal clock teeth have thinner roots than involute gears (Y 0.3-0.45); the low end is taken */
say('The going train, fully wound (each stage lossless: the largest forces)');
const Y=0.2,arb=n=>{const m=new RegExp(`R\\.${n}=hn\\(arbor\\((.*?)\\),'`).exec(mv);if(!m)throw Error('not found: arbor '+n);const s=m[1],w=/wheel:\{[^}]*?th:([\d.]+)/.exec(s),p=/pin:\{[^}]*?th:([\d.]+)/.exec(s);return{w:w&&+w[1],p:p&&+p[1]};};
const A={gw:arb('gw'),cw:arb('cw'),tw:arb('tw'),fw:arb('fw'),esc:arb('esc')},M=PH.MODS;
/* rev a day of each wheel: the centre once an hour */
const day={gw:24*TR.cp/TR.fu,cw:24,tw:24*TR.cw/TR.tp,fw:24*TR.cw/TR.tp*TR.tw/TR.fp},yrs=30;
const MESH=[['fusee wheel → centre pinion','gw',TR.fu,M.fusee,A.gw.w,A.cw.p,TR.cp],['centre wheel → third pinion','cw',TR.cw,M.centre,A.cw.w,A.tw.p,TR.tp],
  ['third wheel → fourth pinion','tw',TR.tw,M.third,A.tw.w,A.fw.p,TR.fp],['fourth wheel → escape pinion','fw',TR.fw,M.fourth,A.fw.w,A.esc.p,TR.ep]];
let T=PH.Tf;const F={};
for(const[nm,k,z,m,bw,bp,zp]of MESH){const r=m*z/2/1000,Ft=T/r,b=Math.min(bw,bp)/1000,sig=Ft/(b*m/1000*Y),cyc=day[k]*365*yrs,fat=cyc>1e6;
  F[k]=Ft;line(`${nm} (${z}:${zp}, m ${m})`,`${f(Ft,Ft<1?3:1)} N, ${f(T*1000,T<0.01?2:1)} mN·m`,sig,P(fat?BRASS_E:BRASS_Y),fat?`brass's endurance (${(cyc/1e6).toFixed(1)}M cycles in ${yrs} y)`:`brass's yield (${f(cyc/1e3,0)}k cycles in ${yrs} y)`);
  T=T*zp/z;}
say(`the pinions are hardened steel, ${f(STEEL_Y[0]/BRASS_Y[1],1)}-${f(STEEL_Y[1]/BRASS_Y[0],1)} times as strong as the brass teeth that drive them: the wheels' teeth are the weaker side of every mesh`);

/* ---------- the escape wheel's teeth: the strike on the impulse jewel and the landing on the locking stone ---------- */
/* the tooth meets each at about the jewel's speed (dynamics.js: it strikes the impulse jewel at twice the jewel's speed, so the jewel's speed relative); the wheel and the
   fourth wheel behind it stop on the tooth, a cantilever (1 - r0) of the radius tall, about half the root pitch wide (estimated), 1.3 mm face, hardened steel */
{const w=ESC.A*DY.K/DY.K*(2*Math.PI/ESC.T)*ESC.rRoll,KE=0.5*DY.JT*w*w,h=(1-ESC.r0)*ESC.ES/1000,wb=Math.PI*ESC.r0*ESC.ES/16/1000,b=1.3e-3,Ib=b*wb**3/12,kT=3*207e9*Ib/h**3,Fm=Math.sqrt(2*KE*kT),sig=Fm*h*(wb/2)/Ib;
  line('escape wheel tooth, struck (the tooth alone springing)',`${f(Fm,1)} N peak, ${f(KE*1e6,1)} µJ`,sig,P(STEEL_Y),`steel's yield (${f(2*86400*365*yrs/16/1e6,0)}M strikes a tooth in ${yrs} y; below the endurance limit, about half the yield, it lasts)`);}

/* ---------- pivots: bending at the shoulder (σ = 32 F L / π d³, the load at mid-bearing), and the bearing's pressure ---------- */
say('Pivots and bearings');
{const pv=re=>{const m=re.exec(mv);if(!m)throw Error('not found: '+re);return m.slice(1).map(Number);};
  const fu=pv(/bushR\(bb,\.\.\.L\.Fu,BB_T,TB_T,([\d.]+),([\d.]+)\)/),[BB_T]=num(/,BB_T=(-?[\d.]+)/,'BB_T'),[TB_T]=num(/TB_T=(-?[\d.]+)/,'TB_T'),Lb=Math.abs(TB_T-BB_T)/1000;
  const pull=PH.Mup/(PH.rB/1000),Ffu=pull+F.gw,d=2*fu[1]/1000,sig=32*Ffu*(Lb/2)/(Math.PI*d**3),p=Ffu/(d*Lb);
  line(`fusee arbor's pivot (r ${fu[1]}, ${f(Lb*1000,1)} long in its bushing)`,`${f(Ffu,1)} N (chain + wheel)`,sig,P(STEEL_Y),'steel\'s yield');
  line('  its bushing, the pressure (oiled brass, turning once in 6.4 h)',`${f(Ffu,1)} N`,p,P([10,35]),'oiled brass at a crawl, typical');
  const ST=PH.STG;for(const[nm,,,,,pr]of ST){const k={centre:'gw',third:'cw',fourth:'tw',escape:'fw'}[nm],out={centre:'cw',third:'tw',fourth:'fw',escape:null}[nm],Fr=F[k]+(out?F[out]:0),dd=2*Math.min(...pr)/1000,Lp=nm==='centre'?0.5e-3:0.3e-3;
    line(`${nm} arbor's thinner pivot (r ${Math.min(...pr)})`,`${f(Fr,Fr<1?3:1)} N`,32*Fr*Lp/(Math.PI*dd**3),P(STEEL_Y),'steel\'s yield');}}

/* ---------- the chain and its ends, fully wound ---------- */
say('The fusee chain, fully wound');
{const pull=PH.Mup/(PH.rB/1000),[H,TK,PC]=num(/const H=([\d.]+),TK=([\d.]+),PC=([\d.]+)/,'the chain'),[rR]=num(/cylY\(([\d.]+),3\*TK\+0\.08/,'its rivets'),[rP,lP]=num(/fPin=endM\(new THREE\.Mesh\(cylY\(([\d.]+),([\d.]+)/,'the fusee end pin'),[rN,lN]=num(/hkN=endM\(new THREE\.Mesh\(cylY\(([\d.]+),([\d.]+)/,'the hook\'s nose');
  const mm2=x=>x*1e-6;
  say(`pull ${f(pull,1)} N (the spring's ${f(PH.Mup,2)} N·m on the barrel's chain radius ${f(PH.rB,2)} mm, physics.js); plates ${H} × ${TK} mm, rivets r ${rR}, pitch ${PC}`);
  line('an inner link: its one plate across the rivet hole',`${f(pull,1)} N`,pull/mm2((H-2*rR)*TK),P(STEEL_UTS),'steel\'s strength');
  line('  the same plate at its waist',`${f(pull,1)} N`,pull/mm2(2*Math.sqrt((H/2)**2-((H/2)**2-0.32**2))*TK),P(STEEL_UTS),'steel\'s strength');
  line('a rivet, in double shear',`${f(pull,1)} N`,pull/mm2(2*Math.PI*rR*rR),P(STEEL_SH),'steel\'s shear strength');
  line('the rivet bearing on the inner plate',`${f(pull,1)} N`,pull/mm2(2*rR*TK),P(STEEL_UTS.map(x=>1.5*x)),'steel in bearing (1.5 × strength)');
  line(`the fusee's end pin (r ${rP}), in shear`,`${f(pull,1)} N`,pull/mm2(Math.PI*rP*rP),P(STEEL_SH),'steel\'s shear strength');
  line(`the hook's nose (r ${rN}, ${lN} into the wall), in shear`,`${f(pull,1)} N`,pull/mm2(Math.PI*rN*rN),P(STEEL_SH),'steel\'s shear strength');
  line('  bearing on the barrel\'s brass wall',`${f(pull,1)} N`,pull/mm2(2*rN*lN),P(BRASS_Y.map(x=>1.5*x)),'brass in bearing (1.5 × yield)');}

/* ---------- the springs ---------- */
say('The springs');
line('mainspring, fully wound (physics.js)',`${f(PH.Mup,2)} N·m`,PH.sUp,P([2500,2600]),'the top of a hardened steel mainspring\'s working range (physics.js) and its limit (README)');
say(`  as a mainspring is meant to, it works near its limit: wound once a day (${f(365*yrs/1000,1)}k cycles in ${yrs} years) it fails by taking a set (the model's MSET, Op. 13), not by fatigue`);
/* the hairspring: the strip tools/hairspring.js designs (409 mm, 0.23 wide, Elinvar-type 180 GPa) at the swing; reversed every half-second */
{const L=0.4093,b=0.23e-3,E=180e9,t=Math.cbrt(12*DY.K*L/(E*b)),sig=th=>6*DY.K*th/(b*t*t);
  line(`hairspring at 255° (${f(t*1000,3)} × 0.23 mm, 409 mm: hairspring.js)`,`${f(DY.K*ESC.A*1e6,0)} µN·m`,sig(ESC.A),P(ELIN_E),`Elinvar-type's endurance (${f(2*86400*365*yrs/1e9,1)}G cycles)`);
  line(`  carried past a full turn to trip (${f(ESC.TRIP/D,0)}°)`,`${f(DY.K*ESC.TRIP*1e6,0)} µN·m`,sig(ESC.TRIP),P([1100,1400]),'Elinvar-type\'s yield, once');}
/* the detent spring: preloaded by Op. 78, bent further by the whole lift (dynamics.js: 2.6 × the release lift); 2 cycles a second */
{let smax=0;for(let th=ESC.thRel;th<0;th+=1e-4){const i=Math.floor((((th+Math.PI)%(2*Math.PI))+2*Math.PI)%(2*Math.PI)/2e-5);const s=DY.S2[i];if(!isNaN(s))smax=Math.max(smax,s);}
  const dmax=smax/DY.LEN,Ia=DY.KD*DY.lD/128e9,c=DY.tD/2,s0=DY.MPRE*c/Ia,s1=(DY.MPRE+DY.KD*dmax)*c/Ia,sa=(s1-s0)/2,sm=(s1+s0)/2;
  /* Goodman: the alternating stress the mean leaves room for */
  const allow=[0,1].map(i=>BECU_E[i]*MPa*(1-sm/(BECU_UTS[i]*MPa)));
  line(`detent spring, its swing (preloaded ${f(s0/MPa)}, lifted ${f(s1/MPa)} MPa)`,`${f((DY.MPRE+DY.KD*dmax)*1e6,0)} µN·m`,sa,allow,`beryllium copper's endurance at that mean (Goodman, ${f(2*86400*365*yrs/1e9,1)}G cycles)`);}
/* the trip spring: bent on every return swing as far as makeEsc's PS (its tip ridden over the jewel's end, dynamics.js) */
{const dmax=Math.max(...ESC.PS)*ESC.ES/1000,L=DY.LTS,t=ESC.settings.tsT/1000,sig=3*180e9*t*dmax/(2*L*L);
  line(`trip spring, bent ${f(dmax*1000,2)} mm at its tip`,`${f(DY.KTIP*dmax*1000,1)} mN`,sig*1.5,P(ELIN_E),'Elinvar-type\'s endurance, its clamped root taken at 1.5 × (estimated)');}

/* ---------- knocks: what a drop does ---------- */
say('Knocks (the chronometer in its gimbals, the staff upright)');
{const [PV]=num(/const PV=([\d.]+),yT=CK_T/,'the staff\'s pivots'),pl=0.65e-3,jl=0.6e-3,Lp=pl-jl/2,d=2*PV/1000,ms=PH.mBal,gY=m=>STEEL_Y.map(s=>s*MPa*Math.PI*d**3/(32*(m*G0/2)*Lp));
  const g1=gY(ms[1]),g0=gY(ms[0]);
  say(`the balance staff's pivots (r ${PV}, the load ${f(Lp*1000,2)} mm out): a sideways knock bends them at ${f(g1[0])}-${f(g0[1])} g (the balance ${f(ms[0]*1000,1)}-${f(ms[1]*1000,1)} g, the steel's yield)`);
  const ar=Math.PI*(PV/1000)**2,gA=[2000,3000].map(s=>s*MPa*ar/(ms[1]*G0));
  say(`end-on, the flat pivot's end on its endstone takes ${f(gA[0])}-${f(gA[1])} g before the ruby's 2-3 GPa (the balance's heavier mass)`);
  const mE=PH.J/(5.0e-3)**2,dE=2*0.089e-3,gE=STEEL_Y.map(s=>s*MPa*Math.PI*dE**3/(32*(mE*G0/2)*0.3e-3));
  say(`the escape arbor's pivots (r 0.089, its mass ${f(mE*1e6,0)} mg from its inertia at a 5 mm radius of gyration, estimated): ${f(gE[0])}-${f(gE[1])} g`);
  const gR=(DY.MPRE+DY.KD*DY.DREL+DY.TAUE*DY.CDR/DY.DREL)/(DY.DM.m*DY.rCM*G0);
  say(`the detent, against its preload, its spring and the tooth's draw, frees the wheel under a steady ${f(gR)} g across the plate (a short blow needs more: dynamics.js): the first thing a knock upsets, and harmlessly (a tooth escapes, the hands jump half a second)`);
  say(`so a knock that would bend a balance pivot (some ${f(g1[0])} g) has long since let teeth go; the gimbals and the box's padding are what keep it from either`);}
console.log(rows.join('\n'));if(fail)process.exitCode=1;
