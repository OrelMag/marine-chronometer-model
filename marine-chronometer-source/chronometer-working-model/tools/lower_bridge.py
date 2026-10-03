"""The balance lower bridge (42065), laid out after a restoration video of a 1941 Model 21 and the manual's Figs. 29, 30 and 110. No browser.

    python lower_bridge.py     # prints LB_UP, LB_WALL, LB_LO and LB_LO2 for movement.js, the screw, pin and train-blocking screw positions and the clearances,
                               # and writes r_lower_bridge.png (the plan, with the measured bridge beside it); about 2.5 minutes

What the sources give:
- The manual: a stepped block. An upper tier lies against the train bridge's underside, held by two screws 42055 put in from below (Figs. 29, 67 and 110
  draw the screw head-down under the bridge; Op. 12 fits the bridge to the upturned train bridge, Op. 50 takes it off only once the train bridge is out),
  "complete with pins". The lower tier holds the balance's lower setting and endstone cap and the fourth wheel's upper setting. The train-blocking screw is
  "mounted in the balance lower bridge and is accessible through a hole in the upper train bridge" (Sec. II); Fig. 110's section shows the bridge round the
  screw rising to the train bridge's underside, and Fig. 110 draws the bridge as a C round a large opening. Fig. 30 (the bridge on the upturned train bridge)
  gives the order along it: a lug with a screw, the train-blocking screw's dog point, the fourth wheel's setting, the balance's endstone cap, and from there a
  long arm, which the figure's leader names as the bridge, to its other end.
- The restoration video (References/VIDEOS.md, KLUwI2UUCMQ; C Spinner, serial 2E8489): at 13:49.5 the upper train bridge held underside up with the bridge on
  it, face-on and sharp at 4K; also 13:48 (oblique), 36:01 (on the mat), side-on at 36:41-36:49 and 42:56; a second video (Boulder Horological Society,
  TWQsSVWuikk, 43:13) shows the same bridge. Two levels: the slab (the lower level) and a lug at each end (the upper level) against the train bridge, each
  with its screw, the slab standing off the bridge so the escape wheel turns between them. The slab is curved as a lens, not a straight-sided plate: seen
  from below, a long outer edge on a circle (r 20.8, 0.2 mm rms) from the 3 o'clock lug round past the centre arbor, a flatter convex edge (r 25.7) down to
  the fourth's end, a straight edge across it, a short one up to the escape lobe, and a concave edge on the lobe's circle (r 7.1, 0.04 mm rms), so the escape
  wheel lifts out past the slab; a chamfer about 1 mm wide round the convex edges. Measured with tools/framecam.py (anchors/lower_bridge_13-49.5.json): the
  frame's homography on the bridge's rim, barrel cut and centre bushing (video.py anchor, 0.2-0.3 mm rms) gives the camera (f 6000 px), and the picks go
  back at their heights (the slab's face 7.9 mm off the bridge's underside, the lugs' 3.3); MEAS below, in the train bridge's frame, which is the model's.
- What doesn't carry over: the model's balance and fourth arbors stand 5.2 and 4.3 mm from the real cap and setting (on the video 11.0 mm apart; the model's
  18.9), and its escape arbor 0.5 mm inside the lobe's circle (Review-results.md, "The balance lower bridge", 14). The slab is the measured one where the
  real bridge is; only round the model's arbors does it change: 1 mm of metal round the cap's counterbore and the fourth's sink (a bulge of about 1 mm at
  each), a bite r 2.4 round the escape arbor (its pinion lifts out), 1 mm off the third arbor, clear of the far screw's head. The far lug is the measured
  one less where the model's detent, the pillar, a barrel bridge screw and the balance locking arm's screw and pin stand, which on the real movement are
  elsewhere; it also takes the train-blocking screw's column.

Since the photographed group's 14° turn (PHOTO_TURN, PT in movement.js) the measurement, in the train bridge's frame, turns with it; the model's arbors are its
own (the fourth and third don't turn). The turned detent then crosses the slab beside the fourth arbor, so the train-blocking screw has a column of its own past
the slab's end, and the third arbor a slot to the slab's edge.

The slab is the intersection of its circles and edges' distance fields; the lugs are polygons with their corners rounded (r 0.8); the walls their
intersections with the slab; all traced at 0.02 mm."""
import json,math,pathlib
import numpy as np
HERE=pathlib.Path(__file__).resolve().parent
# the model's positions (movement.js: L, PILLARS, ES, S)
B=np.array([1.609,10.277]);F=np.array([0.0,21.6]);E=np.array([9.352,15.607]);T=np.array([-8.524,14.186]);C=np.array([0.0,0.0]);ES=13.16/2
PIL=np.array([[5.5, 33.96],[-27.83,19.7]]);PIL_R=3.4                                   # the train bridge's pillars near the bridge, r 3.4 at the upper tier's height
BB2=np.array([-23.88,22.98]);ARM=np.array([[6.28,29.72],[7.25,31.41]])                 # holes in the train bridge: a barrel-bridge screw (S.bb[2]), the balance locking arm's screw and stop pin (S.arm, S.armPin)
ROLL=4.32                                                                                # the balance's widest roller part at the walls' heights (r about the staff)
DET=np.array([[1.19, 12.11], [0.69, 12.67], [1.01, 12.96], [-0.5, 19.41], [-0.88, 19.33], [-1.37, 21.63], [-1.65, 22.0], [-1.5, 22.22], [1.46, 22.93], [0.63, 26.53], [-0.21, 26.44], [-0.61, 28.16], [-1.79, 27.9], [-1.86, 28.32], [-0.68, 28.59], [-1.0, 29.98], [-1.25, 29.98], [-1.34, 30.31], [-2.47, 30.03], [-2.87, 31.75], [-1.83, 32.1], [-1.81, 32.45], [-1.59, 32.51], [-1.86, 33.89], [-2.98, 33.67], [-3.16, 34.06], [-1.97, 34.37], [-2.54, 36.74], [-1.51, 37.04], [-1.23, 36.42], [0.16, 36.74], [0.28, 36.31], [-0.28, 36.11], [-0.17, 35.89], [1.54, 36.25], [4.85, 21.56], [3.54, 21.16], [3.86, 19.77], [4.17, 19.76], [4.37, 19.0], [4.07, 18.81], [4.39, 17.41], [4.69, 17.4], [4.87, 16.54], [3.08, 16.26], [3.41, 15.16], [3.02, 14.99], [3.19, 14.14], [1.16, 12.47]])   # the detent's plan, rasterised from the built model's meshes (it turns with the escapement, 9.40 from the balance)
# the real bridge, measured on KLUwI2UUCMQ 13:49.5 (the upper train bridge's underside face-on, the bridge on it; tools/anchor_heights.py): mm in the train bridge's frame, which is the
# model's (the frame's homography fitted on the bridge's rim, its cut round the barrel and the centre bushing, 0.2-0.3 mm rms; the camera recovered from it at f 6000 px, where its axes
# come out orthonormal; the slab's face put back 7.9 mm below the bridge's underside, the lugs' 3.3). The slab's outline (traced on the frame), its two convex edges and the concave one
# as circles fitted to it (x, z, r), the lugs (traced), the screws, the cap's jewel and the fourth's setting. Over f 5000-7000 every point moves 0.5 mm or less.
MEAS={'slab':[[16.61,2.44],[16.13,8.54],[13.47,8.38],[11.45,8.77],[9.89,9.6],[8.29,10.86],[7.3,12.67],[6.77,14.49],[6.74,16.65],[6.92,17.88],[7.61,19.61],[7.7,21.26],[8.77,22.16],[6.17,26.77],[-0.03,26.49],[-6.06,26.22],[-5.69,23.94],[-5.3,21.38],[-5.0,19.71],[-4.88,17.61],[-3.87,14.62],[-4.45,12.22],[-3.78,10.7],[-2.63,8.46],[-2.14,6.99],[-0.91,6.01],[0.47,5.13],[2.1,4.39],[3.81,3.71],[5.56,3.04],[7.44,2.59],[9.47,2.23],[11.36,2.06],[13.29,1.91],[15.14,1.99]],
  'lugA':[[26.31,5.13],[24.29,10.89],[19.45,11.06],[18.22,10.6],[17.95,9.95],[18.44,3.65],[18.66,2.54]],'lugB':[[-5.53,26.65],[-10.56,25.62],[-13.75,22.61],[-11.15,16.79],[-7.42,16.43],[-3.78,19.34],[-4.21,23.23]],
  'screwA':[20.7, 7.23],'screwB':[-9.18, 21.87],'cap':[3.79, 9.75],'fourth':[2.89, 20.73]}
