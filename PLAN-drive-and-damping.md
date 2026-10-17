# Plan: the mainspring's drive and the balance's damping

**Status (16 October 2026): ported to `main`** (branch `claude/drive-damping-port`, at the user's word). Task A's tools and findings are in: `drive.js`, the `fz*` candidates, `startup.js --xm` on `xM_mxtGfeqQ`, the literature on balances' Q, and the build-verification report's section 13. One finding was taken up the same day on `claude/mainspring-thickness`: `physics.js` now takes the solved spring's torque (0.96 N·m), not E b t³/12 L. With it the energy budget's gap against the model's `TF` 67 s is recorded in OPEN-QUESTIONS.md ("Open since 16 October 2026"); the page keeps 255° and `TF` 67 s (the owner's decision). The videos' 0.394 strip stays: thinner strips pull as much once set up and pack fewer coils than KLUwI2UUCMQ 15:54 shows. What follows is the plan as written.

Handoff for the next session (written 12 October 2026, after release 2.27.01). Work on the branch `claude/drive-damping` (its worktree is `.claude/worktrees/drive-damping`), push after every commit, merge `main` into it before each step, and merge into `main` or release only when the user says so.

## Why these two

`OPEN-QUESTIONS.md`, "How much each matters to the model's working", ranks two questions highest for the model as a mechanism and a timekeeper:

- **The balance's damping (`TF`).** This is the one place the model is shown to disagree with a real movement. In `We1dLNXiBj0` a hand start builds up much more slowly than the model's `TF` of 68 s allows: `tools/startup.js` misses it by 11-12° rms and fits only from about 120 s up.
- **The mainspring's thickness, its core and the barrel.** The steady swing fixes only drive × damping. The model draws the videos' 0.394 mm strip, against the parts list's 0.419 and the British Museum's 0.44, and `TF` was raised to match it.

The two are coupled, so they are worth doing together. Task A gives the spring from evidence that doesn't involve the damping. Task B gives the damping from evidence that doesn't involve the spring.

The daily rate is mostly protected either way, because the swing is calibrated: across the manual's band the escapement's rate moves only −0.14 to +0.24 s a day. What these questions change is the dynamics: the start, recovery after a disturbance, the swing following the drive, and the margins on full wind.

## Rules that matter most here

Read CLAUDE.md first. In particular:

- **The user has no physical chronometer and never will.** Never ask for a measurement, an instrument or equipment. Evidence comes from the manual, photographs, the downloaded videos, published literature and the model's own physics.
- **The sources outrank the model.** The manual, photographs and videos decide. Say how sure each reading is. Anything inferred or estimated goes in the model README's "Estimated, not from the manual" section.
- **Don't change the model's spring or `TF` without the user's decision.** The owner chose "follow the videos" for the spring on 12 October 2026. Report the findings with a recommendation, and change the model only on their word.
- **Run browser checks alone, one at a time.** `fine.py`, `bom.py`, `smoke.py` and Playwright probes crashed this week when run alongside video decoding by agents.
- **`mainspring.py` takes about 20 minutes on 14 processes.** Run it alone too.
- Give an ETA before each tool run (CLAUDE.md has the times).
- Every test's method and results go into the build-verification HTML report (`marine-chronometer-source/chronometer-working-model/verification/build-verification/`), not just the console. Videos and frames stay in `$MC_VIDEO` (`E:\mc-video`) and are never committed.
- **Coordinate with the other session.** `claude/build-verify` is working on the mainspring's room and the simulations (`PLAN-build-verification.md`; its decision 1, the mainspring's room, is waiting on the user). Use your own `MC_MS_TAG` names for spring variants. Don't rewrite its files (`mainspring_bound.json` entries it owns, its report sections) without merging `main` first.

## Task A: which spring does the fusee say?

**The idea.** The fusee's profile is measured: the groove floors fit `r0/√(1−a·m)` to 0.085 mm rms, a 1.96 : 1 taper (model README, the fusee's profile). Hamilton cut it to even one spring's pull. So the taper is that spring's ratio of full-wind to end-of-run torque, and the profile's shape is the torque curve's shape. This doesn't involve the balance's damping at all.

**Candidates:**

| Strip (mm) | Source |
|---|---|
| 0.374 | TN24H's coil pitch; also what the classic half-fill rule gives with the videos' L/t |
| 0.394 | the model as drawn |
| 0.419 | the parts list |
| 0.44 | the British Museum's ZE 10228 |

