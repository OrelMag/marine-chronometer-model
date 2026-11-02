"""The Hamilton Model 21's parts as Hamilton Watch Co. drew them (2 November 2026; PLAN-hamilton-drawings.md, the NAWCC's 26 sheets): each part a recipe built
from js/hdims.js (HD, the drawn sizes in mm from the sheets' inches, each with its "NNNNN #item"; the transcriptions in References/Hamilton-original-drawings/
transcriptions/) and nothing else: no L, HK, FK or movement.js, so the parts are the drawings' own, apart from the model and its rescale. They are not in the
model yet: hamilton_parts.py builds them, checks them and writes the viewer's data (marine-chronometer-source/hamilton-parts/), STEP files and operation sheets.

Frames: a turned part's axis is Z, its first end at Z 0 (the end the sheet's dimensions start from); a flat part lies in XY in the sheet's own frame (x right,
y up the sheet, its datum 2.0000, 2.0000 at 0, 0), its first face at Z 0. Where the sheets give no tooth form (a wheel's or pinion's: only z, m and the tips),
the teeth are core.js gearOutline's cycloidal form (BS 978 Part 2's proportions), its addendum run out to the drawn tips: an estimate, said on each part."""
import functools,json,math,pathlib,subprocess
import build123d as bd
from . import (Op,Recipe,Setup,S,page_matrix,Blank,TurnProfile,TurnCone,CutLeaves,Plate,Hole,Countersink,Cut,Bore)
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
        sq=bd.Box(self.a,self.a,self.z1-self.z0+0.02,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((0,0,self.z0-0.01)))
        return p-(ring-sq)

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
       (r(H['boss']['d']),xb),(r(H['boss']['d']),xb+H['boss']['t']),(r(H['bodyD']),xb+H['boss']['t']),(r(H['bodyD']),xr-H['boss']['t']),(r(H['boss']['d']),xr-H['boss']['t']),
       (r(H['boss']['d']),xr),(r(H['bear']),xr),(r(H['bear']),xs),(r(H['piv']),xs),(r(H['piv']),H['len']),(0,H['len'])]
    s0,s1=xb+I(.325)-H['slot']['w'],xb+I(.325);sd=I(.070)
    def slot():   # the hook's slot: .120 wide along the arbor in the .520 body, cut flat to a depth the sheet doesn't print (about .070 on its scale)
        return bd.Box(20,20,s1-s0,align=(bd.Align.CENTER,bd.Align.MIN,bd.Align.MIN)).moved(bd.Location((0,r(H['bodyD'])-sd,s0)))
    ops=[Blank(H['bodyD']+0.4,0,H['len'],'Cut the blank from steel bar between centres',[S('length',fx(H['len'],2),'±.01 in',src+' #1'),S('bar','Ø about 13.6','not given: the .520 body and 0.2',src)],src),
         TurnProfile(P,'Turn the arbor: the square end as a round of the corners, the pivots, the bearings, the bosses and the body',
           [S('square end',f"Ø {fx(H['sqAC'],3)} (over the corners) for {fx(H['sq'],3)}",'+.005/-0 in',src+' #2'),
            S('left pivot',f"Ø {fx(H['piv'])} for {fx(H['pivL'],3)}",'+0/-.0003 in; polish',src+' #3'),
            S('bearings',f"Ø {fx(H['bear'])}, the left to the boss, the right {fx(xs-xr,3)} long",'+0/-.0003 in; polish',src+' #4'),
            S('bosses',f"Ø {fx(H['boss']['d'],3)} × {fx(H['boss']['t'],3)} each side of the body; {fx(H['overBosses'],3)} over both",'+0/-.002 in',src+' #6'),
            S('body (the spring collar)',f"Ø {fx(H['bodyD'],3)}",'the coils seat on it',src+' #9'),
            S('spans',f"{fx(H['span720'],3)} left boss face to the right shoulder; {fx(H['span870'],3)} from .540; {fx(H['span1000'],3)} from .410",'±.001, ±.002, ±.003 in',src+' #5, #6'),
            S('right pivot',f"Ø {fx(H['piv'])} for {fx(H['len']-xs,3)}",'+0/-.0003 in; polish',src+' #8')],src),
         TurnCone(r(H['piv'])-I(.005),H['sq'],r(H['piv']),H['sq']+I(.005),'Chamfer the left pivot at the shoulder',[S('','.005 × 45°',None,src+' #2')],src),
         Dome(0,H['sqAC'],-1,"Dome the square's end",[S('end','domed, polished','its radius not given: R .145 (estimated)',src+' #2')],src),
         Dome(H['len'],H['piv'],1,"Dome the right pivot's end",[S('end','domed, polished','its radius not given: R .1695 (estimated)',src+' #8')],src),
         MillSquare(H['sqAF'],0,H['sq'],'Mill the square',[S('',f"{fx(H['sqAF'],3)} across the flats",'+.004/-0 in',src+' #2'),S('length',fx(H['sq'],3),None,src+' #2')],src),
         Cut(slot,"Mill the hook's slot in the body",[S('width',fx(H['slot']['w'],3),'±.002 in',src+' #7'),S('place',f"its far edge {fx(I(.325),3)} from the left boss's outer face",None,src+' #7 (re-read 1 Nov 2026)'),
            S('depth',fx(sd,3),'not printed: about .070 on the scale (unsure)',src)],src)]
    rc=Recipe('barrelArbor','42170','Barrel arbor',src+' (memos 10-22-43, 4-29-44)','steel, "S.A.E. 10120" as written (probably 1020 or 10L20)','polish the pivots and bearings',
        [Setup('1','between centres; the square and the slot milled in a dividing head',ops)],ID,
        notes=["The end view's \"START SPIRAL\" ramp on the body (a 1.00 R arc, a step of .022, 30° and 45°, .090, .150, .210) is not built: which number is which of the ramp's lengths is unsure (42170 transcription, item 9).",
               'The coils seat on the .520 body: a core radius of .260 in = 6.604 mm.'],
        fits=['the pivots .1695 +0/-.0003 in the barrel bridge and pillar plate','the barrel (42168) and its cap (42169) turn on the .2295 bearings: their bores .2300 +.0003/-0'])
    return _flags(rc,['Hook slot depth: not printed (unsure, about .070)','Domed ends: radius not given (estimated)','Start-spiral ramp: not built (unsure readings)'])

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
    A=[math.radians(a) for a in (0,H['gapUp'],H['gapUp']+H['gapRest'],H['gapUp']+2*H['gapRest'],360-H['gapDn'])]
    with bd.BuildSketch() as sk:bd.Circle(H['od']/2+0.2)
    ops=[Plate(sk.sketch.faces()[0],H['t'],'Cut the blank from brass sheet',[S('thickness',fx(H['t'],3),'+0/-.002 in',src+' #11')],src),
         CutLeaves(xy,H['od']/2+0.3,0,H['t'],f'Cut the {z} teeth',[S('teeth',f'{z}, module {m:.4f} mm',None,src+' #1, #2'),S('over the tips',f"Ø {fx(H['od'])}",'+.0010/-.0020 in',src+' #4'),
            S('cutter','the same cutter as for the third wheel, 42071','42071 is not in the set',src+' #3'),
            S('tooth form',f"cycloidal (BS 978 Part 2: radial flanks, epicycloidal addendum for a 10-leaf pinion) run out to the drawn tips: the form reaches Ø {2*ro:.3f}",'estimated: the sheet gives no form','core.js gearOutline')],src,z=z),
         Cut(lambda:_spoke_windows(A,H['hubD']/2,H['rimId']/2,H['spokeHub'],H['spokeRim'],H['t']),'Cross it out: five spokes, tapered',
           [S('rim inside',f"Ø {fx(H['rimId'],3)}",None,src+' #5'),S('hub',f"Ø {fx(H['hubD'],3)}",None,src+' #6'),S('spokes',f"{fx(H['spokeHub'],3)} wide at the hub to {fx(H['spokeRim'],3)} at the rim",None,src+' #7, #8'),
            S('spoke angles','75° above and 72° below the horizontal spoke, between centre lines',None,src+' #9, #10'),S('the other two',f"{H['gapRest']:.0f}° apart, evenly in the undrawn half",'not dimensioned (estimated)',src)],src,at=(0,0)),
         Hole((0,0),H['hubUp'],'in',H['t'],None,"Bore the hole for the pinion's collar",[S('',f"Ø {fx(H['hubUp'])}",'the collar .1000 ±.0003 through it (42072 #8)',src+' #12 (re-read 1 Nov 2026: a diameter)')],src,key='bore')]
    rc=Recipe('fourthWheel','42073','Fourth wheel',src+' (8-1-41; revised 8-11-41, 8-27-41; memos 11-24-41, 4-19-43)','brass','24K gold plate (the wheel only)',
        [Setup('1','on the wheel-cutting engine, then crossed out and bored',ops,view='top')],ID,
        fits=["riveted on the pinion 42072: on the leaves' top face, its collar .040 long through the bore, .005 proud (42073's side view)",'runout not to exceed .001 (#14)'],
        notes=[f"Tip reached by the tooth form: Ø {2*ro:.4f} mm against the drawn {H['od']:.4f} (+.0254/-.0508); the form's addendum is {ha:.3f} m."])
    rc.flat=True;rc.od={'d':H['od'],'tol':[-.0020*25.4,.0010*25.4]};return _flags(rc,['Tooth form: estimated (BS 978 cycloidal; the sheet gives none)','The two spokes of the undrawn half: not dimensioned (estimated, 71° each)'])
