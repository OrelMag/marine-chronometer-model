// Does it still fit when it's cold or hot? The movement is brass where it holds things in place (plates, bridges, pillars, wheels) and steel where it turns or
// locks (pinions, arbors, escape wheel, roller, detent), and the two grow at different rates. This works what the difference does between 40 and 100 °F (a ship's
// chronometer room or a cabin, wider than the Navy test's 55-90 °F, Sec. IX), the movement put together at 20 °C (68 °F). Needs only Node.js:
//   node thermal.js            (a few seconds; exits with 1 if a mesh leaves its depthing window, an endshake leaves Ops. 15/69/74's, or the escapement a figure)
// What it leaves to others: the balance and hairspring's own temperature error (physics.js A5, the test card's curve in errorbudget.js: the spring's thermoelastic
// coefficient is the spring maker's, and is measured, not worked out: the bench tests in the build book) and the oil's viscosity (in the test card's curve).
const fs=require('fs'),path=require('path'),{makeEsc}=require('../../shared/escapement.js'),{build}=require('./escapement.js'),PH=require('./physics.js');
const f=(x,n=2)=>(+x).toFixed(n),sg=(x,n=1)=>(x>=0?'+':'−')+Math.abs(x).toFixed(n),rows=[];let fail=0;
const OUT={depth:[],esc:[]},say=s=>rows.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;rows.push(`${ok?'  ok ':'  !! '} ${s}`);};
/* expansion, a °C (published ranges): leaded clock brass CuZn39Pb2-3 18.7-20.9 × 10⁻⁶; hardened carbon steel 10.8-12.5; their difference, the brass growing more,
   the least and the most the two ranges allow */
const AB=[18.7e-6,20.9e-6],AS=[10.8e-6,12.5e-6],DA=[AB[0]-AS[1],AB[1]-AS[0]];
const T0=20,TC=(40-32)/1.8,TH=(100-32)/1.8,dT=[TC-T0,TH-T0];   /* assembled at 20 °C; 4.4 and 37.8 °C */
say(`brass grows ${f(AB[0]*1e6,1)}-${f(AB[1]*1e6,1)} × 10⁻⁶ a °C, steel ${f(AS[0]*1e6,1)}-${f(AS[1]*1e6,1)}: brass ${f(DA[0]*1e6,1)}-${f(DA[1]*1e6,1)} more; from 20 °C to 40 °F (${sg(dT[0],1)} °C) and 100 °F (${sg(dT[1],1)} °C)`);

/* ---------- 1. the train's depths ---------- */
/* the holes are in brass and so is each wheel: they grow alike. The pinion is steel, growing less, so the depth changes by the pinion's pitch radius times the
   difference: cold, the brass shrinks more and the wheel's teeth go deeper into the pinion (toward the tips on its root, the close side of gearing.js's window) */
say('');say('1. The train\'s depths (each mesh\'s window: tools/gearing.json, gearing.js)');
const GJ=JSON.parse(fs.readFileSync(path.join(__dirname,'gearing.json'),'utf8')),T=PH.TRAIN,M=PH.MODS,rp=[M.fusee*T.cp/2,M.centre*T.tp/2,M.third*T.fp/2,M.fourth*T.ep/2];
let tpT=Infinity;
GJ.stages.forEach((w,i)=>{const cold=-rp[i]*DA[1]*dT[0],hot=rp[i]*DA[1]*dT[1],tp=(-w.lo-GJ.SH-cold)/2;tpT=Math.min(tpT,tp);OUT.depth.push({stage:w.stage,r:rp[i],cold,hot,lo:w.lo,hi:w.hi,tp,tp0:w.tp});   /* cold: how much deeper; hot: how much shallower */
  chk(cold<0.1*-w.lo&&hot<0.1*w.hi,`${w.stage}: the pinion r ${f(rp[i],2)}: ${f(cold*1000,2)} µm deeper at 40 °F, ${f(hot*1000,2)} µm shallower at 100 °F, against the ${f(-w.lo*1000,0)} µm closer and ${f(w.hi*1000,0)} wider its window allows; the holes ±${f(tp*1000,1)} µm with it (±${f(w.tp*1000,1)} without)`);});
say(`the train's depths hardly notice the temperature (the wheels and their holes are both brass): the holes' tolerance stays ±${f(tpT*1000,0)} µm`);

/* ---------- 2. endshake ---------- */
/* an arbor (steel) between two bearings held apart by brass (pillars, plate, bridge): its endshake grows as the brass between them grows more than the steel. The
   longest span is the train's, the pillar plate to the train bridge, 16.8 mm (measured on a side photograph: CLAUDE.md, video.py); Ops. 15, 69 and 74 ask 0.001-0.003 in */
