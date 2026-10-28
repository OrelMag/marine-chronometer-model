// The Wempe's transmission in time, traced for its viewer (marine-chronometer-source/wempe/verification/assets/transmission/index.html, linked from the Wempe report's
// section 13): wempe_transmission.js's own bodies and elements run through four scenarios, every body's angle and every element's force sampled finely through each event
// and coarsely between, written as that page's data.js (TRDATA). The scenarios: a beat at 12 h (the train on its meshes driving dynamics.js's escapement), the key let go
// outright and eased back at 24 h (the nearer click 0.97 of half a tooth short of its face, the worst place), and the key wound into the stop at a turn a second.
// Each body's motion is split into the train's rigid motion and its deviation from it, worked in double precision (the deviations are micro-radians), so the page can
// magnify the deviations as a finite-element post-processor magnifies a deformed shape; every channel stored as base64 Float32.
// Needs only Node.js:   node wempe_transmission_trace.js     (about 2 minutes: the meshes' tables, then the four runs, each in a thread of its own; MC_TR_TABS=FILE keeps the
// tables between runs, as wempe_transmission.js does). Writes wempe/verification/assets/transmission/data.js (about 6.5 MB). Run it after wempe_transmission.js's results change.
if(!process.argv.includes('--model'))process.argv.push('--model','wempe');
const {Worker,isMainThread,parentPort,workerData}=require('worker_threads'),fs=require('fs'),path=require('path');
const TRF=path.join(__dirname,'wempe_transmission.js'),TR=require(TRF),DY=require('./dynamics.js'),TAU=2*Math.PI,HPT=90/14;
const r=(x,n)=>+x.toPrecision(n);
/* one frame: [t, each body's angle, each mesh's torque, the chain, the spring's torque and lead, the clicks', the detent's, the cannon pinion's, the stone's, the stop's, the hand's] */
function frame(X,t,extra){return[r(t,9),...X.mc.B.map(b=>r(b.q,9)),...X.me.map(m=>r(m.lam,5)),r(X.ch.T,5),r(X.sp.T,5),r(X.sp.psi,7),r(X.c1.L,5),r(X.c2.L,5),r(X.dt.L,5),r(X.cn.T,5),r(X.st?X.st.L:0,5),r(X.sw?X.sw.L:0,5),r(X.hd?X.hd.T:0,5),...(extra||[])];}
const cols=X=>['t',...X.mc.B.map(b=>'q:'+b.n),...TR.MESH.map(q=>'mesh:'+q.nm),'chain','spring','lead','click1','click2','detent','cannon','stone','stop','hand'];
function run(TB,scen){
  if(scen==='beat'){   /* as wempe_transmission.js's beat(): from 10 to 11.6 s, every 20 µs within 20 ms of the escape wheel's moving, every ms else */
    const X=TR.build(TB,12/HPT,{free:true}),{mc,b,me}=X,B=mc.B;B[b.esc].q=0;TR.settle(X,0.08);
    const P_=DY.ESC.P,T0=10.0,T1=11.6;let nl=0,phO=0,qeO=0,tO=0,pvO=0,last=-1,lastEv=-1;const F=[];
    DY.sim({T:T1,from:5,J:DY.JE/DY.JT,tq:()=>me[3].lam,watch:(t,th,w,d,dv,ph,pv,dm,wm)=>{if(phO<-0.5*P_&&ph>-1e-12)nl++;phO=ph;const qe=nl*P_-ph,dtt=t-tO;
      if(dtt>0){const ns=Math.max(1,Math.ceil(dtt/1e-6)),h=dtt/ns,ve=(qe-qeO)/dtt;for(let i=0;i<ns;i++){B[b.esc].q=qeO+ve*h*(i+1);B[b.esc].v=-(pvO+(pv-pvO)*(i+1)/ns);mc.step(h);
        const tt=tO+h*(i+1);if(wm!==0)lastEv=tt;if(tt>=T0&&tt<=T1&&tt-last>=(tt-lastEv<0.02?2e-5:1e-3)){F.push(frame(X,tt,[r(th,7),r(w,5),r(d,6),wm,dm]));last=tt;}}}
      tO=t;qeO=qe;pvO=pv;}});
    return{cols:[...cols(X),'balance','balanceW','detentLift','wheelMode','detentMode'],F};}
  if(scen==='snap'||scen==='eased'){   /* as windRun(): a half-turn stroke, slowed, crept on to the place, held, let go; frames from 20 ms before letting go */
    const ease=scen==='eased'?0.15:0,X=TR.build(TB,24/HPT,{key:true}),{mc,b,hd,c1,c2,dt}=X,B=mc.B;TR.settle(X,0.06);
    dt.x0=B[b.ratchet].q-0.5*TR.DT.p;dt.n=0;B[b.det].q=TR.DT.hmax*0.5;B[b.key].q=B[b.fusee].q;
    const near=()=>Math.min(...[c1,c2].map(c=>{const x0=c===c1?0:TR.CK.p/2;return-(B[b.fusee].q-B[b.ratchet].q-x0-c.n*TR.CK.p);})),tgt=0.97*TR.CK.p/2,q0=B[b.fusee].q,thin=2;
    hd.on=true;hd.th=B[b.key].q;let t=0,ph='wind',t1=0,tL=null,last=-1,k=0;const F=[];
    while(t<6){if(ph==='wind'){hd.w=-TAU*Math.min(1,t/0.03);if(q0-B[b.fusee].q>=Math.PI){ph='slow';t1=t;}}
      else if(ph==='slow'){hd.w=-TAU*Math.max(0,1-(t-t1)/0.05);if(t-t1>0.08){ph='creep';t1=t;}}
      else if(ph==='creep'){const d=near(),ok=d>=tgt-2e-4&&d<=tgt+3e-3;hd.w=ok?0:-0.3;if(ok&&t-t1>0.05){ph='hold';t1=t;}}
      else if(ph==='hold'){hd.w=0;if(t-t1>0.05){ph='let';t1=t;tL=t;if(!ease)hd.on=false;else hd.T0=Math.abs(hd.T);}}
      else{if(ease)hd.Tmax=hd.T0*Math.max(0,1-(t-t1)/ease);if(t-t1>0.12+ease)break;}
      mc.step(1e-6);t+=1e-6;
      if(tL!==null||ph==='hold'){const rel=tL===null?t-(t1+0.05):t-tL;if(rel>=-0.02&&t-last>=(rel>=-0.002&&rel<0.06+ease?1e-5*thin:5e-4)){F.push(frame(X,rel));last=t;}}}
    return{cols:cols(X),F,free:tgt};}
  /* the stop: wound into it at a turn a second from 0.12 turn short, a strong hand behind */
  const X=TR.build(TB,0.12,{key:true,Tmax:1.06}),{mc,b,hd,sw}=X,B=mc.B;TR.settle(X,0.06);sw.on=true;sw.q0=-0.12*TAU;B[b.key].q=B[b.fusee].q;
  hd.on=true;hd.th=B[b.key].q;let t=0,last=-1,tHit=null;const F=[];
  while(t<0.6){hd.w=-TAU*Math.min(1,t/0.03);mc.step(1e-6);t+=1e-6;if(sw.L>0&&tHit===null)tHit=t;if(t-last>=(tHit!==null&&t-tHit<0.05?2e-5:5e-4)){F.push(frame(X,t));last=t;}}
  return{cols:cols(X),F,tHit};}
