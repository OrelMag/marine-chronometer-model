// The tests on the bench: what to measure on the real parts and on the finished movement, and what each must read, the figures taken from the model's own
// checks (physics.js, escapement.js, tolerances.js, gearing.json, thermal.js) and the manual's (NAVSHIPS 250-624: Ops. 15-97, Sec. IX). The analysis says the
// design works; only these say a chronometer made to it does. Needs only Node.js:
//   node bench.js            prints the tests; exit 1 if tools/bench.json (the build book's chapter and the cards' lines, through makers.py) is not what it finds
//   node bench.js --write    writes tools/bench.json (then run makers.py)
// About a second.
const fs=require('fs'),path=require('path'),PH=require('./physics.js'),{build}=require('./escapement.js');
const ESC=build().ESC,m=ESC.measure(),D=Math.PI/180,f=(x,n=2)=>(+x).toFixed(n);
const GJ=JSON.parse(fs.readFileSync(path.join(__dirname,'gearing.json'),'utf8')),TOL=JSON.parse(fs.readFileSync(path.join(__dirname,'tolerances.json'),'utf8'));
/* the swing's band as the drive: the escape wheel's torque, against the model's, that swings the balance 247.5° and 270° (the manual's 1⅜-1½ turns) */
const sAt=A=>{let lo=0.5,hi=2;for(let i=0;i<50;i++){const md=(lo+hi)/2;ESC.ampAt(md)/D<A?lo=md:hi=md;}return(lo+hi)/2;},s0=sAt(247.5),s1=sAt(270);
const band=/about ([\d.]+)-([\d.]+) N·m fully wound/.exec(TOL['42038']);if(!band)throw Error('tolerances.json: the mainspring\'s torque band not found');
/* the centre distances as the arbors' places give them (tools/solve.py: L in movement.js) */
const SV=require('child_process').execFileSync(process.env.PYTHON||'python',[path.join(__dirname,'solve.py')],{encoding:'utf8'}),cd=['Fu-C','C-T','T-F','F-E'].map(k=>{const q=new RegExp(k+'\\s+([\\d.]+) mm').exec(SV);if(!q)throw Error('solve.py: '+k+' not found');return+q[1];});
const m1=PH.Mup*(1-PH.Mdn/PH.Mup)/PH.IN;   /* the spring's stiffness, N·m a turn (physics.js: Mup - IN m1 = Mdn) */
/* endshake at 20 °C that stays in Ops. 15/69/74's 0.001-0.003 in from 40 to 100 °F (thermal.js: the train's 16.8 mm span, brass 10.1 × 10⁻⁶ a °C more than steel) */
const dC=16.8*10.1e-6*((40-32)/1.8-20),dH=16.8*10.1e-6*((100-32)/1.8-20),es=[25.4-dC*1000,76.2-dH*1000];
const I=578.5,k=I*1e-9*(4*Math.PI)**2;
const tests=[
 {id:'mainspring',title:'The mainspring\'s torque',no:'42038',when:'before it goes into the barrel, and again in the barrel',
  how:`Hold the barrel and turn its arbor with a lever and weights or a torque gauge: a 3D-printed lever 50 mm long and a hanging weight do (1 kg at 50 mm is 0.49 N·m). Wind it up from let down by its set-up and read the torque each half turn over the ${f(PH.IN,2)} turns the fusee uses, then unwind and read again (the spring's friction is the difference). Leave it wound a week and read again.`,
  pass:`Fully wound ${band[1]}-${band[2]} N·m (the model's ${f(PH.Mup,2)}; the band keeps the balance in the manual's 1⅜-1½ turns: tools/tolerances.js); falling about ${f(m1*1000,0)} mN·m a turn, to about ${f(PH.Mdn,2)} N·m when the fusee's chain is all on the barrel. After the week, still inside the band (a spring that sets more is replaced, or set up a tooth: Op. 13).`},
 {id:'fusee',title:'The fusee evens the pull',no:'42015',when:'the chain on, the barrel set up, before the train goes in',
  how:`With the fusee wheel's arbor on a torque gauge (or the same lever on its square), read the torque each half turn of the fusee, from fully wound (the chain on the fusee's top turn) to run down, ${17.5} half turns.`,
  pass:`Every reading within ${f(100*(s0-1),0)} to +${f(100*(s1-1),0)} % of their mean (the model's even ${f(PH.Tf*1000,0)} mN·m): the escape wheel's torque in that band swings the balance 247.5-270° (the escapement's ampAt). A reading outside it at one end means the fusee's profile and the spring's stiffness don't match: the set-up moves the whole curve, not its slope.`},
 {id:'depths',title:'The train\'s depths',no:'42068',when:'the plates and bridges bored, before the jewels and bushes go in',
  how:'Measure each pair of holes\' centres with gauge pins in them and a micrometer (or on a measuring machine), on the plate and on the bridge. Then the arbors in, each mesh tried in turn, the escape wheel held: feel the shake at the pinion and watch the teeth through a loupe as the wheel is turned slowly.',
  pass:`Centres ${cd.map(x=>f(x,3)).join(', ')} mm (fusee-centre, centre-third, third-fourth, fourth-escape), each within ±${f(Math.min(...GJ.stages.map(w=>w.tp))*1000,0)} µm (tools/gearing.js: the wheel's tips stay off the pinion's root with the pivots' shake taken off). Every mesh turns smoothly with shake at its pinion; none butts or catches. A hole that errs should err wide: each mesh takes several times as much wide as close.`},
 {id:'endshake',title:'Endshake',no:'42071',when:'each arbor in its bearings, before the escapement goes in',
  how:'Lift each arbor by its wheel with tweezers and watch the shoulder against a dial indicator, or feel it.',
  pass:`${f(es[0],0)}-${f(es[1],0)} µm at 20 °C (Ops. 15, 69 and 74's 0.001-0.003 in, less what the brass takes from it at 40 °F and gives at 100 °F: tools/thermal.js).`},
 {id:'balance',title:'The balance and its hairspring vibrated',no:'42188',when:'the hairspring pinned to its collet and stud, the balance on its staff',
  how:`Vibrate the balance with its spring in a vibrating tool (or the cock on a holder) against a master or a phone's timer: count the oscillations over two minutes, or record the beat (python acoustic.py FILE reads a recording).`,
  pass:`2 oscillations a second (7,200 an hour): Table II's balance (${I} g·mm²) wants a spring of ${f(k*1e6,1)} µN·m a radian. Within 40 s a day of it (one turn of the timing weights, Sec. IX) before the spring goes in; the weights take up the rest.`},
 {id:'escapement',title:'The escapement\'s figures',no:'42087',when:'the detent, its springs and the balance in; the train\'s power let down to the set-up',
  how:'Turn the balance slowly by hand with a protractor on the cock (a printed card under the balance does) and read each angle where the manual\'s operations read it, through a loupe; the roller\'s shake and the horn\'s clearance with feeler gauges.',
  pass:`The manual's figures: lock about 6° (the model ${f(m.lock,1)}°, Op. 85), let-off at least 6° (${f(m.letoff,1)}°, Op. 86), overall 26-30° (${f(m.overall,1)}°, Op. 87), drop about 2° (${f(m.drop,1)}°, Op. 97), the horn's clearance to the unlocking jewel about 0.010 in (${f(m.hornClr,2)} mm, Op. 88), roller shake about 0.002 in (${f(m.shake,3)} mm, Op. 84). Set them with the lock-adjusting and detent-adjusting screws and the trip spring's tip (Ops. 84-97); the detent spring's preload by Op. 78's weight, 0.770 g on the locking jewel.`},
 {id:'swing',title:'The swing',no:'42178',when:'the movement running, fully wound and again run down',
  how:'Read the balance\'s swing by eye against marks on the cock, from a phone\'s slow-motion video (the screws\' sweep), or from a recording of the beat (python acoustic.py FILE fits the escapement\'s clicks to the model in time).',
  pass:'1⅜-1½ turns, 247.5-270° each way, fully wound and run down alike (Sec. II, Sec. IX). Low at both ends: the train\'s freedom or the depths; low at one end only: the fusee and the spring (the fusee test); high: the mainspring is too strong for its band.'},
 {id:'rate',title:'The rate, and the Navy\'s test',no:null,when:'the movement in its box, cased and in its gimbals',
  how:'Each day at the same hour compare it with a time signal (radio, GPS, or a network time service read on a phone) to the tenth of a second, and keep the log: python rating.py LOG.csv works the daily rates, the Navy test\'s figures and what it would carry at sea. For temperature, keep it a week each at about 55, 72½ and 90 °F (a wine cooler, a room, a box with a lamp and a thermostat), as the Navy test does.',
  pass:'Good enough to navigate by: its daily rate steady, whatever it is, the navigator carrying it. The Navy\'s test (Sec. IX, the working model\'s thirty-day test card) is the yardstick: regulation, the largest mean daily rate of any period, within 1.55 s a day; rating, the mean deviation of the daily rates, 0.50; the largest difference between two daily rates in a period 0.75; the mean rates at 90 and 72½, 72½ and 55, and 90 and 55 °F within 0.75, 0.75 and 1.20; recovery 0.70; isochronism, the 12-hour rate against half the 24-hour, 0.50. Then rating.py\'s voyage: what it would carry after 30 days, 4 s of time a mile of longitude on the equator.'}];
