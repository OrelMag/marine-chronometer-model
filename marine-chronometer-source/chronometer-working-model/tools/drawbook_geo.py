"""drawbook_geo.py: a part's views drawn from its solid, for drawbook.py. The part's triangles (movement frame, mm) are put in the part's own frame, then each
view is an orthographic projection with its hidden lines found by ray casting (Embree through trimesh): the solid's creases (faces meeting at over CREASE degrees)
and its silhouettes against the view, sampled along each edge, each sample visible if nothing of the solid lies between it and the viewer. Visible and hidden runs
are chained into polylines in the drawing's plane and fitted back into what was turned or milled: lines, circular arcs and whole circles (a tessellated circle's
equal chords). A section is the solid cut by a plane, the half toward the viewer taken away, its cut faces' outline hatched.

The part's frame (frame()): a turned part (the solid the same turned about an axis, a slot or leaves aside) has that axis as its w; a flat part (a plate, bridge,
wheel, spring) has the arbors' axis (the movement's y) as w and its plan's longer extent as u. Views are named as DIN 6 names them in first-angle projection:
'front' looks along -v (u right, w up), 'top' looks down w (u right, v up on the paper: drawn below the front view), 'left' looks along +u (drawn right of the front)."""
import json,math,pathlib
import numpy as np
import trimesh
CREASE=28.0      # degrees: an edge where faces meet at more than this is drawn (a 32-sided turned part's facets meet at 11.25: not drawn)
def load(dirp,k):
    d=np.load(dirp/f'{k}.npz');meta=json.load(open(dirp/f'{k}.json',encoding='utf-8'))
    m=trimesh.Trimesh(d['V'].astype(np.float64),d['F'].astype(np.int64),process=True,validate=False)
    m.merge_vertices(digits_vertex=5);return m,meta
# ---------- the part's frame ----------
def symmetric(m,c,a,tol=None):
    """the share of the surface that lands back on it turned 360/7.3 degrees about the axis through c along a (a turned part: near 1)"""
    P,_=trimesh.sample.sample_surface_even(m,1500,seed=1) if len(m.faces)>8 else (m.vertices,None)
    a=np.asarray(a,float);a/=np.linalg.norm(a);R=trimesh.transformations.rotation_matrix(2*math.pi/7.3,a,c)
    Q=trimesh.transform_points(P,R);_,dist,_=trimesh.proximity.closest_point(m,Q)
    ext=m.extents.max();tol=tol or max(0.004,0.006*ext)
    return float((dist<tol).mean())
def frame(m,meta,ymid=None):
    """(kind, T, share) with T a 4x4 taking the movement frame into the part's: x=u, y=v, z=w. kind 'turned' (w its axis, the movement's dial side up where the
    axis is the arbors') or 'flat' (w along the movement's y, toward the outside of the movement: the dial side for a part on the dial side of ymid, the train side
    for one beyond it, so its plan is the face seen from outside; u its plan's longest extent, by the plan outline's principal axes)"""
    b=m.bounds;c=(b[0]+b[1])/2;best=None
    for ax in ([0,1,0],[1,0,0],[0,0,1]):
        # the axis through the centre of the solid's own turned outline: the bounding box's middle across the axis
        s=symmetric(m,c,ax)
        if best is None or s>best[0]:best=(s,ax)
    s,ax=best;ax=np.array(ax,float)
    along=float(np.ptp(m.vertices@ax));across=float(max(np.ptp(m.vertices@e) for e in np.eye(3) if abs(e@ax)<0.5))
    if s>0.97 or s>0.6 and along>0.9*across:                                             # nearly all turned, or a turned arbor with leaves or a slot
        w=ax;u=np.array([1.,0,0]) if abs(w[0])<0.9 else np.array([0,0,-1.])
        v=np.cross(w,u);T=np.eye(4);T[:3,:3]=np.array([u,v,w]);T[:3,3]=-T[:3,:3]@c;return 'turned',T,s
    from shapely.geometry import MultiPoint
    R=np.asarray(MultiPoint(m.vertices[:,[0,2]]).minimum_rotated_rectangle.exterior.coords)   # the plan's smallest enclosing rectangle: its long side along u
    s1,s2=R[1]-R[0],R[2]-R[1];d=s1 if np.hypot(*s1)>=np.hypot(*s2) else s2;el=max(np.hypot(*s1),np.hypot(*s2))/max(1e-9,min(np.hypot(*s1),np.hypot(*s2)))
    ang=math.atan2(d[1],d[0]);ang=(ang+math.pi/2)%math.pi-math.pi/2
    if abs(ang)<math.radians(4) or el<1.25:ang=0.0                                          # square to the movement where it is nearly so, or not elongated
    ca,sa=math.cos(ang),math.sin(ang)
    u=np.array([ca,0,sa]);w=np.array([0,1.,0])
    if ymid is not None and c[1]<ymid:w=-w;u=-u                                            # seen from the train side: turned over about v
    v=np.cross(w,u)                                                                         # v = w x u: the plan's up on the paper is toward 12 o'clock when u is 3 o'clock
    T=np.eye(4);T[:3,:3]=np.array([u,v,w]);T[:3,3]=-T[:3,:3]@c;return 'flat',T,s
