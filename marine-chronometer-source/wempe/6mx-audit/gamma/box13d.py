"""Gamma (box fork): 13_'s outer lid, its front face (open, facing the camera): top edge, the bottom edge's straight runs either side
of the tongue, left and right edges, each by sub-pixel steps (red channel; the face's bright wood against the darker side faces and
the shadow) and a fitted line; the quad rectified to width 1 and height a, a chosen so its number plate (outer edge, rays) comes out
round. Then the tongue's edge (the wood onto the dark box below) in the rectified frame: a circle fitted, its chord on the bottom
edge's line, its depth below it, its centre."""
import cv2,numpy as np,json
exec(open('box13.py').read().split("lines={}")[0])
G=Lu
L={}
L['top']=line([stepat(Lu,(x,45),(0,1),0,30,-1) for x in range(150,600,3)])          # background (light, low red? ) -> wood
L['bottom']=line([stepat(Lu,(x,285),(0,1),0,35,-1) for x in list(range(140,270,3))+list(range(545,620,3))])   # wood -> the dark gap below
L['left']=line([stepat(Lu,(80,y),(1,0),0,40,1) for y in range(110,280,3)])
L['right']=line([stepat(Lu,(665,y),(-1,0),0,40,-1) for y in range(110,280,3)])
for k,(l,s,n) in L.items(): print('%-7s rms %.2f n %d'%(k,s,n))
Q=np.array([X(L['top'][0],L['left'][0]),X(L['top'][0],L['right'][0]),X(L['bottom'][0],L['right'][0]),X(L['bottom'][0],L['left'][0])]); print('lid quad',np.round(Q,1).tolist())
c0=np.array((388.,118.)); pp=[]
for ad in np.arange(0,360,2):
    if 75<ad<105 or 255<ad<285: continue
    a=np.radians(ad); q=stepat(R,c0,(np.cos(a),np.sin(a)),24,46,1)
    if q is not None: pp.append(q)
pp=np.array(pp); q,sd,rms,n=fitc(pp); print('plate (image): %.1f,%.1f r %.2f rms %.2f n %d'%(q[0],q[1],q[2],rms,n))
def rect(a): return cv2.getPerspectiveTransform(np.float32(Q),np.float32([[0,0],[1,0],[1,a],[0,a]]))
def tr(Hm,p): p=np.c_[p,np.ones(len(p))]@Hm.T; return p[:,:2]/p[:,2:]
rs=[(a,(lambda e:min(e[1])/max(e[1]))(cv2.fitEllipse(np.float32(tr(rect(a),pp)*1000)))) for a in np.arange(0.25,0.75,0.0005)]
rs=np.array(rs); i=np.argmax(rs[:,1]); a=rs[i,0]; ok=rs[rs[:,1]>rs[i,1]-0.01,0]
Hm=rect(a); qp,_,_,_=fitc(tr(Hm,pp))
print('lid face height %.4f W (round plate; %.4f-%.4f within 1 %%); plate Ø %.4f W at x %.4f, %.4f below the top'%(a,ok.min(),ok.max(),2*qp[2],qp[0],qp[1]))
# tongue: rays from below its middle, upward-ish arc: wood (bright) inside -> dark outside, going outward from a centre above
ct=np.array((405.,273.)); tp=[]
def valley_r(ch,P0,u,t0,t1):
    t,v=prof(ch,P0,u,t0,t1); v=cv2.GaussianBlur(v.reshape(-1,1),(1,3),0.6).ravel(); i=int(np.argmin(v))
    if i<2 or i>len(v)-3 or v[i]>np.median(v)-25: return None
    a,b,c=v[i-1],v[i],v[i+1]; o=(a-c)/(2*(a-2*b+c)+1e-9); s_=t[i]+o*0.2; return (P0[0]+s_*u[0],P0[1]+s_*u[1])
for ad in np.arange(20,161,1.0):
    if 55<ad<80: continue   # the lever's knob and its shadow
    aa_=np.radians(ad); q_=valley_r(Lu,ct,(np.cos(aa_),np.sin(aa_)),100,140)
    if q_ is not None: tp.append(q_)
tp=np.array(tp); rt=tr(Hm,tp)
rng=np.random.default_rng(0); best=None
for _ in range(4000):
    s3=rt[rng.choice(len(rt),3,replace=False)]; A=np.c_[2*s3,np.ones(3)]; b=(s3**2).sum(1)
    try: qq=np.linalg.solve(A,b)
    except np.linalg.LinAlgError: continue
    Rr=np.sqrt(qq[2]+qq[0]**2+qq[1]**2)
    if not 0.1<Rr<0.5: continue
    inl=np.abs(np.hypot(rt[:,0]-qq[0],rt[:,1]-qq[1])-Rr)<0.006
    if best is None or inl.sum()>best.sum(): best=inl
qt,sdt,rmst,nt=fitc(rt[best]); tp=tp[best]
# chord on the bottom line (y = a in the rectified frame)
h=a-qt[1]; half=np.sqrt(max(qt[2]**2-h**2,0)); depth=qt[1]+qt[2]-a
print('tongue: circle r %.4f W (sd %.4f, rms %.4f W, n %d), centre x %.4f, %.4f W above the bottom edge; chord %.4f W, depth below the edge %.4f W'%(qt[2],sdt[2],rmst,nt,qt[0],a-qt[1],2*half,depth))
vis=cv2.imread(IMG)
for p in tp: cv2.circle(vis,(int(p[0]),int(p[1])),1,(0,255,0),-1)
cv2.imwrite('E:/Marine-Chronometer/.claude/worktrees/6mx-gamma/marine-chronometer-source/wempe/6mx-audit/gamma/r_13tongue.png',vis[250:420,250:560])
json.dump(dict(Q=Q.tolist(),a=a,arange=[ok.min(),ok.max()],plate=[qp[0],qp[1],2*qp[2]],tongue=dict(r=qt[2],cx=qt[0],c_above=a-qt[1],chord=2*half,depth=depth)),open('box13d.json','w'),indent=1)
