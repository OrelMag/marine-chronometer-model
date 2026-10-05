# Assessment: the second round of the self-contained work (4–5 October 2026)

What the second round found (released as 2.07.01 and 2.08.00), how far each finding can be trusted, and what it changes for
the project's three aims: that someone could **build** a working Model 21 from the page alone, **rate and navigate** with
it, and that the model stays **true to the real chronometer** (CLAUDE.md, Source of truth). The detail behind each item is in
`References/VIDEOS.md` (the measurements), `Review-results.md` (the findings), the model README ("Estimated") and the code
comments beside each change.

Certainty uses four words throughout: **sure** (two independent readings agree, or a source states it), **likely** (one clean
reading, its error bounded), **rough** (a reading whose scale or view leaves 10–30 %), **inferred** (no reading; carried over from
a neighbour or from practice).

## 1. Summary

| # | Finding | Before | Now | Certainty | Impact |
|---|---|---|---|---|---|
| 1 | Escape pivots | r 0.2 (0.40 mm) | r 0.089 (0.178 mm) in holes 0.19 | likely | **High**: 2.2× too thick; a maker would have turned the wrong arbor and bought the wrong jewels |
| 2 | Third and fourth lower jewels | stones r 0.62, holes r 0.27 | stones r 1.13, holes r 0.32 / 0.36 | likely (holes), rough (scale) | **High** for jewels bought or made to the sheet |
| 3 | Balance staff's lower end | plain pivot r 0.2 | pivot r 0.18, traced concave cone and shoulder | likely | Medium: the pivot was nearly right, the profile wasn't |
| 4 | Escape arbor's body | r 0.55 | r 0.67 | rough (scaled on the model's own pinion) | Medium |
| 5 | Build book on paper | drawings unscaled, text 0.6 mm, 21 lines without a fit | stated scales, legible, every line filled, threads given | sure (the check) | **High** for the "build from the page" aim |
| 6 | Hairspring's own isochronism | assumed 0 | +0.05 s/day per 10° of swing (designed spring) | likely, for the ideal strip | Medium: tells the adjuster which way and how much |
| 7 | Jupiter and Saturn | absent (elements 7–10′ out) | 6.6″ and 2.6″ from Horizons, 1850–2150 | sure (checked against JPL) | Medium: two more bright bodies for sights and lunars |
| 8 | Stud pins, arm in the rim, spring colour | estimated | measured and drawn | likely | Low (fidelity) |
| 9 | Measured, not yet drawn: stud bar 0.7–1.1 thick, fusee top recess r 5.5, escape pinion 3.5 long and 7.6 mm from its wheel | — | recorded open | rough to likely | **Potentially high** (the pinion: the train's heights) |
| 10 | `p3map.json` doesn't fit its photograph | suspected | confirmed | sure | Medium (provenance of photo readings) |

## 2. The measurements, critically

### 2.1 Pivots and jewels (items 1–4)

**What was done.** Jewel holes were read against the light: a hole shows as a disc of plain light inside the coloured stone,
and its ratio to the stone needs no camera (`tools/jewelhole.py`). Pivots and arbors were read as silhouettes, by brightness
profiles across them, scaled by a part of known size in the same frame.

**What holds.**
- The escape hole (0.17 ± 0.02 mm) rests on two scales that agree to 3 %: the stone (1.96 mm, against the model's 1.9) and the
  cap window. Hamilton's own patent gives the pivot (US 2,392,745: "about 7 thousandths of an inch"), and pivot and hole are
  consistent.
- The third's hole ratio repeats on two frames (0.284, 0.288) with a clean edge fit (3 px rms).

**What is weaker than it looks.**
- *The escape pivot is the patent's figure, not a measurement.* The patent speaks of "escape staffs for high-grade timepieces"
  in general, not of the Model 21. The hole was drawn at the top of its measured range (0.19) to take that pivot, leaving
  0.006 mm of side shake. If the hole is really 0.17, the pivot is at most about 0.16.
- *The train jewels' scale disagrees with itself by 9 %.* The bar's width (10.3 mm) gives stones r 1.13; the arbors' spacing
  (11.30 mm) gives 1.23. The bar's width was used because it is measured. Every size from these frames carries that 9 %,
  so read the holes as ±0.03.
- *The fourth's hole is looser than the third's* (its bore seen at a slant, fit rms 19 px).
- *The escape arbor's body is scaled by the model's own pinion*, whose tip radius follows the model's addendum rule
  (m × 0.525), an estimate. The reading is a ratio (0.456–0.478 of the tip radius), so it is only as good as that rule: ±10 %.
- *The first balance-pivot reading was wrong by a factor of three* (0.11 mm, from one dark edge of a polished pivot). Comparing
  the render with the frame, side by side as required, caught it before it was committed. The lesson is kept in VIDEOS.md:
  against the light, a polished cylinder shows two dark edges and a bright core.

**What is still not right.**
- *The balance staff's body is r 0.45 between its seats*, where the real staff is at least 1.7 mm across near the rollers.
  The rollers, hub and collet are bored to the thin body, so the staff as drawn could not be made as the real one is.
- The upper pivots of the balance, third and fourth are inferred (copied from the lower or left as before).
- The escape arbor's neck before each pivot (the patent's Fig. 4, visible at 10:12.2) is drawn as a plain step.

**Impact.** The sheets now give a maker jewel holes and pivots of the right order, which they weren't before: the escape
pivots were wrong by more than a factor of two. The physics is untouched by any of this: no part of the energy budget uses
pivot sizes. The train's efficiencies are an assumed range (0.85–0.95 a stage) and the balance's Q follows from the budget,
not from friction. So the measured pivots are a chance to check that budget, not yet a part of it (section 5, item 1).

### 2.2 The build book (item 5)

**What holds.** `tools/book.py` lays the book out as A4 print and fails on any drawing without a stated scale, text under
1.5 mm, lines under 0.1 mm, a page overrun, or a sheet line without material or fit. It found 116 problems and runs in `ci.py`,
so they can't come back unnoticed.

**What is weaker than it looks.**
- *It checks that each field is there and legible, not that it is right.* A wrong dimension prints as clearly as a right one.
- *Many "fits" are the other side of a relation* ("takes Hub – Balance wheel: in it (run) ... least gap 0.0239"): true and
  measured, but a description of the joint, not a tolerance to make it to. Only the manual's tolerances (end-shakes, shakes,
  clearances) are tolerances in the proper sense.
