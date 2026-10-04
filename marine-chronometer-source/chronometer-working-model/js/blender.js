/* blender.js: the instrument as a glTF (.glb) for Blender, every part a node in the model's own hierarchy (box, ring, bowl, movement, parts, arbors, pieces), named,
   in its materials, with every motion the model has as an animation (Blender: an action each), and the tables the rig (blender/rig.py, js/rigpy.js) drives it from.
   The export builds a copy of its own (buildBox, buildMovement, set as the page's choices are: A.config), so the model on the page is never touched: update() keeps
   state from call to call (the maintaining work's catch), and each clip is played through the copy in time order, from the same equations as app.js's loop. What
   moves is read back off the copy's nodes: a node that changes gets a track (translation, rotation, scale; hidden is scale 0); a piece rebuilt as it moves (the hairspring,
   the trip spring, the mainspring, the springs of the maintaining work) shape keys while its vertices and triangles stay the same, else a flipbook of its shapes; the
   chain one node a link. One IIFE; the page sees only BLENDER. app.js calls BLENDER.bind() once the model is built */
const BLENDER=(()=>{
  let A=null;const FPS=30,TOLP=0.0005,TOLQ=0.00005,TOLS=0.004,FLIPS=48;   /* tolerances: translation (mm), rotation (quaternion), a shape's vertices (mm); FLIPS: the most shapes a flipbook takes in a clip */
  const sleep=()=>new Promise(r=>setTimeout(r,0)),say=t=>{const r=document.getElementById('mkRead');if(r)r.innerHTML=t;};
  function save(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);}
  /* ---------- the copy, set as the page is ---------- */
  function copy(){const BX=buildBox(A.M),mv=buildMovement(A.M);BX.bowl.add(mv);A.config(mv);const R=mv.userData.R,ms=[],inMv=new Set();mv.traverse(o=>inMv.add(o));
    const partOf=o=>{for(;o;o=o.parent)if(o.userData&&o.userData.partName)return o.userData.partName;return null;};
    BX.root.traverse(o=>{if(o.isMesh){o.userData.part=partOf(o);o.userData.v0=o.visible;o.userData.inBox=!inMv.has(o);ms.push(o);}});
    return{BX,mv,R,ms};}
  /* the page's look for a state (app.js look()): laid out (dv), the real plates and the box give way to the schematic plates; setting the hands (ks), the bezel and crystal are off */
  function look(C,dv,ks){for(const m of C.ms){const u=m.userData;let v=u.v0;
    if(u.devPlate)v=v&&dv;else if(dv&&(A.DRIVE_HIDE.has(u.part)||u.driveHide||u.inBox))v=false;if(ks&&u.bezel)v=false;m.visible=v;}}
  /* a state: the movement's (MoveState), the views' (lids, lift and turn, explode, laid out), the box's (pitch, roll, the case's angles in the gimbals, latch, twist), the shield plate */
  const REST=()=>({E:0,th:0,lift:0,psDef:0,n:0,winding:false,slip:0,hkeyOn:false,keyOn:false,blk:0,arm:0,dt:0,lidM:1,lidT:1,up:0,flip:0,ex:0,dev:0,pitch:0,roll:0,gp:0,gr:0,latch:0,tw:0,sh:null,teeth:null});
  function apply(C,s){const{BX,mv}=C;
    mv.userData.update({E:s.E,th:s.th,lift:s.lift,psDef:s.psDef,n:s.n,winding:s.winding,slip:s.slip,hkeyOn:s.hkeyOn,keyOn:s.keyOn,blk:s.blk,arm:s.arm,ssX:0,dt:s.dt,springOn:true,msOn:true});
    BX.shield.userData.turn(s.sh==null?BX.shRest:s.sh);
    const lM=s.up>0.05?Math.max(s.lidM,0.97):s.lidM,lT=s.up>0.05?Math.max(s.lidT,0.97):s.lidT;BX.mid.rotation.x=-lM*1.6;BX.top.rotation.x=-Math.max(0,lT*1.92-lM*1.6);   /* as app.js frame() */
    mv.userData.explode(smooth(s.ex));mv.userData.develop(smooth(s.dev));
    const L1=smooth(s.up/0.55),L2=smooth((s.up-0.35)/0.65);mv.position.y=L1*130+L2*95;mv.rotation.x=Math.min(smooth(s.flip),L2)*Math.PI;
    BX.root.rotation.set(s.pitch,s.tw,s.roll,'ZYX');BX.ring.rotation.x=s.gp-s.pitch;BX.bowl.rotation.z=s.gr-s.roll;BX.latch.rotation.y=lerp(LATCH_OFF,LATCH_ON,smooth(s.latch));
    look(C,s.dev>0.02,s.hkeyOn);}
  /* ---------- the train and balance through time: app.js frame()'s stop and start, drive and swing (ampStep, stopMove), at speed 1 ---------- */
  function sim(C,hrs){const R=C.R,drvF=A.drvF,H={amp:ESC.ampAt(drvF(hrs)),held:false,bph:0,bOff:0,eOff:0,Eh:0,arm:0,armT:0,blk:0,blkT:0,kick:0,tSim:0,hrs,lastE:null,winding:false};
    const blocked=()=>H.blk>R.tbs.userData.vFace,at=t=>{const x=t/0.5+H.bOff,kk=Math.floor(x),p=x-kk,z=ESC.state(p,H.amp);return{E:kk+z.prog+H.eOff,s:z};};
    H.twist=()=>{if(H.amp<0.5*D2R)H.bph=Math.floor(H.bph)+0.75;H.kick=160*D2R;};
    H.step=dt=>{const mvTo=(x,t,r)=>x+clamp(t-x,-dt/r,dt/r);H.arm=mvTo(H.arm,H.armT,0.8);const b=mvTo(H.blk,H.blkT,2.5),vf=R.tbs.userData.vFace;H.blk=(b>vf-0.005&&H.blk<=vf&&!R.blockClear(H.lastE??0))?Math.min(b,vf-0.005):b;
      const run=H.hrs<RUN_H,brake=H.arm>0.75,drv=H.winding?A.SUS*clamp(1-R.ssD/R.SMAX,0,1):run?drvF(H.hrs):0,driven=run&&!H.held;
      { let a=H.amp;if(H.kick>0&&a>=H.kick)H.kick=0;if(H.kick>0){a+=(H.kick-a)*(1-Math.exp(-dt/0.15));if(H.kick-a<0.2*D2R)H.kick=0;}
        else if(brake)a*=Math.exp(-dt/A.TAU_ARM);else{const u=driven?ESC.ampAt(drv)**2:0;a=Math.sqrt(u+(a*a-u)*Math.exp(-2*dt/A.TF));}H.amp=a<0.2*D2R&&!driven&&!H.kick?0:a; }
      let E,s;
      if(!H.held){let q=at(H.tSim);const Eb=H.lastE??q.E,locked=q.s.prog<=0||q.s.prog>=1,room=blocked()?Math.floor(Eb+R.blockRoom(Eb)+1e-6):Infinity,hold=()=>{H.held=true;H.bph=H.tSim/0.5+H.bOff;};
        if(dt>0&&locked&&(!run||H.amp<ESC.AMIN||brake||Eb+1>room)){hold();H.Eh=Eb;E=Eb;s=q.s;}
        else{if(dt>0){H.tSim+=dt;if(!H.winding)H.hrs=Math.min(RUN_H,H.hrs+dt/3600);q=at(H.tSim);}E=Math.min(q.E,room);s=q.s;if(q.E>room){hold();H.Eh=room;}}}
      if(H.held){H.bph+=dt/0.5;const p=((H.bph%1)+1)%1;s=ESC.state(p,H.amp);E=H.Eh;const lockedP=s.prog<=0||s.prog>=1;
        if(run&&!brake&&H.amp>=ESC.AMIN&&!(blocked()&&H.Eh+1>Math.floor(H.Eh+R.blockRoom(H.Eh)+1e-6))&&lockedP){H.held=false;H.bOff=(((H.bph-H.tSim/0.5)%1)+1)%1;const x=H.tSim/0.5+H.bOff;H.eOff=H.Eh-(Math.floor(x)+(s.prog>=1?1:0));}}
      H.lastE=E;return{E,th:s.th,lift:s.lift,psDef:s.psDef,n:H.hrs*FUSEE_PER_HOUR,blk:H.blk,arm:H.arm,winding:H.winding,dt};};
    return H;}
  /* the phases of a beat sampled: evenly, 120 a beat (a straight line between two is then within 0.1 degree of the balance at its fastest), and closely where the escapement acts (unlocking, impulse: the detent, trip spring and escape wheel move in a few hundredths of a beat) */
  function beatGrid(amp){const N=2400,P=new Set();for(let i=0;i<120;i++)P.add(i/120);let last=-1,z0=ESC.state(0,amp);
    for(let i=1;i<=N;i++){const z=ESC.state(i/N,amp);if((z.prog!==z0.prog||z.lift!==z0.lift||z.psDef!==z0.psDef)&&i/N-last>=1/720){P.add((i-1)/N);last=(i-1)/N;}z0=z;}
    return[...P].filter(p=>p<1).sort((a,b)=>a-b);}
  /* the gimbals' pendulum (app.js gimStep): the case hangs below each axis, ψ'' = -ω0²ψ - 2ζω0(ψ' - φ'), stopped 25 degrees off the box */
  function gimbal(){const GW0=TAU/0.7,GZ=0.05,G={p:[0,0],r:[0,0],lp:0,lr:0};
    G.step=(dt,ph,rl)=>{const n=Math.ceil(dt/0.002),h=dt/n,vp=(ph-G.lp)/dt,vr=(rl-G.lr)/dt;
      for(const[q,v,f0]of[[G.p,vp,G.lp],[G.r,vr,G.lr]]){for(let i=0;i<n;i++){q[1]+=h*(-GW0*GW0*q[0]-2*GZ*GW0*(q[1]-v));q[0]+=h*q[1];}const f=f0+v*dt,lim=25*D2R;if(Math.abs(q[0]-f)>lim){q[0]=f+Math.sign(q[0]-f)*lim;q[1]=v;}}
      G.lp=ph;G.lr=rl;};return G;}
  /* ---------- the clips: each calls emit(t, state) in time order; len: its length (s), rig: the parameter the rig drives it by ---------- */
  const ramp=(t,a,b)=>clamp((t-a)/(b-a),0,1);
  function clips(C,h0,E0){const amp0=ESC.ampAt(A.drvF(h0)),G=beatGrid(amp0),st=o=>Object.assign(REST(),{n:h0*FUSEE_PER_HOUR,E:E0},o);
    const runFor=(S,beats,emit,extra)=>{let tp=0;const go=t=>{const o=S.step(t-tp);tp=t;emit(t,st(Object.assign(o,extra?extra(t):{})));};for(let b=0;b<beats;b++)for(const p of G)go((b+p)*0.5);go(beats*0.5);};
    const uni=(dur,f,emit)=>{const n=Math.round(dur*FPS);for(let i=0;i<=n;i++){const t=dur*i/n;emit(t,f(t,i?dur/n:0));}};
    const beat=(emit,n,secs)=>{for(let i=0;i<=n;i++){const p=i/n,z=ESC.state(Math.min(p,0.99999),amp0),e=p<1?z.prog:1;emit(p*secs,st({E:e,th:z.th,lift:z.lift,psDef:z.psDef,teeth:e}));}};
    const out=(t,a,b,c,d)=>ramp(t,a,b)-ramp(t,c,d);   /* up from a to b, down from c to d */
    const HT=0.5/FUSEE_PER_HOUR,hW=RUN_H-0.25,wT=Math.ceil(hW/HT),per=A.rollP();
    return[
      {name:'Running',len:60,d:'the escapement and train for a minute, the second hand once round',run:emit=>runFor(sim(C,h0),120,emit)},
      {name:'Beat (slow motion)',len:10,d:'one beat twenty times slower: unlocking, impulse, the wheel locked again a tooth on',run:emit=>beat(emit,400,10)},
      /* the fusee is geared to the train, so the escape wheel goes with it, 7200 beats an hour (else the maintaining work's catch takes up the turn: update()); the arbors
         turning more than half a radian a frame (escape, fourth, third, seconds) are left out of it, as a blur */
      {name:'Run down',len:30,fast:RUN_H*7200/(30*FPS),d:'56¼ hours in 30 s: the chain off the fusee onto the barrel, the mainspring letting down, the up-down hand, the minute and hour hands',rig:{p:'n',a:0,b:FUSEE_TURNS},
        run:emit=>uni(30,t=>{const h=RUN_H*t/30;return st({n:h*FUSEE_PER_HOUR,E:E0+(h-h0)*7200});},emit)},
      {name:'Winding',len:wT+6,d:'wound with the key from a quarter of an hour short of run down, the sustaining spring driving the train meanwhile, until the stop-bar meets the winding stop',run:emit=>{
        const S=sim(C,hW),T0=1;let tp=0,sh=C.BX.shRest,hz=-1;
        for(let i=0;;i++){const t=i/60;if(t>T0+wT+5)break;const dt=t-tp;tp=t;const kt=t-T0,on=kt>=0&&(hz<0||kt<hz+3);   /* half turns of 0.7 s with a 0.3 s pause to change grip (kwStep); 3 s on the stop, then let go */
          if(on){S.winding=true;const j=Math.floor(kt);S.hrs=Math.max(0,hW-HT*(j+smooth(Math.min(1,(kt-j)/0.7))));if(S.hrs===0&&hz<0)hz=kt;}else S.winding=false;
          const o=S.step(dt),T=on?0:C.BX.shRest;sh=lerp(sh,T,1-Math.exp(-dt*(T?12:6)));emit(t,st(Object.assign(o,{keyOn:on,sh})));}}},
      {name:'Setting the hands',len:10,d:'the key on the centre arbor sets the hands an hour on, the train going',run:emit=>runFor(sim(C,h0),20,emit,t=>({slip:3600*smooth(ramp(t,1.5,8.5)),hkeyOn:t>0.5&&t<9.5}))},
      {name:'Stop and start',len:26,d:'the locking arm stops the balance and holds it; unlocked, a twist of the box starts it; the train-blocking screw comes down between the fourth wheel\'s spokes and up again',run:emit=>{
        const S=sim(C,h0);let tp=0,tw=-1;for(let i=0;i<=26*120;i++){const t=i/120,dt=t-tp;tp=t;S.armT=t>=1&&t<6?1:0;if(tw<0&&t>=8){S.twist();tw=t;}S.blkT=t>=15&&t<21?1:0;
          const o=S.step(dt),w=tw>=0?t-tw:-1;emit(t,st(Object.assign(o,{tw:w>0&&w<0.5?0.2*Math.sin(Math.PI*w/0.5)*(1-w/0.5):0})));}}},
      {name:'Exploded',len:11,d:'out of the case, turned over, the parts and screws apart along their arbors, and back',run:emit=>uni(11,t=>{const u=out(t,0,2.5,8.5,11);return st({up:u,flip:u,ex:out(t,2.5,5,6,8.5)});},emit)},
      {name:'Laid out',len:11,d:'the train laid out along the barrel-fusee line, as the textbooks draw it, and back',run:emit=>uni(11,t=>{const u=out(t,0,2.5,8.5,11);return st({up:u,flip:u,dev:out(t,2.5,5,6,8.5)});},emit)},
      {name:'Lift out',len:7,d:'the movement lifted out of its case and turned over, and back',run:emit=>uni(7,t=>{const u=out(t,0,3,4,7);return st({up:u,flip:u});},emit)},
      {name:'Lids',len:7,d:'the glass lid and the outer lid closed and opened again',run:emit=>uni(7,t=>{const c=out(t,0,3,4,7);return st({lidM:1-c,lidT:1-c});},emit)},
      {name:'Latch',len:4,d:'the latch lever brought in, locking the gimbals, and out again',run:emit=>uni(4,t=>st({latch:out(t,0,1.5,2.5,4)}),emit)},
      {name:'At sea',len:6*per,d:'the box rolling 14 degrees and pitching, the case swinging in its gimbals to stay level',run:emit=>{const wR=TAU/per,g=gimbal();
        uni(6*per,(t,dt)=>{const a=14*D2R,roll=a*Math.sin(t*wR),pitch=a*0.55*Math.sin(t*wR*0.7+1.1);if(dt>0)g.step(dt,pitch,roll);else{g.lp=pitch;g.lr=roll;}return st({roll,pitch,gp:g.p[0],gr:g.r[0]});},emit);}},
      /* the rig's (rig.py): one parameter each, from a to b over the clip; the strips that play them are timed by the control's properties */
      {name:'Rig · beat',len:0.5,d:'for the rig: one beat, the escape wheel a tooth on',rig:{p:'beat',a:0,b:1},run:emit=>beat(emit,240,0.5)},
      {name:'Rig · explode',len:2,d:'for the rig: the parts apart',rig:{p:'explode',a:0,b:1},run:emit=>uni(2,t=>st({ex:t/2}),emit)},
      {name:'Rig · laid out',len:2,d:'for the rig: the train laid out',rig:{p:'laid_out',a:0,b:1},run:emit=>uni(2,t=>st({dev:t/2}),emit)},
      {name:'Rig · lift',len:3,d:'for the rig: out of the case and turned over',rig:{p:'lift',a:0,b:1},run:emit=>uni(3,t=>st({up:t/3,flip:t/3}),emit)},
      {name:'Rig · lids',len:2,d:'for the rig: the lids, 0 open to 1 closed',rig:{p:'lids',a:0,b:1},run:emit=>uni(2,t=>st({lidM:1-t/2,lidT:1-t/2}),emit)},
      {name:'Rig · latch',len:1.5,d:'for the rig: the latch lever, 0 out to 1 in',rig:{p:'latch',a:0,b:1},run:emit=>uni(1.5,t=>st({latch:t/1.5}),emit)}];}
  /* ---------- the node table: every object under the box; the chain's links nodes of their own (as many as the chain ever has) ---------- */
  function table(C,nMax){const recs=[],RN=new Map();for(const k in C.R){const o=C.R[k];if(o&&o.isObject3D&&!RN.has(o))RN.set(o,k);}
    const PN=new Map(Object.entries(C.mv.userData.parts).map(([k,g])=>[g,k])),INFO=A.INFO,MK=new Map(MAKERS.map(m=>[m.id,m]));
    const title=p=>(INFO[p]||[p])[0],label=o=>{const p=PN.get(o);if(p)return title(p)+' ('+p+')';if(o===C.BX.root)return title('box');if(o===C.mv)return 'Movement';const r=RN.get(o);if(r)return r;
      if(o.userData.hn&&!o.userData.sub){const m=MK.get(o.userData.hn);if(m)return m.no+' '+m.name;}if(o.userData.partName&&!(o.parent&&o.parent.userData.partName===o.userData.partName))return title(o.userData.partName);return '';};
    const walk=(o,par)=>{if(o.isLight||o.isCamera)return;const r={o,par,kids:[],name:label(o)};recs.push(r);if(par)par.kids.push(r);
      if(o.isInstancedMesh)for(let k=0;k<nMax;k++){const l={o:null,im:o,k,par:r,kids:[],name:`chain link ${String(k+1).padStart(3,'0')}`};recs.push(l);r.kids.push(l);}
      for(const c of o.children)walk(c,r);};
    walk(C.BX.root,null);return recs;}
  /* ---------- reading the copy ---------- */
  const M4=new THREE.Matrix4(),V3=new THREE.Vector3(),Q4=new THREE.Quaternion(),S3=new THREE.Vector3();
  function read(r,out){if(r.im){const im=r.im,on=r.k<im.count;if(on){im.getMatrixAt(r.k,M4);M4.decompose(V3,Q4,S3);out[0]=V3.x;out[1]=V3.y;out[2]=V3.z;out[3]=Q4.x;out[4]=Q4.y;out[5]=Q4.z;out[6]=Q4.w;out[7]=S3.x;out[8]=S3.y;out[9]=S3.z;r.lt=Float32Array.from(out);}
      else{if(r.lt)out.set(r.lt);else{out.fill(0);out[6]=1;}out[7]=out[8]=out[9]=0;}return on;}   /* a link the chain doesn't reach now: where it was, at scale 0 */
    const o=r.o,v=o.visible?1:0;out[0]=o.position.x;out[1]=o.position.y;out[2]=o.position.z;out[3]=o.quaternion.x;out[4]=o.quaternion.y;out[5]=o.quaternion.z;out[6]=o.quaternion.w;
    out[7]=o.scale.x*v;out[8]=o.scale.y*v;out[9]=o.scale.z*v;return o.visible;}
  const same=(a,b)=>{for(let k=0;k<10;k++)if(Math.abs(a[k]-b[k])>1e-9)return false;return true;};
  /* shapes. snap: a geometry's arrays, copied. A mesh whose geometry changes starts as morph: its rest shape and shape keys chosen as it goes, each shape the blend of the
     two nearest keys if that is within TOLS, else a key of its own. The first shape with other vertices or triangles turns it to flip: its distinct shapes (the keys so far
     among them), each shown alone, one at most every FLIPSth of a clip (the mainspring letting down), or, with a cap (the trip spring, the same few shapes each beat), the
     first cap of them and then the nearest. The hairspring is keyed by its balance's angle instead (build). tl[clip]: [t, a, b, w] (morph: keys a and b, w of b) or [t, j]
     (flip: shape j) where it changes */
  const snap=g=>{const P=g.attributes.position,U=g.attributes.uv;if(!g.attributes.normal)g.computeVertexNormals();
    return{pos:Float32Array.from(P.array.subarray(0,P.count*3)),nrm:Float32Array.from(g.attributes.normal.array.subarray(0,P.count*3)),uv:U?Float32Array.from(U.array.subarray(0,P.count*2)):null,idx:g.index?Uint32Array.from(g.index.array):null};};
  const sameIdx=(a,b)=>{if(!a||!b)return!a&&!b;if(a.length!==b.length)return false;for(let i=0;i<a.length;i++)if(a[i]!==b[i])return false;return true;};
  function shapeOf(d,g,t,clip){const P=g.attributes.position,a=P.array,n=P.count*3,ix=g.index?g.index.array:null;
    if(d.mode==='morph'){let ok=d.ok.get(g);if(ok==null){ok=n===d.keys[0].pos.length&&sameIdx(ix,d.keys[0].idx);d.ok.set(g,ok);}
      if(!ok){d.mode='flip';d.shapes=d.keys;for(const c in d.tl)d.tl[c]=d.tl[c].map(([tt,x,y,w])=>[tt,w<0.5?x:y]);if(d.last)d.last=[d.last[2]<0.5?d.last[0]:d.last[1]];}}
    if(d.mode==='morph'){const K=d.keys,sd=Math.max(1,Math.floor(n/3/64))*3,dist=k=>{let s=0;for(let i=0;i<n;i+=sd){const e=a[i]-k[i],f=a[i+1]-k[i+1],h=a[i+2]-k[i+2];s+=e*e+f*f+h*h;}return s;};
      let x=0,y=0,dx=Infinity,dy=Infinity;for(let j=0;j<K.length;j++){const s=dist(K[j].pos);if(s<dx){y=x;dy=dx;x=j;dx=s;}else if(s<dy){y=j;dy=s;}}
      const ka=K[x].pos,kb=K[y].pos;let w=0;if(y!==x){let num=0,den=0;for(let i=0;i<n;i++){const e=kb[i]-ka[i];num+=(a[i]-ka[i])*e;den+=e*e;}w=den>0?clamp(num/den,0,1):0;}
      let err=0;for(let i=0;i<n&&err<=TOLS;i++)err=Math.max(err,Math.abs(a[i]-ka[i]-w*(kb[i]-ka[i])));
      if(err>TOLS&&(!d.cap||K.length<d.cap)){K.push(snap(g));x=y=K.length-1;w=0;}return[x,y,w];}
    const S=d.shapes;for(let j=0;j<S.length;j++){const s=S[j];if(s.pos.length!==n||!sameIdx(ix,s.idx))continue;let e=0;for(let i=0;i<n&&e<=TOLS;i++)e=Math.max(e,Math.abs(a[i]-s.pos[i]));if(e<=TOLS)return[j];}
    if(d.cap){if(S.length<d.cap){S.push(snap(g));return[S.length-1];}let bj=-1,bd=Infinity;   /* past its cap, the nearest shape it has */
      for(let j=0;j<S.length;j++){const q=S[j].pos;if(q.length!==n)continue;let e=0;for(let i=0;i<n;i+=3){const u=a[i]-q[i],v=a[i+1]-q[i+1],z=a[i+2]-q[i+2];e+=u*u+v*v+z*z;}if(e<bd){bd=e;bj=j;}}return bj>=0?[bj]:d.last||[0];}
    if(d.last&&t-(d.added[clip]??-1e9)<d.gap)return d.last;d.added[clip]=t;S.push(snap(g));return[S.length-1];}
  /* plays a clip through the copy: every node's TRS (and visibility, as scale 0) where it changes, with a key just before each change so a hold stays a hold; shapes likewise */
  async function record(C,recs,clip,defs){for(const d of defs.values())if(d.theta||d.rots)d.last=null;const cur=new Float32Array(10),tr=new Map(),last=new Map(),vis=new Map(),teeth=[];let tPrev=0,first=true,dur=0,k=0;
    const emit=(t,s)=>{apply(C,s);dur=t;if(s.teeth!=null)teeth.push(t,s.teeth);
      for(const r of recs){const pv=r.par?vis.get(r.par)!==false:true,v=read(r,cur)&&pv;vis.set(r,v);if(v)r.ever=true;
        if(first){last.set(r,Float32Array.from(cur));continue;}const L=/** @type {Float32Array} */(last.get(r));
        if(!same(cur,L)){let T=tr.get(r);if(!T){T={t:[0],v:[...L]};tr.set(r,T);}if(T.t[T.t.length-1]<tPrev){T.t.push(tPrev);T.v.push(...L);}T.t.push(t);T.v.push(...cur);L.set(cur);}}
      for(const r of recs){const o=r.o;if(!o||!o.isMesh||o.isInstancedMesh||!r.rest)continue;const dh=defs.get(r);
        if(dh&&dh.theta){const{TH,K}=dh.theta,u=(clamp(s.th,-TH,TH)+TH)/(2*TH)*(K-1),j=Math.min(K-2,Math.floor(u)),w=[1+j,2+j,u-j],T=dh.tl[clip.name]||(dh.tl[clip.name]=[]);   /* the hairspring: between the two keys either side of the balance's angle */
          const lw=dh.last||dh.rest0;if(!T.length&&t>0)T.push([0,...lw]);if(T.length&&T[T.length-1][0]<tPrev)T.push([tPrev,...lw]);if(lw[0]!==w[0]||lw[2]!==w[2])T.push([t,...w]);dh.last=w;continue;}
        if(dh&&dh.rots){const q=C.R.fs.fz.rotation.y;let j=0;for(let i=1;i<dh.rots.length;i++)if(Math.abs(dh.rots[i]-q)<Math.abs(dh.rots[j]-q))j=i;const w=[j],T=dh.tl[clip.name]||(dh.tl[clip.name]=[]);   /* the mainspring: the shape nearest the fusee's turn */
          const lw=dh.last||dh.rest0;if(!T.length&&t>0)T.push([0,...lw]);if(T.length&&T[T.length-1][0]<tPrev)T.push([tPrev,...lw]);if(lw[0]!==w[0])T.push([t,...w]);dh.last=w;continue;}
        const g=o.geometry,P=g.attributes.position;
        const sig=first?r.restSig:r.sig;if(sig&&sig[0]===g&&sig[1]===P.version&&sig[2]===P.count){r.sig=sig;continue;}r.sig=[g,P.version,P.count];
        let d=defs.get(r);if(!d){d={mode:'morph',keys:[r.rest],shapes:null,tl:{},added:{},ok:new Map(),last:null,gap:0,cap:o===C.R.pspring?128:0};defs.set(r,d);}
        if(first)d.last=null;d.gap=clip.len/FLIPS;const w=shapeOf(d,g,t,clip.name),T=d.tl[clip.name]||(d.tl[clip.name]=[]),lw=d.last||(d.mode==='morph'?[0,0,0]:[0]);
        if(!T.length&&t>0)T.push([0,...lw]);if(T.length&&T[T.length-1][0]<tPrev)T.push([tPrev,...lw]);T.push([t,...w]);d.last=w;}
      first=false;tPrev=t;};
    clip.run((t,s)=>{emit(t,s);k++;});
    await sleep();return{tr,dur,teeth,samples:k};}
  /* ---------- the export ---------- */
  async function build(onStep,only){const t0=performance.now(),C=copy(),h0=A.hrs();
    /* the rest pose: the page's state of wind, the escape wheel locked at the start of a beat (Running's first moment), the lids open, the movement in its case */
    const rest=Object.assign(REST(),{n:h0*FUSEE_PER_HOUR});{const z=ESC.state(0,ESC.ampAt(A.drvF(h0)));rest.th=z.th;rest.lift=z.lift;rest.psDef=z.psDef;rest.E=z.prog;}   /* the beat's start: Running's first moment */
    let nMax=0;for(let i=0;i<=40;i++){C.R.fs.setWind(FUSEE_TURNS*i/40,0);C.R.fs.g.traverse(o=>{if(o.isInstancedMesh)nMax=Math.max(nMax,o.count);});}nMax+=1;   /* the most links either instanced mesh draws, over a wind */
    apply(C,rest);apply(C,rest);
    const recs=table(C,nMax),cur=new Float32Array(10),vis=new Map();
    for(const r of recs){const pv=r.par?vis.get(r.par)!==false:true,v=read(r,cur)&&pv;vis.set(r,v);if(v)r.ever=true;r.restV=Float32Array.from(cur);
      if(r.o&&r.o.isMesh&&!r.o.isInstancedMesh&&r.o.geometry.attributes.position&&r.o.geometry.attributes.position.count){const g=r.o.geometry;r.rest=snap(g);r.restSig=[g,g.attributes.position.version,g.attributes.position.count];}}
    /* the rig's linear drives: a node turned about one axis in step with the escape wheel (E, in teeth) and the hand-setting key (slip, s), found by setting the copy at a
       few E and slip and checking the node's turn against a straight line through them, to within a turn */
    const lin=new Map();
    { const pr=[[0,0],[0.37,0],[5.13,0],[33.7,0],[0,97],[0,2711],[5.13,2711]],QS=pr.map(([E,slip])=>{apply(C,Object.assign({},rest,{E:rest.E+E,slip}));return recs.map(r=>r.o?[r.o.quaternion.clone(),r.o.position.clone()]:null);});
      apply(C,rest);apply(C,rest);const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
      recs.forEach((r,i)=>{if(!r.o)return;const[q0,p0]=/** @type {any[]} */(QS[0][i]);let ax=null,big=0;const ang=[];
        for(let j=1;j<pr.length;j++){const[q,p]=/** @type {any[]} */(QS[j][i]);if(p.distanceTo(p0)>1e-6)return;const d=q0.clone().invert().multiply(q);if(d.w<0)d.set(-d.x,-d.y,-d.z,-d.w);
          const s=Math.hypot(d.x,d.y,d.z),a=2*Math.atan2(s,d.w);if(s>1e-7&&a>big){big=a;ax=new THREE.Vector3(d.x,d.y,d.z).divideScalar(s);}ang.push([d,a,s]);}
        if(!ax||big<1e-6)return;const sg=ang.map(([d,a,s])=>{if(s<1e-7)return 0;const c=(d.x*ax.x+d.y*ax.y+d.z*ax.z)/s;return Math.abs(Math.abs(c)-1)>1e-4?NaN:c>0?a:-a;});
        if(sg.some(Number.isNaN))return;const kE=sg[0]/0.37,kS=sg[3]/97;if(pr.slice(1).every(([E,s],j)=>Math.abs(wrap(kE*E+kS*s-sg[j]))<2e-4))lin.set(r,{axis:[ax.x,ax.y,ax.z],kE,kS});});}
    /* the hairspring, whose shape is its balance's angle's alone (R.spPath): shape keys at angles 0.15 rad apart over the widest swing (the chord between two, at the
       collet 5.5 mm out, is then within 0.015 mm of the spring), drawn by the copy's own update(); each moment the blend of the two either side */
    const defs=new Map();
    { const sr=recs.find(r=>r.o===C.R.spring);if(sr&&sr.rest){const TH=1.1*Math.max(...[0,0.25,0.5,0.75,0.99].map(f=>ESC.ampAt(A.drvF(f*RUN_H))),ESC.ampAt(A.SUS),160*D2R),K=Math.ceil(2*TH/0.15)+1,keys=[sr.rest];
        for(let j=0;j<K;j++){apply(C,Object.assign({},rest,{th:-TH+2*TH*j/(K-1)}));keys.push(snap(C.R.spring.geometry));}apply(C,rest);apply(C,rest);
        const u=(clamp(rest.th,-TH,TH)+TH)/(2*TH)*(K-1),j=Math.min(K-2,Math.floor(u));defs.set(sr,{mode:'morph',keys,shapes:null,tl:{},added:{},ok:new Map(),last:null,gap:0,theta:{TH,K},rest0:[1+j,2+j,u-j]});} }
    /* the mainspring, whose shape is the fusee's turn's alone (its vertices change with it, so a flipbook): 24 shapes over the whole wind, the fusee turned with the train
       (7200 beats an hour), each moment the nearest; inside the barrel, it is seen only with the barrel opened up */
    { const mr=recs.find(r=>r.o===C.R.fs.ms);if(mr&&mr.rest){const K=24,shapes=[],rots=[],q0=C.R.fs.fz.rotation.y;
        for(let j=0;j<K;j++){const h=RUN_H*j/(K-1);apply(C,Object.assign({},rest,{n:h*FUSEE_PER_HOUR,E:rest.E+(h-h0)*7200}));shapes.push(snap(C.R.fs.ms.geometry));rots.push(C.R.fs.fz.rotation.y);}apply(C,rest);apply(C,rest);
        let rj=0;rots.forEach((q,j)=>{if(Math.abs(q-q0)<Math.abs(rots[rj]-q0))rj=j;});
        defs.set(mr,{mode:'flip',keys:shapes,shapes,tl:{},added:{},ok:new Map(),last:null,gap:0,rots,restJ:rj,rest0:[rj]});} }
    /* the clips, each from the rest pose */
    const cl=clips(C,h0,rest.E).filter(c=>!only||only.includes(c.name)),out=[];let ci=0;
    for(const c of cl){onStep(`Recording <b>${c.name}</b> (${++ci} of ${cl.length})…`);await sleep();apply(C,rest);apply(C,rest);out.push([c,await record(C,recs,c,defs)]);}
    apply(C,rest);onStep('Writing the file…');await sleep();
    return writeDoc(C,recs,out,defs,lin,h0,t0,rest);}
  /* ---------- to the glTF document ---------- */
  async function writeDoc(C,recs,out,defs,lin,h0,t0,rest){
    const keep=recs.filter(r=>r.ever),idx=new Map(keep.map((r,i)=>[r,i+1])),nodes=[],meshes=[],materials=[],textures=[],MI=new Map(),TI=new Map(),GI=new Map(),used=new Map();
    const uniq=n=>{const c=used.get(n)||0;used.set(n,c+1);return c?`${n} #${c+1}`:n;};
    const tex=(t,green)=>{const k=t.uuid+(green?'g':'');if(TI.has(k))return TI.get(k);if(!t.image||!t.image.width)return null;textures.push({img:t.image,flip:t.flipY,green,repeat:t.wrapS===THREE.RepeatWrapping});TI.set(k,textures.length-1);return textures.length-1;};
    const xfOf=t=>{if(!t)return null;const sx=t.repeat.x,sy=t.repeat.y,c=Math.cos(t.rotation),s=Math.sin(t.rotation),cx=t.center.x,cy=t.center.y;   /* three's uvTransform as KHR_texture_transform (the same for an even repeat) */
      if(sx===1&&sy===1&&!t.rotation&&!t.offset.x&&!t.offset.y)return null;return{o:[-sx*(c*cx+s*cy)+cx+t.offset.x,-sy*(-s*cx+c*cy)+cy+t.offset.y],s:[sx,sy],r:t.rotation};};
    const M=A.M,MN=new Map(Object.entries(M).filter(([,v])=>v&&v.isMaterial).map(([k,v])=>[v,k])),GLASS=new Set([M.glass,M.clear].filter(Boolean));
    /* the materials as they are, the jewels and glass as what they are made of: transmission, with the index of ruby (1.77) and of glass (1.52), in place of the page's stand-ins */
    const matOf=m=>{if(MI.has(m))return MI.get(m);const c=m.color||new THREE.Color(1,1,1),e=m.emissive?m.emissive.clone().multiplyScalar(m.emissiveIntensity??1):null,gl=GLASS.has(m),jw=m===M.ruby;
      const mo=/** @type {any} */({name:MN.get(m)||m.name||'material '+materials.length,color:[c.r,c.g,c.b,m.transparent&&!gl?m.opacity:1],metal:m.metalness??0,rough:m.roughness??1,emissive:jw||!e?null:[e.r,e.g,e.b],double:m.side===THREE.DoubleSide,blend:m.transparent&&!gl});
      if(m.map){const ti=tex(m.map,false);if(ti!=null){mo.map=ti;mo.xf=xfOf(m.map);}}
      if(m.normalMap){const ti=tex(m.normalMap,true);if(ti!=null){mo.nmap=ti;mo.nscale=m.normalScale?m.normalScale.x:1;mo.xf=mo.xf||xfOf(m.normalMap);}}
      if(gl){mo.trans=1;mo.ior=m===M.clear?1.77:1.52;mo.rough=Math.min(mo.rough,0.05);mo.metal=0;}if(jw){mo.trans=0.85;mo.ior=1.77;mo.metal=0;}
      materials.push(mo);MI.set(m,materials.length-1);return materials.length-1;};
    const meshOf=(g,m,s,name,share)=>{const k=g.uuid+'|'+(Array.isArray(m)?m.map(x=>x.uuid).join():m.uuid);if(share&&GI.has(k))return GI.get(k);
      const prims=Array.isArray(m)&&g.groups.length?g.groups.map(gr=>({...s,idx:s.idx?s.idx.slice(gr.start,gr.start+gr.count):Uint32Array.from({length:gr.count},(_,i)=>gr.start+i),mat:matOf(m[gr.materialIndex])})):[{...s,mat:matOf(Array.isArray(m)?m[0]:m)}];
      meshes.push({name,prims});if(share)GI.set(k,meshes.length-1);return meshes.length-1;};
    const flipKids=new Map();
    const moves=new Set([...lin.keys(),...defs.keys()]);for(const[,res]of out)for(const r of res.tr.keys())moves.add(r);   /* nodes that move in some clip: the rig puts them back at rest (extras.rest) */
    const ROLE=new Map([[C.BX.root,'box'],[C.BX.ring,'ring'],[C.BX.bowl,'bowl'],[C.mv,'movement'],[C.BX.mid,'lidGlass'],[C.BX.top,'lid'],[C.BX.latch,'latch']]);   /* for the rig: the nodes it turns itself */
    keep.forEach((r,i)=>{const v=r.restV,o=r.o,par=r.par&&r.par.name,mn=o&&o.isMesh&&!Array.isArray(o.material)?MN.get(o.material):'',nm=uniq(r.name||(o&&o.isMesh?(par||'piece')+(mn?' · '+mn:' · piece'):(par?par+' · frame':'frame')));
      const n=/** @type {any} */({name:nm,t:[v[0],v[1],v[2]],r:[v[3],v[4],v[5],v[6]],s:[v[7],v[8],v[9]],children:r.kids.filter(k=>idx.has(k)).map(k=>idx.get(k))}),x={};
      const ro=o&&ROLE.get(o);if(ro)x.role=ro;if(o&&o.userData.part)x.part=o.userData.part;if(moves.has(r))x.rest=Array.from(v,q=>+q.toFixed(7));if(o&&o.userData.hn)x.hn=o.userData.hn;const L=lin.get(r);if(L)x.rig=L;
      const d=defs.get(r);
      if(r.im){const g=r.im.geometry;n.mesh=meshOf(g,r.im.material,snap(g),'chain link '+(r.k%2?'B':'A'),true);}
      else if(r.rest){if(!d)n.mesh=meshOf(o.geometry,o.material,r.rest,nm,true);
        else if(d.mode==='morph'){const K=d.keys,base=K[0],mi=meshOf(o.geometry,o.material,base,nm,false),pm=meshes[mi].prims[0];
          if(K.length>1){pm.targets=K.slice(1).map(q=>{const p=new Float32Array(base.pos.length);for(let j=0;j<p.length;j++)p[j]=q.pos[j]-base.pos[j];return{pos:p};});
            const rw=K.slice(1).map(()=>0);if(d.rest0){rw[d.rest0[0]-1]+=1-d.rest0[2];rw[d.rest0[1]-1]+=d.rest0[2];}meshes[mi].weights=rw;d.rw=rw;meshes[mi].targetNames=K.slice(1).map((_,j)=>'shape '+(j+1));x.shapes=K.length-1;}n.mesh=mi;}
        else{const rj=d.restJ||0;flipKids.set(r,d.shapes.map((s,j)=>({name:uniq(nm+' · shape '+(j+1)),t:[0,0,0],r:[0,0,0,1],s:j!==rj?[0,0,0]:[1,1,1],extras:{rest:[0,0,0,0,0,0,1,...(j!==rj?[0,0,0]:[1,1,1])]},mesh:meshOf(o.geometry,o.material,s,nm+' · shape '+(j+1),false)})));x.shapes=d.shapes.length;x.flipbook=true;}}
      if(Object.keys(x).length)n.extras=x;nodes[i+1]=n;});
    for(const[r,kids]of flipKids){const n=nodes[/** @type {number} */(idx.get(r))];for(const kd of kids){nodes.push(kd);kd.i=nodes.length-1;n.children.push(kd.i);}}   /* a flipbook's shapes, after the tree's nodes */
    /* the animations: per clip, each node's channels that change, and the shapes' weights (morph) or which shape shows (flip, STEP) */
    const anims=out.map(([c,res])=>{const an={name:c.name,channels:[]},end=res.dur;
      for(const[r,tk]of res.tr){if(!idx.has(r))continue;if(c.fast&&lin.has(r)&&Math.abs(lin.get(r).kE)*c.fast>0.5)continue;const ni=idx.get(r);if(tk.t[tk.t.length-1]<end){tk.t.push(end);tk.v.push(...tk.v.slice(-10));}
        const t=Float32Array.from(tk.t),m=t.length,V=tk.v,ch=(o,n,path,tol,q)=>{const a=new Float32Array(m*n);let moved=false;
          for(let j=0;j<m;j++)for(let k=0;k<n;k++){a[j*n+k]=V[j*10+o+k];if(Math.abs(a[j*n+k]-a[k])>1e-9)moved=true;}
          if(!moved)return;if(q)for(let j=1;j<m;j++){let dd=0;for(let k=0;k<4;k++)dd+=a[j*4+k]*a[(j-1)*4+k];if(dd<0)for(let k=0;k<4;k++)a[j*4+k]=-a[j*4+k];}   /* each quaternion on the side of the last, so the turn between them is the short way */
          const red=GLTF.reduce(t,a,n,tol,q);an.channels.push({node:ni,path,times:red.times,values:red.values,interp:'LINEAR'});};
        ch(0,3,'translation',TOLP);ch(3,4,'rotation',TOLQ,true);ch(7,3,'scale',TOLS);}
      for(const[r,d]of defs){if(!idx.has(r))continue;const tl=d.tl[c.name];if(!tl||!tl.length)continue;if(tl[tl.length-1][0]<end)tl.push([end,...tl[tl.length-1].slice(1)]);const t=Float32Array.from(tl.map(q=>q[0]));
        if(d.mode==='morph'){const K=d.keys.length-1;if(!K)continue;const w=new Float32Array(tl.length*K);
          tl.forEach(([,a,b,u],j)=>{if(a)w[j*K+a-1]+=b===a?1:1-u;if(b&&b!==a)w[j*K+b-1]+=u;});const rw=d.rw||[];if(w.every((v,q)=>Math.abs(v-(rw[q%K]||0))<1e-6))continue;const red=GLTF.reduce(t,w,K,0.002);an.channels.push({node:idx.get(r),path:'weights',times:red.times,values:red.values,interp:'LINEAR'});}
        else{const kids=flipKids.get(r);if(!kids)continue;kids.forEach((kd,j)=>{const s=new Float32Array(tl.length*3);tl.forEach(([,a],q)=>{s[q*3]=s[q*3+1]=s[q*3+2]=a===j?1:0;});
          if(s.some(v=>v!==(j!==(d.restJ||0)?0:1))){const red=GLTF.reduce(t,s,3,0.5);an.channels.push({node:kd.i,path:'scale',times:red.times,values:red.values,interp:'STEP'});}});}}
      return an;});
    /* the root, millimetres to metres; and the rig's helper, whose x is the escape wheel's place through a beat, in teeth */
    nodes[0]={name:'Hamilton Model 21 marine chronometer',t:[0,0,0],r:[0,0,0,1],s:[0.001,0.001,0.001],children:[idx.get(keep[0])]};
    const helper=nodes.length;nodes.push({name:'Rig · escape wheel teeth',t:[0,0,0],r:[0,0,0,1],s:[1,1,1],extras:{rig:'teeth'}});
    out.forEach(([c,res],ai)=>{if(!res.teeth.length)return;const n=res.teeth.length/2,t=new Float32Array(n),v=new Float32Array(n*3);for(let j=0;j<n;j++){t[j]=res.teeth[2*j];v[3*j]=res.teeth[2*j+1];}
      anims[ai].channels.push({node:helper,path:'translation',times:t,values:v,interp:'LINEAR'});});
    const ver=(document.querySelector('meta[name=version]')||{}).getAttribute?.('content')||'';
    const extras={made:'The Marine Chronometer working model'+(ver?' '+ver:'')+', '+location.href.split('#')[0],units:'millimetres under the root node, which scales them to metres',start:{hours:h0,E:rest.E,slip:0},
      beat:0.5,fuseePerHour:FUSEE_PER_HOUR,runHours:RUN_H,fuseeTurns:FUSEE_TURNS,fps:FPS,clips:out.map(([c,res])=>Object.assign({name:c.name,about:c.d,seconds:+res.dur.toFixed(4),samples:res.samples},c.rig?{rig:c.rig}:{}))};
    nodes[0].extras=extras;   /* Blender keeps a node's extras as the object's custom properties (the asset's it drops): the rig reads them here */
    const blob=await GLTF.write({generator:'Marine Chronometer working model (blender.js)',nodes,roots:[0,helper],meshes,materials,textures,animations:anims,extras});
    return{blob,stats:{nodes:nodes.length,meshes:meshes.length,materials:materials.length,clips:anims.length,s:((performance.now()-t0)/1000).toFixed(1)}};}
  async function exportGLB(){const b=/** @type {HTMLButtonElement|null} */(document.getElementById('mkGLB'));if(b)b.disabled=true;
    try{const{blob,stats}=await build(say);save(blob,'model21.glb');
      say(`<b>model21.glb</b>: ${(blob.size/1048576).toFixed(1)} MB, ${stats.nodes} nodes, ${stats.meshes} meshes, ${stats.materials} materials, ${stats.clips} animations, made in ${stats.s} s. In Blender: File, Import, glTF 2.0; then open the rig (Blender rig) in the Text Editor and run it.`);}
    catch(e){say('The export failed: '+e.message);throw e;}finally{if(b)b.disabled=false;}}
  return{bind(api){A=api;const g=document.getElementById('mkGLB'),r=document.getElementById('mkRig');
      if(g)g.addEventListener('click',()=>{exportGLB();});
      if(r)r.addEventListener('click',()=>save(new Blob([typeof RIG_PY==='string'?RIG_PY:''],{type:'text/x-python'}),'model21-rig.py'));
      if(/[?&]qa\b/.test(location.search))window.__glb=async(only)=>{const{blob,stats}=await build(m=>console.log('glb '+Math.round(performance.now())+' '+m.replace(/<[^>]+>/g,'')),only);save(blob,'model21.glb');return stats;};},   /* for the tools: the export, saved as a download */
    build};
})();
