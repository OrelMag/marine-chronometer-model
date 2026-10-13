// The motion work and the hands: the meshes the going train's analysis leaves out, the cannon pinion's friction, and how far the hands can be off.
//   1. the motion work's two meshes (the cannon pinion 14 drives the minute wheel 56, its pinion 18 the hour wheel 54) and the wind indicator's (the fusee arbor's
//      pinion 12 drives its wheel 120), tooth by tooth on the model's own outlines as gearing.js works the going train's (stage(): the driven wheel lagging until
//      the teeth touch): that they run free, their backlash and the torque they pass;
//   2. how far the hands can stand off the time: the seconds hand rides the loaded fourth arbor and the minute hand the cannon pinion, both without play; the hour
//      hand and the wind indicator's hand turn through unloaded meshes and can sit anywhere in their backlash;
//   3. the cannon pinion's friction on the centre arbor (Op. 58: friction tight, it slips when the hands are set): enough that a knock doesn't turn the hands (their
//      out-of-balance, off the built model: mechanisms.json), and little enough that setting the hands forward, which adds the slipping torque to the train's
//      drive, doesn't swing the balance past a full turn (the escapement then trips: ESC.TRIP) while the key turns; set backward (the manual forbids it) the same
//      torque takes the drive off the escapement. The window is the maker's to set, with a weight hung on the minute hand.
// Needs only Node.js:   node motionwork.js [--json OUT]   (a few seconds; exits 1 if a mesh jams, or the cannon pinion's window closes)
const fs=require('fs'),path=require('path'),PH=require('./physics.js'),G=require('./gearing.js'),{build}=require('./escapement.js'),MJ=require('./mechanisms.json');
const ESC=build().ESC,mv=fs.readFileSync(path.join(__dirname,'..','js','movement.js'),'utf8');
const num=(re,what)=>{const m=re.exec(mv);if(!m)throw Error('not found in movement.js: '+what);return m.slice(1).map(Number);};
const f=(x,n=0)=>(+x).toFixed(n),D2R=Math.PI/180,TAU=2*Math.PI,G0=9.80665,rows=[],out={};let fail=0;const say=s=>rows.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;rows.push(`${ok?'  ok ':'  !! '} ${s}`);};
const [cp,mw,mp,hw]=num(/const MW=\{cp:(\d+),mw:(\d+),mp:(\d+),hw:(\d+)\}/,'the motion work'),[ux,uz]=num(/Ud:\[(-?[\d.]+),(-?[\d.]+)\]/,'L.Ud'),L=MJ.L;
const dMW=Math.hypot(L.Mw[0]-L.C[0],L.Mw[1]-L.C[1]),dUD=Math.hypot(L.Fu[0]-ux,L.Fu[1]-uz),ma=2*dMW/(cp+mw),mb=2*dMW/(mp+hw),mu=2*dUD/(12+120);
/* 1. the meshes: each driver turned through a pitch, the driven wheel lagging until the teeth touch (gearing.js stage: its first tooth count drives) */
say('1. The meshes, tooth by tooth (gearing.js\'s method on the model\'s outlines: core.js gearOutline)');
const MS=[['cannon pinion → minute wheel',cp,mw,ma,'the minute wheel turns once in four hours'],['minute pinion → hour wheel',mp,hw,mb,'the hour wheel once in twelve'],['fusee pinion → wind indicator',12,120,mu,'the indicator\'s 56 hours over its scale']];
out.meshes=[];
const jm=G.MU.indexOf(0.1)>=0?G.MU.indexOf(0.1):1;
for(const[nm,za,zb,m,what]of MS){const s=G.stage(za,zb,m),q=G.st(s.fac[jm]);
  chk(!s.jam&&s.tip>0,`${nm} (${za}:${zb}, m ${f(m,4)}): ${s.jam?'jams':'runs'}; tip clearance ${f(s.tip*1000)} µm, backlash ${f(s.blmm*1000)} µm (${f(s.bl/D2R,2)}° of the driven wheel), ${f(100*s.approach)} % of the action before the line of centres, the torque passed ${f(q.mn,3)}-${f(q.mx,3)} of the frictionless at μ ${G.MU[jm]} (${what})`);
  out.meshes.push({nm,za,zb,m,jam:s.jam,tip:s.tip,bl:s.bl,blmm:s.blmm,approach:s.approach,al:[q.mn,q.mx]});}
/* 2. the hands' play: a mesh's backlash lets the driven wheel stand anywhere over that angle; the hour hand through both meshes, the minute wheel's play carried
   down by the minute pinion's ratio */
