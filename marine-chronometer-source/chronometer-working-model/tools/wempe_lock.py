"""The Wempe's transit lock read off 05 01 and its lever's sweep worked out (no browser; numpy, scipy, Pillow, shapely). 24 October 2026.

    python wempe_lock.py centre            # the ring's two circles fitted on Schnitt A-B: the plan's centre (px) and radii (mm at 2.46 px/mm)
    python wempe_lock.py plan [OUT.png]    # Schnitt A-B resampled along the locking bracket's radius (50 deg from 6 o'clock toward 3) and across it,
                                           #   r 50-80 across, t -14..14 down (+ toward 3 o'clock), a 1 mm grid: the bracket's faces, its neck (hatched), the ring
    python wempe_lock.py elev [OUT.png]    # the elevation's bracket enlarged 10x on a 5 px grid (sheet pixels): the foot, crank, upright, neck and head
    python wempe_lock.py sweep [L]         # the lever (its end's centre L from the knob's axis, default 27.0) turned in from its drawn place until it meets
                                           #   the bracket's neck: the turn, how close it comes to the bowl's axis (the 1942 flange r 59), the arc of the band it crosses

What case.js builds from them is in its comments (the locking bracket, the gimbal ring's slot, the transit lock) and the Wempe README's
"The locking bracket and the transit lock". Images go to the current directory."""
import sys,pathlib
import numpy as np
from PIL import Image,ImageDraw
HERE=pathlib.Path(__file__).resolve().parent
SHEET=HERE.parents[2]/'References'/'wempe'/'drawings'/'05-01'/'Wempe_05-01_1.jpg'
K=2.46   # px/mm, by the sheet's 160
C=(274.3,491.0)   # Schnitt A-B's centre (centre)
TH=np.radians(50)

def centre():
    from scipy.optimize import least_squares
    im=np.asarray(Image.open(SHEET).convert('L')).astype(float);cx,cy=274,497;pts=([],[])
    for a in np.arange(0,360,2):
        t=np.radians(a);rs=np.arange(160,195,0.25)
        v=np.array([im[int(round(cy+r*np.sin(t))),int(round(cx+r*np.cos(t)))] for r in rs]);d=np.where(v<110)[0]
        if len(d)<2:continue
        for k,i in((0,d[0]),(1,d[-1])):pts[k].append((cx+rs[i]*np.cos(t),cy+rs[i]*np.sin(t)))
    for k,n in((0,'inside'),(1,'outside')):
        P=np.array(pts[k]);r=least_squares(lambda p:np.hypot(P[:,0]-p[0],P[:,1]-p[1])-p[2],[cx,cy,175],loss='soft_l1',f_scale=1)
        print(f'the ring {n}: centre ({r.x[0]:.1f}, {r.x[1]:.1f}) px, r {r.x[2]/K:.2f} mm, median miss {np.median(abs(r.fun)):.2f} px')

def plan(out):
    from scipy.ndimage import map_coordinates
    A=np.asarray(Image.open(SHEET).convert('L')).astype(float);S=12
    R,T=np.meshgrid(np.arange(50,80,1/S),np.arange(-14,14,1/S))
    dx=R*np.sin(TH)+T*np.cos(TH);dz=R*np.cos(TH)-T*np.sin(TH)
    c=Image.fromarray(np.clip(map_coordinates(A,[C[1]+dz*K,C[0]+dx*K],order=3),0,255).astype(np.uint8)).convert('RGB');d=ImageDraw.Draw(c)
    for r in range(50,80):
        x=(r-50)*S;d.line([(x,0),(x,c.size[1])],fill=(255,0,0) if r%5==0 else (255,200,200))
        if r%5==0:d.text((x+2,2),str(r),fill=(255,0,0))
    for t in range(-14,14):
        y=(t+14)*S;d.line([(0,y),(c.size[0],y)],fill=(0,0,255) if t%5==0 else (200,200,255))
        if t%5==0:d.text((2,y+2),str(t),fill=(0,0,255))
    c.resize((c.size[0]*2,c.size[1]*2),Image.LANCZOS).save(out);print('wrote',out)

def elev(out):
    im=Image.open(SHEET).convert('RGB');x0,y0,x1,y1,S=355,110,425,215,10
    c=im.crop((x0,y0,x1,y1)).resize(((x1-x0)*S,(y1-y0)*S),Image.LANCZOS);d=ImageDraw.Draw(c)
    for x in range(x0,x1,5):d.line([((x-x0)*S,0),((x-x0)*S,c.size[1])],fill=(255,0,0) if x%10==0 else (255,180,180));d.text(((x-x0)*S+2,2),str(x),fill=(255,0,0))
    for y in range(y0,y1,5):d.line([(0,(y-y0)*S),(c.size[0],(y-y0)*S)],fill=(0,0,255) if y%10==0 else (180,180,255));d.text((2,(y-y0)*S+2),str(y),fill=(0,0,255))
    c.save(out);print('wrote',out,'(pivots at y 143.5; the bowl\'s axis at x 278.7: x = 0.766 r + 0.643 t from it, mm at 2.46)')

def sweep(L):
    from shapely.geometry import Polygon,Point,LineString
    from shapely import affinity
    P=np.array([65.1,62.9]);e0=np.array([39,73]);u=(e0-P)/np.linalg.norm(e0-P)   # the knob's axis and the drawn end (x, z: 3 o'clock +x, 6 o'clock +z)
    er=np.array([np.sin(TH),np.cos(TH)]);et=np.array([np.cos(TH),-np.sin(TH)]);rt=lambda R,t:tuple(R*er+t*et)
    neck=Polygon([rt(59.6,1.75),rt(63.2,1.75),rt(63.2,7.85),rt(59.6,7.85)])   # case.js's, the bracket centred on its 50 deg line
    lev=LineString([tuple(P),tuple(P+L*u)]).buffer(4,resolution=64)   # 8 wide, its ends round
    band=Point(0,0).buffer(73.3,resolution=720).difference(Point(0,0).buffer(70,resolution=720))
    stop=None;mr=1e9;A=[]
    for d in np.arange(0,120,0.05):
        lv=affinity.rotate(lev,d,origin=tuple(P))   # counterclockwise in (x, z): clockwise seen from above
        if lv.intersects(neck):stop=d;break
        mr=min(mr,lv.distance(Point(0,0)));x=lv.intersection(band)
        for g in([] if x.is_empty else getattr(x,'geoms',[x])):A+=[np.degrees(np.arctan2(p[0],p[1])) for p in g.exterior.coords]
    a=np.arctan2(u[1],u[0])+np.radians(stop);tip=P+L*np.array([np.cos(a),np.sin(a)]);pin=P+0.55*(tip-P)
    print(f'L {L}: meets the neck turned {stop:.2f} deg; comes {mr:.2f} from the bowl\'s axis (the flange r 59); crosses the band from {min(A):.1f} to {max(A):.1f} deg from 6 o\'clock (the sheet\'s slot 20.6-52.4)')
    print(f'  its end\'s centre then at r {tip@er:.2f}, t {tip@et:.2f} off the 50 deg line; its pin {np.hypot(*pin):.2f} from the centre (the ring\'s outside 73.3, the pin r 2)')

if __name__=='__main__':
    a=sys.argv[1:] or ['sweep']
    if a[0]=='centre':centre()
    elif a[0]=='plan':plan(a[1] if len(a)>1 else 'r_lock_plan.png')
    elif a[0]=='elev':elev(a[1] if len(a)>1 else 'r_lock_elev.png')
    elif a[0]=='sweep':sweep(float(a[1]) if len(a)>1 else 27.0)
    else:sys.exit(__doc__)