- **Lengths:** run each strip with L/t = 2,700 (the videos' ratio), and 0.394 also with L = 1,064 as drawn.
- **Cores:** r 4.9 (drawn), 5.4 (the one-third rule in the measured barrel) and 6.5 (the museum's 13 mm arbor).
- **Reuse first.** Commit `f9b9fed` and `mainspring_bound.json` already hold solved variants (the sources' proportions, option A) and the build's Nivaflex. Solve only the combinations missing.

**Steps:**

1. **Solve the missing variants.** For each, with distinct tags:
   - `MC_MS_T=… MC_MS_L=… MC_MS_RA=… MC_MS_TAG=… python tools/mainspring.py`, about 20 minutes each, run alone;
   - then `--bound`, about 6 minutes.

   Check the mainspring.py docstring for whether `--write` touches `js/mainspring.js`; a variant must never replace the model's spring.
2. **Set each one up by the page's fusee rule.** The rule is in movement.js after `makeFusee`, and `mainspring_friction.py`'s `setup()` mirrors it: the set-up where the spring's pull falls by RHO0 = 0.5098 over the chain's INT = 4.51 barrel turns. Record the set-up turns each variant needs, and compare with Op. 53's "about one turn". The drawn spring gives 1.01.
3. **Measure how evenly the fusee divides each spring's torque over the wind.** Use the frictionless torque, and the 0.10 coil friction that `mainspring_friction.py` uses: the fusee wheel's torque over the 8¾ turns, its spread (max−min)/mean and its trend. `mainspring_friction.py --variants` already reports "% of the wind outside the bench's band" for each variant, so start there.
4. **Check each one fits.** It must reach full wind short of coil-bound (the drawn spring has 0.13-0.38 turn to spare), and it must swing the balance inside 247.5-270° through the wind at the model's `TF`. Then find the `TF` that would put it at 255° (`tools/physics.js`, `ESC.ampAt`).
5. **Judge.** The evidence for a candidate is a set-up near one turn and the most even torque, together. State the sensitivity: the free curve is read to about 15 % (32:18, oblique), and the profile to 0.085 mm.

**Deliverable for A:**
- a table (candidate, set-up turns, torque spread, room to coil-bound, swing at `TF` 68 s, the `TF` needed for 255°) in OPEN-QUESTIONS.md item 1;
- a section in the build-verification report;
- a recommendation to the user.

## Task B: the balance's damping from the videos

**Known.** All the details are in OPEN-QUESTIONS.md, "The balance's free run-down":
- `We1dLNXiBj0` 0:55-2:04: a hand start, read by `tools/swing.py`; `tools/startup.js` fits `TF` of 120-320 s, and 68 s misses it.
- Jd2c3x8VKsE 14:04-14:12 and 16:10-16:17: small free swings, a constant friction of about 0.23° a second (the endstone, measured).
- `xM_mxtGfeqQ` 8:56-11:20: a steady running swing on a tripod (BunnSpecial, a break-circuit Model 21; 128 turning points, period 0.5003 s). Its swing is known only among 90, 180, 270 and 360° (±8°), because a timing weight shows at both turning points.

**Steps:**

1. **Pin `xM_mxtGfeqQ`'s running swing.**
   - Fit a camera to the balance rim's plane: `tools/video.py fit` on named points, or `tools/rimfit.py` on the rim's ellipse with the rim's measured r and the screws' places. VIDEOS.md "Methods" has the procedure.
   - Then read the turning points' angles in the rim's own frame, which picks one of the four readings.
   - A steady swing on a real movement constrains drive × damping, with the swing's period as a check.
2. **Look for more starts and run-downs** in the downloaded videos (`E:\mc-video`): a balance let go by hand, or stopped by the train-blocking screw and timed.
   - `tools/swing.py survey` lists the ones already rejected and why.
   - Search by 2 Hz band power as before, and check each hit frame by frame.
   - Add whatever you find to `swing.json` and VIDEOS.md.
3. **Re-run `node tools/startup.js`** (about 8 minutes; also `--split`) with the new data. The start's build-up gives `TF` almost regardless of the drive, and the steady swing gives the drive at that `TF`. Together they separate the two.
4. **Work the damping out from first principles**, as a cross-check. `physics.js` puts the balance's parts at Q 406-712, with air about half the loss. Tighten the air's share with published measurements of balance damping in air against vacuum, named in the text and in the README's Sources (CLAUDE.md allows published literature for physics). A CFD run on the drawn balance is optional.

**Deliverable for B:**
- the steady swing of `xM_mxtGfeqQ` with its uncertainty, and any new starts;
- `startup.js`'s fit with them;
- a best `TF` with a range;
- all recorded in OPEN-QUESTIONS.md, VIDEOS.md and the build-verification report (the real-chronometers report too, if the swing is new evidence: `verification/real-chronometers/`).

## Putting A and B together

The hypothesis to test is that a thinner spring drives a less-damped balance. If A points to about 0.374 mm, roughly a `TF` of 80 s or more is needed for 255°. That is the direction the slow real start points, and the museum's 0.44 would then belong to the late assembly. If A and B agree, recommend to the user:
- set the spring to that strip;
- set `TF` to fit both;
- regenerate everything that depends on them.

If they don't agree, report the conflict and stop.

**If the user approves a change**, these depend on the spring and `TF`:
- the spring and fusee: `tools/mainspring.py` (then `--write`), the fusee rule's set-up in movement.js, `mainspring_friction.py` (its FUSEE, TUP, TDOWN, INT and RHO0 constants are read off the page, and `invariants.py` holds them to it);
- the physics: `physics.js` (the essay's `data-phys` figures), `tolerances.js --write`, `bench.js --write`, `makers.py`;
- the reports: the build-verification report, then `ci.py --full`.

## Pitfalls already met

- **The groove's phase is pinned** at `MG = 0.7201035` in `makeFusee` (`phi0`, `rotT`). Don't let it depend on anything movable again. `invariants.py` compares the fusee's torque and barrel turns with `mainspring_friction.py`'s table to 0.0002.
- **Mass changes** (new parts, resized parts) make `tools/gimbals.json` stale: run `massprops.py --write`.
- **A full CI run of about 40 minutes** can hit a shell timeout. Run `ci.py`, then `ci.py --only <the full steps>`, separately.
- **When agents measure on video**, give them the scale's source and ask them to say which end or side is which in the frame. Two readings this week were wrong until checked against a second frame.

## Times

- `mainspring.py` about 20 minutes a variant (`--bound` 6 minutes); `mainspring_friction.py --variants` about a minute a variant.
- `startup.js` about 8 minutes; `swing.py` about 7 seconds a video.
- `video.py fit` 2-4 minutes; `rimfit.py` about 2 seconds.
- `physics.js` under a second.
- `ci.py` about 9 minutes, `--full` about 40 minutes.
