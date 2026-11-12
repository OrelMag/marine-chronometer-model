// The Wempe's discharge stone's place on the staff against its sources (Node.js, no browser; about 15 minutes; it reports and never fails; it changes no file).
// The model sets the stone by where it leaves the gold spring's tip, DSB degrees after the balance passes rest (wempe/js/escapement.js). Since 11 November 2026 DSB is 14.2,
// where sheet 05 04_1 puts the release (the owner's choice; Review-results.md, "The Wempe's discharge stone"); until then 5, an estimate ("the scan can't give it"; from 8
// later "it doesn't run"). The sources:
//   05 04_1's "5°", on the balance's arc beside its 6° and 22°10', runs from where the impulse stone's corner enters the teeth's path (22°10' before the line of centres)
//     toward the line: the stone 5° inside the teeth's path when the tooth is let go, the period rule (Watch and Clock Escapements, 1904, Fig. 141, which keystone.js quotes);
//   the Navy's 1958 repair book, p. 60 (the MX): "конец золотой пружины при равновесии не доходил до спускового камня на 0,10-0,15 мм", the gold spring's end 0.10-0.15 mm
//     from the discharge stone with the balance at rest: on the side the stone comes from, the stone meets the spring that far after rest; on the far side, it has left it
//     that far before rest (the text doesn't say which).
// And "it doesn't run" was the swing solve's, not the escapement's: makeEsc's solveA started its search at the least swing that passes the gold spring on the return and
// gave up if the work there was finite and under the loss, which it is when the release comes after rest and after that swing (no impulse yet: nothing gained); the work
// is over the loss from a few degrees more. shared/escapement.js carries the search on since that day (the line FIX names); OLD takes it out again in memory to show the
// fault. dynamics.js --model wempe agrees with the swing found (161.4° in time against 161.6°, 300 beats, no tooth lost).
// Prints: 1. the solver as it was against as it is, with the stone at its old place over the drive, and later on the staff; 2. each reading's place for the stone (DSB),
// the events (met, released, off, how far the impulse stone is inside the teeth's path at the release), where the tooth lands, the strike's loss and the swing over the
// wind, at the model's damping (TF 111 s) and the 6MX video's fit (141 s), on the drawn drive and at 1.26 times it (the 1950s build's level, on the drawn detent).
//   node wempe_discharge.js [--json OUT]
const fs=require('fs'),path=require('path'),load=require('./wempe_load.js'),d=Math.PI/180,f=(x,n=1)=>Number.isFinite(x)?x.toFixed(n):'-',say=s=>console.log('  '+s),head=s=>console.log('\n'+s);
const FIX='    if(thRel>0)while(!(g(lo)>0)&&lo<Math.PI)lo+=2*D2R;',D0=/const DSB=([\d.]+);/,T0=/TH1:60,TF:(\d+)\}/;
const src=fs.readFileSync(path.join(__dirname,'..','..','wempe','js','escapement.js'),'utf8'),sh=fs.readFileSync(path.join(__dirname,'..','..','shared','escapement.js'),'utf8');
if(!D0.test(src)||!T0.test(src)||!sh.includes(FIX)){console.error('wempe_discharge.js: the lines it varies have changed (DSB, TF in wempe/js/escapement.js; solveA\'s carried-on search in shared/escapement.js)');process.exit(2);}
const NOW=+D0.exec(src)[1],WAS=5,mk=(DSB,TF,old)=>load({xf:(file,s)=>{s=s.replace(D0,`const DSB=${DSB};`).replace(T0,`TH1:60,TF:${TF}}`);return old?s.replace(FIX,''):s;}});
const out={now:NOW,was:WAS};

