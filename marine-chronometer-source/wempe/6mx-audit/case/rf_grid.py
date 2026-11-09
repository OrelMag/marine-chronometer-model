"""Grid crop helper: python rf_grid.py IMG x0 y0 x1 y1 OUT [scale] [step]
Crops IMG to the box, upsamples by scale and draws a labelled pixel grid (original px coords) every `step` px,
so edge points can be read by eye. Blind-measurement helper for the ring/foot audit."""
import sys, cv2
im=cv2.imread(sys.argv[1]); x0,y0,x1,y1=map(int,sys.argv[2:6]); out=sys.argv[6]
s=float(sys.argv[7]) if len(sys.argv)>7 else 2; st=int(sys.argv[8]) if len(sys.argv)>8 else 50
c=cv2.resize(im[y0:y1,x0:x1],None,fx=s,fy=s,interpolation=cv2.INTER_CUBIC)
for x in range((x0//st+1)*st,x1,st):
    X=int((x-x0)*s); cv2.line(c,(X,0),(X,c.shape[0]),(0,255,255),1); cv2.putText(c,str(x),(X+2,12),0,0.4,(0,0,255),1)
for y in range((y0//st+1)*st,y1,st):
    Y=int((y-y0)*s); cv2.line(c,(0,Y),(c.shape[1],Y),(0,255,255),1); cv2.putText(c,str(y),(2,Y-2),0,0.4,(0,0,255),1)
cv2.imwrite(out,c)
