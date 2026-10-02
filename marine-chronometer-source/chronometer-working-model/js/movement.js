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
     escape wheel position from the escapement (9.40 mm from the balance). The modules (MOD) follow from the arbors' spacing: 0.314 / 0.245 / 0.249.
   ===================================================================== */
const L={C:[0,0],T:[-6.18,14.75],F:[0,23.9],E:[8.095,17.08],B:[1.609,10.277],Fu:[14.306,-14.519],Ba:[-22.144,-5.347],Ud:[0,-23.6],Mw:[10.5,0]};
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
   below its train face (MR_FL), then a flange 95.9 across down to 10.4 mm (MR_Y), the dial's seat. Its bore (40.2) from the dial-side photograph. The dial 95 across, a little
   inside the flange (the side photograph; with the sub-dials on their arbors, the photographed dial's proportions give it within 2 %) */
const MR_RO=95.9/2,MR_RI=40.2,MR_FL=6.0-PP_T,MR_Y=10.4-PP_T,DIAL_R=47.5,DIAL_T=0.6,DD=MR_Y-3.3,DK=DIAL_R/50.8;   /* DD: the dial and all above it, raised from where 3.3 mm feet on the plate had them; DK: the hands, drawn for a 4 in dial, scaled to this one */
/* levels (y) from a side photograph of the movement, scaled by the pillar plate's 3.86 mm edge: train bridge 16.8-19.9 mm above the plate (TB_U, TB_T),
   barrel bridge 3.4 mm on it (BB_T), cock 14.2 mm tall on the train bridge (CK_T); the escape wheel runs just under the train bridge, the fourth
   wheel and escape pinion 3.6 mm above the plate, and the third wheel lowest with the centre wheel just above it, as Figs. 13, 29 and 110 stack the train (see README, 'How the layout was measured') */
const TB_U=-20.66,TB_T=-23.76,BB_T=-27.16,CK_T=-37.96;
const EY=-18.96,LB_T=-14.76,BAL_Y=-26.3;   /* escape wheel (teeth 0.95 below the train bridge), balance lower bridge's top face (photograph: 7.9-10.9 mm above the plate), balance rim */   /* bridge radius: the top-view photograph (the fusee wheel is hidden under it, as photographed) */          /* pillar plate; bridges */
const PILLARS={barrel:PT([-15.3,-26.58]),train:[PT([-16.63,22.48]),[5.61,35.62],PR([32.25,-10.81])]};   /* traced on the top-view photograph (PT, above); the third under the train bridge's screw at the end of its tongue, where C Spinner's video has it (23:30, 36:34) and the manual (Op. 14).
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
   and pin holes (not drawn: the bar lies on the face). Measured in the bridge's frame (PR) */
const TB_KEY=[[0.17, 7.9], [-0.01, 8.26], [-0.21, 8.8], [-0.35, 9.4], [-0.41, 10.14], [-0.37, 10.74], [-0.29, 11.18], [-0.13, 11.72], [0.17, 12.38], [0.45, 12.82], [0.75, 13.2], [1.15, 13.6], [1.53, 13.9], [1.97, 14.18], [2.69, 14.5], [2.23, 14.76], [1.67, 15.18], [1.19, 15.68], [0.77, 16.3], [0.51, 16.86], [0.37, 17.3], [0.27, 17.8], [0.23, 18.38], [0.31, 19.2], [0.41, 19.6], [0.61, 20.14], [0.89, 20.66], [1.19, 21.08], [1.81, 21.7], [2.23, 22.0], [2.75, 22.28], [3.29, 22.48], [3.93, 22.62], [4.51, 22.66], [5.09, 22.62], [5.73, 22.48], [6.27, 22.28], [6.79, 22.0], [7.35, 21.58], [7.83, 21.08], [8.25, 20.46], [8.51, 19.9], [8.71, 19.2], [8.79, 18.38], [8.75, 17.8], [8.61, 17.16], [8.43, 16.7], [9.29, 16.32], [9.33, 16.36], [9.59, 16.88], [10.09, 17.56], [10.65, 18.1], [11.19, 18.48], [11.73, 18.76], [12.49, 19.02], [13.03, 19.12], [13.63, 19.16], [14.23, 19.12], [14.77, 19.02], [15.53, 18.76], [16.07, 18.48], [16.61, 18.1], [17.17, 17.56], [17.67, 16.88], [17.95, 16.34], [18.13, 15.86], [18.25, 15.4], [18.33, 14.86], [18.35, 14.44], [18.27, 13.58], [18.07, 12.84], [17.95, 12.54], [17.67, 12.0], [17.17, 11.32], [16.75, 10.9], [16.37, 10.6], [16.07, 10.4], [15.53, 10.12], [15.05, 9.94], [14.59, 9.82], [14.05, 9.74], [13.63, 9.72], [12.77, 9.8], [12.03, 10.0], [11.73, 10.12], [11.19, 10.4], [10.51, 10.9], [10.09, 11.32], [9.79, 11.7], [9.33, 12.48], [8.57, 12.14], [8.41, 12.04], [8.55, 11.72], [8.71, 11.18], [8.79, 10.74], [8.83, 10.14], [8.79, 9.54], [8.71, 9.1], [8.43, 8.26], [8.13, 7.7], [7.67, 7.08], [7.13, 6.56], [6.45, 6.1], [6.09, 5.92], [5.55, 5.72], [4.95, 5.58], [4.63, 5.54], [3.79, 5.54], [3.47, 5.58], [2.87, 5.72], [2.33, 5.92], [1.97, 6.1], [1.29, 6.56], [0.63, 7.22]].map(PR);
/* the balance lower bridge (tools/lower_bridge.py), as a restoration video shows it (References/VIDEOS.md: KLUwI2UUCMQ 13:49.5, the train bridge's underside face-on, measured
   through the camera its rim and barrel cut give): two levels. LB_LO, the lower level, a slab curved as a lens: an outer edge on a circle of r 20.8 round from the 3 o'clock lug past the centre
   arbor, a flatter one down to the fourth's end (measured in the train bridge's frame, so turned with the photographed group), a straight edge across it, and a concave edge round the train bridge's escape lobe; LB_LO2 its underside's edge, where the face was
   traced, 0.8 mm in from the convex edges and the end for the chamfer round them. LB_UP, the upper level against the train bridge's underside: a lug at each end with its screw, and between them the train-blocking screw's column (the turned detent crosses
   the slab beside the fourth arbor); LB_WALL, where they join
   the slab */
const LB_UP=[[[-16.0, 22.49], [-15.69, 22.66], [-15.36, 22.82], [-14.72, 23.12], [-14.4, 23.28], [-14.08, 23.43], [-13.76, 23.59], [-13.12, 23.89], [-12.8, 24.05], [-12.48, 24.19], [-12.14, 24.28], [-11.78, 24.22], [-11.49, 24.02], [-11.26, 23.74], [-11.06, 23.45], [-10.85, 23.16], [-10.44, 22.57], [-10.23, 22.28], [-10.03, 21.98], [-9.85, 21.68], [-9.68, 21.36], [-9.53, 21.04], [-9.27, 20.36], [-9.15, 20.02], [-9.02, 19.68], [-8.77, 19.0], [-8.65, 18.66], [-8.56, 18.32], [-8.54, 17.96], [-8.62, 17.61], [-8.8, 17.28], [-9.01, 16.98], [-9.23, 16.7], [-9.65, 16.14], [-9.87, 15.86], [-10.29, 15.3], [-10.73, 14.74], [-10.97, 14.48], [-11.26, 14.27], [-11.58, 14.12], [-11.92, 14.04], [-12.28, 13.98], [-12.64, 13.93], [-13.0, 13.87], [-13.72, 13.77], [-14.08, 13.71], [-14.44, 13.7], [-14.8, 13.78], [-15.12, 13.96], [-15.37, 14.22], [-15.81, 14.78]],[[3.86, 24.32], [3.5, 24.38], [3.16, 24.51], [2.84, 24.67], [2.56, 24.9], [2.36, 25.19], [2.21, 25.52], [2.1, 25.86], [2.07, 26.22], [2.14, 26.58], [2.27, 26.92], [2.43, 27.24], [2.68, 27.51], [2.98, 27.71], [3.3, 27.85], [3.64, 27.96], [4.0, 27.98], [4.36, 27.9], [4.7, 27.77], [5.01, 27.6], [5.27, 27.36], [5.46, 27.06], [5.61, 26.74], [5.71, 26.4], [5.72, 26.04], [5.65, 25.68], [5.52, 25.35], [5.35, 25.04], [5.11, 24.78], [4.8, 24.58], [4.48, 24.44], [4.14, 24.34]],[[14.76, 6.68], [14.44, 6.83], [14.22, 7.12], [14.1, 7.45], [13.74, 8.82], [13.64, 9.16], [13.1, 11.2], [13.25, 11.52], [13.5, 11.77], [13.74, 12.02], [13.98, 12.3], [14.19, 12.58], [14.4, 12.87], [14.59, 13.18], [14.78, 13.5], [14.94, 13.82], [15.08, 14.14], [15.22, 14.48], [15.39, 14.8], [15.68, 15.02], [15.98, 15.21], [16.3, 15.38], [16.64, 15.51], [16.98, 15.6], [17.7, 15.76], [18.06, 15.83], [18.78, 15.99], [19.48, 16.13], [19.84, 16.21], [20.19, 16.28], [20.55, 16.3], [20.9, 16.2], [21.2, 15.98], [21.42, 15.7], [21.82, 15.1], [22.01, 14.8], [22.61, 13.9], [22.8, 13.6], [23.2, 13.0], [23.39, 12.7], [23.79, 12.1], [23.96, 11.78], [24.01, 11.42], [23.84, 11.11], [23.57, 10.88], [23.26, 10.68], [22.36, 10.11], [22.06, 9.91], [21.46, 9.53], [21.16, 9.33], [20.56, 8.95], [19.96, 8.56], [19.06, 7.99], [18.76, 7.79], [18.16, 7.41], [17.84, 7.23], [17.51, 7.08], [17.16, 6.97], [16.8, 6.89], [16.08, 6.79], [15.72, 6.75], [15.36, 6.7], [15.0, 6.67]]];
const LB_WALL=[[[-10.44, 15.78], [-10.7, 16.46], [-10.82, 16.8], [-11.04, 17.48], [-11.0, 17.84], [-10.9, 18.18], [-10.83, 18.54], [-10.8, 18.9], [-10.81, 19.26], [-10.86, 19.62], [-10.94, 19.97], [-11.06, 20.3], [-11.21, 20.62], [-11.39, 20.92], [-11.61, 21.2], [-11.85, 21.46], [-11.98, 21.8], [-12.03, 22.16], [-12.11, 22.88], [-12.14, 23.24], [-12.18, 23.96], [-12.02, 24.28], [-11.68, 24.17], [-11.4, 23.92], [-11.18, 23.62], [-10.97, 23.32], [-10.76, 23.03], [-10.14, 22.14], [-9.94, 21.84], [-9.76, 21.52], [-9.6, 21.2], [-9.46, 20.86], [-9.33, 20.52], [-9.21, 20.18], [-9.08, 19.84], [-8.83, 19.16], [-8.71, 18.82], [-8.6, 18.48], [-8.54, 18.12], [-8.58, 17.76], [-8.71, 17.42], [-8.91, 17.12], [-9.33, 16.56], [-9.55, 16.28], [-9.76, 16.0], [-10.08, 15.82]],[[3.86, 24.32], [3.5, 24.38], [3.16, 24.51], [2.84, 24.67], [2.56, 24.9], [2.36, 25.19], [2.21, 25.52], [2.1, 25.86], [2.07, 26.22], [2.14, 26.58], [2.27, 26.92], [2.43, 27.24], [2.68, 27.51], [2.98, 27.71], [3.3, 27.85], [3.64, 27.96], [4.0, 27.98], [4.36, 27.9], [4.7, 27.77], [5.01, 27.6], [5.27, 27.36], [5.46, 27.06], [5.61, 26.74], [5.71, 26.4], [5.72, 26.04], [5.65, 25.68], [5.52, 25.35], [5.35, 25.04], [5.11, 24.78], [4.8, 24.58], [4.48, 24.44], [4.14, 24.34]],[[14.76, 6.68], [14.44, 6.83], [14.22, 7.12], [14.1, 7.45], [13.74, 8.82], [13.64, 9.16], [13.1, 11.2], [13.25, 11.52], [13.5, 11.77], [13.8, 11.56], [13.91, 11.22], [14.02, 10.89], [14.14, 10.54], [14.36, 9.86], [14.48, 9.52], [14.59, 9.18], [14.71, 8.84], [14.93, 8.16], [15.05, 7.82], [15.27, 7.14], [15.39, 6.8], [15.06, 6.67]]];
const LB_LO=[[5.16, 3.35], [4.44, 3.39], [4.08, 3.42], [3.37, 3.5], [2.66, 3.6], [2.3, 3.66], [1.58, 3.8], [1.22, 3.88], [0.88, 3.96], [0.52, 4.05], [0.18, 4.14], [-0.16, 4.24], [-0.84, 4.46], [-1.52, 4.7], [-1.86, 4.83], [-2.54, 5.11], [-3.2, 5.41], [-3.47, 5.64], [-3.99, 6.12], [-4.24, 6.36], [-4.76, 6.88], [-5.0, 7.14], [-5.24, 7.39], [-5.72, 7.93], [-6.18, 8.47], [-6.85, 9.32], [-7.06, 9.6], [-7.28, 9.9], [-7.68, 10.48], [-7.88, 10.78], [-8.26, 11.38], [-8.82, 12.32], [-8.99, 12.64], [-8.72, 12.87], [-8.36, 12.92], [-8.0, 12.96], [-7.64, 13.01], [-7.28, 13.05], [-6.92, 13.1], [-6.56, 13.14], [-5.84, 13.24], [-5.5, 13.36], [-5.2, 13.55], [-4.96, 13.8], [-4.77, 14.1], [-4.66, 14.44], [-4.63, 14.8], [-4.69, 15.16], [-4.82, 15.49], [-5.02, 15.78], [-5.29, 16.02], [-5.6, 16.19], [-5.94, 16.28], [-6.3, 16.3], [-6.66, 16.25], [-7.02, 16.21], [-7.38, 16.16], [-7.74, 16.12], [-8.1, 16.07], [-8.46, 16.03], [-8.82, 15.98], [-9.18, 15.94], [-9.54, 15.89], [-9.9, 15.85], [-10.26, 15.8], [-10.54, 16.02], [-10.66, 16.35], [-10.78, 16.7], [-10.9, 17.04], [-11.0, 17.38], [-11.04, 17.74], [-10.93, 18.08], [-10.85, 18.44], [-10.81, 18.8], [-10.8, 19.16], [-10.84, 19.52], [-10.92, 19.88], [-11.03, 20.22], [-11.17, 20.54], [-11.35, 20.86], [-11.57, 21.16], [-11.81, 21.42], [-11.98, 21.74], [-12.1, 22.81], [-12.16, 23.54], [-12.2, 24.26], [-12.21, 24.62], [-11.96, 24.89], [-10.26, 25.39], [-9.92, 25.5], [-8.22, 26.0], [-7.89, 26.1], [-7.55, 26.2], [-7.22, 26.3], [-6.54, 26.5], [-6.21, 26.6], [-5.87, 26.7], [-5.54, 26.8], [-4.86, 27.0], [-4.53, 27.1], [-4.19, 27.2], [-3.86, 27.3], [-3.18, 27.5], [-2.85, 27.6], [-2.51, 27.7], [-2.18, 27.8], [-1.5, 28.0], [-1.17, 28.1], [-0.88, 27.89], [-0.58, 27.71], [-0.24, 27.62], [0.12, 27.6], [0.48, 27.57], [0.84, 27.5], [1.18, 27.41], [1.86, 27.13], [2.22, 27.21], [2.46, 27.48], [2.72, 27.71], [3.02, 27.9], [3.36, 28.03], [3.72, 28.1], [4.08, 28.1], [4.44, 28.03], [4.78, 27.9], [5.08, 27.71], [5.34, 27.48], [5.56, 27.2], [5.72, 26.88], [5.82, 26.54], [5.86, 26.18], [5.83, 25.82], [5.74, 25.48], [5.59, 25.16], [5.38, 24.87], [5.13, 24.62], [4.82, 24.42], [4.49, 24.28], [4.14, 24.2], [3.82, 24.06], [3.7, 23.72], [3.71, 23.36], [3.81, 23.02], [3.96, 22.7], [3.76, 22.4], [3.58, 22.1], [3.4, 21.79], [3.23, 21.48], [3.07, 21.16], [2.93, 20.82], [2.82, 20.48], [2.73, 20.14], [2.64, 19.78], [2.58, 19.42], [2.54, 19.07], [2.52, 18.72], [2.51, 18.36], [2.52, 18.0], [2.55, 17.64], [2.59, 17.28], [2.66, 16.92], [2.74, 16.58], [2.84, 16.24], [2.96, 15.9], [3.14, 15.59], [3.4, 15.34], [3.7, 15.16], [4.01, 15.0], [4.34, 14.82], [4.64, 14.62], [4.94, 14.4], [5.22, 14.16], [5.48, 13.9], [5.72, 13.62], [5.93, 13.34], [6.13, 13.04], [6.31, 12.72], [6.48, 12.4], [6.67, 12.1], [6.92, 11.84], [7.24, 11.67], [7.58, 11.56], [7.92, 11.46], [8.28, 11.38], [8.64, 11.32], [9.0, 11.28], [9.36, 11.26], [9.72, 11.25], [10.08, 11.26], [10.44, 11.29], [10.8, 11.34], [11.16, 11.41], [11.52, 11.5], [11.86, 11.6], [12.19, 11.72], [12.52, 11.85], [12.84, 12.0], [13.16, 12.17], [13.47, 12.36], [13.63, 12.04], [13.75, 11.7], [13.86, 11.37], [13.98, 11.02], [14.2, 10.34], [14.32, 10.0], [14.54, 9.32], [14.66, 8.98], [14.77, 8.64], [14.89, 8.3], [15.11, 7.62], [15.23, 7.28], [15.45, 6.6], [15.57, 6.26], [15.68, 5.93], [15.62, 5.57], [14.66, 5.12], [13.98, 4.84], [13.64, 4.71], [12.96, 4.47], [12.63, 4.36], [12.28, 4.25], [11.94, 4.15], [11.26, 3.97], [10.18, 3.73], [9.82, 3.67], [9.46, 3.6], [8.74, 3.5], [8.02, 3.42], [7.66, 3.39], [6.94, 3.35], [6.22, 3.33], [5.86, 3.33]];
const LB_LO2=[[5.18, 4.15], [4.46, 4.19], [4.1, 4.22], [3.38, 4.3], [3.02, 4.35], [2.3, 4.47], [0.86, 4.75], [0.5, 4.84], [0.16, 4.93], [-0.52, 5.15], [-1.2, 5.41], [-1.54, 5.56], [-1.88, 5.7], [-2.21, 5.84], [-2.54, 5.99], [-2.85, 6.16], [-3.12, 6.4], [-3.9, 7.15], [-4.66, 7.94], [-5.14, 8.48], [-5.38, 8.76], [-5.84, 9.32], [-6.06, 9.6], [-6.48, 10.16], [-6.9, 10.76], [-7.1, 11.05], [-7.3, 11.36], [-7.68, 11.96], [-7.86, 12.26], [-8.04, 12.57], [-8.21, 12.88], [-7.86, 12.98], [-7.5, 13.02], [-7.14, 13.07], [-6.78, 13.11], [-6.42, 13.16], [-6.06, 13.2], [-5.7, 13.28], [-5.38, 13.42], [-5.1, 13.64], [-4.87, 13.92], [-4.72, 14.24], [-4.64, 14.6], [-4.64, 14.96], [-4.73, 15.3], [-4.9, 15.62], [-5.14, 15.9], [-5.44, 16.11], [-5.78, 16.25], [-6.14, 16.3], [-6.5, 16.27], [-6.86, 16.23], [-7.22, 16.18], [-7.58, 16.14], [-7.94, 16.09], [-8.3, 16.05], [-8.66, 16.0], [-9.02, 15.96], [-9.38, 15.91], [-9.7, 16.07], [-9.83, 16.4], [-10.07, 17.08], [-10.18, 17.42], [-10.28, 17.76], [-10.39, 18.1], [-10.48, 18.44], [-10.58, 18.78], [-10.66, 19.12], [-10.75, 19.48], [-10.91, 20.2], [-10.98, 20.56], [-11.1, 21.28], [-11.25, 22.36], [-11.29, 22.72], [-11.35, 23.42], [-11.39, 24.14], [-11.08, 24.32], [-9.38, 24.82], [-9.05, 24.92], [-8.71, 25.02], [-8.38, 25.12], [-7.7, 25.32], [-7.37, 25.42], [-7.03, 25.52], [-6.7, 25.62], [-6.02, 25.82], [-5.69, 25.92], [-5.35, 26.02], [-5.02, 26.12], [-4.34, 26.32], [-4.01, 26.42], [-3.67, 26.52], [-3.34, 26.62], [-3.0, 26.72], [-2.66, 26.86], [-2.34, 27.0], [-2.02, 27.15], [-1.68, 27.29], [-1.35, 27.42], [-1.0, 27.53], [-0.66, 27.62], [-0.3, 27.63], [0.06, 27.6], [0.42, 27.58], [0.78, 27.52], [1.12, 27.43], [1.46, 27.3], [1.78, 27.15], [2.14, 27.16], [2.4, 27.41], [2.65, 27.66], [2.94, 27.86], [3.26, 28.0], [3.6, 28.09], [3.96, 28.11], [4.32, 28.06], [4.66, 27.96], [4.98, 27.79], [5.26, 27.56], [5.5, 27.28], [5.68, 26.97], [5.8, 26.64], [5.86, 26.28], [5.85, 25.92], [5.77, 25.56], [5.63, 25.22], [5.43, 24.92], [5.18, 24.67], [4.89, 24.46], [4.56, 24.3], [4.22, 24.22], [3.88, 24.11], [3.7, 23.8], [3.7, 23.44], [3.78, 23.09], [3.95, 22.78], [3.8, 22.46], [3.61, 22.16], [3.25, 21.52], [3.09, 21.2], [2.95, 20.86], [2.83, 20.52], [2.74, 20.18], [2.65, 19.82], [2.59, 19.46], [2.54, 19.1], [2.52, 18.74], [2.51, 18.38], [2.52, 18.02], [2.55, 17.66], [2.59, 17.3], [2.66, 16.94], [2.74, 16.58], [2.84, 16.24], [2.96, 15.9], [3.14, 15.59], [3.4, 15.34], [3.7, 15.16], [4.01, 15.0], [4.34, 14.82], [4.64, 14.62], [4.94, 14.4], [5.22, 14.16], [5.48, 13.9], [5.72, 13.62], [5.93, 13.34], [6.13, 13.04], [6.31, 12.72], [6.48, 12.4], [6.67, 12.1], [6.92, 11.84], [7.24, 11.67], [7.58, 11.56], [7.92, 11.46], [8.28, 11.38], [8.64, 11.32], [9.0, 11.28], [9.36, 11.26], [9.72, 11.25], [10.08, 11.26], [10.44, 11.29], [10.8, 11.34], [11.16, 11.41], [11.52, 11.5], [11.86, 11.6], [12.19, 11.72], [12.52, 11.85], [12.84, 12.0], [13.16, 12.17], [13.47, 12.36], [13.63, 12.04], [13.75, 11.7], [13.86, 11.37], [13.98, 11.02], [14.2, 10.34], [14.32, 10.0], [14.54, 9.32], [14.66, 8.98], [14.77, 8.64], [14.89, 8.3], [15.11, 7.62], [15.23, 7.28], [15.45, 6.6], [15.28, 6.29], [14.64, 5.99], [14.32, 5.85], [13.64, 5.57], [13.3, 5.44], [12.97, 5.32], [12.64, 5.21], [11.96, 4.99], [11.62, 4.89], [11.28, 4.8], [10.94, 4.72], [10.58, 4.63], [10.24, 4.56], [9.88, 4.49], [9.16, 4.37], [8.44, 4.27], [8.08, 4.23], [7.36, 4.17], [7.0, 4.16], [6.64, 4.14], [6.28, 4.13], [5.92, 4.13]];
/* going train, counted on a restoration video of a 1941 Model 21 (References/README.md, "Videos consulted"; tools/video.py): fusee wheel 90, centre wheel 90,
   third wheel 80 with a pinion of 12, fourth wheel 75; the fourth and escape pinions (10, 10) follow, the fourth turning once a minute and the 16-tooth escape
   wheel 7.5 times to its once. The centre pinion's leaves weren't counted cleanly: 14 makes the manual's 17½ half turns (Sec. III) hold 56¼ h, its "maximum of
   56 hours", and with the fusee arbor's pinion of 12 sweeps the UP-DOWN hand 313.6° in 56 h, as the photographed dial's 315.7°; 13 (with 13) would fit the dial
   and the manual's seven half turns a day but run 60.6 h. Every count shown in the page (labels, part cards, walkthrough tables) comes from here */
const TRAIN={fu:90,cp:14,cw:90,tp:12,tw:80,fp:10,fw:75,ep:10,ew:16};
const FW_SP=5;   /* the fourth wheel's spokes (Figs. 29, 110: the three train wheels have five each); the train-blocking screw's dog point stands between them */
const MW={cp:14,mw:56,mp:18,hw:54};   /* motion work: cannon pinion 14 : minute wheel 56, minute pinion 18 : hour wheel 54, counted on C Spinner's video (the wheels lying whole on
   the mat, 23:45-23:46; the minute pinion's 18 leaf ends on the wheel's back, 9:06; the cannon pinion's 14 forced by the ratio of 12: References/VIDEOS.md) */
const MWM=(()=>{const d=Math.hypot(...L.Mw);return{a:2*d/(MW.cp+MW.mw),b:2*d/(MW.mp+MW.hw)};})();   /* their modules, from the minute wheel's place (10.5 mm out, the dial-side photograph) */
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
const FK=(TRAIN.fu+2)*MOD.fusee/40.87,WRT={z:36,m:0.47*40/36*FK},SRT={z:120,m:0.27*FK};   /* the winding ratchet's 36 teeth: C Spinner 18:20 (spectral count, 35 and 37 close; References/VIDEOS.md), on the pitch radius it had with 40 */
const EU=(()=>{const dx=L.B[0]-L.E[0],dz=L.B[1]-L.E[1],l=Math.hypot(dx,dz);return[dx/l,dz/l];})(),BETA=Math.atan2(-EU[1],EU[0]);
/* Spring detent escapement: solved by makeEsc in ../shared/escapement.js (shared with the essay and tools/escapement.js), with the centre distance in L (9.40 mm).
   Unit frame: balance at origin, escape wheel centre at x=EX, unit = escape-wheel radius ES */
const ES=13.16/2,ESC=makeEsc({EX:-Math.hypot(L.B[0]-L.E[0],L.B[1]-L.E[1])/ES});
/* the detent support block's top face, against the train bridge (Fig. 90, Fig. 14, KLUwI2UUCMQ 11:08): its screw's hole between two positioning pins on its centre line, in
   detent coordinates (t, n: ESC.D); Fig. 90 scaled by the 11.3 mm from the point of flexure to the locking jewel, to about 0.3 mm. Pin a is 2.9 mm nearer the screw than
   Fig. 90's (t -1.43; the video's holes put it there too, KLUwI2UUCMQ 10:00, 10:50): Fig. 90's block runs 15 mm toward the foot from the point of flexure and the foot 17,
   the model's 9.2 and 10.6 (shortened to clear the train pillar), so the pin waits for the block's length (Review-results.md, "Elsewhere", 20) */
const DBLK={s:[-0.56,-0.29],p:[[-1.0,-0.29],[0.31,-0.29]]};

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
  const face=(poly,hs,y,up)=>{const Y=typeof y==='function'?y:()=>y,V=v=>new THREE.Vector2(v[0],v[1]),T=THREE.ShapeUtils.triangulateShape(poly.map(V),hs.map(h=>h.map(V))),all=[...poly,...hs.flat()];   /* up: faces -y (the top) */
    for(const[i,j,k]of T){const[a,b,e]=[all[i],all[j],all[k]],cr=(b[0]-a[0])*(e[1]-a[1])-(b[1]-a[1])*(e[0]-a[0]),f=(cr>0)===up?[a,b,e]:[a,e,b];
      tri(...f.map(p=>[p[0],Y(p),p[1]]),...f.map(p=>[p[0],-p[1]]));}};
  const rc=Math.cos(STRIPE_ANGLE),rs=Math.sin(STRIPE_ANGLE),uw=p=>{const t=p[0]*rc-p[1]*rs;return[-rs*38.75+t*rc,rc*38.75+t*rs];};   /* walls: along one ridge's crest of the stripes (38.75 mm across them), so they read polished, as the cock's are */
  const wall=(p,q,y0,y1,outward,y1q=y1)=>{const[a,b]=outward?[p,q]:[q,p],[ya,yb]=outward?[y1,y1q]:[y1q,y1],ua=uw(a),ub=uw(b);   /* a quad p->q from y0 down to y1 at p (y1q at q), facing to the right of p->q when outward */
    const A0=[a[0],y0,a[1]],B0=[b[0],y0,b[1]],A1=[a[0],ya,a[1]],B1=[b[0],yb,b[1]];
    tri(A0,A1,B1,ua,ua,ub);tri(A0,B1,B0,ua,ub,ub);};
  const cw=THREE.ShapeUtils.area(O.map(v=>new THREE.Vector2(v[0],v[1])))<0,loop=(L,f)=>{for(let k=0;k<L.length;k++)f(L[k],L[(k+1)%L.length]);};
  const cbr=h=>h[3]?circ(h[0],h[1],h[3]):circ(h[0],h[1],h[2]);
  face(O,[...hA.map(h=>circ(...h)),...hB.map(cbr)],0,true);face(BP,hB.map(h=>circ(...h)),tB,false);
  face([...A.slice(ia[m],ib[m]+1),...ARCS[m]],hA.map(h=>circ(...h)),tA,false);   /* the arm's underside within the last level */
  for(let j=0;j<m;j++)face([...A.slice(ia[j],ia[j+1]+1),...ARCS[j+1].slice().reverse(),...A.slice(ib[j+1],ib[j]+1),...ARCS[j]],[],prof,false);   /* the cove, band by band */
  for(const h of hB.filter(h=>h[3])){const R=circ(h[0],h[1],h[3]),I=circ(h[0],h[1],h[2]),F=[...R];face(F,[I],h[4],true);}   /* the counterbore's floor */
  for(let k=0;k<A.length-1;k++)wall(A[k],A[k+1],0,prof(A[k]),!cw,prof(A[k+1]));   /* the arm's edge, down to its underside */
  for(let k=0;k<B.length-1;k++){wall(B[k],B[k+1],0,tS,!cw);wall(B[k],B[k+1],tS,tB,!cw);}   /* the body's, split at tS where the arm's underside meets it */
  const Arc=[A[A.length-1],...ARC,A[0]];for(let k=0;k<Arc.length-1;k++)wall(Arc[k],Arc[k+1],tS,tB,cw);   /* the step under the arm */
  const hole=(L,y0,y1)=>{const ccw=THREE.ShapeUtils.area(L.map(v=>new THREE.Vector2(v[0],v[1])))>0;loop(L,(p,q)=>wall(p,q,y0,y1,!ccw));};   /* faces into the hole */
  for(const h of hA)hole(circ(...h),0,tA);for(const h of hB)if(h[3]){hole(circ(h[0],h[1],h[3]),0,h[4]);hole(circ(h[0],h[1],h[2]),h[4],tB);}else hole(circ(...h),0,tB);
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
function seatPawl(pts,q,th0,pr){
  const P=dense(pts),f=th=>{const c=Math.cos(th),sn=Math.sin(th);let m=1e9;for(const[x,z]of P){const X=q[0]+x*c+z*sn,Z=q[1]-x*sn+z*c,r=Math.hypot(X,Z);if(r<pr.ro+0.5)m=Math.min(m,r-pr.r(Math.atan2(Z,X)));}return m;};
  const tip=pts[PAWL_TIP],tr=th=>{const c=Math.cos(th),sn=Math.sin(th);return Math.hypot(q[0]+tip[0]*c+tip[1]*sn,q[1]-tip[0]*sn+tip[1]*c);};
  const so=tr(th0+0.01)>tr(th0)?1:-1;let a=th0+so*0.5,b=th0-so*0.5;if(f(b)>=0)return b;if(f(a)<0)return a;
  for(let i=0;i<28;i++){const m=(a+b)/2;f(m)>=0?a=m:b=m;}return a;}
/* wheel rotation (within one tooth) at which a pawl, pivot q and angle th0 in the parent frame (wheel centre at the origin), rests at the bottom of a
   tooth space against a steep face; dir = +1: the face meets it when the wheel turns with rotation.y rising, -1: falling. Returns wheel and pawl angles */
function phaseAgainst(pr,pts,q,th0,dir){let best=null;const N=240;
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
  const part=(name,off,ef)=>{const g=new THREE.Group();g.userData.off=off;g.userData.partName=name;mv.add(g);parts[name]=g;
    if(ef){const e=new THREE.Group();e.position.set(L.B[0],0,L.B[1]);e.rotation.y=BETA;g.add(e);g.userData.ef=e;return e;}return g;};
  /* screw: a fillister head seated at y (in p's frame), the head toward -y, and a threaded shank len mm long toward +y, into the parts it holds (Figs. 108-110 draw
     every screw with its shank). Thread diameter half the head's (sR); the parts it passes through have clearance holes (hC) and the part it screws into a tapped hole (hT).
     Head, shank and slot are one group, which the Exploded view lifts out of its holes along the screw's axis, as the manual's exploded views draw them (SCREWS) */
  const SCREWS=[],loose=(g,lift)=>{g.userData.y0=g.position.y;g.userData.lift=lift;SCREWS.push(g);return g;};   /* loose: g moves on its own in the Exploded view, lift mm toward its frame's -y past its part */
  const headOn=(g,p,q)=>{g.userData.lift+=parts[p].userData.off-parts[q].userData.off;return g;};   /* a screw of part p put in through part q: it leaves with q, then lifts out of it */
  const screw=(p,x,z,y,r=2.2,h=1.1,len=0,rs=sR(r))=>{const c=Math.min(0.35,r*0.14),pr=[V2(0,-h),V2(r-c,-h),V2(r,-h+c),V2(r,0)];
    if(len>0){const pt=clamp(rs*0.42,0.06,0.3),d=pt*0.3,n=Math.max(1,Math.floor((len-pt*0.6)/pt));pr.push(V2(rs,0),V2(rs,len-n*pt-d));   /* rings of thread (drawn as turned grooves, not a helix), a chamfered tip */
      for(let i=0;i<n;i++){const a=len-(n-i)*pt-d;pr.push(V2(rs-d,a+pt/2),V2(rs,a+pt));}pr.push(V2(rs-d,len),V2(0,len));}
    else pr.push(V2(0,0));
    const g=new THREE.Group();g.position.set(x,y,z);p.add(g);loose(g,len+h+1.5);g.userData.sc={r,h,len,rs};
    const hd=mesh(g,new THREE.LatheGeometry(pr,28),M.steel);hd.userData.screw=r;const sl=mesh(g,new THREE.BoxGeometry(r*2.02,Math.min(0.55,h*0.45),Math.max(0.35,r*0.2)),M.steelD,0,-h+Math.min(0.55,h*0.45)/2-0.02,0);sl.rotation.y=(x*7+z*3)%3;return g;};
  const ring=ringGeo;R.ring=ring;
  const jewel=(p,x,z,[si,ji])=>{hn(mesh(p,ring(1.1,0.62,1.2),M.gilt,x,0.6,z),si);hn(mesh(p,stoneGeo(0.62,0.27,0.4,'bar'),M.ruby,x,0.2,z),ji);};   /* bar-hole jewel in the lower train bridge: a setting pressed through the bridge, the stone seated in it at the train side (its oil sink toward the dial); si, ji: their parts-list lines */
  /* endstone cap (42159, 42160): a steel plate over a setting with the cap jewel showing through its centre, two screws (20762) at ±2.1 mm along u into the part under it.
     Built in frame g with the part's face at y and the cap toward -y; depth: how far the screws go into the part */
  const endCap=(g,x,z,u,y,depth,sp,[ci,ji,si],rc,fl)=>{const a=[x-u[0]*sp,z-u[1]*sp],b=[x+u[0]*sp,z+u[1]*sp],H=[[x,z,0.55],hC(...a,ESCAP),hC(...b,ESCAP)];   /* ci, ji, si: the parts-list lines of the cap, its jewel and its screws; rc: a round cap of that radius; fl: [nx, nz, d], cut flat d from the jewel across that normal */
    hn(mesh(g,rc?polyGeo([...Array(64).keys()].map(k=>{const c=Math.cos(k*TAU/64),s=Math.sin(k*TAU/64),f=fl?(fl[0]*c+fl[1]*s)*rc-fl[2]:0,e=f>0?f:0;return[x+rc*c-(fl?fl[0]*e:0),z+rc*s-(fl?fl[1]*e:0)];}),0.3,H):stadium(a,b,1.6,0.3,H),M.steel,0,y-0.3,0),ci);hn(mesh(g,cylY(0.55,0.26,24),M.ruby,x,y-0.13,z),ji);   /* the endstone set in the cap, flush with its face on the hole jewel */
    for(const q of[a,b])hn(screw(g,...q,y-0.3,ESCAP,0.2,0.3+depth),si);};
  const y0=-PP_T;
  /* ---------- screw positions (x, z), worked out before the plates are cut: a clearance hole where a screw passes through a part (hC), a tapped hole where it holds (hT).
       42055 (pillar, bridge and mounting-ring screws) have heads r 2.9; ESCAP: the endstone caps' screws (20762) ---------- */
  const add=(a,b,k=1)=>[a[0]+b[0]*k,a[1]+b[1]*k],sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],unit=a=>{const l=Math.hypot(...a);return[a[0]/l,a[1]/l];},ry=(a,[x,z])=>[x*Math.cos(a)+z*Math.sin(a),-x*Math.sin(a)+z*Math.cos(a)];
  const eu=unit(sub(L.E,L.B)),lbu=unit(sub(L.F,L.B)),ESCAP=0.45,PSR=2.9;
  /* the escape upper bridge's length (ebu): 68 deg round from the balance-escape line, across it (KLUwI2UUCMQ 10:00, from above, and 13:44, where its screws land on the
     two lugs either side of the keyhole's escape lobe; to about 10 deg) */
  const ebu=(f=>[eu[0]*Math.cos(f)-eu[1]*Math.sin(f),eu[0]*Math.sin(f)+eu[1]*Math.cos(f)])(68*D2R);
  const ltu=unit(sub(L.F,L.T)),S={ltb:[add(L.T,ltu,-14),add(L.F,ltu,7.5)],ltbp:[add(L.T,ltu,-10),add(L.F,ltu,5)],pil:[...PILLARS.train,PILLARS.barrel],tb:PILLARS.train,bb:[PILLARS.barrel,PT([32.11,-4.1]),PT([-11.07,26.46])],
    ring:[100,210,340].map(a=>[40.6*Math.cos(a*D2R),40.6*Math.sin(a*D2R)]),eb:[8.0,-8.0].map(f=>add(L.E,ebu,f)),ebc:[3.1,-3.1].map(f=>add(L.E,ebu,f)),elc:[2.1,-2.1].map(f=>add(L.E,eu,f)),
    lb:[[18.34,12.02],[-14.2,19.0]],lbp:[[20.62,14.01],[-13.6,16.4]],blc:[1.9,-1.9].map(f=>add(L.B,lbu,f)),blk:(q=>add(L.B,ry(BETA,[q.x*ES,q.y*ES])))(ESC.D(...DBLK.s)),dpin:DBLK.p.map(([t,n])=>(q=>add(L.B,ry(BETA,[q.x*ES,q.y*ES])))(ESC.D(t,n))),cock:PT([33.11,12.62]),ckp:[[35.5,5.0],[26.9,19.8]].map(PT)};   /* cock screw: 0.3 mm off its traced position (within the tracing's 0.4 mm), so its thread cleared the old foot's edge.
     ckp: the cock's steady pins, at the two plain holes the train bridge shows under the cock with it off (C Spinner 6:47), placed to about 2 mm */
  /* lb: the balance lower bridge's screws (42055), put in from below through its lugs into the train bridge, where the restoration video has them (13:49.5, measured face-on): at the
     slab's end on the 3 o'clock side (outside every wheel, over the access hole in the pillar plate), and at the fourth end beyond the train-blocking screw (Fig. 30's order); lbp: its
     steady pins, one in each lug (tools/lower_bridge.py) */
  /* balance locking arm (42299, Fig. 9): its screw (37204, with washer 42251) in the train bridge under the balance, 10.6 mm from the staff, at -30 deg, where the
     bridge's notch round the fusee leaves it 2.8 mm of metal; at -60 deg it would stand in the notch */
  const ARM_S=0.8,ARM_U=-120*D2R,TBS_R=0.84,TB_CB=2.65;   /* ARM_U: the locking arm's swing from locked to unlocked, in the plan (x toward z) */   /* TB_CB: the train bridge's counterbore for its third screw (r, 23:30) */
  /* balance locking arm: its finger (S.armF) stands 15.6 mm from the staff on the counterclockwise side of the timing weight that rests on the 6 o'clock side (at 180 + 12 deg
     - BETA with the balance at rest), 0.02 clear of it; the arm turns on its screw (S.arm) outside the balance's sweep, back over the screw 120 deg (ARM_U) to its stop pin (42300, pressed into the train bridge): turned 90 deg
     the other way, out from the staff, it would reach the cock and the second train pillar's screw head, which the photographed group's move brought beside it (estimated:
     Fig. 9 shows the arm, not which way it turns) */
  { const TWA=Math.PI+2/60*TAU-BETA,FR=15.6,FA=TWA+Math.asin(1.62/FR)+0.02/FR;S.armF=add(L.B,[Math.cos(FA),Math.sin(FA)],FR);S.arm=add(L.B,[Math.cos(TWA+18*D2R),Math.sin(TWA+18*D2R)],20);
    /* unlocked, turned ARM_U from its locked direction (dU). The stop pin stands on the arm's leading side
       1.5 along it, clear of its bow (0.6 at mid-length, away from the staff) */
    const dot=(a,b)=>a[0]*b[0]+a[1]*b[1],dL=unit(sub(S.armF,S.arm)),rp=v=>[-v[1],v[0]],rm=v=>[v[1],-v[0]],dU=[dL[0]*Math.cos(ARM_U)-dL[1]*Math.sin(ARM_U),dL[0]*Math.sin(ARM_U)+dL[1]*Math.cos(ARM_U)],n=ARM_U<0?rm(dU):rp(dU),AE=Math.hypot(...sub(S.armF,S.arm))+0.45,
      bowOut=-Math.sign(dot(sub(L.B,S.arm),rp(dL))),bowU=dot(rp(dU),n)*bowOut;   /* the bow's side, locked (local +z = rp(dL)) and then unlocked (local +z = rp(dU)) */
    S.armPin=add(add(S.arm,dU,1.5),n,0.82+Math.max(0,bowU)*0.6*Math.sin(Math.PI*1.5/AE)); }
  /* train-blocking screw (42247): over the fourth wheel's spokes, 4.5 mm from its arbor; the restoration video has its dog point between the fourth's setting and the far lug, where
     the model's detent stands, so it is on the detent's other side, in a column of the balance lower bridge of its own (the access hole in the train bridge is countersunk,
     Sec. II). TBd: from the arbor toward it */
  S.tBlock=[3.9,26.15];const TBd=unit(sub(S.tBlock,L.F)),TBr=Math.hypot(...sub(S.tBlock,L.F));
  const EPa=Math.atan2(-0.24,-5.83)-PHOTO_TURN,EPu=ry(EPa,[1,0]),EP=[[2.75,0],[-2.75,0]];S.ep=EP.map(q=>add(L.B,ry(EPa,q)));   /* balance upper endstone cap: along the cock's straight edge (x toward the nose), its screws 2.75 either side of the staff (top-view photograph) */
  const PB=(r,a)=>[L.Ba[0]+PHOTO_K*r*Math.cos(a*D2R+PHOTO_TURN),L.Ba[1]+PHOTO_K*r*Math.sin(a*D2R+PHOTO_TURN)];S.cover=[PB(11.1,107),PB(11.6,288)];S.click=PB(8.9,250.6);
  S.dial=[38.5,111.6,218.5,291.6].map(a=>{const q=PT([45.9*Math.cos(a*D2R),45.9*Math.sin(a*D2R)]),l=Math.hypot(...q);return[45.9*q[0]/l,45.9*q[1]/l];});   /* four dial feet and screws (35756, 4; Fig. 107), in the mounting ring's flange outside the plate: the top-view photographs show two, at 38.5 and 111.6 deg; the other two opposite them (estimated) */
  S.seal=[2.2,-1.0].map(a=>[L.Fu[0]+PHOTO_K*7.6*Math.cos(a+PHOTO_TURN),L.Fu[1]+PHOTO_K*7.6*Math.sin(a+PHOTO_TURN)]);
  /* ---------- pillar plate 87.57 x 3.86 mm, mounting ring, lower train bridge ---------- */
  const pp=part('pillar',0);
  /* sustaining pawl pivot: 0.93 mm outside the fusee wheel's tips (so the pawl reaches the sustaining ratchet, and its arbor, r 0.7, clears the tips), where it can run up to solid train bridge
     (manual Sec. VIII, Op. 15 note) clear of the centre wheel, the chain and the opening round the balance */
  const SPr=(TRAIN.fu+2)*MOD.fusee/2+0.93,SPv=[L.Fu[0]+SPr*Math.cos(60*D2R+PR_TURN),L.Fu[1]+SPr*Math.sin(60*D2R+PR_TURN)];
  R.pillarPlate=mesh(pp,discGeo(PP_R,PP_T,[[...L.C,1.5],[...L.T,6.0],...S.ltbp.map(q=>[...q,0.41]),[...L.F,1.2],[...L.Fu,1.4],hC(...L.Ud,0.8),hC(...L.Mw,0.8),[...L.Ba,1.9],[...L.E,1.3],[...SPv,0.52],
    ...S.ltb.map(q=>hT(...q,1.4)),...S.pil.map(q=>hC(...q,PSR)),...S.ring.map(q=>hC(...q,PSR)),...S.elc.map(q=>hT(...q,ESCAP)),[...S.lb[0],3.4]]),M.plate,0,y0,0);hn(pp,'42060');   /* the plate's parts-list line on its part, so its pins go with it */
  /* the last hole: access to the balance lower bridge's screw at 3 o'clock, for taking the bridge off without taking the movement down (RMG No. 4E019), under the dial */
  /* lower bushings and settings in the pillar plate (parts list, Fig. 110): centre, fusee, barrel; escape lower jewel. Proud 0.1 on the train side */
  const bushR=(p,x,z,y1,y2,ro,ri,mat)=>mesh(p,ringGeo(ro,ri,Math.abs(y2-y1)),mat||M.brass2,x,(y1+y2)/2,z);
  /* a bushing with an oil sink, a 90 deg cone round the bore in its face at y2 (y2 > y1), its outside 0.65 of the bushing's radius and at least 0.25 past the bore
     (C Spinner 37:59, 38:02: the fusee's and barrel's bushings on the dial side; the oiling, Ops. 43, 46-49) */
  const bushS=(p,x,z,y1,y2,ro,ri,mat)=>{const rs=Math.max(0.65*ro,ri+0.25),V=(a,b)=>new THREE.Vector2(a,b);
    return mesh(p,new THREE.LatheGeometry([V(ri,y2-(rs-ri)),V(rs,y2),V(ro,y2),V(ro,y1),V(ri,y1),V(ri,y2-(rs-ri))].reverse(),48),mat||M.brass2,x,0,z);};
  hn(bushR(pp,...L.C,y0-0.1,0,1.5,0.52),'42165');hn(bushS(pp,...L.Fu,y0-0.1,0,1.4,0.58),'42164.fl');hn(bushS(pp,...L.Ba,y0-0.1,0,1.9,1.43),'42164.bl');hn(bushR(pp,...L.E,y0-0.1,0,1.3,0.95,M.gilt),'42162.el');hn(mesh(pp,stoneGeo(0.95,0.22,0.5,'olive'),M.ruby,L.E[0],-0.25,L.E[1]),'J.el');   /* escape lower setting (42162) with its olive-hole jewel, flush with the plate's dial face under the endstone */
  /* mounting ring (42057, Figs. 29, 67, 110: a deep ring under the plate, drawn cut), lacquered brass (Sec. VI): a band as wide as the plate under its dial side, then a flange
     that stands out round it and carries the dial (the side photograph; "the dial or the movement [may] shift on the mounting ring", the note at Op. 98, Sec. VIII); from the dial side the plate lies
     sunk in it. Three screws (42055) hold the plate to it from the train side: the plate is laid on the ring and the screws put in (reassembly Op. 1; Fig. 29 draws them above
     the plate), and the top-view photographs show one on the plate at the rim at 6 o'clock, half under the train bridge; the others under the bridges, at 210 and 340 deg,
     estimated. The band has a tab inward under each, tapped for it. Bore and tabs estimated (the bore from the dial-side photograph). Both pieces start 0.01 off the faces they meet */
  { const RA=[100,210,340].map(a=>a*D2R),dA=a=>Math.min(...RA.map(b=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b))))),rin=a=>{const t=clamp((dA(a)-0.07)/0.05,0,1);return lerp(38.4,MR_RI,smooth(t));};
    const circ=(r,n)=>[...Array(n).keys()].map(k=>{const a=k/n*TAU;return[r*Math.cos(a),r*Math.sin(a)];}),inner=[...Array(360).keys()].map(k=>{const a=k/360*TAU;return[rin(a)*Math.cos(a),rin(a)*Math.sin(a)];});
    R.flange=hn(mesh(pp,polyGeo(circ(PP_R,160),MR_FL-0.01,[{pts:inner},...S.ring.map(q=>hT(...q,PSR))]),M.brass,0,0.01,0),'42057');   /* the band, with its tabs */
    hn(mesh(pp,polyGeo(circ(MR_RO,160),MR_Y-MR_FL,[{pts:circ(MR_RI,160)},...S.dial.map(q=>[...q,0.8])]),M.brass,0,MR_FL,0),'42057',{sub:1});   /* the flange, bored for the dial's feet */
    /* the alignment pin, "protruding beyond the movement" into its slot in the edge of the case (Sec. III): pressed into the flange's edge, at 12 o'clock (estimated) */
    const ap=hn(mesh(pp,cylY(0.5,0.8,12),M.steel,0,(MR_FL+MR_Y)/2,-(MR_RO+0.4)),'42057',{sub:1});ap.rotation.x=Math.PI/2; }
  for(const q of S.ring)hn(screw(pp,...q,y0,PSR,1.6,PP_T+1.8),'42055.ring');   /* through the plate into the band's tab */
  { const rg=new THREE.Group();rg.rotation.x=Math.PI;pp.add(rg);
    /* the pillars' screws (42055) from the dial side, through the plate into the pillars (Fig. 110) */
    S.pil.forEach((q,i)=>hn(screw(rg,q[0],-q[1],0,PSR,1.6,3.86+3.2),i<3?'42055.pil':'42055.pilb'));
    /* escape lower endstone cap (42159) with its jewel and two screws (20762), on the dial side over the escape lower setting (Fig. 110) */
    endCap(rg,L.E[0],-L.E[1],[eu[0],-eu[1]],0,3.86-0.4,2.1,['42159.el','J.ele','20762.elc']); }
  /* lower train bridge (42063) on the dial side of the pillar plate, screwed from the dial side (Figs. 29, 30, 31, 67, 110): a straight steel bar with square ends across an
     opening in the plate round the third arbor (Figs. 30, 31; the third wheel shows through it in a photograph of a Model 21's dial side), the third and fourth lower settings
     inboard and a screw toward each end (Fig. 31 and that photograph: the screws about 2.9 times as far apart as the settings), and two steady pins ("complete with pins").
     Its length, width, the screws' and pins' places along it and the opening's size are estimated from those two views */
  const lt=part('ltb',8),LTe=[add(L.T,ltu,-21),add(L.F,ltu,9.6)],ltn=[-ltu[1]*3,ltu[0]*3],LTP=[add(LTe[0],ltn),add(LTe[1],ltn),sub(LTe[1],ltn),sub(LTe[0],ltn)];
  R.ltb=mesh(lt,polyGeo(LTP,1.2,[[...L.T,1.1],[...L.F,1.1],...S.ltb.map(q=>hC(...q,1.4)),...S.ltbp.map(q=>[...q,0.4])]),M.steel,0,0,0);hn(lt,'42063');
  for(const q of S.ltbp)hn(cylBetween(lt,0.4,-1.0,1.2,M.steel,...q,12),'42063',{sub:1});   /* its steady pins, into the plate */
  const ltf=new THREE.Group();ltf.rotation.x=Math.PI;lt.add(ltf);jewel(lt,...L.F,['42161.fl','J.fl']);jewel(lt,...L.T,['42161.tl','J.tl']);
  for(const q of S.ltb)hn(screw(ltf,q[0],-q[1],-1.2,1.4,0.8,1.2+3.46),'42163');   /* two screws (42163; Ops. 7, 53) into the pillar plate */
  /* ---------- pillars (two measured on Fig. 2, two placed clear of the fusee wheel and balance) ---------- */
  const pl=part('pillars',-30);
  /* tapped at both ends: for its screw from the dial side through the pillar plate, and for the bridge screw at its top (3.5 mm deep) */
  /* profile measured side-on on a restoration video (References/VIDEOS.md, KLUwI2UUCMQ 42:56, scaled by the pillar's 16.8 mm): a straight shaft r 2.7 with a collar at each end, the foot r 2.9 over 3.3 mm and the top r 3.3 over 3.4 mm */
  const pillar=(x,z,top)=>{const hb=hT(0,0,PSR)[2],pr=[V2(0,y0-3.5),V2(hb,y0-3.5),V2(hb,y0),V2(2.9,y0),V2(2.9,y0-3.3),V2(2.7,y0-3.3),V2(2.7,top+3.4),V2(3.3,top+3.4),V2(3.3,top),V2(hb,top),V2(hb,top+3.5),V2(0,top+3.5)].reverse();
    return mesh(pl,new THREE.LatheGeometry(pr,32),M.plateSolid,x,0,z);};
  /* the barrel pillar (42058), up to the barrel bridge: not the train pillars' shape. On C Spinner's video (13:06, 13:36, 37:45: standing beside the barrel, scaled by the
     barrel's top) a flared foot (r 3.3), a shaft narrowing to r 2.2 about 6 mm up and widening to a body r 3.0 with a groove 11.6 mm up, and a boss r 1.75 on its top, tapped for the barrel
     bridge's screw; read by eye on 13:06, scaled by its own 19.9 mm height, to about 15 % */
  const bPillar=(x,z,top)=>{const hb=hT(0,0,PSR)[2],h=d=>y0-d,pr=[V2(0,y0-3.5),V2(hb,y0-3.5),V2(hb,y0),V2(3.3,y0),V2(3.0,h(0.8)),V2(2.5,h(2.5)),V2(2.2,h(6.3)),V2(2.6,h(9)),V2(2.9,h(11.6)),V2(2.75,h(11.6)),V2(2.75,h(11.9)),
      V2(3.0,h(11.9)),V2(3.0,h(18.6)),V2(1.75,h(18.6)),V2(1.75,top),V2(hb,top),V2(hb,top+3.5),V2(0,top+3.5)].reverse();return mesh(pl,new THREE.LatheGeometry(pr,32),M.plateSolid,x,0,z);};
  PILLARS.train.forEach(([x,z])=>hn(pillar(x,z,TB_U),'42059'));hn(bPillar(...PILLARS.barrel,TB_T),'42058');
  /* ---------- upper train bridge (y TB_T..TB_U) and barrel bridge (y BB_T..TB_T). The barrel bridge sits on the train bridge and is cut around the
               balance. The train bridge is the crescent of Figs. 29, 67 and 110, its notch and horn measured on a restoration video (tools/train_bridge.py): the disc less a cut round
               the barrel and a notch round the fusee, open to the rim, with a horn between them that carries the centre wheel's upper bushing; the barrel
               pillar stands in the open notch. Its keyhole opening frees the balance's staff and rollers and the escape arbor ---------- */
  const tb=part('trainBridge',-62);
  const TBpoly=clipPoly(crescent(BR_R,TB_CUT,TB_CR,TB_EDGE),p=>{const[a,b]=TB_END,c=(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]);return Math.max(-c,p[0]+30);});   /* cut round the barrel, which rises past the train bridge to the barrel bridge (Figs. 108, 110); measured on the video, 22.56 mm out, it is where the barrel stands */
  R.trainBridge=mesh(tb,polyGeo(TBpoly,3.1,[[...L.C,1.2,1],[...L.T,1,1],{pts:TB_KEY},[...SPv,0.52,1],
    hC(...S.tb[0],PSR),hC(...S.tb[1],PSR),[...S.tb[2],TB_CB,1],hT(...S.bb[1],PSR),hT(...S.bb[2],PSR),...S.eb.map(q=>hT(...q,0.9)),...S.lb.map(q=>hT(...q,PSR)),...S.lbp.map(q=>[...q,0.42,1]),hC(...S.blk,0.9),...S.dpin.map(q=>[...q,0.42,1]),hT(...S.cock,2.8,0.8),...S.ckp.map(q=>[...q,0.42,1]),
    hT(...S.arm,ARM_S),[...S.tBlock,0.72,1],[...S.armPin,0.3,1]],0.22),M.plate,0,TB_T,0);hn(tb,'42062');
  {const C=PT([10.53,35.06]),A=PT([-0.9764,0.2161]),P=PT([0.2161,0.9764]),q=(a,p)=>[C[0]+a*A[0]+p*P[0],C[1]+a*A[1]+p*P[1]];   /* decal only round the serial, so it can't catch picks over the bridge's openings */
    const eg=mesh(tb,decalGeo([q(-5.5,-1.8),q(5.5,-1.8),q(5.5,1.8),q(-5.5,1.8)],PTi),M.engraveT,0,TB_T-0.02,0);eg.userData.noShadow=true;eg.userData.noCap=true;eg.userData.decal=true;}
  /* three pillar screws (42055), each into its pillar (Op. 14); the third at the end of the tongue beside the notch's mouth, in the hole C Spinner's video shows there (23:30, a
     counterbore 5.3 mm across; 36:26), its head sunk in it, flush, where the top-view photograph shows it below a clearance hole in the barrel bridge, and driven down into
     its pillar (36:34). Its head (r 2.5, to fit the counterbore) and the counterbore's depth are estimated */
  S.tb.forEach(([x,z],i)=>hn(i<2?screw(tb,x,z,TB_T,PSR,1.6,3.1+3.0):screw(tb,x,z,TB_T+1.6,2.5,1.6,3.1-1.6+3.0,sR(PSR)),'42055.tb'));
  hn(mesh(tb,ringGeo(TB_CB-0.01,hC(0,0,PSR)[2],3.1-1.6),M.plate,S.tb[2][0],TB_T+1.6+(3.1-1.6)/2,S.tb[2][1]),'42062',{sub:1});   /* the counterbore's floor, the screw clear through it */
  /* detent support block screw (42056): from above, through the train bridge into a tapped hole in the block's top, between its two positioning pins (Sec. II; Figs. 14, 22, 84;
     Op. 81, with the train side up; KLUwI2UUCMQ 10:45, 11:08). Nothing stands over it: the barrel bridge's horn, which covered it before the photographed group's turn, is clear */
  hn(screw(tb,...S.blk,TB_T,0.9,0.5,3.1+2.4),'42056.blk');
  /* centre and third upper bushings in the train bridge (42166, 42167); they lie in the opening round the balance, so they can be oiled with the barrel bridge on (Sec. VIII, Op. 46) */
  hn(bushR(tb,...L.C,TB_T-0.1,TB_U,1.2,0.52),'42166');hn(bushR(tb,...L.T,TB_T-0.1,TB_U,1.0,0.32),'42167');   /* bored for the pivots (r 0.5, 0.3), 0.02 side shake */
  /* balance wheel locking arm (42299, Fig. 9; fitted from 1947, Bureau of Ships sketch 023263): a curved arm on the train bridge, turning on its shouldered screw (37204) and
     washer (42251) outside the balance's sweep. Locked, the finger at its end stands on the counterclockwise side of a timing weight, which the hairspring holds lightly
     against it, and a balance screw 39 deg round stops the balance the other way ("place the locking arm over the timing weight", Sec. X); unlocked, it lies turned out
     against its stop pin (42300), clear of everything the balance carries. Fig. 9 shows the arm curved, its screw outside the rim and its end at a timing weight; the arm's
     sizes, the screw's place and the finger's height (1.65 mm, to 0.76 mm up the weight) are estimated. R.arm turns: rotation.y = armL locked, armL + armU unlocked */
  { const ap=part('lockArm',-62),dA=sub(S.armF,S.arm),AL=Math.hypot(...dA),dL=unit(dA),AE=AL+0.45;R.armL=Math.atan2(-dL[1],dL[0]);
    const f9=new THREE.Group();ap.add(f9);R.armF9=f9;   /* the manual's arm, its screw, washer and stop pin: hidden together when the Navy's Y-arm is fitted instead (below) */
    R.armU=-ARM_U;R.arm=new THREE.Group();R.arm.position.set(S.arm[0],TB_T,S.arm[1]);f9.add(R.arm);R.arm.rotation.y=R.armL+R.armU;
    const bw=-0.6*Math.sign((L.B[0]-S.arm[0])*-dL[1]+(L.B[1]-S.arm[1])*dL[0]),cl=t=>[t*AE,bw*Math.sin(Math.PI*t)],N=14,side=k=>[...Array(N+1).keys()].map(i=>{const t=i/N,[x,z]=cl(t);return[x,z+k*0.5];});   /* a strip 1.0 wide, bowed 0.6 away from the staff */
    hn(R.arm,'42299');mesh(R.arm,polyGeo(subtractCircle([...side(1),...side(-1).reverse()],[0,0],1.1,true),0.45,[hC(0,0,ARM_S)]),M.blued,0,-0.45,0);
    cylBetween(R.arm,0.4,-0.45,-2.85,M.steel,AL,0,16);   /* the finger, 2.4 tall: 0.56 up the timing weight */
    hn(mesh(f9,ringGeo(1.1,hC(0,0,ARM_S)[2],0.15),M.steel,S.arm[0],TB_T-0.525,S.arm[1]),'42251.arm');hn(screw(f9,...S.arm,TB_T-0.6,ARM_S,0.35,0.15+0.45+2.5),'37204');
    hn(cylBetween(f9,0.3,TB_T+0.8,TB_T-0.8,M.steel,...S.armPin),'42300');
    /* the Navy's other balance stop (illustrative; Variants): a post on the barrel bridge, capped with packing rings as the fusee's dust seal is, and a Y-shaped arm from
       under its cap over the balance, a short pin under each end over the rim, the ends nearly opposite each other. As on serial 2E11795 (References/photo-top-view.jpg;
       others on omegaforums and Delaney No. 8854; Review-results.md, BOM comparison 8): its shape and place mapped from the photograph through the barrel bridge's five
       screws (tools/topview.py's fit), corrected 1 mm for the photograph's tilt at the arm's height and 2.9 mm at the cap's, to about 1.5 mm. The manual doesn't describe
       it (its "balance stop", Sec. I, is Fig. 9's arm above), so how it works is a guess: the cap pressed from outside the case, the arm comes down until its pins bear on
       the rim, as the wedges did (Sec. III). Its heights are chosen to clear the balance, the hairspring and the cock. R.navyArm moves: position.y 0 free, 0.48 locked */
    const nv=new THREE.Group();nv.visible=false;ap.add(nv);R.navy=nv;const NP=[-6.69,-19.16],ya=-31.9,PB=(p,r)=>{const d=[p[0]-L.B[0],p[1]-L.B[1]],l=Math.hypot(...d);return l>=r?p:[L.B[0]+d[0]/l*r,L.B[1]+d[1]/l*r];};
    cylBetween(nv,1.6,BB_T,-32.56,M.plateSolid,...NP,32);
    for(let k=0;k<3;k++){const a=-32.56-1.733*k,b=a-1.733;mesh(nv,new THREE.LatheGeometry([V2(1.6,a),V2(6.2,a),V2(6.45,a-0.22),V2(6.45,b+0.22),V2(6.2,b),V2(1.6,b),V2(1.6,a)].reverse(),56),M.brass2,NP[0],0,NP[1]);}
    const na=new THREE.Group();nv.add(na);R.navyArm=na;
    const fork=[-1.8,0.02],LE=PB([14.67,5.64],0),RT=(d=>[L.B[0]+d[0]*13.95,L.B[1]+d[1]*13.95])(unit(sub([-13.11,13.65],L.B))),r0=[-5.56,-12.0],e0=add(NP,unit(sub(r0,NP)),1.9),arms=[[e0,r0,fork],[fork,PB([4.59,2.19],7.0),PB([11.45,4.69],7.0),LE],[fork,PB([-4.92,3.21],7.0),PB([-9.49,8.98],7.0),RT]];
    arms.forEach((pts,i)=>mesh(na,stripGeo(pts,i?1.5:2.2,0.45),M.steel,0,ya,0));mesh(na,ringGeo(2.4,1.62,0.45),M.steel,NP[0],ya+0.225,NP[1]);   /* the arm's eye round the post */
    for(const q of[LE,RT])cylBetween(na,0.3,ya+0.45,BAL_Y+1.2-2*2.15-0.5,M.steel,...q,16);   /* the pins, 0.5 over the rim's top when free */ }   /* 0.8 into the bridge */
  /* escape upper bridge with jewel and endstone cap */
  const eb=part('escBridge',-66);
  /* the escape upper bridge (42064; Figs. 84, 110; KLUwI2UUCMQ 10:00): a straight bar, round-ended, across the escape lobe with a screw near each end, symmetric about the
     setting, which sits in a round boss under the endstone cap. Its end screws 8.0 mm either side of the jewel, the cap's 3.1 (about 2.6 times as far, on the frame), scaled
     by the frame's fit to about 10 %; the bar's width and the boss's size are read off the same frame against that spacing */
  R.escBridge=mesh(eb,polyGeo(barBossPts(L.E,ebu,22,4.0,4.5),0.9,[[...L.E,1.6],...S.eb.map(q=>hC(...q,0.9)),...S.ebc.map(q=>hT(...q,ESCAP))]),M.plate,0,TB_T-0.9,0);hn(eb,'42064');
  for(const q of S.eb)hn(screw(eb,...q,TB_T-0.9,0.9,0.3,0.9+2.0),'20762.eb');   /* two screws (20762; Op. 22) into the train bridge; low heads, 0.14 mm clear of the balance rim and timing weights that pass over them */
  /* escape upper setting (42162: gilt setting, pierced jewel) pressed into the bridge, and the endstone cap (42159) over it with its two screws (Fig. 110) */
  hn(mesh(eb,ring(1.6,0.95,0.9),M.gilt,L.E[0],TB_T-0.45,L.E[1]),'42162.eu');hn(mesh(eb,stoneGeo(0.95,0.22,0.5,'olive'),M.ruby,L.E[0],TB_T-0.65,L.E[1]),'J.eu');endCap(eb,...L.E,ebu,TB_T-0.9,0.8,3.1,['42159.eu','J.eue','20762.euc'],4.4);   /* a round cap (10:00), on the boss */
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
  S.bb.forEach((q,i)=>hn(screw(bb,...q,BB_T,PSR,1.6,[3.4+3.0,3.4+2.6,3.4+2.6][i]),i?'42055.bb':'42055.bbp'));   /* the pillar's screw, and two into the train bridge (the parts list: "Screw - Barrel bridge", to the train bridge) */
  const eg2=mesh(bb,decalGeo(BBpoly,PTi),M.engraveB,0,BB_T-0.02,0);eg2.userData.noShadow=true;eg2.userData.noCap=true;eg2.userData.decal=true;
  const Fl=Math.hypot(...L.Fu),fo=[L.Fu[0]/Fl,L.Fu[1]/Fl];
  /* ---------- dial (on the mounting ring's flange), hands, motion work ---------- */
  const dl=part('dial',32);
  hn(dl,'42030');mesh(dl,discGeo(DIAL_R,DIAL_T,[[...L.C,2.5],[...L.F,1.2],[...L.Ud,1.2]]),M.brass2,0,MR_Y,0);
  const dtex=new THREE.CanvasTexture(dialCanvas());dtex.encoding=THREE.sRGBEncoding;dtex.anisotropy=8;
  /* the face lies 0.02 above the brass disc's top; polygon offset keeps it in front in the depth buffer, else the brass shows through in streaks when zoomed out */
  const dface=mesh(dl,new THREE.RingGeometry(2.5,DIAL_R,128,1).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({map:dtex,metalness:0.35,roughness:0.42,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),0,MR_Y+DIAL_T+0.02,0);dface.userData.noCap=true;dface.userData.surface=true;
  /* four feet down into the ring's flange, each held by a dial screw (35756, Fig. 107) from the flange's train side into its tapped end */
  for(const q of S.dial){const fb=MR_FL+1.4;mesh(dl,new THREE.LatheGeometry([V2(0,fb+2.0),V2(hT(0,0,1.1)[2],fb+2.0),V2(hT(0,0,1.1)[2],fb),V2(0.75,fb),V2(0.75,MR_Y),V2(0,MR_Y)],20),M.brass,...[q[0],0,q[1]]);hn(screw(pp,...q,MR_FL,1.1,0.5,1.4+1.8),'35756');}
  const hd=part('hands',48),hg=new THREE.MeshStandardMaterial({color:sc(0xd9b25e),metalness:1,roughness:0.2}),hb=new THREE.MeshStandardMaterial({color:sc(0x7a6240),metalness:1,roughness:0.45});   /* hg gilt (Roman), hb aged gilt (Soviet) */
  /* Hamilton hands as on the photographed dial: blued hour hand with a bulb two-thirds out and a long spear point, plain minute hand to the track, a long seconds hand with a spear counterpoise */
  const dk=(o,k,...more)=>{const g=new THREE.Group();g.userData.dk=k;o.parent.add(g);for(const m of[o,...more])g.add(m);return o;};   /* hands of one dial style ('hamilton', 'roman', 'swiss' or 'soviet'), each with its collet, grouped so app.js's per-mesh visibility leaves the choice alone */
  /* hour hand: a round hole, pressed on the hour wheel's pipe, its collet below the blade and inside its boss, clear of the seconds hand's tip (r 2.9 at :00) (Op. 64, broached with Tool 40); minute hand: a square hole ("broached with a square file"), seated on the cannon pinion's shoulder under its square, its collet above the blade */
  R.hour=new THREE.Group();R.hour.position.y=5.2+DD;hd.add(R.hour);R.min=new THREE.Group();R.min.position.y=5.75+DD;hd.add(R.min);
  const HO={boss:2.9,bore:2.33},MO={boss:3.2,sq:2.44},hcol=m=>mesh(R.hour,ringGeo(2.7,2.33,0.6),m,0,-0.3,0),mcol=m=>mesh(R.min,sqRingGeo(3.2,2.44,0.8),m,0,0.75,0);
  hn(dk(mesh(R.hour,handGeo(41*DK,1.2,2.5,'pear',0.68,HO),M.blued),'hamilton',hcol(M.blued)).parent,'42032');hn(dk(mesh(R.min,handGeo(48.5*DK,1.5,3,'plain',0,MO),M.blued),'hamilton',mcol(M.blued)).parent,'42033');   /* the hands' parts-list lines on the Hamilton dial's hands (the other styles are variants). Lengths against the photographed dial's tracks (References/photo-dial-hamilton-maritime-commission.jpg): the minute hand to the track's outer edge, the hour hand 0.84 of it, the seconds hand 0.99 of its track's outer circle, the wind hand 0.95 of its scale's */
  dk(mesh(R.hour,handGeo(29*DK,1.3,6,'leaf',0,HO),hg),'roman',hcol(hg));dk(mesh(R.min,handGeo(45*DK,0.9,8,'lance',0,MO),hg),'roman',mcol(hg));
  R.sec=new THREE.Group();R.sec.position.set(L.F[0],4.35+DD,L.F[1]);   /* sub-dial hands under the hour hand's sweep (5.2+DD) */hd.add(R.sec);hn(dk(mesh(R.sec,handGeo(21.7*DK,0.5,-10,'plain'),M.blued,0,0.25,0),'hamilton'),'42034');dk(mesh(R.sec,handGeo(16.5*DK,0.55,4,'plain'),M.blued,0,0.25,0),'roman');hn(mesh(R.sec,ringGeo(0.9,0.26,0.6),M.blued,0,-0.05,0),'42034',{sub:1});   /* the collet pressed on the fourth arbor's pivot, flush with its end; the blade on it */
  R.ud=new THREE.Group();R.ud.position.set(L.Ud[0],4.35+DD,L.Ud[1]);hd.add(R.ud);hn(dk(mesh(R.ud,handGeo(12.3*DK,0.6,2.5,'plain'),M.blued,0,0.25,0),'hamilton'),'42035');dk(mesh(R.ud,handGeo(10*DK,0.6,2.5,'leaf'),hg,0,0.25,0),'roman');hn(mesh(R.ud,ringGeo(0.9,0.56,0.4),M.blued,0,0.05,0),'42035',{sub:1});   /* the collet pressed on its wheel's pin */
  /* Nardin-pattern dials: pear hands (blued, or aged gilt on the Soviet copies); a long thin seconds hand to the track with a spear counterpoise */
  for(const[k,m]of[['swiss',M.blued],['soviet',hb]]){dk(mesh(R.hour,handGeo(31*DK,1.4,6,'pear',0,HO),m),k,hcol(m));dk(mesh(R.min,handGeo(46.5*DK,0.9,8,'pear',0,MO),m),k,mcol(m));
    dk(mesh(R.sec,handGeo(19*DK,0.45,-8,'plain'),M.blued,0,0.25,0),k);dk(mesh(R.ud,handGeo((k==='swiss'?11.5:8.5)*DK,0.6,2.5,'plain'),M.blued,0,0.25,0),k);}
  const DTEX={hamilton:dtex};hd.traverse(o=>{if(o.userData.dk&&o.userData.dk!=='hamilton')o.visible=false;});
  mv.userData.dial=kind=>{if(!DTEX[kind]){const t=DTEX[kind]=new THREE.CanvasTexture(dialCanvas(kind));t.encoding=THREE.sRGBEncoding;t.anisotropy=8;}
    const m=dface.userData.mat0||dface.material;m.map=DTEX[kind];m.needsUpdate=true;hd.traverse(o=>{if(o.userData.dk)o.visible=o.userData.dk===kind;});};   /* the face's own material (app.js may be showing a see-through or faded copy of it, which follows on the next look()) */
  const mw=part('motion',16);
  /* the cannon pinion, a friction fit on the centre arbor (Op. 58) that slips when the hands are set: its pipe runs up through the hour wheel and dial to the shoulder the minute hand sits on (5.75+DD), and ends in the
     bright square the winding key sets the hands by (Fig. 8, Sec. III), 2.4 across as the fusee's, so one key fits both, 1.6 proud of the minute hand's collet. The hour wheel goes on over it and turns free on the pipe (Op. 59) */
  R.cannon=hn(arbor(mw,M,...L.C,{pin:{n:MW.cp,m:MWM.a,y:1.2,th:2,bore:0.5}}),'42077');mesh(R.cannon,ring(1.7,0.5,5.45+DD),M.steel,0,3.025+DD/2,0);mesh(R.cannon,new THREE.BoxGeometry(2.4,2.9,2.4),M.steel,0,7.05+DD,0);
  /* the winding key on the square, turned by its shank to set the hands (Fig. 8): shown only while setting, when the bezel is off */
  R.hkey=new THREE.Group();R.hkey.visible=false;R.cannon.add(R.hkey);mesh(R.hkey,sqRingGeo(2.6,2.46,5),M.brass,0,9.45+DD,0);cylBetween(R.hkey,1.7,11.95+DD,40.5+DD,M.brass);
  { const kb=mesh(R.hkey,new THREE.CylinderGeometry(2.4,2.4,26,20),M.brass,0,42.5+DD,0);kb.rotation.x=Math.PI/2;for(const z of[13,-13])mesh(R.hkey,new THREE.SphereGeometry(2.4,18,12),M.brass,0,42.5+DD,z);mesh(R.hkey,new THREE.SphereGeometry(3.4,18,12),M.brass,0,42.5+DD,0); }
  /* the minute wheel and the wind indicator wheel turn on posts (42085, 42084) fixed to the pillar plate by screws (35779) from its train side (Fig. 110) */
  const post=(x,z,r,top,k)=>{const hr=hT(0,0,0.8)[2];hn(mesh(pp,new THREE.LatheGeometry([V2(0,2.0),V2(hr,2.0),V2(hr,0),V2(r,0),V2(r,top),V2(0,top)],24),M.steel,x,0,z),k[0]);hn(screw(pp,x,z,y0,0.8,0.4,PP_T+1.8),k[1]);};
  post(...L.Mw,0.7,3.2,['42085','35779.mw']);post(...L.Ud,0.5,4.1,['42084','35779.ud']);
  R.minW=arbor(mw,M,...L.Mw,{wheel:{n:MW.mw,m:MWM.a,y:1.2,th:0.8,spokes:0,collet:0,bore:0.72,mate:MW.cp},pin:{n:MW.mp,m:MWM.b,y:2.4,th:1.6,bore:0.72}});mesh(R.minW,ring(1.6,0.72,2.0),M.brass2,0,1.2,0);hn(R.minW,'42078');
  R.hourW=hn(arbor(mw,M,...L.C,{wheel:{n:MW.hw,m:MWM.b,y:2.65,th:0.8,spokes:0,collet:0,bore:1.75,hub:2.6,mate:MW.mp}}),'42080');mesh(R.hourW,ring(2.3,1.75,2.9+DD),M.brass2,0,4.1+DD/2,0);   /* its pipe carries the hour hand; 0.05 clear of the cannon pinion's leaves, which turn twelve times as fast */
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
  hn(R.ssg,'42016');R.sspring=mesh(R.ssg,sspGeo(0),M.blued,0,-8.75,0);
  mesh(R.ssg,cylY(0.4,1.5,10),M.steel,SSH[0][0],-8.1,SSH[0][1]);
  /* sustaining ratchet wheel (42009): free on the fusee arbor, open in the middle round the fusee's winding ratchet and its screws (Fig. 28) */
  const srP=part('sratchet',-22);R.sr=new THREE.Group();R.sr.position.set(L.Fu[0],0,L.Fu[1]);srP.add(R.sr);
  const WPR=12.1*FK,WPF=[2.44,2.62],WPS=[0,1].map(k=>{const a=k*Math.PI+0.4;return WPF.map(t=>[WPR*Math.cos(a+t),WPR*Math.sin(a+t)]);});   /* the winding pawl springs' screws, at their feet about 150 deg round from their pawls */
  hn(R.sr,'42009');hn(mesh(R.sr,gearGeo(SRT.z,SRT.m,0.7,{ratchet:true,flip:true,bore:5*FK,holes:WPS.flat().map(q=>hC(...q,0.4))}),M.gilt,0,-9.45,0),'42009',{sub:1,gear:{z:SRT.z,m:SRT.m,ratchet:1}});
  mesh(R.sr,ringGeo(5*FK,2.75*FK,0.3),M.gilt,0,-9.25,0);   /* its web, free on the fusee arbor's collar (0.05 side shake; Fig. 69, arrow 5), under the heads of the winding ratchet's screws, which turn round inside the wheel's open centre as the key winds */   /* steep faces lead against the running direction, so the sustaining pawl holds it */
  mesh(R.sr,cylY(0.4,1.45,10),M.steel,14.6*FK*Math.cos(SSP),-8.375,14.6*FK*Math.sin(SSP));   /* the pin from the sustaining spring's working end, in the ratchet (the manual pins the spring to both wheels) */
  /* two winding pawls on the sustaining ratchet wheel, their tips on the fusee's winding ratchet (rp 9.4 FK): pushed by its steep faces when running, slipping over them when winding.
     Each is held in by a winding-pawl spring (42007), a long thin arc round the wheel at about the pivots' radius, from its foot about 150 deg round (toward the side its pawl's
     tip points) back to the arm's outer side near the pivot, which it bears on (Figs. 28, 69; C Spinner 19:12, 18:40, 19:15: the two springs nearly round the wheel's middle,
     each held at its far end; the radius and the foot's place read to about 1 mm), its foot held by two screws (42012) put in from the
     ratchet's underside, through it into the foot: their slotted heads show there (restoration video 28:35), and Fig. 28 draws one so. The wheel is gilt brass, as the video shows it.
     wpsGeo: the spring for pawl angle th, its arc fixed and its last stretch bent so the end stays on the arm; update() rebuilds it as the pawl rides the teeth in winding */
  const wpsGeo=(pw,th)=>{const u=pw.userData,bk=pawlBack(u.pts,0.96,u.q,th,[0,0]),E=[bk.p[0]+bk.n[0]*0.095,bk.p[1]+bk.n[1]*0.095];
    return stripGeo([...u.arc,E],0.3,0.3);};   /* from its foot (screwed down, drawn once) round to its end on the arm */
  R.wp=[];for(let k=0;k<2;k++){const a=k*Math.PI+0.4,P=[12.3*FK*Math.cos(a),12.3*FK*Math.sin(a)],T=[8.95*FK*Math.cos(a+0.3),8.95*FK*Math.sin(a+0.3)],ln=Math.hypot(T[0]-P[0],T[1]-P[1])+0.2,pw=mesh(R.sr,pawlGeo(ln,0.9,0.5),M.steel,P[0],-10.05,P[1]);
    hn(cylBetween(R.sr,0.22,-9.45,-10.3,M.steel,...P,12),'42009',{sub:1});   /* the stud it turns on, pressed into the wheel, riveted flush with the pawl's top, which the fusee's underside turns over (C Spinner 19:12: each pawl on a stud; two of the holes under the wheel, 19:05) */
    pw.userData.q=P;pw.userData.th0=Math.atan2(T[1]-P[1],-(T[0]-P[0]));pw.userData.pts=pawlPts(ln,0.9);R.wp.push(pw);
    const pol=(r,t)=>[r*Math.cos(a+t),r*Math.sin(a+t)],r0=pol(WPR,WPF[1]),r1=pol(WPR,WPF[0]);pw.userData.arc=[];for(let t=WPF[0]-0.03;t>0.45;t-=0.06)pw.userData.arc.push(pol(WPR,t));
    pw.userData.spr=hn(mesh(R.sr,wpsGeo(pw,pw.userData.th0),M.blued,0,-10.1,0),'42007');pw.userData.sprTh=pw.userData.th0;
    hn(mesh(R.sr,stadium(r0,r1,1.0,0.47,[r0,r1].map(q=>hT(...q,0.4))),M.blued,0,-10.27,0),'42007',{sub:1});
    const fl=new THREE.Group();fl.rotation.x=Math.PI;R.sr.add(fl);for(const q of[r0,r1])hn(screw(fl,q[0],-q[1],9.1,0.4,0.15,0.7+0.42),'42012');}   /* the spring's foot, thick enough to be tapped (0.47; 0.03 under the fusee's face,
     which turns over it while winding), and its two screws (42012) from the ratchet's underside (y -9.1), 0.05 short of the foot's top */
  const sp=hn(part('spawl',-22),'42096');sp.userData.axis=mesh(sp,shaftGeo([[TB_U-0.7,0.5],[TB_U+0.025,0.7],[y0-0.025,0.5],[y0+2]]),M.steel,SPv[0],0,SPv[1]);   /* pivots (r 0.5) in the train bridge and the plate (it has no bushing, Op. 15), shoulders 0.025 off them */
  /* sustaining pawl: its tip rests in the sustaining ratchet's teeth (rp 16.2 FK), trailing the pivot so the teeth can only pass it one way */
  const SPt=[L.Fu[0]+16.35*FK*Math.cos(54*D2R),L.Fu[1]+16.35*FK*Math.sin(54*D2R)];
  R.spawl=new THREE.Group();R.spawl.position.set(SPv[0],-9.45,SPv[1]);sp.add(R.spawl);mesh(R.spawl,pawlGeo(Math.hypot(SPt[0]-SPv[0],SPt[1]-SPv[1]),1.2,0.6,false,0.7),M.steel,0,0,0);
  R.spawl.userData.base=Math.atan2(SPt[1]-SPv[1],-(SPt[0]-SPv[0]));R.spawl.rotation.y=R.spawl.userData.base;R.spawl.userData.pts=pawlPts(Math.hypot(SPt[0]-SPv[0],SPt[1]-SPv[1]),1.2);
  /* sustaining pawl's spring (part of 42096, "complete with arbor and springs"; shape estimated): a wire from a collet on the arbor under the train bridge, bent round a
     steady pin in the bridge so it turns the pawl's tip into the ratchet. Drawn with the pawl at rest (R.spS turns with it); the pin stands in the bridge */
  R.spS=new THREE.Group();R.spS.position.set(SPv[0],0,SPv[1]);sp.add(R.spS);mesh(R.spS,ringGeo(1.2,0.7,0.6),M.steel,0,-19.6,0);
  mesh(R.spS,closeGeo(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0.05,-19.6,1.15),new THREE.Vector3(0.35,-19.6,2.6),new THREE.Vector3(0.1,-19.6,4.3)),16,0.12,6,false)),M.steel);
  cylBetween(tb,0.35,TB_U-0.6,-19.25,M.steel,SPv[0]-0.3,SPv[1]+3.9);
  /* ---------- going train (modules from MOD, 0.314 / 0.245 / 0.249; counts in TRAIN) ---------- */
  const m=MOD.train;
  const cw=part('cw',-8);R.cw=hn(arbor(cw,M,...L.C,{wheel:{n:TRAIN.cw,m:MOD.centre,y:-5.36,th:0.7,spokes:5,collet:1.3,cside:1,cp:0.3,mate:TRAIN.tp},pin:{n:TRAIN.cp,m:MOD.fusee,y:-6.53,th:1.54},prof:[[TB_T-0.1,0.5],[TB_U+0.025,0.75],[y0-0.125,0.5],[5.45+DD]]}),'42068');   /* pivots r 0.5 in the bushings, shoulders 0.025 off them; the lower pivot runs on through the dial for the cannon pinion */
  const tw=part('tw',-4);R.tw=hn(arbor(tw,M,...L.T,{wheel:{n:TRAIN.tw,m,y:-4.535,th:0.65,spokes:5,cside:1,cp:0.2,mate:TRAIN.fp},pin:{n:TRAIN.tp,m:MOD.centre,y:-5.385,th:0.95},prof:[[TB_T-0.1,0.3],[TB_U+0.025,0.55],[-0.025,0.25],[0.45]]}),'42071');
  const fw=part('fw',-30);R.fw=hn(arbor(fw,M,...L.F,{wheel:{n:TRAIN.fw,m:MOD.fourth,y:-7.46,th:0.9,spokes:FW_SP,cside:-1,mate:TRAIN.ep},pin:{n:TRAIN.fp,m,y:-5.51,th:2.9},prof:[[LB_T+2.56,0.25],[LB_T+3.025,0.55],[-0.025,0.25],[4.6+DD]]}),'42073');   /* its lower pivot runs on through the jewel and the dial for the second hand */
  const E=ESC,ew=part('escW',-41,true);
  R.esc=hn(arbor(ew,M,E.EX*ES,0,{pin:{n:TRAIN.ep,m:MOD.fourth,y:-6.96,th:2.0},prof:[[TB_T-0.875,0.2],[TB_T-0.3,0.55],[-0.6,0.2],[-0.025]]}),'42076');   /* pivots r 0.2 in the olive-hole jewels, ends 0.025 off the endstones (Op. 69); the pinion runs from the fourth wheel toward the plate, 1.1 mm above the third wheel's teeth, which pass under it */
  R.esc.userData.wheel=escapeWheel(R.esc,M,ES,EY,E);
  /* ---------- balance lower bridge (42065, Figs. 29, 30, 110; tools/lower_bridge.py, after a restoration video, References/VIDEOS.md): a stepped block of two levels. The lower (LB_LO, 3 mm,
       7.9-10.9 mm above the plate on the side photograph) is a slab curved as a lens, which holds the balance's lower setting and endstone cap and the fourth wheel's upper setting; its
       concave edge runs round the train bridge's escape lobe, so the escape wheel lifts out past it, and the escape arbor stands in a bite in that edge (the model's escape arbor stands 6.6 mm
       from the lobe's centre). The upper (LB_UP), against the train bridge's underside, is a lug at each end, with its screw, joined to the slab by a wall (LB_WALL); between them the
       escape wheel turns over the slab ---------- */
  /* the train-blocking screw (42247, Sec. II, Fig. 110) in the fourth end's wall, which rises round it to the upper tier, as the section in Fig. 110 draws it: bored for the head (r 0.95,
     through the upper tier and the wall) down to the seat 0.6 into the lower tier's top, tapped below it through the tier. The lower tier is drawn as two layers, the top one cut for the
     bore */
  const lb=part('lowerBridge',-41),LBh=[[...L.B,1.2],[...L.F,2.2],...S.blc.map(q=>hT(...q,ESCAP))],LB_U=TB_U+2;   /* LB_U: the upper tier's underside; the escape arbor passes through the slab in a hole wide enough to lift the escape wheel's pinion out through it from above */
  hn(lb,'42065');R.lowerBridge=mesh(lb,polyGeo(LB_LO,0.6,[...LBh,[...S.tBlock,0.95]]),M.plate,0,LB_T,0);mesh(lb,polyGeo(LB_LO,2.0,[...LBh,hT(...S.tBlock,TBS_R)]),M.plate,0,LB_T+0.6,0);
  mesh(lb,polyGeo(LB_LO2,0.4,[[...L.B,4.3],[...L.F,2.7],hT(...S.tBlock,TBS_R)]),M.plate,0,LB_T+2.6,0);   /* its underside: the cap in a round counterbore and the fourth's setting (r 2.2, as large as the video shows it) standing in a sink, 0.4 deep, as the restoration video shows them */
  mesh(lb,polyGeo(LB_WALL[0],LB_T-LB_U),M.plate,0,LB_U,0);mesh(lb,polyGeo(LB_WALL[1],LB_T-LB_U,[[...S.tBlock,0.95]]),M.plate,0,LB_U,0);mesh(lb,polyGeo(LB_WALL[2],LB_T-LB_U),M.plate,0,LB_U,0);
  /* the upper tier (the lugs), 2 mm thick. Two screws (42055, the pillar screws) from below, through the tier into the train bridge (Figs. 29, 67 and 110 draw them head down under the bridge;
     Op. 12 screws the bridge to the upturned train bridge, Op. 50 takes them out once it is off), one in each lug, and two steady pins into the train bridge ("complete with pins").
     The screw at the arm's end, on the 3 o'clock side, is outside every wheel: a hole in the pillar plate reaches it (RMG No. 4E019) */
  mesh(lb,polyGeo(LB_UP[0],2.0,[hC(...S.lb[1],PSR),[...S.lbp[1],0.41]]),M.plate,0,TB_U,0);mesh(lb,polyGeo(LB_UP[1],2.0,[[...S.tBlock,0.95]]),M.plate,0,TB_U,0);mesh(lb,polyGeo(LB_UP[2],2.0,[hC(...S.lb[0],PSR),[...S.lbp[0],0.41]]),M.plate,0,TB_U,0);
  for(const q of S.lbp)cylBetween(lb,0.4,LB_U,TB_U-1.0,M.steel,...q);
  /* balance lower setting (42162) in the bridge, and the lower endstone cap (42159) with its screws on the bridge's underside (Fig. 110) */
  hn(mesh(lb,ring(1.2,0.9,2.6),M.gilt,L.B[0],LB_T+1.3,L.B[1]),'42162.bl');hn(mesh(lb,ring(2.2,0.9,3.0),M.gilt,L.F[0],LB_T+1.5,L.F[1]),'42161.fu');{const q=hn(mesh(lb,stoneGeo(0.9,0.27,0.4,'bar'),M.ruby,L.F[0],LB_T+2.8,L.F[1]),'J.fu');q.rotation.x=Math.PI;}   /* its oil sink up, away from the wheel */   /* and the fourth wheel upper setting (42161) */hn(mesh(lb,stoneGeo(0.9,0.22,0.6,'olive'),M.ruby,L.B[0],LB_T+2.3,L.B[1]),'J.bl');
  { const lbf=new THREE.Group();lbf.rotation.x=Math.PI;lb.add(lbf);{ const v=[-lbu[1],lbu[0]],w=(v[0]*(L.E[0]-L.B[0])+v[1]*(L.E[1]-L.B[1]))>0?[-v[0],-v[1]]:v;endCap(lbf,L.B[0],-L.B[1],[lbu[0],-lbu[1]],-(LB_T+2.6),2.0,1.9,['42159.bl','J.ble','20762.blc'],2.7,[w[0],-w[1],0.65*2.7]); }   /* the cap round, R 2.7 (its screws at 0.71 R), cut flat 0.65 R out on the side away from the escape arbor, parallel to its screws (KLUwI2UUCMQ 13:49.5; Fig. 30 draws it round) */
  for(const q of S.lb)hn(screw(lbf,q[0],-q[1],-LB_U,PSR,1.6,2.0+2.5),'42055.lb').userData.lift=2.0+2.5+0.5; }   /* the bridge's screws in the flipped frame: heads on the upper tier's underside, 2.5 mm into the train bridge;
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
  const DETM=[],poly=(g,pts,ya,yb,mat,holes=[])=>{const k=typeof pts==='string'?pts:null,F=typeof pts==='function'?pts:null,G=()=>{const s=new THREE.Shape();(k?E.pieces[k]:F?F():pts).forEach((p,i)=>{const x=(p.x-E.Ft.x)*ES,z=(p.y-E.Ft.y)*ES;i?s.lineTo(x,z):s.moveTo(x,z);});s.closePath();
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
  /* the block notched round the third arbor, which runs up past it to its bushing in the train bridge (measured on the video: Review-results.md, 'Elsewhere', 12). Provisional:
     on the video the block is not where the escapement plan puts it (the same item); until it is placed, it keeps the plan's place and only gives the arbor room */
  const tU=()=>{const dx=L.T[0]-L.B[0],dz=L.T[1]-L.B[1],c=Math.cos(BETA),s_=Math.sin(BETA);return[(dx*c-dz*s_)/ES,(dx*s_+dz*c)/ES];};
  hn(poly(fx,()=>subtractCircle(Fx.blockMain.map(p=>[p.x,p.y]),tU(),0.95/ES).map(([x,y])=>({x,y})),TB_U,-17.46,M.plateSolid,[[E.D(...DBLK.s),hT(0,0,0.9)[2]],...DBLK.p.map(([t,n])=>[E.D(t,n),0.4])]),'42086');hn(poly(fx,Fx.blockFront,-18.26,-17.46,M.plateSolid),'42086',{sub:1});hn(poly(fx,Fx.button,-18.16,-17.51,M.steel),'42086',{sub:1});
  /* the block's two positioning pins (Sec. II: "fastened to the underside of the upper train bridge by means of one screw and two positioning pins"; Figs. 14, 22, 90; KLUwI2UUCMQ 11:08):
     pressed 1.5 mm into its top face, standing 1.2 mm into the train bridge */
  for(const[t,n]of DBLK.p){const q=E.D(t,n);hn(mesh(fx,cylY(0.4,2.7,16),M.steel,(q.x-E.Ft.x)*ES,TB_U+0.15,(q.y-E.Ft.y)*ES),'42086',{sub:1});}
  /* screws in detent coordinates (t along the detent, n across it): clamp screw and two steady pins across the foot;
     detent-adjusting screw at the block's end; lock-adjusting screw and its clamp screw across the block's front, under the wheel; trip-spring screw on the bracket */
  const dd=new THREE.Group();dd.position.copy(R.det.position);dd.rotation.y=-Math.atan2(E.dirB.y,E.dirB.x);dt.add(dd);const T=(t,n)=>[t*ES,-n*ES];
  const across=(g,t,n0,n1,r,y,mat)=>{const q=mesh(g,cylY(r,(n1-n0)*ES,16),mat,t*ES,y,-(n0+n1)/2*ES);q.rotation.x=Math.PI/2;return q;};
  hn(across(dd,-0.75,0.083,0.083+1.4/ES,0.95,-18.31,M.steel),'37024');hn(across(dd,-0.75,0.083,0.083+0.25/ES,1.25,-18.31,M.steel),'42251.det');for(const t of[-1.2,-0.3])hn(across(dd,t,-0.2,0.083+1.2/ES,0.22,-18.31,M.steel),'42086',{sub:1});   /* the detent's steady pins, standing 1.2 mm out of the foot (Fig. 90, KLUwI2UUCMQ 11:08) */
  hn(across(dd,-0.75,-0.35,0.083,0.45,-18.31,M.steel),'37024',{sub:1});   /* the clamp screw's shank, through the foot into the block */
  { const a=E.adj,b=-1.40+0.5/ES;for(const[r,t0,t1]of[[a.r,a.tH,a.tS],[0.35,a.tS,b]]){const q=hn(mesh(dd,cylY(r,(t1-t0)*ES,16),M.steel,(t0+t1)/2*ES,-18.61,-a.n*ES),'20756',r<0.5&&{sub:1});q.rotation.z=Math.PI/2;} }   /* detent-adjusting screw (Fig. 90; Ops. 84, 93): its head against the wall of the foot's slot, and shank 0.5 mm into the block (shortened to clear the train pillar, provisional, Review-results.md "Elsewhere", 12) */
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
  /* the hairspring's ends: both at HS_R from the staff, in the direction of the stud, which runs along the cock toward its screw Q (SPD, in the movement frame; SPSI, the same
     as a rotation in the balance's frame). The spring rises HS_H from HS_Y, below the collet, to the stud's clamp under the cock */
  const Q=S.cock,SPD=(()=>{const d=[Q[0]-L.B[0],Q[1]-L.B[1]],l=Math.hypot(...d);return[d[0]/l,d[1]/l];})(),SPSI=Math.atan2(-SPD[1],SPD[0])-BETA,HS_R=4.6,HS_Y=BAL_Y-2.3,HS_H=5.9,SPS=[L.B[0]+7.6*SPD[0],L.B[1]+7.6*SPD[1]];   /* SPS: the stud screw */
  R.staff=hn(new THREE.Group(),'42186');bl.add(R.staff);
  mesh(R.staff,shaftGeo([[CK_T+0.025,0.2],[CK_T+0.7,0.45],[LB_T+1.9,0.2],[LB_T+2.575]]),M.steel);   /* the staff turned to its pivots (r 0.2), each in its olive-hole jewel and 0.025 short of its endstone: endshake 0.05 mm (0.001-0.003 in, Op. 74); the shoulders 0.1 off the jewels */
  /* impulse roller (O.D. 0.249 in, as thick as the escape wheel, post 30) with its crescent: the large portion behind the impulse jewel, where each tooth
     drops in and meets the jewel, and the small portion ahead of it, which the teeth never enter (Ops. 76, 83). Shape angle = minus the unit-frame angle */
  const rR=E.rRoll*ES,rollG=()=>{const ir=new THREE.Shape(),n0=-E.aI,n1=n0+0.6;ir.absarc(0,0,rR,n1,n0-0.2+TAU,false);ir.absarc(0,0,rR-0.9,n0-0.2,n0,false);   /* the notch the impulse jewel is set in, down to its inner end (rR - 0.9) */ir.absarc(0,0,rR*0.55,n0,n1,false);
    for(let k=1;k<=3;k++){const a=n0+k*Math.PI/2,h=new THREE.Path();h.absarc(0.62*rR*Math.cos(a),0.62*rR*Math.sin(a),0.5,0,TAU,true);ir.holes.push(h);}   /* its three holes (Figs. 14, 61, 90), a quarter turn apart from the jewel */
    const hb=new THREE.Path();hb.absarc(0,0,0.45,0,TAU,true);ir.holes.push(hb);
    const irg=extrude(ir,{depth:1.3,bevelEnabled:false,curveSegments:32});irg.rotateX(-Math.PI/2);irg.translate(0,-0.65,0);return irg;};
  const roll=hn(mesh(R.staff,rollG(),M.steel,0,EY-0.07,0),'42263');
  /* the jewels as placed for ESC (again by escSet): the impulse jewel, the wheel centred on it, showing above and below (Op. 82); the discharge jewel on its roller */
  /* a jewel along the radius at ang from r0 to r1, w wide, h tall. d: the impulse jewel's section, flat on its impulse face (the -angle side, which the teeth drive) and
     curved on its back ("curved side of the jewel toward the operator", Sec. VII roller jewelling), thinning to 0.45 w at its ends; else a flat plate */
  const palSet=(q,ang,r0,r1,w,h,d)=>{if(q.geometry)q.geometry.dispose();
    if(d){const sh=new THREE.Shape(),zE=-w/2+0.45*w;sh.moveTo(r0,w/2);sh.lineTo(r1,w/2);sh.lineTo(r1,-zE);sh.quadraticCurveTo((r0+r1)/2,-(w-zE),r0,-zE);sh.closePath();   /* shape y = -local z */
      const g=extrude(sh,{depth:h,bevelEnabled:false,curveSegments:12});g.rotateX(-Math.PI/2);g.translate(0,-h/2,0);q.geometry=g;q.position.x=0;q.position.z=0;}
    else{q.geometry=new THREE.BoxGeometry(r1-r0,h,w);q.position.x=(r0+r1)/2*Math.cos(ang);q.position.z=(r0+r1)/2*Math.sin(ang);}
    q.rotation.y=-ang;return q;};
  const palI=()=>[E.aIc,rR-0.9,E.rp*ES,E.wI*ES,1.56,true],palD=()=>[E.aD,E.rDR*ES-0.4,E.rd*ES,E.wD*ES,0.7];
  const pI=hn(palSet(mesh(R.staff,new THREE.BufferGeometry(),M.ruby,0,EY-0.09,0),...palI()),'286');
  /* unlocking roller (42252, Fig. 64): a collar on the staff, its jewel in a slot along it (the jewel's width), and a wider slot opposite; turned on the staff to set the drop (Op. 97) */
  const collarG=()=>{const ro=E.rDR*ES,sl=[[-E.aD,E.wD*ES,ro-0.55],[-E.aD+Math.PI,0.3,ro-0.6]].sort((p,q)=>((p[0]%TAU)+TAU)%TAU-((q[0]%TAU)+TAU)%TAU),sh=new THREE.Shape();let st=true;
    const pt=(x,y)=>{st?sh.moveTo(x,y):sh.lineTo(x,y);st=false;},N=64,mod=a=>((a%TAU)+TAU)%TAU;let a=0;
    for(const[c0,w,rin]of sl){const c=mod(c0),h=Math.asin(w/2/ro),ux=Math.cos(c),uy=Math.sin(c),nx=-uy,ny=ux,ro2=Math.sqrt(ro*ro-w*w/4);
      for(;a<c-h;a+=TAU/N)pt(ro*Math.cos(a),ro*Math.sin(a));pt(ro*Math.cos(c-h),ro*Math.sin(c-h));
      pt(ro2*ux-w/2*nx,ro2*uy-w/2*ny);pt(rin*ux-w/2*nx,rin*uy-w/2*ny);pt(rin*ux+w/2*nx,rin*uy+w/2*ny);pt(ro2*ux+w/2*nx,ro2*uy+w/2*ny);a=c+h;}
    for(;a<TAU-1e-9;a+=TAU/N)pt(ro*Math.cos(a),ro*Math.sin(a));sh.closePath();
    const hb=new THREE.Path();hb.absarc(0,0,0.45,0,TAU,true);sh.holes.push(hb);
    const g=extrude(sh,{depth:1.0,bevelEnabled:false,curveSegments:32});g.rotateX(-Math.PI/2);g.translate(0,-0.5,0);return g;};
  const collar=hn(mesh(R.staff,collarG(),M.steel,0,EY+1.2,0),'42252');const pD=hn(palSet(mesh(R.staff,new THREE.BufferGeometry(),M.ruby,0,EY+1.2,0),...palD()),'287');
  /* hairspring collet (manual Figs. 5, 6): a hub slotted to grip the staff, and a flat plate whose tongue carries the clamp that holds the spring's inner end,
     locked by a wedge pin, the spring unbent (Sec. II). Turned to the stud's direction (SPSI), where the spring's ends lie. As Figs. 5 and 6 draw it against the spring: the
     plate a broad sector about the staff reaching most of the way to the coils (r 4.0 of the coils' 5.5), the clamp near the coils (HS_R 4.6); read off the figures */
  const cg=hn(new THREE.Group(),'42190');cg.rotation.y=SPSI;R.staff.add(cg);R.collet=cg;
  { const hub=[],ho=1.15,hi=0.47,so=0.1/ho,si=0.1/hi;for(let k=0;k<=24;k++){const a=-Math.PI+so+(TAU-2*so)*k/24;hub.push([ho*Math.cos(a),ho*Math.sin(a)]);}
    for(let k=0;k<=12;k++){const a=Math.PI-si-(TAU-2*si)*k/12;hub.push([hi*Math.cos(a),hi*Math.sin(a)]);}
    mesh(cg,polyGeo(hub,1.4),M.steel,0,HS_Y-0.35,0);
    const CR=4.0,pl=[],P=(r,a)=>[r*Math.cos(a*D2R),r*Math.sin(a*D2R)],t=Math.asin(0.35/CR)/D2R;
    for(let k=0;k<=20;k++)pl.push(P(CR,-120+(120-t)*k/20));pl.push([HS_R+0.5,-0.35],[HS_R+0.5,0.35]);for(let k=0;k<=3;k++)pl.push(P(CR,t+(10-t)*k/3));
    for(let k=0;k<=20;k++)pl.push(P(0.9,10-130*k/20));
    mesh(cg,polyGeo(pl,0.45),M.steel,0,BAL_Y-1.7,0);   /* the plate under the balance hub (0.05 clear of it) */
    hn(mesh(cg,new THREE.BoxGeometry(1.0,1.4,1.3),M.steel,HS_R,BAL_Y-1.95,0),'42191.col');hn(cylBetween(cg,0.15,BAL_Y-1.1,BAL_Y-2.8,M.steelD,HS_R,-0.4,10),'42147.col'); }   /* clamp on the tongue's end, over the spring's end; wedge pin on the side away from the spring's run */
  const BR=BAL_R,BY=BAL_Y;R.balU=hn(new THREE.Group(),'42178');R.balU.position.y=BY;R.staff.add(R.balU);
  /* the rim (Fig. 3: a tall band): 4.3 mm high, as Fig. 3 draws it against the balance's 29 mm, and 1.12 wide, so that the moment of inertia is the 1,140 g·mm² that the
     manual's Table II (screw changes and the rate they make, p. 70) gives; its bottom where the escape upper bridge's screws leave it (0.14 mm), its screw holes' row
     at its mid-height (RY, in the balance's frame, + toward the plate) */
  const RH=4.3,RW=1.12,RY=1.2-RH/2;mesh(R.balU,ring(BR,BR-RW,RH),M.steel,0,RY,0);
  /* the arm on the hub (Fig. 4): the hub (42186, on the staff) has a flange under the arm and a boss up through the arm's clearance hole; the cap (42248) over the arm
     and two hold-down screws (42249) through cap and arm into the flange. The arm is widened round the hub. Sizes estimated */
  const HD=[[1.7,0],[-1.7,0]],xa=Math.sqrt(2.2**2-1.2**2),a0=Math.atan2(1.2,xa),arc=(s,e)=>[...Array(25)].map((_,i)=>[2.2*Math.cos(s+(e-s)*i/24),2.2*Math.sin(s+(e-s)*i/24)]);   /* the bar across, joined to the 2.2 circle round the hub on both sides (subtractCircle keeps one run: it drew half the arm) */
  mesh(R.balU,polyGeo([[BR-0.5,-1.2],[BR-0.5,1.2],...arc(a0,Math.PI-a0),[-(BR-0.5),1.2],[-(BR-0.5),-1.2],...arc(Math.PI+a0,TAU-a0)],1.1,[[0,0,1.2],...HD.map(q=>hC(...q,0.4))]),M.invar,0,-0.55,0);
  hn(mesh(R.balU,discGeo(2.2,0.6,[[0,0,0.45],...HD.map(q=>hT(...q,0.4))]),M.steel,0,0.55,0),'42186',{sub:1});hn(mesh(R.balU,ringGeo(1.1,0.45,2.05),M.steel,0,0.125,0),'42186',{sub:1});   /* the hub's flange and boss, bored for the staff (as the flange is) */
  hn(mesh(R.balU,polyGeo([...Array(64)].map((_,i)=>[2.2*Math.cos(i/64*TAU),2.2*Math.sin(i/64*TAU)]),0.35,[[0,0,1.15],...HD.map(q=>hC(...q,0.4))]),M.steel,0,-0.9,0),'42248');
  for(const q of HD)hn(screw(R.balU,...q,-0.9,0.4,0.25,0.35+1.1+0.5),'42249').userData.lift=0;   /* they stay in: the hub's flange under them is on the staff, which goes with the balance */
  { const hs=[],sa=[Math.PI/2,-Math.PI/2].flatMap(c=>[-0.5,-0.25,0,0.25,0.5].map(d=>c+d)),under=a=>sa.some(b=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)))*BR<1.6);   /* none under a balance screw's head or washer (r 1.3), where they stood inside the head */
    for(let k=0;k<60;k++){if(k%30===0||k%30===2||k%30===28)continue;const a=k/60*TAU;if(under(a))continue;hs.push([cylY(0.28,0.2,8),new THREE.Matrix4().compose(new THREE.Vector3((BR+0.05)*Math.cos(a),RY,(BR+0.05)*Math.sin(a)),new THREE.Quaternion().setFromEuler(new THREE.Euler(0,-a,Math.PI/2)),new THREE.Vector3(1,1,1))]);}mesh(R.balU,mergeGeo(hs),M.steelD); }   /* none at the arm ends or under the weights' screws */
  const radial=(a,r0,len,rr,mat,seg=12,bore=0)=>{const q=mesh(R.balU,bore?ringGeo(rr,bore,len):cylY(rr,len,seg),mat,(r0+len/2)*Math.cos(a),RY,(r0+len/2)*Math.sin(a));q.rotation.set(0,-a,Math.PI/2);return q;};   /* bore: a nut's thread */
  const BW=[],bscrew=(a,len,rr,mat,mg,kind,off,id,bore=0)=>BW.push({q:hn(radial(a,BR+off,len,rr,mat,12,bore),id),a,len,rr,mg,kind,off});   /* id: its parts-list line */
  /* balance screws per the parts list (p. 82): 6 of 0.049 in head height (125-130 mg), 2 of 0.080 in (200-205 mg), 2 of 0.101 in (250-255 mg), in diametric
     pairs about the quarters. The heads are 2.6 across, as Fig. 3 draws them against the rim; their masses (for the moment of inertia) need a dense metal at that size */
  for(const c of[Math.PI/2,-Math.PI/2])for(const[d,hh,mg]of[[-0.5,1.24,127.5],[-0.25,2.57,252.5],[0,2.03,202.5],[0.25,1.24,127.5],[0.5,1.24,127.5]]){const id={127.5:'42171',202.5:'42173',252.5:'42174'}[mg];bscrew(c+d,hh,1.3,M.brass,mg,undefined,0,id);hn(radial(c+d,BR-RW-0.1,RW+0.1,0.35,M.brass,10),id,{sub:1});}   /* each with its thread in the rim's tapped hole */
  /* 2 timing weights (93 mg) and 2 vernier timing weights (10.5 mg) beside the arm ends, each a nut on a screw in one of the rim's holes (Fig. 3). Drawn at
     mid-travel, where the manual starts them (p. 70), off the rim by more than the 3 turns in that the rate panel allows */
  const WT=2/60*TAU;
  for(const c of[0,Math.PI])for(const[a,len,rr,mg,kind,off,sr]of[[c+WT,1.7,1.2,93,'t',0.55,0.4],[c-WT,1.3,0.65,10.5,'v',0.4,0.25]]){bscrew(a,len,rr,M.steelD,mg,kind,off,kind==='t'?'42176':'37115',sr+0.02);hn(radial(a,BR-1.5,2*off+len+1.55,sr,M.steel,10),kind==='t'?'42177':'42197');}   /* the weight a nut on its screw */
  /* moment of inertia of the uncut balance about the staff, in g·mm²: steel rim, hub and cap (7.9 mg/mm³), Invar arm (8.1), and the screws and weights at their
     parts-list masses, each spread along its drawn cylinder. The rim's holes, the weights' screws and the staff are left out */
  const I_FIX=(7.9*Math.PI*RH*(BR**4-(BR-RW)**4)/2+8.1*(2*BR-1)*1.1*2.4*((2*BR-1)**2+2.4**2)/12+7.9*Math.PI*(0.6*2.2**4+2.05*1.1**4+0.35*(2.2**4-1.15**4))/2)/1000;   /* rim, arm, and the hub's flange and boss and the cap (steel) */
  const inertia=(xt,xv)=>{let I=I_FIX;for(const w of BW){const d=BR+w.off+w.len/2+(w.kind==='t'?xt:w.kind==='v'?xv:0);I+=w.mg*(d*d+w.len*w.len/12+w.rr*w.rr/4)/1000+(w.wmg?w.wmg*(BR+w.off/2)**2/1000:0);}return I;};   /* wmg: a washer under a screw's head (R.screws) */
  /* the weights' thread pitch, set so that a full turn of a pair changes the rate by the manual's figures, about 40 s a day for the timing weights and 2.8 s
     for the verniers (p. 70). The period goes as √I, so moving a pair x mm out loses 86400·(dI/dx)·x/(2I) s a day */
  const I0=inertia(0,0),dIdx=k=>BW.reduce((s,w)=>s+(w.kind===k?2*w.mg*(BR+w.off+w.len/2)/1000:0),0);
  R.pitch={t:40*2*I0/86400/dIdx('t'),v:2.8*2*I0/86400/dIdx('v')};
  /* timing(nt,nv): turns both timing weights nt turns out and both verniers nv (negative: in), so the balance stays in poise, and returns the new moment */
  R.timing=(nt,nv)=>{const xt=nt*R.pitch.t,xv=nv*R.pitch.v;for(const w of BW)if(w.kind){const d=BR+w.off+w.len/2+(w.kind==='t'?xt:xv);w.q.position.set(d*Math.cos(w.a),RY,d*Math.sin(w.a));}return inertia(xt,xv);};
  /* screw and washer changes (Op. 3, Tables II and III on p. 70; the parts list's screws and washers, pp. 93, 99): R.screws(heads, washers) gives each diametric pair of balance
     screws (pair k: the k-th of the five about each quarter, in BW's order) a head height and a washer under each of its heads (keys of BSZ and BWA, inches; washer 0:
     none), rebuilt where they stand; R.timing then returns the moment with them. The heights are Table II's: the parts list's 0.121 in screw would reach the barrel bridge's
     cut round the balance (17.7 mm) with a washer under it. Washers r 1.0 under the heads (r 1.3); their size estimated */
  const BSZ={'0.040':[0.039,102.5,'42271'],'0.050':[0.049,127.5,'42171'],'0.060':[0.060,152.5,'42172'],'0.080':[0.080,202.5,'42173'],'0.100':[0.101,252.5,'42174']};
  const BWA={'0.002':[0.002,4.5,'42181'],'0.003':[0.003,6.5,'42182'],'0.004':[0.004,8.5,'42183'],'0.006':[0.006,12.5,'42184'],'0.008':[0.008,16.5,'42185'],'0.010':[0.010,20.5,'42256']};
  const BS=BW.filter(w=>!w.kind);BS.forEach((w,i)=>{w.pair=i%5;w.h0=Object.keys(BSZ).find(k=>BSZ[k][1]===w.mg);w.h=w.h0;w.len0=w.len;w.wk=0;w.wmg=0;
    const g=new THREE.Group();g.visible=false;R.balU.add(g);w.wg=g;w.wm=hn(mesh(g,ringGeo(1.0,0.37,1),M.steel),'42181');w.wm.rotation.set(0,-w.a,Math.PI/2);});   /* each washer in a group of its own, hidden with it (look() shows every mesh) */
  R.screwStd=BS.slice(0,5).map(w=>w.h0);
  R.screws=(heads,washers)=>{for(const w of BS){const h=heads[w.pair]||w.h0,k=washers[w.pair]||0,[hin,mg,id]=BSZ[h],[tin,wmg,wid]=k?BWA[k]:[0,0,null],t=tin*25.4,len=h===w.h0?w.len0:hin*25.4;   /* the standard heads keep their drawn heights, so putting them back restores the moment exactly */
      if(h!==w.h){w.q.geometry.dispose();w.q.geometry=cylY(w.rr,len,12);w.q.userData.hn=id;}
      Object.assign(w,{h,wk:k,len,mg,off:t,wmg});const d=BR+t+len/2;w.q.position.set(d*Math.cos(w.a),RY,d*Math.sin(w.a));
      w.wg.visible=!!k;if(k){w.wm.scale.set(1,t,1);w.wm.position.set((BR+t/2)*Math.cos(w.a),RY,(BR+t/2)*Math.sin(w.a));w.wm.userData.hn=wid;}}};
  R.balS=new THREE.Group();R.balS.position.y=BY;R.balS.visible=false;R.staff.add(R.balS);
  mesh(R.balS,polyGeo([[BR-0.5,-1.1],[BR-0.5,1.1],[-(BR-0.5),1.1],[-(BR-0.5),-1.1]],1.4,[[0,0,0.45]]),M.steel,0,-0.7,0);mesh(R.balS,ringGeo(2.2,0.45,2.2),M.steel);   /* arm and hub, bored for the staff (a press fit, as the uncut balance's hub) */
  const span=160*D2R,band=(a0,r0,r1)=>{const s=new THREE.Shape(),N=48;for(let i=0;i<=N;i++){const a=a0+span*i/N;i?s.lineTo(r1*Math.cos(a),r1*Math.sin(a)):s.moveTo(r1*Math.cos(a),r1*Math.sin(a));}
    for(let i=N;i>=0;i--){const a=a0+span*i/N;s.lineTo(r0*Math.cos(a),r0*Math.sin(a));}const g=extrude(s,{depth:2.4,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,-1.2,0);return g;};
  for(let k=0;k<2;k++){const a0=k*Math.PI;mesh(R.balS,band(a0,BR-1.6,BR-0.9),M.steel);mesh(R.balS,band(a0,BR-0.9,BR),M.brass);
    const wa=a0+span*0.62,w=mesh(R.balS,cylY(1.1,2.4,24),M.brass2,(BR+1.1)*Math.cos(wa),0,-(BR+1.1)*Math.sin(wa));w.rotation.set(0,wa,Math.PI/2);}   /* compensation weights within the band's 2.4 mm height and out to 16.8 mm, inside the timing weights' path: they pass the escape upper bridge's screws and the barrel bridge's cut round the balance (17.7) as the uncut rim's do */
  /* helical hairspring: ~8 mm tall, ~5.5 mm radius, many turns (Fig. 2) */
  const spg=part('spr',-88,true),sg=new THREE.Group();sg.rotation.y=SPSI;spg.add(sg);R.spring=hn(mesh(sg,new THREE.BufferGeometry(),M.steel,0,HS_Y,0),'42188');R.spring.rotation.x=Math.PI;
  /* hairspring stud (Figs. 5, 19, 84, 85): a flat bar under the cock, held by the stud screw from the cock's top and a steady pin, with a clamp at its inner end
     holding the spring's upper end by a wedge pin, as the collet does. Its bar runs from over the spring's end, across the top coil, along the cock toward its screw */
  { const st=hn(new THREE.Group(),'42189');st.rotation.y=SPSI;spg.add(st);const yb=CK_T+2.6;
    mesh(st,polyGeo([[2.9,-0.8],[8.6,-0.8],[8.6,0.8],[2.9,0.8]],0.5,[hT(7.6,0,0.8),[5.6,0,0.3]]),M.steel,0,yb,0);   /* tapped for the stud screw; the steady pin pressed through it */hn(mesh(st,new THREE.BoxGeometry(1.0,0.7,1.3),M.steel,HS_R,yb+0.85,0),'42191.st');
    hn(cylBetween(st,0.15,yb+0.5,yb+1.36,M.steelD,HS_R,0.4,10),'42147.st');cylBetween(st,0.3,yb-0.8,yb+0.5,M.steel,5.6,0,12); }   /* the steady pin, 0.8 into the cock */   /* wedge pin through the clamp; steady pin up into the cock */
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
  R.cock=mesh(ck,stepGeo(ckEdge(hullSplice(COCK_POLY,34,40,[COCK_POLY[35],...stadiumPts(add(L.B,EPu,1.3),add(L.B,EPu,-3.0),5.2)])),L.B,CK_RP,2.6,TB_T-CK_T,[[...L.B,1.5],[...hC(...S.cock,2.8,0.8).slice(0,3),2.95,CK_CB],...S.ep.map(q=>hT(...q,0.7).slice(0,3)),hC(...SPS,0.8).slice(0,3),[...add(L.B,SPD,5.6),0.3]],{r0:9,tS:7.6,n:12}),M.plate,0,CK_T,0);   /* last: the hole for the stud's steady pin */
  /* setting: flush with the cock's top, standing 0.3 below it; the olive-hole jewel near its top, the pivot just under the endstone */
  hn(mesh(ck,new THREE.LatheGeometry([V2(0.95,CK_T),V2(1.5,CK_T),V2(1.5,CK_T+2.9),V2(0.7,CK_T+2.9),V2(0.7,CK_T+0.95),V2(0.95,CK_T+0.95),V2(0.95,CK_T)],40),M.steel,...[L.B[0],0,L.B[1]]),'42162.bu');
  hn(mesh(ck,stoneGeo(0.95,0.22,0.6,'olive'),M.ruby,L.B[0],CK_T+0.3,L.B[1]),'J.bu');   /* flush with the cock's top, under the endstone */
  /* its two steady pins ("complete with pins", 42066), 1.5 mm into the train bridge, under the body */
  for(const q of S.ckp)cylBetween(ck,0.4,TB_T,TB_T+1.5,M.steel,...q);
  /* one balance cock screw (parts list 42192), at its position on the top-view photograph (p3map scr_cockfoot), its head down in the counterbore */
  hn(screw(ck,...Q,CK_T+CK_CB,2.8,1.5,TB_T-CK_T-CK_CB+2.5,0.8),'42192');   /* through the cock into the train bridge */
  hn(screw(ck,...SPS,CK_T,0.8,0.45,2.6+0.45),'27760.st');   /* through the cock into the stud */   /* hairspring stud screw (27760), down through the cock to the stud (Figs. 19, 84) */
  /* endstone cap (42160) over the staff, as C Spinner's video shows it on the cock (5:51, 42:03, 42:08) and off it (41:58): a steel plate 0.7 mm thick, symmetric about the
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
  const fs=makeFusee(M,{yS:-19.86,yB:-10.9,rmin:7.95*FK,rmax:16.8*FK,k:FK,epR:Math.hypot(...L.Fu)-(TRAIN.cw+2)*MOD.centre/2-0.3,N:FUSEE_TURNS,Rb:17.6,bT:TB_T+1.0,bB:BB_LO,cT:-19.86,cB:-10.9,aT:BB_T,d:fd,cap:0.64,screw,loose,endLift:fsP.userData.off+6,   /* end plate to 6 mm, under the fusee wheel */
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
  /* SRZ: the setup ratchet's teeth, about 42 on C Spinner's video (11:58, 12:19, 38:28: pitch 8.3-8.8 deg; References/VIDEOS.md), on the pitch radius the top-view photograph
     gives (7.5 mm, where the click's tip is) */
  const SRZ=42,SRM=0.289*52/SRZ*PHOTO_K;
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
  { const Pv=P2(8.9,250.6),Tp=P2(7.5,220),clk=hn(mesh(rt,pawlGeo(Math.hypot(Tp[0]-Pv[0],Tp[1]-Pv[1])+0.3,1.3,0.8),M.steel,Pv[0],-28.01,Pv[1]),'42027');clk.rotation.y=Math.atan2(Tp[1]-Pv[1],-(Tp[0]-Pv[0]));
    /* turn the ratchet (it is fixed in running) so a steep face bears on the click's tip, then rest the click on it */
    const pr=ratchetProf(SRZ,SRM,true),pts=pawlPts(Math.hypot(Tp[0]-Pv[0],Tp[1]-Pv[1])+0.3,1.3),ph=phaseAgainst(pr,pts,[Pv[0]-L.Ba[0],Pv[1]-L.Ba[1]],clk.rotation.y,-1);
    srw.rotation.y=ph.psi;clk.rotation.y=ph.th;
    { const n=SRZ,m=SRM,rp=m*n/2,ro=rp+m*0.95,ri=ro-2.25*m,pp=TAU/n,RT=[];for(let i=0;i<n;i++){const a=i*pp;RT.push([ri,a],[ro,a+pp*0.9],[ri,a+pp*0.97]);}   /* the drawn outline (gearGeo, flipped) */
      const CP=pts.map(([x,z])=>{const c=Math.cos(ph.th),sn=Math.sin(ph.th);return[Pv[0]+x*c+z*sn,Pv[1]-x*sn+z*c];});
      const gap=psi=>{const W=RT.map(([r,a])=>{const x=r*Math.cos(a),z=r*Math.sin(a),c=Math.cos(psi),sn=Math.sin(psi);return[L.Ba[0]+x*c+z*sn,L.Ba[1]-x*sn+z*c];});let d=1e9,inside=false;
        for(const P of CP){let w=false;for(let i=0,j=W.length-1;i<W.length;j=i++){const[xi,zi]=W[i],[xj,zj]=W[j];if((zi>P[1])!==(zj>P[1])&&P[0]<(xj-xi)*(P[1]-zi)/(zj-zi)+xi)w=!w;
          const dx=xj-xi,dz=zj-zi,l2=dx*dx+dz*dz,t=clamp(((P[0]-xi)*dx+(P[1]-zi)*dz)/l2,0,1);d=Math.min(d,Math.hypot(P[0]-xi-t*dx,P[1]-zi-t*dz));}if(w)inside=true;}return inside?-d:d;};
      let a=ph.psi-0.03,b=ph.psi;if(gap(a)<0&&gap(b)>0){for(let i=0;i<40;i++){const mm=(a+b)/2;gap(mm)>0.003?b=mm:a=mm;}srw.rotation.y=b;} }
    /* setup pawl spring (42028, Figs. 17, 24, 80, 108): a blued band on edge, standing on the barrel bridge under the cover, round the ratchet about half a turn at r 10,
       from its fixed end, held between two steady pins in the bridge ("pushed off by pressure on steady pins from the lower side of barrel bridge", Ops. 27, 41), to the
       click's back, which it bears on at the click's height (C Spinner 11:58: about 180 deg at r 10-10.7, its edge about 0.9 mm seen from above at a slant; Fig. 108 draws
       about as much; 0.3 thick and 0.85 tall, the pins' places estimated) */
    const bk=pawlBack(pts,1.1,Pv,ph.th,L.Ba),E=[bk.p[0]+bk.n[0]*0.13,bk.p[1]+bk.n[1]*0.13],SR=10.0,eA=(Math.atan2(E[1]-L.Ba[1],E[0]-L.Ba[0])-PHOTO_TURN)/D2R,arcP=[];   /* eA in P2's angles (the photographs' frame) */
    const e1=(eA+360)%360-6,a0=e1-174;for(let a=a0;a<e1;a+=6)arcP.push(P2(SR,a));
    hn(mesh(rt,stripGeo([...arcP,E],0.3,0.85),M.blued,0,BB_T-0.85,0),'42028');   /* on the bridge, up to the click's middle */
    for(const q of[P2(SR+0.42,a0+3),P2(SR-0.42,a0+12)])hn(cylBetween(rt,0.25,-27.71,-27.16,M.steel,...q),'42028',{sub:1});}
  const nBefore=rt.children.length;
  { /* outline in polar coordinates about the arbor: left end arc, rim-side concave edge (to r 5.9, within 0.5 mm of the photograph), right end,
       centre-side concave edge (to r 6.4) */
    const arc3=(a,b,c,n)=>{const[ax,az]=a,[bx,bz]=b,[cx2,cz2]=c,d=2*(ax*(bz-cz2)+bx*(cz2-az)+cx2*(az-bz)),
        ux=((ax*ax+az*az)*(bz-cz2)+(bx*bx+bz*bz)*(cz2-az)+(cx2*cx2+cz2*cz2)*(az-bz))/d,uz=((ax*ax+az*az)*(cx2-bx)+(bx*bx+bz*bz)*(ax-cx2)+(cx2*cx2+cz2*cz2)*(bx-ax))/d,
        r=Math.hypot(ax-ux,az-uz),t0=Math.atan2(az-uz,ax-ux),tm=Math.atan2(bz-uz,bx-ux);let t1=Math.atan2(cz2-uz,cx2-ux);
      const w=t=>((t-t0)%TAU+TAU)%TAU;let dt=w(t1);if(w(tm)>dt)dt-=TAU;const o=[];for(let k=1;k<n;k++){const t=t0+dt*k/n;o.push([ux+r*Math.cos(t),uz+r*Math.sin(t)]);}return o;};
    const TL=P2(12.8,69.4),BL=P2(13.1,145.6),BR=P2(12.97,249.2),TR=P2(12.61,325.9),pts=[],polar=(r0,r1,a0,a1,n)=>{const o=[];for(let k=0;k<=n;k++){const t=k/n;o.push(P2(lerp(r0,r1,t),lerp(a0,a1,t)));}return o;};
    pts.push(TL,...arc3(TL,P2(13.1,106),BL,20),BL,...arc3(BL,P2(5.9,192),BR,40),BR,...polar(12.97,12.61,249.2,325.9,30).slice(1,-1),TR,...arc3(TR,P2(6.4,17),TL,40));
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
  const fl=mesh(wp,polyGeo([...Array(96)].map((_,i)=>[8.6*Math.cos(i/96*TAU),8.6*Math.sin(i/96*TAU)]),1.0,[[0,0,6.7],...S.seal.map(q=>hC(q[0]-L.Fu[0],q[1]-L.Fu[1],1.0))]),M.plateSolid,L.Fu[0],-28.18,L.Fu[1]);
  for(const q of S.seal)hn(screw(wp,...q,-28.18,1.0,0.5,1.0+2.0),'42056.sl');   /* dust seal screws (42056) into the barrel bridge */
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
  mv.userData.balance=kind=>{R.balU.visible=kind!=='split';R.balS.visible=kind==='split';};
  mv.userData.stop=kind=>{R.armF9.visible=kind!=='navy';R.navy.visible=kind==='navy';};   /* the balance stop fitted: the manual's locking arm (Fig. 9) or the Navy's Y-arm */
  /* train-blocking screw: with its dog point down between the fourth wheel's spokes, how many beats (E) the train can still turn before the next spoke meets it (blockRoom),
     and whether a spoke is under the dog point now, so it can't be screwed down (blockClear). The fourth wheel turns with its spokes' angles falling as E rises */
  { const u=R.tbs.userData,q=TAU/FW_SP,sp=E=>[...Array(FW_SP).keys()].map(j=>-(E*ESC.P)/ESC_PER.fw+FW.wheel.rotation.y+j*q-u.sig);
    u.vFace=(-7.46-0.45-(u.up+6.81))/(u.down-u.up);   /* screw travel (0 up, 1 down) at which the dog point reaches the fourth wheel's face */
    R.blockRoom=E=>Math.min(...sp(E).map(a=>(((a-u.half)%q)+q)%q))*ESC_PER.fw/ESC.P;
    R.blockClear=E=>sp(E).every(a=>Math.abs((((a%q)+q+q/2)%q)-q/2)>=u.half); }
  const RF=ESC_PER.fw,RT=ESC_PER.tw,RC=ESC_PER.cw,MR=MW.cp/MW.mw,HR=MR*MW.mp/MW.hw;   /* escape turns per fourth, third, centre turn; minute wheel and hour wheel per centre turn */
  let lastN=-1,lastEps=0,lastIn=-1,lastTh=null,lastPs='',srA=0,holding=false,lastD=1e9,eps=null,nW0=0,eps0=0;
  /* ratchet profiles; WPH: fusee-ratchet angle (in the sustaining ratchet's frame) at which the winding pawls bear on its steep faces */
  const FPR=ratchetProf(WRT.z,WRT.m,false),SRP=ratchetProf(SRT.z,SRT.m,true),WPH=phaseAgainst(FPR,R.wp[0].userData.pts,R.wp[0].userData.q,R.wp[0].userData.th0,1).psi;
  R.WPH=WPH;R.SMAX=SMAX;   /* SMAX: the sustaining spring's travel from loaded to spent (with sspGeo) */
  /* when winding starts the spring turns the sustaining ratchet back until a steep face meets the sustaining pawl */
  const holdBack=a=>{const q0=[SPv[0]-L.Fu[0],SPv[1]-L.Fu[1]],tr=psi=>{const q=toWheel(q0,[0,0],psi),th=seatPawl(R.spawl.userData.pts,q,R.spawl.userData.base-psi,SRP),t=R.spawl.userData.pts[PAWL_TIP],c=Math.cos(th),sn=Math.sin(th);return Math.hypot(q[0]+t[0]*c+t[1]*sn,q[1]-t[0]*sn+t[1]*c);};
    let b=a,r=tr(a);for(let i=0;i<60;i++){const nb=b-SRP.p/40,nr=tr(nb);if(nr>r+0.004)break;b=nb;r=Math.min(r,nr);}return b;};
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
    { const d=Math.min(SMAX,gA-srA);if(Math.abs(d-lastD)>0.002){R.sspring.geometry.dispose();R.sspring.geometry=sspGeo(d);lastD=d;} }
    for(const pw of R.wp){const psi=fzW-srA,u=pw.userData;pw.rotation.y=seatPawl(u.pts,toWheel(u.q,[0,0],psi),u.th0-psi,FPR)+psi;
      if(Math.abs(pw.rotation.y-u.sprTh)>0.002){u.spr.geometry.dispose();u.spr.geometry=wpsGeo(pw,pw.rotation.y);u.sprTh=pw.rotation.y;}}   /* the spring follows its pawl */
    { const q=toWheel([SPv[0]-L.Fu[0],SPv[1]-L.Fu[1]],[0,0],srA);R.spawl.rotation.y=seatPawl(R.spawl.userData.pts,q,R.spawl.userData.base-srA,SRP)+srA;R.spS.rotation.y=R.spawl.rotation.y-R.spawl.userData.base; }
    R.staff.rotation.y=-s.th;
    { const b=s.blk||0,u=R.tbs.userData;R.tbs.position.y=u.up+(u.down-u.up)*b;R.tbs.rotation.y=b*u.turns*TAU;R.arm.rotation.y=R.armL+R.armU*(1-(s.arm||0));R.navyArm.position.y=0.48*(s.arm||0); }   /* screwed down turns it clockwise seen from its head */
    R.det.rotation.y=s.lift/E.LEN;
    const fa=s.n*TAU+eps;R.fp.rotation.y=fa;R.sq.rotation.y=fa;R.wkey.visible=!!s.keyOn;   /* the arbor, its square and pinion turn with the fusee */
    const udA=fa*UD.pin/UD.wheel;R.udW.rotation.y=-udA;R.ud.rotation.y=-UD_UP*D2R-udA;
    if(s.msOn){const In=fs.Ib(s.n,eps);if(Math.abs(In-lastIn)>=0.002){fs.ms.geometry.dispose();fs.ms.geometry=mainspringGeo(fs.MS.Tup-In,fs.MS.y0,fs.MS.y1,fs.MS.ey);lastIn=In;}}   /* rebuilt when the barrel has turned 0.7 deg */
    if(s.springOn&&s.th!==lastTh){R.spring.geometry=springGeo(5.5,HS_H,14,s.th,0.17,HS_R,HS_R,R.spring.geometry);lastTh=s.th;}   /* rewritten in place (reclose), and only when the balance has turned */
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
     and an inner link's one), riveted at a 1.0 mm pitch parallel to the arbor; plate sizes and pitch estimated. Its pitch line (the rivets) runs 0.04 clear of the groove's
     floor on the fusee and 0.02 clear of the barrel's wall */
  const H=0.9,TK=0.18,PC=1.0,rc=m=>rf(m)+H/2+0.04,rB=c.Rb+H/2+0.04,dl=n=>Math.asin((rB-rc(n))/(fx-bx));
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
  lay(subtractCircle(discClip(capR,[[zHi,0,1]],128),[0,0],GRV),[hT(0,7.0*k,0.55)]);lay(discClip(capR,[[zLo,0,-1]],128),[hT(0,-7.0*k,0.55)]);   /* rim, either side of the slot, tapped for the top plate's screws */
  lay(discClip(HUB,[[zHi,0,1]],96),[[0,0,1.02]]);   /* hub round the arbor; the spring's groove round it (r HUB-GRV), cut open by the slot */
  hn(mesh(sbR,discGeo(capR-0.2,0.6,[[0,0,1.02],hC(0,7.0*k,0.55),hC(0,-7.0*k,0.55)]),M.gilt,0,yT-1.1,0),'42008');if(c.screw)for(const z of[7.0*k,-7.0*k])hn(c.screw(sbR,0,z,yT-1.1,0.55,0.3,0.6+0.5),'27760.fu');   /* its screws opposite each other at r 7.0 k (restoration video 13:30, face-on) */
  hn(cylBetween(fz,2.9*k,yT-1.1,yT-2.1,M.steel,0,0,40),'42022',{sub:1});   /* a steel collar on the arbor, standing on the top plate (video 13:30, 17:23: r 2.9 k; its height estimated). Fig. 28 draws a raised hub through a
     large hole in the plate, beside which the stop-bar's slot would run; the bar's place under the plate isn't seen, so the collar starts at the plate */
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
  return{g,fz,bz,setWind,rf,yf,fx,bx,ms,I,Ib,IN,MS,stopBar,setBar,barTravel,mF,stud,N};
}
