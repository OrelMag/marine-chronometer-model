// The Wempe's maintaining spring (Gegenfeder 05 06 01-1) and what it does while the key winds, as tools/sustaining.js for the Hamilton's: its stiffness from its drawn
// section, how far the drive closes it and where it would bank, its push, its stress, and the train run on it while the key is held. The ring as fusee.js draws it (its outline traced on 05 06 01-1: Ø 32.3
// -0.1, 1.3 thick (1.35 -0.1; 020605's finished 1.3), its radial width round it, the eye turned in at 0° and its square end at 336°, the pins' holes on r 14.2 at the eye
// and at 295°). Which pin goes where is 05 06_4's Schnitt A-B: the eye's pin is drawn whole ("Stift nach oben": up, into the ratchet 05 06 02-1, whose own sheet puts its
// pin hole at 6 o'clock between the clicks at 9 and 3, as A-B draws the eye), the pin at 295° hidden under the ratchet's plate (down, into the fusee wheel); and the
// ratchet's teeth and the detent on A-B make running clockwise there, so the drive pushes the eye toward the square end and closes the ring, its outer edge leaving the
// wheel's recess (Ø 32.3 +0.05 round the ring's 32.3 -0.1: opened, the ring would bear on its wall at once and barely give). The eye's end held by its pin (a hinge),
// the other end by its pin and by the recess's wall: the short wide tail past the pin (295-336°) would turn out about the pin as the band closes (2.8° banked, its corner
// 0.46 out) but has 0.025-0.075 to the wall, so it bears on it and that end is held as clamped. The band (I = t w³ / 12, w its radial width) is then loaded at the eye by
// a force F, a vector; by Castigliano the eye's pin moves G F, G = ∫ [[y², -x y], [-x y, x²]] / E I ds (x, y the eye's pin from a point of the band), and it must move
// as the ratchet turns it about the axis, ψ ẑ × p_eye, so the spring's stiffness between ratchet and wheel at small turns is (ẑ × p) · G⁻¹ (ẑ × p); at any turn the
// band is bent as an elastica, the eye's pin brought by Newton where the ratchet turns it. It would bank when the eye's round end (r 1.8) met the square end's face; the
// drive closes it short of that, its ends nearly meeting (Gould), as the eye's hole lies on its 0° line (fusee.js EYO: the sheet draws it there, to scale; its "0,8" is
// tried both ways). Then, while the key winds: the clicks let go and the ratchet turns back with the spring until the maintaining detent catches its next tooth (none to
// a whole tooth, 3°: 120 teeth), the detent holds it, and the train runs on what the spring keeps, the fusee wheel turning at its rate and the push falling; the
// balance's swing follows (WPHYS.ampStep: A² towards ampAt(drive)², TF) and the rate with it (rateAt). Needs only Node.js:
//   node wempe_sustaining.js [--json OUT]    (about 20 s; exits 1 if the elastica parts from Castigliano at small turns or misses the eye's pin, the ring moves out into
//   the recess, js/escphys.js's MSK, MSK2, MSB or MBK aren't what the drawn ring gives, the spring keeps the train going under a minute (the 1954 instruction's 1-2
//   minutes, its lower end) with the detent catching a whole tooth late, or it is stressed past its steel)
const fs=require('fs'),path=require('path'),W=require('./wempe_load.js')(),P=W.WPHYS,E=P.ESC;
const FU=fs.readFileSync(path.join(__dirname,'..','..','wempe','js','fusee.js'),'utf8');
const num=(re,what)=>{const m=re.exec(FU);if(!m)throw Error('not found in fusee.js: '+what);return m.slice(1);};
const f=(x,n=0)=>(+x).toFixed(n),D2R=Math.PI/180,TAU=2*Math.PI,rows=[],out={};let fail=0;
const say=s=>rows.push('  '+s),chk=(ok,s,soft)=>{if(!ok&&!soft)fail=1;rows.push(`${ok?'  ok ':soft?'  ~~ ':'  !! '} ${s}`);};
/* the ring as fusee.js draws it: its widths (05 06 01-1, traced), its outer radius, the eye's offset and radius, the square end, the pin at 295°, its thickness */
const W48=new Function('D2R',num(/\/\* MS-W48 \*\/([\s\S]*?)\/\* \/MS-W48 \*\//,'the widths (its MS-W48 block)')[0]+';return w48;')(D2R),[RO]=num(/\(([\d.]+)-w\)-r,r-[\d.]+\)/,'the outer radius').map(Number);
const [EYO]=num(/EYO=([-\d.]+)/,'the eye\'s offset').map(Number),[ER]=num(/Math\.hypot\(x-eye\[0\],y-eye\[1\]\)-([\d.]+)/,'the eye\'s radius').map(Number);
const [USQ]=num(/if\(u>(\d+)\/360\)return 1/,'the square end').map(Number),[UPIN]=num(/PINS=bk\((\d+),0\)/,'the pin at 295°').map(Number),[TH]=num(/GS1=WW-([\d.]+)/,'the thickness').map(Number);
const wAt=W48;   /* fusee.js's own width function, its MS-W48 block run here (a table read from it until 27 October 2026) */
/* in the sheet's sense (u from 0° at the eye, the way the widths run; mirrored in the model, the same figures): a point at r, u. The eye's hole EYO toward the square end
   off its 0° line, as fusee.js has it (0: 05 06 01-1, to scale there, draws it on the line; its "0,8" by the eye is tried both ways below) */
const at=(r,u)=>[r*Math.sin(u*D2R),-r*Math.cos(u*D2R)],RP=14.2;
function ring({t=TH,E_=207e3,eo=-EYO,u0=ER/RP/D2R}={}){
  const ue=eo/RP/D2R,pe=at(RP,ue),ps=at(RP,UPIN);
  /* the band's centreline from the wheel's pin (s 0, clamped) to the eye's round end, its segments' lengths and free directions, E I along it */
  const N=300,C=[],EI=[],WW=[];for(let i=0;i<=N;i++){const u=UPIN-(UPIN-u0)*i/N,w=wAt(u);C.push(i===0?ps:at(RO-w/2,u));WW.push(w);EI.push(E_*t*w**3/12);}
  const Ls=[],As=[];for(let i=1;i<=N;i++){Ls.push(Math.hypot(C[i][0]-C[i-1][0],C[i][1]-C[i-1][1]));As.push(Math.atan2(C[i][1]-C[i-1][1],C[i][0]-C[i-1][0]));}
  const rot=(v,a)=>[v[0]*Math.cos(a)-v[1]*Math.sin(a),v[0]*Math.sin(a)+v[1]*Math.cos(a)],off=[pe[0]-C[N][0],pe[1]-C[N][1]];
  /* small turns, by Castigliano: the eye's pin moves G F, G = ∫ [[y², -x y], [-x y, x²]] / E I ds; closing turns it -ẑ × p a radian (u falling: clockwise in this frame) */
  let g00=0,g01=0,g11=0;for(let i=1;i<=N;i++){const m=[(C[i][0]+C[i-1][0])/2,(C[i][1]+C[i-1][1])/2],x=pe[0]-m[0],y=pe[1]-m[1],ei=(EI[i]+EI[i-1])/2,ds=Ls[i-1];g00+=y*y/ei*ds;g01-=x*y/ei*ds;g11+=x*x/ei*ds;}
  const zp=[pe[1],-pe[0]],det=g00*g11-g01*g01,F0=[(g11*zp[0]-g01*zp[1])/det,(-g01*zp[0]+g00*zp[1])/det],k0=Math.abs(pe[0]*F0[1]-pe[1]*F0[0])/1000;
  /* any turn: the band bent as an elastica (its turn θ' = θ0' + M / E I, M = (p - x) × F the moment of the force on the eye's pin about the bent band's point x), the
     eye's pin brought where the ratchet turns it (p turned ψ about the axis) by Newton on F; its end's round eye with it */
  const shoot=(F,tg)=>{let x=ps.slice(),d=0,smax=0,sAt=0,out=-1e9;
    for(let i=0;i<N;i++){const m=[x[0]+0.5*Ls[i]*Math.cos(As[i]+d),x[1]+0.5*Ls[i]*Math.sin(As[i]+d)],M=(tg[0]-m[0])*F[1]-(tg[1]-m[1])*F[0],w=(WW[i]+WW[i+1])/2;
      const dn=d+M/((EI[i]+EI[i+1])/2)*Ls[i],dm=(d+dn)/2;const sg=6*Math.abs(M)/(t*w*w);if(sg>smax){smax=sg;sAt=UPIN-(UPIN-u0)*(i+0.5)/N;}
      x=[x[0]+Ls[i]*Math.cos(As[i]+dm),x[1]+Ls[i]*Math.sin(As[i]+dm)];d=dn;
      const c=C[i+1],r=Math.hypot(...c),q=rot([c[0]/r*RO-c[0],c[1]/r*RO-c[1]],d);out=Math.max(out,Math.hypot(x[0]+q[0],x[1]+q[1])-RO);}   /* the outer edge's radius past the free ring's */
    const o=rot(off,d);return{eye:[x[0]+o[0],x[1]+o[1]],smax,sAt,out};};
  const nl=psi=>{const tg=rot(pe,-psi);let F=F0.map(v=>v*psi),r=null;
    for(let it=0;it<40;it++){r=shoot(F,tg);const R=[r.eye[0]-tg[0],r.eye[1]-tg[1]];if(Math.hypot(...R)<1e-10)break;const h=1e-4*(1+Math.hypot(...F)),a=shoot([F[0]+h,F[1]],tg).eye,b=shoot([F[0],F[1]+h],tg).eye;
      const J=[[(a[0]-r.eye[0])/h,(b[0]-r.eye[0])/h],[(a[1]-r.eye[1])/h,(b[1]-r.eye[1])/h]],dj=J[0][0]*J[1][1]-J[0][1]*J[1][0];F=[F[0]-(J[1][1]*R[0]-J[0][1]*R[1])/dj,F[1]-(-J[1][0]*R[0]+J[0][0]*R[1])/dj];}
    return{T:Math.abs(tg[0]*F[1]-tg[1]*F[0])/1000,F,smax:r.smax,sAt:r.sAt,out:r.out,miss:Math.hypot(r.eye[0]-tg[0],r.eye[1]-tg[1])};};
  /* banking: the eye's round end, a circle r ER about its pin, turned about the axis toward the square end until it meets the end's face (radial at USQ, RO - its width to RO) */
  const wq=wAt(USQ),q0=at(RO-wq,USQ),q1=at(RO,USQ),seg=(c)=>{const v=[q1[0]-q0[0],q1[1]-q0[1]],l2=v[0]*v[0]+v[1]*v[1],s=Math.max(0,Math.min(1,((c[0]-q0[0])*v[0]+(c[1]-q0[1])*v[1])/l2));return Math.hypot(c[0]-q0[0]-s*v[0],c[1]-q0[1]-s*v[1]);};
  let lo=0;while(lo<90&&seg(at(RP,ue-lo-0.05))>ER)lo+=0.05;let hi=lo+0.05;for(let i=0;i<40;i++){const m=(lo+hi)/2;seg(at(RP,ue-m))>ER?lo=m:hi=m;}   /* marched to the first contact, then halved */
  const psiB=lo*D2R,B=nl(psiB),H=nl(psiB/2),h=psiB/2,k2=(B.T-2*H.T)/(2*h*h),k1=(H.T-k2*h*h)/h,small=nl(0.25*D2R);
  return{k0,k1,k2,kS:small.T/(0.25*D2R),psiB,Tb:B.T,B,nl,ue,Tq:ph=>k1*ph+k2*ph*ph,phOf:T=>(-k1+Math.sqrt(k1*k1+4*k2*T))/(2*k2)};}   /* N·m a radian (k0 Castigliano's, kS the elastica's at 0.25°), T = k1 ψ + k2 ψ² through the elastica's at ψB / 2 and ψB */
const R0=ring();
say(`the ring as drawn (fusee.js, from 05 06 01-1): Ø ${f(2*RO,2)}, ${TH} thick, ${f(wAt(100),1)} wide (radially) from 50° to 270° (${f(wAt(10),2)} at 10°, toward the eye), widening to ${f(wAt(USQ),1)} at its square end (${USQ}°); its pins on r ${RP} at the eye and at ${UPIN}°; the eye's pin up into the ratchet, the other down into the fusee wheel (05 06_4 A-B)`);
say(`the band from the eye's round end (${f(ER/RP/D2R,1)}°) to the wheel's pin, held there by the recess's wall, bent as an elastica: its eye would meet the square end after ${f(R0.psiB/D2R,1)}° of closing, the spring then pushing ${f(R0.Tb*1000,0)} mN·m (${f(R0.Tb/R0.psiB,3)} N·m a radian on average; ${f(R0.k1,3)} at small turns, stiffening as it closes: T = ${f(R0.k1,4)} ψ + ${f(R0.k2,4)} ψ², ψ in rad)`);
chk(Math.abs(R0.kS-R0.k0)<0.01*R0.k0&&Math.abs(R0.k1-R0.k0)<0.02*R0.k0,`at small turns the elastica gives Castigliano's stiffness: ${f(R0.kS,3)} at 0.25° against ${f(R0.k0,3)} N·m a radian (and the fit's ${f(R0.k1,3)})`);
chk(R0.B.miss<1e-6,`the elastica brings the eye's pin where the ratchet turns it (missing by ${(R0.B.miss*1e3).toExponential(1)} µm)`);
chk(R0.B.out<0.01,`closing, its outer edge moves in all round (${f(Math.max(0,R0.B.out)*1000,0)} µm out at most closed to its banking; the recess's wall 0.025-0.075 off): it leaves the wall, bearing only by its tail`);
/* the drive, running: the fusee arbor's torque over the wind (05 06_20, its losses in it); the ring closed by it, its ends' gap left (or banked) */
let Tmin=1e9,Tmax=0;for(let n=0;n<=P.MF+1e-9;n+=P.MF/200){const T=P.fusT(n);Tmin=Math.min(Tmin,T);Tmax=Math.max(Tmax,T);}
const T12=P.fusT(12/P.HPT),Tb=R0.Tb,PU=Tb/T12,state=r=>{const a=r.phOf(Tmin),b=r.phOf(Tmax);return{a,b,gap:[r.psiB-b,r.psiB-a],banked:a>=r.psiB?'all':b>=r.psiB?'part':'none'};},S_=state(R0),banked=S_.banked==='all';
const gapTxt=(r,q)=>q.banked==='none'?`its ends ${f(q.gap[0]/D2R,1)}-${f(q.gap[1]/D2R,1)}° apart (${f(q.gap[0]*RP,2)}-${f(q.gap[1]*RP,2)} mm at the eye), nearly meeting: it carries the drive by its bend`:q.banked==='all'?`closed onto its banking all the run, pushing ${f(r.Tb*1000,0)} mN·m there (${f(100*r.Tb/T12)} % of the drive at 12 h), the rest through the eye on the square end`:`banked where the drive is strongest, nearly meeting where it is weakest`;
say(`the drive on the fusee wheel, running: ${f(Tmin*1000,0)}-${f(Tmax*1000,0)} mN·m over the wind (05 06_20), ${f(T12*1000,0)} at 12 h, closing the ring ${f(S_.a/D2R,1)}-${f(S_.b/D2R,1)}° of the ${f(R0.psiB/D2R,1)}° to its banking: ${gapTxt(R0,S_)}. As Gould has such a spring: "a simple steel split-ring, with ends nearly meeting ... When the pull of the chain is removed ... the ends spring apart a little" (The Marine Chronometer, 1923, p. 238)`);
/* the variations: the thickness's tolerance (1.35 -0.1), the modulus, the eye's "0,8" taken as its offset either way, the band taken from the eye's centre */
const V=[['1.25 thick',{t:1.25}],['1.35 thick',{t:1.35}],['E 200 GPa',{E_:200e3}],['E 210 GPa',{E_:210e3}],["the eye's hole 0.8 toward the square end (as built until 16 October 2026)",{eo:-0.8}],["the eye's hole 0.8 the other way",{eo:0.8}],['the band from the eye\'s centre',{u0:0}]].map(([n,o])=>{const r=ring(o);return[n,r,state(r)];});
for(const[n,r,q]of V)say(`  ${n}: ${f(r.k1,3)} N·m a radian, banking at ${f(r.psiB/D2R,1)}°: ${gapTxt(r,q)}`);
/* its stress at the most it carries: the strongest drive's bend, or its banking's */
const SM=banked?R0.B:R0.nl(Math.min(S_.b,R0.psiB)),F=Math.hypot(...SM.F),sig=SM.smax,Y=[1200,1800];
chk(sig<Y[0]/1.2,`bent ${f(sig)} MPa at the most it carries (the force on the eye's pin ${f(F,1)} N, the most at ${f(SM.sAt)}° from the eye): ${f(Y[0]/sig,1)}-${f(Y[1]/sig,1)} times short of hardened spring steel's yield (it is hardened in oil and blued, 05 06 01-1)`);
/* in time, the key held: the ratchet turns back with the spring until the detent takes its next tooth (back: 0 to a whole tooth), then the train runs on the spring, the fusee
   wheel turning at its rate (a turn in HPT hours), the push falling; the swing follows (ampStep) and the rate (rateAt). Wound daily, 24 h from full wind */
const wfw=TAU/(P.HPT*3600),TOOTH=TAU/120,drvOf=T=>T/T12*P.drv(12/P.HPT),n24=24/P.HPT,A24=E.ampAt(P.drv(n24)),r24=E.rateAt(A24,P.drv(n24));
/* ampAt solves the escapement each call (about 0.3 s): tabulated over the drive and interpolated, the swing stepped as ampStep does */
const DS=[];for(let s=0;s<=1.1001;s+=0.025)DS.push([s,E.ampAt(s)||0]);const ampT=s=>{if(s<=0)return 0;for(let i=1;i<DS.length;i++)if(s<=DS[i][0]){const[a,p]=DS[i-1],[b,q]=DS[i];return p+(q-p)*(s-a)/(b-a);}return DS[DS.length-1][1];};
const step=(A,dt,D)=>{if(D>0){const u=ampT(D)**2;return Math.sqrt(u+(A*A-u)*Math.exp(-2*dt/P.SET.TF));}return E.freeStep(A,dt);};
const sim=(back,tEnd=3600,dt=0.5,rate=false)=>{const ph=Math.min(R0.phOf(T12),R0.psiB)-back;let A=A24,t=0,lost=0,tG=null,tTurn=null,tStop=null;const tr=[];
  while(t<tEnd){const D=drvOf(R0.Tq(Math.max(0,ph-wfw*t)));A=step(A,dt,D);if(A<E.AMIN||!(A>0)){tStop=t;break;}
    if(rate){const r=D>0?E.rateAt(A,D):r24;lost+=(r-r24)/86400*dt;}if(tG===null&&A<185*D2R)tG=t;if(tTurn===null&&A<Math.PI)tTurn=t;if(Math.round(t/dt)%Math.round(10/dt)===0)tr.push([+t.toFixed(1),+(A/D2R).toFixed(2),+D.toFixed(4)]);t+=dt;}
  return{ph,tG,tTurn,tStop,lost,trace:tr};};
const mm=s=>s==null?'over an hour':s<120?f(s)+' s':f(s/60,1)+' min',S0=sim(0),SH=sim(TOOTH/2),SW=sim(TOOTH);
const P0=R0.Tq(Math.min(R0.phOf(P.fusT(n24)),R0.psiB)-TOOTH/2)/P.fusT(n24);
say(`the key held (wound at 24 h, the swing ${f(A24/D2R)}°): the push at once ${f(100*P0)} % of the drive (the detent half a tooth late), the swing settling toward ${f(ampT(drvOf(P0*P.fusT(n24)))/D2R)}°; the detent catching at once / half a tooth late / a whole tooth late (3°): the swing under the guard band's 185° after ${mm(S0.tG)} / ${mm(SH.tG)} / ${mm(SW.tG)}, under a turn after ${mm(S0.tTurn)} / ${mm(SH.tTurn)} / ${mm(SW.tTurn)}, the train stopped after ${mm(S0.tStop)} / ${mm(SH.tStop)} / ${mm(SW.tStop)}`);
chk(SW.tStop==null||SW.tStop>=60,`it keeps the train going ${mm(SW.tStop)} even with the detent a whole tooth late: more than the 1954 instruction's 1-2 minutes ("может действовать в течение 1-2 мин", for chronometers in general; 6MX-figures.md), and far more than a wind takes`);
const w=s=>sim(TOOTH/2,s,0.5,true).lost,w10=w(10),w30=w(30);
say(`a wind costs ${f(w10*1e6,1)} µs held 10 s (a day's) and ${f(w30*1e6,1)} µs held 30 s (from run down): nothing a navigator could read`);
chk(Math.abs(w30)<0.01,'a wind costs under 10 ms');
/* the page (js/escphys.js): its stiffness, banking and mean back-turn must be what the drawn ring gives */
chk(Math.abs(P.MSK-R0.k1)<0.005*R0.k1&&Math.abs(P.MSK2-R0.k2)<0.02*Math.abs(R0.k2)+0.005&&Math.abs(P.MSB-R0.psiB)<0.002&&Math.abs(P.MBK-TOOTH/2)<1e-9,`js/escphys.js's MSK ${f(P.MSK,3)}, MSK2 ${f(P.MSK2,3)}, MSB ${f(P.MSB/D2R,2)}° and MBK ${f(P.MBK/D2R,2)}° are the drawn ring's ${f(R0.k1,3)}, ${f(R0.k2,3)}, ${f(R0.psiB/D2R,2)}° and half a tooth (the page runs the spring with them: ${f(P.SUS/60,1)} min from the key going on at 12 h to the push spent, the detent half a tooth late)`);
out.spring={k0:R0.k0,k1:R0.k1,k2:R0.k2,psiB:R0.psiB,Tb,PU,T12,Tmin,Tmax,banked,state:S_,P0,sig,F,t:TH,ro:RO,eye:EYO,vary:V.map(([n,r,q])=>({n,k1:r.k1,k2:r.k2,psiB:r.psiB,state:q}))};
out.sim={A24,catch0:S0,half:SH,whole:SW,w10,w30};out.rows=rows;module.exports=out;
if(require.main===module){console.log(rows.join('\n'));const jo=process.argv.indexOf('--json');if(jo>0)fs.writeFileSync(process.argv[jo+1],JSON.stringify(out));process.exitCode=fail;}
