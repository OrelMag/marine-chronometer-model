// The build's deviations from the Model 21: what a chronometer made today to the model changes, with 1950s materials, and what each change does to the
// numbers. Each shows on its part's card with the original beside it and a button back to it (maker.js; the link keeps orig=ID for one set back). Needs only Node.js:
//   node deviations.js            prints them; exit 1 if tools/deviations.json (read by makers.py) is not what it finds, or a deviation fails its own check
//   node deviations.js --write    writes tools/deviations.json (then run makers.py)
// About a second. Sources are named on each line; what no source gives is marked estimated, here and in the cards.
const fs=require('fs'),path=require('path'),PH=require('./physics.js');
const f=(x,n=2)=>(+x).toFixed(n),rows=[];let fail=0;const say=s=>rows.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;rows.push(`${ok?'  ok ':'  !! '} ${s}`);};
const TOL=JSON.parse(fs.readFileSync(path.join(__dirname,'tolerances.json'),'utf8'));

/* ---------- 1. the mainspring in Nivaflex 45/5 ---------- */
/* Nivaflex 45/5 (Jacques Allemann's data sheet JAS-014, 2021): Co 45, Ni 21, Cr 18, Fe 5, W 4, Mo 4, Ti 1, Be 0.2; E 220 GPa, G 90, density 8.50, expansion
   11.2 × 10⁻⁶/K (20-200 °C); tensile strength over 3000 N/mm² achievable, raised by 2 h at 500 °C; non-magnetic; resistant to seawater and salt mist; fatigue
   "practically excluded". Straumann's alloy: patented 1948 (Nivaflex SA, Saint-Imier), the name registered 1957. The drawn spring is carbon steel, 207 GPa
   (physics.js), working near 2.5-2.6 GPa fully wound (strength.js). Kept to the same torque (so the fusee, the swing and every check are unchanged): its
   stiffness E b t³ / 12 L the same at the drawn width and length, so t ∝ E^(-1/3), and its stress at the same moment ∝ 1/t² */
