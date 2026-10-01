"""Stop hook: if the model's geometry changed in this session (as geometry_reminder.py recorded it) and tools/isolate.py hasn't
run since, block the stop once and ask Claude to isolate and compare the changed part, or to say why no part's shape changed.
It blocks once per change: the block is recorded, so the next stop goes through until geometry changes again."""
import json, os, re, sys, tempfile, time
def state_path(sid): return os.path.join(tempfile.gettempdir(), 'claude-geometry-%s.json' % re.sub(r'[^\w-]', '', sid or 'none'))
try:
    d = json.load(sys.stdin)
    with open(state_path(d.get('session_id'))) as fh: st = json.load(fh)
except Exception:
    sys.exit(0)
if d.get('stop_hook_active') or st.get('edit', 0) <= max(st.get('iso', 0), st.get('ack', 0)):
    sys.exit(0)
st['ack'] = time.time()
try:
    with open(state_path(d.get('session_id')), 'w') as fh: json.dump(st, fh)
except Exception: pass
print(json.dumps({"decision": "block", "reason":
    "Geometry changed (" + st.get('file', '?') + ") and tools/isolate.py hasn't run since. Isolate the changed part, compare it beside a real "
    "Model 21 (photograph, video frame or the manual's figure) and say what matches, what differs and how sure each reading is; "
    "or, if no part's shape changed, say so and why."}))
