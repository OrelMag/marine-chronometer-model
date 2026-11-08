# The 6MX's case, reviewed (8 November 2026)

The owner asked for a thorough review of everything outside the movement on the Wempe page's Soviet 6MX version (`rev=6mx`):
- the bowl;
- the bezel, its thread and its shape;
- the brackets;
- the gimbal ring and its pivots;
- the transit lock;
- the closing plate;
- the key;
- the boxes.

The review is to be audited afterwards, so each row says where its reading came from and how sure it is.

**Fixed on 8 November 2026** (the owner's choice: the sure and likely fixes, in the 6MX version only), listed in "What was fixed" at the end. The turn-over fault (A1) and the transit lock's reach (A2) are open, for the owner.

## The short answer on the bezel

- **Threaded: yes.** On every 6MX that shows it off (Kirov 14917, Poljot 09777), the bezel screws onto a fine thread on the bowl's rim and lifts off with its glass as one ring. The model has this. The rim's Ø, 110.1 ±0.4 on Kirov 247, matches the model's 110.55 within half a millimetre.
- **Pitch: likely wrong.** The model's 0.75 was read on Kirov-Poljot 24020. On Kirov 247 the ridges come out 0.9-1.2 apart (`thread_rows.py`, row B7 below; the blind reader got 1.0 ±0.25). The **hand** can't be told on any photograph or frame.
- **Shape: four things are wrong or unsupported.**
  - The knurl is a diamond on the photographs; the model draws straight teeth.
  - The glass stands 2.5 proud in the model; on the photographs it sits at or under the lip.
  - The profile was traced on Kirow DEC 422, the lowest-ranked source, through a row-to-mm map the bowl itself abandoned on 18 October 2026.
  - The chronometers differ in where the knurl lies: at the glass end on DEC 422; nearer the bowl on Poljot 09777 (Uy8A88_j-cA 2:06); over most of the face on Kirova 14100.

## How it was done

- **Blind readings.** Two agents read the photographs and videos without seeing the model's numbers. Their ledgers, with every reading, its frame, its scale and its ±, are `blind-bowl-bezel.md` and `blind-gimbals-box.md`. Their scripts are in this folder; their frames are in `E:\mc-video\oq\6mx-case\`. They were given only:
  - the scale features: the movement ring's flange Ø 105.95, the sub-dials 23 either side of the centre, and the TU's 190 box;
  - the photograph list;
  - the source ranking.
- **Not blind.** The reviewer (Session Alpha) had read `case.js` before looking at any photograph. Rows marked **(known)** come from that side:
  - the code checked against itself and against the project's own tools' output;
  - renders of the model's case beside the photographs (`caserender.py`).
- **The comparison.** The model's value in each row below is read from `case.js` as of `origin/main` adcb0c8d (release 3.83.02).
- **Ranking.**
  1. Kirov No. 247 decides.
  2. Then the 1950s Kirovs (009, 91, 92, 308, 707, 1564, 2973).
  3. Then the later Kirov-Poljots and Poljots (Poljot 09777 is the chronometer filmed in Uy8A88_j-cA), and Kirova No. 14100 (`References/wempe/photos/chasy-ru-9985-kirova-14100/`, opened for the first time here).
  4. Kirow "DEC" 422 and 479 rank last. They come from dg-chrono's *Geburt des 6MX*: a Lange rough movement finished by NII Chasprom, on a German base.
- **The weak link.** No photograph carries a ruler.
  - **Sure:** absolute sizes on the bowl's rim rest on Kirov 247's dial photograph (the flange and the rim fitted as ellipses, 0.2 px rms).
  - **±6-8 % and doubtful:** sizes read off side photographs through a chain of ratios.
  - **Doubtful even where they agree with each other:** DEC 422's heights, which rest on a scale set by its own collar.

### Verdicts

- **sure:** the code's own numbers, or two or more chronometers that agree.
- **likely:** two chronometers, or one clear photograph with a scale at the same depth.
- **doubtful:** a single photograph, or a chained scale.
- **can't tell:** no photograph decides it.

## Findings, most important first

### A. Faults in the model, sure

| # | What | Evidence | Model |
|---|---|---|---|
| A1 | **The 6MX bowl can't turn over in its gimbal ring to be wound.** The page's Wind turns it 180° about its case pivots, and in the 6MX version it passes through the ring at 52.5° and through the box at 60°. | (known) The project's own `massprops.py --model wempe` output, `tools/gimbals_wempe_6mx.json`: `bowlInRing: [52.5, 52.5]`, `stops.bowl: 60.5 / 59.5 against box`. The drawings' version: `bowlInRing: [null, null]`. `app.js:776` turns `CS.bowl.rotation.z` to −π in every version. Real 6MXs are turned over inside their ring, the ring staying in the box: Kirov 14917 held upside down in its ring (rAw2zmulpk8 0:11.75); Poljot 09777 turned over to be wound (Uy8A88_j-cA 5:14-5:27); DIxob2Rl4dc 7:05-7:07; the 6MX instruction pp. 3-4 (cited in `app.js`). | The 6MX bowl hangs `DY6` = 7.0 lower in the gimbals than the drawings' bowl (`case.js:37`): its pivots 3.0 under the rim's top. It keeps the drawings' ring, Ø 140 inside. Its foot's edge (r 36.7 at YB − 65) is then 76.1 from the gimbal centre, against the ring's 70. |
| A2 | **The 6MX transit lock can't reach the hook it locks on.** | (known) The 6MX lever lies over the ring, its underside YP + 12.5 (`dims.js` `LOCKQ.dy6`), and it never turns (`if(!L6)LKT.push(tn)`). The locking bracket's hook top is at YB + 8.5 on the bowl, which hangs DY6 lower: YP + 6.8, inside the ring's height. The ring has no slot in the 6MX version (`case.js` "the 6MX's without the slot"). The code's own source says the opposite: Romanov 1975 p. 204, quoted for the 6MX, "the locking plate ... passes through the slot of the outer ring". On Poljot 09777 (Uy8A88_j-cA 2:06, reviewer, lower rank) the lever with its large brass knurled knob, on a bracket on the box's right wall, lies across the ring's top and reaches the bowl at its locking bracket. There the bowl's rim and bezel stand above the ring's top, where the model's stand below it. The blind reader saw no lock on the bowl or the ring photographs alone (`blind-gimbals-box.md` item 4); it is on the box. | Lever, knob and bracket built as the drawings' lock with a steel lever and black knob, laid over the ring. |
| A3 | **The engraved + and − by the contact sockets aren't drawn.** | blind-bowl-bezel (247, 2973): a `+` over the left group's third bush and a `−` over the right group's, both sure. | (known) `case.js:366` sets `userData.mark` on each socket, and nothing reads it. |
| A4 | **The bracket screws pass through solid brass.** | (known) The 6MX case brackets' and locking bracket's `sweepS` cut only the pivot hole (`case.js:421-431`). The six `6MX.bks` screws stand through solid metal. Their `bom.json` line says "in slots" but has `rel: []`, so `bom.py` never measures them. The drawings' brackets had their holes cut on 28 October 2026 (10-M10). | No hole and no slot (see B2 for the slots the photographs show). |

### B. Model against the photographs: mismatches, likely

| # | Part | Photographs say (blind) | Model (known) | How sure |
|---|---|---|---|---|
| B1 | **Bezel knurl** | A diamond knurl, its grooves ±28° ±3° to the axis, pitch about 1.2 across the grooves (DEC 422; 14100 and Poljot 09777 in Uy8A88_j-cA the same, by eye). | 360 straight teeth, 0.4 deep; the comment admits "diamond on the photographs". | sure that it is diamond; the pitch doubtful |
| B2 | **Case brackets' screw slots** | Each strap's two screws sit in horizontal (circumferential) slots about 5 high, so the bracket slides round the bowl. Seen on 247, 2973 and 422. | No slots, no holes (A4). | sure (three chronometers) |
| B3 | **Locking bracket's hook** | The plate bends out into a hook with a horizontal slot, about 3.5 × 9, open toward the case bracket. Its two screws are one above the other in one vertical slot. Seen on 247 and 2973; DEC 422 has a shorter L. | A plain block, sector r 62-67.5, with no slot and no vertical slot for the screws. | likely (two chronometers) |
| B4 | **Bracket screw heads** | Case brackets Ø 9.6-10.1; locking bracket Ø 6.8 (247, 2973, 422; ±6-8 %). The reviewer's own check on 247's 12_ against its rim: about Ø 9. | All six Ø 4.8 (`screw(...,2.4,...)`). | likely (three chronometers on a chained scale; the factor of two is far outside its ±) |
| B5 | **Glass height** | The glass sits at or a little under the bezel's front lip, not proud (DEC 422, Poljot 09777 in Uy8A88_j-cA; 14100 by the reviewer, flush with a narrow lip). | It stands 2.5 proud of the lip: its top at YB + 16.0, the lip at YB + 13.5. The comment calls it "estimated: the photographs give no height". | likely |
| B6 | **Key** | Brass or gilt, a small round bow Ø 17-22 on a short grip, the tube with its square socket (doubtful on size). DIxob2Rl4dc 6:57-7:00 (VIDEOS.md): "a flat round brass paddle on a short tube". Poljot 09777's (Uy8A88_j-cA 5:20-5:26, reviewer): an all-brass tube with a knurled grip. | The 1943 one-way key: a black phosphated body and a Ø 34.5 paddle (`rev 'last 6mx 1943'`). | likely in colour (three chronometers); doubtful in size and form |
| B7 | **Thread pitch** | Kirov 247's 12_, the rim's thread above the case bracket's arm (x 380-470): five ridges 7.8 px apart. The rim spans 1010 px for Ø 110.1 (9.2 px/mm at mid-depth, less at the far side), and the band is foreshortened by the view's tilt, so the vertical scale is at most about 8.5 px/mm: a pitch of 0.9-1.2. The blind reader: 1.0 ±0.25 on 247 and 2973. | 0.75 (Kirov-Poljot 24020, row spectrum). | likely (one photograph, read by two readers; 0.75 would need more pixels a millimetre than the photograph has) |

### C. Readings that differ but can't decide yet (doubtful)

| # | Part | Blind reading | Model (known) | Note |
|---|---|---|---|---|
| C1 | Bezel profile | A bell R 58.2 → 60.5 over 4.8, a plain band of about 10, the diamond knurl 5.6 at the glass end. Widest Ø 120.8 ±1.5; height about 21 ±3, the photo cut short at its bottom edge (DEC 422 only). 14100 looks knurled over more of its face. | A bell r 56.1 → 57.9, the knurl r 58.3 (Ø 116.6) 5.55 long at the glass end, a plain lip; 12.95 high from its lower edge to the lip. Traced on DEC 422 through `Y6`, a row-to-mm map whose two anchors are the bowl's foot at the drawn YB − 65 and "the glass 0.65 over the hands". The bowl itself left that map on 18 October 2026. | The order (bell, band, knurl, lip) agrees. The sizes rest on DEC 422, the lowest-ranked source, on both sides. No 1950s Kirov's bezel is photographed side on. |
| C2 | Bezel's lower edge to the collar | A dark gap of about 1.5 ±0.5, the thread showing as fine lines (DEC 422, Poljot 09777 in Uy8A88_j-cA). | 1.4 (YB + 0.55 to the collar at YB − 0.85). | match |
| C4 | Thread hand | can't tell (the helix's lead is invisible on every frame). | Right-hand (estimated). | can't tell |
| C5 | Rim (thread) Ø | 110.1 ±0.4 (247's dial photograph; sure). | Crests Ø 110.55. | 0.45 over: at the edge of the ±. The model's 110.5 came from the same photograph through dialtrace's fit. |
| C6 | Neck and collar | The thread runs about 5.2 down from the rim's top, then a plain neck about 2.8, then the collar Ø 113.6 ±1 with a straight wall about 7.5 and a rounded shoulder 3.5 (2973, 422). | Thread 5.55 to the collar, an undercut at its root, the collar r 56.6 (Ø 113.2) only 2.2 high (h −5.55 to −7.76). | The collar's Ø matches. Its height and the neck are a likely mismatch on two photographs, but on a chained scale. |
| C7 | Body Ø | 107-108 (2973's ratio to the collar, 0.946). | 104.8 (r 52.4; Gamma's ratio on the same photograph, 0.93). | Two readers part on one photograph by 2 %. Can't tell. |
| C8 | Body, cone and foot heights | Body about 36.7; the cone 61° from the axis, R 52 → 38.3 over 8.4; the foot a lip ring Ø about 76, about 5.5 tall; about 70 overall. | Body to h −46.7; the cone 8.6 tall to r 36.7; the foot on to YB − 65 (14.4 tall, "its end isn't seen"); 69.7 overall. | The cone and the overall height agree; the foot's 5.5 against 14.4 is doubtful (one chained scale). A shorter foot doesn't settle A1: with the blind reader's 70 overall and the lip's r 38, the bottom corner lies √(38² + 67²) = 77 from pivots 3 under the rim's top, still outside a Ø 140 ring. |
| C9 | Notch through the rim | 1.5 wide, its floor flat, through the top 4 of about 7 ridges, just beside the case bracket's upright: 24020 only, hidden on 247 and 2973. | 1.8 wide at 12 o'clock, under the case bracket's block; its depth estimated. | can't tell (a later chronometer only) |
| C10 | Case bracket | A T: a strap 65-75 long and 11-14 high round the bowl, an upright 12 ±1 wide carrying a plain hole Ø 4.5 ±0.6 about 3 under the rim's top (247; doubtful). | Wings about 64 long and 9.7 high, a block 8.7 wide, the hole Ø 3.2, 4.8 under the block's top: YB + 1.7, 3.0 under the rim's top. | The form matches. The width, hole and strap height read larger on a ±6-8 % scale. Doubtful. |
| C11 | Locking bracket's place | 55 ±5° round from the case bracket (247 56.7°, 2973 60.4°, 422 52.5°). | 50° (kept from the drawings; the code comment says 247 reads 35-43°, and 24020 51°). | The blind reading and the code comment disagree on the same photograph. Can't tell without a camera fitted on the bowl. |
| C12 | Gimbal ring | Outside about 130 ±9, a band 9-11 high and 2.5 thick; each pivot on a rectangular pad about 40 × 12 outside the ring, one with three screws; a long thin slot (about 30 × 2) beside one pad; no knurled lock nuts seen (14100). | The drawings' ring: Ø 140 inside × 4 × 24 high, brass, its bracket at 3 o'clock, knurled lock nuts Ø 22 inside at the case pivots (in every version), no slot in the 6MX's. | The reviewer looked at 14100's 9C22A7DC: the ring lies under the bowl, so perspective makes it read small, and 130 is impossible (the brackets reach r 64.3). The band's height and the pads are worth a camera fit. The slot may be the transit lock's (A2). Can't tell on sizes. |
| C13 | Box tiers | Seen from the top down, about 24, 60 and 105 (the closed front, the face taken as 190). | 25, 68 and 97. | 247 read 73 and 2973 63 for the middle tier (Gamma, 7 November); Alpha's ruling then kept 68 as inside the scatter. No change proposed. |
| C14 | Box badge | About 47 × 27, against the hasp's 53. | 38.6 × 24. | Gamma read the badge at 0.78 of the hasp on 247 and 0.75 on 2973; this reader 0.89. Doubtful. |
| C16 | Closing plate / shutter | No turning plate with a knob: on Poljot 09777 (Uy8A88_j-cA 5:19-5:27) a pin slides in a short slot to open the hole; on 14100 the hole is open. | The drawings' turning plate, flat, with a domed knob at r 19 and the drawings' spiral closing spring. The comment says "the 6MX's own is a pin in a slot". | The chronometers differ. Kirov 14917's foot (rAw2zmulpk8 0:11.75, the source of the model's knob, checked by the reviewer) shows a flat disc in a lip with a slotted screw and a domed knob, both off the disc's centre on one line: a turning plate is possible there. 14917 outranks the Poljot, so no change is proposed; the Poljot's slot is recorded. |
| C15 | Glass's white ring | A white annulus about 8 wide inside the glass's edge: paint, a gasket, or the dial seen through it. | None. | can't tell |

