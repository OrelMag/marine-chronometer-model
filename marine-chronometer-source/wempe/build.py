#!/usr/bin/env python3
"""Inline css/, js/, the shared scripts, three.js and the fonts into one self-contained file: dist/wempe-einheitschronometer.html,
with the version and the list of changes from the root CHANGELOG.md (changelog.py). A copy of the Hamilton's build.py (../chronometer-working-model/build.py):
the page loads core.js and the Hamilton's stylesheet by relative path (../chronometer-working-model/), which inline.py resolves.
To rebuild everything (both models, the root copy and the site/ folder), run build.py at the repository root."""
import pathlib,sys
root=pathlib.Path(__file__).resolve().parent
sys.path.insert(0,str(root.parents[1]))
from inline import inline,remote_refs
from changelog import stamp
html,ver=stamp(inline((root/'index.html').read_text(encoding='utf-8'),root))
html=html.replace('href="../chronometer-working-model/index.html','href="../../chronometer-working-model/dist/chronometer-working-model.html')   # the links to the Hamilton, from dist/ to its built page, by prefix, so its essay's sections (#essay=detent) keep their hashes (the root build points them at the site's home page)
html=html.replace('href="verification/','href="../verification/')   # the links to its report (verification/index.html beside the page), from dist/ (the root build points them at site/wempe/verification/)
(root/'dist').mkdir(exist_ok=True)
(root/'dist/wempe-einheitschronometer.html').write_text(html,encoding='utf-8',newline='\n')
print('wrote dist/wempe-einheitschronometer.html',len(html.encode()),'bytes, version',ver)
if remote_refs(html):print('still loaded from the network:',*remote_refs(html))
