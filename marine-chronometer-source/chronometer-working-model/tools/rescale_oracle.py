"""The rescale's oracle (PLAN-hamilton-drawings.md, Phase 0): every vertex of every mesh in the movement's frame, so a rescale by f can be checked mesh by mesh.

    python rescale_oracle.py dump NAME [--page PATH] [--hash H]      # rescale_NAME.npz: each mesh's vertices (movement frame, mm), in two frozen states
    python rescale_oracle.py diff BEFORE AFTER [--f 1.117] [--tol 1e-3] [--show PART,...]   # BEFORE's vertices times f against AFTER's, per part and mesh

The page is frozen as placements.py freezes it (an escapement phase, a train and a wind position). For each mesh (instanced meshes per instance) it records
its part, its index in traversal order, its geometry type and its vertices put into the movement's frame. diff scales BEFORE's by f about the movement's
origin and lists every mesh whose vertices differ from AFTER's by more than tol (mm), or whose vertex count or type changed (unless the two point sets lie within tol of each other: the same surface ordered or tessellated otherwise): a plate-scaled literal missed,
or an absolute part (the balance, the escape wheel) that differs on purpose. Exit 1 if any mesh outside --allow (part names) differs."""
import asyncio, base64, browser, json, pathlib, sys
NAMES = {}
import numpy as np
from playwright.async_api import async_playwright
HERE = pathlib.Path(__file__).resolve().parent
STATES = [(0.0, 0, 2.5, False), (0.4, 97, 8.7, False)]
FREEZE = """(()=>{{const mv=window.__mv;if(!mv.userData._u){{mv.userData._u=mv.userData.update;mv.userData.update=()=>{{}};}}
  const s=ESC.state({ph}),E=1000+{dE}+s.prog;mv.userData._u({{E,th:s.th,lift:s.lift,psDef:s.psDef,n:{n},winding:{w},springOn:true,msOn:false,arm:0,blk:0}});}})()"""
DUMP = """(()=>{const mv=window.__mv;let root=mv;while(root.parent)root=root.parent;root.updateMatrixWorld(true);
  const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert(),M=new THREE.Matrix4(),IM=new THREE.Matrix4(),v=new THREE.Vector3(),out=[],cnt={};
  root.traverse(o=>{if(!o.isMesh||!o.geometry.attributes||!o.geometry.attributes.position)return;let n=o,pn=null;while(n&&!pn){pn=n.userData.partName;n=n.parent;}pn=pn||'?';
    const p=o.geometry.attributes.position,reps=o.isInstancedMesh?o.count:1;
    for(let r=0;r<reps;r++){const i=cnt[pn]=(cnt[pn]||0)+1;M.multiplyMatrices(inv,o.matrixWorld);if(o.isInstancedMesh){o.getMatrixAt(r,IM);M.multiply(IM);}
      const a=new Float64Array(p.count*3);for(let k=0;k<p.count;k++){v.fromBufferAttribute(p,k).applyMatrix4(M);a[3*k]=v.x;a[3*k+1]=v.y;a[3*k+2]=v.z;}
      const u=new Uint8Array(a.buffer);let bs='';for(let k=0;k<u.length;k+=8192)bs+=String.fromCharCode.apply(null,u.subarray(k,k+8192));
      out.push([pn,i,o.geometry.type+(o.visible?'':'(hidden)'),btoa(bs),String(o.userData.hn||(o.parent&&o.parent.userData.hn)||'')+' '+(o.name||'')]);}});return out;})()"""