### D. Matches

The model agrees with the blind readings on:
- the bezel screwed on, coming off with its glass as one ring (14917, rAw2zmulpk8 0:23-0:28);
- the knurl band at the glass end and the bell at the bowl's end;
- the collar's Ø;
- the cone's angle and run;
- the case brackets as a symmetric strap with an upright carrying the pivot hole;
- the locking bracket as an upright plate with a hook at the rim;
- the six contact sockets in two groups of three on fibre washers;
- the box's three tiers, its two hasps with knurled knobs, its corner straps, side ring handles, lacquered red wood and the outer box with its scalloped front;
- the bowl and bezel in plain brushed brass on the 1950s Kirovs.

### E. Blind readings not compared with the model

Each was read on modern footage or a single photograph, or the model has nothing to compare it with:

| Blind reading (`blind-gimbals-box.md`) | Model | Why not compared |
|---|---|---|
| The outer pivots on the box's front and back walls; their axis about 20 ±8 under the base's rim | On the side walls, 3.5 under the body tier's parting line | Read on one box (moMvyx8eXfo, a modern 6MX of 2022). Doubtful. Which walls depends on how the box is turned; worth a look when the box is next reviewed. |
| A bail handle on each side | A ring handle on each side | Both are handles; the form differs by box. |
| The key's holder in the back right corner, on a bracket on the right wall | Back right corner, on a fitting on the floor | Place agrees; the fitting is not compared. |
| The outer box: a hooked flat lever on a round boss on its lid tongue | A catch disc Ø 26 with a hook | Same kind of catch; sizes not read. |
| Each ring pivot on a pad about 40 × 12 outside the ring, one with three screws (14100; Kirov 14917, rAw2zmulpk8 0:11.75, the same) | The drawings' bracket at 3 o'clock only, two screws | Likely a 6MX difference (two chronometers). Its sizes need the ring fit named under "What the owner is asked". |
| 14100's bracket blocks dark or steel-grey | Brass | One chronometer; the others are brass. |
| Red velvet in the outer box; foam or red felt inside | Felt in a grey-green | The linings vary by box and are replaced; not compared. |

