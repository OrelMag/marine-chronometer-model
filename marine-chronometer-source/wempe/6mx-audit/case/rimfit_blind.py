"""Blind rim-top ellipse: from sil.py's top silhouette (far rim top edge), semi-major fixed from the
silhouette's width = 110.1 mm; fits yc and semi-minor b over |x-xc|<frac*a. Prints scale px/mm, elevation.
usage: rimfit_blind.py PREFIX [frac]"""
import sys,numpy as np
from scipy.optimize import least_squares
p=sys.argv[1];fr=float(sys.argv[2]) if len(sys.argv)>2 else .7
t=np.load(p+'_top.npy');import cv2
m=cv2.imread(p+'_mask.png',0)>0
cols=np.nonzero(m.any(0))[0];x0,x1=cols.min(),cols.max()
a=(x1-x0)/2;xc=(x0+x1)/2;s=2*a/110.1
sel=np.abs(t[:,0]-xc)<fr*a;x=t[sel,0];y=t[sel,1]
def res(q):
    yc,b=q;return y-(yc-b*np.sqrt(np.clip(1-((x-xc)/a)**2,0,None)))
r=least_squares(res,[y.max(),a*.4]);yc,b=r.x
print(p,'a',a,'xc',xc,'s',s,'yc',yc,'b',b,'rms',np.sqrt(np.mean(r.fun**2)),'elev',np.degrees(np.arcsin(b/a)))
