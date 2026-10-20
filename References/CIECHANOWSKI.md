# Ciechanowski's *Mechanical Watch*

Bartosz Ciechanowski, *Mechanical Watch*, https://ciechanow.ski/mechanical-watch/
(4 May 2022): the interactive essay the model's Essay tab is written after (the root
CLAUDE.md's "Ciechanowski-style"). A full copy of the page and everything it loads is
kept as a backup, fetched 20 October 2026.

**Not committed.** The site gives no licence, so the article, its code and its 3D
model are all rights reserved, and this repository is public. Like the videos
(`VIDEOS.md`), the copy stays outside the repository: in
`$MC_REF/ciechanowski-mechanical-watch` (default `~/mc-ref`; on the owner's machine
`E:\mc-ref`). What is tracked is the manifest, `ciechanowski-mechanical-watch.json`
(each file's path, size and sha256), and this page. Nothing from the copy goes into
the model, the essay or the site; read it for how things are done, then write our
own.

    cd marine-chronometer-source/chronometer-working-model/tools
    python ciechanowski.py check           # the local copy against the manifest
    python ciechanowski.py fetch           # fetch it again (a new machine, a lost copy)
    python ciechanowski.py fetch --write   # after the site changes: the old copy is kept, the manifest rewritten

`fetch` finds the files from the page itself (its markup, then the stylesheets'
`url()` and the scripts' `/models/`, `/images/` paths), so a file the article gains
is caught and reported as new. The Wayback Machine keeps its own copies:
https://web.archive.org/web/*/https://ciechanow.ski/mechanical-watch/*

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
