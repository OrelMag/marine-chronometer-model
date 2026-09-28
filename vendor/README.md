# Third-party files

Kept in the repository so that the pages work offline and the published HTML
files can be fully self-contained (`build.py` inlines them). Do not edit them.

| File | What | Source | Licence |
|---|---|---|---|
| `three.min.js` | three.js r128 | https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js (checked against cdnjs's SHA-512 integrity hash) | MIT, `three.LICENSE.txt` |
| `fonts/Spectral-*.woff2` | Spectral (300, 400, 600, italic 400), Latin subset | Google Fonts | SIL Open Font License 1.1, `fonts/OFL-Spectral.txt` |
| `fonts/InstrumentSans-normal-400.woff2` | Instrument Sans, variable weight 400–600, Latin subset | Google Fonts | SIL Open Font License 1.1, `fonts/OFL-InstrumentSans.txt` |
| `fonts/fonts.css` | `@font-face` rules for the files above | derived from the Google Fonts stylesheet | as the fonts |

To upgrade three.js, replace `three.min.js` and `three.LICENSE.txt`. r128 is the
version the code is written against: later releases renamed or removed APIs
used here (for example `sRGBEncoding` and `outputEncoding`), so test every view
after an upgrade.
