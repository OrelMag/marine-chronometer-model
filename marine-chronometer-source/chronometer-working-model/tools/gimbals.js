// The box and gimbals in a seaway: does the gimballed case keep the movement level, does it resonate with the ship or with the balance, and what reaches the escapement?
// The page swings the case as a pendulum with an estimated period (0.7 s, box.js GIM) under an illustrative sea; this weighs the case and the ring on the model
// (massprops.py: tools/gimbals.json) and runs them as two rigid bodies on their pivots, the ring on the box's at 3 and 9 and the case on the ring's at 6 and 12, driven by
// the ship's roll, pitch, yaw and heave (Newton-Euler about the gimbal centre, which moves with the box; RK4). Needs only Node.js:
//   node gimbals.js             (about 2½ minutes; exits with 1 if the case's own period falls among a ship's roll periods or the balance's beat, if it leans more than
//                                2 degrees from the apparent vertical in the heavy-weather sea, or if the accelerations it passes on come within half of what trips the escapement)
//   node gimbals.js --quick     (the bodies, their periods and the resonance only, about 20 s)
//   node gimbals.js --json OUT  (also writes the figures for the build-verification report)
//   node gimbals.js --model wempe [--quick] [--json OUT]   (the Wempe's: tools/gimbals_wempe.json, massprops.py --model wempe; its report is tools/wempe_gimbals.js's)
// The manual (Sec. II, p. 13): "The chronometer is leveled when originally inserted in the gimbals by adjusting the position of the case brackets and gimbal support
// straps": each pair of pivots is set over its centre of gravity. The model's are drawn, not levelled (the case's centre of gravity lies 7.8 mm to one side of its pivots'
// line), so the bodies are taken levelled: the case moved along x until its centre of gravity is under the case pivots' axis, the ring and case together along z under
// the ring's. The ship's motion is narrow-band random about each motion's period, with published periods and levels where there are any (named below), estimated where not.
const fs=require('fs'),path=require('path');
const WEMPE=process.argv[process.argv.indexOf('--model')+1]==='wempe'&&process.argv.includes('--model');   /* --model wempe: the Wempe's bodies, its balance's place from gimbals_wempe.json (PB) */
const GJ=JSON.parse(fs.readFileSync(path.join(__dirname,WEMPE?'gimbals_wempe.json':'gimbals.json'),'utf8'));
const mvSrc=WEMPE?'':fs.readFileSync(path.join(__dirname,'..','js','movement.js'),'utf8');
const D=Math.PI/180,G0=9.80665,TAU=2*Math.PI;
/* ---------- small vector and matrix helpers (3-vectors as arrays, 3×3 as arrays of rows) ---------- */
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],sc=(a,s)=>[a[0]*s,a[1]*s,a[2]*s],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],nrm=a=>Math.hypot(a[0],a[1],a[2]);
const mv=(M,v)=>[dot(M[0],v),dot(M[1],v),dot(M[2],v)],mm=(A,B)=>A.map(r=>[0,1,2].map(j=>r[0]*B[0][j]+r[1]*B[1][j]+r[2]*B[2][j])),tr=A=>[0,1,2].map(i=>[A[0][i],A[1][i],A[2][i]]);
const col=(A,j)=>[A[0][j],A[1][j],A[2][j]];
const Rx=a=>{const c=Math.cos(a),s=Math.sin(a);return[[1,0,0],[0,c,-s],[0,s,c]];},Ry=a=>{const c=Math.cos(a),s=Math.sin(a);return[[c,0,s],[0,1,0],[-s,0,c]];},Rz=a=>{const c=Math.cos(a),s=Math.sin(a);return[[c,-s,0],[s,c,0],[0,0,1]];};
const vee=W=>[(W[2][1]-W[1][2])/2,(W[0][2]-W[2][0])/2,(W[1][0]-W[0][1])/2];   /* the axial vector of a (nearly) skew matrix */

