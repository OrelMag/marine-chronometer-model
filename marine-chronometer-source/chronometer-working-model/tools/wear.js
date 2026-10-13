// How long the parts keep their figures: every sliding contact's wear by Archard's law (the volume worn V = k F s / H: k the wear coefficient, F the load, s the
// distance slid, H the softer part's hardness; Archard 1953), its depth a year over the area that takes it, and the years until that depth eats the tolerance the
// model's own checks give it: a pivot hole worn open moves its arbor toward the load and changes its meshes' depth (gearing.json: each mesh's close side, less
// the CNC's hole tolerance and the pivots' shake), the balance staff's pivot ends wear its endshake (Ops. 15, 69, 74), the escape teeth's tips wear the depth of
// lock (tripping.json: its 5° floor). k from Rabinowicz's table for lubricated metals (Friction and Wear of Materials, 2nd ed. 1995): about 1e-7 well oiled, 1e-6
// poorly, 1e-5 once the oil has gone; the hardnesses published ranges' soft ends (leaded brass 100 HV, hardened steel 600 HV, ruby 2000 HV). The loads are
// strength.js's (fully wound, every stage lossless: the largest), the turns the train's own. Wear is the order of magnitude, not the figure: what lasts decades
// well oiled and what the oil's life decides. Needs only Node.js:   node wear.js [--json OUT]   (a few seconds; exits 1 if a contact well oiled reaches its
// tolerance within five years)
const fs=require('fs'),path=require('path'),PH=require('./physics.js'),{build}=require('./escapement.js'),MJ=require('./mechanisms.json');
const ESC=build().ESC,cp=require('child_process'),GJ=require('./gearing.json'),TJ=require('./tripping.json');
const f=(x,n=0)=>(+x).toFixed(n),HV=v=>v*9.807e6,YR=365.25*86400,rows=[],out={contacts:[]};let fail=0;const say=s=>rows.push('  '+s);
const K={good:1e-7,poor:1e-6,dry:1e-5},H={brass:HV(100),steel:HV(600),ruby:HV(2000)};
/* the pivots' loads, as strength.js gives them (its output read: one place for them) */
const SO=cp.execFileSync('node',[path.join(__dirname,'strength.js')],{encoding:'utf8'}),pv=re=>{const m=re.exec(SO);if(!m)throw Error('strength.js: '+re);return +m[1];};
const Ff=pv(/fusee arbor's pivot \(r [\d.]+, [\d.]+ long in its bushing\)\s+([\d.]+) N/),Fc=pv(/centre arbor's thinner pivot \(r [\d.]+\)\s+([\d.]+) N/),Ft=pv(/third arbor's thinner pivot \(r [\d.]+\)\s+([\d.]+) N/),
  F4=pv(/fourth arbor's thinner pivot \(r [\d.]+\)\s+([\d.]+) N/),Fe=pv(/escape arbor's thinner pivot \(r [\d.]+\)\s+([\d.]+) N/),Sk=pv(/escape wheel tooth, struck[^\n]*?([\d.]+) N peak/);
const T=PH.TRAIN,day={fusee:24*T.cp/T.fu,centre:24,third:24*T.cw/T.tp,fourth:24*T.cw/T.tp*T.tw/T.fp,escape:24*T.cw/T.tp*T.tw/T.fp*T.fw/T.ep};   /* turns a day */
/* each mesh's room: its close side less the hole tolerance and the shake (gearing.json) */
const room=i=>{const s=GJ.stages[i];return -s.lo-s.tp-GJ.SH;},R=[0,1,2,3].map(room);
/* the lock's room: tripping.json's rows give the lock against the depth of lock (dL, mm); a tooth's tip worn by h takes h off the depth, so its room is the model's
   dL less the dL where the lock reaches the floor (5°); the escape arbor's pivot worn toward the balance closes the centre distance, which takes 1.40 µm off the
   depth for 1.48 µm (thermal.js) */
const LR=TJ.lock.rows.slice().sort((a,b)=>a.dL-b.dL),dL0=ESC.settings.dL,dLat=lk=>{for(let i=1;i<LR.length;i++)if(LR[i].lock>=lk){const a=LR[i-1],b=LR[i];return a.dL+(b.dL-a.dL)*(lk-a.lock)/(b.lock-a.lock);}return LR[LR.length-1].dL;};
const lockRoom=dL0-dLat(TJ.lock.min),pivRoom=lockRoom*1.48/1.40;
const C=(name,F,s,Hs,A,tol,what,src)=>{const o={name,F,s,A,tol,what,src,h:{},yrs:{}};for(const k in K){o.h[k]=K[k]*F*s/Hs/(A*1e-6)*1e3;o.yrs[k]=tol/o.h[k];}out.contacts.push(o);return o;};   /* h mm a year (V m³ over A mm²) */
const pivot=(name,F,r,L,turns,Hs,tol,what)=>C(name,F,2*Math.PI*r*1e-3*turns*365.25,Hs,2*r*L,tol,what,'strength.js\'s load, the pivot projected');
pivot('fusee arbor\'s pivot in its brass bushing (r 1.02)',Ff,1.02,3.4,day.fusee,H.brass,R[0],'the fusee wheel\'s depth on the centre pinion');
pivot('centre arbor\'s pivot in brass (r 0.5)',Fc,0.5,1.0,day.centre,H.brass,Math.min(R[0],R[1]),'the centre\'s meshes\' depths');
pivot('third arbor\'s pivot in its jewel (r 0.3)',Ft,0.3,0.6,day.third,H.steel,Math.min(R[1],R[2]),'the third\'s meshes\' depths');
pivot('fourth arbor\'s pivot in its jewel (r 0.25)',F4,0.25,0.5,day.fourth,H.steel,Math.min(R[2],R[3]),'the fourth\'s meshes\' depths');
pivot('escape arbor\'s pivot in its jewel (r 0.089)',Fe,0.089,0.4,day.escape,H.steel,Math.min(R[3],lockRoom),'the fourth wheel\'s depth on its pinion and the depth of lock');
/* the balance staff upright in its gimbals: its weight on the lower endstone, the pivot's flat end turning over it at the swing's mean speed (4 A / T) at two thirds
   of its radius (a disc under even pressure), the endshake set mid-band (Ops. 15, 69, 74: 0.001-0.003 in) */
{const mB=MJ.arbors.balance.m*1e-3,F=mB*9.80665,r=0.18,w=4*ESC.A/ESC.T,s=w*(2/3*r*1e-3)*YR;
  C('balance staff\'s pivot end on its endstone (r 0.18)',F,s,H.steel,Math.PI*r*r,(76.2-50.8)/1000,'the endshake, set mid-band (25-76 µm)','the balance\'s weight (mechanisms.json), the swing\'s mean speed');}
/* the escape teeth's tips: each unlocks the locking stone once in 16 oscillations, sliding off it by the depth of lock, and drives the impulse jewel, sliding along
   its face about half a millimetre (estimated); the force the escape wheel's torque at the tooth; worn over the tip's land (0.02 mm, estimated) */
{const Fw=62.6e-6/(ESC.ES*1e-3),per=2*YR/16,s=per*(0.11+0.5)*1e-3;
  C('an escape tooth\'s tip on the stone and the jewel',Fw,s,H.steel,1.3*0.02,lockRoom,'the depth of lock, to its 5° floor (tripping.json)','the escape wheel\'s torque at its tip (dynamics.js: 62.6 µN·m)');}
/* the chain's rivets: each link articulates four times a day (onto and off the fusee and the barrel, winding and running) through the pitch over the drum's radius,
   loaded by the mainspring's pull; worn in both its holes, the chain grows; 1 % of its pitch, estimated, before it rides the fusee's groove wrong */
{const pull=PH.Mup*1000/PH.rB,a=1.7/8,s=4*365.25*0.17e-3*a;C('a chain link\'s rivet in its plates',pull,s,H.steel,2*0.17*0.54,0.017/2,'the chain\'s pitch, 1 % of it (estimated)','the mainspring\'s pull fully wound');}
/* the fusee wheel's brass teeth on the centre pinion's steel leaves: each tooth meshes 3.7 times a day, sliding about 0.5 mm (estimated) a mesh */
{const r=PH.MODS.fusee*T.fu/2,Ft2=PH.Tf*1000/r,s=day.fusee*365.25*0.5e-3;C('the fusee wheel\'s brass teeth',Ft2,s,H.brass,1.2*0.6,0.02,'the teeth\'s thickness, 20 µm (estimated)','the fusee\'s even torque at the pitch circle');}
/* the strike: the escape tooth meeting the impulse jewel at speed (strength.js's peak, the tooth alone springing: an upper bound) */
{const E=1/((1-0.29**2)/207e3+(1-0.24**2)/400e3),R0=0.02,b=1.3,p=Math.sqrt(Sk/b*E/(Math.PI*R0)),Ry=Sk*E/(Math.PI*b*(1.67*1200)**2),a=Sk/(2*b*HV(600)/1e6),dH=a*a/(2*Ry);
  say(`the escape tooth struck on the impulse jewel (${f(Sk,1)} N at most, strength.js): a tip of r ${R0} (estimated) would be pressed ${f(p)} MPa (Hertz), past hardened steel's 2004; it runs in, burnished to about r ${f(Ry,2)} within its first strikes, a flat ${f(a*2*1000,1)} µm wide, ${f(dH*1e6,0)} nm deep, nothing a figure notices`);
  out.strike={Sk,p,Ry,a,dH};}
say('');say('wear, a year (well oiled, poorly, dry), against the tolerance each eats, and the years to it:');
const fy=y=>y>1000?'>1000':y>=100?f(y):y>=10?f(y):f(y,1);
for(const o of out.contacts.sort((a,b)=>a.yrs.good-b.yrs.good)){rows.push(`  ${o.yrs.good<5?'!! ':o.yrs.poor<5?'~~ ':'ok '} ${o.name.padEnd(52)} ${o.F<1?f(o.F*1000,1)+' mN':f(o.F,1)+' N'} ${(f(o.s)+' m/y').padStart(10)}   ${['good','poor','dry'].map(k=>f(o.h[k]*1000,o.h[k]*1000<0.01?4:3)).join(' / ')} µm   of ${f(o.tol*1000)} µm (${o.what}): ${['good','poor','dry'].map(k=>fy(o.yrs[k])).join(' / ')} years`);if(o.yrs.good<5)fail=1;}
const worst=out.contacts[0];
say('');say(`the oil's life decides it: well oiled every contact lasts ${fy(worst.yrs.good)} years and more; the first to go, the ${worst.name.split(' (')[0]}, lasts ${fy(worst.yrs.poor)} poorly oiled and ${fy(worst.yrs.dry)} once the oil has gone, so a cleaning and oiling while the oil is good keeps every figure`);
out.worst={name:worst.name,yrs:worst.yrs};
out.rows=rows;module.exports=out;
if(require.main===module){console.log(rows.join('\n'));const jo=process.argv.indexOf('--json');if(jo>0)fs.writeFileSync(process.argv[jo+1],JSON.stringify(out));process.exitCode=fail;}
