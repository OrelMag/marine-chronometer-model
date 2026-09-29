
/* ---------- F6 train ---------- */
function initTrain(){
  const st=$('#f-train');const V=new View3D(st,{aspect:w=>w<520?0.95:0.58,yaw:0.25,pitch:0.85,dist:4.4,target:[-0.05,0.1,0.02]});
  const M=mats();const S=V.scene;
  const C0=[-0.75,0.1],pl=(p,d,a)=>[p[0]+d*Math.cos(a*D2R),p[1]+d*Math.sin(a*D2R)];
  const T=pl(C0,0.54,-25),F=pl(T,0.51,40),E=pl(F,0.54,-35);
  const hand=(g,len,y)=>{const h=new THREE.Mesh(new THREE.BoxGeometry(len,0.012,0.022),M.blued);h.position.set(len/2,y,0);g.add(h);};
  const cw=wheelSet(S,M,...C0,{wheel:{n:80,r:0.48,y:0,th:0.025,spokes:4},arbor:[-0.08,0.42],ar:0.013});hand(cw,0.4,0.43);
  const tw=wheelSet(S,M,...T,{wheel:{n:75,r:0.45,y:0.08,th:0.025,spokes:4},pin:{r:0.06,y:0.0,th:0.05},arbor:[-0.08,0.4]});hand(tw,0.14,0.41);
  const fw=wheelSet(S,M,...F,{wheel:{n:60,r:0.48,y:0.16,th:0.025,spokes:4},pin:{r:0.06,y:0.08,th:0.05},arbor:[-0.08,0.4]});hand(fw,0.2,0.41);
  const ew=wheelSet(S,M,...E,{wheel:{n:16,r:0.2,y:0.24,th:0.025,escape:true,flip:true,depth:0.06,spokes:4,mat:M.gilt},pin:{r:0.06,y:0.16,th:0.05},arbor:[-0.08,0.4]});hand(ew,0.12,0.41);
  mesh(S,new THREE.BoxGeometry(2.4,0.03,1.3),M.brass2,-0.3,-0.1,0.05);
  V.label('Centre wheel','1 turn an hour',v=>v.set(C0[0]-0.35,0.02,C0[1]+0.28));
  V.label('Third wheel','1 turn in 7½ min',v=>v.set(T[0]+0.05,0.1,T[1]+0.36));
  V.label('Fourth wheel','1 turn a minute',v=>v.set(F[0]+0.1,0.18,F[1]-0.38));
  V.label('Escape wheel','16 teeth, 1 turn in 8 s',v=>v.set(E[0]+0.1,0.26,E[1]+0.16));
  let t=0,speed=1,playing=!RM;
  bindRange($('input[type=range]',st.parentElement),v=>{speed=Math.pow(120,v);return '×'+(speed<10?speed.toFixed(1):Math.round(speed));});
  bindPlay($('.play',st.parentElement),()=>playing,v=>playing=v);
  const f=V.fig=addFig(st,dt=>{if(playing){t+=dt*speed;f.dirty=true;}if(!f.dirty)return;f.dirty=false;
    let ts;if(speed<6){const k=Math.floor(t*2),e=smooth((t*2-k)/0.12);ts=(k+e)/2;}else ts=t;
    cw.rotation.y=-(ts/3600)*TAU;tw.rotation.y=(ts/450)*TAU;fw.rotation.y=-(ts/60)*TAU;ew.rotation.y=(ts/8)*TAU;V.render();});
}

/* ---------- F7 detent escapement (2D) ---------- */
/* The Hamilton Model 21 escapement, the working model's own solver (../shared/escapement.js, makeEsc): unit = escape-wheel radius (6.58 mm),
   balance at the origin, wheel 9.40 mm away. Layout after the manual's Fig. 90; the settings meet its adjustment figures (Sec. VIII), which
   chronometer-working-model/tools/escapement.js checks. */
