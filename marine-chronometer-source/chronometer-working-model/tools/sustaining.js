// The sustaining spring (42016) and what it does while the key winds (Sec. IV: it "is designed to supply enough power to drive the chronometer for five to ten
// minutes"). A split ring weaker than the drive, as the period's makers had it (Gould, The Marine Chronometer, 1923, pp. 47-48, 238; Glasgow, Watch and Clock
// Making, 1885, pp. 65, 106): in running the fusee's pull closes it until its lobes nearly meet and bank (SSB), so it carries the drive through its banking; when the
// key takes the fusee it opens, pushing SPU of the 12-hour drive banked and less as it opens, to nothing at its free gap (SSG, measured). movement.js takes SPU as a
// constant; here its stiffness comes from its section: a flat band (its radial width, measured, and its height SSH_B) bent in its plane, round from its working
// end's lobe to its fixed end's (the lobes rigid, each held by one pin, so the band is loaded by a pair of equal and opposite forces along the line through the pins);
// by Castigliano the pins close along that line by (F / E I) ∫ h² ds over the band, h a point's distance from the line, so the spring's torsional stiffness is
// d² E I / ∫ h² ds (d the line's distance from the axis), and its push banked k SMAX. Then, while the key winds, the train runs on it, the fusee wheel turning at its
// rate, the spring opening and its push falling; the balance's swing follows (A² towards ampAt(drive)², TF, as app.js runs it) and the rate with it (rateAt): how long
// the swing stays over a turn (the manual's five to ten minutes, read as the time it drives the balance in a working swing: with the measured gap it runs on, at a
// falling swing, past that), how long the chronometer runs, and the seconds a wind costs. Needs only Node.js:
//   node sustaining.js [--json OUT]    (about a second; exits 1 if the section doesn't give SPU, the spring isn't weaker than the drive, it keeps the balance over a
//   turn outside five to ten minutes, or it is stressed past its steel)
const fs=require('fs'),path=require('path'),PH=require('./physics.js'),{build}=require('./escapement.js');
const ESC=build().ESC,mv=fs.readFileSync(path.join(__dirname,'..','js','movement.js'),'utf8');
const num=(re,what)=>{const m=re.exec(mv);if(!m)throw Error('not found in movement.js: '+what);return m.slice(1).map(Number);};
const f=(x,n=0)=>(+x).toFixed(n),D2R=Math.PI/180,TAU=2*Math.PI,rows=[],out={};let fail=0;const say=s=>rows.push('  '+s),chk=(ok,s,soft)=>{if(!ok&&!soft)fail=1;rows.push(`${ok?'  ok ':soft?'  ~~ ':'  !! '} ${s}`);};
/* the spring as drawn (movement.js: sspGeo; the gap measured, the height from the push, the lobes and pins estimated) */
const TR=PH.TRAIN,MO=PH.MODS,FK=(TR.fu+2)*MO.fusee/40.87,FPH=TR.cp/TR.fu;
const [SSB,SSG,SPU,H,SFL,SWL,SRO,SSW,SPW]=num(/SSB=([\d.]+)\*D2R,SSG=([\d.]+)\*D2R,SMAX=SSG-SSB,SPU=([\d.]+),SSH_B=([\d.]+),SFL=([\d.]+)\*D2R,SWL=([\d.]+)\*D2R,SRO=([\d.]+)\*FK,SSW=([\d.]+)\*FK,SPW=([\d.]+)\*D2R/,'the spring\'s shape')
  .map((v,i)=>[0,1,4,5,8].includes(i)?v*D2R:[6,7].includes(i)?v*FK:v);
