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
            S('hand','the teeth face as built here: the sheets\' hand not dimensioned','estimated',src)]
def windingRatchet():
    H=HD()['wr'];src='42013-1-01';f,land=ratchet_face(H['z'],H['od']/2,H['root']/2,H['offset'],H['ramp']);t=H['t']
    cb=(H['csk']-H['hole'])/2;cbd=H['cskDepth']-cb   # the .146 counterbore's straight wall, then the 45° cone to the .077 at .060 deep, the .077 land below it
    ops=[Plate(f,t,'Cut the blank from 1.00 carbon steel and cut the 40 teeth',[S('thickness',fx(t,3),'+0/-.002 in',src+' #10')]+_ratchet_sizes(src,H['z'],H['od']/2,H['root']/2,H['offset'],H['ramp'],land,(1,2,3,5,4)),src),
         Hole((0,0),H['bore'],'in',t,None,'Bore it',[S('',f"Ø {fx(H['bore'],3)}",'+.001/-0 in',src+' #6')],src,key='bore')]
    for i,x in enumerate((-H['pitch']/2,H['pitch']/2)):
        ops+=[Hole((x,0),H['hole'],'in',t,None,f'Drill screw hole {i+1}',[S('',f"Ø {fx(H['hole'],3)}",'±.001 in',src+' #9'),S('place',f"{fx(H['pitch'],3)} apart on the horizontal through the centre",None,src+' #7')],src,key=f's{i+1}'),
              Hole((x,0),H['csk'],'out',t,cbd,f'Counterbore and countersink it',[S('',f"Ø {fx(H['csk'],3)}, 45°, to {fx(H['cskDepth'],3)} deep; the .077 land below",'±.002 in; the depth likely',src+' #8, #11')],src)]
        from . import Cone
        ops.append(Cone((x,0),H['csk']/2,H['hole']/2,'out',t,cb,'',[],src,z0=t-cbd))
    rc=Recipe('windingRatchet','42013','Winding ratchet',src,'1.00 carbon steel','harden and draw; #00 crocus finish; oxidize black all over',[Setup('1','on the wheel-cutting engine; bored, drilled, counterbored',ops,view='top')],ID,
        fits=['on the fusee arbor (42022): .230 +.001/-0 over its .2295 bearing','two screws through the counterbored holes'])
    rc.flat=True;rc.od={'d':H['od'],'tol':[-.002*25.4,.002*25.4]};return _flags(rc,["Which way the teeth face: not dimensioned (estimated)","The counterbore's straight wall depth: derived from the .060 and a 90° cone (likely)"])
def setupRatchet():
    H=HD()['sr'];src='42026-1-01';f,land=ratchet_face(H['z'],H['od']/2,H['root']/2,H['offset'],H['ramp']);t=H['t'];a=H['sqAF']/2
    sq=lambda:bd.extrude(bd.Face(bd.Wire.make_polygon([bd.Vector(0,a*math.sqrt(2),-0.01),bd.Vector(-a*math.sqrt(2),0,-0.01),bd.Vector(0,-a*math.sqrt(2),-0.01),bd.Vector(a*math.sqrt(2),0,-0.01)],close=True)),t+0.02,dir=(0,0,1))
    ops=[Plate(f,t,'Cut the blank from steel SAE 1095 and cut the 40 teeth',[S('thickness',fx(t,3),'+0/-.002 in',src+' #10')]+_ratchet_sizes(src,H['z'],H['od']/2,H['root']/2,H['offset'],H['ramp'],land,(1,3,4,9,2)),src),
         Cut(sq,'Broach the square hole, turned 45° (a diamond as drawn)',[S('',f"{fx(H['sqAF'],3)} across the flats",'+.001/-0 in',src+' #5'),S('across the corners',f"{fx(H['sqAF']*math.sqrt(2),4)} sharp",f"≥ .155 MINIMUM (#6)",src+' #6')],src,at=(0,0))]
    rc=Recipe('setupRatchet','42026','Set-up ratchet',src,'steel, SAE 1095','nickel plate; a ray (finish-line) pattern on the face',[Setup('1','on the wheel-cutting engine; the square broached',ops,view='top')],ID,
        fits=["on the barrel arbor's square (42170: .110 +.004/-0 across the flats)"],notes=['The finish lines (.220 R, .235) are surface marks: not cut.'])
    rc.flat=True;rc.od={'d':H['od'],'tol':[-.002*25.4,.002*25.4]};return _flags(rc,["Which way the teeth face: not dimensioned (estimated)","Its 40 teeth against the 42 counted on videos: the sheet's"])
