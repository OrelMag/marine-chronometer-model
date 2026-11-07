"""Gamma: the hands' widths as their full extent across the axis: at each station the run of pixels whose Lab distance from the dial's colour (the median of the
strip's outer 0.5 mm each side) is over 25, through the strongest point within 0.5 mm of the axis; on Kirov 247's photograph and on the model rendered through its
camera alike (the photograph's hands are domed and shaded, so a half-depth edge cuts them short; a shadow on the dial beside them can add about 0.1-0.3).
Prints a table and writes r_hands_sm.png: the seconds and up-and-down hands laid out straight, photograph over model."""
import cv2,numpy as np,json
from hands import cal
from handstrip import strip
P='E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx/1_Kirow_247_Z.jpg'; R='C:/Users/USER/AppData/Local/Temp/claude/5baf8887e4faf47f/2f6d7732-b608-494f-8cce-993c648648c6/scratchpad/pcg/r_pc_k247_Z_render.png'
def full(s,X,half):
    col=cv2.cvtColor(s[:,int(X*40):int(X*40)+1],cv2.COLOR_BGR2LAB)[:,0,:].astype(float); bg=np.median(np.r_[col[:20],col[-20:]],0); d=np.linalg.norm(col-bg,axis=1)
    c=len(d)//2; m=c-20+int(np.argmax(d[c-20:c+20]))
    if d[m]<25: return np.nan
    lo=m; hi=m
    while lo>0 and d[lo-1]>25: lo-=1
    while hi<len(d)-1 and d[hi+1]>25: hi+=1
    return (hi-lo+1)/40 if lo>0 and hi<len(d)-1 else np.nan
J={'hour':(None,(785,622),(788,615),[5,8,10,12,14,16,18,19,20,21,22,23,24,25,26,28,30,32,34,35],3.5),
   'seconds, the lozenge end (247) / its pointer (model)':('S',(530,636),(571,758),[2,4,6,7,8,9,10,12,14,16,17,18],2.0),
   'seconds, the long end (247) / its tail (model)':('S',(455,830),(389,637),[2,4,6,8,10,12,14,15,16],2.0),
   'up-and-down':('U',(472,233),(463,232),[2,3,4,5,6,7,8,9,10,11,12],1.5)}
imgs={'247':cv2.imread(P),'model':cv2.imread(R)}; cals={k:cal(v,(498,308),(504,712),(105,125),(150,175),range(180,360,2)) for k,v in imgs.items()}
out={}; strips=[]
for nm,(c,t247,tmod,st,half) in J.items():
    print(nm); row={}
    for who,tp in (('247',t247),('model',tmod)):
        U,S,k=cals[who]; O=(U+S)/2; C={'S':S,'U':U,None:O}[c]; v=np.array(tp,float)-C; ax=np.degrees(np.arctan2(v[1],v[0])); s=strip(imgs[who],C,k,ax,-2,max(st)+3,half=half)
        row[who]=[full(s,X+2,half) for X in st]
        if nm!='hour':
            s2=s.copy()
            for x in range(0,s2.shape[1],40): cv2.line(s2,(x,0),(x,8 if ((x//40)-2)%5 else 18),(0,0,255),1)
            strips.append(cv2.resize(s2,(int(s2.shape[1]*600/s2.shape[1]),int(s2.shape[0]*600/s2.shape[1]))))
    out[nm]={str(X):[row['247'][i],row['model'][i]] for i,X in enumerate(st)}
    for i,X in enumerate(st): print('   %4g mm: 247 %s   model %s'%(X,*('%.2f'%v if v==v else '  - ' for v in (row['247'][i],row['model'][i]))))
json.dump(out,open('handfull.json','w'),indent=1)
cv2.imwrite('E:/Marine-Chronometer/.claude/worktrees/6mx-gamma/marine-chronometer-source/wempe/6mx-audit/gamma/r_hands_sm.png',np.vstack(strips))
