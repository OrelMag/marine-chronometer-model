// The Wempe's key forced: overwind.js's method for the Wempe (Node.js, no browser). What a hand can put on the winding key, and what it meets.
// Wound forward against the stop at full wind, the key's torque (less the chain's, which pulls the other way) goes from the paddle through the key's body, its coil spring
// gripping the tube, the tube's square socket and the fusee arbor's square into the fusee, its stop bar and the stop pin (wempe_strength.js sizes them for a strong hand: here
// the key torque at which each reaches the weak end of its yield). Turned the wrong way, the 1943 key (51 00 11, "Linksaufzug b. Rechtsdrehung entspannt sich die Feder": the
// coil spring a one-way clutch) passes only its spring's drag; the 1940 key (127-556.02 U 01, as first drawn) is a plain key, which puts the hand's torque on the chain's and
// sends it through the click wheel and its clicks, the maintaining ratchet, the maintaining spring (banked: solid), the fusee wheel and the train, held by the escapement.
// The 6MX's user instruction warns of the same for its hands: set backward, "can break the escape wheel's teeth" (6MX-figures.md: the motion work's, wempe_motionwork.js).
//   node wempe_overwind.js [--json OUT] [--fault]   (about 5 s; exits 1 if a strong hand's torque wound forward against the stop leaves a part under 1.5 times short of
//                                                   yielding (the key's coil spring by the wire it needs, which must fit the drawn coil), or turned the wrong way through the
//                                                   1943 key reaches the train past its drag; --fault: the stop bar left soft, mild steel, which must fail)
// The hand: finger-and-thumb torque on flat handles (Imrhan and Munoz-Vasa 2013, Industrial and Systems Engineering Review 1(2): men tightening flanged handles 9.5 and
// 19 mm wide; Swain et al. 1970 via the same paper: 95th-percentile men on a 12.7 mm knurled knob, 150 in-oz), as overwind.js; the Wempe's paddle, Ø 34.5 (51 00 11),
// is wider than the data, so the trend is carried on to it (an extrapolation: said so) and the larger taken.
const fs=require('fs'),path=require('path'),W=require('./wempe_load.js')(),{WPHYS:P}=W,E=P.ESC,PHY=require('./wempe_physics.js'),WT=require('./wempe_train.js');
const f=(x,n=0)=>(+x).toFixed(n),MPa=1e6,rows=[],out={hand:{},forward:[],backward:[],notes:[]};let fail=0;const say=s=>rows.push('  '+s),INOZ=0.00706155,D=180/Math.PI;
const FAULT=process.argv.includes('--fault'),BRASS_Y=[300,450],STEEL_Y=[1200,1800],STEEL_UTS=[1400,2000],STEEL_SH=STEEL_UTS.map(x=>0.6*x),BRASS_SH=BRASS_Y.map(x=>0.58*x),STEEL_Y_SOFT=[350,550];
/* one line: the stress sig at the load, the range [lo, hi] MPa; Ty the key torque at which it reaches the weak end */
const line=(list,name,load,sig,rg,what,Ty)=>{const mL=rg[0]*MPa/sig,mH=rg[1]*MPa/sig,v=mL>=1.5?'ok ':mH>=1||list===out.backward?'~~ ':'!! ';   /* the wrong way is the superseded 1940 key's: reported */
  rows.push(`  ${v} ${name.padEnd(60)} ${load.padEnd(14)} ${(f(sig/MPa)+' MPa').padStart(9)}   ${what} ${rg[0]}-${rg[1]}: margin ${f(mL,1)}-${f(mH,1)}${Ty!=null?`; yields at ${f(Ty,2)} N·m on the key`:''}`);
  list.push({name,load,sig:sig/MPa,lo:rg[0],hi:rg[1],what,Ty,v:v.trim()});return v;};

