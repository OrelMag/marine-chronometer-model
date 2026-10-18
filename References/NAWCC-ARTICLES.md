# Two NAWCC Bulletin articles on the Model 21

Read on 18 October 2026 from the owner's copies. Both are © NAWCC ("Reproduction prohibited without written permission"),
so the PDFs stay outside the repository, as the videos do; this file records what each says and what the model takes from it.
Neither gives a dimension: they don't settle the mainspring's thickness, the barrel's size or the detent's sections
(OPEN-QUESTIONS.md, items 1 and 2), which is what they were hoped for.

## William O. Bennett, "The Hamilton Marine Chronometer", *NAWCC Bulletin* No. 356 (June 2005), pp. 325-334

Bennett was Hamilton's chief physicist (1932-46) and the project engineer for the chronometer from 1940; the article is his
typescript of 24 February 1977 ("Draft #2"), submitted by Art Zimmerla, whose notes and a "Chronometer Facts" box were added.
The designer's own account, so it outranks forum posts and estimates; it is a memoir written 30 years on, not a set of measurements.

**The design** (pp. 329-330)
- The U.S. Naval Observatory's letter (Capt. J. F. Hellweg) came in mid-1940; the Navy contract for 125 was received in May 1941,
  "ordered with solid balance wheels and self-compensating hairsprings", the first delivered ten months later.
- Patterned after the Nardin (Swiss) chronometer at the Observatory's suggestion; the movement designed under Ernest W. Drescher.
- Designed to run at "approximately 1-1/2 turns motion", to make the escapement's influence on the rate as small as it can be;
  the uncut rim made it possible (no centrifugal error).
- "Replaceable bronze bearings" and jewels studied for shape and finish; the steels' hardness and the lubrication studied for wear.

**The hairspring** (pp. 330-331)
- Its helix "noticeably longer than for the usual marine chronometer hairspring, having very closely spaced coils and a somewhat
  larger diameter", long to keep its stress down at the large swing and to make the inertia change between wound and unwound small.
- Its terminals: **"two identical terminals, mathematically calculated to cause the helical portion of the hairspring to coil and
  uncoil perfectly concentric with the axis"**, designed with Hamilton's own theory (Bennett's, 1935: the spring under a pure torque
  applied tangent to its ends), not Phillips' (pp. 327-328, where Phillips' and Keelhoff's terminals are found wanting for flat springs).
  The model's two curves are solved to Phillips' conditions and are not identical (Review-results.md, finding 11).
- Elinvar-Extra (Hamilton's own melt of a titanium-precipitation-hardened Elinvar-type alloy under INCO's Merica patent, Ni-Span-C's
  family), formed to shape on a come-apart form in a vacuum furnace (US 2,457,631); studs and collets with "a vise-like grip on each end"
  (US 2,379,780), so no part of the spring is bent cold after its heat treatment.
- "By properly locating the impulse from the escapement in relation to the wheel, it was readily possible to make the Hamilton marine
  chronometer have **the same rate from one turn motion to one-and-a-half turns motion, within a fraction of a second per day**."
  One turn of motion is a swing of 180°, one and a half 270°. The model's escapement: −1.83 s a day at 180°, −1.15 at 200°, −0.64 at
  220°, −0.25 at 240°, 0.00 at 255°, +0.21 at 270° (`ESC.rateAt` with the drive that gives each swing; 18 October 2026): 2.0 s a day
  over Bennett's range, 0.35 over the manual's 1⅜-1½ turns (Review-results.md, finding 11).

**The balance** (pp. 332-333)
- An Invar arm silver-soldered to an uncut stainless-steel rim, a row of evenly spaced tapped holes; the screws moved toward or away
  from the arm adjust the temperature compensation (as the model and US 2,356,911 have it). The uncut rim larger in diameter and thinner
  than a split rim, lighter for the same moment of inertia.
- Two sets of timing weights, the "vernier" ones adjusting the rate "to a fraction of a second per day"; the temperature error
  adjustable to "some thousandths of a second per day per degree Celsius".

**The escapement** (p. 333; Fig. 4 is the manual's Fig. 90 relabelled)
- The impulse and unlocking jewels were first in a one-piece roller, the angle between them fixed by the factory; the Naval
  Observatory's adjusters insisted on two rollers so the angle could be set, and the design was changed (the parts list's 42180
  "Roller - One piece", superseded, beside 42252 and 42263).
- No oil on the locking, impulse or unlocking jewels. Two adjustments only, the detent adjusting screw and the lock adjusting screw;
  in assembly "a protractor-like graduated gauge was used in conjunction with the balance wheel" so every escapement was set alike.

**The test** (p. 334; Fig. 5)
- 30 days at 55, 72.5 and 90 °F in five-day periods; assembly at 72.5 °F; temperature cabinets; Hamilton's "time comparator" reading
  each chronometer's error to ±0.01 s daily (US 2,593,650).
