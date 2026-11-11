"""wempe_sheetcheck.py: the Wempe parts audit's sheet figures as a check (11 November 2026). The audit (WEMPE-PARTS-LEDGER.md, 3 November 2026) read every
works drawing against the parts and wrote 1,670 verdicts as text; `recipes.py --check` ties each recipe's solid to the page's mesh, but both read
wempe/js/dims.js, so a number there drifting from its sheet passed everything until the next audit. This tool holds the audited figures in a ledger,
marine-chronometer-source/wempe/parts-audit/sheetcheck.json, and measures them again on the recipes' exact solids (wempe_measure.py's reader, no browser).

    python wempe_sheetcheck.py [--jobs N] [--only part,...] [--measured DIR] [-v]     the check (about 2 minutes on 6 processes; exit 1 on a failure; --jobs default MC_PROCS or 8;
                                                   -v lists every item with what it measures; --measured: wempe_measure.py's KEY.json files in place of building)
    python wempe_sheetcheck.py --update            after an intended change: rewrite each moved item's `was` (never its limits) and say what moved
    python wempe_sheetcheck.py --fault [move]      the planted fault, which must fail: the pillars' body (dims.js PIL r, 05 08 00-1's 8,1 -0,2, drawn 8.0) 0.3 large,
                                                   outside its limits; `move`: 0.06 large, inside them and no longer where the audit found it
    python wempe_sheetcheck.py --sweep [--jobs N] [--scope dims|esc|all] [--grep RE] [--limit N] [--json OUT] [--resume FILE]   the coverage sweep (slow: about an hour on 10 processes; not run by ci.py)
    python wempe_sheetcheck.py --derive [OUT] [--measured DIR] [--why ID]   the ledger made again from the audit's batchNN.items.tsv (how it was first made, below),
                                                   into OUT (default tools/r_wpa/sheetcheck.derived.json, ignored), to compare with the ledger before anything
                                                   replaces it; entries marked "by": "hand" are kept; --why ID traces one row: its figure, the candidates and
                                                   their scores; about 3 minutes, every solid measured at every level
    python wempe_sheetcheck.py --stats             the ledger's counts: checked, by how; not checked, by reason

The ledger. `items`: one entry per audited item that a machine can measure: its id in the audit (batch-sheet-item), sheet, what the size attaches to, the
figure as read (`drawn`), `nom`, `lo` and `hi` (the printed tolerance: `lim` printed; the audit's fallback where none is printed, +-0.05 to 6 mm, +-0.1 to
30, +-0.15 to 120, +-0.2 above: `fallback`; a figure scaled off the sheet, as far as the scan allowed: `scaled`; a hole table's coordinate, as tabulated:
`table`), `how` it is measured, and `was`, what it measured when the entry was written. `how` names a feature by what it is, never by its place in a list:
  {"m":"cyl","part":K,"kind":"inside|outside","ax":"z"|[dx,dy,dz],"at":[x,y],"z":[a,b],"about":d,"q":"d|len|r|x|y|z0|z1"}   the cylinder of that kind on that
        axis at that place whose span overlaps a..b most, and of several coaxial there (a wheel's bore and its rim's inside) the one about that size
        (q: its diameter, its span's length, its axis's distance from the origin, its place, its ends)
  {"m":"cc","part":K,"a":{...},"b":{...}}                              the distance between two such cylinders' axes
  {"m":"cone","part":K,"at":[x,y],"z":[a,b],"about":d,"q":"d0|d1|half|len"}   the cone there (of several, the one whose large end is about d): its small
        and large diameters, half angle, length
  {"m":"teeth","part":K,"z":z,"q":"count|tips_d|roots_d|depth"}        the toothed rim at the level nearest z
  {"m":"size","part":K,"i":0|1|2}, {"m":"box","part":K,"i":0..5}       the solid's box
  {"m":"dz","part":K,"z":[a,b]}, {"m":"level","part":K,"z":a}          the distance between the faces at the levels nearest a and b; a face's level
  {"m":"arc","part":K,"level":z,"c":[x,y],"r":r,"q":"r|cx|cy|cr"}      the outline's arc on that level's face nearest that centre and radius
  {"m":"line","part":K,"level":z,"mid":[x,y],"ax":"x|y","q":"len|x|y"}  the straight edge on that level's face whose middle is nearest mid: its length, or
        (an edge of constant x or y) where it stands
  {"m":"gap","part":K,"level":z,"ax":"x|y","mids":[[x,y],[x,y]]}       the distance between two such edges (a slot's or an arm's width)
An item with several features (four equal holes) lists them all in `how`; each must pass.
`status` match: the measurement must stay inside lo..hi (FAIL outside) and where it was (MOVED: a change of more than 0.002 mm inside the limits is
still a drift from the audited part; --update accepts it after it is looked at). `status` departure: the audit found the part outside the sheet and the
owner kept it or it was explained (`why`, the finding in parts-audit/FINDINGS-EXPLAINED.md): reported `~~`, never failed while it stays where it was;
moved, it fails either way (a kept clash that changes is a new decision; one that now meets its sheet wants its entry made a match by hand).
`unchecked`: every other audited item, with the reason no machine checks it (cant-tell: the audit could not; no-figure: a label, a note, a hand, a
material; page: measured on the page's meshes or placements, which need the browser; derived: the audit worked it out by hand from one feature or
several (an angle between two holes, a face's height over a hole's axis), or its value is no longer on the solid (a part corrected since); several:
several figures in one item that don't divide; ambiguous: more than one feature of the solid fits the row; inside: the audit called it a mismatch
and by the limits read here it is not one; not-built, extra, n/a: nothing to hold).

The sweep. Every numeric literal of dims.js (--scope esc: of the tables escapement.js gives the recipes too) is nudged in turn by about a tolerance
(0.06 to 6 mm, 0.12 to 30, 0.18 to 120, 0.25 above, a fifth of a value under 0.3, a count by one; the other way too where an item only moved or a
recipe broke), in the source as
Node reads it (wempe_nudge.js preloaded: the file on disk is never touched), every recipe made again, and each whose operations changed built and
measured: `limits` an item left its limits, `moved` an item moved inside them (the check fails either way), `unguarded` a solid changed and no item
noticed, `breaks` the recipe no longer builds, `nosolid` the recipes read it but no solid changed (a placement, a sheet's text), `unread` no recipe
reads it. Subscripts, numbered keys, exponents, loop bounds and the small whole factors of a product (2*r) are left out. Which recipes to build is
found by making every recipe again and comparing its operations (what each cuts: numbers, closures and solids walked, _sig; not its place on the page or
its sheet's words) with the base's; a recipe that reads its numbers only as it builds is built whenever any reader's answer changed (none does today).
--resume FILE takes an earlier run's results (its .part.json, written every 100 literals, or its sweep.json) for the literals it settled. For speed the readers run without the escapement in time (wempe_nudge.js's
MC_WNUDGE_NOPHYS; the sweep first checks they answer the same with it). Writes tools/r_wpa/sweep.json (ignored) and prints the unguarded numbers with
their line in dims.js.

How the ledger was first made (--derive, 11 November 2026). Each audit row (batchNN.items.tsv: item, drawn, field, built, delta, the verifier's verdict
where it gave one) is read so: the drawn figure and its tolerance are parsed (an explicit range, +a/-b, a fit's ISO 286 limits, else the fallback); the
built value is looked for among every scalar of the measured part (quantities()), and the candidates of that value are scored by the row's own words: the
kind of feature it names, its place in the list (a hint only: lists shift), the attribute, inside or outside, and the other numbers in the row that
describe the candidate (its centre, its span). One candidate must lead, or the equal ones be the same feature named together; else the row stays
unchecked (ambiguous). A plate hole's row, "hole 47 ... (N31.551 W22.924)", gives its place along O and N as tabulated (+-0.005) and each diameter it
prints. A match whose solid is outside the parsed limits, or a mismatch inside them, stays unchecked and is printed for a look. The pairing is by value
and words, so a few entries hold a feature of the right value under the wrong item's name (4 found among 139 read by eye and their rules tightened,
none among 40 more); DROP lists rows paired wrongly that no rule catches."""
import argparse,collections,json,math,os,pathlib,re,subprocess,sys,time
HERE=pathlib.Path(__file__).resolve().parent;ROOT=HERE.parents[2];WE=ROOT/'marine-chronometer-source'/'wempe';REP=WE/'parts-audit';LED=REP/'sheetcheck.json'
TOL=0.002   # mm (and degrees, and teeth): a measurement farther than this from `was` has moved
def r4(x):return round(float(x),4)

