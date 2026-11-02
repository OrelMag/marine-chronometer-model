"""The Hamilton Model 21's parts as Hamilton Watch Co. drew them (2 November 2026; PLAN-hamilton-drawings.md, the NAWCC's 26 sheets): each part a recipe built
from js/hdims.js (HD, the drawn sizes in mm from the sheets' inches, each with its "NNNNN #item"; the transcriptions in References/Hamilton-original-drawings/
transcriptions/) and nothing else: no L, HK, FK or movement.js, so the parts are the drawings' own, apart from the model and its rescale. They are not in the
model yet: hamilton_parts.py builds them, checks them and writes the viewer's data (marine-chronometer-source/hamilton-parts/), STEP files and operation sheets.

Frames: a turned part's axis is Z, its first end at Z 0 (the end the sheet's dimensions start from); a flat part lies in XY in the sheet's own frame (x right,
y up the sheet, its datum 2.0000, 2.0000 at 0, 0), its first face at Z 0. Where the sheets give no tooth form (a wheel's or pinion's: only z, m and the tips),
the teeth are core.js gearOutline's cycloidal form (BS 978 Part 2's proportions), its addendum run out to the drawn tips: an estimate, said on each part."""
import functools,json,math,pathlib,subprocess
import build123d as bd
from . import (Op,Recipe,Setup,S,page_matrix,Blank,TurnProfile,TurnCone,TurnAway,CutLeaves,Plate,Hole,Countersink,Cut,Bore,Drill)
TOOLS=pathlib.Path(__file__).resolve().parents[1]
HDIMS=TOOLS.parent/'js'/'hdims.js'
ID=page_matrix([[1,0,0],[0,1,0],[0,0,1]])   # these parts aren't in the page: their frame is their own
NODE=r"""const fs=require('fs'),vm=require('vm');const c={};vm.createContext(c);vm.runInContext(fs.readFileSync(process.argv[1],'utf8')+';this.HD=HD;',c);process.stdout.write(JSON.stringify(c.HD))"""

@functools.lru_cache()
def HD():
    """HD as hdims.js has it (its numbers in mm)"""
    return json.loads(subprocess.run(['node','-e',NODE,str(HDIMS)],capture_output=True,text=True,check=True).stdout)
def inch(mm):return mm/25.4
def fx(mm,d=4):
    """a size as the sheet writes it (inches) with its mm"""
    return f'{inch(mm):.{d}f} in = {mm:.3f} mm'

# ---- outlines: HD's exact segments ({k:'l',p,q} | {k:'a',c,r,p,q,ccw}) as a build123d face ----
def _seg(s):
    P=lambda q:bd.Vector(q[0],q[1],0)
    if s['k']=='l':return bd.Edge.make_line(P(s['p']),P(s['q']))
    c=s['c'];a0=math.atan2(s['p'][1]-c[1],s['p'][0]-c[0]);a1=math.atan2(s['q'][1]-c[1],s['q'][0]-c[0]);d=a1-a0
    if s['ccw']:
        while d<=0:d+=2*math.pi
    else:
        while d>=0:d-=2*math.pi
    am=a0+d/2;m=(c[0]+s['r']*math.cos(am),c[1]+s['r']*math.sin(am))   # the arc through its two table points and its mid point on the drawn radius
    return bd.Edge.make_three_point_arc(P(s['p']),P(m),P(s['q']))
def outline_face(segs):return bd.Face(bd.Wire([_seg(s) for s in segs]))
def seg_sizes(segs,sheet,names=None):
    """the outline's arcs as sheet sizes: radius and centre (the table's row)"""
    out=[]
    for i,s in enumerate(segs):
        if s['k']=='a':out.append(S((names or {}).get(i,f'arc {i+1}'),f"R {fx(s['r'])} about ({inch(s['c'][0]):+.4f}, {inch(s['c'][1]):+.4f}) in from the datum",None,sheet))
    return out

# ---- teeth: core.js gearOutline's form (cycloidal, BS 978 Part 2), ported; o.ext (a leaf run out straight past the pitch circle) as the drawn-parts branch has it ----
def gear_outline(n,m,mate=10,ha=1.15,ext=0.0,dep=1.3,flank=24,tip=12):
    """the closed outline [(x, y) ...] of n teeth of module m, and its tip and root radii. A wheel (n > 20): radial flanks, an epicycloidal addendum rolled by a
    circle half its pinion's (mate leaves) pitch radius, capped at ha m; a pinion's leaf (n <= 20): 1.05 m thick, radial flanks and a round tip, ext mm further out"""
    rp=m*n/2;p=2*math.pi/n;pts=[];ri=rp-dep*m
    def root(a0,a1):
        for k in (1,2):pts.append((ri,a0+(a1-a0)*k/3))
    if n<=20:
        b=0.525*m/rp;rt=0.525*m;ro=rp+ext+rt
        for i in range(n):
            c=i*p+0.375*p;pts+=[(ri,c-b),(rp+ext,c-b)] if ext else [(ri,c-b),(rp,c-b)]
            for k in range(1,tip):
                t=math.pi*k/tip;u=rp+ext+rt*math.sin(t);v=-rt*math.cos(t);pts.append((math.hypot(u,v),c+math.atan2(v,u)))
            pts+=[(rp+ext,c+b),(ri,c+b)];root(c+b,c+p-b)
    else:
        b=0.705*m/rp;rg=m*mate/4;hm=ha*m;K=(rp+rg)/rg;ep=[]
        for k in range(flank+1):
            t=0.6*k/flank;x=(rp+rg)*math.cos(t)-rg*math.cos(K*t);y=(rp+rg)*math.sin(t)-rg*math.sin(K*t);r=math.hypot(x,y);a=math.atan2(y,x)
            if a>=b or r>=rp+hm:ep.append((min(r,rp+hm),min(a,b)));break
            ep.append((r,a))
        ro=ep[-1][0]
        for i in range(n):
            c=i*p+0.375*p;pts.append((ri,c-b))
            for r,a in ep:pts.append((r,c-b+a))
            for k in range(len(ep)-1,-1,-1):
                r,a=ep[k]
                if a<b-1e-9 or k<len(ep)-1:pts.append((r,c+b-a))
            pts.append((ri,c+b));root(c+b,c+p-b)
    xy=[(r*math.cos(a),r*math.sin(a)) for r,a in pts];q=[xy[0]]
    for v in xy[1:]:
        if math.dist(v,q[-1])>1e-7:q.append(v)
    if math.dist(q[0],q[-1])<1e-7:q.pop()
    return q,ro,ri

class Solid(Op):
    """a solid made whole by make() (a stock that is more than a bar or a plate)"""
    kind='stock'
    def __init__(self,make,text,sizes=(),src=''):super().__init__(text,sizes,src);self.make=make
    def apply(self,p):return self.make()
class Dome(Op):
    """round an end: the part left inside a sphere of radius R whose surface passes through the axis at the end z (s -1: the end at the part's low end)"""
    kind='turn'
    def __init__(self,z,R,s,text,sizes=(),src=''):super().__init__(text,sizes,src);self.z=z;self.R=R;self.s=s
    def apply(self,p):
        c=self.z-self.s*self.R;sph=bd.Solid.make_sphere(self.R).moved(bd.Location((0,0,c)))
        lo,hi=(c,self.z+1) if self.s>0 else (self.z-1,c)
        cap=bd.Cylinder(50,hi-lo,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((0,0,lo)))   # the end's region beyond the sphere's centre
        return p-(cap-sph)
class MillSquare(Op):
    """mill a square a across the flats from z0 to z1 on the axis (the corners left as turned: the bar's round)"""
    kind='mill'
    def __init__(self,a,z0,z1,text,sizes=(),src=''):super().__init__(text,sizes,src);self.a=a;self.z0=z0;self.z1=z1
    def apply(self,p):
        ring=bd.Cylinder(50,self.z1-self.z0,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((0,0,self.z0)))
        sq=bd.Box(self.a,self.a,self.z1-self.z0+0.02,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).rotate(bd.Axis.Z,45).moved(bd.Location((0,0,self.z0-0.01)))   # a diamond, its corners on the centre lines, as the end views draw it (audit A-7, C-7)
        return p-(ring-sq)

def _phase(op,a):
    """turn a cut's teeth by a (radians about +Z): a gap where the sheet draws one"""
    op.phase=a;return op
def _flags(r,flags):r.flags=list(flags);return r

# ======================= 42010-1-01 winding pawl =======================
def windingPawl():
    H=HD()['wp'];src='42010-1-01';segs=H['outline']
    ops=[Plate(outline_face(segs),H['t'],'Cut the blank from 1.00 carbon steel and mill the outline to the coordinate table',
          [S('thickness',fx(H['t'],3),'+0/-.002 in',src+' #6')]+seg_sizes(segs,src,{0:'boss (#2)',1:'lower concave edge (#3, tangent to the boss)',3:'upper concave edge (#4)'})+[S('end face','a straight line, table rows 4 to 5, 0.1011 in','likely: drawn as a line',src+' #5')],src),
         Hole((0,0),H['hole'],'in',H['t'],None,'Drill and ream the pivot hole',[S('',f"Ø {fx(H['hole'],3)}",'+0/-.001 in',src+' #7'),S('on','the stud 42011, Ø .0400','',src)],src,key='pivot'),
         Countersink(H['t'],H['csk'],90,1,'Countersink it on the outer face',[S('',f"Ø {fx(H['csk'],3)} at the face, 45° (90° included)",None,src+' #8'),S('depth',f"{fx((H['csk']-H['hole'])/2,3)}",'derived',src)],src)]
    r=Recipe('windingPawl','42010','Winding pawl',src+' (5-13-41; memos 1-30-43, 3-13-43)','1.00 carbon steel','harden and draw; #00 crocus finish; oxidize black all over',
        [Setup('1','flat in a fixture on its pivot hole; the outline milled to the table, then drilled, reamed and countersunk',ops,view='top')],ID,
        notes=['42027 (the set-up pawl) is this outline at .048 thick.','Which face the countersink is on: the section shows it, its side as built here (the outer face) is not dimensioned.'],
        fits=['on the stud 42011 (.0400) in the sustaining ratchet wheel 42009, free: .042 +0/-.001 hole'])
    r.flat=True;return _flags(r,['The countersunk face: not dimensioned (estimated)'])

# ======================= 42170-2-01 barrel arbor =======================
def barrelArbor():
    H=HD()['bs'];src='42170-2-01';I=lambda x:x*25.4
    # lengths from the square's end (the sheet's left), its 1 November 2026 re-read: square to .410, pivot .1695 to .540, bearing .2295 to the left boss's outer
    # face, bosses .400 x .010 each side of the .520 body, .530 over them; .720 from that face to the right shoulder, 1.000 from .410 and .870 from .540 to it
    xs=I(.410)+H['span1000'];xb=xs-H['span720'];xr=xb+H['overBosses']
    r=lambda d:d/2
    P=[(0,0),(r(H['sqAC']),0),(r(H['sqAC']),H['sq']),(r(H['piv']),H['sq']),(r(H['piv']),H['sq']+H['pivL']),(r(H['bear']),H['sq']+H['pivL']),(r(H['bear']),xb),
       (r(H['boss']['d']),xb),(r(H['boss']['d']),xb+H['boss']['t']),(I(.271),xb+H['boss']['t']),(I(.271),xr-H['boss']['t']),(r(H['boss']['d']),xr-H['boss']['t']),
       (r(H['boss']['d']),xr),(r(H['bear']),xr),(r(H['bear']),xs),(r(H['piv']),xs),(r(H['piv']),H['len']),(0,H['len'])]
    # the body as 42170's end and side views draw it (the visual check, 2 November 2026): a circle whose bottom on the centre line steps out .022 to a tip (the .520 is
    # over that tip: the circle .498), an arc of 1.00 R from the tip back onto the circle .150 from the centre line; that lobe, the hook the mainspring's eye
    # catches on, only over the .120 band (its far edge .325 from the left boss's outer face), the rest of the body the plain circle. Seen from the square's
    # end (the sheet's end view) the arc runs to the right: -X in this frame
    s0,s1=xb+I(.325)-H['slot']['w'],xb+I(.325);rb=I(.249);rt=I(.271);xp=I(.150);yp=-math.sqrt(rb*rb-xp*xp)
    def spiral():
        z0,z1=xb+H['boss']['t'],xr-H['boss']['t'];P=lambda x,y,z=-0.01:bd.Vector(x,y,z)
        q0,q1=(0,-rt),(-xp,yp);mx,my=(q0[0]+q1[0])/2,(q0[1]+q1[1])/2;h=math.dist(q0,q1)/2;d=math.sqrt(1*25.4**2-h*h);nx,ny=-(q1[1]-q0[1])/(2*h),(q1[0]-q0[0])/(2*h)
        if nx*mx+ny*my>0:nx,ny=-nx,-ny   # the 1.00 R arc's centre inward, so the arc bulges out
        cx,cy=mx+nx*d,my+ny*d;am=math.atan2(my-cy,mx-cx);m=(cx+25.4*math.cos(am),cy+25.4*math.sin(am));ab=(math.atan2(yp,-xp)+math.atan2(-rb,0))/2
        ri=rb-0.05   # the lobe's inner side reaches into the circle (no faces shared)
        lobe=bd.Face(bd.Wire([bd.Edge.make_line(P(0,-ri,s0),P(0,-rt,s0)),bd.Edge.make_three_point_arc(P(0,-rt,s0),P(*m,s0),P(-xp,yp,s0)),bd.Edge.make_line(P(-xp,yp,s0),P(-xp*ri/rb,yp*ri/rb,s0)),bd.Edge.make_three_point_arc(P(-xp*ri/rb,yp*ri/rb,s0),P(ri*math.cos(ab),ri*math.sin(ab),s0),P(0,-ri,s0))]))
        keep=bd.Cylinder(rb,z1-z0+0.02,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((0,0,z0-0.01)))+bd.extrude(lobe,s1-s0,dir=(0,0,1))
        return bd.Cylinder(20,z1-z0,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((0,0,z0)))-keep
    ops=[Blank(H['bodyD']+0.4,0,H['len'],'Cut the blank from steel bar between centres',[S('length',fx(H['len'],2),'±.01 in',src+' #1'),S('bar','Ø about 13.6','not given: the .520 body and 0.2',src)],src),
         TurnProfile(P,'Turn the arbor: the square end as a round of the corners, the pivots, the bearings, the bosses and the body',
           [S('square end',f"Ø {fx(H['sqAC'],3)} (over the corners) for {fx(H['sq'],3)}",'+.005/-0 in',src+' #2'),
            S('left pivot',f"Ø {fx(H['piv'])} for {fx(H['pivL'],3)}",'+0/-.0003 in; polish',src+' #3'),
            S('bearings',f"Ø {fx(H['bear'])}, the left to the boss, the right {fx(xs-xr,3)} long",'+0/-.0003 in; polish',src+' #4'),
            S('bosses',f"Ø {fx(H['boss']['d'],3)} × {fx(H['boss']['t'],3)} each side of the body; {fx(H['overBosses'],3)} over both",'+0/-.002 in',src+' #6'),
            S('body (the spring collar)',f"turned Ø .542 for the hook, then milled (below)",'the .520 over the hook',src+' #9'),
            S('spans',f"{fx(H['span720'],3)} left boss face to the right shoulder; {fx(H['span870'],3)} from .540; {fx(H['span1000'],3)} from .410",'±.001, ±.002, ±.003 in',src+' #5, #6'),
            S('right pivot',f"Ø {fx(H['piv'])} for {fx(H['len']-xs,3)}",'+0/-.0003 in; polish',src+' #8')],src),
         TurnCone(r(H['piv'])-I(.005),H['sq'],r(H['piv']),H['sq']+I(.005),'Chamfer the left pivot at the shoulder',[S('','.005 × 45°',None,src+' #2')],src),
         Dome(0,H['sqAC'],-1,"Dome the square's end",[S('end','domed, polished','its radius not given: R .145 (estimated)',src+' #2')],src),
         Dome(H['len'],H['piv'],1,"Dome the right pivot's end",[S('end','domed, polished','its radius not given: R .1695 (estimated)',src+' #8')],src),
         MillSquare(H['sqAF'],0,H['sq'],'Mill the square',[S('',f"{fx(H['sqAF'],3)} across the flats",'+.004/-0 in',src+' #2'),S('length',fx(H['sq'],3),None,src+' #2')],src),
         Cut(spiral,"Mill the body: the circle Ø .498, and over the .120 band the hook: the .022 step on the centre line and the 1.00 R arc from its tip onto the circle",[S('over the hook',f"{fx(H['bodyD'],3)} (the circle .498 and the .022 step)",None,src+' #9, end view'),
            S('hook band',f"{fx(H['slot']['w'],3)} wide, its far edge {fx(I(.325),3)} from the left boss's outer face",'±.002 in',src+' #7'),S('arc','1.00 R from the tip to the circle .150 from the centre line',None,src+' end view: START SPIRAL'),
            S('','the 45° notch and the .010 × 45° of the end view and its detail: not cut','unsure what they are',src)],src)]
    rc=Recipe('barrelArbor','42170','Barrel arbor',src+' (memos 10-22-43, 4-29-44)','steel, "S.A.E. 10120" as written (probably 1020 or 10L20)','polish the pivots and bearings',
        [Setup('1','between centres; the square and the hook milled in a dividing head',ops)],ID,
        notes=["The hook is the end view's START SPIRAL: a .022 step and a 1.00 R arc standing out of the .498 circle over the .120 band, which the side view draws standing below the body's edge (the visual check). The mainspring's eye (1-WD-265's .200 slot) goes over it.",
               'The coils seat on the .520 body: a core radius of .260 in = 6.604 mm.'],
        fits=['the pivots .1695 +0/-.0003 in the barrel bridge and pillar plate','the barrel (42168) and its cap (42169) turn on the .2295 bearings: their bores .2300 +.0003/-0'])
    rc.notes.append("Not built: the 45° chamfers at the bearings' outer ends (about .012-.019, not dimensioned); the end view's 45° notch and the .010 × 45° its detail shows (the .090 and .210 lines are that detail's projection).")
    return _flags(rc,['Domed ends: radius not given (estimated)','The hook: the circle taken as .498 (the .520 over the tip), its arc meeting the circle at .150 (likely)','The 45° notch and the .010 detail: not cut (unsure)'])

