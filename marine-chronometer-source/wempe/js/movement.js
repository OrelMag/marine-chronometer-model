// @ts-check
/* movement.js: the Wempe Einheits-Chronometer's movement, built from the works drawings' numbers (dims.js, WD) by its groups' builders, each in its own file: the frame
   (js/frame.js, WFRAME, P1a, 14 October 2026), the going train (js/train.js, WTRAIN, P1b), the fusee, maintaining work, barrel, mainspring and chain or band (js/fusee.js,
   WFUSEE, P1c), the balance and escapement (js/escapement.js, WESC, P1d), the dial, motion work, hands and up-and-down work (js/dial.js, WDIAL, P1e).
   Part of the Wempe model (three.js r128). Units mm; the movement frame as the Hamilton's: dial side +y, 12 o'clock -z, 3 o'clock +x (dims.js: x = the sheets' W, z = their S).
   The pillar plate's inner face at y 0, its dial face at +PP_T; the top plate's inner face at -INNER, its outer face (the train side) at -INNER-TOP_T.
   Everything is built inside buildWempe, so none of its names reach the page's globals: core.js reads the Hamilton's (L, DIAL_R, SEC_L, UDA, UD_SWEEP, MSHAPE) lazily.
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
  /* setRev(v): the version shown (app.js's Variants): the sheets as last revised ('last', about 1946-48, the page's default), as first drawn ('first', 1940-44), or the Soviet
     copy made from them ('6mx', Kirov No. 247 of 1952). Each part keeps its key; the pieces not every version has are in groups whose userData.rev lists the versions they show
     in ('last 6mx': the revised sheets' pieces the 6MX kept), the others hidden as the band is (the tools skip what isn't shown), and each builder's onRev(v) moves what they
     share but stands elsewhere */
  const RV=[];mv.traverse(o=>{if(o.userData.rev)RV.push(o);});mv.userData.revs=['last','first','6mx'];
  mv.userData.setRev=(/** @type {string} */v)=>{const s=mv.userData.revs.includes(v)?v:'last';mv.userData.rev=s;for(const o of RV)o.visible=o.userData.rev.split(' ').includes(s);for(const g of mv.userData.onRev)g(s);};
  mv.userData.setRev('last');
  /* update(s): the Hamilton's MoveState ({E, th, lift, psDef, n, winding, ...}). E, the escape wheel's place in teeth, turns the train (WTRAIN: its arbors' angles, ang.c the
     centre arbor's, which the motion work and the fusee wheel follow, ang.s the seconds arbor's, which carries the seconds hand) and the escape wheel; th the balance's
     angle (rad), lift the detent's turn and psDef the gold spring's (rad, escapement.js); n, the fusee's turns from full wind, and winding set the fusee, the chain or band,
     the barrel and the mainspring (WFUSEE), and the motion work, hands and up-and-down work follow the train's angles and the fusee's (ang.f) (WDIAL) */
  mv.userData.update=(/** @type {any} */s)=>{const ang=TR.update(s);ang.f=FU.update(s,ang.c);mv.userData.ang=ang;EB.update(s);DL.update(s,ang);};
  mv.userData.R={fr:FR,tr:TR,esc:EB.R,fu:FU,dl:DL.R};mv.userData.S={pil:WD.PILLARS};   /* the tools read R and S on the Hamilton; R.tr the train's arbors (their wheel and pinion meshes, for the other groups' tooth phasing) */
  return mv;
}
