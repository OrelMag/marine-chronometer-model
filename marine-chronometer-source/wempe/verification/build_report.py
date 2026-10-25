"""The report "The Wempe Einheits-Chronometer: does the model hold to its drawings, and would it keep time?": index.html here, built from template.html with
assets/data.json (node reportdata.js: every Wempe check run, its exit code and output, and the figures the page charts), assets/geometry.json (python geometry.py: the
browser checks on the Wempe's page), the tools' expected tables (../checks.py, ../bom.json) and the model's README (its sections "Sources", "Estimated, not from the
drawings", "Readings corrected against the sheets", "Unresolved" and "The Soviet 6MX", rendered as they stand). The data are embedded, so the page opens from the file without a server.
No drawing scan or photograph is shown: every chart is drawn from the model's numbers, and the videos are linked at the moments used.

  node reportdata.js        assets/data.json (about 9 minutes)
  python geometry.py        assets/geometry.json (about 11 minutes, the browser)
  python build_report.py    index.html here (a second)
"""
import datetime, html, importlib.util, json, os, re
HERE = os.path.dirname(os.path.abspath(__file__)); WE = os.path.dirname(HERE)
A = lambda f: json.load(open(os.path.join(HERE, 'assets', f), encoding='utf-8'))

def inline(s):
    """A README line's Markdown (code, bold, italics, links) as HTML; links into the repository become their text (the page is also served on the site)."""
    code = []
    s = re.sub(r'`([^`]+)`', lambda m: code.append(m.group(1)) or f'\x00{len(code) - 1}\x00', s)
    s = html.escape(s, quote=False)
    s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
    s = re.sub(r'(?<![*\w])\*(?=\S)(.+?)(?<=\S)\*(?![*\w])', r'<i>\1</i>', s)
    s = re.sub(r'\[([^\]]+)\]\((https?://[^)\s]+)\)', r'<a href="\2">\1</a>', s)
    s = re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', r'\1', s)
    s = re.sub(r'&lt;(https?://[^&\s]+)&gt;', r'<a href="\1">\1</a>', s)
    return re.sub('\x00(\\d+)\x00', lambda m: f'<code>{html.escape(code[int(m.group(1))])}</code>', s)

def section(md, title):
    """The lines of a README section (## title) up to the next."""
    m = re.search(r'^## ' + re.escape(title) + r'\s*$(.*?)(?=^## |\Z)', md, re.S | re.M)
    if not m: raise SystemExit(f'the README has no section "{title}"')
    return m.group(1).strip('\n').split('\n')

def items(lines):
    """A section's bullets as a tree: [{t: html, kids: [...]}], paragraphs as {p: html}."""
    out = []
    for ln in lines:
        if not ln.strip(): continue
        m = re.match(r'^( *)- (.*)$', ln)
        if not m:
            if out and 'kids' in out[-1] and ln.startswith('  '): (out[-1]['kids'][-1] if out[-1]['kids'] else out[-1])['t'] += ' ' + inline(ln.strip())
            else: out.append(dict(p=inline(ln.strip())))
            continue
        it = dict(t=inline(m.group(2)), kids=[])
        if len(m.group(1)) >= 2 and out and 'kids' in out[-1]: out[-1]['kids'].append(it)
        else: out.append(it)
    return out

def ul(tree, cls=''):
    return f'<ul{cls}>' + ''.join(f'<li>{i["t"]}' + (ul(i['kids']) if i.get('kids') else '') + '</li>' for i in tree if 't' in i) + '</ul>'

def estimates(tree):
    """The estimates grouped: each top bullet with children is a group (its bold lead the group's name); the bullets without children, the frame's (P1a)."""
    groups, loose = [], []
    for i in tree:
        if 't' not in i: continue
        if i['kids']: groups.append((re.sub(r'<[^>]+>', '', i['t']).rstrip(':').strip(), i['kids']))
        else: loose.append(i)
    groups.insert(0, ('The frame (P1a)', [i for i in loose if not i['t'].startswith('<b>Left out')]))
    left = [i for i in loose if i['t'].startswith('<b>Left out')]
    if left: groups.append(('Left out, small', left))
    rows = ''.join(f'<tr><td>{html.escape(g)}</td><td class="num">{len(k)}</td></tr>' for g, k in groups)
    body = ''.join(f'<details><summary>{html.escape(g)}: {len(k)}</summary>{ul(k)}</details>' for g, k in groups)
    return f'<div class="tw"><table><tr><th>Group</th><th>Estimates</th></tr>{rows}<tr><th>In all</th><th class="num">{sum(len(k) for _, k in groups)}</th></tr></table></div>{body}', sum(len(k) for _, k in groups)

