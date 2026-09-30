"""The balance lower bridge's upper tier (42065), laid out after the manual's Figs. 29, 30 and 110. No browser.

    python lower_bridge.py     # prints LB_UP and the screw and pin positions for movement.js, the clearances, and writes r_lower_bridge.png

What the manual gives: a stepped block. An upper tier lies against the train bridge's underside, held by two screws 42055 put in from below (Figs. 29,
67 and 110 draw the screw head-down under the bridge; Op. 12 fits the bridge to the upturned train bridge, Op. 50 takes it off only once the train
bridge is out), with steady pins ("complete with pins"). A long curved arm (Fig. 30, underside) carries one screw at its end. The lower tier holds the
balance's lower setting and endstone cap and the fourth wheel's upper setting, and the train-blocking screw's column joins the two (Fig. 110's section).
The RMG's description of No. 4E019 adds a large hole in the pillar plate for access to one of the two screws, so that screw has a clear line down to
the plate.

Fig. 110 is too loose to trace the outline from: fitted like Fig. 67 (train_bridge.py) to the train bridge's rim and barrel cut (about 0.4 mm rms), the
drawing's holes land 4-10 mm from the model's. So the outline is built here from the arrangement the figures show, placed by what it has to clear:
- the arm runs round the escape wheel, which turns in the same layer (its tips 6.58 mm from the arbor), as Fig. 110's curved wall does;
- the screw at the arm's end (S1) stands where Fig. 110 puts the lug (on the 3 o'clock side of the train-blocking screw), outside every wheel so the
  access hole reaches it, between the escape wheel and the pillar at (18.17, 26.92);
- the other screw (S2) sits on a lobe beside the train-blocking screw's column, its head clear of the column and the boss, and outside the lower tier, so it
  comes out downward (it is put in from below) past nothing but air.
The outline is the union of circles, a boss and a strip along the arm, joined with fillets (a smooth minimum of their distance fields), traced at
0.02 mm. The overlay draws it back on Fig. 110 through the train bridge's affine map, shifted along the drawing's vertical so the train-blocking
screw's bore lands on the drawn one: a comparison of arrangement, not of size."""
import json,math
import numpy as np
from scipy.optimize import least_squares
# the model's positions (movement.js: L, S, PILLARS, ES)
B=np.array([8.0,6.77]);F=np.array([0.0,23.9]);E=np.array([7.193,16.135]);ES=13.16/2
TBLOCK=F+[0,3.5];PIL=np.array([18.17,26.92]);PIL_R=2.9      # train-blocking screw (S.tBlock); the pillar under the train bridge at 3 o'clock, r 2.9 at the top
lbu=(F-B)/np.linalg.norm(F-B);lbn=np.array([-lbu[1],lbu[0]]);LBm=B+(F-B)*0.9;BOSS=[LBm+lbn*1.1,LBm-lbn*1.1]   # the boss between the tiers (movement.js)
BLOCK=np.array([(-16.07,17.11),(-15.27,19.74),(-0.17,15.10),(-0.98,12.48)])   # detent support block, in the same layer (plan corners)
S1=np.array([20.5,20.0]);S2=np.array([-5.3,26.2])            # the two screws (42055)
PINS=np.array([[16.9,21.3],[-2.6,26.4]])                     # steady pins, one by each screw
HEAD=2.9;ARM_W=3.2;FIL=0.6                                   # 42055's head radius (PSR); the arm's width; fillet radius
ARM=np.array([S2,(-1.5,26.6),(2.6,25.9),E+9.0*np.array([0,1]),E+9.0*np.array([math.cos(math.radians(62)),math.sin(math.radians(62))]),
              E+9.1*np.array([math.cos(math.radians(38)),math.sin(math.radians(38))]),S1])
def seg(P,a,b):
    ab=b-a;t=np.clip(((P-a)@ab)/(ab@ab),0,1);return np.linalg.norm(P-(a+t[...,None]*ab),axis=-1)
def sdf(P):
    d=[np.linalg.norm(P-S1,axis=-1)-3.3,np.linalg.norm(P-S2,axis=-1)-3.1,np.linalg.norm(P-TBLOCK,axis=-1)-2.4,seg(P,*BOSS)-1.5,seg(P,LBm,TBLOCK)-1.5]
    d.append(np.min([seg(P,a,b) for a,b in zip(ARM[:-1],ARM[1:])],axis=0)-ARM_W/2)
    r=d[0]
    for q in d[1:]:h=np.clip(0.5+0.5*(q-r)/FIL,0,1);r=q*(1-h)+r*h-FIL*h*(1-h)   # smooth minimum: a fillet where two pieces meet
    return r
def outline(step=0.02):
    import contourpy
    xs=np.arange(-10,26,step);zs=np.arange(14,33,step);X,Z=np.meshgrid(xs,zs);D=sdf(np.stack([X,Z],-1))
    ln=max(contourpy.contour_generator(xs,zs,D).lines(0),key=len)
    out=[ln[0]]
    for p in ln[1:]:
        if np.linalg.norm(p-out[-1])>=0.4:out.append(p)
    return np.array(out[:-1] if np.linalg.norm(out[-1]-out[0])<0.2 else out)
