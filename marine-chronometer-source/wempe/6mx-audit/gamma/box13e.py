"""Gamma (box fork): 13_'s outer box front (its lower part hidden by the bag). Its sides (rows: the front's wood onto the shaded left
side, onto the dark right background) as lines; the round catch's edge (a light disc on the wood: luma falling outward, rays) as an
ellipse, whose axis ratio gives the face's vertical foreshortening (the face treated as affine over this small span: its sides lean
by 2-3 px over 100 px); the cut-out's edge (the felt's dark onto the wood, the outermost rise along rays from its centre) as a circle
in the face's frame. Fractions of the front's width at the catch's row."""
import cv2,numpy as np,json
exec(open('box13.py').read().split("lines={}")[0])
left=line([stepat(Lu,(100,y),(1,0),0,40,1,thr=1) for y in range(715,830,2)])
right=line([stepat(Lu,(645,y),(1,0),0,30,-1,thr=1) for y in range(715,830,2)])
print('sides rms %.2f/%.2f n %d/%d'%(left[1],right[1],left[2],right[2]))
def xat(l,y): a,b,c=l; return -(b*y+c)/a
# catch
c0=np.array((405.,808.)); pp=[]
for ad in np.arange(0,360,2):
    if 245<ad<300: continue
    a_=np.radians(ad); q=stepat(Lu,c0,(np.cos(a_),np.sin(a_)),18,45,-1,thr=4)
    if q is not None: pp.append(q)
pp=np.array(pp); e=cv2.fitEllipse(np.float32(pp)); q,sd,rms,n=fitc(pp)
yc=e[0][1]; W=xat(left[0],yc)-xat(right[0],yc); W=abs(W)
(ax1,ax2)=e[1]; ang=e[2]
print('catch: ellipse centre %.1f,%.1f axes %.2f/%.2f at %.1f deg; circle rms %.2f n %d'%(e[0][0],e[0][1],ax1,ax2,ang,rms,n))
hor=max(ax1,ax2); ver=min(ax1,ax2); k=ver/hor
print('front width at the catch row %.2f px; catch Ø %.4f W; vertical foreshortening %.4f; catch centre at x %.4f W'%(W,hor/W,k,(e[0][0]-min(xat(left[0],yc),xat(right[0],yc)))/W))
# cut-out: rays from (405,690) downward, the outermost rise (dark felt -> wood) between r 50 and 140
ct=np.array((405.,690.)); cp=[]
for ad in np.arange(10,171,1.5):
    a_=np.radians(ad); t,v=prof(Lu,ct,(np.cos(a_),np.sin(a_)),40,150); v=cv2.GaussianBlur(v.reshape(-1,1),(1,5),1).ravel(); d=np.gradient(v)
    idx=[i for i in range(2,len(d)-2) if d[i]>1 and d[i]>=d[i-1] and d[i]>=d[i+1] and v[max(i-15,0)]<80]
    if idx:
        i=idx[-1]; s_=t[i]; cp.append((ct[0]+s_*np.cos(a_),ct[1]+s_*np.sin(a_)))
cp=np.array(cp)
# to the face's frame: x unchanged, y divided by k
cf=cp.copy(); cf[:,1]=cf[:,1]/k
rng=np.random.default_rng(0); best=None
for _ in range(3000):
    s3=cf[rng.choice(len(cf),3,replace=False)]; A=np.c_[2*s3,np.ones(3)]; b=(s3**2).sum(1)
    try: qq=np.linalg.solve(A,b)
    except np.linalg.LinAlgError: continue
    Rr=np.sqrt(qq[2]+qq[0]**2+qq[1]**2)
    if not 60<Rr<250: continue
    inl=np.abs(np.hypot(cf[:,0]-qq[0],cf[:,1]-qq[1])-Rr)<2.0
    if best is None or inl.sum()>best.sum(): best=inl
qc,sdc,rmsc,nc=fitc(cf[best])
print('cut-out: r %.2f px (face frame) = %.4f W (sd %.4f), centre x %.4f W; %d of %d points, rms %.2f px'%(qc[2],qc[2]/W,sdc[2]/W,(qc[0]-min(xat(left[0],yc),xat(right[0],yc)))/W,nc,len(cf),rmsc))
lowest=qc[1]+qc[2]; print('cut-out bottom at image y %.1f'%(lowest*k))
vis=cv2.imread(IMG)
for p in cp[best]: cv2.circle(vis,(int(p[0]),int(p[1])),1,(0,255,0),-1)
for p in pp: cv2.circle(vis,(int(p[0]),int(p[1])),1,(255,0,0),-1)
cv2.imwrite('E:/Marine-Chronometer/.claude/worktrees/6mx-gamma/marine-chronometer-source/wempe/6mx-audit/gamma/r_13cut.png',vis[660:860,80:681])
json.dump(dict(W=W,catchD=hor/W,k=k,cut_r=qc[2]/W,cut_cx=(qc[0]-min(xat(left[0],yc),xat(right[0],yc)))/W,cut_c_y=qc[1]*k,cut_bottom_y=lowest*k),open('box13e.json','w'),indent=1)
