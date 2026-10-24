"""The balance's small details read on KLUwI2UUCMQ (the 4K restoration video, $MC_VIDEO/KLUwI2UUCMQ_4k.webm), 21 October 2026: the balance screws'
slots and the timing nuts' slit (movement.js, BSW/BSD and TSL/TSD; PROVENANCE.md 108-16, 108-19). No browser; opencv-python, numpy, scipy. About 30 s
(it decodes the frames it needs).

    python balance_details.py [--out DIR]     # prints each reading; DIR (default $MC_VIDEO/oq/baldet) gets the frames and crops

Every reading is a ratio on the part itself (no camera): a slot's width against its head's 3.1 mm diameter, its depth against the same, the nut's slit
against the nut's own length along its axis. Profiles are averaged over 5 px across; the edges are where the profile crosses half way between its levels.
  slot width   6:52.621  rows 1530-1548 across the bottom head (the light seen through its slot):   17 px of a 134 px head
               6:50.035  rows 610-670 across the head facing the camera (its end face):            12 px dark core, ~20 px with the lit wall, 155 px head
  slot depth   6:52.621  column x 1472 down the head (slot from y 1488), the end face 30 px (tilt 13 deg): 32 px
               6:53.121  the same head exactly side-on, the notch y 1522-1550:                      28 px of a 113 px head
  nut's slit   6:53.121  along the slit (1945,500)->(2000,465) and beside it: 65 px of the nut's ~100;  across: 4-5 px
               6:52.621  (1937,512)->(1985,482): the slit gone between 35 and 50 px along, the nut ~87 px
The arm's 'small holes along its middle' (PROVENANCE 108-14c, 6:52.5) are the hairspring stud's three holes: the stud hangs on the spring with the balance
out and lies over the arm there; its holes 3.5 and 3.7 mm apart at the rim's 42 px/mm (the stud's 3.4 and 3.9). The arm itself, seen on its cock side at
6:52.6 (lit) and 6:53.1 (dark), shows bright specks off any line and no hole."""
import os,sys,pathlib,cv2,numpy as np
from scipy.ndimage import map_coordinates
VID=pathlib.Path(os.environ.get('MC_VIDEO',str(pathlib.Path.home()/'mc-video')))
OUT=pathlib.Path(sys.argv[sys.argv.index('--out')+1]) if '--out' in sys.argv else VID/'oq'/'baldet'
def frame(t):
    p=OUT/f'k_{t}.png'
    if p.exists():return cv2.imread(str(p))
    m,s=t.split('-');ts=int(m)*60+float(s);v=cv2.VideoCapture(str(VID/'KLUwI2UUCMQ_4k.webm'));fps=v.get(5);v.set(cv2.CAP_PROP_POS_FRAMES,round(ts*fps));ok,f=v.read()
    if not ok:raise SystemExit('no frame at '+t);OUT.mkdir(parents=True,exist_ok=True);cv2.imwrite(str(p),f);return f
def fwhm(v,i0,i1,dark=True):
    """the width of the dip (or peak) in v[i0:i1] at half way between its extreme and the mean of its two shoulders, in samples"""
    w=v[i0:i1];k=int(np.argmin(w) if dark else np.argmax(w));base=(w[0]+w[-1])/2;h=(base+w[k])/2;f=(lambda x:x>h) if dark else (lambda x:x<h)
    a=k
    while a>0 and not f(w[a-1]):a-=1
    b=k
    while b<len(w)-1 and not f(w[b+1]):b+=1
    l=a-1+(w[a-1]-h)/(w[a-1]-w[a]) if a>0 else a;r=b+(w[b]-h)/(w[b]-w[b+1]) if b<len(w)-1 else b
    return r-l
def g(t):return frame(t).astype(float).mean(2)
def row(G,y,x0,x1):return G[y-2:y+3,x0:x1].mean(0)
def main():
    G=g('6-52.621')
    ws=[fwhm(row(G,y,1450,1500),0,50,dark=False) for y in(1530,1540,1548)]
    print('6:52.621 slot seen through (px):',' '.join(f'{w:.1f}' for w in ws),' head 134 px ->',f'{np.mean(ws)/134*3.1:.2f} mm')
    G2=g('6-50.035');wd=[fwhm(row(G2,y,1380,1420),0,40) for y in(610,640,670)]
    print('6:50.035 slot dark core (px):',' '.join(f'{w:.1f}' for w in wd),' head 155 px; with the lit wall ~20 px ->',f'{20/155*3.1:.2f} mm')
    c=G[1420:1570,1470:1475].mean(1);top=1420+int(np.argmax(c[60:110]<120)+60)
    print(f'6:52.621 slot starts y {top} (head end 1552, end face 30 px of 134: tilt 13 deg): depth {(1519-top)/np.cos(np.radians(13))/134*3.1:.2f} mm')
    print(f'6:53.121 notch y 1522-1550 on a 113 px head: depth {28/113*3.1:.2f} mm')
    G3=g('6-53.121');p0=np.array([1945.,500.]);p1=np.array([2000.,465.]);u=(p1-p0)/np.linalg.norm(p1-p0);n=np.array([-u[1],u[0]])
    acr=[]
    for a in(15,35,50):
        P=p0+a*u+np.arange(-50,50,2)[:,None]*n;v=map_coordinates(G3,[P[:,1],P[:,0]],order=1);acr.append(2*fwhm(v,18,32))
    print('6:53.121 nut slit length 65 px of ~100 (0.63); across (px):',' '.join(f'{w:.1f}' for w in acr),'->',f'{np.mean(acr)/42:.2f} mm at 42 px/mm')
if __name__=='__main__':main()
