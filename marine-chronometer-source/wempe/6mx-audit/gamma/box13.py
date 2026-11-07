"""Gamma (box fork): Kirov 247's inner box body in 13_Kirow_247_Kasten_1.jpg (oblique, leaning back). The body's front face is bounded
by the lower parting groove (darkest row per column), its bottom edge (the wood's step onto the dark felt, red channel along columns),
its left edge (the front onto the shaded side, along rows) and its right edge (onto the light background). The quad from those four
lines is rectified to a rectangle of width 1 and height a; a is chosen so that the number plate (its outer edge, rays, sub-pixel) comes
out round (the plate is a circle: 14_ shows it round to 2 %), and checked against the hasp's screws (their spacing ratio from 14_).
Gives the body tier's height and the plate's size and place as fractions of the front's width."""
import cv2,numpy as np,json
from zcal import fitc
IMG='E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx-gallery/leben-des-6mx/13_Kirow_247_Kasten_1.jpg'
im=cv2.imread(IMG).astype(np.float32); Lu=cv2.GaussianBlur(im.mean(2),(3,3),0.8); R=cv2.GaussianBlur(im[:,:,2],(3,3),0.8)
def prof(ch,P0,u,t0,t1):
    t=np.arange(t0,t1,0.2); xs=P0[0]+t*u[0]; ys=P0[1]+t*u[1]; return t,cv2.remap(ch,np.float32(xs[None]),np.float32(ys[None]),cv2.INTER_LINEAR)[0]
def stepat(ch,P0,u,t0,t1,sign,thr=3):
    t,v=prof(ch,P0,u,t0,t1); d=np.gradient(v)*sign; i=int(np.argmax(d))
    if d[i]<thr or i<2 or i>len(d)-3: return None
    a,b,c=d[i-1],d[i],d[i+1]; o=(a-c)/(2*(a-2*b+c)+1e-9); s=t[i]+o*0.2; return (P0[0]+s*u[0],P0[1]+s*u[1])
def valley(ch,P0,u,t0,t1):
    t,v=prof(ch,P0,u,t0,t1); i=int(np.argmin(v))
    if i<1 or i>len(v)-2: return None
    a,b,c=v[i-1],v[i],v[i+1]; o=(a-c)/(2*(a-2*b+c)+1e-9); s=t[i]+o*0.2; return (P0[0]+s*u[0],P0[1]+s*u[1])
def line(p):
    p=np.array([q for q in p if q is not None])
    for _ in range(3):
        m=p.mean(0); _,_,vt=np.linalg.svd(p-m); n=vt[1]; r=(p-m)@n; k=np.abs(r)<3*1.4826*np.median(np.abs(r))+0.25; p=p[k]
    m=p.mean(0); _,_,vt=np.linalg.svd(p-m); n=vt[1]; return np.r_[n,-n@m],((p-m)@n).std(),len(p)
def X(l1,l2): h=np.cross(l1,l2); return h[:2]/h[2]
def guessy(x,a,b): return a+(b-a)*(x-180)/(600-180)
lines={}
lines['parting']=line([valley(Lu,(x,guessy(x,428,413)-8),(0,1),0,16) for x in list(range(192,330,2))+list(range(455,585,2))])
lines['bottom']=line([stepat(R,(x,guessy(x,648,618)+10),(0,-1),0,20,1) for x in range(275,540,2)])   # going up: felt (dark) -> wood (bright red)
lines['left']=line([stepat(R,(170,y),(1,0),0,22,1) for y in list(range(440,480,2))+list(range(530,615,2))])
lines['right']=line([stepat(Lu,(guessy(y,585,612)-12+((y-315)/325.)*0,y),(1,0),0,24,1) for y in list(range(440,458,2))+list(range(505,590,2))])
for k,(l,s,n) in lines.items(): print('%-8s rms %.2f px, n %d'%(k,s,n))
Q=np.array([X(lines['parting'][0],lines['left'][0]),X(lines['parting'][0],lines['right'][0]),X(lines['bottom'][0],lines['right'][0]),X(lines['bottom'][0],lines['left'][0])])
print('corners (TL,TR,BR,BL):',np.round(Q,1).tolist())
# the plate's outer edge in the image
c0=np.array((400.,512.)); pp=[]
for ad in np.arange(0,360,2):
    if 75<ad<105 or 255<ad<285: continue
    a=np.radians(ad); q=stepat(R,c0,(np.cos(a),np.sin(a)),25,48,1)
    if q is not None: pp.append(q)
pp=np.array(pp); q,sd,rms,n=fitc(pp); print('plate in the image: centre %.1f,%.1f r %.2f px rms %.2f n %d'%(q[0],q[1],q[2],rms,n))
def rect(a):
    Hm=cv2.getPerspectiveTransform(np.float32(Q),np.float32([[0,0],[1,0],[1,a],[0,a]])); return Hm
def tr(Hm,p): p=np.c_[p,np.ones(len(p))]@Hm.T; return p[:,:2]/p[:,2:]
best=None
for a in np.arange(0.3,0.8,0.0005):
    e=cv2.fitEllipse(np.float32(tr(rect(a),pp)*1000)); ratio=min(e[1])/max(e[1])
    if best is None or ratio>best[1]: best=(a,ratio,e)
a,ratio,e=best
Hm=rect(a); cp=tr(Hm,pp); qq,sd2,rms2,n2=fitc(cp)
print('round plate at a = %.4f (ellipse ratio %.4f): the body tier is %.4f of the width; plate Ø %.4f of the width, centre at x %.4f, %.4f below the parting (%.4f of the tier)'%(a,ratio,a,2*qq[2],qq[0],qq[1],qq[1]/a))
# sensitivity: the a range where the ratio is within 0.005 of best
ok=[aa for aa in np.arange(0.3,0.8,0.0005) if (lambda e:min(e[1])/max(e[1]))(cv2.fitEllipse(np.float32(tr(rect(aa),pp)*1000)))>ratio-0.01]
print('a within 1 %% of round: %.4f-%.4f'%(min(ok),max(ok)))
json.dump(dict(Q=Q.tolist(),a=a,plateD=2*qq[2],platec=qq[:2].tolist(),arange=[min(ok),max(ok)]),open('box13.json','w'),indent=1)
