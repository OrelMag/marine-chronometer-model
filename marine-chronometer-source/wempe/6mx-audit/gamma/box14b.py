"""Gamma (box fork): 14_'s hasps and diamond. Each hasp's side edges (dark plate against the wood, the red channel's step) found
along rows and fitted as lines; its points (top and bottom, the scalloped ends' tips) as the extreme of the plate's mask in the red
channel thresholded by Otsu; the four screws' heads and the knob as circles (luma steps, rays). The diamond's four edges as lines
(rows/columns crossing it), its vertices their intersections. Units: the number plate's outer Ø (200.68 px) and face Ø (190.69 px)."""
import cv2,numpy as np,json
import box14 as B
im=cv2.imread(B.IMG).astype(np.float32); R=cv2.GaussianBlur(im[:,:,2],(3,3),0.8); Lu=cv2.GaussianBlur(im.mean(2),(3,3),0.8)
U=200.68
def rowedge(y,x0,x1,sign,ch):
    t=np.arange(x0,x1,0.2); v=cv2.remap(ch,np.float32(t[None]),np.float32(np.full_like(t,y)[None]),cv2.INTER_LINEAR)[0]
    d=np.gradient(v)*sign; i=int(np.argmax(d))
    if d[i]<3 or i<2 or i>len(d)-3: return None
    a,b,c=d[i-1],d[i],d[i+1]; o=(a-c)/(2*(a-2*b+c)+1e-9); return t[i]+o*0.2
def vline(ys,x0,x1,sign,ch=R):
    p=np.array([(rowedge(y,x0,x1,sign,ch),y) for y in ys]); p=p[[a is not None for a in p[:,0]]].astype(float)
    A=np.c_[np.ones(len(p)),p[:,1]]; s=np.linalg.lstsq(A,p[:,0],rcond=None)[0]; r=p[:,0]-A@s; k=np.abs(r)<3*1.4826*np.median(np.abs(r))+0.3
    s=np.linalg.lstsq(A[k],p[k,0],rcond=None)[0]; return s,(p[k,0]-A[k]@s).std(),k.sum()
out={}
for nm,(ya,yb,yc,xl,xr) in {'upper hasp':(75,215,142,160,490),'lower hasp':(525,665,592,165,492)}.items():
    ys=[y for y in range(ya,yb,2) if abs(y-yc)>8]
    sl,el,nl=vline(ys,xl-15,xl+15,-1); sr,er,nr=vline(ys,xr-15,xr+15,1)
    w=(sr[0]+sr[1]*yc)-(sl[0]+sl[1]*yc)
    # mask for the tips
    x0,x1=int(xl)-10,int(xr)+10; y0,y1=ya-40,yb+40; sub=R[y0:y1,x0:x1].astype(np.uint8)
    t,m=cv2.threshold(sub,0,255,cv2.THRESH_BINARY_INV+cv2.THRESH_OTSU); n,lab,st,cen=cv2.connectedComponentsWithStats(m)
    k=1+np.argmax(st[1:,4]); ys_,xs_=np.nonzero(lab==k); top=ys_.min()+y0; bot=ys_.max()+y0
    # sub-pixel tips: column-wise step along the tip column
    xc=(xl+xr)/2
    def colstep(yA,yB,sign):
        t_=np.arange(yA,yB,0.2); v=cv2.remap(R,np.float32(np.full_like(t_,xc)[None]),np.float32(t_[None]),cv2.INTER_LINEAR)[0]; d=np.gradient(v)*sign; i=int(np.argmax(d))
        a,b,c=d[i-1],d[i],d[i+1]; o=(a-c)/(2*(a-2*b+c)+1e-9); return t_[i]+o*0.2
    tt=colstep(top-8,top+8,-1); bb=colstep(bot-8,bot+8,1)
    out[nm]=dict(left=sl.tolist(),right=sr.tolist(),w_px=w,top=tt,bot=bb,parting=yc,xc=xc)
    print('%-11s width at the parting %.2f px = %.4f U (edges sd %.2f/%.2f, n %d/%d; lean %.4f/%.4f); tip to tip %.2f px = %.4f U; tips %.2f above, %.2f below the parting line'%(nm,w,w/U,el,er,nl,nr,sl[1],sr[1],bb-tt,(bb-tt)/U,yc-tt,bb-yc))
json.dump(out,open('box14b.json','w'),indent=1)
