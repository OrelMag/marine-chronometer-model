// The 6MX's swing read off moMvyx8eXfo (wempe_swing.py, wempe_swing.json's A_t) fitted with the Wempe's balance equation, for its free run-down TF (the balance's damping;
// References/wempe/VIDEOS.md, "Measured"), as startup.js does for the Hamilton. Needs only Node.js and wempe_swing.json, so it runs without the video:
//   node wempe_startup.js [--json OUT]     (about 2 minutes: the escapement's work tabulated, then the fits; it reports, never fails; --json tools/wempe_startup.json
//                                           writes what wempe_escapement.js compares the model's TF with)
// What the video shows (17:53-19:50): the movement held on its edge in the hand until 17:52 (the balance's staff level: its swing falls there), then set down dial side
// down; its swing rises from 110 to 137 deg over 50 s (on its edge again for 3 s at 18:14-18:17, a hand by it at 18:35-18:37 moving it 10 deg on the table); at
// 18:46-18:49 the movement is turned to and fro in the hands (the 6MX's start, "a light turn of the chronometer about the hands' axis": the 1954 instruction, п. 7),
// which throws the swing to 185 deg, and from 18:50 to 19:48 it falls back, 185 to 157 deg (a pair of tweezers pointed at the balance at 19:13-19:20, not touching:
// the fall runs on through it). No winding is seen: the drive is taken as one throughout. Each stretch is a relaxation toward the one swing that drive keeps.
// The law: the balance's equation averaged over a swing (makeEsc's, model README "The balance's dynamics"): in half the swing squared (units of the hairspring's k) a
// period gains the escapement's work Wn(s, A) and loses pi A^2 / Q, Q = pi TF / T, so d(A^2)/dt = 2 Wn(s, A)/T - 2 A^2/TF; Wn from the Wempe's makeEsc (WESC.SET:
// the impulse, the strike, the detent and gold spring's work), the drive s (times the model's at 12 h) free. The damping split as wempe_escapement.js's parts give it (air 0.57, its share growing with
// the swing; the endstone 0.06, falling; the spring 0.37), so TF is the run-down at the model's swing, the model's TF; then viscous (TF at the 6MX's own swing, about
// 150 deg), and with the work held flat too (Wn independent of A: the plain A^2 law). Each stretch starts free; TF and s are fitted on all of them together (the
// steady swing the drive keeps follows).
const fs=require('fs'),path=require('path'),W=require('./wempe_load.js')(),E=W.WPHYS.ESC,S=W.WPHYS.SET,D=Math.PI/180,T=0.5,f=(x,n=0)=>Number.isFinite(x)?x.toFixed(n):'-';
const J=JSON.parse(fs.readFileSync(path.join(__dirname,'wempe_swing.json'),'utf8')).moMvyx8eXfo,P=J.A_t.map(r=>[r[0],r[1]]);
const SEG={'set down (17:55-18:10)':[1073,1092],'after its edge (18:20-18:32)':[1098,1114],'moved on the table (18:41-18:44)':[1119,1126],'after the twist (18:52-19:48)':[1130,1190]};
const mk=(kPost=1)=>Object.entries(SEG).map(([k,[a,b]])=>({k,p:P.filter(r=>r[0]>=a&&r[0]<=b).map(r=>[r[0],r[0]>=1130?r[1]*kPost:r[1]])})).filter(s=>s.p.length>1);
let segs=mk();
/* Wn(s, A) tabulated (makeEsc solves each impulse, a few ms a call): s 0.2-2.5 by 0.05, A 60-330 deg by 2, bilinear between; NaN where makeEsc gives no impulse
   (a weak drive at a large swing: the jewel gone before the tooth reaches it), and a fit that passes there is no fit (until 27 October 2026 it counted as no work,
   a free run-down, and the fit took it: the drive 0.45, TF 332 s, the 6MX coasting without an impulse from 185 to 157 deg) */
const SG=[...Array(47)].map((_,i)=>0.2+0.05*i),AG=[...Array(136)].map((_,i)=>60+2*i),TB=SG.map(s=>AG.map(a=>{const v=E.wn(s,a*D);return Number.isFinite(v)?v:NaN;}));
const wn=(s,a)=>{const x=Math.min(SG.length-1.001,Math.max(0,(s-0.2)/0.05)),y=Math.min(AG.length-1.001,Math.max(0,(a/D-60)/2)),i=Math.floor(x),j=Math.floor(y),u=x-i,v=y-j;
  return (TB[i][j]*(1-v)+TB[i][j+1]*v)*(1-u)+(TB[i+1][j]*(1-v)+TB[i+1][j+1]*v)*u;};
