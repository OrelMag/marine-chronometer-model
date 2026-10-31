"""The Wempe's fusee-side recipes of batch 9d (31 October 2026): the fusee body 05 06 04-2 with its variable-radius helical chain groove as an exact B-rep, the
screws WN-19, WN-20, WN-21, the maintaining detent's arbor 05 05 05-2 and the maintaining spring 05 06 01-1. Imported into wempe.py's RECIPES by one line at its end.

The groove. 05 06_20's curve gives the groove floor's radius at quarter turns from the large end (WD.FU.GR.RFT, piecewise linear in the turn m), and the land at turn m
stands at the axial place ac(m) from the blank's face, 1.2 further for each turn. The body is the turned blank less, for each turn, a cutter: the section of one pitch
(the land cut to the floor radius rf(m), the rib to its right cut to rf(m) + 0.6, everything above them, to the blank's radius) swept along m. Each cutter piece is built
as a ruled B-rep between B-spline curves of the section's corners (one curve per corner, all through the same m): its faces are the floor, the two walls and the rib's
top, the floor and the rib's top axial ruled surfaces over a spiral, the walls radial ones, so the solid is exact to the spline's interpolation (about a micron) and
needs no sweep along a variable helix (OpenCascade's sweeps failed there; PLAN-recipes.md, batch 9b-9c). A piece is a quarter turn (the floor's breaks), cut one after
the other from the body; the last turn's section rises to the hub's radius and runs on to the end, as the page's rBody has it (fusee.js)."""
import functools,json,math,subprocess
import build123d as bd
from . import (Op,Recipe,Setup,S,iso,Blank,TurnProfile,Drill,Cut,Bought,page_matrix,TurnOD,TurnCone,ThreadOD,SlotHead,Bar,TurnAway,_rev,Plate,Hole)
from . import wempe as _w
TAU=2*math.pi

class Groove(Op):
    """screw-cut the fusee's groove: nine turns of lands and ribs, the floor's radius by 05 06_20's curve (cutter pieces by quarter turns, built as ruled B-rep between spline curves)"""
    kind='turn'
    def __init__(self,U,text,sizes=(),src=''):
        super().__init__(text,sizes,src);self.U=U;G=U['GR'];self.G=G;self.B=U['BODY']
    def rf(self,m):
        R=self.G['RFT'];u=max(0,min(36,m*4));i=min(35,int(u));return R[i]+(R[i+1]-R[i])*(u-i)
    def ac(self,m):
        G=self.G
        if m>=0.15:return G['A0']+G['PAX']*m
        t=max(0,m)/0.15;d=G['A0']+G['PAX']*0.15-G['FSC'];return G['FSC']+d*(3*t*t-2*t**3)+G['PAX']*0.15*(t**3-t*t)
    def poly(self,m,last):
        """the section of one pitch at turn m: (axial place from the land's middle, radius) at the corners, the same count always"""
        G=self.G;B=self.B;W=G['WLD'];RB=B['R']+0.7;r=self.rf(m)
        if last:return [(-W/2,RB),(-W/2,r),(W/2,r),(W/2,B['rh']),(W/2+G['PAX']+0.3,B['rh']),(W/2+G['PAX']+0.3,RB)]
        e=self.ac(m+1)-self.ac(m)-W/2+0.02;return [(-W/2,RB),(-W/2,r),(W/2,r),(W/2,r+G['RIBH']),(e,r+G['RIBH']),(e,RB)]   # the rib runs to the next land's wall (a hair past it): 0.33 where the pitch is whole, narrower in the first 0.15 turn's cubic run
    def pt(self,m,a,r):
        th=TAU*m+self.U['PHI0'];return bd.Vector(r*math.cos(th),r*math.sin(th),self.U['F0']-(self.ac(m)+a))
    def piece(self,m0,m1,k=10):
        last=m0>=self.G['MN']-1-1e-9;n=max(2,int(math.ceil((m1-m0)*4*k)));ms=[m0+(m1-m0)*i/n for i in range(n+1)]
        P=[self.poly(m,last) for m in ms];nv=len(P[0])
        cur=[bd.Edge.make_spline([self.pt(m,*P[i][v]) for i,m in enumerate(ms)],parameters=ms) for v in range(nv)]
        faces=[bd.Face.make_surface_from_curves(cur[v],cur[(v+1)%nv]) for v in range(nv)]   # ruled between the corners' curves: the floor and the rib's top axial, the walls radial
        for i in (0,n):faces.append(bd.Face(bd.Wire.make_polygon([self.pt(ms[i],*q) for q in P[i]],close=True)))
        return bd.Solid(bd.Shell(faces))
    def cuts(self):
        MN=self.G['MN'];c=[0,0.15]+[i/4 for i in range(1,36)]+[MN-1,MN]
        return sorted(set(round(x,9) for x in c if 0<=x<MN-1e-6))+[MN]
    def apply(self,p):
        c=self.cuts()
        for i in range(len(c)-1):
            a,b=c[i],c[i+1]
            for eps in (0.002,0.0013,0.004,0.0007,0.01):   # a quarter turn overlaps the next by a hair so the caps sit inside the void; a boolean that leaves metal in the groove is retried
                b2=min(b+eps,self.G['MN']) if b<self.G['MN'] else b;r=p-self.piece(a,b2)
                if r.is_valid and not any(r.is_inside(self.pt(m,0,self.rf(m)+0.1)) for m in [a+(b-a)*k/6 for k in range(1,6)]):p=r;break
            else:raise RuntimeError(f'fusee groove: the cutter piece from turn {a} failed')
        return p

