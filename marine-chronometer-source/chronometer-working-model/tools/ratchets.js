// The ratchets and their pawls, each as the model seats it under load (mechanisms.json, off the built model): the setup click on the setup ratchet (it holds the
// mainspring fully wound), the two winding pawls on the fusee's winding ratchet (they carry the fusee's drive to the sustaining ratchet in running), and the
// sustaining pawl on the sustaining ratchet (it holds the sustaining spring while the key winds). For each:
//   1. engagement: the load's line of action through the contact against the pawl's pivot: whether it draws the pawl in (seats it) or pushes it out, and the
//      friction it holds against (the draw angle against the friction angle, μ 0.10-0.20 for oiled steel, the classic ratchet condition);
//   2. strength: the force at the contact (the ratchet's torque over the line of action's arm about its centre), the tooth bent at its root (a triangular
//      cantilever, σ = 6 F h / b s²), the pawl bent about its pivot, the pivot in shear, and the contact pressure (the contact's length on a face, or a Hertz
//      line contact where a tooth's tip corner bears on the pawl's side, its edge radius 0.02 mm, estimated);
//   3. the pawl's spring: its stiffness (a cantilever, 3 E I / L³, along its length; curved springs taken straight), the force it gives as the pawl rides over
//      a tooth, and whether the pawl falls back in time: the winding pawls when the key lets go and the mainspring turns the fusee forward under them (the back
//      of the tooth they ride falling away as the fusee gathers speed), the sustaining pawl as winding starts and the key turns its ratchet back.
// Needs only Node.js:   node ratchets.js [--json OUT]   (under a second; exits 1 if a load pushes a pawl out past what friction holds at μ 0.10, or a part fails
// at the strong end of its material's range). mechanisms.json is mechanisms.py's (run it after changing a ratchet, a pawl or their places).
const fs=require('fs'),path=require('path'),PH=require('./physics.js'),MJ=require('./mechanisms.json');
const f=(x,n=0)=>(+x).toFixed(n),MPa=1e6,rows=[],out={pawls:[]};let fail=0;const say=s=>rows.push('  '+s);
const STEEL_Y=[1200,1800],STEEL_SH=[840,1200],BRASS_Y=[300,450],E={steel:207e3,brass:100e3},NU={steel:0.29,brass:0.34};
const line=(q,name,load,sig,rg,what)=>{const mL=rg[0]*MPa/sig,mH=rg[1]*MPa/sig,v=mL>=1.5?'ok ':mH>=1?'~~ ':'!! ';if(v==='!! ')fail=1;
  rows.push(`  ${v} ${name.padEnd(46)} ${load.padEnd(12)} ${(f(sig/MPa)+' MPa').padStart(9)}   ${what} ${rg[0]}-${rg[1]}: margin ${f(mL,1)}-${f(mH,1)}`);q.lines.push({name,load,sig:sig/MPa,lo:rg[0],hi:rg[1],what,v:v.trim()});};
const cr=(a,b)=>a[0]*b[1]-a[1]*b[0],sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1],len=a=>Math.hypot(a[0],a[1]);
const A=MJ.arbors,T0=PH.Tf,Fpull=PH.Mup*1000/PH.rB;
/* what each holds, N·m, and what it is made of (movement.js): the setup ratchet and its click steel; the winding ratchet dark (tempered) steel, its pawls steel;
   the sustaining ratchet gilt brass, its pawl steel. The pivots: the click's screw (shank r 0.3, sR of its 0.6 head), the winding pawls' studs (r 0.22), the
   sustaining pawl's arbor (r 0.5); the pawls' narrowest width by the pivot (the click 1.3, pawlGeo; the winding pawls' arm 1.25, WPO; the sustaining pawl's
   blade 2.5, SPN/SPE) */
