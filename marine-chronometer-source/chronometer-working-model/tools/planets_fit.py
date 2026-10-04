"""planets_fit.py: Jupiter's and Saturn's heliocentric places as short series, fitted to JPL's DE440 for the almanac (shared/almanac.js, ALM.planet).

Standish's Keplerian elements (the almanac's Venus and Mars) err 400" and 600" for Jupiter and Saturn, which pull on each other (the great inequality,
2 lJ - 5 lS, about 900 years). Here each planet's heliocentric ecliptic longitude L, latitude B and radius R (ecliptic and equinox of J2000, as the
elements give them) is fitted by least squares as a polynomial in T (Julian centuries of TDB from J2000) and sines and cosines of k1 lJ + k2 lS + k3 lU,
the planets' mean longitudes (fitted first, linear in T), some with a factor T (the slow change of the orbits). The coefficients come from the ephemeris,
nothing else: no theory's numbers are copied. Terms under the floor (FLOOR) are dropped and the rest refitted.

Data: DE440s (1849-2150) through skyfield, the Jupiter and Saturn barycentres less the Sun, every 4 days over 1850-2150 (the fit, DE440s' span); tested on the dates
2 days between, and, as a measure of how fast it fails outside its span, fitted to 1850-2100 alone and tested on 2100-2149. Writes the series into shared/almanac.js between its PLANET-FIT markers
(--write), or prints the test only.

    python planets_fit.py [--py DIR] [--eph DIR] [--write]     # DIR as almanac_ref.py's (skyfield on sys.path; de440s.bsp); about a minute
"""
import math,pathlib,re,sys,os
import numpy as np
A=sys.argv[1:];opt=lambda k,env,d=None:A[A.index(k)+1] if k in A else os.environ.get(env,d)
PY=opt('--py','ALMANAC_PY');PY and sys.path.insert(0,PY)
from skyfield.api import Loader
HERE=pathlib.Path(__file__).resolve().parent;ALM=HERE.parent.parent/'shared'/'almanac.js'
EPH=opt('--eph','ALMANAC_EPH',str(pathlib.Path.home()/'skyfield-data'))
ld=Loader(EPH);eph=ld('de440s.bsp');ts=ld.timescale(builtin=True)
E0=math.radians(23.4392911);AS=math.pi/180/3600
FLOOR={'L':0.6*AS,'B':0.6*AS,'R':4e-6}   # rad, rad, au: a term kept if its amplitude (with T at the range's ends) is above this
def helio(body,jd):
    t=ts.tdb_jd(jd);p=(eph[body].at(t).position.au-eph['sun'].at(t).position.au)   # ICRF, au
    x,y,z=p;ye=math.cos(E0)*y+math.sin(E0)*z;ze=-math.sin(E0)*y+math.cos(E0)*z
    L=np.unwrap(np.arctan2(ye,x));R=np.sqrt(x*x+ye*ye+ze*ze);B=np.arcsin(ze/R);return L,B,R
J2000=2451545.0;FIT=(2396758.5,2506331.5)   # 1850-2150, DE440s' span
fit_jd=np.arange(FIT[0],FIT[1],4.0);mid_jd=fit_jd[:-1]+2.0
def means(jd):
    T=(jd-J2000)/36525;lam={}
    for k,b in (('J','jupiter barycenter'),('S','saturn barycenter'),('U','uranus barycenter')):
        L,_,_=helio(b,jd);c=np.polyfit(T,L,1);lam[k]=c
    return lam
LAM=means(fit_jd)   # [rate, at J2000] rad per century, rad
MAXP=150
def args(planet):
    out=[]
    for k1 in range(-6,7):
        for k2 in range(-10,11):
            for k3 in ((-2,-1,0,1,2) if planet=='S' else (-1,0,1)):
                if abs(k1)+abs(k2)+abs(k3)==0 or abs(k1)+abs(k2)>12:continue
                if (k1,k2,k3)<(0,0,0) and (-k1,-k2,-k3)!=(k1,k2,k3):   # one of each ± pair
                    if (-k1,-k2,-k3)>(0,0,0):continue
                f=k1*LAM['J'][0]+k2*LAM['S'][0]+k3*LAM['U'][0]   # rad a century
                if abs(f)<2*math.pi*100/MAXP:continue   # longer than MAXP years: inside the range it is the polynomial's
                out.append((k1,k2,k3))
    return sorted(set(out))
def design(jd,terms,tpow):
    T=(jd-J2000)/36525;lj=np.polyval(LAM['J'],T);lsa=np.polyval(LAM['S'],T);lu=np.polyval(LAM['U'],T);cols=[T**p for p in range(tpow+1)]
    for (k1,k2,k3,wt) in terms:
        a=k1*lj+k2*lsa+k3*lu;f=T if wt else 1;cols+=[f*np.sin(a),f*np.cos(a)]
    return np.array(cols).T
