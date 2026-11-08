"""Silhouette of the bowl in a photograph (brass vs grey background), saved as a mask
and the top silhouette arc (for the rim ellipse fit). usage: sil.py IMG OUTPREFIX"""
import sys,cv2,numpy as np
im=cv2.imread(sys.argv[1]);hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV)
m=(hsv[...,1]>70).astype(np.uint8)
m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((9,9),np.uint8))
n,l,st,_=cv2.connectedComponentsWithStats(m);k=1+np.argmax(st[1:,4]);m=(l==k).astype(np.uint8)
cv2.imwrite(sys.argv[2]+'_mask.png',m*255)
H,W=m.shape
top=[(x,int(np.argmax(m[:,x]))) for x in range(W) if m[:,x].any()]
np.save(sys.argv[2]+'_top.npy',np.array(top))
ys,xs=np.nonzero(m);print('x range',xs.min(),xs.max(),'top y',ys.min())
for y in range(0,H,40):
    r=np.nonzero(m[y])[0]
    if len(r):print(y,r.min(),r.max())
