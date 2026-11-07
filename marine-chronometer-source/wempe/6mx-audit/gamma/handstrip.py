"""Gamma: each hand laid out straight: the dial photograph rotated about the hand's arbor so its axis (hands.py's) runs along +x, supersampled x4, a strip
-L_tail..L_tip by ±5 mm cut, 40 px a mm; for viewing and for the edge reading in handedge.py."""
import cv2,numpy as np,sys,json
from hands import cal
def strip(img,C,k,axis,x0,x1,half=5,ppm=40):
    M=cv2.getRotationMatrix2D((float(C[0]),float(C[1])),axis,1.0)
    xs=np.arange(x0,x1,1/ppm); ys=np.arange(-half,half,1/ppm); X,Y=np.meshgrid(xs,ys)
    # strip coords (mm) -> rotated image px -> original px via the inverse rotation
    px=C[0]+X*k; py=C[1]+Y*k; A=np.r_[M,[[0,0,1]]]; Ai=np.linalg.inv(A)
    u=Ai[0,0]*px+Ai[0,1]*py+Ai[0,2]; v=Ai[1,0]*px+Ai[1,1]*py+Ai[1,2]
    return cv2.remap(img,u.astype(np.float32),v.astype(np.float32),cv2.INTER_CUBIC)
if __name__=='__main__':
    which=sys.argv[1]
    if which=='247':
        img=cv2.imread('E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx/1_Kirow_247_Z.jpg'); U,S,k=cal(img,(498,308),(504,712),(105,125),(150,175),range(180,360,2))
    else:
        img=cv2.imread('E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx-gallery/bilder-zum-6mx/1_Kirow_2973_Z.jpg'); U,S,k=cal(img,(483,328),(484,712),(95,120),(140,160),range(180,360,2))
    O=(U+S)/2; A=json.load(open('hands_%s.json'%which))
    rows=[]
    for nm,C,x0,x1 in [('minute',O,-14,52),('hour',O,-14,52),('seconds',S,-14,52),('up-and-down',U,-14,52)]:
        s=strip(img,C,k,A[nm]['axis'],x0,x1)
        for x in range(0,s.shape[1],40): cv2.line(s,(x,0),(x,8 if (x//40+x0)%5 else 16),(0,0,255),1)
        cv2.putText(s,nm,(4,s.shape[0]-6),0,0.6,(255,0,0),1); rows.append(s)
    cv2.imwrite('E:/Marine-Chronometer/.claude/worktrees/6mx-gamma/marine-chronometer-source/wempe/6mx-audit/gamma/r_hstrip_%s.png'%which,cv2.resize(np.vstack(rows),None,fx=0.5,fy=0.5))
