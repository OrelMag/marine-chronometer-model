"""Whether the 3D stress near a contact is the part's own or the load patch's (docs/motion-3d/, section 6; 19 October 2026). numpy, matplotlib; runs motion3d_fe.py.

    python motion3d_contact.py --model wempe [--parts a,b] [--procs 3] [--fig DIR] [--json OUT]    # about 40-60 minutes a model: its solves three at a time, a tall part's alone; each kept in r_motion3d/<model>/contact/

motion3d_fe.py spreads each contact's load over a patch of surface nodes of a fixed radius (a mesh's 0.6 of a module, a pawl's nose 0.25-0.36 mm), since no solid of
the model carries the contact's real width (Hertz's, tens of microns). Right at the patch the stress is the patch's pressure, F over its area, and grows as the patch
shrinks; a part's own stress (a tooth's root, a pawl's arm bending) holds its value. So each part named is solved again (motion3d_fe.py --study) with its patches
at 0.5, 1 and 2 times their radius, at the published resolution (--n 120000) with the windows at a ninth of the module and at a fourteenth, and its stress against
its distance from the loaded nodes is compared (the most stress at or beyond each distance, in its finest window, or its coarse grid where it has none). The reading:
the nearest distance at which the three patches agree within 10 % at the finer window, and the stress there, the part's own; nearer than that, the patch's. Prints
each part's table and reading against its limit (where a mesh's load, spread by its module, doesn't take --patch, the windows' refinement alone); --fig draws stress against distance, one line a patch; --json writes it all. Reports, never fails."""
import json,os,pathlib,subprocess,sys,tempfile
from concurrent.futures import ThreadPoolExecutor
import numpy as np
import model
HERE=pathlib.Path(__file__).resolve().parent
def arg(k,d=None):return sys.argv[sys.argv.index(k)+1] if k in sys.argv else d
M=model.NAME
PARTS={'wempe':['maintaining.clicks','maintaining.ratchet','maintDetent','fuseeWheel','fusee'],'hamilton':['ratchet.click','sratchet.pawls','fusee','gw']}[M]
PARTS=arg('--parts',','.join(PARTS)).split(',');PATCHES=[0.5,1.0,2.0];WINS=[9,14];PROCS=int(arg('--procs',3))
BIG={'fusee'}   # a tall part (the fusee's cone): its window runs its whole height, millions of bricks at a 14th of the module, so solved alone (two at once ran out of 64 GB)
CACHE=HERE/'r_motion3d'/M/'contact';CACHE.mkdir(parents=True,exist_ok=True)   # each solve kept (part, window, patch): a rerun solves only what is missing

def solve(nm,w,p):
    out=CACHE/f'{nm}_w{w}_p{p}.json'
    if not out.exists():
        r=subprocess.run([sys.executable,str(HERE/'motion3d_fe.py'),'--model',M,'--version','last','--n','120000','--only',nm,'--win',str(w),'--patch',str(p),'--study',str(out)],
                         cwd=HERE,capture_output=True,text=True,encoding='utf-8',env={**os.environ,'PYTHONIOENCODING':'utf-8'})
        if r.returncode:print(f'  {nm} --win {w} --patch {p} failed: {r.stderr.strip().splitlines()[-1][:200]}',flush=True);return (nm,w,p),None
        print(f'  solved {nm} at a {w}th of the module, its patch x{p}',flush=True)
    return (nm,w,p),json.loads(out.read_text())['parts'].get(nm)

def curve(q):
    """the part's stress against distance: its finest window's (the one at the highest stress), or its coarse grid's"""
    ws=[x for x in q.get('windows',[]) if x.get('prof')]
    if ws:x=max(ws,key=lambda x:x['peak']);return np.array(x['prof']),f"its window, {x['h']:.3f} mm bricks"
    return np.array(q.get('prof') or [[0,0]]),f"its coarse grid, {q['h']:.3f} mm bricks"

