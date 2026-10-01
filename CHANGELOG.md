# Changelog

What changed on the site, newest first. `build.py` reads this file: the top version and the list go into the built page's last panel section, Version … · what's new, above the byline (the About dialog's byline shows the version too).

Versions are `M.mm.pp`. The major `M` is 1 from 1.05.00, the first release to carry a number on the site, and goes up only for a milestone. The minor `mm` goes up with new features or parts (a merged branch), and the patch `pp` with fixes and small changes. Every deploy is a release: `python build.py --release patch -m "what changed" --site-url https://www.marinechronometermodel.com` (or `minor` or `major`) adds the next version here with today's date, then builds; commit it, and `python deploy.py` puts it live (it refuses a changed page under a version already live). Each `-m` is one line. Write for visitors: what they will see, not how it was done. Versions up to 0.04.01 were numbered afterwards from the git history, one per day.

## 1.12.00 · 2026-10-02
- The fusee's maintaining work redrawn after a restoration video of a real Model 21: the sustaining spring as a nearly closed band in the fusee wheel's recess, the wheels on the arbor's collar, the gilt sustaining ratchet, and the end plate and taper pin as the manual draws them.

## 1.11.04 · 2026-10-02
- The upper train bridge's notch round the fusee, its horn and its mouth now match a real Model 21

## 1.11.03 · 2026-10-01
- The detent's support block has its two positioning pins into the train bridge, as on a real Model 21
- The trip spring's screw goes through the spring into its bracket, and the detent-adjusting screw bears on the detent

## 1.11.02 · 2026-10-01
- Winding at high speed no longer runs the chronometer for hours on its maintaining spring: while the key turns, time runs at most ten times real speed, as the sustaining spring drives the train for only 5 to 10 minutes.

## 1.11.01 · 2026-10-01
- The bridges' undersides and edges are now plain nickel, as on a real Model 21; the damascening stays on their top faces.

## 1.11.00 · 2026-10-01
- The balance lower bridge redrawn after a restoration video of a real Model 21: one L-shaped slab with a lug at each end, the balance's endstone cap in a round counterbore and the fourth wheel's large gilt setting beside it.

## 1.10.01 · 2026-10-01
- The escape upper bridge as on a real Model 21: a bar across the escape wheel's opening, a screw at each end, a round endstone cap.

## 1.10.00 · 2026-10-01
- The balance lower bridge's lower tier is now a broad slab, as on a real Model 21, with the escape arbor passing through it.
- The going train's third wheel sits where a restoration video of a real movement puts it, so the centre wheel is now clearly larger than the third, as on the real one.
- The pillars have the shape measured on that video: a straight shaft with a collar at each end.

## 1.09.01 · 2026-10-01
- The balance cock's endstone cap as on a real Model 21: a conical oil sink down to the jewel, its screws flush.

## 1.09.00 · 2026-10-01
- The balance cock is now the solid block it is on real Model 21s, standing on the train bridge, its arm sweeping over the balance.
- The barrel bridge has its far horn past the balance and its screws as on a real movement; its other end stops at the cock.

## 1.08.00 · 2026-10-01
- The going train's tooth counts, counted on a restoration video of a real 1941 Model 21: the fusee and centre wheels have 90 teeth, the third 80, the fourth 75.
- The up–down wind scale now sweeps about 314°, as on a real Model 21 dial, and its hand reaches DOWN when the chain runs out, after the manual's 56 hours.
- The essay, part cards and walkthrough give the new counts and say where each comes from.

## 1.07.00 · 2026-10-01
- The balance lower bridge rebuilt as the solid frame the manual and photographs show, round the escape wheel.
- The train-blocking screw and the bridge's screws moved to the holes a photograph of a real movement shows.

## 1.06.00 · 2026-10-01
- The mounting ring as the manual draws it: a deep brass ring under the pillar plate, carrying the dial.
- The dial 95 mm across, as photographed, on the ring, its four screws in the ring.
- The case fits the movement: the ring sits in a recess round its top, its alignment pin in a slot; the gimbal ring closer round it.

## 1.05.01 · 2026-10-01
- The list of changes moves to its own section in the panel, above the byline.

## 1.05.00 · 2026-10-01
- A version number under the byline, and this list of changes in About.

## 0.04.01 · 2026-10-01
- The camera turns to 87° below the model, as it does above, so the movement can be seen from underneath.

## 0.04.00 · 2026-10-01
- The essay is now the model's Essay tab, rewritten against the Model 21. The Illustration tab is gone.
- Every part checked against the manual's parts list (Sec. XI, 187 lines): the missing parts added, and every thread, pivot and setting measured.
- The going train stacked as the manual's Figs. 13, 29 and 110 have it, with cycloidal wheel teeth and round-tipped pinion leaves.
- The balance rim 4.3 mm tall, giving Table II's moment of inertia (1,140 g·mm²).
- The setup work as Fig. 80 has it; the locking arm stops the balance by a timing weight; the lower train bridge as photographed.

## 0.03.00 · 2026-09-30
- Every part a closed solid: cross-sections are filled, and in the Exploded view no two parts meet.
- The mainspring drawn in its barrel, 0.0165 in thick.
- Setting the hands with the key or when stopped, as the manual does, and the navigator's rate book.
- The adjuster's bench: the escapement's settings on sliders, checked live against the manual's figures.
- Every part card says where its shape and size come from; Colour by source, a parts search, sizes in millimetres or inches.
- The fusee and chain as photographed; the escape wheel, rollers, unlocking collar and trip spring nearer the real parts; the centre of the dial and the balance lower bridge as the manual has them.
- Tidier sidebar, with Fusee and Balance views and folding sections.
- Shadows as a Display switch (off by default) and fewer frames drawn when nothing moves.

## 0.02.00 · 2026-09-29
- The site goes live at marinechronometermodel.com.
- The rate panel: turn the timing weights and watch the hands gain or lose. Wind with the key to the winding stop.
- Roman (German and Swiss) and Soviet dial styles; the Hamilton dial after a photographed one.
- Shareable links, GMT by default with a Local time option, panning, keyboard orbit and reduced motion.
- On phones: a touch layout, a long-press part menu and a "?" card of every control.
- A Laid out view of the train, an Illustration tab, the Edges and drawing display options, and a tick sound.
- Screws with threads and holes; the balance locking arm, the train-blocking screw and Twist to start; the hand-setting square, the hairspring's collet and stud, the balance's upper jewel and a working gimbal latch.

## 0.01.00 · 2026-09-28
- The Hamilton Model 21 built part by part in 3D from the 1948 Navy overhaul manual, running in real time: fusee and chain, detent escapement and balance.
- Views from the box to the escapement, colour by part, and a part menu to fade or hide parts.
- The gimbal mounting, custom speed and the About dialog.
