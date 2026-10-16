// Measures the model's escapement against the rules a period text gives for the chronometer escapement: Watch and Clock Escapements (The Keystone, B. Thorpe,
// Philadelphia, 1904), Ch. III "The Chronometer Escapement", pp. 131-152 (Project Gutenberg eBook 17021, which has no page breaks: rows cite the chapter's section (Experience: "Decisions arrived at
// by experience", Details: "Details of construction") or figure, and a page where the book's index gives one; References/README.md, "Books consulted"). The book describes
// a generic English marine chronometer, not the Model 21, so it decides nothing here (CLAUDE.md, source of truth): where the manual, Hamilton's specification or a
// photograph gives a figure, that stands; the book is a cross-check, and a reading for the estimates only where a Model 21 source agrees. Reports, never fails.
// Needs only Node.js:   node keystone.js            (with settings like escapement.js:  node keystone.js rT=0.29)
// The Wempe's (--model wempe: its escapement as its page runs it, WPHYS.ESC through tools/wempe_load.js, its sizes from WESC and its sheets; settings as for the
// Hamilton, makeEsc rebuilt on WESC.SET): node keystone.js --model wempe [--write]   (about 5 s; --write writes tools/keystone_wempe.json, the rows for the Wempe's
// verification report; without it exits 1 only if that file isn't what it finds, never on what the rows say). The 1904 text is generic, as for the Hamilton: the
// Wempe's works drawings decide.
const fs=require('fs'),path=require('path'),WEMPE=(i=>i>=0&&process.argv[i+1]==='wempe')(process.argv.indexOf('--model'));
const ov={};(WEMPE?process.argv.slice(2).filter(a=>a.includes('=')):process.argv.slice(2)).forEach(a=>{const[k,v]=a.split('=');ov[k]=v;});
const WM=WEMPE?require('./wempe_load.js')():null,WS=WM&&WM.WPHYS.SET;
const E=WEMPE?(Object.keys(ov).length?WM.makeEsc({...WS,...Object.fromEntries(Object.entries(ov).map(([k,v])=>[k,+v]))},WS):WM.WPHYS.ESC):require('./escapement.js').build(ov).ESC,ES=E.ES,r=E.measure(),u=E.run,IN=25.4,D=180/Math.PI,src=f=>fs.readFileSync(path.join(__dirname,'..','js',f),'utf8');
const wsrc=WEMPE?fs.readFileSync(path.join(__dirname,'..','..','wempe','js','escapement.js'),'utf8'):null,core=WEMPE?null:src('core.js'),mv=WEMPE?null:src('movement.js');
const toothH=WEMPE?WM.WESC.Y.ew1-WM.WESC.Y.ew0:+/toothPts[\s\S]*?depth:([\d.]+)/.exec(core)[1];   // the teeth's face along the arbor (escapeWheel in core.js; the Wempe's rim 1.4, 05 04_1 and 05 04_7.1)
const spr=WEMPE?[WS.hD]:[...mv.matchAll(/poly\(R\.det,'spring',(-?[\d.]+),(-?[\d.]+)/g)].map(m=>+m[2]-+m[1]);   // the detent spring's two strips, their heights (mm); the Wempe's one, 1.9 (1436)
const BAL_R=WEMPE?+/r2=([\d.]+)\/2/.exec(wsrc)[1]/2:+/BAL_R=([\d.]+)/.exec(mv)[1];   // the Wempe's rim Ø 32.32 −0.04 (05 03 01-1), drawn at its middle
const EB=WEMPE?WS.EB:128;   // the detent spring's modulus (GPa): the Hamilton's beryllium copper, about 128; the Wempe's steel ("Stahl", 1436), 205
const ex=-E.EX,rr=E.rRoll,P=E.P,dot=(a,b)=>a.x*b.x+a.y*b.y,sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y});
/* the 1904 construction (Fig. 139): the wheel's and roller's rims cross a pitch apart on the wheel, so the balance stands at cos(P/2)+sqrt(r²-sin²(P/2)) */
const plant=(p,q)=>Math.cos(p/2)+Math.sqrt(q*q-Math.sin(p/2)**2),arcW=2*Math.acos((ex*ex+1-rr*rr)/(2*ex)),arcR=2*Math.acos((ex*ex+rr*rr-1)/(2*ex*rr));
const d15=plant(24/D,0.5),arcR15=2*Math.acos((d15*d15+0.25-1)/(2*d15*0.5));                      // the book's own wheel: 15 teeth, roller half the wheel
/* where the impulse jewel's tip comes inside the wheel's tip circle (balance angle), before the wheel is released (Fig. 141: 5 degrees) */
let thIn=null;for(let th=-70/D;th<(WEMPE?30/D:0);th+=0.01/D){const a=E.aI+th;if(Math.hypot(E.rp*Math.cos(a)-E.EX,E.rp*Math.sin(a))<1){thIn=th;break;}}
/* the tooth's locking face against the radial line through its tip (Fig. 141: 28 degrees; Saunier 27, Britten 20), and its back's curvature (Details: the impulse roller's radius) */
const tp=E.toothPts(0).map(([q,b])=>({x:q*Math.cos(b),y:q*Math.sin(b)})),face=sub(tp[1],tp[0]),faceA=Math.acos(dot(face,tp[1])/Math.hypot(face.x,face.y))*D;
const back=tp.slice(2,-1),fit=(()=>{let A=[[0,0,0],[0,0,0],[0,0,0]],b=[0,0,0];for(const p of back){const v=[p.x,p.y,1],z=p.x*p.x+p.y*p.y;for(let i=0;i<3;i++){b[i]+=v[i]*z;for(let j=0;j<3;j++)A[i][j]+=v[i]*v[j];}}
  const det=m=>m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])-m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])+m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]),d=det(A),s=[0,1,2].map(k=>det(A.map((row,i)=>row.map((x,j)=>j===k?b[i]:x)))/d);
  return Math.sqrt(s[2]+(s[0]/2)**2+(s[1]/2)**2);})();                                            // least-squares circle through the back (Kåsa)
