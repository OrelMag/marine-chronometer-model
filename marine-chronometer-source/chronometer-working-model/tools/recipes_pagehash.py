"""recipes_pagehash.py: the page's own meshes of the named parts-list lines hashed bit for bit (vertices and indices), to prove a change (a literal moved
from frame.js into dims.js for a recipe) leaves the page as it was. About a minute (the page's load).

    python recipes_pagehash.py --model wempe OUT.json hn,hn,...      # writes the hashes, or, if OUT.json exists, compares (exit 1 on a change)"""
import asyncio,hashlib,importlib.util,json,pathlib,sys
import model
HERE=pathlib.Path(__file__).resolve().parent;sp=importlib.util.spec_from_file_location('recipes_cli',HERE/'recipes.py');R=importlib.util.module_from_spec(sp);sp.loader.exec_module(R)
f=pathlib.Path(sys.argv[1]);hns=sys.argv[2].split(',')
pm=asyncio.run(R.page_meshes(hns))
hs={h:(hashlib.sha256(''.join(m['pos']+m['idx'] for m in v['meshes']).encode()).hexdigest() if v else None) for h,v in pm.items()}
if not f.exists():f.write_text(json.dumps(hs,indent=1));print(f'{len(hs)} lines hashed into {f}');sys.exit(0)
old=json.loads(f.read_text());diff=[h for h in hs if old.get(h)!=hs[h]]
print(f'{len(hs)} lines: '+('the page unchanged' if not diff else 'changed: '+', '.join(diff)));sys.exit(1 if diff else 0)
