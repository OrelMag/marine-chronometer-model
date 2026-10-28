// How long the Wempe's parts keep their figures: wear.js's method for the Wempe (Node.js, no browser). Every sliding contact's wear by Archard's law (V = k F s / H: k the
// wear coefficient, F the load, s the distance slid, H the softer part's hardness; Archard 1953), its depth a year over the area that takes it, and the years until that
// depth eats the tolerance the Wempe's own checks give it: a pivot hole worn open moves its arbor and changes its meshes' depth (gearing_wempe.json: each mesh's close side,
// less the hole tolerance and the pivots' shake), the balance staff's pivot end wears its endshake (the 1958 MX repair book's 0.04-0.06, set to its middle), the escape
// teeth's tips wear the depth of lock (tolerances_wempe.json's lock window: the bench sets the banking to its middle, wempe_bench.js, so the room is the middle less the
// shallow end), the gold spring's face wears the discharge's lift (makeEsc's: the tooth is free at 82 % of lRel, tripping.js), the chain's rivets wear its pitch, the clicks
// and the maintaining detent the faces they catch. k from Rabinowicz's table (Friction and Wear of Materials, 2nd ed. 1995), as wear.js: 1e-7 well oiled, 1e-6 poorly, 1e-5
// once the oil has gone, for the oiled contacts; the escapement runs dry, as a chronometer's does (the stones on the wheel and the gold spring are never oiled), so its
// contacts take Rabinowicz's unlubricated non-metal on metal, 1.5e-6, with 5e-7 and 1.5e-5 beside it. The hardnesses published ranges' soft ends (Ms 58 brass 100 HV,
// hardened steel 600, 333 gold hard rolled 150 (estimated: 8 ct gold hard rolled 150-230 HV), ruby 2000). The loads are wempe_strength.js's (fully wound, every stage
// lossless: the largest), the turns the train's and the fusee's own, wound once a day. An escape tooth's tip is a wedge (its land 0.02 wide, estimated) whose worn flat grows
// as it wears, so its depth follows V = b (w h + c h²) (c 0.5, estimated), not a constant area. Wear is the order of magnitude, not the figure: what lasts decades as it runs,
// and what the oil's life and the overhaul decide.
//   node wempe_wear.js [--json OUT] [--fault]   (about 10 s, wempe_strength.js run first; MC_WREV=build or build40 for a build: its strip's loads, its lock window; exits 1
//                                               if a contact as it runs (oiled well, or the escapement dry at 1.5e-6) reaches its tolerance within a service interval, three
//                                               years (the 1954 Soviet instruction's cleaning and fresh oil, 6MX-figures.md), a repairer's band excepted (~~); --fault: the
//                                               dry escapement's k taken 1e-4, a metal pair's, which must fail)
const fs=require('fs'),path=require('path'),cp=require('child_process'),W=require('./wempe_load.js')(),{WPHYS:P,WESC,WD}=W,E=P.ESC;
const BREV=/^build/.test(process.env.MC_WREV||'')?process.env.MC_WREV:'',SUF=BREV?'_'+BREV:'',J=f=>JSON.parse(fs.readFileSync(path.join(__dirname,f),'utf8'));
const GJ=J('gearing_wempe.json'),TOL=J(`tolerances_wempe${SUF}.json`),WJ=J('wempe_inertia.json'),FAULT=process.argv.includes('--fault');
const f=(x,n=0)=>(+x).toFixed(n),HV=v=>v*9.807e6,YR=365.25*86400,rows=[],out={rev:BREV||'last',contacts:[]};let fail=0;const say=s=>rows.push('  '+s);
const K={good:1e-7,poor:1e-6,dry:1e-5},KD={good:FAULT?1e-4:1.5e-6,poor:5e-6,dry:1.5e-5},H={brass:HV(100),steel:HV(600),gold:HV(150),ruby:HV(2000)};
/* the pivots' loads, as wempe_strength.js gives them (its output read: one place for them) */
const SO=cp.execFileSync(process.execPath,[path.join(__dirname,'wempe_strength.js')],{encoding:'utf8',cwd:__dirname}),pv=(key)=>{const r=SO.split('\n').find(x=>x.includes(key));
  const m=r&&/\s([\d.]+) N\s/.exec(r.slice(r.indexOf(key)+key.length).replace(/\([^)]*\)/g,''));if(!m)throw Error('wempe_strength.js: no line '+key);return +m[1];};
const Ffu=pv("the fusee arbor's pivot (Ø 2.8"),Fbr=pv("the barrel's drum on its arbor's journals"),Fc=pv("the centre arbor's pivot"),Fi=pv("the intermediate arbor's pivots"),
  Fs=pv("the seconds arbor's pivot"),Fe=pv("the escape arbor's pivots"),pull=pv('a rivet, in double shear');