const SPEC={'setup click':{T:PH.Mup,n:1,rat:'steel',ratY:STEEL_Y,pv:0.3,w:1.3,under:'its faces undercut 4.5°, the middle of the 3-6° measured (KLUwI2UUCMQ 38:26: ratchetface.py)',holds:`the mainspring fully wound (${f(PH.Mup,3)} N·m on the barrel arbor, physics.js)`},
  'winding pawl 1':{T:T0,n:2,rat:'steel',ratY:STEEL_Y,pv:0.22,w:1.25,holds:`the fusee's drive (${f(T0,3)} N·m), shared by the two pawls`},
  'winding pawl 2':{T:T0,n:2,rat:'steel',ratY:STEEL_Y,pv:0.22,w:1.25,holds:`the fusee's drive, shared`},
  'sustaining pawl':{T:T0,n:1,rat:'brass',ratY:BRASS_Y,pv:0.5,w:2.5,src:'its outline traced at KLUwI2UUCMQ 36:15, to about 0.1 mm',fitted:'its end drawn fitted along the face, as a maker stones it (movement.js fitEnd, 14 October 2026; as traced it leaned 43° off and the load pushed it out)',holds:`the sustaining spring loaded to the drive (${f(T0,3)} N·m) while the key winds`}};
const MU=[0.10,0.20];
const judge=(q,s,C,n)=>{const Q=q.pivot,t=[-n[1],n[0]],arm=Math.abs(cr(C,n)),F=s.T*1000/arm/s.n,QC=sub(C,Q),lt=len(QC),v=[-QC[1],QC[0]],sin=Math.sign(dot(v,[-C[0],-C[1]])),an=sin*cr(QC,n),at=Math.abs(cr(QC,t));
  return{F,arm,an,at,lt,draw:Math.atan2(an,at)*180/Math.PI,muc:an/at};};
/* the engagement in words: the line of action's place against the pivot, and what holds the pawl in */
const engage=(g,lab)=>{const fa=MU.map(m=>Math.atan(m)*180/Math.PI);
  if(g.an>=0)return{v:'ok ',txt:`${lab}the load draws it in: its line ${f(g.an,2)} mm inside the pivot, a draw angle of ${f(g.draw,1)}° against the friction angle's ${f(fa[0],1)}-${f(fa[1],1)}° (μ ${MU.join('-')})${g.muc>MU[1]?': it seats itself however the oil is':g.muc>MU[0]?': it seats itself with good oil; dry, friction holds it where it stands':': friction holds it where it stands, its spring seats it'}`};
  const need=-g.muc;return{v:need<=MU[0]?'ok ':need<=MU[1]?'~~ ':'!! ',txt:`${lab}the load pushes it out: its line ${f(-g.an,2)} mm outside the pivot (${f(-g.draw,1)}°), held by friction ${need<=MU[0]?`at μ ${f(need,2)}, under oiled steel's ${MU[0]}`:`only above μ ${f(need,2)}, more than oiled steel's ${MU[0]}`} and its spring`};};
