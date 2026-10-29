"""The operation sheet: a recipe as a maker reads it, its setups in a suggested order, each with a sketch of the part as that setup leaves it (the faces it
cuts in orange, each operation's number on the feature it cuts) and a table of only the sizes it cuts. A bought part is one line: what to buy.

The sketch is drawn from the B-rep with hidden lines removed (build123d's project_to_viewport): a flat part in plan from the face the setup works (the
inner face seen from below is mirrored, as a maker looking at it sees it), a turned part in half section, its axis upright, the near half cut away."""
import html,math
import build123d as bd
from . import Recipe,Bought

def _key(f):
    c=f.center();return (round(c.X,3),round(c.Y,3),round(c.Z,3),round(f.area,3))

def _plane(f):
    """a planar face's plane (normal, offset), or None"""
    if f.geom_type!=bd.GeomType.PLANE:return None
    n=f.normal_at();c=f.center();return (round(n.X,4),round(n.Y,4),round(n.Z,4),round(n.X*c.X+n.Y*c.Y+n.Z*c.Z,4))

def _new(a,b):
    """the faces of b that a hasn't (by centre and area), less those on a plane a already had (a face only pierced): what an operation cut"""
    if b is None:return []
    if a is None:return list(b.faces())
    k={_key(f) for f in a.faces()};pl={_plane(f) for f in a.faces()}-{None}
    return [f for f in b.faces() if _key(f) not in k and _plane(f) not in pl]

def view_of(r,s):
    """the setup's view: (camera direction toward the viewer, up), and whether it is a half section"""
    turned=any(o.kind in ('turn','bore','thread') for o in r.ops())
    if turned:return (0,-1,0),(0,0,1),True
    v=getattr(s,'view',None)
    if v is None:
        fs=[getattr(o,'face',None) for o in s.ops];v='bottom' if fs.count('in')>fs.count('out') else 'top'
    return ((0,0,-1) if v=='bottom' else (0,0,1)),(0,1,0),False

def _cross(a,b):return (a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])

def _svg(part,cuts,d,up,section,stock=(),W=560,H=420):
    """part: the solid after the setup; cuts: [(n, faces)]; d toward the viewer, up; an SVG string"""
    if section:
        bb=part.bounding_box();half=bd.Box(4*bb.size.X+10,2*bb.size.Y+10,4*bb.size.Z+10,align=(bd.Align.CENTER,bd.Align.MAX,bd.Align.CENTER)).moved(bd.Location((bb.center().X,0,bb.center().Z)))
        part=part-half   # the near half (y < 0) cut away, the section plane facing the viewer
        cuts=[(n,[f for f in fs if f.center().Y>=-1e-6]) for n,fs in cuts]
    org=tuple(100*c for c in d);vis,hid=part.project_to_viewport(org,up,(0,0,0))
    right=_cross(up,d);P=lambda v:(v.X*right[0]+v.Y*right[1]+v.Z*right[2],v.X*up[0]+v.Y*up[1]+v.Z*up[2])
    def pts(e):
        n=2 if e.geom_type==bd.GeomType.LINE else 32;return [e.position_at(i/(n-1)) for i in range(n)]
    V=[[(p.X,p.Y) for p in pts(e)] for e in vis];Hd=[[(p.X,p.Y) for p in pts(e)] for e in hid]
    hi=[]
    for n,fs in cuts:
        if not fs:continue
        cv,_=bd.Compound(fs).project_to_viewport(org,up,(0,0,0));hi.append((n,[] if n in stock else [[(p.X,p.Y) for p in pts(e)] for e in cv],P(bd.Compound(fs).bounding_box().center())))
    allp=[q for L in V for q in L]
    if not allp:return ''
    x0=min(q[0] for q in allp);x1=max(q[0] for q in allp);y0=min(q[1] for q in allp);y1=max(q[1] for q in allp);m=18
    k=min((W-2*m)/max(x1-x0,1e-6),(H-2*m)/max(y1-y0,1e-6));T=lambda q:(m+(q[0]-x0)*k,H-m-(q[1]-y0)*k)
    pl=lambda L,st:'<polyline points="'+' '.join(f'{T(q)[0]:.1f},{T(q)[1]:.1f}' for q in L)+f'" style="{st}"/>'
    o=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" class=sk>']
    o+=[pl(L,'fill:none;stroke:#bbb;stroke-width:.5;stroke-dasharray:2 2') for L in Hd]
    o+=[pl(L,'fill:none;stroke:#222;stroke-width:.8') for L in V]
    for n,Ls,c in hi:o+=[pl(L,'fill:none;stroke:#e07000;stroke-width:1.8') for L in Ls]
    placed=[]
    for n,Ls,c in hi:   # each operation's number by its feature, nudged off the ones already placed
        x,y=T(c)
        while any(math.hypot(x-a,y-b)<14 for a,b in placed):x+=13
        placed.append((x,y));o.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="7" style="fill:#fff;stroke:#e07000"/><text x="{x:.1f}" y="{y+3.5:.1f}" text-anchor="middle" style="font:9px sans-serif">{n}</text>')
    o.append(f'<text x="{W-4}" y="{H-4}" text-anchor="end" style="font:9px sans-serif;fill:#777">{"half section" if section else ("seen from the inner face" if d[2]<0 else "seen from the outer face")}, not to scale</text></svg>')
    return ''.join(o)

