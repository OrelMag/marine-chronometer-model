# Open questions: what no source has settled

As of 5 October 2026 (release 2.19.00). The model is built from the 1948 overhaul manual (NAVSHIPS 250-624), photographs of real Model 21s and videos of real Model 21s; where they disagree with the model, the model is wrong (CLAUDE.md, "Source of truth"). These are the readings that every source found so far leaves open. Each is drawn as an estimate meanwhile and listed in the model README's "Estimated, not from the manual". The full working record of each is its row in `SHAPE-PASS.md` (row numbers below); the sources are in `References/README.md` and `References/VIDEOS.md`.

The goal they are judged against: someone with only the site can make a Model 21 that keeps time. Two questions matter for that; the rest are appearance.

## Critical

### 1. The mainspring's thickness, and with it the arbor's core

**What is known.** The barrel is measured: r 18.3 ± 0.5 outside, its wall 2.0 thick (SHAPE-PASS 109-6). The spring is 13.55 mm wide (measured, 109-4) and 0.0165 in (0.419 mm) thick by the parts list. Its length, 1,064 mm, is estimated (the half-room rule; the videos give 0.9-1.25 m).

**The conflict.** On two movements (KLUwI2UUCMQ 15:54; TN24H `3SFDplGq6vs` 0:16) the let-down spring's packed coils are 0.375 mm apart, which a 0.419 mm strip can't pack to. And the barrel arbor's core reads r 4.9-5.6 on two movements (KLUwI2UUCMQ 33:20.5, TN24H 0:16), against the model's estimated r 1.8. On a core of r 5.2 the parts list's strip is coil-bound 4.75 turns past its slack, short of the fusee's 4.67 turns and a set-up of about 1: it can't be wound fully. A strip as thin as the measured pitch would fit. So either those two springs are thinner than the parts list's (replacements), or the coils counted were not one a peak, or the core reading is off.

**Why it matters.** The spring's thickness sets its torque (as its cube), the fusee's pull, the train's energy budget and so the balance's amplitude (`tools/physics.js`). The core sets how many turns the barrel holds.

**Searched without result.** Hamilton's material catalogues of 1947-1953 ("materials for all war timepieces ... require separate inquiry direct to the Material Sales Department"; their mainspring chart lists watch sizes only); supplier and cross-reference tables; Google Patents; museum catalogues (RMG, Smithsonian NMAH, Ingenium).

**What would settle it.** A micrometer reading of a Model 21 mainspring's thickness (and its length and width), or of the arbor's core diameter; or Doug Sinclair's article (below).

**In the model meanwhile.** The parts list's 0.419 strip, 1,064 long, on the estimated core r 1.8; the spring's lie solved in the measured barrel (`tools/mainspring.py`): slack at 13.5 turns, set up 1.0, let down it packs about 10½ turns against the videos' 12 ± 1.

### 2. The detent's and the trip spring's sections

**What is known.** Their plan and form follow the manual's Fig. 90 and the photographs, confirmed by the Royal Museums Greenwich catalogue (ZBA7849: "a beryllium-copper (?) detent mounted on a nickel block ... a bifurcated spring and a screwed-on, Elinvar passing spring cranked out to run parallel to the detent blade"). Their thicknesses and heights are not known (110-7).

**Why it matters.** The detent spring's and the trip spring's thicknesses set their stiffness, and so the force and work of unlocking; without them a maker can't cut a detent that works. The model's escapement meets the manual's adjustment figures (`tools/escapement.js`), and its detent spring's share comes from Op. 78's test, but the sections themselves are estimated.

**A related conflict (110-10).** One reading puts the trip spring's bracket leg about 2 mm further along the detent (KLUwI2UUCMQ 11:08-11:13, and Fig. 90 agrees), but the trip spring it holds measures 8.6 ± 0.6 mm from clamp to tip (11:26) against the model's 7.9; moving the leg 2 mm would cut it to 5.9. Both readings are rough; the bracket stays as drawn.

**Searched without result.** Every frame of the restoration video near the escapement (10:27-11:33); TN24H 0:11-0:12 (the assembly flat, 8.6 px/mm: the blades under a pixel); Deafboy's and pefkipefki's running videos (blurred there); bunnspecial's `bEWF2ivi1Rg` and `wuobTVulVGY`; Google Patents (no Hamilton detent patent); Dewey Clark's NAWCC post (one screw holds the trip spring on its Z-shaped bracket; no sizes); chronometerbook's "typically about 0.04 mm thick by 2 mm wide", which is for chronometers in general, not the Model 21.

