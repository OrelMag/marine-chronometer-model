/* essay.js: 'The Marine Chronometer', the essay shared by both models, on a page of its own (../index.html; until 21 October 2026 the Hamilton's Essay tab): how the
   chronometer keeps time at sea, one idea at a time. Its 3D figures and its dial are the Wempe Einheits-Chronometer's, built here by the Wempe model's own scripts
   (../wempe/js, ../shared/kit.js; the owner's choice, 21 October 2026): its dial and hands, balance and hairspring, fusee, chain and barrel, maintaining work, train,
   escapement and box. Its text follows the Hamilton Model 21 where it speaks of it, and quotes the Model 21's figures from the Hamilton's page: js/hamdata.js (HAMDATA,
   written by ../chronometer-working-model/tools/essay_hamdata.py), the spans data-ham="…"; the Wempe's figures are the spans data-live="…", worked out here (fillLive)
   from WESC, WPHYS, WD and the built movement. The Hamilton's movement.js can't load beside the Wempe's (both declare ESC), so the essay draws no Hamilton part but the
   Model 21's balance in Heat, simplified as before.
   One IIFE; the page sees only ESSAY. A figure is built the first time it comes near the view, with the fonts loaded (the dial and the canvases letter in them) and,
   for those that show the movement, once it is built (after the page's first frame). Figures are drawn only when something in them changed.
   The 3D figures share one WebGL renderer off screen: each is rendered into a corner of its canvas and copied onto its own 2D canvas in the same task, so the page has
   one WebGL context. The movement is built once and lent to each figure as it renders (lend: put in the figure's scene, only the parts it shows visible, posed by the
   movement's own update(s), its colours swapped and put back), so every figure shows the model's own parts in the model's own motion. */