/* ---------- the bodies, SI, about the gimbal centre in the ring's frame at rest (y up; the ring's pivots on x, the case's on z) ---------- */
/* o.asDrawn: as the model draws them (not levelled) */
function bodies(o={}){
  const B=k=>{const q=GJ[k];return{m:q.m/1000,c:q.cg.map(x=>x/1000),I:q.I.map(r=>r.map(x=>x*1e-9))};};
  const move=(b,d)=>{const c0=b.c,c1=add(c0,d),m=b.m,P=c=>[[dot(c,c)-c[0]*c[0],-c[0]*c[1],-c[0]*c[2]],[-c[1]*c[0],dot(c,c)-c[1]*c[1],-c[1]*c[2]],[-c[2]*c[0],-c[2]*c[1],dot(c,c)-c[2]*c[2]]];
    const Ic=b.I.map((r,i)=>r.map((x,j)=>x-m*P(c0)[i][j]));return{m,c:c1,I:Ic.map((r,i)=>r.map((x,j)=>x+m*P(c1)[i][j]))};};   /* parallel axes: through the centre of gravity and out again */
  let bw=B('bowl'),rg=B('ring');const drawn={bowl:bw.c.map(x=>x*1000),ring:rg.c.map(x=>x*1000)};
  if(!o.asDrawn){bw=move(bw,[-bw.c[0],0,0]);const zc=(bw.m*bw.c[2]+rg.m*rg.c[2])/(bw.m+rg.m);bw=move(bw,[0,0,-zc]);rg=move(rg,[0,0,-zc]);}
  /* the small swings: each axis a pendulum; the case about z (the ring held), the ring with the case about x */
  const Iz=bw.I[2][2],kz=-bw.m*G0*bw.c[1],Ix=bw.I[0][0]+rg.I[0][0],kx=-G0*(bw.m*bw.c[1]+rg.m*rg.c[1]);
  return{bw,rg,drawn,wz:Math.sqrt(kz/Iz),wx:Math.sqrt(kx/Ix),Iz,Ix,kz,kx};
}
/* the balance and the escapement in the movement's frame (movement.js L.B, BAL_Y; the escapement's frame turned BETA about the staff), the movement's frame in the ring's (gimbals.json mv) */
const L=WEMPE?null:Function('return '+/const L=(\{[^;]*\});/.exec(mvSrc)[1])(),BAL_Y=WEMPE?0:+/BAL_Y=(-?[\d.]+)/.exec(mvSrc)[1];
const EU=WEMPE?[1,0]:(()=>{const dx=L.B[0]-L.E[0],dz=L.B[1]-L.E[1],l=Math.hypot(dx,dz);return[dx/l,dz/l];})(),BETA=Math.atan2(-EU[1],EU[0]);   /* the Wempe's: the movement's own frame */
const MV=[[GJ.mv[0],GJ.mv[4],GJ.mv[8]],[GJ.mv[1],GJ.mv[5],GJ.mv[9]],[GJ.mv[2],GJ.mv[6],GJ.mv[10]]],MVt=[GJ.mv[12],GJ.mv[13],GJ.mv[14]];
const PB=WEMPE?GJ.PB.map(x=>x/1000):add(mv(MV,[L.B[0],BAL_Y,L.B[1]]),MVt).map(x=>x/1000);   /* the balance, m, in the case's frame */
/* a specific force in the case's frame (x, z in its plane) into the escapement's unit frame (dynamics.js ext ax, ay): movement frame, then Ry(BETA)ᵀ */
const toEsc=f=>{const m=mv(tr(MV),f),c=Math.cos(BETA),s=Math.sin(BETA);return[m[0]*c-m[2]*s,m[0]*s+m[2]*c];};

/* ---------- the ship's motion: narrow-band random, each motion a lightly damped response (damping ratio 0.1, estimated) about its period, 80 waves with random phases ---------- */
const rng=seed=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
function band(T,rms,seed,z=0.1,n=80){const r=rng(seed),w0=TAU/T,ws=[],amp=[],ph=[];let s=0;
  for(let i=0;i<n;i++){const w=w0*(0.5+1.5*(i+r())/n),S=1/((w0*w0-w*w)**2+(2*z*w*w0)**2);ws.push(w);amp.push(S);ph.push(TAU*r());s+=S;}
  for(let i=0;i<n;i++)amp[i]=rms*Math.sqrt(2*amp[i]/s);   /* Σ a²/2 = rms² */
  return{f:t=>{let x=0;for(let i=0;i<n;i++)x+=amp[i]*Math.sin(ws[i]*t+ph[i]);return x;},ws,amp,ph};}
