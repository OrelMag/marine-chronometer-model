import sys,cv2,numpy as np
# a round head's outline in the image: the strongest luma step on rays from a rough centre within a band, an ellipse fitted (cv2.fitEllipse) after RANSAC on a circle
im=cv2.imread(sys.argv[1]);g=cv2.GaussianBlur(cv2.cvtColor(im,cv2.COLOR_BGR2GRAY).astype(np.float32),(0,0),1.0)
u0,v0,r0,bd=map(float,sys.argv[2:6]);pts=[]
for t in np.linspace(0,2*np.pi,120,endpoint=False):
    rr=np.arange(r0*(1-bd),r0*(1+bd),0.25);us=u0+rr*np.cos(t);vs=v0+rr*np.sin(t)
    p=cv2.remap(g,us.astype(np.float32)[None],vs.astype(np.float32)[None],cv2.INTER_LINEAR)[0];gr=np.abs(np.gradient(p));j=int(np.argmax(gr))
    if gr[j]>3:pts.append([us[j],vs[j]])
P=np.array(pts,np.float32);e=cv2.fitEllipse(P);d=np.abs(np.hypot(*(P-e[0]).T)-np.mean(e[1])/2)
P2=P[d<np.percentile(d,75)];e=cv2.fitEllipse(P2)
print(f'centre ({e[0][0]:.1f}, {e[0][1]:.1f}) axes {e[1][0]:.1f} x {e[1][1]:.1f} px, angle {e[2]:.1f}; {len(P2)} pts')
o=im.copy();cv2.ellipse(o,e,(0,0,255),1);[cv2.circle(o,(int(a),int(b)),1,(0,255,0),-1) for a,b in P2];x0,y0=int(u0-2*r0),int(v0-2*r0);cv2.imwrite(sys.argv[6],cv2.resize(o[y0:int(v0+2*r0),x0:int(u0+2*r0)],None,fx=4,fy=4,interpolation=cv2.INTER_NEAREST))