# ---------------------------------------------------------------- measuring
def teeth_at(p,z):
    """wempe_measure.py's teeth_at (a toothed rim in the section at z: count, tips, roots, depth), its outline walked through OpenCascade's own curves: the
    same points, a few hundred times faster than an edge's position_at() called 70,000 times (a wheel's section took minutes; the two agree to 0.0005)"""
    import build123d as bd,numpy as np
    from OCP.BRepAdaptor import BRepAdaptor_Curve
    try:sec=p&bd.Face.make_rect(400,400,bd.Plane.XY.offset(z))
    except Exception:return None
    if sec is None or not sec.faces():return None
    out=[]
    for f in sorted(sec.faces(),key=lambda f:-f.area)[:2]:
        E=[]
        for e in f.outer_wire().edges():
            c=BRepAdaptor_Curve(e.wrapped);a,b=c.FirstParameter(),c.LastParameter();A=c.Value(a);B=c.Value(b);E.append((c,a,b,(A.X(),A.Y()),(B.X(),B.Y()),e.length))
        if len(E)<18:continue
        cur=E.pop(0);seq=[(cur,False)];end=cur[4]
        while E:
            k=min(range(len(E)),key=lambda i:min(math.dist(E[i][3],end),math.dist(E[i][4],end)));e=E.pop(k);rev=math.dist(e[4],end)<math.dist(e[3],end);seq.append((e,rev));end=e[3] if rev else e[4]
        P=[]
        for (c,a,b,_,_,ln),rev in seq:
            n=max(2,int(ln/0.005))
            for t in range(n):
                q=c.Value(a+(b-a)*((1-t/n) if rev else t/n));P.append((q.X(),q.Y()))
        P=np.array(P);c0=P.mean(0) if np.hypot(*P.mean(0))>0.5 else np.zeros(2);R=np.hypot(P[:,0]-c0[0],P[:,1]-c0[1]);ro,ri=R.max(),R.min()
        if ro-ri<0.05:continue
        lo,hi=ri+0.3*(ro-ri),ri+0.7*(ro-ri);st=None;n=0
        for x in np.concatenate([R,R]):
            if x<lo:st=0
            elif x>hi and st==0:n+=1;st=1
        n//=2
        if n>=6:out.append({'z':r4(z),'count':n,'centre':[r4(c0[0]),r4(c0[1])],'tips_d':r4(2*ro),'roots_d':r4(2*ri),'depth':r4(ro-ri)})
    return out
def lite(M,r,p,need):
    """wempe_measure.py's measurement of a built solid, with only what the ledger's items on it read: the faces always; the outlines and the teeth (the slow
    parts: a wheel's rim sectioned and walked at every level took minutes) only at the levels asked, need {'outline': [z...], 'teeth': [z...]}, or at
    every level, need {'all': 1} (--derive)"""
    bb=p.bounding_box();cyl,cone,tor,planes=M.faces_info(p)
    J={'key':r.key,'box':[r4(bb.min.X),r4(bb.min.Y),r4(bb.min.Z),r4(bb.max.X),r4(bb.max.Y),r4(bb.max.Z)],'size':[r4(bb.size.X),r4(bb.size.Y),r4(bb.size.Z)],'volume_mm3':r4(p.volume),
       'z_levels':planes,'cylinders':cyl,'cones':cone,'outlines_by_level':{},'teeth':[],'section_y0':[]}
    for z in (planes if need.get('all') else sorted({_near(planes,z,0.2) for z in need.get('outline',())}-{None})):J['outlines_by_level'][str(z)]=M.outline(p,z)
    zs=sorted(set(planes)|{bb.min.Z,bb.max.Z});I=[(a,b) for a,b in zip(zs,zs[1:]) if b-a>0.02];done=set()
    for z in ([(a+b)/2 for a,b in I] if need.get('all') else need.get('teeth',())):   # the interval between faces that holds z (wempe_measure.py sections each at its middle), else the nearest
        if not I:break
        a,b=min(I,key=lambda ab:0 if ab[0]<=z<=ab[1] else min(abs(z-ab[0]),abs(z-ab[1])))
        if (a,b) not in done:done.add((a,b));J['teeth']+=teeth_at(p,(a+b)/2) or []
    return J
def _measure_one(a):
    """one recipe built and measured (no picture): (key, the measurement or None for a bought line, the error)"""
    k,need=a if isinstance(a,tuple) else (a,None)
    os.environ.setdefault('MC_MODEL','wempe');sys.path.insert(0,str(HERE))
    import wempe_measure as M
    from recipes import wempe as W
    try:
        mk=W.RECIPES[k];r=mk() if callable(mk) else mk
        if not hasattr(r,'build'):return k,None,None
        calls=[];put=[]
        if need and 'probe' in need:   # does the recipe read the page's numbers while it builds (not only while it is made)? the sweep must know
            for name,f,where in _loaders():
                w=(lambda *a,_f=f,_n=name,**kw:(calls.append(_n),_f(*a,**kw))[1])
                for m,an in where:setattr(m,an,w);put.append((m,an,f))
        try:p=r.build()
        finally:
            for m,an,f in put:setattr(m,an,f)
        J=M.measure(r,p) if need is None else lite(M,r,p,need)
        if need and 'probe' in need:J['reads']=sorted(set(calls))
        return k,J,None
    except Exception as e:return k,None,f'{type(e).__name__}: {e}'
def needs(L):
    """{part: what its items read beyond the faces}: {'outline': the levels whose outlines (arcs, edges, slots) they read, 'teeth': the levels of their toothed rims}"""
    N={}
    for e in L['items']:
        for h in hows(e):
            d=N.setdefault(h['part'],{})
            if h['m'] in ('arc','line','gap'):d.setdefault('outline',set()).add(h['level'])
            if h['m']=='teeth':d.setdefault('teeth',set()).add(h['z'])
    return N
def measure(keys,jobs=1,src=None,need=None):
    """{key: measurement}, {key: error}: read from src (wempe_measure.py's KEY.json files) or built now (need: {key: what to measure}, see lite; all of it without)"""
    J={};bad={}
    if src:
        for k in keys:
            f=pathlib.Path(src)/f'{k}.json'
            if f.exists():J[k]=json.loads(f.read_text(encoding='utf-8'))
            else:bad[k]='no measurement file'
        return J,bad
    if need is not None:keys=[(k,need.get(k,{})) for k in keys]
    if jobs>1:
        from concurrent.futures import ProcessPoolExecutor
        with ProcessPoolExecutor(jobs) as ex:res=list(ex.map(_measure_one,keys,chunksize=1))
    else:res=[_measure_one(k) for k in keys]
    for k,j,e in res:
        if e:bad[k]=e
        elif j is not None:J[k]=j
    return J,bad

# ---------------------------------------------------------------- features by what they are
def _ax(c):return c.get('axis') or [0,0,1]
def _axial(a):return a=='z' or abs(abs(a[2])-1)<1e-6
def _par(a,b):return abs(sum(x*y for x,y in zip(a,b)))>0.9995
def _span(c):return c.get('z') or c.get('along_axis')
def _ov(a,b):
    """overlap of two spans over their union (1 the same span); a degenerate span counts by nearness"""
    lo=max(a[0],b[0]);hi=min(a[1],b[1]);u=max(a[1],b[1])-min(a[0],b[0])
    return (hi-lo)/u if u>1e-9 else (1.0 if abs(a[0]-b[0])<1e-6 else 0.0)
def find_cyl(J,h,RAD=0.3):
    ax=[0,0,1] if h.get('ax','z')=='z' else h['ax'];C=[]
    for c in J['cylinders']:
        if c['kind']!=h['kind'] or not _par(_ax(c),ax):continue
        if len(c['at'])!=len(h['at']):continue
        if len(c['at'])==2:d=math.dist(c['at'],h['at'])
        else:   # an axis across Z: the distance between the two lines' points, taken square to the axis
            w=[p-q for p,q in zip(c['at'],h['at'])];t=sum(x*y for x,y in zip(w,ax));d=math.sqrt(max(0,sum(x*x for x in w)-t*t))
        if d>RAD:continue
        o=_ov(_span(c),h['z'])
        if o>0.2:C.append((o,d,c))
    if not C:return None
    om=max(o for o,_,_ in C);C=[x for x in C if x[0]>=om-0.15]   # coaxial cylinders over the same span (a wheel's bore and its rim's inside): the one about that size
    return min(C,key=lambda x:(abs(x[2]['d']-h['about']),-x[0],x[1]) if 'about' in h else (-x[0],x[1]))[2]
def find_cone(J,h,RAD=0.3):
    C=[]
    for c in J['cones']:
        if c.get('at') is None or math.dist(c['at'],h['at'])>RAD:continue
        o=_ov(c['z'],h['z'])
        if o>0.2:C.append((o,math.dist(c['at'],h['at']),c))
    if not C:return None
    om=max(o for o,_,_ in C);C=[x for x in C if x[0]>=om-0.15]   # coaxial cones over the same span (a chamfer inside and one outside): the one about that size
    return min(C,key=lambda x:(abs(max(x[2]['d'])-h['about']),-x[0],x[1]) if 'about' in h else (-x[0],x[1]))[2]
def _near(L,z,R=0.3):
    c=[x for x in L if abs(x-z)<=R];return min(c,key=lambda x:abs(x-z)) if c else None
def find_arc(J,h):
    o=J['outlines_by_level'];k=_near([float(x) for x in o],h['level']);best=None
    if k is None:return None
    lv=o[[x for x in o if abs(float(x)-k)<1e-9][0]]
    for a in lv['arcs']+lv['circles']:
        d=math.dist(a['c'],h['c'])+abs(a['r']-h['r'])
        if d<=0.5 and (best is None or d<best[0]):best=(d,a)
    return best and best[1]
