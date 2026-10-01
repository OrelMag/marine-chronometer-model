"""The balance lower bridge (42065), laid out after a restoration video of a 1941 Model 21 and the manual's Figs. 29, 30 and 110. No browser.

    python lower_bridge.py     # prints LB_UP, LB_WALL and LB_LO for movement.js, the screw, pin and train-blocking screw positions and the clearances,
                               # and writes r_lower_bridge.png (the plan, with the video's outline beside it)

What the sources give:
- The manual: a stepped block. An upper tier lies against the train bridge's underside, held by two screws 42055 put in from below (Figs. 29, 67 and 110
  draw the screw head-down under the bridge; Op. 12 fits the bridge to the upturned train bridge, Op. 50 takes it off only once the train bridge is out),
  "complete with pins". The lower tier holds the balance's lower setting and endstone cap and the fourth wheel's upper setting. The train-blocking screw is
  "mounted in the balance lower bridge and is accessible through a hole in the upper train bridge" (Sec. II); Fig. 110's section shows the bridge round the
  screw rising to the train bridge's underside, and Fig. 110 draws the bridge as a C round a large opening. Fig. 30 (the bridge on the upturned train bridge)
  gives the order along it: a lug with a screw, the train-blocking screw's dog point, the fourth wheel's setting, the balance's endstone cap, and from there a
  long arm, which the figure's leader names as the bridge, to its other end.
- The restoration video (References/VIDEOS.md, KLUwI2UUCMQ; C Spinner, serial 2E8489), the bridge on the upturned train bridge at 36:01, face-on from below
  at 13:49.5, side-on at 36:41-36:49 and 42:56; a second video (Boulder Horological Society, TWQsSVWuikk, 43:13) shows the same bridge. At 36:01 a camera
  fitted to the train bridge's rim (r 40.5) and to the round settings (circles in their planes), with the centre arbor's setting landing 1.0 mm from the
  rim's centre over focal lengths of 5000-8000 px, puts the frame in millimetres (tools/rimfit.py); turned onto the model by the centre, third and fourth
  settings (1.5 mm rms), the outline traced on it is VIDEO below. The lower tier is one slab shaped as an L: a body carrying the fourth's setting and the cap (in a round
  counterbore), the train-blocking screw's dog point near its far side, and an arm from the cap's end to a lug with a screw; the escape arbor passes up
  through the L's inside corner, under the train bridge's escape lobe, so the escape wheel lifts out from above. A lug with a screw stands at each end of
  the bridge's long axis (screws 34 mm apart), its pad against the train bridge, joined to the slab by a wall; between the lugs the escape wheel turns
  between the slab and the train bridge (side-on, 42:56).
- What doesn't carry over: on the video the cap is about 12 mm from the fourth's setting and 9 mm from the escape arbor, at about 73 deg; the model's balance,
  escape and fourth arbors are 9.4, 10.6 and 18.9 mm apart, nearly in a line (Review-results.md, "The balance lower bridge", 14). The bridge is drawn here
  round the model's arbors: the left lug and its screw where the video has them, the body stretched from the balance to the fourth arbor and narrowed
  between the escape arbor and the third arbor, the far lug beside the fourth on the 9 o'clock side as on the video, but moved toward 12 off the detent's
  foot, which the escapement's direction puts where the video has the lug, and joined to the body by a tongue of the slab under the detent; the
  train-blocking screw on the detent's other side, in a column of its own.

Outlines are polygons with their corners rounded (r 0.8), the walls and tiers unions and intersections of their distance fields, traced at 0.02 mm."""
import json,math,pathlib
import numpy as np
HERE=pathlib.Path(__file__).resolve().parent
# the model's positions (movement.js: L, PILLARS, ES, S; the screw table from the page, __mv.userData.S)
B=np.array([6.125,8.504]);F=np.array([0.0,23.9]);E=np.array([8.504,17.598]);T=np.array([-6.18,14.75]);C=np.array([0.0,0.0]);ES=13.16/2
PIL=np.array([[11.12,30.52],[-21.57,17.79]]);PIL_R=3.4                                   # the train bridge's pillars near the bridge, r 3.4 at the upper tier's height
BB2=np.array([-17.14,23.0]);ARM=np.array([[0.83,27.79],[0.86,29.73]])                    # holes in the train bridge: a barrel-bridge screw (S.bb[2]), the balance locking arm's screw and stop pin (S.arm, S.armPin)
BLK=np.array([-7.31,23.72]);DPIN=np.array([[-9.64,25.45],[-2.72,20.3]])                    # the detent support block's screw and positioning pins (S.blk, S.dpin)
ROLL=4.32                                                                                # the balance's widest roller part at the walls' heights (r about the staff)
BLOCK=np.array([[4.0,9.58],[3.7,10.2],[-1.3,13.85],[-1.9,13.84],[-3.98,15.2],[-3.92,15.8],[-2.43,17.8],[-2.8,18.3],[-5.3,20.15],[-5.7,19.63],[-6.8,20.22],[-7.4,20.28],[-7.76,19.8],[-8.0,20.38],[-7.8,20.96],[-8.3,21.33],[-8.9,21.51],[-10.0,20.85],[-11.0,21.6],[-11.3,22.13],[-10.9,22.67],[-10.94,23.3],[-12.0,24.02],[-12.39,23.5],[-12.96,23.3],[-12.42,24.4],[-14.0,25.57],[-14.14,26.2],[-13.77,26.7],[-13.2,26.46],[-12.4,27.48],[-12.15,26.9],[-11.23,27.8],[-10.6,27.95],[0.89,19.4],[1.06,18.8],[0.7,18.31],[0.97,17.7],[1.5,17.3],[2.1,17.23],[2.9,16.26],[4.5,15.44],[3.7,14.41],[3.78,13.8],[4.3,13.41],[4.83,12.3],[4.4,9.9]])   # the detent, its support block and their screws in the lugs' layer (TB_U to the lower tier): the page's meshes there, their plan hulls joined
# the video's bridge (36:01, see above; python rimfit.py rimfit_36-01.json --f 6000), mm in the model's frame: the slab, the lugs, the screws, the cap, the fourth's setting, the train-blocking screw, the escape arbor
VIDEO={'slab': [[4.5, 28.3], [-2.2, 27.6], [-9.1, 26.9], [-8.0, 23.1], [-6.5, 18.7], [-4.4, 13.2], [-2.2, 7.5], [-0.9, 6.4], [3.5, 5.7], [7.5, 5.2], [11.3, 5.0], [14.3, 5.2], [17.7, 6.2], [15.9, 13.4], [14.4, 12.9], [12.3, 12.3], [9.2, 11.9], [7.6, 13.3], [6.9, 15.4], [6.1, 17.5], [6.0, 21.2], [6.3, 23.2]],
  'lugL': [[24.6, 17.3], [15.9, 14.0], [17.9, 6.5], [26.3, 9.2]],
  'lugR': [[-9.7, 26.6], [-16.1, 25.0], [-16.1, 22.9], [-12.9, 14.8], [-6.5, 16.8], [-7.1, 19.8]],
  'sL': [20.53, 12.4],
  'sR': [-11.96, 22.08],
  'cap': [3.82, 11.46],
  'fourth': [0.98, 22.83],
  'tbs': [-5.18, 19.63],
  'esc': [11.46, 16.31]}
