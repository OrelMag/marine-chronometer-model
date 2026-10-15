// The Wempe's escapement in time (Node.js, no browser): makeEsc (../../shared/escapement.js) built with the Wempe's settings (WESC.SET in ../../wempe/js/escapement.js, from
// its layout of sheet 05 04_1 and the parts' sheets) and driven by the measured fusee (WPHYS in ../../wempe/js/escphys.js: 05 06_20's force through the train), as the
// Wempe's page runs it (tools/wempe_load.js loads the page's own scripts). Prints and checks, as tools/escapement.js does for the Hamilton:
//   the adapter between the two frames (the layout's plan, seen from the dial, and makeEsc's, seen from above: the stone, the locked tip, and the detent's turn against
//     makeEsc's lift), to 1e-9 of the wheel's radius;
//   the bodies (WESC.SET's I, JW, ID) against the model's solids (wempe_inertia.json, tools/wempe_inertia.py);
//   the hairspring's stiffness from its sheet and the period it gives the weighed balance (reported, not fitted);
//   the drive over the wind (05 06_20, the train's ratio and efficiency) and, from it, the mainspring's torque and stress as a check on how the sheet is read;
//   the balance's damping from its parts (air on its masses, timing weights, arm and cuts; the endstone; the spring), the free run-down TF it gives and the model's;
//   measure()'s figures against sheet 05 04_1's angles where they are given, the solved events against escapement.js's kinematic ones, the swing and the rate across the
//   wind, the run-down with the train held and the maintaining spring's minute; and stoneClash, the locking stone never inside a tooth, as tools/escapement.js runs it.
// Exits 1 if it doesn't solve, the adapter or the bodies disagree, the swing leaves the band the sources set (below), or the stone passes 1 µm into a tooth. About 15 s.
//   node wempe_escapement.js
const fs=require('fs'),path=require('path'),W=require('./wempe_load.js')(),{stoneClash}=require('./escapement.js');
const{WESC,WPHYS:P}=W,E=P.ESC,S=P.SET,d=Math.PI/180,f=(x,n=1)=>Number.isFinite(x)?x.toFixed(n):'-',sg=(x,n=2)=>Number.isFinite(x)?(x>=0?'+':'')+x.toFixed(n):'-';
let fail=0;const ok=(c,s)=>{if(!c)fail=1;console.log(`${c?'  ok ':'  !! '} ${s}`);},say=s=>console.log('  '+s),head=s=>console.log('\n'+s);

head('the frames: the layout (escapement.js, from the dial) in makeEsc\'s (from above)');
{const P0=WESC.MK(WESC.P),dS=Math.hypot(E.Jc.x-P0.x,E.Jc.y-P0.y);
  /* the locked tip: makeEsc's S, against the layout's tip at the stone's angle, P_A from the wheel at its radius */
  const Wl=WESC.W,Pl=WESC.P,aP=Math.atan2(-(Pl[1]-Wl[1]),Pl[0]-Wl[0]),St=WESC.MK([Wl[0]+7*Math.cos(aP),Wl[1]-7*Math.sin(aP)]),dT=Math.hypot(E.S.x-St.x,E.S.y-St.y);
  /* the detent turned: the layout's stone centre turned toKin(l) about its flexure (rotation.y: the plan angle rising), against makeEsc's turned -l/LEN about Ft */
  const piv=WESC.DPIV;let dR=0;for(let k=0;k<=10;k++){const l=E.lRel*1.3*k/10,g=WESC.toKin(l,E.LEN),v=[Pl[0]-piv[0],Pl[1]-piv[1]],a=Math.atan2(-v[1],v[0])+g,r=Math.hypot(v[0],v[1]),q=WESC.MK([piv[0]+r*Math.cos(a),piv[1]-r*Math.sin(a)]);
    const c=Math.cos(-l/E.LEN),s=Math.sin(-l/E.LEN),x=E.Ft.x+(E.Jc.x-E.Ft.x)*c-(E.Jc.y-E.Ft.y)*s,y=E.Ft.y+(E.Jc.x-E.Ft.x)*s+(E.Jc.y-E.Ft.y)*c;dR=Math.max(dR,Math.hypot(q.x-x,q.y-y));}
  ok(dS<1e-9&&dT<1e-9&&dR<1e-9,`the stone's centre, the locked tip and the stone carried by the detent's turn (toKin: lift/LEN, ${f(1/E.LEN/E.ES,4)} rad a mm of the gold spring's tip's travel) agree in both frames: ${dS.toExponential(1)}, ${dT.toExponential(1)}, ${dR.toExponential(1)} of the wheel's radius`);
  say(`makeEsc's settings from the layout: the wheel ${E.NT} teeth, radius ${f(S.ES,2)} mm, ${f(-S.EX*S.ES,3)} mm from the balance; the lock at ${f(E.lockA/d,2)}° (LO ${f(S.LO,2)}); the detent ${f(S.BL*S.ES,2)} mm from its flexure to the tip, at ${f(S.DA,2)}°, the stone's flat drawing ${f(S.DRAW,2)}°; the gold spring's end ${f(S.rT*S.ES,3)} mm from the staff, ${f(S.PSL*S.ES,2)} free; the discharge stone's reach ${f((S.rd-0.5*S.tsT/2/S.ES)*S.ES,3)} mm along it at ${f(S.aD,2)}°, the impulse face at ${f(S.aI,1)}°`);}

