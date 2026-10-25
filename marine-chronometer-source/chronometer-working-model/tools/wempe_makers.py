"""The Wempe's maker's sheets' data: ../../wempe/js/makers.js, read by the Wempe page's Making it (js/maker.js, shared with the Hamilton's) for each part card's sheet
and the build book. No browser; under a second.

    python wempe_makers.py           # writes ../../wempe/js/makers.js from the Wempe's bom.json, its BOM.md (bom.py --model wempe --md's measured fits) and the transcriptions
    python wempe_makers.py --check   # exit 1 if wempe/js/makers.js is not what this would write (ci.py runs it)
    python wempe_makers.py --list    # the materials and processes list: each line's material as its sheet gives it, and how it is made (CNC, by hand, bought in)

For every line of the Wempe's parts list (bom.json: its works drawings' parts, by drawing number) it adds the fit bom.py measured on the model (wempe/BOM.md), and the
line's material and treatment as its own sheet gives them, read off References/wempe/transcriptions/ (the title block's Werkstoff, the notes' hardening and tempering,
the surface marks, the blank, the untoleranced limit). Nothing is filled from practice: a line whose sheet gives no material, or that has no sheet in the set (the
Wempe-Norm screws and pins, WN-), says so, with its function. The tolerances (tools/tolerances_wempe_build.json), the tests on the bench (bench_wempe_build.json) and
the 1950s build's deviations from the drawings (wempe/js/escapement.js's BUILD, wempe_build.json) go on their lines' sheets as the Hamilton's do. Lines of another
version only (the 6MX's, the 1943 block's: bom.json's rev without 'last') are left out: the sheets are the drawings' as last revised. Sizes, volume and mass are not
here: the page measures them on the built model when a sheet is opened."""
import json,pathlib,re,sys
HERE=pathlib.Path(__file__).resolve().parent;MC=HERE.parent;W=MC.parent/'wempe';ROOT=MC.parent.parent;TR=ROOT/'References'/'wempe'/'transcriptions'
BOM=json.loads((W/'bom.json').read_text(encoding='utf-8'));LINES=BOM['lines']
cur=lambda l:not l.get('rev') or 'last' in l['rev'].split()   # the drawings as last revised (bom.json's rev: the versions a line is in)
# the fits bom.py measured (wempe/BOM.md, bom_md.write_drawings: | Id | Drawing | Name | Units | Model | Card | Function | Fit | |)
MD=(W/'BOM.md').read_text(encoding='utf-8') if (W/'BOM.md').exists() else ''
fits={};names={}
for row in MD.splitlines():
    if not row.startswith('| ') or row.startswith('| Id') or row.startswith('| Jewel') or row.startswith('| Driver'):continue
    c=[x.strip() for x in row.strip('|').split('|')]
    if len(c)>=8:fits[c[0]]=c[7].replace('<br>','; ');names[c[0]]=c[2]
taken={}   # the other side of each measured fit: its pivot in this jewel, its screw in this plate, shown on this one's sheet
for k,f in fits.items():
    for seg in f.split('; '):
        m=re.match(r'(in|round|on|mesh) ([\w.\-]+(?:/[\w.\-]+)*)(.*)',seg)
        if not m:continue
        for t in m.group(2).split('/'):taken.setdefault(t,[]).append(f'{names.get(k,k)}: {m.group(1)} it{m.group(3)}')
# the sheets: each transcription's section (## <numbers> <name> — `group/file.jpg`), by the drawing numbers in its heading
norm=lambda s:re.sub(r'^(R-?|Hz|P)','',re.sub(r'[\s.]','',s))
NUM=re.compile(r'(?<![\d\-])(\d\d ?\d\d ?\d\d(?:-\d+)?|\d\d \d\d)(?![\d])')
SECS=[]
for f in sorted(TR.glob('*.md')):
    t=f.read_text(encoding='utf-8')
    for m in re.finditer(r'^## (.+?)\n(.*?)(?=^## |\Z)',t,re.S|re.M):
        h,b=m.group(1),m.group(2);fm=re.search(r'`([^`]+\.jpg)`',h)
        if not fm:continue
        hh=re.sub(r'127-556[.\s\-]*\d*(?:\s*U\s*\d+a?)?|So\.?\s|\bR[- ]|\bHz |\bP\. ','',h.split(' — ')[0])   # the Anker-Chronometer's Sach-Nr. aren't the part's
        SECS.append({'h':h.split(' — ')[0],'file':fm.group(1),'nums':[norm(x) for x in NUM.findall(hh)],'body':b,'src':f.name})
