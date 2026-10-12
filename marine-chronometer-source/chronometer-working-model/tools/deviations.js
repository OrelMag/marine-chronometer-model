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

/* ---------- 2. the balance in Glucydur, the hairspring in Nivarox ---------- */
/* The Model 21's balance: a stainless rim on an Invar arm (the manual, Sec. II), with an Elinvar hairspring whose thermoelastic coefficient is set to cancel the
   balance's expansion (physics.js A5). The build's: a monometallic beryllium-bronze balance (Glucydur, 1930s) and a self-compensating Nivarox spring (Straumann,
   perfected 1933, patented 1935), whose coefficient is graded to the balance (a 1940 advertisement offered Nivarox springs for monometallic balances of nickel or
   Glucydur: WatchesbySJX, Hairspring Materials Part II).
   Glucydur's own figures aren't published; the CuBe2 family's are taken (C17200: density 8.25-8.36, expansion 17-17.5 × 10⁻⁶/°C, Xometry's and Materion's
   data sheets), Nivarox's expansion is estimated (7-10 × 10⁻⁶/°C, an Fe-Ni-Cr-Be alloy). The rate's change a °C, df/f = (e + 3 αs - 2 αb) / 2 (physics.js), is
   zero for e = 2 αb - 3 αs. The Navy's test allows 1.20 s a day between 55 and 90 °F (19.4 °C), so the spring's e must be within 2 × 1.20 / 86400 / 19.4 of it */
say('');say('2. The balance in Glucydur (beryllium bronze, monometallic), the hairspring in Nivarox (self-compensating), in place of stainless and Invar with Elinvar');
const I0=578.5,rhoO=[7.9,8.05],rhoG=[8.25,8.36],aB=[17e-6,17.5e-6],aS=[7e-6,10e-6],eReq=[2*aB[0]-3*aS[1],2*aB[1]-3*aS[0]],eTol=2*1.20/86400/((90-55)/1.8);
const Ir=[rhoG[0]/rhoO[1],rhoG[1]/rhoO[0]],k0=I0*1e-9*(4*Math.PI)**2,L=409.3,b=0.23,tS=E=>Math.cbrt(12*k0*(L/1000)/(E*1e9*b/1000))*1000;
say(`the balance the same shape in beryllium bronze (density ${rhoG.join('-')} against the stainless rim's and Invar arm's ${rhoO.join('-')}): its moment of inertia ${f((Ir[0]-1)*100,1)}-${f((Ir[1]-1)*100,1)} % more if the rim and arm carried it all (the screws, unchanged, carry some), so the spring ${f((Ir[0]-1)*100,1)}-${f((Ir[1]-1)*100,1)} % stiffer: vibrated to the made balance (the bench's test 5), its length taken at the stud`);
chk(eReq[0]>-10e-6&&eReq[1]<20e-6,`for no linear temperature error the spring's thermoelastic coefficient must be ${f(eReq[0]*1e6,1)} to ${f(eReq[1]*1e6,1)} × 10⁻⁶ a °C (2 αb - 3 αs: the bronze ${aB.map(x=>x*1e6).join('-')}, the spring ${aS.map(x=>x*1e6).join('-')} × 10⁻⁶, estimated): positive, as Nivarox is graded for monometallic balances; within ±${f(eTol*1e6,2)} × 10⁻⁶ of the value for the made pair, the Navy's 1.20 s a day over 55-90 °F`);
say(`the strip for Table II's balance (k ${f(k0*1e6,1)} µN·m a radian over ${L} mm, ${b} mm wide; Nivarox's modulus not published, taken 165-195 GPa as Elinvar-type alloys): ${f(tS(195),3)}-${f(tS(165),3)} mm thick, then ${f(Math.cbrt(Ir[1])*100-100,1)} % thicker or ${f((Ir[1]-1)*100,1)} % shorter for the bronze balance`);
say('the helix and its terminal curves stay as designed (hairspring.js, hairspring-fe.js): only the alloy and its grading change');
const bal={id:'balance',title:'Balance in Glucydur, hairspring in Nivarox',period:'Glucydur (beryllium bronze, 1930s) and Nivarox (Straumann, perfected 1933, patented 1935), offered together by 1940',parts:['bal','spr'],lines:['42178','42188'],
  vmat:{'42178':'Glucydur (beryllium bronze, Cu-Be-Fe), monometallic','42188':'Nivarox (Fe-Ni-Cr-Be, self-compensating), graded to the balance'},
  vtreat:{'42178':'turned and hardened (about 400 HB); the rim uncut; poised, the screws as drawn',
    '42188':`the same helix and terminal curves (hairspring.js), the strip ${f(tS(195),3)}-${f(tS(165),3)} mm × ${b} mm; its thermoelastic coefficient graded to ${f(eReq[0]*1e6,0)} to ${f(eReq[1]*1e6,0)} × 10⁻⁶ a °C for the made balance (within ±${f(eTol*1e6,1)}); vibrated to the balance, its length taken at the stud`},
  why:`A monometallic bronze balance with a self-compensating spring replaces a balance of two metals and an Elinvar spring whose heat treatment must be matched to it: the spring is bought graded to the balance, the temperature error trimmed on the bench, and the balance is turned in one piece on the CNC. The balance comes out ${f((Ir[0]-1)*100,0)}-${f((Ir[1]-1)*100,0)} % heavier for its shape, which the spring's length takes up; the spring must cancel the bronze's expansion, ${f(eReq[0]*1e6,0)} to ${f(eReq[1]*1e6,0)} × 10⁻⁶ a °C, within ±${f(eTol*1e6,1)} to meet the Navy's temperature figure. The density and expansion are beryllium bronze's (CuBe2), Nivarox's expansion and modulus estimated: the temperature test (the bench's last) settles it.`,
  sources:['Glucydur, Wikipedia; Horopedia: beryllium bronze with iron, about 400 HB, non-magnetic, for balances','Xometry, beryllium bronze C17200 data sheet: density 8.25 g/cm³, expansion 17 × 10⁻⁶/°C','Nivarox, Wikipedia; WatchesbySJX, "Hairspring Materials and Evolution Part II" (2025); VintageWatchstraps, "Nivarox balance springs": Fe-Ni-Cr-Be, its thermoelastic coefficient set by alloy and heat treatment, positive for monometallic balances; perfected 1933, patented 1935','The manual (Sec. II): the Model 21\'s stainless rim, Invar arm and Elinvar spring'],
  numbers:{I0,rhoO,rhoG,Ir,aB,aS,eReq,eTol,k0,tStrip:[tS(195),tS(165)]}};
const J={note:'tools/deviations.js: the build\'s deviations from the Model 21, each on its parts\' cards with the original beside it (read by makers.py)',devs:[ms,bal]};
const OUT=path.join(__dirname,'deviations.json'),txt=JSON.stringify(J,null,1)+'\n';
module.exports=J;if(require.main!==module)return;
if(process.argv.includes('--write')){fs.writeFileSync(OUT,txt);say('wrote tools/deviations.json');}
else{const ok=fs.existsSync(OUT)&&fs.readFileSync(OUT,'utf8')===txt;chk(ok,ok?'tools/deviations.json is up to date':'tools/deviations.json is not what this finds: run node deviations.js --write, then python makers.py');}
console.log(rows.join('\n'));process.exit(fail);
