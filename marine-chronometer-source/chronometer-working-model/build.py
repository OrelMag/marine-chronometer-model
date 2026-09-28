#!/usr/bin/env python3
"""Inline css/ and js/ into one self-contained file: dist/chronometer-working-model.html"""
import re,pathlib
root=pathlib.Path(__file__).parent
html=(root/'index.html').read_text()
html=html.replace('<link rel="stylesheet" href="css/style.css">','<style>\n'+(root/'css/style.css').read_text()+'</style>')
html=re.sub(r'<script src="(js/[^"]+)"></script>',lambda m:'<script>\n'+(root/m.group(1)).read_text()+'\n</script>',html)
(root/'dist').mkdir(exist_ok=True)
(root/'dist/chronometer-working-model.html').write_text(html)
print('wrote dist/chronometer-working-model.html',len(html),'bytes')
