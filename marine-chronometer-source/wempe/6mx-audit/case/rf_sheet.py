"""Fine contact sheet: python rf_sheet.py VIDEOFILE t0 t1 step OUT [cols=4] [w=480]
Frames from t0 to t1 s every `step` s, labelled in seconds, into one montage (for finding side-on bowl frames)."""
import sys, cv2, numpy as np
v=cv2.VideoCapture(sys.argv[1]); t0,t1,st=map(float,sys.argv[2:5]); out=sys.argv[5]
cols=int(sys.argv[6]) if len(sys.argv)>6 else 4; w=int(sys.argv[7]) if len(sys.argv)>7 else 480
fr=[]; t=t0
while t<=t1+1e-6:
    v.set(cv2.CAP_PROP_POS_MSEC,t*1000); ok,im=v.read()
    if ok:
        h=int(im.shape[0]*w/im.shape[1]); im=cv2.resize(im,(w,h)); cv2.putText(im,'%.2f'%t,(5,22),0,.7,(0,0,255),2); fr.append(im)
    t+=st
while len(fr)%cols: fr.append(np.zeros_like(fr[0]))
rows=[np.hstack(fr[i:i+cols]) for i in range(0,len(fr),cols)]
cv2.imwrite(out,np.vstack(rows))
