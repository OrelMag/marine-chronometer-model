"""The sustaining spring's outline (42016) from the owner's hand trace: tools/tracer.html's sspring_hand.trace.json, traced on KLUwI2UUCMQ 27:26 rectified
($MC_VIDEO/frames/r_KLUwI2UUCMQ_27-26_wheel40.png: 40 px/mm, the recess wall's centre at 0, x right, y down, the frame's own orientation; References/VIDEOS.md,
"The sustaining spring traced"). The trace is the silhouette the frame shows, side faces in: the faces its 19 deg tilt shows (the floor 0.36 mm toward its near
side, the tips' ellipse's minor axis at 95.9 deg) come off where the outline faces that way, never the band's outer edge, which lies against the wall. Prints
movement.js's SSI, SFT, SWT, SSG, the holes' angles back from the fixed tip and SPW (the holes and the pin measured on the same frame: the nearer hole at
159.23 deg, the pin at 125.2, the far hole 40.1 beyond the nearer as first read), and SWL, SFL (the lobes' ends where the b* trace put them, 97.57 and
236.35 deg). No browser; a second.

    python sspring_trace.py [TRACE.json]
"""
import json,pathlib,sys
import numpy as np
from scipy.ndimage import gaussian_filter1d
HERE=pathlib.Path(__file__).resolve().parent
F=sys.argv[1] if len(sys.argv)>1 else HERE/'sspring_hand.trace.json'
P=np.array(json.load(open(F))['planes']['Face']['traces']['edge1']['points_px'],float);K=40;H=22.5
def cr(P,n=20):   # tracer.html's centripetal Catmull-Rom through the points
    out=[]
    for i in range(len(P)-1):
        p0,p1,p2,p3=P[max(i-1,0)],P[i],P[i+1],P[min(i+2,len(P)-1)]
        t0=0;t1=t0+np.linalg.norm(p1-p0)**.5+1e-9;t2=t1+np.linalg.norm(p2-p1)**.5+1e-9;t3=t2+np.linalg.norm(p3-p2)**.5+1e-9
        for t in np.linspace(t1,t2,n,endpoint=False):
            A1=(t1-t)/(t1-t0)*p0+(t-t0)/(t1-t0)*p1;A2=(t2-t)/(t2-t1)*p1+(t-t1)/(t2-t1)*p2;A3=(t3-t)/(t3-t2)*p2+(t-t2)/(t3-t2)*p3
            B1=(t2-t)/(t2-t0)*A1+(t-t0)/(t2-t0)*A2;B2=(t3-t)/(t3-t1)*A2+(t-t1)/(t3-t1)*A3;out.append((t2-t)/(t2-t1)*B1+(t-t1)/(t2-t1)*B2)
    out.append(P[-1]);return np.array(out)
mm=(cr(P)+0.5)/K-H
s=np.r_[0,np.cumsum(np.linalg.norm(np.diff(mm,axis=0),axis=1))];t=np.arange(0,s[-1],0.05);P=np.c_[np.interp(t,s,mm[:,0]),np.interp(t,s,mm[:,1])]
# outward normals (the outline closed; steel on the side the polygon's area sign says)
A=0.5*np.sum(P[:,0]*np.roll(P[:,1],-1)-np.roll(P[:,0],-1)*P[:,1]);T=np.gradient(P,axis=0);T/=np.linalg.norm(T,axis=1)[:,None]
N=np.c_[T[:,1],-T[:,0]]*(1 if A>0 else -1)
sh=-0.36*np.array([np.cos(np.radians(95.9)),np.sin(np.radians(95.9))])   # the floor's shift on the frame: toward its near side (-y)
radial_out=(np.sum(N*P,1)/np.hypot(*P.T)>0.8)&(np.hypot(*P.T)>17.3)   # the band's outer edge, against the wall: its face never shows
vis=((N@sh)>0)&~radial_out;Q=P-np.outer(vis,sh);Q=gaussian_filter1d(Q,8,axis=0,mode='wrap')   # the faces the tilt shows taken off; the step at the switch eased over 0.4 mm
r=np.hypot(*Q.T);a=np.degrees(np.arctan2(Q[:,1],Q[:,0]))%360
nose=lambda lo,hi:(a>lo)&(a<hi)&(r>15.3)&(r<16.5)
aF=a[nose(140,170)].min();aW=a[nose(115,140)].max();G=aF-aW
print(f'apexes: fixed {aF:.2f}, working {aW:.2f} deg; the gap {G:.2f}')
SSL=360-G
s=(aW-a)%360   # from the working tip the long way round
# SSI: the inner edge every 2 deg (the least radius of the outline at that angle), 0 to past SSL
SSI=[]
for sg in np.arange(0,SSL+4,2.0):
    k=np.abs(((s-sg+180)%360)-180)<0.6
    k&=r<17.6
    SSI.append(int(round(r[k].min()*100)) if k.any() else None)
