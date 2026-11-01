"""Operations the case's parts need (31 October 2026; PLAN-recipes.md, batch 11): a profile turned with exact arcs (the bowl's round, the closing plate's), a sector of a
profile turned through part of a turn (the gimbal ring's bracket, the case brackets), a radial hole tapped (its thread zone along its own axis), and a zone note for what the
drawing draws by convention: a fine thread on a cast part (DIN ISO 6410: the nominal cylinder, the thread named on the sheet) and a straight knurl (DIN 82: the cylinder at the
tips, the designation on the sheet). All exact B-rep: planes, cylinders, cones, tori."""
import math
import build123d as bd
from . import Op,Drill,BIG

def prof_face(items):
    """a closed profile in the XZ plane (x the radius r, z the height): items are (r, z) corners, or ('arc', (rm, zm), (r, z)): a circular arc from the last corner through
    (rm, zm) to (r, z), exact; closed by a line to the first corner"""
    E=[];cur=None;first=None
    for it in items:
        if isinstance(it[0],str):
            _,m,e=it;E.append(bd.Edge.make_three_point_arc(bd.Vector(cur[0],0,cur[1]),bd.Vector(m[0],0,m[1]),bd.Vector(e[0],0,e[1])));cur=e
        else:
            if cur is None:first=it
            elif math.dist(cur,it)>1e-9:E.append(bd.Edge.make_line(bd.Vector(cur[0],0,cur[1]),bd.Vector(it[0],0,it[1])))
            cur=it
    if math.dist(cur,first)>1e-9:E.append(bd.Edge.make_line(bd.Vector(cur[0],0,cur[1]),bd.Vector(first[0],0,first[1])))
    return bd.Face(bd.Wire(E))

def rev_items(items,a0=None,a1=None):
    """the profile turned about Z: all the way round, or from the angle a0 to a1 (rad, atan2(y, x) in the part's plan)"""
    f=prof_face(items)
    if a0 is None:return bd.revolve(f,bd.Axis.Z,360)
    s=bd.revolve(f,bd.Axis.Z,math.degrees(a1-a0));return s.rotate(bd.Axis.Z,math.degrees(a0))

class Revolve(Op):
    """stock: a profile turned about the axis (a casting, a turned blank), arcs exact"""
    kind='stock'
    def __init__(self,items,text,sizes=(),src=''):super().__init__(text,sizes,src);self.items=items
    def apply(self,p):return rev_items(self.items)
class Sector(Op):
    """a profile turned through part of a turn, from a0 to a1: as stock (mode 'stock'), joined to the part ('add': a boss, a foot) or cut from it ('cut': a window between radial planes)"""
    def __init__(self,items,a0,a1,mode,text,sizes=(),src=''):
        super().__init__(text,sizes,src);self.items=items;self.a0=a0;self.a1=a1;self.mode=mode;self.kind='stock' if mode=='stock' else 'mill'
    def apply(self,p):
        s=rev_items(self.items,self.a0,self.a1)
        return s if self.mode=='stock' else (p+s if self.mode=='add' else p-s)
class TurnIn(Op):
    """turn away a region [(r, z) ...] about the axis, arcs allowed (the general turning cut with arcs)"""
    kind='turn'
    def __init__(self,items,text,sizes=(),src=''):super().__init__(text,sizes,src);self.items=items
    def apply(self,p):return p-rev_items(self.items)
class DrillT(Drill):
    """a hole along any direction, tapped if it has a thread: its thread zone is a cylinder about its own axis ('ax', origin, direction, r0, r1, l0, l1)"""
    def zones(self):
        if not self.thread:return []
        u=self.u;n=math.sqrt(sum(c*c for c in u));return [('ax',self.o,tuple(c/n for c in u),self.d/2-0.02,self.d/2+self.thread['H1']+0.05,0,self.L)]
class Point(Op):
    """a drill's point (a cone of included angle ang) on the end of a hole along u: base circle radius r at o, the tip tipr past it"""
    kind='drill'
    def __init__(self,o,u,r,ang,text,sizes=(),src='',tipr=0.03):super().__init__(text,sizes,src);self.o=o;self.u=u;self.r=r;self.ang=ang;self.tipr=tipr
    def apply(self,p):
        h=(self.r-self.tipr)/math.tan(math.radians(self.ang/2));return p-bd.Solid.make_cone(self.r,self.tipr,h,bd.Plane(origin=self.o,z_dir=self.u))
class Note(Op):
    """a feature the drawing draws by convention, which cuts nothing: a thread (DIN ISO 6410) or a knurl (DIN 82) on a cylinder the profile has already turned, its zone (the region where the page's helix
    or teeth depart from the convention) given as r0, r1, z0, z1 about the axis"""
    def __init__(self,kind,zone,text,sizes=(),src='',at=(0,0)):super().__init__(text,sizes,src);self.kind=kind;self.zone=zone;self.at=at
    def zones(self):r0,r1,z0,z1=self.zone;return [(self.at,r0,r1,z0,z1)]
