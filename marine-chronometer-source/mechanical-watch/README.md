# Mechanical Watch: working copy

*Mechanical Watch* is by **Bartosz Ciechanowski** (4 May 2022). The original is on his
site: **https://ciechanow.ski/mechanical-watch/**. More of his work:
https://ciechanow.ski/archives/. Support it: https://www.patreon.com/ciechanowski.

This folder is the copy we improve. The page exactly as his site serves it is kept,
never edited, in `References/ciechanowski-mechanical-watch/` (`References/CIECHANOWSKI.md`).

Open `index.html` in a browser, straight from disk or served. It was made from the
originals by `tools/mechanical_watch.py init`, changing only:

- paths from the site's root made relative (the page, `css/base.css`, `js/watch.js`);
- the header's links pointed at https://ciechanow.ski/;
- the site's Google Analytics tag taken out;
- the watch's 3D model (`models/*.dat`) embedded in `models/watch_models.js`, which
  `download_file` in `js/base.js` reads first, so the model loads from `file://` too
  (`mechanical_watch.py models` rewrites it from the originals).

Checked on 8 November 2026: opened from disk it shows no console errors and draws the
same pixels as the original served over http.

## Changes since

(none yet)