def sustainingWheel():
    H=HD()['sw'];src='42009-2-01';f,land=ratchet_face(H['z'],H['od']/2,H['root']/2,H['offset'],H['ramp']);t=H['t']
    ops=[Plate(f,t,'Cut the blank from brass and cut the 120 teeth',[S('thickness',fx(t,3),'+0/-.002 in',src+' #6')]+_ratchet_sizes(src,H['z'],H['od']/2,H['root']/2,H['offset'],H['ramp'],land,(1,2,3,4,1)),src),
         Hole((0,0),H['bore'],'in',t,None,'Bore it; break the corner both sides',[S('',f"Ø {fx(H['bore'])}",'+.0003/-0 in',src+' #5'),S('corners','broken both sides','the amount not given',src+' #5')],src,key='bore')]
    what={2:'stud 42011 (.0400) for a winding pawl: press fit',7:'stud 42011 for the other pawl',11:'plain',12:'plain',6:'spring pin 35794 (.0498): press',10:'spring pin 35794: press',
          3:'pawl spring screw (.0440-130)',4:'pawl spring screw',8:'pawl spring screw',9:'pawl spring screw',5:"the sustaining spring's pin (42017), likely"}
    items={2:'#7',7:'#7',11:'#8',12:'#8',6:'#9',10:'#9',3:'#10',4:'#10',8:'#10',9:'#10',5:'#11'}
    from . import Cone
    for h in H['holes']:
        n=h['n'];x,y=h['c']
        ops.append(Hole((x,y),h['d'],'in',t,None,f'Drill hole {n} by the table',[S('',f"Ø {fx(h['d'])} at ({inch(x):+.4f}, {inch(y):+.4f}) in from the centre",'by the sheet',src+' '+items[n]),S('for',what[n],None,src)],src,key=n))
        if n in(3,4,8,9):ops.append(Cone((x,y),H['csk']/2,h['d']/2,'out',t,(H['csk']-h['d'])/2,f'Countersink hole {n}',[S('',f"Ø {fx(H['csk'],3)} at the face, 45°",None,src+' #10')],src))
    rc=Recipe('sustainingWheel','42009','Sustaining ratchet wheel',src+' (6-18-41; revised 7-31-41; memos to 4-2-43)','brass','24K gold plate (the wheel only); X-fine circular line finish',
        [Setup('1','on the wheel-cutting engine; the holes on a jig borer by the table',ops,view='top')],ID,
        fits=['the winding pawls (42010) riveted on studs 42011 in holes 2 and 7: free to turn, about .002 endshake (#7)','on the fusee wheel\'s hub: .3000 +.0003/-0'],
        notes=['The holes are by the sheet\'s table: every one but hole 5 has its image across the centre.','Which face the countersinks are on: not dimensioned (built on the outer face).'])
    rc.flat=True;rc.od={'d':H['od'],'tol':[0,.003*25.4]};return _flags(rc,["Which way the teeth face: not dimensioned (estimated)","Hole 5's size: likely (.060 read at the section's right hole)"])

# ======================= 42015-2-01 fusee wheel, 42022-2-01 fusee arbor =======================
def fuseeWheel():
    H=HD()['fw'];src='42015-2-01';I=lambda x:x*25.4;R=lambda d:d/2;z,m=H['z'],H['m'];rp=m*z/2;ha=(H['od']/2-rp)/m
    xy,ro,ri=gear_outline(z,m,mate=14,ha=ha)
    tr=H['t']-H['toothStep'];dz=H['t']-H['discStep'];wb=H['rimWeb']
    # the section, z from the left face (the stepped recess's) to the rim land's right face, as its 1 November 2026 re-read has it
    P=[(R(H['bore']),0),(R(H['boss']),0),(R(H['boss']),H['dep320']),(R(H['stepC']),H['dep320']),(R(H['stepC']),H['dep470']),(R(H['stepB']),H['dep470']),(R(H['stepB']),H['dep600']),(R(H['stepA']),H['dep600']),
       (R(H['stepA']),0),(ro+0.05,0),(ro+0.05,tr),(R(H['root']),tr),(R(H['root']),H['t']),(R(H['recess']),H['t']),(R(H['recess']),wb),(R(H['disc']),wb),(R(H['disc']),dz),(R(H['boss']),dz),
       (R(H['boss']),H['bossLen']),(R(H['bore']),H['bossLen'])]
    hx,hy=0,H['hole']['r']
    ops=[Blank(H['od']+0.4,0,H['bossLen'],'Cut the blank from brass',[S('','Ø about 41.4, .150 thick over the boss','not given',src)],src),
         TurnProfile(P,'Turn both faces: the rim land, the tooth ring .005 under it, the right recess and its web, the central disc, the boss; the left face\'s three steps',
           [S('rim land',f"{fx(H['t'],3)} thick, from Ø {fx(H['recess'],3)} to Ø {fx(H['root'],3)}",'+0/-.001 in',src+' #12, #4, #5'),S('tooth ring',f".005 under the rim land on the right face",None,src+' #13'),
            S('web',f"{fx(wb,3)} inside the Ø {fx(H['recess'],3)} recess",'+0/-.002 in',src+' #17'),S('central disc',f"Ø {fx(H['disc'],3)}, .005 under the rim land",'+0/-.005 in',src+' #6, #14'),
            S('boss',f"Ø {fx(H['boss'])}, to {fx(H['bossLen'],3)} from the left face",'+0/-.0003, +0/-.002 in',src+' #10, #15'),
            S('left face',f"steps Ø .600 {fx(H['dep600'],3)} deep, Ø .470 {fx(H['dep470'],3)}, Ø .320 {fx(H['dep320'],3)}; the web .040 behind",'the depths read off the scale ±.004 (likely)',src+' #7, #8, #9, #16, #18')],src),
         CutLeaves(xy,ro+0.1,-0.01,tr+0.01,f'Cut the {z} teeth',[S('teeth',f'{z}, module {m:.4f} mm',None,src+' #1, #2'),S('over the tips',f"Ø {fx(H['od'],3)}",'+.001/-.002 in',src+' #3'),
            S('tooth form',f"cycloidal (BS 978 Part 2) for the centre pinion of 14, run out to the drawn tips: the form reaches Ø {2*ro:.3f}",'estimated: the sheet gives no form','core.js gearOutline')],src,z=z),
         Bore(H['bore'],-0.01,H['bossLen']+0.01,'Bore it; break the corners both sides',[S('',f"Ø {fx(H['bore'])}",'+.0003/-0 in',src+' #11'),S('corners','broken both sides','the amount not given',src+' #21')],src),
         Hole((hx,hy),H['hole']['d'],'in',wb,None,'Drill the hole in the web',[S('',f"Ø {fx(H['hole']['d'],3)} at r {fx(H['hole']['r'])}",'±.001 in',src+' #19, #20'),S('angle','above the centre as drawn','its angle against the teeth not given',src)],src,key='web')]
    rc=Recipe('fuseeWheel','42015','Fusee wheel',src,'brass','24K gold plate',[Setup('1','in the chuck: both faces turned, then the teeth on the wheel-cutting engine; the hole drilled',ops)],ID,
        fits=['on the fusee arbor\'s .2295 body: .2300 +.0003/-0'],notes=[f"Tip reached by the tooth form: Ø {2*ro:.4f} mm against the drawn {H['od']:.4f}; the form's addendum is {ha:.3f} m.",
        "The .053 hole at r .610 (in the web) is likely the sustaining spring's pin's (42016)."])
    rc.od={'d':H['od'],'tol':[-.002*25.4,.001*25.4]};return _flags(rc,['Tooth form: estimated (BS 978 cycloidal; the sheet gives none)',"The left face's step depths: read off the scale ±.004 (likely)",'Which .005 belongs to which face: likely'])