if(!isMainThread&&workerData.job==='trace'){parentPort.postMessage(run(workerData.TB,workerData.scen));return;}

const W=require('./wempe_load.js')(),H=W.WD.H,E=W.WESC,MJ=require('./mechanisms_wempe.json'),RB=41.6/2+1.02,P=a=>[+a[0].toFixed(3),+a[1].toFixed(3)];
const b64=a=>Buffer.from(new Float32Array(a).buffer).toString('base64');
/* the plan (mm, WD.H's frame), each body's centre and drawn radii (the parts' tables: train.js, fusee.js, dial.js, escapement.js) */
const geo={barrel:{c:P(H[45]),r:20.8},fusee:{c:P(H[10]),r:8.0,ri:7.2},ratchet:{c:P(H[10]),r:18.6,ri:17.875},fw:{c:P(H[10]),r:40.57/2,ri:37.84/2},
  centre:{c:P(H[1]),r:33.10/2,ri:30.86/2,pin:{z:14,r:6.78/2}},inter:{c:P(H[38]),r:23.33/2,ri:22.1/2,pin:{z:12,r:5.0/2}},sec:{c:P(H[35]),r:21.9/2,ri:20.6/2,pin:{z:10,r:3.4/2}},
  esc:{c:P(H[26]),r:7.0,ri:5.85,pin:{z:10,r:2.97/2}},cannon:{c:P(H[1]),r:5.86/2},change:{c:P(H[19]),r:21.05/2,ri:19.03/2,pin:{z:18,r:6.9/2}},hour:{c:P(H[1]),r:19.7/2,ri:17.89/2},
  ud:{c:P(H[2]),r:34.33/2,ri:32.57/2},balance:{c:P(E.B),r:32.32/2},detentPivot:P(E.DPIV),mdetPivot:P(H[4]),stopPin:P(H[7]),
  clicks:MJ.pawls.filter(p=>/click [12]/.test(p.name)).map(p=>({pivot:p.pivot,C:p.face.C})),mdet:(p=>({pivot:p.pivot,C:p.face.C}))(MJ.pawls.find(p=>p.name==='maintaining detent'))};
/* each body's turn for a turn of the reference body (the train's ratios; the chain's lever on the fusee where it lies over the drum's), and which bodies' deviations the page
   scales (held elastically): in a beat all but the escape wheel, which the escapement moves; in the winds the train, which its locking stone holds */