head('the bodies: WESC.SET against the solids (tools/wempe_inertia.json)');
{const J=JSON.parse(fs.readFileSync(path.join(__dirname,'wempe_inertia.json'),'utf8')),I=J.balance.I+J.rollers.I+J.collet.I+J.spring.I/3,JW=J.escape.I+(J.seconds.I+J.secondsHand.I)/64,ID=J.detent.I;
  const near=(a,b)=>Math.abs(a-b)<=Math.max(0.05,0.002*b);
  ok(near(S.I,I)&&near(S.JW,JW)&&near(S.ID,ID),`the balance ${f(I,1)} g·mm² (rim, arm and staff ${f(J.balance.I,1)}, of it the four masses ${f(J.balance.byHn['050301-4'].I,1)}; rollers ${f(J.rollers.I,2)}; collet ${f(J.collet.I,2)}; a third of the spring's ${f(J.spring.I,2)}): SET.I ${S.I}; the escape arbor ${f(J.escape.I,2)} and the seconds arbor and hand ${f(J.seconds.I+J.secondsHand.I,2)} ÷ 64: ${f(JW,2)}, SET.JW ${S.JW}; the detent about its flexure ${f(ID,2)}, SET.ID ${S.ID}`);
  say(`the balance weighs ${f(J.balance.m+J.rollers.m+J.collet.m,2)} g with its rollers and collet (the spring ${f(J.spring.m,2)} g); the 1963 book's J for marine chronometers, 0.2-0.3 gf·mm·s², is 1,961-2,942 g·mm² (6MX-figures.md)`);}

head('the hairspring and the period');
{const H=P.HS,L=WESC.HSL,need=H.kNeed;
  say(`the strip 0.285 × 0.52 (05 03_6) cut to 13 turns less 3.5 mm before its curves are bent (05 03_7): ${f(L.STRIP,1)} mm, ${f(L.turns,3)} turns of helix between the curves, ${f(L.L,1)} mm pin to pin (the pins ${f(Math.abs(L.pins),1)}° apart in plan, 05 03_1 drawing them together): k ${f(H.k*1e6,1)} µN·m a radian at 206 GPa (200-210: ${f(H.k*200/206*1e6,0)}-${f(H.k*210/206*1e6,0)})`);
  say(`the period with the weighed balance: ${f(H.T,4)} s, ${f(100*(H.T/0.5-1),1)} % from the train's 0.5 s (${f(86400*(0.5/H.T-1)/60,0)} min a day fast before timing); 0.5 s wants k ${f(need*1e6,1)} µN·m a radian, or I ${f(S.I*(0.5/H.T)**2,0)} g·mm²`);
  const dM=S.I*((0.5/H.T)**2-1),J=JSON.parse(fs.readFileSync(path.join(__dirname,'wempe_inertia.json'),'utf8')).balance.byHn['050301-4'].I;
  say(`to close it: the masses' moment ${f(J,0)} g·mm² ${f(100*dM/J,0)} % more (their height 5.4 and Ø 6.3 scaled on a poor copy of 05 03_2: estimated), or the strip ${f(100*(1-(need/H.k)**(1/3)),1)} % thinner; none moved here (tools/wempe_hairspring.js, README)`);
  say(`the other readings: 14 turns less 3.5 mm ${f(H.alt.n14.L,1)} mm, ${f(H.alt.n14.T,4)} s; 15 (the coil as wound, 05 03_6) ${f(H.alt.n15.L,1)} mm, ${f(H.alt.n15.T,4)} s; phase 2a's (13 turns less 3.5 mm of helix, curves added) ${f(H.alt.h13.L,1)} mm, ${f(H.alt.h13.T,4)} s, the pins ${f(Math.abs(L.h13.pins),0)}° apart`);}

