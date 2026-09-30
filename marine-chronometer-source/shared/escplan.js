/* escplan.js: the plan of the spring detent escapement, drawn on a 2D canvas from the solver's own outlines (makeEsc, escapement.js), as the manual's Fig. 90 has it
   (from the balance cock's side). One drawing for the model's walkthrough inset and adjuster's bench and the essay's detent figure.
   Declares drawEscPlan and escStage only (TAU, D2R kept inside), since the pages that load it declare their own. */
"use strict";
/* escStage(s): what the escapement is doing in state s (ESC.state, s.held: the train stands): a key of ESC_STAGE */
function escStage(s){
  if(s.held)return s.lift>0.005?'hLift':s.ccw&&s.psDef>0.005?'hSmall':s.psDef>0.005?'hPass':'hFree';
  if(!s.ccw)return s.psDef>0.005?'pass':'free';
  if(s.lift>0.005&&s.prog===0)return'unlock';
  if(s.prog>0&&s.prog<1)return s.drop?'drop':'impulse';
  return s.lift>0.005?'relock':'free';}
/* drawEscPlan(ctx,w,h,s,Ew,o): the plan in a w x h box. s: the balance's state, Ew: the escape wheel's position in teeth. o: E (the escapement, default ESC),
   pal {ink,muted,brass,steel,copper,paper,blue,rule} (paper: the escape wheel's inside, the background), box [x0,x1,y0,y1] (in escape-wheel radii, balance at the origin),
   labels 'short' (three names) or 'full' (every part, with leader lines), cap: the stage and the balance's angle written in the corners, gauge: a dial showing the balance's angle */