Q=r'(?:\*\*)?"([^"]+)"(?:\*\*)?'
def sheet(s):
    b=s['body'];tb=re.search(r'\*\*Title block:\*\*(.*)',b);tb=tb.group(1) if tb else ''
    w=re.search(r'Werkstoff[^"*:]*:?\s*(?:'+Q+r'|\*\*([^*]+)\*\*)(\s*\((?:[^()]|\([^()]*\))*\))?',tb)   # the material, and the transcriber's translation in brackets (one level of brackets inside)
    mat=None;raw=''
    if re.search(r'"Werkstoff[^"]*"\s*—\s*empty',tb):w=None
    if w and not re.search(r'Werkstoff[^"*]*?(—|blank|empty|\bnot written)',tb[:tb.find('Werkstoff')+60] if 'Werkstoff' in tb else ''):
        g=(w.group(1) or w.group(2) or '').strip();tr=re.sub(r'^\(\s*(?:sure|likely|unsure)(?: as read)?[;,]?\s*','(',(w.group(3) or '').strip());tr='' if tr in ('()','( )') else tr
        if g and not re.fullmatch(r'[—\-–\s]+',g):mat=f'„{g}“'+(' '+tr if tr else '');raw=g
    sc=re.search(r'Maßstab:?\s*\*{0,2}([\d,.]+:[\d,.]+)',tb)
    tol=re.search(r'nicht eingetr\w*\.? Toleranz[^±]{0,20}±\s*([\d,]+)',b)
    rough=re.search(r'Rohmaß ([^"]+)"',b)
    ht=[];seen=set()
    for m in re.finditer(r'"([^"]{3,120})"\s*(?:\(([^)]{3,160})\)|=\s*([^;"\n]{3,160}))?',b):
        g=m.group(1)
        if re.search(r'härt|anlass|vergüt|blau|brünier|vernick|vergold|versilb|lackier|phosphat|bonder|polier|glanz|gebläut|spritzen|sandeln|federhart|geschliffen|vernick|verchrom|eloxi',g,re.I) and g not in seen and not g.startswith('Werkstoff'):
            seen.add(g);tr=(m.group(2) or m.group(3) or '').strip().rstrip('.')
            if g==raw:continue
            ht.append(f'„{g}“'+(f' ({tr})' if tr and not tr.startswith(('sure','likely','unsure')) else ''))
    su=re.search(r'Surface(?: marks?| sign)?:?\s*"?([▽∇][▽∇ ()]*)',b)
    return {'mat':mat,'scale':sc.group(1) if sc else '','tol':tol.group(1) if tol else '','rough':rough.group(1) if rough else '','ht':ht,'surf':(su.group(1).strip() if su else ''),'h':s['h'],'file':s['file']}
ALIAS={'050302-1':('05-03/Wempe_05-03_6.jpg',),'050401-1':('05-04/Wempe_05-04_10-1_Wempe_Griessbach.jpg',),'050402-1':('05-04/Wempe_05-04_04.jpg',),'050402-2':('05-04/Wempe_05-04_04.jpg',)}   # the hairspring's strip is its Spiralfaden sheet (05 03_6); the detent's is 1436 (Griessbach's); the staff and hub as last revised 05 04 02 (29.5.46)
NOTEMAT={'050402-2':('„Ms.“ (brass)','the drawing 05 04 02 (Wempe_05-04_04.jpg): its notes name the hub „Ms.“')}   # a material a sheet's notes give for one of its parts, where its title block gives none
def sheets_of(l):
    d=norm(l.get('dwg') or '')
    if not d:return []
    own=[s for s in SECS if s['nums'] and s['nums'][0]==d];alt=[s for s in SECS if d in s['nums'][1:]]
    # an older sheet under another number (the 04 series': 127-556.04-004 / 040202-1 is 05 02 02-1): its file among the line's figs, and its heading naming the part
    w0=l['name'].split('(')[0].strip().lower();fg={re.sub(r'_0*(\d)',r'_\1',x.strip().replace(' ','-')) for x in (l.get('figs') or '').split(',') if x.strip()}
    byfig=[s for s in SECS if re.sub(r'_0*(\d)',r'_\1',s['file'].split('/')[-1][6:-4]) in fg and w0 and re.search(r'(?<!\w)'+re.escape(w0)+r'(?!\w)',s['h'].lower())]
    al=[s for s in SECS if s['file'] in ALIAS.get(l['id'],())]
    R=[];[R.append(s) for s in al+own+alt+byfig if s not in R]
    return R
