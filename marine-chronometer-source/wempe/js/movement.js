// @ts-check
/* movement.js: the Wempe Einheits-Chronometer's movement, built from the works drawings' numbers (dims.js, WD) by its groups' builders, each in its own file: the frame
   (js/frame.js, WFRAME, P1a, 14 October 2026), the going train (js/train.js, WTRAIN, P1b), the fusee, maintaining work, barrel, mainspring and chain or band (js/fusee.js,
   WFUSEE, P1c), the balance and escapement (js/escapement.js, WESC, P1d), the dial, motion work, hands and up-and-down work (js/dial.js, WDIAL, P1e).
   Part of the Wempe model (three.js r128). Units mm; the movement frame as the Hamilton's: dial side +y, 12 o'clock -z, 3 o'clock +x (dims.js: x = the sheets' W, z = their S).
   The pillar plate's inner face at y 0, its dial face at +PP_T; the top plate's inner face at -INNER, its outer face (the train side) at -INNER-TOP_T.
   Everything is built inside buildWempe, so none of its names reach the page's globals: core.js reads the Hamilton's (L, DIAL_R, SEC_L, UDA, UD_SWEEP, MSHAPE) lazily.
   Its API on mv.userData: update(s), explode(e), develop(e) (the Laid out view), setRev(v), parts, R, S, DEV.
   Declares only buildWempe and ESC. */
/* parts-list lines (userData.hn, bom.json ids): the drawing's number without its spaces (as 05 09 01's title block writes it, 050901), since a piece's lines are a space-separated list */
/* ESC: the escapement's motion (js/escapement.js): the tools set the model through ESC.state(phase) (the freeze strings of audit.py, exploded.py, fine.py,
   isolate.py and bom-check.js) and pass what it returns to update(), which takes the Hamilton's MoveState and uses what it has */
