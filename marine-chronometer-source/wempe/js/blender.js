/* blender.js (the Wempe's): the instrument as a glTF (.glb) for Blender, and the parts as STL. Lifted from the Hamilton's (chronometer-working-model/js/blender.js,
   16 October 2026), which keeps its own; the glTF writer (GLTF, the Hamilton's gltf.js) and the rig (RIG_PY, its blender/rig.py) are the Hamilton's, loaded by
   relative path. Every part a node in the model's own hierarchy (box, ring, bowl, movement, parts, pieces), named, in its materials, with every motion the page has as
   an animation (Blender: an action each), and the tables the rig drives it from. The export builds a copy of its own (WCASE.build, buildWempe, set as the page's
   choices are: A.copy), so the model on the page is never touched: update() keeps state from call to call (the fusee's catch on its clicks), and each clip is played
   through the copy in time order, from the same equations as app.js's tick. What moves is read back off the copy's nodes: a node that changes gets a track
   (translation, rotation, scale; hidden is scale 0); a piece rebuilt as it moves (the hairspring, the mainspring, the clicks' springs, the stop work's) shape keys
   while its vertices and triangles stay the same, else a flipbook of its shapes; the chain one node a link. The Hamilton's clips the Wempe has no counterpart for are
   left out (Laid out, Stop and start, Latch: it has no laid-out view, locking arm, train-blocking screw or latch lever); Winding is done in the case, as the page does
   it. STL: a binary STL of meshes in the movement's frame (mm), as the Hamilton's maker.js writes it. One IIFE; the page sees only BLENDER. app.js calls
   BLENDER.bind() once the model is built */
