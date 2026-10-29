"""recipes: each part as a maker makes it, a list of machining operations (stock, turning, boring, drilling, tapping, milling a contour or a pocket), with
every size from the model's own numbers (the Wempe's WD and WESC through wempe_load.js; never restated where the page has it) and the drawing it comes from.
One recipe gives the part's exact solid (build123d, OpenCascade B-rep: lines, arcs, cylinders, cones), its STEP file and its operation sheet; recipes.py
checks the solid against the page's own mesh of the part (PLAN-recipes.md).

A Recipe holds the part's name, its parts-list line (hn, as the page tags it), its drawing, material and treatment as the drawing gives them, the stock, and
its setups in order, each a list of Ops. Each Op cuts or forms the solid (apply) and says what it does with only the sizes it cuts (sheet). Units mm. The
part's own frame: a turned part's axis is Z, its first face at Z 0; a flat part lies in XY (X the sheets' O, Y their N), its inner face at Z 0, its outer at
Z t. to_page maps that frame onto the page's mesh of the part (its geometry's own frame), a proper rotation and a shift.

Threads are drawn by convention (DIN ISO 6410): an outside thread as a plain cylinder at its major diameter, an inside one as a bore at its minor (the tap
drill), the thread itself a note on the sheet and an attribute of the STEP face. The page draws the helix; the check allows the thread's depth there."""
import math
import build123d as bd

BIG=1000.0   # a radius past any part: what a turning op removes outside
ISOP={1.0:0.25,1.2:0.25,1.4:0.3,1.7:0.35,2.0:0.4,2.3:0.4,2.6:0.45,3.0:0.5,3.5:0.6,4.0:0.7,5.0:0.8,6.0:1.0}   # ISO 261 coarse pitches (KIT's ISOP)
def iso(d):
    """an ISO metric coarse thread's figures: pitch, minor diameter of the nut (D1 = D - 1.0825 P), basic depth H1 (0.5413 P), the bolt's es at 6g (KIT's isoEs)"""
    p=ISOP[min(ISOP,key=lambda k:abs(k-d))];return {'d':d,'p':p,'D1':d-1.0825*p,'H1':0.5413*p,'es':0.015+0.011*p}

def S(label,value,tol=None,src=''):
    """one size on a sheet: what it is, the figure, its tolerance or fit (a string: '+0.012', 'h6', 'f7 -0.010/-0.022'), where it comes from"""
    return {'label':label,'value':value,'tol':tol,'src':src}

class Op:
    """one operation: kind, what it says, the sizes it cuts; apply(part) returns the part after it (None for a note: a thread cut on a bore already made)"""
    kind='op'
    def __init__(self,text,sizes=(),src=''):self.text=text;self.sizes=list(sizes);self.src=src
    def apply(self,p):return p
    def zones(self):return []   # the regions where the drawn convention departs from the page's helix: (axis point XY, r0, r1, z0, z1) in the part's frame

# ---- turned parts, axis Z ----
def _rev(pts):
    """a closed profile [(r, z) ...] (straight segments) turned about Z: a solid of revolution"""
    pts=[q for i,q in enumerate(pts) if math.dist(q,pts[i-1])>1e-9]   # repeated corners (a cone started at a face already cut) dropped
    w=bd.Polyline(*[(r,0,z) for r,z in pts],close=True);f=bd.Face(bd.Wire(w.edges()) if not isinstance(w,bd.Wire) else w)
    return bd.revolve(f,bd.Axis.Z,360)
class Bar(Op):
    """stock: a round bar, cut to length and faced (the solid starts here)"""
    kind='stock'
    def __init__(self,d,L,text,sizes=(),src=''):super().__init__(text,sizes,src);self.d=d;self.L=L
    def apply(self,p):return bd.Cylinder(self.d/2,self.L,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN))
