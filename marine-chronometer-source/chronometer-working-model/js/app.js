/* app.js: renderer, camera, controls, cross-sections, label placement, part info, walkthrough, animation loop; ?qa hooks for verification
   Part of 'The Marine Chronometer, working' (three.js r128). See README.md. */

/* ================= part descriptions (tap to identify) ================= */
const INFO={
  box:['Mounting box','Mahogany with brass fittings and two hinged covers: an upper lid, and a second cover with a glass top so the dial can be read while it stays closed. Felt protects the outside bottom.','No. 42201 · scaled to 7¾ × 7¾ in.'],
  lid:['Upper lid','Protects the instrument. Kept closed except when reading, winding or comparing.',''],
  lidGlass:['Glass-top cover','The second cover. Usually kept closed; the dial is read through its glass.',''],
  ring:['Gimbal ring','Flat brass ring hung on two pivot screws that come in through the sides of the mounting box, with washers and lock nuts. The case pivots in it on front and rear pivot screws 90° away, each with a knurled lock nut, so the movement tends to stay level whatever the box does. Slotted support straps at 3 and 6 set the level.','Ring 42106 · straps 42107, 42108 · pivot screws 42120, 42118, 42119 · lock nuts 42121'],
  latch:['Gimbal latch','Locks the gimbals so the case cannot swing, when the box is carried or the lid must be closed with the instrument out of its box. Shown released.','Lever 42111 · handle 42112 · brackets 42109, 42110'],
  bowl:['Chronometer case','Brass bowl and bezel with crystal. The winding-hole shield plate on its bottom is turned clockwise to admit the key and springs back when the key is removed.','Case No. 42101, bezel 42102'],
  key:['Winding key','Wind to the left (counterclockwise). Seven half turns restore 24 hours of running; 17½ half turns wind a run-down chronometer fully.','No. 42044'],
  pillar:['Pillar plate','Foundation of the movement. The barrel and train bridges stand off it on four pillars; the lower train bridge is mounted directly on its dial side.','No. 42060 · 87.57 mm diameter, 3.86 mm thick'],
  ltb:['Lower train bridge','Screwed to the dial side of the pillar plate, under the dial; carries the third and fourth wheel lower settings (bar-hole jewels).','No. 42063'],
  pillars:['Pillars','Four pillars: three for the upper train bridge, one for the barrel bridge.','Nos. 42059, 42058'],
  trainBridge:['Upper train bridge','Carries the centre and third wheel upper bushings. The balance cock, balance lower bridge and escape upper bridge are mounted to it; the detent support block is fastened to its underside.','No. 42062'],
  barrelBridge:['Barrel bridge','Holds the upper pivots of both the barrel and the fusee. The fusee winding stop is on its underside; the setup ratchet and the dust seal sit on top.','No. 42061 · winding stop 42099'],
  escBridge:['Escape upper bridge','Small bridge holding the escape wheel’s upper jewel and endstone.','No. 42064'],
  lowerBridge:['Balance lower bridge','Supports the lower cap jewel of the balance staff and the fourth wheel upper setting.','No. 42065'],
  dial:['Dial','Black on silver-white. Hours 1–12 with 60 minute graduations; UP–DOWN indicator below the 12, numbered 8 to 48; seconds at 6, numbered 5 to 60.','No. 42030'],
  hands:['Hands','Hour and minute hands on the centre wheel staff, second hand on the fourth wheel staff, wind indicator hand on its own wheel. The hands advance in half-second increments.','Nos. 42032–42035'],
  motion:['Motion work','Cannon pinion, minute wheel and hour wheel under the dial. A pinion on the dial end of the fusee arbor drives the wind indicator wheel.','Nos. 42077, 42078, 42080, 42081'],
  gw:['Fusee wheel','The first wheel of the train; it drives the centre wheel pinion. Under load the sustaining spring couples it to the sustaining ratchet wheel; during winding that spring alone drives the train.','No. 42015 · 96 teeth here'],
  spawl:['Sustaining pawl','Holds the sustaining ratchet wheel from turning back while the fusee is wound, so the sustaining spring can only release its power forward into the train, enough to run the chronometer 5 to 10 minutes.','No. 42096'],
  cw:['Centre wheel','Second wheel of the train. Its long arbor passes through the pillar plate and dial and carries the cannon pinion and hour wheel.','No. 42068 · 1 turn an hour'],
  tw:['Third wheel','Drives the fourth wheel pinion.','No. 42071'],
  fw:['Fourth wheel','Its long arbor passes through the dial to carry the second hand. Jewelled at both ends; its upper setting is in the balance lower bridge.','No. 42073 · 1 turn a minute'],
  escW:['Escape wheel','Released one tooth per oscillation of the balance, so the second hand advances in half-second steps. Sixteen teeth (most chronometers use 13 or 15), 13.16 mm across and 1.3 mm thick.','No. 42076 · 16 teeth, 1 turn / 8 s'],
  det:['Detent','Beryllium-copper spring detent. Its foot is clamped to the support block under the upper train bridge, and the detent-adjusting screw sets it lengthwise. Ahead of the foot: the two-strip detent spring (the point of flexure), the blade, the locking jewel (round, with a flat set at about 10° of draw) and the abutment arm (horn). It rests against the stop button, set by the lock-adjusting screw. The trip (passing) spring, of Hamilton Elinvar, is held on it by an angle bracket and rests on the horn.','Detent 42087, trip spring 42088, block 42086'],
  bal:['Balance and hairspring assembly','Solid, uncut stainless-steel rim silver-soldered to an Invar arm, with tapped holes all round for balance screws, two timing weights and two vernier timing weights. Motion 1⅜ to 1½ turns. Impulse and unlocking rollers on the staff. Rim about 29 mm across, measured on a top-view photograph.','Wheel 42178 · staff 42186 · rollers 42263, 42252'],
  spr:['Hairspring','Cylindrical, of Hamilton Elinvar, pinned to its collet and stud without deformation, so its active length is the same winding and unwinding. There is no regulator: rate is set with the balance screws and weights.','No. 42188'],
  cock:['Balance cock','Carries the balance upper jewel, endstone and the hairspring stud. Its foot stands on the upper train bridge beside the barrel bridge, held by one screw.','No. 42066 · screw 42192'],
  fusee:['Fusee','Shaped so the moment of force on the fusee wheel is always about the same, fully wound or nearly run down. The winding stop-bar in its top moves out at full wind to catch the winding stop under the barrel bridge.','No. 42021 · stop-bar 42024'],
  barrel:['Mainspring barrel','Holds the mainspring and its brace. Turns clockwise while running, drawing the chain from the fusee.','No. 42168'],
  mainspring:['Mainspring','Inner end on the fixed barrel arbor, outer end on the barrel’s anchor pin. Coils drawn schematically.','No. 42038 · 0.0165 in. thick'],
  chain:['Fusee chain','Links the barrel to the fusee.','No. 42001'],
  ratchet:['Setup ratchet','Setup ratchet wheel on the barrel arbor under the bow-shaped cover plate, with setup pawl (click) and spring. Keeps the arbor from turning in winding and running.','Wheel 42026 · cover plate 42029'],
  post:['Dust seal','Nickel dust seal on the barrel bridge where the fusee arbor rises through it, capped by three packing rings over a seal ring and helical spring. The key reaches the squared arbor through it.','Seal 42051 · packing rings 42054'],
  sq:['Fusee arbor square','Turned counterclockwise by the key to wind.','Arbor 42022']
};

