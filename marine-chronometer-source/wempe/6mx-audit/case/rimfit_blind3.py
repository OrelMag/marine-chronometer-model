"""Rim-top edge conic, free centre/semi-axes (axis-aligned ellipse), fitted to top-silhouette columns in
given x ranges; draws it over the photo. usage: rimfit_blind3.py PREFIX IMG ranges [signs]
prints ellipse; ratio b/a and edge y at queried x (env Q='x1,x2,...')."""
import sys,os,numpy as np,cv2
from scipy.optimize import least_squares
p,img,rg=sys.argv[1:4]
t=np.load(p+'_top.npy');sel=np.zeros(len(t),bool)
for r in rg.split(','):
    u,v=map(int,r.split('-'));sel|=(t[:,0]>=u)&(t[:,0]<=v)
x=t[sel,0].astype(float);y=t[sel,1].astype(float)
def mdl(q,x):xc,yc,a,b=q;return yc-b*np.sqrt(np.clip(1-((x-xc)/a)**2,0,None))
r=least_squares(lambda q:y-mdl(q,x),[512,y.max(),500,200]);q=r.x
print('xc,yc,a,b',q.round(1),'rms',np.sqrt(np.mean(r.fun**2)).round(2),'b/a',(q[3]/q[2]).round(3))
for X in os.environ.get('Q','').split(','):
    if X:print('edge y at x',X,mdl(q,float(X)).round(1))
im=cv2.imread(img)
for xx in range(int(q[0]-q[2]),int(q[0]+q[2]),3):
    cv2.circle(im,(xx,int(mdl(q,xx))),1,(0,0,255),-1)
cv2.imwrite(p+'_fit3.jpg',im)
