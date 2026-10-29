"""recipes_site.py: the recipes' STEP files and operation sheets for the site (PLAN-recipes.md): each made part's KEY.step and KEY.html into the model's
parts/ folder (committed; build.py copies it to the site), and js/recipes.js (WRECIPES: for each parts-list line, its recipes and its bought lines),
which maker.js shows on the part's card (STEP, Operation sheet, what to buy).

    python recipes_site.py --model wempe [--check]

It runs recipes.py --step --sheet into a scratch folder (about a minute). A STEP file's header carries the time it was written: a file whose content
is otherwise the same keeps the one committed, so a rerun changes only what changed. --check fails (exit 1) if parts/ or recipes.js is stale."""
import json,pathlib,re,shutil,subprocess,sys,tempfile
import model
HERE=pathlib.Path(__file__).resolve().parent
def norm(b):return re.sub(rb"'\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d'",b"''",b,count=1)   # the header's time written
def main():
    check='--check' in sys.argv;from recipes import wempe as W
    out=model.DIR/'parts';js=model.DIR/'js'/'recipes.js';stale=[]
    with tempfile.TemporaryDirectory() as tmp:
        r=subprocess.run([sys.executable,str(HERE/'recipes.py'),'--model',model.NAME,'--step',tmp,'--sheet',tmp],cwd=HERE)
        if r.returncode:sys.exit('recipes_site.py: recipes.py failed')
        if not check:out.mkdir(exist_ok=True)
        new={f.name:f for f in pathlib.Path(tmp).iterdir() if f.suffix in('.step','.html')}
        for n,f in sorted(new.items()):
            o=out/n;b=f.read_bytes()
            if o.exists() and (norm(o.read_bytes())==norm(b) if n.endswith('.step') else o.read_bytes()==b):continue
            stale.append(n)
            if not check:o.write_bytes(b)
        for o in (out.iterdir() if out.exists() else []):
            if o.name not in new:stale.append(o.name+' (gone)');(None if check else o.unlink())
    H={}
    for k,mk in W.RECIPES.items():
        p=mk()
        if hasattr(p,'what'):H.setdefault(p.hn,[]).append({'t':p.title,'buy':f'{p.what}, {p.size}; {p.standard}; {p.material}'})
        else:H.setdefault(p.hn,[]).append({'t':p.title,'k':k})
    txt=('/* recipes.js: each parts-list line\'s recipes (a STEP file and an operation sheet in parts/) and bought lines, for the part cards (maker.js).\n'
         '   Written by tools/recipes_site.py; do not edit by hand. Declares only WRECIPES */\n"use strict";\n'
         'const WRECIPES='+json.dumps({'dir':'parts/','hn':H},separators=(',',':'),ensure_ascii=False)+';\n')
    if not js.exists() or js.read_text(encoding='utf-8')!=txt:
        stale.append(js.name)
        if not check:js.write_bytes(txt.encode('utf-8'))
    print('\n'.join(('stale: ' if check else 'wrote ')+s for s in stale) or 'up to date')
    sys.exit(1 if check and stale else 0)
if __name__=='__main__':main()
