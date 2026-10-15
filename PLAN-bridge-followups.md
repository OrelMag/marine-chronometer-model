# Handover: the barrel bridge's horn notch, the timing weights' room, the cock screw's place

For the next session working on this branch (`claude/bridge-followups`, worktree `.claude/worktrees/bridge-followups`, made from `main` at
release 2.41.01). Read `CLAUDE.md` first; its rules on measured lines, `isolate.py`, `RESOLVED.md` and the release apply to all of this. Do
the three in this order: the first two are small, measured fixes from frames already worked; the third is optional.

## Where things stand

Release 2.41.01 (branch `claude/train-bridge-right`, merged as 2035ed2) settled the barrel bridge's cut round the balance as one circle
measured on KLUwI2UUCMQ 13:04.4 (`BB_CUT=[2.03,9.96,20.06]`), added the barrel bridge's two steady pins (`S.bbp`), moved its near screw
(`S.bb[1]`), placed the cock's steady pins from the cock screw's hole (`S.ckp`) and added a train-bridge hole (`S.tbx`). Its records:
`RESOLVED.md` (Plates, bridges, screws and arbors: 1ec6538, 2ffb801), `Review-results.md` ("Hole survey, the upper train bridge", with
"Followed up on 6:47" and "Measured further"), `OPEN-QUESTIONS.md` ("The cock screw's place on the cock"), `REQUESTS.md` item 11,
`References/VIDEOS.md` (the rows dated 15 October 2026 after "The cock's steady pins").

**Lesson from that branch** (memory: oblique-camera-right-side): the camera fitted on 6:49.0 (the same view as 6:29 and 6:47) misplaces
holes near the bridges' rim by up to 3 mm. Near the rim, measure on face-on frames (23:30 the train bridge face up, 13:04.4 the barrel
bridge upside down, 13:49.5 the train bridge's underside), anchored on the part's own rim, cut and holes, and read a feature against
well-placed holes beside it. Accept a reading when two frames agree within about 1 mm.

## 1. The rectangular notch in the barrel bridge's horn (do first)

**What's wrong.** `S.bbX` (movement.js, about line 496) ends with `[36.29,2.47,0.9,1]`, a round hole of r 0.9 through the barrel bridge,
with its `holecheck.py` `EXPECTED` entry ("a second hole beside the opening at 3 o'clock"). On 13:04.4 there is no round hole there: it's
a **rectangular notch at the edge of the horn on the cock's side**, its long sides radial. Read through the homography below: corners
about (37.92, 3.75), (35.04, 3.56), (35.26, 1.37), (37.98, 1.71) (frame px (610, 342), (697, 383), (660, 447), (580, 403)): about 2.1 mm
wide, its inner end at r 35.2, open to the rim. The two corners read at r 38 rather than at the rim (40.5) because the frame's edge there
is out of the fitted region; take the notch as running out to the rim unless a frame says otherwise.