@functools.lru_cache()
def WFB():
    """WD.FU as the page has it (functions left out, so the groove's tables and body sizes) with the maintaining spring's outline"""
    js="const W=require(%r)({train:true}),F=W.WD.FU;process.stdout.write(JSON.stringify({FU:F}))"%str(_w.TOOLS/'wempe_load.js')
    return json.loads(subprocess.run(['node','-e',js],capture_output=True,text=True,check=True).stdout)['FU']

def fusee():
    U=WFB();B=U['BODY'];G=U['GR'];F0,RT,LB,S0,FRC,F=U['F0'],U['RT'],U['LB'],U['S'],U['FRC'],U['F'];src='05 06 04-2 (27.2.48)';T5=math.tan(math.radians(B['fall']))
    ca,sa=math.cos(U['PINA']),math.sin(U['PINA']);env=[(B['chR']-RT,F),(B['rT'],F),(B['R'],F-(B['R']-B['rT'])*T5),(B['R'],S0),(B['rIn'],S0),(B['rIn'],S0+B['smD']),(B['bore']/2,S0+B['smD']),
        (B['bore']/2,FRC),(B['rRec'],FRC),(B['rRec'],F0-B['chD'])]
    Rc=B['RC'];slotW=G['FS1']-G['FR1'];sl=B['slot'];sp=B['spin'];m2=iso(2.0);m17=iso(1.7)
    def cutter():return bd.Cylinder(B['cutR'],slotW,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((Rc*ca,Rc*sa,F0-G['FS1'])))
    ang=math.degrees(U['PINA'])
    def pocket(depth,u0,u1):
        v0,v1=sl['v0'],sl['v1'];b=bd.Box(u1-u0,v1-v0,depth+5,align=(bd.Align.MIN,bd.Align.MIN,bd.Align.MIN)).moved(bd.Location((u0,-v1,S0-5)))   # v' = -v: the page's z runs the other way
        return b.moved(bd.Location((0,0,0),(0,0,1),ang))
    def slot():
        disc=bd.Cylinder(U['SLR'],30,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((0,0,S0-10)))
        return pocket(U['SLS'],-14,14)+pocket(U['SLD'],-14,0.5)+(pocket(U['SLD'],0,14)&disc)
    u0=math.sqrt(sp['a']**2-sp['b']**2);po=(u0*ca+sp['b']*sa,u0*sa-sp['b']*ca,S0+sp['dy'])
    ops=[Blank(36,S0-0.1,F+0.1,'Cut the blank from Rundmessing 36 (Ms 58) and chuck it',[S('blank','Ø 36',None,src)],src),
         TurnProfile(env,"Turn the flange (Ø 35.6) with its lead-in, the hub, the large end's recess with its 45° mouth, the bore and the small end's recess",
           [S('flange',f"Ø {2*B['R']:.1f}",'35.6 -0.1',src),S('large end recess',f"Ø {2*B['rRec']:.1f}, {F0-FRC:.1f} deep",'26.3 +0.2; 2.7',src),S('mouth',f"{B['chD']-RT:.2f} × 45° from Ø {B['chR']*2:.1f}",'revision a',src),
            S('bore',f"Ø {B['bore']:.3f}",'7 H7',src),S('small end recess',f"Ø {2*B['rIn']:.0f}, {B['smD']} deep",'15; 1.6 +0.1',src),S('overall',f"{LB-RT:.2f} from the large end's face to the small end's",None,src)],src),
         Groove(U,"Cut the groove, nine turns: lands 0.87 wide, ribs 0.33 and 0.6 high, the floor's radius by 05 06_20's curve, run out at N on the hub Ø 21",
           [S('pitch',f"{G['PAX']}",'1,2 ±0,01',src),S('land',f"{G['WLD']}",'0,87 +0,01',src),S('rib',f"{G['RIB']} wide, {G['RIBH']} proud",'0,33; +0,6',src),S('floor radius at the quarter turns from the large end',
             ', '.join(f'{r:g}' for r in G['RFT']),'05 06_20 / the body\'s "Grund"',src),S('hub',f"Ø {2*B['rh']:.0f}, {B['hubT']} thick past N",None,src)],src),
         Cut(cutter,'Cut the slot of the flange deeper under the chain\'s pin with a slitting cutter Ø 13.5',[S('slot',f"{slotW:.2f} wide between the ribs, floor r {B['R']-B['cutD']-B['cutP']:.1f} at the pin",'2 ±0.02 over both ribs, 2.9 deep',src)],src),
         Drill((U['PINR']*ca,U['PINR']*sa,F0-B['pinD']),(0,0,1),2*B['pinR'],F+0.1-(F0-B['pinD']),"Drill and ream the chain's pin's hole through the ribs",[S('',f"Ø {2*B['pinR']:.3f}",'0,55 +0,01',src),S('depth',f"{B['pinD']} under the blank's face",None,src)],src,key='pin')]
    ops[-1].mz=F0-1.85   # measured in the second rib: in the slot the hole has no wall
    for i,c in enumerate(U['CW']['holes']):
        ops.append(Drill((c[0],c[1],FRC-B['m2']['d']),(0,0,1),m2['D1'],B['m2']['d']+0.1,f'Drill and tap M2 for the click wheel\'s screw {i+1} from the recess floor',[S('',f"M2, {B['m2']['d']-0.25:.2f} to the full thread",'6 +0.5 deep',src),S('place','on Ø 11.5 at 120°, 74° from the chain\'s pin','Ø 11.5 ±0.05',src)],src,thread=m2,key=f'm2.{i+1}'))
    ops.append(Drill((U['DP']['at'][0],U['DP']['at'][1],S0+B['smD']-0.1),(0,0,1),m17['D1'],B['m17']['d']+0.1,'Drill and tap M1.7 for the cover plate\'s screw from the small end\'s recess floor',[S('','M1.7, 6 deep','6',src)],src,thread=m17,key='m17'))
    ops.append(Cut(slot,"Mill the stop bar's slot across the small end: 2 H8 wide, 1.5 deep inside r 9.3 toward the bar's upper end, 1.1 deep outside it",
        [S('slot',f"{sl['v1']-sl['v0']} wide, its near edge {sl['v0']} from the axis",'2 H8',src),S('deep',f"{U['SLD']}",'1,5 +0,05 (drawn at the middle)',src),S('shallow',f"{U['SLS']}",'1,1 +0,05',src),S('step',f"on r {U['SLR']}",'Schnitt C-D\'s dashed arc',src)],src))
    ops.append(Drill(po,(ca,sa,0),2*sp['r'],30,"Drill and ream the stop bar spring's pin's hole along the slot",[S('',f"Ø {2*sp['r']:.4f}",'0,5 H7',src),S('place',f"{sp['b']} from the line through the axis along the slot, {sp['dy']} above the end face",None,src)],src,key='sp'))
    R_=Recipe('fusee','050604-2','Fusee body (Schneckenkörper)',src,'Rundmessing 36, Ms 58 (05 06 04-2)','gilt (Wempe 3955)',[Setup('1','in the chuck, turned; the groove cut on the lathe; the slots and holes on the mill and drill',ops)],_w.UP(),
      fits=['the arbor 05 06 04-1\'s collar Ø 7.04 -0.01 pressed in the bore 7 H7','the cover plate on the arbor\'s step; the click wheel in the large end\'s recess'],
      expect=[{'at':(0,0),'r':18,'z':(F0-2.15,F+0.1),'max':0.05,'why':"the page turns the flange as a lathe with a row every 0.04 along the axis, so each wall of the first land's run (to 2.1 under the blank's face) stands up to 0.04 off the helix it is drawn on"},
              {'at':(0,0),'r':18,'z':(F0-1.8,F0-0.6),'th':(-30,10),'max':0.2,'why':"the page's flange is a lathe of 216 columns round the slot's cutter arc, whose floor climbs 0.4 mm between two columns (1.7°): the chord stands up to 0.18 off the arc, and its rows every 0.04 put the slot's walls (a 0.76 and 1.63) up to 0.04 off the drawing"},
              {'at':(0,0),'r':11,'z':(S0-0.1,S0+1.6),'th':(-72,-58),'max':0.2,'why':"at the groove's end N the page's rays (216 and the two at N) join the last land's floor to the hub across a chord up to 0.13 off the wall"}],
      notes=['The groove is built as ruled surfaces over splines through the 05 06_20 curve (about a micron from it); a CNC lathe cuts it as a screw thread of changing core radius, the floor radius at each quarter turn as listed.']);return R_