- *The threads are practice, not source.* Hamilton's threads appear in none of the sources. The thread suggested (ISO 261
  coarse) is the nearest standard to what the model draws, and that is sometimes well off: the train bridge's screws are drawn
  2.77 mm and offered M3 × 0.5. A maker following it would re-bore the clearance holes and tap 3.0, which is sound practice, but
  it is a choice the sheet makes for them.

**Impact.** This is the largest single gain for the "build it from the page" aim. Before, the drawings could not be used on
paper at all. Now they can be measured from, at a stated scale.

### 2.3 The hairspring's own isochronism (item 6)

**What holds.** The designed spring was solved as a planar elastica, a strip bending at the balance's real swing. The solution
converges to 6e-13 mm, the couple agrees with the energy's derivative to 1e-8, and the integrator reproduces a linear and a
Duffing spring. The result: the couple stiffens by one part in 81,000 at 270°, and the spring gains 0.11 s a day from 1⅜ to
1½ turns (+0.05 for each 10°).

**What is weaker than it looks.** This is the ideal strip: linear elastic, inextensible, exactly the designed curves, no
pinning error, no gravity, no change of modulus with stress. Real springs depart from all of these, and adjusters spend their
time on exactly those departures. So read the figure as the floor of the spring's own error, and its *sign* as the useful
part: it adds to the escapement's error rather than cancelling it.

**Impact.** `HS` stays 0 in the model, because the model reproduces an adjusted chronometer, as the performance card shows. For
a maker, the figure says the adjuster must take out about 0.18 s a day per 10° of swing, not 0.13. Small, but in the right
direction, and now derived rather than assumed.

