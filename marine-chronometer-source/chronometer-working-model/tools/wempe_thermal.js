// The Wempe's balance and hairspring in heat and cold (Node.js, no browser): the cut bimetallic rim (05 03 01-1: "Nickelstahl Sonderlegierung u. Messing", the nickel
// steel inside, the brass outside, cut at 90° from the arm so each quarter is a cantilever from the arm's end) with its four masses, and the carbon steel hairspring
// (05 03_6: "Bandstahl", hardened and tempered blue), against the 6MX's TU (6MX-figures.md: C ±0.10 s a day a °C, S ±1.20 s; the trial at 36/20/4/20/36 °C).
//   1. The linear term: the spring's stiffness E b h³ / 12 L moves by its thermoelastic coefficient e and its expansion (e + 3 αs a °C); the balance's moment of
//      inertia by every part's growth: the rim's two layers' mean expansion, the arm's ends (nickel steel) carrying the roots out, and the curl of each quarter
//      (Timoshenko's bimetal, 1925: Δκ = 6 Δα (1 + m)² / h [3 (1 + m)² + (1 + m n)(m² + 1 / m n)] a °C), which brings its free end and the masses on it in by
//      R² Δκ (1 - cos ψ) at ψ from the root, the masses clamping the rim across their slot (the arc under them stays straight in curvature); the masses, timing
//      weights and the rest weighed on the model's solids (wempe_inertia.json). The rate gained a day a °C, 86400 (e + 3 αs - dI/I) / 2, at the masses' drawn place
//      (32° from the 3-9 line, 05 03_2 scaled; the 6MX's 30°, 6MX-figures.md) and where they null it, the adjuster's place on the rim.
//   2. The middle-temperature (secondary) error: the steel spring's modulus falls faster as it warms (Dent's error: a few seconds a day at 15 °C with the rate right
//      at 0 and 30, Guillaume's Nobel lecture, 1920; about 2.5 s in the middle of a 30 °C range, VintageWatchstraps, "Temperature Compensation by Nickel Steels",
//      citing the Neuchâtel trials), against the rim's curl, linear in the temperature when its two metals' expansion grows alike (brass's and steel's quadratic
//      coefficients 5.5 and 5.2 × 10⁻⁹, the same source): so the TU's S for a brass and plain nickel steel rim, and the quadratic coefficient the nickel steel would
//      need to cancel it, as Guillaume's 42-44 % nickel steel ("anibal") with brass in his integral balance does (its quadratic coefficient negative: Guillaume, 1899;
//      the 6MX's book calls its balance "integral", Fig. 5.62).
// Published constants (ranges, each named where it is used); the rim's nickel steel isn't named on the sheet beyond "Sonderlegierung": taken as Guillaume's
// (estimated), with a plain nickel steel beside it. Exits 1 if no place of the masses on the free arc nulls the linear term within the TU's ±0.10 s a day a °C
// for the middle constants, or the bimetal formula fails its own check (equal layers: 1.5 Δα / h). About a second.
//   node wempe_thermal.js
const fs=require('fs'),path=require('path');
const J=JSON.parse(fs.readFileSync(path.join(__dirname,'wempe_inertia.json'),'utf8')),D=Math.PI/180,DAY=86400,f=(x,n=2)=>Number.isFinite(x)?(+x).toFixed(n):'-',sg=(x,n=2)=>Number.isFinite(x)?(x>=0?'+':'−')+Math.abs(x).toFixed(n):'-';
const rows=[];let fail=0;const say=s=>rows.push('  '+s),chk=(c,s)=>{if(!c)fail=1;rows.push(`${c?'  ok ':'  !! '} ${s}`);},head=s=>rows.push('\n'+s);
/* the rim (05 03 01-1, every figure sure): Ø 32.32 outside, the joint Ø 31.29, inside Ø 30.48, 3.8 high; the arm 3.2 wide at the rim; the cuts 1.5 at 90° from the arm */
const RI=30.48/2,RJ=31.29/2,RO=32.32/2,HR=3.8,t1=RJ-RI,t2=RO-RJ,R=(RI+RO)/2,PHI0=1.6/R/D,PHI1=90-0.75/R/D;   /* t1 the nickel steel's 0.405, t2 the brass's 0.515; the quarter's root (the arm's edge) and its free end at the cut, deg from the arm's line */
/* the masses (05 03 01-4, escapement.js): Ø 6.3 on the rim's middle at 32° from the 3-9 line, so 58° from the arm's; clamped on the rim across their slot, ±BETA */
const RM=(30.5/2+32.3/2)/2,PHIM=58,BETA=3.15/RM/D;
/* the weighed parts (g·mm², wempe_inertia.json): the masses with their screws and nuts; the timing weights and their screws at the arm's ends (their centre r, from
   the weights' own m and I); the rim and arm (050301-1: the rim's two layers worked out here, the arm the rest); the hub, staff, rollers, collet, a third of the spring */
