/* select.js: a selection of parts on the model, to fade, hide or isolate together; both pages (viewer.js binds it for the Wempe, app.js for the Hamilton). Declares only PSEL.
   Built a part at a time, Ctrl-click (⌘-click on a Mac) or, with Select on, a plain click or tap adding the part or piece a click picks or taking it away; or with a lasso,
   Alt-drag (Ctrl+Alt-drag adds to what is selected) or a drag after Lasso (one loop, added). The lasso takes every part or piece that shows inside the loop: the parts a click
   could pick (env.pickable: shown, and not faded, glass or see-through, which a click passes) drawn once off screen, each in a flat colour of its own (its id) on a layer of
   their own, so the merged copies (drawMerge) stay out and the pieces they stand for are drawn; the ids are read where the loop covers. The selected parts are tinted (has(mesh),
   in the host's look); the bar over the tools isolates, hides, fades or clears them, and the host's right-click menu acts on all of them when opened on one (targets(key)).
   PSEL.bind(env): env {r, scene, cam, stage, cv, st (hid, iso, op), INFO, meshes [...], pickable(mesh), hitKey(event) (the part or piece a click picks there, or null),
   isoDrop(key), look(), changed()}; returns {has(mesh), targets(key), drop(keys), sync(), down(e), move(e), up(e), tap(e), busy(), esc()}; the host's pointer handlers ask
   down, move and up first and leave the pointer to it when they return true. ?qa: window.__sel (keys(), set(keys, add), idsIn(points)). */