# ---------- the views ----------
VIEWS={'front':(np.array([0,1.,0]),0,2),     # (direction from the viewer into the paper, the paper's x axis, its y axis up): u right, w up; first angle: its viewer stands at
                                             # the plan's foot (-v), the plan drawn below it
       'top':(np.array([0,0,-1.]),0,1),      # down the axis w: u right, v up
       'left':(np.array([1.,0,0]),1,2),
       'bottom':(np.array([0,0,1.]),0,1)}    # up the axis from beneath: u reversed on the paper (a screw's head seen end on)      # from -u looking along +u: in first angle drawn right of the front; v... see note
def edges(m,d):
    """the creases and the silhouettes against direction d: (n,2) vertex pairs"""
    fa=m.face_adjacency;ang=m.face_adjacency_angles;ev=m.face_adjacency_edges
    n=m.face_normals;s0=n[fa[:,0]]@d;s1=n[fa[:,1]]@d
    sil=(s0*s1<0)&(np.abs(s0-s1)>1e-6)
    crease=ang>math.radians(CREASE)
    E=ev[crease|sil]
    # boundary edges (an open solid's): drawn
    try:
        from trimesh.grouping import group_rows
        eu=m.edges_sorted;g=group_rows(eu,require_count=1)
        if len(g):E=np.vstack([E,eu[g]])
    except Exception:pass
    return E
def hlr(m,d,step,keep=None):
    """the visible and hidden runs of the edges seen along d, sampled every step (mm): lists of 3D point pairs ((a,b),visible). keep(points)->bool mask limits to a region"""
    E=edges(m,d);V=m.vertices;A=V[E[:,0]];B=V[E[:,1]];L=np.linalg.norm(B-A,axis=1)
    ns=np.maximum(2,np.ceil(L/step).astype(int)+1)
    idx=np.repeat(np.arange(len(E)),ns);t=np.concatenate([np.linspace(0,1,k) for k in ns])
    P=A[idx]+(B[idx]-A[idx])*t[:,None]
    ext=m.extents.max();eps=max(1e-4,2e-5*ext)
    org=P-d*eps;dirs=np.tile(-d,(len(P),1))
    hit=m.ray.intersects_any(org,dirs)
    vis=~hit
    if keep is not None:inside=keep(P)
    else:inside=np.ones(len(P),bool)
    runs=[];o=0
    for i,k in enumerate(ns):
        pv=vis[o:o+k];pi=inside[o:o+k];pp=P[o:o+k];o+=k
        # a lone sample of the other kind between its neighbours is noise (a ray grazing the face beside the edge)
        if k>=3:
            for j in range(1,k-1):
                if pv[j-1]==pv[j+1]!=pv[j]:pv[j]=pv[j-1]
        j=0
        while j<k-1:
            if not(pi[j] and pi[j+1]):j+=1;continue
            s=j
            while j<k-1 and pv[j+1]==pv[s] and pi[j+1]:j+=1
            if j==s:j+=1
            runs.append((pp[s],pp[min(j,k-1)],bool(pv[s])))
            if j==s+1 and j<k-1:pass
    return runs
