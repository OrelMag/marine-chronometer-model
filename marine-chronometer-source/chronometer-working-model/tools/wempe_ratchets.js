// The Wempe's pawls on their ratchets, as ratchets.js does the Hamilton's (wempe/js/fusee.js and frame.js; their geometry off the built model, mechanisms_wempe.json,
// which mechanisms.py --model wempe writes): the two maintaining clicks (05 06 02-3) on the click wheel (05 06 04-3), which carry the fusee's drive to the maintaining
// ratchet running; the maintaining detent (05 05 05-1) on the maintaining ratchet (05 06 02-1), which holds it against the maintaining spring while the key turns; the
// set-up click (05 08 05-2) on the set-up ratchet (05 07 00-3), which holds the mainspring on the barrel arbor. For each:
//   1. engagement: the load's line of action through the contact (the ratchet's normal there) against the pawl's pivot: whether it draws the pawl in, and against the
//      friction angle (μ 0.10-0.20, oiled steel on brass: ratchets.js's); as drawn, and with the pawl's end bearing at the middle of the face's depth (its end fitted, a
//      maker's last fitting, as ratchets.js takes a tip-corner contact);
//   2. strength at the strong load (fully wound: the fusee arbor's 05 06_20 pull at its highest, the barrel arbor's at the measured level, wempe_physics.js): the tooth bent
//      at its root (σ = 6 F h / b s²), the face's bearing, the pivot in shear (ratchets.js's ranges);
//   3. the springs: the clicks' bronze springs (05 06 02-2: 1.5 × 0.4, 27 stretched; their free span and E estimated) and what they must do when the key lets go (follow
//      the click wheel's backs down as the fusee runs forward, ratchets.js's winding pawls' test, the fusee's and barrel's inertia off the solids); the detent's wire
//      (05 05 06-1: steel Ø 0.25, loaded 12.3 from its stud: README) and its preload, and how far back the ratchet falls before the detent holds it against the
//      maintaining spring's own travel (05 06_9's x = 0.27 mm at r 14.2, WPHYS.SUS: README, Physics).
// Needs only Node.js:   node wempe_ratchets.js [--json OUT]   (under a second; exits 1 if a load pushes a pawl out past what friction holds at μ 0.10 with its end fitted,
// or a part fails at the strong end of its material's range).
const fs=require('fs'),W=require('./wempe_load.js')(),MJ=require(process.env.MC_MECH_WEMPE||'./mechanisms_wempe.json');   /* MC_MECH_WEMPE: another file of the same form (a planted fault) */
const quiet=f=>{const o=console.log;console.log=()=>{};try{return f();}finally{console.log=o;}},WP=quiet(()=>require('./wempe_physics.js'));
const f=(x,n=0)=>(+x).toFixed(n),MPa=1e6,rows=[],out={pawls:[]};let fail=0;const say=s=>rows.push('  '+s);
const STEEL_Y=[1200,1800],STEEL_SH=[840,1200],BRASS_Y=[300,450],E={steel:207e3,bronze:[100e3,120e3]};
const line=(q,name,load,sig,rg,what)=>{const mL=rg[0]*MPa/sig,mH=rg[1]*MPa/sig,v=mL>=1.5?'ok ':mH>=1?'~~ ':'!! ';if(v==='!! ')fail=1;
  rows.push(`  ${v} ${name.padEnd(46)} ${load.padEnd(12)} ${(f(sig/MPa)+' MPa').padStart(9)}   ${what} ${rg[0]}-${rg[1]}: margin ${f(mL,1)}-${f(mH,1)}`);q.lines.push({name,load,sig:sig/MPa,lo:rg[0],hi:rg[1],what,v:v.trim()});};
