// Which mainspring does the fusee say? (PLAN-drive-and-damping.md, Task A; OPEN-QUESTIONS.md 1.) The fusee's profile is measured (the groove's floors fit r0/√(1−a·m)
// to 0.085 mm, 1.96 : 1: model README, the fusee's profile), and Hamilton cut it to even one spring's pull: so the spring it was cut for is the one the page's fusee
// rule sets up near Op. 53's "about one turn" and evens best. This takes each candidate strip mainspring.py has solved in the model's barrel (mainspring_bound.json;
// the candidates are tagged fz<t µm>r<core ×10>: 0.374, 0.394, 0.419 and 0.44 mm at L/t 2,700, on the cores r 4.9, 5.4 and 6.5) with mainspring_friction.py's
// results for it, and gives: the set-up the fusee's rule asks (where the pull falls by RHO0 over the chain's INT turns), the room to coil-bound past full wind, how
// evenly the fusee divides its torque over the 8½ turns the table covers (frictionless and at μ 0.10: (max − min)/mean, and the trend from full wind to run down),
// and the balance's swing at the model's TF (the escapement's ampAt, as the page drives it) and the TF that would swing it 255°. Needs only Node.js:
//   node drive.js [--json OUT]       under a second; prints the table (and writes it for the build-verification report)
// The drive: the escape wheel's torque against the one the escapement is calibrated at, which is the model's spring's at 12 h from full wind (app.js drvF, R.fs.torque);
// a candidate's is its fusee wheel's torque against that (the chain's lever the model's: the fusee is the same), both running at μ 0.10 (the coils' friction taken off,
// so the model's own spring is 1 at 12 h either way). Its absolute torque is the solved energy's slope (mainspring_friction.json's rows, EI/2 times the bending energy's
// slope a radian), smoothed by a quartic from half a turn past slack as mainspring.py smooths it. TF for 255°: the loss a swing, πA²/Q with Q = πTF/T, equal to the work
// the escapement nets it, ESC.wn(s, A); so TF scales as wn(1, A) / wn(s, A) from the model's.
const fs=require('fs'),path=require('path'),T=__dirname,D=180/Math.PI;
const ESC=require('./escapement.js').build().ESC,TF0=ESC.settings.TF,A255=255/D,LO=247.5,HI=270;
const rd=f=>JSON.parse(fs.readFileSync(path.join(T,f),'utf8')),B=rd('mainspring_bound.json'),N12=12*8.75/56.25;   // the fusee's turns from full wind at 12 h (movement.js FUSEE_PER_HOUR)
const interp=(x,X,Y)=>{if(x<=X[0])return Y[0];for(let i=1;i<X.length;i++)if(x<=X[i]){const f=(x-X[i-1])/(X[i]-X[i-1]);return Y[i-1]+f*(Y[i]-Y[i-1]);}return Y[Y.length-1];};
function polyfit(x,y,n){const m=x.reduce((a,b)=>a+b,0)/x.length,A=[],b=[];for(let i=0;i<=n;i++){A.push(new Array(n+1).fill(0));b.push(0);}
  for(let k=0;k<x.length;k++){const p=[];for(let i=0;i<=n;i++)p.push((x[k]-m)**i);for(let i=0;i<=n;i++){b[i]+=p[i]*y[k];for(let j=0;j<=n;j++)A[i][j]+=p[i]*p[j];}}
  for(let i=0;i<=n;i++){let r=i;for(let j=i+1;j<=n;j++)if(Math.abs(A[j][i])>Math.abs(A[r][i]))r=j;[A[i],A[r]]=[A[r],A[i]];[b[i],b[r]]=[b[r],b[i]];
    for(let j=i+1;j<=n;j++){const f=A[j][i]/A[i][i];for(let k=i;k<=n;k++)A[j][k]-=f*A[i][k];b[j]-=f*b[i];}}
  const c=new Array(n+1).fill(0);for(let i=n;i>=0;i--){let s=b[i];for(let j=i+1;j<=n;j++)s-=A[i][j]*c[j];c[i]=s/A[i][i];}return t=>c.reduce((s,ci,i)=>s+ci*(t-m)**i,0);}
function load(k){
  const f=k==='model'?'mainspring_friction.json':`mainspring_friction_${k}.json`;if(!fs.existsSync(path.join(T,f)))return null;
  const J=rd(f),S=J.summary,rows=J.rows.filter(r=>r.T>=S.T0+0.5),M=polyfit(rows.map(r=>r.T),rows.map(r=>r.M0),4);   // N·m, frictionless
  const fr=S.fusee.frictionless,run=S.fusee.running['0.1'],n=fr.map(x=>x[0]);
  return{k,S,M,n,f0:fr.map(x=>x[2]),f1:run.map(x=>x[2]),Mup:M(S.Tup)};}
