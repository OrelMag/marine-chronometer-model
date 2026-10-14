// @ts-check
/* movement.js: the Wempe Einheits-Chronometer's movement, built from the works drawings' numbers in dims.js (WD). Part of the Wempe model (three.js r128).
   P0 (14 October 2026): the frame alone, provisional: the pillar plate (Unterplatte) and the top plate (Oberplatte), the three pillars (Pfeiler) and their six screws.
   Units mm; the movement frame as the Hamilton's: dial side +y, 12 o'clock -z, 3 o'clock +x (dims.js: x = the sheets' W, z = their S). The pillar plate's inner face
   at y 0, its dial face at +PP_T; the top plate's inner face at -INNER, its outer face (the train side) at -INNER-TOP_T.
   Everything is built inside buildWempe, so none of its names reach the page's globals: core.js reads the Hamilton's (L, DIAL_R, SEC_L, UDA, UD_SWEEP, MSHAPE) lazily.
   Declares only buildWempe and ESC. */
/* parts-list lines (userData.hn, bom.json ids): the drawing's number without its spaces (as 05 09 01's title block writes it, 050901), since a piece's lines are a space-separated list */
/* ESC: a stand-in until the Wempe's escapement is built: the tools set the model through ESC.state(phase) (the freeze strings of audit.py, exploded.py, fine.py,
   isolate.py and bom-check.js) and pass what it returns to update(), which takes the Hamilton's MoveState and uses what it has */
const ESC={AMIN:0,state:p=>({th:0,lift:0,psDef:0,prog:0,p})};
function buildWempe(M){
  const mv=new THREE.Group(),K=KIT.parts(mv,M),{part,screw}=K,V2=(a,b)=>new THREE.Vector2(a,b),P=WD.PIL,S=WD.PSCR,YT=-WD.INNER;
  const circ=(r,n)=>[...Array(n).keys()].map(k=>{const a=k/n*TAU;return[r*Math.cos(a),r*Math.sin(a)];});
  /* the plates: discs Ø 85, 3.35 thick, with the three pillar holes (reamed 4.50), each seated Ø 8.6 × 0.3 in the plate's inner face for the pillar's shoulder (05 08 01
     Schnitt L-M, 05 08 02-1 Schnitt E-F). Drawn gilt: the sheets give brass (Messingblech 4, Sonder Ms) and no sheet read yet gives the finish (estimated). The rest of their
     holes, the top plate's cut round the barrel (05 08_1b: milled to 42.5 before reaming) and the bridges come in P1a */
  const holes=s=>WD.PILLARS.map(([x,z])=>[x,s*z,WD.PIL_HOLE,WD.PIL_SEAT[0],WD.PIL_SEAT[1]]);   /* cbGeo's holes, counterbored from its top face (y 0); s -1 for a plate turned over */
  const pp=part('pillarPlate',0);hn(mesh(pp,KIT.cbGeo(circ(WD.PLATE_R,240),WD.PP_T,holes(1)),M.gilt,0,0,0),'050802-1');   /* its seats in its inner face, at y 0; the plate toward +y */
  const tp=part('topPlate',-40);{const g=KIT.cbGeo(circ(WD.PLATE_R,240),WD.TOP_T,holes(-1));g.rotateX(Math.PI);hn(mesh(tp,g,M.gilt,0,YT,0),'050901');}   /* turned over: its seats in its inner face, at -INNER; the plate toward -y */
  /* the pillars (05 08 00-1): turned brass, the body Ø 8.14 for 19.6 between its shoulders, which sit in the plates' seats; a spigot Ø 4.5 f7 at each end, 2.8 long, its
     last 1.1 turned down to Ø 4.3 at 6°; tapped M2.6 through from both ends (the bore drawn at the thread's size and 0.02, as the Hamilton's tapped holes, hT), a 90° countersink
     at each end. The small relief at the shoulders (05 08 00-1, about 0.3 across) is left out until P1a. One profile turned about the pillar's axis, its outer wall rising in y */
  const yb=WD.PIL_SEAT[1],yt=YT-WD.PIL_SEAT[1],e0=yt-P.sL,e1=yb+P.sL,rb=S.rs+0.02,cd=P.cs-rb;   /* the shoulders, the spigots' ends, the bore and the countersink's depth (45°) */
  const prof=[V2(P.cs,e0),V2(P.tip[0],e0),V2(P.sr,e0+P.tip[1]),V2(P.sr,yt),V2(P.r,yt),V2(P.r,yb),V2(P.sr,yb),V2(P.sr,e1-P.tip[1]),V2(P.tip[0],e1),V2(P.cs,e1),V2(rb,e1-cd),V2(rb,e0+cd),V2(P.cs,e0)];
  const pil=part('pillars',-20),pg=new THREE.LatheGeometry(prof,48);
  for(const[x,z]of WD.PILLARS)hn(mesh(pil,pg,M.brass,x,0,z),'050800-1');
  /* the pillar screws (the WN standard part's sheet not read yet): M2.6, from each plate's outer face into the pillar's end; the dial side's in a frame turned over, so their heads face +y */
  for(const[x,z]of WD.PILLARS)hn(screw(tp,x,z,YT-WD.TOP_T,S.r,S.h,S.len,S.rs),'WN-pil.t');
  {const rg=new THREE.Group();rg.rotation.x=Math.PI;pp.add(rg);for(const[x,z]of WD.PILLARS)hn(screw(rg,x,-z,-WD.PP_T,S.r,S.h,S.len,S.rs),'WN-pil.d');}
  K.done();
  /* update(s): the Hamilton's MoveState ({E, th, lift, psDef, n, winding, ...}); the frame has nothing that moves yet */
  mv.userData.update=(/** @type {any} */s)=>{};
  mv.userData.R={};mv.userData.S={pil:WD.PILLARS};   /* the tools read R and S on the Hamilton */
  return mv;
}
