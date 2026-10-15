"""The geometry checks of the report "The Wempe Einheits-Chronometer: does the model hold to its drawings, and would it keep time?" (build_report.py): each browser
check run on the Wempe's page (--model wempe) one after another, never two at once (they slow each other's page), each with a timeout; its exit code, its time and its
output as it prints it go to assets/geometry.json, which build_report.py reads. Needs Python with Playwright and Chromium, as the checks do.

  python geometry.py              solids, fine, the screw audit (movement and box), exploded and the parts list (about 11 minutes: fine.py 3, bom.py 6)
  python geometry.py solids,fine  those again, the rest kept from assets/geometry.json
"""
import json, os, pathlib, subprocess, sys, time
HERE = pathlib.Path(__file__).resolve().parent; TOOLS = HERE.parents[1] / 'chronometer-working-model' / 'tools'; OUT = HERE / 'assets' / 'geometry.json'
STEPS = [   # name, the tool's arguments, what it checks
    ('solids', ['solids.py'], 'Every mesh a closed solid: no open edge, consistently wound, a positive volume; as loaded, and with Moving parts only and a section on.'),
    ('fine', ['fine.py'], 'A 0.05 mm voxel interference check over the escapement\'s phases, the train\'s positions and the wind (fully wound, winding, run down): every pair that overlaps must be an expected contact, within its size; the barrel\'s swept solid; the dial\'s printed face.'),
    ('audit', ['audit.py'], 'The movement\'s screws and ends: screws overlapping, screws with nothing under their seats, arbor and pin ends in nothing, coplanar faces, parts touching nothing; against the expected leftovers.'),
    ('audit-box', ['audit.py', 'box'], 'The same for the case, the gimbals and the box.'),
    ('exploded', ['exploded.py'], 'The Spread view\'s clearance: no two parts meet at full spread or pass through each other on the slider\'s way there.'),
    ('bom', ['bom.py'], 'Every part against the drawing list (bom.json): each line\'s units counted on the model\'s pieces, and its relations measured on the built meshes (threads, pivots and settings in their holes, bores round their shafts, parts resting on each other, meshes, endshake, the jewels seated).')]
def main():
    want = sys.argv[1].split(',') if len(sys.argv) > 1 else [s[0] for s in STEPS]
    bad = [w for w in want if w not in [s[0] for s in STEPS]]
    if bad: sys.exit(f'no step {bad}; steps: {", ".join(s[0] for s in STEPS)}')
    res = json.loads(OUT.read_text(encoding='utf-8')) if OUT.exists() and len(sys.argv) > 1 else {}
    env = {**os.environ, 'PYTHONIOENCODING': 'utf-8', 'PYTHONUTF8': '1'}
    for name, args, what in STEPS:
        if name not in want: continue
        t0 = time.time(); print(f'  {name:10s}', end=' ', flush=True)
        try:
            p = subprocess.run([sys.executable, *args, '--model', 'wempe'], cwd=TOOLS, capture_output=True, text=True, encoding='utf-8', errors='replace', env=env, timeout=1200)
            rc, out = p.returncode, (p.stdout + ('\n' + p.stderr if p.stderr.strip() else ''))
        except subprocess.TimeoutExpired as e:
            rc, out = 1, f'timed out after 1200 s\n{e.stdout or ""}'
        dt = round(time.time() - t0)
        res[name] = dict(cmd='python ' + ' '.join(args + ['--model', 'wempe']), what=what, rc=rc, secs=dt, out=out.replace('\r', '').rstrip())
        print(f'{"ok  " if rc == 0 else "FAIL"} {dt:4d} s')
    res = {s[0]: res[s[0]] for s in STEPS if s[0] in res}; res['_made'] = time.strftime('%Y-%m-%d')
    OUT.parent.mkdir(exist_ok=True); OUT.write_text(json.dumps(res), encoding='utf-8', newline='\n'); print('wrote assets/geometry.json')
if __name__ == '__main__': main()