function drawEscPlan(ctx,w,h,s,Ew,o={}){
  const TAU=Math.PI*2,D2R=Math.PI/180,E=o.E||ESC,NT=E.NT,P=E.P,EX=E.EX,C=o.pal,ruby='#c3163b';
  ctx.clearRect(0,0,w,h);
  const[x0,x1,y0,y1]=o.box||[-2.5,0.95,-2.45,1.15],sc=Math.min(w/(x1-x0),h/(y1-y0)),ox=(w-(x1-x0)*sc)/2-x0*sc,oy=(h-(y1-y0)*sc)/2+y1*sc,X=x=>ox+x*sc,Y=y=>oy-y*sc;
  const phi=-(((Ew%1)+1)%1)*P;
  ctx.beginPath();let f=true;
  for(let k=0;k<NT;k++){const pts=E.toothPts(E.t0+k*P+phi);   /* the mesh's tooth, tip at t0+kP */
    for(const[r,aa]of pts){const px=X(EX+r*Math.cos(aa)),py=Y(r*Math.sin(aa));f?ctx.moveTo(px,py):ctx.lineTo(px,py);f=false;}}
  ctx.closePath();ctx.fillStyle=C.brass;ctx.fill();ctx.fillStyle=C.paper;ctx.beginPath();ctx.arc(X(EX),Y(0),(E.r0-0.5/E.ES)*sc,0,TAU);ctx.fill();
  ctx.strokeStyle=C.brass;ctx.lineWidth=0.08*sc;for(let k=0;k<4;k++){const a=-Ew*P+E.t0-0.3+k*TAU/4,rs=E.r0-0.45/E.ES;ctx.beginPath();ctx.moveTo(X(EX),Y(0));ctx.lineTo(X(EX+rs*Math.cos(a)),Y(rs*Math.sin(a)));ctx.stroke();}   /* spokes where the mesh has them (core.js escapeWheel) */
  const ai=E.aI+s.th,rr=E.rRoll;
  { const arc=(r,a0,a1,n)=>{for(let i=0;i<=n;i++){const q=a0+(a1-a0)*i/n;ctx.lineTo(X(r*Math.cos(q)),Y(r*Math.sin(q)));}};   /* impulse roller with its crescent, as built */
    ctx.fillStyle=C.steel;ctx.globalAlpha=0.25;ctx.beginPath();arc(rr,ai+0.16,ai-0.6+TAU,60);arc(rr*0.55,ai-0.6,ai,12);arc(rr*0.86,ai,ai+0.16,4);ctx.closePath();ctx.fill();ctx.globalAlpha=1; }
  const jewel=(ang,r0,r1,wd)=>{const c=Math.cos(ang),sn=Math.sin(ang),px=-sn*wd/2,py=c*wd/2;ctx.fillStyle=ruby;ctx.beginPath();ctx.moveTo(X(r0*c+px),Y(r0*sn+py));ctx.lineTo(X(r1*c+px),Y(r1*sn+py));ctx.lineTo(X(r1*c-px),Y(r1*sn-py));ctx.lineTo(X(r0*c-px),Y(r0*sn-py));ctx.closePath();ctx.fill();};
  jewel(E.aIc+s.th,E.rRoll-0.08,E.rp,E.wI);
  const del=-s.lift/E.LEN,cd=Math.cos(del),sd=Math.sin(del),Ft=E.Ft,R=p2=>({x:Ft.x+(p2.x-Ft.x)*cd-(p2.y-Ft.y)*sd,y:Ft.y+(p2.x-Ft.x)*sd+(p2.y-Ft.y)*cd});
  const poly=(pts,col,fix)=>{ctx.beginPath();pts.forEach((q,i)=>{const r=fix?q:R(q);i?ctx.lineTo(X(r.x),Y(r.y)):ctx.moveTo(X(r.x),Y(r.y));});ctx.closePath();ctx.fillStyle=col;ctx.fill();};
  ctx.globalAlpha=0.35;for(const k in E.fixed)poly(E.fixed[k],k==='foot'?C.copper:C.steel,true);ctx.globalAlpha=1;for(const k in E.pieces)poly(E.pieces[k],k==='stone'?ruby:C.copper);   /* support block and stop button fixed; the detent turns about its point of flexure */
  const[a0,am,tp]=E.springPts(s);
  ctx.strokeStyle=C.steel;ctx.lineWidth=o.labels==='full'?Math.max(2,0.014*sc):2;ctx.beginPath();ctx.moveTo(X(a0.x),Y(a0.y));ctx.quadraticCurveTo(X(am.x),Y(am.y),X(tp.x),Y(tp.y));ctx.stroke();
  ctx.fillStyle=C.steel;ctx.beginPath();ctx.arc(X(0),Y(0),E.rDR*sc,0,TAU);ctx.fill();jewel(E.aD+s.th,E.rDR-0.05,E.rd,E.wD);
  ctx.fillStyle=C.ink;ctx.beginPath();ctx.arc(X(0),Y(0),3,0,TAU);ctx.fill();
  if(o.labels==='short'){ctx.fillStyle=C.muted;ctx.font='11px "Instrument Sans",sans-serif';ctx.textAlign='left';
    ctx.fillText('escape wheel',X(-2.35),Y(1.02));ctx.fillText('detent',X(-2.4),Y(-1.2));ctx.fillText('balance rollers',X(0.1),Y(0.75));}
  else if(o.labels==='full'){const nw=w<520;ctx.font=(nw?11:12.5)+'px "Instrument Sans",sans-serif';ctx.strokeStyle=C.muted;ctx.lineWidth=0.8;
    /* a name at (lx, ly), its leader line from the point p it names */
    const lab=(t,p,lx,ly,al)=>{ctx.beginPath();ctx.moveTo(X(p.x),Y(p.y));ctx.lineTo(X(lx),Y(ly));ctx.stroke();ctx.fillStyle=C.ink;ctx.textAlign=al||'left';ctx.textBaseline='middle';ctx.fillText(t,X(lx)+(al==='right'?-4:4),Y(ly));};
    lab('Escape wheel',{x:EX-0.5,y:0.78},EX-0.75,1.08);
    lab('Locking jewel',R(E.S),-1.55,-1.15,'right');
    lab('Detent',R(E.D(1.2,-0.045)),-1.6,-1.6,'right');
    lab('Detent spring',E.D(0.3,-0.052),-1.75,-2.15,'right');
    lab('Stop button',E.D(E.BL-0.15,-0.07),-0.2,-1.95);
    lab('Horn',R(E.D(E.tH-0.035,E.nR+E.rho+0.05)),0.55,-1.45);
    lab('Trip spring',R(E.D(E.tH-0.5,E.nR)),0.55,-1.05);
    lab('Unlocking jewel',{x:E.rd*Math.cos(E.aD+s.th),y:E.rd*Math.sin(E.aD+s.th)},0.55,-0.6);
    lab('Impulse jewel',{x:E.rp*Math.cos(E.aIc+s.th),y:E.rp*Math.sin(E.aIc+s.th)},-0.25,0.95);
    lab('Impulse roller',{x:rr*Math.cos(ai+2.2),y:rr*Math.sin(ai+2.2)},0.62,0.2);
    ctx.textBaseline='alphabetic';}
  if(o.gauge){const gx=X(1.35),gy=Y(0.9),gr=Math.min(30,0.24*sc);
    ctx.strokeStyle=C.rule;ctx.lineWidth=2;ctx.beginPath();ctx.arc(gx,gy,gr,0,TAU);ctx.stroke();
    ctx.strokeStyle=C.blue;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(gx,gy);ctx.lineTo(gx+gr*Math.cos(-Math.PI/2-s.th),gy+gr*Math.sin(-Math.PI/2-s.th));ctx.stroke();
    ctx.fillStyle=C.muted;ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText('balance',gx,gy+gr+4);ctx.fillText((Math.round(s.th/D2R)||0)+'°',gx,gy+gr+18);ctx.textBaseline='alphabetic';}
  if(o.cap){const t={hLift:'Stopped: the detent lifts, the wheel can’t turn',hSmall:'Stopped: too small a swing to pass the trip spring',hPass:'Stopped: trip spring bends aside, detent still',hFree:'Stopped: wheel locked, balance swinging free',
      pass:'Return swing: trip spring bends aside, detent still',free:'Wheel locked, balance swinging free',unlock:'Unlocking: the jewel pushes trip spring and detent',
      drop:'Unlocked: the wheel drops onto the impulse jewel',impulse:'Impulse: a tooth drives the balance',relock:'Detent returns and locks the next tooth'}[escStage(s)];
    ctx.fillStyle=C.ink;ctx.font='600 12px "Instrument Sans",sans-serif';ctx.textAlign='left';ctx.fillText(t,8,h-8);
    ctx.textAlign='right';ctx.fillStyle=C.muted;ctx.font='11px "Instrument Sans",sans-serif';ctx.fillText('balance '+(Math.round(s.th/D2R)||0)+'°',w-8,14);
    ctx.fillText('from the cock side, as Fig. 90',w-8,h-26);}   /* the manual's side; the 3D Escapement view looks from the pillar plate, so it is mirrored */
}