# ======================= 42073-2-01 fourth wheel, 42072-1-01 fourth pinion =======================
def _spoke_windows(angles,R0,R1,wh,wr,t):
    """the windows between drawn spokes: each spoke's edges straight from its hub width wh (at R0) to its rim width wr (at R1); exact arcs on the hub and the rim"""
    def edge_pt(a,side,R):   # where the spoke's edge (side +1 left of its centre line) meets the circle R
        u=(math.cos(a),math.sin(a));nrm=(-u[1],u[0]);A=(R0*u[0]+side*wh/2*nrm[0],R0*u[1]+side*wh/2*nrm[1]);B=(R1*u[0]+side*wr/2*nrm[0],R1*u[1]+side*wr/2*nrm[1])
        d=(B[0]-A[0],B[1]-A[1]);a2=d[0]**2+d[1]**2;b2=2*(A[0]*d[0]+A[1]*d[1]);c2=A[0]**2+A[1]**2-R*R;s=(-b2+math.sqrt(b2*b2-4*a2*c2))/(2*a2)
        return (A[0]+s*d[0],A[1]+s*d[1])
    sol=None;n=len(angles)
    for j in range(n):
        a0=angles[j];a1=angles[(j+1)%n]+(2*math.pi if j==n-1 else 0)
        P=lambda q:bd.Vector(q[0],q[1],-0.01)
        p1,p2,p3,p4=edge_pt(a0,1,R1),edge_pt(a1,-1,R1),edge_pt(a1,-1,R0),edge_pt(a0,1,R0);am=(a0+a1)/2
        e=[bd.Edge.make_three_point_arc(P(p1),P((R1*math.cos(am),R1*math.sin(am))),P(p2)),bd.Edge.make_line(P(p2),P(p3)),
           bd.Edge.make_three_point_arc(P(p3),P((R0*math.cos(am),R0*math.sin(am))),P(p4)),bd.Edge.make_line(P(p4),P(p1))]
        x=bd.extrude(bd.Face(bd.Wire(e)),t+0.02,dir=(0,0,1));sol=x if sol is None else sol+x
    return sol
def fourthWheel():
    H=HD()['w4'];src='42073-2-01';z,m=H['z'],H['m'];rp=m*z/2;ha=(H['od']/2-rp)/m
    xy,ro,ri=gear_outline(z,m,mate=10,ha=ha);H['_tip']=2*ro
    A=sorted(math.radians(180-a)%(2*math.pi) for a in (0,H['gapUp'],H['gapUp']+H['gapRest'],H['gapUp']+2*H['gapRest'],360-H['gapDn']))   # the horizontal spoke on the left as 42073 draws it (audit A-8)
    with bd.BuildSketch() as sk:bd.Circle(H['od']/2+0.2)
    ops=[Plate(sk.sketch.faces()[0],H['t'],'Cut the blank from brass sheet',[S('thickness',fx(H['t'],3),'+0/-.002 in',src+' #11')],src),
         CutLeaves(xy,H['od']/2+0.3,0,H['t'],f'Cut the {z} teeth',[S('teeth',f'{z}, module {m:.4f} mm',None,src+' #1, #2'),S('over the tips',f"Ø {fx(H['od'])}",'+.0010/-.0020 in',src+' #4'),
            S('cutter','the same cutter as for the third wheel, 42071','42071 is not in the set',src+' #3'),
            S('tooth form',f"cycloidal (BS 978 Part 2: radial flanks, epicycloidal addendum for a 10-leaf pinion) run out to the drawn tips: the form reaches Ø {2*ro:.3f}",'estimated: the sheet gives no form','core.js gearOutline')],src,z=z),
         Cut(lambda:_spoke_windows(A,H['hubD']/2,H['rimId']/2,H['spokeHub'],H['spokeRim'],H['t']),'Cross it out: five spokes, tapered',
           [S('rim inside',f"Ø {fx(H['rimId'],3)}",None,src+' #5'),S('hub',f"Ø {fx(H['hubD'],3)}",None,src+' #6'),S('spokes',f"{fx(H['spokeHub'],3)} wide at the hub to {fx(H['spokeRim'],3)} at the rim",None,src+' #7, #8'),
            S('spoke angles','75° above and 72° below the horizontal spoke on the left, between centre lines',None,src+' #9, #10'),S('the other two',f"{H['gapRest']:.0f}° apart, evenly in the undrawn half",'not dimensioned (estimated)',src)],src,at=(0,0)),
         Hole((0,0),H['hubUp'],'in',H['t'],None,"Bore the hole for the pinion's collar",[S('',f"Ø {fx(H['hubUp'])}",'the collar .1000 ±.0003 through it (42072 #8)',src+' #12 (re-read 1 Nov 2026: a diameter)')],src,key='bore')]
    rc=Recipe('fourthWheel','42073','Fourth wheel',src+' (8-1-41; revised 8-11-41, 8-27-41; memos 11-24-41, 4-19-43)','brass','24K gold plate (the wheel only)',
        [Setup('1','on the wheel-cutting engine, then crossed out and bored',ops,view='top')],ID,
        fits=["riveted on the pinion 42072: on the leaves' top face, its collar .040 long through the bore, .005 proud (42073's side view)",'runout not to exceed .001 (#14)'],
        notes=[f"Tip reached by the tooth form: Ø {2*ro:.4f} mm against the drawn {H['od']:.4f} (+.0254/-.0508); the form's addendum is {ha:.3f} m.","The bore's countersink on the riveted face (42073's side view, not dimensioned) is not cut.","42073's side view draws an older pinion (its leaves about .150 long): 42072, redrawn, decides the pinion."])
    rc.flat=True;rc.od={'d':H['od'],'tol':[-.0020*25.4,.0010*25.4]};return _flags(rc,['Tooth form: estimated (BS 978 cycloidal; the sheet gives none)','The two spokes of the undrawn half: not dimensioned (estimated, 71° each)'])
def fourthPinion():
    H=HD()['p4'];T=H['st'];src='42072-1-01';z,m=H['leaves'],H['m'];rp=m*z/2;ext=H['tip']/2-(rp+0.525*m)
    xy,ro,ri=gear_outline(z,m,ext=ext)
    R=lambda d:d/2
    # the turned profile from the top pivot's tip (z 0) down, as the drawn-parts branch read the sheet (movement.js there, F4P's turn list): the stem's
    # diameters' places are its likely reading (the transcription's Verification: .0565 under the top cone, .0583 above the collar)
    # the turned profile from the top pivot's tip (z 0) down, as 42072 draws it (the visual check, 2 November 2026): each printed diameter where its arrows
    # stand, though the drawing keeps one width: .0565 under the top cone, the stem UNDERTURN to .0445, .0583 just above the collar (from .250, the line the
    # drawn-parts branch read); under the leaves a .0445 neck, the .060 shoulder, its 60° cone to the pivot; the lower pivot tapering .0311 to .0280 (A-4)
    I=lambda x:x*25.4;sh1=I(.110);nk=T['leavesEnd']+I(.015);cn=(R(H['lowSh'])-R(H['pivLow']))*math.sqrt(3)
    P=[(0,0),(R(H['pivTop']),0),(R(H['pivTop']),H['pivTopLen']),(R(H['stem']),H['pivTopLen']),(R(H['shTop']),T['coneEnd']),(R(H['shTop']),sh1),(R(H['stem']),sh1),(R(H['stem']),T['stemAbove']),
       (R(H['stemAbove']),T['stemAbove']),(R(H['stemAbove']),T['collarTop']),
       (R(H['collar'])-T['chamf'],T['collarTop']),(R(H['collar']),T['collarTop']+T['chamf']),(R(H['collar']),T['collarEnd']),(ro+0.02,T['collarEnd']),
       (ro+0.02,T['leavesEnd']),(R(H['lowStem']),T['leavesEnd']),(R(H['lowStem']),nk),(R(H['lowSh']),nk),(R(H['lowSh']),T['lowEnd']-cn),(R(H['pivLow']),T['lowEnd']),(R(H['pivTail']),H['len']),(0,H['len'])]
    ops=[Blank(H['tip']+0.3,0,H['len'],'Cut the blank from drill rod between centres',[S('length',fx(H['len'],3),None,src+' #17')],src),
         TurnProfile(P,'Turn the arbor: the pivots, the top shoulder with its 60° cone, the stem, the collar, the head of the pinion, the lower shoulder and cone',
           [S('top pivot',f"Ø {fx(H['pivTop'])} for {fx(H['pivTopLen'],3)}",'+0/-.0002 in; polish',src+' #3, #16'),S('top shoulder',f"Ø {fx(H['stem'])} flat, a 60° cone to Ø {fx(H['shTop'])}",'±.0005, ±.0003 in',src+' #4, #5, #14'),
            S('stem',f"Ø {fx(H['shTop'])} under the top cone to {fx(sh1,3)}, UNDERTURN to Ø {fx(H['stem'])}, Ø {fx(H['stemAbove'])} from {fx(T['stemAbove'],3)} to the collar",'±.0003, ±.0005, ±.0003 in; where each begins not dimensioned (estimated from the arrows)',src+' #4, #5, #6'),
            S('collar',f"Ø {fx(H['collar'])}, {fx(T['collarEnd']-T['collarTop'],3)} long, its top chamfered to a Ø .0990 flat",'±.0003 in; the chamfer likely',src+' #7, #8, #21'),
            S('leaves',f"{fx(T['leavesEnd']-T['collarEnd'],3)} long, from {fx(T['collarEnd'],3)} to {fx(T['leavesEnd'],3)} from the tip",None,src+' #18, #20 (lengths re-read 1 Nov 2026)'),
            S('lower shoulder',f"a Ø {fx(H['lowStem'])} neck under the leaves, the Ø {fx(H['lowSh'],3)} shoulder, its 60° cone to the pivot at {fx(T['lowEnd'],3)}",'±.0005, ±.002 in; the neck .015 long (estimated)',src+' #10, #11, #15, #19'),
            S('lower pivot',f"tapering from Ø {fx(H['pivLow'])} to Ø {fx(H['pivTail'])} at its end over {fx(H['len']-T['lowEnd'],3)}",'+0/-.0002, +0/-.0005 in; a taper, not a step (likely)',src+' #12, #13, #22')],src),
         CutLeaves(xy,ro+0.05,T['collarEnd'],T['leavesEnd'],f'Cut the {z} leaves and polish them',[S('leaves',f'{z}, module {m:.4f} mm',None,src+' #1, #2'),S('over the tips',f"Ø {fx(H['tip'])}",'+.0005/-.0010 in',src+' #9'),
            S('leaf form',f"round-tipped cycloidal leaf 1.05 m thick, its flanks run straight {ext:.3f} mm past the pitch circle to reach the drawn tips",'estimated: the sheet gives no form',"core.js gearOutline's o.ext (the drawn-parts branch)")],src,z=z)]
    rc=Recipe('fourthPinion','42072','Fourth pinion',src+' (redrawn; 7-31-57, 9-11-63)','drill rod','polish at five places: the top pivot, the stem, the pinion, the lower shoulder, the lower pivot',
        [Setup('1','between centres; the leaves cut on a pinion-cutting engine, the pivots finished in a Jacot tool',ops)],ID,
        fits=['the fourth wheel 42073 riveted on the collar (#13 of 42073)','meshes with the third wheel (THIRD WHEEL on the sheet)'],
        notes=["The drawn-parts branch found the drawn tips (.1290) mesh badly with the third wheel's generic teeth when the leaf is run out straight (91 % approach, a ripple 0.80-1.07): the model keeps the stock leaf there; built here as drawn (Review-results.md on that branch).",
               'UNDERTURN on the sheet: which stem diameter is the undercut is unsure (42072 transcription).'])
    rc.od={'d':H['tip'],'tol':[-.0010*25.4,.0005*25.4]};return _flags(rc,['Leaf form: estimated (the drawn tips need a leaf run out 0.09 mm)','Where the stem diameters change: not dimensioned (estimated from the arrows)',"The collar's top chamfer: its size unsure (.009 built; the sheet looks .017 by .011)"])

# ======================= ratchets: 42013 winding ratchet, 42026 set-up ratchet, 42009 sustaining ratchet wheel =======================
def ratchet_face(z,Ro,Ri,off,ang,hand=1):
    """a ratchet's outline as the sheets draw it: z teeth between the tips Ro and the roots Ri, each locking face on a line tangent to a circle of radius off
    about the centre (not radial), each ramp from a tip at ang degrees to its face down to the root circle, a root arc on to the next face's foot; exact
    lines and arcs. hand -1 mirrors it. Returns the face and the ramp's foot short of the next face (mm, the root land: negative if the ramp overruns)"""
    p=2*math.pi/z;dA=math.acos(off/Ro)-math.acos(off/Ri);P=lambda q:bd.Vector(q[0],hand*q[1],0);E=[];land=None
    pol=lambda r,a:(r*math.cos(a),r*math.sin(a))
    for k in range(z):
        th=k*p;T=pol(Ro,th);F=pol(Ri,th-dA);Fn=pol(Ri,th+p-dA)
        d1=(F[0]-T[0],F[1]-T[1]);L1=math.hypot(*d1);d1=(d1[0]/L1,d1[1]/L1);a=math.radians(ang);best=None
        for s in (1,-1):   # the ramp leaves the tip on the far side of the face from the gap: the side the next tooth lies
            c,sn=math.cos(s*a),math.sin(s*a);d2=(d1[0]*c-d1[1]*sn,d1[0]*sn+d1[1]*c)
            if -math.sin(th)*d2[0]+math.cos(th)*d2[1]>0:best=d2
        b=2*(T[0]*best[0]+T[1]*best[1]);cc=T[0]**2+T[1]**2-Ri*Ri;t=(-b-math.sqrt(b*b-4*cc))/2;G=(T[0]+t*best[0],T[1]+t*best[1])
        gA=math.atan2(G[1],G[0])%(2*math.pi);nA=(th+p-dA)%(2*math.pi);gap=((nA-gA+math.pi)%(2*math.pi)-math.pi)*Ri
        if land is None:land=gap
        E.append(bd.Edge.make_line(P(F),P(T)))
        if gap>1e-4:
            E.append(bd.Edge.make_line(P(T),P(G)));m=pol(Ri,gA+gap/Ri/2);E.append(bd.Edge.make_three_point_arc(P(G),P(m),P(Fn)))
        else:E.append(bd.Edge.make_line(P(T),P(Fn)))   # the ramp straight to the next foot (no root land)
    return bd.Face(bd.Wire(E)),land
def _ratchet_sizes(src,z,Ro,Ri,off,ang,land,items):
    return [S('teeth',str(z),None,f'{src} #{items[0]}'),S('over the tips',f'Ø {fx(2*Ro,3)}',None,f'{src} #{items[1]}'),S('root',f'Ø {fx(2*Ri,3)}',None,f'{src} #{items[2]}'),
            S('locking faces',f'each on a line {fx(off,3)} off the centre (not radial: {math.degrees(math.asin(off/Ri)):.1f}° off the radius at the root)','likely: the offset line read on 42013, the clearest',f'{src} #{items[3]}'),
            S('ramps',f'{ang}° to the face at the tip; root land {inch(land):.4f} in = {land:.3f} mm to the next face' if land>1e-4 else f'{ang}° to the face; no root land','likely: what the angle is measured between',f'{src} #{items[4]}'),
            S('hand',"as the plan draws it: the steep locking wall on the counter-clockwise side of each tip, the ramp falling away clockwise",None,src+' (audit B-1, D-2)')]
