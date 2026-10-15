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
//   phys: the numbers the text quotes from these (data-wphys spans), formatted as the text prints them.
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

/* ---------- the numbers the text quotes ---------- */
const b=MSJ.strip.b/1000,t=MSJ.strip.t/1000,sS=6*FN.Mfull/(b*t*t);   /* the solved strip's bending stress fully wound, 6 M / b t² (as wempe_physics.js) */
const phys={msL:th(FN.L)+' mm',msT:fx(MSJ.strip.t,2)+' mm',msRms:pc(FN.rms,2),msEta:fx(FN.eta,3),msMore:Math.round(100*(1/FN.eta-1))+' %',
  lossEst:rg(100*(1-LS.hi),100*(1-LS.lo),1,' %'),lossImp:rg(100*(1-LV.imp[1]),100*(1-LV.imp[0]),1,' %'),tMid:fx(LV.tMid,3)+' mm',sSolved:fx(sS/1e9,2)+' GPa',
  detOn:fx(detent.on,1)+'°',detHome:fx(detent.home,1)+'°'};

const js=`/* essaydata.js: the Wempe essay's figures and numbers that only Node works out, written by marine-chronometer-source/chronometer-working-model/tools/wempe_essaydata.js
   --write: generated, don't edit (rerun the tool; without --write it checks this file). Part of the Wempe model; declares only WEDATA (the tool's header says what each is). */
const WEDATA=${JSON.stringify({sheets,fusee,detent,phys})};
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
