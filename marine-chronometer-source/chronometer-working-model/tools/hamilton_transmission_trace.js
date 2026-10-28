// The Hamilton's transmission in time, traced as wempe_transmission_trace.js traces the Wempe's, for the motion-3d pipeline (motion3d_kin.py, motion3d_fe.py, motion3d_pack.py,
// which read a trace the same as the Wempe's): hamilton_transmission.js's own bodies and elements run through four scenarios, every body's angle and every element's force sampled
// finely through each event and coarsely between, written as TRDATA={meta,S}. The scenarios: a beat at 12 h (the train on its meshes driving dynamics.js's escapement, the
// mainspring at the page's level, KDRV), the key let go outright and eased back at 24 h (the winding pawls 0.97 of a tooth short of their faces, the longest free run, the worst
// place), and the key wound into the stop at a turn a second. Each body's motion is split into the train's rigid motion and its deviation from it, worked in double precision (the
// deviations are micro-radians), so a viewer can magnify the deviations as a finite-element post-processor magnifies a deformed shape; every channel stored as base64 Float32.
// The bodies keep the Wempe's names, so a reader of either trace finds them alike: barrel, fusee (with its winding ratchet), ratchet (the sustaining ratchet), fw (the fusee wheel),
// centre, cannon, change (the minute wheel), hour, inter (the third arbor), sec (the fourth arbor), esc, ud (the wind indicator), key, 'click 1' and 'click 2' (the two winding pawls),
// 'maintaining detent' (the sustaining pawl); meta.names gives the Hamilton's name of each, meta.MSB the sustaining spring's bank (it runs banked: meta.banked).
// Needs only Node.js:   node hamilton_transmission_trace.js     (about a minute, 2 under load: the meshes' tables, then the four runs, each in a thread of its own; MC_TR_TABS=FILE keeps the
// tables between runs, as hamilton_transmission.js does). Writes MC_TR_OUT, by default tools/r_motion3d/hamilton/trace_last.js (git-ignored, about 6 MB). Run it after
// hamilton_transmission.js's results change.
const {Worker,isMainThread,parentPort,workerData}=require('worker_threads'),fs=require('fs'),path=require('path');
const TRF=path.join(__dirname,'hamilton_transmission.js'),TR=require(TRF),DY=require('./dynamics.js'),TAU=2*Math.PI,HPT=TR.HPT;
const r=(x,n)=>+x.toPrecision(n);
/* one frame: [t, each body's angle, each mesh's torque, the chain, the spring's torque and closure, the pawls', the sustaining pawl's, the cannon pinion's, the stone's, the stop's, the hand's] */
function frame(X,t,extra){return[r(t,9),...X.mc.B.map(b=>r(b.q,9)),...X.me.map(m=>r(m.lam,5)),r(X.ch.T,5),r(X.sp.T,5),r(X.sp.psi,7),r(X.c1.L,5),r(X.c2.L,5),r(X.dt.L,5),r(X.cn.T,5),r(X.st?X.st.L:0,5),r(X.sw?X.sw.L:0,5),r(X.hd?X.hd.T:0,5),...(extra||[])];}
const cols=X=>['t',...X.mc.B.map(b=>'q:'+b.n),...TR.MESH.map(q=>'mesh:'+q.nm),'chain','spring','lead','click1','click2','detent','cannon','stone','stop','hand'];
function run(TB,scen,kdrv){
  if(scen==='beat'){   /* as hamilton_transmission.js's beat(): from 10 to 11.6 s, every 20 µs within 20 ms of the escape wheel's moving, every ms else */
    const X=TR.build(TB,12/HPT,{free:true,kdrv}),{mc,b,me}=X,B=mc.B;B[b.esc].q=0;TR.settle(X,0.08);
    const P_=DY.ESC.P,T0=10.0,T1=11.6;let nl=0,phO=0,qeO=0,tO=0,pvO=0,last=-1,lastEv=-1;const F=[];
    DY.sim({T:T1,from:5,J:require('./mechanisms.json').arbors.escape.I*1e-9/DY.JT,tq:()=>me[3].lam,watch:(t,th,w,d,dv,ph,pv,dm,wm)=>{if(phO<-0.5*P_&&ph>-1e-12)nl++;phO=ph;const qe=nl*P_-ph,dtt=t-tO;
      if(dtt>0){const ns=Math.max(1,Math.ceil(dtt/1e-6)),h=dtt/ns,ve=(qe-qeO)/dtt;for(let i=0;i<ns;i++){B[b.esc].q=qeO+ve*h*(i+1);B[b.esc].v=-(pvO+(pv-pvO)*(i+1)/ns);mc.step(h);
        const tt=tO+h*(i+1);if(wm!==0)lastEv=tt;if(tt>=T0&&tt<=T1&&tt-last>=(tt-lastEv<0.02?2e-5:1e-3)){F.push(frame(X,tt,[r(th,7),r(w,5),r(d,6),wm,dm]));last=tt;}}}
      tO=t;qeO=qe;pvO=pv;}});
    return{cols:[...cols(X),'balance','balanceW','detentLift','wheelMode','detentMode'],F};}
  if(scen==='snap'||scen==='eased'){   /* as windRun(): a half-turn stroke, slowed, crept on to the place, held, let go; frames from 20 ms before letting go */
    const ease=scen==='eased'?0.15:0,X=TR.build(TB,24/HPT,{key:true}),{mc,b,hd,c1,c2,dt}=X,B=mc.B;TR.settle(X,0.06);
    dt.x0=B[b.ratchet].q-0.5*TR.DT.p;dt.n=0;B[b.det].q=TR.DT.hmax*0.5;B[b.key].q=B[b.fusee].q;
    const near=()=>Math.min(...[c1,c2].map(c=>-(B[b.fusee].q-B[b.ratchet].q-c.n*TR.CK.p))),tgt=0.97*TR.CK.p,q0=B[b.fusee].q,thin=2;
    hd.on=true;hd.th=B[b.key].q;let t=0,ph='wind',t1=0,tL=null,last=-1;const F=[];
    while(t<6){if(ph==='wind'){hd.w=-TAU*Math.min(1,t/0.03);if(q0-B[b.fusee].q>=Math.PI){ph='slow';t1=t;}}
      else if(ph==='slow'){hd.w=-TAU*Math.max(0,1-(t-t1)/0.05);if(t-t1>0.08){ph='creep';t1=t;}}
      else if(ph==='creep'){const d=near(),ok=d>=tgt-2e-4&&d<=tgt+3e-3;hd.w=ok?0:-0.3;if(ok&&t-t1>0.05){ph='hold';t1=t;}}
      else if(ph==='hold'){hd.w=0;if(t-t1>0.05){ph='let';t1=t;tL=t;if(!ease)hd.on=false;else hd.T0=Math.abs(hd.T);}}
      else{if(ease)hd.Tmax=hd.T0*Math.max(0,1-(t-t1)/ease);if(t-t1>0.12+ease)break;}
      mc.step(1e-6);t+=1e-6;
      if(tL!==null||ph==='hold'){const rel=tL===null?t-(t1+0.05):t-tL;if(rel>=-0.02&&t-last>=(rel>=-0.002&&rel<0.06+ease?1e-5*thin:5e-4)){F.push(frame(X,rel));last=t;}}}
    return{cols:cols(X),F,free:tgt};}
  /* the stop: wound into it at a turn a second from 0.12 turn short, a strong hand behind (overwind.js's) */
  const X=TR.build(TB,0.12,{key:true,Tmax:TR.HP.TH}),{mc,b,hd,sw}=X,B=mc.B;TR.settle(X,0.06);sw.on=true;sw.q0=-0.12*TAU;B[b.key].q=B[b.fusee].q;
  hd.on=true;hd.th=B[b.key].q;let t=0,last=-1,tHit=null;const F=[];
  while(t<0.6){hd.w=-TAU*Math.min(1,t/0.03);mc.step(1e-6);t+=1e-6;if(sw.L>0&&tHit===null)tHit=t;if(t-last>=(tHit!==null&&t-tHit<0.05?2e-5:5e-4)){F.push(frame(X,t));last=t;}}
  return{cols:cols(X),F,tHit};}
