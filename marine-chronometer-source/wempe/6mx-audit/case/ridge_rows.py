"""Ridge/groove spacing of a thread band seen near the front of the ellipse: mean of the (high-passed) gray image over a
column range, along y, so each thread ridge gives a peak; prints the peak rows and spacings in px, and the spacing in mm when
a px/mm and a foreshortening factor (cos elevation) are given. The ridges there run nearly horizontally; the mean over a
narrow column range keeps them straight enough. Usage: ridge_rows.py IMG x0 x1 y0 y1 [px_per_mm cos_el]"""
import sys,cv2,numpy as np
from scipy.signal import find_peaks
im=cv2.imread(sys.argv[1],0).astype(np.float32);x0,x1,y0,y1=map(int,sys.argv[2:6])
k=float(sys.argv[6]) if len(sys.argv)>6 else None;ce=float(sys.argv[7]) if len(sys.argv)>7 else 1
p=im[y0:y1,x0:x1].mean(axis=1);hp=p-cv2.GaussianBlur(p.reshape(-1,1),(0,0),6).ravel()
pk,_=find_peaks(hp,prominence=1.5);print('rows',[int(y0+i) for i in pk]);sp=np.diff(pk);print('spacing px',sp.tolist(),'mean',sp.mean() if len(sp) else None)
if k and len(sp): print('pitch mm = %.3f (spacing/(k*cos_el))'%(sp.mean()/(k*ce)))