const SMAX=SSG-SSB,[SSF]=num(/const SSF=([\d.]+)/,'SSF'),rP=14.6*FK,rH=15.9*FK,aH=SSF-48*D2R;
const W=SSF+SSB,a0=W+SWL,a1=SSF+TAU-SFL,Rc=SRO-SSW/2,E=207e3,I=H*SSW**3/12,EI=E*I,T0=PH.Tf;
say(`the spring as drawn: a band ${f(SSW,2)} wide (radially) and ${H} high, on r ${f(Rc,2)} (its middle), free over ${f((a1-a0)/D2R)}° between its lobes; pinned to the ratchet at r ${f(rP,2)} and to the wheel at r ${f(rH,2)}; its gap ${f(SSG/D2R)}° relaxed (measured, KLUwI2UUCMQ 27:26), ${f(SSB/D2R,1)}° banked (the width, the gap, the wall's radius and the pins measured; the lobes estimated)`);
/* the pins (the spring banked: its working end at W), the line through them, the band's points' distances from it */
const pW=[rP*Math.cos(W+SPW),rP*Math.sin(W+SPW)],pH=[rH*Math.cos(aH+TAU),rH*Math.sin(aH+TAU)],L=[pH[0]-pW[0],pH[1]-pW[1]],Ll=Math.hypot(...L),u=[L[0]/Ll,L[1]/Ll];
const dist=p=>Math.abs((p[0]-pW[0])*u[1]-(p[1]-pW[1])*u[0]),d=dist([0,0]);let J=0,hmax=0;const N=2000;
for(let i=0;i<N;i++){const a=a0+(a1-a0)*(i+0.5)/N,p=[Rc*Math.cos(a),Rc*Math.sin(a)],h=dist(p);J+=h*h*Rc*(a1-a0)/N;hmax=Math.max(hmax,h);}
const kt=d*d*EI/J/1000,P=kt*SMAX/T0;   /* N·m a radian; its push banked, of the drive */
say(`by Castigliano: the pins' line ${f(d,2)} mm from the axis, ∫h²ds ${f(J)} mm³: ${f(kt,3)} N·m a radian (E ${E/1000} GPa, I ${f(I,3)} mm⁴); banked, ${f(SMAX/D2R,1)}° closed, it pushes ${f(kt*SMAX,3)} N·m, ${f(100*P)} % of the fusee's drive (${f(T0,3)} N·m)`);
chk(Math.abs(P-SPU)<0.03,`the push its section gives, ${f(P,3)} of the drive, is movement.js's SPU (${SPU}) within 0.03`);
/* weaker than the drive, so banked all the run: the fusee's pull may read 5 % under its mean (the bench's fusee test) and still close it */
chk(P<0.95,`it is weaker than the drive (Gould, Glasgow): the fusee's pull, even 5 % under its mean (the bench's fusee test), holds it banked, so in running it carries the drive through its banking and not by its bend`);
const wfw=FPH*TAU/3600,mm=s=>s==null?'beyond the hour':f(s/60,1)+' min';   /* the fusee wheel's turn a second */
out.spring={SSW,H,Rc,arc:(a1-a0)/D2R,d,J,kt,P,SPU,SSG,SSB,SMAX,T0,banked:P<1};
/* its stress banked: the largest moment, F hmax, F the pins' force T / d */
const Tb=kt*SMAX,F=Tb*1000/d,M=F*hmax,sig=6*M/(H*SSW**2),Y=[1200,1800];
chk(sig<Y[0]/1.2,`bent ${f(sig)} MPa banked (the pins' force ${f(F,1)} N, the band's farthest point ${f(hmax,1)} mm from their line): ${f(Y[0]/sig,1)}-${f(Y[1]/sig,1)} times short of hardened spring steel's yield`);
out.spring.sig=sig;
/* in time, the key held: the spring banked (or where the drive closes it, were it the stronger), opening as the train runs it out at the fusee wheel's turn; the swing
   follows (A² towards ampAt(drive)², TF) and the rate is the escapement's at the swing and drive. Until the push is spent and the balance falls under AMIN, the train
   stopping. tTurn: the swing under a turn (180°), the manual's five to ten minutes */
