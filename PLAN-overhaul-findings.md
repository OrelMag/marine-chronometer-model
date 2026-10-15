# Handover: the three model problems the overhaul check found

For the next session working on this branch (`claude/overhaul-findings`, worktree `.claude/worktrees/overhaul-findings`, made from `main` at
release 2.34.00). Read `CLAUDE.md` first; its rules on measured lines, `isolate.py` and the release apply to all of this.

## Where things stand

Release 2.32.00 added the overhaul: the manual's 58 operations to take the movement down (Sec. V) and 105 to put it back (Sec. VIII), each part
lifted off or put on along its arbor in its turn (`js/overhaul.js`; model README, "The overhaul"). `tools/overhaul.py` (about 12 s, in `ci.py`)
follows every operation and fails if a part passes through another. It passes, but only because its `EXPECTED` table lets through three things the
model draws wrong. Each is in `Review-results.md`, "The overhaul's order against the model", with its numbers. The goal: make the model right, so
that their `EXPECTED` entries can be deleted and the check still passes.

A fourth finding (the Exploded view driving the barrel cap's screws into the barrel) was a misreading and is withdrawn there. Don't chase it.

## The three problems

Line numbers are `marine-chronometer-source/chronometer-working-model/js/movement.js` at the branch's start.

### 1. The arbors are wider than the holes they pass (most work, most certain)

What the model has:

| Piece | Where | Size |
|---|---|---|
| Fusee upper bushing, 42164.fu, in the barrel bridge | 711, `bushR(..., 1.6, 1.02)` | outer r 1.6, bore r 1.02 |
| Barrel upper bushing, 42164.bu | 711, `bushR(..., 1.95, 1.42)` | outer r 1.95, bore r 1.42 |
| Fusee arbor above the bushing, part `sq` (42022 sub) | 1430, `cylBetween(R.sq, 1.2, -36.56, -27.16)` | r 1.2, starting on the bushing's top face |
| Fusee arbor's square | 1430, `BoxGeometry(2.4, 1.6, 2.4)` at y -37.16 | 2.4 across the flats, half-diagonal 1.70 |
| Barrel arbor's body (42170) | 1357, `cylBetween(ba, 1.4, -27.40, -1)` | r 1.4 |
| Barrel arbor's square | 1369, `ASQ=2.2` | 2.2 across the flats (KLUwI2UUCMQ 38:25 reads 2.0-2.3), half-diagonal 1.56 |
| Dust seal (42051) | 1421, its lathe's bore | r 1.3 |

Consequences, all straight from the geometry:
- The barrel bridge can't come off over either arbor (Op. 31) or go back on (the reassembly's Op. 44).
- The dust seal can't come off over the fusee's square (Op. 29).
- The barrel arbor's square can't pass the barrel's end hole (Op. 36).

On the real movement the bridge comes off over both arbors: KLUwI2UUCMQ 12:58-13:04 (`References/VIDEOS.md`, the rows round 12:48-13:04).

Leads, strongest first:
- **The parts list gives both upper bushings one number, 42164** (`bom.json` lines 42164.fu and 42164.bu; the lower ones 42164.fl and .bl too).
  One part means one bore. The model gives them two (1.02 and 1.42), and nothing in the code cites a source for the fusee's 1.02. Making 42164.fu
  the barrel's 1.95/1.42 is sourced by the parts list; check the lower bushings while there.
- **The squares must pass the bores** on any real arbor: half the diagonal no more than the bore. A 2.0 square (half-diagonal 1.41) passes 1.42,
  and 2.0 is inside the barrel square's measured 2.0-2.3. Measure again before choosing (see "How to measure" below).
- **The fusee arbor above the collar** is `Review-results.md` "Still open after the collar's height" 1. It already lists what to change together:
  the arbor's shaft and winding square, the bushing (42164.fu), the dust seal (42051) and its ring (42052). It also gives the video's reading:
  the arbor above the collar about r 1.75 (20:00, 19:59), the square starting at a step about 11 mm over the fusee's top. Read that item whole.

Knock-on parts to keep fitting: the winding key's socket over the fusee square (`R.wkey`, the line after 1430: its socket at -36.36 to -37.96);
the case's key hole (`box.js`); the setup ratchet (42026) and its click on the barrel arbor's square; the dust seal's packing rings (42054).
`fine.py` and `bom.py` measure every one of these fits.

### 2. The winding ratchet wheel can't come off the fusee (Op. 43; the reassembly's Op. 17)

- Its bore is r 2.43: `bore:2.75*k`, k = FK 0.882 (1692, 1693).
- On the side it must come off, the arbor steps out to r 2.87 for the sustaining ratchet's seat (1684, "stepped to r 2.87 under the sustaining
  ratchet"). The collar it sits on is r 2.38 (2.7 k).
- The video reads the collar about r 2.7 (KLUwI2UUCMQ 28:08-28:17; rough, the view oblique, +-1 mm).

Either the ratchet's bore is too small or the step is too big. Measure the bore face-on: 18:24.5 (4K, the large end, the end plate off), the
frame the ratchet's teeth were traced on (`movement.js` 158). The sustaining ratchet must still ride the step, and the fusee wheel too. Check
the maintaining work after any change: `maintaining.py`, and `fine.py` for the fusee's insides.