def main():
    jobs=[(nm,w,p) for nm in PARTS for w in WINS for p in PATCHES];R={}
    with ThreadPoolExecutor(PROCS) as ex:R.update(dict(ex.map(lambda a:solve(*a),[j for j in jobs if j[0] not in BIG])))
    for j in jobs:
        if j[0] in BIG:R.update([solve(*j)])
    R={(w,p):{nm:R[(nm,w,p)] for nm in PARTS if R.get((nm,w,p))} for w in WINS for p in PATCHES}
    out={}
    print(f'{M}: each part\'s most stress (MPa) at or beyond a distance from its load, its load\'s patch at 0.5, 1 and 2 times its radius, windows at a 9th and a 14th of the module')
    for nm in PARTS:
        if nm not in R[(WINS[0],1.0)]:print(f'  {nm}: not solved');continue
        q0=R[(WINS[-1],1.0)][nm];lim=q0['limit'];C={(w,p):curve(R[(w,p)][nm]) for w in WINS for p in PATCHES};d=C[(WINS[-1],1.0)][0][:,0]
        fine=np.array([C[(WINS[-1],p)][0][:,1] for p in PATCHES]);agree=(fine.max(0)<=1.1*fine.min(0))&(fine.min(0)>0)
        k=int(np.argmax(agree)) if agree.any() else None;own=float(np.median(fine[:,k])) if k is not None else None
        print(f"  {nm} ({q0['mat']}, {lim[0]}-{lim[1]}; published peak {R[(9,1.0)][nm]['peak']:.0f}); {C[(WINS[-1],1.0)][1]}")
        print('     d (mm)  '+'  '.join(f'{x:6.2f}' for x in d))
        for w in WINS:
            for p in PATCHES:print(f'     K {w:2d} ×{p:3.1f} '+'  '.join(f'{x:6.0f}' for x in C[(w,p)][0][:,1]))
        j3=int(np.argmin(np.abs(d-0.3)));kind='patch'
        if np.allclose(fine,fine[0],rtol=1e-6):   # a mesh's load is spread by its own module, which --patch doesn't reach: only the window's refinement is tested
            kind='window';k=None;own=None;a9=C[(WINS[0],1.0)][0][j3,1];a14=C[(WINS[-1],1.0)][0][j3,1]
            rd=f"the load's patch doesn't reach this part (a mesh's, spread by its module): the window refined from a {WINS[0]}th to a {WINS[-1]}th of the module moves the stress 0.3 mm from the load {a9:.0f} to {a14:.0f} MPa ({100*(a14/a9-1):+.0f} %): not converged (the voxels' stepped root corners sharpen as they shrink)"
        elif k is not None:rd=f"the patches agree from {d[k]:.2f} mm: the part's own stress there {own:.0f} MPa, margin {lim[0]/own:.2f}-{lim[1]/own:.2f}"
        else:
            r=fine[0,j3]/max(fine[-1,j3],1e-9);rd=f"the patches never agree within 10 %: 0.3 mm from the load the stress is {fine[0,j3]:.0f} MPa with the patch at x{PATCHES[0]}, {fine[-1,j3]:.0f} at x{PATCHES[-1]} ({r:.1f} times for a patch {PATCHES[-1]/PATCHES[0]:.0f} times as wide): the patch's own pressure, not the part's bending"
        print('     '+rd)
        out[nm]=dict(mat=q0['mat'],limit=lim,published=R[(9,1.0)][nm]['peak'],d=d.tolist(),curves={f'{w}_{p}':C[(w,p)][0][:,1].tolist() for w in WINS for p in PATCHES},
                     where=C[(WINS[-1],1.0)][1],agreeFrom=float(d[k]) if k is not None else None,own=own,kind=kind,reading=rd,load=q0.get('load',''))
    if arg('--fig'):
        import matplotlib;matplotlib.use('Agg');import matplotlib.pyplot as plt
        n=len(out);fig,ax=plt.subplots(1,n,figsize=(4.6*n,4.2),squeeze=False);ax=ax[0]
        for a,(nm,o) in zip(ax,out.items()):
            for w,ls in zip(WINS,['--','-']):
                for p,c in zip(PATCHES,['#2a78d6','#1baf7a','#eb6834']):a.plot(o['d'],o['curves'][f'{w}_{p}'],ls,c=c,lw=1.6 if w==WINS[-1] else 1,label=f'patch ×{p}, window m/{w}')
            a.axhspan(*o['limit'],color='#999',alpha=0.18,label=f"{o['mat']}'s limit");a.set_yscale('log');a.set_xlabel('distance from the load (mm)');a.set_ylabel('most stress at or beyond it (MPa)')
            if o['agreeFrom'] is not None:a.axvline(o['agreeFrom'],c='k',lw=0.8);a.plot([o['agreeFrom']],[o['own']],'ko')
            a.set_title(f"{M}: {nm}",fontsize=10);a.grid(alpha=0.3)
        ax[0].legend(fontsize=7,loc='upper right');out_=pathlib.Path(arg('--fig'));out_.mkdir(parents=True,exist_ok=True);fig.tight_layout();fig.savefig(out_/f'contact_{M}.png',dpi=110);plt.close(fig)
        print(f"wrote {out_/f'contact_{M}.png'}")
    if arg('--json'):pathlib.Path(arg('--json')).write_text(json.dumps(out,indent=1),encoding='utf-8')
if __name__=='__main__':main()
