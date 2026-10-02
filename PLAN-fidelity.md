# Plan: closing what's open in fidelity and the model's geometry and placement

Written 2 October 2026 from `IDEAS.md` §1, `Review-results.md` (findings 6 and 9, the
smaller issues, "BOM comparison: Still open", "Open questions, to settle from video" 1–22,
"The fusee assembly against Fig. 28": Open), the model README's "Estimated, not from the
manual", `BOM.md` and `Orel_comments.md`. RR is `Review-results.md`.

**Source of truth.** The 1948 manual (NAVSHIPS 250-624: its text, operations, figures and
parts list), photographs of real Model 21s and videos of real Model 21s
(`References/VIDEOS.md`). Each item names what the manual says about it first. Where the
manual and a video disagree, record both and settle it with the user. Estimates and clearance
fits give way to either.

**Branches.** This work is on `claude/fidelity-plan` (worktree
`.claude/worktrees/fidelity-plan`), with a sub-branch per phase merged back with `--no-ff`;
`main` is merged in before each phase. Nothing goes into `main` until the user asks.
Another session is on **`claude/group-layout`** (IDEAS 1.12). Until it merges, this plan
doesn't touch what it owns: `L`, `PILLARS` and the constants traced through `PT()`, the
fusee, barrel and maintaining work (`gw`, `sspring`, `sratchet`, the chain, the click),
the train and barrel bridges, `maintaining.py`, IDEAS 1.2, 1.11 and 1.12, RR 19, 21
and 22.

Effort: **S** an evening or two, **M** a week or so, **L** several weeks.

## The open items

