// Would the Wempe fall apart? As tools/strength.js for the Hamilton: every part that carries the mainspring's load, its stress against its material's published range
// (strength.js's ranges), fully wound. Needs only Node.js:
//   node wempe_strength.js      (about 30 s: wempe_physics.js's budget first; exits 1 if a part is past even the best of its material's range)
// The loads: the solved mainspring fully wound (wempe_mainspring.json, mainspring.py's solve fitted to 05 06_20) through the chain and the fusee, and on through the train
// taken lossless (the worst case); the sizes the sheets' (the README's P1b-P1d sections, js/train.js, fusee.js, escapement.js), the materials the sheets' Werkstoff lines.
// Each line gives the margin at the weak and the strong end of the range: ok when even the weak end leaves 1.5, ~~ (reported, not failed) when only the strong end holds,
// !! when both fail. First estimates (a tooth by Lewis' formula, a pin as a beam, a ring as a curved beam), as a maker's first check is.
const PHY=require('./wempe_physics.js'),WT=require('./wempe_train.js'),fs=require('fs'),path=require('path'),{FN}=PHY;
const MPa=1e6,G0=9.80665,f=(x,n=0)=>(+x).toFixed(n),rows=[];let fail=0;
const line=(name,load,sig,[lo,hi],what)=>{const mL=lo/sig,mH=hi/sig,v=mL>=1.5?'ok ':mH>=1?'~~ ':'!! ';if(v==='!! ')fail=1;
  rows.push(`  ${v} ${name.padEnd(50)} ${load.padEnd(18)} ${(f(sig/MPa)+' MPa').padStart(9)}   ${what} ${f(lo/MPa)}-${f(hi/MPa)}: margin ${f(mL,1)}-${f(mH,1)}`);};
const say=s=>rows.push('  '+s);
/* strength.js's published ranges (MPa): leaded clock brass (Ms 58 federhart: the sheets' wheels, ratchet, click wheel), half-hard to hard; hardened and tempered carbon steel
   (pinions, pivots, pins, the chain "härten, 310° anlassen", the maintaining spring "härten in Öl, 310° blau"); a steel mainspring's working range and limit */
const BRASS_Y=[300,450],BRASS_E=[120,170],STEEL_Y=[1200,1800],STEEL_UTS=[1400,2000],STEEL_SH=STEEL_UTS.map(x=>0.6*x),MS_LIM=[2500,2600],P=a=>a.map(x=>x*MPa);
const RB=41.6/2+1.02,rfE=9.30+1.02;   /* the chain's lever on the drum, and on the fusee fully wound (05 06_20's last radius, the pitch line 1.02 out) */
const Mup=PHY.MupM,pull=Mup/(RB/1000),Tf=pull*rfE/1000;   /* the spring fully wound at the level 05 06_20 measures (wempe_physics.js: the solved shape, the measured strength; N·m), the chain's pull (N), the fusee arbor's torque (N·m), frictionless */

say(`The mainspring fully wound (mainspring_wempe.js, its length fitted to 05 06_20's shape, at its measured level): ${f(Mup*1000,0)} mN·m (as solved at 0.37 and 207 GPa ${f(FN.Mfull*1000,0)}); the chain's pull ${f(pull,1)} N; the fusee arbor's ${f(Tf*1000,0)} mN·m (05 06_20 measures 138.4 g on 262 mm there, ${f(138.4*262*G0/1e3,0)} mN·m, its losses in it)`);
line('mainspring, fully wound (15 × 0.37)',`${f(Mup*1000,0)} mN·m`,6*Mup/(15e-3*(0.37e-3)**2),P(MS_LIM),'the top of a hardened steel mainspring\'s working range and its limit (strength.js)');
say('  wound once a day, it fails by taking a set, as a mainspring is meant to work near its limit, not by fatigue');

/* ---------- the chain 05 07 04 and the band 05 07 03 ---------- */
say('The chain (05 07 04: plates 2 wide, drawn 0.26 thick, three deep; rivets Ø 0.55 of the 0.6 stock; hardened, tempered at 310°) and its hooks (strip 10 × 0.9)');
{const H=2,TK=0.26,rR=0.275,mm2=x=>x*1e-6;
  line('an inner link: its one plate across the rivet hole',`${f(pull,1)} N`,pull/mm2((H-2*rR)*TK),P(STEEL_UTS),'steel\'s strength');
  line('  the same plate at its waist (1.2, scaled)',`${f(pull,1)} N`,pull/mm2(1.2*TK),P(STEEL_UTS),'steel\'s strength');
  line('an outer link: its two plates at the waist',`${f(pull,1)} N`,pull/mm2(2*1.2*TK),P(STEEL_UTS),'steel\'s strength');
  line('a rivet, in double shear',`${f(pull,1)} N`,pull/mm2(2*Math.PI*rR*rR),P(STEEL_SH),'steel\'s shear strength');
  line('the rivet bearing on the inner plate',`${f(pull,1)} N`,pull/mm2(2*rR*TK),P(STEEL_UTS.map(x=>1.5*x)),'steel in bearing (1.5 × strength)');
  line('the fusee\'s pin (Ø 0.55 across the flange\'s ribs), double shear',`${f(pull,1)} N`,pull/mm2(2*Math.PI*0.275**2),P(STEEL_SH),'steel\'s shear strength');
  line('the top hook round it: its throat (3.5 wide, 1.8 deep, 0.80: the strip 0.9 finished to the chain\'s width, fusee.js)',`${f(pull,1)} N`,pull/mm2((3.5-1.8)*0.80),P(STEEL_UTS),'steel\'s strength');
  line('the bottom hook\'s barb on the drum\'s brass wall (1.55, the hook 0.80)',`${f(pull,1)} N`,pull/mm2(0.80*1.55),P(BRASS_Y.map(x=>1.5*x)),'brass in bearing (1.5 × yield)');}
