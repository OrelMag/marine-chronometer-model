"""Gamma (box fork): 13_'s outer box front, second pass. The catch: its disc by saturation (grey metal on orange wood), Otsu mask,
contour refined to the saturation step along its normals, ellipse fitted (the disc is round: its axis ratio is the face's vertical
foreshortening). The cut-out: the felt lining's dark region (luma Otsu) in the box's top, its lower boundary (where the felt meets
the wood, the wood's edge) refined to the luma step, mapped to the face's frame by the catch's ratio, a circle fitted. The front's
width at the catch's row from box13e's sides."""
import cv2,numpy as np,json
from zcal import fitc
IMG='E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx-gallery/leben-des-6mx/13_Kirow_247_Kasten_1.jpg'
im=cv2.imread(IMG); hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV); S=cv2.GaussianBlur(hsv[:,:,1].astype(np.float32),(3,3),0.8)
Lu=cv2.GaussianBlur(im.astype(np.float32).mean(2),(3,3),0.8)
def contour_refined(mask,ch,x0,y0,sign):
    cs,_=cv2.findContours(mask,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE); c=max(cs,key=len)[:,0,:].astype(float)+[x0,y0]; C=c.mean(0); out=[]
    for p in c:
        a=np.arctan2(p[1]-C[1],p[0]-C[0]); t=np.arange(-4,4,0.2); xs=p[0]+t*np.cos(a); ys=p[1]+t*np.sin(a)
        v=cv2.remap(ch,np.float32(xs[None]),np.float32(ys[None]),cv2.INTER_LINEAR)[0]; d=np.gradient(v)*sign; i=int(np.argmax(d))
        if 1<i<len(d)-2: out.append((xs[i],ys[i]))
    return np.array(out),C
x0,y0=360,765; sub=S[y0:y0+90,x0:x0+95].astype(np.uint8); t,m=cv2.threshold(sub,0,255,cv2.THRESH_BINARY_INV+cv2.THRESH_OTSU)
n,lab,st,_=cv2.connectedComponentsWithStats(m); k=1+np.argmax(st[1:,4]); m=cv2.morphologyEx((lab==k).astype(np.uint8),cv2.MORPH_CLOSE,np.ones((5,5),np.uint8))
pp,C=contour_refined(m,S,x0,y0,1); e=cv2.fitEllipse(np.float32(pp)); q,sd,rms,nn=fitc(pp)
ax=sorted(e[1]); kf=ax[0]/ax[1]
J=json.load(open('box13e.json')); W=J['W']
print('catch: centre %.1f,%.1f, axes %.2f/%.2f px at %.0f deg (ratio %.4f), %d points; Ø %.4f W'%(e[0][0],e[0][1],e[1][0],e[1][1],e[2],kf,len(pp),ax[1]/W))
# cut-out: dark felt region above y 790 in x 250-560
x0,y0=250,640; sub=Lu[y0:y0+150,x0:x0+320].astype(np.uint8); t,m=cv2.threshold(sub,0,255,cv2.THRESH_BINARY_INV+cv2.THRESH_OTSU)
n,lab,st,_=cv2.connectedComponentsWithStats(m); k=1+np.argmax(st[1:,4]); m=(lab==k).astype(np.uint8)
cs,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE); c=max(cs,key=len)[:,0,:].astype(float)+[x0,y0]
# its lower boundary: per column the lowest dark pixel, refined along the column to the luma rise
pts=[]
for x in range(int(c[:,0].min())+6,int(c[:,0].max())-6,2):
    col=c[np.abs(c[:,0]-x)<0.5]; 
    if len(col)==0: continue
    yb=col[:,1].max(); tt=np.arange(yb-5,yb+6,0.2); v=cv2.remap(Lu,np.float32(np.full_like(tt,x)[None]),np.float32(tt[None]),cv2.INTER_LINEAR)[0]; d=np.gradient(v); i=int(np.argmax(d))
    if 1<i<len(d)-2 and d[i]>1: pts.append((x,tt[i]))
pts=np.array(pts); f=pts.copy(); f[:,1]/=kf
qc,sdc,rmsc,nc=fitc(f)
print('cut-out lower edge: %d points, x %.0f-%.0f; circle r %.4f W (sd %.4f), rms %.2f px; centre x at %.1f px'%(len(pts),pts[:,0].min(),pts[:,0].max(),qc[2]/W,sdc[2]/W,rmsc,qc[0]))
vis=cv2.imread(IMG)
for p in pts: cv2.circle(vis,(int(p[0]),int(p[1])),1,(0,255,0),-1)
for p in pp: cv2.circle(vis,(int(p[0]),int(p[1])),1,(255,0,0),-1)
cv2.imwrite('E:/Marine-Chronometer/.claude/worktrees/6mx-gamma/marine-chronometer-source/wempe/6mx-audit/gamma/r_13cut.png',vis[640:860,80:681])
json.dump(dict(W=W,catch=dict(c=list(e[0]),D=ax[1]/W,k=kf),cut=dict(r=qc[2]/W,cx_px=qc[0],cy_face=qc[1],x_span=[pts[:,0].min(),pts[:,0].max()],ybottom=float(pts[:,1].max()))),open('box13f.json','w'),indent=1)
