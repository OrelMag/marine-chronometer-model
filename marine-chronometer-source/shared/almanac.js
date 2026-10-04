// @ts-check
/* almanac.js: a nautical almanac and the navigator's arithmetic, for finding Greenwich time, and so longitude, from the sky alone. Shared by the essay
   (chronometer-working-model/js/essay.js: the sky section's figures, its workbook and the almanac pages it prints) and the check against JPL Horizons and
   skyfield (chronometer-working-model/tools/almanac.js, Node.js; its reference values are tools/almanac-ref.json, made by tools/almanac_ref.py).
   Nothing is declared at the top level but ALM, since the pages declare their own TAU and D2R.

   Sources (named in the essay too): J. Meeus, Astronomical Algorithms, 2nd ed. (Willmann-Bell, 1998): the Julian day (ch. 7), sidereal time at Greenwich
   (ch. 12, 12.4), refraction (ch. 16, Bennett's formula 16.4), precession (ch. 21, 21.2-21.4), nutation and the obliquity (ch. 22, its short series, 0.5″ and 0.1″),
   a star's apparent place (ch. 23, 23.1 and 23.3), the Sun (ch. 25 with the abridged VSOP87 series of Appendix III, about 1″), the Earth's figure (ch. 11),
   parallax (ch. 40, 40.6) and the Moon (ch. 47, the main ELP-2000/82 terms, about 10″ in longitude); ΔT from Espenak and Meeus's polynomials (NASA's eclipse
   pages, 2006). The stars' places are SIMBAD's (ICRS, J2000, with their proper motions). The altitude corrections (dip 1.76′√h, h in metres; the Moon's
   parallax HP cos h and its semi-diameter's augmentation) and the sight reduction (the altitude and azimuth from the navigational triangle, the intercept,
   the time sight) are the Nautical Almanac's and Bowditch's (The American Practical Navigator, Pub. No. 9). The clearing of a lunar distance is the exact
   spherical one: refraction and parallax move each body along its vertical, so the difference of azimuth found from the apparent altitudes and distance
   holds for the true ones too.

   Angles are degrees, the corrections (dip, refraction, parallax, semi-diameter) arcminutes; a time t is JavaScript's milliseconds of UT (Date.UTC). */
/** @typedef {{ra:number,dec:number,gha:number,sd:number,hp:number,name:string}} Body  apparent geocentric place of date: right ascension and declination,
    Greenwich hour angle (°), semi-diameter and horizontal parallax (′) */