def windingRatchet():
    H=HD()['wr'];src='42013-1-01';f,land=ratchet_face(H['z'],H['od']/2,H['root']/2,H['offset'],H['ramp'],hand=-1);t=H['t']   # the sheet's hand (audit B-1)
    cb=(H['csk']-H['hole'])/2;cbd=H['cskDepth']-cb   # the .146 counterbore's straight wall, then the 45° cone to the .077 at .060 deep, the .077 land below it
    ops=[Plate(f,t,'Cut the blank from 1.00 carbon steel and cut the 40 teeth',[S('thickness',fx(t,3),'+0/-.002 in',src+' #10')]+_ratchet_sizes(src,H['z'],H['od']/2,H['root']/2,H['offset'],H['ramp'],land,(1,2,3,5,4)),src),
         Hole((0,0),H['bore'],'in',t,None,'Bore it',[S('',f"Ø {fx(H['bore'],3)}",'+.001/-0 in',src+' #6')],src,key='bore')]
    for i,x in enumerate((-H['pitch']/2,H['pitch']/2)):
        ops+=[Hole((x,0),H['hole'],'in',t,None,f'Drill screw hole {i+1}',[S('',f"Ø {fx(H['hole'],3)}",'±.001 in',src+' #9'),S('place',f"{fx(H['pitch'],3)} apart on the horizontal through the centre",None,src+' #7')],src,key=f's{i+1}'),
              Hole((x,0),H['csk'],'out',t,cbd,f'Counterbore and countersink it',[S('',f"Ø {fx(H['csk'],3)}, 45°, to {fx(H['cskDepth'],3)} deep; the .077 land below",'±.002 in; the depth likely',src+' #8, #11')],src)]
        from . import Cone
        ops.append(Cone((x,0),H['csk']/2,H['hole']/2,'out',t,cb,'',[],src,z0=t-cbd))
    rc=Recipe('windingRatchet','42013','Winding ratchet',src,'1.00 carbon steel','harden and draw; #00 crocus finish; oxidize black all over',[Setup('1','on the wheel-cutting engine; bored, drilled, counterbored',ops,view='top')],ID,
        fits=['on the fusee arbor (42022): .230 +.001/-0 over its .2295 body (inferred)','two screws through the counterbored holes (inferred)'])
    rc.flat=True;rc.od={'d':H['od'],'tol':[-.002*25.4,.002*25.4]};return _flags(rc,["The counterbore's straight wall depth: derived from the .060 and a 90° cone (likely)","Which face meets the pawls: not on the sheet (it decides the hand in the work)"])
def setupRatchet():
    H=HD()['sr'];src='42026-1-01';f,land=ratchet_face(H['z'],H['od']/2,H['root']/2,H['offset'],H['ramp'],hand=-1);t=H['t'];a=H['sqAF']/2   # the sheet's hand (HAMILTON-PARTS-LEDGER.md D-2)
    sq=lambda:bd.extrude(bd.Face(bd.Wire.make_polygon([bd.Vector(0,a*math.sqrt(2),-0.01),bd.Vector(-a*math.sqrt(2),0,-0.01),bd.Vector(0,-a*math.sqrt(2),-0.01),bd.Vector(a*math.sqrt(2),0,-0.01)],close=True)),t+0.02,dir=(0,0,1))
    ops=[Plate(f,t,'Cut the blank from steel SAE 1095 and cut the 40 teeth',[S('thickness',fx(t,3),'+0/-.002 in',src+' #10')]+_ratchet_sizes(src,H['z'],H['od']/2,H['root']/2,H['offset'],H['ramp'],land,(1,3,4,9,2)),src),
         Cut(sq,'Broach the square hole, turned 45° (a diamond as drawn)',[S('',f"{fx(H['sqAF'],3)} across the flats",'+.001/-0 in',src+' #5'),S('across the corners',f"{fx(H['sqAF']*math.sqrt(2),4)} sharp",f"≥ .155 MINIMUM (#6)",src+' #6')],src,at=(0,0))]
    rc=Recipe('setupRatchet','42026','Set-up ratchet',src,'steel, SAE 1095','nickel plate; a ray (finish-line) pattern on the face',[Setup('1','on the wheel-cutting engine; the square broached',ops,view='top')],ID,
        fits=["on the barrel arbor's square (42170: .110 +.004/-0 across the flats) (inferred)"],notes=['The finish lines (.220 R, .235) are surface marks: not cut.'])
    rc.flat=True;rc.od={'d':H['od'],'tol':[-.002*25.4,.002*25.4]};return _flags(rc,["The 65° does not agree with the tips, roots and .030 offset (the ramp comes out 73° to the face): the sheet not to scale there (unsure)","Its 40 teeth against the 42 counted on videos: the sheet's"])
def sustainingWheel():
    H=HD()['sw'];src='42009-2-01';f,land=ratchet_face(H['z'],H['od']/2,H['root']/2,H['offset'],H['ramp'],hand=-1);t=H['t']   # the sheet's hand (audit B-1)
    ops=[Plate(f,t,'Cut the blank from brass and cut the 120 teeth',[S('thickness',fx(t,3),'+0/-.002 in',src+' #6')]+_ratchet_sizes(src,H['z'],H['od']/2,H['root']/2,H['offset'],H['ramp'],land,(1,2,3,4,1)),src),
         Hole((0,0),H['bore'],'in',t,None,'Bore it; break the corner both sides',[S('',f"Ø {fx(H['bore'])}",'+.0003/-0 in',src+' #5'),S('corners','broken both sides','the amount not given',src+' #5')],src,key='bore')]
    what={2:'stud 42011 (.0400) for a winding pawl: press fit',7:'stud 42011 for the other pawl',11:'plain',12:'plain',6:'spring pin 35794 (.0498): press',10:'spring pin 35794: press',
          3:'pawl spring screw (.0440-130)',4:'pawl spring screw',8:'pawl spring screw',9:'pawl spring screw',5:"the sustaining spring's pin (42017): .060 at r .616 against the spring's pin .6156 from its centre (audit B)"}
    items={2:'#7',7:'#7',11:'#8',12:'#8',6:'#9',10:'#9',3:'#10',4:'#10',8:'#10',9:'#10',5:'#11'}
    from . import Cone
    for h in H['holes']:
        n=h['n'];x,y=h['c']
        ops.append(Hole((x,y),h['d'],'in',t,None,f'Drill hole {n} by the table',[S('',f"Ø {fx(h['d'])} at ({inch(x):+.4f}, {inch(y):+.4f}) in from the centre",'by the sheet',src+' '+items[n]),S('for',what[n],None,src)],src,key=n))
        if n in(3,4,8,9):ops.append(Cone((x,y),H['csk']/2,h['d']/2,'in',t,(H['csk']-h['d'])/2,f'Countersink hole {n} on the back face',[S('',f"Ø {fx(H['csk'],3)} at the back face, 45°",None,src+' #10 (hidden in the plan, the cone at the bottom of section A-A: audit B-2)')],src))
    rc=Recipe('sustainingWheel','42009','Sustaining ratchet wheel',src+' (6-18-41; revised 7-31-41; memos to 4-2-43)','brass','24K gold plate (the wheel only); X-fine circular line finish',
        [Setup('1','on the wheel-cutting engine; the holes on a jig borer by the table',ops,view='top')],ID,
        fits=['the winding pawls (42010) riveted on studs 42011 in holes 2 and 7: free to turn, about .002 endshake (#7)','on the fusee wheel\'s hub (its boss .2995): .3000 +.0003/-0 (inferred)'],
        notes=['The holes are by the sheet\'s table: every one but hole 5 has its image across the centre.','The countersinks are on the back face; the pawls on the plan face.'])
    rc.flat=True;rc.od={'d':H['od'],'tol':[0,.003*25.4]};return _flags(rc,["The bore's corners broken both sides: the amount not given (not cut)","Holes 11 and 12: their purpose not on the sheet"])

# ======================= 42015-2-01 fusee wheel, 42022-2-01 fusee arbor =======================
def fuseeWheel():
    H=HD()['fw'];src='42015-2-01';I=lambda x:x*25.4;R=lambda d:d/2;z,m=H['z'],H['m'];rp=m*z/2;ha=(H['od']/2-rp)/m
    xy,ro,ri=gear_outline(z,m,mate=14,ha=ha)
    tr=H['t']-H['toothStep'];dz=H['t']-H['discStep'];wb=H['rimWeb']
    # the section, z from the left face (the stepped recess's) to the rim land's right face, as its 1 November 2026 re-read has it
    d1=I(.055);d2=d1+I(.005);ch=I(.015)   # the audit's reading (A-2): the .600 recess's floor .055 (the .040 web from the disc's face at .095), the .470-.320 ring .005 deeper, the mouth chamfered .015
    P=[(R(H['bore']),d1),(R(H['stepC']),d1),(R(H['stepC']),d2),(R(H['stepB']),d2),(R(H['stepB']),d1),(R(H['stepA']),d1),(R(H['stepA']),ch),(R(H['stepA'])+ch,0),
       (ro+0.05,0),(ro+0.05,tr),(R(H['root']),tr),(R(H['root']),H['t']),(R(H['recess']),H['t']),(R(H['recess']),wb),(R(H['disc']),wb),(R(H['disc']),dz),(R(H['boss']),dz),
       (R(H['boss']),H['bossLen']),(R(H['bore']),H['bossLen'])]
    hx,hy=0,H['hole']['r']
    ops=[Blank(H['od']+0.4,0,H['bossLen'],'Cut the blank from brass',[S('','Ø about 41.4, .150 thick over the boss','not given',src)],src),
         TurnProfile(P,'Turn both faces: the rim land, the tooth ring .005 under it, the right recess and its web, the central disc, the boss; the left face\'s three steps',
           [S('rim land',f"{fx(H['t'],3)} thick, from Ø {fx(H['recess'],3)} to Ø {fx(H['root'],3)}",'+0/-.001 in',src+' #12, #4, #5'),S('tooth ring',f".005 under the rim land on the right face",None,src+' #13'),
            S('web',f"{fx(wb,3)} inside the Ø {fx(H['recess'],3)} recess",'+0/-.002 in',src+' #17'),S('central disc',f"Ø {fx(H['disc'],3)}, .005 under the rim land",'+0/-.005 in',src+' #6, #14'),
            S('boss',f"Ø {fx(H['boss'])}, to {fx(H['bossLen'],3)} from the left face",'+0/-.0003, +0/-.002 in',src+' #10, #15'),
            S('left face',f"a Ø .600 recess {fx(d1,3)} deep (the web .040 behind it), its mouth chamfered .015; between Ø .470 and Ø .320 a ring .005 deeper",'audit A-2: sure for the .055',src+' #7, #8, #9, #16, #18')],src),
         _phase(CutLeaves(xy,ro+0.1,-0.01,tr+0.01,f'Cut the {z} teeth',[S('teeth',f'{z}, module {m:.4f} mm',None,src+' #1, #2'),S('over the tips',f"Ø {fx(H['od'],3)}",'+.001/-.002 in',src+' #3'),
            S('tooth form',f"cycloidal (BS 978 Part 2) for the centre pinion of 14, run out to the drawn tips: the form reaches Ø {2*ro:.3f}",'estimated: the sheet gives no form','core.js gearOutline')],src,z=z),math.pi/2-0.875*2*math.pi/z),
         Bore(H['bore'],d1-0.01,H['bossLen']+0.01,'Bore it; break the corners both sides',[S('',f"Ø {fx(H['bore'])}",'+.0003/-0 in',src+' #11'),S('corners','broken both sides','the amount not given',src+' #21')],src),
         Hole((hx,hy),H['hole']['d'],'in',wb,None,'Drill the hole in the web',[S('',f"Ø {fx(H['hole']['d'],3)} at r {fx(H['hole']['r'])}",'±.001 in',src+' #19, #20'),S('angle','above the centre as drawn','its angle against the teeth not given',src)],src,key='web')]
    rc=Recipe('fuseeWheel','42015','Fusee wheel',src,'brass','24K gold plate',[Setup('1','in the chuck: both faces turned, then the teeth on the wheel-cutting engine; the hole drilled',ops)],ID,
        fits=['on the fusee arbor\'s .2295 body (inferred): .2300 +.0003/-0'],notes=[f"Tip reached by the tooth form: Ø {2*ro:.4f} mm against the drawn {H['od']:.4f}; the form's addendum is {ha:.3f} m.",
        "The .053 hole at r .610 (in the web) is likely the sustaining spring's pin's (42016)."])
    rc.od={'d':H['od'],'tol':[-.002*25.4,.001*25.4]};return _flags(rc,['Tooth form: estimated (BS 978 cycloidal; the sheet gives none)',"The teeth's phase: a gap on the hole's centre line (likely)",'Which .005 belongs to which face: likely'])
def fuseeArbor():
    H=HD()['fa'];A=H['at'];src='42022-2-01';R=lambda d:d/2;I=lambda x:x*25.4
    # 42022 (the audit, A-1, A-3): the body .2295 from the step to the collar, then .2500 from the collar to the shoulder at 1.250 (the knurl only on its first .080
    # after the .060 gap); the square's end domed (R .0725, its tip at 2.000), the .005 × 45° at the shank's corner where the round for the square begins
    P=[(0,0),(R(H['pressBore'])+I(.0005),0),(R(H['pressBore'])+I(.0005),A['pin']),(R(H['bear']),A['pin']),(R(H['bear']),A['step']),(R(H['bodyS']),A['step']),(R(H['bodyS']),A['collar0']),(R(H['collarD']),A['collar0']),
       (R(H['collarD']),A['collar1']),(R(H['bodyL']),A['collar1']),(R(H['bodyL']),A['shank']),(R(H['bear']),A['shank']),(R(H['bear']),A['sq']-H['chamf']),(R(H['bear'])-H['chamf'],A['sq']),
       (R(H['shankD']),A['sq']),(R(H['shankD']),A['end']),(0,A['end'])]
    xc=A['collar1']-H['holeToCollar']
    from . import Drill
    ops=[Blank(H['collarD']+0.4,0,H['len'],'Cut the blank from drill rod between centres',[S('length',fx(H['len'],3),None,src+' #1')],src),
         TurnProfile(P,'Turn the arbor: the spigot for 42018, the bearings, the body, the collar, the knurl\'s band, the shank, the round for the square',
           [S('spigot for 42018',f"Ø .0500 for {fx(A['pin'],3)}: 42018 pressed on it (its bore .0490)",'±.0002 in; likely',src+' #20'),
            S('bearings',f"Ø {fx(H['bear'])}, the left from {fx(A['pin'],3)} to {fx(A['step'],3)}, the shank {fx(H['shank'],3)}",'+0/-.0003 in; polish',src+' #5, #11, #14'),
            S('body',f"Ø {fx(H['bodyS'])}, {fx(H['body'],3)} from the step",'+0/-.0003, ±.001 in',src+' #3, #15'),S('collar',f"Ø {fx(H['collarD'],3)} × {fx(H['collarT'],3)}, its right face {fx(H['bodyLeft'],3)} from the step",'±.001 in',src+' #6, #8, #16'),
            S('body right of the collar',f"Ø {fx(H['bodyL'])} from the collar to the shoulder at {fx(A['shank'],3)}; the knurl on {fx(H['knurlW'],3)} of it, {fx(H['gap'],3)} after the collar",'±.0002 in',src+' #9, #10, #17 (audit A-1)'),S('round for the square',f"Ø {fx(H['shankD'],3)} × {fx(H['square'],3)}",'+.005/-0 in',src+' #12, #19')],src),
         MillSquare(H['sqAF'],A['sq'],A['end']+0.01,'Mill the square',[S('',f"{fx(H['sqAF'],3)} across the flats",'+.004/-0 in',src+' #18')],src),
         Dome(A['end'],R(H['shankD']),1,"Dome the square's end",[S('end',f"round, R {fx(R(H['shankD']))}, its tip at {fx(A['end'],3)}",'the sheet draws it (audit A-3)',src)],src),
         Drill((-5,0,xc),(1,0,0),H['cross'],10,'Drill and taper broach the cross hole for the taper pin 42020',[S('',f"Ø {fx(H['cross'],3)}",'+0/-.001 in',src+' #21'),S('place',f"{fx(H['holeToCollar'],3)} from the collar's right face",'±.001 in',src+' #7')],src,key='cross')]
    rc=Recipe('fuseeArbor','42022','Fusee arbor',src,'drill rod','polish the bearings and the shank; straight knurl, about 100 teeth an inch, on .080 of the .2500 body',
        [Setup('1','between centres; the square milled and the cross hole drilled in a fixture; the knurl rolled',ops)],ID,
        fits=['the fusee wheel (42015, its bore .2300) on the .2295 body left of the collar (inferred: only there does a .230 bore fit)','42018 pressed on the .0500 spigot (likely)','the winding ratchet (42013, its bore .230) on the .2295 body left of the collar (inferred)'],
        notes=['The knurl (straight, about 100 a inch) is a note, not cut in the solid: the band is turned to its .2500.'])
    return _flags(rc,['The left end: a .0500 spigot that 42018 presses on (likely)','Knurl: not modelled (a note)','The cross hole along a corner of the square (the square a diamond as drawn): likely'])

