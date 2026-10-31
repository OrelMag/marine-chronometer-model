"""The Wempe fusee body's sheet 05 06 04-2 (References/wempe/drawings/05-06/Wempe_05-06_02-2.jpg, 1024 px wide, about 12.5 px a mm at 5:1) read for the stop
bar's slot across the small end: ink lines' centres found to a fraction of a pixel on intensity profiles across them (each dark run's centroid of darkness,
1 - grey), Schnitt C-D's centre from its recess (Ø 15) and bore (Ø 7) circles by least squares on points along rays, the scale from those diameters, and
the slot's two walls, where each wall's line ends at either end, and where the hidden arcs cross it, each put in mm from the axis in the slot's frame (u along
it, v across). About a second. Written 31 October 2026 (the owner's question: where does the slot break into the groove?).

    python fusee_sheet.py
"""
import sys,json,math,numpy as np
from PIL import Image,ImageDraw
from pathlib import Path
IMG=Path(__file__).resolve().parents[3]/'References/wempe/drawings/05-06/Wempe_05-06_02-2.jpg'
G=1-np.asarray(Image.open(IMG).convert('L'),float)/255   # darkness
def runs(p,thr=0.35):
    """centres of dark runs along a profile p (index = pixel): (centre, peak, width)"""
    o=[];i=0;n=len(p)
    while i<n:
        if p[i]>thr:
            j=i
            while j<n and p[j]>thr:j+=1
            a=max(i-1,0);b=min(j+1,n);w=p[a:b];o.append((a+(w*np.arange(len(w))).sum()/w.sum(),w.max(),j-i));i=j
        else:i+=1
    return o
def ray_hits(c,ang,r0,r1,step=0.25):
    """darkness along a ray from c, sampled bilinearly every step px between r0 and r1: dark runs' radii"""
    t=np.arange(r0,r1,step);x=c[0]+t*math.cos(ang);y=c[1]-t*math.sin(ang)
    x0=np.floor(x).astype(int);y0=np.floor(y).astype(int);fx=x-x0;fy=y-y0
    v=G[y0,x0]*(1-fx)*(1-fy)+G[y0,x0+1]*fx*(1-fy)+G[y0+1,x0]*(1-fx)*fy+G[y0+1,x0+1]*fx*fy
    return[(r0+cc*step,pk) for cc,pk,_ in runs(v)]
def circfit(P):
    P=np.array(P);A=np.c_[2*P,np.ones(len(P))];b=(P**2).sum(1);sol=np.linalg.lstsq(A,b,rcond=None)[0];cx,cy=sol[:2];r=math.sqrt(sol[2]+cx*cx+cy*cy)
    res=np.hypot(P[:,0]-cx,P[:,1]-cy)-r;return cx,cy,r,res.std()
def ring(c0,rlo,rhi,angs):
    """a circle traced on rays: the dark run nearest the middle of [rlo, rhi] on each ray"""
    P=[]
    for a in angs:
        h=[r for r,pk in ray_hits(c0,a,rlo,rhi)]
        if h:r=min(h,key=lambda r:abs(r-(rlo+rhi)/2));P.append((c0[0]+r*math.cos(a),c0[1]-r*math.sin(a)))
    return circfit(P),P
def main():
    """the bore's and the recess's crossings on the column and row through Schnitt C-D's centre (x 286, y 295: the centre line and the horizontal axis), each a pair
    either side of the centre, their spans the circles' diameters; the slot's walls on rows clear of the text and the hatch (y 270-320), nearest the sheet's 4 and 6"""
    col=G[:,284:289].mean(1);row=G[293:298].mean(0)
    cy=[180+c for c,pk,w in runs(col[180:420])];cx=[140+c for c,pk,w in runs(row[140:440])]
    pick=lambda L,lo,hi:[v for v in L if lo<=v<=hi]
    bt,bb=pick(cy,250,268)[0],pick(cy,325,340)[0];rt,rb=pick(cy,205,222)[0],pick(cy,376,390)[0]
    print(f'column x 286: bore {bt:.2f}-{bb:.2f} (Ø {bb-bt:.2f} px), recess {rt:.2f}-{rb:.2f} (Ø {rb-rt:.2f} px)')
    print(f'  scale: the Ø 7 bore {(bb-bt)/7:.2f} px/mm, the Ø 15 recess {(rb-rt)/15:.2f} px/mm; the centre y {(bt+bb)/2:.2f} / {(rt+rb)/2:.2f}')
    prof=G[270:345,200:250].mean(0)   # the walls run straight down the view: the columns' darkness over these rows, each wall a peak
    def peak(lo,hi):
        i=lo-200+int(np.argmax(prof[lo-200:hi-200]));w=prof[i-1:i+2];return 200+i-1+float((w*np.arange(3)).sum()/w.sum())
    xa,xb=peak(206,220),peak(232,245)
    print(f'slot walls x {xa:.2f} and {xb:.2f}: {xb-xa:.2f} px for the 2 H8 ({(xb-xa)/2:.2f} px/mm); the near wall {286.1-xb:.2f} px from the centre line (its 4: {(286.1-xb)/4:.2f} px/mm)')
    print('the drawing is not drawn to one scale: its written figures decide, its lines read to about ±0.5 mm')
main()