## What the owner is asked

The fixes are not made. The findings in A and B are proposed for fixing in the 6MX version only, as the owner chose for the 7 November audit: where the 6MX's photographs differ from a shared part, the 6MX version is built as photographed.

Each fix to the bowl, bezel or gimbals then needs the following checks:
- `massprops.py --model wempe` for the 6MX, then `wempe_gimbals.js`;
- `solids.py` and `audit.py box`;
- `bom.py` in the 6MX state;
- `isolate.py` beside the photographs.

A1 needs a decision on what changes. What decides the clearance is the bowl's bottom corner's distance from the pivots, so the choices are:
- **the pivots lower on the bowl** (`DY6` smaller): about 11 under the rim's top would clear a Ø 140 ring. Kirov-Poljot 24020 reads 10.8 under. Poljot 09777 (Uy8A88_j-cA 2:06) shows the rim and bezel standing above the ring's top, as low pivots would put them. That would also put the locking bracket's hook above the ring, where the lever over it can reach (A2).
- **a larger 6MX ring**: inside Ø 154 or more. On 09777's frame the ring's inside reads about 1.15 of the bezel's Ø, so about Ø 139 (doubtful: one frame, no camera), which argues against it.

The deciding measurement is the pivot hole's height on Kirov 247 and 2973 against the rim. The 7 November reading (3.0 under, ±2) and the blind reader's 3 both rest on judging where "the rim's top" is behind the bracket's upright. Next best is a camera fitted on 09777's frame at Uy8A88_j-cA 2:06 or on moMvyx8eXfo 1:48-2:48, the bowl in its ring seen from above, scaled by the rim's sure Ø 110.1. Both videos are later Poljots and rank below 247.