/* sc: roll (period Tr s, rms deg), pitch (Tp, rms), yaw (Ty, rms), heave as the vertical acceleration (Th, rms g), the box's place from the ship's centre of motion
   (rd m above it, lz m forward); or a regular roll (reg: [period, amplitude deg]) */
function ship(sc,seed=1){
  if(sc.reg){const[T,a]=sc.reg,w=TAU/T;return{ang:t=>[0,0,a*D*Math.sin(w*t)],pos:()=>[0,0,0],rd:sc.rd??0,lz:0};}
  const R=band(sc.Tr,sc.roll*D,seed),P=band(sc.Tp,sc.pitch*D,seed+1),Y=band(sc.Ty??sc.Tr,(sc.yaw??0)*D,seed+2),Hw=band(sc.Th??sc.Tp,(sc.heave??0)*G0,seed+3);
  const heave=t=>{let x=0;for(let i=0;i<Hw.ws.length;i++)x-=Hw.amp[i]/(Hw.ws[i]*Hw.ws[i])*Math.sin(Hw.ws[i]*t+Hw.ph[i]);return x;};   /* the acceleration's integral twice */
  return{ang:t=>[Y.f(t),P.f(t),R.f(t)],pos:t=>[0,heave(t),0],rd:sc.rd??8,lz:sc.lz??0};}
/* the box's pose: the ship's frame x athwartships, y up, z forward; yaw about y, pitch about x, roll about z; the box's axes the ship's (the case's pivots fore and aft, so it
   swings to the roll; the ring's athwartships, to the pitch) */
const pose=(S,t)=>{const[y,p,r]=S.ang(t),R=mm(Ry(y),mm(Rx(p),Rz(r)));return{R,o:add(S.pos(t),mv(R,[0,S.rd,S.lz]))};};
function boxMotion(S,t,h=1e-3){const P0=pose(S,t),Pm=pose(S,t-h),Pp=pose(S,t+h);
  const wAt=(Pa,Pb,Pc)=>vee(mm(tr(Pc.R.map((r,i)=>r.map((x,j)=>(x-Pa.R[i][j])/(2*h)))),Pb.R).map((r,i)=>r))&&vee(mm(Pc.R.map((r,i)=>r.map((x,j)=>(x-Pa.R[i][j])/(2*h))),tr(Pb.R)));
  const w=wAt(Pm,P0,Pp),wm=wAt(pose(S,t-2*h),Pm,P0),wp=wAt(P0,Pp,pose(S,t+2*h)),wd=sc(sub(wp,wm),1/(2*h));
  const a=sc(add(sub(Pp.o,sc(P0.o,2)),Pm.o),1/(h*h));return{R:P0.R,w,wd,a};}

/* ---------- the gimbals in time ---------- */
/* o: zeta (the pivots' damping as a share of critical, each axis; the page's 0.05, estimated), stop (deg; the drawn box's, massprops.py), stopK (N/m, the case's edge
   on the box's wood, estimated 1e6) at stopR (m, its radius, the case's 55 mm), stopE (restitution, 0.3 estimated), poise (the balance's centre of gravity off its staff, m, and
   its mass, kg: a force at its beat), T, dt, from (stats after) */
