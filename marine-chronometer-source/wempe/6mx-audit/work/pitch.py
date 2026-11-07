import sys,cv2,numpy as np
from scipy.ndimage import map_coordinates
# the Geneva stripes' pitch over a long run: the flattened plate (12 px/mm, x0=z0=-46) sampled along the stripes' normal n, averaged along the stripes over a band,
# its period by the autocorrelation's peaks over many periods; the direction by maximising the profile's contrast over angles
im=cv2.imread(sys.argv[1],0).astype(float);k=12.0
def prof(c,ang,L=30,band=4):
    t=np.radians(ang);d=np.array([np.cos(t),np.sin(t)]);n=np.array([-d[1],d[0]]);s=np.arange(-L/2,L/2,1/k);w=np.arange(-band/2,band/2,1/k)
    P=np.array([c+si*n+wi*d for si in s for wi in w]);v=map_coordinates(im,[(P[:,1]+46)*k-0.5,(P[:,0]+46)*k-0.5],order=1).reshape(len(s),len(w));return s,np.median(v,1)
for c in [(-20,-28),(28,5),(15,-28),(30,-5),(-38,0)]:
    c=np.array(c,float);best=max(((np.std(prof(c,a)[1]),a) for a in np.arange(120,141,0.5)));a=best[1];s,p=prof(c,a);p=p-p.mean()
    ac=np.correlate(p,p,'full')[len(p)-1:];ac/=ac[0];lag=np.arange(len(ac))/k
    pk=[i for i in range(3,len(ac)-1) if ac[i]>ac[i-1] and ac[i]>=ac[i+1] and ac[i]>0.2 and lag[i]>2.5]
    # refine each peak parabolically, period = slope of peak positions against their order
    L=[];
    for i in pk:
        y0,y1,y2=ac[i-1:i+2];L.append(lag[i]+0.5*(y0-y2)/(y0-2*y1+y2)/k)
    L=np.array(L);m=np.round(L/L[0]);per=np.polyfit(m,L,1)[0] if len(L)>1 else L[0]
    print(f'patch {c}: stripes along {a:.1f} deg (from +x toward +z), pitch {per:.3f} mm from {len(L)} peaks {np.round(L,2)}')