| # | Item | Sources | Manual | Impact | Effort |
|---|---|---|---|---|---|
| **Layout** | | | | | |
| 1 | The fusee, barrel and pillars against the train (**on `claude/group-layout`**) | IDEAS 1.12, 1.2, 1.11; RR 11, 19 (fusee), 21, 22; BOM open 1 (the known deviation 42055.tb) | Op. 14 and the parts list: all three train-bridge screws in pillars, four pillars (42059 ×3, the barrel pillar) | High | L, half done |
| 2 | `solve.py`'s inputs predate the photo fits | RR finding 6 | — | Med | S |
| 3 | The train against the group: the balance 11–12 mm from the fourth on video (model 16.6), 36:01's remaining 18°, the fourth arbor 21.2–23.2 mm out (model 23.9), the train bridge putting the third arbor with the group | RR 14, 19 (rest), 10, 18 | p. 15: the fourth under the seconds hand; p. 14: which settings each bridge carries; the escapement's 9.40 mm (Op. 84) | High if real; the evidence conflicts | L, measure first |
| 4 | The wind indicator's radius against the mounting ring's bore (the sub-dial 1.13× as far out as the seconds) | RR 19; README | Fig. 107 (the motion work), the dial | Med | M |
| **Escapement area** (after 3) | | | | | |
| 5 | The keyhole: three lobes and a round hole, 3 mm of metal below the notch | RR 15, 21; IDEAS 1.3 | Figs. 29, 67 | Med | M |
| 6 | The escape upper bridge: thickness, boss under the cap, steady pins, countersunk end screws, the cap's straight edge; endstone caps 42159 | RR 17, 10 | Figs. 84, 110; parts list 42064, 42159 | Low | S–M |
| 7 | The train-blocking screw about 7 mm from the fourth (model 5.0) | RR 7–8; BOM 7 | Sec. II, Fig. 110 | Low | S |
| 8 | The detent support block's place; its second pin 2.9 mm nearer than Fig. 90 | RR 12, 16, 20.2; README | Sec. II, Figs. 14, 22, 90; Ops. 80–81 | Low (hidden) | M |
| 9 | The lower bridge's steady pins; the dark hole near the escape wheel; the tapped hole at (11.24, 29.51) | RR 6, 9, 5 | Figs. 29, 30, 110; Ops. 12, 50 | Low | S each |
| **Train arithmetic** | | | | | |
| 10 | The centre pinion 14 or 13 (run 56¼ h or 60.6 h); the fusee arbor's pinion | IDEAS 1.8 | Sec. III p. 18: 17½ half turns, "a maximum of 56 hours", seven half turns after 24 h | Med; **feeds 1** (`MOD.fusee` = 2·\|Fu\|/(90+cp)) | S if a frame shows it |
| 11 | The motion work's counts (12 : 36, 10 : 40 chosen); confirm the escape pinion's 10 | IDEAS 1.8 | Fig. 107 (parts), the 12 : 1 ratio | Low–Med | S–M |
| **Fusee and barrel parts** (after 1) | | | | | |
| 12 | The fusee's top (the hub through a large hole, the stop-bar 3.6 mm off the axis, the arbor thicker above the collar), the large end's rim and the winding ratchet's size, the end plate's boss, the winding-pawl springs as long arcs, two unexplained holes under the sustaining ratchet | RR fusee assembly 3–7 | Figs. 28, 69–73; Ops. 16–45 | Med | M |
| 13 | The setup ratchet and click; the dust seal | BOM open 2; `Orel_comments.md` | Fig. 80, Op. 41; parts list 42052–42053 | Low–Med | S–M |
| 14 | The mainspring's length (600 mm estimated); the chain's hook shown in "Stored energy" | IDEAS 1.9 | Parts list (thickness only); Figs. 17, 75 | Low | S each |
| 15 | Oil sinks on the unjewelled bushings | IDEAS 1.10 | Sec. VIII, the oiling chart | Low | S |
| **Elsewhere** (independent of 1) | | | | | |
| 16 | The split-balance variant runs through the barrel bridge and the escape upper bridge | RR finding 9 | Sec. I–II: the Model 21's balance is the uncut one; the split rim is shown as history | Med (a real collision; `fine.py --split` fails) | S |
| 17 | The lock-adjusting screw stops 0.24 mm short of the stop button; the slot Fig. 90 draws | RR 20.5 | Fig. 90, Sec. IV ("working through the locking jewel button") | Low | S |
| 18 | Six balance screw weights and six timing washers in the rate panel | IDEAS 1.7 | Sec. II; parts list p. 93, p. 99; Tables II, III | Med | S–M |
| 19 | The shield plate as Fig. 107 draws it (a disc and an open-ring spring) | BOM open 2 | Fig. 107, parts list | Low | S–M |
| 20 | Function checks in `bom.py` (locking arm, train-blocking screw, twist to start, the setup click's direction, shield plate, latch) | BOM open 3 | Figs. 9, 80, 106, 110; Secs. III, X | Med | M |
| 21 | The hands short of their tracks | RR smaller issues | Op. 64 | Low | S (check first) |
| **Left on purpose: decide do or won't do** | | | | | |
| 22 | The collet as Fig. 5 draws it and its counterpoise; the cock's nose trim; the Navy's balance stop; the barrel pillar's profile; the dial face untested by `fine.py` | IDEAS 1.4, 1.10; RR 13; BOM 8; RR 7 | Figs. 5, 6; Sec. I ("a balance stop") | Low | S–M each |

## Order of work

**Phase 0 (no code).** Agree file ownership with the `group-layout` session (done:
message sent 2 October 2026). The stale doc branches (`claude/tidy` with the newer
`Orel_comments.md` and `.gitignore`, `claude/ideas-status`, `side/comments`) are for the
user to merge or drop.

**Phase A: 1.12, on `claude/group-layout` (the other session).** Closes 1, and with it
IDEAS 1.2, 1.11, 1.12, RR 11, 21, 22 and the BOM's deviation. This plan's part in it:
- **10 first.** Count the centre pinion end-on (C Spinner 13:51–13:57, 23:45) and the
  indicator pinion (29:04–29:12), and send the result before the fusee's module is
  frozen. If no frame shows it sharp and whole, 14 stays and is recorded as the manual's
  56 h reading (Sec. III).
- **2 with it.** `solve.py` gets the turned `L` and the counts once 1.12 settles them.
- If step 5 re-traces the cock, its nose trim (22) goes in with it.

**Phase B: independent of A; now, on sub-branches of this one.**
- B1: 16, the split balance's weights (and the About dialog's sentence on it).
- B2: 18, the screws and washers (after B1: both touch the balance and `R.timing`).
- B3: 17, the lock-adjusting screw.
- B4: 21, the hands (check first).
- B5: 19, the shield plate (`box.js`).
- B6: 14's chain hook in the walkthrough (`app.js`).
- B7: 20, `bom.py`'s function checks.