const ESC=makeEsc();
function initEsc(){
  const st=$('#f-esc');const C=canvas2D(st,w=>w<520?0.84:0.8);
  const E=ESC,RT=1,RR=0.77;
  let phase=0.15,speed=0.08,playing=!RM;
  const phIn=$('.phase',st.parentElement),spIn=$('.speed',st.parentElement),btn=$('.play',st.parentElement),ro=$('#esc-read');
  const stage=s=>!s.ccw?(s.psDef>0.002?'passing':'free'):s.prog>0&&s.prog<1?(s.prog<0.25?'drop':'impulse'):s.lift>0.002?(s.prog?'relock':'unlock'):'free';
  const TXT={free:'The wheel is locked and the balance swings freely.',unlock:'Unlocking: the discharging pallet pushes the passing spring against the horn and lifts the detent off its stop.',
    drop:'Unlocked: the locking stone is clear and the escape wheel drops forward into the roller’s crescent.',impulse:'Impulse: a tooth drives the impulse pallet, pushing the balance.',
    relock:'The detent falls back onto its stop and the locking stone catches the next tooth.',passing:'Return swing: the passing spring bends away from the horn. The detent doesn’t move.'};
  const f=C.fig=addFig(st,dt=>{if(playing){phase=(phase+dt*speed/0.5)%1;phIn.value=Math.round(phase*1000);f.dirty=true;}if(!f.dirty)return;f.dirty=false;draw();});
  bindRange(phIn,v=>{phase=v/1000;f.dirty=true;return Math.round(v/10)+'%';});
  phIn.addEventListener('pointerdown',()=>{playing=false;upBtn();});
  bindRange(spIn,v=>{speed=v;return '×'+v.toFixed(2);});
  const upBtn=bindPlay(btn,()=>playing,v=>playing=v);
  function draw(){
    const{ctx,w,h}=C;ctx.clearRect(0,0,w,h);const s=E.state(phase),narrow=w<520;
    const x0=-2.85,x1=1.75,y0=-2.5,y1=1.2,sc=Math.min(w/(x1-x0),h/(y1-y0)),ox=(w-(x1-x0)*sc)/2-x0*sc,oy=(h-(y1-y0)*sc)/2+y1*sc;
    const X=x=>ox+x*sc,Y=y=>oy-y*sc;
    const brass=PAL.brass,ink=PAL.ink,ruby='#c3163b',phi=-(s.prog%1)*E.P;
    // escape wheel
    ctx.beginPath();let first=true;
    for(let k=0;k<E.NT;k++){const a=E.t0+k*E.P+phi;const pts=[[RR,a-0.005],[RT,a]];for(let j=1;j<=6;j++){const q=j/6;pts.push([RT-(RT-RR)*Math.pow(q,0.6),a+E.P*0.72*q]);}pts.push([RR,a+E.P*0.99]);
      for(const[r,aa]of pts){const px=X(E.EX+r*Math.cos(aa)),py=Y(r*Math.sin(aa));first?ctx.moveTo(px,py):ctx.lineTo(px,py);first=false;}}
    ctx.closePath();ctx.fillStyle=brass;ctx.globalAlpha=0.85;ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle=ink;ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle=PAL.paper;ctx.beginPath();ctx.arc(X(E.EX),Y(0),0.62*sc,0,TAU);ctx.fill();
    ctx.strokeStyle=brass;ctx.lineWidth=0.09*sc;ctx.globalAlpha=0.85;
    for(let k=0;k<4;k++){const a=phi+k*TAU/4+0.3;ctx.beginPath();ctx.moveTo(X(E.EX),Y(0));ctx.lineTo(X(E.EX+0.64*Math.cos(a)),Y(0.64*Math.sin(a)));ctx.stroke();}
    ctx.globalAlpha=1;ctx.fillStyle=brass;ctx.beginPath();ctx.arc(X(E.EX),Y(0),0.14*sc,0,TAU);ctx.fill();ctx.fillStyle=ink;ctx.beginPath();ctx.arc(X(E.EX),Y(0),0.035*sc,0,TAU);ctx.fill();
    // impulse roller with its crescent: the teeth dip into it to reach the jewel, which ends flush with the roller
    const arc=(r,a0,a1,n)=>{for(let i=0;i<=n;i++){const q=a0+(a1-a0)*i/n;ctx.lineTo(X(r*Math.cos(q)),Y(r*Math.sin(q)));}},ai=E.aIc+s.th,rr=E.rRoll;
    ctx.beginPath();arc(rr,ai+0.16,ai-0.6+TAU,60);arc(rr*0.55,ai-0.6,ai,12);arc(rr*0.86,ai,ai+0.16,4);ctx.closePath();
    ctx.fillStyle=PAL.steel;ctx.globalAlpha=0.25;ctx.fill();ctx.globalAlpha=0.7;ctx.strokeStyle=PAL.steel;ctx.lineWidth=1.2;ctx.stroke();ctx.globalAlpha=1;
    const jewel=(ang,r0,r1,wd)=>{const c=Math.cos(ang),sn=Math.sin(ang),px=-sn*wd/2,py=c*wd/2;ctx.fillStyle=ruby;ctx.beginPath();
      ctx.moveTo(X(r0*c+px),Y(r0*sn+py));ctx.lineTo(X(r1*c+px),Y(r1*sn+py));ctx.lineTo(X(r1*c-px),Y(r1*sn-py));ctx.lineTo(X(r0*c-px),Y(r0*sn-py));ctx.closePath();ctx.fill();};
    jewel(ai,rr-0.08,E.rp,E.wI);
    // detent: foot, support block and stop button fixed; the rest turns about the point of flexure
    const del=-s.lift/E.LEN,cd=Math.cos(del),sd=Math.sin(del),Ft=E.Ft;
    const R=p=>({x:Ft.x+(p.x-Ft.x)*cd-(p.y-Ft.y)*sd,y:Ft.y+(p.x-Ft.x)*sd+(p.y-Ft.y)*cd});
    const poly=(pts,col,fix)=>{ctx.beginPath();pts.forEach((q,i)=>{const r=fix?q:R(q);i?ctx.lineTo(X(r.x),Y(r.y)):ctx.moveTo(X(r.x),Y(r.y));});ctx.closePath();ctx.fillStyle=col;ctx.fill();};
    ctx.globalAlpha=0.35;for(const k in E.fixed)poly(E.fixed[k],k==='foot'?PAL.copper:PAL.steel,true);ctx.globalAlpha=1;
    for(const k in E.pieces)poly(E.pieces[k],k==='stone'?ruby:PAL.copper);
    const[a0,am,tp]=E.springPts(s);
    ctx.strokeStyle=PAL.steel;ctx.lineWidth=Math.max(2,0.014*sc);ctx.beginPath();ctx.moveTo(X(a0.x),Y(a0.y));ctx.quadraticCurveTo(X(am.x),Y(am.y),X(tp.x),Y(tp.y));ctx.stroke();
    // discharging roller
    ctx.fillStyle=PAL.steel;ctx.beginPath();ctx.arc(X(0),Y(0),E.rDR*sc,0,TAU);ctx.fill();ctx.strokeStyle=ink;ctx.lineWidth=1;ctx.stroke();
    jewel(E.aD+s.th,E.rDR-0.05,E.rd,E.wD);
    ctx.fillStyle=ink;ctx.beginPath();ctx.arc(X(0),Y(0),0.03*sc,0,TAU);ctx.fill();
    // labels
    ctx.font=(narrow?11:12)+'px "Instrument Sans",sans-serif';ctx.fillStyle=ink;ctx.strokeStyle=PAL.muted;ctx.lineWidth=0.8;
    const lab=(t,p,lx,ly,al)=>{ctx.beginPath();ctx.moveTo(X(p.x),Y(p.y));ctx.lineTo(X(lx),Y(ly));ctx.stroke();ctx.textAlign=al||'left';ctx.textBaseline='middle';ctx.fillText(t,X(lx)+(al==='right'?-4:4),Y(ly));};
    lab('Escape wheel',{x:E.EX-0.5,y:0.78},E.EX-0.75,1.08);
    lab('Locking stone',R(E.S),-1.55,-1.15,'right');
    lab('Detent',R(E.D(1.2,-0.045)),-1.6,-1.6,'right');
    lab('Point of flexure',E.D(0.3,-0.052),-1.75,-2.15,'right');
    lab('Stop button',E.D(E.BL-0.15,-0.07),-0.2,-1.95,'left');
    lab('Horn',R(E.D(E.tH-0.035,E.nR+E.rho+0.05)),0.55,-1.45,'left');
    lab('Passing spring',R(E.D(E.tH-0.5,E.nR)),0.55,-1.05,'left');
    const dp={x:E.rd*Math.cos(E.aD+s.th),y:E.rd*Math.sin(E.aD+s.th)};lab('Discharging pallet',dp,0.55,-0.6,'left');
    const ip={x:E.rp*Math.cos(ai),y:E.rp*Math.sin(ai)};lab('Impulse pallet',ip,-0.25,0.95,'left');
    lab('Impulse roller',{x:rr*Math.cos(ai+2.2),y:rr*Math.sin(ai+2.2)},0.62,0.2,'left');
    // balance gauge
    const gx=X(1.35),gy=Y(0.9),gr=Math.min(30,0.24*sc);
    ctx.strokeStyle=PAL.rule;ctx.lineWidth=2;ctx.beginPath();ctx.arc(gx,gy,gr,0,TAU);ctx.stroke();
    ctx.strokeStyle=PAL.blue;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(gx,gy);ctx.lineTo(gx+gr*Math.cos(-Math.PI/2-s.th),gy+gr*Math.sin(-Math.PI/2-s.th));ctx.stroke();
    ctx.fillStyle=PAL.muted;ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText('balance',gx,gy+gr+4);
    ctx.fillText((Math.round(s.th/D2R)||0)+'°',gx,gy+gr+18);
    ro.innerHTML=`<b>${s.ccw?'Counterclockwise swing.':'Clockwise swing.'}</b> ${TXT[stage(s)]}`;
  }
}