def fuseeArbor():
    H=HD()['fa'];A=H['at'];src='42022-2-01';R=lambda d:d/2;I=lambda x:x*25.4
    P=[(0,0),(R(H['pressBore'])+I(.0005),0),(R(H['pressBore'])+I(.0005),A['pin']),(R(H['bear']),A['pin']),(R(H['bear']),A['step']),(R(H['bodyS']),A['step']),(R(H['bodyS']),A['collar0']),(R(H['collarD']),A['collar0']),
       (R(H['collarD']),A['collar1']),(R(H['bodyS']),A['collar1']),(R(H['bodyS']),A['knurl0']),(R(H['bodyL']),A['knurl0']),(R(H['bodyL']),A['knurl1']),(R(H['bodyS']),A['knurl1']),(R(H['bodyS']),A['shank']),
       (R(H['bear']),A['shank']),(R(H['bear']),A['sq']),(R(H['shankD']),A['sq']),(R(H['shankD']),A['end']),(0,A['end'])]
    xc=A['collar1']-H['holeToCollar']
    from . import Drill
    ops=[Blank(H['collarD']+0.4,0,H['len'],'Cut the blank from drill rod between centres',[S('length',fx(H['len'],3),None,src+' #1')],src),
         TurnProfile(P,'Turn the arbor: the spigot for 42018, the bearings, the body, the collar, the knurl\'s band, the shank, the round for the square',
           [S('spigot for 42018',f"Ø .0500 for {fx(A['pin'],3)}: 42018 pressed on it (its bore .0490)",'±.0002 in; likely',src+' #20'),
            S('bearings',f"Ø {fx(H['bear'])}, the left from {fx(A['pin'],3)} to {fx(A['step'],3)}, the shank {fx(H['shank'],3)}",'+0/-.0003 in; polish',src+' #5, #11, #14'),
            S('body',f"Ø {fx(H['bodyS'])}, {fx(H['body'],3)} from the step",'+0/-.0003, ±.001 in',src+' #3, #15'),S('collar',f"Ø {fx(H['collarD'],3)} × {fx(H['collarT'],3)}, its right face {fx(H['bodyLeft'],3)} from the step",'±.001 in',src+' #6, #8, #16'),
            S('knurl band',f"Ø {fx(H['bodyL'])} × {fx(H['knurlW'],3)}, {fx(H['gap'],3)} after the collar",'±.0002 in',src+' #9, #10, #17'),S('round for the square',f"Ø {fx(H['shankD'],3)} × {fx(H['square'],3)}",'+.005/-0 in',src+' #12, #19')],src),
         MillSquare(H['sqAF'],A['sq'],A['end']+0.01,'Mill the square',[S('',f"{fx(H['sqAF'],3)} across the flats",'+.004/-0 in',src+' #18')],src),
         TurnCone(R(H['shankD'])-H['chamf'],A['end'],R(H['shankD'])+0.2,A['end']-H['chamf']-0.2,'Chamfer the square\'s end',[S('','.005 × 45°','the detail\'s .010 also printed (likely the same chamfer)',src+' #13, #23')],src),
         Drill((-5,0,xc),(1,0,0),H['cross'],10,'Drill and taper broach the cross hole for the taper pin 42020',[S('',f"Ø {fx(H['cross'],3)}",'+0/-.001 in',src+' #21'),S('place',f"{fx(H['holeToCollar'],3)} from the collar's right face",'±.001 in',src+' #7')],src,key='cross')]
    rc=Recipe('fuseeArbor','42022','Fusee arbor',src,'drill rod','polish the bearings and the shank; straight knurl, about 100 teeth an inch, on the .2500 band',
        [Setup('1','between centres; the square milled and the cross hole drilled in a fixture; the knurl rolled',ops)],ID,
        fits=['the fusee wheel (42015) on the .2295 body','42018 pressed on the .0500 spigot','the winding ratchet (42013) on the .1695 bearing'],
        notes=['The knurl (straight, about 100 a inch) is a note, not cut in the solid: the band is turned to its .2500.'])
    return _flags(rc,['The left end: a .0500 spigot that 42018 presses on (likely)','Knurl: not modelled (a note)'])