const lines={};for(const t of tests)if(t.no)lines[t.no]=`${t.title}, ${t.when}: ${t.pass}`;
/* the same figures as numbers, for benchcheck.py, which judges a maker's measurements against them. Where the manual says "about", the band either side is
   estimated: lock and overall a degree, drop half a degree, the horn's clearance 0.05 mm, the roller's shake 0.015 mm */
const DV=JSON.parse(fs.readFileSync(path.join(__dirname,'deviations.json'),'utf8')).devs,msd=DV.find(d=>d.id==='mainspring'),tbS=/\(([\d.]+)-([\d.]+) mm thick at the drawn/.exec(TOL['42038']).slice(1).map(Number);
const r4=x=>+(+x).toFixed(4),criteria={
  mainspring:{full:[+band[1],+band[2]],model:r4(PH.Mup),down:r4(PH.Mdn),perTurn:r4(m1),turns:PH.IN,width:r4(PH.b*1000),length:PH.MS.len,thickness:{steel:tbS,nivaflex:msd.numbers.tb.map(r4)},E:{steel:207,nivaflex:220}},
  fusee:{band:[r4(s0-1),r4(s1-1)],halfTurns:17.5,torque:r4(PH.Tf)},
  depths:{names:['fusee-centre','centre-third','third-fourth','fourth-escape'],centres:cd,tol:r4(Math.min(...GJ.stages.map(w=>w.tp))),windows:GJ.stages.map(w=>[r4(w.lo),r4(w.hi)]),shake:GJ.SH},
  endshake:[r4(es[0]/1000),r4(es[1]/1000)],
  balance:{hz:2,I,k:r4(k*1e6),weightsTurn:40},
  escapement:{lock:[5,7],letoff:[6,null],overall:[26,30],drop:[1.5,2.5],horn:[0.2,0.3],shake:[0.036,0.066],model:{lock:r4(m.lock),letoff:r4(m.letoff),overall:r4(m.overall),drop:r4(m.drop),horn:r4(m.hornClr),shake:r4(m.shake)}},
  swing:[247.5,270]};
const J={note:'tools/bench.js: the tests on the bench (the build book\'s chapter), the line each tests (its card) and their figures as numbers (benchcheck.py); read by makers.py',tests,lines,criteria};
const OUT=path.join(__dirname,'bench.json'),txt=JSON.stringify(J,null,1)+'\n';
if(process.argv.includes('--write')){fs.writeFileSync(OUT,txt);console.log('wrote tools/bench.json:',tests.length,'tests');}
else{for(const t of tests)console.log(`  ${t.title} (${t.when})\n    how: ${t.how}\n    pass: ${t.pass}\n`);
  const ok=fs.existsSync(OUT)&&fs.readFileSync(OUT,'utf8')===txt;console.log(ok?'  ok  tools/bench.json is up to date':'  !!  tools/bench.json is not what this finds: run node bench.js --write, then python makers.py');process.exit(ok?0:1);}