def material(l):
    """(material, its source, finish and treatment, cls): the drawing's where its sheet gives them ('drawing'); an assembly's lines elsewhere ('asm'); else none ('none')"""
    S=[sheet(s) for s in sheets_of(l)]
    if l['kind']=='asm':return ("an assembly: see its parts' lines",('its sheet '+S[0]['file'].split('/')[-1]) if S else 'its drawing number','','asm',S)
    for s in S:
        if s['mat']:
            tr=[*s['ht']]+([f"surface {s['surf']} (DIN 140: ▽ roughed, ▽▽ smoothed, ▽▽▽ fine, ▽▽▽▽ polished)"] if s['surf'] else [])+([f"blank (Rohmaß) {s['rough']}"] if s['rough'] else [])+([f'untoleranced sizes ±{s["tol"]}'] if s['tol'] else [])
            return (s['mat'],f"the drawing {l['dwg']} ({s['file'].split('/')[-1]}, title block)",'; '.join(tr) or 'none on the drawing','drawing',S)
    if l['id'] in NOTEMAT:return (*NOTEMAT[l['id']],'; '.join(t for t in S[0]['ht'] if not re.search(r'härt|anlass',t)) if S else '','drawing',S)
    why=('no sheet of its own in the set: a Wempe-Norm part ('+l['id'].split('.')[0]+'), whose standard sheet isn\'t in the drawings' if l['id'].startswith('WN-') else
         'its sheet gives none (Werkstoff left blank)' if S else 'no sheet of its own in the set')
    tr=S[0]['ht'] if S else []   # its own sheet's notes only (another version's sheet tempers it otherwise)
    return ('not on the drawing',why+'; its function: '+l.get('fn',''),'; '.join(tr),'none',S)
# the build's deviations from the drawings (the 1950s build, wempe/js/escapement.js's BUILD; the README's "The build: a Wempe to navigate by")
WB=json.loads((HERE/'wempe_build.json').read_text(encoding='utf-8'))['builds']
DEVS=[{'id':'gold','title':'The gold spring thinned at its bend','period':'both builds, the 1940s and the 1950s','parts':['detent'],'lines':['050401-2'],
   'vmat':'„Goldblech 333 federhart“ (gold sheet 333 fine, spring-hard), as drawn','vtreat':'the blank 0.15 (05 04 01-2) thinned to 0.06 over its first 3 mm from its bending point, stoned or rolled; the rest as drawn',
   'why':f"05 04 01-2's 0.15 taken as the blank: Belyakov (1957, Table 3) gives Lange's MX 0.06 at its bend. Stiff, sprung back onto the horn after the discharge stone passes on the return, it sets the held tooth's stone ringing 113-116 µm; thinned it rings 44 µm and the lock's window opens from 15 µm to about 200 ({WB['build']['window']['floor']:.3f}-{WB['build']['window']['deep']:.3f} mm at the 1950s build's drive: tools/wempe_detent_study.js, wempe_build.js).",
   'sources':['Belyakov, Часовые механизмы (1957), Table 3','tools/wempe_detent_study.js','tools/wempe_build.js','the Wempe README, "The build: a Wempe to navigate by"']},
  {'id':'mainspring','title':'Mainspring in Nivaflex 45/5','period':'the 1950s build (Straumann\'s Nivaflex: patented 1948); the 1940s build keeps the drawn carbon-steel strip','parts':['mainspring','barrel'],'lines':['050700-6'],
   'vmat':'Nivaflex 45/5 (Co 45, Ni 21, Cr 18, Fe 5, W 4, Mo 4, Ti 1, Be 0.2 %)','vtreat':'cold-drawn strip 0.393 × 15 × 1240 mm, its free curve set ×0.8, aged to over 3000 N/mm²; coiled; greased',
   'why':f"1.26 times the drawings' drive (the Soviet Navy's 1958 MX repair book's mainspring, 1.01-1.08 N·m fully wound, against the model's 0.83), which no carbon strip gives within steel's stress: the swing at 12 h {WB['build']['swing']['A12']:.1f}° against the 1940s build's {WB['build40']['swing']['A12']:.1f}°, its inner coils 2.88-2.96 GPa fully wound on Nivaflex's 3.0, 30 days at sea {WB['build']['voyage30']} s. From 1.07 times the drive the maintaining spring closes onto its banking while running, as the Hamilton's does by design ({WB['build']['sustain']} min on it while the key turns).",
   'sources':['tools/wempe_mainspring.py --solve 1240 --set 0.8 --t 0.393','tools/wempe_build_spring.py','tools/wempe_build.js','the Wempe README, "The build: a Wempe to navigate by"']}]
