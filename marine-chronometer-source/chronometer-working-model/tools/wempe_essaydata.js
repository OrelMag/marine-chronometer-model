// The Wempe essay's figures and numbers that only Node works out (the Wempe model, marine-chronometer-source/wempe/; its Essay tab, js/essay.js), written into the page as
// js/essaydata.js (WEDATA), since the page opened from a file can't read a JSON. Needs only Node.js:
//   node wempe_essaydata.js           exits 1 if js/essaydata.js isn't what it finds, or the essay's data-wphys spans (index.html) don't read what it gives (about 3 s)
//   node wempe_essaydata.js --write   writes js/essaydata.js and sets each data-wphys span's text in index.html (the text a reader without scripts sees; the page sets it again)
// What it gives (WEDATA):
//   sheets: the works drawings' catalogue (References/wempe/README.md's table): each sheet's group, page number, title, drawing number, the date it was drawn and the
//     date it was revised (as listed), and whether it is the lever chronometer's: the essay's chart of the sheets' dates;
//   fusee: 05 06_20's measured force against the mainspring solved by mainspring.py and fitted to it (wempe_mainspring.json: final.fit, its shape scaled to the sheet's
//     mean; final.tq, its torque on the fusee arbor at its own level, frictionless), and the losses between the spring and the fusee arbor worked out from the parts
//     (wempe_physics.js's LS): the essay's fusee chart;
//   detent: where the detent, flung off the discharge stone's corner, falls back onto the tooth it has just let go and where it is home (makeEsc's state at the model's
//     swing, the loop of wempe_escapement.js's "the detent's fall");
//   trial also carries what the page's Rate and trial panels need (js/app.js): the air's effect (airK, s a day for a unit change of its density), the integral balance's secondary
//     error's range (Sint, S in s) and the TU's figures over 2,000 trials as adjusted and 500 at the masses' drawn place (sum: median and 95 % of |x|, and how many pass);
//   swing: the swing and the escapement's rate against the drive (makeEsc's ampAt and rateAt, the drive 0.2 to 1.8 times the reference's), which the page's Swing and
//     isochronism panel (js/app.js) interpolates in, since a solve takes about 0.3 s: the swing over the wind (WPHYS.drv, times the mainspring's set) and the rate against it;
//   rev6: the Soviet 6MX's own swing and trial, as swing and trial (the children run as the 6MX: wempe_load.js's MC_WREV), which the page reads when its Version is the 6MX;
//   phys: the numbers the text quotes from these (data-wphys spans), formatted as the text prints them; the 6MX's from wempe_6mx.json (wempe_6mx.js --write).
// The numbers the page itself can work out (WPHYS, WESC, WD: the drive, the train, the escapement's figures, the pillars' fits) are set live by js/essay.js's fillLive.
const fs=require('fs'),path=require('path');
const WE=path.join(__dirname,'..','..','wempe'),OUT=path.join(WE,'js','essaydata.js'),IDX=path.join(WE,'index.html'),REF=path.join(__dirname,'..','..','..','References','wempe','README.md');
const W=require('./wempe_load.js')(),P=W.WPHYS,E=P.ESC,D=Math.PI/180;
const PH=(()=>{const l=console.log;console.log=()=>{};try{return require('./wempe_physics.js');}finally{console.log=l;}})();   /* its budget, quietly (it prints only when run) */
const{MSJ,FN,LS,LV}=PH;
const r=(x,n)=>+x.toFixed(n),fx=(x,n=1)=>x.toFixed(n),th=x=>x.toLocaleString('en-US'),pc=(x,n=1)=>fx(100*x,n)+' %',rg=(a,b,n=1,u='')=>fx(Math.min(a,b),n)+'–'+fx(Math.max(a,b),n)+u;