def project(runs,ax,ay):
    vis=[];hid=[]
    for a,b,v in runs:(vis if v else hid).append((a[ax],a[ay],b[ax],b[ay]))
    return np.array(vis).reshape(-1,4),np.array(hid).reshape(-1,4)
def drop_covered(hid,vis,tol):
    """hidden runs lying on a visible line are not drawn (a plate's lower outline under its upper): split each hidden segment at samples, keep those off the visible"""
    if not len(hid) or not len(vis):return hid
    from scipy.spatial import cKDTree
    S=[]
    for x0,y0,x1,y1 in vis:
        n=max(2,int(math.hypot(x1-x0,y1-y0)/(tol*0.7))+1);t=np.linspace(0,1,n);S.append(np.c_[x0+(x1-x0)*t,y0+(y1-y0)*t])
    tr=cKDTree(np.vstack(S));out=[]
    for x0,y0,x1,y1 in hid:
        n=max(2,int(math.hypot(x1-x0,y1-y0)/(tol*0.7))+1);t=np.linspace(0,1,n);Q=np.c_[x0+(x1-x0)*t,y0+(y1-y0)*t]
        off=tr.query(Q)[0]>tol;j=0
        while j<n-1:
            if not off[j]:j+=1;continue
            s=j
            while j<n-1 and off[j+1]:j+=1
            if j>s:out.append((*Q[s],*Q[j]))
            j+=1
    return np.array(out).reshape(-1,4)
# ---------- polylines, and what they are made of ----------
def chains(seg,tol):
    """segments joined end to end (within tol) into polylines, split where they branch"""
    if not len(seg):return []
    key=lambda x,y:(round(x/tol),round(y/tol))
    from collections import defaultdict
    adj=defaultdict(list);pts={}
    E=[]
    for i,(x0,y0,x1,y1) in enumerate(seg):
        a=key(x0,y0);b=key(x1,y1)
        if a==b:continue
        pts.setdefault(a,(x0,y0));pts.setdefault(b,(x1,y1));E.append((a,b))
    # the same segment twice (two edges projecting onto one line) is drawn once
    E=list({tuple(sorted(e)) for e in E})
    for i,(a,b) in enumerate(E):adj[a].append(i);adj[b].append(i)
    used=[False]*len(E);out=[]
    def walk(v,first):
        P=[v];e=first
        while True:
            used[e]=True;a,b=E[e];v=b if a==v else a;P.append(v)
            if len(adj[v])!=2:break
            nx=[j for j in adj[v] if not used[j]]
            if not nx:break
            e=nx[0]
        return P
    for v in list(adj):                       # from the ends and branch points first
        if len(adj[v])!=2:
            for e in adj[v]:
                if not used[e]:out.append(walk(v,e))
    for i in range(len(E)):                   # then the closed loops
        if not used[i]:out.append(walk(E[i][0],i))
    return [np.array([pts[v] for v in P]) for P in out]
def fitcircle(P):
    x,y=P[:,0],P[:,1];A=np.c_[2*x,2*y,np.ones(len(x))];b=x*x+y*y
    (cx,cy,c),*_=np.linalg.lstsq(A,b,rcond=None);r=math.sqrt(max(c+cx*cx+cy*cy,0));return cx,cy,r
