"""hamilton_detent_compare.py: the 3D model's detent 42087 (rescaled x1.117, as recipes/hamilton_detent_model.json read it off the page) against the detent
reconstructed from the drawings (recipes/hamilton.py's detentFinished: the blank 42087-2-51A, -1-52 finished as HAMILTON-PARTS-LEDGER.md says), drawn over
each other in elevation (on edge, as it stands in the movement) and in plan, with each one's height and plan thickness along it and a table of sizes.

    python hamilton_detent_compare.py [--out OUT.png] [--json OUT.json]     (a few seconds; no browser: rerun hamilton_detent_export.py first if the model changed)

Aligned as asmDetent places the placeholders (recipes/hamilton.py, _det_map): along it on the point of flexure (the model's Ft, the drawn window's start),
in height on the clamp screw's axis (the model's) on the blank's slot centre line, across it on both centre lines; nothing is scaled. Only numbers are drawn:
no sheet goes into the picture."""
import argparse,json,math,pathlib,sys
import numpy as np
from PIL import Image,ImageDraw
import matplotlib;matplotlib.use('Agg');import matplotlib.pyplot as plt
HERE=pathlib.Path(__file__).resolve().parent;sys.path.insert(0,str(HERE))
from recipes import hamilton as H
PX=40   # raster, px a mm
def model_meshes(hn):
    """the model's meshes of line hn in the drawn detent's frame (x along from the foot end, y up its width, z across in plan), unscaled"""
    D=H.HD()['dt'];x0=D['window']['x0'];zm=D['t']/2
    sc=[np.array(m['v']).reshape(-1,3) for m in H.DM()['meshes'] if m['hn']=='37024']
    hc=min(sc,key=lambda V:V[:,1].max()-V[:,1].min());hC=(hc[:,2].min()+hc[:,2].max())/2;yC=D['hole']['y']
    out=[]
    for m in H.DM()['meshes']:
        if m['hn']!=hn:continue
        V=np.array(m['v']).reshape(-1,3);out.append((np.c_[x0+V[:,0],yC+V[:,2]-hC,zm+V[:,1]],np.array(m['i']).reshape(-1,3)))
    return out
def drawn_mesh():
    p=H.detentFinished().build();v,t=p.tessellate(0.002);return [(np.array([[q.X,q.Y,q.Z] for q in v]),np.array(t))]
def raster(meshes,a,b,box):
    """the silhouette of meshes projected on axes a, b (0 x, 1 y, 2 z) into a boolean image over box (a0, a1, b0, b1)"""
    a0,a1,b0,b1=box;W,Hh=int((a1-a0)*PX)+1,int((b1-b0)*PX)+1;im=Image.new('1',(W,Hh),0);d=ImageDraw.Draw(im)
    for V,T in meshes:
        P=np.c_[(V[:,a]-a0)*PX,(b1-V[:,b])*PX]
        for t in T:d.polygon([tuple(P[i]) for i in t],fill=1,outline=1)
    return np.array(im)
def extent(img):
    """along each column: the filled extent across (mm), nan where empty"""
    f=img.any(0);top=np.argmax(img,0);bot=img.shape[0]-1-np.argmax(img[::-1],0)
    return np.where(f,(bot-top+1)/PX,np.nan)
