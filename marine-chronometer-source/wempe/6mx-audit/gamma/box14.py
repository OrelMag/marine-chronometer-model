"""Gamma (box fork): Kirov 247's box front square-on (14_Kirow_247_Kasten_2.jpg, 651x1024). Everything in units of the number
plate's outer diameter (a circle fitted to its dark rim's outer edge, sub-pixel steps along 180 rays); the frame's frontality
checked by that circle's ellipse (aspect) and the parting lines' slope. Edges: steepest step along each normal, parabola-refined,
lines and circles fitted by least squares, MAD-trimmed."""
import cv2,numpy as np,json
from zcal import fitc
IMG='E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx-gallery/leben-des-6mx/14_Kirow_247_Kasten_2.jpg'
im=cv2.imread(IMG).astype(np.float32); L=cv2.GaussianBlur(im.mean(2),(3,3),0.8)
def step(x,y,ux,uy,r0,r1,sign):
    t=np.arange(r0,r1,0.2); xs=x+t*ux; ys=y+t*uy
    v=cv2.remap(L,np.float32(xs[None]),np.float32(ys[None]),cv2.INTER_LINEAR)[0]; d=np.gradient(v)*sign; i=int(np.argmax(d))
    if d[i]<3 or i<2 or i>len(d)-3: return None
    a,b,c=d[i-1],d[i],d[i+1]; o=(a-c)/(2*(a-2*b+c)+1e-9); return t[i]+o*0.2
def circle(c0,r0,r1,sign,angs=np.arange(0,360,2),skip=()):
    p=[]
    for ad in angs:
        if any(a<=ad<=b for a,b in skip): continue
        a=np.radians(ad); s=step(c0[0],c0[1],np.cos(a),np.sin(a),r0,r1,sign)
        if s is not None: p.append((c0[0]+s*np.cos(a),c0[1]+s*np.sin(a)))
    p=np.array(p); q,sd,rms,n=fitc(p); e=cv2.fitEllipse(p.astype(np.float32)); return q,sd,rms,n,e
def valley_rows(x0,x1,y0,y1):
    """the groove: darkest row in [y0,y1] per column, parabola-refined; a line y = a + b x fitted"""
    pts=[]
    for x in range(x0,x1,3):
        v=L[y0:y1,x]; i=int(np.argmin(v))
        if 0<i<len(v)-1:
            a,b,c=v[i-1],v[i],v[i+1]; o=(a-c)/(2*(a-2*b+c)+1e-9); pts.append((x,y0+i+o))
    p=np.array(pts); A=np.c_[np.ones(len(p)),p[:,0]]; s=np.linalg.lstsq(A,p[:,1],rcond=None)[0]; r=p[:,1]-A@s
    k=np.abs(r)<3*1.4826*np.median(np.abs(r))+0.3; s=np.linalg.lstsq(A[k],p[k,1],rcond=None)[0]; r=p[k,1]-A[k]@s
    return s,r.std(),k.sum()
out={}
q,sd,rms,n,e=circle((327,840),80,112,1)   # dark rim -> orange wood outside: luma rises
D=2*q[2]; out['plate']=dict(c=q[:2].tolist(),D_px=D,rms=rms,n=n,ell=[e[1][0],e[1][1],e[2]])
print('number plate: centre %.1f,%.1f  dia %.2f px (sd %.2f, rms %.2f, n %d); ellipse axes %.1f %.1f (aspect %.4f) at %.0f deg'%(q[0],q[1],D,2*sd[2],rms,n,e[1][0],e[1][1],min(e[1])/max(e[1]),e[2]))
U=D
for nm,(y0,y1) in {'upper parting line':(135,160),'lower parting line':(572,598)}.items():
    s1,sd1,n1=valley_rows(5,150,y0,y1); s2,sd2,n2=valley_rows(505,645,y0,y1)
    yl=s1[0]+s1[1]*327; yr=s2[0]+s2[1]*327
    out[nm]=dict(left=s1.tolist(),right=s2.tolist(),y_at_plate=(yl+yr)/2)
    print('%-20s left y=%.2f%+.4fx (sd %.2f n %d), right y=%.2f%+.4fx (sd %.2f n %d); at x 327: %.2f / %.2f'%(nm,s1[0],s1[1],sd1,n1,s2[0],s2[1],sd2,n2,yl,yr))
yu=out['upper parting line']['y_at_plate']; yl=out['lower parting line']['y_at_plate']
print('partings apart (the middle tier): %.2f px = %.4f plate dia'%(yl-yu,(yl-yu)/U))
print('lower parting to plate centre: %.2f px = %.4f plate dia'%(q[1]-yl,(q[1]-yl)/U))
out['U']=U; json.dump(out,open('box14.json','w'),indent=1)