def get(J,h):
    """the measurement h asks for on the solid's measurement J, or None when its feature is not there"""
    m=h['m']
    if m=='size':return J['size'][h['i']]
    if m=='box':return J['box'][h['i']]
    if m=='cyl':
        c=find_cyl(J,h)
        if c is None:return None
        q=h['q'];s=_span(c)
        return {'d':c['d'],'len':r4(s[1]-s[0]),'r':c.get('from_origin'),'x':c['at'][0],'y':c['at'][1],'z0':s[0],'z1':s[1]}[q]
    if m=='cone':
        c=find_cone(J,h)
        if c is None:return None
        d=sorted(c['d']);return {'d0':d[0],'d1':d[-1],'half':c['half_angle_deg'],'len':r4(c['z'][1]-c['z'][0])}[h['q']]
    if m=='teeth':
        T=[t for t in J['teeth'] if abs(t['z']-h['z'])<=1.0]
        if not T:return None
        return min(T,key=lambda t:abs(t['z']-h['z']))[h['q']]
    if m=='level':return _near(_Z(J),h['z'],0.2)
    if m=='dz':
        a=_near(_Z(J),h['z'][0],0.2);b=_near(_Z(J),h['z'][1],0.2)
        return None if a is None or b is None or a==b else r4(abs(b-a))
    if m=='arc':
        a=find_arc(J,h)
        if a is None:return None
        return {'r':a['r'],'cx':a['c'][0],'cy':a['c'][1],'cr':r4(math.hypot(*a['c']))}[h['q']]
    if m=='cc':
        a=find_cyl(J,{**h['a'],'ax':'z'});b=find_cyl(J,{**h['b'],'ax':'z'})
        return None if a is None or b is None or a is b else r4(math.dist(a['at'],b['at']))
    if m=='line':
        l=find_line(J,h['level'],h['mid'],h.get('ax') if h['q'] in ('x','y') else None)
        return None if l is None else {'len':l['len'],'x':l['from'][0],'y':l['from'][1]}[h['q']]
    if m=='gap':
        i=0 if h['ax']=='x' else 1;a=find_line(J,h['level'],h['mids'][0],h['ax']);b=find_line(J,h['level'],h['mids'][1],h['ax'])
        return None if a is None or b is None or a is b else r4(abs(a['from'][i]-b['from'][i]))
    raise ValueError(m)
def _Z(J):return sorted(set(J['z_levels'])|{J['box'][2],J['box'][5]})   # the faces square to Z, and the solid's two ends (a domed or pointed end has no face)
def _lines(J,level):
    o=J['outlines_by_level'];k=_near([float(x) for x in o],level,0.2)
    return [] if k is None else [l for l in o[[x for x in o if abs(float(x)-k)<1e-9][0]]['lines'] if 'curve' not in l]
def _lmid(l):return [(l['from'][0]+l['to'][0])/2,(l['from'][1]+l['to'][1])/2]
def find_line(J,level,mid,ax=None,RAD=0.6):
    """the straight edge on that level's face whose middle is nearest mid (ax 'x': an edge of constant x, 'y': of constant y)"""
    best=None
    for l in _lines(J,level):
        if ax and abs(l['from'][0 if ax=='x' else 1]-l['to'][0 if ax=='x' else 1])>1e-4:continue
        d=math.dist(_lmid(l),mid)
        if d<=RAD and (best is None or d<best[0]):best=(d,l)
    return best and best[1]
def hows(e):return e['how'] if isinstance(e['how'],list) else [e['how']]
def judge(e,J):
    """one ledger item against the measurements: (state, values, text); state ok, kept (a departure where it was), FAIL, MOVED, GONE (feature not found), NOPART"""
    V=[];W=e['was'] if isinstance(e['was'],list) else [e['was']]
    for h in hows(e):
        if h['part'] not in J:return 'NOPART',None,f"{h['part']} was not measured"
        V.append(get(J[h['part']],h))
    if any(v is None for v in V):return 'GONE',V,'its feature is not on the solid where the ledger has it'
    mv=[(v,w) for v,w in zip(V,W) if abs(v-w)>TOL]
    if e['status']=='departure':
        if mv:return 'MOVED',V,f"a kept departure moved: was {W if len(W)>1 else W[0]}, now {V if len(V)>1 else V[0]}"
        return 'kept',V,''
    out=[v for v in V if v<e['lo']-1e-6 or v>e['hi']+1e-6]
    if out:return 'FAIL',V,f"{out[0]} outside {e['lo']}..{e['hi']} ({e['lim']})"
    if mv:return 'MOVED',V,f"moved inside its limits: was {mv[0][1]}, now {mv[0][0]} ({e['lo']}..{e['hi']})"
    return 'ok',V,''
def parts_of(L,only=None):
    K=sorted({h['part'] for e in L['items'] for h in hows(e)});return [k for k in K if not only or k in only]

def check(L,J,bad,only=None,verbose=False,out=print):
    n=collections.Counter();F=[]
    for e in L['items']:
        if only and not any(h['part'] in only for h in hows(e)):continue
        st,V,txt=judge(e,J)
        if st=='NOPART' and any(h['part'] in bad for h in hows(e)):txt=f"{[h['part'] for h in hows(e) if h['part'] in bad][0]} does not build: {bad[[h['part'] for h in hows(e) if h['part'] in bad][0]]}"
        n[st]+=1
        if st in ('FAIL','MOVED','GONE','NOPART'):F.append((st,e,txt))
        elif verbose:out(f"  {'~~' if st=='kept' else 'ok'} {e['id']:10s} {e['sheet']:12s} {e['item'][:70]}: {V if len(V)>1 else V[0]}"+(f"  (drawn {e['drawn'][:40]}; {e.get('why','')[:60]})" if st=='kept' else ''))
    for st,e,txt in F:out(f"  {st:6s} {e['id']:10s} sheet {e['sheet']}: {e['item'][:80]} (drawn {e['drawn'][:50]}): {txt}")
    out(f"{sum(n.values())} sheet figures on {len({h['part'] for e in L['items'] for h in hows(e) if not only or h['part'] in only})} parts: {n['ok']} inside their limits and where the audit found them, "
        f"{n['kept']} kept departures (~~), {n['FAIL']} outside, {n['MOVED']} moved, {n['GONE']+n['NOPART']} not found")
    return F,n

# ---------------------------------------------------------------- deriving the ledger from the audit's rows (how it was first made)
NUM=r'[-+]?\d+(?:\.\d+)?'
def fallback(n):
    n=abs(n);return 0.05 if n<=6 else 0.1 if n<=30 else 0.15 if n<=120 else 0.2
# ISO 286 limits (um) for the fits the sheets use, by size range (over, to]: deviations (upper, lower) of the size
_R=[(0,3),(3,6),(6,10),(10,18),(18,30),(30,50),(50,80),(80,120)]
_IT={5:[4,5,6,8,9,11,13,15],6:[6,8,9,11,13,16,19,22],7:[10,12,15,18,21,25,30,35],8:[14,18,22,27,33,39,46,54],9:[25,30,36,43,52,62,74,87],11:[60,75,90,110,130,160,190,220]}
_FD={'f':[-6,-10,-13,-16,-20,-25,-30,-36],'g':[-2,-4,-5,-6,-7,-9,-10,-12],'e':[-14,-20,-25,-32,-40,-50,-60,-72],'d':[-20,-30,-40,-50,-65,-80,-100,-120]}   # shafts: the upper deviation
_LD={'k6':[0,1,1,1,2,2,2,3],'n6':[4,8,10,12,15,17,20,23],'p6':[6,12,15,18,22,26,32,37],'m6':[2,4,6,7,8,9,11,13],'r6':[10,15,19,23,28,34,41,51],'s6':[14,19,23,28,35,43,53,71]}   # shafts: the lower deviation
def iso_fit(n,sym):
    """(lo, hi) of size n with the fit sym (H7, h6, f7, n6...), or None"""
    m=re.fullmatch(r'([A-Za-z]{1,2})(\d{1,2})',sym)
    if not m:return None
    L,g=m.group(1),int(m.group(2));i=next((i for i,(a,b) in enumerate(_R) if a<n<=b),None)
    if i is None or g not in _IT:return None
    it=_IT[g][i]/1000
    if L=='H':return n,n+it
    if L=='h':return n-it,n
    if L=='js' or L=='JS':return n-it/2,n+it/2
    if L in _FD:es=_FD[L][i]/1000;return n+es-it,n+es
    if L+str(g) in _LD:ei=_LD[L+str(g)][i]/1000;return n+ei,n+ei+it
    return None
def clean(s):
    s=re.sub(r'(?<=\d),(?=\d)','.',(s or '').replace('\ufffd',' ').replace('Ø',' ').replace('ø',' ').replace('−','-').replace('–','-').replace('±','+-'))
    return re.sub(r'\.\.+',' .. ',s)