# ======================= 42168 barrel, 42169 barrel cap =======================
def _centre_boss(H,zfloor,ztop,inner):
    """the barrel's and cap's centre as both sheets draw it: the outer face's cone from the bore out to .320, .025 deep (60° to the axis); the boss's flat top Ø
    .340, a 45° cone from it down to the floor; the .010 land at the bore's inner corner"""
    R=lambda d:d/2;rb,rc,rt=R(H['bore']),R(H['coneOut']),R(H['bossTop']);rf=rt+(ztop-zfloor)
    return [(rb,H['cone'] if 'cone' in H else 25.4*.025),(rc,0)],[(rf,zfloor),(rt,ztop),(rb+H['land'],ztop),(rb,ztop-H['land'])]
def barrel():
    H=HD()['ba'];src='42168-2-01';R=lambda d:d/2;I=lambda x:x*25.4
    outer,inner=_centre_boss(H,H['floor'],H['bossH'],True)
    P=outer+[(R(H['od']),0),(R(H['od']),H['h']-H['lipH']),(R(H['lipD']),H['h']-H['lipH']),(R(H['lipD']),H['h']),(R(H['id']),H['h']),(R(H['id']),H['floor'])]+inner
    from . import Drill,iso
    ops=[Blank(H['od']+0.4,0,H['h'],'Cast the blank in yellow brass',[S('','cast','',src)],src),
         TurnProfile(P,'Turn it: the outside, the lip for the cap, the bore, the floor, the centre boss and its cones',
           [S('outside',f"Ø {fx(H['od'],3)}",'±.003 in',src+' #4'),S('lip',f"Ø {fx(H['lipD'],3)} for {fx(H['lipH'],3)}",'±.003 in; .080 at the top of the section, .090 +0/-.005 at the bottom (unsure)',src+' #2, #5, #16'),
            S('bore',f"Ø {fx(H['id'],3)}",'+.002/-0 in',src+' #6'),S('height',fx(H['h'],3),'±.002 in',src+' #1'),S('floor',fx(H['floor'],3),'±.001 in',src+' #3'),
            S('boss',f"its top Ø {fx(H['bossTop'],3)} at {fx(H['bossH'],3)} from the floor's outside face, a 45° cone to the floor; the outer face's cone to Ø {fx(H['coneOut'],3)}, .025 deep",'+.002/-0 in; likely',src+' #9, #11, #12')],src),
         Bore(H['bore'],-0.01,H['bossH']+0.01,'Bore the centre hole',[S('',f"Ø {fx(H['bore'])}",'+.0003/-0 in',src+' #10'),S('','concentric with the outside and the bore',None,src)],src)]
    th={'d':H['screw']['d'],'p':25.4/H['screw']['tpi'],'D1':H['screw']['d']-1.0825*25.4/H['screw']['tpi'],'H1':0.5413*25.4/H['screw']['tpi']}
    for k in range(5):
        a=math.radians(90+72*k);x,y=R(H['pitch'])*math.cos(a),R(H['pitch'])*math.sin(a)
        ops.append(Drill((x,y,H['h']+0.01),(0,0,-1),th['D1'],I(.100)+0.01,f'Drill and tap screw hole {k+1} for the cap',[S('',f".0340-130 (tap drill Ø {th['D1']:.3f}), close fit",None,src+' #8'),S('place',f"on Ø {fx(H['pitch'],3)}, 72° apart",None,src+' #7'),S('depth','.100','not given (estimated)',src)],src,thread=th,key=f'c{k+1}'))
    ra=-math.pi/2;ops.append(Drill((0,0,H['rivet']['x']),(math.cos(ra),math.sin(ra),0),H['rivet']['d'],R(H['od'])+0.5,"Drill the anchor rivet's hole through the wall",[S('',f"Ø {fx(H['rivet']['d'],3)} for the rivet 42042, finished flush outside, its flat side as the detail shows",None,src+' #13'),
        S('place',f"below the centre in the plan, {fx(H['rivet']['x'],3)} from the floor's outside face",'sure',src+' #15'),S('the .520 ±.010',"printed for its radius in the plan, inside the bore's .750: what it locates is unsure",'unsure',src+' #13')],src,key='rivet'))
    ra=math.radians(210);ops.append(Drill((0,0,I(.140)),(math.cos(ra),math.sin(ra),0),I(.055),R(H['od'])+0.5,'Drill the small hole through the wall',[S('',f"Ø {fx(I(.055),3)}",'+0/-.003 in',src+' #14'),S('place',f"at about 8 o'clock, {fx(I(.140),3)} from the floor's outside face",'the angle read off the plan (likely)',src+' #14')],src,key='small'))
    rc=Recipe('barrel','42168','Mainspring barrel',src+' (9-10-41; memos to 4-30-43)','cast yellow brass','24K gold plate',[Setup('1','in the chuck: turned and bored at one setting (the outside and bore concentric with the centre hole); the holes drilled in a dividing head',ops)],ID,
        fits=['on the barrel arbor\'s .2295 bearing: .2300 +.0003/-0','the cap (42169) on the lip, its spigot in the 1.500 bore; five .0340-130 screws'],
        notes=["The notch in the bore's wall at about 8 o'clock (drawn, no size) is not cut.",'The anchor rivet 42042 is not in the set: its hole only.'])
    return _flags(rc,['The lip: .080 or .090 (the sheet gives both)','The .520 ±.010 radius: what it locates is unsure','Tapped holes\' depth: not given (estimated .100)','The wall notch: drawn without a size (not cut)'])