pol=lambda c,r,a:c+r*np.array([math.cos(math.radians(a)),math.sin(math.radians(a))])
U=(F-B)/np.linalg.norm(F-B);N=np.array([U[1],-U[0]])                                     # along the body (balance to fourth) and across it, toward the escape arbor
st=lambda s_,t_:B+s_*U+t_*N                                                              # a point s along the body from the balance, t across it
S1=np.array([20.58,11.88])                                                               # the left lug's screw, where the video has it (rimfit: (20.5, 12.2-12.6) over 5000-8000 px; 3 o'clock side, the plate's access hole under it)
S2=np.array([-13.9,18.8])                                                                # the far lug's screw: beside the fourth on the 9 o'clock side, as on the video, but 3.8 mm round toward 12 from its (-12.0, 22.1),
                                                                                         # where the detent's foot stands in the model (4.0 mm clear of it, 1.1 off the pillar)
TBLOCK=np.array([-3.70,26.50])                                                           # train-blocking screw: 4.5 mm from the fourth arbor (within the spokes), on the side away from the detent, its column 1 mm off it
P1=st(-4.5,17.5);P2=np.array([-11.4,16.4])                                               # steady pins, one in each lug
HEAD=2.9;FIL=0.5;EB=3.0;CB=3.8;COL=1.95                                                  # 42055's head radius (PSR); fillet; the L's corner round the escape arbor; the cap's counterbore; the column round the train-blocking screw
# the slab, the L: a body from below the cap past the fourth, 2 mm off the third arbor, as broad as the video's, with a tongue under the detent to the far lug's wall (the slab lies below
# the detent); the arm across to the left lug; the escape arbor in the L's inside corner, which is cut round it (EB: its pinion, r 1.9, lifts out through it)
SLAB=[st(-5.3,-6.5),[-4.0,17.2],[-9.8,16.6],[-10.5,17.0],[-10.5,22.3],[-9.4,24.8],st(23.0,-6.5),st(23.0,4.2),st(2.2,4.2),st(2.2,11.2),st(-4.0,11.2),st(-5.0,8.0),st(-5.6,2.0)]
LUGL=[[15.42,13.28],[22.39,17.67],[26.0,9.95],[23.6,9.25],[17.4,9.2]]                   # round the left screw, 1.6 mm off the escape wheel's tips, its lower edge 0.8 off the sustaining pawl's spring and its pin (21.6, 8.0-8.4), its inner edge under the arm
LUGR=[[-17.4,17.2],[-13.6,14.6],[-8.6,15.7],[-8.9,18.0],[-12.4,21.2],[-16.0,21.4]]      # round the far screw, the video's lug's 12 o'clock half: 1 mm or more off the detent, the pillar and the third arbor; over the tongue's end for its wall
COLT=[list(TBLOCK+COL*np.array([np.cos(a),np.sin(a)])) for a in np.radians(np.arange(0,360,45))]   # the column round the train-blocking screw, from the slab up to the train bridge
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
SL,LL,LR,LT=fillet(SLAB),fillet(LUGL),fillet(LUGR),fillet(COLT,0.6)
lo=lambda P:np.maximum(poly(P,SL),-cir(P,E,EB))
SDF={'upR':lambda P:poly(P,LR),'upT':lambda P:poly(P,LT),'upL':lambda P:poly(P,LL),
     'wallR':lambda P:np.maximum(poly(P,LR),lo(P)),'wallT':lambda P:np.maximum(poly(P,LT),lo(P)),'wallL':lambda P:np.maximum(poly(P,LL),lo(P)),'lo':lo}
