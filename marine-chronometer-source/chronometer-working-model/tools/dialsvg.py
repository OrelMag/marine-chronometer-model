"""The Wempe page's three dials as vector drawings (no browser but --verify; numpy, shapely, opencv-python): Wempe 3955's, Kirov 247's (the Soviet 6MX's) and Lange 5177's.

    python dialsvg.py [--write] [wempe|kirov|lange ...]   # the SVGs in marine-chronometer-source/wempe/dials/ (without --write, exits 1 if one is stale)
    python dialsvg.py --verify [K]                       # each SVG's ink rasterised against the page's own canvas, WDIAL.face(K, d) (Playwright; K 4 by default)
    python dialsvg.py --png                              # r_dialsvg_DIAL.png: the SVG's ink rasterised as the page's canvas (2048 px over the disc), for dialtrace.py --canvas

The printing is the page's, not traced again: dialsvg.js runs dial.js's own face(1, d) on a canvas that records its calls in mm (the traced glyphs of dialface.js,
dialface_kirov.js and dialface_lange.js, and the tracks, circles and band dial.js draws from dialtrace.py's measurements), so the SVG is the dial the model shows, and
matches the photographs as closely as the page does (dialtrace.py --compare, its --canvas reading the SVG's raster). The canvas paints white over black (the tracks'
boxes, the seconds track over the 7 and the 5); here the paint order is resolved into ink alone (shapely: each black shape added, each white one cut away, in the page's
order), each box's rounded corners as the canvas makes them (the box inset by r, filled and stroked 2r wide with round joins: the inset outline buffered by r, round).
Arcs flattened to 0.5 µm, coordinates to 0.1 µm. Each SVG is in mm (1 user unit = 1 mm, the dial Ø 103.55 at full size), 12 at the top, the centre arbor at 0, 0, in layers:
  paper  the disc (05 02 00-4: Ø 103.55, white #f2f0ea) with the printed face's holes (the centre 6.0, the up-and-down 3.2, the seconds 1.7, the screws' Ø 1.8 sinks)
  ink    the black printing (#141416), one path, filled even-odd
  red    Kirov 247's serial (#ff617f, the photo's red scaled to the model's paper); empty on the others
  drill  hidden: every hole through the disc as dial.js cuts it (the screws' Ø 1.1 and Ø 1.8 sinks, the pin's Ø 1 at 6 deg and the Ø 1 at 185.7 deg under the paint)
"""
import json,math,subprocess,sys
from pathlib import Path
import numpy as np
from shapely.geometry import Polygon,MultiPolygon,Point
from shapely.ops import unary_union
from shapely import set_precision

HERE=Path(__file__).resolve().parent;OUT=HERE.parent.parent/'wempe'/'dials'
NAMES={'wempe':('wempe-3955.svg','Wempe No. 3955 (1_Wempe_3955_Z.jpg)'),'kirov':('kirov-247-6mx.svg','Kirov No. 247, the Soviet 6MX (1_Kirow_247_Z.jpg)'),
       'lange':('lange-5177.svg','A. Lange & Soehne No. 5177 (1_Lange_5177_Z.jpg)')}
PAPER='#f2f0ea';TOL=0.0005

def ops(d):return json.loads(subprocess.run(['node',str(HERE/'dialsvg.js'),d],capture_output=True,text=True,check=True).stdout)

def rings(p):
    """a recorded path's closed rings, arcs flattened to TOL; a full-turn arc its own ring (the canvas's ring(): two circles joined by a line in one subpath)"""
    out,cur=[],[]
    def flush():
        nonlocal cur
        if len(cur)>2:out.append(cur)
        cur=[]
    for c in p:
        if c[0]=='M':flush();cur=[(c[1],c[2])]
        elif c[0]=='L':cur.append((c[1],c[2]))
        elif c[0]=='Z':flush()
        else:
            _,cx,cz,r,a0,a1,ccw=c;sw=a1-a0   # the canvas's rule: a sweep of a full turn or more either way is a full circle in the flag's direction
            if abs(sw)>=2*math.pi:sw=-2*math.pi if ccw else 2*math.pi
            elif not ccw and sw<0:sw+=2*math.pi
            elif ccw and sw>0:sw-=2*math.pi
            full=abs(sw)>=2*math.pi-1e-9;n=max(8,math.ceil(abs(sw)/(2*math.acos(1-TOL/r))))
            pts=[(cx+r*math.cos(a0+sw*i/n),cz+r*math.sin(a0+sw*i/n)) for i in range(n+1)]
            if full:
                if len(cur)>1:cur.pop();flush()   # the joining line's start belongs to the previous ring
                else:cur=[]
                out.append(pts[:-1]);cur=[pts[-1]]
            else:cur+=pts[1:]
    flush();return out

