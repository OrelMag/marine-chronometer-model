"""The upper train bridge's outline, measured on two frames of a restoration video of a Model 21 (References/VIDEOS.md, KLUwI2UUCMQ). No browser.

    python train_bridge.py     # prints TB_EDGE for movement.js; with the frames in $MC_VIDEO and video.py anchor's H.json beside the specs, writes r_train_bridge.png

The points below are the bridge's edges traced on the frames and put on its face by video.py anchor (specs tools/anchors/KLUwI2UUCMQ_23-30.json and
KLUwI2UUCMQ_13-49.5.json, their "unmap" points; the homography fitted on the rim, r 40.5, the cut round the barrel, r 19.2 about TBC, and the centre
bushing, to 0.2-0.3 mm rms on both circles). 23:30: the bridge lying flat, face up (a part lies over the horn's end); 13:49.5: turned over in the hand,
nearly face on, the horn whole.
- The notch round the fusee is one circle: fitted on 23:30's 32 points, r 16.49 about (11.48, -17.38), 0.11 mm rms (13:49.5's three points 0.1-0.4 mm off).
  Its centre is 2.4 mm from the model's fusee arbor.
- The horn between it and the barrel's cut: its sides are those two circles to its end (both frames, within about 0.6 mm). The circles don't meet (2.6 mm
  apart at their nearest); the horn ends in a straight cut across, its corners sharp, 12 mm from the centre (13:49.5: the line through its two corners).
- The notch's mouth: a sharp corner on the circle at (28.2, -18.7) (both frames, within 0.1 mm), then a straight edge out to the rim (its direction fitted
  on 23:30's m0-m5; m6-m8, where it turns into the rim over its last millimetre, left out).
The edge runs from outside the rim along the mouth, round the notch, across the horn's end and into the barrel's cut, as crescent() in movement.js takes
it. All in the plan before the 14° turn of 2 October 2026 (the photographed group's frame, which the bridge's rim, barrel cut and centre bushing fix:
movement.js takes TB_EDGE and TB_NOTCH through PT, and KEEP holds the model's positions taken back through PTi). Nothing moves it: the metal left round each hole and part the bridge holds is printed, and any under MARGIN flagged.
Until 1 October 2026 the edge was traced on the manual's Fig. 67 through an affine fit, then pushed off what the bridge holds and smoothed, which gave the
horn a round end 7.5 mm from the centre, a wavy notch and a mouth reaching the rim at -40 deg instead of -21 (RESOLVED.md, plates and bridges)."""
import json,math,os,pathlib
import numpy as np
BR_R=40.5;BA=np.array([-18.56,0.19]);TBC=BA*22.56/18.56;TB_R=19.2;FU=np.array([11.59,-19.8])
MARGIN=1.0
# 23:30 (video.py anchor anchors/KLUwI2UUCMQ_23-30.json): the notch n0-n31 (n31 at the mouth's corner), the horn's notch side hn and barrel side hb up to the part lying on it, the mouth m0-m8
N23=[(1.07,-4.78),(2.13,-3.94),(3.19,-3.10),(4.39,-2.49),(5.58,-1.89),(6.92,-1.51),(8.17,-1.36),(9.41,-1.21),(10.62,-0.91),(11.61,-0.75),(12.82,-0.69),(13.94,-0.85),
     (15.16,-1.18),(16.33,-1.55),(17.43,-1.94),(18.51,-2.52),(19.60,-3.01),(20.65,-3.67),(21.59,-4.41),(22.52,-5.23),(23.42,-6.24),(24.33,-7.16),(25.06,-8.27),(25.80,-9.38),
     (26.34,-10.54),(26.88,-11.71),(27.32,-12.95),(27.69,-14.07),(27.90,-15.31),(28.07,-16.50),(28.19,-17.72),(28.22,-18.69)]
