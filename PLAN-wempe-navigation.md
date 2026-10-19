# The Wempe as a chronometer to navigate by

Branch `claude/wempe-navigation`, started 19 October 2026 from `claude/wempe-physics-pass`. The user's objective: a working Wempe, made from the model, good enough to navigate by. Each decision below is the user's, made after a consultation on what it implies.

## Decisions

| | Decision | Why |
|---|---|---|
| Target | About 2 miles of longitude a month (8 s at 30 days) | The 6MX passports' adjustment carries 17 s (4.3 miles) |
| Temperature | The masses set to ±0.1° on more rounds of the trial | ±0.45° (the passports' spread) is most of the error |
| Endshake | The 1958 MX repair book's figures, arbor by arbor | The drawings give none; 0.01 mm was too tight |
| Drive | 1.26 times 05 06_20's measured force (the repair book's mainspring torque) | The swing was 191-200°, under the sources' 225-270° |
| Mainspring strip | Carbon steel and Nivaflex both solved, then chosen | At 1.26× the drawn 0.37 carbon strip is past its limit |
| Maintaining spring | Banked while running, as the Hamilton's | From 1.07× the drive its ring closes |
| Gold spring | Thinned to 0.06 over its first 3 mm from its bending point, in the build only | The lock's window opens from 21 to 196 µm; the drawn 0.15 is likely the blank |
| Preload | 0.8 g, unchanged | More helps a little; past 0.85 g the stone catches the escaping tooth |
| Visible differences from photographs | Later, in an appearance pass | They don't affect timekeeping |

## Done

- Endshake (2c4be7a6): `wempe_bench.js`, `wempe_montecarlo.js`.
- Temperature (1a84eac4): `wempe_errorbudget.js` carries the build at 6.2 s (1.5 miles) after 30 days; the bench's trial test gives the procedure (27 µm along the rim).
- The detent study (210c1806): `tools/wempe_detent_study.js` (`--gold` for the profiles); the frame takes a gold spring thinned at its bend (`tsBend`).
- The build as a version for the tools: `WESC.BUILD` (escapement.js), `MC_WREV=build` (wempe_load.js), `WESC.KB` in escphys.js, `WESC.GBEND` in the tripping frame. At 12 h it swings 230.7° (194.3° as drawn).

## Found on the build (19 October 2026)

- `makeEsc`, `dynamics.js` and the tripping frame agree on the swing within 0.3° for every gold spring profile, and no tooth gets past. The 3 ms blow that lets a tooth go is 26 g (20 g asked); the 0.5 ms blow is 93 g.
- Three cross-checks between the models fail on the build, all on detail of the detent's motion that they calibrate on the drawn detent:
  - `wempe_escapement.js`: makeEsc's detent leads the drawn layout's turn by 1.49° (0.25° asked). It comes from the thinned gold spring; the drive alone passes.
  - `dynamics.js --quick`: the detent's ride down the tooth's back. The integration has it home 1.4° earlier than makeEsc, the safe way.
  - `tripping.js --quick`: the hinged frame's first mode is 78.4 Hz against 81.8, the floppy gold spring left flexible.
- The maintaining spring, banked: it pushes 381 mN·m while the key turns and keeps the train going 11.4 min, stressed 884 MPa (margin 1.4-2.0).

## To do

1. The strip: the solves (`wempe_mainspring.py --solve 1240 --set 0.6 --t 0.385` and `--t 0.377`) give each strip's torque, stress and room to coil-bound; choose with the user.
2. `wempe_physics.js` and `wempe_strength.js` at the build's level (`Kl` times `WESC.KB`), with the chosen strip's thickness and material limit.
3. The build's own checks: a safety summary for the build (no tooth past, knocks, window, home in time, maintaining spring, strength) rather than the drawn detent's cross-checks.
4. The bench, tolerances and Monte Carlo for the build (the maker's guidance).
5. The page: a Build version under Variants (the gold spring drawn thinned, the swing at the build's drive), each deviation on its card with the original.
6. README ("The build"), the Wempe report, CHANGELOG, `ci.py`.