def parse_drawn(s):
    """the drawn figure as (nom, lo, hi, lim) or None: an explicit range, a printed tolerance or fit, else the audit's fallback (scaled when the reader scaled it)"""
    s0=clean(s);low=s0.lower()
    if re.search(r'\bM\s?\d',s0) or 'deg' in low and re.search(r"\d\s*(?:deg|°)\s*\d+'?",low):return None   # a thread's name; an angle in degrees and minutes: by hand
    s1=re.sub(r'\b(?:sure|likely|unsure|moderately|scaled|read|fertig|about|approx\.?|dia|diameter|radius|mm)\b',' ',low)
    scaled='scaled' in low or 'about' in low or 'approx' in low
    s1=re.sub(r'\(\s*([-+][^()]*)\)',r' \1 ',s1)   # a tolerance in brackets: 4.4 (+0.012)
    pm=re.search(r'\(([^()]*?)(\+-\s*\d+(?:\.\d+)?)\s*\)',s1)   # ... or at the end of a bracketed remark: 1.38 (63 px at 45.6; +-0.1)
    if pm and not re.match(r'\s*[^\d+-]*?\d+(?:\.\d+)?\s*[-+]',s1):s1=s1[:pm.start()]+' '+pm.group(2)+' '+s1[pm.end():]
    s1=re.sub(r'^(\s*[^\d+-]*?\d+(?:\.\d+)?)\s*[a-z]{1,2}\d{1,2}\s*(?=[-+]\s*\d)',r'\1 ',s1)   # a fit's letter before its printed deviation: the deviation is the figure (1.5 H7 +0.009)
    N=re.findall(NUM,re.sub(r'[a-z]\d+','',s1))
    m=re.search(rf'(\d+(?:\.\d+)?)\s*(?:\.\.+|\bto\b)\s*\+?(\d+(?:\.\d+)?)',s1)
    if not m:m=re.search(rf'(?<![\d.])(\d+\.\d+)(?:-| - )(\d+\.\d+)(?![\d.])',s1)   # 103.5-103.6: a range written with a dash (both with decimals, the second larger)
    if m:
        a,b=float(m.group(1)),float(m.group(2))
        if a<b and b-a<=max(0.6,0.12*abs(b)):
            lead=re.match(rf'\s*[^\d+-]*?(\d+(?:\.\d+)?)',s1);n=float(lead.group(1)) if lead and a-1e-9<=float(lead.group(1))<=b+1e-9 else None
            if n is None:
                lead2=re.match(rf'\s*[^\d+-]*?(\d+(?:\.\d+)?)',s1);v=float(lead2.group(1)) if lead2 else None
                n=v if v is not None and abs(v-(a+b)/2)<=max(1.0,b-a)*1.5 else (a+b)/2
            return n,a,b,'printed'
    m=re.match(rf'\s*[^\d+-]*?(\d+(?:\.\d+)?)\s*(.*)',s1)
    if not m:return None
    n=float(m.group(1));rest=m.group(2)
    t=re.match(r'\+-\s*(\d+(?:\.\d+)?)',rest) or re.match(r'\+/-\s*(\d+(?:\.\d+)?)',rest)
    if t:d=float(t.group(1));return n,n-d,n+d,'printed'
    t=re.match(r'\+\s*(\d+(?:\.\d+)?)\s*[/ ]\s*-\s*(\d+(?:\.\d+)?)',rest)
    if t:return n,n-float(t.group(2)),n+float(t.group(1)),'printed'
    t=re.match(r'-\s*(\d+(?:\.\d+)?)\s*[/ ]\s*\+\s*(\d+(?:\.\d+)?)',rest)
    if t:return n,n-float(t.group(1)),n+float(t.group(2)),'printed'
    t=re.match(r'-\s*(\d+(?:\.\d+)?)\s*[/ ]\s*-\s*(\d+(?:\.\d+)?)',rest)   # both deviations under: 2 -0.05/-0.1
    if t:a,b=sorted((float(t.group(1)),float(t.group(2))));return n,n-b,n-a,'printed'
    t=re.match(r'\+\s*(\d+(?:\.\d+)?)\s*/\s*\+\s*(\d+(?:\.\d+)?)',rest)   # both over: 2.6 +0.013/+0.006
    if t:a,b=sorted((float(t.group(1)),float(t.group(2))));return n,n+a,n+b,'printed'
    t=re.match(r'\+\s*(\d+(?:\.\d+)?)(?!\s*[\d])',rest)
    if t:return n,n,n+float(t.group(1)),'printed'
    t=re.match(r'-\s*(\d+(?:\.\d+)?)(?!\s*[\d])',rest)
    if t and float(t.group(1))<n:return n,n-float(t.group(1)),n,'printed'
    t=re.match(r'([a-zA-Z]{1,2}\d{1,2})\b',m.group(2) if False else clean(s)[clean(s).lower().find(m.group(1))+len(m.group(1)):].strip())
    if t:
        f=iso_fit(n,t.group(1))
        if f:return n,r4(f[0]),r4(f[1]),'printed'
    if len({float(x) for x in N})>1 and re.search(r'[;/x]|\band\b|,\s',rest):return 'several'
    d=0.5 if ('deg' in low or '°' in s0) else fallback(n);return n,n-d,n+d,'scaled' if scaled else 'fallback'   # an angle: the audit's +-30'

def quantities(K,J):
    """every scalar a ledger item can hold on a measured part: (how, value, type, index, the numbers that describe it)"""
    Q=[]
    for i,v in enumerate(J['size']):Q.append(({'m':'size','part':K,'i':i},v,'size',i,[]))
    for i,v in enumerate(J['box']):Q.append(({'m':'box','part':K,'i':i},v,'box',i,[]))
    for i,c in enumerate(J['cylinders']):
        s=_span(c);ax='z' if _axial(_ax(c)) else _ax(c);b={'m':'cyl','part':K,'kind':c['kind'],'ax':ax,'at':c['at'],'z':s,'about':c['d']};desc=list(c['at'])+list(s)+[c['d']]
        Q.append(({**b,'q':'d'},c['d'],'cyl',i,desc));Q.append(({**b,'q':'len'},r4(s[1]-s[0]),'cyl',i,desc))
        if ax=='z':
            if c.get('from_origin') and c['from_origin']>0.01:Q.append(({**b,'q':'r'},c['from_origin'],'cyl',i,desc))
            Q.append(({**b,'q':'z0'},s[0],'cyl',i,desc));Q.append(({**b,'q':'z1'},s[1],'cyl',i,desc))
    AC=[(i,c) for i,c in enumerate(J['cylinders']) if _axial(_ax(c)) and len(c['at'])==2 and (c['arc_deg'] or 0)>200]
    if len(AC)<=80:
        for n,(i,c) in enumerate(AC):
            for j,d in AC[n+1:]:
                v=r4(math.dist(c['at'],d['at']))
                if v>0.01:Q.append(({'m':'cc','part':K,'a':{'kind':c['kind'],'at':c['at'],'z':c['z'],'about':c['d']},'b':{'kind':d['kind'],'at':d['at'],'z':d['z'],'about':d['d']}},v,'cc',(i,j),c['at']+d['at']))
    for i,c in enumerate(J['cones']):
        if c.get('at') is None or len(c['d'])<1:continue
        d=sorted(c['d']);b={'m':'cone','part':K,'at':c['at'],'z':c['z'],'about':d[-1]};desc=list(c['at'])+list(c['z'])+d
        Q.append(({**b,'q':'d0'},d[0],'cone',i,desc));Q.append(({**b,'q':'d1'},d[-1],'cone',i,desc))
        if c.get('half_angle_deg') is not None:Q.append(({**b,'q':'half'},c['half_angle_deg'],'cone',i,desc))
        Q.append(({**b,'q':'len'},r4(c['z'][1]-c['z'][0]),'cone',i,desc))
    for i,t in enumerate(J['teeth']):
        for q in ('count','tips_d','roots_d','depth'):Q.append(({'m':'teeth','part':K,'z':t['z'],'q':q},t[q],'teeth',i,[t['z']]))
    for z,o in J['outlines_by_level'].items():
        z=float(z);AX={'x':[],'y':[]}
        for l in o['lines']:
            if 'curve' in l:continue
            mid=[r4(v) for v in _lmid(l)];desc=[z]+l['from']+l['to'];Q.append(({'m':'line','part':K,'level':z,'mid':mid,'q':'len'},l['len'],'line',None,desc))
            for i,ax in enumerate('xy'):
                if abs(l['from'][i]-l['to'][i])<1e-4 and l['len']>1e-3:Q.append(({'m':'line','part':K,'level':z,'mid':mid,'ax':ax,'q':ax},l['from'][i],'line',None,desc));AX[ax].append((l['from'][i],mid))
        for ax,LL in AX.items():
            if len(LL)>60:continue   # a toothed or knurled outline: its flats are not sizes
            for i,(a,ma) in enumerate(LL):
                for b,mb in LL[i+1:]:
                    if abs(a-b)>1e-3:Q.append(({'m':'gap','part':K,'level':z,'ax':ax,'mids':[ma,mb]},r4(abs(b-a)),'gap',None,[z,a,b]))
    Z=_Z(J)
    for a in Z:Q.append(({'m':'level','part':K,'z':a},a,'level',None,[a]))
    for i,a in enumerate(Z):
        for b in Z[i+1:]:Q.append(({'m':'dz','part':K,'z':[a,b]},r4(b-a),'dz',None,[a,b]))
    for z,o in J['outlines_by_level'].items():
        for a in o['arcs']+o['circles']:
            b={'m':'arc','part':K,'level':float(z),'c':a['c'],'r':a['r']};Q.append(({**b,'q':'r'},a['r'],'arc',None,[float(z)]+a['c']))
    return Q
TYPEW={'cyl':('cylinders','cylinder','cyl'),'cone':('cones','cone','chamfer','countersink'),'teeth':('teeth','tips','roots','tooth'),'size':('size',),'box':('box',),
       'dz':('z_levels','z_level','levels',' z ','z-','thick','height','length','span'),'level':('z_levels','level'),'arc':('outline','outlines','arc','arcs','circle'),
       'line':('line','lines','outline','outlines','edge'),'gap':('line','lines','outline','outlines','width','slot','notch','between')}
QW={'d':('.d',' d ','dia'),'len':('.z','span','length','deep','depth',' z',' len'),'r':('from_origin',),'z0':('.z',' z'),'z1':('.z',' z'),'d0':('.d',' d '),'d1':('.d',' d '),'half':('half_angle','half angle'),
    'count':('count',),'tips_d':('tips',),'roots_d':('roots',),'depth':('depth',),'x':(' x',),'y':(' y',)}
