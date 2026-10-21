/* essaykit.js: the machinery of an essay tab laid over a model's page, for any of the models: the figures (built the first time they come near the view, drawn only while
   the essay shows and something in them changed), their controls, 2D canvases and line charts, one WebGL renderer off screen shared by every 3D figure, the tabs, the
   sections, the scroll and the URL hash (#essay, #essay=section). Lifted from the Hamilton's essay (chronometer-working-model/js/essay.js, 15 October 2026), which keeps
   its own copy for now: the same DOM (#essay, .e-bar, .e-prog, .tabs with #tabModel and #tabEssay, .e-st stages), the same classes (css/essay.css) and the same behaviour.
   Declares only ESSAYKIT. Needs core.js's clamp, TAU and, for the 3D figures, envTex and mats.
   ESSAYKIT.make({root, fillLive}) returns the kit, or null when the page has no essay:
     fillLive(model): sets the numbers in the text (called when the essay shows and when the model binds);
     K.fig(id, init, need), K.range, K.play, K.seg, K.figOf, K.c2d, K.chart, K.halo (a label haloed in the paper's colour), K.View3D, K.at, K.q, K.qa, K.PAL (the page's colours), K.RM (reduced motion), K.model() (the
     model's API once bound), then K.start() once every figure is registered (it follows the hash until the model binds); K.api is the page's ESSAY: {show, on, section, bind}.
   bind(api): the model's page, once built: at least changed() (wake and write the hash); the rest is the essay's own. */
