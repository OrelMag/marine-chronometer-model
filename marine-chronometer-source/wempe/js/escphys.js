// @ts-check
/* escphys.js: the Wempe Einheits-Chronometer's escapement in time, as the Hamilton's (its app.js, H.amp): the balance's swing from the drive, the rate from the escapement.
   Part of the Wempe model. Declares only WPHYS. The escapement is the shared makeEsc (../shared/escapement.js) with the Wempe's settings, WESC.SET (js/escapement.js: the
   layout of 05 04_1 and the parts' sheets put in makeEsc's frame, the bodies weighed on the model's solids), its reference driven at the escape wheel's torque 12 h from
   full wind (TQ, below), so ESC.ampAt(s) is the swing the drive s times that keeps, and ESC.rateAt(a, s) the escapement's rate against that reference (Airy). The drive
   is measured: 05 06_20's force on the fusee arbor over the wind, through the train. tools/wempe_escapement.js prints and checks all of it (README, Physics) */
const WPHYS=(()=>{
  /* 05 06_20 (Herb. Müller, 24.7.41: "Kraftverlauf. Mittel aus 2 Messungen", "Hebellänge 262 m/m", "Ablauf"): g on a lever 262 mm long, running down, by the fusee's turns
     from its large end (0, run down; 8.74, the curve's end, fully wound), scaled off the plotted curve to ±0.7 g (the transcription's table; the sheet's own mean 131.5 g).
     The lever is on the fusee arbor: the sheet's sum, 131.5 × 262 / 19.6 = 1.758 kg at the fusee wheel's pitch circle ("d = 39,202"), takes no fusee radius, and a pull
     this even (±3.5 %) over the barrel's five turns is what a fusee gives its arbor, not a barrel. Measured running down, so the spring's, chain's and fusee's losses are in it */
  const KV=[[0.05,126.5],[0.29,133.2],[0.5,135.0],[1,135.8],[1.25,136.3],[1.5,135.5],[2,134.6],[2.5,132.4],[3,130.7],[3.5,130.7],[4,129.6],[4.5,129.3],[4.75,129.0],
    [5,129.6],[5.5,130.4],[5.75,129.0],[6,131.3],[6.5,131.8],[7,133.2],[7.5,134.4],[8,135.2],[8.25,135.8],[8.5,138.0],[8.74,138.4]],MF=8.638,LEV=262;   /* MF: the chain's turn on the groove at full wind, where the stop holds the fusee (fusee.js MW: 0.112 short of the groove's end, 8.75, taken until 15 October 2026; the page warns if they part) */
  const gAt=x=>{if(x<=KV[0][0])return KV[0][1];for(let i=1;i<KV.length;i++)if(x<=KV[i][0]){const[a,p]=KV[i-1],[b,q]=KV[i];return p+(q-p)*(x-a)/(b-a);}return KV[KV.length-1][1];};
  const KB=/** @type {any} */(WESC).KB||1,KBN=/** @type {any} */(WESC).KBN,kbn=x=>{if(!KBN)return 1;let i=0;while(i<KBN.length-2&&KBN[i+1][0]<x)i++;const[a,p]=KBN[i],[b,q]=KBN[i+1];return p+(q-p)*Math.max(0,Math.min(1,(x-a)/(b-a)));},fusT=n=>gAt(MF-n)*LEV*9.80665e-6*KB*kbn(MF-n);   /* KBN: a build strip's own drive, turn by turn (tools/wempe_load.js with MC_WSTRIP; the page never sets it) */   /* KB: the build's drive, times 05 06_20's (tools/wempe_load.js with MC_WREV=build sets WESC.KB; WESC.BUILD) */   /* the fusee arbor's torque (N·m) n turns from full wind (the page's n: 0 fully wound, fu.NRUN run down; its curve's turn MF - n, the chain's place on the groove) */
  /* the going train, fusee wheel to escape pinion: 90/14 · 90/12 · 80/10 · 80/10 (train.js, the wheels' tables; the pinions' 12 and 10 from the centres) */
  const RATIO=90/14*90/12*80/10*80/10;
  /* its efficiency, each stage from its parts as the Hamilton's (tools/physics.js A6): the driven arbor's pivots carry its pinion's and wheel's tooth loads, T (1/r_pinion +
     1/r_wheel), and lose mu_p r_pivot of it; the mesh its tooth-by-tooth torque ratio (MESH, tools/gearing.js --model wempe's mean at mu_t 0.10 and 0.20 over the frictionless,
     gearing_wempe.json, the A.4 pinions; until 19 October 2026 about mu_t pi (1/z_wheel + 1/z_pinion) c, 0.749). [pinion's module, driving wheel's teeth, pinion's leaves, its
     own wheel's radius (the escape wheel's to its tips), its pivots' radii]: the centre arbor's train-side pivot Ø 1.2 and its journal Ø 2.2 in WN-302 (05 05 03), the
     intermediate's Ø 0.85, the seconds' Ø 0.82 and 0.76, the escape arbor's Ø 0.24 (train.js, escapement.js). mu_p 0.10-0.15, the Hamilton's published range; the model takes
     the geometric mean of the two ends (estimated): 0.780, wempe_physics.js's train worked tooth by tooth */
  const STG=/** @type {[number,number,number,number,number[]][]} */([[0.4356,90,14,0.35529*45,[0.6,1.1]],[0.35529,90,12,0.28066*40,[0.425,0.425]],[0.28066,80,10,0.26333*40,[0.41,0.38]],[0.26333,80,10,7.0,[0.12,0.12]]]);
  const MESH=[[0.97044,0.94225],[0.98521,0.97068],[0.98236,0.96512],[0.98129,0.96318]];   /* each mesh at mu_t 0.10, 0.20 */
  const eta=(mp,j)=>STG.reduce((q,[m,zw,zp,rw,p],i)=>q*(1-mp*(p[0]+p[1])/2*(2/(m*zp)+1/rw))*MESH[i][j],1);
  const ETA_LO=eta(0.15,1),ETA_HI=eta(0.10,0),ETA=Math.sqrt(ETA_LO*ETA_HI);
  const escT=n=>fusT(n)/RATIO*ETA*1e6;   /* the escape wheel's torque (µN·m) */
  const HPT=90/14,TQ=escT(12/HPT);   /* the fusee's 6.43 h a turn; the reference: 12 h from full wind, as the Hamilton's (its drive 1 there) */
  const SET={...WESC.SET,TQ},ESC=makeEsc(SET,SET);WESC.adapt(ESC);   /* the page's escapement (WESC.ESC.state) moves as this solves it, at the reference's swing by default (the tools' phases); its layout's own motion WESC.ESC.layout */
  const drv=n=>escT(n)/TQ;   /* the drive, times the reference's */
  /* the maintaining spring (Gegenfeder 05 06 01-1), its eye pinned to the ratchet and its other pin to the fusee wheel (05 06_4 A-B): running, the drive closes the open
     ring, its ends nearly meeting (Gould: "a simple steel split-ring, with ends nearly meeting"): 14.4-15.6° of the ratchet against the wheel over the wind, 1.1-2.3° short
     of MSB (16.72°), where its eye would meet its square end. Its push for a lead ψ (rad), MSK ψ + MSK2 ψ², from its drawn section: the band held at the wheel's pin by
     the recess's wall and at its eye by its pin, bent as an elastica (1.22 N·m a radian at small turns, Castigliano's, stiffening as it closes), and MSB from its drawn
     outline: tools/wempe_sustaining.js, which checks these against the ring. While the key turns, the clicks let go and the ratchet turns back with the spring until the
     maintaining detent takes its next tooth (MBK, half a tooth of 120 on average), then the train runs on what the spring keeps, the wheel turning at WFW and the push
     falling to nothing: SUS s from the key going on at 12 h (14 min); the balance stops before that, under about a quarter of the drive (wempe_sustaining.js: 10-13 min).
     Until 16 October 2026 the push was the running drive spent over 05 06_9's "x = 0,27 mm" (likely), 1.09° and 70 s.
     susDrv(m0, t, f): the drive (times the reference's) t s after the key went on, the ratchet's lead m0 then and its fall f to the detent; runPhi, susPhi: the ratchet's
     lead over the wheel, which fusee.js draws the spring closed by */
  const MSK=1.2204,MSK2=0.2956,MSB=16.72*D2R,MBK=TAU/240,WFW=TAU/(HPT*3600);
  const msT=ph=>MSK*ph+MSK2*ph*ph,msPh=T=>(-MSK+Math.sqrt(MSK*MSK+4*MSK2*T))/(2*MSK2);   /* the spring's push (N·m) for a lead, and the lead for a push */
  const runPhi=d=>Math.min(msPh(Math.max(0,d)*TQ*RATIO/ETA/1e6),MSB),susPhi=(m0,t,f=MBK)=>Math.max(0,m0-f-WFW*t),susDrv=(m0,t,f=MBK)=>msT(susPhi(m0,t,f))/RATIO*ETA*1e6/TQ,msDrv=ph=>msT(Math.max(0,ph))/RATIO*ETA*1e6/TQ,SUS=(runPhi(1)-MBK)/WFW;   /* the ratchet's lead over the wheel (rad) running at drive d; t s into a wind begun at lead m0, the ratchet fallen f back to the detent (the page: fusee.js's fall(); MBK, half a tooth, its mean); the drive then */
  /* the balance and hairspring: the period the drawn spring gives the weighed balance. The spring's stiffness E b h³ / 12 L (the strip bent in its plane: 0.285 thick, 0.52
     high), L its working length pin to pin (WESC.HSL: the whole strip 13 turns less 3.5 mm, 05 03_7), carbon spring steel's modulus 206 GPa (200-210, hardened and tempered
     blue: 05 03_6's "dunkelblau anlassen"); the moment of inertia I the balance's with its rollers, collet and a third of its spring (WESC.SET.I). makeEsc runs it at the
     train's 0.5 s (its seconds arbor turns once in 120 teeth): the timing a maker sets. alt: the other readings of the length (14 and 15 turns less 3.5 mm; phase 2a's) */
  const kOf=L=>206e9*WESC.HSL.HB*1e-3*(WESC.HSL.HT*1e-3)**3/12/(L*1e-3),Tof=(I,k)=>TAU*Math.sqrt(I*1e-9/k);
  const HS={k:kOf(WESC.HSL.L),kNeed:SET.I*1e-9*(TAU/0.5)**2,T:Tof(SET.I,kOf(WESC.HSL.L)),kOf,Tof,
    alt:Object.fromEntries(['n14','n15','h13'].map(n=>[n,{L:WESC.HSL[n].L,T:Tof(SET.I,kOf(WESC.HSL[n].L))}]))};
  /* the swing stepped as the Hamilton's ampStep: driven at drv, A² relaxes to ampAt(drv)² as exp(-2t/TF), exactly whatever the step; free (the train held), freeStep */
  const stepOf=(E,S)=>(a,dt,drive)=>{if(drive>0){const u=E.ampAt(drive)**2;return Math.sqrt(u+(a*a-u)*Math.exp(-2*dt/S.TF));}const b=E.freeStep(a,dt);return b<0.2*D2R?0:b;};
  /* on the page the swing a drive keeps is read off WBANK.amp (bankdata.js: tools/wempe_banking.js, each version at its drawn settings, every 0.005 of drive from 0.2 to 1.8), since
     makeEsc's own solve, its work averaged over the beat (SET.SMW) since 27 October 2026, takes about a second; the tools, which don't load it, solve it */
  const tabA=(E,k)=>{const f0=E.ampAt;E.ampAt=s=>{const T=typeof WBANK!=='undefined'&&WBANK.amp&&WBANK.amp[k];if(!T)return f0(s);const f=(s-T.s0)/T.ds,i=Math.floor(f);
    return i>=0&&i<T.A.length-1&&T.A[i]>0&&T.A[i+1]>0?(T.A[i]+(T.A[i+1]-T.A[i])*(f-i))*D2R:f0(s);};return E;};tabA(ESC,'last');
  const ampStep=stepOf(ESC,SET);
  /* each version's escapement (the page's Variants, Version; the user's choice, 17 October 2026): the drawings' as last revised and as first drawn share this one; the Soviet 6MX's
     (Kirov No. 247) has its own bodies, weighed on its solids (WESC.SET6: the first-drawn staff and collar, its detent), the layout, drive and hairspring the drawings'. Built
     when first asked for (a makeEsc solve), its rate against its own reference, as the timing weights would set it: what it runs before timing is tools/wempe_6mx.js's */
  const REV={last:{ESC,SET,HS,ampStep}};
  const rev=v=>{const k=v==='6mx'?'6mx':'last';if(!REV[k]){const S={...SET,...WESC.SET6},E=tabA(makeEsc(S,S),'6mx'),T=Tof(S.I,kOf(WESC.HSL.L));REV[k]={ESC:E,SET:S,HS:{...HS,kNeed:S.I*1e-9*(TAU/0.5)**2,T},ampStep:stepOf(E,S)};}return REV[k];};
  return{ESC,SET,KV,gAt,fusT,escT,drv,RATIO,ETA,ETA_LO,ETA_HI,STG,TQ,HPT,MF,LEV,MSK,MSK2,MSB,MBK,WFW,SUS,susDrv,susPhi,runPhi,msDrv,HS,ampStep,rev};
})();
