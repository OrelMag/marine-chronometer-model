# Handover: the Wempe as first drawn

For the next session working on the Wempe's "As first drawn" state. Written 15 October 2026, when 2.40.00 went live.

## Where things stand

- **Live as 2.40.00** (tag `v2.40.00`, main `d132f25`). The work was on `claude/wempe-early` (worktree `.claude/worktrees/wempe-early`), merged with `--no-ff`. The branch is done, so start new work on a new branch.
- **What it is.** The Wempe page's Variants has a second control, *The drawings*: **As last revised** (the default, the sheets of about 1946-48) and **As first drawn** (the 1940-44 sheets the revisions replaced). The link records it as `rev=first`. Wempe 3955, the photographed movement in `References/wempe/photos/dg-chrono-dec/`, is made the first-drawn way: its escape wheel sits just under the top plate (`10_…Feder_plus`), and its detent block is 05 04_1's (`11_…Gangfeder_plus`).
- **Built as first drawn:**
  - **E1, the 1941 escapement.** From the sheets 05 04_1 (the layout), 05 04_5 (the staff), 05 04_7.1 (the escape arbor) and 1436's first figures (the detent): the balance seat 4.1 mm over the top plate's inner face; the staff with its brass collar (the arm riveted, no screws); the escape wheel 0.5 under the plate on its 1941 arbor and collet; the rollers under the collar; the detent 1.9 nearer the plate; and the 1941 block, the same base with a long arm and a brass-cone banking screw.
  - **E2.** The three-piece 1941 barrel (0207, 020701, 020701-3), its lid on the pillar plate's side, and the 1941 arbor's 12 mm core; the 1941 maintaining spring (020605), which widens from 1.8 to 3.5 round its turn.
  - **E3.** The 1940 winding key (127-556.02 U 01), traced on its sheet. The figures that later revisions changed only slightly, or only in tolerance, are shown on the parts' cards rather than built.
- **The full record** is in `marine-chronometer-source/wempe/README.md`. See its sections "As first drawn (phase E1)" (E2 and E3 included), "Estimated", "Superseded, left out or for later" and "Unresolved". The code comments beside each piece name the sheet, the figures and how sure each one is.

## How the switch works (read before changing anything)