def freq(t):return t[0]*LAM['J'][0]+t[1]*LAM['S'][0]+t[2]*LAM['U'][0]
def fit(planet,body,jd=None):
    """greedy: add the candidate (sin, cos) pair that most reduces the residual, refit all, until the best is under FLOOR; a candidate within one cycle a
    span of a chosen term's frequency is skipped (the span can't tell them apart, and least squares would cancel the two against each other)"""
    jd=fit_jd if jd is None else jd;L,B,R=helio(body,jd);res={};T=(jd-J2000)/36525;span=(jd[-1]-jd[0])/36525;sep=2*math.pi/span
    lj=np.polyval(LAM['J'],T);lsa=np.polyval(LAM['S'],T);lu=np.polyval(LAM['U'],T);cand=args(planet)
    A=np.array([k1*lj+k2*lsa+k3*lu for (k1,k2,k3) in cand]);S=np.sin(A);C=np.cos(A)   # candidates × samples
    for name,y,tp in (('L',L,3),('B',B,2),('R',R,2)):
        base=[];X=design(jd,base,tp);c,*_=np.linalg.lstsq(X,y,rcond=None);r=y-X@c
        for step in range(400):
            ps=(S@r)*2/len(r);pc=(C@r)*2/len(r);amp=np.hypot(ps,pc)   # a pair's amplitude in the residual (nearly orthogonal over many cycles)
            fr=[freq((*k,0)) for k in cand];used=[freq(t) for t in base if not t[3]]
            ok=np.array([all(abs(f-u)>sep for u in used) for f in fr])
            amp=np.where(ok,amp,0);i=int(np.argmax(amp))
            if amp[i]<FLOOR[name]:break
            k=cand[i];base.append((*k,0))
            if amp[i]>40*FLOOR[name]:base.append((*k,1))   # a strong term with its slow change
            X=design(jd,base,tp);c,*_=np.linalg.lstsq(X,y,rcond=None);r=y-X@c
        res[name]=(base,tp,c)
    return res
def evalf(f,jd):
    return {n:design(jd,*f[n][:2])@f[n][2] for n in f}
def test(planet,body,f):
    rows=[]
    for label,jd in (('fit dates 1850-2150',fit_jd),('between them',mid_jd)):
        L,B,R=helio(body,jd);e=evalf(f,jd)
        dL=np.angle(np.exp(1j*(e['L']-L)))*np.cos(B);dB=e['B']-B;dR=e['R']-R;ang=np.hypot(dL,dB)/AS   # heliocentric arc, arcsec
        geo=ang*R/np.maximum(R-1.0,1e-9)   # worst case seen from the Earth (at opposition the arc grows by R / (R - 1))
        rows.append(f'  {planet} {label:24s} heliocentric max {ang.max():6.2f}" rms {np.sqrt((ang**2).mean()):5.2f}"; radius max {abs(dR).max()*1.496e8:7.0f} km; from the Earth at worst {geo.max():6.2f}"')
    return rows
def js(planet,f):
    parts=[]
    for n in ('L','B','R'):
        base,tp,c=f[n];poly=','.join(f'{x:.10g}' for x in c[:tp+1])
        terms=','.join(f'[{k1},{k2},{k3},{w},{c[tp+1+2*i]:.6g},{c[tp+2+2*i]:.6g}]' for i,(k1,k2,k3,w) in enumerate(base))
        parts.append(f'{n}:[[{poly}],[{terms}]]')
    return f"{planet}:{{{','.join(parts)}}}"
if __name__=='__main__':
    F={};out=[]
    for planet,name,body in (('J','Jupiter','jupiter barycenter'),('S','Saturn','saturn barycenter')):
        f=fit(planet,body);F[name]=f;out+=test(name,body,f);out.append(f'    terms: L {len(f["L"][0])}, B {len(f["B"][0])}, R {len(f["R"][0])}')
        g=fit(planet,body,fit_jd[fit_jd<2488069.5]);late=np.arange(2488069.5,FIT[1],4.0);L,B,R=helio(body,late);e=evalf(g,late);ang=np.hypot(np.angle(np.exp(1j*(e['L']-L)))*np.cos(B),e['B']-B)/AS
        out.append(f'    beyond the fit: fitted to 1850-2100 alone, 2100-2149 errs up to {ang.max():.1f}" (the series is stated for 1850-2150 only)')
    print('\n'.join(out))
    lam=','.join(f'{k}:[{LAM[k][1]:.10g},{LAM[k][0]:.10g}]' for k in 'JSU')
    blk=(f"/* PLANET-FIT: written by tools/planets_fit.py (DE440, 1850-2150); do not edit by hand */\n  const PFL={{{lam}}},PF={{{js('Jupiter',F['Jupiter'])},{js('Saturn',F['Saturn'])}}};\n  /* PLANET-FIT end */")
    if '--write' in A:
        s=ALM.read_text(encoding='utf-8');m=re.search(r'/\* PLANET-FIT:.*?/\* PLANET-FIT end \*/',s,re.S)
        if not m:sys.exit('no PLANET-FIT markers in shared/almanac.js')
        ALM.write_text(s[:m.start()]+blk+s[m.end():],encoding='utf-8',newline='\n');print('wrote the series into',ALM)