OUT=np.array([11.9,22.74]);R_OUT=20.81   # the outer edge: a circle, 0.2 mm rms over 13 points from the 3 o'clock lug round past the centre arbor
LEFT=np.array([19.94,21.1]);R_LEFT=25.66   # the edge down to the fourth's end: a flatter circle (0.5 mm rms)
LOBE=np.array([13.81,15.51]);R_LOBE=7.14   # the concave edge: round the train bridge's escape lobe (finding 18 under Elsewhere: r 7.0 about (12.6, 15.4)), 0.04 mm rms
BOT=np.array([[6.17,26.77],[-6.06,26.22]]);SIDE=np.array([[8.77,22.16],[6.17,26.77]]);END=np.array([[16.61,2.44],[16.13,8.54]])   # the straight edges: across the fourth's end, up to the lobe, the 3 o'clock end
pol=lambda c,r,a:c+r*np.array([math.cos(math.radians(a)),math.sin(math.radians(a))])
S1=np.array(MEAS['screwA'])                                                              # the 3 o'clock lug's screw, as measured (the pillar plate's access hole follows it)
S2=np.array(MEAS['screwB'])                                                              # the far lug's, as measured (0.4 mm from the model's earlier place)
TBLOCK=pol(F,5.0,230)                                                                    # train-blocking screw: 5 mm from the fourth arbor (within the spokes), in the far lug's column, clear of the locking arm's screw and pin
P1=np.array([23.4,8.6]);P2=np.array([-7.4,23.9])                                         # steady pins, one in each lug
HEAD=2.9;FIL=0.5;CB=4.3;EP=2.4;CB_M=1.0                                                  # 42055's head radius (PSR); fillet; the cap's counterbore; the clearance round the escape arbor (its pinion, r 1.9, lifts out); metal round the counterbore and sink
# the lugs: as measured, the 3 o'clock one carried 1 mm in over the slab's end for the wall that joins them; the far one with the train-blocking screw's column, trimmed where the model has
# parts the real one hasn't there (the detent, the pillar, the barrel bridge's screw, the locking arm's screw and stop pin)
LUGL=[[26.31,5.13],[24.29,10.89],[19.45,11.06],[16.9,9.9],[15.4,8.9],[15.5,2.9],[18.66,2.54]]
LUGR=MEAS['lugB'][:5]+[[-3.6,17.6],[-1.4,17.9],[-1.2,21.8],[-4.21,23.23]]
# the photographed group's turn (PHOTO_TURN, PT in movement.js): the bridge is measured in the train bridge's frame, which turns with the group; the model's arbors above are its own
TURN=math.radians(14);_R=np.array([[math.cos(TURN),math.sin(TURN)],[-math.sin(TURN),math.cos(TURN)]]);PT=lambda P:np.asarray(P,float)@_R
MEAS={k:PT(v).round(2).tolist() for k,v in MEAS.items()};OUT,LEFT,LOBE,BOT,SIDE,END=(PT(v) for v in(OUT,LEFT,LOBE,BOT,SIDE,END))
S1,S2=np.array(MEAS['screwA']),np.array(MEAS['screwB']);P1,P2=PT(P1),PT(P2);LUGL=PT(LUGL).tolist()
# the far lug as measured (turned); the train-blocking screw in a column of its own: the model's detent, turned with the escapement (since the balance stands on the video's
# cap, its blade runs past the fourth arbor), covers the video's place; the column stands 4.5 mm from the fourth arbor on the escape side, where it keeps at least 1.1 mm from
# the detent, the escape wheel, the locking arm and the detent block's screw, just past the slab's side edge, with a boss of the slab round it
LUGR=MEAS['lugB'];P2=np.array([-13.6,16.4]);TBLOCK=np.array([-5.568,18.552]);COL=1.95
COLT=[list(TBLOCK+COL*np.array([np.cos(a),np.sin(a)])) for a in np.radians(np.arange(0,360,45))]
def fillet(P,r=0.8,n=5):   # each corner cut back by r (at most 0.4 of either edge) and rounded with a quadratic Bezier; straight edges stay straight
    P=[np.array(p,float) for p in P];out=[]
    for i,p in enumerate(P):
        a,b=P[i-1],P[(i+1)%len(P)];ra=min(r,0.4*np.linalg.norm(p-a));rb=min(r,0.4*np.linalg.norm(b-p))
        p0=p+(a-p)*ra/np.linalg.norm(a-p);p1=p+(b-p)*rb/np.linalg.norm(b-p)
        out+=[(1-t)**2*p0+2*t*(1-t)*p+t*t*p1 for t in np.linspace(0,1,n)]
    return np.array(out)
