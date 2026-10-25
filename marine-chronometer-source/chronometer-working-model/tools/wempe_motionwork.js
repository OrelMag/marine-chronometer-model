// The Wempe's motion work and up-and-down work made on a CNC: motionwork.js's method for what wempe_transmission.js leaves out (Node.js, no browser).
// wempe_transmission.js already runs these meshes in time (its section 1's tables, section 4's beat) and works the hands' play and the cannon pinion's friction window (its
// section 7: CAN, the window's middle the model takes); not repeated here. What a maker needs besides:
//   1. each of the three meshes (the cannon pinion 14 drives the change wheel 56, its pinion 18 the hour wheel 54; the up-and-down pinion 12 on the fusee arbor drives its wheel
//      120), tooth by tooth on dial.js's tables as wempe_transmission.js cuts them (gearing.js's stage on wempe_train.js's outlines): that they run free at the drawn centres,
//      their tip clearance, backlash and torque ratio;
//   2. each mesh's depthing window: its centres moved until it jams (closer) or until it loses contact or its backlash puts the hand it drives a quarter of an hour of play
//      off (wider), and the hole position a CNC must hold for the change wheel's stud (hole 19) and the up-and-down wheel's (hole 2), aimed at the drawn centres as gearing.js
//      aims the train's: (the window's close side less the stud's shake) / 2;
//   3. the cannon pinion's friction as a bench test (wempe_transmission.js's window put as a weight hung on the minute hand), and the hands set backward, which the 6MX's user
//      instruction forbids ("в обратном направлении может вызвать поломку зубцов ходового колеса": can break the escape wheel's teeth; 6MX-figures.md): what the slip puts back
//      on the escape wheel against its running drive.
//   node wempe_motionwork.js [--json OUT] [--fault]   (about 1-1½ min; exits 1 if a mesh jams at its drawn centres, a window's close side is under the stud's shake, or the
//                                                     cannon pinion's window closes; --fault: the change wheel's stud 0.25 mm toward the centre, which must jam)
const fs=require('fs'),path=require('path'),{WPHYS:P,WD}=require('./wempe_load.js')(),E=P.ESC,H=WD.H,WJ=require('./wempe_inertia.json');
let G,WT;   /* gearing.js and wempe_train.js, loaded for the meshes alone (they cut the outlines, the slow part): wempe_bench.js takes the cannon pinion's window without them */
const f=(x,n=0)=>(+x).toFixed(n),D=Math.PI/180,TAU=2*Math.PI,G0=9.80665,rows=[],out={};let fail=0;const say=s=>rows.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;rows.push(`${ok?'  ok ':'  !! '} ${s}`);};
const FAULT=process.argv.includes('--fault'),dist=(a,b)=>Math.hypot(H[a][0]-H[b][0],H[a][1]-H[b][1]);
/* the gears as dial.js cuts them (wempe_transmission.js's TEO: its tables, dial.js's PIN for the pinions it gives no root) */
const TEO=([z,m,D0,dg,mate,l])=>WT.W.WTRAIN.teeth(z,m,D0??m*z+1.588*m,dg??m*z-4.26*m,mate,l);
const M_CH=20.16/56,M_HR=18.90/54,M_UD=33.454/120;   /* wempe_transmission.js's modules: the wheels' pitch circles over their teeth */
const MS=[{nm:'cannon pinion → change wheel',zA:14,zB:56,m:M_CH,dd:dist(19,1)-M_CH*70/2,hole:19,add:[[14,M_CH,5.86],[56,M_CH,21.05,19.03,14,0.555]],what:'the change wheel turns once in four hours'},
  {nm:'change pinion → hour wheel',zA:18,zB:54,m:M_HR,dd:0,hole:19,add:[[18,M_HR,6.9,5.4,54,0.55],[54,M_HR,19.7,17.89,18,0.5]],what:'the hour wheel once in twelve'},
  {nm:'up-and-down pinion → its wheel',zA:12,zB:120,m:M_UD,dd:dist(2,10)-M_UD*132/2,hole:2,add:[[12,M_UD,4.0,2.4],[120,M_UD,34.33,32.57,12,0.40]],what:'the up-and-down hand\'s 56 hours over 7/8 of a turn'}];
