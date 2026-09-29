// Measures the model's escapement (makeEsc in ../../shared/escapement.js, with the centre distance in ../js/movement.js) against the manual's adjustment figures (Sec. VIII), using the manual's definitions.
// Needs only Node.js:   node escapement.js            (try a setting without editing:  node escapement.js rT=0.29 aD=268). Exits with 1 if any figure is out of tolerance.
const fs=require('fs'),path=require('path'),{makeEsc}=require('../../shared/escapement.js');
const TAU=Math.PI*2,D2R=Math.PI/180;
/* the centre distance comes from the arbor positions L in movement.js, as the model's own ESC does */
const L=Function('return '+/^const L=(\{.*?\});/m.exec(fs.readFileSync(path.join(__dirname,'..','js','movement.js'),'utf8'))[1])();
function build(ov={}){   /* ESC as the model builds it, with any of makeEsc's settings overridden (angles in degrees) */
  const o={};for(const[k,v]of Object.entries(ov)){o[k]=Number(v);if(!Number.isFinite(o[k]))throw Error('not a number: '+k+'='+v);}
  const ESC=makeEsc({EX:-Math.hypot(L.B[0]-L.E[0],L.B[1]-L.E[1])/(13.16/2),...o});return{L,ES:ESC.ES,ESC};
}
function measure(ov){
  const{ES,ESC:E}=build(ov),mm=u=>u*ES,deg=a=>a/D2R,N=E.LI.length,th=i=>E.TH0+i*E.DT,r={};
  const tip=a=>Math.hypot(E.EX+Math.cos(a),Math.sin(a));
  r.D=mm(-E.EX);r.shake=mm(tip(E.t0)-E.rRoll);r.dip=mm(E.rRoll-(-E.EX-1));
  let a0=null;for(let i=0;i<N;i++)if(E.LI[i]>0){a0=th(i);break;}                                  // unlocking swing: discharge jewel meets the trip spring
  let im=0;for(let i=0;i<N;i++)if(E.LI[i]>E.LI[im])im=i;const off=th(im);                        // ... tip slides off the jewel, detent falls back
  let ip=null;for(let i=0;i<N;i++)if(E.PS[i]>0&&(ip===null||E.PS[i]>E.PS[ip]+1e-9))ip=i;
  let ipm=N-1;for(let i=0;i<N;i++)if(E.PS[i]>=E.PS[ip]-1e-9){ipm=i;break;}const poff=th(ipm);    // passing swing: trip spring falls off the jewel
  r.contact=deg(a0);r.rel=deg(E.thRel);r.off=deg(off);r.poff=deg(poff);
  r.lock=deg(E.thRel-a0);r.letoff=deg(off-E.thRel);r.overall=deg(off-poff);
  let tIn=null;for(let t=E.TH0;t<1.2;t+=0.01*D2R)if(E.bite(t)>-1e8){tIn=t;break;}
  r.drop=deg(E.thRel-tIn);r.ahead=deg(E.t0-E.bite(E.thRel));                                    // drop (Op. 97); >0: jewel is past the waiting tooth at release
  let tE=null;for(let k=0;k<=40000;k++){const p=0.5*k/40000;if(Math.sin(TAU*p)<=0)continue;const s=E.state(p);if(tE===null&&s.prog>=1){tE=s.th;break;}}
  r.impEnd=deg(tE);r.hornClr=mm(Math.min(...E.pieces.horn.map(q=>Math.hypot(q.x,q.y)))-E.rd);r.jewels=deg(E.aD-E.aI);r.lRel=mm(E.lRel);
  return r;
}
module.exports={build,measure};
if(require.main===module){
  const ov={};process.argv.slice(2).forEach(a=>{const[k,v]=a.split('=');ov[k]=v;});
  const r=measure(ov),f=(x,n=1)=>x.toFixed(n),row=(name,v,want,ok)=>{if(!ok)process.exitCode=1;console.log(`${ok?'  ok ':'  !! '} ${name.padEnd(46)}${v.padStart(10)}   ${want}`);};
  row('centre distance',f(r.D,2)+' mm','',true);
  row('roller shake (Op. 84)',f(r.shake,3)+' mm','about 0.002 in (0.051 mm)',r.shake>0.03&&r.shake<0.08);
  row('teeth dip into the roller\'s crescent (Op. 76)',f(r.dip,2)+' mm','> 0',r.dip>0);
  row('lock (Op. 85)',f(r.lock)+'°','about 6°',Math.abs(r.lock-6)<1);
  row('let-off (Op. 86)',f(r.letoff)+'°','at least 6°',r.letoff>=6);
  row('overall (Op. 87)',f(r.overall)+'°','26-30°',r.overall>=26&&r.overall<=30);
  row('drop (Op. 97)',f(r.drop)+'°','about 2°',Math.abs(r.drop-2)<1&&r.ahead>0);
  row('horn clearance to the unlocking jewel (Op. 88)',f(r.hornClr,2)+' mm','about 0.010 in (0.25 mm)',Math.abs(r.hornClr-0.254)<0.08);
  row('angle between the jewels',f(r.jewels)+'°','about 90° (Fig. 90)',Math.abs(r.jewels-90)<10);
  console.log(`\n  balance angle: jewel meets trip spring ${f(r.contact)}°, wheel released ${f(r.rel)}°, detent falls back ${f(r.off)}°;`);
  console.log(`  impulse ends ${f(r.impEnd)}°; on the return swing the trip spring falls off at ${f(r.poff)}°. Lift at release ${f(r.lRel,2)} mm.`);
}
