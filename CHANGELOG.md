# Changelog

What changed on the site, newest first. `build.py` reads this file: the top version is printed under the byline of the built page, and the list goes into the About dialog's Changes section.

Versions are `M.mm.pp`. The major `M` is 1 from 1.05.00, the first release to carry a number on the site, and goes up only for a milestone. The minor `mm` goes up with new features or parts (a merged branch), and the patch `pp` with fixes and small changes. Every deploy is a release: `python build.py --release patch -m "what changed" --site-url https://www.marinechronometermodel.com` (or `minor` or `major`) adds the next version here with today's date, then builds. Each `-m` is one line. Write for visitors: what they will see, not how it was done. Versions up to 0.04.01 were numbered afterwards from the git history, one per day.

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
