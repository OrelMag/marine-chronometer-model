# Third-party files

Kept in the repository so that the pages work offline and the published HTML
files can be fully self-contained (`build.py` inlines them). Do not edit them.

| File | What | Source | Licence |
|---|---|---|---|
| `three.min.js` | three.js r128 | https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js (checked against cdnjs's SHA-512 integrity hash) | MIT, `three.LICENSE.txt` |
| `three-r187/three.core.min.js`, `three-r187/three.module.min.js` | three.js r187, the two ES modules it ships as, kept byte for byte | https://cdnjs.cloudflare.com/ajax/libs/three.js/0.187.0/ (checked against cdnjs's SHA-512 integrity hashes by `vendor_three.py`, which holds them) | MIT, `three.LICENSE.txt` |
| `three.r187.js` | three.js r187 as one classic script setting the global `THREE`, written from the two files above by `python vendor_three.py` (each module's body unchanged in a function of its own): the pilot of the move off r128, loaded by the Wempe's page on `claude/three-upgrade` (`PLAN-three-upgrade.md`). Do not edit; `vendor_three.py --check` fails if it is stale | generated | MIT, `three.LICENSE.txt` |
| `OrbitControls.js` | three.js r128's OrbitControls (`examples/js/controls/`), for the 3D viewers of the moving parts beside the reports (`tools/motion3d_pack.py --site`), which load it as a file of their own | https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js (the same bytes from unpkg; sha256 02bb4ade…e7b2) | MIT, `three.LICENSE.txt` |
| `fonts/Spectral-*.woff2` | Spectral (300, 400, 600, italic 400), Latin subset | Google Fonts | SIL Open Font License 1.1, `fonts/OFL-Spectral.txt` |
| `fonts/InstrumentSans-normal-400.woff2` | Instrument Sans, variable weight 400–600, Latin subset | Google Fonts | SIL Open Font License 1.1, `fonts/OFL-InstrumentSans.txt` |
| `fonts/Caveat-wght.ttf` | Caveat, variable weight 400–700, the full font as a TTF: the hand lettering of the illustrations for print (`tools/penposter.py`), drawn with Pillow; not used by the pages | https://github.com/google/fonts/raw/main/ofl/caveat/Caveat%5Bwght%5D.ttf (2 November 2026; sha256 0bdb6b66…7988) | SIL Open Font License 1.1, `fonts/OFL-Caveat.txt` |
| `fonts/fonts.css` | `@font-face` rules for the files above | derived from the Google Fonts stylesheet | as the fonts |

r128 (`three.min.js`) is the version the pages are written against. Releases since
r161 ship ES modules only; `PLAN-three-upgrade.md` at the root is the plan for
moving to r187 through `vendor_three.py`, with what breaks and how each page is
checked.
