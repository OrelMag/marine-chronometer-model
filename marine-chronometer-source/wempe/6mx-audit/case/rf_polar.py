"""Polar unwrap of an image about a centre: python rf_polar.py IMG cx cy r0 r1 OUT [dr=1] [dth=0.5]
Rows = radius (r0 at top, r1 at bottom), columns = angle 0..360 (image x right, y down; 0 = +x, clockwise on screen).
Gridlines every 20 px of radius and 30 deg. Ellipse-like edges show as sinusoids; used to read ring/bezel edges."""
import sys, cv2, numpy as np
im=cv2.imread(sys.argv[1]); cx,cy,r0,r1=map(float,sys.argv[2:6]); out=sys.argv[6]
dr=float(sys.argv[7]) if len(sys.argv)>7 else 1; dth=float(sys.argv[8]) if len(sys.argv)>8 else .5
th=np.deg2rad(np.arange(0,360,dth)); r=np.arange(r0,r1,dr)
X=cx+r[:,None]*np.cos(th)[None]; Y=cy+r[:,None]*np.sin(th)[None]
p=cv2.remap(im,X.astype(np.float32),Y.astype(np.float32),cv2.INTER_CUBIC)
p=cv2.resize(p,None,fx=2.5,fy=2.5/dr*dr if False else 2.5)
for a in range(0,360,30):
    X0=int(a/dth*2.5); cv2.line(p,(X0,0),(X0,p.shape[0]),(0,255,255),1); cv2.putText(p,str(a),(X0+2,12),0,.45,(0,0,255),1)
for rr in range(int(r0//20*20+20),int(r1),20):
    Y0=int((rr-r0)/dr*2.5); cv2.line(p,(0,Y0),(p.shape[1],Y0),(0,255,255),1); cv2.putText(p,str(rr),(2,Y0-2),0,.45,(0,0,255),1)
cv2.imwrite(out,p)
