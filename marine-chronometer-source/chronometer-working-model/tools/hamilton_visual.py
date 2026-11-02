"""hamilton_visual.py: each of the Hamilton's drawn parts (recipes/hamilton.py) drawn as its sheet draws it, beside the sheet, for checking by eye
(HAMILTON-PARTS-LEDGER.md, "Visual check"). The sheets are the NAWCC's: the pictures go to $MC_VIDEO/hd-audit/visual/ (default E:/mc-video), never into
the repository.

    python hamilton_visual.py [--only a,b] [--sheets DIR] [--out DIR]     (about a second a part; the sheets rendered at 300 dpi as SHEET.png in DIR)

Left: the sheet. Right: the part in inches on a .010 grid, as the sheet lays it out: a flat part in plan (its own frame, the sheet's) with its thickness
beside it; a turned part's section through its axis lying along the page (its first end at the left), half above the axis as the sheets draw it, with
the plan along the axis below it."""
import argparse,math,os,pathlib,sys
import numpy as np
import build123d as bd
import matplotlib;matplotlib.use('Agg');import matplotlib.pyplot as plt
from recipes import hamilton as H
IN=25.4
SHEET={'fourthWheel':'42073-2-01','fourthPinion':'42072-1-01','fuseeWheel':'42015-2-01','fuseeArbor':'42022-2-01','sustainingWheel':'42009-2-01','windingPawl':'42010-1-01',
       'windingPawlSpring':'42007-2-01','windingRatchet':'42013-1-01','sustainingSpring':'42016-2-01','sustainingPawl':'42096-2-01','barrel':'42168-2-01','barrelCap':'42169-2-01',
       'barrelArbor':'42170-2-01','mainspringEnd':'1-WD-265','setupRatchet':'42026-1-01','setupPawl':'42027-1-01','setupPawlSpring':'42028-2-01','centreLink':'42005-1-01',
       'outerLink':'42001-2-01','linkPin':'42004-1-01','barrelHook':'42002-1-01','fuseeHook':'42003-1-01','detentBlank':'42087-2-51A','detentFinished':'42093-2-01_(c.2)','helicalSpring':'42050-1-01'}
def seg(e,n=None):
    n=n or (1 if e.geom_type==bd.GeomType.LINE else max(16,int(e.length/0.02)))
    return [e.position_at(i/n) for i in range(n+1)]
def grid(ax):
    ax.set_aspect('equal');ax.grid(True,lw=0.4,color='#bbb');ax.minorticks_on();ax.grid(True,which='minor',lw=0.15,color='#ddd')
def draw(r,p,ax1,ax2):
    if getattr(r,'flat',False):
        for e in p.edges():
            P=seg(e);ax1.plot([q.X/IN for q in P],[q.Y/IN for q in P],'k-',lw=0.6)
        ax1.set_title(f'{r.title}: plan, inches (the sheet\'s frame)');grid(ax1)
        f=bd.Face.make_rect(400,400,bd.Plane.XZ);s=p&f   # its thickness: the section on y = 0 (y = the box's middle if that misses)
        if not s.faces():bb=p.bounding_box();s=p&bd.Face.make_rect(400,400,bd.Plane.XZ.offset(-(bb.min.Y+bb.max.Y)/2))
        for e in s.edges():
            P=seg(e);ax2.plot([q.X/IN for q in P],[q.Z/IN for q in P],'k-',lw=0.8)
        ax2.set_title('section through y = 0 (x along, z the thickness)');grid(ax2)
    else:
        s=p&bd.Face.make_rect(400,400,bd.Plane.XZ)
        for fc in s.faces():
            v,t=fc.tessellate(0.002);V=np.array([[q.Z/IN,q.X/IN] for q in v])
            if len(t):ax1.tripcolor(V[:,0],V[:,1],np.array(t),np.zeros(len(t)),cmap='Greys',vmin=-1,vmax=3)
        for e in s.edges():
            P=seg(e);ax1.plot([q.Z/IN for q in P],[q.X/IN for q in P],'k-',lw=0.8)
        ax1.set_title(f'{r.title}: section through the axis, lying along (z →, inches)');grid(ax1)
        for e in p.edges():   # the silhouette and edges seen across the axis (along -Y)
            P=seg(e,24 if e.geom_type!=bd.GeomType.LINE else 1);ax2.plot([q.Z/IN for q in P],[q.X/IN for q in P],'k-',lw=0.3)
        ax2.set_title('every edge seen across the axis');grid(ax2)
def main():
    sys.stdout.reconfigure(encoding='utf-8')
    root=pathlib.Path(os.environ.get('MC_VIDEO','E:/mc-video'))/'hd-audit'
    a=argparse.ArgumentParser();a.add_argument('--only');a.add_argument('--sheets',default=str(root/'sheets'));a.add_argument('--out',default=str(root/'visual'));o=a.parse_args()
    out=pathlib.Path(o.out);out.mkdir(parents=True,exist_ok=True)
    for grp,mk in H.RECIPES:
        r=mk()
        if o.only and r.key not in o.only.split(','):continue
        if r.key not in SHEET:continue   # no sheet of its own: the locking stone and the detent's placeholders (the 3D model's parts)
        p=r.build();fig=plt.figure(figsize=(24,11))
        sh=pathlib.Path(o.sheets)/f'{SHEET[r.key]}.png'
        a0=fig.add_axes([0.0,0.0,0.5,1.0]);a0.axis('off')
        if sh.exists():a0.imshow(plt.imread(str(sh)),cmap='gray');a0.set_title(SHEET[r.key])
        a1=fig.add_axes([0.54,0.40,0.44,0.56]);a2=fig.add_axes([0.54,0.04,0.44,0.30]);draw(r,p,a1,a2)
        fig.savefig(out/f'{r.key}.png',dpi=80);plt.close(fig);print(r.key,'->',out/f'{r.key}.png')
if __name__=='__main__':main()