def barrelCap():
    H=HD()['cp'];src='42169-2-01';R=lambda d:d/2;I=lambda x:x*25.4
    outer,inner=_centre_boss(H,H['t'],H['bossH'],True)
    P=outer+[(R(H['od']),0),(R(H['od']),H['flangeT']),(R(H['spigot']),H['flangeT']),(R(H['spigot']),H['t'])]+inner
    ops=[Blank(H['od']+0.4,0,H['bossH'],'Cut the blank from rolled yellow brass (Scovill #187)',[S('','rolled sheet','',src)],src),
         TurnProfile(P,'Turn it: the flange, the spigot, the plate, the boss and its cones',[S('outside',f"Ø {fx(H['od'],3)}",'±.003 in',src+' #1'),S('spigot',f"Ø {fx(H['spigot'],3)}, the plate {fx(H['t'],3)} at it",'+0/-.001, ±.001 in',src+' #2, #4'),
            S('flange',f"{fx(H['flangeT'],4)} thick",'±.0005 in; what the .058 spans is unsure',src+' #5'),S('boss',f"{fx(H['bossH'],3)} from the outer face, its top Ø .340, the outer cone to Ø .320, .025 deep",'+.001/-0 in; likely',src+' #6, #8')],src),
         Bore(H['bore'],-0.01,H['bossH']+0.01,'Bore the centre hole',[S('',f"Ø {fx(H['bore'])}",'+.0003/-0 in',src+' #7')],src)]
    for k in range(5):
        a=math.radians(90+72*k);x,y=R(H['pitch'])*math.cos(a),R(H['pitch'])*math.sin(a)
        ops+=[Hole((x,y),I(.038),'in',H['flangeT'],None,f'Drill screw hole {k+1}',[S('',f"Ø {fx(I(.038),3)} clear of the .0340 screw",'not given (estimated)',src+' #3'),S('place',f"on Ø {fx(H['pitch'],3)}, 72° apart",None,src+' #3')],src,key=f'c{k+1}')]
    rc=Recipe('barrelCap','42169','Barrel cap',src,'rolled yellow brass, Scovill #187','24K gold plate; break all corners',[Setup('1','in the chuck; the holes in a dividing head',ops)],ID,
        fits=['its spigot in the barrel\'s 1.500 bore (+0/-.001 on 1.500 +.002/-0)','on the barrel arbor\'s .2295 bearing: .2300 +.0003/-0'],notes=['Each screw hole is drawn as two circles (a countersink or counterbore): its sizes are not given; drilled plain here.'])
    return _flags(rc,['Screw holes\' size: not given (estimated .038, plain)','The flange\'s .0360 and the .058: partly unsure'])

# ======================= springs and pawls by their tables: 42007, 42028, 42016, 42096, 42027 =======================
def _flat(key,hn,title,src,mat,treat,H,t,holes,notes=(),fits=(),flags=(),mirror=False,arcs=None):
    segs=H['outline'];f=outline_face(segs)
    if mirror:f=f.mirror(bd.Plane.YZ);holes=[((-x,y),d,w,it) for (x,y),d,w,it in holes]
    ops=[Plate(f,t,f'Cut the blank and mill the outline to the coordinate table'+(' (42007 mirrored)' if mirror else ''),[S('thickness',fx(t,3),'+0/-.002 in',src)]+seg_sizes(segs,src,arcs),src)]
    for i,(at,d,w,it) in enumerate(holes):ops.append(Hole(at,d,'in',t,None,f'Drill the {w}',[S('',f'Ø {fx(d)}',None,it)],src,key=f'h{i}'))
    r=Recipe(key,hn,title,src,mat,treat,[Setup('1','flat in a fixture on its holes; the outline milled to the table',ops,view='top')],ID,notes=list(notes),fits=list(fits))
    r.flat=True;return _flags(r,flags)