DEVL={n:d for d in DEVS for n in d['lines']}
# the tests on the bench (tools/wempe_bench.js, the 1950s build's) and which line's sheet each goes on; the tolerances the drawings don't give (wempe_tolerances.js)
BENCH=json.loads((HERE/'bench_wempe_build.json').read_text(encoding='utf-8'))
BLINE={'mainspring':['050700-6'],'fusee':['050604-2'],'depths':['050802-1','050901'],'balance':['050302-1'],'rundown':['050301-1'],'detent':['050401-1'],'escapement':['050401-4'],'maintaining':['050601-1'],'stopwork':['050603-1']}
BL={}
for t in BENCH['tests']:
    for n in BLINE.get(t['id'],[]):BL[n]=f"{t['title']}, {t['when']}: {t['pass']}"
T=json.loads((HERE/'tolerances_wempe_build.json').read_text(encoding='utf-8'));g=T['band']['guard'];f2=lambda x:f'{x:.3f}'
TOL={'050700-6':f"The strip {T['mainspring']['t']} mm as the build takes it: {f2(T['mainspring']['t_mm'][0])}-{f2(T['mainspring']['t_mm'][1])} mm (its torque ×{T['mainspring']['s'][0]:.2f}-{T['mainspring']['s'][1]:.2f}) keeps the swing in the guard band, {g[0]}-{g[1]}°, over the whole wind: on a 262 mm lever on the fusee arbor {T['mainspring']['g262']['band'][0]:.0f}-{T['mainspring']['g262']['band'][1]:.0f} g, as 05 06_20 weighs it.",
 '050401-1':f"The detent spring (1436's 0.07, 0.09 at its ends): any thickness to {f2(T['detent']['t_mm'][1])} mm keeps the swing in the band; in time (its fall back before the next tooth) {f2(T['detent']['inTime'][0])}-{f2(T['detent']['inTime'][1])} mm as the uniform equivalent of the drawn {f2(T['detent']['t'])}. Its preload against the banking {T['detent']['preload']['g']} g, at least {T['detent']['preload']['min']} g (a knock) and under 0.85 g (past it the stone catches the escaping tooth's back).",
 '050401-2':f"The gold spring: its stiffness hardly moves the swing (to {T['gold']['k'][1]:.1f} times the drawn, {f2(T['gold']['t_mm'])} mm); it decides the lock's window instead, so make it to the build's thinned bend (its card).",
 '050401-3':f"The depth of lock: {f2(T['lock']['d'])} mm as drawn (05 04_1); it unlocks to {f2(T['lock']['deep'])} and holds against the stone's ringing down to {f2(T['lock']['shallow'])} (wempe_tolerances.js, the build's ring {f2(T['lock']['ring'])}).",
 '050302-1':f"The hairspring: as drawn its period is {T['hairspring']['T']:.4f} s ({T['hairspring']['fast']:.0f} s a day fast), so it is matched to the balance, not made to size: 0.5 s wants the strip {T['hairspring']['hNeed']:.4f} mm thick at 206 GPa ({T['hairspring']['hNeedE'][0]:.4f}-{T['hairspring']['hNeedE'][1]:.4f} over 200-210 GPa); a µm of thickness is {T['hairspring']['perUm']:.0f} s a day, the timing weights' reach {T['hairspring']['weights']['gain']:.0f} s a day. Vibrate it against the balance and choose or grind it (the bench's test)."}
