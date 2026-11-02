// @ts-check
/* hdims.js: the Hamilton Model 21's drawn sizes, from Hamilton Watch Co.'s own factory drawings (the NAWCC's set, References/Hamilton-original-drawings/: INVENTORY.md; each sheet's
   transcription in transcriptions/NNNNN.md, its numbered items and how sure each reading is). Part of 'The Marine Chronometer, working'. Nothing reads HD yet (PLAN-hamilton-drawings.md, phase 2).
   Units: millimetres, each from the sheet's inches by I() (x25.4, exact to 1e-6); the inches stay in the code, the comment gives "NNNNN #item" (the transcription's item number; "tbl N" a coordinate-table row).
   Tolerances are in units of the sheet's last decimal place (".0503 +3/-0" is +.0003/-0): written here in inches beside the size they bound ("+a/-b").
   Frames: a part's outline is in the sheet's own frame with the datum (2.0000, 2.0000), table row 1, taken as 0,0: x to the right of the sheet, y up it (the plan as the sheet draws it, 5:1 to 20:1; no mirror).
   An outline is a closed loop in traversal order of exact segments: {k:'l',p,q} a line; {k:'a',c,r,p,q,ccw,tg} an arc about c of radius r from p to q (ccw: counter-clockwise in x right, y up; tg: tangent to the next segment).
   End points are the table's rows, so each arc's ends lie on its radius to the table's 0.0001 in (tools/hdraw.py checks it to 0.0002 in, and that each loop closes). Diameters are diameters.
   Readings still unsure are marked "unsure" in the comment and are in the transcription's "Verification" section. */