"use strict";
const ESSAY=(()=>{
  const root=document.getElementById('essay');
  if(!root)return{on:()=>false,section:()=>'',model:()=>null};
  const q=(s,r=root)=>r.querySelector(s),qa=(s,r=root)=>[...r.querySelectorAll(s)];
  const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bar=q('.e-bar'),prog=q('.e-prog');
  let shown=false,model=null,sec='',raf=0,last=0,io=null,fontsOK=false;
  const sget=k=>{try{return sessionStorage.getItem(k);}catch(_){return null;}},sset=(k,v)=>{try{sessionStorage.setItem(k,v);}catch(_){}};
  /* the fonts the canvases letter in: the dial is drawn once and kept, so it waits for them */
  Promise.race([Promise.all(['600 10px Spectral','400 10px Spectral','500 10px "Instrument Sans"','600 10px "Instrument Sans"'].map(f=>document.fonts.load(f))),new Promise(r=>setTimeout(r,2500))])
    .catch(()=>{}).then(()=>{fontsOK=true;FIGS.forEach(f=>{if(f.visible)build(f);});});

  /* ---------- colours: the page's tokens, read again when the theme changes ---------- */
  const PAL={};
  function readPal(){const s=getComputedStyle(root);for(const k of['ink','muted','brass','blue','red','rule','paper','bg','steel','copper'])PAL[k]=s.getPropertyValue('--'+k).trim();FIGS.forEach(f=>f.dirty=true);}
  new MutationObserver(()=>{if(shown)readPal();}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{if(shown)readPal();});

  /* ---------- figures ---------- */
  const FIGS=[];
  /* a figure: its stage's id, init(f) returning tick(dt) (called each frame while it is near the view; it draws when f.dirty or when it moves), and what it needs: '3d', or 'model' */
  function fig(id,init,need){const el=document.getElementById(id);if(!el)return;const f={el,init,need,tick:null,visible:false,dirty:true,fail:false};el._fig=f;FIGS.push(f);if(need)el.style.minHeight='200px';}
  function build(f){if(f.tick||f.fail||!fontsOK)return;
    if(f.need&&typeof THREE==='undefined'){f.fail=true;f.el.innerHTML='<div class="e-fallback">The 3D figures need a script that didn’t load. Reload the page to try again.</div>';return;}
    if(f.need==='model'&&!model){waitNote(f.el,true);return;}
    waitNote(f.el,false);try{f.tick=f.init(f)||(()=>{});f.dirty=true;f.el.style.minHeight='';}catch(e){f.fail=true;console.error(e);}}
  function waitNote(el,on){let w=el.querySelector('.e-wait');if(on&&!w){w=document.createElement('div');w.className='e-wait';w.textContent='The model is being assembled…';el.appendChild(w);}else if(!on&&w)w.remove();}
  function watch(){if(io)return;io=new IntersectionObserver(es=>{for(const e of es){const f=e.target._fig;if(!f)continue;f.visible=e.isIntersecting;if(f.visible){build(f);f.dirty=true;}}},{root,rootMargin:'300px 0px'});FIGS.forEach(f=>io.observe(f.el));}
  function frame(now){raf=0;if(!shown)return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;
    for(const f of FIGS)if(f.visible&&f.tick){try{f.tick(dt);}catch(e){console.error(e);f.tick=null;f.fail=true;}}
    raf=requestAnimationFrame(frame);}
  /* controls */
  const range=(inp,fn)=>{const out=inp.parentElement.querySelector('output'),h=()=>{const t=fn(parseFloat(inp.value));if(out&&t!=null)out.textContent=t;};inp.addEventListener('input',h);h();return h;};
  const play=(btn,get,set)=>{const up=()=>{btn.textContent=get()?'Pause':'Play';};btn.addEventListener('click',()=>{set(!get());up();});up();return up;};
  const seg=(el,fn)=>{const bs=qa('button',el);bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));fn(b.dataset.v);}));};
  const figOf=el=>el.closest('figure');

  /* ---------- 2D canvases and charts ---------- */
  function c2d(st,f,aspect){const cv=st.querySelector('canvas'),o={cv,x:cv.getContext('2d'),w:1,h:1};
    const rs=()=>{const w=st.clientWidth;if(!w)return;const h=Math.round(w*(typeof aspect==='function'?aspect(w):aspect)),d=Math.min(devicePixelRatio||1,2),W=Math.round(w*d),H=Math.round(h*d);
      cv.style.height=h+'px';if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;}o.x.setTransform(d,0,0,d,0,0);o.w=w;o.h=h;f.dirty=true;};
    new ResizeObserver(rs).observe(st);rs();return o;}
  /* a line chart: x0..x1 by y0..y1, ticks xt and yt (formatted by xf, yf), axis names xl and yl, series [{f, color, label at lx, dash}], a dashed cursor at x,
     marks [{x, y, color}], bands [{x0, x1, y0, y1, color, label}] */
  function chart(C,o){const{x:ctx,w,h}=C;ctx.clearRect(0,0,w,h);
    const L=46,R=16,T=16,B=36,pw=w-L-R,ph=h-T-B,X=x=>L+(x-o.x0)/(o.x1-o.x0)*pw,Y=y=>T+(1-(y-o.y0)/(o.y1-o.y0))*ph;
    ctx.font='12px "Instrument Sans",system-ui,sans-serif';ctx.lineWidth=1;
    for(const b of o.bands||[]){ctx.fillStyle=b.color;ctx.globalAlpha=0.16;ctx.fillRect(X(b.x0),Y(b.y1),X(b.x1)-X(b.x0),Y(b.y0)-Y(b.y1));ctx.globalAlpha=1;
      if(b.label){ctx.fillStyle=b.color;ctx.textAlign='center';ctx.textBaseline='bottom';ctx.fillText(b.label,(X(b.x0)+X(b.x1))/2,Y(b.y1)-3);}}
    ctx.strokeStyle=PAL.rule;ctx.fillStyle=PAL.muted;ctx.textAlign='center';ctx.textBaseline='top';
    for(const x of o.xt){ctx.beginPath();ctx.moveTo(X(x),T);ctx.lineTo(X(x),T+ph);ctx.stroke();ctx.fillText(o.xf?o.xf(x):x,X(x),T+ph+5);}
    ctx.textAlign='right';ctx.textBaseline='middle';
    for(const y of o.yt){ctx.beginPath();ctx.moveTo(L,Y(y));ctx.lineTo(L+pw,Y(y));ctx.stroke();ctx.fillText(o.yf?o.yf(y):y,L-6,Y(y));}
    if(o.y0<0&&o.y1>0){ctx.strokeStyle=PAL.muted;ctx.beginPath();ctx.moveTo(L,Y(0));ctx.lineTo(L+pw,Y(0));ctx.stroke();}
    ctx.textAlign='center';ctx.textBaseline='bottom';ctx.fillText(o.xl,L+pw/2,h-1);ctx.textAlign='left';ctx.textBaseline='top';ctx.fillText(o.yl,L+4,2);
    ctx.save();ctx.beginPath();ctx.rect(L,T,pw,ph);ctx.clip();
    for(const s of o.series){ctx.strokeStyle=s.color;ctx.lineWidth=s.width||2.2;ctx.setLineDash(s.dash||[]);ctx.beginPath();
      for(let i=0;i<=240;i++){const x=o.x0+(o.x1-o.x0)*i/240,y=s.f(x);i?ctx.lineTo(X(x),Y(y)):ctx.moveTo(X(x),Y(y));}ctx.stroke();}
    ctx.setLineDash([]);
    if(o.cursor!=null){ctx.strokeStyle=PAL.muted;ctx.lineWidth=1;ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(X(o.cursor),T);ctx.lineTo(X(o.cursor),T+ph);ctx.stroke();ctx.setLineDash([]);}
    for(const m of o.marks||[]){ctx.fillStyle=m.color;ctx.strokeStyle=PAL.paper;ctx.lineWidth=2;ctx.beginPath();ctx.arc(X(m.x),Y(clamp(m.y,o.y0,o.y1)),5,0,TAU);ctx.fill();ctx.stroke();}
    ctx.restore();ctx.textBaseline='middle';
    for(const s of o.series){if(!s.label)continue;ctx.fillStyle=s.color;ctx.textAlign=s.la||'left';ctx.fillText(s.label,X(s.lx)+(s.dx||0),Y(clamp(s.f(s.lx),o.y0,o.y1))+(s.dy??-12));}
    return{X,Y};}

  /* ---------- 3D: one renderer for every figure, its figures drawn with the models' Edges (makeInk's lines, core.js) unless the model the reader came from had them off
       (its Essay tab's link then carries ?edges=0) ---------- */
  const EDGES=!/[?&]edges=0\b/.test(location.search);
  let G=null;
  function gl(){if(G)return G;const cv=document.createElement('canvas'),r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
    r.setPixelRatio(1);r.outputEncoding=THREE.sRGBEncoding;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.05;r.setClearColor(0x000000,0);r.setScissorTest(true);
    G={r,cv,w:1,h:1,env:envTex(r),M:mats(),scenes:new Set(),ink:null,bs:new THREE.Vector2()};
    /* a lost context comes back without the environment map that lights the metals (as the model's, app.js) */
    cv.addEventListener('webglcontextlost',e=>e.preventDefault());cv.addEventListener('webglcontextrestored',()=>{G.env=envTex(r);G.scenes.forEach(s=>s.environment=G.env);FIGS.forEach(f=>f.dirty=true);});
    return G;}
  class View3D{
    constructor(st,f,o){this.st=st;this.f=f;this.cv=st.querySelector('canvas');this.x=this.cv.getContext('2d');const a0=o.aspect;this.ca=0;this.fit=o.fit!==false;this.box=null;   /* fit: the camera framed on what shows (frame()); ca: its height over its width, which sets a narrow figure's aspect */
      this.aspect=w=>w<520&&this.ca?clamp(this.ca*1.12+0.04,0.5,1.15):typeof a0==='function'?a0(w):a0;const g=gl();
      const s=this.scene=new THREE.Scene();s.environment=g.env;g.scenes.add(s);s.add(new THREE.HemisphereLight(0xffffff,0x3a3a3a,0.35));const dl=new THREE.DirectionalLight(0xffffff,1);dl.position.set(3,6,4);s.add(dl);
      this.cam=new THREE.PerspectiveCamera(o.fov||30,1,o.near||1,o.far||4000);this.yaw=o.yaw??0.6;this.pitch=o.pitch??0.5;this.dist=o.dist??100;this.target=new THREE.Vector3(...(o.target||[0,0,0]));
      this.minP=o.minPitch??-1.2;this.maxP=o.maxPitch??1.5;this.labels=[];this.lb=st.querySelector('.e-labels');
      let pid=null,lx=0,ly=0;const cv=this.cv;
      cv.addEventListener('pointerdown',e=>{pid=e.pointerId;lx=e.clientX;ly=e.clientY;try{cv.setPointerCapture(pid);}catch(_){}st.classList.add('grab');});
      cv.addEventListener('pointermove',e=>{if(e.pointerId!==pid)return;const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;this.yaw-=dx*0.009;this.pitch=clamp(this.pitch+dy*0.009,this.minP,this.maxP);f.dirty=true;});
      const up=e=>{if(e.pointerId===pid){pid=null;st.classList.remove('grab');}};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
      new ResizeObserver(()=>this.resize()).observe(st);this.resize();if(/[?&]qa\b/.test(location.search))(window.__views=window.__views||{})[st.id]=this;}   /* ?qa: the views, for the tools */
    resize(){const w=this.st.clientWidth;if(!w)return;const h=Math.round(w*(typeof this.aspect==='function'?this.aspect(w):this.aspect)),d=Math.min(devicePixelRatio||1,2);
      if(w===this.w&&h===this.h&&d===this.d)return;this.w=w;this.h=h;this.d=d;this.cv.style.height=h+'px';this.cv.width=Math.round(w*d);this.cv.height=Math.round(h*d);this.cam.aspect=w/h;this.cam.updateProjectionMatrix();this.f.dirty=true;}
    label(t,sub,pos){const el=document.createElement('div');el.className='e-lbl';el.innerHTML='<span>'+t+(sub?'<i>'+sub+'</i>':'')+'</span>';this.lb.appendChild(el);const L={el,pos,show:true};this.labels.push(L);return L;}
    /* the box round what shows (its meshes, their parents shown, the floor's shadow and instanced pieces left out, and the labels' points), once, or again when refit is set */
    shown(){const b=new THREE.Box3(),v=new THREE.Vector3(),P=[];this.scene.updateMatrixWorld(true);
      const vis=o=>{for(let p=o;p;p=p.parent)if(!p.visible)return false;return true;},ms=[];let n=0;
      this.scene.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||o.userData.decal||o.material.depthWrite===false||!vis(o))return;ms.push(o);n+=o.geometry.attributes.position.count;});
      const k=Math.max(1,Math.floor(n/6000));   /* about 6,000 of their vertices, so a round part frames by its outline, not its box's corners */
      for(const o of ms){const a=o.geometry.attributes.position;for(let i=0;i<a.count;i+=k){v.fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld);P.push(v.clone());b.expandByPoint(v);}}
      for(const L of this.labels)if(L.show){L.pos(v);P.push(v.clone());b.expandByPoint(v);}b.pts=P;return b;}
    /* the camera framed on the box for the view's direction: the target its middle, the distance the least that keeps each corner inside the frame with a margin;
       a narrow figure (a phone) takes the height the box asks for, so the parts fill it at any width */
    frame(){if(!this.box||this.refit){this.refit=false;this.box=this.shown();}if(this.box.isEmpty())return this.dist;const b=this.box,cn=b.getCenter(new THREE.Vector3()),c=Math.cos(this.pitch);
      const dir=new THREE.Vector3(c*Math.sin(this.yaw),Math.sin(this.pitch),c*Math.cos(this.yaw)),rt=new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0),dir).normalize(),up=new THREE.Vector3().crossVectors(dir,rt);
      const tv=Math.tan(this.cam.fov*Math.PI/360),th=tv*this.cam.aspect,M=1.1,q=new THREE.Vector3();let d=0,X=0,Y=0;
      let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of b.pts){q.copy(p).sub(cn);const x=q.dot(rt),y=q.dot(up);x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
      cn.addScaledVector(rt,(x0+x1)/2).addScaledVector(up,(y0+y1)/2);   /* the middle of what shows as seen, not of its box */
      for(const p of b.pts){q.copy(p).sub(cn);const x=Math.abs(q.dot(rt)),y=Math.abs(q.dot(up)),z=q.dot(dir);X=Math.max(X,x);Y=Math.max(Y,y);d=Math.max(d,z+M*x/th,z+M*y/tv);}
      this.target.copy(cn);const ca=Y/X;if(Math.abs(ca-this.ca)>0.02&&!this.caSet){this.ca=ca;this.caSet=true;this.resize();return this.frame();}return d;}
    render(){const c=Math.cos(this.pitch),cam=this.cam,g=G,r=g.r,W=this.cv.width,H=this.cv.height,D=this.fit?this.frame():this.dist*clamp(this.h/this.w/0.62,1,1.7);   /* fit: framed on what shows; else a taller figure (a phone) steps back */
      cam.position.set(this.target.x+D*c*Math.sin(this.yaw),this.target.y+D*Math.sin(this.pitch),this.target.z+D*c*Math.cos(this.yaw));cam.lookAt(this.target);
      if(g.w<W||g.h<H){g.w=Math.max(g.w,W);g.h=Math.max(g.h,H);r.setSize(g.w,g.h,false);}   /* the buffer only grows: each figure uses its bottom-left corner */
      r.setViewport(0,0,W,H);r.setScissor(0,0,W,H);
      if(EDGES){const ms=[],hd=[];this.scene.traverse(o=>{if(o.isMesh)(o.userData.decal||o.userData.surface||o.material.depthWrite===false?hd:ms).push(o);});   /* the floor's shadow and the engravings left out, as the models leave them */
        g.ink=g.ink||makeInk(r);g.bs.set(W,H);r.inkBS=g.bs;r.inkPR=this.d;g.ink.lines(this.scene,cam,ms,hd);}
      else r.render(this.scene,cam);this.x.clearRect(0,0,W,H);this.x.drawImage(g.cv,0,g.h-H,W,H,0,0,W,H);
      /* the labels: each name right of its point, or left of it past the right edge or where it would cover a name or a point already placed; failing both, moved down clear */
      const v=new THREE.Vector3(),R=[],hit=(a)=>R.some(b=>a[0]<b[2]&&b[0]<a[2]&&a[1]<b[3]&&b[1]<a[3]),pts=[];
      for(const L of this.labels){if(!L.show)continue;L.pos(v);v.project(cam);L.sx=(v.x+1)/2*this.w;L.sy=(1-v.y)/2*this.h;L.vz=v.z;pts.push([L.sx-4,L.sy-4,L.sx+4,L.sy+4]);}
      let yb=0;if(this.box&&this.box.pts)for(const p of this.box.pts){v.copy(p).project(cam);yb=Math.max(yb,(1-v.y)/2*this.h);}   /* the foot of what shows: a label set below (L.below) goes under it, on a line to its point */
      for(const L of this.labels){if(!L.show){L.el.style.opacity=0;continue;}const x=L.sx,y=L.sy,sp=L.el.firstChild;if(!L.ow){L.ow=sp.offsetWidth;L.oh=sp.offsetHeight;}
        const box=lf=>lf?[x-9-L.ow,y-7,x-9,y-7+L.oh]:[x+9,y-7,x+9+L.ow,y-7+L.oh],own=[x-4,y-4,x+4,y+4],clash=a=>hit(a)||pts.some(p=>p[0]!==own[0]&&a[0]<p[2]&&p[0]<a[2]&&a[1]<p[3]&&p[1]<a[3]);
        let lf=L.left&&x-9-L.ow>=2||x+9+L.ow>this.w-2&&x-9-L.ow>2;   /* a name set left (L.left) goes right where the left has no room */if(clash(box(lf))&&!clash(box(!lf))&&(lf?x+9+L.ow<=this.w-2:x-9-L.ow>=2))lf=!lf;
        let dy=L.below?Math.max(0,Math.min(this.h-L.oh+4,yb+14)-y):0,bx=box(lf);bx=[bx[0],bx[1]+dy,bx[2],bx[3]+dy];while(clash(bx)&&dy<160){dy+=4;bx=[bx[0],bx[1]+4,bx[2],bx[3]+4];}R.push(bx);
        L.el.classList.toggle('e-l',lf);sp.style.transform=dy?`translateY(${dy}px)`:'';
        if(L.below){if(!L.ln){L.ln=document.createElement('b');L.ln.className='e-ln';L.el.appendChild(L.ln);}L.ln.style.height=Math.max(0,dy-4)+'px';}
        L.el.style.opacity=(L.vz<1&&x>-20&&x<this.w+20)?1:0;L.el.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;}}
  }
  const at=(o,x,y,z)=>v=>{v.set(x,y,z);o.localToWorld(v);};

  /* ---------- the dial: the Wempe's (WDIAL.face, Wempe 3955's printing) with its hands (WDIAL.HANDS: half-widths along each, from their sheets), as the Wempe page's
       essay draws it (../wempe/js/essay.js) ---------- */
  const D=Math.PI/180,f1=(v,n=1)=>v.toFixed(n),sgS=(v,n=1)=>(v<0?'−':'')+Math.abs(v).toFixed(n),SANS='"Instrument Sans",system-ui,sans-serif';
  /* a label with a halo of the figure's paper round it, so a line it crosses doesn't cut it */
  function halo(ctx,t,x,y,col){ctx.save();ctx.lineWidth=4;ctx.lineJoin='round';ctx.strokeStyle=PAL.paper;ctx.strokeText(t,x,y);ctx.restore();ctx.fillStyle=col;ctx.fillText(t,x,y);}
  let DIAL=null;const dial=()=>DIAL||(DIAL=WDIAL.face(1));
  const hwAt=(t,r)=>{if(r<=t[0][0])return t[0][1];for(let i=1;i<t.length;i++)if(r<=t[i][0]){const[a,p]=t[i-1],[b,v]=t[i];return p+(v-p)*(r-a)/(b-a);}return t[t.length-1][1];};
  const blade=(hw,r0,L,dir=-1)=>{const R=[];for(let r=r0;r<L;r+=0.25)R.push(r);R.push(L);return[...R.map(r=>[hwAt(hw,r),dir*r]),...R.reverse().map(r=>[-hwAt(hw,r),dir*r])];};   /* a hand's outline up from its arbor (-y), r0 to its tip; dir 1 its tail */
  let HANDS=null;
  const hands=()=>{if(HANDS)return HANDS;const H=WDIAL.HANDS;
    return HANDS={min:{p:[blade(H.MIN.hw,H.MIN.rf-0.2,H.MIN.L)],boss:H.MIN.rf,col:'#c39a46'},hour:{p:[blade(H.HOUR.hw,H.HOUR.rf1-0.2,H.HOUR.L)],boss:H.HOUR.rf,col:'#c39a46'},
      ud:{p:[blade(H.UDH.hw,H.UDH.rf-0.2,10.2)],boss:H.UDH.rf,col:'#1d2c74'},sec:{p:[blade(H.SEC.hwP,H.SEC.rb-0.2,19.5),blade(H.SEC.hwT,H.SEC.rb-0.2,10,1)],boss:H.SEC.rb,col:'#1d2c74'}};};
  function drawHand(x,h,cx,cy,a,k){x.save();x.translate(cx,cy);x.rotate(a);x.scale(k,k);x.fillStyle=h.col;x.shadowColor='rgba(0,0,0,.3)';x.shadowBlur=Math.max(1,k*0.6);x.shadowOffsetY=Math.max(1,k*0.25);
    x.beginPath();for(const p of h.p){p.forEach(([u,v],i)=>i?x.lineTo(u,v):x.moveTo(u,v));x.closePath();}x.moveTo(h.boss,0);x.arc(0,0,h.boss,0,TAU);x.fill('nonzero');x.restore();}
  /* the up-and-down hand h hours after winding: 22.5° right of 12 fully wound, a tenth of a turn for each of the fusee's turns (dial.js's update); its sub-dial 23 mm above the centre */
  const UDY=-23,udA=h=>(22.5+36*clamp(h,0,HRUN())/WPHYS.HPT)*D;
  function paintDial(x,S,t,h){const c=S/2,k=c/WDIAL.DR,H=hands(),ts=Math.floor(t*2)/2;x.clearRect(0,0,S,S);x.drawImage(dial(),0,0,S,S);
    drawHand(x,H.ud,c,c+UDY*k,udA(h),k);drawHand(x,H.sec,c,c+23*k,((ts/60)%1)*TAU,k);
    drawHand(x,H.hour,c,c,((t/43200)%1)*TAU,k);drawHand(x,H.min,c,c,((t/3600)%1)*TAU,k);}
  /* the time the essay's dial keeps: Greenwich time by the reader's clock, the chronometer wound every day at 08:00 GMT (the routine of Winding, below), so h is the hours since */
  const WOUND=8,nowT=()=>Date.now()/1000,nowH=()=>(((nowT()/3600-WOUND)%24)+24)%24,HRUN=()=>model?model.HRUN:55.9;

  /* ---------- hero: the Wempe's dial, keeping Greenwich time ---------- */
  fig('eHeroSt',f=>{const cv=q('#eHero'),x=cv.getContext('2d'),cap=q('#eHeroCap');let S=0,lk=-1,lh=-1;
    const rs=()=>{const w=cv.clientWidth,d=Math.min(devicePixelRatio||1,2);if(!w)return;S=Math.round(w*d);if(cv.width!==S){cv.width=cv.height=S;f.dirty=true;}};new ResizeObserver(rs).observe(cv);rs();
    return()=>{const t=nowT(),h=nowH(),k=Math.floor(t*2);if(k===lk&&Math.abs(h-lh)<0.02&&!f.dirty)return;lk=k;lh=h;f.dirty=false;paintDial(x,S,t,h);
      const tt=((t%86400)+86400)%86400,hm=[Math.floor(tt/3600),Math.floor(tt%3600/60),Math.floor(tt%60)].map(v=>String(v).padStart(2,'0')).join(':');
      cap.textContent=`The Wempe’s dial: ${hm} Greenwich time, ${h.toFixed(1)} h since its winding at 0${WOUND}:00`;};});

  /* ---------- the Wempe's movement, built once (model(), after the page's first frame) and lent to each 3D figure as it renders ----------
     lend(V, at, keep, s, o): the movement put in the group at (in the figure's scene), its parts in the set keep shown and the rest hidden, posed by its own update(s)
     ({E, th, lift, psDef, n, winding, ms}: the escape wheel's teeth, the balance's angle, the detent's and gold spring's turns, the fusee's turns from full wind, winding,
     the maintaining spring's lead), then o.pose() (a change for this figure alone, returning what undoes it) and o.paint(mesh) (a material in place of the mesh's, or
     nothing); rendered; and everything put back as it was, for the next figure */
  const S0={E:0,th:0,lift:0,psDef:0,n:0,winding:false};
  function lend(V,at,keep,s,o={}){const mv=model.mv,P=mv.userData.parts;if(mv.parent!==at)at.add(mv);for(const k in P)P[k].visible=keep.has(k);
    mv.userData.update({...S0,...s});const undo=o.pose?o.pose():null,sw=[];
    if(o.paint)for(const k of keep)P[k].traverse(m=>{if(m.isMesh){const t=o.paint(m,k);if(t){sw.push([m,m.material]);m.material=t;}}});
    V.render();for(const[m,t]of sw)m.material=t;if(undo)undo();}
  /* a material's copy tinted toward a colour (eMaint: rose carries the drive, teal holds), or see-through */
  const TINT=new Map(),tint=(m0,c,gh)=>{const k=m0.uuid+c+(gh?'g':'');let t=TINT.get(k);if(!t){t=m0.clone();if(c){t.color=m0.color.clone().lerp(sc(c),0.8);if(t.emissive){t.emissive=sc(c);t.emissiveIntensity=0.25;}
    if('metalness'in t){t.metalness=Math.min(m0.metalness,0.2);t.roughness=Math.max(m0.roughness,0.5);}}if(gh){t.transparent=true;t.opacity=0.45;t.depthWrite=false;}TINT.set(k,t);}return t;};
  /* a group's copy, sharing the model's geometry and materials (the Heat figure's balance, whose rim it bends): what is hidden left out */
  const copy=o=>{const c=o.isMesh?new THREE.Mesh(o.geometry,o.material):new THREE.Group();c.position.copy(o.position);c.quaternion.copy(o.quaternion);c.scale.copy(o.scale);c.userData.hn=o.userData.hn;
    for(const k of o.children)if(k.visible&&!k.isLight)c.add(copy(k));return c;};

  /* ---------- time is a position: the Earth from above the North Pole at the ship's local noon ---------- */
  fig('eLon',f=>{const st=f.el,P=figOf(st),C=c2d(st,f,w=>w<520?0.8:0.52);let lam=-40;
    const fmt=h=>{h=((h%24)+24)%24;const H=Math.floor(h),m=Math.round((h-H)*60);return String(m===60?H+1:H).padStart(2,'0')+':'+String(m%60).padStart(2,'0');};
    range(q('input',P),v=>{lam=v;f.dirty=true;const g=12-v/15;
      q('.e-ro',P).innerHTML=`Local noon at the ship. The chronometer, still on Greenwich time, reads <b>${fmt(g)}</b>. ${Math.abs(g-12)<1e-9?'No difference: the ship is on the Greenwich meridian.':`That is ${Math.abs(v/15).toFixed(2).replace(/\.?0+$/,'')} h ${v<0?'after':'before'} noon, and every hour is 15°, so the ship is at <b>${Math.abs(v)}° ${v<0?'W':'E'}</b>.`}`;
      return Math.abs(v)+'° '+(v<0?'W':v>0?'E':'');});
    return()=>{if(!f.dirty)return;f.dirty=false;const{x:ctx,w,h}=C;ctx.clearRect(0,0,w,h);const cx=w*0.42,cy=h/2,R=Math.min(w*0.3,h*0.4);
      ctx.strokeStyle=PAL.brass;ctx.lineWidth=1.5;ctx.globalAlpha=0.5;for(let i=-3;i<=3;i++){const y=cy+i*R*0.3;ctx.beginPath();ctx.moveTo(w*0.8,y);ctx.lineTo(w-8,y);ctx.stroke();}
      ctx.globalAlpha=1;ctx.fillStyle=PAL.brass;ctx.beginPath();ctx.arc(w-4,cy,R*0.35,0,TAU);ctx.fill();
      ctx.fillStyle=PAL.muted;ctx.font='13px "Instrument Sans",sans-serif';ctx.textAlign='right';ctx.fillText('sunlight',w-10,cy-R*0.95);
      ctx.fillStyle=PAL.bg;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.fill();ctx.fillStyle=PAL.blue;ctx.globalAlpha=0.16;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.fill();
      ctx.globalAlpha=0.35;ctx.fillStyle=PAL.ink;ctx.beginPath();ctx.arc(cx,cy,R,Math.PI/2,Math.PI*1.5);ctx.fill();ctx.globalAlpha=1;
      ctx.strokeStyle=PAL.ink;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.stroke();
      const Pt=(Lg,r)=>{const a=(Lg-lam)*D2R;return[cx+r*Math.cos(a),cy-r*Math.sin(a)];};
      ctx.strokeStyle=PAL.muted;ctx.lineWidth=0.6;for(let Lg=-165;Lg<=180;Lg+=15){const[x,y]=Pt(Lg,R);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.stroke();}
      for(const k of[0.33,0.66]){ctx.beginPath();ctx.arc(cx,cy,R*k,0,TAU);ctx.stroke();}
      const a1=-lam*D2R;ctx.strokeStyle=PAL.red;ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,R*0.5,-Math.max(0,a1),-Math.min(0,a1));ctx.stroke();
      const[gx,gy]=Pt(0,R*1.02);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(gx,gy);ctx.stroke();
      const[sx,sy]=Pt(lam,R);ctx.strokeStyle=PAL.blue;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(sx,sy);ctx.stroke();
      ctx.fillStyle=PAL.blue;ctx.beginPath();ctx.moveTo(sx+10,sy);ctx.lineTo(sx-6,sy-7);ctx.lineTo(sx-6,sy+7);ctx.closePath();ctx.fill();
      ctx.fillStyle=PAL.ink;ctx.beginPath();ctx.arc(cx,cy,3,0,TAU);ctx.fill();
      ctx.font='13px "Instrument Sans",sans-serif';ctx.textAlign='center';ctx.fillStyle=PAL.red;const[lx,ly]=Pt(0,R+16);ctx.fillText('Greenwich',lx,ly+4);
      ctx.fillStyle=PAL.blue;ctx.fillText('Ship',sx+10,sy-12);ctx.fillStyle=PAL.muted;ctx.fillText('North Pole',cx,cy+18);
      ctx.strokeStyle=PAL.muted;ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(cx,cy,R+26,-2.3,-1.7);ctx.stroke();
      const ex=cx+(R+26)*Math.cos(-2.3),ey=cy+(R+26)*Math.sin(-2.3);ctx.fillStyle=PAL.muted;ctx.beginPath();ctx.moveTo(ex-2,ey-7);ctx.lineTo(ex+6,ey+4);ctx.lineTo(ex-9,ey+3);ctx.closePath();ctx.fill();};});

  /* ---------- a clock's error as a ship's position: 4 s of time are 1' of longitude, a nautical mile at the equator ---------- */
  fig('eErr',f=>{const st=f.el,P=figOf(st),C=c2d(st,f,w=>w<520?0.5:0.3);let rate=2,days=42;const[ri,di]=qa('input',P);
    const upd=()=>{const s=rate*days,nm=s/4;q('.e-ro',P).innerHTML=`Accumulated error <b>${s.toFixed(0)} s</b>, which is <b>${nm.toFixed(1)}′</b> of longitude, <b>${nm.toFixed(1)} nautical miles</b> at the equator. ${nm<=30?'Inside':'Outside'} the Act’s half degree.`;f.dirty=true;};
    range(ri,v=>{rate=v;upd();return v.toFixed(1)+' s/day';});range(di,v=>{days=v;upd();return v+' days';});
    return()=>{if(!f.dirty)return;f.dirty=false;const{x:ctx,w,h}=C;ctx.clearRect(0,0,w,h);const nm=rate*days/4,span=Math.max(45,nm*1.25),cx=w*0.62,k=(w*0.55)/span,y=h*0.5,X=d=>cx-d*k;
      ctx.fillStyle=PAL.blue;ctx.globalAlpha=0.1;ctx.fillRect(0,y-h*0.32,w,h*0.64);ctx.fillStyle=PAL.brass;ctx.globalAlpha=0.2;ctx.fillRect(X(30),y-h*0.32,60*k,h*0.64);ctx.globalAlpha=1;
      ctx.strokeStyle=PAL.muted;ctx.lineWidth=1;ctx.font='12px "Instrument Sans",sans-serif';ctx.fillStyle=PAL.muted;ctx.textAlign='center';const step=span>150?50:span>70?20:10;
      for(let d=-Math.floor(span/step)*step;d<=span;d+=step){const x=X(d);if(x<4||x>w-4)continue;ctx.beginPath();ctx.moveTo(x,y+h*0.32);ctx.lineTo(x,y+h*0.32-6);ctx.stroke();ctx.fillText(Math.abs(d)+'',x,y+h*0.32+14);}
      ctx.textAlign='left';ctx.fillText('nautical miles west →',4,y+h*0.32+14);ctx.textAlign='center';ctx.fillStyle=PAL.brass;ctx.fillText('half a degree',X(0),y-h*0.32+14);
      const ship=(x,col,label,dy)=>{ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x-12,y-4);ctx.lineTo(x+12,y-4);ctx.lineTo(x+8,y+5);ctx.lineTo(x-8,y+5);ctx.closePath();ctx.fill();ctx.fillRect(x-1,y-20,2,16);ctx.beginPath();ctx.moveTo(x+1,y-20);ctx.lineTo(x+10,y-9);ctx.lineTo(x+1,y-9);ctx.fill();ctx.textAlign='center';ctx.fillText(label,x,y+dy);};
      ship(X(0),PAL.ink,'True position',24);
      if(nm>0.3){ctx.strokeStyle=PAL.red;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(X(0),y-26);ctx.lineTo(X(nm),y-26);ctx.stroke();ctx.setLineDash([]);ship(X(nm),PAL.red,'Believed position',-30);}};});

  /* ---------- the Model 21's balance and a plain one, in mm, for Heat beside the Wempe's: 'uncut', the Model 21's as its movement.js builds it, simplified (a
     stainless-steel rim 0.6 wide and 3.5 deep on an Invar arm, its 24 holes 15 deg apart, the standard four pairs of balance screws in holes 3, 5, 9 and 12 of each half, the
     timing weights at the arm's ends and the verniers inside the rim beside them), its radius the Hamilton's (HAMDATA.BAL_R); 'plain', a plain brass rim of radius BR,
     which set(0, grow) enlarges ---------- */
  function balance(M,kind,BR){const g=new THREE.Group(),S=[];
    mesh(g,new THREE.BoxGeometry(2*BR-1,1.1,2.4),kind==='uncut'?M.invar:M.brass);mesh(g,cylY(2.2,1.3,24),M.steel,0,0.2,0);mesh(g,cylY(0.45,15,12),M.steel,0,2.5,0);
    const radial=(a,r0,len,rr,mat)=>{const m=mesh(g,cylY(rr,len,12),mat,(r0+len/2)*Math.cos(a),0,(r0+len/2)*Math.sin(a));m.rotation.set(0,-a,Math.PI/2);return m;};
    if(kind==='uncut'){mesh(g,ringGeo(BR,BR-0.6,3.5),M.steel);const HA=(h,n)=>h*Math.PI+(n-1)*TAU/24;
      for(const h of[0,1])for(const[n,hh]of[[3,2.03],[5,1.24],[9,2.57],[12,1.24]])S.push(radial(HA(h,n),BR,hh,1.55,M.brass));
      for(const h of[0,1]){S.push(radial(HA(h,1),BR+0.55,1.7,1.2,M.steelD));S.push(radial(HA(h,2),BR-0.6-0.6-1.3,1.3,0.65,M.steelD));}
      g.userData.set=()=>{};}
    else{const r=mesh(g,undefined,M.brass);g.userData.set=(c,grow=0)=>{r.geometry.dispose();r.geometry=ringGeo(BR*(1+grow)+0.8,BR*(1+grow)-0.8,2.4);};}
    g.userData.set(0);g.userData.S=S;return g;}
  /* a helical spring with plain ends (the ends straight in to the collet and stud, no terminal curves): its coil's centre drifts sideways as it winds (exaggerated);
     R its radius, H its height (negative: the Wempe's coil rises toward -y), N its turns, th the collet's turn, wire the strip's half thickness */
  function plainSpring(R,H,N,th,wire){const c=new THREE.Curve();c.arcLengthDivisions=1200;const Re=R*N/(N+th/TAU*0.8),rc=R*0.3,rs=R*0.55;
    c.getPoint=(t,v=new THREE.Vector3())=>{let ang,r,y,ox=0;
      if(t<0.04){const s=t/0.04;ang=0;r=rc+(Re-rc)*s;y=0;}else if(t>0.96){const s=(t-0.96)/0.04;ang=TAU*N;r=Re-(Re-rs)*s;y=H;}
      else{const s=(t-0.04)/0.92;ang=TAU*N*s;r=Re;y=H*s;ox=Math.sin(Math.PI*s)*0.45*R*(th/(TAU*0.6));}
      const a=ang+th*(1-ang/(TAU*N));return v.set(r*Math.cos(a)+ox,y,-r*Math.sin(a));};
    return closeGeo(new THREE.TubeGeometry(c,Math.round(N*44),wire,6,false));}
  /* a figure's frame for the movement: turned over (the train side up, as a watchmaker sees it on the bench) or not, and shifted so the point p (movement frame, x z) is at the origin */
  const frameAt=(V,p,over=true)=>{const t=new THREE.Group(),o=new THREE.Group();if(over)t.rotation.x=Math.PI;o.position.set(-p[0],0,-p[1]);t.add(o);V.scene.add(t);return{t,o};};
  /* a box round the movement's pieces (its own frame), the movement taken out of whatever figure has it */
  const boxOf=objs=>{const mv=model.mv,p=mv.parent;if(p)p.remove(mv);mv.updateMatrixWorld(true);const b=new THREE.Box3();for(const o of objs)b.expandByObject(o);if(p)p.add(mv);return b;};
  const meshesOf=(g,hn)=>{const r=[];g.traverse(o=>{if(o.isMesh&&(!hn||hn.includes(o.userData.hn)))r.push(o);});return r;};

  /* ---------- the balance and hairspring: T = 2π√(I/κ). The Wempe's (05 03 01-1, 05 03 02-1), swinging as its escapement keeps it (WPHYS.ESC.A) ---------- */
  fig('eBal',f=>{const st=f.el,P=figOf(st),E=WPHYS.ESC,A=E.A,RE=model.R.esc,PT=model.mv.userData.parts,HL=WESC.HSL,B=WESC.B,keep=new Set(['balance','hairspring','stud','rollers']);
    const bb=boxOf([PT.balance,PT.hairspring]),V=new View3D(st,f,{aspect:w=>w<520?0.9:0.6,yaw:0.55,pitch:0.42,dist:82,target:[0,-(bb.min.y+bb.max.y)/2,0],near:2,far:1000}),{t,o}=frameAt(V,B);
    /* the masses (050301-4, their screws and nuts WN-12) swollen about their own centres by the mass slider */
    const MS=meshesOf(PT.balance,['050301-4','WN-12']).map(m=>{const b=new THREE.Box3().setFromBufferAttribute(m.geometry.attributes.position),c=b.getCenter(new THREE.Vector3()).multiply(m.scale).add(m.position);return{m,c,p:m.position.clone(),s:m.scale.clone()};});
    const rim=meshesOf(PT.balance,['050301-1'])[0],rb=boxOf([rim]),yR=(rb.min.y+rb.max.y)/2,sb=boxOf([PT.hairspring]),Rr=(rb.max.x-rb.min.x)/2;
    V.label('Balance','nickel steel and brass',at(o,B[0]-Rr,yR,B[1]+3)).below=true;V.label('Hairspring','steel, tempered blue',at(o,B[0]-HL.RC-0.6,(sb.min.y+sb.max.y)/2,B[1]));
    let m=1,k=1,ph=0.1,going=!RM,slow=false,own=null;const ins=qa('input[type=range]',P),ro=q('.e-ro',P);
    const upd=()=>{const T=0.5*Math.sqrt(m/k);ro.innerHTML=`Period <b>${T.toFixed(3)} s</b>, or <b>${Math.round(7200/T).toLocaleString('en-US')}</b> vibrations an hour · moment of inertia ${Math.round(WPHYS.SET.I*m).toLocaleString('en-US')} g·mm²`;f.dirty=true;};
    range(ins[0],v=>{m=v;upd();return '×'+v.toFixed(2);});range(ins[1],v=>{k=v;upd();return '×'+v.toFixed(2);});
    q('.slow',P).addEventListener('change',e=>slow=e.target.checked);play(q('.play',P),()=>going,v=>going=v);
    return dt=>{if(going){ph+=dt*(slow?0.2:1)/(0.5*Math.sqrt(m/k));f.dirty=true;}if(!f.dirty)return;f.dirty=false;const th=A*Math.sin(TAU*ph);
      lend(V,o,keep,{th},{pose:()=>{const s=Math.sqrt(m),g0=RE.spring.geometry;
        for(const q2 of MS){q2.m.scale.set(q2.s.x*s,q2.s.y,q2.s.z*s);q2.m.position.set(q2.c.x+(q2.p.x-q2.c.x)*s,q2.p.y,q2.c.z+(q2.p.z-q2.c.z)*s);}
        if(k!==1){own=ribbonGeo(RE.spPath(-th),HL.HB,HL.HT*Math.cbrt(k),own);RE.spring.geometry=own;}
        return()=>{for(const q2 of MS){q2.m.scale.copy(q2.s);q2.m.position.copy(q2.p);}RE.spring.geometry=g0;};}});};},'model');

  /* ---------- the hairspring close up: the Wempe's, its terminal curves as 05 03_7 draws them, or the same coil with plain ends ---------- */
  fig('eSpr',f=>{const st=f.el,P=figOf(st),RE=model.R.esc,PT=model.mv.userData.parts,HL=WESC.HSL,B=WESC.B,keep=new Set(['hairspring','stud']);
    const P0=RE.spPath(0),ys=P0.map(p=>p[1]),y0=P0[0][1],y1=P0[P0.length-1][1],cx=B[0],cz=B[1];
    const V=new View3D(st,f,{aspect:w=>w<520?0.95:0.6,yaw:0.45,pitch:0.78,dist:50,target:[0,-(Math.min(...ys)+Math.max(...ys))/2,0],near:1,far:500}),{t,o}=frameAt(V,B);
    const plain=mesh(o,undefined,RE.spring.material);plain.position.set(cx,y0,cz);
    /* the labels: the upper terminal curve half way along it (from where it leaves the coil to the stud), the collet and the stud at their far ends */
    const cb=boxOf([RE.hsRot]),sb=boxOf([PT.stud]),rr=p=>Math.hypot(p[0],p[2]);   /* the path about the balance's axis (the hairspring's group stands on it) */
    const Q=P0[0][1]<P0[P0.length-1][1]?P0:[...P0].reverse();let iC=0;while(iC<Q.length-1&&rr(Q[iC])<HL.RC-0.4)iC++;const pc=Q[Math.round(iC/2)];   /* the stud's end of the strip, in along its curve to where it joins the coil */
    const Lt=V.label('Terminal curve','',at(o,pc[0]+cx,pc[1],pc[2]+cz));V.label('Collet','turns with the balance',at(o,(cb.min.x+cb.max.x)/2,cb.max.y,cb.max.z)).below=true;   /* its name under the spring, on a line to it, clear of the coils */V.label('Stud','fixed, on the cock',at(o,(sb.min.x+sb.max.x)/2,(sb.min.y+sb.max.y)/2,(sb.min.z+sb.max.z)/2));   /* on the stud itself, the bar 14.6 long tapering to its point (05 03 02-3: the whole part, its upright down to the spring), the cock left out so the spring shows */
    let th=0,term=true;const lim=Math.round(WPHYS.ESC.A/D),inp=q('input[type=range]',P);inp.min=-lim;inp.max=lim;
    range(inp,v=>{th=v*D;f.dirty=true;return v+'°';});seg(q('.seg',P),v=>{term=v==='1';f.dirty=true;});
    return()=>{if(!f.dirty)return;f.dirty=false;plain.visible=!term;if(!term){plain.geometry.dispose();plain.geometry=plainSpring(HL.RC,y1-y0,HL.turns,-th,HL.HT/2);}Lt.show=term;
      lend(V,o,keep,{th},{pose:()=>{RE.spring.visible=term;return()=>{RE.spring.visible=true;};}});};},'model');

  /* ---------- heat: the Wempe's cut bimetallic balance, a plain brass one, and the Model 21's ---------- */
  fig('eTemp',f=>{const st=f.el,P=figOf(st),V=new View3D(st,f,{aspect:w=>w<520?0.8:0.5,yaw:0.3,pitch:1.1,dist:88,target:[0,0,0]}),M=G.M,PT=model.mv.userData.parts;
    /* the Wempe's balance, a copy: its rim (05 03 01-1, nickel steel inside and brass outside) is cut at 90° from the arm, so each quarter hangs from an end of the arm,
       which lies along 12-6 (z); warmer, each quarter's free end curls in (by curl u², u its angle from the arm's end over 90°), the masses on it with it */
    const src=PT.balance.children[0],wb=copy(src),hold=new THREE.Group();wb.position.set(0,0,0);wb.quaternion.identity();hold.add(wb);
    const rim=meshesOf(wb,['050301-1']),rb=new THREE.Box3();rim.forEach(m=>{m.geometry=m.geometry.clone();m.userData.p0=m.geometry.attributes.position.array.slice();rb.expandByObject(m);});
    hold.position.y=-(rb.min.y+rb.max.y)/2;const BR=(rb.max.x-rb.min.x)/2,RIN=BR-1.2,uOf=a=>{const d=Math.min(Math.abs(a-Math.PI/2),Math.abs(a+Math.PI/2));return Math.min(1,d/(Math.PI/2));};
    const MG=[];wb.traverse(g=>{if(g.isGroup&&g.children.some(c=>c.userData.hn==='050301-4')){const b=new THREE.Box3().setFromObject(g),c=b.getCenter(new THREE.Vector3());MG.push({g,a:Math.atan2(c.z,c.x),p:g.position.clone()});}});
    const curlTo=c=>{for(const m of rim){const p=m.geometry.attributes.position,a0=m.userData.p0;for(let i=0;i<p.count;i++){const x=a0[3*i],z=a0[3*i+2],r=Math.hypot(x,z);if(r<RIN){p.setXYZ(i,x,a0[3*i+1],z);continue;}
        const u=uOf(Math.atan2(z,x)),k=(r-c*BR*0.32*u*u)/r;p.setXYZ(i,x*k,a0[3*i+1],z*k);}p.needsUpdate=true;m.geometry.computeVertexNormals();}
      for(const q2 of MG){const u=uOf(q2.a),d=c*BR*0.32*u*u;q2.g.position.set(q2.p.x-d*Math.cos(q2.a),q2.p.y,q2.p.z-d*Math.sin(q2.a));}};
    const B={split:hold,plain:balance(M,'plain',BR),m21:balance(M,'uncut',HAMDATA.BAL_R)};for(const b of Object.values(B))V.scene.add(b);
    const cst=q('#eTempChart'),cf={dirty:true},C=c2d(cst,cf,w=>w<520?0.62:0.34),ro=q('.e-ro',P);let T=20,kind='split';
    const plain=t=>-11*(t-20),comp=MTE.splitC,F2C=t=>(t-32)/1.8,m21=t=>MTE.uncut(t*1.8+32);   /* illustrative rates, s/day (comp: core.js); °F to °C */
    const mg=MG[0],Lw=V.label('Compensation mass','',v=>{mg.g.updateMatrixWorld(true);new THREE.Box3().setFromObject(mg.g).getCenter(v);}),Lb=V.label('Brass outside, nickel steel inside','',v=>v.set(-BR-0.5,0,-7)),Lc=V.label('Cut','',v=>v.set(BR+0.6,0,0)),
      Li=V.label('Invar arm','',v=>v.set(-7,0.8,0)),Ls=V.label('Uncut steel rim','',v=>v.set(-HAMDATA.BAL_R*0.7,0,-HAMDATA.BAL_R*0.72));
    const upd=()=>{for(const k in B)B[k].visible=k===kind;curlTo(kind==='split'?(T-20)/25*0.6:0);B.plain.userData.set(0,(T-20)/25*0.05);Lw.show=Lb.show=Lc.show=kind==='split';Li.show=Ls.show=kind==='m21';
      if(kind==='m21'){const r=m21(T);ro.innerHTML=`Model 21 at ${T.toFixed(1)} °C: <b>nothing curls</b>, and it ${r>=-0.005?'keeps its rate':`loses <b>${Math.abs(r).toFixed(2)} s a day</b> against 72½ °F`}. The Invar arm holds the rim’s diameter at its ends; the Elinvar hairspring hardly changes its stiffness.`;}
      else{const r=kind==='split'?comp(T):plain(T);ro.innerHTML=`${kind==='split'?'A cut bimetallic balance, as the Wempe’s,':'Plain brass balance'} at ${T.toFixed(1)} °C: ${r>=0?'gains':'loses'} <b>${Math.abs(r).toFixed(1)} s a day</b>`;}
      f.dirty=true;cf.dirty=true;};
    range(q('input[type=range]',P),v=>{T=v;upd();return v.toFixed(1)+' °C';});seg(q('.seg',P),v=>{kind=v;V.refit=true;upd();});
    return()=>{if(f.dirty){f.dirty=false;V.render();}
      if(cf.dirty){cf.dirty=false;const t55=F2C(55),t90=F2C(90);
        chart(C,{x0:-5,x1:45,y0:-8,y1:8,xt:[0,10,20,30,40],yt:[-8,-4,0,4,8],xf:x=>x+' °C',yf:y=>(y>0?'+':'')+y,xl:'Temperature',yl:'Rate, s a day',cursor:T,
          bands:kind==='m21'?[{x0:t55,x1:t90,y0:-0.6,y1:0.6,color:PAL.blue,label:'the Navy’s limit, 55–90 °F'}]:[],
          series:[{f:plain,color:PAL.red,label:'plain: −11 s a day per °C',lx:19.5,la:'right',dx:-8,dy:0,width:kind==='plain'?2.6:1.4},{f:comp,color:PAL.brass,label:'bimetallic',lx:19.5,dy:kind==='m21'?-28:-14,la:'center',width:kind==='split'?2.6:1.4}].concat(kind==='m21'?[{f:m21,color:PAL.blue,label:'Model 21, its test card',lx:34,dy:14,la:'center',width:2.6}]:[]),
          marks:[{x:T,y:kind==='split'?comp(T):kind==='plain'?plain(T):m21(T),color:kind==='split'?PAL.brass:kind==='plain'?PAL.red:PAL.blue}]});
        const{x:ctx}=C;ctx.font='11px "Instrument Sans",sans-serif';ctx.fillStyle=PAL.muted;ctx.textAlign='center';const pw=C.w-62;
        for(const[tf,lab]of[[55,'55 °F'],[72.5,'72½'],[90,'90 °F']]){const x=46+(F2C(tf)+5)/50*pw;ctx.fillRect(x-0.5,C.h-40,1,5);ctx.fillText(lab,x,C.h-46);}}};},'model');

  /* ---------- the Wempe's fusee: the chain's lever n turns from full wind (its groove's radius where the chain leaves it, fusee.js's rf), the hours since winding ---------- */
  const lever=n=>{const FU=model.R.fu,cg=FU.CG.chain;return FU.rf(cg.m0Of(cg.RF0+TAU*clamp(n,0,FU.NRUN)));};
  const ctrOf=b=>b.getCenter(new THREE.Vector3());

  /* ---------- constant force: the Wempe's barrel, chain and fusee, posed by the model at each hour ---------- */
  fig('eFus',f=>{const st=f.el,P=figOf(st),PT=model.mv.userData.parts,FU=model.R.fu,HPT=WPHYS.HPT,HR=model.HRUN,Fx=WD.H[10],Bx=WD.H[45],mid=[(Fx[0]+Bx[0])/2,(Fx[1]+Bx[1])/2];
    const keep=new Set(['fusee','fuseeWheel','maintaining','barrel','barrelArbor','setupRatchet','chain']);
    const bF=boxOf([PT.fusee]),bB=boxOf([PT.barrel]),bW=boxOf([PT.fuseeWheel]),ym=(bF.min.y+bF.max.y)/2;
    const V=new View3D(st,f,{aspect:w=>w<520?0.85:0.55,yaw:-0.5,pitch:0.42,dist:150,target:[0,-ym+4,0],near:2,far:2000}),{t,o}=frameAt(V,mid);
    /* the torque the model's mainspring gives the fusee arbor (WEDATA.fusee.tq: the solved strip, by the fusee's turns from run down, tools/wempe_essaydata.js), its pull on the chain that over the lever */
    const TQ=WEDATA.fusee.tq,lin=(tb,x)=>{if(x<=tb[0][0])return tb[0][1];for(let j=1;j<tb.length;j++)if(x<=tb[j][0]){const[a,p]=tb[j-1],[b,v]=tb[j];return p+(v-p)*(x-a)/(b-a);}return tb[tb.length-1][1];};
    const nOf=h=>h/HPT,tqS=h=>lin(TQ,WPHYS.MF-nOf(h)),pullN=h=>tqS(h)/lever(nOf(h)),P0=pullN(0),pull=h=>pullN(h)/P0;
    const T12=WPHYS.fusT(nOf(12)),tq=h=>WPHYS.fusT(nOf(h))/T12,gb=h=>pull(h)/pull(28)*tq(28);   /* the force on the train: 05 06_20, measured on the fusee arbor; gb: a going barrel with the same spring, matched at 28 h */
    V.label('Barrel','mainspring inside',at(o,Bx[0],(bB.min.y+bB.max.y)/2,Bx[1]-(bB.max.x-bB.min.x)/2));V.label('Fusee','',at(o,Fx[0]-9,ym,Fx[1]));const Lc=V.label('Chain','',v=>v.set(0,0,0));
    V.label('Fusee wheel','drives the train',at(o,Fx[0]-(bW.max.x-bW.min.x)/2,(bW.min.y+bW.max.y)/2,Fx[1]));
    const cst=q('#eFusChart'),cf={dirty:true},C=c2d(cst,cf,w=>w<520?0.6:0.32),ro=q('.e-ro',P);let hrs=6;
    const inp=q('input[type=range]',P);inp.max=HR.toFixed(1);
    range(inp,v=>{hrs=v;const n=nOf(v),L=lever(n);ro.innerHTML=`Spring pull <b>${Math.round(pull(v)*100)}%</b> of full, lever arm on the fusee <b>${L.toFixed(1)} mm</b>, ${(L/lever(0)).toFixed(2)}× the smallest, turning force on the fusee arbor <b>${Math.round(tq(v)*100)}%</b> (a going barrel: ${Math.round(gb(v)*100)}%)`;
      const m=FU.CG.chain.m0Of(FU.CG.chain.RF0+TAU*clamp(n,0,FU.NRUN)),yc=FU.yc(m);Lc.pos=at(o,mid[0],yc,mid[1]);f.dirty=true;cf.dirty=true;return v.toFixed(1)+' h';});
    return()=>{if(f.dirty){f.dirty=false;lend(V,o,keep,{n:nOf(hrs)});}
      if(cf.dirty){cf.dirty=false;const{X,Y}=chart(C,{x0:0,x1:HR,y0:0,y1:1.6,xt:[0,8,16,24,32,40,48,56],yt:[0,0.5,1,1.5],yf:y=>Math.round(y*100)+'%',xl:'Hours since winding',yl:'Force',cursor:hrs,
        series:[{f:pull,color:PAL.red,label:'the spring’s pull on the chain',lx:40,dy:16,la:'center'},{f:tq,color:PAL.blue,label:'pull × lever: the force on the train, measured',lx:26,dy:-12,la:'center'},{f:gb,color:PAL.muted,width:1.4,dash:[5,4],label:'a going barrel',lx:10,dy:-12,la:'center'}],
        marks:[{x:hrs,y:pull(hrs),color:PAL.red},{x:hrs,y:tq(hrs),color:PAL.blue}]});
        const{x:ctx}=C;ctx.strokeStyle=PAL.muted;ctx.setLineDash([2,3]);ctx.beginPath();ctx.moveTo(X(56),Y(0));ctx.lineTo(X(56),Y(1.1));ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=PAL.muted;ctx.font='11px "Instrument Sans",sans-serif';ctx.textAlign='right';ctx.fillText('the dial’s 56 h',X(56)-4,Y(0.08));}};},'model');

  /* ---------- winding: the Wempe's up-and-down dial and the key's half turns (the key on the fusee's square: a turn of the key a turn of the fusee) ---------- */
  fig('eWind',f=>{const st=f.el,P=figOf(st),C=c2d(st,f,w=>w<520?1.12:0.4),inp=q('input[type=range]',P),ro=q('.e-ro',P),btn=q('.wind',P);let h=20,kw=null;
    const HT=WPHYS.HPT/2,HR=()=>HRUN(),NH=Math.ceil(2*WPHYS.MF);inp.max=HR().toFixed(1);   /* hours per half turn of the key: 3.21; the fusee's 8.64 working turns, 18 half turns at most */
    const say=()=>{const hf=h/HT,left=HR()-h;ro.innerHTML=kw?`Winding: half turn <b>${kw.i}</b> of ${kw.n}.`:(h<0.05?'<b>Fully wound</b>: the stop has caught the fusee. ':`<b>${(Math.round(hf*2)/2).toString().replace('.5','½').replace(/^0½/,'½')}</b> half turn${hf>1.25?'s':''} of the key to wind it fully. `)+
      (kw?'':`${Math.max(0,left).toFixed(1)} h of running left${h>56?', past the 56 hours its dial counts':''}.`);};
    range(inp,v=>{if(kw)return;h=v;say();f.dirty=true;return v.toFixed(1)+' h';});
    btn.addEventListener('click',()=>{if(kw||h<0.05)return;kw={t:0,h0:h,n:Math.ceil(h/HT-1e-6),i:1};});
    return dt=>{if(kw){kw.t+=dt*(RM?4:1);const i=Math.floor(kw.t/0.8);kw.i=Math.min(kw.n,i+1);h=Math.max(0,kw.h0-HT*(i+smooth((kw.t-i*0.8)/0.55)));if(h<=0){h=0;kw=null;}inp.value=h;inp.parentElement.querySelector('output').textContent=h.toFixed(1)+' h';say();f.dirty=true;}
      if(!f.dirty)return;f.dirty=false;const{x:ctx,w,h:H}=C;ctx.clearRect(0,0,w,H);const DC=dial(),S=DC.width,c=S/2,k0=c/WDIAL.DR,uy=c+UDY*k0,hs=13*k0,nw=w<520,sz=nw?Math.min(w*0.62,H*0.52):Math.min(H*0.92,w*0.46),dx=nw?(w-sz)/2:w*0.26-sz/2,dy=nw?8:(H-sz)/2,k=sz/(2*hs)*k0;
      ctx.save();ctx.beginPath();ctx.arc(dx+sz/2,dy+sz/2,sz/2,0,TAU);ctx.clip();ctx.drawImage(DC,c-hs,uy-hs,2*hs,2*hs,dx,dy,sz,sz);drawHand(ctx,hands().ud,dx+sz/2,dy+sz/2,udA(h),k);ctx.restore();
      ctx.strokeStyle=PAL.rule;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(dx+sz/2,dy+sz/2,sz/2,0,TAU);ctx.stroke();
      /* the key's half turns from run down, seven to a row, those still to go filled */
      const need=h/HT,cols=7,gap=nw?Math.min((w-60)/cols,(H-sz-dy-40)/3.4):Math.min((w-w*0.53-44)/cols,H*0.2),x0=nw?(w-cols*gap-40)/2:w*0.53,r=gap*0.36,y0=nw?dy+sz+gap*1.45:H/2-gap*0.9;
      ctx.font='12px "Instrument Sans",sans-serif';ctx.fillStyle=PAL.muted;ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.fillText('Half turns of the key, from run down',x0,y0-gap*0.7);
      for(let i=0;i<NH;i++){const cx=x0+(i%cols+0.5)*gap,cy=y0+Math.floor(i/cols)*gap,frac=Math.min(1,2*WPHYS.MF-i),part=frac<1,full=need-i;ctx.strokeStyle=PAL.rule;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+TAU*frac);if(part)ctx.lineTo(cx,cy);if(part)ctx.closePath();ctx.stroke();
        if(full>0){ctx.fillStyle=PAL.blue;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+TAU*frac*clamp(full/frac,0,1));ctx.closePath();ctx.fill();}}
      ctx.fillStyle=PAL.muted;ctx.textBaseline='middle';for(let row=0;row*cols<NH;row++){const nn=Math.min(NH,(row+1)*cols),hh=Math.min(HR(),nn*HT);ctx.fillText(Math.round(hh)+' h',x0+(nn-row*cols)*gap+6,y0+row*gap);}ctx.textBaseline='alphabetic';};});

  /* ---------- maintaining power: the Wempe's maintaining work (05 06_4: the maintaining ratchet, its spring and its detent, in the fusee wheel), the model's own parts
     driven by its update(): running, the fusee's click wheel turns the ratchet through two clicks, and the ratchet drives the fusee wheel through the maintaining spring,
     closed by the drive WPHYS.runPhi(1) (15°); with the key turning for t minutes (here the key half a turn a minute), the clicks let go, the ratchet falls back half a
     tooth onto the maintaining detent (MBK) and the spring, pushing off it, drives the wheel on alone, its lead falling as the wheel turns (WPHYS.susPhi), spent after SUS
     s. Rose: what carries the drive; teal: what holds ---------- */
  fig('eMaint',f=>{const st=f.el,P=figOf(st),PT=model.mv.userData.parts,Fx=WD.H[10],m0=WPHYS.runPhi(1),TM=WPHYS.SUS/60,n0=20/WPHYS.HPT,keep=new Set(['fusee','fuseeWheel','maintaining','maintDetent']);
    const gMW=PT.maintaining.children[0],gMS=PT.maintaining.children[1],b=boxOf([PT.maintaining,PT.fuseeWheel]),bR=boxOf([gMW]),bS=boxOf([gMS]),bD=boxOf([PT.maintDetent]),bW=boxOf([PT.fuseeWheel]);
    const V=new View3D(st,f,{aspect:w=>w<520?0.85:0.55,yaw:0.35,pitch:1.05,dist:84,target:[0,-(b.min.y+b.max.y)/2,0],minPitch:0.2}),{t,o}=frameAt(V,Fx);   /* from the train side, through the fusee (see-through) */
    const ROSE='#e0306a',TEAL='#0e9f92',sub=m=>{for(let x=m;x;x=x.parent){if(x===gMW)return'r';if(x===gMS)return's';}return'';};
    let tm=0,mode='run',kw=null,key=0,ms=m0;const ro=q('.e-ro',P),inp=q('input[type=range]',P),out=inp.parentElement.querySelector('output'),btn=q('.wind',P);
    function set(v,md){tm=v;mode=md||(v>0?'turn':'run');if(mode==='turn'){key=tm*0.5;ms=WPHYS.susPhi(m0,tm*60);}else if(!md)ms=m0;
      const left=Math.max(0,TM-tm);ro.innerHTML=mode==='turn'?`<b>Key turning</b>: the clicks let go and the maintaining detent holds the ratchet; the maintaining spring, pushing off it, drives the fusee wheel on alone. Its lead <b>${(ms/D).toFixed(1)}°</b> of the ${(m0/D).toFixed(1)}° the running drive closes it by, <b>${left.toFixed(1)} min</b> of drive left.`:
        `<b>Running</b>: the mainspring, through the fusee and its two clicks on the click wheel, turns the maintaining ratchet, which drives the fusee wheel through the maintaining spring, held ${(ms/D).toFixed(1)}° closed by the drive.`;
      out.textContent=tm.toFixed(1)+' min';f.dirty=true;}
    inp.max=TM.toFixed(1);range(inp,v=>{if(kw)return;set(v);return v.toFixed(1)+' min';});
    btn.addEventListener('click',()=>{if(!kw)kw={t:0};});
    V.label('Maintaining spring','drives while the key turns',at(o,(bS.min.x+bS.max.x)/2,bS.max.y,bS.max.z));V.label('Maintaining ratchet','',at(o,bR.min.x,bR.max.y,(bR.min.z+bR.max.z)/2));
    V.label('Maintaining detent','holds the ratchet',at(o,(bD.min.x+bD.max.x)/2,bD.max.y,(bD.min.z+bD.max.z)/2));V.label('Fusee wheel','to the train',at(o,bW.max.x,(bW.min.y+bW.max.y)/2,Fx[1]));
    set(0);
    return dt=>{if(kw){kw.t+=dt/(RM?4:1);const T1=4,T2=4.6,T3=5.2;   /* the key turns 3 minutes' worth in 4 s, rests, lets go, and the mainspring closes the spring again */
        if(kw.t<T1)set(3*smooth(kw.t/T1),'turn');else if(kw.t<T2)set(3,'turn');else if(kw.t<T3){const u=smooth((kw.t-T2)/(T3-T2)),s3=WPHYS.susPhi(m0,180);ms=s3+(m0-s3)*u;set(3*(1-u),'run');}else{kw=null;set(0,'run');}inp.value=tm;}
      if(!f.dirty)return;f.dirty=false;const w=mode==='turn';
      lend(V,o,keep,{n:n0-key,E:w?2*tm*60:0,ms,winding:w},{paint:(m,k)=>{const m0_=m.material,s=k==='maintaining'?sub(m):'';
        const c=w?(k==='fuseeWheel'||s==='s'?ROSE:s==='r'||k==='maintDetent'?TEAL:null):(k==='maintDetent'?null:ROSE),gh=k==='fusee'||s==='r';return c||gh?tint(m0_,c,gh):null;}});};},'model');

  /* ---------- counting: the Wempe's centre, intermediate, seconds and escape wheels, at their places, each turned by the model's train from the escape wheel's teeth ---------- */
  const turnT=s=>{const[v,u]=s<60?[s,'s']:s<3600?[s/60,'min']:[s/3600,'h'],w=Math.floor(v+1e-9),fr=v-w;return(Math.abs(fr)<1e-6?String(w):Math.abs(fr-0.5)<1e-6?(w||'')+'½':v.toFixed(1))+' '+u;};   /* 7½ s, 8 min, 1 h */
  fig('eTrain',f=>{const st=f.el,P=figOf(st),PT=model.mv.userData.parts,TR=model.R.tr,z=k=>TR[k].userData.wheel.userData.gear.z,zp=k=>TR[k].userData.pin.userData.gear.z,NT=WESC.SET.NT||15,ep=model.R.esc.pinion.userData.gear.z;
    const keep=new Set(['centreWheel','intermediateWheel','secondsWheel','escapeWheel']),C0=WD.H[1],Tp=WD.H[38],Sp=WD.H[35],Ep=WESC.W,mid=[(C0[0]+Ep[0])/2,(C0[1]+Ep[1])/2];
    const b=boxOf([...keep].map(k=>PT[k])),V=new View3D(st,f,{aspect:w=>w<520?0.95:0.58,yaw:0.25,pitch:0.85,dist:104,target:[0,-(b.min.y+b.max.y)/2,0],near:2,far:2000}),{t,o}=frameAt(V,mid);
    /* turns an hour: the centre once, the intermediate 90/12, the seconds 60, the escape wheel 480 (15 teeth, a tooth each half second) */
    const per={c:3600,t:3600*zp('tw')/z('cw'),s:3600*zp('tw')/z('cw')*zp('sw')/z('tw'),e:NT/2};
    /* each name at its wheel's rim on the side toward the camera (the frame turned over: -z), at the wheel's face */
    const lb=(k,p,n,sub,a)=>{const q2=boxOf([PT[k]]),r=Math.max(q2.max.x-q2.min.x,q2.max.z-q2.min.z)/2*0.92;V.label(n,sub,at(o,p[0]+r*Math.sin(a),q2.min.y,p[1]-r*Math.cos(a)));};
    lb('centreWheel',C0,'Centre wheel',`${z('cw')} teeth, 1 turn / ${turnT(per.c)}`,-0.2);lb('intermediateWheel',Tp,'Intermediate wheel',`${z('tw')} teeth, 1 turn / ${turnT(per.t)}`,0.45);
    lb('secondsWheel',Sp,'Seconds wheel',`${z('sw')} teeth, 1 turn / ${turnT(per.s)}`,0.5);lb('escapeWheel',Ep,'Escape wheel',`${NT} teeth, 1 turn / ${turnT(per.e)}`,-1.6);
    let tt=0,speed=1,going=!RM;range(q('input[type=range]',P),v=>{speed=Math.pow(120,v);return '×'+(speed<10?speed.toFixed(1):Math.round(speed));});play(q('.play',P),()=>going,v=>going=v);
    return dt=>{if(going){tt+=dt*speed;f.dirty=true;}if(!f.dirty)return;f.dirty=false;
      let bt;if(speed<6){const k=Math.floor(tt*2);bt=k+smooth((tt*2-k)/0.12);}else bt=tt*2;   /* beats: half seconds, the train stepping below 6× */
      lend(V,o,keep,{E:bt});};},'model');

  /* ---------- the detent: the Wempe's escapement as its page runs it (WESC.ESC.state: makeEsc with its settings, WPHYS), its parts flattened into the wheel's plane, as
       the Wempe page's essay draws it (../wempe/js/essay.js, eEsc); a cycle of the balance's swing, the escape wheel a tooth on each ---------- */
  fig('eEsc',f=>{const st=f.el,P=figOf(st),C=c2d(st,f,w=>w<520?0.95:0.6),ro=q('.e-ro',P),RE=model.R.esc,PT=model.mv.userData.parts,MM=model.M,KE=WESC.ESC;let ph=0.15,speed=0.08,going=!RM,E0=0,lp=0.15;
    const rel=(o,top)=>{const r=new THREE.Matrix4();for(let p=o;p&&p!==top;p=p.parent){p.updateMatrix();r.premultiply(p.matrix);}return r;};
    const colOf=o=>{const mt=o.material;return mt===MM.ruby?'ruby':mt===MM.gilt?'gilt':mt===MM.brass||mt===MM.brass2?'brass':mt===MM.copper?'copper':mt===MM.blued?'blued':'steel';};
    /* a mesh flattened: its triangles (each wound one way, so a fill is their union) as one Path2D in top's frame, with its mean height and its plan centre */
    const flat=(o,top)=>{const gm=o.geometry,pa=gm.attributes.position,ix=gm.index,n=ix?ix.count:pa.count,mm=rel(o,top),v=new THREE.Vector3(),pth=new Path2D();let y=0,cx=0,cz=0,k=0;
      for(let i=0;i+2<n;i+=3){const t=[0,1,2].map(j=>{v.fromBufferAttribute(pa,ix?ix.getX(i+j):i+j).applyMatrix4(mm);return[v.x,v.z,v.y];});
        const ar=(t[1][0]-t[0][0])*(t[2][1]-t[0][1])-(t[2][0]-t[0][0])*(t[1][1]-t[0][1]);for(const p of t){y+=p[2];cx+=p[0];cz+=p[1];k++;}if(Math.abs(ar)<1e-7)continue;
        const u=ar>0?t:[t[0],t[2],t[1]];pth.moveTo(u[0][0],u[0][1]);pth.lineTo(u[1][0],u[1][1]);pth.lineTo(u[2][0],u[2][1]);pth.closePath();}
      return{pth,y:y/k,c:[cx/k,cz/k],hn:o.userData.hn,col:colOf(o)};};
    const vis=o=>{for(let p=o;p;p=p.parent){if(p.userData.rev&&!model.mv.userData.revShows(p.userData.rev,model.mv.userData.rev||'last'))return false;}return true;};
    const P2=[],add=(grp,top,mov,skip)=>grp.traverse(o=>{if(o.isMesh&&vis(o)&&!(skip&&skip(o)))P2.push({...flat(o,top),mov});});
    const goldOf=o=>{for(let p=o;p;p=p.parent)if(p===RE.gold)return true;return false;};
    add(RE.ew,RE.ew,'ew');add(RE.rol,RE.rol,'rol');add(RE.det,RE.det,'det',goldOf);add(RE.gold,RE.gold,'gold');
    for(const c of PT.detent.children)if(c!==RE.det)add(c,model.mv,'');add(PT.detentBlock,model.mv,'');
    P2.sort((a,b)=>(a.mov===''?0:1)-(b.mov===''?0:1)||b.y-a.y);   /* what stands (the block, the detent's foot) under what moves; seen from -y, the deepest first */
    const gp=RE.gold.position,dp=RE.det.children[0].position;
    const W=WESC.W,B=WESC.B,S=WESC.P,F=WESC.DPIV,bx=[Math.min(W[0]-7.5,B[0]-3.6,S[0],F[0])-1,Math.max(W[0]+7.5,B[0]+3.6,S[0],F[0])+1,Math.min(W[1]-7.5,B[1]-3.6,S[1],F[1])-1,Math.max(W[1]+7.5,B[1]+3.6,S[1],F[1])+1];
    const phIn=q('.phase',P),spIn=q('.speed',P);
    range(phIn,v=>{ph=v/1000;f.dirty=true;return Math.round(v/10)+'%';});const upB=play(q('.play',P),()=>going,v=>going=v);
    phIn.addEventListener('pointerdown',()=>{going=false;upB();});range(spIn,v=>{speed=v;return '×'+v.toFixed(2);});
    const RU={steel:PAL.steel,gilt:PAL.brass,brass:PAL.brass,copper:PAL.copper,blued:PAL.blue,ruby:'#c3163b'};
    const TXT=s=>!s.ccw?(s.psDef>1e-4?'Return swing: the discharge stone bends the gold spring aside; the detent stays where it rests, the wheel locked.':'Return swing: the wheel locked, the balance swinging free.'):
      s.prog<=0?(s.lift>1e-4?'Unlocking: the discharge stone pushes the gold spring, and the detent with it, until the locking stone lets the tooth go.':'The wheel locked, the balance swinging free.'):
      s.ride?'Let go: the wheel, from rest, turns toward the impulse stone; the detent, flung off the discharge stone, has fallen back onto the tooth it let go and rides it.':s.drop?'Let go: the wheel turns toward the impulse stone, chasing it.':s.run?'The impulse over: the next tooth runs on to the locking stone.':s.prog<1?'Impulse: a tooth drives the balance through the impulse stone.':'The wheel locked on the next tooth.';
    return dt=>{if(going){ph=(ph+dt*speed/0.5)%1;phIn.value=Math.round(ph*1000);phIn.parentElement.querySelector('output').textContent=Math.round(ph*100)+'%';f.dirty=true;}
      if(ph<lp-0.5)E0++;else if(ph>lp+0.5)E0--;lp=ph;if(!f.dirty)return;f.dirty=false;
      const{x,w,h}=C,s=KE.state(ph,WPHYS.ESC.A),E=E0+Math.min(1,Math.max(0,s.prog)),narrow=w<520;
      const k=Math.min(w/(bx[1]-bx[0]),h/(bx[3]-bx[2])),ox=(bx[0]+bx[1])/2,oz=(bx[2]+bx[3])/2;
      x.clearRect(0,0,w,h);x.save();x.translate(w/2,h/2);x.scale(-k,k);x.translate(-ox,-oz);
      const rot=a=>x.transform(Math.cos(a),-Math.sin(a),Math.sin(a),Math.cos(a),0,0),at2=(p,a)=>{x.translate(p.x,p.z);rot(a);};
      const frame=q2=>{if(q2.mov==='ew')at2(RE.ew.position,E*TAU/15);else if(q2.mov==='rol')at2(RE.rol.position,-s.th);else if(q2.mov==='det'||q2.mov==='gold'){at2(RE.det.position,s.lift||0);if(q2.mov==='gold'){x.translate(dp.x+gp.x,dp.z+gp.z);rot(-(s.psDef||0));}}};
      for(const q2 of P2){x.save();frame(q2);x.fillStyle=RU[q2.col];x.globalAlpha=q2.mov===''?0.28:q2.hn==='050403-1'?0.6:1;x.fill(q2.pth);x.restore();}   /* the impulse roller see-through: the discharge roller and its stone are under it, as 05 04_1 draws them dashed */
      x.restore();
      /* names, at each piece's place as moved, with a line to it, kept inside the figure */
      const scr=(p,mov)=>{const u=new DOMMatrix().translate(w/2,h/2).scale(-k,k).translate(-ox,-oz),R2=(a,pp)=>{u.translateSelf(pp.x,pp.z);u.multiplySelf(new DOMMatrix([Math.cos(a),-Math.sin(a),Math.sin(a),Math.cos(a),0,0]));};
        if(mov==='rol')R2(-s.th,RE.rol.position);else if(mov==='det'||mov==='gold')R2(s.lift||0,RE.det.position);if(mov==='gold')R2(-(s.psDef||0),{x:dp.x+gp.x,z:dp.z+gp.z});const r=u.transformPoint(new DOMPoint(p[0],p[1]));return[r.x,r.y];};
      const zz=Math.min(1,w/640),fs=narrow?10.5:11.5,css=(font,col,al,bl)=>{x.font=font;x.fillStyle=col;x.textAlign=al;x.textBaseline=bl;};
      const lab=(t,p,dx,dy,al='left')=>{if(!p)return;const tx=clamp(p[0]+dx*zz,4,w-4),ty=clamp(p[1]+dy*zz,8,h-8);if(dx||dy){x.strokeStyle=PAL.muted;x.lineWidth=0.8;x.beginPath();x.moveTo(p[0],p[1]);x.lineTo(tx,ty);x.stroke();}
        css(`${fs}px ${SANS}`,PAL.ink,al,'middle');const tw=x.measureText(t).width,lx=al==='right'?Math.max(tx-4,tw+4):al==='center'?clamp(tx,tw/2+4,w-tw/2-4):Math.min(tx+4,w-tw-4);halo(x,t,lx,ty,PAL.ink);};
      const pos=hn=>{const q2=P2.find(y=>y.hn===hn);return q2?scr(q2.c,q2.mov):null;};
      const[ewx,ewy]=scr([W[0],W[1]],'');css(`${fs}px ${SANS}`,PAL.ink,'center','top');halo(x,'escape wheel',ewx,ewy+7.6*k+4,PAL.ink);
      lab('impulse stone',pos('050403-2'),-56,-22,'right');lab('impulse roller',pos('050403-1'),-80,40,'right');lab('discharge stone',pos('050404-2'),44,-62);
      lab('locking stone',pos('050401-3'),74,-6);lab('gold spring',pos('050401-2'),34,-62);lab('detent spring',scr([F[0],F[1]],''),0,30,'center');
      {const q2=P2.find(y=>y.hn==='050401-4');if(q2){const p=scr(q2.c,'');lab('detent block',[clamp(p[0],60,w-60),clamp(p[1],20,h-20)],0,0,'center');}}
      css(`${narrow?11:12}px ${SANS}`,PAL.muted,'right','top');x.fillText(`balance ${sgS(s.th/D,1)}°`,w-8,8);
      ro.innerHTML=`<b>${s.ccw?'Unlocking swing.':'Return swing.'}</b> ${TXT(s)}`;};},'model');

  /* ---------- level on a moving ship: the Wempe's own box, gimbal ring and case (WCASE.build, case.js), its dial keeping Greenwich time, as the Wempe page's essay
       draws them ---------- */
  fig('eGim',f=>{const st=f.el,P=figOf(st),V=new View3D(st,f,{aspect:w=>w<520?0.9:0.58,yaw:0.75,pitch:0.62,dist:600,target:[0,-10,0],near:20,far:5000}),M=gl().M,S=V.scene;
    const CS=WCASE.build(M);S.add(CS.root);CS.lid.rotation.x=-1.75;CS.stay();CS.tongue.rotation.z=-Math.PI/2;CS.over.visible=false;   /* the outer transport box left out, as the Wempe page's views but Transport box leave it */
    CS.root.traverse(o=>{if(o.userData.rev&&!o.userData.rev.split(' ').includes('last'))o.visible=false;});   /* as last revised */
    const dc=document.createElement('canvas');dc.width=dc.height=1024;const dx=dc.getContext('2d'),tex=new THREE.CanvasTexture(dc);tex.encoding=THREE.sRGBEncoding;
    const yD=WDIAL.DY1-CS.YP;mesh(CS.bowl,cylY(WDIAL.DR,WDIAL.DY1-WDIAL.DY0,96),M.brass2,0,yD-(WDIAL.DY1-WDIAL.DY0)/2,0);
    mesh(CS.bowl,new THREE.CircleGeometry(WDIAL.DR,96).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({map:tex,metalness:0.3,roughness:0.42,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),0,yD+0.05,0);
    {const c=document.createElement('canvas');c.width=c.height=128;const g2=c.getContext('2d'),gr=g2.createRadialGradient(64,64,6,64,64,64);gr.addColorStop(0,'rgba(0,0,0,0.55)');gr.addColorStop(1,'rgba(0,0,0,0)');g2.fillStyle=gr;g2.fillRect(0,0,128,128);
      const sh=mesh(S,new THREE.PlaneGeometry(520,520).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,opacity:0.7,depthWrite:false}),0,CS.YP-93.5-2,0);sh.renderOrder=-1;}
    V.label('Gimbal ring','',at(CS.ring,72,4,0));V.label('Case','hangs level',at(CS.bowl,-38,-40,38));V.label('Box','',at(CS.root,92,-60,60));
    let amp=18,t=0,going=!RM,lock=false,lk=0,lt=-1;
    range(q('input[type=range]',P),v=>{amp=v;f.dirty=true;return v+'°';});q('.lock',P).addEventListener('change',e=>{lock=e.target.checked;f.dirty=true;});play(q('.play',P),()=>going,v=>going=v);
    return dt=>{if(going){t+=dt;f.dirty=true;}const l0=lk;lk=RM?+lock:clamp(lk+(lock?1:-1)*dt*1.2,0,1);if(lk!==l0)f.dirty=true;
      const tt=Math.floor(nowT());if(tt!==lt){lt=tt;paintDial(dx,1024,nowT(),nowH());tex.needsUpdate=true;f.dirty=true;}
      if(!f.dirty)return;f.dirty=false;const a=amp*D,roll=a*Math.sin(t*0.9),pitch=a*0.55*Math.sin(t*0.63+1.1),fr=1-smooth(Math.min(1,lk));
      CS.root.rotation.set(pitch,0,roll,'ZYX');CS.ring.rotation.x=-pitch*fr;CS.bowl.rotation.z=-roll*fr;V.render();};},'3d');

  /* ---------- keeping the rate: a navigator's rate book (the manual's Table I), and what a steady rate is worth between signals ---------- */
  fig('eRate',f=>{const st=f.el,P=figOf(st),C=c2d(st,f,w=>w<520?0.66:0.4),[ri,wi,di]=qa('input[type=range]',P),tb=q('.e-book',P),ro=q('.e-ro',P);let rate=1.3,wand=0.3,days=20,seed=11;
    const half=v=>Math.round(v*2)/2,sg=(v,n=1)=>(v>0?'+':v<0?'−':'±')+Math.abs(v).toFixed(n);let run=null;
    function sim(){let s=seed;const rnd=()=>(s=(s*16807)%2147483647)/2147483647,gs=()=>Math.sqrt(-2*Math.log(rnd()+1e-12))*Math.cos(TAU*rnd());
      const n=10+days,e=[2];for(let i=1;i<=n;i++)e.push(e[i-1]+rate+wand*gs());   /* the dial error (s, + fast), a day apart, the first comparison 2 s fast */
      const rd=e.slice(0,10).map(half),r=rd.map((v,i)=>i?v-rd[i-1]:null),mr=(rd[9]-rd[0])/9;return{e,rd,r,mr,pred:d=>rd[9]+mr*(d-9)};}
    const upd=()=>{run=sim();const{rd,r,mr,e,pred}=run,dev=r.slice(1).reduce((a,v)=>a+Math.abs(v-mr),0)/9,end=9+days,left=e[end]-pred(end);
      tb.innerHTML='<table><thead><tr><th>Day</th><th title="+ fast, − slow">Dial error</th><th title="+ gaining, − losing">Daily rate</th><th>Deviation</th><th>Remarks</th></tr></thead><tbody>'+
        rd.map((v,i)=>`<tr><td>${i+1}</td><td>${sg(v)} s</td><td>${i?sg(r[i])+' s':''}</td><td>${i?Math.abs(r[i]-mr).toFixed(1):''}</td><td>${i?'':'Started, set'}</td></tr>`).join('')+'</tbody></table>';
      ro.innerHTML=`Mean daily rate <b>${sg(mr,2)} s</b> (${mr>=0?'gaining':'losing'}), mean deviation ${dev.toFixed(2)} s. After ${days} days with no signal the dial reads <b>${sg(e[end])} s</b>, ${(Math.abs(e[end])/4).toFixed(1)} nautical miles at the equator if read as it stands; corrected at the mean rate it is out by <b>${Math.abs(left).toFixed(1)} s</b>, <b>${(Math.abs(left)/4).toFixed(2)} nautical miles</b>.`;f.dirty=true;};
    range(ri,v=>{rate=v;upd();return sg(v)+' s/day';});range(wi,v=>{wand=v;upd();return v.toFixed(1)+' s/day';});range(di,v=>{days=v;upd();return v+' days';});
    q('.again',P).addEventListener('click',()=>{seed=(seed*48271)%2147483647||7;upd();});
    return()=>{if(!f.dirty||!run)return;f.dirty=false;const{e,rd,pred}=run,end=9+days,all=[...e.slice(0,end+1),pred(end)],lo=Math.min(0,...all),hi=Math.max(0,...all),pad=(hi-lo)*0.12+1,y0=lo-pad,y1=hi+pad,st2=(q=>[1,2,5,10,20,50,100,200].find(v=>v>=q)||500)((y1-y0)/6);
      const yt=[];for(let v=Math.ceil(y0/st2)*st2;v<=y1;v+=st2)yt.push(v);   /* st2: 1, 2, 5, 10, 20 … */const xs=Math.max(5,Math.ceil(end/6/5)*5),xt=[];for(let v=0;v<=end+1;v+=xs)xt.push(v);
      const{X,Y}=chart(C,{x0:0,x1:end+1,y0,y1,xt,yt,xf:x=>'day '+(x+1),yf:y=>(y>0?'+':'')+y+' s',xl:'',yl:'Dial error',series:[]});const ctx=C.x;
      ctx.fillStyle=PAL.blue;ctx.globalAlpha=0.08;ctx.fillRect(X(9),Y(y1),X(end+1)-X(9),Y(y0)-Y(y1));ctx.globalAlpha=1;ctx.font='12px "Instrument Sans",sans-serif';ctx.fillStyle=PAL.muted;ctx.textAlign='left';ctx.fillText('no signal',X(9)+6,Y(y1)+14);
      ctx.strokeStyle=PAL.ink;ctx.lineWidth=1.6;ctx.beginPath();for(let i=0;i<=end;i++)i?ctx.lineTo(X(i),Y(e[i])):ctx.moveTo(X(i),Y(e[i]));ctx.stroke();
      ctx.strokeStyle=PAL.blue;ctx.lineWidth=2;ctx.setLineDash([6,4]);ctx.beginPath();ctx.moveTo(X(0),Y(pred(0)));ctx.lineTo(X(end),Y(pred(end)));ctx.stroke();ctx.setLineDash([]);
      for(let i=0;i<10;i++){ctx.fillStyle=PAL.brass;ctx.strokeStyle=PAL.paper;ctx.lineWidth=2;ctx.beginPath();ctx.arc(X(i),Y(rd[i]),4.5,0,TAU);ctx.fill();ctx.stroke();}
      ctx.strokeStyle=PAL.red;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(X(end),Y(pred(end)));ctx.lineTo(X(end),Y(e[end]));ctx.stroke();
      ctx.fillStyle=PAL.muted;ctx.textAlign='right';ctx.fillText('read to the half second',X(9)-6,Y(y0)-8);ctx.fillStyle=PAL.blue;ctx.fillText('mean rate',X(end)-6,Y(pred(end))+(e[end]>pred(end)?16:-10));};});

  /* ---------- Greenwich time from the sky: the almanac and the navigator's arithmetic (ALM, shared/almanac.js, checked by tools/almanac.js against JPL Horizons
     and skyfield). The worked examples are fixed days and places, so a reader can follow them on paper; each sight is made by the almanac at the true time and
     place (ALM.sextant: refraction, dip, parallax and semi-diameter put in) and worked as the navigator works it, from the readings alone ---------- */
  const AL=typeof ALM!=='undefined'?ALM:null,FM=AL&&AL.fmt,hr=36e5,
    dmS=(a,p='N',m='S')=>FM.dm(Math.abs(a))+' '+(a<0?m:p),sgn=(v,n=1,u='′')=>(v>0?'+':v<0?'−':'±')+Math.abs(v).toFixed(n)+u,
    tod=(t,n=1)=>{const d=new Date(Math.round(t/100)*100),z=x=>String(x).padStart(2,'0');return`${z(d.getUTCHours())}:${z(d.getUTCMinutes())}:${(d.getUTCSeconds()+d.getUTCMilliseconds()/1000).toFixed(n).padStart(n?n+3:2,'0')}`;},
    mins=s=>{const a=Math.abs(s),m=Math.floor(a/60);return(s<-0.05?'−':s>0.05?'+':'±')+(m?m+' min ':'')+(a-60*m).toFixed(1)+' s';},
    table=(rows,head)=>'<table>'+(head?'<thead><tr>'+head.map(h=>`<th>${h}</th>`).join('')+'</tr></thead>':'')+'<tbody>'+rows.map(r=>r?'<tr>'+r.map(c=>`<td>${c??''}</td>`).join('')+'</tr>':'<tr class="e-sep"><td colspan="9"></td></tr>').join('')+'</tbody></table>',
    noAlm=st=>{st.innerHTML='<div class="e-fallback">The almanac’s script didn’t load. Reload the page to try again.</div>';return()=>{};};
  /* the corrections of a sight as the navigator writes them down */
  const corrRows=(c,b)=>[['Sextant altitude',FM.dm(c.hs),''],['Index correction',sgn(c.ic),''],['Dip',sgn(-c.dip),'1.76′ √ eye'],['Apparent altitude',FM.dm(c.ha),''],
    ['Refraction',sgn(-c.R),'Bennett'],['Semi-diameter',sgn(c.sd),b.name==='Moon'?'augmented':''],['Parallax',sgn(c.pa,2),'HP cos h'],['Observed altitude',`<b>${FM.dm(c.ho)}</b>`,'']];

  /* equal altitudes ashore: the chronometer's error from two readings of the Sun at the same altitude */
  fig('eEqual',f=>{const st=f.el,P=figOf(st);if(!AL)return noAlm(st);const C=c2d(st,f,w=>w<520?0.66:0.42),[hi,ei]=qa('input[type=range]',P),tb=q('.e-book',P),ro=q('.e-ro',P);
    const PORTS=[{n:'Annapolis',lat:38+59/60,lon:-(76+29/60)},{n:'Greenwich',lat:51+28.7/60,lon:-0.1/60},{n:'Honolulu',lat:21+18.4/60,lon:-(157+51.5/60)}],day=Date.UTC(2026,9,15);
    let port=PORTS[0],h=25,E=23.5,run=null;
    const upd=()=>{const{lat,lon}=port,alt=t=>{const S=AL.sun(t);return AL.hcz(lat,S.dec,AL.n360(S.gha+lon)).hc;},ln=AL.noon(lon,day+12*hr-lon/15*hr),top=alt(ln);
      const cross=(a,b)=>{for(let i=0;i<50;i++){const m=(a+b)/2;(alt(m)<h)===(alt(a)<h)?a=m:b=m;}return(a+b)/2;};
      run={alt,ln,top,ok:h<top-0.5};if(!run.ok){tb.innerHTML='';ro.innerHTML=`At ${port.n} the Sun climbs only to <b>${top.toFixed(1)}°</b> that day: take a lower altitude.`;f.dirty=true;return;}
      const t1=cross(ln-9*hr,ln),t2=cross(ln,ln+9*hr),c1=t1+E*1000,c2=t2+E*1000,r=AL.equalAlt(lat,lon,c1,c2);Object.assign(run,{c1,c2,r});
      tb.innerHTML=table([['The Sun at '+h.toFixed(1)+'°, morning: the chronometer reads',tod(c1),''],['afternoon, at the same altitude',tod(c2),''],['Halfway between',tod(r.mid),'noon, as the chronometer has it'],
        ['Equation of equal altitudes',mins(-r.eqn),'the Sun’s change of declination'],['Local apparent noon at '+port.n+', '+dmS(lon,'E','W')+', by the almanac',tod(r.noon),'GMT'],
        ['The chronometer’s error',`<b>${mins(r.E)}</b>`,r.E>=0?'fast':'slow']]);
      ro.innerHTML=`Found <b>${mins(r.E)}</b> against the ${mins(E)} set: the arithmetic needs only the two readings, ${port.n}’s longitude and the almanac. Taking the middle of the readings for noon, without the equation, would have been ${Math.abs(r.eqn).toFixed(1)} s out.`;f.dirty=true;};
    seg(q('.seg',P),v=>{port=PORTS[+v];upd();});range(hi,v=>{h=v;upd();return v.toFixed(1)+'°';});range(ei,v=>{E=v;upd();return mins(v)+(v>0?' fast':v<0?' slow':'');});
    return()=>{if(!f.dirty||!run)return;f.dirty=false;const{alt,ln,top}=run,x0=(ln-day)/hr-7,x1=x0+14,y1=Math.ceil((top+6)/10)*10,cs=E/3600;
      const xt=[];for(let v=Math.ceil(x0);v<=x1;v+=2)xt.push(v);const yt=[];for(let v=0;v<=y1;v+=10)yt.push(v);
      chart(C,{x0,x1,y0:0,y1,xt,xf:v=>String(((v%24)+24)%24).padStart(2,'0')+'h',yt,yf:v=>v+'°',xl:'the chronometer’s reading',yl:'the Sun’s altitude',
        bands:run.ok?[{x0,x1,y0:h-0.25,y1:h+0.25,color:PAL.brass}]:[],cursor:run.ok?(run.r.mid-day)/hr:null,
        series:[{f:x=>alt(day+(x-cs)*hr),color:PAL.ink,label:port.n,lx:(ln-day)/hr+cs+3.2,dx:8,dy:-4}],marks:run.ok?[{x:(run.c1-day)/hr,y:h,color:PAL.blue},{x:(run.c2-day)/hr,y:h,color:PAL.blue},{x:(ln-day)/hr+cs,y:top,color:PAL.red}]:[]});};});

  /* the time sight at sea */
  fig('eSight',f=>{const st=f.el,P=figOf(st);if(!AL)return noAlm(st);const C=c2d(st,f,w=>w<520?0.62:0.36),[ti,ei,li]=qa('input[type=range]',P),tb=q('.e-book',P),ro=q('.e-ro',P);
    const la=35,lo=-40,day=Date.UTC(2026,9,18),O={eye:6,ic:-1.4,T:18,P:1008,limb:'L'};let H=10.25,Em=0,dL=0;
    const work=(hh,em,dl)=>{const t=day+hh*hr,hs=AL.sextant('Sun',t,la,lo,O),tn=t+em*1000,B=AL.sun(tn),c=AL.correct(hs,B,{...O,lat:la}),east=AL.topo(AL.sun(t),la,lo).az<180,
      r=AL.timeSight(la+dl/60,B.dec,c.ho,B.gha,east);return{t,tn,hs,B,c,east,r,err:r?AL.n180(r.lon-lo)*60*Math.cos(la*Math.PI/180):NaN};};
    const N=(()=>{const t=AL.noon(lo,day+12*hr-lo/15*hr),S=AL.sun(t),hs=AL.sextant('Sun',t,la,lo,O),c=AL.correct(hs,S,{...O,lat:la});return{t,S,hs,c,lat:AL.meridianLat(c.ho,S.dec,true)};})();   /* that day's noon sight, the ship hove to */
    const upd=()=>{const w=work(H,Em,dL),{B,c,r}=w;if(!r){tb.innerHTML='';ro.innerHTML='The Sun is too near the meridian for a time sight.';f.dirty=true;return;}
      tb.innerHTML=table([['GMT by the chronometer',tod(w.tn),Em?`${mins(Em)} not allowed for`:''],...corrRows(c,B),null,['The Sun’s GHA, by the almanac',FM.dm(B.gha),''],['its declination',dmS(B.dec),''],
        ['Latitude',dmS(la+dL/60),dL?`${sgn(dL)} out`:'from the noon sight'],['Meridian angle t',FM.dm(r.t),w.east?'east':'west'],['Local hour angle',FM.dm(r.lha),'= 360° − t'],['Longitude = LHA − GHA',`<b>${dmS(r.lon,'E','W')}</b>`,''],null,
        ['That noon, '+tod(N.t,0)+' GMT: the lower limb on the meridian',FM.dm(N.hs),'sextant'],['observed altitude',FM.dm(N.c.ho),''],['the Sun’s declination',dmS(N.S.dec),''],['Latitude = declination + (90° − Ho)',`<b>${dmS(N.lat)}</b>`,'the Sun bears south']]);
      ro.innerHTML=`The ship is at 40°00.0′ W: the sight puts it <b>${Math.abs(w.err).toFixed(1)} nautical miles</b> ${w.err>0?'east':'west'} of it${Math.abs(w.err)<0.05?' (the arithmetic gives it back)':''}. The Sun bears ${AL.topo(AL.sun(w.t),la,lo).az.toFixed(0)}°.`;f.dirty=true;};
    range(ti,v=>{H=v;upd();return tod(day+v*hr,0).slice(0,5)+' GMT';});range(ei,v=>{Em=v;upd();return mins(v);});range(li,v=>{dL=v;upd();return sgn(v);});
    return()=>{if(!f.dirty)return;f.dirty=false;const per=x=>work(x,0,1).err,all=x=>work(x,Em,dL).err,ys=[];for(let x=9.75;x<=12.5;x+=0.25)ys.push(per(x),all(x));
      const lo2=Math.min(0,...ys.filter(Number.isFinite)),hi2=Math.max(1,...ys.filter(Number.isFinite)),y0=Math.floor(lo2-0.5),y1=Math.ceil(hi2+0.5),sp=y1-y0>12?4:y1-y0>6?2:1,yt=[];for(let v=y0;v<=y1;v+=sp)yt.push(v);
      chart(C,{x0:9.75,x1:12.5,y0,y1,xt:[10,10.5,11,11.5,12,12.5],xf:v=>tod(day+v*hr,0).slice(0,5),yt,xl:'the sight’s time, GMT',yl:'miles east',cursor:H,
        series:[{f:per,color:PAL.blue,label:'a latitude 1′ out',lx:10.1,dy:-12},{f:all,color:PAL.red,width:1.6,dash:[5,4],label:'this sight',lx:11.6,dy:14}]});};});

  /* the lunar distance */
  fig('eLunar',f=>{const st=f.el,P=figOf(st);if(!AL)return noAlm(st);const C=c2d(st,f,w=>w<520?0.62:0.36),[oi,di]=qa('input[type=range]',P),tb=q('.e-book',P),ro=q('.e-ro',P);
    const la=35,lo=-40,t=Date.UTC(2026,9,18,21),O={eye:6,ic:-1.4,T:18,P:1008,limbM:'L'};let k='Markab',off=17,dd=0,run=null;
    const upd=()=>{const S=AL.sextantLunar(k,t,la,lo,O),t0=t+off*6e4,r=AL.clear(S.ds+dd/60,S.hm,S.hb,k,t0,{...O,lat:la+0.3,dr:{lat:la+0.3,lon:lo-0.4}});run={S,t0,r};
      tb.innerHTML=table([['The chronometer reads',tod(t0,0),'GMT, it is thought'],['Distance, the Moon’s near limb to '+k,FM.dm(S.ds+dd/60),dd?sgn(dd,2)+' misread':'sextant'],['The Moon’s lower limb',FM.dm(S.hm),'sextant'],[k,FM.dm(S.hb),'sextant'],null,
        ['The Moon’s centre, apparent',FM.dm(r.am),'index, dip, semi-diameter'],[k+', apparent',FM.dm(r.ab),'index, dip'],['Apparent distance of the centres',FM.dm(r.d),'index, semi-diameter'],
        ['The Moon’s centre, true',FM.dm(r.moon.ho),'refraction, parallax'],[k+', true',FM.dm(r.body.ho),'refraction'],['Angle at the zenith, ΔZ',FM.dm(r.dz),''],
        ['True distance, the Earth a sphere',FM.dm(r.D),''],['The Earth’s figure, from the DR',sgn(r.fig,2),'the almanac’s own sight'],['Cleared distance',`<b>${FM.dm(r.Dc)}</b>`,`changing ${Math.abs(r.rate).toFixed(1)}′ an hour`],null,
        ['The almanac has it at',`<b>${tod(r.gmt)}</b>`,'GMT'],['So the chronometer is',`<b>${mins(r.err)}</b>`,r.err>=0?'fast':'slow']]);
      ro.innerHTML=`The chronometer was ${mins(off*60)} out; the Moon finds ${mins(r.err)}, <b>${Math.abs(r.err-off*60).toFixed(1)} s</b> from it. Here a tenth of a minute of distance is ${(6/Math.abs(r.rate)*60).toFixed(0)} s of time, ${(6/Math.abs(r.rate)*15).toFixed(1)}′ of longitude.`+
        (Math.abs(r.rate)<15?` <b>${k} is too slow tonight</b>: navigators took a body whose distance changes fast.`:'');f.dirty=true;};
    seg(q('.seg',P),v=>{k=v;upd();});range(oi,v=>{off=v;upd();return(v>0?'+':v<0?'−':'')+Math.abs(v)+' min';});range(di,v=>{dd=v;upd();return sgn(v,2);});
    return()=>{if(!f.dirty||!run)return;f.dirty=false;const{r,t0}=run,x0=19,x1=23,base=Date.UTC(2026,9,18),L=x=>AL.lunar(k,base+x*hr),ya=L(x0),yb=L(x1),y0=Math.floor(Math.min(ya,yb)*2)/2-0.5,y1=Math.ceil(Math.max(ya,yb)*2)/2+0.5;
      const yt=[],sp=y1-y0>3?1:0.5;for(let v=Math.ceil(y0/sp)*sp;v<=y1;v+=sp)yt.push(v);
      chart(C,{x0,x1,y0,y1,xt:[19,20,21,22,23],xf:v=>v+'h',yt,yf:v=>v.toFixed(1)+'°',xl:'Greenwich time',yl:'the Moon’s distance from '+k+', from the Earth’s centre',cursor:(t0-base)/hr,
        bands:[{x0,x1,y0:r.Dc-0.01,y1:r.Dc+0.01,color:PAL.brass}],series:[{f:L,color:PAL.ink}],marks:[{x:(r.gmt-base)/hr,y:r.Dc,color:PAL.red}]});};});

  /* the almanac's pages, and printing them */
  fig('eAlm',f=>{const box=f.el,P=figOf(box);if(!AL)return noAlm(box);const d0=q('.d0',P),nd=q('.nd',P),dt=q('.dt',P);
    const dec=a=>(a<0?'S ':'N ')+FM.dm(Math.abs(a)).replace('°','° '),gh=a=>FM.dm(a).replace('°','° ');
    function pages(){const t0=Date.parse(d0.value+'T00:00:00Z'),n=+nd.value,v=dt.value.trim();if(!Number.isFinite(t0))return'<p>Give a date.</p>';AL.setDeltaT(v!==''&&Number.isFinite(+v)?+v:null);
      let o='';for(let i=0;i<n;i++){const day=t0+i*864e5,dn=new Date(day).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}),rows=[];
        for(let h=0;h<24;h++){const t=day+h*hr,S=AL.sun(t),M=AL.moon(t);rows.push([String(h).padStart(2,'0'),gh(S.gha),dec(S.dec),gh(AL.n360(AL.gast(AL.JD(t)))),gh(M.gha),dec(M.dec),M.hp.toFixed(1)]);}
        const S0=AL.sun(day),S12=AL.sun(day+12*hr),M12=AL.moon(day+12*hr),mp=AL.noon(0,day+12*hr),eot=m=>{const a=Math.abs(m*60),mm=Math.floor(a/60);return(m<0?'−':'+')+mm+'m '+(a-mm*60).toFixed(0).padStart(2,'0')+'s';};
        const LS=AL.LUNAR.filter(b=>{const d=AL.lunar(b,day+12*hr);return d>15&&d<120;}),lr=LS.map(b=>[b,...[0,3,6,9,12,15,18,21].map(h=>FM.dm(AL.lunar(b,day+h*hr)).replace('°','° '))]);
        o+=`<section class="e-pg"><h4>${dn}</h4>${table(rows,['GMT','Sun GHA','Dec','Aries GHA','Moon GHA','Dec','HP ′'])}
          <p class="e-pf">Sun: semi-diameter ${S12.sd.toFixed(1)}′; equation of time (apparent less mean) ${eot(S0.eot)} at 00h, ${eot(S12.eot)} at 12h; meridian passage at Greenwich ${tod(mp,0).slice(0,5)} GMT. Moon: semi-diameter ${M12.sd.toFixed(1)}′ at 12h (from the Earth’s centre). ΔT ${AL.deltaT(2000+(AL.JD(day)-2451545)/365.25).toFixed(1)} s.</p>
          ${lr.length?table(lr,['Lunar distances','00h','03h','06h','09h','12h','15h','18h','21h']):''}
          ${table([0,3,6,9,12,15,18,21].map(h=>{const t=day+h*hr,P=AL.PLANETS.map(k=>AL.planet(k,t));return[String(h).padStart(2,'0'),...P.flatMap(b=>[gh(b.gha),dec(b.dec)])];}),['GMT',...AL.PLANETS.flatMap(k=>[k+' GHA','Dec'])])}</section>`;}
      const t1=t0+12*hr,sr=AL.STARS.map((s,i)=>{const b=AL.star(i,t1);return[s[0]||'—',s[1],gh(b.sha),dec(b.dec),s[6].toFixed(1)];});
      o+=`<section class="e-pg e-stars"><h4>The stars at ${new Date(t1).toISOString().slice(0,10)}, 12h (their places change by less than 1′ in a month)</h4>${table(sr,['No.','Star','SHA','Dec','Mag.'])}</section>`;AL.setDeltaT(null);return o;}
    const show=()=>{box.innerHTML=pages();};
    [d0,nd,dt].forEach(e=>e.addEventListener('change',show));
    q('.today',P).addEventListener('click',()=>{d0.value=new Date().toISOString().slice(0,10);show();});
    q('.print',P).addEventListener('click',()=>{let pr=document.getElementById('almPrint');if(!pr){pr=document.createElement('div');pr.id='almPrint';document.body.appendChild(pr);}
      pr.innerHTML=`<h1>Nautical almanac, from ${d0.value}</h1><p>Computed by The Marine Chronometer’s pages: the Sun by VSOP87, the Moon by ELP-2000/82 (Meeus, Astronomical Algorithms), the stars from SIMBAD’s catalogue. Hour angles and declinations are apparent, of date, from the Earth’s centre.</p>`+pages();
      document.documentElement.classList.add('alm-print');const done=()=>{document.documentElement.classList.remove('alm-print');removeEventListener('afterprint',done);};addEventListener('afterprint',done);
      if(!navigator.webdriver)print();else done();});
    show();return()=>{};});

  /* the workbook: one's own sights */
  fig('eWork',f=>{const box=f.el,P=figOf(box);if(!AL)return noAlm(box);const out=q('.e-out',P);let mode='sight';
    const ang=s=>{s=String(s).trim().replace(/[°′'NnEe]/g,' ').replace(/,/g,'.');let neg=/[SsWw]|^-|^−/.test(s);s=s.replace(/[SsWw−-]/g,' ').trim();const p=s.split(/\s+/).map(Number);if(!p.length||p.some(x=>!Number.isFinite(x)))return NaN;const v=p[0]+(p[1]||0)/60+(p[2]||0)/3600;return neg?-v:v;};
    const names=['Sun','Moon',...AL.PLANETS,...AL.STARS.map(s=>s[1])],opt=(a,v)=>a.map(x=>`<option${x===v?' selected':''}>${x}</option>`).join(''),
      F0={date:'2026-10-18',time:'10:15:00',err:'0',eye:'6',ic:'-1.4',T:'18',P:'1008',lat:'35 00.0 N',lon:'40 00.0 W',body:'Sun',limb:'Lower',hs:'',how:'Meridian, bearing south',
        bodyL:'Markab',ds:'',hm:'',hb:'',far:'Near',r1:'2026-10-15 16:51',e1:'23.5',r2:'2026-10-20 16:50',e2:'29.0',now:'2026-11-02 12:00'};let V={...F0};
    const fld=(k,lab,html)=>`<label class="e-in"><span>${lab}</span>${html||`<input data-k="${k}" value="${V[k]}" spellcheck="false">`}</label>`,
      when=s=>{const x=String(s).trim().replace(' ','T');return Date.parse(x+(/T\d\d:\d\d$/.test(x)?':00':'')+'Z');},
      sel=(k,lab,a)=>fld(k,lab,`<select data-k="${k}">${opt(a,V[k])}</select>`),HOW=['Meridian, bearing south','Meridian, bearing north','Pole star'];
    function form(){const base=fld('date','Date (GMT)',`<input type="date" data-k="date" value="${V.date}">`)+fld('time','Chronometer reads')+fld('err','its error, s (+ fast)')+fld('lat','Latitude (DR)')+fld('lon','Longitude (DR)')+fld('eye','Height of eye, m')+fld('ic','Index correction, ′')+fld('T','Temperature, °C')+fld('P','Pressure, hPa');
      box.innerHTML=`<div class="e-grid">${mode==='rate'?fld('r1','First error found, GMT')+fld('e1','its error, s (+ fast)')+fld('r2','Second, GMT')+fld('e2','its error, s')+fld('now','Carried to, GMT'):
        base+(mode==='sight'?sel('body','Body',names)+sel('limb','Limb',['Lower','Upper','Centre'])+fld('hs','Sextant altitude'):
        mode==='lat'?sel('how','Taken',HOW)+sel('body','Body',names)+sel('limb','Limb',['Lower','Upper','Centre'])+fld('hs','Sextant altitude'):
        sel('bodyL','Body',AL.LUNAR)+fld('ds','Distance (sextant)')+sel('far','Moon’s limb',['Near','Far'])+fld('hm','Moon’s lower limb, altitude')+fld('hb','Body’s altitude'))}</div>`;
      qa('[data-k]',box).forEach(e=>e.addEventListener(e.tagName==='SELECT'||e.type==='date'?'change':'input',()=>{V[e.dataset.k]=e.value;calc();}));calc();}
    function calc(){
      if(mode==='rate'){const t1=when(V.r1),t2=when(V.r2),tn=when(V.now),e1=+V.e1,e2=+V.e2;if(![t1,t2,tn,e1,e2].every(Number.isFinite)||t2<=t1){out.innerHTML='<p class="e-ro">Give two errors, the later second, each with its time as 2026-10-15 16:51, and the time to carry it to.</p>';return;}
        const r=AL.rate(t1,e1,t2,e2),e=r.at(tn);out.innerHTML=table([['Days between',((t2-t1)/864e5).toFixed(2),''],['Daily rate',`<b>${sgn(r.r,2,' s')}</b>`,r.r>=0?'gaining':'losing'],
          ['The error at '+String(V.now).trim(),`<b>${mins(e)}</b>`,e>=0?'fast: take it off the reading':'slow: add it to the reading'],['In longitude, if it were left out',FM.dm(Math.abs(e)/240),'15″ of arc a second']]);return;}
      const tc=Date.parse(V.date+'T'+V.time.trim()+'Z'),E=+V.err||0,t=tc-E*1000,la=ang(V.lat),lo=ang(V.lon),O={eye:+V.eye||0,ic:+V.ic||0,T:+V.T,P:+V.P};
      if(!Number.isFinite(t)||!Number.isFinite(la)||!Number.isFinite(lo)||!Number.isFinite(O.T)||!Number.isFinite(O.P)){out.innerHTML='<p class="e-ro">Fill in the date, the time (hh:mm:ss), the place by dead reckoning and the weather.</p>';return;}
      if(mode==='sight'||mode==='lat'){const hs=ang(V.hs);if(!Number.isFinite(hs)){out.innerHTML='<p class="e-ro">Give the sextant’s altitude, as degrees and minutes (31 41.2).</p>';return;}
        const pole=mode==='lat'&&V.how==='Pole star',B=AL.body(pole?'Polaris':V.body,t),c=AL.correct(hs,B,{...O,limb:pole?'C':V.limb[0],lat:la}),head=[['GMT',tod(t),E?`chronometer ${mins(E)}`:''],...corrRows(c,B),null,[B.name+'’s GHA',FM.dm(B.gha),''],['declination',dmS(B.dec),'']];
        if(mode==='lat'){const lha=AL.n360(B.gha+lo),l=pole?AL.latByAlt(c.ho,B.dec,lha,la):AL.meridianLat(c.ho,B.dec,V.how.endsWith('south'));
          out.innerHTML=table([...head,null,pole?['Local hour angle',FM.dm(lha),'GHA + the DR longitude']:['Zenith distance',FM.dm(90-c.ho),'90° − Ho'],['Latitude',`<b>${dmS(l)}</b>`,pole?'the triangle solved':V.how.endsWith('south')?'declination + zenith distance':'declination − zenith distance']]);return;}
        const i=AL.intercept(la,lo,B.gha,B.dec,c.ho),east=i.lha>180,r=AL.timeSight(la,B.dec,c.ho,B.gha,east);
        out.innerHTML=table([...head,null,
          ['Time sight: longitude',r?`<b>${dmS(r.lon,'E','W')}</b>`:'—',r?`on latitude ${dmS(la)}`:'the altitude can’t be reached at that latitude'],
          ['Intercept from the DR',`<b>${Math.abs(i.a).toFixed(1)}′ ${i.a>=0?'toward':'away'}</b>`,`bearing ${i.zn.toFixed(1)}°; computed altitude ${FM.dm(i.hc)}`]]);}
      else{const ds=ang(V.ds),hm=ang(V.hm),hb=ang(V.hb);if(![ds,hm,hb].every(Number.isFinite)){out.innerHTML='<p class="e-ro">Give the distance and both altitudes, as degrees and minutes.</p>';return;}
        const r=AL.clear(ds,hm,hb,V.bodyL,t,{...O,lat:la,limbM:'L',far:V.far==='Far',dr:{lat:la,lon:lo}});
        out.innerHTML=table([['The Moon’s centre, apparent and true',FM.dm(r.am)+' · '+FM.dm(r.moon.ho),''],[V.bodyL+', apparent and true',FM.dm(r.ab)+' · '+FM.dm(r.body.ho),''],['Apparent distance',FM.dm(r.d),''],
          ['Cleared distance',`<b>${FM.dm(r.Dc)}</b>`,`changing ${Math.abs(r.rate).toFixed(1)}′ an hour${Math.abs(r.rate)<15?': too slow, take another body':''}`],['Greenwich time',`<b>${tod(r.gmt)}</b>`,''],['The chronometer’s error',`<b>${mins((tc-r.gmt)/1000)}</b>`,'+ fast']]);}}
    seg(q('.seg',P),v=>{mode=v;form();});
    q('.ex',P).addEventListener('click',()=>{const la=35,lo=-40,O={eye:6,ic:-1.4,T:18,P:1008},g=a=>FM.dm(a).replace('°',' ').replace('′','');V={...F0};
      if(mode==='sight')V.hs=g(AL.sextant('Sun',Date.UTC(2026,9,18,10,15),la,lo,{...O,limb:'L'}));
      else if(mode==='lat'){const tN=Math.round(AL.noon(lo,Date.UTC(2026,9,18,14,40))/1000)*1000;Object.assign(V,{time:tod(tN,0),hs:g(AL.sextant('Sun',tN,la,lo,{...O,limb:'L'}))});}
      else if(mode==='lunar'){const t=Date.UTC(2026,9,18,21),S=AL.sextantLunar('Markab',t,la,lo,{...O,limbM:'L'});Object.assign(V,{time:'21:17:00',ds:g(S.ds),hm:g(S.hm),hb:g(S.hb)});}
      form();});
    form();return()=>{};});

  /* ---------- numbers in the text: the Wempe's (data-live, what the figures show) from its model's code, the Model 21's (data-ham) from the Hamilton's page (HAMDATA) ---------- */
  function fillLive(){const E=WPHYS.ESC,HL=WESC.HSL,W=WESC.W,B=WESC.B,V={A:Math.round(E.A/D)+'°',D:f1(Math.hypot(W[0]-B[0],W[1]-B[1]),2)+' mm',NT:String(WESC.SET.NT||15),
      hsT:f1(HL.HT,3)+' mm',hsB:f1(HL.HB,2)+' mm',hsTurns:f1(HL.turns,2),halfT:f1(WPHYS.HPT/2,2),susMin:String(Math.round(WPHYS.SUS/60)),msDeg:f1(WPHYS.runPhi(1)/D,1)+'°',I:Math.round(WPHYS.SET.I).toLocaleString('en-US')};
    if(model){const TR=model.R.tr,z=k=>TR[k].userData.wheel.userData.gear.z,zp=k=>TR[k].userData.pin.userData.gear.z;
      Object.assign(V,{cw:z('cw'),tw:z('tw'),sw:z('sw'),cp:zp('cw'),tp:zp('tw'),sp:zp('sw'),ep:model.R.esc.pinion.userData.gear.z,rmin:f1(lever(0),1),rmax:f1(lever(model.R.fu.NRUN),1),run:f1(model.HRUN,1)});}
    qa('[data-live]').forEach(el=>{const v=V[el.dataset.live];if(v!=null)el.textContent=v;});
    qa('[data-ham]').forEach(el=>{const v=HAMDATA.V[el.dataset.ham];if(v!=null)el.textContent=v;});}

  /* ---------- sections and the address: #detent, the section in view (the Hamilton's page and the Wempe's send their old #essay=detent here); links to a section scroll
       to it without a new history entry, links to a model are ordinary (Back returns here, where the essay was) ---------- */
  const H2=qa('h2[id]'),YK='cm-essay-y',secOf=h=>h==='essay'?'':h.startsWith('essay=')?h.slice(6):h;
  function secNow(){let s='';for(const h of H2){if(h.getBoundingClientRect().top-root.getBoundingClientRect().top<150)s=h.id;else break;}return s;}   /* a heading within 150 px of the top: go() puts it at 64, and the figures above it, built as they come near, can push it down a little */
  let scT=0;root.addEventListener('scroll',()=>{if(scT)return;
    scT=requestAnimationFrame(()=>{scT=0;const max=root.scrollHeight-root.clientHeight;prog.style.transform=`scaleX(${max>0?root.scrollTop/max:0})`;
      sset(YK,String(Math.round(root.scrollTop)));const s=secNow();if(s!==sec){sec=s;changed();}});},{passive:true});
  function go(id,smooth){const h=id&&document.getElementById(id);if(h&&root.contains(h)){root.scrollTo({top:h.getBoundingClientRect().top-root.getBoundingClientRect().top+root.scrollTop-64,behavior:smooth&&!RM?'smooth':'auto'});sec=id;}}
  function changed(){history.replaceState(null,'',sec?'#'+sec:location.pathname+location.search);}
  root.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const s=secOf(a.getAttribute('href').slice(1));if(s&&!document.getElementById(s))return;
    e.preventDefault();if(s)go(s,true);else root.scrollTo({top:0,behavior:RM?'auto':'smooth'});sec=s;changed();});
  addEventListener('hashchange',()=>{const s=secOf(location.hash.slice(1));if(s)go(s,true);});
  /* at load: at the section the address names; back at the place it was left at (Back from a model), if that is in the same section */
  {shown=true;document.documentElement.classList.add('essay-on');readPal();fillLive();watch();const s=secOf(location.hash.slice(1)),y=+(sget(YK)||0);
    if(y){root.scrollTop=y;if(s&&secNow()!==s)go(s);}else if(s)go(s);sec=s&&document.getElementById(s)&&secNow()===s?s:secNow();changed();   /* the address as this page writes it: #detent, not the old #essay=detent */last=performance.now();raf=requestAnimationFrame(frame);root.focus({preventScroll:true});}

  /* ---------- the Wempe's movement, built after the page's first frame (the Wempe page's buildWempe, as last revised), then the figures waiting for it ---------- */
  function buildModel(){try{const M=gl().M,mv=buildWempe(M);mv.userData.setRev('last');mv.userData.update(S0);model={mv,M,R:mv.userData.R,HRUN:+(mv.userData.R.fu.NRUN*WPHYS.HPT).toFixed(2)};}
    catch(e){console.error(e);FIGS.forEach(f=>{if(f.need==='model'){f.fail=true;waitNote(f.el,false);}});return;}
    fillLive();FIGS.forEach(f=>{if(f.visible)build(f);});}
  requestAnimationFrame(()=>setTimeout(buildModel,30));
  /* Report a bug or inaccuracy (../chronometer-working-model/js/report.js): the section being read */
  if(typeof REPORT!=='undefined')REPORT.bind({name:'the essay',where:()=>{const h=sec&&document.getElementById(sec);return'The essay'+(h?', “'+h.textContent.trim()+'”':'');},state:()=>[['Page','the essay'+(model?'':', its model not built yet')]]});
  return{on:()=>shown,section:()=>sec,model:()=>model,edges:()=>EDGES};
})();