/* turns a day: the fusee one in 90/14 h (HPT), wound back once a day, so its arbor and the barrel's drum turn twice their running turns; the train from the centre's 24 */
const fud=24/P.HPT,day={fusee:2*fud,centre:24,inter:24*90/12,seconds:24*90/12*80/10,escape:24*90/12*80/10*80/10};
/* the chain a day: the fusee's turns over its groove's mean pitch radius (fusee.js's RFT, the groove's floor, and the pitch line 1.02 out), onto the barrel's drum (r 20.8 + 1.02) */
const fsrc=fs.readFileSync(path.join(__dirname,'..','..','wempe','js','fusee.js'),'utf8'),RFT=JSON.parse(/const RFT=(\[[\d.,\s]+\])/.exec(fsrc)[1]),rfm=RFT.reduce((a,b)=>a+b,0)/RFT.length+1.02,RB=41.6/2+1.02;
const chain=fud*2*Math.PI*rfm,brd=2*chain/(2*Math.PI*RB);   /* mm a day running; the drum's turns a day, running and winding */
/* each mesh's room: its close side less the hole tolerance and the shake (gearing_wempe.json) */
const R=GJ.stages.map(s=>-s.lo-s.tp-s.sh);
/* the lock's room: the banking set to the window's middle (wempe_bench.js), the shallow end the floor; a tooth's tip worn by h takes h off the depth, an escape pivot worn
   toward the balance closes the centre distance by as much (taken 1:1, estimated) */
const LK=TOL.lock,lockRoom=(LK.aim??(LK.deep+LK.shallow)/2)-LK.shallow;   /* the bench's aim (tolerances_wempe.json) over the floor */
/* the discharge's lift: makeEsc's release lift (lRel, mm at the stone), the tooth free at 82 % of it (tripping.js), so the gold spring's face may wear 18 % of it before a pass fails to unlock */
const m=E.measure(),liftRoom=0.18*m.lRel;
const C=(name,F,s,Hs,A,tol,what,src,dryEsc,wedge,soft)=>{const o={name,F,s,A,tol,what,src,dry:!!dryEsc,soft:soft||'',h:{},yrs:{}},KK=dryEsc?KD:K;
  for(const k in KK){const V=KK[k]*F*s/Hs*1e9;   /* mm³ a year */
    if(wedge){const{b,w,c}=wedge,hAt=Vt=>(-w+Math.sqrt(w*w+4*c*Vt/b))/(2*c);o.h[k]=hAt(V);let lo=0,hi=1e5;for(let i=0;i<80;i++){const md=(lo+hi)/2;hAt(V*md)<tol?lo=md:hi=md;}o.yrs[k]=lo;}
    else{o.h[k]=V/A;o.yrs[k]=tol/o.h[k];}
    if(k==='good')o.curve=[0,0.5,1,1.5,2,3,4,5,6,8,10,12].map(t=>[t,+((wedge?((V2=>(-wedge.w+Math.sqrt(wedge.w**2+4*wedge.c*V2/wedge.b))/(2*wedge.c))(V*t)):V/A*t)/tol).toFixed(4)]);}   /* the share of its tolerance worn, year by year, as it runs (the report's chart) */
  out.contacts.push(o);return o;};   /* h mm the first year; years to the tolerance */
