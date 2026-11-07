"""Gamma: the Z view's three dial screws, each head's outer edge (dark rim onto the white dial) found along 72 rays as the
steepest rise, a circle fitted; place in mm on the dial plane through zcal.json (sub-dial arbors 46 apart, 12 o'clock from them).
Angle clockwise from 12 as seen from the dial side."""
import cv2,numpy as np,json
from zcal import g,samp,fitc
cal=json.load(open('zcal.json')); U=np.array(cal['updown']['c']); S=np.array(cal['seconds']['c']); C=np.array(cal['minute']['c'])
k=np.linalg.norm(S-U)/46.0; up=(U-S)/np.linalg.norm(U-S); rt=np.array([-up[1],up[0]])  # right on the image = 3 o'clock
O=(U+S)/2   # centre arbor midway between the sub-dial arbors
print('px/mm %.4f; minute-track centre off the arbors midpoint %.2f px; minute track r %.3f mm'%(k,np.linalg.norm(C-O),cal['minute']['r']/k))
def head(c0):
    pts=[]
    for a in np.radians(np.arange(0,360,5)):
        rr=np.arange(3,13,0.2); x=c0[0]+rr*np.cos(a); y=c0[1]+rr*np.sin(a); v=samp(x[None],y[None])[0]
        d=np.gradient(v); i=int(np.argmax(d))
        if d[i]<8 or i<2 or i>len(d)-3: continue
        y0,y1,y2=d[i-1],d[i],d[i+1]; o=(y0-y2)/(2*(y0-2*y1+y2)+1e-9)
        r=rr[i]+o*0.2; pts.append((c0[0]+r*np.cos(a),c0[1]+r*np.sin(a)))
    return fitc(np.array(pts))
res={}
for name,c0 in [('screw by 12',(449.6,75)),('screw by 4',(905.5,682.6)),('screw by 7',(149.6,771.8))]:
    q,sd,rms,n=head(np.array(c0)); v=q[:2]-O; x=v@rt/k; z=-(v@up)/k
    r=np.hypot(x,z); th=np.degrees(np.arctan2(x,-z))%360
    res[name]=dict(px=q[:2].tolist(),head_d=2*q[2]/k,x=x,z=z,r=r,ang=th,rms=rms,n=n)
    print('%-12s centre px (%.2f,%.2f) sd %.2f; head dia %.2f mm (edge rms %.2f px, n %d); x %.2f z %.2f -> r %.2f mm at %.2f deg'%(name,q[0],q[1],sd[0],2*q[2]/k,rms,n,x,z,r,th))
json.dump(res,open('zscrews.json','w'),indent=1)