say('The band (05 07 03: 0.22 +0.03 thick, its width not given, drawn 0.78; hooks of strip 10 × 0.8, brazed)');
line('the band, in tension (0.22 × 0.78)',`${f(pull,1)} N`,pull/(0.22e-3*0.78e-3),P(STEEL_UTS),'hardened strip steel\'s strength');
say(`  its brazed hooks' joints aren't sized on the sheets (silver solder about 150-250 MPa in shear: a lap of ${f(pull/(200e6*0.78e-3)*1000,2)} mm on the band's width carries the pull at 200)`);

/* ---------- the fusee wheel and the train, fully wound, each stage lossless ---------- */
say('The fusee wheel and the going train, fully wound (each stage lossless: the largest forces), Lewis σ = F / (b m Y), Y 0.2 (cycloidal clock teeth)');
const F={};{let T=Tf;const day=[24/(90/14),24,24*90/12,24*60];
  WT.STG.forEach(([nm,zA,zB,m,,w,p,,,bw],k)=>{const r=m*zA/2/1000,Ft=T/r,b=Math.min(bw[0],bw[1])/1000,sig=Ft/(b*m/1000*0.2),cyc=day[k]*365*30,fat=cyc>1e6;F[k]=Ft;
    line(`${nm} (${zA}:${zB}, m ${f(m,4)}, ${f(bw[0],2)} thick)`,`${f(Ft,Ft<1?3:1)} N, ${f(T*1000,T<0.01?2:1)} mN·m`,sig,P(fat?BRASS_E:BRASS_Y),fat?`brass's endurance (${(cyc/1e6).toFixed(1)}M cycles in 30 y)`:`brass's yield (${f(cyc/1e3,0)}k cycles in 30 y)`);
    T=T*zB/zA;});
  say(`the escape wheel's ${f(T*1e6,0)} µN·m lossless (the measured drive through the train gives about 83): the pinions are hardened steel, the brass teeth driving them the weaker side`);}

/* ---------- pivots: bending at the shoulder (σ = 32 F L / π d³, the load at mid-bearing), the bearing's pressure ---------- */
say('Pivots and bearings, fully wound (each pivot taken as carrying its arbor\'s whole load: the worst case)');
{const piv=(nm,Fr,d,L,mat=STEEL_Y)=>line(nm,`${f(Fr,Fr<1?3:1)} N`,32*Fr*L/1000/(Math.PI*(d/1000)**3),P(mat),'steel\'s yield');
  const Ffu=pull+F[0];
  piv('the fusee arbor\'s pivot (Ø 2.8 in the pillar plate, 3.35)',Ffu,2.8,3.35/2);
  line('  its journal Ø 4.5 in the fusee bush (8 long): the pressure',`${f(Ffu,1)} N`,Ffu/(4.5e-3*8e-3),P([10,35]),'oiled brass at a crawl, typical (strength.js)');
  line('the barrel\'s drum on its arbor\'s journals (Ø 4.48, 2 × 3.1)',`${f(pull,1)} N`,pull/(4.48e-3*6.2e-3),P([10,35]),'oiled brass at a crawl');
  piv('the barrel arbor\'s pivot (Ø 2.88 in the pillar plate)',pull,2.88,3.35/2);
  piv('the centre arbor\'s pivot (Ø 1.19 in WN-301, 3 long)',F[0]+F[1],1.19,1.5);
  piv('the intermediate arbor\'s pivots (Ø 0.825, 2.95 long)',F[1]+F[2],0.825,1.5);
  piv('the seconds arbor\'s pivot in its jewel (Ø 0.75, 1.1)',F[2]+F[3],0.75,0.55);
  piv('the escape arbor\'s pivots (Ø 0.24, in jewels about 0.6)',F[3],0.24,0.3);}

