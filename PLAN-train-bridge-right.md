# Handover: the cock's steady pins and the upper train bridge's right side, from KLUwI2UUCMQ 6:47

For the next session working on this branch (`claude/train-bridge-right`, worktree `.claude/worktrees/train-bridge-right`, made from `main` at
release 2.39.01). Read `CLAUDE.md` first; its rules on measured lines, `isolate.py`, `RESOLVED.md` and the release apply to all of this.

## Where things stand

Release 2.39.01 surveyed the plates' holes against face-on frames of the restoration video with `tools/holemap.py` (CLAUDE.md, Verification
tools) and checks every hole for what it holds with `tools/holecheck.py` (in `ci.py`). The barrel bridge (13:04.4) and the pillar plate (9:03,
40:05) are done. The upper train bridge was surveyed on 13:49.5 (underside) and 23:30 (face up): its left side agrees to about 0.5 mm and one
hole was added there, but its right side reads too loosely to act on. The other parts' holes were already placed from frames with fitted
cameras and need nothing. Two things are left, and one frame can settle both: **6:47**, the cock off, the train bridge seen from above, the
same camera as 6:29 and 6:49.0 (within 0.1 px; `References/VIDEOS.md`, the 6:49.0 row).

## The two problems

Line numbers are `marine-chronometer-source/chronometer-working-model/js/movement.js` at the branch's start.

### 1. The cock's two steady pins are placed to about 2 mm (most certain to be improvable)

- `S.ckp=[[35.5,5.0],[26.9,19.8]].map(PT)` (440-441): "the two plain holes the train bridge shows under the cock with it off (C Spinner 6:47),
  placed to about 2 mm". The pins are drawn at 1333 (r 0.4, 1.5 tall), their holes in the train bridge at 590 (r 0.42), and the cock's foot
  is trimmed 0.45 round the near one (1327).
- Measure both holes on 6:47 through a fitted camera, put them in the movement's frame, and move `S.ckp` there (straight in the movement's
  frame, not through `PT()`: say so in the comment).
- If a pin moves more than about 0.5 mm, check the cock's foot and counterbore still clear it (1327), and that the cock's holes over the pins
  still line up (`holecheck.py` will say).

### 2. The upper train bridge's right side reads 3-4 mm off on 13:49.5 and 23:30

`Review-results.md`, "The overhaul's order against the model", the item *Hole survey, the upper train bridge*, has the numbers. In short:
- The fit used the rim (r 40.5), the cut round the barrel (`TB_CUT`, about (-24.125, -5.755), r 21.0) and the centre bushing (`video.py anchor`,
  0.06-0.34 mm rms on those circles). On the left side everything lands within about 0.5 mm.
- On the right side the barrel bridge's near screw, the cock's screw and two pins read 3-4 mm inside their model places in both frames. But
  13:04.4 puts the barrel bridge's hole for that same screw within 1 mm, and 6:49.0's camera placed those screws to 0.3 mm (the comments at
  728-731). So the likelier fault is the two frames (23:30 soft, 13:49.5 at a slant), not the model. Check it on 6:47 before moving anything.
- Three candidate holes are unconfirmed: about (-8.7, 22.1), (29.7, 1.1) and (-1.8, 33.1) (±3 mm). Confirm or drop each on 6:47 (and 6:49.0).
- The third wheel's upper bushing reads 1.2-1.3 mm from `L.T` in both frames. Don't move `L.T` on that: it comes from several video measurements
  (model README, "The layout"). Only report what 6:47 shows.

## How to measure (CLAUDE.md, "Build from measured lines")

- Frames are in `E:\mc-video\frames` (`MC_VIDEO=E:/mc-video`; never committed): `f_KLUwI2UUCMQ_6-47.png` (and 6-47.0, .25, .5, .75), 6-49.0,
  6-49.2, 6-49.5. `python tools/video.py frame KLUwI2UUCMQ mm:ss` takes more.
