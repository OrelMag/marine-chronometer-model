"""Gamma: the hour hand's half-width along its axis on the laid-out strips (pearprep.py: 40 px a mm): each column's two edges where the Lab distance from the dial
crosses half its peak (the peak the hand's own contrast at that column), each taken sub-pixel; the centreline is the stem's fitted line (x 8-17), the half-width
each edge's distance from it, upper and lower kept apart (on 247 the lower edge carries the hand's shadow on the dial). Writes pearhw_W.json."""
import cv2,numpy as np,json,sys
def run(W):
    s=cv2.imread('pear_%s.png'%W); m=json.load(open('pear_%s.map.json'%W)); k=m['px_per_mm']; x0=m['x0']+0.5/k; z0=m['z0']+0.5/k
    lab=cv2.cvtColor(s,cv2.COLOR_BGR2LAB).astype(np.float32); H=s.shape[0]; c=H//2; X=[];UP=[];LO=[]
    for j in range(s.shape[1]):
        x=x0+j/k
        if x<4 or x>36: continue
        col=lab[:,j,:]; bg=np.median(np.r_[col[:20],col[-20:]],0); d=cv2.GaussianBlur(np.linalg.norm(col-bg,axis=1).reshape(-1,1),(1,5),1).ravel()
        mi=c-24+int(np.argmax(d[c-24:c+24]))
        if d[mi]<25: continue
        pk=np.percentile(d[max(0,mi-60):mi+60],95); lvl=pk/2; a=mi; b=mi
        while a>0 and d[a]>lvl: a-=1
        while b<H-1 and d[b]>lvl: b+=1
        if a==0 or b==H-1: continue
        ea=a+(lvl-d[a])/(d[a+1]-d[a]+1e-9); eb=b-1+(d[b-1]-lvl)/(d[b-1]-d[b]+1e-9)
        X.append(x); UP.append(z0+ea/k); LO.append(z0+eb/k)
    X,UP,LO=map(np.array,(X,UP,LO)); st=(X>8)&(X<17); cl=np.polyfit(X[st],(UP[st]+LO[st])/2,1)
    zc=np.polyval(cl,X); return X,zc-UP,LO-zc,cl
out={}
for W in sys.argv[1:]:
    X,hu,hl,cl=run(W); out[W]=dict(x=X.tolist(),hu=hu.tolist(),hl=hl.tolist(),centre=cl.tolist())
    print(W,'centreline z = %.4f x %+.3f'%tuple(cl))
    for xs in [5,6,8,10,12,14,16,17,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,24,25,26,27,28,29,30,31,32,33,34,35]:
        m=np.abs(X-xs)<0.15
        if m.any(): print('  x %5.1f  upper %.2f  lower %.2f  mean %.2f'%(xs,np.median(hu[m]),np.median(hl[m]),np.median((hu[m]+hl[m])/2)))
json.dump(out,open('pearhw.json','w'))
