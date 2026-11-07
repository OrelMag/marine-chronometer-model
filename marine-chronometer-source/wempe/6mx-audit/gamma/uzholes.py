"""Gamma: on uZ, the ring's three screw holes (where they open in the ring's cone: a cylinder cut by a sloped face is an ellipse whose
centre is on the hole's axis, so the opening's fitted centre unprojected at the cone's mean height is the axis) and the dial screws'
three tapped holes in the flange's top. Each opening's dark disc fitted by darkdisc (no straight edge to drop), unprojected
through the uZ camera at f 1040 (free fit), 2400 and 4500 to show what the focal length does."""
import numpy as np,json,cv2
from cam import *; from darkdisc import darkdisc
exec(open('uzcal.py').read().split("for ff in")[0].replace("print(","(lambda *a,**k:None)("))
feats=[('ring screw hole a',(621,147),8.6,10),('ring screw hole b',(120,600),8.6,10),('ring screw hole c',(860,670),8.6,10),
       ('dial screw hole a',(454,79),None,8),('dial screw hole b',(903,696),None,8),('dial screw hole c',(150,766),None,8)]
outs={}
for ff in (1040,2400,4500):
    rr=least_squares(lambda qq:res(np.r_[qq,ff],True,keep),q[:6]); cc=dict(rv=rr.x[:3],t=rr.x[3:6],f=ff,W=W,H=H)
    for nm,uv,h,win in feats:
        qd,sd,rms,n,p=darkdisc(im,uv,win=win,dropline=False)
        hh=h if h is not None else 11.0
        X=unproj(cc,qd[:2],hh); r=np.hypot(X[0],X[2]); a=np.degrees(np.arctan2(X[0],-X[2]))%360
        outs.setdefault(nm,{})[ff]=dict(px=qd[:2].tolist(),dpx=2*qd[2],rms=rms,x=X[0],z=X[2],r=r,cw=a,brg=(360-a)%360,h=hh)
        print('f %4d %-18s px %.1f,%.1f (dia %.1f px, rms %.2f, n %d) at y %.1f: r %.2f, cw-from-12 (dial side) %.2f, brg %.2f'%(ff,nm,qd[0],qd[1],2*qd[2],rms,n,hh,r,a,(360-a)%360))
json.dump(outs,open('uzholes.json','w'),indent=1)
