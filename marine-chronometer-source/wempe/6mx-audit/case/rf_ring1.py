"""Photo 9C22A7DC (Kirov 14100, bowl beside its ring, from above): segment the non-blue object from the blue
background, take the ring's outer silhouette on the left/bottom/right (away from the bowl) and fit an ellipse.
Usage: python rf_ring1.py  -> writes oq/6mx-case/rf/p1_mask.png and prints ellipse fit."""
import cv2, numpy as np
P='E:/Marine-Chronometer/References/wempe/photos/chasy-ru-9985-kirova-14100/9C22A7DC-31CF-443E-99DE-80C00B1D440E.jpeg'
im=cv2.imread(P); hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV)
# background blue: hue ~100-120 (opencv), saturation moderate
bg=((hsv[...,0]>95)&(hsv[...,0]<125)&(hsv[...,1]>40)).astype(np.uint8)
fg=1-bg
fg=cv2.morphologyEx(fg,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
cv2.imwrite('E:/mc-video/oq/6mx-case/rf/p1_mask.png',fg*255)
H,W=fg.shape
# outer left silhouette: for rows 820..1300 first fg pixel from left (x<400)
pts=[]
for y in range(830,1300,10):
    xs=np.where(fg[y,:600]>0)[0]
    if len(xs): pts.append((xs[0],y))
print(pts)
