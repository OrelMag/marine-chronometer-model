"""Gamma (box fork): 13_'s lower hasp's four screws (bright heads on the dark plate: luma-weighted centroid above the local
median in a 9 px window, iterated) mapped through box13's rectification; the a at which their spacing ratio (up-down / across)
is 14_'s 0.3245 (82.78/255.24 px, both hasps) is a second, independent reading of the body tier's a. The hasp's sides (dark plate
on the wood, red channel along rows) give its width as a fraction of the front's."""
import cv2,numpy as np,json
exec(open('box13.py').read().split("lines={}")[0])
J=json.load(open('box13.json')); Q=np.array(J['Q'])
g=Lu
def cen(c):
    c=np.array(c,float)
    for _ in range(4):
        x0,y0=int(round(c[0]))-4,int(round(c[1]))-4; w=g[y0:y0+9,x0:x0+9]; m=np.clip(w-np.median(w)-5,0,None)
        ys,xs=np.mgrid[0:9,0:9]; c=np.array([x0+(m*xs).sum()/m.sum(),y0+(m*ys).sum()/m.sum()])
    return c
S=np.array([cen(c) for c in [(345,410),(434,406),(349,440),(438,435)]]); print('screws',np.round(S,2).tolist())
def rect(a): return cv2.getPerspectiveTransform(np.float32(Q),np.float32([[0,0],[1,0],[1,a],[0,a]]))
def tr(Hm,p): p=np.c_[p,np.ones(len(p))]@Hm.T; return p[:,:2]/p[:,2:]
rs=[]
for a in np.arange(0.40,0.62,0.001):
    s=tr(rect(a),S); dx=((s[1]-s[0])[0]+(s[3]-s[2])[0])/2; dy=((s[2]-s[0])[1]+(s[3]-s[1])[1])/2; rs.append((a,dy/dx,dx))
rs=np.array(rs); i=np.argmin(np.abs(rs[:,1]-0.3245)); print('screws give a = %.3f (spacing across %.4f of the width)'%(rs[i,0],rs[i,2]))
# 1 px of centroid error on dy: sensitivity
for e in (-1,1):
    S2=S.copy(); S2[2:,1]+=e; rr=[]
    for a in np.arange(0.40,0.62,0.001):
        s=tr(rect(a),S2); dx=((s[1]-s[0])[0]+(s[3]-s[2])[0])/2; dy=((s[2]-s[0])[1]+(s[3]-s[1])[1])/2; rr.append((a,dy/dx))
    rr=np.array(rr); print('  with the lower screws %+d px: a = %.3f'%(e,rr[np.argmin(np.abs(rr[:,1]-0.3245)),0]))