const sim=(k,c0,tEnd,dt=0.25)=>{const TF=ESC.settings.TF,A0=ESC.ampAt(1),r0=ESC.rateAt(A0,1),tr=[];let A=A0,t=0,lost=0,tBand=null,tTurn=null,tStop=null;
  while(t<tEnd){const D=Math.max(0,k*(c0-wfw*t)/T0),Ae=D>0?ESC.ampAt(D):0;A=Math.sqrt(Ae*Ae+(A*A-Ae*Ae)*Math.exp(-2*dt/TF));
    if(A<ESC.AMIN){tStop=t;break;}const r=ESC.rateAt(A,D);lost+=(r-r0)/86400*dt;if(tBand===null&&A<247.5*D2R)tBand=t;if(tTurn===null&&A<Math.PI)tTurn=t;if(Math.round(t/dt)%Math.round(10/dt)===0)tr.push([+t.toFixed(1),+(A/D2R).toFixed(2),+D.toFixed(4),lost]);t+=dt;}
  return{tBand,tTurn,tStop,lost,trace:tr};};
const c0=k=>Math.min(T0/k,SMAX),drawn=sim(kt,c0(kt),3600),model=sim(SPU*T0/SMAX,SMAX,3600);
say(`the key held, as drawn: the swing leaves the manual's band after ${mm(drawn.tBand)}, falls under a turn after ${mm(drawn.tTurn)}, and the chronometer stops after ${mm(drawn.tStop)}; as the model runs it (SPU): ${mm(model.tBand)}, ${mm(model.tTurn)}, ${mm(model.tStop)}`);
chk(drawn.tTurn>=300&&drawn.tTurn<=600,`it keeps the balance over a turn ${mm(drawn.tTurn)}: the manual's five to ten minutes`);
/* the stiffness for the manual's five and ten minutes at the drawn gap, and the band's height for each (the stiffness goes as the height) */
const kFor=tm=>{let lo=0.05,hi=T0/SMAX*0.999;for(let i=0;i<40;i++){const md=Math.sqrt(lo*hi),q=sim(md,c0(md),1.3*tm,1);(q.tTurn==null||q.tTurn>tm)?hi=md:lo=md;}return Math.sqrt(lo*hi);};
const k10=kFor(600),k5=kFor(300),[recess]=num(/mesh\(R\.gw,ring\(19\.2\*FK,18\.0\*FK,([\d.]+)\)/,'the recess\'s depth');
say(`over a turn five to ten minutes asks ${f(k5,2)}-${f(k10,2)} N·m a radian at the drawn gap: a band ${f(H*k5/kt,2)}-${f(H*k10/kt,2)} high at the measured width (pushing ${f(100*k5*SMAX/T0)}-${f(100*k10*SMAX/T0)} % banked); the fusee wheel's recess is ${recess} deep`);
const fits=H*k10/kt<recess-0.1&&H<recess-0.1;
chk(fits,`the band ${H} high fits the ${recess} mm recess${H*k10/kt<recess-0.1?', and so would the ten minutes\' band':''}`);
/* what a wind costs: the key held 30 s (a full wind from run down) and 10 s (a day's), against running on the mainspring */
const w=(k,c,s)=>sim(k,c,s).lost,w10=w(kt,c0(kt),10),w30=w(kt,c0(kt),30),w30d=w30;
say(`a wind costs ${f(w10*1e6,1)} µs held 10 s (a day's, 7 half turns) and ${f(w30*1e6,1)} µs held 30 s (from run down): the swing falls while the key turns and the rate with it, then the catch gives the drive back`);
chk(Math.abs(w30)<0.01,'a wind costs nothing a navigator could read');
out.need={k5,k10,H:[H*k5/kt,H*k10/kt],recess,fits};
out.sim={drawn,model,w10,w30,w30d};
out.rows=rows;module.exports=out;
if(require.main===module){console.log(rows.join('\n'));const jo=process.argv.indexOf('--json');if(jo>0)fs.writeFileSync(process.argv[jo+1],JSON.stringify(out));process.exitCode=fail;}