const B=J.balance.byHn,Im=B['050301-4'].I+B['WN-12'].I+B['WN-12a'].I,mm=B['050301-4'].m+B['WN-12'].m+B['WN-12a'].m,Iw=B['050301-3'].I+B['050301-2'].I,rW=Math.sqrt(B['050301-3'].I/B['050301-3'].m);
const ring=(r0,r1,rho)=>rho*1e-3*2*Math.PI*HR*(r1**4-r0**4)/4*(1-4*1.5/(2*Math.PI*R)),Ins=ring(RI,RJ,8.1),Ibr=ring(RJ,RO,8.45),Irim=Ins+Ibr,Iarm=B['050301-1'].I-Irim;   /* the four cuts taken out */
const Irest={hub:B['050402-2'].I+B['WN-10'].I,staff:B['050402-1'].I,rollers:J.rollers.I,collet:J.collet.I,spring:J.spring.I/3},Itot=Im+Iw+Irim+Iarm+Object.values(Irest).reduce((a,b)=>a+b,0);
/* published constants, a °C (and GPa): */
const MAT={
  br:{a:[18.5e-6,20.0e-6],E:[95,110],b:5.5e-9},   /* brass (Messing; CuZn 37-40): 18.5-20 × 10⁻⁶ (thermal.js's leaded clock brass 18.7-20.9), E 95-110 GPa; quadratic 5.5 × 10⁻⁹ (VintageWatchstraps) */
  an:{a:[7.0e-6,8.5e-6],E:[145,160]},   /* Guillaume's balance nickel steel, 42-44 % Ni ("anibal"): about 7 × 10⁻⁶ at 42 % (Elgin's), 44-48 % nickel as glass's, 8-9 (VintageWatchstraps); E as Fe-Ni 42 (148 GPa, Special Metals' Nilo 42) */
  ns:{a:[11.0e-6,12.5e-6],E:[200,210],b:5.2e-9},   /* a plain nickel (3-5 %) steel, as carbon steel: 11-12.5 (thermal.js), E 200-210; quadratic 5.2 × 10⁻⁹ */
  sp:{a:[11.0e-6,12.5e-6],e:[-2.7e-4,-2.4e-4]},   /* the carbon steel hairspring: expansion as steel; thermoelastic coefficient (1/E dE/dT) -240 to -270 × 10⁻⁶ (physics.js's -250; a steel spring on a steel balance loses about 11 s a day a °C, VintageWatchstraps: -266) */
  bc:17e-6};   /* the beryllium copper impulse roller, 17 × 10⁻⁶ */
const mid=r=>(r[0]+r[1])/2;
/* the bimetal's curvature change a °C (Timoshenko), layer 1 inside (t1, E1, a1), 2 outside: positive when the outside grows more, the quarter curling in */
const dk=(a1,E1,a2,E2)=>{const m=t1/t2,n=E1/E2,h=t1+t2;return 6*(a2-a1)*(1+m)**2/(h*(3*(1+m)**2+(1+m*n)*(m*m+1/(m*n))));};
{const m=1,n=1,h=1,g=6*(1+m)**2/(h*(3*(1+m)**2+(1+m*n)*(m*m+1/(m*n))));chk(Math.abs(g-1.5)<1e-12,`Timoshenko's bimetal with equal layers gives 1.5 Δα / h (${f(g,4)})`);}
/* the radial movement a °C of a point on the quarter ψ (deg) from its root, the masses' clamp at [ψm-β, ψm+β] uncurled: the layers' mean growth e0 about the centre,
   the root carried out by the arm's growth (aA), the curl (K a °C) integrated from the root */
