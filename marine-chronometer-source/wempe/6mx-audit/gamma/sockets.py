"""Gamma: the bowl's six outside contact fittings (each spring's two screws 65 and its socket) on 247's 12_ and 2973's E-Kontakt4: their
image x (centres picked on the heads' faces, ±3 px), fitted as points on a cylinder seen from far off, x = x0 + s sin(t - tc), with tc,
x0 and s free and the model's six bearings either given (residuals) or each solved from the fit on the other five (leave-one-out)."""
import numpy as np
from scipy.optimize import least_squares
M=np.array([178.4,189.3,200.6,215.7,225.2,235.9])
PH={'247 (12_)':np.array([240,325,442,598,690,785.]),'2973 (E-Kontakt4)':np.array([230,310,418,565,655,760.])}
for k,x in PH.items():
    f=lambda q,t: q[1]+q[2]*np.sin(np.radians(t-q[0]))
    r=least_squares(lambda q:f(q,M)-x,[207,512,600]); q=r.x
    th=q[0]+np.degrees(np.arcsin(np.clip((x-q[1])/q[2],-1,1)))
    print('%-18s view centre %.1f deg, s %.0f px; residuals px %s; bearings read %s (model %s): diff %s'%(k,q[0],q[2],np.round(r.fun,1),np.round(th,1),M,np.round(th-M,1)))
    loo=[]
    for i in range(6):
        m=np.arange(6)!=i; rr=least_squares(lambda qq:f(qq,M[m])-x[m],q); loo.append(rr.x[0]+np.degrees(np.arcsin(np.clip((x[i]-rr.x[1])/rr.x[2],-1,1)))-M[i])
    print('   leave-one-out diffs (deg):',np.round(loo,1))
