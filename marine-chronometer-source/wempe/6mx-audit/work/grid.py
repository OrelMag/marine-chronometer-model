import sys,cv2,numpy as np
im=cv2.imread(sys.argv[1]);x0,y0,x1,y1=map(int,sys.argv[2:6]);k=float(sys.argv[6]);st=int(sys.argv[7]) if len(sys.argv)>7 else 20
c=cv2.resize(im[y0:y1,x0:x1],None,fx=k,fy=k,interpolation=cv2.INTER_CUBIC)
for x in range(x0-x0%st+st,x1,st):cv2.line(c,(int((x-x0)*k),0),(int((x-x0)*k),c.shape[0]),(0,255,255),1);cv2.putText(c,str(x),(int((x-x0)*k)+2,12),0,0.4,(0,0,255),1)
for y in range(y0-y0%st+st,y1,st):cv2.line(c,(0,int((y-y0)*k)),(c.shape[1],int((y-y0)*k)),(0,255,255),1);cv2.putText(c,str(y),(2,int((y-y0)*k)-2),0,0.4,(0,0,255),1)
cv2.imwrite(sys.argv[8] if len(sys.argv)>8 else 'g.png',c)
