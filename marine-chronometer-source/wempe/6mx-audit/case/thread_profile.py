"""Thread profile along a silhouette extreme: x(y) of the left/right silhouette of a bowl photographed from slightly above
(light plain background), sub-pixel by interpolating the threshold crossing on a distance-from-background image; a quadratic
(the ellipse's curvature) is removed over the given window and the residual is printed, so crests/roots of the thread show as
a periodic ripple. Reports the ripple's period from its autocorrelation. Usage: thread_profile.py IMG side(L|R) y0 y1 [thr]"""
import sys,cv2,numpy as np
im=cv2.imread(sys.argv[1]);side=sys.argv[2];y0,y1=int(sys.argv[3]),int(sys.argv[4]);thr=float(sys.argv[5]) if len(sys.argv)>5 else 40
b=np.concatenate([im[:8].reshape(-1,3)]);bg=np.median(b,axis=0)
d=np.linalg.norm(cv2.GaussianBlur(im.astype(np.float32),(0,0),0.8)-bg,axis=2)
W=im.shape[1];xs=[];ys=np.arange(y0,y1)
for y in ys:
    row=d[y]
    if side=='R':
        i=W-1
        while i>0 and row[i]<thr: i-=1
        x=i+(row[i]-thr)/max(row[i]-row[min(i+1,W-1)],1e-3)
    else:
        i=0
        while i<W-1 and row[i]<thr: i+=1
        x=i-(row[i]-thr)/max(row[i]-row[max(i-1,0)],1e-3)
    xs.append(x)
xs=np.array(xs);p=np.polyfit(ys,xs,2);res=xs-np.polyval(p,ys)
for y,x,r in zip(ys,xs,res): print(y,round(x,1),round(r,2))
r=res-res.mean();ac=np.correlate(r,r,'full')[len(r)-1:];ac/=ac[0]
pk=[i for i in range(3,len(ac)-1) if ac[i]>ac[i-1] and ac[i]>=ac[i+1] and ac[i]>0.2]
print('autocorr peaks (lag px,val):',[(i,round(ac[i],2)) for i in pk[:5]])