/* the fusee's rule (mainspring_friction.py's setup(), movement.js below makeFusee) on a spring's pull table, at the taper RHO0 times k: the set-up from slack. The taper's
   uncertainty: the profile's floors to 0.085 mm rms give the ratio of the chain's levers to ±1.4 % (a bootstrap of the fit), and the floors' turns placed a quarter
   turn either way along the cone ±4 % (r0/√(1−a·m) extrapolated over the last turn and a quarter, where it climbs steeply): ±3 % taken */
const MFP=fs.readFileSync(path.join(T,'mainspring_friction.py'),'utf8'),[TUP,TDOWN]=/TUP,TDOWN=([\d.]+),([\d.]+)/.exec(MFP).slice(1).map(Number),[INT,RHO0]=/INT,IN,RHO0=([\d.]+),TUP-TDOWN,([\d.]+)/.exec(MFP).slice(1).map(Number),IN=TUP-TDOWN,RK=0.03;
const shape=k=>JSON.parse(/const MSHAPE=(\{.*?\});/.exec(fs.readFileSync(k==='model'?path.join(T,'..','js','mainspring.js'):path.join(T,`mainspring_${k}.js`),'utf8'))[1]);
function setupAt(k,kr){const d=shape(k),pl=T=>interp(T,d.T,d.pull);const b0=d.T[d.T.length-1]-IN;let a=d.T0,b=b0;if(b<=a)return NaN;
  for(let i=0;i<40;i++){const m=(a+b)/2;if(pl(m)/pl(m+INT)<RHO0*kr)a=m;else b=m;}return b0-a<1e-3?Infinity:a+INT-IN-d.T0;}   // run down at the set-up: fully wound INT on from where the rule holds, the whole wind IN; Infinity: the table (to coil-bound) ends first
const sv=x=>x===Infinity?'bound':+x.toFixed(2);   // 'bound': the rule asks more than the spring has before it is coil-bound
const lin=(x,y)=>{const mx=x.reduce((a,b)=>a+b)/x.length,my=y.reduce((a,b)=>a+b)/y.length;let sxy=0,sxx=0;for(let i=0;i<x.length;i++){sxy+=(x[i]-mx)*(y[i]-my);sxx+=(x[i]-mx)**2;}return sxy/sxx;};
const ev=q=>(Math.max(...q)-Math.min(...q))/(q.reduce((a,b)=>a+b)/q.length),mean=q=>q.reduce((a,b)=>a+b)/q.length;
const M0=load('model'),ref=M0.Mup*interp(N12,M0.n,M0.f1);   // the model's fusee torque running at 12 h, in units of its full-wind lever (the chain's lever cancels)
const wn1=ESC.wn(1,A255),tfFor=s=>TF0*wn1/ESC.wn(s,A255);
function row(k){
  const C=load(k);if(!C){if(!fs.existsSync(path.join(T,`mainspring_${k}.js`)))return null;const b=B[k],T0=shape(k).T0;   // solved, but too short of turns for the fusee's rule to set it up (mainspring_friction.py has nothing to run)
    return{key:k,tilt:b.tilt||0,E:b.E,t:b.t,L:b.L,ra:b.ra,gap:b.gap,T0,bound:b.bound,span:+(b.bound-T0).toFixed(2),short:true};}const S=C.S,b=B[k],s=C.f1.map(q=>C.Mup*q/ref),s12=C.Mup*interp(N12,C.n,C.f1)/ref;
  const A=s.map(x=>ESC.ampAt(x)*D),out=A.filter(a=>a<LO||a>HI).length/A.length;
  const tf=tfFor(s12),Asc=s.map(x=>{const a=ESC.ampAt(x)*D;return a;});   // at the model's TF
  return{key:k,tilt:b.tilt||0,E:b.E,t:b.t,L:b.L,ra:b.ra,gap:b.gap,T0:S.T0,setup:setupAt(k,1)===Infinity?null:+(S.Tdown-S.T0).toFixed(2),setupLo:sv(setupAt(k,1-RK)),setupHi:sv(setupAt(k,1+RK)),Tup:S.Tup,Tdown:S.Tdown,bound:b.bound,room:+(b.bound-S.Tup).toFixed(2),
    Mup:+C.Mup.toFixed(3),even0:+ev(C.f0).toFixed(4),even1:+ev(C.f1).toFixed(4),trend0:+(lin(C.n,C.f0)*(C.n[C.n.length-1]-C.n[0])/mean(C.f0)).toFixed(4),trend1:+(lin(C.n,C.f1)*(C.n[C.n.length-1]-C.n[0])/mean(C.f1)).toFixed(4),
    s12:+s12.toFixed(4),A12:+(ESC.ampAt(s12)*D).toFixed(1),Amin:+Math.min(...A).toFixed(1),Amax:+Math.max(...A).toFixed(1),out:+out.toFixed(3),TF255:+tf.toFixed(1),
    swing:C.n.map((n,i)=>[n,+A[i].toFixed(1)]),drive:C.n.map((n,i)=>[n,+s[i].toFixed(4)]),f0:C.n.map((n,i)=>[n,C.f0[i]]),f1:C.n.map((n,i)=>[n,C.f1[i]])};}
