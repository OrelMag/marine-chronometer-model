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
  between the escape arbor and the third arbor, the right lug moved off the pillar, the detent support block and the barrel bridge's screw beside it.

Outlines are polygons with their corners rounded (r 0.8), the walls and tiers unions and intersections of their distance fields, traced at 0.02 mm."""
import json,math,pathlib
import numpy as np
HERE=pathlib.Path(__file__).resolve().parent
# the model's positions (movement.js: L, PILLARS, ES, S)
B=np.array([8.0,6.77]);F=np.array([0.0,23.9]);E=np.array([7.193,16.135]);T=np.array([-6.18,14.75]);C=np.array([0.0,0.0]);ES=13.16/2
PIL=np.array([[18.17,26.92],[-16.63,22.48]]);PIL_R=3.4                                   # the train bridge's pillars near the bridge, r 3.4 at the upper tier's height
BB2=np.array([-11.07,26.46]);ARM=np.array([[-3.45,23.17],[-4.07,25.01]])                 # holes in the train bridge: a barrel-bridge screw (S.bb[2]), the balance locking arm's screw and stop pin (S.arm, S.armPin)
ROLL=4.32                                                                                # the balance's widest roller part at the walls' heights (r about the staff)
BLOCK=np.array([(-16.07,17.11),(-15.27,19.74),(-0.17,15.10),(-0.98,12.48)])              # detent support block, in the upper tier's layer (plan corners)
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
S1=np.array([20.58,11.88])                                                               # the left lug's screw, where the video has it (rimfit: (20.5, 12.2-12.6) over 5000-8000 px; 3 o'clock side, the plate's access hole under it)
S2=np.array([-9.6,21.6])                                                                 # the right lug's: 0.8 off the pillar, 0.5 off the detent block, its head 0.4 off the slab
TBLOCK=pol(F,5.0,230)                                                                    # train-blocking screw: 5 mm from the fourth arbor (within the spokes), toward the right lug, clear of the locking arm's screw and pin
P1=np.array([22.6,14.6]);P2=np.array([-7.0,22.4])                                        # steady pins, one in each lug
HEAD=2.9;FIL=0.5;EB=3.6;CB=4.3                                                   # 42055's head radius (PSR); fillet; the column round the train-blocking screw; the L's corner round the escape arbor; the cap's counterbore
# the slab, the L: the body's left edge 1 mm off the third arbor and 5.4 mm past the fourth, the inside corner round the escape arbor, the arm's end the video's
SLAB=[[-3.6,8.6],[-5.0,17.5],[-6.6,22.5],[-6.9,27.6],[-5.6,29.1],[3.8,29.3],[4.6,28.4],[4.6,21.0]]+[list(pol(E,EB,a)) for a in range(160,301,20)]+\
     [[12.5,12.0],[16.0,12.9],[17.7,5.8],[15.0,3.0],[11.0,1.7],[7.0,1.5],[3.0,2.6],[-0.6,5.0]]
LUGL=[[24.7,16.7],[14.2,13.4],[16.0,5.4],[26.3,8.6]]                                      # the video's, its inner edge 2 mm under the arm's end for the wall that joins them
LUGR=[[-12.6,22.9],[-12.4,19.9],[-8.0,18.6],[-3.4,17.4],[-0.9,18.6],[-0.9,21.2],[-4.4,22.3],[-10.5,24.6]]   # round the screw and the train-blocking screw's column
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
SL,LL,LR=fillet(SLAB),fillet(LUGL),fillet(LUGR)
lo=lambda P:poly(P,SL)
SDF={'upR':lambda P:poly(P,LR),'upL':lambda P:poly(P,LL),
     'wallR':lambda P:np.maximum(poly(P,LR),lo(P)),'wallL':lambda P:np.maximum(poly(P,LL),lo(P)),'lo':lo}
def outline(f,step=0.02):
    import contourpy
    xs=np.arange(-14,30,step);zs=np.arange(-2,34,step);X,Z=np.meshgrid(xs,zs);D=f(np.stack([X,Z],-1))
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
    bd=lambda k:min(min(seg(O[k],BLOCK[i],BLOCK[(i+1)%4]).min() for i in range(4)),99)
    print('clearances, mm (upper tier: TB_U .. TB_U+2; walls: down to the lower tier; lower tier: 7.9-10.9 mm above the plate):')
    for k in('upR','upL','wallR','wallL'):
        print(f'  {k:6s} escape wheel tips {near(k,E)-ES:5.2f}   rollers {near(k,B)-ROLL:6.2f}   pillars {min(near(k,p) for p in PIL)-PIL_R:5.2f}   detent block {bd(k):5.2f}')
    print(f'  lower tier: escape arbor {near("lo",E):5.2f} (the L\'s corner, r {EB}), third arbor {near("lo",T)-0.55:5.2f}, centre arbor {near("lo",C)-0.75:5.2f}')
    print('holes: metal round them, mm')
    hc=HEAD*0.5*1.12+0.01
    for k,c,r in(('upL',S1,hc),('upR',S2,hc),('upL',P1,0.41),('upR',P2,0.41),('upR',TBLOCK,0.95),('wallR',TBLOCK,0.95),('lo',TBLOCK,0.86),('lo',B,CB),('lo',F,2.7)):
        print(f'  {k:6s} at ({c[0]:6.2f},{c[1]:6.2f}) r {r:4.2f}: {edge(k,c)-r:5.2f}')
    print('the screws\' heads (r 2.9, hanging under the upper tier):')
    for n,s in(('S1',S1),('S2',S2)):
        print(f'  {n}: walls {min(near("wallR",s),near("wallL",s))-HEAD:5.2f}, lower tier {near("lo",s)-HEAD:5.2f}, escape wheel {np.linalg.norm(s-E)-ES-HEAD:5.2f}, pillars {min(np.linalg.norm(s-p) for p in PIL)-PIL_R-HEAD:5.2f}, detent block {min(seg(np.atleast_2d(s),BLOCK[i],BLOCK[(i+1)%4])[0] for i in range(4))-HEAD:5.2f}')
    print(f'  barrel bridge screw (S.bb[2]) from the right lug {-SDF["upR"](np.atleast_2d(BB2))[0]*-1:5.2f}; the train-blocking screw access hole (r 0.72) from the locking arm screw and pin {min(np.linalg.norm(a-TBLOCK) for a in ARM)-0.72-0.8:5.2f}')
    print(f'train-blocking screw {np.linalg.norm(TBLOCK-F):.2f} mm from the fourth arbor; screws {np.linalg.norm(S1-S2):.1f} mm apart (video {np.linalg.norm(np.subtract(VIDEO["sL"],VIDEO["sR"])):.1f})')
    r2=lambda P:[[round(float(x),2),round(float(z),2)] for x,z in P]
    print('const LB_UP=['+json.dumps(r2(O['upR']))+','+json.dumps(r2(O['upL']))+'];')
    print('const LB_WALL=['+json.dumps(r2(O['wallR']))+','+json.dumps(r2(O['wallL']))+'];')
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
                for k in('upR','upL'):cl(O[k],color='tab:red')
                for k in('wallR','wallL'):cl(O[k],color='tab:orange',ls='--')
                for c in(S1,S2):ring(c,1.5,color='k');ring(c,HEAD,color='k',ls=':')
                for c,cc,n in((B,'tab:purple','balance'),(F,'goldenrod','fourth'),(E,'tab:green','escape')):ring(c,1.2,color=cc);ax.text(c[0]+1.4,c[1],n)
                ring(B,CB,color='tab:purple',ls=':');ring(E,ES,color='tab:green',ls=':');ax.plot(*TBLOCK,'k^')
                for p in PIL:ring(p,PIL_R,color='0.5')
                cl(BLOCK,color='brown');ax.plot(*T,'k+');ax.text(T[0]+0.5,T[1],'third');ax.plot(*C,'k+')
            ax.set_aspect('equal');ax.set_xlim(-20,30);ax.set_ylim(33,-3);ax.grid(alpha=0.3);ax.set_title(title)
        plt.tight_layout();plt.savefig('r_lower_bridge.png',dpi=70,bbox_inches='tight');print('wrote r_lower_bridge.png')
    except ImportError:pass
if __name__=='__main__':main()