head('the drive: 05 06_20 on the fusee arbor, through the train');
{const R=[17.25,14.75,13.32,12.17,11.24,10.55,10.04,9.71,9.47,9.30],rf=x=>{const i=Math.max(0,Math.min(8,Math.floor(x)));return R[i]+(R[i+1]-R[i])*(x-i);};   /* 05 06_20's radii at whole turns */
  ok(Math.abs(P.RATIO-3085.714)<0.01,`the train fusee wheel to escape pinion 90/14 · 90/12 · 80/10 · 80/10 = ${f(P.RATIO,1)}:1; its efficiency from its pivots and teeth ${f(P.ETA_LO,3)}-${f(P.ETA_HI,3)} (the model's ${f(P.ETA,3)}, their geometric mean); the stages ${P.STG.map(([m,zw,zp,rw,p])=>{const e=(mp,mt,c)=>(1-mp*(p[0]+p[1])/2*(2/(m*zp)+1/rw))*(1-mt*Math.PI*(1/zw+1/zp)*c);return f(e(0.15,0.2,1),3)+'-'+f(e(0.1,0.1,0.5),3);}).join(', ')}`);
  say(` hours  fusee turn   g on 262 mm   fusee arbor   escape wheel   drive   swing    rate        mainspring (its stress)`);
  for(const h of[0,6,12,18,24,30,36,42,48,52,54,56]){const n=h/P.HPT,x=P.MF-n,a=E.ampAt(P.drv(n)),pull=P.fusT(n)/((rf(x)+1.02)/1000),Mb=pull*(20.8+1.02)/1000;
    say(`${String(h).padStart(5)}   ${f(x,2).padStart(9)}   ${f(P.gAt(x),1).padStart(11)}   ${f(P.fusT(n)*1000,1).padStart(8)} mN·m  ${f(P.escT(n),1).padStart(7)} µN·m  ${f(P.drv(n),3)}   ${f(a/d,1).padStart(5)}°  ${sg(E.rateAt(a,P.drv(n)),2).padStart(6)} s/day   ${f(Mb*1000,0)} mN·m (${f(6*Mb/(15e-3*(0.37e-3)**2)/1e9,2)} GPa)`);}
  say(`the mainspring's torque (the pull on the chain, at the fusee's radius at that turn and its pitch line 1.02 out, times the barrel's 20.8 and 1.02) rises 1.9:1 over the wind, and its stress fully wound, about 2.2 GPa in the 15 × 0.37 strip, is a tempered steel mainspring's: the 262 mm lever was on the fusee arbor (on the barrel the pull could not be this even)`);}

