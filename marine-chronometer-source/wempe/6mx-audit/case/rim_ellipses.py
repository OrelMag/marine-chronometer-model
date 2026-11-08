"""Face-on dial photo (Kirov 247, bezel off): fit ellipses (robust, by iterated trimmed least squares via cv2.fitEllipse)
to (1) the gilt flange's outer edge and (2) the bowl rim's outer edge, from per-ray edge candidates about a rough centre.
Prints semi-axes, ratio, and scale from flange = 105.95 mm. Usage: rim_ellipses.py IMG cx cy out.png"""
import sys,cv2,numpy as np
im=cv2.imread(sys.argv[1]);cx,cy=float(sys.argv[2]),float(sys.argv[3])
hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV);S=cv2.GaussianBlur(hsv[...,1].astype(np.float32),(0,0),1.2)
g=cv2.GaussianBlur(cv2.cvtColor(im,cv2.COLOR_BGR2GRAY).astype(np.float32),(0,0),1.2)
def rays(f,rmin,rmax,sign):
    pts=[]
    for a in np.arange(0,360,2):
        t=np.radians(a);r=np.arange(rmin,rmax,0.25)
        x=(cx+r*np.sin(t)).astype(np.float32);y=(cy-r*np.cos(t)).astype(np.float32)
        if x.min()<0 or y.min()<0 or x.max()>=im.shape[1]-1 or y.max()>=im.shape[0]-1: continue
        v=cv2.remap(f,x.reshape(1,-1),y.reshape(1,-1),cv2.INTER_LINEAR)[0]
        d=np.gradient(cv2.GaussianBlur(v.reshape(1,-1),(0,0),2.0)[0])*sign
        i=np.argmax(d)
        pts.append((x[i],y[i],a,d[i]))
    return np.array(pts)
def robust(pts,it=6):
    P=pts[:,:2].astype(np.float32);keep=np.ones(len(P),bool)
    for _ in range(it):
        e=cv2.fitEllipse(P[keep]);(ex,ey),(w,h),ang=e
        # residual: algebraic radial distance
        th=np.radians(ang);c,s=np.cos(th),np.sin(th)
        dx=P[:,0]-ex;dy=P[:,1]-ey;u=(dx*c+dy*s)/(w/2);v=(-dx*s+dy*c)/(h/2)
        rr=np.sqrt(u*u+v*v)-1;res=rr*(w+h)/4
        sd=np.std(res[keep]);keep=np.abs(res)<max(2*sd,1.0)
    return e,res,keep
out=im.copy()
for name,f,rmin,rmax,sign in [('flange outer (S drop)',S,430,480,-1),('rim outer (gray rise)',g,470,520,+1)]:
    pts=rays(f,rmin,rmax,sign);e,res,keep=robust(pts)
    (ex,ey),(w,h),ang=e;print(name,'n',len(pts),'kept',keep.sum(),'centre',round(ex,1),round(ey,1),'axes',round(w,1),round(h,1),'ang',round(ang,1),'rms',round(np.std(res[keep]),2))
    for p,k in zip(pts,keep): cv2.circle(out,(int(p[0]),int(p[1])),2,(0,255,0) if k else (0,0,255),-1)
    globals()[name[:3]]=e
cv2.imwrite(sys.argv[4],out)
a=globals()['fla'];b=globals()['rim']
for i in (0,1):
    print('axis',i,'rim/flange',b[1][i]/a[1][i])
