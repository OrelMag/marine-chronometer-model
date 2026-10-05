// @ts-check
/* GLTF: a binary glTF 2.0 (.glb) writer, for the export to Blender (blender.js). Generic: nodes, meshes, materials, textures and animations, nothing of the chronometer.
   GLTF.write(doc) resolves to a Blob. doc:
     nodes [{name, t:[x,y,z], r:[x,y,z,w], s:[x,y,z], mesh, children:[i], extras}], roots [i], extras (the asset's), generator
     meshes [{name, prims:[{pos, nrm, uv, idx, mat, targets:[{pos, nrm}]}], weights, targetNames}]: Float32Arrays (idx any integer array); targets are offsets from pos
     materials [{name, color:[r,g,b,a] (linear), metal, rough, emissive:[r,g,b], map, nmap, nscale, xf:{o:[u,v], s:[u,v], r}, blend, double, trans, ior}]: map, nmap texture indices
     textures [{img: a canvas, flip: drawn upside down (three's flipY, so the UVs go as they are), green: the normal map's green turned over with it, repeat}]
     animations [{name, channels:[{node, path: translation | rotation | scale | weights, times, values, interp: LINEAR | STEP}]}]: channels sharing a times array share its accessor
   GLTF.reduce(times, values, n, tol, quat) drops the keys that linear interpolation (normalised for a quaternion) puts back within tol */
