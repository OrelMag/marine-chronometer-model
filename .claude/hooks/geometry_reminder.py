"""PostToolUse hook (Edit|Write): after a change to the model's geometry, remind Claude to isolate the changed part and
compare it with its reference (a real Model 21's photograph or video frame, or the manual's figure) before going on.
Reads the hook's JSON on stdin; prints the reminder as additionalContext when the file is movement.js, core.js or box.js."""
import json, re, sys
try:
    d = json.load(sys.stdin)
except Exception:
    sys.exit(0)
ti = d.get('tool_input') or {}
f = (ti.get('file_path') or (d.get('tool_response') or {}).get('filePath') or '').replace(chr(92), '/')
if not re.search(r'chronometer-working-model/js/(movement|core|box)\.js$', f):
    sys.exit(0)
msg = ("Geometry changed in " + f.split('/')[-1] + ". Before going on, isolate the part you changed and compare it with its reference: "
       "render it alone with tools/isolate.py PART [--look yaw pitch dist x y z] [--ref IMAGE] (several views; the part's partName is in part('...') "
       "in movement.js), put it beside a real Model 21 (References/ photographs, a video frame from References/VIDEOS.md via tools/video.py frame, "
       "or the manual's figure), and say what matches, what differs and how sure each reading is. Where they disagree the model is wrong "
       "(CLAUDE.md, Source of truth).")
print(json.dumps({"hookSpecificOutput": {"hookEventName": "PostToolUse", "additionalContext": msg}}))
