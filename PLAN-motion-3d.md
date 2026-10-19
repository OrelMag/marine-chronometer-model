# Every moving part in 3D: kinematics, nonlinear dynamics and stress

Branch `claude/motion-3d`, started 19 October 2026. The user asked for an analysis of every part designed to move: the springs, the ratchets, the sustaining (maintaining) springs, the chain, the balances. They want to see it in 3D with heat maps, the results and the assumptions. Their choices:

| | Choice |
|---|---|
| Models | Both: the Wempe first, then the Hamilton |
| Analyses | Kinematics (each part's position, speed and acceleration through its motions, the ratios), the nonlinear dynamics, stress inside every moving part |
| Heat maps | Stress inside every moving part. Slender parts from their large-deflection solutions along their length; stocky parts by finite elements on their own solids at their worst loads |
| Wempe versions | The 1950s build and as drawn |
| Where | A private page for the user first (a claude.ai artifact); the site only once they are happy |

## What is nonlinear, and what isn't

- **The system** is nonlinear: contacts that open and close, backlash, a chain in tension only, coils' stick-slip friction, clicks riding teeth, the maintaining spring banking, the detent's impacts, the escapement. The Wempe's `wempe_transmission.js` already runs it so, in time; the Hamilton has its parts' analyses separately (`dynamics.js`, `tripping.js`, `sustaining.js`, `ratchets.js`, `gearing.js`, `traindyn.js`) and needs a whole-transmission model built.
- **Slender parts** bend through large angles: the mainspring, hairspring, maintaining spring, detent spring and gold spring, the chain's links on the drums, and the clicks' springs. Their solutions are geometrically nonlinear (elastica, co-rotational beams). Stress follows from their curvature along their length.
- **Stocky parts** (wheels, pinions, ratchets, pawls, arbors, the balance, the fusee, the barrel, the stop) stay small-strain at these loads: linear-elastic finite elements on each solid, loaded with the worst forces the nonlinear runs find.

## Phases

1. **Wempe geometry**: every moving part's solid, in the movement's frame, from the page (`?qa`), with its part name and parts-list line.
2. **Wempe kinematics**: each moving body's angle, speed and acceleration through a beat, a day's running, winding and the stop, from the page's own motion and the transmission run; the ratios checked.
3. **Wempe loads**: the transmission run's time histories (`wempe_transmission_trace.js`) for both versions, for each part's worst moments.
4. **Wempe stress**: the slender parts along their length; the stocky parts by voxel finite elements (`fea.py`'s method) at their worst loads; every part's margin against its material.
5. **The viewer**: three.js, the movement in 3D, animated through the events, coloured by stress or speed, with each part's results and the assumptions. Published privately for the user.
6. **The Hamilton**: its whole-transmission model, then phases 1-5 for it.

## How each part's stress is found (the Wempe)

| Part | Method | Its worst moment |
|---|---|---|
| Mainspring | Stress along the strip from its solved shapes (`mainspring_wempe*.js`): sigma = E t / 2 abs(kappa - kappa0), kappa0 its free curve (mainspring.py's). As drawn at the measured level (x0.890), the 1950s build's Nivaflex strip at 220 GPa | Fully wound |
| Hairspring | A couple along the strip, uniform where the terminal curves meet Phillips' conditions (`wempe_hairspring.js`); sigma = 6 k theta / (b h^2) | The swing's ends |
| Maintaining spring | The elastica's moment along the band (`wempe_sustaining.js`) | Banked (the build) or fully closed |
| Detent spring, blade, horn, gold spring | The tripping frame's beam moments through a beat (`wempe_tripping.js`) | The unlocking, the return pass, the stone's landing |
| Chain | Its tension through the link plates and rivets (`wempe_strength.js`'s sections) | The stop; the key let go |
| Click springs, the maintaining detent's spring | Their deflection on the tooth's back (`wempe_ratchets.js`) | Riding a tooth's tip |
| Wheels and pinions, arbors, the click wheel, ratchets, clicks, the maintaining detent, barrel and arbor, fusee, stop bar and pin, balance, rollers, escape wheel | Voxel finite elements on the part's own solids (`fea.py`'s bricks), loaded at the contact the run puts the force on (the pitch point on the line of centres, the pressure along the line of action; a pawl's tip on its tooth's face), held at its pivots on the axis only (no false torsional restraint) and at the contact that feeds it | The worst moment of the four runs (a beat, the key let go outright and eased, the stop) |

## Assumptions to state on the page

- The system is nonlinear (contacts, backlash, slack chain, stick-slip, banking, impacts, large-deflection springs); the stocky parts' stress is linear-elastic, small strain, at the run's worst forces applied quasi-statically (no stress waves).
- Materials: brass Ms 58 E 100 GPa, nu 0.34; carbon steel 207 GPa, nu 0.29; Nivaflex 220 GPa; gold 333 98 GPa.
- The page's solids are taken as made: their sizes as drawn, no tolerance, no wear.
- Each moving part's motion is the page's own (`motion3d.py` measures update()); the deviations from rigid motion are the transmission run's (wempe_transmission_trace.js).

## Where it stands (19 October 2026)

All six phases are done. Both viewers were published privately first. The user then asked for them on the site, so they now sit beside the reports: the Wempe report's section 13 and the Hamilton's build report's section 14 (`motion3d_pack.py --site`).

**Findings.**
- Running, every part has a wide margin, and every train ratio matches its tooth counts.
- Past their limits, on both models:
  - the parts the key's blow reaches when it is let go outright;
  - the mainspring's inner coils at full wind.
- The Wempe at the let-go blow, against their materials:

  | Part | Peak | Limit |
  |---|---|---|
  | Maintaining ratchet | 1,485 MPa | brass 300-450 |
  | Clicks | 2,357 MPa | steel 1,200-1,800 |
  | Fusee wheel | 417 MPa | brass 300-450 |

- The Hamilton at the let-go blow:
  - Set-up click: 3,017 MPa. This is a local stress on its nose; `ratchets.js` gives its arm 539 MPa.
  - Winding pawls: 1,509 MPa.
  - Fusee wheel: 369 MPa.
- The mainspring's inner coils at full wind:

  | Model | Inner coils | Limit |
  |---|---|---|
  | Wempe as drawn | 2,663 MPa | 2,600 |
  | Wempe, 1950s build | 3,248 MPa | 3,000 |
  | Hamilton | 3,021 MPa | 2,600 |

**The let-go blow.** `wempe_letgo_fix.js` tried more clicks, a brake between the click wheel and the maintaining ratchet, and a cushioned click face. None keeps every part within its material. The maintaining ratchet's brass is the last to stay over: it is struck by the maintaining detent. Eased back, every part is within its limit or at its floor. The builds keep the drawn parts, and the key is let back at the end of each stroke. In hardened steel, the click wheel and ratchet would take the outright blow with four clicks and a brake. That is open for the user to decide.

**The build's mainspring.** Nivaflex 0.377 mm was solved at set 0.6, 0.8 and 1.0. No set alone gives both the drive (1.12 of the drawn) and a stress inside the strip's 3,000 MPa. A strip about 0.393 mm thick at set 0.8 is being solved (`wempe_mainspring.py --solve 1240 --set 0.8 --t 0.393`). It is expected to give the drive at about 2.94 GPa.
