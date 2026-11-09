"""Save one full-resolution frame: python rf_frame.py VIDEOFILE t_seconds OUT.png"""
import sys, cv2
v=cv2.VideoCapture(sys.argv[1]); v.set(cv2.CAP_PROP_POS_MSEC,float(sys.argv[2])*1000); ok,im=v.read(); assert ok; cv2.imwrite(sys.argv[3],im); print(im.shape)