head('the balance\'s damping and its free run-down');
{/* each loss an oscillation at swing A, the balance's energy k A²/2 (k for 0.5 s): air on the bluff parts, a pressure drag 1/2 rho Cd h r³ dr (r θ')² over each part's radial extent [count, height,
     r from, r to] (escapement.js's sizes); the endstone's constant friction (2/3) mu W r_pivot, mu the Hamilton's measured effective 0.008-0.012 (tools/physics.js: Jd2c3x8VKsE), W the
     balance's weight, r_pivot 0.105 (05 03_3.2's Ø 0.21); the spring's own Q 1,000-5,000 (published, spring alloys, as the Hamilton's) */
  const parts=[[4,5.38,12.55,18.85],[2,3.0,16.45,20.45],[2,1.5,20.45,21.05],[4,1.7,18.87,19.42],[4,1.7,11.98,12.53],[2,1.15,1.05,15.24],[2,3.8,15.24,16.15]];   /* masses, timing weights, their heads, the masses' screws' heads and nuts, the arm's two halves edgewise, the rim's cut ends */
  const k=E.kB,T=0.5,w0=2*Math.PI/T,cub=4/(3*Math.PI),rho=1.2,J=JSON.parse(fs.readFileSync(path.join(__dirname,'wempe_inertia.json'),'utf8')),m=(J.balance.m+J.rollers.m+J.collet.m+J.spring.m/2)/1000;
  const Q=(A,Cd,mu,qm)=>{const Eb=k*A*A/2;let air=0;for(const[n,h,r1,r2]of parts)air+=n*0.5*rho*Cd*h*1e-3*((r2/1000)**4-(r1/1000)**4)/4*(A*w0)**3*T*cub;const Mc=(2/3)*mu*m*9.80665*0.105e-3,end=4*Mc*A;
    const qa=2*Math.PI*Eb/air,qe=2*Math.PI*Eb/end;return{q:1/(1/qa+1/qe+1/qm),qa,qe};};
  const A0=E.A,lo=Q(A0,1.4,0.012,1000),hi=Q(A0,0.8,0.008,5000),TF=q=>q*T/Math.PI,mid=Math.sqrt(lo.q*hi.q);
  say(`at the model's swing ${f(A0/d,0)}°: air on its masses, weights and arm Q ${f(lo.qa,0)}-${f(hi.qa,0)} (Cd 1.4-0.8, Re about 300 on the masses), the endstone ${f(lo.qe,0)}-${f(hi.qe,0)}, the spring 1000-5000: together ${f(lo.q,0)}-${f(hi.q,0)}, a free run-down TF ${f(TF(lo.q),0)}-${f(TF(hi.q),0)} s`);
  ok(S.TF>=TF(lo.q)&&S.TF<=TF(hi.q)&&Math.abs(Math.log(S.TF/TF(mid)))<0.03,`the model's TF ${S.TF} s (Q ${f(Math.PI*S.TF/T,0)}): the middle of that range (${f(TF(mid),0)} s, the geometric mean of its ends), estimated from the parts as the Hamilton's (physics.js A6), no Wempe source giving it`);
  const At=tf=>makeEscOf({TF:tf}).A/d,tfFor=a=>{let l=40,h=400;for(let i=0;i<14;i++){const x=Math.sqrt(l*h);At(x)<a?l=x:h=x;}return Math.sqrt(l*h);};   /* to 0.1 s */
  say(`the swing it keeps at the reference (12 h): ${f(At(TF(lo.q)),0)}° at TF ${f(TF(lo.q),0)} s, ${f(At(S.TF),0)}° at ${S.TF} s, ${f(At(TF(hi.q)),0)}° at ${f(TF(hi.q),0)} s; the band's 225° wants TF ${f(tfFor(225),0)} s and 247.5° ${f(tfFor(247.5),0)} s (Q ${f(Math.PI*tfFor(225)/T,0)}, ${f(Math.PI*tfFor(247.5)/T,0)})`);
  ok(At(TF(hi.q))>=225,`the band the sources give (225-270°: the 1954 instruction for chronometers in general; Hamilton's manual 247.5-270°) is inside the damping's range: the balance as built can swing 225° on the drive as measured`);
  say(`a running 6MX's top plate is filmed in References/wempe/VIDEOS.md (moMvyx8eXfo 17:53-19:52, gAczA7-a7TY 4:47-5:52): tools/swing.py reads a swing off a video by the balance's screws through the plate's cutouts; the Wempe's masses and timing weights would serve, given their own geometry (not run)`);}
function makeEscOf(o){const s={...S,...o};return W.makeEsc(s,s);}

