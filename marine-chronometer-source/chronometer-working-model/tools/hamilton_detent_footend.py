"""hamilton_detent_footend.py BA.json: the detent foot's end edge on KLUwI2UUCMQ 11:32.5 (C), 11:24.5 (D) and 11:10.0 (E), its image lines picked
by eye on 3x crops, triangulated as a 3D line (a plane through each camera) with the cameras of the 20 October bundle adjustment
($MC_VIDEO/oq/ledger/detent/ba_f*.json: old millimetres, the block's pins 10.12 apart; x 1.117 for the model's), printed in tri.py's detent frame
(t along from the old flexure, n across, c down from the block's top face). Its t (the foot's end) is the reading; its c is loose (the three views'
planes nearly coplanar), so only the visible edge's length along the line is used. Report: $MC_VIDEO/oq/ledger/detent2/REPORT.md. About a second."""
import json,sys,numpy as np,cv2
W,H=3840,2160
B=json.load(open(sys.argv[1]))
L={'C':[(575,1965),(720,2104)],'D':[(595,2103),(648,2160)],'E':[(737,2110),(790,2160)]}
pL=np.array([-7.212,-1.612]);pR=np.array([2.908,-1.737]);u=(pR-pL)/np.linalg.norm(pR-pL);v=np.array([-u[1],u[0]])
def ray(c,p):
    R=cv2.Rodrigues(np.array(c['r']))[0];T=np.array(c['T']);C=-R.T@T;d=R.T@np.array([(p[0]-W/2)/c['f'],(p[1]-H/2)/c['f'],1.0]);return C,d/np.linalg.norm(d)
P=[]
for k,(a,b) in L.items():
    c=B['cams'][k];C,d1=ray(c,a);_,d2=ray(c,b);n=np.cross(d1,d2);n/=np.linalg.norm(n);P.append((n,n@C))
N=np.array([p[0] for p in P]);D=np.array([p[1] for p in P])
# line: direction = null-ish vector of N; point = least squares
_,s,Vt=np.linalg.svd(N);dirn=Vt[-1];X0=np.linalg.lstsq(N,D,rcond=None)[0]
print('sv',s)
for lam in (-2,-1,0,1,2):
    X=X0+lam*dirn;t,n=pL+u*X[0]+v*X[1];print('t %.2f n %.2f c %.2f'%(t,n,X[2]))
print('dir abc',dirn)
# the foot's bottom corner on C: its ray against the line
c=B['cams']['C'];C,d=ray(c,(720,2104))
A=np.c_[dirn,-d];lam,mu=np.linalg.lstsq(A,C-X0,rcond=None)[0];Xb=X0+lam*dirn;print('bottom corner abc',Xb,'y_old',-20.66+Xb[2],'gap',np.linalg.norm(Xb-(C+mu*d)))
for k,pts in L.items():
    c=B['cams'][k]
    for p in pts:
        C,d=ray(c,p);A=np.c_[dirn,-d];lam,mu=np.linalg.lstsq(A,C-X0,rcond=None)[0];X=X0+lam*dirn;print(k,p,'c %.2f (new %.2f below the block top)'%(X[2],X[2]*1.117))
