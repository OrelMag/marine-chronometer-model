# Changelog

What changed on the site, newest first. `build.py` reads this file: the top version and the list go into the built page's last panel section, Version … · what's new (the About dialog's byline shows the version too).

Versions are `M.mm.pp`. The major `M` is 1 from 1.05.00, the first release to carry a number on the site, and goes up only for a milestone. The minor `mm` goes up with new features or parts (a merged branch), and the patch `pp` with fixes and small changes. Every deploy is a release: `python build.py --release patch -m "what changed" --site-url https://www.marinechronometermodel.com` (or `minor` or `major`) adds the next version here with today's date, then builds; commit it, and `python deploy.py` puts it live (it refuses a changed page under a version already live). Each `-m` is one line. Write for visitors: what they will see, not how it was done. Versions up to 0.04.01 were numbered afterwards from the git history, one per day.

## 2.18.00 · 2026-10-05
- The mainspring now coils and uncoils as a real one does: its shape is solved from the spring's own natural curve, measured on a restoration video
- Wound, its coils draw in round the arbor; as it runs down they spread out toward the barrel's wall
- The mainspring is set up so its pull falls over the wind as the fusee's profile is cut for

## 2.17.00 · 2026-10-05
- Parts that are several things in one now list their pieces: a tap picks the balance wheel, a roller, the collet or a screw, each with its own card from the parts list and the manual
- Each piece has its own maker's sheet, drawing and STL, and hides, fades and isolates on its own; the parts list folds them under their part
- The winding key shown on the fusee and on the hands' square is the real key, as on the box, not a T bar

## 2.16.00 · 2026-10-05
- Report a bug or inaccuracy: from the panel, any part's card or the essay, a report written into an email to the author, with the details that help fix it

## 2.15.00 · 2026-10-05
- The motion work under the dial, the balance's rollers and hub, and the escape and third wheels at their measured sizes
- The barrel's cap, the fusee's winding ratchet and its pawls, the cock's tall screw and the train bridge's bushings with their oil sinks as a real movement has them
- The balance cap and the train-blocking screw as the manual draws them; the dust seal's packing rings in fibre
- The case's profile and its shield plate as on a real case, the plate's stop screw turning with it
- The gimbals' large pivot screws and washers, the case pivots' lock nuts inside the ring, the latch farther forward and its keeper a windowed block

## 2.14.01 · 2026-10-05
- The hairspring stud's screw at its measured size, in a smaller counterbore on the balance cock

## 2.14.00 · 2026-10-05
- The mounting box's walls at their real thickness, so the case fills it as on a real one
- The gimbal latch stands against the box's side beside the ring, where a real one has it, its handle an upright cylinder

## 2.13.00 · 2026-10-05
- The balance hub's brass flange at its measured size
- The fusee's top cut with the recess round its hub that the stop-bar and its spring lie in
- The gimbal latch's knurled head raised on its post, as a photograph of a Model 21 in its box shows it

## 2.12.00 · 2026-10-05
- The balance staff traced whole on a photograph of a bare Model 21 staff: its seats for the rollers, the hub and the hairspring's collet at their real thickness

## 2.11.00 · 2026-10-05
- The gimbals' knurled lock nuts and the latch's clamping head at their measured size, and the box's brass corners as short caps
- The source material gains the Navy's trail to the Ships Chronometer Record Book: the cork plate in the lid and the Bureau of Ships Manual

## 2.10.00 · 2026-10-05
- The train's friction and the balance's damping worked out from the measured pivots, teeth and air: the balance's swing now follows from its parts
- The escape pinion at its measured length, and the balance hub's brass sleeve on the staff, as a real movement has them
- The hairspring stud's bar and clamp measured, and the hairspring's height with them

## 2.09.00 · 2026-10-05
- Export to Blender: the whole chronometer as a glTF file, every part a named object in its place, in its materials, with every motion as an animation (running, a beat in slow motion, run down, winding, setting the hands, stopping and starting, exploded, laid out, lifting out, the lids, the latch, at sea)
- A Blender rig: run it after importing and the chronometer keeps going on Blender's timeline at its own ratios, with controls for the wind, the hands, explode, laid out, lift, lids, latch, roll and pitch
- Sharper textures in the Blender export: the engravings, the damascening, the dial and the wood drawn finer

## 2.08.00 · 2026-10-05
- Jupiter and Saturn in the almanac and the workbook, within 10 and 5 seconds of arc
- The build book prints each part's drawing at a stated scale, legible on paper, every line with its fit, and each screw with a thread to cut
- The third and fourth wheels' lower jewels and the escape arbor measured on a real movement
- The hairspring's own isochronism worked out at the balance's real swing
- The balance arm sits flush in its rim, the hairspring stud's pins as a real one has them, the sustaining spring in dark steel

## 2.07.01 · 2026-10-04
- The maker's sheets list every part's holes, with their centres and diameters, and number them on the drawings
- The balance staff's pivots and cones measured on a real staff: 0.36 mm pivots in their jewels
- The escape wheel's pivots made Hamilton's own 0.007 in, in jewel holes measured against the light

## 2.07.00 · 2026-10-04
- The hairspring is now the one a maker would wind: a 0.23 × 0.22 mm strip on terminal curves designed to Phillips' conditions, so its pull on the balance leaves no force on the pivots; the collet's end set to fit, inside the restoration video's measurement
- Making it (in the panel): each part's card has a maker's sheet (its parts-list lines, the fits measured on the model, materials and heat treatment), a drawing to scale (SVG) and its solid (STL); Measure between two points; Oil colours each part by its lubricant; print the whole build book; take the model's numbers as data
- Essay: five new sections for a maker — what the model gives you (with the manual's tolerances), oil and where it goes, adjusting the escapement, the order of work, and materials, hardening and tools (with the chronometer you can make without Elinvar)
- The physics is derived, not fitted: the mainspring the fusee asks for, the escape wheel's chase onto the impulse jewel, the balance's damping and the detent spring's share from the manual's 0.770 g test
- The almanac adds Venus and Mars; the rate book can compare the chronometer by equal altitudes of the Sun or by a lunar distance

## 2.06.05 · 2026-10-04
- With the Navy's Y-arm fitted, its card now describes the Y-arm (the locking arm's card came up before)

## 2.06.04 · 2026-10-04
- The balance's lower jewel cap and setting drawn to their measured size (the cap about 9 mm across, as on a real Model 21)

## 2.06.03 · 2026-10-04
- The Navy's Y-arm balance brake is now fitted by default (Variants: the manual's locking arm is still there)