const uR=(psi,psiM,e0,aA,K)=>{const c=x=>Math.cos(x*D),regs=[[0,psiM-BETA],[psiM+BETA,1e9]];let curl=0;for(const[a,b]of regs){const bb=Math.min(b,psi);if(bb>a)curl+=c(psi-bb)-c(psi-a);}
  return R*(e0+(aA-e0)*c(psi))-K*R*R*curl;};
/* dI/I a °C for a set of constants and the masses' angle from the arm's line (deg); split: what the curl gives (dIk) */
const dII=(q,phiM)=>{const E1=q.Ens,E2=q.Ebr,e0=(E1*t1*q.ans+E2*t2*q.abr)/(E1*t1+E2*t2),K=dk(q.ans,E1,q.abr,E2),psiM=phiM-PHI0;
  let rim=0;const n=400,span=PHI1-PHI0;for(let i=0;i<n;i++){const psi=span*(i+0.5)/n;rim+=uR(psi,psiM,e0,q.ans,K)/R;}rim=rim/n*(span/PHI1)+q.ans*(PHI0/PHI1);   /* the rim's mean relative growth over the quarter, the part over the arm with it */
  const um=uR(psiM,psiM,e0,q.ans,K)/RM,uw=(R*q.ans+(rW-R)*q.asp)/rW;
  const tot=2*(Irim*rim+Im*um+Iw*uw+Iarm*q.ans+Irest.hub*q.abr+Irest.staff*q.asp+Irest.rollers*MAT.bc+Irest.collet*q.abr+Irest.spring*q.asp)/Itot;
  const curl=2*(Irim*(rim-uR0(q,psiM,e0,K))+Im*(um-(R*(e0+(q.ans-e0)*Math.cos(psiM*D)))/RM))/Itot;
  return{tot,curl,K,e0,um:um*RM};};
const uR0=(q,psiM,e0,K)=>{let s=0;const n=400,span=PHI1-PHI0;for(let i=0;i<n;i++){const psi=span*(i+0.5)/n;s+=(e0+(q.ans-e0)*Math.cos(psi*D));}return s/n*(span/PHI1)+q.ans*(PHI0/PHI1);};
const C=(q,phiM)=>DAY*(q.e+3*q.asp-dII(q,phiM).tot)/2;   /* s a day gained a °C */
const set=(nsKey,pick)=>({ans:pick(MAT[nsKey].a),Ens:pick(MAT[nsKey].E),abr:pick(MAT.br.a),Ebr:pick(MAT.br.E),asp:pick(MAT.sp.a),e:pick(MAT.sp.e)});
const MID=k=>set(k,mid);
const zero=q=>{let lo=PHI0+BETA,hi=PHI1-BETA;if(C(q,lo)*C(q,hi)>0)return null;for(let i=0;i<60;i++){const m=(lo+hi)/2;C(q,lo)*C(q,m)<=0?hi=m:lo=m;}return(lo+hi)/2;};

head('The balance as weighed (wempe_inertia.json) and its rim');
say(`${f(Itot,0)} g·mm²: the masses with their screws and nuts ${f(Im,0)} (${f(mm,2)} g, at ${f(PHIM,0)}° from the arm's line, r ${f(RM,2)}), the timing weights and their screws ${f(Iw,0)} (r ${f(rW,1)}, at the arm's ends), the rim ${f(Irim,0)} (nickel steel ${f(Ins,0)}, brass ${f(Ibr,0)}), the arm ${f(Iarm,0)}, the rest ${f(Itot-Im-Iw-Irim-Iarm,1)}`);
say(`each quarter a cantilever from the arm's edge (${f(PHI0,1)}°) to the cut (${f(PHI1,1)}°): ${f(R*(PHI1-PHI0)*D,1)} mm of rim, the nickel steel ${f(t1,3)} inside the brass's ${f(t2,3)}, ${HR} high`);

