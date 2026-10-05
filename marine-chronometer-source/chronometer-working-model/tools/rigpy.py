"""The Blender rig as the page carries it: js/rigpy.js, the text of blender/rig.py, which the panel's Blender rig button saves. No browser; under a second.

    python rigpy.py           # writes ../js/rigpy.js from ../blender/rig.py
    python rigpy.py --check   # exit 1 if js/rigpy.js is not what this would write (selfcontained.py runs it)"""
import json,pathlib,sys
HERE=pathlib.Path(__file__).resolve().parent;MC=HERE.parent
SRC=MC/'blender'/'rig.py';OUT=MC/'js'/'rigpy.js'
def text():
    py=SRC.read_text(encoding='utf-8').replace('\r\n','\n')
    return ('/* rigpy.js: the Blender rig (blender/rig.py), as text, for the panel\'s Blender rig button (blender.js). Written by tools/rigpy.py; do not edit by hand.\n'
            '   Declares only RIG_PY */\n"use strict";\nconst RIG_PY='+json.dumps(py,ensure_ascii=False).replace('</','<'+chr(92)+'/')+';\n')
if '--check' in sys.argv:
    ok=OUT.exists() and OUT.read_text(encoding='utf-8')==text()
    print('js/rigpy.js is up to date' if ok else 'js/rigpy.js is stale: run tools/rigpy.py');sys.exit(0 if ok else 1)
OUT.write_text(text(),encoding='utf-8',newline='\n');print('wrote',OUT.relative_to(MC))
