"""Rim-top front-edge ellipse for low-elevation photos: like rimfit_blind.py but fits only silhouette
columns in given x ranges (bracket/hook tabs excluded) and draws the fit over the photo.
usage: rimfit_blind2.py PREFIX IMG x0-x1[,x0-x1...]"""
import sys,numpy as np,cv2
from scipy.optimize import least_squares
p,img,rg=sys.argv[1:4]
t=np.load(p+'_top.npy');m=cv2.imread(p+'_mask.png',0)>0
cols=np.nonzero(m.any(0))[0];a=(cols.max()-cols.min())/2;xc=(cols.max()+cols.min())/2
sel=np.zeros(len(t),bool)
for r in rg.split(','):
    u,v=map(int,r.split('-'));sel|=(t[:,0]>=u)&(t[:,0]<=v)
x=t[sel,0];y=t[sel,1]
def f(q,s):yc,b=q;return yc-b*s*np.sqrt(np.clip(1-((x-xc)/a)**2,0,None))
# near edge (convex up, from below): y=yc-b*sqrt ; far edge convex-up too but with b>0 same form; sign of elevation ambiguous
r=least_squares(lambda q:y-f(q,1),[y.max(),a*.2]);yc,b=r.x
print('a',a,'xc',xc,'s',2*a/110.1,'yc',yc,'b',b,'rms',np.sqrt(np.mean(r.fun**2)),'|sin e|',b/a,np.degrees(np.arcsin(min(1,abs(b)/a))))
im=cv2.imread(img)
for xx in range(int(xc-a),int(xc+a),4):
    v=1-((xx-xc)/a)**2
    if v>=0:cv2.circle(im,(xx,int(yc-b*np.sqrt(v))),1,(0,0,255),-1)
cv2.imwrite(p+'_fit.jpg',im)