/* ================= 2D escapement inset ================= */
function drawEsc2D(ctx,w,h,p,dark){
  const E=ESC,s=E.state(p),NT=E.NT,P=E.P,EX=E.EX,RT=1,RR=0.77;
  ctx.clearRect(0,0,w,h);
  const x0=-2.5,x1=0.95,y0=-2.45,y1=1.15,sc=Math.min(w/(x1-x0),h/(y1-y0)),ox=(w-(x1-x0)*sc)/2-x0*sc,oy=(h-(y1-y0)*sc)/2+y1*sc,X=x=>ox+x*sc,Y=y=>oy-y*sc;
  const ink=dark?'#e4e8eb':'#141a20',brass=dark?'#d8a94f':'#b58325',steel=dark?'#8e98a3':'#8a939c',copper=dark?'#d49a63':'#b87840',ruby='#c3163b',paper=dark?'#1b2127':'#ffffff';
  const prog=(s.prog%1),phi=-prog*P;
  ctx.beginPath();let f=true;
  for(let k=0;k<NT;k++){const a=E.t0+k*P+phi,pts=[[RR,a-0.005],[RT,a]];for(let j=1;j<=6;j++){const q=j/6;pts.push([RT-(RT-RR)*Math.pow(q,0.6),a+P*0.72*q]);}pts.push([RR,a+P*0.99]);
    for(const[r,aa]of pts){const px=X(EX+r*Math.cos(aa)),py=Y(r*Math.sin(aa));f?ctx.moveTo(px,py):ctx.lineTo(px,py);f=false;}}
  ctx.closePath();ctx.fillStyle=brass;ctx.fill();ctx.fillStyle=paper;ctx.beginPath();ctx.arc(X(EX),Y(0),0.6*sc,0,TAU);ctx.fill();
  ctx.strokeStyle=brass;ctx.lineWidth=0.08*sc;for(let k=0;k<4;k++){const a=phi+k*TAU/4+0.3;ctx.beginPath();ctx.moveTo(X(EX),Y(0));ctx.lineTo(X(EX+0.62*Math.cos(a)),Y(0.62*Math.sin(a)));ctx.stroke();}
  { const arc=(r,a0,a1,n)=>{for(let i=0;i<=n;i++){const q=a0+(a1-a0)*i/n;ctx.lineTo(X(r*Math.cos(q)),Y(r*Math.sin(q)));}},a=E.aI+s.th,rr=E.rRoll;   /* impulse roller with its crescent, as built */
    ctx.fillStyle=steel;ctx.globalAlpha=0.25;ctx.beginPath();arc(rr,a+0.16,a-0.6+TAU,60);arc(rr*0.55,a-0.6,a,12);arc(rr*0.86,a,a+0.16,4);ctx.closePath();ctx.fill();ctx.globalAlpha=1; }
  const jewel=(ang,r0,r1,wd)=>{const c=Math.cos(ang),sn=Math.sin(ang),px=-sn*wd/2,py=c*wd/2;ctx.fillStyle=ruby;ctx.beginPath();ctx.moveTo(X(r0*c+px),Y(r0*sn+py));ctx.lineTo(X(r1*c+px),Y(r1*sn+py));ctx.lineTo(X(r1*c-px),Y(r1*sn-py));ctx.lineTo(X(r0*c-px),Y(r0*sn-py));ctx.closePath();ctx.fill();};
  jewel(E.aIc+s.th,E.rRoll-0.08,E.rp,E.wI);
  const del=-s.lift/E.LEN,cd=Math.cos(del),sd=Math.sin(del),Ft=E.Ft,R=p2=>({x:Ft.x+(p2.x-Ft.x)*cd-(p2.y-Ft.y)*sd,y:Ft.y+(p2.x-Ft.x)*sd+(p2.y-Ft.y)*cd});
  const poly=(pts,col,fix)=>{ctx.beginPath();pts.forEach((q,i)=>{const r=fix?q:R(q);i?ctx.lineTo(X(r.x),Y(r.y)):ctx.moveTo(X(r.x),Y(r.y));});ctx.closePath();ctx.fillStyle=col;ctx.fill();};
  ctx.globalAlpha=0.35;for(const k in E.fixed)poly(E.fixed[k],k==='foot'?copper:steel,true);ctx.globalAlpha=1;for(const k in E.pieces)poly(E.pieces[k],k==='stone'?ruby:copper);   /* support block and stop button fixed; the detent turns about its point of flexure */
  const[a0,am,tp]=E.springPts(s);
  ctx.strokeStyle=steel;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X(a0.x),Y(a0.y));ctx.quadraticCurveTo(X(am.x),Y(am.y),X(tp.x),Y(tp.y));ctx.stroke();
  ctx.fillStyle=steel;ctx.beginPath();ctx.arc(X(0),Y(0),E.rDR*sc,0,TAU);ctx.fill();jewel(E.aD+s.th,E.rDR-0.05,E.rd,E.wD);
  ctx.fillStyle=ink;ctx.beginPath();ctx.arc(X(0),Y(0),3,0,TAU);ctx.fill();
  ctx.fillStyle=dark?'#9aa4ad':'#5b656e';ctx.font='11px "Instrument Sans",sans-serif';ctx.textAlign='left';
  ctx.fillText('escape wheel',X(-2.35),Y(1.02));ctx.fillText('detent',X(-2.4),Y(-1.2));ctx.fillText('balance rollers',X(0.1),Y(0.75));
  const ccw=Math.sin(TAU*p)>0,th=s.th;let t;
  if(!ccw)t=s.psDef>0.005?'Return swing: passing spring bends aside, detent untouched':'Wheel locked, balance swinging free';
  else if(s.lift>0.005&&s.prog===0)t='Unlocking: pallet lifts the detent via the passing spring';
  else if(s.prog>0&&s.prog<1)t=s.prog<0.25?'Unlocked: the wheel drops forward':'Impulse: a tooth drives the balance';
  else t=s.lift>0.005?'Detent returns and locks the next tooth':'Wheel locked, balance swinging free';
  ctx.fillStyle=ink;ctx.font='600 12px "Instrument Sans",sans-serif';ctx.fillText(t,8,h-8);
  ctx.textAlign='right';ctx.fillStyle=dark?'#9aa4ad':'#5b656e';ctx.font='11px "Instrument Sans",sans-serif';ctx.fillText('balance '+(Math.round(th/D2R)||0)+'°',w-8,14);
}