HN23=[(-1.23,-7.58),(-2.36,-8.97),(-3.50,-10.37),(-4.65,-11.77)];HB23=[(-3.61,-3.99),(-4.07,-5.52),(-4.48,-7.02),(-5.28,-8.94),(-5.75,-10.49)]
M23=[(29.42,-18.65),(30.63,-18.28),(31.69,-17.94),(32.79,-17.65),(33.88,-17.36),(34.94,-16.92),(35.76,-16.01),(36.63,-15.07),(37.75,-14.51)]
# 13:49.5 (anchors/KLUwI2UUCMQ_13-49.5.json): the horn's notch side hn0-hn5 and barrel side hb0-hb6 (hn5 and hb0 its end's corners), the notch n0-n2, the mouth's corner mc
HN13=[(5.38,-1.37),(1.91,-3.22),(-1.14,-5.57),(-3.15,-8.00),(-4.42,-10.12),(-4.81,-11.53)];HB13=[(-6.97,-10.22),(-5.52,-7.98),(-4.24,-5.40),(-3.51,-2.83),(-3.17,0.14),(-3.46,2.71),(-4.08,5.10)]
N13=[(27.66,-13.90),(25.77,-8.85),(22.51,-4.54)];MC13=(28.24,-18.69)
# what the bridge holds (x, z, radius of the hole or part): the model's screw holes (clearance or tapped), bushings and pivots near the edge
KEEP=[((0,0),1.2,'centre bushing'),((22.27,-1.31),0.72,'sustaining pawl arbor'),((29.24,-12.28),1.47,'train bridge screw (tapped; Review-results 21)'),((32.11,-4.1),1.64,'barrel bridge screw into pillar'),((-11.07,26.46),1.47,'barrel bridge screw (tapped)'),
      ((7.53,26.76),0.42,'locking arm screw'),((8,6.77),8.0,'keyhole round the balance (cut back to 1 mm in movement.js)'),((12.51,15.02),3.0,'keyhole: round the escape arbor'),((21.99,2.59),0.3,"sustaining pawl spring's pin")]
A=lambda P:np.array(P,float)
def circle(P):   # least squares (Kasa, then Gauss-Newton)
    P=A(P);M=np.c_[2*P,np.ones(len(P))];c0,c1,k=np.linalg.lstsq(M,(P**2).sum(1),rcond=None)[0];c=np.array([c0,c1]);r=math.sqrt(k+c@c)
    for _ in range(20):
        d=np.hypot(*(P-c).T);J=np.c_[-(P-c)/d[:,None],-np.ones(len(P))];s=np.linalg.lstsq(J,-(d-r),rcond=None)[0];c=c+s[:2];r+=s[2]
    return c,r,np.sqrt(((np.hypot(*(P-c).T)-r)**2).mean())
def line(P):   # a point on it and its direction
    P=A(P);m=P.mean(0);return m,np.linalg.svd(P-m)[2][0]
def meet(p,u,c,r,near):   # where the line p + t u crosses the circle (c, r), the crossing nearer `near`
    q=p-c;b=q@u;t=[-b+s*math.sqrt(b*b-q@q+r*r) for s in(1,-1)];X=[p+x*u for x in t];return min(X,key=lambda x:np.linalg.norm(x-near))