**Phase C: readings, no code; now.** Results go into `References/VIDEOS.md` and RR.
- C1: 10 (urgent for A), then 11.
- C2: 14's mainspring (C Spinner 16:28–17:04, 32:20–32:52), 15's sinks (14:12–15:12,
  33:44–33:56), 13's setup ratchet against Fig. 80, 12's fusee parts (the end plate,
  pawls, their springs and the stop-bar not yet seen: BunnSpecial's videos).
- C3: 9 and 6 (10:00, 13:44 and the manual's figures).

**Phase D: the train against the group (after A).** First measure:
- 12:40–12:46, fitted on the barrel bridge's screws in their new places;
- the dial side fitted on two frames (40:05–40:20).

Then decide with the user: move the fourth, third and escape arbors (with `MOD`, the
seconds sub-dial, the escapement's plan, the lower bridge and the indicator: 3 and 4), or
record that the model stands, with the evidence. Then, one after another (they all edit
the train bridge and keyhole): 5, 6, 8, 7 (its video place is under the detent, so after
8), 9.

**Phase E: after A (A changes these parts).** 12 (check first what `FK` already did: the
winding ratchet's tips 9.85 × 0.892 = 8.8 against the video's 8.5), 13, 15, 14's mainspring.

**Phase F.** Each of 22: implement, or record "won't do" with the reason in IDEAS and RR.

## Every change

- `isolate.py` on each changed part, compared with the manual's figure and the
  photograph or frame, saying what matches, what differs and how sure.
- `solids.py`, `fine.py` (with `--split`/`--hold` where relevant), `exploded.py`,
  `bom.py`, `audit.py`, `invariants.py` and `escapement.js` as the change needs; ETAs
  given before each run.
- RESOLVED.md entry with the hash; strike or update the item in RR and IDEAS; the README's
  "Estimated" list kept true; the builds regenerated and committed with the source.
- Releases are the user's: suggest the kind and the lines.

## Status after release 1.15.00 (main, 2 October 2026)

`claude/group-layout` merged: item 1 is done (the photographed group placed by one similarity fitted to the
measured balance cap, fusee 20.4 mm and barrel 22.6 mm; pillar 2 under the train bridge's third screw; the
keyhole the measured opening `TB_KEY`; IDEAS 1.2 and 1.12 closed). Still open from the layout, now the next
large step (was item 3):
- the fourth arbor 3.9 mm off its setting, and the balance 13.7 mm from it (the video's 10.8-12): IDEAS 1.11;
- the pillars' radii (their tops read 3-7 mm further out than the similarity puts them) and pillar 1,
  pushed 2.3 mm out of the fourth wheel;
- the indicator's radius against the mounting ring's bore (item 4);
- **new: the barrel's size** (Review-results, Elsewhere 23): about r 18–19 on four readings, the model's 13.5;
  with it the mainspring (about 1.1 m). High impact, L; waits on a camera fit and the user's decision.
Readings for Phase E are in (`References/VIDEOS.md`, 2 October 2026): the setup ratchet about 42 teeth (52 in the
model) and its spring a 180° band; the winding ratchet about 36 (40); the winding pawl springs long arcs round a
plateau; the stop-bar's slot 3.5–5 mm off the axis with a C-wire spring; the end plate gilt with a boss; conical
oil sinks on the fusee's and barrel's bushings.
Next small step: item 2, `solve.py` reading `L` and `TRAIN` from movement.js (agreed with the other session).

## Progress

| Item | State | Branch / commit |
|---|---|---|
| Plan | written | `claude/fidelity-plan` |
| 16 Split balance (RR 9) | fixed: weights within the band, arm and hub bored; `fine.py --split` passes | `claude/fp-balance` `3c9608c` |
| 17 Lock-adjusting screw (RR 20.5) | fixed: the block's front slotted as Fig. 90 | `claude/fp-balance` `3c9608c` |
| 21 Hands | fixed for the Hamilton dial, against the photographed dial's tracks; the Roman dial (no photograph) left | `claude/fp-balance` `3c9608c` |
| 19 Shield plate | done: Fig. 107's disc, centre pivot and open-ring spring | `claude/fp-balance` |
| 18 Screws and washers (IDEAS 1.7) | done: Table II's heads and Table III's washers in the rate panel, the manual's figure beside the model's | `claude/fp-balance` |
| 10 Centre pinion | counted: 14, likely (13:59.5 end-on, 35:23.66); sent to `group-layout`; the indicator pinion unreadable | `claude/fp-balance` |
| 3 Train against the group | taken over by `claude/group-layout` (a fitted similarity of the whole group, 2 October 2026) | — |
| 5 Keyhole, 7 train-blocking screw's place | taken over by `claude/group-layout` (the measured opening `TB_KEY`; the screw at (3.9, 26.15)) | — |
| 14 Chain hook | done: labelled as the barrel turns it into view; the Stored energy step names it | `claude/fp-balance` |
| — Camera targets | fixed: the views' and walkthrough's targets follow `L` (were the pre-turn places) | `claude/fp-balance` |