- **`movement.js` `setRev(v)`.** It collects every group with `userData.rev` (`'last'` or `'first'`), shows that state's groups and hides the other's. It then runs `mv.userData.onRev` (each builder's moves for parts that both states share but place differently). Builders use two helpers: `rv(parent,'first')` makes a state group, and `onRev(f=>…)` registers a move.
- **Each part keeps its key; both states live inside it.** Group by state, never by mesh. The tools skip hidden groups, as they already do for the band.
- **Shared pieces that sit elsewhere** are moved by `onRev` instead of being duplicated. Examples: the balance's group and the hairspring are 0.3 higher as first drawn; the mainspring is 0.44 lower; and the Exploded-view offsets of the lower cock (−29.9), detent block, detent and escape wheel (−30.3) change.
- **Earlier issues share their later parts-list line** wherever the sheet says they're the same part. The staff (05 04_5 carries "05 04 02-1" in pencil) and the escape arbor (05 04_7.1 was renumbered 05 04 05) are examples. Only the cone screw has its own line (`cone41`). Parts present in one state only have a quantity range such as `[0,1]`.
- **The cards.** `app.js` holds `REV` (part cards) and `REVP` (piece cards) for the first-drawn state. `setRev` saves the revised text the first time it switches (`keep()`, a hoisted function, because the link's state is read during the viewer's start-up).
- **The case's keys.** `app.js` pushes an `onRev` that toggles the case's state groups, sets `CS.parts.key.userData.first`, and calls `CS.keyRest()`. `case.js`'s `KEYREST` lays the 1940 key in its own rest pose (axis 10.25 up, handle 30.7° from flat). On the fusee's square (`keyAt`) both keys sit the same way.
- **Tools changed for the two states:**
  - `audit.py --rev first` records its own keys (`movement.first`, `box.first`).
  - `bom.py`'s `dev` entries may carry `"rev":"first"` (used for the riveted arm).
  - `massprops-check.js` skips the hidden state's groups.
  - `escapement.js` exports `WESC.DSPH` (the detent spring's height) for `dynamics.js`, which once parsed the source text.
  - `ci.py` runs `wempe-audit-first` and `wempe-exploded-first`.

## Checking both states

The sheets aren't otherwise covered by CI in the first-drawn state, so run these after any change to the Wempe's escapement, barrel, key or case. Times are from 15 October 2026.

    python tools/solids.py --model wempe                                            # both states at once (about 20 s)
    python tools/audit.py --model wempe --rev first      (and: audit.py box ... --rev first)
    python tools/exploded.py --model wempe --eval "__mv.userData.setRev('first')"
    python tools/fine.py --model wempe --eval "__mv.userData.setRev('first')"        # about 2 min
    python tools/bom.py --model wempe --eval "__mv.userData.setRev('first')"         # about 5 min
    python tools/isolate.py PART --model wempe --eval "__mv.userData.setRev('first')" [--view box]

## Gotchas found the hard way

- **`fine.py` skips pairs that share a parent group** (pieces fixed to each other). A piece that is fixed to a state-specific piece must be built inside the same state group. The barrel's hook block and the arbor's hook pin are built once per state for this reason. Otherwise a riveted joint reports as an overlap.
- **The `bom-check` instance of `050402-1` (the staff) is the balance group itself.** The endshake check moves the whole balance. So the 1941 staff and collar are built inside that group, at heights offset by `SH1`.
- **The Exploded view's checker keeps 0.5 mm between parts.** The first-drawn block's arm lies 0.28 mm over the lower cock's lug, which is why the offsets above were chosen. If parts there move, rerun it.
- **Browser checks fail or hang when other sessions run browsers** ("Target page closed"). Rerun the failed steps alone with `ci.py --only …`.
- **`main` moves often** (several sessions release on it). Merge `main` into your branch before releasing; resolve conflicts in the built copies by rebuilding. Before merging into `main`, check that `git status -sb` in the main checkout is clean and level with `origin/main`.

## What's next (open items, recommended order)

1. **The dial's thickness in the revised model.** The model builds it 1.3 mm, but its sheet (05 02 00-4) strikes 1.3 and pencils 1.2. This is probably an error in the default state, not the first-drawn one. Check Wempe 3955's dial photographs first (`1_Wempe_3955_Z.jpg`, side views). Then, if it's right to change, build 1.2 as last revised and 1.3 as first drawn. The dial face height (`WDIAL.DY1`) and the hands' clearance (`fine.py` reports the least height over the dial) move by 0.1, so run `dialtrace.py --compare` and `fine.py`.
2. **Physics for the 1941 escapement.** The swing and rate shown are the revised escapement's in both states. The differences are the 1941 detent's inertia (1436's first sizes: a thicker foot, square and blade) and the balance's inertia (the collar, no hub or screws). Weigh them with `wempe_inertia.py` in the first-drawn state (it needs an `--eval`). Give makeEsc a first-drawn settings set beside `WESC.SET`, and have `escphys.js` switch with `setRev`. The geometry in plan is the same, so `ESC.state` holds. Keep `escgolden.js` unchanged (the Hamilton's escapement must stay bit for bit the same).
3. **The balance holding device (05 36, 1942).** It fits only the 1941 collar and block. Its tongs (every figure on `05-36_2`) close to 5.8 × 6.9 round the collar's 10° undercut flange (Ø 5.81 at its foot). But Schnitt A-B is schematic: the tongs are drawn 2.2 thick against their 1.2 sheet. With the seat 4.1 over the inner face, the flange's foot lies 0.95 over the pocket's floor. Find a reading that puts the jaws at the flange, or leave it out. `dial.js` keeps the measured lever (`LV`).
4. **The gilt dish at the 1941 detent's tip.** It shows on both photographs of the 1941 block (Wempe 3955 and a 6MX) and on no sheet. Identify it from photographs or videos before building it.
5. **Wempe 3955's escape wheel collet** is one long gilt cone (about 6.4 long, Ø 3.4 to 1.3). The first-drawn state builds 05 04_7.1's cone and pipe. This is recorded under Unresolved; change it only with more evidence.
6. **Not recommended: the 1941 fusee** (02 06 13, the "Übergangsserie"). Its collar, flange plate and small-end piece (65-67) have no sheets in the set, and its dished large end takes a maintaining work that only the 1947-48 sheets draw.

## Coordination

- **`marine-chronometer-03`** (the session that built the Wempe) has these branches in flight:
  - `claude/wempe-escmotion`: the page's escapement driven by makeEsc's motion. It touches `escapement.js`'s `ESC` export and state, and `checks.py`'s phase list.
  - `claude/wempe-report` and `claude/wempe-buildchecks`: new files only.
- **Agreed with that session:**
  - Changes to the 1943 detent go into `dv()`'s `'last'` call as parameters, with `HORN_L` shared by both detents.
  - It doesn't restructure `build()`, and doesn't touch `gMS`, `MS0` or `MS1` in `fusee.js`.
  - It runs the first-drawn checks after merging.
- **Agree release order with it before releasing.**
- **The project's rules still apply.** Measure every line on a sheet or photograph (CLAUDE.md, "Build from measured lines"), isolate and compare after any geometry change, and remember that the user has no physical chronometer.