const pivot=(name,F,r,L,turns,Hs,tol,what)=>C(name,F,2*Math.PI*r*1e-3*turns*365.25,Hs,2*r*L,tol,what,"wempe_strength.js's load, the pivot projected");
pivot('fusee arbor\'s journal in its bush (Ø 4.5, 8 long)',Ffu,2.25,8,day.fusee,H.brass,R[0],'the fusee wheel\'s depth on the centre pinion');
pivot('fusee arbor\'s pivot in the pillar plate (Ø 2.8)',Ffu,1.4,3.35,day.fusee,H.brass,R[0],'the fusee wheel\'s depth on the centre pinion');
C('barrel\'s drum on its arbor\'s journals (Ø 4.48, 2 × 3.1)',Fbr,2*Math.PI*2.24e-3*brd*365.25,H.brass,4.48*6.2,0.10,'the drum\'s line to the fusee\'s groove (0.10, estimated)',"wempe_strength.js's load, the drum's turns a day running and winding");
pivot('centre arbor\'s pivot in WN-301 (Ø 1.19, 3 long)',Fc,0.595,3,day.centre,H.brass,Math.min(R[0],R[1]),'the centre\'s meshes\' depths');
pivot('intermediate arbor\'s pivot in WN-300 (Ø 0.825)',Fi,0.4125,2.95,day.inter,H.brass,Math.min(R[1],R[2]),'the intermediate\'s meshes\' depths');
pivot('seconds arbor\'s pivot in WN-300 (Ø 0.75; the other in its jewel)',Fs,0.375,1.1,day.seconds,H.brass,Math.min(R[2],R[3]),'the seconds\' meshes\' depths');
pivot('escape arbor\'s pivot in its jewel (Ø 0.24, 0.5)',Fe,0.12,0.5,day.escape,H.steel,Math.min(R[3],lockRoom),'the depth of lock, the hole worn toward the balance: the worst way');
/* the balance staff upright in its gimbals: its weight on the lower endstone, the pivot's flat end (Ø 0.21, 05 03_3.2's, as the model builds it) turning over it at the swing's
   mean speed (4 A / T) at two thirds of its radius; the endshake set in the middle of the 1958 MX repair book's 0.04-0.06, its room 0.01 to the top. That band is a repairer's
   setting, which each overhaul restores (every three years: the 1954 instruction), not a limit the escapement has: reported (~~) against it, never failed */
{const mB=(WJ.balance.m+WJ.rollers.m+WJ.collet.m+WJ.spring.m/2)*1e-3,F=mB*9.80665,r=0.105,w=4*E.A/E.T,s=w*(2/3*r*1e-3)*YR;
  C('balance staff\'s pivot end on its endstone (Ø 0.21)',F,s,H.steel,Math.PI*r*r,0.01,'the endshake, set in the middle of 0.04-0.06 (the 1958 MX repair book)','the balance\'s weight (wempe_inertia.json), the swing\'s mean speed',false,null,'a repairer\'s band, restored at each overhaul');}
/* the escape teeth's tips (gilt brass, 05 04 05-1: the page's M.gilt): each of the 15 meets the stone once a turn of the wheel (7.5 s), sliding off it by the depth of lock and along
   the impulse stone about half a millimetre (estimated); the force the escape wheel's torque fully wound at its tip (WPHYS.escT); dry, on the tip's wedge (1.4 thick, escapement.js) */
{const Fw=P.escT(0)*1e-6/(E.ES*1e-3),s=YR/(15*E.T)*(LK.d+0.5)*1e-3;
  C('an escape tooth\'s tip on the stones (dry)',Fw,s,H.brass,1.4*0.02,lockRoom,`the depth of lock: the window's middle less its shallow end, ${f(LK.shallow,4)}-${f(LK.deep,4)} (tolerances_wempe${SUF}.json)`,'the escape wheel\'s torque fully wound at its tip (WPHYS.escT)',true,{b:1.4,w:0.02,c:0.5},`soft by the owner's choice (28 October 2026): with the gold spring's bending point at 05 04_1's drawn mark (6.15, the second drawing check's 2-M3, sure) the lock's window narrows and the dry tip lasts about 2.8 years against the 1954 instruction's three; the escapement oiled lasts far longer`);}
/* the gold spring (05 04 01-2, 333 gold): the discharge stone presses its face twice a period, unlocking (the detent's spring and preload, 0.8 g at the stone, and the tooth's draw
   on it: about 10 mN, estimated) and passing back (bending it aside: about 2 mN, estimated), sliding across it each time about the discharge circle's r 1.55 over 10° (0.27 mm) */
{const s=YR/E.T*0.27e-3,Fa=10e-3,Fp=2e-3;
  C('the gold spring\'s face under the discharge stone (dry)',Fa+Fp,s,H.gold,1.0*0.05,liftRoom,`the discharge's lift past the tooth's release (18 % of makeEsc's ${f(m.lRel,3)} at the stone)`,'the unlocking and passing loads (estimated)',true);}
/* the chain's rivets (05 07 04: Ø 0.55, plates 0.26, pitch 2.05): each link articulates four times a day (onto and off the fusee and the barrel, running and winding) through the
   pitch over the drums' mean radius; worn in both its holes, the chain grows; 1 % of its pitch, estimated, before it rides the fusee's groove wrong */
{const a=2.05/((rfm+RB)/2),s=4*365.25*0.275e-3*a;C('a chain link\'s rivet in its plates',pull,s,H.steel,2*0.26*0.55,0.0205/2,'the chain\'s pitch, 1 % of it (estimated)','the mainspring\'s pull fully wound (wempe_strength.js)');}
/* the fusee wheel's brass teeth (05 06 00-3) on the centre pinion's steel leaves: each tooth meshes once a fusee turn, sliding about 0.5 mm (estimated) a mesh */
{const Ft=P.fusT(0)/(0.4356*90/2e3),s=fud*365.25*0.5e-3;C('the fusee wheel\'s brass teeth',Ft,s,H.brass,2.62*0.6,0.02,'the teeth\'s thickness, 20 µm (estimated)','the fusee\'s torque fully wound at the pitch circle (WPHYS.fusT)');}
/* the clicks (05 06 02-3, steel) riding the click wheel's brass backs (05 06 04-3, 35 teeth, 0.795 deep) while winding, two of them, each tooth under each once a fusee turn wound
   back, at their springs' force riding a tip (wempe_ratchets.js: 586-1667 mN/mm at the click's back, 3 from its pivot; over a tooth 0.44 N at most); a quarter of the face
   left is the catch wempe_transmission.js asks for, so three quarters of the tooth's depth is the room. The maintaining detent (its wire 64 mN/mm) rides the maintaining
   ratchet's brass backs (120 teeth, 0.725 deep) running, about 10 mN (estimated) */
