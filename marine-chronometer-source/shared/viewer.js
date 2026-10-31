/* viewer.js: the page round a 3D model of a movement, for any of the models: renderer, lights and environment, the parts registry and part cards, colour, fade, ghost and
   isolate, cross-sections, the camera and its views, history and zoom to a part, orbit, pinch and wheel, the opacity menu, help and keys, speed, the panel, labels, the
   state in the URL hash, the loop (camera, explode, frames skipped while nothing changes, paint) and the ?qa hooks the tools read. Lifted from the Hamilton's app.js
   (chronometer-working-model/js/app.js, 14 October 2026), which keeps its own copy: its behaviour, the DOM ids and the hooks are the same. Declares only VIEWER.
   VIEWER.start(cfg), the model's page (js/app.js) giving:
     build: M => ({root, mv}): the scene's group and the movement in it (mv's frame: mm, dial side +y, 12 o'clock -z, 3 o'clock +x; mv.userData.explode(e), and
     mv.userData.develop(e) if the model has a Laid out view)
     PARTS {key: {t name, d what it does, sp sizes and numbers, g group (PG), c colour, pri label priority, plate (see-through with See-through), src (SRC), sn, figs}}, PG the groups,
     PIECES {part: [{k, t, h lines (userData.hn), d, sp, src, sn, figs}]}, SRC {key: [name, colour, what]}, figLabel ('Figs.'),
     VIEWS {key: {yaw, pitch, dist, target: [x, y, z] in mv's frame, explode, dev (the train laid out: develop, the Spread slider its share; the parts cfg.drive.hide
     hidden meanwhile and the meshes flagged userData.devPlate shown see-through in their place, as the Hamilton's app.js; a devPlate under a group with userData.devOf
     opens that part's card, and a mesh flagged devKeep stays shown laid out), see, fov}}, VIEW_DESC, startView, SECDEF {x|y|z: {n, min, max, def}},
     openCam {yaw, pitch, dist, target [x, y, z] in mv's frame as built}: where the camera stands as the page opens, before it eases to the start view (the Hamilton's: its box
     shut, from the front right); without it, turned from the start view and farther out. st.opening is true until then (a model can hold its case shut meanwhile),
     labels: (add, pw) => ...: add(text, sub, part, fn) a label at fn() (world), pw(group, x, y, z) a point in a group,
     qaTarget [x, y, z] (mv's frame: what __proj, __unproj and __cam aim at), tick: (dt, now, st) => [values]: the model's own motion each frame, the values it shows (a change draws a frame),
     hud: st => html, hash: {write(h), read(get, first)}, store: the prefix of what Remember settings keeps, name (the canvas's label), shot (the PNG's name).
     drive: Moving parts only (#driveOn, its #mwOn and #mwWrap; the Hamilton's st.drive), if the page has it: {hide: the parts it hides, ghost: those it draws see-through, mw: the motion
     work and hands, hidden unless #mwOn is ticked, off: the views it can't show, to: the view it shows instead}; the hash keeps drive=1.
     TOUR [{t title, x its text (html), view the view it stands in (its case, explode, see), v a camera of its own ({yaw, pitch, dist, target}), drive, mw, see, focus [parts], speed,
     inset}], tourInset(kind, el) (a step's inset: the page fills el; null when the walkthrough ends), tourStep(step or null): the walkthrough (#tourCard, the Hamilton's How it
     works; tour=N in the link), if the page has one.
     essay: the page's essay tab (ESSAY, from ../shared/essaykit.js: show, on, section), if it has one: while it shows the stage isn't drawn (cfg.tick still keeps the model's
     time), the keys are left to it, the hash is #essay[=section] and Remember settings doesn't note it; a hash with essay in it shows it, any other hides it (as the Hamilton's app.js).
     contacts: the Contacts debug view (../shared/contacts.js, loaded before the page's app.js), if the page has it: {expected {'part:Type|part:Type': why} (its fine.py's EXPECTED),
     states (its fine.py's), pose(state, update): the model posed in a state through its own update, label(state, i)}; while it shows, every part is a ghost, drawn plainly
     (no merged copies, Edges or ink), and the hash keeps contacts=1|sweep, ctin=1, ceps.
     pick(hit): a click on the model offered first to the page (the maker's Measure); true if it took it. card(p): each part card as it opens (the maker's sheet, js/maker.js).
    tint(m): a colour ('#rrggbb') a movement mesh is drawn toward, or null (the Hamilton's load path: lpCol and tintOf in its app.js), applied by look(); overlay(): drawn
    after each frame the stage is drawn, on its canvas (a close-up's own camera: the page's scissored viewport, as the Hamilton's cuDraw).
   Returns {st, look, wake, setView, goCam, base, tintOf, size, cam, scene, r, mv, M, INFO, PCE, PARTS, SRC, units, tourEnd, focusOn, unfocus, focused}. */
