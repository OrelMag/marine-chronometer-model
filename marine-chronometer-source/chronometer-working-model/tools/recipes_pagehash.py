"""recipes_pagehash.py: the page's own meshes of the named parts-list lines saved, then compared with a later load, to prove a change (a literal moved from a
builder into dims.js or an exported constant for a recipe) leaves the page as it was. About a minute (the page's load).

    python recipes_pagehash.py --model wempe OUT.npz hn,hn,...      # writes them, or, if OUT.npz exists, compares (exit 1 on a change)

Each line's meshes are compared vertex for vertex within TOL (1e-5 mm) and their indices exactly: a part on a turning arbor has its pieces' matrices
multiplied out differently in the last float bits from one load to the next, so a bit-for-bit hash can't be used there."""
import asyncio,base64,importlib.util,pathlib,sys
import numpy as np
import model
HERE=pathlib.Path(__file__).resolve().parent;sp=importlib.util.spec_from_file_location('recipes_cli',HERE/'recipes.py');R=importlib.util.module_from_spec(sp);sp.loader.exec_module(R)
TOL=1e-5
f=pathlib.Path(sys.argv[1]);hns=sys.argv[2].split(',')
pm=asyncio.run(R.page_meshes(hns))
cur={}
for h,v in pm.items():
    for i,m in enumerate((v or {'meshes':[]})['meshes']):
        cur[f'{h}#{i}#p']=np.frombuffer(base64.b64decode(m['pos']),np.float32);cur[f'{h}#{i}#i']=np.frombuffer(base64.b64decode(m['idx']),np.uint32)
if not f.exists():np.savez_compressed(f,**cur);print(f'{len(hns)} lines saved into {f}');sys.exit(0)
old=dict(np.load(f));diff=set()
for h in hns:
    ka={k for k in old if k.startswith(h+'#')};kb={k for k in cur if k.startswith(h+'#')}
    if ka!=kb:diff.add(h);continue
    for k in ka:
        a,b=old[k],cur[k]
        if a.shape!=b.shape or (k.endswith('#i') and not np.array_equal(a,b)) or (k.endswith('#p') and np.abs(a.astype(float)-b).max()>TOL):diff.add(h)
print(f'{len(hns)} lines: '+('the page unchanged (within %g mm)'%TOL if not diff else 'changed: '+', '.join(sorted(diff))));sys.exit(1 if diff else 0)