/* ---------- F8 gimbals ---------- */
function initGimbal(){
  const st=$('#f-gimbal');const V=new View3D(st,{aspect:w=>w<520?0.9:0.58,yaw:0.9,pitch:0.32,dist:7.2,target:[0,-0.55,0]});
  const M=mats();const CH=buildChrono(M,dialTexture(V.r),false);V.scene.add(CH.root);
  const sh=new THREE.Mesh(new THREE.PlaneGeometry(5.5,5.5).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:shadowTex(),transparent:true,depthWrite:false}));sh.position.y=-1.6;V.scene.add(sh);
  V.label('Gimbal ring','',worldOf(CH.ring,1.05,0.06,0.3));V.label('Bowl','',worldOf(CH.bowl,-0.6,-0.6,0.7));
  let amp=18,t=0,playing=!RM,lock=false;const now=Date.now()/1000-new Date().getTimezoneOffset()*60;
  bindRange($('input[type=range]',st.parentElement),v=>{amp=v;return v+'°';});
  $('.lock',st.parentElement).addEventListener('change',e=>{lock=e.target.checked;f.dirty=true;});
  bindPlay($('.play',st.parentElement),()=>playing,v=>playing=v);
  const f=V.fig=addFig(st,dt=>{if(playing){t+=dt;f.dirty=true;}if(!f.dirty)return;f.dirty=false;
    const a=amp*D2R;CH.update(now+t,{lid:1,roll:a*Math.sin(t*0.9),pitch:a*0.55*Math.sin(t*0.61+1.1),lock});V.render();});
}

