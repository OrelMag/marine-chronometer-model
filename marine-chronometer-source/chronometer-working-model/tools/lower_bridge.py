"""The balance lower bridge (42065), laid out after the top-view photograph and the manual's Figs. 29, 30 and 110. No browser.

    python lower_bridge.py     # prints LB_UP, LB_WALL and LB_LO for movement.js, the screw, pin and train-blocking screw positions and the clearances,
                               # and writes r_lower_bridge.png (the plan drawn back on the top-view photograph)

What the sources give:
- The manual: a stepped block. An upper tier lies against the train bridge's underside, held by two screws 42055 put in from below (Figs. 29, 67 and 110
  draw the screw head-down under the bridge; Op. 12 fits the bridge to the upturned train bridge, Op. 50 takes it off only once the train bridge is out),
  "complete with pins". The lower tier holds the balance's lower setting and endstone cap and the fourth wheel's upper setting. The train-blocking screw is
  "mounted in the balance lower bridge and is accessible through a hole in the upper train bridge", which is countersunk (Sec. II); Fig. 110's section
  shows the bridge round the screw rising to the train bridge's underside. Fig. 30 (the bridge on the upturned train bridge) gives the order along it:
  an ear with a screw, the train-blocking screw's dog point, the fourth wheel's setting, the balance's endstone cap, and from there a long arm, which the
  figure's leader names as the bridge, to its other end. Figs. 29 and 110 draw that end as a lug with a screw hole and a pin hole, and the tiers joined
  by solid curved walls round a round recess. The drawings are too loose to measure: fitted to the train bridge's rim, their holes land 4-10 mm off.
- The top-view photograph (References/photo-top-view.jpg, mapped through topview.py's five barrel-bridge screws, then shifted (+1.0, +0.96) mm so the
  train bridge's screw head at pillar (18.17, 26.92) lands on it): on the train bridge beside the fourth arbor, two countersunk holes 1.3 mm across, the
  size of the train-blocking screw's access hole (r 0.72), and in line with them and the arbor a tapped hole 1.8 mm across with a screw's end in it.
  So the train-blocking screw stands in the nearer hole, about 5 mm from the fourth arbor (on the line from the arbor to the screw, as Fig. 30 orders
  them); a steady pin in the other; the bridge's second screw in the tapped hole, in the ear. A third, dark hole near the escape wheel lands over the
  escape wheel's teeth and is not this bridge's.

- A restoration video of a 1941 Model 21 (References/VIDEOS.md, "The balance lower bridge"): on the underside the same order as Fig. 30, the balance's cap
  in a round counterbore; side-on, the lower tier a broad slab (8.8-11.9 mm above the plate), the escape wheel turning between it and the train bridge (15.6),
  its arbor through the slab; the escape wheel lifted out from above with the bridge in place. Its two settings read 8-11 mm apart on the frames' scale,
  where the model's balance and fourth arbors are 18.9 apart: the outline below keeps the model's arbors and is estimated.

So the bridge is built as a frame round the escape wheel, which turns at the upper tier's height:
- the lower tier: a slab over the hull of the balance's setting, the balance-end wall, the train-blocking screw's boss and the fourth's setting (SLAB, 2.3 mm
  round them), bored r 3.0 for the escape arbor (EHOLE, in movement.js's holes), wide enough to lift the escape pinion out through it;
- at the fourth end, a solid wall (the column round the train-blocking screw, curved round a recess over the fourth's setting) up to the upper tier's
  first piece, which carries the screw's head bore, the steady pin and the ear with its screw;
- at the balance end, a wall outside the rollers' sweep up to the upper tier's second piece, the arm: round the escape wheel's 3 o'clock side at 9.4 mm
  from its arbor to the lug, with its screw (outside every wheel, over the pillar plate's access hole: RMG No. 4E019) and a steady pin.
Outlines are unions of circles and strips joined with fillets (a smooth minimum of their distance fields), traced at 0.02 mm."""
import json,math,pathlib
import numpy as np
HERE=pathlib.Path(__file__).resolve().parent
# the model's positions (movement.js: L, PILLARS, ES)
B=np.array([8.0,6.77]);F=np.array([0.0,23.9]);E=np.array([7.193,16.135]);ES=13.16/2
PIL=np.array([18.17,26.92]);PIL_R=3.4                         # the pillar under the train bridge at 3 o'clock, r 3.4 at the upper tier's height
ROLL=4.32                                                     # the balance's widest roller part at the upper tier's and walls' heights (r about the staff)
BLOCK=np.array([(-16.07,17.11),(-15.27,19.74),(-0.17,15.10),(-0.98,12.48)])   # detent support block, in the upper tier's layer (plan corners)
# from the top-view photograph (see above)
TBLOCK=np.array([4.30,26.46]);P2=np.array([3.20,28.56]);S2=np.array([11.24,29.51])
S1=np.array([20.5,20.0])                                      # the arm's screw (unchanged: outside every wheel, over the plate's access hole)
pol=lambda r,a:E+r*np.array([math.cos(math.radians(a)),math.sin(math.radians(a))])
RA=9.4;WA=-41.5;W=pol(RA,WA)                                  # the arm's arc about the escape arbor; W: the balance-end wall, 0.35 off the rollers
ARM=np.array([W,pol(RA,-25),pol(9.5,-5),pol(10.2,10),S1])
P1=S1+3.2*(ARM[-2]-S1)/np.linalg.norm(ARM[-2]-S1)             # steady pin on the arm beside the lug
HEAD=2.9;ARM_W=3.8;FIL=0.6;REC=1.7                            # 42055's head radius (PSR); the arm's width; fillet radius; the recess round the fourth setting
def seg(P,a,b):
    ab=b-a;t=np.clip(((P-a)@ab)/(ab@ab),0,1);return np.linalg.norm(P-(a+t[...,None]*ab),axis=-1)