function run(Bd,S,o={}){
  const{bw,rg}=Bd,z=o.zeta??0.05,cz=2*z*Math.sqrt(Bd.kz*Bd.Iz),cx=2*z*Math.sqrt(Bd.kx*Bd.Ix),gv=[0,-G0,0];
  const st=(o.stop??GJ.stops.bowl[0].deg)*D,sr=(o.stopR??0.055),Ks=(o.stopK??1e6)*sr*sr,eS=o.stopE??0.3,zS=-Math.log(eS)/Math.sqrt(Math.PI**2+Math.log(eS)**2);
  const csz=2*zS*Math.sqrt(Ks*Bd.Iz),csx=2*zS*Math.sqrt(Ks*Bd.Ix);
  const T=o.T??300,from=o.from??20,stats={bl:0,blMax:0,bv:0,n:0,tilt:0,tiltMax:0,app:0,appMax:0,fpl:0,fplMax:0,al:0,alMax:0,hits:0,hitW:0,hitAcc:0,fv:0,fvMax:0},rec=o.rec?[]:null;
  let al_=0,be=0,ad=0,bd=0,t=0,inS=[false,false];const lastOff=[-1e9,-1e9];   /* a blow: on a stop after a quarter second off it (its bounces are one blow) */
  /* accelerations of the two coordinates; also returns what the case's balance feels */
  const acc=(t,al_,be,ad,bd,M)=>{const Rr=mm(M.R,Rx(al_)),Rb=mm(Rr,Rz(be)),a1=col(M.R,0),a2=col(Rr,2),wr=add(M.w,sc(a1,ad)),wb=add(wr,sc(a2,bd));
    const Ir=mm(mm(Rr,rg.I),tr(Rr)),Ib=mm(mm(Rb,bw.I),tr(Rb)),cr=mv(Rr,rg.c),cb=mv(Rb,bw.c),e=sub(M.a,gv);
    const w0r=add(M.wd,cross(M.w,sc(a1,ad))),w0b=add(w0r,cross(wr,sc(a2,bd)));
    const gb=add(add(mv(Ib,w0b),cross(wb,mv(Ib,wb))),sc(cross(cb,e),bw.m)),gr=add(add(mv(Ir,w0r),cross(wr,mv(Ir,wr))),sc(cross(cr,e),rg.m));
    let Qb=-cz*bd,Qr=-cx*ad;   /* the pivots' damping, against the case's turn in the ring and the ring's in the box */
    const over=(q,qd,K,C)=>Math.abs(q)>st?-Math.sign(q)*Math.max(0,K*(Math.abs(q)-st)+C*Math.sign(q)*qd):0;Qb+=over(be,bd,Ks,csz);Qr+=over(al_,ad,Ks,csx);
    /* [a1·(Ir+Ib)a1, a1·Ib a2; a2·Ib a1, a2·Ib a2] [α'', β''] = [Qr - a1·(gr+gb), Qb - a2·gb] */
    const A11=dot(a1,mv(Ir,a1))+dot(a1,mv(Ib,a1)),A12=dot(a1,mv(Ib,a2)),A21=dot(a2,mv(Ib,a1)),A22=dot(a2,mv(Ib,a2)),r1=Qr-dot(a1,add(gr,gb)),r2=Qb-dot(a2,gb),det=A11*A22-A12*A21;
    const add_=(r1*A22-A12*r2)/det,bdd=(A11*r2-A21*r1)/det;
    return{add_,bdd,Rb,wb,wdb:add(add(w0b,sc(a1,add_)),sc(a2,bdd))};};
  const motion=tt=>boxMotion(S,tt);let Mc=motion(0);
  const hc=o.dtc??2e-3;let i=0,nextRec=from;
  while(t<T){const near=Math.abs(be)>st-2*D||Math.abs(al_)>st-2*D,h=Math.min(near?(o.dt??2e-4):hc,T-t);i++;const M0=Mc,Mh=motion(t+h/2),M1=motion(t+h);
    const f=(M,q)=>{const r=acc(0,q[0],q[1],q[2],q[3],M);return[q[2],q[3],r.add_,r.bdd];};
    const q0=[al_,be,ad,bd],k1=f(M0,q0),k2=f(Mh,q0.map((x,j)=>x+h/2*k1[j])),k3=f(Mh,q0.map((x,j)=>x+h/2*k2[j])),k4=f(M1,q0.map((x,j)=>x+h*k3[j]));
    [al_,be,ad,bd]=q0.map((x,j)=>x+h/6*(k1[j]+2*k2[j]+2*k3[j]+k4[j]));t+=h;Mc=M1;
    /* the stops: an entry counted with its speed */
    for(const[k,q,qd]of[[0,al_,ad],[1,be,bd]]){const on=Math.abs(q)>st;if(on&&!inS[k]){if(t-lastOff[k]>0.25)stats.hits++;stats.hitW=Math.max(stats.hitW,Math.abs(qd));}if(!on&&inS[k])lastOff[k]=t;inS[k]=on;}
    if(t<from)continue;
    /* what the balance feels: its point's acceleration, the specific force (a - g) in the case's frame; the case's lean from the true and the apparent vertical; the turn about the staff */
    const r=acc(t,al_,be,ad,bd,Mc),p=mv(r.Rb,PB),aP=add(add(Mc.a,cross(r.wdb,p)),cross(r.wb,cross(r.wb,p))),fw=sub(aP,gv),fb=mv(tr(r.Rb),fw),s=col(r.Rb,1);
    const tilt=Math.acos(Math.min(1,s[1])),app=Math.acos(Math.min(1,dot(s,fw)/nrm(fw))),fpl=Math.hypot(fb[0],fb[2]),alS=dot(r.wdb,s);
    {const fbx=mv(tr(Mc.R),sub(Mc.a,gv));stats.bl+=fbx[0]**2;stats.blMax=Math.max(stats.blMax,Math.abs(fbx[0]));stats.bv+=(fbx[1]-G0)**2;}
    stats.n++;stats.tilt+=tilt*tilt;stats.app+=app*app;stats.fpl+=fpl*fpl;stats.al+=alS*alS;stats.fv+=(fb[1]-G0)**2;
    stats.tiltMax=Math.max(stats.tiltMax,tilt);stats.appMax=Math.max(stats.appMax,app);stats.fplMax=Math.max(stats.fplMax,fpl);stats.alMax=Math.max(stats.alMax,Math.abs(alS));stats.fvMax=Math.max(stats.fvMax,Math.abs(fb[1]-G0));
    if(Math.abs(be)>st||Math.abs(al_)>st)stats.hitAcc=Math.max(stats.hitAcc,Math.abs(r.bdd),Math.abs(r.add_));
    if(rec&&t>=nextRec){nextRec+=o.rec;const ex=toEsc(fb);rec.push([+t.toFixed(4),+(tilt/D).toFixed(3),+(app/D).toFixed(3),+ex[0].toFixed(4),+ex[1].toFixed(4),+alS.toFixed(4),+(be/D).toFixed(3),+(al_/D).toFixed(3)]);}}
  const q=k=>Math.sqrt(stats[k]/Math.max(1,stats.n));
  return{boxLat:q('bl')/G0,boxLatMax:stats.blMax/G0,boxVert:q('bv')/G0,tilt:q('tilt')/D,tiltMax:stats.tiltMax/D,app:q('app')/D,appMax:stats.appMax/D,fpl:q('fpl')/G0,fplMax:stats.fplMax/G0,fv:q('fv')/G0,fvMax:stats.fvMax/G0,al:q('al'),alMax:stats.alMax,hits:stats.hits,hitW:stats.hitW,hitAcc:stats.hitAcc,rec};
}
module.exports={bodies,run,ship,band,toEsc,PB,BETA,GJ};
if(require.main!==module)return;
if(WEMPE){require('./wempe_gimbals.js')(module.exports);return;}

