/* drawbook-export.js: run in the model's page (?snap&qa) by drawbook.py export. DB.list() gives the build book's parts in its order (maker.js's book(): each part,
   or for an assembly the part then its pieces, a piece marked nb or not shown in this version left out); DB.part(k) gives one part's solids in the movement's frame
   (mm; x toward 3 o'clock, y the arbors' axis toward the dial side, z toward 6), as base64 Float32 positions and Uint32 indices, mesh by mesh with its material,
   its parts-list line and what the model knows of it (a wheel's teeth, a screw's sizes); DB.show(k) shows that part alone for its render, DB.look() frames it */
window.DB=(()=>{const V=window.__V,mv=window.__mv,W=window.__W?window.__W():{};let sc=mv;while(sc.parent)sc=sc.parent;
  const rev=W.rev||'last',shows=o=>{for(let q=o;q;q=q.parent)if(q.userData.rev&&mv.userData.revShows&&!mv.userData.revShows(q.userData.rev,rev))return false;return true;};
  const all=()=>{const a=[];sc.traverse(o=>{if(o.isMesh&&o.userData.part)a.push(o);});return a;};
  const meshesOf=p=>all().filter(o=>(p.includes('.')?o.userData.pk===p:o.userData.part===p)&&!o.userData.decal&&!o.userData.surface&&!o.userData.devPlate&&o.geometry&&o.geometry.attributes.position);
  let matName=null;const nameOf=m=>{if(!matName){matName=new Map();for(const[k,v]of Object.entries(V.M))if(v&&v.isMaterial)matName.set(v,k);}return matName.get(m)||'';};
  function list(){const PCE=V.PCE||{},out=[];
    for(const p of Object.keys(V.INFO)){if(p.includes('.'))continue;const ms=meshesOf(p);if(!ms.length||!ms.some(shows))continue;
      const pcs=((V.PARTS[p]||{}).pcs||[]).map(c=>p+'.'+c.k).filter(k=>PCE[k]&&!PCE[k].nb&&meshesOf(k).length&&meshesOf(k).some(shows));
      out.push({k:p,asm:pcs.length>0,pcs,parent:null});for(const k of pcs)out.push({k,asm:false,pcs:[],parent:p});}
    return out.map(e=>({...e,title:(V.INFO[e.k]||[e.k])[0],desc:(V.INFO[e.k]||['',''])[1]}));}
  const b64=a=>{const u=new Uint8Array(a.buffer,a.byteOffset,a.byteLength);let s='';for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s);};
  const hnOf=o=>{for(let q=o;q&&q!==mv;q=q.parent)if(q.userData.hn)return q.userData.hn;return null;};
  function part(k){mv.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert(),out=[];
    for(const o of meshesOf(k)){if(!shows(o))continue;const g=o.geometry,P=g.attributes.position,base=inv.clone().multiply(o.matrixWorld),mats=[];
      if(o.isInstancedMesh){const im=new THREE.Matrix4();for(let i=0;i<o.count;i++){o.getMatrixAt(i,im);mats.push(base.clone().multiply(im));}}else mats.push(base);
      const n=P.count,I=g.index?g.index.array:null,v=new THREE.Vector3();
      for(const m of mats){const pos=new Float32Array(n*3);for(let i=0;i<n;i++){v.fromBufferAttribute(P,i).applyMatrix4(m);pos[3*i]=v.x;pos[3*i+1]=v.y;pos[3*i+2]=v.z;}
        let idx=I?Uint32Array.from(I):Uint32Array.from({length:n},(_,i)=>i);if(m.determinant()<0)for(let t=0;t<idx.length;t+=3){const q=idx[t+1];idx[t+1]=idx[t+2];idx[t+2]=q;}
        const sc0=o.parent&&o.parent.userData.sc,gear=o.userData.gear||(o.parent&&o.parent.userData.gear);
        out.push({mat:nameOf(o.userData.mat0||o.material),hn:hnOf(o),pos:b64(pos),idx:b64(idx),gear:gear?JSON.parse(JSON.stringify(gear,(kk,vv)=>typeof vv==='object'&&vv&&vv.isObject3D?undefined:vv)):null,
          screw:sc0?{r:sc0.r,rs:sc0.rs,len:sc0.len,h:sc0.h}:null});}}
    return out;}
  /* the part alone: every other mesh hidden (the merged copies too: the page is opened with merge=0), the floor and labels gone */
  let saved=null;function show(k){if(!saved){saved=new Map();sc.traverse(o=>{if(o.isMesh||o.isLine||o.isLineSegments||o.isSprite)saved.set(o,o.visible);});}
    const keep=new Set(meshesOf(k).filter(shows));for(const[o]of saved){let on=keep.has(o);if(!on&&(o.isLine||o.isLineSegments)&&o.parent&&keep.has(o.parent))on=true;o.visible=on;}
    for(const o of keep)for(let q=o.parent;q;q=q.parent)q.visible=true;
    const b=new THREE.Box3();for(const o of keep)b.expandByObject(o);b.applyMatrix4(new THREE.Matrix4().copy(mv.matrixWorld).invert());const c=b.getCenter(new THREE.Vector3()),s=b.getSize(new THREE.Vector3());
    return[c.x,c.y,c.z,s.x,s.y,s.z];}
  /* the movement's middle along its arbors: a flat part on the train side of it is drawn seen from the train side (from outside the movement) */
  function mid(){const b=new THREE.Box3();mv.updateMatrixWorld(true);for(const o of all())if(!o.userData.devPlate&&o.visible!==false){let ins=false;for(let q=o;q;q=q.parent)if(q===mv)ins=true;if(ins)b.expandByObject(o);}
    b.applyMatrix4(new THREE.Matrix4().copy(mv.matrixWorld).invert());return(b.min.y+b.max.y)/2;}
  return{list,part,show,mid};})();