const GLTF=(()=>{
  const TYPE=['','SCALAR','VEC2','VEC3','VEC4'],ARR=34962,ELT=34963;
  /** @param {any} doc @returns {Promise<Blob>} */
  async function write(doc){
    /** @type {any} */
    const J={asset:{version:'2.0',generator:doc.generator||'GLTF.write'},scene:0,scenes:[{nodes:doc.roots}],nodes:[],accessors:[],bufferViews:[],buffers:[]},ext=new Set(),parts=[];let len=0;
    const view=(a,target)=>{const pad=(4-len%4)%4;if(pad){parts.push(new Uint8Array(pad));len+=pad;}const b=a instanceof Uint8Array?a:new Uint8Array(a.buffer,a.byteOffset,a.byteLength);
      J.bufferViews.push(Object.assign({buffer:0,byteOffset:len,byteLength:b.byteLength},target?{target}:{}));parts.push(b);len+=b.byteLength;return J.bufferViews.length-1;};
    /** @param {any} a @param {number} n @param {number} [target] @param {boolean} [mm] */
    const acc=(a,n,target,mm)=>{const ct=a instanceof Float32Array?5126:a instanceof Uint16Array?5123:5125,o=/** @type {any} */({bufferView:view(a,target),componentType:ct,count:a.length/n,type:TYPE[n]});
      if(mm){const mn=Array(n).fill(Infinity),mx=Array(n).fill(-Infinity);for(let i=0;i<a.length;i++){const k=i%n,v=a[i];if(v<mn[k])mn[k]=v;if(v>mx[k])mx[k]=v;}o.min=mn;o.max=mx;}J.accessors.push(o);return J.accessors.length-1;};
    const unit=a=>{const o=new Float32Array(a.length);for(let i=0;i<a.length;i+=3){const l=Math.hypot(a[i],a[i+1],a[i+2]);if(l>1e-12){o[i]=a[i]/l;o[i+1]=a[i+1]/l;o[i+2]=a[i+2]/l;}else o[i+1]=1;}return o;};   /* unit normals, as the spec has them (a degenerate triangle's none: up) */
    const ints=a=>{let m=0;for(let i=0;i<a.length;i++)if(a[i]>m)m=a[i];return m<65535?Uint16Array.from(a):Uint32Array.from(a);};
    /* textures: PNG from the canvas, turned over as three would sample it */
    const png=async t=>{const c=document.createElement('canvas');c.width=t.img.width;c.height=t.img.height;const x=/** @type {CanvasRenderingContext2D} */(c.getContext('2d'));
      if(t.flip){x.translate(0,c.height);x.scale(1,-1);}x.drawImage(t.img,0,0);
      if(t.green){const d=x.getImageData(0,0,c.width,c.height);for(let i=1;i<d.data.length;i+=4)d.data[i]=255-d.data[i];x.putImageData(d,0,0);}
      const b=await new Promise(r=>c.toBlob(r,'image/png'));return new Uint8Array(await /** @type {Blob} */(b).arrayBuffer());};
    const T=doc.textures||[];if(T.length){J.images=[];J.textures=[];J.samplers=[{magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497},{magFilter:9729,minFilter:9987,wrapS:33071,wrapT:33071}];
      for(const t of T){J.images.push({bufferView:view(await png(t)),mimeType:'image/png'});J.textures.push({source:J.images.length-1,sampler:t.repeat?0:1});}}
    const texRef=(i,xf)=>{const o=/** @type {any} */({index:i});if(xf){ext.add('KHR_texture_transform');o.extensions={KHR_texture_transform:{offset:xf.o,scale:xf.s,rotation:xf.r}};}return o;};
    J.materials=(doc.materials||[]).map(m=>{const o=/** @type {any} */({name:m.name,pbrMetallicRoughness:{baseColorFactor:m.color,metallicFactor:m.metal,roughnessFactor:m.rough}});
      if(m.map!=null)o.pbrMetallicRoughness.baseColorTexture=texRef(m.map,m.xf);
      if(m.nmap!=null){o.normalTexture=texRef(m.nmap,m.xf);o.normalTexture.scale=m.nscale??1;}
      if(m.emissive&&m.emissive.some(v=>v>0))o.emissiveFactor=m.emissive;if(m.blend)o.alphaMode='BLEND';if(m.double)o.doubleSided=true;
      if(m.trans){ext.add('KHR_materials_transmission');ext.add('KHR_materials_ior');o.extensions={KHR_materials_transmission:{transmissionFactor:m.trans},KHR_materials_ior:{ior:m.ior??1.5}};}
      return o;});
    J.meshes=doc.meshes.map(m=>{const o=/** @type {any} */({name:m.name,primitives:m.prims.map(p=>{const q=/** @type {any} */({attributes:{POSITION:acc(p.pos,3,ARR,true),NORMAL:acc(unit(p.nrm),3,ARR)},mode:4});
        if(p.uv)q.attributes.TEXCOORD_0=acc(p.uv,2,ARR);if(p.idx)q.indices=acc(ints(p.idx),1,ELT);if(p.mat!=null)q.material=p.mat;
        if(p.targets&&p.targets.length)q.targets=p.targets.map(t=>{const a=/** @type {any} */({POSITION:acc(t.pos,3,ARR,true)});if(t.nrm)a.NORMAL=acc(t.nrm,3,ARR);return a;});return q;})});
      if(m.weights)o.weights=m.weights;if(m.targetNames)o.extras={targetNames:m.targetNames};return o;});
    J.nodes=doc.nodes.map(n=>{const o=/** @type {any} */({name:n.name});if(n.t&&n.t.some(v=>v!==0))o.translation=n.t;if(n.r&&(n.r[0]||n.r[1]||n.r[2]||n.r[3]!==1))o.rotation=n.r;
      if(n.s&&n.s.some(v=>v!==1))o.scale=n.s;if(n.mesh!=null)o.mesh=n.mesh;if(n.children&&n.children.length)o.children=n.children;if(n.extras)o.extras=n.extras;return o;});
    if(doc.animations&&doc.animations.length){const tA=new Map(),N={translation:3,rotation:4,scale:3};
      J.animations=doc.animations.filter(a=>a.channels.length).map(a=>{const S=[],C=[];
        for(const c of a.channels){let ti=tA.get(c.times);if(ti==null){ti=acc(c.times,1,undefined,true);tA.set(c.times,ti);}
          S.push({input:ti,output:acc(c.values,1,undefined),interpolation:c.interp||'LINEAR'});const ac=J.accessors[J.accessors.length-1];ac.type=TYPE[N[c.path]||1];ac.count=c.values.length/(N[c.path]||1);   /* weights: the targets' count per key, as scalars */
          C.push({sampler:S.length-1,target:{node:c.node,path:c.path}});}
        return{name:a.name,samplers:S,channels:C};});}
    if(doc.extras)J.asset.extras=doc.extras;if(ext.size)J.extensionsUsed=[...ext];
    J.buffers=[{byteLength:len+(4-len%4)%4}];
    let js=new TextEncoder().encode(JSON.stringify(J));const jp=(4-js.length%4)%4;if(jp){const b=new Uint8Array(js.length+jp);b.set(js);b.fill(32,js.length);js=b;}
    const bp=(4-len%4)%4;if(bp)parts.push(new Uint8Array(bp));const bl=len+bp,h=new DataView(new ArrayBuffer(20)),h2=new DataView(new ArrayBuffer(8));
    h.setUint32(0,0x46546C67,true);h.setUint32(4,2,true);h.setUint32(8,12+8+js.length+8+bl,true);h.setUint32(12,js.length,true);h.setUint32(16,0x4E4F534A,true);
    h2.setUint32(0,bl,true);h2.setUint32(4,0x004E4942,true);
    return new Blob([h.buffer,js,h2.buffer,...parts],{type:'model/gltf-binary'});}
  /* keyframe reduction (Douglas-Peucker on the track): keys a straight line between their neighbours puts back within tol are dropped. quat: the values are
     quaternions, compared after normalising the interpolation (slerp's error over a small step is far under tol) */
  /** @param {Float32Array} t @param {Float32Array} v @param {number} n @param {number} tol @param {boolean} [quat] */
  function reduce(t,v,n,tol,quat){const m=t.length;if(m<3)return{times:t,values:v};const keep=new Uint8Array(m);keep[0]=keep[m-1]=1;const st=[[0,m-1]],q=new Float64Array(n);
    while(st.length){const[a,b]=/** @type {number[]} */(st.pop());let w=-1,wi=-1;
      for(let i=a+1;i<b;i++){const u=(t[i]-t[a])/((t[b]-t[a])||1);let l=0;for(let k=0;k<n;k++){q[k]=v[a*n+k]+(v[b*n+k]-v[a*n+k])*u;l+=q[k]*q[k];}
        l=quat?Math.sqrt(l)||1:1;let e=0;for(let k=0;k<n;k++)e=Math.max(e,Math.abs(q[k]/l-v[i*n+k]));if(e>w){w=e;wi=i;}}
      if(w>tol){keep[wi]=1;st.push([a,wi],[wi,b]);}}
    let c=0;for(let i=0;i<m;i++)c+=keep[i];const T=new Float32Array(c),V=new Float32Array(c*n);let j=0;
    for(let i=0;i<m;i++)if(keep[i]){T[j]=t[i];for(let k=0;k<n;k++)V[j*n+k]=v[i*n+k];j++;}return{times:T,values:V};}
  return{write,reduce};
})();