def main():
    c1,r1,rms=circle(N23);print(f'notch: r {r1:.2f} about ({c1[0]:.2f}, {c1[1]:.2f}), {rms:.2f} mm rms over {len(N23)} points; {np.linalg.norm(c1-FU):.1f} mm from the fusee arbor')
    off=lambda P,c,r:np.hypot(*(A(P)-c).T)-r
    for n,P in[('13:49.5 notch',N13),('23:30 horn, notch side',HN23),('13:49.5 horn, notch side',HN13[1:])]:print(f'  {n:26s} off the notch circle {np.round(off(P,c1,r1),2)}')
    for n,P in[('23:30 horn, barrel side',HB23),('13:49.5 horn, barrel side',HB13)]:print(f'  {n:26s} off the barrel cut     {np.round(off(P,TBC,TB_R),2)}')
    k=(A(N23[-1])+A(MC13))/2;K=c1+(k-c1)*r1/np.linalg.norm(k-c1)   # the mouth's corner: both frames' reading, on the circle
    _,um=line(M23[:6]);um=um if um[0]>0 else -um;Mr=meet(K,um,np.zeros(2),BR_R,A(M23[-1]))   # its edge, along m0-m5, to the rim
    print(f'mouth: corner ({K[0]:.2f}, {K[1]:.2f}) (23:30 {N23[-1]}, 13:49.5 {MC13}); meets the rim at ({Mr[0]:.2f}, {Mr[1]:.2f}), {math.degrees(math.atan2(Mr[1],Mr[0])):.1f} deg')
    pe=A(HN13[-1]);ue=A(HB13[0])-pe;ue/=np.linalg.norm(ue);En=meet(pe,ue,c1,r1,pe);Eb=meet(pe,ue,TBC,TB_R,A(HB13[0]))   # the horn's end: its corners on the two circles
    print(f'horn: end ({En[0]:.2f}, {En[1]:.2f}) to ({Eb[0]:.2f}, {Eb[1]:.2f}), {np.linalg.norm(Eb-En):.2f} mm across, {np.hypot(*(En+Eb)/2):.1f} mm from the centre')
    a0=math.atan2(K[1]-c1[1],K[0]-c1[0]);a1=math.atan2(En[1]-c1[1],En[0]-c1[0]);a1+=math.tau*(a1<a0);n=math.ceil((a1-a0)*r1/0.5)   # round the notch through +z, 0.5 mm steps
    E=[Mr+um,K]+[c1+r1*np.array([math.cos(a0+(a1-a0)*k/n),math.sin(a0+(a1-a0)*k/n)]) for k in range(1,n+1)]+[Eb,Eb+ue*0.5]
    E=A(E)
    def dist(c):   # from a point to the edge's segments
        d=1e9
        for p,q in zip(E[:-1],E[1:]):t=np.clip((c-p)@(q-p)/((q-p)@(q-p)),0,1);d=min(d,np.linalg.norm(p+t*(q-p)-c))
        return d
    for c,r,nm in KEEP:m=dist(A(c))-r;print(f'  {nm:38s} {m:5.2f} mm of metal to the edge'+('  < MARGIN' if m<MARGIN else ''))
    print(f'const TB_NOTCH=[{c1[0]:.2f},{c1[1]:.2f},{r1:.2f}];');print('const TB_EDGE='+json.dumps([[round(x,2),round(z,2)] for x,z in E])+';')
    try:   # the outline drawn back on the frames (they stay outside the repository: $MC_VIDEO/frames), through the H.json video.py anchor wrote beside each spec
        import cv2
        home=os.environ.get('MC_VIDEO',os.path.expanduser('~/mc-video'));here=pathlib.Path(__file__).resolve().parent/'anchors';ims=[]
        t=np.linspace(0,math.tau,400);rim=np.c_[BR_R*np.cos(t),BR_R*np.sin(t)];cut=np.c_[TBC[0]+TB_R*np.cos(t),TBC[1]+TB_R*np.sin(t)]
        for s in('KLUwI2UUCMQ_23-30','KLUwI2UUCMQ_13-49.5'):
            H=np.array(json.load(open(here/f'{s}.H.json'))['H']);im=cv2.imread(os.path.join(home,'frames',f'f_{s}.png'));toF=lambda P:cv2.perspectiveTransform(A(P).reshape(-1,1,2),H)[:,0].astype(np.int32)
            for P,col in[(rim,(255,140,0)),(cut,(255,140,0)),(E,(0,0,255))]:cv2.polylines(im,[toF(P)],False,col,3)
            ims.append(cv2.resize(im,(1920,1080)))
        cv2.imwrite('r_train_bridge.png',np.vstack(ims));print('wrote r_train_bridge.png')
    except Exception as e:print('no overlay:',e)
if __name__=='__main__':main()