/* ---------- F9 final ---------- */
function initFinal(){
  const st=$('#f-final');const V=new View3D(st,{aspect:w=>w<560?1.05:0.7,yaw:0.7,pitch:0.55,dist:6.4,target:[0,-0.35,0],minPitch:-0.7});
  const M=mats();const CH=buildChrono(M,dialTexture(V.r),true);V.scene.add(CH.root);
  const sh=new THREE.Mesh(new THREE.PlaneGeometry(5.5,5.5).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:shadowTex(),transparent:true,depthWrite:false}));sh.position.y=-1.6;V.scene.add(sh);
  const mv=CH.mv,B=POS.B,E=POS.E;
  const Ls=[V.label('Balance','bimetallic rim',worldOf(mv,B[0]-0.26,-0.5,B[1])),V.label('Helical spring','',worldOf(mv,B[0],-0.66,B[1]+0.08)),
    V.label('Escape wheel','',worldOf(mv,E[0]+0.12,-0.33,E[1]+0.08)),V.label('Detent','',worldOf(mv,0.36,-0.37,0.32)),
    V.label('Fusee','',worldOf(mv,POS.Fu[0],-0.12,POS.Fu[1])),V.label('Barrel','',worldOf(mv,POS.Ba[0]-0.1,-0.2,POS.Ba[1])),
    V.label('Centre wheel','',worldOf(mv,-0.3,-0.12,-0.12)),V.label('Great wheel','',worldOf(mv,0.45,-0.37,-0.3))];
  const s={lid:1,lift:0,lock:false,roll:0,pitch:0};let rock=false,slow=false,zoom=0.35,rt=0,sim=Date.now()/1000-new Date().getTimezoneOffset()*60;
  const P=st.parentElement;
  const f=V.fig=addFig(st,dt=>{
    sim+=dt*(slow?0.1:1);if(rock)rt+=dt;const a=rock?16*D2R:0;s.roll=lerp(s.roll,a*Math.sin(rt*0.9),rock?1:0.1);s.pitch=lerp(s.pitch,a*0.55*Math.sin(rt*0.61+1.1),rock?1:0.1);
    if(s.lift>0.5&&s.lid<0.5){s.lid=1;$('.lid',P).value=1;$('.lid',P).dispatchEvent(new Event('input'));}
    CH.update(sim,s);const L=s.lift;V.target.set(0,lerp(-0.35,2.2,smooth(L/0.8)),0);V.dist=lerp(11,3.2,zoom)*(V.h>V.w?1.15:1)*lerp(1,0.62,smooth(L));
    Ls.forEach(l=>l.show=L>0.9);V.render();});
  bindRange($('.lid',P),v=>{s.lid=v;f.dirty=true;return v<0.02?'closed':v>0.98?'open':Math.round(v*100)+'%';});
  bindRange($('.lift',P),v=>{s.lift=v;f.dirty=true;return v<0.01?'in bowl':v<0.45?'lifting':v>0.99?'turned over':'turning';});
  bindRange($('.zoom',P),v=>{zoom=v;f.dirty=true;return Math.round(v*100)+'%';});
  $('.rock',P).addEventListener('change',e=>rock=e.target.checked);$('.slow',P).addEventListener('change',e=>slow=e.target.checked);
}

/* ---------- main ---------- */
let last=performance.now();
function frame(now){const dt=Math.min(0.05,(now-last)/1000);last=now;for(const f of FIGS){if(f.visible){try{f.tick(dt);}catch(e){console.error(e);}}}requestAnimationFrame(frame);}
(async function main(){
  try{await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2500))]);}catch(_){}
  const safe=fn=>{try{fn();}catch(e){console.error(e);}};
  safe(initHero);safe(initLon);safe(initErr);safe(initEsc);
  const three=[initBalance,initSpring,initTemp,initFusee,initTrain,initGimbal,initFinal];
  if(HAS3D)three.forEach(safe);
  else document.querySelectorAll('.stage:not(.flat)').forEach(s=>{s.innerHTML='<div class="fallback">The 3D figures need a script that didn’t load. Reload the page to try again.</div>';});
  requestAnimationFrame(frame);
})();
