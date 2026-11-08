"""Camera elevation from the back arc of a rim silhouette: with the rim's widest extents giving a (semi-major, px) and centre x,
fit y = cy - b*sqrt(1-((x-cx)/a)^2) to the top silhouette (background = light plain), giving b (semi-minor), so
sin(elevation) = b/a (pinhole far away; perspective ignored). Usage: elev_from_arc.py IMG xl xr [thr] [xmargin]"""
import sys,cv2,numpy as np
from scipy.optimize import least_squares
im=cv2.imread(sys.argv[1]);xl,xr=float(sys.argv[2]),float(sys.argv[3]);thr=float(sys.argv[4]) if len(sys.argv)>4 else 30;mg=int(sys.argv[5]) if len(sys.argv)>5 else 80
b=np.concatenate([im[:8].reshape(-1,3)]);bg=np.median(b,axis=0)
d=np.linalg.norm(cv2.GaussianBlur(im.astype(np.float32),(0,0),1.0)-bg,axis=2)
a=(xr-xl)/2;cx=(xr+xl)/2
X=[];Y=[]
for x in range(int(xl)+mg,int(xr)-mg,4):
    col=np.where(d[:,x]>thr)[0]
    if len(col): X.append(x);Y.append(col[0])
X=np.array(X,float);Y=np.array(Y,float)
f=lambda p:p[0]-p[1]*np.sqrt(np.clip(1-((X-cx)/a)**2,0,1))-Y
r=least_squares(f,[Y.min()+100,100],loss='soft_l1',f_scale=3)
cy,bb=r.x;print('a',a,'cx',cx,'cy',round(cy,1),'b',round(bb,1),'sin(el)',round(bb/a,3),'el',round(np.degrees(np.arcsin(min(1,bb/a))),1),'rms',round(np.sqrt(np.mean(r.fun**2)),2))
