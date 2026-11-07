"""Gamma: Kirov 247's A (train side, plan) photograph: the camera fitted on the drawn movement's screws (refined head rims),
then the movement ring's three screws read on the plane of their heads. Heights from the frame of the drawings: the head
heights are unknown, so each place is given for y between the ring's train-side face and 3 mm above it; the long lens
(about 630 mm) makes that worth only about 0.2 %."""
import numpy as np, json
from cam import *
IMG='E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx/2_Kirow_247_A.jpg'
im,g=load(IMG); H,W=g.shape
pts={'bb12':([17.37,-28.67,-32.668],(356,220)),'tp12':([6.425,-25.35,-36.437],(455,187)),'click':([29.474,-30.42,-17.046],(244,359)),
     'bb6':([32.043,-28.67,18.5],(221,678)),'tp9':([-36.858,-25.35,3.225],(838,540)),'ucs':([-0.559,-28.55,-19.765],(514,335)),'lcs':([0.502,-22.25,11.922],(502,617))}
P=[];UV=[]
for k,(X,uv) in pts.items():
    q,rms,n=refine(g,np.array(uv,float),4,24); P.append(X); UV.append(q[:2]); print('%-6s pick %s -> %.1f,%.1f head r %.1f px rms %.2f'%(k,uv,q[0],q[1],q[2],rms))
for f in (None,):
    c=fit(P,UV,W,H,f=f,f0=5000); print('f %.0f, camera dist %.0f mm, residuals px'%(c['f'],np.linalg.norm(c['t'])),np.round(np.hypot(*c['res'].T),2))
import sys
json.dump({'rv':c['rv'].tolist(),'t':c['t'].tolist(),'f':c['f']},open('cam_A.json','w'))
keep=[i for i,k in enumerate(pts) if k!='lcs']
c=fit([P[i] for i in keep],[UV[i] for i in keep],W,H,f=5379.1); print('f fixed 5379 (Alpha k247_A fit): residuals',np.round(np.hypot(*c['res'].T),2),'dist %.0f'%np.linalg.norm(c['t']))
print('scale at y=-22: %.3f px/mm'%(np.linalg.norm(proj([[0,-22,0]],c['rv'],c['t'],c['f'],W,H)-proj([[10,-22,0]],c['rv'],c['t'],c['f'],W,H))/10))
out={}
for nm,uv in [('ring screw upper left',(400,140)),('ring screw right',(893,592)),('ring screw left',(157,662))]:
    q,rms,n=refine(g,np.array(uv,float),4,22)
    for h in (-20.0,-23.0,-26.0):
        X=unproj(c,q[:2],h); r=np.hypot(X[0],X[2]); th=np.degrees(np.arctan2(X[0],-X[2]))%360
        print('%-22s px %.1f,%.1f (head r %.1f px, rms %.2f) at y %.0f: x %.2f z %.2f r %.2f ang %.2f'%(nm,q[0],q[1],q[2],rms,h,X[0],X[2],r,th))
    X=unproj(c,q[:2],-23.0); out[nm]=dict(px=q[:2].tolist(),x=X[0],z=X[2],r=float(np.hypot(X[0],X[2])),ang=float(np.degrees(np.arctan2(X[0],-X[2]))%360),head_d_mm=2*q[2]/8.85)
json.dump(out,open('aring.json','w'),indent=1)