**Open before drawing it: through, or a recess in the underside?** Its inside shows brown on 13:04.4, not the blue mat, which suggests
a blind recess (a pry slot for levering the bridge off is the usual reason for one at a bridge's edge). Check it from above with the
bridge on (6:47, 6:49.0: the bridge's edge just above the near screw `S.bb[1]` at (32.90, 6.60)), and on 23:45 (the barrel bridge laid
flat face up) and 12:58-13:04 (`References/VIDEOS.md`: the bridge lifted and turned over). If no frame shows it from the top, it is
blind; then read its depth on a side-on frame if one exists, else estimate it and say so in the README's "Estimated" section.

**How to measure.** The 13:04.4 homography: `cv2.findHomography` from the barrel bridge's holes (`python tools/holes.py barrelBridge
--bottom`, about 20 s; the underside's face y -27.16 is reported as "underside") to these frame picks, full-resolution px (`view` below:
x not mirrored), 0.03-1.14 mm each left out:

    h10 (fusee bushing) 1110,1224   h2 (barrel bushing) 2470,1420   h12 (opening over the third pillar screw) 635,600
    h9 1306.0,1441.8   h8 1552.1,1438.8   h1 2800.6,1436.9   h11 924.7,1013.3   h6 1952.0,1901.6   h5 2077.8,1692.0

(the h-names are the order `holes.py` gave on 15 October; check them against its output, by position, before using them). Better: write
this as a `video.py anchor` spec in `tools/anchors/` (`"view": "below"`, the holes and picks above, the bridge's rim r 40.5 traced as a
circle) so it can be rerun, and trace the notch's edges as points on a 4x crop (the frame's notch is about 600-700 x 340-450).

**How to draw it.** The barrel bridge's outline is `BBpoly` (movement.js, about line 747: the rim laid out in the photographs' frame,
`.map(PTr)`, `subtractCircle(…BB_CUT…)`, `clipUnder(…ckE…)`). A notch through the bridge is a polygon cut from that outline (look in
movement.js for a polygon-difference helper first; `subtractCircle` and `clipPoly` are at about lines 180 and 226). A blind recess is
`blindHoles()`'s job in `core.js` only for round holes, so a rectangular one needs a stepped face. Ask the user before writing a new
geometry helper. Then drop `[36.29,2.47,0.9,1]` from `S.bbX` and its `holecheck.py` entry, and update the `S.bbX` comment (about line 492)
and `RESOLVED.md`.

**Checks.** `isolate.py barrelBridge --ref E:/mc-video/frames/f_KLUwI2UUCMQ_13-04.4.png` (the hook requires it), then the fast ones:
`solids.py`, `audit.py` (`--update` if only coplanar contact counts change), `holecheck.py`, the type check.

## 2. The timing weights' room

**What's stale.** The timing weights' travel was set by the old cut: movement.js about line 1183, "the 2 turns either way the rate panel
allows (0.174 mm a turn) bring them … to 17.5 mm from the staff turned out, 0.1 inside the barrel bridge's cut round the balance (r 17.6 on
the top-view photograph): with the nuts as measured there is no room for more". The cut is now r 20.06 about a centre 0.53 mm from the
staff, so its nearest point is about 19.5 mm from the staff: about 2 mm more room, and the cut is no longer what limits them. The README
says so (the "Estimated" bullet on the weights' travel, "not yet used").

**What to find.** What really limits the timing nuts turned out, now: the screw's thread length (Fig. 3; the screws' sizes in the parts
list, `bom.json`), anything else at the rim's height within r 19.5 of the staff (run `fine.py` with the weights turned out:
`fine.py --eval "__mv.userData.R.timing(N,0)"` for increasing N, each about 2 min), and what the manual says of the travel (p. 70 starts
them at mid-travel; Op. 5: screws and washers leave 2 minutes a day, which 3 turns at 40 s a turn would cover). Measure, don't choose for
clearance: if no source gives the thread length, keep 2 turns and say why.

**If the travel changes.** It lives in the rate panel (app.js about line 624, "the timing weights up to 2 turns either way") and in
`R.timing` (movement.js about line 1239). Then rerun what depends on the timing: `invariants.py` (40 s a day a turn), `node bench.js
--write`, `python makers.py`, the build-verification report (CLAUDE.md, Verification tools), and `smoke.py` (the rate panel's controls).
The README's weights bullet and the movement.js comment change with it.

## 3. The cock screw's place on the cock (optional; only with the user's go-ahead)

**The question.** `OPEN-QUESTIONS.md`, "The cock screw's place on the cock": the train bridge's hole for the cock screw reads 2.4 mm from
`S.cock` on 23:30 and 13:49.5, within 0.7 mm of each other, measured against the same nearby holes (the third pillar screw's counterbore
(5.82, 34.03) and the sustaining pawl's two holes (24.01, 4.01), (22.12, 5.83): a similarity, 0.03-0.43 mm on them): (21.81, 24.96) and
(21.95, 25.66). Meanwhile the cock's straight edge (the barrel bridge's horn edge, which ends against it, on 13:04.4) and the staff are
where the model has them, and 6:29 reads the cock screw 25.9 mm from the cap's centre. So the screw would sit about 1.6 mm further from the
straight edge on the cock than drawn, where its counterbore (7.4 across) would reach 1 mm into the body's wall as drawn (`CK_RP` 22.6,
whose form at the screw is estimated). Nothing in the escapement or train depends on it; the cock's pins follow `S.cock`.

**The one source left.** BunnSpecial Part 1 (`Jd2c3x8VKsE`, No. 2182, 720p), 24:10-26:00: the cock and balance out, the movement seen
nearly from above, about 6 px/mm (`E:/mc-video/frames/f_Jd2c3x8VKsE_26-00.png`, also 24-30 and 25-20). The holes there can't be named
surely by eye: fit a camera with `video.py fit` (named points at their heights: the bridges' rims r 40.5 at y -23.76 and -27.16, the
barrel bridge's screws' heads, the centre and third bushings, the setup ratchet's arbor) and `unproj` the cock area's holes at the train
bridge's top (-23.76). Expect about ±1 mm; act only if it agrees with 23:30 and 13:49.5 within 1 mm, and then the change is the cock's
solid (the screw, its counterbore, the body's wall round it) as well as `S.cock`: ask the user before starting it. Otherwise record the
result in `OPEN-QUESTIONS.md` and leave it for `REQUESTS.md` 11.

## Bookkeeping

- Commit each fix separately and push after every commit (`git push -u origin claude/bridge-followups` the first time).
- A `RESOLVED.md` entry for each fix under "Plates, bridges, screws and arbors" (the notch) or "Accuracy to the manual" (the travel, if it
  changes), first under "Fixed, not yet committed", then moved under its heading with the hash in a follow-up commit.
- Once per batch, each alone (memory: browser-checks-under-load): `fine.py`, `bom.py`, `exploded.py`, `overhaul.py`; a changed bridge's
  mass means `massprops.py --write` and `node gimbals.js` (then the report). `python ci.py --full` before merging (85 min on 15 October with
  other sessions' checks running; 30 min for the plain run).
- `main` moves often (the Wempe sessions). Merge it in before merging back; rebuild the built copies with
  `python build.py --site-url https://www.marinechronometermodel.com` rather than resolving them by hand. Merge with `--no-ff`; release and
  deploy only when the user asks.
- The user has no physical chronometer (CLAUDE.md). Don't ask for measurements.

## Pitfalls met on the last branch

- **Windows line endings**: `json.dump` through a text-mode `open()` writes CRLF; open with `newline='\n'`.
- **`*.H.json` is gitignored**: an anchor's `init` file must have another name to be committed (`KLUwI2UUCMQ_23-30_init.json`).
- **`video.py anchor` needs two named pairs or an `init`** when circles are given; pairing the third's bushing (T) turns the fit (its
  bushing reads 1.2 mm from `L.T`), so pair the centre bushing alone and start from an `init`.
- **A homography from an anchor needn't decompose into a camera** (23:30's doesn't, at any focal length): points below the face (the
  balance's lower jewel) can't be corrected for parallax there. Use 13:49.5 with `framecam.py` for anything off the face.
- **The commit split**: when separating fixes that touch the same files, restoring the file afterwards counts as a geometry edit for the
  stop hook; rerun `isolate.py` once at the end.