RECIPES={'fusee':fusee}

# ---------------- the fusee side's three hand-built screws (WN-19, WN-20, WN-21) and the maintaining detent's arbor 05 05 05-2 ----------------
def _slot(l,w,h,top,rot):
    """the slot the page draws as a dark box (l long, w wide, h high, standing 0.02 out of the head's face): cut here as a real slot of the box's size, turned by the page's angle"""
    def mk():return bd.Box(l+1,w,h+0.02,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((0,0,top-h)))
    return lambda:mk().moved(bd.Location((0,0,0),(0,0,1),math.degrees(rot)))

def fscrew(key,hn,title,drawing,prof,rs,y0,y1,top,slot,rot,note,src,expect_r,notes=()):
    """a screw of the fusee side as the page draws it: the turned profile prof [(r, z) ...] (head, shank at the thread's crest, chamfered tip), the thread M(2 rs) from y0 to y1, the slot"""
    th=iso(2*rs);S_=lambda l,t=None,s=src:S(l,t,None,s)
    ops=[Blank(2*max(r for r,_ in prof)+0.4,min(z for _,z in prof)-0.05,max(z for _,z in prof)+0.05,'Part off from steel bar and face to the overall length',[S('overall',f"{max(z for _,z in prof)-min(z for _,z in prof):.2f}",None,src)],src),
         TurnProfile(prof,f"Turn the head, the shank to the thread's major diameter and the tip",[S('head',f"Ø {2*max(r for r,_ in prof):.3f}",None,src),S('shank',f"Ø {2*rs-th['es']:.3f}",'6g (es %.3f)'%th['es'],'ISO 965')],src),
         ThreadOD(th,y0,y1,f'Cut the thread M{2*rs:g} (die or single point)',[S('thread',f"M{2*rs:g} × {th['p']}",'6g','ISO 261')],src),
         Cut(_slot(*slot,top,rot),'Mill the slot across the head',[S('slot',f"{slot[1]:.2f} wide × {slot[2]:.2f} deep, turned {math.degrees(rot):.0f}° (the page's)",None,src)],src,at=(0,0))]
    R_=Recipe(key,hn,title,drawing,'steel (the coloured section)','none',[Setup('1','bar in the collet, turned and parted off; the slot on the mill',ops)],_w.UP(),
      notes=list(notes)+[note],expect=[{'at':(0,0),'r':expect_r,'max':0.4,'why':"the page draws the slot as a solid dark box lying in the head (standing 0.02 out of its face for WN-20 and WN-21), not cut; the recipe cuts a slot of the box's size"}])
    R_.near=2.0;R_.box_tol=0.03   # only the page's pieces at this screw (WN-19's line is three); the slot's box stands 0.02 out of the face
    return R_

