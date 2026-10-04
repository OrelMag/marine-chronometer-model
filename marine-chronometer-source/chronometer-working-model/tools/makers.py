"""The maker's sheets' data: js/makers.js, read by the page (js/maker.js) for each part card's sheet. No browser; under a second.

    python makers.py           # writes ../js/makers.js from ../bom.json and the repository's BOM.md (bom.py --md's measured fits)
    python makers.py --check   # exit 1 if js/makers.js is not what this would write (ci.py's selfcontained step runs it)

For every line of the manual's parts list (bom.json: Sec. XI, its number, name, units, function and card) it adds the fit and drive bom.py measured on the
model (BOM.md), and the line's material, finish and heat treatment: the manual's where it names them (the hairspring and trip spring Elinvar, the detent
beryllium copper, the balance rim stainless on an Invar arm, the box mahogany: Secs. I-II, VII, the parts list), otherwise watchmaking practice for that kind
of part (literature, marked so: steel hardened and tempered to a colour, brass left as drawn, and so on: PLAN-self-contained.md D5). Sizes, volume and mass
are not here: the page measures them on the built model when a sheet is opened."""
import json,pathlib,re,sys
HERE=pathlib.Path(__file__).resolve().parent;MC=HERE.parent;ROOT=MC.parent.parent
BOM=json.loads((MC/'bom.json').read_text(encoding='utf-8'));LINES=BOM['lines'] if isinstance(BOM,dict) else BOM
MD=(ROOT/'BOM.md').read_text(encoding='utf-8')
fits={}
for row in MD.splitlines():
    if not row.startswith('| ') or row.startswith('| Idx') or row.startswith('|---'):continue
    c=[x.strip() for x in row.strip('|').split('|')]
    if len(c)>=8:fits[c[1]+'|'+c[0]]=c[7].replace('<br>','; ')
# materials: the manual's first (exact Hamilton numbers or names), then practice by kind of part (literature)
MANUAL={'42188':('Elinvar','the manual (Secs. I, II)','as formed and heat-treated by the maker on its form (Hamilton’s US 2,457,631); its thermoelastic coefficient set by that treatment to cancel the balance’s'),
 'trip':('Elinvar','the manual (Sec. II)','as rolled; stoned to adjust (Tool 10)'),
 'detent':('Beryllium copper','the manual (Sec. II)','solution-treated, then age-hardened (about 315 °C, 2-3 h, the alloy’s practice)'),
 'rim':('Stainless steel rim, Invar arm, silver-soldered','the manual (Sec. II, p. 9)','the rim and arm as drawn, joined by silver solder'),
 'box':('Mahogany','the manual (Sec. I)','')}
KINDS=[  # (pattern in the line's name, material, finish, heat treatment): watchmaking practice (literature)
 (r'Roller','Steel','polished; its jewel set in shellac (Tool 6)','hardened, tempered straw (about 230 °C)'),
 (r'Key','Steel shank, brass or wooden handle','polished','the square hardened, tempered blue'),
 (r'Lever|Bracket|Latch','Brass, or steel where it bears','polished','none for brass; steel bearing faces hardened and tempered'),
 (r'Seal|Packing','Cork, leather or rubber (not named)','',''),
 (r'Jewel|Endstone|Stone','Synthetic ruby or sapphire (corundum)','polished, set in a brass or steel setting','none'),
 (r'Mainspring','Spring steel (high carbon)','polished, greased (Hamilton T-324)','hardened and tempered to a spring temper (blue, about 300 °C)'),
 (r'Spring','Spring steel','polished','hardened and tempered blue (about 290-300 °C)'),
 (r'Screw','Steel','heads polished, or blued','hardened, tempered blue (about 290 °C)'),
 (r'Pin|Stud|Post','Steel','polished','hardened, tempered straw to blue (220-290 °C)'),
 (r'Staff|Arbor|Pinion|Pivot','Steel (carbon tool steel)','pivots burnished, leaves polished','hardened (oil-quenched from about 780-800 °C), tempered straw (about 220-230 °C), then burnished'),
 (r'Pawl|Click|Detent|Stop|Bar','Steel','polished','hardened, tempered blue (about 290 °C)'),
 (r'Wheel|Ratchet','Brass (hard-drawn), or steel for ratchets','gilt or plain','none for brass (work-hardened as drawn); steel ratchets hardened and tempered'),
 (r'Plate|Bridge|Cock|Barrel|Cap|Bushing|Ring|Bowl|Bezel|Case','Brass','gilt or nickelled, grained','none (hard-drawn brass)'),
 (r'Chain','Steel','polished','hardened and tempered blue'),
 (r'Weight|Washer','Brass, gold or steel (the masses are the parts list’s)','as made','none'),
 (r'Hand','Steel','blued','tempered blue (the colour is the finish)'),
 (r'Dial','Silvered or enamelled brass','printed','none'),
 (r'Crystal|Glass','Glass','','none'),
 (r'Assembly|complete',"an assembly: see its parts' lines",'',''),]
def material(l):
    n=l.get('name',''),;nm=n[0];no=l.get('no','')
    if no in MANUAL:return MANUAL[no]+('manual',)
    low=nm.lower()
    if 'trip' in low and 'spring' in low:return MANUAL['trip']+('manual',)
    if low.startswith('detent') and 'spring' not in low and 'block' not in low:return MANUAL['detent']+('manual',)
    if 'balance' in low and ('wheel' in low or 'complete' in low) and 'screw' not in low:return MANUAL['rim']+('manual',)
    if 'box' in low or 'lid' in low:return MANUAL['box']+('manual',)
    for pat,m,fi,ht in KINDS:
        if re.search(pat,nm,re.I):return (m,'practice (literature)',(fi+'; ' if fi else '')+ht,'literature')
    return ('as drawn','not known','','unknown')
out=[]
for l in LINES:
    l={k:(v if v is not None else '') for k,v in l.items()};m=material(l);out.append({'id':l['id'],'idx':l.get('idx',''),'no':l.get('no',''),'name':l.get('name',''),'qty':l.get('qty',''),'part':l.get('part',''),'fn':l.get('fn',''),
      'fit':fits.get(l.get('no','')+'|'+l.get('idx',''),''),'mat':m[0],'msrc':m[1],'treat':m[2],'cls':m[3]})
js=('/* makers.js: the maker’s sheets’ data, one entry a line of the manual’s parts list (Sec. XI): its number, name, units, card, function, the fit bom.py measured\n'
    '   on the model, and its material, finish and heat treatment (the manual’s where it names them, else practice: cls). Written by tools/makers.py from bom.json and\n'
    '   BOM.md; do not edit by hand. Declares only MAKERS */\n"use strict";\nconst MAKERS='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\n')
dst=MC/'js'/'makers.js'
if '--check' in sys.argv:
    ok=dst.exists() and dst.read_text(encoding='utf-8')==js;print('makers.js','up to date' if ok else 'stale: run python makers.py');sys.exit(0 if ok else 1)
dst.write_text(js,encoding='utf-8',newline='\n');print('wrote',dst.relative_to(ROOT),len(out),'lines,',sum(1 for o in out if o['fit']),'with measured fits,',sum(1 for o in out if o['cls']=='manual'),'materials from the manual')
