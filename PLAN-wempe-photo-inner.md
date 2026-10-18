# Handover: the Wempe's and 6MX's inner mechanism and parts against their photographs

Written 18 October 2026 by the session that built `photocompare.py` and compared both models' whole-movement and dial views (branch `claude/wempe-photo-compare`). It is for the session that carries the same work into the inner mechanism and the loose parts. Read it whole before starting, then `CLAUDE.md`, `RESOLVED.md` (its "Plates, bridges, screws and arbors", "Escapement", "Going train and heights" and "Rendering" sections) and `marine-chronometer-source/wempe/README.md`, especially "Photographs against the model" and "Wempe 3955 as photographed".

## The goal

The user's words: "Visual fidelity: take real images and compare to models in the same view. We strive for 1:1 accuracy", then "Also check the inner mechanisms and parts". Your part is the inner mechanism, the photographs with the top plate off or the parts out:

- **Wempe 3955** (the model's versions `first`, as first drawn, and `3955`, as photographed):
  - `8_Wempe_3955_Räderwerk_plus.jpg`, the train with the top plate off: the one the user showed as the example.
  - `9_Wempe_3955_Hemmung.jpg`, the escape wheel, balance and lower cock laid out.
  - `10_Wempe_3955_Feder_plus.jpg`, the detent in place.
  - `11_Wempe_3955_Gangfeder_plus.jpg`, the detent and block loose.
  - `12_` and `13_Wempe_3955_obere_Platte_*.jpg`, the top plate off, both faces.
  - `14_Wempe_3955_Band_Kette.jpg`, the band and chain.
  - `16_Wempe_3955_Gehäusetopf_Kardan.jpg`, the bowl and gimbal ring.
- **The 6MX** (version `6mx`, Kirov No. 247 of 1952):
  - `dg-chrono-6mx-gallery/leben-des-6mx/8_Kirow_247_F.jpg`, the detent side.
  - `10_Kirow_247_E-Kontakt_1.jpg`, the electrical contact.
  - The loose block `dg-chrono-dec/8_Gangfeder_mit_Kloben_Rus_einfach.jpg`.
  - `photos/chasy-ru-9985-kirova-14100/`, a later 6MX taken apart: use it only where Kirov 247's own photographs are silent, and say so.

## The user's decisions (18 October 2026), which apply to you too

1. **Where a specimen's photographs differ from every works drawing,** follow the photograph as a variant and keep the drawing as the fallback.
   - Wempe 3955's own forms go in version `3955`; `first` stays the sheets'.
   - When a photograph agrees with a sheet the model hadn't used (the 1941 barrel arbor's square), fix `first` itself.
   - The 6MX is built as Kirov 247 is made, so its photographs decide it directly.
2. **Finishes and colours: "as made, from photos".** Take metals, tempers, gilt and finishes from the photographs, but no dirt, tarnish or wear.
3. **The 1943 version comes next,** against ALS 5177 and Kirow DEC 422 and 479, once Wempe 3955 and Kirov 247 are done. It isn't yours unless the user says so.

The user can't measure anything (no chronometer: `CLAUDE.md`). The photographs, sheets and videos are the only sources.

## How to start, and how not to collide

**Update, later on 18 October 2026:** `claude/wempe-photo-compare` has since merged `origin/main` (3.11.01) and fixed what `ci.py --full` found (`d48a9856` and the commits before it). The fixes cover the box audit's float screws, the gimbal hook skipping hidden versions' pieces, the new materials' densities (`M.giltH`, `M.blue310`, `M.bakelite` in the weighing tools) and `bom.py` reading versions as the page does. Merge `origin/claude/wempe-photo-compare` into your branch now, rebuild rather than hand-merge the built copies, and regenerate the measured tables (`wempe_inertia.py --write` and `--rev 6mx --write`, `massprops.py --model wempe --write`, `mechanisms.py --model wempe --write`, `wempe_essaydata.js --write`) after any geometry change of yours.

