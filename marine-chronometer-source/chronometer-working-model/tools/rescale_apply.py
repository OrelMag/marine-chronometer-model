"""The rescale's rewriter (PLAN-hamilton-drawings.md, Phase 0): multiplies the plate-scaled numeric literals of a script's code by f, writing exact products.

    python rescale_apply.py FILE SPEC.json [--f 1.117] [--write] [--list OUT.txt]

Only code is touched: comments, strings, template literals and regular-expression literals are left as they are. A literal with a decimal point is scaled
by default; an integer only when SPEC forces it. Left alone by rule: exponent forms (1e-6), hex, a literal beside Math.PI, TAU, D2R or /180 (an angle),
the value of a material key (metalness:, roughness:, opacity:, ...), a literal times FK, DK, PHOTO_K or HK (which scale already), .toFixed's argument and an exponent's (**). 1.117 times a literal of d decimals is
exact at d + 3 decimals, so the product is written exactly (Python's Decimal) and faces that met stay met.

SPEC (JSON): {"ranges": [[l0, l1], ...]} the 1-based inclusive line ranges to work (default: none), "skip": [[l0, l1], ...] ranges inside them left alone
(the absolute parts), "include": [N, ...] lines worked though inside a skip, "ints": true integers scaled by default too (intLength's rules leave counts, indices, factors, bounds and 0, 1), "lines": {"N": {"skip": [i, ...], "int": [i, ...], "force": [i, ...], "skipv": [text, ...], "forcev": [text, ...]}} per line the numeric tokens (by index, or by their text: every token so written) (0-based, counted over the
line's code tokens as --list numbers them) to leave, to scale though integer, or to scale though a rule would leave them. --list writes, for each line
worked, its tokens numbered with what was done ([*] scaled, [-] left by rule, [ ] left), for review. Without --write nothing is written. Files are read
and written as bytes (LF kept)."""
import json, pathlib, re, sys
from decimal import Decimal

MATKEYS = {'metalness', 'roughness', 'opacity', 'envMapIntensity', 'polygonOffsetFactor', 'polygonOffsetUnits', 'clearcoat', 'clearcoatRoughness', 'sheen',
           'transmission', 'ior', 'reflectivity', 'emissiveIntensity', 'alphaTest', 'anisotropy', 'specularIntensity', 'intensity', 'color', 'emissive', 'bumpScale', 'shininess'}
NUM = re.compile(r'0[xX][0-9a-fA-F]+|(?:\d+\.\d*|\.\d+|\d+)(?:[eE][+-]?\d+)?')
def tokens(src):
    """yield (kind, start, end) over the source: kind 'num', 'code', 'skip' (comments, strings, regexes)"""
    i, n, last = 0, len(src), ''
    while i < n:
        c = src[i]; d = src[i + 1] if i + 1 < n else ''
        if c == '/' and d == '*': j = src.index('*/', i + 2) + 2; yield ('skip', i, j); i = j; continue
        if c == '/' and d == '/': j = src.find('\n', i); j = n if j < 0 else j; yield ('skip', i, j); i = j; continue
        if c in '\'"`':
            j = i + 1
            while j < n and src[j] != c:
                if src[j] == '\\': j += 1
                j += 1
            yield ('skip', i, j + 1); i = j + 1; last = 'x'; continue
        if c == '/' and (last in '(,=:[!&|?{};+-*%<>~^' or last == '' or re.search(r'(return|typeof|case)\s*$', src[max(0, i - 8):i])):   # a regex literal
            j = i + 1; cls = False
            while j < n:
                if src[j] == '\\': j += 2; continue
                if src[j] == '[': cls = True
                elif src[j] == ']': cls = False
                elif src[j] == '/' and not cls: break
                elif src[j] == '\n': break
                j += 1
            j += 1
            while j < n and src[j].isalpha(): j += 1
            yield ('skip', i, j); i = j; last = 'x'; continue
        if c.isdigit() or (c == '.' and d.isdigit()):
            prev = src[i - 1] if i else ''
            if not (prev.isalnum() or prev in '_$'):
                m = NUM.match(src, i); yield ('num', i, m.end()); i = m.end(); last = '0'; continue
        if c.isalnum() or c in '_$':
            j = i
            while j < n and (src[j].isalnum() or src[j] in '_$'): j += 1
            yield ('code', i, j); i = j; last = 'a'; continue
        if not c.isspace(): last = c
        yield ('code', i, i + 1); i += 1
def ruled(src, s, e):
    t = src[s:e]
    if t[:2].lower() == '0x' or 'e' in t.lower(): return 'hex/exp'
    before, after = src[max(0, s - 24):s].replace(' ', ''), src[e:e + 24].replace(' ', '')
    if re.search(r'(Math\.PI|TAU|D2R)[*/]$', before) or re.match(r'[*/](Math\.PI|TAU|D2R|180)', after) or re.match(r'\*Math\.PI/180', after): return 'angle'
    if re.search(r'(Math\.PI|TAU|D2R)[*/]\($', before): return 'angle'
    if re.match(r'\)?\*(FK|DK|PHOTO_K|HK|BOX_S)(?![A-Za-z_0-9])', after) or re.search(r'(?<![A-Za-z_0-9.])(FK|DK|PHOTO_K|HK|BOX_S)\*$', before): return 'derived'   # sizes already scaled by FK, DK, PHOTO_K
    m = re.search(r'([A-Za-z_]+):$', before)
    if m and m.group(1) in MATKEYS: return 'material'
    if re.search(r'toFixed\($', before) or before.endswith('**'): return 'other'
    return ''