class Ring(Op):
    """stock cut straight to a ring (cork, felt: punched or parted off; a tube or a ring blank): outside d, bore db, height h, its first face at z0"""
    kind='stock'
    def __init__(self,d,db,h,text,sizes=(),src='',z0=0):super().__init__(text,sizes,src);self.d=d;self.db=db;self.h=h;self.z0=z0
    def apply(self,p):z=self.z0;return _rev([(self.db/2,z),(self.d/2,z),(self.d/2,z+self.h),(self.db/2,z+self.h)])
class TurnOD(Op):
    """turn the outside to d from z0 to z1 (everything outside r = d/2 there removed)"""
    kind='turn'
    def __init__(self,d,z0,z1,text,sizes=(),src=''):super().__init__(text,sizes,src);self.d=d;self.z0=z0;self.z1=z1
    def apply(self,p):return p-_rev([(self.d/2,self.z0),(BIG,self.z0),(BIG,self.z1),(self.d/2,self.z1)])
class TurnCone(Op):
    """turn a cone on the outside: radius r0 at z0 to r1 at z1 (the end's lead, a chamfer)"""
    kind='turn'
    def __init__(self,r0,z0,r1,z1,text,sizes=(),src=''):super().__init__(text,sizes,src);self.a=(r0,z0);self.b=(r1,z1)
    def apply(self,p):
        (r0,z0),(r1,z1)=self.a,self.b;return p-_rev([(r0,z0),(BIG,z0),(BIG,z1),(r1,z1)])
class FaceGroove(Op):
    """a half-round (semi-elliptic) groove turned into a face at z, from r0 to r1, depth d into the part (s +1: toward +Z)"""
    kind='turn'
    def __init__(self,z,r0,r1,d,s,text,sizes=(),src=''):super().__init__(text,sizes,src);self.z=z;self.r0=r0;self.r1=r1;self.d=d;self.s=s
    def apply(self,p):
        c=(self.r0+self.r1)/2;a=(self.r1-self.r0)/2;n=48
        pts=[(c+a*math.cos(math.pi*(1-i/n)),self.z+self.s*self.d*math.sin(math.pi*i/n)) for i in range(n+1)]   # the half ellipse, as the page draws it (9 points there)
        e=bd.Wire([bd.Edge.make_line((self.r1,0,self.z),(self.r0,0,self.z))]+[bd.Edge.make_spline([bd.Vector(r,0,z) for r,z in pts])])
        return p-bd.revolve(bd.Face(e),bd.Axis.Z,360)
class TurnAway(Op):
    """turn away a region given as a closed profile [(r, z) ...] about the axis (a waist, a dished face, an undercut): the general case of turning"""
    kind='turn'
    def __init__(self,pts,text,sizes=(),src=''):super().__init__(text,sizes,src);self.pts=pts
    def apply(self,p):return p-_rev(self.pts)
class Bore(Op):
    """bore or drill on the axis, diameter d, from z0 to z1"""
    kind='bore'
    def __init__(self,d,z0,z1,text,sizes=(),src='',thread=None):super().__init__(text,sizes,src);self.d=d;self.z0=z0;self.z1=z1;self.thread=thread
    def apply(self,p):return p-_rev([(0,self.z0),(self.d/2,self.z0),(self.d/2,self.z1),(0,self.z1)])
    def zones(self):return [((0,0),self.d/2-0.02,self.d/2+self.thread['H1']+0.05,self.z0,self.z1)] if self.thread else []
class InnerCone(Op):
    """turn a cone inside (a bore's taper, a chamfer into a bore): radius r0 at z0 to r1 at z1, everything inside it removed"""
    kind='bore'
    def __init__(self,r0,z0,r1,z1,text,sizes=(),src=''):super().__init__(text,sizes,src);self.a=(r0,z0);self.b=(r1,z1)
    def apply(self,p):(r0,z0),(r1,z1)=self.a,self.b;return p-_rev([(0,z0),(r0,z0),(r1,z1),(0,z1)])
