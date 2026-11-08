# Ciechanowski's *Mechanical Watch*

*Mechanical Watch* is by **Bartosz Ciechanowski**, published 4 May 2022. The original,
and the one to read, is on his site: **https://ciechanow.ski/mechanical-watch/**.
More of his work: https://ciechanow.ski/archives/. Support it:
https://www.patreon.com/ciechanowski.

It is the interactive essay this project's essay is written after (the root
CLAUDE.md's "Ciechanowski-style"). `ciechanowski-mechanical-watch/` holds the page and
every file it loads, at the site's own paths, as fetched 8 November 2026 (unchanged
since the first fetch, 20 October 2026); `ciechanowski-mechanical-watch.json` is its
manifest (each file's path, size and sha256). The folder is kept byte for byte as the
site serves it (`.gitattributes`: `-text`).

    cd marine-chronometer-source/chronometer-working-model/tools
    python ciechanowski.py check           # the copy against the manifest
    python ciechanowski.py fetch           # fetch it again into the folder
    python ciechanowski.py fetch --write   # after the site changes: the manifest rewritten (git keeps the old copy)

`fetch` finds the files from the page itself (its markup, then the stylesheets'
`url()` and the scripts' `/models/`, `/images/` paths), so a file the article gains is
caught and reported as new. The page's paths start at the site's root (`/css/…`,
`/js/…`, `/models/…`), so it doesn't run opened as a file: serve the folder as a site's
root (`python -m http.server 8765` in it, after checking the port is free) and open
`http://localhost:8765/`.

## The files (15, 6.7 MB)

| Path | Bytes | What it is |
|---|---:|---|
| `index.html` | 89,498 | The article: its text, the figures' canvases and sliders, the section anchors |
| `js/watch.js` | 327,189 | The article's own code: the WebGL renderer, every figure's scene and controls, the watch's mechanisms animated (one unminified file, about 8,650 lines) |
| `js/base.js` | 34,409 | The site's shared code for all articles: matrix helpers, touch and mouse handling, sliders and other controls (about 1,400 lines) |
| `css/base.css` | 15,176 | The site's shared styles |
| `css/watch.css` | 3,114 | The article's own styles |
| `models/watch_vertices.dat` | 4,549,392 | The watch's 3D model, vertex data (binary, read by `watch.js`) |
| `models/watch_indices.dat` | 1,513,200 | The watch's 3D model, triangle indices (binary) |
| `images/og/watch.png` | 120,950 | The link preview image |
| `images/anchor.png` | 528 | The section link icon |
| `images/play_pause.png`, `play_pause_white.png` | 3,182, 3,169 | Play and pause buttons (light, dark) |
| `images/undo.png` | 1,573 | The figures' reset button |
| `images/social/icons.png` | 4,821 | The footer's social icons |
| `images/sqrt.svg` | 204 | A square-root sign used in the text's formulas |
| `favicon.ico` | 6,518 | The site's icon |

The fonts (IBM Plex Sans, Inter) come from Google Fonts and the analytics from
Google; neither is part of the article, and the copy doesn't keep them.
