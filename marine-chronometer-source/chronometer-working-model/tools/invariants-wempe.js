/* invariants-wempe.js: run in the Wempe's page by invariants.py --model wempe. The model's arithmetic, its movement's update driven directly (frozen, as audit.py freezes it):
   - the meshes: every pair of wheels and pinions drawn in mesh (userData.gear, the centres m (z1 + z2) / 2 apart in plan, their faces overlapping) turns in the ratio of
     their teeth, the other way, through the movement's own update; their centres the tables' to 0.002 (05 05_1, 05 02_1: the sheets' centre distances); seven of them;
   - the hands against the time: with the escape wheel at E = 2t teeth (t seconds, a beat each half second) each hand's tip points where a clock reading t puts it: the
     seconds hand a turn a minute (120 beats), the minute hand an hour, the hour hand 12 hours; the escape wheel 24 deg a tooth; the cannon pinion with the minute hand and
     the hour wheel with the hour hand; setting 10 minutes (the cannon pinion's slip) turns the minute hand 60 deg and the hour hand 5, the train not at all;
   - the up-and-down work: its hand at the dial's 0 (22.5 deg right of 12, dial.js's printed scale, Wempe 3955's) at full wind and at its 56 (22.5 left) after 8.75 turns of
     the fusee (05 06_20's working turns, Lange's "7/8 Teilung"), turning with its wheel; what it reads after 56 h of the train and at run down;
   - the fusee: a turn in 90/14 h of the train (the fusee wheel's 90 on the centre pinion's 14), turning with its wheel running; the groove's 8.75 working turns and the model's
     wind from the stop to run down against the dial's 56 h;
   - the balance: WESC.SET's moment of inertia and the escape arbor's against the solids as wempe_inertia.json weighed them (opt.inertia); 05 04_1's 10.00 between the
     balance and the escape wheel. Returns rows {name, got, want, tol, unit, ok} (rep: reported, never failing) */