/* ---------- the hand ---------- */
const paddle=34.5,FL={w:[9.5,19.0],mean:[73.7,108.7],sd:[18.08,16.1]},at=w=>{const u=(w-FL.w[0])/(FL.w[1]-FL.w[0]);return{mean:(FL.mean[0]+u*(FL.mean[1]-FL.mean[0]))*INOZ,sd:Math.max(FL.sd[1],FL.sd[0]+u*(FL.sd[1]-FL.sd[0]))*INOZ};};
const h19=at(19),hP=at(paddle),p19=h19.mean+1.645*h19.sd,pP=hP.mean+1.645*hP.sd,swain=150*INOZ,TH=Math.max(pP,p19,swain),mean=hP.mean;
say(`The hand: the 1943 key's paddle Ø ${paddle} × 3 (51 00 11; the 1940 key's pear-shaped handle 34.8 wide), held between finger and thumb`);
say(`men tightening flanged handles 9.5-19 mm wide (Imrhan and Munoz-Vasa 2013): at 19 mm mean ${f(h19.mean,2)} N·m, 95th percentile ${f(p19,2)}; carried on to ${paddle} mm (beyond the data: an extrapolation) mean ${f(mean,2)}, 95th percentile ${f(pP,2)}; Swain et al. (1970) ${f(swain,2)}`);
say(`taken here: ${f(TH,2)} N·m, the largest (a strong hand, forcing it on the wide paddle); wempe_strength.js sizes the stop for Swain's ${f(swain,2)}`);
out.hand={paddle,mean,p19,pP,swain,TH};

/* ---------- the drive at full wind: the chain's torque on the fusee arbor (wempe_strength.js's: the spring at its measured level, the chain's lever 9.30 + 1.02, frictionless) ---------- */
const RB=41.6/2+1.02,rfE=9.30+1.02,pull=PHY.MupM/(RB/1000),T0=pull*rfE/1000,Tm=P.fusT(0);
say('');say(`Wound forward against the stop (full wind): the stop takes the key's torque less the chain's (${f(Tm,3)} N·m measured, 05 06_20 at 262 mm; ${f(T0,3)} frictionless: the smaller taken off). wempe_strength.js adds them (its stop lines are the larger)`);
/* the stop pin 05 08 01-5 (Ø 1.6, 1.6 proud of the plate's inner face) met by the bar's thin end 0.71 out, at 14.0 from the fusee's axis; the stop bar (2 × 1.45) 3.6 out of its slot:
   wempe_strength.js's two cantilevers. Neither has a sheet giving its steel: hardened, as the drawings' other stop parts are (estimated); --fault leaves the pin soft */
const SR=14.0,Fst=T=>Math.max(0,T-Tm)*1000/SR,LP=0.71,dP=1.6,PIN=STEEL_Y,BAR=FAULT?STEEL_Y_SOFT:STEEL_Y;
{const F=Fst(TH),s=32*F*LP/(Math.PI*dP**3)*MPa,Ty=Tm+PIN[0]*Math.PI*dP**3/(32*LP)*SR/1000;
  line(out.forward,`the stop pin (Ø ${dP}, met ${LP} out)`,`${f(F,0)} N`,s,PIN,'hardened steel (no sheet: estimated)',Ty);
  out.softPin=Tm+STEEL_Y_SOFT[0]*Math.PI*dP**3/(32*LP)*SR/1000;}
{const F=Fst(TH),a=3.6,w=2,t=1.45,s=6*F*a/(w*t*t)*MPa,Tq=y=>Tm+y*w*t*t/(6*a)*SR/1000;
  line(out.forward,`the stop bar (${w} × ${t}, ${a} out of its slot)`,`${f(F,0)} N`,s,BAR,FAULT?'mild steel (the planted fault)':'hardened steel (no sheet: estimated)',Tq(BAR[0]));
  out.softBar=Tq(STEEL_Y_SOFT[0]);say(`    left soft (mild steel, yield ${STEEL_Y_SOFT.join('-')}), the bar would bend at ${f(out.softBar,2)} N·m on the key and the pin at ${f(out.softPin,2)}: harden both`);}