/* ---------- the sheets: References/wempe/README.md's catalogue ---------- */
const sheets=(()=>{const out=[],LEVER=/^05 0[48]_(2[0-3]|3[0-3])|^002$/;
  for(const ln of fs.readFileSync(REF,'utf8').split('\n')){const m=/^\| \[([\w-]+)\/[^\]]+\]\([^)]+\) \| ([^|]+) \| ([^|]+) \| ([^|]*) \| ([^|]*) \|$/.exec(ln.trim());if(!m)continue;
    const[,dir,page,title,no,date]=m.map(s=>s.trim()),grp=/^\d\d-\d\d$/.test(dir)?dir.replace('-',' '):'001',ds=s=>{const q=/(\d{2})[. ](\d{2})[. ]\s?(\d{2})\b/.exec(s||'');return q?`19${q[3]}-${q[2]}-${q[1]}`:null;};
    const[a,b]=date.split(/rev\./),drawn=ds(a),rev=ds(b);if(!drawn&&!rev)continue;
    out.push([grp,page.replace(/\.(\d)/,'.$1'),title,no,drawn,rev,LEVER.test(page)?1:0]);}
  return out;})();

/* ---------- the fusee: measured against the spring solved ---------- */
const fusee={fit:FN.fit.map(q=>[q[0],q[1],r(q[2],2)]),tq:FN.tq.map(q=>[q[0],r(q[1],5)]),lo:r(LS.lo,4),hi:r(LS.hi,4),eta:FN.eta,L:FN.L,t:MSJ.strip.t,b:MSJ.strip.b,E:MSJ.strip.E};

/* ---------- the detent's fall after it lets a tooth go (wempe_escapement.js, "the detent's fall"): off the stone's corner (depart), onto the land of the tooth it has just
   let go (the stone's lift rising over its free fall), and home when the escaping tooth no longer holds it up ---------- */
const detent=(()=>{const dp=E.depart(E.A),tab=t=>{const g=(t-E.TH0)/E.DT,i=Math.floor(g);return i<0||i>=E.LI.length-1?0:E.LI[i]+(E.LI[i+1]-E.LI[i])*(g-i);};let on=null,end=null;
  if(dp)for(let q=dp.p;q<0.5;q+=2e-6){const z=E.state(q,E.A,1),fl=Math.max(z.th<E.thOff?tab(z.th):0,E.fallD(dp.d0,dp.v0,(q-dp.p)*0.5)*E.LEN);if(on==null&&z.lift>fl+1e-9)on=z.th/D;if(z.lift>0&&z.prog>0)end=z.th/D;}
  return{off:r(dp?dp.th/D:NaN,2),on:r(on,2),home:r(end,2)};})();

