# Handover: the Soviet 6MX as a variant of the Wempe

For the session that builds the Soviet 6MX (6МХ) on the Wempe page. Written 16 October 2026, after 3.00.00 (the Wempe complete) and 2.42.04 (the cork ring, the bowl's seat, the Lange dial).

## The request

The user asked on 15 October 2026 what it would take to add "the Russian variant" to the Wempe model, then asked for this handover so another session can build it. The 6MX was made by the 1st Moscow Watch Factory (Kirov, later Poljot) from the Einheits-Chronometer's drawings, which were taken from Glashütte in 1946-47 and translated. It is the same three-pillar spring-detent chronometer with about a dozen undrawn changes. Until now the model has used the 6MX only as a supporting source for parts the drawings leave out (`memory: wempe-second-model`: where they differ, the drawing wins). This work builds the 6MX itself, as a third state beside "As last revised" and "As first drawn".

## Ask the user first (one AskUserQuestion, before any code)

1. **Which 6MX to build.** Like Wempe 3955 for the Wempe, pick one photographed chronometer and build it as made. Every choice below has Altmeppen's full set: dial (Z), top plate square-on on millimetre paper (A), dial side square-on (uZ), four obliques (N, O, S, W), most with the detent (Feder) and box (Kasten).
   - **Kirov 247** (February 1952, first generation; recommended). It has the most material: the full set in `photos/dg-chrono-6mx/`, its detent (`leben-des-6mx/8_Kirow_247_F.jpg`), its box (`13_`, `14_Kirow_247_Kasten_*`), and Altmeppen's arrowed comparisons with a Wempe (`1_1`, `1_2`, `1_3_Vergleich_*`; confirm which 6MX those show). It is a contact version (`E-Kontakt`): ask whether to build the electrical contact or leave it out (recommend out, noted in the README).
   - **An early contactless Kirov** (91, 92, 009 or 1564, in `dg-chrono-6mx-gallery/bilder-zum-6mx/`). Check dates and contacts in `sources.json` and the catalogue first.
   - **A late Poljot** (00127, 08479, 09218 or 20027). This matches the TU of 1984 (`documents/6MX-TU-25-07-1533-84.pdf`) and the modern videos (moMvyx8eXfo is current Polet-Chronos production), but it is furthest from the drawings. Altmeppen notes "the finish changed in the late 1950s".
2. **How it is chosen on the page.** Recommended: a third button in Variants' existing drawings switch, renamed to something like "Version": As last revised / As first drawn / Soviet 6MX (Kirov No. 247, 1952), with hash `rev=6mx`. A separate "Maker" switch would allow meaningless combinations (a first-drawn 6MX).
3. **The dial with it.** Recommended: add a third dial, Kirov No. 247's, traced with `dialtrace.py --dial kirov` on `1_Kirow_247_Z.jpg`. Choosing the 6MX selects it, and the dial switch still lets the visitor change it.

## What the sources say differs

From `References/wempe/README.md` (Altmeppen's list, line ~42), the photographs and this session's own readings:

| Difference | Where to measure it | Notes |
|---|---|---|
| Pillar 39 in another place | A and uZ on mm paper; `1_1`, `1_2_Vergleich` (arrows) | The plates' hole tables change for that hole; the pillar plate's and top plate's own holes follow |
| Seconds and intermediate wheels in jewels in chatons, not brass bushes (WN-300/301) | A, uZ; side obliques for the chatons' height | Changes `gearing.js --model wempe`'s pivot friction and the BOM (jewel count) |
| Barrel cap underneath | N/O/S/W side profiles; `2_Kirow_247_A` | The "As first drawn" barrel already has its lid on the pillar plate's side (E2): reuse what you can |
| New detent block with an adjusting slide | `8_Kirow_247_F`, `10_Vergleich_CWW-6MX_Gangfeder_mit_Kloben.jpg` (in `dg-chrono-dec/`), `8_Gangfeder_mit_Kloben_Rus_einfach.jpg` | The stone's place in plan must stay the escapement's: makeEsc's geometry doesn't change; `escgolden.js` must stay bit for bit the same |
| Lower balance cock of another shape | uZ; obliques | |
| No window in the upper cock; no three small windows by the pillar screws (Hilfslöcher 3, 12, 40) | A | Remove holes and the cock's slot in the 6MX state |
| Bowl and bezel brass, not Buna | The model's bowl is already brass, as R-05 01 00-1 draws it | The bezel is knurled and screwed (Kirov 422: README) |
| Dial feet at 19/39/59 minutes, not 20/40/59 | uZ | `dial.js` |
| No external hand-setting | | The model has none either: no change |
| The finish: striped gilt plates and bridges, not hammered (damascened) | A, `pikabu` photos (catalogue-ru.md) | A texture, as the Wempe's finish is drawn |
| The winding hole's shutter: a pin in a slot, not a turning plate | Uy8A88_j-cA 5:21-5:25 | The model's closing plate is the Wempe's |
| The bowl's raised seat round the winding hole, inside | moMvyx8eXfo 3:35; DIxob2Rl4dc 5:09 | Already built for the Wempe (2.42.04, case.js, estimated from these frames) |
| Cork ring on the dust bush; the square's turned point | `4_Kirow_247_N.jpg` | Already built (2.42.04): the 6MX has both, as drawn |
| Box: Soviet boxes, GOST label, inner box 190 mm each way (TU) against the Wempe's 185 | `*_Kasten*` in both gallery folders; moMvyx8eXfo 0:54-3:09; 6mh.ru photos | The key holder is estimated in the Wempe's README; the boxes bear on it |

Also check each chronometer's photographs against the Wempe for anything not on the list. Altmeppen's arrows mark what he saw, not everything.

## Sources (all in the repository unless said)

- **Photographs.** `References/wempe/photos/dg-chrono-6mx/` (Kirov 247's set, Altmeppen's comparisons). `dg-chrono-6mx-gallery/` (211 files: thirteen more 6MXs, boxes, passports, contacts; `sources.json` has each address; not yet read for the model). `catalogue-ru.md` describes each file, rates its usefulness, and lists the pikabu, 6mh.ru and komolovwatch photographs that stayed outside (in `E:\mc-video\wempe-staging`).
- **Documents.** `documents/6MX-figures.md`: the TU's figures (calibre 85.0, movement 39.8 high, 0.5 s balance, 56 h, 15 jewels, the trial), the 1963 book's balance and escapement (Figs. 5.63-5.64) and the user instruction. Also the TU PDF, the 1954 instruction and the user instruction's pages.
- **Videos.** `References/wempe/VIDEOS.md` and `catalogue-ru.md`'s "Videos" list (23 ranked). On disk in `E:\mc-video` (MC_VIDEO): moMvyx8eXfo (1080p: 17:36-17:45 side profile edge-on, 17:53-19:52 top plate square-on, 3:35 the empty bowl), DIxob2Rl4dc, Uy8A88_j-cA and gAczA7-a7TY. Fetch others with `video.py fetch ID` (KxInG08LWXg side profile; IlqLqOz1Nm8 the escape wheel; rAw2zmulpk8 the bowl and transit dampers). Videos and frames are never committed.
- **What the model already takes from the 6MX:**
  - the TU's 35-day trial as the acceptance test (`wempe_errorbudget.js`);
  - a running 6MX's swing and free run-down (`wempe_swing.py`, `wempe_startup.js`);
  - winding in the case;
  - the detent's banking and preload readings;
  - the bowl's seat and the square's point.

## How to build it

- **The state switch.** The existing switch is binary: `movement.js` `setRev(v)` shows groups whose `userData.rev` equals the state, and `app.js`'s `setRev` takes `'first'` or `'last'`. The 6MX keeps most of the last-revised parts, so generalise rather than duplicate.
  - Let `userData.rev` hold a space-separated list (`'last 6mx'`). A group shows if the list includes the state.
  - Tag a group `'6mx'` alone where the 6MX differs, and retag the last-revised groups it keeps as `'last 6mx'`.
  - `onRev(f)` callbacks currently get a boolean `f` (first or not). Change them to get the state name, and update every caller in `fusee.js`, `escapement.js`, `app.js` and `case.js` (the keys).
  - Read `PLAN-wempe-first-drawn.md`'s "How the switch works" first: cards (`REV`/`REVP` in `app.js`), the case's state groups, and `keep()`.
- **Tools to extend.**
  - `audit.py --rev 6mx` (its own expected keys `movement.6mx`, `box.6mx`); `ci.py` steps `wempe-audit-6mx` and `wempe-exploded-6mx`.
  - `bom.py` `dev` entries with `"rev":"6mx"` and lines with quantity ranges for parts in one state only.
  - `massprops-check.js` already skips hidden groups.
  - `fine.py` and `bom.py` by `--eval "__mv.userData.setRev('6mx')"`.
- **Measuring.** The A and uZ photographs sit on millimetre paper, so take the scale from the grid. Then use `holes.py` and `holemap.py` against the model's plates, and `video.py anchor`/`fit`/`unproj`, `rimfit.py` and `framecam.py` for obliques and video frames. Build every outline from traced points (CLAUDE.md, "Build from measured lines"), name the source and the numbers in the comment, and put what's estimated in the Wempe README's "Estimated".
- **Physics.** Most of it carries over.
  - Rerun `gearing.js --model wempe` with jewelled pivots for the two arbors, and `wempe_physics.js`.
  - If the detent block's slide moves nothing at the stone, the escapement's figures stand. Check with `wempe_escapement.js` and `escgolden.js`.
  - The 6MX's own figures (TU, 1963 book) may become the 6MX state's references. Do it only if the user wants a separate report section.

## Phases (suggested; one branch, `claude/wempe-6mx`, worktree `.claude/worktrees/wempe-6mx`)

1. **X0, the switch.** The three-state switch, generalised as above, with no 6MX parts yet. Both existing states must stay pixel-identical (`views.py` before/after with `--eval` for each state) and pass `ci.py`.
2. **X1, the movement.** Pillar 39, the chatons, the barrel cap, the detent block, the lower cock, the upper cock's and plate's windows, the dial feet. Isolate and compare each against its photograph (`isolate.py --eval "__mv.userData.setRev('6mx')" --ref …`).
3. **X2, the dial and finish.** `dialtrace.py --dial kirov` (the Lange dial's `--dial` mode is the template; about 12 s a run) and the striped plates.
4. **X3, the case and box.** The bezel, the shutter, and the chosen chronometer's box and label.
5. **X4, cards, essay and report.** The parts' cards in the 6MX state. A short essay section on what the Soviet copy changed, from Altmeppen and the photographs only (the essay's sourcing rules in CLAUDE.md: no serial ranges or dates the sources don't give). The Wempe report's sections. Then the release (minor) and deploy.

**Effort:** about the size of "As first drawn" (one session, three batches) plus the switch's generalisation and the case and box. Plan on four or five batches, each closed by the fast checks, with `fine`/`bom`/`smoke` and the full CI once per batch (`memory: batch-testing`).

## Gotchas (found the hard way, 15-16 October 2026)

- **`ci.py --full` takes about 85 minutes now (79 steps).** Give it a two-hour timeout. Browser steps fail or hang when other sessions run browsers ("Target page closed", `fea` once); rerun failures alone with `ci.py --only …`.
- **Essay figures that build from `WCASE.build`** must hide what the page's views hide: the outer box `CS.over`, and every state group not shown. One figure showed the transport box until 2.42.04; a 6MX state adds more groups to hide.
- **`massprops`' density hook (`wempe/checks.py` `MASSPROPS.pre`)** weighs only materials in `__M` plus the named exceptions. A part with its own material (the cork ring) needs an entry, or it goes unweighed. The weighing file then needs `--write`, and `wempe_essaydata.js --write` after it.
- **The Wempe report's `reportdata.js`** leaves three temporary files (`assets/_gim.json`, `_su.json`, `_trip.json`) while it runs (about 10 min). Don't `git add -A` the folder until it finishes.
- **Sheets prefixed `R-` are castings**: they draw nothing machined, so a missing hole or seat on one isn't evidence it was absent. The coloured full section is pictorial: scale off it only with a drawn part's own figures beside it.
- **`audit.py`'s expected coplanar faces are kept per state.** A new contact needs `--update` in each state (`--rev first`, and later `--rev 6mx`).
- **`main` moves often** (several sessions release on it). Merge `main` into the branch before merging back. Resolve conflicts in built copies and reports by rebuilding (`build_report.py`, `build.py --site-url …`). Check `git status -sb` in the main checkout before merging. Tell other sessions when a release is live: they wait on it.

## Coordination

Run `ListAgents` before starting: other sessions work on the Wempe (the stop work's open readings, `PLAN-wempe-stopwork-open.md`) and on the Hamilton. Keep 6MX edits inside state groups so they don't collide with work on the shared parts. If a peer is mid-release on `main`, wait for its "live" message before merging.
