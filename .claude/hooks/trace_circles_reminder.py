"""UserPromptSubmit and PostToolUse (Read|Bash|PowerShell) hook: when a hand trace comes in (the owner pastes a tools/tracer.html export, with its points_px, or
names a .trace.json / .mm.json / _picks.json; or Claude reads or runs a command on such a file), remind Claude of the owner's rule for traced edges: split each
traced edge into runs and fit circles and lines; a run whose points fit a circle within the trace's scatter IS a circle, built as an exact arc (centre, radius),
not a polyline through the points (memory: traced-arcs-are-circles; the owner, 18 October 2026). Reads the hook's JSON on stdin."""
import json, re, sys
try:
    d = json.load(sys.stdin)
except Exception:
    sys.exit(0)
ev = d.get('hook_event_name') or ''
TRACE = r'\.trace\.json|\.mm\.json|_picks\.json|"points_px"'
if ev == 'UserPromptSubmit':
    text = d.get('prompt') or ''
else:
    ti = d.get('tool_input') or {}
    text = (ti.get('file_path') or '') + ' ' + (ti.get('command') or '')
if not re.search(TRACE, text):
    sys.exit(0)
msg = ("A hand trace is involved (tools/tracer.html). The owner's rule for traced edges: split each traced edge into runs and fit circles and lines to them "
       "(E:\\mc-video\\oq\\cockfix2\\arcs.py and slab_arcs.py did it for the balance lower bridge); a run whose points fit a circle within the trace's own scatter "
       "(about 0.1 mm rms for a good trace) is a circle, so build it as an exact arc (centre and radius, joined to its neighbours where they meet), never a polyline "
       "through the traced points; a run that fits a line is a line. Say in the code comment which runs are circles, their radii, centres and rms. "
       "Put the trace into model mm first: a flattened image's .json gives px_per_mm, x0, z0 (one image per height); a raw frame needs its camera at each edge's height.")
print(json.dumps({"hookSpecificOutput": {"hookEventName": ev or "PostToolUse", "additionalContext": msg}}))
