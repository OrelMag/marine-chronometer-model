"""PreToolUse hook (Bash|PowerShell): before a run of ci.py, see whether it can be expedited. It runs `ci.py --plan` with the
command's own tier (--quick, --full, --swiftshader; about 12 s) in the worktree the command runs in, and the first time a given
command is tried it stops it once with what the plan found: how many steps the cache would skip, how many would run and for how
long, the inputs behind them (each with its steps), the files the branch changed since main, the steps whose reason is one of
those files (a ready --only list), and the machine's slots other runs hold. Claude then runs a narrower set (--only, --changed,
--quick) or the same command again, which passes (within 30 minutes). Commands with --plan, --only or --changed are already a
chosen set and pass; so does any command if the plan can't be made. CLAUDE.md, Verification tools: choose the checks by what the
change can break. Reads the hook's JSON on stdin."""
import json, os, re, subprocess, sys, tempfile, time
CI = r'(?:^|[\s;&|(])(?:python3?|py)(?:\.exe)?\s+(?:-\w+\s+)*["\']?([^\s"\';|&]*?)ci\.py\b([^;&|\n]*)'
def state_path(sid): return os.path.join(tempfile.gettempdir(), 'claude-ci-expedite-%s.json' % re.sub(r'[^\w-]', '', sid or 'none'))
def winpath(p):   # Git Bash's /e/... as E:/...
    m = re.match(r'^/([a-zA-Z])/(.*)$', p)
    return (m.group(1).upper() + ':/' + m.group(2)) if m else p
def where(cmd, cwd, pre):
    """The folder ci.py lives in: its own path in the command, after a cd (or Set-Location) before it, from the hook's cwd."""
    base = cwd
    for m in re.finditer(r'(?:\bcd|Set-Location)\s+(?:-Path\s+)?("([^"]+)"|\'([^\']+)\'|([^\s;&|]+))', cmd):
        if m.start() < cmd.find('ci.py'): base = os.path.join(base, winpath(m.group(2) or m.group(3) or m.group(4)))
    return os.path.normpath(os.path.join(base, winpath(pre))) if pre else os.path.normpath(base)
try:
    d = json.load(sys.stdin)
except Exception:
    sys.exit(0)
cmd = (d.get('tool_input') or {}).get('command') or ''
m = re.search(CI, cmd)
if not m: sys.exit(0)
flags = m.group(2)
if re.search(r'--(plan|only|changed|help)\b|-h\b', flags): sys.exit(0)
root = where(cmd, d.get('cwd') or os.getcwd(), m.group(1))
if not os.path.isfile(os.path.join(root, 'ci.py')): sys.exit(0)
sid, key = d.get('session_id'), root.lower() + '|' + ' '.join(cmd.split())
try:
    with open(state_path(sid)) as fh: st = json.load(fh)
except Exception: st = {}
if time.time() - st.get(key, 0) < 1800: sys.exit(0)   # tried once already: Claude chose to run it as it is
st = {k: v for k, v in st.items() if time.time() - v < 1800}; st[key] = time.time()
try:
    with open(state_path(sid), 'w') as fh: json.dump(st, fh)
except Exception: pass
tier = [f for f in ('--quick', '--full', '--swiftshader') if re.search(f + r'\b', flags)]
try:
    out = subprocess.run([sys.executable, 'ci.py', '--plan', *tier], cwd=root, capture_output=True, text=True, timeout=100,
                         encoding='utf-8', errors='replace').stdout
except Exception:
    sys.exit(0)
rows = re.findall(r'^\s{2}(\S+)\s+(cached|run: (.*))$', out, re.M)
tot = re.search(r'(\d+) of (\d+) cached; about (\d+) min', out)
if not rows or not tot: sys.exit(0)
run = [(n, r.strip()) for n, c, r in rows if c != 'cached']
def git(*a): return subprocess.run(['git', *a], cwd=root, capture_output=True, text=True).stdout.strip()
branch = git('rev-parse', '--abbrev-ref', 'HEAD'); mb = git('merge-base', 'main', 'HEAD')
changed = sorted({f for f in (git('diff', '--name-only', mb).splitlines() + git('ls-files', '-o', '--exclude-standard').splitlines()) if f})
by = {}
for n, r in run: by.setdefault(r, []).append(n)
why = sorted(by.items(), key=lambda kv: -len(kv[1]))
low = {f.lower() for f in changed}
mine = [n for n, r in run if r.split(' (')[0].lower() in low]
busy = ''
try:
    sys.path.insert(0, root); from citrace import cislots
    s = cislots.Slots(root); c = sum(l.busy() for l in s.cpu); b = sum(l.busy() for l in s.br)
    if c or b: busy = f'Other ci.py runs on this machine hold {c} of {s.ncpu} CPU slots and {b} of {s.nbr} browser slots now: this run queues behind them, and what they pass lands in the shared cache.\n'
except Exception: pass
L = [f'Before this CI run (stopped once; the same command again runs it): `ci.py --plan{" " + " ".join(tier) if tier else ""}` in {root} on {branch}: '
     f'{tot.group(1)} of {tot.group(2)} steps cached; {len(run)} would run, about {tot.group(3)} min of steps, plus the build.']
if not run: L.append('Nothing but the build would run: every step is cached.')
else:
    L.append('Inputs behind the steps that would run (the first changed input of each):')
    for r, ns in why[:12]: L.append(f'  {r}: {len(ns)} ({", ".join(ns[:8])}{", ..." if len(ns) > 8 else ""})')
    if len(why) > 12: L.append(f'  ... and {len(why) - 12} more inputs')
L.append(f'Files changed since main on this branch (committed or not): {len(changed)}' + (': ' + ', '.join(changed[:15]) + (' ...' if len(changed) > 15 else '') if changed else ''))
if mine: L.append(f'Steps whose reason is one of those files: --only {",".join(mine)}')
L.append(busy + 'Expedite where you can (CLAUDE.md, Verification tools: choose the checks by what the change can break): text no check reads needs only the build; '
         "a page's strings or controls the build, types, smoke (sitecheck.py if site/ changed); timing or physics the tools that compute it; geometry --full. "
         'Use --only for the steps the change can break, --changed for those that read the branch\'s files, or --quick without browser checks. '
         'Steps running for an input this branch did not change (main moved, another worktree, a generated file such as contactdata.js) may still be needed after a merge; '
         'the build runs first and rewrites built copies some steps read, so their reasons may clear. If the full set is what this change calls for, run the command again unchanged.')
print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "deny", "permissionDecisionReason": '\n'.join(L)}}))