C('the click wheel\'s teeth under the two clicks',0.44,2*fud*365.25*Math.PI*14.5/35*1e-3,H.brass,1.30*0.1,0.75*0.795,'the face the clicks catch, three quarters of its 0.795','the clicks\' springs riding a tip (wempe_ratchets.js)');
C('the maintaining ratchet\'s teeth under its detent',0.010,fud*365.25*Math.PI*37.25/120*1e-3,H.brass,1.02*0.1,0.75*0.725,'the face the detent catches, three quarters of its 0.725','the detent\'s wire riding a tip (estimated)');
say(`${BREV?`the ${BREV} build`:'as last revised'}: the lock's window ${f(LK.shallow,4)}-${f(LK.deep,4)} mm (tolerances_wempe${SUF}.json), the banking at its middle: ${f(lockRoom*1000,1)} µm of room`);
say('');say('wear the first year (oiled: well, poorly, dry; the escapement, dry: 1.5e-6, 5e-6, 1.5e-5), against the tolerance each eats, and the years to it:');
const fy=y=>y>1000?'>1000':y>=10?f(y):f(y,1),KN=o=>o.dry?'dry escapement':'oiled';
const SVC=3,LIFE=10;   /* the 1954 instruction's cleaning and fresh oil every three years (6MX-figures.md, п. 19); the TU's mean service life, at least ten years (TU 1.2.9) */
for(const o of out.contacts.sort((a,b)=>a.yrs.good-b.yrs.good)){const bad=o.yrs.good<SVC;o.v=bad&&!o.soft?'!!':bad||o.yrs.good<LIFE||o.yrs.poor<SVC?'~~':'ok';rows.push(`  ${o.v.padEnd(3)} ${o.name.padEnd(62)} ${o.F<1?f(o.F*1000,1)+' mN':f(o.F,1)+' N'} ${(f(o.s)+' m/y').padStart(10)}   ${['good','poor','dry'].map(k=>f(o.h[k]*1000,o.h[k]*1000<0.01?4:3)).join(' / ')} µm   of ${f(o.tol*1000,1)} µm (${o.what}): ${['good','poor','dry'].map(k=>fy(o.yrs[k])).join(' / ')} years${o.soft&&bad?` (${o.soft})`:''}`);if(o.v==='!!')fail=1;}
const nm=o=>o.name.split(' (')[0].replace(/^(the|an|a) /,'');const worst=out.contacts[0],oil=out.contacts.filter(o=>!o.dry),wo=oil.sort((a,b)=>a.yrs.good-b.yrs.good)[0],de=out.contacts.filter(o=>o.dry).sort((a,b)=>a.yrs.good-b.yrs.good)[0];
say('');say(`the line: a contact as it runs (oiled well; the escapement dry at 1.5e-6) must keep its figure over a service interval, ${SVC} years (the 1954 instruction: cleaned and oiled every three years), or it fails; under the TU's ${LIFE} years of service life, or poorly oiled under ${SVC}, it is reported (~~)`);
say(`oiled, every contact lasts ${fy(wo.yrs.good)} years and more well oiled; the first to go, the ${nm(wo)}, ${fy(wo.yrs.poor)} poorly oiled and ${fy(wo.yrs.dry)} once the oil has gone`);
say(`the escapement, dry: the first to go, the ${nm(de)}, lasts ${fy(de.yrs.good)} years at 1.5e-6 (${fy(de.yrs.poor)} at 5e-6, ${fy(de.yrs.dry)} at 1.5e-5); an overhaul resets the banking to the window's middle, so its room is a service interval's, not the clock's life`);
out.worst={name:worst.name,yrs:worst.yrs};out.oil={name:wo.name,yrs:wo.yrs};out.esc={name:de.name,yrs:de.yrs};out.lockRoom=lockRoom;out.liftRoom=liftRoom;out.R=R;out.chain=chain;
out.rows=rows;module.exports=out;
if(require.main===module){console.log(rows.join('\n'));const jo=process.argv.indexOf('--json');if(jo>0)fs.writeFileSync(process.argv[jo+1],JSON.stringify(out));process.exitCode=fail;}