# fill the tips' ends (no inner edge in the gap) with the last value
for i in range(len(SSI)):
    if SSI[i] is None:SSI[i]=SSI[i-1] if i else SSI[i+1]
print('SSI',json.dumps(SSI).replace(' ',''))
# the tips: the outline's nose from the inner edge (delta 6) round to the band's outer edge beside it, every 0.25 mm, past r 17.5 stretched so that edge lands on the wall
OUT=np.median(r[r>17.5]);print('the outer edge as traced, median %.3f'%OUT)
def tip(fixed):
    dl=(a-aF) if fixed else s   # degrees into the band from the tip
    dl=np.where(dl>180,dl-360,dl)
    m=(np.abs(dl)<8)&(r>13.0)
    idx=np.where(m)[0]
    # the run of the outline through the nose: contiguous indices
    runs=np.split(idx,np.where(np.diff(idx)!=1)[0]+1);run=max(runs,key=len)
    R,D=r[run],dl[run]
    if R[0]>R[-1]:R,D=R[::-1],D[::-1]   # inner edge first
    i0=np.where((D<=6)&(R<R.min()+0.6))[0][0]
    allD=((a-aF)%360 if fixed else s);allD=np.where(allD>180,allD-360,allD)
    PL=np.median(r[(allD>4)&(allD<10)&(r>17.5)]);print(('fixed' if fixed else 'working'),'outer edge beside the tip %.3f'%PL)
    i1=np.where((R>=PL-0.02)&(D>1))[0];i1=i1[0] if len(i1) else len(R)-1
    R,D=R[i0:i1+1],D[i0:i1+1]
    P=np.c_[R*np.cos(np.radians(D)),R*np.sin(np.radians(D))];ss=np.r_[0,np.cumsum(np.linalg.norm(np.diff(P,axis=0),axis=1))]
    tt=np.linspace(0,ss[-1],max(2,int(round(ss[-1]/0.25)))+1);x=np.interp(tt,ss,P[:,0]);y=np.interp(tt,ss,P[:,1])
    R=np.hypot(x,y);D=np.degrees(np.arctan2(y,x))
    top=R[-1];st=R>17.5
    if top>17.5:R[st]=17.5+(R[st]-17.5)*(17.97-17.5)/(top-17.5)
    R[-1]=17.97
    return [[int(round(rr*100)),round((-dd if fixed else dd),2)+0.0] for rr,dd in zip(R,D)]
SFT=tip(True);SWT=tip(False)
fmt=lambda L:json.dumps(L).replace(' ','').replace(',-0.0]',',0]').replace(',0.0]',',0]')
print('SFT',fmt(SFT));print('SWT',fmt(SWT))
nearHole,pin=159.23,125.2
print(f'SSG {G:.1f}; holes {nearHole-aF+40.1:.1f} and {nearHole-aF:.1f} back from the fixed tip; SPW {aW-pin:.1f}; the lobes ends: SWL {aW-97.57:.1f}, SFL {236.35-aF:.1f}')
