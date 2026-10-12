"""The report "Would a chronometer made to the model run and keep time?" (model README, "Checked in time"): index.html here, built from template.html and
the results the tools wrote: assets/data.json (node reportdata.js), assets/fea.json (fea.py --json), assets/rating.json (rating.py --demo --json), assets/trip.json
(tripping.js --json), assets/gimbals.json (gimbals.js --json). It also runs
the model's earlier checks (escapement.js, physics.js, strength.js, dynamics.js --quick, errorbudget.js) and shows their output. The data are embedded, so the
page opens from the file without a server.

  python build_report.py          index.html here (about 45 s: the earlier checks run)
"""
import datetime, html, json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); TOOLS = os.path.normpath(os.path.join(HERE, '..', '..', 'tools'))
A = lambda f: json.load(open(os.path.join(HERE, 'assets', f), encoding='utf-8'))
DATA = dict(data=A('data.json'), fea=A('fea.json'), rating=A('rating.json'), trip=A('trip.json'), gim=A('gimbals.json'), mf=json.load(open(os.path.join(TOOLS, 'mainspring_friction.json'), encoding='utf-8')), mfN=json.load(open(os.path.join(TOOLS, 'mainspring_friction_t0.386.json'), encoding='utf-8')))
MFR = DATA['mf']; MFR['band'] = json.load(open(os.path.join(TOOLS, 'bench.json'), encoding='utf-8'))['criteria']['fusee']['band']; MFR['room'] = json.load(open(os.path.join(TOOLS, 'bench.json'), encoding='utf-8'))['criteria']['mainspring']['friction']['room']
for r in MFR['rows'] + DATA['mfN']['rows']: r.pop('parts', None)
for c, v in DATA['fea']['cases'].items(): v['fields'] = {k: f for k, f in v['fields'].items() if k == 'barrelBridge' and c == 'fully wound'}   # the page draws the barrel bridge's, fully wound
CHECKS = [('escapement.js', [], 'The escapement against the manual\'s figures (Ops. 84-97), its running swing and its isochronism; the locking stone swept against the teeth.'),
          ('physics.js', [], 'The energy budget from the mainspring to the balance, the escape wheel\'s chase onto the jewel, the balance\'s damping, temperature from the materials.'),
          ('strength.js', [], 'Every loaded part fully wound against its material\'s range (Lewis\' formula for teeth, beams for pivots and pins), and the knocks it takes.'),
          ('dynamics.js', ['--quick'], 'The escapement integrated in time through every contact, against the averaged model; the detent\'s return.'),
          ('errorbudget.js', [], 'A Monte Carlo of the escapement made to a maker\'s tolerances, and a 60-day voyage\'s error from the test card\'s figures, the barometer, the oil and the sea.')]
def run(f, a):
    r = subprocess.run(['node', os.path.join(TOOLS, f)] + a, cwd=TOOLS, capture_output=True, text=True, encoding='utf-8'); return r.returncode, r.stdout.strip()
ctx = []
for f, a, what in CHECKS:
    rc, out = run(f, a); print(f'{f}: exit {rc}')
    ctx.append(f'<h3><code>tools/{f}{" " + " ".join(a) if a else ""}</code> <span class="small">{"passes" if rc == 0 else "FAILS"}</span></h3><p>{html.escape(what)}</p>'
               f'<details><summary>its output today</summary><pre>{html.escape(out)}</pre></details>')
t = open(os.path.join(HERE, 'template.html'), encoding='utf-8').read()
t = t.replace('/*DATA*/null', json.dumps(DATA, separators=(',', ':')).replace('</', '<\\/')).replace('<!--CONTEXT-->', '\n'.join(ctx)).replace('<!--MADE-->', datetime.date.today().strftime('%-d %B %Y') if os.name != 'nt' else datetime.date.today().strftime('%#d %B %Y'))
open(os.path.join(HERE, 'index.html'), 'w', encoding='utf-8', newline='\n').write(t); print('wrote index.html', len(t) // 1024, 'KB')
