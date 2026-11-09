"""Face-on dial photo (Kirov 247, bezel off): along each ray from the dial centre find (a) the outer edge of the gilt flange
(gold -> dark, step in saturation/brightness) and (b) the outer edge of the bowl's dark threaded rim (dark -> background).
Prints the ratio b/a per angle; with the flange = 105.95 mm gives the rim's outside diameter. Usage: rim_ratio.py IMG cx cy [rmin rmax]"""
import sys,cv2,numpy as np
im=cv2.imread(sys.argv[1]);cx,cy=float(sys.argv[2]),float(sys.argv[3])
rmin,rmax=(int(sys.argv[4]),int(sys.argv[5])) if len(sys.argv)>5 else (420,520)
g=cv2.GaussianBlur(cv2.cvtColor(im,cv2.COLOR_BGR2GRAY).astype(np.float32),(0,0),1.2)
res=[]
for a in range(0,360,6):
    t=np.radians(a);r=np.arange(rmin,rmax,0.5)
    x=(cx+r*np.sin(t)).astype(np.float32);y=(cy-r*np.cos(t)).astype(np.float32)
    if x.min()<0 or y.min()<0 or x.max()>=im.shape[1]-1 or y.max()>=im.shape[0]-1: continue
    v=cv2.remap(g,x.reshape(1,-1),y.reshape(1,-1),cv2.INTER_LINEAR)[0]
    d=np.gradient(v)
    # outer edge of rim: last strong rise (dark->bright background) ; flange outer: strong fall before it
    i_up=np.where(d>2.0)[0]; i_dn=np.where(d<-2.0)[0]
    if len(i_up)==0 or len(i_dn)==0: continue
    ru=r[i_up[-1]]
    dn=i_dn[r[i_dn]<ru-3]
    if len(dn)==0: continue
    rf=r[dn[-1]]
    res.append((a,rf,ru))
for a,rf,ru in res: print(a,rf,ru,round(ru/rf,4))
rr=np.array([ru/rf for _,rf,ru in res]);print('median ratio',np.median(rr),'iqr',np.percentile(rr,[25,75]))