cir=lambda P,c,r:np.linalg.norm(P-c,axis=-1)-r
def smin(ds):
    r=ds[0]
    for q in ds[1:]:h=np.clip(0.5+0.5*(q-r)/FIL,0,1);r=q*(1-h)+r*h-FIL*h*(1-h)   # smooth minimum: a fillet where two pieces meet
    return r
WOUT=W+1.2*(W-B)/np.linalg.norm(W-B)
def poly(P,V):   # signed distance to the convex polygon V (counterclockwise or not): negative inside
    d=np.min([seg(P,V[i],V[(i+1)%len(V)]) for i in range(len(V))],axis=0);cr=lambda a,b:a[0]*b[...,1]-a[1]*b[...,0];sg=[cr(V[(i+1)%len(V)]-V[i],P-V[i]) for i in range(len(V))]
    ins=np.all(np.array(sg)>=0,axis=0)|np.all(np.array(sg)<=0,axis=0);return np.where(ins,-d,d)
SLAB=np.array([B,WOUT,TBLOCK,F]);SLAB_M=2.3;EHOLE=3.0                   # the lower tier: a slab over the hull of the settings, the balance-end wall and the train-blocking screw's boss
SDF={'upF':lambda P:smin([cir(P,TBLOCK,2.6),cir(P,S2,3.2),seg(P,TBLOCK,S2)-2.0,cir(P,P2,1.3)]),
     'upB':lambda P:smin([cir(P,S1,3.3),np.min([seg(P,a,b) for a,b in zip(ARM[:-1],ARM[1:])],axis=0)-ARM_W/2,seg(P,W,WOUT)-2.0]),
     'wallF':lambda P:np.maximum(smin([cir(P,TBLOCK,2.6),seg(P,TBLOCK,F)-2.3]),-cir(P,F,REC)),
     'wallB':lambda P:seg(P,W,WOUT)-2.0,
     'lo':lambda P:smin([seg(P,B,F)-2.3,seg(P,F,TBLOCK)-2.3,seg(P,B,WOUT)-2.2,poly(P,SLAB)-SLAB_M])}
def outline(f,step=0.02):
    import contourpy
    xs=np.arange(-12,30,step);zs=np.arange(0,36,step);X,Z=np.meshgrid(xs,zs);D=f(np.stack([X,Z],-1))
    ln=max(contourpy.contour_generator(xs,zs,D).lines(0),key=len)
    out=[ln[0]]
    for p in ln[1:]:
        if np.linalg.norm(p-out[-1])>=0.35:out.append(p)
    return np.array(out[:-1] if np.linalg.norm(out[-1]-out[0])<0.2 else out)