def windingPawlSpring():
    H=HD()['wps'];src='42007-2-01';hs=H['holes']
    return _flat('windingPawlSpring','42007','Winding pawl spring',src,'beryllium copper','24K gold plate',H,H['t'],
        [(tuple(hs[0]['c']),H['pin'],'hole for the pin 35794 (.0498)',src+' #10'),(tuple(hs[1]['c']),H['screw'],'screw hole (.0440-130)',src+' #11'),(tuple(hs[2]['c']),H['screw'],'second screw hole',src+' #11')],
        notes=[f"The blade is {fx(H['blade'],3)} wide (±.001): the two .4700 and .4550 R arcs about one centre (#2, #3) leave it.",'Holes 1, 16, 17 land on the sustaining wheel\'s holes 10, 9, 8 (or 6, 4, 3): the .4150 circle.'],
        fits=['screwed to the sustaining ratchet wheel (42009) by two .0440-130 screws, located by the pin 35794 pressed in it'],
        flags=["The holes' sizes are the pin's and screw's (the hole's own fit not printed)"],arcs={0:'outer edge (#2)',1:'tip (#9)',2:'#8',3:'inner edge (#3)',4:'#5',5:'#4',6:'corner (#7)',7:'#5'})
def setupPawlSpring():
    H=HD()['wps'];src='42028-2-01';hs=H['holes']
    return _flat('setupPawlSpring','42028','Set-up pawl spring',src,'beryllium copper (as 42007)','24K gold plate (as 42007)',H,H['t'],
        [(tuple(hs[0]['c']),H['pin'],'hole for the pin 35794 (.0498), pressed flush with the top','42028 #2'),(tuple(hs[2]['c']),H['screw'],'screw hole','42028 #5 (point 17)')],mirror=True,
        notes=["\"For other dimensions see part #42007\": its three table rows (1, 3, 17) are 42007's mirrored about the pin's vertical (x' = 4.0000 - x), so the outline is 42007's mirrored.",'Point 16 (42007\'s second screw hole) is not on 42028\'s table: one screw hole here.'],
        fits=['the pin 35794 pressed flush with the top'],flags=["42007's outline mirrored: the table's three rows agree, the rest is by \"see 42007\" (likely)","One screw hole (16 not tabled): likely"])
def setupPawl():
    r=windingPawl();H=HD()['wp'];I=lambda x:x*25.4
    r.key='setupPawl';r.hn='42027';r.title='Set-up pawl';r.drawing='42027 (for other dimensions see 42010)';r.treatment='polish';r.material='not given on 42027 (42010\'s: 1.00 carbon steel)'
    for o in r.ops():
        if isinstance(o,Plate):o.t=I(.048);o.sizes[0]=S('thickness','0.048 in = 1.219 mm','+0/-.002 in','42027 #2')
        if isinstance(o,Hole):o.t=I(.048)
        if isinstance(o,Countersink):o.z=I(.048)
    r.notes=['"For other dimensions see part #42010": the winding pawl\'s outline, hole and countersink, at .048 thick.'];r.fits=['on its stud in the barrel bridge (not in the set)']
    return _flags(r,['Material: not on its sheet (42010\'s taken)','The countersunk face: not dimensioned (estimated)'])
def sustainingSpring():
    H=HD()['ss'];src='42016-2-01';hs={h['n']:h for h in H['holes']};I=lambda x:x*25.4
    r=_flat('sustainingSpring','42016','Sustaining spring',src,'1.00 carbon steel','oxidize black',H,H['t'],
        [(tuple(hs[1]['c']),I(.0495),'hole for the pin 42017 (.0500), pressed',src+' #10'),(tuple(hs[9]['c']),I(.0495),'hole for the other pin 42017',src+' #10'),(tuple(hs[13]['c']),H['hole13'],'plain hole 13',src+' ±.001')],
        notes=['The pins 42017 (.0500) in holes 1 and 9 stand out of opposite faces (the side views); their length is not given.','Its centre (row 5, and 11) is the fusee wheel\'s axis.',f"Rim widths .080, .070, .058 (upper left, right, lower right) come from the table's arcs.",'A .005 × 45° chamfer on the bottom edge only: not cut.'],
        fits=['the pins 42017 press fit in holes 1 and 9'],flags=["Holes 1 and 9: no size printed (a press fit for .0500 pins; built .0495, estimated)","The bottom edge's .005 chamfer: not cut"])
    return r
def sustainingPawl():
    H=HD()['sp'];src='42096-2-01'
    r=_flat('sustainingPawl','42096','Sustaining pawl',src,'1.00 carbon steel','polish the contour and the marked face',H,H['t'],[(tuple(H['holeAt']),H['springHole'],"spring wire's hole (taper broached for a drive fit)",src+' #8')],
        notes=['Staked on its arbor 42097 (a .090 collar; not in the set); the spring wire 42098 drives into the .020 hole (its size not given).','The pivot hole for the arbor is not dimensioned on this sheet: not drilled here.'],
        fits=['staked on the arbor 42097'],flags=['Pivot hole: not dimensioned (42097 is not in the set): not drilled','Tip (rows 5 to 6) a straight line: likely'],arcs={0:'outer convex edge (#3)',2:'inner concave edge (#4)',3:'boss (#2)'})
    for o in r.ops():
        if isinstance(o,Plate):o.sizes[0]=S('thickness',fx(H['t'],3),'±.001 in',src+' #6')
    return r

# ======================= the chain: 42005 centre link, 42004 link pin, 42002 and 42003 hooks =======================
def centreLink():
    H=HD()['cl'];src='42005-1-01'
    return _flat('centreLink','42005','Fusee chain centre link',src,'1.00 carbon steel','hardened and drawn after assembling (42001)',H,H['t'],
        [(tuple(H['holes'][0]),H['hole'],'pin hole',src),(tuple(H['holes'][1]),H['hole'],'second pin hole, at the .0940 pitch',src)],
        notes=['148 in a chain (42001), one in each even space between the outer links\' pairs (42246, not in the set).','Its four .0425 R arcs are all tangent (#: the table).'],
        fits=['the link pins 42004 (.0240) free in its .0250 holes: "links must flex freely about pins with minimum clearance" (42001)'],flags=[])