class Countersink(Op):
    """a countersink on the axis at the face z (s: +1 the cone opens toward +Z), d across at the face, angle included"""
    kind='bore'
    def __init__(self,z,d,ang,s,text,sizes=(),src=''):super().__init__(text,sizes,src);self.z=z;self.d=d;self.ang=ang;self.s=s
    def apply(self,p):
        h=self.d/2/math.tan(math.radians(self.ang/2));return p-_rev([(0,self.z+self.s*0.01),(self.d/2+0.01*math.tan(math.radians(self.ang/2)),self.z+self.s*0.01),(0,self.z-self.s*h)])
class ThreadOD(Op):
    """an outside thread cut on the turned diameter from z0 to z1 (drawn by convention: the cylinder stays at the major diameter)"""
    kind='thread'
    def __init__(self,th,z0,z1,text,sizes=(),src=''):super().__init__(text,sizes,src);self.th=th;self.z0=z0;self.z1=z1
    def zones(self):return [((0,0),self.th['d']/2-1.5*self.th['H1']-0.05,self.th['d']/2+0.05,self.z0,self.z1)]   # to the tip's flat (the page runs the thread out to its root, then cones to there)
class SlotHead(Op):
    """mill a screw slot across the head's top face at z: width w, depth s, along X (the page turns each screw's slot at random)"""
    kind='mill'
    def __init__(self,z,w,s,text,sizes=(),src=''):super().__init__(text,sizes,src);self.z=z;self.w=w;self.s=s
    def apply(self,p):return p-bd.Box(40,self.w,self.s+1,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((0,0,self.z-self.s)))

# ---- flat parts in XY, Z 0 the inner face, Z t the outer ----
class Plate(Op):
    """stock: a blank of thickness t, its outline a build123d face (the contour milled or turned: lines and arcs)"""
    kind='stock'
    def __init__(self,face,t,text,sizes=(),src=''):super().__init__(text,sizes,src);self.face=face;self.t=t
    def apply(self,p):return bd.extrude(self.face,self.t,dir=(0,0,1))   # up, whichever way the outline winds
class Hole(Op):
    """a round hole at (x, y): diameter d, from the face ('in' Z 0, 'out' Z t) depth dp (None: through), t the plate's thickness; a thread drawn at its minor"""
    kind='drill'
    def __init__(self,at,d,face,t,dp,text,sizes=(),src='',thread=None,key=''):
        super().__init__(text,sizes,src);self.at=at;self.d=d;self.face=face;self.t=t;self.dp=dp;self.thread=thread;self.key=key
    def span(self):
        if self.dp is None:return (0,self.t)
        return (0,self.dp) if self.face=='in' else (self.t-self.dp,self.t)
    def apply(self,p):
        z0,z1=self.span();e=0.01;z0=z0-e if z0<=0 else z0;z1=z1+e if z1>=self.t else z1
        return p-bd.Cylinder(self.d/2,z1-z0,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((self.at[0],self.at[1],z0)))
    def zones(self):
        z0,z1=self.span();return [(self.at,self.d/2-0.02,self.d/2+self.thread['H1']+0.05,z0,z1)] if self.thread else []
class Drill(Hole):
    """a hole along any direction: from the point o (x, y, z) along the unit vector u, diameter d, length L (a radial hole in a turned part, a hole across a
    face). One along Z is checked as a Hole (span z0..z1 at (x, y)); one across isn't measured by rays"""
    kind='drill'
    def __init__(self,o,u,d,L,text,sizes=(),src='',thread=None,key='',mz=None):
        self.mz=mz   # the depth (Z) the check measures it at, where it is closed all round (a hole half in a seat's wall below the seat)
        Op.__init__(self,text,sizes,src);self.o=o;self.u=u;self.d=d;self.L=L;self.thread=thread;self.key=key;self.at=(o[0],o[1]);self.face=None;self.t=None;self.dp=None
        self.axial=abs(abs(u[2])-1)<1e-9
    def span(self):z=(self.o[2],self.o[2]+self.u[2]*self.L);return (min(z),max(z))
    def apply(self,p):
        return p-bd.Solid.make_cylinder(self.d/2,self.L,bd.Plane(origin=self.o,z_dir=self.u))
    def zones(self):
        if not self.thread or not self.axial:return []
        z0,z1=self.span();return [(self.at,self.d/2-0.02,self.d/2+self.thread['H1']+0.05,z0,z1)]