for(const q of MJ.pawls){const s=SPEC[q.name],o={name:q.name,holds:s.holds,lines:[]};out.pawls.push(o);
  const g=judge(q,s,q.face.C,q.face.n),gF=judge(q,s,q.face.fit.C,q.face.fit.n),lean=Math.acos(Math.min(1,Math.abs(dot(q.face.n,q.face.fit.n))))*180/Math.PI,tip=q.face.kind!=='on the face'&&lean>5;   /* a contact within 5° of the face's own normal is a fitted end, bearing on the face */
  say('');say(`${q.name} (${q.z} teeth, m ${f(q.m,3)}, ${f(q.ro-q.ri,2)} deep; holds ${s.holds})`);
  say(`seated ${f(q.face.depth,2)} mm into the teeth (${f(100*q.face.depth/(q.ro-q.ri))} % of their depth), as drawn bearing ${q.face.kind} at r ${f(q.face.r[0],2)}-${f(q.face.r[1],2)}; the force ${f(g.F,1)} N${s.n>1?' (each of two)':''}, ${f(g.lt,2)} from the pivot`);
  const eD=engage(g,tip?'as drawn, ':''),eF=engage(gF,tip?'its end fitted to the face: ':'');
  if(tip){rows.push(`  ~~  ${eD.txt}: as drawn its end leans ${f(lean,0)}° off the face, so a tooth's tip corner meets its side first${s.src?` (${s.src})`:''}. A pawl's end is stoned to bear along the face, its last fitting`);rows.push(`  ${eF.v} ${eF.txt}`);}
  else rows.push(`  ${eD.v} ${eD.txt}${s.under?`; ${s.under}`:''}${s.fitted?`; ${s.fitted} (its end ${f(lean,0)}° off the face)`:''}`);
  const gU=tip?gF:g;if(engage(gU,'').v==='!! ')fail=1;
  Object.assign(o,{F:gU.F,arm:gU.arm,an:gU.an,at:gU.at,draw:gU.draw,muc:gU.muc,lt:gU.lt,depth:q.face.depth,kind:q.face.kind,drawn:{an:g.an,draw:g.draw,muc:g.muc,F:g.F},fitted:tip});
  /* the tooth at its root: a triangle on 0.97 of the pitch at the root circle, loaded at the face's middle (the fitted contact) */
  const F=gU.F,b=Math.min(q.thick,q.pawlThick),sB=0.97*q.p*q.ri,h=Math.hypot(...q.face.fit.C)-q.ri,sT=6*F*h/(b*sB*sB)*MPa;
  line(o,'  the tooth bent at its root',`${f(F,1)} N`,sT,s.ratY,s.rat==='brass'?'brass\'s yield':'hardened steel\'s yield');
  /* the face's bearing: the pawl's end on it over its depth in the teeth, the narrower thickness (run in; a sharp edge yields locally until it bears so) */
  const pB=F/(b*q.face.depth)*MPa;
  line(o,`  the face's bearing (${f(q.face.depth,2)} × ${f(b,2)} mm)`,`${f(F,1)} N`,pB,s.ratY.map(y=>Math.round(1.5*y)),s.rat==='brass'?'brass in bearing (1.5 × yield)':'steel in bearing (1.5 × yield)');
  /* the pawl about its pivot: the force's arm about the pivot over its section by the pivot; the pivot in shear */
  const Mb=F*Math.abs(gU.an),sP=6*Mb/(q.pawlThick*s.w**2)*MPa,sV=F/(Math.PI*s.pv**2)*MPa;
  line(o,`  the pawl bent by the pivot (${s.w} × ${q.pawlThick})`,`${f(Mb,1)} N·mm`,sP,STEEL_Y,'hardened steel\'s yield');
  line(o,`  its pivot in shear (r ${s.pv})`,`${f(F,1)} N`,sV,STEEL_SH,'steel in shear');
  const lt=gU.lt;
  /* the spring: the pawl lifted until its contact clears the tip (the depth over the pivot-contact distance), the spring bearing at its arm from the pivot */
  const sp=q.spring,lift=q.face.depth/lt;let k,arm2,F0=null,what;
  if(sp.kind==='wire'){const I=Math.PI*sp.r**4/4,rw=Math.hypot(...sp.foot);k=3*E.steel*I/sp.len**3;arm2=rw;F0=k*rw*sp.preTurn;what=`steel wire r ${sp.r}, ${f(sp.len,1)} long, upright from the pawl's root ${f(rw,2)} from the pivot, set ${sp.preTurn} rad in`;}
  else{const I=sp.h*sp.w**3/12;k=3*E.steel*I/sp.len**3;arm2=sp.arm||1.1;what=`steel band ${sp.w} × ${sp.h}, ${f(sp.len,1)} long, bearing ${f(arm2,2)} from the pivot (its set, how far its end stands past the pawl's back when free, not given: estimated)`;}
  const Fl=k*arm2*lift,Ml=Fl*arm2;   /* the force and moment the spring adds as the pawl lifts over a tip, its preload aside */
  say(`  its spring: ${what}: ${f(k*1000,1)} mN/mm at its end; the pawl lifted ${f(lift*1000,0)} mrad over a tip adds ${f(Fl*1000,2)} mN (${f(Ml*1000,2)} µN·m)${F0!=null?`; its preload ${f(F0*1000,1)} mN (${f(F0*arm2*1000,1)} µN·m)`:''}`);
  Object.assign(o,{k,arm2,lift,Fl,Ml,F0,I:q.I,mass:q.mass});
  /* falling back in: from a tip, the pawl's tip falls the depth under the spring's moment (preload plus the lift's); the time to reach the root, as a pendulum
     released from its lift (simple harmonic about the seat, plus the preload's constant moment: solved in steps) */
  const fall=Mpre=>{const Ip=q.I*1e-9,kth=k*arm2*arm2*1e-3,dt=1e-6;let th=lift,w=0,tt=0;while(th>0&&tt<0.2){const M=Mpre*1e-3+kth*th;w+=M/Ip*dt;th-=w*dt;tt+=dt;}return tt;};   /* Mpre in N·mm; kth N·m/rad */
  o.fall0=fall(F0!=null?F0*arm2:0);o.fallFree=fall(0);   /* and with no preload at all, its spring pressing only as the tip lifts it */
  if(/winding/.test(q.name)){
    /* the key let go: the mainspring turns the fusee forward, the fusee, the barrel through the chain (at full wind and at run down: the chain leaves the fusee
       at rmin and rmax) and the key on the square, from rest; the pawl must follow the tooth's back down to the root, or meet the next face only partly in */
    const RF=[T0/Fpull*1000,T0/(PH.Mdn*1000/PH.rB)*1000],dr=(q.ro-q.ri)/(0.97*q.p);
    o.letgo=RF.map(rf=>{const J=(A.fusee.I+A.square.I+(A.barrel.I+2100)*(rf/PH.rB)**2)*1e-9,al=T0/J,aB=dr*al,Mreq=aB*q.I*1e-9/lt*1e3;return{rf,J:J*1e9,al,aB,Mreq,Freq:Mreq/arm2};});   /* aB mm/s² at the tip; Mreq N·mm */
    const w=o.letgo.reduce((a,b)=>a.Freq>b.Freq?a:b);
    say(`  let go, the fusee runs forward at ${f(o.letgo[0].al)}-${f(o.letgo[1].al)} rad/s² (${f(o.letgo[0].J)}-${f(o.letgo[1].J)} g·mm² at it, full wind to run down): to follow the tooth's back down, the spring must push ${f(w.Freq*1000,1)} mN at the pawl's arm (${f(w.Mreq*1000,2)} µN·m), ${f(w.Freq/k,2)} mm of set at its end`);
    o.need=w.Freq;o.set=w.Freq/k;
    /* with that set the pawl falls from a tip to the root in fall(); the chance that a key let go finds a pawl still falling, at a turn a second */
    o.fallN=fall(w.Mreq);const tTooth=1/(q.z*1);o.pShallow=o.fallN/tTooth;
    say(`  so set, it falls from a tip to the root in ${f(o.fallN*1000,2)} ms: a key let go at a turn a second finds it still falling ${f(100*o.pShallow,1)} % of the time, and then the face meets it part way in (it draws in from there)`);}
  if(/sustaining/.test(q.name)){
    /* winding starts: the key turns the fusee back, and the ratchet with it through the winding pawls until this pawl holds it: at a turn a second the teeth pass
       under it every 1/z s; it must drop from a tip before the face arrives. Running, the ratchet creeps forward a tooth every 1/z of the fusee's 6.43 h turn,
       and a wind started while it is falling is caught part way in */
    const hrT=1/(PH.TRAIN.cp/PH.TRAIN.fu)*3600/q.z;o.tCreep=hrT;o.pMid=o.fall0/hrT;
    say(`  with its wire's preload it falls from a tip to the root in ${f(o.fall0*1000,2)} ms (${f(o.fallFree*1000,2)} ms with none: any wire that presses it in will do), against ${f(1000/q.z,1)} ms a tooth at a turn a second of the key: in time; running, the ratchet creeps a tooth every ${f(hrT)} s, so a wind starts while it falls ${f(o.pMid*1e6,1)} times in a million`);
    /* the least the wire must be set in (rad) to drop the pawl in a tooth's time: none if it falls in time unloaded (bench.js's pawls test, montecarlo.js) */
    {let lo=0,hi=sp.preTurn*4;if(o.fallFree<=1/q.z)hi=0;else for(let i=0;i<40;i++){const md=(lo+hi)/2;fall(k*arm2*arm2*md)<=1/q.z?hi=md:lo=md;}o.wireNeed=hi;}
    if(o.fall0>1/q.z)fail=1;}}
/* both winding pawls bear together: opposite each other on 36 teeth (an even count), each on its face */
{const W=out.pawls.filter(o=>/winding/.test(o.name));say('');say(`the two winding pawls stand opposite on the ${MJ.pawls[1].z}-tooth ratchet, each ${f(W[0].depth,2)} mm in: they share the drive (made out by a tenth of a tooth, one carries it all: ${f(2*W[0].F,1)} N, still ${f(STEEL_Y[0]/(out.pawls[1].lines[0].sig*2),1)} times short of its tooth's yield)`);}
out.rows=rows;module.exports=out;
if(require.main===module){console.log(rows.join('\n'));const jo=process.argv.indexOf('--json');if(jo>0)fs.writeFileSync(process.argv[jo+1],JSON.stringify(out));process.exitCode=fail;}
