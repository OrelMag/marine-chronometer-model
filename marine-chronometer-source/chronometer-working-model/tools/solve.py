import math,itertools
# ---- measured (Fig. 2 rectified, scaled by the 87.57 mm pillar plate; movement frame, mm) ----
C=(0,0); Fu=(12.0,-17.8); Ba=(-20.1,4.9); B=(7.9,8.6); F=(0,23.9); U=(0,-23.9)
P1=(-24.4,-25.7); P2=(-11.2,35.0)
RB=13.5      # barrel radius
RBAL=18.0    # balance rim radius (measured 0.46 R_top)
EB=1.55*6.58 # escape-to-balance distance from Rawlings plan (x escape radius 6.58)
d=lambda a,b:math.hypot(a[0]-b[0],a[1]-b[1])
def circ(p,q,r1,r2,side):
    D=d(p,q); 
    if D>r1+r2 or D<abs(r1-r2): return None
    a=(r1*r1-r2*r2+D*D)/(2*D); h=math.sqrt(max(0,r1*r1-a*a))
    ex,ez=(q[0]-p[0])/D,(q[1]-p[1])/D; mx,mz=p[0]+a*ex,p[1]+a*ez
    return (mx-side*h*ez, mz+side*h*ex)
best=[]
# counts: centre 80 / third pinion 10 (x8); third 75 / fourth pinion 10 (x7.5); fourth 60 / escape pinion 8 (x7.5, 16-tooth escape wheel)
for m1 in [x/100 for x in range(26,46)]:
  for m2 in [x/100 for x in range(26,46)]:
    rc,rtp=40*m1,5*m1; rt,rfp=37.5*m2,5*m2
    for side in (1,-1):
      T=circ(C,F,rc+rtp,rt+rfp,side)
      if not T: continue
      for m3 in [x/100 for x in range(26,50)]:
        rf,rep=30*m3,4*m3
        for ang in range(0,360,3):
          E=(B[0]+EB*math.cos(math.radians(ang)),B[1]+EB*math.sin(math.radians(ang)))
          if abs(d(E,F)-(rf+rep))>0.15: continue
          # hard constraints (arbors never pass through a wheel or the barrel; wheels inside plate)
          ok = d(E,C)>rc+0.9+0.6 and d(E,T)>rt+0.9+0.6 and d(T,Ba)>RB+1.2 and d(E,Ba)>RB+1.2 \
               and d(T,Fu)>19.3 and d(E,Fu)>19.3 and d(T,C)+rt<40 and d(E,C)+6.6<38.5 \
               and d(F,Ba)>RB+rf+0.3 and d(T,P1)>rt+3.5 and d(T,P2)>rt+3.5 and d(E,P2)>6.6+3.5
          if not ok: continue
          # soft: prefer modules close to each other, wheels not tiny
          score=abs(m1-m2)+abs(m2-m3)+0.02*abs(rc-15)
          best.append((score,m1,m2,m3,side,round(T[0],2),round(T[1],2),round(E[0],2),round(E[1],2),round(rc,2),round(rt,2),round(rf,2)))
best.sort()
print(len(best))
for b in best[:8]: print(b)
