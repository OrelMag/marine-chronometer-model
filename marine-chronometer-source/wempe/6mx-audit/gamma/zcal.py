"""Gamma, 6MX audit: Kirov 247 Z view, dial-plane calibration on the printed circles about the three arbors.
Each printed line is found along rays from a rough centre as the darkest point (a parabola through the minimum),
then a circle is fitted (algebraic, then geometric); the centres of the up-and-down circle and the seconds circle
are the arbors at z -23 and +23 (the sheets'), the minute track's the centre arbor."""
import cv2, numpy as np, json, sys
from scipy.optimize import least_squares
IMG='E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx/1_Kirow_247_Z.jpg'
im=cv2.imread(IMG); g=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY).astype(float)
def samp(x,y): return cv2.remap(g.astype(np.float32),np.float32(x),np.float32(y),cv2.INTER_LINEAR)
def line_pts(c,r0,r1,angs,dark=True):
    pts=[]
    for a in np.radians(angs):
        rr=np.arange(r0,r1,0.25); x=c[0]+rr*np.cos(a); y=c[1]+rr*np.sin(a)
        v=samp(x[None],y[None])[0]
        if not dark: v=-v
        i=int(np.argmin(v))
        if i<2 or i>len(v)-3: continue
        if v[i]>np.median(v)-40: continue  # no clear line
        # parabola
        y0,y1,y2=v[i-1],v[i],v[i+1]; d=(y0-y2)/(2*(y0-2*y1+y2)+1e-9)
        r=rr[i]+d*0.25; pts.append((c[0]+r*np.cos(a),c[1]+r*np.sin(a)))
    return np.array(pts)
def fitc(p):
    x,y=p[:,0],p[:,1]; A=np.c_[2*x,2*y,np.ones_like(x)]; b=x*x+y*y
    s=np.linalg.lstsq(A,b,rcond=None)[0]; c0=[s[0],s[1],np.sqrt(s[2]+s[0]**2+s[1]**2)]
    for _ in range(3):
        f=lambda q:np.hypot(x-q[0],y-q[1])-q[2]
        r=least_squares(f,c0); res=f(r.x); k=np.abs(res-np.median(res))<3*1.4826*np.median(np.abs(res-np.median(res)))+0.3
        x,y=x[k],y[k]; c0=r.x
    r=least_squares(lambda q:np.hypot(x-q[0],y-q[1])-q[2],c0); res=np.hypot(x-r.x[0],y-r.x[1])-r.x[2]
    J=r.jac; cov=np.linalg.inv(J.T@J)*np.var(res)
    return r.x,np.sqrt(np.diag(cov)),res.std(),len(x)
def fitell(p):
    e=cv2.fitEllipse(p.astype(np.float32)); return e
if __name__=='__main__':
    out={}
    # rough centres from the photo: up-down (498,308), seconds (504,712), centre (498,513)
    jobs={'updown':((498,308),105,125,list(range(0,360,2))),
          'seconds':((504,712),150,175,list(range(180,360,2))),
          'minute':((498,513),385,410,list(range(0,360,1)))}
    for k,(c,r0,r1,angs) in jobs.items():
        p=line_pts(c,r0,r1,angs); q,sd,rms,n=fitc(p); e=fitell(p)
        out[k]=dict(c=q[:2].tolist(),r=q[2],sd=sd.tolist(),rms=rms,n=n,ell=[list(e[0]),list(e[1]),e[2]])
        print(k,np.round(q,2),'sd',np.round(sd,3),'rms',round(rms,2),'n',n,'ellipse axes',np.round(e[1],1),'ang',round(e[2],1))
    json.dump(out,open('zcal.json','w'),indent=1)