def _tipcone(rs):
    th=iso(2*rs);crest=rs-th['es']/2;root=crest-th['H1'];return crest,max(root-th['H1']/2,root*0.6)

def w19():
    U=WFB();Q=U['SCR']['w19'];rs=Q['rs'];crest,rt=_tipcone(rs);yt=Q['y0']-Q['t'];ch=min(iso(2*rs)['H1'],Q['t']*0.3)
    prof=[(0,yt),(rt,yt),(crest,yt+ch),(crest,Q['y0']),(Q['r0'],Q['y0']),(Q['r1'],Q['y1']),(0,Q['y1'])]
    return fscrew('w19','WN-19','Click wheel screw (WN-19), three','WN-19 (coloured section 05 06_3.2; no sheet of its own)',prof,rs,yt,Q['y0'],Q['y1'],(Q['slot']['l'],Q['slot']['w'],Q['slot']['h']),Q['slot']['rot'],
      "The head is turned to the click wheel's holes' 1:8 opening and sits flush in the wheel; the thread M2 goes 3.8 into the body's M2 holes.",'dims.js FU.SCR.w19 (fusee.js; estimated from the coloured section)',1.3)
def w20():
    U=WFB();Q=U['SCR']['w20'];rs=Q['rs'];crest,rt=_tipcone(rs);yt=Q['yb'];ya=Q['ya'];ch=min(iso(2*rs)['H1'],(yt-ya)*0.3)
    prof=[(0,Q['y0']),(Q['r0'],Q['y0']),(Q['r1'],Q['y0']+Q['hh']),(crest,ya),(crest,yt-ch),(rt,yt),(0,yt)]
    return fscrew('w20','WN-20','Cover plate screw (WN-20)','WN-20 (coloured section 05 06_8; its sheet is not in the set)',prof,rs,ya,yt-0.0,Q['y0'],(Q['slot']['l'],Q['slot']['w'],Q['slot']['h']),Q['slot']['rot'],
      "A 90° countersunk head Ø 3.1 seated in the cover plate's sink, M1.7 across the small end's recess and into the body's M1.7.",'dims.js FU.SCR.w20 (fusee.js; estimated)',1.7)