/* ---------- heat: the rate a °C against the masses' place (wempe_thermal.js), and the TU's trial (wempe_errorbudget.js's seeded trial) ---------- */
const TH=require('./wempe_thermal.js'),TS=TH.sweep(),TM=TH.mid.an,TP=TH.mid.ns,SEC=TH.secondary,LIN=TH.linear;
const heat={arc:TS.arc.map(x=>r(x,2)),rows:TS.rows.map(q=>q.map((x,i)=>r(x,i?3:1))),drawn:TM.at,zero:r(90-TM.zero,2),perDeg:r(TM.perDeg,4)};
/* the slow parts, each in a process of its own, at once: the error budget's trial (its daily wind's rates, about 25 s) and the rate over the wind (below, in two halves) */
const kid=(code,rev)=>new Promise((ok,no)=>require('child_process').execFile(process.execPath,['-e',code],{cwd:__dirname,encoding:'utf8',maxBuffer:1<<26,env:{...process.env,MC_WREV:rev||'last'}},(e,o)=>e?no(e):ok(JSON.parse(o))));   /* rev '6mx': the child runs as the Soviet 6MX (wempe_load.js) */
/* the rate over the wind (0-56 h, every 2 h, as wempe_hairspring.js's): the escapement with the drawn spring's isochronism (makeEsc's rate, SET.HS), and without it */
const ISO=(h0,h1)=>`const W=require('./wempe_load.js')(),P=W.WPHYS,E=P.ESC,D=Math.PI/180,A12=E.A/D,HS=P.SET.HS||0,o=[];for(let h=${h0};h<${h1};h+=2){const s=P.drv(h/P.HPT),a=E.ampAt(s),re=E.rateAt(a,s);o.push([re,re-HS*(a/D-A12)/10,a/D]);}console.log(JSON.stringify(o))`;
/* the swing and the rate against the drive s (0.2 to 1.8 by 0.02, 81 solves in five processes), for the page's Swing and isochronism panel: [s, the swing (deg), the rate (s a day; null under AMIN)] */
const SWG=(a,b)=>`const W=require('./wempe_load.js')(),E=W.WPHYS.ESC,D=Math.PI/180,o=[];for(let i=${a};i<${b};i++){const s=0.2+0.02*i,am=E.ampAt(s);o.push([+s.toFixed(2),am/D,am>=E.AMIN?E.rateAt(am,s):null]);}console.log(JSON.stringify(o))`;
/* and the Soviet 6MX's own (the page's Version; the user's choice, 17 October 2026): its trial and its swing against the drive, run as the 6MX (WPHYS.rev('6mx')) */
const EBK="const B=require('./wempe_errorbudget.js');console.log(JSON.stringify({...B.essay(),sum:B.summary()}))",SWK=rev=>[[0,16],[16,32],[32,48],[48,64],[64,81]].map(([a,b])=>kid(SWG(a,b),rev));
Promise.all([kid(EBK),kid(ISO(0,29)),kid(ISO(30,56.3)),...SWK(),kid(EBK,'6mx'),...SWK('6mx')]).then(([EB,i0,i1,...rest])=>{
const sw=rest.slice(0,5),EB6=rest[5],sw6=rest.slice(6),E6=P.rev('6mx').ESC;
const swOf=(sw,E)=>({cv:sw.flat().map(q=>[q[0],r(q[1],2),q[2]==null?null:r(q[2],4)]),AMIN:r(E.AMIN/D,2),A:r(E.A/D,2)}),swing=swOf(sw,E);
const IS=[...i0,...i1],iso={all:[Math.min(...IS.map(q=>q[0])),Math.max(...IS.map(q=>q[0]))],esc:[Math.min(...IS.map(q=>q[1])),Math.max(...IS.map(q=>q[1]))],sw:[Math.min(...IS.map(q=>q[2])),Math.max(...IS.map(q=>q[2]))]};
/* the balance's damping measured on a running 6MX (wempe_startup.js on wempe_swing.py's reading: References/wempe/VIDEOS.md, "Measured") */
const SU=JSON.parse(fs.readFileSync(path.join(__dirname,'wempe_startup.json'),'utf8')).split;
/* how often a trial drawn so passes, as adjusted and at the drawn place (the trial's own test; wempe_errorbudget.js prints its own runs) */
const trialOf=EB=>({days:EB.days.map(([T,v])=>[T,r(v,4)]),airLin:r(EB.airLin,5),perDeg:r(EB.perDeg,4),SET0:EB.SET0,LIM:EB.LIM,TU:EB.TU,Sv:r(EB.Sv,3),
  airK:r(EB.airK,5),Sint:EB.Sint.map(x=>r(x,3)),sum:Object.fromEntries(Object.entries(EB.sum).map(([k,o])=>[k,Object.fromEntries(Object.entries(o).map(([q,v])=>[q,Array.isArray(v)?v.map(x=>r(x,4)):typeof v==='number'?r(v,4):v]))]))}),trial=trialOf(EB);
const rev6={swing:swOf(sw6,E6),trial:trialOf(EB6)};   /* the 6MX's: the page's Swing and isochronism and Rate and trial panels read them when it is shown */   /* airK, Sint, sum: the page's Rate and 35-day trial panels */

/* ---------- the hairspring: the force on the pivots with the helix's turns varied (wempe_hairspring.js's spring, HSPR.lateral) ---------- */
const HS=(()=>{const l=console.log;console.log=()=>{};try{return require('./wempe_hairspring.js');}finally{console.log=l;}})(),{HSPR}=require('../../shared/hairspring.js');
const latAt=n=>HSPR.lateral(HS.resample(HS.spring(n),0.15).pts,HS.R).ratio,TURNS=W.WESC.HSP.TURNS;
const hs={turns:[...Array(49).keys()].map(k=>{const n=10.75+k/24*1;return[r(n,4),r(latAt(n),5)];}).filter(q=>q[0]<=12.76),drawn:[r(TURNS,3),r(HS.lateral.drawn,4)]};

/* ---------- the gimbals: the bodies weighed (gimbals_wempe.json, massprops.py) and levelled (gimbals.js's bodies), the Hamilton's beside them ---------- */
const gim=k=>JSON.parse(require('child_process').execFileSync(process.execPath,['-e',"const g=require('./gimbals.js'),B=g.bodies(),D=g.bodies({asDrawn:true}).drawn;console.log(JSON.stringify({Tz:2*Math.PI/B.wz,Tx:2*Math.PI/B.wx,h:-B.bw.c[1]*1000,drawn:D}))",'--',...(k?['--model','wempe']:[])],{cwd:__dirname,encoding:'utf8'}));
const X6=JSON.parse(fs.readFileSync(path.join(__dirname,'wempe_6mx.json'),'utf8'));   /* the Soviet 6MX's physics against the drawings' (wempe_6mx.js --write) */
const GW=gim(1),GH=gim(0),GJ=JSON.parse(fs.readFileSync(path.join(__dirname,'gimbals_wempe.json'),'utf8')),bp=GJ.bowl.byPart,Vb=bp.bowl/8.45,bak=GJ.alt.bakelite;

/* ---------- the numbers the text quotes ---------- */
const b=MSJ.strip.b/1000,t=MSJ.strip.t/1000,sS=6*FN.Mfull/(b*t*t);   /* the solved strip's bending stress fully wound, 6 M / b t² (as wempe_physics.js) */
const sg=(x,n=1)=>(x<0?'−':'+')+fx(Math.abs(x),n),rgS=(a,n=1)=>sg(a[0],n)+' to '+sg(a[1],n)+' s',dg=x=>Math.round(x)+'°';
const phys={msL:th(FN.L)+' mm',msT:fx(MSJ.strip.t,2)+' mm',msRms:pc(FN.rms,2),msEta:fx(FN.eta,3),msMore:Math.round(100*(1/FN.eta-1))+' %',
  lossEst:rg(100*(1-LS.hi),100*(1-LS.lo),1,' %'),lossImp:rg(100*(1-LV.imp[1]),100*(1-LV.imp[0]),1,' %'),tMid:fx(LV.tMid,3)+' mm',sSolved:fx(sS/1e9,2)+' GPa',
  detOn:fx(detent.on,1)+'°',detHome:fx(detent.home,1)+'°',
  /* the hairspring */
  latD:fx(HS.lateral.drawn,3),lat11:fx(latAt(11),4),lat12:fx(latAt(12),4),latHalf:fx(Math.max(...hs.turns.map(q=>q[1])),3),dsgI:fx(HS.curve.designed.inner,1)+' mm',dsgO:fx(HS.curve.designed.outer,1)+' mm',
  isoAll:rgS(iso.all,2),isoEsc:rgS(iso.esc,2),swRange:fx(iso.sw[0],1)+'–'+fx(iso.sw[1],1)+'°',tfVid:Math.round(SU.TF)+' s',tfSpan:SU.span[0]+'–'+SU.span[1]+' s',
  /* heat */
  cSpring:fx(TM.spring,1),cBack:fx(TM.back,1),cDrawn:fx(-TM.drawn,1),cZero:dg(90-TM.zero),cPerDeg:fx(TM.perDeg,2),cTuDeg:'±'+fx(0.1/TM.perDeg,1)+'°',cAt:dg(TM.at),cSet:'±'+EB.SET0+'°',cRes:'±'+fx(EB.SET0*EB.perDeg,3),
  cRange:fx(-LIN.range[1],1)+' and '+fx(-LIN.range[0],1),cZeros:dg(90-LIN.zeros[1])+' and '+dg(90-LIN.zeros[0]),cPlainEnd:fx(-TP.ends[1],1),cMove:dg(TM.zero-(90-TM.at)),cDiv:fx((TM.zero-(90-TM.at))/6,1),
  sSpring:rgS(SEC.Sspring),sPlain:rgS(SEC.Splain),sInt:rgS(SEC.Sintegral),
  /* the gimbals */
  gBowl:th(Math.round(GJ.bowl.m))+' g',gBrass:th(Math.round(bp.bowl))+' g',gV:fx(Vb,1)+' cm³',gRho:fx(350/Vb,2)+' g/cm³',gAlu:th(Math.round(Vb*2.7))+' g',gBak:th(Math.round(Vb*1.37))+' g',gBuna:th(Math.round(Vb*1.18))+' g',
  gRing:th(Math.round(GJ.ring.m))+' g',gTot:fx((GJ.bowl.m+GJ.ring.m)/1000,2)+' kg',gBakM:th(Math.round(bak.m))+' g',gBakCg:fx(bak.cg[1],2)+' mm',
  gDy:fx(-GW.drawn.bowl[1],2)+' mm',gDx:fx(Math.abs(GW.drawn.bowl[0]),2)+' mm',gLean:fx(Math.atan2(Math.abs(GW.drawn.bowl[0]),-GW.drawn.bowl[1])/D,1)+'°',
  gTz:fx(GW.Tz,2)+' s',gTx:fx(GW.Tx,2)+' s',hTz:fx(GH.Tz,2)+' s',hTx:fx(GH.Tx,2)+' s',gH:fx(GW.h,1)+' mm',hH:fx(GH.h,1)+' mm',
  /* the Soviet 6MX against the drawings (wempe_6mx.js) */
  x6Tol0:'±'+Math.round(X6.train[3].tp*1000)+' µm',x6Tol:'±'+Math.round(X6.train[3].tp6*1000)+' µm',x6Swing:fx(X6.swing6[0],0)+'–'+fx(X6.swing6[1],0)+'°',x6Rate:fx(X6.rateBeforeTiming,1)+' s'};

const js=`/* essaydata.js: the Wempe essay's figures and numbers that only Node works out, written by marine-chronometer-source/chronometer-working-model/tools/wempe_essaydata.js
   --write: generated, don't edit (rerun the tool; without --write it checks this file). Part of the Wempe model; declares only WEDATA (the tool's header says what each is). */
const WEDATA=${JSON.stringify({sheets,fusee,detent,heat,trial,hs,swing,phys,rev6})};
`;
/* the spans in index.html: each data-wphys key the text uses, with its text */
const SPAN=/(<span\b[^>]*\bdata-wphys="(\w+)"[^>]*>)([^<]*)(<\/span>)/g;
let html=fs.readFileSync(IDX,'utf8');const used=new Set();let bad=0;
const html2=html.replace(SPAN,(all,a,k,txt,z)=>{used.add(k);if(!(k in phys)){console.log(`  !!  index.html quotes data-wphys="${k}", which this tool doesn't give`);bad=1;return all;}return a+phys[k]+z;});
for(const k of Object.keys(phys))if(!used.has(k)){console.log(`  !!  the essay doesn't quote ${k} (data-wphys): use it or drop it here`);bad=1;}
if(process.argv.includes('--write')){fs.writeFileSync(OUT,js);if(html2!==html)fs.writeFileSync(IDX,html2);console.log(`wrote ${path.relative(process.cwd(),OUT)} (${js.length} bytes: ${sheets.length} sheets, the fusee's ${fusee.fit.length} readings, the detent's fall)${html2!==html?' and the spans in index.html':''}`);}
else{const okJ=fs.existsSync(OUT)&&fs.readFileSync(OUT,'utf8')===js,okH=html2===html;
  console.log(`${okJ?'  ok ':'  !! '} js/essaydata.js ${okJ?'is up to date':'is stale: node wempe_essaydata.js --write'}`);
  console.log(`${okH?'  ok ':'  !! '} the essay's ${used.size} data-wphys spans ${okH?'read what the tools give':'differ from what the tools give: node wempe_essaydata.js --write'}`);
  if(!okJ||!okH)bad=1;}
for(const[k,v]of Object.entries(phys))console.log(`       ${k.padEnd(8)} ${v}`);
if(bad)process.exitCode=1;
}).catch(e=>{console.error(e);process.exitCode=1;});