## What was fixed (8 November 2026)

The owner chose to make the sure and likely fixes, in the 6MX version only, and to measure the pivots' height before settling A1. The drawings' versions are untouched.

| Row | Change in `case.js` (6MX only) | Source |
|---|---|---|
| A3 | A `+` and a `−` engraved over the + and − sockets (decals), 5.7 over each socket's centre. | 247, 2973 |
| A4, B2 | The case brackets' straps carry slots 18 × 5 round their screws; the locking bracket's plate carries a vertical slot 4.5 wide for its two screws. The screws stand in the slots, not in solid brass. | 247, 2973, 422; `blind-pivot-height.md` |
| B3 | The locking bracket rebuilt: a plate 14 wide from 34.8 to 12.1 under the rim's top, a crank, and a block to r 67.5 up to 2.4 over the rim, with a horizontal slot 4.8 high (6.8 to 2.0 under the rim) open toward the 6 o'clock case bracket, 10 deep. Its place moved to brg 220.5, centred over the − spring's two screws, as both bowls show (it stood at 230, over the − socket). | 247, 2973 |
| B4 | The case brackets' screw heads Ø 10, the locking bracket's Ø 6.8 (M4); the straps 11.4 high and the uprights 11.5 wide, their tops 5.3 over the pivot hole. | three chronometers |
| B1, B5 | The bezel's knurl a diamond (a new closed solid, `diamondKnurl`, stitched onto the turned ring); the glass 3.0 thick and flush with the lip, the bezel 14.5 high (a plain band 1.5 added between the bell and the knurl). | DEC 422, 14100, Poljot 09777 |
| B7 | The 6MX's thread `TH6`: pitch 1.0, its ISO depth 0.5413; the crests and roots where the bowl's and bezel's were. | 247 |
| B6 | The key's body and paddle brass in the 6MX version (its form the key of 1943's, unmeasured). | Poljot 09777, DIxob2Rl4dc |