if(!isMainThread&&workerData.job==='trace'){TR.setHP(workerData.hp);Object.assign(TR.PAR,workerData.par);parentPort.postMessage(run(workerData.TB,workerData.scen,workerData.kdrv));return;}

const MJ=require('./mechanisms.json'),L=TR.LL,E=DY.ESC,P=a=>[+a[0].toFixed(3),+a[1].toFixed(3)];
const b64=a=>Buffer.from(new Float32Array(a).buffer).toString('base64');
/* each body's turn for a turn of the reference body (the train's ratios; the chain's lever on the fusee where it leaves it over the drum's), and which bodies' deviations a viewer
   scales (held elastically): in a beat all but the escape wheel, which the escapement moves; in the winds the train, which its locking stone holds */
const T=require('./physics.js').TRAIN,MWc=[14,56,18,54],fu=1/(T.fw/T.ep*T.tw/T.fp*T.cw/T.tp*T.fu/T.cp);
const RAT={beat:{ref:'esc',sec:T.ep/T.fw,inter:T.ep/T.fw*T.fp/T.tw,centre:T.ep/T.fw*T.fp/T.tw*T.tp/T.cw,cannon:T.ep/T.fw*T.fp/T.tw*T.tp/T.cw,change:T.ep/T.fw*T.fp/T.tw*T.tp/T.cw*MWc[0]/MWc[1],hour:T.ep/T.fw*T.fp/T.tw*T.tp/T.cw*MWc[0]/MWc[1]*MWc[2]/MWc[3],
  fw:fu,ratchet:fu,fusee:fu,barrel:fu*TR.rho(12/HPT)/TR.RB,ud:fu*12/120},wind:{ref:'fusee',barrel:TR.rho(24/HPT)/TR.RB,key:1,ratchet:1,ud:12/120}};