const ESC=WESC.ESC;
function buildWempe(M){
  const mv=new THREE.Group(),K=KIT.parts(mv,M);mv.userData.onRev=[];   /* the sheets' two states (setRev, below): each builder's moves for them */
  const FR=WFRAME.build(mv,M,K);   /* the frame: plates, pillars, ring, bridges, cocks, bushes, their screws and pins */
  const TR=WTRAIN.build(mv,M,K);   /* the going train: the centre, intermediate and seconds arbors, their bushes and the seconds jewel */
  const EB=WESC.build(mv,M,K);   /* the balance, hairspring, rollers, escape wheel, detent and their jewels */
  const DL=WDIAL.build(mv,M,K);   /* the dial, motion work, hands and up-and-down work */
  /* the seconds wheel drives the escape pinion (train.js's meshes, phased under load by gearLash as the train's own: -1, the seconds arbor clockwise from the dial); the
     escape wheel's own teeth keep their phase to the locking stone, the pinion's leaves turned on its arbor */
  {const sw=TR.sw.userData.wheel,[a,b]=gearLash(sw,WD.H[35],EB.R.pinion,WD.H[26],-1);sw.rotation.y=a;EB.R.pinion.rotation.y=b;EB.R.pinion1.rotation.y=gearLash(sw,WD.H[35],EB.R.pinion1,WD.H[26],-1)[1];}
  const FU=WFUSEE.build(mv,M,K,FR,TR);   /* the fusee and its wheel, the maintaining work and detent, the stop work, the barrel, its arbor and set-up ratchet, the mainspring, the chain and the band */
  K.done();
  /* setRev(v): the version shown (app.js's Variants): the sheets as last revised ('last', about 1946-48, the page's default), as first drawn ('first', 1940-44), the Soviet
     copy made from them ('6mx', Kirov No. 247 of 1952), or the escapement of 1943 as photographed ('1943': the sheets as last revised but for the escapement, at the heights
     the sheets first drew with the 1943 detent block, as Kirow DEC 422 and 479 and Lange 5177 are made). Each part keeps its key; the pieces not every version has are in
     groups whose userData.rev lists the versions they show in ('last 6mx 1943': the revised sheets' pieces the 6MX and 1943 kept), the others hidden as the band is (the
     tools skip what isn't shown), and each builder's onRev(v) moves what they share but stands elsewhere */
  const RV=[];mv.traverse(o=>{if(o.userData.rev)RV.push(o);});mv.userData.revs=['last','first','6mx','1943'];
  mv.userData.setRev=(/** @type {string} */v)=>{const s=mv.userData.revs.includes(v)?v:'last';mv.userData.rev=s;for(const o of RV)o.visible=o.userData.rev.split(' ').includes(s);for(const g of mv.userData.onRev)g(s);};
  mv.userData.setRev('last');
  /* update(s): the Hamilton's MoveState ({E, th, lift, psDef, n, winding, ...}). E, the escape wheel's place in teeth, turns the train (WTRAIN: its arbors' angles, ang.c the
     centre arbor's, which the motion work and the fusee wheel follow, ang.s the seconds arbor's, which carries the seconds hand) and the escape wheel; th the balance's
     angle (rad), lift the detent's turn and psDef the gold spring's (rad, escapement.js); n, the fusee's turns from full wind, and winding set the fusee, the chain or band,
     the barrel and the mainspring (WFUSEE), and the motion work, hands and up-and-down work follow the train's angles and the fusee's (ang.f) (WDIAL) */
  mv.userData.update=(/** @type {any} */s)=>{const ang=TR.update(s);ang.f=FU.update(s,ang.c);mv.userData.ang=ang;EB.update(s);DL.update(s,ang);};
  mv.userData.R={fr:FR,tr:TR,esc:EB.R,fu:FU,dl:DL.R};mv.userData.S={pil:WD.PILLARS};   /* the tools read R and S on the Hamilton; R.tr the train's arbors (their wheel and pinion meshes, for the other groups' tooth phasing) */
  /* ---------- laid out: buildWempe.DEV (below) ---------- */
  const DEV=buildWempe.DEV;
  /* driven pinions: when a pair's line of centres turns by D, the driver standing, the pinion turns D(1 + driver's teeth / its leaves) to stay in mesh (a coin rolled round a
     coin); the escape pinion less the turn of its frame. Taken within half a pitch, on top of the loaded phase gearLash gave it (r0): the fusee wheel (90) drives the centre
     pinion, the centre wheel the intermediate's, the intermediate wheel the seconds', the seconds wheel the escape pinion (both states' pinions) */
  const PT=mv.userData.parts,dOf=(/** @type {string} */k)=>DEV.sub(DEV.P[k],DEV.A[k]),dC=dOf('C'),dE=dOf('E'),E0=DEV.A.E,gz=(/** @type {any} */m)=>m.userData.gear.z;
  const DPH=/** @type {[any,string,string,number,number][]} */([[TR.cw.userData.pin,'Fu','C',90,0],[TR.tw.userData.pin,'C','T',gz(TR.cw.userData.wheel),0],[TR.sw.userData.pin,'T','S',gz(TR.tw.userData.wheel),0],
    [EB.R.pinion,'S','E',gz(TR.sw.userData.wheel),DEV.g],[EB.R.pinion1,'S','E',gz(TR.sw.userData.wheel),DEV.g]]).map(([m,a,b,na,x])=>{const nb=gz(m),p=TAU/nb,c=(DEV.fi(DEV.w)-DEV.fi(DEV.sub(DEV.A[b],DEV.A[a])))*(1+na/nb)-x;
    return{m,r0:m.rotation.y,c:(((c+p/2)%p)+p)%p-p/2};});
  const DMV=/** @type {[any,number[]][]} */([...['centreWheel','cannon','changeWheel','hourWheel','hands'].map(k=>[PT[k],dC]),[PT.intermediateWheel,dOf('T')],[PT.secondsWheel,dOf('S')],
    [DL.R.sh,DEV.sub(dOf('S'),dC)],[DL.R.uh,[-dC[0],-dC[1]]]]);   /* the seconds and up-and-down hands are in the hands' part, which goes with the centre arbor */
  for(const[o]of DMV)o.userData.xz0=[o.position.x,o.position.z];
  const EFP=['escapeWheel','detent','detentBlock','balance','rollers','hairspring','stud'].map(k=>PT[k]);
  /* schematic plates for the laid-out view, drawn see-through (the viewer, devPlate), standing in for the frame, whose holes no longer meet the arbors: the pillar plate and
     top plate along the line at their own heights and wide enough for the barrel (Ø 41.6) and fusee wheel, the intermediate bridge on the dial side under the intermediate and
     seconds arbors, a bridge over the barrel's arbor, the lower cock hanging from the top plate and the upper cock over the balance on a foot, and three pillars (Ø 8.1) beside
     the line clear of the wheels, the chain and the detent. Not parts: no partName, so they can't be picked, listed or sectioned; schematic, not the movement's */
  {const dp=new THREE.Group();mv.add(dp);const w=DEV.w,n=[-w[1],w[0]],at=(/** @type {number} */t,s=0)=>[DEV.A.Ba[0]+w[0]*t+n[0]*s,DEV.A.Ba[1]+w[1]*t+n[1]*s],tB=DEV.t('B'),TI=-WD.INNER,TT=TI-WD.TOP_T,PPT=WD.PP_T,PW=48;
    mesh(dp,KIT.stadium(at(0),at(tB),PW,PPT),M.gilt,0,0,0);mesh(dp,KIT.stadium(at(0),at(tB),PW,WD.TOP_T),M.gilt,0,TT,0);
    mesh(dp,KIT.stadium(at(DEV.t('T')-5),at(DEV.t('S')+5),10,3.8),M.gilt,0,PPT,0);mesh(dp,KIT.stadium(at(-7),at(7),14,3.32),M.gilt,0,TT-3.32,0);
    mesh(dp,KIT.stadium(at(tB),at(tB+12),8,3.22),M.gilt,0,TI+10-3.22,0);cylBetween(dp,3,TI,TI+10,M.gilt,...at(tB+12),32);
    mesh(dp,KIT.stadium(at(tB),at(tB+18),9,2.4),M.gilt,0,TT-15,0);cylBetween(dp,3.5,TT-12.6,TT,M.gilt,...at(tB+18),32);
    for(const[t,s]of[[22,19],[22,-19],[DEV.t('E'),19]])cylBetween(dp,WD.PIL.r,TI,0,M.brass,...at(t,s),48);
    dp.traverse(o=>{if(o.isMesh){o.userData.devPlate=true;o.userData.noCap=true;o.visible=false;}});}
  /* develop(e): 0 as built, 1 laid out in a line; moves only x, z and the turn about y, so it combines with the explode */
  mv.userData.develop=(/** @type {number} */e)=>{for(const[o,d]of DMV){o.position.x=o.userData.xz0[0]+d[0]*e;o.position.z=o.userData.xz0[1]+d[1]*e;}
    const a=DEV.g*e,c=Math.cos(a),s=Math.sin(a);for(const g of EFP){g.rotation.y=a;g.position.x=E0[0]+dE[0]*e-(E0[0]*c+E0[1]*s);g.position.z=E0[1]+dE[1]*e-(-E0[0]*s+E0[1]*c);}
    for(const q of DPH)q.m.rotation.y=q.r0+q.c*e;};
  mv.userData.DEV=DEV;
  return mv;
}
/* ---------- laid out (the Hamilton's Laid out view, its movement.js's DEV: the textbooks' developed drawing): the barrel and fusee stay, and with them all they carry; each
     later arbor goes onto the barrel-fusee line at its real centre distance from the one before (the hole tables': 22.65, 18.12, 12.63, 11.85, the balance 10.00 from
     the escape arbor), so every pair still meshes; the escape wheel, detent, its block, the balance, rollers, hairspring and stud turn together about the escape arbor
     (DEV.g), so the escapement is unchanged and the balance ends the line. The motion work and hands go with the centre arbor, the seconds hand with the seconds arbor;
     the up-and-down wheel stays on the fusee's pinion and its hand with it ---------- */
