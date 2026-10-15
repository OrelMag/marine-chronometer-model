// The escapement's fingerprint: makeEsc (../../shared/escapement.js) built as the model and the tools build it (tools/escapement.js's build: the centre distance from
// movement.js's L, the model's settings), every table, figure and function it exports run over a grid of arguments, each result's doubles hashed by their exact bits (sha256).
// Kept so that a change to makeEsc that must leave the Hamilton's escapement as it was (a setting made of a literal, a second chronometer's options) is proved to, bit for bit.
//   node escgolden.js           exits 1 if any item's fingerprint differs from escgolden.json (names the items that do)
//   node escgolden.js --write   writes escgolden.json from the file as it is
// Four instances: the model's (the reference), one with a geometry setting changed (rT: calibrated against the reference), one with a calibration setting changed (TF: its own
// reference) and one with the hairspring's isochronism (HS). Items exported since the fingerprint was written aren't hashed (named as new); the settings are hashed over the keys
// they had then. About 1 s.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{build}=require('./escapement.js'),OUT=path.join(__dirname,'escgolden.json'),D=Math.PI/180;
const H=()=>{const h=crypto.createHash('sha256'),nb=[];const fl=()=>{if(nb.length){h.update(Buffer.from(new Float64Array(nb).buffer));nb.length=0;}};
  const feed=v=>{if(typeof v==='number'){nb.push(v);return;}fl();
    if(v===null||v===undefined)h.update(v===null?'N':'U');else if(typeof v==='boolean')h.update(v?'T':'F');else if(typeof v==='string')h.update('s'+v.length+':'+v);
    else if(typeof v==='function')h.update('f');else if(ArrayBuffer.isView(v)){h.update('a'+v.length);nb.push(.../** @type {any} */(v));}
    else if(Array.isArray(v)){h.update('a'+v.length);v.forEach(feed);}else{const k=Object.keys(v).sort();h.update('o'+k.length);for(const x of k){fl();h.update('k'+x);feed(v[x]);}}};
  return{feed,hex:()=>{fl();return h.digest('hex');}};};
const hash=f=>{const h=H();f(h.feed);return h.hex();},rng=(a,b,n)=>Array.from({length:n+1},(_,i)=>a+(b-a)*i/n);
/* each exported function with the arguments it is run over */
const CALLS={
  state:(E,f)=>{for(const a of[E.A,E.AMIN+0.2*D,90*D,150*D,300*D,340*D])for(const s of[1,0.5,1.5])for(let i=0;i<4000;i++){const z=E.state(i/4000,a,s);f([z.th,z.ccw,z.lift,z.psDef,z.prog,z.drop,z.run]);}f(E.state(0.3));},
  measure:(E,f)=>f(E.measure()),checks:(E,f)=>f(E.checks()),
  ampAt:(E,f)=>rng(0.05,3,59).forEach(s=>f(E.ampAt(s))),
  rateAt:(E,f)=>{for(const a of rng(30*D,350*D,64))for(const s of[1,0.6,1.4])f(E.rateAt(a,s));f(E.rateAt(E.A));},
  atK:(E,f)=>{for(const s of[0.3,0.8,1,1.3])for(const kd of[0.5,1,2])for(const kp of[0.5,1,2])f(E.atK(s,kd,kp));f(E.atK(1));},
  wn:(E,f)=>{for(const s of[0.5,1,1.5])for(const a of rng(20*D,350*D,40))f(E.wn(s,a));},
  span:(E,f)=>{const m={x:-E.nB.x,y:-E.nB.y};for(const th of rng(E.TH0,30*D,800)){f(E.span(th,E.nH));f(E.span(th,m));}},
  impulse:(E,f)=>{const w=E.run.cl?E.run.cl.w:1e-3;for(const s of[0.5,1,1.5])for(const a of rng(30*D,350*D,32))f(E.impulse(s,a,w));},
  chase:(E,f)=>{for(const th of rng(-25*D,25*D,100))for(const a of[E.A,150*D])f(E.chase(th,a,1));},
  bite:(E,f)=>rng(E.TH0,30*D,2000).forEach(th=>f(E.bite(th))),
  recoil:(E,f)=>rng(0,E.lRel*1.1,300).forEach(l=>f(E.recoil(l))),
  toothBack:(E,f)=>rng(0,E.lRel,60).forEach(l=>f(E.toothBack(l))),
  toothPts:(E,f)=>[0,E.t0,E.lockA,-1.3,2.1].forEach(a=>f(E.toothPts(a))),
  springPts:(E,f)=>{for(const lift of[0,0.05,0.12])for(const psDef of[0,0.03])f(E.springPts({lift,psDef}));},
  D:(E,f)=>{for(const t of[-1,0,0.7,1.7])for(const n of[-0.1,0,0.2])f(E.D(t,n));},
  depart:(E,f)=>rng(30*D,350*D,80).forEach(a=>f(E.depart(a))),
  fallD:(E,f)=>{for(const d0 of[0,0.002,0.01])for(const v0 of[-5,0,3])for(const t of rng(0,0.004,40))f(E.fallD(d0,v0,t));},
  homeAt:(E,f)=>[E.A,150*D,300*D].forEach(a=>f(E.homeAt(a))),
  EHd:(E,f)=>rng(20*D,350*D,80).forEach(a=>f(E.EHd(a))),
  freeStep:(E,f)=>{for(const a of[30*D,60*D,150*D,255*D,330*D])for(const dt of[0,0.1,1,5,47,300])f(E.freeStep(a,dt));}};
const VARS={model:{},rT:{rT:0.2900},TF:{TF:60},HS:{HS:0.5}};
function prints(old){const r={};for(const[vn,ov]of Object.entries(VARS)){const E=/** @type {any} */(build(ov).ESC),o=r[vn]={},keys=old?Object.keys(old[vn]).filter(k=>!k.startsWith('settings')):Object.keys(E);
    for(const k of keys){if(!(k in E)){o[k]='missing';continue;}if(typeof E[k]==='function'){if(!CALLS[k])throw Error('escgolden: no calls for '+k+': add it to CALLS');o[k]=hash(f=>CALLS[k](E,f));}else o[k]=hash(f=>f(E[k]));}
    const sk=old?old[vn]['settings:keys']:Object.keys(E.settings);o['settings:keys']=sk;o['settings']=hash(f=>sk.forEach(k=>{f(k);f(E.settings[k]);}));
    if(old)o['new']=Object.keys(E).filter(k=>k!=='settings'&&!keys.includes(k));}
  return r;}
if(process.argv.includes('--write')){fs.writeFileSync(OUT,JSON.stringify(prints(null),null,1)+'\n');console.log('wrote',OUT);}
else{const old=JSON.parse(fs.readFileSync(OUT,'utf8')),now=prints(old);let bad=0,n=0;
  for(const vn of Object.keys(old)){const d=Object.keys(old[vn]).filter(k=>k!=='settings:keys'&&JSON.stringify(old[vn][k])!==JSON.stringify(now[vn][k]));n+=Object.keys(old[vn]).length-1;bad+=d.length;
    console.log(`${d.length?'  !! ':'  ok '} ${vn.padEnd(6)} ${d.length?'differs: '+d.join(', '):'every item the same, bit for bit'}${now[vn].new.length?` (new, not hashed: ${now[vn].new.join(', ')})`:''}`);}
  console.log(bad?`  !!  ${bad} of ${n} fingerprints differ`:`  ok  all ${n} fingerprints the same`);if(bad)process.exitCode=1;}