const [b1,b2,b3]=out.meshes.map(q=>q.bl),pH=b2+b1*(mp/hw),pU=b3,UDS=56*(PH.TRAIN.cp/PH.TRAIN.fu)*12/120*360;
say('');say('2. How far the hands can stand off');
say(`the seconds hand on the fourth arbor and the minute hand on the cannon pinion turn with loaded arbors: no play`);
say(`the hour hand: ${f(pH/D2R,2)}° of play (${f(pH/TAU*720,1)} minutes of time), as much as the two meshes' backlash allows; the wind indicator's hand ${f(pU/D2R,2)}° (${f(pU/(UDS*D2R)*56,2)} hours of its 56)`);
chk(pH/TAU*720<15,`the hour hand only names the hour (the minute hand tells the minutes): ${f(pH/TAU*720,1)} minutes of play, against the quarter of an hour that would put it near the wrong one at the hour`);
out.play={hour:pH/D2R,hourMin:pH/TAU*720,ud:pU/D2R,udH:pU/(UDS*D2R)*56};
/* 3. the cannon pinion's friction. Below: a knock across the dial (the hands' out-of-balance, mass times the centre of mass's offset, times its acceleration; the
   hour hand's through the motion work's 12:1); the escapement is upset by a steady 45 g across the plate (strength.js), so the hands should hold to that.
   Above: set forward, the slip adds to the centre arbor's drive, the fusee's even torque through 90:14; the swing follows (A² towards ampAt(1 + x)², TF) and must
   stay under a full turn plus the trip (ESC.TRIP) for the whole setting (a minute, turning the hands on twelve hours) */
say('');say('3. The cannon pinion\'s friction (Op. 58)');
const A=MJ.arbors,me=A.minuteHand.m*A.minuteHand.off+A.hourHand.m*A.hourHand.off/12,gK=45,Tlo=me*1e-6*gK*G0;   /* g·mm → kg·m; N·m */
const Tc=PH.Tf*PH.TRAIN.cp/PH.TRAIN.fu,TF=ESC.settings.TF,A0=ESC.ampAt(1),trip=ESC.TRIP;
const swingAfter=(x,t)=>{const Ae=ESC.ampAt(1+x);return Math.sqrt(Ae*Ae+(A0*A0-Ae*Ae)*Math.exp(-2*t/TF));};
const xFor=t=>{let lo=0,hi=3;for(let i=0;i<50;i++){const md=(lo+hi)/2;swingAfter(md,t)<trip?lo=md:hi=md;}return(lo+hi)/2;};
const x60=xFor(60),x10=xFor(10),Thi=x60*Tc,xBand=(()=>{let lo=0,hi=1;for(let i=0;i<50;i++){const md=(lo+hi)/2;ESC.ampAt(1+md)<270*D2R?lo=md:hi=md;}return(lo+hi)/2;})();
say(`the hands' out-of-balance: the minute hand ${f(A.minuteHand.m*1000)} mg ${f(A.minuteHand.off,1)} mm off its arbor, the hour hand ${f(A.hourHand.m*1000)} mg ${f(A.hourHand.off,1)} mm (through the motion work's 12:1): ${f(me,2)} g·mm at the cannon pinion`);
say(`a knock of ${gK} g (a steady push that already frees the escape wheel, strength.js) turns it with ${f(Tlo*1000,2)} mN·m: the friction must be more`);
say(`set forward, the slip adds to the centre arbor's ${f(Tc*1000,1)} mN·m: the swing passes the manual's 270° for good above ${f(xBand*Tc*1000,1)} mN·m (${f(100*xBand)} % more drive), and reaches the trip (${f(trip/D2R)}°) within a minute's setting above ${f(Thi*1000,1)} mN·m (within ten seconds above ${f(x10*Tc*1000,1)})`);
chk(Thi>3*Tlo,`the window: ${f(Tlo*1000,2)} to ${f(Thi*1000,1)} mN·m, ${f(Thi/Tlo)} times wide; the middle, ${f(Math.sqrt(Tlo*Thi)*1000,1)} mN·m, holds the hands through ${f(Math.sqrt(Tlo*Thi)/(me*1e-6*G0))} g and sets them with the swing up only ${f((swingAfter(Math.sqrt(Tlo*Thi)/Tc,60)-A0)/D2R,1)}° after a minute`);
const rHand=40;say(`on the bench: a weight hung at ${rHand} mm on the minute hand (the arbor level) turns the cannon pinion between ${f(Tlo*1000/rHand/G0*1000,1)} and ${f(Thi*1000/rHand/G0*1000,0)} g; set it near ${f(Math.sqrt(Tlo*Thi)*1000/rHand/G0*1000,0)} g`);
/* set backward (the manual: forward only): the slip takes the drive off the escapement; past the drive's AMIN share it stops the balance, past the whole drive it
   turns the train back against the locking stone */
let lo=0,hi=1;for(let i=0;i<50;i++){const md=(lo+hi)/2;ESC.ampAt(1-md)>ESC.AMIN?lo=md:hi=md;}const xStop=(lo+hi)/2;
say(`set backward (the manual sets the hands forward only, Sec. III): more than ${f(xStop*Tc*1000,1)} mN·m of slip stops the balance (the drive under its ${f(100*(1-xStop))} % that keeps it unlocking); more than ${f(Tc*1000,1)} turns the train back against the locking stone. A middle friction stops the chronometer only if held a while: the swing decays with the free balance's ${f(TF)} s`);
out.cannon={me,Tlo,Tc,Thi,x60,x10,xBand,mid:Math.sqrt(Tlo*Thi),xStop,rHand};
out.rows=rows;module.exports=out;
if(require.main===module){console.log(rows.join('\n'));const jo=process.argv.indexOf('--json');if(jo>0)fs.writeFileSync(process.argv[jo+1],JSON.stringify(out));process.exitCode=fail;}