def idx_hints(T):
    H=collections.defaultdict(set)
    for m in re.finditer(r'(cylinders|cones|teeth)((?:\[[^\]]*\][,\s]*)+)',T):
        t={'cylinders':'cyl','cones':'cone','teeth':'teeth'}[m.group(1)]
        for g in re.findall(r'\[([^\]]*)\]',m.group(2)):
            for part in g.split(','):
                r=re.fullmatch(r'\s*(\d+)\s*(?:\.\.|-)\s*(\d+)\s*',part)
                if r:H[t]|=set(range(int(r.group(1)),int(r.group(2))+1))
                elif re.fullmatch(r'\s*\d+\s*',part):H[t].add(int(part))
    for m in re.finditer(r'size\s*\[(\d)\]|size\.?\s*([xyz])\b|box\s+([xyz])\b',T):
        H['size'].add(int(m.group(1)) if m.group(1) else 'xyz'.index(m.group(2) or m.group(3)))
    return H
def floats(s):return [float(x) for x in re.findall(r'(?<![\w.])'+NUM+r'(?![\w])',re.sub(r'\[\d+(?:\s*\.\.\s*\d+)?\]','',clean(s)))]
_QC={}
def resolve(r,keys,M,fig,dbg=None):
    """the feature an audit row measured, found again on today's solids by its value and the row's own words: (how list, was list) or a reason"""
    n,lo,hi,lim=fig;T=' '+clean((r.get('field') or '')+' ; '+(r.get('built') or '')).lower()+' ';item=clean(r.get('item') or '').lower()
    FB=floats(r.get('built') or '');FF=floats(r.get('field') or '');D=[abs(x) for x in floats(r.get('delta') or '')]
    if r['final']=='match':B=[b for b in FB+FF if lo-0.0006<=b<=hi+0.0006]
    else:B=[b for b in FB+FF if any(abs(abs(b-n)-d)<0.0016 for d in D)] or ([FB[0]] if len(FB)==1 and abs(FB[0]-n)<max(1.5,0.3*abs(n)) else [])
    if not B:return 'derived'
    H=idx_hints(T);best=[];others=[x for x in FB+FF if not any(abs(x-b)<0.0006 for b in B)];ccw=re.search(r'distance|between|centres|centers|apart|spacing',T+item+clean(r.get('ctx') or '').lower())
    TI=T+' '+item;rw=bool(re.search(r'from_origin|radius|pitch circle|\bon r\b|\br\s?\d|\d\s?r\b|(?:from|above|below|off) the (?:\w+ )?(?:centre|center|axis|origin|middle)',TI));lw=bool(re.search(r'\.z\b|\bz\s*\[|\bz\s*-?\d|deep|depth|length|long\b|high\b|height|thick|tief|lang',TI))
    for K in keys:
        if K not in M:continue
        if K not in _QC:_QC[K]=quantities(K,M[K])
        for how,v,t,i,desc in _QC[K]:
            if not any(abs(v-b)<0.0006 for b in B):continue
            if t=='cc':   # the distance between two holes' centres: only where the row names both by their places in the list
                if len(H.get('cyl',()))>=2 and set(i)<=H['cyl']:best.append((12 if ccw else 7,how,v,t,i))
                continue
            tw=any(w in T for w in TYPEW[t]);s=0;q=how.get('q')
            if t=='cyl' and ((q=='r' and not rw) or (q in ('len','z0','z1') and not lw)):continue   # a hole's distance from the axis, a span: only where the row speaks of one (a list index alone has paired a value with the wrong feature)
            if t=='cyl' and ccw and len(H.get('cyl',()))>=2:s-=6
            if t in ('cyl','cone','teeth') and H.get(t):s+=5 if i in H[t] else -3
            if t in ('size','box') and H.get('size'):s+=5 if (i if t=='size' else i%3) in H['size'] else -3
            if tw:s+=3
            if q and any(w in T for w in QW.get(q,())):s+=2
            if q in ('z0','z1','len') and t=='cyl' and '.d' in T and '.z' not in T:s-=3
            if t=='cyl' and (('inside' in T and how['kind']=='inside') or ('outside' in T and how['kind']=='outside')):s+=1
            if t=='cyl' and (('hole' in item or 'bore' in item or 'drill' in item) and how['kind']=='inside'):s+=1
            s+=min(4,sum(1 for d in set(round(abs(x),4) for x in desc) if any(abs(d-abs(o))<0.0011 for o in others)))
            if t in ('size','box') and not tw:s-=1
            if t in ('line','gap') and not tw:s-=2
            if len(keys)>1 and re.search(r'(?<![a-z0-9])'+re.escape(K.lower())+r'(?![a-z0-9])',T+item):s+=3
            best.append((s,how,v,t,i))
    if dbg is not None:dbg.extend(sorted(best,key=lambda b:-b[0])[:12]);dbg.append(('B',B,'hints',dict(H)))
    if not best:return 'derived'
    top=max(b[0] for b in best)
    if top<3:return 'derived'
    C=[b for b in best if b[0]==top]
    if len(C)>1:
        qn=lambda b:{'d0':'d','d1':'d'}.get(b[1].get('q'),b[1].get('q'))
        one=len({(b[3],qn(b),round(b[2],4),b[1]['part']) for b in C})==1;t=C[0][3]
        strip=lambda b,ks:json.dumps({k:v for k,v in b[1].items() if k not in ks},sort_keys=True)
        if one and t in ('arc','line') and len({strip(b,('level',)) for b in C})==1:C=[min(C,key=lambda b:b[1]['level'])]   # the same outline on the part's two faces
        elif one and t=='gap' and len({(b[1]['ax'],) for b in C})==1 and len({tuple(sorted(round(abs(m[0 if b[1]['ax']=='y' else 1]),3) for m in b[1]['mids'])) for b in C})<=2:C=[min(C,key=lambda b:(b[1]['level'],json.dumps(b[1])))]   # one slot's two walls, taken at either end or face
        elif one and t in ('cyl','cone') and len(C)<=12 and (not H.get(t) or all(b[4] in H[t] for b in C)):pass   # equal features named together (four holes, both pivots): each is held
        elif t=='cone' and len({strip(b,('q',)) for b in C})==1 and {b[1]['q'] for b in C}<={'d0','d1'}:pass   # a taper's two ends, both in the figure's limits: both held
        else:
            # the same face read several ways (a size, the distance between the two end levels, a bore's length through it): the plainest is as good
            pref={'size':0,'dz':1,'cyl:len':2,'cone:len':3,'box':4,'level':5,'cyl:z1':6,'cyl:z0':6};rk=lambda b:pref.get(b[3]+(':'+b[1]['q'] if b[3] in ('cyl','cone') else ''))
            if len({round(b[2],4) for b in C})==1 and all(rk(b) is not None for b in C) and len({b[1]['part'] for b in C})==1 and sum(1 for b in C if rk(b)==min(map(rk,C)))==1:C=[min(C,key=rk)]
            else:C=None
        if not C:return 'ambiguous'
    return [b[1] for b in C],[b[2] for b in C]

def findings():
    """item id -> the finding's heading in FINDINGS-EXPLAINED.md (A1. The escape wheel's place ...)"""
    F={};t=(REP/'FINDINGS-EXPLAINED.md').read_text(encoding='utf-8')
    for m in re.finditer(r'^### ([A-G]\d+)\. (.*)$',t,re.M):
        head=m.group(2);name=re.sub(r'\s*\([^()]*\d\d-\d+-[^()]*\)','',head).strip().rstrip('.')
        for rng in re.finditer(r'(\d\d-\d+-)(\d+) to (\d\d-\d+-)(\d+)',head):
            for i in range(int(rng.group(2)),int(rng.group(4))+1):F[f'{rng.group(1)}{i}']=f'{m.group(1)}. {name}'
        for i in re.findall(r'\d\d-\d+-v?\d+',head):F.setdefault(i,f'{m.group(1)}. {name}')
    return F
SEP=r'\s*(?:;|/(?!\s*[-+]\s*\d)|,\s|\band\b|\sx\s)\s*'   # where an item with several figures divides
def _keys(T,s,solid):
    named=[k for k in solid if re.search(r'(?<![A-Za-z0-9])'+re.escape(k)+r'(?![A-Za-z0-9])',T)]
    return named or [k for k in (s[5] if s else []) if k in solid]
def hole_rows(r,base,s,M):
    """a plate's table row, 'hole 47 ... (N31.551 W22.924)': its place as tabulated and each diameter the row gives, on the cylinders there"""
    m=re.search(r'\(\s*([NS])\s*(\d+(?:\.\d+)?)\s+([EOW])\s*(\d+(?:\.\d+)?)\s*[;,)]',base['item'])
    if not m:return None
    y=float(m.group(2))*(1 if m.group(1)=='N' else -1);x=float(m.group(4))*(-1 if m.group(3)=='W' else 1)
    T=(r.get('field') or '')+' '+(r.get('built') or '');out=[]
    for K in _keys(T,s,set(M)):
        if K not in ('topPlate','pillarPlate'):continue
        C=[c for c in M[K]['cylinders'] if c['kind']=='inside' and _axial(_ax(c)) and len(c['at'])==2 and math.dist(c['at'],(x,y))<0.011]
        if not C:continue
        c0=max(C,key=lambda c:c['z'][1]-c['z'][0]);b={'m':'cyl','part':K,'kind':'inside','ax':'z','at':c0['at'],'z':c0['z'],'about':c0['d']}
        for q,v,nm in (('x',x,'O'),('y',y,'N')):
            out.append({**base,'id':base['id']+'.'+q,'item':base['item']+f' [its place along {nm}]','nom':v,'lo':r4(v-0.005),'hi':r4(v+0.005),'lim':'table','how':{**b,'q':q},'was':c0['at'][0 if q=='x' else 1],'status':'match'})
        used=set();j=0
        for part in re.split(SEP,base['drawn']):
            f=parse_drawn(part)
            if not f or f=='several':continue
            n,lo,hi,lim=f;cc=[c for c in C if lo-1e-6<=c['d']<=hi+1e-6 and id(c) not in used]
            if not cc:continue
            c=min(cc,key=lambda c:abs(c['d']-n));used.add(id(c));j+=1
            out.append({**base,'id':base['id']+'.d'+('' if j==1 else str(j)),'item':base['item']+' [diameter]','drawn':part.strip(),'nom':n,'lo':r4(lo),'hi':r4(hi),'lim':lim,
                        'how':{'m':'cyl','part':K,'kind':'inside','ax':'z','at':c['at'],'z':c['z'],'about':c['d'],'q':'d'},'was':c['d'],'status':'match'})
        return out
    return None