def seg(P,a,b):
    ab=b-a;t=np.clip(((P-a)@ab)/(ab@ab),0,1);return np.linalg.norm(P-(a+t[...,None]*ab),axis=-1)
cir=lambda P,c,r:np.linalg.norm(P-c,axis=-1)-r
def poly(P,V):   # signed distance to the simple polygon V: negative inside (even-odd)
    V=np.asarray(V);d=np.min([seg(P,V[i],V[(i+1)%len(V)]) for i in range(len(V))],axis=0);x,z=P[...,0],P[...,1];ins=np.zeros(x.shape,bool)
    for i in range(len(V)):
        a,b=V[i],V[(i+1)%len(V)];c=((a[1]>z)!=(b[1]>z))&(x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1]+1e-12)+a[0]);ins^=c
    return np.where(ins,-d,d)
def smin(ds):
    r=ds[0]
    for q in ds[1:]:h=np.clip(0.5+0.5*(q-r)/FIL,0,1);r=q*(1-h)+r*h-FIL*h*(1-h)   # smooth minimum: a fillet where two pieces meet
    return r
LL,LR,LT=fillet(LUGL),fillet(LUGR),fillet(COLT,0.6)
def line(P,a,b):   # signed distance to the line through a and b: positive on its right (seen from a to b)
    d=(b-a)/np.linalg.norm(b-a);return (P[...,0]-a[0])*d[1]-(P[...,1]-a[1])*d[0]