(opt)=>{const mv=window.__mv,R=mv.userData.R,DL=R.dl,FU=R.fu,T=THREE,TAU=Math.PI*2,D=Math.PI/180,out=[];
  if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
  const u=(E,n,w,slip)=>mv.userData._u({E,th:0,lift:0,psDef:0,n,winding:!!w,slip:slip||0});
  const wrap=a=>{a=((a%TAU)+TAU)%TAU;return a>Math.PI?a-TAU:a;},chk=(name,got,want,tol,unit,rep)=>out.push({name,got,want,tol,unit,rep:!!rep,ok:rep||Math.abs(got-want)<=tol});
  const inv=new T.Matrix4(),loc=o=>{mv.updateMatrixWorld(true);inv.copy(mv.matrixWorld).invert();return new T.Matrix4().multiplyMatrices(inv,o.matrixWorld);};
  const ang=o=>{const e=loc(o).elements;return Math.atan2(e[8],e[0]);};   /* a part's turn about y in the movement's frame */
  const vis=o=>{for(let h=o;h&&h!==mv;h=h.parent)if(!h.visible)return false;return true;};
  /* a hand's tip: the mean of its vertices within 0.05 of the farthest from its arbor (the tip's two corners: the farthest alone is a corner, off the hand's middle line by
     its half width), as a clockwise angle from 12 seen from the dial (12 is -z, 3 o'clock +x); within 0.03-0.08 deg of its middle line, so the hands are checked to 0.1 deg
     (a second on the minute hand, 0.02 h on the up-and-down dial) */
  const tip=(g,c)=>{const v=new T.Vector3(),P=[];g.traverse(o=>{if(!o.isMesh||!vis(o))return;const M=loc(o),Q=o.geometry.attributes.position;for(let i=0;i<Q.count;i++){v.fromBufferAttribute(Q,i).applyMatrix4(M);P.push([v.x-c[0],v.z-c[1]]);}});
    const d0=Math.max(...P.map(p=>Math.hypot(p[0],p[1]))),F=P.filter(p=>Math.hypot(p[0],p[1])>d0-0.05),m=F.reduce((s,p)=>[s[0]+p[0],s[1]+p[1]],[0,0]);return Math.atan2(m[0],-m[1]);};
  const H=WD.H,cw=a=>wrap(a)/D;   /* the hole table: [x, z] in the movement's frame */
  /* ---- the meshes ---- */
  const G=[];mv.traverse(o=>{if(o.isMesh&&o.userData.gear&&vis(o)){const M=loc(o),gb=o.userData.gear.box,bb=(gb?new T.Box3(new T.Vector3(gb[0],gb[1],gb[2]),new T.Vector3(gb[3],gb[4],gb[5])).applyMatrix4(o.matrixWorld):new T.Box3().setFromObject(o)).applyMatrix4(new T.Matrix4().copy(mv.matrixWorld).invert());G.push({o,z:o.userData.gear.z,m:o.userData.gear.m,c:[M.elements[12],M.elements[14]],y:[bb.min.y,bb.max.y],hn:o.userData.hn||'?'});}});
  const P=[];for(let i=0;i<G.length;i++)for(let j=i+1;j<G.length;j++){const a=G[i],b=G[j],d=Math.hypot(a.c[0]-b.c[0],a.c[1]-b.c[1]);
    if(Math.abs(a.m-b.m)>0.02*a.m||a.y[1]<b.y[0]||b.y[1]<a.y[0])continue;const want=(a.z>b.z?a.m:b.m)*(a.z+b.z)/2;   /* the wheel's module (the escape pinion's 0.263 is its label) */if(Math.abs(d-want)<0.05)P.push({a,b,d,want});}
  /* turned through the update: the train 6 escape teeth on and the fusee with it (running), and the fusee alone 0.3 turn (winding: the up-and-down pinion and wheel) */
  const s0=P.map(p=>[ang(p.a.o),ang(p.b.o)]);u(1000,3);const s1=P.map(p=>[ang(p.a.o),ang(p.b.o)]);u(1006,3+6/7200*14/90);const s2=P.map(p=>[ang(p.a.o),ang(p.b.o)]);u(1006,2.7,true);const s3=P.map(p=>[ang(p.a.o),ang(p.b.o)]);
  P.forEach((p,k)=>{let da=wrap(s2[k][0]-s1[k][0]),db=wrap(s2[k][1]-s1[k][1]);if(Math.abs(da)<1e-9&&Math.abs(db)<1e-9){da=wrap(s3[k][0]-s2[k][0]);db=wrap(s3[k][1]-s2[k][1]);}
    const nm=`${p.a.hn} (${p.a.z}) and ${p.b.hn} (${p.b.z})`;
    chk(`mesh ${nm}: turns as their teeth, the other way`,Math.abs(da)+Math.abs(db)>1e-9?(da*p.a.z+db*p.b.z)/(Math.abs(da*p.a.z)+1e-30):9,0,1e-6,'of its turn');
    chk(`mesh ${nm}: centres m (z1+z2)/2 apart`,p.d,p.want,0.002,'mm');});
  chk('meshes found (fusee wheel, centre, intermediate, seconds; cannon, change, up-and-down)',P.length,7,0,'');
  /* ---- the hands against the time ---- */
  const C1=[H[1][0],H[1][1]],CS=[H[35][0],H[35][1]],CU=[H[2][0],H[2][1]];
  for(const t of[37.5,754.5,5230,40001.5]){u(2*t,3);
    chk(`seconds hand at t=${t} s (a turn a minute, 120 beats)`,cw(tip(DL.sh,CS)-TAU*t/60),0,0.1,'deg off');
    chk(`minute hand at t=${t} s (a turn an hour)`,cw(tip(DL.mh,C1)-TAU*t/3600),0,0.1,'deg off');
    chk(`hour hand at t=${t} s (a turn in 12 h)`,cw(tip(DL.hh,C1)-TAU*t/43200),0,0.1,'deg off');
    chk(`cannon pinion with the minute hand at t=${t} s`,cw(ang(DL.cn)-ang(DL.mh)),0,1e-9,'deg off');chk(`hour wheel with the hour hand at t=${t} s`,cw(ang(DL.hw)-ang(DL.hh)),0,1e-9,'deg off');}
  {u(1000,3);const e0=ang(R.esc.ew);u(1001,3);chk('escape wheel: a tooth a beat, 24 deg (15 teeth)',cw(ang(R.esc.ew)-e0),24,1e-6,'deg');}
  {u(1509*2,3);const m0=tip(DL.mh,C1),h0=tip(DL.hh,C1),sc=tip(DL.sh,CS),c0=ang(R.tr.cw),f0=ang(FU.keySeat.g);u(1509*2,3,false,600);
    chk('setting 10 min: minute hand',cw(tip(DL.mh,C1)-m0),60,1e-6,'deg');chk('setting 10 min: hour hand',cw(tip(DL.hh,C1)-h0),5,0.05,'deg');chk('setting 10 min: seconds hand untouched',cw(tip(DL.sh,CS)-sc),0,1e-9,'deg');
    chk('setting 10 min: the centre arbor (the train) untouched',cw(ang(R.tr.cw)-c0),0,1e-9,'deg');chk('setting 10 min: the fusee untouched',cw(ang(FU.keySeat.g)-f0),0,1e-9,'deg');}
  /* ---- the up-and-down work: the dial's printed scale (dial.js's ua: 22.5 + h/8 × 45 deg), 0 at full wind and 56 after 8.75 turns ---- */
  const ua=h=>22.5+h/8*45,rd=a=>((a/D-22.5+360)%360)/45*8;
  u(1000,0,true);u(1000,0);chk("up-and-down hand fully wound, at the dial's 0",cw(tip(DL.uh,CU))-22.5,0,0.1,'deg off');
  u(1000,8.75);chk("up-and-down hand after 8.75 fusee turns, at the dial's 56",(tip(DL.uh,CU)/D+360)%360,ua(56),0.1,'deg');
  {u(1000,1);const a0=ang(DL.uh),w0=ang(DL.ud);u(1000+7200*20,1+20*14/90);chk('up-and-down hand turning with its wheel (20 h of the train)',cw(ang(DL.uh)-a0)-cw(ang(DL.ud)-w0),0,0.1,'deg');}
  u(56*7200,56*14/90);const r56=rd((tip(DL.uh,CU)+TAU)%TAU);chk('up-and-down hand after 56 h of the train (90/14 h a fusee turn; the dial 3.75 turns in 24 h, 05 06_20)',r56,56,0.5,'h');
  const HRUN=__W().HRUN;u(1000,FU.NRUN);chk('up-and-down hand at run down reads the hours run',rd((tip(DL.uh,CU)+TAU)%TAU),HRUN,0.5,'h');
  /* ---- the fusee ---- */
  {u(0,2);const f0=ang(FU.keySeat.g),w0=ang(G.find(g=>g.z===90&&g.hn.startsWith('0506')).o);u(7200,2+14/90);
    chk('fusee: a turn in 90/14 h of the train (the fusee wheel 1 h)',cw(ang(G.find(g=>g.z===90&&g.hn.startsWith('0506')).o)-w0),360*14/90,1e-6,'deg');chk('fusee: turning with its wheel running',cw(ang(FU.keySeat.g)-f0),360*14/90,1e-6,'deg');}
  chk("fusee: the groove's 8.75 working turns (05 06_20) run 56 h (the dial's 56)",8.75*FU.HPT,56,0.5,'h');
  chk('fusee: the model from its stop to run down (the dial 56 h)',HRUN,56,0.5,'h');
  chk("fusee: its full wind is escphys.js's (fusee.js MW, WPHYS.MF)",FU.MW,WPHYS.MF,0.002,'turns');
  /* ---- the balance and escape arbor as weighed ---- */
  {const J=opt.inertia,Ib=J.balance.I+J.rollers.I+J.collet.I+J.spring.I/3,JW=J.escape.I+(J.seconds.I+J.secondsHand.I)/64;
    chk('balance: WESC.SET.I against its solids (wempe_inertia.json: with its rollers, collet and a third of its spring)',WESC.SET.I,Ib,0.5,'g mm2');
    chk('escape arbor: WESC.SET.JW against its solids (the seconds arbor and hand reflected, / 8²)',WESC.SET.JW,JW,0.05,'g mm2');
    chk('balance: its period with the drawn hairspring (the train beats 0.5 s; the timing a maker sets)',WPHYS.HS.T,0.5,0.01,'s');}
  chk("05 04_1: the balance 10.00 from the escape wheel (holes 23, 26)",Math.hypot(H[23][0]-H[26][0],H[23][1]-H[26][1]),10.0,0.001,'mm');
  /* the Winding slider (index.html) reaches the run down the page takes (HRUN, from the fusee): reported */
  {const h=document.getElementById('hrs'),st=+h.step||1;chk('the Winding slider reaches run down (HRUN a whole number of its steps)',Math.abs(HRUN-Math.round(HRUN/st)*st),0,1e-6,'h',true);}
  return out;}