/* the locking stone: round, with one flat; the book grinds 4/10 of the cylinder away (p. 144, Fig. 143) */
const eJ=dot(sub(E.pieces.stone[0],E.Jc),E.nF),cut=(E.rJ-eJ)/(2*E.rJ),space=2*Math.sin(P/2)*ES;
/* the detent: from the point of flexure to the locking jewel, and the spring (pieces.spring, along dirB and across it) */
const sp=E.pieces.spring,along=p=>dot(sub(p,E.Ft),E.dirB),across=p=>dot(sub(p,E.Ft),E.nB),ext=f=>Math.max(...sp.map(f))-Math.min(...sp.map(f));
const Ld=E.BL*ES,Ls=ext(along)*ES,ts=ext(across)*ES;
/* stiffness E w t³/L³: the model's beryllium copper (E about 128 GPa) against the book's steel (about 200 GPa) at its own sizes, the spring 2/7 of a 0.55 in detent */
const kRat=(EB*spr.reduce((a,b)=>a+b,0)*ts**3/Ls**3)/(200*0.080*IN*(0.002*IN)**3/(2/7*0.55*IN)**3);
const f=(x,n=2)=>x.toFixed(n),rows=WEMPE?(()=>{const near=(a,b,t)=>Math.abs(a-b)<=t*b,rel=(a,b)=>a>b?'larger':'smaller',bk=plant(P,rr)*ES,land=(u.land-E.thRel)*D,dEnt=thIn===null?null:(E.thRel-thIn)*D,dr=E.settings.DRAW;
  return[   /* the Wempe's: its sources the works drawings (References/wempe/transcriptions), each reading from the figures */
  ['Escape wheel: teeth','15 (Experience)',`${E.NT}`,'05 04_07-1 ("z = 15"), 05 04_1 scaled',E.NT===15?'agrees':'differs'],
  ['Escape wheel: diameter','0.55 in, 13.97 mm (Details)',`${f(2*ES)} mm`,'05 04_1 ("Gangrad∅ 14,00"), 05 04_23 (14 +0.03)',near(2*ES,13.97,0.01)?'agrees':'differs'],
  ['Teeth: face along the arbor','1/20 in, 1.27 mm (Details)',`${f(toothH)} mm`,'05 04_1, 05 04_7.1 (the rim 1.4)',near(toothH,1.27,0.05)?'agrees':`${toothH>1.27?'thicker':'thinner'}`],
  ['Impulse roller / wheel diameter','about 1/2 (p. 136; Experience)',`${f(rr,3)}`,'05 04_1 ("Heberolle∅ 6,78")',near(rr,0.5,0.05)?'agrees':'differs'],
  ['Balance from the escape arbor, by the book\'s construction','rims crossing over a pitch (Fig. 139)',`${f(bk)} mm by the rule; the model ${f(ex*ES)} mm`,'05 04_1 ("Gangrad-Unruh 10,00")',`agrees to ${f(Math.abs(bk-ex*ES))} mm`],
  ['Rims\' crossing, on the wheel','a pitch, 24° for 15 teeth (Fig. 139)',`${f(arcW*D,1)}° (pitch ${f(P*D,1)}°)`,'follows from the above',`${f(100*arcW/P,0)}% of a pitch`],
  ['Rims\' crossing, on the roller (balance arc)',`about 48° (Fig. 139; ${f(arcR15*D,1)}° by its own figures)`,`${f(arcR*D,1)}°`,'follows from the above',near(arcR*D,48,0.06)?'agrees':rel(arcR*D,48)],
  ['Impulse arc (balance)','43° of the 48° (Fig. 141)',`${f(r.impEnd-u.land*D,1)}° (tooth lands ${f(u.land*D,1)}°, ends ${f(r.impEnd,1)}°)`,'solved (05 04_1: 21° of the wheel, 10.5° either side of the line of centres)',`less: the wheel, from rest with the seconds arbor behind it, catches the stone ${f(land,1)}° after the release (dynamics.js --model wempe)`],
  ['Jewel inside the wheel before release','5° (Fig. 141)',dEnt===null?'-':`${f(dEnt,1)}°`,'solved (05 04_1)',dEnt!==null&&dEnt<0?`the other way: the stone comes into the teeth's path ${f(-dEnt,1)}° after the release, the wheel running free to it`:'less'],
  ['Unlocking: balance arc','about 5° (p. 146)',`${f(r.rel-r.contact,1)}°`,'solved (05 04_1: the gold spring met at −12°)',near(r.rel-r.contact,5,0.2)?'agrees':`${r.rel-r.contact>5?'more':'less'}: the lock 0.175 deep on a 7 mm wheel (05 04_1)`],
  ['Unlocking: the detent\'s turn','about 2° (p. 150, Drop and draw)',`${f(E.lRel/E.LEN*D,2)}°`,'solved','less; the book\'s 2° is ambiguous (the Hamilton\'s README)'],
  ['Locking stone: draw','about 12° (p. 150, Drop and draw)',`${f(dr,1)}°`,'05 04_1 (the flat on the wheel\'s radius)',dr<=0?'none: the preload holds the tooth, not the draw (tripping.js --model wempe)':'less'],
  ['Locking stone: diameter',`1/3 of a tooth space, ${f(space/3)} mm (p. 144, Fig. 143)`,`${f(2*E.rJ*ES)} mm`,'05 04_1 ("Ruhestein∅ 0,75")',near(2*E.rJ*ES,space/3,0.1)?'agrees':rel(2*E.rJ*ES,space/3)],
  ['Locking stone: cut away','4/10 of the cylinder (p. 144, Fig. 143)',`${f(cut,2)} of its diameter`,'05 04_1 (half round)',near(cut,0.4,0.1)?'agrees roughly':`${cut>0.4?'more':'less'}: half round`],
  ['Tooth\'s locking face to the radial','28° (Fig. 141; Saunier 27°, Britten 20°)',`${f(faceA,1)}°`,'05 04_23 (the face leans 15°)','less undercut: 05 04_23 decides'],
  ['Tooth\'s back: radius',`the impulse roller's, ${f(rr*ES)} mm (Details)`,`${f(fit*ES)} mm (circle fitted to the back)`,'05 04_23 (the ∅ 6 cutter\'s arc)',near(fit,rr,0.15)?'agrees roughly':`${fit>rr?'flatter':'rounder'}: 05 04_23 decides`],
  ['Impulse jewel proud of the roller','at most 0.002 in, 0.05 mm (p. 150, Drop and draw)',`${f((E.rp-E.rRoll)*ES,3)} mm`,'05 04_1 (the stone\'s face to r 3.35, the roller r 3.39)',E.rp<E.rRoll?'agrees: inside the roller\'s edge':'agrees'],
  ['Detent: flexure to locking jewel',`the wheel's diameter, ${f(2*ES)} mm (p. 138)`,`${f(Ld)} mm`,'05 04_1 (the spring\'s middle to the stone)',near(Ld,2*ES,0.1)?'agrees roughly':rel(Ld,2*ES)],
  ['Detent spring: length',`2/7 of that, ${f(Ld*2/7)} mm (p. 138)`,`${f(Ls)} mm (${f(Ls/Ld,3)} of it)`,'1436 (5, scaled)',Ls>Ld*2/7?'longer':'shorter'],
  ['Detent spring: thickness','0.002 in, 0.051 mm (p. 138)',`${f(ts,3)} mm`,'1436 ("0,07", faint)',`${ts>0.051?'thicker':'thinner'}; steel, as the book's`],
  ['Detent spring: width','0.080 in, 2.03 mm (p. 138)',`${spr.map(x=>f(x)).join(' + ')} mm, one strip`,'1436 ("2 (1,9)")',near(spr[0],2.03,0.1)?'agrees roughly':rel(spr[0],2.03)],
  ['Detent spring: stiffness (E w t³/L³)','steel, the book\'s sizes, L 2/7 of 0.55 in',`${f(kRat,2)} of the book\'s`,'1436 (steel, 205 GPa)',`${kRat>=1?'stiffer':'weaker'} by ${f(100*Math.abs(kRat-1),0)}%`],
  ['Balance: vibrations an hour','14,400 (Experience; p. 148)',`${f(2*3600/E.T,0)}`,'the train (the seconds arbor once in 120 teeth)',Math.abs(2*3600/E.T-14400)<1?'agrees':'differs'],
  ['Balance: diameter','about 1.2 in, 30.5 mm (p. 148, Details)',`${f(2*BAL_R,1)} mm`,'05 03 01-1 (32.32 −0.04)',near(2*BAL_R,30.5,0.05)?'agrees roughly':rel(2*BAL_R,30.5)],
  ['Balance: swing','about 225° (p. 142)',`${f(E.A*D,0)}°`,'solved (makeEsc on 05 06_20\'s drive)',near(E.A*D,225,0.03)?'agrees':`${rel(E.A*D,225)}: under the book's, as under the 1954 instruction's 225-270° (open: the Wempe README, Unresolved)`],
  ];})():[
  ['Escape wheel: teeth','15 (Experience)',`${E.NT}`,'Hamilton (chronometerbook post 30)','differs: Hamilton\'s choice'],
  ['Escape wheel: diameter','0.55 in, 13.97 mm (Details)',`${f(2*ES)} mm`,'Hamilton (13.14-13.18)','differs: a smaller wheel'],
  ['Teeth: face along the arbor','1/20 in, 1.27 mm (Details)',`${f(toothH)} mm`,'Hamilton (1.27-1.32)','agrees'],
  ['Impulse roller / wheel diameter','about 1/2 (p. 136; Experience)',`${f(rr,3)}`,'parts list (0.249 in)','agrees'],
  ['Balance from the escape arbor, by the book\'s construction','rims crossing over a pitch (Fig. 139)',`${f(plant(P,rr)*ES)} mm by the rule; the model ${f(ex*ES)} mm`,'L (photo fit, Fig. 90)',`agrees to ${f(Math.abs(plant(P,rr)-ex)*ES)} mm`],
  ['Rims\' crossing, on the wheel','a pitch, 24° for 15 teeth (Fig. 139)',`${f(arcW*D,1)}° (pitch ${f(P*D,1)}°)`,'follows from the above',`${f(100*arcW/P,0)}% of a pitch`],
  ['Rims\' crossing, on the roller (balance arc)',`about 48° (Fig. 139; ${f(arcR15*D,1)}° by its own figures)`,`${f(arcR*D,1)}°`,'follows from the above','smaller wheel, smaller arc'],
  ['Impulse arc (balance)','43° of the 48° (Fig. 141)',`${f(r.impEnd-u.land*D,1)}° (tooth lands ${f(u.land*D,1)}°, ends ${f(r.impEnd,1)}°)`,'solved (manual Ops. 85-87, 97)','less: the wheel, from rest, catches the jewel 16° after release (tools/dynamics.js)'],
  ['Jewel inside the wheel before release','5° (Fig. 141)',thIn===null?'-':`${f((E.thRel-thIn)*D,1)}°`,'solved','less: the manual\'s figures set the release'],
  ['Unlocking: balance arc','about 5° (p. 146)',`${f(r.rel-r.contact,1)}°`,'manual Op. 85 (about 6°)','agrees; the manual decides'],
  ['Unlocking: the detent\'s turn','about 2° (p. 150, Drop and draw)',`${f(E.lRel/E.LEN*D,2)}°`,'solved','less; the book\'s 2° is ambiguous (README)'],
  ['Locking stone: draw','about 12° (p. 150, Drop and draw)',`${f(E.settings.DRAW,0)}°`,'Hamilton (8-12°)','agrees'],
  ['Locking stone: diameter',`1/3 of a tooth space, ${f(space/3)} mm (p. 144, Fig. 143)`,`${f(2*E.rJ*ES)} mm`,'Figs. 57-59 (size unstated)','smaller'],
  ['Locking stone: cut away','4/10 of the cylinder (p. 144, Fig. 143)',`${f(cut,2)} of its diameter`,'Figs. 57-59 (size unstated)','agrees roughly'],
  ['Tooth\'s locking face to the radial','28° (Fig. 141; Saunier 27°, Britten 20°)',`${f(faceA,1)}°`,'traced, Fig. 90','less undercut: Fig. 90 decides'],
  ['Tooth\'s back: radius',`the impulse roller's, ${f(rr*ES)} mm (Details)`,`${f(fit*ES)} mm (circle fitted to the back)`,'traced, Fig. 90','flatter: Fig. 90 decides'],
  ['Impulse jewel proud of the roller','at most 0.002 in, 0.05 mm (p. 150, Drop and draw)',`${f((E.rp-E.rRoll)*ES,3)} mm`,'manual Ops. 76, 83 (flush)','agrees'],
  ['Detent: flexure to locking jewel',`the wheel's diameter, ${f(2*ES)} mm (p. 138)`,`${f(Ld)} mm`,'Fig. 90','differs: Hamilton\'s detent'],
  ['Detent spring: length',`2/7 of that, ${f(Ld*2/7)} mm (p. 138)`,`${f(Ls)} mm (${f(Ls/Ld,3)} of it)`,'Fig. 90','longer'],
  ['Detent spring: thickness','0.002 in, 0.051 mm (p. 138)',`${f(ts,3)} mm`,'estimated','thicker; Hamilton\'s is beryllium copper'],
  ['Detent spring: width','0.080 in, 2.03 mm (p. 138)',`${spr.map(x=>f(x)).join(' + ')} mm, two strips`,'Fig. 14, estimated','narrower, split'],
  ['Detent spring: stiffness (E w t³/L³)','steel, the book\'s sizes, L 2/7 of 0.55 in',`${f(kRat,2)} of the book\'s`,'estimated',`${kRat>=1?'stiffer':'weaker'} by ${f(100*Math.abs(kRat-1),0)}%`],
  ['Balance: vibrations an hour','14,400 (Experience; p. 148)',`${f(2*3600/E.T,0)}`,'manual','agrees'],
  ['Balance: diameter','about 1.2 in, 30.5 mm (p. 148, Details)',`${f(2*BAL_R,1)} mm`,'top-view photograph','agrees roughly'],
  ['Balance: swing','about 225° (p. 142)',`${f(E.settings.A,0)}°`,'manual (1⅜-1½ turns)','differs: the manual decides'],
];
const w=[0,1,2,3].map(i=>Math.max(...rows.map(x=>x[i].length)));
console.log(`  The ${WEMPE?'Wempe\'s':'model\'s'} escapement against The Keystone's Watch and Clock Escapements (1904), Ch. III\n`);
console.log('  '+['measure','the book','the model','the model\'s source'].map((h,i)=>h.padEnd(w[i])).join('  ')+'  reading');
for(const x of rows)console.log('  '+x.slice(0,4).map((s,i)=>s.padEnd(w[i])).join('  ')+'  '+x[4]);
/* the Wempe's rows for its verification report (tools/keystone_wempe.json): written by --write; without it, the file checked (the rows themselves never fail) */
if(WEMPE&&!Object.keys(ov).length){const J={note:'tools/keystone.js --model wempe: the Wempe\'s escapement against The Keystone\'s Watch and Clock Escapements (1904), Ch. III: each measure, the book\'s rule, the model\'s figure, its source and the reading; reports, never judges',
    rows:rows.map(([measure,book,model,source,reading])=>({measure,book,model,source,reading}))},OUT=path.join(__dirname,'keystone_wempe.json'),txt=JSON.stringify(J,null,1)+'\n';
  if(process.argv.includes('--write')){fs.writeFileSync(OUT,txt);console.log('\n  wrote tools/keystone_wempe.json');}
  else{const ok=fs.existsSync(OUT)&&fs.readFileSync(OUT,'utf8').replace(/\r/g,'')===txt;console.log(ok?'\n  ok  tools/keystone_wempe.json is what this finds':'\n  !!  tools/keystone_wempe.json is not what this finds: node keystone.js --model wempe --write');if(!ok)process.exitCode=1;}}