- Fig. 5, the Marine Chronometer Performance Test of **No. 5580** (below), "typical of the performance expected".
- Elgin, the Navy's second source, built with steel springs and split bimetallic balances, "never able to meet the timekeeping
  performance tolerances".

**Chronology** (the "Chronometer Facts" box, from Hamilton's assembly records): first product 17 July 1942; first shipment
27 February 1942 (as printed, before the first product: one of the two dates is wrong); 8,902 for the Navy; 4,184 more to December 1970;
last shipment 21 May 1970; highest serial 2E13087. Bennett: some 11,000 by the end of the war. (Sinclair: "approximately 15,500 ...
between 1943 and 1969", which the box's 13,086 doesn't support.)

### The test card of No. 5580 (Fig. 5)

Tested for Bu. Ships #85310 (the contract number), timing specifications 18C7d of 28 December 1940, test started 9 June 1944 (day 0),
completed 8 July 1944, inspector's initials "M.A.S." (likely). All in seconds; rate + gaining. Read from the printed halftone of a
handwritten card: the sums, means and the performance figures agree with the daily rates read (checked by hand), except day 6's
deviation (below).

| Period | Temp. | Day: error (rate, deviation) | Sum | Mean |
|---|---|---|---|---|
| I | 90 °F | 0: 60.17; 1: 60.25 (+0.08, .06); 2: 60.25 (0.00, .02); 3: 60.28 (+0.03, .01); 4: 60.29 (+0.01, .01); 5: 60.28 (−0.01, .03) | +0.11, .13 | +0.02, .03 |
| II | 72½ °F | 6: 60.29 (+0.01, .04?); 7: 60.25 (−0.04, .07); 8: 60.35 (+0.10, .07); 9: 60.42 (+0.07, .04); 10: 60.45 (+0.03, .00) | +0.17, .22 | +0.03, .04 |
| III | 55 °F | 11: 60.25 (−0.20, .03); 12: 60.14 (−0.11, .06); 13: 59.93 (−0.21, .04); 14: 59.73 (−0.20, .03); 15: 59.60 (−0.13, .04) | −0.85, .20 | −0.17, .04 |
| IV | 55 °F | 16: 59.45 (−0.15, .04); 17: 59.38 (−0.07, .12); 18: 59.10 (−0.28, .09); 19: 58.90 (−0.20, .01); 20: 58.65 (−0.25, .06) | −0.95, .32 | −0.19, .06 |
| V | 72½ °F | 21: 58.55 (−0.10, .09); 22: 58.59 (+0.04, .05); 23: 58.57 (−0.02, .01); 24: 58.60 (+0.03, .04); 25: 58.60 (±0.00, .01) | −0.05, .20 | −0.01, .04 |
| VI | 90 °F | 26: 58.64 (+0.04, .09); 27: 58.55 (−0.09, .04); 28: 58.55 (±0.00, .05); 29: 58.44 (−0.11, .06); 30: 58.35 (−0.09, .04) | −0.25, .28 | −0.05, .06 |

Day 6's deviation reads .04, where its rate against the period's mean gives .02 (the sum .22 takes .04; one of the three is misread).
Isochronism (72½ °F): day 8 60.35, 12 hours on 60.39 (+0.04), day 9 60.42 (+0.07 in 24 h); the difference of the 12-hour rate and half
the 24-hour rate 0.00.

| Performance | Actual | Tolerance |
|---|---|---|
| Regulation: largest mean daily rate, any period | 0.19 | 1.55 |
| Rating: mean deviation of rates | 0.05 | 0.50 |
| Largest difference of any two daily rates in the same period | 0.21 | 0.75 |
| Temperature: mean daily rates at 90 °F and 72½ °F (I & VI against II & V) | 0.03 | 0.75 |
| Temperature: 72½ °F and 55 °F (II & V against III & IV) | 0.19 | 0.75 |
| Temperature: 90 °F and 55 °F (I & VI against III & IV) | 0.17 | 1.20 |
| Recovery: largest difference of mean rates at the same temperature | 0.07 | 0.70 |
| Isochronism: 12-hour against half the 24-hour rate | 0.00 | 0.50 |

Against No. 3390's card (the model's calibration, the manual's Sec. IX, p. 68): its temperature means 90 °F −0.015, 72½ °F +0.01,
55 °F −0.18 s a day give a gain in the middle of 0.11 s a day against the two ends' mean (No. 3390's: 0.07, which `MTE` in `core.js`
takes), the same sign and size; and a linear term, losing 0.17 s a day at 55 °F against 90 °F, which No. 3390 hasn't (a balance's
screws trim the linear term chronometer by chronometer, Table IV). Its scatter (mean deviation 0.05; days' largest spread 0.21) is
No. 3390's kind.

## Doug Sinclair, "From the Workshop: The Hamilton Series XXI Marine Chronometer", *NAWCC Bulletin* No. 365 (December 2006), pp. 707-713

A watch- and clockmaker's service of No. **2E11334** (Figs. 1-38, halftones about 600 px across), with his own No. **2E6125**
(finished 7 September 1944; Fig. D). Names the parts after the manual's catalogue, loosely in places (below).

**Facts the model takes or checks**
- **14 jewels, 13 synthetic ruby and one diamond, the balance cock's endstone** (pp. 708, 710, 713): "these chronometers run constantly
  when faceup with the weight of the balance wheel using the end stone in the balance cock as a thrust bearing ... Hamilton decided to use
  a diamond rather than a ruby as an end stone." On No. 2E11334 a ruby endstone had been put on the cock and the diamond on the dial side
  (Fig. 10 D, beside the fourth and escape wheels' lower bridge); "there are three identical end stone settings on these instruments -
  two with synthetic rubies and one with a diamond", so one can be fitted in another's place. The parts list gives the cock's cap and
  setting their own numbers (42160, 42155; the others' caps 42159), so "identical" is likely their settings' outside, not their numbers
  (not settled). The model draws the cock's endstone clear (`J.bue`, `M.clear`, since 18 October 2026; a ruby before).
- **The set-up** (p. 712): the chain wound onto the fusee all but about 3 inches, the fusee put in, the barrel fitted and the chain hooked to
  it, the spring then "completely run down"; the bridges and balance put on, the mainspring "fully wound, after which it is let down ...
  about a quarter of a turn". The manual's Op. 56 says the same; the model's set-up follows Op. 53 (OPEN-QUESTIONS.md, item 1). The chain's
  two end hooks differ (Fig. 22). The chain is not cleaned, only drawn through a cloth with clock oil.
- **The detent** (Figs. 15-18): beryllium copper, "note spring leaves" (two strips, as the model draws it); the trip spring on an angle
  bracket held by one retaining screw (on No. 2E11334 the screw had come loose and the spring dropped out of line with the unlocking jewel,
  stopping the chronometer); the locking jewel held by a tapered brass wedge and shellac (the model's wedge pin 42089); the detent block held
  by one screw under the upper train bridge (Fig. 14 A).
- **The mainspring** "come[s] without a hole at the outer end" (Fig. 24): it is held in the barrel by its brace, as the model has it.
- **The Navy's Y-arm balance stop** (Fig. D, No. 2E6125, "likely fitted during a routine reconditioning", his guess): a Y-shaped spring held
  on the upper bridge by one screw (A), its neck (B), a C-shaped yoke whose **two nylon tips** bear on the balance (D), and a hexagonal screw in
  the yoke turned about two turns clockwise by a knurled tool with a hexagonal tip (E), reached through a covered hole in the case when it is
  turned over for winding. The model's Y-arm (Variants) has the hex-socket screw; its pins are drawn steel (the model README's "Estimated").
- Some movements have the train-blocking screw, "many ... have had [it] removed" (Fig. 3). The mainspring is let down at the barrel arbor
  with the set-up click held out, then the maintaining spring with a let-down key on the fusee arbor (Figs. 3, 4); the hairspring stud's
  screw taken out before the cock (Fig. 5). The dial on four screws (Fig. 9); the hands set by a key on the cannon pinion's square (Fig. 37).
  "Approximately 56 hours on a winding, but ... wound every 24 hours" (Fig. 8). The maintaining spring and the fusee's stop work greased
  lightly where his Figs. 28 and 29 point.
- His own No. 2E6125, serviced and regulated, "within 5 seconds over a 3-1/2 month run" (p. 709).

**Where he is wrong or loose** (the manual and Bennett decide)
- Fig. 12 calls the balance's arm (E) stainless steel and its rim (F) "Elinvar Extra": the rim is stainless and the arm Invar (Bennett, the
  manual Sec. II, US 2,356,911); Elinvar-Extra is the hairspring's alloy.
- Fig. 28 calls D and E on the fusee wheel "winding stop clicks" and F "the drive gear for the maintaining power gear shown at C in Figure 10"
  (which is the wind indicator wheel); Fig. 37 calls the indicator wheel the "maintaining power indicator wheel". D and E are likely the manual's
  winding pawls, F a wheel of the up-and-down work's drive (not settled from the figure).

**His photographs** are of a real movement taken apart: the detent block whole and in pieces (Figs. 15-16), the fusee taken apart with its
maintaining work (Figs. 28-29), the bare pillar plate (Fig. 26), the train without its bridge (Fig. 25), the dial side under the dial
(Figs. 10, 37). Printed halftones, too coarse to measure parts against the 4K videos (References/VIDEOS.md), they serve as a check on
arrangement where the videos are thin.