`sweepS` takes a list of windows. The page's cards for the 6MX bezel and key say what changed.

**The pivots' height, measured blind** (`blind-pivot-height.md`): the pivot hole's centre 0 ±1.7 under the rim's top on Kirov 247 and 2.5 ±1.5 on 2973. The model's 3.0 stands. So the pivots are not what keeps the bowl from turning over in its ring (A1). The ring's size or the bowl's depth must differ from the model, and neither is measured on any photograph. The hook's slot lies at the pivots' height, as the drawings' neck does, and Kirova 14100's ring has a long thin slot beside a pivot. So the 6MX's transit lock most likely works as the drawings' does, through a slot in the ring (A2). Both are in the Wempe README's Unresolved section.

**Checks after the fixes:**
- `solids.py --model wempe`: 0 not solid.
- `audit.py box --model wempe --rev 6mx`: nothing new. The six slotted screws were added to `checks.py`'s `FLOAT_BOX`: the probe samples sideways round a head, and these radial screws' heads bear above and below their slots. The glass's top lying flush with the lip was added to `audit-expected.json`.
- `audit.py --model wempe --rev 6mx`: nothing new.
- `fine.py --model wempe` in the 6MX state: 68 states, 0 new or grown.
- `bom.py --model wempe` in the 6MX state: 278 lines, 310 relations, 20 jewels, ok.
- `massprops.py --model wempe --rev 6mx --write`, then `gimbals.js --model wempe --quick` with `MC_WREV=6mx`: the periods 0.58 and 0.66 s, ok. The bowl still meets the ring at 52.5° (A1).
- The Wempe type check: ok.
- `smoke.py --model wempe`: 242 steps, ok.
- `holecheck.py --model wempe`: see the commit.
- Renders beside Kirov 247's 12_ (`caserender.py`): the brackets, slots, hook and marks as photographed. The heights differ by the view: 247 is seen from a little under the rim, the render from over it.