### 2.4 Jupiter and Saturn (item 7)

**What holds.** The series is checked against JPL Horizons' apparent places at 90 reference epochs (6.6″ and 2.6″ at worst),
not only against the ephemeris it was fitted to. The essay states 10″ and 5″, and `tools/almanac.js` fails if the worst case
exceeds that.

**What is weaker than it looks.** It is a fit, not a theory. It is good from 1850 to 2150 and degrades fast outside: fitted to
1850–2100 alone, it was 108″ and 183″ out by 2149. It also adds 95 terms for Jupiter and 108 for Saturn to the almanac's code. And the
reference epochs were fetched separately from the rest of `almanac-ref.json`, at the same epochs, so the file now mixes two
fetch dates.

**Impact.** For navigation, two more bright bodies for star-style sights, and good enough (under 10″) for lunars, which the
Venus and Mars elements are not.

### 2.5 The review findings (items 8–10)

**What holds.** The stud's pins and the balance arm's height were read side-on at 6:50.0, and the arm's agrees with Hamilton's
patent drawing. Those changes are small and sure.

**What is weaker than it looks.**
- Moving the arm meant the timing weights' screws no longer reach it. They are now threaded in the rim alone. Whether the real
  ones engage the arm is not known.
- The three "measured, not drawn" items are held back for a real reason: each changes other parts, and the frames don't give
  everything those parts need. The escape pinion's reading (3.5 mm long, 7.6 mm from its wheel, against 2.0 and 10.45) is the
  one to take seriously. If it holds, the fourth wheel or the escape wheel sits at a different height than the model's measured
  heights say, and that touches the train, the escapement's layout and the lower bridge.
- *p3map.* The points traced on the top-view photograph don't fit the photograph in `References/`: at most 4 of its 8 screws
  land on screw heads under any similarity. Nothing reads the map's transform now, but any future reading from that photograph
  must be traced on it afresh. Readings already taken from it can't be re-verified against it.

## 3. Process: what this round showed

- **The comparison rule earns its keep.** Every geometry change was rendered beside its frame. Doing so caught the pivot
  misreading, and the escape arbor's comparison is what surfaced the pinion question.
- **Ratios without a camera are the strongest readings** (a hole against its stone; a shank against its pinion; a recess against
  its screws). Absolute scales borrowed from the model (the pinion's addendum, the bar's width) carry the model's own estimates
  into the reading, and should be named as such each time.
- **Browser checks must run alone, with no edits during the run.** One bom.py run was invalidated because the code changed
  under it, and was rerun.
- **Tools belong in the repository from the first reading.** `jewelhole.py` began in a scratch folder. A measurement in
  VIDEOS.md must name a command anyone can rerun.
- **Fixed figures drift.** The escape wheel's inertia is a constant in `tools/physics.js` (4.72e-9 kg·m²), while the solid now
  integrates to 4.75e-9 after the arbor change: 0.7 %, inside the check's tolerance, but a sign that such constants should be
  read from the model, not copied.
- **Parallel work.** Another session is on `claude/lock-arm-shape` (the locking arm, so the train-blocking screw waits) and one
  plans `claude/blender-export`. The two have agreed which files each touches, and shared files get additions only.

## 4. Where the project stands against its aims