if(FAULT){MS[0].dd-=0.25;MS[1].dd-=0.25;}
const SHK=0.02;   /* a wheel's shake on its stud (the bores' Ø 1.52 on the studs: the stud sheets give no fit; estimated, as the train's WN bushes' 0.02-0.05) */
/* 3. the cannon pinion: wempe_transmission.js's window (its CAN: a 45 g knock's turn of the hands at the bottom, the balance driven to makeEsc's TRIP setting the hands forward fully
   wound at the top), worked again here the same way; as a weight hung on the minute hand, the hand level (cheap: wempe_bench.js takes it, out.cannon, without the meshes) */
function cannon(){
  const g45=45*G0,mh=WJ.minuteHand,hh=WJ.hourHand,lo=mh.m*1e-3*g45*Math.hypot(mh.cg[0],mh.cg[2])*1e-3+hh.m*1e-3*g45*Math.hypot(hh.cg[0],hh.cg[2])*1e-3/12;
  const Tc0=P.fusT(0)*14/90*0.95,Tc12=P.fusT(12/P.HPT)*14/90*0.95;let a=1,c=6;for(let k=0;k<18;k++){const m=(a+c)/2;E.ampAt(P.drv(0)*m)>=E.TRIP?c=m:a=m;}const sT=(a+c)/2,hi=(sT-1)*Tc0,take=Math.sqrt(lo*hi);
  say('');say('3. The cannon pinion\'s friction (wempe_transmission.js\'s window, section 7) as a bench test, and the hands set backward');
  chk(hi>3*lo,`the window ${f(lo*1000,2)}-${f(hi*1000,0)} mN·m (${f(hi/lo)} times wide), its middle ${f(take*1000,1)} mN·m: no sheet gives the fit (estimated)`);
  const rH=30;   /* the weight hung 30 mm along the minute hand (its length past its tip's 40 lies beyond the dial's track: estimated) */
  const gr=T=>T/(rH*1e-3)/G0*1000;
  say(`on the bench: a weight hung ${rH} mm along the minute hand, the hand level, turns it on the centre arbor between ${f(gr(lo),1)} and ${f(gr(hi),0)} g; set the fit near ${f(gr(take),0)} g`);
  /* set backward: the slip's torque against the centre arbor's drive; past it the train turns back onto the locking stone, the escape wheel pushed back by the excess through 480:1 */
  let Tlo=Infinity;for(let n=0;n<=P.MF;n+=0.05)Tlo=Math.min(Tlo,P.fusT(n)*14/90*0.95);   /* the centre arbor's drive at its lowest over the wind (near run down) */
  const R=90/12*80/10*80/10,back=Math.max(0,take-Tlo)/R*1e6,run=P.escT(12),backHi=Math.max(0,hi-Tlo)/R*1e6;
  say(`set backward, a fit at the middle slips at ${f(take*1000,1)} mN·m against the centre arbor's ${f(Tlo*1000,1)} at its lowest (near run down; ${f(Tc12*1000,1)} at 12 h): ${back>0?`the excess pushes the escape wheel back on its locking stone with ${f(back,1)} µN·m (${f(back/run,2)} of its running ${f(run,0)}), the tooth's back on the stone the wrong way and the detent pulled out of its banking: why the 6MX's instruction forbids it (the escape wheel's teeth)`:`the drive outweighs it and the train is never turned back; a fit at the window's top (${f(hi*1000,0)} mN·m) would push the escape wheel back with ${f(backHi,0)} µN·m, ${f(backHi/run,1)} times its running drive, the tooth's back on the stone and the detent pulled out of its banking: the 6MX instruction's warning, and a reason to set the fit near the middle`}`);
  out.cannon={lo,hi,take,Tc0,Tc12,Tlo,sT,rH,g:[gr(lo),gr(hi),gr(take)],back,backHi,run};
}
function meshes(){
  if(!process.argv.includes('--model'))process.argv.push('--model','wempe');G=require('./gearing.js');WT=require('./wempe_train.js');   /* gearing.js cuts the Wempe's outlines (wempe_train.js) */
  for(const q of MS)for(const a of q.add)WT.addOutline(a[0],a[1],TEO(a));
  /* 1. at the drawn centres */
  say('1. The meshes at their drawn centres (gearing.js\'s stage on dial.js\'s tables; the driver turned through a pitch, the driven lagging until the teeth touch)');
  out.meshes=[];
  for(const q of MS){const s=G.stage(q.zA,q.zB,q.m,q.dd,120),fc=s.jam?null:G.st(s.fac[1]);q.s=s;
    chk(!s.jam&&s.tip>0,`${q.nm} (${q.zA}:${q.zB}, m ${f(q.m,4)}, its centres ${q.dd>=0?'+':''}${f(q.dd*1000)} µm off m(z1+z2)/2): ${s.jam?'jams':`runs; tip clearance ${f(s.tip*1000)} µm, backlash ${f(s.blmm*1000)} µm (${f(s.bl/D,2)}° of the driven), ${f(100*s.approach)} % of the action before the line of centres, the torque passed ${f(fc.mn,3)}-${f(fc.mx,3)} of the frictionless at μ 0.10`} (${q.what})`);
    out.meshes.push({nm:q.nm,za:q.zA,zb:q.zB,m:q.m,dd:q.dd,jam:s.jam,tip:s.tip,bl:s.bl,blmm:s.blmm,approach:s.approach});}
  if(fail)return;
  /* 2. the depthing windows: closer until it jams; wider until it loses contact (stage reports it as a jam: no tooth meets) or the play passes a quarter hour of the hand it drives
     (the hour hand through both meshes, the change wheel's backlash carried down by 18/54: wempe_transmission.js's section 7; the up-and-down hand's on its own) */
  const play=(k,bl)=>k===0?(bl*18/54+MS[1].s.bl)*720/TAU:k===1?(bl+MS[0].s.bl*18/54)*720/TAU:bl/(0.875*TAU)*56*60;   /* minutes of the hand's reading */
  const okAt=(k,dd)=>{const q=MS[k],s=G.stage(q.zA,q.zB,q.m,q.dd+dd,60);if(s.jam)return s.tip<=0?'its tips reach the roots':dd<0?'it jams':'its teeth lose contact';const p=play(k,s.bl);return p>15?`${f(p,1)} minutes of play on its hand`:'';};
  const edge=(k,sg)=>{const q=MS[k];let lo=0,hi=(sg<0?0.8:1.2)*q.m,why=okAt(k,sg*hi);if(!why)return[sg*hi,'passes to the end of the search'];while(hi-lo>0.002){const md=(lo+hi)/2,w=okAt(k,sg*md);if(w){hi=md;why=w;}else lo=md;}return[sg*lo,why];};
  say('');say('2. Each mesh\'s depthing window, and the hole a CNC must hold for its stud (aimed at the drawn centres; the window\'s close side, less the stud\'s shake, halved: gearing.js\'s rule)');
  out.win=[];
  MS.forEach((q,k)=>{const[lo,wl]=edge(k,-1),[hi,wh]=edge(k,1),tp=(Math.min(-lo,hi)-SHK)/2;out.win.push({nm:q.nm,lo,hi,tp,hole:q.hole});
    say(`  ${q.nm}: ${f(lo*1000)} to +${f(hi*1000)} µm about its drawn centres (closer: ${wl}; wider: ${wh}): the stud's hole (${q.hole}) to ±${f(tp*1000)} µm`);});
  const tpS=Math.min(out.win[0].tp,out.win[1].tp),tpU=out.win[2].tp;
  chk(out.win.every(w=>Math.min(-w.lo,w.hi)>SHK),`every window is wider than the stud's shake (${f(SHK*1000)} µm, estimated): the change wheel's stud (hole 19) to ±${f(tpS*1000)} µm, the up-and-down wheel's (hole 2) to ±${f(tpU*1000)} µm, against the train's ±${f(Math.min(...require('./gearing_wempe.json').stages.map(s=>s.tp))*1000)} µm (gearing_wempe.json)`);
  out.tp={stud19:tpS,stud2:tpU};
}
cannon();module.exports=out;
if(require.main===module){rows.length=0;fail=0;meshes();if(!fail)cannon();console.log(rows.join('\n'));const jo=process.argv.indexOf('--json');if(jo>0)fs.writeFileSync(process.argv[jo+1],JSON.stringify(out));process.exitCode=fail;}
