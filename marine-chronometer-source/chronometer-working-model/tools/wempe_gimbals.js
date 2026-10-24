// The Wempe's box and gimbals in a seaway (gimbals.js --model wempe runs this with gimbals.js's bodies, ship and run): the bowl with the movement in it and the gimbal ring
// weighed on the model (massprops.py --model wempe: tools/gimbals_wempe.json), levelled as 05 01 says ("Kloben verstellen bis Gleichgewicht erreicht ist": the brackets moved
// until it hangs level), run as two rigid bodies on their pivots ("Lagerstellen a u. b leicht spielend") under the Hamilton's seaway (gimbals.js: its seas, periods and the
// NORDFORSK limit), in the Hamilton's installation (the case's pivots fore and aft, so the case takes the roll) and turned a quarter (the ring takes the roll). Then what
// reaches the escapement, through the Wempe's makeEsc (js/escphys.js, tools/wempe_load.js): the Wempe has no escapement in time yet (claude/wempe-dynamics, phase 2d part 1,
// isn't merged), so its rate response alone: (1) the specific force across the staff loads the balance's pivots sideways, a friction torque mu m g f r on the pivot's journal
// (as the endstone's, wempe_escapement.js), whose extra damping lowers the swing (makeEsc solved at the lower TF) and moves the rate (ESC.rateAt); (2) the case turned about
// the staff (its angular acceleration a) sets the balance's centre of swing off its spring's rest by -a/w^2, slowly against its 0.5 s beat: a beat error, worked by makeEsc
// with the rollers turned on the staff by it (aI, aD), averaged over the sea. Exits 1 on gimbals.js's criteria: an own period among a ship's roll or the beat (0.575-1.5 s),
// the NORDFORSK sea not NORDFORSK's, a working sea taking the case 2 degrees from the apparent vertical or onto a stop, the rate moved 0.05 s a day, or what reaches the
// escapement within half of what trips it (here the detent's preload against its own weight, a static estimate: no tripping.js for the Wempe yet). About 2 minutes.
const fs=require('fs'),path=require('path');
module.exports=G=>{
const{bodies,run,ship,GJ,PB}=G,D=Math.PI/180,G0=9.80665,TAU=2*Math.PI,W=require('./wempe_load.js')(),P=W.WPHYS,E=P.ESC,S=P.SET;
const IJ=JSON.parse(fs.readFileSync(path.join(__dirname,'wempe_inertia.json'),'utf8'));
const ji=process.argv.indexOf('--json'),JOUT=ji>0?process.argv[ji+1]:null,RW=[],J={made:new Date().toISOString().slice(0,10)};let fail=0;
const say=s=>RW.push('  '+s),chk=(ok,s)=>{if(!ok)fail=1;RW.push(`${ok?'  ok ':'  !! '} ${s}`);},head=s=>RW.push('\n'+s);
const f=(x,n=2)=>Number.isFinite(+x)?(+x).toFixed(n):'-',sg=(x,n=2)=>(x>=0?'+':'−')+Math.abs(x).toFixed(n),t0=Date.now(),flush=()=>{console.log(RW.splice(0).join('\n'));console.log(`  (${f((Date.now()-t0)/1000,0)} s)`);};
const Bd=bodies(),Bdr=bodies({asDrawn:true}),Tz=TAU/Bd.wz,Tx=TAU/Bd.wx,bw=GJ.bowl,rg=GJ.ring,bp=bw.byPart;
const CASE=['bowl','bezel','closingPlate'],mvM=bw.m-CASE.reduce((a,k)=>a+(bp[k]||0),0);   /* the movement: the bowl's body less the case's own parts (byPart keeps the 25 heaviest: the case's three are among them) */
const PAD=(GJ.reach.bowlInRing||[]).map(x=>x??null),FREE=60;   /* the bowl turned in the ring meets it (massprops' extra: the locking bracket's pad), each way; the box stops neither gimbal within 60 deg (GJ.stops) */

head('1. The swinging bodies, weighed on the model (massprops.py --model wempe: every solid at its material\'s density)');
say(`the bowl with the movement in it ${f(bw.m,1)} g: the bowl (R-05 01 00-1, brass as the sheet's "Ms-Sandguß") ${f(bp.bowl,1)}, the bezel and glass ${f(bp.bezel,1)}, the closing plate ${f(bp.closingPlate,1)}, the movement with its ring and dial ${f(mvM,1)} (its pillar plate ${f(bp.pillarPlate,1)}, top plate ${f(bp.topPlate,1)}, dial ${f(bp.dial,1)}, mainspring ${f(bp.mainspring,1)}); the gimbal ring with its bracket, pivot screws and nuts ${f(rg.m,1)} g`);
{const V=bp.bowl/8.45,r350=350/V;
  say(`the sheet's "Gewicht 350 gr." against the drawn casting: the bowl's solid is ${f(V,1)} cm³, ${f(bp.bowl,0)} g in brass (8.45); 350 g is ${f(r350,2)} g/cm³, a casting of no brass: aluminium (2.7) would weigh ${f(V*2.7,0)} g, Bakelite (1.37) ${f(V*1.37,0)}, hard Buna rubber (1.18) ${f(V*1.18,0)} (the wartime Glashütte bowls were Bakelite, the 1942 arrangement names a Buna case: README). The chronometer in its gimbals weighs ${f((bw.m+rg.m)/1000,2)} kg as drawn (the 6MX's TU allows it 2.2 kg, of another maker: 6MX-figures.md)`);
  J.mass={bowl:bw.m,ring:rg.m,parts:{bowl:bp.bowl,bezel:bp.bezel,closingPlate:bp.closingPlate,movement:mvM},V,r350};}
const dr=Bdr.drawn,zc=(bw.m*dr.bowl[2]+rg.m*dr.ring[2])/(bw.m+rg.m),yc=(bw.m*dr.bowl[1]+rg.m*dr.ring[1])/(bw.m+rg.m);
say(`as drawn the case's centre of gravity lies ${f(-dr.bowl[1],2)} mm under the gimbal centre and ${f(dr.bowl[0],2)} mm across its pivots' line (12-6): hung so it leans ${f(Math.atan2(dr.bowl[0],-dr.bowl[1])/D,1)}°; the ring and case together ${f(-zc,2)} mm along the ring's (3-9), leaning ${f(Math.atan2(-zc,-yc)/D,1)}°. 05 01: "Kloben verstellen bis Gleichgewicht erreicht ist", the brackets moved in their slots until it hangs level: ${f(Math.abs(dr.bowl[0]),2)} and ${f(Math.abs(zc),2)} mm, and so does this (the Hamilton's drawn pivots are 7.8 mm off theirs)`);
J.drawn={bowl:dr.bowl,ring:dr.ring,zc,lean:[Math.atan2(dr.bowl[0],-dr.bowl[1])/D,Math.atan2(-zc,-yc)/D]};
say(`levelled, the case swings on its pivots (12-6) with a period of ${f(Tz,3)} s and the ring, carrying it, on its own (3-9) ${f(Tx,3)} s; the case's radius of gyration about its pivots ${f(Math.sqrt(Bd.Iz/Bd.bw.m)*1000,0)} mm, its centre of gravity ${f(-Bd.bw.c[1]*1000,2)} mm under them (05 01's pivots 5.3 under the movement ring's seat in the bowl's rim, the bowl brass)`);
/* the bowl in other materials (massprops' alt: the bowl part's density alone changed), and the 350 g bowl by the bodies' linearity in that density */
{const per=b=>{const h=-b.cg[1]/1000,Iz=b.I[2][2]*1e-9-b.m/1000*(b.cg[0]/1000)**2;return h>0?TAU*Math.sqrt(Iz/(b.m/1000*G0*h)):null;},alt=Object.entries(GJ.alt),lin=(r)=>{const[k,a]=alt[0],u=(8.45-r)/(8.45-a.rho);
    const m=bw.m+(a.m-bw.m)*u,s=bw.cg.map((c,i)=>(bw.m*c+(a.m*a.cg[i]-bw.m*c)*u)/m),I=bw.I.map((row,i)=>row.map((x,j)=>x+(a.I[i][j]-x)*u));return{m,cg:s,I,rho:r};};
  const rows=[...alt.map(([k,a])=>[k,a]),['the sheet\'s 350 g',lin(350/(bp.bowl/8.45))]];
  for(const[k,a]of rows){const T=per(a);say(`  a bowl of ${k} (${f(a.rho,2)} g/cm³): the case ${f(a.m,0)} g, its centre of gravity ${a.cg[1]<0?f(-a.cg[1],2)+' mm under':f(a.cg[1],2)+' mm over'} the pivots: ${T?`a period of ${f(T,2)} s`:'it would not hang: the movement and the brass bezel over the pivots turn it over'}`);}
  const need=rows.find(r=>r[0]==='bakelite')[1].cg[1];
  say(need>-3?`so a light bowl doesn't fit 05 01's pivots: with Bakelite the pivots would have to sit ${f(need+3,1)} mm higher for a centre of gravity 3 mm under them, or the bowl be weighted; the brass casting the sheet names is what hangs the drawn case (a Bakelite bowl's own drawings aren't in the set)`
    :`so on 05 01's pivots a light bowl hangs too (with Bakelite its centre of gravity ${f(-need,2)} mm under them): the pivots don't decide the bowl's material; the sheet's "Ms-Sandguß" names brass, its 350 g a lighter bowl (a Bakelite bowl's own drawings aren't in the set)`);
  J.alt=rows.map(([k,a])=>({k,rho:a.rho,m:a.m,cg:a.cg,T:per(a)}));}
say(`the stops: the box stops neither gimbal within ${FREE}° either way (GJ.stops: ${JSON.stringify(GJ.stops.bowl.map(q=>q.deg))}, the ring ${JSON.stringify(GJ.stops.ring.map(q=>q.deg))}; the ring and case reach ${f(GJ.reach.aboutX,1)} mm from the ring's axis in a box 160 inside). In the ring the bowl's locking bracket (05 01 00-4, at 50° from 6 toward 3, measured on 05 01: its pad at the pivots' height, 2.5 short of the ring) ${PAD.some(x=>x!=null)?`meets the ring when the case turns ${PAD.map((x,i)=>x!=null?f(x,1)+'° '+(i?'the other way':'one way'):'').filter(Boolean).join(' and ')}`:`never meets it: the bowl's farthest point is ${f(GJ.reach.bowl,2)} mm from the gimbal centre, inside the ring's ${f(GJ.reach.ringIn,1)}, so the case turns in its ring to any angle`}`);
J.bodies={Tz,Tx,Iz:Bd.Iz,Ix:Bd.Ix,cg:Bd.bw.c,stops:GJ.stops,reach:GJ.reach,pad:PAD};
chk(Tz<0.5*3&&Tx<0.5*3&&Tz>0.5*1.15&&Tx>0.5*1.15,`its own periods (${f(Tz,2)}, ${f(Tx,2)} s) lie far below a ship's roll (10-30 s for merchant ships: MARIN, Jachowski; a small craft's 3-6 s, estimated) and clear of the balance's beat (0.5 s) by ${f(100*(Math.min(Tz,Tx)/0.5-1),0)} % (gimbals.js's criterion: 0.575-1.5 s)`);
flush();

head('2. Resonance: the case driven by a regular roll of 2° about the box itself, at periods from a quarter of a second to twenty');
const PER=[0.25,0.3,0.4,0.5,0.6,0.7,0.8,0.85,0.9,0.95,1,1.05,1.1,1.2,1.5,2,3,4,6,8,12,16,20],RES=[];
for(const T of PER){const r=run(Bd,ship({reg:[T,2],rd:0}),{T:Math.max(30,T*12),from:Math.max(20,T*6),stop:FREE});RES.push([T,r.appMax/2,r.tiltMax/2]);}
const pk=RES.reduce((a,b)=>b[1]>a[1]?b:a),at=T=>RES.find(r=>Math.abs(r[0]-T)<1e-9);
say(`the case's lean from the apparent vertical, per degree of roll: ${f(at(20)[1],3)} at 20 s, ${f(at(8)[1],3)} at 8 s, ${f(at(4)[1],2)} at 4 s; ${f(pk[1],1)} at its own period (${pk[0]} s); ${f(at(0.5)[1],2)} at the balance's 0.5 s`);
J.res=RES;
{const mb=(IJ.balance.m+IJ.rollers.m+IJ.collet.m)/1000,e=2e-6,A=E.A,w=TAU*2,h=-PB[1],F2=mb*e*A*w*w,F4=mb*e*(A*w)**2/2,resp=(F,wf)=>F*h/Math.hypot(Bd.kz-Bd.Iz*wf*wf,2*0.05*Math.sqrt(Bd.kz*Bd.Iz)*wf);
  say(`the balance's beat (${f(mb*1000,1)} g with its rollers and collet, out of poise by 2 µm, estimated; ${f(h*1000,1)} mm ${h>0?'below':'above'} the pivots, swinging ${f(A/D,0)}°) pushes the case at 2 Hz with ${f(F2*1e6,1)} µN and at 4 Hz with ${f(F4*1e6,1)} µN: it swings ${(resp(F2,w)/D*3600).toFixed(2)}" and ${(resp(F4,2*w)/D*3600).toFixed(2)}" (seconds of arc)`);
  J.beat={mb,e,F2,F4,t2:resp(F2,w),t4:resp(F4,2*w)};}
flush();
if(process.argv.includes('--quick')){if(JOUT)fs.writeFileSync(JOUT,JSON.stringify(J));if(fail)process.exitCode=1;return;}

head('3. At sea: the ship\'s motion narrow-band random, 10 minutes each (gimbals.js\'s seas: rms; the box\'s place from the ship\'s centre of motion; estimated but for the periods and NORDFORSK\'s 0.12 g)');
/* the escapement's rate response (makeEsc, the Wempe's settings): (1) the pivots' side friction; (2) a beat error from the case's turn about the staff */
const mB=(IJ.balance.m+IJ.rollers.m+IJ.collet.m+IJ.spring.m/2)/1000,rP=0.105e-3,MUj=0.15,A0=E.A,Eb=E.kB*A0*A0/2,T0=0.5,Q0=Math.PI*S.TF/T0,w0=TAU/T0;   /* the pivot Ø 0.21 (05 03_3.2); mu 0.10-0.15 oiled steel in a jewel, the upper end */
const fRef=0.05,Qx=TAU*Eb/(4*MUj*mB*G0*fRef*rP*A0),TF2=(1/(1/Q0+1/Qx))*T0/Math.PI,E2=W.makeEsc({...S,TF:TF2},S),dRf=(E.rateAt(E2.A,1)-E.rateAt(E.ampAt(1),1))/fRef;   /* s a day for each g across the staff (mean |f|) */
const bE=[0.5,-0.5].map(d=>{const q=W.makeEsc({...S,aI:S.aI+d,aD:S.aD+d},S);return q.rateAt(q.ampAt(1),1);}),r1=(bE[0]-bE[1])/1,r2=(bE[0]+bE[1])/2/0.25;   /* s a day for each degree, and each degree² */
say(`the escapement's response (makeEsc, the Wempe's settings): 0.05 g across the staff, steadily, loads the pivots (Ø 0.21, mu ${MUj}) and costs the swing ${f((A0-E2.A)/D,2)}°: ${sg(dRf*fRef,3)} s a day; the balance's centre of swing ${0.5}° off its spring's rest (a beat error) ${sg(bE[0],3)} / ${sg(bE[1],3)} s a day for ±0.5°: ${sg(r1,3)} s a day a degree, ${sg(r2,4)} a degree²`);
const SEAS=[['a cargo ship, moderate sea',{Tr:14,roll:3,Tp:8,pitch:1,Ty:14,yaw:1,Th:8,heave:0.05,rd:8,lz:20},'within'],
  ['a cargo ship at the NORDFORSK limit',{Tr:14,roll:6,Tp:8,pitch:2.25,Ty:14,yaw:2,Th:8,heave:0.11,rd:8,lz:20},'within'],
  ['a cargo ship beyond it',{Tr:14,roll:8,Tp:8,pitch:3,Ty:14,yaw:2,Th:8,heave:0.15,rd:8,lz:20},'beyond'],
  ['a small vessel, rough',{Tr:5,roll:8,Tp:3.5,pitch:4,Ty:5,yaw:3,Th:3.5,heave:0.2,rd:2,lz:3},'beyond'],
  ['a storm: rolls to 35-45°',{Tr:14,roll:15,Tp:8,pitch:4,Ty:14,yaw:3,Th:8,heave:0.2,rd:8,lz:20},'beyond']];
/* the box turned a quarter: the roll on the ring's pivots, the pitch on the case's (small angles: the motions' axes swapped; the box on the ship's centreline) */
const turned=S0=>({...S0,ang:t=>{const[y,p,r]=S0.ang(t);return[y,r,p];},lz:0});
/* the detent's trip, static: its preload (W78 at the stone, BL from its flexure: estimated, the Hamilton's after Op. 78) against its own weight's moment about the flexure
   under a specific force across it; the draw (the tooth pressing the stone into the lock) only adds to it */
const dcg=Math.hypot(IJ.detent.cg[0],IJ.detent.cg[2]),kn=S.W78*S.BL*S.ES/(IJ.detent.m*dcg);
const ST=[];
for(const[inst,tf]of[['the case\'s pivots fore and aft (the Hamilton\'s: the case takes the roll)',x=>x],['the box turned a quarter (the ring takes the roll)',turned]]){
  say(`${inst}:`);
  for(const[nm,sc_,kind]of SEAS){const r=run(Bd,tf(ship(sc_,7)),{T:620,from:20,rec:0.002,stop:FREE}),R=r.rec;
    /* the pad: the case's turn in the ring (rec[6], deg) past the locking bracket's, each way; its excursions (a quarter second apart) */
    let n=0,was=false,off=-1e9,bMax=[0,0];for(const q of R){bMax[0]=Math.max(bMax[0],q[6]);bMax[1]=Math.max(bMax[1],-q[6]);const on=(PAD[0]!=null&&q[6]>PAD[0])||(PAD[1]!=null&&-q[6]>PAD[1]);if(on&&!was&&q[0]-off>0.25)n++;if(!on&&was)off=q[0];was=on;}
    let fa=0,d1=0,d2=0;const wB=w0*w0;for(const q of R){fa+=Math.hypot(q[3],q[4])/G0;const dl=-q[5]/wB/D;d1+=dl;d2+=dl*dl;}fa/=R.length;d1/=R.length;d2/=R.length;
    const rate=dRf*fa+r1*d1+r2*d2;
    const row={inst:inst.startsWith('the case')?'fore-aft':'turned',name:nm,kind,sc:sc_,pad:n,bMax,fMean:fa,dRms:Math.sqrt(d2),rate,rateF:dRf*fa,rateB:r1*d1+r2*d2,...Object.fromEntries(Object.entries(r).filter(([k])=>k!=='rec'))};ST.push(row);
    say(`  ${nm.padEnd(36)} the box ${f(r.boxLat,3)} g rms athwartships (${f(r.boxLatMax,2)} at most); the case leans ${f(r.tilt,1)}° rms (${f(r.tiltMax,1)}° at most) from the true vertical, ${f(r.app,2)}° (${f(r.appMax,2)}°) from the apparent; it turns in the ring to ${f(bMax[0],1)}° / ${f(bMax[1],1)}°${n?`: onto the locking bracket's pad ${n} times`:''}`);
    say(`  ${''.padEnd(36)} the escapement feels ${f(r.fplMax*1000,1)} mg across the staff at most (${f(fa*1000,1)} mean) and ${f(r.alMax,3)} rad/s² about it (the centre of swing ${f(Math.sqrt(d2)*3600,1)}" rms off): the rate ${sg(rate,4)} s a day (the pivots ${sg(dRf*fa,4)}, the beat error ${sg(r1*d1+r2*d2,4)})`);}}
J.seas=ST;const IN=ST.filter(s=>s.kind==='within'),lim=ST.find(s=>s.inst==='fore-aft'&&s.name.includes('NORDFORSK'));
chk(lim.boxLat<0.125&&lim.boxLat>0.1,`the limiting sea is NORDFORSK's (1987): the box's athwartships acceleration ${f(lim.boxLat,3)} g rms against its 0.12 g at the bridge`);
chk(IN.every(s=>s.appMax<2),`in the seas a ship works in the case keeps within ${f(Math.max(...IN.map(s=>s.appMax)),2)}° of the apparent vertical (${f(Math.max(...IN.map(s=>s.tiltMax)),1)}° of the true): the balance's pivots see the load along the staff`);
{const P=IN.filter(s=>s.pad);chk(!P.length,P.length?`in the seas a ship works in the case swings onto the locking bracket's drawn pad: ${P.map(s=>`${s.name}, ${s.inst==='fore-aft'?'fore and aft':'turned'}, ${s.pad} times (to ${f(Math.max(...s.bMax),1)}°)`).join('; ')}. The pad's form and its 1 mm from the ring are scaled on 05 01 (estimated): a pad hanging under the pivots' line, as drawn, stops the case at ${f(PAD.find(x=>x!=null),1)}°; the real one must clear the case's swing (its face turned about the pivots' axis, or at their height)`:`in the seas a ship works the case meets neither the ring (the locking bracket's pad${PAD.some(x=>x!=null)?' at '+PAD.filter(x=>x!=null).map(x=>f(x,1)+'°').join(', '):' clears it at any turn'}) nor the box`);}
chk(ST.every(s=>s.fplMax<kn/2),`what reaches the escapement is far from what trips it: at most ${f(Math.max(...ST.map(s=>s.fplMax))*1000,0)} mg across the staff against ${f(kn,1)} g, the detent's preload (${S.W78} g at the stone ${f(S.BL*S.ES,2)} mm out: the Hamilton's, estimated) over its own weight (${f(IJ.detent.m*1000,1)} mg, ${f(dcg,2)} mm from its flexure): static, the draw left out`);
chk(IN.every(s=>Math.abs(s.rate)<0.05),`in them the rate moves under 0.05 s a day (at most ${f(Math.max(...IN.map(s=>Math.abs(s.rate))),4)}): the gimbals do their work`);
flush();

head('4. The stops: the case swung onto the locking bracket\'s pad, if it reaches it (the box stops nothing within 60°)');
{const pd=PAD.find(x=>x!=null),Rb=Math.hypot(...PB);
  if(pd==null)say('the case meets nothing within 60° either way: no blows to pass on');
  else{const big=[10,15,20,30,45].map(a=>{const r=run(Bd,ship({reg:[14,a],rd:8}),{T:14*6+20,from:14*3,stop:pd});return[a,r.hits,r.hitW,r.hitAcc*Rb/G0];});   /* a regular roll on the case's pivots; the pad taken both ways (one way as drawn: the blows' size, not their count) */
    for(const[a,n,w,g]of big)say(`  a regular roll of ${a}° (14 s, 8 m above the centre): ${n?`onto the pad at up to ${f(w,2)} rad/s; the balance, ${f(Rb*1000,0)} mm from the gimbal centre, sees ${f(g,1)} g for a few ms`:"clear of the pad"}`);
    J.stops={pad:pd,big};chk(big.every(b=>b[3]<kn/2),`a case swung onto the pad passes on at most ${f(Math.max(...big.map(b=>b[3])),1)} g to the balance (the box's wood's stiffness and restitution, gimbals.js's, on brass: estimated), against the ${f(kn,1)} g that would lift the detent`);}}
flush();
J.time=(Date.now()-t0)/1000;if(JOUT)fs.writeFileSync(JOUT,JSON.stringify(J));
if(fail)process.exitCode=1;};