head('the escapement\'s figures (measure()) against sheet 05 04_1 and the layout');
{const r=E.measure(),K=WESC.ESC,f0=th=>th/d+K.PHI0;   /* f0: the impulse face's angle from the line of centres (the layout's PHI) at balance angle th */
  ok(r.runs,`it solves${r.runs?'':': '+r.why}: lock ${f(r.lock)}° (the gold spring met at ${f(r.contact)}°, the wheel released at ${f(r.rel)}°), let-off ${f(r.letoff)}° (the detent off the stone at ${f(r.off)}°), overall ${f(r.overall)}° (the return swing passes at ${f(r.poff)}°); roller shake ${f(r.shake,3)} mm; the teeth dip ${f(r.dip,2)} mm into the roller; the jewels ${f(r.jewels)}° apart; the lift at release ${f(r.lRel,3)} mm at the gold spring's tip (${f(r.lRel*S.BL/E.LEN,3)} at the stone)`);
  say(`the horn's clearance to the discharge stone (makeEsc's drawn horn, not the Wempe's: not compared) ${f(r.hornClr,2)} mm; makeEsc's drop (Op. 97, the Hamilton's: the impulse jewel ahead of the waiting tooth at release) has no meaning here: the Wempe's jewel comes into the teeth's path ${f(-r.drop)}° after the release and the wheel runs free to it`);
  const u=E.run;say(`05 04_1's 24°: the impulse face 24° before the line of centres at rest (aI ${f(S.aI)}°, by construction); 36.5°: the lock (${f(-E.lockA/d,2)}°, by construction); 21°: the impulse 21° either side of the line, the layout's tooth falling at ${f(K.PHI_C)}° and leaving at ${f(K.PHI_E)}° (kinematic); solved, it lands at ${f(f0(u.land),1)}° and leaves at ${f(f0(u.end),1)}° at ${f(E.A/d,0)}°`);
  say(`05 04_1's 2°, 1°, 1°-1/8° (on the roller), the pencilled 11½ beside the 21°, and the wheel's 86°, 22°10', 6°, 5° and 20° are not read; the tooth's 15° is its face's lean (U, from 05 04_23)`);
  say(`the layout's kinematic events against the solved (the face's angle from the line of centres; the balance's in brackets): the gold spring met ${f(K.PHI0-12)}° [-12°] / ${f(f0(r.contact*d))}° [${f(r.contact)}°]; released ${f(K.PHI_REL,1)}° / ${f(f0(r.rel*d),1)}°; off the gold spring ${f(K.PHI0)}° [0°] / ${f(f0(r.off*d),1)}°; the tooth on the stone ${f(K.PHI_C,1)}° / ${f(f0(u.land),1)}°, off it ${f(K.PHI_E,1)}° / ${f(f0(u.end),1)}°; the least swing ${f(K.AMIN/d,1)}° / ${f(E.AMIN/d,1)}°`);
  say(`the wheel: released from rest it chases the stone ${f((u.land-E.thRel)/d,1)}° of the balance and strikes it at ${f(u.vw,1)} rad/s (the stone ${f(u.vj,1)}; ${f(100*u.strike,1)} % of the impulse lost), drives it ${f(u.drive/d,1)}° of its 24°; the unlocking takes ${f(100*u.fu,1)} % of the impulse's work (the detent's spring and preload ${f(100*u.detent,1)} %)`);
  /* the detent's fall (makeEsc's state at the model's swing): flung off the stone's corner (depart), onto the land of the tooth it has just let go (the ride), down its back */
  const hm=E.homeAt(E.A),dp=E.depart(E.A),tab=th=>{const g=(th-E.TH0)/E.DT,i=Math.floor(g);return i<0||i>=E.LI.length-1?0:E.LI[i]+(E.LI[i+1]-E.LI[i])*(g-i);};
  let on=null,end=null;if(dp)for(let q=dp.p;q<0.5;q+=2e-6){const z=E.state(q,E.A,1),fl=Math.max(z.th<E.thOff?tab(z.th):0,E.fallD(dp.d0,dp.v0,(q-dp.p)*0.5)*E.LEN);if(on==null&&z.lift>fl+1e-9)on=z.th/d;if(z.lift>0&&z.prog>0)end=z.th/d;}
  say(`the detent leaves the discharge stone's acting corner at ${f(dp?dp.th/d:NaN,2)}°, flung up off it; the stone falls back onto the land of the tooth it has just let go at ${f(on,2)}° (the wheel, let go from rest, has it barely out from under) and rides it down its back onto the banking at ${f(end,2)}° (without the tooth it would be home at ${f(hm==null?NaN:hm/d,2)}°), long before the escaping tooth's lock (it runs on from ${f(E.thE/d,1)}°): tools/dynamics.js --model wempe checks it in time`);}

