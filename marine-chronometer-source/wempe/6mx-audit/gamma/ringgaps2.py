"""Gamma: ringgaps.py's reading on Kirov 009 and Poljot 20027: each screw's head over its visible arc, both signs of step tried and the
cleaner fit (lower rms, a head-sized radius) kept; the rim ellipse fitted in a narrower window where the first was loose."""
import cv2,numpy as np,sys
from sector import sector
from ringgaps import rimell,plan,D
JOB={'009':(D+'dg-chrono-6mx-gallery/bilder-zum-6mx/2_Kirow_009_A.jpg',(514,504),(352,395),[((400,150),180,360),((898,590),-80,80),((165,662),100,260)]),
     '20027':(D+'dg-chrono-6mx-gallery/bilder-zum-6mx/2_Poljot_20027_A.jpg',(509,513),(350,395),[((395,139),0,360),((892,592),-90,270),((150,660),90,270)])}
for k,(p,O,(r0,r1),scr) in JOB.items():
    im=cv2.imread(p); g=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY).astype(np.float32)
    e,n,rms=rimell(g,np.array(O,float),r0,r1); print(k,'rim ellipse centre %.1f,%.1f axes %.1f %.1f (%d pts, %.2f px)'%(e[0][0],e[0][1],e[1][0]/2,e[1][1]/2,n,rms))
    A=[]; vis=im.copy()
    for c0,a0,a1 in scr:
        best=None
        for sg in (1,-1):
            for rr0,rr1 in ((8,32),(12,40)):
                try: q,sd,r_,nn,pp=sector(g,np.array(c0,float),rr0,rr1,a0,a1,sign=sg)
                except Exception: continue
                if 10<q[2]<32 and nn>20 and (best is None or r_<best[2]): best=(q,sd,r_,nn,pp,sg)
        q,sd,r_,nn,pp,sg=best; P=plan(e,q[:2]); ang=np.degrees(np.arctan2(P[0],-P[1]))%360; A.append(ang)
        for x,y in pp: vis[int(round(y)),int(round(x))]=(0,255,0)
        cv2.circle(vis,(int(round(q[0])),int(round(q[1]))),int(round(q[2])),(0,0,255),1)
        print('  screw near %s: centre %.1f,%.1f r %.1f px rms %.2f n %d sign %d -> plan r %.2f image-cw %.2f'%(c0,q[0],q[1],q[2],r_,nn,sg,np.hypot(*P),ang))
    a=np.sort(np.array(A)); print('  gaps:',np.round(np.diff(np.r_[a,a[0]+360]),2))
    cv2.imwrite('E:/Marine-Chronometer/.claude/worktrees/6mx-gamma/marine-chronometer-source/wempe/6mx-audit/gamma/r_rg_%s.png'%k,np.hstack([cv2.resize(vis[y-45:y+45,x-45:x+45],(270,270),interpolation=cv2.INTER_NEAREST) for (x,y),_,_ in scr]))
