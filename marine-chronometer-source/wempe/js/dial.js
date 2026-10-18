// @ts-check
/* dial.js: the Wempe Einheits-Chronometer's dial, motion work, hands and up-and-down work (drawing group 05 02), built from their sheets
   (References/wempe/transcriptions/05-05-05-02-train-motionwork.md, checked on the sheets themselves, cropped and enlarged where a number mattered): the cannon tube
   (Minutenrohr 05 05 03-3) with its pinion on the centre arbor's 1:80 shank, the change wheel (Wechselrad kompl. 05 02 02) on the short stud at hole 19, the hour wheel
   (Stundenrad kompl. 05 02 03), the up-and-down wheel (Auf u. Abrad kompl. 05 02 04) on the long stud at hole 2 and its pinion (Auf u. Abtrieb 05 02 00-5) on the fusee
   arbor at hole 10, the four hands (05 02 00-1, -2, -3, 05 02 01-1 with its collet 05 02 01-2), the dial (Zifferblatt 05 02 00-4) with its printing, screws and pin. The studs and their
   bushes are the train's (train.js). The hand setting (Zeigerstellung, 05 33), the balance holding device (Unruhhaltevorrichtung, 05 36) and the seconds contact (05 38)
   are not built (below, and README).
   Part of the Wempe model (three.js r128). Declares only WDIAL: WDIAL.build(mv, M, K) adds the parts to the movement group (K: KIT.parts' makers; the frame and the train
   already built) and returns {update, R}: update(s, ang) turns them from the train's angles (ang: train.js's {c, s}, and the fusee's f when the fusee group gives it) and
   the wind (s.n, fusee turns from full wind, the Hamilton's MoveState); WDIAL.face(K) draws the
   dial's printing on a canvas (as core.js's dialCanvas draws the Hamilton's): Wempe 3955's, its glyphs traced into dialface.js (WDIALFACE, loaded before this file), or,
   WDIAL.face(K, 'lange'), Lange 5177's (dialface_lange.js, WDIALFACE_LANGE); R.setDial(d) shows one or the other (app.js's Variants).
   Units mm, the movement frame (dims.js): dial side +y, 12 o'clock -z, 3 o'clock +x. Heights (y) from the pillar plate's dial face (PPT, 3.35 over its inner face).
   Every turning group's rotation.y is its angle in the movement's frame (rotation.y falling: clockwise seen from the dial). */