/* the damping's dependence on the swing: viscous (a constant TF), or split as wempe_escapement.js's parts give it at the model's swing A0 (the air's pressure drag, its loss
   over the energy growing as A; the endstone's constant friction, falling as 1/A; the spring's own, constant: SPL), TF then the run-down at A0, the model's own TF's meaning */
const A0m=E.A,SPL=[0.57,0.06,0.37],fac=(kind,a)=>kind==='split'?SPL[0]*a/A0m+SPL[1]*A0m/a+SPL[2]:1;
/* A(t) from A0 over the stretch's times: RK4 on u = A^2 (radians), 0.1 s steps */
const run=(kind,work,TF,A0,ts)=>{let u=(A0*D)**2,t=ts[0];const out=[];const g=x=>{const a=Math.sqrt(Math.max(x,1e-9));return 2*work(a)/T-2*x*fac(kind,a)/TF;};
  for(const tt of ts){while(t<tt-1e-9){const h=Math.min(0.1,tt-t),k1=g(u),k2=g(u+h/2*k1),k3=g(u+h/2*k2),k4=g(u+h*k3);u+=h/6*(k1+2*k2+2*k3+k4);t+=h;}out.push(Math.sqrt(Math.max(u,0))/D);}return out;};
const gold=(c,lo,hi,n=25)=>{for(let i=0;i<n;i++){const m1=lo+(hi-lo)*0.382,m2=lo+(hi-lo)*0.618;c(m1)<c(m2)?hi=m2:lo=m1;}return(lo+hi)/2;};
/* each stretch's best start (within 25 deg of its first reading), the residuals' sum of squares */
const sse=(kind,work,TF,sg)=>{const ts=sg.p.map(r=>r[0]),y=sg.p.map(r=>r[1]),c=a0=>{const e=run(kind,work,TF,a0,ts).reduce((q,v,i)=>q+(v-y[i])**2,0);return Number.isFinite(e)?e:Infinity;},a0=gold(c,y[0]-25,y[0]+25);return{e:c(a0),a0};};
const tot=(kind,work,TF,use)=>segs.filter(s=>use.includes(s.k)).reduce((q,s)=>q+sse(kind,work,TF,s).e,0);
const ainf=(kind,work,TF)=>{let lo=20*D,hi=400*D;const g=a=>work(a)-a*a*T*fac(kind,a)/TF;if(g(lo)<=0)return NaN;for(let i=0;i<60;i++){const m=(lo+hi)/2;g(m)>0?lo=m:hi=m;}return lo/D;};
const n=k=>segs.filter(s=>k.includes(s.k)).reduce((q,s)=>q+s.p.length,0),ALL=segs.map(s=>s.k);
const workOf=(kind,x,TF)=>kind==='flat'?a=>(x*D)**2*T/TF:a=>wn(x,a);   /* flat: the work that keeps x deg at that TF */
function best(kind,use){   /* the profile over TF (geometric, 20-600 s): at each, the drive (s 0.2-2.4) or, flat, the steady swing (60-330 deg) by golden section */
  const prof=[];for(let TF=20;TF<=600;TF*=1.03){const c=x=>tot(kind,workOf(kind,x,TF),TF,use),x=kind==='flat'?gold(c,60,330):gold(c,0.2,2.4);prof.push({TF,x,e:c(x)});}
  const b=prof.reduce((a,q)=>q.e<a.e?q:a),work=workOf(kind,b.x,b.TF),rms=Math.sqrt(b.e/n(use));
  /* TF's range: where the profile stays within the residuals' scatter (one parameter's 1 sigma: e <= e_min (1 + 1/(N - p)), p the starts, TF and the drive) */
  const lim=b.e*(1+1/Math.max(1,n(use)-2-use.length)),rg=prof.filter(q=>q.e<=lim).map(q=>q.TF);
  return{...b,rms,Ainf:kind==='flat'?b.x:ainf(kind,work,b.TF),rg:[Math.min(...rg),Math.max(...rg)],edge:b.TF*1.03>600||b.TF===20,starts:segs.filter(s=>use.includes(s.k)).map(s=>sse(kind,work,b.TF,s).a0)};}