"use strict";
const I=x=>Math.round(x*25.4*1e6)/1e6;
/** a table row (inches, the sheet's frame) in mm about the datum */
const hrow=(t,i)=>/** @type {[number,number]} */([I(t[i][0]-2),I(t[i][1]-2)]);
/** @param {Record<number,number[]>} t @param {number} c @param {number} r @param {number} p @param {number} q @param {boolean} ccw @param {boolean=} tg */
const hA=(t,c,r,p,q,ccw,tg)=>({k:'a',c:hrow(t,c),r:I(r),p:hrow(t,p),q:hrow(t,q),ccw,tg:!!tg});
/** @param {Record<number,number[]>} t @param {number} p @param {number} q */
const hL=(t,p,q)=>({k:'l',p:hrow(t,p),q:hrow(t,q)});
const HD=(()=>{
/* 42007 winding pawl spring: table rows (inches) */
const t07={1:[2,2],2:[2.0599,2.0151],3:[2.4076,1.9220],4:[2.2630,1.5923],5:[2.2532,1.5903],6:[2.2489,1.5813],7:[2.1856,1.4453],8:[2.0988,1.5677],9:[2.5355,2.3743],10:[2.5088,2.3605],11:[2.4888,2.3382],12:[2.3887,2.2264],13:[2.3794,2.3761],14:[2.0555,2.2102],15:[2.1716,2.1152],16:[2,1.8440],17:[2.1013,1.6420]};
/* 42010 winding pawl */
const t10={1:[2,2],2:[1.9654,1.9639],3:[1.8410,1.8338],4:[1.7720,2],5:[1.8180,2.09],6:[1.9813,2.3996],7:[1.9977,2.0499]};
/* 42016 sustaining spring */
const t16={1:[2,2],2:[2.0849,2.0299],3:[2.4621,2.1629],4:[2.1933,2.4591],5:[2.6167,1.9926],6:[2.8372,1.4024],7:[2.7322,1.6835],8:[2.5206,1.4709],9:[2.45,1.4],10:[2.3676,1.3433],11:[2.61,2],12:[2.1171,1.5029],13:[2.13,1.5920],14:[2.1794,1.6672],15:[2.3167,1.8762],16:[2.0838,1.9672]};
/* 42096 sustaining pawl */
const t96={1:[2,2],2:[1.9542,2.1],3:[1.9159,1.9678],4:[2.4764,2.1822],5:[1.9524,2.4746],6:[2,2.49],7:[2.3885,2.3304],8:[2.0686,2.0583]};
/* 42005 chain centre link */
const t05={1:[2,2],2:[2.0235,2.0354],3:[2.047,2.0708],4:[2.0705,2.0354],5:[2.094,2],6:[2.0705,1.9646],7:[2.047,1.9292],8:[2.0235,1.9646]};
/* 42002 barrel-end hook, 42003 fusee-end hook (point 19 only on 42003) */
const t02={1:[2,2],2:[2.0209,2.0341],3:[2.0644,1.2854],4:[2.2764,2.0048],5:[2.275,2],6:[2.2778,1.9958],7:[2.2222,2.079],8:[2.2222,1.979],9:[2.1811,1.979],10:[2.1811,1.956],11:[2.1586,1.961],12:[2.0998,1.9742],13:[2.1482,1.9383],14:[2.0879,1.9829],15:[2.0685,1.9105],16:[2.1098,1.9667],17:[2.0974,1.9864],18:[2.0293,1.9727],19:[2.1029,2.0344]};
/* 42009's hole table (holes 1-12; 1 the wheel's centre) */
const t09={1:[2,2],2:[2.2133,2.3848],3:[2.3063,2.28],4:[2.4076,2.078],5:[2.616,2],6:[2.4076,1.922],7:[1.7867,1.6152],8:[1.6937,1.72],9:[1.5924,1.922],10:[1.5924,2.078],11:[2.09,2.33],12:[1.91,1.67]};
const hole=(t,i,d)=>({n:i,c:hrow(t,i),d:I(d)});
return {
 I,
 /* ---- 42073-2-01 fourth wheel, brass, 24K gold plate wheel only; five spokes; riveted on the pinion (42072) ---- */
 w4:{z:75/* #1 */,m:0.28/* #2 module mm, as written */,od:I(.8566)/* #4 +.0010/-.0020 */,rimId:I(.700)/* #5 */,hubD:I(.290)/* #6 */,spokeRim:I(.037)/* #7 sure: the spoke tapers, .037 at the rim */,spokeHub:I(.048)/* #8 .048 at the hub */,
  gapUp:75/* #9 deg, spoke centre lines from the horizontal spoke, upper */,gapDn:72/* #10 lower; the two spokes of the undrawn half are not dimensioned */,t:I(.035)/* #11 +0/-.002 */,hubUp:I(.100)/* #12: the collar's diameter through the wheel's bore, not a height (re-read 1 November 2026) */,runout:I(.001)/* #14 */,
  gapRest:(360-75-72)/3/* the 213 deg of the half the sheet doesn't draw, by symmetry: not dimensioned, unsure */,seatS:I(.285)/* the wheel's tip-side face, from the pinion's tip: it lies on the leaves' top face (.320) .035 thick with the collar (.040, .1000, the bore) through it .005 proud: the section in 42073's side view (likely; the sheet's .100 is the collar's diameter, not a length) */},
 /* ---- 42072-1-01 fourth pinion, drill rod, polish; z (top) y along the arbor from the top tip down ---- */
 p4:{leaves:10/* #1 */,m:0.28/* #2 */,pivTop:I(.0311)/* #3 +0/-.0002 */,pivTopLen:I(.060)/* #16 tip to the shoulder's start */,shTop:I(.0565)/* #4 +-.0003, unsure which stem diameter sits where */,stem:I(.0445)/* #5 +-.0005 */,stemAbove:I(.0583)/* #6 +-.0003 */,
  collarTop:I(.0990)/* #7 diameter of the top flat inside the chamfer, likely */,collar:I(.1000)/* #8 +-.0003 */,tip:I(.1290)/* #9 pinion over the leaf tips +.0005/-.0010 */,lowStem:I(.0445)/* #10 +-.0005 */,lowSh:I(.060)/* #11 diameter +-.002, likely */,pivLow:I(.0311)/* #12 */,pivTail:I(.0280)/* #13 +0/-.0005 */,cone:60/* #14, #15 deg */,len:I(.940)/* #17 */,
  atShTop:I(.060)/* #16 */,atPinEnd:I(.445)+I(.060)/* #18 .445 from the shoulder: .505 from the tip */,atLowSh:I(.520)+I(.060)/* #19 .580 from the tip */,atCollar:I(.300)/* #21: from the collar's top face to the lower shoulder's end, .280 from the tip */,atPinTop:I(.260)/* #20 from the leaves' top face (.320 from the tip) to the lower shoulder's end; NOT the leaves' length (.185) */,pivLowLen:I(.360)/* #22 */,
  st:{coneEnd:I(.060+.0104)/* the top shoulder's 60 deg cone, .0445 flat to .0565: (.0565-.0445)/2 at 30 deg to the axis (the 330 dpi crop of the sheet: the flat spans .043, the stem .058) */,stemAbove:I(.250)/* where .0583 begins above the collar: read off the sheet's drawn line, +-.005, unsure */,collarTop:I(.280)/* #19, #21: .580-.300 */,chamf:I(.009)/* the collar's top chamfer as drawn (the crop: 14 px of 1650 per inch), against the printed .0990 flat: unsure */,collarEnd:I(.320)/* the leaves' top face (#20) */,leavesEnd:I(.505)/* #18 */,lowCone:I(.580-.0134)/* the lower shoulder's cone: (.060-.0445)/2 at 30 deg */,lowEnd:I(.580)/* #19 */,tailStep:I(.900)/* .0311 to .0280 for the last .040: read off the sheet's drawing, unsure */}},
 /* ---- 42015-2-01 fusee wheel, brass, 24K gold plate; the section's axis horizontal, left face = the stepped recess side ---- */
 fw:{z:90/* #1 */,m:0.44/* #2 */,od:I(1.613)/* #3 +.001/-.002 */,root:I(1.460)/* #4 tooth ring starts +0/-.005 */,recess:I(1.400)/* #5 +-.002 */,disc:I(.740)/* #6 +0/-.005 */,stepA:I(.600)/* #7 +-.003, likely */,stepB:I(.470)/* #8 +-.005, likely */,stepC:I(.320)/* #9 likely */,boss:I(.2995)/* #10 +0/-.0003 */,bore:I(.2300)/* #11 +.0003/-0 */,t:I(.100)/* #12 +0/-.001, the rim land */,
  toothStep:I(.005)/* #13 tooth ring .005 below the rim land */,discStep:I(.005)/* #14 central disc .005 below the rim land */,bossLen:I(.150)/* #15 +0/-.002, from the left face */,web:I(.040)/* #16 +0/-.001 behind the left recess */,rimWeb:I(.045)/* #17 +0/-.002, the web inside the 1.400 recess */,stepD:I(.005)/* #18 between the .470 and .320 floors */,
  hole:{d:I(.053)/* #19 +-.001 */,r:I(.6100)/* #20 */},cornerBoth:'bore'/* #21 */,
  /* the left face's three-step recess, depths from the left face (the 200 dpi crop, +-.004, likely): .600 about .015, .470 .050 (the .005 step of #18 under the .320's .055), .320 .055; the web .040 (#16) behind it to the central disc's face .095 */
  dep600:I(.015),dep470:I(.050),dep320:I(.055),discFace:I(.095)/* #14 */},
 /* ---- 42022-2-01 fusee arbor, drill rod, polish; x along the arbor from the left (42018) end ---- */
 fa:{len:I(2.000)/* #1 */,toBody:I(.375)/* #2 +-.005 */,body:I(.875)/* #3 +-.001, from the body step to the shank's start */,right:I(.750)/* #4 +-.005 */,bearL:I(.260)/* #5 +-.002 */,bodyLeft:I(.360)/* #6 +-.001, body step to the collar's right face */,holeToCollar:I(.310)/* #7 +-.001 from the cross hole to the collar's right face */,collarT:I(.045)/* #8 +-.001 */,gap:I(.060)/* #9 */,knurlW:I(.080)/* #10 */,shank:I(.410)/* #11 +-.005 */,square:I(.340)/* #12 */,chamf:I(.005)/* #13 at 45 deg */,
  bear:I(.1695)/* #14 +0/-.0003 both ends */,bodyS:I(.2295)/* #15 +0/-.0003 */,collarD:I(.316)/* #16 +-.001 */,bodyL:I(.2500)/* #17 +-.0002, knurled */,sqAF:I(.110)/* #18 +.004/-0 across flats */,shankD:I(.145)/* #19 +.005/-0 */,pressBore:I(.0490)/* #20 part 42018; .0500 +-.0002 the recess */,cross:I(.036)/* #21 +0/-.001 taper pin 42020 */,knurlTeeth:100/* #22 per inch */,endChamf:I(.010)/* #23 at 45 deg, likely */,
  /* the lengths along the arbor from the pinion's end (inches, the sheet's own sums): 42018 to .115, the .1695 bearing to the body step at .375, the body to the collar's right face at .735 (the collar .690-.735), the plain gap to .795, the knurl to .875, the body on to 1.250 (= .375 + .875, #3), the shank to 1.660, the square to 2.000. The knurl following the gap and the body running on at .2295 after it: likely */
  at:{pin:I(.115),step:I(.375),collar0:I(.690),collar1:I(.735),knurl0:I(.795),knurl1:I(.875),shank:I(1.250),sq:I(1.660),end:I(2.000)}},
 /* ---- 42026-1-01 set-up ratchet, steel SAE 1095, nickel plate ---- */
 sr:{z:40/* #1 */,ramp:65/* #2 deg between the locking face and the ramp, likely */,od:I(.670)/* #3 +-.002 */,root:I(.621)/* #4 */,sqAF:I(.115)/* #5 +.001/-0 */,sqAC:I(.155)/* #6 minimum */,finishR:I(.220)/* #7 approx; unsure what #8 .235 dimensions */,offset:I(.030)/* #9 the locking face's line from the centre, likely */,t:I(.048)/* #10 +0/-.002 */},
 /* ---- 42013-1-01 winding ratchet, 1.00 carbon steel, harden, oxidize black ---- */
 wr:{z:40/* #1 */,od:I(.670)/* #2 +-.002 */,root:I(.621)/* #3 */,ramp:65/* #4 deg, likely */,offset:I(.030)/* #5 likely */,bore:I(.230)/* #6 +.001/-0 */,pitch:I(.440)/* #7 the two holes, centre to centre on the horizontal */,csk:I(.146)/* #8 +-.002, 45 deg */,hole:I(.077)/* #9 +-.001 */,t:I(.075)/* #10 +0/-.002 */,cskDepth:I(.060)/* #11 likely */},
 /* ---- 42009-2-01 sustaining ratchet wheel, brass, 24K gold plate; holes by the table ---- */
 sw:{z:120/* #1 */,ramp:60/* #1 deg, likely */,od:I(1.500)/* #2 +.003/-0 */,root:I(1.458)/* #3 */,offset:I(.040)/* #4 likely */,bore:I(.3000)/* #5 +.0003/-0 */,t:I(.050)/* #6 +0/-.002 */,
  holes:[hole(t09,2,.0400),hole(t09,7,.0400)/* #7 stud 42011 press fit, the winding pawls' pivots */,hole(t09,11,.080),hole(t09,12,.080)/* #8 +-.002 */,hole(t09,6,.0503),hole(t09,10,.0503)/* #9 +.0003/-0 pin 35794 */,hole(t09,3,.048),hole(t09,4,.048),hole(t09,8,.048),hole(t09,9,.048)/* #10 +0/-.001, .090 countersunk 45 deg */,hole(t09,5,.060)/* #11 +-.001 at r .616, likely: the sustaining spring's pin */],csk:I(.090)/* #10 */,endshake:I(.002)/* #7 approx */},
 /* ---- 42010-1-01 winding pawl, 1.00 carbon steel, thickness .050 +0/-.002, hole .042 +0/-.001, countersunk .080 ---- */
 wp:{t:I(.050),hole:I(.042),csk:I(.080),boss:I(.0500)/* #2 */,
  outline:[hA(t10,1,.0500,7,2,false,true)/* #2 */,hA(t10,3,.1800,2,4,true,false)/* #3 tangent to the boss at row 2 */,hL(t10,4,5)/* #5 */,hA(t10,6,.3500,5,7,true)/* #4 */]},
 /* ---- 42007-2-01 winding pawl spring, beryllium copper, 24K gold plate, .050 +0/-.002 thick ---- */
 wps:{t:I(.050),blade:I(.015)/* #3 +-.001 */,pin:I(.0498)/* #10 part 35794 */,screw:I(.0440)/* #11 -130 */,
  holes:[{n:1,c:hrow(t07,1),d:I(.0498)},{n:16,c:hrow(t07,16),d:I(.0440)},{n:17,c:hrow(t07,17),d:I(.0440)}],
  outline:[hA(t07,3,.4700,8,9,false)/* #2 */,hA(t07,10,.0300,9,11,false)/* #9 tip */,hA(t07,12,.1500,11,13,true)/* #8 */,hA(t07,3,.4550,13,14,true)/* #3 */,hA(t07,15,.1500,14,2,true)/* #5 */,hA(t07,3,.3600,2,4,true)/* #4 */,hA(t07,5,.0100,4,6,false)/* #7 centre row 5 (the table's arithmetic) */,hA(t07,7,.1500,6,8,true)/* #5 */]},
 /* ---- 42016-2-01 sustaining spring, 1.00 carbon steel, oxidize black, .050 +0/-.002; centre row 5 (and 11) = the fusee wheel's axis ---- */
 ss:{t:I(.050),edge:I(.005)/* at 45 deg, bottom edge only */,rim:[I(.080),I(.070),I(.058)]/* upper left, right, lower right */,pin:I(.0500)/* #10 part 42017, press fit, in holes 1 and 9, on opposite faces */,hole13:I(.048)/* +-.001, plain */,
  holes:[{n:1,c:hrow(t16,1),pin:1},{n:9,c:hrow(t16,9),pin:1},{n:13,c:hrow(t16,13),d:I(.048)}],centre:hrow(t16,5),
  outline:[hA(t16,11,.7000,10,12,true)/* outer */,hA(t16,13,.0900,12,14,true)/* #7 */,hA(t16,15,.2500,14,16,false)/* #6 */,hA(t16,1,.0900,16,2,true)/* #5 */,hA(t16,3,.4000,2,4,false)/* #4 */,hA(t16,5,.6300,4,6,false)/* inner */,hA(t16,7,.3000,6,8,false)/* #8 */,hA(t16,9,.1000,8,10,true)/* #9 */]},
 /* ---- 42096-2-01 sustaining pawl, 1.00 carbon steel, polish contour; arbor 42097, spring wire 42098 ---- */
 sp:{t:I(.045)/* #6 +-.001 */,collar:I(.090)/* #7 likely */,springHole:I(.020)/* #8 taper broached; the hole's mark is row 2, likely */,holeAt:hrow(t96,2),
  outline:[hA(t96,4,.6000,3,5,false)/* #3 */,hL(t96,5,6)/* #5 likely a line */,hA(t96,7,.4200,6,8,true)/* #4 */,hA(t96,1,.0900,8,3,false)/* #2 */]},
 /* ---- 42168-2-01 barrel, cast yellow brass, 24K gold plate; axis along x in the section, floor at the left ---- */
 ba:{h:I(.700)/* #1 +-.002 */,lipH:I(.080)/* #2; the bottom of the section says .090 +0/-.005: unsure */,floor:I(.060)/* #3 +-.001 */,od:I(1.710)/* #4 +-.003 */,lipD:I(1.650)/* #5 +-.003 */,id:I(1.500)/* #6 +.002/-0 */,pitch:I(1.575)/* #7 */,screw:{z:5,d:I(.0340),tpi:130}/* #8 close fit */,bossH:I(.100)/* #9 +.002/-0 from the floor's outside face, likely */,bore:I(.2300)/* #10 +.0003/-0 */,
  coneOut:I(.320)/* #11 the chamfer's edge on the outer face, 30 deg to the face (60 deg to the axis), .025 deep: likely */,bossTop:I(.340)/* #11 the boss's flat inside, 45 deg cone: likely */,land:I(.010)/* #12 */,rivet:{d:I(.080),r:I(.520)/* #13 +-.010 */,x:I(.365)/* #15 axial, from the floor's outside face */},small:{d:I(.055)/* #14 +0/-.003 */,x:I(.140)/* axial, from the floor's outside face; at about 8 o'clock */}},
 /* ---- 42169-2-01 barrel cap, rolled yellow brass Scovill #187, 24K gold plate ---- */
 cp:{od:I(1.650)/* #1 +-.003 */,spigot:I(1.500)/* #2 +0/-.001 */,pitch:I(1.575)/* #3 */,t:I(.060)/* #4 +-.001 */,flangeT:I(.0360)/* #5 +-.0005; unsure what .058 spans */,bossH:I(.100)/* #6 +.001/-0, likely */,bore:I(.2300)/* #7 +.0003/-0 */,coneOut:I(.320),bossTop:I(.340)/* #8 as the barrel, likely */,cone:I(.025)/* #8 depth of the outer cone */,land:I(.010)},
 /* ---- 42170-2-01 barrel arbor, steel SAE "10120"; x from the left end; bosses and body corrected on the 1 Nov 2026 re-read ---- */
 bs:{len:I(1.59)/* #1 +-.01 */,sq:I(.410)/* #2 the square and its domed end */,sqAF:I(.110)/* +.004/-0 */,sqAC:I(.145)/* +.005/-0 */,piv:I(.1695)/* #3, #8 +0/-.0003 */,pivL:I(.130)/* #3 (to .540) */,bear:I(.2295)/* #4 +0/-.0003 */,bodyD:I(.520)/* #9 the spring collar, the coils' seat */,bodyL:I(.510)/* .530 less the two bosses */,boss:{d:I(.400),t:I(.010)}/* #6 at each end */,overBosses:I(.530)/* #6 +0/-.002 */,
  span720:I(.720)/* #6 +-.001, left boss face to the right bearing's end */,span870:I(.870)/* #5 +-.002 from .540 */,span1000:I(1.000)/* #5 +-.003 from .410 */,slot:{w:I(.120)/* #7 +-.002 */,farEdge:I(.325)/* from the left boss's outer face */},pivR:I(.180)/* #8 */,spiral:{r:I(1.00),step:I(.022),a:[30,45]}/* #9 unsure which number is which */},
 /* ---- 1-WD-265 mainspring inner terminal ---- */
 ms:{w:I(.590)/* #1 +-.001 */,endR:I(.250)/* #2 */,taper:I(1.25)/* #3 tip to full width; .500 wide at the round */,slotW:I(.200)/* #4 +-.003 */,slotAt:I(.200)/* #5 printed; .180 by hand, 6-7-43, the later */,slotL:I(.340)/* #6, square at the tip end, round R .100 at the far end */},
 /* ---- 42001-2-01 fusee chain: 297 spaces; odd spaces a pair of outer links (42246), even spaces one centre link; 298 pins ---- */
 ch:{pitch:I(.0940)/* #1 */,spaces:297,len:I(27.92)/* #1 +-.10 */,pins:298,centre:148,outer:298,hookMax:I(.030)/* #2 */},
 /* ---- 42002-1-01 barrel-end hook, 1.00 carbon steel, do not harden; thin end .0095, body .0200 ---- */
 hk2:{hole:I(.0250)/* +0/-.0005 */,tThin:I(.0095)/* +0/-.0005 */,tBody:I(.0200)/* +-.0005 */,step:I(.050)/* +.005/-0, pin centre to the step */,chamf:I(.003),
  outline:[hA(t02,3,.7500,2,4,false)/* upper edge */,hA(t02,5,.0050,4,6,false)/* tip */,hA(t02,7,.1000,6,8,false),hL(t02,8,9),hA(t02,10,.0230,9,11,true),hA(t02,12,.0603,11,13,false,true),hA(t02,14,.0750,13,15,false),hL(t02,15,16)/* likely */,hA(t02,12,.0125,16,17,true),hL(t02,17,18)/* likely */,hA(t02,1,.0400,18,2,false)]},
 /* ---- 42003-1-01 fusee-end hook: 42002's with the tail removed at point 19 (the belly as 42002's, likely) ---- */
 hk3:{outline:[hA(t02,3,.7500,2,19,false),hA(t02,12,.0603,19,13,false,true),hA(t02,14,.0750,13,15,false),hL(t02,15,16),hA(t02,12,.0125,16,17,true),hL(t02,17,18),hA(t02,1,.0400,18,2,false)]},
 /* ---- 42004-1-01 link pin, drill rod: .0240 +-.0003 x .045 +.001/-0 ---- */
 pn:{d:I(.0240),len:I(.045)},
 /* ---- 42005-1-01 centre link, 1.00 carbon steel: .0095 +0/-.0005 thick, holes .0250 +0/-.0005 at the .0940 pitch, four .0425 R arcs, all tangent ---- */
 cl:{t:I(.0095),hole:I(.0250),pitch:I(.0940),R:I(.0425),holes:[hrow(t05,1),hrow(t05,5)],
  outline:[hA(t05,3,.0425,2,4,true,true),hA(t05,5,.0425,4,6,false,true),hA(t05,7,.0425,6,8,true,true),hA(t05,1,.0425,8,2,false,true)]},
 /* ---- 42087 detent blank (-2-51A, operation 61) and its milling and grinding (-1-52): x from the foot end, y from the bottom edge; the finished 42087-3-01 is not in the set ---- */
 dt:{len:I(1.355)/* #1 +-.002 */,w:I(.140)/* #2 +.002/-0, milled to .131 by 42087-1-52 #3 */,t:I(.045)/* #3 +-.001, ground to .041 +0/-.001 by 42087-1-52 #2 */,wFin:I(.131),tFin:I(.041),
  hole:{d:I(.0501)/* #4 +.0002/-0 */,x:I(.070)/* #5 +.002/-0 */,y:I(.070)/* #6 +.001/-0 */},slot:{l:I(.082),w:I(.052)/* #7 +0/-.001 */,x:I(.3947)/* #9 +.0002/-0 centre from the foot end */,y:I(.070)},
  window:{x0:I(.6052),x1:I(.7482),l:I(.143)/* #11 +.001/-0 */,h:I(.0360)/* +.0005/-0 */,top:I(.072)/* +.001/-0 below the top edge */},
  topNotch:{x0:I(.7882),x1:I(1.2482)/* the .040 after the window, #12; the .260 and #15's .1750 steps */,floor:I(.064)/* +.002/-0 above the bottom edge */,bump:{x0:I(1.0082),x1:I(1.0732),h:I(.079)/* #14 +-.001 as printed; the scale reads .075: unsure */}},
  botCuts:[{x0:I(.8432),x1:I(1.0082),depth:I(.026)/* #18 likely: the .038 web */},{x0:I(1.0732),x1:I(1.1882),depth:I(.026)/* #20 likely */}],
  endLand:I(.107)/* #16 +.002/-0 */,endSlot:{w:I(.0500)/* #17 +.0002/-0 */,floorX:I(1.2932)/* from the .8985 */}}
};})();
