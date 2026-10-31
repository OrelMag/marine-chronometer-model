"""The Wempe fusee body 05 06 04-2 made one closed solid by manifold3d's booleans, which always give a closed, consistently wound manifold: the four pieces the
page builds (fusee.js: the flange's lathe with the chain's pin's hole, the groove's helix body, the tube with its tapped holes, the small end's band turned
whole), handed over uncut with window.__FUSEE_RAW, united; then the stop bar's slot milled across the small end as two pockets (05 06 04-2's Schnitt C-D: its
walls 4 and 6 from the axis, 2 H8; "1,5+0,05 tief", toward the bar's upper end only inside the dashed arc r SLR, "1,1+0,05 tief" outside it, at their middles), and the stop bar's spring's pin's hole drilled
(Ø 0.5 H7 from the recess out along the slot, a 20-gon as bore drew it), every figure the page's own. Writes marine-chronometer-source/wempe/js/fuseebody.js
(WFUSEEBODY: positions and indices, base64), which the page draws as the body. Written 31 October 2026, the owner's choice after the in-page cuts (rays,
facePocket) and OCCT's booleans on the helical groove each failed (README, the fusee body). About a minute.

    python wempe_fusee_body.py            # writes js/fuseebody.js
    python wempe_fusee_body.py --check    # exit 1 if it is stale (the pieces or the cuts changed)
"""
import asyncio,base64,hashlib,json,math,sys
from pathlib import Path
import numpy as np
import manifold3d as mf
from playwright.async_api import async_playwright
sys.argv+=['--model','wempe'] if '--model' not in sys.argv else []
import browser,model
OUT=Path(__file__).resolve().parents[2]/'wempe'/'js'/'fuseebody.js'
async def grab():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()
        pg=await b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script("window.__FUSEE_RAW=true")
        await pg.goto(model.PAGE,timeout=120000);await pg.wait_for_function("!document.querySelector('#loading')",timeout=180000)
        d=await pg.evaluate("(()=>{let r=null;__mv.traverse(o=>{if(!r&&o.userData&&o.userData.rawBody)r=o.userData.rawBody;});return r;})()")
        await b.close()
        if errs:print('page errors:',errs);sys.exit(1)
        if not d:print('no rawBody on the fusee (fusee.js, window.__FUSEE_RAW)');sys.exit(1)
        return d
def piece(p):
    """a page piece as a manifold: corners welded at 1e-5 mm (the page's pieces are closed to 2 µm: capFix's snapNear)"""
    P=np.array(p['pos'],np.float64).reshape(-1,3);I=np.array(p['idx'],np.int64).reshape(-1,3) if p['idx'] else np.arange(len(P)).reshape(-1,3)
    key=np.round(P*1e5).astype(np.int64);u,inv=np.unique(key,axis=0,return_inverse=True);inv=inv.reshape(-1)
    V=np.zeros((len(u),3));V[inv]=P;T=inv[I];T=T[(T[:,0]!=T[:,1])&(T[:,1]!=T[:,2])&(T[:,2]!=T[:,0])]
    m=mf.Manifold(mf.Mesh(vert_properties=V.astype(np.float32),tri_verts=T.astype(np.uint32)))
    if m.status()!=mf.Error.NoError:raise SystemExit(f'a piece is not a closed manifold: {m.status()}')
    return m
def frame(c,s,o=(0,0,0)):
    """a 3x4 matrix taking (u, y, v) to the page's (x, y, z): u along the bar, x = u c + v s, z = -u s + v c"""
    return [[c,0,s,o[0]],[0,1,0,o[1]],[-s,0,c,o[2]]]
def body(d):
    t=None
    for p in d['pieces']:t=piece(p) if t is None else t+piece(p)
    c,s,S=d['c'],d['s'],d['S']
    def pocket(depth,u0,u1):   # a box u0..u1, v0..v1, from depth under the small end's face out past it (the face is at y = S, the body toward +y)
        b=mf.Manifold.cube([u1-u0,depth+5,d['v1']-d['v0']]).translate([u0,S-5,d['v0']])
        return b.transform(frame(c,s))
    # one cutter (two cuts meeting on a common face left a wall of no thickness there): the slot 1,1 deep all along it, and 1,5 deep but toward the bar's upper end
    # (u > 0) only inside the circle r SLR about the axis (Schnitt C-D's dashed arc), so the deep floor never reaches the groove's next turn there
    disc=mf.Manifold.cylinder(30,d['SLR'],d['SLR'],720).transform([[1,0,0,0],[0,0,1,S-10],[0,-1,0,0]])
    t=t-(pocket(d['SLS'],-14,14)+pocket(d['SLD'],-14,0.5)+(pocket(d['SLD'],0,14)^disc))
    q=d['pin'];n=q['n'];R=q['r']/math.cos(math.pi/n)   # the hole's flats r from its axis, as bore draws an n-gon
    cyl=mf.Manifold.cylinder(30,R,R,n).rotate([0,0,180/n])   # along +z from the origin
    dx,dy,dz=q['d'];ax=np.array([dx,dy,dz]);z=np.array([0,0,1.0]);v=np.cross(z,ax);sn=np.linalg.norm(v);cs=float(z@ax)
    K=np.array([[0,-v[2],v[1]],[v[2],0,-v[0]],[-v[1],v[0],0]]);Rm=np.eye(3)+K+K@K*((1-cs)/sn**2) if sn>1e-12 else np.eye(3)
    M=[[*Rm[0],q['o'][0]],[*Rm[1],q['o'][1]],[*Rm[2],q['o'][2]]]
    t=t-cyl.transform(M)
    if t.status()!=mf.Error.NoError:raise SystemExit(f'the body is not a closed manifold: {t.status()}')
    return t
def js(m):
    me=m.to_mesh();V=np.asarray(me.vert_properties,np.float32)[:,:3];T=np.asarray(me.tri_verts,np.uint32)
    b=lambda a:base64.b64encode(np.ascontiguousarray(a).tobytes()).decode()
    h=hashlib.sha256(V.tobytes()+T.tobytes()).hexdigest()[:16]
    return (f"/* the Wempe fusee body 05 06 04-2 as one closed solid: tools/wempe_fusee_body.py (manifold3d) from fusee.js's pieces and cuts; do not edit. {len(V)} corners, "
            f"{len(T)} triangles, volume {m.volume():.3f} mm³, sha {h} */\nconst WFUSEEBODY={{pos:'{b(V.reshape(-1))}',idx:'{b(T.reshape(-1))}'}};\n"),len(V),len(T),m.volume(),m.genus()
def main():
    d=asyncio.run(grab());m=body(d);s,nv,nt,vol,gen=js(m)
    print(f'body: {nv} corners, {nt} triangles, volume {vol:.3f} mm³, genus {gen}, closed manifold')
    if '--check' in sys.argv:
        old=OUT.read_text(encoding='utf-8') if OUT.exists() else ''
        if old!=s:print(f'{OUT.name} is stale: run wempe_fusee_body.py');sys.exit(1)
        print(f'{OUT.name} up to date');return
    OUT.write_text(s,encoding='utf-8',newline='\n');print('wrote',OUT,f'{len(s)/1e6:.2f} MB')
if __name__=='__main__':main()