head(`1. The swing solve as it was (giving up at a finite, negative start) and as it is, TF 111 s`);
{const A=mk(WAS,111,true).WPHYS.ESC,B=mk(WAS,111,false).WPHYS.ESC,ch=[];let n=0;for(let k=0.05;k<=1.6001;k+=0.025){const a=A.ampAt(k)/d,b=B.ampAt(k)/d;n++;if(Math.abs(a-b)>1e-9)ch.push(`${f(k,3)}: ${f(a)}° to ${f(b)}°`);}
  say(`the stone at its old place (DSB ${WAS}), ${n} drives, 0.05-1.6 of the reference: ${ch.length?`${ch.length} change (${ch.join(', ')}); the rest to 1e-9°`:'none changes'}`);out.old=ch;
  const rows=[];for(const D of[8,10,11,12,NOW]){const a=mk(D,111,true).WPHYS,b=mk(D,111,false).WPHYS,s=a.drv(12/a.HPT);rows.push(`DSB ${D}: ${f(a.ESC.ampAt(s)/d)}° / ${f(b.ESC.ampAt(s)/d)}°`);}
  say(`the stone later, the swing at 12 h as it was / as it is: ${rows.join('; ')} (0: "doesn't run")`);out.later=rows;}

head('2. Each reading\'s place for the discharge stone');
{const E0=mk(NOW,111,false).WPHYS.ESC,r0=E0.measure(),rr=E0.rd*E0.ES,g2=x=>x/rr/d;   /* a gap in mm as an angle at the discharge stone's end's radius */
  say(`as built (DSB ${NOW}): met ${f(r0.contact)}°, released ${f(r0.rel)}°, off ${f(r0.off)}° (of the balance after rest), the return's pass ${f(r0.poff)}°, the impulse stone ${f(r0.drop)}° inside the teeth's path at the release; the discharge stone's end at r ${f(rr,3)} mm: 0.10-0.15 mm there is ${f(g2(0.10))}-${f(g2(0.15))}°`);
  const C=[['until 11 November 2026 (estimated)',WAS],['the release as the impulse stone enters the path (the sheet\'s 1° drop alone)',NOW-r0.drop],['05 04_1\'s 5°: the stone 5° inside the path at the release (as built)',NOW],
    ['1958 book, the stone coming: met 0.10 mm after rest',NOW+g2(0.10)-r0.contact],['1958 book, the stone coming: met 0.15 mm after rest',NOW+g2(0.15)-r0.contact],['1958 book, the stone gone: off 0.10 mm before rest',NOW-g2(0.10)-r0.off],['1958 book, the stone gone: off 0.15 mm before rest',NOW-g2(0.15)-r0.off]];
  out.cases=[];
  for(const TF of[111,141]){say(`TF ${TF} s${TF===141?' (the 6MX video\'s fit of 27 October 2026, 133-158)':' (the model\'s)'}: the swing at 0 / 12 / 24 / 48 / 56 h from full wind`);
    for(const[name,D]of C){const W=mk(+D.toFixed(3),TF,false),P=W.WPHYS,E=P.ESC,r=E.measure(),u=E.run||{},sw=k=>[0,12,24,48,56].map(h=>f(E.ampAt(k*P.drv(h/P.HPT))/d,0)).join(' / ');
      const a1=sw(1),a2=sw(1.26);say(`  ${name.padEnd(74)} DSB ${f(D).padStart(5)}: met ${f(r.contact).padStart(5)}°, released ${f(r.rel).padStart(5)}°, the stone ${f(r.drop).padStart(5)}° inside; lands ${f(u.land/d).padStart(4)}° after rest, the strike ${f(100*u.strike).padStart(4)} %; the drawn drive ${a1}°; 1.26 times ${a2}°`);
      out.cases.push({TF,name,DSB:D,met:r.contact,rel:r.rel,off:r.off,inside:r.drop,land:u.land/d,strike:u.strike,swing:a1,swing126:a2});}}
  say('a negative "inside": the tooth is let go before the impulse stone is in its path and runs to it; "the stone gone" lets it go so early that it is past the stone\'s corner before the stone comes in (no impulse on a real escapement: makeEsc\'s figure there is a stand-in)');}
const j=process.argv.indexOf('--json');if(j>0&&process.argv[j+1])fs.writeFileSync(process.argv[j+1],JSON.stringify(out,null,1)+'\n');