### 3. The seal ring and its spring are shut inside the dust seal (Op. 30; the reassembly's Op. 52)

- The dust seal's lathe (1421) has a groove round its bore, r 1.3-3.0, from y -31.8 to -27.9.
- The seal ring 42052 (`ringGeo(2.95, 1.21, 0.6)` at y -31.5, 1423) and the helical spring 42053 (1425) sit in that groove, so neither can come
  out straight either way.
- Figs. 24 and 80 draw them under the seal, on the barrel bridge, and Ops. 29-30 take the seal off first, then them. That is fairly sure (two
  figures agree); their place and sizes are not yet read anywhere.

Find the moment the dust seal comes off on KLUwI2UUCMQ: between the setup work (11:46-12:22) and the barrel bridge lifted off (12:58). Sheet that
stretch and read what lies under the seal. Then redraw the seal's underside, the ring and the spring from what the frames and figures show.
Problem 1 changes the same seal's bore; do 1 and 3 together.

## How to measure (CLAUDE.md, "Build from measured lines")

- Videos are in `E:\mc-video` (`MC_VIDEO`; never committed). The tools: `python tools/video.py sheet KLUwI2UUCMQ --from 11:40 --to 13:10` (about
  1 s a frame) to find the moment, `video.py frame ID mm:ss` for a full 4K frame, then `rimfit.py`, `framecam.py` or `jewelhole.py` (a hole against
  its stone, no camera needed). A ratio inside one frame (the square against the bushing or the arbor's pivot) needs no camera. Read
  `References/VIDEOS.md`, "Methods" and "The camera's focal length", before trusting a millimetre off a frame.
- The manual's figures are in `References/navships-250-624-overhaul-manual-1948.pdf` (Fig. 24 p. 23, Fig. 80 p. 56; Figs. 69-73 for the fusee).
  `pdftotext` gives the text layer.
- Every new number goes in the code comment beside it with its source and how sure it is. Anything still estimated goes in the model README's
  "Estimated, not from the manual".
- The user has no physical chronometer (CLAUDE.md). Don't ask for measurements.

## After each geometry change

1. `python tools/isolate.py PART --ref FRAME` for each part changed, and compare it with the frame or figure: say what matches, what differs and how
   sure each reading is. The project's hook blocks your stop otherwise.
2. The fast checks (`memory: batch-testing`): `solids.py` (16 s), `audit.py` (9 s), the type check (10 s).
3. `python tools/overhaul.py` (12 s). When a problem is fixed, delete its `EXPECTED` entries (`SQ`, the two winding ratchet lines, `SEAL`) and it
   must still pass. Then plant a fault to prove it still catches one: `--eval "OVH.HOST['42015']=0"` must fail.
4. Once per batch: `fine.py` (2.5 min), `maintaining.py` (8 s), `bom.py` (6 min, run alone: `memory: browser-checks-under-load`), `exploded.py`
   (20 s), `book.py` (1 min), then `python ci.py --full` before merging (about 20 min).
5. If a bushing's bore or an arbor changes, `barrel-clearance.js` (through `fine.py`) and `fea.py --check` may move too. Rebuild the build-verification
   report if a number it shows changes (CLAUDE.md, verification tools).

## Bookkeeping

- Commit each fix separately and push after every commit (`git push`; the branch already tracks `origin`).
- Add a `RESOLVED.md` entry for each fix under its heading (Winding and maintaining work, or the barrel and fusee's), with what to keep true. Update
  `Review-results.md`'s three items to *Fixed*, with the measurement. Update "Still open after the collar's height" 1 too.
- Merge `main` into the branch before merging back (other sessions release often; rebuild the built copies, don't hand-merge them). Then `ci.py`,
  `git merge --no-ff` into `main`, and a `patch` release only when the user asks.

## Pitfalls met on the overhaul's branch

- **Bounding boxes lie for turned parts.** A part rotated about its arbor gives an inflated box. That is how the previous session read the
  winding ratchet's neighbour as "r 4.0". Read sizes from the code (`cylBetween`, lathe profiles, `bore:`) or measure along a section.
- **Rises are relative.** The Exploded view moves a screw by its part's offset and its own lift; compare a piece's move with its parent's, not
  with zero. That is how the withdrawn fourth finding came about.
- **Line endings.** Python's `Path.write_text` on this machine writes CRLF. Pass `newline='\n'`. Git normalises on commit, but the build reads the
  working copies.
- **Long shell heredocs** with mixed quotes break the Bash tool here. Put a long patch script in a file in the scratchpad and run it.
- **Windows console encoding.** A check printing a "−" can crash on cp1252. Run with `PYTHONIOENCODING=utf-8` to see its real message
  (`smoke.py` did this once).
- **Other sessions.** Before touching the barrel bridge, dust seal, fusee or barrel, check `ListAgents` and ask whether anyone is on them. On 15
  October 2026 one session was on the balance cock, another on the mounting ring, others on the Wempe model.