/* the fusee arbor's square (05 06 04-1: 3.1 across, the tube's socket 3.1 +0.05) in torsion: τ = T / 0.208 a³ */
{const a=3.1,s=TH*1000/(0.208*a**3)*MPa;line(out.forward,`the fusee arbor's square (${a} across) in torsion`,`${f(TH,2)} N·m`,s,STEEL_SH.map(Math.round),'hardened steel in shear',STEEL_SH[0]*0.208*a**3/1000);}
/* the key's tube (05 01 02-3: brass, shank Ø 5.95, its socket 3.1 square): the thinnest wall at a corner, a thin-walled tube, τ = T / 2 A t */
{const ro=5.95/2,a=3.1,t=ro-a/Math.SQRT2,Am=((2*ro+a)/2)**2*0.85,s=TH*1000/(2*Am*t)*MPa;
  line(out.forward,`the key's tube round its socket (brass, ${f(t,2)} at a corner)`,`${f(TH,2)} N·m`,s,BRASS_SH.map(Math.round),'brass in shear',BRASS_SH[0]*2*Am*t/1000);}
/* the key's coil spring (51 00 11's section: about 12 coils of wire about 0.6, wound on the tube, its end in the body's Ø 0.9 hole): a wrap-spring clutch. Its grip is
   friction along the coils (e^(μ 2π n): at μ 0.15 over 12 coils some 10⁵ times what its end puts in, so it never slips forward), and its driven end carries the whole torque as
   the wire's tension at the coil's radius: F = T / (r_tube + d/2). Neither its wire's size (about 0.6, scaled) nor its steel is given (51 00 11's Werkstoff blank): a design
   value, judged by the wire it needs: patented cold-drawn spring wire (EN 10270-1 DH: Rm 2260-2500 at Ø 0.6, its elastic limit taken 0.75 Rm, 1700-1875) carrying half as
   much again as a strong hand, which must fit the drawn coil (its pitch 0.95, the body's hole Ø 0.9) */
const MW=[1700,1875];
{const d=0.6,rc=(5.95+d)/2,F=TH*1000/rc,s=F/(Math.PI*d*d/4)*MPa;
  line(out.forward,`the key's coil spring, its driven end in tension (wire Ø ${d}, scaled)`,`${f(F,0)} N`,s,MW,'spring wire, EN 10270-1 DH (no sheet: estimated)',MW[0]*Math.PI*d*d/4*rc/1000);
  out.forward[out.forward.length-1].design=true;
  let lo=0.3,hi=0.9;for(let i=0;i<40;i++){const m=(lo+hi)/2,Tm2=MW[0]*Math.PI*m*m/4*(5.95+m)/2/1000;Tm2<1.5*TH?lo=m:hi=m;}const dN=(lo+hi)/2;out.coil={d,dNeed:dN,fits:dN<=0.85};
  rows.push(`${dN<=0.85?'  ok ':'  !! '}   the wire it needs to carry ${f(1.5*TH,2)} N·m: Ø ${f(dN,2)}, ${dN<=0.85?"which fits the drawn coil (pitch 0.95) and the body's Ø 0.9 hole: the maker's sheet names it":"more than the drawn coil and the body's Ø 0.9 hole take"}`);if(dN>0.85)fail=1;
  say(`    the wire's end turned down into the body's hole: bent through a right angle there, it is the place the coil would give first; a maker forms it on a radius, not sharp`);}

/* ---------- the wrong way ---------- */
const drag=5e-3;   /* the 1943 key's coil spring slipping back: its drag, 5 mN·m (estimated: the Wempe README's transmission, the hand) */
say('');say(`Turned the wrong way: the 1943 key's coil spring unwraps and slips ("Linksaufzug b. Rechtsdrehung entspannt sich die Feder"), passing only its drag, about ${f(drag*1000)} mN·m (estimated), ${f(100*drag/Tm,1)} % of the chain's ${f(Tm,3)} N·m: nothing in the train notices`);
const okDrag=drag<0.05*Tm;
say(`The 1940 key (127-556.02 U 01, as first drawn) is plain: the hand's torque adds to the chain's, through the click wheel's two clicks, the maintaining ratchet, the maintaining spring (closed onto its bank: solid), the fusee wheel and the train to the escape wheel, held on the locking stone`);
const back=T=>T+T0;
/* the click wheel 05 06 04-3 (brass 2, 35 teeth, Ø 16.0/14.5) under one click (05 06 02-3, 1.30 met): a tooth in bending at the click's radius, wempe_strength.js's line; brass's yield */
{const Fc=T=>back(T)/7.6e-3,pc=Math.PI*14.5/35,sg=T=>6*Fc(T)*0.75e-3/(1.30e-3*(pc*1e-3)**2),Ty=BRASS_Y[0]*MPa*1.30e-3*(pc*1e-3)**2/(6*0.75e-3)*7.6e-3-T0;
  line(out.backward,'the click wheel\'s tooth under one click (brass, 1.30 met)',`${f(Fc(TH),0)} N`,sg(TH),BRASS_Y,'brass\'s yield',Ty);}
