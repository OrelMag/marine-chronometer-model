// The going train in time: the escape wheel stops and starts twice a second, and the train behind it has to follow through its meshes, which give (the teeth bend)
// and have backlash. dynamics.js takes the train as rigid, its inertia at the escape wheel the wheel's (4.80 g·mm², physics.js) and the fourth wheel's (estimated,
// 1.08 reflected). Here:
//   1. the train's inertia at the escape wheel from the built model's solids (mechanisms.json: each arbor with what it carries, the hands and the motion work on
//      theirs), and dynamics.js run again with it: the swing and the rate it changes;
//   2. the train as five bodies (escape, fourth, third, centre, fusee wheel) on four meshes, each a spring (the teeth as cantilevers: E b s³ / 4 h³, the wheel's
//      brass and the pinion's steel in series, halved for the contact; estimated) with its backlash (gearing.js) and a little damping (3 % of critical, oil;
//      estimated), the fusee wheel driven at the fusee's even torque (the sustaining spring and the fusee behind it a soft spring to a large mass: steady over a
//      beat). Its modes, and a beat in time with the escape wheel moved as dynamics.js's escapement moves it: locked on the stone, let go, catching the impulse
//      jewel (a plastic blow, then carried at the jewel's speed through the escapement's own ratio, at(G1), while its drive pushes it, or falling back off the jewel when the train lags), let go again, landing on the stone. What the train
//      does after each landing: the meshes' forces against the steady, whether a mesh opens through its backlash (the train rattles), how far the seconds hand
//      bounces, and the escape wheel's speed as it catches the jewel against a rigid train's.
// Needs only Node.js:   node traindyn.js [--json OUT]   (about 20 s; exits 1 if a mesh's tooth force passes its strength (strength.js's margin), or the escape wheel
// catches the jewel a tenth slower than a rigid train would let it)
const fs=require('fs'),path=require('path'),PH=require('./physics.js'),DY=require('./dynamics.js'),MJ=require('./mechanisms.json'),GJ=require('./gearing.json');
const mv=fs.readFileSync(path.join(__dirname,'..','js','movement.js'),'utf8'),f=(x,n=0)=>(+x).toFixed(n),D2R=Math.PI/180,rows=[],out={};let fail=0;
const say=s=>rows.push('  '+s),chk=(ok,s,soft)=>{if(!ok&&!soft)fail=1;rows.push(`${ok?'  ok ':soft?'  ~~ ':'  !! '} ${s}`);};
const TR=PH.TRAIN,MO=PH.MODS,A=MJ.arbors;
/* ---------- 1. the inertia at the escape wheel ---------- */
const ra=[TR.fw/TR.ep,TR.fw/TR.ep*TR.tw/TR.fp,TR.fw/TR.ep*TR.tw/TR.fp*TR.cw/TR.tp,TR.fw/TR.ep*TR.tw/TR.fp*TR.cw/TR.tp*TR.fu/TR.cp];   /* escape turns per fourth, third, centre, fusee wheel turn */
const Jc=A.centre.I+A.cannon.I+A.minuteHand.I+A.minuteWheel.I*(TR.cp?14/56:0)**2+A.hourWheel.I*(14/56*18/54)**2+A.hourHand.I*(1/12)**2,J4=A.fourth.I+A.secondsHand.I,J3=A.third.I,Jf=A.fuseeWheel.I+A.sspring.I/2,Je=A.escape.I;
const JR=Je+J4/ra[0]**2+J3/ra[1]**2+Jc/ra[2]**2+Jf/ra[3]**2;
say('1. The train\'s inertia at the escape wheel (mechanisms.json: each arbor\'s solids at their densities)');
say(`the escape wheel with its pinion and arbor ${f(Je,2)} g·mm²; the fourth wheel with the seconds hand ${f(J4,1)} (${f(J4/ra[0]**2,3)} at the escape wheel), the third ${f(J3,1)} (${f(J3/ra[1]**2,4)}), the centre with the cannon pinion, the hands and the motion work ${f(Jc,1)} (${f(Jc/ra[2]**2,5)}), the fusee wheel ${f(Jf)} (${f(Jf/ra[3]**2,6)})`);
const JT0=DY.JT*1e9,kJ=JR/JT0;
say(`together ${f(JR,3)} g·mm² at the escape wheel, against dynamics.js's ${f(JT0,3)} (the wheel ${f(DY.JE*1e9,2)}, the fourth wheel's ${f(DY.J4*1e9,1)} estimated): ${f(100*(kJ-1),1)} %`);
const s0=DY.sim({T:60,from:30}),s1=DY.sim({T:60,from:30,J:kJ});
chk(Math.abs(s1.A-s0.A)<3&&Math.abs(s1.rate-s0.rate)<0.3,`dynamics.js with it: the swing ${f(s0.A,2)}° → ${f(s1.A,2)}°, the escapement's rate ${f(s0.rate,3)} → ${f(s1.rate,3)} s a day: the timing takes it up (the estimate it replaces was close)`);
out.J={Je,J4,J3,Jc,Jf,JR,JT0,kJ,A0:s0.A,A1:s1.A,r0:s0.rate,r1:s1.rate};
/* ---------- 2. the train as five bodies ---------- */
const arb=n=>{const m=new RegExp(`R\\.${n}=hn\\(arbor\\((.*?)\\),'`).exec(mv);if(!m)throw Error('arbor '+n);const s=m[1],w=/wheel:\{[^}]*?th:([\d.]+)/.exec(s),p=/pin:\{[^}]*?th:([\d.]+)/.exec(s);return{w:w&&+w[1],p:p&&+p[1]};};
const FW={gw:arb('gw'),cw:arb('cw'),tw:arb('tw'),fw:arb('fw'),esc:arb('esc')};
/* the meshes, from the fusee wheel down: the driving wheel (z, brass), the driven pinion (z, steel), the module, the face widths; k: a tooth as a cantilever, h
   2.25 m tall on a root s (the wheel's 1.57 m, half the pitch; the pinion leaf's 1.05 m), E b s³ / 4 h³, wheel and leaf in series and halved for the contact */