def w21():
    U=WFB();Q=U['SCR']['w21'];rs=Q['rs'];crest,rt=_tipcone(rs)
    prof=[(0,Q['yE'])]+[(r,Q['yE']+d) for r,d in Q['dome']]+[(Q['rsh'],Q['ysh']),(crest,Q['ya']+0.0),(crest,Q['yb']),(Q['hr'],Q['yb']),(Q['hr'],Q['yb']+Q['hh']),(0,Q['yb']+Q['hh'])]
    return fscrew('w21','WN-21','Maintaining click screw (WN-21), two','WN-21 (coloured section 05 06_11; no sheet of its own)',prof,rs,Q['ya'],Q['yb'],Q['yb']+Q['hh'],(Q['slot']['l'],Q['slot']['w'],Q['slot']['h']),Q['slot']['rot'],
      "Put in from under the ratchet's plate: the head under it, M1.7 in the plate, the shoulder Ø 1.19 above it carries the click.",'dims.js FU.SCR.w21 (fusee.js; estimated)',1.4)

def dtArbor():
    U=WFB();P=[tuple(q) for q in U['DTA']];src='05 05 05-2 (no sheet; 05 05_11 scaled)'
    ops=[Blank(2*max(r for r,_ in P)+0.4,min(z for _,z in P)-0.05,max(z for _,z in P)+0.05,'Cut the blank from Präz. Rundstahl 2.5 between centres',[S('length',f"{max(z for _,z in P)-min(z for _,z in P):.2f}",None,src)],src),
         TurnProfile(P,"Turn the arbor: the pivots Ø 0.88 with their domed ends, the shoulders chamfered 0.25 × 45°, the seat for the detent tapered 1:70",[S('pivots','Ø 0.88',None,src),S('seat','Ø 2.25 between its shoulders, 1:70 under the detent','line to line with the detent\'s 2.25 H7 hole',src)],src)]
    return Recipe('dtArbor','050505-2','Maintaining detent arbor (Gegensperrwelle)',src,'Präz. Rundstahl (not given)','hardened (as an arbor: estimated)',[Setup('1','between centres',ops)],_w.UP(),
      fits=["the detent 05 05 05-1 staked on its 1:70 seat","its pivots in the plates' drilled Ø 0.9"],
      expect=[{'at':(0,0),'r':3,'max':0.02,'vol':1.5,'why':"the page turns the arbor on 20 sides (a polygon's area is 1.6 % under the circle's): 1.3 mm³"}])