head('1. The linear term: the rate gained a day a °C (the TU\'s C, losing positive, is its negative: ±0.10 allowed)');
for(const[k,name]of[['an','Guillaume\'s 42-44 % nickel steel (the model\'s reading of "Sonderlegierung", estimated)'],['ns','a plain nickel steel']]){
  const q=MID(k),d=dII(q,PHIM),cs=DAY*(q.e+3*q.asp)/2;
  say(`${name}: the curl ${f(d.K*1e6,2)} × 10⁻⁶ a mm a °C (Δα ${f((q.abr-q.ans)*1e6,1)} × 10⁻⁶): the masses come in ${f(-d.um*1000,2)} µm a °C at ${PHIM}°; the spring alone loses ${f(-cs,1)} s a day a °C, the balance gives back ${f(-DAY*d.tot/2,1)} (its curl ${f(-DAY*d.curl/2,1)})`);
  const c0=C(q,PHIM),c6=C(q,60),z=zero(q),dc=(C(q,PHIM+1)-C(q,PHIM-1))/2;
  (module.exports.mid=module.exports.mid||{})[k]={spring:-cs,back:-DAY*d.tot/2,drawn:c0,zero:z,perDeg:dc,at:90-PHIM,ends:[C(q,PHI0+BETA),C(q,PHI1-BETA)]};   /* the essay's (wempe_essaydata.js) */
  say(`   at the drawn place (${PHIM}°, 32° from the cuts' line) ${sg(c0,2)} s a day a °C; at the 6MX's 30° (60°) ${sg(c6,2)}; ${z?`nulled with the masses at ${f(z,1)}° from the arm's line (${f(90-z,1)}° from the cuts' line)`:`no place on the free arc nulls it (${sg(C(q,PHI0+BETA),2)} at ${f(PHI0+BETA,0)}°, ${sg(C(q,PHI1-BETA),2)} at ${f(PHI1-BETA,0)}°)`}; a degree along the rim moves it ${f(dc,3)} s a day a °C, so the TU's ±0.10 is ±${f(0.1/Math.abs(dc),1)}° of the masses' place`);
  if(k==='an'){chk(!!z,`the masses' place that compensates lies on the free arc (${f(PHI0+BETA,0)}-${f(PHI1-BETA,0)}° for their Ø 6.3), with the middle constants`);
    /* over the constants' ranges: every corner of the ranges */
    const zs=[],cs0=[];for(const pa of[0,1])for(const pe of[0,1])for(const pb of[0,1])for(const ps of[0,1])for(const pE of[0,1]){const q2={ans:MAT.an.a[pa],Ens:MAT.an.E[pE],abr:MAT.br.a[pb],Ebr:MAT.br.E[1-pE],asp:MAT.sp.a[ps],e:MAT.sp.e[pe]};cs0.push(C(q2,PHIM));zs.push(zero(q2));}
    const zz=zs.filter(x=>x!=null);say(`   over the constants' ranges (the 32 corners): at the drawn place ${sg(Math.min(...cs0),2)} to ${sg(Math.max(...cs0),2)} s a day a °C; the compensating place ${zz.length?`${f(Math.min(...zz),0)}-${f(Math.max(...zz),0)}°`:'none'} (${zz.length} of 32 on the free arc): the spring's e alone spans ${f(DAY*(MAT.sp.e[1]-MAT.sp.e[0])/2,1)} s a day a °C, which only the adjuster's trial and the masses' moves settle (Op. as the 6MX's: the masses moved along the rim)`);
    /* what would make the drawn place compensate: the nickel steel's expansion, or the masses free of the rim (not clamped across their slot) */
    const aFor=ph=>{let lo=-2e-6,hi=12e-6;for(let i=0;i<60;i++){const m=(lo+hi)/2;C({...q,ans:m},ph)<0?hi=m:lo=m;}return(lo+hi)/2;};
    say(`   the drawn place would compensate with the nickel steel expanding ${f(aFor(PHIM)*1e6,1)} × 10⁻⁶ a °C (at 60°: ${f(aFor(60)*1e6,1)}), an invar-like 36-38 % nickel steel's, not the 42-44 %'s 7-8.5; or with the spring's e ${f((-2*C({...q,e:0},PHIM)/DAY)*1e6,0)} × 10⁻⁶ (its range -270 to -240)`);
    module.exports.linear={drawn:c0,at60:c6,zero:z,perDeg:dc,range:[Math.min(...cs0),Math.max(...cs0)],zeros:[Math.min(...zz),Math.max(...zz)],nZero:zz.length};}}

