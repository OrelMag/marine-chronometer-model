// Measures the model's escapement (makeEsc in ../../shared/escapement.js, with the centre distance in ../js/movement.js) against the manual's adjustment figures (Sec. VIII), using the manual's definitions.
// Needs only Node.js:   node escapement.js            (try a setting without editing:  node escapement.js rT=0.29 aD=268). Exits with 1 if any figure is out of tolerance
// or the escapement would not run (the balance swinging too little to keep it going among the reasons). Also prints the running amplitude and the escapement's rate.
// Last, the locking stone against the teeth through the period at ten swings (stoneClash): no point of either inside the other (exits with 1 past 1 µm).
// The figures and their tolerances are measure() and checks() in shared/escapement.js, which the model's adjuster's bench shows too.
const fs=require('fs'),path=require('path'),{makeEsc}=require('../../shared/escapement.js');
/* the centre distance comes from the arbor positions L in movement.js, as the model's own ESC does */
const L=Function('return '+/^const L=(\{.*?\});/m.exec(fs.readFileSync(path.join(__dirname,'..','js','movement.js'),'utf8'))[1])();
function build(ov={}){   /* ESC as the model builds it, with any of makeEsc's settings overridden (angles in degrees) */
  const o={};for(const[k,v]of Object.entries(ov)){o[k]=Number(v);if(!Number.isFinite(o[k]))throw Error('not a number: '+k+'='+v);}
  const ESC=makeEsc({EX:-Math.hypot(L.B[0]-L.E[0],L.B[1]-L.E[1])/(13.16/2),...o});return{L,ES:ESC.ES,ESC};
}
const measure=ov=>build(ov).ESC.measure();
/* the locking stone against the escape wheel's teeth through a period (the plan as makeEsc solves it, ESC.state): at each phase the stone's outline, turned with the detent's
   lift, and the outlines of the teeth near it (ESC.toothPts, closed along the root circle), each edge cut every 0.5 µm where it is inside the other's box; the deepest point
   of either inside the other (mm). The tooth resting on the stone's flat is a touch, 0; the audit of 11 October 2026 found 0.071 mm (the detent snapping home onto the
   escaping tooth's back) and 0.007 mm (the stone drawn out through the locked tooth's tip, the wheel not recoiling). Only phases where the stone or a tooth moves are
   looked at (the detent lifted or falling, the wheel off its lock), and one where neither does. amp, s: the swing and the drive; n: phases over the period */
function stoneClash(E,amp=E.A,s=1,n=20000){
  const{P,EX,Ft,LEN,t0}=E,h=5e-4/E.ES,box=pl=>{let x0=Infinity,x1=-Infinity,y0=Infinity,y1=-Infinity;for(const q of pl){x0=Math.min(x0,q.x);x1=Math.max(x1,q.x);y0=Math.min(y0,q.y);y1=Math.max(y1,q.y);}return[x0,x1,y0,y1];};
  const cut=(pl,b)=>{const o=[];for(let i=0;i<pl.length;i++){const a=pl[i],c=pl[(i+1)%pl.length],m=Math.max(1,Math.ceil(Math.hypot(c.x-a.x,c.y-a.y)/h));
    for(let j=0;j<m;j++){const x=a.x+(c.x-a.x)*j/m,y=a.y+(c.y-a.y)*j/m;if(x>=b[0]&&x<=b[1]&&y>=b[2]&&y<=b[3])o.push({x,y});}}return o;};
  const inside=(q,pl)=>{let c=false;for(let i=0,j=pl.length-1;i<pl.length;j=i++){const a=pl[i],b=pl[j];if((a.y>q.y)!==(b.y>q.y)&&q.x<(b.x-a.x)*(q.y-a.y)/(b.y-a.y)+a.x)c=!c;}return c;};
  const dist=(q,pl)=>{let d=Infinity;for(let i=0;i<pl.length;i++){const a=pl[i],b=pl[(i+1)%pl.length],dx=b.x-a.x,dy=b.y-a.y,l2=dx*dx+dy*dy,t=l2?Math.max(0,Math.min(1,((q.x-a.x)*dx+(q.y-a.y)*dy)/l2)):0;d=Math.min(d,Math.hypot(q.x-a.x-t*dx,q.y-a.y-t*dy));}return d;};
  const tooth=a=>{const q=E.toothPts(a).slice(0,-1),rb=q[q.length-1][1],rf=q[0][1];for(let k=1;k<8;k++)q.push([E.r0,rb+(rf-rb)*k/8]);return q.map(([r,g])=>({x:EX+r*Math.cos(g),y:r*Math.sin(g)}));};
  let worst={d:0,p:0,th:0,k:0},still=false;
  for(let i=0;i<n;i++){const p=i/n,z=E.state(p,amp,s);if(z.lift===0&&(z.prog===0||z.prog===1)){if(still)continue;still=true;}
    const dl=-z.lift/LEN,c=Math.cos(dl),sn=Math.sin(dl),st=E.pieces.stone.map(q=>({x:Ft.x+(q.x-Ft.x)*c-(q.y-Ft.y)*sn,y:Ft.y+(q.x-Ft.x)*sn+(q.y-Ft.y)*c}));
    if(Math.min(...st.map(q=>Math.hypot(q.x-EX,q.y)))>=1)continue;const bs=box(st);
    for(const k of[-3,-2,-1,0]){const tp=tooth(t0+(k-z.prog)*P),bt=box(tp);if(bt[0]>bs[1]||bt[1]<bs[0]||bt[2]>bs[3]||bt[3]<bs[2])continue;let d=0;
      for(const q of cut(st,bt))if(inside(q,tp))d=Math.max(d,dist(q,tp));for(const q of cut(tp,bs))if(inside(q,st))d=Math.max(d,dist(q,st));
      if(d*E.ES>worst.d)worst={d:d*E.ES,p,th:z.th,k};}}
  return worst;}