/* ---------- the report ---------- */
const ji=process.argv.indexOf('--json'),JOUT=ji>0?process.argv[ji+1]:null,RW=[],J={made:new Date().toISOString().slice(0,10)};let fail=0;
const say=s=>RW.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;RW.push(`${ok?'  ok ':'  !! '} ${s}`);};
const f=(x,n=2)=>(+x).toFixed(n),t0=Date.now(),flush=()=>{console.log(RW.splice(0).join('\n'));console.log(`  (${f((Date.now()-t0)/1000,0)} s)`);};
const DY=require('./dynamics.js'),TP=JSON.parse(fs.readFileSync(path.join(__dirname,'tripping.json'),'utf8'));
const Bd=bodies(),Bdr=bodies({asDrawn:true}),Tz=TAU/Bd.wz,Tx=TAU/Bd.wx;

say('1. The swinging bodies, weighed on the model (massprops.py: every solid at its material\'s density)');
say(`the case with the movement in it ${f(Bd.bw.m*1000,0)} g (the case ${f(GJ.bowl.byPart.bowl,0)}, the pillar plate ${f(GJ.bowl.byPart.pillar,0)}, the mainspring ${f(GJ.bowl.byPart.mainspring,1)}); the gimbal ring ${f(Bd.rg.m*1000,0)} g`);
say(`as drawn the case's centre of gravity lies ${f(-Bdr.drawn.bowl[1],1)} mm below the gimbal centre and ${f(Bdr.drawn.bowl[0],1)} mm to one side of its pivots' line: hung so, it would lean ${f(Math.atan2(Bdr.drawn.bowl[0],-Bdr.drawn.bowl[1])/D,0)}°, past the ${f(GJ.stops.bowl[0].deg,1)}° it swings before it meets the box. The drawn pivots are not levelled; the manual levels them (p. 13: "by adjusting the position of the case brackets and gimbal support straps"), and so does this`);
say(`levelled, the case swings on its pivots (6-12) with a period of ${f(Tz,3)} s and the ring, carrying it, on its own (3-9) ${f(Tx,3)} s (the page took 0.7 s, estimated); radius of gyration about the case's pivots ${f(Math.sqrt(Bd.Iz/Bd.bw.m)*1000,0)} mm, its centre of gravity ${f(-Bd.bw.c[1]*1000,1)} mm under them`);
J.bodies={bowl:{m:Bd.bw.m,c:Bd.bw.c,drawn:Bdr.drawn.bowl,Iz:Bd.Iz},ring:{m:Bd.rg.m,c:Bd.rg.c,drawn:Bdr.drawn.ring},Tz,Tx,stops:GJ.stops,byPart:GJ.bowl.byPart};
flush();

