#!/usr/bin/env python3
"""Inline css/, js/, three.js and the fonts into one self-contained file: dist/chronometer-working-model.html.
To rebuild everything (both projects, the root copies and the site/ folder), run build.py at the repository root."""
import pathlib,sys
root=pathlib.Path(__file__).resolve().parent
sys.path.insert(0,str(root.parents[1]))
from inline import inline,remote_refs
html=inline((root/'index.html').read_text(encoding='utf-8'),root)
(root/'dist').mkdir(exist_ok=True)
(root/'dist/chronometer-working-model.html').write_text(html,encoding='utf-8',newline='\n')
print('wrote dist/chronometer-working-model.html',len(html.encode()),'bytes')
if remote_refs(html):print('still loaded from the network:',*remote_refs(html))
