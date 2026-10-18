// The sustaining spring (42016) and what it does while the key winds (Sec. IV: it "is designed to supply enough power to drive the chronometer for five to ten
// minutes"). A split ring weaker than the drive, as the period's makers had it (Gould, The Marine Chronometer, 1923, pp. 47-48, 238; Glasgow, Watch and Clock
// Making, 1885, pp. 65, 106): in running the fusee's pull closes it until its lobes nearly meet and bank (SSB), so it carries the drive through its banking; when the
// key takes the fusee it opens, pushing SPU of the 12-hour drive banked and less as it opens, to nothing at its free gap (SSG). movement.js takes SPU as a constant;
// here its stiffness comes from its section as traced (KLUwI2UUCMQ 27:26: SSI, the band's inner edge every 2 deg, its width the wall's radius less that; the height
// SSH_B, 28:42.5 and 28:43.0) bent in its plane, round from the working end's pin to the fixed end's (each lobe held by one pin, so the band is loaded by a pair of
// equal and opposite forces along the line through the pins): by Castigliano the pins close along that line by F ∫ h² / (E I) ds over the band, h a point's distance
// from the line and I the section's there, so the spring's torsional stiffness is d² / ∫ h² / (E I) ds (d the line's distance from the axis), and its push banked
// k SMAX. Then, while the key winds, the train runs on it, the fusee wheel turning at its rate, the spring opening and its push falling; the balance's swing follows
// (A² towards ampAt(drive)², TF, as app.js runs it) and the rate with it (rateAt): how long the chronometer runs (the manual's five to ten minutes, read as the time
// it keeps it going; until 17 October 2026 the time it kept the balance over a turn, which the designed band, 1.45 high and 2.1 wide, gave and the traced one can't),
// how long the swing stays over a turn, and the seconds a wind costs. Needs only Node.js:
//   node sustaining.js [--json OUT]    (about 15 s; exits 1 if the section doesn't give SPU, the spring isn't weaker than the drive, it keeps the chronometer
//   running outside five to ten minutes, it is stressed past its steel or its band doesn't fit the recess)
const fs=require('fs'),path=require('path'),PH=require('./physics.js'),{build}=require('./escapement.js');
const ESC=build().ESC,mv=fs.readFileSync(path.join(__dirname,'..','js','movement.js'),'utf8');
const num=(re,what)=>{const m=re.exec(mv);if(!m)throw Error('not found in movement.js: '+what);return m.slice(1).map(Number);};
const f=(x,n=0)=>(+x).toFixed(n),D2R=Math.PI/180,TAU=2*Math.PI,rows=[],out={};let fail=0;const say=s=>rows.push('  '+s),chk=(ok,s,soft)=>{if(!ok&&!soft)fail=1;rows.push(`${ok?'  ok ':soft?'  ~~ ':'  !! '} ${s}`);};
/* the spring as drawn (movement.js: sspGeo; traced on the video) */
const TR=PH.TRAIN,MO=PH.MODS,FK=(TR.fu+2)*MO.fusee/40.87,FPH=TR.cp/TR.fu;
const [SSB,SSG,SPU,H,SFL,SWL,SRO,SPW,SSR]=num(/SSB=([\d.]+)\*D2R,SSG=([\d.]+)\*D2R,SMAX=SSG-SSB,SPU=([\d.]+),SSH_B=([\d.]+),SFL=([\d.]+)\*D2R,SWL=([\d.]+)\*D2R,SRO=([\d.]+)\*FK,SPW=([\d.]+)\*D2R,SSR=([\d.]+)\*FK/,'the spring\'s shape')
  .map((v,i)=>[0,1,4,5,7].includes(i)?v*D2R:[6,8].includes(i)?v*FK:v);