- **Branch.** Create `claude/wempe-photo-inner` in your own worktree from `origin/claude/wempe-photo-compare`, not from `main`. That branch is about 40 commits ahead of `main` and isn't merged yet: it is waiting for its full `ci.py` run and the user's go-ahead.
  - It holds everything you need: the tool, the `3955` version and the specs.
  - Push your branch as soon as it has a commit (`git push -u`), and after every commit.
- **What the first session does meanwhile.** It only runs checks on its branch (fine, bom, smoke, gltf/blender, `ci.py --full`) and fixes whatever those find. It adds no new geometry.
  - If it has to commit a fix, merge `origin/claude/wempe-photo-compare` into your branch (never rebase a pushed branch).
  - Files it may still touch: `wempe/js/frame.js`, `fusee.js`, `escapement.js`, `dial.js`, `case.js`, `shared/kit.js`, `wempe/checks.py`, `wempe/audit-expected.json`, `ci.py`, `Review-results.md`, `RESOLVED.md`, the Wempe README.
  - Expect small conflicts at most. Resolve built copies by rebuilding, never by hand.
- **Merge order.** `claude/wempe-photo-compare` lands on `main` first. Then merge `main` into your branch, rebuild and run `ci.py`, and only then merge yours: after `ci.py` passes, with `git merge --no-ff`, and only when the user asks.
  - *Merged in, 18 October 2026:* `claude/wempe-3955-banking` (another session's: the 1941 detent block's slit, the banking screw's slot cut across its dome, Wempe 3955's screw 0.55 longer turned in to bank, the gold spring one smooth bow; the detent reweighed, SET6 ID 8.21, the essay data rewritten), merged here at the user's wish so it lands on `main` with this branch. Pull (`git pull`, a merge) before your next push. After merging `main` in, rerun `wempe_inertia.py` (and `--rev 6mx`) and `wempe_essaydata.js`: if either is stale, `--write`.
- **Shared work.** Check `ListAgents` and `git worktree list` before starting (`CLAUDE.md`, "Other sessions"). If another session is on the escapement or contact, coordinate with it.

## The tool: `marine-chronometer-source/chronometer-working-model/tools/photocompare.py`

Run `python photocompare.py` with no arguments for its docstring; `CLAUDE.md` has its entry. Run it with `MC_GL=gpu`, 10-60 s a run, from a scratch folder, with **Windows paths** (`E:/…`): Python here can't open `/e/…`. Set `PYTHONIOENCODING=utf-8` when printing specs with umlauts.

**Specs:** `tools/photocompare/*.json`. Yours to start from, fitted by an agent on 18 October 2026:

| Spec | Photo | Residuals |
|---|---|---|
| `w3955_train` | 8_ | 0.20-0.88 mm, f 4212 |
| `w3955_topOut` | 12_ | 0.06-0.17 mm, f held 2800 |
| `w3955_topIn` | 13_ | 0.19-0.69 mm |
| `w3955_logo` | 15_ | f held |
| `w3955_detentBlock` | 11_ | 0.03-0.33 mm |
| `w3955_hem_1` | 9_ escape wheel | 0.13-0.38 mm |
| `w3955_hem_2` | 9_ balance | 0.15-0.94 mm |
| `w3955_hem_3` | 9_ lower cock | 0.09-0.86 mm |
| `w3955_feder` | 10_ | no fit: a pillar pick was 9 mm off; refit it |
| `w3955_chain`, `w3955_band`, `w3955_bowl` | 14_, 16_ | by eye only |
| `m6_detent`, `m6_detent_esc` | 8_Kirow_247_F | 0.24-0.87 mm, f loose |
| `m6_contact`, `m6_contact_parts` | 10_Kirow_247_E-Kontakt_1 | 0.31-0.67 mm |
| `m6_block_loose` | 8_Gangfeder_mit_Kloben_Rus_einfach | weak |
| `m6_box_front` | 14_Kirow_247_Kasten_2 | by eye |