/* buildWempe.DEV: the line (w its direction from the barrel through the fusee), each arbor as built (A) and laid out (P), t(k) how far along the line from the barrel,
   g the escapement's turn, mid the line's middle (app.js's Laid out view aims there) */
buildWempe.DEV=(()=>{const H=WD.H,A={Ba:H[45],Fu:H[10],C:H[1],T:H[38],S:H[35],E:WESC.W,B:WESC.B},sub=(/** @type {number[]} */a,/** @type {number[]} */b)=>[a[0]-b[0],a[1]-b[1]],fi=(/** @type {number[]} */p)=>Math.atan2(-p[1],p[0]);
  const d=sub(A.Fu,A.Ba),l=Math.hypot(d[0],d[1]),w=[d[0]/l,d[1]/l],/** @type {{[k:string]:number[]}} */P={Ba:A.Ba,Fu:A.Fu},t=(/** @type {string} */k)=>(P[k][0]-A.Ba[0])*w[0]+(P[k][1]-A.Ba[1])*w[1];
  for(const[a,b]of[['Fu','C'],['C','T'],['T','S'],['S','E'],['E','B']]){const r=Math.hypot(...sub(A[b],A[a]));P[b]=[P[a][0]+w[0]*r,P[a][1]+w[1]*r];}
  return{A,w,P,t,fi,sub,g:fi(w)-fi(sub(A.B,A.E)),mid:[(A.Ba[0]+P.B[0])/2,(A.Ba[1]+P.B[1])/2]};})();