/* ---------- the maintaining work and the stop ---------- */
say('The maintaining work (05 06 01-02) and the stop work, fully wound');
{const Tm=Tf;
  /* the maintaining spring 05 06 01-1 (wempe_sustaining.js): closed by the drive, its ends nearly meeting, so it carries the drive by its bend; its stress from its drawn
     section at the strongest drive, the moment along the bent band from the force on the eye's pin (until 16 October 2026 taken as 2 T at the section opposite) */
  const SU=require('./wempe_sustaining.js').spring;
  line('the maintaining spring (Ø 32.3, 2-4 × 1.3), its most',`${f((SU.banked?SU.Tb:SU.Tmax)*1000,0)} mN·m`,SU.sig*MPa,P(STEEL_Y),'hardened spring steel\'s yield (it flexes once a wind)');
  /* while winding the maintaining detent holds the ratchet 05 06 02-1 (brass, 120 teeth Ø 37.25, 0.7 deep, the plate 1.02) against the spring: a tooth in bending */
  const Fr=Tm/((37.25/2-0.35)/1000),pit=Math.PI*37.25/120;
  line('the maintaining ratchet\'s tooth under the detent (brass)',`${f(Fr,1)} N`,6*Fr*0.7e-3/(1.02e-3*(pit*1e-3)**2),P(BRASS_Y),'brass\'s yield (once a wind)');
  line('  the detent\'s tip on it (1 thick), bearing',`${f(Fr,1)} N`,Fr/(1e-3*0.7e-3),P(BRASS_Y.map(x=>1.5*x)),'brass in bearing (1.5 × yield)');
  /* running, the fusee drives the ratchet through the click wheel 05 06 04-3 (brass 2, 35 teeth Ø 16.0/14.5) on one click (05 06 02-3, steel 1.82 thick, meeting the wheel's teeth over 1.30 of it: the click on the ratchet's cup floor, 05 06 02-1; 1.82 taken as met until 15 October 2026) */
  const Fc=Tm/(7.6e-3),pc=Math.PI*14.5/35;
  line('the click wheel\'s tooth under the click (brass, 1.30 met)',`${f(Fc,1)} N`,6*Fc*0.75e-3/(1.30e-3*(pc*1e-3)**2),P(BRASS_E),'brass\'s endurance (it turns with the fusee: 3.7 turns a day)');
  /* a strong hand on the key against the stop (overwind.js: 1.06 N·m, Swain 1970), the bar meeting the stop pin 05 08 01-5 (Ø 1.6, 1.6 straight under the plate's inner face and a
     0.25 dome: the coloured section) at 14.0 from the fusee's axis: the pin as a cantilever loaded where the bar's thin end bears on it, 0.185-1.235 under the face, its middle
     0.71 out; the bar (2 × 1.45) in its slot as a cantilever from the slot's end, about 3.6 out (its travel) */
  const Fh=(1.06+Tf)/14e-3;
  line('the stop pin (Ø 1.6, 1.6 proud), a strong hand on the key',`${f(Fh,0)} N`,32*Fh*0.71e-3/(Math.PI*(1.6e-3)**3),P(STEEL_Y),'steel\'s yield (no sheet: hardened, estimated)');
  line('  the stop bar (2 × 1.45), 3.6 out of its slot',`${f(Fh,0)} N`,6*Fh*3.6e-3/(2e-3*(1.45e-3)**2),P(STEEL_Y),'hardened steel\'s yield (no sheet: estimated)');
  line('  soft, as rolled',`${f(Fh,0)} N`,6*Fh*3.6e-3/(2e-3*(1.45e-3)**2),P([350,600]),'mild steel\'s yield');
  /* the stop bar's spring (Stegfeder 05 06 03-3, no sheet; fusee.js at SPW, the README's stop work): between 05 06_4 C-D's two drawn shapes its curvature changes by up to
     0.064-0.073 /mm along its free span, so a strip t thick of hardened spring steel (206 GPa) is stressed 6,500-7,500 t MPa wound, whatever its height h; the push on the bar
     (its strain energy over the 3.6) is linear in h: 0.06-0.08 N half way and 0.11-0.16 N wound at h 1.0 and t 0.10. No source draws its section (the coloured section leaves
     the recess uncoloured), so h is a design value between two bounds: at least 0.9, its pin's Ø 0.5 hole through it (05 06 03-2, C-D) with 0.2 of strip either side; at most
     1.5, on the cover plate under the recess's 1.6 (05 06 04-2) with 0.1 off its floor. What it must do: push the bar back out when the chain leaves it, against the 0.5 g bar's
     sliding on the cover plate (μ 0.3, estimated): its push at the lower bound, half way, is still many times that */
  const SPH=[0.9,1.5],SPh=1.0,Ph=[0.06,0.08],Pw=[0.11,0.16],fr=0.5e-3*G0*0.3;
  line('the stop bar\'s spring (0.10 thick, 1.0 high), wound',`${f(Pw[0],2)}-${f(Pw[1],2)} N`,7500*0.10*MPa,P(STEEL_Y),'hardened spring steel\'s yield (it flexes once a wind)');
  say(`    its height, drawn by no source: ${SPH[0]}-${SPH[1]} (its pin's hole; the recess's floor), ${f(SPh,1)} built; its push half way ${f(Ph[0]*SPH[0]/SPh,3)}-${f(Ph[1]*SPH[1]/SPh,3)} N over that range, ${f(Ph[0]*SPH[0]/SPh/fr,0)} times or more the bar's sliding (${f(fr*1000,1)} mN); its stress the same at any height`);}
console.log(rows.join('\n'));if(fail)process.exitCode=1;
