#!/usr/bin/env python3
"""Inline css/, js/, the Wempe's and the shared scripts, three.js and the fonts into one self-contained file: dist/the-marine-chronometer.html, the essay shared by both
models (index.html), with the version and the list of changes from the root CHANGELOG.md (changelog.py). A copy of the models' build.py: the page loads the Hamilton's
stylesheets, report.js and core.js and the Wempe's model by relative path (../chronometer-working-model/, ../wempe/), which inline.py resolves.
To rebuild everything (the models, the essay, the root copy and the site/ folder), run build.py at the repository root."""
import pathlib,sys
root=pathlib.Path(__file__).resolve().parent
sys.path.insert(0,str(root.parents[1]))
from inline import inline,remote_refs
from changelog import stamp
html,ver=stamp(inline((root/'index.html').read_text(encoding='utf-8'),root))
# its links to the models and the Hamilton's reports, from dist/ to their built pages and places (the root build points them at the site's)
for a,b in [('href="../chronometer-working-model/index.html','href="../../chronometer-working-model/dist/chronometer-working-model.html'),('href="../wempe/index.html','href="../../wempe/dist/wempe-einheitschronometer.html'),
            ('href="../chronometer-working-model/verification/','href="../../chronometer-working-model/verification/')]:
    if a not in html:sys.exit(f'the essay has no {a}')
    html=html.replace(a,b)
(root/'dist').mkdir(exist_ok=True)
(root/'dist/the-marine-chronometer.html').write_text(html,encoding='utf-8',newline='\n')
print('wrote dist/the-marine-chronometer.html',len(html.encode()),'bytes, version',ver)
if remote_refs(html):print('still loaded from the network:',*remote_refs(html))