const WDIAL=(()=>{
  const H=WD.H,PPT=WD.PP_T,V2=(a,b)=>new THREE.Vector2(a,b),{ring,solidGeo,clipPoly,area}=KIT;
    const C=(p,r,n=0)=>ring(p[0],p[1],r,n);
  /* a dial angle (deg clockwise from 12, seen from the dial) at radius r about plan point c, to a plan point */
  const at=(a,r,c=[0,0])=>[c[0]+r*Math.sin(a*D2R),c[1]-r*Math.cos(a*D2R)];
  /* a turned solid from a closed [r, y] profile (the first point not repeated), wound so it faces out (as escapement.js's lathe) */
  const lathe=(pr,seg=48)=>{let q=[...pr,pr[0]];if(area(q)<0)q=q.slice().reverse();return new THREE.LatheGeometry(q.map(([r,y])=>V2(r,y)),seg);};
  const{teeth,gear}=WTRAIN;

  /* ================= heights ================= */
  /* the dial on the movement ring's recess floor: 7 −0.1 over the seat's floor, where the pillar plate's dial face lies (05 08 00-3, drawn 7.0 as frame.js; 05 02_1's
     "7" from the plate to the dial: sure), Ø 103.6 −0.1 × 1.3 (05 02 00-4: the brass "Messingblech 1,3", its 1,3 struck to 1,2 in pencil, then "Eisenblech 1,3 gebondert", iron
     sheet 1.3 bonderised, lettered under the blank's "Rohmaß 1,3 × 110 × 110" as the last revision: the pencilled 1.2 was the brass dial's, which the iron one replaced
     (likely; read on the sheet 15 October 2026); 05 02_1 draws it 1.3, which puts the up-and-down hand's flange 0.2 over it, 05 02_1's "0,2") */
  const DY0=PPT+7.0,DT=1.3,DY1=DY0+DT,DR=103.55/2;
  /* the glass's underside, 17.0 over the plate's dial face (05 02_1's "15,8", corrected in pencil to "17,0": unsure): the case (05 01) is a later phase; nothing here
     stands within 1 mm of it */
  const GLASS=PPT+17.0;
  /* the centre arbor (train.js, 05 05 03-2): its journal "C" ends 23.03 over its train-side shoulder, where the cannon tube's foot sits (05 05 03: the tube's pinion block
     from the C shoulder to 25.4 from the lower shoulder, its square to 14.3 over C); the shank Ø 1.8 at C tapers 1:80 */
  const CW=WTRAIN.A.cw,yC=CW.ys+23.03,rSh=y=>(1.8-(y-yC)/80)/2;

  /* ================= the motion work (05 02_1, Zeigerwerk, Auf u. Ab gesamt, 28.3.41, 5:1; and the parts' sheets) =================
     The centre distances: Wechselrad–Minuten 12,6 and Auf u. Ab–Schnecke 18,4 (05 02_1): the tables put hole 19 12.600 from hole 1 and hole 2 18.400 from hole 10 (sure).
     Tooth counts: the change wheel 56 (05 02 02-1) and hour wheel 54 (05 02 03-1), the up-and-down wheel 120 (05 02 04-1). The pinions' counts are on no sheet:
     the cannon pinion 14 (2 × 12.6 − 20.16 = 5.04 = 14 × 0.36, the change wheel's module; the tube's pinion block on 05 05 03 scales Ø 5.86, a 14-leaf pinion's tip
     for m 0.36, where 12 or 16 leaves would scale 5.1 or 6.6), the change pinion 18 (2 × 12.6 − 18.90 = 6.30 = 18 × 0.35, the hour wheel's module), the up-and-down
     pinion 12 (2 × 18.4 − 33.454 = 3.346 = 12 × 0.2788): the transcription's inferences, confirmed (no other count fits the centres; 56/14 × 54/18 = 12).
     The pinions' tips and roots: the cannon pinion's tip scaled on its sheet (Ø 5.86), its root as the centre pinion's sheet gives its (05 05 03-2: 2.13 m under the
     pitch circle), as train.js estimates its pinions'; the change and up-and-down pinions' measured on Wempe 3955's dial side (3_Wempe_3955_uZ.jpg, 8.41 px/mm by the
     plates' Ø 85; the change pinion's pipe there 3.1 against the sheet's 3.05): likely. Heights from the parts' sheets, each foot on its bush or pinion (below). */
  const PIN=(z,m,D,dg)=>teeth(z,m,D??m*z+1.588*m,dg??m*z-4.26*m);
  const M_CH=20.16/56,M_HR=18.90/54,M_UD=33.454/120;
  /* the cannon tube (Minutenrohr 05 05 03-3, steel: blue in the coloured section): its pinion, a block 2.4 high on the C shoulder (05 05 03: 25.4 − 23), drawn
     Ø 5.86 at 5:1 (16.9 px/mm), 14 leaves m 0.36; the tube Ø 3.6 (scaled 3.65) to 10.8 −0.1 over C, a groove r 0.4 round it at 6.3 for the centre punch that holds it
     on the shank ("Körner", into the shank's groove there: train.js), then the square 2.6 □ r6 for the minute hand to 14.3, flush with the shank's end: every height from
     05 05 03 (sure); the square's corners turned to Ø 3.45 (a 2.6 square's corners, Ø 3.68, would stand out of the Ø 3.6 tube): Wempe 3955's dial side (1_Wempe_3955_Z.jpg, 9.14 px/mm by its minute track: the sides 2.60-2.67, the half-diagonals 1.72-1.77; 3_Wempe_3955_uZ.jpg the same, 0.652 of the side), ±0.1, likely (Ø 3.2 until 18 October 2026, estimated). Its top crowned with the shank's
     end on one sphere (05 05 03 draws one arc across both, rising 0.35 over the 2.86 it shows: r 3.1, train.js's A.cw.crown; likely; until 15 October 2026 flat), 14.3 at
     the crown. Bored on the shank's 1:80 taper, drawn 0.01 clear of it (the crown's last 0.6 bored straight, 0.002 more: the sphere
     reaches the square's corners 0.55 under the top, so the crown's cells start 0.6 under it; 0.5 until 18 October 2026, with the corners at Ø 3.2) */
  const CN={y0:yC,y1:yC+2.4,yb:yC+10.8,yt:yC+14.3,yg:yC+6.3,r:3.6/2,sq:2.6/2,sqR:3.45/2,pin:PIN(14,M_CH,5.86),cr:CW.crown,yk:yC+14.3-0.6};
  /* the change wheel (Wechselrad kompl. 05 02 02): the pipe (Wechselbutzen 05 02 02-2) 7 −0.1 overall, drawn 6.9, its foot on the stud bush's face (05 08 02-2, flush
     with the plate's dial face), so its top lies 0.1 under the dial (05 02_1 draws "0,2 Luft" there, with the plates then 3.9): Ø 3.05 −0.04, its foot 0.9 +0.2 (drawn
     1.0) under the wheel; the wheel (05 02 02-1, Messingblech 1,2 Ms 58 federhart, finished 1.0) on a seat Ø 4.2 (its hole), riveted, a collar Ø 5.5 × 0.6 over it
     (scaled at 5:1, 17.9 px/mm); the pinion (Wechseltrieb 05 02 02-3, brass: yellow in the coloured section) knocked on to a press fit, 2.5 long (05 02_1; 05 02 02
     scales 2.6), its lower face on the collar, 4.3 +0.1 under the pipe's top (05 02 02: drawn 4.35); the pipe bored to run on the short stud (05 02 00-7, Ø 1.5, train.js), 0.01 clear: Ø 1.52 (05 02 02 scales the bore 1.50-1.54 against its
     figured 3.05: until 15 October 2026 1.32, on the studs' 1.3).
     The wheel: z 56, m 0.36, tip 21.05 (pencil: "21,30" struck), root 19.03, tooth 0.555 on the pitch circle (pencil "Zahnstärke 0,55–0,56": the printed f 0.52 struck
     with the tip), a plain disc (05 02 02-1). The pinion: 18 leaves, cut as a small wheel, its leaves about half the pitch with round ends, tip Ø 6.9 and root Ø 5.4 on
     Wempe 3955 (05 02 02 scales 7.3 for its outside, which would touch the hour wheel's roots); drawn with the wheels' cycloidal form, 0.55 on the pitch circle */
  const CHW={y0:PPT,yw0:PPT+1.0,yw1:PPT+2.0,yc:PPT+2.6,yp1:PPT+5.1,yt:PPT+6.9,r:3.05/2,rs:4.2/2,rc:5.5/2,rb:1.52/2,
    wheel:teeth(56,M_CH,21.05,19.03,14,0.555),pin:teeth(18,M_HR,6.9,5.4,54,0.55)};
  /* the hour wheel (Stundenrad kompl. 05 02 03): the pipe (Stundenbutzen 05 02 03-2, brass) 8.2 −0.1 overall from the wheel's lower face, flush with it, the hand's seat
     Ø 4.4 r6 at 1:70 at its top; the wheel (05 02 03-1, Messingblech 1,2 Ms 58 federhart; 1 −0.1 on 05 02 03, "1,05 −0,03 gedreht" in pencil on 05 02 03-1: drawn 1.0) riveted
     on its foot, which runs on the cannon tube (bore scaled Ø 3.5 at 5:1: drawn 0.01 over the tube's 3.6), the wheel down on the cannon pinion's top. Its collar Ø 8.0 (scaled
     at 5:1, 17.1 px/mm, 7.9; on 05 02 03, 1940, 7.95-8.2; Wempe 3955's dial side, 3_Wempe_3955_uZ.jpg at 8.45 px/mm, 8.01, rms 0.03: likely; 7.9 until 18 October 2026) runs up to 0.3 under the dial (05 02_1's "0,3") with the wheel down: 3.585 over the wheel's lower face, where 05 02 03 gives 5.2 −0.1. The sheet's 5.2 would put
     the collar 1.4 into the dial, whose hole is Ø 6.0 (05 02 00-4, 05 02_1, Lange's 1453/A): with the cannon pinion on 05 05 03's tube (1943) there is no room for it.
     The coloured section draws the collar to the dial's underside, 3.75 over the wheel's (pictorial). So the collar is fitted, the overall 8.2 kept: the pipe ends 0.2
     under the tube's square, as it must (README, Estimated). The wheel: z 54, m 0.35, tip 19.7 (pencil; "20,0" struck), root 17.89, tooth 0.5, a plain disc */
  const HRW={y0:CN.y1+0.15,r:3.62/2,rs:6.0/2,rc:8.0/2,rh:4.4/2,wheel:teeth(54,M_HR,19.7,17.89,18,0.5)};
  HRW.yw1=HRW.y0+1.0;HRW.yc=HRW.y0+(DY0-0.3-CN.y1);HRW.yt=HRW.y0+8.2;   /* drawn in the middle of its 0.3 of play between the cannon pinion and the dial (as the train's arbors in their endshake) */
  /* the up-and-down wheel (Auf u. Abrad kompl. 05 02 04): the pipe (05 02 04-2, brass) on the long stud (05 02 00-6, train.js), its foot on the stud bush's face: Ø 3.4
     (scaled) to 5.2 under the wheel, the wheel's seat Ø 5.2 (its hole, H7), a riveted flange Ø 7.7 × 0.7 over it (scaled 7.4 on 05 02 04; Wempe 3955's, 3_Wempe_3955_uZ.jpg at 8.45 px/mm, 7.71, ±0.15: likely; 7.4 until 18 October 2026), a step Ø 2.8 (scaled) to 2.8 over the wheel and
     the hand's seat Ø 2.2 r6, 1.4 long, on top (05 02 04: every height, sure); its top then lies 0.05 over the stud's end, as 05 08 02's 12.3 puts it (sure), and the wheel 0.8
     under the dial (05 02_1's "0,8": likely). The wheel (05 02 04-1, Messingblech 1,2 Ms 58 federhart, Radstärke 1.0): z 120, m 0.2788 (d 33.454), tip 34.33, root 32.57,
     tooth 0.40, five spokes 1.7 −0.2 wide, hub 10.5 −0.2, rim's inside 28.2 +0.2, hole 5.2 H7. The pipe bored Ø 1.52 to run on the stud's 1.5 (05 02 04 scales its bore
     1.53-1.56 against the pipe's figured 3.4: until 15 October 2026 1.32) */
  const UDW={y0:PPT,yw0:PPT+5.2,yw1:PPT+6.2,yf:PPT+6.9,ys:PPT+7.6,yt:PPT+9.0,r:3.4/2,rs:5.2/2,rf:7.7/2,rst:2.8/2,rh:2.2/2,rb:1.52/2,wheel:teeth(120,M_UD,34.33,32.57,12,0.40)};
  /* its pinion (Auf u. Abtrieb 05 02 00-5 in the coloured section; no sheet): on the fusee arbor's end stub Ø 1.6 at hole 10 ("1,6 Festsitz", 05 02_1; 05 06 04-1's
     stub 1.6), 3 long, its top 0.3 under the dial (05 02_1: "3", "0,3", likely); 12 leaves of the wheel's module, steel, long and narrow, tip Ø 4.2 and root Ø 2.6 on Wempe
     3955 (the coloured section colours it yellow; the photograph shows steel), drawn tip 4.0 and root 2.4: the wheel's roots and tips (Ø 32.57, 34.33 at 18.4) leave
     no more. The fusee arbor is the fusee group's */
  const UDP={y1:DY0-0.3,y0:DY0-3.3,rb:1.6/2,pin:PIN(12,M_UD,4.0,2.4)};

  /* ================= the hands (05 02 00-1, -2, -3, 05 02 01-1) =================
     Every outline is a blade of half-widths hw(r) along the hand (r from the arbor), at the sheets' figures where they give them and between them as traced on the sheets'
     plans (2:1: 7.28, 6.77 and 9.7 px/mm by the hands' own lengths): the outermost of the outline's two lines in each column, less its stroke, scaled to meet the sheet's
     widths at its stations; and a thickness t(r) from the side views' figures, the underside flat ("Schnitt A-B": flat under, rounded over; the rounding across isn't drawn).
     Heights: the hands as last revised. The seconds arbor's post ends 9.2 over its shoulder (05 05 01-2, 1946; 05 05 01 of 1940 gave 7.2), 2.6 over the dial: the seconds
     hand rides at its top, so the hour hand's blade passes 0.1 over the post's end (the hour wheel's pipe, 8.2 overall, reaches there: 05 02 03); the minute hand 0.5 over the
     hour hand's boss, on the tube's square (05 02_1 at 5:1, 11.87 px/mm: 5.8 px between the minute hand's boss and the hour hand's top; its "1,2" there is the minute hand's
     own, its top to its flange's underside, as on 05 02 00-1: likely; until 15 October 2026 1.2, read as the gap, which with the hour hand's boss raised below would have put
     the minute hand's top over the tube's). 05 02_1 (1941) and the coloured section draw the hands 2 mm lower, the seconds hand lowest, on the shorter post of 1940 (README). */
  const hwAt=(T,r)=>{if(r<=T[0][0])return T[0][1];for(let i=1;i<T.length;i++)if(r<=T[i][0]){const[a,b]=[T[i-1],T[i]];return a[1]+(b[1]-a[1])*(r-a[0])/(b[0]-a[0]);}return T[T.length-1][1];};
  /* the minute hand (Minutenzeiger 05 02 00-1, 18.9.42, Goldin, polished): 46 to the tip, 1.2 wide at the boss, 2 at 13, 0.7 at 25, 1.7 at 36, 0.4 at the tip (sure);
     between them as traced (the two lobes peak at 12-14 and 31-35, the waist at 23-25). Boss: a flange Ø 6 and a collar Ø 4.2 under it, 2 overall, 1.2 from its top to
     the flange's underside (sure), the flange's top edge rounded r 0.4 (its side view at 7.24 px/mm: 3 px in and 3 px down at both ends: likely; until 15 October 2026
     square); the hole 2.6 □ H7 at 1:70 ("Kegel 1:70": sure): drawn 0.01 clear of the tube's square at the hand's top, widening 1:70 below (until 15 October 2026 straight).
     Blade 0.7 thick near the boss, 0.6 at about 37 (scaled), 0.4 at the tip, its underside flush with the flange's, its top 0.5 under the flange's (the side view: sure) */
  const MIN={L:46,hw:[[3.0,0.6],[5,0.66],[7,0.74],[9,0.87],[11,0.95],[13,1.0],[15,0.92],[17,0.73],[19,0.52],[21,0.42],[23,0.36],[25,0.35],[27,0.45],[29,0.61],[31,0.78],[33,0.85],
    [35,0.86],[36,0.85],[38,0.66],[40,0.45],[42,0.3],[44,0.24],[46,0.2]],t:[[3,0.7],[21,0.7],[37,0.6],[46,0.4]],y0:0,rf:3.0,rc:4.2/2};
  /* the hour hand (Stundenzeiger 05 02 00-2, 14.6.40, Goldin, high-gloss polished): 35 to the tip; 1.7 wide at the boss, 2.4 at 9, 0.8 at the neck 19.5, a ball Ø 5.2
     at 22.5 running out into the point, 0.6 at 30, 0.5 at the tip (sure); between them as traced (the ball's flanks fall from 2.6 at 22.5 to 0.4 at 30 in a long concave
     run, not a circle; toward the neck the ball is its circle r 2.6). Boss: a flange Ø 8.2 under its top, bevelled to Ø 6.8 (the plan's inner circle), 0.8 thick (likely); a pipe Ø 5 −0.2 under it, 3.1 overall (sure);
     the hole 4.4 H7 at 1:70. Blade 0.5 at the root, 0.6 / 0.4 / 0.7 / 0.6 / 0.3 at 14.6 / 19.4 / 20.8 / 30.0 / 34.6 (the side view's figures at their scaled places),
     its underside flush with the flange's and its top 0.3 under the flange's top at the root (the side view, 05 02 00-2 at 6.83 px/mm: the flange 282.5-288.3 px, 0.8, the
     blade's underside on 288 and its top on 285: sure; until 15 October 2026 its top flush with the flange's, the blade 0.3 high). Its hole 4.4 H7 at 1:70 ("Kegel 1:70"),
     drawn 0.01 clear of its seat's 1:70 (until 15 October 2026 straight) */
  const HOUR={L:35,hw:[[3.6,0.85],[5,0.92],[6.5,1.06],[8,1.18],[9,1.2],[10.5,1.15],[11.5,1.0],[12.7,0.88],[13.9,0.72],[15.1,0.6],[16.5,0.48],[18,0.42],[19.5,0.4],[19.93,0.4],[20.0,0.71],[20.2,1.21],
    [20.5,1.66],[21.0,2.12],[21.5,2.4],[22.0,2.55],[22.5,2.6],[23.3,2.55],[24,2.38],[24.6,2.18],[25.2,1.94],[25.8,1.67],[26.4,1.43],[27,1.19],[27.6,0.98],[28.2,0.78],[28.8,0.6],
    [29.4,0.44],[30,0.3],[31.5,0.28],[33,0.26],[35,0.25]],t:[[3.6,0.5],[14.6,0.6],[19.4,0.4],[20.8,0.7],[30,0.6],[34.6,0.3],[35,0.3]],rf:8.2/2,rf1:6.8/2,rp:4.8/2,rb:4.42/2};
  /* the up-and-down hand (Auf u. Abzeiger 05 02 00-3, 16.1.41, Bandstahl 0.6, hardened, polished, tempered blue): boss Ø 4.4, 1.4 overall, the flange 0.5 (sure), a pipe
     under it Ø 3.0 (the plan's middle circle, scaled), the hole 2.2 H7; the blade 0.9 wide at the boss (sure), the inked blade to 9.5 (sure), a fine tip beyond it 0.25
     wide (sure) to 10.2 from the centre (the sheet's plan isn't to scale there: measured on Wempe 3955's dial, 1_Wempe_3955_Z.jpg, 27.7 px/mm on the subdial's Ø 26: likely);
     0.5 thick at the boss, 0.3 at the tip (sure) */
  const UDH={hw:[[2.1,0.45],[9.5,0.17],[9.6,0.125],[10.2,0.125]],t:[[2.1,0.5],[10.2,0.3]],rf:4.4/2,rp:3.0/2,rb:2.22/2};
  /* the seconds hand (Sekundenzeiger 05 02 01-1, 14.6.40, Bandstahl 0.6, hardened, lapped, tempered blue): 19.5 to the tip, 0.6 wide at the boss, 0.2 at the tip; the tail
     10 to its end, an arm 0.3 wide to a drop 1.7 wide from 6.5 to 10, round toward the centre and pointed at its end (sure; its outline traced); the boss Ø 3.2, raised Ø 2.5
     (the side view's "2,5∅", 0.5 + 0.1: scaled), the hole 1.2 +0.05 (sure). Thickness 0.4 at the boss, 0.3 at the tip; the tail's arm 0.3, the drop 0.5 (sure) */
  const SEC={hwP:[[1.5,0.3],[19.5,0.1]],tP:[[1.5,0.4],[19.5,0.3]],hwT:[[1.5,0.15],[6.5,0.15],[6.55,0.35],[6.75,0.62],[7.0,0.78],[7.35,0.85],[8,0.64],[8.6,0.48],[9.2,0.3],[9.7,0.14],[10,0.02]],
    tT:[[1.5,0.3],[6.4,0.3],[6.6,0.5],[10,0.5]],rb:1.6,rr:2.5/2,rh:1.2/2};
  /* the hands' heights: the seconds hand's underside 1.9 over the dial, its boss's top 0.125 under the post's end (the post's end 14.275, train.js); the hour hand's blade
     0.125 over the post's end (its boss's top 15.2, 0.8 over the blade's underside: its pipe's foot then 0.45 over the dial; it sits 0.385 over its seat's top, its 1:70 hole
     on the 1:70 seat; until 15 October 2026 0.3 lower, with the blade's top flush with the boss's); the minute hand 0.5 over the hour hand's boss (its top then 0.665 under
     the tube's crown); the up-and-down hand down on its pipe's shoulder, its top flush with the seat's */
  const SW=WTRAIN.A.sw,ySp=SW.ys+33.25;   /* the seconds post's end (train.js's profile) */
  const YS0=ySp-0.725,YH1=ySp+0.925,YM0=YH1+0.5,YU1=UDW.yt;

  /* a blade from r0 to its tip along -z (the hand's 12 o'clock), its half-widths hw and thickness t over r, its underside at y0: solidGeo cells with a sloped top, one strip
     across the blade between each two stations, so its top's triangles each span one station's step (one cell, triangulated whole, joined points far apart along the two edges:
     long slivers tilted to either side, which shaded as a broken line down the hand and Edges inked). Its root a concave arc of radius r0 about the arbor, joining the boss
     (in the hand's group, so the overlap with the boss is the hand's own), in the first strip. rb: the boss's radius, a station; inside it the blade's underside is drawn
     0.02 up (and with tp its top 0.02 down, where the blade's top is the boss's), so the two solids' faces in the overlap aren't one plane (until 17 October 2026 they were:
     the boss's face and the blade's root flickered through each other) */
  function blade(hw,t,y0,r0,tip,dir=-1,n=0.25,rb=0,tp=false){const r1=Math.max(r0,hw[0][0]),R=[...new Set([...Array(Math.ceil((tip-r1)/n)).keys()].map(i=>r1+i*n).concat(hw.map(q=>q[0]).filter(r=>r>r1&&r<tip),rb>r1&&rb<tip?[rb]:[]).map(r=>+r.toFixed(4)))].sort((a,b)=>a-b).filter((r,i,A)=>!i||r-A[i-1]>0.01);   /* every 0.25 and at each of the table's radii */
    if(tip-R[R.length-1]<0.01)R.pop();R.push(tip);
    const w=r=>hwAt(hw,r),P=(s,r)=>[s*w(r),dir*r],a0=Math.asin(Math.min(0.99,w(r0)/r0)),arc=[];
    for(let k=1;k<8;k++){const a=-a0+2*a0*k/8;arc.push([r0*Math.sin(a),dir*r0*Math.cos(a)]);}
    const inB=p=>Math.hypot(p[0],p[1])<rb-1e-6,yb=p=>y0+(inB(p)?0.02:0),tf=p=>y0+hwAt(t,Math.hypot(p[0],p[1]))-(tp&&inB(p)?0.02:0),cells=[];
    for(let i=0;i+1<R.length;i++){const L=[P(-1,R[i]),P(-1,R[i+1]),P(1,R[i+1]),P(1,R[i]),...(i?[]:arc.slice().reverse())];cells.push({loop:area(L)>0?L:L.slice().reverse(),y0:rb?yb:y0,y1:tf});}
    return solidGeo(cells);}
  /* the minute hand's square hole and the tube's square: 2.6 across flats, the corners on a circle r (the tube's 1.6) */
  const sqLoop=(h,r,n=96)=>{let L=C([0,0],r,n);for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]])L=clipPoly(L,p=>h-(p[0]*a+p[1]*b));return L;};
  /* a crowned or rounded top over a hole: solidGeo's cells for the annuli between closed loops Ls (round the centre, the innermost round the hole first), y0 their flat
     underside and y1(p) their top; a cell with a feature has flat faces, so the annuli carry none. Each annulus is cut into a cell per step of one set of angles (every
     loop's points' angles, each loop met there by the ray from the centre, its own point where it has one), so the top's triangles are short and follow the round. Until
     17 October 2026 each annulus was cut in four: a quarter triangulated whole joined points far apart round it, slivers that shaded as a zigzag band round the minute
     hand's flange and as facets on the tube's crown */
  const sectors=(Ls,y0,y1)=>{Ls=Ls.map(L=>area(L)<0?L.slice().reverse():L);const ak=p=>(Math.atan2(p[1],p[0])+TAU)%TAU;
    let A=[...new Set(Ls.flat().map(p=>+ak(p).toFixed(9)))].sort((a,b)=>a-b).filter((a,i,X)=>!i||a-X[i-1]>1e-7);if(TAU-A[A.length-1]+A[0]<1e-7)A.pop();
    const hit=(L,a)=>{const c=Math.cos(a),s=Math.sin(a);let b=Infinity;for(let i=0;i<L.length;i++){const p=L[i],q=L[(i+1)%L.length],ex=q[0]-p[0],ez=q[1]-p[1],d=c*ez-s*ex;
      if(Math.abs(d)<1e-12)continue;const t=(p[0]*ez-p[1]*ex)/d,u=(p[0]*s-p[1]*c)/d;if(u>-1e-9&&u<1+1e-9&&t>0&&t<b)b=t;}return[b*c,b*s];};
    const R=Ls.map(L=>{const own=new Map(L.map(p=>[+ak(p).toFixed(9),p]));return A.map(a=>own.get(a)||hit(L,a));}),cells=[];
    for(let j=1;j<R.length;j++)for(let k=0;k<A.length;k++){const m=(k+1)%A.length,c=[R[j][k],R[j][m],R[j-1][m],R[j-1][k]];cells.push({loop:area(c)>0?c:c.slice().reverse(),y0,y1});}
    return cells;};

  /* ================= the balance holding device (Unruhhaltevorrichtung 127-556.06 / 36 00, 26.2.42, 5:1; Zangenteil 127-556.06-06 / 36 00 01-1, 29.8.41): not built =================
     Read and measured, kept for the record (README, Unresolved). Two tongs (Messingblech 1,2 Ms 58) on one pivot at hole 51, in the top plate's pocket (05 09 01's N-O,
     1.35 deep, 8 wide), their jaws round the balance staff at 23: the sheet's 15 ±0.05 from the hole to the jaw is the tables' 15.000 from 51 to 23 (sure). Each: boss Ø 6,
     hole 3 H7, thinned to 0.6 (the two stacked); 1.2 thick; the back tangent to the boss and to the jaw's outer arc r 4 about the jaw's centre; the inner arc r 3.5 about a
     point 0.6 off the line; the inner edge 0.2 off the line with a notch r 1 8 from the hole; 22 overall (sure). Closed, the two jaws leave an opening 5.8 across the line
     and 6.9 along it: the dotted ring Ø 5.85 that Schnitt A-B draws round the staff under the hub's flange, at the pocket's level (the 1941 staff's brass collar, 05 04_5).
     The lever (U 02, no sheet): 05 36's plan, put on the tables' holes 23, 51 and 52 by a reflected similarity to 0.08 mm (the inner face seen from below, S up), turns it
     on a screw at 52 under the plate (Schnitt A-B: 1.35 thick), 15.0 to the tongs' keyhole and 13.9 out past the rim to the push-button (U 03, in the case), a coil spring
     to the pin at hole 53; its travel 34°18'. With the balance and detent as last revised none of it fits: the 1946 hub (05 04 02) has a neck Ø 2.63 there, which the jaws
     (2.9-3.45 from the axis) never reach; their ring encircles the impulse roller's path (Ø 6.78, 1.8 under the plate), so the balance could not be lifted out past them;
     and the lever's arm runs through the detent block of 05 04 01-4 (8.7.43), screwed to the same face. The plate of 1943 keeps the pocket and holes 51-53, so a device was
     fitted, but not as 05 36 draws it. LV: the lever as drawn (plan, mm: its pivot, round end, spring pin and keyhole end) */
  const LV={P:H[52],E:[-29.897,35.080],S:[-25.781,30.235],K:[-15.767,9.976]};

  /* ================= the dial's printing: Wempe 3955's (1_Wempe_3955_Z.jpg), measured and traced by tools/dialtrace.py ================= */
  /* The layout is the sheet's (05 02 00-4, 2:1): the minute track Ø 85/90, the sub-dials at 23 over and under the centre (Ø 26 with its band Ø 15/18, 0 to 56 over 7 × 45°;
     Ø 37 with its track Ø 33 and the figures' ring Ø 23), the hours inside the track with the 6 left out, the name across the centre, the serial and the maker's anchor in
     the seconds sub-dial. The printing itself is the dial as made: the photograph square-on, put on the dial in mm by one homography that makes its six printed circles
     circles, the sub-dials' centres on the arbors at (0, ±23) (rms 12-17 µm; the scale is the arbors' 46 mm apart, so every size below is measured, not assumed).
     Etched 0.2 deep and filled black ("geätzt 0,2 tief, schwarz ausgelegt") on white (the sheet's "weiß lackiert" is struck through).
     Traced (dialface.js, WDIALFACE): every numeral, figure and letter, the serial (3955, the photograph's: the sheet draws 2367) and the anchor, as the photograph's
     contours: the hours a condensed heavy grotesque, its 1 a plain bar but in 12; the 7 and the 5 run under the seconds track; CHRONOMETERWERKE in outline capitals of a
     geometric face, WEMPE and HAMBURG solid in the same face. Two glyphs were partly under hands: the seconds 20's 0 is the 50's 0 (the same series, set at the same angle),
     the 8's top under the minute hand's shadow completed by an ellipse through its upper loop. The sheet's "Made in Germany" along the track at 7-5 isn't on this dial.
     Drawn here from the measured numbers (dialtrace.py --geo; each the half-way edges between paper and ink, which hold under the photo's blur, sigma 0.046):
     the tracks as a black band between their lines' outer edges with white boxes cut in it, each box's corners rounded as measured along their diagonals, the divisions
     straight-sided bars at their angles as measured (dialface.js: 0.06-0.08 deg off the nominal on the mean, sd 0.1, the printing's scatter) */
  const TC0=[0,0.067];   /* the minute track's centre: 0.067 under the arbors' midpoint (measured; the printing's own offset, kept) */
  const FT0={r0:42.534,r1:45.156,b0:42.911,b1:44.785,wm:0.421,wh:1.684,rc:0.185};   /* the minute track: its lines 42.534-42.911 and 44.785-45.156 (centres Ø 85.44 and 89.94: the
     sheet's 85 and 90, scaled 85.4 there); the minute divisions 0.421 (0.30-0.48), the hour blocks 1.684 (1.58-1.75) wide; the boxes' corners r 0.185 (the sheet: 0.3, 1.5) */
  const FS0={r0:16.346,r1:18.741,b0:16.709,b1:18.341,wm:0.392,wh:0.670,rc:0.168};   /* the seconds track: lines 16.346-16.709, 18.341-18.741 (Ø 33.06, 37.08: the sheet's 33, 37); a
     division each second 0.392 (0.27-0.56), each five 0.670 (0.55-0.73: the sheet's 0.2 and 0.5); corners r 0.168 */
  const F230=[11.309,11.703],FRL0=0.611;   /* the seconds sub-dial's inner circle (Ø 23.01: the sheet's 23) and its lines at 5, 15 ... 55 s, 0.611 wide (0.58-0.65), between it and the track */
  const FU0=[12.897,13.179];   /* the up-and-down sub-dial's circle (Ø 26.08: the sheet's 26) */
  const FB0={r0:7.410,r1:9.143,b0:7.780,b1:8.872,wd:0.40,we:0.35,rc:0.171,ro:0.2};   /* its band: lines 7.410-7.780 and 8.872-9.143 (Ø 15.19, 18.02: the sheet's 15, 18); the divisions
     at 8, 16 ... 48 h 0.40 (0.36-0.44), the ends at 0 and 56 0.35 (0.36, 0.32); the boxes' corners r 0.171, the band's outer corners at its open ends r 0.2 (0.24 with the blur) */
  /* Lange 5177's (1_Lange_5177_Z.jpg, the same photographer's square-on view of A. Lange & Söhne's Einheits-Chronometer No. 5177), measured the same way (dialtrace.py
     --dial lange --geo: its six circles' rms 14-20 µm, its blur sigma 0.024, half the Wempe's): the same layout to 0.1 mm (the sheet's), printed finer, every line about
     0.24 wide; the up-and-down circle open at the top, the band two thin lines whose end strokes run on inward past the inner line */
  const LANGE={TC:[0.003,0.068],   /* the minute track's centre, 0.068 under the arbors' midpoint (as Wempe 3955's 0.067) */
    FT:{r0:42.548,r1:45.027,b0:42.794,b1:44.788,wm:0.245,wh:1.437,rc:0.144},   /* the minute track: lines 42.548-42.794 and 44.788-45.027 (centres Ø 85.34, 89.82); the minute
       divisions 0.245 (0.19-0.30), the hour blocks 1.437 (1.32-1.50); corners r 0.144 */
    FS:{r0:16.376,r1:18.629,b0:16.610,b1:18.380,wm:0.238,wh:0.420,rc:0.131},   /* the seconds track: lines 16.376-16.610, 18.380-18.629 (Ø 32.99, 37.01); a division each second
       0.238 (0.20-0.30), each five 0.420 (0.31-0.46); corners r 0.131 */
    F23:[11.360,11.618],FRL:0.417,   /* the seconds sub-dial's inner circle (Ø 22.98) and its lines at 5, 15 ... 55 s, 0.417 wide (0.38-0.45; the 45's under the hand) */
    FU:[12.937,13.121],gap:[23.01,337.35],   /* the up-and-down circle (Ø 26.06), open at the top from 337.35 to 23.01 deg (its ends square, as they show), where Ab and Auf stand */
    FB:{r0:7.465,r1:9.088,b0:7.690,b1:8.897,wd:0.25,we:0.21,rc:0.172,ro:0,re:5.71}};   /* its band: lines 7.465-7.690 and 8.897-9.088 (Ø 15.16, 18.0); the divisions at 8 ... 48 h
       0.25 (0.23-0.28), the end strokes at 0 and 56 0.21 (0.21, 0.22), running on inward to r 5.71 (5.700, 5.714); the boxes' corners r 0.172; the outer corners at the ends sharp
       (as they show at 167 px/mm: not measured) */
  /* The Soviet 6MX's, Kirov No. 247's (dg-chrono-6mx/1_Kirow_247_Z.jpg, Altmeppen's square-on view; dialtrace.py --dial kirov --geo: its six circles' rms 10-25 µm, the
     drawings' diameters, 89.96, 84.91, 26.18, 37.13, 33.01, 22.79; blur sigma 0.031): the German layout to 0.1 mm, printed thin as Lange's, its up-and-down sub-dial laid out as
     Lange's (the circle open at the top, here for СПУСК and ЗАВОД; the band's end strokes running inward), the Russian words and the factory's mark traced, the serial written
     in red ink (#ff617f: the photo's red, 165, 59, 79 over its paper's 149, 146, 145, scaled to the model's paper) */
  const KIROV={TC:[-0.063,0.031],   /* the minute track's centre, 0.07 off the arbors' midpoint */
    FT:{r0:42.319,r1:45.128,b0:42.585,b1:44.835,wm:0.290,wh:1.423,rc:0.184},   /* the minute track: lines 42.319-42.585 and 44.835-45.128 (centres Ø 84.90, 89.96); the minute
       divisions 0.290 (0.24-0.37), the hour blocks 1.423 (1.37-1.56); corners r 0.184 */
    FS:{r0:16.357,r1:18.740,b0:16.641,b1:18.405,wm:0.333,wh:0.529,rc:0.156},   /* the seconds track: lines 16.357-16.641, 18.405-18.740 (Ø 33.00, 37.15); a division each second
       0.333 (0.24-0.41), each five 0.529 (0.45-0.61); corners r 0.156 */
    F23:[11.272,11.513],FRL:0.495,   /* the seconds sub-dial's inner circle (Ø 22.79) and its lines at 5, 15 ... 55 s, 0.495 wide (0.43-0.59) */
    FU:[12.988,13.189],gap:[22.58,338.32],   /* the up-and-down circle (Ø 26.18), open at the top from 338.32 to 22.58 deg */
    FB:{r0:7.477,r1:9.215,b0:7.723,b1:8.996,wd:0.306,we:0.265,rc:0.140,ro:0,re:5.33}};   /* its band: lines 7.477-7.723 and 8.996-9.215 (Ø 15.20, 18.21); the divisions at 8 ... 48 h
       0.306 (0.29-0.34), the end strokes at 0 and 56 0.265 (0.235, 0.294), running on inward to r 5.33 (5.345, 5.321); the boxes' corners r 0.140 */
  /* face(K, d): the dial's printing on a canvas, K times as fine; d the dial: 'wempe' (Wempe 3955's, dialface.js), 'lange' (Lange 5177's, dialface_lange.js) or 'kirov'
     (Kirov 247's, dialface_kirov.js) */
  function face(K=1,d='wempe'){const S=2048,cv=document.createElement('canvas');cv.width=cv.height=S*K;const x=cv.getContext('2d');x.scale(K,K);
    const KV=d==='kirov',L=d==='lange'||KV,Q=KV?KIROV:LANGE,{TC,FT,FS,F23,FRL,FU,FB}=L?Q:{TC:TC0,FT:FT0,FS:FS0,F23:F230,FRL:FRL0,FU:FU0,FB:FB0},GF=KV?WDIALFACE_KIROV:L?WDIALFACE_LANGE:WDIALFACE;
    const k=S/(2*DR),c=S/2,P=(mx,mz)=>[c+mx*k,c+mz*k];   /* mm on the dial (x right, z down: 12 at the top) to canvas px */
    x.fillStyle='#f2f0ea';x.fillRect(0,0,S,S);
    const ink='#141416',paper='#f2f0ea';x.lineJoin='round';
    /* a ring between r0 and r1 about q */
    const ring=(q,r0,r1)=>{const[px,py]=P(...q);x.beginPath();x.arc(px,py,r1*k,0,TAU);x.arc(px,py,r0*k,0,TAU,true);x.fillStyle=ink;x.fill();};
    /* a box about q between radii r0 and r1, its sides straight lines d0 and d1 mm off the radii at dial angles A0 < A1 (deg; d > 0 toward A1), corners rounded r: the
       shape inset by r, filled and stroked 2r wide with round joins */
    const box=(q,r0,r1,A0,d0,A1,d1,r,col)=>{const pts=[],side=(A,d,rr)=>A+Math.asin(d/rr)/D2R,arc=(rr,a0,a1)=>{const n=Math.max(2,Math.ceil(Math.abs(a1-a0)/1.5));for(let i=0;i<=n;i++)pts.push(P(...at(a0+(a1-a0)*i/n,rr,q)));};
      const ri=r0+r,ro=r1-r;arc(ro,side(A0,d0+r,ro),side(A1,d1-r,ro));arc(ri,side(A1,d1-r,ri),side(A0,d0+r,ri));
      x.beginPath();pts.forEach(([u,v],i)=>i?x.lineTo(u,v):x.moveTo(u,v));x.closePath();x.fillStyle=x.strokeStyle=col;x.fill();if(r>0){x.lineWidth=2*r*k;x.stroke();}};
    /* a railway: the band, then a white box between each two of its 60 divisions (the w(i)-wide division at the angle measured, dv: dialface.js's divm or divs) */
    const rail=(q,T,dv,w)=>{const A=dv.split(' ').map(v=>v/100);A.push(A[0]+360);ring(q,T.r0,T.r1);for(let i=0;i<60;i++)box(q,T.b0,T.b1,A[i],w(i)/2,A[i+1],-w((i+1)%60)/2,T.rc,paper);};
    /* the minute track */
    rail(TC,FT,GF.divm,i=>i%5?FT.wm:FT.wh);
    /* the up-and-down sub-dial: its circle, the band open at the top (its ends at 0 and 56 h, 22.5 deg either side of 12), a box for each 8 hours */
    const U=[0,-23],ua=h=>22.5+h/8*45;if(L)box(U,FU[0],FU[1],Q.gap[0],0,Q.gap[1],0,0,ink);else ring(U,FU[0],FU[1]);
    box(U,FB.r0,FB.r1,ua(0),-FB.we/2,ua(56),FB.we/2,FB.ro,ink);
    if(L)for(const h of[0,56])box(U,Q.FB.re,FB.r0+0.05,ua(h),-FB.we/2,ua(h),FB.we/2,0,ink);   /* Lange's and Kirov's end strokes, on inward past the inner line */
    for(let h=0;h<56;h+=8)box(U,FB.b0,FB.b1,ua(h),(h?FB.wd:FB.we)/2,ua(h+8),-(h+8<56?FB.wd:FB.we)/2,FB.rc,paper);
    /* the seconds sub-dial's inner circle and lines */
    const Sd=[0,23];ring(Sd,F23[0],F23[1]);for(let q=0;q<6;q++){const A=30+60*q;box(Sd,(F23[0]+F23[1])/2,(FS.r0+FS.b0)/2,A,-FRL/2,A,FRL/2,0,ink);}
    /* the traced glyphs (dialface.js): each item's contours filled even-odd */
    for(const[n,s]of Object.entries(GF)){if(n.startsWith('div'))continue;x.fillStyle=KV&&n==='serial'?'#ff617f':ink;const p=new Path2D();for(const cs of s.split('|')){const v=cs.split(' ').map(Number);let mx=v[0],mz=v[1],[u,w]=P(mx/100,mz/100);p.moveTo(u,w);
      for(let i=2;i<v.length;i+=2){mx+=v[i];mz+=v[i+1];[u,w]=P(mx/100,mz/100);p.lineTo(u,w);}p.closePath();}x.fill(p,'evenodd');}
    /* the seconds track, printed over the 7 and the 5 (its white boxes cut into them) */
    rail(Sd,FS,GF.divs,i=>i%5?FS.wm:FS.wh);
    return cv;}

  function build(mv,M,K){const{part,screw,loose}=K,tag=(o,id,s)=>hn(o,id,s?{sub:1}:undefined),R={};
    const S=(c,m,r,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:sc(c),metalness:m,roughness:r},o));
    const goldin=S(0xd9b25e,1,0.35);   /* Goldin, a gold-coloured brass, polished (the minute and hour hands' title blocks; Wempe 3955's, 1_Wempe_3955_Z.jpg); 0.35 rough so their flat blades,
       square to the viewer, show bright as the photographs' (photocompare.py; at 0.18 until 18 October 2026 they mirrored the page's dark sky and showed brown) */
    const paint=S(0xf2f0ea,0.3,0.4);   /* the dial's white ground (Wempe 3955's), glossy as its lacquer: metalness as the Hamilton's dial face, so it takes the room's light seen from the dial side */
    const grp=(par,p,ef)=>{const g=new THREE.Group();g.position.set(p[0],0,p[1]);par.add(g);return g;};

    /* ---------- the cannon tube on the centre arbor (turns with it) ---------- */
    const cnP=part('cannon',22),cn=grp(cnP,H[1]);R.cn=cn;
    {const rb=y=>rSh(y)+0.01,pm=tag(mesh(cn,gear(CN.pin,CN.y1-CN.y0,{bore:rb(CN.y0)}),M.steel,0,(CN.y0+CN.y1)/2,0),'050503-3');pm.userData.gear={z:14,m:M_CH};R.cnPin=pm;
      const g=[];for(let k=0;k<=10;k++){const t=Math.PI*k/10;g.push([CN.r-0.4*Math.sin(t),CN.yg-0.4*Math.cos(t)]);}   /* the groove, a half-round r 0.4 */
      tag(mesh(cn,lathe([[rb(CN.y1),CN.y1],[CN.r,CN.y1],...g,[CN.r,CN.yb],[rb(CN.yb),CN.yb]],48),M.steel),'050503-3',1);
      const sqL=sqLoop(CN.sq,CN.sqR),F=[{p:C([0,0],rb(CN.yb),48),q:C([0,0],rb(CN.yk),48),a:CN.yb,b:CN.yk}];
      tag(mesh(cn,solidGeo([{loop:sqL,y0:CN.yb,y1:CN.yk,F}]),M.steel),'050503-3',1);
      /* its crown, the square's last 0.5: the annuli from the bore out through circles 1.05 and 1.25 to the square (so the sphere is sampled across it) */
      const cr=p=>CN.yt-(CN.cr-Math.sqrt(CN.cr*CN.cr-p[0]*p[0]-p[1]*p[1]));
      tag(mesh(cn,solidGeo(sectors([C([0,0],rb(CN.yk),48),C([0,0],1.05,48),C([0,0],1.25,48),sqL],CN.yk,cr)),M.steel),'050503-3',1);}

    /* ---------- the change wheel on the short stud at 19 ---------- */
    const chP=part('changeWheel',20),ch=grp(chP,H[19]);R.ch=ch;
    {const c=CHW;tag(mesh(ch,lathe([[c.rb,c.y0],[c.r,c.y0],[c.r,c.yw0],[c.rs,c.yw0],[c.rs,c.yw1],[c.rc,c.yw1],[c.rc,c.yc],[c.r,c.yc],[c.r,c.yt],[c.rb,c.yt]],48),M.brass),'050202-2');
      const wm=tag(mesh(ch,gear(c.wheel,1.0,{bore:c.rs}),M.gilt,0,(c.yw0+c.yw1)/2,0),'050202-1');wm.userData.gear={z:56,m:M_CH};R.chW=wm;
      for(const[V,mt]of[['last first 1943',M.brass],['6mx',M.steel]]){const gv=new THREE.Group();gv.userData.rev=V;ch.add(gv);   /* the 6MX's steel (3_Kirow_247_uZ.jpg and Kirova 14100's, photocompare.py: sure) */
        const pm=tag(mesh(gv,gear(c.pin,c.yp1-c.yc,{bore:c.r}),mt,0,(c.yc+c.yp1)/2,0),'050202-3');pm.userData.gear={z:18,m:M_HR};if(V!=='6mx')R.chP=pm;else R.chP6=pm;}}

    /* ---------- the hour wheel on the cannon tube (turns a twelfth of it) ---------- */
    const hwP=part('hourWheel',26),hw=grp(hwP,H[1]);R.hw=hw;
    {const c=HRW;tag(mesh(hw,lathe([[c.r,c.y0],[c.rs,c.y0],[c.rs,c.yw1],[c.rc,c.yw1],[c.rc,c.yc],[c.rh+(c.yt-c.yc)/140,c.yc],[c.rh,c.yt],[c.r,c.yt]],64),M.brass),'050203-2');   /* the hand's seat on its 1:70, Ø 4.4 at its top (until 15 October 2026 straight) */
      const wm=tag(mesh(hw,gear(c.wheel,1.0,{bore:c.rs}),M.gilt,0,c.y0+0.5,0),'050203-1');wm.userData.gear={z:54,m:M_HR};R.hwW=wm;}

    /* ---------- the up-and-down wheel on the long stud at 2, and its pinion on the fusee arbor at 10 ---------- */
    const udP=part('udWheel',30),ud=grp(udP,H[2]);R.ud=ud;
    {const c=UDW,hub=lathe([[c.rb,c.y0],[c.r,c.y0],[c.r,c.yw0],[c.rs,c.yw0],[c.rs,c.yw1],[c.rf,c.yw1],[c.rf,c.yf],[c.rst,c.yf],[c.rst,c.ys],[c.rh,c.ys],[c.rh,c.yt],[c.rb,c.yt]],48);
      /* the Soviet 6MX's spokes taper, 1.82 at the hub to 1.18 at the rim (3_3_Auf-_und_Ab_rus.jpg, the wheel loose, rectified by its rim's inside fitted as an ellipse, Ø 28.2:
         the five spokes' widths read on circles r 8 to 13.6, their mean 1.62 to 1.22, a line through them; 3_Kirow_247_uZ.jpg in place the same: likely); the drawings' 1.6 straight */
      for(const[V,sp]of/** @type {[string,number[]][]} */([['last first 1943',[5,1.6,10.4/2,28.3/2]],['6mx',[5,1.82,10.4/2,28.3/2,1.18]]])){const gv=new THREE.Group();gv.userData.rev=V;ud.add(gv);tag(mesh(gv,hub,M.brass),'050204-2');   /* the hub in each version's group with its wheel (fine.py takes pieces fixed to each other by their shared group) */
        const wm=tag(mesh(gv,gear(c.wheel,1.0,{spokes:sp,bore:c.rs}),M.gilt,0,(c.yw0+c.yw1)/2,0),'050204-1');wm.userData.gear={z:120,m:M_UD};if(V==='6mx')R.udW6=wm;else R.udW=wm;}}
    const upP=part('udPinion',20),up=grp(upP,H[10]);R.up=up;
    {const pm=tag(mesh(up,gear(UDP.pin,UDP.y1-UDP.y0,{bore:UDP.rb}),M.steel,0,(UDP.y0+UDP.y1)/2,0),'050200-5');pm.userData.gear={z:12,m:M_UD};R.upP=pm;}

    /* the meshes phased under load (gearLash, core.js), the drivers turning as update() turns them: the cannon pinion (clockwise from the dial, -1) the change wheel, the
       change pinion (+1) the hour wheel; the fusee's pinion (+1: the fusee turns counterclockwise from the dial as it runs, driving the centre pinion) the up-and-down wheel */
    const ph=(A,pa,B,pb,s)=>{const[a,b]=gearLash(A,pa,B,pb,s);A.rotation.y=a;B.rotation.y=b;};
    ph(R.cnPin,H[1],R.chW,H[19],-1);ph(R.chP,H[19],R.hwW,H[1],1);ph(R.chP6,H[19],R.hwW,H[1],1);ph(R.upP,H[10],R.udW,H[2],1);ph(R.upP,H[10],R.udW6,H[2],1);

    /* ---------- the hands ---------- */
    const hdP=part('hands',56);
    /* the minute hand, on the tube's square (turns with the centre arbor) */
    const mh=grp(hdP,H[1]);R.mh=mh;
    {const y0=YM0,yf=y0+0.8,y1=y0+2.0,h0=CN.sq+0.01,sq=sqLoop(h0,CN.sqR+0.01),hole=y=>sq.map(p=>p.map(v=>v*(1+(y1-y)/140/h0)));   /* the square hole, widening 1:70 down from its top */
      tag(mesh(mh,solidGeo([{loop:C([0,0],MIN.rc,64),y0,y1:yf,F:[{p:hole(y0),q:hole(yf),a:y0,b:yf}]}]),goldin),'050200-1');
      /* the flange: flat inside Ø 5.2 round the square hole, and outside it a turned ring, its edge rounded r 0.4 (smooth: until 17 October 2026 annuli of solidGeo's
         cells, whose flat-shaded facets showed on the round and the rim); the ring's 72 sides fall on the flat part's 72 points */
      const r1=MIN.rf-0.4,rnd=[...Array(11).keys()].map(k=>{const a=(10-k)/10*Math.PI/2;return[r1+0.4*Math.sin(a),y1-0.4+0.4*Math.cos(a)];});
      tag(mesh(mh,solidGeo([{loop:C([0,0],r1,72),y0:yf,y1,F:[{p:hole(yf),q:hole(y1),a:yf,b:y1}]}]),goldin),'050200-1',1);
      tag(mesh(mh,lathe([[r1,yf],[MIN.rf,yf],...rnd],72),goldin),'050200-1',1);
      tag(mesh(mh,blade(MIN.hw,MIN.t,yf,MIN.rf-0.1,MIN.L,-1,0.25,MIN.rf),goldin),'050200-1',1);}
    /* the hour hand, on the hour wheel's pipe */
    const hh=grp(hdP,H[1]);R.hh=hh;
    {const y1=YH1,y0=y1-3.1,yf=y1-0.8,rb=y=>HRW.rh+(HRW.yt-y)/140+0.01;   /* its hole on the seat's 1:70, 0.01 clear */
      tag(mesh(hh,lathe([[rb(y0),y0],[HOUR.rp,y0],[HOUR.rp,yf],[HOUR.rf,yf],[HOUR.rf1,y1],[rb(y1),y1]],72),goldin),'050200-2');
      tag(mesh(hh,blade(HOUR.hw,HOUR.t,yf,HOUR.rf1,HOUR.L,-1,0.25,HOUR.rf),goldin),'050200-2',1);}
    /* the up-and-down hand, on its wheel's pipe */
    const uh=grp(hdP,H[2]);R.uh=uh;
    {const y1=YU1,yf=y1-0.5,y0=y1-1.4;
      tag(mesh(uh,lathe([[UDH.rb,y0],[UDH.rp,y0],[UDH.rp,yf],[UDH.rf,yf],[UDH.rf,y1],[UDH.rb,y1]],48),M.blued),'050200-3');
      tag(mesh(uh,blade(UDH.hw,UDH.t,yf,UDH.rf-0.1,10.2,-1,0.25,UDH.rf,true),M.blued),'050200-3',1);}
    /* the seconds hand on its collet (Zeigerfutter 05 02 01-2, brass, no sheet), pressed on the seconds post's 1:90 taper: Ø 1.5 (the coloured section's, 1.6 scaled,
       inside the dial's Ø 1.7 hole) and 4.6 long (scaled there, pictorial), its end Ø 1.2 through the hand (the hand's hole), flush with its top; bored on the post, 0.005 clear */
    const sh=grp(hdP,H[35]);R.sh=sh;
    {const y0=YS0,yb=y0+0.4,y1=yb+0.2,post=y=>(0.75-0.1*(y-SW.ys-24.05)/9.1)/2+0.005;
      tag(mesh(sh,lathe([[SEC.rh,y0],[SEC.rb,y0],[SEC.rb,yb],[SEC.rr,yb],[SEC.rr,y1],[SEC.rh,y1]],48),M.blued),'050201-1');
      tag(mesh(sh,blade(SEC.hwP,SEC.tP,y0,SEC.rb-0.1,19.5,-1,0.25,SEC.rb,true),M.blued),'050201-1',1);
      tag(mesh(sh,blade(SEC.hwT,SEC.tT,y0,SEC.rb-0.1,10,1,0.25,SEC.rb,true),M.blued),'050201-1',1);
      const yc=y0-4.0;tag(mesh(sh,lathe([[post(yc),yc],[0.75,yc],[0.75,y0],[SEC.rh,y0],[SEC.rh,y1],[post(y1),y1]],32),M.brass),'050201-2');}

    /* ---------- the dial (05 02 00-4) ---------- */
    const dlP=part('dial',40);
    /* its holes: the centre 6.0, the up-and-down 3.2, the seconds 1.7 (sure); on Ø 101 (scaled 50.5-50.7) five more: three for its screws at 354 deg (the sheet's 6°), 120 and
       240 (scaled 120.6 and 240.2; Altmeppen: German dials are screwed at the 20, 40 and 59 minute marks), each Ø 1.1 under a Ø 1.8 H7 sink 1.0 deep ("Senkung 1,0 tief"); the
       pin's Ø 1 at 6 deg (the sheet's 6°, where the ring's Ø 1.6 pin hole is, 05 08 00-3); a Ø 1 at 185.7 deg (scaled; nothing under it in the ring).
       The printing covers both small holes: neither Wempe 3955's dial (1_Wempe_3955_Z.jpg, 9.14 px/mm by its minute track: the three screws' sinks, about 16 px, resolved,
       nothing at 6 or 185.7 deg, where a Ø 1 would be 9 px) nor Lange 5177's (1_Lange_5177_Z.jpg) nor Kirov No. 247's (1_Kirow_247_Z.jpg) shows a hole there (sure): the
       disc is drilled as drawn, the pin's end and the empty hole under the paint (the face whole over them since 18 October 2026) */
    /* The Soviet 6MX (the Variants' third version) screws it at the 19, 39 and 59 minute marks (Altmeppen's list); Kirov No. 247's dial has its screws at 112.5, 233.6 and
       353.1 deg (1_Kirow_247_Z.jpg, ±1 for the view's tilt): 114, 234 and 354 deg. The disc, its printed face and its screws are built for each (rv) */
    const RH=50.5,PINa=at(6,RH),SMa=at(185.7,RH),rv=(par,v)=>{const g=new THREE.Group();g.userData.rev=v;par.add(g);return g;},FMS=[],TX={};
    for(const[V,AS]of/** @type {[string,number[]][]} */([['last first 1943',[354,120,240]],['6mx',[354,114,234]]])){const gV=rv(dlP,V),SCR=AS.map(a=>at(a,V==='6mx'?49.9:RH));   /* the 6MX's on r 49.9: all three of Kirov No. 247's 0.6 nearer the centre (1_Kirow_247_Z.jpg, photocompare.py's fit: likely) */
    const holes=[[0,0,3.0],[H[2][0],H[2][1],1.6],[H[35][0],H[35][1],0.85],...SCR.map(p=>[p[0],p[1],0.9])];   /* the printed face's: the two small holes under its paint (above) */
    {const F=[{p:C([0,0],3.0,72),a:DY0,b:DY1},{p:C(H[2],1.6,40),a:DY0,b:DY1},{p:C(H[35],0.85,32),a:DY0,b:DY1},{p:C(PINa,0.5,20),a:DY0,b:DY1},{p:C(SMa,0.5,20),a:DY0,b:DY1}];
      for(const p of SCR)F.push({p:C(p,0.55,20),a:DY0,b:DY1},{p:C(p,0.9,28),a:DY1-1.0,b:DY1});
      tag(mesh(gV,solidGeo([{loop:C([0,0],DR,720),y0:DY0,y1:DY1,F}]),paint),'050200-4');}
    /* the printed face: a surface 0.02 over the disc, holed as it is, its texture the canvas (face()) */
    {const s=new THREE.Shape();s.absarc(0,0,DR,0,TAU,false);for(const[hx,hz,hr]of holes){const p=new THREE.Path();p.absarc(hx,-hz,hr,0,TAU,true);s.holes.push(p);}
      const g=new THREE.ShapeGeometry(s,64),uv=g.attributes.uv,pos=g.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,(pos.getX(i)+DR)/(2*DR),(pos.getY(i)+DR)/(2*DR));g.rotateX(-Math.PI/2);
      const texOf=(/** @type {string} */d)=>{if(!TX[d]){const t=TX[d]=new THREE.CanvasTexture(face(1,d));t.encoding=THREE.sRGBEncoding;t.anisotropy=8;t.redraw=k=>face(k,d);}return TX[d];};
      const fm=mesh(gV,g,new THREE.MeshStandardMaterial({map:texOf('wempe'),metalness:0.3,roughness:0.4,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),0,DY1+0.02,0);
      Object.assign(fm.userData,{surface:true,noCap:true,R:DR,holes,hn:'050200-4',sub:1});R.face=R.face||fm;FMS.push(fm);
      /* R.setDial(d): the printing shown, 'wempe', 'lange' or 'kirov' (app.js's Variants), each texture drawn when first asked for: on the face's own material (the viewer may be
         showing a faded or coloured copy of it, which follows on its next look()) and on the copy shown, if another */
      R.setDial=(/** @type {string} */d)=>{const dd=d==='lange'||d==='kirov'?d:'wempe',t=texOf(dd);for(const f of FMS){const m=f.userData.mat0||f.material;for(const q of new Set([m,f.material]))if(q.map!==undefined&&q.map!==null){q.map=t;q.needsUpdate=true;}}R.dial=dd;};R.dial='wempe';
}
    /* its three screws (WN-10 by the coloured section's label, "10" or "18": likely): M1 through its Ø 1.1 holes into the ring's flange (tapped 2.5 deep there: frame.js), the
       heads Ø 1.7 × 0.8 in the sinks, 0.1 under the face (estimated); from the dial side, so in a frame turned over */
    {const rg=new THREE.Group();rg.rotation.x=Math.PI;gV.add(rg);for(const p of SCR)tag(screw(rg,p[0],-p[1],-(DY1-1.0),0.85,0.8,2.3,0.5,M.steel),'WN-10.d');}}
    /* its pin at 6 deg: Ø 1.1 in the ring's hole (05 08 00-3's "1,1 Ø"; Ø 1.6 until 15 October 2026, the ring's radial hole's figure) 3.7 deep, its top 0.3 under the
       flange's top, as the coloured section draws it (Wempe_Einheitschronometer.jpg px 86-97 × 594.7-639.3 at 9.37 px/mm: 3.69 in the ring, its top 0.26 under the
       flange's 592.3, through the dial to 0.26 short of its face; likely; 2.0 deep until 17 October 2026), stepped to the dial's Ø 1.0, 0.1 under its face (the step estimated) */
    tag(mesh(dlP,lathe([[0,DY0-3.7],[0.545,DY0-3.7],[0.545,DY0],[0.49,DY0],[0.49,DY1-0.1],[0,DY1-0.1]],20),M.steel,PINa[0],0,PINa[1]),'dialPin');

    /* update(s, ang): the motion work from the centre arbor's angle (ang.c): the change wheel turns back at 14/56 of it, the hour wheel on at 56/14 × 54/18 = 12 times
       slower; the seconds hand with the seconds arbor (ang.s); the up-and-down work from the fusee's turn f (ang.f, the fusee group's, rising as it runs down from full
       wind; without it s.n turns from full wind (the Hamilton's MoveState), 3.75 (24 hours, 05 06_20's "24 Std") if neither): the pinion with it, the wheel back at 12/120;
       the hand on the wheel reads the wind s.n, 0 at full wind (22.5 deg right of 12) and 56 h after 8.75 turns (7/8 of a turn, Lange's "7/8 Teilung"). The fusee group's
       ang.f is its rotation.y, RF0 + n turns (fusee.js: RF0 its angle fully wound, and a click's catch on top running), so the wheel, turned back a tenth of it, and the hand,
       read from n, keep their places on each other (the catch, at most a click tooth of the fusee, a tenth of that on the hand) */
    /* s.slip: the hands set (app.js, Set the hands), seconds of time the cannon pinion has slipped on the centre arbor, its friction fit; the motion work and both hands
       turn with it, the centre arbor and the train do not (the centre turns -TAU an hour, train.js) */
    const update=(/** @type {any} */s,/** @type {any} */ang)=>{const c=(ang.c||0)-(s.slip||0)*TAU/3600;
      cn.rotation.y=c;mh.rotation.y=c;ch.rotation.y=-c*14/56;hw.rotation.y=c/12;hh.rotation.y=c/12;sh.rotation.y=ang.s||0;
      const n=s.n!=null?s.n:3.75,f=ang.f!=null?ang.f:n*TAU;up.rotation.y=f;ud.rotation.y=-f/10;uh.rotation.y=-22.5*D2R-n*TAU/10;};
    return{update,R};}
  return{build,face,DY0,DY1,GLASS,LV,DR,HANDS:{MIN,HOUR,UDH,SEC}};   /* HANDS: the hands' outlines (half-widths along each), which the essay draws on the dial (js/essay.js) */
})();
