"""The upper train bridge's outline, traced on the manual's Fig. 67 (the same plate as Figs. 29 and 110). No browser.

    python train_bridge.py     # prints TB_EDGE for movement.js and writes r_train_bridge.png (the figure with the model's outline drawn back on it)

Fig. 67 draws the plate in parallel projection, so an affine map takes it into the movement frame. It is fitted to the plate's rim (radius BR_R) and to the
cut round the barrel (the model's circle about TBc, which the drawing's lower cutout follows to 0.7 mm), with the handedness that puts the upper cutout on
the fusee's side (-z). Fit: 0.34 mm rms over 19 points. Through it, the pillar screws' holes, the centre, third and fourth wheel holes land within about
1-2 mm of drawn holes; the keyhole opening lands about 5 mm off the balance and escape arbors, so the keyhole is built from the model's own centres instead.

The notch round the fusee: its edge, from the rim (the mouth, extended along the first drawn segment) down past the centre arbor to the horn's tip and on
into the barrel's cut, is pushed off every screw hole, bushing and pivot the bridge must hold until each keeps MARGIN of metal round it, then smoothed.
Points are in pixels of page 49 (Fig. 67) of References/navships-250-624-overhaul-manual-1948.pdf rendered at 400 dpi, clipped to x 0.33-0.60, y 0.03-0.20
of the page."""
import json,math
import numpy as np
from scipy.optimize import least_squares
BR_R=40.5;BA=np.array([-18.56,0.19]);TBC=BA*22.56/18.56;TB_R=19.2;FU=np.array([11.59,-19.8])
MARGIN=1.0
g=lambda pts:np.array([(90+x/2,150+y/2) for x,y in pts],float)   # measured on a 2x view of the clip, offset (90, 150)
RIM=g([(45,300),(40,420),(70,560),(140,690),(260,780),(420,850),(600,900),(800,915),(1000,905),(100,220),(200,110),(300,40)])
BARREL=g([(950,420),(880,480),(855,550),(870,620),(930,690),(1000,730),(1060,760)])
NOTCH=g([(575,5),(545,70),(515,150),(512,200),(530,240),(570,275),(620,300),(700,330),(800,352),(900,350),(1000,335),(1045,328),(1055,360),(1050,392),(1000,398),(950,420)])
# what the bridge holds (x, z, radius of the hole or part): the model's screw holes (clearance or tapped), bushings and pivots on the fusee side
KEEP=[((0,0),1.2,'centre bushing'),((22.27,-1.31),0.72,'sustaining pawl arbor'),((29.24,-12.28),1.47,'barrel bridge screw (tapped)'),((32.11,-4.1),1.64,'barrel bridge screw into pillar'),
      ((8+10.6*math.cos(math.radians(-30)),6.77+10.6*math.sin(math.radians(-30))),0.42,'locking arm screw'),((21.99,2.59),0.3,"sustaining pawl spring's pin")]
def fit():
    aff=lambda p:(np.array([[p[0],p[1]],[p[2],p[3]]]),np.array(p[4:6]))
    def res(p):
        A,t=aff(p);Ai=np.linalg.inv(A);r=[]
        for P,c,R in[(RIM,np.zeros(2),BR_R),(BARREL,TBC,TB_R)]:r+=list(np.hypot(*((Ai@(P-t).T).T-c).T)-R)
        return r
    best=None
    for a in np.linspace(0,2*math.pi,24,endpoint=False):
        for fl in(1,-1):
            o=least_squares(res,[4.3*math.cos(a),-4.3*math.sin(a)*fl,2.6*math.sin(a),2.6*math.cos(a)*fl,430,420])
            if np.linalg.det(aff(o.x)[0])<0 and (best is None or o.cost<best.cost):best=o   # det < 0: the fusee's cutout on -z
    A,t=aff(best.x);r=np.array(res(best.x));return A,t,np.sqrt((r**2).mean())
def main():
    A,t,rms=fit();Ai=np.linalg.inv(A);toM=lambda P:(Ai@(np.array(P)-t).T).T
    e=toM(NOTCH);d=e[0]-e[1];e=np.vstack([e[0]+d/np.linalg.norm(d)*8,e])   # the mouth, carried out past the rim
    fine=[];
    for a,b in zip(e[:-1],e[1:]):
        n=max(1,int(np.linalg.norm(b-a)/0.4))
        for k in range(n):fine.append(a+(b-a)*k/n)
    fine.append(e[-1]);E=np.array(fine)
    for _ in range(60):   # push the edge off what the bridge must hold (toward the notch, the fusee's side), then smooth it
        for c,r,_n in KEEP:
            c=np.array(c);v=E-c;dd=np.hypot(*v.T);m=dd<r+MARGIN
            E[m]=c+v[m]/dd[m,None]*(r+MARGIN)
        E[1:-1]=0.25*E[:-2]+0.5*E[1:-1]+0.25*E[2:]
    for c,r,n in KEEP:print(f'  {n:34s} {np.hypot(*(E-np.array(c)).T).min()-r:5.2f} mm of metal to the notch')
    E=E[::3] if len(E)>60 else E
    print(f'fit: {rms:.2f} mm rms');print('const TB_EDGE='+json.dumps([[round(x,2),round(z,2)] for x,z in E])+';')
    try:   # the overlay needs PyMuPDF (pip install pymupdf) to render the figure from the manual
        import io,pathlib,pymupdf
        from PIL import Image,ImageDraw
        pg=pymupdf.open(pathlib.Path(__file__).resolve().parents[3]/'References'/'navships-250-624-overhaul-manual-1948.pdf')[59];r=pg.rect
        clip=pymupdf.Rect(r.x0+r.width*0.33,r.y0+r.height*0.03,r.x0+r.width*0.60,r.y0+r.height*0.20)
        im=Image.open(io.BytesIO(pg.get_pixmap(dpi=400,clip=clip).tobytes('png'))).convert('RGB')
        if im:
            dr=ImageDraw.Draw(im);toD=lambda P:[tuple(A@np.array(p)+t) for p in P]
            dr.line(toD([(BR_R*math.cos(a),BR_R*math.sin(a)) for a in np.linspace(0,2*math.pi,200)]),fill=(0,140,255),width=2)
            dr.line(toD([TBC+TB_R*np.array([math.cos(a),math.sin(a)]) for a in np.linspace(0,2*math.pi,200)]),fill=(0,140,255),width=2)
            dr.line(toD(E),fill=(255,0,0),width=3);im.save('r_train_bridge.png');print('wrote r_train_bridge.png')
    except ImportError:pass
if __name__=='__main__':main()