/* the essay's figure (wempe_essaydata.js): the rate gained a day a °C against the masses' place over the free arc (deg from the cuts' line, every half degree), with
   Guillaume's nickel steel's middle constants, the range over their 32 corners, and a plain nickel steel's middle */
module.exports.sweep=()=>{const q=MID('an'),qs=MID('ns'),K=[];for(let i=0;i<32;i++){const b=k=>(i>>k)&1;K.push({ans:MAT.an.a[b(0)],Ens:MAT.an.E[b(4)],abr:MAT.br.a[b(2)],Ebr:MAT.br.E[1-b(4)],asp:MAT.sp.a[b(3)],e:MAT.sp.e[b(1)]});}
  const rows=[];for(let d=Math.ceil(2*(90-PHI1+BETA))/2;d<=90-PHI0-BETA+1e-9;d+=0.5){const ph=90-d,cs=K.map(k=>C(k,ph));rows.push([d,C(q,ph),Math.min(...cs),Math.max(...cs),C(qs,ph)]);}
  return{arc:[90-PHI1+BETA,90-PHI0-BETA],rows};};

head('2. The middle-temperature (secondary) error over the TU\'s trial (36, 20, 4 °C): S = (ω36 + ω4) / 2 - ω20, losing positive, ±1.20 allowed');
{const MTE=[2.0,3.0],q=MID('an'),qs=MID('ns');   /* Dent's "a few seconds" at 15 °C right at 0 and 30; 2.5 s in the middle of 30 °C */
  const cs=MTE.map(x=>-x/225);   /* the spring's quadratic, s a day a °C² gained (the steel balance's curl linear, so all of Dent's error is the spring's) */
  const S=(qq,dB)=>cs.map(c=>-256*(c-DAY*dII(qq,PHIM).curl/(qq.abr-qq.ans)/2*dB));   /* the curl's quadratic gain: its differential strain's (Δβ τ²) share, at the curl's gain per unit Δα */
  const Sp=S(qs,MAT.br.b-MAT.ns.b);
  say(`the steel spring's own: Dent's error ${MTE.join('-')} s a day in the middle of 0-30 °C, a quadratic ${f(cs[0],4)} to ${f(cs[1],4)} s a day a °C²: over the TU's 4-36 °C it alone gives S ${sg(-256*cs[0],2)} to ${sg(-256*cs[1],2)} s`);
  say(`brass on a plain nickel steel (quadratics 5.5 and 5.2 × 10⁻⁹): S ${sg(Sp[0],2)} to ${sg(Sp[1],2)} s: outside the TU's ±1.20, the classical balance's error`);
  const per=DAY*dII(q,PHIM).curl/(q.abr-q.ans)/2,need=cs.map(c=>c/per),bns=need.map(x=>MAT.br.b-x);   /* per: minus the gain a °C² per unit Δβ */
  say(`the integral balance cancels it with a nickel steel whose expansion's quadratic is ${f(bns[0]*1e9,1)} to ${f(bns[1]*1e9,1)} × 10⁻⁹ a °C² (brass's 5.5 less ${f(need[0]*1e9,1)} to ${f(need[1]*1e9,1)}): negative, as Guillaume's 44.4 % alloy's is (1899); its value isn't to hand, so the drawn balance's S is taken as Guillaume's balances made it at Neuchâtel (1902): 0.33 s against ordinary balances' 1.63 (VintageWatchstraps' table), a fifth: ${sg(-256*cs[0]*0.2,2)} to ${sg(-256*cs[1]*0.2,2)} s here, inside the TU's ±1.20`);
  module.exports.secondary={Sspring:cs.map(c=>-256*c),Splain:Sp,bNeed:bns,Sintegral:cs.map(c=>-256*c*0.2)};}
say('the escapement\'s share (its geometry grown in the brass frame, as thermal.js finds for the Hamilton) is a few hundredths of a second a day a °C; the oil\'s is in the trial, not here');
module.exports.rows=rows;module.exports.fail=fail;
if(require.main===module){console.log(rows.join('\n'));process.exit(fail);}