def checks_py():
    """The Wempe's tables for the tools (../checks.py): the expected contacts (fine.py) and leftovers (audit.py), each with its reason."""
    s = importlib.util.spec_from_file_location('wempe_checks', os.path.join(WE, 'checks.py')); m = importlib.util.module_from_spec(s); s.loader.exec_module(m)
    return dict(expected=[[a, b, r, v, d] for (a, b), (r, v, d) in m.EXPECTED.items()], loose=[[p, r] for p, _, _, r in m.LOOSE],
                float=[[p, r] for p, _, _, r in m.FLOAT], floatBox=[[p, r] for p, _, _, r in m.FLOAT_BOX], jewels=m.JEWELS, states=len(m.STATES))

def bom():
    b = json.load(open(os.path.join(WE, 'bom.json'), encoding='utf-8'))
    L = b['lines']; kinds = {}
    for l in L: kinds[l.get('kind', '?')] = kinds.get(l.get('kind', '?'), 0) + 1
    return dict(lines=len(L), units=sum(max(q) if isinstance(q := l.get('qty') or 0, list) else q for l in L), relations=sum(len(l.get('rel') or []) for l in L), kinds=kinds, devs=[[l['dwg'], l['name'], l['dev']] for l in L if l.get('dev')])

def m3d():
    """The 3D viewer's results beside the report (assets/motion3d/, tools/motion3d_pack.py --site): each version's parts (their peak stress, material, limit, margin and the
    load behind it), the mainspring's inner coils and the findings; and the let-go study (assets/letgo_fix.json, tools/wempe_letgo_fix.js). None if not there."""
    f = os.path.join(HERE, 'assets', 'motion3d', 'meta.json')
    if not os.path.exists(f): return None
    M = json.load(open(f, encoding='utf-8')); nm = M['cfg']['names']
    V = {v: dict(parts=[dict(k=k, name=nm.get(k, k), peak=p['peak'], mat=p['mat'], limit=p.get('limit'), margin=p.get('margin'), load=p.get('load', '')) for k, p in x['parts'].items()],
                 ms={k: x['springs']['mainspring'][k] for k in ('t', 'peakFull', 'medianFull')}, findings=x.get('findings', [])) for v, x in M['versions'].items()}
    lf = os.path.join(HERE, 'assets', 'letgo_fix.json')
    return dict(v=V, made=M['made'], lf=json.load(open(lf, encoding='utf-8')) if os.path.exists(lf) else None)