CH=0.8   # the chamfer round the slab's convex edges and its straight end: on the frame a bright band about 1 mm wide outside the face's edge, which the outline was traced on
def lo(P,ch=CH):   # the slab: inside both convex circles, short of the straight edges, outside the escape lobe, the convex edges and the end ch out from the face's; then the model's own
    # arbors: metal round the cap's counterbore and the fourth's sink, and room for the escape arbor and the third arbor
    d=np.maximum.reduce([cir(P,OUT,R_OUT+ch),cir(P,LEFT,R_LEFT+ch),line(P,*BOT)-ch,line(P,*SIDE),line(P,*END),R_LOBE-np.linalg.norm(P-LOBE,axis=-1)])
    d=smin([d,cir(P,B,CB+CB_M),cir(P,F,2.7+CB_M),cir(P,TBLOCK,1.15+1.1)])
    return np.maximum.reduce([d,EP-np.linalg.norm(P-E,axis=-1),1.55-seg(P,T,T+np.array([-8.0,-1.0])),HEAD+0.5-np.linalg.norm(P-S2,axis=-1)])   # the third arbor in a slot to the edge: it stands inside the turned slab (Review-results 19, the third arbor)   # and clear of the far screw's head, put in from below
KEEP=[(BB2,1.47+0.5),(ARM[0],0.8+0.5),(ARM[1],0.3+0.5),(PIL[1],PIL_R+0.7)]
upR=lambda P:np.maximum.reduce([poly(P,LR),1.0-poly(P,DET)]+[r-np.linalg.norm(P-c,axis=-1) for c,r in KEEP])
upL=lambda P:np.maximum(poly(P,LL),ES+1.0-np.linalg.norm(P-E,axis=-1))   # the 3 o'clock lug 1 mm off the escape wheel's tips, which the turned escape arbor brings near it
SDF={'upR':upR,'upT':lambda P:poly(P,LT),'upL':upL,
     'wallR':lambda P:np.maximum(upR(P),lo(P)),'wallT':lambda P:np.maximum(poly(P,LT),lo(P)),'wallL':lambda P:np.maximum(upL(P),lo(P)),'lo':lo,'lo2':lambda P:lo(P,0.0)}
