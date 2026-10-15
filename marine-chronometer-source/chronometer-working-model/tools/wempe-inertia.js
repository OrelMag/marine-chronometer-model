/* wempe-inertia.js: run in the Wempe's page by wempe_inertia.py (?snap&qa). The escapement's moving bodies weighed on their drawn solids, each about its own axis: the
   balance (rim, arm, masses, timing screws and weights, staff, hub and its screws), the rollers with their stones, the hairspring's collet and pin, the hairspring itself,
   the detent's moving part (blade, square, pipe, stone, horn, the gold spring and its screw, the spring's free half) about its flexure, the escape arbor (wheel, pinion,
   arbor, collet), the seconds arbor and the seconds hand. Every closed solid is integrated as tetrahedra from its group's origin (volume, first and second moments; signed,
   so a hole counts out) at its material's density, in the turning group's own frame (y its axis). Densities, g/cm³ = mg/mm³: brass (Ms 58, Ms 63) 8.45; steel 7.85; the
   rim's inner layer, nickel steel ("Nickelstahl Sonderlegierung", 05 03 01-1: a 36-45 % nickel compensation steel) 8.1 (estimated); the impulse roller beryllium copper
   ("Kupfer Beryllium", 02 04 02) 8.25; sapphire and ruby 3.98; the gold spring, 333 gold (8 ct, its alloy not given) about 11.0 (estimated: 33 % gold with silver and copper);
   the gilt wheels brass. Returns JSON: mg, mm, mg·mm² (the caller makes g and g·mm²). */
(()=>{const mv=window.__mv,R=mv.userData.R,E=R.esc,M=window.__M,KEY=new Map(Object.entries(M).map(([k,v])=>[v,k]));
  const RHO={brass:8.45,brass2:8.45,gilt:8.45,plate:8.45,plateSolid:8.45,copper:8.45,steel:7.85,steelD:7.85,steelS:7.85,blued:7.85,steelK:7.85,mspring:7.85,ruby:3.98,clear:3.98};
  const BYHN={'050301-1':{steel:8.1},'050403-1':{copper:8.25},'050401-2':{gilt:11.0}};   /* by the parts list's line where the material's colour isn't the metal: the rim's steel, the impulse roller, the gold spring */
  const hnOf=o=>{for(let p=o;p;p=p.parent)if(p.userData.hn)return String(p.userData.hn).split(' ')[0];return'';};
  mv.updateMatrixWorld(true);const A=new THREE.Vector3(),B=new THREE.Vector3(),C=new THREE.Vector3();
  /* the body of the turning group g, about its own y axis: its meshes (or only those keep(o) passes) */
  const weigh=(g,keep=()=>true)=>{const inv=new THREE.Matrix4().copy(g.matrixWorld).invert(),b={m:0,s:[0,0,0],Iy:0,byHn:{},missing:{}};
    g.traverse(o=>{if(!o.isMesh||!o.geometry.attributes.position||o.userData.decal||o.userData.surface||!keep(o))return;
      const mat=o.userData.mat0||o.material,key=KEY.get(mat)||'?',h=hnOf(o),rho=(BYHN[h]&&BYHN[h][key])??RHO[key];if(rho==null){b.missing[key+' '+h]=(b.missing[key+' '+h]||0)+1;return;}
      const T=inv.clone().multiply(o.matrixWorld),P=o.geometry.attributes.position,I=o.geometry.index,n=I?I.count:P.count;let m=0,Iy=0;const s=[0,0,0];
      for(let k=0;k+2<n;k+=3){A.fromBufferAttribute(P,I?I.getX(k):k).applyMatrix4(T);B.fromBufferAttribute(P,I?I.getX(k+1):k+1).applyMatrix4(T);C.fromBufferAttribute(P,I?I.getX(k+2):k+2).applyMatrix4(T);
        const v=A.dot(B.clone().cross(C))/6,a=[A.x,A.y,A.z],bb=[B.x,B.y,B.z],c=[C.x,C.y,C.z],q=[a[0]+bb[0]+c[0],a[1]+bb[1]+c[1],a[2]+bb[2]+c[2]];m+=v;for(let i=0;i<3;i++)s[i]+=v*q[i]/4;
        for(const i of[0,2])Iy+=v/20*(a[i]*a[i]+bb[i]*bb[i]+c[i]*c[i]+q[i]*q[i]);}
      b.m+=rho*m;b.Iy+=rho*Iy;for(let i=0;i<3;i++)b.s[i]+=rho*s[i];const e=b.byHn[h||'?']||(b.byHn[h||'?']={m:0,I:0});e.m+=rho*m;e.I+=rho*Iy;});
    return{m:b.m,cg:b.s.map(x=>x/b.m),I:b.Iy,byHn:b.byHn,missing:b.missing};};
  const sp=E.spring;
  return JSON.stringify({balance:weigh(E.bal),rollers:weigh(E.rol),collet:weigh(E.hsRot),spring:weigh(sp.parent,o=>o===sp),detent:weigh(E.det),escape:weigh(E.ew),
    seconds:weigh(R.tr.sw),secondsHand:weigh(R.dl.sh)});})()
