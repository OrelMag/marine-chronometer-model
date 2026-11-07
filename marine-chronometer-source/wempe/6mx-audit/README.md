# The Soviet 6MX, audited again (7 November 2026)

The owner asked for the Wempe page's 6MX version (Kirov No. 247, `rev=6mx`) to be made as accurate as the sources allow.

The 6MX's readings (the Wempe README's "The Soviet 6MX (phase X)", 16-18 October 2026, and the recheck of 29 October in `WEMPE-VARIANT-ESCAPEMENT.md`) were mostly hand pixel counts, made before the `measure-trace` skill existed. The blind parts audit of 3 November covered only the drawings' version. This audit re-measures every 6MX part, reading each one blind, and runs the physics the 6MX never had.

## The owner's choices (7 November 2026)

- **Scope:** the geometry is re-measured blind. On top of that, the physics the 6MX never had is run: the gimbals of its lower bowl, its detent in time and as a frame, and its banking head.
- **Fixes:** the ledger is written first. A difference that is sure, or likely on two photographs, is fixed, checked and released. Conflicts and doubtful readings go to the owner.
- **Shared parts:** where the 6MX's photographs show a part it shares with the drawings differently, the 6MX version is built as photographed. The drawings' versions stay as the owner kept them on 3 November.

## Rules

- **Measuring:**
  - Read each part on the photograph before looking at the model's figure. Say what was known beforehand.
  - Scale by a known feature at the same depth, and cross-check the scale with a second feature.
  - Never fit a camera on a part whose shape is in question.
- **Which source decides:** Kirov 247 first, then the other 1950s Kirovs, then the later Kirov-Poljots and Poljots. Romanov 1975 ranks below every photograph.
- **Before a fix:** the claim is re-read by Alpha before the model is edited.

## Ledgers

| File | Who | Covers |
|---|---|---|
| `beta.md` | Session Beta | the frame, escapement, barrel and cocks |
| `gamma.md` | Session Gamma | the case, bowl, brackets and bezel, the boxes, the dial, the ring's screws and the electrical contact |
| `delta.md` | Session Delta | the physics: gimbals (gap 11), the detent as a frame and in time (gaps 6 and 8), the banking head (gap 3), the contact's drag (gap 13) |

Each row of `beta.md` and `gamma.md` gives:
- the part;
- the photograph;
- the scale and the feature it was taken from;
- the reading, with its ±;
- the model's value;
- the verdict: match, mismatch or can't tell;
- how sure the reading is.

## Starting point: photocompare.py on every 6MX spec (7 November 2026)

Every spec in `tools/photocompare/` for the 6MX was run: `k247_*` and `m6_*`.

Usable cameras:
- `k247_A`: 2.0 px rms, 0.11 mm a pixel;
- `k247_W`: 1.9 px rms;
- `k247_Z`: 1.8 px rms, but fitted on the dial screws, which are under audit;
- `k247_S`, `k247_N`, `k247_O`, `k247_uZ`: 3.6-3.9 px rms;
- `m6_detent`: 6.4 px rms.

Cameras too weak to read from:
- `m6_block_loose`: 16.6 px rms, and the render misses the block;
- `m6_detent_v2`: the pillar plate's rim is 1.25 mm off;
- `m6_contact_front`: 15.3 px rms.

Leads passed on:

| Lead | Where it shows | To |
|---|---|---|
| The loose block's near steady pin misses by 1.29 mm, where the block's other points miss by 0.11-0.16 mm | `m6_block_loose`, whose camera is weak | Beta |
| The stop screw's head is 0.48 mm off | `m6_detent` | Beta |
| The detent block and the lower cock lack edges along 36-49 % of their outlines | the side views `k247_S` and `k247_W` | Beta |
| Block 52's screw heads miss by 0.63-0.66 mm, block 57's by 0.31 and 0.67 | `m6_contact` | Gamma |
| The hands lack edges along 24 % of their outline | `k247_Z` | Gamma |
| The cannon square misses by 0.44 mm | `k247_uZ` | Gamma |

## Outcome (7 November 2026)

**Fixed for the 6MX only.** The drawings' versions are untouched. Each change was re-read before it was made.
- **The contact's access hole at 180°:** it moves from (−0.61, 38.6) to (−0.12, 38.72). Kirov 247 and Kirov 1564 agree on the new place.
- **The dial screws' sinks:** each opens in a chamfer to Ø 2.3 at the dial's face. The heads (Ø 1.7) and their seats are as drawn. Kirov 247 and Kirov 2973 show it; the chamfer's form is estimated.
- **The cannon tube's square and the minute hand's square hole:** both are turned 45°, so a diagonal of the square lies along the hand. Kirov 247 and Kirov 2973 show it.
- **The box's badge:** it is centred in its tier, 1.4 mm higher. Kirov 247 and Kirov 2973 show it.
- **The outer box's catch:** it is Ø 26, as its comment intended (the code drew Ø 20).

**The physics** (`delta.md`):
- **The gimbals:** the case swings at 0.578 s and the ring at 0.661 s; every gimbal check passes.
- **The escapement in time and the detent as a frame:** both pass, with no tooth lost.
- **The banking head Ø 3.4:** the pipe banks at the drawn gap of 0.005 mm.
- **The contact's drag:** about −4°, anywhere from −1.4° to −30°. It is recorded as a range, and the page is unchanged (the owner's choice).
- **Tool fixes:**
  - `wempe_gimbals.js` used the old 15 % clearance from the beat; it now uses 10 %, as `gimbals.js` has since 25 October.
  - The 6MX's frosted plates had no density, so they went unweighed; they are now weighed.
  - `dynamics.js` now takes the 6MX's own bodies.

**Kept, as the owner chose:**
- **Pillar 39:** it reads r 36.8 on three chronometers. The model keeps r 37.3, recorded in the README's Unresolved section with an ask in REQUESTS.md.
- **The ring screw:** 246.4°, which lies inside the three chronometers' scatter.

**Withdrawn on re-reading:**
- the contact block screws' heads (the first pass caught their slots, not their edges);
- the shape of the hour hand's pear (a shading line on the render);
- the near steady pin of the detent block. Two photographs put it at (−29.98, 21.88), but there it would break out of the block's end face. It stays where it was, and the conflict is in Unresolved. The README's old "small hole at S 20.6 O 30.2" is this pin's hole.

**Can't tell, so the model keeps its present reading:**
- the bezel and glass;
- the lower cock's plan and step;
- the detent's sections;
- the loose block's slide;
- the barrel's top;
- the chatons' outer rings;
- the seconds pinion's count;
- the locking bracket's screws;
- the hour hand's stem.

Each of these says, in its ledger row, what photograph would settle it.