const cr=(a,b)=>a[0]*b[1]-a[1]*b[0],sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1],len=a=>Math.hypot(a[0],a[1]);
const P=W.WPHYS,Tf=Math.max(...P.KV.map(([,g])=>g))*P.LEV*9.80665e-6,Mup=WP.MupM,Mdn=WP.FN.Mdown*WP.Kl;   /* N·m: the fusee arbor's highest (05 06_20), the barrel arbor's fully wound and run down */
/* what each holds and what it's made of (the sheets): the click wheel, maintaining ratchet and set-up ratchet brass (Ms 58 federhart); the clicks and detent steel, the set-up
   click brass (Messingblech 3 Ms 58 federhart, its own spring). The pivots: the clicks' screws' shoulders Ø 1.19 (fusee.js), the detent's arbor's pivots Ø 0.88 (two),
   the set-up click's screw's shoulder Ø 3.1 (frame.js) */
const SPEC={'click 1':{T:Tf,rat:BRASS_Y,pv:0.595,holds:`the fusee's drive running (${f(Tf,3)} N·m at its highest, 05 06_20), one click bearing`},
  'click 2':{T:Tf,rat:BRASS_Y,pv:0.595,holds:`the fusee's drive, half a tooth on from click 1 (it bears when it is the one at a face)`},
  'maintaining detent':{T:Tf,rat:BRASS_Y,pv:0.44,holds:`the maintaining spring loaded to the drive (${f(Tf,3)} N·m) while the key turns`},
  'set-up click':{T:Mup,rat:BRASS_Y,pv:1.55,pawl:BRASS_Y,holds:`the mainspring fully wound (${f(Mup,3)} N·m on the barrel arbor at the measured level, wempe_physics.js)`}};
const MU=[0.10,0.20];
const judge=(q,s,C,n)=>{const Q=q.pivot,t=[-n[1],n[0]],arm=Math.abs(cr(C,n)),F=s.T*1000/arm,QC=sub(C,Q),lt=len(QC),v=[-QC[1],QC[0]],sg=Math.sign(dot(v,[-C[0],-C[1]])),an=sg*cr(QC,n),at=Math.abs(cr(QC,t));
  return{F,arm,an,at,lt,draw:Math.atan2(an,at)*180/Math.PI,muc:an/at};};
const engage=(g,lab)=>{const fa=MU.map(m=>Math.atan(m)*180/Math.PI);
  if(g.an>=0)return{v:'ok ',txt:`${lab}the load draws it in: its line ${f(g.an,2)} mm inside the pivot, a draw angle of ${f(g.draw,1)}° against the friction angle's ${f(fa[0],1)}-${f(fa[1],1)}° (μ ${MU.join('-')})${g.muc>MU[1]?': it seats itself however the oil is':g.muc>MU[0]?': it seats itself with good oil; dry, friction holds it where it stands':': friction holds it where it stands, its spring seats it'}`};
  const need=-g.muc;return{v:need<=MU[0]?'ok ':need<=MU[1]?'~~ ':'!! ',txt:`${lab}the load pushes it out: its line ${f(-g.an,2)} mm outside the pivot (${f(-g.draw,1)}°), held by friction ${need<=MU[0]?`at μ ${f(need,2)}, under oiled steel's ${MU[0]}`:`only above μ ${f(need,2)}, more than oiled steel's ${MU[0]}`} and its spring`};};