**What would settle it.** A close side-on photograph of a Model 21 detent out of its movement with a scale beside it, or measured thicknesses; or the sources below.

## Meanwhile: how closely they must be made

`tools/tolerances.js` works out, from the model's own escapement, how far each of these can be off before the balance leaves the manual's running swing (1⅜-1½ turns, 247.5-270°), and the maker's sheets of the three lines (and so the build book) say so:

- **The mainspring:** its stiffness E b t³/12 L within −5 % to +11 % of the drawn spring's: 0.411-0.434 mm thick at the drawn 13.55 width and 1,064 length, about 0.85-1.00 N·m fully wound. A 0.375 mm strip of the same length swings the balance only 213°: it runs, below the manual's figure. So the manual's swing, with the model's train and balance, favours the parts list's 0.0165 in over the coils' measured pitch (the balance's damping and the train's efficiency are estimated: physics.js gives their ranges).
- **The detent spring:** up to about twice the drawn stiffness (0.098 mm thick; the drawn 0.079) the balance keeps 247.5°; there is no lower limit from its work. Its preload is set by Op. 78's test. Whether a much thinner spring returns the detent in time to lock the next tooth is not computed.
- **The trip spring:** forgiving, up to about 12 times the drawn stiffness (0.136 mm; the drawn 0.06).

## The likeliest sources (both behind NAWCC membership)

- Doug Sinclair, "From the Workshop: The Hamilton Series XXI Marine Chronometer", *NAWCC Bulletin* No. 365 (December 2006), p. 707: a teardown with about 25 photographs.
- NAWCC Library: "Notes on Hamilton Chronometer, 1941-1950" (Box 13, Folder 10), which may hold Hamilton's drawings.

The NAWCC forum and the pocketwatch database sit behind a Cloudflare challenge that the automated searches couldn't pass; eBay blocks automated fetches.

## Not critical: appearance only

Each is drawn from the manual's figure or a rough reading; none changes how the chronometer runs.

- **The latch's clamping bracket and the support bracket's screws (106-17, 106-19).** From above (TN24H 4:21; RMG Nos. 333 and 5674) the knurled head stands on a plate about 19 mm out from the box's right wall; which bracket that plate is, and where the support bracket's two screws sit on the box's outside, no view shows (the manual's Fig. 106 is the only drawing).
- **The hairspring collet's outline (108-13).** Hidden under the balance cock and the coils on every frame; what shows (a sector plate reaching about 3.9 mm from the staff) agrees with the model's 4.0, drawn after Figs. 5 and 6.
- **The winding stop-bar (109-19).** Its length is the fusee top's chord, 14.4-16.9 mm (the model's 14.6 lies in it); a hole 0.27 of its length from one end, which end not seen; its thickness, nose and travel not seen.
- **Two single-source readings on TN24H's box, noted, not drawn:** the gimbal pivot's lock nut about 26 mm across (the model 17) and the gimbal strap about 3 mm thick in plan (the model 1.2). Rough, from one frame (4:21).
- **Where the barrel bridge's horn on the cock's side ends (42061).** The model has it along the cock's straight edge, ending 2-9° round the rim from 3 o'clock (the top-view photograph, 23:30, 6:47). The flat bridge at 23:45, mapped by a homography on its rim and its fusee and barrel bushings, draws that end about 4-5 mm further toward 12 o'clock and turned about 7°, with the small hole beside it 6 mm from the model's; but the same map misses the bridge's other holes by 1.3-3.5 mm, so it settles the edge's bow (drawn), not its place. A camera fitted to 6:29/6:47 (the cock on and off, the same view) would settle it; three earlier fits of 6:29 disagree (focal length 900-7000 px).
- **Rough readings.** 22 rows in `SHAPE-PASS.md` are measured but rough (mostly on the box: the latch's place, the gimbal pivot heads, the keeper); a clear photograph of a box from each side would firm them up.

## Estimated by design

The manual gives no tooth profiles, threads or most pivot sizes. The site tells a maker to use standard practice for these (BS 978 cycloidal teeth; the nearest ISO metric thread; the maker's sheets' fits as measured on the model), as a maker would; they are not open questions.