out=[];mats=[]
for l in LINES:
    if not cur(l):continue
    l={k:(v if v is not None else '') for k,v in l.items()};m=material(l)
    fit=fits.get(l['id'],'') or ('takes '+'; '.join(taken[l['id']][:6])+(f'; and {len(taken[l["id"]])-6} more' if len(taken[l['id']])>6 else '') if l['id'] in taken else 'not measured on the model: see its function, '+l.get('fn',''))
    e={'id':l['id'],'idx':l['id'],'no':l['dwg'] or l['id'],'name':l['name'],'qty':l['qty'],'part':l['part'],'fn':l['fn'],'fit':fit,'mat':m[0],'msrc':m[1],'treat':m[2],'cls':m[3]}
    if l['id'] in TOL:e['tol']=TOL[l['id']]
    if l['id'] in BL:e['bench']=BL[l['id']]
    if l['id'] in DEVL:d=DEVL[l['id']];e.update(dev=d['id'],vmat=d['vmat'],vtreat=d['vtreat'])
    out.append(e);mats.append((l,m))
# how each line is made (the materials and processes list, --list and MAKERS.proc): by its material and what it is, the sources' own words where they say
SPECIAL={'050301-1':("by hand and special supply","the cut bimetallic rim: 05 03 01-1's „Nickelstahl Sonderlegierung u. Messing“, a nickel-steel special alloy with brass fused or brazed on, turned, then cut through beside the arm and its masses' holes drilled; no stock supplier makes it: a maker fuses brass onto the nickel steel or buys a balance blank, then adjusts it for temperature on the trial (wempe_thermal.js, the Wempe README's \"Physics: hairspring and temperature\")"),
 '050302-1':("by hand and special supply","the helical hairspring: 05 03_6's „Bandstahl 0,52×0,285 poliert“ wound 15 turns left-hand on a form, hardened and tempered dark blue on it, its terminal curves bent to 05 03_7 by hand with curve pliers on a drawing of them; vibrated against the balance (its tolerance)"),
 '050401-2':("special supply and hand work","05 04 01-2's „Goldblech 333 federhart“: 8 ct gold sheet rolled spring-hard, from a bullion or jewellery supplier; cut, thinned at its bend (the build) and stoned"),
 '050401-1':("by hand","the spring detent (1436, „Stahl“): one piece of steel, its spring (Federung) 0.07 thick (0.09 at its ends) and 5.0 long filed and stoned to its ring (the bench's test), the locking stone set in its pipe (Röhrchen); 1436 gives no hardening"),
 '050700-6':("special supply","the mainspring: 05 07 00-6's strip, or the build's Nivaflex 45/5 (Straumann's, from a mainspring supplier) cut to 1240 mm, its ends formed, set"),
 '050704':("special supply or by hand","the fusee chain (05 07 04): links blanked from thin steel strip and riveted on pins; a chain from a watch-parts supplier, or blanked with a press tool"),}