const SSI=num(/const SSI=\[([\d,]+)\]/,'SSI')&&/const SSI=\[([\d,]+)\]/.exec(mv)[1].split(',').map(v=>+v/100*FK);
const [rH0,aH0]=num(/SSH=\[\[([\d.]+)\*FK,SSF-([\d.]+)\*D2R\]/,'SSH');
const SMAX=SSG-SSB,[SSF]=num(/const SSF=([\d.]+)/,'SSF'),rP=SSR,rH=rH0*FK,aH=SSF-aH0*D2R,SSL=TAU-SSG,E=207e3,T0=PH.Tf;
const ssI=s=>{const x=Math.min(Math.max(s/D2R/2,0),SSI.length-1),i=Math.min(SSI.length-2,Math.floor(x));return SSI[i]+(SSI[i+1]-SSI[i])*(x-i);};   /* the inner edge s from the working tip, as relaxed */
/* the free band (between the lobes) and its mean width, for the report and the tolerances */
const W=SSF+SSB,a0=W+SWL,a1=SSF+TAU-SFL,wOf=s=>SRO-ssI(s);let wm=0,wlo=9,whi=0;for(let i=0;i<200;i++){const s=SWL+(SSL-SWL-SFL)*(i+0.5)/200,w=wOf(s);wm+=w/200;wlo=Math.min(wlo,w);whi=Math.max(whi,w);}
/* the stiffness of the band scaled (its height h, its width times kw: a maker's tolerance) and banked sb, by Castigliano along the band from pin to pin, the lobes
   included at their own width (so they bend little); for estimates.js's sweep and montecarlo.js */
const pH0=[rH*Math.cos(aH+TAU),rH*Math.sin(aH+TAU)];
const stiffOf=({h=H,kw=1,sb=SSB}={})=>{const Wq=SSF+sb,pw=[rP*Math.cos(Wq+SPW),rP*Math.sin(Wq+SPW)],Lq=[pH0[0]-pw[0],pH0[1]-pw[1]],ll=Math.hypot(...Lq),uq=[Lq[0]/ll,Lq[1]/ll],
  dq=p=>Math.abs((p[0]-pw[0])*uq[1]-(p[1]-pw[1])*uq[0]),d0=dq([0,0]),b0=Wq+SPW,b1=aH+TAU,N=3000;let j=0,hm=0,sg=0;
  for(let i=0;i<N;i++){const a=b0+(b1-b0)*(i+0.5)/N,s=a-Wq,w=wOf(s)*kw,rc=SRO-w/2,p=[rc*Math.cos(a),rc*Math.sin(a)],hh=dq(p),I=h*w**3/12;j+=hh*hh/(E*I)*rc*(b1-b0)/N;hm=Math.max(hm,hh);sg=Math.max(sg,6*hh/(h*w*w));}
  return{k:d0*d0/j/1000,d:d0,J:j,hmax:hm,sgPerF:sg};};   /* k N·m a radian; sgPerF: the band's greatest bending stress per newton at the pins, MPa */
const S0=stiffOf(),kt=S0.k,d=S0.d,P=kt*SMAX/T0;
say(`the spring as drawn (KLUwI2UUCMQ 27:26, 28:42.5-28:43.0): a band ${f(H,2)} high and ${f(wlo,2)}-${f(whi,2)} wide (radially; ${f(wm,2)} on average), free over ${f((a1-a0)/D2R)}° between its lobes (${f(SWL/D2R)}° and ${f(SFL/D2R)}°); pinned to the ratchet at r ${f(rP,2)} and to the wheel at r ${f(rH,2)}; its gap ${f(SSG/D2R,1)}° relaxed, ${f(SSB/D2R,1)}° banked`);
say(`by Castigliano, the width varying along the band: the pins' line ${f(d,2)} mm from the axis: ${f(kt,3)} N·m a radian (E ${E/1000} GPa); banked, ${f(SMAX/D2R,1)}° closed, it pushes ${f(kt*SMAX,3)} N·m, ${f(100*P)} % of the fusee's drive (${f(T0,3)} N·m)`);
chk(Math.abs(P-SPU)<0.03,`the push its section gives, ${f(P,3)} of the drive, is movement.js's SPU (${SPU}) within 0.03`);
/* weaker than the drive, so banked all the run: the fusee's pull may read 5 % under its mean (the bench's fusee test) and still close it */
chk(P<0.95,`it is weaker than the drive (Gould, Glasgow): the fusee's pull, even 5 % under its mean (the bench's fusee test), holds it banked, so in running it carries the drive through its banking and not by its bend`);
const wfw=FPH*TAU/3600,mm=s=>s==null?'beyond the hour':f(s/60,1)+' min';   /* the fusee wheel's turn a second */
out.spring={SSW:wm,wlo,whi,H,Rc:SRO-wm/2,arc:(a1-a0)/D2R,d,J:S0.J,kt,P,SPU,SSG,SSB,SMAX,T0,banked:P<1};
/* its stress banked: the pins' force T / d, the band's greatest M / Z along it */
const Tb=kt*SMAX,F=Tb*1000/d,sig=F*S0.sgPerF,Y=[1200,1800];
chk(sig<Y[0]/1.2,`bent ${f(sig)} MPa banked (the pins' force ${f(F,1)} N, the band's farthest point ${f(S0.hmax,1)} mm from their line): ${f(Y[0]/sig,1)}-${f(Y[1]/sig,1)} times short of hardened spring steel's yield`);
out.spring.sig=sig;
/* in time, the key held: the spring banked (or where the drive closes it, were it the stronger), opening as the train runs it out at the fusee wheel's turn; the swing
   follows (A² towards ampAt(drive)², TF) and the rate is the escapement's at the swing and drive (where the drive can't impulse that swing, rateAt's NaN, the last
   rate it had, as app.js keeps escK). Until the push is spent and the balance falls under AMIN, the train
   stopping (tStop, the manual's five to ten minutes); tTurn: the swing under a turn (180°); tBand: out of the manual's band */
const sim=(k,c0,tEnd,dt=0.25)=>{const TF=ESC.settings.TF,A0=ESC.ampAt(1),r0=ESC.rateAt(A0,1),tr=[];let A=A0,t=0,lost=0,rl=r0,tBand=null,tTurn=null,tStop=null;
  while(t<tEnd){const D=Math.max(0,k*(c0-wfw*t)/T0),Ae=D>0?ESC.ampAt(D):0;A=Math.sqrt(Ae*Ae+(A*A-Ae*Ae)*Math.exp(-2*dt/TF));
    if(A<ESC.AMIN){tStop=t;break;}const r=ESC.rateAt(A,D);if(Number.isFinite(r))rl=r;lost+=(rl-r0)/86400*dt;if(tBand===null&&A<247.5*D2R)tBand=t;if(tTurn===null&&A<Math.PI)tTurn=t;if(Math.round(t/dt)%Math.round(10/dt)===0)tr.push([+t.toFixed(1),+(A/D2R).toFixed(2),+D.toFixed(4),lost]);t+=dt;}
  return{tBand,tTurn,tStop,lost,trace:tr};};
const c0=k=>Math.min(T0/k,SMAX),drawn=sim(kt,c0(kt),3600),model=sim(SPU*T0/SMAX,SMAX,3600);
say(`the key held, as drawn: the swing leaves the manual's band after ${mm(drawn.tBand)}, falls under a turn after ${mm(drawn.tTurn)}, and the chronometer stops after ${mm(drawn.tStop)}; as the model runs it (SPU): ${mm(model.tBand)}, ${mm(model.tTurn)}, ${mm(model.tStop)}`);
chk(drawn.tStop!=null&&drawn.tStop>=300&&drawn.tStop<=600,`it keeps the chronometer running ${mm(drawn.tStop)}: the manual's five to ten minutes`);
/* the stiffness for five and ten minutes' running at the drawn gap, and the band's height for each (the stiffness goes as the height) */
const kFor=tm=>{let lo=0.05,hi=T0/SMAX*0.999;for(let i=0;i<40;i++){const md=Math.sqrt(lo*hi),q=sim(md,c0(md),1.3*tm,1);(q.tStop==null||q.tStop>tm)?hi=md:lo=md;}return Math.sqrt(lo*hi);};
const k10=kFor(600),k5=kFor(300);
const [rimY,rimH]=num(/mesh\(R\.gw,ring\(19\.2\*FK,18\.0\*FK,([\d.]+)\),M\.copper,0,-([\d.]+)/,'the rim').reverse(),[floorY]=num(/mesh\(R\.gw,discGeo\(18\.0\*FK,[\d.]+,\[\[0,0,2\.75\*FK\],\[\.\.\.SSH\[0\],0\.4\]\]\),M\.copper,0,-([\d.]+)/,'the floor'),recess=+(rimY+rimH/2-floorY).toFixed(3);
say(`running five to ten minutes asks ${f(k5,2)}-${f(k10,2)} N·m a radian at the drawn gap: a band ${f(H*k5/kt,2)}-${f(H*k10/kt,2)} high at the traced width (pushing ${f(100*k5*SMAX/T0)}-${f(100*k10*SMAX/T0)} % banked); the fusee wheel's recess is ${f(recess,1)} deep`);
const fits=H<=recess-0.02;
chk(fits,`the band ${H} high fits the ${f(recess,1)} mm recess, 0.02 under the rim's top`);
/* what a wind costs: the key held 30 s (a full wind from run down) and 10 s (a day's), against running on the mainspring */
const w=(k,c,s)=>sim(k,c,s).lost,w10=w(kt,c0(kt),10),w30=w(kt,c0(kt),30),w30d=w30;
say(`a wind costs ${f(w10*1e6,1)} µs held 10 s (a day's, 7 half turns) and ${f(w30*1e6,1)} µs held 30 s (from run down): the swing falls while the key turns and the rate with it, then the catch gives the drive back`);
chk(Math.abs(w30)<0.01,'a wind costs nothing a navigator could read');
out.need={k5,k10,H:[H*k5/kt,H*k10/kt],recess,fits};
out.sim={drawn,model,w10,w30,w30d};
out.fn={stiffOf,sim,c0,T0,wfw};out.rows=rows;module.exports=out;
if(require.main===module){console.log(rows.join('\n'));const jo=process.argv.indexOf('--json');if(jo>0)fs.writeFileSync(process.argv[jo+1],JSON.stringify(out));process.exitCode=fail;}
