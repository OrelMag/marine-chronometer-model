"""Gamma: 12_Kirow_247_E-Kontakt_3.jpg (Kirov 247's bowl, empty, side on from a little above): its two silhouette edges against the grey
background row by row (the outermost strong step from the background inward, on saturation and luma), giving the profile's half
width and centre per row in px."""
import cv2,numpy as np,json,sys
P=sys.argv[1] if len(sys.argv)>1 else 'E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx-gallery/leben-des-6mx/12_Kirow_247_E-Kontakt_3.jpg'
im=cv2.imread(P); H,W=im.shape[:2]
hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV).astype(np.float32); S=cv2.GaussianBlur(hsv[:,:,1],(5,1),1.0)
rows=[]
for y in range(40,H-60,4):
    s=S[y]; bg=np.median(np.r_[S[max(0,y-2):y+3,:6].ravel(),S[max(0,y-2):y+3,-6:].ravel()])
    thr=bg+25
    L=np.argmax(s>thr); R=W-1-np.argmax(s[::-1]>thr)
    def sub(i,dirn):
        xs=np.arange(max(0,i-6),min(W-1,i+6)); d=np.gradient(s[xs])*dirn; j=int(np.argmax(d))
        if 0<j<len(xs)-1:
            y0,y1,y2=d[j-1],d[j],d[j+1]; return xs[j]+(y0-y2)/(2*(y0-2*y1+y2)+1e-9)
        return float(xs[j])
    xl=sub(L,1) if L>0 else np.nan; xr=sub(R,-1) if R<W-1 else np.nan
    rows.append((y,xl,xr))
rows=np.array(rows); json.dump(rows.tolist(),open('bowlside_'+P.split('/')[-1].split('.')[0]+'.json','w'))
for y,xl,xr in rows[::3]: print('%4d  L %7.1f  R %7.1f  w %7.1f  c %7.1f'%(y,xl,xr,xr-xl,(xl+xr)/2))