"use strict";
const ESSAYKIT={make(o){
  const root=document.getElementById(o.root||'essay');
  if(!root)return null;
  const q=(s,r=root)=>r.querySelector(s),qa=(s,r=root)=>[...r.querySelectorAll(s)];
  const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tabs=document.querySelector('.tabs'),home=tabs.parentNode,bar=q('.e-bar'),prog=q('.e-prog');
  let shown=false,model=null,sec='',raf=0,last=0,io=null,fontsOK=false,yKeep=0;const SK=(o.store||'cm')+'-essay-y',KEY=o.key||'essay',KE=KEY+'=';   /* KEY: the hash's key, #essay=section unless the page names another (the Wempe's, #drawings=section: its Essay tab is the Hamilton's essay's page) */
  const sget=k=>{try{return sessionStorage.getItem(k);}catch(_){return null;}},sset=(k,v)=>{try{sessionStorage.setItem(k,v);}catch(_){}};
  const fill=()=>{try{o.fillLive&&o.fillLive(model);}catch(e){console.error(e);}};
  /* the fonts the canvases letter in: a figure drawn once and kept waits for them */
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
  /* a line chart: x0..x1 by y0..y1, ticks xt and yt (formatted by xf, yf), axis names xl and yl, series [{f, color, label at lx, dash, from, to}] (from/to: the x range a
     series is drawn over), points [{x, y, color}] (small marks, not clipped to a series), a dashed cursor at x, marks [{x, y, color}], bands [{x0, x1, y0, y1, color, label}],
     fills [{lo, hi, color}] (a band between two functions of x) */
  function chart(C,o){const{x:ctx,w,h}=C;ctx.clearRect(0,0,w,h);
    const L=o.L??46,R=16,T=16,B=36,pw=w-L-R,ph=h-T-B,X=x=>L+(x-o.x0)/(o.x1-o.x0)*pw,Y=y=>T+(1-(y-o.y0)/(o.y1-o.y0))*ph;
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
    for(const b of o.fills||[]){const a=b.from??o.x0,z=b.to??o.x1;ctx.fillStyle=b.color;ctx.globalAlpha=0.18;ctx.beginPath();
      for(let i=0;i<=120;i++){const x=a+(z-a)*i/120;i?ctx.lineTo(X(x),Y(b.hi(x))):ctx.moveTo(X(x),Y(b.hi(x)));}for(let i=120;i>=0;i--){const x=a+(z-a)*i/120;ctx.lineTo(X(x),Y(b.lo(x)));}ctx.fill();ctx.globalAlpha=1;}
    for(const s of o.series){const a=s.from??o.x0,z=s.to??o.x1;ctx.strokeStyle=s.color;ctx.lineWidth=s.width||2.2;ctx.setLineDash(s.dash||[]);ctx.beginPath();
      for(let i=0;i<=240;i++){const x=a+(z-a)*i/240,y=s.f(x);i?ctx.lineTo(X(x),Y(y)):ctx.moveTo(X(x),Y(y));}ctx.stroke();}
    ctx.setLineDash([]);
    for(const p of o.points||[]){ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(X(p.x),Y(p.y),p.r||2.6,0,TAU);ctx.fill();}
    if(o.cursor!=null){ctx.strokeStyle=PAL.muted;ctx.lineWidth=1;ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(X(o.cursor),T);ctx.lineTo(X(o.cursor),T+ph);ctx.stroke();ctx.setLineDash([]);}
    for(const m of o.marks||[]){ctx.fillStyle=m.color;ctx.strokeStyle=PAL.paper;ctx.lineWidth=2;ctx.beginPath();ctx.arc(X(m.x),Y(clamp(m.y,o.y0,o.y1)),5,0,TAU);ctx.fill();ctx.stroke();}
    ctx.restore();ctx.textBaseline='middle';
    for(const s of o.series){if(!s.label)continue;const lx=X(s.lx)+(s.dx||0),ly=Y(clamp(s.f(s.lx),o.y0,o.y1))+(s.dy??-12);ctx.textAlign=s.la||'left';halo(ctx,s.label,lx,ly,s.color);}
    return{X,Y,L,T,pw,ph};}

  /* a label with a halo of the figure's paper round it, so a line it crosses doesn't cut it */
  function halo(ctx,t,x,y,col){ctx.save();ctx.lineWidth=4;ctx.lineJoin='round';ctx.strokeStyle=PAL.paper;ctx.strokeText(t,x,y);ctx.restore();ctx.fillStyle=col;ctx.fillText(t,x,y);}
  /* ---------- 3D: one renderer for every figure ---------- */
  let G=null;
  function gl(){if(G)return G;const cv=document.createElement('canvas'),r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
    r.setPixelRatio(1);r.outputEncoding=THREE.sRGBEncoding;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.05;r.setClearColor(0x000000,0);r.setScissorTest(true);
    G={r,cv,w:1,h:1,env:envTex(r),M:mats(),scenes:new Set()};
    /* a lost context comes back without the environment map that lights the metals (as the model's) */
    cv.addEventListener('webglcontextlost',e=>e.preventDefault());cv.addEventListener('webglcontextrestored',()=>{G.env=envTex(r);G.scenes.forEach(s=>s.environment=G.env);FIGS.forEach(f=>f.dirty=true);});
    return G;}
  class View3D{
    constructor(st,f,o){this.st=st;this.f=f;this.cv=st.querySelector('canvas');this.x=this.cv.getContext('2d');this.aspect=o.aspect;const g=gl();
      const s=this.scene=new THREE.Scene();s.environment=g.env;g.scenes.add(s);s.add(new THREE.HemisphereLight(0xffffff,0x3a3a3a,0.35));const dl=new THREE.DirectionalLight(0xffffff,1);dl.position.set(3,6,4);s.add(dl);
      this.cam=new THREE.PerspectiveCamera(o.fov||30,1,o.near||1,o.far||4000);this.yaw=o.yaw??0.6;this.pitch=o.pitch??0.5;this.dist=o.dist??100;this.target=new THREE.Vector3(...(o.target||[0,0,0]));
      this.minP=o.minPitch??-1.2;this.maxP=o.maxPitch??1.5;this.labels=[];this.lb=st.querySelector('.e-labels');
      let pid=null,lx=0,ly=0;const cv=this.cv;
      cv.addEventListener('pointerdown',e=>{pid=e.pointerId;lx=e.clientX;ly=e.clientY;try{cv.setPointerCapture(pid);}catch(_){}st.classList.add('grab');});
      cv.addEventListener('pointermove',e=>{if(e.pointerId!==pid)return;const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;this.yaw-=dx*0.009;this.pitch=clamp(this.pitch+dy*0.009,this.minP,this.maxP);f.dirty=true;});
      const up=e=>{if(e.pointerId===pid){pid=null;st.classList.remove('grab');}};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
      new ResizeObserver(()=>this.resize()).observe(st);this.resize();}
    resize(){const w=this.st.clientWidth;if(!w)return;const h=Math.round(w*(typeof this.aspect==='function'?this.aspect(w):this.aspect)),d=Math.min(devicePixelRatio||1,2);
      if(w===this.w&&h===this.h&&d===this.d)return;this.w=w;this.h=h;this.d=d;this.cv.style.height=h+'px';this.cv.width=Math.round(w*d);this.cv.height=Math.round(h*d);this.cam.aspect=w/h;this.cam.updateProjectionMatrix();this.f.dirty=true;}
    label(t,sub,pos){const el=document.createElement('div');el.className='e-lbl';el.innerHTML='<span>'+t+(sub?'<i>'+sub+'</i>':'')+'</span>';this.lb.appendChild(el);const L={el,pos,show:true};this.labels.push(L);return L;}
    render(){const c=Math.cos(this.pitch),cam=this.cam,g=G,r=g.r,W=this.cv.width,H=this.cv.height,D=this.dist*clamp(this.h/this.w/0.62,1,1.7);   /* a taller figure (a phone) steps back, to keep what shows across it */
      cam.position.set(this.target.x+D*c*Math.sin(this.yaw),this.target.y+D*Math.sin(this.pitch),this.target.z+D*c*Math.cos(this.yaw));cam.lookAt(this.target);
      if(g.w<W||g.h<H){g.w=Math.max(g.w,W);g.h=Math.max(g.h,H);r.setSize(g.w,g.h,false);}   /* the buffer only grows: each figure uses its bottom-left corner */
      r.setViewport(0,0,W,H);r.setScissor(0,0,W,H);r.render(this.scene,cam);this.x.clearRect(0,0,W,H);this.x.drawImage(g.cv,0,g.h-H,W,H,0,0,W,H);
      const v=new THREE.Vector3();
      for(const L of this.labels){if(!L.show){L.el.style.opacity=0;continue;}L.pos(v);v.project(cam);const x=(v.x+1)/2*this.w,y=(1-v.y)/2*this.h;
        L.el.style.opacity=(v.z<1&&x>-20&&x<this.w+20)?1:0;L.el.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;}}
  }
  const at=(o3,x,y,z)=>v=>{v.set(x,y,z);o3.localToWorld(v);};

  /* ---------- showing, hiding, sections, the hash ---------- */
  const H2=qa('h2[id]');
  function secNow(){let s='';for(const h of H2){if(h.getBoundingClientRect().top-root.getBoundingClientRect().top<90)s=h.id;else break;}return s;}
  let scT=0;root.addEventListener('scroll',()=>{if(scT||!shown)return;   /* hidden, it has no scroll position (display: none): nothing to note */
    scT=requestAnimationFrame(()=>{scT=0;if(!shown)return;const max=root.scrollHeight-root.clientHeight;prog.style.transform=`scaleX(${max>0?root.scrollTop/max:0})`;
      sset(SK,String(Math.round(root.scrollTop)));const s=secNow();if(s!==sec){sec=s;changed();}});},{passive:true});
  function go(id,smooth){const h=id&&document.getElementById(id);if(h&&root.contains(h)){root.scrollTo({top:h.getBoundingClientRect().top-root.getBoundingClientRect().top+root.scrollTop-64,behavior:smooth&&!RM?'smooth':'auto'});sec=id;}}
  /* the hash while the essay shows: #essay, or #essay=<section> (KEY). Once the model is built its page writes it; before that, the essay does */
  function changed(){if(model)model.changed();else history.replaceState(null,'',shown?'#'+KEY+(sec?'='+sec:''):location.pathname+location.search);}
  function select(on){for(const[b,v]of[[q('#tabModel',tabs),!on],[q('#tabEssay',tabs),on]]){b.setAttribute('aria-selected',v?'true':'false');b.tabIndex=v?0:-1;}}
  function show(on,s){
    if(on===shown){if(on&&s&&s!==sec)go(s,true);return;}
    shown=on;select(on);
    if(on){const d=document;if(d.fullscreenElement||d.webkitFullscreenElement)(d.exitFullscreen||d.webkitExitFullscreen).call(d);
      d.querySelectorAll('dialog[open]').forEach(x=>x.close());
      root.hidden=false;d.documentElement.classList.add('essay-on');bar.appendChild(tabs);readPal();fill();watch();
      if(s&&s!==sec)go(s);else root.scrollTop=yKeep||+(sget(SK)||0);   /* back at the section it was left at (Back from a link into the model): where it was */
      FIGS.forEach(f=>f.dirty=true);last=performance.now();if(!raf)raf=requestAnimationFrame(frame);root.focus({preventScroll:true});}
    else{yKeep=root.scrollTop;root.hidden=true;document.documentElement.classList.remove('essay-on');home.appendChild(tabs);}
  }
  /* the tabs: a click, or the arrow keys between them (the tabs pattern) */
  q('#tabEssay',tabs).addEventListener('click',()=>{show(true);changed();});
  q('#tabModel',tabs).addEventListener('click',()=>{show(false);changed();});
  tabs.addEventListener('keydown',e=>{if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight'&&e.key!=='Home'&&e.key!=='End')return;e.preventDefault();const on=e.key==='ArrowRight'||e.key==='End';show(on);changed();q(on?'#tabEssay':'#tabModel',tabs).focus();});
  /* links within the essay (#essay=section) scroll to their section without a new history entry; links into the model (#view=…) are ordinary: Back returns here.
     A link to the hash already in the address bar fires no hashchange, so it is sent on */
  root.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const h=a.getAttribute('href').slice(1);
    if(h===KEY||h.startsWith(KE)){e.preventDefault();const s=h.slice(KE.length);if(s)go(s,true);else root.scrollTo({top:0,behavior:RM?'auto':'smooth'});sec=s;changed();return;}
    if(location.hash.slice(1)===h){e.preventDefault();dispatchEvent(new HashChangeEvent('hashchange'));}});
  /* before the model is built, its page isn't listening for the hash: the essay follows it itself */
  const own=()=>{if(model)return;const h=location.hash.slice(1);if(h===KEY||h.startsWith(KE))show(true,h.slice(KE.length));else show(false);};
  const api={show,on:()=>shown,section:()=>sec,key:KEY,
    bind(m){model=m;removeEventListener('hashchange',own);if(shown)fill();FIGS.forEach(f=>{if(f.visible)build(f);});}};
  return{root,q,qa,RM,PAL,fig,range,play,seg,figOf,c2d,chart,halo,gl,View3D,at,api,model:()=>model,
    start(){addEventListener('hashchange',own);own();}};
}};