Check each before trusting it: re-run it and read its residuals. Some were fitted before later model changes.

**Commands:** `--labels` (number the candidate screws and wheels through a rough `look`), `--zoom x,y,45 …` (gridded close-ups to read picks), `--regions x0,y0,x1,y1 …` (photograph | outlines | render), `--what x,y` (which part the model draws at that pixel), `--bbox part,…`. In the spec, `"only": [parts]` renders those alone, `"hide"` leaves some out, `"case": true` keeps the case, and `"eval"` poses the model.

### Lessons

They cost time to learn:

- **Picking**
  - Never pick by eye from the full image: it is 10-15 px out. Read every pick off `--zoom`.
  - A head seen obliquely: pick the middle of its top face's ellipse, which the slot crosses.
  - Identify screws one-to-one on the square-on view first, then find them again in the others.
  - Never anchor a fit on a part whose shape is in question: a dust bush pick once threw the camera 10 mm.
- **The camera**
  - Keep the plain pinhole. `pp` and `k1` overfit bad picks (k1 came out 5.4 once).
  - Hold `fix_f` near a neighbouring view's (2300-2800 px for these 1024 px photographs) when the points lie nearly in one plane: a loose part, a plate face-on. Say so in the spec.
- **Snapping**
  - Snap a rim where it stands against the background: `"circles": {…, "snap": {"arcs": [[a0, a1]], "win": 10}}`.
  - Snapping screw heads doesn't work on the hammered gilt: it locks onto texture.
- **Posing the model**
  - `wind` is hours since full wind: `wind=55.9` is 0.01 h short of run down and the balance still swings. Use `wind=56` for the balance, rollers and cock.
  - The `t=H:MM:SS` hash sets the hands.
- **Judging geometry**
  - Judge shape from the outlines, never from the flat render. Same-coloured faces seen square-on hide their edges: a ratchet looked missing until the outlines showed it.
  - The env-map's dark reflections once looked like a counterbore. Isolate the part with a close `look` before calling a difference.
- **Reading a height off an oblique view**
  - Project the part's axis through the fitted camera with `cv2.projectPoints` from `r_pc_NAME.json`'s `q`; the session's scratch scripts did this.
  - Check the scale against a nearby known length.
  - Trace silhouettes at full size beside the model's outline (`r_pc_NAME_outline.png`).
- **Colours.** Compare hue and saturation at the same patch in `r_pc_NAME_photo.png` and `_render.png`. Allow for exposure using a neutral steel patch, and quote the numbers in the code's comment.

## How the model is built for versions: follow these patterns