def main():
    sys.stdout.reconfigure(encoding='utf-8')
    a=argparse.ArgumentParser();a.add_argument('--out',default=str(HERE/'r_detent_compare.png'));a.add_argument('--json');o=a.parse_args()
    D=H.HD()['dt'];x0=D['window']['x0'];dr=drawn_mesh();md=model_meshes('42087');blk=model_meshes('42086');ts=model_meshes('42088')
    allV=np.vstack([V for V,_ in dr+md+blk]);lo,hi=allV.min(0)-0.5,allV.max(0)+0.5
    E=(lo[0],hi[0],lo[1],hi[1]);P=(lo[0],hi[0],lo[2],hi[2])
    eD,eM,eB=raster(dr,0,1,E),raster(md,0,1,E),raster(blk,0,1,E);pD,pM=raster(dr,0,2,P),raster(md,0,2,P)
    xs=lo[0]+np.arange(eD.shape[1])/PX
    hD,hM,tD,tM=extent(eD),extent(eM),extent(pD),extent(pM)
    def span(img):c=np.where(img.any(0))[0];return lo[0]+c[0]/PX,lo[0]+c[-1]/PX
    sD,sM=span(eD),span(eM)
    # the sizes, each read on the silhouettes (the model's) or from the recipe's numbers (the drawn)
    I=25.4;bp=D['topNotch']['bump'];M=H.DET_MODEL
    fl=lambda s,e,x:np.nanmax(e[(xs>=s)&(xs<=x)]) if np.any((xs>=s)&(xs<=x)&~np.isnan(e)) else float('nan')
    sTD=M['spring_t']*((M['spring_h']/(I*(.0315+.0275)))*(D['window']['l']/M['spring_L']))**(1/3)
    rows=[('Overall length',sD[1]-sD[0],sM[1]-sM[0]),('Foot: from its end to the point of flexure',x0-sD[0],x0-sM[0]),
          ('Point of flexure to the far end',sD[1]-x0,sM[1]-x0),('Foot: height (on edge)',fl(sD[0],hD,x0-0.2),fl(sM[0],hM,x0-0.2)),
          ('Foot: thickness in plan',fl(sD[0],tD,x0-0.2),fl(sM[0],tM,x0-0.2)),('Spring: length',D['window']['l'],M['spring_L']),
          ('Spring: height of its two strips together',I*(.0315+.0275),M['spring_h']),('Spring: thickness in plan (stiffness held; drawn = derived)',sTD,M['spring_t']),
          ('Point of flexure to the locking stone',H.DET_MODEL['stone_t']*M['ES'],H.DET_MODEL['stone_t']*M['ES']),
          ('Jewel block: length along (drawn: the notch\'s step)',bp['x1']-bp['x0'],float('nan')),('Greatest height past the spring',fl(D['window']['x1'],hD,sD[1]),fl(x0+M['spring_L'],hM,sM[1])),
          ('Clamp screw: before the point of flexure (drawn: the slot)',x0-D['slot']['x'],5.54)]
    print(f"{'':58s} {'drawn':>8s} {'model':>8s} {'drawn/model':>11s}")
    for n,d,m in rows:print(f"{n:58s} {d:8.2f} {m:8.2f} {d/m if m==m and m else float('nan'):11.3f}")
    if o.json:pathlib.Path(o.json).write_text(json.dumps([{'size':n,'drawn_mm':round(d,3),'model_mm':round(m,3) if m==m else None} for n,d,m in rows],indent=1),encoding='utf-8')
    # the picture: elevation over plan over the profiles
    cD,cM='#1f5fbf','#d0402a'
    fig,ax=plt.subplots(4,1,figsize=(15,12),gridspec_kw={'height_ratios':[3.2,2.0,1.6,1.6]})
    def show(a,img,box,col,alpha):
        rgba=np.zeros(img.shape+(4,));rgba[img]=matplotlib.colors.to_rgba(col,alpha);a.imshow(rgba,extent=(box[0],box[1],box[2],box[3]),interpolation='nearest')
    def edge(a,img,box,col,ls='-'):a.contour(np.flipud(img).astype(float),[0.5],colors=[col],linewidths=1.1,linestyles=ls,extent=(box[0],box[1],box[2],box[3]),origin='lower')
    show(ax[0],eD,E,cD,0.35);edge(ax[0],eD,E,cD);edge(ax[0],eM,E,cM);edge(ax[0],eB,E,'#777','--')
    ax[0].set_title('Elevation, on edge as it stands in the movement (mm): blue the drawn detent (42087-2-51A, -1-52, finished as reconstructed), red the 3D model\'s (×1.117), grey dashed the model\'s support block 42086',fontsize=9)
    show(ax[1],pD,P,cD,0.35);edge(ax[1],pD,P,cD);edge(ax[1],pM,P,cM)
    ax[1].set_title('Plan, looking down the arbors (mm): the model bends its horn across beyond the bar; the drawn horn is not formed (42087-3-01 not in the set)',fontsize=9)
    for a in ax[:2]:a.set_aspect('equal',adjustable='box');a.axvline(x0,color='k',lw=0.6,ls=':');a.grid(True,lw=0.3)
    ax[0].text(x0,E[3]-0.15,' point of flexure',fontsize=8,va='top')
    ax[2].plot(xs,hD,color=cD,label='drawn');ax[2].plot(xs,hM,color=cM,label='model');ax[2].set_ylabel('height on edge, mm');ax[2].legend(fontsize=8);ax[2].grid(True,lw=0.3)
    ax[3].plot(xs,tD,color=cD);ax[3].plot(xs,tM,color=cM);ax[3].set_ylabel('thickness in plan, mm');ax[3].set_xlabel('along the detent from the drawn foot end, mm');ax[3].grid(True,lw=0.3)
    for a in ax[2:]:a.axvline(x0,color='k',lw=0.6,ls=':')
    for a in ax:a.set_xlim(lo[0],hi[0])
    ax[1].set_ylim(-0.7,3.7)
    fig.tight_layout();fig.savefig(o.out,dpi=120);print(o.out)
if __name__=='__main__':main()