DROP={'04-7-10':"the lower pivot's length: the solid has no face at its shoulder, and the only feature of that length is the upper pivot's (04-7-9 holds that)"}   # rows the derivation paired with the wrong feature, found by eye
def derive(M,keep=None,why=None):
    sys.path.insert(0,str(HERE));import wempe_parts_ledger as PL
    solid=set(M);FND=findings();items=[];un=[];review=[]
    for b in sorted({s[4] for s in PL.S if s[4]}):
        rows=[s for s in PL.S if s[4]==b]
        for r in PL.items(b):
            m=re.match(r'(\d\d)-(\d+)-',r['id']);s=rows[int(m.group(2))-1] if m and int(m.group(2))<=len(rows) else None
            base={'id':r['id'],'sheet':s[1] if s else (r.get('sheet') or ''),'item':clean(r.get('item') or '').strip(),'drawn':clean(r.get('drawn') or '').strip()}
            if keep:
                kept=[e for i,e in keep.items() if i==r['id'] or i.startswith(r['id']+'.')]
                if kept:items+=kept;continue
            fv=r['final'];dbg=[] if why==r['id'] else None
            def no(reason,extra=None):
                un.append({**base,'verdict':fv,'why':reason,**(extra or {})})
                if dbg is not None:print('  ->',reason,extra or '')
            if dbg is not None:print(json.dumps({k:r.get(k) for k in ('id','item','drawn','field','built','delta','final')},ensure_ascii=False,indent=1))
            if r['id'] in DROP:no('ambiguous',{'note':DROP[r['id']]});continue
            if fv=='cant':no('cant-tell');continue
            if fv in ('not built','extra','n/a','note'):no({'not built':'not-built','note':'n/a'}.get(fv,fv));continue
            if r.get('new'):no('derived');continue   # the verifier's own items name no field
            T=(r.get('field') or '')+' '+(r.get('built') or '')
            if fv=='match':
                hr=hole_rows(r,base,s,M)
                if hr:items+=hr;continue
            if re.search(r'placements|\bpage\b|y_levels|sections_square|rays_from',T) or (s and any(h in T for h in s[6]) and not any(re.search(r'(?<![A-Za-z0-9])'+re.escape(k)+r'(?![A-Za-z0-9])',T) for k in solid)):no('page');continue
            fig=parse_drawn(r.get('drawn'))
            if dbg is not None:print('  figure:',fig)
            if fig is None:no('no-figure');continue
            keys=_keys(T,s,solid)
            if not keys:no('page' if s and s[6] else 'derived');continue
            def entry(rr,fig,eid,drawn):
                res=resolve(rr,keys,M,fig,dbg)
                if dbg is not None:
                    for x in dbg:print('   ',x)
                    del dbg[:]
                if isinstance(res,str):return res
                hw,was=res;n,lo,hi,lim=fig
                e={**base,'id':eid,'drawn':drawn,'nom':n,'lo':r4(lo),'hi':r4(hi),'lim':lim,'how':hw if len(hw)>1 else hw[0],'was':was if len(was)>1 else was[0],'status':'match' if fv=='match' else 'departure'}
                if fv=='match' and any(v<lo-1e-6 or v>hi+1e-6 for v in was):review.append(e);return 'derived'
                if fv!='match':
                    e['why']=FND.get(r['id'],'')+((' ' if FND.get(r['id']) else '')+'('+clean(r['vwhy'])[:200]+')' if r.get('vwhy') else '')
                    if all(lo-1e-6<=v<=hi+1e-6 for v in was):review.append(e);return 'inside'
                return e
            if fig=='several':
                pd=[p for p in re.split(SEP,base['drawn']) if re.search(r'\d',p)];pb=[p for p in re.split(SEP,clean(r.get('built') or '')) if re.search(r'\d',p)];got=0
                if fv=='match' and len(pd)==len(pb)>=2:
                    for j,(d_,b_) in enumerate(zip(pd,pb)):
                        f=parse_drawn(d_)
                        if not f or f=='several':continue
                        e=entry({**r,'built':b_,'ctx':r.get('built')},f,r['id']+'.'+'abcdefghij'[j],d_.strip())
                        if not isinstance(e,str):items.append(e);got+=1
                if not got:no('several')
                continue
            e=entry(r,fig,r['id'],base['drawn'])
            if isinstance(e,str):no(e,{'note':'the audit found it outside its sheet; by the limits read here the solid is inside'} if e=='inside' else None)
            else:items.append(e)
    return items,un,review

# ---------------------------------------------------------------- the ledger file
def load():return json.loads(LED.read_text(encoding='utf-8'))
def dump(L,f=None):
    out=['{',' "about": '+json.dumps(L['about'],ensure_ascii=False)+',',' "items": [']
    out+=['  '+json.dumps(e,ensure_ascii=False)+(',' if i<len(L['items'])-1 else '') for i,e in enumerate(L['items'])];out+=[' ],',' "unchecked": [']
    out+=['  '+json.dumps(e,ensure_ascii=False)+(',' if i<len(L['unchecked'])-1 else '') for i,e in enumerate(L['unchecked'])];out+=[' ]','}']
    (f or LED).write_text('\n'.join(out)+'\n',encoding='utf-8',newline='\n')
ABOUT=("The Wempe parts audit's sheet figures as a machine reads them (tools/wempe_sheetcheck.py, which explains every field; the audit: WEMPE-PARTS-LEDGER.md and this folder's "
       "batchNN.md). items: held on the recipes' exact solids. unchecked: every other audited item and why no machine holds it.")
def stats(L,out=print):
    n=len(L['items']);u=len(L['unchecked']);c=collections.Counter(e['status'] for e in L['items']);lim=collections.Counter(e['lim'] for e in L['items'] if e['status']=='match')
    hw=collections.Counter(hows(e)[0]['m']+('.'+hows(e)[0]['q'] if 'q' in hows(e)[0] else '') for e in L['items']);w=collections.Counter(e['why'] for e in L['unchecked'])
    out(f"{n+u} entries (the audit's {len({re.sub(r'[.][a-z0-9]+$','',e['id']) for e in L['items']+L['unchecked']})} items; a plate hole's place and sizes, and an item with several figures, are entries of their own): {n} checked ({c['match']} matches held to their limits: "+', '.join(f'{v} {k}' for k,v in lim.most_common())+f"; {c['departure']} departures held where they are), {u} not checked")
    out('  checked by: '+', '.join(f'{k} {v}' for k,v in hw.most_common()));out('  not checked: '+', '.join(f'{k} {v}' for k,v in w.most_common()))
    out(f"  parts with a checked figure: {len(parts_of(L))}")

# ---------------------------------------------------------------- the planted fault and the sweep's nudges
NUDGE=HERE/'wempe_nudge.js'
def nudge_env(nudges):
    """the environment in which every Node the recipes start reads dims.js (or escapement.js) with these literals replaced: [[file, offset, old text, new text], ...]"""
    e=dict(os.environ);e['MC_WNUDGE']=json.dumps(nudges);q='--require '+json.dumps(str(NUDGE).replace('\\','/'))
    if q not in e.get('NODE_OPTIONS',''):e['NODE_OPTIONS']=(e.get('NODE_OPTIONS','')+' '+q).strip()
    return e
def literals(f,rng=None):
    """every numeric literal of a script outside comments and strings: (offset, text, line, the words before it)"""
    s=f.read_text(encoding='utf-8');out=[];i=0;n=len(s);line=1
    while i<n:
        c=s[i]
        if c=='\n':line+=1;i+=1;continue
        if s.startswith('//',i):
            j=s.find('\n',i);i=n if j<0 else j;continue
        if s.startswith('/*',i):
            j=s.find('*/',i);j=n if j<0 else j+2;line+=s.count('\n',i,j);i=j;continue
        if c in '\'"`':
            j=i+1
            while j<n and s[j]!=c:j+=2 if s[j]=='\\' else 1
            line+=s.count('\n',i,j);i=j+1;continue
        m=re.compile(r'(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?').match(s,i) if (c.isdigit() or (c=='.' and i+1<n and s[i+1].isdigit())) and not (i and (s[i-1].isalnum() or s[i-1] in '_$.')) else None
        if m:
            j=m.end()
            if not (j<n and (s[j].isalpha() or s[j] in '_$')):
                if not rng or any(a<=i<b for a,b in rng):out.append((i,m.group(0),line,s[max(0,i-48):i].replace('\n',' ')))
            i=j;continue
        i+=1
    return out