def outline(f,step=0.02):
    import contourpy
    xs=np.arange(-16,30,step);zs=np.arange(-2,34,step);X,Z=np.meshgrid(xs,zs);D=f(np.stack([X,Z],-1))
    ln=max(contourpy.contour_generator(xs,zs,D).lines(0),key=len)
    out=[ln[0]]
    for p in ln[1:]:
        if np.linalg.norm(p-out[-1])>=0.35:out.append(p)
    P=np.round(np.array(out[:-1] if np.linalg.norm(out[-1]-out[0])<0.2 else out),2)   # rounded as movement.js has them, then simplified
    while True:   # straight edges as one segment: three.js's triangulation joins a hole wrongly to an outline with collinear (or nearly, 3 microns) points on it
        a,c=np.roll(P,1,0),np.roll(P,-1,0);k=np.abs((P[:,0]-a[:,0])*(c[:,1]-P[:,1])-(P[:,1]-a[:,1])*(c[:,0]-P[:,0]))>1e-3
        if k.all():return P
        i=np.flatnonzero(~k)[0];P=np.delete(P,i,0)
def main():
    O={k:outline(f) for k,f in SDF.items()}
    near=lambda k,c:np.linalg.norm(O[k]-c,axis=1).min()
    edge=lambda k,P:max(-SDF[k](np.atleast_2d(P))[0],0)
    bd=lambda k:float(np.min(poly(O[k],DET)))
    print('clearances, mm (upper tier: TB_U .. TB_U+2; walls: down to the lower tier; lower tier: 7.9-10.9 mm above the plate):')
    for k in('upR','upT','upL','wallR','wallT','wallL'):
        print(f'  {k:6s} escape wheel tips {near(k,E)-ES:5.2f}   rollers {near(k,B)-ROLL:6.2f}   pillars {min(near(k,p) for p in PIL)-PIL_R:5.2f}   detent {bd(k):5.2f}')
    print(f'  lower tier: escape arbor {near("lo",E):5.2f} (r {EP} round it), third arbor {near("lo",T)-0.55:5.2f}, centre arbor {near("lo",C)-0.75:5.2f}')
    print('holes: metal round them, mm')
    hc=HEAD*0.5*1.12+0.01
    for k,c,r in(('upL',S1,hc),('upR',S2,hc),('upL',P1,0.41),('upR',P2,0.41),('upT',TBLOCK,0.95),('wallT',TBLOCK,0.95),('lo',TBLOCK,0.86),('lo',B,CB),('lo',F,2.7),('lo2',B,CB),('lo2',F,2.7)):
        print(f'  {k:6s} at ({c[0]:6.2f},{c[1]:6.2f}) r {r:4.2f}: {edge(k,c)-r:5.2f}')
    print('the screws\' heads (r 2.9, hanging under the upper tier):')
    for n,s in(('S1',S1),('S2',S2)):
        print(f'  {n}: walls {min(near("wallR",s),near("wallL",s))-HEAD:5.2f}, lower tier {near("lo",s)-HEAD:5.2f}, escape wheel {np.linalg.norm(s-E)-ES-HEAD:5.2f}, pillars {min(np.linalg.norm(s-p) for p in PIL)-PIL_R-HEAD:5.2f}, detent {float(poly(np.atleast_2d(s),DET)[0])-HEAD:5.2f}')
    print(f'  barrel bridge screw (S.bb[2]) from the right lug {-SDF["upR"](np.atleast_2d(BB2))[0]*-1:5.2f}; the train-blocking screw access hole (r 0.72) from the locking arm screw and pin {min(np.linalg.norm(a-TBLOCK) for a in ARM)-0.72-0.8:5.2f}')
    print(f'train-blocking screw {np.linalg.norm(TBLOCK-F):.2f} mm from the fourth arbor; screws {np.linalg.norm(S1-S2):.1f} mm apart')
    r2=lambda P:[[round(float(x),2),round(float(z),2)] for x,z in P]
    print('const LB_UP=['+json.dumps(r2(O['upR']))+','+json.dumps(r2(O['upT']))+','+json.dumps(r2(O['upL']))+'];')
    print('const LB_WALL=['+json.dumps(r2(O['wallR']))+','+json.dumps(r2(O['wallT']))+','+json.dumps(r2(O['wallL']))+'];')
    print('const LB_LO='+json.dumps(r2(O['lo']))+';')
    print('const LB_LO2='+json.dumps(r2(O['lo2']))+';')
    print('S.tBlock',r2([TBLOCK]),'S.lb',r2([S1,S2]),'S.lbp',r2([P1,P2]))
    try:   # the plan beside the video's outline
        import matplotlib;matplotlib.use('Agg');import matplotlib.pyplot as plt
        fig,axs=plt.subplots(1,2,figsize=(14,7.6))
        for ax,title,video in((axs[0],'Video (KLUwI2UUCMQ 13:49.5), from below, mm',True),(axs[1],'Model, from below, mm',False)):
            cl=lambda P,**k:ax.plot(*np.vstack([P,P[:1]]).T,**k);ring=lambda c,r,**k:ax.plot(*(np.asarray(c)[:,None]+r*np.array([np.cos(np.linspace(0,2*np.pi,90)),np.sin(np.linspace(0,2*np.pi,90))])),**k)
            if video:
                cl(np.array(MEAS['slab']),color='tab:blue',lw=2);cl(np.array(MEAS['lugA']),color='tab:red');cl(np.array(MEAS['lugB']),color='tab:red')
                for k in('screwA','screwB'):ring(MEAS[k],1.5,color='k')
                for k,cc in(('cap','tab:purple'),('fourth','goldenrod')):ring(MEAS[k],1.2,color=cc);ax.text(MEAS[k][0]+1.4,MEAS[k][1],k)
                ring(LOBE,R_LOBE,color='tab:green',ls=':');ax.text(LOBE[0],LOBE[1],'escape lobe')
            else:
                cl(O['lo'],color='tab:blue',lw=2);cl(O['lo2'],color='tab:blue',lw=0.8,ls=':')
                for k in('upR','upT','upL'):cl(O[k],color='tab:red')
                for k in('wallR','wallT','wallL'):cl(O[k],color='tab:orange',ls='--')
                for c in(S1,S2):ring(c,1.5,color='k');ring(c,HEAD,color='k',ls=':')
                for c,cc,n in((B,'tab:purple','balance'),(F,'goldenrod','fourth'),(E,'tab:green','escape')):ring(c,1.2,color=cc);ax.text(c[0]+1.4,c[1],n)
                ring(B,CB,color='tab:purple',ls=':');ring(E,ES,color='tab:green',ls=':');ax.plot(*TBLOCK,'k^')
                for p in PIL:ring(p,PIL_R,color='0.5')
                cl(DET,color='brown');ax.plot(*T,'k+');ax.text(T[0]+0.5,T[1],'third');ax.plot(*C,'k+')
            ax.set_aspect('equal');ax.set_xlim(-20,30);ax.set_ylim(33,-3);ax.grid(alpha=0.3);ax.set_title(title)
        plt.tight_layout();plt.savefig('r_lower_bridge.png',dpi=70,bbox_inches='tight');print('wrote r_lower_bridge.png')
    except ImportError:pass
if __name__=='__main__':main()
