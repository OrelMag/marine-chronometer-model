// The key forced: what a hand can put on the winding key, and what it meets. Wound against the winding stop at full wind, the key's torque (less the chain's,
// which pulls the other way) goes into the stop-bar and the stud it meets; the chain carries no more than the mainspring's pull (the stop holds the fusee).
// Turned the wrong way (clockwise, the running way: the manual winds counterclockwise only, Sec. IV), the key's torque adds to the chain's and goes through the
// winding pawls, the sustaining spring (closed solid) and the fusee wheel into the going train, which the escapement holds still. Each part's stress against its
// material's range, as strength.js does it, and the key torque at which it reaches the weak end of its yield. Needs only Node.js:
//   node overwind.js               (under a second; exits 1 if a hand's torque wound forward breaks anything, or the wrong way exceeds the strong end of a part)
//   node overwind.js --json OUT    the figures for the build-verification report
// The hand: finger-and-thumb torque on small handles (Imrhan and Munoz-Vasa 2013, Industrial and Systems Engineering Review 1(2), 23 workers, tightening, flanged
// handles 9.5 and 19 mm wide, interpolated to the key's paddle; Swain et al. 1970 via the same paper, 95th-percentile men on a 12.7 mm knurled knob, 150 in-oz).
const fs=require('fs'),path=require('path'),PH=require('./physics.js'),{build}=require('./escapement.js'),MJ=require('./mechanisms.json');
const ESC=build().ESC,mv=fs.readFileSync(path.join(__dirname,'..','js','movement.js'),'utf8'),core=fs.readFileSync(path.join(__dirname,'..','js','core.js'),'utf8');
const num=(src,re,what)=>{const m=re.exec(src);if(!m)throw Error('not found: '+what);return m.slice(1).map(Number);};
const f=(x,n=0)=>(+x).toFixed(n),MPa=1e6,rows=[],out={hand:{},forward:[],backward:[],notes:[]};let fail=0;
const say=s=>rows.push('  '+s),INOZ=0.00706155;
const BRASS_Y=[300,450],STEEL_Y=[1200,1800],STEEL_UTS=[1400,2000],STEEL_SH=STEEL_UTS.map(x=>0.6*x),BRASS_SH=BRASS_Y.map(x=>0.58*x),STEEL_Y_SOFT=[350,550];
/* one line: the stress sig at the load T (N·m on the key), the range [lo, hi] MPa; Ty the key torque at which it reaches the weak end (the stress grows as the key's
   torque less what the chain takes off it, T - T0, or as the chain's and the key's together, T + T0) */
const line=(list,name,load,sig,rg,what,Ty)=>{const mL=rg[0]*MPa/sig,mH=rg[1]*MPa/sig,v=mL>=1.5?'ok ':mH>=1?'~~ ':'!! ';
  rows.push(`  ${v} ${name.padEnd(52)} ${load.padEnd(16)} ${(f(sig/MPa)+' MPa').padStart(9)}   ${what} ${rg[0]}-${rg[1]}: margin ${f(mL,1)}-${f(mH,1)}${Ty!=null?`; yields at ${f(Ty,2)} N·m on the key`:''}`);
  list.push({name,load,sig:sig/MPa,lo:rg[0],hi:rg[1],what,Ty,v:v.trim()});return v;};

