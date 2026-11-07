"""Gamma: the pear's inner end as a circle in the half-width profile (x along the hand, h its half-width): fitted on each photograph's rise from the stem
(pearhw.json, the mean of both edges: x 18.8-21.6 on 247, 19.4-21.6 on 2973, where the reader holds; past 21.6 the domed pear's shading cuts it short), the circle's
top held tangent where the drawn pear is widest (x 22.5, h 2.6: the width matches within the reading, so the drawings' is kept), its radius free; and free
altogether for comparison. Also where it meets the drawn stem (HOUR.hw)."""
import numpy as np,json
from scipy.optimize import least_squares
D=json.load(open('pearhw.json'))
stem=lambda x: np.interp(x,[16.5,18,19.5,19.93],[0.48,0.42,0.40,0.40])
for W,(a,b) in {'247':(18.8,21.6),'2973':(19.4,21.6)}.items():
    x=np.array(D[W]['x']); h=(np.array(D[W]['hu'])+np.array(D[W]['hl']))/2; m=(x>a)&(x<b)&np.isfinite(h); x,h=x[m],h[m]
    # tangent-top circle: centre (22.5, 2.6-R)
    f=lambda q: (2.6-q[0]+np.sqrt(np.clip(q[0]**2-(x-22.5)**2,0,None)))-h
    r=least_squares(f,[3.5]); R=r.x[0]; rms=np.sqrt(np.mean(r.fun**2))
    J=r.jac; sd=np.sqrt(np.linalg.inv(J.T@J)[0,0]*np.mean(r.fun**2))
    xs=np.linspace(18,22.5,4001); hc=2.6-R+np.sqrt(np.clip(R*R-(xs-22.5)**2,0,None)); i=np.argmin(np.abs(hc-stem(xs))+(xs<18.5)*9)
    g=lambda q: np.hypot(x-q[0],h-q[1])-q[2]; r2=least_squares(g,[22.5,-1,3.6])
    print('%s: %d points; top-tangent circle R %.2f ±%.2f (rms %.3f mm), centre (22.50, %.2f), meets the drawn stem at x %.2f (h %.2f); free circle centre (%.2f, %.2f) R %.2f rms %.3f'%(W,len(x),R,sd,rms,2.6-R,xs[i],hc[i],*r2.x,np.sqrt(np.mean(r2.fun**2))))