const fz=k=>/^fz\d+r\d+(t[pm]\d+)?$/.test(k),keys=['model',...Object.keys(B).filter(fz).sort(),...Object.keys(B).filter(k=>k!=='model'&&!fz(k)).sort()],rows=keys.map(row).filter(Boolean);
const p=(x,w,n=2)=>(typeof x==='number'?x.toFixed(n):String(x)).padStart(w);
console.log(`the model's TF ${TF0} s; the drive 1 = the model's spring running at 12 h from full wind (μ 0.10); the manual's swing ${LO}-${HI}°`);
console.log('  strip    L    core   slack  set-up (taper ±3 %)  full   bound  room   M up   even (0, 0.10)   trend (0, 0.10)   swing at TF '+TF0+' (12 h; range; out)   TF for 255°');
for(const r of rows)if(r.short)console.log(`${p(r.key,9)} ${p(r.t,5,3)} ${p(r.L,5,0)} ${p(r.ra,4,1)}  ${p(r.T0,6)}   can't be wound: coil-bound at ${r.bound}, ${r.span} turns from slack, against the fusee's ${IN.toFixed(2)} and a set-up`);else if(r.setup===null)console.log(`${p(r.key,9)} ${p(r.t,5,3)} ${p(r.L,5,0)} ${p(r.ra,4,1)}  ${p(r.T0,6)}   can't be set up: its pull falls by the fusee's taper only past coil-bound (${r.bound})${typeof r.setupLo==='number'?`; with the taper 3 % less, ${r.setupLo}`:''}`);else console.log(`${p(r.key,9)} ${p(r.t,5,3)} ${p(r.L,5,0)} ${p(r.ra,4,1)}  ${p(r.T0,6)} ${p(r.setup??'bound',6)} (${r.setupLo}-${r.setupHi})  ${p(r.Tup,6)} ${p(r.bound,6)} ${p(r.room,5)}  ${p(r.Mup,5,3)}  ${p(100*r.even0,5,1)} % ${p(100*r.even1,5,1)} %   ${p(100*r.trend0,6,1)} % ${p(100*r.trend1,6,1)} %   ${p(r.A12,5,0)}° (${r.Amin.toFixed(0)}-${r.Amax.toFixed(0)}; ${(100*r.out).toFixed(0)} %)   ${p(r.TF255,6,0)} s${r.room<0?'   !! coil-bound before full wind':''}`);
/* the other way round: the drive (times the calibrated torque) that swings the balance 255 deg at a given TF, πA²/Q = wn(s, A); and the spring's torque fully wound as
   TF's calibration took it (14 October 2026: the linear strip's E b t³ / 12 L a turn over the fusee's taper, physics.js's MupL; physics.js has taken the solved spring's since
   16 October 2026) against the solved spring's (the energy's slope) */
const sFor=(TF,A=A255)=>{const Q=Math.PI*TF/0.5;let lo=0.05,hi=4;for(let i=0;i<60;i++){const m=(lo+hi)/2;ESC.wn(m,A)*Q<Math.PI*A*A?lo=m:hi=m;}return lo;};
const need=[52,68,80,100,120,133,160,200,260,320].map(TF=>[TF,+sFor(TF).toFixed(3)]),P=require('./physics.js'),Mph=P.MupL;
console.log(`the drive that swings the balance 255°: `+need.map(([TF,x])=>`TF ${TF} s ${x}`).join(', '));
console.log(`the model's spring fully wound: ${Mph.toFixed(3)} N·m as TF's calibration took it (the linear strip's; physics.js has used the solved spring since 16 October 2026), ${M0.Mup.toFixed(3)} solved (${(100*(M0.Mup/Mph-1)).toFixed(0)} % more; at its slack the formula's linear spring would want a set-up of about ${(P.IN/(1/RHO0-1)).toFixed(1)} turns)`);
const i=process.argv.indexOf('--json');if(i>0){fs.writeFileSync(process.argv[i+1],JSON.stringify({TF:TF0,N12,band:[LO,HI],RK,need,Mph,Msolved:M0.Mup,rows}));console.log('wrote',process.argv[i+1]);}
module.exports={rows,tfFor};