CSS=("body{font:14px/1.45 system-ui,sans-serif;max-width:960px;margin:24px auto;padding:0 16px;color:#222}h1{font-size:22px;margin:0}.meta{color:#555;margin:4px 0 16px}"
     "table{border-collapse:collapse;width:100%;margin:6px 0 14px}td,th{border:1px solid #ccc;padding:3px 6px;text-align:left;vertical-align:top}th{background:#f3f1ec}"
     ".setup{margin-top:18px;border-top:2px solid #333;padding-top:6px}.n{color:#777;width:2em}.src{color:#777;font-size:12px}.sk{display:block;margin:6px 0;border:1px solid #eee;max-width:100%;height:auto}"
     ".sug{background:#fff7e6;border-left:3px solid #e07000;padding:4px 8px}")

def sheet(r,sketch=True):
    E=html.escape
    if isinstance(r,Bought):
        return (f"<!doctype html><meta charset=utf-8><title>{E(r.title)}</title><style>{CSS}</style><h1>{E(r.title)}</h1>"
                f"<div class=meta>Parts-list line {E(r.hn)} · bought, not made: no STEP file</div><table><tr><th>Buy</th><td>{E(r.what)}</td></tr><tr><th>Size</th><td>{E(r.size)}</td></tr>"
                f"<tr><th>Standard</th><td>{E(r.standard)}</td></tr><tr><th>Material</th><td>{E(r.material)}</td></tr><tr><th>Source</th><td class=src>{E(r.src)}</td></tr></table>"+(f"<p>{E(' '.join(r.notes))}</p>" if r.notes else ''))
    h=[f"<!doctype html><meta charset=utf-8><title>{E(r.title)}</title><style>{CSS}</style><h1>{E(r.title)}</h1>",
       f"<div class=meta>Drawing {E(r.drawing)} · parts-list line {E(r.hn)} · material: {E(r.material)} · treatment: {E(r.treatment)} · solid: {E(r.key)}.step</div>",
       "<p class=sug><b>A suggested order.</b> The drawings give the finished part, not how to make it: the setups and their order below are one workable way, the model's, not Wempe's. A maker may well choose another; the sizes, fits and sources are what must hold.</p>"]
    if r.fits:h.append('<p><b>Fits.</b> '+'; '.join(E(f) for f in r.fits)+'</p>')
    n=0;p=None
    for s in r.setups:
        cuts=[];stock=set()
        for o in s.ops:
            n+=1;q=o.apply(p)
            if o.kind=='stock':stock.add(n)   # the blank: numbered, not drawn as a cut
            if q is not None:cuts.append((n,_new(p,q)));p=q
        n-=len(s.ops)
        h.append(f"<div class=setup><b>Setup {E(s.name)}</b>: {E(s.hold)}</div>")
        if sketch and p is not None:
            d,up,sec=view_of(r,s);h.append(_svg(p,cuts,d,up,sec,stock))
        h.append("<table><tr><th class=n>#</th><th>Operation</th><th>Size</th><th>Tolerance / fit</th><th>Source</th></tr>")
        for o in s.ops:
            n+=1;sz=o.sizes or [{'label':'','value':'','tol':None,'src':o.src}]
            for i,q in enumerate(sz):
                h.append('<tr>'+(f"<td class=n rowspan={len(sz)}>{n}</td><td rowspan={len(sz)}>{E(o.text)}</td>" if i==0 else '')+f"<td>{E((q['label']+' ' if q['label'] else '')+str(q['value']))}</td><td>{E(q['tol'] or '')}</td><td class=src>{E(q['src'] or o.src)}</td></tr>")
        h.append('</table>')
    if r.notes:h.append('<p><b>Notes.</b> '+' '.join(E(x) for x in r.notes)+'</p>')
    if r.expect:h.append('<p class=src><b>Where the page\'s model departs from this recipe</b> (the drawing\'s figure is this sheet\'s): '+' '.join(E(e['why']) for e in r.expect)+'</p>')
    h.append('<p class=src>Threads drawn by convention (DIN ISO 6410): the STEP solid has an outside thread at its major diameter, an inside one at its minor (tap drill).</p>')
    return ''.join(h)
