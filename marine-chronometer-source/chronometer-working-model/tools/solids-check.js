/* solids-check.js: run in the page by solids.py. Every mesh of the scene should be a closed solid facing out: no edge used by one triangle only (open),
   none used twice the same way (a face wound against its neighbours), and a positive signed volume (not inside out). Vertices are welded at 0.001 mm.
   Intentional surfaces are left out: userData.decal (the engravings) and userData.surface (the dial's printed face, the floor's shadow).
   Returns one row per failing geometry: [part, geometry type, open edges, misfolded edges, volume mm3] */
(()=>{let root=window.__mv;while(root.parent)root=root.parent;const seen=new Map(),out=[],A=new THREE.Vector3(),B=new THREE.Vector3(),C=new THREE.Vector3();
  root.traverse(o=>{if(!o.isMesh||o.userData.decal||o.userData.surface)return;const g=o.geometry,p=g.attributes&&g.attributes.position;if(!p||p.count<3)return;
    let r=seen.get(g);if(!r){const ix=g.index?g.index.array:null,n=ix?ix.length:p.count,id=new Map(),V=[];
      for(let i=0;i<p.count;i++){const k=Math.round(p.getX(i)*1000)+','+Math.round(p.getY(i)*1000)+','+Math.round(p.getZ(i)*1000);if(!id.has(k))id.set(k,id.size);V.push(id.get(k));}
      const E=new Map();let v=0;
      for(let t=0;t<n;t+=3){const ia=ix?ix[t]:t,ib=ix?ix[t+1]:t+1,ic=ix?ix[t+2]:t+2;A.fromBufferAttribute(p,ia);B.fromBufferAttribute(p,ib);C.fromBufferAttribute(p,ic);v+=A.dot(B.clone().cross(C))/6;
        const a=V[ia],b=V[ib],c=V[ic];if(a===b||b===c||c===a)continue;for(const[u,w]of[[a,b],[b,c],[c,a]]){const k=u+'_'+w;E.set(k,(E.get(k)||0)+1);}}
      let op=0,bad=0;for(const[k,c]of E){const[u,w]=k.split('_'),q=E.get(w+'_'+u)||0;if(!q)op++;else if(c!==q)bad++;}r={op,bad,v};seen.set(g,r);
      if(op||bad||v<=0){let m=o,pn=null;while(m&&!pn){pn=m.userData.partName;m=m.parent;}out.push([pn||'?',g.type,op,bad,+v.toFixed(3)]);}}});
  return out;})()