def skip_literal(text,before,after):
    """literals that are not sizes: a subscript, an exponent, a loop's bound or step"""
    b=before.rstrip();a=after.lstrip()
    if re.search(r'[\w\)\]]\[$',b) and a.startswith(']'):return 'subscript'
    if a.startswith(':') and b[-1:] in ('{',','):return 'key'   # an object's numbered key (the hole table's hole numbers)
    if b.endswith('**') or re.search(r'toFixed\($|Math\.pow\([^,]*,$|slice\($',b):return 'exponent'
    if re.search(r'\bfor\s*\([^)]*$',before):return 'loop'
    if re.fullmatch(r'\d+',text) and int(text)<=4 and (b.endswith(('*','/')) or a[:1] in ('*','/')):return 'factor'   # 2*r, /2: arithmetic, not a size
    if re.search(r'Math\.PI\s*[*/]$',b) or a.startswith(('*Math.PI','/Math.PI')):return 'factor'
    return None
def nudged(text):
    """the two nudged spellings of a literal, about a tolerance: (up, down)"""
    v=float(text)
    if re.fullmatch(r'\d+',text) and v>=6:d=1.0   # a count (teeth, leaves, turns): by one
    else:
        a=abs(v);d=0.06 if a<=6 else 0.12 if a<=30 else 0.18 if a<=120 else 0.25
        if 0<a<0.3:d=max(0.004,0.2*a)
    f=lambda x:repr(round(x,6))
    return f(v+d),f(v-d)

def _sig(o,seen=None,depth=0):
    """a recipe's operations as plain data, so two makings of it can be compared: numbers rounded, objects by their fields, functions by their closures"""
    if depth>12:return '...'
    if isinstance(o,(str,bool,type(None),int)):return o
    if isinstance(o,float):return round(o,9)
    if isinstance(o,(list,tuple)):return [_sig(x,seen,depth+1) for x in o]
    if isinstance(o,dict):return {str(k):_sig(v,seen,depth+1) for k,v in o.items()}
    try:
        import numpy as np
        if isinstance(o,np.ndarray):return [round(float(x),9) for x in o.ravel().tolist()]
        if isinstance(o,np.generic):return round(float(o),9)
    except Exception:pass
    seen=seen if seen is not None else set()
    if id(o) in seen:return '<again>'
    seen.add(id(o))
    if callable(o) and hasattr(o,'__code__'):
        return ['fn',o.__code__.co_name,_sig([c.cell_contents for c in (o.__closure__ or ()) if _cell_ok(c)],seen,depth+1),_sig(o.__defaults__,seen,depth+1)]
    mod=type(o).__module__ or ''
    if mod.startswith('build123d') or mod.startswith('OCP'):
        try:b=o.bounding_box();return ['bd',type(o).__name__,round(getattr(o,'volume',0) or 0,6),round(getattr(o,'area',0) or 0,6),[round(x,6) for x in (b.min.X,b.min.Y,b.min.Z,b.max.X,b.max.Y,b.max.Z)]]
        except Exception:
            try:return ['bd',type(o).__name__,[round(x,9) for x in tuple(o)]]
            except Exception:return ['bd',type(o).__name__]
    if hasattr(o,'__dict__'):return [type(o).__name__,_sig({k:v for k,v in vars(o).items() if not (hasattr(o,'apply') and k in ('text','sizes','src'))},seen,depth+1)]   # an operation: what it cuts, not what its sheet says
    return repr(type(o))
def rsig(r):
    """a recipe's operations hashed (not its place on the page, its notes or its sheet's words): two makings with the same hash build the same solid"""
    import hashlib
    return hashlib.sha1(json.dumps(_sig(r.ops()),sort_keys=True,default=str).encode()).hexdigest()
def _cell_ok(c):
    try:c.cell_contents;return True
    except ValueError:return False
def _loaders():
    """the recipes' readers of the page's numbers (W(), WT() ...: each a Node run, cached): {module.name: function}"""
    import inspect
    out={}
    for mn,m in list(sys.modules.items()):
        if mn=='recipes' or mn.startswith('recipes.'):
            for an,f in list(vars(m).items()):
                if callable(f) and hasattr(f,'cache_info') and not [q for q in inspect.signature(f).parameters.values() if q.default is q.empty]:out.setdefault(id(f),(f'{mn}.{an}',f,[]))[2].append((m,an))
    return list(out.values())
def _loader_hash():
    """what each reader gave, hashed: a nudge that changes none of them is read by no recipe"""
    import hashlib
    H={}
    for name,f,_ in _loaders():
        try:H[name.split('.')[-1]]=hashlib.sha1(json.dumps(f(),sort_keys=True,default=str).encode()).hexdigest()
        except Exception as e:H[name.split('.')[-1]]='error '+type(e).__name__
    return H
_SW={}
def _sweep_init(base_sig,byPart,baseM,need,base_lh,opaque):_SW.update(sig=base_sig,by=byPart,M=baseM,need=need,lh=base_lh,opaque=opaque)
def _sweep_worker(nud):
    """one literal nudged: every recipe made again under it, those whose operations changed built and measured, the ledger's items on them judged"""
    import hashlib
    os.environ.update({k:v for k,v in nudge_env(nud).items() if k in ('MC_WNUDGE','NODE_OPTIONS')});os.environ.setdefault('MC_MODEL','wempe');sys.path.insert(0,str(HERE))
    for m in [m for m in list(sys.modules) if m=='recipes' or m.startswith('recipes.')]:del sys.modules[m]   # the recipes read again, as Node now gives them the numbers
    try:
        import wempe_measure as Mz
        from recipes import wempe as W
    except Exception as e:return {'state':'breaks','err':{'(all)':f'the recipes do not load: {type(e).__name__}: {str(e)[-160:]}'}}
    ch=[];err={};read=_loader_hash()!=_SW['lh']
    for k,mk in W.RECIPES.items():
        if k not in _SW['sig']:continue
        try:
            r=mk() if callable(mk) else mk
            if hasattr(r,'build') and (rsig(r)!=_SW['sig'][k] or (read and k in _SW['opaque'])):ch.append((k,r))   # a recipe that reads its numbers only as it builds is built whenever any reader's answer changed
        except Exception as e:err[k]=f'{type(e).__name__}: {str(e)[-120:]}'
    out={'changed':[k for k,_ in ch],'limits':[],'moved':[],'solid':[],'err':err}
    for k,r in ch:
        try:J=lite(Mz,r,r.build(),_SW['need'].get(k,{}))
        except Exception as e:err[k]=f'{type(e).__name__}: {str(e)[-120:]}';continue
        B=_SW['M'][k]
        if any(J[f]!=B[f] for f in ('box','z_levels','cylinders','cones','teeth','outlines_by_level')) or abs(J['volume_mm3']-B['volume_mm3'])>1e-4:out['solid'].append(k)
        for e in _SW['by'].get(k,[]):
            if len({h['part'] for h in hows(e)})>1:continue
            st,V,_=judge(e,{k:J})
            if st in ('FAIL','GONE'):out['limits'].append(e['id'])
            elif st=='MOVED':out['moved'].append(e['id'])
    out['state']='limits' if out['limits'] else 'moved' if out['moved'] else 'breaks' if err else 'unguarded' if out['solid'] else 'nosolid' if (ch or read) else 'unread'   # nosolid: the readers' answers changed (a placement, a sheet's words) and no operation did, or one did and its solid came out the same
    return out
def _base_worker(nophys):
    import hashlib
    os.environ.update({k:v for k,v in nudge_env([]).items() if k in ('MC_WNUDGE','NODE_OPTIONS')});os.environ['MC_WNUDGE_NOPHYS']='1' if nophys else '0'
    os.environ.setdefault('MC_MODEL','wempe');sys.path.insert(0,str(HERE))
    from recipes import wempe as W
    S={}
    for k,mk in W.RECIPES.items():
        r=mk() if callable(mk) else mk
        if hasattr(r,'build'):S[k]=rsig(r)
    return S,_loader_hash()
ESC_TABLES=['BJ','BAL','HUB','MS','TSW','ROLI','ROLD','BLK','DETK','DETV','COL','STD','EARB','HOLES']   # escapement.js's tables the recipes read (their declarations' literals)
def esc_ranges(f):
    s=f.read_text(encoding='utf-8');R=[]
    for t in ESC_TABLES:
        for m in re.finditer(r'(?:^|[;{}\s,])(?:const|let|var)?\s*'+t+r'\s*=\s*(?=[\[{(])',s,re.M):
            i=m.end();d=0;j=i
            while j<len(s):
                if s[j] in '[{(':d+=1
                elif s[j] in ']})':
                    d-=1
                    if d==0:break
                j+=1
            R.append((i,j+1));break
    return R