head('the swing and the rate across the wind');
{const rows=[['full wind',0],['24 h',24],['near run-down (54 h)',54]],A=[];
  for(const[t,h]of rows){const n=h/P.HPT,s=P.drv(n),a=E.ampAt(s);A.push(a/d);say(`${t.padEnd(22)} the drive ${f(s,3)} (${f(P.escT(n),1)} µN·m): the swing ${f(a/d,1)}°, the rate ${sg(E.rateAt(a,s))} s a day against 12 h (the escapement and the spring)`);}
  let mn=1e9,mx=-1e9,rn=1e9,rx=-1e9;for(let h=0;h<=56.3;h+=1){const n=h/P.HPT,s=P.drv(n),a=E.ampAt(s)/d,r=E.rateAt(a*d,s);mn=Math.min(mn,a);mx=Math.max(mx,a);rn=Math.min(rn,r);rx=Math.max(rx,r);}
  say(`over the whole wind (0-56 h): the swing ${f(mn,1)}-${f(mx,1)}°, the rate ${sg(rn)} to ${sg(rx)} s a day: the escapement's isochronism and the drawn hairspring's (SET.HS ${f(S.HS,3)} s a day for each 10°, tools/wempe_hairspring.js), which counter each other (the 6MX's TU allows the daily rate to vary 2.3 s between days)`);
  ok(mn>=200&&mx<=270,`the swing stays within 200-270° over the wind (the band 225-270° less the damping's estimate: below)`);
  const r0=E.rateAt(E.ampAt(P.drv(0)),P.drv(0)),r24=E.rateAt(E.ampAt(P.drv(24/P.HPT)),P.drv(24/P.HPT));say(`wound daily, as the 6MX's instruction asks (to the same mark at the same hour), the rate between full wind and 24 h changes ${sg(r24-r0)} s a day`);}

head('stopping, starting and the maintaining spring');
{let a=E.ampAt(P.drv(P.MF)),t=0;const a0=a;while(a>=E.AMIN&&t<600){a=P.ampStep(a,0.5,0);t+=0.5;}const tA=t;while(a>0&&t<1200){a=P.ampStep(a,0.5,0);t+=0.5;}
  say(`run down, the train held at a locked beat: the balance swinging ${f(a0/d,0)}° falls under the ${f(E.AMIN/d,1)}° it needs in ${f(tA,0)} s and comes to rest in ${f(t,0)} s; wound in that time the train goes on at once, else it needs a turn of the movement (the 1954 instruction, п. 7; the 6MX's: "a light jerk ... by turning the chronometer gently about the hands' axis")`);
  const s0=P.drv(2),sw=x=>E.ampAt(s0*(1-x/P.SUS))/d;say(`the maintaining spring carries the running torque, 0.27 mm at r 14.2 (05 06_9, likely): ${f(P.SUS,0)} s of drive falling to nothing; through a wind of about 6 s (the page's 1.5 turns a second for 8¾ turns) the drive falls ${f(100*6/P.SUS,0)} % and the swing settles toward ${f(sw(6),0)}° (from ${f(sw(0),0)}°), moving ${f(100*(1-Math.exp(-2*6/S.TF)),0)} % of the way in that time`);}

head('the locking stone never inside a tooth (as tools/escapement.js)');
{const cases=[...[0.15,0.3,0.5,0.75,0.9,1,1.1,1.25,1.5].map(s=>[E.ampAt(s),s]).filter(([a])=>a>=E.AMIN),[E.AMIN+0.2*d,0.15],[300*d,1],[340*d,1]];let w={d:0},wc=null;
  for(const[a,s]of cases){const q=stoneClash(E,a,s);if(q.d>=w.d){w=q;wc=[a,s];}}
  ok(w.d<1e-3,`through the period at ${cases.length} swings, ${f(E.AMIN/d)}° to 340°, 20,000 phases each: deepest ${f(w.d*1000,2)} µm`+(w.d>0?` at ${f(wc[0]/d)}°, drive ${f(100*wc[1],0)} %, the balance at ${f(w.th/d,2)}° (phase ${w.p.toFixed(5)}), tooth ${w.k}`:'')+' (want under 1 µm)');}
if(fail)process.exitCode=1;