/* the face's middle: along the face's line (its tangent at the contact) to the radius halfway down the teeth */
const mid=(q)=>{const C=q.face.C,n=q.face.n,t=[-n[1],n[0]],rm=(q.ro+q.ri)/2,b=dot(C,t),c=dot(C,C)-rm*rm,d=b*b-c;if(d<0)return C;const s1=-b+Math.sqrt(d),s2=-b-Math.sqrt(d),s=Math.abs(s1)<Math.abs(s2)?s1:s2;return[C[0]+s*t[0],C[1]+s*t[1]];};
for(const q of MJ.pawls){const s=SPEC[q.name],o={name:q.name,holds:s.holds,lines:[]};out.pawls.push(o);
  if(q.error){say(`${q.name}: ${q.error}`);fail=1;continue;}
  const g=judge(q,s,q.face.C,q.face.n),Cm=mid(q),gF=judge(q,s,Cm,q.face.n),deep=q.face.depth/(q.ro-q.ri);
  say('');say(`${q.name} (${q.z} teeth, ${f(q.ro-q.ri,3)} deep; holds ${s.holds})`);
  say(`as drawn ${f(q.face.depth,3)} mm into the teeth (${f(100*deep)} %), ${f(q.face.gap,3)} mm short of the face the load turns onto it (${f(q.face.gap/(Math.hypot(...q.face.C)*2*Math.PI/q.z)*100)} % of a pitch), meeting ${q.face.kind} at r ${f(q.face.r[0],2)}; the force ${f(g.F,1)} N, ${f(g.lt,2)} from the pivot; the faces ${f(q.height,2)} high`);
  const eD=engage(g,'as drawn, '),eF=engage(gF,'its end at the face\'s middle: ');rows.push(`  ${eD.v} ${eD.txt}`);rows.push(`  ${eF.v} ${eF.txt}`);
  const gU=q.face.kind==='on the face'?g:gF;if(engage(gU,'').v==='!! ')fail=1;   /* a tip corner on the pawl is judged with its end fitted (ratchets.js's) */
  Object.assign(o,{F:gU.F,an:gU.an,draw:gU.draw,muc:gU.muc,drawn:{an:g.an,draw:g.draw,muc:g.muc},fitted:{an:gF.an,draw:gF.draw,muc:gF.muc},depth:q.face.depth,gap:q.face.gap,kind:q.face.kind});
  const F=gU.F,b=q.height,sB=0.97*q.p*q.ri,h=Math.max(0.05,Math.hypot(...Cm)-q.ri),sT=6*F*h/(b*sB*sB)*MPa;
  line(o,'  the tooth bent at its root',`${f(F,1)} N`,sT,s.rat,'brass\'s yield');
  const dB=Math.max(0.05,q.ro-Math.hypot(...Cm))*2,pB=F/(b*dB)*MPa;
  line(o,`  the face's bearing (${f(dB,2)} × ${f(b,2)} mm)`,`${f(F,1)} N`,pB,s.rat.map(y=>Math.round(1.5*y)),'brass in bearing (1.5 × yield)');
  line(o,`  its pivot in shear (r ${s.pv})`,`${f(F,1)} N`,F/(Math.PI*s.pv**2)*MPa,STEEL_SH,'steel in shear');}
/* the clicks' springs (05 06 02-2: Bronzeband 1.5 × 0.4 federhart, 27 long stretched, bent in its 0.4): pinned along the cup's wall through 18° and an S, its free span to
   the click's back about 12-16 (estimated, as fusee.js lays it), bearing about 3 from the click's pivot (estimated); E 100-120 GPa (spring bronze) */
{const cl=out.pawls.find(o=>o.name==='click 1'),q=MJ.pawls.find(p=>p.name==='click 1'),I=1.5*0.4**3/12,ks=[[E.bronze[0],16],[E.bronze[1],12]].map(([e,L])=>3*e*I/L**3),arm=3.0,lt=Math.hypot(...sub(q.face.C,q.pivot));
  /* the key let go: the mainspring turns the fusee forward from rest, the barrel with it through the chain (reflected by the chain's lever, fusee to barrel arbor: the
     torques' ratio fully wound and run down), its back falling away under the click; the click must follow it down, or the next face meets it part way in */
  const A=MJ.arbors,dr=(q.ro-q.ri)/(0.97*q.p),cases=[[Tf/Mup,'fully wound'],[P.fusT(8.69)/Mdn,'near run down']].map(([rr,w])=>{const J=(A.fusee.I+A.barrel.I*rr*rr)*1e-9,al=P.fusT(w==='fully wound'?0:8.69)/J,aB=dr*al,Mreq=aB*q.I*1e-9/lt*1e3;return{w,rr,J:J*1e9,al,aB,Mreq,Freq:Mreq/arm};});
  const wc=cases.reduce((a,b)=>a.Freq>b.Freq?a:b);
  say('');say(`the clicks' springs: bronze 1.5 × 0.4, a free span of 12-16 (estimated): ${f(ks[0]*1000)}-${f(ks[1]*1000)} mN/mm at the click's back, about ${arm} from its pivot`);
  say(`  let go, the fusee runs forward at ${cases.map(c=>f(c.al)+' rad/s² '+c.w).join(', ')} (${cases.map(c=>f(c.J)).join(', ')} g·mm² at it: the fusee ${f(A.fusee.I)} and the barrel ${f(A.barrel.I)} through the chain's lever ${cases.map(c=>f(c.rr,2)).join(', ')}): to follow the click wheel's backs down a click needs ${f(wc.Freq*1000,1)} mN at its spring (${f(wc.Mreq*1000,2)} µN·m), ${f(wc.Freq/ks[1],3)}-${f(wc.Freq/ks[0],3)} mm of the spring's set`);
  Object.assign(cl,{k:ks,letgo:cases,need:wc.Freq});
  const two=out.pawls.filter(o=>/^click/.test(o.name)),q2=MJ.pawls.find(p=>p.name==='click 2');
  say(`  the two clicks stand half a tooth apart (click 1 ${f(q.face.gap,3)} mm from its face, click 2 ${f(q2.face.gap,3)}, a pitch ${f(2*Math.PI*Math.hypot(...q.face.C)/q.z,2)} at the contact): when the key lets go the fusee turns at most half a pitch before one bears`);}
