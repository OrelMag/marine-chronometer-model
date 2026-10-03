"""The train's layout from the arbors' measured places and the tooth counts (no browser): reads L and TRAIN from ../js/movement.js, as tools/escapement.js does.

    python solve.py          # report; exit code 1 if L disagrees with what it solves, or an arbor runs through a wheel

Measured, taken as they stand in L (the model README, "How the layout was measured"; IDEAS.md 1.11, 1.12): the centre arbor C; the fourth F, under the
seconds hand (manual p. 15); the third T (KLUwI2UUCMQ 13:49.5); the balance B, the fusee Fu and the barrel Ba (the photographed group, placed by one
similarity on the measured balance cap, fusee and barrel). Solved:
  - the escape arbor E: 9.40 mm from the balance (the impulse roller's 0.249 in clears the teeth by 0.002 in either side, roller shake, Op. 84) and the
    fourth's mesh distance from the fourth, on the side L has it; compared with L.E;
  - each stage's module, m = 2 d / (z1 + z2), the centre distance over the teeth (movement.js MOD does the same); the wheels' tips at m (z/2 + 1.15)
    (BS 978 Part 2's proportions, README "Estimated");
  - clearances, in plan: no arbor that runs up from the plate through the wheels' levels (r 1 mm with its boss) within a wheel's tips it doesn't mesh
    with (fine.py tests the solids at their heights).
Re-run it after changing a tooth count or a place in L. Before October 2026 it searched modules and places from Fig. 2's positions, which the photo fits
and the videos have since replaced (Review-results.md, finding 6)."""
import math,pathlib,re,sys
SRC=(pathlib.Path(__file__).resolve().parent.parent/'js'/'movement.js').read_text(encoding='utf-8')
def obj(name):   # a one-line JS object literal of numbers and [x, z] pairs, as Python
    s=re.search(r'^const '+name+r'=(\{.*?\});',SRC,re.M).group(1)
    return eval(re.sub(r'([{,])(\w+):',r'\1"\2":',s))
L,TR=obj('L'),obj('TRAIN')
EB=9.40;FE=11.107   # the escapement's centre distance; the fourth to the escape arbor (KLUwI2UUCMQ: the escape jewel from above, 10:00, put 9.40 from the balance, and the fourth at 21.6; 10.585 until 2 October 2026)
d=lambda a,b:math.hypot(a[0]-b[0],a[1]-b[1])
def circ(p,q,r1,r2,near):   # the intersection of circles r1 about p and r2 about q nearer `near`
    D=d(p,q);a=(r1*r1-r2*r2+D*D)/(2*D);h=math.sqrt(max(0,r1*r1-a*a));ex,ez=(q[0]-p[0])/D,(q[1]-p[1])/D;mx,mz=p[0]+a*ex,p[1]+a*ez
    return min([(mx-h*ez,mz+h*ex),(mx+h*ez,mz-h*ex)],key=lambda s:d(s,near))
F=[];ok=lambda c,m:None if c else F.append(m)
E=circ(L['B'],L['F'],EB,FE,L['E'])
print(f"escape arbor E: solved ({E[0]:.3f}, {E[1]:.3f}), L.E ({L['E'][0]}, {L['E'][1]}), {d(E,L['E']):.3f} mm apart; |BE| {d(L['B'],L['E']):.3f} (want {EB}), |FE| {d(L['F'],L['E']):.3f} (want {FE})")
ok(d(E,L['E'])<0.01,f"L.E is {d(E,L['E']):.3f} mm from where the escapement and the fourth's mesh put it")
# stages: (name, driver arbor, its wheel's teeth, driven arbor, its pinion's leaves)
ST=[('fusee','Fu',TR['fu'],'C',TR['cp']),('centre','C',TR['cw'],'T',TR['tp']),('third','T',TR['tw'],'F',TR['fp']),('fourth','F',TR['fw'],'E',TR['ep'])]
tips={}
for n,a,z,b,p in ST:
    m=2*d(L[a],L[b])/(z+p);tips[a]=m*(z/2+1.15)
    print(f"{n:7s} {a:>2s}-{b:<2s} {d(L[a],L[b]):7.3f} mm  {z}:{p}  module {m:.4f}  wheel tips r {tips[a]:.2f}")
mesh={('Fu','C'),('C','T'),('T','F'),('F','E')}
for w,rt in tips.items():
    for k in ('C','T','F','E','Fu','Ba'):   # the arbors that run up from the pillar plate through the wheels' levels; the balance staff ends in its lower bridge, above them
        if k==w or (w,k) in mesh:continue
        g=d(L[w],L[k])-rt-1.0
        ok(g>0,f"the {k} arbor {g:.2f} mm inside the {w} wheel's tips")
        if g<1.5:print(f"  close: {k} arbor {g:+.2f} mm from the {w} wheel's tips")
for f in F:print('!!',f)
print('ok' if not F else f'{len(F)} problems');sys.exit(1 if F else 0)