def fourthPinion():
    H=HD()['p4'];T=H['st'];src='42072-1-01';z,m=H['leaves'],H['m'];rp=m*z/2;ext=H['tip']/2-(rp+0.525*m)
    xy,ro,ri=gear_outline(z,m,ext=ext)
    R=lambda d:d/2
    # the turned profile from the top pivot's tip (z 0) down, as the drawn-parts branch read the sheet (movement.js there, F4P's turn list): the stem's
    # diameters' places are its likely reading (the transcription's Verification: .0565 under the top cone, .0583 above the collar)
    P=[(0,0),(R(H['pivTop']),0),(R(H['pivTop']),H['pivTopLen']),(R(H['stem']),H['pivTopLen']),(R(H['shTop']),T['coneEnd']),(R(H['shTop']),T['stemAbove']),(R(H['stemAbove']),T['stemAbove']),
       (R(H['stemAbove']),T['collarTop']),(R(H['collar'])-T['chamf'],T['collarTop']),(R(H['collar']),T['collarTop']+T['chamf']),(R(H['collar']),T['collarEnd']),(ro+0.02,T['collarEnd']),
       (ro+0.02,T['leavesEnd']),(R(H['lowSh']),T['leavesEnd']),(R(H['lowSh']),T['lowCone']),(R(H['lowStem']),T['lowEnd']),(R(H['pivLow']),T['lowEnd']),(R(H['pivLow']),T['tailStep']),
       (R(H['pivTail']),T['tailStep']),(R(H['pivTail']),H['len']),(0,H['len'])]
    ops=[Blank(H['tip']+0.3,0,H['len'],'Cut the blank from drill rod between centres',[S('length',fx(H['len'],3),None,src+' #17')],src),
         TurnProfile(P,'Turn the arbor: the pivots, the top shoulder with its 60° cone, the stem, the collar, the head of the pinion, the lower shoulder and cone',
           [S('top pivot',f"Ø {fx(H['pivTop'])} for {fx(H['pivTopLen'],3)}",'+0/-.0002 in; polish',src+' #3, #16'),S('top shoulder',f"Ø {fx(H['stem'])} flat, a 60° cone to Ø {fx(H['shTop'])}",'±.0005, ±.0003 in',src+' #4, #5, #14'),
            S('stem above the collar',f"Ø {fx(H['stemAbove'])} from {fx(T['stemAbove'],3)}",'its start read off the drawn line ±.005 (unsure)',src+' #6'),
            S('collar',f"Ø {fx(H['collar'])}, {fx(T['collarEnd']-T['collarTop'],3)} long, its top chamfered to a Ø .0990 flat",'±.0003 in; the chamfer likely',src+' #7, #8, #21'),
            S('leaves',f"{fx(T['leavesEnd']-T['collarEnd'],3)} long, from {fx(T['collarEnd'],3)} to {fx(T['leavesEnd'],3)} from the tip",None,src+' #18, #20 (lengths re-read 1 Nov 2026)'),
            S('lower shoulder',f"Ø {fx(H['lowSh'],3)}, a 60° cone to Ø {fx(H['lowStem'])} at {fx(T['lowEnd'],3)}",'±.002 in',src+' #10, #11, #15, #19'),
            S('lower pivot',f"Ø {fx(H['pivLow'])}, the last {fx(H['len']-T['tailStep'],3)} Ø {fx(H['pivTail'])}",'+0/-.0002, +0/-.0005 in; the step read off the drawing (unsure)',src+' #12, #13, #22')],src),
         CutLeaves(xy,ro+0.05,T['collarEnd'],T['leavesEnd'],f'Cut the {z} leaves and polish them',[S('leaves',f'{z}, module {m:.4f} mm',None,src+' #1, #2'),S('over the tips',f"Ø {fx(H['tip'])}",'+.0005/-.0010 in',src+' #9'),
            S('leaf form',f"round-tipped cycloidal leaf 1.05 m thick, its flanks run straight {ext:.3f} mm past the pitch circle to reach the drawn tips",'estimated: the sheet gives no form',"core.js gearOutline's o.ext (the drawn-parts branch)")],src,z=z)]
    rc=Recipe('fourthPinion','42072','Fourth pinion',src+' (redrawn; 7-31-57, 9-11-63)','drill rod','polish at five places: the top pivot, the stem, the pinion, the lower shoulder, the lower pivot',
        [Setup('1','between centres; the leaves cut on a pinion-cutting engine, the pivots finished in a Jacot tool',ops)],ID,
        fits=['the fourth wheel 42073 riveted on the collar (#13 of 42073)','meshes with the third wheel (THIRD WHEEL on the sheet)'],
        notes=["The drawn-parts branch found the drawn tips (.1290) mesh badly with the third wheel's generic teeth when the leaf is run out straight (91 % approach, a ripple 0.80-1.07): the model keeps the stock leaf there; built here as drawn (Review-results.md on that branch).",
               'UNDERTURN on the sheet: which stem diameter is the undercut is unsure (42072 transcription).'])
    rc.od={'d':H['tip'],'tol':[-.0010*25.4,.0005*25.4]};return _flags(rc,['Leaf form: estimated (the drawn tips need a leaf run out 0.09 mm)','Which stem diameter sits where: likely, not sure'])

RECIPES=[('Going train',fourthWheel),('Going train',fourthPinion),('Maintaining and winding work',windingPawl),('Barrel and mainspring',barrelArbor)]