def arg(k, d=None): return sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
async def dump(tag, page):
    async with async_playwright() as p:
        b = await p.chromium.launch(args=browser.ARGS)
        w = await b.new_page(); await w.set_content('<canvas></canvas>'); await w.evaluate("document.querySelector('canvas').getContext('webgl')"); await w.wait_for_timeout(3000); await w.close()
        pg = await b.new_page(viewport={"width": 1200, "height": 800}); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto(page); await pg.wait_for_function("!document.querySelector('#loading')", timeout=120000); await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
        res, names = {}, {}
        for si, (ph, dE, n, wd) in enumerate(STATES):
            await pg.evaluate(FREEZE.format(ph=ph, dE=dE, n=n, w='true' if wd else 'false'))
            for pn, i, t, a, nm in await pg.evaluate(DUMP): res[f'{si}|{pn}#{i}|{t}'] = np.frombuffer(base64.b64decode(a), dtype=np.float64).reshape(-1, 3); names[f'{pn}#{i}'] = nm
        pathlib.Path(f'rescale_{tag}.names.json').write_text(json.dumps(names));np.savez_compressed(f'rescale_{tag}.npz', **res); print(f'rescale_{tag}.npz: {len(res)} meshes over {len(STATES)} states; page errors: {errs}')
        await b.close()
def diff(a, b, f, tol, allow, show):
    global NAMES
    try: NAMES = json.loads(pathlib.Path(f'rescale_{b}.names.json').read_text())
    except Exception: NAMES = {}
    A, B = np.load(f'rescale_{a}.npz'), np.load(f'rescale_{b}.npz'); bad = {}; ok = 0
    ka = {k.rsplit('|', 1)[0]: k for k in A.files}; kb = {k.rsplit('|', 1)[0]: k for k in B.files}
    for m in sorted(set(ka) | set(kb)):
        pn = m.split('|')[1].split('#')[0]
        if m not in ka or m not in kb: bad.setdefault(pn, []).append((m, 'only in ' + (a if m in ka else b))); continue
        x, y = A[ka[m]], B[kb[m]]
        if ka[m].rsplit('|', 1)[1] != kb[m].rsplit('|', 1)[1]: bad.setdefault(pn, []).append((m, f'type {ka[m].rsplit("|",1)[1]} -> {kb[m].rsplit("|",1)[1]}')); continue
        d = np.abs(x * f - y).max() if len(x) and x.shape == y.shape else np.inf
        if d > tol and len(x) and len(y):   # the same surface tessellated or ordered otherwise: each set's farthest point from the other
            from scipy.spatial import cKDTree
            h = max(cKDTree(y).query(x * f)[0].max(), cKDTree(x * f).query(y)[0].max())
            if h <= tol: ok += 1; continue
            if x.shape != y.shape: bad.setdefault(pn, []).append((m, f'vertices {len(x)} -> {len(y)}, {h:.4f} apart at most')); continue
        if d > tol:
            i = int(np.abs(x * f - y).max(axis=1).argmax()); bad.setdefault(pn, []).append((m, f'off {d:.4f} (at {np.round(x[i]*f,3).tolist()} -> {np.round(y[i],3).tolist()})'))
        else: ok += 1
    print(f'{ok} meshes scale by {f} to {tol} mm; {sum(len(v) for v in bad.values())} differ, in {len(bad)} parts')
    fail = 0
    for pn, v in sorted(bad.items()):
        al = pn in allow; fail |= not al
        print(f"  {pn:16s} {len(v):3d} meshes{'  (allowed)' if al else ''}")
        for m, why in v[:(40 if pn in show else 3)]: print(f'      {m}: {why}  [{NAMES.get(m.split("|")[1], "")}]')
    return fail
if __name__ == '__main__':
    if sys.argv[1:2] == ['dump']:
        h = arg('--hash', ''); asyncio.run(dump(sys.argv[2], pathlib.Path(arg('--page', HERE.parent / 'index.html')).resolve().as_uri() + '?snap&qa' + ('#' + h if h else '')))
    elif sys.argv[1:2] == ['diff']:
        sys.exit(diff(sys.argv[2], sys.argv[3], float(arg('--f', '1.117')), float(arg('--tol', '1e-3')), set(filter(None, arg('--allow', '').split(','))), set(filter(None, arg('--show', '').split(',')))))
    else: print(__doc__); sys.exit(2)