RANK=['limits','moved','breaks','unguarded','nosolid','unread']
def sweep(o):
    from concurrent.futures import ProcessPoolExecutor
    L=load();t0=time.time();dims=WE/'js'/'dims.js';esc=WE/'js'/'escapement.js';files=[]
    if o.scope in ('dims','all'):files.append((dims,None))
    if o.scope in ('esc','all'):files.append((esc,esc_ranges(esc)))
    lits=[]
    for f,rng in files:
        s=f.read_text(encoding='utf-8')
        for off,text,line,before in literals(f,rng):
            if o.grep and not re.search(o.grep,before+text):continue
            lits.append({'file':f.name,'off':off,'text':text,'line':line,'before':before[-40:],'skip':skip_literal(text,before,s[off+len(text):off+len(text)+10])})
    todo=[l for l in lits if not l['skip']]
    if o.limit:todo=todo[:o.limit]
    print(f"{len(lits)} numeric literals ({len(lits)-len(todo)} subscripts, keys, exponents, loop bounds and factors left out): {len(todo)} to nudge; the base first (every solid built and measured)",flush=True)
    with ProcessPoolExecutor(2,max_tasks_per_child=1) as ex:(base_sig,base_lh),(again,lh2)=list(ex.map(_base_worker,[1,0]))   # once as the sweep runs (wempe_nudge.js's MC_WNUDGE_NOPHYS), once as every other tool does
    loose=[k for k in base_sig if base_sig[k]!=again[k]]   # a recipe whose making does not repeat can't be compared: left out, and said
    for k in loose:del base_sig[k]
    if base_lh!=lh2:print('  the readers answer differently without the escapement in time (wempe_nudge.js, MC_WNUDGE_NOPHYS):',[k for k in base_lh if base_lh[k]!=lh2.get(k)]);return 1
    os.environ['MC_WNUDGE_NOPHYS']='1';os.environ.update({k:v for k,v in nudge_env([]).items() if k in ('MC_WNUDGE','NODE_OPTIONS')})
    need=needs(L);baseM,bad=measure(sorted(base_sig),o.jobs,None,{k:{**need.get(k,{}),'probe':1} for k in base_sig})
    if bad:print('  the base does not build:',bad);return 1
    opaque={k for k,j in baseM.items() if j.get('reads')}
    byPart=collections.defaultdict(list)
    for e in L['items']:
        for k in {h['part'] for h in hows(e)}:byPart[k].append(e)
    print(f"  the base: {len(base_sig)} solids in {time.time()-t0:.0f} s, {len(base_lh)} readers ({', '.join(sorted(base_lh))}); {len(opaque)} recipes read their numbers as they build ({', '.join(sorted(opaque)[:8])}{' ...' if len(opaque)>8 else ''})"+(f"; left out (their making does not repeat): {', '.join(loose)}" if loose else ''),flush=True)
    nd=lambda l,i:[[l['file'],l['off'],l['text'],nudged(l['text'])[i]]]
    old={}
    if o.resume:   # an earlier run's results kept (its .part.json or its sweep.json), all but 'unguarded' (the ledger may hold more now) and what was made by other rules
        R=json.loads(pathlib.Path(o.resume).read_text(encoding='utf-8'));R=R['literals'] if isinstance(R,dict) else R
        for x in R:
            u=x.get('up') if isinstance(x.get('up'),dict) else None
            if u and u.get('state') in ('limits','moved','breaks','unread'):old[(x['file'],x['off'],x['text'])]=u
        print(f"  {sum(1 for l in todo if (l['file'],l['off'],l['text']) in old)} literals' results taken from {o.resume}",flush=True)
    out=pathlib.Path(o.json) if o.json else HERE/'r_wpa'/'sweep.json';out.parent.mkdir(parents=True,exist_ok=True)
    with ProcessPoolExecutor(o.jobs,initializer=_sweep_init,initargs=(base_sig,dict(byPart),baseM,dict(need),base_lh,opaque),max_tasks_per_child=60) as ex:
        up=[];new=[l for l in todo if (l['file'],l['off'],l['text']) not in old];it=iter(ex.map(_sweep_worker,[nd(l,0) for l in new],chunksize=1))
        for i,l in enumerate(todo):
            r=old.get((l['file'],l['off'],l['text'])) or next(it);up.append(r);l['upr']=r
            if (i+1)%100==0:print(f"  {i+1}/{len(todo)} up, {time.time()-t0:.0f} s",flush=True);out.with_suffix('.part.json').write_text(json.dumps([{**{k:v for k,v in l.items() if k!='upr'},'up':r} for l,r in zip(todo,up)]),encoding='utf-8')   # kept as it goes: an hour's run shouldn't be lost whole
        again=[i for i,r in enumerate(up) if r['state'] in ('moved','breaks')]   # the other way where it can tell more: a one-sided tolerance (7 -0.1 at 6.95: up moves inside it, down leaves it), a recipe that broke
        print(f"  up: {time.time()-t0:.0f} s; {len(again)} nudged the other way too",flush=True)
        dn=dict(zip(again,ex.map(_sweep_worker,[nd(todo[i],1) for i in again],chunksize=1)))
    for i,l in enumerate(todo):
        a=up[i];b=dn.get(i) or {};best=min([a]+([b] if b else []),key=lambda r:RANK.index(r['state']))
        l.pop('upr',None);l.update({'state':best['state'],'up':a,'down':b.get('state'),'parts':sorted(set(a.get('changed',[]))|set(b.get('changed',[]))),'solids':sorted(set(a.get('solid',[]))|set(b.get('solid',[]))),
                  'items':sorted(set(a.get('limits',[])+a.get('moved',[])+b.get('limits',[])+b.get('moved',[])))[:12],'err':a.get('err') or b.get('err') or None,'nudge':list(nudged(l['text']))})
    c=collections.Counter(l['state'] for l in todo)
    out.write_text(json.dumps({'when':time.strftime('%Y-%m-%d'),'scope':o.scope,'counts':dict(c),'left_out':loose,'literals':lits},indent=0),encoding='utf-8')
    print(f"{len(todo)} literals in {time.time()-t0:.0f} s: "+', '.join(f'{c[k]} {k}' for k in RANK)+f"  ({out})")
    print('unguarded (a solid changes and no ledger item notices):')
    for l in todo:
        if l['state']=='unguarded':print(f"  {l['file']}:{l['line']}  …{l['before'][-34:]}[{l['text']}]  -> {', '.join(l['solids'][:6])}")
    return 0

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    a=argparse.ArgumentParser();a.add_argument('--model',default='wempe');a.add_argument('--jobs',type=int,default=int(os.environ.get('MC_PROCS') or 8));a.add_argument('--only');a.add_argument('--measured')
    a.add_argument('-v',action='store_true');a.add_argument('--update',action='store_true');a.add_argument('--fault',nargs='?',const='out');a.add_argument('--stats',action='store_true')
    a.add_argument('--derive',nargs='?',const=str(HERE/'r_wpa'/'sheetcheck.derived.json'));a.add_argument('--sweep',action='store_true');a.add_argument('--scope',default='dims');a.add_argument('--grep');a.add_argument('--json');a.add_argument('--why');a.add_argument('--limit',type=int);a.add_argument('--resume');o=a.parse_args()
    if o.stats:stats(load());return 0
    if o.sweep:return sweep(o)
    if o.derive:
        os.environ.setdefault('MC_MODEL','wempe');sys.path.insert(0,str(HERE))
        from recipes import wempe as W
        keys=[k for k in W.RECIPES];M,bad=measure(keys,o.jobs,o.measured,{k:{'all':1} for k in keys})
        keep={e['id']:e for e in load()['items'] if e.get('by')=='hand'} if LED.exists() else {}
        items,un,review=derive(M,keep,o.why);L={'about':ABOUT,'items':items,'unchecked':un}
        if o.why:return 0
        out=pathlib.Path(o.derive);out.parent.mkdir(parents=True,exist_ok=True);dump(L,out);stats(L)
        if out.resolve()!=LED.resolve():print(f'written {out}: compare it with the ledger ({LED.name}) entry by entry before it replaces it')
        if review:
            print(f'{len(review)} rows whose verdict the solid does not bear out today (left unchecked; look at each):')
            for e in review:print(f"  {e['id']:10s} {e['status']:9s} {e['item'][:60]} | drawn {e['drawn'][:40]} -> {e['lo']}..{e['hi']} | now {e['was']} | {json.dumps(e['how'])[:150]}")
        return 0
    L=load();only=set(o.only.split(',')) if o.only else None;keys=parts_of(L,only);t0=time.time()
    if o.fault:   # the pillars' body 0.3 large (or, --fault move, 0.06: inside 05 08 00-1's 8,1 -0,2, so only moved) in dims.js as Node reads it: must fail
        dims=WE/'js'/'dims.js';s=dims.read_text(encoding='utf-8');m=re.search(r'PIL:\{r:([\d.]+)/2',s);d=0.06 if o.fault=='move' else 0.3
        if not m:print('the planted fault no longer finds PIL:{r:.../2 in dims.js');return 1
        new=repr(round(float(m.group(1))+d,6));os.environ.update({k:v for k,v in nudge_env([['dims.js',m.start(1),m.group(1),new]]).items() if k in ('MC_WNUDGE','NODE_OPTIONS')})
        keys=['pillars'];only={'pillars'};print(f"planted: dims.js PIL r {m.group(1)}/2 -> {new}/2 (the pillars' body {d} large); the check must fail")
    J,bad=measure(keys,o.jobs,o.measured,needs(L))
    F,n=check(L,J,bad,only,o.v)
    if o.update and F:
        ch=0
        for st,e,txt in F:
            if st!='MOVED':continue
            V=[get(J[h['part']],h) for h in hows(e)];e['was']=V if len(V)>1 else V[0];ch+=1
        dump(L);print(f'{ch} moved items now held where they are; {len(F)-ch} failures left')
        F=[f for f in F if f[0]!='MOVED']
    print(f'{time.time()-t0:.0f} s')
    return 1 if F else 0
if __name__=='__main__':sys.exit(main())
