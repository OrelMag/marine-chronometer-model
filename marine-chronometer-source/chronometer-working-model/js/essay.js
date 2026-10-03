/* essay.js: the Essay tab, 'The Marine Chronometer': how the chronometer keeps time at sea, one idea at a time, with live figures drawn from this model's own code
   (the dial and hands, the escapement's solver and plan, the train's counts, the fusee's profile, the box and gimbals).
   Part of 'The Marine Chronometer, working' (three.js r128). See README.md.
   One IIFE; the page sees only ESSAY. The essay is laid over the model (css/essay.css) and the tabs move into its bar while it shows. A figure is built the first
   time it comes near the view, with the fonts loaded (the dial and the canvases letter in them) and, for those that read the model (its time, its fusee), once
   app.js has built it and called bind(). Figures are drawn only while the essay shows, and only when something in them changed.
   The 3D figures share one WebGL renderer off screen: each is rendered into a corner of its canvas and copied onto its own 2D canvas in the same task (as the
   model's Save button copies its frame), so the page has two WebGL contexts, not one for each figure. */
"use strict";
const ESSAY=(()=>{
  const root=document.getElementById('essay');
  if(!root)return{show(){},on:()=>false,section:()=>'',bind(){}};
  const q=(s,r=root)=>r.querySelector(s),qa=(s,r=root)=>[...r.querySelectorAll(s)];
  const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tabs=document.querySelector('.tabs'),home=tabs.parentNode,bar=q('.e-bar'),prog=q('.e-prog');
  let shown=false,model=null,sec='',raf=0,last=0,io=null,fontsOK=false,yKeep=0;
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

  /* ---------- 3D: one renderer for every figure ---------- */
  let G=null;
  function gl(){if(G)return G;const cv=document.createElement('canvas'),r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
    r.setPixelRatio(1);r.outputEncoding=THREE.sRGBEncoding;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.05;r.setClearColor(0x000000,0);r.setScissorTest(true);
    G={r,cv,w:1,h:1,env:envTex(r),M:mats(),scenes:new Set()};
    /* a lost context comes back without the environment map that lights the metals (as the model's, app.js) */
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
  const at=(o,x,y,z)=>v=>{v.set(x,y,z);o.localToWorld(v);};

  /* ---------- the dial: the model's Hamilton dial (dialCanvas, core.js) with its hands (handShape), at time t (seconds, the hands stepping in half-seconds) and h hours since winding ---------- */
  let DIAL=null;const dial=()=>DIAL||(DIAL=dialCanvas('hamilton'));
  let HANDS=null;
  const hands=()=>HANDS||(HANDS={hour:handShape(36.8*DK,1.2,2.5,'pear',0.68,{boss:2.9,bore:2.33}).extractPoints(20),min:handShape(45.1*DK,1.5,3,'plain',0,{boss:3.2,sq:2.44}).extractPoints(20),
    sec:handShape(SEC_L,0.5,-10,'plain').extractPoints(20),ud:handShape(10.5*DK,0.6,2.5,'plain').extractPoints(20)});   /* the model's hands, movement.js: sizes in mm */
  const udA=h=>UDA(clamp(h,0,RUN_H));   /* the up/down hand: UD_SWEEP degrees from UP to DOWN in 56 h (movement.js, UD) */
  function drawHand(x,p,cx,cy,a,k){x.save();x.translate(cx,cy);x.rotate(a);x.scale(k,-k);x.beginPath();
    for(const loop of[p.shape,...p.holes]){loop.forEach((v,i)=>i?x.lineTo(v.x,v.y):x.moveTo(v.x,v.y));x.closePath();}x.fill('evenodd');x.restore();}
  function paintDial(x,S,t,h,o={}){const c=S/2,k=c/DIAL_R,H=hands();x.drawImage(dial(),0,0,S,S);x.fillStyle='#1d2c74';   /* the dial is DIAL_R in radius (movement.js); sub-dials at their arbors (L.F, L.Ud) */
    const ts=Math.floor(t*2)/2,sy=L.F[1]*k,uy=L.Ud[1]*k;
    drawHand(x,H.ud,c,c+uy,udA(h),k);drawHand(x,H.sec,c,c+sy,((ts/60)%1)*TAU,k);
    for(const y of[uy,sy]){x.beginPath();x.arc(c,c+y,0.9*k,0,TAU);x.fill();}
    drawHand(x,H.hour,c,c,((t/43200)%1)*TAU,k);drawHand(x,H.min,c,c,((t/3600)%1)*TAU,k);}
  const nowT=()=>model?model.time():Date.now()/1000,nowH=()=>model?model.hrs():20;

  /* ---------- hero: the model's dial, keeping the model's time ---------- */
  fig('eHeroSt',f=>{const cv=q('#eHero'),x=cv.getContext('2d'),cap=q('#eHeroCap');let S=0,lk=-1,lh=-1;
    const rs=()=>{const w=cv.clientWidth,d=Math.min(devicePixelRatio||1,2);if(!w)return;S=Math.round(w*d);if(cv.width!==S){cv.width=cv.height=S;f.dirty=true;}};new ResizeObserver(rs).observe(cv);rs();
    return()=>{const t=nowT(),h=nowH(),k=Math.floor(t*2);if(k===lk&&Math.abs(h-lh)<0.02&&!f.dirty)return;lk=k;lh=h;f.dirty=false;paintDial(x,S,t,h);
      const tz=model?model.tz():'gmt',tt=((t%86400)+86400)%86400,hm=[Math.floor(tt/3600),Math.floor(tt%3600/60),Math.floor(tt%60)].map(v=>String(v).padStart(2,'0')).join(':');
      cap.textContent=`The model’s dial: ${hm} ${tz==='gmt'?'Greenwich time':'local time'}, ${Math.max(0,RUN_H-h).toFixed(1)} h of power left`;};});

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

  /* ---------- the balance, in mm: 'uncut', the Model 21's as movement.js builds it, simplified (a stainless-steel rim 1.58 wide and 3.5 deep on an Invar arm, its
     24 holes 15 deg apart, the standard four pairs of balance screws in holes 3, 5, 9 and 12 of each half, the timing weights at the arm's ends and the verniers inside the rim beside them); 'split', a bimetallic rim cut near each end of the arm, steel inside and brass
     outside, with its compensation weights, which set(curl) bends in; 'plain', a plain brass rim, which set(0, grow) enlarges. userData.S: the screws and weights ---------- */
  function balance(M,kind){const g=new THREE.Group(),BR=BAL_R,S=[];
    mesh(g,new THREE.BoxGeometry(2*BR-1,1.1,2.4),kind==='uncut'?M.invar:kind==='plain'?M.brass:M.steel);mesh(g,cylY(2.2,1.3,24),M.steel,0,0.2,0);mesh(g,cylY(0.45,15,12),M.steel,0,2.5,0);
    const radial=(a,r0,len,rr,mat)=>{const m=mesh(g,cylY(rr,len,12),mat,(r0+len/2)*Math.cos(a),0,(r0+len/2)*Math.sin(a));m.rotation.set(0,-a,Math.PI/2);return m;};
    if(kind==='uncut'){mesh(g,ringGeo(BR,BR-1.58,3.5),M.steel);const HA=(h,n)=>h*Math.PI+(n-1)*TAU/24;
      for(const h of[0,1])for(const[n,hh]of[[3,2.03],[5,1.24],[9,2.57],[12,1.24]])S.push(radial(HA(h,n),BR,hh,1.65,M.brass));
      for(const h of[0,1]){S.push(radial(HA(h,1),BR+0.55,1.7,1.2,M.steelD));S.push(radial(HA(h,2),BR-1.58-0.6-1.3,1.3,0.65,M.steelD));}
      g.userData.set=()=>{};}
    else if(kind==='plain'){const r=mesh(g,undefined,M.brass);g.userData.set=(c,grow=0)=>{r.geometry.dispose();r.geometry=ringGeo(BR*(1+grow)+0.8,BR*(1+grow)-0.8,2.4);};}
    else{const span=162*D2R,w=1.6,h=2.4,rims=[0,1].map(()=>[mesh(g,undefined,M.steel),mesh(g,undefined,M.brass)]);
      const wts=[0,1].map(()=>{const p=new THREE.Group();g.add(p);const m=mesh(p,cylY(1.3,h*1.15,16),M.brass2);m.rotation.z=Math.PI/2;S.push(m);return{p,m};});
      for(const s of[-1,1]){const n=mesh(g,cylY(0.7,1.4,12),M.gilt,s*(BR+w*0.5+0.6),0,0);n.rotation.z=Math.PI/2;}
      const band=(a0,rf,w0,w1)=>{const s=new THREE.Shape(),N=40;for(let i=0;i<=N;i++){const u=i/N,a=a0+span*u,r=rf(u)+w1;i?s.lineTo(r*Math.cos(a),r*Math.sin(a)):s.moveTo(r*Math.cos(a),r*Math.sin(a));}
        for(let i=N;i>=0;i--){const u=i/N,a=a0+span*u,r=rf(u)+w0;s.lineTo(r*Math.cos(a),r*Math.sin(a));}const geo=extrude(s,{depth:h,bevelEnabled:false});geo.rotateX(-Math.PI/2);geo.translate(0,-h/2,0);return geo;};
      g.userData.wts=wts;
      g.userData.set=curl=>{for(let k=0;k<2;k++){const a0=k*Math.PI,rf=u=>BR-curl*BR*0.32*u*u,[st,br]=rims[k];st.geometry.dispose();br.geometry.dispose();
        st.geometry=band(a0,rf,-w/2,-w/2+w*0.42);br.geometry=band(a0,rf,-w/2+w*0.42,w/2);const u=0.62,a=a0+span*u;wts[k].p.rotation.y=-a;wts[k].m.position.x=rf(u)+w/2+1.2;}};}
    g.userData.set(0);g.userData.S=S;return g;}
  /* a helical spring with plain ends (the ends straight in to the collet and stud, no terminal curves): its coil's centre drifts sideways as it winds (exaggerated) */
  function plainSpring(R,H,N,th,wire){const c=new THREE.Curve();c.arcLengthDivisions=1200;const Re=R*N/(N+th/TAU*0.8),rc=R*0.2,rs=R*0.3;
    c.getPoint=(t,v=new THREE.Vector3())=>{let ang,r,y,ox=0;
      if(t<0.04){const s=t/0.04;ang=0;r=rc+(Re-rc)*s;y=0;}else if(t>0.96){const s=(t-0.96)/0.04;ang=TAU*N;r=Re-(Re-rs)*s;y=H;}
      else{const s=(t-0.04)/0.92;ang=TAU*N*s;r=Re;y=H*s;ox=Math.sin(Math.PI*s)*0.45*R*(th/(TAU*0.6));}
      const a=ang+th*(1-ang/(TAU*N));return v.set(r*Math.cos(a)+ox,y,-r*Math.sin(a));};
    return closeGeo(new THREE.TubeGeometry(c,Math.round(N*44),wire,6,false));}
  const HS=[5.5,5.9,14,0.17,4.6];   /* the Model 21's hairspring as movement.js draws it: radius, height, turns, wire, the ends' radius (HS_R) */

  /* ---------- the balance and hairspring: T = 2π√(I/κ) ---------- */
  fig('eBal',f=>{const st=f.el,P=figOf(st),V=new View3D(st,f,{aspect:w=>w<520?0.9:0.6,yaw:0.55,pitch:0.5,dist:70,target:[4,1,0]}),M=G.M,A=ESC.A;
    const bal=balance(M,'uncut');V.scene.add(bal);const spr=mesh(V.scene,undefined,M.blued,0,1.3,0);
    mesh(V.scene,new THREE.BoxGeometry(26,1.6,4.5),M.plate,11,HS[1]+2.2,0);mesh(V.scene,new THREE.BoxGeometry(4.5,20,4.5),M.plate,24,-1.6,0);mesh(V.scene,new THREE.BoxGeometry(1.2,1.3,1.4),M.steel,HS[4],HS[1]+1.2,0);
    mesh(V.scene,cylY(21,1.2,64),M.plate,8,-12.2,0);
    V.label('Balance','steel rim, Invar arm',v=>v.set(-BAL_R,0,3));V.label('Hairspring','Elinvar',v=>v.set(-5.5,4.5,0));V.label('Balance cock','',v=>v.set(18,HS[1]+3,0));
    const ins=qa('input[type=range]',P),ro=q('.e-ro',P);let m=1,k=1,ph=0.1,going=!RM,slow=false;
    const upd=()=>{const T=0.5*Math.sqrt(m/k);ro.innerHTML=`Period <b>${T.toFixed(3)} s</b>, or <b>${Math.round(7200/T).toLocaleString('en-US')}</b> vibrations an hour${model?` · moment of inertia ${(model.I0*m).toFixed(0)} g·mm²`:''}`;f.dirty=true;};
    range(ins[0],v=>{m=v;bal.userData.S.forEach(o=>o.scale.set(Math.sqrt(v),1,Math.sqrt(v)));upd();return '×'+v.toFixed(2);});range(ins[1],v=>{k=v;upd();return '×'+v.toFixed(2);});
    q('.slow',P).addEventListener('change',e=>slow=e.target.checked);play(q('.play',P),()=>going,v=>going=v);
    return dt=>{if(going){ph+=dt*(slow?0.2:1)/(0.5*Math.sqrt(m/k));f.dirty=true;}if(!f.dirty)return;f.dirty=false;
      const th=A*Math.sin(TAU*ph);bal.rotation.y=th;spr.geometry.dispose();spr.geometry=springGeo(HS[0],HS[1],HS[2],th,HS[3]*Math.cbrt(k),HS[4],HS[4]);V.render();};},'3d');

  /* ---------- the hairspring close up: terminal curves or plain ends ---------- */
  fig('eSpr',f=>{const st=f.el,P=figOf(st),V=new View3D(st,f,{aspect:w=>w<520?0.95:0.6,yaw:0.45,pitch:0.28,dist:42,target:[0,4.6,0]}),M=G.M,R=5.5,H=9,N=10;
    const spr=mesh(V.scene,undefined,M.blued),staff=new THREE.Group();V.scene.add(staff);mesh(staff,cylY(0.45,14,12),M.steel,0,4.5,0);mesh(staff,cylY(1.4,1.1,24),M.brass,0,0,0);
    mesh(V.scene,new THREE.BoxGeometry(1.4,1.4,1.4),M.brass,R*0.3,H+0.4,0);
    mesh(V.scene,new THREE.CylinderGeometry(R,R,H,48,1,true),new THREE.MeshBasicMaterial({color:0x888888,wireframe:true,transparent:true,opacity:0.16}),0,H/2,0);
    const Lt=V.label('Terminal curve','',v=>v.set(1.8,H,0.5));V.label('Collet on the staff','turns with the balance',v=>v.set(1.2,0,0.8));V.label('Stud','fixed',v=>v.set(R*0.3+0.8,H+1,0));
    let th=0,term=true;const lim=Math.round(ESC.A/D2R),inp=q('input[type=range]',P);inp.min=-lim;inp.max=lim;
    range(inp,v=>{th=v*D2R;f.dirty=true;return v+'°';});seg(q('.seg',P),v=>{term=v==='1';f.dirty=true;});
    return()=>{if(!f.dirty)return;f.dirty=false;spr.geometry.dispose();spr.geometry=term?springGeo(R,H,N,th,0.2):plainSpring(R,H,N,th,0.2);staff.rotation.y=th;Lt.show=term;V.render();};},'3d');

  /* ---------- heat: the split bimetallic balance, a plain brass one, and the Model 21's ---------- */
  fig('eTemp',f=>{const st=f.el,P=figOf(st),V=new View3D(st,f,{aspect:w=>w<520?0.8:0.5,yaw:0.3,pitch:1.1,dist:82,target:[0,0,0]}),M=G.M;
    const B={split:balance(M,'split'),plain:balance(M,'plain'),m21:balance(M,'uncut')};for(const b of Object.values(B))V.scene.add(b);
    const cst=q('#eTempChart'),cf={dirty:true},C=c2d(cst,cf,w=>w<520?0.62:0.34),ro=q('.e-ro',P);let T=20,kind='split';
    const plain=t=>-11*(t-20),comp=t=>1.5*(1-((t-19.5)/12.5)**2),F2C=t=>(t-32)/1.8;   /* illustrative rates, s/day; °F to °C */
    const Lw=V.label('Compensation weight','',v=>B.split.userData.wts[0].m.getWorldPosition(v)),Lb=V.label('Brass outside, steel inside','',v=>v.set(-BAL_R-0.5,0,-6)),Li=V.label('Invar arm','',v=>v.set(-7,0.8,0)),Ls=V.label('Uncut steel rim','',v=>v.set(-BAL_R*0.7,0,-BAL_R*0.72));
    const upd=()=>{for(const k in B)B[k].visible=k===kind;B.split.userData.set(kind==='split'?(T-20)/25*0.6:0);B.plain.userData.set(0,(T-20)/25*0.05);Lw.show=Lb.show=kind==='split';Li.show=Ls.show=kind==='m21';
      if(kind==='m21')ro.innerHTML=`Model 21 at ${T.toFixed(1)} °C: <b>nothing curls</b>. The Invar arm holds the rim’s diameter at its ends; the Elinvar hairspring hardly changes its stiffness.`;
      else{const r=kind==='split'?comp(T):plain(T);ro.innerHTML=`${kind==='split'?'Compensation':'Plain brass'} balance at ${T.toFixed(1)} °C: ${r>=0?'gains':'loses'} <b>${Math.abs(r).toFixed(1)} s a day</b>`;}
      f.dirty=true;cf.dirty=true;};
    range(q('input[type=range]',P),v=>{T=v;upd();return v.toFixed(1)+' °C';});seg(q('.seg',P),v=>{kind=v;upd();});
    return()=>{if(f.dirty){f.dirty=false;V.render();}
      if(cf.dirty){cf.dirty=false;const t55=F2C(55),t90=F2C(90);
        chart(C,{x0:-5,x1:45,y0:-8,y1:8,xt:[0,10,20,30,40],yt:[-8,-4,0,4,8],xf:x=>x+' °C',yf:y=>(y>0?'+':'')+y,xl:'Temperature',yl:'Rate, s a day',cursor:T,
          bands:kind==='m21'?[{x0:t55,x1:t90,y0:-0.6,y1:0.6,color:PAL.blue,label:'the Navy’s limit, 55–90 °F'}]:[],
          series:[{f:plain,color:PAL.red,label:'plain: about −11 s a day per °C',lx:15.5,la:'right',dx:-8,dy:0,width:kind==='plain'?2.6:1.4},{f:comp,color:PAL.brass,label:'bimetallic',lx:19.5,dy:-14,la:'center',width:kind==='split'?2.6:1.4}],
          marks:kind==='m21'?[]:[{x:T,y:kind==='split'?comp(T):plain(T),color:kind==='split'?PAL.brass:PAL.red}]});
        const{x:ctx}=C;ctx.font='11px "Instrument Sans",sans-serif';ctx.fillStyle=PAL.muted;ctx.textAlign='center';const pw=C.w-62;
        for(const[tf,lab]of[[55,'55 °F'],[72.5,'72½'],[90,'90 °F']]){const x=46+(F2C(tf)+5)/50*pw;ctx.fillRect(x-0.5,C.h-40,1,5);ctx.fillText(lab,x,C.h-46);}}};},'3d');

  /* ---------- constant force: the barrel, chain and fusee, in the model's profile ---------- */
  fig('eFus',f=>{const st=f.el,P=figOf(st),V=new View3D(st,f,{aspect:w=>w<520?0.85:0.55,yaw:Math.PI-0.45,pitch:0.42,dist:112,target:[0,3.5,0]}),M=G.M,S=V.scene;
    const fs=model.fs,rf=fs.rf,N=FUSEE_TURNS,H=8.96,yf=m=>H*(1-m/N),Rb=17.6,d=Math.hypot(L.Fu[0]-L.Ba[0],L.Fu[1]-L.Ba[1]),fx=d/2,bx=-d/2,V2=(a,b)=>new THREE.Vector2(a,b);
    /* barrel turns for n fusee turns of chain, as the model reckons them (makeFusee's I, which counts the chain's thickness) */
    const I=n=>fs.I(n);
    const fz=new THREE.Group();fz.position.x=fx;S.add(fz);
    const pts=[V2(0,-1),V2(rf(N)+0.8,-1),V2(rf(N)+0.8,0)];for(let i=0;i<=60;i++){const m=N*(1-i/60);pts.push(V2(rf(m)-0.25,yf(m)));}pts.push(V2(rf(0)+1,H),V2(rf(0)+1,H+0.6),V2(0,H+0.6));
    mesh(fz,new THREE.LatheGeometry(pts,72),M.brass);
    const gc=new THREE.Curve();gc.getPoint=(t,v=new THREE.Vector3())=>{const m=N*t,a=TAU*m-Math.PI/2,r=rf(m)-0.1;return v.set(r*Math.cos(a),yf(m),r*Math.sin(a));};mesh(fz,new THREE.TubeGeometry(gc,Math.round(N*48),0.12,4,false),M.brass2);
    mesh(fz,cylY(0.9,H+10,12),M.steel,0,H/2,0);mesh(fz,new THREE.BoxGeometry(2.4,3,2.4),M.steel,0,H+6.2,0);
    const gw=mesh(fz,gearGeo(TRAIN.fu,MOD.fusee,1.2,{spokes:4}),M.copper,0,-3,0);
    const bz=new THREE.Group();bz.position.x=bx;S.add(bz);mesh(bz,new THREE.CylinderGeometry(Rb,Rb,H+2,64),M.brass2,0,H/2,0);
    for(const y of[-1.2,H+1.2])mesh(bz,new THREE.CylinderGeometry(Rb+0.7,Rb+0.7,0.8,64),M.brass,0,y,0);mesh(bz,cylY(0.6,0.6,10),M.steel,Rb*0.55,H+1.9,0);mesh(bz,cylY(1.1,H+8,12),M.steel,0,H/2,0);
    const chain=mesh(S,undefined,M.chain);let n=0,hrs=6;
    function wind(nn){n=nn;fz.rotation.y=n*TAU;bz.rotation.y=I(n)*TAU;const Pp=[],Vv=(x,y,z)=>Pp.push(new THREE.Vector3(x,y,z));
      for(let m=N;m>n;m-=0.03){const a=-Math.PI/2+TAU*(m-n),r=rf(m);Vv(fx+r*Math.cos(a),yf(m),r*Math.sin(a));}
      const r0=rf(n),y0=yf(n);Vv(fx,y0,-r0);for(const s of[0.25,0.5,0.75])Vv(lerp(fx,bx,s),y0,-lerp(r0,Rb,s));Vv(bx,y0,-Rb);const In=I(n);
      for(let m=n-0.03;m>=0;m-=0.03){const b=-Math.PI/2-TAU*(In-I(m));Vv(bx+Rb*Math.cos(b),yf(m),Rb*Math.sin(b));}if(Pp.length<4)Vv(bx-Rb,y0,0);
      chain.geometry.dispose();chain.geometry=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Pp,false,'centripetal'),Math.min(1600,Pp.length*3),0.38,5,false);}
    V.label('Barrel','mainspring inside',v=>v.set(bx,H+3,0));V.label('Fusee','',v=>v.set(fx,H+2,0));V.label('Chain','',v=>v.set(0,yf(n),-lerp(rf(n),Rb,0.5)));V.label('Fusee wheel','drives the train',v=>v.set(fx+16,-3,0));
    const cst=q('#eFusChart'),cf={dirty:true},C=c2d(cst,cf,w=>w<520?0.6:0.32),ro=q('.e-ro',P),pull=h=>rf(0)/rf(h*FUSEE_PER_HOUR);
    const inp=q('input[type=range]',P);inp.max=RUN_H;
    range(inp,v=>{hrs=v;wind(v*FUSEE_PER_HOUR);ro.innerHTML=`Spring pull <b>${Math.round(pull(v)*100)}%</b> of full, lever arm on the fusee <b>${rf(n).toFixed(1)} mm</b>, ${(rf(n)/rf(0)).toFixed(2)}× the smallest, turning force on the fusee wheel <b>100%</b>`;f.dirty=true;cf.dirty=true;return v.toFixed(1)+' h';});
    return()=>{if(f.dirty){f.dirty=false;V.render();}
      if(cf.dirty){cf.dirty=false;const{X,Y}=chart(C,{x0:0,x1:RUN_H,y0:0,y1:1.1,xt:[0,8,16,24,32,40,48,56],yt:[0,0.25,0.5,0.75,1],yf:y=>Math.round(y*100)+'%',xl:'Hours since winding',yl:'Force',cursor:hrs,
        series:[{f:pull,color:PAL.red,label:'the spring’s pull on the chain',lx:40,dy:16,la:'center'},{f:()=>1,color:PAL.blue,label:'pull × lever: the force on the train',lx:26,dy:-12,la:'center'}],
        marks:[{x:hrs,y:pull(hrs),color:PAL.red},{x:hrs,y:1,color:PAL.blue}]});
        const{x:ctx}=C;ctx.strokeStyle=PAL.muted;ctx.setLineDash([2,3]);ctx.beginPath();ctx.moveTo(X(56),Y(0));ctx.lineTo(X(56),Y(1.1));ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=PAL.muted;ctx.font='11px "Instrument Sans",sans-serif';ctx.textAlign='right';ctx.fillText('rated 56 h',X(56)-4,Y(0.08));}};},'model');

  /* ---------- winding: the up/down dial and the key's half turns ---------- */
  fig('eWind',f=>{const st=f.el,P=figOf(st),C=c2d(st,f,w=>w<520?1.12:0.4),inp=q('input[type=range]',P),ro=q('.e-ro',P),btn=q('.wind',P);let h=20,kw=null;
    const HT=0.5/FUSEE_PER_HOUR;inp.max=RUN_H;   /* hours per half turn of the key: 3.43 */
    const say=()=>{const hf=h/HT,left=RUN_H-h;ro.innerHTML=kw?`Winding: half turn <b>${kw.i}</b> of ${kw.n}, counterclockwise.`:(h<0.05?'<b>Fully wound</b>: the stop-bar has met the winding stop. ':`<b>${(Math.round(hf*2)/2).toString().replace('.5','½').replace(/^0½/,'½')}</b> half turn${hf>1.25?'s':''} of the key to wind it fully. `)+
      (kw?'':`${left.toFixed(1)} h of running left${h>56?', past the 56 hours it is designed for':''}.`);};
    range(inp,v=>{if(kw)return;h=v;say();f.dirty=true;return v.toFixed(1)+' h';});
    btn.addEventListener('click',()=>{if(kw||h<0.05)return;kw={t:0,h0:h,n:Math.ceil(h/HT-1e-6),i:1};});
    return dt=>{if(kw){kw.t+=dt*(RM?4:1);const i=Math.floor(kw.t/0.8);kw.i=Math.min(kw.n,i+1);h=Math.max(0,kw.h0-HT*(i+smooth((kw.t-i*0.8)/0.55)));if(h<=0){h=0;kw=null;}inp.value=h;inp.parentElement.querySelector('output').textContent=h.toFixed(1)+' h';say();f.dirty=true;}
      if(!f.dirty)return;f.dirty=false;const{x:ctx,w,h:H}=C;ctx.clearRect(0,0,w,H);const D=dial(),S=D.width,c=S/2,uy=c+L.Ud[1]*c/DIAL_R,hs=c*0.255*1.3,nw=w<520,sz=nw?Math.min(w*0.62,H*0.52):Math.min(H*0.92,w*0.46),dx=nw?(w-sz)/2:w*0.26-sz/2,dy=nw?8:(H-sz)/2,k=sz/(2*hs)*c/DIAL_R;
      ctx.save();ctx.beginPath();ctx.arc(dx+sz/2,dy+sz/2,sz/2,0,TAU);ctx.clip();ctx.drawImage(D,c-hs,uy-hs,2*hs,2*hs,dx,dy,sz,sz);ctx.fillStyle='#1d2c74';drawHand(ctx,hands().ud,dx+sz/2,dy+sz/2,udA(h),k);ctx.beginPath();ctx.arc(dx+sz/2,dy+sz/2,0.9*k,0,TAU);ctx.fill();ctx.restore();
      ctx.strokeStyle=PAL.rule;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(dx+sz/2,dy+sz/2,sz/2,0,TAU);ctx.stroke();
      /* the key's 17½ half turns from run down, seven to a row (a day's running), those still to go filled */
      const need=h/HT,cols=7,gap=nw?Math.min((w-60)/cols,(H-sz-dy-40)/3.4):Math.min((w-w*0.53-44)/cols,H*0.2),x0=nw?(w-cols*gap-40)/2:w*0.53,r=gap*0.36,y0=nw?dy+sz+gap*1.45:H/2-gap*0.9;
      ctx.font='12px "Instrument Sans",sans-serif';ctx.fillStyle=PAL.muted;ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.fillText('Half turns of the key, from run down',x0,y0-gap*0.7);
      for(let i=0;i<18;i++){const cx=x0+(i%cols+0.5)*gap,cy=y0+Math.floor(i/cols)*gap,half=i===17,full=need-i;ctx.strokeStyle=PAL.rule;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,half?Math.PI/2:Math.PI*1.5);if(half)ctx.closePath();ctx.stroke();
        if(full>0){ctx.fillStyle=PAL.blue;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+TAU*(half?0.5:1)*clamp(full,0,1));ctx.closePath();ctx.fill();}}
      ctx.fillStyle=PAL.muted;ctx.textBaseline='middle';for(const[row,t,c]of[[0,'24 h',7],[1,'48 h',7],[2,Math.round(RUN_H)+' h',4]])ctx.fillText(t,x0+c*gap+6,y0+row*gap);ctx.textBaseline='alphabetic';};});

  /* ---------- maintaining power: the fusee wheel's maintaining work, the model's own parts (bind's R), driven as the model's update() drives them ----------
     The sustaining ratchet stands where the sustaining pawl holds it against a steep face (phaseAgainst, as holdBack leaves it). Running, the fusee's winding ratchet bears on
     the winding pawls and the spring is loaded (d 0); with the key turning for t minutes the fusee and its ratchet turn back under the pawls (half a turn a minute, for the
     figure) and the spring relaxes d = SMAX t/10, turning the fusee wheel on by d while the ratchet stays. Rose: what carries the drive; teal: what holds */
  fig('eMaint',f=>{const st=f.el,P=figOf(st),R=model.R,mv=model.mv,M0=model.M,Fu=L.Fu,SMAX=R.SMAX;
    const V=new View3D(st,f,{aspect:w=>w<520?0.85:0.55,yaw:0.35,pitch:1.05,dist:78,target:[0,8.6,0],minPitch:0.2});
    const root=new THREE.Group();root.rotation.x=Math.PI;root.position.set(-Fu[0],0,Fu[1]);V.scene.add(root);   /* the movement's frame turned over (the train bridge's side up), the fusee's axis at the origin */
    const cl=o=>{const c=o.isMesh?new THREE.Mesh(o.geometry,o.userData.mat0||o.material):new THREE.Group();c.position.copy(o.position);c.quaternion.copy(o.quaternion);c.scale.copy(o.scale);c.visible=o.visible;c.userData.src=o;
      for(const k of o.children)if(!k.isInstancedMesh&&!k.isLight)c.add(cl(k));return c;};
    const gw=cl(R.gw),ss=cl(R.ssg),sr=cl(R.sr),sp=cl(R.spawl);root.add(gw,ss,sr,sp);const spr=ss.children.find(o=>o.userData.src===R.sspring);
    let wr=null;R.fs.g.traverse(o=>{if(!wr&&o.isMesh&&o.userData.hn==='42013')wr=o;});
    const wrg=new THREE.Group();wrg.position.set(Fu[0],0,Fu[1]);root.add(wrg);{mv.updateMatrixWorld(true);const p=new THREE.Vector3();wr.getWorldPosition(p);mv.worldToLocal(p);const m=new THREE.Mesh(wr.geometry,wr.userData.mat0||wr.material);m.position.y=p.y;m.userData.src=wr;wrg.add(m);}
    const wp=sr.children.filter(o=>R.wp.includes(o.userData.src)),srM=[];sr.traverse(o=>{if(o.isMesh&&o.userData.src.userData.mat0===M0.gilt)srM.push(o);});
    /* tints and the see-through ratchet: copies of the model's materials */
    const T=new Map(),tint=(m0,c)=>{const k=m0.uuid+c;let t=T.get(k);if(!t){t=m0.clone();t.color=m0.color.clone().lerp(sc(c),0.8);if(t.emissive){t.emissive=sc(c);t.emissiveIntensity=0.25;}if('metalness'in t){t.metalness=Math.min(m0.metalness,0.2);t.roughness=Math.max(m0.roughness,0.5);}T.set(k,t);}return t;};
    const see=new Map(),ghost=m0=>{let g=see.get(m0);if(!g){g=m0.clone();g.transparent=true;g.opacity=0.45;g.depthWrite=false;see.set(m0,g);}return g;};
    const ROSE='#e0306a',TEAL='#0e9f92',paint=(g,c,gh)=>g.traverse(o=>{if(!o.isMesh)return;const m0=o.userData.src.userData.mat0||o.userData.src.material,k=typeof c==='function'?c(o):c,t=k?tint(m0,k):m0;o.material=gh&&srM.includes(o)?ghost(t):t;});
    const onM=o=>{for(let x=o.userData.src;x&&x!==R.sr;x=x.parent)if(x.userData.lp)return x.userData.lp==='m';return false;};   /* in the ratchet's assembly, the winding pawls, their springs and feet: the mainspring's side */
    /* where the sustaining pawl holds the ratchet, and the pawls' seats (movement.js: seatPawl, phaseAgainst) */
    const q0=[R.spawl.position.x-Fu[0],R.spawl.position.z-Fu[1]],su=R.spawl.userData,srA=phaseAgainst(R.SRP,su.pts,q0,su.base,-1).psi;
    sr.rotation.y=srA;sp.rotation.y=seatPawl(su.pts,toWheel(q0,[0,0],srA),su.base-srA,R.SRP)+srA;
    let t=0,lastD=-1,kw=null,key=0;const ro=q('.e-ro',P),inp=q('input[type=range]',P),out=inp.parentElement.querySelector('output'),btn=q('.wind',P);
    function set(tm,mode){t=tm;const d=SMAX*clamp(tm/10,0,1),wind=mode==='turn'||(!mode&&tm>0);   /* mode: 'turn' the key turning, 'run' let go, or by the slider */gw.rotation.y=ss.rotation.y=srA+d;
      if(Math.abs(d-lastD)>1e-4){lastD=d;spr.geometry.dispose();spr.geometry=R.sspGeo(d);}
      if(wind)key=tm*Math.PI;const fz=srA+R.WPH-(wind?key:Math.floor(key/R.FPR.p)*R.FPR.p);   /* let go, the fusee turns on until its ratchet catches the pawls (update()'s catch): whole teeth from where the key left it */wrg.rotation.y=fz;for(const w of wp){const u=w.userData.src.userData,psi=fz-srA;w.rotation.y=seatPawl(u.pts,toWheel(u.q,[0,0],psi),u.th0-psi,R.FPR)+psi;}
      paint(gw,wind?null:ROSE);paint(ss,ROSE);paint(sr,o=>wind?(onM(o)?null:TEAL):ROSE,true);for(const w of wp)paint(w,wind?null:ROSE);paint(sp,wind?TEAL:null);paint(wrg,wind?null:ROSE);
      const left=10*(1-d/SMAX);ro.innerHTML=wind?`<b>Key turning</b>: the sustaining spring alone drives the fusee wheel, pushing off its ratchet, which the sustaining pawl holds. Relaxed <b>${(d/D2R).toFixed(1)}°</b> of its ${(SMAX/D2R).toFixed(1)}°, <b>${left.toFixed(1)} min</b> of drive left.`:
        '<b>Running</b>: the mainspring, through the fusee, its winding ratchet and pawls, turns the sustaining ratchet, which drives the fusee wheel through the spring at full load.';
      out.textContent=tm.toFixed(1)+' min';f.dirty=true;}
    range(inp,v=>{if(kw)return;set(v);return v.toFixed(1)+' min';});
    btn.addEventListener('click',()=>{if(!kw)kw={t:0};});
    V.label('Sustaining spring','drives while the key turns',at(ss,15.6*Math.cos(Math.PI*0.9),-8.75,15.6*Math.sin(Math.PI*0.9)));V.label('Sustaining ratchet','',at(sr,14.6*Math.cos(-2.2),-9.45,14.6*Math.sin(-2.2)));
    V.label('Sustaining pawl','holds the ratchet',at(sp,0,0,0));V.label('Fusee wheel','to the train',at(gw,18.8*Math.cos(2.4),-6.5,18.8*Math.sin(2.4)));V.label('Winding ratchet','on the fusee',at(wrg,0,wrg.children[0].position.y,0));
    set(0);
    return dt=>{if(kw){kw.t+=dt/(RM?4:1);const T1=4,T2=4.6,T3=5.2;   /* the key turns 3 minutes' worth in 4 s, rests, lets go, and the mainspring loads the spring again */
        if(kw.t<T1)set(3*smooth(kw.t/T1),'turn');else if(kw.t<T2)set(3,'turn');else if(kw.t<T3)set(3*(1-smooth((kw.t-T2)/(T3-T2))),'run');else{kw=null;set(0,'run');}inp.value=t;}
      if(!f.dirty)return;f.dirty=false;V.render();};},'model');

  /* ---------- counting: the centre, third, fourth and escape wheels, with the model's counts and modules ---------- */
  fig('eTrain',f=>{const st=f.el,P=figOf(st),M=gl().M,T=TRAIN,S0=new THREE.Group(),dCT=MOD.centre*(T.cw+T.tp)/2,dTF=MOD.train*(T.tw+T.fp)/2,dFE=MOD.fourth*(T.fw+T.ep)/2;
    const pl=(p,d,a)=>[p[0]+d*Math.cos(a*D2R),p[1]+d*Math.sin(a*D2R)],C0=[0,0],Tp=pl(C0,dCT,-25),Fp=pl(Tp,dTF,40),Ep=pl(Fp,dFE,-35),mid=[(C0[0]+Ep[0])/2,(C0[1]+Ep[1])/2];
    const V=new View3D(st,f,{aspect:w=>w<520?0.95:0.58,yaw:0.25,pitch:0.85,dist:98,target:[mid[0],2,mid[1]]});V.scene.add(S0);
    const ptr=(g,len)=>mesh(g,new THREE.BoxGeometry(len,0.5,0.9),M.blued,len/2,9.3,0);
    const cw=arbor(S0,M,...C0,{wheel:{n:T.cw,m:MOD.centre,y:1.8,th:1,spokes:5},ar:[-3,9],r:0.75});ptr(cw,9);   /* stacked as Figs. 13, 29 and 110: the third wheel lowest, its pinion above it meshing the centre wheel; the fourth pinion under its wheel, meshing the third wheel */
    const tw=arbor(S0,M,...Tp,{wheel:{n:T.tw,m:MOD.train,y:0,th:0.9,spokes:5,cside:-1},pin:{n:T.tp,m:MOD.centre,y:1.8,th:2.6},ar:[-3,9]});ptr(tw,5);
    const fw=arbor(S0,M,...Fp,{wheel:{n:T.fw,m:MOD.fourth,y:3.6,th:0.9,spokes:5,cside:1},pin:{n:T.fp,m:MOD.train,y:1.475,th:3.25},ar:[-3,9]});ptr(fw,6);
    const ew=arbor(S0,M,...Ep,{pin:{n:T.ep,m:MOD.fourth,y:3.6,th:2},ar:[-3,9]});escapeWheel(ew,M,ES,5.4,ESC);ptr(ew,4);
    const eT=T.ew/2;   /* the escape wheel turns once in ew half seconds */
    V.label('Centre wheel',`${T.cw} teeth, 1 turn / ${turnT(ESC_PER.cw*eT)}`,v=>v.set(C0[0]-10,2.3,C0[1]+7));V.label('Third wheel',`${T.tw} teeth, 1 turn / ${turnT(ESC_PER.tw*eT)}`,v=>v.set(Tp[0]+1,0.5,Tp[1]+9));
    V.label('Fourth wheel',`${T.fw} teeth, 1 turn / ${turnT(ESC_PER.fw*eT)}`,v=>v.set(Fp[0]+2,4.1,Fp[1]-9));V.label('Escape wheel',`${T.ew} teeth, 1 turn / ${turnT(eT)}`,v=>v.set(Ep[0]+3,6,Ep[1]+4));
    let t=0,speed=1,going=!RM;range(q('input[type=range]',P),v=>{speed=Math.pow(120,v);return '×'+(speed<10?speed.toFixed(1):Math.round(speed));});play(q('.play',P),()=>going,v=>going=v);
    return dt=>{if(going){t+=dt*speed;f.dirty=true;}if(!f.dirty)return;f.dirty=false;
      let b;if(speed<6){const k=Math.floor(t*2);b=k+smooth((t*2-k)/0.12);}else b=t*2;   /* beats: half seconds, stepping below 6× */
      const esc=b*ESC.P;ew.rotation.y=-ESC.t0+esc;fw.rotation.y=-esc/ESC_PER.fw;tw.rotation.y=esc/ESC_PER.tw;cw.rotation.y=-esc/ESC_PER.cw;V.render();};},'3d');

  /* ---------- the detent: the model's own escapement, solved (ESC), drawn in plan (drawEscPlan, ../shared/escplan.js) ---------- */
  fig('eEsc',f=>{const st=f.el,P=figOf(st),C=c2d(st,f,w=>w<520?0.84:0.8);let ph=0.15,speed=0.08,going=!RM;
    const phIn=q('.phase',P),spIn=q('.speed',P),ro=q('.e-ro',P);
    const TXT={free:'The wheel is locked and the balance swings freely.',unlock:'Unlocking: the unlocking jewel pushes the trip spring against the horn and lifts the detent off its stop.',
      drop:'Unlocked: the locking jewel is clear, and the escape wheel drops forward onto the impulse jewel.',impulse:'Impulse: a tooth drives the impulse jewel, pushing the balance.',
      relock:'The detent falls back onto its stop, and the locking jewel catches the next tooth.',pass:'Return swing: the trip spring bends away from the horn. The detent doesn’t move.'};
    range(phIn,v=>{ph=v/1000;f.dirty=true;return Math.round(v/10)+'%';});const upB=play(q('.play',P),()=>going,v=>going=v);
    phIn.addEventListener('pointerdown',()=>{going=false;upB();});range(spIn,v=>{speed=v;return '×'+v.toFixed(2);});
    return dt=>{if(going){ph=(ph+dt*speed/0.5)%1;phIn.value=Math.round(ph*1000);phIn.parentElement.querySelector('output').textContent=Math.round(ph*100)+'%';f.dirty=true;}if(!f.dirty)return;f.dirty=false;
      const s=ESC.state(ph);drawEscPlan(C.x,C.w,C.h,s,s.prog,{labels:'full',gauge:true,box:[-2.85,1.75,-2.5,1.2],pal:PAL});
      ro.innerHTML=`<b>${s.ccw?'Unlocking swing.':'Return swing.'}</b> ${TXT[escStage(s)]||TXT.free}`;};});

  /* ---------- level on a moving ship: the model's own box, gimbal ring, case and latch (buildBox, box.js), with its dial ---------- */
  fig('eGim',f=>{const st=f.el,P=figOf(st),V=new View3D(st,f,{aspect:w=>w<520?0.9:0.58,yaw:0.9,pitch:0.36,dist:840,target:[0,32,0],near:20,far:5000}),M=G.M,S=V.scene;
    const BX=buildBox(M);S.add(BX.root);BX.mid.rotation.x=-1.6;BX.top.rotation.x=-0.32;
    const dc=document.createElement('canvas');dc.width=dc.height=1024;const dx=dc.getContext('2d'),tex=new THREE.CanvasTexture(dc);tex.encoding=THREE.sRGBEncoding;
    mesh(BX.bowl,cylY(DIAL_R,DIAL_T,96),M.brass2,0,MR_Y+DIAL_T/2,0);mesh(BX.bowl,new THREE.CircleGeometry(DIAL_R,96).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({map:tex,metalness:0.35,roughness:0.42,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),0,MR_Y+DIAL_T+0.3,0);   /* the dial, 0.3 over its disc, held in front of it as the model's is */
    const sh=mesh(S,new THREE.PlaneGeometry(640,640).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:shadowTex(),transparent:true,opacity:0.7,depthWrite:false}),0,-101,0);sh.renderOrder=-1;
    V.label('Gimbal ring','',at(BX.ring,BX.RO,8,0));V.label('Case','hangs level',at(BX.bowl,-BX.CR*0.7,-40,BX.CR*0.7));V.label('Latch','',at(BX.root,80,-13,76));
    let amp=18,t=0,going=!RM,lock=false,lk=0,lt=-1;
    range(q('input[type=range]',P),v=>{amp=v;f.dirty=true;return v+'°';});q('.lock',P).addEventListener('change',e=>{lock=e.target.checked;f.dirty=true;});play(q('.play',P),()=>going,v=>going=v);
    return dt=>{if(going){t+=dt;f.dirty=true;}const l0=lk;lk=RM?+lock:clamp(lk+(lock?1:-1)*dt*1.2,0,1);if(lk!==l0)f.dirty=true;
      const tt=Math.floor(nowT());if(tt!==lt){lt=tt;paintDial(dx,1024,nowT(),nowH());tex.needsUpdate=true;f.dirty=true;}
      if(!f.dirty)return;f.dirty=false;const a=amp*D2R,roll=a*Math.sin(t*0.9),pitch=a*0.55*Math.sin(t*0.63+1.1),fr=1-smooth(Math.min(1,lk*2));
      BX.root.rotation.set(pitch,0,roll,'ZYX');BX.ring.rotation.x=-pitch*fr;BX.bowl.rotation.z=-roll*fr;BX.latch.rotation.y=lerp(LATCH_OFF,LATCH_ON,smooth(Math.max(0,lk*2-1)));V.render();};},'3d');

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

  /* ---------- numbers in the text, from the model's code (the escapement's figures follow the adjuster's bench) ---------- */
  function fillLive(){const m=ESC.measure(),T=TRAIN,f1=(v,n=1)=>v.toFixed(n),V={lock:f1(m.lock)+'°',letoff:f1(m.letoff)+'°',drop:f1(m.drop)+'°',overall:f1(m.overall)+'°',shake:f1(m.shake,3)+' mm',horn:f1(m.hornClr,2)+' mm',D:f1(m.D,2)+' mm',
      roller:f1(2*ESC.rRoll*ESC.ES,1)+' mm',A:Math.round(ESC.A/D2R)+'°',AMIN:Math.round(ESC.AMIN/D2R)+'°',motion:f1(2*ESC.A/TAU,2),ew:T.ew,fu:T.fu,cp:T.cp,cw:T.cw,tw:T.tw,fw:T.fw,tp:T.tp,fp:T.fp,ep:T.ep,
      gwT:(TRAIN.ew/2*ESC_PER.gw/3600).toFixed(2)+' hours',ssDeg:(FUSEE_PER_HOUR*360/6).toFixed(1)+'°',halfT:(0.5/FUSEE_PER_HOUR).toFixed(2),run:Math.round(RUN_H),turns:'8¾',
      I0:model?Math.round(model.I0/10)*10:1140,rmin:model?f1(model.fs.rf(0)):'7.0',rmax:model?f1(model.fs.rf(FUSEE_TURNS)):'14.8'};
    V.kappa=f1(V.I0*1e-9*(4*Math.PI)**2*1e6,0);   /* κ = I (2π/T)², T = 0.5 s, in µN·m per radian */
    qa('[data-live]').forEach(el=>{const v=V[el.dataset.live];if(v!=null)el.textContent=v;});}

  /* ---------- showing, hiding, sections, the hash ---------- */
  const H2=qa('h2[id]');
  function secNow(){let s='';for(const h of H2){if(h.getBoundingClientRect().top-root.getBoundingClientRect().top<90)s=h.id;else break;}return s;}
  let scT=0;root.addEventListener('scroll',()=>{if(scT||!shown)return;   /* hidden, it has no scroll position (display: none): nothing to note */
  scT=requestAnimationFrame(()=>{scT=0;if(!shown)return;const max=root.scrollHeight-root.clientHeight;prog.style.transform=`scaleX(${max>0?root.scrollTop/max:0})`;
    sset('cm-essay-y',String(Math.round(root.scrollTop)));const s=secNow();if(s!==sec){sec=s;changed();}});},{passive:true});
  function go(id,smooth){const h=id&&document.getElementById(id);if(h&&root.contains(h)){root.scrollTo({top:h.getBoundingClientRect().top-root.getBoundingClientRect().top+root.scrollTop-64,behavior:smooth&&!RM?'smooth':'auto'});sec=id;}}
  /* the hash while the essay shows: #essay, or #essay=<section>. Once the model is built app.js writes it (hashOf); before that, the essay does */
  function changed(){if(model)model.changed();else history.replaceState(null,'',shown?'#essay'+(sec?'='+sec:''):location.pathname+location.search);}
  function select(on){for(const[b,v]of[[q('#tabModel',tabs),!on],[q('#tabEssay',tabs),on]]){b.setAttribute('aria-selected',v?'true':'false');b.tabIndex=v?0:-1;}}
  function show(on,s){
    if(on===shown){if(on&&s&&s!==sec)go(s,true);return;}
    shown=on;select(on);
    if(on){const d=document;if(d.fullscreenElement||d.webkitFullscreenElement)(d.exitFullscreen||d.webkitExitFullscreen).call(d);
      d.querySelectorAll('dialog[open]').forEach(x=>x.close());
      root.hidden=false;d.documentElement.classList.add('essay-on');bar.appendChild(tabs);readPal();fillLive();watch();
      if(s&&s!==sec)go(s);else root.scrollTop=yKeep||+(sget('cm-essay-y')||0);   /* back at the section it was left at (Back from a link into the model): where it was */
      FIGS.forEach(f=>f.dirty=true);last=performance.now();if(!raf)raf=requestAnimationFrame(frame);root.focus({preventScroll:true});}
    else{yKeep=root.scrollTop;root.hidden=true;document.documentElement.classList.remove('essay-on');home.appendChild(tabs);}
  }
  /* the tabs: a click, or the arrow keys between them (the tabs pattern) */
  q('#tabEssay',tabs).addEventListener('click',()=>{show(true);changed();});
  q('#tabModel',tabs).addEventListener('click',()=>{show(false);changed();});
  tabs.addEventListener('keydown',e=>{if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight'&&e.key!=='Home'&&e.key!=='End')return;e.preventDefault();const on=e.key==='ArrowRight'||e.key==='End';show(on);changed();q(on?'#tabEssay':'#tabModel',tabs).focus();});
  /* links within the essay (#essay=section) scroll to their section without a new history entry; links into the model (#tour=3, #view=…) are ordinary: Back returns here.
     A link to the hash already in the address bar fires no hashchange, so it is sent on */
  root.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const h=a.getAttribute('href').slice(1);
    if(h==='essay'||h.startsWith('essay=')){e.preventDefault();const s=h.slice(6);if(s)go(s,true);else root.scrollTo({top:0,behavior:RM?'auto':'smooth'});sec=s;changed();return;}
    if(location.hash.slice(1)===h){e.preventDefault();dispatchEvent(new HashChangeEvent('hashchange'));}});
  /* before the model is built, app.js isn't listening for the hash: the essay follows it itself */
  const own=()=>{if(model)return;const h=location.hash.slice(1);if(h==='essay'||h.startsWith('essay='))show(true,h.slice(6));else show(false);};
  addEventListener('hashchange',own);own();
  return{show,on:()=>shown,section:()=>sec,
    /* app.js, once the model is built: its time, wind and tz, the fusee (rf, I), the balance's moment of inertia, changed() (wake and write the hash), and its parts (R, mv) and materials (M), which the maintaining work's figure clones */
    bind(api){model=api;removeEventListener('hashchange',own);if(shown)fillLive();FIGS.forEach(f=>{if(f.visible)build(f);});}};
})();