- **Build from the page.** Much nearer. The parts that decide running (pivots, jewels, the hairspring's design, the escapement)
  are now measured or designed, and the drawings can be used on paper. Still between a maker and a working staff: the balance
  staff's body and the bores sized to it, the escape arbor's heights, the threads (now a stated choice, not an unknown), and
  tolerances beyond the manual's.
- **Rate and navigate.** Strong: the Sun, Moon, 58 stars and four planets, each with a stated and checked accuracy; sight
  reduction, lunars and the rate book from the sky.
- **True to the real chronometer.** Each round turns more estimates into readings, and some readings disagree with the layout
  (the escape pinion). That is the method working, but the next corrections will be structural, not cosmetic.

## 5. Recommended next steps, in order

1. **Put pivot friction into the energy budget.** Take the measured pivots, the jewels' and bushings' sizes and published
   friction coefficients, compute each stage's losses and the balance's damping, and check the derived `TF` (34 s) and the
   efficiency range against them. Read `J` and the other constants in `tools/physics.js` from the model, not copied. This
   closes the physics with what was measured.
2. **Settle the escape arbor's heights.** Read 42:50–42:56 and the arbor alone side-on for the pinion's length and its
   distance from the wheel, then the fourth wheel's height. If they confirm 43:21.1, re-lay the pinion and fourth wheel heights
   and rerun the full checks. This is the largest open fidelity question.
3. **The balance staff whole.** Its body between the seats as measured (about 1.7 mm and more), with the rollers', hub's and
   collet's bores, and the upper end if any frame shows it.
4. **The measured-but-not-drawn group.** The stud bar's thickness with the clamp and spring height; the fusee top's recess with
   the stop-bar spring and slot (after reading their depths at 20:00).
5. **Retrace `p3map.json`** on the photograph in `References/`, or find the copy it was made on, and re-check the parts placed
   from it.
6. **Decide the thread policy.** Either keep the drawn diameters and suggest the nearest standard (now), or draw each screw at
   its standard thread, so that model and sheet agree.

## Addendum (5 October 2026): two items re-worked

- **The escape pinion (item 9, section 2.5) was mostly a scale error.** Its first reading took the scale from the model's own pinion tips. Read
  again against the escape wheel (Hamilton's 13.16 mm, whose widest points lie at the arbor's depth), allowing for the pinion standing 4-5 mm
  nearer a camera a few centimetres away and for the view's tilt: the pinion's end stands 8.7-10.1 mm from the wheel's web, the model's 10.45
  inside that, so **the train's measured heights stand**. What remains is the pinion's own length, 3.6-4.7 mm against the 2.0 drawn: drawn 4.0
  now, about the same mesh. The lesson of section 3 applies to my own reading: a scale borrowed from the model carries its estimates in.
- **Pivot friction is in the energy budget (next step 1, done).** `tools/physics.js` A6 computes each stage from its measured pivots and teeth
  (0.91-0.97, the top of the range assumed) and the balance's damping from its parts (Q 202-390). The staff's pivot end is flat on the 7:08 trace,
  and that decides it: a domed end would leave the balance under-damped, swinging far past 1½ turns. With the mainspring's own losses (5-15 %) the
  budget needs 169-243, and the model's `TF` 34 s (Q 214) lies inside both ranges, now supported from the parts as well as from the budget.
- **The balance staff (next step 3), in part.** Between the hub's flange and the impulse roller the real staff is sheathed in the hub's brass
  sleeve, 3.24 mm across (34:12, against the impulse roller), now drawn. The disc under it reads 5.2-7 mm on two frames against the 4.4 mm
  flange drawn: open until it is identified. The bare body still shows only past the rollers, where it was measured (7:08).
- **The stud bar (next step 4), done; the fusee top's recess, still open.** The bar 0.85 thick and its clamp's 0.6 drop, both on 6:50.0, put
  the hairspring's height at 6.4 (pitch 0.533, inside the coils' 0.52-0.56). The recess's depth can't be read side-on (20:00: it lies inside
  the top), so it waits on an oblique view of its floor.
- **`p3map.json` (next step 5): confirmed lost, not retraced.** Screw heads found automatically (31 circles) fit at best 5 of its 8 screws by chance, and
  the map was committed a day before the photograph: it was traced on another copy. Its names don't say enough to trace them again, so closing it
  needs the original image (`chronometer_mech_1.jpg`) or a refit of the photograph-placed parts.
- **Threads (next step 6): decided.** The sheets keep the drawn diameters and give the nearest ISO 261 thread to cut, since Hamilton's threads are in
  no source; drawing each screw at a standard thread would change sizes the photographs measured.