const ME=[[TR.fu,TR.cp,MO.fusee,FW.gw.w,FW.cw.p,0],[TR.cw,TR.tp,MO.centre,FW.cw.w,FW.tw.p,1],[TR.tw,TR.fp,MO.third,FW.tw.w,FW.fw.p,2],[TR.fw,TR.ep,MO.fourth,FW.fw.w,FW.esc.p,3]].map(([zw,zp,m,bw,bp,i])=>{
  const b=Math.min(bw,bp),kw=100e3*b*(1.57*m)**3/(4*(2.25*m)**3),kp=207e3*b*(1.05*m)**3/(4*(2.25*m)**3),k=0.5/(1/kw+1/kp);
  const bl=(GJ.stages[i].hi>0?1:1)*({0:0.267,1:0.221,2:0.171,3:0.167})[i];   /* backlash at the pitch circle, mm: gearing.js's at the drawn centres */
  return{zw,zp,m,R:m*zw/2,r:m*zp/2,k,bl};});   /* N/mm, mm */
const Jb=[Jf,Jc,J3,J4,Je].map(x=>x*1e-9);   /* kg·m², bodies 0 fusee wheel .. 4 escape */
const T0=PH.Tf;   /* N·m at the fusee wheel */
/* the modes, the teeth in contact (linear): K and M in the bodies' angles; their frequencies by the power method on M^-1 K's inverse, deflated (five bodies) */
{const n=5,K=Array.from({length:n},()=>Array(n).fill(0));ME.forEach((q,i)=>{const a=i,b=i+1,k=q.k*1e3,R=q.R*1e-3,r=q.r*1e-3;K[a][a]+=k*R*R;K[b][b]+=k*r*r;K[a][b]-=k*R*r;K[b][a]-=k*R*r;});
  /* the drive is a torque (no spring to ground), so one mode is the whole train turning (0 Hz): ground the fusee wheel's turn with the sustaining spring (the
     model's 1.91 N·m a radian) to find the rest */
  K[0][0]+=T0/(PH.TRAIN.cp/PH.TRAIN.fu*2*Math.PI/6);
  const Mi=Jb.map(x=>1/x),mul=(Mx,v)=>Mx.map(r=>r.reduce((s,x,j)=>s+x*v[j],0));
  /* the dynamic matrix's eigenvalues: solve K v = λ M v by Jacobi on the symmetric M^-1/2 K M^-1/2 */
  const S=K.map((r,i)=>r.map((x,j)=>x/Math.sqrt(Jb[i]*Jb[j])));let V=S.map(r=>r.slice());
  for(let sweep=0;sweep<60;sweep++)for(let p=0;p<n;p++)for(let q=p+1;q<n;q++){if(Math.abs(V[p][q])<1e-12*Math.abs(V[p][p]+V[q][q]))continue;const th=0.5*Math.atan2(2*V[p][q],V[q][q]-V[p][p]),c=Math.cos(th),s=Math.sin(th);
    for(let k=0;k<n;k++){const a=V[k][p],b=V[k][q];V[k][p]=c*a-s*b;V[k][q]=s*a+c*b;}for(let k=0;k<n;k++){const a=V[p][k],b=V[q][k];V[p][k]=c*a-s*b;V[q][k]=s*a+c*b;}}
  const fr=V.map((r,i)=>Math.sqrt(Math.max(0,r[i]))/(2*Math.PI)).sort((a,b)=>a-b);out.modes=fr;
  say('');say('2. The train as five bodies on four meshes (the teeth\'s give and backlash; the fusee wheel at the fusee\'s even torque)');
  say(`the meshes' stiffness, from the fusee wheel down: ${ME.map(q=>f(q.k)).join(', ')} N/mm at the pitch circle (estimated: the teeth as cantilevers), backlash ${ME.map(q=>f(q.bl*1000)).join(', ')} µm (gearing.js)`);
  say(`the train's modes: ${fr.map(x=>x<1000?f(x)+' Hz':f(x/1000,1)+' kHz').join(', ')} (the lowest the fusee wheel on the sustaining spring); an impulse lasts some ${f(1000*(20.7+2.4)*D2R/(DY.ESC.A*4*Math.PI),1)} ms, so through it the train above the fusee wheel moves as one`);}
