"""Heights below the rim top of picked features in 12_Kirow_247_E-Kontakt_3 (n12) and 13_Kirow_2973_E-Kontakt4 (n13).
Weak-perspective model of a camera BELOW the rim plane (nearer points appear higher): the rim-top edge ellipse
(fitted by rimfit_blind3.py to the top silhouette) gives centre, a, b (e = asin b/a) and the image scale s
(top-edge radius taken 55.05 mm). A feature at pixel (x,y) on a vertical face at radius r:
  z = ((y_e(x) - y)/s - (d_f - d_e) sin e) / cos e,   d = r cos(asin(x_off/r)), x_off=(x-xc)/s.
Monte Carlo over e +-3 deg, s +-2 %, pick +-2.5 px, edge +-3 px, r_plate 53+-2 (R_body 50.7 + 2.3), block out 8+-2 mm.
usage: heights_blind.py"""
import numpy as np
rng=np.random.default_rng(1)
P={'n12':dict(xc=514.2,yc=304.8,a=486.5,b=239.8,R=55.05),'n13':dict(xc=512.9,yc=192.4,a=486.1,b=172.0,R=55.05)}
# feature: (name, x, y, plane) plane: 'c' case bracket face, 'p' locking plate face, 'b' hook block front face
F={'n12':[('case upright top edge',192.5,86.7,'c'),('PIVOT HOLE centre',192.5,128.5,'c'),
 ('strap top',440,184,'c'),('strap bottom (face)',440,272,'c'),('strap screw centre',368,232,'c'),
 ('lock plate bottom',660,352,'p'),('lock plate top (step)',660,178,'p'),('lock screw 1 centre',665,232,'p'),('lock screw 2 centre',667,303,'p'),
 ('vert slot top end',665,198,'p'),('vert slot bottom end',665,337,'p'),
 ('block front face bottom',660,138,'b'),('block front face top',660,98,'b'),('hook slot bottom',650,100,'b'),('hook slot top',650,63,'b'),('hook top',660,31,'b')],
 'n13':[('case upright top edge',160,52.4,'c'),('PIVOT HOLE centre',160,96.5,'c'),
 ('strap top',400,157,'c'),('strap bottom (face)',400,262,'c'),('strap screw centre',352,208,'c'),
 ('lock plate bottom',630,337,'p'),('lock plate top (step)',630,150,'p'),('lock screw 1 centre',627,208,'p'),('lock screw 2 centre',622,292,'p'),
 ('vert slot top end',627,170,'p'),('vert slot bottom end',624,330,'p'),
 ('block front face bottom',630,123,'b'),('block front face top',630,85,'b'),('hook slot bottom',630,83,'b'),('hook slot top',630,42,'b'),('hook top',640,11,'b')]}
N=4000
for k,p in P.items():
    print(k,'e=',np.degrees(np.arcsin(p['b']/p['a'])).round(1))
    for nm,x,y,pl in F[k]:
        zs=[]
        for _ in range(N):
            e=np.arcsin(p['b']/p['a'])+np.radians(rng.normal(0,3));s=2*p['a']/(2*p['R'])*(1+rng.normal(0,.02))
            rp=53+rng.normal(0,2);r={'c':rp,'p':rp,'b':rp+8+rng.normal(0,2)}[pl]
            xo=(x-p['xc'])/s
            ye=p['yc']-p['b']*np.sqrt(max(0,1-((x-p['xc'])/p['a'])**2))+rng.normal(0,3)
            yy=y+rng.normal(0,2.5)
            df=r*np.cos(np.arcsin(min(.99,abs(xo)/r)));de=p['R']*np.cos(np.arcsin(abs(xo)/p['R']))
            zs.append(((ye-yy)/s-(df-de)*np.sin(e))/np.cos(e))
        print('  %-24s z = %6.1f +- %.1f mm'%(nm,np.mean(zs),np.std(zs)))