say('1. The mainspring in Nivaflex 45/5 (Straumann, patented 1948, named 1957) in place of hardened carbon steel');
const E0=PH.E/1e9,E1=220,t0=PH.MS.t,t1=t0*Math.cbrt(E0/E1),s0=PH.sUp/1e6,s1=s0*(t0/t1)**2,SN=3000,SS=[2500,2600];
const band=/\(([\d.]+)-([\d.]+) mm thick at the drawn/.exec(TOL['42038']);if(!band)throw Error('tolerances.json: the mainspring\'s thickness band');
const tb=[+band[1],+band[2]].map(x=>x*Math.cbrt(E0/E1));
say(`the same torque (${f(PH.Mup,2)} N·m fully wound) from a strip ${f(t1,3)} mm thick at the drawn ${f(PH.b*1000,2)} mm and ${PH.MS.len} mm (the steel's ${t0}): E ${E1} GPa against ${E0}`);
chk(SN/s1>Math.max(...SS)/s0,`its stress fully wound ${f(s1,0)} MPa (the steel's ${f(s0,0)}): margin ${f(SN/s1,2)} on Nivaflex's 3000 N/mm² against the steel's ${f(SS[0]/s0,2)}-${f(SS[1]/s0,2)} on its working 2.5-2.6 GPa`);
say(`its band for the manual's swing (tolerances.js, scaled to 220 GPa): ${f(tb[0],3)}-${f(tb[1],3)} mm; and it neither rusts nor magnetizes at sea, nor sets as carbon steel does (the model's mset slider shows what a set costs)`);
const ms={id:'mainspring',title:'Mainspring in Nivaflex 45/5',period:'Straumann\'s Nivaflex: patented 1948, the name registered 1957',parts:['mainspring','barrel'],lines:['42038'],
  vmat:'Nivaflex 45/5 (Co 45, Ni 21, Cr 18, Fe 5, W 4, Mo 4, Ti 1, Be 0.2 %)',vtreat:`cold-drawn strip ${f(t1,3)} mm thick (${f(tb[0],3)}-${f(tb[1],3)} keeps the manual's swing) × ${f(PH.b*1000,2)} mm × ${PH.MS.len} mm, aged 2 h at 500 °C to over 3000 N/mm²; coiled; greased`,
  why:`The same torque from a strip ${f(t1,3)} mm thick (E 220 GPa against carbon steel's 207), so the fusee, the swing and the rate are unchanged. Fully wound it is stressed ${f(s1,0)} MPa, a margin of ${f(SN/s1,2)} on Nivaflex's 3000 N/mm² against carbon steel's ${f(SS[0]/s0,2)}-${f(SS[1]/s0,2)}; it doesn't take a set, rust in salt air or magnetize, so its pull, and with it the rate, holds steady over the months a navigator carries it.`,
  sources:['Jacques Allemann, Nivaflex 45/5 data sheet JAS-014 (2021): composition, E 220 GPa, density 8.50, expansion 11.2 × 10⁻⁶/K, strength over 3000 N/mm², non-magnetic, corrosion','Vacuumschmelze, Nivaflex 45/18 brochure: tensile strength up to 2900 MPa, hardness up to 800 HV, mainsprings among its uses','Nivaflex, Wikipedia; R. Straumann, Grail-Watch wiki: patented 1948, Nivaflex SA, the name registered 1957'],
  numbers:{t0,t1,E0,E1,s0,s1,SN,SS,tb}};

/* ---------- 2. the hairspring in Nivarox; the balance kept as the Model 21's ---------- */
/* The Model 21's balance is a stainless rim on an Invar arm (the manual, Sec. II) with an Elinvar hairspring whose thermoelastic coefficient e (dE/E dT), set by
   its heat treatment, cancels the balance's expansion (physics.js A5); Table IV (p. 74) trims what is left by moving screw pairs along the rim (Op. 8). Elinvar
   springs heat-treated to a balance aren't to be had; Nivarox (Straumann, perfected 1933, patented 1935), an Fe-Ni-Cr-Be alloy whose e is set by its precipitation
   hardening, is bought graded to a balance's expansion (a 1940 advertisement offered it for monometallic balances of nickel or Glucydur: WatchesbySJX, Hairspring
   Materials Part II). The build keeps the balance and takes the spring in Nivarox. Until 13 October 2026 it took a one-piece Glucydur balance as well: with
   nothing to trim, the spring's e had to be held within ±1.4 × 10⁻⁶ a °C for the Navy's 1.20 s a day over 55-90 °F, about a seventh of what a bought spring
   holds (an alloy's e within ±10 × 10⁻⁶ a °C makes ±0.6 s a day a °C: EP3502288A1, Nivarox-FAR's).
   Table IV as ring mechanics: the rim grows as stainless, the arm's ends hold it to Invar's growth, so it is pulled in at the arm and bulges at the quarter. A thin
   inextensible ring under two opposite radial forces deflects as S(θ) = Σ cos nθ / (n² - 1)², n = 2, 4, 6 ... (the ring's bending by Fourier series: Timoshenko,
   Strength of Materials, Part II; its two diameters change as 0.1366 and 0.1488 P R³ / E I, Roark, which the series must give). A pair (mass M, its centre r)
   moved from the quarter (hole 7) to hole n then changes the rate in heat by M r C (S(θn) - S(θ7)) ΔT / I of a day: C, the one unknown, is fitted to all forty
   of Table IV's figures, and C S(0) / R is the rim's expansion less the arm's. The pairs' masses are the parts list's (movement.js BSZ and BWA; the 0.120 in head
   extrapolated, 0.090 and 0.070 a screw under a 0.010 in washer). Then the whole balance's expansion (rim, arm, hub, the standard set of screws, the weights;
   I_REST, the 8 % the drawing lacks, taken anywhere between Invar and the rim) gives the e the spring must have, and every placing of the standard pairs in holes
   3-12 the e Table IV can take up. Nivarox's expansion isn't published: 7-10 × 10⁻⁶ a °C (an Elinvar-type alloy, estimated); Invar 1.0-1.6; brass 19 */
say('');say('2. The hairspring in Nivarox (graded for a monometallic balance) in place of Elinvar; the balance kept as the Model 21\'s, a stainless rim on an Invar arm, Table IV\'s screws trimming it');
const MV=fs.readFileSync(path.join(__dirname,'..','js','movement.js'),'utf8'),grab=(re,w)=>{const m=re.exec(MV);if(!m)throw Error('movement.js: '+w);return m[1];},ev=s=>Function('return '+s)();
const T4H=ev(grab(/const T4H=(\[[^\]]*\]),T4=/,'Table IV\'s heads')),T4=ev(grab(/,T4=(\{[^}]*\})/,'Table IV')),BSZ=ev(grab(/const BSZ=(\{[^}]*\})/,'BSZ')),BWA=ev(grab(/const BWA=(\{[^}]*\})/,'BWA')),
  STD=ev(grab(/R\.screwStd=(\[[^\]]*\])/,'the standard set')),BR=+grab(/BAL_R=([\d.]+)/,'BAL_R'),RH=+grab(/BAL_RH=([\d.]+)/,'BAL_RH'),RW=+grab(/RH=BAL_RH,RW=([\d.]+)/,'the rim\'s width');
