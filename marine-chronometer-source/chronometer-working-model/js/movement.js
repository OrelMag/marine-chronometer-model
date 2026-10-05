// @ts-check
/* movement.js: the Model 21 movement: photo-measured layout, Rawlings-based escapement, bridges, crescent cock, train, maintaining work, fusee, chain and winding key
   Part of 'The Marine Chronometer, working' (three.js r128). See README.md. */
/* =====================================================================
   movement.js: the Hamilton Model 21 movement.
   Units: mm. Movement frame: dial side = +y, 12 o'clock = -z, 3 o'clock = +x.

   SOURCES FOR THE LAYOUT (see README):
   - Pillar plate 87.57 mm diameter, 3.86 mm thick (new-old-stock Hamilton part, Cas-Ker listing).
   - Balance, fusee arbor and barrel arbor: triangulated from two photographs (the manual's Fig. 2 and a near-top
     view of a 1941 movement) with an independent camera for each (bundle.py), then scaled so the fusee wheel
     (96 teeth then, 90 counted since: the same pitch radius at this centre distance) stays inside the 87.57 mm pillar plate.
   - Bridge shapes, balance cock, setup cover, screw positions, engraving columns and damascene direction:
     traced on the top-view photograph and mapped into this frame (p3map.json).
   - Dial orientation: wind-indicator wheel under the 12 (manual Fig. 107, radius ~12 mm), driven by the
     fusee-arbor pinion; seconds (fourth wheel) at 6.
   - Escape wheel: 16 teeth, 13.16 mm, 1.3 mm thick (Hamilton spec quoted in chronometerbook.com post 30).
   - Escapement: plan view of the manual's Fig. 90 (redrawn by Rawlings, chronometerbook.com post 4); escape wheel 9.40 mm from the balance,
     where the 0.249 in impulse roller leaves 0.002 in roller shake (Op. 84) and the teeth dip into its crescent (Ops. 76, 83).
   - Third arbor: measured on a restoration video (References/VIDEOS.md), 16.0 mm from the centre, where the counted wheels' size ratios put it;
     escape wheel position from the escapement (9.40 mm from the balance). The modules (MOD) follow from the arbors' spacing: 0.392 / 0.3245 / 0.251 / 0.2614 (fusee, centre, third and fourth stages; solve.py prints them).
   ===================================================================== */
/** @type {Object<string,[number,number]>} plan places [x, z], mm */
const L={C:[0,0],T:[-8.524,14.186],F:[0,21.6],E:[9.352,15.607],B:[1.609,10.277],Fu:[14.306,-14.519],Ba:[-22.144,-5.347],Ud:[0,-22.9],Mw:[11.3,0]};   /* the train (F, T, E) and the indicator's stud (Ud) as KLUwI2UUCMQ measures them at the plate's 87.57 mm (References/VIDEOS.md, "The fourth arbor, the pillars, the
   indicator and the ring", "The scale"): the fourth 21.6 from the centre under the seconds (34:30, 40:08), the third 16.55 at 149 deg from the 12 (34:30), the escape arbor 9.40 from
   the balance toward the escape jewel seen from above (10:00, 9.46 from it); with the modules from these spacings the wheels' sizes come out as counted (centre / third 1.45,
   centre / fourth 1.48; counted 1.36-1.39, 1.48-1.50) and the fourth's setting stands in the keyhole's lobe over it. Until 2 October 2026: F (0, 23.9), T (-6.18, 14.75), E (8.095, 17.08). The minute wheel's stud (Mw) 11.3 out at
   3 o'clock (40:08 at the plate's scale; it was 10.5 from the 404-px dial-side photograph, mapped through anchors that have since moved) */
/* The photographed group: the balance, fusee and barrel (B, Fu, Ba, triangulated on two photographs: (8.0, 6.77), (11.59, -19.8), (-18.56, 0.19)) and everything traced
   or fitted on the top-view photograph with them (the pillars, the bridges' cuts and holes, the cock, their screws and pins, the engraving, the damascening). PT takes a
   point of the photographs' frame into the movement's: a similarity, x1.039, turned 19.42 deg and shifted (-3.891, 0.879), fitted (IDEAS.md 1.12) so the three arbors land
   where the real movements measure them: the balance on its lower cap (the train bridge's underside face-on, KLUwI2UUCMQ 13:49.5, tools/framecam.py), the fusee 20.4 mm
   from the centre (the bare plate at 34:30 and 36:15, 20.2-20.8; the side photograph's fusee wheel at the plate's own scale, 36.0-36.9 across, which with its 90 teeth
   and the centre pinion's 14 puts it 20.3-20.9 out; the train bridge's notch round it, 20.9) and the barrel at the train bridge's cut round it, 22.56 out (the plate:
   21.4-23.5). Within 0.23-0.31 mm of all three: the photographs' own layout holds, scaled as it came (their scale was set by the fusee wheel, then taken as 40.87 mm
   across and made to fit the plate, x0.955), turned and set off the centre by 4 mm. The dial's 12-6 axis, the centre, third and fourth arbors, the indicator and the
   motion work stay. PTr: PT for outlines that run to the rim, which keep their radius about the centre near it (the bridges' rims stay concentric with the plate).
   PR: the 14 deg turn alone, for what was measured on the video in the train bridge's frame (its rim, barrel cut and centre bushing): the notch, the third screw and
   its pillar, the cut round the barrel. The escape arbor solved again, 9.40 from the balance (the escapement) and 10.585 from the fourth (their mesh) */
const PHOTO_K=1.039,PHOTO_TURN=19.42*Math.PI/180,PHOTO_T=[-3.891,0.879],PR_TURN=14*Math.PI/180;
const PT=([x,z])=>[PHOTO_K*(x*Math.cos(PHOTO_TURN)-z*Math.sin(PHOTO_TURN))+PHOTO_T[0],PHOTO_K*(x*Math.sin(PHOTO_TURN)+z*Math.cos(PHOTO_TURN))+PHOTO_T[1]],
  PTi=([x,z])=>{const u=(x-PHOTO_T[0])/PHOTO_K,v=(z-PHOTO_T[1])/PHOTO_K;return[u*Math.cos(PHOTO_TURN)+v*Math.sin(PHOTO_TURN),-u*Math.sin(PHOTO_TURN)+v*Math.cos(PHOTO_TURN)];},
  PTr=p=>{const q=PT(p),r=Math.hypot(...p),rq=Math.hypot(...q);if(r<=30)return q;const w=Math.min(1,Math.max(0,(40.5-r)/10.5)),R=r+(rq-r)*w;return[q[0]*R/rq,q[1]*R/rq];},
  PR=([x,z])=>[x*Math.cos(PR_TURN)-z*Math.sin(PR_TURN),x*Math.sin(PR_TURN)+z*Math.cos(PR_TURN)];
const PP_R=87.57/2,PP_T=3.86,BR_R=40.5;
/* the mounting ring (42057) under the plate's dial side, and the dial on it, from the side photograph (18.9 px/mm by the plate's width): a band as wide as the plate down to 6.0 mm
   below its train face (MR_FL), then a flange 95.9 across down to 10.4 mm (MR_Y), the dial's seat. Its bore r 39.0: on the video's ring (40:08) 0.81-0.83 of its outside, camera-free (the dial-side photograph's 40.2 took its scale from a ratio of 0.84; References/VIDEOS.md, "The scale"). The dial 95 across, a little
   inside the flange (the side photograph; with the sub-dials on their arbors, the photographed dial's proportions give it within 2 %) */
const MR_RO=95.9/2,MR_RI=39.0,MR_FL=6.0-PP_T,MR_Y=10.4-PP_T,DIAL_R=47.5,DIAL_T=0.6,DD=MR_Y-3.3,DK=DIAL_R/50.8;   /* DD: the dial and all above it, raised from where 3.3 mm feet on the plate had them; DK: the hands, drawn for a 4 in dial, scaled to this one */
/* the seconds hand: as long as it can be and still pass the hour wheel's pipe at the centre (r 2.7) 0.9 clear, 18.0 mm with the fourth 21.6 out (it was 21.7 DK, 20.3 mm, with
   the fourth at 23.9, 3.6 from the centre at its tip); the dial's seconds track is drawn to its reach (core.js). On the photographed dial the seconds sub-dial meets the minute
   track at 6, with its centre 0.549 of the track's radius out; with the fourth at 21.6 that track would be 39.3 in radius, not this 95 mm dial's 43.0 (Review-results.md, 24) */
const SEC_L=Math.min(21.7*DK,L.F[1]-3.6);
/* levels (y) from a side photograph of the movement, scaled by the pillar plate's 3.86 mm edge: train bridge 16.8-19.9 mm above the plate (TB_U, TB_T),
   barrel bridge 3.4 mm on it (BB_T), cock 14.2 mm tall on the train bridge (CK_T); the escape wheel runs just under the train bridge, the fourth
   wheel and escape pinion 3.6 mm above the plate, and the third wheel lowest with the centre wheel just above it, as Figs. 13, 29 and 110 stack the train (see README, 'How the layout was measured') */
const TB_U=-20.66,TB_T=-23.76,BB_T=-27.16,CK_T=-37.96;
const EY=-18.96,LB_T=-14.76,BAL_Y=-26.3,BAL_RH=3.5,LT_H=4.4;   /* BAL_RH: the balance rim's height; its plate-side edge at BAL_Y + 1.2, its top (train side) at BAL_Y + 1.2 - BAL_RH */   /* escape wheel (teeth 0.95 below the train bridge), balance lower bridge's top face (photograph: 7.9-10.9 mm above the plate), balance rim */   /* bridge radius: the top-view photograph (the fusee wheel is hidden under it, as photographed) */          /* pillar plate; bridges */
const PILLARS={barrel:[-11.35, -32.79],train:[[-27.83, 19.7],[5.5, 33.96],[34.13, -3.41]]};   /* the four pillars' feet on the bare plate (KLUwI2UUCMQ 40:08, 34:30, at the plate's 87.57: r 34.1-34.7, to about 0.4 mm and 1.5 deg; References/VIDEOS.md); until 2 October 2026 traced on the top-view photograph (PT([-15.3,-26.58]), PT([-16.63,22.48]), [5.61,35.62], PR([32.25,-10.81]): r 32.0-36.1). The second at 170.8 deg, not the video's 166.3 (its dial-side screw 166.6 on 40:08, just clear of the lower train bridge's end): there its top screw's head would stand in the cock's foot, which C Spinner's video shows clear of any screw (6:29 with the cock on, 6:47 off) and the top-view photograph has beside it (the screw at 172 deg); it clears the cock by 0.9 and the fourth wheel by 0.7. The cock's place or the dial side's angles are about 4 deg out here. The third under the train bridge's screw at the end of its tongue, where C Spinner's video has it (23:30, 36:34) and the manual (Op. 14).
   The second, traced at PT([18.17, 26.92]) = (4.61, 33.53), would stand in the fourth wheel (its tips 9.6 from the arbor, the pillar r 2.9): pushed out from the fourth arbor until it clears by 0.5,
   2.3 mm (the train bridge's hole at 23:30 is 0.3 mm from the traced place; the bare plate's fits put its top 4-6 mm further out, as they do every pillar's) */
const COCK_FOOT=PT([28.3,6.4]),BAL_R=14.5;
/* the upper train bridge's notch round the fusee and its horn, measured on two frames of a restoration video (tools/train_bridge.py: KLUwI2UUCMQ 23:30 and 13:49.5):
   the notch a circle (TB_NOTCH: x, z, r), the horn between it and the barrel's cut ending in a straight cut across, the mouth a sharp corner and a straight edge
   turning into the rim through a round corner (r 6). TB_EDGE runs from outside the rim along the mouth, round the notch, across the horn's end and into the barrel's cut, as crescent() takes it.
   Both are measured against the bridge's rim, barrel cut and centre bushing, so they turn with the train bridge's frame (PR) */
const TB_NOTCH=[...PR([11.46,-17.47]),16.57],TB_CUT=PR([-22.56*24.8/22.561,0.23*24.8/22.561]),TB_CR=21.0;   /* TB_CUT, TB_CR: the centre and radius of its cut round the barrel: fitted with both free on C Spinner's video (23:30, the bridge face up, the camera on its rim; 13:49.5 agrees), r 21.0-22.0 (taken at its low end, 21.0, where the train bridge keeps 0.7 mm of metal round pillar 0's screw), centred 24.6-25.1 mm out, about 2 mm further out than the barrel's arbor (it was r 19.2, centred on the barrel) */
/* the bridge's end past the barrel: a straight cut from the barrel's cut to the rim (KLUwI2UUCMQ 23:30, the frame rectified through its anchor: the corner 36.9 mm from the
   centre, the rim reached at 40.4, within about 0.2 mm), where the cut's circle alone ran on round the rim as a sliver 23 deg further (tools/train_bridge.py) */
const TB_END=[[-31.33,19.66],[-32.61,23.59]].map(PR);
const TB_EDGE=[[40.32, -13.51], [38.3, -13.14], [38.19, -13.4], [38.07, -13.66], [37.94, -13.91], [37.79, -14.16], [37.63, -14.4], [37.46, -14.63], [37.28, -14.85], [37.09, -15.06], [36.89, -15.27], [36.68, -15.46], [36.47, -15.64], [36.24, -15.82], [36.0, -15.98], [35.76, -16.13], [35.51, -16.27], [35.26, -16.4], [35.0, -16.51], [34.73, -16.61], [34.46, -16.7], [27.99, -18.67], [28.02, -18.18], [28.03, -17.68], [28.03, -17.19], [28.01, -16.69], [27.98, -16.2], [27.94, -15.7], [27.88, -15.21], [27.8, -14.72], [27.71, -14.23], [27.61, -13.75], [27.49, -13.27], [27.36, -12.79], [27.21, -12.31], [27.05, -11.85], [26.87, -11.38], [26.68, -10.92], [26.48, -10.47], [26.26, -10.02], [26.03, -9.59], [25.79, -9.15], [25.54, -8.73], [25.27, -8.31], [24.99, -7.9], [24.7, -7.5], [24.39, -7.11], [24.08, -6.73], [23.75, -6.35], [23.41, -5.99], [23.06, -5.64], [22.7, -5.3], [22.33, -4.97], [21.95, -4.65], [21.57, -4.34], [21.17, -4.04], [20.76, -3.76], [20.35, -3.49], [19.92, -3.23], [19.49, -2.98], [19.06, -2.75], [18.61, -2.53], [18.16, -2.32], [17.71, -2.12], [17.24, -1.94], [16.78, -1.78], [16.31, -1.63], [15.83, -1.49], [15.35, -1.37], [14.87, -1.26], [14.38, -1.16], [13.89, -1.08], [13.4, -1.02], [12.9, -0.97], [12.41, -0.93], [11.91, -0.91], [11.42, -0.9], [10.92, -0.91], [10.43, -0.94], [9.93, -0.97], [9.44, -1.03], [8.95, -1.09], [8.46, -1.18], [7.97, -1.27], [7.49, -1.39], [7.01, -1.51], [6.54, -1.65], [6.06, -1.81], [5.6, -1.98], [5.14, -2.16], [4.68, -2.35], [4.23, -2.56], [3.79, -2.79], [3.35, -3.02], [2.92, -3.27], [2.5, -3.53], [2.09, -3.81], [1.69, -4.09], [1.29, -4.39], [0.9, -4.7], [0.53, -5.03], [0.16, -5.36], [-0.2, -5.7], [-0.55, -6.06], [-0.88, -6.42], [-1.21, -6.79], [-1.52, -7.18], [-1.82, -7.57], [-2.11, -7.97], [-2.39, -8.38], [-2.66, -8.8], [-2.91, -9.23], [-3.15, -9.66], [-3.38, -10.1], [-3.59, -10.55], [-3.79, -11.01], [-3.98, -11.46], [-4.15, -11.93], [-6.6, -10.44], [-7.03, -10.18]].map(PR);
/* the opening in the middle (tools/train_bridge.py, KLUwI2UUCMQ 23:30 face up, and BunnSpecial 20:20): two round lobes, over the balance (r 4.6, its centre 0.6 mm from the staff)
   and over the fourth's setting on the lower bridge (r 4.3), through which the balance lower bridge under it shows, and the round escape passage through both bridges (r 4.7);
   joined across the plain face round the lower bridge's setting. Either side of the passage a seat is sunk in the face for an end of the escape upper bridge, with its screw
   and pin holes (sunk SEAT_D: the bar's ends lie in them, KLUwI2UUCMQ 10:50, 23:30). Measured in the bridge's frame (PR) */
const TB_KEY=[[14.71, 2.06], [14.37, 1.88], [13.81, 1.7], [13.23, 1.64], [12.91, 1.66], [12.49, 1.74], [12.09, 1.88], [11.75, 2.06], [11.41, 2.3], [11.05, 2.66], [10.81, 3.0], [10.63, 3.34], [10.49, 3.74], [10.39, 4.26], [10.39, 4.64], [10.35, 4.98], [10.37, 5.14], [10.31, 5.88], [10.33, 6.04], [10.29, 6.48], [9.95, 6.62], [9.21, 7.02], [8.71, 7.36], [8.19, 7.8], [7.79, 7.22], [7.27, 6.68], [6.89, 6.38], [6.45, 6.1], [6.09, 5.92], [5.41, 5.68], [4.81, 5.56], [4.21, 5.52], [3.61, 5.56], [3.01, 5.68], [2.33, 5.92], [1.97, 6.1], [1.53, 6.38], [1.15, 6.68], [0.63, 7.22], [0.29, 7.7], [-0.01, 8.26], [-0.13, 8.56], [-0.29, 9.1], [-0.39, 9.72], [-0.41, 10.14], [-0.37, 10.74], [-0.29, 11.18], [-0.13, 11.72], [0.17, 12.38], [0.45, 12.82], [0.75, 13.2], [1.15, 13.6], [1.53, 13.9], [1.97, 14.18], [2.69, 14.5], [2.23, 14.76], [1.67, 15.18], [1.19, 15.68], [0.77, 16.3], [0.51, 16.86], [0.31, 17.56], [0.23, 18.38], [0.27, 18.96], [0.37, 19.46], [0.51, 19.9], [0.89, 20.66], [1.31, 21.22], [1.81, 21.7], [2.23, 22.0], [2.75, 22.28], [3.29, 22.48], [3.93, 22.62], [4.51, 22.66], [5.09, 22.62], [5.59, 22.52], [6.03, 22.38], [6.59, 22.12], [6.97, 21.88], [7.35, 21.58], [7.83, 21.08], [8.25, 20.46], [8.47, 20.0], [8.65, 19.46], [8.75, 18.96], [8.79, 18.44], [9.21, 18.74], [9.75, 19.04], [9.71, 19.38], [9.73, 19.54], [9.67, 20.28], [9.69, 20.44], [9.63, 21.16], [9.69, 21.84], [9.83, 22.3], [10.05, 22.74], [10.29, 23.08], [10.65, 23.44], [10.81, 23.56], [11.33, 23.86], [11.89, 24.04], [12.47, 24.1], [13.05, 24.04], [13.61, 23.86], [14.13, 23.56], [14.29, 23.44], [14.65, 23.08], [14.89, 22.74], [15.17, 22.14], [15.27, 21.72], [15.35, 20.68], [15.33, 20.52], [15.39, 19.78], [15.39, 19.3], [16.29, 18.86], [17.17, 18.26], [18.01, 17.46], [18.47, 16.88], [18.83, 16.32], [19.11, 15.78], [19.47, 14.82], [19.67, 13.92], [19.75, 12.88], [19.69, 11.98], [19.51, 11.08], [19.19, 10.16], [18.71, 9.24], [18.13, 8.44], [17.43, 7.72], [16.85, 7.26], [16.49, 7.02], [15.95, 6.72], [16.03, 5.38], [16.03, 4.82], [16.07, 4.48], [16.05, 4.16], [15.97, 3.74], [15.83, 3.34], [15.53, 2.82], [15.41, 2.66], [15.05, 2.3]].map(PR),TB_SEAT=[[[9.73, 19.06], [9.73, 19.54], [9.67, 20.28], [9.69, 20.44], [9.63, 21.16], [9.69, 21.84], [9.77, 22.14], [9.99, 22.64], [10.29, 23.08], [10.65, 23.44], [11.09, 23.74], [11.59, 23.96], [12.15, 24.08], [12.79, 24.08], [13.35, 23.96], [13.85, 23.74], [14.29, 23.44], [14.65, 23.08], [14.89, 22.74], [15.07, 22.4], [15.25, 21.84], [15.33, 21.06], [15.31, 21.02], [15.35, 20.68], [15.33, 20.52], [15.39, 19.78], [15.39, 19.3], [14.65, 19.56], [13.89, 19.72], [13.37, 19.78], [12.33, 19.78], [11.57, 19.68], [11.05, 19.56], [10.43, 19.36]], [[11.05, 2.66], [10.81, 3.0], [10.63, 3.34], [10.45, 3.9], [10.39, 4.26], [10.39, 4.64], [10.35, 4.98], [10.37, 5.14], [10.31, 5.88], [10.33, 6.04], [10.29, 6.46], [11.05, 6.2], [11.81, 6.04], [12.33, 5.98], [13.37, 5.98], [14.13, 6.08], [14.65, 6.2], [15.27, 6.4], [15.93, 6.7], [15.97, 6.68], [15.97, 6.12], [16.03, 5.38], [16.01, 5.22], [16.07, 4.48], [16.01, 3.9], [15.93, 3.6], [15.71, 3.1], [15.41, 2.66], [15.05, 2.3], [14.61, 2.0], [14.11, 1.78], [13.55, 1.66], [12.91, 1.66], [12.35, 1.78], [11.85, 2.0], [11.41, 2.3]]].map(f=>f.map(PR)),SEAT_D=0.3;   /* the opening with the escape upper bridge's seats (tools/train_bridge.py), and the seats' floors, SEAT_D below the face (its depth estimated) */
/* the balance lower bridge (tools/lower_bridge.py), as a restoration video shows it (References/VIDEOS.md: KLUwI2UUCMQ 13:49.5, the train bridge's underside face-on, measured
   through the camera its rim and barrel cut give): two levels. LB_LO, the lower level, a slab curved as a lens: an outer edge on a circle of r 20.8 round from the 3 o'clock lug past the centre
   arbor, a flatter one down to the fourth's end (measured in the train bridge's frame, so turned with the photographed group), a straight edge across it, and a concave edge round the train bridge's escape lobe; LB_LO2 its underside's edge, where the face was
   traced, 0.8 mm in from the convex edges and the end for the chamfer round them. LB_UP, the upper level against the train bridge's underside: a lug at each end with its screw, and between them the train-blocking screw's column (the turned detent crosses
   the slab beside the fourth arbor); LB_WALL, where they join
   the slab */
const LB_UP=[[[-16.0, 22.49], [-15.69, 22.66], [-15.36, 22.82], [-14.72, 23.12], [-14.4, 23.28], [-14.08, 23.43], [-13.76, 23.59], [-13.12, 23.89], [-12.8, 24.05], [-12.48, 24.19], [-12.14, 24.28], [-11.78, 24.22], [-11.49, 24.02], [-11.26, 23.74], [-11.06, 23.45], [-10.85, 23.16], [-10.44, 22.57], [-10.23, 22.28], [-10.03, 21.98], [-9.85, 21.68], [-9.68, 21.36], [-9.53, 21.04], [-9.27, 20.36], [-9.15, 20.02], [-9.02, 19.68], [-8.77, 19.0], [-8.65, 18.66], [-8.56, 18.32], [-8.54, 17.96], [-8.62, 17.61], [-8.8, 17.28], [-9.01, 16.98], [-9.23, 16.7], [-9.65, 16.14], [-9.87, 15.86], [-10.29, 15.3], [-10.73, 14.74], [-10.97, 14.48], [-11.26, 14.27], [-11.58, 14.12], [-11.92, 14.04], [-12.28, 13.98], [-12.64, 13.93], [-13.0, 13.87], [-13.72, 13.77], [-14.08, 13.71], [-14.44, 13.7], [-14.8, 13.78], [-15.12, 13.96], [-15.37, 14.22], [-15.81, 14.78]],[[-5.6, 16.72], [-5.96, 16.78], [-6.29, 16.9], [-6.61, 17.06], [-6.89, 17.28], [-7.1, 17.58], [-7.25, 17.9], [-7.36, 18.24], [-7.4, 18.59], [-7.34, 18.94], [-7.22, 19.27], [-7.06, 19.6], [-6.84, 19.87], [-6.55, 20.08], [-6.22, 20.23], [-5.88, 20.35], [-5.52, 20.38], [-5.17, 20.32], [-4.82, 20.19], [-4.5, 20.03], [-4.23, 19.8], [-4.02, 19.5], [-3.88, 19.18], [-3.76, 18.84], [-3.74, 18.48], [-3.81, 18.12], [-3.94, 17.78], [-4.1, 17.46], [-4.34, 17.2], [-4.64, 17.0], [-4.96, 16.85], [-5.3, 16.74]],[[14.76, 6.68], [14.44, 6.83], [14.22, 7.12], [14.1, 7.45], [13.74, 8.82], [13.64, 9.16], [13.81, 9.48], [14.1, 9.7], [14.38, 9.93], [14.64, 10.18], [14.9, 10.44], [15.14, 10.71], [15.36, 10.99], [15.58, 11.28], [15.77, 11.58], [15.96, 11.89], [16.13, 12.22], [16.28, 12.54], [16.42, 12.87], [16.54, 13.2], [16.64, 13.54], [16.73, 13.88], [16.81, 14.24], [16.86, 14.6], [16.9, 14.96], [16.93, 15.32], [17.1, 15.63], [17.46, 15.71], [18.16, 15.85], [18.88, 16.01], [19.23, 16.08], [19.58, 16.16], [19.94, 16.23], [20.3, 16.29], [20.66, 16.28], [21.0, 16.14], [21.26, 15.91], [21.47, 15.62], [22.07, 14.72], [22.46, 14.12], [22.86, 13.52], [23.05, 13.22], [23.45, 12.62], [23.84, 12.02], [23.99, 11.7], [23.98, 11.34], [23.78, 11.05], [23.5, 10.84], [23.2, 10.64], [22.3, 10.07], [22.0, 9.87], [21.1, 9.3], [20.8, 9.1], [19.9, 8.53], [19.6, 8.33], [19.0, 7.95], [18.7, 7.75], [18.1, 7.37], [17.78, 7.2], [17.46, 7.06], [17.12, 6.96], [16.76, 6.89], [15.32, 6.69], [14.96, 6.67]]];
const LB_WALL=[[[-10.34, 15.52], [-10.48, 15.86], [-10.72, 16.52], [-10.84, 16.86], [-10.95, 17.2], [-11.05, 17.54], [-10.98, 17.9], [-10.89, 18.24], [-10.82, 18.6], [-10.8, 18.96], [-10.82, 19.32], [-10.87, 19.68], [-10.96, 20.02], [-11.08, 20.35], [-11.24, 20.67], [-11.44, 20.98], [-11.66, 21.26], [-11.92, 21.52], [-12.0, 21.88], [-12.08, 22.6], [-12.17, 23.68], [-12.19, 24.04], [-11.92, 24.27], [-11.59, 24.12], [-11.35, 23.86], [-11.14, 23.57], [-10.73, 22.98], [-10.52, 22.69], [-10.3, 22.38], [-10.1, 22.08], [-9.91, 21.78], [-9.73, 21.46], [-9.57, 21.14], [-9.44, 20.81], [-9.32, 20.48], [-9.19, 20.14], [-9.07, 19.8], [-8.94, 19.46], [-8.69, 18.78], [-8.59, 18.44], [-8.54, 18.08], [-8.59, 17.72], [-8.74, 17.38], [-8.94, 17.08], [-9.36, 16.52], [-9.58, 16.24], [-10.0, 15.68]],[[-5.6, 16.72], [-5.96, 16.78], [-6.29, 16.9], [-6.61, 17.06], [-6.89, 17.28], [-7.1, 17.58], [-7.25, 17.9], [-7.36, 18.24], [-7.4, 18.59], [-7.34, 18.94], [-7.22, 19.27], [-7.06, 19.6], [-6.84, 19.87], [-6.55, 20.08], [-6.22, 20.23], [-5.88, 20.35], [-5.52, 20.38], [-5.17, 20.32], [-4.82, 20.19], [-4.5, 20.03], [-4.23, 19.8], [-4.02, 19.5], [-3.88, 19.18], [-3.76, 18.84], [-3.74, 18.48], [-3.81, 18.12], [-3.94, 17.78], [-4.1, 17.46], [-4.34, 17.2], [-4.64, 17.0], [-4.96, 16.85], [-5.3, 16.74]],[[14.76, 6.68], [14.44, 6.83], [14.22, 7.12], [14.1, 7.45], [13.74, 8.82], [13.64, 9.16], [13.81, 9.48], [14.1, 9.7], [14.44, 9.62], [14.56, 9.28], [14.67, 8.94], [14.79, 8.6], [15.01, 7.92], [15.13, 7.58], [15.35, 6.9], [15.08, 6.67]]];
const LB_LO=[[5.16, 3.35], [4.44, 3.39], [4.08, 3.42], [3.37, 3.5], [2.66, 3.6], [2.3, 3.66], [1.58, 3.8], [1.22, 3.88], [0.88, 3.96], [0.52, 4.05], [0.18, 4.14], [-0.16, 4.24], [-0.84, 4.46], [-1.52, 4.7], [-1.86, 4.83], [-2.54, 5.11], [-3.2, 5.41], [-3.47, 5.64], [-3.99, 6.12], [-4.24, 6.36], [-4.76, 6.88], [-5.0, 7.14], [-5.24, 7.39], [-5.72, 7.93], [-6.18, 8.47], [-6.85, 9.32], [-7.06, 9.6], [-7.28, 9.9], [-7.68, 10.48], [-7.88, 10.78], [-8.26, 11.38], [-8.82, 12.32], [-8.62, 12.61], [-8.26, 12.66], [-7.92, 12.76], [-7.6, 12.94], [-7.34, 13.18], [-7.14, 13.48], [-7.02, 13.81], [-6.97, 14.16], [-7.01, 14.52], [-7.13, 14.86], [-7.32, 15.16], [-7.58, 15.42], [-7.88, 15.6], [-8.22, 15.71], [-8.58, 15.73], [-8.94, 15.7], [-9.3, 15.65], [-9.66, 15.61], [-10.02, 15.56], [-10.38, 15.6], [-10.51, 15.94], [-10.87, 16.96], [-10.98, 17.3], [-11.08, 17.64], [-10.96, 17.97], [-10.87, 18.32], [-10.82, 18.68], [-10.8, 19.04], [-10.82, 19.4], [-10.89, 19.76], [-10.98, 20.1], [-11.12, 20.44], [-11.29, 20.76], [-11.5, 21.06], [-11.96, 21.62], [-12.01, 21.98], [-12.09, 22.7], [-12.15, 23.42], [-12.19, 24.14], [-12.2, 24.5], [-12.12, 24.84], [-11.79, 24.94], [-11.11, 25.14], [-10.44, 25.34], [-10.11, 25.44], [-9.43, 25.64], [-8.76, 25.84], [-8.43, 25.94], [-7.75, 26.14], [-7.08, 26.34], [-6.75, 26.44], [-6.07, 26.64], [-5.4, 26.84], [-5.07, 26.94], [-4.39, 27.14], [-3.72, 27.34], [-3.39, 27.44], [-2.71, 27.64], [-2.04, 27.84], [-1.71, 27.94], [-1.37, 28.04], [-1.02, 28.03], [-0.77, 27.76], [-0.27, 27.24], [-0.03, 26.98], [0.22, 26.72], [0.46, 26.46], [0.96, 25.94], [1.2, 25.68], [1.46, 25.42], [1.72, 25.18], [2.28, 24.7], [2.53, 24.46], [2.79, 24.2], [3.04, 23.92], [3.27, 23.64], [3.49, 23.36], [3.7, 23.08], [3.93, 22.8], [3.75, 22.12], [3.72, 21.76], [3.7, 21.4], [3.66, 21.04], [3.58, 20.68], [3.48, 20.34], [3.34, 20.01], [3.16, 19.68], [2.78, 19.08], [2.61, 18.76], [2.52, 18.42], [2.52, 18.06], [2.54, 17.71], [2.58, 17.36], [2.64, 17.0], [2.73, 16.64], [2.82, 16.3], [2.93, 15.96], [3.1, 15.64], [3.35, 15.38], [3.66, 15.18], [3.97, 15.02], [4.3, 14.84], [4.6, 14.65], [4.89, 14.44], [5.16, 14.21], [5.42, 13.96], [5.66, 13.7], [5.88, 13.42], [6.08, 13.12], [6.26, 12.82], [6.42, 12.51], [6.6, 12.2], [6.83, 11.92], [7.12, 11.72], [7.46, 11.59], [7.8, 11.49], [8.16, 11.41], [8.52, 11.34], [8.88, 11.29], [9.24, 11.26], [9.6, 11.25], [9.96, 11.26], [10.32, 11.28], [10.68, 11.33], [11.04, 11.39], [11.4, 11.47], [11.74, 11.56], [12.08, 11.68], [12.42, 11.81], [12.74, 11.95], [13.06, 12.12], [13.37, 12.3], [13.63, 12.04], [13.75, 11.7], [13.86, 11.37], [13.98, 11.02], [14.2, 10.34], [14.32, 10.0], [14.54, 9.32], [14.66, 8.98], [14.77, 8.64], [14.89, 8.3], [15.11, 7.62], [15.23, 7.28], [15.45, 6.6], [15.57, 6.26], [15.68, 5.93], [15.62, 5.57], [14.66, 5.12], [13.98, 4.84], [13.64, 4.71], [12.96, 4.47], [12.63, 4.36], [12.28, 4.25], [11.94, 4.15], [11.26, 3.97], [10.18, 3.73], [9.82, 3.67], [9.46, 3.6], [8.74, 3.5], [8.02, 3.42], [7.66, 3.39], [6.94, 3.35], [6.22, 3.33], [5.86, 3.33]];
const LB_LO2=[[5.54, 4.14], [5.18, 4.15], [4.46, 4.19], [4.1, 4.22], [3.38, 4.3], [3.02, 4.35], [2.3, 4.47], [0.86, 4.75], [0.5, 4.84], [0.16, 4.93], [-0.52, 5.15], [-1.2, 5.41], [-1.54, 5.56], [-1.88, 5.7], [-2.21, 5.84], [-2.54, 5.99], [-2.85, 6.16], [-3.12, 6.4], [-3.9, 7.15], [-4.66, 7.94], [-5.14, 8.48], [-5.38, 8.76], [-5.84, 9.32], [-6.06, 9.6], [-6.48, 10.16], [-6.9, 10.76], [-7.1, 11.05], [-7.3, 11.36], [-7.68, 11.96], [-7.86, 12.26], [-8.04, 12.57], [-7.79, 12.82], [-7.5, 13.02], [-7.27, 13.28], [-7.09, 13.6], [-6.99, 13.94], [-6.98, 14.3], [-7.05, 14.66], [-7.19, 14.98], [-7.41, 15.26], [-7.68, 15.49], [-8.0, 15.64], [-8.36, 15.73], [-8.72, 15.72], [-9.42, 15.64], [-9.64, 15.91], [-9.77, 16.26], [-9.9, 16.6], [-10.02, 16.94], [-10.35, 17.96], [-10.44, 18.3], [-10.54, 18.64], [-10.63, 18.98], [-10.71, 19.32], [-10.95, 20.4], [-11.13, 21.48], [-11.23, 22.2], [-11.31, 22.92], [-11.34, 23.28], [-11.38, 24.0], [-11.18, 24.29], [-8.8, 24.99], [-8.46, 25.1], [-6.76, 25.6], [-5.76, 25.9], [-5.08, 26.1], [-4.08, 26.4], [-3.4, 26.6], [-2.4, 26.9], [-1.72, 27.1], [-0.72, 27.4], [-0.37, 27.34], [-0.12, 27.08], [0.12, 26.82], [0.62, 26.3], [0.86, 26.04], [1.36, 25.52], [1.62, 25.27], [1.88, 25.04], [2.16, 24.8], [2.43, 24.56], [2.68, 24.32], [2.92, 24.06], [3.16, 23.78], [3.38, 23.5], [3.59, 23.22], [3.82, 22.94], [3.9, 22.6], [3.78, 22.26], [3.73, 21.9], [3.7, 21.54], [3.68, 21.18], [3.62, 20.82], [3.53, 20.48], [3.4, 20.14], [3.24, 19.82], [3.06, 19.52], [2.86, 19.22], [2.68, 18.91], [2.55, 18.58], [2.51, 18.22], [2.53, 17.86], [2.56, 17.5], [2.62, 17.14], [2.69, 16.78], [2.78, 16.44], [2.88, 16.1], [3.02, 15.76], [3.24, 15.48], [3.52, 15.26], [4.16, 14.92], [4.47, 14.74], [4.76, 14.54], [5.04, 14.32], [5.3, 14.08], [5.55, 13.82], [5.78, 13.55], [5.99, 13.26], [6.18, 12.96], [6.35, 12.64], [6.52, 12.33], [6.74, 12.02], [7.0, 11.79], [7.32, 11.64], [7.66, 11.53], [8.0, 11.44], [8.36, 11.37], [8.72, 11.31], [9.08, 11.27], [9.44, 11.25], [9.8, 11.25], [10.16, 11.27], [10.52, 11.3], [10.88, 11.36], [11.24, 11.43], [11.58, 11.52], [11.92, 11.62], [12.25, 11.74], [12.58, 11.88], [12.9, 12.03], [13.22, 12.21], [13.57, 12.22], [13.69, 11.88], [13.8, 11.55], [13.92, 11.2], [14.14, 10.52], [14.26, 10.18], [14.48, 9.5], [14.6, 9.16], [14.71, 8.82], [14.83, 8.48], [15.05, 7.8], [15.17, 7.46], [15.39, 6.78], [15.51, 6.44], [15.2, 6.26], [14.88, 6.1], [13.88, 5.66], [13.2, 5.4], [12.86, 5.28], [12.52, 5.17], [12.19, 5.06], [11.5, 4.86], [11.16, 4.77], [10.82, 4.69], [10.1, 4.53], [9.74, 4.46], [9.38, 4.4], [8.66, 4.3], [7.94, 4.22], [7.58, 4.19], [6.86, 4.15], [6.14, 4.13], [5.78, 4.14]];
/* going train, counted on a restoration video of a 1941 Model 21 (References/README.md, "Videos consulted"; tools/video.py): fusee wheel 90, centre wheel 90,
   third wheel 80 with a pinion of 12, fourth wheel 75; the fourth and escape pinions (10, 10) follow, the fourth turning once a minute and the 16-tooth escape
   wheel 7.5 times to its once. The centre pinion's leaves weren't counted cleanly: 14 makes the manual's 17½ half turns (Sec. III) hold 56¼ h, its "maximum of
   56 hours", and with the fusee arbor's pinion of 12 sweeps the UP-DOWN hand 313.6° in 56 h, as the photographed dial's 315.7°; 13 (with 13) would fit the dial
   and the manual's seven half turns a day but run 60.6 h. Every count shown in the page (labels, part cards, walkthrough tables) comes from here */
const TRAIN={fu:90,cp:14,cw:90,tp:12,tw:80,fp:10,fw:75,ep:10,ew:16};
/* the train wheels' proportions [hub, rim's inner edge, spoke width] as fractions of the tip radius, measured on KLUwI2UUCMQ 23:45 (4K; the wheels lying flat on the mat, each
   rectified by its tips' ellipse from video.py count, identified by their sizes against each other and their counts): sections through the gaps between the spokes and across the
   spokes at 0.45-0.65 of the radius, edges at half the contrast against the blue mat. The centre wheel: hub 0.30 (0.28-0.31 over three gaps), rim from 0.79 (0.78-0.80), spokes
   0.10 (0.094-0.109, three spokes); the fourth: hub 0.36 (three gaps), rim from 0.83 (one gap; the pale rim against the mat hides the others), spokes 0.07 (four). The third wheel
   lies tilted on its arbor there and blurred, its sections unreadable: given the fourth's, the wheel of its size (estimated). Until 4 October 2026 all three had hub 0.18, rim 0.09
   of the tip radius below the roots and spokes 0.08 (0.9 mm at least): stock proportions */
const WHEEL_PROP={cw:[0.30,0.79,0.10],fw:[0.36,0.83,0.07],tw:[0.36,0.83,0.07]};
const FW_SP=5;   /* the fourth wheel's spokes (Figs. 29, 110: the three train wheels have five each); the train-blocking screw's dog point stands between them */
const MW={cp:14,mw:56,mp:18,hw:54};   /* motion work: cannon pinion 14 : minute wheel 56, minute pinion 18 : hour wheel 54, counted on C Spinner's video (the wheels lying whole on
   the mat, 23:45-23:46; the minute pinion's 18 leaf ends on the wheel's back, 9:06; the cannon pinion's 14 forced by the ratio of 12: References/VIDEOS.md) */
const MWM=(()=>{const d=Math.hypot(...L.Mw);return{a:2*d/(MW.cp+MW.mw),b:2*d/(MW.mp+MW.hw)};})();   /* their modules, from the minute wheel's place (11.3 mm out, C Spinner's video at 40:08) */
/* escape-wheel turns per turn of the fourth, third, centre and fusee wheels: 7.5, 60, 450, 2893 */
const ESC_PER=(()=>{const fw=TRAIN.fw/TRAIN.ep,tw=fw*TRAIN.tw/TRAIN.fp,cw=tw*TRAIN.cw/TRAIN.tp;return{fw,tw,cw,gw:cw*TRAIN.fu/TRAIN.cp};})();
const FUSEE_PER_HOUR=TRAIN.cp/TRAIN.fu,FUSEE_TURNS=8.75; /* "17-1/2 half turns will be required for a full winding" (manual Sec. III) */
const RUN_H=FUSEE_TURNS/FUSEE_PER_HOUR;         /* 56.25 h: runs down when the chain is all on the barrel, the manual's "maximum of 56 hours" and the end of the dial's UP-DOWN scale */
/* wind indicator: wheel 120 (counted on the video), the fusee arbor's pinion 12 (inferred: see TRAIN). Its hand sweeps UD_SWEEP degrees in 56 h, centred on the 6
   (UP at the upper right, DOWN at the upper left); UDA(h) is its angle after h hours, for the hand here and every dial's scale (core.js, essay.js) */
const UD={pin:12,wheel:120,m:2*Math.hypot(L.Fu[0]-L.Ud[0],L.Fu[1]-L.Ud[1])/(12+120)},UD_SWEEP=56*FUSEE_PER_HOUR*UD.pin/UD.wheel*360,UD_UP=180-UD_SWEEP/2,UDA=h=>(UD_UP+UD_SWEEP*h/56)*Math.PI/180;
/* modules from the centre distances in L, so each pair meshes there; fourth: the escape pinion meshes at the 10.585 mm the escape wheel's 9.40 mm from the balance leaves */
const MOD=(()=>{const d=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
  return{fusee:2*d(L.Fu,L.C)/(TRAIN.fu+TRAIN.cp),centre:2*d(L.C,L.T)/(TRAIN.cw+TRAIN.tp),train:2*d(L.T,L.F)/(TRAIN.tw+TRAIN.fp),fourth:2*d(L.F,L.E)/(TRAIN.fw+TRAIN.ep)};})();
/* FK: the fusee and its maintaining work were measured (the side photograph, the restoration video's 27:26-29:05) against the fusee wheel's tips taken as 40.87 mm across;
   at the plate's own scale on the side photograph the wheel is 36.0-36.9 (IDEAS.md 1.12), and the model's, from the centre distance, is (fu+2) m. So every size read off
   those frames scales by FK (0.882): the cone, the wheel's recess and sustaining spring, the two ratchets, the pawls, the end plate, the top's screws and collars. The chain,
   the barrel, the arbor and its square keep theirs. WRT, SRT: the fusee's winding ratchet and the sustaining ratchet (tools/maintaining.py reads them) */
const FK=(TRAIN.fu+2)*MOD.fusee/40.87,WRT={z:36,m:6.9/18.95},SRT={z:120,m:0.27*FK};   /* the winding ratchet's 36 teeth: C Spinner 18:20 (spectral count, 35 and 37 close; References/VIDEOS.md), on the pitch radius it had with 40 */
const EU=(()=>{const dx=L.B[0]-L.E[0],dz=L.B[1]-L.E[1],l=Math.hypot(dx,dz);return[dx/l,dz/l];})(),BETA=Math.atan2(-EU[1],EU[0]);
/* Spring detent escapement: solved by makeEsc in ../shared/escapement.js (shared with the essay and tools/escapement.js), with the centre distance in L (9.40 mm).
   Unit frame: balance at origin, escape wheel centre at x=EX, unit = escape-wheel radius ES */
const ES=13.16/2,ESC=makeEsc({EX:-Math.hypot(L.B[0]-L.E[0],L.B[1]-L.E[1])/ES});
/* the detent support block's top face, against the train bridge (Fig. 90, Fig. 14, KLUwI2UUCMQ 11:08): its screw's hole between two positioning pins on its centre line, in
   detent coordinates (t, n: ESC.D); Fig. 90 scaled by the 11.3 mm from the point of flexure to the locking jewel, to about 0.3 mm. The pins symmetric about the screw,
   as Fig. 90 draws them (11.85 mm apart) and the train bridge's holes show them (KLUwI2UUCMQ 10:00, 10:50: in line with it, 5.7 and 5.5 mm from it); the block runs 15 mm toward
   the foot from the point of flexure, as Fig. 90 draws it (BE in shared/escapement.js; 9.2 until 2 October 2026, shortened to clear a train pillar since moved) */
const DBLK={s:[-0.56,-0.29],p:[[-1.43,-0.29],[0.31,-0.29]]};

/* polygon minus a circle that crosses its boundary: keep the part outside the circle, close it with the arc that runs through the polygon.
   uni: the union instead, closed with the arc that runs outside the polygon */
function subtractCircle(poly,c,r,uni){
  const dense=[];for(let k=0;k<poly.length;k++){const a=poly[k],b=poly[(k+1)%poly.length],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/0.25));for(let t=0;t<n;t++)dense.push([a[0]+(b[0]-a[0])*t/n,a[1]+(b[1]-a[1])*t/n]);}
  const ins=p=>Math.hypot(p[0]-c[0],p[1]-c[1])<r,N=dense.length;
  let s0=-1;for(let k=0;k<N;k++)if(!ins(dense[k])&&ins(dense[(k+N-1)%N])){s0=k;break;}
  if(s0<0)return dense;                       /* circle does not cross the boundary */
  const run=[];let k=s0;while(!ins(dense[k%N])&&run.length<N){run.push(dense[k%N]);k++;}
  const aOf=p=>Math.atan2(p[1]-c[1],p[0]-c[0]),aE=aOf(run[run.length-1]),aS=aOf(run[0]);
  const inPoly=p=>{let w=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const[xi,zi]=poly[i],[xj,zj]=poly[j];if((zi>p[1])!==(zj>p[1])&&p[0]<(xj-xi)*(p[1]-zi)/(zj-zi)+xi)w=!w;}return w;};
  let d=((aS-aE)%TAU+TAU)%TAU;const mid=aE+d/2;if(inPoly([c[0]+r*Math.cos(mid),c[1]+r*Math.sin(mid)])===!!uni)d=d-TAU;
  const n=Math.ceil(Math.abs(d)/0.03);for(let q=1;q<n;q++){const a=aE+d*q/n;run.push([c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)]);}
  return run;
}
/* convex hull of points (Andrew's monotone chain) */
function hull(P){P=[...P].sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),h=[];
  for(const s of[P,[...P].reverse()]){const k=h.length;for(const p of s){while(h.length>=k+2&&cr(h[h.length-2],h[h.length-1],p)<=0)h.pop();h.push(p);}h.pop();}return h;}
/* outline with its stretch from point i0 to point i1 replaced by the outer side of the hull of those two points and pts */
function hullSplice(poly,i0,i1,pts){const H=hull([poly[i0],...pts,poly[i1]]),n=H.length,a=H.indexOf(poly[i0]),b=H.indexOf(poly[i1]);
  const run=d=>{const r=[];for(let k=a;;k=(k+d+n)%n){r.push(H[k]);if(k===b)break;}return r;},f=run(1);return[...poly.slice(0,i0),...(f.length>2?f:run(-1)),...poly.slice(i1+1)];}
/* the upper train bridge's outline (Figs. 29, 67, 110): the disc of radius R less the cut round the barrel (circle bc, br) and the notch round the fusee,
   whose edge e (a polyline) starts outside the rim and ends inside the barrel's cut. The rim runs from the notch's mouth (angle rising) to where the barrel's
   cut meets it, the cut's arc back toward the plate's centre to where the edge enters it, and the edge back to the mouth */
function crescent(R,bc,br,e){
  const hit=(p,q,f)=>{let a=0,b=1;for(let i=0;i<40;i++){const m=(a+b)/2;(f([p[0]+(q[0]-p[0])*m,p[1]+(q[1]-p[1])*m])>0)===(f(p)>0)?a=m:b=m;}return[p[0]+(q[0]-p[0])*a,p[1]+(q[1]-p[1])*a];};
  const fR=x=>Math.hypot(...x)-R,fB=x=>Math.hypot(x[0]-bc[0],x[1]-bc[1])-br,ang=(x,c=[0,0])=>Math.atan2(x[1]-c[1],x[0]-c[0]);
  let i0=0;while(fR(e[i0+1])>0)i0++;const M=hit(e[i0],e[i0+1],fR);
  let i1=i0+1;while(fB(e[i1])>0)i1++;const H=hit(e[i1-1],e[i1],fB);
  /* the rim and the barrel's cut meet where x = -(R²+|bc|²-br²)/(2|bc|) along bc; the meeting on the side the rim reaches first */
  const d=Math.hypot(...bc),u=[bc[0]/d,bc[1]/d],a=(R*R+d*d-br*br)/(2*d),h=Math.sqrt(R*R-a*a),J=[[u[0]*a-u[1]*h,u[1]*a+u[0]*h],[u[0]*a+u[1]*h,u[1]*a-u[0]*h]];
  const aM=ang(M),up=x=>((ang(x)-aM)%TAU+TAU)%TAU,Jr=up(J[0])<up(J[1])?J[0]:J[1],out=[];
  const n1=Math.ceil(up(Jr)/0.02);for(let k=0;k<=n1;k++){const t=aM+up(Jr)*k/n1;out.push([R*Math.cos(t),R*Math.sin(t)]);}
  let b0=ang(Jr,bc),b1=ang(H,bc);const db=((b1-b0)%TAU+TAU)%TAU-TAU;   /* the short way round the cut, toward the plate's centre */
  const n2=Math.ceil(-db/0.02);for(let k=1;k<=n2;k++){const t=b0+db*k/n2;out.push([bc[0]+br*Math.cos(t),bc[1]+br*Math.sin(t)]);}
  for(let k=i1-1;k>i0;k--)out.push(e[k]);return out;}
/* the outline of two overlapping circles (a keyhole): each circle's arc outside the other */
function twoCircles(c1,r1,c2,r2){
  const d=Math.hypot(c2[0]-c1[0],c2[1]-c1[1]),a1=Math.atan2(c2[1]-c1[1],c2[0]-c1[0]),h1=Math.acos((r1*r1+d*d-r2*r2)/(2*r1*d)),h2=Math.acos((r2*r2+d*d-r1*r1)/(2*r2*d)),o=[];
  for(let k=0;k<=80;k++){const t=a1+h1+(TAU-2*h1)*k/80;o.push([c1[0]+r1*Math.cos(t),c1[1]+r1*Math.sin(t)]);}
  for(let k=1;k<40;k++){const t=a1+Math.PI+h2+(TAU-2*h2)*k/40;o.push([c2[0]+r2*Math.cos(t),c2[1]+r2*Math.sin(t)]);}return o;}
/* the outline of a circle with smaller circles [x, z, r] overlapping its rim, apart from one another (a keyhole of several lobes): its arcs between them, then each one's arc outside it */
function lobedCircle(c,r,lobes){
  const Lb=lobes.map(([x,z,r2])=>{const d=Math.hypot(x-c[0],z-c[1]);return{x,z,r2,a:Math.atan2(z-c[1],x-c[0]),h1:Math.acos((r*r+d*d-r2*r2)/(2*r*d)),h2:Math.acos((r2*r2+d*d-r*r)/(2*r2*d))};}).sort((p,q)=>p.a-q.a),o=[];
  Lb.forEach((l,i)=>{const n=Lb[(i+1)%Lb.length],a0=l.a+l.h1;let a1=n.a-n.h1;while(a1<=a0)a1+=TAU;const N=Math.max(2,Math.ceil((a1-a0)/TAU*120));
    for(let k=0;k<=N;k++){const t=a0+(a1-a0)*k/N;o.push([c[0]+r*Math.cos(t),c[1]+r*Math.sin(t)]);}
    const M_=Math.max(8,Math.ceil(n.r2*12));for(let k=1;k<M_;k++){const t=n.a+Math.PI+n.h2+(TAU-2*n.h2)*k/M_;o.push([n.x+n.r2*Math.cos(t),n.z+n.r2*Math.sin(t)]);}});return o;}
/* polygon clipped to where f(p) >= 0 (f continuous; exact for a half-plane, to the edges' length for anything else) */
function clipPoly(poly,f){const out=[];
  for(let i=0;i<poly.length;i++){const P0=poly[i],P1=poly[(i+1)%poly.length],f0=f(P0),f1=f(P1);
    if(f0>=0)out.push(P0);if((f0>=0)!==(f1>=0)){const t=f0/(f0-f1);out.push([P0[0]+(P1[0]-P0[0])*t,P0[1]+(P1[1]-P0[1])*t]);}}
  return out;}
/* polygon of a disc clipped by half-planes z*s > a + b*x  (s=+1 keeps above the line, -1 below) */
function discClip(R,cuts,N=160){
  let poly=[];for(let i=0;i<N;i++){const a=i/N*TAU;poly.push([R*Math.cos(a),R*Math.sin(a)]);}
  for(const[a,b,s]of cuts)poly=clipPoly(poly,p=>s*(p[1]-(a+b*p[0])));
  return poly;
}
/* a solid in two depths, closed and facing out (like polyGeo, unbevelled): the outline out at depth tA, and the part of it outside the circle (c, r) at depth tB,
   with the step's wall on that circle's arc. Top at y 0, depths toward +y. Holes [x,z,r]: through tA inside the circle, through tB outside it; a hole [x,z,r,rc,dc]
   is counterbored rc to dc. cv {r0, tS, n}: a cove under the part inside the circle, its underside at tA within r0 of c, sweeping down as a quarter circle to tS at r,
   where the step goes on to tB (n bands, each triangulated flat). UVs: the top's in plan, as ExtrudeGeometry gives them, so the plate's stripes lie as on the other
   plates; the walls' along one ridge (below) */
function stepGeo(out,c,r,tA,tB,holes,cv){
  const d=p=>Math.hypot(p[0]-c[0],p[1]-c[1]),m=cv?cv.n:0,r0=cv?cv.r0:r,tS=cv?cv.tS:tA,RS=[r];for(let k=m-1;k>=0;k--)RS.push(r0+(r-r0)*Math.sin(Math.PI/2*k/m));   /* RS: the levels, r first, r0 last */
  const prof=p=>{const q=d(p);if(!cv||q<=r0)return tA;const u=Math.min(1,(q-r0)/(r-r0));return tA+(tS-tA)*(1-Math.sqrt(1-u*u));};
  const O=[];for(let k=0;k<out.length;k++){const a=out[k],b=out[(k+1)%out.length];O.push(a);const X=[];   /* the outline, with the points where it crosses each level */
    RS.forEach((R,j)=>{if((d(a)<R)!==(d(b)<R)){let u=0,v=1;for(let i=0;i<40;i++){const w=(u+v)/2,q=[a[0]+(b[0]-a[0])*w,a[1]+(b[1]-a[1])*w];(d(q)<R)===(d(a)<R)?u=w:v=w;}X.push([u,[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u],j]);}});
    X.sort((x,y)=>x[0]-y[0]).forEach(([,q,j])=>{q.lv=j;O.push(q);});}
  const n=O.length,X0=O.map((p,i)=>p.lv===0?i:-1).filter(i=>i>=0);if(X0.length!==2)console.error('stepGeo: the circle crosses the outline '+X0.length+' times');
  const chain=(i,j)=>{const q=[];for(let k=i;;k=(k+1)%n){q.push(O[k]);if(k===j)break;}return q;},[i0,i1]=X0,inA=d(O[(i0+1)%n])<r;
  const A=inA?chain(i0,i1):chain(i1,i0),B=inA?chain(i1,i0):chain(i0,i1);   /* A: the stretch inside the circle (the arm), from crossing to crossing; B: the rest */
  const ins=p=>{let w=false;for(let i=0,j=O.length-1;i<O.length;j=i++){const[xi,zi]=O[i],[xj,zj]=O[j];if((zi>p[1])!==(zj>p[1])&&p[0]<(xj-xi)*(p[1]-zi)/(zj-zi)+xi)w=!w;}return w;};
  const ia=[],ib=[];RS.forEach((R,j)=>{const k=A.map((p,i)=>p.lv===j?i:-1).filter(i=>i>=0);if(k.length!==2)console.error('stepGeo: level '+j+' crosses the arm '+k.length+' times');ia.push(k[0]);ib.push(k[k.length-1]);});
  const arc=(R,p,q)=>{const a0=Math.atan2(p[1]-c[1],p[0]-c[0]);let da=Math.atan2(q[1]-c[1],q[0]-c[0])-a0;da=((da%TAU)+TAU)%TAU;const mid=a0+da/2;if(!ins([c[0]+R*Math.cos(mid),c[1]+R*Math.sin(mid)]))da-=TAU;   /* from p round to q inside the outline, ends left out */
    const na=Math.max(2,Math.ceil(Math.abs(da)*R/0.25)),o=[];for(let k=1;k<na;k++){const t=a0+da*k/na;o.push([c[0]+R*Math.cos(t),c[1]+R*Math.sin(t)]);}return o;};
  const ARCS=RS.map((R,j)=>arc(R,A[ib[j]],A[ia[j]])),ARC=ARCS[0];   /* each level's arc across the arm, from its outer crossing back to its inner one */
  const BP=[...B,...ARC.slice().reverse()];   /* the body's foot */
  const circ=(x,z,rr)=>{const k=Math.max(16,Math.ceil(TAU*rr/0.2)),q=[];for(let i=0;i<k;i++){const t=i/k*TAU;q.push([x+rr*Math.cos(t),z+rr*Math.sin(t)]);}return q;};
  const hA=holes.filter(h=>d(h)<r),hB=holes.filter(h=>d(h)>=r),P=[],U=[];hA.forEach(h=>{if(d(h)+h[2]>r0)console.warn('stepGeo: a hole in the cove');});
  const tri=(a,b,e,ua,ub,ue)=>{P.push(...a,...b,...e);U.push(...ua,...ub,...ue);};
  const face=(poly,hs,y,up,uv=p=>[p[0],-p[1]])=>{const Y=typeof y==='function'?y:()=>y,V=v=>new THREE.Vector2(v[0],v[1]),T=THREE.ShapeUtils.triangulateShape(poly.map(V),hs.map(h=>h.map(V))),all=[...poly,...hs.flat()];   /* up: faces -y (the top) */
    for(const[i,j,k]of T){const[a,b,e]=[all[i],all[j],all[k]],cr=(b[0]-a[0])*(e[1]-a[1])-(b[1]-a[1])*(e[0]-a[0]),f=(cr>0)===up?[a,b,e]:[a,e,b];
      tri(...f.map(p=>[p[0],Y(p),p[1]]),...f.map(uv));}};   /* uv: the stripes' mapping (the top's), or uw: plain polished */
  const rc=Math.cos(STRIPE_ANGLE),rs=Math.sin(STRIPE_ANGLE),uw=p=>{const t=p[0]*rc-p[1]*rs;return[-rs*38.75+t*rc,rc*38.75+t*rs];},pol=p=>[-rs*38.75+p[0]*1e-3,rc*38.75+p[1]*1e-3];   /* pol: a face polished all over, the stripes' map read at one crest (a 2-D patch of it: a 1-D map leaves the normal map's tangents undefined) */   /* walls: along one ridge's crest of the stripes (38.75 mm across them), so they read polished, as the cock's are */
  const wall=(p,q,y0,y1,outward,y1q=y1)=>{const[a,b]=outward?[p,q]:[q,p],[ya,yb]=outward?[y1,y1q]:[y1q,y1],ua=uw(a),ub=uw(b);   /* a quad p->q from y0 down to y1 at p (y1q at q), facing to the right of p->q when outward */
    const A0=[a[0],y0,a[1]],B0=[b[0],y0,b[1]],A1=[a[0],ya,a[1]],B1=[b[0],yb,b[1]];
    tri(A0,A1,B1,ua,ua,ub);tri(A0,B1,B0,ua,ub,ub);};
  const cw=THREE.ShapeUtils.area(O.map(v=>new THREE.Vector2(v[0],v[1])))<0,loop=(L,f)=>{for(let k=0;k<L.length;k++)f(L[k],L[(k+1)%L.length]);};
  const cbr=h=>h[3]?circ(h[0],h[1],h[3]):circ(h[0],h[1],h[2]);
  face(O,[...hA.map(cbr),...hB.map(cbr)],0,true);face(BP,hB.map(h=>circ(...h)),tB,false);
  face([...A.slice(ia[m],ib[m]+1),...ARCS[m]],hA.map(h=>circ(...h)),tA,false,pol);   /* the arm's underside within the last level, plain (the video's undersides are) */
  for(let j=0;j<m;j++)face([...A.slice(ia[j],ia[j+1]+1),...ARCS[j+1].slice().reverse(),...A.slice(ib[j+1],ib[j]+1),...ARCS[j]],[],prof,false,pol);   /* the cove, band by band, polished as on the video (23:45, 41:58) */
  for(const h of[...hA,...hB].filter(h=>h[3])){const R=circ(h[0],h[1],h[3]),I=circ(h[0],h[1],h[2]),F=[...R];face(F,[I],h[4],true);}   /* the counterbore's floor (in the arm or the body) */
  for(let k=0;k<A.length-1;k++)wall(A[k],A[k+1],0,prof(A[k]),!cw,prof(A[k+1]));   /* the arm's edge, down to its underside */
  for(let k=0;k<B.length-1;k++){wall(B[k],B[k+1],0,tS,!cw);wall(B[k],B[k+1],tS,tB,!cw);}   /* the body's, split at tS where the arm's underside meets it */
  const Arc=[A[A.length-1],...ARC,A[0]];for(let k=0;k<Arc.length-1;k++)wall(Arc[k],Arc[k+1],tS,tB,cw);   /* the step under the arm */
  const hole=(L,y0,y1)=>{const ccw=THREE.ShapeUtils.area(L.map(v=>new THREE.Vector2(v[0],v[1])))>0;loop(L,(p,q)=>wall(p,q,y0,y1,!ccw));};   /* faces into the hole */
  for(const h of hA)if(h[3]){hole(circ(h[0],h[1],h[3]),0,h[4]);hole(circ(h[0],h[1],h[2]),h[4],tA);}else hole(circ(...h),0,tA);for(const h of hB)if(h[3]){hole(circ(h[0],h[1],h[3]),0,h[4]);hole(circ(h[0],h[1],h[2]),h[4],tB);}else hole(circ(...h),0,tB);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.computeVertexNormals();return g;}
/* a plate th thick with counterbored holes, closed and facing out (as stepGeo builds it): top at y 0, depth toward +y; holes [x,z,r], or [x,z,r,rc,dc] counterbored rc to dc */
function cbGeo(out,th,holes){const P=[],U=[],V=v=>new THREE.Vector2(v[0],v[1]),tri=(...f)=>{for(const p of f){P.push(...p);U.push(p[0],-p[2]);}};
  const circ=(x,z,r)=>{const k=Math.max(24,Math.ceil(TAU*r/0.1)),q=[];for(let i=0;i<k;i++){const t=i/k*TAU;q.push([x+r*Math.cos(t),z+r*Math.sin(t)]);}return q;};
  const face=(poly,hs,y,up)=>{const T=THREE.ShapeUtils.triangulateShape(poly.map(V),hs.map(h=>h.map(V))),all=[...poly,...hs.flat()];   /* up: faces -y (the top) */
    for(const[i,j,k]of T){const[a,b,e]=[all[i],all[j],all[k]],cr=(b[0]-a[0])*(e[1]-a[1])-(b[1]-a[1])*(e[0]-a[0]),f=(cr>0)===up?[a,b,e]:[a,e,b];tri(...f.map(p=>[p[0],y,p[1]]));}};
  const wall=(L,y0,y1,outward)=>{const ccw=THREE.ShapeUtils.area(L.map(V))>0;for(let k=0;k<L.length;k++){const[a,b]=(ccw===outward)?[L[k],L[(k+1)%L.length]]:[L[(k+1)%L.length],L[k]];
    tri([a[0],y0,a[1]],[a[0],y1,a[1]],[b[0],y1,b[1]]);tri([a[0],y0,a[1]],[b[0],y1,b[1]],[b[0],y0,b[1]]);}};   /* outward: facing out of the loop, else into it */
  const I=holes.map(h=>circ(h[0],h[1],h[2])),C=holes.map(h=>h[3]?circ(h[0],h[1],h[3]):null);
  face(out,holes.map((h,i)=>C[i]||I[i]),0,true);face(out,I,th,false);wall(out,0,th,true);
  holes.forEach((h,i)=>{if(C[i]){face(C[i],[I[i]],h[4],true);wall(C[i],0,h[4],false);wall(I[i],h[4],th,false);}else wall(I[i],0,th,false);});
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.computeVertexNormals();return g;}
/* a hole that crosses the outline or overlaps another hole silently breaks the triangulation: report it */
function checkHoles(tag,holes,inside){holes.forEach(([x,z,r],i)=>{if(inside(x,z)<r+0.05)console.warn(tag+': hole at '+x.toFixed(2)+','+z.toFixed(2)+' r'+r+' crosses the outline');
  holes.forEach(([x2,z2,r2],j)=>{if(j>i&&Math.hypot(x-x2,z-z2)<r+r2+0.05)console.warn(tag+': holes at '+x.toFixed(2)+','+z.toFixed(2)+' and '+x2.toFixed(2)+','+z2.toFixed(2)+' overlap');});});}
function polyGeo(pts,th,holes=[],bev=0){const polyH=holes.filter(h=>h.pts);holes=holes.filter(h=>!h.pts);   /* holes: circles [x,z,r], or {pts} outlines */
  checkHoles('polyGeo',holes,(x,z)=>{let d=1e9;for(let k=0;k<pts.length;k++){const[ax,az]=pts[k],[bx,bz]=pts[(k+1)%pts.length],l2=(bx-ax)**2+(bz-az)**2,t=l2?clamp(((x-ax)*(bx-ax)+(z-az)*(bz-az))/l2,0,1):0;d=Math.min(d,Math.hypot(x-ax-t*(bx-ax),z-az-t*(bz-az)));}return d-bev;});
  /* the outline and its holes go to ExtrudeGeometry clockwise: given a counterclockwise outline it reverses it and turns the holes counterclockwise, and holes wound
     against the outline are bevelled outward, 0.8·bev wider at the faces (the cock, traced the other way round, had its screw holes wider than the heads over them) */
  const cwise=v=>(THREE.ShapeUtils.isClockWise(v)?v:v.reverse()),s=new THREE.Shape();cwise(pts.map(([x,z])=>new THREE.Vector2(x,-z))).forEach((q,i)=>i?s.lineTo(q.x,q.y):s.moveTo(q.x,q.y));s.closePath();
  /* the bevel narrows every hole by 0.8·bev at both faces; a screw hole (4th element set) is drawn that much larger, so it has its size at the faces and a thread fits it */
  for(const[hx,hz,hr,sc]of holes){const h=new THREE.Path();h.absarc(hx,-hz,hr+(sc?bev*0.8:0),0,TAU,true);s.holes.push(h);}
  for(const{pts:hp}of polyH){const h=new THREE.Path();cwise(hp.map(([x,z])=>new THREE.Vector2(x,-z))).forEach((q,i)=>i?h.lineTo(q.x,q.y):h.moveTo(q.x,q.y));h.closePath();s.holes.push(h);}
  const g=extrude(s,{depth:th-2*bev,bevelEnabled:bev>0,bevelThickness:bev,bevelSize:bev*0.8,bevelOffset:-bev*0.8,bevelSegments:1,curveSegments:32});g.rotateX(-Math.PI/2);g.translate(0,bev,0);return g;}
function stadiumPts(p0,p1,w){const dx=p1[0]-p0[0],dz=p1[1]-p0[1],l=Math.hypot(dx,dz),nx=-dz/l*w/2,nz=dx/l*w/2,pts=[];
  const a0=Math.atan2(nz,nx);for(let i=0;i<=16;i++){const a=a0+Math.PI*i/16;pts.push([p0[0]+w/2*Math.cos(a),p0[1]+w/2*Math.sin(a)]);}
  for(let i=0;i<=16;i++){const a=a0+Math.PI+Math.PI*i/16;pts.push([p1[0]+w/2*Math.cos(a),p1[1]+w/2*Math.sin(a)]);}return pts;}
function stadium(p0,p1,w,th,holes=[]){return polyGeo(stadiumPts(p0,p1,w),th,holes);}
/* a straight bar w wide and l long overall (round ends) along the unit u through c, with a round boss of radius r at c */
function barBossPts(c,u,l,w,r){const v=[-u[1],u[0]],P=(t,n)=>[c[0]+t*u[0]+n*v[0],c[1]+t*u[1]+n*v[1]],t0=l/2-w/2,a=Math.atan2(w/2,Math.sqrt(r*r-w*w/4)),o=[],arc=(ct,rr,f0,f1,N)=>{for(let k=0;k<=N;k++){const f=f0+(f1-f0)*k/N;o.push(P(ct+rr*Math.cos(f),rr*Math.sin(f)));}};
  arc(t0,w/2,-Math.PI/2,Math.PI/2,16);arc(0,r,a,Math.PI-a,40);arc(-t0,w/2,Math.PI/2,1.5*Math.PI,16);arc(0,r,Math.PI+a,TAU-a,40);return o;}

/* screw holes: thread radius sR for a head of radius r; a clearance hole (hC) where the screw passes through a part, a tapped hole (hT) where it screws in; [x, z, r, 1] as polyGeo takes (the 1: polyGeo keeps its size at the faces, below) */
const sR=r=>r*0.5,hC=(x,z,r,rs=sR(r))=>[x,z,+(rs*1.12+0.01).toFixed(3),1],hT=(x,z,r,rs=sR(r))=>[x,z,+(rs+0.02).toFixed(3),1];   /* rs: a thread radius other than half the head's */

/* ratchet tooth profile (as gearGeo's ratchet) in the wheel's own XZ frame: radius at XZ angle b */
function ratchetProf(n,m,flip){const rp=m*n/2,ro=rp+m*0.95,ri=ro-2.25*m,p=TAU/n;
  return{ro,ri,p,r:b=>{const a=flip?b:-b,t=(((a%p)+p)%p)/p;return t<0.9?ri+(ro-ri)*t/0.9:t<0.97?ro-(ro-ri)*(t-0.9)/0.07:ri;}};}
/* outline of pawlGeo(len,w) in the pawl's own XZ frame (pivot at the origin, tip toward -x); point PAWL_TIP is the tip corner */
const PAWL_TIP=50;
function pawlPts(len,w){const r=w*0.72,S=[[0,r]];for(let k=1;k<=12;k++){const a=Math.PI/2-Math.PI*k/12;S.push([r*Math.cos(a),r*Math.sin(a)]);}
  const E=[[-len*0.8,-w*0.26],[-len,-w*0.62],[-len*0.96,w*0.08]];for(let k=1;k<=32;k++)S.push([-len*0.8*k/32,-r*(1-k/32)-w*0.26*k/32]);
  for(let i=0;i<2;i++)for(let k=1;k<=6;k++){const[a0,b0]=E[i],[a1,b1]=E[i+1];S.push([a0+(a1-a0)*k/6,b0+(b1-b0)*k/6]);}
  for(let k=1;k<=30;k++){const t=k/30,x0=-len*0.96,y0=w*0.08,cx=-len*0.5,cy=w*0.42;S.push([(1-t)**2*x0+2*t*(1-t)*cx,(1-t)**2*y0+2*t*(1-t)*cy+t*t*r]);}
  return S.map(([x,y])=>[x,-y]);}
/* flat spring: a strip w wide along a polyline in XZ, th tall from y 0 up (+y) */
function stripGeo(pts,w,th){const L2=[],R2=[];pts.forEach((p,i)=>{const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz);
  L2.push([p[0]-dz/l*w/2,p[1]+dx/l*w/2]);R2.push([p[0]+dz/l*w/2,p[1]-dx/l*w/2]);});return polyGeo(L2.concat(R2.reverse()),th);}
/* outline of the region where f(x, z) < 0 inside a box, by marching squares on an h grid (each crossing on its cell edge, a saddle split by the cell's centre):
   the longest loop, thinned to within 0.004 mm (Ramer-Douglas-Peucker); the fine grid is worked only near the boundary. For parts drawn as bars joined by fillets: f a union of distances (smooth where filleted) */
function sdfOutline(f,x0,z0,x1,z1,h){const G=8,nX=Math.ceil((x1-x0)/h/G),nZ=Math.ceil((z1-z0)/h/G),nx=nX*G,nz=nZ*G,W=nx+1,V=new Float64Array(W*(nz+1)),C=new Float64Array((nX+1)*(nZ+1)),far=0.75*G*h;
  for(let J=0;J<=nZ;J++)for(let I=0;I<=nX;I++)C[J*(nX+1)+I]=f(x0+I*G*h,z0+J*G*h);   /* a coarse grid G cells to one: a coarse cell whose corners are all farther than far from the boundary, on one side, is all on that side (f no steeper than a distance) */
  for(let j=0;j<=nz;j++)for(let i=0;i<=nx;i++){const I=Math.min(nX-1,(i/G)|0),J=Math.min(nZ-1,(j/G)|0),k=J*(nX+1)+I,a=C[k],b=C[k+1],c=C[k+nX+1],d=C[k+nX+2];
    V[j*W+i]=(a>far&&b>far&&c>far&&d>far?far:a<-far&&b<-far&&c<-far&&d<-far?-far:f(x0+i*h,z0+j*h))||1e-9;}
  const P=new Map(),adj=new Map(),key=(i,j,e)=>{const k=(j*W+i)*2+e;if(!P.has(k)){const a=V[j*W+i],b=e?V[(j+1)*W+i]:V[j*W+i+1],t=a/(a-b);P.set(k,e?[x0+i*h,z0+(j+t)*h]:[x0+(i+t)*h,z0+j*h]);}return k;},
    link=(p,q)=>{for(const[u,w]of[[p,q],[q,p]]){if(!adj.has(u))adj.set(u,[]);adj.get(u).push(w);}};
  for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){const a=V[j*W+i]<0,b=V[j*W+i+1]<0,c=V[(j+1)*W+i+1]<0,d=V[(j+1)*W+i]<0,E=[];
    if(a!==b)E.push(key(i,j,0));if(b!==c)E.push(key(i+1,j,1));if(d!==c)E.push(key(i,j+1,0));if(a!==d)E.push(key(i,j,1));
    if(E.length===2)link(E[0],E[1]);else if(E.length===4){const m=(V[j*W+i]+V[j*W+i+1]+V[(j+1)*W+i+1]+V[(j+1)*W+i])/4<0;   /* E: bottom, right, top, left */
      if(a===m){link(E[0],E[1]);link(E[2],E[3]);}else{link(E[3],E[0]);link(E[1],E[2]);}}}
  const seen=new Set();let best=[];for(const s of adj.keys()){if(seen.has(s))continue;const loop=[];let p=null,q=s;
    while(q!==undefined&&!seen.has(q)){seen.add(q);loop.push(P.get(q));const n=adj.get(q),r=n[0]===p?n[1]:n[0];p=q;q=r;}if(loop.length>best.length)best=loop;}
  const rdp=(Q,t)=>{if(Q.length<3)return Q;const[A,B]=[Q[0],Q[Q.length-1]],dx=B[0]-A[0],dz=B[1]-A[1],l=Math.hypot(dx,dz)||1e-9;let m=0,k=0;
    for(let i=1;i<Q.length-1;i++){const e=Math.abs((Q[i][0]-A[0])*dz-(Q[i][1]-A[1])*dx)/l;if(e>m){m=e;k=i;}}return m>t?[...rdp(Q.slice(0,k+1),t).slice(0,-1),...rdp(Q.slice(k),t)]:[A,B];};
  const h2=best.length>>1;return[...rdp(best.slice(0,h2+1),0.004).slice(0,-1),...rdp([...best.slice(h2),best[0]],0.004).slice(0,-1)];}
/* the point where a spring bears on a pawl's arm, c mm from its pivot, on the side facing away from its ratchet's centre (pawl at q, angle th,
   ratchet centre at o, all in one XZ frame): returns the point and that side's outward normal */
function pawlBack(pts,c,q,th,o){const co=Math.cos(th),sn=Math.sin(th),W=(x,z)=>[q[0]+x*co+z*sn,q[1]-x*sn+z*co];let best=null;
  for(const s of[1,-1]){const zs=pts.filter(([x])=>Math.abs(x+c)<0.25).map(([,z])=>z),z=s>0?Math.max(...zs):Math.min(...zs),p=W(-c,z),n=[s*sn,s*co];
    if(!best||n[0]*(p[0]-o[0])+n[1]*(p[1]-o[1])>best.out)best={p,n,out:n[0]*(p[0]-o[0])+n[1]*(p[1]-o[1])};}return best;}
/* pawl resting on a ratchet: pivot q and pawl angle th0 given in the ratchet's frame (centre at the origin); returns the pawl angle at which it just
   touches the teeth, rotating it in from th0. Pawl rotation as three.js rotation.y */
/* the pawl's outline with points every 0.1 mm along its edges, so a tooth's tip can't pass between two of its vertices (cached per outline) */
const DENSE=new WeakMap(),dense=pts=>{let d=DENSE.get(pts);if(!d){d=[];for(let i=0;i<pts.length;i++){const[a,b]=[pts[i],pts[(i+1)%pts.length]],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/0.1));
  for(let k=0;k<n;k++)d.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n]);}DENSE.set(pts,d);}return d;};
/* the same points with their distance from the pivot, farthest first (cached per outline): a point d from the pivot never comes nearer the ratchet's centre than |q|-d,
   so seatPawl tests only the leading ones that can reach within ro+0.5 of it, and gets the same answer for about half the work (it runs every frame for each pawl) */
const NEAR=new WeakMap(),near=pts=>{let d=NEAR.get(pts);if(!d){d=dense(pts).map(([x,z])=>[x,z,Math.hypot(x,z)]).sort((a,b)=>b[2]-a[2]);NEAR.set(pts,d);}return d;};
function seatPawl(pts,q,th0,pr){
  const P=near(pts),lim=Math.hypot(q[0],q[1])-pr.ro-0.5-1e-9;let n=0;while(n<P.length&&P[n][2]>lim)n++;
  const f=th=>{const c=Math.cos(th),sn=Math.sin(th);let m=1e9;for(let i=0;i<n;i++){const x=P[i][0],z=P[i][1],X=q[0]+x*c+z*sn,Z=q[1]-x*sn+z*c,r=Math.hypot(X,Z);if(r<pr.ro+0.5)m=Math.min(m,r-pr.r(Math.atan2(Z,X)));}return m;};
  const tip=pts[PAWL_TIP],tr=th=>{const c=Math.cos(th),sn=Math.sin(th);return Math.hypot(q[0]+tip[0]*c+tip[1]*sn,q[1]-tip[0]*sn+tip[1]*c);};
  const so=tr(th0+0.01)>tr(th0)?1:-1;let a=th0+so*0.5,b=th0-so*0.5;if(f(b)>=0)return b;if(f(a)<0)return a;
  for(let i=0;i<28;i++){const m=(a+b)/2;f(m)>=0?a=m:b=m;}return a;}
/* wheel rotation (within one tooth) at which a pawl, pivot q and angle th0 in the parent frame (wheel centre at the origin), rests at the bottom of a
   tooth space against a steep face; dir = +1: the face meets it when the wheel turns with rotation.y rising, -1: falling. Returns wheel and pawl angles */
function phaseAgainst(pr,pts,q,th0,dir){let best=/** @type {any} */(null);const N=240;
  for(let i=0;i<N;i++){const psi=pr.p*i/N,ql=toWheel(q,[0,0],psi),th=seatPawl(pts,ql,th0-psi,pr),c=Math.cos(th),sn=Math.sin(th),t=pts[PAWL_TIP];
    const r=Math.hypot(ql[0]+t[0]*c+t[1]*sn,ql[1]-t[0]*sn+t[1]*c);(best=best||[]).push([psi,r,th+psi]);}
  const rmin=Math.min(...best.map(b=>b[1]));let k=best.findIndex(b=>b[1]<rmin+0.004);
  /* walk along the plateau of deepest rest in the direction the face arrives from, to its end */
  for(let j=0;j<N;j++){const n=(k+dir+N)%N;if(best[n][1]<rmin+0.004)k=n;else break;}
  k=(k-4*dir+N)%N;   /* back off 0.6 % of a tooth: the teeth are drawn as chords, the profile interpolates by angle */
  return{psi:best[k][0],th:best[k][2]};}
/* point / angle from a parent frame into a wheel's frame (wheel at c, rotation.y psi) */
const toWheel=(p,c,psi)=>{const x=p[0]-c[0],z=p[1]-c[1],co=Math.cos(psi),sn=Math.sin(psi);return[x*co-z*sn,x*sn+z*co];};

function buildMovement(M){
  const mv=new THREE.Group(),parts={},R={};const V2=(a,b)=>new THREE.Vector2(a,b);
  /** @param {string} name its key (PARTS in app.js) @param {number} off its rise in the Exploded view (mm) @param {boolean} [ef] in the escapement's frame: returns that group */
  const part=(name,off,ef)=>{const g=new THREE.Group();g.userData.off=off;g.userData.partName=name;mv.add(g);parts[name]=g;
    if(ef){const e=new THREE.Group();e.position.set(L.B[0],0,L.B[1]);e.rotation.y=BETA;g.add(e);g.userData.ef=e;return e;}return g;};
  /* screw: a fillister head seated at y (in p's frame), the head toward -y, and a threaded shank len mm long toward +y, into the parts it holds (Figs. 108-110 draw
     every screw with its shank). Thread diameter half the head's (sR); the parts it passes through have clearance holes (hC) and the part it screws into a tapped hole (hT).
     Head, shank and slot are one group, which the Exploded view lifts out of its holes along the screw's axis, as the manual's exploded views draw them (SCREWS) */
  const SCREWS=[],loose=(g,lift)=>{g.userData.y0=g.position.y;g.userData.lift=lift;SCREWS.push(g);return g;};   /* loose: g moves on its own in the Exploded view, lift mm toward its frame's -y past its part */
  const headOn=(g,p,q)=>{g.userData.lift+=parts[p].userData.off-parts[q].userData.off;return g;};   /* a screw of part p put in through part q: it leaves with q, then lifts out of it */
  /** @type {(p:any,...xzy_r_h_len_rs:number[])=>any} in frame p: x, z, y (the head's seat), then the head's radius and height, the shank's length and the thread's radius; numbers, so a place can be spread in (...S.blk) */
  const screw=(p,x,z,y,r=2.2,h=1.1,len=0,rs=sR(r))=>{const c=Math.min(0.35,r*0.14),pr=[V2(0,-h),V2(r-c,-h),V2(r,-h+c),V2(r,0)];
    if(len>0){const pt=clamp(rs*0.42,0.06,0.3),d=pt*0.3,n=Math.max(1,Math.floor((len-pt*0.6)/pt));pr.push(V2(rs,0),V2(rs,len-n*pt-d));   /* rings of thread (drawn as turned grooves, not a helix), a chamfered tip */
      for(let i=0;i<n;i++){const a=len-(n-i)*pt-d;pr.push(V2(rs-d,a+pt/2),V2(rs,a+pt));}pr.push(V2(rs-d,len),V2(0,len));}
    else pr.push(V2(0,0));
    const g=new THREE.Group();g.position.set(x,y,z);p.add(g);loose(g,len+h+1.5);g.userData.sc={r,h,len,rs};
    const hd=mesh(g,new THREE.LatheGeometry(pr,28),M.steel);hd.userData.screw=r;const sl=mesh(g,new THREE.BoxGeometry(r*2.02,Math.min(0.55,h*0.45),Math.max(0.35,r*0.2)),M.steelD,0,-h+Math.min(0.55,h*0.45)/2-0.02,0);sl.rotation.y=(x*7+z*3)%3;return g;};
  const ring=ringGeo;R.ring=ring;
  const JWR=1.13,jewel=(p,x,z,[si,ji],b=0,r=1.1,d=0,jm=M.ruby,hr=0.27)=>{hn(mesh(p,d?new THREE.LatheGeometry([V2(JWR,b+1.2),V2(r,b+1.2),V2(r,b-d),V2(1.1,b-d),V2(1.1,b),V2(JWR,b),V2(JWR,b+1.2)].reverse(),48):ring(r,JWR,1.2),M.gilt,x,d?0:b+0.6,z),si);hn(mesh(p,stoneGeo(JWR,hr,0.4,'bar'),jm,x,b+0.2,z),ji);};   /* bar-hole jewel in the lower train bridge: a setting 1.2 deep pressed into the bridge's dial-side face (b: its bottom), the stone seated in it at the train side (its oil sink toward the dial); si, ji: their parts-list lines; d: the setting runs on d below b, bored 1.1 there, to the bridge's train-side face (KLUwI2UUCMQ 34:30: gilt there, r 2.5, seen through the plate's opening); jm: the stone's material; hr: its hole. The stones r 1.13 (JWR; r 0.62, estimated, until 4 October 2026): both held to the light in the bridge, KLUwI2UUCMQ 15:00-15:06, r 213-220 px against the bar's 1,990 across (10.3 mm, measured at 40:08 and 14:40), 1.13 (1.23 by the third-to-fourth distance, 2,004 px for 11.30); the holes their own (below) */
  /* endstone cap (42159, 42160): a steel plate over a setting with the cap jewel showing through its centre, two screws (20762) at ±2.1 mm along u into the part under it.
     Built in frame g with the part's face at y and the cap toward -y; depth: how far the screws go into the part */
  const endCap=(g,x,z,u,y,depth,sp,[ci,ji,si],rc,fl,th=0.3,win=0,hr=ESCAP,bore=0)=>{const FL=fl?(Array.isArray(fl[0])?fl:[fl]):[];const a=[x-u[0]*sp,z-u[1]*sp],b=[x+u[0]*sp,z+u[1]*sp],sh=[hC(...a,hr,0.225),hC(...b,hr,0.225)],er=bore?bore+0.15:0.55;   /* ci, ji, si: the parts-list lines of the cap, its jewel and its screws; rc: a round cap of that radius; fl: [nx, nz, d] (or a list of them), cut flat d from the jewel across that normal; th: its thickness */
    const out=rc?[...Array(64).keys()].map(k=>{let p=[rc*Math.cos(k*TAU/64),rc*Math.sin(k*TAU/64)];for(const f of FL){const e=f[0]*p[0]+f[1]*p[1]-f[2];if(e>0)p=[p[0]-f[0]*e,p[1]-f[1]*e];}return[x+p[0],z+p[1]];}):stadiumPts(a,b,1.6);
    if(bore){hn(mesh(g,polyGeo(out,th-0.26,[[x,z,bore],...sh]),M.steel,0,y-th,0),ci);hn(mesh(g,polyGeo(out,0.26,[[x,z,er],...sh]),M.steel,0,y-0.26,0),ci,{sub:1});}   /* bore: a straight window that radius, the endstone wider in a seat under it */
    else hn(mesh(g,polyGeo(out,th,[[x,z,win||0.55],...sh]),M.steel,0,y-th,0),ci);
    hn(mesh(g,cylY(er,0.26,24),M.ruby,x,y-0.13,z),ji);   /* the endstone set in the cap, flush with its face on the hole jewel */
    if(win)hn(mesh(g,new THREE.LatheGeometry([V2(0.55,y),V2(win,y),V2(win,y-th),V2(0.55,y)].reverse(),40),M.steel,x,0,z),ci,{sub:1});   /* win: a conical window down to the endstone, 90 deg, its top win across */
    for(const q of[a,b])hn(screw(g,...q,y-th,hr,0.2,th+depth,0.225),si);};   /* hr: the screws' heads (20762; their threads r 0.225 whatever the head) */
  const y0=-PP_T;
  /* ---------- screw positions (x, z), worked out before the plates are cut: a clearance hole where a screw passes through a part (hC), a tapped hole where it holds (hT).
       42055 (pillar, bridge and mounting-ring screws) have heads r 2.9; ESCAP: the endstone caps' screws (20762) ---------- */
  const add=(a,b,k=1)=>[a[0]+b[0]*k,a[1]+b[1]*k],sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],unit=a=>{const l=Math.hypot(...a);return[a[0]/l,a[1]/l];},ry=(a,/** @type {number[]} */[x,z])=>[x*Math.cos(a)+z*Math.sin(a),-x*Math.sin(a)+z*Math.cos(a)];
  const eu=unit(sub(L.E,L.B)),lbu=unit(sub(L.F,L.B)),ESCAP=0.45,PSR=2.77,PSH=2.0;   /* the pillar screws' heads (42055): r 2.77 and 2.0 tall, a head standing on the barrel bridge in profile on the side
     photograph (105 by 38 px at its 18.93 px/mm, the plate's measured 87.57 mm across: +-0.1 mm); r 2.9 and 1.6 tall until 4 October 2026, unsourced. Their shanks half that (sR) */
  /* the escape upper bridge's length (ebu): 72 deg round from the balance-escape line, across it (KLUwI2UUCMQ 10:00, from above: its end screws' line, 68 deg until the escape
     arbor's move; 13:44, where its screws land on the two lugs either side of the keyhole's escape lobe); ebn: across it, toward the balance */
  const ebu=(f=>[eu[0]*Math.cos(f)-eu[1]*Math.sin(f),eu[0]*Math.sin(f)+eu[1]*Math.cos(f)])(72*D2R),ebn=(v=>v[0]*(L.B[0]-L.E[0])+v[1]*(L.B[1]-L.E[1])>0?v:[-v[0],-v[1]])([-ebu[1],ebu[0]]);
  const ltu=unit(sub(L.F,L.T)),S={ltb:[add(L.T,ltu,-13.6),add(L.F,ltu,6.1)],ltbp:[add(L.T,ltu,-16.4),add(add(L.F,ltu,2.6),[-ltu[1],ltu[0]],3.4)],pil:[...PILLARS.train,PILLARS.barrel],tb:PILLARS.train,bb:[PILLARS.barrel,PT([32.11,-4.1]),PT([-11.07,26.46])],
    ring:[100,210,340].map(a=>[40.6*Math.cos(a*D2R),40.6*Math.sin(a*D2R)]),eb:[8.3,-8.3].map(f=>add(L.E,ebu,f)),ebp:[9.9,-9.9].map(f=>add(add(L.E,ebu,f),ebn,1.3)),ebc:[3.1,-3.1].map(f=>add(L.E,ebu,f)),elc:[2.1,-2.1].map(f=>add(L.E,eu,f)),
    lb:[[18.34,12.02],[-14.2,19.0]],lbp:[[20.62,14.01],[-13.6,16.4]],blc:[3.25,-3.25].map(f=>add(L.B,lbu,f)),blk:(q=>add(L.B,ry(BETA,[q.x*ES,q.y*ES])))(ESC.D(...DBLK.s)),dpin:DBLK.p.map(([t,n])=>(q=>add(L.B,ry(BETA,[q.x*ES,q.y*ES])))(ESC.D(t,n))),cock:PT([33.11,12.62]),ckp:[[35.5,5.0],[26.9,19.8]].map(PT)};   /* cock screw: 0.3 mm off its traced position (within the tracing's 0.4 mm), so its thread cleared the old foot's edge.
     ckp: the cock's steady pins, at the two plain holes the train bridge shows under the cock with it off (C Spinner 6:47), placed to about 2 mm */
  /* lb: the balance lower bridge's screws (42055), put in from below through its lugs into the train bridge, where the restoration video has them (13:49.5, measured face-on): at the
     slab's end on the 3 o'clock side (outside every wheel, over the access hole in the pillar plate), and at the fourth end beyond the train-blocking screw (Fig. 30's order); lbp: its
     steady pins, one in each lug (tools/lower_bridge.py) */
  const ARM_S=0.8,ARM_U=-120*D2R,ARM_BOW=0.25,TBS_R=1.05,TB_CB=2.65;   /* ARM_U: the locking arm's swing from locked to unlocked, in the plan (x toward z) */   /* TB_CB: the train bridge's counterbore for its third screw (r, 23:30) */
  /* balance locking arm: its finger (S.armF) stands 15.6 mm from the staff on the counterclockwise side of the timing weight that rests on the 6 o'clock side (at the arm's end,
     180 - BETA with the balance at rest), 0.02 clear of it; the arm turns on its screw (S.arm) outside the balance's sweep, back over the screw 120 deg (ARM_U) to its stop pin (42300, pressed into the train bridge): turned 90 deg
     the other way, out from the staff, it would reach the cock and the second train pillar's screw head, which the photographed group's move brought beside it. Fig. 9 draws
     the arm turning the other way, out from the balance (its hatched arrow and the dashed unlocked arm), which the pillar screw's head (1.6 proud, 4 mm out) and the cock's foot leave
     no room for here (Review-results.md, BOM comparison, still open 9). Fig. 9 draws it beside the cock's foot, the barrel bridge's horn and its large slotted screw. Since the escape arbor's move (2 October 2026) turned the balance's
     rest 11.8 deg, its screw stands clear of the cock's foot: 45 deg round from the weight since the weights were put at the arm's ends (3 October 2026; 30 before, 18 before the
     escape arbor's move); turned 12 deg with its weight, the screw would stand in the cock's foot, and on the weight's other side too. The arm, locked, runs between the cock's
     foot and the escape upper bridge: 0.8 wide and bowed 0.25 away from the staff (ARM_BOW; 1.0 and 0.6 until then) it clears both, by little (fine.py --hold) */
  { const TWA=Math.PI-BETA,FR=15.6,FA=TWA+Math.asin(1.62/FR)+0.02/FR;S.armF=add(L.B,[Math.cos(FA),Math.sin(FA)],FR);S.arm=add(L.B,[Math.cos(TWA+45*D2R),Math.sin(TWA+45*D2R)],20);
    /* unlocked, turned ARM_U from its locked direction (dU). The stop pin stands on the arm's leading side
       1.5 along it, clear of its bow (ARM_BOW at mid-length, away from the staff) */
    const dot=(a,b)=>a[0]*b[0]+a[1]*b[1],dL=unit(sub(S.armF,S.arm)),rp=v=>[-v[1],v[0]],rm=v=>[v[1],-v[0]],dU=[dL[0]*Math.cos(ARM_U)-dL[1]*Math.sin(ARM_U),dL[0]*Math.sin(ARM_U)+dL[1]*Math.cos(ARM_U)],n=ARM_U<0?rm(dU):rp(dU),AE=Math.hypot(...sub(S.armF,S.arm))+0.45,
      bowOut=-Math.sign(dot(sub(L.B,S.arm),rp(dL))),bowU=dot(rp(dU),n)*bowOut;   /* the bow's side, locked (local +z = rp(dL)) and then unlocked (local +z = rp(dU)) */
    S.armPin=add(add(S.arm,dU,1.5),n,0.82+Math.max(0,bowU)*ARM_BOW*Math.sin(Math.PI*1.5/AE)); }
  /* train-blocking screw (42247): over the fourth wheel's spokes, its dog point 6.35 mm from the fourth's setting, between it and the lower bridge's far lug, where the restoration
     video has it (KLUwI2UUCMQ 13:49.5, framecam over f 5000-7000, to about 0.4 mm; Fig. 30's proportions agree): the measured offset from the setting, turned with the train bridge's
     frame (PR). Its access hole through the train bridge about 2.3 mm across at the top with its countersink (10:00; the dark hole of the top-view photograph), its head (r 1.05,
     estimated) seating in it. Until 2 October 2026 at (3.9, 26.15), 4.5 mm from the arbor, while the turned detent covered this place. TBd: from the arbor toward it */
  S.tBlock=add(L.F,PR([-6.14,-1.61]));const TBd=unit(sub(S.tBlock,L.F)),TBr=Math.hypot(...sub(S.tBlock,L.F));
  const EPa=Math.atan2(-0.24,-5.83)-PHOTO_TURN,EPu=ry(EPa,[1,0]),EP=[[2.75,0],[-2.75,0]];S.ep=EP.map(q=>add(L.B,ry(EPa,q)));   /* balance upper endstone cap: along the cock's straight edge (x toward the nose), its screws 2.75 either side of the staff (top-view photograph) */
  const PB=(r,a)=>[L.Ba[0]+PHOTO_K*r*Math.cos(a*D2R+PHOTO_TURN),L.Ba[1]+PHOTO_K*r*Math.sin(a*D2R+PHOTO_TURN)];S.cover=[PB(11.1,107),PB(11.6,288)];S.click=PB(8.95/PHOTO_K,253.1);   /* the setup click's pivot, whose end shows in the cover, 8.95 mm from the barrel arbor on both photographs (photo-movement-2E12055: 8.94 at 255.6 deg, the top-view photograph: 8.95 at 250.6, each through its fitted map); C Spinner's video, oblique, read 10-10.5 by eye (11:58). The click from it to its tip is 5.07 mm (the video: about 5.3, the top-view photograph 5.1) */
  S.dial=[38.5,111.6,218.5,291.6].map(a=>{const q=PT([45.9*Math.cos(a*D2R),45.9*Math.sin(a*D2R)]),l=Math.hypot(...q);return[45.9*q[0]/l,45.9*q[1]/l];});   /* four dial feet and screws (35756, 4; Fig. 107), in the mounting ring's flange outside the plate: the top-view photographs show two, at 38.5 and 111.6 deg; the other two opposite them (estimated) */
  S.seal=[2.2,-1.0].map(a=>[L.Fu[0]+PHOTO_K*7.6*Math.cos(a+PHOTO_TURN),L.Fu[1]+PHOTO_K*7.6*Math.sin(a+PHOTO_TURN)]);
  /* ---------- pillar plate 87.57 x 3.86 mm, mounting ring, lower train bridge ---------- */
  const pp=part('pillar',0);
  /* sustaining pawl pivot, its foot read on two frames of KLUwI2UUCMQ (References/VIDEOS.md): 36:15 (4K) through rimfit_36-15.json's camera, 21.8 mm from the fusee axis at 67 deg
     round it (65.6-67.7 over f 5000-8000, about 1 mm), and 14:06, nearly overhead, through a homography on the plate's centre, fusee and barrel bushings and three pillars' feet
     (0.4-1.2 mm off them), 21.7 at 71 deg: 21.8 at 69, in the fusee's notch of the train bridge, on the third pillar's side; 1.38 mm outside the fusee wheel's tips, so the hub at the
     arbor's foot (r 1.1) clears them. It was 21.35 at 74 deg, placed for clearance. SPt: the pawl's tip on the sustaining ratchet (rp 16.2 FK), 20 deg back round the ratchet from the
     pivot; SPl its length, SPb0 the pawl's rotation.y when its tip is there. SPb: the side of the pawl's frame (the sign of its z) away from the ratchet, where its blade bows and its
     spring wire stands; SPw the wire's foot in that frame (2.0 along, 1.7 across: 36:15 has it about 2.7 mm from the arbor in the blade's root, on that side). spW(th, q): a point q of
     the pawl's frame in plan, the pawl at rotation.y th. SPh: the wire's foot with the pawl turned 0.12 rad further in than with its tip at SPt: the wire's top stands in its hole in
     the train bridge there, so the bent wire turns the pawl into the teeth */
  /* SPN, SPE: the blade's edges as KLUwI2UUCMQ 36:15 shows them (traced and put through rimfit_36-15.json's camera at the blade's height, 6 mm over the plate), mm along the blade from the
     arbor and across it: SPN the edge toward the ratchet, its last point the tip's corner, which meets the teeth; SPE the back, bowed away from the ratchet. SPl: the corner's distance
     from the arbor; SPt: where it rests on the ratchet's pitch circle (rp 16.2 FK), behind the pivot */
  const SPN=[[1.04,-2.33],[2.16,-1.25],[3.39,-0.61],[5.30,-0.06],[7.23,0.21],[8.88,-0.06],[10.21,-0.58]],SPE=[[2.47,2.06],[4.07,2.49],[6.03,2.67],[8.03,2.27],[9.57,1.50],[10.45,0.60]];
  const SPl=Math.hypot(...SPN[6]),SPd=Math.atan2(SPN[6][1],SPN[6][0]),SPr=21.8,SPa=55*D2R+PR_TURN,SPv=[L.Fu[0]+SPr*Math.cos(SPa),L.Fu[1]+SPr*Math.sin(SPa)],
    SPg=Math.acos((SPr**2+(16.35*FK)**2-SPl**2)/(2*SPr*16.35*FK)),SPt=[L.Fu[0]+16.35*FK*Math.cos(SPa-SPg),L.Fu[1]+16.35*FK*Math.sin(SPa-SPg)];
  const SPb0=Math.atan2(SPt[1]-SPv[1],-(SPt[0]-SPv[0])),spW=(th,q=SPw)=>[SPv[0]+q[0]*Math.cos(th)+q[1]*Math.sin(th),SPv[1]-q[0]*Math.sin(th)+q[1]*Math.cos(th)];
  const SPb=Math.sign(Math.sin(SPb0)*((SPv[0]+SPt[0])/2-L.Fu[0])+Math.cos(SPb0)*((SPv[1]+SPt[1])/2-L.Fu[1])),SPw=[-2.0,1.7*SPb];
  const SPh=(()=>{const tr=t=>{const q=spW(t,[-SPl,0]);return Math.hypot(q[0]-L.Fu[0],q[1]-L.Fu[1]);};return spW(SPb0-(tr(SPb0+0.01)>tr(SPb0)?1:-1)*0.12);})();
  /* the opening under the lower train bridge, round the third arbor (KLUwI2UUCMQ 34:30, the bare plate from the train side with the bar in it, and 40:08, the dial side: References/VIDEOS.md,
     "The plate's opening under the lower train bridge"): a circle r 11.3 about the third (11.2-11.5 over both frames and the focal lengths they allow), a lobe r 4.85 toward the balance
     and a bore r 3.2 about the fourth (its setting, at the bar's face, shows through it from the train side); the third wheel turns in it and shows through from the dial side */
  const PP_KEY={r:11.3,lobes:[[2.9,10.9,4.85],[...L.F,3.2]]};
  R.pillarPlate=mesh(pp,discGeo(PP_R,PP_T,[[...L.C,1.5],{pts:lobedCircle(L.T,PP_KEY.r,PP_KEY.lobes)},...S.ltbp.map(q=>[...q,0.41]),[...L.Fu,1.4],hC(...L.Ud,0.8),hC(...L.Mw,0.8),[...L.Ba,1.9],[...L.E,1.3],[...SPv,0.52],
    ...S.ltb.map(q=>hT(...q,1.4)),...S.pil.map(q=>hC(...q,PSR)),...S.ring.map(q=>hC(...q,PSR)),...S.elc.map(q=>hT(...q,ESCAP)),[...S.lb[0],3.4]]),M.plate,0,y0,0);hn(pp,'42060');   /* the plate's parts-list line on its part, so its pins go with it */
  /* the last hole: access to the balance lower bridge's screw at 3 o'clock, for taking the bridge off without taking the movement down (RMG No. 4E019), under the dial */
  /* lower bushings and settings in the pillar plate (parts list, Fig. 110): centre, fusee, barrel; escape lower jewel. Proud 0.1 on the train side */
  const bushR=(p,x,z,y1,y2,ro,ri,mat)=>mesh(p,ringGeo(ro,ri,Math.abs(y2-y1)),mat||M.brass2,x,(y1+y2)/2,z);
  /* a bushing with an oil sink, a 90 deg cone round the bore in its face at y2 (y2 > y1), its outside 0.65 of the bushing's radius and at least 0.25 past the bore
     (C Spinner 37:59, 38:02: the fusee's and barrel's bushings on the dial side; the oiling, Ops. 43, 46-49) */
  const bushS=(p,x,z,y1,y2,ro,ri,mat)=>{const rs=Math.max(0.65*ro,ri+0.25),V=(a,b)=>new THREE.Vector2(a,b);
    return mesh(p,new THREE.LatheGeometry([V(ri,y2-(rs-ri)),V(rs,y2),V(ro,y2),V(ro,y1),V(ri,y1),V(ri,y2-(rs-ri))].reverse(),48),mat||M.brass2,x,0,z);};
  hn(bushR(pp,...L.C,y0-0.1,0,1.5,0.52),'42165');hn(bushS(pp,...L.Fu,y0-0.1,0,1.4,0.58),'42164.fl');hn(bushS(pp,...L.Ba,y0-0.1,0,1.9,1.43),'42164.bl');hn(bushR(pp,...L.E,y0-0.1,0,1.3,0.95,M.gilt),'42162.el');hn(mesh(pp,stoneGeo(0.95,0.095,0.5,'olive'),M.ruby,L.E[0],-0.25,L.E[1]),'J.el');   /* escape lower setting (42162) with its olive-hole jewel, flush with the plate's dial face under the endstone */
  /* mounting ring (42057, Figs. 29, 67, 110: a deep ring under the plate, drawn cut), lacquered brass (Sec. VI): a band as wide as the plate under its dial side, then a flange
     that stands out round it and carries the dial (the side photograph; "the dial or the movement [may] shift on the mounting ring", the note at Op. 98, Sec. VIII); from the dial side the plate lies
     sunk in it. Three screws (42055) hold the plate to it from the train side: the plate is laid on the ring and the screws put in (reassembly Op. 1; Fig. 29 draws them above
     the plate), and the top-view photographs show one on the plate at the rim at 6 o'clock, half under the train bridge; the others under the bridges, at 210 and 340 deg,
     estimated. The band has a tab inward under each, tapped for it. The bore r 39.0 (MR_RI); the tabs estimated. Both pieces start 0.01 off the faces they meet */
  { const RA=[100,210,340].map(a=>a*D2R),dA=a=>Math.min(...RA.map(b=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b))))),rin=a=>{const t=clamp((dA(a)-0.07)/0.05,0,1);return lerp(38.4,MR_RI,smooth(t));};
    const circ=(r,n)=>[...Array(n).keys()].map(k=>{const a=k/n*TAU;return[r*Math.cos(a),r*Math.sin(a)];}),inner=[...Array(360).keys()].map(k=>{const a=k/360*TAU;return[rin(a)*Math.cos(a),rin(a)*Math.sin(a)];});
    R.flange=hn(mesh(pp,polyGeo(circ(PP_R,160),MR_FL-0.01,[{pts:inner},...S.ring.map(q=>hT(...q,PSR))]),M.brass,0,0.01,0),'42057');   /* the band, with its tabs */
    const rel=a=>{const t=Math.atan2(Math.sin(a+Math.PI/2),Math.cos(a+Math.PI/2))/D2R,e=Math.min(t+11,10-t);return MR_RI+0.4*smooth(clamp(e/1.5,0,1));},relief=[...Array(360).keys()].map(k=>{const a=k/360*TAU;return[rel(a)*Math.cos(a),rel(a)*Math.sin(a)];});   /* the relief cut into the bore round the 12, 11 deg back to 10 on, out to r 39.4 (16.5 from the indicator's stud), where the indicator wheel's teeth pass (KLUwI2UUCMQ 40:08: certain it is there, its size rough) */
    /* the dial take-off slot (Fig. 21): a notch in the flange's rim under the dial's edge, where a blade goes in to lift the dial off its seat (restoration video 8:46-8:49).
       On the ring face-on (9:03), 167 deg round from 12 seen from the dial (from the indicator's stud and the relief; the fusee's bushing and the fourth's jewel read as
       References/VIDEOS.md has them), about 1.4 wide and 2.2 in from the rim; its floor brass, so cut through the flange's top layer only (1.0 deep, estimated) */
    const TO_A=77*D2R,TO_W=1.4,TO_R=MR_RO-2.2,toH=Math.asin(TO_W/2/MR_RO),takeOff=[],ux=Math.cos(TO_A),uz=Math.sin(TO_A);
    for(let k=0;k<160;k++){const a=k/160*TAU,d=Math.atan2(Math.sin(a-TO_A),Math.cos(a-TO_A));if(Math.abs(d)>toH)takeOff.push([MR_RO*Math.cos(a),MR_RO*Math.sin(a)]);
      if(k/160*TAU<=TO_A&&(k+1)/160*TAU>TO_A)for(const[r,s]of[[MR_RO*Math.cos(toH),-1],[TO_R,-1],[TO_R,1],[MR_RO*Math.cos(toH),1]])takeOff.push([r*ux-s*TO_W/2*uz,r*uz+s*TO_W/2*ux]);}
    hn(mesh(pp,polyGeo(circ(MR_RO,160),MR_Y-MR_FL-1.0,[{pts:circ(MR_RI,160)},...S.dial.map(q=>[...q,0.8])]),M.brass,0,MR_FL,0),'42057',{sub:1});hn(mesh(pp,polyGeo(takeOff,1.0,[{pts:relief},...S.dial.map(q=>[...q,0.8])]),M.brass,0,MR_Y-1.0,0),'42057',{sub:1});   /* the flange, bored for the dial's feet; the relief a step in its dial-side face, 1.0 deep (40:08 shows a recessed shelf; its depth estimated) */
    /* the alignment pin, "protruding beyond the movement" into its slot in the edge of the case (Sec. III): pressed into the flange's edge, at 12 o'clock (estimated) */
    const ap=hn(mesh(pp,cylY(0.5,0.8,12),M.steel,0,(MR_FL+MR_Y)/2,-(MR_RO+0.4)),'42057',{sub:1});ap.rotation.x=Math.PI/2; }
  for(const q of S.ring)hn(screw(pp,...q,y0,PSR,PSH,PP_T+1.8),'42055.ring');   /* through the plate into the band's tab */
  { const rg=new THREE.Group();rg.rotation.x=Math.PI;pp.add(rg);
    /* the pillars' screws (42055) from the dial side, through the plate into the pillars (Fig. 110) */
    S.pil.forEach((q,i)=>hn(screw(rg,q[0],-q[1],0,PSR,1.6,3.86+3.2),   /* the dial-side heads 1.6 tall, not the train side's measured 2.0: at 2.0 the one under the barrel pillar meets the motion work, whose heights are estimated (open) */
    i<3?'42055.pil':'42055.pilb'));
    /* escape lower endstone cap (42159) with its jewel and two screws (20762), on the dial side over the escape lower setting (Fig. 110) */
    endCap(rg,L.E[0],-L.E[1],[eu[0],-eu[1]],0,3.86-0.4,2.1,['42159.el','J.ele','20762.elc']); }
  /* lower train bridge (42063) on the dial side of the pillar plate, screwed from the dial side (Figs. 29, 30, 31, 67, 110): a straight steel bar with square ends across an
     opening in the plate round the third arbor (Figs. 30, 31; the third wheel shows through it in a photograph of a Model 21's dial side), the third and fourth lower settings
     inboard and a screw toward each end (Fig. 31 and that photograph: the screws about 2.9 times as far apart as the settings), and two steady pins ("complete with pins").
     Its sizes as C Spinner's video measures it (40:08, the dial side nearly face-on, fitted at the plate's scale; References/VIDEOS.md, "The lower train bridge"): LT_H (4.4) thick (its top 4.2-4.9 mm
     over the plate over the focal lengths the frame allows, its near wall 4.2-4.3; likely), about 10 wide (9.7-10.3), from 18.3 mm short of the third arbor to 9.2 past the fourth (the video's 10.3, short of its pillar's dial-side screw at 166.6 deg, would stand on it at the model's 170.8), its screws
     13.6 and 6.1 out from them on its middle line, their heads (r 2.2) flush in counterbores; the settings (r 2.5) sunk 0.8 in counterbores r 3.0 at its top, and running through it: gilt at its train-side face too, seen through the plate's opening (34:30).
     The steady pins' places estimated (outside the opening: one past the screw at the third's end, one beside the fourth's setting) */
  const lt=part('ltb',8),LTe=[add(L.T,ltu,-18.3),add(L.F,ltu,9.2)],ltn=[-ltu[1]*5,ltu[0]*5],LTP=[add(LTe[0],ltn),add(LTe[1],ltn),sub(LTe[1],ltn),sub(LTe[0],ltn)],ltS=S.ltb.map(q=>hC(...q,1.4));
  R.ltb=mesh(lt,polyGeo(LTP,LT_H-2.0,[[...L.T,2.5],[...L.F,2.5],...ltS,...S.ltbp.map(q=>[...q,0.4])]),M.steel,0,0,0);hn(lt,'42063');
  mesh(lt,polyGeo(LTP,1.2,[[...L.T,2.5],[...L.F,2.5],...ltS]),M.steel,0,LT_H-2.0,0);mesh(lt,polyGeo(LTP,0.8,[[...L.T,3.0],[...L.F,3.0],...S.ltb.map(q=>[...q,2.4])]),M.steel,0,LT_H-0.8,0);   /* the pins' holes blind; the settings' seats and counterbores, the heads' counterbores */
  for(const q of S.ltbp)hn(cylBetween(lt,0.4,-1.0,1.6,M.steel,...q,12),'42063',{sub:1});   /* its steady pins, into the plate */
  const ltf=new THREE.Group();ltf.rotation.x=Math.PI;lt.add(ltf);jewel(lt,...L.F,['42161.fl','J.fl'],LT_H-2.0,2.5,LT_H-2.0,M.ruby,0.36);jewel(lt,...L.T,['42161.tl','J.tl'],LT_H-2.0,2.5,LT_H-2.0,M.clear,0.32);   /* the holes, lit through the stones (15:00, 15:06): the third's 0.286 of its stone (two frames, 0.284 and 0.288, its edge fitted to 3 px), r 0.32; the fourth's 0.32 (135 px in 415-433; its bore seen at a slant, so looser), r 0.36: +/- 0.03 with the scale */   /* the third's stone colourless, the fourth's red (KLUwI2UUCMQ 40:08 from the dial side, the third's pinion seen through it; 34:30 from the train side, the blue mat) */
  
  for(const q of S.ltb)hn(screw(ltf,q[0],-q[1],-(LT_H-0.8),2.2,0.8,LT_H-0.8+3.46,0.7),'42163');   /* two screws (42163; Ops. 7, 53) into the pillar plate */
  /* ---------- pillars (two measured on Fig. 2, two placed clear of the fusee wheel and balance) ---------- */
  const pl=part('pillars',-30);
  /* tapped at both ends: for its screw from the dial side through the pillar plate, and for the bridge screw at its top (3.5 mm deep) */
  /* profile measured side-on on a restoration video (References/VIDEOS.md, KLUwI2UUCMQ 42:56, scaled by the pillar's 16.8 mm): a straight shaft r 2.7 with a collar at each end, the foot r 2.9 over 3.3 mm and the top r 3.3 over 3.4 mm */
  const pillar=(x,z,top)=>{const hb=hT(0,0,PSR)[2],pr=[V2(0,y0-3.5),V2(hb,y0-3.5),V2(hb,y0),V2(2.9,y0),V2(2.9,y0-3.3),V2(2.7,y0-3.3),V2(2.7,top+3.4),V2(3.3,top+3.4),V2(3.3,top),V2(hb,top),V2(hb,top+3.5),V2(0,top+3.5)].reverse();
    return mesh(pl,new THREE.LatheGeometry(pr,32),M.plateSolid,x,0,z);};
  /* the barrel pillar (42058), up to the barrel bridge: not the train pillars' shape. On C Spinner's video (13:06, 13:36, 37:45: standing beside the barrel, scaled by the
     barrel's top) a flared foot (r 3.3), a shaft narrowing to r 2.2 about 6 mm up and widening to a body r 3.0 with a groove 11.6 mm up, and a boss r 1.75 on its top, tapped for the barrel
     bridge's screw; read by eye on 13:06, scaled by its own 19.9 mm height, to about 15 % */
  /* the barrel pillar (42058) traced on KLUwI2UUCMQ 13:08 (4K, beside the barrel): its left edge row by row, its offset from the axis (tilted from the top boss's centre to the foot's)
     as a fraction of the body's, scaled by the body's r 3.0 and the pillar's 18.6 mm to the body's top (heights along the one axis need no camera): a cone, the foot r 3.2-3.4 over its
     lowest 3-5 mm (the three readings there, 3.25, 3.2 and 3.4, drawn as their smooth fit) narrowing steadily to r 2.25 just under a groove 14.0 mm up, the body r 3.0 above it (+-0.3 in r, the axis's tilt; heights +-0.5). It was drawn pinched to r 2.2 at
     6.3 mm and swelling again to 2.9 at 11.6, read by eye until 4 October 2026 */
  const bPillar=(x,z,top)=>{const hb=hT(0,0,PSR)[2],h=d=>y0-d,pr=[V2(0,y0-3.5),V2(hb,y0-3.5),V2(hb,y0),V2(3.35,y0),V2(3.3,h(3.0)),V2(3.2,h(4.7)),V2(2.8,h(6.4)),V2(2.65,h(8.1)),V2(2.4,h(9.8)),V2(2.4,h(11.5)),V2(2.25,h(13.2)),V2(2.25,h(13.7)),V2(2.75,h(13.7)),V2(2.75,h(14.0)),
      V2(3.0,h(14.0)),V2(3.0,h(18.6)),V2(1.75,h(18.6)),V2(1.75,top),V2(hb,top),V2(hb,top+3.5),V2(0,top+3.5)].reverse();return mesh(pl,new THREE.LatheGeometry(pr,32),M.plateSolid,x,0,z);};
  PILLARS.train.forEach(([x,z])=>hn(pillar(x,z,TB_U),'42059'));hn(bPillar(...PILLARS.barrel,TB_T),'42058');
  /* ---------- upper train bridge (y TB_T..TB_U) and barrel bridge (y BB_T..TB_T). The barrel bridge sits on the train bridge and is cut around the
               balance. The train bridge is the crescent of Figs. 29, 67 and 110, its notch and horn measured on a restoration video (tools/train_bridge.py): the disc less a cut round
               the barrel and a notch round the fusee, open to the rim, with a horn between them that carries the centre wheel's upper bushing; the barrel
               pillar stands in the open notch. Its keyhole opening frees the balance's staff and rollers and the escape arbor ---------- */
  const tb=part('trainBridge',-62);
  const TBpoly=clipPoly(crescent(BR_R,TB_CUT,TB_CR,TB_EDGE),p=>{const[a,b]=TB_END,c=(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]);return Math.max(-c,p[0]+30);});   /* cut round the barrel, which rises past the train bridge to the barrel bridge (Figs. 108, 110); measured on the video, 22.56 mm out, it is where the barrel stands */
  R.trainBridge=mesh(tb,polyGeo(TBpoly,3.1,[[...L.C,1.2,1],[...L.T,1,1],{pts:TB_KEY},[...SPv,0.52,1],[...SPh,0.25,1],
    hC(...S.tb[0],PSR),hC(...S.tb[1],PSR),[...S.tb[2],TB_CB,1],hT(...S.bb[1],PSR),hT(...S.bb[2],PSR),...S.lb.map(q=>hT(...q,PSR)),...S.lbp.map(q=>[...q,0.42,1]),[...S.blk,1.4,1],...S.dpin.map(q=>[...q,0.42,1]),hT(...S.cock,2.8,0.8),...S.ckp.map(q=>[...q,0.42,1]),
    hT(...S.arm,ARM_S),[...S.tBlock,0.9,1],[...S.armPin,0.3,1]],0.22),M.plate,0,TB_T,0);hn(tb,'42062');
  for(const f of TB_SEAT){const ins=([x,z])=>{let c=false;for(let i=0,j=f.length-1;i<f.length;j=i++){const[a,b]=f[i],[e,d]=f[j];if((b>z)!==(d>z)&&x<(e-a)*(z-b)/(d-b)+a)c=!c;}return c;};   /* each seat's floor, with its screw's tapped hole and its pin's hole */
    mesh(tb,polyGeo(f,3.1-SEAT_D,[...S.eb.filter(ins).map(q=>hT(...q,0.9)),...S.ebp.filter(ins).map(q=>[...q,0.42,1])]),M.plate,0,TB_T+SEAT_D,0);}
  {const C=PT([10.53,35.06]),A=PT([-0.9764,0.2161]),P=PT([0.2161,0.9764]),q=(a,p)=>[C[0]+a*A[0]+p*P[0],C[1]+a*A[1]+p*P[1]];   /* decal only round the serial, so it can't catch picks over the bridge's openings */
    const eg=mesh(tb,decalGeo([q(-5.5,-1.8),q(5.5,-1.8),q(5.5,1.8),q(-5.5,1.8)],PTi),M.engraveT,0,TB_T-0.02,0);eg.userData.noShadow=true;eg.userData.noCap=true;eg.userData.decal=true;}
  /* three pillar screws (42055), each into its pillar (Op. 14); the third at the end of the tongue beside the notch's mouth, in the hole C Spinner's video shows there (23:30, a
     counterbore 5.3 mm across; 36:26), its head sunk in it, flush, where the top-view photograph shows it below a clearance hole in the barrel bridge, and driven down into
     its pillar (36:34). Its head (r 2.5, to fit the counterbore) and the counterbore's depth are estimated */
  S.tb.forEach(([x,z],i)=>hn(i<2?screw(tb,x,z,TB_T,PSR,PSH,3.1+3.0):screw(tb,x,z,TB_T+1.6,2.5,1.6,3.1-1.6+3.0,sR(PSR)),'42055.tb'));
  hn(mesh(tb,ringGeo(TB_CB-0.01,hC(0,0,PSR)[2],3.1-1.6),M.plate,S.tb[2][0],TB_T+1.6+(3.1-1.6)/2,S.tb[2][1]),'42062',{sub:1});   /* the counterbore's floor, the screw clear through it */
  hn(mesh(tb,ringGeo(0.72,0.52,3.1),M.plate,SPv[0],TB_T+1.55,SPv[1]),'42062',{sub:1});   /* the sustaining pawl's pivot hole straight through, r 0.52 (it has no bushing, Op. 15): the bevel left it r 0.70 between the faces */
  /* detent support block screw (42056): from above, through the train bridge into a tapped hole in the block's top, between its two positioning pins (Sec. II; Figs. 14, 22, 84;
     Op. 81, with the train side up; KLUwI2UUCMQ 10:45, 11:08). Nothing stands over it: the barrel bridge's horn, which covered it before the photographed group's turn, is clear */
  hn(screw(tb,...S.blk,TB_T+0.5,1.0,0.5,3.1-0.5+2.4),'42056.blk');hn(mesh(tb,ringGeo(1.39,hC(0,0,1.0)[2],3.1-0.5),M.plate,S.blk[0],TB_T+0.5+(3.1-0.5)/2,S.blk[1]),'42062',{sub:1});   /* its head flush in a counterbore r 1.4 (KLUwI2UUCMQ 10:46, the screwdriver on it: the head about r 1.0, the counterbore 1.4, against a pillar screw's head, r 2.77, in the same frame; +-0.15; its depth, the head's 0.5, estimated); proud, r 0.9, until 4 October 2026. The floor round the shank */
  /* centre and third upper bushings in the train bridge (42166, 42167); they lie in the opening round the balance, so they can be oiled with the barrel bridge on (Sec. VIII, Op. 46) */
  hn(bushR(tb,...L.C,TB_T-0.1,TB_U,1.2,0.52),'42166');hn(bushR(tb,...L.T,TB_T-0.1,TB_U,1.0,0.32),'42167');   /* bored for the pivots (r 0.5, 0.3), 0.02 side shake */
  /* balance wheel locking arm (42299, Fig. 9; fitted from 1947, Bureau of Ships sketch 023263): a curved arm on the train bridge, turning on its shouldered screw (37204) and
     washer (42251) outside the balance's sweep. Locked, the finger at its end stands on the counterclockwise side of a timing weight, which the hairspring holds lightly
     against it, and the vernier's screw outside the rim, 15 deg round (hole 2), stops the balance the other way ("place the locking arm over the timing weight", Sec. X); unlocked, it lies turned out
     against its stop pin (42300), clear of everything the balance carries. Fig. 9 shows the arm curved, its screw outside the rim and its end at a timing weight; the arm's
     sizes, the screw's place and the finger's height (2.4 mm, to 0.56 mm up the weight) are estimated. R.arm turns: rotation.y = armL locked, armL + armU unlocked */
  { const ap=part('lockArm',-62),dA=sub(S.armF,S.arm),AL=Math.hypot(...dA),dL=unit(dA),AE=AL+0.45;R.armL=Math.atan2(-dL[1],dL[0]);
    const f9=new THREE.Group();ap.add(f9);R.armF9=f9;   /* the manual's arm, its screw, washer and stop pin: hidden together when the Navy's Y-arm is fitted instead (below) */
    R.armU=-ARM_U;R.arm=new THREE.Group();R.arm.position.set(S.arm[0],TB_T,S.arm[1]);f9.add(R.arm);R.arm.rotation.y=R.armL+R.armU;
    const bw=-ARM_BOW*Math.sign((L.B[0]-S.arm[0])*-dL[1]+(L.B[1]-S.arm[1])*dL[0]),cl=t=>[t*AE,bw*Math.sin(Math.PI*t)],N=14,side=k=>[...Array(N+1).keys()].map(i=>{const t=i/N,[x,z]=cl(t);return[x,z+k*0.4];});   /* a strip 0.8 wide, bowed ARM_BOW away from the staff */
    hn(R.arm,'42299');mesh(R.arm,polyGeo(subtractCircle([...side(1),...side(-1).reverse()],[0,0],1.1,true),0.45,[hC(0,0,ARM_S)]),M.blued,0,-0.45,0);
    cylBetween(R.arm,0.4,-0.45,-2.85,M.steel,AL,0,16);   /* the finger, 2.4 tall: 0.56 up the timing weight */
    hn(mesh(f9,ringGeo(1.1,hC(0,0,ARM_S)[2],0.15),M.steel,S.arm[0],TB_T-0.525,S.arm[1]),'42251.arm');hn(screw(f9,...S.arm,TB_T-0.6,ARM_S,0.35,0.15+0.45+2.5),'37204');
    hn(cylBetween(f9,0.3,TB_T+0.8,TB_T-0.8,M.steel,...S.armPin),'42300');
    /* the Navy's other balance stop (illustrative; Variants), as on serial 2E11795 (References/photo-top-view.jpg), Delaney No. 8854 and another, both photographed from
       straight above (Review-results.md, BOM comparison 8). A second dust seal on the barrel bridge like the fusee's: a nickel body on a flange held by screws, and
       packing rings (black on 2E11795). Its bore is closed by a nickel plunger head with a hex socket screw. Under it runs a lever of spring steel: its root is screwed
       to a stud under a large shouldered screw near the bridge's rim, and it runs straight under the cap, through a slot in the seal's body, to a curved crossbar over
       the balance. The crossbar is an arch over the cock's end, its legs coming straight down, and from the foot of each, level with the staff, an arm straight
       out to a round eye with a pin over the rim, symmetric about the stem, as all four movements photographed with it have it (2E11795, Delaney's, the omegaforums one and 2E8489 in the
       restoration video, 5:10). Traced on Delaney's photograph (straight above, scaled by the eyes 27.8 apart): the arch round the staff about 7.9 out, its top 8.3 out on
       the bar's centre line, the arms nearly level with the staff (Review-results.md, open findings 13; until 4 October 2026 straight legs 4.5 long under the arch, its top
       12.3 out, after a sketch). The outline is the boundary of bars of those widths joined with round fillets (sdfOutline), cut as one plate. The pivot screw and
       the eyes land within about 1 mm of where 2E11795's and Delaney's photographs put them, registered by the balance rim (on 2E11795 the cock's edge hides the
       left end). The manual doesn't describe the stop (its "balance stop", Sec. I, is Fig. 9's arm above), so how it works is read from the sources that describe
       it (Review-results.md, 13): the plunger, screwed down by its hex socket with an Allen key through the bottom of the case, presses the lever down, which bends about
       its screwed root (drawn as a turn about the pivot) until the pins bear on the rim, as the wedges did (Sec. III); screwed up, the lever springs back. Estimated: the heights, the lever's thickness, the stud and its screw, the chamber and slot inside the body, the second flange screw's place, the
       flange's bite round the setup cover, and the screws' threads (not drawn: the bridge is the manual's, untapped there). R.navyLock(a): a 0 free, 1 locked. In the
       Exploded view it lifts 22 mm past the locking arm's part, to -84: above the barrel bridge it stands on (-72) and the balance it reaches over (-80), and under the
       hairspring and the cock (-88, -96) */
    const nv=loose(new THREE.Group(),19);nv.visible=false;ap.add(nv);R.navy=nv;const NP=[-6.69,-19.16],AY=-31.75,AT=0.45,Y0=-30.65,Y1=-31.85,HB=-33.1,HT=-38.06,PE=BAL_Y+1.2-BAL_RH-0.5;   /* the lever's top, thickness; the slot's bottom and top; the plunger head's foot and top (free); the pins' ends, 0.5 over the rim's top (from BAL_RH: set for a 4.3 rim, they stopped 0.8 over the 3.5 one, locked); Exploded, it rises 19 past its part: between the balance under its pins and a piece of the hairspring's part 3.1 over it, which both rise 80 (exploded.py: 18 to 20.6) */
    const lat=(o,p,m,c=NP,n=56)=>mesh(o,new THREE.LatheGeometry(p.map(([r,y])=>V2(r,y)).reverse(),n),m,c[0],0,c[1]),circ=(r,n=96)=>[...Array(n)].map((_,i)=>[r*Math.cos(i/n*TAU),r*Math.sin(i/n*TAU)]);
    /* the pivot: both photographs put it 2.5 mm from the barrel bridge's pillar screw, a large slotted head like it (2E11795), so the fitting is taken to replace that
       screw with a shouldered stud (hidden screw R.navyBB, below); the lever's end bent to it under the cap, as Delaney's photograph shows it bent there */
    const NPV0=[-9.61,-30.95],iP=S.bb.reduce((b,q,i)=>Math.hypot(...sub(q,NPV0))<Math.hypot(...sub(S.bb[b],NPV0))?i:b,0),NPV=S.bb[iP];R.navyBB=iP;
    /* the crossbar, symmetric about the line from the staff to the post (aa; pp across it): an arch over the cock's end, its legs WA out (its inner edge 6.7 from the
       staff, clear of the hairspring's 5.5), straight for HL (0.5, Delaney's photograph) then round over in a half circle to its top HA out (8.3); from each leg's foot, level with the staff, an arm straight out to an
       eye at EA, its pin over the rim (13.38-14.5). Widths from Delaney's photograph: the stem 2.9, the lever past the cap 2.5, the bar 2.2, the eyes r 1.4 */
    const aa=unit(sub(NP,L.B)),pp=[-aa[1],aa[0]],loc=(X,Y)=>[L.B[0]+X*pp[0]+Y*aa[0],L.B[1]+X*pp[1]+Y*aa[1]],WA=7.8,HL=0.5,HA=HL+WA,EA=13.9,NPIN=[loc(EA,0),loc(-EA,0)];
    /* the seal: body, flange and screws as the fusee's (below), its chamber closed underneath, slotted through both sides at the lever's height along the lever
       (toward the crossbar and toward the pivot) */
    const SW=2.0,gaps=[loc(0,HA),NPV].map(q=>{const d=sub(q,NP);return Math.atan2(d[1],d[0]);}).sort((a,b)=>a-b);
    lat(nv,[[0,-27.18],[6.6,-27.18],[6.6,-28.36],[6.2,-28.76],[5.9,-28.96],[5.9,Y0],[3.0,Y0],[3.0,-27.9],[0,-27.9]],M.plateSolid);
    for(const[A,B]of[[gaps[0],gaps[1]],[gaps[1],gaps[0]+TAU]]){const go=Math.asin(SW/5.9),gi=Math.asin(SW/3.0),P=[];
      for(let k=0;k<=60;k++){const t=A+go+(B-A-2*go)*k/60;P.push([5.9*Math.cos(t),5.9*Math.sin(t)]);}for(let k=60;k>=0;k--){const t=A+gi+(B-A-2*gi)*k/60;P.push([3.0*Math.cos(t),3.0*Math.sin(t)]);}
      mesh(nv,polyGeo(P,Y0-Y1),M.plateSolid,NP[0],Y1,NP[1]);}
    lat(nv,[[1.3,Y1],[5.9,Y1],[5.9,-32.56],[1.3,-32.56],[1.3,Y1]],M.plateSolid);   /* the body's top, bored for the plunger */
    for(let k=0;k<3;k++){const a=-32.56-1.733*k,b=a-1.733;lat(nv,[[3.4,a],[6.2,a],[6.45,a-0.22],[6.45,b+0.22],[6.2,b],[3.4,b],[3.4,a]],M.packing);}
    const NS=[37.8,-158.5].map(d=>[NP[0]+7.9*Math.cos(d*D2R),NP[1]+7.9*Math.sin(d*D2R)]);   /* the flange screws: one where the photograph shows it, one about opposite (estimated) */
    /* the setup cover's end (below, out to 13.15 from the barrel arbor) and its foot (13.65) reach over where the flange would: bitten round them, about the arbor, 0.3 clear */
    mesh(nv,polyGeo(subtractCircle(circ(8.6),sub(L.Ba,NP),13.95),1.0,[[0,0,6.7],...NS.map(q=>hC(q[0]-NP[0],q[1]-NP[1],1.0))]),M.plateSolid,NP[0],-28.18,NP[1]);for(const q of NS)screw(nv,...q,-28.18,1.0,0.5,1.0);
    /* the stud: threaded through the bridge into the pillar as the screw it replaces (3.4 + 3.0), a shoulder r 2.0 up to the lever, and a bore for the screw over it,
       whose head (the pillar screw's) holds the lever's root on the shoulder */
    lat(nv,[[0,BB_T+6.4],[sR(PSR),BB_T+6.4],[sR(PSR),BB_T],[2.0,BB_T],[2.0,AY+AT+0.05],[1.0,AY+AT+0.05],[1.0,AY+AT+0.65],[0,AY+AT+0.65]],M.steel,NPV,40);screw(nv,...NPV,AY-0.05,PSR,1.6,AT+0.7,0.98);   /* 0.05 clear of the lever above and below: locked, its root's eye tilts 0.03 */
    /* the lever: the traced outline smoothed as one closed curve (centripetal Catmull-Rom) and cut as one plate, so the fork has no seams; satin, as photographed
       (about 0.83 of the plates' brightness); it turns about the pivot at its mid-thickness */
    const na=new THREE.Group();na.position.set(NPV[0],AY+AT/2,NPV[1]);nv.add(na);const ni=new THREE.Group();ni.position.set(-NPV[0],-(AY+AT/2),-NPV[1]);na.add(ni);
    { const seg=(x,z,a,b,r)=>{const px=x-a[0],pz=z-a[1],bx=b[0]-a[0],bz=b[1]-a[1],h=clamp((px*bx+pz*bz)/(bx*bx+bz*bz||1),0,1);return Math.hypot(px-bx*h,pz-bz*h)-r;},
        smin=(a,b,k)=>{const h=clamp(0.5+0.5*(b-a)/k,0,1);return b*(1-h)+a*h-k*h*(1-h);},
        arch=(x,z)=>{const dx=x-L.B[0],dz=z-L.B[1],X=dx*pp[0]+dz*pp[1],Y=dx*aa[0]+dz*aa[1];return(Y>=HL?Math.abs(Math.hypot(X,Y-HL)-WA):Math.hypot(Math.abs(X)-WA,Math.min(Y,0)))-1.1;};   /* the legs and the half circle, one bar */
      const f=(x,z)=>smin(smin(smin(arch(x,z),Math.min(seg(x,z,loc(WA,0),loc(EA,0),1.1),seg(x,z,loc(-WA,0),loc(-EA,0),1.1)),0.5),Math.min(...NPIN.map(q=>seg(x,z,q,q,1.4))),0.4),
        smin(seg(x,z,loc(0,HA),NP,1.45),smin(seg(x,z,NP,NPV,1.25),seg(x,z,NPV,NPV,2.5),0.4),0.4),0.9);   /* bar, arms, eyes; stem, lever and the root's boss, joined with round fillets */
      const K=[...NPIN,NPV,loc(0,HA),loc(WA,0),loc(-WA,0)],O=sdfOutline(f,Math.min(...K.map(q=>q[0]))-3,Math.min(...K.map(q=>q[1]))-3,Math.max(...K.map(q=>q[0]))+3,Math.max(...K.map(q=>q[1]))+3,0.06);
      mesh(ni,polyGeo(O,AT,[[...NPV,1.0],...NPIN.map(q=>[...q,0.4])]),M.steelS,0,AY,0); }
    for(const q of NPIN)cylBetween(ni,0.4,AY,PE,M.steel,...q,16);
    /* the plunger: its head in the packing rings' bore, 0.3 proud of them and recessed for the hex socket screw; its stem down to 0.02 over the lever */
    const pl=new THREE.Group();nv.add(pl);lat(pl,[[0,HB],[3.35,HB],[3.35,HT],[1.3,HT],[1.3,HT+0.8],[0,HT+0.8]],M.plateSolid);
    { const hx=[...Array(6)].map((_,i)=>[0.62*Math.cos(i/6*TAU),0.62*Math.sin(i/6*TAU)]);mesh(pl,polyGeo(circ(1.28,48),0.8,[{pts:hx}]),M.steel,NP[0],HT,NP[1]); }
    cylBetween(pl,1.25,HB,AY-0.02,M.steel,...NP,32);
    /* locking: screwed down, the plunger presses the lever until both pins bear on the rim's top edge, which holds the balance (Review-results.md, 13). Drawn as the
       lever turned about the horizontal through the pivot parallel to the crossbar (pp), so the two pins, symmetric about the stem, come down the same 0.5 together; the
       plunger goes down with the lever under it */
    { const K=new THREE.Vector3(pp[0],0,pp[1]),sA=q=>(q[0]-NPV[0])*aa[0]+(q[1]-NPV[1])*aa[1],th=Math.asin(0.5/sA(NPIN[0])),sP=sA(NP);   /* a point s along aa from the pivot comes down s sin(th) */
      R.navyLock=a=>{na.setRotationFromAxisAngle(K,th*a);pl.position.y=sP*th*a;}; } }
  /* escape upper bridge with jewel and endstone cap */
  const eb=part('escBridge',-66),EB_Y=TB_T+SEAT_D;   /* the bar's underside: its ends in the train bridge's seats */
  /* the escape upper bridge (42064; Figs. 84, 110; KLUwI2UUCMQ 10:00-10:50; References/VIDEOS.md, "The escape upper bridge, close"): a flat bar 1.0 thick and 5.6 wide (5.2 until 5 October 2026), round-ended,
     22 long, across the train bridge's escape opening, its ends on the bridge's face with a countersunk screw flush in each, 8.3 from the jewel, and a steady pin 1.6 further out and
     1.3 toward the balance; under its middle it is 2.5 thick over 10.8 mm, with a round boss r 3.8 hanging 1.5 into the opening (Fig. 110-2's raised round middle), which holds
     the setting. The endstone cap sits in a round sink through the bar, flush with its top, on the boss, cut flat both sides with the bar's edges. Sizes as ratios to the end
     screws' spacing (16.0-16.9 mm), medium; the ends lie in seats sunk SEAT_D in the train bridge's face (TB_SEAT), so the bar stands that much lower */
  { const bu=ebu,bv=[-ebu[1],ebu[0]],P=(t,n)=>[L.E[0]+t*bu[0]+n*bv[0],L.E[1]+t*bu[1]+n*bv[1]],W=2.8,RS=4.12,TE=8.4,half=s=>{const o=[],N=12;
      for(let k=0;k<=N;k++){const n=-W+2*W*k/N;o.push(P(s*Math.sqrt(RS*RS-n*n),n));}   /* the sink's edge, from one side to the other */
      for(let k=0;k<=16;k++){const a=Math.PI/2-Math.PI*k/16;o.push(P(s*(TE+W*Math.cos(a)),W*Math.sin(a)));}   /* round the end */
      return s>0?o:o.map(([x,z])=>[x,z]).reverse();};
    for(const s of[1,-1]){const q=S.eb[s>0?0:1],p=S.ebp[s>0?0:1],m=mesh(eb,polyGeo(half(s),0.7,[hC(...q,0.9),[...p,0.41]]),M.plate,0,EB_Y-0.7,0);if(s>0)R.escBridge=m;mesh(eb,polyGeo(half(s),0.3,[[...q,0.95]]),M.plate,0,EB_Y-1.0,0);
      hn(mesh(eb,cylY(0.4,1.7,16),M.steel,p[0],EB_Y+0.15,p[1]),'42064',{sub:1});}   /* the steady pin, pressed 0.7 into the bar and 1.0 into the train bridge */
    mesh(eb,polyGeo(barBossPts(L.E,ebu,10.8,5.6,3.8),1.5,[[...L.E,1.6],...S.ebc.map(q=>hT(...q,ESCAP))]),M.plate,0,EB_Y,0);hn(eb,'42064'); }
  for(const q of S.eb)hn(screw(eb,...q,EB_Y-0.7,0.9,0.3,0.7+2.0),'20762.eb');   /* two screws (20762; Op. 22) into the train bridge, their heads flush in the bar's top */
  /* escape upper setting (42162: gilt setting, pierced jewel) pressed into the boss, and the endstone cap (42159) over it with its two screws into the boss (Fig. 110) */
  hn(mesh(eb,ring(1.6,0.95,0.9),M.gilt,L.E[0],EB_Y+0.45,L.E[1]),'42162.eu');hn(mesh(eb,stoneGeo(0.95,0.095,0.5,'olive'),M.ruby,L.E[0],EB_Y+0.25,L.E[1]),'J.eu');   /* its hole r 0.095: the bridge off and held to the light, cap side (KLUwI2UUCMQ 10:14.5), the hole a white disc 36-44 px across in the stone's 446 (light through the endstone alone); the stone 1.96 mm at the cap window's 3.1 mm (720 px), the model's 1.9: 0.17 +/- 0.02 mm; drawn 0.19, the top of that range, round the patent's 0.178 mm pivot (the arbor's comment). J.el taken the same */
  endCap(eb,...L.E,ebu,EB_Y,1.0,3.1,['42159.eu','J.eue','20762.euc'],4.1,[[...ebn,2.8],[-ebn[0],-ebn[1],2.8]],1.0,1.55,0.85);   /* its flats and screws' heads: the bar 5.6 wide and the heads r 0.85 (KLUwI2UUCMQ 10:20 and 10:24, against the cap's R and its screws' spacing: 5.4-5.9, 0.84-0.88; the train bridge's traced seats 5.72 across); 5.2 and 0.75 until 5 October 2026 */   /* R 4.1, 1.0 thick, flat both sides with the bar's edges, its window a cone r 1.55 at the top down to the endstone, its screws' heads r 0.75 (10:00-10:16) */
  const bb=part('barrelBridge',-72);
  /* barrel bridge (the large upper plate of the photographs): everything except the 6 o'clock sector, with a cut round the balance (Fig. 24). The cut is the balance's
     clearance circle (r 17.7 about the staff; the screws and weights sweep 17.2) joined with the circle fitted to its edge on the top-view photograph (r 17.6 about
     5.24, 6.33; points within 1.3 mm), which reaches 20.5 mm from the staff toward the barrel: the barrel's cap and the fusee's large end show through it */
  const cutR=BAL_R+3.2,ckE=x=>2.93+0.06*(x-32.87);   /* a straight cut under the cock's straight edge (COCK_POLY 30-32, below, which bends a little): 0.1 off it at the bend, 0.2 at the ends */
  /* the far horn: past the balance, round to about 100 deg, where it ends in a cut from the bite's edge to the rim (top-view photograph, through the five bridge screws:
     the cut's tip (-5.45, 21.46) and its end at the rim (-6.21, 34.01), within about 0.6 mm; C Spinner 23:30, the bridge flat, to about 2 mm). It carries the bridge's
     second screw into the train bridge, and a clearance hole over the train bridge's screw at pillar 0 */
  const hk=(-6.21+5.45)/(34.01-21.46),hornX=z=>-5.45+(z-21.46)*hk,bis=(f,lo,hi)=>{for(let i=0;i<50;i++){const m=(lo+hi)/2;(f(m)>0)===(f(lo)>0)?lo=m:hi=m;}return(lo+hi)/2;};
  const zC=(150.45+21.46*hk)/(10+hk),zH=bis(z=>Math.hypot(hornX(z),z)-BR_R,21,BR_R),aH=Math.atan2(zH,hornX(zH)),aR=bis(a=>BR_R*Math.sin(a)-14.5+0.1*BR_R*Math.cos(a),0,Math.PI/2);
  const BBo=[];for(let k=0,n=Math.ceil((aR+TAU-aH)/(TAU/360));k<=n;k++){const t=aH+(aR+TAU-aH)*k/n;BBo.push([BR_R*Math.cos(t),BR_R*Math.sin(t)]);}BBo.push([145-10*zC,zC]);   /* the rim from the horn's end round to the chord, the chord to its corner with the cut, the cut back to the rim */
  const BBpoly=clipPoly(subtractCircle(subtractCircle(BBo,PTi(L.B),cutR/PHOTO_K),[5.24,6.33],17.6),p=>ckE(p[0])-p[1]+Math.max(0,15-p[0])*100).map(PTr);   /* laid out in the photographs' frame, then into the movement's (PTr) */   /* the horn on the cock's side ends against the cock's straight edge (C Spinner 6:29, 6:47, 23:30) */
  const BBH=[[...L.Fu,1.6,1],[...L.Ba,1.95,1],...S.bb.map(q=>hC(...q,PSR)),...[S.tb[0],S.tb[2]].map(q=>[...q,3.15]),...S.seal.map(q=>hT(...q,1.0)),...S.cover.map(q=>hT(...q,0.9)),hT(...S.click,0.6)];   /* and the winding stop's, added below once its place is known */
  R.barrelBridge=mesh(bb,polyGeo(BBpoly,TB_T-BB_T,BBH,0.25),M.plate,0,BB_T,0);hn(bb,'42061');
  hn(bushR(bb,...L.Fu,BB_T,TB_T,1.6,1.02),'42164.fu');hn(bushR(bb,...L.Ba,BB_T,TB_T,1.95,1.42),'42164.bu');   /* fusee and barrel upper bushings (42164) */
  /* barrel bridge pillar screw (42055) into the barrel pillar; two barrel bridge screws into the train bridge: one beside the third train pillar's screw (where the third pillar stood before it went under that screw), one in the far horn
     (proud of the bridge in the top-view photograph; gone with the bridge off, BunnSpecial 12:05) */
  R.bbScr=S.bb.map((q,i)=>hn(screw(bb,...q,BB_T,PSR,PSH,[3.4+3.0,3.4+2.6,3.4+2.6][i]),i?'42055.bb':'42055.bbp'));   /* the pillar's screw, and two into the train bridge (the parts list: "Screw - Barrel bridge", to the train bridge) */
  const eg2=mesh(bb,decalGeo(BBpoly,PTi),M.engraveB,0,BB_T-0.02,0);eg2.userData.noShadow=true;eg2.userData.noCap=true;eg2.userData.decal=true;
  const Fl=Math.hypot(...L.Fu),fo=[L.Fu[0]/Fl,L.Fu[1]/Fl];
  /* ---------- dial (on the mounting ring's flange), hands, motion work ---------- */
  const dl=part('dial',32);
  hn(dl,'42030');mesh(dl,discGeo(DIAL_R,DIAL_T,[[...L.C,2.5],[...L.F,1.2],[...L.Ud,1.2]]),M.brass2,0,MR_Y,0);
  const dtex=new THREE.CanvasTexture(dialCanvas());dtex.encoding=THREE.sRGBEncoding;dtex.anisotropy=8;dtex.redraw=k=>dialCanvas(undefined,k);   /* redraw: finer, for the export to Blender */
  /* the face lies 0.02 above the brass disc's top; polygon offset keeps it in front in the depth buffer, else the brass shows through in streaks when zoomed out */
  const dface=mesh(dl,new THREE.RingGeometry(2.5,DIAL_R,128,1).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({map:dtex,metalness:0.35,roughness:0.42,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),0,MR_Y+DIAL_T+0.02,0);dface.userData.noCap=true;dface.userData.surface=true;
  /* four feet down into the ring's flange, each held by a dial screw (35756, Fig. 107) from the flange's train side into its tapped end */
  for(const q of S.dial){const fb=MR_FL+1.4;mesh(dl,new THREE.LatheGeometry([V2(0,fb+2.0),V2(hT(0,0,1.1)[2],fb+2.0),V2(hT(0,0,1.1)[2],fb),V2(0.75,fb),V2(0.75,MR_Y),V2(0,MR_Y)],20),M.brass,...[q[0],0,q[1]]);hn(screw(pp,...q,MR_FL,1.1,0.5,1.4+1.8),'35756');}
  const hd=part('hands',48),hg=new THREE.MeshStandardMaterial({color:sc(0xd9b25e),metalness:1,roughness:0.2}),hb=new THREE.MeshStandardMaterial({color:sc(0x7a6240),metalness:1,roughness:0.45});   /* hg gilt (Roman), hb aged gilt (Soviet) */
  /* Hamilton hands as on the photographed dial: blued hour hand with a bulb two-thirds out and a long spear point, plain minute hand to the track, a long seconds hand with a spear counterpoise */
  const dk=(o,k,...more)=>{const g=new THREE.Group();g.userData.dk=k;o.parent.add(g);for(const m of[o,...more])g.add(m);return o;};   /* hands of one dial style ('hamilton', 'roman', 'swiss' or 'soviet'), each with its collet, grouped so app.js's per-mesh visibility leaves the choice alone */
  /* hour hand: a round hole, pressed on the hour wheel's pipe, its collet below the blade and inside its boss, clear of the seconds hand's tip (r 2.9 at :00) (Op. 64, broached with Tool 40); minute hand: a square hole ("broached with a square file"), seated on the cannon pinion's shoulder under its square, its collet above the blade */
  R.hour=new THREE.Group();R.hour.position.y=9.5;hd.add(R.hour);R.min=new THREE.Group();R.min.position.y=10.3;hd.add(R.min);   /* the hour hand on its pipe's top (9.5), the minute hand on the square (from 10.0): the motion work as measured (above); 5.2+DD and 5.75+DD until 5 October 2026 */
  const HO={boss:2.9,bore:2.23},MO={boss:3.2,sq:2.2},hcol=m=>mesh(R.hour,ringGeo(2.7,2.23,0.6),m,0,-0.3,0),mcol=m=>mesh(R.min,sqRingGeo(3.2,2.2,0.8),m,0,0.75,0);
  hn(dk(mesh(R.hour,handGeo(0,0,0,HAND_W.hour,0,HO),M.blued),'hamilton',hcol(M.blued)).parent,'42032');hn(dk(mesh(R.min,handGeo(0,0,0,HAND_W.min,0,MO),M.blued),'hamilton',mcol(M.blued)).parent,'42033');   /* their outlines as measured on the photographed dial (HAND_W, core.js): the hour hand to 35.2 (0.87 of the minute track's inner radius), the minute hand to the track's outer line (42.2) */   /* the hands' parts-list lines on the Hamilton dial's hands (the other styles are variants). Lengths against the photographed dial's tracks (References/photo-dial-hamilton-maritime-commission.jpg): the minute hand to the track's outer edge, the hour hand 0.84 of it, the seconds hand 0.99 of its track's outer circle, the wind hand 0.95 of its scale's */
  dk(mesh(R.hour,handGeo(29*DK,1.3,6,'leaf',0,HO),hg),'roman',hcol(hg));dk(mesh(R.min,handGeo(45*DK,0.9,8,'lance',0,MO),hg),'roman',mcol(hg));
  R.sec=new THREE.Group();R.sec.position.set(L.F[0],4.35+DD,L.F[1]);   /* sub-dial hands under the hour hand's sweep (5.2+DD) */hd.add(R.sec);hn(dk(mesh(R.sec,handGeo(0,0,0,HAND_W.sec),M.blued,0,0.25,0),'hamilton'),'42034');dk(mesh(R.sec,handGeo(16.5*DK,0.55,4,'plain'),M.blued,0,0.25,0),'roman');hn(mesh(R.sec,ringGeo(0.9,0.35,0.6),M.blued,0,-0.05,0),'42034',{sub:1});   /* the collet pressed on the fourth arbor's pivot, flush with its end; the blade on it. Its bore the pivot's r 0.35 (the jewel's hole, 15:00), drawn on unchanged to the hand: the extension not measured */
  R.ud=new THREE.Group();R.ud.position.set(L.Ud[0],4.35+DD,L.Ud[1]);hd.add(R.ud);hn(dk(mesh(R.ud,handGeo(0,0,0,HAND_W.ud),M.blued,0,0.25,0),'hamilton'),'42035');   /* 0.875 of its ring (r 11.2), as photographed (HAND_W) */dk(mesh(R.ud,handGeo(10*DK,0.6,2.5,'leaf'),hg,0,0.25,0),'roman');hn(mesh(R.ud,ringGeo(1.86,0.56,0.4),M.blued,0,0.05,0),'42035',{sub:1});   /* the collet pressed on its wheel's pin: the dark boss r 1.86 round the pin's bright end on the photographed dial (a circle fitted to its edge, 0.2 px) */
  /* Nardin-pattern dials: pear hands (blued, or aged gilt on the Soviet copies); a long thin seconds hand to the track with a spear counterpoise */
  for(const[k,m]of[['swiss',M.blued],['soviet',hb]]){dk(mesh(R.hour,handGeo(31*DK,1.4,6,'pear',0,HO),m),k,hcol(m));dk(mesh(R.min,handGeo(46.5*DK,0.9,8,'pear',0,MO),m),k,mcol(m));
    dk(mesh(R.sec,handGeo(19*DK,0.45,-8,'plain'),M.blued,0,0.25,0),k);dk(mesh(R.ud,handGeo((k==='swiss'?11.5:8.5)*DK,0.6,2.5,'plain'),M.blued,0,0.25,0),k);}
  const DTEX={hamilton:dtex};hd.traverse(o=>{if(o.userData.dk&&o.userData.dk!=='hamilton')o.visible=false;});
  mv.userData.dial=kind=>{if(!DTEX[kind]){const t=DTEX[kind]=new THREE.CanvasTexture(dialCanvas(kind));t.encoding=THREE.sRGBEncoding;t.anisotropy=8;t.redraw=k=>dialCanvas(kind,k);}
    const m=dface.userData.mat0||dface.material;m.map=DTEX[kind];m.needsUpdate=true;hd.traverse(o=>{if(o.userData.dk)o.visible=o.userData.dk===kind;});};   /* the face's own material (app.js may be showing a see-through or faded copy of it, which follows on the next look()) */
  const mw=part('motion',16);
  /* the cannon pinion, a friction fit on the centre arbor (Op. 58) that slips when the hands are set: its pipe runs up through the hour wheel and dial to the shoulder the minute hand sits on (5.75+DD), and ends in the
     bright square the winding key sets the hands by (Fig. 8, Sec. III), 2.4 across as the fusee's, so one key fits both, 1.6 proud of the minute hand's collet. The hour wheel goes on over it and turns free on the pipe (Op. 59) */
  /* the motion work's heights and sizes on the plate's dial side, the dial off (KLUwI2UUCMQ 40:39.0 and 40:16.6, the fixed camera of 40:08 refitted with rimfit, rims fitted as circles
     about the centre arbor or the minute stud, radius and height solved together, the minute stud landing 11.31 from the centre; radii +/-2 %, heights +/-10 %): the cannon pinion
     stepped, its leaves from 0.3 to 4.3 (tips r 2.49), a collar r 1.57 to 5.3, a neck r 0.75 to 10.0, the square 2.16 across from 10.0 to 14.5; the hour wheel's boss r 3.47 from the
     wheel to 5.9, recessed over the leaves, its pipe r 2.2 to 9.5; the minute wheel's pinion tips r 3.1 from the wheel to an end disc r 2.1 at 5.5, its hole r 0.84. Until 5 October 2026
     the leaves to 2.2, one pipe r 1.7 to 8.99, the square 2.4 across from 8.84 to 11.74, the hour wheel's pipe r 2.3 to 8.79 straight off the wheel, the minute pinion 1.6 long (estimated) */
  R.cannon=hn(arbor(mw,M,...L.C,{pin:{n:MW.cp,m:MWM.a,y:2.3,th:4.0,bore:0.5}}),'42077');mesh(R.cannon,ring(1.57,0.5,1.0),M.steel,0,4.8,0);mesh(R.cannon,ring(0.75,0.5,4.7),M.steel,0,7.65,0);mesh(R.cannon,new THREE.BoxGeometry(2.16,4.5,2.16),M.steel,0,12.25,0);
  /* the winding key on the square, turned by its shank to set the hands (Fig. 8): shown only while setting, when the bezel is off */
  R.hkey=new THREE.Group();R.hkey.visible=false;R.cannon.add(R.hkey);mesh(R.hkey,sqRingGeo(2.6,2.46,5),M.brass,0,9.45+DD,0);cylBetween(R.hkey,1.7,11.95+DD,40.5+DD,M.brass);
  { const kb=mesh(R.hkey,new THREE.CylinderGeometry(2.4,2.4,26,20),M.brass,0,42.5+DD,0);kb.rotation.x=Math.PI/2;for(const z of[13,-13])mesh(R.hkey,new THREE.SphereGeometry(2.4,18,12),M.brass,0,42.5+DD,z);mesh(R.hkey,new THREE.SphereGeometry(3.4,18,12),M.brass,0,42.5+DD,0); }
  /* the minute wheel and the wind indicator wheel turn on posts (42085, 42084) fixed to the pillar plate by screws (35779) from its train side (Fig. 110) */
  const post=(x,z,r,top,k)=>{const hr=hT(0,0,0.8)[2];hn(mesh(pp,new THREE.LatheGeometry([V2(0,2.0),V2(hr,2.0),V2(hr,0),V2(r,0),V2(r,top),V2(0,top)],24),M.steel,x,0,z),k[0]);hn(screw(pp,x,z,y0,0.8,0.4,PP_T+1.8),k[1]);};
  post(...L.Mw,0.8,5.8,['42085','35779.mw']);   /* the minute wheel's post to its pinion's top (5.8), r 0.8 in the pinion's 0.84 hole (40:39) */post(...L.Ud,0.5,4.1,['42084','35779.ud']);
  R.minW=arbor(mw,M,...L.Mw,{wheel:{n:MW.mw,m:MWM.a,y:1.2,th:0.8,spokes:0,collet:0,bore:0.84,mate:MW.cp},pin:{n:MW.mp,m:MWM.b,y:3.55,th:3.9,bore:0.84}});mesh(R.minW,ring(1.6,0.84,2.0),M.brass2,0,1.2,0);mesh(R.minW,ring(2.1,0.84,0.3),M.steel,0,5.65,0);hn(R.minW,'42078');
  R.hourW=hn(arbor(mw,M,...L.C,{wheel:{n:MW.hw,m:MWM.b,y:2.65,th:0.8,spokes:0,collet:0,bore:2.6,hub:3.47,mate:MW.mp}}),'42080');mesh(R.hourW,ring(3.47,2.6,1.4),M.brass2,0,3.75,0);mesh(R.hourW,ring(3.47,1.62,1.45),M.brass2,0,5.175,0);mesh(R.hourW,ring(2.2,1.62,3.6),M.brass2,0,7.7,0);   /* its pipe carries the hour hand; 0.05 clear of the cannon pinion's leaves, which turn twelve times as fast */
  R.udW=hn(arbor(mw,M,...L.Ud,{wheel:{n:UD.wheel,m:UD.m,y:1.94,th:0.5,spokes:5,collet:0,bore:0.55,mate:UD.pin}}),'42081');mesh(R.udW,ring(1.6,0.55,2.0),M.brass2,0,1.94,0);mesh(R.udW,ring(0.9,0.55,2.7+DD),M.steel,0,2.85+DD/2,0);cylBetween(R.udW,0.55,4.2+DD,4.6+DD,M.steel);   /* its pipe carries the hand */
  R.fp=hn(arbor(mw,M,...L.Fu,{pin:{n:UD.pin,m:UD.m,y:2.1,th:2.2}}),'42022',{sub:1});   /* the wind indicator pinion, part of the fusee arbor */
  /* ---------- fusee wheel (TRAIN.fu : centre pinion TRAIN.cp, module MOD.fusee, 0.392) with its maintaining work, their sizes read off the video scaled by FK ---------- */
  const gw=part('gw',-14);
  R.gw=hn(arbor(gw,M,...L.Fu,{wheel:{n:TRAIN.fu,m:MOD.fusee,y:-6.5,th:1.2,spokes:0,mat:M.copper,collet:0,bore:2.75*FK,mate:TRAIN.cp}}),'42015');
  /* its recess (restoration video 27:26, References/VIDEOS.md): the wall at r 18.0 FK inside a rim over the teeth's roots, the floor with a raised disc to r 9.3 FK and a hub round the bore,
     the manual's "both elevations in the recess" (Op. 26; their heights estimated). SSF: the XZ angle of the sustaining spring's fixed end's tip; SSH: the two holes in that end,
     the first with the pin into the wheel (which hole has the pin, estimated) */
  const SSF=0.488,SSH=[[15.9*FK,SSF-48*D2R],[15.9*FK,SSF-8*D2R]].map(([r,a])=>[r*Math.cos(a),r*Math.sin(a)]);
  mesh(R.gw,ring(19.2*FK,18.0*FK,1.8),M.copper,0,-8.0,0);mesh(R.gw,discGeo(18.0*FK,0.5,[[0,0,2.75*FK],[...SSH[0],0.4]]),M.copper,0,-7.6,0);   /* the rim and the floor, with the hole the spring's pin is pressed into */
  mesh(R.gw,discGeo(9.3*FK,0.3,[[0,0,2.75*FK]]),M.copper,0,-7.9,0);mesh(R.gw,ringGeo(4.0*FK,2.75*FK,0.3),M.copper,0,-8.05,0);   /* the raised disc and the hub; the bore (r 2.75 FK, video 27:26) free on the arbor's collar */
  /* sustaining spring (42016; video 27:26, Figs. 69, 71): a flat blued band 2.1 wide against the recess wall, round from its fixed end (a lobe toward the hub, pinned to the wheel) the
     long way to its working end (a smaller lobe across the gap from it, pinned to the sustaining ratchet). The ratchet drives the wheel through it by pushing the working end forward,
     across the gap toward the fixed end: the ring closes, from a 17 deg gap relaxed (as photographed, out of the movement) to 17 deg less SMAX loaded. The lobes keep their shape
     (each is pinned); the band between them spreads over the angle the gap gives up and bows in from the wall, keeping its length. d: how far the spring has relaxed from its loaded
     state (0 in running, up to SMAX while winding). SMAX: the fusee wheel's turn in 10 minutes, the longer of the 5 to 10 minutes it drives the train (Sec. IV); app.js runs model
     time at most WIND_X fast while winding, so no wind outlasts it. Gap, lobes, pin places and the band's thickness (1.13) estimated */
  const SMAX=FUSEE_PER_HOUR*TAU/6,SSG=17*D2R,SFL=62*D2R,SWL=35*D2R,SRO=17.97*FK,SSW=2.1*FK,SPW=12*D2R,SSP=SSF+SSG-SMAX+SPW;   /* SSP: the working end's pin, in the ratchet's frame */
  const sspGeo=d=>{d=clamp(d,0,SMAX);const W=SSF+SSG-SMAX+d,a0=W+SWL,a1=SSF+TAU-SFL,sp=a1-a0,B=(SRO-SSW/2)*(SMAX-d)/sp*Math.PI/2,o=[],I=[];   /* W: the working end's tip; the band's free part runs from a0 to a1 */
    const st=(x,w,r)=>x<w?r:x<w+0.14?lerp(r,SRO-SSW,smooth((x-w)/0.14)):SRO-SSW,rin=a=>Math.min(st(a-W,SWL-0.14,13.9*FK),st(SSF+TAU-a,SFL-0.14,12.8*FK));   /* the lobes' inner edges, eased into the band's over 8 deg */
    for(let i=0,N=200;i<=N;i++){const a=W+(SSF+TAU-W)*i/N,b=a>a0&&a<a1?B*Math.sin(Math.PI*(a-a0)/sp):0,ro=SRO-b,ri=Math.min(rin(a),ro-SSW);o.push([ro*Math.cos(a),ro*Math.sin(a)]);I.push([ri*Math.cos(a),ri*Math.sin(a)]);}
    const pw=W+SPW;return polyGeo([...o,...I.reverse()],1.13,[[14.6*FK*Math.cos(pw),14.6*FK*Math.sin(pw),0.42],...SSH.map(q=>[...q,0.42])]);};   /* 0.02 over the floor, 0.03 inside the wall */
  /* the sustaining spring and its pin into the wheel: their own part, turning with the fusee wheel, in whose recess the spring lies (Figs. 28, 71) */
  const ssP=part('sspring',-18);R.ssg=new THREE.Group();R.ssg.position.set(L.Fu[0],0,L.Fu[1]);ssP.add(R.ssg);
  hn(R.ssg,'42016');R.sspring=mesh(R.ssg,sspGeo(0),M.steelK,0,-8.75,0);   /* dark tempered steel, not blued: nearly black in shade, light grey where it takes the light, (27, 31, 35) and (154, 166, 174) on KLUwI2UUCMQ 27:30 */
  mesh(R.ssg,cylY(0.4,1.5,10),M.steel,SSH[0][0],-8.1,SSH[0][1]);
  /* sustaining ratchet wheel (42009): free on the fusee arbor, open in the middle round the fusee's winding ratchet and its screws (Fig. 28) */
  const srP=part('sratchet',-22);R.sr=new THREE.Group();R.sr.position.set(L.Fu[0],0,L.Fu[1]);srP.add(R.sr);
  const WPR=8.9,WPF=[2.44,2.62],WPS=[0,1].map(k=>{const a=k*Math.PI+0.4;return WPF.map(t=>[WPR*Math.cos(a+t),WPR*Math.sin(a+t)]);});   /* the winding pawl springs' screws, at their feet about 150 deg round from their pawls */
  hn(R.sr,'42009');hn(mesh(R.sr,gearGeo(SRT.z,SRT.m,0.7,{ratchet:true,flip:true,bore:5*FK,holes:WPS.flat().map(q=>hC(...q,0.4))}),M.gilt,0,-9.45,0),'42009',{sub:1,gear:{z:SRT.z,m:SRT.m,ratchet:1}});
  mesh(R.sr,ringGeo(5*FK,2.75*FK,0.3),M.gilt,0,-9.25,0);   /* its web, free on the fusee arbor's collar (0.05 side shake; Fig. 69, arrow 5), under the heads of the winding ratchet's screws, which turn round inside the wheel's open centre as the key winds */   /* steep faces lead against the running direction, so the sustaining pawl holds it */
  R.ssPin=mesh(R.sr,cylY(0.4,1.45,10),M.steel,14.6*FK*Math.cos(SSP),-8.375,14.6*FK*Math.sin(SSP));   /* the pin from the sustaining spring's working end, in the ratchet (the manual pins the spring to both wheels) */
  /* two winding pawls on the sustaining ratchet wheel, their tips on the fusee's winding ratchet (rp 9.4 FK): pushed by its steep faces when running, slipping over them when winding.
     Each is held in by a winding-pawl spring (42007), a long thin arc round the wheel at about the pivots' radius, from its foot about 150 deg round (toward the side its pawl's
     tip points) back to the arm's outer side near the pivot, which it bears on (Figs. 28, 69; C Spinner 19:12, 18:40, 19:15: the two springs nearly round the wheel's middle,
     each held at its far end; the radius and the foot's place read to about 1 mm), its foot held by two screws (42012) put in from the
     ratchet's underside, through it into the foot: their slotted heads show there (restoration video 28:35), and Fig. 28 draws one so. The wheel is gilt brass, as the video shows it.
     wpsGeo: the spring for pawl angle th, its arc fixed and its last stretch bent so the end stays on the arm; update() rebuilds it as the pawl rides the teeth in winding */
  const wpsGeo=(pw,th)=>{const u=pw.userData,bk=pawlBack(u.pts,0.96,u.q,th,[0,0]),E=[bk.p[0]+bk.n[0]*0.095,bk.p[1]+bk.n[1]*0.095];
    return stripGeo([...u.arc,E],0.3,0.3);};   /* from its foot (screwed down, drawn once) round to its end on the arm */
  /* the winding ratchet's tips r 6.9 and the pawls' pivots r 8.78, ends r 6.8, width 1.6, their springs r 8.9 (5 October 2026: the toothed outline at 19:12 is the sustaining ratchet,
     116-120 teeth, not the fusee wheel; rescaled on its tips, r 14.53, everything read there was 1.24 times too large, and 23:30 through the bridge homography gives the ratchet's tips
     r 6.9 independently). The ratchet keeps its 36 teeth (38 +/- 2 at 23:30). Until then tips 8.75, pivots 10.85, ends 7.9, width 2.0, springs 10.68.
     Earlier, WPW: the pawls' width, 2.0 (C Spinner 19:12, against the fusee wheel's tips, 36.1 mm across, 1139 px: 1.9 by the eye, 2.2 at the square end, the eye r about 1.35; +-0.2), 0.9 until
     4 October 2026; their pivots about 10.4 mm out and their ends 8.8 there, as the model has them within 0.5-0.9 */
  const WPW=1.6;R.wp=[];for(let k=0;k<2;k++){const a=k*Math.PI+0.4,P=[8.78*Math.cos(a),8.78*Math.sin(a)],T=[6.8*Math.cos(a+0.3),6.8*Math.sin(a+0.3)],ln=Math.hypot(T[0]-P[0],T[1]-P[1])+0.2,pw=mesh(R.sr,pawlGeo(ln,WPW,0.5),M.steel,P[0],-10.05,P[1]);
    hn(cylBetween(R.sr,0.22,-9.45,-10.3,M.steel,...P,12),'42009',{sub:1});   /* the stud it turns on, pressed into the wheel, riveted flush with the pawl's top, which the fusee's underside turns over (C Spinner 19:12: each pawl on a stud; two of the holes under the wheel, 19:05) */
    pw.userData.q=P;pw.userData.th0=Math.atan2(T[1]-P[1],-(T[0]-P[0]));pw.userData.pts=pawlPts(ln,WPW);R.wp.push(pw);
    const pol=(r,t)=>[r*Math.cos(a+t),r*Math.sin(a+t)],r0=pol(WPR,WPF[1]),r1=pol(WPR,WPF[0]);pw.userData.arc=[];for(let t=WPF[0]-0.03;t>0.45;t-=0.06)pw.userData.arc.push(pol(WPR,t));
    pw.userData.spr=hn(mesh(R.sr,wpsGeo(pw,pw.userData.th0),M.blued,0,-10.1,0),'42007');pw.userData.sprTh=pw.userData.th0;
    hn(mesh(R.sr,stadium(r0,r1,1.0,0.47,[r0,r1].map(q=>hT(...q,0.4))),M.blued,0,-10.27,0),'42007',{sub:1});
    const fl=new THREE.Group();fl.rotation.x=Math.PI;R.sr.add(fl);for(const q of[r0,r1])hn(screw(fl,q[0],-q[1],9.1,0.4,0.15,0.7+0.42),'42012');}   /* the spring's foot, thick enough to be tapped (0.47; 0.03 under the fusee's face,
     which turns over it while winding), and its two screws (42012) from the ratchet's underside (y -9.1), 0.05 short of the foot's top */
  /* the arbor: pivots (r 0.5) in the train bridge and the plate (it has no bushing, Op. 15), shoulders 0.025 off them, and a hub (r 1.1) from its foot up under the pawl, as
     KLUwI2UUCMQ 35:37.5, 35:40 and 36:15 show it (the hub's radius read against the arbor's, about 1.3 times it; its height to about 1 mm) */
  const sp=hn(part('spawl',-22),'42096');sp.userData.axis=mesh(sp,shaftGeo([[TB_U-0.7,0.5],[TB_U+0.025,0.7],[-9.15,1.1],[y0-0.025,0.5],[y0+2]]),M.steel,SPv[0],0,SPv[1]);
  /* sustaining pawl: its tip rests in the sustaining ratchet's teeth (rp 16.2 FK) at SPt, trailing the pivot so the teeth can only pass it one way */
  /* its outline from those edges, in the pawl's frame (pivot at the origin, the tip's corner on -x at SPl, the back on the SPb side): one smooth curve from the tip's corner along SPN, round the hub behind the arbor (1.6-1.9 from it there: the video doesn't show that side) and along SPE to the
     tip's other corner, the end face straight between them, as the video's. The tip's corner is put at PAWL_TIP, where seatPawl and phaseAgainst look for it */
  const SPP=(()=>{const c=Math.cos(SPd),sn=Math.sin(SPd),L2=([a,q])=>new THREE.Vector2(-(a*c+q*sn),SPb*(-a*sn+q*c)),N=SPN.map(L2),E=SPE.map(L2),sN=Math.sign(N[0].y),
      B=[[1.8,sN*80],[1.6,0],[1.9,-sN*75]].map(([r,a])=>new THREE.Vector2(r*Math.cos(a*D2R),r*Math.sin(a*D2R)));
    return new THREE.SplineCurve([...N.slice().reverse(),...B,...E]).getPoints(150).map(v=>[v.x,v.y]).map((_,i,P)=>P[(i-PAWL_TIP+P.length)%P.length]);})();
  R.spawl=new THREE.Group();R.spawl.position.set(SPv[0],-9.45,SPv[1]);sp.add(R.spawl);mesh(R.spawl,polyGeo(SPP,0.6,[[0,0,0.7]]),M.steel,0,-0.3,0);
  R.spawl.userData.base=SPb0;R.spawl.rotation.y=SPb0;R.spawl.userData.pts=SPP;
  /* sustaining pawl's spring (part of 42096, "complete with arbor and springs"): a straight steel wire (r 0.12) set upright in the pawl's root at SPw, standing alongside
     the arbor to its top (KLUwI2UUCMQ 35:37.5-35:40, 36:15: the pawl's assembly lifted and seated; 36:23, 36:27: it rises under the train bridge), its top end 1 mm up a hole
     through the train bridge at SPh (two small sunk holes stand side by side on the bridge's face there, 36:23-36:29: the pivot's and, taken to be, the wire's). The pawl turned
     from SPh bends the wire, which turns it back into the teeth. R.spWire(th): the wire from its foot, with the pawl at rotation.y th, to its top, held in the hole */
  { const WT=new THREE.Vector3(SPh[0],TB_U-1.0,SPh[1]),w=mesh(sp,cylY(0.12,1,8),M.steel),up=new THREE.Vector3(0,1,0),d=new THREE.Vector3();
    R.spWire=th=>{const q=spW(th),F=new THREE.Vector3(q[0],-9.75,q[1]);d.subVectors(WT,F);w.scale.y=d.length();w.position.addVectors(F,WT).multiplyScalar(0.5);w.quaternion.setFromUnitVectors(up,d.normalize());};
    R.spWire(R.spawl.userData.base); }
  /* ---------- going train (modules from MOD, 0.392 / 0.3245 / 0.251 / 0.2614; counts in TRAIN) ---------- */
  const m=MOD.train;
  const cw=part('cw',-8);R.cw=hn(arbor(cw,M,...L.C,{wheel:{n:TRAIN.cw,m:MOD.centre,y:-5.36,th:0.7,spokes:5,prop:WHEEL_PROP.cw,collet:1.3,cside:1,cp:0.3,mate:TRAIN.tp},pin:{n:TRAIN.cp,m:MOD.fusee,y:-6.53,th:1.54},prof:[[TB_T-0.1,0.5],[TB_U+0.025,0.75],[y0-0.125,0.5],[5.45+DD]]}),'42068');   /* pivots r 0.5 in the bushings, shoulders 0.025 off them; the lower pivot runs on through the dial for the cannon pinion */
  const tw=part('tw',-4);R.tw=hn(arbor(tw,M,...L.T,{wheel:{n:TRAIN.tw,m,y:-4.535,th:0.65,spokes:5,prop:WHEEL_PROP.tw,cside:1,cp:0.2,mate:TRAIN.fp},pin:{n:TRAIN.tp,m:MOD.centre,y:-5.385,th:0.95},prof:[[TB_T-0.1,0.3],[TB_U+0.025,0.55],[LT_H-2.025,0.31],[LT_H-1.55]]}),'42071');
  const fw=part('fw',-30);R.fw=hn(arbor(fw,M,...L.F,{wheel:{n:TRAIN.fw,m:MOD.fourth,y:-7.46,th:0.9,spokes:FW_SP,prop:WHEEL_PROP.fw,cside:-1,mate:TRAIN.ep},pin:{n:TRAIN.fp,m,y:-5.51,th:2.9},prof:[[LB_T+2.56,0.25],[LB_T+3.025,0.55],[LT_H-2.025,0.35],[4.6+DD]]}),'42073');   /* its lower pivot runs on through the jewel and the dial for the second hand */
  const E=ESC,ew=part('escW',-41,true);
  R.esc=hn(arbor(ew,M,E.EX*ES,0,{pin:{n:TRAIN.ep,m:MOD.fourth,y:-6.96,th:4.0},prof:[[TB_T+SEAT_D+0.025,0.089],[TB_T+SEAT_D+0.6,0.67],[-0.6,0.089],[-0.025]]}),'42076');   /* the body r 0.67 (0.55, estimated, until 4 October 2026): the shank by the pinion, against a plain ground in the staking tool at KLUwI2UUCMQ 43:21.1, 88-89 px across on three rows against the pinion's 185 over its leaves, 0.456-0.478 of the pinion's tip radius (with 10 leaves the outline is 0.95-1 of the tips' circle), one depth, no camera; at this model's pinion tips, r m(z/2 + 0.525) = 1.444, r 0.66-0.69 (±10 % with the real pinion's addendum). Pivots r 0.089 in the olive-hole jewels (r 0.2, estimated, until 4 October 2026): 0.007 in across, Hamilton's own figure for escape staffs (US 2,392,745, Kleiner, 1946, col. 1: "pivots about 7 thousandths of an inch in diameter"), in the upper jewel's hole measured 0.15-0.19 mm across (J.eu's comment); the lower end's tip at 10:12.2, 8-11 px at about 40 px/mm by the pinion, agrees but no closer: the arbor's shadow on the plate; the shoulders, a step here, not resolved), ends 0.025 off the endstones (Op. 69); the pinion runs from the fourth wheel toward the plate, 1.1 mm above the third wheel's teeth, which pass under it. The pinion 4.0 long about its mesh (2.0, estimated, until 5 October 2026): in the staking tool at KLUwI2UUCMQ 43:21.1 its leaves run 227 px, 3.6-4.7 mm over the scales the frame allows (the escape wheel's 13.16 mm, 760-775 px across at the arbor's depth, the pinion 4-5 mm nearer the camera, the view 20-30 deg from above); its end there stands 8.7-10.1 mm from the wheel's web, the model's 10.45 within that */
  R.esc.userData.wheel=escapeWheel(R.esc,M,ES,EY,E);
  /* ---------- balance lower bridge (42065, Figs. 29, 30, 110; tools/lower_bridge.py, after a restoration video, References/VIDEOS.md): a stepped block of two levels. The lower (LB_LO, 3 mm,
       7.9-10.9 mm above the plate on the side photograph) is a slab curved as a lens, which holds the balance's lower setting and endstone cap and the fourth wheel's upper setting; its
       concave edge runs round the train bridge's escape lobe, so the escape wheel lifts out past it, and the escape arbor stands in a bite in that edge (the model's escape arbor stands 6.6 mm
       from the lobe's centre). The upper (LB_UP), against the train bridge's underside, is a lug at each end, with its screw, joined to the slab by a wall (LB_WALL); between them the
       escape wheel turns over the slab ---------- */
  /* the train-blocking screw (42247, Sec. II, Fig. 110) in the fourth end's wall, which rises round it to the upper tier, as the section in Fig. 110 draws it: bored for the head (r 0.95,
     through the upper tier and the wall) down to the seat 0.6 into the lower tier's top, tapped below it through the tier. The lower tier is drawn as two layers, the top one cut for the
     bore */
  const lb=part('lowerBridge',-41),LBh=[[...L.B,2.52],[...L.F,2.2],...S.blc.map(q=>hT(...q,ESCAP))],LB_U=TB_U+2;   /* LB_U: the upper tier's underside; the escape arbor passes through the slab in a hole wide enough to lift the escape wheel's pinion out through it from above */
  hn(lb,'42065');R.lowerBridge=mesh(lb,polyGeo(LB_LO,0.6,[...LBh,[...S.tBlock,1.15]]),M.plate,0,LB_T,0);mesh(lb,polyGeo(LB_LO,2.0,[...LBh,hT(...S.tBlock,TBS_R,0.42)]),M.plate,0,LB_T+0.6,0);
  mesh(lb,polyGeo(LB_LO2,0.4,[[...L.B,4.56],[...L.F,2.7],hT(...S.tBlock,TBS_R,0.42)]),M.plate,0,LB_T+2.6,0);   /* its underside: the cap in a round counterbore (0.1 round the cap's R 4.46) and the fourth's setting (r 2.2, as large as the video shows it) standing in a sink, 0.4 deep, as the restoration video shows them */
  mesh(lb,polyGeo(LB_WALL[0],LB_T-LB_U),M.plate,0,LB_U,0);mesh(lb,polyGeo(LB_WALL[1],LB_T-LB_U,[[...S.tBlock,1.15]]),M.plate,0,LB_U,0);mesh(lb,polyGeo(LB_WALL[2],LB_T-LB_U),M.plate,0,LB_U,0);
  /* the upper tier (the lugs), 2 mm thick. Two screws (42055, the pillar screws) from below, through the tier into the train bridge (Figs. 29, 67 and 110 draw them head down under the bridge;
     Op. 12 screws the bridge to the upturned train bridge, Op. 50 takes them out once it is off), one in each lug, and two steady pins into the train bridge ("complete with pins").
     The screw at the arm's end, on the 3 o'clock side, is outside every wheel: a hole in the pillar plate reaches it (RMG No. 4E019) */
  mesh(lb,polyGeo(LB_UP[0],2.0,[hC(...S.lb[1],PSR),[...S.lbp[1],0.41]]),M.plate,0,TB_U,0);mesh(lb,polyGeo(LB_UP[1],2.0,[[...S.tBlock,1.15]]),M.plate,0,TB_U,0);mesh(lb,polyGeo(LB_UP[2],2.0,[hC(...S.lb[0],PSR),[...S.lbp[0],0.41]]),M.plate,0,TB_U,0);
  for(const q of S.lbp)cylBetween(lb,0.4,LB_U,TB_U-1.0,M.steel,...q);
  /* balance lower setting (42162) in the bridge, and the lower endstone cap (42159) with its screws on the bridge's underside (Fig. 110) */
  hn(mesh(lb,ring(2.52,0.9,2.6),M.gilt,L.B[0],LB_T+1.3,L.B[1]),'42162.bl');hn(mesh(lb,ring(2.2,0.9,3.0),M.gilt,L.F[0],LB_T+1.5,L.F[1]),'42161.fu');{const q=hn(mesh(lb,stoneGeo(0.9,0.27,0.4,'bar'),M.ruby,L.F[0],LB_T+2.8,L.F[1]),'J.fu');q.rotation.x=Math.PI;}   /* its oil sink up, away from the wheel */   /* and the fourth wheel upper setting (42161) */   /* the balance lower setting r 2.52, its jewel r 0.9: KLUwI2UUCMQ 13:44, the slab from above through the keyhole, its gilt edge picked at 4K and put back 9.0 mm under the train bridge's top through framecam.py (anchors/setting_13-44.json: round to 0.05 mm rms, r 2.51-2.53 over f 2600-4000; the jewel 1.4 mm from the model's balance); r 1.2, estimated, until 4 October 2026 */hn(mesh(lb,stoneGeo(0.9,0.19,0.6,'olive'),M.ruby,L.B[0],LB_T+2.3,L.B[1]),'J.bl');   /* its hole r 0.19 round the pivot's r 0.18, as the upper's */
  { const lbf=new THREE.Group();lbf.rotation.x=Math.PI;lb.add(lbf);{ const v=[-lbu[1],lbu[0]],w=(v[0]*(L.E[0]-L.B[0])+v[1]*(L.E[1]-L.B[1]))>0?[-v[0],-v[1]]:v;endCap(lbf,L.B[0],-L.B[1],[lbu[0],-lbu[1]],-(LB_T+2.6),2.0,3.25,['42159.bl','J.ble','20762.blc'],4.46,[w[0],-w[1],2.78],0.45,0,0.85,1.87); }   /* the cap round, R 4.46 (its screws 3.25 either side of the jewel, along the balance-fourth line within 6 deg, their heads r 0.85), cut flat 2.78 out on the side away from the escape arbor, parallel to its screws, its window a straight bore r 1.87 over the endstone: KLUwI2UUCMQ 13:49.5, the underside face-on, its edge, flat, window and screws picked at 4K and put back through framecam.py at the cap's face (anchors/cap_13-49.5.json: R 4.42-4.49 round to 0.09 mm rms, the screws 6.5 apart, the window r 1.85-1.88, over f 5000-7000); R 2.7 with its screws 1.9 out, until 4 October 2026, scaled the same ratios by an estimated spacing. Fig. 30 draws it round; its thickness estimated */
  for(const q of S.lb)hn(screw(lbf,q[0],-q[1],-LB_U,PSR,PSH,2.0+2.5),'42055.lb').userData.lift=2.0+2.5+0.5; }   /* the bridge's screws in the flipped frame: heads on the upper tier's underside, 2.5 mm into the train bridge;
    in the Exploded view they drop out of the tier, no further (the fourth wheel lies below) */
  /* train-blocking screw (42247, Sec. II, Fig. 110): threaded through the lower bridge's lower tier, its head in the wall's bore. Screwed down, its head stops on the seat and its dog point stands between
     the fourth wheel's spokes, so the train can turn only until a spoke meets it; screwed up (as it runs), the chamfer on its head seats in the countersunk access hole in the
     train bridge, and the slotted spigot above the head stands in the hole, where a screwdriver reaches it (Fig. 110's section). The thread (6.2 mm) stays in the bridge at both ends of its 5.6 mm travel. R.tbs.userData: seat heights and the dog point's place for blockRoom */
  { const bs=part('tblock',-41),r=TBS_R,h=0.9,c=0.25,sp=1.5,rp=0.5,rs=0.42,pt=0.176,d=pt*0.3,Lt=6.2,Ld=6.81,rd=0.25,pr=[V2(0,-h-sp),V2(rp,-h-sp),V2(rp,-h),V2(r-c,-h),V2(r,-h+c),V2(r,0),V2(rs,0)];
    const n=Math.floor(Lt/pt);for(let i=0;i<n;i++){const a=Lt-(n-i)*pt;pr.push(V2(rs-d,a+pt/2),V2(rs,a+pt));}pr.push(V2(rs-d,Lt),V2(rd,Lt+0.05),V2(rd,Ld),V2(0,Ld));
    R.tbs=hn(new THREE.Group(),'42247');R.tbs.position.set(...[S.tBlock[0],0,S.tBlock[1]]);bs.add(R.tbs);mesh(R.tbs,new THREE.LatheGeometry(pr,28),M.steel);
    mesh(R.tbs,new THREE.BoxGeometry(rp*2.02,0.35,0.3),M.steelD,0,-h-sp+0.155,0);   /* the slot, in the top of the spigot (sp above the head, as Fig. 110's section draws it: raised, it stands in the train bridge's access hole) */
    const up=TB_U+h+0.03,down=LB_T+0.6;Object.assign(R.tbs.userData,{up,down,turns:(down-up)/pt,rho:TBr,sig:Math.atan2(-TBd[1],TBd[0]),half:Math.asin((0.45+rd)/TBr)});R.tbs.position.y=up; }
  /* ---------- detent (manual Figs. 14, 90, 110; detent photograph in chronometerbook post 4). Beryllium-copper detent (parts list 42087): foot clamped to the
       support block, two-strip detent spring, cross-piece carrying the Z bracket of the Elinvar trip (passing) spring, blade, jewel block with the locking jewel,
       and the arm whose horn the trip spring rests on. It lies between the escape wheel and the balance lower bridge (Op. 82); the arm crosses over the trip spring
       and the horn drops to it (Fig. 14). Support block hung from the upper train bridge by one screw, with the stop button beside the jewel (Figs. 14, 90) ---------- */
  const dt=part('det',-40,true);
  R.det=hn(new THREE.Group(),'42087');R.det.position.set(E.Ft.x*ES,0,E.Ft.y*ES);dt.add(R.det);const fx=new THREE.Group();fx.position.copy(R.det.position);dt.add(fx);   /* moving about the point of flexure; fixed */
  /* pts: an outline, or the name of one of ESC.pieces, which is rebuilt from ESC when the escapement's settings change (escSet, the adjuster's bench); holes likewise, or a function */
  const DETM=[],poly=(g,pts,ya,yb,mat,holes=/** @type {any} */([]))=>{const k=typeof pts==='string'?pts:null,F=typeof pts==='function'?pts:null,G=()=>{const s=new THREE.Shape();(k?E.pieces[k]:F?F():pts).forEach((p,i)=>{const x=(p.x-E.Ft.x)*ES,z=(p.y-E.Ft.y)*ES;i?s.lineTo(x,z):s.moveTo(x,z);});s.closePath();
    for(const[p,r]of typeof holes==='function'?holes():holes){const h=new THREE.Path();h.absarc((p.x-E.Ft.x)*ES,(p.y-E.Ft.y)*ES,r,0,TAU,true);s.holes.push(h);}   /* holes: [unit-frame point, radius in mm] */
    const ge=extrude(s,{depth:yb-ya,bevelEnabled:false,curveSegments:12});ge.rotateX(Math.PI/2);ge.translate(0,yb,0);return ge;},m=mesh(g,G(),mat);if(k||F)DETM.push({m,G});return m;};   /* pts: an outline, one of ESC.pieces by name, or a function of ESC */
  const Fx=E.fixed,Cu=M.copper;
  hn(poly(fx,Fx.foot,-19.26,-17.36,Cu),'42087',{sub:1});poly(R.det,'spring',-19.26,-18.76,Cu);poly(R.det,'spring',-17.86,-17.41,Cu);poly(R.det,'cross',-19.26,-17.36,Cu);   /* bottoms staggered so no two faces are coplanar */
  poly(R.det,'blade',-18.21,-17.41,Cu);poly(R.det,()=>{const b=E.pieces.block.map(p=>[p.x,p.y]);return subtractCircle(b,[E.Jc.x,E.Jc.y],E.rJ).map(([x,y])=>({x,y}));},-18.26,-17.36,Cu,()=>{const b=E.pieces.block,c=E.Jc,in_=Math.min(c.x-Math.min(...b.map(p=>p.x)),Math.max(...b.map(p=>p.x))-c.x,c.y-Math.min(...b.map(p=>p.y)),Math.max(...b.map(p=>p.y))-c.y)>E.rJ;return in_?[[c,E.rJ*ES]]:[];});   /* the jewel block, cut for the locking jewel: a notch where the stone stands out of it, a hole where it doesn't */poly(R.det,'arm',-18.16,-17.86,Cu);poly(R.det,'horn',-17.86,-17.41,Cu);hn(poly(R.det,'bracket',-17.86,-17.46,Cu),'42092');
  hn(poly(R.det,'stone',-19.81,-17.33,M.ruby),'285');
  /* locking jewel wedge pin (42089, Figs. 57-59): beside the jewel in its hole in the block, on the side away from the wheel, pressing it against the hole's wall; pushed in
     flush with the block's top and cut and stoned flush below (Sec. VII, re-jewelling the detent, 8-9). Rebuilt with the stone */
  /* the trip spring bracket's screw (1770, Fig. 110): along the bracket's leg from its end into the cross-piece it continues; a horizontal screw in vertically extruded pieces, drawn without holes (as the detent's other cross screws). Rebuilt with the detent */
  const cyl=(p0,p1,r)=>{const d=new THREE.Vector3().subVectors(p1,p0),l=d.length();return[cylY(r,l,12),new THREE.Matrix4().compose(p0.clone().add(p1).multiplyScalar(0.5),new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()),new THREE.Vector3(1,1,1))];};   /* a cylinder from p0 to p1, for mergeGeo */
  { const G=()=>{const P=q=>new THREE.Vector3((q.x-E.Ft.x)*ES,-17.66,(q.y-E.Ft.y)*ES);
      const a=P(E.D(0.63,E.brO)),b=P(E.D(0.63,0.003)),c=P(E.D(0.63,E.brO+0.15/ES));return mergeGeo([cyl(b,a,0.08),cyl(a,c,0.18)]);};
    const m=hn(mesh(R.det,G(),M.steel),'1770.br'),ax=new THREE.Object3D();R.det.add(ax);m.userData.axis=ax;   /* ax: the screw's axis, for tools/bom.py */
    const place=()=>{const a=E.D(0.63,E.brO),b=E.D(0.63,0.003),P=new THREE.Vector3((a.x-E.Ft.x)*ES,-17.66,(a.y-E.Ft.y)*ES),Q=new THREE.Vector3((b.x-E.Ft.x)*ES,-17.66,(b.y-E.Ft.y)*ES);ax.position.copy(P);ax.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),Q.sub(P).normalize());};place();
    DETM.push({m,G:()=>{place();return G();}}); }
  const wpAt=()=>{const r=E.rJ+0.1/ES,dx=-E.nF.x-E.dirB.x*0.17+E.nB.x*0.98,dy=-E.nF.y-E.dirB.y*0.17+E.nB.y*0.98,l=Math.hypot(dx,dy),q={x:E.Jc.x+dx/l*r,y:E.Jc.y+dy/l*r};return[(q.x-E.Ft.x)*ES,(q.y-E.Ft.y)*ES];};
  const wPin=hn(mesh(R.det,cylY(0.1,0.9,12),M.steel,...(([x,z])=>[x,-17.81,z])(wpAt())),'42089');
  /* the block (it was notched round the third arbor until the layout move of 2 October 2026, which left it 11.7 mm from it) */
  hn(poly(fx,Fx.blockMain,TB_U,-17.46,M.plateSolid,[[E.D(...DBLK.s),hT(0,0,1.0)[2]],...DBLK.p.map(([t,n])=>[E.D(t,n),0.53])]),'42086');hn(poly(fx,Fx.blockFront,-18.26,-17.46,M.plateSolid),'42086',{sub:1});hn(poly(fx,Fx.button,-18.16,-17.51,M.steel),'42086',{sub:1});
  /* the block's two positioning pins (Sec. II: "fastened to the underside of the upper train bridge by means of one screw and two positioning pins"; Figs. 14, 22, 90; KLUwI2UUCMQ 11:08):
     pressed 1.5 mm into its top face, standing 1.2 mm into the train bridge */
  for(const[t,n]of DBLK.p){const q=E.D(t,n);hn(mesh(fx,cylY(0.53,2.7,16),M.steel,(q.x-E.Ft.x)*ES,TB_U+0.15,(q.y-E.Ft.y)*ES),'42086',{sub:1});}
  /* screws in detent coordinates (t along the detent, n across it): clamp screw and two steady pins across the foot;
     detent-adjusting screw at the block's end; lock-adjusting screw and its clamp screw across the block's front, under the wheel; trip-spring screw on the bracket */
  const dd=new THREE.Group();dd.position.copy(R.det.position);dd.rotation.y=-Math.atan2(E.dirB.y,E.dirB.x);dt.add(dd);const T=(t,n)=>[t*ES,-n*ES];
  const across=(g,t,n0,n1,r,y,mat)=>{const q=mesh(g,cylY(r,(n1-n0)*ES,16),mat,t*ES,y,-(n0+n1)/2*ES);q.rotation.x=Math.PI/2;return q;};
  hn(across(dd,-0.75,0.083,0.083+1.4/ES,0.95,-18.31,M.steel),'37024');hn(across(dd,-0.75,0.083,0.083+0.25/ES,1.25,-18.31,M.steel),'42251.det');for(const t of[-9.3/ES,-1.7/ES])hn(across(dd,t,-0.2,0.083+1.2/ES,0.22,-18.31,M.steel),'42086',{sub:1});   /* the detent's steady pins, standing 1.2 mm out of the foot (Fig. 90, KLUwI2UUCMQ 11:08), at t -9.3 and -1.7 mm, 7.6 apart (11:26.435: 0.67 of the block pins' spacing; Fig. 90 7.85); -7.9 and -1.97 until 5 October 2026. The block's positioning pins r 0.53 (95-100 px; Fig. 90's 0.99 across), 0.4 before */
  hn(across(dd,-0.75,-0.35,0.083,0.45,-18.31,M.steel),'37024',{sub:1});   /* the clamp screw's shank, through the foot into the block */
  { const a=E.adj,b=a.BE+0.5/ES;for(const[r,t0,t1]of[[a.r,a.tH,a.tS],[0.35,a.tS,b]]){const q=hn(mesh(dd,cylY(r,(t1-t0)*ES,16),M.steel,(t0+t1)/2*ES,-18.61,-a.n*ES),'20756',r<0.5&&{sub:1});q.rotation.z=Math.PI/2;} }   /* detent-adjusting screw (Fig. 90; Ops. 84, 93): its head against the wall of the foot's slot, and shank 0.5 mm into the block (shortened to clear the train pillar, provisional, Review-results.md "Elsewhere", 12) */
  for(const t of[E.BL-0.15,1.2]){const k=t===1.2?'42091.cl':'42091.lk';hn(across(dd,t,-0.3-0.3/ES,-0.3,0.42,-17.81,M.steel),k);hn(across(dd,t,-0.3,t===1.2?-0.09:-0.137,0.2,-17.81,M.steel),k,{sub:1});}   /* lock-adjusting screw and its clamp screw: heads and shanks; the lock screw's point on the strip that carries the stop button, the clamp screw across the slot into it (Fig. 90) */
  /* trip spring screw (1770, Figs. 14, 54; KLUwI2UUCMQ 11:08, its head face-on): across the spring, 0.2 mm along its foot, through the hole in the foot ("place trip spring screw in the
     hole of the trip spring", Sec. VII, reassembly of the detent, 8) into the bracket's upright leg, its head on the spring's inner face; drawn without holes, as the bracket's screw. Rebuilt with the detent */
  { const Y=-17.71,P=(t,n)=>{const q=E.D(t,n);return new THREE.Vector3((q.x-E.Ft.x)*ES,Y,(q.y-E.Ft.y)*ES);},ends=()=>{const t=E.tR+0.2/ES,s0=E.nR-E.settings.tsT/2/ES;return[P(t,s0),P(t,E.brO-0.04/ES),P(t,s0-0.12/ES)];};
    const G=()=>{const[a,b,c]=ends();return mergeGeo([cyl(a,b,0.07),cyl(c,a,0.16)]);},m=hn(mesh(R.det,G(),M.steel),'1770.ts'),ax=new THREE.Object3D();R.det.add(ax);m.userData.axis=ax;
    const place=()=>{const[a,b]=ends();ax.position.copy(a);ax.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.sub(a).normalize());};place();DETM.push({m,G:()=>{place();return G();}}); }
  R.pspring=hn(mesh(dt,new THREE.BufferGeometry(),M.steel),'42088');
  /* the trip spring (42088, Fig. 14): a flat Elinvar strip on edge, E.settings.tsT thick and 0.3 mm deep, bending in its thin direction; its foot, 0.2 mm thick, is screwed to the
     angle bracket (whose leg it lies against, on the +n side) for 0.4 mm and thins to the strip over the next 0.2 mm. pts: root, control point and tip from ESC.springPts */
  const tripGeo=([a0,am,tp])=>{const N=24,Q=[],t2=E.settings.tsT/2,L=[],Rr=[];for(let i=0;i<=N;i++){const u=i/N,v=1-u;Q.push({x:(v*v*a0.x+2*u*v*am.x+u*u*tp.x)*ES,y:(v*v*a0.y+2*u*v*am.y+u*u*tp.y)*ES});}
    let sAcc=0;Q.forEach((p,i)=>{const a=Q[Math.max(0,i-1)],b=Q[Math.min(N,i+1)];let nx=-(b.y-a.y),ny=b.x-a.x;const l=Math.hypot(nx,ny);nx/=l;ny/=l;if(nx*E.nB.x+ny*E.nB.y<0){nx=-nx;ny=-ny;}
      if(i)sAcc+=Math.hypot(p.x-Q[i-1].x,p.y-Q[i-1].y);const wp=t2+(0.1-t2)*clamp((0.6-sAcc)/0.2,0,1);L.push([p.x-nx*t2,p.y-ny*t2]);Rr.push([p.x+nx*wp,p.y+ny*wp]);});
    const sh=new THREE.Shape(),P=L.concat(Rr.reverse());sh.moveTo(...P[0]);P.slice(1).forEach(p=>sh.lineTo(...p));sh.closePath();
    const g=extrude(sh,{depth:0.3,bevelEnabled:false});g.rotateX(Math.PI/2);g.translate(0,EY+1.4,0);return g;};   /* its top flush with the bracket's, under the screw's head */
  /* ---------- balance (rim r 14.5, measured on the top-view photograph) and hairspring ---------- */
  const bl=part('bal',-80,true);
  /* the hairspring stud's holes in the cock's top, read on KLUwI2UUCMQ 41:58 (the cock top up, 4K) through a homography fitted on the cock screw's counterbore, the endstone setting, the
     cap's two screw holes and the top face's two arc-end corners (COCK_POLY 30 and 0): 0.02-0.14 mm residuals, the corners each predicted from the rest to 0.5-0.65. A row of three along
     the cock's straight edge, at (along, across) the line from the staff to the cock screw (SPD, SPDn): 41:58 gives (2.23, -3.07), (5.44, -4.27), (8.65, -5.73); the top-view photograph,
     nearly overhead, with the stud in place (a pin, the slotted stud screw, a pin), through its map on the barrel bridge's screws from the setting's centre, (1.93, -3.49), (5.03, -4.97),
     (8.36, -6.49) (its scale a few % large: the cock's top is 11 mm above that map's plane); their mean, +-0.4: a small hole 3.9 mm from the staff (SPHc), the stud screw's, wider
     (counterbored), 7.0 (SPHb), and a small one 10.5 (SPHa): the stud's two steady pins either side of its screw (the model had one pin, 5.6 out, and the screw 7.6 along SPD). The row's line passes 2.0 from the
     staff. The stud's clamp is under the bar's inner end, past the inner pin (Fig. 5; Hamilton's patent US 2,379,780, Fig. 10): on KLUwI2UUCMQ 6:47.5 and 6:47.75 (the balance
     lifted out, the stud seen from the cock side, 33 px/mm at 4K), put in mm along the row by a 1D perspective fit on the three holes, the wedge pin's hole is 1.76 and 1.68 inside
     the inner pin (SP_CL, 1.7), the bar's end 2.24 and 2.10 (SP_E, 2.2) and the step where the clamp drops from its underside 1.13 and 1.10 (SP_ST); the bar's outer end 0.79 and 0.77
     past the outer pin (the 0.8 drawn). The hairspring's upper end is in the clamp, HS_R from the staff (2.65; it was 4.6, the clamp drawn between the pin and the screw), in its direction (SPD2; SPSI, the same as a rotation in the balance's frame), its
     lower end in the same direction against the collet's end face (HS_RI: the face and the wire's half width), bent to run HS_LEAD straight along it into the clamp (Fig. 6 draws
     the end bent; Op. 4 cuts it one wire width past the bend). The spring rises HS_H from HS_Y, the collet's tongue, to the clamp under the cock. CKS: the collet's scale, its
     drawing's coil (read as r 5.5) against the measured one */
  const Q=S.cock,SPD=(()=>{const d=[Q[0]-L.B[0],Q[1]-L.B[1]],l=Math.hypot(...d);return[d[0]/l,d[1]/l];})(),SPDn=[-SPD[1],SPD[0]],SPH=(a,c)=>[L.B[0]+a*SPD[0]+c*SPDn[0],L.B[1]+a*SPD[1]+c*SPDn[1]];
  const SPHc=SPH(2.08,-3.28),SPHb=SPH(5.24,-4.62),SPHa=SPH(8.51,-6.11),SPu=(()=>{const d=[SPHa[0]-SPHc[0],SPHa[1]-SPHc[1]],l=Math.hypot(...d);return[d[0]/l,d[1]/l];})();
  const SP_CL=1.7,SP_E=2.2,SP_ST=1.1,SPin=s=>[SPHc[0]-s*SPu[0],SPHc[1]-s*SPu[1]],SPCL=SPin(SP_CL),HS_R=Math.hypot(SPCL[0]-L.B[0],SPCL[1]-L.B[1]),SPD2=[(SPCL[0]-L.B[0])/HS_R,(SPCL[1]-L.B[1])/HS_R];   /* SPin(s): s mm inside the inner pin along the row */
  const SPSI=Math.atan2(-SPD2[1],SPD2[0])-BETA,HS_RC=5.1,HS_N=12,CKS=HS_RC/5.5,HS_B=0.23,HS_T=0.221,HS_RI=3.2,CKC=(HS_RI-HS_T/2)/3.72,HS_LEAD=1.25*CKC,HS_Y=BAL_Y-1.5,SB_T=0.85,CLD=0.6,HS_H=HS_Y-(CK_T+2.6+SB_T+CLD/2),SPS=SPHb;   /* SPS: the stud screw. HS_Y, HS_H: the collet's tongue (the spring's lower end) 1.1 below the rim's top edge, as low as the hub allows (the collet
     0.07 over the hub's boss and the cap's screws; 0.8 lower until 4 October 2026, level with the rim's top), and the spring up to the stud's clamp, whose height the cock fixes (below) */
  R.staff=hn(new THREE.Group(),'42186');bl.add(R.staff);
  const RIT=1.47;   /* the impulse roller's thickness (below) */
  { /* the balance staff, traced whole on a bare Model 21 staff photographed on its own (watchdoc.com's "Hamilton Model 21 WW2 Ship Chronometer Balance Staff", 748 px: References/README.md,
       web photographs): its width along the axis by brightness edges, scaled by its length between the pivots' tips, 697 px for this model's 25.75 (27.1 px/mm; ±3 %). From the lower
       (dial-side) tip: a cone of about 2.2 mm to 1.37 mm across; 1.37 to a collar 2.62 across and about 1.3 long, the impulse roller's seat (drawn at the roller's measured height, EY);
       1.84 under the hub's sleeve and the hub; 1.53 (the hairspring's collet) to 1.22 near the cock, then the upper cone. The step from 1.84 to 1.53 is drawn at the hub boss's top
       (the photograph puts it 0.7 nearer the roller, inside its scale's error). The pivots r 0.18 for 0.65 mm: KLUwI2UUCMQ 7:08 (two dark edges round a bright core, 0.36 ±0.03 mm
       across); that frame's 2.07 mm shoulder and 1.68 seat by the lower end belong to the unlocking roller's boss, not the staff, which the bare staff shows 1.37 there. The upper
       pivot taken as the lower. Each pivot in its olive-hole jewel and 0.025 short of its endstone: endshake 0.05 mm (0.001-0.003 in, Op. 74). Until 5 October 2026 the body was
       r 0.45 throughout (estimated) */
    const PV=0.18,yT=CK_T+0.025,yB=LB_T+2.575,LS=yB-yT,u=y=>yB-y,uR0=u(EY-0.07+RIT/2),uR1=u(EY-0.07-RIT/2),uH=u(BAL_Y-0.25);   /* uH: the hub boss's cock-side end (its AY-0.35 in the balance's frame) */
    const prof=[[0,0],[PV,0],[PV,0.65],[0.195,0.65],[0.685,2.2],[0.685,uR0],[1.31,uR0],[1.31,uR1],[0.92,uR1],[0.92,uH],[0.765,uH],[0.765,22.1],[0.61,22.1],[0.61,23.4],[0.195,LS-0.65],[PV,LS-0.65],[PV,LS],[0,LS]];
    R.STAFF={r0:0.685,rC:1.31,rH:0.92,rS:0.765};   /* the bores round it: the unlocking roller's, the impulse roller's, the hub's and its sleeve's, the collet's */
    mesh(R.staff,new THREE.LatheGeometry(prof.map(([r,uu])=>new THREE.Vector2(r,yB-uu)).reverse(),24),M.steel); }
  /* impulse roller (O.D. 0.249 in, as thick as the escape wheel, post 30) with its crescent: the large portion behind the impulse jewel, where each tooth
     drops in and meets the jewel, and the small portion ahead of it, which the teeth never enter (Ops. 76, 83). Shape angle = minus the unit-frame angle */
  const rR=E.rRoll*ES,rollG=()=>{const ir=new THREE.Shape(),n0=-E.aI,n1=n0+0.6;ir.absarc(0,0,rR,n1,n0-0.2+TAU,false);ir.absarc(0,0,rR-0.9,n0-0.2,n0,false);   /* the notch the impulse jewel is set in, down to its inner end (rR - 0.9) */ir.absarc(0,0,rR*0.55,n0,n1,false);
    for(let k=1;k<=3;k++){const a=n0+k*Math.PI/2,h=new THREE.Path();h.absarc(0.62*rR*Math.cos(a),0.62*rR*Math.sin(a),0.5,0,TAU,true);ir.holes.push(h);}   /* its three holes (Figs. 14, 61, 90), a quarter turn apart from the jewel */
    const hb=new THREE.Path();hb.absarc(0,0,R.STAFF.rC,0,TAU,true);ir.holes.push(hb);   /* bored to the staff's collar, its seat */
    const irg=extrude(ir,{depth:RIT,bevelEnabled:false,curveSegments:32});irg.rotateX(-Math.PI/2);irg.translate(0,-RIT/2,0);return irg;};
  const roll=hn(mesh(R.staff,rollG(),M.steel,0,EY-0.07,0),'42263');
  /* the jewels as placed for ESC (again by escSet): the impulse jewel, the wheel centred on it, showing above and below (Op. 82); the discharge jewel on its roller */
  /* a jewel along the radius at ang from r0 to r1, w wide, h tall. d: the impulse jewel's section, flat on its impulse face (the -angle side, which the teeth drive) and
     curved on its back ("curved side of the jewel toward the operator", Sec. VII roller jewelling), thinning to 0.45 w at its ends; else a flat plate */
  const palSet=(q,ang,r0,r1,w,h,d)=>{if(q.geometry)q.geometry.dispose();
    if(d){const sh=new THREE.Shape(),zE=-w/2+0.45*w;sh.moveTo(r0,w/2);sh.lineTo(r1,w/2);sh.lineTo(r1,-zE);sh.quadraticCurveTo((r0+r1)/2,-(w-zE),r0,-zE);sh.closePath();   /* shape y = -local z */
      const g=extrude(sh,{depth:h,bevelEnabled:false,curveSegments:12});g.rotateX(-Math.PI/2);g.translate(0,-h/2,0);q.geometry=g;q.position.x=0;q.position.z=0;}
    else{q.geometry=new THREE.BoxGeometry(r1-r0,h,w);q.position.x=(r0+r1)/2*Math.cos(ang);q.position.z=(r0+r1)/2*Math.sin(ang);}
    q.rotation.y=-ang;return q;};
  const palI=()=>[E.aIc,rR-0.9,E.rp*ES,E.wI*ES,RIT,true],palD=()=>[E.aD,E.rDR*ES-0.4,E.rd*ES,E.wD*ES,0.7];
  const pI=hn(palSet(mesh(R.staff,new THREE.BufferGeometry(),M.ruby,0,EY-0.09,0),...palI()),'286');
  /* unlocking roller (42252, Fig. 64): a collar on the staff, its jewel in a slot along it (the jewel's width), and a wider slot opposite; turned on the staff to set the drop (Op. 97) */
  /* the unlocking roller as a staff out of its balance shows it, side-on against the light (KLUwI2UUCMQ 34:09.26, 158.5 px/mm by the impulse roller's 1,003 px; 6:50.0 and 7:08 agree
     as ratios): a body 2.0 long from 0.18 clear of the impulse roller (its end 0.02 past the jewel's), two flats on it 1.9 across at right angles to the discharge jewel, its round part the escapement's rDR, then a
     round end 2.57 across and 1.1 long toward the pivot, 3.1 in all (3.2 +/- 0.15; the lower bridge 0.24 below its end). The jewel stays where the trip spring meets it (EY+1.2): the
     frames put it about 1.6 from the impulse roller's face, roughly. A collar 1.0 long until 5 October 2026. The impulse roller 1.47 thick (RIT; 236 px), its jewel as long; 1.3 and 1.56 before */
  const collarG=()=>{const ro=E.rDR*ES,sl=[[-E.aD,E.wD*ES,ro-0.55],[-E.aD+Math.PI,0.3,ro-0.6]].sort((p,q)=>((p[0]%TAU)+TAU)%TAU-((q[0]%TAU)+TAU)%TAU),sh=new THREE.Shape();let st=true;
    const pt=(x,y)=>{st?sh.moveTo(x,y):sh.lineTo(x,y);st=false;},N=64,mod=a=>((a%TAU)+TAU)%TAU;let a=0;
    for(const[c0,w,rin]of sl){const c=mod(c0),h=Math.asin(w/2/ro),ux=Math.cos(c),uy=Math.sin(c),nx=-uy,ny=ux,ro2=Math.sqrt(ro*ro-w*w/4);
      for(;a<c-h;a+=TAU/N)pt(ro*Math.cos(a),ro*Math.sin(a));pt(ro*Math.cos(c-h),ro*Math.sin(c-h));
      pt(ro2*ux-w/2*nx,ro2*uy-w/2*ny);pt(rin*ux-w/2*nx,rin*uy-w/2*ny);pt(rin*ux+w/2*nx,rin*uy+w/2*ny);pt(ro2*ux+w/2*nx,ro2*uy+w/2*ny);a=c+h;}
    for(;a<TAU-1e-9;a+=TAU/N)pt(ro*Math.cos(a),ro*Math.sin(a));
    { const c=-E.aD,nx=-Math.sin(c),ny=Math.cos(c),F=0.95;for(const q of sh.curves)for(const k of['v1','v2']){const v=q[k];if(!v)continue;const d=v.x*nx+v.y*ny;if(Math.abs(d)>F){v.x-=nx*(d-Math.sign(d)*F);v.y-=ny*(d-Math.sign(d)*F);}} }   /* the two flats */
    sh.closePath();
    const hb=new THREE.Path();hb.absarc(0,0,R.STAFF.r0,0,TAU,true);sh.holes.push(hb);   /* bored to the staff there */
    const g=extrude(sh,{depth:2.0,bevelEnabled:false,curveSegments:32});g.rotateX(-Math.PI/2);g.translate(0,-0.37,0);
    const e=ringGeo(1.285,R.STAFF.r0,1.1);e.translate(0,1.63+0.55,0);return mergeGeo([[g,new THREE.Matrix4()],[e,new THREE.Matrix4()]]);};
  const collar=hn(mesh(R.staff,collarG(),M.steel,0,EY+1.2,0),'42252');const pD=hn(palSet(mesh(R.staff,new THREE.BufferGeometry(),M.ruby,0,EY+1.2,0),...palD()),'287');
  /* hairspring collet (Sec. II; Figs. 5, 6, 49, the only source: no photograph or video shows one), measured on Fig. 6's drawings, the collet alone and in the spring's
     lowest coil: their points put back on the plan through a parallel projection foreshortened 0.63 (the coil's ellipse; the arc and the cut round as circles and the notch
     square to the front at it), sized by the hub, 0.213 of the coil's diameter: the numbers below are read against the coil as r 5.5, and scaled by CKC so that its end face, where the spring's end lies against it, is HS_RI less the strip's half thickness from the staff. HS_RI, 3.2: KLUwI2UUCMQ 6:53.25 and 6:53.5 (the balance held with the arm to the camera) show the collet's end, its block and brass wedge pin by the hub's cap, the pin 2.8-3.9 mm from the staff against the coil's near end (Hough circles, 229-235 px for its 5.26 mm outer edge); and a short inner terminal curve meets Phillips' conditions only for an end at 2.9-3.3 (tools/hairspring.js): 3.2 is inside both, an estimate (until 4 October 2026 the collet was scaled by the coil, CKS, its end at 3.62). In its frame (x along the front edge, +z away from it, as the spring's end runs): a top plate
     whose outer edge is an arc (AC, AR) from the front edge (z CZ) round to a corner, a straight edge to the end face (x CU), a ledge back from it, straight and then
     round (a circle of r 1.6 about LC) to the front edge; under the plate the body goes on down to the tongue's foot, but for the end at the front left, past x CG, which
     is the plate alone (CP thick); the tongue runs along the front at the foot (CT thick) to the end face, the ledge standing CW over it, with the notch (NX) the wedge
     pin goes through. On the plate the hub, slit to a relief hole in the plate (CH), and a groove from the arc toward the hub (its depth estimated). The spring's end is
     held against the end face by the clamp, a block slotted for the tongue and closed over the spring, drawn tight by the wedge pin, which bears on the notch's outer wall
     (Op. 4 ff.). Turned to the stud's direction (SPSI); the tongue's mid-height is the spring's end, HS_Y; drawn as one solid */
  const cg=hn(new THREE.Group(),'42190');cg.rotation.y=SPSI;R.collet=cg;R.staff.add(cg);
  { const k=CKC,CZ=-1.35*k,CU=3.72*k,CG=-2.49*k,CP=0.54*k,CT=0.5*k,CW=1.08*k,CHB=1.6*k,HO=1.17*k,HI=R.STAFF.rS+0.02,AC=[1.21*k,-0.42*k],AR=5.33*k,LC=[1.79*k,-2.19*k],LR=1.6*k,NX=[1.87*k,2.78*k],CH=[-2.18*k,2.22*k,0.3*k],GA=164*D2R,   /* HI: the staff's */
      y0=HS_Y-CT/2-CW,arc=(c,r,a0,a1,n)=>[...Array(n+1)].map((_,i)=>{const a=(a0+(a1-a0)*i/n)*D2R;return[c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)];}),
      LA=arc(LC,LR,97.4,148.4,16),E=LA[0],C=[CU,0.08*k],D=[CU,-0.32*k],zl=x=>E[1]+(x-E[0])*(D[1]-E[1])/(CU-E[0]),ledge=[C,D,...LA],   /* the ledge: from the end face straight to E, tangent there to the round part (7.2 and 7.4 deg), which meets the front edge */
      B=[AC[0]+AR*Math.cos(136.7*D2R),AC[1]+AR*Math.sin(136.7*D2R)],out=[...arc(AC,AR,190.05,136.7,28),...ledge],g=[Math.cos(GA),Math.sin(GA)],gn=[-g[1],g[0]],
      gE=o=>{const px=o*gn[0]-AC[0],pz=o*gn[1]-AC[1],b=px*g[0]+pz*g[1],t=-b+Math.sqrt(b*b-(px*px+pz*pz-AR*AR));return[o*gn[0]+t*g[0],o*gn[1]+t*g[1]];},gI=o=>[o*gn[0]+1.1*k*g[0],o*gn[1]+1.1*k*g[1]],
      ga=q=>Math.atan2(q[1]-AC[1],q[0]-AC[0])/D2R,gw=0.07*k,go=ga(gE(gw))>ga(gE(-gw))?[gw,-gw]:[-gw,gw],
      top=[...arc(AC,AR,190.05,ga(gE(go[0])),22),gE(go[0]),gI(go[0]),gI(go[1]),gE(go[1]),...arc(AC,AR,ga(gE(go[1])),136.7,6),...ledge],   /* the groove, 0.14 wide at the drawing's scale (the drawn notch in the arc), into the hub's foot */
      al=Math.atan2(CH[1],CH[0]),dH=Math.hypot(CH[0],CH[1]),hw=0.05,db=Math.asin(hw/HI),dh=Math.asin(hw/CH[2]),key=[];   /* the slit, 0.1 wide, from the bore to the relief hole */
    for(let k=0;k<=24;k++){const a=al+db+(TAU-2*db)*k/24;key.push([HI*Math.cos(a),HI*Math.sin(a)]);}
    for(let k=0;k<=16;k++){const a=al+Math.PI+dh+(TAU-2*dh)*k/16;key.push([CH[0]+CH[2]*Math.cos(a),CH[1]+CH[2]*Math.sin(a)]);}
    const kh={pts:key},hub=[],ob=Math.asin(hw/HO),T=(gm,y)=>[gm,new THREE.Matrix4().makeTranslation(0,y,0)];
    for(let k=0;k<=32;k++){const a=al+ob+(TAU-2*ob)*k/32;hub.push([HO*Math.cos(a),HO*Math.sin(a)]);}for(let k=0;k<=16;k++){const a=al+TAU-db-(TAU-2*db)*k/16;hub.push([HI*Math.cos(a),HI*Math.sin(a)]);}
    const low=[[CG,CZ],B,...ledge],tl=[[NX[0],CZ],[NX[0],zl(NX[0])],...LA],tr=[[NX[1],CZ],[CU,CZ],D,[NX[1],zl(NX[1])]];   /* the body behind the step (CG), its hidden side taken back to the corner B; the tongue either side of the notch, which runs back to the ledge */
    mesh(cg,mergeGeo([T(polyGeo(hub,CHB),y0-CHB),T(polyGeo(top,0.15,[kh]),y0),T(polyGeo(out,CP-0.15,[kh]),y0+0.15),T(polyGeo(low,HS_Y+CT/2-y0-CP,[kh]),y0+CP),
      T(polyGeo(tl,CT),HS_Y-CT/2),T(polyGeo(tr,CT),HS_Y-CT/2)]),M.steel);
    /* clamp (at the drawing's scale, then by k): jaws 0.45 thick over and under the tongue (0.02 clear), the back closing the slot 0.34 past the end face (the spring's wire),
       0.3 thick; 2.4 long, its front 0.07 proud of the tongue's, 0.08 off the ledge. Wedge pin (r 0.18) through both jaws and the notch, against its outer wall, 0.35 proud of the upper jaw */
    const K0=1.96*k,K1=CU+0.34+0.3*k,KZ=[CZ-0.07*k,-0.62*k],PR=0.18*k,PX=NX[1]-PR,PZ=-1.02*k,JT=0.45*k,jw=[[K0,KZ[0]],[K1,KZ[0]],[K1,KZ[1]],[K0,KZ[1]]],sl=CT/2+0.02;
    hn(mesh(cg,mergeGeo([T(polyGeo(jw,JT,[[PX,PZ,PR+0.02]]),HS_Y-sl-JT),T(polyGeo(jw,JT,[[PX,PZ,PR+0.02]]),HS_Y+sl),T(polyGeo([[CU+0.34,KZ[0]],[K1,KZ[0]],[K1,KZ[1]],[CU+0.34,KZ[1]]],2*sl),HS_Y-sl)]),M.steel),'42191.col');
    hn(cylBetween(cg,PR,HS_Y-sl-JT-0.35*k,HS_Y+sl+JT+0.05,M.steelD,PX,PZ,12),'42147.col'); }
  const BR=BAL_R,BY=BAL_Y;R.balU=hn(new THREE.Group(),'42178');R.balU.position.y=BY;R.staff.add(R.balU);
  /* the rim (Fig. 3: a band): 3.5 mm high (the restoration video: the screws' heads 0.9 of it, side-on; Fig. 3 draws it taller) and 0.6 mm thick, as the video shows it edge-on
     (KLUwI2UUCMQ 6:47.5, 6:52.5, 6:49.5-6:51.2: 0.5-0.85 mm against the rim's 29 mm and the impulse roller's 0.249 in, which agree on the scale to 1 %); its plate-side edge where
     the escape upper bridge's screws leave it, its holes' row at its mid-height (RY, in the balance's frame, + toward the plate). Drawn so, with the parts list's masses
     read as a matched pair's (PM, below), it makes about 534 g·mm² against the 578 Table II's screw changes give: I_REST (below) holds the 8 % between */
  const RH=BAL_RH,RW=0.6,RY=1.2-RH/2;mesh(R.balU,ring(BR,BR-RW,RH),M.steel,0,RY,0);
  /* the arm on the hub (Fig. 4): the hub (42186, on the staff) has a flange under the arm and a boss up through the arm's clearance hole; the cap (42248) over the arm
     and two hold-down screws (42249) through cap and arm into the flange. The arm is widened round the hub. Its width, 1.9 (AW), is the restoration video's: KLUwI2UUCMQ 6:52.5, face-on,
     82 px between its edges along its clean outer half at the rim's 43 px/mm (±0.15 with the tilt); small holes along its middle there are not drawn. Its thickness (1.1; edge-on, 6:50.0, it can't
     be told from the hub's flange) and the widening round the hub (hidden under the hairspring on every frame) are estimated */
  /* AY: the arm's cock-side face, its plate-side face flush with the rim's plate-side edge (RY + RH/2): side-on from a little below at KLUwI2UUCMQ 6:50.0 the arm's underside
     runs level with the rim's lower edge (±0.3 mm) to its end at the timing weight, the hub's disc standing below it, as Hamilton's US 2,356,911 (Fig. III) sets the crossbar's end
     in a step at the rim's lower edge; 0.65 inside it, estimated, until 4 October 2026. The hub, its cap and screws go with it */
  const AY=RY+RH/2-1.1,AW=1.9,HD=[[2.15,0],[-2.15,0]],xa=Math.sqrt(2.2**2-(AW/2)**2),a0=Math.atan2(AW/2,xa),arc=(s,e)=>[...Array(25)].map((_,i)=>[2.2*Math.cos(s+(e-s)*i/24),2.2*Math.sin(s+(e-s)*i/24)]);   /* the bar across, joined to the 2.2 circle round the hub on both sides (subtractCircle keeps one run: it drew half the arm) */
  mesh(R.balU,polyGeo([[BR-0.5,-AW/2],[BR-0.5,AW/2],...arc(a0,Math.PI-a0),[-(BR-0.5),AW/2],[-(BR-0.5),-AW/2],...arc(Math.PI+a0,TAU-a0)],1.1,[[0,0,1.2],...HD.map(q=>hC(...q,0.4))]),M.invar,0,AY,0);
  hn(mesh(R.balU,discGeo(3.5,0.6,[[0,0,R.STAFF.rH],...HD.map(q=>hT(...q,0.4))]),M.brass,0,AY+1.1,0),'42186',{sub:1});   /* the hub's flange: brass, 7.0 mm across (KLUwI2UUCMQ 34:12, 1,125 px against the impulse roller's 1,012 for its 0.249 in; a hold-down screw's hole in its face 1.3-2.3 mm out, where HD has them); a steel disc r 2.2, estimated, until 5 October 2026. Side-on at 6:50.0 the arm hides part of it (it read 5.2 there) */hn(mesh(R.balU,ringGeo(1.1,R.STAFF.rH,2.05),M.steel,0,AY+0.675,0),'42186',{sub:1});   /* the hub's flange and boss, bored for the staff (as the flange is) */
  { const y0=AY+1.7,y1=EY-0.07-0.65-BY;hn(mesh(R.balU,ringGeo(1.62,R.STAFF.rH,y1-y0),M.brass,0,(y0+y1)/2,0),'42186',{sub:1}); }   /* the hub's brass sleeve on the staff, from its flange up to the impulse roller's face: KLUwI2UUCMQ 34:12 (the balance lying, rollers up, 4K), 518 px across against the roller's 1,012 (its 0.249 in), 3.24 mm; it runs the whole way from the flange to the roller there, as the model's gap does (4.8 mm). The bare staff was drawn there until 5 October 2026 */
  hn(mesh(R.balU,polyGeo([...Array(64)].map((_,i)=>[3.0*Math.cos(i/64*TAU),3.0*Math.sin(i/64*TAU)]),0.35,[[0,0,1.15],...HD.map(q=>hC(...q,0.4))]),M.steel,0,AY-0.35,0),'42248');
  for(const q of HD)hn(screw(R.balU,...q,AY-0.35,0.4,0.25,0.35+1.1+0.5),'42249').userData.lift=0;   /* they stay in: the hub's flange under them is on the staff, which goes with the balance */
  /* the rim's tapped holes, "uniformly spaced ... around the entire circumference" (Sec. II): 24 places 15 deg apart, numbered 1-13 round each half from an arm's end, as the
     numbered balance block (Tool 54, Fig. 99) and Table IV (p. 74) number them. Hole 1 is the arm's end (the timing weight's screw), 7 the quarter (Table IV's moves are
     symmetric about it: 3 to 4 as 11 to 10), 13 the other arm's end; 2 takes the vernier weight, 3-12 the balance screws. Both halves are numbered the same way round,
     counterclockwise seen from the cock, so hole n of one is diametric to hole n of the other (KLUwI2UUCMQ 6:47.5, 6:52.5: the rim fitted as an ellipse, every hole and screw
     within 1.5 deg of a 15 deg place). HA(h,n): hole n's angle on half h (0 from the arm's end at 0, 1 from π). The empty ones are one merged mesh, rebuilt by R.screws */
  const HA=(h,n)=>h*Math.PI+(n-1)*TAU/24;R.holeA=HA;R.HOLES=[3,4,5,6,7,8,9,10,11,12];
  const holeG=new THREE.Group();R.balU.add(holeG);let holeM=null;
  const holesSet=used=>{const hs=[];for(const h of[0,1])for(const n of R.HOLES){if(used.has(n))continue;const a=HA(h,n);hs.push([cylY(0.28,0.2,8),new THREE.Matrix4().compose(new THREE.Vector3((BR+0.05)*Math.cos(a),RY,(BR+0.05)*Math.sin(a)),new THREE.Quaternion().setFromEuler(new THREE.Euler(0,-a,Math.PI/2)),new THREE.Vector3(1,1,1))]);}
    holeG.visible=hs.length>0;if(!hs.length)return;const g=mergeGeo(hs);if(holeM){holeM.geometry.dispose();holeM.geometry=g;}else holeM=mesh(holeG,g,M.steelD);};   /* a group of their own: look() shows every mesh */
  const radial=(a,r0,len,rr,mat,seg=12,bore=0,p=R.balU)=>{const q=mesh(p,bore?ringGeo(rr,bore,len):cylY(rr,len,seg),mat,(r0+len/2)*Math.cos(a),RY,(r0+len/2)*Math.sin(a));q.rotation.set(0,-a,Math.PI/2);return q;};   /* bore: a nut's thread */
  /* 2 timing weights (93 mg) and 2 vernier timing weights (10.5 mg), each a nut on a screw (Fig. 3): the timing weights outside the rim at the arm's ends (hole 1), their
     screws through the rim into the arm; the verniers inside the rim one hole on (hole 2), their screws' heads outside (KLUwI2UUCMQ 6:47.5, 6:53.0: a large slotted steel nut
     at each arm's end, a small plain one inside the rim beside it). Drawn at mid-travel, where the manual starts them (p. 70): the timing nuts TG off the rim, so that the 2 turns either
     way the rate panel allows (0.174 mm a turn) bring them to the rim turned in and to 17.5 mm from the staff turned out, 0.1 inside the barrel bridge's cut round the balance (r 17.6 on
     the top-view photograph): with the nuts as measured there is no room for more; the verniers, inside the rim, have 3 turns either way. W: the weights, d0 their centres' distance from the staff at mid-travel. The timing nut 2.1 across and 2.3 long (TR, TWL): 6:52.5, face-on at
     the rim's 43 px/mm, one 95 px across and 2.55 mm long (its end face seen nearly edge-on, 0.21, so barely foreshortened), the other, blurred, 2.0 across and its body 2.1 long to a
     narrower collar at the rim: 2.3 ±0.25; a slit runs most of the first one's length (not drawn). The verniers' sizes
     are estimated (a steel nut so drawn weighs 11 mg, where the pair's 10.5 mg gives 5.25 each: PM), and so is the travel.
     PM: the parts list's masses (93 mg, 10.5 mg, the screws' and washers' below) are read as a matched pair's, half of it each: inferred, likely, not certain
     (README, "Estimated"). The list gives each line once with "2" or "4-6" beside it, and its screws, weights and washers are only ever changed in pairs (Tables II
     and III: "For Pairs"). Read as each one's, the timing nut as measured (2.1 across, 2.3 long, bored: 53 mg of steel, 63 solid) can't weigh 93 mg; the screws'
     heads as measured (2.9-3.2 across) would need a metal of density 12.6-14.3 (7.1-6.3 read as a pair's, against brass's 8.5); and the drawn balance makes 731 g·mm²
     against the 1,157 Table II's screw changes then need (37 % short). Read as a pair's, Table II needs 578 and the drawing makes 534 (8 %, inside the rim's
     measured 0.5-0.85 thickness and Table II's own spread: Table III's washers give 16 % less) */
  const W=[],VO=0.6,TWL=2.3,TR=1.05,TG=0.35,PM=0.5;
  for(const h of[0,1]){const at=HA(h,1),av=HA(h,2);
    W.push({kind:'t',a:at,len:TWL,rr:TR,mg:93*PM,d0:BR+TG+TWL/2,q:hn(radial(at,BR+TG,TWL,TR,M.steelD,12,0.42),'42176')});hn(radial(at,BR-0.6,0.6+2.7,0.4,M.steel,10),'42177');   /* the screw threaded through the rim, from its inner face (the arm's end lies below it, at the rim's plate-side edge, AY; the screw was drawn 1.5 inside, into the arm, until 4 October 2026) to 2.7 outside it: side-on at 6:50.0 the nut and its screw reach 3.3 from the rim's inner face (0.6 thick), r 17.2, inside the barrel bridge's cut (17.6); just past the nut at mid-travel, inside it at full travel out */
    W.push({kind:'v',a:av,len:1.5,rr:0.65,mg:10.5*PM,d0:BR-RW-VO-0.75,q:hn(radial(av,BR-RW-VO-1.5,1.5,0.65,M.steelD,12,0.27),'37115')});
    hn(radial(av,BR-RW-VO-1.5-0.65,VO+1.5+0.65+RW+0.5,0.25,M.steel,10),'42197');hn(radial(av,BR+0.5,1.2,0.535,M.steel,12),'42197',{sub:1});}   /* the vernier's screw from inside the nut's furthest travel in, through the rim to a stem 0.5 across and 0.5 outside it, then a head 1.07 across and 1.2 long (6:53.0: 22, 45, 51 px at 41.8 px/mm); the nut 1.27 across and 1.5 long (56 and 71 px). A 1.1 stem and a 0.84 x 0.5 collar, and a 1.3 nut, estimated, until 5 October 2026 */
  /* balance screws (pp. 82, 93): the parts list's 4-6 of 0.049 in head height (125-130 mg), 2 of 0.080 (200-205 mg) and 2 of 0.101 (250-255 mg), in diametric pairs. The
     standard set is the restoration video's: four pairs, in holes 3, 5, 9 and 12 of each half (KLUwI2UUCMQ 6:47.5, 6:52.5; the longest heads in 9, about 2.6 mm side-on at
     6:50.0-6:51.0; which of 3, 5 and 12 has the 0.080 in heads is estimated). The heads 3.1 across, as the video measures them face-on (2.9-3.2 at 6:52.5);
     their masses the parts list's for a pair (PM, above): read so, a little lighter than brass solid at that size, where read as each one's they would need gold. Neighbouring holes can both hold screws (0.8 mm between heads; a second Model 21,
     References/photo-oblique-balance-side.jpg, has two side by side). Every hole 3-12 of both halves has a screw built in a group of its own, hidden but where a pair stands
     (R.screws), its thread in the rim's tapped hole and a washer under its head shown with it (r 1.25, estimated) */
  const BSZ={'0.040':[0.039,102.5,'42271'],'0.050':[0.049,127.5,'42171'],'0.060':[0.060,152.5,'42172'],'0.080':[0.080,202.5,'42173'],'0.100':[0.101,252.5,'42174']};
  const BWA={'0.002':[0.002,4.5,'42181'],'0.003':[0.003,6.5,'42182'],'0.004':[0.004,8.5,'42183'],'0.006':[0.006,12.5,'42184'],'0.008':[0.008,16.5,'42185'],'0.010':[0.010,20.5,'42256']};
  /* each screw's shank through the rim, ending in a point 1.3 mm inside it (the video's brass tips inside the rim, 6:47.5, 6:52.5-6:53.5; their length and taper estimated): one turned
     solid, run to the axis at both ends, its point toward the staff (radial()'s local +y) */
  const SHR=1.55,SL={},TL=RW+1.3,TIP=new THREE.LatheGeometry([[0,-TL/2],[0.35,-TL/2],[0.35,TL/2-1.1],[0,TL/2]].map(([x,y])=>new THREE.Vector2(x,y)),12);R.BSZ=BSZ;R.BWA=BWA;
  for(const h of[0,1])for(const n of R.HOLES){const a=HA(h,n),g=new THREE.Group();g.visible=false;R.balU.add(g);const wg=new THREE.Group();wg.visible=false;g.add(wg);
    const th=radial(a,BR-TL,TL,0.35,M.brass,12,0,g);th.geometry.dispose();th.geometry=TIP;
    SL[h*100+n]={a,g,wg,len:1,q:radial(a,BR,1,SHR,M.brass,24,0,g),th,wm:hn(radial(a,BR,1,1.25,M.steel,24,0.37,wg),'42181')};}
  /* moment of inertia of the uncut balance about the staff, in g·mm²: steel rim, hub and cap (7.9 mg/mm³), Invar arm (8.1), and the screws and weights at their
     parts-list masses (a pair's, PM), each spread along its drawn cylinder, plus I_REST. The rim's holes, the weights' screws and the staff are left out. The drawn
     balance makes about 534; Table II's ten screw changes (p. 70, for pairs: 0.100 to 0.080 in, 16 minutes a day … 0.050 to 0.040, 7), fitted by least squares
     with the same masses, need 578 (I_T2, below; each change within 2.6 minutes of the table's), so I_REST, the 44 between (8 %), is added with the standard screws,
     and the rate a change makes is the manual's (Review-results.md, "The balance's moment of inertia") */
  const I_FIX=(7.9*Math.PI*RH*(BR**4-(BR-RW)**4)/2+8.1*(2*BR-1)*1.1*2.4*((2*BR-1)**2+2.4**2)/12+7.9*Math.PI*(0.6*2.2**4+2.05*1.1**4+0.35*(2.2**4-1.15**4))/2)/1000;   /* rim, arm, and the hub's flange and boss and the cap (steel) */
  const BS=[],mI=(mg,d,len,rr)=>mg*(d*d+len*len/12+rr*rr/4)/1000;let I_REST=0;
  const inertia=(xt,xv)=>{let I=I_FIX+I_REST;for(const w of W)I+=mI(w.mg,w.d0+(w.kind==='t'?xt:xv),w.len,w.rr);for(const w of BS)I+=mI(w.mg,BR+w.off+w.len/2,w.len,w.rr)+w.wmg*(BR+w.off/2)**2/1000;return I;};   /* wmg: a washer under a screw's head */
  /* R.screws(pairs): the balance screws, a pair a list entry {n: its hole, 3-12; h: head height, a key of BSZ; w: washer under each head, a key of BWA or 0}, null for a pair
     taken out (Op. 3; Tables II-IV on pp. 70, 74; the parts list's screws and washers, pp. 93, 99). R.screwStd is the standard set, R.pairs the list as last set; R.timing
     then returns the moment with them. The heights are Table II's: the parts list's 0.121 in screw would reach the barrel bridge's cut round the balance (17.7 mm) */
  R.screwStd=[{n:3,h:'0.080',w:0},{n:5,h:'0.050',w:0},{n:9,h:'0.100',w:0},{n:12,h:'0.050',w:0}];
  R.screws=pairs=>{BS.length=0;for(const s of Object.values(SL))s.g.visible=false;const used=new Set();
    for(const p of pairs){if(!p||used.has(p.n)||!BSZ[p.h]||!R.HOLES.includes(p.n))continue;used.add(p.n);const[hin,mg,id]=BSZ[p.h],[tin,wmg,wid]=p.w&&BWA[p.w]?BWA[p.w]:[0,0,null],t=tin*25.4,len=hin*25.4;
      for(const h of[0,1]){const s=SL[h*100+p.n];s.g.visible=true;if(s.len!==len){s.q.geometry.dispose();s.q.geometry=cylY(SHR,len,24);s.len=len;}hn(s.q,id);hn(s.th,id,{sub:1});
        const d=BR+t+len/2;s.q.position.set(d*Math.cos(s.a),RY,d*Math.sin(s.a));s.wg.visible=!!t;if(t){s.wm.scale.set(1,t,1);s.wm.position.set((BR+t/2)*Math.cos(s.a),RY,(BR+t/2)*Math.sin(s.a));hn(s.wm,wid);}
        BS.push({len,rr:SHR,mg:mg*PM,off:t,wmg:wmg*PM});}}
    R.pairs=pairs.map(p=>p&&{...p});holesSet(used);};
  const T2=/** @type {[string,string,number][]} */([['0.100','0.080',16],['0.100','0.060',34],['0.100','0.050',43],['0.100','0.040',50],['0.080','0.060',16],['0.080','0.050',25],['0.080','0.040',34],['0.060','0.050',6],['0.060','0.040',13],['0.050','0.040',7]]),
    sI=h=>{const[hin,mg]=BSZ[h],len=hin*25.4;return mI(mg*PM,BR+len/2,len,SHR);},dI2=T2.map(([a,b,m])=>[2*(sI(a)-sI(b)),m]),
    I_T2=720*dI2.reduce((q,[d])=>q+d*d,0)/dI2.reduce((q,[d,m])=>q+d*m,0);   /* minutes a day = 1440·ΔI/(2I): the I that fits Table II best */
  R.screws(R.screwStd);I_REST=I_T2-inertia(0,0);R.I_REST=I_REST;R.I_T2=I_T2;
  /* the weights' thread pitch, set so that a full turn of a pair changes the rate by the manual's figures, about 40 s a day for the timing weights and 2.8 s
     for the verniers (p. 70). The period goes as √I, so moving a pair x mm out loses 86400·(dI/dx)·x/(2I) s a day */
  const I0=inertia(0,0),dIdx=k=>W.reduce((s,w)=>s+(w.kind===k?2*w.mg*w.d0/1000:0),0);
  R.pitch={t:40*2*I0/86400/dIdx('t'),v:2.8*2*I0/86400/dIdx('v')};
  /* timing(nt,nv): turns both timing weights nt turns out and both verniers nv (negative: in), so the balance stays in poise, and returns the new moment */
  R.timing=(nt,nv)=>{const xt=nt*R.pitch.t,xv=nv*R.pitch.v;for(const w of W){const d=w.d0+(w.kind==='t'?xt:xv);w.q.position.set(d*Math.cos(w.a),RY,d*Math.sin(w.a));}return inertia(xt,xv);};
  /* Table IV (p. 74): the change in the temperature compensation, in s a day between 55 and 90 F (Op. 8), for one pair moved from the quarter (hole 7) to hole 8-12, under
     head heights 0.120 ... 0.040 in (0.090 and 0.070: a screw and a washer). Every other move in the table is the difference of two of these, holes 3-6 mirroring 11-8
     (invariants.py checks it). Each column fitted to all its 30 rows by least squares: the 0.040-0.100 in columns agree to 0.005 s, the 0.090 and 0.120 to 0.04 (their
     7 to 9 rows, printed 0.96 and 1.26, disagree with the four other rows through hole 9; 7 to 10 under 0.090, printed 2.95, is a misprint for 2.05). R.T4(hh, n): the
     figure for a pair at hole n against hole 7, hh its head's height and washer in inches, between the columns linearly */
  const T4H=[0.120,0.100,0.090,0.080,0.070,0.060,0.050,0.040],T4={8:[0.31,0.26,0.24,0.22,0.21,0.19,0.16,0.13],9:[1.22,1.01,0.94,0.87,0.80,0.74,0.62,0.51],10:[2.65,2.20,2.06,1.90,1.76,1.61,1.35,1.11],
    11:[4.51,3.75,3.51,3.25,3.00,2.75,2.30,1.90],12:[6.20,5.16,4.61,4.04,3.66,3.28,2.62,2.02]};
  R.T4=(hh,n)=>{n=n<7?14-n:n;if(n===7)return 0;const r=T4[n];if(!r)return null;let i=0;while(i<T4H.length-2&&hh<T4H[i+1])i++;return r[i]+(r[i+1]-r[i])*(hh-T4H[i])/(T4H[i+1]-T4H[i]);};
  R.balS=new THREE.Group();R.balS.position.y=BY;R.balS.visible=false;R.staff.add(R.balS);
  mesh(R.balS,polyGeo([[BR-0.5,-1.1],[BR-0.5,1.1],[-(BR-0.5),1.1],[-(BR-0.5),-1.1]],1.4,[[0,0,0.45]]),M.steel,0,-0.7,0);mesh(R.balS,ringGeo(2.2,0.45,2.2),M.steel);   /* arm and hub, bored for the staff (a press fit, as the uncut balance's hub) */
  /* d: the rim curled in by d (1 - cos) at the angle from its fixed end, a curvature change (R.balCurl) */
  const span=160*D2R,band=(a0,r0,r1,d=0)=>{const s=new THREE.Shape(),N=48,rr=(r,i)=>r-d*(1-Math.cos(span*i/N));for(let i=0;i<=N;i++){const a=a0+span*i/N,r=rr(r1,i);i?s.lineTo(r*Math.cos(a),r*Math.sin(a)):s.moveTo(r*Math.cos(a),r*Math.sin(a));}
    for(let i=N;i>=0;i--){const a=a0+span*i/N,r=rr(r0,i);s.lineTo(r*Math.cos(a),r*Math.sin(a));}const g=extrude(s,{depth:2.4,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,-1.2,0);return g;};
  const balSR=[];
  for(let k=0;k<2;k++){const a0=k*Math.PI,st=mesh(R.balS,band(a0,BR-1.6,BR-0.9),M.steel),br=mesh(R.balS,band(a0,BR-0.9,BR),M.brass);
    const wa=a0+span*0.62,w=mesh(R.balS,cylY(1.1,2.4,24),M.brass2,(BR+1.1)*Math.cos(wa),0,-(BR+1.1)*Math.sin(wa));w.rotation.set(0,wa,Math.PI/2);balSR.push({a0,st,br,w,wa});}   /* compensation weights within the band's 2.4 mm height and out to 16.8 mm, inside the timing weights' path: they pass the escape upper bridge's screws and the barrel bridge's cut round the balance (17.7) as the uncut rim's do */
  /* the split rim's curl with temperature (2.3 in IDEAS.md): brass outside steel, the brass expanding more, so the free ends curl in with heat and out with cold, taking the
     weights with them. A bimetal strip of two equal layers changes its curvature by 1.5 Δα ΔT / h (Timoshenko): brass 19, steel 11.5 × 10⁻⁶ a °C, the rim 1.6 mm thick, about
     3.9 × 10⁻⁶ /mm a °F; a point φ from the fixed end then comes in by R² Δκ (1 - cos φ), 0.05 mm at the free end for 27½ °F. dF: °F from 72½, x: the exaggeration it is drawn with */
  R.CURLX=20;R.balCurl=(dF,x=R.CURLX)=>{const d=BR*BR*1.5*(19e-6-11.5e-6)/1.8/1.6*dF*x;if(Math.abs(d-(R.balSD||0))<1e-4)return;R.balSD=d;
    for(const q of balSR){q.st.geometry.dispose();q.br.geometry.dispose();q.st.geometry=band(q.a0,BR-1.6,BR-0.9,d);q.br.geometry=band(q.a0,BR-0.9,BR,d);const r=BR+1.1-d*(1-Math.cos(q.wa-q.a0));q.w.position.x=r*Math.cos(q.wa);q.w.position.z=-r*Math.sin(q.wa);}};
  /* helical hairspring (Fig. 2): its coils r 5.1 (HS_RC; 5.27 to their outer edge) and 12 turns (HS_N; 13 wires down each side with the end curves), 6.7 tall (HS_H). The radius is the coils' outer edge against the balance
     rim (r 14.5) on five sources, each a ratio in one picture: the restoration video side-on (KLUwI2UUCMQ 6:49.5: the coils 257.5 px across about the staff, x 648.75; the rim's
     back edge turns at x 998-1003, behind the timing weight's root, so 351 px out; the left end is under the glove), 0.367, r 5.3; face-on (6:52.5: the coils 310 px, the rim
     835, both ends of the coils within a few % of each other), 0.355-0.371, r 5.2-5.4; the top-view photograph (2E11795), about 0.35, r 5.0; the manual's Fig. 2 (600 dpi: the
     rim's top edge an ellipse 1012.7 px across, 1 % rms, the pillar plate's 87.57 mm, about 3090 px, agreeing on the scale; the coils 323-340 px), 0.32-0.34, r 4.7-4.9; the
     oblique photograph, roughly 0.40, r 5.8. Their median, 0.363, 5.26 to the outer edge. Until 4 October 2026 r 6.3, read side-on against the rim "between its ends", whose
     left end the glove hides (Review-results.md, 25). The turns: side-on (6:49.5) 13 wires down each side, 14.5 px apart (the stack's autocorrelation 14.5-15 px), Fig. 5 and
     the oblique photograph 13-15; until 4 October 2026 9 turns, from wires counted 26 px apart, every second one. The heights, side-on (6:49.5) at
     24.2 px/mm by the rim, the camera 5.7 deg above the rim's plane (its top edge's front and back 70 px apart), read at the staff's depth: the top wire 5.8 above the rim's top
     edge (the model 5.9, set by the stud), the coils seen down to the rim's front edge, 1.4 below it, and running on behind it, so 7.15 or more tall; Fig. 2 (41 deg) puts their
     lower end about 2.1 below the rim's top. Until 4 October 2026 the spring started level with the rim's top and stood 5.9. It now starts 1.1 below, as low as the hub's
     estimated boss, cap and screws let the collet go, and stands 6.7: still 0.5 or more short, which says the hub stands too high (Review-results.md, 25) */
  /* with the balance in the Exploded view: the collet's clamp closes over the spring's end above and below (Fig. 6), so the two come off together, as the
     balance and hairspring assembly does with its stud (Sec. II) */
  const spg=part('spr',-80,true),sg=new THREE.Group();sg.rotation.y=SPSI;spg.add(sg);R.spring=hn(mesh(sg,new THREE.BufferGeometry(),M.steel,0,HS_Y,0),'42188');R.spring.rotation.x=Math.PI;
  /* the hairspring as designed (HSPR, shared/hairspring.js; README "The hairspring, designed"): its coil (HS_RC, HS_N, HS_H) and two terminal curves solved to Phillips'
     conditions, so that its pull on the balance is a pure couple, with no force on the pivots: the outer from the coil to where the stud's clamp takes it, at the clamp's
     step (SPin(SP_ST)), running along the bar toward its end (-SPu), and on into the clamp to 0.2 short of the bar's end; the inner from the coil to where it leaves the
     collet's clamp (HS_RI, along the collet's end face), and HS_LEAD on straight into the clamp. Each is solved from the first guess below (tools/hairspring.js: the
     shortest curve that keeps off the collet) and searched afresh if that fails. A strip HS_B along the axis (the video side-on, 6:49.5: 0.20-0.28) by HS_T across (the
     stiffness Table II's balance needs, k = E b t³ / 12 L over its free length, Elinvar at 180 GPa; invariants.py checks it), rising evenly along its length from the
     collet's tongue (HS_Y) to the stud (HS_H). R.spPath(th): its centreline in the spring's frame (x toward SPD2, y up the axis, z the other way round from the
     coil's sense) with the collet's end turned th and the stud's held, the turn shared along the free length */
  const HSD=(()=>{const loc=w=>[w[0]*SPD2[0]+w[1]*SPD2[1],SPD2[0]*w[1]-SPD2[1]*w[0]],rel=q=>[q[0]-L.B[0],q[1]-L.B[1]],B=loc(rel(SPin(SP_ST))),ub=loc([-SPu[0],-SPu[1]]),
      sol=(sig,P,h,v0,ri)=>{const r=HSPR.solve(HS_RC,sig,P,h,v0);return r&&r.res<1e-7?r:HSPR.design(HS_RC,sig,P,h,ri);},
      outer=sol(1,B,Math.atan2(ub[1],ub[0]),[-3.22518,14.82449,0.14548,-0.040912,0.0025914],1.2),inner=sol(-1,[HS_RI,0],-Math.PI/2,[5.37254,21.7728,-0.0079096,0.0006175,-2.408e-5],HS_RI-0.06);
    if(!outer||!inner)throw Error('hairspring: no terminal curve meets Phillips\' conditions');
    const P=HSPR.path(HS_RC,inner,outer,HS_N),Ee=loc(rel(SPin(SP_E-0.2))),q0=P.pts[P.pts.length-1],raw=[[HS_RI,-HS_LEAD,-HS_LEAD],...P.pts,[Ee[0],Ee[1],P.L+Math.hypot(Ee[0]-q0[0],Ee[1]-q0[1])]];
    const S0=-HS_LEAD,S1=raw[raw.length-1][2],n=Math.ceil((S1-S0)/0.3),pts=[];let j=0;
    for(let i=0;i<=n;i++){const sx=S0+(S1-S0)*i/n;while(j<raw.length-2&&raw[j+1][2]<sx)j++;const a=raw[j],b=raw[j+1],f=b[2]>a[2]?(sx-a[2])/(b[2]-a[2]):0;pts.push([a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,sx]);}
    return{outer,inner,L:P.L,turns:P.turns,pts,lat:HSPR.lateral(P.pts,HS_RC).ratio};})();
  R.hsDesign=HSD;HSD.b=HS_B;HSD.t=HS_T;HSD.rIn=HS_RI;
  R.spPath=th=>HSD.pts.map(([x,v,sx])=>{const f=Math.min(1,Math.max(0,sx/HSD.L)),a=th*(1-f),c=Math.cos(a),sn=Math.sin(a);return[x*c-v*sn,HS_H*f,-(x*sn+v*c)];});
  /* hairspring stud (Figs. 5, 19, 84, 85): a flat bar under the cock along the row of its holes (SPHc, SPHb, SPHa, above), held by the stud screw from the cock's top and two steady
     pins, and at its inner end, past the inner pin, the clamp holding the spring's upper end by a wedge pin, as the collet does (Fig. 5; patent US 2,379,780, Figs. 10, 11).
     Measured on KLUwI2UUCMQ 6:47.5 and 6:47.75 (above): the bar runs from SP_E inside the inner pin to 0.8 past the outer one; the clamp is a block under its end, from SP_E to
     SP_ST, about 1.3 times the bar's width there (43 px against its 33 on both frames; drawn centred, the side it stands out to unread), and the wedge pin's end shows in the bar's top
     face over it, SP_CL in and 0.4 off the bar's middle line (13-14 px of the frame), the spring's end beside it. The block's drop (0.7) is the spring's measured height, HS_H, to its
     middle; the frames read 0.9-1.3 with the tilt unknown. Side-on (6:50.0) the bar runs from over the coils out past them, a pin standing up from it at each end. Its width (1.6) and
     thickness (0.5) are estimated. loc: a point of the movement's plan in the stud's frame */
  { const st=hn(new THREE.Group(),'42189');st.rotation.y=SPSI;spg.add(st);const yb=CK_T+2.6,tw=SPSI+BETA,loc=p=>{const d=[p[0]-L.B[0],p[1]-L.B[1]];return[d[0]*Math.cos(tw)-d[1]*Math.sin(tw),d[0]*Math.sin(tw)+d[1]*Math.cos(tw)];};
    const e0=SPin(SP_E),e1=[SPHa[0]+0.8*SPu[0],SPHa[1]+0.8*SPu[1]],q=[-SPu[1]*0.8,SPu[0]*0.8],ux=loc([L.B[0]+SPu[0],L.B[1]+SPu[1]]),un=[-ux[1],ux[0]],cb=loc(SPin((SP_E+SP_ST)/2)),wp=loc(SPCL);
    const pw=[wp[0]+0.4*un[0]*Math.sign(un[1]||1),wp[1]+0.4*un[1]*Math.sign(un[1]||1)];   /* the wedge pin 0.4 across from the spring's end, to the side the model had it */
    mesh(st,polyGeo([[e0[0]-q[0],e0[1]-q[1]],[e1[0]-q[0],e1[1]-q[1]],[e1[0]+q[0],e1[1]+q[1]],[e0[0]+q[0],e0[1]+q[1]]].map(loc),SB_T,[hT(...loc(SPHb),0.6),[...loc(SPHa),0.3],[...loc(SPHc),0.3],[...pw,0.17]]),M.steel,0,yb,0);   /* tapped for the stud screw; the steady pins pressed through it; the wedge pin's hole */
    const cl=hn(mesh(st,new THREE.BoxGeometry(SP_E-SP_ST,CLD,2.0),M.steel,cb[0],yb+SB_T+CLD/2,cb[1]),'42191.st');cl.rotation.y=-Math.atan2(ux[1],ux[0]);
    hn(cylBetween(st,0.15,yb+0.02,yb+SB_T+CLD-0.03,M.steelD,...pw,10),'42147.st');for(const[h,y1]of[[SPHa,yb+SB_T+0.9],[SPHc,yb+SB_T]])cylBetween(st,0.295,yb-0.65,y1,M.steel,...loc(h),12); }   /* wedge pin from just under the bar's top face (its end shows there on the video, 6:47.5; Ops. 9, 10: "file pin below the top surface of the stud") down through the clamp, cut off inside its lower face (it stood 0.16 proud, into the coil under the clamp); the steady pins up into the cock 0.65, the outer one 0.9 below the bar too (r 0.295: inside the r 0.3 holes' facets): side-on at KLUwI2UUCMQ 6:50.0, both stand 26-29 px over the bar's top face and the outer 40 px under it, the inner none (the clamp's step), at 43 px/mm (the pins 297 px apart for their 6.6-7.0 mm); 0.8 and flush below, estimated, until 4 October 2026. The bar (SB_T) 0.85 thick, the middle of the 0.7-1.1 mm (31-46 px) it reads there (0.5, estimated, until 5 October 2026); the clamp under its end (CLD) drops 0.6 (27 px on the same frame), and the spring's end lies at the clamp's middle, so the spring rises HS_H 6.4 (the 12 turns' pitch 0.533, inside the 0.52-0.56 the coils read at 6:49.5 and 6:50.0; 6.7 before) */
  /* balance cock: massive bridge from a foot at the right-back (Fig. 2) over the balance */
  const ck=hn(part('cock',-96),'42066');
  /* balance cock traced on the top-view photograph: a broad crescent whose outer edge follows the plate rim (top-left
     in the photo), a straight edge to the endstone over the staff and a concave arc back to the rim. Outline shifted
     by the cock's parallax so the endstone sits over the balance staff. */
  const COCK_POLY=[[25.38, 31.05], [26.19, 30.36], [26.99, 29.66], [27.77, 28.93], [28.53, 28.18], [29.26, 27.42], [29.98, 26.63], [30.68, 25.82], [31.35, 25.0], [32.0, 24.16], [32.63, 23.3], [33.24, 22.43], [33.82, 21.54], [34.38, 20.63], [34.92, 19.71], [35.43, 18.78], [35.92, 17.83], [36.38, 16.87], [36.81, 15.9], [37.22, 14.92], [37.6, 13.93], [37.96, 12.92], [38.29, 11.91], [38.59, 10.89], [38.87, 9.86], [39.12, 8.83], [39.34, 7.79], [39.53, 6.74], [39.69, 5.69], [39.83, 4.63], [39.94, 3.58], [32.87, 3.03], [26.51, 2.76], [20.15, 2.49], [13.87, 2.62], [8.04, 2.86], [5.77, 3.99], [5.53, 5.72], [6.88, 7.11], [13.2, 9.07], [17.2, 11.96], [19.38, 16.1], [20.84, 20.82], [21.82, 25.22]].map(PTr);
  /* the balance upper setting and jewel are pressed into the cock under the endstone cap (manual Figs. 19, 36, 85), and the cap lies on the cock with metal all
     round it (top-view photograph). The traced edge passes 0.7 mm from the staff and left the cap and its outer screw over nothing: the tracing, taken at plate
     height and shifted for parallax, misses the nose. So the nose, from the straight edge's corner to the concave edge, is the hull round the cap, 0.9 mm clear of it */
  /* cap: 7.2 x 4.6 mm, its corners rounded r 1.2 at the nose's end and r 0.4 at the foot's (C Spinner's video, 5:51 and 42:03; the top-view photograph) */
  const EPo=[];for(const[cx,cz,r,a0]of[[2.4,1.1,1.2,0],[-3.2,1.9,0.4,90],[-3.2,-1.9,0.4,180],[2.4,-1.1,1.2,270]])for(let k=0;k<=8;k++){const a=(a0+90*k/8)*D2R;EPo.push([cx+r*Math.cos(a),cz+r*Math.sin(a)]);}
  /* one solid block, as it comes off the movement (C Spinner's restoration video, 41:58 and 23:45; the side at 2:36; References/VIDEOS.md): its outer wall follows
     the rim the full 14.2 mm down to the train bridge, its straight edge stands against the barrel bridge's horn, and only the nose is a 2.6 mm arm over the balance.
     The body is all of the outline more than CK_RP from the staff, the circle the barrel bridge is cut on round the balance; its face on that arc is the step under
     the arm. The screw's head lies in a counterbore (41:58, 6:29) */
  const CK_RP=BAL_R+3.2,CK_CB=1.5;
  /* the concave edge one smooth curve from the nose's round to the horn's tip, as at 41:58 and 6:29: a cubic tangent to the nose and to the traced edge at the horn,
     fitted to the traced points (within 0.43 mm); the tracing's corner where the widened nose met it is gone */
  const ckEdge=o=>{const k=o.indexOf(COCK_POLY[40]),P0=o[k-1],P3=o[0],P1=add(P0,unit(sub(P0,o[k-2])),21.17),P2=add(P3,unit(sub(P3,COCK_POLY[43])),-19.72),q=[];
    for(let i=1;i<24;i++){const u=i/24,v=1-u,w=[v*v*v,3*v*v*u,3*v*u*u,u*u*u];q.push([0,1].map(e=>w[0]*P0[e]+w[1]*P1[e]+w[2]*P2[e]+w[3]*P3[e]));}return[...o.slice(0,k),...q];};
  /* the arm's underside sweeps down into the body (41:58, 23:45): a cove from 9 mm round the staff, a quarter circle down to 7.6 mm under the top at the step (1 mm over
     the balance's top, 8.6 down; the hairspring keeps under the flat part, within 7.1 mm), the step's wall then going on down to the train bridge */
  R.cock=mesh(ck,stepGeo(ckEdge(hullSplice(COCK_POLY,34,40,[COCK_POLY[35],...stadiumPts(add(L.B,EPu,1.3),add(L.B,EPu,-3.0),5.2)])),L.B,CK_RP,2.6,TB_T-CK_T,[[...L.B,1.5],[...hC(...S.cock,2.8,0.8).slice(0,3),2.95,CK_CB],...S.ep.map(q=>hT(...q,0.7).slice(0,3)),[...hC(...SPS,0.6).slice(0,3),0.65,0.45],[...SPHa,0.3],[...SPHc,0.3]]),M.plate,0,CK_T,0);   /* no cove: the arm flat underneath out to the body's wall (KLUwI2UUCMQ 44:02, the cock in place seen from its straight edge: the arm's underside meets the body in a square step, the space under it open from the barrel bridge's horn, r 16.4, to the body's wall, 18.6; 23:45, the cock on its side: flat faces) */   /* last: the stud screw's hole, counterbored for its head (wider than the pins' at 41:58; its size estimated), and its steady pins' */
  /* setting: flush with the cock's top, standing 0.3 below it; the olive-hole jewel near its top, the pivot just under the endstone */
  hn(mesh(ck,new THREE.LatheGeometry([V2(0.95,CK_T),V2(1.5,CK_T),V2(1.5,CK_T+2.9),V2(0.7,CK_T+2.9),V2(0.7,CK_T+0.95),V2(0.95,CK_T+0.95),V2(0.95,CK_T)],40),M.gilt,...[L.B[0],0,L.B[1]]),'42162.bu');   /* gilt: KLUwI2UUCMQ 41:58, the cap off */
  hn(mesh(ck,stoneGeo(0.95,0.19,0.6,'olive'),M.ruby,L.B[0],CK_T+0.3,L.B[1]),'J.bu');   /* flush with the cock's top, under the endstone; its hole r 0.19, 0.01 round the pivot's measured r 0.18 (the staff's comment): the hole's size an estimate */
  /* its two steady pins ("complete with pins", 42066), 1.5 mm into the train bridge, under the body */
  for(const q of S.ckp)cylBetween(ck,0.4,TB_T,TB_T+1.5,M.steel,...q);
  /* one balance cock screw (parts list 42192), at its position on the top-view photograph (p3map scr_cockfoot), its head down in the counterbore */
  hn(screw(ck,...Q,CK_T+CK_CB,2.8,1.5,TB_T-CK_T-CK_CB+2.5,0.8),'42192');   /* through the cock into the train bridge */
  hn(screw(ck,...SPS,CK_T+0.45,0.6,0.45,2.6),'27760.st');   /* through the cock into the stud, its head flush in the counterbore: the counterbore 1.25 mm across (KLUwI2UUCMQ 41:58, the stud off, 53 px along its long axis at 42.5 px/mm, the row's holes 146-152 px apart for their measured 3.43-3.59; ±0.1), so the head r 0.6 in a counterbore r 0.65; r 0.8 in 0.9, estimated, until 5 October 2026 */   /* hairspring stud screw (27760), down through the cock to the stud (Figs. 19, 84) */
  /* endstone cap (42160) over the staff, as C Spinner's video shows it on the cock (5:51, 42:03, 42:08) and off it (41:58): a steel plate 0.7 mm thick (the top-view photograph shows it steel; at 41:58, with it off, the gilt ring is the setting under it), symmetric about the
     staff, its screws' (20762) heads sunk flush in counterbores 0.4 deep at either end; at its centre the setting (42155), pressed in flush with both faces, has a polished
     conical oil sink 3.1 mm across in its top down to the endstone, set from below flush with the cap's underside, r 0.95, 0.025 over the pivot's end */
  const ep=new THREE.Group();ep.position.set(L.B[0],CK_T,L.B[1]);ep.rotation.y=EPa;ck.add(ep);
  hn(mesh(ep,cbGeo(EPo,0.7,[[0,0,1.6],...EP.map(q=>[...hC(...q,0.7).slice(0,3),0.75,0.4])]),M.steel,0,-0.7,0),'42160');
  hn(mesh(ep,new THREE.LatheGeometry([V2(0.95,0),V2(0.95,-0.3),V2(0.75,-0.3),V2(1.55,-0.7),V2(1.6,-0.7),V2(1.6,0),V2(0.95,0)],40),M.steel),'42155');hn(mesh(ep,cylY(0.95,0.3,32),M.ruby,0,-0.15,0),'J.bue');
  for(const q of EP)hn(screw(ep,...q,-0.3,0.7,0.4,0.3+1.8),'20762.ep');
  /* ---------- fusee (8-3/4 turns), chain, barrel (radius 13.5, over the third wheel) ---------- */
  const fsP=part('fs',-50);const dx=L.Fu[0]-L.Ba[0],dz=L.Fu[1]-L.Ba[1],fd=Math.hypot(dx,dz);
  /* the fusee's profile from the side photograph (References/photo-side-view.jpg), read against the fusee wheel's tips taken as 40.87 mm (16.98 px/mm): the groove's floor on
     its eight upper turns is 8.33, 8.54, 8.95, 9.54, 10.19, 11.07, 12.16, 13.81, which r0 / sqrt(1 - a m) fits to 0.085 mm rms with r0 7.95 and 16.8 at the large end; at the
     plate's scale (FK, above) 7.01 and 14.82 */
  /* BB_LO: the barrel's lower face, 2.4 mm over the pillar plate (over the centre wheel, 0.55 clear), so the barrel is 16.5 mm tall cap to cap: C Spinner's video, side-on
     (33:09.5-33:35: height to radius 0.95 +- 0.06) and the 23:30 fit at the focal length that agrees with it (15.6-16.3); it was 13.2 */
  const BB_LO=y0-2.4;
  const fs=makeFusee(M,{yS:-19.86,yB:-10.9,collarT:TB_T+0.05,rmin:7.95*FK,rmax:16.8*FK,k:FK,epR:Math.hypot(...L.Fu)-(TRAIN.cw+2)*MOD.centre/2-0.3,N:FUSEE_TURNS,Rb:17.6,bT:TB_T+1.0,bB:BB_LO,cT:-19.86,cB:-10.9,aT:BB_T,d:fd,cap:0.64,screw,loose,endLift:fsP.userData.off+6,   /* end plate to 6 mm, under the fusee wheel */
    stopDir:Math.atan2(fo[1],fo[0])+Math.atan2(-dz,dx)});   /* the winding stop outward from the plate's centre, past the fusee's top (as it was, 7.2 mm out, before the top was widened) */
  fs.g.position.set((L.Fu[0]+L.Ba[0])/2,0,(L.Fu[1]+L.Ba[1])/2);fs.g.rotation.y=Math.atan2(-dz,dx);fsP.add(fs.g);R.fs=fs;
  /* winding stop (42099) on the underside of the barrel bridge, where the stop-bar's far end meets it at full wind: a stud screwed into the bridge (left-hand thread, Op. 42),
     down through the train bridge's notch to 0.05 under the bar's top face, clear above the chain's top turn and the nose; kept solid while the key winds (app.js) */
  { const q=fs.stud,c=Math.cos(fs.g.rotation.y),s=Math.sin(fs.g.rotation.y),WS=[fs.g.position.x+q[0]*c+q[1]*s,fs.g.position.z-q[0]*s+q[1]*c];
    hn(cylBetween(bb,0.9,TB_T,-20.45,M.steel,...WS),'42099').userData.wstop=true;hn(cylBetween(bb,0.45,TB_T-2.0,TB_T,M.steel,...WS),'42099',{sub:1});   /* the stud, and its thread 2 mm up into the bridge */
    R.barrelBridge.geometry.dispose();R.barrelBridge.geometry=polyGeo(BBpoly,TB_T-BB_T,[...BBH,hT(...WS,0.9)],0.25); }
  /* setup ratchet, click and cover plate on the barrel arbor above the barrel bridge (manual Figs. 24, 80), traced on the top-view photograph (fitted to
     its two screws and the arbor): a waisted plate across the arbor, its two ends arcs about 13 mm out along 107 deg / 287 deg, and both long sides
     concave, coming within about 6 mm of the arbor, so the ratchet's teeth show on either side and the click's tip on the rim side */
  const rt=part('ratchet',-76),P2=(r,a)=>[L.Ba[0]+PHOTO_K*r*Math.cos(a*D2R+PHOTO_TURN),L.Ba[1]+PHOTO_K*r*Math.sin(a*D2R+PHOTO_TURN)];
  /* SRZ: the setup ratchet's teeth, about 42 on C Spinner's video (11:58, 12:19, 38:28: pitch 8.3-8.8 deg; References/VIDEOS.md); SUT its tips' radius, 7.05 mm: the video
     (11:58) has the cover screws' tapped holes, 23.6 mm apart, 3.35 tip radii apart (7.04), and the top-view photograph the tips at 7.0-7.3 through topview.py's map */
  const SRZ=42,SUT=7.05,SRM=SUT/(SRZ/2+0.95);
  const srw=hn(mesh(rt,gearGeo(SRZ,SRM,1.0,{ratchet:true,flip:true,bore:1.4}),M.steel,L.Ba[0],-28.01,L.Ba[1]),'42026',{gear:{z:SRZ,m:SRM,ratchet:1}});   /* steep faces meet the click against the mainspring's pull */
  /* the barrel arbor (42170): through the ratchet and the barrel bridge to the plate. The Exploded view takes it out below with the barrel, whose core and hook hold it
     (the barrel bridge is over the core), leaving its squared top (the collar and square) with the ratchet */
  const ba=hn(loose(new THREE.Group(),parts.ratchet.userData.off-parts.fs.userData.off),'42170');rt.add(ba);ba.userData.axis=cylBetween(ba,1.4,-29.66,-1,M.steel,L.Ba[0],L.Ba[1]);hn(cylBetween(rt,2.3,-29.96,-28.51,M.steel,L.Ba[0],L.Ba[1],28),'42170',{sub:1});
  /* the barrel arbor's core inside the barrel, with the hook for the mainspring's inner end (Figs. 26, 75; arbor 42170). The hook stands in the eye near the spring's
     inner end (fs.MS.hookA in the fusee/barrel group's frame, which the arbor never turns from), no higher than the strip is thick, so the next coil passes over it;
     the core stays 0.1 clear of the turning caps */
  { const ga=fs.MS.hookA-fs.g.rotation.y,hk=mesh(ba,new THREE.BoxGeometry(0.5,2.4,0.9),M.steel,L.Ba[0]+(MSPRING.ra+0.09)*Math.cos(ga),(TB_T+1.9+BB_LO-0.8)/2,L.Ba[1]+(MSPRING.ra+0.09)*Math.sin(ga));hk.rotation.y=-ga;
    cylBetween(ba,MSPRING.ra-0.06,TB_T+1.71,BB_LO-0.7,M.steel,L.Ba[0],L.Ba[1],32); }
  hn(mesh(rt,new THREE.BoxGeometry(2.2,6.0,2.2),M.steel,L.Ba[0],-32.96,L.Ba[1]),'42170',{sub:1});   /* the arbor's square, about 7.5 mm over the ratchet (C Spinner 11:46, 11:58: 8-10, rough; it was 4.5) */
  { const Pv=S.click,Tp=P2((SUT-2.25*SRM+0.015)/PHOTO_K,218.6),clk=hn(mesh(rt,pawlGeo(Math.hypot(Tp[0]-Pv[0],Tp[1]-Pv[1])+0.3,1.3,0.8),M.steel,Pv[0],-28.01,Pv[1]),'42027');clk.rotation.y=Math.atan2(Tp[1]-Pv[1],-(Tp[0]-Pv[0]));
    /* turn the ratchet (it is fixed in running) so a steep face bears on the click's tip, then rest the click on it */
    const pr=ratchetProf(SRZ,SRM,true),pts=pawlPts(Math.hypot(Tp[0]-Pv[0],Tp[1]-Pv[1])+0.3,1.3),ph=phaseAgainst(pr,pts,[Pv[0]-L.Ba[0],Pv[1]-L.Ba[1]],clk.rotation.y,-1);
    srw.rotation.y=ph.psi;clk.rotation.y=ph.th;
    { const n=SRZ,m=SRM,rp=m*n/2,ro=rp+m*0.95,ri=ro-2.25*m,pp=TAU/n,RT=[];for(let i=0;i<n;i++){const a=i*pp;RT.push([ri,a],[ro,a+pp*0.9],[ri,a+pp*0.97]);}   /* the drawn outline (gearGeo, flipped) */
      const CP=pts.map(([x,z])=>{const c=Math.cos(ph.th),sn=Math.sin(ph.th);return[Pv[0]+x*c+z*sn,Pv[1]-x*sn+z*c];});
      const gap=psi=>{const W=RT.map(([r,a])=>{const x=r*Math.cos(a),z=r*Math.sin(a),c=Math.cos(psi),sn=Math.sin(psi);return[L.Ba[0]+x*c+z*sn,L.Ba[1]-x*sn+z*c];});let d=1e9,inside=false;
        for(const P of CP){let w=false;for(let i=0,j=W.length-1;i<W.length;j=i++){const[xi,zi]=W[i],[xj,zj]=W[j];if((zi>P[1])!==(zj>P[1])&&P[0]<(xj-xi)*(P[1]-zi)/(zj-zi)+xi)w=!w;
          const dx=xj-xi,dz=zj-zi,l2=dx*dx+dz*dz,t=clamp(((P[0]-xi)*dx+(P[1]-zi)*dz)/l2,0,1);d=Math.min(d,Math.hypot(P[0]-xi-t*dx,P[1]-zi-t*dz));}if(w)inside=true;}return inside?-d:d;};
      let a=ph.psi-0.03,b=ph.psi;if(gap(a)<0&&gap(b)>0){for(let i=0;i<40;i++){const mm=(a+b)/2;gap(mm)>0.003?b=mm:a=mm;}srw.rotation.y=b;} }
    /* setup pawl spring (42028, Figs. 17, 24, 80, 108): a blued band on edge, standing on the barrel bridge under the cover, round the ratchet about half a turn at r 9,
       from its fixed end, held between two steady pins in the bridge ("pushed off by pressure on steady pins from the lower side of barrel bridge", Ops. 27, 41), to the
       click's back, which it bears on at the click's height (C Spinner 11:58: about 180 deg at 1.23-1.31 of the ratchet's tip radius, so 8.7-9.2 mm, its edge about 0.9 mm seen from above at a slant; Fig. 108 draws
       about as much; 0.3 thick and 0.85 tall, the pins' places estimated) */
    const bk=pawlBack(pts,1.1,Pv,ph.th,L.Ba),E=[bk.p[0]+bk.n[0]*0.13,bk.p[1]+bk.n[1]*0.13],SR=1.273*SUT/PHOTO_K,eA=(Math.atan2(E[1]-L.Ba[1],E[0]-L.Ba[0])-PHOTO_TURN)/D2R,arcP=[];   /* eA in P2's angles (the photographs' frame) */
    const e1=(eA+360)%360-6,a0=e1-174;for(let a=a0;a<e1;a+=6)arcP.push(P2(SR,a));
    hn(mesh(rt,stripGeo([...arcP,E],0.3,0.85),M.blued,0,BB_T-0.85,0),'42028');   /* on the bridge, up to the click's middle */
    for(const q of[P2(SR+0.42,a0+3),P2(SR-0.42,a0+12)])hn(cylBetween(rt,0.25,-27.71,-27.16,M.steel,...q),'42028',{sub:1});}
  const nBefore=rt.children.length;
  { /* outline symmetric about its long axis (106.9 deg / 286.9 deg) and across it, as both photographs show, about its own centre Q, 0.53 mm off the arbor toward the
       centre side: two end arcs round Q at r 12.69, 75.6 deg wide, and two like concave sides to r 5.58 from Q (so 5.05 from the arbor on the rim side, 6.11 on the
       centre side). Fitted to the plate's edge traced along 240 normals on each photograph (photo-movement-2E12055 through a camera fitted to 11 screws and the
       arbor, the top-view photograph through topview.py's map): each alone gives Q 0.59 and 0.41 off, sides to 5.61 and 5.43; the fit's edge within 0.24 mm
       (median) of the traced one. */
    const CA=106.89,CH=37.8,CR=12.69,CW=5.58,Q0=P2(-0.53,CA+90),PQ=(r,a)=>{const p=P2(r,a);return[p[0]+Q0[0]-L.Ba[0],p[1]+Q0[1]-L.Ba[1]];};
    const arc3=(a,b,c,n)=>{const[ax,az]=a,[bx,bz]=b,[cx2,cz2]=c,d=2*(ax*(bz-cz2)+bx*(cz2-az)+cx2*(az-bz)),
        ux=((ax*ax+az*az)*(bz-cz2)+(bx*bx+bz*bz)*(cz2-az)+(cx2*cx2+cz2*cz2)*(az-bz))/d,uz=((ax*ax+az*az)*(cx2-bx)+(bx*bx+bz*bz)*(ax-cx2)+(cx2*cx2+cz2*cz2)*(bx-ax))/d,
        r=Math.hypot(ax-ux,az-uz),t0=Math.atan2(az-uz,ax-ux),tm=Math.atan2(bz-uz,bx-ux);let t1=Math.atan2(cz2-uz,cx2-ux);
      const w=t=>((t-t0)%TAU+TAU)%TAU;let dt=w(t1);if(w(tm)>dt)dt-=TAU;const o=[];for(let k=1;k<n;k++){const t=t0+dt*k/n;o.push([ux+r*Math.cos(t),uz+r*Math.sin(t)]);}return o;};
    const TL=PQ(CR,CA-CH),BL=PQ(CR,CA+CH),BR=PQ(CR,CA+180-CH),TR=PQ(CR,CA+180+CH),pts=[],polar=(a0,a1,n)=>{const o=[];for(let k=1;k<n;k++)o.push(PQ(CR,lerp(a0,a1,k/n)));return o;};
    pts.push(TL,...polar(CA-CH,CA+CH,30),BL,...arc3(BL,PQ(CW,CA+90),BR,40),BR,...polar(CA+180-CH,CA+180+CH,30),TR,...arc3(TR,PQ(CW,CA-90),TL,40));
    const s=new THREE.Shape();pts.forEach(([x,z],i)=>i?s.lineTo(x,-z):s.moveTo(x,-z));s.closePath();
    for(const[x,z,r]of[[...L.Ba,3.0],...S.cover.map(q=>hC(...q,0.9)),hC(...S.click,0.6)]){const h=new THREE.Path();h.absarc(x,-z,r,0,TAU,true);s.holes.push(h);}
    const cvg=extrude(s,{depth:0.8,bevelEnabled:true,bevelThickness:0.15,bevelSize:0.15,bevelSegments:1,curveSegments:24});cvg.rotateX(-Math.PI/2);cvg.translate(0,0.15,0);
    R.cover=hn(mesh(rt,cvg,M.plateSolid,0,-29.66,0),'42029');
    /* two screws near the ends, on feet down to the bridge; the pin near the lower-right corner is the setup pawl pivot */
    /* the feet: steps under the cover's ends (Fig. 108), each round its screw and set 0.5 mm further out from the arbor, so the click's spring passes inside them */
    for(const q of S.cover){const u=[q[0]-L.Ba[0],q[1]-L.Ba[1]],l=Math.hypot(...u),fc=[q[0]+u[0]/l*0.5,q[1]+u[1]/l*0.5];hn(mesh(rt,polyGeo([...Array(40)].map((_,i)=>[fc[0]+1.1*Math.cos(i/40*TAU),fc[1]+1.1*Math.sin(i/40*TAU)]),1.4,[hC(...q,0.9)]),M.plateSolid,0,-28.56,0),'42029',{sub:1});hn(screw(rt,...q,-29.66,0.9,0.55,1.1+1.4+2.2),'42056.cv');}   /* 42056, into the barrel bridge */
    /* setup pawl pivot screw (42036): put in from under the barrel bridge (Op. 41, Fig. 80), its head in the gap over the barrel, its shank the click's pivot, its end in
       the cover's hole, flush with its top, where the top-view photograph shows a small round end, not a screw head */
    { const cf=new THREE.Group();cf.rotation.x=Math.PI;rt.add(cf);hn(screw(cf,S.click[0],-S.click[1],-TB_T,0.6,0.4,TB_T+29.66-0.05),'42036'); } }
  rt.children.slice(nBefore).forEach(o=>o.traverse(m=>m.userData.driveHide=true));   /* on every mesh (look() tests meshes): the screws are groups */
  /* dust seal around the fusee arbor (manual Fig. 24): nickel body on a flange held by two screws, capped by three packing rings; the arbor's squared end takes the key */
  const wp=part('post',-78);
  hn(wp,'42051');mesh(wp,new THREE.LatheGeometry([V2(1.3,-27.18),V2(6.6,-27.18),V2(6.6,-28.36),V2(6.2,-28.76),V2(5.9,-28.96),V2(5.9,-32.56),V2(1.3,-32.56),V2(1.3,-31.8),V2(3.0,-31.8),V2(3.0,-27.9),V2(1.3,-27.9),V2(1.3,-27.18)].reverse(),56),M.plateSolid,L.Fu[0],0,L.Fu[1]);
  /* inside it (parts list 108-41, 108-42; sizes estimated): the seal ring on the arbor's square end, pressed against the chamber's top by the helical seal spring */
  hn(mesh(wp,ringGeo(2.95,1.21,0.6),M.steel,L.Fu[0],-31.5,L.Fu[1]),'42052');
  { const P=[];for(let i=0;i<=200;i++){const t=i/200,a=t*5*TAU;P.push(new THREE.Vector3(L.Fu[0]+2.3*Math.cos(a),-28.02-t*(31.08-28.02),L.Fu[1]+2.3*Math.sin(a)));}
    hn(mesh(wp,closeGeo(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P),400,0.12,8,false)),M.steel),'42053'); }
  for(let k=0;k<3;k++){const a=-32.56-1.733*k,b=a-1.733;hn(mesh(wp,new THREE.LatheGeometry([V2(3.4,a),V2(6.2,a),V2(6.45,a-0.22),V2(6.45,b+0.22),V2(6.2,b),V2(3.4,b),V2(3.4,a)].reverse(),56),M.brass2,L.Fu[0],0,L.Fu[1]),'42054');}
  const sbu=(u=>{const n=[-u[1],u[0]];return n[1]<0?n:[-n[0],-n[1]];})((([a,b])=>{const d=[a[0]-b[0],a[1]-b[1]],l=Math.hypot(...d);return[d[0]/l,d[1]/l];})(S.seal));   /* across the screws' line, toward the 12 */
  const fl=mesh(wp,polyGeo(subtractCircle([...Array(96)].map((_,i)=>[8.6*Math.cos(i/96*TAU),8.6*Math.sin(i/96*TAU)]),[14.55*sbu[0],14.55*sbu[1]],7.55),1.0,[[0,0,6.7],...S.seal.map(q=>hC(q[0]-L.Fu[0],q[1]-L.Fu[1],1.0))]),M.plateSolid,L.Fu[0],-28.18,L.Fu[1]);
  for(const q of S.seal)hn(screw(wp,...q,-28.18,1.0,0.5,1.0+2.0),'42056.sl');   /* dust seal screws (42056) into the barrel bridge; the flange with a shallow concave bite between them on the 12's side, about 7 wide and 1.6 deep, nearly to the column (C Spinner 6:29; its size rough) */
  const sqP=part('sq',-84);R.sq=hn(new THREE.Group(),'42022',{sub:1});R.sq.position.set(L.Fu[0],0,L.Fu[1]);sqP.add(R.sq);   /* the fusee arbor's square */cylBetween(R.sq,1.2,-36.56,-27.16,M.steel);mesh(R.sq,new THREE.BoxGeometry(2.4,1.6,2.4),M.steel,0,-37.16,0);
  /* winding key: its socket fits the fusee arbor square and turns it (never the barrel arbor, which the setup ratchet holds) */
  R.wkey=new THREE.Group();R.wkey.visible=false;R.sq.add(R.wkey);
  mesh(R.wkey,sqRingGeo(2.6,2.46,5),M.brass,0,-39.46,0);cylBetween(R.wkey,1.7,-41.96,-69,M.brass);   /* handle low enough to turn clear of the case's shield plate and its screws (lowest at -67.8, box.js) */
  const kbar=mesh(R.wkey,new THREE.CylinderGeometry(2.4,2.4,26,20),M.brass,0,-71,0);kbar.rotation.x=Math.PI/2;
  for(const sz of[13,-13])mesh(R.wkey,new THREE.SphereGeometry(2.4,18,12),M.brass,0,-71,sz);mesh(R.wkey,new THREE.SphereGeometry(3.4,18,12),M.brass,0,-71,0);
  /* ---------- tooth phasing: driver tooth centred on the line of centres, driven gap centred there ---------- */
  const ph=(A,pa,na,extA,B,pb,nb,extB)=>{const phi=Math.atan2(-(pb[1]-pa[1]),pb[0]-pa[0]);A.rotation.y=phi-0.375*TAU/na-(extA||0);B.rotation.y=phi+Math.PI-0.875*TAU/nb-(extB||0);};
  const U=R.gw.userData,CW=R.cw.userData,TW=R.tw.userData,FW=R.fw.userData,EW=R.esc.userData;
  ph(U.wheel,L.Fu,TRAIN.fu,0,CW.pin,L.C,TRAIN.cp,0);
  ph(CW.wheel,L.C,TRAIN.cw,0,TW.pin,L.T,TRAIN.tp,0);
  ph(TW.wheel,L.T,TRAIN.tw,0,FW.pin,L.F,TRAIN.fp,0);
  ph(FW.wheel,L.F,TRAIN.fw,0,EW.pin,L.E,TRAIN.ep,BETA-ESC.t0);
  ph(R.cannon.userData.pin,L.C,MW.cp,0,R.minW.userData.wheel,L.Mw,MW.mw,0);
  ph(R.minW.userData.pin,L.Mw,MW.mp,0,R.hourW.userData.wheel,L.C,MW.hw,0);
  ph(R.fp.userData.pin,L.Fu,UD.pin,0,R.udW.userData.wheel,L.Ud,UD.wheel,0);
  /* ---------- laid out (the textbooks' developed drawing): the barrel and fusee stay; each later arbor goes onto the barrel-fusee line at its real centre
       distance from the one before, so every pair still meshes; the escape wheel, detent and balance turn together about the escape arbor (by DEV.g) ---------- */
  const DEV=(()=>{const sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],fi=p=>Math.atan2(-p[1],p[0]),d=sub(L.Fu,L.Ba),l=Math.hypot(...d),w=[d[0]/l,d[1]/l],P={Fu:L.Fu};
    for(const[a,b]of[['Fu','C'],['C','T'],['T','F'],['F','E'],['E','B']]){const r=Math.hypot(...sub(L[b],L[a]));P[b]=[P[a][0]+w[0]*r,P[a][1]+w[1]*r];}
    return{w,P,fi,sub,g:fi(w)-fi(sub(L.B,L.E)),mid:[(L.Ba[0]+P.B[0])/2,(L.Ba[1]+P.B[1])/2],len:Math.hypot(...sub(P.B,L.Ba))};})();
  /* driven pinions: when a pair's line of centres turns by D, the driver standing, the pinion turns D(1 + n driver / n pinion) to stay in mesh (a coin rolled
     round a coin); the escape pinion less the turn of its frame. Taken within half a pitch */
  const DPH=[[CW.pin,'Fu','C',TRAIN.fu,TRAIN.cp,0],[TW.pin,'C','T',TRAIN.cw,TRAIN.tp,0],[FW.pin,'T','F',TRAIN.tw,TRAIN.fp,0],[EW.pin,'F','E',TRAIN.fw,TRAIN.ep,DEV.g]].map(([m,a,b,na,nb,x])=>{
    const p=TAU/nb,c=(DEV.fi(DEV.w)-DEV.fi(DEV.sub(L[b],L[a])))*(1+na/nb)-x;return{m,r0:m.rotation.y,c:(((c+p/2)%p)+p)%p-p/2};});
  const dOf=k=>DEV.sub(DEV.P[k],L[k]),dC=dOf('C'),dF=dOf('F'),dE=dOf('E'),EFP=['escW','det','bal','spr'].map(k=>parts[k]);
  const DMV=[[parts.cw,dC],[parts.motion,dC],[parts.hands,dC],[parts.tw,dOf('T')],[parts.fw,dF],[R.udW,[-dC[0],-dC[1]]],[R.fp,[-dC[0],-dC[1]]],[R.sec,DEV.sub(dF,dC)],[R.ud,[-dC[0],-dC[1]]]];
  for(const[o]of DMV)o.userData.xz0=[o.position.x,o.position.z];
  /* schematic plates for the laid-out view, drawn see-through (app.js): pillar plate and train bridge along the line, barrel bridge over the barrel and fusee,
     a cock over the balance on a foot, and pillars beside the line clear of the wheels. Not parts: no partName, so they can't be picked, listed or sectioned */
  const dp=new THREE.Group();mv.add(dp);
  { const w=DEV.w,n=[-w[1],w[0]],at=(t,s=0)=>[L.Ba[0]+w[0]*t+n[0]*s,L.Ba[1]+w[1]*t+n[1]*s],tB=DEV.len,tF=Math.hypot(...DEV.sub(L.Fu,L.Ba));
    mesh(dp,stadium(at(6),at(tB),44,PP_T),M.plate,0,y0,0);mesh(dp,stadium(at(tF),at(tB),44,TB_U-TB_T),M.plate,0,TB_T,0);mesh(dp,stadium(at(6),at(tF),44,TB_T-BB_T),M.plate,0,BB_T,0);
    mesh(dp,stadium(at(tB),at(tB+20.5),9,2.6),M.plate,0,CK_T,0);cylBetween(dp,2.8,TB_T,CK_T+2.6,M.plateSolid,...at(tB+20.5));
    for(const[t,s,top]of[[8,19,TB_T],[62,-19,TB_U],[tB-8,19,TB_U]])cylBetween(dp,2.6,y0,top,M.plateSolid,...at(t,s),32); }
  dp.traverse(o=>{if(o.isMesh){o.userData.devPlate=true;o.userData.noCap=true;}});
  /* ---------- API ---------- */
  mv.userData.parts=parts;mv.userData.R=R;mv.userData.DEV=DEV;mv.userData.S=S;   /* S: screw positions, for the tools */
  mv.userData.lifted=SCREWS;   /* screws and loose pieces, for exploded.py */
  mv.userData.explode=e=>{for(const k in parts)parts[k].position.y=parts[k].userData.off*e;for(const g of SCREWS)g.position.y=g.userData.y0-g.userData.lift*e;};
  /* develop(e): 0 as built, 1 laid out in a line; moves only x, z and the turn about y, so it combines with explode */
  mv.userData.develop=e=>{for(const[o,d]of DMV){o.position.x=o.userData.xz0[0]+d[0]*e;o.position.z=o.userData.xz0[1]+d[1]*e;}
    const a=DEV.g*e,c=Math.cos(a),s=Math.sin(a);for(const g of EFP){g.rotation.y=a;g.position.x=L.E[0]+dE[0]*e-(L.E[0]*c+L.E[1]*s);g.position.z=L.E[1]+dE[1]*e-(-L.E[0]*s+L.E[1]*c);}
    for(const q of DPH)q.m.rotation.y=q.r0+q.c*e;};
  mv.userData.balance=kind=>{R.balU.visible=kind!=='split';R.balS.visible=kind==='split';R.balKind=kind==='split'?'split':'uncut';};R.balKind='uncut';
  mv.userData.stop=kind=>{R.armF9.visible=kind!=='navy';R.navy.visible=kind==='navy';R.bbScr[R.navyBB].visible=kind!=='navy';};   /* the balance stop fitted: the manual's locking arm (Fig. 9) or the Navy's Y-arm */
  /* train-blocking screw: with its dog point down between the fourth wheel's spokes, how many beats (E) the train can still turn before the next spoke meets it (blockRoom),
     and whether a spoke is under the dog point now, so it can't be screwed down (blockClear). The fourth wheel turns with its spokes' angles falling as E rises */
  { const u=R.tbs.userData,q=TAU/FW_SP,sp=E=>[...Array(FW_SP).keys()].map(j=>-(E*ESC.P)/ESC_PER.fw+FW.wheel.rotation.y+j*q-u.sig);
    u.vFace=(-7.46-0.45-(u.up+6.81))/(u.down-u.up);   /* screw travel (0 up, 1 down) at which the dog point reaches the fourth wheel's face */
    R.blockRoom=E=>Math.min(...sp(E).map(a=>(((a-u.half)%q)+q)%q))*ESC_PER.fw/ESC.P;
    R.blockClear=E=>sp(E).every(a=>Math.abs((((a%q)+q+q/2)%q)-q/2)>=u.half); }
  const RF=ESC_PER.fw,RT=ESC_PER.tw,RC=ESC_PER.cw,MR=MW.cp/MW.mw,HR=MR*MW.mp/MW.hw;   /* escape turns per fourth, third, centre turn; minute wheel and hour wheel per centre turn */
  let lastN=-1,lastEps=0,lastIn=-1,lastTh=null,lastPs='',lastSp=null,srA=0,holding=false,lastD=1e9,eps=null,nW0=0,eps0=0,ssV=0;
  /* ratchet profiles; WPH: fusee-ratchet angle (in the sustaining ratchet's frame) at which the winding pawls bear on its steep faces */
  const FPR=ratchetProf(WRT.z,WRT.m,false),SRP=ratchetProf(SRT.z,SRT.m,true),WPH=phaseAgainst(FPR,R.wp[0].userData.pts,R.wp[0].userData.q,R.wp[0].userData.th0,1).psi;
  R.WPH=WPH;R.SMAX=SMAX;R.sspGeo=sspGeo;R.ssD=0;R.FPR=FPR;R.SRP=SRP;   /* SMAX: the sustaining spring's travel from loaded to spent (with sspGeo); ssD: how far it has relaxed now (update()); the ratchets' profiles, for the essay's figure */
  /* the load path, which app.js picks out while winding: lp 'm' the mainspring's side (barrel, mainspring, chain, the fusee and its winding ratchet, the winding pawls and
     their springs), 's' the sustaining spring and its pins, 'r' the sustaining ratchet, 'h' the sustaining pawl, which holds the ratchet while the key turns, 'w' the fusee wheel */
  parts.gw.userData.lp='w';parts.sspring.userData.lp='s';parts.sratchet.userData.lp='r';parts.spawl.userData.lp='h';
  for(const pw of R.wp){pw.userData.lp='m';pw.userData.spr.userData.lp='m';}R.sr.children.filter(o=>o.isMesh&&o.userData.hn==='42007').forEach(o=>o.userData.lp='m');   /* the pawls, their springs and the springs' feet */
  R.fs.g.traverse(o=>{if(o.userData.partName&&['fusee','chain','barrel','mainspring'].includes(o.userData.partName))o.userData.lp='m';});
  /* when winding starts the spring turns the sustaining ratchet back until a steep face meets the sustaining pawl */
  const holdBack=a=>{const q0=[SPv[0]-L.Fu[0],SPv[1]-L.Fu[1]],tr=psi=>{const q=toWheel(q0,[0,0],psi),th=seatPawl(R.spawl.userData.pts,q,R.spawl.userData.base-psi,SRP),t=R.spawl.userData.pts[PAWL_TIP],c=Math.cos(th),sn=Math.sin(th);return Math.hypot(q[0]+t[0]*c+t[1]*sn,q[1]-t[0]*sn+t[1]*c);};
    let b=a,r=tr(a);for(let i=0;i<60;i++){const nb=b-SRP.p/40,nr=tr(nb);if(nr>r+0.004)break;b=nb;r=Math.min(r,nr);}return b;};
  /** @typedef {{E:number,th:number,lift:number,psDef:number,n:number,winding?:boolean,slip?:number,hkeyOn?:boolean,keyOn?:boolean,blk?:number,arm?:number,ssX?:number,dt?:number,springOn?:boolean,msOn?:boolean}} MoveState
      E: the escape wheel's place in teeth, which turns every arbor; th: the balance's angle (rad); lift, psDef: the detent's lift and the passing spring's bending (ESC.state);
      n: fusee turns from full wind; winding: the key turning; slip: seconds the key has turned the hands; hkeyOn, keyOn: the hand-setting and winding keys shown;
      blk, arm: the train-blocking screw and the locking arm, 0 (up, unlocked) to 1; ssX: the sustaining spring drawn that many times relaxed (0: as it is); dt: the frame's seconds;
      springOn, msOn: rebuild the hairspring, the mainspring (only when they can be seen) */
  /** @param {MoveState} s */
  mv.userData.update=(s)=>{
    const P=E.P,esc=s.E*P;
    R.esc.rotation.y=-E.t0+esc;   /* tips at t0+kP when E is whole */
    R.fw.rotation.y=-esc/RF;R.sec.rotation.y=-esc/RF;
    R.tw.rotation.y=esc/RT;
    const cA=esc/RC,hA=cA+(s.slip||0)/3600*TAU;R.cw.rotation.y=-cA;R.cannon.rotation.y=-hA;R.min.rotation.y=-hA;   /* slip: seconds the key has turned the hands on the centre arbor (the cannon pinion slips); the second hand is never touched */
    R.minW.rotation.y=hA*MR;R.hourW.rotation.y=-hA*HR;R.hour.rotation.y=-hA*HR;R.hkey.visible=!!s.hkeyOn;
    const gA=cA*TRAIN.cp/TRAIN.fu;R.gw.rotation.y=gA;R.ssg.rotation.y=gA;
    /* Maintaining work. Running: fusee -> winding ratchet -> winding pawls -> sustaining ratchet -> spring (loaded, d = 0) -> fusee wheel, so the sustaining ratchet turns
       with the fusee wheel, and the fusee sits eps past its n turns, where its ratchet's steep faces bear on the pawls (eps follows the train and any jump of the slider).
       Winding: the key turns the fusee back; the spring turns the sustaining ratchet back until the sustaining pawl holds it (holdBack), then relaxes as it alone drives the
       train; eps runs down to 0 with n, so the stop-bar meets the stop at full wind. When the key lets go, the mainspring turns the fusee forward until its ratchet catches
       the pawls, and drives the sustaining ratchet forward to load the spring again: nothing turns back */
    const base=fs.g.rotation.y+s.n*TAU,p=FPR.p,wrap=x=>((x%p)+p)%p,target=gA+WPH-base;if(eps===null)eps=wrap(target);
    if(!s.winding){if(holding){eps+=wrap(target-eps);holding=false;}else eps+=wrap(target-eps+p/2)-p/2;srA=gA;}
    else{if(!holding){holding=true;srA=holdBack(srA);nW0=s.n;eps0=eps;}eps=nW0>0?eps0*Math.min(1,s.n/nW0):0;}
    if(Math.abs(s.n-lastN)>0.0008||Math.abs(eps-lastEps)>0.002){fs.setWind(s.n,eps);lastN=s.n;lastEps=eps;}   /* the chain, barrel and stop-bar; the chain lies in the groove, so it follows eps too */
    fs.fz.rotation.y=s.n*TAU+eps;const fzW=base+eps;
    R.sr.rotation.y=srA;
    /* the spring drawn relaxed by dv: d itself, or with ssX (app.js's Exaggerate) ssX times d while winding, eased back over about 0.4 s (s.dt) when the key lets go;
       the working end's pin then moves round the ratchet with the spring's hole (dv - d), so the ratchet and its pawls stay where the train has them */
    { const d=Math.min(SMAX,gA-srA);R.ssD=d;let dv=d;if(s.ssX){const t=Math.min(SMAX,s.ssX*d);ssV=t>=ssV||s.dt==null?t:Math.max(t,ssV-SMAX*s.dt/0.4);dv=Math.max(d,ssV);}else ssV=d;
      if(Math.abs(dv-lastD)>0.002){R.sspring.geometry.dispose();R.sspring.geometry=sspGeo(dv);lastD=dv;const a=SSP+dv-d;R.ssPin.position.x=14.6*FK*Math.cos(a);R.ssPin.position.z=14.6*FK*Math.sin(a);} }
    for(const pw of R.wp){const psi=fzW-srA,u=pw.userData;pw.rotation.y=seatPawl(u.pts,toWheel(u.q,[0,0],psi),u.th0-psi,FPR)+psi;
      if(Math.abs(pw.rotation.y-u.sprTh)>0.002){u.spr.geometry.dispose();u.spr.geometry=wpsGeo(pw,pw.rotation.y);u.sprTh=pw.rotation.y;}}   /* the spring follows its pawl */
    { const q=toWheel([SPv[0]-L.Fu[0],SPv[1]-L.Fu[1]],[0,0],srA);R.spawl.rotation.y=seatPawl(R.spawl.userData.pts,q,R.spawl.userData.base-srA,SRP)+srA;if(R.spawl.rotation.y!==lastSp){lastSp=R.spawl.rotation.y;R.spWire(lastSp);} }   /* its spring wire bends with it */
    R.staff.rotation.y=-s.th;
    { const b=s.blk||0,u=R.tbs.userData;R.tbs.position.y=u.up+(u.down-u.up)*b;R.tbs.rotation.y=b*u.turns*TAU;R.arm.rotation.y=R.armL+R.armU*(1-(s.arm||0));R.navyLock(s.arm||0); }   /* screwed down turns it clockwise seen from its head */
    R.det.rotation.y=s.lift/E.LEN;
    const fa=s.n*TAU+eps;R.fp.rotation.y=fa;R.sq.rotation.y=fa;R.wkey.visible=!!s.keyOn;   /* the arbor, its square and pinion turn with the fusee */
    const udA=fa*UD.pin/UD.wheel;R.udW.rotation.y=-udA;R.ud.rotation.y=-UD_UP*D2R-udA;
    if(s.msOn){const In=fs.Ib(s.n,eps);if(Math.abs(In-lastIn)>=0.002){fs.ms.geometry.dispose();fs.ms.geometry=mainspringGeo(fs.MS.Tup-In,fs.MS.y0,fs.MS.y1,fs.MS.ey);lastIn=In;}}   /* rebuilt when the barrel has turned 0.7 deg */
    if(s.springOn&&s.th!==lastTh){R.spring.geometry=ribbonGeo(R.spPath(s.th),HS_B,HS_T,R.spring.geometry);lastTh=s.th;}   /* rewritten in place, and only when the balance has turned */
    /* passing spring: rides with the detent while unlocking; bends aside by itself on the return swing. Rebuilt only when either changes (still for most of each swing) */
    const psK=s.lift+','+s.psDef;if(psK!==lastPs){lastPs=psK;R.pspring.geometry.dispose();R.pspring.geometry=tripGeo(E.springPts(s));}
  };
  /* the escapement rebuilt for ESC's current settings (the adjuster's bench changes them with Object.assign(ESC, makeEsc(...))): detent pieces, trip spring screw, roller, jewels */
  mv.userData.escSet=()=>{for(const d of DETM){d.m.geometry.dispose();d.m.geometry=d.G();}{const[wx,wz]=wpAt();wPin.position.x=wx;wPin.position.z=wz;}
    roll.geometry.dispose();roll.geometry=rollG();collar.geometry.dispose();collar.geometry=collarG();palSet(pI,...palI());palSet(pD,...palD());lastPs='';};
  mv.userData.explode(0);
  /* the damascening only on the plates' and bridges' train-side faces: their undersides, edges and bevels plain, and the balance lower bridge plain all over, as the
     restoration video shows them (References/VIDEOS.md). Parts only: the laid-out view's schematic plates have no partName */
  mv.updateMatrixWorld(true);mv.traverse(o=>{if(!o.isMesh||o.material!==M.plate)return;let p=o;while(p&&p!==mv&&!p.userData.partName)p=p.parent;if(!p||p===mv)return;
    plainFaces(o,M.plateCrest,p.userData.partName!=='lowerBridge',mv);});
  mv.userData.S=S;   /* the screw and pin positions (plan, mm), for the tools */
  return mv;
}

/* fusee + chain + barrel. Fusee's large end at the fusee wheel (pillar-plate side), small end toward the barrel bridge */
function makeFusee(M,c){
  const g=new THREE.Group(),k=c.k??1,N=c.N,A=(1-(c.rmin/c.rmax)**2)/N,rf=m=>c.rmin/Math.sqrt(1-A*clamp(m,0,N)),PT=(c.yB-c.yS)/N,yf=m=>c.yS+PT*m,cT=c.cT??c.bT+1.2,cB=c.cB??c.bB-1.2,yb=m=>cT+(cB-cT)*m/N,fx=c.d/2,bx=-c.d/2;
  /* the chain (Fig. 38): figure-8 plates standing on edge, h 0.9 across the chain (radial on the drums) and 0.18 thick, three deep along the arbor (an outer link's two plates
     and an inner link's one), riveted at a 1.7 mm pitch parallel to the arbor: the side photograph's chain on the fusee unrolled about the cone, 1.55-1.76 at its 18.93 px/mm, and KLUwI2UUCMQ 23:45, the chain on the mat, 1.71-1.85 (1.0 until 4 October 2026); the plates' height 0.9 there too; their thickness estimated. Its pitch line (the rivets) runs 0.04 clear of the groove's
     floor on the fusee and 0.02 clear of the barrel's wall */
  const H=0.9,TK=0.18,PC=1.7,rc=m=>rf(m)+H/2+0.04,rB=c.Rb+H/2+0.04,dl=n=>Math.asin((rB-rc(n))/(fx-bx));
  /* barrel turns for m fusee turns of chain: the chain's length on the fusee's pitch line over the barrel's (rf is r0 / sqrt(1 - A m), the fusee for a pull falling
     in step with the barrel's turns) */
  const I=m=>(c.rmin*2/A*(1-Math.sqrt(1-A*clamp(m,0,N)))+(rc(0)-c.rmin)*m)/rB;
  const fz=hn(new THREE.Group(),'42021');fz.position.x=fx;fz.userData.partName='fusee';g.add(fz);
  const cap=c.cap??0.64,capR=c.capR??c.rmin+1.4,V2=(a,b)=>new THREE.Vector2(a,b),yT=c.yS-cap;
  /* ---- the winding stop-bar (42024, Sec. IV; Figs. 12, 28, 73): a bar across the fusee's top in a slot open to the rim at both ends, beside the arbor, pressed by the
     stop-bar spring toward its nose end. The nose hangs from that end into the top turn of the groove (at mF, 0.7 turn in), standing 1.6 mm proud of the groove's floor;
     the chain, winding on over its last turn, bears on the nose and slides the bar along, so its other end stands out past the rim into the path of the winding stop
     under the barrel bridge. Built in the bar's frame (x along the bar, the slot across z, sbR turned by al); the stop's place (c.stopDir, the fusee/barrel group's frame)
     sets al, and al where the nose falls in the groove. The slot runs beside the hub 3.6 mm off the axis, as Fig. 28 draws it and C Spinner's video shows it
     (20:05-20:27: 3.5-5 mm), the hub r 2.4 with the spring's groove round it to r 2.9 (the video's recess r 4-5 with its hub; sizes to about 30 %). Nose and travel
     estimated ---- */
  const sbZ=-3.6,BW=0.5,zHi=sbZ+BW+0.42,zLo=sbZ-BW-0.05,HUB=2.4,GRV=2.9,RS=0.9,xS=Math.sqrt((capR+0.15+RS)**2-(sbZ+BW+RS)**2),zS=sbZ+BW+RS,xF0=Math.sqrt((capR-0.05)**2-(sbZ-BW)**2),xB0=-xF0;
  /* xf: along the bar, where a circle r about the arbor meets the nose's outer corner (0.25 further out than the bar's line), which the chain reaches first */
  const xf=r=>-Math.sqrt(r*r-(Math.abs(sbZ)+0.25)**2),al=Math.atan2(zS,xS)-(c.stopDir||0);let mF=0.5,xN=0,rN=0;
  for(let i=0;i<6;i++){rN=rc(mF)-H/2;xN=xf(rN+1.6);const aN=Math.atan2(sbZ,xN)-al,phi0=-Math.PI/2+dl(mF);mF=(((aN-phi0)/TAU)%1+1)%1;}   /* the chain lies at local angle phi0 + TAU m */
  const TR=xf(rN)-xN,phi0=-Math.PI/2+dl(mF),yNb=yf(mF)+0.25,yNt=-20.4,xWin=xB0+0.5+TR+0.15;   /* travel; the nose from just under the winding stop's end to the chain's lower half */
  /* ---- the fusee: a lathe whose outer surface is pushed out to the helical groove: the floor rf(m) under each turn of the chain, a flange 0.16-0.3 thick between turns
     standing 1.25 mm over the floor of the turn below it (1.4 at the top: the top face), as on the side photograph, solid above the groove's start and below its end
     (led in over 0.12 turn at the start, where the chain leaves the fusee at full wind, and out over 0.04 at the end, past the chain's end link),
     and a window through the top turn for the stop-bar's nose ---- */
  const HF=1.25,HT=1.4,FT=0.08,FR=0.15,LI=0.12,ca=Math.cos(al),sa=Math.sin(al);
  const R=(x,z,y)=>{const th=Math.atan2(z,x),mu=(y-c.yS)/PT,ph=(((th-phi0)/TAU)%1+1)%1,nu=mu-ph,k=Math.floor(nu+0.5),u=nu-k,mc=k+ph;
    let r;if(mc<-LI)r=rf(0)+HT;else if(mc>N+LI/3)r=rf(N)+HF;else{const rg=rf(mc),mfl=mc+(u<0?-0.5:0.5),tip=mfl<0?rf(0)+HT:rf(mfl+0.5)+HF,d=(0.5-Math.abs(u))*PT,w=d<=FT?1:d>=FR?0:(FR-d)/(FR-FT);r=rg+(tip-rg)*w;}
    const cs=Math.cos(th+al),sn=Math.sin(th+al),rw=xWin/cs;if(y<=yNb+0.08&&cs<0&&r>rw&&Math.max(r*sn,rw*sn)>sbZ-0.6&&Math.min(r*sn,rw*sn)<sbZ+0.6)r=rw;   /* the nose's window: cut back to x = xWin in the bar's frame, where the ray meets the slot */
    return r;};
  const yBot=c.yB+0.6,pr=[V2(1.05,yT)],NY=Math.ceil((yBot-yT)/0.03);for(let i=0;i<=NY;i++)pr.push(V2(c.rmax,lerp(yT,yBot,i/NY)));
  pr.push(V2(5*k,yBot),V2(5*k,c.yB-1.1),V2(1.05,c.yB-1.1),V2(1.05,yT));   /* a recess in the large end holds a disc tapped for the winding ratchet's screws */
  const lg=new THREE.LatheGeometry(pr,216),lp=lg.attributes.position;for(let i=0;i<lp.count;i++){const x=lp.getX(i),z=lp.getZ(i),r=Math.hypot(x,z);if(r>5.5*k){const q=R(x,z,lp.getY(i))/r;lp.setX(i,x*q);lp.setZ(i,z*q);}}
  lg.computeVertexNormals();mesh(fz,lg,M.gilt);
  mesh(fz,ringGeo(c.rmax,0.84*c.rmax,0.4),M.gilt,0,yBot+0.2,0);   /* the large end's rim, standing 0.4 round a recess that holds the winding ratchet, its pawls and their springs (C Spinner 18:20, 28:17: the rim's inner edge about 0.84 of the end's radius; its height estimated: as tall as it can be and stay 0.1 clear of the sustaining ratchet and its pawl) */
  /* the arbor: through the fusee, then a collar r 2.7 k from the fusee's large end to the end plate, on which the winding ratchet's centre, the sustaining ratchet and the fusee wheel
     sit (restoration video 28:08, 28:17, 28:35; Fig. 69, arrow 5: "grease fusee arbor above ratchet wheel"), its end 0.02 past the wheel so the end plate bears on it and leaves
     the wheel free; then on to the plate */
  const yC0=c.yB+0.6,yC1=-5.88;hn(cylBetween(fz,1,c.aT??-33,yC0,M.steel,0,0,12),'42022');hn(cylBetween(fz,2.7*k,yC0,yC1,M.steel,0,0,32),'42022',{sub:1});hn(cylBetween(fz,1,yC1,-PP_T-0.1,M.steel,0,0,12),'42022',{sub:1});hn(cylBetween(fz,0.55,-PP_T-0.1,1.0,M.steel,0,0,12),'42022',{sub:1});   /* its lower pivot, through the plate bushing to the wind indicator pinion turned on its end */   /* arbor, then its lower pivot through the plate bushing to the wind-indicator pinion */
  /* winding ratchet wheel (42013) on the fusee's large end, fixed by two screws (42014) put in from below, their heads in the sustaining ratchet's open centre (Figs. 28, 69) */
  const WRS=[0.6,0.6+Math.PI].map(a=>[3.4*k*Math.cos(a),3.4*k*Math.sin(a)]);
  hn(mesh(fz,gearGeo(WRT.z,WRT.m/FK*k,0.5,{ratchet:true,bore:2.75*k,holes:WRS.map(q=>hC(...q,0.55))}),M.steel,0,c.yB+0.85,0),'42013',{gear:{z:WRT.z,m:WRT.m/FK*k,ratchet:1}});mesh(fz,discGeo(5*k,1.7,[[0,0,1.05],...WRS.map(q=>hT(...q,0.55))]),M.gilt,0,c.yB-1.1,0);
  if(c.screw){const fl=new THREE.Group();fl.rotation.x=Math.PI;fz.add(fl);for(const q of WRS)hn(c.screw(fl,q[0],-q[1],-(c.yB+1.1),0.55,0.3,0.6+1.2),'42014');}
  /* fusee end plate (42019) under the fusee wheel, against the collar's end, and the taper pin (42020) through the arbor below it that holds the stack on (Figs. 28, 70).
     The plate is r 7.0 k, or less to keep 0.3 clear of the centre wheel's teeth, which run at its height (c.epR: 5.6; Figs. 28 and 69 draw it about 0.37 of the wheel across, r 6.7), so it reaches under the wheel's bore, and its
     outer face has a raised boss round its hole with a slot across it, the notches the pin lies in (Ops. 27-29: "the end plate notches correspond to the taper of the taper
     pin"; the boss Fig. 69's and C Spinner's, 18:22, 18:25, where the plate is gilt brass and the pin's ends stand out past the boss; the boss's r 2.2 k estimated). The fusee rises above the
     fusee wheel in the Exploded view, so they come off the arbor's lower end and stay under the wheel (c.endLift) */
  { const ep=new THREE.Group(),EPR=c.epR??7.0*k;fz.add(ep);if(c.loose)c.loose(ep,c.endLift);hn(mesh(ep,ringGeo(EPR,1.02,0.25),M.gilt,0,-5.755,0),'42019');
    for(const sg of[1,-1])hn(mesh(ep,polyGeo(subtractCircle(discClip(2.2*k,[[sg*0.24,0,sg]],64),[0,0],1.02),0.25),M.gilt,0,-5.63,0),'42019',{sub:1});   /* the boss, either side of the slot */
    const tp=hn(mesh(ep,new THREE.CylinderGeometry(0.17,0.23,9.6*k,10),M.steel,0,-5.39,0),'42020');tp.rotation.z=Math.PI/2; }   /* in the slot, 0.01 off its floor, about two thirds of the plate across (Fig. 28) */
  /* the fusee's top (Figs. 28, 73, 109): on the top face a slotted layer, the stop-bar in the slot, the stop-bar spring (42025) in a groove round the arbor, and the top plate
     (42008) over them with two screws (27760) into the layer */
  const sbR=new THREE.Group();sbR.rotation.y=al;fz.add(sbR);
  const lay=(pts,holes)=>mesh(sbR,polyGeo(pts,0.5,holes||[]),M.gilt,0,yT-0.5,0);
  const REC=5.5*k;   /* the recess round the hub, r 5.5 (KLUwI2UUCMQ 20:25, the plate off: the recess's edge an ellipse about the collar, the top plate's screw holes, opposite each other at r 7.0, 1.26 times its radius out along their line); its depth 1.2-2.0 (the far wall's band, 35 px at 44 px/mm, seen 29 deg from face-on) is drawn as the layer's 0.5, the floor below it not cut (the stop-bar and its spring lie on it). Until 5 October 2026 the layer was cut only by the spring's groove, r 2.9 */
  lay(subtractCircle(discClip(capR,[[zHi,0,1]],128),[0,0],REC),[hT(0,7.0*k,0.55)]);lay(subtractCircle(discClip(capR,[[zLo,0,-1]],128),[0,0],REC),[hT(0,-7.0*k,0.55)]);   /* the rim round the recess, either side of the slot, tapped for the top plate's screws */
  lay(discClip(HUB,[[zHi,0,1]],96),[[0,0,1.02]]);   /* hub round the arbor; the spring's groove round it (r HUB-GRV), cut open by the slot */
  hn(mesh(sbR,discGeo(capR-0.2,0.6,[[0,0,3.0*k+0.05],hC(0,7.0*k,0.55),hC(0,-7.0*k,0.55)]),M.gilt,0,yT-1.1,0),'42008');if(c.screw)for(const z of[7.0*k,-7.0*k])hn(c.screw(sbR,0,z,yT-1.1,0.55,0.3,0.6+0.5),'27760.fu');   /* its screws opposite each other at r 7.0 k (restoration video 13:30, face-on) */
  hn(cylBetween(fz,3.0*k,yT-0.5,c.collarT??yT-2.1,M.steel,0,0,40),'42022',{sub:1});   /* a steel collar on the arbor, from the hub up through the top plate's hole (its r 3.0 k + 0.05), as Fig. 28 draws
     the hub rising through a large hole: the plate comes off over it, the collar staying on the arbor (restoration video 19:58-20:00), and stands on the hub with the plate off
     (20:20); r 0.326 of the plate's on 13:30, face-on. It rises 2.8 mm over the top layer (20:00, side-on, scaled by the groove's pitch, 38-41 px a turn there), so
     up to the barrel bridge, under whose bushing it is the arbor's shoulder: c.collarT, 0.05 under it (0.002 in, Ops. 15, 69). It stays inside the slot's edge (zHi) and
     0.12 over the stop-bar spring in the groove under it */
  const stopBar=hn(new THREE.Group(),'42024');stopBar.position.y=yT-0.25;sbR.add(stopBar);   /* in the slot, 0.025 off the top face and 0.025 under the plate */
  mesh(stopBar,new THREE.BoxGeometry(xF0-xB0,0.45,2*BW),M.steel,(xF0+xB0)/2,0,sbZ);   /* the bar (first child: tools/maintaining.py measures it) */
  { const s=new THREE.Shape(),yb0=0.225,Y=y=>y-(yT-0.25);[[xB0+0.5,yb0],[xB0,yb0],[xB0,Y(yNt)],[xN,Y(yNt)],[xN,Y(yNb)],[xN+0.5,Y(yNb)],[xN+0.5,Y(yNt)+0.1],[xB0+0.5,Y(yNt)+0.1]].forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));
    const ng=extrude(s,{depth:0.5,bevelEnabled:false});ng.translate(0,0,sbZ-0.25);mesh(stopBar,ng,M.steel); }   /* the nose: from under the bar's end, below the winding stop's end, then down into the groove */
  mesh(stopBar,new THREE.BoxGeometry(0.4,0.45,0.35),M.steel,-1.6,0,sbZ+BW+0.175);   /* a tab on the bar's inner side, which the spring's end bears on */
  const bsp=hn(mesh(sbR,new THREE.BufferGeometry(),M.steel,0,yT-0.25,0),'42025');let barX=null;
  /* the spring (42025): a round wire bent to an open C, about 270 deg in the groove round the hub from its fixed end, then into the slot beside the bar and against the tab,
     following it as it slides (Fig. 28; C Spinner 20:20, 20:27) */
  const setBar=x=>{if(x===barX)return;barX=x;stopBar.position.x=x;const P=[],rg=(HUB+GRV)/2,zs=sbZ+BW+0.21,a1=-Math.acos(0.9/rg);for(let k=0;k<=40;k++){const a=Math.PI+0.25-(Math.PI+0.25-a1)*k/40;P.push(new THREE.Vector3(rg*Math.cos(a),0,rg*Math.sin(a)));}
    P.push(new THREE.Vector3(0.9,0,zs),new THREE.Vector3(-1.4+x+0.02,0,zs));   /* out of the groove where the slot opens it (x 0.9, past the tab's reach at full travel) */bsp.geometry=reclose(bsp.geometry,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P),60,0.13,6,false));};
  setBar(0);
  /* how far the chain has pushed the nose in when it leaves the fusee at m: the incoming run's inner face, a turn fraction m - mF ahead of it, lies rN / cos of that angle out */
  const barTravel=m=>{const a=TAU*(m-mF);if(a>=Math.PI/2)return 0;const r=a<=0?rN:rN/Math.cos(a);return clamp(xf(Math.max(r,rN))-xN,0,TR);};
  /* the winding stop's place (group frame): where it meets the bar's leading side at full wind, 0.15 clear of the rim */
  const stud=[fx+xS*ca+zS*sa,-xS*sa+zS*ca];
  const bz=hn(new THREE.Group(),'42168');bz.position.x=bx;bz.userData.partName='barrel';g.add(bz);
  const bw=new THREE.Mesh(ringGeo(c.Rb,c.Rb-0.2,Math.abs(c.bT-c.bB)-1.2),M.brass);bw.position.y=(c.bT+c.bB)/2;bz.add(bw);bw.userData.driveGhost=true;bw.userData.barrelWall=c.Rb;   /* the wall, 0.2 thick (estimated), between the caps' inner faces: flush with their outer faces, its ends fought them (a dashed ring in Edges) */
  const CSA=[0,1,2,3,4].map(k=>(115+72*k)*D2R),CS=CSA.map(a=>[(c.Rb-0.4)*Math.cos(a),(c.Rb-0.4)*Math.sin(a)]);   /* the cap's screws, clear of the brace (70-110 deg) */
  mesh(bz,ringGeo(c.Rb+0.7,1.43,0.6),M.gilt,0,c.bT+0.3,0).userData.driveGhost=true;   /* the barrel's own end, its lip r Rb+0.7: 18.3, as the video's fit reads the barrel's top edge (23:30; Review-results.md, Elsewhere 23) */
  { const cp=hn(mesh(bz,discGeo(c.Rb+1.4,0.6,[[0,0,1.43],...CS.map(q=>hC(...q,0.3))]),M.gilt,0,c.bB-0.6,0),'42169');cp.userData.driveGhost=true;   /* the cap (42169), 0.7 wider than the barrel's own end: the bottom outline reads about that much larger on the video (23:30) */
    const ls=new THREE.Shape();ls.absarc(0,0,c.Rb-0.2,0,TAU,false);const lh=new THREE.Path();lh.absarc(0,0,c.Rb-0.6,0,TAU,true);ls.holes.push(lh);for(const q of CS){const h=new THREE.Path();h.absarc(q[0],-q[1],hT(0,0,0.3)[2],0,TAU,true);ls.holes.push(h);}
    const lg=extrude(ls,{depth:0.5,bevelEnabled:false,curveSegments:96});lg.rotateX(-Math.PI/2);mesh(bz,lg,M.brass,0,c.bB-1.1,0).userData.driveGhost=true;   /* the lip inside the rim, tapped for them (estimated) */
    if(c.screw){const fl=new THREE.Group();fl.rotation.x=Math.PI;bz.add(fl);for(const q of CS)hn(c.screw(fl,q[0],-q[1],-c.bB,0.3,0.25,1.0),'37023');} }
  /* mainspring brace (42037, Fig. 75): a strip lining the wall where the spring's outer end hooks, between the caps' inner faces */
  { const s=new THREE.Shape(),a0=Math.PI/2-0.35,a1=Math.PI/2+0.35;s.absarc(0,0,c.Rb-0.2,a0,a1,false);s.absarc(0,0,c.Rb-0.45,a1,a0,true);
    const ge=extrude(s,{depth:Math.abs(c.bT-c.bB)-1.74,bevelEnabled:false,curveSegments:24});ge.rotateX(-Math.PI/2);hn(mesh(bz,ge,M.steel,0,c.bT+0.62,0),'42037'); }   /* down to the cap screws' lip */
  const ms=hn(new THREE.Mesh(new THREE.BufferGeometry(),M.mspring),'42038');ms.position.x=bx;ms.userData.partName='mainspring';ms.userData.onlyDrive=true;g.add(ms);
  /* the mainspring's anchor pin (parts list: "complete with anchor pin"): a stud on the outer end's outside face, bearing on the brace's leading end, so the
     spring's pull holds the brace round the wall. Where the pin sits, and that it catches the brace, are estimated */
  const PIN=0.35+0.32/(c.Rb-0.6),pin=mesh(bz,new THREE.CylinderGeometry(0.3,0.3,0.26,12),M.steel,(c.Rb-0.34)*Math.cos(PIN-Math.PI/2),(c.bT+c.bB)/2+0.05,(c.Rb-0.34)*Math.sin(PIN-Math.PI/2));   /* the brace's end at -90 + 20 deg */
  pin.rotation.set(0,-(PIN-Math.PI/2),Math.PI/2);Object.assign(pin.userData,{partName:'mainspring',onlyDrive:true,hn:'42038',sub:1});   /* the mainspring's own pin, though built in the barrel's frame */
  mesh(bz,ringGeo(4,1.43,0.4),M.brass2,0,c.bT-0.25,0).userData.driveGhost=true;
  /* barrel cap on the pillar-plate end, held by five screws (manual Figs. 26, 109) */
  /* its five screws: above, with the cap */
  /* the links: an outer link (two plates and the two rivets through its ends) and an inner link (one plate), alternating, instanced */
  const plate=y=>{const s=new THREE.Shape(),r=H/2,tw=Math.asin(0.32/r);s.absarc(PC/2,0,r,tw-Math.PI,Math.PI-tw,false);s.absarc(-PC/2,0,r,tw,TAU-tw,false);s.closePath();
    const q=extrude(s,{depth:TK,bevelEnabled:false,curveSegments:10});q.rotateX(-Math.PI/2);q.translate(0,y-TK/2,0);return q;};
  const MAX=900,I4=new THREE.Matrix4(),geoA=mergeGeo([[plate(TK),I4],[plate(-TK),I4],...[PC/2,-PC/2].map(x=>[cylY(0.17,3*TK+0.08,10),new THREE.Matrix4().makeTranslation(x,0,0)])]),geoB=plate(0);
  const imA=new THREE.InstancedMesh(geoA,M.chain,MAX),imB=new THREE.InstancedMesh(geoB,M.chain2,MAX);g.add(imA,imB);imA.userData.partName=imB.userData.partName='chain';hn(imA,'42001');hn(imB,'42001',{sub:1});
  const mtx=new THREE.Matrix4(),t=new THREE.Vector3(),up=new THREE.Vector3(),nn=new THREE.Vector3(),pos=new THREE.Vector3(),q0=new THREE.Vector3(),q1=new THREE.Vector3();
  /* the chain's ends (Figs. 26, 28, 75): a pin through the end link, parallel to the arbor, into the fusee below the groove's last turn, and at the barrel end a hook plate
     whose nose goes into the barrel's wall; placed from the chain's path */
  const endM=m=>{m.userData.partName='chain';hn(m,'42001',{sub:1});g.add(m);return m;},fPin=endM(new THREE.Mesh(cylY(0.17,0.8,10),M.steel)),hkB=endM(new THREE.Mesh(new THREE.BoxGeometry(1.3,TK,H),M.chain)),hkN=endM(new THREE.Mesh(cylY(0.28,0.3,10),M.chain));hkN.userData.hookNose=true;   /* in its hole in the barrel's wall: barrel-clearance.js leaves it out */
  const Y=new THREE.Vector3(0,1,0),rad=(o,cx,p)=>new THREE.Vector3(p.x-cx,0,p.z).normalize();
  /* the chain's pitch line, locked to the groove (local angle phi0 + TAU m on the fusee turned rot): wound on the fusee from its large end (m = N) to md, where it
     leaves along the drums' common tangent (dl past their lowest point), then wound on the barrel from md back to its hook (m = 0) */
  const md=rot=>{let m=rot/TAU;for(let i=0;i<3;i++)m=(-Math.PI/2+dl(m)+rot-phi0)/TAU;return m;};
  /* the barrel's turns from full wind with the fusee turned n (+ eps): the chain wound on the barrel, TAU I(m0) from where it meets it at the drums' tangent (-PI/2 + dl
     past the barrel's lowest point), so the hook at its end stays in its hole in the wall (with I(n), the fusee's turns, the hook slid 8 mm round the barrel over a wind) */
  const IB0=I(md(0))-dl(md(0))/TAU,Ib=(n,eps=0)=>{const m0=md(n*TAU+eps);return I(m0)-dl(m0)/TAU-IB0;};
  /* the chain's hook: its end on the barrel (m = 0) stays at HKA in the barrel's frame; its nose goes through a hole in the wall there (Figs. 17, 75), 0.7 mm across
     (estimated); the wall is one solid with the hole through it */
  const HKA=-Math.PI/2-TAU*IB0,HKN=HKA-0.85/rB,HKY=yb(0),HKW=0.35;   /* HKA: the chain's end; HKN: the nose, 0.85 on along the drum, past the last link's plates */
  { /* the wall as one closed solid with the hole through it: outer and inner faces on a grid in (angle, height), the hole's four faces, the two end faces */
    const top=c.bT+0.6,bot=c.bB-0.6,ro=c.Rb,ri=c.Rb-0.2,g0=HKW/c.Rb,ta=HKN+g0,tb=HKN-g0+TAU,M=180,U=[...Array(M+1).keys()].map(i=>ta+(tb-ta)*i/M),Y=[top,HKY-HKW,HKY+HKW,bot].sort((a,b)=>a-b);
    const P=[],I=[],vid={},V=(s,i,j)=>{const k=s+','+i+','+j;if(vid[k]===undefined){const r=s?ri:ro;vid[k]=P.length/3;P.push(r*Math.cos(U[i]),Y[j],r*Math.sin(U[i]));}return vid[k];};
    const q=(a,b,cc,d,n)=>{const p3=k=>new THREE.Vector3(P[3*k],P[3*k+1],P[3*k+2]),A=p3(a),B=p3(b),C=p3(cc),N=new THREE.Vector3().subVectors(B,A).cross(new THREE.Vector3().subVectors(C,A));
      if(N.dot(n)<0)I.push(a,cc,b,a,d,cc);else I.push(a,b,cc,a,cc,d);};
    const rad=i=>new THREE.Vector3(Math.cos(U[i]),0,Math.sin(U[i])),tan=i=>new THREE.Vector3(-Math.sin(U[i]),0,Math.cos(U[i])),up=new THREE.Vector3(0,1,0),dn=new THREE.Vector3(0,-1,0);
    for(let i=0;i<M;i++){const n=rad(i).add(rad(i+1));for(let j=0;j<3;j++){q(V(0,i,j),V(0,i+1,j),V(0,i+1,j+1),V(0,i,j+1),n);q(V(1,i,j),V(1,i+1,j),V(1,i+1,j+1),V(1,i,j+1),n.clone().negate());}
      q(V(0,i,3),V(0,i+1,3),V(1,i+1,3),V(1,i,3),up);q(V(0,i,0),V(0,i+1,0),V(1,i+1,0),V(1,i,0),dn);}
    { const n=rad(M).add(rad(0));for(const j of[0,2]){q(V(0,M,j),V(0,0,j),V(0,0,j+1),V(0,M,j+1),n);q(V(1,M,j),V(1,0,j),V(1,0,j+1),V(1,M,j+1),n.clone().negate());}   /* across the hole: below and above it */
      q(V(0,M,3),V(0,0,3),V(1,0,3),V(1,M,3),up);q(V(0,M,0),V(0,0,0),V(1,0,0),V(1,M,0),dn);
      q(V(0,M,1),V(0,0,1),V(1,0,1),V(1,M,1),up);q(V(0,M,2),V(0,0,2),V(1,0,2),V(1,M,2),dn);   /* the hole's bottom and top */
      q(V(0,M,1),V(0,M,2),V(1,M,2),V(1,M,1),tan(M));q(V(0,0,1),V(0,0,2),V(1,0,2),V(1,0,1),tan(0).negate()); }   /* its sides */
    let wg=new THREE.BufferGeometry();wg.setAttribute('position',new THREE.Float32BufferAttribute(P,3));wg.setIndex(I);wg=wg.toNonIndexed();wg.computeVertexNormals();   /* flat faces, as the extruded wall had */
    bw.geometry.dispose();bw.geometry=wg;bw.position.y=0; }
  function path(m0,rot){const P=[],V=(x,y,z)=>P.push(new THREE.Vector3(x,y,z)),d=dl(m0),r0=rc(m0);
    for(let m=N;m>m0;m-=0.01){const a=phi0+TAU*m-rot,r=rc(m);V(fx+r*Math.cos(a),yf(m),r*Math.sin(a));}
    const F0=[fx+r0*Math.sin(d),-r0*Math.cos(d)],B0=[bx+rB*Math.sin(d),-rB*Math.cos(d)],y0=yf(m0),y1=yb(m0);V(F0[0],y0,F0[1]);
    for(let s=0.1;s<1;s+=0.1)V(lerp(F0[0],B0[0],s),lerp(y0,y1,s),lerp(F0[1],B0[1],s));
    const In=I(m0);for(let m=m0;m>=0;m-=0.01){const b=-Math.PI/2+d-TAU*(In-I(m));V(bx+rB*Math.cos(b),yb(m),rB*Math.sin(b));}return P;}
  /* n turns from full wind, the fusee eps past them (the maintaining work's catch, update()): the fusee, barrel, chain and stop-bar */
  function setWind(n,eps=0){
    const rot=n*TAU+eps,m0=md(rot);fz.rotation.y=rot;bz.rotation.y=Ib(n,eps)*TAU;setBar(barTravel(m0));
    const P=path(m0,rot),J=[P[0].clone()];   /* the joints, PC apart along the pitch line */
    { let acc=0,next=PC;for(let i=1;i<P.length;i++){const seg=P[i].distanceTo(P[i-1]);while(acc+seg>=next){J.push(new THREE.Vector3().lerpVectors(P[i-1],P[i],(next-acc)/seg));next+=PC;}acc+=seg;} }
    let ia=0,ib=0;
    for(let k=0;k+1<J.length&&ia<MAX&&ib<MAX;k++){q0.copy(J[k]);q1.copy(J[k+1]);pos.addVectors(q0,q1).multiplyScalar(0.5);t.subVectors(q1,q0).normalize();
      up.set(0,1,0).addScaledVector(t,-t.y).normalize();nn.crossVectors(t,up);mtx.makeBasis(t,up,nn).setPosition(pos);if(k%2===0)imA.setMatrixAt(ia++,mtx);else imB.setMatrixAt(ib++,mtx);}
    imA.count=ia;imB.count=ib;imA.instanceMatrix.needsUpdate=true;imB.instanceMatrix.needsUpdate=true;
    { fPin.position.copy(J[0]).addScaledVector(Y,0.05);   /* through the first outer link's rivet hole, down into the fusee under the last turn */
      /* the hook at the chain's end on the barrel (HKA in the barrel's frame, turned with it), its plate from the last joint to it (the chain's length between the drums
         changes by about 0.3 mm over the wind; the plate takes it up), its nose through the wall to mid-thickness */
      const ha=HKN-bz.rotation.y,pe=new THREE.Vector3(bx+rB*Math.cos(ha),HKY,rB*Math.sin(ha)),pb=J[J.length-1],ub=rad(0,bx,pe),tb=new THREE.Vector3().subVectors(pe,pb),tl=tb.length();tb.normalize();
      const nb=new THREE.Vector3().crossVectors(tb,Y).normalize();const mp=pb.clone().add(pe).multiplyScalar(0.5),mr=Math.hypot(mp.x-bx,mp.z);mp.x=bx+(mp.x-bx)*rB/mr;mp.z*=rB/mr;   /* its middle on the pitch circle, so the chord doesn't sag into the wall */
      mtx.makeBasis(tb,Y,nb).setPosition(mp);hkB.matrix.copy(mtx);hkB.matrix.decompose(hkB.position,hkB.quaternion,hkB.scale);hkB.scale.x=(tl+0.4)/1.3;
      const nl=rB-(c.Rb-0.1);hkN.position.copy(pe).addScaledVector(ub,-nl/2);hkN.quaternion.setFromUnitVectors(Y,ub);hkN.scale.set(1,nl/0.3,1); }
  }
  /* the mainspring's turns: Tup at full wind (0.2 short of its most, where the stop-bar stops the key), Tdown = Tup less the barrel's IN turns at run down, and the
     set-up, what it is still wound past its fewest. Its outer end (theta = TAU T in mainspringGeo) 0.4 mm past the pin, so turning it by rot puts the end there
     at any wind; the eye near the inner end (ey) is where the arbor's hook goes (hookA, in the group's frame) */
  const IN=Ib(N),MR=msRange(),y0=c.bT+0.9,y1=c.bB-0.8,ym=(y0+y1)/2,e0=0.6/MSPRING.ra,e1=e0+1.06/MSPRING.ra,MS={Tup:Math.min(MR.Tmax-0.2,MR.Tmin+0.37+IN),y0,y1,ey:[e0,e1,ym-1.3,ym+1.3]};   /* fully wound: the set-up (0.37 turn, estimated) and the chain's barrel turns past the fewest the spring takes */
  MS.Tdown=MS.Tup-IN;MS.setup=MS.Tdown-MR.Tmin;MS.rot=TAU*MS.Tup+Math.PI/2-PIN-0.4/(MSPRING.Rw-MSPRING.t/2);MS.hookA=(e0+e1)/2-MS.rot;ms.rotation.y=MS.rot;
  /* the spring's pull (illustrative): the profile evens out exactly a pull falling in step with the barrel's turns, from 1 fully wound to rmin/rmax run down (pullB's first
     factor, at x of the barrel's turns let down); a real spring in its barrel rises more steeply than that near full wind, where its coils crowd the arbor, and falls off more
     steeply near run down: 3% at each end, flat between (SPR). pull(m): at m fusee turns from full wind; torque(m): pull times the chain's radius on the fusee, against
     the smallest, the fusee's small residual. A going barrel would deliver pullB(x) itself, x running evenly with time */
  const SPR=0.03,rho=c.rmin/c.rmax,pullB=x=>(1-(1-rho)*x)*(1+SPR*(1-2*x)**3),xb=m=>(1-rf(0)/rf(m))/(1-rho),pull=m=>pullB(xb(clamp(m,0,N))),torque=m=>pull(m)*rf(clamp(m,0,N))/rf(0);
  return{g,fz,bz,setWind,rf,yf,fx,bx,ms,I,Ib,IN,MS,stopBar,setBar,barTravel,mF,stud,N,pull,pullB,torque};
}
