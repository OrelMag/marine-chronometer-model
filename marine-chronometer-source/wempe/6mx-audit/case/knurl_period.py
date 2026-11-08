"""Knurl period of a bezel band from a photo: 2D power spectrum / autocorrelation of a high-passed patch. Prints the dominant
spatial frequencies (cycles per px -> period px) with their direction, and the horizontal and vertical periods.
Usage: knurl_period.py IMG x0 y0 x1 y1 [px_per_mm] [out.png]"""
import sys,cv2,numpy as np
im=cv2.imread(sys.argv[1],0).astype(np.float32);x0,y0,x1,y1=map(int,sys.argv[2:6]);k=float(sys.argv[6]) if len(sys.argv)>6 else None
p=im[y0:y1,x0:x1];p=p-cv2.GaussianBlur(p,(0,0),3);p=p*np.outer(np.hanning(p.shape[0]),np.hanning(p.shape[1]))
F=np.abs(np.fft.fftshift(np.fft.fft2(p,s=(512,512))))**2
cy=cx=256;F[cy-4:cy+5,cx-4:cx+5]=0
idx=np.dstack(np.unravel_index(np.argsort(F.ravel())[::-1][:40],F.shape))[0]
seen=[]
for (iy,ix) in idx:
    fy=(iy-cy)/512;fx=(ix-cx)/512
    if fx<0 or (fx==0 and fy<0): continue
    r=np.hypot(fx,fy)
    if r<0.02: continue
    if any(np.hypot(fx-a,fy-b)<0.012 for a,b in seen): continue
    seen.append((fx,fy))
    print('f=(%.4f,%.4f) period %.2f px along dir %.0f deg from +x; horiz period %.2f vert period %.2f  %s'%(fx,fy,1/r,np.degrees(np.arctan2(fy,fx)),1/abs(fx) if fx else 0,1/abs(fy) if fy else 0,('= %.3f mm'%(1/r/k)) if k else ''))
    if len(seen)>=6: break