def prims(P,tol):
    """a polyline as lines, arcs and circles: runs of three or more chords turning the same way by under 35 degrees on one circle (within tol) are an arc; straight runs a line"""
    closed=len(P)>3 and np.hypot(*(P[0]-P[-1]))<tol
    if closed:P=P[:-1]
    n=len(P)
    if closed and n>=8:
        cx,cy,r=fitcircle(P);res=np.abs(np.hypot(P[:,0]-cx,P[:,1]-cy)-r).max()
        R=np.vstack([P,P[:2]]);v1=R[1:-1]-R[:-2];v2=R[2:]-R[1:-1];tn=np.arctan2(v1[:,0]*v2[:,1]-v1[:,1]*v2[:,0],np.einsum('ij,ij->i',v1,v2))
        if res<max(tol,min(0.002*r,3*tol)) and (np.all(tn>-1e-3) or np.all(tn<1e-3)) and np.abs(tn).max()<math.radians(35) and abs(abs(tn.sum())-2*math.pi)<0.1:return [('circle',cx,cy,r)]
    Q=np.vstack([P,P[:1]]) if closed else P
    out=[];i=0;m=len(Q)
    def straight(i,j):
        a,b=Q[i],Q[j];d=b-a;l=np.hypot(*d)
        if l<1e-9:return False
        nrm=np.array([-d[1],d[0]])/l;return np.abs((Q[i:j+1]-a)@nrm).max()<tol
    while i<m-1:
        # the longest straight run, then the longest arc run; take the longer
        j=i+1
        while j+1<m and straight(i,j+1):j+=1
        k=i+1;arc=None
        if i+2<m:
            k=i+2
            while k<m:
                S=Q[i:k+1];cx,cy,r=fitcircle(S)
                v1=S[1:-1]-S[:-2];v2=S[2:]-S[1:-1];cr=v1[:,0]*v2[:,1]-v1[:,1]*v2[:,0];dt=np.einsum('ij,ij->i',v1,v2)
                tn=np.arctan2(cr,dt)
                ok=r<1e5 and np.abs(np.hypot(S[:,0]-cx,S[:,1]-cy)-r).max()<max(tol,min(0.002*r,3*tol)) and (np.all(tn>1e-4) or np.all(tn<-1e-4)) and np.abs(tn).max()<math.radians(35)
                if not ok:break
                arc=(k,cx,cy,r,1 if tn[0]>0 else -1);k+=1
        if arc and arc[0]>j:
            k,cx,cy,r,sg=arc;out.append(('arc',cx,cy,r,*Q[i],*Q[k],sg));i=k
        else:
            out.append(('line',*Q[i],*Q[j]));i=j
    # lines along one straight line joined
    res=[]
    for p in out:
        if res and p[0]=='line' and res[-1][0]=='line':
            a=res[-1];x0,y0,x1,y1=a[1:5];X0,Y0,X1,Y1=p[1:5]
            if abs(x1-X0)<tol and abs(y1-Y0)<tol:
                d=np.array([X1-x0,Y1-y0]);l=np.hypot(*d)
                if l>1e-9:
                    nrm=np.array([-d[1],d[0]])/l
                    if abs(np.dot([x1-x0,y1-y0],nrm))<tol:res[-1]=('line',x0,y0,X1,Y1);continue
        res.append(p)
    return res
def view(m,name,scale,keep=None,hidden=True):
    """a view's primitives: {'vis':[...], 'hid':[...]} in the paper's plane (mm of the part, y up), sampled at a quarter of a printed mm"""
    d,ax,ay=VIEWS[name];step=0.25/scale;tol=0.04/scale
    runs=hlr(m,d,step,keep);vis,hid=project(runs,ax,ay)
    if name in('left','bottom'):vis[:,[0,2]]*=-1;hid[:,[0,2]]*=-1   # seen from -u looking along +u: v runs to the left on the paper; from beneath, u does
    hid=drop_covered(hid,vis,tol*1.5) if hidden else hid[:0]
    out={}
    for k,S in (('vis',vis),('hid',hid)):
        out[k]=[p for P in chains(S,tol*0.5) for p in prims(P,tol)]
    return out
def section(m,origin,d):
    """the solid cut by the plane through origin square to the view direction d: the cut faces' outlines (closed loops, 3D) and the solid beyond the plane
    (the half toward the viewer taken away), capped"""
    s=m.section(plane_origin=origin,plane_normal=d)
    loops=[] if s is None else [np.asarray(e) for e in s.discrete]
    far=trimesh.intersections.slice_mesh_plane(m,plane_normal=np.asarray(d,float),plane_origin=origin,cap=True)
    return loops,far
def main(OUT,only):
    import drawbook_sheet
    drawbook_sheet.main(OUT,only)
