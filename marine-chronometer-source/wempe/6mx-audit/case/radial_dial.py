"""Radial profiles of a face-on dial photo (Kirov 247, bezel off) to read the flange ring and the bowl's threaded rim
outside diameter against the flange's known diameter (105.95 mm) and the sub-dial spacing (46 mm). Usage: radial_dial.py IMG cx cy"""
import sys,cv2,numpy as np
im=cv2.imread(sys.argv[1]);cx,cy=float(sys.argv[2]),float(sys.argv[3])
g=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY).astype(float);hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV)
S=hsv[...,1].astype(float)
for a in range(0,360,30):
    t=np.radians(a);r=np.arange(380,520);x=cx+r*np.sin(t);y=cy-r*np.cos(t)
    ok=(x>=0)&(x<im.shape[1]-1)&(y>=0)&(y<im.shape[0]-1)
    if not ok.all(): 
        r=r[ok];x=x[ok];y=y[ok]
    v=cv2.remap(g,x.astype(np.float32).reshape(1,-1),y.astype(np.float32).reshape(1,-1),cv2.INTER_LINEAR)[0]
    s=cv2.remap(S,x.astype(np.float32).reshape(1,-1),y.astype(np.float32).reshape(1,-1),cv2.INTER_LINEAR)[0]
    print(a,'gray',' '.join('%d:%d'%(rr,vv) for rr,vv in zip(r[::6],v[::6])))
