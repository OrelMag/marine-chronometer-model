"""recipes_section.py: a recipe's solid and the page's mesh of the part cut at one level of the part's own frame, drawn over each other (the recipe blue,
the page red), to see where the check's differences are. How the top plate's pocket corner by the tongue was found (29 October 2026).

    python recipes_section.py --model wempe KEY Z [x0 x1 y0 y1] [OUT.png]     # about a minute (the page's load)"""
import asyncio,importlib.util,pathlib,sys
import numpy as np,matplotlib;matplotlib.use('Agg');import matplotlib.pyplot as plt
import model
HERE=pathlib.Path(__file__).resolve().parent;sp=importlib.util.spec_from_file_location('recipes_cli',HERE/'recipes.py');R=importlib.util.module_from_spec(sp);sp.loader.exec_module(R)
a=sys.argv[1:];key,z=a[0],float(a[1]);box=[float(v) for v in a[2:6]] if len(a)>=6 else None;out=a[6] if len(a)>6 else (a[2] if len(a)==3 else f'r_recipes/{model.NAME}/sec_{key}_{z}.png')
r=R.recipes()[key]();pm=asyncio.run(R.page_meshes([r.hn]));pages=R.tm_of(pm[r.hn]['meshes']);M=r.to_page;rm=R.tess(r.build());rm.vertices=R.xf(M,rm.vertices)
o=R.xf(M,np.array([[0,0,z]]))[0];n=M[:3,:3]@[0,0,1];fig,ax=plt.subplots(figsize=(9,9))
for m,col,lw in [(rm,'b',2)]+[(p,'r',0.8) for p in pages]:
    s=m.section(plane_origin=o,plane_normal=n)
    if s is None:continue
    for e in s.discrete:q=R.ixf(M,e);ax.plot(q[:,0],q[:,1],col,lw=lw)
if box:ax.set_xlim(box[0],box[1]);ax.set_ylim(box[2],box[3])
ax.set_aspect('equal');ax.grid(alpha=.3);ax.set_title(f'{r.title} at z {z} of its own frame: recipe blue, page red')
pathlib.Path(out).parent.mkdir(parents=True,exist_ok=True);plt.savefig(out,dpi=110);print(out)
