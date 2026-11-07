"""Gamma: the movement ring's three screws on the train-side (A) photographs of Kirov 247, Kirov 009 and Poljot 20027, without a camera:
the top plate's rim (r 42.494, the drawings') found along rays as the strongest step and fitted as an ellipse (its centre, axes and tilt
map the image to the plate's plan, to first order); each ring screw's head, half under the plate's edge, fitted over its visible arc
(sector fit); bearings about the plate's centre in the plan the ellipse gives, and the gaps between the screws, which need no 12 o'clock.
The screws stand about 20 mm below the plate's rim: on these long-lens views (about 630 mm) that scales their radius by about 3 % about
the image centre, close to the plate's centre, which leaves their bearings within about 0.1°. Mirror: the A view is from the train side,
so the image's clockwise is brg's (counterclockwise seen from the dial)."""
import cv2,numpy as np,json,sys
from sector import sector
from zcal import fitc
D='E:/Marine-Chronometer/References/wempe/photos/'
J={'247':(D+'dg-chrono-6mx/2_Kirow_247_A.jpg',(515,505),[((400,145),180,370),((889,593),-80,80),((178,662),130,235,1)]),
   '009':(D+'dg-chrono-6mx-gallery/bilder-zum-6mx/2_Kirow_009_A.jpg',(512,505),None),
   '20027':(D+'dg-chrono-6mx-gallery/bilder-zum-6mx/2_Poljot_20027_A.jpg',(512,505),None)}
def rimell(g,O,r0=345,r1=400):
    gb=cv2.GaussianBlur(g,(5,5),1.2); pts=[]
    for ad in np.arange(0,360,1.5):
        a=np.radians(ad); rr=np.arange(r0,r1,0.25); x=O[0]+rr*np.cos(a); y=O[1]+rr*np.sin(a)
        v=cv2.remap(gb,np.float32(x[None]),np.float32(y[None]),cv2.INTER_LINEAR)[0]; d=np.abs(np.gradient(v)); i=int(np.argmax(d))
        if d[i]>4 and 2<i<len(d)-3: pts.append((x[i],y[i]))
    p=np.array(pts,np.float32)
    for _ in range(3):
        e=cv2.fitEllipse(p); c=np.array(e[0]); ax=np.array(e[1])/2; th=np.radians(e[2])
        R=np.array([[np.cos(th),np.sin(th)],[-np.sin(th),np.cos(th)]]); q=(p-c)@R.T; rn=np.hypot(q[:,0]/ax[0],q[:,1]/ax[1])
        k=np.abs(rn-1)<max(3*np.median(np.abs(rn-1)),0.004); p=p[k]
    e=cv2.fitEllipse(p); return e,len(p),np.median(np.abs(rn-1))*np.mean(ax)
def plan(e,uv):
    c=np.array(e[0]); ax=np.array(e[1])/2; th=np.radians(e[2]); R=np.array([[np.cos(th),np.sin(th)],[-np.sin(th),np.cos(th)]])
    q=(np.asarray(uv)-c)@R.T; q=q/ax*42.494; return q@R   # back into the image's orientation, now round
if __name__=='__main__':
    which=sys.argv[1]; path,O,scr=J[which]; im=cv2.imread(path); g=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY).astype(np.float32)
    e,n,rms=rimell(g,np.array(O,float)); print(which,'rim ellipse centre %.1f,%.1f axes %.1f %.1f ang %.1f (%d pts, %.2f px)'%(e[0][0],e[0][1],e[1][0]/2,e[1][1]/2,e[2],n,rms))
    if scr is None: sys.exit()
    out=[]
    for s in scr:
        c0,a0,a1=s[:3]; sg=-1 if len(s)>3 else 1
        q,sd,rr,nn,p=sector(g,np.array(c0,float),8,40,a0,a1,sign=1)
        P=plan(e,q[:2]); ang=np.degrees(np.arctan2(P[0],-P[1]))%360   # image-clockwise from image-up
        out.append((ang,np.hypot(*P),q[2]))
        print('  screw near %s: centre %.1f,%.1f (r %.1f px, rms %.2f, n %d) -> plan r %.2f, image-cw %.2f'%(c0,q[0],q[1],q[2],rr,nn,np.hypot(*P),ang))
    a=np.array([o[0] for o in out]); a=np.sort(a); gaps=np.diff(np.r_[a,a[0]+360]); print('  gaps (image clockwise from the first):',np.round(gaps,2))