SEGARGS = {'cylY': [2], 'LatheGeometry': [1, 2, 3], 'TubeGeometry': [1, 3], 'CylinderGeometry': [3, 4], 'BoxGeometry': [3, 4, 5], 'SphereGeometry': [1, 2, 3, 4, 5, 6],
           'discClip': [2], 'getPoints': [0], 'getSpacedPoints': [0], 'circ': [1], 'RingGeometry': [2, 3], 'PlaneGeometry': [2, 3], 'cylBetween': [7], 'TorusGeometry': [2, 3],
           'ShapeGeometry': [1], 'Float32BufferAttribute': [1], 'BufferAttribute': [1], 'Uint16BufferAttribute': [1], 'Array': [0], 'setScalar': [], 'toFixed': [0], 'slice': [0, 1], 'splice': [0, 1], 'round': [], 'stripeTex': [0], 'woodTex': [0]}
def intLength(src, s, e, stack):
    """an integer in code, scaled as a length unless it is a count, an index, a factor, a loop bound or a sign"""
    t = src[s:e]
    if t in ('0', '1'): return False
    before, after = src[max(0, s - 24):s].replace(' ', ''), src[e:e + 6].replace(' ', '')
    if re.search(r'(renderOrder=|\+=|-=)$', before): return False
    if re.search(r'(<=|>=|<|>|===|!==|==|%|/|\*\*|\*|\?\?)$', before) and not before.endswith('=>'): return False   # a bound, a divisor, a factor
    if re.match(r'(\*|/|%)', after): return False   # a factor (2*W)
    if re.search(r'[A-Za-z_$0-9\])]\[$', before): return False   # an index
    if re.search(r'(curveSegments|bevelSegments|steps|segments|anisotropy|depthSegments|radialSegments|tubularSegments|n|N|NT|seg|K|count|z):$', before): return False
    if stack and stack[-1][0] in SEGARGS and stack[-1][1] in SEGARGS[stack[-1][0]]: return False
    return True
def run(path, spec, f, write, listout):
    raw = pathlib.Path(path).read_bytes(); src = raw.decode('utf-8'); F = Decimal(f)
    ranges, skip, per = spec.get('ranges', []), spec.get('skip', []), spec.get('lines', {})
    starts = [0] + [m.end() for m in re.finditer('\n', src)]; lineof = lambda pos: __import__('bisect').bisect_right(starts, pos)
    inr = lambda L, rs: any(a <= L <= b for a, b in rs)
    out, pos, lines, idx, cur = [], 0, {}, {}, None
    stack, lastid, ints = [], '', spec.get('ints', False)   # ints: integers scaled by default too, but for counts by the rules in intLength
    for kind, s, e in tokens(src):
        if kind == 'code':
            c = src[s:e]
            if c in '([{': stack.append([lastid if c == '(' else c, 0]); lastid = ''
            elif c in ')]}':
                if stack: stack.pop()
                lastid = ''
            elif c == ',' and stack: stack[-1][1] += 1
            elif c[0].isalpha() or c[0] in '_$': lastid = c
            elif not c.isspace(): lastid = ''
            continue
        if kind != 'num': continue
        L = lineof(s)
        if not inr(L, ranges) or (inr(L, skip) and L not in spec.get('include', [])): continue
        k = idx[L] = idx.get(L, -1) + 1; o = per.get(str(L), {}); t = src[s:e]; why = ruled(src, s, e); isint = '.' not in t
        do = (k in o.get('force', [])) or (t in o.get('forcev', [])) or (ints and isint and not why and intLength(src, s, e, stack)) or (isint and re.search(r"part\('[^']*',-?$", src[max(0, s - 40):s]) is not None) or (k in o.get('int', []) and isint) or (not isint and not why and k not in o.get('skip', []))
        if k in o.get('skip', []) or t in o.get('skipv', []): do = False
        lines.setdefault(L, []).append((k, t, '*' if do else ('-' if why else ' '), why))
        if do and t not in ('0', '0.0'):
            v = (Decimal(t) * F).normalize(); r = format(v, 'f'); r = r if '.' in r or 'e' in r else r
            out.append(src[pos:s]); out.append(r); pos = e
    out.append(src[pos:]); new = ''.join(out)
    n = sum(1 for v in lines.values() for x in v if x[2] == '*')
    print(f'{path}: {n} literals scaled on {len(lines)} lines')
    if listout:
        with open(listout, 'w', encoding='utf-8', newline='\n') as fo:
            for L in sorted(lines):
                fo.write(f'{L}: ' + ' '.join(f'{k}[{m}]{t}' + (f'({w})' if w else '') for k, t, m, w in lines[L]) + '\n')
    if write: pathlib.Path(path).write_bytes(new.encode('utf-8'))
if __name__ == '__main__':
    a = sys.argv; arg = lambda k, d=None: a[a.index(k) + 1] if k in a else d
    run(a[1], json.loads(pathlib.Path(a[2]).read_text(encoding='utf-8')), arg('--f', '1.117'), '--write' in a, arg('--list'))