say('2. Resonance: the case driven by a regular roll of 2° about the box itself, at periods from a third of a second to twenty');
const PER=[0.25,0.3,0.4,0.5,0.6,0.65,0.68,0.7,0.72,0.74,0.76,0.8,0.9,1,1.25,1.5,2,3,4,6,8,12,16,20],RES=[];
for(const T of PER){const r=run(Bd,ship({reg:[T,2],rd:0}),{T:Math.max(30,T*12),from:Math.max(20,T*6)});RES.push([T,r.appMax/2,r.tiltMax/2]);}
const pk=RES.reduce((a,b)=>b[1]>a[1]?b:a),at=T=>RES.find(r=>Math.abs(r[0]-T)<1e-9);
say(`the case's lean from the apparent vertical, per degree of roll: ${f(at(20)[1],3)} at 20 s, ${f(at(8)[1],3)} at 8 s, ${f(at(4)[1],2)} at 4 s; ${f(pk[1],1)} at its own period (${pk[0]} s); ${f(at(0.5)[1],2)} at the balance's 0.5 s`);
chk(Tz<0.5*3&&Tx<0.5*3&&Tz>0.5*1.15&&Tx>0.5*1.15,`its own periods (${f(Tz,2)}, ${f(Tx,2)} s) lie far below a ship's roll (10-30 s for merchant ships: MARIN, Jachowski; a small craft's 3-6 s, estimated) and clear of the balance's beat (0.5 s) by ${f(100*(Math.min(Tz,Tx)/0.5-1),0)} %`);
J.res=RES;
/* the balance's beat: a balance out of poise by e (its centre of gravity off its staff) swinging A at 2 Hz pushes the case sideways at 2 Hz (its angular acceleration) and 4 Hz
   (its speed squared); the case's answer, about its pivots */
{const mb=GJ.bowl.byPart.bal/1000,e=2e-6,A=DY.ESC.A,w=TAU*2,h=-PB[1],F2=mb*e*A*w*w,F4=mb*e*(A*w)**2/2,resp=(F,wf)=>F*h/Math.hypot(Bd.kz-Bd.Iz*wf*wf,2*0.05*Math.sqrt(Bd.kz*Bd.Iz)*wf);
  say(`the balance's beat (${f(mb*1000,1)} g, out of poise by 2 µm, estimated; ${f(h*1000,1)} mm below the pivots) pushes the case at 2 Hz with ${f(F2*1e6,1)} µN and at 4 Hz with ${f(F4*1e6,1)} µN: it swings ${(resp(F2,w)/D*3600).toFixed(2)}" and ${(resp(F4,2*w)/D*3600).toFixed(2)}" (seconds of arc). Its impulses are turns about the staff, which the gimbals don't take`);
  J.beat={mb,e,F2,F4,t2:resp(F2,w),t4:resp(F4,2*w)};}
