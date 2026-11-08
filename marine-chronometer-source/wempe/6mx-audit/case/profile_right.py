"""Right-hand silhouette radius profile of a bowl photographed side-on against a plain background (DEC 422, bowl turned
over): r(y) = x_right(y) - x_axis, printed in px and in mm for a given scale; also finds slope breaks (piecewise-linear fit by
dynamic programming over a few segments) to give the cone's angle and the heights of foot, cone, body, collar.
Usage: profile_right.py IMG x_axis px_per_mm [thr] [segments]"""
import sys,cv2,numpy as np
im=cv2.imread(sys.argv[1]);x0=float(sys.argv[2]);k=float(sys.argv[3]);thr=float(sys.argv[4]) if len(sys.argv)>4 else 30
nseg=int(sys.argv[5]) if len(sys.argv)>5 else 7
b=np.concatenate([im[:10,-80:].reshape(-1,3)]);bg=np.median(b,axis=0)
g=cv2.GaussianBlur(im.astype(np.float32),(0,0),1.0)
d=np.linalg.norm(g-bg,axis=2)
ys=np.arange(20,im.shape[0]-8,2);xs=[]
for y in ys:
    row=d[y,int(x0):];idx=np.where(row>thr)[0]
    # last foreground pixel before a run of background to the right edge
    bgi=np.where(row<=thr)[0]
    # right silhouette = first index after which all remaining are background
    last=len(row)-1
    while last>0 and row[last]<=thr: last-=1
    # sub-pixel by threshold crossing
    xs.append(x0+last)
xs=np.array(xs,float)
for y,x in list(zip(ys,xs))[::6]: print(int(y),round(x,1),'r_px',round(x-x0,1),'r_mm',round((x-x0)/k,2))
# piecewise linear fit
from itertools import combinations
n=len(ys)
def cost(i,j):
    A=np.vstack([ys[i:j+1],np.ones(j-i+1)]).T;c,res,_,_=np.linalg.lstsq(A,xs[i:j+1],rcond=None)
    return ((A@c-xs[i:j+1])**2).sum(),c
INF=1e18;m=8
best=[[INF]*(n) for _ in range(nseg+1)];arg=[[0]*(n) for _ in range(nseg+1)]
cc={}
def C(i,j):
    if (i,j) not in cc: cc[(i,j)]=cost(i,j)
    return cc[(i,j)]
for j in range(m,n):
    best[1][j]=C(0,j)[0]
for s in range(2,nseg+1):
    for j in range(s*m,n):
        for i in range((s-1)*m,j-m+1,2):
            v=best[s-1][i-1]+C(i,j)[0]
            if v<best[s][j]: best[s][j]=v;arg[s][j]=i
cuts=[];j=n-1
for s in range(nseg,1,-1):
    i=arg[s][j];cuts.append(i);j=i-1
cuts=sorted(cuts);edges=[0]+cuts+[n]
for a,b2 in zip(edges[:-1],edges[1:]):
    c=C(a,b2-1)[1];print('seg y %d-%d  dx/dy %.3f  (angle from vertical %.1f deg) r_start %.1f mm r_end %.1f mm'%(ys[a],ys[b2-1],c[0],np.degrees(np.arctan(c[0])),(c[0]*ys[a]+c[1]-x0)/k,(c[0]*ys[b2-1]+c[1]-x0)/k))