const I0=578.5,dT=(90-55)/1.8,DAY=86400,se=2/(DAY*dT),th=n=>(n-1)*Math.PI/12,S=t=>{let s=0;for(let n=2;n<=400;n+=2)s+=Math.cos(n*t)/(n*n-1)**2;return s;};   /* se: the e of 1 s a day over 55-90 °F */
chk(Math.abs(-S(Math.PI/2)/S(0)-0.1366/0.1488)<0.002,`the ring's series gives its two diameters' changes in the ratio ${f(-S(Math.PI/2)/S(0),4)} (Roark's 0.1366 / 0.1488, ${f(0.1366/0.1488,4)})`);
const mp=h=>BSZ[h][1],MH=[2*mp('0.100')-mp('0.080'),mp('0.100'),mp('0.080')+BWA['0.010'][1],mp('0.080'),mp('0.060')+BWA['0.010'][1],mp('0.060'),mp('0.050'),mp('0.040')],FR=[];
for(const n of[8,9,10,11,12])T4H.forEach((hh,i)=>FR.push({n,hh,v:T4[n][i],g:MH[i]/1000*(BR+hh*25.4/2)*(S(th(n))-S(th(7)))*dT*DAY/I0}));
const C=FR.reduce((q,r)=>q+r.g*r.v,0)/FR.reduce((q,r)=>q+r.g*r.g,0),rms=Math.sqrt(FR.reduce((q,r)=>q+(r.v-C*r.g)**2,0)/FR.length),dA=C*S(0)/BR,dAm=[16e-6-1.6e-6,17.3e-6-1.0e-6];
chk(rms<0.3,`Table IV's ${FR.length} figures (a pair moved from hole 7 to 8-12 under heads of 0.040-0.120 in, up to ${Math.max(...T4[12])} s a day) as the rim's bending: one constant fitted, the quarter bulging ${f(C*(S(0)-S(Math.PI/2))*1000,2)} µm a °C past the arm's ends, they come out within ${f(rms,2)} s a day rms`);
chk(dA>0.75*dAm[0]&&dA<1.25*dAm[1],`so the rim grows ${f(dA*1e6,1)} × 10⁻⁶ a °C more than the arm: austenitic stainless (16-17.3) on Invar (1.0-1.6) gives ${f(dAm[0]*1e6,1)}-${f(dAm[1]*1e6,1)}. The manual's table, from real balances, agrees with the model's stainless rim on an Invar arm (within ${f(100*(dA/dAm[1]-1),0)} %, the ring taken as inextensible and the arm as rigid)`);
const aInvR=[1.0e-6,1.6e-6],aSp=[7e-6,10e-6],aBr=19e-6,aSt=11.5e-6,Irim=7.9*Math.PI*RH*(BR**4-(BR-RW)**4)/2/1000,Iarm=8.1*(2*BR-1)*1.1*2.4*((2*BR-1)**2+2.4**2)/12/1000,
  Ihub=7.9*Math.PI*(0.6*2.2**4+2.05*1.1**4+0.35*(2.2**4-1.15**4))/2/1000,TW=[0.093,BR+0.35+2.3/2],VW=[0.0105,BR-RW-0.6-0.75];   /* movement.js I_FIX and W: rim, arm, hub; the timing and vernier weights, a pair's mass (g) and radius */
const ab=(aInv,restRim)=>{const aR=aInv+dA,w=t=>aR*BR-C*S(t);let I=Irim+Iarm+Ihub+TW[0]*TW[1]**2+VW[0]*VW[1]**2,dI=2*aR*Irim+2*aInv*Iarm+2*aSt*Ihub+2*TW[0]*TW[1]*(w(0)+aSt*(TW[1]-BR))+2*VW[0]*VW[1]*w(th(2))*VW[1]/BR;
  for(const p of STD){const L=BSZ[p.h][0]*25.4,r=BR+L/2,M=mp(p.h)/1000;I+=M*r*r;dI+=2*M*r*(w(th(p.n))+aBr*L/2);}const Ir=I0-I;return{ab:(dI+2*(restRim?aR:aInv)*Ir)/(2*I0),Ir};};