const ALM=(()=>{
  const D=Math.PI/180,AS=1/3600,s=x=>Math.sin(x*D),c=x=>Math.cos(x*D),tn=x=>Math.tan(x*D),cl=x=>Math.max(-1,Math.min(1,x)),
    as=x=>Math.asin(cl(x))/D,ac=x=>Math.acos(cl(x))/D,at2=(y,x)=>Math.atan2(y,x)/D,n360=a=>(a%360+360)%360,n180=a=>{a=n360(a);return a>180?a-360:a;};
  const JD=t=>t/864e5+2440587.5,MS=j=>(j-2440587.5)*864e5;

  /* ---------- time ---------- */
  /** ΔT = TT − UT1 (s) for a decimal year: Espenak and Meeus's polynomials (2006) to 2000; the IERS's measured values from 2000 to October 2026 (each 1 January,
      as skyfield 1.55 carries them: DT); then a forecast: the last held to 2050, and after that growing as their long-term parabola (−20 + 32 u², u centuries
      from 1820) does. No one can say what the Earth's turning will do; a second of ΔT moves the Moon 0.5″ and a lunar distance's Greenwich time by a second,
      and leaves the Sun's and stars' hour angles alone. setDeltaT(v) fixes it (null: this again). */
  let dTfix=null;
  const DT=[63.829,64.091,64.3,64.473,64.574,64.688,64.845,65.146,65.457,65.777,66.07,66.325,66.603,66.907,67.281,67.644,68.102,68.593,68.968,69.22,69.361,69.359,
    69.294,69.204,69.175,69.138,69.11],DT_END=[2026.75,69.091],P=y=>{const u=(y-1820)/100;return -20+32*u*u;};
  function deltaT(y){let u;if(dTfix!=null)return dTfix;
    if(y<1900)return P(y);
    if(y<1920){u=y-1900;return -2.79+1.494119*u-0.0598939*u*u+0.0061966*u**3-0.000197*u**4;}
    if(y<1941){u=y-1920;return 21.20+0.84493*u-0.0761*u*u+0.0020936*u**3;}
    if(y<1961){u=y-1950;return 29.07+0.407*u-u*u/233+u**3/2547;}
    if(y<1986){u=y-1975;return 45.45+1.067*u-u*u/260-u**3/718;}
    if(y<2000){u=y-2000;return 63.86+0.3345*u-0.060374*u*u+0.0017275*u**3+0.000651814*u**4+0.00002373599*u**5;}
    if(y<2026){const i=Math.floor(y-2000);return DT[i]+(DT[i+1]-DT[i])*(y-2000-i);}
    if(y<DT_END[0])return DT[26]+(DT_END[1]-DT[26])*(y-2026)/(DT_END[0]-2026);
    return DT_END[1]+(y>2050?P(y)-P(2050):0);}
  const yearOf=j=>2000+(j-2451545)/365.25,TT=j=>j+deltaT(yearOf(j))/86400;
  /** nutation in longitude and obliquity, and the true obliquity (°), T Julian centuries of TT from J2000 (Meeus 22: the short series) */
  function nut(T){const Om=125.04452-1934.136261*T+0.0020708*T*T+T**3/450000,L=280.4665+36000.7698*T,Lm=218.3165+481267.8813*T;
    return{dpsi:(-17.20*s(Om)-1.32*s(2*L)-0.23*s(2*Lm)+0.21*s(2*Om))*AS,eps:23.4392911111-(46.8150*T+0.00059*T*T-0.001813*T**3)*AS+(9.20*c(Om)+0.57*c(2*L)+0.10*c(2*Lm)-0.09*c(2*Om))*AS,
      deps:(9.20*c(Om)+0.57*c(2*L)+0.10*c(2*Lm)-0.09*c(2*Om))*AS};}
  /** Greenwich mean and apparent sidereal time (°) at the Julian day j of UT (Meeus 12.4; the apparent adds the equation of the equinoxes, Δψ cos ε).
      The apparent sidereal time is the Greenwich hour angle of Aries the Nautical Almanac tabulates. */
  function gmst(j){const d=j-2451545,T=d/36525;return n360(280.46061837+360.98564736629*d+0.000387933*T*T-T**3/38710000);}
  function gast(j){const N=nut((TT(j)-2451545)/36525);return n360(gmst(j)+N.dpsi*c(N.eps));}
  const eqOf=(l,b,e)=>({ra:n360(at2(s(l)*c(e)-tn(b)*s(e),c(l))),dec:as(s(b)*c(e)+c(b)*s(e)*s(l))});

  /* ---------- the Sun: the Earth's heliocentric place by VSOP87 (Meeus, Appendix III, abridged: A cos(B + C τ), τ millennia of TT from J2000; 1e-8 rad, au) ---------- */
  const EL=[[175347046,0,0,3341656,4.6692568,6283.07585,34894,4.6261,12566.1517,3497,2.7441,5753.3849,3418,2.8289,3.5231,3136,3.6277,77713.7715,2676,4.4181,7860.4194,
      2343,6.1352,3930.2097,1324,0.7425,11506.7698,1273,2.0371,529.691,1199,1.1096,1577.3435,990,5.233,5884.927,902,2.045,26.298,857,3.508,398.149,780,1.179,5223.694,
      753,2.533,5507.553,505,4.583,18849.228,492,4.205,775.523,357,2.92,0.067,317,5.849,11790.629,284,1.899,796.298,271,0.315,10977.079,243,0.345,5486.778,206,4.806,2544.314,
      205,1.869,5573.143,202,2.458,6069.777,156,0.833,213.299,132,3.411,2942.463,126,1.083,20.775,115,0.645,0.98,103,0.636,4694.003,102,0.976,15720.839,102,4.267,7.114,
      99,6.21,2146.17,98,0.68,155.42,86,5.98,161000.69,85,1.3,6275.96,85,3.67,71430.7,80,1.81,17260.15,79,3.04,12036.46,75,1.76,5088.63,74,3.5,3154.69,74,4.68,801.82,
      70,0.83,9437.76,62,3.98,8827.39,61,1.82,7084.9,57,2.78,6286.6,56,4.39,14143.5,56,3.47,6279.55,52,0.19,12139.55,52,1.33,1748.02,51,0.28,5856.48,49,0.49,1194.45,
      41,5.37,8429.24,41,2.4,19651.05,39,6.17,10447.39,37,6.04,10213.29,37,2.57,1059.38,36,1.71,2352.87,36,1.78,6812.77,33,0.59,17789.85,30,0.44,83996.85,30,2.74,1349.87,
      25,3.16,4690.48],
    [628331966747,0,0,206059,2.678235,6283.07585,4303,2.6351,12566.1517,425,1.59,3.523,119,5.796,26.298,109,2.966,1577.344,93,2.59,18849.23,72,1.14,529.69,68,1.87,398.15,
      67,4.41,5507.55,59,2.89,5223.69,56,2.17,155.42,45,0.4,796.3,36,0.47,775.52,29,2.65,7.11,21,5.34,0.98,19,1.85,5486.78,19,4.97,213.3,17,2.99,6275.96,16,0.03,2544.31,
      16,1.43,2146.17,15,1.21,10977.08,12,2.83,1748.02,12,3.26,5088.63,12,5.27,1194.45,12,2.08,4694,11,0.77,553.57,10,1.3,6286.6,10,4.24,1349.87,9,2.7,242.73,9,5.64,951.72,
      8,5.3,2352.87,6,2.65,9437.76,6,4.67,4690.48],
    [52919,0,0,8720,1.0721,6283.0758,309,0.867,12566.152,27,0.05,3.52,16,5.19,26.3,16,3.68,155.42,10,0.76,18849.23,9,2.06,77713.77,7,0.83,775.52,5,4.66,1577.34,4,1.03,7.11,
      4,3.44,5573.14,3,5.14,796.3,3,6.05,5507.55,3,1.19,242.73,3,6.12,529.69,3,0.31,398.15,3,2.28,553.57,2,4.38,5223.69,2,3.75,0.98],
    [289,5.844,6283.076,35,0,0,17,5.49,12566.15,3,5.2,155.42,1,4.72,3.52,1,5.3,18849.23,1,5.97,242.73],[114,3.142,0,8,4.13,6283.08,1,3.84,12566.15],[1,3.14,0]],
    EB=[[280,3.199,84334.662,102,5.422,5507.553,80,3.88,5223.69,44,3.7,2352.87,32,4,1577.34],[9,3.9,5507.55,6,1.73,5223.69]],
    ER=[[100013989,0,0,1670700,3.0984635,6283.07585,13956,3.05525,12566.1517,3084,5.1985,77713.7715,1628,1.1739,5753.3849,1576,2.8469,7860.4194,925,5.453,11506.77,
      542,4.564,3930.21,472,3.661,5884.927,346,0.964,5507.553,329,5.9,5223.694,307,0.299,5573.143,243,4.273,11790.629,212,5.847,1577.344,186,5.022,10977.079,175,3.012,18849.228,
      110,5.055,5486.778,98,0.89,6069.78,86,5.69,15720.84,86,1.27,161000.69,65,0.27,17260.15,63,0.92,529.69,57,2.01,83996.85,56,5.24,71430.7,49,3.25,2544.31,47,2.58,775.52,
      45,5.54,9437.76,43,6.01,6275.96,39,5.36,4694,38,2.39,8827.39,37,0.83,19651.05,37,4.9,12139.55,36,1.67,12036.46,35,1.84,2942.46,33,0.24,7084.9,32,0.18,5088.63,
      32,1.78,398.15,28,1.21,6286.6,28,1.9,6279.55,26,4.59,10447.39],
    [103019,1.10749,6283.07585,1721,1.0644,12566.1517,702,3.142,0,32,1.02,18849.23,31,2.84,5507.55,25,1.32,5223.69,18,1.42,1577.34,10,5.91,10977.08,9,1.42,6275.96,9,0.27,5486.78],
    [4359,5.7846,6283.0758,124,5.579,12566.152,12,3.14,0,9,3.63,77713.77,6,1.87,5573.14,3,5.47,18849.23],[145,4.273,6283.076,7,3.92,12566.15],[4,2.56,6283.08]];
  const vs=(S,t)=>{let r=0,tp=1;for(const a of S){let x=0;for(let i=0;i<a.length;i+=3)x+=a[i]*Math.cos(a[i+1]+a[i+2]*t);r+=x*tp;tp*=t;}return r/1e8;};
  /** the Sun's geometric longitude and latitude (FK5, mean equinox of date, °) and distance (au) at the Julian day of TT */
  function sunGeo(jde){const t=(jde-2451545)/365250,T=t*10;let l=n360(vs(EL,t)/D+180),b=-vs(EB,t)/D;const lp=l-1.397*T-0.00031*T*T;l-=0.09033*AS;b+=0.03916*AS*(c(lp)-s(lp));
    return{l,b,R:vs(ER,t),T};}
  /** @returns {Body & {au:number,eot:number,lon:number}} the Sun at t: the apparent place, its distance (au), and the equation of time (minutes, apparent less mean time) */
  function sun(t){const j=JD(t),g=sunGeo(TT(j)),N=nut(g.T),l=g.l+N.dpsi-20.4898*AS/g.R,e=eqOf(l,g.b,N.eps),gha=n360(gmst(j)+N.dpsi*c(N.eps)-e.ra),
      mean=n360(((j+0.5)%1)*360+180);   /* the mean sun's hour angle at Greenwich: UT itself */
    return{name:'Sun',ra:e.ra,dec:e.dec,gha,au:g.R,sd:959.63/g.R/60,hp:8.794/g.R/60,eot:n180(gha-mean)*4,lon:l};}

  /** the Sun by hand, as the essay prints it: the Astronomical Almanac's low-precision formulas (about 0.01° from 1950 to 2050), and Aries' hour angle from
      D whole days after 2000 January 1, 0h UT and H hours of UT. Enough for a time sight, not for a lunar (the Moon needs the full series, so its pages are printed) */
  function sunHand(t){const n=JD(t)-2451545,Dd=Math.floor(n+0.5),H=(n+0.5-Dd)*24,L=280.46+0.9856474*n,g=357.528+0.9856003*n,l=L+1.915*s(g)+0.02*s(2*g),e=23.439-0.0000004*n,
      ra=n360(at2(c(e)*s(l),c(l))),aries=n360(99.9678+0.98564737*Dd+15.0410686*H);return{ra,dec:as(s(e)*s(l)),gha:n360(aries-ra),aries,eot:n180(L-ra)*4};}

  /* ---------- the Moon (Meeus 47: tables 47.A (D, M, M′, F; Σl in 1e-6°, Σr in 1e-3 km) and 47.B (D, M, M′, F; Σb)) ---------- */
  const MA=[0,0,1,0,6288774,-20905355,2,0,-1,0,1274027,-3699111,2,0,0,0,658314,-2955968,0,0,2,0,213618,-569925,0,1,0,0,-185116,48888,0,0,0,2,-114332,-3149,
    2,0,-2,0,58793,246158,2,-1,-1,0,57066,-152138,2,0,1,0,53322,-170733,2,-1,0,0,45758,-204586,0,1,-1,0,-40923,-129620,1,0,0,0,-34720,108743,0,1,1,0,-30383,104755,
    2,0,0,-2,15327,10321,0,0,1,2,-12528,0,0,0,1,-2,10980,79661,4,0,-1,0,10675,-34782,0,0,3,0,10034,-23210,4,0,-2,0,8548,-21636,2,1,-1,0,-7888,24208,2,1,0,0,-6766,30824,
    1,0,-1,0,-5163,-8379,1,1,0,0,4987,-16675,2,-1,1,0,4036,-12831,2,0,2,0,3994,-10445,4,0,0,0,3861,-11650,2,0,-3,0,3665,14403,0,1,-2,0,-2689,-7003,2,0,-1,2,-2602,0,
    2,-1,-2,0,2390,10056,1,0,1,0,-2348,6322,2,-2,0,0,2236,-9884,0,1,2,0,-2120,5751,0,2,0,0,-2069,0,2,-2,-1,0,2048,-4950,2,0,1,-2,-1773,4130,2,0,0,2,-1595,0,
    4,-1,-1,0,1215,-3958,0,0,2,2,-1110,0,3,0,-1,0,-892,3258,2,1,1,0,-810,2616,4,-1,-2,0,759,-1897,0,2,-1,0,-713,-2117,2,2,-1,0,-700,2354,2,1,-2,0,691,0,2,-1,0,-2,596,0,
    4,0,1,0,549,-1423,0,0,4,0,537,-1117,4,-1,0,0,520,-1571,1,0,-2,0,-487,-1739,2,1,0,-2,-399,0,0,0,2,-2,-381,-4421,1,1,1,0,351,0,3,0,-2,0,-340,0,4,0,-3,0,330,0,
    2,-1,2,0,327,0,0,2,1,0,-323,1165,1,1,-1,0,299,0,2,0,3,0,294,0,2,0,-1,-2,0,8752],
    MB=[0,0,0,1,5128122,0,0,1,1,280602,0,0,1,-1,277693,2,0,0,-1,173237,2,0,-1,1,55413,2,0,-1,-1,46271,2,0,0,1,32573,0,0,2,1,17198,2,0,1,-1,9266,0,0,2,-1,8822,
    2,-1,0,-1,8216,2,0,-2,-1,4324,2,0,1,1,4200,2,1,0,-1,-3359,2,-1,-1,1,2463,2,-1,0,1,2211,2,-1,-1,-1,2065,0,1,-1,-1,-1870,4,0,-1,-1,1828,0,1,0,1,-1794,0,0,0,3,-1749,
    0,1,-1,1,-1565,1,0,0,1,-1491,0,1,1,1,-1475,0,1,1,-1,-1410,0,1,0,-1,-1344,1,0,0,-1,-1335,0,0,3,1,1107,4,0,0,-1,1021,4,0,-1,1,833,0,0,1,-3,777,4,0,-2,1,671,
    2,0,0,-3,607,2,0,2,-1,596,2,-1,1,-1,491,2,0,-2,1,-451,0,0,3,-1,439,2,0,2,1,422,2,0,-3,-1,421,2,1,-1,1,-366,2,1,0,1,-351,4,0,0,1,331,2,-1,1,1,315,2,-2,0,-1,302,
    0,0,1,3,-283,2,1,1,-1,-229,1,1,0,-1,223,1,1,0,1,223,0,1,-2,-1,-220,2,1,-1,-1,-220,1,0,1,1,-185,2,-1,-2,-1,181,0,1,2,1,-177,4,0,-2,-1,176,4,-1,-1,-1,166,
    1,0,1,-1,-164,4,0,1,-1,132,1,0,-1,-1,-119,4,-1,0,-1,115,2,-2,0,1,107];
  /** @returns {Body & {km:number,lon:number,lat:number}} the Moon at t: the apparent place (the ELP terms with nutation), its distance (km) */
  function moon(t){const j=JD(t),T=(TT(j)-2451545)/36525,
      Lp=n360(218.3164477+481267.88123421*T-0.0015786*T*T+T**3/538841-T**4/65194000),Dm=n360(297.8501921+445267.1114034*T-0.0018819*T*T+T**3/545868-T**4/113065000),
      M=n360(357.5291092+35999.0502909*T-0.0001536*T*T+T**3/24490000),Mp=n360(134.9633964+477198.8675055*T+0.0087414*T*T+T**3/69699-T**4/14712000),
      F=n360(93.272095+483202.0175233*T-0.0036539*T*T-T**3/3526000+T**4/863310000),A1=119.75+131.849*T,A2=53.09+479264.29*T,A3=313.45+481266.484*T,
      E=1-0.002516*T-0.0000074*T*T,ef=m=>m===0?1:Math.abs(m)===1?E:E*E;
    let sl=0,sr=0,sb=0;
    for(let i=0;i<MA.length;i+=6){const a=MA[i]*Dm+MA[i+1]*M+MA[i+2]*Mp+MA[i+3]*F,e=ef(MA[i+1]);sl+=MA[i+4]*e*s(a);sr+=MA[i+5]*e*c(a);}
    for(let i=0;i<MB.length;i+=5){const a=MB[i]*Dm+MB[i+1]*M+MB[i+2]*Mp+MB[i+3]*F;sb+=MB[i+4]*ef(MB[i+1])*s(a);}
    sl+=3958*s(A1)+1962*s(Lp-F)+318*s(A2);sb+=-2235*s(Lp)+382*s(A3)+175*s(A1-F)+175*s(A1+F)+127*s(Lp-Mp)-115*s(Lp+Mp);
    const km=385000.56+sr/1000,N=nut(T),l=n360(Lp+sl/1e6+N.dpsi),b=sb/1e6,e=eqOf(l,b,N.eps);
    return{name:'Moon',ra:e.ra,dec:e.dec,gha:n360(gmst(j)+N.dpsi*c(N.eps)-e.ra),km,hp:as(6378.14/km)*60,sd:as(0.2725076*6378.14/km)*60,lon:l,lat:b};}

  /* ---------- the stars: the Nautical Almanac's 57 and Polaris (n 0): [n, name, α, δ (ICRS J2000, °), μα cos δ, μδ (mas a year), V] from SIMBAD ---------- */
  /** @type {[number,string,number,number,number,number,number][]} */
  const STARS=[[1,'Alpheratz',2.0969162,29.0904311,137.46,-163.44,2.06],[2,'Ankaa',6.5710475,-42.3059872,233.05,-356.30,2.38],[3,'Schedar',10.1268460,56.5373292,49.13,-31.59,2.23],[4,'Diphda',10.8973787,-17.9866063,232.55,31.99,2.01],[5,'Achernar',24.4285228,-57.2367528,87.00,-38.24,0.46],[6,'Hamal',31.7933571,23.4624176,188.55,-148.08,2.01],
    [7,'Acamar',44.5653136,-40.3046812,-52.89,21.98,3.18],[8,'Menkar',45.5698878,4.0897388,-10.41,-76.85,2.53],[9,'Mirfak',51.0807087,49.8611793,23.75,-26.23,1.79],[10,'Aldebaran',68.9801628,16.5093024,63.45,-188.94,0.86],[11,'Rigel',78.6344671,-8.2016384,1.31,0.50,0.13],[12,'Capella',79.1723279,45.9979915,75.25,-426.89,0.08],
    [13,'Bellatrix',81.2827636,6.3497033,-8.11,-12.88,1.64],[14,'Elnath',81.5729713,28.6074517,22.76,-173.58,1.65],[15,'Alnilam',84.0533889,-1.2019191,1.44,-0.78,1.69],[16,'Betelgeuse',88.7929390,7.4070640,27.54,11.30,0.42],[17,'Canopus',95.9879578,-52.6956614,19.93,23.24,-0.74],[18,'Sirius',101.2871553,-16.7161159,-546.01,-1223.07,-1.46],
    [19,'Adhara',104.6564532,-28.9720862,3.24,1.33,1.50],[20,'Procyon',114.8254979,5.2249876,-714.59,-1036.80,0.37],[21,'Pollux',116.3289578,28.0261989,-626.55,-45.80,1.14],[22,'Avior',125.6284802,-59.5094842,-25.52,22.06,1.86],[23,'Suhail',136.9989911,-43.4325909,-24.01,13.52,2.21],[24,'Miaplacidus',138.2999061,-69.7172076,-156.47,108.95,1.69],
    [25,'Alphard',141.8968446,-8.6585995,-15.23,34.37,1.97],[26,'Regulus',152.0929624,11.9672088,-248.73,5.59,1.40],[27,'Dubhe',165.9319647,61.7510347,-134.11,-34.70,1.79],[28,'Denebola',177.2649098,14.5720581,-497.68,-114.67,2.13],[29,'Gienah',183.9515450,-17.5419305,-158.61,21.86,2.58],[30,'Acrux',186.6495667,-63.0990917,-35.40,-14.70,1.28],
    [31,'Gacrux',187.7914984,-57.1132135,28.23,-265.08,1.64],[32,'Alioth',193.5072900,55.9598230,111.91,-8.24,1.77],[33,'Spica',201.2982474,-11.1613195,-42.35,-30.67,0.97],[34,'Alkaid',206.8851573,49.3132667,-121.17,-14.91,1.86],[35,'Hadar',210.9558556,-60.3730352,-33.27,-23.16,0.58],[36,'Menkent',211.6706147,-36.3699547,-520.53,-518.06,2.05],
    [37,'Arcturus',213.9153003,19.1824092,-1093.39,-2000.06,-0.05],[38,'Rigil Kentaurus',219.9020583,-60.8339927,-3679.25,473.67,0.01],[39,'Zubenelgenubi',222.7196379,-16.0417765,-105.68,-68.40,2.75],[40,'Kochab',222.6763575,74.1555039,-32.61,11.42,2.08],[41,'Alphecca',233.6719520,26.7146850,118.93,-87.71,2.24],[42,'Antares',247.3519154,-26.4320026,-12.11,-23.30,0.91],
    [43,'Atria',252.1662295,-69.0277118,17.99,-31.58,1.88],[44,'Sabik',257.5945287,-15.7249066,40.13,99.17,2.42],[45,'Shaula',263.4021672,-37.1038236,-8.53,-30.80,1.63],[46,'Rasalhague',263.7336227,12.5600374,108.07,-221.57,2.07],[47,'Eltanin',269.1515412,51.4888956,-8.48,-22.79,2.23],[48,'Kaus Australis',276.0429934,-34.3846165,-39.42,-124.20,1.81],
    [49,'Vega',279.2347348,38.7836890,200.94,286.23,0.03],[50,'Nunki',283.8163604,-26.2967241,15.14,-53.43,2.07],[51,'Altair',297.6958273,8.8683212,536.23,385.29,0.76],[52,'Peacock',306.4119044,-56.7350897,6.90,-86.02,1.92],[53,'Deneb',310.3579798,45.2803388,2.01,1.85,1.25],[54,'Enif',326.0464839,9.8750087,26.92,0.44,2.39],
    [55,'Al Na’ir',332.0582697,-46.9609744,126.69,-147.47,1.71],[56,'Fomalhaut',344.4126927,-29.6222370,328.95,-164.67,1.16],[57,'Markab',346.1902227,15.2052671,60.40,-41.30,2.48],[0,'Polaris',37.9545607,89.2641090,44.48,-11.85,2.02]];
  /** @returns {Body & {sha:number,n:number,v:number}} star i (its index in STARS) at t: proper motion to the date, precession (Meeus 21), nutation (23.1) and
      annual aberration (23.3); the annual parallax (under 0.8″) and light's bending are left out */
  function star(i,t){const[n,name,a0,d0,pa,pd,v]=STARS[i],j=JD(t),jde=TT(j),T=(jde-2451545)/36525,y=T*100;
    let a=a0+pa/3.6e6/c(d0)*y,d=d0+pd/3.6e6*y;
    const z1=(2306.2181*T+0.30188*T*T+0.017998*T**3)*AS,z2=(2306.2181*T+1.09468*T*T+0.018203*T**3)*AS,th=(2004.3109*T-0.42665*T*T-0.041833*T**3)*AS,
      A=c(d)*s(a+z1),B=c(th)*c(d)*c(a+z1)-s(th)*s(d),C=s(th)*c(d)*c(a+z1)+c(th)*s(d);
    a=n360(at2(A,B)+z2);d=Math.abs(C)>0.99?Math.sign(C)*ac(Math.hypot(A,B)):as(C);
    const N=nut(T),e=N.eps,L=sunGeo(jde).l,k=20.49552*AS,ec=0.016708634-0.000042037*T-0.0000001267*T*T,pi=102.93735+1.71946*T+0.00046*T*T,
      da=(c(e)+s(e)*s(a)*tn(d))*N.dpsi-c(a)*tn(d)*N.deps+(-k*(c(a)*c(L)*c(e)+s(a)*s(L))+ec*k*(c(a)*c(pi)*c(e)+s(a)*s(pi)))/c(d),
      dd=s(e)*c(a)*N.dpsi+s(a)*N.deps-k*(c(L)*c(e)*(tn(e)*c(d)-s(a)*s(d))+c(a)*s(d)*s(L))+ec*k*(c(pi)*c(e)*(tn(e)*c(d)-s(a)*s(d))+c(a)*s(d)*s(pi));
    a=n360(a+da);d+=dd;return{name,n,v,ra:a,dec:d,sha:n360(360-a),gha:n360(gmst(j)+N.dpsi*c(e)-a),sd:0,hp:0};}
  /* ---------- Venus and Mars: JPL's approximate Keplerian elements (E. M. Standish, "Keplerian Elements for Approximate Positions of the Major Planets",
     Table 1, 1800-2050: a au, e, I, L, long. of perihelion, long. of node, each with its rate a century; their errors 20″ and 40″ in heliocentric longitude),
     the Earth from the Earth-Moon barycentre less the Moon's share (1/82.3 of its geocentric place), light-time, then the stars' precession, nutation and
     aberration. Good to about a minute of arc from the Earth: for sights, not lunars. Jupiter and Saturn: these elements err 400″ and 600″ for them (they pull
     on each other, the great inequality), so their heliocentric places are short series fitted by least squares to JPL's DE440 over 1850-2150 (PF below,
     tools/planets_fit.py): L, B, R as polynomials in T and sines and cosines of k1 λJ + k2 λS + k3 λU, the mean longitudes, some with a factor T; within
     8″ (Jupiter) and 4″ (Saturn) of DE440 seen from the Earth, and no good outside 1850-2150 */
  const KEP={Venus:[0.72333566,0.00677672,3.39467605,181.9790995,131.60246718,76.67984255,0.0000039,-0.00004107,-0.0007889,58517.81538729,0.00268329,-0.27769418,8.34],
    Mars:[1.52371034,0.0933941,1.84969142,-4.55343205,-23.94362959,49.55953891,0.00001847,0.00007882,-0.00813131,19140.30268499,0.44441088,-0.29257343,4.68],
    EMB:[1.00000261,0.01671123,-0.00001531,100.46457166,102.93768193,0,0.00000562,-0.00004392,-0.01294668,35999.37244981,0.32327364,0]};
  /* PLANET-FIT: written by tools/planets_fit.py (DE440, 1850-2150); do not edit by hand */
  const PFL={J:[82.28126443,52.96701272],S:[32.2871165,21.33440136],U:[11.7456406,7.483165012]},PF={Jupiter:{L:[[82.28170134,52.96521815,-0.0001491179587,0.0002933228138],[[1,0,0,0,0.0936515,-0.0245479],[1,0,0,1,-0.000176986,-0.000366037],[2,0,0,0,0.00267777,-0.0014904],[2,0,0,1,-2.16922e-05,-2.60043e-05],[2,-2,0,0,0.000967685,-2.47997e-05],[2,-2,0,1,5.2973e-06,-6.12522e-06],[1,-2,0,0,0.000613097,-0.000130829],[1,-2,0,1,3.25847e-05,-1.29792e-05],[2,-3,0,0,0.00023616,-0.000319862],[2,-3,0,1,-9.03924e-06,1.53563e-05],[1,-1,0,0,-0.000380331,9.20869e-06],[1,-1,0,1,5.92491e-06,-4.01621e-06],[3,0,0,0,9.44865e-05,-9.34115e-05],[3,0,0,1,-2.20236e-06,2.91411e-06],[3,-3,0,0,8.67007e-05,-2.26794e-05],[2,-7,-1,0,-6.99146e-05,8.56223e-05],[3,-4,0,0,-3.54257e-05,6.27997e-05],[3,-2,0,0,5.94105e-05,-1.4007e-05],[2,-4,0,0,9.78659e-06,5.69234e-05],[2,-6,0,0,2.97799e-05,-2.64099e-05],[2,-2,-1,0,-2.03689e-05,-3.13917e-05],[2,-1,0,0,-2.02906e-05,1.57012e-05],[4,-8,1,0,1.31766e-05,1.44257e-05],[4,-4,0,0,1.64998e-05,4.30882e-06],[1,-5,1,0,-1.1525e-05,1.37583e-06],[2,-8,1,0,-8.58031e-06,1.56408e-05],[1,-1,-1,0,-5.25601e-06,-1.04093e-05],[4,0,0,0,3.13228e-06,-5.64545e-06],[1,-7,-1,0,-6.81085e-06,6.03967e-06],[4,-3,0,0,5.85026e-06,-1.98356e-06],[4,-2,0,0,4.01702e-06,-2.87851e-06],[3,-9,1,0,-2.96488e-06,5.67667e-06],[3,-5,1,0,-6.19963e-07,5.10682e-06],[2,-4,-1,0,-2.35337e-07,-4.37518e-06],[2,-9,0,0,2.00082e-06,-3.67536e-06],[1,-6,0,0,2.0539e-06,-3.09819e-06]]],B:[[0.001098848757,-3.511742254e-06,1.416822065e-06],[[1,0,0,0,-0.0041197,-0.0223246],[1,0,0,1,-0.000103332,5.67301e-05],[2,0,0,0,-0.000466851,-0.000995051],[2,0,0,1,-7.6076e-06,7.62247e-06],[3,0,0,0,-3.86086e-05,-4.63866e-05],[0,2,0,0,-1.82287e-06,1.19302e-05],[3,-2,0,0,-2.28712e-06,-1.06437e-05],[2,-2,0,0,-3.25711e-06,-7.54192e-06],[0,1,0,0,-2.05903e-06,-6.43039e-06],[1,-2,0,0,2.81004e-06,5.06407e-06],[2,-1,0,0,1.7265e-06,5.17182e-06],[3,-3,0,0,-4.40546e-06,-2.42692e-06],[0,2,1,0,-1.47113e-06,-3.80943e-06],[4,0,0,0,-2.86365e-06,-2.05691e-06]]],R:[[5.209107471,-2.034555865e-06,-5.101213337e-05],[[1,0,0,0,-0.0636916,-0.243581],[1,0,0,1,-0.00108035,0.000237659],[2,0,0,0,-0.00301721,-0.00533082],[2,0,0,1,-6.18028e-05,5.026e-05],[2,-2,0,0,-6.0662e-05,-0.00280802],[2,-2,0,1,-2.22232e-05,-4.37679e-06],[2,-3,0,0,-0.000706041,-0.00052208],[2,-3,0,1,5.45094e-05,1.6057e-05],[1,-1,0,0,1.38665e-05,0.000639386],[1,-1,0,1,-1.57213e-05,3.99817e-06],[3,-3,0,0,-4.82475e-05,-0.000299841],[3,-3,0,1,1.17553e-08,2.40198e-07],[1,-2,0,0,-9.22568e-05,-0.000290393],[1,-2,0,1,8.07576e-06,-4.73213e-06],[3,-4,0,0,0.000192792,0.000120176],[3,-4,0,1,-1.94438e-06,-7.93843e-06],[3,0,0,0,-0.000155261,-0.000140757],[3,0,0,1,1.42585e-05,3.62625e-06],[2,-7,-1,0,-0.000309865,-0.00028368],[2,-7,-1,1,-0.000194169,0.000172771],[3,-2,0,0,-2.52475e-05,-0.000128373],[4,-4,0,0,8.97665e-06,-6.96057e-05],[2,-1,0,0,4.42718e-05,4.48405e-05],[2,-4,0,0,5.86008e-05,5.29919e-06],[2,-6,0,0,1.28806e-05,4.09606e-05],[2,-2,-1,0,-2.7627e-05,3.84988e-05],[4,-3,0,0,-1.7929e-06,-1.55659e-05],[1,-7,-1,0,-1.88163e-05,-1.92181e-05],[5,-6,0,0,1.101e-05,6.62532e-06],[4,-2,0,0,-7.47331e-06,-8.90905e-06],[2,-9,0,0,8.51152e-06,4.13193e-06],[1,-3,-1,0,2.74857e-06,1.48873e-05],[1,-5,1,0,2.26274e-07,-1.50231e-05],[4,0,0,0,-8.27999e-06,-3.32733e-06],[6,-6,0,0,7.07069e-07,-8.14714e-06],[1,-6,-1,0,4.44182e-06,8.62879e-06],[2,-8,1,0,-1.00132e-05,-1.26595e-05],[1,-1,-1,0,-7.55608e-07,4.60446e-06],[4,-6,1,0,2.66307e-06,-6.3818e-06],[2,-3,-1,0,-8.30516e-06,-1.18897e-05],[2,-7,1,0,-7.92497e-06,9.40326e-06],[5,-4,0,0,1.65498e-06,-4.7891e-06],[3,-7,1,0,1.84702e-06,-7.34289e-06],[3,-3,1,0,-4.23692e-06,7.53414e-06],[3,-6,1,0,3.63023e-06,3.29677e-06]]]},Saturn:{L:[[32.28822583,21.33949093,0.000298332759,-0.0007255192783],[[0,1,0,0,-0.00471643,-0.108741],[0,1,0,1,0.00044623,0.000136405],[0,2,0,0,-0.00341936,8.63772e-05],[0,2,0,1,7.99523e-05,-1.55591e-05],[1,-2,0,0,-0.00196464,0.000554496],[1,-2,0,1,-0.000157524,1.46561e-05],[3,-8,-1,0,0.000454744,-0.000607523],[3,-8,-1,1,-0.000417475,-0.000273082],[2,-2,0,0,-0.000147378,-0.000115934],[2,-2,0,1,0.000112159,1.85742e-05],[1,-1,0,0,5.78745e-05,0.000133565],[1,-1,0,1,-3.04425e-06,3.96219e-06],[0,2,-2,0,6.66017e-05,2.1165e-06],[2,-4,-1,0,4.96366e-05,2.52284e-05],[1,-5,0,0,1.67174e-05,-3.3045e-05],[3,-3,0,0,-3.23439e-05,-6.15627e-07],[0,1,-2,0,6.96699e-06,3.4086e-05],[3,-4,0,0,1.0104e-05,-1.78981e-05],[1,-5,-1,0,-1.144e-06,1.98644e-05],[3,-4,-1,0,4.70612e-06,-9.44502e-06],[2,-5,-2,0,7.60585e-06,1.74352e-05],[2,-4,2,0,3.74166e-06,1.21616e-05],[1,-4,-1,0,-1.10863e-05,1.1864e-05],[2,-2,-1,0,-1.99049e-06,-7.50223e-06],[4,-4,0,0,-9.55116e-06,-2.9055e-07],[3,-7,2,0,1.22535e-05,6.944e-06],[2,-1,0,0,6.81509e-06,3.14959e-06],[3,-5,0,0,1.09037e-06,-9.93432e-06],[1,0,-2,0,-5.35756e-06,-6.9454e-06],[4,-5,0,0,3.12435e-06,-5.85382e-06],[3,-4,-2,0,5.58215e-07,6.57696e-06],[3,-8,1,0,-2.53003e-06,-3.87155e-06],[2,-6,-1,0,1.00481e-05,-4.74062e-06],[5,-5,0,0,-3.25298e-06,-1.79492e-07],[2,-2,-2,0,-2.96491e-06,1.78378e-06]]],B:[[0.0008478284288,5.534427993e-06,7.216066946e-09],[[0,1,0,0,-0.0173073,-0.0396689],[0,1,0,1,0.000340203,-0.000202157],[0,2,0,0,-0.00211269,0.00103494],[0,2,0,1,-1.67827e-05,-3.21058e-05],[0,3,0,0,6.75249e-05,0.000125341],[0,3,0,1,-3.69536e-06,5.89291e-07],[1,-3,0,0,3.89198e-06,-5.33104e-05],[1,-1,0,0,3.01916e-05,4.0329e-05],[1,-3,-1,0,-5.76738e-06,1.40111e-05],[1,0,0,0,9.1259e-06,2.06535e-06],[1,-1,-1,0,-4.20948e-06,-9.55634e-06],[0,4,0,0,7.4407e-06,-6.061e-06],[3,-9,-1,0,7.24461e-06,9.46627e-06],[3,-7,0,0,8.36519e-06,-5.44198e-06],[3,-9,0,0,-3.21569e-06,-4.34078e-06],[1,-1,-2,0,-1.46689e-06,-4.72317e-06],[2,-6,2,0,-1.65047e-06,-2.92713e-06]]],R:[[9.55392616,-0.0001666353761,0.0008100918414],[[0,1,0,0,-0.518082,0.0220657],[0,1,0,1,0.000730807,-0.00219702],[0,2,0,0,0.00199538,0.0145177],[0,2,0,1,8.98507e-05,-0.000594463],[1,-1,0,0,0.000572755,0.00805688],[1,-1,0,1,3.36327e-05,4.58632e-05],[1,-2,0,0,0.00151774,0.00523358],[1,-2,0,1,4.0217e-05,0.000546952],[2,-2,0,0,-0.000499299,0.00147488],[2,-2,0,1,-7.72907e-06,-0.000370525],[3,-8,-1,0,0.00272076,0.00212138],[3,-8,-1,1,0.00132373,-0.00171361],[3,-3,0,0,-2.27708e-06,0.000323418],[3,-3,0,1,2.86375e-06,-9.08491e-07],[0,2,-2,0,1.15011e-05,-0.000342574],[0,2,-2,1,-7.38969e-05,-8.31814e-05],[3,-5,0,0,0.000206498,5.79878e-05],[3,-5,0,1,-0.000101543,5.19714e-05],[3,-4,0,0,-0.000161388,-0.000107226],[3,-4,0,1,8.35593e-07,-5.34411e-06],[2,-4,-1,0,0.00015348,-0.000132319],[2,-4,-1,1,7.79751e-05,-0.000224055],[2,-1,0,0,4.51871e-05,0.000123057],[4,-4,0,0,-1.16163e-06,9.63346e-05],[1,-4,-1,0,-8.03092e-05,-4.63891e-06],[0,2,-1,0,8.42991e-05,-2.84089e-05],[3,-4,-1,0,-8.44487e-05,-5.87471e-06],[1,-4,1,0,5.44464e-05,8.13508e-05],[4,-5,0,0,-4.35352e-05,-3.40528e-05],[0,1,-2,0,5.72104e-05,-1.5808e-05],[2,-6,-2,0,4.09179e-05,6.98006e-06],[1,0,1,0,-3.50691e-05,-1.92505e-06],[5,-5,0,0,9.54439e-08,3.40927e-05],[1,-6,1,0,-3.79597e-05,-2.63404e-06],[1,0,-1,0,3.75072e-05,-2.50639e-06],[5,-6,0,0,-2.15553e-05,-1.53226e-05],[2,-7,-2,0,1.81738e-05,-2.45547e-06],[2,-8,2,0,-1.47668e-05,-1.73728e-05],[1,-4,-2,0,1.29132e-05,1.31854e-05],[3,-2,0,0,1.98869e-06,1.26673e-05],[2,-2,-1,0,-1.16796e-05,-1.22339e-05],[2,-9,0,0,-1.39652e-05,1.58029e-05],[6,-6,0,0,-5.89101e-07,1.21288e-05],[3,-8,1,0,-5.72102e-06,-1.09698e-05],[1,-10,-1,0,-8.86795e-06,2.17789e-06],[4,-3,0,0,-3.48142e-06,8.1307e-06],[1,-6,-1,0,-4.53867e-06,-1.07942e-05],[4,-7,1,0,1.13132e-05,-5.08133e-07],[4,-6,-1,0,7.68062e-06,6.71074e-06],[2,-10,-1,0,5.51292e-06,4.80526e-06],[5,-4,0,0,-1.46393e-06,4.60057e-06],[0,10,1,0,-1.2984e-06,-4.4564e-06],[1,2,-1,0,4.09416e-06,4.82767e-06],[2,-9,1,0,-5.65317e-06,4.36096e-06],[1,2,-2,0,2.54637e-06,6.66269e-06],[1,-7,-1,0,5.59061e-06,1.91283e-06]]]}};
  /* PLANET-FIT end */
  /* Jupiter's or Saturn's heliocentric place (au, ecliptic and equinox of J2000) from its series at T centuries of TT (TDB) from J2000 */
  function pfit(k,T){const q=PF[k],lj=PFL.J[0]+PFL.J[1]*T,ls=PFL.S[0]+PFL.S[1]*T,lu=PFL.U[0]+PFL.U[1]*T,
      ev=([P,S])=>{let v=0,tp=1;for(const x of P){v+=x*tp;tp*=T;}for(const[k1,k2,k3,w,a,b]of S){const g=k1*lj+k2*ls+k3*lu,f=w?T:1;v+=f*(a*Math.sin(g)+b*Math.cos(g));}return v;},
      L=ev(q.L),B=ev(q.B),R=ev(q.R);return[R*Math.cos(B)*Math.cos(L),R*Math.cos(B)*Math.sin(L),R*Math.sin(B)];}
  /* the heliocentric place (au, ecliptic and equinox of J2000) of a body of KEP at T centuries of TT from J2000 */
  function kep(k,T){const q=KEP[k],a=q[0]+q[6]*T,e=q[1]+q[7]*T,I=q[2]+q[8]*T,Lm=q[3]+q[9]*T,w=q[4]+q[10]*T,O=q[5]+q[11]*T,om=w-O;let M=n180(Lm-w),E=M+e/D*s(M);
    for(let i=0;i<20;i++){const dE=(M-(E-e/D*s(E)))/(1-e*c(E));E+=dE;if(Math.abs(dE)<1e-10)break;}
    const xp=a*(c(E)-e),yp=a*Math.sqrt(1-e*e)*s(E);
    return[(c(om)*c(O)-s(om)*s(O)*c(I))*xp+(-s(om)*c(O)-c(om)*s(O)*c(I))*yp,(c(om)*s(O)+s(om)*c(O)*c(I))*xp+(-s(om)*s(O)+c(om)*c(O)*c(I))*yp,s(om)*s(I)*xp+c(om)*s(I)*yp];}
  /* a place of J2000 (α0, δ0, °) carried to the apparent place of date at the Julian day of TT jde: precession (Meeus 21), nutation (23.1), annual aberration (23.3) */
  function app(a,d,jde){const T=(jde-2451545)/36525,z1=(2306.2181*T+0.30188*T*T+0.017998*T**3)*AS,z2=(2306.2181*T+1.09468*T*T+0.018203*T**3)*AS,th=(2004.3109*T-0.42665*T*T-0.041833*T**3)*AS,
      A=c(d)*s(a+z1),B=c(th)*c(d)*c(a+z1)-s(th)*s(d),C=s(th)*c(d)*c(a+z1)+c(th)*s(d);
    a=n360(at2(A,B)+z2);d=Math.abs(C)>0.99?Math.sign(C)*ac(Math.hypot(A,B)):as(C);
    const N=nut(T),e=N.eps,L=sunGeo(jde).l,k=20.49552*AS,ec=0.016708634-0.000042037*T-0.0000001267*T*T,pi=102.93735+1.71946*T+0.00046*T*T,
      da=(c(e)+s(e)*s(a)*tn(d))*N.dpsi-c(a)*tn(d)*N.deps+(-k*(c(a)*c(L)*c(e)+s(a)*s(L))+ec*k*(c(a)*c(pi)*c(e)+s(a)*s(pi)))/c(d),
      dd=s(e)*c(a)*N.dpsi+s(a)*N.deps-k*(c(L)*c(e)*(tn(e)*c(d)-s(a)*s(d))+c(a)*s(d)*s(L))+ec*k*(c(pi)*c(e)*(tn(e)*c(d)-s(a)*s(d))+c(a)*s(d)*s(pi));
    return{ra:n360(a+da),dec:d+dd,N};}
  /* the semi-diameters at 1 au (″): Venus and Mars as KEP's, Jupiter's and Saturn's equatorial (Meeus, Astronomical Algorithms, Ch. 55; Saturn's globe, not its rings) */
  const SD1={Venus:8.34,Mars:4.68,Jupiter:98.44,Saturn:82.73},PLANETS=['Venus','Mars','Jupiter','Saturn'];
  /** @returns {Body & {au:number}} Venus, Mars, Jupiter or Saturn at t: its apparent place, distance (au), semi-diameter and horizontal parallax (′) */
  function planet(k,t){const j=JD(t),jde=TT(j),T=(jde-2451545)/36525,emb=kep('EMB',T),m=moon(t),e0=23.4392911,
      ml=m.lon-nut(T).dpsi,mx=m.km/149597870.7*c(m.lat)*c(ml),my=m.km/149597870.7*c(m.lat)*s(ml),mz=m.km/149597870.7*s(m.lat),pr=(2306.2181*T)*AS,   /* the Moon to J2000's equinox, near enough for its 1/82.3 */
      ex=emb[0]-(mx*c(pr)+my*s(pr))/82.3,ey=emb[1]-(my*c(pr)-mx*s(pr))/82.3,ez=emb[2]-mz/82.3;
    let tau=0,g=[0,0,0],r=0;for(let i=0;i<3;i++){const p=KEP[k]?kep(k,T-tau/36525):pfit(k,T-tau/36525);g=[p[0]-ex,p[1]-ey,p[2]-ez];r=Math.hypot(...g);tau=r*0.0057755183;}   /* light-time: days for an au */
    const xq=g[0],yq=g[1]*c(e0)-g[2]*s(e0),zq=g[1]*s(e0)+g[2]*c(e0),P=app(n360(at2(yq,xq)),as(zq/r),jde);
    return{name:k,ra:P.ra,dec:P.dec,gha:n360(gmst(j)+P.N.dpsi*c(P.N.eps)-P.ra),au:r,sd:SD1[k]/r/60,hp:8.794/r/60};}
  const starIx=k=>STARS.findIndex(r=>r[1]===k||r[0]===k);
  /** a body by name: 'Sun', 'Moon', 'Venus', 'Mars', 'Jupiter', 'Saturn', a star's name or its almanac number */
  function body(k,t){if(k==='Sun')return sun(t);if(k==='Moon')return moon(t);if(PLANETS.includes(k))return planet(k,t);const i=starIx(k);if(i<0)throw Error('no such body: '+k);return star(i,t);}
  /** Maskelyne's lunar-distance stars (the Nautical Almanac from 1767): those near the Moon's path, with the Sun */
  const LUNAR=['Sun','Hamal','Aldebaran','Pollux','Regulus','Spica','Antares','Altair','Fomalhaut','Markab'];

  /* ---------- angles on the sphere, and the observer ---------- */
  const sep=(a1,d1,a2,d2)=>2*as(Math.sqrt(s((d2-d1)/2)**2+c(d1)*c(d2)*s((a2-a1)/2)**2));   /* haversine: good at any distance */
  /** the geocentric distance between the Moon's centre and body k's at t (°): what the almanac's lunar tables gave */
  function lunar(k,t){const m=moon(t),b=body(k,t);return sep(m.ra,m.dec,b.ra,b.dec);}
  /** the altitude and true azimuth (°) of a place of declination dec at local hour angle lha from latitude lat: the navigational triangle */
  function hcz(lat,dec,lha){return{hc:as(s(lat)*s(dec)+c(lat)*c(dec)*c(lha)),zn:n360(at2(-c(dec)*s(lha),s(dec)*c(lat)-c(dec)*s(lat)*c(lha)))};}
  /** body b seen from (lat, lon east +, h metres above the sea) on the Earth's spheroid (Meeus 11 and 40.6): topocentric altitude and azimuth, airless (°),
      and its semi-diameter from there (′, the Moon's augmented) */
  function topo(b,lat,lon,h=0){const u=at2(0.99664719*s(lat),c(lat)),ps=0.99664719*s(u)+h/6378140*s(lat),pc=c(u)+h/6378140*c(lat),sp=s(b.hp/60),H=n360(b.gha+lon),
      A=c(b.dec)*s(H),B=c(b.dec)*c(H)-pc*sp,C=s(b.dec)-ps*sp,q=Math.hypot(A,B,C),H2=at2(A,B),d2=as(C/q),r=hcz(lat,d2,H2);
    return{alt:r.hc,az:r.zn,sd:b.hp?as(s(b.sd/60)/q)*60:b.sd};}
  /** refraction (′) at apparent altitude ha (°), temperature T (°C), pressure P (hPa): Bennett's formula (Meeus 16.4), the Nautical Almanac's own basis */
  const refr=(ha,T=10,P=1010)=>ha<-2?0:1/tn(ha+7.31/(ha+4.4))*(P/1010)*(283/(273+T));
  /** the apparent altitude whose refraction brings it down to the airless altitude h: refraction run backwards */
  function unrefr(h,T,P){let ha=h;for(let k=0;k<20;k++){const nx=h+refr(ha,T,P)/60;if(Math.abs(nx-ha)<1e-9)return nx;ha=nx;}return ha;}
  const dip=eye=>eye>0?1.76*Math.sqrt(eye):0;   /* the dip of the sea horizon (′) from an eye eye metres up */

  /** a sextant altitude hs (°) of body b's limb reduced to the geocentric altitude of its centre, Ho, with every step (′ unless °):
      o: ic the index correction (′, added to the reading), eye (m), limb 'L' lower | 'U' upper | 'C' centre (a star), T (°C), P (hPa), lat (the Moon's
      parallax reduced for the Earth's figure there). ha apparent altitude; R refraction; sd the semi-diameter (augmented for the Moon); pa parallax in altitude */
  function correct(hs,b,o){const ic=o.ic||0,dp=dip(o.eye||0),ha=hs+(ic-dp)/60,R=refr(ha,o.T,o.P),hp=(b.hp||0)*(1-(s(o.lat||0)**2)/298.257),
      sd0=b.sd||0,sd=b.name==='Moon'?sd0*(1+s(hp/60)*s(ha)):sd0,sdc=o.limb==='L'?sd:o.limb==='U'?-sd:0,h1=ha-R/60+sdc/60,pa=as(s(hp/60)*c(h1))*60;
    return{hs,ic,dip:dp,ha,R,sd:sdc,pa,ho:h1+pa/60};}
  /** the intercept (′, + toward) and azimuth of a body of Greenwich hour angle gha and declination dec observed at Ho from the assumed (lat, lon) */
  function intercept(lat,lon,gha,dec,ho){const lha=n360(gha+lon),r=hcz(lat,dec,lha);return{lha,hc:r.hc,zn:r.zn,a:(ho-r.hc)*60};}
  /** the time sight (longitude by chronometer): at latitude lat, a body of declination dec and Greenwich hour angle gha at altitude ho, east or west of the
      meridian, gives the local hour angle and so the longitude (east +). t: the meridian angle */
  function timeSight(lat,dec,ho,gha,east){const ct=(s(ho)-s(lat)*s(dec))/(c(lat)*c(dec));if(Math.abs(ct)>1)return null;const t=ac(ct),lha=east?360-t:t;return{t,lha,lon:n180(lha-gha)};}
  /** a fix from several sights, ss [{gha, dec, ho}], by least squares of their intercepts from (lat0, lon0), repeated from each new place */
  function fix(ss,lat0,lon0){let la=lat0,lo=lon0;
    for(let k=0;k<12;k++){let xx=0,xy=0,yy=0,xa=0,ya=0;for(const o of ss){const r=intercept(la,lo,o.gha,o.dec,o.ho),x=s(r.zn),y=c(r.zn);xx+=x*x;xy+=x*y;yy+=y*y;xa+=x*r.a;ya+=y*r.a;}
      const det=xx*yy-xy*xy;if(Math.abs(det)<1e-9)break;const de=(yy*xa-xy*ya)/det,dn=(xx*ya-xy*xa)/det;la+=dn/60;lo+=de/60/c(la);if(Math.hypot(de,dn)<1e-4)break;}
    return{lat:la,lon:n180(lo)};}

  /** latitude from a meridian altitude (the noon sight): ho the observed altitude as the body crosses the meridian, highest, dec its declination; south: it
      bears south. The zenith distance 90° − ho, added to the declination for a body to the south, taken from it for one to the north */
  const meridianLat=(ho,dec,south)=>south?dec+90-ho:dec-90+ho;
  /** latitude from a star's altitude at any time, the pole star's above all (within a degree of the pole, its altitude is the latitude to within that
      degree): the triangle solved for the latitude that gives altitude ho at local hour angle lha (Greenwich hour angle + the DR longitude), from lat0 */
  function latByAlt(ho,dec,lha,lat0=ho){let la=lat0;for(let k=0;k<40;k++){const h=hcz(la,dec,lha).hc,g=(hcz(la+1e-4,dec,lha).hc-h)/1e-4;if(!g)break;const d=(ho-h)/g;la+=d;if(Math.abs(d)<1e-10)break;}return la;}
  /** the daily rate (s a day, + gaining) from two errors of the chronometer, e1 at t1 and e2 at t2 (s, + fast), and its error carried to t by that rate */
  function rate(t1,e1,t2,e2){const r=(e2-e1)/((t2-t1)/864e5);return{r,at:t=>e2+r*(t-t2)/864e5};}

  /* ---------- Greenwich time from the sky ---------- */
  /** the GMT (ms) of local apparent noon at longitude lon (east +), nearest t */
  function noon(lon,t){for(let k=0;k<8;k++){const dt=-n180(sun(t).gha+lon)/15*3.6e6;t+=dt;if(Math.abs(dt)<1)break;}return t;}
  /** equal altitudes of the Sun at a place of known latitude and longitude: c1 (morning) and c2 (afternoon) are the chronometer's readings (ms, read as GMT) at
      the same altitude. E: the chronometer's error (s, + fast) that makes the Sun's altitude the same at both; E0 the old rule's (the middle of the readings
      taken as noon), and the equation of equal altitudes E − E0, for the declination's change between them. Refraction, dip, the sextant's index error and
      the latitude's own error all cancel, which is why it was the standard way to rate a chronometer ashore. */
  function equalAlt(lat,lon,c1,c2){const h=t=>{const S=sun(t);return hcz(lat,S.dec,n360(S.gha+lon)).hc;},f=E=>h(c1-E*1000)-h(c2-E*1000);let E=0;
    for(let k=0;k<20;k++){const f0=f(E),d=f(E+1)-f0;if(!d)break;const dE=-f0/d;E+=dE;if(Math.abs(dE)<1e-5)break;}
    const mid=(c1+c2)/2,ln=noon(lon,mid-E*1000),E0=(mid-ln)/1000;return{E,E0,eqn:E-E0,noon:ln,mid};}
  /** a lunar distance cleared, and the Greenwich time it gives. ds: the sextant's distance (°) from the Moon's near limb to the body's near limb (the Sun) or
      centre (a star) (o.far: the Moon's far limb, for a star); hm, hb: their altitudes as the sextant reads them, to the limbs o.limbM and o.limbB; k the body;
      t0 the chronometer's estimate of GMT (ms); o: ic, eye, T, P, lat as in correct(), and dr {lat, lon}, the place by dead reckoning. Each altitude is
      corrected as a sight is; the distance takes the index correction and the semi-diameters (the Moon's augmented). Then the exact clearing: the azimuths'
      difference from the apparent altitudes and distance, and with it the true distance from the true altitudes. That treats the Earth as a sphere, which
      leaves up to 0.2′; with a place by dead reckoning the almanac clears a sight it makes there and then and takes what is left off (fig: under 0.02′ for a
      place 30′ out). The GMT is when the almanac's geocentric distance is the cleared one. rate: how fast the distance changes (′ an hour): under about 15′ an
      hour a tenth of a minute of arc is more than 20 seconds of time, and the navigator picks another body. Refraction's flattening of the discs (under 0.3′
      above 10°, and much the same in a sight the almanac makes) is left out. */
  function clr(ds,hm,hb,k,t,o){const M=moon(t),B=body(k,t),cm=correct(hm,M,{...o,limb:o.limbM||'L'}),cb=correct(hb,B,{...o,limb:k==='Sun'?(o.limbB||'L'):'C'}),
      am=cm.ha+cm.sd/60,ab=cb.ha+cb.sd/60,sdm=M.sd*(1+s(M.hp/60)*s(cm.ha)),sdb=k==='Sun'?B.sd:0,
      d=ds+(o.ic||0)/60+((o.far?-1:1)*sdm+sdb)/60,cz=(c(d)-s(am)*s(ab))/(c(am)*c(ab));
    return{moon:cm,body:cb,am,ab,d,dz:ac(cz),D:ac(s(cm.ho)*s(cb.ho)+c(cm.ho)*c(cb.ho)*cz)};}
  function clear(ds,hm,hb,k,t0,o){let t=t0,r=null;
    for(let pass=0;pass<3;pass++){r=clr(ds,hm,hb,k,t,o);let fig=0;
      if(o.dr){const S=sextantLunar(k,t,o.dr.lat,o.dr.lon,o);fig=lunar(k,t)-clr(S.ds,S.hm,S.hb,k,t,{...o,lat:o.dr.lat}).D;}
      const Dt=r.D+fig;let tt=t;for(let i=0;i<30;i++){const L0=lunar(k,tt),rt=(lunar(k,tt+6e5)-L0)/6e5,dt=(Dt-L0)/rt;tt+=dt;if(Math.abs(dt)<5)break;}
      r={...r,fig:fig*60,Dc:Dt,gmt:tt,err:(t0-tt)/1000,rate:(lunar(k,tt+36e5)-lunar(k,tt))*60};t=tt;}
    return r;}

  /* ---------- what a sextant would read: the sights the essay's examples reduce, made from the almanac at a known time and place ---------- */
  /** the sextant's altitude (°) of body k's limb ('L', 'U' or 'C') at GMT t from (lat, lon), eye metres up, with refraction (T, P) and an index correction ic (′) */
  function sextant(k,t,lat,lon,o){const B=body(k,t),p=topo(B,lat,lon),sdc=o.limb==='L'?-p.sd:o.limb==='U'?p.sd:0;return unrefr(p.alt+sdc/60,o.T,o.P)+(dip(o.eye||0)-(o.ic||0))/60;}
  /** a lunar distance as the sextant would read it at GMT t from (lat, lon): from the Moon's near limb to the body's near limb or centre, and the two altitudes */
  function sextantLunar(k,t,lat,lon,o){const M=moon(t),B=body(k,t),pm=topo(M,lat,lon),pb=topo(B,lat,lon),am=unrefr(pm.alt,o.T,o.P),ab=unrefr(pb.alt,o.T,o.P),
      d=ac(s(am)*s(ab)+c(am)*c(ab)*c(pm.az-pb.az))-((o.far?-1:1)*pm.sd+(k==='Sun'?pb.sd:0))/60-(o.ic||0)/60;
    return{ds:d,hm:sextant('Moon',t,lat,lon,{...o,limb:o.limbM||'L'}),hb:sextant(k,t,lat,lon,{...o,limb:k==='Sun'?(o.limbB||'L'):'C'})};}

  /* ---------- formatting, as the almanac prints: degrees and minutes to a tenth, N/S ---------- */
  const dm=(a,neg='−')=>{const g=a<0?neg:'',x=Math.abs(a),d=Math.floor(x),m=(x-d)*60;let mm=Math.round(m*10)/10,dd=d;if(mm>=60){mm-=60;dd++;}return`${g}${dd}°${mm.toFixed(1).padStart(4,'0')}′`;},
    lat=a=>dm(Math.abs(a))+(a<0?' S':' N'),lon=a=>dm(Math.abs(a))+(a<0?' W':' E'),hms=t=>new Date(t).toISOString().slice(11,19);
  return{JD,MS,deltaT,setDeltaT:v=>{dTfix=v;},gmst:j=>gmst(j),gast,sun,sunHand,moon,planet,PLANETS,star,body,STARS,LUNAR,lunar,sep,hcz,topo,refr,unrefr,dip,correct,intercept,timeSight,fix,meridianLat,latByAlt,rate,
    noon,equalAlt,clear,sextant,sextantLunar,n180,n360,fmt:{dm,lat,lon,hms}};
})();
if(typeof module!=='undefined')module.exports={ALM};