# ======================= 42168 barrel, 42169 barrel cap =======================
def _centre(H,zfloor):
    """the barrel's and cap's centre as both sheets draw it (the audit, C-2): the bore's mouth on the outer face chamfered .010 × 45°; the boss's flat top Ø .340
    standing to bossH from the outer face, a 45° cone from it down to the floor's inside; a 60° V-groove .025 deep on Ø .320 in the outer face (TurnAway)"""
    R=lambda d:d/2;rb,rt=R(H['bore']),R(H['bossTop']);rf=rt+(H['bossH']-zfloor)
    return [(rb,H['land']),(rb+H['land'],0)],[(rf,zfloor),(rt,H['bossH']),(rb,H['bossH'])]
def _vgroove(src):
    I=lambda x:x*25.4;c=I(.160);w=I(.025)*math.tan(math.radians(30))
    return TurnAway([(c-w-0.001,-0.01),(c+w+0.001,-0.01),(c+w,0),(c,I(.025)),(c-w,0)],'Turn the V-groove in the outer face',[S('',f'60° included, .025 deep, on Ø .320',None,src+' (audit C-2: likely, the extension lines through its tip)')],src)
def barrel():
    H=HD()['ba'];src='42168-2-01';R=lambda d:d/2;I=lambda x:x*25.4
    body,lip=H['lipD'],H['od']   # 42168: the body 1.650, the lip at the open end 1.710 (the audit, C-1: hdims.js's od and lipD name them the other way round)
    outer,inner=_centre(H,H['floor'])
    P=outer+[(R(body),0),(R(body),H['h']-H['lipH']),(R(lip),H['h']-H['lipH']),(R(lip),H['h']),(R(H['id']),H['h']),(R(H['id']),H['floor'])]+inner
    from . import Drill
    ops=[Blank(lip+0.4,0,H['h'],'Cast the blank in yellow brass',[S('','cast','',src)],src),
         TurnProfile(P,'Turn it: the outside, the lip at the open end, the bore, the floor, the centre boss and its cone, the bore mouth',
           [S('body',f"Ø {fx(body,3)}",'±.003 in',src+' #5 (audit C-1)'),S('lip',f"Ø {fx(lip,3)} for the last {fx(H['lipH'],3)} at the open end",'±.003 in; .080 at the top of the section, .090 +0/-.005 at the bottom (unsure)',src+' #2, #4, #16 (audit C-1)'),
            S('bore',f"Ø {fx(H['id'],3)}",'+.002/-0 in',src+' #6'),S('height',fx(H['h'],3),'±.002 in',src+' #1'),S('floor',fx(H['floor'],3),'±.001 in',src+' #3'),
            S('boss',f"its top Ø {fx(H['bossTop'],3)} at {fx(H['bossH'],3)} from the floor's outside face, a 45° cone to the floor; the bore's mouth outside .010 × 45°",'+.002/-0 in; likely',src+' #9, #11, #12')],src),
         _vgroove(src),
         Bore(H['bore'],-0.01,H['bossH']+0.01,'Bore the centre hole',[S('',f"Ø {fx(H['bore'])}",'+.0003/-0 in',src+' #10'),S('','concentric with the outside and the bore',None,src)],src)]
    th={'d':H['screw']['d'],'p':25.4/H['screw']['tpi'],'D1':H['screw']['d']-1.0825*25.4/H['screw']['tpi'],'H1':0.5413*25.4/H['screw']['tpi']}
    for k in range(5):
        a=math.radians(90+72*k);x,y=R(H['pitch'])*math.cos(a),R(H['pitch'])*math.sin(a)
        ops.append(Drill((x,y,H['h']+0.01),(0,0,-1),th['D1'],I(.100)+0.01,f'Drill and tap screw hole {k+1} for the cap',[S('',f".0340-130 (tap drill Ø {th['D1']:.3f}), close fit",None,src+' #8'),S('place',f"on Ø {fx(H['pitch'],3)} in the lip, 72° apart, one at 12 o'clock",None,src+' #7'),S('depth','.100','not given (estimated; the section draws about that)',src)],src,thread=th,key=f'c{k+1}'))
    ra=-math.pi/2;ops.append(Drill((0,0,H['rivet']['x']),(math.cos(ra),math.sin(ra),0),H['rivet']['d'],R(lip)+0.5,"Drill the anchor rivet's hole through the wall",[S('',f"Ø {fx(H['rivet']['d'],3)} for the rivet 42042, finished flush outside, its flat side as the detail shows",None,src+' #13'),
        S('place',f"at 6 o'clock in the plan, {fx(H['rivet']['x'],3)} from the floor's outside face",'sure',src+' #15')],src,key='rivet'))
    x5=-H['small']['r'] if 'r' in H['small'] else -I(.520);yo=-math.sqrt(R(H['id'])**2-x5**2)+0.3;L=math.sqrt(R(lip)**2-x5**2)+0.5
    ops.append(Drill((x5,yo,H['small']['x']),(0,-1,0),H['small']['d'],L,'Drill the small hole through the wall',[S('',f"Ø {fx(H['small']['d'],3)}",'+0/-.003 in',src+' #14'),
        S('place',f"its axis parallel to the plan's vertical, .520 left of the centre, {fx(H['small']['x'],3)} from the floor's outside face",'±.010 in (audit C-5: the .520 ±.010 locates it)',src+' #14')],src,key='small'))
    rc=Recipe('barrel','42168','Mainspring barrel',src+' (9-10-41; memos to 4-30-43)','cast yellow brass','24K gold plate',[Setup('1','in the chuck: turned and bored at one setting (the outside and bore concentric with the centre hole); the holes drilled in a dividing head',ops)],ID,
        fits=["on the barrel arbor's .2295 bearing: .2300 +.0003/-0",'the cap (42169) with its step on the end, its spigot in the 1.500 bore; five .0340-130 screws in the lip'],
        notes=['The anchor rivet 42042 is not in the set: its hole only.',"What the first reading took for a notch in the wall at 8 o'clock is the plan's section break with a CORNER note (audit C-5)."])
    return _flags(rc,['The lip: .080 or .090 (the sheet gives both)','The outer face: a V-groove on Ø .320 (likely)','Tapped holes\' depth: not given (estimated .100)'])
def barrelCap():
    H=HD()['cp'];src='42169-2-01';R=lambda d:d/2;I=lambda x:x*25.4;fl=I(.030)   # the flange .030 ±.001 (the audit, C-3: the .0360 is the screw hole)
    outer,inner=_centre(H,H['t'])
    P=outer+[(R(H['od']),0),(R(H['od']),fl),(R(H['spigot']),fl),(R(H['spigot']),H['t'])]+inner
    from . import Cone
    ops=[Blank(H['od']+0.4,0,H['bossH'],'Cut the blank from rolled yellow brass (Scovill #187)',[S('','rolled sheet','',src)],src),
         TurnProfile(P,'Turn it: the flange, the spigot, the plate, the boss and its cone, the bore mouth',[S('outside',f"Ø {fx(H['od'],3)}",'±.003 in',src+' #1'),S('spigot',f"Ø {fx(H['spigot'],3)}, the plate {fx(H['t'],3)} at it",'+0/-.001, ±.001 in',src+' #2, #4'),
            S('flange',f"{fx(fl,3)} thick",'±.001 in',src+' #5 (audit C-3)'),S('boss',f"{fx(H['bossH'],3)} from the outer face, its top Ø .340; the bore's mouth outside .010 × 45°",'+.001/-0 in; likely',src+' #6, #8')],src),
         _vgroove(src),
         Bore(H['bore'],-0.01,H['bossH']+0.01,'Bore the centre hole',[S('',f"Ø {fx(H['bore'])}",'+.0003/-0 in',src+' #7')],src)]
    d=I(.0360);c=I(.058)
    for k in range(5):
        a=math.radians(180+72*k);x,y=R(H['pitch'])*math.cos(a),R(H['pitch'])*math.sin(a)
        ops+=[Hole((x,y),d,'in',fl,None,f'Drill screw hole {k+1}',[S('',f"Ø {fx(d,4)}",'±.0005 in',src+' #5 (audit C-4)'),S('place',f"on Ø {fx(H['pitch'],3)}, 72° apart, one at 9 o'clock",None,src+' #3')],src,key=f'c{k+1}'),
              Cone((x,y),c/2,d/2,'in',fl,(c-d)/2,f'Countersink it on the outer face',[S('',f"Ø {fx(c,3)} at the face, 45°",None,src+' (audit C-4)')],src)]
    rc=Recipe('barrelCap','42169','Barrel cap',src,'rolled yellow brass, Scovill #187','24K gold plate; break all corners',[Setup('1','in the chuck; the holes in a dividing head',ops)],ID,
        fits=["its spigot in the barrel's 1.500 bore (+0/-.001 on 1.500 +.002/-0), its step on the barrel's end","on the barrel arbor's .2295 bearing: .2300 +.0003/-0",'its holes turned to the barrel\'s: the cap sheet draws one at 9 o\'clock, the barrel\'s at 12'])
    return _flags(rc,['The outer face: a V-groove on Ø .320 (likely)'])

# ======================= springs and pawls by their tables: 42007, 42028, 42016, 42096, 42027 =======================
def _flat(key,hn,title,src,mat,treat,H,t,holes,notes=(),fits=(),flags=(),mirror=False,arcs=None):
    segs=H['outline'];f=outline_face(segs)
    if mirror:f=f.mirror(bd.Plane.YZ);holes=[((-x,y),d,w,it) for (x,y),d,w,it in holes]
    ops=[Plate(f,t,f'Cut the blank and mill the outline to the coordinate table'+(' (42007 mirrored)' if mirror else ''),[S('thickness',fx(t,3),'+0/-.002 in',src)]+seg_sizes(segs,src,arcs),src)]
    for i,(at,d,w,it) in enumerate(holes):ops.append(Hole(at,d,'in',t,None,f'Drill the {w}',[S('',f'Ø {fx(d)}',None,it)],src,key=f'h{i}'))
    r=Recipe(key,hn,title,src,mat,treat,[Setup('1','flat in a fixture on its holes; the outline milled to the table',ops,view='top')],ID,notes=list(notes),fits=list(fits))
    r.flat=True;return _flags(r,flags)
def windingPawlSpring():
    H=HD()['wps'];src='42007-2-01';hs=H['holes'];TAP=H['screw']-1.0825*25.4/130   # the screws come up from the wheel's back (42009's countersinks 3, 4, 8, 9) into these tapped holes
    r=_flat('windingPawlSpring','42007','Winding pawl spring',src,'beryllium copper','24K gold plate',H,H['t'],
        [(tuple(hs[0]['c']),H['pin'],'hole for the pin 35794 (.0498)',src+' #10'),(tuple(hs[1]['c']),TAP,"hole 16, tapped .0440-130 (tap drill: the thread's minor diameter)",src+' #11: TAP FOR .0440-130 SCREW (the visual check)'),(tuple(hs[2]['c']),TAP,'hole 17, tapped .0440-130',src+' #11')],
        notes=[f"The blade is {fx(H['blade'],3)} wide (±.001): the two .4700 and .4550 R arcs about one centre (#2, #3) leave it.",'Holes 1, 16, 17 land on the sustaining wheel\'s holes 10, 9, 8 (or 6, 4, 3): the .4150 circle.'],
        fits=['screwed to the sustaining ratchet wheel (42009) by two .0440-130 screws, located by the pin 35794 pressed in it'],
        flags=["Holes 16 and 17 tapped .0440-130: drawn at the tap drill (the thread a note)"],arcs={0:'outer edge (#2)',1:'tip (#9)',2:'#8',3:'inner edge (#3)',4:'#5',5:'#4',6:'corner (#7)',7:'#5'})
    for o in r.ops():
        if isinstance(o,Hole) and o.key in ('h1','h2'):o.thread={'d':H['screw'],'p':25.4/130,'D1':TAP,'H1':0.5413*25.4/130}
    return r

def setupPawlSpring():
    H=HD()['wps'];src='42028-2-01';hs=H['holes']
    return _flat('setupPawlSpring','42028','Set-up pawl spring',src,'beryllium copper (as 42007)','nickel plate; #1 emery finish',H,H['t'],
        [(tuple(hs[0]['c']),H['pin'],'hole for the pin 35794 (.0498), pressed flush with the top','42028 #2'),(tuple(hs[2]['c']),H['pin'],'second pin hole (the sheet draws both alike, complete with pins)','42028 #5 (point 17)')],mirror=True,
        notes=["\"For other dimensions see part #42007\": its three table rows (1, 3, 17) are 42007's mirrored about the pin's vertical (x' = 4.0000 - x), so the outline is 42007's mirrored.",'Point 16 (42007\'s second screw hole) is not on 42028\'s table: two holes here, both for pins (the sheet: complete with pins).'],
        fits=['the pin 35794 pressed flush with the top'],flags=["42007's outline mirrored: the table's three rows agree, the rest is by \"see 42007\" (likely)","Hole 17 at the pin's size: likely (both drawn alike)"])
def setupPawl():
    H=HD()['wp'];I=lambda x:x*25.4;src='42027-1-01'
    r=_flat('setupPawl','42027','Set-up pawl',src+' (for other dimensions see 42010)','1.00 carbon steel','polish',H,I(.048),[((0,0),H['hole'],'pivot hole, plain','42027 #1 (.042 +0/-.001)')],mirror=True,
        notes=["For other dimensions see part #42010: the winding pawl's outline, which 42027 draws pointing the other way (mirrored), at .048 thick.","Its section shows a plain .042 bore: no countersink (42010 has one)."],
        fits=['on its stud in the barrel bridge, not in the set (inferred)'],flags=['No countersink: the section shows a plain bore (likely)'],arcs={0:'boss (42010 #2)',1:'lower concave edge (42010 #3)',3:'upper concave edge (42010 #4)'})
    for o in r.ops():
        if isinstance(o,Plate):o.sizes[0]=S('thickness','0.048 in = 1.219 mm','+0/-.002 in','42027 #2')
    return r
def sustainingSpring():
    H=HD()['ss'];src='42016-2-01';hs={h['n']:h for h in H['holes']};I=lambda x:x*25.4
    r=_flat('sustainingSpring','42016','Sustaining spring',src,'1.00 carbon steel','oxidize black',H,H['t'],
        [(tuple(hs[1]['c']),I(.0495),'hole for the pin 42017 (.0500), pressed',src+' #10'),(tuple(hs[9]['c']),I(.0495),'hole for the other pin 42017',src+' #10'),(tuple(hs[13]['c']),H['hole13'],'plain hole 13',src+' ±.001')],
        notes=['The pins 42017 (.0500) in holes 1 and 9 stand out of opposite faces (the side views); their length is not given.','Its centre (row 5, and 11) is the fusee wheel\'s axis.',f"Rim widths .080, .070, .058 (upper left, right, lower right) come from the table's arcs.",'The pins: pin 1 stands about .072 out of the back face into the fusee wheel, pin 9 about .05 out of the front into the sustaining wheel (measured, unsure).'],
        fits=['the pins 42017 press fit in holes 1 and 9'],flags=["Holes 1 and 9: no size printed (a press fit for .0500 pins; built .0495, estimated)","The bottom edge's .005 chamfer: not cut"])
    class Ch(Op):
        kind='mill'
        def apply(self,p):   # the outer (R .7000) edge of the back face, chamfered .005 × 45°
            E=[e for e in p.edges() if e.geom_type==bd.GeomType.CIRCLE and abs(e.radius-H['outline'][0]['r'])<0.02 and abs(e.bounding_box().max.Z)<1e-6]
            return p.chamfer(H['edge'],None,E)
    r.setups[0].ops.append(Ch('Chamfer the outer edge of the back face',[S('','.005 × 45°, the back face only',None,src+' (audit B-3)')],src))
    r.flags=[f for f in r.flags if 'chamfer' not in f]
    return r
def sustainingPawl():
    H=HD()['sp'];src='42096-2-01'
    r=_flat('sustainingPawl','42096','Sustaining pawl',src,'1.00 carbon steel','polish the contour and the marked face',H,H['t'],[(tuple(H['holeAt']),H['springHole'],"spring wire's hole (taper broached for a drive fit)",src+' #8'),((0,0),25.4*.050,'pivot hole for the arbor 42097','measured off the drawing about .050 (not dimensioned: audit B-4)')],
        notes=['Staked on its arbor 42097 (a .090 collar; not in the set); the spring wire 42098 drives into the .020 hole (its size not given).','The pivot hole is drawn (three circles about .050, .071 and .091: the hole, a seat, the .090 collar) but not dimensioned: drilled .050 as measured.'],
        fits=['staked on the arbor 42097'],flags=['Pivot hole Ø .050: measured off the drawing, not dimensioned','Tip (rows 5 to 6) a straight line: likely'],arcs={0:'outer convex edge (#3)',2:'inner concave edge (#4)',3:'boss (#2)'})
    for o in r.ops():
        if isinstance(o,Plate):o.sizes[0]=S('thickness',fx(H['t'],3),'±.001 in',src+' #6')
    return r