flush();

if(process.argv.includes('--quick')){if(fail)process.exitCode=1;return;}
say('3. At sea: the ship\'s motion narrow-band random, 10 minutes each (rms; the box\'s place from the ship\'s centre of motion; estimated but for the periods and NORDFORSK\'s 0.12 g)');
/* within: seas a merchant ship works in, up to NORDFORSK's limit (the box's athwartships acceleration, gravity's share with it, 0.12 g rms at the bridge): judged.
   beyond: heavier, and a small vessel's quicker motion: reported */
const SEAS=[['a cargo ship, moderate sea',{Tr:14,roll:3,Tp:8,pitch:1,Ty:14,yaw:1,Th:8,heave:0.05,rd:8,lz:20},'within'],
  ['a cargo ship at the NORDFORSK limit',{Tr:14,roll:6,Tp:8,pitch:2.25,Ty:14,yaw:2,Th:8,heave:0.11,rd:8,lz:20},'within'],
  ['a cargo ship beyond it',{Tr:14,roll:8,Tp:8,pitch:3,Ty:14,yaw:2,Th:8,heave:0.15,rd:8,lz:20},'beyond'],
  ['a small vessel, rough',{Tr:5,roll:8,Tp:3.5,pitch:4,Ty:5,yaw:3,Th:3.5,heave:0.2,rd:2,lz:3},'beyond'],
  ['a storm: rolls to 35-45°',{Tr:14,roll:15,Tp:8,pitch:4,Ty:14,yaw:3,Th:8,heave:0.2,rd:8,lz:20},'beyond']];
const ST=[];
for(const[nm,sc_,kind]of SEAS){const r=run(Bd,ship(sc_,7),{T:620,from:20,rec:0.002});
  /* what it passes on, run through the escapement in time (dynamics.js) for 100 s against still water: the specific force in the escapement's plane, the turn about the staff */
  const R=r.rec,idx=tt=>{const k=Math.min(R.length-2,Math.max(0,Math.floor((tt-R[0][0])/0.002)));return k;},ext=tt=>{const q=R[idx(tt+20)];return{ax:q[3],ay:q[4],al:q[5]};};
  const calm=DY.sim({mode:'phys',A:255,T:110,from:10}),sea=DY.sim({mode:'phys',A:255,T:110,from:10,ext});
  const stp=GJ.stops.bowl[0].deg;let hw=0,was=false,off=-1e9;for(const q of R){if(q[0]<20||q[0]>130)continue;const on=Math.abs(q[6])>stp||Math.abs(q[7])>stp;if(on&&!was&&q[0]-off>0.25)hw++;if(!on&&was)off=q[0];was=on;}   /* blows inside the escapement's 100 s */
  const row={name:nm,kind,hitsWin:hw,perHit:hw?(sea.rate-calm.rate)/86400*100/hw:0,sc:sc_,...Object.fromEntries(Object.entries(r).filter(([k])=>k!=='rec')),rate:sea.rate-calm.rate,trips:sea.trips,A:sea.A,trace:ST.length===1?R.filter((_,i)=>i%50===0&&R[i][0]<=140).map(q=>[q[0],q[1],q[2]]):null};ST.push(row);
  say(`  ${nm.padEnd(36)} the box ${f(r.boxLat,3)} g rms athwartships (${f(r.boxLatMax,2)} at most), ${f(r.boxVert,3)} g up and down; the case leans ${f(r.tilt,1)}° rms (${f(r.tiltMax,1)}° at most) from the true vertical, ${f(r.app,2)}° (${f(r.appMax,2)}°) from the apparent; ${r.hits} on its stops${r.hits?` (at ${f(r.hitW,2)} rad/s)`:''}`);
  say(`  ${''.padEnd(36)} the escapement feels ${f(r.fplMax*1000,1)} mg in its plane at most and ${f(r.alMax,3)} rad/s² about the staff; in time over 100 s the swing ${f(sea.A,1)}°, the rate ${sea.rate-calm.rate>=0?'+':'−'}${f(Math.abs(sea.rate-calm.rate),3)} s a day against still water${hw?` (${hw} blows on the stops in those 100 s: about ${f(Math.abs(row.perHit)*1e3,2)} ms each)`:''}, ${sea.trips} trips`);}
