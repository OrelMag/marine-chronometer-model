"""The Wempe fusee body's sheet 05 06 04-2 (References/wempe/drawings/05-06/Wempe_05-06_02-2.jpg, 1024 px wide, about 12.5 px a mm at 5:1) read for the stop
bar's slot across the small end: ink lines' centres found to a fraction of a pixel on intensity profiles across them (each dark run's centroid of darkness,
1 - grey), Schnitt C-D's centre from its recess (Ø 15) and bore (Ø 7) circles by least squares on points along rays, the scale from those diameters, and
the slot's two walls, where each wall's line ends at either end, and where the hidden arcs cross it, each put in mm from the axis in the slot's frame (u along
it, v across). About a second. Written 31 October 2026 (the owner's question: where does the slot break into the groove?).

    python fusee_sheet.py [--png OUT.png]
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
    c0=(287.,296.)   # Schnitt C-D's centre, as first read by eye (the bore's middle)
    angs=[math.radians(a) for a in range(-30,40,4)]+[math.radians(a) for a in range(300,330,4)]   # the right side, clear of the slot, the dimensions and the break
    (bx,by,br,bs),Pb=ring(c0,38,50,angs)
    (rx,ry,rr,rs),Pr=ring((bx,by),85,100,angs)
    print(f'bore circle   centre ({bx:.2f},{by:.2f}) r {br:.2f} px (rms {bs:.2f}, {len(Pb)} pts)')
    print(f'recess circle centre ({rx:.2f},{ry:.2f}) r {rr:.2f} px (rms {rs:.2f}, {len(Pr)} pts)')
    k=rr/7.5;print(f'scale from the recess Ø 15: {k:.3f} px/mm; the bore gives {br/3.5:.3f} (Ø 7 H7)')
    cx,cy=rx,ry
    # the slot's walls: vertical lines left of the centre; their x by profiles along rows clear of the text
    W=[]
    for y in range(225,330,3):
        h=[c for c,pk,w in runs(G[y,190:260]) if pk>0.4];W.append([190+c for c in h])
    xs=np.array([w for w in W if len(w)==2]);xa,xb=xs[:,0].mean(),xs[:,1].mean()
    print(f'walls at x {xa:.2f} and {xb:.2f} (sd {xs[:,0].std():.2f}, {xs[:,1].std():.2f}, {len(xs)} rows): width {(xb-xa)/k:.3f} mm, near wall {(cx-xb)/k:.3f} from the axis, far wall {(cx-xa)/k:.3f}')
    # each wall's line along its length: where it is dark (the line drawn) from top to bottom
    out={}
    for nm,x in (('far',xa),('near',xb)):
        col=G[:,int(round(x))-1:int(round(x))+2].max(1);on=col>0.35
        ys=np.where(on[100:500])[0]+100
        segs=[];s=ys[0];p=ys[0]
        for y in ys[1:]:
            if y>p+2:segs.append((s,p));s=y
            p=y
        segs.append((s,p))
        segs=[(a,b) for a,b in segs if b-a>=3]
        out[nm]=segs
        print(f'{nm} wall (v {(cx-x)/k:.2f}) drawn over y: '+', '.join(f'{a}-{b} (u {(cy-a)/k:+.2f} to {(cy-b)/k:+.2f}, r {math.hypot((cy-a)/k,(cx-x)/k):.2f}-{math.hypot((cy-b)/k,(cx-x)/k):.2f})' for a,b in segs))
    # the arcs that cross the slot between its walls (hidden or drawn): their radius on the slot's middle line
    xm=(xa+xb)/2;col=G[:,int(round(xm))-1:int(round(xm))+2].mean(1)
    for c,pk,w in runs(col[100:500],0.25):
        y=100+c;u=(cy-y)/k;v=(cx-xm)/k;print(f'  across the slot\'s middle at y {y:.1f}: u {u:+.2f} r {math.hypot(u,v):.2f} mm (darkness {pk:.2f}, {w} px)')
    if '--png' in sys.argv:
        im=Image.open(IMG).convert('RGB');d=ImageDraw.Draw(im)
        for P,col_ in((Pb,(255,0,0)),(Pr,(0,160,0))):
            for x,y in P:d.ellipse([x-1,y-1,x+1,y+1],outline=col_)
        for x in(xa,xb):d.line([(x,100),(x,500)],fill=(0,0,255))
        im.crop((120,60,460,560)).resize((1020,1500)).save(sys.argv[sys.argv.index('--png')+1])
main()