def proc(l,m):
    if l['id'] in SPECIAL:return SPECIAL[l['id']]
    if l['kind']=='jewel' or re.search(r'stein\b|jewel|sapphire|ruby',l['name'].lower()):return ('bought in','a synthetic jewel: choose the standard hole and outside diameter nearest the drawn (the hole to the pivot plus 0.01-0.02), or have it made')
    mt=m[0].lower()
    if m[3]=='asm':return ('assembled','from its parts\' lines')
    if 'wn-' in l['id'].lower():return ('bought in or turned','a standard part (Wempe-Norm, its sheet not in the set): a screw or pin of the thread and size the model draws (its card)')
    if re.search(r'rundstahl|rundmessing|stahl.*din 175|ms 5|rund',mt) and re.search(r'welle|trieb|stift|staff|arbor|pinion|pin|bush|lager|futter|schraube',(l['name']).lower()):return ('CNC turned','from its drawn bar ('+m[0]+'); pinions cut on a hobbing or wheel-cutting machine, hardened and tempered as the sheet says, pivots burnished')
    if re.search(r'blech|band|flach',mt):return ('CNC milled or wire-cut','from the drawn sheet or strip ('+m[0]+')'+('; its teeth cut to the drawn tooth form' if re.search(r'rad\b|trieb|wheel|pinion|ratchet',l['name'].lower()) else ''))
    if re.search(r'guß|guss|gußt|sand',mt):return ('cast and machined','('+m[0]+')')
    if re.search(r'birke|holz|wood',mt):return ('joinery','('+m[0]+')')
    if m[3]=='drawing':return ('CNC milled or turned','from the drawn stock ('+m[0]+')')
    if re.search(r'polster|riemen|scharnier|öse|haken|griff f|cushion|strap|hinge|hook|felt|din ?96|\bglas\b|glass|holzkasten|deckel \(the|überkasten|leiste',l['name'].lower()):return ('bought in or made by a case maker',"box and case hardware, upholstery or glass: its sheet gives no material (the outer box's wood is on its sheet: „gebleichte Birke“)")
    return ('CNC milled or turned, the material the maker\'s choice','its sheet gives no material: a maker chooses one for its function')
P=[{'id':l['id'],'how':proc(l,m)[0],'note':proc(l,m)[1]} for l,m in mats]
for e,p in zip(out,P):e['how']=p['how'];e['hown']=p['note']
js=('/* makers.js: the Wempe\'s maker\'s sheets\' data, one entry a line of its parts list (bom.json: the works drawings\' parts, by drawing number, as last revised):\n'
    '   its drawing (no), name, units, card, function, the fit bom.py measured on the model (wempe/BOM.md), its material and treatment as its sheet gives them (cls:\n'
    '   drawing; none where its sheet gives none or it has none in the set), how it is made (how, hown), its tolerance and test on the bench, and the 1950s build\'s\n'
    '   deviations (dev, vmat, vtreat; MAKERS.devs). Written by tools/wempe_makers.py; do not edit by hand. Declares only MAKERS */\n"use strict";\nconst MAKERS='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\nMAKERS.devs='+json.dumps(DEVS,ensure_ascii=False,separators=(',',':'))+';\nMAKERS.tests='+json.dumps([{k:t[k] for k in ('id','title','when','how','pass')}|{'no':t.get('sheet','')} for t in BENCH['tests']],ensure_ascii=False,separators=(',',':'))+';\n')
dst=W/'js'/'makers.js'
if '--list' in sys.argv:
    import collections;C=collections.Counter(p['how'] for p in P)
    print('\n'.join(f'{e["no"]:<14} {e["name"][:44]:<44} {e["mat"][:46]:<46} {e["how"]}' for e in out));print(dict(C))
    print(len(out),'lines;',sum(1 for e in out if e['cls']=='drawing'),'with their sheet\'s material,',sum(1 for e in out if e['cls']=='none'),'without');sys.exit(0)
if '--check' in sys.argv:
    ok=dst.exists() and dst.read_text(encoding='utf-8')==js;print('wempe/js/makers.js','up to date' if ok else 'stale: run python wempe_makers.py');sys.exit(0 if ok else 1)
dst.write_text(js,encoding='utf-8',newline='\n');print('wrote',dst.relative_to(ROOT),len(out),'lines,',sum(1 for o in out if o['fit'] and not o['fit'].startswith('not measured')),'with measured fits,',sum(1 for o in out if o['cls']=='drawing'),'materials from the drawings,',sum(1 for o in out if o['cls']=='none'),'not on the drawings')