def shape(o):
    """a recorded fill as a shapely area: its rings combined even-odd (the nonzero fills face() makes are simple outlines or opposite-wound circles, where the two rules agree), buffered by half its stroke with round joins"""
    g=None
    for r in rings(o['d']):
        q=Polygon(r).buffer(0)
        g=q if g is None else g.symmetric_difference(q)
    if g is None:return None
    if o['stroke']:g=g.buffer(o['stroke']/2,join_style='round',quad_segs=max(8,math.ceil(math.pi/2/(2*math.acos(1-TOL/max(o['stroke']/2,TOL*4))))))
    return g

def compose(J):
    """the paint order resolved: each colour's area, every later shape cut from the colours under it"""
    L={}
    for o in J['ops']:
        if o.get('rect'):continue   # the canvas's square ground: the disc is the paper
        g=shape(o)
        if g is None or g.is_empty:continue
        col=o['fill'] or o['color']
        for k in L:L[k]=L[k].difference(g)
        if col!=PAPER:L[col]=L[col].union(g) if col in L else g
    disc=Point(0,0).buffer(J['DR'],quad_segs=4096)
    face=disc.difference(unary_union([Point(x,z).buffer(r,quad_segs=256) for x,z,r in J['holes']['face']]))
    return {k:set_precision(v.intersection(face),1e-4) for k,v in L.items()},face

def pathd(g):
    polys=[g] if isinstance(g,Polygon) else [p for p in getattr(g,'geoms',[]) if isinstance(p,Polygon)]
    f=lambda v:('%.4f'%v).rstrip('0').rstrip('.').replace('-0','-0') if abs(v)>=5e-5 else '0'
    s=[]
    for p in polys:
        for r in [p.exterior,*p.interiors]:
            c=list(r.coords)[:-1];s.append('M'+' '.join(f'{f(x)} {f(z)}' for x,z in c)+'Z')
    return ''.join(s)

def circ(x,z,r):return f'<circle cx="{x:.4f}" cy="{z:.4f}" r="{r:.4f}"/>'

def svg(d,J,L,face):
    DR=J['DR'];fn,title=NAMES[d];ink=L.get('#141416');red=L.get('#ff617f')
    h=[f'<?xml version="1.0" encoding="UTF-8"?>',
       f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="{2*DR:.2f}mm" height="{2*DR:.2f}mm" viewBox="{-DR:.3f} {-DR:.3f} {2*DR:.3f} {2*DR:.3f}">',
       f'<title>{title.replace("&","&amp;")}</title>',
       f'<desc>The Wempe model&#8217;s dial printing (marine-chronometer-source/wempe/js/dial.js face(1, &#8216;{d}&#8217;), its glyphs traced by dialtrace.py) as vectors, written by'
       f' marine-chronometer-source/chronometer-working-model/tools/dialsvg.py: generated, don&#8217;t edit. mm, 1:1 (Ø {2*DR:.2f}), 12 at the top, the centre arbor at 0, 0.'
       f' The printing after a photograph by Johannes Altmeppen (References/wempe/photos), traced: the photograph itself is not in this file.</desc>',
       f'<g id="paper" inkscape:groupmode="layer" inkscape:label="paper"><path fill="{PAPER}" fill-rule="evenodd" d="{pathd(face)}"/></g>',
       f'<g id="ink" inkscape:groupmode="layer" inkscape:label="ink"><path fill="#141416" fill-rule="evenodd" d="{pathd(ink) if ink is not None else ""}"/></g>',
       f'<g id="red" inkscape:groupmode="layer" inkscape:label="red"><path fill="#ff617f" fill-rule="evenodd" d="{pathd(red) if red is not None else ""}"/></g>',
       f'<g id="drill" inkscape:groupmode="layer" inkscape:label="drill (05 02 00-4)" style="display:none" fill="none" stroke="#d00" stroke-width="0.05">'+''.join(circ(*h) for h in J['holes']['drill']+J['holes']['sink'])+'</g>',
       '</svg>','']
    return '\n'.join(h)

def build(d):
    J=ops(d);L,face=compose(J);return J,L,face,svg(d,J,L,face)

def raster(L,DR,K=1,col='#141416',ss=1):
    """a colour's area filled at the page canvas's scale (2048 K px over the disc), 20 ink (#141416, the canvas's), 242 paper; ss times as fine, then averaged down (the shapes inset
    half a pixel for cv2's fill, which takes every pixel its edges touch)"""
    import cv2
    if ss>1:return cv2.resize(raster(L,DR,K*ss,col),(2048*K,2048*K),interpolation=cv2.INTER_AREA)
    S=2048*K;k=S/(2*DR);im=np.full((S,S),242,np.uint8);g=L.get(col)
    if g is None:return im
    polys=[g] if isinstance(g,Polygon) else list(g.geoms)
    g=g.buffer(-0.5/k,join_style='mitre');polys=[g] if isinstance(g,Polygon) else list(g.geoms)   # inset half a pixel: cv2's fill takes every pixel its edges touch
    P=lambda r:np.round((np.array(r.coords)*k+S/2-0.5)*16).astype(np.int32)   # cv2 puts pixel centres on integers, the canvas at +0.5
    for p in polys:   # each polygon with its own holes in one scanline fill (even-odd), so a hole never erases another polygon standing in it
        x0,z0,x1,z1=p.bounds;i0,j0=max(0,int((x0*k+S/2))-2),max(0,int((z0*k+S/2))-2);i1,j1=min(S,int(x1*k+S/2)+3),min(S,int(z1*k+S/2)+3)
        m=np.zeros((j1-j0,i1-i0),np.uint8);o=np.array([i0,j0])*16
        cv2.fillPoly(m,[P(p.exterior)-o,*[P(r)-o for r in p.interiors]],255,cv2.LINE_8,4)
        im[j0:j1,i0:i1]=np.minimum(im[j0:j1,i0:i1],(242-222*(m/255.0)).astype(np.uint8))
    return im

