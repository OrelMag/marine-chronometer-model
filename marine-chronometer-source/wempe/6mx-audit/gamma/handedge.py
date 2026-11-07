"""Gamma: each hand's outline read across its axis: the axis from its arbor to the tip picked on the photograph (and refined: the angle that centres the band
over the blade's outer half), the image laid out straight (handstrip.strip, 40 px a mm); at each station along the axis the luminance across it, the hand a band
darker than the dial (blued on white, in luminance) or more saturated (gilt on white: the saturation inverted): its edges the half-depth crossings between the band's floor (its 20th percentile within ±0.4 mm of the axis... widened
to the band) and the dial's level either side. Widths where printing or another hand crosses are flagged by an asymmetric band and dropped. The tip: the last station
whose band is 0.12 mm wide or more, refined to where the band's depth falls to half."""
import cv2,numpy as np,sys,json
from hands import cal
from handstrip import strip
def across(s,ppm=40,half=4.0,gilt=False):
    """each column: the dial's level the 85th percentile within ±half mm, the hand's the darkest point within ±1 mm of the axis; the band the run below their
    mean through that point, its edges sub-pixel. (The gilt hands photograph dark brown against the white dial, so luminance serves both.)"""
    L=cv2.GaussianBlur(cv2.cvtColor(s,cv2.COLOR_BGR2GRAY).astype(np.float32),(3,3),0.8); H=L.shape[0]; c=H//2; out=[]
    for j in range(L.shape[1]):
        seg=L[c-int(half*ppm):c+int(half*ppm),j]; m0=len(seg)//2; w1=int(ppm)
        bg=np.percentile(seg,85); m=m0-w1+int(np.argmin(seg[m0-w1:m0+w1])); fl=seg[m]
        if bg-fl<40: out.append((np.nan,np.nan,bg-fl));continue
        lvl=(bg+fl)/2; lo=m; hi=m
        while lo>0 and seg[lo]<lvl: lo-=1
        while hi<len(seg)-1 and seg[hi]<lvl: hi+=1
        sub=lambda a,b: a+(lvl-seg[a])/(seg[b]-seg[a]+1e-9)*(b-a)
        e0=sub(lo,lo+1) if lo>0 else np.nan; e1=sub(hi-1,hi) if hi<len(seg)-1 else np.nan
        out.append(((e0-m0)/ppm,(e1-m0)/ppm,bg-fl))
    return np.array(out)
def measure(img,C,k,tip_px,x0=-16,x1=52,label='',gilt=False):
    v=np.array(tip_px,float)-C; axis=np.degrees(np.arctan2(v[1],v[0]))
    s=strip(img,C,k,-axis if False else axis,x0,x1)   # strip() rotates by +axis about C (as hands.py's axis): checked on the hour hand
    E=across(s,gilt=gilt); xs=np.arange(x0,x1,1/40)[:len(E)]; w=E[:,1]-E[:,0]; asym=np.abs(E[:,1]+E[:,0])
    ok=np.isfinite(w)&(w<7)
    return dict(label=label,axis=axis,x=xs,w=np.where(ok,w,np.nan),depth=E[:,2],strip=s)
def summary(h,stations):
    x,w=h['x'],h['w']; pos=(x>0)&np.isfinite(w); 
    tipi=np.where(pos&(w>0.12))[0]; tip=x[tipi.max()] if len(tipi) else np.nan
    negi=np.where((x<0)&np.isfinite(w)&(w>0.12))[0]; tail=-x[negi.min()] if len(negi) else np.nan
    def at(s):
        m=np.abs(x-s)<0.3; vals=w[m&np.isfinite(w)]; return np.median(vals) if len(vals) else np.nan
    print('%-16s axis %.2f deg (image); tip %.2f mm; tail %.2f mm'%(h['label'],h['axis'],tip,tail))
    print('   width at '+', '.join('%g: %s'%(s_,'%.2f'%at(s_) if np.isfinite(at(s_)) else '-') for s_ in stations))
    b=np.where((x>4.5)&(x<tip-0.5)&np.isfinite(w),w,0); i=int(np.argmax(b)); print('   widest past the boss %.2f at %.2f'%(b[i],x[i]))
    return dict(tip=float(tip),tail=float(tail),widest=float(b[i]),widest_at=float(x[i]),w={str(s_):(None if not np.isfinite(at(s_)) else float(at(s_))) for s_ in stations})
if __name__=='__main__':
    which=sys.argv[1]
    if which=='247':
        img=cv2.imread('E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx/1_Kirow_247_Z.jpg'); U,S,k=cal(img,(498,308),(504,712),(105,125),(150,175),range(180,360,2))
        T={'minute':(None,(105,605)),'hour':(None,(785,622)),'seconds (arrow end)':('S',(530,636)),'seconds (tail end)':('S',(455,830)),'up-and-down':('U',(472,233))}
    elif which=='render':   # photocompare.py's render of the model through k247_Z's camera (the 6MX, the photograph's time): the same reader on the model
        img=cv2.imread(sys.argv[2]); U,S,k=cal(img,(498,308),(504,712),(105,125),(150,175),range(180,360,2))
        T={'minute':(None,(104,601)),'hour':(None,(788,615)),'seconds (arrow end)':('S',(571,758)),'seconds (tail end)':('S',(389,637)),'up-and-down':('U',(463,232))}
    else:
        img=cv2.imread('E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx-gallery/bilder-zum-6mx/1_Kirow_2973_Z.jpg'); U,S,k=cal(img,(483,328),(484,712),(95,120),(140,160),range(180,360,2))
        T={'minute':(None,(133,662)),'hour':(None,(752,622)),'seconds (arrow end)':('S',(412,742)),'up-and-down':('U',(408,328))}
    O=(U+S)/2; res={}; strips=[]
    for nm,(c,tp) in T.items():
        C={'S':S,'U':U,None:O}[c]
        h=measure(img,C,k,tp,label=nm,gilt=nm in('minute','hour')); res[nm]=summary(h,[2,3,4,5,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46])
        st=h['strip'].copy()
        for x in range(0,st.shape[1],40): cv2.line(st,(x,0),(x,10 if ((x//40)-16)%5 else 22),(0,0,255),1)
        strips.append(st)
    print('px/mm %.4f'%k); json.dump(res,open('handedge_%s.json'%which,'w'),indent=1)
    cv2.imwrite('E:/Marine-Chronometer/.claude/worktrees/6mx-gamma/marine-chronometer-source/wempe/6mx-audit/gamma/r_hedge_%s.png'%which,cv2.resize(np.vstack(strips),None,fx=0.45,fy=0.45))