say('');say('2. Endshake (Ops. 15, 69, 74: 0.001-0.003 in, 25-76 µm)');
const SPAN=16.8,ES=[0.001*25.4,0.003*25.4],dC=SPAN*DA[1]*dT[0],dH=SPAN*DA[1]*dT[1];Object.assign(OUT,{AB,AS,DA,dT,SPAN,ES,dC,dH});
chk(ES[1]-ES[0]>dH-dC,`over ${SPAN} mm the endshake changes ${sg(dC*1000,1)} µm at 40 °F and ${sg(dH*1000,1)} at 100 °F: set at 20 °C between ${f(ES[0]*1000-dC*1000,0)} and ${f(ES[1]*1000-dH*1000,0)} µm and it stays in the manual's at both`);
say('the balance staff, the escape and the fourth arbors run between shorter spans, so they change less');

/* ---------- 3. the escapement ---------- */
/* the escapement's frame is the escape wheel's radius (steel). In it, what the brass holds grows by DA dT: the balance's centre from the wheel's (EX), and the detent's
   foot, which carries the locking stone (steel, its length unchanged in the frame) out from or in toward the wheel: the depth of lock changes by the foot's radial
   distance from the wheel's centre at the locking tooth times DA dT (cold the foot comes in, the lock deepens). The trip spring rides on the detent and the roller on the
   staff, both steel; the balance's place against the detent's is brass too, which EX carries for the roller's side. A first-order picture: the jewels' angles are unchanged */
say('');say('3. The escapement (makeEsc with the brass-held distances grown against the steel parts)');
const ESC=build().ESC,base=ESC.settings,P=2*Math.PI/16,lockA=P/2-2*P,u=[Math.cos(lockA),Math.sin(lockA)],dirB=[Math.cos(68*Math.PI/180),Math.sin(68*Math.PI/180)],BL=1.72;
const footR=1-BL*(dirB[0]*u[0]+dirB[1]*u[1]);   /* the detent's foot, its distance from the wheel's centre along the locking tooth's radius (escape wheel radii) */
const at=g=>{const o={...base,EX:base.EX*(1+g),dL:base.dL-footR*g};return makeEsc(o);},m0=ESC.measure(),ck=E=>E.checks().filter(c=>!c.ok).map(c=>c.k);
for(const[nm,dt]of[['40 °F',dT[0]],['100 °F',dT[1]]]){const g=DA[1]*dt,E=at(g),m=E.measure(),bad=ck(E);OUT.esc.push({at:nm,dEX:g*base.EX*-6.58,dL:-footR*g*6.58,lock:m.lock,letoff:m.letoff,overall:m.overall,drop:m.drop,A:m.A,rate:m.rate});
  chk(m.runs&&!bad.length,`${nm}: centre distance ${sg(g*base.EX*-6.58*1000,2)} µm, depth of lock ${sg(-footR*g*6.58*1000,2)} µm: lock ${f(m.lock,2)}° (${f(m0.lock,2)}), let-off ${f(m.letoff,2)}° (${f(m0.letoff,2)}), overall ${f(m.overall,2)}° (${f(m0.overall,2)}), drop ${f(m.drop,2)}° (${f(m0.drop,2)}); swing ${f(m.A,1)}°, the escapement's rate ${sg(m.rate,3)} s a day${bad.length?'; out of the manual\'s: '+bad.join(', '):''}`);}
say('the escapement\'s own share of the temperature error is a few hundredths of a second a day: the balance and its spring are the whole of it');

/* ---------- 4. the fusee chain ---------- */
/* the chain (steel) against the fusee's groove and the barrel (brass): a chain as long as the fusee's turns (17½ half turns about a mean radius near 11 mm: invariants.py's 56¼ h) */
const LCH=17.5/2*2*Math.PI*11,dl=LCH*DA[1]*dT[1];Object.assign(OUT,{m0:{lock:m0.lock,letoff:m0.letoff,overall:m0.overall,drop:m0.drop},LCH,dl});
say('');say(`4. The fusee chain: about ${f(LCH,0)} mm long; the brass round it grows ${f(dl,3)} mm more at 100 °F, ${f(100*dl/1.7,1)} % of a link's pitch (1.7 mm): nothing to take up`);

OUT.rows=rows;OUT.fail=fail;module.exports=OUT;
if(require.main===module){console.log(rows.join('\n'));process.exit(fail);}