/* the train's meshes, Lewis σ = F / (b m Y), Y 0.2, the brass wheel driving its steel pinion (wempe_strength.js's) */
{let ratio=1;for(const[nm,zA,zB,m,,,,,,bw]of WT.STG){const r=m*zA/2/1000,b=Math.min(bw[0],bw[1])/1000,s=T=>back(T)*ratio/r/(b*m/1000*0.2),Ty=BRASS_Y[0]*MPa*(b*m/1000*0.2)*r/ratio-T0;
  line(out.backward,`${nm} (${zA}:${zB})`,`${f(back(TH)*ratio*1000,ratio<0.02?2:1)} mN·m`,s(TH),BRASS_Y,'brass\'s yield (Lewis, Y 0.2)',Ty);ratio*=zB/zA;}}
/* the escapement: driven k times as hard, the balance swings past makeEsc's TRIP and the wheel unlocks twice in a swing */
{const k=back(TH)/T0,A=E.ampAt(k)*D,trip=E.TRIP*D;let lo=1,hi=40;for(let i=0;i<50;i++){const md=(lo+hi)/2;E.ampAt(md)*D<trip?lo=md:hi=md;}const kT=(lo+hi)/2;
  say(`the escapement: driven ${f(k,1)} times as hard the balance would swing ${f(Math.min(A,999))}°; past ${f(trip)}° (${f(kT,2)} times the drive, ${f(kT*T0-T0,2)} N·m on the key) the wheel unlocks twice in a swing and gains, while the key is held so`);
  out.notes.push({esc:{k,A,trip,kT,Tk:kT*T0-T0}});}
const nm=x=>x.name.split(' (')[0].replace(/^the /,''),weak=L=>L.filter(x=>x.Ty!=null&&!x.design).sort((a,b)=>a.Ty-b.Ty)[0],wf=weak(out.forward),wb=weak(out.backward);
say('');say(`forward, the first to yield (the coil's wire, a design value, apart): the ${nm(wf)}, at ${f(wf.Ty,2)} N·m on the key (${f(wf.Ty/TH,1)} times a strong hand's ${f(TH,2)})`);
say(`the wrong way with the 1940 key, the first to yield: the ${nm(wb)}, at ${f(wb.Ty,2)} N·m on the key (${f(wb.Ty/mean,1)} times an average hand's ${f(mean,2)})`);
out.weakF={name:wf.name,Ty:wf.Ty};out.weakB={name:wb.name,Ty:wb.Ty};
const okF=wf.Ty>1.5*TH;rows.push(`${okF?'  ok ':'  !! '} wound forward against the stop, a strong hand (${f(TH,2)} N·m) leaves every part ${f(wf.Ty/TH,1)} times short of yielding${okF?'':`: the ${nm(wf)} is the weak point`}`);if(!okF)fail=1;
rows.push(`${okDrag?'  ok ':'  !! '} the wrong way, the 1943 key passes ${f(drag*1000)} mN·m: its one-way spring keeps the train from the hand${okDrag?'':' (it drags too hard)'}`);if(!okDrag)fail=1;
rows.push(`  ${wb.Ty>TH?'ok ':'~~ '} the wrong way with the plain 1940 key: ${wb.Ty>TH?'nothing yields under a strong hand':`${f(wb.Ty,2)} N·m bends the ${nm(wb)}, an average hand's twist and less: the 1943 key's one-way spring makes it impossible`}`);
out.okF=okF;out.okDrag=okDrag;out.TH=TH;out.Tm=Tm;out.T0=T0;out.rows=rows;module.exports=out;
if(require.main===module){console.log(rows.join('\n'));const jo=process.argv.indexOf('--json');if(jo>0)fs.writeFileSync(process.argv[jo+1],JSON.stringify(out));process.exitCode=fail;}
