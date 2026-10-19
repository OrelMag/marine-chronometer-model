// motion3d-page.js: run in the page by motion3d.py (?snap&qa, #drive=1 so the mainspring and hairspring are built). Declares only window.__m3d.
// The page's own mechanism measured: every mesh shown, its geometry and its place in the movement's frame at a base state; then each of update()'s inputs nudged on
// its own (the escape wheel's place E, the balance's angle th, the detent's lift and the gold spring's bend psDef, the fusee's turns n, the maintaining spring's lead ms,
// winding), and each mesh's move fitted as a turn about a fixed axis (its axis, a point on it, the angle per unit of the input) or marked as moved some other way (a
// translation, a reshaped geometry); the inputs that move parts nonlinearly (n, th, lift, psDef) are also sampled over their range, every mesh's matrix kept.
(()=>{
  const mv=window.__mv;if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
  const BASE={E:1000,th:0,lift:0,psDef:0,n:4,winding:false,ms:undefined,springOn:true,msOn:true,arm:0,blk:0,slip:0};
  let root=mv;while(root.parent)root=root.parent;
  const set=s=>{const q={...BASE,...s};if(q.ms===undefined)delete q.ms;mv.userData._u(q);root.updateMatrixWorld(true);};
  const shown=o=>{for(let p=o;p;p=p.parent)if(!p.visible)return false;return true;};
  const partOf=o=>{for(let p=o;p;p=p.parent)if(p.userData&&p.userData.partName)return p.userData.partName;return '?';};
  const inv=()=>new THREE.Matrix4().copy(mv.matrixWorld).invert();
  let MESH=null;
  const list=()=>{const a=[];mv.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.attributes&&o.geometry.attributes.position&&shown(o))a.push(o);});return a;};
  const mat=(o,I)=>new THREE.Matrix4().multiplyMatrices(I,o.matrixWorld).toArray();
  /* a geometry's fingerprint: its vertex count and a sum over its positions (a rebuilt or morphed geometry changes it) */
  const fp=o=>{const g=o.geometry,p=g.attributes.position.array;let s=0;for(let i=0;i<p.length;i+=7)s+=p[i]*(1+(i%13));return g.attributes.position.count+':'+s.toFixed(5);};
  window.__m3d={
    base(){set({});MESH=list();const I=inv();return MESH.map((o,i)=>({id:i,part:partOf(o),pk:o.userData.pk||null,hn:o.userData.hn||null,name:o.name||null,mat:mat(o,I),nv:o.geometry.attributes.position.count,
      ni:o.geometry.index?o.geometry.index.count:0,fp:fp(o),mat0:o.material&&o.material.color?o.material.color.getHexString():null,metal:o.material?o.material.metalness:null}));},
    geom(i){const o=MESH[i],g=o.geometry;return{p:Array.from(g.attributes.position.array),ix:g.index?Array.from(g.index.array):null};},
    /* every mesh's matrix (movement frame) and fingerprint at a state */
    at(s){set(s);const I=inv();return MESH.map(o=>({m:mat(o,I),fp:fp(o)}));},
    /* the geometry of some meshes at a state (the reshaped ones: hairspring, mainspring, gold spring) */
    geomAt(s,ids){set(s);return ids.map(i=>{const g=MESH[i].geometry;return{p:Array.from(g.attributes.position.array)};});},
    reset(){set({});}
  };
})();