def main():
    O={k:outline(f) for k,f in SDF.items()}
    near=lambda k,c:np.linalg.norm(O[k]-c,axis=1).min()
    edge=lambda k,P:max(-SDF[k](np.atleast_2d(P))[0],0)
    bd=lambda k:min(min(seg(O[k],BLOCK[i],BLOCK[(i+1)%4]).min() for i in range(4)),99)
    print('clearances, mm (upper tier: TB_U .. TB_U+2; walls: down to the lower tier):')
    for k in('upF','upB','wallF','wallB'):
        print(f'  {k:6s} escape wheel tips {near(k,E)-ES:5.2f}   rollers {near(k,B)-ROLL:6.2f}   pillar {near(k,PIL)-PIL_R:5.2f}   detent block {bd(k):5.2f}')
    print(f'  lower tier: the escape arbor hole r {EHOLE} (the pinion, r 1.9, lifts out through it), metal round it {-SDF["lo"](np.atleast_2d(E))[0]-EHOLE:5.2f}')
    print('holes: metal round them, mm')
    hc=HEAD*0.5*1.12+0.01
    for k,c,r in(('upB',S1,hc),('upF',S2,hc),('upB',P1,0.41),('upF',P2,0.41),('upF',TBLOCK,0.95),('wallF',TBLOCK,0.95),('lo',TBLOCK,0.86),('lo',B,1.2),('lo',F,1.2)):
        print(f'  {k:6s} at ({c[0]:6.2f},{c[1]:6.2f}) r {r:4.2f}: {edge(k,c)-r:5.2f}')
    print('the screws\' heads (r 2.9, hanging under the upper tier):')
    for n,s in(('S1',S1),('S2',S2)):
        print(f'  {n}: walls {min(near("wallF",s),near("wallB",s))-HEAD:5.2f}, lower tier {near("lo",s)-HEAD:5.2f}, escape wheel {np.linalg.norm(s-E)-ES-HEAD:5.2f}, pillar {np.linalg.norm(s-PIL)-PIL_R-HEAD:5.2f}, fourth wheel tips (r 9.65) {np.linalg.norm(s-F)-9.65:5.2f}')
    print(f'train-blocking screw {np.linalg.norm(TBLOCK-F):.2f} mm from the fourth arbor')
    r2=lambda P:[[round(float(x),2),round(float(z),2)] for x,z in P]
    print('const LB_UP=['+json.dumps(r2(O['upF']))+','+json.dumps(r2(O['upB']))+'];')
    print('const LB_WALL=['+json.dumps(r2(O['wallF']))+','+json.dumps(r2(O['wallB']))+'];')
    print('const LB_LO='+json.dumps(r2(O['lo']))+';')
    print('S.tBlock',r2([TBLOCK]),'S.lb',r2([S1,S2]),'S.lbp',r2([P1,P2]))
    try:   # the overlay: the plan on the top-view photograph, through topview.py's five screws and the shift onto the train bridge's plane
        from PIL import Image,ImageDraw
        D2R=math.pi/180;BA=(-18.56,0.19);PB=lambda r,a,y:[BA[0]+r*math.cos(a*D2R),y,BA[1]+r*math.sin(a*D2R)]   # topview.py's five screws (PTS)
        PTS=[([-15.3,-28.76,-26.58],(1353,325)),(PB(11.6,288,-30.21),(1410,608)),(PB(11.1,107,-30.21),(1615,995)),([29.24,-25.36,-12.28],(510,778)),([32.11,-28.76,-4.1],(495,925))]
        X=np.array([[p[0],p[2],1] for p,_ in PTS]);Y=np.array([q for _,q in PTS],float);M=np.linalg.lstsq(X,Y,rcond=None)[0]
        T=lambda P:[tuple(np.array([x-1.0,z-0.96,1])@M) for x,z in P]
        im=Image.open(HERE.parents[2]/'References'/'photo-top-view.jpg').convert('RGB');dr=ImageDraw.Draw(im)
        for k,cl in(('lo',(0,120,255)),('wallF',(0,200,0)),('wallB',(0,200,0)),('upF',(255,0,0)),('upB',(255,0,0))):dr.line(T(list(O[k])+[O[k][0]]),fill=cl,width=2)
        for c,r in((S1,hc),(S2,hc),(P1,0.41),(P2,0.41),(TBLOCK,0.72)):dr.line(T([c+r*np.array([math.cos(a),math.sin(a)]) for a in np.linspace(0,2*math.pi,40)]),fill=(255,255,0),width=2)
        im.crop((850,950,1550,1560)).save('r_lower_bridge.png');print('wrote r_lower_bridge.png')
    except ImportError:pass
if __name__=='__main__':main()
