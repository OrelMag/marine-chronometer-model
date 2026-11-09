"""Silhouette of a part against a plain light background: for each image row the left and right foreground x (background =
pixels close to the median of the image's border colour), printed every N rows with width. Usage: silhouette_rows.py IMG [step] [thr] [out.png]
Used to read the bowl's widths (collar, thread, body) from side/oblique photos; horizontal extent = true diameter for a telephoto view."""
import sys,cv2,numpy as np
im=cv2.imread(sys.argv[1]);step=int(sys.argv[2]) if len(sys.argv)>2 else 10;thr=float(sys.argv[3]) if len(sys.argv)>3 else 35
b=np.concatenate([im[:12].reshape(-1,3),im[:,:6].reshape(-1,3),im[:,-6:].reshape(-1,3)]);bg=np.median(b,axis=0)
d=np.linalg.norm(im.astype(float)-bg,axis=2);m=(d>thr).astype(np.uint8)
m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
print('bg',bg)
out=im.copy()
for y in range(0,im.shape[0],step):
    xs=np.where(m[y])[0]
    if len(xs)==0: continue
    print(y,xs[0],xs[-1],xs[-1]-xs[0]);cv2.circle(out,(xs[0],y),2,(0,0,255),-1);cv2.circle(out,(xs[-1],y),2,(0,0,255),-1)
if len(sys.argv)>4: cv2.imwrite(sys.argv[4],out)
