"""Gamma (box fork): 14_'s screws, knobs and the diamond badge. Screw heads and knobs: the head's rim (bright head on the dark plate,
luma falling outward) along 120 rays from a rough centre, RANSAC-free circle fit MAD-trimmed (box14.circle). Diamond: its four edges
found along rays from its centre (light badge on the wood: luma? the badge is darker-grey on orange: red channel rises outward),
points split by quadrant, a line fitted per quadrant, vertices as intersections. Units U = the number plate's outer Ø, 200.68 px."""
import cv2,numpy as np,json
import box14 as B
im=cv2.imread(B.IMG).astype(np.float32); U=200.68
B.L=cv2.GaussianBlur(im.mean(2),(3,3),0.8)
out={}
S={'upper hasp':[(190,97),(445,97),(197,182),(452,182)],'lower hasp':[(198,550),(452,550),(203,633),(458,633)]}
K={'upper hasp':(325,178),'lower hasp':(333,635)}
for h in S:
    cs=[]
    for c0 in S[h]:
        c=np.array(c0,float)
        for _ in range(2):
            q,sd,rms,n,e=B.circle(c,4,22,-1); c=q[:2]
        cs.append((q[0],q[1],2*q[2],rms,n))
    cs=np.array(cs); dx=((cs[1,0]-cs[0,0])+(cs[3,0]-cs[2,0]))/2; dy=((cs[2,1]-cs[0,1])+(cs[3,1]-cs[1,1]))/2
    c=np.array(K[h],float)
    for _ in range(2):
        q,sd,rms,n,e=B.circle(c,12,45,-1); c=q[:2]
    out[h]=dict(screws=cs.tolist(),dx=dx,dy=dy,knob=[q[0],q[1],2*q[2],rms,n])
    print('%s: screws apart %.2f px across (%.4f U), %.2f px up-down (%.4f U); heads Ø %s px (rms %s); knob Ø %.2f px = %.4f U (rms %.2f, n %d) at %.1f,%.1f'%(h,dx,dx/U,dy,dy/U,np.round(cs[:,2],1),np.round(cs[:,3],2),2*q[2],2*q[2]/U,rms,n,q[0],q[1]))
# diamond
R=cv2.GaussianBlur(im[:,:,2],(3,3),0.8); B.L=R
c0=np.array((325,375.0)); pts=[]
for ad in np.arange(0,360,1.0):
    if min(abs(((ad-v+180)%360)-180) for v in (0,90,180,270))<6: continue   # leave the vertices out
    a=np.radians(ad); s=B.step(c0[0],c0[1],np.cos(a),np.sin(a),40,140,1)
    if s is not None: pts.append((ad,c0[0]+s*np.cos(a),c0[1]+s*np.sin(a)))
pts=np.array(pts); lines=[]
for q0,q1 in [(0,90),(90,180),(180,270),(270,360)]:
    p=pts[(pts[:,0]>=q0)&(pts[:,0]<q1)][:,1:]
    for _ in range(3):
        m=p.mean(0); u,s_,vt=np.linalg.svd(p-m); nrm=vt[1]; r=(p-m)@nrm; k=np.abs(r)<3*1.4826*np.median(np.abs(r))+0.3; p=p[k]
    m=p.mean(0); u,s_,vt=np.linalg.svd(p-m); nrm=vt[1]; lines.append((m,nrm,((p-m)@nrm).std(),len(p)))
def X(l1,l2):
    A=np.array([l1[1],l2[1]]); b=np.array([l1[1]@l1[0],l2[1]@l2[0]]); return np.linalg.solve(A,b)
V={'right':X(lines[3],lines[0]),'bottom':X(lines[0],lines[1]),'left':X(lines[1],lines[2]),'top':X(lines[2],lines[3])}
W=np.linalg.norm(V['right']-V['left']); Hh=np.linalg.norm(V['bottom']-V['top']); cen=(V['right']+V['left']+V['top']+V['bottom'])/4
print('diamond: edges rms',[round(l[2],2) for l in lines],'n',[l[3] for l in lines])
print('diamond: width %.2f px = %.4f U, height %.2f px = %.4f U (ratio %.4f); centre %.1f,%.1f; vertices %s'%(W,W/U,Hh,Hh/U,Hh/W,cen[0],cen[1],{k:np.round(v,1).tolist() for k,v in V.items()}))
pl=json.load(open('box14.json'))
yu=pl['upper parting line']['y_at_plate']; yl=pl['lower parting line']['y_at_plate']
print('diamond centre below the upper parting %.2f px = %.4f U; above the lower %.2f px = %.4f U (midway: %.4f)'%(cen[1]-yu,(cen[1]-yu)/U,yl-cen[1],(yl-cen[1])/U,(cen[1]-yu)/(yl-yu)))
print('centres x: plate %.1f, diamond %.1f, hasps %.1f/%.1f, knobs %.1f/%.1f'%(pl['plate']['c'][0],cen[0],(out['upper hasp']['screws'][0][0]+out['upper hasp']['screws'][1][0])/2,(out['lower hasp']['screws'][0][0]+out['lower hasp']['screws'][1][0])/2,out['upper hasp']['knob'][0],out['lower hasp']['knob'][0]))
out['diamond']=dict(V={k:v.tolist() for k,v in V.items()},W=W,H=Hh,c=cen.tolist())
json.dump(out,open('box14c.json','w'),indent=1)