## 2.06.02 · 2026-10-04
- The balance's hairspring redrawn to real proportions: its coils narrower (about 10.5 mm across) and taller, with 12 turns
- With the Navy's Y-arm fitted, its arch now clears the hairspring

## 2.06.01 · 2026-10-04
- The balance's weights read as a matched pair's, as the manual's tables use them: the drawn balance now carries Table II's moment of inertia (578 g·mm²), and the essay's hairspring stiffness follows (about 91 µN·m a radian)

## 2.06.00 · 2026-10-04
- Latitude from the sky: the noon sight and the pole star, worked through in the essay
- The workbook reduces noon sights and pole-star sights to a latitude, and works out the chronometer's daily rate from two of its errors

## 2.05.00 · 2026-10-04
- Essay: four new sections on finding Greenwich time and longitude from the sky, with no radio — equal altitudes of the Sun to rate the chronometer ashore, the time sight for longitude at sea, and the lunar distance to check it, each worked through on a set day and place
- The essay carries its own almanac (the Sun, the Moon and the 57 navigational stars, checked against NASA JPL's ephemeris): print its pages for any days, with the lunar distances every three hours and the hand rules for the Sun
- A workbook for your own sextant sights: a longitude by the time sight, an intercept from your position by dead reckoning, or Greenwich time from a lunar distance
- The 1948 Navy manual the model is built from is now on the site, linked from the essay and About

## 2.04.01 · 2026-10-04
- Variants, Balance stop: the Navy's Y-arm now locks onto the balance — screwed down, both its pins come down onto the rim together (they stopped short of it before)

## 2.04.00 · 2026-10-04
- The hairspring's collet is drawn as the manual's figures show it: the hub on a stepped block, slit to a small relief hole, a ledge cut back over the tongue, and the clamp that pinches the spring's end against it, held by its wedge pin
- The hairspring's lower end runs straight along the collet into its clamp
- In the Exploded view the hairspring comes off with the balance
- Fixed a flicker on the collet's clamp

## 2.03.01 · 2026-10-04
- Display: Remember settings — tick it and the page keeps your settings (view, display options, theme, dial, panel) for your next visit; off by default, so nothing is stored

## 2.03.00 · 2026-10-04
- The hands are traced from a real Model 21's dial: the hour hand's bulb and needle, the minute hand's leaf, the seconds hand's arrowhead
- The balance as a restoration video measures it: its hairspring, the stud and its holes in the cock, the arm, the timing weights' nuts
- The balance cock's arm is flat underneath, stepping square to its body
- The train wheels' hubs, rims and spokes, the pillar screws, the barrel pillar and the fusee chain's links are measured on photographs and videos of real Model 21s
- The winding key, the box's side handles and the case's bottom are drawn as the real ones are
- The timing weights now turn 2 turns either way, all the room their measured nuts leave

## 2.02.00 · 2026-10-04
- Double-click a part to zoom in on it; double-click empty space for the whole view again
- Back and forward through the views: ↶ ↷ under the tabs, or Backspace and Shift-Backspace
- Drag the line beside the panel to make it wider or narrower
- The author's name and contact moved to the top, under the description

## 2.01.00 · 2026-10-04
- Hide the panel: the tab on the model's right edge, or the P key, gives the model the whole width (on wide screens and phones held sideways)

## 2.00.04 · 2026-10-04
- The fusee arbor's collar rises to the barrel bridge, as a restoration video shows it

## 2.00.03 · 2026-10-04
- The sustaining pawl's blade as on real Model 21s: a curved blade bowed away from its ratchet, drawn from a restoration video

## 2.00.02 · 2026-10-04
- The Navy's balance brake (Variants, Balance stop) drawn as real movements have it: its arch sits lower round the balance, and it is screwed down onto the rim with an Allen key, not pressed
- The balance locking arm's description corrected: the finger at its end stands beside a timing weight, and the vernier weight's screw stops the balance the other way

## 2.00.01 · 2026-10-04
- The mounting ring has its dial take-off slot, the notch at the rim where the dial is lifted off
- The fusee's top plate fits round the arbor's collar, which rises through it, as the manual draws it and a restoration video shows

## 2.00.00 · 2026-10-04
- The balance now swings by its physics: how far depends on the mainspring's pull, so it dips while you wind; a new Swing and isochronism section shows how the rate follows it
- A 30-day performance test: the Navy's test run on the model as you've set it, beside a real Model 21's test card
- The fusee against a going barrel; the balances' temperature curves, with the split rim curling; the hairspring's isochronism on the Adjuster's bench; the mainspring's set
- The gimbals swing with inertia, with a roll period to try; Jolt the box shows a detent tripping or stopping
- The essay explains the escapement's isochronism and draws the Model 21's measured temperature curve

## 1.22.04 · 2026-10-04
- The sustaining pawl as real Model 21s have it: its spring a straight wire standing upright beside its arbor, a hub at the arbor's foot, and its place as a restoration video shows it

## 1.22.03 · 2026-10-04
- The third wheel's lower jewel is colourless, as on real Model 21s; the fourth's stays red

## 1.22.02 · 2026-10-04
- The balance drawn as a restored 1941 Model 21 shows it: a thinner rim, each screw running through it to a point, and the vernier weights' screws standing outside it

## 1.22.01 · 2026-10-04
- The plate's opening under the lower train bridge as on real Model 21s: a keyhole round the third wheel, with the bridge's settings showing through it

## 1.22.00 · 2026-10-03
- The model draws about a third faster: parts that don't move against each other are drawn together, with the same picture
- Performance mode in Display (on by default) switches it; turn it off if anything ever looks wrong

## 1.21.01 · 2026-10-03
- The setup cover over the barrel is drawn as on real Model 21s: symmetric, its sides cut the same on either side
- The setup ratchet, its click and the click's spring are their measured sizes: a smaller ratchet, the click pivoting nearer the arbor

## 1.21.00 · 2026-10-03
- The balance's screws and weights sit in its 24 numbered holes, as a restored 1941 Model 21 shows them: the timing weights at the arm's ends, the small vernier weights inside the rim beside them
- Rate panel: move a pair of balance screws to another hole, add a pair or take one out, and see what heat does to the rate (the manual's Table IV, with a temperature slider); the panel's settings are kept in the link

## 1.20.02 · 2026-10-03
- The movement runs a little lighter while you turn it

## 1.20.01 · 2026-10-03
- The Navy's Y-arm balance stop (Variants) redrawn as the lever on real movements: screwed down near the bridge's edge, it runs under the seal's cap to an arch over the balance cock with an eye and a pin at each end

## 1.20.00 · 2026-10-03
- The adjuster's bench now changes how the chronometer runs: the balance swings further or less as the escapement is set, and the rate gains or loses with it
- The rate panel shows how much of the rate is the escapement's, and the rate book notes when the escapement was adjusted
- The bench refuses a setting that would leave the balance swinging too little to keep going

## 1.19.00 · 2026-10-03
- The going train laid out as a restoration video of a real Model 21 measures it: the third, fourth and escape wheels, the pillars and the wind indicator
- The escape wheel's upper bridge rebuilt with its boss, flat-sided endstone cap and flush screws, its ends sunk in seats in the train bridge
- The lower train bridge under the dial at its real size: a thick steel bar, its screws and jewel settings sunk in counterbores
- The dial printed in the proportions of a photographed Model 21 dial: the seconds dial meets the minute track at 6, and the hands match
- The detent's support block at the manual's length, and the train-blocking screw where the video shows it
- The fusee's large end with its rim, the dust seal's flange, the setup click and the endstone caps redrawn after a real Model 21

## 1.18.00 · 2026-10-03
- While winding, see the sustaining spring carry the load: the load path in colour, a close-up of the spring with how long it can still drive the train, and an option to exaggerate its motion
- New in the essay's Winding section: the maintaining power, with the spring relaxing as the key turns

## 1.17.01 · 2026-10-03
- New labels on the hands' gearing: the steel square that turns once an hour carries the minute hand, the hour wheel's round pipe (once in 12 hours) the hour hand

## 1.17.00 · 2026-10-02
- The mainspring barrel enlarged to the size measured on a real Model 21, with a longer mainspring to match
- The fusee's stop-bar, end plate, winding ratchet and winding-pawl springs redrawn as the manual and a real Model 21 have them
- The hairspring's collet and the barrel pillar redrawn after the manual and a real Model 21
- New under Variants: the Navy's Y-shaped balance stop, as photographed on one Model 21

## 1.16.00 · 2026-10-02
- The rate panel changes balance screws and puts washers under them, with the manual's own tables beside the model's figure
- The setup ratchet, the case's winding-hole shield plate, the dial's hands and the split balance redrawn as the manual and a real Model 21 have them
- The detent's lock-adjusting screw now bears on the strip that carries its stop button, as the manual draws it
- The fusee chain's hook is named as the barrel turns it into view
- The views and the walkthrough now aim at the parts where they stand

## 1.15.00 · 2026-10-02
- The fusee, barrel and balance now stand where real Model 21s put them, measured on restoration videos: the fusee nearer the centre with a smaller wheel and cone, the barrel further out, the balance on its lower cap
- The upper train bridge's middle opening redrawn as on a real Model 21: lobes over the balance and the fourth wheel's setting, and the round escape passage
- The upper train bridge now ends past the barrel in a straight cut, as the real one does
- The train bridge's third screw now goes down into its own pillar, as the manual has it

## 1.14.00 · 2026-10-02
- The balance, fusee, barrel, bridges and balance cock turned 14° to where they stand against the dial on a real Model 21; the escape wheel and the wind indicator wheel placed to match
- The detent support block's screw now goes in from above, through the train bridge, as the manual and the restoration video show
- With the train-blocking screw down, the train now stays held instead of slipping a beat at high speed

## 1.13.00 · 2026-10-02
- The balance lower bridge redrawn as on a real Model 21: two levels, its slab curved like a lens with chamfered edges, measured face-on on a restoration video

## 1.12.01 · 2026-10-02
- The train bridge's third screw now sits in its counterbore at the end of the tongue, as on a real Model 21, instead of hanging over the notch
- The tongue beside the fusee's notch now turns into the rim through a rounded corner

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