/* the maintaining detent's wire (05 05 06-1: steel Ø 0.25, its stud's end to the detent's corner 12.3: README) and how far back the ratchet falls before the detent holds it */
{const o=out.pawls.find(o=>o.name==='maintaining detent'),q=MJ.pawls.find(p=>p.name==='maintaining detent'),I=Math.PI*0.125**4/4,k=3*E.steel*I/12.3**3,arm=4.73;   /* hole 5 from hole 4 (05 08_1a) */
  const pitchDeg=360/q.z,fallDeg=q.face.gap/Math.hypot(...q.face.C)*180/Math.PI,trav=0.27/14.2*180/Math.PI,keep=Math.min(1,trav/pitchDeg),mean=keep*(trav>=pitchDeg?1-pitchDeg/(2*trav):0.5);
  say('');say(`the maintaining detent's wire: steel Ø 0.25, loaded 12.3 from its stud: ${f(k*1000,1)} mN/mm at the detent, ${arm} from its pivot (holes 4 and 5)`);
  const v=trav>=pitchDeg?'ok ':'~~ ';
  rows.push(`  ${v} the key put on: the ratchet falls back to the detent: here ${f(fallDeg,2)}°, anywhere from 0 to a tooth's ${f(pitchDeg,2)}° as it creeps on running, against the maintaining spring's ${f(trav,2)}° of travel (05 06_9's x = 0.27 mm at r 14.2: README, Physics; WPHYS.SUS ${f(P.SUS)} s): ${trav>=pitchDeg?'it always holds some of the drive':`a wind started with the detent more than ${f(trav,2)}° from a face finds the spring let down: ${f(100*keep)} % of winds keep any drive, on average ${f(100*mean)} % of it (the page's maintaining spring takes its full drive into every wind)`}`);
  Object.assign(o,{k,arm,fallDeg,pitchDeg,trav,keep,mean});}
/* the set-up click: brass, its own spring (05 08 05-2: "Messingblech 3 Ms 58 federhart"; no separate spring drawn) */
{const q=MJ.pawls.find(p=>p.name==='set-up click');say('');say(`the set-up click: brass, its own spring (no spring drawn); ${f(q.face.gap,3)} mm short of the face (${f(q.face.gap/Math.hypot(...q.face.C)*180/Math.PI,2)}° of the barrel arbor) as drawn`);}
out.rows=rows;out.Tf=Tf;out.Mup=Mup;module.exports=out;
if(require.main===module){console.log(rows.join('\n'));const jo=process.argv.indexOf('--json');if(jo>0)fs.writeFileSync(process.argv[jo+1],JSON.stringify(out));console.log(fail?'wempe_ratchets: FAIL':'wempe_ratchets: ok');process.exitCode=fail;}
