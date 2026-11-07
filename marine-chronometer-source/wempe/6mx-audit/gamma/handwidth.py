"""Gamma: the hands' widths on photograph and model alike: each hand laid out straight (handstrip.strip, 40 px a mm), and at each station across the axis the colour's
distance (Lab) from the dial's own colour there (the median of the column's outer 1.5 mm each side); the band the run round the axis's nearest strong point above half
that column's peak distance, its edges sub-pixel. Robust to the gilt's highlights and shadows, which luminance alone isn't. Same reader on Kirov 247's photograph and on
photocompare's render of the model through its camera, so the method's own bias falls out of the comparison."""
import cv2,numpy as np,sys,json
from hands import cal
from handstrip import strip
def widths(s,ppm=40):
    lab=cv2.cvtColor(s,cv2.COLOR_BGR2LAB).astype(np.float32); H=lab.shape[0]; c=H//2; o=int(1.5*ppm); out=[]
    for j in range(lab.shape[1]):
        col=lab[:,j,:]; bg=np.median(np.r_[col[:o],col[-o:]],0); d=np.linalg.norm(col-bg,axis=1); d=cv2.GaussianBlur(d.reshape(-1,1),(1,5),1).ravel()
        w1=int(0.8*ppm); m=c-w1+int(np.argmax(d[c-w1:c+w1])); pk=d[m]
        if pk<30: out.append(np.nan); continue
        lvl=pk/2; lo=m; hi=m
        while lo>0 and d[lo]>lvl: lo-=1
        while hi<H-1 and d[hi]>lvl: hi+=1
        e0=lo+(lvl-d[lo])/(d[lo+1]-d[lo]+1e-9); e1=hi-1+(d[hi-1]-lvl)/(d[hi-1]-d[hi]+1e-9)
        out.append((e1-e0)/ppm if lo>0 and hi<H-1 else np.nan)
    return np.array(out)
def run(img,tips,x0=-16,x1=52):
    U,S,k=cal(img,(498,308),(504,712),(105,125),(150,175),range(180,360,2)); O=(U+S)/2; R={}
    for nm,(c,tp) in tips.items():
        C={'S':S,'U':U,None:O}[c]; v=np.array(tp,float)-C; ax=np.degrees(np.arctan2(v[1],v[0])); s=strip(img,C,k,ax,x0,x1,half=4)
        w=widths(s); x=np.arange(x0,x1,1/40)[:len(w)]; R[nm]=(x,w)
    return R
def at(x,w,s,h=0.25):
    m=(np.abs(x-s)<h)&np.isfinite(w); return float(np.median(w[m])) if m.any() else np.nan
if __name__=='__main__':
    P=cv2.imread('E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx/1_Kirow_247_Z.jpg')
    R=cv2.imread(sys.argv[1] if len(sys.argv)>1 else 'C:/Users/USER/AppData/Local/Temp/claude/5baf8887e4faf47f/2f6d7732-b608-494f-8cce-993c648648c6/scratchpad/pcg/r_pc_k247_Z_render.png')
    p=run(P,{'minute':(None,(105,605)),'hour':(None,(785,622))}); r=run(R,{'minute':(None,(104,601)),'hour':(None,(788,615))})
    st={'minute':[5,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46],'hour':[5,6,8,10,12,14,16,18,19,20,21,22,23,24,25,26,28,30,32,34]}
    out={}
    for nm in ('minute','hour'):
        print(nm); out[nm]=[]
        for s_ in st[nm]:
            a=at(*p[nm],s_); b=at(*r[nm],s_); out[nm].append((s_,a,b)); print('   %4g mm: 247 %s   model %s'%(s_,'%.2f'%a if a==a else '  - ','%.2f'%b if b==b else '  - '))
        # tips: the last station with a band from the boss outward
        for lab_,(x,w) in (('247',p[nm]),('model',r[nm])):
            ok=np.isfinite(w)&(w>0.1); i=np.where(ok&(x>5))[0]; seq=i[np.r_[True,np.diff(i)<=8]]
            # first break of over 0.3 mm in the run
            br=np.where(np.diff(i)>12)[0]; last=i[br[0]] if len(br) else i[-1]
            print('   %s tip %.2f mm'%(lab_,x[last]))
    json.dump(out,open('handwidth.json','w'),indent=1)