# ======================= the chain: 42005 centre link, 42004 link pin, 42002 and 42003 hooks =======================
def _link(key,hn,title,src,notes,fits,flags,mat,treat):
    H=HD()['cl'];I=lambda x:x*25.4;c=I(.002)
    r=_flat(key,hn,title,src,mat,treat,H,H['t'],[(tuple(H['holes'][0]),H['hole'],'pin hole','42005-1-01'),(tuple(H['holes'][1]),H['hole'],'second pin hole, at the .0940 pitch','42005-1-01')],notes=notes,fits=fits,flags=flags)
    from . import Cone
    for i,h in enumerate(H['holes']):
        for f in ('in','out'):r.setups[0].ops.append(Cone(tuple(h),H['hole']/2+c,H['hole']/2,f,H['t'],c,f"Break hole {i+1}'s edge on the {'first' if f=='in' else 'second'} face",[S('','.002 × 45° (estimated)','CORNER HOLES BOTH SIDES: its size not given','42005-1-01')],src))
    return r
def centreLink():
    return _link('centreLink','42005','Fusee chain centre link','42005-1-01',['148 in a chain (42001), one in each even space, between the outer plates of its two neighbours.','Its four .0425 R arcs are all tangent (the table).'],
        ['the link pins 42004 (.0240) free in its .0250 holes: links must flex freely about pins with minimum clearance (42001)'],['Hole edges broken .002 × 45°: the size not given (estimated)'],'1.00 carbon steel','hardened and drawn after assembling (42001)')
def outerLink():
    return _link('outerLink','42246','Fusee chain outer plate (assumed)','42246: not in the set; 42001 draws it as 42005',["42246's own sheet is not in the set. 42001 shows it in pairs on the odd spaces with the centre link's figure-eight outline and the same thickness in the stack (3 × .0095 = .0285, 42001's .030 most): built as 42005, assumed.",
        'The pins are riveted flush into its chamfered hole mouths (42001).'],['the pins 42004 riveted in it, flush (42001)'],["Its outline, thickness and holes: assumed (42005's): 42246 is not in the set"],"not given (42005's: 1.00 carbon steel)",'hardened and drawn after assembling (42001)')
def linkPin():
    H=HD()['pn'];src='42004-1-01'
    ops=[Blank(H['d'],0,H['len'],'Cut from drill rod',[S('',f"Ø {fx(H['d'])} × {fx(H['len'],3)}",'±.0003, +.001/-0 in',src+' #1, #2')],src)]
    return _flags(Recipe('linkPin','42004','Fusee chain link pin',src,'drill rod','do not harden (the chain is hardened after riveting); riveted flush with the links',[Setup('1','parted off',ops)],ID,
        notes=['298 in a chain (42001).'],fits=['riveted in the outer links, free in the centre link']),[])