J.seas=ST;
const lim=ST[1],storm=ST[ST.length-1],IN=ST.filter(s=>s.kind==='within');
chk(lim.boxLat<0.125&&lim.boxLat>0.1,`the limiting sea is NORDFORSK's (1987): the box's athwartships acceleration ${f(lim.boxLat,3)} g rms against its 0.12 g at the bridge`);
chk(IN.every(s=>s.appMax<2&&s.hits===0),`in the seas a ship works in the case never reaches its stops and keeps within ${f(Math.max(...IN.map(s=>s.appMax)),2)}° of the apparent vertical (${f(Math.max(...IN.map(s=>s.tiltMax)),1)}° of the true): the balance's pivots see the load along the staff`);
const kn=TP.lock.rows[0].blow;chk(ST.every(s=>s.fplMax<kn/2&&s.trips===0),`what reaches the escapement is far from what trips it: at most ${f(Math.max(...ST.map(s=>s.fplMax))*1000,0)} mg in its plane against ${f(kn,0)} g (tripping.js's 3 ms blow), and no trips`);
chk(IN.every(s=>Math.abs(s.rate)<0.05),`in them the rate moves under 0.05 s a day (at most ${f(Math.max(...IN.map(s=>Math.abs(s.rate))),3)}): the gimbals do their work`);
{const B=ST.filter(s=>s.kind!=='within'&&s.hitsWin);if(B.length)say(`beyond them the case swings onto its stops (the drawn box's ${f(GJ.stops.bowl[0].deg,1)}°, estimated), and each blow turns the case a little about the staff: the balance loses or gains ${B.map(s=>f(Math.abs(s.perHit)*1e3,2)).join('-')} ms a blow, ${B.map(s=>f(Math.abs(s.rate),2)).join('-')} s a day while it lasts. A hard passage carries that into the day's rate; the navigator's daily comparison takes it up, and wider stops (the box's inside) would keep the case off them longer`);}
flush();

say('4. The stops: the case swung onto the box');
{const hitS=storm.hits?storm:null,acc=hitS?hitS.hitAcc*Math.hypot(PB[0],PB[1],PB[2])/G0:0;
  say(hitS?`in the storm it reaches its stops ${hitS.hits} times in 10 minutes, at up to ${f(hitS.hitW,2)} rad/s: decelerated on the box's wood (1e6 N/m at the case's 55 mm, restitution 0.3: estimated) the balance, ${f(Math.hypot(...PB)*1000,0)} mm from the pivots, sees ${f(acc,1)} g for a few ms, against the ${f(kn,0)} g that trips it`:`in none of the seas does the case reach its stops (${f(GJ.stops.bowl[0].deg,1)}°)`);
  /* a roll big enough to reach them, regular */
  const big=[30,35,40,45].map(a=>{const r=run(Bd,ship({reg:[14,a],rd:8}),{T:14*6+20,from:14*3});return[a,r.hits,r.hitW,r.hitAcc*Math.hypot(...PB)/G0];});
  for(const[a,n,w,g]of big)say(`  a regular roll of ${a}° (14 s, 8 m above the centre): ${n?`onto its stops each way (${n} blows in 104 s), at up to ${f(w,2)} rad/s; the balance ${f(g,1)} g`:"clear of the stops"}`);
  J.stops={storm:hitS?{hits:hitS.hits,w:hitS.hitW,g:acc}:null,big};
  chk(big.every(b=>b[3]<kn/2),`a case swung onto its stops passes on at most ${f(Math.max(...big.map(b=>b[3])),1)} g to the balance: harmless to the escapement (the gimbals' pivots and the case's finish take the blows)`);}
flush();
J.time=(Date.now()-t0)/1000;if(JOUT)fs.writeFileSync(JOUT,JSON.stringify(J));
if(fail)process.exitCode=1;