const VIEWER={start(cfg){
  const stage=$('#stage'),cv=stage.querySelector('canvas'),QA=/[?&]qa\b/.test(location.search),SNAP=/[?&]snap\b/.test(location.search);
  if(typeof THREE==='undefined'){$('#loading').textContent='The 3D library didn’t load. Reload the page to try again.';return null;}
  const PHONE=matchMedia('(pointer:coarse)').matches&&Math.min(screen.width,screen.height)<600,RM=matchMedia('(prefers-reduced-motion: reduce)');   /* phones: a lower pixel ratio and shadow map; reduced motion: moves are instant, as with ?snap */
  let r;try{r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});}catch(_){$('#loading').textContent='This browser couldn’t start 3D graphics (WebGL). Try another browser, or turn on hardware acceleration.';return null;}r.setPixelRatio(Math.min(window.devicePixelRatio||1,PHONE?1.5:2));
  r.outputEncoding=THREE.sRGBEncoding;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.08;r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();scene.environment=envTex(r);
  cv.addEventListener('webglcontextrestored',()=>{scene.environment=envTex(r);});   /* a restored context comes back without the environment map that lights the metals: rebuild it */
  scene.add(new THREE.HemisphereLight(0xffffff,0x333333,0.28));
  const key=new THREE.DirectionalLight(0xfff4e6,1.0);key.castShadow=false;key.shadow.mapSize.set(PHONE?1024:2048,PHONE?1024:2048);key.shadow.bias=-0.0004;key.shadow.normalBias=0.6;   /* casts only with Shadows on: look() */
  const scam=key.shadow.camera;scam.left=-170;scam.right=170;scam.top=170;scam.bottom=-170;scam.near=1;scam.far=1200;scene.add(key,key.target);
  const cam=new THREE.PerspectiveCamera(32,1,1,6000);
  const M=mats(),{root,mv}=cfg.build(M);scene.add(root);
  /* ---------- the parts registry: a part's card, colour, label priority and group; its pieces' (part.k), their colours a shade of their part's ---------- */
  const PARTS=cfg.PARTS,PIECES=cfg.PIECES||{},SRC=cfg.SRC,PG=cfg.PG||['Parts'],FL=cfg.figLabel||'Figs.';
  const INFO={},PCOL={},PRI={},PCE={},PHN={},PGRP=PG.map(g=>[g,[]]),kp=k=>k.split('.')[0];
  for(const[k,p]of Object.entries(PARTS)){INFO[k]=[p.t,p.d,p.sp];if(p.c)PCOL[k]=p.c;if(p.pri)PRI[k]=p.pri;PGRP[p.g||0][1].push(k);}
  const shade=(c,i)=>{if(!i)return c;const o=new THREE.Color(c),h={};o.getHSL(h);o.setHSL((h.h+(i%2?1:-1)*0.035*Math.ceil(i/2)+1)%1,h.s,clamp(h.l+[0.17,-0.17,0.3,-0.3,0.09,-0.09,0.24,-0.24,0.37,-0.37][(i-1)%10],0.14,0.88));return '#'+o.getHexString();};
  for(const[p,ps]of Object.entries(PIECES)){const q=PARTS[p];q.pcs=ps;PHN[p]={};ps.forEach((c,i)=>{const k=p+'.'+c.k;INFO[k]=[c.t,c.d,c.sp];PCE[k]=c;if(q.c)PCOL[k]=shade(q.c,i);for(const h of c.h.split(' '))PHN[p][h]=PHN[p][h]||c.k;});}
  const PLATES=new Set(Object.keys(PARTS).filter(k=>PARTS[k].plate));
  const TOUR=cfg.TOUR&&cfg.TOUR.length?cfg.TOUR:null;   /* the walkthrough (cfg.TOUR) */
  const DV=cfg.drive?{hide:new Set(cfg.drive.hide),ghost:new Set(cfg.drive.ghost||[]),mw:new Set(cfg.drive.mw||[]),off:new Set(cfg.drive.off||[]),to:cfg.drive.to||cfg.startView}:null;   /* Moving parts only (cfg.drive) */
  const QT=cfg.qaTarget||[0,0,0];let renders=0;
  if(QA){window.__mv=mv;window.__M=M;window.__parts=PARTS;window.__r=r;window.__renders=()=>renders;
    const cam2=(yaw,pitch,dist,fov)=>{const c2=new THREE.PerspectiveCamera(fov,W/Hh,1,6000),t=new THREE.Vector3(...QT);mv.localToWorld(t);const cp=Math.cos(pitch);c2.position.set(t.x+dist*cp*Math.sin(yaw),t.y+dist*Math.sin(pitch),t.z+dist*cp*Math.cos(yaw));c2.lookAt(t);c2.updateMatrixWorld();c2.updateProjectionMatrix();return c2;};
    window.__proj=(pts,yaw,pitch,dist,fov)=>{const c2=cam2(yaw,pitch,dist,fov);return pts.map(p=>{const v=new THREE.Vector3(...p);mv.localToWorld(v);v.project(c2);return[(v.x+1)/2*W,(1-v.y)/2*Hh];});};
    window.__unproj=(pts,yaw,pitch,dist,fov)=>{const c2=cam2(yaw,pitch,dist,fov),inv=new THREE.Matrix4().copy(mv.matrixWorld).invert();return pts.map(([sx,sy,h])=>{const ndc=new THREE.Vector2(sx/W*2-1,-(sy/Hh*2-1)),rc=new THREE.Raycaster();rc.setFromCamera(ndc,c2);
      const o=rc.ray.origin.clone().applyMatrix4(inv),dd=rc.ray.direction.clone().transformDirection(inv),tt=(h-o.y)/dd.y;return[o.x+dd.x*tt,o.z+dd.z*tt];});};
    window.__camInfo=()=>JSON.stringify({fov:cam.fov,aspect:cam.aspect,pos:cam.position.toArray().map(v=>+v.toFixed(2)),tgt:C.target.toArray().map(v=>+v.toFixed(2)),C:{yaw:C.yaw,pitch:C.pitch,dist:C.dist},W,Hh});
    window.__cam=(yaw,pitch,dist,fov)=>{cam.fov=cur.fov=tgt.fov=fov;cam.updateProjectionMatrix();goCam({yaw,pitch,dist,target:QT});G.dist=dist;C.dist=dist;C.yaw=G.yaw;C.pitch=pitch;camFree=false;};
    window.__look=(yaw,pitch,dist,x,y,z)=>{goCam({yaw,pitch,dist,target:[x,y,z]});};}
  const sk=$('#srcKey');if(sk)sk.innerHTML=Object.values(SRC).map(([t,c,d])=>`<span title="${t}: ${d}"><i style="--ps:${c}"></i>${t}</span>`).join('');
  const partOf=o=>{while(o){if(o.userData&&(o.userData.partName||o.userData.devOf))return o.userData.partName||o.userData.devOf;o=o.parent;}return null;};   /* devOf: a laid-out view's schematic plate (devPlate), standing in for its part */
  /* a mesh's key: its piece (part.k) where its part has pieces: the nearest pc tag up to the part, else the piece listing the nearest parts-list line; its part's otherwise */
  const pkOf=o=>{const p=o.userData.part;if(!PHN[p])return p;let h=null;for(let q=o;q;q=q.parent){const u=q.userData;if(u.pc)return p+'.'+u.pc;if(h==null&&u.hn)h=u.hn;if(u.partName)break;}return PHN[p][h]?p+'.'+PHN[p][h]:p;};
  const shown=o=>{for(;o;o=o.parent)if(!o.visible)return false;return true;};   /* r128's raycaster ignores visibility */
  /* a mesh casts a shadow only when its radius spans SHK texels of the shadow map (shThr, set as the shadow camera follows the view) */
  root.updateMatrixWorld(true);const wsc=new THREE.Vector3(),rad=o=>{if(o.isInstancedMesh)return 1e9;const g=o.geometry,b0=g.boundingSphere;g.computeBoundingSphere();const rr=g.boundingSphere.radius;g.boundingSphere=b0;if(!(rr>0))return 1e9;o.getWorldScale(wsc);return rr*Math.max(wsc.x,wsc.y,wsc.z);};
  const SHK=6;let shThr=SHK*2*scam.right/key.shadow.mapSize.x;const castOn=m=>{m.castShadow=!!m.userData.cs&&m.userData.rad>=shThr;};
  const MVM=[];root.traverse(o=>{if(o.isMesh){o.userData.part=partOf(o);o.userData.pk=pkOf(o);o.userData.mat0=o.material;o.receiveShadow=true;o.userData.rad=rad(o);MVM.push(o);}});
  /* a frame: rendered, drawn (tinted or in ink), or rendered with Edges (makeInk in core.js); the static pieces drawn merged while Performance mode is on (drawMerge, core.js: layer 2) */
  let ink=null,CT=null;MVM.forEach(inkTag);   /* CT: the Contacts view (cfg.contacts), bound below */
 const INKH=MVM.filter(o=>o.userData.decal);
  const DM=drawMerge(scene,MVM);if(QA)window.__dm=DM;
  const paint=()=>{const ct=!!CT&&CT.on();scene.updateMatrixWorld();DM.sync(st.merge&&!ct);const au=scene.autoUpdate;scene.autoUpdate=false;
    if(ct)r.render(scene,cam);else if(st.draw)(ink||(ink=makeInk(r))).render(scene,cam,DM.all);else if(st.edges)(ink||(ink=makeInk(r))).lines(scene,cam,DM.all,INKH);else r.render(scene,cam);scene.autoUpdate=au;};
  /* ---------- cross-sections: the plane in the movement's frame, so it works in every view ---------- */
  r.localClippingEnabled=true;
  for(const o of MVM){const m=o.userData.mat0;if(m&&m.isMeshStandardMaterial)patchSection(m,m.side!==THREE.DoubleSide&&!m.transparent&&!o.userData.noCap);}
  const secLocal=new THREE.Plane(),secPlane=new THREE.Plane(),SECDEF=cfg.SECDEF;let secMode='off',secOff=0,secFlip=false;
  const secIn=$('#secOff'),secOut=secIn.parentElement.querySelector('output');
  function applySec(){$('#secOpts').classList.toggle('hidden',secMode==='off');if(secMode==='off'){setSection(false,secPlane);return;}const d=SECDEF[secMode],k=secFlip?-1:1;
    secLocal.set(new THREE.Vector3(...d.n).multiplyScalar(k),-secOff*k);setSection(true,secPlane);secOut.textContent=secOff.toFixed(1)+' mm';}
  document.querySelectorAll('#secs button').forEach(b=>b.addEventListener('click',()=>{secMode=b.dataset.v;document.querySelectorAll('#secs button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));
    if(secMode!=='off'){const d=SECDEF[secMode];secIn.min=d.min;secIn.max=d.max;secOff=d.def;secIn.value=d.def;}applySec();look();}));
  secIn.addEventListener('input',()=>{secOff=parseFloat(secIn.value);applySec();});$('#secFlip').addEventListener('change',e=>{secFlip=e.target.checked;applySec();});
  $('#secLines').addEventListener('change',e=>{SEC.flat.value=e.target.checked?0:1;});   /* off: Edges draw a cut face flat (core.js, makeInk) */
  /* ---------- state ---------- */
  const st={opening:true,tour:-1,drive:false,mwOn:false,see:false,colr:false,csrc:false,draw:false,edges:true,shadows:false,merge:true,op:{},hid:new Set(),iso:null,focus:null,pick:null,labels:false,spin:false,speed:1,view:cfg.startView,all:false,allK:0,asm:false};   /* all: the Exploded view's All (the case and box taken apart too, not the movement alone); allK its eased share, for cfg.tick; asm: its Subassemblies apart (mv.userData.asmx) */
  const FOV0=cam.fov,cur={explode:0,dev:0,all:0,sub:0,fov:FOV0},tgt={...cur};let devShown=false;   /* devShown: the train still out of place (laid out, or on its way back), so the frame stays hidden */
  let wakeT=0,hashReady=false,hashT=0,hashSeen='';const wake=()=>{wakeT=performance.now()+600;writeHash();};   /* any input keeps the stage drawing for 0.6 s; any change is written to the URL */
  /* colour by part (or by source, SRC); per-part opacity from the right-click menu; see-through (ghost) */
  const COLM=new Map(),FADE=new Map();let SEL=null;   /* SEL: the selection (../shared/select.js), bound below; its parts tinted PSEL.COL */
  const colOf=(p,k)=>{if(st.csrc){const s=PCE[k]&&PCE[k].src||PARTS[p]&&PARTS[p].src;return s&&SRC[s][1];}return PCOL[k]||PCOL[p];};
  function colourOf(m0,p,pk){const col=p&&colOf(p,pk);if(!col||m0.transparent||!m0.color)return m0;const k=m0.uuid+pk+(st.csrc?':s':'');let c=COLM.get(k);
    if(!c){c=m0.clone();c.userData={};c.map=null;c.normalMap=null;c.color=sc(col);if('metalness'in c){c.metalness=0.1;c.roughness=0.55;}if(c.emissive)c.emissive.setRGB(0,0,0);
      patchSection(c,!!m0.userData.secCap);c.userData.side0=m0.userData.side0??m0.side;c.side=m0.side;c.clippingPlanes=[...(m0.clippingPlanes||[])];COLM.set(k,c);}return c;}
  function fadeOf(m0,p,op){const k=m0.uuid+p;let f=FADE.get(k);
    if(!f){f=m0.clone();f.userData={inkDecal:m0.userData.inkDecal};f.transparent=true;f.depthWrite=false;patchSection(f,false);f.userData.side0=m0.userData.side0??m0.side;f.side=m0.side;f.clippingPlanes=[...(m0.clippingPlanes||[])];FADE.set(k,f);}
    f.opacity=(m0.opacity??1)*op;return syncMat(f,m0);}
  const opOf=m=>st.op[m.userData.pk]??st.op[m.userData.part];   /* a piece's own opacity, else its part's */
  const base=m=>{const p=m.userData.part,k=m.userData.pk,m0=st.colr||st.csrc?colourOf(m.userData.mat0,p,k):m.userData.mat0,op=opOf(m);return op!=null&&op<1?fadeOf(m0,k,op):m0;};
  const fin=m=>st.draw?drawOf(base(m)):base(m);
  /* cfg.tint: a copy of what the part shows, its colour drawn toward the tint and a little of it lit, less metal, so the colour shows rather than the room it reflects (the Hamilton's tintOf) */
  const TINT=new Map();function tintOf(m0,col){if(!m0.color)return m0;const k=m0.uuid+col;let t=TINT.get(k);
    if(!t){t=m0.clone();t.userData={inkDecal:m0.userData.inkDecal};patchSection(t,!!m0.userData.secCap);t.userData.side0=m0.userData.side0??m0.side;t.side=m0.side;t.clippingPlanes=[...(m0.clippingPlanes||[])];TINT.set(k,t);}
    if(t.map!==m0.map){t.map=m0.map;t.needsUpdate=true;}const c=sc(col);t.color.copy(m0.color).lerp(c,0.8);if(t.emissive){t.emissive.copy(c);t.emissiveIntensity=0.25;}if('metalness'in t){t.metalness=Math.min(m0.metalness,0.2);t.roughness=Math.max(m0.roughness,0.5);}t.opacity=m0.opacity??1;return t;}
  /* the keys in st.pick, st.focus, st.hid, st.iso and st.op are parts or pieces (part.k), a part's covering its pieces */
  const anyOf=(s,p)=>!!s&&[...s].some(k=>kp(k)===p),inK=(s,m)=>s.has(m.userData.part)||s.has(m.userData.pk);
  const isoOut=(p,k)=>!!st.iso&&!st.iso.has(p)&&!(k?st.iso.has(k):anyOf(st.iso,p));
  const isoDrop=p=>{if(st.iso){st.iso.delete(p);if(!st.iso.size)st.iso=null;}};
  /* the model's subassemblies (mv.userData.asm: k, t its name, parts): asmOf(k) the one a part or piece is in, asmIs(S) the one S (st.iso) is exactly */
  const ASM=mv.userData.asm||[],asmOf=k=>k?ASM.find(a=>a.parts.includes(kp(k))):null,asmIs=S=>!!S&&ASM.find(a=>a.parts.length===S.size&&a.parts.every(k=>S.has(k)));
  const opHide=m=>{const u=m.userData;return st.hid.has(u.part)||st.hid.has(u.pk)||opOf(m)===0||isoOut(u.part,u.pk);};
  const dvOn=()=>(st.tour<0&&!!VIEWS[st.view].dev)||devShown;   /* laid out: the frame's holes no longer meet the arbors; the model's schematic plates (devPlate) stand in */
  const dvOut=p=>!!DV&&((st.drive||dvOn())&&DV.hide.has(p)||st.drive&&!st.mwOn&&DV.mw.has(p));   /* hidden by Moving parts only (the frame, dial and case, and the motion work unless it is included) and laid out (the frame, dial and case) */
  /* a mesh hidden by Moving parts only or laid out: the schematic plates shown only laid out (not with Moving parts only), the frame's pieces flagged devKeep (the set-up click
     and its screw, the stop pin) kept shown laid out where the parts they work with stay */
  const mOut=m=>{const u=m.userData;return u.devPlate?!dvOn()||st.drive:dvOut(u.part)&&!(u.devKeep&&dvOn()&&!st.drive);};
  const DVS=new Set(MVM.filter(m=>m.userData.devPlate||m.userData.devKeep).map(m=>m.userData.part).filter(Boolean));   /* the parts shown laid out by a stand-in or a piece kept */
  const ghOf=(m,foc)=>{const p=m.userData.part;return (!!m.userData.devPlate&&dvOn()&&!(foc&&inK(foc,m)))||(st.see&&PLATES.has(p))||(st.drive&&!!DV&&DV.ghost.has(p))||(!!foc&&!inK(foc,m));};
  const ck=(id,v,dis)=>{const e=$('#'+id);if(e){e.checked=v;if(dis!=null)e.disabled=dis;}};
  function look(){wake();if(SEL)SEL.sync();asmPress();INK.ink.value=st.draw==='ink'?1:0;const foc=st.pick?new Set([st.pick]):st.focus;
    const ct=!!CT&&CT.on();for(const m of MVM){const gh=ghOf(m,foc);m.visible=!(m.userData.noShadow&&gh)&&!opHide(m)&&!mOut(m);const lc=ct||gh?null:SEL&&SEL.has(m)?PSEL.COL:cfg.tint?cfg.tint(m):null;m.material=ct?CT.mat(m):gh?ghostOf(base(m)):lc?(st.draw?drawOf(tintOf(base(m),lc)):tintOf(base(m),lc)):fin(m);m.userData.cs=!ct&&!gh&&!m.userData.noShadow;castOn(m);}
    if(key.castShadow!==st.shadows){key.castShadow=st.shadows;if(!st.shadows&&key.shadow.map){key.shadow.map.dispose();key.shadow.map=null;}}   /* Shadows off: the map is freed */
    if(DV){document.querySelectorAll('#views button').forEach(b=>{b.disabled=st.drive&&DV.off.has(b.dataset.v);});ck('driveOn',st.drive);ck('mwOn',st.mwOn);const mw=$('#mwWrap');if(mw)mw.classList.toggle('hidden',!st.drive);}
    cv.setAttribute('aria-label',`3D model of ${cfg.name||'the movement'}. ${st.tour>=0&&TOUR?`Walkthrough step ${st.tour+1} of ${TOUR.length}: ${TOUR[st.tour].t}.`:(cfg.VIEW_DESC||{})[st.view]||''}${st.drive?' Moving parts only.':''} Arrow keys turn it, plus and minus zoom, 0 resets the view.`);
    ck('ghost',st.see);ck('draw',st.draw==='tint');ck('drawInk',st.draw==='ink');ck('edges',st.edges,!!st.draw);ck('shadows',st.shadows);ck('merge',st.merge);ck('colr',st.colr);ck('colrSrc',st.csrc);ck('lbls',st.labels);ck('spin',st.spin);
    stage.classList.toggle('colr',st.colr);stage.classList.toggle('csrc',st.csrc);if(sk)sk.classList.toggle('hidden',!st.csrc);stage.classList.toggle('draw',!!st.draw);partsSync();if(CT)CT.look();}
  /* ---------- camera ---------- */
  const VIEWS=cfg.VIEWS,v0=VIEWS[cfg.startView],oc=cfg.openCam,C=oc?{yaw:oc.yaw,pitch:oc.pitch,dist:oc.dist,target:(root.updateMatrixWorld(true),mv.localToWorld(new THREE.Vector3(...oc.target)))}:{yaw:v0.yaw+0.6,pitch:v0.pitch*0.6,dist:v0.dist*1.8,target:new THREE.Vector3()},G={yaw:C.yaw,pitch:C.pitch,dist:C.dist,target:C.target.clone(),follow:null};
  let W=1,Hh=1;const resize=()=>{W=stage.clientWidth;Hh=stage.clientHeight;r.setSize(W,Hh,false);cam.aspect=W/Hh;cam.updateProjectionMatrix();};new ResizeObserver(resize).observe(stage);resize();
  const mvL=(x,y,z)=>{const v=new THREE.Vector3(x,y,z);return()=>mv.localToWorld(v.clone());};
  const aspectK=()=>clamp(1.25/(W/Hh),1,2.2);   /* the same horizontal coverage on narrow screens */
  function goCam(v){G.yaw=C.yaw+((((v.yaw-C.yaw+Math.PI)%TAU)+TAU)%TAU-Math.PI);G.pitch=v.pitch;G.dist=v.dist*aspectK();G.follow=mvL(...v.target);panO.set(0,0,0);camFree=false;}
  let camFree=false,zf=false;const panO=new THREE.Vector3(),pv=new THREE.Vector3();
  function panBy(dx,dy){const k=2*C.dist*Math.tan(cam.fov*Math.PI/360)/cv.clientHeight;pv.setFromMatrixColumn(cam.matrixWorld,0).multiplyScalar(-dx*k);const u=new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld,1).multiplyScalar(dy*k);pv.add(u);panO.add(pv);if(!G.follow)G.target.add(pv);}
  const expR=$('#expR'),expO=$('#expWrap output'),expV=()=>expR.valueAsNumber/100;
  /* the Exploded view's Movement or All: All spreads the case's parts too (cfg.tick takes st.allK) and stands the camera back to the view's own all ({yaw, pitch, dist, target}) */
  const allT=vv=>vv.explode&&st.all&&st.tour<0?expV():0,camOf=vv=>vv.all&&st.all&&st.tour<0?{...vv,...vv.all}:vv.sub&&st.asm&&st.tour<0?{...vv,...vv.sub}:vv,allW=$('#expAllWrap');
  const allSync=()=>document.querySelectorAll('#expAll button').forEach(b=>b.setAttribute('aria-pressed',(b.dataset.v==='all')===st.all?'true':'false'));
  /* the Exploded view's Subassemblies, Together or Apart (mv.userData.asm and asmx, the model's): apart, each subassembly with a place is taken apart beside the movement
     (tgt.sub its share) and the camera stands back to the view's own sub; Isolate subassembly (the menu and the Parts list) shows one alone, the camera fitted to it */
  const subT=vv=>vv.explode&&st.asm&&st.tour<0&&mv.userData.asmx?expV():0,subW=$('#expSubWrap');
  const subSync=()=>document.querySelectorAll('#expSub button').forEach(b=>b.setAttribute('aria-pressed',(b.dataset.v==='apart')===st.asm?'true':'false'));
  function setView(k,keepSee){if(zf){zf=false;st.focus=null;}if(st.drive&&DV&&DV.off.has(k))k=DV.to;const vv=VIEWS[k];Object.assign(tgt,{explode:(vv.explode||0)*expV(),dev:(vv.dev||0)*expV(),all:allT(vv),sub:subT(vv),fov:vv.fov||FOV0});goCam(camOf(vv));st.view=k;$('#expWrap').classList.toggle('hidden',!vv.explode&&!vv.dev);if(allW)allW.classList.toggle('hidden',!vv.explode);if(subW)subW.classList.toggle('hidden',!vv.explode||!mv.userData.asmx);
    expR.setAttribute('aria-label',vv.dev?'How far the train is laid out in a line':'How far apart the exploded parts are');
    if(!keepSee)st.see=!!vv.see;look();if(hashReady)keep('view',k);document.querySelectorAll('#views button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===k?'true':'false'));}
  /* where the view has been: ↶ (Backspace) and ↷ (Shift-Backspace) step back and forward; jump(f) moves the camera with f and keeps the place it left, unless f didn't move it */
  const HB=[],HF=[],histEl=$('#hist'),hB=$('#hBack'),hF=$('#hFwd');
  const pose=g=>({view:st.view,all:st.all,asm:st.asm,see:st.see,foc:zf?st.focus:null,yaw:g?G.yaw:C.yaw,pitch:g?G.pitch:C.pitch,dist:g?G.dist:C.dist,follow:G.follow,tgt:G.target.clone(),pan:panO.clone()});
  const same=(a,b)=>!!a&&!!b&&a.view===b.view&&a.all===b.all&&a.asm===b.asm&&a.follow===b.follow&&Math.abs(a.yaw-b.yaw)<0.02&&Math.abs(a.pitch-b.pitch)<0.02&&Math.abs(a.dist/b.dist-1)<0.02&&a.pan.distanceTo(b.pan)<0.5&&(!!a.follow||a.tgt.distanceTo(b.tgt)<0.5);
  function histSync(){hB.disabled=!HB.length;hF.disabled=!HF.length;const on=HB.length||HF.length;if(on&&histEl.classList.contains('hidden'))hintOff();histEl.classList.toggle('hidden',!on);}
  function jump(f){const p=pose();f();if(st.tour>=0||!hashReady||same(p,pose(true)))return;if(!same(p,HB[HB.length-1])){HB.push(p);if(HB.length>30)HB.shift();}HF.length=0;histSync();}
  function histGo(from,to){if(!from.length)return;to.push(pose());const p=from.pop();st.see=p.see;if(p.all!==st.all){st.all=p.all;allSync();tgt.all=allT(VIEWS[p.view]);}if(p.asm!==st.asm){st.asm=p.asm;subSync();tgt.sub=subT(VIEWS[p.view]);}if(p.view!==st.view)setView(p.view,true);if(st.tour<0){zf=!!p.foc;st.focus=p.foc;}look();
    G.yaw=C.yaw+((((p.yaw-C.yaw+Math.PI)%TAU)+TAU)%TAU-Math.PI);G.pitch=p.pitch;G.dist=p.dist;G.follow=p.follow;if(!p.follow)G.target.copy(p.tgt);panO.copy(p.pan);camFree=false;histSync();}
  hB.addEventListener('click',()=>histGo(HB,HF));hF.addEventListener('click',()=>histGo(HF,HB));
  /* double-click (double-tap) a part: the camera closes in to fit it and turns about it; 0 or Reset gives back the view */
  const fb=new THREE.Box3(),fbb=new THREE.Box3();
  /* the frame the focused point is kept in: the movement's for a part in it (it moves only as a view lifts it out of its case), else the part's group; never the mesh
     hit, which may turn with its part (the 6MX's contact lever rocking about its staff swung the whole clock sideways in the view until 24 October 2026) */
  const fAnchor=h=>{for(let q=h;q;q=q.parent)if(q===mv)return mv;let q=h;while(q.parent&&!q.userData.partName)q=q.parent;return q.userData.partName?q:h;};
  function focusPart(p,o){fb.makeEmpty();root.updateMatrixWorld();root.traverse(m=>{if(m.isMesh&&m.userData.part===p&&shown(m)&&m.geometry.attributes.position){if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();fbb.copy(m.geometry.boundingBox).applyMatrix4(m.matrixWorld);fb.union(fbb);}});
    if(fb.isEmpty())return;const c=fb.getCenter(new THREE.Vector3()),rr=Math.max(fb.getSize(new THREE.Vector3()).length()/2,1),lc=o.worldToLocal(c.clone()),v=cam.fov*Math.PI/360,hv=Math.atan(Math.tan(v)*cam.aspect);
    jump(()=>{G.follow=()=>o.localToWorld(lc.clone());panO.set(0,0,0);G.yaw=C.yaw;G.pitch=C.pitch;G.dist=clamp(Math.min(rr/Math.tan(Math.min(v,hv))*1.05,C.dist),30,1500);camFree=false;});}
  /* focusOn(keys, o): the camera closes in on parts or pieces (keys), the rest see-through until a view is chosen, Reset or unfocus(); o.view a view to stand in first (its case,
     its explode), o.at [x, y, z] and o.r a place in mv's frame to fit instead of the parts' box, o.yaw, o.pitch the camera's (else it keeps its own), o.k the margin (the
     page's lists of changes: the Wempe's 6MX against the drawings). The point is kept in the frame of what it is on (mv, or the first part's group), so it follows as the view
     lifts the movement out of its case */
  function focusOn(keys,o){o=o||{};if(st.tour>=0)tourEnd();closeInfo();closeOpm();hintOff();jump(()=>{if(o.view&&o.view!==st.view)setView(o.view);if(Math.abs(cur.explode-tgt.explode)>1e-6){cur.explode=tgt.explode;mv.userData.explode(smooth(cur.explode));}cur.all=tgt.all;st.allK=smooth(cur.all);if(Math.abs(cur.dev-tgt.dev)>1e-6){cur.dev=tgt.dev;if(mv.userData.develop)mv.userData.develop(smooth(cur.dev));devShown=cur.dev>0.02;}cur.sub=tgt.sub;settle();st.drive=!!o.drive&&!!DV;st.focus=new Set(keys);zf=true;look();
    root.updateMatrixWorld(true);let an=null;fb.makeEmpty();const inv=new THREE.Matrix4();
    root.traverse(m=>{if(!m.isMesh||!shown(m)||!m.geometry.attributes.position||!(keys.includes(m.userData.part)||keys.includes(m.userData.pk)))return;
      if(!an){let q=m;while(q&&q!==mv)q=q.parent;an=q||m.parent;while(an!==mv&&an.parent&&!an.userData.partName)an=an.parent;inv.copy(an.matrixWorld).invert();}
      if(!o.at){if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();fbb.copy(m.geometry.boundingBox).applyMatrix4(m.matrixWorld).applyMatrix4(inv);fb.union(fbb);}});
    if(o.at){an=mv;fb.setFromCenterAndSize(new THREE.Vector3(...o.at),new THREE.Vector3(1,1,1).multiplyScalar(2*(o.r||10)/Math.sqrt(3)));}
    if(!an||fb.isEmpty())return;const lc=fb.getCenter(new THREE.Vector3()),rr=Math.max(fb.getSize(new THREE.Vector3()).length()/2,1),v=cam.fov*Math.PI/360,hv=Math.atan(Math.tan(v)*cam.aspect),A=an;
    G.follow=()=>A.localToWorld(lc.clone());panO.set(0,0,0);if(o.yaw!=null)G.yaw=C.yaw+((((o.yaw-C.yaw+Math.PI)%TAU)+TAU)%TAU-Math.PI);if(o.pitch!=null)G.pitch=o.pitch;
    G.dist=clamp(rr/Math.tan(Math.min(v,hv))*(o.k||1.15),30,1500);camFree=false;});}
  function unfocus(){if(!zf)return;zf=false;st.focus=null;look();}
  const hintOff=()=>{const h=$('#hint');if(h)h.style.opacity=0;};for(const ev of['pointerdown','wheel','keydown'])cv.addEventListener(ev,hintOff,{once:true,passive:true});
  /* pointer: orbit, pinch, tap to pick; on touch, a long press (500 ms, barely moving) opens the fade/hide menu, since iOS fires no contextmenu */
  const ptrs=new Map();let pinch=0,down=null,rMoved=0,lpT=0,lpAt=-1e9,lastTap=null;const lpStop=()=>{clearTimeout(lpT);lpT=0;};
  cv.addEventListener('pointerdown',e=>{if(SEL&&(SEL.busy()||!ptrs.size)&&SEL.down(e))return;ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});try{cv.setPointerCapture(e.pointerId);}catch(_){}stage.classList.add('grab');down={x:e.clientX,y:e.clientY,t:performance.now(),moved:0,btn:e.button,pan:e.shiftKey||e.button===1};if(e.button===1)e.preventDefault();
    lpStop();if(e.pointerType!=='mouse'&&ptrs.size===1){const x=e.clientX,y=e.clientY;lpT=setTimeout(()=>{lpT=0;if(!down||down.moved>6||ptrs.size!==1)return;down.lp=true;lpAt=performance.now();openOpm(x,y);if(opm.classList.contains('on')&&navigator.vibrate)navigator.vibrate(10);},500);}});
  cv.addEventListener('pointermove',e=>{if(SEL&&SEL.move(e))return;const p=ptrs.get(e.pointerId);if(!p)return;const pdx=e.clientX-p.x,pdy=e.clientY-p.y;
    if(down)down.moved+=Math.abs(pdx)+Math.abs(pdy);if(lpT&&down&&down.moved>6)lpStop();
    if(ptrs.size===1&&down&&down.moved>4&&down.pan)panBy(pdx,pdy);
    else if(ptrs.size===1&&down&&down.moved>4){camFree=true;C.yaw-=pdx*0.008;C.pitch=clamp(C.pitch+pdy*0.008,-1.52,1.52);G.yaw=C.yaw;G.pitch=C.pitch;}   /* pitch to 87° above or below: at 90° lookAt has no up */
    p.x=e.clientX;p.y=e.clientY;
    if(ptrs.size===2){const[a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);if(pinch)C.dist=G.dist=clamp(C.dist*pinch/d,30,1500);pinch=d;panBy(pdx/2,pdy/2);if(down)down.moved=99;}});
  const up=e=>{if(SEL&&SEL.up(e))return;lpStop();if(down&&down.btn===2)rMoved=down.moved;const wasTap=down&&down.btn===0&&!down.lp&&down.moved<6&&ptrs.size===1&&performance.now()-down.t<500;ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=0;if(!ptrs.size)stage.classList.remove('grab');
    if(wasTap&&e.type==='pointerup'&&SEL&&SEL.tap(e))lastTap=null;else if(wasTap&&e.type==='pointerup'){const t=e.timeStamp;if(lastTap&&t-lastTap.t<400&&Math.hypot(e.clientX-lastTap.x,e.clientY-lastTap.y)<24){lastTap=null;dblPick(e);}else{lastTap={t,x:e.clientX,y:e.clientY};pick(e);}}   /* a second tap within 0.4 s in the same place: a double */
    if(!ptrs.size)down=null;};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  $('#info').addEventListener('pointerup',e=>{if(e.button===0&&lastTap&&e.timeStamp-lastTap.t<400&&Math.hypot(e.clientX-lastTap.x,e.clientY-lastTap.y)<24){const t=lastTap;lastTap=null;dblPick({clientX:t.x,clientY:t.y});}});
  cv.addEventListener('wheel',e=>{e.preventDefault();C.dist=G.dist=clamp(C.dist*Math.exp(e.deltaY*0.0012),30,1500);},{passive:false});
  const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();ray.layers.enable(2);   /* layer 2: the pieces drawn merged */
  const through=m=>{const o=opOf(m),m0=m.userData.mat0;if(o!=null&&o<0.5||m0.transparent&&m0.opacity<0.5)return true;return !!ghOf(m,st.focus);};   /* faded below half, glass, or see-through: a click passes */
  const rayAt=(x,y)=>{const rc=cv.getBoundingClientRect();ndc.set((x-rc.left)/rc.width*2-1,-(y-rc.top)/rc.height*2+1);ray.setFromCamera(ndc,cam);return ray.intersectObjects([root],true).filter(h=>shown(h.object)&&INFO[h.object.userData.part]);};
  const hitAt=e=>{const hs=rayAt(e.clientX,e.clientY);return hs.find(h=>!through(h.object))||hs.filter(h=>h.object.userData.devPlate).sort((a,b)=>a.object.userData.rad-b.object.userData.rad)[0]||null;};   /* a see-through schematic plate (laid out) is picked only where no part shows through it, the smallest where they overlap (a bridge before the plate it lies on, which shows round it) */
  /* a glass (see-through by its material, the bezel's) passes a click to what is behind it; clicking that again picks the glass in front of it, and again goes back. The glass
     counts where only the pick's ghosting hides it (look hides a ghosted noShadow mesh) */
  const glassIn=hit=>{const g=[];for(const h of ray.intersectObjects([root],true)){if(h.distance>=hit.distance)break;const o=h.object,u=o.userData,m0=u.mat0||o.material;
      if(u.pk&&INFO[u.part]&&m0.transparent&&m0.opacity<0.5&&!u.devPlate&&(shown(o)||u.noShadow&&shown(o.parent)&&!opHide(o)&&!mOut(o))&&!g.includes(u.pk))g.push(u.pk);}return g;};
  function pick(e){if(help.classList.contains('on')){showHelp(false);return;}const hit=hitAt(e);if(cfg.pick&&cfg.pick(hit))return;if(!hit){closeInfo();return;}const pk=hit.object.userData.pk,stk=[pk,...glassIn(hit).filter(k=>k!==pk)],i=stk.indexOf(st.pick);showPart(stk[i<0?0:(i+1)%stk.length]);}
  function dblPick(e){if(help.classList.contains('on'))return;const hit=hitAt(e);if(hit){const p=hit.object.userData.pk;if(st.pick!==p)showPart(p);focusPart(hit.object.userData.part,fAnchor(hit.object));}else jump(()=>setView(st.view,true));}
  /* the cards' sizes in millimetres or in inches */
  let units='mm';const U=t=>units==='in'?t.replace(/(\d+(?:\.\d+)?)(?:\s?[–-]\s?(\d+(?:\.\d+)?))?\s?mm(?![²³\w])/g,(m,a,b)=>(a/25.4).toFixed(3)+(b?'–'+(b/25.4).toFixed(3):'')+' in'):t;
  /* a piece's card: its own text, and its source, note and figures where it has them, else its part's; a line up to its part. A part with pieces lists them */
  function showPart(p){showHelp(false);const pp=kp(p);if(cfg.card)setTimeout(()=>cfg.card(p),0);st.hid.delete(p);st.hid.delete(pp);if(st.iso)st.iso.add(p);st.pick=p;look();let[t,d,sp]=INFO[p];d=U(d);sp=U(sp||'');
    const info=$('#info');info.querySelector('h3').textContent=t;info.querySelector('p').textContent=d;info.querySelector('.spec').textContent=sp||'';const q=PARTS[pp],c=PCE[p]||{},src=c.src||q.src,sn=c.src?c.sn:q.sn,figs=c.figs??q.figs;
    info.querySelector('.src').innerHTML=src?`<i style="--ps:${SRC[src][1]}"></i>${SRC[src][0]}${pp!==p&&!c.src?` (the ${q.t.toLowerCase()} as a whole)`:''}${sn?': '+U(sn):''}${figs?`. ${FL} ${figs}`:''}.`:'';
    const lk=k=>`<button data-p="${k}">${INFO[k][0]}</button>`;info.querySelector('.of').innerHTML=pp!==p?`Part of: ${lk(pp)}`:q.pcs?'Its pieces: '+q.pcs.map(x=>lk(pp+'.'+x.k)).join(', '):'';info.classList.add('on');hintOff();}
  $('#info .of').addEventListener('click',e=>{const b=e.target.closest('button[data-p]');if(b&&Object.prototype.hasOwnProperty.call(INFO,b.dataset.p))showPart(b.dataset.p);});
  function closeInfo(){if(st.pick){st.pick=null;look();}$('#info').classList.remove('on');}
  $('#info .x').addEventListener('click',closeInfo);
  /* right-click (or long-press) a part: opacity, hide and isolate; on empty space, the hidden parts and the way back from isolation */
  const opm=$('#opm'),opIn=opm.querySelector('input'),opOut=opm.querySelector('output'),opP=$('#opPart'),opH=$('#opHid'),opI=$('#opIso'),chips=opH.querySelector('.chips');let opPart=null;
  const opT=()=>opPart?SEL?SEL.targets(opPart):[opPart]:[];   /* the part the menu is on, or the whole selection when it is on a selected part */
  const opShow=()=>{const v=Math.round((st.op[opPart]??1)*100);opIn.value=v;opOut.textContent=v+'%';};
  function opList(){chips.innerHTML='';for(const p of st.hid){const b=document.createElement('button');b.textContent=INFO[p][0];b.title='Show '+INFO[p][0];b.addEventListener('click',()=>{st.hid.delete(p);look();opRender();});chips.appendChild(b);}}
  function opRender(){opP.classList.toggle('hidden',!opPart);opH.classList.toggle('hidden',!st.hid.size);opI.classList.toggle('hidden',!st.iso);opList();
    const ia=asmIs(st.iso);if(st.iso)opI.querySelector('.hl').textContent=ia?'Showing only the subassembly: '+ia.t:'Showing only '+[...st.iso].map(p=>INFO[p][0]).join(', ');
    const sa=opPart&&!(SEL&&opT().length>1)?asmOf(opPart):null,sb=opm.querySelector('[data-a="isoasm"]');if(sb){sb.classList.toggle('hidden',!sa||ia===sa);if(sa){sb.textContent='Isolate the '+sa.t.toLowerCase();sb.title='Show only the '+sa.t.toLowerCase()+' subassembly: '+sa.parts.map(k=>INFO[k][0]).join(', ');}}const T=opT();opm.querySelector('[data-a="iso"]').classList.toggle('hidden',!!(st.iso&&st.iso.size===T.length&&T.every(k=>st.iso.has(k))));
    opm.querySelector('h4').textContent=opPart?T.length>1?T.length+' selected parts':INFO[opPart][0]:st.hid.size?'Hidden parts':'Isolated';if(opPart)opShow();if(!opPart&&!st.hid.size&&!st.iso)closeOpm();}
  function closeOpm(){opm.classList.remove('on');opPart=null;}
  cv.addEventListener('contextmenu',e=>{e.preventDefault();lpStop();if(SEL&&SEL.busy())return;if(performance.now()-lpAt<800)return;if((down?down.moved:rMoved)>6)return;if(down)down.lp=true;openOpm(e.clientX,e.clientY);});   /* Android's own long-press contextmenu: whichever comes first opens it, once */
  function openOpm(cx,cy){const hits=rayAt(cx,cy),hit=hits.find(h=>!(h.object.material.transparent&&h.object.material.opacity<0.5))||hits.find(h=>opOf(h.object)!=null);
    if(!hit&&!st.hid.size&&!st.iso){closeOpm();return;}opPart=hit?hit.object.userData.pk:null;opm.classList.add('on');opRender();
    const sr=stage.getBoundingClientRect();opm.style.left=clamp(cx-sr.left+8,8,sr.width-opm.offsetWidth-8)+'px';opm.style.top=clamp(cy-sr.top+8,8,sr.height-opm.offsetHeight-8)+'px';}
  opIn.addEventListener('input',()=>{if(!opPart)return;const v=opIn.valueAsNumber/100;for(const k of opT()){if(v>=1)delete st.op[k];else st.op[k]=v;}opOut.textContent=opIn.value+'%';look();if(SEL)SEL.sync();});
  opm.querySelectorAll('button[data-a]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.a,T=opT();
    if(a==='hide'){if(opPart){for(const k of T){st.hid.add(k);isoDrop(k);}if(SEL)SEL.drop(T);opPart=null;}}else if(a==='iso'){if(opPart){st.iso=new Set(T);for(const k of T){st.hid.delete(k);delete st.op[k];}}}else if(a==='uniso')st.iso=null;
    else if(a==='isoasm'){const sa=asmOf(opPart);if(sa){isoAsm(sa);return;}}
    else if(a==='showall'){st.hid.clear();st.iso=null;}else if(a==='all'){st.op={};st.hid.clear();st.iso=null;}else for(const k of T)delete st.op[k];
    look();opRender();if(SEL)SEL.sync();}));
  cv.addEventListener('pointerdown',e=>{if(e.button!==2)closeOpm();});
  /* isoAsm(a): a subassembly shown alone (its parts isolated, none hidden or faded), the camera closing in on it where it stands (apart, beside the movement) */
  function isoAsm(a){st.iso=new Set(a.parts);for(const k of a.parts){st.hid.delete(k);delete st.op[k];}for(const k of[...st.hid])if(a.parts.includes(kp(k)))st.hid.delete(k);if(SEL)SEL.sync();focusOn(a.parts);look();opRender();}
  function asmPress(){const bx=$('#asmIso');if(!bx)return;const ia=asmIs(st.iso);bx.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',ia&&ia.k===b.dataset.v?'true':'false'));}   /* the Parts list's subassembly buttons, from look() */
  const asmBox=$('#asmIso');
  if(asmBox){if(!ASM.length)$('#asmWrap').classList.add('hidden');for(const a of ASM){const b=document.createElement('button');b.dataset.v=a.k;b.textContent=a.t;b.setAttribute('aria-pressed','false');b.title='Show only the '+a.t.toLowerCase()+': '+a.parts.map(k=>INFO[k][0]).join(', ');
    b.addEventListener('click',()=>{if(asmIs(st.iso)===a){st.iso=null;look();opRender();unfocus();}else isoAsm(a);});asmBox.appendChild(b);}}
  /* the selection (../shared/select.js): Ctrl-click or Select, Alt-drag or Lasso; its bar and the menu above fade, hide or isolate it together */
  if(typeof PSEL!=='undefined')SEL=PSEL.bind({r,scene,cam,stage,cv,st,INFO,meshes:MVM,pickable:m=>shown(m)&&!!INFO[m.userData.part]&&!through(m),shows:m=>shown(m)&&!!INFO[m.userData.part],hitKey:e=>{const h=hitAt(e);return h?h.object.userData.pk:null;},isoDrop,look,changed:()=>{if(opm.classList.contains('on'))opRender();}});
  /* how to use it: stays open while the model is dragged; a tap, × or Esc closes it */
  const help=$('#help'),helpBtn=$('#helpBtn');
  function showHelp(on){const was=help.classList.contains('on');help.classList.toggle('on',on);helpBtn.setAttribute('aria-expanded',on?'true':'false');if(on){closeInfo();closeOpm();hintOff();if(!was){help.tabIndex=-1;help.focus({preventScroll:true});}}else if(was&&help.contains(document.activeElement))helpBtn.focus();}   /* the keys go into it, and back to ? when it closes */
  helpBtn.addEventListener('click',()=>showHelp(!help.classList.contains('on')));help.querySelector('.x').addEventListener('click',()=>showHelp(false));
  const typing=()=>/^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement.tagName)||$('#about').open;
  const ES=cfg.essay,esOn=()=>!!ES&&ES.on();   /* the essay tab (cfg.essay, ../shared/essaykit.js's api), when the page has one: while it shows, the model keeps its time but isn't drawn, and the keys and the hash are the essay's */
  document.addEventListener('keydown',e=>{if(esOn())return;const mod=e.ctrlKey||e.metaKey||e.altKey;
    if(e.key==='Escape'){const top=opm.classList.contains('on')||help.classList.contains('on');if(!top&&$('#info').classList.contains('on'))closeInfo();else if(SEL&&!top)SEL.esc();closeOpm();showHelp(false);}   /* the top one closed: the menu or help, else the part's card, else the lasso let go or the selection cleared */
    if((e.key==='p'||e.key==='P')&&!mod&&!typing()&&panelSide())pnb.click();
    if(e.key==='Backspace'&&!mod&&!typing()){e.preventDefault();if(e.shiftKey)histGo(HF,HB);else histGo(HB,HF);}
    if(e.key==='?'&&!typing())showHelp(!help.classList.contains('on'));
    if(e.key===' '&&!/^(INPUT|BUTTON|SELECT|TEXTAREA|SUMMARY)$/.test(document.activeElement.tagName)&&!$('#about').open){e.preventDefault();setSpeed(st.speed?0:(lastSpeed||1));}   /* space: stop and restart */
    if(/^[1-9]$/.test(e.key)&&!mod&&!typing()){const b=document.querySelectorAll('#views button')[+e.key-1];if(b&&!b.disabled)b.click();}   /* 1 to 9: the views, in their buttons' order */
    if(document.activeElement===cv&&!mod){const a={ArrowLeft:[0.08,0],ArrowRight:[-0.08,0],ArrowUp:[0,-0.06],ArrowDown:[0,0.06]}[e.key];   /* the model focused: arrows turn, + and − zoom, 0 resets */
      if(a){e.preventDefault();camFree=true;C.yaw+=a[0];C.pitch=clamp(C.pitch+a[1],-1.52,1.52);G.yaw=C.yaw;G.pitch=C.pitch;}
      else if(/^[-+=_]$/.test(e.key)){e.preventDefault();C.dist=G.dist=clamp(C.dist*(/^[-_]$/.test(e.key)?1.12:1/1.12),30,1500);}
      else if(e.key==='0'){e.preventDefault();jump(()=>setView(st.view,true));}}});
  /* ---------- controls ---------- */
  /* speed: presets, or any value from 0.01x to 10000x on a log slider or typed in */
  const spdR=$('#spdR'),spdN=$('#spdN'),SMIN=0.01,SMAX=10000;let lastSpeed=1;
  const setSpeed=(v,from)=>{v=v>0?clamp(v,SMIN,SMAX):0;st.speed=v;if(v)lastSpeed=v;document.querySelectorAll('#speeds button').forEach(x=>x.setAttribute('aria-pressed',Math.abs(parseFloat(x.dataset.v)-v)<1e-9?'true':'false'));
    if(spdR&&from!=='r'&&v)spdR.value=Math.round((Math.log10(v)-Math.log10(SMIN))/(Math.log10(SMAX)-Math.log10(SMIN))*1000);if(spdN&&from!=='n')spdN.value=v?+v.toPrecision(3):0;wake();};
  if(spdR)spdR.addEventListener('input',()=>{const t=spdR.valueAsNumber/1000,v=Math.pow(10,Math.log10(SMIN)+t*(Math.log10(SMAX)-Math.log10(SMIN))),snap=[0.05,0.1,0.25,0.5,1,2,5,10,60,100,600,1000,3600,10000].find(q=>Math.abs(Math.log10(q/v))<0.03);setSpeed(snap??+v.toPrecision(2),'r');});
  if(spdN)spdN.addEventListener('change',()=>{const v=spdN.valueAsNumber;if(Number.isFinite(v))setSpeed(v,'n');spdN.value=st.speed?+st.speed.toPrecision(3):0;});setSpeed(st.speed);
  document.querySelectorAll('#views button').forEach(b=>b.addEventListener('click',()=>{closeInfo();if(st.tour>=0)tourEnd();jump(()=>setView(b.dataset.v));}));   /* a view chosen ends the walkthrough */
  document.querySelectorAll('#speeds button').forEach(b=>b.addEventListener('click',()=>setSpeed(parseFloat(b.dataset.v))));
  const about=$('#about');$('#aboutBtn').addEventListener('click',()=>{if(about.showModal)about.showModal();else about.setAttribute('open','');});about.addEventListener('click',e=>{if(e.target===about)about.close();});
  /* Remember settings: only with it on does this browser keep anything (under cfg.store's prefix, apart from the other models'); off, what was is cleared at load */
  const SP=(cfg.store||'mdl')+'-',RK=['set','theme','open','state'].map(k=>SP+k);let REM=false;try{REM=localStorage.getItem(SP+'remember')==='1';if(!REM)RK.forEach(k=>localStorage.removeItem(k));}catch(_){}
  const lsGet=k=>{if(!REM)return null;try{return localStorage.getItem(SP+k);}catch(_){return null;}},lsSet=(k,v)=>{if(!REM)return;try{localStorage.setItem(SP+k,v);}catch(_){}};
  const SET=(()=>{try{const o=JSON.parse(lsGet('set')||'{}');return o&&typeof o==='object'?o:{};}catch(_){return{};}})(),keep=(k,v)=>{SET[k]=v;lsSet('set',JSON.stringify(SET));};
  units=SET.units==='in'?'in':'mm';
  document.querySelectorAll('#units button').forEach(b=>{b.setAttribute('aria-pressed',b.dataset.v===units?'true':'false');b.addEventListener('click',()=>{units=b.dataset.v;keep('units',units);
    document.querySelectorAll('#units button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));if(st.pick)showPart(st.pick);});});
  const on=(id,f)=>{const e=$('#'+id);if(e)e.addEventListener('change',ev=>{f(ev.target.checked);look();});};
  on('ghost',v=>st.see=v);on('colr',v=>{st.colr=v;if(v)st.csrc=false;});on('colrSrc',v=>{st.csrc=v;if(v)st.colr=false;});on('draw',v=>st.draw=v?'tint':false);on('drawInk',v=>st.draw=v?'ink':false);
  if(DV){const dc=$('#driveOn'),mc=$('#mwOn');if(dc)dc.addEventListener('change',e=>{st.drive=e.target.checked;closeInfo();setView(st.view,true);});if(mc)mc.addEventListener('change',e=>{st.mwOn=e.target.checked;look();});}   /* Moving parts only: a view it can't show gives way to cfg.drive.to */
  on('edges',v=>st.edges=v);on('shadows',v=>st.shadows=v);on('merge',v=>st.merge=v);on('lbls',v=>st.labels=v);on('spin',v=>st.spin=v);
  $('#reset').addEventListener('click',()=>jump(()=>setView(st.view,true)));
  const showExp=()=>{expO.textContent=expR.value+'%';};showExp();expR.addEventListener('input',()=>{showExp();const vv=VIEWS[st.view];if(st.tour>=0)return;if(vv.explode){tgt.explode=expV()*vv.explode;tgt.all=allT(vv);tgt.sub=subT(vv);}if(vv.dev)tgt.dev=expV()*vv.dev;});   /* the Spread slider: how far apart the exploded parts are, or how far the train is laid out */
  document.querySelectorAll('#expAll button').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.v==='all';if(a===st.all)return;jump(()=>{st.all=a;allSync();const vv=VIEWS[st.view];if(st.tour<0&&vv.explode){tgt.all=allT(vv);goCam(camOf(vv));}});}));
  document.querySelectorAll('#expSub button').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.v==='apart';if(a===st.asm)return;jump(()=>{st.asm=a;subSync();const vv=VIEWS[st.view];if(st.tour<0&&vv.explode){tgt.sub=subT(vv);goCam(camOf(vv));}});look();}));
  /* theme: Auto follows the system; a choice is remembered with Remember settings */
  const setTheme=v=>{const de=document.documentElement;if(v==='auto')delete de.dataset.theme;else de.dataset.theme=v;document.querySelectorAll('#theme button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.v===v?'true':'false'));lsSet('theme',v);};
  document.querySelectorAll('#theme button').forEach(b=>b.addEventListener('click',()=>setTheme(b.dataset.v)));{const v=lsGet('theme');if(v==='light'||v==='dark')setTheme(v);}
  /* save the view as a PNG: rendered and copied in the same task, over the page background */
  $('#shot').addEventListener('click',()=>{paint();const c2=document.createElement('canvas');c2.width=cv.width;c2.height=cv.height;const x=c2.getContext('2d');x.fillStyle=getComputedStyle(document.body).backgroundColor;x.fillRect(0,0,c2.width,c2.height);x.drawImage(cv,0,0);
    c2.toBlob(b=>{if(!b)return;const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=(cfg.shot||'chronometer')+'.png';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);});});
  /* Link: the page's address with this state in its hash; without the clipboard, it is put in the address bar */
  $('#link').addEventListener('click',()=>{const b=$('#link'),h=hashOf(),u=location.href.split('#')[0]+(h?'#'+h:''),say=t=>{b.dataset.say=t;clearTimeout(b.t);b.t=setTimeout(()=>delete b.dataset.say,1500);};   /* shown beside the icon (style.css) */
    const bar=()=>{history.replaceState(null,'',h?'#'+h:location.pathname+location.search);hashSeen=location.hash.slice(1);};
    try{navigator.clipboard.writeText(u).then(()=>{bar();say('Copied');},()=>{bar();say('In address bar');});}catch(_){bar();say('In address bar');}});
  /* Reset display: each Display box back to its default (See-through to the view's own), faded and hidden parts back; the theme stays */
  $('#dispReset').addEventListener('click',()=>{const D={lbls:false,draw:false,drawInk:false,edges:true,shadows:false,merge:true,ghost:!!VIEWS[st.view].see,colr:false,colrSrc:false,spin:false};
    for(const k in D){const c=$('#'+k);if(c&&c.checked!==D[k]){c.checked=D[k];c.dispatchEvent(new Event('change'));}}st.op={};st.hid.clear();st.iso=null;look();opRender();});
  /* the panel's sections: with Remember settings, each viewer's open and closed ones */
  const DET=[...document.querySelectorAll('.ctl>details.grp')],detSave=()=>lsSet('open',JSON.stringify(Object.fromEntries(DET.map(x=>[x.id,x.open]))));
  try{const o=JSON.parse(lsGet('open')||'{}');DET.forEach(d=>{if(typeof o[d.id]==='boolean')d.open=o[d.id];});}catch(_){}DET.forEach(d=>d.addEventListener('toggle',detSave));
  const remSave=()=>{if(!REM||esOn()||st.tour>=0)return;const h=new URLSearchParams(hashOf());for(const k of['part','open'])h.delete(k);lsSet('state',h.toString());};   /* the hash's settings without what belongs to a moment; at load it stands in for a missing hash */
  const rem=$('#remember');if(rem){rem.checked=REM;rem.addEventListener('change',e=>{REM=e.target.checked;
    if(REM){try{localStorage.setItem(SP+'remember','1');}catch(_){}lsSet('set',JSON.stringify(SET));lsSet('theme',document.documentElement.dataset.theme||'auto');detSave();remSave();}else try{[SP+'remember',...RK].forEach(k=>localStorage.removeItem(k));}catch(_){}});}
  /* parts list: every named part, grouped; under a part with pieces, its pieces, folded until the part or one of them is picked. A name singles it out; the box hides it */
  const plist=$('#plist'),PROWS=[],figSet=s=>new Set((s||'').split(', ').filter(Boolean).flatMap(f=>{const[a,z]=f.split('–').map(Number);return z?Array.from({length:z-a+1},(_,i)=>a+i):[a];}));
  const fold=(q,o)=>{q.sub.classList.toggle('open',o);q.pf.setAttribute('aria-expanded',o?'true':'false');};
  function prow(k,box,gh,par){const p=kp(k),c=PCE[k],q=PARTS[p],row=document.createElement('div');row.className=c?'prow sub':'prow';row.innerHTML=`<input type="checkbox" checked aria-label="Show ${INFO[k][0]}"><button class="pn">${INFO[k][0]}</button>`;
    const src=c&&c.src||q.src;if(PCOL[k])row.style.setProperty('--pc',PCOL[k]);if(src)row.style.setProperty('--ps',SRC[src][1]);const cb=row.firstChild,b=row.lastChild;
    cb.addEventListener('change',()=>{if(cb.checked){st.hid.delete(k);if(c&&st.hid.has(p)){st.hid.delete(p);for(const x of q.pcs)if(p+'.'+x.k!==k)st.hid.add(p+'.'+x.k);}if(!c)for(const x of[...st.hid])if(kp(x)===p)st.hid.delete(x);if(st.iso)st.iso.add(k);}
      else{st.hid.add(k);isoDrop(k);if(st.pick&&(st.pick===k||!c&&kp(st.pick)===p))closeInfo();}look();});
    b.addEventListener('click',()=>{st.pick===k?closeInfo():showPart(k);});box.appendChild(row);
    const rw={p:k,row,ck:cb,b,gh,par,txt:(c?[k,c.t,c.sp,c.h,q.t,c.figs]:[k,q.t,q.sp,q.sn,q.figs]).join(' ').toLowerCase(),figs:figSet(c&&c.figs!=null?c.figs:q.figs)};PROWS.push(rw);return rw;}
  for(const[g,ps]of PGRP){plist.insertAdjacentHTML('beforeend',`<div class="plist-h">${g}</div>`);const gh=plist.lastElementChild;
    for(const p of ps){const rw=prow(p,plist,gh);if(!PARTS[p].pcs)continue;
      rw.row.insertAdjacentHTML('beforeend',`<button class="pf" aria-expanded="false" aria-label="Pieces of ${PARTS[p].t}" title="Its pieces">›</button>`);rw.pf=rw.row.lastChild;rw.sub=document.createElement('div');rw.sub.className='psub';plist.appendChild(rw.sub);
      rw.pf.addEventListener('click',()=>fold(rw,!rw.sub.classList.contains('open')));rw.kids=PARTS[p].pcs.map(c=>prow(p+'.'+c.k,rw.sub,gh,rw));}}
  /* search: every word in a name, key, number or source note; or fig N where the figures are numbers */
  const pSearch=$('#pSearch');pSearch.addEventListener('input',()=>{const v=pSearch.value.trim().toLowerCase(),fm=/^figs?\.?\s*(\d+)$/.exec(v),q=v.split(/\s+/).filter(Boolean),hit=new Set();
    for(const x of PROWS)x.on=fm?x.figs.has(+fm[1]):q.every(w=>x.txt.includes(w));for(const x of PROWS)if(x.on&&x.par)x.par.on=true;
    for(const x of PROWS){x.row.classList.toggle('hidden',!x.on);if(x.on)hit.add(x.gh);if(x.kids)x.sub.classList.toggle('found',!!v&&x.kids.some(y=>y.on));}for(const x of PROWS)x.gh.classList.toggle('hidden',!hit.has(x.gh));
    $('#pNone').classList.toggle('hidden',hit.size>0);});
  $('#pShow').addEventListener('click',()=>{st.hid.clear();st.iso=null;look();});
  function partsSync(){for(const q of PROWS){const k=q.p,p=kp(k),h=k!==p?st.hid.has(k)||st.hid.has(p)||isoOut(p,k):st.hid.has(p)||isoOut(p);q.ck.checked=!h;q.row.classList.toggle('off',h);
      if(q.kids){q.ck.indeterminate=!h&&q.kids.some(x=>st.hid.has(x.p)||isoOut(p,x.p));if(st.pick!==q.seen){q.seen=st.pick;if(st.pick&&kp(st.pick)===p)fold(q,true);}}
      q.b.setAttribute('aria-pressed',st.pick===k?'true':'false');q.b.disabled=dvOut(p)&&!(DVS.has(p)&&dvOn()&&!st.drive);}plist.classList.toggle('colr',st.colr);plist.classList.toggle('csrc',st.csrc);}
  const fsb=$('#fs');if(!(document.fullscreenEnabled||document.webkitFullscreenEnabled))fsb.classList.add('hidden');
  fsb.addEventListener('click',()=>{const d=document;if(d.fullscreenElement||d.webkitFullscreenElement)(d.exitFullscreen||d.webkitExitFullscreen).call(d);else(stage.requestFullscreen||stage.webkitRequestFullscreen).call(stage);});
  /* Hide panel (P, or the tab on the stage's edge), where the panel sits beside the stage; its width by dragging the line between them, or the arrow keys on it */
  const pnb=$('#panelBtn'),panelSide=()=>getComputedStyle(pnb).display!=='none',panelOn=o=>{document.documentElement.classList.toggle('nopanel',!o);pnb.textContent=o?'›':'‹';pnb.setAttribute('aria-label',o?'Hide the panel':'Show the panel');pnb.title=(o?'Hide the panel, for a larger model':'Show the panel')+' (P)';pnb.setAttribute('aria-expanded',o?'true':'false');keep('nopanel',!o);};
  if(SET.nopanel)panelOn(false);pnb.addEventListener('click',()=>panelOn(document.documentElement.classList.contains('nopanel')));
  const spl=$('#split'),PW0=350,pwMax=()=>Math.max(320,Math.min(640,innerWidth-658));let spD=null;
  const pwSet=(w,save)=>{w=Math.round(clamp(w,320,pwMax()));document.documentElement.style.setProperty('--pw',w+'px');spl.setAttribute('aria-valuenow',w);spl.setAttribute('aria-valuemax',pwMax());if(save)keep('pw',w===PW0?undefined:w);};
  pwSet(+SET.pw||PW0);
  spl.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();spD={x:e.clientX,w:$('#panel').offsetWidth};try{spl.setPointerCapture(e.pointerId);}catch(_){}spl.classList.add('on');document.documentElement.classList.add('splitting');});
  spl.addEventListener('pointermove',e=>{if(spD)pwSet(spD.w-(e.clientX-spD.x));});
  const spUp=()=>{if(!spD)return;spD=null;spl.classList.remove('on');document.documentElement.classList.remove('splitting');pwSet($('#panel').offsetWidth,true);};spl.addEventListener('pointerup',spUp);spl.addEventListener('pointercancel',spUp);
  spl.addEventListener('dblclick',()=>pwSet(PW0,true));
  spl.addEventListener('keydown',e=>{const d={ArrowLeft:20,ArrowRight:-20}[e.key];if(d){e.preventDefault();pwSet($('#panel').offsetWidth+d,true);}else if(e.key==='Home'||e.key==='End'){e.preventDefault();pwSet(e.key==='Home'?320:pwMax(),true);}});
  /* ---------- the walkthrough (cfg.TOUR; the Hamilton's How it works): each step a view, a camera, the parts it singles out (the rest see-through), Moving parts only or not, a speed and
     an inset the page fills (cfg.tourInset); the viewer's settings kept when it starts and given back when it ends ---------- */
  let preTour=null;const tDots=$('#tDots');if(tDots&&TOUR)tDots.innerHTML=TOUR.map(()=>'<i></i>').join('');
  function tourGo(i){if(!TOUR)return;panelOn(true);if(st.tour<0)preTour={view:st.view,see:st.see,speed:st.speed,drive:st.drive,mwOn:st.mwOn};st.tour=i;const s=TOUR[i];closeInfo();showHelp(false);hintOff();
    $('#tourIntro').classList.add('hidden');$('#tourBody').classList.remove('hidden');$('#tStep').textContent=(i+1)+' / '+TOUR.length;$('#tTitle').textContent=s.t;$('#tText').innerHTML=s.x;
    if(tDots)[...tDots.children].forEach((d,k)=>d.classList.toggle('on',k<=i));$('#tPrev').disabled=i===0;$('#tNext').textContent=i===TOUR.length-1?'Finish':'Next';
    st.drive=!!s.drive;st.mwOn=!!s.mw;setView(s.view||cfg.startView);st.see=!!s.see;st.focus=s.focus?new Set(s.focus):null;setSpeed(s.speed??1);if(s.v)goCam(s.v);look();
    document.querySelectorAll('#views button').forEach(b=>b.setAttribute('aria-pressed','false'));$('#expWrap').classList.add('hidden');if(allW)allW.classList.add('hidden');
    if(cfg.tourStep)cfg.tourStep(s);const ins=$('#tInset');if(ins){ins.innerHTML='';if(cfg.tourInset)cfg.tourInset(s.inset||null,ins);}
    /* bring the card into view: below the stage when the stage sits above the panel (phones in portrait), else beside it (RESOLVED.md: test the layout, not the width) */
    if(innerWidth<960||innerHeight<=560){const card=$('#tourCard'),cr=card.getBoundingClientRect();
      if(cr.left<stage.getBoundingClientRect().right){const y=cr.top+scrollY-stage.offsetHeight-8;if(Math.abs(scrollY-y)>40)scrollTo({top:y,behavior:RM.matches?'auto':'smooth'});}
      else card.scrollIntoView({block:'nearest',behavior:RM.matches?'auto':'smooth'});}}
  function tourEnd(){if(st.tour<0)return;const u=preTour||{view:cfg.startView,see:false,speed:1,drive:false,mwOn:false};preTour=null;st.tour=-1;st.focus=null;st.drive=u.drive;st.mwOn=u.mwOn;setSpeed(u.speed);
    if(cfg.tourStep)cfg.tourStep(null);if(cfg.tourInset)cfg.tourInset(null,$('#tInset'));$('#tourIntro').classList.remove('hidden');$('#tourBody').classList.add('hidden');setView(u.view,true);st.see=u.see;look();}
  if(TOUR&&$('#tStart')){$('#tStart').addEventListener('click',()=>tourGo(0));$('#tPrev').addEventListener('click',()=>tourGo(Math.max(0,st.tour-1)));
    $('#tNext').addEventListener('click',()=>st.tour<TOUR.length-1?tourGo(st.tour+1):tourEnd());$('#tExit').addEventListener('click',tourEnd);}
  /* ---------- labels: the model names its points (cfg.labels); placed greedily by priority on four sides, hidden where a part covers them (tested at 5 Hz) ---------- */
  const labels=[],lab=$('.labels');
  const addL=(t,sub,part,fn)=>{const el=document.createElement('div');el.className='lbl';if(PCOL[part])el.style.setProperty('--pc',PCOL[part]);if(PARTS[part]&&PARTS[part].src)el.style.setProperty('--ps',SRC[PARTS[part].src][1]);el.innerHTML='<span>'+t+(sub?'<i>'+sub+'</i>':'')+'</span>';lab.appendChild(el);labels.push({el,sp:el.firstChild,fn,part,w:0,h:0,occ:false});};
  const pw=(g,x,y,z)=>{const v=new THREE.Vector3(x,y,z);return()=>g.localToWorld(v.clone());};
  if(cfg.labels)cfg.labels(addL,pw);
  const ray2=new THREE.Raycaster(),tmpV=new THREE.Vector3(),camP=new THREE.Vector3();let lastOcc=0,LS=null;ray2.layers.enable(2);
  function placeLabels(now){if(!LS)LS=labels.slice().sort((p,q)=>(PRI[q.part]||1)-(PRI[p.part]||1));
    const foc=st.pick?new Set([st.pick]):st.focus,doOcc=now-lastOcc>200,placed=[],pad=3;if(doOcc)lastOcc=now;
    for(const l of LS){let sh=(st.labels||st.tour>=0)&&!(foc&&!anyOf(foc,l.part))&&!isoOut(l.part)&&!st.hid.has(l.part)&&!dvOut(l.part);if(!sh){l.el.style.opacity=0;continue;}
      const P0=l.fn();
      if(doOcc){camP.copy(cam.position);const d=P0.distanceTo(camP);ray2.set(camP,tmpV.copy(P0).sub(camP).normalize());ray2.far=d-0.8;
        l.occ=ray2.intersectObject(root,true).some(h=>shown(h.object)&&h.object.userData.part!==l.part&&!(h.object.material.transparent&&h.object.material.opacity<0.5)&&!h.object.userData.decal);}
      if(l.occ){l.el.style.opacity=0;continue;}
      tmpV.copy(P0).project(cam);const px=(tmpV.x+1)/2*W,py=(1-tmpV.y)/2*Hh;if(tmpV.z>1||px<4||px>W-4||py<4||py>Hh-40){l.el.style.opacity=0;continue;}
      if(!l.w){l.w=l.sp.offsetWidth;l.h=l.sp.offsetHeight;}
      const w=l.w,h=l.h,C4=[[9,-h/2],[-9-w,-h/2],[-w/2,-h-9],[-w/2,9]];let ok=null;
      for(const[dx,dy]of C4){const q={x0:px+dx-pad,y0:py+dy-pad,x1:px+dx+w+pad,y1:py+dy+h+pad};if(q.x0<2||q.x1>W-2||q.y0<2||q.y1>Hh-38)continue;
        if(placed.some(o=>q.x0<o.x1&&o.x0<q.x1&&q.y0<o.y1&&o.y0<q.y1))continue;ok=[dx,dy,q];break;}
      if(!ok){l.el.style.opacity=0;continue;}placed.push(ok[2],{x0:px-4,y0:py-4,x1:px+4,y1:py+4});
      l.el.style.transform=`translate(${px.toFixed(1)}px,${py.toFixed(1)}px)`;l.sp.style.transform=`translate(${ok[0].toFixed(1)}px,${ok[1].toFixed(1)}px)`;l.el.style.opacity=1;}}
  new ResizeObserver(()=>{labels.forEach(l=>{l.w=0;});}).observe(stage);
  /* ---------- the state in the URL hash: view, drive=1, speed, sec=x:-3.5[:f][:o], part, draw=1|ink, colr=part|src, edges=0, shadows=1, merge=0, and the model's own (cfg.hash).
     Read at load and when the hash is edited; written 0.3 s after any change, with replaceState ---------- */
  function hashOf(){if(esOn()){const s=ES.section(),k=ES.key||'essay';return s?k+'='+s:k;}const h=new URLSearchParams();if(st.tour>=0)h.set('tour',st.tour+1);
    else{if(st.view!==cfg.startView)h.set('view',st.view);if(st.drive)h.set('drive',1);if(st.speed!==1)h.set('speed',+st.speed.toPrecision(3));if(st.all)h.set('exp','all');if(st.asm)h.set('subs','apart');if(secMode!=='off')h.set('sec',secMode+':'+(+secOff.toFixed(2))+(secFlip?':f':'')+(SEC.flat.value?'':':o'));}
    if(st.pick)h.set('part',st.pick);if(st.draw)h.set('draw',st.draw==='ink'?'ink':1);if(st.colr||st.csrc)h.set('colr',st.csrc?'src':'part');if(!st.edges)h.set('edges',0);if(st.shadows)h.set('shadows',1);if(!st.merge)h.set('merge',0);
    if(cfg.hash)cfg.hash.write(h);if(CT)CT.hashWrite(h);return h.toString().split('%3A').join(':').split('%2C').join(',');}
  function writeHash(){if(!hashReady)return;clearTimeout(hashT);hashT=setTimeout(()=>{remSave();if(location.hash.slice(1)!==hashSeen)return;const h=hashOf();if(h!==hashSeen){history.replaceState(null,'',h?'#'+h:location.pathname+location.search);hashSeen=location.hash.slice(1);}},300);}
  function applyHash(first){hashSeen=location.hash.slice(1);const h=new URLSearchParams(hashSeen),g=k=>h.get(k),own=(o,k)=>k!=null&&Object.prototype.hasOwnProperty.call(o,k),v=own(VIEWS,g('view'))?g('view'):first&&own(VIEWS,SET.view)?SET.view:cfg.startView;
    if(ES){const k=ES.key||'essay';if(h.has(k)){ES.show(true,g(k));return v;}ES.show(false);}   /* the essay (its key, ES.key): the model underneath is left as it is */
    if(first&&hashURL&&cfg.away&&cfg.away(h,{part:own(INFO,g('part')),view:own(VIEWS,g('view')),open:DET.some(d=>d.id===g('open')),tour:!!TOUR&&+g('tour')>=1&&+g('tour')<=TOUR.length}))return v;   /* cfg.away: a link meant for another page (the Wempe's at the site's root: an old link to the Hamilton, a part, view, panel or step this page hasn't), sent on there */
    const ed=g('edges')!=='0',shd=g('shadows')==='1',mg=g('merge')!=='0',dw=g('draw')==='1'?'tint':g('draw')==='ink'?'ink':false;
    if(dw!==st.draw||ed!==st.edges||shd!==st.shadows||mg!==st.merge||(g('colr')==='part')!==st.colr||(g('colr')==='src')!==st.csrc){st.draw=dw;st.edges=ed;st.shadows=shd;st.merge=mg;st.colr=g('colr')==='part';st.csrc=g('colr')==='src';look();}
    const sp=g('speed');setSpeed(sp!=null&&Number.isFinite(+sp)?+sp:1);
    const sc=/^([xyz]):(-?[\d.]+)(:f)?(:[po])?$/.exec(g('sec')||'');document.querySelector(`#secs button[data-v="${sc&&SECDEF[sc[1]]?sc[1]:'off'}"]`).click();
    if(sc&&SECDEF[sc[1]]){secOff=clamp(+sc[2],+secIn.min,+secIn.max);secIn.value=secOff;secFlip=!!sc[3];$('#secFlip').checked=secFlip;SEC.flat.value=sc[4]===':o'?0:1;$('#secLines').checked=sc[4]===':o';applySec();}
    if(DV){const d=g('drive')==='1';if(d!==st.drive){st.drive=d;look();}}   /* drive=1: Moving parts only */
    st.all=g('exp')==='all';allSync();st.asm=g('subs')==='apart'&&!!mv.userData.asmx;subSync();   /* exp=all: the Exploded view's All; subs=apart: its Subassemblies apart */
    if(cfg.hash)cfg.hash.read(g,first);if(CT)CT.hashRead(g);
    const tr=parseInt(g('tour'));if(TOUR&&tr>=1&&tr<=TOUR.length)tourGo(tr-1);else{if(st.tour>=0)tourEnd();if(!first)setView(v);}   /* tour=3: the walkthrough at its third step */
    const p=g('part');if(own(INFO,p))showPart(p);else closeInfo();
    const od=DET.find(d=>d.id===g('open'));if(od){panelOn(true);od.open=true;setTimeout(()=>od.scrollIntoView({block:'nearest',behavior:RM.matches?'auto':'smooth'}),first?1200:50);}
    return v;}
  addEventListener('hashchange',()=>applyHash(false));
  /* the Contacts view (cfg.contacts, ../shared/contacts.js): a part hidden, faded away, isolated out or hidden by Moving parts only takes its contacts with it */
  if(cfg.contacts&&typeof CONTACTS!=='undefined')CT=CONTACTS.bind({mv,r,stage,st,look,wake,QA,cfg:cfg.contacts,name:k=>INFO[k]?INFO[k][0]:k,pick:k=>{if(Object.prototype.hasOwnProperty.call(INFO,k))showPart(k);},stop:()=>setSpeed(0),exploded:()=>cur.explode>1e-6||cur.dev>1e-6||cur.sub>1e-6,
    hid:m=>!!m.userData.part&&(!!m.userData.devPlate||opHide(m)||mOut(m))});
  const hashURL=!!location.hash.slice(1);   /* the page opened with a hash of its own (a link), not the settings remembered: only a link is sent on to another page (cfg.away) */
  {const s=location.hash.slice(1)?'':lsGet('state');if(s)history.replaceState(null,'','#'+s);}   /* no hash: the settings remembered, as if they were one */
  const startView=applyHash(true);
  /* ---------- loop: frames skipped while nothing shown has changed, no input came in the last 0.6 s and the stage was drawn less than a second ago; ?snap draws every frame ---------- */
  let last=performance.now(),loaded=false,hudS='',lastSig=null,lastDraw=-1e9,onScreen=true;const hud=$('#hud');
  for(const ev of['pointerdown','pointermove','wheel','keydown','input','change','click'])document.addEventListener(ev,wake,{capture:true,passive:true});
  new ResizeObserver(wake).observe(stage);cv.addEventListener('webglcontextrestored',wake);
  new IntersectionObserver(e=>{onScreen=e[e.length-1].isIntersecting;if(onScreen)wake();}).observe(stage);
  /* the movement as the eased shares put it: explode and develop set the parts outright, then the subassemblies add to them (asmx) */
  function settle(){mv.userData.explode(smooth(cur.explode));if(mv.userData.develop)mv.userData.develop(smooth(cur.dev));if(mv.userData.asmx)mv.userData.asmx(smooth(cur.sub),smooth(cur.explode));}
  function frame(now){const dt=clamp((now-last)/1000,0,0.05),k=SNAP||RM.matches?1:1-Math.exp(-dt*3.0);last=now;
    for(const q of['explode','dev','all','sub','fov'])cur[q]+=(tgt[q]-cur[q])*k;st.allK=smooth(cur.all);
    const xs=cfg.tick?cfg.tick(dt,now,st)||[]:[];
    settle();if(cam.fov!==cur.fov){cam.fov=cur.fov;cam.updateProjectionMatrix();}
    if((cur.dev>0.02)!==devShown){devShown=cur.dev>0.02;look();}
    root.updateMatrixWorld(true);if(secMode!=='off')secPlane.copy(secLocal).applyMatrix4(mv.matrixWorld);
    if(G.follow)G.target.copy(G.follow()).add(panO);
    if(st.spin&&!ptrs.size){G.yaw+=dt*0.2;if(camFree)C.yaw+=dt*0.2;}
    C.target.lerp(G.target,Math.min(1,k*1.5));if(!camFree){C.yaw+=(G.yaw-C.yaw)*k;C.pitch+=(G.pitch-C.pitch)*k;}C.dist+=(G.dist-C.dist)*k;
    const cp=Math.cos(C.pitch);cam.position.set(C.target.x+C.dist*cp*Math.sin(C.yaw),C.target.y+C.dist*Math.sin(C.pitch),C.target.z+C.dist*cp*Math.cos(C.yaw));cam.lookAt(C.target);
    key.position.copy(C.target).add(new THREE.Vector3(160,420,240));key.target.position.copy(C.target);
    const sz=clamp(C.dist*0.45,60,260);if(scam.right!==sz){scam.left=-sz;scam.right=sz;scam.top=sz;scam.bottom=-sz;scam.updateProjectionMatrix();shThr=SHK*2*sz/key.shadow.mapSize.x;MVM.forEach(castOn);}
    if(CT)CT.frame(now);
    const sig=[cam.position.x,cam.position.y,cam.position.z,C.target.x,C.target.y,C.target.z,cam.fov,W,Hh,cur.explode,cur.dev,cur.all,cur.sub,secPlane.normal.x,secPlane.normal.y,secPlane.normal.z,secPlane.constant,+(secMode!=='off'),...xs,...(CT?CT.sig():[])];
    const still=!SNAP&&now>wakeT&&(now-lastDraw<10||!!lastSig&&lastSig.length===sig.length&&sig.every((v,i)=>Math.abs(v-lastSig[i])<1e-4)&&now-lastDraw<1000);
    if(onScreen&&!still&&!esOn()){paint();if(cfg.overlay)cfg.overlay();renders++;lastDraw=now;lastSig=sig;placeLabels(now);}
    const hs=cfg.hud?cfg.hud(st):'';if(hs!==hudS){hudS=hs;hud.innerHTML=hs;}   /* rewritten only when the text changes */
    if(!loaded){loaded=true;$('#loading').style.opacity=0;setTimeout(()=>$('#loading').remove(),900);setTimeout(()=>{st.opening=false;if(st.tour>=0)tourGo(st.tour);else if(!camFree)setView(startView);hashReady=true;writeHash();},1100);}
    requestAnimationFrame(frame);}
  look();document.querySelectorAll('#views button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===startView?'true':'false'));
  requestAnimationFrame(frame);
  return{st,look,wake,setView,goCam,base,tintOf,size:()=>[W,Hh],cam,scene,r,mv,M,INFO,PCE,PARTS,SRC,units:()=>units,tourEnd,focusOn,unfocus,focused:()=>zf};}};