def _hook(key,hn,title,src,segs,H,notes,flags):
    I=lambda x:x*25.4;tb,tt=H['tBody'],H['tThin'];x0=H['step']
    def thin():   # the link end, thinned on both faces to .0095 about the middle, up to the step .050 from the pin hole's centre
        e=(tb-tt)/2;c=H['chamf']
        cut=bd.Box(10,10,e+0.01,align=(bd.Align.MAX,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((x0,0,-0.01)))+bd.Box(10,10,e+0.01,align=(bd.Align.MAX,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((x0,0,tb-e)))
        def wedge(z,s):   # the step's 45° chamfer: from the thin face .003 short of the step to the step's wall .003 off that face (left standing in the corner)
            f=bd.Face(bd.Wire.make_polygon([bd.Vector(x0-c,-5,z),bd.Vector(x0+1e-4,-5,z),bd.Vector(x0+1e-4,-5,z-s*c)],close=True));return bd.extrude(f,10,dir=(0,1,0))
        return cut-wedge(e,1)-wedge(tb-e,-1)
    ops=[Plate(outline_face(segs),tb,'Cut the blank from 1.00 carbon steel and mill the outline to the coordinate table',[S('thickness',f"body {fx(tb)}",'±.0005 in',src)]+seg_sizes(segs,src),src),
         Hole((0,0),H['hole'],'in',tb,None,'Drill the pin hole',[S('',f"Ø {fx(H['hole'])}",'+0/-.0005 in',src)],src,key='pin'),
         Cut(thin,'Mill the link end down on both faces',[S('',f"{fx(tt)} thick up to {fx(x0,3)} from the pin hole's centre",'+0/-.0005, +.005/-0 in',src),S('step','.003 × 45° at the step, on both faces',None,src+' (and 42003, the same step unnumbered)')],src)]
    r=Recipe(key,hn,title,src,'1.00 carbon steel','do not harden',[Setup('1','flat in a fixture; the outline to the table; the end milled thin',ops,view='top')],ID,notes=notes,fits=['its thin end takes a link pin like a centre link'])
    r.flat=True;return _flags(r,flags)
def barrelHook():
    H=dict(HD()['hk2']);return _hook('barrelHook','42002','Fusee chain hook, barrel end','42002-1-01',H['outline'],H,['The hook catches the barrel\'s hook; 42001 gives .030 the most thick.'],[])
def fuseeHook():
    H=dict(HD()['hk2']);H['outline']=HD()['hk3']['outline']
    return _hook('fuseeHook','42003','Fusee chain hook, fusee end','42003-1-01',H['outline'],H,["42002's outline with the tail removed at point 19 (42003's sheet)."],[])

# ======================= 42087 detent: the blank (-2-51A) and its milling and grinding (-1-52) =======================
def detentBlank():
    H=HD()['dt'];src='42087-2-51A';src2='42087-1-52';I=lambda x:x*25.4;W,t=H['w'],H['t']
    def box(x0,x1,y0,y1,z0=-0.01,z1=None):return bd.Box(x1-x0,y1-y0,(z1 if z1 is not None else t+0.01)-z0,align=(bd.Align.MIN,bd.Align.MIN,bd.Align.MIN)).moved(bd.Location((x0,y0,z0)))
    with bd.BuildSketch() as sk:bd.Rectangle(H['len'],W,align=(bd.Align.MIN,bd.Align.MIN))
    sl=H['slot'];wi=H['window'];tn=H['topNotch'];bp=tn['bump'];es=H['endSlot']
    def slot():
        r=sl['w']/2;L=sl['l']-sl['w'];c=bd.Cylinder(r,t+0.02,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN))
        return (c.moved(bd.Location((sl['x']-L/2,sl['y'],-0.01)))+c.moved(bd.Location((sl['x']+L/2,sl['y'],-0.01)))+box(sl['x']-L/2,sl['x']+L/2,sl['y']-r,sl['y']+r))
    def notch():return box(tn['x0'],bp['x0'],tn['floor'],W+1)+box(bp['x0'],bp['x1'],bp['h'],W+1)+box(bp['x1'],tn['x1'],tn['floor'],W+1)
    def bottom():return sum((box(c['x0'],c['x1'],-1,c['depth']) for c in H['botCuts'][1:]),box(H['botCuts'][0]['x0'],H['botCuts'][0]['x1'],-1,H['botCuts'][0]['depth']))
    def grind():e=(t-H['tFin'])/2;return box(-1,H['len']+1,-1,W+1,-1,e)+box(-1,H['len']+1,-1,W+1,t-e,t+1)
    def mill():e=(W-H['wFin'])/2;return box(-1,H['len']+1,-1,e)+box(-1,H['len']+1,W-e,W+1)
    ops=[Plate(sk.sketch.faces()[0],t,'Blank (operation 61): beryllium copper strip',[S('length',fx(H['len'],3),'±.002 in',src+' #1'),S('width',fx(W,3),'+.002/-0 in',src+' #2'),S('thickness',fx(t,3),'±.001 in',src+' #3')],src),
         Hole((H['hole']['x'],H['hole']['y']),H['hole']['d'],'in',t,None,'Pierce the foot hole',[S('',f"Ø {fx(H['hole']['d'])}",'+.0002/-0 in',src+' #4'),S('place',f"{fx(H['hole']['x'],3)} from the foot end, on the centre line",'+.002/-0 in',src+' #5, #6')],src,key='foot'),
         Cut(slot,'Pierce the round-ended slot',[S('',f"{fx(sl['l'],3)} × {fx(sl['w'],3)}",'+0/-.001 in',src+' #7'),S('centre',f"{fx(sl['x'])} from the foot end",'+.0002/-0 in',src+' #8, #9')],src),
         Cut(lambda:box(wi['x0'],wi['x1'],wi['h'],wi['h']+wi['top']),'Pierce the window',[S('',f"{fx(wi['l'],3)} long × {fx(wi['top'],3)} high",'+.001/-0 in',src+' #11'),S('place',f"its bottom {fx(wi['h'])} above the bottom edge (the web), its top .032 under the top edge; its right end .3535 from the slot's centre",'+.0005/-0 in',src+' #10, #11, as the audit reads them (HAMILTON-PARTS-LEDGER.md D-1)')],src),
         Cut(notch,'Pierce the top notch with its raised step',[S('floor',f"{fx(tn['floor'],3)} above the bottom edge from {fx(tn['x0'],4)} to {fx(tn['x1'],4)}",'+.002/-0 in',src+' #12, #13, #15'),S('step',f"{fx(bp['h'],3)} high over {fx(bp['x0'],4)}-{fx(bp['x1'],4)}",'±.001 in; .079 printed, the drawing\'s scale .075 (unsure)',src+' #14')],src),
         Cut(bottom,'Pierce the two bottom cuts',[S('',f"{fx(H['botCuts'][0]['x1']-H['botCuts'][0]['x0'],3)} and {fx(H['botCuts'][1]['x1']-H['botCuts'][1]['x0'],3)} wide, {fx(H['botCuts'][0]['depth'],3)} deep",'+0/-.002 in; the depth from the .038 web (likely)',src+' #18, #20')],src),
         Cut(lambda:box(es['floorX'],H['len']+1,W/2-es['w']/2,W/2+es['w']/2),'Pierce the end slot',[S('',f"{fx(es['w'])} wide, its floor {fx(es['floorX'])} from the foot end",'+.0002/-0 in',src+' #17')],src),
         Cut(grind,'Surface grind the flat sides (operation 65)',[S('thickness',fx(H['tFin'],3),'+0/-.001 in',src2+' #2')],src2),
         Cut(mill,'Mill each edge (operation 66)',[S('width',fx(H['wFin'],3),'no tolerance printed',src2+' #3'),S('','.0045 off each edge (derived; likely symmetric)',None,src2)],src2)]
    r=Recipe('detentBlank','42087','Detent, blank milled and ground',src+' (7-4-44) and '+src2+' (8-3?-48)','beryllium copper','corner the foot hole (operation 63, its size not given)',
        [Setup('1','blank and pierce in a press (operation 61)',ops[:7],view='top'),Setup('2','surface grind both sides, then mill each edge',ops[7:],view='top')],ID,
        notes=['The finished detent 42087-3-01 is not in the set: this is the part as far as these two sheets take it, before its blade, spring and horn are finished.','The block, trip spring, screws and bracket (42086, 42088, 42091, 42092) are not in the set.'],fits=[])
    r.flat=True;return _flags(r,['Not the finished detent: 42087-3-01 is not in the set','The step in the top notch: .079 printed, .075 on the scale (unsure)','The edges milled evenly from both sides: likely'])

# ======================= 42087 detent, finished: reconstructed (42087-3-01 is not in the set) =======================
# The blank (detentBlank) as the two operation sheets leave it, then the finishing the missing finished drawing would give, each size from the nearest source:
# the blank fixes every length and the heights of the strips (it stands on edge in the movement: its .131 width upright, its .041 thickness across in plan, the
# clamp screw driven across the foot into the block, movement.js); the 3D model's detent (shared/escapement.js's pieces, measured on KLUwI2UUCMQ 11:10-11:33 and
# Fig. 90, x1.117) gives only what the blank can't: the thicknesses in plan, which face they are thinned from, and the stone. Read, not changed, from the model.
DET_MODEL={   # escapement.js's pieces in its unit frame (x ES 6.58 mm, the detent's DSC 1.117 applied), t along the detent from the point of flexure, n across in plan
 'n':(-0.0927,0.0927),'spring':(-0.0648,-0.0514),'blade':(-0.0670,-0.0335),'arm':(-0.0280,0.0280),'stone_t':1.7166,'stone_n':0.0229,'rJ':0.046,'ES':6.58,
 'spring_h':0.95*1.117,'spring_L':0.5602*6.58,'spring_t':(0.0648-0.0514)*6.58}
# What the video measured that the blank leaves larger (the blank only loses metal in finishing, so it is a ceiling; HAMILTON-PARTS-LEDGER.md "The detent
# assembly measured"), read off the 3D model's solids on the drawn detent (tools/hamilton_detent_compare.py; recipes/hamilton_detent_model.json), the model's
# sizes measured on KLUwI2UUCMQ 11:10-11:33 by bundle adjustment (PROVENANCE 110-7a, 110-13a), x1.117. x along from the window's start (the point of flexure),
# y on edge from the slot's centre line, toward the pillar plate.
DET_VIDEO={'cross':4.16,   # the cross-piece ends 4.16 past the flexure (0.50 wide after the window; 110-7a: 0.42 old = 0.47); the blank's runs to 4.65
 'jb':(10.76,11.81),'jby':(-0.08,1.32),   # the jewel block 1.05 long and 1.40 high (110-7a: 0.9 and 1.26 old: 1.01, 1.41); the blank's step 1.65 by 1.90
 'pins':(-9.28,-1.69),'pinD':0.49,   # the two steady pins through the foot (110-7c: roots 6.8 apart about the clamp screw; r 0.22 E old); the blank has no holes for them
 'wedge':(10.957,0.903,0.20),   # the wedge pin 42089 beside the stone, upright: t, z across (the drawn frame), its diameter (110-8: 0.2 E)
 'brs':(4.882,0.726,0.16)}   # the bracket's screw 1770 across the blade: t, y, the shank's diameter (110-11: r 0.08 E)
class Turn(Op):
    """the part turned over top to bottom (mirrored about its centre line y = c): the sheet doesn't say which edge is up"""
    kind='op'
    def __init__(self,c,text,sizes=(),src=''):super().__init__(text,sizes,src);self.c=c
    def apply(self,p):return p.mirror(bd.Plane(origin=(0,self.c,0),z_dir=(0,1,0)))
def detentFinished():
    H=HD()['dt'];I=lambda x:x*25.4;M=DET_MODEL;ES=M['ES'];z0,z1=(H['t']-H['tFin'])/2,(H['t']+H['tFin'])/2;T=z1-z0;W=H['w']
    f=lambda n:(n-M['n'][0])/(M['n'][1]-M['n'][0])   # a place across the model's foot as a share of the ground thickness
    wi=H['window'];tn=H['topNotch'];bp=tn['bump'];x0=wi['x0'];xs=wi['x1']
    hS=I(.0315+.0275);tS=M['spring_t']*((M['spring_h']/hS)*(wi['l']/M['spring_L']))**(1/3)   # the model's stiffness (∝ h t³ / L) at the drawn heights and length
    fs=(f(M['spring'][0])+f(M['spring'][1]))/2;zs=z0+fs*T
    def band(xa,xb,za,zb):   # everything across the bar between xa and xb outside the plan band za..zb
        bx=lambda zl,zh:bd.Box(xb-xa,10,zh-zl,align=(bd.Align.MIN,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((xa,W/2,zl)))
        return bx(z0-1,za)+bx(zb,z1+1)
    xj=x0+M['stone_t']*ES;rj=M['rJ']*ES;zj=z0+f(M['stone_n'])*T   # the stone where the model has it across the detent, 0.15 mm off its middle toward the arm's side (makeEsc's Jc: its flat's offset eJ)
    Vd=DET_VIDEO;yc=H['slot']['y'];xc=x0+Vd['cross'];xb0,xb1=x0+Vd['jb'][0],x0+Vd['jb'][1];yb0,yb1=W-tn['floor'],W-H['botCuts'][0]['depth']   # the blade on edge, turned over
    def box(xa,xb,ya,yb):return bd.Box(xb-xa,yb-ya,T+2,align=(bd.Align.MIN,bd.Align.MIN,bd.Align.MIN)).moved(bd.Location((xa,ya,z0-1)))
    def blade(xa,xb):return box(xa,xb,-1,yb0)+box(xa,xb,yb1,W+1)
    r=detentBlank()
    ops=[Turn(W/2,'Turn the blank over: the blade toward the pillar plate',
           [S('which edge up',f"the top notch's floor and the jewel step toward the pillar plate: so the blade stands {yb0-yc:+.2f} to {yb1-yc:+.2f} mm from the slot's centre line, the 3D model's +0.12 to +1.02, at the escape wheel's level",'the sheet doesn\'t say; KLUwI2UUCMQ 11:10-11:33 (the model\'s jewel block, measured): as the blank is drawn it stood 1.2 mm off','42087-2-51A; PROVENANCE 110-7a')],'reconstructed'),
         Cut(lambda:box(H['hole']['x']-H['hole']['d']/2,H['hole']['x']+H['hole']['d']/2,-1,H['hole']['y']),'Corner the foot hole (operation 63): open it to the edge toward the train bridge, a notch for the adjusting screw\'s head',
           [S('',f"{fx(H['hole']['d'],4)} wide, from the hole to the edge",'the notch\'s width the hole\'s; its edge 42093\'s (the notch open at the top, the block\'s pins\' side): inferred','42087-2-51A operation 63; 42093')],'reconstructed'),
         Cut(lambda:box(xc,tn['x0'],-1,yb0),'Mill the cross-piece back to its measured width',
           [S('cross-piece',f"{xc-wi['x1']:.2f} mm wide after the window (the blank's .040 full section {tn['x0']-wi['x1']:.2f}); past it the section the blank has next (the top notch's floor)",'measured: KLUwI2UUCMQ 11:10-11:33 (0.42 old = 0.47); the blank a ceiling','PROVENANCE 110-7a')],'video'),
         Cut(lambda:blade(bp['x0'],xb0)+blade(xb1,bp['x1'])+box(xb0,xb1,-1,yc+Vd['jby'][0])+box(xb0,xb1,yc+Vd['jby'][1],W+1),'Mill the jewel block to its measured size',
           [S('jewel block',f"{xb1-xb0:.2f} long × {Vd['jby'][1]-Vd['jby'][0]:.2f} high (the blank's step {bp['x1']-bp['x0']:.2f} × {bp['h']-I(.0045):.2f}), {xb0:.2f}-{xb1:.2f} from the foot end",'measured: KLUwI2UUCMQ 11:10-11:33 (0.9 × 1.26 old = 1.01 × 1.41); the blank a ceiling','PROVENANCE 110-7a')],'video'),
         Cut(lambda:band(x0,xs,zs-tS/2,zs+tS/2),'Thin the window\'s two webs to the detent spring',
           [S('spring',f"two strips {fx(I(.0315),4)} and {fx(I(.0275),4)} high (the webs), {fx(wi['l'],3)} long, {tS:.4f} mm = {inch(tS):.4f} in thick in plan",'the thickness derived: the 3D model\'s spring stiffness at the drawn heights (estimated)','42087-2-51A, -1-52; shared/escapement.js'),
            S('which face',f"{fs*100:.0f} % of the way across from the first face, as the model's",'estimated','shared/escapement.js')],'reconstructed'),
         Cut(lambda:band(xc,xb0,z0+f(M['blade'][0])*T,z0+f(M['blade'][1])*T),'Thin the blade, from the cross-piece to the jewel block',
           [S('blade',f"{(f(M['blade'][1])-f(M['blade'][0]))*T:.3f} mm thick in plan",'the model\'s (video and Fig. 90): estimated','shared/escapement.js'),S('cross-piece',f"left full, {xc-wi['x1']:.2f} wide after the window",'measured (above)','PROVENANCE 110-7a')],'reconstructed'),
         Cut(lambda:band(xb1,tn['x1'],z0+f(M['arm'][0])*T,z0+f(M['arm'][1])*T),'Thin the arm past the jewel block',
           [S('arm',f"{(f(M['arm'][1])-f(M['arm'][0]))*T:.3f} mm thick in plan, centred",'the model\'s: estimated','shared/escapement.js')],'reconstructed'),
         Drill((xj,-0.01,zj),(0,1,0),2*rj,W+0.02,'Bore the locking stone\'s seat upright through the jewel block',
           [S('',f"Ø {2*rj:.3f} mm for the stone (bought)",'the model\'s stone: estimated','shared/escapement.js'),
            S('place',f"{fx(xj,4)} from the foot end: the model's flexure-to-stone {M['stone_t']*ES:.2f} mm from the window's start, inside the jewel block {fx(xb0,4)}-{fx(xb1,4)} (the drawn step {fx(bp['x0'],4)}-{fx(bp['x1'],4)}); across, {zj-(z0+T/2):+.3f} mm off the middle as the model's (its wall {T/2-abs(zj-(z0+T/2))-rj:.3f} mm)",None,'42087-2-51A #14; shared/escapement.js')],'reconstructed',key='stone'),
         *[Drill((x0+t,yc,z0-0.01),(0,0,1),Vd['pinD'],T+0.02,f'Drill the {k} steady pin\'s hole across the foot',[S('',f"Ø {Vd['pinD']:.2f} mm, {t:+.2f} from the point of flexure ({x0+t:.2f} from the foot end) on the centre line",'measured: KLUwI2UUCMQ 11:10-11:33 (the pins\' roots 6.8 apart about the clamp screw, old mm); the diameter estimated (r 0.22 old)','PROVENANCE 110-7c')],'video',key='pin'+k[0]) for k,t in zip(('first','second'),Vd['pins'])],
         Drill((x0+Vd['wedge'][0],-0.01,Vd['wedge'][1]),(0,1,0),Vd['wedge'][2],W+0.02,'Drill the wedge pin\'s hole upright beside the stone',[S('',f"Ø {Vd['wedge'][2]:.2f} mm, {Vd['wedge'][0]:.2f} past the flexure, its wall against the stone (the wedge bears on it)",'the model\'s pin: estimated (0.2 across, hidden on every frame)','PROVENANCE 110-8')],'3D model',key='wedge'),
         Drill((x0+Vd['brs'][0],yc+Vd['brs'][1],z0-0.01),(0,0,1),Vd['brs'][2],T+0.02,'Drill and tap the trip spring bracket\'s screw hole across the blade',[S('',f"Ø {Vd['brs'][2]:.2f} mm (the screw 1770's shank), {Vd['brs'][0]:.2f} past the flexure",'its place measured (the bracket\'s leg in its middle, KLUwI2UUCMQ 11:10-11:33); the shank estimated','PROVENANCE 110-10, 110-11')],'video',key='brs')]
    r.setups.append(Setup('3','finishing (reconstructed: the finished drawing 42087-3-01 is not in the set)',ops,view='top'))
    r.key='detentFinished';r.title='Detent, finished (reconstructed)';r.drawing='42087-3-01 not in the set: reconstructed from 42087-2-51A, -1-52, 42093 and the 3D model'
    r.notes=r.notes[:1]+[f"Reconstructed. Every length is the blank's but where the video measured the finished part smaller: the cross-piece and the jewel block (finishing only removes metal, so the blank is a ceiling). The foot keeps the blank's length (the owner's choice, 2 November 2026: on the video the finished foot ends about 12 mm from the flexure, the blank's 15.37). The blank is turned over: the sheet doesn't say which edge is up, and only this way does the blade stand at the escape wheel's level (the 3D model's, measured). The detent stands on edge in the movement (42093; movement.js drives the clamp screw across the foot), so the window's two webs, {fx(I(.0315),4)} and {fx(I(.0275),4)} high, are the two-strip spring (escapement.js: the model's {M['spring_L']:.2f} mm long against the window's {wi['l']:.2f}).",
        f"The spring's thickness in plan is derived, not drawn: the model's {M['spring_t']:.4f} mm at its estimated 1.06 mm of height, held to the same stiffness at the drawn 1.50 mm, gives {tS:.4f} mm. Both are beryllium copper (the blank's, escapement.js's EB 128 GPa), and the model's stiffness is KD = E h t³/12/L, so h t³/L held is the stiffness held. tripping.json's map of the detent's ring (0.0559-0.1173 mm at the model's height, its pitch 70.5-212.5 Hz) is 0.0495-0.1040 mm at the drawn heights and length: the spring is inside it.",
        f"Cross-check: the model's stone, {M['stone_t']*ES:.2f} mm from the point of flexure, lands {xj/25.4:.4f} in from the foot end, inside the drawn step for the jewel block ({bp['x0']/25.4:.4f}-{bp['x1']/25.4:.4f}), {(xj-(bp['x0']+bp['x1'])/2):+.2f} mm from its middle.",
        'Not formed: the horn and the end of the arm (the model bends them across in plan, beyond the bar; the end land and its .050 slot are left as the blank has them: what the slot is for is not known), the stone itself (bought), the trip spring 42088 and its bracket 42092.']
    r.flags=['Reconstructed: 42087-3-01 is not in the set','Turned over, and the cross-piece and jewel block trimmed to the video; the foot the blank\'s length (the owner\'s choice)','The notch for the adjusting screw: the foot hole opened to the edge (inferred from 42093 and operation 63)',f'The spring {inch(tS):.4f} in thick: derived from the model\'s stiffness (estimated)','The blade and arm thicknesses and which face: the model\'s (estimated)','The horn not formed (beyond the bar in plan)']
    return r

# ======================= the whole detent (42093): placeholders from the 3D model for the parts not in the set =======================
# 42093 lists the detent assembly's parts without sizes; of them only the detent (42087) is drawn here. The rest are the 3D model's own solids, read off the page
# (tools/hamilton_detent_export.py -> recipes/hamilton_detent_model.json: its measured sizes, KLUwI2UUCMQ 11:10-11:33 and Fig. 90, x1.117) and put on the drawn
# detent: along it from the point of flexure (the window's start), in height by the clamp screw's axis on the blank's slot (the model's detent and the blank are
# both centred on it), across it in plan by each side's face (the model's detent 1.22 thick, the drawn .041: inside it, scaled; outside, as measured).
DET_PARTS=[('42086','Detent support block, with its button and pins'),('20756','Detent adjusting screw'),('37024','Detent clamp screw (42093: 37204)'),('42251.det','Washer, detent clamp screw'),
           ('42091.lk','Detent lock adjusting screw'),('42091.cl','Detent lock adjusting clamp screw'),('42088','Detent trip spring'),('42092','Trip spring support bracket'),
           ('1770.br','Support bracket screw'),('1770.ts','Trip spring screw'),('42089','Locking jewel wedge pin')]
@functools.lru_cache()
def DM():return json.loads((TOOLS/'recipes'/'hamilton_detent_model.json').read_text(encoding='utf-8'))
def _det_map():
    """the model's (t, n, h) in mm onto the drawn detent's frame (x along from the foot end, y up its .131 width, z across its .041 in plan)"""
    H=HD()['dt'];x0=H['window']['x0'];nF=0.0927*6.58;z0,z1=(H['t']-H['tFin'])/2,(H['t']+H['tFin'])/2;T=z1-z0
    M=[m for m in DM()['meshes'] if m['hn']=='37024']
    import numpy as np
    hc=min((np.array(m['v']).reshape(-1,3) for m in M),key=lambda V:V[:,1].max()-V[:,1].min())   # the clamp screw's shank (the longer across)
    hC=(hc[:,2].min()+hc[:,2].max())/2;yC=H['hole']['y']   # its axis's height; the slot's centre line (.070 up the blank)
    def f(t,n,h):
        z=z0+(n+nF) if n<-nF else z1+(n-nF) if n>nF else z0+(n+nF)/(2*nF)*T
        return (x0+t,yC+(h-hC),z)
    return f
# What the placeholders need that the 3D model leaves out (it can't hole a piece across an extrusion: fine.py's det:Cylinder/det:Extrude): each screw's hole cut
# in the parts it passes into, as its shank (a tapped hole drawn at the thread's outside); the model's washer is a solid disc spanning the clamp screw's head.
DET_HOLES={'42086':['37024','20756','42091.lk','42091.cl'],'42092':['1770.br','1770.ts'],'42088':['1770.ts']}
def _subs(hn):
    """the 3D model's meshes of line hn on the drawn detent, each (vertices, triangles): its corners welded and its zero-area slivers dropped (the trip
    spring's 58, HAMILTON-PARTS-LEDGER.md S-3), its triangles turned over, since the map (t, n, h) -> (x, y, z) = (t, h, n) is a reflection (it left every
    mapped mesh inside out, S-1)"""
    import numpy as np
    f=_det_map();out=[]
    for m in DM()['meshes']:
        if m['hn']!=hn:continue
        v=m['v'];V=np.array([f(v[i],v[i+1],v[i+2]) for i in range(0,len(v),3)],dtype=np.float64);T=np.array(m['i'],dtype=np.int64).reshape(-1,3)[:,::-1]
        k,inv=np.unique(np.round(V,6),axis=0,return_inverse=True);T=inv.reshape(-1)[T]
        out.append((k,T[(T[:,0]!=T[:,1])&(T[:,1]!=T[:,2])&(T[:,0]!=T[:,2])]))
    if hn=='20756':   # the adjusting screw refitted to the drawn foot (the owner's choice: the blank's length): its head moved along into the foot's notch (the foot
        # hole opened to the edge, detentFinished), its neck run back from the head to where the model has it; the model's head sat in a notch of its own 2.44 nearer the block
        H=HD()['dt'];(Vh,Th),(Vs,Ts)=sorted(out,key=lambda vt:-np.ptp(vt[0][:,1]));d=H['hole']['x']-(Vh[:,0].min()+Vh[:,0].max())/2
        Vh=Vh.copy();Vh[:,0]+=d;Vs=Vs.copy();x1=Vh[:,0].max();e=np.isclose(Vs[:,0],Vs[:,0].min());Vs[e,0]=x1
        out=[(Vh,Th),(Vs,Ts)]
    return out
def _manifold(V,T,hn=''):
    import numpy as np,manifold3d as m3
    q=m3.Manifold(m3.Mesh(vert_properties=np.asarray(V,dtype=np.float32),tri_verts=np.asarray(T,dtype=np.uint32)))
    if q.status().name!='NoError' or q.volume()<=0:raise ValueError(f'{hn}: a mesh is not a closed solid ({q.status()})')
    return q
def _washer_seat():
    """the clamp screw (37024) and its washer (42251.det) as the model draws them: the washer, 0.28 thick, lies inside the head's first 0.28 (both start on
    the foot's face); returns the head's and shank's meshes, the washer's, and the washer's two faces (z, the screw's axis across)"""
    import numpy as np
    S=sorted(_subs('37024'),key=lambda vt:np.ptp(vt[0][:,1]));W=_subs('42251.det')[0];return S[1],S[0],W,(W[0][:,2].min(),W[0][:,2].max())
def _model_manifold(hn):
    """the 3D model's part as one closed manifold (manifold3d), its meshes united (the block's pins and button inside it, the screw's head on its shank).
    The clamp screw's head is seated on the washer instead of round it: the head's inner face moved out to the washer's outer face, the shank run up to it
    (vertices moved, nothing cut: a cut leaves needle triangles)"""
    import numpy as np
    if hn=='37024':
        (Vh,Th),(Vs,Ts),_,(z0,z1)=_washer_seat();Vh=Vh.copy();Vs=Vs.copy()
        Vh[np.abs(Vh[:,2]-z0)<1e-5,2]=z1;Vs[np.abs(Vs[:,2]-z0)<1e-5,2]=z1+1e-3
        return _manifold(Vh,Th,hn)+_manifold(Vs,Ts,hn)
    out=None
    for i,(V,T) in enumerate(_subs(hn)):
        if hn=='42086' and i>=2:   # its pins fill the block's holes exactly: grown 0.001 across (a press fit) so the union leaves no coincident walls
            V=V.copy();c=(V.max(0)+V.min(0))/2;ax=int(np.argmax(np.ptp(V,0)));k=[j for j in range(3) if j!=ax];g=1+0.002/min(np.ptp(V[:,j]) for j in k)
            for j in k:V[:,j]=c[j]+(V[:,j]-c[j])*g
        q=_manifold(V,T,hn);out=q if out is None else out+q
    return out
@functools.lru_cache()
def _placeholder_manifold(hn):
    """a placeholder as made: the model's part with its screws' holes cut (S-2); the washer bored to the clamp screw's shank (its own polygon, 0.005 over)"""
    import numpy as np
    q=_model_manifold(hn)
    for g in DET_HOLES.get(hn,[]):q=q-_model_manifold(g)
    if hn=='42251.det':
        _,(Vs,Ts),_,(z0,z1)=_washer_seat();c=(Vs.max(0)+Vs.min(0))/2;V=Vs.copy();r=np.hypot(V[:,0]-c[0],V[:,1]-c[1]);k=(r.max()+0.005)/r.max()
        V[:,0]=c[0]+(V[:,0]-c[0])*k;V[:,1]=c[1]+(V[:,1]-c[1])*k;V[:,2]=np.where(V[:,2]>(V[:,2].min()+V[:,2].max())/2,z1+1,V[:,2])
        q=q-_manifold(V,Ts,'bore')
    return q
def _mesh_solid(q):
    """a closed manifold mesh (manifold3d) as one B-rep solid: each of its bodies' triangles sewn (OCP) into a shell, made a solid facing out, the bodies then
    fused (the model's block is two extrusions meeting face to face, which a mesh union leaves two bodies and one sewn shell would leave inside faces, S-1)"""
    import numpy as np
    from OCP.BRepBuilderAPI import BRepBuilderAPI_Sewing
    from OCP.ShapeFix import ShapeFix_Solid
    from OCP.TopAbs import TopAbs_SHELL
    from OCP.TopExp import TopExp_Explorer
    from OCP.TopoDS import TopoDS
    out=None
    for b in q.decompose():
        M=b.to_mesh64();V=np.asarray(M.vert_properties,dtype=np.float64)[:,:3];T=np.asarray(M.tri_verts)
        for flip in (False,True):   # the triangles as manifold3d winds them (outward); turned over if OCP's solid comes out inside out
            sew=BRepBuilderAPI_Sewing(1e-6,True,True,False,False)   # free edges not cut: cutting them split the block's hole walls and grew it 0.54 mm³
            for a,b2,c in (T[:,::-1] if flip else T):sew.Add(bd.Face(bd.Wire.make_polygon([bd.Vector(*V[a]),bd.Vector(*V[b2]),bd.Vector(*V[c])],close=True)).wrapped)
            sew.Perform();ex=TopExp_Explorer(sew.SewedShape(),TopAbs_SHELL);sh=[]
            while ex.More():sh.append(TopoDS.Shell(ex.Current()));ex.Next()
            if len(sh)!=1 or sew.NbFreeEdges():raise ValueError(f'a body sewn into {len(sh)} shells, {sew.NbFreeEdges()} free edges')
            so=bd.Solid(ShapeFix_Solid().SolidFromShell(sh[0]))
            from OCP.BRepGProp import BRepGProp
            from OCP.GProp import GProp_GProps
            g=GProp_GProps();BRepGProp.VolumeProperties_s(so.wrapped,g)   # signed: a solid whose faces point in has a negative volume
            if g.Mass()>0:break
        out=so if out is None else out.fuse(so).clean()
    if abs(out.volume-q.volume())>1e-4*max(1,q.volume()):raise ValueError(f'sewn solid {out.volume:.5f} mm³ against the mesh\'s {q.volume():.5f}')
    return out
class FromModel(Op):
    """stock: a part taken from the 3D model's solid (a placeholder for a part whose sheet is not in the set)"""
    kind='stock'
    def __init__(self,hn,text,sizes=(),src=''):super().__init__(text,sizes,src);self.hn=hn
    def apply(self,p):
        from OCP.BRepAlgoAPI import BRepAlgoAPI_Check
        from OCP.ShapeUpgrade import ShapeUpgrade_UnifySameDomain
        def unify(s):   # the coplanar triangles merged into the model's faces (the page draws every face's edges: otherwise a diagonal across each flat face)
            u=ShapeUpgrade_UnifySameDomain(s.wrapped,True,True,True);u.SetLinearTolerance(1e-5);u.SetAngularTolerance(1e-5);u.Build()
            return bd.Solid(u.Shape()) if u.Shape().ShapeType().name=='TopAbs_SOLID' else s
        q=_placeholder_manifold(self.hn);s=unify(_mesh_solid(q))
        if s.is_valid and BRepAlgoAPI_Check(s.wrapped,True,True).IsValid():return s
        s=unify(_mesh_solid(q.simplify(1e-5)))   # flat triangles collapsed: the trip spring screw's two edges OCP's check calls too small
        if not(s.is_valid and BRepAlgoAPI_Check(s.wrapped,True,True).IsValid()):raise ValueError(f'{self.hn}: no valid solid from the model mesh')
        return s
def _placeholder(hn,title):
    def mk():
        import numpy as np
        V=np.concatenate([np.array(m['v']).reshape(-1,3) for m in DM()['meshes'] if m['hn']==hn]);lo,hi=V.min(0),V.max(0)
        r=Recipe('det_'+hn.replace('.','_'),hn,title+' (placeholder)',f'{hn}: not in the set (42093 lists it, without sizes)','as the 3D model (not given here)','',
            [Setup('1','placeholder: the 3D model\'s solid',[FromModel(hn,"The 3D model's solid, placed on the drawn detent",
              [S('extent',f"{hi[0]-lo[0]:.2f} along × {hi[1]-lo[1]:.2f} across × {hi[2]-lo[2]:.2f} high (mm)",'measured: the 3D model (KLUwI2UUCMQ 11:10-11:33, Fig. 90, x1.117)','shared/escapement.js; js/movement.js')],'3D model')])],ID,
            notes=['A placeholder: its sheet is not in the NAWCC set. Its shape and sizes are the 3D model\'s, measured on video; only its place comes from the drawn detent.']
              +([f"Holed for {', '.join(DET_HOLES[hn])} (each hole its screw's shank: the 3D model draws them through it unholed)."] if hn in DET_HOLES else [])
              +(["Bored for the clamp screw's shank (0.005 mm over): the 3D model draws it a solid disc inside the screw's head."] if hn=='42251.det' else [])
              +(["Its head seated on the washer: the 3D model starts head and washer together on the foot's face, so here the head's first 0.28 mm (the washer's thickness) is the shank, the screw as long."] if hn=='37024' else []))
        return _flags(r,['Placeholder: the 3D model\'s part (measured on video), not a drawing'])
    mk.__name__='det_'+hn.replace('.','_');return mk
def lockingStone():
    I=lambda x:x*25.4;H=HD()['dt'];M=DET_MODEL;rj=M['rJ']*M['ES'];bp=H['topNotch']['bump']
    hj=DET_VIDEO['jby'][1]-DET_VIDEO['jby'][0]
    ops=[Blank(2*rj,0,hj,'The locking stone, bought (a ruby or sapphire pallet)',[S('',f"Ø {2*rj:.3f} mm, {hj:.2f} long (the jewel block's height, measured)",'the 3D model\'s stone: estimated','shared/escapement.js')],'3D model')]
    r=Recipe('lockingStone','42087.j','Locking stone (in 42087, "complete with jewel")','42087: complete with jewel (not in the set)','jewel (ruby or sapphire)','',[Setup('1','bought',ops)],ID,
        notes=['Its locking face (a flat on the stone) is not formed here: the 3D model\'s flat (eJ) is part of the escapement\'s geometry.'])
    return _flags(r,['Placeholder: the 3D model\'s stone (estimated)'])
def asmDetent():
    H=HD()['dt'];M=DET_MODEL;xj=H['window']['x0']+M['stone_t']*M['ES'];z0,z1=(H['t']-H['tFin'])/2,(H['t']+H['tFin'])/2
    mem=[Member('detentFinished',why='42087 reconstructed: the frame')]
    zj=z0+(M['stone_n']-M['n'][0])/(M['n'][1]-M['n'][0])*(z1-z0)   # across, as the model has it (detentFinished's seat)
    mem.append(Member('lockingStone',rot=[('x',-90)],t=(xj,H['slot']['y']+DET_VIDEO['jby'][0],zj),ex=(0,6,0),why='in its seat, upright through the jewel block'))
    ex={'42086':(0,0,-6),'20756':(-6,0,-3),'37024':(0,0,6),'42251.det':(0,0,4),'42091.lk':(0,0,-10),'42091.cl':(0,0,-10),'42088':(0,0,8),'42092':(0,0,5),'1770.br':(0,0,7),'1770.ts':(0,0,10),'42089':(0,5,0)}
    for hn,t in DET_PARTS:mem.append(Member('det_'+hn.replace('.','_'),ex=ex.get(hn,(0,0,0)),why='the 3D model\'s part, placed on the drawn detent (placeholder)',label=t))
    up=bd.Location((0,0,0),(1,0,0),90)   # the detent stands on edge in the movement: its height (the blank's y) shown up
    for m in mem:L=m.loc();m.L=up*L;m.ex=(m.ex[0],-m.ex[2],m.ex[1])
    a=Assembly('asmDetent','Detent assembly (42093): the drawn detent with placeholders','Detent',mem,
        notes=['42093 lists the parts without sizes; only the detent itself is drawn here (reconstructed). The rest are the 3D model\'s solids, measured on video (KLUwI2UUCMQ 11:10-11:33, Fig. 90) and scaled x1.117, put on the drawn detent along it from the point of flexure, in height by the clamp screw\'s axis on the slot\'s centre line, and across by the foot\'s faces.',
               'Fitted to the drawn detent (2 November 2026): the detent turned over and trimmed where the video measured it smaller, holed for the steady pins, the wedge pin and the bracket\'s screw; the adjusting screw\'s head in the foot\'s notch at the blank\'s length (the owner\'s choice), its neck run back to the block. What is left of the overlaps (thousandths of a mm³) is the placeholders\' polygon pins in round holes; they are listed under Checks.',
               'The parts list (NAVSHIPS 250-624) numbers the clamp screw 37024; 42093 names it 37204.'],
        flags=['Placeholders: every part but the detent is the 3D model\'s (video), not a drawing'])
    a.placeholder=True;a.drawing='the detent reconstructed from 42087-2-51A and -1-52, the parts named by 42093-2-01; every other part a placeholder from the 3D model, placed on the drawn detent'
    return a

# ======================= 42050 helical spring, 1-WD-265 mainspring inner end =======================
def helicalSpring():
    H=HD();src='42050-1-01';I=lambda x:x*25.4;d=I(.025);D=I(.290)-d;L=I(.550);n=6;nc=1
    pc=d+0.01   # the closed turns' pitch: the wire and 0.01 mm (closed turns touch, but turns that touch make no single valid solid: their sweep cut itself, HAMILTON-PARTS-LEDGER.md S-4)
    pa=(L-2*nc*pc)/(n-2*nc)   # the open turns' pitch: one closed turn at each end, the free length over the four open
    def spring():
        pts=[];N=48*n
        for i in range(N+1):
            u=i/N*n;z=(pc*u if u<=nc else pc*nc+pa*(u-nc) if u<=n-nc else pc*nc+pa*(n-2*nc)+pc*(u-(n-nc)))
            a=2*math.pi*u;pts.append(bd.Vector(D/2*math.cos(a),D/2*math.sin(a),z+d/2*0))
        path=bd.Wire([bd.Edge.make_spline(pts)]);t0=path.tangent_at(0)
        prof=bd.Wire([bd.Edge.make_circle(d/2,bd.Plane(origin=pts[0],z_dir=t0))])
        s=bd.Solid.sweep(bd.Face(prof),path,is_frenet=True)
        return s&bd.Box(20,20,L,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN))   # the ends ground flat to the free length
    ops=[Solid(spring,'Coil the wire',[S('wire',f'Ø {fx(d,3)}','±.001 in',src+' #3'),S('outside',f'Ø {fx(I(.290),3)}','±.005 in',src+' #2'),S('turns','6 in all, 1 closed at each end','±1/4; +1/4/-0 closed; drawn 0.01 mm apart (touching turns make no single solid)',src+' #5, #7'),
        S('free length',fx(L,3),'+.050/-0 in',src+' #1'),S('solid length','.185 the most',None,src+' #6'),S('coiling','either hand ("OPTIONAL")',None,src+' #4')],src)]
    r=Recipe('helicalSpring','42050','Helical spring',src,'beryllium copper wire','nickel plate',[Setup('1','coiled on a mandrel, the ends ground square',ops)],ID,
        notes=['Where it goes in the chronometer is not known yet (PLAN-hamilton-drawings.md, step 8).','The ends ground flat to the free length: the sheet\'s solid length .185 (6 × .025 = .150 and grinding) implies ground ends (likely).'])
    return _flags(r,['Its place in the chronometer: unknown','Ground ends: likely (implied by the solid length)'])
def mainspringEnd():
    H=HD()['ms'];src='1-WD-265';I=lambda x:x*25.4;w=H['w'];r0=H['endR'];L=I(2.0);th=I(.0165);s0=I(.180);sl=H['slotL'];sw=H['slotW']
    def planform():
        P=lambda x,y:bd.Vector(x,y,0)
        e=[bd.Edge.make_three_point_arc(P(r0,-r0),P(0,0),P(r0,r0)),bd.Edge.make_line(P(r0,r0),P(H['taper'],w/2)),bd.Edge.make_line(P(H['taper'],w/2),P(L,w/2)),bd.Edge.make_line(P(L,w/2),P(L,-w/2)),
           bd.Edge.make_line(P(L,-w/2),P(H['taper'],-w/2)),bd.Edge.make_line(P(H['taper'],-w/2),P(r0,-r0))]
        return bd.Face(bd.Wire(e))
    bc=I(.025)   # the slot's square end's corners broken 45°: drawn, not dimensioned (about .025 on the sheet's scale, against the slot's .200: HAMILTON-PARTS-LEDGER.md R-1)
    def slot():
        rr=sw/2;x1=s0+sl-rr;P=lambda x,y:bd.Vector(x,y,-0.01)
        e=[bd.Edge.make_line(P(s0,-rr+bc),P(s0,rr-bc)),bd.Edge.make_line(P(s0,rr-bc),P(s0+bc,rr)),bd.Edge.make_line(P(s0+bc,rr),P(x1,rr)),
           bd.Edge.make_three_point_arc(P(x1,rr),P(x1+rr,0),P(x1,-rr)),bd.Edge.make_line(P(x1,-rr),P(s0+bc,-rr)),bd.Edge.make_line(P(s0+bc,-rr),P(s0,-rr+bc))]
        return bd.extrude(bd.Face(bd.Wire(e)),th+0.02,dir=(0,0,1))
    ops=[Plate(planform(),th,'The strip\'s inner end: round the tip, taper it',[S('width',fx(w,3),'±.001 in',src+' #1'),S('tip',f'a full round R {fx(r0,3)} (.500 wide there)',None,src+' #2'),S('taper',f'to the full width {fx(H["taper"],2)} from the tip',None,src+' #3'),
           S('thickness',f'{fx(th,4)}','from the manual\'s parts list (0.0165 in), not this sheet',"NAVSHIPS 250-624 Sec. XI"),S('length shown','2.000 in of the strip','not the spring\'s length (42037-42041, not in the set)','')],src),
         Cut(slot,'Punch the slot for the arbor\'s hook',[S('',f'{fx(sw,3)} wide × {fx(sl,3)} long, its tip end square with its corners broken 45° (about .025: drawn, not dimensioned), its far end round R .100','±.003 in; the break estimated',src+' #4, #6 and BREAK CORNER'),
            S('start',f'{fx(s0,3)} from the tip (.200 printed, .180 by hand 6-7-43: the later)','likely the one in force',src+' #5')],src)]
    r=Recipe('mainspringEnd','1-WD-265','Mainspring, inner end',src+' (5-20-43; revised 6-7-43)','spring steel strip (the mainspring 42037-42041: not in the set)','as the mainspring',[Setup('1','the strip\'s end formed and punched',ops,view='top')],ID,
        notes=['The sheet draws the inner terminal only: the strip\'s length, its outer end and its brace are other sheets (not in the set).'],fits=['its slot over the barrel arbor\'s hook (42170) (inferred)'])
    r.flat=True;return _flags(r,['Only the inner end: the rest of the spring is not in the set','Thickness from the manual, not this sheet','The slot\'s start: .180 (by hand) taken, .200 printed'])

def I_(x):return x*25.4
RECIPES=[('Going train',fourthWheel),('Going train',fourthPinion),
         ('Fusee',fuseeWheel),('Fusee',fuseeArbor),
         ('Maintaining and winding work',sustainingWheel),('Maintaining and winding work',windingPawl),('Maintaining and winding work',windingPawlSpring),('Maintaining and winding work',windingRatchet),
         ('Maintaining and winding work',sustainingSpring),('Maintaining and winding work',sustainingPawl),
         ('Barrel and mainspring',barrel),('Barrel and mainspring',barrelCap),('Barrel and mainspring',barrelArbor),('Barrel and mainspring',mainspringEnd),
         ('Set-up',setupRatchet),('Set-up',setupPawl),('Set-up',setupPawlSpring),
         ('Fusee chain',centreLink),('Fusee chain',outerLink),('Fusee chain',linkPin),('Fusee chain',barrelHook),('Fusee chain',fuseeHook),
         ('Detent',detentBlank),('Detent',detentFinished),('Detent assembly (placeholders)',lockingStone),
('Not yet placed',helicalSpring)]

# ======================= subassemblies: the drawn parts put together by the sheets' own numbers =======================
class Member:
    """a part in a subassembly: its recipe's key, where it goes (turned about axes through its own origin in order, then moved; mm, degrees), the way it
    comes off in the exploded view (mm), and what the sheets say places it"""
    def __init__(self,key,rot=(),t=(0,0,0),ex=(0,0,0),why='',label=None,L=None):self.key=key;self.rot=list(rot);self.t=t;self.ex=ex;self.why=why;self.label=label;self.L=L
    def loc(self):
        if self.L is not None:return self.L   # a placement composed elsewhere (a part on a part)
        L=bd.Location(self.t)
        for ax,deg in reversed(self.rot):L=L*bd.Location((0,0,0),{'x':(1,0,0),'y':(0,1,0),'z':(0,0,1)}[ax],deg)
        return L
class Assembly:
    """a subassembly: its members, the pairs meant to touch or press (fits: (a, b, kind, why); kind 'press' allows an overlap up to vol mm³, 'touch' and
    'clear' none) and its notes; hamilton_parts.py checks every pair of members for overlap"""
    def __init__(self,key,title,group,members,fits=(),notes=(),flags=()):self.key=key;self.title=title;self.group=group;self.members=members;self.fits=list(fits);self.notes=list(notes);self.flags=list(flags)

def asmFourth():
    """42073 riveted on 42072: the wheel on the leaves' top face (.320 from the pinion's tip), its bore round the collar (.280 to .320), the collar .005 proud"""
    T=HD()['p4']['st'];w=HD()['w4']['t']
    return Assembly('asmFourth','Fourth wheel and pinion (42073 complete)','Going train',
        [Member('fourthPinion',why='42072: the frame'),Member('fourthWheel',t=(0,0,T['collarEnd']-w),ex=(0,0,-6),why=f"42073's side view: on the leaves' top face ({inch(T['collarEnd']):.3f} from the tip), the collar through its bore")],
        fits=[('fourthWheel','fourthPinion','press',"the wheel's .100 bore on the collar .1000 ±.0003, riveted (42073 #13)")],
        notes=["The collar (.040 long) stands .005 proud of the wheel's face, as 42073's side view shows."])
def asmBarrel():
    """42168, 42169, 42170: the cap's flange on the barrel's open end, its spigot in the bore; the arbor's left boss on the barrel's boss"""
    B=HD()['ba'];C=HD()['cp'];A=HD()['bs'];I=lambda x:x*25.4
    zc=B['h']+I(.030)   # the cap's outer face: its flange (.030, audit C-3) lying on the barrel's end
    ins=(zc-C['bossH'])-B['bossH'];es=ins-A['overBosses']
    xb=I(.410)+A['span1000']-A['span720']   # the arbor's left boss face from its square end
    za=B['bossH']+es/2-xb   # the arbor's frame: its square end out through the floor, the endshake shared
    return Assembly('asmBarrel','Barrel, cap and arbor','Barrel and mainspring',
        [Member('barrel',why='42168: the frame'),Member('barrelCap',rot=[('x',180),('z',-90)],t=(0,0,zc),ex=(0,0,14),why="42169: its flange on the barrel's end, the spigot in the 1.500 bore"),
         Member('barrelArbor',t=(0,0,za),ex=(0,0,-30),why=f"42170: its .2295 bearings in the two .2300 bores, its bosses between the two boss faces ({inch(ins):.4f} apart against .530 over the bosses: endshake {inch(es):.4f} in)")],
        fits=[('barrelCap','barrel','touch',"the cap's spigot 1.500 +0/-.001 in the bore 1.500 +.002/-0, its flange on the end"),('barrelArbor','barrel','touch',"the .2295 bearing in the .2300 bore; its boss on the barrel's boss (endshake 0 as drawn)"),('barrelArbor','barrelCap','touch',"the .2295 bearing in the .2300 bore; its boss on the cap's boss")],
        notes=[f"Inside, the barrel's and cap's boss faces are {inch(ins):.4f} in apart; the arbor's bosses span .530 +0/-.002: endshake {inch(es):.4f} in ({es:.3f} mm) as drawn.",
               "Which end of the arbor the square goes out at is not on these sheets: built out through the barrel's floor (assumed)."],
        flags=['Which way the arbor faces: not on the sheets (assumed)'])
def asmSetup():
    """asmBarrel with the set-up ratchet 42026 on the arbor's square: its .115 square (+.001/-0) on the arbor's .110 (+.004/-0), both diamonds with their
    corners on the centre lines; along the square, its inner face at the square's inner end, on the pivot's shoulder (estimated: the barrel bridge between is not in the set)"""
    A=asmBarrel();S=HD()['bs'];t=HD()['sr']['t'];za=[m for m in A.members if m.key=='barrelArbor'][0].t[2]
    A.members.append(Member('setupRatchet',t=(0,0,za+S['sq']-t),ex=(0,0,-42),why=f"42026 on 42170's square: its .115 square on the .110 (clearance .001 to .006 across the flats), its face at the square's inner end, against the .1695 pivot's shoulder ({inch(S['sq']):.3f} from the arbor's end; estimated)"))
    A.fits.append(('setupRatchet','barrelArbor','clear',"the ratchet's .115 square on the arbor's .110 square"))
    A.key='asmSetup';A.title='Barrel, cap, arbor and set-up ratchet'
    A.notes.append("The set-up ratchet's place along the square is estimated: in the movement the barrel bridge (not in the set) stands between the barrel and the ratchet, the arbor's .1695 pivot in it.")
    A.flags.append("The set-up ratchet's place along the square: estimated")
    return A

def asmChain(spaces=9):
    """a short run of the fusee chain as 42001 lays it out: joint k at x = k × .0940; odd spaces a pair of outer plates (42246) at z 0-.0095 and .019-.0285,
    even spaces a centre link (42005) between them, the hooks' thin ends as the middle layer at the first and last joints (an odd number of spaces, as 42001's
    297), a pin (42004, .045 long) at every joint centred on the stack, upset flush in the real chain"""
    I=lambda x:x*25.4;P=HD()['cl']['pitch'];t=HD()['cl']['t'];tb=HD()['hk2']['tBody'];L=HD()['pn']['len'];M=[]
    for k in range(1,spaces+1):
        x=(k-1)*P
        if k%2:M+=[Member('outerLink',t=(x,0,0),ex=(0,0,-0.6),why=f'space {k}: outer plate below',label=f'Outer plate {k}a'),Member('outerLink',t=(x,0,2*t),ex=(0,0,0.6),why=f'space {k}: outer plate above',label=f'Outer plate {k}b')]
        else:M.append(Member('centreLink',t=(x,0,t),ex=(0,0,0),why=f'space {k}: the centre link, the middle layer',label=f'Centre link {k}'))
    for k in range(spaces+1):M.append(Member('linkPin',t=(k*P,0,1.5*t-L/2),ex=(0,0,1.6 if k%2 else -1.6),why=f'joint {k+1}: the pin, .045 long over the .0285 stack, {inch((L-3*t)/2):.5f} each end to upset',label=f'Pin {k+1}'))
    zb=1.5*t-tb/2
    M.append(Member('barrelHook',rot=[('z',180)],t=(0,0,zb),ex=(-1.5,0,0),why="42001: the barrel end's hook, turned so its tail points away from the chain and its mouth up; its thin end the middle layer of joint 1"))
    M.append(Member('fuseeHook',rot=[('x',180)],t=(spaces*P,0,zb+tb),ex=(1.5,0,0),why="42001: the fusee end's hook, turned over (its outline mirrored), its body pointing away from the chain; its thin end the middle layer of the last joint"))
    fits=[]
    for i,m in enumerate(M):
        for n in M[i+1:]:
            if {m.key,n.key}<={'outerLink','centreLink','linkPin','barrelHook','fuseeHook'} and 'linkPin' in (m.key,n.key):fits.append((m.label or m.key,n.label or n.key,'clear','the pin .0240 in the .0250 hole'))
    return Assembly('asmChain',f'Fusee chain, a run of {spaces} spaces','Fusee chain',M,fits=[],
        notes=[f"A run of {spaces} of the chain's 297 spaces (709 mm hook to hook), laid as 42001 lays it out: 3 plates at every joint, the outer plates in pairs on the odd spaces, a centre link on each even space.",
               'The outer plate 42246 is not in the set: built as the centre link (42001 draws them alike).','The real chain has its pins riveted flush and is hardened after assembling.'],
        flags=['The outer plates (42246): assumed as 42005'])

def Rz(deg):return bd.Location((0,0,0),(0,0,1),deg)
def Tr(x,y,z=0):return bd.Location((x,y,z))
def _wheel_work(base,swing=16.0):
    """42009 complete with pawls (audit B, the joints): placements in the sustaining wheel's frame put under base (a Location). The two winding pawls (42010) on
    the studs 42011 in holes 2 and 7, pawl B the 180° image, both swung counter-clockwise about their pivots by swing° toward the winding ratchet (the tip at
    r .3851 reaches the ratchet's tips, r .335, at 12.65° and its roots, r .3105, at 19.05°); on the plan face. The two pawl springs (42007): each one's row 3
    on the wheel's centre, so its datum (the pin, row 1) in hole 10 and its rows 16 and 17 over holes 9 and 8; the second the 180° image (holes 6, 4, 3)."""
    W=HD()['sw'];t=W['t'];h={x['n']:x['c'] for x in W['holes']};M=[]
    for k,(n,a) in enumerate(((2,0),(7,180))):
        M.append(Member('windingPawl',L=base*Tr(h[n][0],h[n][1],t)*Rz(a+swing),ex=(0,0,4),why=f"on the stud 42011 in 42009's hole {n}"+(' (the 180° image)' if a else '')+f", swung {swing:.0f}° to the winding ratchet",label=f"Winding pawl {'AB'[k]}"))
    for k,(n,a) in enumerate(((10,0),(6,180))):
        M.append(Member('windingPawlSpring',L=base*Rz(a)*Tr(h[10][0],h[10][1],t),ex=(0,0,6),why=f"42007's row 3 on the wheel's centre: its pin in hole {n}, its screws over holes {(9,8) if n==10 else (4,3)}",label=f"Winding pawl spring {k+1}"))
    return M
def asm42009():
    return Assembly('asm42009','Sustaining ratchet wheel complete with pawls (42009)','Maintaining and winding work',[Member('sustainingWheel',why='42009: the frame')]+_wheel_work(Location0()),
        fits=[('windingPawl','windingPawlSpring','preload',"the spring's tip on the pawl's .35 R edge: drawn free, it overlaps the pawl (the preload)"),('windingPawl','sustainingWheel','touch','on its face, on the stud'),('windingPawlSpring','sustainingWheel','touch','pinned and screwed on its face')],
        notes=['The studs 42011, the pins 35794 and the .0440-130 screws are not in the set: their holes only.',"Each spring is drawn free: its tip overlaps its pawl's edge, the preload it puts on the pawl."])
def Location0():return bd.Location((0,0,0))
def asmFusee():
    """the fusee arbor with its wheel and maintaining work, by the sheets (the audit's joints, B and A): the fusee wheel's left recess (.600 × .055) round the arbor's
    collar (.316 × .045), its central ring on the collar's left face, its bore .2300 on the .2295 body; the sustaining spring (.050) in the wheel's right recess (.055
    deep, on the .045 web), pin 1 in the wheel's .053 hole at r .610; the sustaining wheel (.050) on the rim land round the boss's .055 (its bore .3000 on the boss
    .2995), its hole 5 (r .616) on the spring's pin 9; the winding ratchet against the boss's end at the pawls' level"""
    I=lambda x:x*25.4;F=HD()['fw'];S_=HD()['ss'];A_=HD()['fa']['at'];t16={1:None}
    zf=A_['collar0']+I(.055)   # the wheel's left face: its recess floor (.055 deep) on the collar's left face
    Lw=Tr(0,0,zf)*bd.Location((0,0,0),(1,0,0),180)   # the wheel turned over: its left face toward the collar, its right face toward the arbor's pinion end
    # the spring: its row 11 (the centre pin 1 is .6100 from) on the axis, pin 1 (row 1, the datum) turned onto the wheel's hole (+Y)
    c=HD()['ss']['centre'];row11=[c[0]-0.0067*25.4,c[1]+0.0074*25.4]   # rows 5 and 11 (2.6167, 1.9926) and (2.61, 2.0): pin 1 from row 11, pin 9 from row 5 (audit B)
    al=90-math.degrees(math.atan2(-row11[1],-row11[0]))
    Ls=Lw*Tr(0,0,F['rimWeb'])*Rz(al)*Tr(-row11[0],-row11[1])
    h9=[h['c'] for h in S_['holes'] if h['n']==9][0];c5=c;import numpy as _np
    a9=math.radians(al);q=(h9[0]-row11[0],h9[1]-row11[1]);q=(q[0]*math.cos(a9)-q[1]*math.sin(a9),q[0]*math.sin(a9)+q[1]*math.cos(a9));be=math.degrees(math.atan2(q[1],q[0]))
    Lsw=Lw*Tr(0,0,F['t'])*Rz(be)   # the sustaining wheel on the rim land, its hole 5 (on +X, r .616) on the spring's pin 9
    rho=_ratchet_phase(Lsw)
    M=[Member('fuseeArbor',why='42022: the frame'),Member('fuseeWheel',L=Lw,ex=(0,0,-5),why="42015 turned over: its .600 × .055 recess round the arbor's .316 × .045 collar, its central ring on the collar's left face; its bore .2300 on the .2295 body"),
       Member('sustainingSpring',L=Ls,ex=(0,0,-9),why=f"42016 in the wheel's right recess on the .045 web (.050 in .055), pin 1 in the wheel's .053 hole at r .610"),
       Member('sustainingWheel',L=Lsw,ex=(0,0,-13),why=f"42009 on the wheel's rim land, its .3000 bore round the boss's .2995 (the boss stands .055, the wheel .050), turned {be:.1f}° so its hole 5 takes the spring's pin 9"),
       Member('windingRatchet',L=Lsw*Tr(0,0,HD()['sw']['t'])*Rz(rho),ex=(0,0,-22),why=f"42013 against the boss's end (.150 from the wheel's left face), its .230 bore on the .2295 body, at the pawls' level; turned {rho:.1f}° to meet the pawls")]
    for m in _wheel_work(Lsw):m.ex=(0,0,-17);M.append(m)
    return Assembly('asmFusee','Fusee arbor, wheel and maintaining work','Fusee',M,
        fits=[('fuseeWheel','fuseeArbor','clear','the .2300 bore on the .2295 body; the recess round the collar, its ring on the collar\'s left face'),('sustainingSpring','fuseeWheel','tangent',"on the web, in the .055 recess; its outer edge R .7000 against the recess's R .700 (the arc through the table's points a few µm over)"),
              ('sustainingWheel','fuseeWheel','touch','on the rim land, round the boss'),('windingRatchet','fuseeArbor','clear','the .230 bore on the .2295 body'),('windingRatchet','fuseeWheel','touch',"against the boss's end"),
              ('windingPawl','windingPawlSpring','preload',"the spring's tip on the pawl, drawn free"),('windingPawl','sustainingWheel','touch','on its face'),('windingPawlSpring','sustainingWheel','touch','on its face'),
              ('windingPawl','windingRatchet','touch','the pawl\'s tip in a tooth'),('sustainingSpring','sustainingWheel','touch','under it in the recess')],
        notes=["The wheel's recess round the collar is the audit's inference from the sizes (.600 × .055 over .316 × .045; the central ring Ø .320 just over the collar's .316): no sheet says so.",
               'The sustaining spring is drawn free: its pins 75.0° apart; in the work it is wound up by the mainspring\'s pull, so its pin 9 and the sustaining wheel turn from where they are built.',
               "How the winding ratchet is fixed to the arbor is not on these sheets: the taper pin 42020's hole at .425 is beyond it, likely for a part not in the set.",
               'The fusee cone, the chain\'s hook pin and 42018 (pressed on the end) are not in the set.'],
        flags=["The wheel's recess round the collar: inferred from the sizes","The pawls' swing and the ratchet's turn: set so they meet (the work's state, not drawn)"])
def _ratchet_phase(Lsw,swing=16.0):
    """the winding ratchet's turn (degrees, 0 to one pitch) that leaves the pawls' tips clear of its teeth by the least: searched every 0.1°"""
    r=windingRatchet().build();pw=windingPawl().build();W=HD()['sw'];t=W['t'];h={x['n']:x['c'] for x in W['holes']}
    P=[pw.moved(Tr(h[n][0],h[n][1],t)*Rz(a+swing)) for n,a in ((2,0),(7,180))];best=None
    for i in range(90):
        a=i*0.1;q=r.moved(Tr(0,0,t)*Rz(a));v=sum((q&x).volume for x in P)
        if v<1e-6:
            g=min(q.distance_to(x) for x in P)
            if best is None or g<best[1]:best=(a,g)
    return best[0] if best else 0.0

ASSEMBLIES=[asmFourth,asmBarrel,asmSetup,asmChain,asm42009,asmFusee,asmDetent]

RECIPES+=[('Detent assembly (placeholders)',_placeholder(h,t)) for h,t in DET_PARTS]
