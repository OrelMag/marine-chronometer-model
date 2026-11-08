"""Zoomed crop with a labelled pixel grid (original image coordinates) for reading picks.
usage: gridcrop.py IMG x0 y0 x1 y1 zoom step OUT"""
import sys,cv2
im=cv2.imread(sys.argv[1]);x0,y0,x1,y1=map(int,sys.argv[2:6]);z=int(sys.argv[6]);st=int(sys.argv[7])
c=cv2.resize(im[y0:y1,x0:x1],None,fx=z,fy=z,interpolation=cv2.INTER_CUBIC)
for x in range((x0//st+1)*st,x1,st):
    cv2.line(c,((x-x0)*z,0),((x-x0)*z,c.shape[0]),(255,255,0),1);cv2.putText(c,str(x),((x-x0)*z+2,12),0,.4,(255,255,255),1)
for y in range((y0//st+1)*st,y1,st):
    cv2.line(c,(0,(y-y0)*z),(c.shape[1],(y-y0)*z),(255,255,0),1);cv2.putText(c,str(y),(2,(y-y0)*z-2),0,.4,(255,255,255),1)
cv2.imwrite(sys.argv[8],c)
