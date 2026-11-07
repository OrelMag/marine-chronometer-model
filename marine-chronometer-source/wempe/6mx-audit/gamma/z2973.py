"""Gamma: Kirov 2973's dial (bilder-zum-6mx/1_Kirow_2973_Z.jpg), as zcal.py/zscrews.py for 247: the up-and-down circle's and the
seconds track's printed circles fitted, their centres the arbors 46 apart; the dial screws' heads (the dark ring the slot runs across,
so the head's edge) fitted along rays (dark to light outward). The screw by 7 is missing on 2973 (its hole shows empty)."""
import cv2,numpy as np,json
import zcal
IMG='E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx-gallery/bilder-zum-6mx/1_Kirow_2973_Z.jpg'
zcal.g=cv2.cvtColor(cv2.imread(IMG),cv2.COLOR_BGR2GRAY).astype(float)
from zcal import line_pts,fitc
import zscrews  # noqa: reuses nothing global but head(); rebuild head on this image
res={}
for k,(c,r0,r1,angs) in {'updown':((483,328),95,120,list(range(0,360,2))),'seconds':((484,712),140,160,list(range(180,360,2)))}.items():
    p=line_pts(c,r0,r1,angs); q,sd,rms,n=fitc(p); res[k]=q; print(k,np.round(q,2),'rms %.2f n %d'%(rms,n))
U=res['updown'][:2];S=res['seconds'][:2]; k=np.linalg.norm(S-U)/46; up=(U-S)/np.linalg.norm(U-S); rt=np.array([-up[1],up[0]]); O=(U+S)/2
print('px/mm %.4f'%k)
def head(c0):
    pts=[]
    for a in np.radians(np.arange(0,360,5)):
        rr=np.arange(3,13,0.2); x=c0[0]+rr*np.cos(a); y=c0[1]+rr*np.sin(a); v=zcal.samp(x[None],y[None])[0]
        d=np.gradient(v); i=int(np.argmax(d))
        if d[i]<6 or i<2 or i>len(d)-3: continue
        y0,y1,y2=d[i-1],d[i],d[i+1]; o=(y0-y2)/(2*(y0-2*y1+y2)+1e-9); r=rr[i]+o*0.2; pts.append((c0[0]+r*np.cos(a),c0[1]+r*np.sin(a)))
    return fitc(np.array(pts))
for nm,c0 in [('screw by 12',(437,104)),('screw by 4',(860,688))]:
    q,sd,rms,n=head(np.array(c0,float)); v=q[:2]-O; x=v@rt/k; z=-(v@up)/k
    print('%-12s head dia %.2f mm (rms %.2f px, n %d); r %.2f at cw %.2f'%(nm,2*q[2]/k,rms,n,np.hypot(x,z),np.degrees(np.arctan2(x,-z))%360))