**Version groups.** `rv(parent, 'last first 6mx 1943')` builds a group shown in the listed versions (`movement.js`'s `setRev`, `revShows`).

- `first` shows in `3955` too, unless the list has `-3955`.
- A piece only Wempe 3955 has: `rv(par, '3955')`.
- The sheet's piece that 3955 replaces: `'first -3955'`, or `'last first 1943 -3955'` where it was shared.
- Where `6mx` was in a shared list, give the 6MX its own group if it differs.

**Never swap a material at run time.** The viewer draws each mesh in the material it had at load (`userData.mat0`) and batches static pieces by it.

- A version that differs only in metal gets its own copy of the piece in its own group (screws, pinions: `frame.js`, `dial.js`, `escapement.js` show how).
- Loops that add pieces to "every version group under a part" pick up your new groups too. The lower cock's pins did, and `fine.py` caught it: add such pieces before your own groups, or list the groups explicitly.

**Screws.** `K.screw(p, x, z, y, r, h, len, rs, mt, dome)` in `shared/kit.js`.

- The head is a closed solid with its slot cut, and `dome` (the rise in mm) gives a domed head.
- The head mesh carries `userData.screw` at the group's origin.
- The audit names it `part:Buffer`: its `FLOAT` table in `wempe/checks.py` uses that.

**Materials, Wempe page only** (set in `movement.js`'s `buildWempe`; the Hamilton's `core.js` is untouched):

- `M.gilt`: the photographed gilt.
- `M.blue310`: light blue, tempered at 310°.
- `M.blued`: deep blue, 295°.
- In `frame.js`: `GH`, the hammered gilt, and `faceUV` (finishes on faces only).
- In `case.js`: `BAK`, Bakelite.

**Type check.** Mixed tuple arrays in `for(const[a,b]of[…])` need a `/** @type {[string,number][]} */(…)` cast. Run `npx -p typescript@5.9.3 tsc -p marine-chronometer-source/wempe/jsconfig.json` (about 10 s).

**Hooks.** After a geometry edit, `geometry_gate.py` blocks stopping until `isolate.py` has run. Run `isolate.py PARTS --model wempe --eval "__mv.userData.setRev('3955')" --look … --ref PHOTO --crop …` and report what matches and what differs.

## What is open for you

Numbers are `Review-results.md`'s, section "Photographs against the model". Settle each with the photograph and say how sure it is. Each fix goes in its own commit, with a RESOLVED.md entry where something was wrong, and the README's "Estimated" section where a value is read rather than measured.

**Wempe 3955** (version `3955`, unless a sheet agrees):

| # | Item | Confidence | Photos |
|---|---|---|---|
| 22 | Escape wheel collet: one long taper, Ø 2.9 to the arbor over about 5 mm. The model has 05 04_7.1's short cone and pipe. | likely | 9_, 10_ |
| 23 | Banking screw: a domed, slotted brass head about Ø 2.4. The model has only its cone (`cone41`) and shank. | likely | 10_, 11_ |
| 25 | Roller table: steel, with a brass block carrying the impulse jewel. The model's is brass. | likely | 9_ |
| 26 | Detent block screw (WN-gk) blued or black. The detent foot's clamp screw bright steel; the model's is a blued dome. | likely | 10_, 11_, 15_ |
| 28 | Escape cap setting on the top plate's outer face: a flat chaton ring. The model has a dome. | likely | 12_ |
| 29 | A steel pin at (0.2, −19, −19.8) on the top plate's inner face; perhaps hole 7's stop pin. | likely | 13_ |
| 30 | A small hole in each balance mass's face. | likely | 9_ |
| 31 | Lower cock's plate side: the jewel in a gilt chaton, and the lug's small hole filled. | likely | 9_ |
| 1, 2 | The posts on the brass arc round the balance (the photo has three posts, radial pins, a split block, one copper-red top); the maintaining detent's wire stud (a plain brass post). | likely | S, O, W obliques; 8_ |
| 27 | Bowl profile (narrower drum, rounded shoulder) and bottom (black, with a brass central disc and screw). The Bakelite black is already done. | likely, by eye | 16_ |
| 9 | Chain: dark steel with bright edges. | likely | 14_ |
| 32 | Uncertain items: say which ones you settle. | uncertain | |

**On the example photo (8_):** compare the whole exposed train. Look at:

- the wheels' crossings and rims, the pinions' leaves and the collets;
- the fusee's cover plate (the steel disc with its screw on the fusee's top) and the fusee's grooves;
- the tall pillars and their screws, and the pillar plate's holes and square window;
- the escape wheel's crossings, and the seconds and intermediate arbors' pivots.

**The 6MX:**

| # | Item | Confidence | Notes |
|---|---|---|---|
| 12 | Lower balance cock: the deep part starts about 5.7 mm nearer the lug than the model's (u ≈ −4.2 in the cock's frame against +1.5). The drawn lug (u −10 to 0) must then change too. | likely | Measure Kirova 14100's loose cock in plan (chasy-ru) and Kirov 247's side view; the cock is built in `frame.js` from `const lc=part('lowerCock'`. |
| 15 | The electrical contact's cock and spiral, lever, collet and disc. | sure in form | `m6_contact` |
| 16 | The escape pinion: 3.7 long. | likely | |
| 17 | The banking screw: slotted dome, its thread showing. | likely | |
| 18 | The cap jewel setting on the upper cock. | uncertain | |
| 19 | The up-and-down wheel's spokes taper. | likely | |
| 21 | The later 6MX only: the detent foot's slot. | — | For the README, not the model. |

