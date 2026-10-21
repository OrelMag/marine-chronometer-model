/* essay.js: the Wempe page's Essay tab, 'The Einheits-Chronometer': what its works drawings and its makers' own measurements tell us about one chronometer, and where they
   disagree, with figures drawn from this model's own numbers (WD, the drawings' dimensions; WPHYS, the escapement in time and the measured drive; WDIAL, the dial and hands;
   WEDATA, what only Node works out: tools/wempe_essaydata.js). Part of the Wempe model (three.js r128); the machinery (figures, controls, charts, tabs, hash) is the shared
   kit (../shared/essaykit.js), the look the Hamilton's essay's (../chronometer-working-model/css/essay.css). Declares only ESSAY (show, on, section, bind), as the Hamilton's,
   so the viewer (cfg.essay) and the tools treat both pages alike. No drawing scan or photograph is shown: every figure is drawn here from the numbers; the sheets are on
   dg-chrono.de. Facts in the text come from References/wempe/ and the model's README; numbers the model computes are data-live spans (fillLive, below) or data-wphys spans
   (WEDATA.phys, checked by wempe_essaydata.js). */
"use strict";
const ESSAY=(()=>{
  const D=Math.PI/180,f1=(v,n=1)=>v.toFixed(n),sgn=(v,n=1)=>(v<0?'−':'')+Math.abs(v).toFixed(n),th=v=>v.toLocaleString('en-US',{maximumFractionDigits:1}),dms=v=>{const d=Math.floor(v+1e-6),m=Math.round((v-d)*60);return m?d+'°'+m+'′':d+'°';};
  /* ---------- 05 03_7's curve (WESC.HSP), worked as tools/wempe_hairspring.js works it: in the sheet's frame (x right, y up, the junction at the bottom, 0°, the angles
     rising clockwise), the table's two compass arcs (a circle by least squares through its radii, to the strip's inside, 0-90° and 110-220°), and the inner curve's length
     and centroid (the strip's middle, the junction to its pin at 220°) against Phillips' second condition, R²/l on the perpendicular to the junction's radius ---------- */
  let HC=null;
  const hsCurve=()=>{if(HC)return HC;const H=WESC.HSP,R=H.RC,pt=(r,t)=>[-r*Math.sin(t*D),-r*Math.cos(t*D)];
    const fit=(a,b)=>{const Q=[];for(let t=a;t<=b;t+=10)Q.push(pt(H.TBL[t/10],t));const A=[[0,0,0],[0,0,0],[0,0,0]],y=[0,0,0];for(const[x,z]of Q){const rw=[x,z,1],v=-(x*x+z*z);for(let i=0;i<3;i++){y[i]+=rw[i]*v;for(let j=0;j<3;j++)A[i][j]+=rw[i]*rw[j];}}
      const det=m=>m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])-m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])+m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]),d=det(A),sl=[0,1,2].map(k=>det(A.map((row,i)=>row.map((x,j)=>j===k?y[i]:x)))/d);
      const c=[-sl[0]/2,-sl[1]/2],r=Math.sqrt(c[0]*c[0]+c[1]*c[1]-sl[2]);return{c,r,a,b,res:Math.max(...Q.map(([x,z])=>Math.abs(Math.hypot(x-c[0],z-c[1])-r)))};};
    let l=0,M=[0,0],p0=pt(H.rL(0),0);for(let t=0.02;t<=220+1e-9;t+=0.02){const p1=pt(H.rL(t),t),ds=Math.hypot(p1[0]-p0[0],p1[1]-p0[1]);l+=ds;M[0]+=ds*(p0[0]+p1[0])/2;M[1]+=ds*(p0[1]+p1[1])/2;p0=p1;}
    const G=[M[0]/l,M[1]/l];return HC={R,pt,A1:fit(0,90),A2:fit(110,220),l,G,OG:Math.hypot(...G),off:Math.atan2(G[1],-G[0])/D,ph:R*R/l};};
  /* ---------- numbers in the text, from the model's code ---------- */
  function fillLive(model){const E=WPHYS.ESC,P=WPHYS,K=WESC.ESC,m=E.measure(),u=E.run,PL=WD.PIL,sF=PL.sF,hF=WD.PIL_HF,hD=WD.PIL_SEAT[1],kv=P.KV.map(q=>q[1]);
    const stoneIn=(()=>{let a=E.thRel,b=10*D;for(let i=0;i<50;i++){const c=(a+b)/2;E.bite(c)>-1e8?b=c:a=c;}return b;})();
    let eLo=1e9,eHi=0;for(let h=0;h<=55.9;h+=0.2){const v=P.escT(h/P.HPT);eLo=Math.min(eLo,v);eHi=Math.max(eHi,v);}
    const brg=WD.PILLARS.map(([x,z])=>Math.round(((Math.atan2(-x,-z)/D)+360)%360)),dp=E.depart(E.A);
    const HL=WESC.HSL,hc=hsCurve(),HS=P.HS,Iw=P.SET.I*(0.5/HS.T)**2;
    const V={pilD:f1(PL.r*2),pilL:f1(PL.L),pilLT:f1(PL.LT,2),pilS:f1(sF[0],1),pilSL:f1(PL.sL,1),pilTot:f1(PL.L+2*PL.sL,1),seatD:f1(WD.PIL_SEAT[0]*2,1),seatH:f1(hD,1),seatT:f1(WD.PIL_SEAT_T,2),
      inner:f1(PL.L-2*hD,1),innerLo:f1(PL.L-PL.LT-2*(hD+WD.PIL_SEAT_T),2),innerHi:f1(PL.L+PL.LT-2*hD,2),
      sLo:f1(sF[0]+sF[1],3),sHi:f1(sF[0]+sF[2],3),hLo:f1(hF[0]+hF[1],3),hHi:f1(hF[0]+hF[2],3),fitMin:f1(hF[0]+hF[1]-(sF[0]+sF[2]),3)+' mm',fitMax:f1(hF[0]+hF[2]-(sF[0]+sF[1]),3)+' mm',
      pilR:f1(Math.hypot(...WD.PILLARS[0]),1),pilBr:`${brg[0]}°, ${brg[1]}° and ${brg[2]}°`,pilGap:`${brg[1]-brg[0]}°, ${brg[2]-brg[1]}° and ${360-brg[2]+brg[0]}°`,
      kvMin:f1(Math.min(...kv)),kvMax:f1(Math.max(...kv)),lev:String(P.LEV),ratio:th(+P.RATIO.toFixed(1)),eta:f1(P.ETA,3),etaRange:f1(P.ETA_LO,3)+'–'+f1(P.ETA_HI,3),
      TQ:f1(P.TQ,1),escRange:f1(eLo,1)+'–'+f1(eHi,1),
      A:Math.round(E.A/D)+'°',AMIN:f1(E.AMIN/D,1)+'°',TF:Math.round(P.SET.TF)+' s',lock:f1(m.lock)+'°',letoff:f1(m.letoff)+'°',overall:f1(m.overall)+'°',
      rel:sgn(E.thRel/D)+'°',stoneIn:f1((stoneIn-E.thRel)/D)+'°',chase:f1((u.land-E.thRel)/D)+'°',landF:f1(-(u.land/D+K.PHI0))+'°',endF:f1(E.thE/D+K.PHI0)+'°',
      strike:Math.round(100*u.strike)+' %',shN:String(WEDATA.sheets.length),sh41:String(WEDATA.sheets.filter(q=>q[4]&&q[4]<'1942').length),unlock:Math.round(100*u.fu)+' %',layC:dms(-K.PHI_C),phi0:dms(-K.PHI0),detOff:sgn(dp?dp.th/D:NaN)+'°',
      hsT:f1(HL.HT,3),hsB:f1(HL.HB,2),hsD:f1(2*HL.RC+HL.HT,1),hsP:f1(HL.PITCH,2),hsTurns:f1(HL.turns,2),hsL:f1(HL.L,1),hsPins:Math.round(Math.abs(HL.pins))+'°',
      a1r:f1(hc.A1.r,2),a1o:f1(Math.hypot(...hc.A1.c),2),a2r:f1(hc.A2.r,2),a2o:f1(Math.hypot(...hc.A2.c),2),aRes:String(Math.round(1000*Math.max(hc.A1.res,hc.A2.res))),
      gOff:f1(Math.abs(hc.off),1)+'°',gOG:f1(hc.OG,2),gPh:f1(hc.ph,2),gK:f1(hc.l*hc.OG/(hc.R*hc.R),2),gL:f1(hc.l,1),
      hs10:f1(Math.abs(P.SET.HS),2),hsK:String(Math.round(HS.k*1e6)),hsI:th(Math.round(P.SET.I)),hsTp:f1(HS.T,3)+' s',hsShort:f1(100*(1-HS.T/0.5),1)+' %',hsIw:th(Math.round(Iw)),
      hsIwp:Math.round(100*(Iw/P.SET.I-1))+' %',hsThin:f1(100*(1-(HS.kNeed/HS.k)**(1/3)),1)+' %',hsT14:f1(HS.alt.n14.T,3)+' s',hsT15:f1(HS.alt.n15.T,3)+' s',w78:f1(P.SET.W78,2)+' g'};
    for(const el of document.querySelectorAll('#essay [data-live]')){const v=V[el.dataset.live];if(v!=null)el.textContent=v;}
    for(const el of document.querySelectorAll('#essay [data-wphys]')){const v=WEDATA.phys[el.dataset.wphys];if(v!=null)el.textContent=v;}}
  const K=ESSAYKIT.make({fillLive,store:'we',key:'drawings'});   /* its hash #drawings=section: the page's Essay tab is the Hamilton's essay, on its own page */
  if(!K)return{show(){},on:()=>false,section:()=>'',bind(){}};
  const{q,qa,PAL,fig,range,play,seg,figOf,c2d,chart,halo,gl,View3D,at,RM}=K;
  const css=(x,font,col,al='left',bl='alphabetic')=>{x.font=font;x.fillStyle=col;x.textAlign=al;x.textBaseline=bl;};
  const SANS='"Instrument Sans",system-ui,sans-serif';

  /* ---------- the dial: the model's (WDIAL.face, Wempe 3955's printing) with its hands (WDIAL.HANDS: half-widths along each, from their sheets) ---------- */
  let DIAL=null;const dial=()=>DIAL||(DIAL=WDIAL.face(1));
  const hwAt=(t,r)=>{if(r<=t[0][0])return t[0][1];for(let i=1;i<t.length;i++)if(r<=t[i][0]){const[a,p]=t[i-1],[b,v]=t[i];return p+(v-p)*(r-a)/(b-a);}return t[t.length-1][1];};
  /* a hand's outline pointing up from its arbor (-y), r0 to its tip; tail: the same down the other way */
  const blade=(hw,r0,L,dir=-1)=>{const R=[];for(let r=r0;r<L;r+=0.25)R.push(r);R.push(L);return[...R.map(r=>[hwAt(hw,r),dir*r]),...R.reverse().map(r=>[-hwAt(hw,r),dir*r])];};
  let HANDS=null;
  const hands=()=>{if(HANDS)return HANDS;const H=WDIAL.HANDS;
    return HANDS={min:{p:[blade(H.MIN.hw,H.MIN.rf-0.2,H.MIN.L)],boss:H.MIN.rf,col:'#c39a46'},hour:{p:[blade(H.HOUR.hw,H.HOUR.rf1-0.2,H.HOUR.L)],boss:H.HOUR.rf,col:'#c39a46'},
      ud:{p:[blade(H.UDH.hw,H.UDH.rf-0.2,10.2)],boss:H.UDH.rf,col:'#1d2c74'},sec:{p:[blade(H.SEC.hwP,H.SEC.rb-0.2,19.5),blade(H.SEC.hwT,H.SEC.rb-0.2,10,1)],boss:H.SEC.rb,col:'#1d2c74'}};};
  function drawHand(x,h,cx,cy,a,k){x.save();x.translate(cx,cy);x.rotate(a);x.scale(k,k);x.fillStyle=h.col;x.shadowColor='rgba(0,0,0,.3)';x.shadowBlur=Math.max(1,k*0.6);x.shadowOffsetY=Math.max(1,k*0.25);
    x.beginPath();for(const p of h.p){p.forEach(([u,v],i)=>i?x.lineTo(u,v):x.moveTo(u,v));x.closePath();}x.moveTo(h.boss,0);x.arc(0,0,h.boss,0,TAU);x.fill('nonzero');x.restore();}
  /* the time t (seconds of the time the model keeps, GMT or local: the hands as set, app.js's dialRead; the hands stepping in half-seconds with the beat) and h hours since winding: the up-and-down hand 22.5° right of 12 fully wound, a
     tenth of a turn for each of the fusee's turns (dial.js's update) */
  function paintDial(x,S,t,h){const c=S/2,k=c/WDIAL.DR,H=hands(),ts=Math.floor(t*2)/2;x.clearRect(0,0,S,S);x.drawImage(dial(),0,0,S,S);
    drawHand(x,H.ud,c,c-23*k,(22.5+36*h/WPHYS.HPT)*D,k);drawHand(x,H.sec,c,c+23*k,((ts/60)%1)*TAU,k);
    drawHand(x,H.hour,c,c,((t/43200)%1)*TAU,k);drawHand(x,H.min,c,c,((t/3600)%1)*TAU,k);}
  const nowT=()=>{const m=K.model();return m?m.time():Date.now()/1000;},nowH=()=>{const m=K.model();return m?m.hrs():20;};

  /* ---------- hero: the model's dial, keeping the model's time ---------- */
  fig('eHeroSt',f=>{const cv=q('#eHero'),x=cv.getContext('2d'),cap=q('#eHeroCap');let S=0,lk=-1,lh=-1;
    const rs=()=>{const w=cv.clientWidth,d=Math.min(devicePixelRatio||1,2);if(!w)return;S=Math.round(w*d);if(cv.width!==S){cv.width=cv.height=S;f.dirty=true;}};new ResizeObserver(rs).observe(cv);rs();
    return()=>{const t=nowT(),h=nowH(),k=Math.floor(t*2);if(k===lk&&Math.abs(h-lh)<0.02&&!f.dirty)return;lk=k;lh=h;f.dirty=false;paintDial(x,S,t,h);
      const tt=((t%86400)+86400)%86400,hm=[Math.floor(tt/3600),Math.floor(tt%3600/60),Math.floor(tt%60)].map(v=>String(v).padStart(2,'0')).join(':'),m=K.model();
      cap.textContent=`The model’s dial: ${hm} ${m&&m.tz&&m.tz()==='local'?'local time':'GMT'}, ${m&&h>=m.run()-1e-6?'run down':h.toFixed(1)+' h since winding'}`;};});

  /* ---------- the sheets' dates, by drawing group (WEDATA.sheets, References/wempe/README.md's catalogue) ---------- */
  const GR=[['001','001','Overviews'],['05 01','05 01','Case'],['05 02','05 02','Motion work, dial'],['05 03','05 03','Balance'],['05 04','05 04','Escapement'],['05 05','05 05','Going train'],
    ['05 06','05 06','Fusee'],['05 07','05 07','Barrel'],['05 08','05 08','Frame'],['05 33','05 33','Hand setting'],['05 36','05 36','Balance holder'],['05 38','05 38','Seconds contact'],['51 00','51 00','Box']];
  const yr=s=>{const[a,b,c]=s.split('-').map(Number);return a+(b-1)/12+(c-1)/365;},dLong=s=>{const[a,b,c]=s.split('-').map(Number);return`${c} ${['January','February','March','April','May','June','July','August','September','October','November','December'][b-1]} ${a}`;};
  fig('eSheets',f=>{const st=f.el,P=figOf(st),C=c2d(st,f,w=>(GR.length*22+58)/w),ro=q('.e-ro',P);let lever=true,pick=null,hits=[];
    const ck=q('input[type=checkbox]',P);ck.addEventListener('change',()=>{lever=ck.checked;f.dirty=true;});
    const say=s=>{if(!s){ro.innerHTML='Point at a sheet for its title and date.';return;}const[g,pg,t,no,dr,rv,lv]=s;
      ro.innerHTML=`<b>${pg}</b> · ${t} (${no})${lv?', the lever chronometer’s':''}: ${dr?'drawn '+dLong(dr):'its first date not listed'}${rv?(dr?', revised ':'revised ')+dLong(rv):''}`;};say(null);
    const near=e=>{const r=C.cv.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;let b=null,bd=14;for(const h of hits){const d=Math.hypot(h.x-mx,h.y-my);if(d<bd){bd=d;b=h;}}return b;};
    C.cv.addEventListener('pointermove',e=>{const h=near(e);if(h&&h.s!==pick){pick=h.s;say(pick);f.dirty=true;}});
    C.cv.addEventListener('click',e=>{const h=near(e);pick=h?h.s:null;say(pick);f.dirty=true;});
    return()=>{if(!f.dirty)return;f.dirty=false;const{x,w,h}=C,narrow=w<520,L=narrow?92:150,R=12,T=26,rh=22,Y0=T,B1=1940,B2=1949,BX=narrow?28:44,pw=w-L-R-BX-8;
      const X=y=>y>=1960?L+pw+8+(y-1965)*BX:L+(y-B1)/(B2-B1)*pw;x.clearRect(0,0,w,h);hits=[];
      css(x,`11px ${SANS}`,PAL.muted,'center','top');x.strokeStyle=PAL.rule;x.lineWidth=1;
      for(let yv=B1;yv<=B2;yv++){x.beginPath();x.moveTo(X(yv),T-6);x.lineTo(X(yv),T+GR.length*rh);x.stroke();if(yv<B2&&(!narrow||yv%2===0))x.fillText(String(yv),X(yv+0.5),T+GR.length*rh+6);}
      x.beginPath();x.moveTo(X(1965),T-6);x.lineTo(X(1965),T+GR.length*rh);x.moveTo(X(1966),T-6);x.lineTo(X(1966),T+GR.length*rh);x.stroke();x.fillText('1965',X(1965.5),T+GR.length*rh+6);
      GR.forEach(([g,n,t],i)=>{const y=Y0+i*rh+rh/2;css(x,`600 11.5px ${SANS}`,PAL.ink,'left','middle');x.fillText(n,4,y);if(!narrow){css(x,`11.5px ${SANS}`,PAL.muted,'left','middle');x.fillText(t,50,y);}
        if(i%2===0){x.fillStyle=PAL.rule;x.globalAlpha=0.25;x.fillRect(L-4,y-rh/2,w-L-R+4,rh);x.globalAlpha=1;}});
      for(const s of[...WEDATA.sheets].sort((a,b)=>b[6]-a[6])){if(s[6]&&!lever)continue;const i=GR.findIndex(g=>g[0]===s[0]);if(i<0)continue;const y=Y0+i*rh+rh/2,col=s[6]?PAL.muted:s[0]==='05 04'&&s[1]==='05 04_1'?PAL.red:PAL.blue,on=s===pick;
        const a=s[4]&&X(yr(s[4])),b=s[5]&&X(yr(s[5]));
        if(a&&b){x.strokeStyle=col;x.globalAlpha=0.55;x.lineWidth=1.2;x.beginPath();x.moveTo(a,y);x.lineTo(b,y);x.stroke();x.globalAlpha=1;}
        if(a){x.fillStyle=col;x.globalAlpha=on?1:0.75;x.beginPath();x.arc(a,y,on?5.5:3.6,0,TAU);x.fill();x.globalAlpha=1;hits.push({x:a,y,s});}
        if(b){x.strokeStyle=col;x.lineWidth=on?2.4:1.6;x.fillStyle=PAL.paper;x.beginPath();x.arc(b,y,on?5.5:3.8,0,TAU);x.fill();x.stroke();hits.push({x:b,y,s});}}
      css(x,`11.5px ${SANS}`,PAL.muted,'left','top');x.fillText(narrow?'● drawn  ○ revised':'● drawn   ○ revised   grey: the lever chronometer’s   red: the escapement’s layout, 05 04_1',L,4);};});

  /* ---------- the drawing: the top plate's hole table (05 09 01) and the plan it makes, and the pillar (05 08 00-1) between the plates ---------- */
  /* 05 09 01's table as the sheet gives it (References/wempe/transcriptions/05-08-frame.md): number, name, punched (or Körner, a centre punch), drilled, reamed or tapped;
     the places are WD.H's (dims.js), the model's own */
  const HT=[[1,'Minutenrad','4.4','','4.59 +0.012'],[3,'Hilfsloch','3.3','','3.50 +0.012'],[4,'Gegensperrkegel','K','0.9',''],[5,'Drahtfeder','K','1.3','M 1.7'],[6,'Stellstift Unruh Kl. ob.','K','1.45','1.6025'],
    [7,'Anschlagstift','K','1.45','1.6 +0.009'],[8,'Unruhkl. Schr. oben','K','2.1','M 2.6'],[9,'Stellstift Unruhkl. oben','K','1.45','1.6025'],[10,'Schnecke','7.8','','8.0 +0.015'],[11,'Pfeiler','4.3','','4.5 +0.012'],
    [12,'Hilfsloch','3.3','','3.50 +0.012'],[13,'Gangfederkl. Schr.','K','1.8',''],[22,'Stellstift Unruhkl. unten','K','1.45','1.6025'],[23,'Unruh','10.0','',''],[26,'Gangrad','K','2.3','2.5 +0.009'],
    [35,'Sekundenrad','4.4','','4.59 +0.012'],[36,'Unruhkl. Schr. unten','K','2.8',''],[37,'Stellstift Unruhkl. unten','K','1.45','1.6025'],[38,'Zwischenrad','4.4','','4.59 +0.012'],[39,'Pfeiler','4.3','','4.50 +0.012'],
    [40,'Hilfsloch','3.3','','3.50 +0.012'],[41,'Stellstift Federhausbr.','K','1.45','1.6025'],[42,'Federhausbr. Schr.','K','2.1','M 2.6'],[45,'Federhaus','4.4','',''],[47,'Stellstift Federhausbr.','K','1.45','1.6025'],
    [48,'Federhausbr. Schr.','K','2.1','M 2.6'],[49,'Pfeiler','4.3','','4.5 +0.012'],[50,'Stellstift Unruhkl. oben','K','1.45','1.6025'],[51,'Zangenschraube','K','1.55','M 2'],[52,'Winkelhebelschr.','K','1.55','M 2'],[53,'Stift f. Wendelfeder','K','1.5 H7','']];
  const EN={Minutenrad:'centre wheel',Hilfsloch:'auxiliary hole',Gegensperrkegel:'maintaining detent',Drahtfeder:'wire spring',Anschlagstift:'stop pin',Schnecke:'fusee',Pfeiler:'pillar',Unruh:'balance',Gangrad:'escape wheel',
    Sekundenrad:'seconds wheel',Zwischenrad:'intermediate wheel',Federhaus:'barrel',Zangenschraube:'tongs’ screw',Winkelhebelschr:'bell-crank screw'};
  const enOf=n=>EN[n]||EN[n.replace(/\.$/,'')]||(/^Stellstift/.test(n)?'steady pin':/Schr\.?$/.test(n)||/Schr\. /.test(n)?'screw':/^Stift/.test(n)?'pin':'');
  const holeD=r=>{const m=/^M ([\d.]+)/.exec(r[4]);if(m)return+m[1];const v=parseFloat(r[4]||r[3]||(r[2]!=='K'?r[2]:''));return v||0.6;};
  const NS=([x,z])=>[-z,-x],fc=v=>String(+Math.abs(v).toFixed(3));   /* WD's plan [x, z] back to the sheet's N and O (dims.js's NO) */
  fig('eSheet',f=>{const st=f.el,P=figOf(st),C=c2d(st,f,w=>w<520?1.0:0.56),tb=q('tbody',P),box=q('.e-holes',P),ro=q('.e-ro',P);let sel=11;
    tb.innerHTML=HT.map(r=>{const[n,o]=NS(WD.H[r[0]]);return`<tr data-n="${r[0]}"><td>${r[0]}</td><td>${r[1]}${enOf(r[1])?` <i>${enOf(r[1])}</i>`:''}</td><td>${n<0?'S':'N'} ${fc(n)}</td><td>${o<0?'W':'O'} ${fc(o)}</td><td>${r[2]==='K'?'Körner':r[2]}</td><td>${r[3]||'—'}</td><td>${r[4]||'—'}</td></tr>`;}).join('');
    const pickRow=(n,scroll)=>{sel=n;qa('tr',tb).forEach(t=>t.classList.toggle('on',+t.dataset.n===n));if(scroll){const t=q(`tr[data-n="${n}"]`,tb);if(t)box.scrollTop=t.offsetTop-box.clientHeight/2;}
      const r=HT.find(x=>x[0]===n),[N,O]=NS(WD.H[n]),rr=Math.hypot(N,O),b=((Math.atan2(O,N)/D)+360)%360;
      ro.innerHTML=`Hole <b>${n}</b>, ${r[1]}${enOf(r[1])?` (the ${enOf(r[1])})`:''}: <b>${N<0?'S':'N'} ${fc(N)}</b>, <b>${O<0?'W':'O'} ${fc(O)}</b> from hole 1${n===1?'':`, ${f1(rr,3)} mm from it at ${f1(b,1)}° from N toward O`}; `+
        (r[2]==='K'?'centre-punched':'punched '+r[2])+(r[3]?', drilled '+r[3]:'')+(r[4]?(/^M/.test(r[4])?', tapped ':', reamed ')+r[4]:'')+(n===45?'; the plate is cut away round it, 42.5 across, for the barrel':'')+'.';f.dirty=true;};
    tb.addEventListener('click',e=>{const t=e.target.closest('tr');if(t)pickRow(+t.dataset.n,false);});
    let geo=null;
    C.cv.addEventListener('click',e=>{if(!geo)return;const r=C.cv.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;let b=null,bd=1e9;
      for(const h of HT){const[px,py]=geo.P(WD.H[h[0]]),d=Math.hypot(px-mx,py-my);if(d<bd){bd=d;b=h[0];}}if(b!=null&&bd<24)pickRow(b,true);});
    pickRow(sel,true);
    return()=>{if(!f.dirty)return;f.dirty=false;const{x,w,h}=C,R=WD.PLATE_R,k=Math.min(w*0.94,h*0.92)/(2*R+8),cx=w/2,cy=h/2;
      const P=([X,Z])=>[cx-X*k,cy+Z*k];geo={P};x.clearRect(0,0,w,h);x.lineJoin='round';
      /* the crescent: the 85 disc less the cut 42.5 across about hole 45 (05 08_1b) */
      const c45=P(WD.H[45]),rc=42.5/2*k;
      x.save();x.beginPath();x.arc(cx,cy,R*k,0,TAU);x.clip();x.beginPath();x.rect(0,0,w,h);x.arc(c45[0],c45[1],rc,0,TAU);x.clip('evenodd');
      x.fillStyle=PAL.brass;x.globalAlpha=0.13;x.fillRect(0,0,w,h);x.globalAlpha=1;x.strokeStyle=PAL.ink;x.lineWidth=1.4;x.beginPath();x.arc(cx,cy,R*k,0,TAU);x.stroke();x.restore();
      x.save();x.beginPath();x.arc(cx,cy,R*k,0,TAU);x.clip();x.strokeStyle=PAL.ink;x.lineWidth=1.4;x.beginPath();x.arc(c45[0],c45[1],rc,0,TAU);x.stroke();x.restore();
      /* the centre lines: N up, O to the right, through hole 1 */
      x.strokeStyle=PAL.muted;x.lineWidth=0.8;x.setLineDash([10,3,2,3]);x.beginPath();x.moveTo(cx,cy-R*k-6);x.lineTo(cx,cy+R*k+6);x.moveTo(cx-R*k-6,cy);x.lineTo(cx+R*k+6,cy);x.stroke();x.setLineDash([]);
      css(x,`600 12px ${SANS}`,PAL.muted,'center','bottom');x.fillText('N',cx,cy-R*k-7);x.textBaseline='top';x.fillText('S',cx,cy+R*k+7);x.textAlign='left';x.textBaseline='middle';x.fillText('O',cx+R*k+8,cy);x.textAlign='right';x.fillText('W',cx-R*k-8,cy);
      /* the holes at their finished sizes; the pillars' seats (Ø 8.6 in the inner face) dashed, as the sheet draws them seen from the outer face */
      const small=k<3.2;
      for(const r of HT){const n=r[0],[px,py]=P(WD.H[n]),on=n===sel,d=holeD(r)*k/2,cut=n===45;
        if(n===11||n===39||n===49){x.setLineDash([3,2]);x.strokeStyle=PAL.muted;x.lineWidth=0.8;x.beginPath();x.arc(px,py,WD.PIL_SEAT[0]*k,0,TAU);x.stroke();x.setLineDash([]);}
        x.strokeStyle=on?PAL.red:PAL.ink;x.lineWidth=on?2:1;x.fillStyle=PAL.paper;x.beginPath();x.arc(px,py,Math.max(d,1.6),0,TAU);if(cut){x.setLineDash([2,2]);x.stroke();x.setLineDash([]);}else{x.fill();x.stroke();}
        x.beginPath();x.moveTo(px-3,py);x.lineTo(px+3,py);x.moveTo(px,py-3);x.lineTo(px,py+3);x.stroke();
        if(!small||on||[1,10,11,23,26,35,38,39,45,49].includes(n)){css(x,`${on?600:500} ${small?9.5:10.5}px ${SANS}`,on?PAL.red:PAL.muted,'left','bottom');x.fillText(String(n),px+Math.max(d,1.6)+1,py-1);}}
      /* the selected hole's coordinates from hole 1: along N/S, then across O/W */
      if(sel!==1){const[N,O]=NS(WD.H[sel]),[px,py]=P(WD.H[sel]),o=P([0,0]);x.strokeStyle=PAL.red;x.lineWidth=1.2;x.setLineDash([4,3]);x.beginPath();x.moveTo(o[0],o[1]);x.lineTo(o[0],py);x.lineTo(px,py);x.stroke();x.setLineDash([]);
        const tag=(s,tx,ty,al)=>{css(x,`600 11.5px ${SANS}`,PAL.red,al,'middle');const tw=x.measureText(s).width;x.fillStyle=PAL.paper;x.globalAlpha=0.85;x.fillRect(al==='left'?tx-2:al==='right'?tx-tw-2:tx-tw/2-2,ty-8,tw+4,16);x.globalAlpha=1;x.fillStyle=PAL.red;x.fillText(s,tx,ty);};
        if(Math.abs(N)>1)tag(`${N<0?'S':'N'} ${fc(N)}`,o[0]+(O<0?6:-6),(o[1]+py)/2,O<0?'left':'right');if(Math.abs(O)>1)tag(`${O<0?'W':'O'} ${fc(O)}`,(o[0]+px)/2,py+(N<0?13:-13),'center');}};});

  /* the pillar between the plates, in section, with the fit of its spigot in the plate's hole worked from the limits (WD.PIL.sF, WD.PIL_HF) */
  fig('ePil',f=>{const st=f.el,P=figOf(st),C=c2d(st,f,w=>w<520?1.3:0.56),ro=q('.e-ro',P),PL=WD.PIL,sF=PL.sF,hF=WD.PIL_HF;let s=sF[0]+(sF[1]+sF[2])/2,hd=hF[0]+(hF[1]+hF[2])/2;
    const out=()=>{const c=hd-s;ro.innerHTML=`Spigot <b>${f1(s,3)}</b>, hole <b>${f1(hd,3)}</b>: the spigot slides in with <b>${f1(c,3)} mm</b> to spare across the hole, ${f1(c*500,0)} µm a side. At the limits: ${f1(hF[0]+hF[1]-(sF[0]+sF[2]),3)} to ${f1(hF[0]+hF[2]-(sF[0]+sF[1]),3)} mm.`;f.dirty=true;};
    const[i1,i2]=qa('input[type=range]',P);i1.min=sF[0]+sF[1];i1.max=sF[0]+sF[2];i1.step=0.001;i1.value=s;i2.min=hF[0]+hF[1];i2.max=hF[0]+hF[2];i2.step=0.001;i2.value=hd;
    range(i1,v=>{s=v;out();return f1(v,3);});range(i2,v=>{hd=v;out();return f1(v,3);});
    return()=>{if(!f.dirty)return;f.dirty=false;const{x,w,h}=C,narrow=w<520,T=WD.TOP_T,PP=WD.PP_T,sd=WD.PIL_SEAT,gap=PL.L-2*sd[1],H=gap+T+PP,k=Math.min((narrow?h*0.55:h*0.9)/H,(narrow?w*0.9:w*0.5)/30);
      x.clearRect(0,0,w,h);const ox=narrow?w*0.5:w*0.3,oy=(narrow?h*0.32:h/2)-(H/2)*k+T*k,X=u=>ox+u*k,Y=v=>oy+v*k;   /* v: down from the top plate's inner face; u across from the pillar's axis */
      const hatch=(x0,y0,x1,y1)=>{x.save();x.beginPath();x.rect(x0,y0,x1-x0,y1-y0);x.clip();x.strokeStyle=PAL.muted;x.lineWidth=0.7;x.beginPath();for(let t=-(y1-y0);t<x1-x0;t+=6){x.moveTo(x0+t,y1);x.lineTo(x0+t+(y1-y0),y0);}x.stroke();x.restore();};
      /* the plates in section, cut across the pillar's hole and seat */
      const plate=(v0,v1,seatAt)=>{for(const sg of[-1,1]){const a=X(sg*hd/2),b=X(sg*15),y0=Y(v0),y1=Y(v1),ys=Y(seatAt);x.fillStyle=PAL.brass;x.globalAlpha=0.16;
          const xs=X(sg*sd[0]);x.beginPath();if(seatAt===v1){x.moveTo(a,y0);x.lineTo(b,y0);x.lineTo(b,y1);x.lineTo(xs,y1);x.lineTo(xs,Y(v1-sd[1]));x.lineTo(a,Y(v1-sd[1]));}else{x.moveTo(a,y1);x.lineTo(b,y1);x.lineTo(b,y0);x.lineTo(xs,y0);x.lineTo(xs,Y(v0+sd[1]));x.lineTo(a,Y(v0+sd[1]));}x.closePath();x.fill();x.globalAlpha=1;
          x.save();x.clip();hatch(Math.min(a,b),y0,Math.max(a,b),y1);x.restore();x.strokeStyle=PAL.ink;x.lineWidth=1.2;x.stroke();void ys;}};
      plate(-T,0,0);plate(gap,gap+PP,gap);
      /* the pillar in elevation: body Ø 8.1 between its shoulders in the seats, spigots to its ends, the M2.6 thread from both ends (hidden, dashed) */
      const sh0=-sd[1],sh1=gap+sd[1],r=PL.r,sr=s/2,tipR=PL.tip[0],tipL=PL.tip[1];
      x.fillStyle=PAL.paper;x.strokeStyle=PAL.ink;x.lineWidth=1.6;x.beginPath();
      x.moveTo(X(-tipR),Y(sh0-PL.sL));x.lineTo(X(tipR),Y(sh0-PL.sL));x.lineTo(X(sr),Y(sh0-PL.sL+tipL*0.35));x.lineTo(X(sr),Y(sh0));x.lineTo(X(r),Y(sh0));x.lineTo(X(r),Y(sh1));x.lineTo(X(sr),Y(sh1));x.lineTo(X(sr),Y(sh1+PL.sL-tipL*0.35));
      x.lineTo(X(tipR),Y(sh1+PL.sL));x.lineTo(X(-tipR),Y(sh1+PL.sL));x.lineTo(X(-sr),Y(sh1+PL.sL-tipL*0.35));x.lineTo(X(-sr),Y(sh1));x.lineTo(X(-r),Y(sh1));x.lineTo(X(-r),Y(sh0));x.lineTo(X(-sr),Y(sh0));x.lineTo(X(-sr),Y(sh0-PL.sL+tipL*0.35));x.closePath();x.fill();x.stroke();
      x.setLineDash([4,3]);x.lineWidth=0.9;x.beginPath();for(const sg of[-1,1]){x.moveTo(X(sg*1.3),Y(sh0-PL.sL));x.lineTo(X(sg*1.3),Y(sh1+PL.sL));}x.stroke();
      x.strokeStyle=PAL.muted;x.setLineDash([10,3,2,3]);x.beginPath();x.moveTo(X(0),Y(sh0-PL.sL-2));x.lineTo(X(0),Y(sh1+PL.sL+2));x.stroke();x.setLineDash([]);
      /* dimensions: between the shoulders 19.6 ±0.01, the plates 19.0 apart, the body Ø 8.1 */
      const dim=(xa,ya,xb,yb,s2,side)=>{x.strokeStyle=PAL.blue;x.fillStyle=PAL.blue;x.lineWidth=1;x.beginPath();x.moveTo(xa,ya);x.lineTo(xb,yb);x.stroke();const ar=(px,py,dx,dy)=>{x.beginPath();x.moveTo(px,py);x.lineTo(px+dx*7-dy*3,py+dy*7+dx*3);x.lineTo(px+dx*7+dy*3,py+dy*7-dx*3);x.closePath();x.fill();};
        const L=Math.hypot(xb-xa,yb-ya),dx=(xb-xa)/L,dy=(yb-ya)/L;ar(xa,ya,dx,dy);ar(xb,yb,-dx,-dy);css(x,`600 12px ${SANS}`,PAL.blue,side||'left','middle');x.save();x.translate((xa+xb)/2,(ya+yb)/2);if(Math.abs(dy)>0.5){x.rotate(-Math.PI/2);x.textAlign='center';x.textBaseline=side==='right'?'top':'bottom';x.fillText(s2,0,side==='right'?4:-4);}else{x.textAlign='center';x.textBaseline='bottom';x.fillText(s2,0,-4);}x.restore();};
      const dx1=X(r)+18,dx2=X(-r)-24;dim(dx1,Y(sh0),dx1,Y(sh1),`${f1(PL.L)} ±${f1(PL.LT,2)}`,'right');x.strokeStyle=PAL.blue;x.globalAlpha=0.5;x.beginPath();x.moveTo(X(r)+2,Y(sh0));x.lineTo(dx1+4,Y(sh0));x.moveTo(X(r)+2,Y(sh1));x.lineTo(dx1+4,Y(sh1));x.stroke();x.globalAlpha=1;
      dim(dx2,Y(0),dx2,Y(gap),f1(gap,1));dim(X(-r),Y(gap/2),X(r),Y(gap/2),`Ø ${f1(2*r)}`);
      /* the detail: the spigot in its hole, the clearance drawn 100 times wider */
      const DX=narrow?w*0.5:w*0.76,DY=narrow?h*0.79:h*0.46,DR=narrow?Math.min(w*0.3,h*0.13):Math.min(w*0.17,h*0.36),ex=50,mm=DR/4.2;
      x.save();x.beginPath();x.arc(DX,DY,DR,0,TAU);x.fillStyle=PAL.bg;x.fill();x.clip();
      const holeR=(s/2+(hd-s)/2*ex)*mm;x.fillStyle=PAL.brass;x.globalAlpha=0.16;x.fillRect(DX-DR,DY-DR,2*DR,2*DR);x.globalAlpha=1;hatch(DX-DR,DY-DR,DX+DR,DY+DR);
      x.fillStyle=PAL.bg;x.beginPath();x.arc(DX,DY,holeR,0,TAU);x.fill();x.strokeStyle=PAL.ink;x.lineWidth=1.4;x.stroke();
      x.fillStyle=PAL.paper;x.beginPath();x.arc(DX,DY,s/2*mm,0,TAU);x.fill();x.stroke();x.setLineDash([4,3]);x.lineWidth=0.9;x.beginPath();x.arc(DX,DY,1.3*mm,0,TAU);x.stroke();x.setLineDash([]);x.restore();
      x.strokeStyle=PAL.muted;x.lineWidth=1;x.beginPath();x.arc(DX,DY,DR,0,TAU);x.stroke();
      css(x,`12px ${SANS}`,PAL.muted,'center','top');x.fillText('the spigot in its hole, from above',DX,DY+DR+6);x.fillText(`the gap drawn ${ex} times wider`,DX,DY+DR+21);};});

  /* ---------- the fusee: 05 06_20's force against the spring solved (WPHYS.KV live; WEDATA.fusee from wempe_mainspring.json and wempe_physics.js) ---------- */
  fig('eFus',f=>{const st=f.el,P=figOf(st),C=c2d(st,f,w=>w<520?0.8:0.5),ro=q('.e-ro',P),F=WEDATA.fusee,G=1/(WPHYS.LEV/1000*9.80665e-3);let mode='shape',xc=4.5;   /* N·m to g on the sheet's 262 mm lever */
    const lin=(t,x,i=1)=>{if(x<=t[0][0])return t[0][i];for(let j=1;j<t.length;j++)if(x<=t[j][0]){const[a]=t[j-1],[b]=t[j];return t[j-1][i]+(t[j][i]-t[j-1][i])*(x-a)/(b-a);}return t[t.length-1][i];};
    const meas=x=>WPHYS.gAt(x),fit=x=>lin(F.fit,x,2),own=x=>lin(F.tq,x)*G;
    seg(q('.seg',P),v=>{mode=v;f.dirty=true;});
    range(q('input[type=range]',P),v=>{xc=v;f.dirty=true;return f1(v,2)+' turns';});
    return()=>{if(!f.dirty)return;f.dirty=false;const lvl=mode==='level',lo=x=>own(x)*F.lo,hi=x=>own(x)*F.hi;
      const o={x0:0,x1:8.75,y0:lvl?100:120,y1:lvl?190:145,xt:[0,1,2,3,4,5,6,7,8],yt:lvl?[100,120,140,160,180]:[120,125,130,135,140,145],xl:'The fusee’s turns, from run down to fully wound',yl:'g on the 262 mm lever',L:40,
        series:[{f:meas,color:PAL.brass,label:'measured, 05 06_20',lx:0.6,dy:16,from:WPHYS.KV[0][0],to:WPHYS.KV[WPHYS.KV.length-1][0]}],points:WPHYS.KV.map(([x,y])=>({x,y,color:PAL.brass})),cursor:xc,fills:[]};
      if(lvl){o.fills.push({lo,hi,color:PAL.blue});o.series.push({f:own,color:PAL.blue,label:'the solved spring, at '+F.t+' mm',lx:0.4,dy:-12},{f:x=>Math.sqrt(lo(x)*hi(x)),color:PAL.blue,dash:[5,4],width:1.4,label:'less the losses worked out',lx:4.2,dy:14});}
      else o.series.push({f:fit,color:PAL.blue,from:F.fit[0][0],label:'the solved spring, scaled to the mean',lx:3.2,dy:14});
      chart(C,o);const g=meas(xc);
      ro.innerHTML=`At ${f1(xc,2)} turns: measured <b>${f1(g,1)} g</b>; `+(lvl?`the solved strip gives <b>${f1(own(xc),1)} g</b>, ${f1(own(xc)*F.lo,1)}–${f1(own(xc)*F.hi,1)} after the losses`:`the solved spring’s shape, scaled to the sheet’s mean, <b>${f1(fit(xc),1)} g</b> (${sgn(100*(fit(xc)/g-1),1)} %)`)+'.';};});

  /* ---------- the escapement in time: the wheel let go from rest chasing the impulse stone (WPHYS.ESC: chase, bite), against the layout's tooth falling at once ---------- */
  fig('eDet',f=>{const st=f.el,P=figOf(st),C=c2d(st,f,w=>w<520?0.85:0.52),ro=q('.e-ro',P),E=WPHYS.ESC,KE=WESC.ESC;let hrs=12,cur=10;
    const[i1,i2]=qa('input[type=range]',P),HR=()=>{const m=K.model();return m?m.run():55.9;};i1.max=String(Math.floor(HR()*10)/10);
    const stone=t=>{const b=E.bite(t*D);return b>-1e8?-(b-E.t0)/D:null;},tIn=(()=>{let a=E.thRel,b=10*D;for(let i=0;i<50;i++){const c=(a+b)/2;E.bite(c)>-1e8?b=c:a=c;}return b/D;})(),tE=E.thE/D,tL=KE.PHI_C-KE.PHI0;
    range(i1,v=>{hrs=v;f.dirty=true;return f1(v,1)+' h';});range(i2,v=>{cur=v;f.dirty=true;return sgn(v,1)+'°';});
    return()=>{if(!f.dirty)return;f.dirty=false;const s=WPHYS.drv(Math.min(hrs,HR()-1e-3)/WPHYS.HPT),a=E.ampAt(s),wh=t=>-E.chase(t*D,a,s)/D,t0=E.thRel/D;
      let lo=tIn,hi=tE;for(let i=0;i<50;i++){const m=(lo+hi)/2;stone(m)<=wh(m)?hi=m:lo=m;}const tS=hi;
      const wheel=t=>t<t0?0:t<tS?wh(t):stone(Math.min(t,tE)),phi=t=>t+KE.PHI0;
      const tC=-KE.PHI0,G=chart(C,{x0:-6,x1:50,y0:-4,y1:24,xt:[0,10,20,30,40,50],yt:[0,6,12,18,24],xf:v=>v+'°',yf:v=>v+'°',L:40,xl:'The balance’s angle from rest, swinging through the impulse',yl:'The escape wheel’s turn since it was let go',
        series:[{f:t=>stone(t)??NaN,color:PAL.brass,from:tIn,to:tE,width:3,label:'the impulse stone',lx:tIn,dy:-18},
          {f:t=>stone(t),color:PAL.red,dash:[5,4],width:1.5,from:tL,to:tS},
          {f:wheel,color:PAL.blue,from:t0,to:tE,label:C.w<520?null:'the wheel, chasing it',lx:11,dy:16},{f:wheel,color:PAL.blue,from:tS,to:tE,label:C.w<520?'the wheel: chasing, then on the stone':'the wheel on the stone, driving it',lx:29,dy:-16,la:'right'}],
        cursor:cur,marks:[{x:t0,y:0,color:PAL.blue},{x:tS,y:stone(tS),color:PAL.blue},{x:tL,y:stone(tL),color:PAL.red}]});
      /* the line of centres (the stone's face on it), and the layout's instant fall: up to the stone at once where 05 04_1 puts the tooth on it */
      {const{x}=C,{X,Y}=G;x.strokeStyle=PAL.muted;x.lineWidth=1;x.setLineDash([1,3]);x.beginPath();x.moveTo(X(tC),Y(24));x.lineTo(X(tC),Y(-4));x.stroke();
        css(x,`11.5px ${SANS}`,PAL.muted,'left','top');halo(x,'the line of centres',X(tC)+5,Y(24)+3,PAL.muted);
        x.strokeStyle=PAL.red;x.lineWidth=1.5;x.setLineDash([5,4]);x.beginPath();x.moveTo(X(tL),Y(0));x.lineTo(X(tL),Y(stone(tL)));x.stroke();x.setLineDash([]);
        css(x,`12px ${SANS}`,PAL.red,'left','middle');halo(x,`the layout: on the stone at once, ${dms(-KE.PHI_C)} before the line`,X(tL)+6,Y(-2),PAL.red);
        css(x,`11.5px ${SANS}`,PAL.blue,'left','top');halo(x,'strikes',X(tS)+7,Y(stone(tS))+3,PAL.blue);x.textAlign='center';x.textBaseline='bottom';halo(x,'let go',X(t0),Y(0)-7,PAL.blue);}
      const wc=wheel(cur),sc=stone(cur);
      ro.innerHTML=`${f1(hrs,1)} h since winding: the drive ${f1(100*s,0)} % of the reference, the balance swinging <b>${Math.round(a/D)}°</b>. Let go at ${sgn(t0,1)}°, the wheel strikes the stone at <b>${f1(tS,1)}°</b>, `+
        `${f1(tS-t0,1)}° of swing later, the stone’s face <b>${f1(-phi(tS),1)}° before</b> the line of centres. `+(cur<t0?'At the cursor the wheel is still locked.':`At the cursor (${sgn(cur,1)}°) the wheel has turned ${f1(wc,1)}°`+(sc==null?', the stone not yet in the teeth’s path.':cur<tS?`, the stone is at ${f1(sc,1)}°: the tooth is ${f1(sc-wc,1)}° behind it.`:cur<tE?', on the stone, driving the balance.':', past the stone, running on to the next lock.'));};});

  /* ---------- a table [x, y...] read at x, linearly (column i) ---------- */
  const lin=(t,x,i=1)=>{if(x<=t[0][0])return t[0][i];for(let j=1;j<t.length;j++)if(x<=t[j][0]){const a=t[j-1][0],b=t[j][0];return t[j-1][i]+(t[j][i]-t[j-1][i])*(x-a)/(b-a);}return t[t.length-1][i];};
  /* tidy ticks over [lo, hi] */
  const nice=(lo,hi,n=5)=>{const sp=Math.max(hi-lo,0.4),s0=sp/n,mg=10**Math.floor(Math.log10(s0)),st=[1,2,2.5,5,10].map(k=>k*mg).find(k=>k>=s0)||10*mg,y0=Math.floor(lo/st)*st,y1=Math.ceil(hi/st)*st,t=[];
    for(let y=y0;y<=y1+st/2;y+=st)t.push(+y.toFixed(6));return{y0,y1,t,st};};

  /* ---------- the hairspring: 05 03_7's curve, its compass arcs, its centroid against Phillips' point (hsCurve, above) ---------- */
  fig('eHsC',f=>{const st=f.el,P=figOf(st),C=c2d(st,f,w=>w<520?1.3:0.6),ro=q('.e-ro',P),ck=q('input[type=checkbox]',P),hc=hsCurve(),H=WESC.HSP;let arcs=true;
    ck.addEventListener('change',()=>{arcs=ck.checked;f.dirty=true;});
    ro.innerHTML=`From the coil to its pin the curve is <b>${f1(hc.l,2)} mm</b> long; its centroid G lies <b>${f1(hc.OG,2)} mm</b> from the centre, ${f1(Math.abs(hc.off),1)}° off the perpendicular, where Phillips’ second condition asks for R²/l = <b>${f1(hc.ph,2)} mm</b>.`;
    return()=>{if(!f.dirty)return;f.dirty=false;const{x,w,h}=C,R=hc.R,narrow=w<520,ext=R+0.6,kw=narrow?w:w*0.62,k=Math.min(kw/(2*ext),(narrow?h*0.74:h)/(2*ext)),cx=kw/2,cy=narrow?ext*k+4:h/2,pt=hc.pt;
      const X=p=>cx+p[0]*k,Y=p=>cy-p[1]*k,line=(ps,col,wd,dash)=>{x.strokeStyle=col;x.lineWidth=wd;x.setLineDash(dash||[]);x.beginPath();ps.forEach((p,i)=>i?x.lineTo(X(p),Y(p)):x.moveTo(X(p),Y(p)));x.stroke();x.setLineDash([]);};
      x.clearRect(0,0,w,h);x.lineJoin='round';x.lineCap='round';
      /* the coil, the perpendicular to the junction's radius through the centre, and that radius */
      x.strokeStyle=PAL.muted;x.lineWidth=1;x.setLineDash([4,4]);x.beginPath();x.arc(cx,cy,R*k,0,TAU);x.stroke();
      x.setLineDash([10,3,2,3]);x.beginPath();x.moveTo(X([-ext,0]),cy);x.lineTo(X([ext,0]),cy);x.moveTo(cx,cy);x.lineTo(cx,Y([0,-R-0.3]));x.stroke();x.setLineDash([]);
      x.fillStyle=PAL.ink;x.beginPath();x.arc(cx,cy,2.5,0,TAU);x.fill();
      /* the compass arcs: each circle faint, the span it draws solid, its centre marked */
      if(arcs)for(const A of[hc.A1,hc.A2]){const c=[cx+A.c[0]*k,cy-A.c[1]*k];x.strokeStyle=PAL.red;x.globalAlpha=0.35;x.lineWidth=1;x.setLineDash([3,4]);x.beginPath();x.arc(c[0],c[1],A.r*k,0,TAU);x.stroke();x.setLineDash([]);x.globalAlpha=1;
        const sp=[];for(let t=A.a;t<=A.b+1e-9;t+=2){const p=pt(H.tbl(t),t),u=Math.atan2(p[1]-A.c[1],p[0]-A.c[0]);sp.push([A.c[0]+A.r*Math.cos(u),A.c[1]+A.r*Math.sin(u)]);}line(sp,PAL.red,1.6);
        x.strokeStyle=PAL.red;x.lineWidth=1.3;x.beginPath();x.arc(c[0],c[1],4,0,TAU);x.moveTo(c[0]-7,c[1]);x.lineTo(c[0]+7,c[1]);x.moveTo(c[0],c[1]-7);x.lineTo(c[0],c[1]+7);x.stroke();}
      /* the curve: the strip's middle from the coil to the pin (on into the collet, thin), and the table's radii (to its inside) */
      const cur=[];for(let t=0;t<=220;t+=1)cur.push(pt(H.rL(t),t));const tail=[];for(let t=220;t<=H.TE_L;t+=0.5)tail.push(pt(H.rL(t),t));
      const coilIn=[];for(let t=-40;t<=0;t+=1)coilIn.push(pt(R,t));
      line(coilIn,PAL.blue,2.6);line(cur,PAL.blue,2.6);line(tail,PAL.blue,1.2);
      x.fillStyle=PAL.brass;for(let i=0;i<=22;i++){const p=pt(H.TBL[i],10*i);x.beginPath();x.arc(X(p),Y(p),2.6,0,TAU);x.fill();}
      const pin=pt(H.rL(220),220);x.fillStyle=PAL.paper;x.strokeStyle=PAL.ink;x.lineWidth=1.4;x.beginPath();x.arc(X(pin),Y(pin),4,0,TAU);x.fill();x.stroke();
      /* the centroid and Phillips' point */
      const G=hc.G,Ph=[-hc.ph,0];x.fillStyle=PAL.blue;x.strokeStyle=PAL.paper;x.lineWidth=2;x.beginPath();x.arc(X(G),Y(G),5.5,0,TAU);x.fill();x.stroke();
      x.strokeStyle=PAL.red;x.lineWidth=2;x.fillStyle=PAL.paper;x.beginPath();x.arc(X(Ph),Y(Ph),5.5,0,TAU);x.fill();x.stroke();
      const fs=narrow?11:12;css(x,`600 ${fs}px ${SANS}`,PAL.blue,'center','bottom');halo(x,'G',X(G),Y(G)-8,PAL.blue);x.textBaseline='top';css(x,`600 ${fs}px ${SANS}`,PAL.red,'center','top');halo(x,'R²/l',X(Ph),Y(Ph)+8,PAL.red);
      css(x,`${fs}px ${SANS}`,PAL.muted,'center','top');halo(x,'junction, 0°',cx,Y([0,-R])+8,PAL.muted);x.textAlign='left';x.textBaseline='middle';halo(x,'pin, 220°',X(pin)+8,Y(pin),PAL.muted);
      x.textAlign='right';x.textBaseline='bottom';halo(x,'90°',X(pt(H.rL(90),90))-6,Y(pt(H.rL(90),90))-4,PAL.muted);
      /* the key */
      const kx=narrow?14:kw+10,ky=narrow?2*ext*k+16:Math.max(18,h/2-70),lh=narrow?18:21;let n=0;
      const key=(draw,t,col)=>{const y=ky+n*lh;n++;draw(kx+9,y);css(x,`${fs}px ${SANS}`,col||PAL.ink,'left','middle');x.fillText(t,kx+24,y);};
      key((a,b)=>{x.fillStyle=PAL.brass;x.beginPath();x.arc(a,b,3,0,TAU);x.fill();},'05 03_7’s radii, every 10°');
      key((a,b)=>{x.strokeStyle=PAL.blue;x.lineWidth=2.6;x.beginPath();x.moveTo(a-8,b);x.lineTo(a+8,b);x.stroke();},'the strip’s middle');
      if(arcs)key((a,b)=>{x.strokeStyle=PAL.red;x.lineWidth=1.6;x.beginPath();x.moveTo(a-8,b);x.lineTo(a+8,b);x.stroke();},`the compass arcs, r ${f1(hc.A1.r,2)} and ${f1(hc.A2.r,2)}`);
      key((a,b)=>{x.fillStyle=PAL.blue;x.beginPath();x.arc(a,b,5,0,TAU);x.fill();},`G, the centroid: ${f1(hc.OG,2)} from the centre`);
      key((a,b)=>{x.strokeStyle=PAL.red;x.lineWidth=2;x.beginPath();x.arc(a,b,5,0,TAU);x.stroke();},`Phillips: R²/l = ${f1(hc.ph,2)}`);};});

  /* the force on the pivots against the helix's turns (WEDATA.hs: tools/wempe_hairspring.js's spring, HSPR.lateral) */
  fig('eHsF',f=>{const st=f.el,P=figOf(st),C=c2d(st,f,w=>w<520?0.8:0.42),ro=q('.e-ro',P),T=WEDATA.hs.turns,dr=WEDATA.hs.drawn,inp=q('input[type=range]',P);let n=dr[0];
    inp.min=T[0][0];inp.max=T[T.length-1][0];inp.value=n;range(inp,v=>{n=v;f.dirty=true;return f1(v,2);});
    return()=>{if(!f.dirty)return;f.dirty=false;const fl=x=>lin(T,x);
      const G=chart(C,{x0:T[0][0],x1:T[T.length-1][0],y0:0,y1:0.035,xt:[11,11.5,12,12.5],yt:[0,0.01,0.02,0.03],yf:v=>v.toFixed(2),L:44,xl:'Turns of helix between the two drawn curves',yl:'The side force, × R / couple',
        series:[{f:fl,color:PAL.blue}],cursor:n,marks:[{x:dr[0],y:dr[1],color:PAL.red}]});
      css(C.x,`12px ${SANS}`,PAL.red,'left','bottom');halo(C.x,'as the sheet’s length makes it',G.X(dr[0])+8,G.Y(dr[1])-6,PAL.red);
      const v=fl(n),w=Math.abs(n-Math.round(n));ro.innerHTML=`With <b>${f1(n,2)}</b> turns of helix the spring presses the staff sideways with <b>${f1(v,4)}</b> of the couple over the coil’s radius`+(w<0.04?': near a whole number of turns, the two curves’ errors cancel.':w>0.4?': near a half turn, they add.':'.');};});

  /* ---------- heat: the masses' place, shared by the three figures (the balance, its coefficient, the trial) ---------- */
  const HR=WEDATA.heat.rows,hAt=(x,i=1)=>lin(HR,x,i),PLC={v:WEDATA.heat.drawn,fs:new Set()};
  const setPlace=v=>{PLC.v=v;for(const fn of PLC.fs)fn(v);};
  const placeFor=c=>{let a=HR[0][0],b=HR[HR.length-1][0];for(let i=0;i<50;i++){const m=(a+b)/2;hAt(m)>c?a=m:b=m;}return(a+b)/2;};   /* the place where the coefficient is c (it falls as the masses move away from the cuts) */
  /* a figure's own slider for the place: it moves the others, and follows them */
  const placeIn=(inp,f,also)=>{const a=WEDATA.heat.arc,out=inp.parentElement.querySelector('output');inp.min=String(Math.ceil(a[0]*2)/2);inp.max=String(Math.floor(a[1]*2)/2);inp.step='0.5';
    const show=v=>{inp.value=String(v);if(out)out.textContent=f1(v,1)+'°';f.dirty=true;if(also)also(v);};PLC.fs.add(show);show(PLC.v);inp.addEventListener('input',()=>setPlace(parseFloat(inp.value)));};

  /* the balance itself, its masses moved along the rim: the model's own (its pieces cloned, mv.userData.R.esc.bal), seen from the top plate's side */
  fig('eBal',f=>{const st=f.el,P=figOf(st),m=K.model(),V=new View3D(st,f,{aspect:w=>w<520?0.85:0.52,yaw:0.35,pitch:0.85,dist:95,target:[0,0,0],near:2,far:1000,minPitch:0.1}),S=V.scene;
    const cp=o=>{const c=o.isMesh?new THREE.Mesh(o.geometry,o.userData.mat0||o.material):new THREE.Group();c.position.copy(o.position);c.quaternion.copy(o.quaternion);c.scale.copy(o.scale);c.userData.hn=o.userData.hn;for(const k of o.children)c.add(cp(k));return c;};
    const hold=new THREE.Group();hold.rotation.x=Math.PI;S.add(hold);const g=cp(m.mv.userData.R.esc.bal);g.position.set(0,0,0);g.quaternion.identity();hold.add(g);hold.updateMatrixWorld(true);
    /* the masses with their screws and nuts (050301-4, WN-12, WN-12a), each on a turn about the staff: those at 32° and 212° (from 3 o'clock, as the plan's angles run) toward 3 and 9 one way, the others the other */
    const bal=g.children.find(o=>o.userData.hn==='050402-1')||g,pv=[new THREE.Group(),new THREE.Group()];pv.forEach(p=>bal.add(p));const bb=new THREE.Box3(),c=new THREE.Vector3(),MK=['050301-4','WN-12','WN-12a'],mv=[];
    bal.traverse(o=>{if(o.isMesh&&MK.includes(o.userData.hn))mv.push(o);});
    for(const o of mv){bb.setFromObject(o);bb.getCenter(c);bal.worldToLocal(c);const a=((Math.atan2(-c.z,c.x)/D)+360)%360;pv[(a%180)<90?0:1].attach(o);}
    V.target.set(0,-(WESC.FY-1.9),0);V.dist=78;
    const D0=WEDATA.heat.drawn,rm=(32.3/2+30.5/2)/2,yR=WESC.FY-1.9,lp=(r,a,y)=>{const v=new THREE.Vector3(r*Math.cos(a*D),y,-r*Math.sin(a*D));return v;};
    const L1=V.label('Mass','',v=>{v.copy(lp(rm+3.6,D0,yR-2.7));pv[0].localToWorld(v);}),L2=V.label('Cut','',v=>{v.copy(lp(16.7,0,yR));bal.localToWorld(v);});
    V.label('Timing weight','',v=>{v.copy(lp(19,90,WESC.FY-2.15));bal.localToWorld(v);});V.label('Brass outside,','nickel steel inside',v=>{v.copy(lp(16.6,245,yR));bal.localToWorld(v);});void L1;void L2;
    placeIn(q('input[type=range]',P),f);
    return()=>{if(!f.dirty)return;f.dirty=false;const d=(PLC.v-D0)*D;pv[0].rotation.y=d;pv[1].rotation.y=-d;V.render();};},'model');

  /* the coefficient against the masses' place (WEDATA.heat: tools/wempe_thermal.js) */
  fig('eHeatC',f=>{const st=f.el,P=figOf(st),C=c2d(st,f,w=>w<520?0.85:0.5),ro=q('.e-ro',P),H=WEDATA.heat;placeIn(q('input[type=range]',P),f);
    return()=>{if(!f.dirty)return;f.dirty=false;const x0=HR[0][0],x1=HR[HR.length-1][0],v=PLC.v,narrow=C.w<520,c=hAt(v);
      const G=chart(C,{x0:10,x1:75,y0:-10,y1:4,xt:narrow?[10,30,50,70]:[10,20,30,40,50,60,70],yt:[-10,-8,-6,-4,-2,0,2,4],xf:v=>v+'°',L:34,xl:'Where the masses sit: degrees from the cuts’ line',yl:'s a day gained for each °C warmer',
        bands:[{x0,x1,y0:-0.1,y1:0.1,color:PAL.red}],fills:[{lo:x=>hAt(x,2),hi:x=>hAt(x,3),color:PAL.blue,from:x0,to:x1}],
        series:[{f:x=>hAt(x,4),color:PAL.muted,dash:[5,4],width:1.6,from:x0,to:x1,label:'a plain nickel steel',lx:narrow?36:42,dy:16,la:'right'},{f:x=>hAt(x),color:PAL.blue,from:x0,to:x1,label:'Guillaume’s nickel steel',lx:narrow?52:46,dy:-16}],
        cursor:v,marks:[{x:H.drawn,y:hAt(H.drawn),color:PAL.red},{x:H.zero,y:0,color:PAL.blue}]});
      const x=C.x;css(x,`12px ${SANS}`,PAL.red,'left','top');halo(x,'drawn',G.X(H.drawn)+8,G.Y(hAt(H.drawn))+4,PAL.red);x.textAlign='right';x.fillStyle=PAL.blue;halo(x,'it cancels',G.X(H.zero)-8,G.Y(0)+6,PAL.blue);
      x.textAlign='left';x.textBaseline='bottom';halo(x,'the 6MX’s ±0.10',G.X(x1)-(narrow?92:112),G.Y(0.1)-3,PAL.red);
      ro.innerHTML=`The masses ${f1(v,1)}° from the cuts’ line: the chronometer ${c<0?'loses':'gains'} <b>${f1(Math.abs(c),2)} s a day</b> for each °C warmer (${sgn(hAt(v,2),2)} to ${sgn(hAt(v,3),2)} over the metals’ constants)`+(Math.abs(c)<=0.1?', inside the 6MX’s ±0.10.':'; the 6MX allows ±0.10.');};});

  /* the 6MX's trial for that place: the seeded trial's days (WEDATA.trial: tools/wempe_errorbudget.js), each day's rate with the linear term c1 (T - 20) put back for the
     place, read to 0.01 s on the accumulated error, and the TU's figures as the tool works them (losing positive) */
  const trialRun=c1=>{const T=WEDATA.trial,q2=v=>Math.round(v*100)/100;let e=0;const days=T.days.map(([Tm,b],i)=>{const r=b+c1*(Tm-20),e1=q2(e-r),v=q2(e1-e);e=e1;return{T:Tm,v,n:i%7>=2,i};});
    const per=[0,1,2,3,4].map(k=>days.slice(7*k+2,7*k+7).map(d=>d.v)),m=per.map(rs=>rs.reduce((a,x)=>a+x,0)/rs.length);
    const Ev=per.reduce((a,rs,k)=>a+rs.reduce((s2,x)=>s2+Math.abs(x-m[k]),0),0)/25,Dv=Math.max(...per.map(rs=>Math.max(...rs.slice(1).map((x,i)=>Math.abs(x-rs[i]))))),w36=(m[0]+m[4])/2,w20=(m[1]+m[3])/2,w4=m[2];
    const r={E:Ev,R:m[4]-m[0],D:Dv,C:(w36-w4)/32,S:(w36+w4)/2-w20,w:Math.max(...m.map(Math.abs))};r.N=42*Math.abs(r.E)+4.5*Math.abs(r.R)+60*Math.abs(r.C)+2.4*Math.abs(r.S);return{days,m,r};};
  fig('eTrial',f=>{const st=f.el,P=figOf(st),C=c2d(st,f,w=>w<520?0.9:0.46),ro=q('.e-ro',P),T=WEDATA.trial,L=T.LIM,bs=qa('.seg button',P),adjAt=placeFor(T.airLin),H=WEDATA.heat;
    placeIn(q('input[type=range]',P),f,v=>bs.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v==='drawn'?Math.abs(v-H.drawn)<0.01:Math.abs(v-adjAt)<0.01))));
    seg(q('.seg',P),k=>setPlace(k==='drawn'?H.drawn:adjAt));
    return()=>{if(!f.dirty)return;f.dirty=false;const narrow=C.w<520,{days,m,r}=trialRun(hAt(PLC.v)),vs=days.map(d=>d.v),lo=Math.min(0,...vs),hi=Math.max(0,...vs),Y=nice(lo,hi+0.16*(hi-lo||1),narrow?5:6);   /* room at the top for the periods' names */
      const col=t=>t>=30?PAL.red:t<=10?PAL.blue:PAL.muted;
      const G=chart(C,{x0:0.5,x1:35.5,y0:Y.y0,y1:Y.y1,xt:[1,8,15,22,29,35],yt:Y.t,yf:v=>Y.st<0.1?v.toFixed(2):Y.st<1?v.toFixed(1):String(v),L:44,xl:'The trial’s days',yl:'The daily rate, s (losing +)',
        bands:T.TU.map((t,k)=>({x0:7*k+0.5,x1:7*k+7.5,y0:Y.y0,y1:Y.y1,color:col(t)})),series:[],points:days.filter(d=>d.n).map(d=>({x:d.i+1,y:d.v,color:PAL.ink,r:3}))});
      const x=C.x;x.save();x.beginPath();x.rect(G.L,G.T,G.pw,G.ph);x.clip();
      x.strokeStyle=PAL.ink;x.lineWidth=1.2;for(const d of days)if(!d.n){x.fillStyle=PAL.paper;x.beginPath();x.arc(G.X(d.i+1),G.Y(d.v),3,0,TAU);x.fill();x.stroke();}
      x.setLineDash([4,3]);x.lineWidth=1.4;m.forEach((v,k)=>{x.beginPath();x.moveTo(G.X(7*k+2.6),G.Y(v));x.lineTo(G.X(7*k+7.4),G.Y(v));x.stroke();});x.setLineDash([]);x.restore();
      css(x,`600 ${narrow?10.5:11.5}px ${SANS}`,PAL.muted,'center','top');T.TU.forEach((t,k)=>{x.fillStyle=col(t);x.fillText(t+' °C',G.X(7*k+4),G.T+4);});
      const fig2=(k,v,lim,n=2,sg2=true)=>{const ok=Math.abs(v)<=lim;return`<span${ok?'':' class="e-bad"'}>${k} ${sg2?sgn(v,n):f1(v,n)} <small>(${k==='N'?'≤ '+lim:'±'+f1(lim,2)})</small></span>`;};
      const pass=['E','R','D','C','S','w'].every(k=>Math.abs(r[k])<=L[k])&&r.N<=L.N,bad=['E','R','D','C','S','w'].filter(k=>Math.abs(r[k])>L[k]).map(k=>k==='w'?'a period’s mean':k);
      ro.innerHTML=`The masses ${f1(PLC.v,1)}° from the cuts’ line, the balance’s coefficient ${sgn(-hAt(PLC.v),2)} s a day a °C: <b>${pass?'it passes':'it fails'}</b>${pass?'':' on '+bad.join(', ')+(r.N>L.N?' and N':'')}.<br>`+
        [fig2('E',r.E,L.E,3,false),fig2('R',r.R,L.R),fig2('D',r.D,L.D,2,false),fig2('C',r.C,L.C,3),fig2('S',r.S,L.S),fig2('mean',r.w,L.w,2,false),fig2('N',r.N,L.N,1,false)].join(' · ');};});

  /* ---------- the escapement in plan, from the model's own parts: each piece's solid flattened onto the plan in the frame of what moves it (the wheel, the rollers, the
     detent about its spring's middle, the gold spring about its bending point; the block and the detent's foot stand), and moved as the model moves them (WESC.ESC.at:
     makeEsc's solved state at the balance's angle, at the model's swing and the reference's drive). Seen as 05 04_1 draws it, from above through the top plate: the sheet's O to the right (-x), N up (-z) ---------- */
  fig('eEsc',f=>{const st=f.el,P=figOf(st),C=c2d(st,f,w=>w<520?0.95:0.6),ro=q('.e-ro',P),m=K.model(),RE=m.mv.userData.R.esc,PT=m.mv.userData.parts,MM=m.M,KE=WESC.ESC,inp=q('input[type=range]',P);
    const rel=(o,top)=>{const r=new THREE.Matrix4();for(let p=o;p&&p!==top;p=p.parent){p.updateMatrix();r.premultiply(p.matrix);}return r;};
    const colOf=o=>{const mt=o.userData.mat0||o.material;return mt===MM.ruby?'ruby':mt===MM.gilt?'gilt':mt===MM.brass||mt===MM.brass2?'brass':mt===MM.copper?'copper':mt===MM.blued?'blued':'steel';};
    /* a mesh flattened: its triangles (each wound one way, so a fill is their union) as one Path2D in top's frame, with its mean height and its plan centre */
    const flat=(o,top)=>{const gm=o.geometry,pa=gm.attributes.position,ix=gm.index,n=ix?ix.count:pa.count,mm=rel(o,top),v=new THREE.Vector3(),pth=new Path2D();let y=0,cx=0,cz=0,k=0;
      for(let i=0;i+2<n;i+=3){const t=[0,1,2].map(j=>{v.fromBufferAttribute(pa,ix?ix.getX(i+j):i+j).applyMatrix4(mm);return[v.x,v.z,v.y];});
        const ar=(t[1][0]-t[0][0])*(t[2][1]-t[0][1])-(t[2][0]-t[0][0])*(t[1][1]-t[0][1]);for(const p of t){y+=p[2];cx+=p[0];cz+=p[1];k++;}if(Math.abs(ar)<1e-7)continue;
        const u=ar>0?t:[t[0],t[2],t[1]];pth.moveTo(u[0][0],u[0][1]);pth.lineTo(u[1][0],u[1][1]);pth.lineTo(u[2][0],u[2][1]);pth.closePath();}
      return{pth,y:y/k,c:[cx/k,cz/k],hn:o.userData.hn,col:colOf(o)};};
    const P2=[],add=(grp,top,mov,skip)=>grp.traverse(o=>{if(o.isMesh&&!(skip&&skip(o)))P2.push({...flat(o,top),mov});});
    const goldOf=o=>{for(let p=o;p;p=p.parent)if(p===RE.gold)return true;return false;};
    add(RE.ew,RE.ew,'ew');add(RE.rol,RE.rol,'rol');add(RE.det,RE.det,'det',goldOf);add(RE.gold,RE.gold,'gold');
    for(const c of PT.detent.children)if(c!==RE.det)add(c,m.mv,'');add(PT.detentBlock,m.mv,'');
    P2.sort((a,b)=>(a.mov===''?0:1)-(b.mov===''?0:1)||b.y-a.y);   /* what stands (the block, the detent's foot) under what moves; seen from -y, the deepest first */
    const dm=RE.det.children[0],gp=RE.gold.position,dp=dm.position;
    /* the view: the wheel, the rollers and the detent to its foot */
    const W=WESC.W,B=WESC.B,S=WESC.P,F=WESC.DPIV,bx=[Math.min(W[0]-7.5,B[0]-3.6,S[0],F[0])-1,Math.max(W[0]+7.5,B[0]+3.6,S[0],F[0])+1,Math.min(W[1]-7.5,B[1]-3.6,S[1],F[1])-1,Math.max(W[1]+7.5,B[1]+3.6,S[1],F[1])+1];
    let dir=1,th=-4,going=false,E0=0,lastP=0;const AMP=()=>{const mo=K.model(),a=mo&&mo.amp?mo.amp():0;return a>KE.AMIN?a:WPHYS.ESC.A;};
    const bs=qa('.seg button',P);seg(q('.seg',P),v=>{dir=+v;f.dirty=true;});const up=()=>bs.forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.v===dir)));
    const setTh=range(inp,v=>{th=v;f.dirty=true;return sgn(v,1)+'°';});
    const upB=play(q('.play',P),()=>going,v=>{going=v;});inp.addEventListener('pointerdown',()=>{going=false;upB();});
    const RU={steel:PAL.steel,gilt:PAL.brass,brass:PAL.brass,copper:PAL.copper,blued:PAL.blue,ruby:'#c3163b'};
    const TXT=s=>!s.ccw?(s.psDef>1e-4?'Return swing: the discharge stone bends the gold spring aside; the detent stays on its banking, the wheel locked.':'Return swing: the wheel locked, the balance swinging free.'):
      s.prog<=0?(s.lift>1e-4?'Unlocking: the discharge stone pushes the gold spring, and the detent with it, until the locking stone lets the tooth go.':'The wheel locked, the balance swinging free.'):
      s.ride?'Let go: the wheel, from rest, turns toward the impulse stone; the detent, flung off the discharge stone, has fallen back onto the tooth it let go and rides it.':s.drop?'Let go: the wheel turns toward the impulse stone, chasing it.':s.run?'The impulse over: the next tooth runs on to the locking stone.':s.prog<1?'Impulse: a tooth drives the balance through the impulse stone.':'The wheel locked on the next tooth.';
    return dt=>{if(going){th+=(dir?1:-1)*dt*12;if(th>50){th=50;dir=0;up();}else if(th<-30){th=-30;dir=1;up();E0++;}inp.value=String(th);setTh();}
      if(!f.dirty)return;f.dirty=false;const{x,w,h}=C,s=KE.at(th*D,!!dir,AMP()),E=E0+(dir?Math.max(0,s.prog):1),narrow=w<520;
      const k=Math.min(w/(bx[1]-bx[0]),h/(bx[3]-bx[2])),ox=(bx[0]+bx[1])/2,oz=(bx[2]+bx[3])/2,d=Math.min(devicePixelRatio||1,2);
      x.clearRect(0,0,w,h);x.save();x.translate(w/2,h/2);x.scale(-k,k);x.translate(-ox,-oz);
      const rot=a=>x.transform(Math.cos(a),-Math.sin(a),Math.sin(a),Math.cos(a),0,0),at2=(p,a)=>{x.translate(p.x,p.z);rot(a);};
      const frame=q2=>{if(q2.mov==='ew')at2(RE.ew.position,E*TAU/15);else if(q2.mov==='rol')at2(RE.rol.position,-s.th);else if(q2.mov==='det'||q2.mov==='gold'){at2(RE.det.position,s.lift||0);if(q2.mov==='gold'){x.translate(dp.x+gp.x,dp.z+gp.z);rot(-(s.psDef||0));}}};
      for(const q2 of P2){x.save();frame(q2);x.fillStyle=RU[q2.col];x.globalAlpha=q2.mov===''?0.28:q2.hn==='050403-1'?0.6:1;x.fill(q2.pth);x.restore();}   /* the impulse roller see-through: the discharge roller and its stone are under it, as 05 04_1 draws them dashed */
      x.restore();void d;
      /* names, at each piece's place as moved */
      const sc=(p,mov)=>{const t=new DOMMatrix().translate(w/2,h/2).scale(-k,k).translate(-ox,-oz);const u=new DOMMatrix(t);const R2=(a,pp)=>{u.translateSelf(pp.x,pp.z);u.multiplySelf(new DOMMatrix([Math.cos(a),-Math.sin(a),Math.sin(a),Math.cos(a),0,0]));};
        if(mov==='rol')R2(-s.th,RE.rol.position);else if(mov==='det'||mov==='gold')R2(s.lift||0,RE.det.position);if(mov==='gold')R2(-(s.psDef||0),{x:dp.x+gp.x,z:dp.z+gp.z});const r=u.transformPoint(new DOMPoint(p[0],p[1]));return[r.x,r.y];};
      /* a name with a line to what it names, kept inside the figure */
      const z=Math.min(1,w/640),fs=narrow?10.5:11.5,lab=(t,p,dx,dy,al='left')=>{if(!p)return;const tx=clamp(p[0]+dx*z,4,w-4),ty=clamp(p[1]+dy*z,8,h-8);if(dx||dy){x.strokeStyle=PAL.muted;x.lineWidth=0.8;x.beginPath();x.moveTo(p[0],p[1]);x.lineTo(tx,ty);x.stroke();}
        css(x,`${fs}px ${SANS}`,PAL.ink,al,'middle');x.measureText(t);const tw=x.measureText(t).width,lx=al==='right'?Math.max(tx-4,tw+4):al==='center'?clamp(tx,tw/2+4,w-tw/2-4):Math.min(tx+4,w-tw-4);halo(x,t,lx,ty,PAL.ink);};
      const pos=hn=>{const q2=P2.find(zz=>zz.hn===hn);return q2?sc(q2.c,q2.mov):null;};
      const[ewx,ewy]=sc([W[0],W[1]],'');css(x,`${fs}px ${SANS}`,PAL.ink,'center','top');halo(x,'escape wheel',ewx,ewy+7.6*k+4,PAL.ink);
      lab('impulse stone',pos('050403-2'),-46,18,'right');lab('impulse roller',pos('050403-1'),-70,-34,'right');lab('discharge stone',pos('050404-2'),44,-62);
      lab('locking stone',pos('050401-3'),74,-6);lab('gold spring',pos('050401-2'),34,-62);lab('detent spring',sc([F[0],F[1]],''),0,30,'center');
      {const q2=P2.find(zz=>zz.hn==='050401-4');if(q2){const p=sc(q2.c,'');lab('detent block',[clamp(p[0],60,w-60),clamp(p[1],20,h-20)],0,0,'center');}}
      css(x,`${narrow?11:12}px ${SANS}`,PAL.muted,'right','top');x.fillText(`balance ${sgn(s.th/D,1)}°`,w-8,8);x.textAlign='left';x.fillText('O →   N ↑',8,8);
      ro.innerHTML=`<b>${dir?'Unlocking swing':'Return swing'}, the balance at ${sgn(th,1)}°.</b> ${TXT(s)}`;};},'model');

  /* ---------- the gimbals: the model's own box, ring and case (WCASE.build, case.js), its dial keeping the model's time ---------- */
  fig('eGim',f=>{const st=f.el,P=figOf(st),V=new View3D(st,f,{aspect:w=>w<520?0.9:0.58,yaw:0.75,pitch:0.78,dist:560,target:[0,0,0],near:20,far:5000}),M=gl().M,S=V.scene;
    const CS=WCASE.build(M);S.add(CS.root);CS.lid.rotation.x=-1.75;CS.stay();CS.tongue.rotation.z=-Math.PI/2;CS.over.visible=false;   /* the outer transport box (case.js builds it with the box) left out, as the page's views but Transport box leave it */
    CS.root.traverse(o=>{if(o.userData.rev&&!o.userData.rev.split(' ').includes('last'))o.visible=false;});   /* as last revised: the 1943 key, not the 1940 one beside it (nor any other version's pieces) */
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

  K.start();
  return K.api;
})();