/* ================= app ================= */
(async function(){
  const stage=$('#stage'),cv=stage.querySelector('canvas');
  if(typeof THREE==='undefined'){$('#loading').textContent='The 3D library didn’t load. Reload the page to try again.';return;}
  try{await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2500))]);}catch(_){}
  const dark=()=>matchMedia('(prefers-color-scheme: dark)').matches&&document.documentElement.dataset.theme!=='light'||document.documentElement.dataset.theme==='dark';
  let r;try{r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});}catch(_){$('#loading').textContent='This browser couldn’t start 3D graphics (WebGL). Try another browser, or turn on hardware acceleration.';return;}r.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  r.outputEncoding=THREE.sRGBEncoding;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.08;
  r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();scene.environment=envTex(r);
  /* a lost WebGL context (a phone switching apps, a GPU reset) comes back without the generated environment map that lights the metals: rebuild it */
  cv.addEventListener('webglcontextrestored',()=>{scene.environment=envTex(r);});
  scene.add(new THREE.HemisphereLight(0xffffff,0x333333,0.28));
  const key=new THREE.DirectionalLight(0xfff4e6,1.0);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.bias=-0.0004;key.shadow.normalBias=0.6;
  const scam=key.shadow.camera;scam.left=-170;scam.right=170;scam.top=170;scam.bottom=-170;scam.near=1;scam.far=1200;scene.add(key,key.target);
  const cam=new THREE.PerspectiveCamera(32,1,1,6000);
  const M=mats();const BX=buildBox(M);scene.add(BX.root);
  const BOXM=[];BX.root.traverse(o=>{if(o.isMesh)BOXM.push(o);});
  const mv=buildMovement(M);BX.bowl.add(mv);
  const sh=new THREE.Mesh(new THREE.PlaneGeometry(640,640).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:shadowTex(),transparent:true,depthWrite:false}));sh.position.y=-101;scene.add(sh);
  const R=mv.userData.R,P=mv.userData.parts;if(/[?&]qa\b/.test(location.search)){window.__mv=mv;window.__proj=(pts,yaw,pitch,dist,fov)=>{const c2=new THREE.PerspectiveCamera(fov,W/Hh,1,6000),t=new THREE.Vector3(0,-26,0);mv.localToWorld(t);const cp=Math.cos(pitch);c2.position.set(t.x+dist*cp*Math.sin(yaw),t.y+dist*Math.sin(pitch),t.z+dist*cp*Math.cos(yaw));c2.lookAt(t);c2.updateMatrixWorld();c2.updateProjectionMatrix();return pts.map(p=>{const v=new THREE.Vector3(...p);mv.localToWorld(v);v.project(c2);return[(v.x+1)/2*W,(1-v.y)/2*Hh];});};window.__unproj=(pts,yaw,pitch,dist,fov)=>{const c2=new THREE.PerspectiveCamera(fov,W/Hh,1,6000),t=new THREE.Vector3(0,-26,0);mv.localToWorld(t);const cp=Math.cos(pitch);c2.position.set(t.x+dist*cp*Math.sin(yaw),t.y+dist*Math.sin(pitch),t.z+dist*cp*Math.cos(yaw));c2.lookAt(t);c2.updateMatrixWorld();c2.updateProjectionMatrix();
    const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert();return pts.map(([sx,sy,h])=>{const ndc=new THREE.Vector2(sx/W*2-1,-(sy/Hh*2-1));const rc=new THREE.Raycaster();rc.setFromCamera(ndc,c2);
      const o=rc.ray.origin.clone().applyMatrix4(inv),dd=rc.ray.direction.clone().transformDirection(inv);const tt=(h-o.y)/dd.y;return[o.x+dd.x*tt,o.z+dd.z*tt];});};
  window.__camInfo=()=>JSON.stringify({fov:cam.fov,aspect:cam.aspect,pos:cam.position.toArray().map(v=>+v.toFixed(2)),tgt:C.target.toArray().map(v=>+v.toFixed(2)),C:{yaw:C.yaw,pitch:C.pitch,dist:C.dist},W,Hh});
  window.__cam=(yaw,pitch,dist,fov)=>{cam.fov=fov;cam.updateProjectionMatrix();goCam({yaw,pitch,dist,target:mvL(0,-26,0)});G.dist=dist;C.dist=dist;C.yaw=G.yaw;C.pitch=pitch;camFree=false;};
  window.__look=(yaw,pitch,dist,x,y,z)=>{goCam({yaw,pitch,dist,target:mvL(x,y,z)});};}
  const partOf=o=>{while(o){if(o.userData&&o.userData.partName)return o.userData.partName;o=o.parent;}return null;};
  const MVM=[];mv.traverse(o=>{if(o.isMesh){o.userData.part=partOf(o);o.userData.mat0=o.material;o.receiveShadow=true;MVM.push(o);}});
  BOXM.forEach(o=>{o.userData.part=partOf(o);o.userData.mat0=o.material;o.receiveShadow=true;o.castShadow=o.material!==M.glass;});
  /* ---------- cross-sections ---------- */
  r.localClippingEnabled=true;
  for(const o of[...MVM,...BOXM]){const m=o.userData.mat0;if(m&&m.isMeshStandardMaterial)patchSection(m,m.side!==THREE.DoubleSide&&!m.transparent&&!o.userData.noCap);}
  const secLocal=new THREE.Plane(),secPlane=new THREE.Plane();
  const SECDEF={x:{n:[-1,0,0],min:-55,max:55,def:0},z:{n:[0,0,1],min:-55,max:55,def:-20.75},y:{n:[0,1,0],min:-46,max:6,def:-23.5}};
  let secMode='off',secOff=0,secFlip=false;
  const secIn=$('#secOff'),secOut=secIn.parentElement.querySelector('output');
  function applySec(){$('#secOpts').classList.toggle('hidden',secMode==='off');
    if(secMode==='off'){setSection(false,secPlane);return;}const d=SECDEF[secMode],k=secFlip?-1:1;
    secLocal.set(new THREE.Vector3(...d.n).multiplyScalar(k),-secOff*k);setSection(true,secPlane);secOut.textContent=secOff.toFixed(1)+' mm';}
  document.querySelectorAll('#secs button').forEach(b=>b.addEventListener('click',()=>{secMode=b.dataset.v;
    document.querySelectorAll('#secs button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));
    if(secMode!=='off'){const d=SECDEF[secMode];secIn.min=d.min;secIn.max=d.max;secOff=d.def;secIn.value=d.def;}applySec();look();}));
  secIn.addEventListener('input',()=>{secOff=parseFloat(secIn.value);applySec();});
  $('#secFlip').addEventListener('change',e=>{secFlip=e.target.checked;applySec();});

  /* ---------- state ---------- */
  const st={drive:false,mwOn:false,see:false,colr:false,op:{},hid:new Set(),focus:null,pick:null,labels:true,rock:false,speed:1,sound:false,view:'dial',tour:-1};
  const cur={lift:0,flip:0,explode:0,lidM:0,lidT:0},tgt={...cur};
  let hrs=20,winding=false,tSim=Date.now()/1000-new Date().getTimezoneOffset()*60,tVis=0,rockT=0,roll=0,pitch=0,lastE=null;
  const PLATES=new Set(['pillar','pillars','trainBridge','barrelBridge','escBridge','lowerBridge','ltb','cock','dial']),DRIVE_HIDE=new Set(['pillar','pillars','trainBridge','barrelBridge','escBridge','lowerBridge','ltb','dial','cock','post']);
  /* colour mode: one flat CAD-style colour per part; the part labels double as the legend */
  const PCOL={box:'#a9745b',lid:'#8a5a44',lidGlass:'#c49a7a',ring:'#9aa1a8',bowl:'#c4b27a',key:'#6d7a8a',latch:'#7d9a4a',
    pillar:'#9fb4c8',ltb:'#b6d7c9',pillars:'#707a84',trainBridge:'#c9d8a8',barrelBridge:'#e3cfa6',escBridge:'#c8b8e3',lowerBridge:'#a8d4e0',cock:'#d8b0c8',
    gw:'#d9453b',fusee:'#e88a2e',barrel:'#b86bd1',mainspring:'#334f8f',chain:'#4a4f57',ratchet:'#a0922f',sq:'#5e6b2a',post:'#8c6b4a',spawl:'#1fa05a',
    cw:'#f2c230',tw:'#7cc242',fw:'#2fb3a6',escW:'#2f7fe0',det:'#e0457b',bal:'#8a5cf0',spr:'#f25fd0',hands:'#1b1b1b',motion:'#a45a3c'};
  const COLM=new Map();
  function colourOf(m0,p){if(!p||!PCOL[p]||p==='dial'||m0.transparent||!m0.color)return m0;const k=m0.uuid+p;let c=COLM.get(k);
    if(!c){c=m0.clone();c.userData={};c.map=null;c.normalMap=null;c.color=sc(PCOL[p]);if('metalness'in c){c.metalness=0.1;c.roughness=0.55;}if(c.emissive)c.emissive.setRGB(0,0,0);
      patchSection(c,!!m0.userData.secCap);c.userData.side0=m0.userData.side0??m0.side;c.side=m0.side;c.clippingPlanes=[...(m0.clippingPlanes||[])];COLM.set(k,c);}return c;}
  /* per-part opacity, set from the right-click menu */
  const FADE=new Map();
  function fadeOf(m0,p,op){const k=m0.uuid+p;let f=FADE.get(k);
    if(!f){f=m0.clone();f.userData={};f.transparent=true;f.depthWrite=false;patchSection(f,false);f.userData.side0=m0.userData.side0??m0.side;f.side=m0.side;f.clippingPlanes=[...(m0.clippingPlanes||[])];FADE.set(k,f);}
    f.opacity=(m0.opacity??1)*op;return f;}
  const base=m=>{const p=m.userData.part,m0=st.colr?colourOf(m.userData.mat0,p):m.userData.mat0,op=st.op[p];return op!=null&&op<1?fadeOf(m0,p,op):m0;};
  const opHide=m=>st.hid.has(m.userData.part)||st.op[m.userData.part]===0;
  /* the mainspring is drawn only when the barrel is opened up: drive-train mode, any cross-section, or the barrel or spring picked */
  const msShown=()=>{const foc=st.pick?new Set([st.pick]):st.focus;return st.drive||secMode!=='off'||!!(foc&&(foc.has('mainspring')||foc.has('barrel')));};
  function look(){
    const foc=st.pick?new Set([st.pick]):st.focus;
    for(const m of MVM){const p=m.userData.part;let vis=true;
      if(st.drive&&(DRIVE_HIDE.has(p)||(!st.mwOn&&(p==='motion'||p==='hands'))))vis=false;
      if(m.userData.onlyDrive&&!msShown())vis=false;
      if(st.drive&&m.userData.driveHide)vis=false;
      const gh=(st.see&&PLATES.has(p))||(st.drive&&m.userData.driveGhost)||(foc&&!foc.has(p)&&!(p==='mainspring'&&foc.has('barrel')));
      if(m.userData.noShadow&&gh)vis=false;
      m.visible=vis&&!opHide(m);m.material=gh?ghostOf(base(m)):base(m);m.castShadow=!gh&&!m.userData.noShadow;}
    for(const m of BOXM){m.visible=!st.drive&&!opHide(m);const gh=foc&&!foc.has(m.userData.part)&&m.userData.mat0!==M.glass;m.material=gh?ghostOf(base(m)):base(m);m.castShadow=!gh&&m.userData.mat0!==M.glass;}
    sh.visible=!st.drive;
    document.querySelectorAll('#views button').forEach(b=>{b.disabled=st.drive&&(b.dataset.v==='box'||b.dataset.v==='dial');});
    $('#mwWrap').classList.toggle('hidden',!st.drive);
    $('#driveOn').checked=st.drive;
    $('#ghost').checked=st.see;stage.classList.toggle('colr',st.colr);
  }

  /* ---------- camera ---------- */
  const C={yaw:0.75,pitch:0.42,dist:640,target:new THREE.Vector3(0,-20,0)},G={yaw:C.yaw,pitch:C.pitch,dist:C.dist,target:C.target.clone(),follow:null};
  let W=1,Hh=1;const resize=()=>{W=stage.clientWidth;Hh=stage.clientHeight;r.setSize(W,Hh,false);cam.aspect=W/Hh;cam.updateProjectionMatrix();};new ResizeObserver(resize).observe(stage);resize();
  const mvL=(x,y,z)=>{const v=new THREE.Vector3(x,y,z);return()=>mv.localToWorld(v.clone());};
  const fixed=(x,y,z)=>()=>new THREE.Vector3(x,y,z);
  const VIEWS={
    box:{lidM:0,lidT:0,lift:0,flip:0,explode:0,yaw:0.72,pitch:0.4,dist:640,target:fixed(0,-22,0)},
    dial:{lidM:1,lidT:1,lift:0,flip:0,explode:0,yaw:0.3,pitch:1.02,dist:330,target:fixed(0,-15,0)},
    movement:{lidM:1,lidT:1,lift:1,flip:1,explode:0,yaw:-0.62,pitch:0.64,dist:235,target:mvL(0,-24,2)},
    train:{lidM:1,lidT:1,lift:1,flip:1,explode:0,yaw:0.2,pitch:1.05,dist:210,target:mvL(0,-20,8),see:true},
    escapement:{lidM:1,lidT:1,lift:1,flip:1,explode:0,yaw:1.9,pitch:-0.75,dist:78,target:mvL(8.0,-25,12),see:true},   /* from the pillar-plate side: the balance is then behind the escapement, not in front of it */
    exploded:{lidM:1,lidT:1,lift:1,flip:1,explode:1,yaw:0.9,pitch:0.28,dist:520,target:mvL(0,-40,0)}};
  /* keep the same horizontal coverage on narrow screens: distance grows as the aspect ratio falls below 1.5 */
  const aspectK=()=>clamp(1.25/(W/Hh),1,2.2);
  function goCam(v){G.yaw=C.yaw+((((v.yaw-C.yaw+Math.PI)%TAU)+TAU)%TAU-Math.PI);G.pitch=v.pitch;G.dist=v.dist*aspectK()*(st.drive&&v.lift?0.8:1);G.follow=v.target;camFree=false;}
  let camFree=false;
  function setView(k,keepSee){const v=VIEWS[k];if(st.drive&&(k==='box'||k==='dial'))k='movement';const vv=VIEWS[k];
    Object.assign(tgt,{lift:st.drive?1:vv.lift,flip:st.drive?1:vv.flip,explode:vv.explode,lidM:vv.lidM,lidT:vv.lidT});goCam(vv);st.view=k;
    if(!keepSee){st.see=!!vv.see;}look();
    document.querySelectorAll('#views button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===k?'true':'false'));}
  /* pointer: orbit, pinch, tap to pick */
  const ptrs=new Map();let pinch=0,down=null,rMoved=0;
  cv.addEventListener('pointerdown',e=>{ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});try{cv.setPointerCapture(e.pointerId);}catch(_){}stage.classList.add('grab');down={x:e.clientX,y:e.clientY,t:performance.now(),moved:0,btn:e.button};});
  cv.addEventListener('pointermove',e=>{const p=ptrs.get(e.pointerId);if(!p)return;
    if(down)down.moved+=Math.abs(e.clientX-p.x)+Math.abs(e.clientY-p.y);
    if(ptrs.size===1&&down&&down.moved>4){camFree=true;C.yaw-=(e.clientX-p.x)*0.008;C.pitch=clamp(C.pitch+(e.clientY-p.y)*0.008,-1.3,1.52);G.yaw=C.yaw;G.pitch=C.pitch;}
    p.x=e.clientX;p.y=e.clientY;
    if(ptrs.size===2){const[a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);if(pinch)C.dist=G.dist=clamp(C.dist*pinch/d,30,1500);pinch=d;if(down)down.moved=99;}});
  const up=e=>{if(down&&down.btn===2)rMoved=down.moved;const wasTap=down&&down.btn===0&&down.moved<6&&ptrs.size===1&&performance.now()-down.t<500;ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=0;if(!ptrs.size){stage.classList.remove('grab');}
    if(wasTap&&e.type==='pointerup')pick(e);if(!ptrs.size)down=null;};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('wheel',e=>{e.preventDefault();C.dist=G.dist=clamp(C.dist*Math.exp(e.deltaY*0.0012),30,1500);},{passive:false});
  const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();
  function pick(e){const rc=cv.getBoundingClientRect();ndc.set((e.clientX-rc.left)/rc.width*2-1,-(e.clientY-rc.top)/rc.height*2+1);ray.setFromCamera(ndc,cam);
    const hits=ray.intersectObjects([BX.root],true).filter(h=>h.object.visible&&h.object.userData.part&&!(h.object.material.transparent&&h.object.material.opacity<0.5));
    const hit=hits.find(h=>INFO[h.object.userData.part]);
    if(!hit){closeInfo();return;}
    const p=hit.object.userData.part;st.pick=p;look();const[t,d,sp]=INFO[p];
    const info=$('#info');info.querySelector('h3').textContent=t;info.querySelector('p').textContent=d;info.querySelector('.spec').textContent=sp||'';info.classList.add('on');$('#hint').style.opacity=0;}
  function closeInfo(){if(st.pick){st.pick=null;look();}$('#info').classList.remove('on');}
  $('#info .x').addEventListener('click',closeInfo);
  /* right-click a part: opacity and hide. Prefers the nearest solid part, so faded parts in front can be looked through.
     Hidden parts can't be clicked, so the menu lists them for unhiding; right-click empty space to reach that list alone */
  const opm=$('#opm'),opIn=opm.querySelector('input'),opOut=opm.querySelector('output'),opP=$('#opPart'),opH=$('#opHid'),chips=opH.querySelector('.chips');let opPart=null;
  const opShow=()=>{const v=Math.round((st.op[opPart]??1)*100);opIn.value=v;opOut.textContent=v+'%';};
  function opList(){chips.innerHTML='';for(const p of st.hid){const b=document.createElement('button');b.textContent=INFO[p][0];b.title='Show '+INFO[p][0];b.addEventListener('click',()=>{st.hid.delete(p);look();opRender();});chips.appendChild(b);}}
  function opRender(){opP.classList.toggle('hidden',!opPart);opH.classList.toggle('hidden',!st.hid.size);opList();
    opm.querySelector('h4').textContent=opPart?INFO[opPart][0]:'Hidden parts';if(opPart)opShow();if(!opPart&&!st.hid.size)closeOpm();}
  function closeOpm(){opm.classList.remove('on');opPart=null;}
  cv.addEventListener('contextmenu',e=>{e.preventDefault();if((down?down.moved:rMoved)>6)return;const rc=cv.getBoundingClientRect();ndc.set((e.clientX-rc.left)/rc.width*2-1,-(e.clientY-rc.top)/rc.height*2+1);ray.setFromCamera(ndc,cam);
    const hits=ray.intersectObjects([BX.root],true).filter(h=>h.object.visible&&INFO[h.object.userData.part]);
    const hit=hits.find(h=>!(h.object.material.transparent&&h.object.material.opacity<0.5))||hits.find(h=>st.op[h.object.userData.part]!=null);
    if(!hit&&!st.hid.size){closeOpm();return;}
    opPart=hit?hit.object.userData.part:null;opm.classList.add('on');opRender();
    const sr=stage.getBoundingClientRect();opm.style.left=clamp(e.clientX-sr.left+8,8,sr.width-opm.offsetWidth-8)+'px';opm.style.top=clamp(e.clientY-sr.top+8,8,sr.height-opm.offsetHeight-8)+'px';});
  opIn.addEventListener('input',()=>{if(!opPart)return;const v=opIn.valueAsNumber/100;if(v>=1)delete st.op[opPart];else st.op[opPart]=v;opOut.textContent=opIn.value+'%';look();});
  opm.querySelectorAll('button[data-a]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.a;
    if(a==='hide'){if(opPart){st.hid.add(opPart);opPart=null;}}else if(a==='showall')st.hid.clear();else if(a==='all'){st.op={};st.hid.clear();}else if(opPart)delete st.op[opPart];
    look();opRender();}));
  cv.addEventListener('pointerdown',e=>{if(e.button!==2)closeOpm();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeOpm();
    /* space bar: stop and restart, unless typing or pressing a button */
    if(e.key===' '&&!/^(INPUT|BUTTON|SELECT|TEXTAREA|SUMMARY)$/.test(document.activeElement.tagName)&&!$('#about').open){e.preventDefault();setSpeed(st.speed?0:(lastSpeed||1));}});

  /* ---------- controls ---------- */
  /* speed: presets, or any value from 0.01x to 10000x on a log slider or typed in */
  const spdR=$('#spdR'),spdN=$('#spdN'),SMIN=0.01,SMAX=10000;let lastSpeed=1;
  const fmtSpd=v=>v===0?'stopped':(v<1?(1/v===Math.round(1/v)?'1/'+Math.round(1/v):String(+v.toPrecision(2))):v.toLocaleString('en',{maximumFractionDigits:v<10?2:0}))+'×';
  const setSpeed=(v,from)=>{v=v>0?clamp(v,SMIN,SMAX):0;st.speed=v;if(v)lastSpeed=v;
    document.querySelectorAll('#speeds button').forEach(x=>x.setAttribute('aria-pressed',Math.abs(parseFloat(x.dataset.v)-v)<1e-9?'true':'false'));
    if(from!=='r'&&v)spdR.value=Math.round((Math.log10(v)-Math.log10(SMIN))/(Math.log10(SMAX)-Math.log10(SMIN))*1000);
    if(from!=='n')spdN.value=v?+v.toPrecision(3):0;};
  spdR.addEventListener('input',()=>{const t=spdR.valueAsNumber/1000,v=Math.pow(10,Math.log10(SMIN)+t*(Math.log10(SMAX)-Math.log10(SMIN)));
    const snap=[0.05,0.1,0.5,1,2,5,10,60,100,600,1000,3600,10000].find(q=>Math.abs(Math.log10(q/v))<0.03);setSpeed(snap??+v.toPrecision(2),'r');});
  spdN.addEventListener('change',()=>{const v=spdN.valueAsNumber;if(Number.isFinite(v))setSpeed(v,'n');spdN.value=st.speed?+st.speed.toPrecision(3):0;});setSpeed(st.speed);
  document.querySelectorAll('#views button').forEach(b=>b.addEventListener('click',()=>{closeInfo();setView(b.dataset.v);}));
  document.querySelectorAll('#speeds button').forEach(b=>b.addEventListener('click',()=>setSpeed(parseFloat(b.dataset.v))));
  $('#driveOn').addEventListener('change',e=>{st.drive=e.target.checked;closeInfo();setView(st.drive?(st.view==='box'||st.view==='dial'?'movement':st.view):'dial');});
  /* about: sources and method in a dialog */
  const about=$('#about');$('#aboutBtn').addEventListener('click',()=>{if(about.showModal)about.showModal();else about.setAttribute('open','');});
  about.addEventListener('click',e=>{if(e.target===about)about.close();});
  $('#mwOn').addEventListener('change',e=>{st.mwOn=e.target.checked;look();});
  document.querySelectorAll('#bal button').forEach(b=>b.addEventListener('click',()=>{mv.userData.balance(b.dataset.v);document.querySelectorAll('#bal button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));}));
  $('#ghost').addEventListener('change',e=>{st.see=e.target.checked;look();});$('#colr').addEventListener('change',e=>{st.colr=e.target.checked;look();});
  document.querySelectorAll('#finish button').forEach(b=>b.addEventListener('click',()=>{M.setPlateFinish(b.dataset.v);document.querySelectorAll('#finish button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));}));
  $('#lbls').addEventListener('change',e=>st.labels=e.target.checked);$('#rock').addEventListener('change',e=>st.rock=e.target.checked);
  const hIn=$('#hrs'),hOut=hIn.parentElement.querySelector('output');
  const showH=()=>{hOut.textContent=hrs.toFixed(1)+' h';hIn.value=hrs.toFixed(1);};
  hIn.addEventListener('input',()=>{hrs=parseFloat(hIn.value);winding=false;showH();});showH();
  $('#wind').addEventListener('click',()=>{winding=true;});
  $('#reset').addEventListener('click',()=>{setView(st.view,true);});
  const fsb=$('#fs');if(!(document.fullscreenEnabled||document.webkitFullscreenEnabled))fsb.classList.add('hidden');
  fsb.addEventListener('click',()=>{const d=document;if(d.fullscreenElement||d.webkitFullscreenElement){(d.exitFullscreen||d.webkitExitFullscreen).call(d);}else{(stage.requestFullscreen||stage.webkitRequestFullscreen).call(stage);}});
  let ac=null;$('#snd').addEventListener('change',e=>{st.sound=e.target.checked;if(st.sound&&!ac){try{ac=new (window.AudioContext||window.webkitAudioContext)();}catch(_){}}if(ac&&ac.state==='suspended')ac.resume();});
  const tick=()=>{if(!ac)return;const n=ac.createBufferSource(),b=ac.createBuffer(1,ac.sampleRate*0.03,ac.sampleRate),d=b.getChannelData(0);
    for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/(ac.sampleRate*0.0018));n.buffer=b;const f=ac.createBiquadFilter();f.type='bandpass';f.frequency.value=3400;f.Q.value=2.2;const gn=ac.createGain();gn.gain.value=0.5;n.connect(f).connect(gn).connect(ac.destination);n.start();};

  /* ---------- labels ---------- */
  const labels=[];const lab=$('.labels');
  const addL=(t,sub,part,fn,grp)=>{const el=document.createElement('div');el.className='lbl';if(PCOL[part])el.style.setProperty('--pc',PCOL[part]);el.innerHTML='<span>'+t+(sub?'<i>'+sub+'</i>':'')+'</span>';lab.appendChild(el);labels.push({el,sp:el.firstChild,fn,grp,part,w:0,h:0,occ:false});};
  /* higher = placed first when labels compete for space */
  const PRI={bal:10,escW:9.5,det:9,fusee:8.5,barrel:8,chain:7.5,cw:7,fw:6.8,tw:6.5,gw:6.4,spr:6,cock:5,spawl:4.5,lowerBridge:3,trainBridge:2,barrelBridge:2,motion:5,hands:6,ring:5,bowl:5,key:4};
  const pw=(g,x,y,z)=>{const v=new THREE.Vector3(x,y,z);return()=>g.localToWorld(v.clone());};
  const ef=k=>P[k].userData.ef;
  addL('Balance','2 Hz, 1⅜–1½ turns motion','bal',pw(ef('bal'),0,-31.5,-(BAL_R+1.6)),'mv');addL('Hairspring','Elinvar, cylindrical','spr',pw(ef('spr'),5.5,-37.5,0),'mv');
  addL('Balance cock','','cock',pw(P.cock,(L.B[0]+COCK_FOOT[0])/2,-45,(L.B[1]+COCK_FOOT[1])/2),'mv');
  addL('Escape wheel','16 teeth, 1 turn / 8 s','escW',pw(ef('escW'),ESC.EX*ES,-25.1,-7),'mv');addL('Detent','','det',pw(ef('det'),ESC.D(1.1,-0.045).x*ES,-23.9,ESC.D(1.1,-0.045).y*ES),'mv');
  addL('Fusee','1 turn / 6.86 h','fusee',pw(P.fs,L.Fu[0]+7,-14,L.Fu[1]-3),'mv');addL('Mainspring barrel','','barrel',pw(P.fs,L.Ba[0]-9,-12,L.Ba[1]-6),'mv');addL('Fusee chain','','chain',pw(P.fs,(L.Fu[0]+L.Ba[0])/2-6,-13,(L.Fu[1]+L.Ba[1])/2-10),'mv');
  addL('Fusee wheel','96 teeth, 1 turn / 6.86 h','gw',pw(P.gw,L.Fu[0]+14,-6.5,L.Fu[1]-11),'mv');addL('Centre wheel','80 teeth, 1 turn / h','cw',pw(P.cw,-8,-21.4,-8),'mv');addL('Third wheel','75 teeth, 1 turn / 7½ min','tw',pw(P.tw,L.T[0]-9,-19.2,L.T[1]+5),'mv');
  addL('Fourth wheel','60 teeth, 1 turn / min','fw',pw(P.fw,L.F[0]-7,-16.6,L.F[1]+5),'mv');addL('Upper train bridge','','trainBridge',pw(P.trainBridge,-20,-29,24),'mv');addL('Barrel bridge','','barrelBridge',pw(P.barrelBridge,-16,-33,-18),'mv');
  addL('Sustaining pawl','','spawl',pw(R.spawl,-2.5,0,0),'mv');addL('Balance lower bridge','','lowerBridge',pw(P.lowerBridge,(L.B[0]+L.F[0])/2,-23,(L.B[1]+L.F[1])/2),'mv');
  addL('Up/down indicator','','hands',pw(P.hands,0,6,-36),'dial');addL('Seconds','','hands',pw(P.hands,-10,6,34),'dial');addL('Gimbal ring','','ring',pw(BX.ring,82,8,0),'box');
  addL('Bowl','','bowl',pw(BX.bowl,-48,-40,40),'box');addL('Winding key','','key',pw(BX.root,76,-5,-76),'box');addL('Gimbal latch','','latch',pw(BX.root,84,-2,71),'box');
  addL('Cannon pinion','12 leaves','motion',pw(P.motion,2,1.2,-3),'motion');addL('Minute wheel','36 / 10','motion',pw(P.motion,L.Mw[0]-6,1.2,L.Mw[1]+4),'motion');addL('Up/down wheel','98 teeth','motion',pw(P.motion,L.Ud[0]+11,1.5,L.Ud[1]),'motion');

  /* ---------- walkthrough ---------- */
  const inset=$('#tInset');let insetKind=null,insetCv=null,insetCtx=null,trace=[];
  function setInset(kind){insetKind=kind;inset.innerHTML='';insetCv=null;trace=[];
    if(kind==='fusee'||kind==='esc'||kind==='bal'){insetCv=document.createElement('canvas');inset.appendChild(insetCv);
      if(kind==='fusee')inset.insertAdjacentHTML('beforeend','<div class="note" style="display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:6px"><span><b style="color:#c0392b">―</b> spring pull</span><span><b style="color:#2e6bd8">―</b> chain radius on the fusee</span><span><b style="color:var(--brass)">―</b> torque = pull × radius</span></div>');
      const w=inset.clientWidth||300,h=kind==='esc'?Math.round(w*0.72):Math.round(w*0.5),d=Math.min(devicePixelRatio||1,2);insetCv.width=w*d;insetCv.height=h*d;insetCv.style.height=h+'px';insetCtx=insetCv.getContext('2d');insetCtx.setTransform(d,0,0,d,0,0);insetCv._w=w;insetCv._h=h;}
    else if(kind==='train'){inset.innerHTML='<table class="rt"><thead><tr><th>Arbor</th><th>Drives</th><th class="n">Ratio</th><th class="n">One turn</th><th class="n">Angle</th></tr></thead><tbody>'+
      [['Fusee wheel','96 → 14','×6.86','6.86 h','gw'],['Centre','80 → 10','×8','1 h','cw'],['Third','75 → 10','×7.5','7½ min','tw'],['Fourth','60 → 8','×7.5','1 min','fw'],['Escape','16 teeth','','8 s','ew']].map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td class="n">${r[2]}</td><td class="n">${r[3]}</td><td class="n" data-k="${r[4]}"></td></tr>`).join('')+'</tbody></table><p class="note" style="margin:8px 0 0">Overall ×3,086. Ideally the escape wheel receives 1/3,086 of the fusee’s torque, less friction at each stage. The 16-tooth escape wheel is Hamilton’s; the 96/14 first stage matches the manual’s seven half-turns of the key per 24 hours. Centre-to-fourth counts are chosen to give the ratios a half-second train needs.</p>';}
    else if(kind==='motion'){inset.innerHTML='<table class="rt"><thead><tr><th>Stage</th><th class="n">Teeth</th><th class="n">Ratio</th></tr></thead><tbody><tr><td>Cannon pinion → minute wheel</td><td class="n">12 → 36</td><td class="n">÷3</td></tr><tr><td>Minute pinion → hour wheel</td><td class="n">10 → 40</td><td class="n">÷4</td></tr><tr><td>Fusee pinion → wind indicator wheel</td><td class="n">8 → 98</td><td class="n">÷12.25</td></tr></tbody></table>';}
    else if(kind==='power'){inset.innerHTML='<div class="note" id="pw"></div>';}
    else if(kind==='wind'){inset.innerHTML='<button class="primary" id="tWind">Wind it now</button>';$('#tWind').addEventListener('click',()=>{if(hrs<2)hrs=30;winding=true;});}
  }
  const TOUR=[
    {t:'The box and gimbals',x:'<p>The mounting box is mahogany with two hinged covers: an upper lid, and a second cover with a glass top through which the dial is read.</p><p>The gimbal ring is pivoted to the box at two points 180° apart; the brass case pivots in the ring at two points 90° away. Tilt the box any way and the movement tends to stay level, so the balance swings in the plane it was adjusted in.</p>',
      drive:false,v:{lidM:1,lidT:1,lift:0,flip:0,explode:0,yaw:0.85,pitch:0.45,dist:600,target:fixed(0,-24,0)},rock:true,speed:1,focus:null},
    {t:'Stored energy: the mainspring',x:'<p>A long, powerful mainspring is coiled in the barrel. The barrel arbor never turns in use: the setup ratchet and pawl on the barrel bridge hold it. The spring’s outer end turns the barrel clockwise, and the barrel draws the chain off the fusee.</p><p>Wound, the coils hug the arbor; run down, they lie against the wall. At 3600× one hour passes each second.</p>',
      drive:true,v:{lift:1,flip:1,explode:0,yaw:-1.58,pitch:0.62,dist:140,target:mvL(-18.6,-13,0.2)},speed:3600,focus:['barrel','mainspring','chain','ratchet','fusee'],inset:'power'},
    {t:'Constant force: the fusee',x:'<p>A mainspring exerts more force fully wound than partly run down, so the fusee is shaped to keep the moment on the fusee wheel about the same throughout. The chain pulls on the small end while the spring is strongest and on the large end once it has weakened.</p><p>The balance’s arc, and so its rate, stays practically equal all the time. The profile here is illustrative: the radius grows from 6.5 to 14 mm over 8¾ turns.</p>',
      drive:true,v:{lift:1,flip:1,explode:0,yaw:-0.35,pitch:0.35,dist:150,target:mvL(-3.5,-14,-9.8)},speed:3600,focus:['fusee','chain','barrel','mainspring','gw'],inset:'fusee'},
    {t:'Winding without stopping',x:'<p>The key turns the fusee arbor counterclockwise. That would cut the power to the train, but the sustaining spring, pinned between the sustaining ratchet wheel and the fusee wheel and always under load, keeps driving the fusee wheel. The sustaining pawl stops the ratchet wheel from turning back, so the spring can only release forward. It will drive the chronometer for five to ten minutes.</p><p>At full wind the chain presses one end of the winding stop-bar in the fusee top; the other end moves out and catches the winding stop under the barrel bridge. Seven half turns restore a day’s running.</p>',
      drive:true,v:{lift:1,flip:1,explode:0,yaw:0.53,pitch:0.55,dist:125,target:mvL(11.6,-13,-19.8)},speed:60,focus:['gw','spawl','fusee','sq','chain','cw'],inset:'wind'},
    {t:'The going train',x:'<p>The fusee wheel drives the centre wheel pinion; the centre wheel drives the third wheel pinion; the third drives the fourth wheel pinion; the fourth meshes with the escape pinion. The centre wheel turns once an hour; the fourth once a minute, carrying the second hand.</p><p>Every mesh here is in phase: a tooth of each driver sits in a gap of the pinion it drives.</p>',
      drive:true,v:{lift:1,flip:1,explode:0,yaw:0.25,pitch:1.0,dist:200,target:mvL(0,-18,8)},speed:1,focus:['gw','cw','tw','fw','escW','fusee'],inset:'train'},
    {t:'The detent escapement',x:'<p>The escape wheel is held by the locking jewel on the detent. As the balance swings one way, the unlocking jewel meets the trip spring, which bends aside and lets it pass: nothing else moves. Swinging back, the unlocking jewel strikes the trip spring again; now the abutment arm holds it, so the trip spring and detent move aside together and release the wheel.</p><p>A tooth drops into the crescent of the impulse roller, catches up with the impulse jewel and drives the balance; the detent springs back in time to lock the next tooth. One impulse per oscillation, so the hands advance in half-second steps.</p>',
      drive:true,v:{lift:1,flip:1,explode:0,yaw:1.9,pitch:-0.75,dist:70,target:mvL(8.0,-25,12)},speed:0.05,focus:['escW','det','bal'],inset:'esc'},
    {t:'The balance and hairspring',x:'<p>The balance is a solid, uncut stainless-steel rim silver-soldered to an Invar arm. Invar barely expands, so the rim’s diameter at the arm ends stays fixed while the rest of the rim moves with temperature; screws placed nearer or farther from the arm set the compensation. Free of the centrifugal effects of a split rim, it can swing 1⅜ to 1½ turns.</p><p>The cylindrical hairspring is Hamilton Elinvar, with good thermo-elastic qualities and minimum isochronal error. There is no regulator: rate is set with balance screws, timing weights and vernier weights. The older split bimetallic balance is available under Balance.</p>',
      drive:true,v:{lift:1,flip:1,explode:0,yaw:2.27,pitch:0.35,dist:118,target:mvL(8.0,-34,6.8)},speed:0.05,focus:['bal','spr','cock'],inset:'bal'},
    {t:'Hands and the wind indicator',x:'<p>The centre wheel staff carries the minute hand and, through the motion work, the hour hand; the fourth wheel staff carries the second hand.</p><p>A pinion on the dial end of the fusee arbor drives the wind indicator wheel. Here an 8-leaf pinion and a 98-tooth wheel take the hand across the UP–DOWN scale as the fusee makes its 8.2 turns in 56 hours.</p>',
      drive:true,mw:true,v:{lift:1,flip:0,explode:0,yaw:0.2,pitch:1.05,dist:170,target:mvL(-3,3,-6)},speed:3600,focus:['motion','hands','cw','fusee','gw'],inset:'motion'}];
  const dots=$('#tDots');dots.innerHTML=TOUR.map(()=>'<i></i>').join('');
  function tourGo(i){st.tour=i;const s=TOUR[i];closeInfo();
    $('#tourIntro').classList.add('hidden');$('#tourBody').classList.remove('hidden');
    $('#tStep').textContent=(i+1)+' / '+TOUR.length;$('#tTitle').textContent=s.t;$('#tText').innerHTML=s.x;
    [...dots.children].forEach((d,k)=>d.classList.toggle('on',k<=i));$('#tPrev').disabled=i===0;$('#tNext').textContent=i===TOUR.length-1?'Finish':'Next';
    st.drive=s.drive;st.mwOn=!!s.mw;$('#mwOn').checked=st.mwOn;st.focus=s.focus?new Set(s.focus):null;st.see=false;
    st.rock=!!s.rock;$('#rock').checked=st.rock;setSpeed(s.speed);
    Object.assign(tgt,{lift:s.v.lift,flip:s.v.flip,explode:s.v.explode,lidM:s.v.lidM??1,lidT:s.v.lidT??1});goCam(s.v);look();
    document.querySelectorAll('#views button').forEach(b=>b.setAttribute('aria-pressed','false'));
    setInset(s.inset||null);
    if(innerWidth<960){const card=$('#tourCard'),y=card.getBoundingClientRect().top+scrollY-stage.offsetHeight-8;if(Math.abs(scrollY-y)>40)scrollTo({top:y,behavior:'smooth'});}}
  function tourEnd(){st.tour=-1;st.focus=null;st.drive=false;st.mwOn=false;st.rock=false;$('#rock').checked=false;setSpeed(1);setInset(null);
    $('#tourIntro').classList.remove('hidden');$('#tourBody').classList.add('hidden');setView('dial');}
  $('#tStart').addEventListener('click',()=>tourGo(0));$('#tPrev').addEventListener('click',()=>tourGo(Math.max(0,st.tour-1)));
  $('#tNext').addEventListener('click',()=>st.tour<TOUR.length-1?tourGo(st.tour+1):tourEnd());$('#tExit').addEventListener('click',tourEnd);

  function drawInset(E,s,n){
    if(!insetKind)return;const dk=dark();
    if(insetKind==='power'){const el=$('#pw');if(el){const I=R.fs.I(n),pull=1-(1-6.5/14)*n/FUSEE_TURNS;el.innerHTML=`Barrel has turned <b>${I.toFixed(2)}</b> of ${R.fs.IN.toFixed(2)} turns. Spring pull <b>${Math.round(pull*100)}%</b> of full. ${(56-hrs).toFixed(1)} h of running left.`;}}
    else if(insetKind==='train'){const P2=ESC.P,esc=E*P2,v={ew:esc/TAU,fw:esc/7.5/TAU,tw:esc/56.25/TAU,cw:esc/450/TAU,gw:esc/450/(96/14)/TAU};inset.querySelectorAll('td[data-k]').forEach(td=>td.textContent=(((v[td.dataset.k]%1)+1)%1*360).toFixed(td.dataset.k==='gw'?2:1)+'°');}
    else if(insetCv){const ctx=insetCtx,w=insetCv._w,h=insetCv._h;
      if(insetKind==='esc'){drawEsc2D(ctx,w,h,s.p??0,dk);}
      else if(insetKind==='fusee'){ctx.clearRect(0,0,w,h);const L0=34,R0=10,T0=12,B0=28,pw=w-L0-R0,ph=h-T0-B0,X=x=>L0+x/56*pw,Y=y=>T0+(1-y/1.1)*ph;
        ctx.font='11px "Instrument Sans",sans-serif';ctx.strokeStyle=dk?'#2a323a':'#dde1e4';ctx.fillStyle=dk?'#9aa4ad':'#5b656e';ctx.lineWidth=1;
        for(const x of[0,14,28,42,56]){ctx.beginPath();ctx.moveTo(X(x),T0);ctx.lineTo(X(x),T0+ph);ctx.stroke();ctx.textAlign='center';ctx.fillText(x+' h',X(x),h-12);}
        for(const y of[0,0.5,1]){ctx.beginPath();ctx.moveTo(L0,Y(y));ctx.lineTo(L0+pw,Y(y));ctx.stroke();ctx.textAlign='right';ctx.fillText(Math.round(y*100)+'%',L0-4,Y(y)+4);}
        const drop=1-6.5/14,nn=q=>q*FUSEE_PER_HOUR/FUSEE_TURNS,f=[[q=>1-drop*nn(q),'#c0392b','spring pull'],[q=>(6.5/14)/(1-drop*nn(q)),'#2e6bd8','radius on the fusee'],[q=>1,dk?'#e0b44f':'#8a5d10','torque (pull × radius)']];
        f.forEach(([fn,col,nm],k)=>{ctx.strokeStyle=col;ctx.lineWidth=2.2;ctx.beginPath();for(let i=0;i<=100;i++){const q=56*i/100,yy=k===2?1:fn(q);i?ctx.lineTo(X(q),Y(yy)):ctx.moveTo(X(q),Y(yy));}ctx.stroke();
          ctx.fillStyle=col;ctx.beginPath();ctx.arc(X(hrs),Y(k===2?1:fn(hrs)),4,0,TAU);ctx.fill();});
      }
      else if(insetKind==='bal'){const win=0.5*(st.speed<=0.05?1:2);ctx.clearRect(0,0,w,h);const X=t=>8+(1-(tSim-t)/win)*(w-16),Y=th=>h/2-th/(270*D2R)*(h/2-16);
        ctx.strokeStyle=dk?'#2a323a':'#dde1e4';ctx.beginPath();ctx.moveTo(8,h/2);ctx.lineTo(w-8,h/2);ctx.stroke();
        const N=240,pts=[];for(let i=0;i<=N;i++){const t=tSim-win+win*i/N,q=t/0.5-Math.floor(t/0.5),z=ESC.state(q);pts.push([t,z.th,z.prog>0&&z.prog<1]);}
        ctx.fillStyle=dk?'rgba(224,180,79,.35)':'rgba(184,134,11,.28)';for(const q of pts)if(q[2])ctx.fillRect(X(q[0])-1,10,2.5,h-26);
        ctx.strokeStyle=dk?'#91adf2':'#26479c';ctx.lineWidth=2;ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(X(q[0]),Y(q[1])):ctx.moveTo(X(q[0]),Y(q[1])));ctx.stroke();
        ctx.fillStyle=dk?'#e4e8eb':'#141a20';ctx.beginPath();ctx.arc(X(tSim),Y(s.th),4,0,TAU);ctx.fill();
        ctx.fillStyle=dk?'#9aa4ad':'#5b656e';ctx.font='11px "Instrument Sans",sans-serif';ctx.textAlign='left';ctx.fillText('balance angle over the last '+win+' s; shaded = impulse',8,h-6);
        ctx.textAlign='right';ctx.fillText('+255°',w-8,16);}
    }
  }

  /* ---------- label placement ---------- */
  const ray2=new THREE.Raycaster(),tmpV=new THREE.Vector3(),camP=new THREE.Vector3();let lastOcc=0;
  const lsorted=()=>labels.slice().sort((p,q)=>(PRI[q.part]||1)-(PRI[p.part]||1));let LS=null;
  function placeLabels(now){
    if(!LS)LS=lsorted();
    const foc=st.pick?new Set([st.pick]):st.focus,doOcc=now-lastOcc>200;if(doOcc)lastOcc=now;
    const placed=[],pad=3;
    for(const l of LS){
      let show=st.labels&&(l.grp==='mv'?(cur.lift>0.8||st.drive)&&cur.flip>0.8:l.grp==='motion'?st.drive&&st.mwOn&&cur.flip<0.3:l.grp==='dial'?cur.lift<0.1&&cur.lidM>0.9&&!st.drive:cur.lift<0.1&&cur.lidT>0.9&&!st.drive);
      if(show&&foc&&!foc.has(l.part))show=false;
      if(show&&st.drive&&DRIVE_HIDE.has(l.part))show=false;
      if(!show){l.el.style.opacity=0;continue;}
      const P0=l.fn();
      if(doOcc){camP.copy(cam.position);const d=P0.distanceTo(camP);ray2.set(camP,tmpV.copy(P0).sub(camP).normalize());ray2.far=d-0.8;
        const hits=ray2.intersectObject(BX.root,true);l.occ=hits.some(h=>h.object.visible&&h.object.userData.part!==l.part&&!(h.object.material.transparent&&h.object.material.opacity<0.5)&&!h.object.userData.decal);}
      if(l.occ){l.el.style.opacity=0;continue;}
      tmpV.copy(P0).project(cam);const px=(tmpV.x+1)/2*W,py=(1-tmpV.y)/2*Hh;
      if(tmpV.z>1||px<4||px>W-4||py<4||py>Hh-40){l.el.style.opacity=0;continue;}
      if(!l.w){l.w=l.sp.offsetWidth;l.h=l.sp.offsetHeight;}
      const w=l.w,h=l.h,C4=[[9,-h/2],[-9-w,-h/2],[-w/2,-h-9],[-w/2,9]];let ok=null;
      for(const[dx,dy]of C4){const r={x0:px+dx-pad,y0:py+dy-pad,x1:px+dx+w+pad,y1:py+dy+h+pad};
        if(r.x0<2||r.x1>W-2||r.y0<2||r.y1>Hh-38)continue;
        if(placed.some(q=>r.x0<q.x1&&q.x0<r.x1&&r.y0<q.y1&&q.y0<r.y1))continue;ok=[dx,dy,r];break;}
      if(!ok){l.el.style.opacity=0;continue;}
      placed.push(ok[2],{x0:px-4,y0:py-4,x1:px+4,y1:py+4});
      l.el.style.transform=`translate(${px.toFixed(1)}px,${py.toFixed(1)}px)`;l.sp.style.transform=`translate(${ok[0].toFixed(1)}px,${ok[1].toFixed(1)}px)`;l.el.style.opacity=1;
    }
  }
  new ResizeObserver(()=>{labels.forEach(l=>{l.w=0;});}).observe(stage);

  /* ---------- loop ---------- */
  const SNAP=/[?&]snap\b/.test(location.search);
  let last=performance.now(),loaded=false;
  function frame(now){
    const dt=Math.min(0.05,(now-last)/1000);last=now;const k=SNAP?1:1-Math.exp(-dt*3.0);
    for(const q of['lift','flip','explode','lidM','lidT'])cur[q]+=(tgt[q]-cur[q])*k;
    if(cur.lift>0.05){cur.lidM=Math.max(cur.lidM,0.97);cur.lidT=Math.max(cur.lidT,0.97);}
    const run=hrs<56;
    if(winding){hrs=Math.max(0,hrs-dt*14);if(hrs===0)winding=false;showH();}
    if(run){const dtS=dt*st.speed;tSim+=dtS;if(!winding){hrs=Math.min(56,hrs+dtS/3600);if(st.speed>1)showH();}}
    tVis+=dt;
    let E,s;
    if(!run||st.speed===0){const kk=Math.floor(tSim/0.5),p=tSim/0.5-kk;s=run?ESC.state(p):{th:0,lift:0,psDef:0,prog:0};s.p=p;E=lastE??(kk+s.prog);}
    else if(st.speed<=1){const kk=Math.floor(tSim/0.5),p=tSim/0.5-kk;s=ESC.state(p);s.p=p;E=kk+s.prog;}
    else{const p=(tVis*0.9)%1;s=ESC.state(p);s.p=p;s.lift=0;s.psDef=0;E=tSim*2;}
    if(st.sound&&st.speed<=1&&lastE!=null&&Math.floor(E-0.5)>Math.floor(lastE-0.5))tick();
    lastE=E;const n=hrs*FUSEE_PER_HOUR;
    mv.userData.update({E,th:s.th,lift:s.lift,psDef:s.psDef,n,winding,keyOn:winding&&(cur.lift>0.8||st.drive),springOn:cur.lift>0.3||st.drive,msOn:msShown()});
    BX.mid.rotation.x=-cur.lidM*1.6;BX.top.rotation.x=-Math.max(0,cur.lidT*1.92-cur.lidM*1.6);   /* outer lid angle is relative to the glass lid it is hinged to */
    mv.userData.explode(smooth(cur.explode));
    const L1=smooth(cur.lift/0.55),L2=smooth((cur.lift-0.35)/0.65);mv.position.y=L1*130+L2*95;mv.rotation.x=Math.min(smooth(cur.flip),L2)*Math.PI;
    if(st.rock)rockT+=dt;const a=st.rock?14*D2R:0;roll=lerp(roll,a*Math.sin(rockT*0.9),st.rock?1:k);pitch=lerp(pitch,a*0.55*Math.sin(rockT*0.63+1.1),st.rock?1:k);
    BX.root.rotation.set(pitch,0,roll,'ZYX');BX.ring.rotation.x=-pitch;BX.bowl.rotation.z=-roll;
    BX.root.updateMatrixWorld(true);if(secMode!=='off')secPlane.copy(secLocal).applyMatrix4(mv.matrixWorld);
    if(G.follow)G.target.copy(G.follow());
    C.target.lerp(G.target,Math.min(1,k*1.5));if(!camFree){C.yaw+=(G.yaw-C.yaw)*k;C.pitch+=(G.pitch-C.pitch)*k;}C.dist+=(G.dist-C.dist)*k;
    const cp=Math.cos(C.pitch);cam.position.set(C.target.x+C.dist*cp*Math.sin(C.yaw),C.target.y+C.dist*Math.sin(C.pitch),C.target.z+C.dist*cp*Math.cos(C.yaw));cam.lookAt(C.target);
    key.position.copy(C.target).add(new THREE.Vector3(160,420,240));key.target.position.copy(C.target);
    const sz=clamp(C.dist*0.45,60,260);if(scam.right!==sz){scam.left=-sz;scam.right=sz;scam.top=sz;scam.bottom=-sz;scam.updateProjectionMatrix();}
    r.render(scene,cam);
    /* labels: occlusion (5 Hz), then greedy placement by priority with four candidate sides */
    placeLabels(now);
    drawInset(E,s,n);
    const tod=((tSim%86400)+86400)%86400,hh=Math.floor(tod/3600),mm=Math.floor(tod%3600/60),ss=Math.floor(tod%60);
    $('#hud').innerHTML=`<b>${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}</b>&ensp;${run?`${(56-hrs).toFixed(1)} h of power left`:'Run down. Wind it to restart.'}${st.speed!==1?`&ensp;<b>${fmtSpd(st.speed)}</b>`:''}${winding?'&ensp;<b>Winding</b>, maintaining power driving the train':''}`;
    if(!loaded){loaded=true;$('#loading').style.opacity=0;setTimeout(()=>$('#loading').remove(),900);setTimeout(()=>{if(st.tour<0&&!camFree)setView('dial');},1100);setTimeout(()=>{$('#hint').style.opacity=0;},9000);}
    requestAnimationFrame(frame);
  }
  look();
  Object.assign(tgt,{lidM:0,lidT:0});st.view='dial';
  document.querySelectorAll('#views button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v==='dial'?'true':'false'));
  requestAnimationFrame(frame);
})();
