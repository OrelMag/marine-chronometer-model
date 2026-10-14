// @ts-check
/* movement.js: the Wempe Einheits-Chronometer's movement, built from the works drawings' numbers (dims.js, WD) by its groups' builders, each in its own file: the frame
   (js/frame.js, WFRAME, P1a, 14 October 2026); the balance and escapement (js/escapement.js, WESC, P1d); the train, fusee and barrel, motion work come in their own phases,
   each a file of its own.
   Part of the Wempe model (three.js r128). Units mm; the movement frame as the Hamilton's: dial side +y, 12 o'clock -z, 3 o'clock +x (dims.js: x = the sheets' W, z = their S).
   The pillar plate's inner face at y 0, its dial face at +PP_T; the top plate's inner face at -INNER, its outer face (the train side) at -INNER-TOP_T.
   Everything is built inside buildWempe, so none of its names reach the page's globals: core.js reads the Hamilton's (L, DIAL_R, SEC_L, UDA, UD_SWEEP, MSHAPE) lazily.
   Declares only buildWempe and ESC. */
/* parts-list lines (userData.hn, bom.json ids): the drawing's number without its spaces (as 05 09 01's title block writes it, 050901), since a piece's lines are a space-separated list */
/* ESC: the escapement's motion (js/escapement.js): the tools set the model through ESC.state(phase) (the freeze strings of audit.py, exploded.py, fine.py,
   isolate.py and bom-check.js) and pass what it returns to update(), which takes the Hamilton's MoveState and uses what it has */
const ESC=WESC.ESC;
function buildWempe(M){
  const mv=new THREE.Group(),K=KIT.parts(mv,M);
  const FR=WFRAME.build(mv,M,K);   /* the frame: plates, pillars, ring, bridges, cocks, bushes, their screws and pins */
  const EB=WESC.build(mv,M,K);   /* the balance, hairspring, rollers, escape wheel, detent and their jewels */
  K.done();
  /* update(s): the Hamilton's MoveState ({E, th, lift, psDef, n, winding, ...}): E the escape wheel's place in teeth, th the balance's angle (rad), lift the detent's turn
     and psDef the gold spring's (rad, escapement.js) */
  mv.userData.update=(/** @type {any} */s)=>{EB.update(s);};
  mv.userData.R={fr:FR,esc:EB.R};mv.userData.S={pil:WD.PILLARS};   /* the tools read R and S on the Hamilton */
  return mv;
}
