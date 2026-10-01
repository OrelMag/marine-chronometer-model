"""PostToolUse hook (Edit|Write|MultiEdit|Bash|PowerShell): after a change to the model's geometry, remind Claude to isolate the
changed part and compare it with its reference (a real Model 21's photograph or video frame, or the manual's figure) before
going on. Geometry files: the model's js/movement.js, core.js, box.js and shared/escapement.js, escplan.js, changed by an edit
or by a shell command that writes them (sed -i, a redirect, Set-Content...). It also records, per session, when geometry last
changed and when tools/isolate.py last ran, for the Stop gate (geometry_gate.py). Reads the hook's JSON on stdin."""
import json, os, re, sys, tempfile, time
GEO = r'(chronometer-working-model/js/(movement|core|box)|shared/(escapement|escplan))\.js'
NAME = r'\b(movement|core|box|escapement|escplan)\.js\b'
WRITE = (r'sed\s+(-\w+\s+)*-i|perl\s+-\w*i|(?<![0-9&])>>?(?!&)\s*(?!/dev/null|\$null)\S|\btee\b|Set-Content|Add-Content|Out-File|'
         r'WriteAll|\.write\(|open\([^)]*[\'"][wa]|\bpatch\b|\bmv\b|\bcp\b|Copy-Item|Move-Item')
def state_path(sid): return os.path.join(tempfile.gettempdir(), 'claude-geometry-%s.json' % re.sub(r'[^\w-]', '', sid or 'none'))
def load(sid):
    try:
        with open(state_path(sid)) as fh: return json.load(fh)
    except Exception: return {}
def save(sid, st):
    try:
        with open(state_path(sid), 'w') as fh: json.dump(st, fh)
    except Exception: pass
try:
    d = json.load(sys.stdin)
except Exception:
    sys.exit(0)
sid, ti = d.get('session_id'), d.get('tool_input') or {}
f = (ti.get('file_path') or (d.get('tool_response') or {}).get('filePath') or '').replace(chr(92), '/')
cmd = ti.get('command') or ''
if cmd and re.search(r'isolate\.py', cmd):
    st = load(sid); st['iso'] = time.time(); save(sid, st)
if f: hit = re.search(GEO + '$', f) and f.split('/')[-1]
elif cmd and not re.match(r'\s*git\b', cmd):
    m = re.search(NAME, cmd); hit = m and re.search(WRITE, cmd) and m.group(0)
else: hit = None
if not hit:
    sys.exit(0)
st = load(sid); st['edit'] = time.time(); st['file'] = hit; save(sid, st)
msg = ("Geometry may have changed in " + hit + ". Before going on, isolate the part you changed and compare it with its reference: "
       "render it alone with tools/isolate.py PART [--look yaw pitch dist x y z] [--ref IMAGE] (several views; the part's partName is in part('...') "
       "in movement.js), put it beside a real Model 21 (References/ photographs, a video frame from References/VIDEOS.md via tools/video.py frame, "
       "or the manual's figure), and say what matches, what differs and how sure each reading is. Where they disagree the model is wrong "
       "(CLAUDE.md, Source of truth). If no part's shape changed (timing, a comment, a material), say so instead.")
print(json.dumps({"hookSpecificOutput": {"hookEventName": "PostToolUse", "additionalContext": msg}}))