def fit110():
    """the affine map of Fig. 110's upper train bridge (page 98 at 400 dpi, pixels from page fraction x 0.40, y 0.08), fitted as train_bridge.py fits Fig. 67"""
    BR_R=40.5;TBC=np.array([-18.56,0.19])*22.56/18.56;TB_R=19.2
    RIM=np.array([(398,372),(350,388),(305,400),(245,450),(205,490),(170,550),(160,575),(155,600),(150,650),(182,700),(205,740),(245,780),(290,810),(340,830),(390,845)],float)
    BAR=np.array([(760,582),(720,600),(690,620),(665,645),(652,675),(648,705),(655,740),(675,775),(705,800),(745,822)],float)
    aff=lambda p:(np.array([[p[0],p[1]],[p[2],p[3]]]),np.array(p[4:6]))
    def res(p):
        A,t=aff(p);Ai=np.linalg.inv(A);r=[]
        for P,c,R in[(RIM,np.zeros(2),BR_R),(BAR,TBC,TB_R)]:r+=list(np.hypot(*((Ai@(P-t).T).T-c).T)-R)
        return r
    best=None
    for a in np.linspace(0,2*math.pi,24,endpoint=False):
        for fl in(1,-1):
            o=least_squares(res,[8.6*math.cos(a),-8.6*math.sin(a)*fl,6.5*math.sin(a),6.5*math.cos(a)*fl,500,640])
            if -150<np.linalg.det(aff(o.x)[0])<-20 and(best is None or o.cost<best.cost):best=o   # det < 0: the fusee's side on -z; the bounds keep it off the degenerate fit
    A,t=aff(best.x);r=np.array(res(best.x));return A,t,np.sqrt((r**2).mean())
def main():
    O=outline();sd=lambda P:sdf(np.atleast_2d(np.array(P,float)))
    dist=lambda c:np.linalg.norm(O-c,axis=1).min()
    print('clearances in the upper tier\'s layer (y TB_U .. TB_U+2), mm:')
    print(f'  escape wheel tips       {dist(E)-ES:5.2f}')
    print(f'  pillar (r {PIL_R})          {dist(PIL)-PIL_R:5.2f}')
    cr=lambda a,b:a[0]*b[1]-a[1]*b[0];inb=lambda p:len({np.sign(cr(BLOCK[(i+1)%4]-BLOCK[i],p-BLOCK[i])) for i in range(4)})==1
    print(f'  detent support block    {min(seg(O,BLOCK[i],BLOCK[(i+1)%4]).min() for i in range(4)):5.2f}'+('  (INSIDE)' if any(inb(p) for p in O) else ''))
    print(f'  balance rollers (r 3.6) {dist(B)-3.6:5.2f}')
    print('the screws\' heads (r 2.9, y TB_U+2 .. TB_U+3.6):')
    for n,s in(('S1',S1),('S2',S2)):
        print(f'  {n}: lower tier (r 2.3 round the fourth arbor) {np.linalg.norm(s-F)-2.3-HEAD:5.2f}, third wheel tips (r 11.25) {np.linalg.norm(s-np.array([-4.86,12.11]))-11.25-HEAD:5.2f}')
        print(f'  {n}: escape wheel {np.linalg.norm(s-E)-ES-HEAD:5.2f}, column (r 1.9) {np.linalg.norm(s-TBLOCK)-1.9-HEAD:5.2f}, boss (r 1.5) {seg(s,*BOSS)-1.5-HEAD:5.2f}, '
              f'pillar {np.linalg.norm(s-PIL)-PIL_R-HEAD:5.2f}, metal round the hole {-sd(s)[0]-HEAD*0.5*1.12:5.2f}')
    for p in PINS:print(f'  pin {p}: metal round it {-sd(p)[0]-0.4:5.2f}')
    print(f'{len(O)} points');print('const LB_UP='+json.dumps([[round(x,2),round(z,2)] for x,z in O])+';')
    print('S1',S1.tolist(),'S2',S2.tolist(),'pins',PINS.tolist())
    try:   # the overlay needs PyMuPDF (pip install pymupdf) to render the figure from the manual
        import io,pathlib,pymupdf
        from PIL import Image,ImageDraw
        A,t,rms=fit110();print(f"Fig. 110's train bridge: {rms:.2f} mm rms")
        pg=pymupdf.open(pathlib.Path(__file__).resolve().parents[3]/'References'/'navships-250-624-overhaul-manual-1948.pdf')[97];r=pg.rect;k=r.width/3203
        clip=pymupdf.Rect(r.x0+r.width*0.40,r.y0+r.height*0.08,r.x0+r.width*0.40+1025*k,r.y0+r.height*0.08+1400*k)
        im=Image.open(io.BytesIO(pg.get_pixmap(dpi=400,clip=clip).tobytes('png'))).convert('RGB');dr=ImageDraw.Draw(im)
        sh=np.array([545,1120])-(A@TBLOCK+t)   # the bore of the drawn train-blocking column
        toD=lambda P,s=0:[tuple(A@np.array(p)+t+s) for p in P]
        dr.line(toD(list(O)+[O[0]],sh),fill=(255,0,0),width=3)
        for c,rr in((S1,1.6),(S2,1.6),(TBLOCK,0.95)):dr.line(toD([c+rr*np.array([math.cos(a),math.sin(a)]) for a in np.linspace(0,2*math.pi,40)],sh),fill=(255,0,0),width=2)
        im.save('r_lower_bridge.png');print('wrote r_lower_bridge.png')
    except ImportError:pass
if __name__=='__main__':main()
