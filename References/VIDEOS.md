# Videos of real Model 21s: what they show, what was measured, how

Videos of real Hamilton Model 21 chronometers are a **source of truth**, with
the photographs in this folder and the 1948 manual: they show real parts, so
where the model disagrees with them, the model is wrong (IDEAS.md, "Source of
truth"). An estimate, a clearance fit or an earlier choice in the code gives way
to them. What a video can't show cleanly (a blurred pinion, a part seen at a
slant) is evidence, not proof: say how sure each reading is, as the tables
below do.

The videos are other people's work (YouTube, all rights reserved). They are
cited here, never copied into the repository: download them and take frames
with `marine-chronometer-source/chronometer-working-model/tools/video.py`, which
keeps them in `$MC_VIDEO` (default `~/mc-video`), outside the repository. Every
time below is mm:ss into the video; "4K" frames are 3840 × 2160 (`video.py
fetch ID` takes the highest resolution, `frame ID mm:ss` the largest copy).

Contents: [The videos](#the-videos) · [What each shows](#what-each-shows) ·
[Measurements](#measurements) · [Methods](#methods) ·
[Gaps the videos could close](#gaps-the-videos-could-close)

## The videos

| ID | Channel, title | Length, best resolution | Movement |
|---|---|---|---|
| `KLUwI2UUCMQ` | C Spinner Watch Restorations, "Repairing a World War II Navy Chronometer - The Iconic Hamilton Model 21" | 54 min, 4K (VP9, about 4 GB) | 1941, plate serial 2E8489, with the Navy's Y-shaped balance stop and its second (white) dust seal on the barrel bridge, not the manual's locking arm (Fig. 9); full teardown, cleaning, reassembly, filmed close on a blue mat |
| `wcYqdgpyggQ` | BunnSpecial, "How I take apart a marine chronometer, Hamilton, Model 21, Part 2 of 2" | 28 min, 720p | Teardown of the plates and wheels; the clearest views of the bridges off |
| `Jd2c3x8VKsE` | BunnSpecial, "… Part 1 of 2" | 27 min, 720p | Preparation: out of the box and case, letting down the mainspring (not yet reviewed frame by frame) |
| `We1dLNXiBj0` | bunnspecial, "Hamilton Model 21 Marine Chronometer, Part 1 of 3" | 3 min, 720p | The escapement running (not yet used) |
| `s7VW3RiJ97E` | RM Watch & Clock, "Hamilton Model 21 Marine Chronometer" | 30 s, 1080p | The escapement running, close (not yet used) |
| `TWQsSVWuikk` | Boulder Horological Society, "Zoom #19: Hamilton 21 Marine Chronometer Deconstructed" | A recorded talk | 43:13: the upper train bridge upturned in the hand, the balance lower bridge on it and the whole keyhole; the same L-shaped slab and lugs as `KLUwI2UUCMQ` (not yet downloaded; seen on a screenshot) |

## What each shows

Found with contact sheets (`video.py sheet ID --step 3`). Read these before
searching a video again.

### `KLUwI2UUCMQ` (C Spinner, 4K)

| Time | What is on screen | Useful for |
|---|---|---|
| **8:43–8:52** | **The dial lifted off: tweezers in at the dial take-off slot, between dial and flange (8:46, 8:49)** | Take-off slot |
| **9:00–9:05** | **The mounting ring and the plate's dial side face-on, dial off: the flange's holes and the take-off slot (9:03)** | Ring's holes, take-off slot |
| 2:15–2:45 | The movement out of its case, oblique and from the side: the balance cock stands at the rim as a tall polished block (2:36) | The cock's height and its solid outer wall |
| **4:57–6:24** | **The Navy's Y-shaped balance stop in place, from above and close (5:10 at 4K: the lever coming out from under the white seal on the barrel bridge, the crossbar over the balance, an eye with a pin over the rim at each end); handled 5:30–5:48 (the movement turned, a key on it); unscrewed at the seal's flange 6:15–6:18 and lifted off with the seal 6:21–6:24 (contact sheet `--step 3 --from 4:30 --to 6:30`, 4 October 2026)** | The Navy stop's shape and how it works (Review-results.md, open findings 13); not Fig. 9's locking arm, which no video shows yet |
| **4:56–6:47** | **From above (12 o'clock toward the camera): the cock in place, its screw out (5:56), its nose and endstone cap close (5:50), then lifted off (6:44); 6:29 and 6:47 are the same view with the cock on and off** | The cock's outline, the barrel bridge's edge beside it, the cock's screw and steady-pin holes in the train bridge |
| **6:44–6:53.5** | **The balance lifted out (6:44–6:48, from the cock side, the whole rim at 6:47.5), then held in the fingers side-on (6:49.5–6:51) and nearly face-on (6:52.5–6:53.5): the screws, the empty holes, the weights at the arm's ends** | The rim's holes and screws (`$MC_VIDEO/balance/`) |
| **10:44–10:48** | **From above, the detent's support block's screw taken out at the train bridge's edge below the keyhole; the keyhole's two lobes and the lower bridge's pocket in them** | Detent block's place |
| 10:51–11:06 | The detent with its support block drawn out from under the train bridge, then held up (11:05–11:11): a long rectangular block with the screw hole at one end | Detent block's shape |
| 9:56–10:26 | The escape upper bridge taken off (10:00: on, over the keyhole's escape lobe, from above: a long plate symmetric about its jewel, a screw near each end), its jewel and endstone close (10:16–10:26) | Escape arbor's place; the bridge's form |
| **10:06–10:13** | **The escape wheel lifted out from above through the keyhole, the lower bridge in place: a long arbor, the pinion near its lower end** | Escape arbor's length |
| **10:28–10:38** | **Side-on under the train bridge: the detent, the balance lower bridge's slab, the fourth arbor from it down past its wheel** | Lower bridge's heights |
| 10:41–11:03 | The keyhole with the escape wheel out: the lower bridge's pocket walls, the balance's lower jewel at the bottom; the detent taken off (11:06) | Lower bridge from above |
| 12:40–12:46 | The barrel bridge on, the keyhole: the balance's lower jewel and the escape wheel's teeth through its two lobes | |
| **11:46–12:22** | **The setup work in place: the cover on, its screws out (11:46); the cover off (11:58, 12:19): the setup ratchet, its click and the click's spring wrapping round the ratchet** | Setup ratchet's teeth, click and spring (2 October 2026) |
| 12:48–13:03 | The upper train bridge lifted and turned over: its underside, engraved HAMILTON WATCH CO, MODEL 21 | Bridge outline, its screw holes (1.2) |
| 13:06–13:33 | Barrel bridge off: the fusee with the chain on it, the barrel; the fusee lifted out with its chain | Chain on the fusee, fusee wheel in place |
| **13:27–13:33** | **The fusee out, its small end face-on (13:30): the top plate, its two screws near the rim, a steel collar round the arbor** | Fusee's top |
| 13:36–13:48 | The upper train bridge with the balance lower bridge and its red jewel, then lifted | Lower bridge in place |
| **13:44** | **The train bridge from above, barrel bridge, balance and escape wheel off: the two-lobed keyhole, the lower bridge's pockets under it, the balance's lower jewel and its two screws** | Lower bridge from above |
| **13:48–13:50** | **The train bridge turned over in the hand, the balance lower bridge on it, nearly face-on (13:49–13:49.5): its underside, both screws, cap, fourth's setting, pin** | Lower bridge's outline |
| **13:51–13:54** | **The train in place (centre, third, fourth wheels), nearly straight down; centre pinion end-on** | Arbor layout (1.11), pinion counts (1.8) |
| 13:57 | The centre wheel lifted out | |
| **13:59.4–13:59.6** | **The centre wheel held in tweezers over the plate, its pinion end-on from above** | Centre pinion's leaves (14, likely) |
| 14:00–14:08 | The third wheel lifted out; the keyhole opening and the lower train bridge's bar under it | Third arbor's setting |
| 14:12–14:34 | Jewel settings close: the lower train bridge's and the balance lower bridge's (pink jewels); 14:30–14:34 the lower bridge's cap taken off, the slab's edge and the counterbore | Settings, oil sinks (1.10) |
| **14:36–14:45** | **The bare pillar plate, train side, nearly straight down: centre bushing, fusee and barrel bushings, the bar's settings, the fourth's red jewel, pillars** | Plan positions (1.11, 1.2) |
| 14:48 | The case's bowl, empty | |
| 14:52–15:12 | Jewel settings and endstones, close | 1.10 |
| 15:16–16:24 | The barrel: cap off, mainspring in place, arbor out, the hole in the wall for the chain's hook | Barrel, hook (1.9) |
| 16:28–17:04 | The mainspring taken out (gloved), the barrel's inside | Mainspring length (1.9) |
| 17:08–17:16 | The fusee with the chain wound on | |
| **23:30, 23:45** | **Every part cleaned and laid flat on the mat, from above: plates, bridges, chain, barrel, train wheels, wind indicator wheel (5 spokes), motion work, ratchets** | Tooth counts of flat parts, relative sizes |
| **27:30** | **The fusee wheel alone, flat, nearly face-on, with the sustaining spring** | Fusee wheel's teeth (counted: 90) |
| 28:00–29:28 | Fusee wheel and maintaining work handled: sustaining spring, ratchet; fusee with its winding ratchet | Maintaining work |
| **28:08–28:20** | **The fusee's large end, oblique: its raised outer rim, the steel winding ratchet in a recess with two slotted screws, the arbor's collar; the fusee wheel beside it, recess up** | Fusee's large end, arbor collar |
| **28:32–28:44** | **The fusee with the sustaining ratchet on, from the pinion end: the ratchet's underside, gilt, with slotted screw heads and holes in a ring round the arbor** | Sustaining ratchet |
| 29:04–29:12 | The fusee wheel held, the wind indicator pinion on the arbor's end toward the camera | Indicator pinion (1.8; blurred) |
| 29:32–32:16 | A mainspring winder, and a collar for it turned on the lathe | Not the movement |
| 32:20–32:52 | The mainspring out and wound back with the winder | Mainspring length (1.9) |
| 33:08–33:40 | Barrel cap, arbor, oiling | |
| 34:00–34:04 | A train wheel's pinion and arbor, side-on | |
| 34:08–34:16 | The balance staff with its rollers, close | Rollers |
| **34:30** | **Bare plate from the train side, reassembly begins, lower train bridge in the opening** | Plan positions |
| 34:52–35:12 | Dial side: the lower train bridge's bar, its screws and jewels | Lower train bridge |
| **35:14–35:34** | **The train goes in: third wheel (35:18–35:22, alone, its pinion countable), centre wheel (35:24–35:30), fourth wheel held (35:33)** | Tooth counts (centre 90, third 80 and pinion 12, fourth 75), which wheel is which |
| **35:36–35:42** | **The sustaining pawl's assembly set in beside the third pillar (35:36 its empty pivot hole in the plate; 35:37.5, 35:40 close and sharp): the arbor, a hub at its foot, the pawl a curved blade from the hub, and its spring, a straight wire upright in the pawl beside the arbor** | Sustaining pawl and spring |
| **35:43–36:13** | **The balance lower bridge on the upturned train bridge, oblique from several sides (35:54, 36:01 the clearest), jewel oiled, cap screwed back** | Lower bridge's form |
| **36:15** | **The train seated, all four pillars standing, oblique** | Pillars (1.2), relative wheel sizes |
| 36:16–36:35 | The train bridge, with the lower bridge, lowered onto the train and screwed down | |
| **36:41–36:49** | **Side-on under the train bridge before the escape wheel goes in: the lower bridge's slab and steps, the fourth arbor, the third pinion** | Lower bridge's heights |
| 11:04–11:30 | The detent with its support block held up to the camera, against a bright background (overexposed; its handedness can't be read reliably) | Detent's shape |
| **40:02–40:44** | **The plate's dial side, dial off, nearly face-on: the lower train bridge's bar with its gilt setting and red jewel, the fusee arbor's pinion, two studs, three pillar screws, a capped jewel; the motion work and the wind indicator wheel going on (40:14–40:44)** | Dial-side plan; the escape arbor's lower jewel |
| 39:30–39:38 | Dial side, settings oiled: the lower train bridge's, and a red jewel under an endstone | Escape lower setting |
| **42:50–42:56** | **Side-on with the escape wheel in: the wheel just under the train bridge, over the lower bridge's slab, its arbor down past the slab to the pinion and the plate** | Heights of the escape wheel and the slab |
| 43:14–43:20 | The escape wheel in a staking tool, its arbor and pinion | |
| 40:15, 40:30 | Dial side: lower train bridge and motion work | Motion work counts |
| **41:58–42:08** | **The cock alone on the mat, top up (41:58), then its endstone cap screwed on (42:03, 42:08)** | The cock's solid form, its counterbored screw hole, its setting |
| 43:48–44:15 | The cock going back on over the balance; **44:00-44:18 low from its straight edge, the arm's underside and the step to the body** | The cock's arm underneath |

### `wcYqdgpyggQ` (BunnSpecial Part 2, 720p)

| Time | What is on screen | Useful for |
|---|---|---|
| 5:10 | Motion work off the dial side | Motion work counts |
| 12:00 | Barrel bridge off | |
| 13:00–15:50 | Barrel and fusee out | |
| 16:40–17:16 | Train side from above: the escape upper bridge and the balance's parts coming off | Bridge shapes |
| **17:20–17:28** | **The escape wheel held in the palm, its pinion visible** | Escape pinion (should be 10) |
| 17:38–19:18 | Balance lower bridge and train-bridge screws out; the train bridge lifted at 18:56–19:18 | Which screws are pillar screws (1.2) |
| **19:30–20:40** | **The upper train bridge off, held to the camera** | Its screw holes (1.2) |
| 20:50–21:10 | Two train wheels on the bare plate | |
| **21:50–23:20** | **The pillar plate bare, train side up, with its four pillars** | Pillars' places (1.2) |
| 23:30–24:10 | The plate's dial side | |

Further moments (2 October 2026): **15:54** the mainspring let down in the barrel (its coils' spacing); **17:50–20:27** the fusee taken
apart: the end plate and taper pin (18:22, 18:25), the winding ratchet (18:20), the sustaining ratchet with the winding pawls and their springs
(18:40, 19:12, 19:15; the other face 19:05), the stop-bar and its spring under the top plate (20:05–20:27); **32:18, 32:30** the mainspring free
on the table; **35:23.66** the centre pinion's leaves from above; **37:59–39:38** bushings oiled, close (the dial side's at 37:59, 38:02);
**38:23–38:41** the setup ratchet going back on.

## Measurements

What was taken from the videos and is now in the model, or recorded as
evidence. Re-run any of them with the command shown (frames from `video.py
frame`, in `$MC_VIDEO/frames`).

| What | Result | Frame | How sure | Command / method |
|---|---|---|---|---|
| Fusee wheel teeth | **90** | `KLUwI2UUCMQ` 27:30 | Certain: all 90 gaps found, every interval clean | `count f_KLUwI2UUCMQ_27-30.png 1988 1140 648 620 FU --band 0.94 0.98` |
| Centre wheel teeth | **90** | 35:26, 35:30, 35:33 | Certain: 90.0 by eye on the eight segments; 88.3–90.7 by fit | `count f_KLUwI2UUCMQ_35-30.png 2576 900 790 690 C --ch S --band 0.94 0.98` |
| Third wheel teeth | **80** | 35:22, 35:30 | 80.0–82.8 by fit (partly hidden); 80 the only count the ratios allow | `count f_KLUwI2UUCMQ_35-22.png 1890 1416 570 504 T --s 0.75 1.15 --band 0.946 0.969` |
| Third pinion | **12** | 35:22 | Leaves 30° apart, by eye | Enlarged crop round the arbor |
| Fourth wheel teeth | **75** | 35:33, 36:15 | 74.1–76.1 by fit; 75 ÷ escape pinion 10 = 7.5 | `count f_KLUwI2UUCMQ_35-33.png 1448 820 520 416 F --s 0.75 1.15 --band 0.946 0.969` |
| Wind indicator wheel | **120** | 23:30 | Certain: all 120 gaps, every interval clean | `count f_KLUwI2UUCMQ_23-30.png 1860 1553 240 220 UDW --band 0.93 0.975 --mind 10 --blue` |
| Centre pinion | **14** (likely) | 13:59.46, 13:59.55, 35:23.66 | End-on (13:59.4–13:59.6, the centre wheel held in tweezers over the plate): 12 consecutive gaps, the arbor hiding about 80°; fitted as equally spaced points on a projected circle, free N 13.82 on both frames, 10.5–11.2 px rms at 14 against 23.8–24.3 at 13 (12, 15, 16: 25–58); the 14 fit puts the next, hidden gap on a dark spot at the arbor's edge, the 13 fit on a leaf. The leaves' top faces as a star at reassembly (35:23.66): 11 ends, free N 14.20, 13.3 px at 14 against 21.0 at 13. Not certain: no frame shows every leaf | Gaps picked by hand, centred on the local dark spot, then the circle fit (crops and scripts in `$MC_VIDEO/pinion/`, outside the repository) |
| Minute wheel | **56** | 23:46.0; 9:06.1; 23:30 | Certain: whole on the mat, all 56 gaps clean in three bands (56.00 ± 0.1); 9:06 gives 55.0-55.8, 23:30 55.6-58.4 | `count` with `--blue`, `--band 0.92 0.98` (`$MC_VIDEO/motion/`) |
| Hour wheel (with the pipe) | **54** | 23:45; 23:30 | Certain: whole on the mat, all 54 gaps clean (54.00 ± 0.1); 23:30 53.8-54.0 | The same |
| Minute pinion | **18** | 9:06.1; 40:22.8; 40:39 | Likely, near certain: 18 leaf ends as dots round the wheel's back (FFT 18.1); the leaves as gilt rods under a disc | By eye and FFT round the ring |
| Cannon pinion | **14** (by the ratio) | 40:16.6; 40:21.2; 40:35 | Inferred: 56, 54 and 18 with the ratio 12 force it; its tips 0.28 of the minute wheel across, leaves about 26 deg apart (13-15); never seen end-on | Ratio; leaf angles |
| Escape pinion | **10** | 43:20.9, 43:20.6 | Likely: side-on in a staking tool, three leaf ends a side, the inner two 36 deg off the silhouette as 10 leaves put them (12: elsewhere) | Leaf ends' offsets on the silhouette |
| Wind indicator pinion | **12** | 40:09.8 | Likely: seven leaf tips nearly end-on, fitted as equally spaced, 12 at 0.81 px rms against 1.16 (13), 1.40 (11) | Picks and least squares |
| The Hamilton dial's proportions (3 October 2026; a photograph, not a video) | Face-on, from pixel profiles along the 12-6 and 9-3 lines: the minute track r 241.1-251.8 px about (429.5, 429), the seconds centre 129 px below it, its track r 97.9-106.8, the UP-DOWN centre 142.8 px above, its ring r 66.9 and its hand 58.5 long, the dial showing to r 274 inside the bezel, the 9 50 px tall. On the fourth's 21.6 mm (0.1674 mm/px): the track r 40.4-42.2, the seconds track 17.9, the UP-DOWN centre 23.9 (the video's stud 22.9: another movement), its ring 11.2, the opening 45.9 (the model's bezel 45.9). So the 95 mm dial stands and its printed track was 9 % too large; the Navy dial at 46:44 (its centre hidden under the hands, the frame oblique) gives 0.44-0.49 of its track by cross-ratio, inconclusive | `References/photo-dial-hamilton-maritime-commission.jpg`; `KLUwI2UUCMQ` 46:44 | Likely: lines to about 1 px; the scale rests on the seconds' centre (129 px, ±1) | Pixel profiles (Review-results.md, Elsewhere 24) |
| The Hamilton hands' outlines (4 October 2026; a photograph, not a video) | Sections across each blade every 0.5 mm (edges at half the contrast against the silver, those crossing print left out), from the bosses' fitted circles (the hands' (426.3, 428.9) px, r 3.34 mm; the UP-DOWN hand's (427.0, 286.9), r 1.86, to 0.2 px). Hour: the stem 1.3 at the boss, 1.98 at 11.5 mm, 0.9 at 21.3; the bulb's back a circle r 1.93 about 23.6 (widest 3.85, 0.67 of the hand), its front drawn in to a needle 0.3 wide from 32 to the tip at 35.2. Minute: 1.0 at the boss widening to 1.9 at 29, drawn in to 0.95 at 35 and a needle to the track's outer line, 42.2; a bevel down its length (two tones). Seconds: a needle 0.25 to 17.6, its counterpoise a stem 0.38 to an arrowhead with a square back at 7.72, 1.15 wide, its point at 9.55. UP-DOWN: a needle 0.42 narrowing to 0.25, to 9.8 | `References/photo-dial-hamilton-maritime-commission.jpg` | Likely: widths to about 0.1 mm, lengths to 0.2; the needles (about 0.3) at the photograph's blur; the minute hand's widest point ±0.15 (between lines of print) | Pixel sections (`HAND_W`, core.js; SHAPE-PASS.md, 1) |
| Up–down scale sweep | **315.7° in 56 h** | `References/photo-dial-hamilton-maritime-commission.jpg` (not a video) | Ticks 8 h apart at 67.9°, 111°, 156.7°, 201.6°, 247.5°, 293.2° from 12: 45.1° each (a line through them: 5.65° an hour, 316°) | `video.py ticks 427 288 8:486,264 16:487,311 24:452,346 32:404,346 40:369,312 48:371,264` |
| Wheel size ratios | centre ÷ third 1.36–1.39; centre ÷ fourth 1.48–1.5 | 35:30, 35:33, 36:15 | Same frame, nearly the same plane; ±3 % | Ellipse axes from `count`'s fit |
| Third arbor's distance from the centre | 16–19.7 mm (model 13.05) | 14:45, 13:51 | Rough: affine fit, rim rms 2.4–2.8 mm; on the same fit the barrel bushing lands at r 23.2 (model 18.6), so it can't place parts | `video.py plate f_KLUwI2UUCMQ_14-45.png 1876 960 1830 1504 T:2100,1356 Fu:1524,624 Ba:2516,896 E:1570,1324` |
| Balance lower bridge's settings | The balance's cap and the fourth's setting, in Fig. 30's order (ear and screw, the train-blocking screw's point, the fourth's setting, the cap, the arm) | 13:49, 35:54, 36:01; the parts list (42065) for which settings | Certain | By eye; the cap's jewel and two screws seen from above too (13:44) |
| Balance lower bridge's form | Two levels: a slab (the lower level) curved as a lens, its convex edges chamfered, and a lug at each end (the upper level) against the train bridge, each with a large screw; the slab's concave edge follows the train bridge's round escape lobe, and the escape wheel turns between the slab and the train bridge (until 2 October 2026 read as an L round the escape arbor) | 10:30, 36:41, 42:56 (side); 13:44, 11:00 (above); 36:01, 13:49.5 (below) | Certain | By eye |
| Slab's height | 8.8–11.9 mm above the plate (42:56); its underside 8.4–9.4 over three views; model 7.9–10.9 | 42:56, 36:41, 10:30 | ±0.7 mm | Pixels along the pillars (16.8 mm) at the slab's depth |
| Escape wheel's height | 15.6 mm above the plate; model 15.1 | 42:56 | ±0.5 mm | The same |
| Settings' spacing on the slab | Cap to escape passage, cap to fourth's setting, passage to fourth's setting 8.6 : 10.8 : 11.6 (angle at the cap 73°); 10.8–11.8 mm from cap to fourth's setting by two rulers. Model's balance, escape and fourth arbors 9.4 : 18.9 : 10.6 | 13:49.5 | Ratios certain; mm ±10 % | Pixels on the face-on underside; rulers: the train bridge's rim and barrel cut, and the escapement's 9.4 mm (Review-results.md, "The balance lower bridge", 14) |
| Balance lower bridge's size | One plate about 26 × 23 mm, its lugs reaching about 40 mm end to end; its two screws 31–36 mm apart at the ends of its long axis (model 31.7) | 13:49.5, 36:01 | ±10 % (13:49.5); ±0.5 mm (36:01) | The rulers above; the camera below |
| Balance lower bridge in mm, face-on | In the train bridge's frame (the model's): the slab a lens, its outer edge a circle r 20.8 about (11.90, 22.74) (0.2 mm rms over 13 points), a flatter convex edge r 25.7 about (19.94, 21.10) to the fourth's end, a straight edge from (−6.06, 26.22) to (6.17, 26.77), and a concave edge on the escape lobe's circle, r 7.14 about (13.81, 15.51) (0.04 mm rms); the cap's jewel (3.79, 9.75) and the fourth's setting (2.89, 20.73), 11.0 mm apart (model 18.9); the screws (20.70, 7.23) and (−9.18, 21.87), 33.3 mm apart; the lugs traced. The model's balance is 5.2 mm from the cap, its fourth arbor 4.3 from the setting (3.8 since the 14° turn, which turns the bridge with the train bridge and not the fourth) | 13:49.5 | ±0.5 mm over focal lengths of 5000–7000 px (6000 makes the face's axes orthonormal); the picks by eye at 4K, about ±10 px (0.3 mm); the heights (slab face 7.9, lugs 3.3 mm off the bridge) to ±0.5 mm | `python framecam.py anchors/lower_bridge_13-49.5.json` after `video.py anchor anchors/KLUwI2UUCMQ_13-49.5.json` (Methods) |
| Balance lower bridge in mm (on the mat) | On the model's plan, turned by the centre, third and fourth settings (1.0, 1.8, 1.5 mm off the model's): the cap at (3.8, 11.5), the fourth's setting (1.0, 22.8), the escape opening's centre (11.5, 16.3), the train-blocking screw's dog point (−5.2, 19.6), the screws (20.5, 12.4) and (−12.0, 22.1), and the slab's and lugs' outlines (`tools/lower_bridge.py`, `VIDEO`). The cap 12.0 mm from the fourth's setting (model 18.9 then, 16.6 since the 14° turn) | 36:01 | ±0.5 mm over focal lengths of 5000–8000 px; the picks by eye at 4K, about ±10 px | `python rimfit.py rimfit_36-01.json` (Methods). Turned by the model's centre, third and fourth arbors, so it puts the bridge where those are; 13:49.5 (above), anchored on the train bridge itself, is the one the model follows |
| The balance against the barrel bridge | The endstone at (7.0, 6.8), 1.0 mm from the model's balance (5.9-9.2, 6.1-7.5 leaving out any one point); the fusee's post about 2.6 mm from the model's arbor | 6:29 | ±1.5 mm (fit rms 38 px) | `video.py fit tools/anchors/KLUwI2UUCMQ_6-29.json`, then `unproj ... -38.26 1630,535` (Review-results.md, "The balance lower bridge", 14) |
| The dial side's angles about the centre | From the indicator's stud (12): the fourth's jewel 176°, the minute stud 86-91°, the fusee's bushing 43-45° (the fits 30.3; the model 44.3 since the photographed group was turned 14°), the bushing taken for the barrel's -77 to -81° (the fits -89.4; the model -76.6) | 40:08 | Rim rms 0.15-0.21 mm, the centre within 0.1 mm, over 4000-8000 px; picks by eye at 4K | `python rimfit.py rimfit_40-08.json` (Review-results.md, "Elsewhere", 19) |
| Wind indicator wheel's size | Tips about 35-38 mm across (model 22.4): its long axis against the train bridge's rim (r 40.5) beside it; the wheel lies propped on its hub, nearer the camera, so perhaps 5-10 % less | 23:30 | ±10 % | Ellipses fitted to the wheel's tips and the two bridges' rims (`cv2.fitEllipse`, RANSAC); the bridges' rims don't fit one camera, so a ratio, not a rectification |
| Third bushing from the centre | **16.0 mm**, at 22.7° from the 6 o'clock line (model 13.05 at 21.9°); 15.7 on the bare plate | 13:49.5; 14:45 | ±0.6 mm | A homography on five train-bridge holes matched to model holes (0.2–0.6 mm); the plate rectified by its rim and centre bushing (Methods) |
| Train pillar's profile | Straight shaft r 2.7; foot collar r 2.9 × 3.3 mm, top collar r 3.3 × 3.4 mm (model: foot r 3.4 × 1.3, neck r 2.3, top r 2.9) | 42:56 | ±0.15 mm | Pixels across the pillar, scaled by its height (16.8 mm) |
| Balance cock's form | One solid block: its outer wall follows the rim the full height (14.2 mm) to the train bridge; only the nose is an arm, about as thick as a plate, over the balance; one screw, its head in a counterbore | 41:58, 23:45, 2:36, 6:29 | Sure of the form; the arm's thickness and where the body steps down to it are estimated | Frames by eye, against the model rendered at matching views (`views.py close --look`) |
| The balance cock's arm underneath (4 October 2026) | **Flat underneath out to the body's wall, a square step; no cove**: the cock in place seen from its straight edge, the space under the arm open from the barrel bridge's horn, 16.4 mm from the staff, to the body's wall, 18.6; the arm's side about 2.9 ± 0.3 thick there. The 41:58 view's apparent kink at 13.25 along the concave edge is that wall seen under the arm | 44:02 (4K; the moment 43:48-44:18 catalogued below as the cock going back on), 23:45, 41:58 | Likely for the form; the places through a homography on the cock's top (the cock screw's counterbore, the setting, the cap's screws, the stud's holes and the arc's corner 30: 4-36 px) | Picks and crops with rulers |
| Barrel bridge's horn on the cock's side | Ends 2–9° round the rim from 3 o'clock, at the cock's straight edge (5°): the cock stands on the train bridge in the bridge's opening | 23:30 (flat), 6:47 (cock off) | About 2 mm: the flat bridge mapped through the fusee and barrel bushings and the plate's centre; at 6:47 the bridge's edge meets the rim where the cock's straight edge does | `video.py frame`; the map by hand |
| Barrel bridge's other horn | Ends about 112–114° round, with a cut toward the centre; the top-view photograph shows a screw on the bridge there, about (−10.8, 25.1) (in the plan before the 14° turn of 2 October 2026; `PT` in `movement.js` takes it to the present one) | 23:30; `References/photo-top-view.jpg` | Rough, ±3 mm; not yet in the model (see the gaps below) | As above, and `topview.py`'s five-screw map |
| The cock's steady pins | Two plain holes in the train bridge under the cock, about (36, 4) and (27, 20) | 6:47 | About 2 mm | By eye, against the cock screw's tapped hole |
| The far horn's end and screws | Cut from (−5.45, 21.46) on the balance opening to the rim at about 100°; a screw proud of the horn at (−11.07, 26.46), a train-bridge screw sunk in a hole through it at pillar 0 (−17.2, 23.0) | `References/photo-top-view.jpg`; 23:30; `wcYqdgpyggQ` 12:05 (bridge off: the pillar-0 screw remains) | About 0.6 mm in the photograph (five-screw map at the bridge's height); about 2 mm on the flat bridge | `topview.py`'s five-screw map, by hand |
| Upper train bridge's notch, horn and mouth | The notch round the fusee one circle, r 16.57 about (11.46, −17.47); the horn's sides that circle and the barrel's cut, ending in a straight cut about 2.9 mm across, 12.4 mm from the centre; the mouth a sharp corner at (28.0, −18.7), then straight to the rim at −23° (the model's was a wavy trace of Fig. 67 with a round-ended horn 7.5 mm out and a mouth at −40°) | 23:30 (flat, face up), 13:49.5 (turned over) | Notch ±0.5 mm (0.12 mm rms, the two frames within 0.4); the horn's end ±1 mm (13:49.5 only); the mouth's corner ±0.3 mm, its edge ±1–1.5 mm (23:30 only). 13:44's fit is too loose for it (its holes 1.2–2 mm off): it put the end at 16.5 mm | `video.py anchor anchors/KLUwI2UUCMQ_23-30.json` and `anchors/KLUwI2UUCMQ_13-49.5.json` (their unmap points), then `train_bridge.py`; the 23:30 contour segmented from the mat as `rimfit.py` does |
| Upper train bridge's third screw | In a counterbore about 5.3 mm across at the end of the tongue beside the notch's mouth, (32.25, −10.81) (no hole at the model's old (29.24, −12.28)); driven in at 36:34 with a fluted pillar under it, as the manual has all three train-bridge screws in pillars | 23:30, 36:26, 36:34 | The hole ±0.5 mm (23:30's fit); the pillar under it by eye, sure of the arrangement | `video.py anchor anchors/KLUwI2UUCMQ_23-30.json`, the hole's centre unmapped; 36:26–36:34 by eye |
| The bare plate's fusee, barrel and pillars | Fusee lower bushing 20.1–20.4 mm from the centre at 49–50° from the 12 (model 22.9, 44.3° since the 14° turn; 30° before it, when this read 47°); barrel's 22.1–22.7 at 281–282° (model 18.6, 283°); the pillars 31–38 mm out (model 28–32.5), 2–8° round from the model's turned ones (15–20° before the turn); against the train's arbors as they now stand (`Review-results.md` 22) | `KLUwI2UUCMQ` 34:30 (4K) | Bushings ±1 mm, pillars ±1.5 (one ±5: its top out of frame) | `rimfit.py rimfit_34-30.json` (rim traced with the pillars and the screwdriver masked, `rim_pts`; the four gilt settings as rings) |
| The bare plate again, the train in | Fusee bushing 20.3–20.8 mm from the centre, barrel 21.4–23.5, the fusee–barrel angle 132° (34:30: 123°; model 121°); pillar tops 29–40 mm out, 3–5 mm off 34:30's | `KLUwI2UUCMQ` 36:15 (4K) | Fusee and barrel ±0.5 mm; the pillar tops (16.8 mm up) poor: tied to the rim, the tilt moves them most | `rimfit.py rimfit_36-15.json`: the rim traced along rays and fitted (7 px rms), tied to the centre wheel's tips (`centre`; untied, the tilt swings 36–46°) |
| The sustaining pawl | Arbor's foot 21.8 mm from the fusee axis at 67° round it (65.6–67.7° over f 5000–8000; model 21.35 at 74° before it was moved there); about 25 mm from the centre, 14 mm from the third pillar. Its spring a straight wire (about 0.25 mm thick) set upright in the pawl about 2.4 mm from the arbor, as tall as the arbor (no collet, no wire across); the hub below the pawl about 1.3 times the arbor's width, the pawl 4–5.5 mm over the plate. With the train bridge on (36:23–36:29) arbor and wire rise under the bridge in the fusee's notch, and two small sunk holes stand side by side on the bridge's face over them | `KLUwI2UUCMQ` 36:15 (4K); 35:37.5, 35:40; 36:23–36:29 | Place about 1 mm (the anchors land 0.9–1.3 mm off); the wire's offset and the hub's size about 0.3 mm (a reading at 16.8 mm up is several mm out on this camera, so offsets are taken between points at one height); where the wire's top goes is inferred. At 36:23 the arbor and wire show through the notch just under its wall: so does the model, looked at the same way, with the arbor about 4.5 mm in under solid bridge (the camera looks steeply down past the wall) | `rimfit.py` on `rimfit_36-15.json` with the arbor's foot (2350, 725, h 0) and top (2412, 285, h 16.8), the wire's top (2487, 277, h 16.8) and anchors centre, fusee and barrel |
| The sustaining pawl again: its foot overhead, and its blade | The arbor's foot 21.7 mm from the fusee axis at 71° (the model now 21.8 at 69°, between this and 36:15's 21.8 at 67°). The blade (its two edges traced; the model's outline is drawn through them) a curved blade about 10.3 mm long, ending in a short straight face, bowed about 1.3 mm off its chord away from the ratchet; across it about 3 mm at the root, 2.7 at the middle, 1.5 near the tip; the spring wire in its root on the bowed side, about 2.7 mm from the arbor. Not used: two small sunk holes 3 mm apart on the train bridge's face beside the notch (13:44) put through that frame's homography land 2.5 mm from the foot's readings; that homography was fitted to the bridge's holes as the model had them before 2 October's layout moves, and a screw hole it maps lies 5 mm from the model's now | `KLUwI2UUCMQ` 14:06 (4K, nearly overhead), 36:15, 13:44 | The foot about 1.5 mm (leaving any one of the six points out moves it at most that); the blade's edges about 0.5 mm, at a height that makes the traced arbor's axis and the wire's offset agree (6 mm over the plate, where the model's pawl is) | A homography (OpenCV) from the centre (1830, 790), fusee (1440, 390) and barrel (2560, 720) bushings and the feet of the third (760, 660), second (1424, 1770) and first (2776, 1470) pillars at their model places, the foot at (1083, 895); the blade's near edge (2392, 648)...(2680, 652) and far edge (2450, 562)...(2690, 628) on 36:15 through `rimfit_36-15.json` at h 6 |
| The upper train bridge's middle opening, its end and its seats | Two lobes, over the balance (r 4.63, 0.12 mm rms; centred 0.6 mm from the model's balance on its cap) and over the fourth's setting on the lower bridge (r 4.27), and the escape passage (r 4.71), joined across the plain face round the lower bridge's setting; either side of the passage a seat for an end of the escape upper bridge with its screw and pin holes (the model's bar screws land in them); the end past the barrel a straight cut from 36.9 mm out to the rim at 40.4 | `KLUwI2UUCMQ` 23:30 (4K); `wcYqdgpyggQ` 20:20 (the lobes, the lower bridge under them) | Lobes ±0.3 mm (the fourth's and the passage's ±0.9: partly hidden); the end ±0.2 | Picked at 3× and put on the face through the anchor's homography (`tools/train_bridge.py`: `KEY23`, `SEAT23`); the end read on the frame rectified to the model's plan |
| Pillars on the bare plate | Bases 32.7, 42.0, 37.9 and 32.3 mm from the centre (model 28.0–32.5), pairwise 40–78 mm (model 34–63): about 1.2 times the model's spacing | `wcYqdgpyggQ` 22:00 | Rough: picks by eye at 720p; the rim fits an ellipse to ±1.6 mm | Rim ellipse (`cv2.fitEllipse`), rectified to 43.8 mm |
| Escape arbor's place (**withdrawn**: the balance, checked on the top-view photograph, and the train's meshes fix the escape arbor where the model has it; these fits share an error) | The escape jewel at (12.90, 12.90): 18 mm from the centre, 44° from the 6 o'clock line toward 3 (model (7.19, 16.14), 24°). The bridge's end screws 8.3 and 8.6 mm either side of it, about along the 6 o'clock line. Escape lobe centred about (12.6, 15.4), r 7.0; balance lobe about (5.4, 10.4), r 4.9. Contradicts the fourth arbor at (0, 23.9): not in the model (Review-results.md, "Elsewhere", 18) | 10:00; 13:44; 13:49.5 | Angle ±3°; mm ±10 % (the rim's 40.5 is the ruler) | `video.py anchor` on the rim, the barrel cut and the centre bushing (`tools/anchors/`) |
| Escape upper bridge's form | A long straight plate, rounded at both ends, the jewel and its two-screw cap in the middle and a screw near each end, symmetric about the jewel (model: a stadium reaching 7.5 mm beyond the arbor, both screws beyond it). End screws about 2.5 × as far from the jewel as the cap's; in the model since 1 October 2026 (end screws ±8.0 mm, cap r 4.4) | 10:00 | Form certain; distances rough (no ruler in the frame) | By eye (Review-results.md, "Elsewhere", 17) |
| Fusee wheel's recess and sustaining spring | Recess wall r ≈ 18.0 (model 15.2); bore r ≈ 2.6–2.9 (model 1.05); a raised disc to r ≈ 9.3 and a hub round the bore on the recess floor. The spring a flat blued band r 15.8–18.0 (about 2.1 mm wide; model 0.7 wide, r 13.2–13.9) against the wall; its fixed end widened inward to r 12.8, with two holes at r 15.9 (159° and 199° counterclockwise from 3 o'clock, face up); steel round about 335° of the recess with a gap of about 20°, a lighter end piece at the bottom carrying an upright pin at r ≈ 14.6 (model: 250°) | 27:26 (27:20–27:50) | Radii ±0.3 mm (near face-on, scaled by the 40.87 mm tips along each axis); whether the lighter piece is the spring's own working end: likely, not certain | Brightness profiles along four radii and round three circles of the full frame (centre 1988.5, 1149.5; 32.2 and 30.5 px/mm) |
| Fusee's top | A steel collar r ≈ 2.9 round the arbor, standing on the top plate; the plate's two screws opposite each other at r ≈ 7.0 (model: no collar, the plate's hole r 1.02, screws at r 3.2). *4 October 2026:* the collar goes through the plate: the plate is lifted off over it and the collar stays on the arbor (19:58-20:00), standing on the hub with the plate off (20:20), so the plate's hole is about the collar's size, as Fig. 28 draws it; the collar 235 px across against the plate's 720 on 13:30, r 0.326 of the plate's (r 3.0); it stands about 1.5-2 mm over the plate (19:45, oblique; 2.8 over the top layer side-on, the row below); above it the arbor reads 0.66-0.75 of the collar's width (not r 2.2, as first read: the 180 px there took in the hole round the collar) | 13:30, 17:23, 19:45, 19:58-20:00, 20:20 | ±0.5 mm (ratios to the top plate, r 9.15, face-on); the form certain; the heights and the arbor's radius ±30 % (oblique) | By eye on the frame; pixel widths on full 4K frames |
| The fusee arbor above the fusee (4 October 2026) | Side-on, plate off (20:00): the collar, then a plain shaft, a ring-line step, the winding square with a flat and a rounded end. Along the axis, scaled by the groove's pitch (the flanges 38-41 px apart near the top, 1.024 mm a turn): **the collar 2.8 mm over the top layer**, the shaft 8.2 (the step about 11 mm up, y ≈ −31.5), the square and end 6.5; the whole 17.5 mm, as the model's. Across, the shaft 0.66 of the collar's width (19:59 and 20:00 alike; 0.72-0.75 on 19:45 and 20:20): r ≈ 1.75 if the collar is r 2.65 (model) | 20:00, 19:59, 19:45, 20:20 | Lengths ±10 % (the scale falls off up the arbor); the widths only as ratios: a polished cylinder shows the blue mat near its limbs, so a silhouette against it reads narrow (137 px for a collar the face-on 13:30 puts at r 2.8-3.0) | Widths: the run of non-blue pixels across the axis, every 15 px along it; the pitch: brightness peaks along the flanges' normal |
| Dial take-off slot (Fig. 21) | A rectangular notch in the mounting ring flange's rim, about 1.4 mm wide and 2.2 in from the rim, its floor brass (not through); **167° clockwise from 12 seen from the dial**; the blade goes in there between dial and flange to lift the dial (8:46–8:49) | 8:46–8:49, 9:03 | Angle ±3° (12 from the indicator's stud, −119.0°, and the bore's relief, −119.5°; checked by the fusee's bushing at 43.2° and the fourth's jewel at 174.7°); sizes ±0.4 mm (35 × 58 px at about 25.8 px/mm) | An ellipse fitted (RANSAC) to the flange's outer edge found by rays out from the centre; points normalised on it (affine, so a few degrees off where perspective tells) |
| The flange's holes (9:03, 40:05, 8:36-8:42; 4 October 2026) | The flange unrolled by angle and radius (9:03): three small holes near the rim, r ≈ 46, at **130.4°, 224.4° and 319.4°** from 12: the dial screws, which go in from the train side into the flange outside the plate's rim (8:36-8:42, Op. 19); three large threaded holes at r ≈ 41-42, **88.5°, 212.3° and 337.8°**, a screw end in one: the mounting ring's screws, tapped through the flange (40:05 shows the threads); one small hole at **2.5°, r ≈ 43** (inside the plate's rim, so not a screw from the train side: perhaps the dial's steady pin). No fourth hole at r 46 where the flange shows (40:05 shows 340°-100° plain). The model: dial screws 38.0°, 152.6°, 223.7°, 323.5°; ring screws 70°, 190°, 300°. The top-view photograph (2E11795, another movement) shows three flange screws and one half under the plate's rim, but its map (`tools/p3map.json`) doesn't fit this copy of the image, so their angles aren't read | 9:03, 40:05, 8:36-8:42 | Angles ±3°; radii ±1 mm | `unroll` of the frame through the ellipse fitted to the flange's rim, 12 from the indicator's stud and the relief |
| Fusee's large end and arbor | A wide raised outer rim (Op. 23's "elevation at outer rim"), then the steel winding ratchet in a recess with two slotted screws; the ratchet's tips about 0.47 of the large end's radius, r ≈ 8.5 (model 9.85). Past it the arbor has a steel collar r ≈ 2.7, on which the sustaining ratchet and the fusee wheel ride | 28:08, 28:17 | Rough: oblique, ±1 mm | Ratios along both axes of the tilted outline |
| Sustaining ratchet | Gilt brass (model steel); slotted screw heads on its face toward the fusee wheel, so the winding-pawl spring screws go in from that side, as Fig. 28 draws one (model: heads on the pawl side) | 28:32–28:44, 28:53–29:14 | Certain for the colour and the slots | By eye |
| Setup ratchet's teeth | **About 42 ± 2** (model 52): pitch 8.3–8.8°; spectral peaks 41–43 and the pitch fitted round the turn 40.3–41.3 on four frames; the top-view photograph's window in the cover about 8.3° | 11:58, 12:19, 38:28, 38:32.5 | Certain that it is well under 52; the count to ± 2 | Unrolled rim, spectral and edge counts (`$MC_VIDEO/c2/scripts`) |
| Setup click and its spring | The click a short lever, its pivot about 10 mm from the arbor, its tip about 5.3 mm from the pivot and 32° round (model 4.5 mm, 30°). Measured again (3 October 2026) against the ratchet and the cover screws' tapped holes (23.6 mm apart): the ratchet's tips at 7.04 mm, the pivot 1.34 tip radii out (9.4), the tip 0.73 (5.1) from it; the readings by eye had taken the model's ratchet (8.16) as the scale; the photographs put the pivot's end at 8.95: it holds the arbor against turning counterclockwise seen from above, as the model's. The spring a flat blued band about 0.9–1.0 mm wide, wrapping about 180° round the ratchet at r 10–10.7 from the click's back past 6 o'clock to just past 9, where it is held (model about 120° at r 9.8, thinner); Fig. 108 draws an arc of about 180° | 11:58 | Click: likely; spring's form: certain, its sizes ±0.5 mm | By eye against the ratchet's radius |
| Setup cover | As the model's waisted plate: arc ends on feet, a counterbored screw hole near each end, the pivot screw's end near one end; its centre hole about r 3 (model 2.6). The arbor's square stands about 8–10 mm above the ratchet (model about 5) | 11:46 | Form certain; sizes rough | By eye |
| Fusee end plate | Gilt brass (model steel), about 14 mm across (r 7, as the model's), a raised boss round its hole with a slot across it for the taper pin (Fig. 69); the pin crosses the arbor over a dark steel ring, both ends standing out | 18:22, 18:25, 17:55 | Likely | By eye against the fusee wheel (40.9 mm on that frame's scale) |
| Fusee's winding ratchet | Dark steel, **about 36 teeth** (spectral 36, 35 and 37 close; model 40); one of its two slotted screws seen | 18:20 | Likely, not certain | Spectral count round the rim |
| Winding pawls and their springs | On the sustaining ratchet's face toward the fusee, gilt, with a raised central plateau: each pawl a short dark lever on a stud; each spring a long thin arc of about 150–170° in the gutter round the plateau, held at its far end, the two together nearly round it, as Fig. 28 draws them (model: short bent strips). Four small holes near the springs' far ends (Op. 42's four screws); the other face (19:05) about ten holes and screw ends | 19:12 (best), 18:40, 19:15, 19:05 | Form certain; what the other holes are, open | By eye |
| Stop-bar and its spring | Under the top plate: a round recess about the arbor (r about 4–5) with a hub, the plate's two screw holes; a straight slot across the top beside the hub, open at both ends, its centreline about 3.5–5 mm off the axis (Fig. 28's 3.6; model 2.0); the flat steel bar with a hole near one end; its spring a round wire bent into an open C of about 270° with a hooked end, in a groove round the hub (Fig. 28) | 20:05–20:27 | Form certain; sizes ±30 % | By eye against the top plate |
| The barrel's size (**new, to settle**) | **About r 18–19, not the model's 13.5**: the barrel's cap 608 px across against the train bridge's rim's 1221 px (r 40.5) beside it, about 40 mm (37–39 for its height toward the camera); in place (13:12) about as wide as the fusee wheel; the train bridge's measured cut round it is r 19.2; the side photograph's coils 1.4 times further apart than a 13.5 mm barrel gives (Review-results, "Noted, not changed"); the mainspring's coil spacing (15:54) is the parts list's 0.419 mm only in a barrel about 36–37 mm inside | 23:30, 13:12, 15:54 | Likely; needs a camera fit before the model changes. *Fitted (2 October 2026): the top lip r 18.3 (17.4–19.6), certain above 14.5; the model's barrel now r 17.6 under a 0.7 lip.* The anchor's homography on 23:30 fits no real camera (the bridge rests 15–20° off the mat on its rim and the lower bridge's slab), so the fit took the barrel as an upright cylinder of its own and scaled it by the bridge's lowest point on the mat; f 2800–4500 px on this frame (the project's 6000 is weakly founded here); the cut round the barrel fitted freely reads r 21–22 (weak) | Cylinder fit to the barrel's traced silhouette (`$MC_VIDEO/barrel/`), scaled from the bridge |
| The barrel's height | **16.5 ± 1.2 mm** cap to cap (model 13.2, now 16.5) | 33:09.5, 33:12, 33:35; 23:30 | Certain taller than 13.2; the value likely: side-on, the near end's ellipse (RANSAC, 0.7-0.9 px) and the far end's reach give height to radius 0.95 ± 0.06 with no camera; 23:30's cylinder fit agrees only at f 2500-3200 (R 17.5-18.3, H 15.6-16.3) | `$MC_VIDEO/barrel2/side.py` |
| The train bridge's cut round the barrel | **r 21.0-22.0**, centred 24.6-25.1 mm out (model r 19.2 at 22.56; now 21.0 at 24.8), about 2 mm further out than the barrel's arbor | 23:30 (face up); 13:49.5 | Likely: the camera fitted to the rim (r 40.5) and the centre bushing at each focal length, the cut's points put back on the face, a circle with centre and radius free, 0.06 mm rms | `$MC_VIDEO/barrel2/fcal.py` |
| The escape upper bridge, close (2 October 2026) | The bar flat, round-ended, 1.31 times its end screws' spacing long (about 21-22 mm), **5.0-5.6 wide (likely 5.2; model 4.0)**, 0.9-1.1 thick; under its middle a round **boss r 3.7-4.1 hanging 1.5 ± 0.3 mm** below it, wider than the bar; the end screws **countersunk, flush**; the ends in **recessed, frosted seats** in the train bridge, each with a **steady-pin hole** about 1.6 mm further out than its screw and 1.3 mm off the axis toward the balance. The cap a **disc R 4.0-4.4, cut flat on both sides flush with the bar's edges** (each flat 0.62-0.64 R from the jewel), about 1 mm thick, sunk in the bar flush with its top and resting on the boss; its screws 3.1-3.3 mm from the jewel. Fig. 110-2 draws the raised round middle; the parts list gives the bridge "complete with pins" | 10:00, 10:02, 10:16, 10:22, 10:26, 10:50 | High on the form (boss, flats, countersinks, pin holes exist); sizes medium, as ratios to the end screws' spacing (16.0-16.9 mm) | `$MC_VIDEO/escape/` (`h1050.py`, `NOTE.txt`) |
| The balance lower endstone cap | **Round, one flat** about 0.65 R from the jewel, parallel to the line of its two screws (at 0.71 R), on the side away from the escape arbor; paired punch marks on the cap and the bridge. Fig. 30 draws it round. The escape lower cap (40:08) sits in a round recess in the pillar plate; whether it is on is unclear | 13:49.5; 35:43; 40:08 | Likely (the side read through the 13:49.5 anchor; the cap stands off the anchored face, so its sizes as ratios only) | `$MC_VIDEO/escape/c13-49_cap.png` |
| The detent support block's screw and pins | The screw, a slotted head in a counterbore in the train bridge, about 1 mm from the model's in the bar's frame (16.1 mm from the escape jewel, model 17.0). Two pin holes in line with it either side, **5.7 and 5.5 mm** from it, the line parallel to the escape bridge as in the model; the far one about 2.6 mm further out than the model's (then) shortened pin, where Fig. 90 puts it (Fig. 90: 11.85 mm apart, symmetric, screw 4.1 mm toward the foot from the point of flexure, pins r about 0.5) | 10:00, 10:45-10:50, 13:44 | Medium-high on the place; the spacing to about 10 % (the 10:00 fit's scale) | `$MC_VIDEO/escape/` |
| The train-blocking screw | Its **dog point 6.35 mm from the fourth's setting** (6.3-6.5 over f 5000-7000 and its height; model 4.5), 2.2 mm off the line to the lower bridge's far lug screw; Fig. 30's proportions give the same (0.59 of the fourth-to-cap distance). Its access hole through the upper train bridge, **about 2.5 mm across** at the top (model r 0.72), is the dark hole of the top-view photograph at about (2.7, 18.1) (three readings within 1.8 mm). The tapped-looking hole at (11.24, 29.51) on that photograph maps 1.0 mm from the block's far pin hole, so likely that pin's hole, not a screw's | 13:49.5 (framecam), 10:00; top-view photograph | Medium-high (the dog point ±0.4 mm); the photograph's holes medium-low (a two-screw similarity) | `$MC_VIDEO/escape/lb_tbs.json`, `sim.py` |
| The fourth arbor, the pillars, the indicator and the ring (2 October 2026; **at the plate's assumed 87.57 mm**: see the scale question below) | The fourth's setting **r 21.4-21.7 at 179-181 deg** (model 23.9 at 180), the dial side's bore in the bar and 34:30's red jewel agreeing to 0.3 mm; with it the model's balance is 11.3 mm from the fourth, as the video's 10.8-12. The third's setting r 16.4-16.7 at -148 to -150 deg (model 16.0 at -157.3). The pillars' feet r 34.1-34.7 (model 32.0-36.1): train 1 34.4 at 166.3 deg (model 36.1 at 171.0), train 2 34.3 at 84.3 (34.0 at 85.5), train 0 34.1 at -125.3 (32.8 at -121.5), the barrel pillar 34.7 at -19.1 (32.0 at -17.7). The indicator's stud r 22.9 at 0 deg (model 23.6), the minute stud 11.3 at 90 (model 10.5). The ring's bore about 38.2 at the plate's face (model 40.2), its top 6.1 over the plate (6.54); a relief cut into the bore's top either side of the 12 (about -11 to +10 deg), its edge about 16.5 from the stud, room for the indicator wheel's tips (certain it exists; its size rough). The lower train bridge's bar stands 4.3-5.4 mm over the plate's dial face (model 1.2) | 40:08 (f 5100-7000), 34:30 (f about 5000) | Likely, each to about 0.4 mm and 1.5 deg at the plate's scale; 36:15's fit (f about 11400) distorted, not used | `$MC_VIDEO/layout/` (`dial40.py`, `bare.py`, `sim.py`, `NOTE.txt`) |
| The lower train bridge (3 October 2026; at the plate's scale, the 40:08 fit scaled by 0.955) | A steel bar **4.4 mm thick** (its top's near edge over its wall's foot: 4.2-4.9 over f 4500-6000, the wall alone 4.2-4.3; model 1.2), **about 10 wide** (9.7-10.3; model 6), from **18.3 mm short of the third's setting to 10.3 past the fourth's** (model 21 and 9.6), its screws on the middle line **13.6 and 6.1** out (model 14 and 7.5), their heads about r 2.2 flush in counterbores r 2.4, the settings in counterbores r 3.0, sunk a little below its top; its right end stops just short of train pillar 1's dial-side screw (166.6 deg), which the model's 170.8 put under it | 40:08 | Likely: edges picked by eye at 4K and put on the bar's top plane through the fitted camera; the width and length to about 0.5 mm | `$MC_VIDEO/layout/d40bar.json` with `dial40.py` |
| The plate's opening under the lower train bridge (4 October 2026) | A keyhole of three lobes, not the model's round hole r 6: a **circle r 11.3 about the third's setting** (34:30, the blue mat seen through it from the train side, every edge point fitted to whichever of the bore's two rims bounds it: r 11.2-11.3, centre 0.3-0.5 mm off the third, over f 4000-8000; 40:08, its far arc beyond the bar from the dial side: r 11.42-11.53 about the third), a **lobe r 4.85 at (2.9, 10.9)**, toward the balance, between the bar's settings on its far side (40:08, the rim's highlight traced from brightness profiles: (2.92, 10.7-11.1) r 4.76-4.89 over f 4500-6000; 34:30's own fit put it 1.5 mm further out, but the 40:08 circle projected back onto 34:30 lies on the rim there too, and 34:30's does not on 40:08), and a **bore about r 3.2 about the fourth's setting** (34:30: between r 3.0 and 3.75 projected back; it cuts the big circle's rim, 1.0 mm past the fourth), through which the bar's setting shows. The bar's settings show **gilt at its train-side face**, about r 2.5, the third's with a dark ring round it (a chamfer?), the fourth's red jewel landing on the fourth only at the bar's face (0.24 mm; 0.6-2.9 mm off higher up). Through the opening the bar's edges read **11.6 mm** apart, both taken at its face (13.0 with the near one at its side's foot), against 10 face-on at 40:08: the face-on reading stands | 34:30, 40:08 | Likely for the circle (two frames, two methods, 0.3 mm); the lobe's place to about 1 mm; the fourth's bore by eye to about 0.3 mm | `$MC_VIDEO/layout/keyhole/` (`seg.py`, `fit34.py`, `fit40.py`, `overlay.py`) |
| The lower train bridge's width and the third's jewel (4 October 2026) | **The width, four readings**: 40:08, the dial-side top, the fitted camera 10.0-10.5 (rising with f 4500-6000) and camera-free about 9.5 (the third's setting's ellipse, 117 px across the bar against 132 along it, gives the scale across); **14:40** (4K, the bare plate from the train side, the bar's face through the opening), camera-free about **10.65** (the third's setting's gilt ellipse fitted by colour, aspect 0.849; the edges from brightness profiles at +5.5-5.6 and -5.1 from its centre); 34:30, through the opening, the fitted camera 11.6 (the outlier, seen past the bore at a slant). No bevel shows on the top edges at 40:08 (the side plain and polished, reflecting the wheels). About 10.3: the model's 10 stands. **The third's lower jewel is colourless**, the fourth's red: from the dial side (40:08) a pale grey stone with the third's pinion seen through it and the pivot bright in it; from the train side, the train out (34:30), a disc about r 1.2 showing the blue mat through it; the fourth's red beside it in both, in the same light. The stones look about r 1 (model 0.62) | 40:08, 14:40, 34:30 | Likely for the jewel (both sides, the fourth as the control); the width to about 0.5 mm | `$MC_VIDEO/layout/keyhole/` (`bar40.py`, `overlay.py`) |
| The fusee's large end, the sustaining ratchet's groove, the dust seal (3 October 2026) | The large end: a raised rim round a recess holding the winding ratchet, the rim's inner edge 0.82-0.86 of the end's radius; the ratchet's tips 0.43-0.51 of it (6.4-7.6 mm; earlier readings 8.5, the pawls' tips 8.4). The sustaining ratchet's face: a groove about 0.7 wide at r 10.6-11.3 for the winding-pawl springs (19:12, the springs off). The dust seal: packing 0.42 of its diameter tall, the column about 3.5 mm, the flange r 8.6 with a shallow concave bite between its screws on the 12's side | 18:20, 19:12, 6:29 | Likely for the forms; the ratios by eye on oblique frames, ±10 % | `$MC_VIDEO/c2/` |
| The endstone caps' windows and screws (3 October 2026) | The escape upper cap's window a **cone**, about 0.38 of the cap across at its top (r 1.55 on the R 4.1 cap), narrowing to the endstone; its screws' heads about 0.19 of it across (r 0.78). The balance lower cap's window a **straight bore** about 0.41 of the cap across (r 1.1 on R 2.7) with the endstone at its bottom; its screws' heads r about 0.52 | 10:00 (c10-00_cap), 13:49.5 (c13-49_cap) | Likely: ratios to each cap's measured radius, by eye at 4K | `$MC_VIDEO/escape/` |
| **The scale** (2 October 2026) | Putting the dial side (scaled by the bore's 40.2) onto the bare plate (scaled by the plate's 87.57) needs a factor 0.947-0.963. **The error is most likely in the bore**: on the ring's dial face (40:08; both edges in one plane, so no camera needed) the bore is 0.81-0.83 of the ring's outside diameter (the photograph's 0.84 at the top of the range; lens distortion ruled out, a straight edge bows 1 px over 1560), so the bore is about 38.4-39.8 (model 40.2). The plate's 87.57 (a sale listing) stays the one absolute: the manual gives no plate, dial or ring size, and "85 size" (Lancashire gauge, 4.000 in) names the 4-inch dial's class, not the plate. The video's own Navy dial (46:44, N 5892) has its seconds centre 0.42 of the silvered face's radius out, which with the fourth at 0.4947 of the plate's (34:30) gives a dial face of 103 ± 5 mm with the 87.57 plate (a 4-inch dial), in mild tension with the side photograph's 95 mm. The fourth's 21.4-21.75 (34:30) is read against the plate's rim in the same frame, so it holds | 40:08, 46:44, 34:30; manual (text) | Plate: the only absolute; bore ratio medium (±0.02); the dial's ratio ±5 %. Still to do for a true absolute: the balance rim against the impulse roller's .249 in (34:08-34:16) or the balance screws' heads | `$MC_VIDEO/scale/` (`m40.py`, `joint.py`, `m46.py`, `straight.py`) |
| The camera's focal length | **Not constant across the video**: about 7900 px at 36:01, 3900 at 40:08, about 8000 at 34:30, 2800-4000 at 23:30 (the f 6000 the tools assumed suits some shots only) | 36:01, 40:08, 34:30, 36:15, 13:49.5, 23:30 | Likely; find f shot by shot where the cost has a clear minimum (a whole rim with round features at two heights, or a whole bore with its centre), and check with camera-free ratios. Readings at f 6000 move under 0.5 mm, but the pillars' tops (1-3 mm) and the barrel (fixed above) | `$MC_VIDEO/barrel2/fcal.py`, `NOTE.txt` |
| Mainspring | Let down (15:54): an outer pack of 12 ± 1 coils against the wall, one loose inner turn of about r 8, the end on the arbor; coils 1/88 of the barrel's inside diameter apart. Free (32:30): about 7 turns. **Length about 1.1 m (0.9–1.25)** if the barrel is r 18 (model 600 mm in r 13.5); its height not measured | 15:54, 32:30 | Likely, resting on the barrel's size | Coil profiles across the barrel; turns' radii summed |
| Oil sinks | The fusee's and barrel's lower bushings (dial side) each with a polished conical sink round the bore, the cone's outside about 0.6–0.7 of the bushing face's width; a dial-side bushing oiled at its sink (39:33); the train side's bushings show bevel rings (14:45, less clear). The manual's oiling (Ops. 43, 46–49; Figs. 77–80) puts argon oil on the fusee, barrel and centre bushings, the third's upper and the sustaining pawl's pivots, but never mentions sinks | 37:59, 38:02, 39:33, 14:45 | Likely | By eye |
| The balance's holes (3 October 2026) | **24 places, 15° apart**, numbered 1–13 round each half from an arm's end as Fig. 99's numbered block and Table IV number them: hole 1 at the arm's end, 7 on the quarter (Table IV's moves are symmetric about it). Holes and screws alternate in one even row along the rim's mid-height; on the face-on frame they step 14.5° on average, every one within 1.5° of a 15° place; side-on (6:49.5, 6:50.0, 6:51.0) the near half's positions fit x = c + R sin(15°·k) with R the same to ±2 % (12.86°, the other spacing Table IV allows, gives R varying 7 %) | 6:47.5, 6:52.5 (face-on), 6:49.5, 6:50.0, 6:51.0 (side-on) | Certain for the spacing and the numbering's origin | The rim fitted as an ellipse to the screws' and holes' places (least squares, affine), each place's angle read on the circle; `$MC_VIDEO/balance/` |
| The balance's screws and weights (3 October 2026) | **8 brass screws, in holes 3, 5, 9 and 12 of each half** (the parts list allows 4–6 of 0.049 in, so 8 or 10 in all); holes 4, 6, 7, 8, 10 and 11 empty. **The timing weights at the arm's ends**: a large slotted steel nut outside the rim on a screw through the rim into the arm, a slotted piece on the arm inside. **The verniers one hole on (hole 2), inside the rim**: a small plain steel nut, its screw's small head outside. Seen from the cock, the vernier and holes 3-12 run counterclockwise from each timing weight | 6:47.5 (all of half B and holes 2–9 of half A), 6:52.5, 6:53.0 | Holes: certain for half B and A's 2–9 (A's 10–12 behind the tweezers; 12 by poise); the weights' sides certain; their sizes rough | By eye on gridded 4K crops, the predicted 15° places drawn over the frame |
| The balance's proportions (3 October 2026) | **The rim 0.6 mm thick** (0.50 at the long axis's end from above, 6:47.5; 0.6 face-on, 6:52.5; 0.6–0.85 edge-on, 6:49.5–6:51.2) and about 3.5 tall (the heads 0.9 of it, side-on); **the screw heads 2.9–3.2 across** (face-on, the top and bottom heads at 6:52.5, 43 px/mm). Each screw runs through the rim to a brass point about 1.3 mm inside it; each vernier's screw stands about 1.6 mm outside the rim, a collar at its end (6:53.0). Side-on, a near and a far head overlap in projection (the two-toned heads of 6:50.0–6:51.0, and an apparent 4.1 mm at 6:49.8), so head lengths can't be read there; from above they are too foreshortened. The scale at the axis at 6:49.8: 34.8 px/mm, from the impulse roller (220 px for 0.249 in) and the rim's edge 505 px from the staff (29 mm), which agree to 1 % | 6:47.5, 6:49.5–6:53.0 | Thickness likely (three frames, three methods); head diameter likely (±5 %); the points' and stems' lengths rough; head lengths not read | Widths on 4K crops; edge-on and long-axis readings need no tilt correction |
| The hairspring (4 October 2026) | **Coils r 6.3 ± 0.3, about 9 turns** (8-10 on each side, 26 px apart: pitch about 0.7 mm), the stack about 5.6-6.0 tall. Side-on 457-480 px across against the rim's 1050-1110 between its ends (0.43-0.45 of its 29 mm; by the impulse roller's 0.249 in, 220-225 px, r 6.6); face-on 0.365 of the rim, the coils several mm behind it at a closer camera (43 px/mm), about r 6.0 with that taken out. The model had r 5.5 and 14 turns | 6:49.8, 6:50.0 (side-on), 6:52.5 | Likely: the radius ±0.3 (the frames' scales disagree by about 5 %), the turns ±1 | Pixel profiles down the coils' sides; widths against the rim and the roller |
| The balance arm and timing nuts (4 October 2026) | **The arm 1.9 wide** (82 px between its edges along its clean outer half, 43 px/mm), small holes along its middle; its thickness can't be told edge-on from the hub's flange (1.0 or 1.4). **The timing nuts about 2.3 long (± 0.25) and 2.1 across**: one 95 px across and 2.55 long, its end face nearly edge-on (0.21); the other, blurred, 2.0 across, its body 2.1 to a narrower collar at the rim; a slit runs most of the first one's length. Side-on (6:50.0) the assembly reads 3.3 long, the screw's end with it | 6:52.5, 6:50.0 | Likely; the nut ± 0.25 | Sections across the arm; crops with rulers |
| The hairspring stud's holes, the endstone cap (4 October 2026) | On the cock's top, a row of three holes along its straight edge: **3.8, 6.9 and 10.4 mm from the staff** (along the staff-to-cock-screw line 2.23, 5.44, 8.65; across it -3.07, -4.27, -5.73), the middle one wider (the stud screw's, counterbored); their line passes 2.0 mm from the staff. **The endstone cap gilt brass** round its steel setting (the model had it steel) | 41:58 | Likely: a homography on the cock screw's counterbore, the setting, the cap's two screw holes and the top face's arc-end corners (COCK_POLY 30, 0), residuals 0.02-0.14 mm, each corner predicted from the rest to 0.5-0.65 | `cv2.findHomography` on picked centres (SHAPE-PASS.md, 2) |

## Methods

**Counting a wheel's teeth** (`video.py count`). Give a rough ellipse for the
tooth tips (centre and the two semi-axes, in the frame's pixels). The tool
refines the ellipse on the outermost brass along rays from the centre. With
`--blue` it uses anything not the blue mat instead of brass, for wheels lit
almost white. It then unrolls the rim into a strip and finds every gap as a
local peak of brightness (`--ch -V`) or saturation (`--ch S`) in a band of
radii between tips and roots (`--band`). The count is the gaps found when every
interval is clean. Otherwise it is the local pitch fitted round the turn (a
smooth stretch from perspective) and integrated, so a gap hidden behind an arbor
or a neighbour doesn't count. Always look at `g_NAME.png` (the gaps marked) and
`e_NAME.png` (eight enlarged segments); count by eye where the fit and the marks
disagree.

- **Works:** a wheel flat on the mat, nearly face-on, whole (fusee wheel,
  wind indicator wheel: exact).
- **Works with checking:** a wheel in place seen at a slant, partly hidden
  (centre, third, fourth wheels: ±1–2, settled by eye and by the ratios).
- **Fails:** wheels at 4K that are under about 250 px across, or half out of
  focus (motion work at 23:30).
- **Brass mask:** HSV hue 8–40, saturation ≥ 55. Blue mat: hue 92–132,
  saturation ≥ 70.

**Pinion leaves.** None of these settled the centre pinion:
- by eye on enlarged crops;
- the angle between neighbouring leaves round the arbor;
- an FFT of brightness round an ellipse coplanar with the wheel's rim;
- a polar unwrap of an end face.

The leaves are short and steel. Seen from above, the arbor hides half of
them; seen from the side, only half are in view. A pinion counts reliably only
where it is seen end-on, sharp and whole: a wheel lying flat with its pinion up
(look at 23:30–23:45 again at 4K, and in the BunnSpecial videos), or the leaves'
side positions y = R·sin(θ₀ + 2πk/N) fitted on a sharp side view.

**Positions on the plate.** Fitting a full camera (`cv2.projectPoints` with
the focal length free) to the plate's rim, its centre bushing and the fourth's
jewel ran off to orthographic or nonsense. A free homography of the rim
collapsed onto the circle. What worked roughly was an affine map (`video.py plate`): an ellipse
centred on the centre bushing, fitted (linear least squares) to the far half of
the rim. The near half shows the plate's side wall, its lower edge, which pulls
a full-rim fit off. The rotation comes from the centre→fourth direction, with
+x (3 o'clock) on the image's left, train side up. Parts on the lower train
bridge (the third and fourth settings) sit 3.86 mm lower; their shared parallax
cancels by putting the fourth at the model's (0, 23.9). Rim rms was 2.4 mm:
good for "the third arbor is about 3–6 mm further out than the model's", not
for moving `L`. To do it properly:
- use known 3D points at several heights (pillar tops at 16.8 mm, bushings and
  screw heads at 0, the rim) with the camera's focal length fixed from the
  video's metadata or from a frame of a known object;
- fit with `cv2.solvePnP` from a good start, then refine;
- or use two frames from different angles (13:51 and 14:45 are moments apart).

**Which wheel is which.** Follow the reassembly (35:18–35:34): the third wheel
goes in first, lowest, into the lower train bridge's gilt setting; the centre
wheel into the gilt bushing; the fourth last, into the bar's red jewel. Seen
from the train side, 3 o'clock is on the image's left.

**Finding a moment.** `video.py sheet ID --step 10` for the whole video, then
`--step 2` or `3` round what matters (the catalogue above was built that way);
`--from mm:ss --to mm:ss` makes sheets of a stretch only (at 0.5 s steps to
follow a part being lifted or turned over).

**Heights from a side view.** Where a pillar stands beside the part, side-on,
read pixels along it: plate to train bridge is 16.8 mm. Take the part's
heights at the pillar's depth, and check them on two or three views (the lower
bridge's slab: 8.4–9.4 mm over three). This works.

**Which part is which.** Settle the frame's handedness first. A view from
the train side is the model's plan mirrored (3 o'clock on the image's left
when 12 is up); a view of the train bridge's underside, or of the dial side,
is not. Check it on parts no one can mistake (13:12: the barrel, the fusee and
its chain, the keyhole). Then name a feature by its place among others the
model already has, and check the guess against a third. A similarity with the
wrong handedness can still fit three or four points to a millimetre or two:
on 13:44 one fitted the centre, third, balance and escape positions to
0.6–1.9 mm, but unmirrored, which a train-side frame can't be. It and the
escape arbor "4 mm off" read from it are withdrawn. Read the manual's parts
list for what a part holds before naming its settings.

**A mirror or a misplacement.** Before reading a plan as mirrored, check
what a mirror keeps. A mirror about a line keeps every point's distance from
the points on that line. A feature that doesn't fit at its distances from
two arbors (say the balance and the escape) fits no better mirrored about
the line through them. On 13:49.5 a hole 5.2 mm from the escape arbor and
14.1 mm from the balance was read as the detent block's screw, on the other
side of that line, and so as a sign of a mirrored escapement plan. Fig. 90
has no part of the detent at those distances, whichever way round, so the
hole is something else. The plan's handedness comes from the train and Fig.
90 instead (Review-results.md, "Elsewhere", 16).

**A part on the mat put in millimetres by its rim** (`rimfit.py`). Where a
plate or bridge with a round rim of known radius lies on the blue mat (36:01:
the upper train bridge upturned, r 40.5), segment it from the mat, fit an
ellipse to its outer contour's rim (RANSAC), and fit a perspective camera so
a circle of that radius lands on the rim, for each of several focal lengths.
The rim's arc alone leaves the tilt loose (13–37° fitted it equally well at
36:01), so trace round features on the frame (gilt settings: centre, semi-axes
and their height above the face) and make them come out circular; with them
the fit takes the steeper tilt the settings' shapes show (37° at 36:01), and
the centre arbor's setting lands 1.0 mm from the rim's centre. Picked pixels
go back onto the plane at their heights (the slab of the balance lower bridge
8.9 mm above the train bridge's face: in a 37° view that parallax is 6.7 mm),
and named settings turn the result onto the model's plan. Seen from below, the
plan is the dial side's (x right, z down), so no mirror: the mirrored fit
lands the centre, third and fourth settings 7 mm off, the direct one 1.5 mm.

**A face anchored on its rim** (`video.py anchor`, with `circles`). Trace
the train bridge's rim (r 40.5 about the centre) and its cut round the
barrel (r 19.2), and name the centre bushing. The circles fix the face's
perspective and scale and the cut its rotation, and every other hole is
then a check, not part of the fit. On 13:49.5, 13:44 and 10:00 the rim fits
to 0.2–0.4 mm. Read the outline first: on 13:49.5 the opening beside the
centre bushing is the bay beyond the bridge's inner edge, not the cut,
which is the opening with the barrel's teeth in it. Check the order of
features round the centre against the plan (`holes.py PART --plan`)
before naming an edge. Only points on the face map; a jewel 12 mm below
it, on a view tilted 45°, lands about 10 mm off. Not yet trustworthy for
plan positions: on 10:00 and 13:44 it put the escape arbor 40–45° round,
where the train's meshes and the photographed balance can't have it. The
rim's radius and its centring on the centre arbor are the model's, and
they may be what is wrong (Review-results.md, "Elsewhere", 18).

**Points off the anchored face** (`framecam.py`). The homography of a face anchored with `video.py anchor` is the camera's view of that plane, so the camera
can be recovered from it (K with the principal point at the frame's centre; R and t from K⁻¹H, the focal length where H's first two columns come out the
same length, which for 13:49.5 is about 6000 px) and a pixel put back on any plane parallel to the face, at its height toward the camera. A part standing
off the face (a bridge's slab 8 mm proud) lands several percent off where the face's homography alone would put it. Points read this way move 0.5 mm or
less over 5000–7000 px. The same camera gives `isolate.py` a `--look` from the frame's viewpoint and maps the render onto the frame, for comparing the
model with the frame from where it was taken.

**A plane anchored on matched holes.** Unreliable on its own: a homography
passes near any five points. On 13:49.5 three searches over the same picks
gave three different fits, each to 0.1–0.3 mm, and the model's holes are
themselves about 10 % too near the centre (the README, "barrel bridge's far
horn"). The readings below that came from this method on 13:49.5 (the third
bushing at 16.0 mm, the hole at (9.24, 20.86)) shift by up to 3 mm on the
rim fit.  Where a face of a part the model has
from a source (the train bridge, traced on the top-view photograph) is seen,
pick every hole on the frame and let a search pair them with the model's
holes; a homography on the matched pairs maps the frame onto that face. On
13:49.5 five holes matched to 0.2–0.6 mm, and the third bushing then read
16.0 mm from the centre. Points off that face (the lower bridge, 7.9 mm
nearer) need the camera's distance; there the method disagrees with the
escapement's 9.4 mm from balance to escape, so it isn't used for them yet.

**The plate rectified by its rim.** The pillar plate is a circle (87.57 mm)
and the centre arbor stands at its centre, so the rim's image and the centre
bushing's give the plate's plane in millimetres without a camera. On 14:45
the two plate bushings came out 23.2 and 19.0 mm from the centre: the fusee's
and the barrel's (model 22.9, 18.6). That labels them the other way round from
the `plate` command's example above (Fu is at 2526, 918; Ba at 1522, 625).
Points on the lower train bridge lie 3.86 mm below the face and shift in an
oblique view.

**A part's own proportions.** Where a part is seen face-on, ratios between
its own features need no camera and no names on other parts: the lower
bridge's cap, escape passage and fourth's setting are 8.6 : 10.8 : 11.6
(13:49.5). For millimetres use two independent rulers and see that they
agree: the train bridge's rim (40.5 mm) and its barrel cut against the
escapement's 9.4 mm from balance to escape, 35–39 against 37.8 px/mm. The
bridge's features lie about 8 mm nearer the camera than the train bridge,
which at this distance (about 80 mm) enlarges them by up to 11 %.

**A camera from model points and circles** (`video.py fit SPEC.json`, then
`video.py unproj SPEC.json Y u,v …`): the pose and focal length fitted to named
points and to circles traced on the frame (the train bridge's rim, its cut
round the barrel, the plate's rim, at their heights), from many starting
poses. On 13:44 it did not give usable plan positions: with two named points
and one arc it fell to a near-orthographic camera (f 9,300 px) that put the
balance's jewel 13 mm off, and the rim's arc couldn't be told from the
plate's, whose radii differ by 3.3 mm and heights by 20. It needs four or
more named points spread over the frame, at known heights, before `unproj`
can be trusted; then a second view to check.

**The focal length, shot by shot** (2 October 2026). The 4K video's lens or zoom changes between shots: about 7900 px at 36:01, 3900 at 40:08,
about 8000 at 34:30, 2800-4000 at 23:30. A fit at an assumed f (the tools' 6000) is only as good as that guess for its shot. For each shot:
take a frame with a whole rim of known radius and round features at two or more known heights (36:01: the rim, settings at 0.3 and the slab's
at 8.9 mm), or a whole rim with its centre picked to 2 px (40:08); run `tools/fcal.py` on its spec, and take f only where the cost has a clear
minimum; otherwise give the result over the range the profile allows. Check any fit with a ratio that needs no camera: a part's own proportions
seen whole (the barrel's height to its radius side-on, 33:12). Readings made at 6000 shift under 0.5 mm, except the pillars' tops (1-3 mm)
and the barrel (refitted).

## Gaps the videos could close

Each gap's full note and other routes are in IDEAS.md; this is where in the
videos to look.

| Gap (IDEAS.md) | Where to look | What to do |
|---|---|---|
| Centre pinion: 14, likely (1.8) | Counted end-on at 13:59.5 and from above at 35:23.66 (2 October 2026): 14 fits, 13 doesn't. To make it certain: the wheel lying flat pinion up, or end-on with the arbor straight at the camera | 13 would change the fusee's figures (`FUSEE_PER_HOUR`, `RUN_H` 60.6 h, the indicator pinion 13); 14 is the model's |
| Wind indicator pinion: 12 (1.8) | 29:04–29:12 at 4K (end-on, blurred); 23:30 if the fusee arbor lies there | Count the leaves; it must make cp × p ≈ 169 with the dial |
| Escape pinion: 10 (1.8) | `wcYqdgpyggQ` 17:20–17:28 (escape wheel in the palm) | Count; 10 confirms the fourth wheel's 75 |
| Motion work counts (1.8) | `KLUwI2UUCMQ` 23:30 (minute and hour wheels flat, half blurred); 40:15–40:30; `wcYqdgpyggQ` 5:10 | Count the minute wheel, its pinion, the hour wheel and the cannon pinion; the ratio must stay 12 |
| Third arbor's place and the wheels' sizes (1.11) | 13:51, 14:36–14:45, 34:30 at 4K | A proper camera fit (Methods), then plan positions of the bushings and settings; then `solve.py`, `fine.py`, `bom.py` |
| Train-bridge screw with no pillar (1.2) | `wcYqdgpyggQ` 19:30–20:40 (bridge off), 21:50–23:20 (plate with pillars); `KLUwI2UUCMQ` 12:48–13:03 (bridge underside), 36:15 | Map the pillars and the bridge's holes onto the plan with the same camera fit |
| The pillars' and screws' places (1.2, 1.11) | `wcYqdgpyggQ` 22:00 (bare plate, four pillars); `KLUwI2UUCMQ` 36:15, 14:45 | The bare plate rectified by its rim (an ellipse fitted to 13 rim points, scaled to the plate's 87.57 mm; rim radii within ±1.6 mm) puts the four pillars' bases 32–42 mm from the centre (model 28–32.5) and 40–78 mm apart (model 34–63): about 1.2 times the model's spacing, as the barrel bushing at 14:45 was (23.2 against 18.6). The bridges' rims, 34–35 mm read against their screws on the pillars, are 39–40.5 against the plate (the side photograph's silhouette 39–39.5), so the rims stand and the layout inside them is what is small. The pillar picks are by eye at 720p (±1 mm or so); a 4K camera fit of 36:15 with the train's arbors would settle how much of the layout to move, and whether the fusee wheel (40.87 mm on the side photograph) agrees |
| Mainspring length (1.9) | `KLUwI2UUCMQ` 16:28–17:04, 32:20–32:52 (spring out, stretched in turns) | Count its turns out of the barrel and their radii, or measure a stretched length against a known width (the barrel's) |
| Oil sinks (1.10) | 14:12–15:12, 33:44–33:56 (settings close) | See which unjewelled holes have sinks |
| Balance's swing, escapement motion (2.x) | `We1dLNXiBj0`, `s7VW3RiJ97E` | Frame-by-frame angle of the balance: amplitude (the manual's 1⅜–1½ turns), and the detent's lift |
| The balance's head heights and rim thickness (Review-results.md, "The balance's rim") | `KLUwI2UUCMQ` 6:44–6:53.5 (balance out); 43:45–43:51 (going back in) | Read each pair's head length side-on, and the rim's thickness edge-on, against the 15° holes' spacing |
| Balance lower bridge: the settings' spacing (Review-results.md, "The balance lower bridge", 14) | `KLUwI2UUCMQ` 6:29 (the cock's endstone from above), 13:44 (the keyhole and the balance's lower jewel from above), 36:01; the dial side at 40:08 (the fourth's and escape's lower settings) | Its outline is now the video's (13:49.5, `framecam.py`). What remains is where the balance is: 13:49.5 puts the cap 11.0 mm from the fourth's setting and 5.2 mm from the model's balance (36:01: 12 mm), while the barrel bridge's cut round the balance on the top-view photograph and the endstone at 6:29 kept it near the model's (18.9 mm before the 14° turn, 16.6 since). Camera fits to 6:29 and 13:44 with `video.py fit` (four or more named points at their heights) would settle it |
