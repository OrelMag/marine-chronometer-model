// The sustaining spring (42016) and what it does while the key winds (Sec. IV: it "is designed to supply enough power to drive the chronometer for five to ten
// minutes"). The model takes it as linear, carrying the whole drive loaded and pushing with 1 - d / SMAX of it as it relaxes by d, SMAX the fusee wheel's turn in
// ten minutes (movement.js), so the ten minutes hold by construction. Here its stiffness comes from its section instead: a flat band (its radial width and its
// height) bent in its plane, round from its working end's lobe to its fixed end's (the lobes rigid, each held by one pin, so the band is loaded by a pair of equal
// and opposite forces along the line through the pins); by Castigliano the pins close along that line by (F / E I) ∫ h² ds over the band, h a point's distance from
// the line, so the spring's torsional stiffness is d² E I / ∫ h² ds (d the line's distance from the axis). Then, while the key winds, the train runs on it, the
// fusee wheel turning at its rate, the spring relaxing and its push falling; the balance's swing follows (A² towards ampAt(drive)², TF, as app.js runs it) and the
// rate with it (rateAt): how long the swing stays in the manual's 1⅜-1½ turns, how long the chronometer runs, and the seconds a wind costs. Needs only Node.js:
//   node sustaining.js [--json OUT]    (about a second; exits 1 if the spring as drawn can't drive the train for five minutes, or is stressed past its steel)
const fs=require('fs'),path=require('path'),PH=require('./physics.js'),{build}=require('./escapement.js');
const ESC=build().ESC,mv=fs.readFileSync(path.join(__dirname,'..','js','movement.js'),'utf8');
const num=(re,what)=>{const m=re.exec(mv);if(!m)throw Error('not found in movement.js: '+what);return m.slice(1).map(Number);};
const f=(x,n=0)=>(+x).toFixed(n),D2R=Math.PI/180,TAU=2*Math.PI,rows=[],out={};let fail=0;const say=s=>rows.push('  '+s),chk=(ok,s,soft)=>{if(!ok&&!soft)fail=1;rows.push(`${ok?'  ok ':soft?'  ~~ ':'  !! '} ${s}`);};
/* the spring as drawn (movement.js: sspGeo, the band's thickness in the fusee's axis 1.13 and its gap, lobes and pins estimated there) */
const TR=PH.TRAIN,MO=PH.MODS,FK=(TR.fu+2)*MO.fusee/40.87,FPH=TR.cp/TR.fu,SMAX=FPH*TAU/6;
const [SSG,SFL,SWL,SRO,SSW,SPW]=num(/SSG=([\d.]+)\*D2R,SFL=([\d.]+)\*D2R,SWL=([\d.]+)\*D2R,SRO=([\d.]+)\*FK,SSW=([\d.]+)\*FK,SPW=([\d.]+)\*D2R/,'the spring\'s shape').map((v,i)=>[0,1,2,5].includes(i)?v*D2R:v*FK);
const [SSF]=num(/const SSF=([\d.]+)/,'SSF'),[H]=num(/return polyGeo\(\[\.\.\.o,\.\.\.I\.reverse\(\)\],([\d.]+),/,'the band\'s height'),rP=14.6*FK,rH=15.9*FK,aH=SSF-48*D2R;
const W=SSF+SSG-SMAX,a0=W+SWL,a1=SSF+TAU-SFL,Rc=SRO-SSW/2,E=207e3,I=H*SSW**3/12,EI=E*I;
say(`the spring as drawn: a band ${f(SSW,2)} wide (radially) and ${H} high, on r ${f(Rc,2)} (its middle), free over ${f((a1-a0)/D2R)}° between its lobes; pinned to the ratchet at r ${f(rP,2)} and to the wheel at r ${f(rH,2)}; its gap ${f(SSG/D2R)}° relaxed (the width, the wall's radius and the pins measured on KLUwI2UUCMQ 27:26; the height, gap and lobes estimated)`);
/* the pins (the spring loaded: its working end at W), the line through them, the band's points' distances from it */
const pW=[rP*Math.cos(W+SPW),rP*Math.sin(W+SPW)],pH=[rH*Math.cos(aH+TAU),rH*Math.sin(aH+TAU)],L=[pH[0]-pW[0],pH[1]-pW[1]],Ll=Math.hypot(...L),u=[L[0]/Ll,L[1]/Ll];
const dist=p=>Math.abs((p[0]-pW[0])*u[1]-(p[1]-pW[1])*u[0]),d=dist([0,0]);let J=0,hmax=0;const N=2000;
for(let i=0;i<N;i++){const a=a0+(a1-a0)*(i+0.5)/N,p=[Rc*Math.cos(a),Rc*Math.sin(a)],h=dist(p);J+=h*h*Rc*(a1-a0)/N;hmax=Math.max(hmax,h);}
const kt=d*d*EI/J/1000,Tlo=kt*SMAX,T0=PH.Tf;   /* N·m a radian; the torque it gives closed by SMAX */
say(`by Castigliano: the pins' line ${f(d,2)} mm from the axis, ∫h²ds ${f(J)} mm³: ${f(kt,3)} N·m a radian (E ${E/1000} GPa, I ${f(I,3)} mm⁴)`);
const dLoad=T0/kt,wfw=FPH*TAU/3600;   /* how far the drive closes it; the fusee wheel's turn a second */
const solid=dLoad>=SSG;
say(`the fusee's drive (${f(T0,3)} N·m) would close it ${f(dLoad/D2R,1)}°, ${solid?`more than its ${f(SSG/D2R)}° gap: it runs closed solid, pushing only ${f(kt*SSG,3)} N·m (${f(100*kt*SSG/T0)} % of the drive) once the key takes the fusee`:`within its ${f(SSG/D2R)}° gap`} (the model takes ${f(SMAX/D2R,1)}°: the fusee wheel's turn in ten minutes, at ${f(FPH*360/60,3)}° a minute)`);
out.spring={SSW,H,Rc,arc:(a1-a0)/D2R,d,J,kt,dLoad,solid,SSG,SMAX,T0,model:T0/SMAX};
/* its stress at the drive: the largest moment, F hmax, F the pins' force T / d (closed solid, the bending stops at the gap's) */
const Tb=Math.min(T0,kt*SSG),F=Tb*1000/d,M=F*hmax,sig=6*M/(H*SSW**2),Y=[1200,1800];
say(`bent ${f(sig)} MPa ${solid?'closed solid':'at the drive'} (the pins' force ${f(F,1)} N, the band's farthest point ${f(hmax,1)} mm from their line): ${f(Y[0]/sig,1)}-${f(Y[1]/sig,1)} times short of hardened spring steel's yield`);
out.spring.sig=sig;
/* in time, the key held: the spring closed by c0 in running (the drive's, or its gap's if that closes first), opening as the train runs it out at the fusee wheel's
   turn; the swing follows (A² towards ampAt(drive)², TF) and the rate is the escapement's at the swing and drive. Until the push is spent and the balance falls under
   AMIN, the train stopping */
const sim=(k,c0,tEnd)=>{const TF=ESC.settings.TF,dt=0.25,A0=ESC.ampAt(1),r0=ESC.rateAt(A0,1),tr=[];let A=A0,t=0,lost=0,tBand=null,tStop=null;
  while(t<tEnd){const D=Math.max(0,k*(c0-wfw*t)/T0),Ae=D>0?ESC.ampAt(D):0;A=Math.sqrt(Ae*Ae+(A*A-Ae*Ae)*Math.exp(-2*dt/TF));
    if(A<ESC.AMIN){tStop=t;break;}const r=ESC.rateAt(A,D);lost+=(r-r0)/86400*dt;if(tBand===null&&A<247.5*D2R)tBand=t;if(Math.round(t/dt)%40===0)tr.push([+t.toFixed(1),+(A/D2R).toFixed(2),+D.toFixed(4),lost]);t+=dt;}
  return{tBand,tStop,lost,trace:tr};};
const mm=s=>s==null?'beyond the hour':f(s/60,1)+' min',drawn=sim(kt,Math.min(dLoad,SSG),3600),model=sim(T0/SMAX,SMAX,3600);
say(`the key held, as drawn: the swing leaves the manual's band after ${mm(drawn.tBand)}, the chronometer stops after ${mm(drawn.tStop)}; the model's spring (linear, ten minutes): ${mm(model.tBand)} and ${mm(model.tStop)}`);
/* the stiffness the manual's five to ten minutes ask, the gap left open under the drive: k for a stop at 5 and at 10 minutes, and the band's height for it at the
   measured width (the stiffness goes as the height) or its width at the drawn height (as the width cubed) */
const kFor=tm=>{let lo=T0/SSG*1.0001,hi=50;for(let i=0;i<60;i++){const md=Math.sqrt(lo*hi),q=sim(md,T0/md,4000);(q.tStop==null||q.tStop>tm)?lo=md:hi=md;}return Math.sqrt(lo*hi);};
const k10=kFor(600),k5=kFor(300),[recess]=num(/mesh\(R\.gw,ring\(19\.2\*FK,18\.0\*FK,([\d.]+)\)/,'the recess\'s depth');
say(`the manual's "five to ten minutes" asks ${f(k10,2)}-${f(k5,2)} N·m a radian (its gap then closes ${f(T0/k5/D2R,1)}-${f(T0/k10/D2R,1)}° under the drive): at the measured width, a band ${f(H*k10/kt,2)}-${f(H*k5/kt,2)} high; at the drawn height, ${f(SSW*Math.cbrt(k10/kt),2)}-${f(SSW*Math.cbrt(k5/kt),2)} wide. The fusee wheel's recess is ${recess} deep`);
const fits=H*k10/kt<recess-0.1;
chk(!solid&&drawn.tStop>=300&&drawn.tStop<=900,`the spring as drawn ${solid?`runs closed solid and pushes ${f(100*kt*SSG/T0)} % of the drive when the key takes the fusee: its section (the height 1.13), gap and lobes are estimates, and as estimated they are too soft by ${f(k10/kt,1)}-${f(k5/kt,1)} times`:`drives the train ${mm(drawn.tStop)}`}. ${fits?'A band high enough fits the recess':`A band high enough wouldn't fit the ${recess} mm recess at the measured width, so the gap, the lobes or the pins must differ from the estimates: OPEN-QUESTIONS.md`}`,true);
chk(model.tStop>=300&&model.tStop<=660,`the model's own spring (it pushes the whole drive loaded and nothing ten minutes on) drives the train ${mm(model.tStop)}, the manual's five to ten`);
/* what a wind costs: the key held 30 s (a full wind from run down) and 10 s (a day's), against running on the mainspring */
const w=(k,c0,s)=>sim(k,c0,s).lost,w10=w(T0/SMAX,SMAX,10),w30=w(T0/SMAX,SMAX,30),w30d=w(kt,Math.min(dLoad,SSG),30);
say(`a wind costs ${f(w10*1e6,1)} µs held 10 s (a day's, 7 half turns) and ${f(w30*1e6,1)} µs held 30 s (from run down) on the model's spring; as drawn ${f(w30d*1e6,1)} µs: the swing falls while the key turns and the rate with it, then the catch gives the drive back`);
chk(Math.abs(w30)<0.01&&Math.abs(w30d)<0.05,'a wind costs nothing a navigator could read');
out.need={k5,k10,H:[H*k10/kt,H*k5/kt],W:[SSW*Math.cbrt(k10/kt),SSW*Math.cbrt(k5/kt)],recess,fits};
out.sim={drawn,model,w10,w30,w30d};
out.rows=rows;module.exports=out;
if(require.main===module){console.log(rows.join('\n'));const jo=process.argv.indexOf('--json');if(jo>0)fs.writeFileSync(process.argv[jo+1],JSON.stringify(out));process.exitCode=fail;}