const AB=[];for(const ai of aInvR)for(const rr of[0,1])AB.push(ab(ai,rr).ab);const abR=[Math.min(...AB),Math.max(...AB)],eReq=[2*abR[0]-3*aSp[1],2*abR[1]-3*aSp[0]],gReq=[2*17e-6-3*aSp[1],2*17.5e-6-3*aSp[0]],eMid=(eReq[0]+eReq[1])/2;
say(`the balance, standard set (holes ${STD.map(p=>p.n).join(', ')}), expands as a ${f(abR[0]*1e6,1)}-${f(abR[1]*1e6,1)} × 10⁻⁶ a °C metal would (the rim ${f(Irim,0)} of its ${I0} g·mm², the screws most of the rest, the arm ${f(Iarm,0)}; I_REST ${f(ab(1.2e-6,0).Ir,0)} anywhere between Invar and the rim)`);
const eTolG=2*1.20/86400/dT;
chk(eReq[0]>-10e-6&&eReq[1]<20e-6,`for no linear temperature error the spring's e must be ${f(eReq[0]*1e6,1)} to ${f(eReq[1]*1e6,1)} × 10⁻⁶ a °C (2 αb - 3 αs, the spring ${aSp.map(x=>x*1e6).join('-')} × 10⁻⁶, estimated): positive, as Nivarox is graded for monometallic balances; a beryllium-bronze balance's ${f(gReq[0]*1e6,0)} to ${f(gReq[1]*1e6,0)} overlaps it`);
const T4f=(hh,n)=>{n=n<7?14-n:n;if(n===7)return 0;const r=T4[n];let i=0;while(i<T4H.length-2&&hh<T4H[i+1])i++;return r[i]+(r[i+1]-r[i])*(hh-T4H[i])/(T4H[i+1]-T4H[i]);};   /* movement.js R.T4 */
const HO=[3,4,5,6,7,8,9,10,11,12],hh=p=>BSZ[p.h][0]+(p.w?BWA[p.w][0]:0),cur=STD.reduce((q,p)=>q+T4f(hh(p),p.n),0),VS=new Set();let lo=1e9,hi=-1e9;
const put=(k,used,s)=>{if(k===STD.length){lo=Math.min(lo,s);hi=Math.max(hi,s);VS.add(Math.round((s-cur)*100));return;}for(const n of HO)if(!used.has(n)){used.add(n);put(k+1,used,s+T4f(hh(STD[k]),n));used.delete(n);}};
put(0,new Set(),0);const VL=[...VS].sort((a,b)=>a-b);let gap=0;for(let i=1;i<VL.length;i++)gap=Math.max(gap,(VL[i]-VL[i-1])/100);
const win=[-(hi-cur)*se,(cur-lo)*se];
chk(gap<0.5*1.20,`Table IV's moves (Op. 8; each pair keeps its head, so the moment of inertia and the rate stand): from the standard set's ${f(cur,2)} s a day, ${f(lo-cur,2)} to +${f(hi-cur,2)} s a day between 55 and 90 °F over ${VL.length} placings, none more than ${f(gap,2)} s from the next (the Navy's 1.20)`);
chk(win[1]-win[0]>3*2*eTolG,`so they take up a spring ${f(win[0]*1e6,1)} to +${f(win[1]*1e6,1)} × 10⁻⁶ a °C off its mark, ${f((win[1]-win[0])/(2*eTolG),1)} times the ±${f(eTolG*1e6,2)} a one-piece balance would need it held to (the build's Glucydur balance until 13 October 2026)`);
say(`a bought spring holds its e to about ±10 × 10⁻⁶ (EP3502288A1): ordered at +${f(eMid*1e6,0)}, the trim takes up most of it once Nivarox's expansion is known (that alone spans ${f(3*(aSp[1]-aSp[0])*1e6,0)} of the ${f((eReq[1]-eReq[0])*1e6,0)} above); further off, the spring's own hardening moves its e, or another is fitted. The bench's temperature test says which way and how far`);
const k0=I0*1e-9*(4*Math.PI)**2,L=409.3,b=0.23,tS=E=>Math.cbrt(12*k0*(L/1000)/(E*1e9*b/1000))*1000;
say(`the strip for Table II's balance (k ${f(k0*1e6,1)} µN·m a radian over ${L} mm, ${b} mm wide; Nivarox's modulus not published, taken 165-195 GPa as Elinvar-type alloys): ${f(tS(195),3)}-${f(tS(165),3)} mm thick; the helix and its terminal curves stay as designed (hairspring.js, hairspring-fe.js)`);
const bal={id:'hairspring',title:'Hairspring in Nivarox, the balance the Model 21\'s',period:'Nivarox (Straumann, perfected 1933, patented 1935), offered graded to a balance by 1940',parts:['spr'],lines:['42188'],
  vmat:'Nivarox (Fe-Ni-Cr-Be, self-compensating), graded for a monometallic balance',
  vtreat:`the same helix and terminal curves (hairspring.js), the strip ${f(tS(195),3)}-${f(tS(165),3)} mm × ${b} mm; its thermoelastic coefficient about +${f(eMid*1e6,0)} × 10⁻⁶ a °C (${f(eReq[0]*1e6,0)} to ${f(eReq[1]*1e6,0)} for the Model 21's balance; Table IV takes up ${f(win[0]*1e6,1)} to +${f(win[1]*1e6,1)} of it); vibrated to the balance, its length taken at the stud`,
  why:`Elinvar springs heat-treated to suit a balance can't be bought; Nivarox, graded to a balance's expansion, can. The Model 21's own balance is kept: its stainless rim on an Invar arm expands as a ${f(abR[0]*1e6,0)}-${f(abR[1]*1e6,0)} × 10⁻⁶ a °C metal would (Table IV's figures, read as the rim's bending, give it), so the spring wants ${f(eReq[0]*1e6,0)} to ${f(eReq[1]*1e6,0)} × 10⁻⁶ a °C, about what Nivarox is graded to for bronze balances. What the spring misses, Table IV's screw moves (Op. 8) trim on the bench: ${f(lo-cur,1)} to +${f(hi-cur,1)} s a day between 55 and 90 °F, in steps of ${f(gap,2)} s or less, so a spring ${f(win[0]*1e6,1)} to +${f(win[1]*1e6,1)} × 10⁻⁶ a °C off its mark still meets the Navy's 1.20. A one-piece Glucydur balance (the build's until 13 October 2026) has nothing to trim and would need the spring held to ±${f(eTolG*1e6,1)}, a seventh of what a bought spring holds. Nivarox's expansion and modulus are estimated: the temperature test (the bench's last) settles it.`,
  sources:['Nivarox, Wikipedia; WatchesbySJX, "Hairspring Materials and Evolution Part II" (2025); VintageWatchstraps, "Nivarox balance springs": Fe-Ni-Cr-Be, its thermoelastic coefficient set by alloy and heat treatment, graded for monometallic balances; perfected 1933, patented 1935','EP3502288A1 (Nivarox-FAR): an alloy\'s thermoelastic coefficient within ±10 ppm/°C gives an oscillator within ±0.6 s a day a °C','The manual: Sec. II (the stainless rim, Invar arm and Elinvar spring), Table IV (p. 74) and Op. 8','S. Timoshenko, Strength of Materials, Part II: a thin ring\'s bending by Fourier series; Roark\'s Formulas for Stress and Strain: a ring under two opposite forces'],
  numbers:{fit:FR.map(r=>[r.n,r.hh,r.v,+(C*r.g).toFixed(3)]),I0,C,rms,dA,abR,eReq,gReq,eMid,eTolG,cur,lo,hi,gap,win,tStrip:[tS(195),tS(165)]}};
const J={note:'tools/deviations.js: the build\'s deviations from the Model 21, each on its parts\' cards with the original beside it (read by makers.py)',devs:[ms,bal]};
const OUT=path.join(__dirname,'deviations.json'),txt=JSON.stringify(J,null,1)+'\n';
module.exports=J;if(require.main!==module)return;
if(process.argv.includes('--write')){fs.writeFileSync(OUT,txt);say('wrote tools/deviations.json');}
else{const ok=fs.existsSync(OUT)&&fs.readFileSync(OUT,'utf8')===txt;chk(ok,ok?'tools/deviations.json is up to date':'tools/deviations.json is not what this finds: run node deviations.js --write, then python makers.py');}
console.log(rows.join('\n'));process.exit(fail);