The whole-movement items 3-8, 10-11, 13-14 and 20 belong to the first session or a later one. Don't take them unless the user asks.

## Next steps (state at the end of 18 October 2026)

Every item below is open; take them in this order and tick each off here (strike it through with what settled it) as it is done. What was already settled on this branch is in `Review-results.md`, "Settled on `claude/wempe-photo-inner`", and the Wempe README.

**1. The checks.** `ci.py --full` was started on `1111138c`. Read its log (`ci-logs/`); fix what fails, each fix its own commit, and rerun the failing steps with `--only`. Then `--views` (anything drawn changed). Say what it printed.

**2. The 6MX, still open:**
- **12, the lower balance cock's step and lug.** Measure Kirova 14100's loose cock in plan (`photos/chasy-ru-9985-kirova-14100/`, say it is the later 6MX) and Kirov 247's side view (`8_Kirow_247_F.jpg`); rebuild the 6MX's cock (`frame.js`, `const lc=part('lowerCock'`), the step at u about −4.2 and the lug's plan with it. Note that `m6_detent`'s camera stands the ring's edge about 1.2 mm off near the escape arbor: measure along parts, not through the camera there.
- **15, the electrical contact** (`10_Kirow_247_E-Kontakt_1.jpg`, specs `m6_contact`, `m6_contact_parts`): the large L-shaped gilt cock (its arm just under the top plate, cap plate with two screws and a jewel, leg behind the disc) and the copper spiral about Ø 7.4 under the arm; the lever a gilt block with a 45° chamfer carrying a threaded brass screw with a lock nut; the contact wheel's collet about Ø 2.0, 3.0 above the wheel; the disc with a recessed centre, a slotted steel screw and square knurl teeth. Sizes ±15 %. Ask the user before starting: it is a rebuild of several parts and its physics (`train.js` `R.c6`).
- **21** (the later 6MX's slotted detent foot, its striped-less intermediate bridge): for the README only, not the model.

**3. Wempe 3955, open or uncertain:**
- **The balance's rest position:** every whole-movement view (A, N, O, S, W) has the arm about 3-9, 10° off; 05 03_1 sets it 6-12. Decide with the user whether Wempe 3955's version should rest so (a photograph of a stopped balance may not show its rest).
- **The bowl's shoulder (27):** only the bottom was built; the drum's rounded shoulder can't be read closer than about 2 mm on `16_`. Look for another photograph of a Wempe Bakelite bowl side on before changing the profile.
- **Not built, seen once:** a screw end in one of the lower cock's lug holes (`9_`); a dark dot about 0.26 below the escape setting (`12_`); a thin pin on the fusee cover's screw (`8_`); the bush in 18 reading about 1.7 open on the train face against its 1.3 bore (`8_`, 3 px); C-D's bore Ø 2 across the pillar plate to the rim's notch (`solidGeo` can't cut across the plate).
- **Specs:** `w3955_feder` has no fit (refit it, a pillar pick was 9 mm off); `w3955_train`'s three ring-screw picks miss by 0.6-1.0 mm in different directions (mispicks: re-pick on `--zoom`); `m6_block_loose` is weak; `w3955_chain`, `_band`, `_bowl`, `m6_box_front` are by eye only.
- **Earlier list, not taken here** (the first session's or a later one's unless the user says so): items 3-8, 10-11, 13-14, 20, 24 (the set-up ratchet's teeth, the engraving and maker's mark, the ring's dial side, the dial's pin, the dial-side jewels, the dial screws' heads, the 6MX's ring notch and stamps, the box's hasps).

**3b. From the CI run of 18 October 2026:** `ci.py --full` passed 122 of 125. Fixed: `wempe-bench` (`bench_wempe.json` rewritten), the Hamilton's `tripping-bench` (its `tripping.json`, `bench.json` and `makers.js` rewritten, the user's choice). The Wempe's knock check: its search refined, the 3 ms blow's least 20.0 g here, 20.1 on the compare branch (the coarse search read 22); the check set to 20 g or more (the user's choice). The margin is nil at the estimated 0.63 g preload; **closed (the user's choice, 18 October 2026):** the model keeps 0.63 g and the bench takes a knock's floor beside the margin's, the least preload a 3 ms blow of 20 g lets no tooth go at (`wempe_tripping.js` runs the 3 ms blow at 0.8 and 1.2 times too: 17.6, 20.0, 22.5 g, so 0.63 g); the window 0.63-1.54 g, aimed near 0.86 g (`wempe_tolerances.js`, `wempe_bench.js`, `wempe_montecarlo.js` rewritten: 2.9 % work as made, 100 % after the bench); the report shows the floor's runs. Found on the way: at 1.5 times the search read 2.4 g, a fault of its runs starting from rest (the first drop there alone takes 268 ms), so 1.5 times is left out. Left as it was: the README's Monte Carlo line on the hairspring (12 %, 8 minutes a day fast) against the tool's present 7.8 %, 18 minutes, not from this change. The failed steps and those reading the Hamilton's tables rerun on `9ea00165` (`--only build,tripping,tripping-bench,wempe-bench,wempe-tripping-full,selfcontained,book`): 7 of 7 ok, so all 125 pass. Rerun `ci.py --full` after the next changes.

**4. Not photographs, noted:** the 6MX's 35-day trial failing at the masses' drawn place (main's 3.11.01 explains it in the essay with a button to compensate): nothing to do here unless the user asks.

**5. Merging and release.** `claude/wempe-photo-compare` lands on `main` first. Then merge `main` into this branch (rebuild the built copies, regenerate the measured tables: `wempe_inertia.py --write` and `--rev 6mx --write`, `massprops.py --model wempe --write`, `mechanisms.py --model wempe --write`, `wempe_6mx.js --write`, `wempe_essaydata.js --write`, `contacts.py --model wempe --write`), run `ci.py --full`, and merge with `--no-ff` only when the user asks. Suggested release then: a patch, lines like "Wempe 3955 as photographed: the hand-setting groove in its ring, the escape collet's cone, the steel impulse roller, the poising holes, the brass wire stud, the bowl's bottom", "The 6MX: its escape pinion, banking screw, cap jewel setting and up-and-down wheel as Kirov 247's". The user decides.

**6. After this branch:** the user's decision 3, the 1943 version against ALS 5177 and Kirow DEC 422 and 479, comes next, and isn't this branch's unless the user says so.

## Checks and finishing

**Per change:** `solids.py --model wempe`, `audit.py --model wempe --rev REV` (all five revs: `last first 3955 6mx 1943`; `--update` only after reading what is new), `exploded.py`, `holecheck.py --model wempe`, and `fine.py --model wempe --eval "__mv.userData.setRev('REV')"`.

**Once per batch:** `bom.py` in each version, `smoke.py --model wempe`, `gltf_check.py`/`blender_check.py --model wempe`, `invariants.py --model wempe`, and the physics checks where a moving body changed:

- `wempe_inertia.py`, then `wempe_escapement.js`, `dynamics.js --model wempe`, and the 6MX's inertia table by hand (memory: ci.py checks only the plain Wempe's).
- Then `ci.py --full`.

Run browser checks one at a time: they fail under load.

**Record** findings and what you changed in `Review-results.md` (that section) and the Wempe README's "Wempe 3955 as photographed" section or the 6MX's X-sections.

**Release.** Every deploy is a release. Suggest the kind and the lines; the user decides.

**Ending.** End each turn saying whether the session can be closed (the global rule), and ask choices with AskUserQuestion.