RECIPES.update({'w19':w19,'w20':w20,'w21':w21,'dtArbor':dtArbor})

# ---------------- the maintaining spring (Gegenfeder 05 06 01-1): a ring, free, as blanked (the frozen pose's ms = 0) ----------------
def mspring():
    U=WFB();M=U['MS'];Wd=M['W48'];R0,RI,RP,ER,U1,USQ,UPIN,HR=M['R0'],M['RI'],M['RP'],M['ER'],M['U1'],M['USQ'],M['UPIN'],M['HR'];t=U['GS0']-U['GS1'];D=math.radians;src='05 06 01-1 (02 06 05)'
    far=lambda u,c,R:(lambda d:d+math.sqrt(d*d-c[0]**2-c[1]**2+R*R))(math.sin(D(u))*c[0]+math.cos(D(u))*c[1])
    def w(u):
        if u<Wd['UA']:return R0-far(u,Wd['cA'],Wd['RA'])
        if u<270:return R0-RI
        if u<Wd['UC']:return R0-far(u,Wd['c6'],6)
        return R0-far(u,Wd['cE'],Wd['RE'])
    S_=lambda u,r:(r*math.sin(D(u)),r*math.cos(D(u)))   # a point at r, u in the sheet's sense; the model has it turned half a turn about the axis (-x, -y)
    P=lambda q:(-q[0],-q[1])
    eye=S_(0,RP);hs=S_(UPIN,RP);inner=lambda u:S_(u,R0-w(u))
    RB=R0-((R0-ER)**2-RP*RP)/(2*(R0-ER)-2*RP*math.cos(D(U1)));QB=S_(U1,R0-RB)
    tB=math.atan2(eye[1]-QB[1],eye[0]-QB[0]);PB=(QB[0]+RB*math.cos(tB),QB[1]+RB*math.sin(tB));PU=S_(U1,R0)
    aB0=math.atan2(PU[1]-QB[1],PU[0]-QB[0]);dB=(tB-aB0+math.pi)%(2*math.pi)-math.pi   # the blend's start and sweep, the short way
    lo,hi=0.0,40.0   # where the inner edge leaves the eye's round
    for _ in range(60):
        m=(lo+hi)/2
        if math.dist(inner(m),eye)<ER:lo=m
        else:hi=m
    ui=(lo+hi)/2;Pi=inner(ui)
    eT=math.atan2(PB[1]-eye[1],PB[0]-eye[0]);eP=math.atan2(Pi[1]-eye[1],Pi[0]-eye[0])
    dA=eP-eT
    while dA<0:dA+=2*math.pi
    if not (lambda a:(a-eT)%(2*math.pi)<dA)(math.pi):dA-=2*math.pi   # the arc through the eye's far side (away from the band: toward -x here)
    ea=lambda a:(eye[0]+ER*math.cos(a),eye[1]+ER*math.sin(a))
    def arc3(p,m,q):return bd.Edge.make_three_point_arc(bd.Vector(*P(p),0),bd.Vector(*P(m),0),bd.Vector(*P(q),0))
    ln=lambda p,q:bd.Edge.make_line(bd.Vector(*P(p),0),bd.Vector(*P(q),0))
    UA,UC=Wd['UA'],Wd['UC']
    E=[arc3(S_(USQ,R0),S_((USQ+U1)/2,R0),PU),   # the outer circle from the square end round to 60° from the eye
       arc3(PU,(lambda a0:(QB[0]+RB*math.cos(a0+dB/2),QB[1]+RB*math.sin(a0+dB/2)))(aB0),PB),   # the blend into the eye's round
       arc3(PB,ea(eT+dA/2),Pi),   # round the eye's end
       arc3(Pi,inner((ui+UA)/2),inner(UA)),arc3(inner(UA),inner((UA+270)/2),inner(270)),arc3(inner(270),inner((270+UC)/2),inner(UC)),arc3(inner(UC),inner((UC+USQ)/2),inner(USQ)),   # the inner edge's four arcs
       ln(inner(USQ),S_(USQ,R0))]   # the end, radial
    wire=_w._chain(E)
    ops=[Plate(bd.Face(wire),t,'Cut the ring from Bandstahl 35 × 1.75, grind it to 1.3 and mill the outline: outer Ø 32.3, the eye\'s round r 1.8, the inner edge in four arcs',
           [S('thickness',f'{t:.2f}','1.35 -0.1 (the kompl. sheet\'s finished 1.3)',src),S('outside',f'Ø {2*R0:.2f}','32.3 -0.1',src),S('ring width',f'{R0-RI:.2f} from 50° to 270° from the eye, widening to {w(10):.2f} at 10° and {w(UC):.2f} at the swell',None,src),
            S('eye',f'r {ER} about the hole on r {RP}',None,src),S('square end',f'at {USQ}° from the eye, {w(USQ):.2f} wide','"4"',src),S('inner edge',f'arcs r {Wd["RA"]}, {RI}, 6 and {Wd["RE"]}','traced on the sheet at 17.26 px/mm',src)],src),
         Hole(P(eye),2*HR,'in',t,None,'Drill and ream the eye\'s hole',[S('',f'Ø {2*HR}','1.2 H7',src),S('place',f'on r {RP}, on the eye\'s 0° line',None,src)],src,key='eye'),
         Hole(P(hs),2*HR,'in',t,None,'Drill and ream the other hole',[S('',f'Ø {2*HR}','1.2 H7',src),S('place',f'on r {RP}, {UPIN}° from the eye',None,src)],src,key='pin')]
    return Recipe('mspring','050601-1','Maintaining spring (Gegenfeder)',src,'Bandstahl 35 × 1.75 (05 06 01-1)','hardened in oil, blued at 310°, its ends tempered at 400° (05 06 01-1)',[Setup('1','strip on the grinder, then the mill; hardened and blued',ops,view='top')],
      page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,U['GS1'],0)),faces=('face toward the fusee wheel','face toward the ratchet'),
      fits=["the eye's hole on a pin in the maintaining ratchet, the other on a pin in the fusee wheel (05 06 00-8, Ø 1.2)","the ring in the fusee wheel's recess Ø 32.3 +0.05"],
      notes=['Drawn free, as blanked: the page bends it by the running drive (the check freezes it at ms = 0).'])

# RECIPES['mspring']=mspring   # registered with its lift