- **The anchor specs are stale** (memory: stale-anchor-specs): `tools/anchors/*.json` and `holes_trainBridge.json` predate the 12 October layout
  change. Regenerate the holes first with `python tools/holes.py trainBridge` (top face; about 20 s) and build a fresh spec: the frame, `"view":
  "above"`, those holes, picks on the centre bushing (and the third's), and circles traced on the rim (r 40.5 about (0, 0)) and on the cut round
  the barrel (the centre and radius above, not the old specs' r 19.2). Then `video.py anchor SPEC.json` (about 1 s; it writes `SPEC.H.json`).
  It needs a start: two or more named `pairs`, or `"init"`, an earlier `.H.json`.
- The cock's pin holes and the screws' heads stand at different heights: `framecam.py` (`SPEC.json [look | warp ...]`, about 1 s) recovers the
  camera from the anchor's homography and puts picks back at their heights. Read `References/VIDEOS.md`, "Methods" and "The camera's focal
  length", before trusting a millimetre.
- `holemap.py FRAME trainBridge --seed X,Z:U,V ...` (about 20 s, then a few seconds with `--reuse`) overlays the model's holes on the frame warped
  to the plan. Seeds can come from the anchor's homography: map eight plan points spread over the bridge through it. That is how the 13:49.5
  and 23:30 overlays were made.
- Accept a reading when two frames agree within about 1 mm, or one clear frame through a fitted camera agrees with the model's well-measured
  holes nearby. Say how sure each is in the code comment beside it. A hole with no known use goes in `holecheck.py`'s `EXPECTED` with its
  source.
- The user has no physical chronometer (CLAUDE.md). Don't ask for measurements.

## After each geometry change

1. `python tools/isolate.py trainBridge,cock --ref FRAME` and compare with the frame. The project's hook blocks your stop otherwise.
2. The fast checks (memory: batch-testing): `solids.py` (about 20 s), `audit.py` (about 10 s; `--update` after an intended change of coplanar
   faces), `holecheck.py` (about 45-55 s), the type check (about 10 s).
3. Once per batch, each alone (memory: browser-checks-under-load): `fine.py` (about 2-3 min), `bom.py` (about 9-11 min), `exploded.py`, `overhaul.py`.
   Moving a pin changes the parts' masses slightly: `mechanisms.py --write`, `massprops.py --write`, `node bench.js --write`, `python makers.py`,
   then rebuild the build-verification report (CLAUDE.md, verification tools).
4. `python ci.py --full` before merging. It took about 90 minutes on 15 October with other sessions' checks running.

## Bookkeeping

- Commit each fix separately and push after every commit (`git push -u origin claude/train-bridge-right` the first time).
- A `RESOLVED.md` entry for each fix under "Plates, bridges, screws and arbors", first under "Fixed, not yet committed", then moved under its
  heading with the hash in a follow-up commit (the pattern of 4c3f16e and e27b3c5).
- Update `Review-results.md`'s *Hole survey, the upper train bridge* item with what 6:47 shows, and the model README's "Estimated" lines for the
  pins if they change.
- `main` moves often (other sessions release the Wempe several times a day). Merge it in before merging back. In conflicts, rebuild the built
  copies and regenerate the generated files (`makers.js`, `bench.json`, `mechanisms.json`, the report), and rejoin the lists in `CLAUDE.md` and
  `ci.py` by hand, keeping both sides' entries. Then `git merge --no-ff` into `main`, and release only when the user asks.

## Pitfalls met on the last branch

- **`holemap.py --fix` coordinates** are read off the image the *seeds alone* draw, not off a later run's image: read them from a run without
  fixes, or the fit goes wrong.
- **Parallax**: a part standing off the face (a screw head, the cock's foot, the balance lower bridge 6 mm under the train bridge) lands 1-3 mm
  off in a homography fitted on the face. Correct a reading by the offset of the nearest well-known hole on the same plane, or use `framecam.py`.
- **Bounding boxes lie** for turned parts; read sizes from the code.
- **Line endings**: write files with `newline='\n'`.
- **Long heredocs** with mixed quotes break the Bash tool here; put a long patch in a scratchpad script. Two of last session's patch scripts
  broke on a literal newline inside a Python string: use `\n`.
- **Windows console encoding**: run checks with `PYTHONIOENCODING=utf-8` if one crashes printing "−".
- **Worktree removal** can fail with "permission denied" while a shell's working directory is inside it; `cd` out first.
- **Other sessions**: check `ListAgents` before touching the train bridge or the cock. On 15 October 2026 one session (marine-chronometer-03) was on
  the Wempe only.