def outline(f,step=0.02):
    import contourpy
    xs=np.arange(-24,32,step);zs=np.arange(-4,42,step);X,Z=np.meshgrid(xs,zs);D=f(np.stack([X,Z],-1))
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
    bd=lambda k:float(np.min([seg(O[k],BLOCK[i],BLOCK[(i+1)%len(BLOCK)]).min() for i in range(len(BLOCK))]))
    print('clearances, mm (upper tier: TB_U .. TB_U+2; walls: down to the lower tier; lower tier: 7.9-10.9 mm above the plate):')
    for k in('upR','upT','upL','wallR','wallT','wallL'):
        print(f'  {k:6s} escape wheel tips {near(k,E)-ES:5.2f}   rollers {near(k,B)-ROLL:6.2f}   pillars {min(near(k,p) for p in PIL)-PIL_R:5.2f}   detent {bd(k):5.2f}')
    print(f'  lower tier: escape arbor {near("lo",E):5.2f} (the L\'s corner, r {EB}), third arbor {near("lo",T)-0.55:5.2f}, centre arbor {near("lo",C)-0.75:5.2f}; far lug: third arbor {near("upR",T)-0.55:5.2f}')
    print('holes: metal round them, mm')
    hc=HEAD*0.5*1.12+0.01
    for k,c,r in(('upL',S1,hc),('upR',S2,hc),('upL',P1,0.41),('upR',P2,0.41),('upT',TBLOCK,0.95),('wallT',TBLOCK,0.95),('lo',TBLOCK,0.86),('lo',B,CB),('lo',F,2.7)):
        print(f'  {k:6s} at ({c[0]:6.2f},{c[1]:6.2f}) r {r:4.2f}: {edge(k,c)-r:5.2f}')
    print('the screws\' heads (r 2.9, hanging under the upper tier):')
    for n,s in(('S1',S1),('S2',S2)):
        print(f'  {n}: walls {min(near("wallR",s),near("wallL",s))-HEAD:5.2f}, lower tier {near("lo",s)-HEAD:5.2f}, escape wheel {np.linalg.norm(s-E)-ES-HEAD:5.2f}, pillars {min(np.linalg.norm(s-p) for p in PIL)-PIL_R-HEAD:5.2f}, detent {min(seg(np.atleast_2d(s),BLOCK[i],BLOCK[(i+1)%len(BLOCK)])[0] for i in range(len(BLOCK)))-HEAD:5.2f}, the block screw {np.linalg.norm(s-BLK)-HEAD-0.9:5.2f}')
    print(f'  barrel bridge screw (S.bb[2]) from the right lug {-SDF["upR"](np.atleast_2d(BB2))[0]*-1:5.2f}; the train-blocking screw access hole (r 0.72) from the locking arm screw and pin {min(np.linalg.norm(a-TBLOCK) for a in ARM)-0.72-0.8:5.2f}')
    print(f'train-blocking screw {np.linalg.norm(TBLOCK-F):.2f} mm from the fourth arbor; screws {np.linalg.norm(S1-S2):.1f} mm apart (video {np.linalg.norm(np.subtract(VIDEO["sL"],VIDEO["sR"])):.1f})')
    r2=lambda P:[[round(float(x),2),round(float(z),2)] for x,z in P]
    print('const LB_UP=['+json.dumps(r2(O['upR']))+','+json.dumps(r2(O['upT']))+','+json.dumps(r2(O['upL']))+'];')
    print('const LB_WALL=['+json.dumps(r2(O['wallR']))+','+json.dumps(r2(O['wallT']))+','+json.dumps(r2(O['wallL']))+'];')
    print('const LB_LO='+json.dumps(r2(O['lo']))+';')
    print('S.tBlock',r2([TBLOCK]),'S.lb',r2([S1,S2]),'S.lbp',r2([P1,P2]))
    try:   # the plan beside the video's outline
        import matplotlib;matplotlib.use('Agg');import matplotlib.pyplot as plt
        fig,axs=plt.subplots(1,2,figsize=(14,7.6))
        for ax,title,video in((axs[0],'Video (KLUwI2UUCMQ 36:01), from below, mm',True),(axs[1],'Model, from below, mm',False)):
            cl=lambda P,**k:ax.plot(*np.vstack([P,P[:1]]).T,**k);ring=lambda c,r,**k:ax.plot(*(np.asarray(c)[:,None]+r*np.array([np.cos(np.linspace(0,2*np.pi,90)),np.sin(np.linspace(0,2*np.pi,90))])),**k)
            if video:
                cl(np.array(VIDEO['slab']),color='tab:blue',lw=2);cl(np.array(VIDEO['lugL']),color='tab:red');cl(np.array(VIDEO['lugR']),color='tab:red')
                for k in('sL','sR'):ring(VIDEO[k],1.5,color='k')
                for k,cc in(('cap','tab:purple'),('fourth','goldenrod'),('esc','tab:green')):ring(VIDEO[k],1.2,color=cc);ax.text(VIDEO[k][0]+1.4,VIDEO[k][1],k)
                ax.plot(*VIDEO['tbs'],'k^')
            else:
                cl(O['lo'],color='tab:blue',lw=2)
                for k in('upR','upT','upL'):cl(O[k],color='tab:red')
                for k in('wallR','wallT','wallL'):cl(O[k],color='tab:orange',ls='--')
                for c in(S1,S2):ring(c,1.5,color='k');ring(c,HEAD,color='k',ls=':')
                for c,cc,n in((B,'tab:purple','balance'),(F,'goldenrod','fourth'),(E,'tab:green','escape')):ring(c,1.2,color=cc);ax.text(c[0]+1.4,c[1],n)
                ring(B,CB,color='tab:purple',ls=':');ring(E,ES,color='tab:green',ls=':');ax.plot(*TBLOCK,'k^')
                for p in PIL:ring(p,PIL_R,color='0.5')
                cl(BLOCK,color='brown');ax.plot(*T,'k+');ax.text(T[0]+0.5,T[1],'third');ax.plot(*C,'k+')
            ax.set_aspect('equal');ax.set_xlim(-22,30);ax.set_ylim(38,-3);ax.grid(alpha=0.3);ax.set_title(title)
        plt.tight_layout();plt.savefig('r_lower_bridge.png',dpi=70,bbox_inches='tight');print('wrote r_lower_bridge.png')
    except ImportError:pass
if __name__=='__main__':main()