def verify(K=4):
    """each dial's ink and red rasterised against the page's own canvas at K: the pixels that differ by more than half the contrast (where the canvas isn't on a hole)"""
    import asyncio,base64,cv2
    sys.path.insert(0,str(HERE));import browser
    from playwright.async_api import async_playwright
    async def grab(ds):
        async with async_playwright() as pw:
            b=await pw.chromium.launch(args=browser.ARGS);pg=await b.new_page()
            await pg.goto((HERE.parent.parent/'wempe/index.html').as_uri()+'?snap&qa');await pg.wait_for_function("typeof WDIAL!=='undefined'",timeout=120000)
            u={d:await pg.evaluate(f"WDIAL.face({K},'{d}').toDataURL('image/png')") for d in ds};await b.close();return u
    U=asyncio.run(grab(list(NAMES)));bad=0
    for d in NAMES:
        J,L,face,_=build(d);cvs=cv2.imdecode(np.frombuffer(base64.b64decode(U[d].split(',')[1]),np.uint8),cv2.IMREAD_COLOR)
        S=cvs.shape[0];k=S/(2*J['DR']);yy,xx=(np.mgrid[0:S,0:S]-S/2+0.5)/k
        ok=np.hypot(xx,yy)<J['DR']-0.05
        for x,z,r in J['holes']['face']:ok&=np.hypot(xx-x,yy-z)>r+0.05
        gC=cv2.cvtColor(cvs,cv2.COLOR_BGR2GRAY);inkC=gC<128;redC=(cvs[...,2]>200)&(cvs[...,1]<150)
        inkV=raster(L,J['DR'],K)<128;redV=raster(L,J['DR'],K,'#ff617f')<128
        dI=(inkC&~redC)^inkV;dR=redC^redV;px=1/k
        e=(dI|dR)&ok;n=int(e.sum())
        # an edge pixel rounds either way (and cv2's fill takes the pixels its edges touch, about a pixel heavy): only a difference 3 px across, a shape in one and not
        # the other (a box, a stroke or a glyph's hole, 38 µm at K 4), counts; the areas are the SVG's exact polygons' against the canvas's ink pixels
        er=cv2.erode(e.astype(np.uint8),np.ones((3,3),np.uint8)).astype(bool)
        aC=(inkC&~redC).sum()*px*px;aV=L['#141416'].area;rC=redC.sum()*px*px;rV=L['#ff617f'].area if '#ff617f' in L else 0
        print(f'{d:6s} canvas {S} px ({k:.1f} px/mm): ink {aC:8.2f} mm², SVG {aV:8.2f} mm² ({100*(aV/aC-1):+.2f} %); red {rC:.2f}, {rV:.2f} mm²; '
              f'pixels differing {n} (edge pixels), shapes differing (3 px across) {int(er.sum())} px')
        bad+=int(er.sum())>0 or abs(aV/aC-1)>0.005 or abs(rV-rC)>0.005*max(rC,1)
    return bad

if __name__=='__main__':
    a=sys.argv[1:];ds=[d for d in a if d in NAMES] or list(NAMES)
    if '--verify' in a:
        K=next((int(v) for v in a if v.isdigit()),4);sys.exit(1 if verify(K) else 0)
    stale=0
    for d in ds:
        J,L,face,s=build(d);fn=OUT/NAMES[d][0]
        print(f'{fn.name}: {len(s)//1024} kB, ink {L["#141416"].area:.2f} mm²'+(f', red {L["#ff617f"].area:.2f} mm²' if '#ff617f' in L else ''))
        if '--png' in a:
            import cv2;r=raster(L,J['DR'],col='#ff617f',ss=4);cv2.imwrite(f'r_dialsvg_{d}.png',np.where(r<242,np.uint8(148)+(r-20)*(242-148)//222,raster(L,J['DR'],ss=4)).astype(np.uint8))   # the red serial at #ff617f's grey, 148;print(f'  wrote r_dialsvg_{d}.png')
        if '--write' in a:OUT.mkdir(exist_ok=True);fn.write_text(s,encoding='utf-8',newline='\n');print('  wrote',fn)
        elif not fn.exists() or fn.read_text(encoding='utf-8')!=s:print(f'  {fn.name} is stale: rerun with --write');stale=1
    sys.exit(stale)