const RAT={beat:{ref:'esc',sec:1/8,inter:1/64,centre:1/480,cannon:1/480,change:1/480*14/56,hour:1/480*14/56*18/54,fw:1/480/HPT,ratchet:1/480/HPT,fusee:1/480/HPT,barrel:1/480/HPT*TR.rho(12/HPT)/RB,ud:1/480/HPT*12/120},
  wind:{ref:'fusee',barrel:TR.rho(24/HPT)/RB,key:1,ratchet:1,ud:12/120}};
const MAG={beat:['barrel','fusee','ratchet','fw','centre','cannon','change','hour','inter','sec','ud'],wind:['fw','centre','cannon','change','hour','inter','sec','esc']};
function pack(name,kind,tr){const c=tr.cols,ix=k=>c.indexOf(k),F=tr.F,t0=F[0][0],R=RAT[kind],out={name,kind,n:F.length,t:b64(F.map(f=>f[0]-t0)),t0,bodies:{},forces:{},mag:MAG[kind]};
  const qr=F.map(f=>f[ix('q:'+R.ref)]-F[0][ix('q:'+R.ref)]);
  for(const bd of c.filter(k=>k.startsWith('q:')).map(k=>k.slice(2))){const j=ix('q:'+bd),rr=bd===R.ref?1:(R[bd]??0),q=F.map(f=>f[j]-F[0][j]);
    out.bodies[bd]={kin:b64(qr.map(x=>x*rr)),dev:b64(q.map((x,i)=>x-qr[i]*rr)),q0:F[0][j]};}
  for(const k of c.filter(k=>!k.startsWith('q:')&&k!=='t'))out.forces[k]=b64(F.map(f=>f[ix(k)]));return out;}
(async()=>{const T0=Date.now(),TC=process.env.MC_TR_TABS;
  const TB=TC&&fs.existsSync(TC)?JSON.parse(fs.readFileSync(TC,'utf8')):await Promise.all(TR.MESH.map(q=>new Promise((ok,no)=>{const w=new Worker(TRF,{workerData:{zA:q.zA,zB:q.zB,m:q.m,dd:q.dd,add:q.add},argv:['--model','wempe']});w.on('message',ok);w.on('error',no);})));
  if(TC&&!fs.existsSync(TC))fs.writeFileSync(TC,JSON.stringify(TB));
  const[beat,snap,eased,stop]=await Promise.all(['beat','snap','eased','stop'].map(scen=>new Promise((ok,no)=>{const w=new Worker(__filename,{workerData:{job:'trace',TB,scen},argv:['--model','wempe']});w.on('message',ok);w.on('error',no);})));
  /* the running loads at 12 h (the beat's first frame, the escape wheel locked): what each contact's colour is measured against */
  const f0=beat.F[0],ref={};for(const k of beat.cols)if(!k.startsWith('q:'))ref[k]=Math.abs(f0[beat.cols.indexOf(k)]);
  Object.assign(ref,{stone:ref['mesh:'+TR.MESH[3].nm],click2:ref.click1,detent:TR.fusT(24/HPT),stop:1.06-TR.fusT(0)});
  const S=[pack('A beat at 12 hours','beat',beat),pack('The key let go outright','wind',snap),pack('The key eased back','wind',eased),pack('Wound into the stop','wind',stop)];
  S[1].free=snap.free;S[2].free=eased.free;S[3].tHit=stop.tHit;
  const meta={geo,MS:TR.MESH.map(q=>({nm:q.nm,A:q.A,B:q.B,zA:q.zA,zB:q.zB,m:q.m})),ref,MSB:TR.MSB,CK:{p:TR.CK.p,hmax:TR.CK.hmax,rc:TR.CK.rc},DT:{p:TR.DT.p,hmax:TR.DT.hmax,rc:TR.DT.rc},
    RB,rho12:TR.rho(12/HPT),rho24:TR.rho(24/HPT),rho0:TR.rho(0),made:new Date().toISOString().slice(0,10)};
  const OUT=process.env.MC_TR_OUT||path.join(__dirname,'..','..','wempe','verification','assets','transmission','data.js');   /* MC_TR_OUT: another file (motion3d's runs: the build, MC_WREV=build) */fs.mkdirSync(path.dirname(OUT),{recursive:true});
  fs.writeFileSync(OUT,'/* generated by tools/wempe_transmission_trace.js: not edited */\nconst TRDATA='+JSON.stringify({meta,S})+';\n');
  console.log(`wrote ${path.relative(path.join(__dirname,'..','..','..'),OUT)} (${(fs.statSync(OUT).size/1e6).toFixed(1)} MB): ${S.map(s=>`${s.name} ${s.n} frames`).join(', ')}; ${((Date.now()-T0)/1000).toFixed(0)} s`);})().catch(e=>{console.error(e);process.exitCode=1;});