console.log(`  the 6MX's swing (wempe_swing.py, moMvyx8eXfo): ${P.length} readings, ${segs.map(s=>`${s.k}: ${s.p.length}, ${f(s.p[0][1])} to ${f(s.p[s.p.length-1][1])} deg`).join('; ')}`);
console.log(`  the Wempe's escapement work (makeEsc, WESC.SET): it keeps ${f(A0m/D,1)} deg at its drive at 12 h and its TF ${S.TF} s`);
const out={},LAB={split:`the Wempe's escapement work, the damping split (TF at its swing, ${f(A0m/D)} deg)`,model:'the Wempe\'s escapement work, the damping viscous',flat:'the work flat, the damping viscous (the plain A^2 law)'};
for(const kind of['split','model','flat']){const r=best(kind,ALL);out[kind]={TF:+r.TF.toFixed(1),range:r.rg.map(v=>+v.toFixed(0)),[kind==='flat'?'steady':'drive']:+r.x.toFixed(3),Ainf:+r.Ainf.toFixed(1),rms:+r.rms.toFixed(2),starts:r.starts.map(v=>+v.toFixed(1))};
  console.log(`  ${LAB[kind]}: TF ${f(r.TF)} s (${f(r.rg[0])}-${f(r.rg[1])} within the scatter${r.edge?', at the grid edge':''}), ${kind==='flat'?'':`the drive ${f(r.x,2)} of the model's `}keeping ${f(r.Ainf,1)} deg, rms ${f(r.rms,2)} deg; starts ${r.starts.map(a=>f(a,1)).join(', ')}`);}
/* the stretches' scale against each other: the ellipse and the staff's image are fitted anew in each (wempe_swing.py), so the twist's stretch is read again 3 % low
   and 3 % high against the rest (the view's perspective, a few percent) */
for(const kind of['split','model']){const r0=[];for(const k of[0.97,1.03]){segs=mk(k);const r=best(kind,ALL);r0.push(r.TF);console.log(`    ${kind}: the twist's stretch read x${k}: TF ${f(r.TF)} s, keeping ${f(r.Ainf,1)} deg`);}segs=mk();
  out[kind].scaled=r0.map(v=>+v.toFixed(1));out[kind].span=[+Math.min(...r0,out[kind].range[0]).toFixed(0),+Math.max(...r0,out[kind].range[1]).toFixed(0)];}
console.log(`  TF at the model's swing (split): ${f(out.split.TF)} s, ${out.split.span[0]}-${out.split.span[1]} s with the stretches' relative scale ±3 %; at the 6MX's own (viscous): ${f(out.model.TF)} s, ${out.model.span[0]}-${out.model.span[1]}; the work held flat ${f(out.flat.TF)} s`);
/* each stretch alone (the flat law: TF and its steady swing free), to see whether they agree */
for(const s of segs.filter(s=>s.p.length>=5)){const r=best('flat',[s.k]);console.log(`    ${s.k} alone (flat law): TF ${f(r.TF)} s (${f(r.rg[0])}-${f(r.rg[1])}), toward ${f(r.Ainf)} deg, rms ${f(r.rms,2)}`);out[`alone: ${s.k}`]={TF:+r.TF.toFixed(1),range:r.rg.map(v=>+v.toFixed(0)),Ainf:+r.Ainf.toFixed(1)};}
/* what TF the measured steady swing would need at the model's drive at 12 h */
const Am=out.split.Ainf,tfAt=(s,a)=>{const w=wn(s,a*D);return w>0?(a*D)**2*T*fac('split',a*D)/w:NaN;};
console.log(`  at the model's drive (12 h) the measured steady swing ${f(Am,1)} deg would want TF ${f(tfAt(1,Am))} s (split); the 1954 instruction's 225 deg ${f(tfAt(1,225))} s; the model's TF ${S.TF} s keeps ${f(A0m/D,1)} deg`);
out.tf_at_model_drive={A:Am,TF:+tfAt(1,Am).toFixed(1)};out.split_shares=SPL;out.A0=+(A0m/D).toFixed(1);
if(process.argv.includes('--json'))fs.writeFileSync(process.argv[process.argv.indexOf('--json')+1],JSON.stringify(out,null,1)+'\n');
