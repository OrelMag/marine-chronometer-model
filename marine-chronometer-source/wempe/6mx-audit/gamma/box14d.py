"""Gamma (box fork): 14_'s diamond badge by its saturation (grey metal against the orange wood): Otsu mask, the largest component's
outer contour, contour points refined along their normals to the saturation step (sub-pixel), split into the four edges by angle
about the centroid (vertices +-8 deg left out), a line per edge, vertices the intersections. Also the badge's two pins."""
import cv2,numpy as np,json
IMG='E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx-gallery/leben-des-6mx/14_Kirow_247_Kasten_2.jpg'
im=cv2.imread(IMG); hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV); S=cv2.GaussianBlur(hsv[:,:,1].astype(np.float32),(3,3),0.8)
U=200.68; x0,y0,x1,y1=180,270,470,470
sub=S[y0:y1,x0:x1].astype(np.uint8); t,m=cv2.threshold(sub,0,255,cv2.THRESH_BINARY_INV+cv2.THRESH_OTSU)
n,lab,st,cen=cv2.connectedComponentsWithStats(m); k=1+np.argmax(st[1:,4]); mk=(lab==k).astype(np.uint8)
mk=cv2.morphologyEx(mk,cv2.MORPH_CLOSE,np.ones((7,7),np.uint8))
cs,_=cv2.findContours(mk,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE); c=max(cs,key=len)[:,0,:].astype(float)+[x0,y0]
C=c.mean(0); pts=[]
for p in c[::2]:
    a=np.arctan2(p[1]-C[1],p[0]-C[0]); t_=np.arange(-4,4,0.2); xs=p[0]+t_*np.cos(a); ys=p[1]+t_*np.sin(a)
    v=cv2.remap(S,np.float32(xs[None]),np.float32(ys[None]),cv2.INTER_LINEAR)[0]; d=np.gradient(v); i=int(np.argmax(d))
    if 1<i<len(d)-2:
        aa,bb,cc=d[i-1],d[i],d[i+1]; o=(aa-cc)/(2*(aa-2*bb+cc)+1e-9); pts.append((xs[i]+o*0.2*np.cos(a),ys[i]+o*0.2*np.sin(a)))
P=np.array(pts); ang=np.degrees(np.arctan2(P[:,1]-C[1],P[:,0]-C[0]))%360
# vertex directions: find from the hull extremes
L=[];
for q0,q1 in [(8,82),(98,172),(188,262),(278,352)]:
    p=P[(ang>q0)&(ang<q1)]
    for _ in range(3):
        mm=p.mean(0); _,_,vt=np.linalg.svd(p-mm); nr=vt[1]; r=(p-mm)@nr; kk=np.abs(r)<3*1.4826*np.median(np.abs(r))+0.3; p=p[kk]
    mm=p.mean(0); _,_,vt=np.linalg.svd(p-mm); nr=vt[1]; L.append((mm,nr,((p-mm)@nr).std(),len(p)))
def X(l1,l2): return np.linalg.solve(np.array([l1[1],l2[1]]),np.array([l1[1]@l1[0],l2[1]@l2[0]]))
V={'right':X(L[3],L[0]),'bottom':X(L[0],L[1]),'left':X(L[1],L[2]),'top':X(L[2],L[3])}
W=np.linalg.norm(V['right']-V['left']); H=np.linalg.norm(V['bottom']-V['top']); cen=sum(V.values())/4
print('edges rms',[round(l[2],2) for l in L],'n',[l[3] for l in L])
print('diamond: across %.2f px = %.4f U, up-down %.2f px = %.4f U (ratio %.4f); centre %.1f,%.1f'%(W,W/U,H,H/U,H/W,cen[0],cen[1]))
print({k:np.round(v,1).tolist() for k,v in V.items()})
pl=json.load(open('box14.json')); yu=pl['upper parting line']['y_at_plate']; yl=pl['lower parting line']['y_at_plate']
print('centre below the upper parting %.2f px (%.4f U), above the lower %.2f px (%.4f U); fraction %.4f'%(cen[1]-yu,(cen[1]-yu)/U,yl-cen[1],(yl-cen[1])/U,(cen[1]-yu)/(yl-yu)))
json.dump(dict(V={k:v.tolist() for k,v in V.items()},W=W,H=H,c=cen.tolist()),open('box14d.json','w'),indent=1)
vis=im.copy()
for p in P: vis[int(round(p[1])),int(round(p[0]))]=(0,255,0)
for k,v in V.items(): cv2.circle(vis,(int(v[0]),int(v[1])),3,(0,0,255),-1)
cv2.imwrite('E:/Marine-Chronometer/.claude/worktrees/6mx-gamma/marine-chronometer-source/wempe/6mx-audit/gamma/r_14diamond.png',vis[270:470,170:480])
