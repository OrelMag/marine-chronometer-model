"""Gamma: leave-one-out on both cameras (A: f 5379 fixed; uZ: f 2400 fixed with its rim), each ring screw's bearing recomputed,
to see what the calibration's own spread allows."""
import numpy as np,json,cv2
from cam import *; from darkdisc import darkdisc
from scipy.optimize import least_squares
def brg(X): return (-np.degrees(np.arctan2(X[0],-X[2])))%360
# A
imA,gA=load('E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx/2_Kirow_247_A.jpg'); H,W=gA.shape
src=open('aring.py').read().split("for f in")[0].replace("print(","(lambda *a,**k:None)(")
ns={}; exec(src.replace("im,g=load(IMG)","im,g=imA,gA"),dict(globals(),imA=imA,gA=gA),ns)
PA=np.array(ns['P']);UA=np.array(ns['UV']);kA=[i for i,k in enumerate(ns['pts']) if k!='lcs']
aA=json.load(open('aring.json')); aA['ring screw left in A']['px']=[154.5,662.5]
c0=fit(PA[kA],UA[kA],W,H,f=5379.1); q0=np.r_[c0['rv'],c0['t']]
rows=[]
for drop in [None]+kA:
    kk=[i for i in kA if i!=drop]; s=least_squares(lambda q:(proj(PA[kk],q[:3],q[3:],5379.1,W,H)-UA[kk]).ravel(),q0); c=dict(rv=s.x[:3],t=s.x[3:],f=5379.1,W=W,H=H)
    rows.append([brg(unproj(c,v['px'],-2.0)) for v in aA.values()])
rows=np.array(rows); print('A view: all',np.round(rows[0],2),' LOO range',np.round(rows[1:].min(0),2),np.round(rows[1:].max(0),2))
# uZ
ns2={}; exec(open('uzcal.py').read().split("for ff in")[0].replace("print(","(lambda *a,**k:None)("),ns2)
hz=json.load(open('uzholes.json')); hp=[hz[k]['2400']['px'] for k in ('ring screw hole a','ring screw hole b','ring screw hole c')]
P,UV,res,keep,q=ns2['P'],ns2['UV'],ns2['res'],ns2['keep'],ns2['q']
rows=[]
for drop in [None]+list(range(len(P))):
    m=np.ones(len(P),bool)
    if drop is not None: m[drop]=False
    def rr(qq):
        full=res(np.r_[qq,2400],True,keep); n=len(P)*2; w=np.repeat(m,2).astype(float); return np.r_[full[:n]*w,full[n:]]
    s=least_squares(rr,q[:6]); cc=dict(rv=s.x[:3],t=s.x[3:6],f=2400,W=ns2['W'],H=ns2['H'])
    rows.append([brg(unproj(cc,p,8.6)) for p in hp])
rows=np.array(rows); print('uZ view: all',np.round(rows[0],2),' LOO range',np.round(rows[1:].min(0),2),np.round(rows[1:].max(0),2))
print('order: A = upper left, right, left in A -> model 342.2, 102.2, 246.4; uZ = a, b, c -> 342.2, 102.2, 246.4')
