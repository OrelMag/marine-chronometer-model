// Measures the model's escapement (makeEsc in ../../shared/escapement.js, with the centre distance in ../js/movement.js) against the manual's adjustment figures (Sec. VIII), using the manual's definitions.
// Needs only Node.js:   node escapement.js            (try a setting without editing:  node escapement.js rT=0.29 aD=268). Exits with 1 if any figure is out of tolerance.
// The figures and their tolerances are measure() and checks() in shared/escapement.js, which the model's adjuster's bench shows too.
const fs=require('fs'),path=require('path'),{makeEsc}=require('../../shared/escapement.js');
/* the centre distance comes from the arbor positions L in movement.js, as the model's own ESC does */
const L=Function('return '+/^const L=(\{.*?\});/m.exec(fs.readFileSync(path.join(__dirname,'..','js','movement.js'),'utf8'))[1])();
function build(ov={}){   /* ESC as the model builds it, with any of makeEsc's settings overridden (angles in degrees) */
  const o={};for(const[k,v]of Object.entries(ov)){o[k]=Number(v);if(!Number.isFinite(o[k]))throw Error('not a number: '+k+'='+v);}
  const ESC=makeEsc({EX:-Math.hypot(L.B[0]-L.E[0],L.B[1]-L.E[1])/(13.16/2),...o});return{L,ES:ESC.ES,ESC};
}
const measure=ov=>build(ov).ESC.measure();
module.exports={build,measure};
if(require.main===module){
  const ov={};process.argv.slice(2).forEach(a=>{const[k,v]=a.split('=');ov[k]=v;});
  const E=build(ov).ESC,r=E.measure(),f=(x,n=1)=>x.toFixed(n);
  for(const c of E.checks()){if(!c.ok)process.exitCode=1;console.log(`${c.ok?'  ok ':'  !! '} ${c.name.padEnd(46)}${c.v.padStart(10)}   ${c.want}`);}
  if(!r.runs){process.exitCode=1;console.log(`  !!  it would not run: ${r.why}`);}
  console.log(`\n  balance angle: jewel meets trip spring ${f(r.contact)}°, wheel released ${f(r.rel)}°, detent falls back ${f(r.off)}°;`);
  console.log(`  impulse ends ${f(r.impEnd)}°; on the return swing the trip spring falls off at ${f(r.poff)}°. Lift at release ${f(r.lRel,2)} mm.`);
}
