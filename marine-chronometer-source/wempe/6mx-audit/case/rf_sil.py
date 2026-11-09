"""Silhouette widths of a bowl photographed against a plain light background.
python rf_sil.py IMG y0 y1 step [thr=35]
Segments pixels differing from the border's median background colour by > thr (Lab distance), keeps the largest blob
and prints, per row, left x, right x and width in px. Used on DG's 2973 'E-Kontakt4' (bowl side-on) to read the
rim, body and cone silhouette."""
import sys, cv2, numpy as np
im=cv2.imread(sys.argv[1]); y0,y1,st=map(int,sys.argv[2:5]); thr=float(sys.argv[5]) if len(sys.argv)>5 else 35
lab=cv2.cvtColor(im,cv2.COLOR_BGR2LAB).astype(float)
b=np.concatenate([lab[:20].reshape(-1,3),lab[:, :12].reshape(-1,3),lab[:,-12:].reshape(-1,3)]); bg=np.median(b,0)
d=np.linalg.norm(lab-bg,axis=2); m=(d>thr).astype(np.uint8)
m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((5,5),np.uint8))
n,l,s,_=cv2.connectedComponentsWithStats(m); k=1+np.argmax(s[1:,4]); m=(l==k)
cv2.imwrite(sys.argv[1].rsplit('.',1)[0].split('/')[-1]+'_mask.png' if False else 'E:/mc-video/oq/6mx-case/rf/sil_mask.png',m.astype(np.uint8)*255)
for y in range(y0,y1,st):
    xs=np.where(m[y])[0]
    if len(xs): print(y,xs[0],xs[-1],xs[-1]-xs[0])
