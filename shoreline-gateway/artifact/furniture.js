// Shared furniture builder: returns a THREE.Group centered on the footprint, resting on y=0. Sizes in feet.
function buildFurniture(it,THREE){
  const g=new THREE.Group();const w=it.w/12,d=it.d/12,h=Math.max(it.h,0.5)/12;const col=new THREE.Color(it.c||'#999');
  const mat=(c,r)=>new THREE.MeshStandardMaterial({color:c,roughness:r==null?0.7:r});
  const box=(bw,bh,bd,x,y,z,m)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(bw,bh,bd),m);mesh.position.set(x,y+bh/2,z);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);const e=new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry),new THREE.LineBasicMaterial({color:0x5a5f66,transparent:true,opacity:0.5}));e.position.copy(mesh.position);g.add(e);return mesh;};
  const cyl=(rad,ch,x,y,z,m)=>{const mesh=new THREE.Mesh(new THREE.CylinderGeometry(rad,rad,ch,24),m);mesh.position.set(x,y+ch/2,z);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);return mesh;};
  const light=col.clone().lerp(new THREE.Color('#ffffff'),0.35), dark=col.clone().lerp(new THREE.Color('#000000'),0.25);
  const k=it.k||'generic';
  if(k==='bed'){ // platform + rails, headboard at -z (top of plan), mattress, duvet, pillows
    const rail=Math.min(0.5,(w-5)/2>0?0.5:0.2);
    box(w,0.95,d,0,0.15,0,mat(col,0.35));
    box(w-1,0.15,d-0.5,0,0,0,new THREE.MeshStandardMaterial({color:0xfff1c4,emissive:0xffe49a,emissiveIntensity:0.8}));
    box(w,Math.max(h,2.5),0.22,0,0,-d/2+0.11,mat(col,0.35));
    const mw=Math.min(w-2*rail-0.1,6.4), md=Math.min(d-rail-0.4,6.7);
    box(mw,0.9,md,0,1.1,0.15,mat('#ece7df',0.95));
    box(mw-0.2,0.3,md-2.3,0,2.0,1.2,mat('#a3adb5',1));
    box(mw*0.42,0.45,1.5,-mw*0.26,2.0,-md/2+1.0,mat('#f4f4f4',1));box(mw*0.42,0.45,1.5,mw*0.26,2.0,-md/2+1.0,mat('#f4f4f4',1));
  }else if(k==='sofa'){
    const arm=Math.min(0.6,w*0.1), back=Math.min(0.7,d*0.25), sh=1.4;
    box(w,sh,d,0,0,0,mat(col,0.9));                       // base
    box(w,Math.max(h,2.6),back,0,0,-d/2+back/2,mat(col,0.9)); // back
    box(arm,sh+0.5,d,-w/2+arm/2,0,0,mat(col,0.9));box(arm,sh+0.5,d,w/2-arm/2,0,0,mat(col,0.9));
    const n=w>7?3:2, cw=(w-2*arm)/n;for(let i=0;i<n;i++)box(cw-0.08,0.35,d-back-0.1,-w/2+arm+cw*(i+0.5),sh,back/2+0.0,mat(light,1));
  }else if(k==='table'||k==='roundtable'){
    const top=Math.min(0.12,h);
    if(k==='roundtable'){const m=new THREE.Mesh(new THREE.CylinderGeometry(w/2,w/2,top,48),mat(col,0.4));m.position.y=h-top/2;m.castShadow=true;g.add(m);cyl(0.2,h-top,0,0,0,mat(dark,0.5));const base=new THREE.Mesh(new THREE.CylinderGeometry(w/4,w/4,0.08,32),mat(dark,0.5));base.position.y=0.04;g.add(base);}
    else{box(w,top,d,0,h-top,0,mat(col,0.4));const lx=w/2-0.2,lz=d/2-0.2;[[-lx,-lz],[lx,-lz],[-lx,lz],[lx,lz]].forEach(([x,z])=>box(0.15,h-top,0.15,x,0,z,mat(dark,0.5)));}
  }else if(k==='desk'){
    const top=0.1;box(w,top,d,0,h-top,0,mat(col,0.4));box(0.12,h-top,d-0.3,-w/2+0.1,0,0,mat(dark,0.5));box(0.12,h-top,d-0.3,w/2-0.1,0,0,mat(dark,0.5));
  }else if(k==='chair'){
    const seat=Math.min(1.5,h*0.45);box(w,0.15,d,0,seat,0,mat(col,0.9));box(w,h-seat,0.12,0,seat,-d/2+0.06,mat(col,0.9));
    const lx=w/2-0.12,lz=d/2-0.12;[[-lx,-lz],[lx,-lz],[-lx,lz],[lx,lz]].forEach(([x,z])=>box(0.1,seat,0.1,x,0,z,mat(dark,0.5)));
  }else if(k==='stool'){
    const m=new THREE.Mesh(new THREE.CylinderGeometry(w/2,w/2,0.2,24),mat(col,0.7));m.position.y=h-0.1;m.castShadow=true;g.add(m);cyl(0.08,h-0.2,0,0,0,mat(dark,0.4));const ring=new THREE.Mesh(new THREE.TorusGeometry(w/2.6,0.03,8,32),mat(dark,0.4));ring.rotation.x=Math.PI/2;ring.position.y=0.8;g.add(ring);const base=new THREE.Mesh(new THREE.CylinderGeometry(w/2.4,w/2.4,0.06,24),mat(dark,0.4));base.position.y=0.03;g.add(base);
  }else if(k==='storage'){
    box(w,h,d,0,0,0,mat(col,0.5));const n=h>4?4:h>2.5?3:h>1.6?2:1;for(let i=0;i<n;i++){const dy=h*(i+0.5)/n;box(w-0.2,0.04,0.02,0,dy,d/2+0.01,mat(dark,0.5));box(0.5,0.05,0.04,0,dy+0.08,d/2+0.03,mat('#3a3a3a',0.3));}
  }else if(k==='rug'){
    box(w,0.04,d,0,0,0,mat(col,1));box(w-0.5,0.045,d-0.5,0,0,0,mat(light,1));
  }else if(k==='plant'){
    cyl(Math.min(w,d)/3,Math.min(h*0.35,1.2),0,0,0,mat('#8a7a68',0.8));const s=new THREE.Mesh(new THREE.SphereGeometry(Math.min(w,d)/2,16,12),mat('#4f7a4a',1));s.position.y=h-Math.min(w,d)/2;s.castShadow=true;g.add(s);
  }else{ box(w,h,d,0,0,0,mat(col,0.6)); }
  return g;
}