class Cut(Op):
    """mill or cut away any solid (made by make(): a window with curved ends, a slot across): the general case"""
    kind='mill'
    def __init__(self,make,text,sizes=(),src='',at=None):super().__init__(text,sizes,src);self.make=make;self.at=at
    def apply(self,p):return p-self.make()
class Cone(Op):
    """a conical sink at (x, y) in a face: r0 at the face to r1 at depth dp (a countersink, an oil sink's step, a drill point)"""
    kind='drill'
    def __init__(self,at,r0,r1,face,t,dp,text,sizes=(),src='',z0=None):super().__init__(text,sizes,src);self.at=at;self.r0=r0;self.r1=r1;self.face=face;self.t=t;self.dp=dp;self.z0=z0
    def apply(self,p):
        zf=(self.z0 if self.z0 is not None else (0 if self.face=='in' else self.t));s=1 if self.face=='in' else -1;e=0.01 if self.z0 is None else 0
        c=_rev([(0,zf-s*e),(self.r0+e,zf-s*e),(self.r0,zf),(self.r1,zf+s*self.dp),(0,zf+s*self.dp)])
        return p-c.moved(bd.Location((self.at[0],self.at[1],0)))
class Pocket(Op):
    """mill a pocket: the region (a build123d face) from the face down dp (None: through)"""
    kind='mill'
    def __init__(self,face2d,face,t,dp,text,sizes=(),src=''):super().__init__(text,sizes,src);self.f=face2d;self.face=face;self.t=t;self.dp=dp
    def apply(self,p):
        if self.dp is None:return p-bd.extrude(self.f.moved(bd.Location((0,0,-0.01))),self.t+0.02,dir=(0,0,1))
        z0=-0.01 if self.face=='in' else self.t-self.dp;return p-bd.extrude(self.f.moved(bd.Location((0,0,z0))),self.dp+0.01,dir=(0,0,1))

class Setup:
    """one setup: how the part is held and which face is up, then its operations in order; view the sketch's ('top', 'bottom'; a turned part's is its half section)"""
    def __init__(self,name,hold,ops,view=None):self.name=name;self.hold=hold;self.ops=ops;self.view=view

class Bought:
    """a part a maker buys, not makes (the owner's choice, 29 October 2026: jewels, spring strip, standard screws): one line, what to buy, no solid"""
    def __init__(self,key,hn,title,what,size,standard,material,src,notes=()):
        self.key=key;self.hn=hn;self.title=title;self.what=what;self.size=size;self.standard=standard;self.material=material;self.src=src;self.notes=list(notes)

class Recipe:
    def __init__(self,key,hn,title,drawing,material,treatment,setups,to_page,notes=(),fits=(),expect=(),faces=('inner face','outer face')):
        self.faces=faces   # what the faces at Z 0 and Z t are called (a flat part): the sheets' sketches name the face they are seen from
        self.expect=list(expect)   # where the page's mesh is known to depart from the drawing: {'at': (x, y), 'r', 'max', 'why'} in the part's frame (the check reports, not fails, them)
        self.key=key;self.hn=hn;self.title=title;self.drawing=drawing;self.material=material;self.treatment=treatment
        self.setups=setups;self.to_page=to_page;self.notes=list(notes);self.fits=list(fits)
    def ops(self):return [o for s in self.setups for o in s.ops]
    def build(self):
        p=None
        for o in self.ops():p=o.apply(p)
        return p
    def zones(self):return [z for o in self.ops() for z in o.zones()]

def page_matrix(rows,shift=(0,0,0)):
    """to_page from the part's frame: page = R . part + shift, R's rows given (each a permutation with signs); proper rotations only"""
    import numpy as np
    R=np.array(rows,float);assert abs(np.linalg.det(R)-1)<1e-9,'to_page must be a proper rotation';M=np.eye(4);M[:3,:3]=R;M[:3,3]=shift;return M
