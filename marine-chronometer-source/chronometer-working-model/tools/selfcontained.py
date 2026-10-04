"""Is the page still self-contained, enough to make the chronometer and navigate with it from the page alone (PLAN-self-contained.md, F3)? No browser; a few seconds.

    python selfcontained.py      # exit 1 on any failure

It checks, on the built single file (dist/chronometer-working-model.html) and the sources:
  - nothing is fetched from another server: no script, stylesheet, font or image from the network (as the build checks too), and no fetch() or XHR in the code;
  - the manual itself ships with the site (site/navships-250-624-1948.pdf, linked from the page);
  - js/makers.js is what tools/makers.py writes from bom.json and BOM.md (the maker's sheets' data up to date);
  - every part card (app.js's INFO) has its line or lines in the maker's sheets, or is a part with none in the parts list (the box's cards and decorations);
  - the essay's quoted figures are the tools' (tools/almanac.js's data-bound, tools/physics.js's data-phys, tools/hairspring.js's data-hs: those tools fail if they differ; here, that each span is there);
  - the things a maker and a navigator need are in the page: the maker's tools (Measure, Build book, Data, STL), the almanac's print, the workbook, the hairspring's design."""
import pathlib,re,subprocess,sys,json
HERE=pathlib.Path(__file__).resolve().parent;MC=HERE.parent;ROOT=MC.parent.parent
rows=[];bad=0
def chk(ok,s):
    global bad
    rows.append(('  ok  ' if ok else '  !!  ')+s);bad+=0 if ok else 1
html=(MC/'dist'/'chronometer-working-model.html').read_text(encoding='utf-8')
net=re.findall(r'<(?:script|link|img)[^>]+(?:src|href)="(https?://[^"]+)"',html)
chk(not net,f'the built page loads nothing from the network ({len(net)} references)')
own=[*(MC/'js').glob('*.js'),*(MC.parent/'shared').glob('*.js')]   # the project's own scripts (three.js's loaders, unused, have their own)
calls=[f.name for f in own for m in re.findall(r'\b(fetch\(|XMLHttpRequest|navigator\.sendBeacon|new WebSocket)',f.read_text(encoding='utf-8'))]
chk(not calls,f'no fetch, XHR, beacon or socket in the page\'s own scripts ({", ".join(calls) or "none"})')
pdf=ROOT/'site'/'navships-250-624-1948.pdf'
chk(pdf.exists() and pdf.stat().st_size>1e6 and 'navships-250-624-1948.pdf' in html,'the manual ships beside the page and the page links to it')
r=subprocess.run([sys.executable,str(HERE/'makers.py'),'--check'],capture_output=True,text=True)
chk(r.returncode==0,'js/makers.js is up to date with bom.json and BOM.md ('+r.stdout.strip()+')')
app=(MC/'js'/'app.js').read_text(encoding='utf-8')
cards=set(re.findall(r"^\s{2}(\w+):\{t:'",app,re.M))
mk=(MC/'js'/'makers.js').read_text(encoding='utf-8');parts={m for m in re.findall(r'"part":"(\w*)"',mk)}
none={c for c in cards if c not in parts}
OK_NONE={'lid','lidGlass','box','lids','gimbal','case','crystal','bowl','dial','hands','key','shield','glass','labels','post','sq','pillars','plate','fs','engr'}
missing=sorted(none-OK_NONE)
chk(not missing,f'every part card has its parts-list lines in the maker\'s sheets ({len(cards)} cards; without lines and not expected: {", ".join(missing) or "none"})')
idx=(MC/'index.html').read_text(encoding='utf-8')
for k in ['sun','moon','stars','hand','lunar']:chk(f'data-bound="{k}"' in idx,f'the essay states the almanac\'s {k} accuracy (checked by tools/almanac.js)')
for k in ['Mup','sUp','esc','chase','Q','steelRate','comp','eNeed']:chk(f'data-phys="{k}"' in idx,f'the essay quotes the physics\' {k} (checked by tools/physics.js)')
for k in ['stiff','latBig','iso','slope']:chk(f'data-hs="{k}"' in idx,f'the essay quotes the hairspring\'s {k} at large swings (checked by tools/hairspring.js)')
for sel,what in [('id="mkMeasure"','the measuring tool'),('id="mkBook"','the build book'),('id="mkData"','the model\'s data'),('id="mkSTL"','the movement as STL'),('id="eAlm"','the almanac\'s pages'),
                 ('class="print"','the almanac\'s print'),('id="eWork"','the workbook'),('id="bookSun"','the rate book by equal altitudes'),('id="bookMoon"','the rate book by a lunar'),
                 ('id="oil"','the oiling chart'),('id="adjust"','the escapement\'s adjustment'),('id="order"','the order of work'),('id="materials"','materials and heat treatment')]:
    chk(sel in idx,f'the page has {what}')
for f,what in [('shared/almanac.js','the almanac'),('shared/hairspring.js','the hairspring\'s design'),('chronometer-working-model/js/maker.js','the maker\'s tools')]:
    name=f.split('/')[-1];chk(name.replace('.js','') and (f'src="../shared/{name}"' in idx or f'src="js/{name}"' in idx) and ('const ALM=' in html if 'almanac' in f else 'const HSPR=' in html if 'hairspring' in f else 'const MAKER=' in html),f'{what} ({f}) is in the built page')
print('\n'.join(rows));print(f'{bad} failures' if bad else 'ok');sys.exit(1 if bad else 0)