/* the beat: dynamics.js's escapement, traced (each event: time, kind, the balance's angle and speed, the wheel's phase); one active swing's release, strike, leaving
   and lock */
const tr=[];DY.sim({T:20,from:10,trace:tr});const ev=tr.map(r=>({t:+r[0],k:r[1],th:+r[2]*D2R,w:+r[3]}));
const lastLock=ev.filter(e=>e.k===1&&e.t>15).pop(),cyc=[];{let i=ev.indexOf(lastLock);while(i>0&&ev[i].k!==2)i--;const rel=ev[i];const after=ev.filter(e=>e.t>rel.t&&e.t<=lastLock.t);
  /* the tooth leaves the jewel where the impulse ends (makeEsc's measure: no event is traced for it), timed by the balance's speed between the strike and the lock */
  const st=after.find(e=>e.k===0),thE=DY.ESC.measure().impEnd*D2R,tE=st.t+(thE-st.th)/((lastLock.th-st.th)/(lastLock.t-st.t));
  cyc.push(rel,st,{t:tE,k:6,th:thE,w:st.w+(lastLock.w-st.w)*(tE-st.t)/(lastLock.t-st.t)},lastLock);}
const [eRel,eStr,eLv,eLk]=cyc;if(!eStr)throw Error('traindyn: no strike in the traced beat');
const g1=th=>{const v=DY.at(DY.G1,th);return isNaN(v)?0:v;},P=DY.ESC.P;   /* the wheel's turn for the balance's, on the jewel */
/* in time, from the steady locked state: semi-implicit steps of 0.5 µs over a beat; the escape wheel's mode by phase */
const run=(stiff)=>{const kf=stiff?1e3:1,n=5,th=Array(n).fill(0),om=Array(n).fill(0),dt=5e-7,Tbeat=0.5;
  /* steady locked: each mesh compressed by its static force */
  const Fs=[];let Tq=T0;ME.forEach((q,i)=>{const F=Tq/(q.R*1e-3);Fs.push(F);Tq=F*q.r*1e-3;});
  for(let i=3;i>=0;i--){const q=ME[i];th[i]=(th[i+1]*q.r+Fs[i]/(q.k*kf))/q.R;}   /* δ = R θa - r θb = F / k, the escape wheel at 0 */
  const c=ME.map((q,i)=>{const mR=1/((q.R*1e-3)**2/Jb[i]+(q.r*1e-3)**2/Jb[i+1]);return 2*0.03*Math.sqrt(q.k*kf*1e3*mR);});
  let mode='lock',t=0,maxF=ME.map(()=>0),opened=ME.map(()=>0),openAt=ME.map(()=>''),bounce=0,lockTh4=null,vStr=null,vRig=null,last4=null;
  const tR=eRel.t,tS=eStr.t,tL=eLv.t,tK=eLk.t,thS=eStr.th,thL=eLv.th,wS=eStr.w,wL=eLv.w,jew=tt=>{const u=(tt-tS)/(tL-tS),thb=thS+(thL-thS)*u,wb=wS+(wL-wS)*u;return g1(thb)*wb;};
  const T=tK-tR+0.004;   /* from the release to 4 ms past the landing */
  while(t<T){const tt=tR+t;
    if(mode==='lock'&&t>=0)mode='free';
    if(mode==='free'&&tt>=tS&&vStr===null){vStr=om[4];const vj=jew(tt);if(om[4]>vj)om[4]=vj;mode='jewel';}
    if(mode==='jewel'&&tt>=tL)mode='free2';
    if(mode==='free2'&&tt>=tK){om[4]=0;mode='locked';lockTh4=th[3];}
    const F=ME.map((q,i)=>{let d=q.R*th[i]-q.r*th[i+1],dv=q.R*om[i]-q.r*om[i+1];d*=1;   /* mm */
      let g=d>0?d:d<-q.bl?d+q.bl:0;if(g===0&&d<=0){if(d<0&&-d>opened[i]){opened[i]=-d;openAt[i]=mode;}return 0;}return q.k*kf*g+c[i]*dv*1e-3;});
    F.forEach((x,i)=>{maxF[i]=Math.max(maxF[i],x);});
    const tq=[T0-F[0]*ME[0].R*1e-3,F[0]*ME[0].r*1e-3-F[1]*ME[1].R*1e-3,F[1]*ME[1].r*1e-3-F[2]*ME[2].R*1e-3,F[2]*ME[2].r*1e-3-F[3]*ME[3].R*1e-3,F[3]*ME[3].r*1e-3];
    for(let i=0;i<4;i++){om[i]+=tq[i]/Jb[i]*dt;th[i]+=om[i]*dt;}
    if(mode==='free'||mode==='free2'){om[4]+=tq[4]/Jb[4]*dt;th[4]+=om[4]*dt;}else if(mode==='jewel'){const vf=om[4]+tq[4]/Jb[4]*dt,vj=jew(tt);om[4]=vf>=vj?vj:vf;th[4]+=om[4]*dt;}   /* the tooth pushes the jewel (the balance far the heavier: it moves at the jewel's speed) or, its drive behind, falls back off it */else{om[4]=0;}
    if(mode==='locked'&&om[3]<0)bounce=Math.max(bounce,lockTh4-th[3]);
    t+=dt;}
  return{maxF,Fs,opened,openAt,bounce,vStr};};