/* ---------- the hand ---------- */
const kw=num(core,/function windingKey\(g,M\)\{const kw=([\d.]+)/,'the key\'s size')[0],paddle=3.1*kw;   /* core.js windingKey: the paddle 3.1 kw wide */
const FL={w:[9.5,19.0],mean:[73.7,108.7],sd:[18.08,16.1]},u=(paddle-FL.w[0])/(FL.w[1]-FL.w[0]),mean=(FL.mean[0]+u*(FL.mean[1]-FL.mean[0]))*INOZ,sd=(FL.sd[0]+u*(FL.sd[1]-FL.sd[0]))*INOZ,
  p95=mean+1.645*sd,swain=150*INOZ,TH=Math.max(p95,swain);
say(`The hand: the key's paddle ${f(paddle,1)} mm wide (core.js), held between finger and thumb`);
say(`men tightening flanged handles 9.5-19 mm wide (Imrhan and Munoz-Vasa 2013), at ${f(paddle,1)} mm: mean ${f(mean,2)} N·m, s.d. ${f(sd,2)}, 95th percentile ${f(p95,2)}; Swain et al. (1970): 95th-percentile men on a 12.7 mm knurled knob ${f(swain,2)}`);
say(`taken here: ${f(TH,2)} N·m, the larger (a strong hand, forcing it); half as much again (${f(1.5*TH,2)}) for a hand in a glove or a key with a longer bow`);
out.hand={paddle,mean,sd,p95,swain,TH};

/* ---------- forward, against the stop ---------- */
const T0=PH.Tf,Fpull=PH.Mup*1000/PH.rB;   /* the fusee's even torque, which the chain puts on its arbor at every turn (physics.js) */
const [SBZ,SBW,SBX]=num(mv,/const SBZ=([\d.]+),SBW=([\d.]+),SBX=([\d.]+)/,'the stop-bar'),[TS,TC]=num(mv,/,TS=([\d.]+),TC=([\d.]+)/,'the stop-bar\'s thickness'),[TSTOP]=num(mv,/TSTOP=([\d.]+);/,'its travel');
const [WL,WG]=num(mv,/WL=([\d.]+),WG=([\d.]+)/,'the stud\'s length'),[yS]=num(mv,/makeFusee\(M,\{yS:(-?[\d.]+)/,'the fusee\'s top'),[TB_T]=num(mv,/TB_T=(-?[\d.]+)/,'TB_T');
const WSR=1.15,SR=Math.hypot(...MJ.L.Fu.map((v,i)=>v-[4.0,-19.9][i])),Ts=T=>T-T0;   /* the stud 2.3 across (movement.js WSR); its centre 11.6 from the fusee's axis (WSP) */
say('');say(`Wound forward against the winding stop (full wind): the stop takes the key's torque less the chain's ${f(T0,3)} N·m (the fusee's even torque, physics.js); the chain carries only the mainspring's pull, ${f(Fpull,1)} N`);
const Fst=T=>Ts(T)*1000/SR;   /* N on the stud, at its centre's radius */
/* the stop end of the bar, standing out of its slot by up to its full travel, bent in the fusee's plane: σ = 6 F a / (t w²) */
/* the manual doesn't give the bar's or the stud's temper: the build hardens and tempers both (strength.js's range), and what mild steel would take is said */
{const T=TH,F=Fst(T),a=TSTOP,s=6*F*a/(TS*SBW**2)*MPa,Tq=y=>T0+y*TS*SBW**2/(6*a)*SR/1000;
  line(out.forward,`stop-bar's stop end (${SBW} wide, ${TS} thick, ${TSTOP} out of its slot)`,`${f(F,1)} N`,s,STEEL_Y,'hardened and tempered steel',Tq(STEEL_Y[0]));
  const Tb=Tq(STEEL_Y_SOFT[0]);out.softBar=Tb;out.softBarWhy=Tb<TH?"a strong hand's":Tb<1.5*TH?"under half as much again as a strong hand's (a gloved hand or a longer bow)":"past half as much again as a strong hand's";
  say(`    left soft (mild steel, yield ${STEEL_Y_SOFT.join('-')}), it would bend at ${f(Tb,2)} N·m on the key, ${out.softBarWhy}${Tb<1.5*TH?': harden and temper it':''}`);}
/* the stud: a cantilever from the bridge's face to where the bar meets it (the bar's middle height, yS less half its thickness), σ = 32 F L / π d³; the thread
   (M1.6, its core 1.17) holding the moment against the stud's face on the bridge, the face's edge the fulcrum: tension M / (0.8 r) through the core, its pull-out
   shear on the brass threads over 2 mm */
{const L=Math.abs((yS-TS/2)-TB_T),T=TH,F=Fst(T),d=2*WSR,s=32*F*L/(Math.PI*d**3)*MPa,Ty=T0+STEEL_Y[0]*Math.PI*d**3/(32*L)*SR/1000;
  line(out.forward,`winding stop stud (${f(d,1)} across, met ${f(L,1)} from the bridge)`,`${f(F,1)} N`,s,STEEL_Y,'hardened and tempered steel',Ty);
  const Ft=F*L/(0.8*WSR),dc=1.171,st=Ft/(Math.PI*dc*dc/4)*MPa,Ts2=T0+STEEL_Y[0]*(Math.PI*dc*dc/4)*0.8*WSR/L*SR/1000;
  line(out.forward,'  its thread (M1.6) in tension, the moment on its face',`${f(Ft,0)} N`,st,STEEL_Y,'hardened and tempered steel',Ts2);
  say(`    the stud left soft: its thread would yield at ${f(T0+STEEL_Y_SOFT[0]*(Math.PI*dc*dc/4)*0.8*WSR/L*SR/1000,2)} N·m on the key`);
  const As=Math.PI*1.6*2.0*0.5,sh=Ft/As*MPa,Tsh=T0+BRASS_SH[0]*As*0.8*WSR/L*SR/1000;
  line(out.forward,'  the bridge\'s brass threads, pulled out (2 mm engaged)',`${f(Ft,0)} N`,sh,BRASS_SH.map(Math.round),'brass in shear',Tsh);}
/* the arbor's square (2.4 across, the key's socket on it) and its neck under it (r 1.2) in torsion: τ = T / 0.208 a³, 16 T / π d³ */
{const T=TH,a=2.4,s=T*1000/(0.208*a**3)*MPa,d=2.4,s2=16*T*1000/(Math.PI*d**3)*MPa;
  line(out.forward,'fusee arbor\'s square (2.4 across) in torsion',`${f(T,2)} N·m`,s,STEEL_SH.map(Math.round),'hardened steel in shear',STEEL_SH[0]*0.208*a**3/1000);
  line(out.forward,'  its neck under the square (2.4 across)',`${f(T,2)} N·m`,s2,STEEL_SH.map(Math.round),'hardened steel in shear',STEEL_SH[0]*Math.PI*d**3/16/1000);}
/* the key's brass socket (core.js: r kw/2 outside, the square 2.46): the thinnest wall at a corner, a thin-walled square tube, τ = T / 2 A t */
{const ro=kw/2,a=2.46,t=ro-a/Math.SQRT2,Am=((2*ro+a)/2)**2*0.85,s=TH*1000/(2*Am*t)*MPa;
  line(out.forward,`the key's socket (brass, ${f(t,2)} at its thinnest)`,`${f(TH,2)} N·m`,s,BRASS_SH.map(Math.round),'brass in shear',BRASS_SH[0]*2*Am*t/1000);}
/* winding fast into the stop: the fusee and the barrel through the chain (at full wind the chain leaves the fusee at its smallest radius, T0 / pull) stopped on
   the bar's stop end and the stud in series (cantilevers, 3 E I / L³); the key and square stand behind the arbor's neck, far softer in torsion, so the hand's own
   push is the static case above. At a turn a second by hand and two with a winder (Fig. 102) */
{const J=MJ.arbors,E=207e3,rf=T0/Fpull*1000,Jf=J.fusee.I+(J.barrel.I+2100)*(rf/PH.rB)**2,kb=3*E*(TS*SBW**3/12)/TSTOP**3,ks=3*E*(Math.PI*(2*WSR)**4/64)/Math.abs((yS-TS/2)-TB_T)**3,k=1/(1/kb+1/ks);
  const slam=[1,2].map(nt=>{const w=nt*2*Math.PI,KE=0.5*Jf*1e-9*w*w,F=Math.sqrt(2*KE*1000*k);return{nt,KE:KE*1e6,F,T:F*SR/1000};});
  say(`wound fast into the stop: the fusee and the barrel through the chain, ${f(Jf,0)} g·mm² at the fusee (the mainspring's moving half 2100 g·mm², estimated), stopped on the bar's end and the stud (${f(k,0)} N/mm in series): ${slam.map(q=>`at ${q.nt} turn${q.nt>1?'s':''} a second ${f(q.KE)} µJ, ${f(q.F)} N for a moment, as ${f(q.T,2)} N·m held`).join('; ')}`);
  for(const q of slam)line(out.forward,`stop-bar's stop end, struck at ${q.nt} turn${q.nt>1?'s':''} a second`,`${f(q.F,0)} N`,6*q.F*TSTOP/(TS*SBW**2)*MPa,STEEL_Y,'hardened and tempered steel',null);
  out.notes.push({slam,Jf,k});}

/* ---------- backward: the wrong way, into the train ---------- */
say('');say(`Turned the wrong way (clockwise), held: the key's torque adds to the chain's ${f(T0,3)} N·m, through the winding pawls, the sustaining spring (closed solid), the fusee wheel and the train to the escape wheel, held on the locking stone`);
const arb=n=>{const m=new RegExp(`R\\.${n}=hn\\(arbor\\((.*?)\\),'`).exec(mv);if(!m)throw Error('not found: arbor '+n);const s=m[1],w=/wheel:\{[^}]*?th:([\d.]+)/.exec(s),p=/pin:\{[^}]*?th:([\d.]+)/.exec(s),wy=/wheel:\{[^}]*?\by:([-\d.]+)[,}]/.exec(s),py=/pin:\{[^}]*?\by:([-\d.]+)[,}]/.exec(s);return{w:w&&+w[1],p:p&&+p[1],wy:wy&&+wy[1],py:py&&+py[1]};};
const fc=(W,P)=>W.wy!=null&&P.py!=null?Math.max(0,Math.min(W.wy+W.w/2,P.py+P.p/2)-Math.max(W.wy-W.w/2,P.py-P.p/2)):Math.min(W.w,P.p);   /* a mesh's face: where the wheel's and the pinion's heights overlap (the fusee wheel's 2.22 on the centre pinion's 1.54 bear over 1.40; min(th) until 18 October 2026) */
const A={gw:arb('gw'),cw:arb('cw'),tw:arb('tw'),fw:arb('fw'),esc:arb('esc')},TR=PH.TRAIN,MO=PH.MODS,Y=0.2;
const MESH=[['fusee wheel → centre pinion',TR.fu,MO.fusee,fc(A.gw,A.cw),fc(A.gw,A.cw),TR.cp],['centre wheel → third pinion',TR.cw,MO.centre,fc(A.cw,A.tw),fc(A.cw,A.tw),TR.tp],['third wheel → fourth pinion',TR.tw,MO.third,fc(A.tw,A.fw),fc(A.tw,A.fw),TR.fp],['fourth wheel → escape pinion',TR.fw,MO.fourth,fc(A.fw,A.esc),fc(A.fw,A.esc),TR.ep]];
let ratio=1;const back=T=>T+T0;
for(const[nm,z,m,bw,bp,zp]of MESH){const r=m*z/2/1000,b=Math.min(bw,bp)/1000,s=T=>back(T)*ratio/r/(b*m/1000*Y),Ty=BRASS_Y[0]*MPa*(b*m/1000*Y)*r/ratio-T0;
  line(out.backward,`${nm} (${z}:${zp})`,`${f(back(TH)*ratio*1000,ratio<0.02?2:1)} mN·m`,s(TH),BRASS_Y,'brass\'s yield (Lewis, Y 0.2, as strength.js)',Ty);ratio*=zp/z;}
/* the winding pawls (both bear: ratchets.js) and the sustaining spring's pins */
{const W=MJ.pawls.filter(q=>/winding/.test(q.name)),q=W[0],C=q.face.C,n=q.face.n,arm=Math.abs(C[0]*n[1]-C[1]*n[0]),F=T=>back(T)*1000/arm/W.length,s=6*F(TH)*(Math.hypot(...C)-q.ri)/(q.thick*(0.97*q.p*q.ri)**2)*MPa,
  Ty=STEEL_Y[0]*q.thick*(0.97*q.p*q.ri)**2/(6*(Math.hypot(...C)-q.ri))*arm*W.length/1000-T0;
  line(out.backward,`the fusee's winding ratchet, a tooth under each pawl (${q.z} teeth, ${q.thick} thick)`,`${f(F(TH),1)} N each`,s,STEEL_Y,'hardened steel (dark, tempered: movement.js)',Ty);}
{const FK=(TR.fu+2)*MO.fusee/40.87,rp=14.6*FK,F=T=>back(T)*1000/rp,s=F(TH)/(Math.PI*0.4**2)*MPa,Ty=STEEL_SH[0]*Math.PI*0.4**2*rp/1000-T0;
  line(out.backward,'the sustaining spring\'s pin in the ratchet (r 0.4), in shear',`${f(F(TH),1)} N`,s,STEEL_SH.map(Math.round),'steel in shear',Ty);}
/* the escapement: the train held on the locking stone while the key is held; when the balance next unlocks, the impulse is that much stronger */
{const k=back(TH)/T0,A=ESC.ampAt(k)*180/Math.PI,trip=(ESC.TRIP||333*Math.PI/180)*180/Math.PI;let lo=1,hi=20;for(let i=0;i<50;i++){const md=(lo+hi)/2;ESC.ampAt(md)*180/Math.PI<trip?lo=md:hi=md;}const kT=(lo+hi)/2;
  say(`the escapement: driven ${f(k,1)} times as hard, the balance would swing ${f(Math.min(A,999))}°; past ${f(trip)}° (${f(kT,2)} times the drive, ${f(kT*T0-T0,2)} N·m on the key) the impulse jewel comes round to the detent again in the same swing and the wheel unlocks twice: it gains half a second each time, while the key is held so`);
  out.notes.push({esc:{k,A,trip,kT,Tk:kT*T0-T0}});}
/* the weakest link each way */
const weak=L=>L.filter(x=>x.Ty!=null).sort((a,b)=>a.Ty-b.Ty)[0],wf=weak(out.forward),wb=weak(out.backward);
say('');say(`forward, the first to yield: ${wf.name.trim()}, at ${f(wf.Ty,2)} N·m on the key (${f(wf.Ty/TH,1)} times a strong hand's ${f(TH,2)})`);
say(`the wrong way, the first to yield: ${wb.name.trim()}, at ${f(wb.Ty,2)} N·m on the key (${f(wb.Ty/mean,1)} times an average hand's ${f(mean,2)}, ${f(wb.Ty/TH,1)} times a strong one's)`);
out.weakF={name:wf.name.trim(),Ty:wf.Ty};out.weakB={name:wb.name.trim(),Ty:wb.Ty};
const okF=wf.Ty>1.5*TH;rows.push(`${okF?'  ok ':'  !! '} wound forward against the stop, a strong hand (${f(TH,2)} N·m) leaves every part ${f(wf.Ty/TH,1)} times short of yielding${okF?'':': the stop is the weak point'}`);if(!okF)fail=1;
const okB=wb.Ty>TH;rows.push(`${okB?'  ok ':'  ~~ '} turned the wrong way and forced, ${okB?'nothing yields under a strong hand':`${f(wb.Ty,2)} N·m bends the ${wb.name.trim().split(' (')[0]}'s teeth, ${f(wb.Ty/mean*100,0)} % of an average hand's twist: the manual's "counterclockwise" is all that keeps it, as on the Model 21; a winding key that turns the arbor one way only (a ratchet in its pipe, as Breguet's "tipsy" key of about 1790; deviations.js) makes it impossible`}`);
out.okF=okF;out.okB=okB;out.rows=rows;module.exports=out;
if(require.main===module){console.log(rows.join('\n'));
  const jo=process.argv.indexOf('--json');if(jo>0)fs.writeFileSync(process.argv[jo+1],JSON.stringify(out));
  process.exitCode=fail;}