def makers():
    """Section 20: the maker's sheets' data (wempe/js/makers.js, tools/wempe_makers.py): the lines by how they are made, the special ones in full, the deviations"""
    import html
    s = open(os.path.join(WE, 'js', 'makers.js'), encoding='utf-8').read()
    L = json.loads(re.search(r'const MAKERS=(\[.*?\]);\n', s, re.S).group(1)); D = json.loads(re.search(r'MAKERS\.devs=(\[.*?\]);\n', s, re.S).group(1))
    T = json.loads(re.search(r'MAKERS\.tests=(\[.*?\]);\n', s, re.S).group(1)); e = html.escape
    parts = [l for l in L if l['cls'] != 'asm']; drawn = sum(1 for l in parts if l['cls'] == 'drawing'); wn = sum(1 for l in parts if l['cls'] == 'none' and l['id'].startswith('WN-'))
    by = {}
    for l in parts: by.setdefault(l['how'], []).append(l)
    out = [f'<p>{len(L)} lines as last revised ({len(L) - len(parts)} assemblies): {drawn} parts with their material on their own drawing, {len(parts) - drawn} without '
           f'({wn} Wempe-Norm parts whose standard sheets aren\'t in the set; the rest drawn only on an assembly, or with the Werkstoff left blank). '
           f'{sum(1 for l in L if not l["fit"].startswith("not measured"))} carry a fit measured on the model.</p>',
           '<div class="tw"><table><tr><th>How it is made</th><th class="n">Lines</th></tr>' + ''.join(f'<tr><td>{e(k)}</td><td class="n">{len(v)}</td></tr>' for k, v in sorted(by.items(), key=lambda kv: -len(kv[1]))) + '</table></div>',
           '<h3>What needs a hand, or a special supply</h3><div class="tw"><table><tr><th>Drawing</th><th>Part</th><th>Material (its drawing)</th><th>How</th></tr>' +
           ''.join(f'<tr><td>{e(l["no"])}</td><td>{e(l["name"])}</td><td>{e(l["mat"])}</td><td>{e(l["how"])}: {e(l["hown"])}</td></tr>' for l in parts if any(w in l['how'] for w in ('hand', 'special')) or l['how'] == 'bought in') + '</table></div>',
           '<h3>The materials the drawings give</h3><div class="tw"><table><tr><th>Drawing</th><th>Part</th><th>Material</th><th>Treatment</th></tr>' +
           ''.join(f'<tr><td>{e(l["no"])}</td><td>{e(l["name"])}</td><td>{e(l["mat"])}</td><td>{e(l["treat"])}</td></tr>' for l in parts if l['cls'] == 'drawing') + '</table></div>',
           '<h3>The 1950s build\'s deviations on the cards</h3><ul>' + ''.join(f'<li><b>{e(d["title"])}</b> ({e(d["period"])}): {e(d["vmat"])}; {e(d["vtreat"])}. {e(d["why"])}</li>' for d in D) + '</ul>',
           f'<p>The book\'s last chapter: the bench\'s {len(T)} tests (<code>tools/wempe_bench.js</code>, the 1950s build), each on its part\'s sheet too. Not in the book yet: an order of '
           'assembly (the Hamilton\'s is its manual\'s Sec. VIII reassembly; no Wempe or 6MX assembly instructions are in the sources).</p>']
    return '\n'.join(out)

def main():
    md = open(os.path.join(WE, 'README.md'), encoding='utf-8').read()
    est, nest = estimates(items(section(md, 'Estimated, not from the drawings')))
    corr = [i for i in items(section(md, 'Readings corrected against the sheets')) if 't' in i]
    unres = [i for i in items(section(md, 'Unresolved')) if 't' in i]
    src = items(section(md, 'Sources'))
    sov = re.search(r'^## The Soviet 6MX[^\n]*$(.*?)(?=^## |\Z)', md, re.S | re.M)
    if not sov: raise SystemExit('the README has no section "The Soviet 6MX"')
    sov = ''.join(f'<p>{i["p"]}</p>' if 'p' in i else ul([i]) for i in items(sov.group(1).strip('\n').split('\n')))
    DATA = dict(data=A('data.json'), geo=A('geometry.json') if os.path.exists(os.path.join(HERE, 'assets', 'geometry.json')) else None, checks=checks_py(), bom=bom(),
                counts=dict(estimates=nest, corrected=len(corr), unresolved=len(unres)), m3d=m3d())
    t = open(os.path.join(HERE, 'template.html'), encoding='utf-8').read()
    made = datetime.date.today().strftime('%#d %B %Y' if os.name == 'nt' else '%-d %B %Y')
    for k, v in {'/*DATA*/null': json.dumps(DATA, separators=(',', ':'), ensure_ascii=False).replace('</', '<\\/'), '<!--MADE-->': made,
                 '<!--ESTIMATED-->': est, '<!--CORRECTED-->': ul(corr), '<!--UNRESOLVED-->': ul(unres, ' class="open"'), '<!--SOURCES-->': ul(src), '<!--SOVIET-->': sov, '<!--BOOK-->': makers()}.items():
        if k not in t: raise SystemExit(f'template.html has no {k}')
        t = t.replace(k, v)
    open(os.path.join(HERE, 'index.html'), 'w', encoding='utf-8', newline='\n').write(t)
    print('wrote index.html', len(t.encode()) // 1024, 'KB:', len(DATA['data']['runs']), 'runs,', len(DATA['geo'] or {}) - 1 if DATA['geo'] else 0, 'geometry checks,', nest, 'estimates,', len(corr), 'readings corrected,', len(unres), 'unresolved')

if __name__ == '__main__': main()