const BLENDER=(()=>{
  let A=null;const TEXK=2,ENGK=4,FPS=30,TOLP=0.0005,TOLQ=0.00005,TOLS=0.004,FLIPS=48;   /* tolerances: translation (mm), rotation (quaternion), a shape's vertices (mm); FLIPS: the most shapes a flipbook takes in a clip */
  const sleep=()=>new Promise(r=>setTimeout(r,0)),say=t=>{const r=document.getElementById('xRead');if(r)r.innerHTML=t;};
  function save(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);}
  /* ---------- STL (the Hamilton's maker.js): each triangle of a mesh in frame fr's coordinates (mm), instances included ---------- */
  function tris(o,fr,f){const g=o.geometry,P=g.attributes.position,I=g.index,mats=[];fr.updateWorldMatrix(true,false);o.updateWorldMatrix(true,false);const base=new THREE.Matrix4().copy(fr.matrixWorld).invert().multiply(o.matrixWorld);
    if(o.isInstancedMesh){const im=new THREE.Matrix4();for(let i=0;i<o.count;i++){o.getMatrixAt(i,im);mats.push(base.clone().multiply(im));}}else mats.push(base);
    const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),n=I?I.count:P.count;
    for(const m of mats)for(let k=0;k+2<n;k+=3){const i0=I?I.getX(k):k,i1=I?I.getX(k+1):k+1,i2=I?I.getX(k+2):k+2;
      a.fromBufferAttribute(P,i0).applyMatrix4(m);b.fromBufferAttribute(P,i1).applyMatrix4(m);c.fromBufferAttribute(P,i2).applyMatrix4(m);f(a,b,c);}}
  /* a binary STL of meshes in frame fr (mm): the movement's for its parts, the box's for the case's */
  function stl(ms,fr){let n=0;for(const o of ms)tris(o,fr,()=>{n++;});const buf=new ArrayBuffer(84+50*n),dv=new DataView(buf);let off=84;dv.setUint32(80,n,true);
    const e1=new THREE.Vector3(),e2=new THREE.Vector3();
    for(const o of ms)tris(o,fr,(a,b,c)=>{e1.subVectors(b,a);e2.subVectors(c,a);e1.cross(e2).normalize();for(const v of[e1,a,b,c]){dv.setFloat32(off,v.x,true);dv.setFloat32(off+4,v.y,true);dv.setFloat32(off+8,v.z,true);off+=12;}off+=2;});
    return{blob:new Blob([buf],{type:'model/stl'}),n};}
  /* the solids: no engraving or printed face (surfaces, not solids), with a position */
  const solid=o=>o.isMesh&&!o.userData.decal&&!o.userData.surface&&o.geometry&&o.geometry.attributes.position&&o.geometry.attributes.position.count>0;
  const shown=o=>{for(let q=o;q;q=q.parent)if(!q.visible)return false;return true;};
  const inMv=o=>{for(let q=o;q;q=q.parent)if(q===A.mv())return true;return false;};
  /* a part (key) or a piece (part.k) as STL, its meshes as built and shown in the sheets' state and connector the page shows (the band's or the first-drawn pieces only
     when they are the ones shown), in the movement's frame, or the box's for the case's parts */
  function partSTL(p){const ms=[];A.root().traverse(o=>{if(solid(o)&&(p.includes('.')?o.userData.pk===p:o.userData.part===p)&&shown(o.parent))ms.push(o);});
    if(!ms.length)return null;const fr=inMv(ms[0])?A.mv():A.root();return stl(ms,fr);}
  /* the movement as the page shows it (parts hidden, Moving parts only), in its own frame */
  function movementSTL(){const ms=[];A.mv().traverse(o=>{if(solid(o)&&shown(o))ms.push(o);});return stl(ms,A.mv());}
  /* ---------- the copy, set as the page is (A.copy: the case and movement, the sheets' state, connector, dial and timing weights) ---------- */
  function copy(){const{CS,mv}=A.copy(A.M),R=mv.userData.R,ms=[],inM=new Set();mv.traverse(o=>inM.add(o));
    const partOf=o=>{for(;o;o=o.parent)if(o.userData&&o.userData.partName)return o.userData.partName;return null;};
    CS.root.traverse(o=>{if(o.isMesh){o.userData.part=partOf(o);ms.push(o);}});
    return{CS,mv,R,ms,key:false};}
  /* a state: the movement's (MoveState: E, th, lift, psDef, n, winding, slip), the views' (lid open, lift out of the bowl and turn over, explode), the case turned over to
     wind (cw 0-3: the bowl turned over, the closing plate opened, the key onto the square; app.js's tick), the box's (pitch, roll, the case's angles in the gimbals) */
  const REST=()=>({E:0,th:0,lift:0,psDef:0,n:0,winding:false,slip:0,lid:1,up:0,ex:0,cw:0,keyOn:false,pitch:0,roll:0,gp:0,gr:0,teeth:null});
  function apply(C,s){const{CS,mv}=C;
    mv.userData.update({E:s.E,th:s.th,lift:s.lift,psDef:s.psDef,n:s.n,winding:s.winding,slip:s.slip});
    mv.userData.explode(smooth(s.ex));
    const L1=smooth(s.up/0.55),L2=smooth((s.up-0.35)/0.65);mv.position.y=-CS.YP+L1*150+L2*450;mv.rotation.x=L2*Math.PI;   /* as app.js's tick */
    CS.lid.rotation.x=-s.lid*1.75;CS.stay();CS.tongue.rotation.z=-Math.min(1,s.lid*4)*Math.PI/2;
    CS.bowl.rotation.z=-Math.PI*smooth(clamp(s.cw,0,1));CS.shutter(smooth(clamp(s.cw-1,0,1)));
    const kc=s.cw>2,kd=kc?(1-smooth(clamp(s.cw-2,0,1)))*60:0,ko=s.keyOn||kc;if(ko||C.key){CS.keyAt(ko?C.R.fu.keySeat:null,kd);C.key=ko;}   /* the key on the fusee's square (the keySeat's group), or back in its holder */
    CS.root.rotation.set(s.pitch,0,s.roll,'ZYX');CS.ring.rotation.x=s.gp-s.pitch;CS.bowl.rotation.z+=s.gr-s.roll;}   /* the box rolling in the world, the ring and bowl in their gimbals (the page draws it from on board: the box still) */
  /* ---------- the train and balance through time: app.js's tick (drive, swing, stopping at a locked beat and going again), at speed 1, without its twist ---------- */
  function sim(C,hrs){const PH=A.PH,PE=PH.ESC,H={amp:0,held:false,bph:0,bOff:0,eOff:1,Eh:0,tSim:0,hrs,winding:false,w0:0,wT:0};   /* eOff 1: at 0 s the escape wheel at E 0, ESC.state(0)'s, the rest pose */
    H.drv=()=>H.winding?H.w0*Math.max(0,1-H.wT/PH.SUS):H.hrs<A.HRUN-1e-6?A.drvF(H.hrs):0;H.amp=PE.ampAt(H.drv());
    H.wind=on=>{if(on&&!H.winding){H.w0=H.held?0:H.drv();H.wT=0;}H.winding=on;};   /* app.js's wind0: the maintaining spring carries what drove the train as the key goes on */
    const at=()=>{const y=H.tSim/0.5+H.bOff,k=Math.floor(y),p=y-k,z=ESC.state(p,H.amp,H.drv());return{y,p,z,E:k-1+(p>0?z.prog:0)+H.eOff};},lockd=q=>!(q.p>0&&q.z.prog>0&&q.z.prog<1);
    H.step=dt=>{const drv=H.drv();H.amp=PH.ampStep(H.amp,dt,H.held?0:drv);let q=at(),E,s;
      if(!H.held){if((!(drv>0)||H.amp<PE.AMIN)&&lockd(q)){H.held=true;H.bph=q.y;H.Eh=Math.round(q.E);}
        else if(dt>0){H.tSim+=dt;if(H.winding)H.wT+=dt;else H.hrs=Math.min(A.HRUN,H.hrs+dt/3600);q=at();}}
      if(H.held){H.bph+=dt/0.5;if(drv>0&&H.amp>=PE.AMIN){const b=H.bph-H.tSim/0.5;H.bOff=b-Math.floor(b);H.eOff=0;const r=at();if(lockd(r)){H.eOff=H.Eh-Math.round(r.E);H.held=false;q=at();}}}
      if(H.held){const p=H.bph-Math.floor(H.bph);s=ESC.state(p,H.amp,0);E=H.Eh+Math.min(0,s.prog);}else{s=q.z;E=q.E;}
      return{E,th:s.th,lift:s.lift,psDef:s.psDef,n:H.hrs/A.HPT,winding:H.winding};};
    return H;}
  /* the phases of a beat sampled: evenly, 120 a beat, and closely where the escapement acts (the Hamilton's) */
  function beatGrid(amp,drv){const N=2400,P=new Set();for(let i=0;i<120;i++)P.add(i/120);let last=-1,z0=ESC.state(0,amp,drv);
    for(let i=1;i<=N;i++){const z=ESC.state(i/N,amp,drv);if((z.prog!==z0.prog||z.lift!==z0.lift||z.psDef!==z0.psDef)&&i/N-last>=1/720){P.add((i-1)/N);last=(i-1)/N;}z0=z;}
    return[...P].filter(p=>p<1).sort((a,b)=>a-b);}
  /* ---------- the clips: each calls emit(t, state) in time order; len: its length (s), rig: the parameter the rig drives it by ---------- */
  const ramp=(t,a,b)=>clamp((t-a)/(b-a),0,1);
  function clips(C,h0,E0){const PE=A.PH.ESC,drv0=A.drvF(h0),amp0=PE.ampAt(drv0),G=beatGrid(amp0,drv0),HPT=A.HPT,HRUN=A.HRUN,NRUN=HRUN/HPT,st=o=>Object.assign(REST(),{n:h0/HPT,E:E0},o);
    const runFor=(S,beats,emit,extra)=>{let tp=0;const go=t=>{const o=S.step(t-tp);tp=t;emit(t,st(Object.assign(o,extra?extra(t):{})));};for(let b=0;b<beats;b++)for(const p of G)go((b+p)*0.5);go(beats*0.5);};
    const uni=(dur,f,emit)=>{const n=Math.round(dur*FPS);for(let i=0;i<=n;i++){const t=dur*i/n;emit(t,f(t,i?dur/n:0));}};
    const beat=(emit,secs)=>{for(const p of[...G,1]){const z=ESC.state(Math.min(p,0.99999),amp0,drv0),e=p<=0?0:p<1?z.prog:1;emit(p*secs,st({E:e,th:z.th,lift:z.lift,psDef:z.psDef,teeth:e-p}));}};   /* one beat on Running's phases; teeth, for the rig's helper: the escape wheel's place less an even run, 0 at both ends */
    const out=(t,a,b,c,d)=>ramp(t,a,b)-ramp(t,c,d);   /* up from a to b, down from c to d */
    const hW=HRUN-0.25,per=A.rollP(),WT=0.8,WR=1.5,PR=7200*HPT/120,RD=['maintDetent'];   /* PR: the beats the maintaining ratchet (120 teeth, 05 06 02-1) takes to turn a tooth with the fusee wheel; RD: its detent, riding it */   /* winding: from a quarter of an hour short of run down; WT the case's steps (app.js's CW_T), WR the fusee's turns a second (its tick) */
    return[
      {name:'Running',len:60,d:'the escapement and train for a minute, the seconds hand once round',run:emit=>runFor(sim(C,h0),120,emit)},
      {name:'Beat (slow motion)',len:10,d:'one beat twenty times slower: unlocking, impulse, the wheel locked again a tooth on',run:emit=>beat(emit,10)},
      /* the fusee is geared to the train, so the escape wheel goes with it, 7200 beats an hour (else the clicks' catch takes up the turn: fusee.js); the arbors turning more
         than half a radian a frame are left out of it, as a blur */
      {name:'Run down',len:30,fast:HRUN*7200/(30*FPS),skip:RD,d:'the whole run in 30 s: the chain off the fusee onto the barrel, the mainspring letting down, the up-and-down hand, the minute and hour hands',rig:{p:'n',a:0,b:NRUN},
        run:emit=>uni(30,t=>{const h=HRUN*t/30;return st({n:h/HPT,E:E0+(h-h0)*7200});},emit)},
      {name:'Winding',len:6*WT+hW/(HPT*WR)+1.5,d:'wound in its case, as the 6MX\'s instruction has it: the bowl turned over in the gimbals, the closing plate opened, the key put on and turned, the maintaining spring driving the train meanwhile, until the stop work stops it; then all back',
        run:(emit,clip)=>{const S=sim(C,hW),HS=clip.hours=[];let tp=0,ph=0,tK=-1,tE=-1;   /* ph: 0 turning over (cw up to 3, WT s a step), 1 winding, 2 back; HS: the hours since full wind every 0.25 s, for blender_check.py */
          for(let i=0;;i++){const t=i/60,dt=t-tp;tp=t;let cw;
            if(ph===0){cw=Math.min(3,t/WT);if(cw>=3){ph=1;tK=t;S.wind(true);}}
            else if(ph===1){cw=3;S.hrs=Math.max(0,hW-(t-tK)*WR*HPT);if(S.hrs<=0){ph=2;tE=t+0.5;}}
            else cw=Math.max(0,3-Math.max(0,t-tE)/WT);
            if(ph===2&&t>=tE&&S.winding)S.wind(false);   /* the key let go half a second after the stop */
            const o=S.step(dt);if(i%15===0)HS.push([+t.toFixed(3),+S.hrs.toFixed(5)]);emit(t,st(Object.assign(o,{cw})));if(ph===2&&cw<=0&&t>tE+3*WT+1)break;}}},
      {name:'Setting the hands',len:10,d:'the hands set an hour on (the cannon tube slipping on the centre arbor), the train going',run:emit=>runFor(sim(C,h0),20,emit,t=>({slip:3600*smooth(ramp(t,1.5,8.5))}))},
      {name:'Exploded',len:11,d:'lifted out of its case, turned over, the parts and screws apart along their arbors, and back',run:emit=>uni(11,t=>st({up:out(t,0,2.5,8.5,11),ex:out(t,2.5,5,6,8.5)}),emit)},
      {name:'Lift out',len:7,d:'the movement lifted out of its bowl and turned over, and back',run:emit=>uni(7,t=>st({up:out(t,0,3,4,7)}),emit)},
      {name:'Lid',len:7,d:'the box\'s lid closed and opened again',run:emit=>uni(7,t=>st({lid:1-out(t,0,3,4,7)}),emit)},
      {name:'At sea',len:6*per,d:'the box rolling 14 degrees and pitching, the case swinging in its gimbals to hang along the apparent vertical; it loops',run:emit=>{const wR=TAU/per,G2=A.gim(),T0=3*per*Math.ceil(30/(3*per)),n0=Math.round(T0*FPS);   /* the pitch at 2/3 the roll's rate, so the motion repeats every three rolls and the clip's six loop; the case's swing settled first over whole repeats */
        {const s0=G2.sea(-T0*wR,wR,1);G2.M.lp=s0.p[0];G2.M.lr=s0.r[0];for(let j=1;j<=n0;j++){const s=G2.sea((-T0+T0*j/n0)*wR,wR,1);G2.step(T0/n0,s.p[0],s.r[0],s);}}
        uni(6*per,(t,dt)=>{const sea=G2.sea(t*wR,wR,1),roll=sea.r[0],pitch=sea.p[0];if(dt>0)G2.step(dt,pitch,roll,sea);else{G2.M.lp=pitch;G2.M.lr=roll;}return st({roll,pitch,gp:G2.M.p[0],gr:G2.M.r[0]});},emit);}},
      /* the rig's (rig.py): one parameter each, from a to b over the clip */
      {name:'Rig · beat',len:0.5,skip:RD,d:'for the rig: one beat, the escape wheel a tooth on',rig:{p:'beat',a:0,b:1},run:emit=>beat(emit,0.5)},
      /* the maintaining detent riding its ratchet's teeth as the fusee wheel turns, a tooth in PR beats (3.2 minutes); in Run down it would be a blur, sampled every 450 beats:
         the rig plays this on a loop in the escape wheel's place, the fusee geared to it, at two samples a beat */
      {name:'Rig · ratchet',len:PR*0.5,only:RD,d:'for the rig: the maintaining detent riding a tooth of its ratchet, the train running',rig:{p:'E',a:0,b:PR},
        run:emit=>{const at=e=>st({E:E0+e,n:h0/HPT+e/(7200*HPT)}),n=Math.ceil(PR*2),es=[];
          /* where it falls off a tooth (its turn jumps), 240 samples a beat, as Running's beat grid has it: the detent's turning group found by the jump itself */
          const pD=C.mv.userData.parts.maintDetent,gs=[];pD.traverse(o=>{if(!o.isMesh)gs.push(o);});const ang=e=>{apply(C,at(e));return gs.map(o=>o.rotation.y);};
          let a0=ang(0);for(let i=1;i<=n;i++){const e0=PR*(i-1)/n,e1=PR*i/n,a1=ang(e1);es.push(e0);if(a1.some((v,j)=>Math.abs(v-a0[j])>0.003))for(let k=1;k<120;k++)es.push(e0+(e1-e0)*k/120);a0=a1;}es.push(PR);
          apply(C,at(0));for(const e of es)emit(e*0.5,at(e));}},
      {name:'Rig · explode',len:2,d:'for the rig: the parts apart',rig:{p:'explode',a:0,b:1},run:emit=>uni(2,t=>st({ex:t/2}),emit)},
      {name:'Rig · lift',len:3,d:'for the rig: out of the bowl and turned over',rig:{p:'lift',a:0,b:1},run:emit=>uni(3,t=>st({up:t/3}),emit)},
      {name:'Rig · lids',len:2,d:'for the rig: the lid, 0 open to 1 closed',rig:{p:'lids',a:0,b:1},run:emit=>uni(2,t=>st({lid:1-t/2}),emit)}];}
  /* ---------- the node table: every object under the box; the chain's links nodes of their own (as many as the chain ever has) ---------- */
  function table(C,nMax){const recs=[],RN=new Map();for(const g of[C.R.esc,C.R.dl])for(const k in g){const o=g[k];if(o&&o.isObject3D&&!RN.has(o))RN.set(o,k);}
    const PN=new Map(Object.entries(C.mv.userData.parts).map(([k,g])=>[g,k])),CN=new Map(Object.entries(C.CS.parts).map(([k,g])=>[g,k])),INFO=A.INFO,HN=new Map();
    for(const p in A.PIECES)for(const q of A.PIECES[p])for(const h of String(q.h||'').split(' '))if(h&&!HN.has(h))HN.set(h,q.t);
    const title=p=>(INFO[p]||[p])[0],label=o=>{const p=PN.get(o)||CN.get(o);if(p)return title(p)+' ('+p+')';if(o===C.CS.root)return title('box');if(o===C.mv)return 'Movement';const r=RN.get(o);if(r)return r;
      if(o.userData.hn&&!o.userData.sub){const t=HN.get(o.userData.hn);if(t)return o.userData.hn+' '+t;}if(o.userData.partName&&!(o.parent&&o.parent.userData.partName===o.userData.partName))return title(o.userData.partName);return '';};
    const partOf=o=>{for(;o;o=o.parent)if(o.userData&&o.userData.partName)return o.userData.partName;return null;};
    const walk=(o,par)=>{if(o.isLight||o.isCamera)return;const r={o,par,p0:o.parent,kids:[],name:label(o),part:partOf(o)};recs.push(r);if(par)par.kids.push(r);
      if(o.isInstancedMesh)for(let k=0;k<nMax;k++){const l={o:null,im:o,k,par:r,part:r.part,kids:[],name:`chain link ${String(k+1).padStart(3,'0')}`};recs.push(l);r.kids.push(l);}
      for(const c of o.children)walk(c,r);};
    walk(C.CS.root,null);return recs;}
  /* ---------- reading the copy ---------- */
  const M4=new THREE.Matrix4(),V3=new THREE.Vector3(),Q4=new THREE.Quaternion(),S3=new THREE.Vector3();
  function read(r,out){if(r.im){const im=r.im,on=r.k<im.count;if(on){im.getMatrixAt(r.k,M4);M4.decompose(V3,Q4,S3);out[0]=V3.x;out[1]=V3.y;out[2]=V3.z;out[3]=Q4.x;out[4]=Q4.y;out[5]=Q4.z;out[6]=Q4.w;out[7]=S3.x;out[8]=S3.y;out[9]=S3.z;r.lt=Float32Array.from(out);}
      else{if(r.lt)out.set(r.lt);else{out.fill(0);out[6]=1;}out[7]=out[8]=out[9]=0;}return on;}   /* a link the chain doesn't reach now: where it was, at scale 0 */
    const o=r.o,v=o.visible?1:0;
    /* placed by its matrix (the chain's and band's hooks: fusee.js place), or moved under another parent (the key onto the fusee's square: case.js keyAt): its pose in the
       parent it has in the table */
    if(o.parent!==r.p0||!o.matrixAutoUpdate){if(o.parent!==r.p0){r.p0.updateWorldMatrix(true,false);o.updateWorldMatrix(true,false);M4.copy(r.p0.matrixWorld).invert().multiply(o.matrixWorld);}else M4.copy(o.matrix);
      M4.decompose(V3,Q4,S3);out[0]=V3.x;out[1]=V3.y;out[2]=V3.z;out[3]=Q4.x;out[4]=Q4.y;out[5]=Q4.z;out[6]=Q4.w;out[7]=S3.x*v;out[8]=S3.y*v;out[9]=S3.z*v;return o.visible;}
    out[0]=o.position.x;out[1]=o.position.y;out[2]=o.position.z;out[3]=o.quaternion.x;out[4]=o.quaternion.y;out[5]=o.quaternion.z;out[6]=o.quaternion.w;
    out[7]=o.scale.x*v;out[8]=o.scale.y*v;out[9]=o.scale.z*v;return o.visible;}
  const same=(a,b)=>{for(let k=0;k<10;k++)if(Math.abs(a[k]-b[k])>1e-9)return false;return true;};
  /* shapes (the Hamilton's): snap a geometry's arrays; a mesh whose geometry changes starts as morph (shape keys, each moment the blend of the two nearest within TOLS),
     turning to flip (its distinct shapes, each shown alone) at the first shape with other vertices or triangles. The hairspring is keyed by its balance's angle, the
     mainspring by the fusee's turn (build). tl[clip]: [t, a, b, w] (morph) or [t, j] (flip) where it changes */
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
    if(d.cap){if(S.length<d.cap){S.push(snap(g));return[S.length-1];}let bj=-1,bd=Infinity;
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
        if(dh&&dh.rots){const q=C.R.fu.keySeat.g.rotation.y;let j=0;for(let i=1;i<dh.rots.length;i++)if(Math.abs(dh.rots[i]-q)<Math.abs(dh.rots[j]-q))j=i;const w=[j],T=dh.tl[clip.name]||(dh.tl[clip.name]=[]);   /* the mainspring: the shape nearest the fusee's turn */
          const lw=dh.last||dh.rest0;if(!T.length&&t>0)T.push([0,...lw]);if(T.length&&T[T.length-1][0]<tPrev)T.push([tPrev,...lw]);if(lw[0]!==w[0])T.push([t,...w]);dh.last=w;continue;}
        const g=o.geometry,P=g.attributes.position;
        const sig=first?r.restSig:r.sig;if(sig&&sig[0]===g&&sig[1]===P.version&&sig[2]===P.count){r.sig=sig;continue;}r.sig=[g,P.version,P.count];
        let d=defs.get(r);if(!d){d={mode:'morph',keys:[r.rest],shapes:null,tl:{},added:{},ok:new Map(),last:null,gap:0,cap:0};defs.set(r,d);}
        if(first)d.last=null;d.gap=clip.len/FLIPS;const w=shapeOf(d,g,t,clip.name),T=d.tl[clip.name]||(d.tl[clip.name]=[]),lw=d.last||(d.mode==='morph'?[0,0,0]:[0]);
        if(!T.length&&t>0)T.push([0,...lw]);if(T.length&&T[T.length-1][0]<tPrev)T.push([tPrev,...lw]);T.push([t,...w]);d.last=w;}
      first=false;tPrev=t;};
    clip.run((t,s)=>{emit(t,s);k++;},clip);
    await sleep();return{tr,dur,teeth,samples:k};}
  /* ---------- the export ---------- */
  async function build(onStep,only){const t0=performance.now(),C=copy(),h0=Math.fround(A.hrs()),   /* in single precision: Blender's driver variables are, so the rig's hours are h0 exactly (the Hamilton's) */
    HPT=A.HPT,HRUN=A.HRUN,NRUN=HRUN/HPT,PE=A.PH.ESC;
    /* the rest pose: the page's state of wind, the escape wheel locked at the start of a beat (Running's first moment), the lid open, the movement in its bowl */
    const rest=Object.assign(REST(),{n:h0/HPT});{const z=ESC.state(0,PE.ampAt(A.drvF(h0)),A.drvF(h0));rest.th=z.th;rest.lift=z.lift;rest.psDef=z.psDef;rest.E=0;}
    let nMax=0;for(let i=0;i<=40;i++){const h=HRUN*i/40;apply(C,Object.assign({},rest,{n:h/HPT,E:rest.E+(h-h0)*7200}));C.CS.root.traverse(o=>{if(o.isInstancedMesh)nMax=Math.max(nMax,o.count);});}nMax+=1;   /* the most links either instanced mesh draws, over a wind */
    apply(C,rest);apply(C,rest);
    const recs=table(C,nMax),cur=new Float32Array(10),vis=new Map();
    for(const r of recs){const pv=r.par?vis.get(r.par)!==false:true,v=read(r,cur)&&pv;vis.set(r,v);if(v)r.ever=true;r.restV=Float32Array.from(cur);
      if(r.o&&r.o.isMesh&&!r.o.isInstancedMesh&&r.o.geometry.attributes.position&&r.o.geometry.attributes.position.count){const g=r.o.geometry;r.rest=snap(g);r.restSig=[g,g.attributes.position.version,g.attributes.position.count];}}
    /* the rig's linear drives: a node turned about one axis in step with the escape wheel (E, in teeth) and the hands' slip (s), found by setting the copy at a few E and
       slip and checking the node's turn against a straight line through them, to within a turn (the Hamilton's) */
    const lin=new Map();
    { const pr=[[0,0],[0.37,0],[5.13,0],[33.7,0],[0,97],[0,2711],[5.13,2711]],QS=pr.map(([E,slip])=>{apply(C,Object.assign({},rest,{E:rest.E+E,slip}));return recs.map(r=>r.o?[r.o.quaternion.clone(),r.o.position.clone(),r.o.parent===r.p0&&r.o.matrixAutoUpdate]:null);});
      apply(C,rest);apply(C,rest);const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
      recs.forEach((r,i)=>{if(!r.o)return;const[q0,p0,ok]=/** @type {any[]} */(QS[0][i]);if(!ok)return;let ax=null,big=0;const ang=[];
        for(let j=1;j<pr.length;j++){const[q,p]=/** @type {any[]} */(QS[j][i]);if(p.distanceTo(p0)>1e-6)return;const d=q0.clone().invert().multiply(q);if(d.w<0)d.set(-d.x,-d.y,-d.z,-d.w);
          const s=Math.hypot(d.x,d.y,d.z),a=2*Math.atan2(s,d.w);if(s>1e-7&&a>big){big=a;ax=new THREE.Vector3(d.x,d.y,d.z).divideScalar(s);}ang.push([d,a,s]);}
        if(!ax||big<1e-6)return;const sg=ang.map(([d,a,s])=>{if(s<1e-7)return 0;const c=(d.x*ax.x+d.y*ax.y+d.z*ax.z)/s;return Math.abs(Math.abs(c)-1)>1e-4?NaN:c>0?a:-a;});
        if(sg.some(Number.isNaN))return;const kE=sg[0]/0.37,kS=sg[3]/97;if(pr.slice(1).every(([E,s],j)=>Math.abs(wrap(kE*E+kS*s-sg[j]))<2e-4))lin.set(r,{axis:[ax.x,ax.y,ax.z],kE,kS});});}
    /* the hairspring, whose shape is its balance's angle's alone (escapement.js spPath): shape keys 0.15 rad apart over the widest swing, drawn by the copy's own update() */
    const defs=new Map();
    { const sr=recs.find(r=>r.o===C.R.esc.spring);if(sr&&sr.rest){const TH=1.1*Math.max(...[0,0.25,0.5,0.75,0.99].map(f=>PE.ampAt(A.drvF(f*HRUN))),160*D2R),K=Math.ceil(2*TH/0.15)+1,keys=[sr.rest];
        for(let j=0;j<K;j++){apply(C,Object.assign({},rest,{th:-TH+2*TH*j/(K-1)}));keys.push(snap(C.R.esc.spring.geometry));}apply(C,rest);apply(C,rest);
        const u=(clamp(rest.th,-TH,TH)+TH)/(2*TH)*(K-1),j=Math.min(K-2,Math.floor(u));defs.set(sr,{mode:'morph',keys,shapes:null,tl:{},added:{},ok:new Map(),last:null,gap:0,theta:{TH,K},rest0:[1+j,2+j,u-j]});} }
    /* the mainspring, whose shape is the fusee's turn's alone (its vertices change with it, so a flipbook): 24 shapes over the whole run, the fusee turned with the train,
       each moment the nearest; inside the barrel, it is seen only with the barrel opened up */
    { const pm=C.mv.userData.parts.mainspring;let msM=null;if(pm)pm.traverse(o=>{if(o.isMesh&&!msM)msM=o;});const mr=msM&&recs.find(r=>r.o===msM);
      if(mr&&mr.rest){const K=24,shapes=[],rots=[],sg=C.R.fu.keySeat.g,q0=sg.rotation.y;
        for(let j=0;j<K;j++){const h=HRUN*j/(K-1);apply(C,Object.assign({},rest,{n:h/HPT,E:rest.E+(h-h0)*7200}));shapes.push(snap(msM.geometry));rots.push(sg.rotation.y);}apply(C,rest);apply(C,rest);
        let rj=0;rots.forEach((q,j)=>{if(Math.abs(q-q0)<Math.abs(rots[rj]-q0))rj=j;});
        defs.set(mr,{mode:'flip',keys:shapes,shapes,tl:{},added:{},ok:new Map(),last:null,gap:0,rots,restJ:rj,rest0:[rj]});} }
    /* the clips, each from the rest pose */
    const cl=clips(C,h0,rest.E).filter(c=>!only||only.includes(c.name)),out=[];let ci=0;
    for(const c of cl){onStep(`Recording <b>${c.name}</b> (${++ci} of ${cl.length})…`);await sleep();apply(C,rest);apply(C,rest);out.push([c,await record(C,recs,c,defs)]);}
    apply(C,rest);onStep('Writing the file…');await sleep();
    return writeDoc(C,recs,out,defs,lin,h0,t0,rest);}
  /* ---------- to the glTF document (the Hamilton's) ---------- */
  async function writeDoc(C,recs,out,defs,lin,h0,t0,rest){
    const keep=recs.filter(r=>r.ever),idx=new Map(keep.map((r,i)=>[r,i+1])),nodes=[],meshes=[],materials=[],textures=[],MI=new Map(),TI=new Map(),GI=new Map(),used=new Map();
    const uniq=n=>{const c=used.get(n)||0;used.set(n,c+1);return c?`${n} #${c+1}`:n;};
    /* textures drawn again finer than the page's where they can be (redraw, core.js) */
    const tex=(t,green,fine)=>{const k=t.uuid+(green?'g':'');if(TI.has(k))return TI.get(k);if(!t.image||!t.image.width)return null;const img=t.redraw?t.redraw(fine||TEXK):t.image;
      textures.push({img,flip:t.flipY,green,repeat:t.wrapS===THREE.RepeatWrapping});TI.set(k,textures.length-1);return textures.length-1;};
    const xfOf=t=>{if(!t)return null;const sx=t.repeat.x,sy=t.repeat.y,c=Math.cos(t.rotation),s=Math.sin(t.rotation),cx=t.center.x,cy=t.center.y;
      if(sx===1&&sy===1&&!t.rotation&&!t.offset.x&&!t.offset.y)return null;return{o:[-sx*(c*cx+s*cy)+cx+t.offset.x,-sy*(-s*cx+c*cy)+cy+t.offset.y],s:[sx,sy],r:t.rotation};};
    const M=A.M,MN=new Map(Object.entries(M).filter(([,v])=>v&&v.isMaterial).map(([k,v])=>[v,k])),GLASS=new Set([M.glass,M.clear].filter(Boolean));
    /* the materials as they are, the jewels and glass as what they are made of: transmission, with the index of ruby (1.77) and of glass (1.52) */
    const matOf=m=>{if(MI.has(m))return MI.get(m);const c=m.color||new THREE.Color(1,1,1),e=m.emissive?m.emissive.clone().multiplyScalar(m.emissiveIntensity??1):null,gl=GLASS.has(m),jw=m===M.ruby;
      const mo=/** @type {any} */({name:MN.get(m)||m.name||'material '+materials.length,color:[c.r,c.g,c.b,m.transparent&&!gl?m.opacity:1],metal:m.metalness??0,rough:m.roughness??1,emissive:jw||!e?null:[e.r,e.g,e.b],double:m.side===THREE.DoubleSide,blend:m.transparent&&!gl});
      if(m.map){const ti=tex(m.map,false,m.userData.inkDecal?ENGK:0);if(ti!=null){mo.map=ti;mo.xf=xfOf(m.map);}}
      if(m.normalMap){const ti=tex(m.normalMap,true);if(ti!=null){mo.nmap=ti;mo.nscale=m.normalScale?m.normalScale.x:1;mo.xf=mo.xf||xfOf(m.normalMap);}}
      if(gl){mo.trans=1;mo.ior=m===M.clear?1.77:1.52;mo.rough=Math.min(mo.rough,0.05);mo.metal=0;}if(jw){mo.trans=0.85;mo.ior=1.77;mo.metal=0;}
      materials.push(mo);MI.set(m,materials.length-1);return materials.length-1;};
    const meshOf=(g,m,s,name,share)=>{const k=g.uuid+'|'+(Array.isArray(m)?m.map(x=>x.uuid).join():m.uuid);if(share&&GI.has(k))return GI.get(k);
      const prims=Array.isArray(m)&&g.groups.length?g.groups.map(gr=>({...s,idx:s.idx?s.idx.slice(gr.start,gr.start+gr.count):Uint32Array.from({length:gr.count},(_,i)=>gr.start+i),mat:matOf(m[gr.materialIndex])})):[{...s,mat:matOf(Array.isArray(m)?m[0]:m)}];
      meshes.push({name,prims});if(share)GI.set(k,meshes.length-1);return meshes.length-1;};
    const flipKids=new Map();
    const moves=new Set([...lin.keys(),...defs.keys()]);for(const[,res]of out)for(const r of res.tr.keys())moves.add(r);   /* nodes that move in some clip: the rig puts them back at rest (extras.rest) */
    const ROLE=new Map([[C.CS.root,'box'],[C.CS.ring,'ring'],[C.CS.bowl,'bowl'],[C.mv,'movement'],[C.CS.lid,'lid']]);   /* for the rig: the nodes it turns itself */
    keep.forEach((r,i)=>{const v=r.restV,o=r.o,par=r.par&&r.par.name,mn=o&&o.isMesh&&!Array.isArray(o.material)?MN.get(o.material):'',nm=uniq(r.name||(o&&o.isMesh?(par||'piece')+(mn?' · '+mn:' · piece'):(par?par+' · frame':'frame')));
      const n=/** @type {any} */({name:nm,t:[v[0],v[1],v[2]],r:[v[3],v[4],v[5],v[6]],s:[v[7],v[8],v[9]],children:r.kids.filter(k=>idx.has(k)).map(k=>idx.get(k))}),x={};
      const ro=o&&ROLE.get(o);if(ro)x.role=ro;if(o&&o.userData.part)x.part=o.userData.part;if(moves.has(r))x.rest=Array.from(v,q=>+q.toFixed(7));if(o&&o.userData.hn)x.hn=o.userData.hn;const L=lin.get(r);if(L)x.rig=L;
      const d=defs.get(r);
      if(r.im){const g=r.im.geometry;n.mesh=meshOf(g,r.im.material,snap(g),r.im.material===M.steel?'chain rivets':'chain link '+(r.im.material===M.chain2?'B':'A'),true);}
      else if(r.rest){if(!d)n.mesh=meshOf(o.geometry,o.material,r.rest,nm,true);
        else if(d.mode==='morph'){const K=d.keys,base=K[0],mi=meshOf(o.geometry,o.material,base,nm,false),pm=meshes[mi].prims[0];
          if(K.length>1){pm.targets=K.slice(1).map(q=>{const p=new Float32Array(base.pos.length);for(let j=0;j<p.length;j++)p[j]=q.pos[j]-base.pos[j];return{pos:p};});
            const rw=K.slice(1).map(()=>0);if(d.rest0){rw[d.rest0[0]-1]+=1-d.rest0[2];rw[d.rest0[1]-1]+=d.rest0[2];}meshes[mi].weights=rw;d.rw=rw;meshes[mi].targetNames=K.slice(1).map((_,j)=>'shape '+(j+1));x.shapes=K.length-1;}n.mesh=mi;}
        else{const rj=d.restJ||0;flipKids.set(r,d.shapes.map((s,j)=>({name:uniq(nm+' · shape '+(j+1)),t:[0,0,0],r:[0,0,0,1],s:j!==rj?[0,0,0]:[1,1,1],extras:{rest:[0,0,0,0,0,0,1,...(j!==rj?[0,0,0]:[1,1,1])]},mesh:meshOf(o.geometry,o.material,s,nm+' · shape '+(j+1),false)})));x.shapes=d.shapes.length;x.flipbook=true;}}
      if(Object.keys(x).length)n.extras=x;nodes[i+1]=n;});
    for(const[r,kids]of flipKids){const n=nodes[/** @type {number} */(idx.get(r))];for(const kd of kids){nodes.push(kd);kd.i=nodes.length-1;n.children.push(kd.i);}}   /* a flipbook's shapes, after the tree's nodes */
    /* the animations: per clip, each node's channels that change, and the shapes' weights (morph) or which shape shows (flip, STEP) */
    const anims=out.map(([c,res])=>{const an={name:c.name,channels:[]},end=res.dur,mine=r=>!(c.skip&&c.skip.includes(r.part))&&!(c.only&&!c.only.includes(r.part));   /* skip: parts the clip leaves out; only: the parts it is for */
      for(const[r,tk]of res.tr){if(!idx.has(r)||!mine(r))continue;if(c.fast&&lin.has(r)&&Math.abs(lin.get(r).kE)*c.fast>0.5)continue;const ni=idx.get(r);if(tk.t[tk.t.length-1]<end){tk.t.push(end);tk.v.push(...tk.v.slice(-10));}
        const t=Float32Array.from(tk.t),m=t.length,V=tk.v,ch=(o,n,path,tol,q)=>{const a=new Float32Array(m*n);let moved=false;
          for(let j=0;j<m;j++)for(let k=0;k<n;k++){a[j*n+k]=V[j*10+o+k];if(Math.abs(a[j*n+k]-a[k])>1e-9)moved=true;}
          if(!moved)return;if(q)for(let j=1;j<m;j++){let dd=0;for(let k=0;k<4;k++)dd+=a[j*4+k]*a[(j-1)*4+k];if(dd<0)for(let k=0;k<4;k++)a[j*4+k]=-a[j*4+k];}   /* each quaternion on the side of the last, so the turn between them is the short way */
          const red=GLTF.reduce(t,a,n,tol,q);an.channels.push({node:ni,path,times:red.times,values:red.values,interp:'LINEAR'});};
        ch(0,3,'translation',TOLP);ch(3,4,'rotation',TOLQ,true);ch(7,3,'scale',TOLS);}
      for(const[r,d]of defs){if(!idx.has(r)||!mine(r))continue;const tl=d.tl[c.name];if(!tl||!tl.length)continue;if(tl[tl.length-1][0]<end)tl.push([end,...tl[tl.length-1].slice(1)]);const t=Float32Array.from(tl.map(q=>q[0]));
        if(d.mode==='morph'){const K=d.keys.length-1;if(!K)continue;const w=new Float32Array(tl.length*K);
          tl.forEach(([,a,b,u],j)=>{if(a)w[j*K+a-1]+=b===a?1:1-u;if(b&&b!==a)w[j*K+b-1]+=u;});const rw=d.rw||[];if(w.every((v,q)=>Math.abs(v-(rw[q%K]||0))<1e-6))continue;const red=GLTF.reduce(t,w,K,0.002);an.channels.push({node:idx.get(r),path:'weights',times:red.times,values:red.values,interp:'LINEAR'});}
        else{const kids=flipKids.get(r);if(!kids)continue;kids.forEach((kd,j)=>{const s=new Float32Array(tl.length*3);tl.forEach(([,a],q)=>{s[q*3]=s[q*3+1]=s[q*3+2]=a===j?1:0;});
          if(s.some(v=>v!==(j!==(d.restJ||0)?0:1))){const red=GLTF.reduce(t,s,3,0.5);an.channels.push({node:kd.i,path:'scale',times:red.times,values:red.values,interp:'STEP'});}});}}
      return an;});
    /* the root, millimetres to metres; and the rig's helper, whose x through a beat is the escape wheel's place in teeth less the beat's even run (E = beats + x) */
    nodes[0]={name:'Wempe Einheits-Chronometer',t:[0,0,0],r:[0,0,0,1],s:[0.001,0.001,0.001],children:[idx.get(keep[0])]};
    const helper=nodes.length;nodes.push({name:'Rig · escape wheel teeth',t:[0,0,0],r:[0,0,0,1],s:[1,1,1],extras:{rig:'teeth'}});
    out.forEach(([c,res],ai)=>{if(!res.teeth.length)return;const n=res.teeth.length/2,t=new Float32Array(n),v=new Float32Array(n*3);for(let j=0;j<n;j++){t[j]=res.teeth[2*j];v[3*j]=res.teeth[2*j+1];}
      anims[ai].channels.push({node:helper,path:'translation',times:t,values:v,interp:'LINEAR'});});
    const ver=(document.querySelector('meta[name=version]')||{}).getAttribute?.('content')||'';
    const extras={made:'The Marine Chronometer working model, the Wempe'+(ver?' '+ver:'')+', '+location.href.split('#')[0],units:'millimetres under the root node, which scales them to metres',start:{hours:h0,E:rest.E,slip:0},
      beat:0.5,fuseePerHour:1/A.HPT,runHours:A.HRUN,fuseeTurns:A.HRUN/A.HPT,fps:FPS,state:A.state(),clips:out.map(([c,res])=>Object.assign({name:c.name,about:c.d,seconds:+res.dur.toFixed(4),samples:res.samples},c.rig?{rig:c.rig}:{},c.hours?{hours:c.hours}:{}))};
    nodes[0].extras=extras;   /* Blender keeps a node's extras as the object's custom properties: the rig reads them here */
    const blob=await GLTF.write({generator:'Marine Chronometer working model, the Wempe (wempe/js/blender.js)',nodes,roots:[0,helper],meshes,materials,textures,animations:anims,extras});
    return{blob,stats:{nodes:nodes.length,meshes:meshes.length,materials:materials.length,clips:anims.length,s:((performance.now()-t0)/1000).toFixed(1)}};}
  const FILE='wempe-einheitschronometer';
  async function exportGLB(){const b=/** @type {HTMLButtonElement|null} */(document.getElementById('xGLB'));if(b)b.disabled=true;
    try{const{blob,stats}=await build(say);save(blob,FILE+'.glb');
      say(`<b>${FILE}.glb</b><span>${(blob.size/1048576).toFixed(1)} MB, ${stats.nodes} nodes, ${stats.meshes} meshes, ${stats.materials} materials, ${stats.clips} animations, made in ${stats.s} s. In Blender: File, Import, glTF 2.0; then open the rig in the Text Editor and run it.</span>`);}
    catch(e){say('The export failed: '+e.message);throw e;}finally{if(b)b.disabled=false;}}
  const fmtN=n=>n.toLocaleString('en');
  return{bind(api){A=api;const g=document.getElementById('xGLB'),r=document.getElementById('xRig'),s=document.getElementById('xSTL'),ps=document.getElementById('infoSTL');
      if(g)g.addEventListener('click',()=>{exportGLB();});
      if(r)r.addEventListener('click',()=>save(new Blob([typeof RIG_PY==='string'?RIG_PY:''],{type:'text/x-python'}),FILE+'-rig.py'));
      if(s)s.addEventListener('click',()=>{const{blob,n}=movementSTL();save(blob,FILE+'-movement.stl');say(`<b>${FILE}-movement.stl</b><span>The movement as shown, ${fmtN(n)} triangles, in millimetres (the movement's frame: dial side +y, 12 o'clock −z).</span>`);});
      if(ps)ps.addEventListener('click',()=>{const p=A.pick();if(!p)return;const q=partSTL(p);if(!q)return;const nm=FILE+'-'+p.replace(/\./g,'-')+'.stl';save(q.blob,nm);say(`<b>${nm}</b><span>${fmtN(q.n)} triangles, in millimetres.</span>`);});
      if(/[?&]qa\b/.test(location.search)){window.__glb=async(only)=>{const{blob,stats}=await build(m=>console.log('glb '+Math.round(performance.now())+' '+m.replace(/<[^>]+>/g,'')),only);save(blob,FILE+'.glb');return stats;};   /* for the tools: the export, saved as a download */
        window.__stl=p=>{const q=p?partSTL(p):movementSTL();if(!q)return null;const u=new Uint8Array(q.blob.size);return q.blob.arrayBuffer().then(b=>{u.set(new Uint8Array(b));let s='';for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s);});};}},   /* an STL as base64 (stl_check.py) */
    build,stl:(ms,fr)=>stl(ms,fr).blob,partSTL,movementSTL};
})();