module.exports={build,measure,stoneClash};
if(require.main===module){
  const ov={};process.argv.slice(2).forEach(a=>{const[k,v]=a.split('=');ov[k]=v;});
  const E=build(ov).ESC,r=E.measure(),f=(x,n=1)=>x.toFixed(n);
  for(const c of E.checks()){if(!c.ok)process.exitCode=1;console.log(`${c.ok?'  ok ':'  !! '} ${c.name.padEnd(46)}${c.v.padStart(10)}   ${c.want}`);}
  if(!r.runs){process.exitCode=1;console.log(`  !!  it would not run: ${r.why}`);}
  console.log(`\n  balance angle: jewel meets trip spring ${f(r.contact)}°, wheel released ${f(r.rel)}°, detent falls back ${f(r.off)}°;`);
  console.log(`  impulse ends ${f(r.impEnd)}°; on the return swing the trip spring falls off at ${f(r.poff)}°. Lift at release ${f(r.lRel,2)} mm.`);
  const u=E.run;if(u.cl)console.log(`  running amplitude ${f(r.A)}° (it needs ${f(r.AMIN)}°); the tooth lands on the impulse jewel at ${f(u.land*180/Math.PI)}° and drives it through ${f(u.drive*180/Math.PI,2)}° of the wheel;
  unlocking takes ${f(100*u.fu)}% of the impulse's work. Escapement error ${Number.isFinite(u.rate)?(u.rate>=0?'+':'')+f(u.rate,2):'-'} s a day against the model's settings`+
    `${Number.isFinite(u.own)?` (the escapement's own error ${f(u.own,2)} s a day, which the timing absorbs at the model's settings: impulse ${f(86400*u.parts.imp/2/Math.PI,2)}, draw ${f(86400*u.parts.draw/2/Math.PI,2)}, detent spring ${f(86400*u.parts.detent/2/Math.PI,2)}, trip spring ${f(86400*u.parts.trip/2/Math.PI,2)})`:''}.`);
  /* isochronism: the swing and rate the torque gives (the drive at s of the model's), at the manual's 1⅜ and 1½ turns of motion (Sec. II) */
  if(u.cl){const sAt=a=>{let lo=0.05,hi=4;for(let k=0;k<50;k++){const m=(lo+hi)/2;E.ampAt(m)<a?lo=m:hi=m;}return(lo+hi)/2;},d=Math.PI/180,iso=[247.5,255,270].map(A=>{const s=sAt(A*d);return`${f(A)}° ${f(100*s,0)}% of the torque, ${(x=>(x>=0?'+':'')+f(x,2))(E.rateAt(A*d,s))} s a day`;});
    console.log(`  isochronism (the escapement's${E.settings.HS?`, and the hairspring's at ${f(E.settings.HS,2)} s a day per 10°`:'; the hairspring taken as isochronous'}): ${iso.join('; ')}.`);}
  /* the stone never in a tooth: at the swing each drive keeps (15 % to 150 % of the calibrated torque, over AMIN), the least swing, and swings a jolt gives at the calibrated drive */
  if(r.runs&&u.cl){const d=Math.PI/180,cases=[...[0.15,0.3,0.5,0.75,1,1.25,1.5].map(s=>[E.ampAt(s),s]).filter(([a])=>a>=E.AMIN),[E.AMIN+0.2*d,0.15],[300*d,1],[340*d,1]];
    let w={d:0},wc=null;for(const[a,s]of cases){const q=stoneClash(E,a,s);if(q.d>=w.d){w=q;wc=[a,s];}}const ok=w.d<1e-3;if(!ok)process.exitCode=1;
    console.log(`${ok?'  ok ':'  !! '} the locking stone never inside a tooth through the period (${cases.length} swings, ${f(E.AMIN/d)}° to 340°, 20,000 phases each): deepest ${f(w.d*1000,2)} µm`+(w.d>0?` at ${f(wc[0]/d)}°, drive ${f(100*wc[1],0)} %, the balance at ${f(w.th/d,2)}° (phase ${w.p.toFixed(5)}), tooth ${w.k}`:'')+` (want under 1 µm)`);
    const hm=E.homeAt(E.A);console.log(`  the detent leaves the discharge jewel at ${f(E.depart(E.A).th/d,2)}° and is home on its stop at ${f(hm/d,2)}° (at ${f(E.A/d)}°); the escaping tooth's lock runs on from ${f(E.thE/d,2)}°.`);}
}