const flex=run(false),rig=run(true);
const rat=flex.maxF.map((x,i)=>x/flex.Fs[i]);
say(`a beat (dynamics.js's: let go at ${f(eRel.th/D2R,1)}°, the jewel caught at ${f(eStr.th/D2R,1)}°, left at ${f(eLv.th/D2R,1)}°, the tooth landing on the stone ${f(1000*(eLk.t-eRel.t),1)} ms after its release)`);
say(`the meshes' largest force in the beat, from the fusee wheel down: ${rat.map(x=>f(x,2)).join(', ')} times the steady`);
const sm=MJ&&require('child_process').execFileSync('node',[path.join(__dirname,'strength.js')],{encoding:'utf8'}),mg=[...sm.matchAll(/margin ([\d.]+)-[\d.]+/g)].slice(0,4).map(x=>+x[1]);
chk(rat.every((x,i)=>x<mg[i]),`each under its teeth's margin in strength.js (${mg.map(x=>f(x,1)).join(', ')}): the blows of the stopping wheel don't load the teeth past their strength`);
const op=flex.opened.map(x=>x*1000);
const WHEN={free:'as the escape wheel, let go, gathers speed',jewel:'after the tooth strikes the jewel at about twice its speed and is slowed to it, the train behind springing back',free2:'as the escape wheel, let go by the jewel, springs ahead into its backlash before it lands',locked:'after the landing, the train rebounding off the stopped wheel'};
chk(op.every((x,i)=>x<ME[i].bl*1000),`${op.some(x=>x>0.01)?`the meshes open ${op.map((x,i)=>x>0.01?`${f(x,1)} µm (${ME[i].zw}:${ME[i].zp}, ${WHEN[flex.openAt[i]]})`:'').filter(Boolean).join('; ')}, inside their backlash (${ME.map(q=>f(q.bl*1000)).join(', ')} µm): no tooth meets the back of the next, and the train is back on its driving flanks within the beat`:'no mesh opens: the train stays on its driving flanks through the beat'}`);
const hand=17.6;say(`the seconds hand (${hand} mm long) bounces back ${f(flex.bounce*hand*1000,1)} µm at its tip after the tooth lands (${f(flex.bounce/D2R*3600,0)}" of arc), against the 0.6 mm of a half second's step: unseen`);
chk(flex.vStr>=0.9*rig.vStr,`the escape wheel catches the jewel at ${f(flex.vStr,1)} rad/s, a rigid train's ${f(rig.vStr,1)}: the teeth's give costs the chase ${f(100*(1-flex.vStr/rig.vStr),1)} %`);
out.beat={rat,mg,opened:op,bounce:flex.bounce,bounceTip:flex.bounce*hand,vStr:flex.vStr,vRig:rig.vStr,ev:{rel:eRel,str:eStr,lv:eLv,lk:eLk}};
out.meshes=ME.map(q=>({k:q.k,bl:q.bl}));out.rows=rows;module.exports=out;
if(require.main===module){console.log(rows.join('\n'));const jo=process.argv.indexOf('--json');if(jo>0)fs.writeFileSync(process.argv[jo+1],JSON.stringify(out));process.exitCode=fail;}