def linkPin():
    H=HD()['pn'];src='42004-1-01'
    ops=[Blank(H['d'],0,H['len'],'Cut from drill rod',[S('',f"Ø {fx(H['d'])} × {fx(H['len'],3)}",'±.0003, +.001/-0 in',src+' #1, #2')],src)]
    return _flags(Recipe('linkPin','42004','Fusee chain link pin',src,'drill rod','do not harden (the chain is hardened after riveting); riveted flush with the links',[Setup('1','parted off',ops)],ID,
        notes=['298 in a chain (42001).'],fits=['riveted in the outer links, free in the centre link']),[])
def _hook(key,hn,title,src,segs,H,notes,flags):
    I=lambda x:x*25.4;tb,tt=H['tBody'],H['tThin'];x0=H['step']
    def thin():   # the link end, thinned on both faces to .0095 about the middle, up to the step .050 from the pin hole's centre
        e=(tb-tt)/2;return bd.Box(10,10,e+0.01,align=(bd.Align.MAX,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((x0,0,-0.01)))+bd.Box(10,10,e+0.01,align=(bd.Align.MAX,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((x0,0,tb-e)))
    ops=[Plate(outline_face(segs),tb,'Cut the blank from 1.00 carbon steel and mill the outline to the coordinate table',[S('thickness',f"body {fx(tb)}",'±.0005 in',src)]+seg_sizes(segs,src),src),
         Hole((0,0),H['hole'],'in',tb,None,'Drill the pin hole',[S('',f"Ø {fx(H['hole'])}",'+0/-.0005 in',src)],src,key='pin'),
         Cut(thin,'Mill the link end down on both faces',[S('',f"{fx(tt)} thick up to {fx(x0,3)} from the pin hole's centre",'+0/-.0005, +.005/-0 in',src),S('step','.003 × 45° at the step','not cut here',src)],src)]
    r=Recipe(key,hn,title,src,'1.00 carbon steel','do not harden',[Setup('1','flat in a fixture; the outline to the table; the end milled thin',ops,view='top')],ID,notes=notes,fits=['its thin end takes a link pin like a centre link'])
    r.flat=True;return _flags(r,flags)
def barrelHook():
    H=HD()['hk2'];return _hook('barrelHook','42002','Fusee chain hook, barrel end','42002-1-01',H['outline'],H,['The hook catches the barrel\'s hook; 42001 gives .030 the most thick.'],["The thin end centred on the body's middle: likely","The step's .003 × 45° chamfer: not cut"])
def fuseeHook():
    H=dict(HD()['hk2']);H['outline']=HD()['hk3']['outline']
    return _hook('fuseeHook','42003','Fusee chain hook, fusee end','42003-1-01',H['outline'],H,["42002's outline with the tail removed at point 19 (42003's sheet)."],["The belly as 42002's: likely","The thin end centred on the body's middle: likely"])

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
         Cut(lambda:box(wi['x0'],wi['x1'],W-wi['top']-wi['h'],W-wi['top']),'Pierce the window',[S('',f"{fx(wi['l'],3)} × {fx(wi['h'])}",'+.001/-0, +.0005/-0 in',src+' #11'),S('place',f"its top {fx(wi['top'],3)} below the top edge; its right end .3535 from the slot's centre",'+.001/-0 in',src+' #10, #11')],src),
         Cut(notch,'Pierce the top notch with its raised step',[S('floor',f"{fx(tn['floor'],3)} above the bottom edge from {fx(tn['x0'],4)} to {fx(tn['x1'],4)}",'+.002/-0 in',src+' #12, #13, #15'),S('step',f"{fx(bp['h'],3)} high over {fx(bp['x0'],4)}-{fx(bp['x1'],4)}",'±.001 in; .079 printed, the drawing\'s scale .075 (unsure)',src+' #14')],src),
         Cut(bottom,'Pierce the two bottom cuts',[S('',f"{fx(H['botCuts'][0]['x1']-H['botCuts'][0]['x0'],3)} and {fx(H['botCuts'][1]['x1']-H['botCuts'][1]['x0'],3)} wide, {fx(H['botCuts'][0]['depth'],3)} deep",'+0/-.002 in; the depth from the .038 web (likely)',src+' #18, #20')],src),
         Cut(lambda:box(es['floorX'],H['len']+1,W/2-es['w']/2,W/2+es['w']/2),'Pierce the end slot',[S('',f"{fx(es['w'])} wide, its floor {fx(es['floorX'])} from the foot end",'+.0002/-0 in',src+' #17')],src),
         Cut(grind,'Surface grind the flat sides (operation 65)',[S('thickness',fx(H['tFin'],3),'+0/-.001 in',src2+' #2')],src2),
         Cut(mill,'Mill each edge (operation 66)',[S('width',fx(H['wFin'],3),'no tolerance printed',src2+' #3'),S('','.0045 off each edge (derived; likely symmetric)',None,src2)],src2)]
    r=Recipe('detentBlank','42087','Detent, blank milled and ground',src+' (7-4-44) and '+src2+' (8-3?-48)','beryllium copper','corner the foot hole (operation 63, its size not given)',
        [Setup('1','blank and pierce in a press (operation 61)',ops[:7],view='top'),Setup('2','surface grind both sides, then mill each edge',ops[7:],view='top')],ID,
        notes=['The finished detent 42087-3-01 is not in the set: this is the part as far as these two sheets take it, before its blade, spring and horn are finished.','The block, trip spring, screws and bracket (42086, 42088, 42091, 42092) are not in the set.'],fits=[])
    r.flat=True;return _flags(r,['Not the finished detent: 42087-3-01 is not in the set','The step in the top notch: .079 printed, .075 on the scale (unsure)','The edges milled evenly from both sides: likely'])

# ======================= 42050 helical spring, 1-WD-265 mainspring inner end =======================
def helicalSpring():
    H=HD();src='42050-1-01';I=lambda x:x*25.4;d=I(.025);D=I(.290)-d;L=I(.550);n=6;nc=1
    pa=(L-2*nc*d)/(n-2*nc)   # the open turns' pitch: one closed turn at each end (pitch = the wire), the free length over the four open
    def spring():
        pts=[];N=48*n
        for i in range(N+1):
            u=i/N*n;z=(d*u if u<=nc else d*nc+pa*(u-nc) if u<=n-nc else d*nc+pa*(n-2*nc)+d*(u-(n-nc)))
            a=2*math.pi*u;pts.append(bd.Vector(D/2*math.cos(a),D/2*math.sin(a),z+d/2*0))
        path=bd.Wire([bd.Edge.make_spline(pts)]);t0=path.tangent_at(0)
        prof=bd.Wire([bd.Edge.make_circle(d/2,bd.Plane(origin=pts[0],z_dir=t0))])
        s=bd.Solid.sweep(bd.Face(prof),path,is_frenet=True)
        return s&bd.Box(20,20,L,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN))   # the ends ground flat to the free length
    ops=[Solid(spring,'Coil the wire',[S('wire',f'Ø {fx(d,3)}','±.001 in',src+' #3'),S('outside',f'Ø {fx(I(.290),3)}','±.005 in',src+' #2'),S('turns','6 in all, 1 closed at each end','±1/4; +1/4/-0 closed',src+' #5, #7'),
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
    def slot():
        rr=sw/2;x1=s0+sl-rr
        return bd.Box(x1-s0,sw,th+0.02,align=(bd.Align.MIN,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((s0,0,-0.01)))+bd.Cylinder(rr,th+0.02,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((x1,0,-0.01)))
    ops=[Plate(planform(),th,'The strip\'s inner end: round the tip, taper it',[S('width',fx(w,3),'±.001 in',src+' #1'),S('tip',f'a full round R {fx(r0,3)} (.500 wide there)',None,src+' #2'),S('taper',f'to the full width {fx(H["taper"],2)} from the tip',None,src+' #3'),
           S('thickness',f'{fx(th,4)}','from the manual\'s parts list (0.0165 in), not this sheet',"NAVSHIPS 250-624 Sec. XI"),S('length shown','2.000 in of the strip','not the spring\'s length (42037-42041, not in the set)','')],src),
         Cut(slot,'Punch the slot for the arbor\'s hook',[S('',f'{fx(sw,3)} wide × {fx(sl,3)} long, its tip end square (a broken corner), its far end round R .100','±.003 in',src+' #4, #6'),
            S('start',f'{fx(s0,3)} from the tip (.200 printed, .180 by hand 6-7-43: the later)','likely the one in force',src+' #5')],src)]
    r=Recipe('mainspringEnd','1-WD-265','Mainspring, inner end',src+' (5-20-43; revised 6-7-43)','spring steel strip (the mainspring 42037-42041: not in the set)','as the mainspring',[Setup('1','the strip\'s end formed and punched',ops,view='top')],ID,
        notes=['The sheet draws the inner terminal only: the strip\'s length, its outer end and its brace are other sheets (not in the set).'],fits=['its slot over the barrel arbor\'s hook (42170)'])
    r.flat=True;return _flags(r,['Only the inner end: the rest of the spring is not in the set','Thickness from the manual, not this sheet','The slot\'s start: .180 (by hand) taken, .200 printed'])

RECIPES=[('Going train',fourthWheel),('Going train',fourthPinion),
         ('Fusee',fuseeWheel),('Fusee',fuseeArbor),
         ('Maintaining and winding work',sustainingWheel),('Maintaining and winding work',windingPawl),('Maintaining and winding work',windingPawlSpring),('Maintaining and winding work',windingRatchet),
         ('Maintaining and winding work',sustainingSpring),('Maintaining and winding work',sustainingPawl),
         ('Barrel and mainspring',barrel),('Barrel and mainspring',barrelCap),('Barrel and mainspring',barrelArbor),('Barrel and mainspring',mainspringEnd),
         ('Set-up',setupRatchet),('Set-up',setupPawl),('Set-up',setupPawlSpring),
         ('Fusee chain',centreLink),('Fusee chain',linkPin),('Fusee chain',barrelHook),('Fusee chain',fuseeHook),
         ('Detent',detentBlank),('Not yet placed',helicalSpring)]
