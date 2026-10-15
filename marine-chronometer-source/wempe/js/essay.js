/* essay.js: the Wempe page's Essay tab, 'The Einheits-Chronometer': what its works drawings and its makers' own measurements tell us about one chronometer, and where they
   disagree, with figures drawn from this model's own numbers (WD, the drawings' dimensions; WPHYS, the escapement in time and the measured drive; WDIAL, the dial and hands;
   WEDATA, what only Node works out: tools/wempe_essaydata.js). Part of the Wempe model (three.js r128); the machinery (figures, controls, charts, tabs, hash) is the shared
   kit (../shared/essaykit.js), the look the Hamilton's essay's (../chronometer-working-model/css/essay.css). Declares only ESSAY (show, on, section, bind), as the Hamilton's,
   so the viewer (cfg.essay) and the tools treat both pages alike. No drawing scan or photograph is shown: every figure is drawn here from the numbers; the sheets are on
   dg-chrono.de. Facts in the text come from References/wempe/ and the model's README; numbers the model computes are data-live spans (fillLive, below) or data-wphys spans
   (WEDATA.phys, checked by wempe_essaydata.js). */
"use strict";
const ESSAY=(()=>{
  const D=Math.PI/180,f1=(v,n=1)=>v.toFixed(n),sgn=(v,n=1)=>(v<0?'−':'')+Math.abs(v).toFixed(n),th=v=>v.toLocaleString('en-US',{maximumFractionDigits:1});
  /* ---------- numbers in the text, from the model's code ---------- */
  function fillLive(model){const E=WPHYS.ESC,P=WPHYS,K=WESC.ESC,m=E.measure(),u=E.run,PL=WD.PIL,sF=PL.sF,hF=WD.PIL_HF,hD=WD.PIL_SEAT[1],kv=P.KV.map(q=>q[1]);
    const stoneIn=(()=>{let a=E.thRel,b=10*D;for(let i=0;i<50;i++){const c=(a+b)/2;E.bite(c)>-1e8?b=c:a=c;}return b;})();
    let eLo=1e9,eHi=0;for(let h=0;h<=56.4;h+=0.2){const v=P.escT(h/P.HPT);eLo=Math.min(eLo,v);eHi=Math.max(eHi,v);}
    const brg=WD.PILLARS.map(([x,z])=>Math.round(((Math.atan2(-x,-z)/D)+360)%360)),dp=E.depart(E.A);
    const V={pilD:f1(PL.r*2),pilL:f1(PL.L),pilLT:f1(PL.LT,2),pilS:f1(sF[0],1),pilSL:f1(PL.sL,1),pilTot:f1(PL.L+2*PL.sL,1),seatD:f1(WD.PIL_SEAT[0]*2,1),seatH:f1(hD,1),seatT:f1(WD.PIL_SEAT_T,2),
      inner:f1(PL.L-2*hD,1),innerLo:f1(PL.L-PL.LT-2*(hD+WD.PIL_SEAT_T),2),innerHi:f1(PL.L+PL.LT-2*hD,2),
      sLo:f1(sF[0]+sF[1],3),sHi:f1(sF[0]+sF[2],3),hLo:f1(hF[0]+hF[1],3),hHi:f1(hF[0]+hF[2],3),fitMin:f1(hF[0]+hF[1]-(sF[0]+sF[2]),3)+' mm',fitMax:f1(hF[0]+hF[2]-(sF[0]+sF[1]),3)+' mm',
      pilR:f1(Math.hypot(...WD.PILLARS[0]),1),pilBr:`${brg[0]}°, ${brg[1]}° and ${brg[2]}°`,pilGap:`${brg[1]-brg[0]}°, ${brg[2]-brg[1]}° and ${360-brg[2]+brg[0]}°`,
      kvMin:f1(Math.min(...kv)),kvMax:f1(Math.max(...kv)),lev:String(P.LEV),ratio:th(+P.RATIO.toFixed(1)),eta:f1(P.ETA,3),etaRange:f1(P.ETA_LO,3)+'–'+f1(P.ETA_HI,3),
      TQ:f1(P.TQ,1),escRange:f1(eLo,1)+'–'+f1(eHi,1),
      A:Math.round(E.A/D)+'°',AMIN:f1(E.AMIN/D,1)+'°',TF:Math.round(P.SET.TF)+' s',lock:f1(m.lock)+'°',letoff:f1(m.letoff)+'°',overall:f1(m.overall)+'°',
      rel:sgn(E.thRel/D)+'°',stoneIn:f1((stoneIn-E.thRel)/D)+'°',chase:f1((u.land-E.thRel)/D)+'°',landF:f1(-(u.land/D+K.PHI0))+'°',endF:f1(E.thE/D+K.PHI0)+'°',
      strike:Math.round(100*u.strike)+' %',shN:String(WEDATA.sheets.length),sh41:String(WEDATA.sheets.filter(q=>q[4]&&q[4]<'1942').length),unlock:Math.round(100*u.fu)+' %',layC:f1(-K.PHI_C,0)+'°',phi0:f1(-K.PHI0,0)+'°',detOff:sgn(dp?dp.th/D:NaN)+'°'};
    for(const el of document.querySelectorAll('#essay [data-live]')){const v=V[el.dataset.live];if(v!=null)el.textContent=v;}
    for(const el of document.querySelectorAll('#essay [data-wphys]')){const v=WEDATA.phys[el.dataset.wphys];if(v!=null)el.textContent=v;}}
  const K=ESSAYKIT.make({fillLive,store:'we'});
  if(!K)return{show(){},on:()=>false,section:()=>'',bind(){}};
  const{q,qa,PAL,fig,range,seg,figOf,c2d,chart,halo}=K;
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
  /* the time t (seconds of local time, the hands stepping in half-seconds with the beat) and h hours since winding: the up-and-down hand 22.5° right of 12 fully wound, a
     tenth of a turn for each of the fusee's turns (dial.js's update) */
  function paintDial(x,S,t,h){const c=S/2,k=c/WDIAL.DR,H=hands(),ts=Math.floor(t*2)/2;x.clearRect(0,0,S,S);x.drawImage(dial(),0,0,S,S);
    drawHand(x,H.ud,c,c-23*k,(22.5+36*h/WPHYS.HPT)*D,k);drawHand(x,H.sec,c,c+23*k,((ts/60)%1)*TAU,k);
    drawHand(x,H.hour,c,c,((t/43200)%1)*TAU,k);drawHand(x,H.min,c,c,((t/3600)%1)*TAU,k);}
  const nowT=()=>{const m=K.model();return m?m.time():Date.now()/1000-new Date().getTimezoneOffset()*60;},nowH=()=>{const m=K.model();return m?m.hrs():20;};

  /* ---------- hero: the model's dial, keeping the model's time ---------- */
  fig('eHeroSt',f=>{const cv=q('#eHero'),x=cv.getContext('2d'),cap=q('#eHeroCap');let S=0,lk=-1,lh=-1;
    const rs=()=>{const w=cv.clientWidth,d=Math.min(devicePixelRatio||1,2);if(!w)return;S=Math.round(w*d);if(cv.width!==S){cv.width=cv.height=S;f.dirty=true;}};new ResizeObserver(rs).observe(cv);rs();
    return()=>{const t=nowT(),h=nowH(),k=Math.floor(t*2);if(k===lk&&Math.abs(h-lh)<0.02&&!f.dirty)return;lk=k;lh=h;f.dirty=false;paintDial(x,S,t,h);
      const tt=((t%86400)+86400)%86400,hm=[Math.floor(tt/3600),Math.floor(tt%3600/60),Math.floor(tt%60)].map(v=>String(v).padStart(2,'0')).join(':'),m=K.model();
      cap.textContent=`The model’s dial: ${hm} local time, ${m&&h>=m.run()-1e-6?'run down':h.toFixed(1)+' h since winding'}`;};});

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
    const[i1,i2]=qa('input[type=range]',P),HR=()=>{const m=K.model();return m?m.run():56.4;};i1.max=String(Math.floor(HR()*10)/10);
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
        css(x,`12px ${SANS}`,PAL.red,'left','middle');halo(x,`the layout: on the stone at once, ${f1(-KE.PHI_C,0)}° before the line`,X(tL)+6,Y(-2),PAL.red);
        css(x,`11.5px ${SANS}`,PAL.blue,'left','top');halo(x,'strikes',X(tS)+7,Y(stone(tS))+3,PAL.blue);x.textAlign='center';x.textBaseline='bottom';halo(x,'let go',X(t0),Y(0)-7,PAL.blue);}
      const wc=wheel(cur),sc=stone(cur);
      ro.innerHTML=`${f1(hrs,1)} h since winding: the drive ${f1(100*s,0)} % of the reference, the balance swinging <b>${Math.round(a/D)}°</b>. Let go at ${sgn(t0,1)}°, the wheel strikes the stone at <b>${f1(tS,1)}°</b>, `+
        `${f1(tS-t0,1)}° of swing later, the stone’s face <b>${f1(-phi(tS),1)}° before</b> the line of centres. `+(cur<t0?'At the cursor the wheel is still locked.':`At the cursor (${sgn(cur,1)}°) the wheel has turned ${f1(wc,1)}°`+(sc==null?', the stone not yet in the teeth’s path.':cur<tS?`, the stone is at ${f1(sc,1)}°: the tooth is ${f1(sc-wc,1)}° behind it.`:cur<tE?', on the stone, driving the balance.':', past the stone, running on to the next lock.'));};});

  K.start();
  return K.api;
})();