const PSEL=(()=>{
 const COL='#2f7fe8',LAY=5,MAC=/Mac|iP(hone|ad|od)/.test(navigator.platform||'');
 function bind(env){const{r,scene,cam,stage,cv,st,INFO}=env,sel=new Set();let mode=false,arm=false,las=null;
  const mk=(t,h)=>{const e=document.createElement(t);if(h)e.innerHTML=h;return e;},name=k=>INFO[k]?INFO[k][0]:k;
  /* the controls: Select and Lasso at the head of the tools, the bar over them (its own line in the tools' row, which wraps upward) */
  const tools=stage.querySelector('.tools'),bSel=mk('button','Select'),bLas=mk('button','Lasso');bSel.id='selMode';bLas.id='selLasso';
  bSel.title=`Select: a click or tap adds a part to the selection or takes it away (or ${MAC?'⌘':'Ctrl'}-click at any time)`;bLas.title=`Lasso: draw a loop round the parts to select (or Alt-drag at any time; ${MAC?'⌘':'Ctrl'}+Alt-drag adds)`;
  const bar=mk('div','<span class="sn"></span><button data-s="iso">Isolate</button><button data-s="hide">Hide</button><label class="sl"><span>Opacity</span><input type="range" min="0" max="100" step="1" aria-label="Opacity of the selected parts"><output></output></label><button data-s="clear">Clear</button>');
  bar.className='selbar hidden';bar.id='selBar';bar.setAttribute('role','toolbar');bar.setAttribute('aria-label','Selected parts');tools.prepend(bar,bSel,bLas);
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(()=>{stage.style.setProperty('--tw',tools.offsetWidth+'px');stage.style.setProperty('--th',tools.offsetHeight+'px');}).observe(tools);   /* the tools' size, which the HUD and close-up keep clear of (style.css) */
  const sn=bar.querySelector('.sn'),opIn=bar.querySelector('input'),opOut=bar.querySelector('output');
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg'),pg=document.createElementNS(svg.namespaceURI,'polygon');svg.setAttribute('class','lasso');svg.setAttribute('aria-hidden','true');svg.appendChild(pg);stage.appendChild(svg);
  function sync(){bSel.setAttribute('aria-pressed',mode?'true':'false');bLas.setAttribute('aria-pressed',arm?'true':'false');const n=sel.size;
    bar.classList.toggle('hidden',!n&&!mode&&!arm);bar.classList.toggle('empty',!n);
    sn.textContent=n?(n===1?name([...sel][0]):n+' parts selected'):arm?'Draw a loop round the parts':'Click parts to select them';sn.title=[...sel].map(name).join(', ');
    if(n){const v=[...sel].map(k=>st.op[k]??1),u=v.every(x=>x===v[0])?v[0]:1;opIn.value=String(Math.round(u*100));opOut.textContent=opIn.value+'%';}}
  const changed=()=>{sync();env.look();if(env.changed)env.changed();};
  function set(keys,add){if(!add)sel.clear();for(const k of keys)if(Object.prototype.hasOwnProperty.call(INFO,k))sel.add(k);changed();}
  bSel.addEventListener('click',()=>{mode=!mode;sync();});bLas.addEventListener('click',()=>{arm=!arm;sync();});
  bar.addEventListener('click',e=>{const b=e.target.closest('button[data-s]');if(!b)return;const a=b.dataset.s,K=[...sel];
    if(a==='iso'){st.iso=new Set(K);for(const k of K){st.hid.delete(k);delete st.op[k];}}
    else if(a==='hide'){for(const k of K){st.hid.add(k);env.isoDrop(k);}sel.clear();}   /* hidden, they leave the selection: the right-click menu on empty space lists them to show again */
    else if(a==='clear'){sel.clear();mode=arm=false;}
    changed();});
  opIn.addEventListener('input',()=>{const v=opIn.valueAsNumber/100;for(const k of sel){if(v>=1)delete st.op[k];else st.op[k]=v;}opOut.textContent=opIn.value+'%';env.look();if(env.changed)env.changed();});
  /* the parts showing inside a loop (client px): the pickable meshes drawn in their ids (a key's id kept for the page's life, so the materials are made once each) */
  const rt=new THREE.WebGLRenderTarget(1,1),KEYS=[],KI=new Map(),IDM=new Map(),CLIP=new WeakMap();let clipN=0;
  function idMat(i,cp){const c=cp&&cp.length?(CLIP.get(cp)||(CLIP.set(cp,++clipN),clipN)):0,k=i+':'+c;let m=IDM.get(k);   /* the mesh's own section planes, and both sides, so a cut part shows its cut */
    if(!m){m=new THREE.MeshBasicMaterial({color:i,side:THREE.DoubleSide,toneMapped:false});if(c)m.clippingPlanes=cp;IDM.set(k,m);}return m;}
  function idsIn(pts){const rc=cv.getBoundingClientRect(),W=cv.width,H=cv.height,sx=W/rc.width,sy=H/rc.height;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
    const P=pts.map(p=>{const x=(p.x-rc.left)*sx,y=(p.y-rc.top)*sy;x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);return[x,y];});
    x0=Math.max(0,Math.floor(x0));y0=Math.max(0,Math.floor(y0));x1=Math.min(W,Math.ceil(x1));y1=Math.min(H,Math.ceil(y1));const w=x1-x0,h=y1-y0;if(w<1||h<1)return[];
    const mc=document.createElement('canvas');mc.width=w;mc.height=h;const g=mc.getContext('2d');g.beginPath();P.forEach(([x,y],i)=>i?g.lineTo(x-x0,y-y0):g.moveTo(x-x0,y-y0));g.closePath();g.fill();const msk=g.getImageData(0,0,w,h).data;
    if(rt.width!==W||rt.height!==H)rt.setSize(W,H);const sw=[];
    for(const m of env.meshes){if(!env.pickable(m))continue;const k=m.userData.pk||m.userData.part;if(!k)continue;let i=KI.get(k);if(i==null){KEYS.push(k);KI.set(k,i=KEYS.length);}
      sw.push([m,m.material,m.layers.mask]);m.material=idMat(i,m.material.clippingPlanes);m.layers.set(LAY);}
    const bg=scene.background,fog=scene.fog,cm=cam.layers.mask,au=r.shadowMap.autoUpdate,cc=r.getClearColor(new THREE.Color()),ca=r.getClearAlpha(),tg=r.getRenderTarget(),buf=new Uint8Array(w*h*4);
    try{scene.background=null;scene.fog=null;cam.layers.set(LAY);r.shadowMap.autoUpdate=false;r.setRenderTarget(rt);r.setClearColor(0,0);r.clear();r.render(scene,cam);r.readRenderTargetPixels(rt,x0,H-y1,w,h,buf);}
    finally{r.setRenderTarget(tg);r.setClearColor(cc,ca);r.shadowMap.autoUpdate=au;cam.layers.mask=cm;scene.background=bg;scene.fog=fog;for(const[m,mat,lm]of sw){m.material=mat;m.layers.mask=lm;}}
    const out=new Set();for(let y=0;y<h;y++){const ry=(h-1-y)*w;for(let x=0;x<w;x++){if(msk[(y*w+x)*4+3]<128)continue;const j=(ry+x)*4,id=buf[j]<<16|buf[j+1]<<8|buf[j+2];if(id&&KEYS[id-1])out.add(KEYS[id-1]);}}   /* the target's rows run upward */
    return[...out];}
  /* the lasso: Alt-drag, or one drag after Lasso; a second finger lets it go to the host (a pinch) */
  const sr=()=>stage.getBoundingClientRect(),draw=()=>{const s=sr();pg.setAttribute('points',las.pts.map(p=>(p.x-s.left).toFixed(1)+','+(p.y-s.top).toFixed(1)).join(' '));};
  const stop=()=>{las=null;svg.classList.remove('on');pg.setAttribute('points','');};
  function down(e){if(las){stop();return false;}if(e.button!==0||!(e.altKey||arm))return false;e.preventDefault();try{cv.setPointerCapture(e.pointerId);}catch(_){}
    las={id:e.pointerId,pts:[{x:e.clientX,y:e.clientY}],add:arm||(MAC?e.metaKey:e.ctrlKey||e.metaKey)};svg.classList.add('on');draw();return true;}
  function move(e){if(!las||e.pointerId!==las.id)return false;const q=las.pts[las.pts.length-1];if(Math.hypot(e.clientX-q.x,e.clientY-q.y)>=2){las.pts.push({x:e.clientX,y:e.clientY});draw();}return true;}
  function up(e){if(!las||e.pointerId!==las.id)return false;const L=las;stop();if(e.type!=='pointerup'||L.pts.length<3)return true;arm=false;set(idsIn(L.pts),L.add);return true;}
  /* a click: with Ctrl (⌘ on a Mac, where Ctrl-click is the right click) or Select on, the part or piece it picks joins the selection or leaves it */
  function tap(e){if(!(mode||(MAC?e.metaKey:e.ctrlKey||e.metaKey)))return false;const k=env.hitKey(e);if(k){if(sel.has(k))sel.delete(k);else sel.add(k);changed();}return true;}
  const has=m=>sel.size>0&&(sel.has(m.userData.pk)||sel.has(m.userData.part));
  const targets=k=>sel.size>1&&sel.has(k)?[...sel]:[k];   /* the right-click menu opened on a selected part: the whole selection */
  const drop=K=>{for(const k of K)sel.delete(k);sync();};
  function esc(){if(las)stop();else if(sel.size||mode||arm){sel.clear();mode=arm=false;changed();}}
  sync();if(/[?&]qa\b/.test(location.search))window.__sel={keys:()=>[...sel],set,idsIn};
  return{has,targets,drop,sync,down,move,up,tap,busy:()=>!!las,esc};}
 return{bind,COL};})();