const MAG={beat:['barrel','fusee','ratchet','fw','centre','cannon','change','hour','inter','sec','ud'],wind:['fw','centre','cannon','change','hour','inter','sec','esc']};
function pack(name,kind,tr){const c=tr.cols,ix=k=>c.indexOf(k),F=tr.F,t0=F[0][0],R=RAT[kind],out={name,kind,n:F.length,t:b64(F.map(f=>f[0]-t0)),t0,bodies:{},forces:{},mag:MAG[kind]};
  const qr=F.map(f=>f[ix('q:'+R.ref)]-F[0][ix('q:'+R.ref)]);
  for(const bd of c.filter(k=>k.startsWith('q:')).map(k=>k.slice(2))){const j=ix('q:'+bd),rr=bd===R.ref?1:(R[bd]??0),q=F.map(f=>f[j]-F[0][j]);
    out.bodies[bd]={kin:b64(qr.map(x=>x*rr)),dev:b64(q.map((x,i)=>x-qr[i]*rr)),q0:F[0][j]};}
  for(const k of c.filter(k=>!k.startsWith('q:')&&k!=='t'))out.forces[k]=b64(F.map(f=>f[ix(k)]));return out;}
(async()=>{const T0=Date.now(),TC=process.env.MC_TR_TABS;
  const TB=TC&&fs.existsSync(TC)?JSON.parse(fs.readFileSync(TC,'utf8')):await Promise.all(TR.MESH.map(q=>new Promise((ok,no)=>{const w=new Worker(TRF,{workerData:{zA:q.zA,zB:q.zB,m:q.m,dd:q.dd}});w.on('message',ok);w.on('error',no);})));
  if(TC&&!fs.existsSync(TC))fs.writeFileSync(TC,JSON.stringify(TB));
  const hp=TR.params();TR.setHP(hp);TR.PAR.kbank=40*hp.KT;TR.PAR.tsl=hp.can.mid;const par={kbank:TR.PAR.kbank,tsl:TR.PAR.tsl};
  const kdrv=DY.TAUE/TR.build(TB,12/HPT).S.escT;   /* the page's level (hamilton_transmission.js's KDRV) */
  const[beat,snap,eased,stop]=await Promise.all(['beat','snap','eased','stop'].map(scen=>new Promise((ok,no)=>{const w=new Worker(__filename,{workerData:{job:'trace',TB,scen,hp,par,kdrv}});w.on('message',ok);w.on('error',no);})));
  /* the running loads at 12 h (the beat's first frame, the escape wheel locked): what each contact's colour is measured against */
  const f0=beat.F[0],ref={};for(const k of beat.cols)if(!k.startsWith('q:'))ref[k]=Math.abs(f0[beat.cols.indexOf(k)]);
  Object.assign(ref,{stone:ref['mesh:'+TR.MESH[3].nm],click2:ref.click1,detent:hp.KT*hp.SMAX,stop:hp.TH-TR.fusT(0)});
  const S=[pack('A beat at 12 hours','beat',beat),pack('The key let go outright','wind',snap),pack('The key eased back','wind',eased),pack('Wound into the stop','wind',stop)];
  S[1].free=snap.free;S[2].free=eased.free;S[3].tHit=stop.tHit;
  /* the plan (mm, the movement frame's x and z: movement.js L, mechanisms.json L), each body's centre and its radii (the meshes' tables: the outlines' tips and roots; the barrel's
     drum RB_O 18.3; the winding ratchet's and the sustaining ratchet's teeth, mechanisms.json; the balance's rim r 14.5, physics.js); the pawls' pivots and contacts in the fusee's
     frame (mechanisms.json, about L.Fu); the detent's point of flexure through the escapement's frame (the balance at its origin, the escape arbor at EX: movement.js's group) */
  const tip=(i,j)=>({r:+TB[i].ro[j].toFixed(3),ri:+TB[i].ri[j].toFixed(3)}),wp=MJ.pawls.find(p=>p.name==='winding pawl 1'),spw=MJ.pawls.find(p=>p.name==='sustaining pawl');
  const ph=Math.atan2(L.E[1]-L.B[1],L.E[0]-L.B[0]),ES=E.ES,u=q=>[L.B[0]+ES*(q.x*Math.cos(ph)-q.y*Math.sin(ph)),L.B[1]+ES*(q.x*Math.sin(ph)+q.y*Math.cos(ph))];
  const geo={barrel:{c:P(L.Ba),r:18.3},fusee:{c:P(L.Fu),r:wp.ro,ri:wp.ri},ratchet:{c:P(L.Fu),r:spw.ro,ri:spw.ri},fw:{c:P(L.Fu),...tip(0,0)},
    centre:{c:P(L.C),...tip(1,0),pin:{z:T.cp,r:TB[0].ro[1]}},inter:{c:P(L.T),...tip(2,0),pin:{z:T.tp,r:TB[1].ro[1]}},sec:{c:P(L.F),...tip(3,0),pin:{z:T.fp,r:TB[2].ro[1]}},
    esc:{c:P(L.E),r:ES,ri:+(ES*0.85).toFixed(3),pin:{z:T.ep,r:TB[3].ro[1]}},cannon:{c:P(L.C),r:TB[4].ro[0]},change:{c:P(L.Mw),...tip(4,1),pin:{z:MWc[2],r:TB[5].ro[0]}},hour:{c:P(L.C),...tip(5,1)},
    ud:{c:P(TR.UD),...tip(6,1)},balance:{c:P(L.B),r:14.5},detentPivot:P(u(E.Ft)),mdetPivot:P([L.Fu[0]+spw.pivot[0],L.Fu[1]+spw.pivot[1]]),stopPin:P([4.0,-19.9]),
    clicks:MJ.pawls.filter(p=>/winding pawl/.test(p.name)).map(p=>({pivot:p.pivot,C:p.face.C})),mdet:{pivot:spw.pivot,C:spw.face.C},
    note:'the movement frame x, z (mm); the pawls\' pivots and contacts about the fusee\'s axis (L.Fu), as mechanisms.json gives them; the escape wheel\'s ri estimated'};
  const names={barrel:'barrel and mainspring',fusee:'fusee with its winding ratchet',ratchet:'sustaining ratchet',fw:'fusee wheel',centre:'centre arbor',cannon:'cannon pinion and minute hand',change:'minute wheel and pinion',
    hour:'hour wheel and hand',inter:'third arbor',sec:'fourth arbor and seconds hand',esc:'escape wheel',ud:'wind indicator wheel',key:'key','click 1':'winding pawl 1','click 2':'winding pawl 2','maintaining detent':'sustaining pawl'};
  const meta={model:'hamilton',names,geo,MS:TR.MESH.map(q=>({nm:q.nm,A:q.A,B:q.B,zA:q.zA,zB:q.zB,m:q.m})),ref,MSB:hp.SMAX,banked:true,KT:hp.KT,kdrv,CK:{p:TR.CK.p,hmax:TR.CK.hmax,rc:TR.CK.rc},DT:{p:TR.DT.p,hmax:TR.DT.hmax,rc:TR.DT.rc},
    RB:TR.RB,rho12:TR.rho(12/HPT),rho24:TR.rho(24/HPT),rho0:TR.rho(0),made:new Date().toISOString().slice(0,10)};
  const OUT=process.env.MC_TR_OUT||path.join(__dirname,'r_motion3d','hamilton','trace_last.js');fs.mkdirSync(path.dirname(OUT),{recursive:true});
  fs.writeFileSync(OUT,'/* generated by tools/hamilton_transmission_trace.js: not edited */\nconst TRDATA='+JSON.stringify({meta,S})+';\n');
  console.log(`wrote ${path.relative(path.join(__dirname,'..','..','..'),OUT)} (${(fs.statSync(OUT).size/1e6).toFixed(1)} MB): ${S.map(s=>`${s.name} ${s.n} frames`).join(', ')}; ${((Date.now()-T0)/1000).toFixed(0)} s`);})().catch(e=>{console.error(e);process.exitCode=1;});
