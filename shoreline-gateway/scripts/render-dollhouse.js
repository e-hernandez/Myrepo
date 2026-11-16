// Run from the shoreline-gateway folder: node scripts/render-dollhouse.js  (needs playwright + bundled chromium)
const { chromium } = require('playwright');const fs=require('fs');
const U=fs.readFileSync('data/unit3d.json','utf8');const FURN=fs.readFileSync('artifact/furniture.js','utf8');
const tex='data:image/jpeg;base64,'+fs.readFileSync('images/plan/floor-texture-materials.jpg').toString('base64');
const html=`<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#0f1a22}canvas{display:block}</style></head><body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
${FURN}
const U=${U};const CELL=U.cell,Wft=U.W,Hft=U.H;
const SZ=1800;
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(SZ,SZ);renderer.setPixelRatio(1);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;document.body.appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color(0x0f1a22);
const cx=Wft/2-1, cz=Hft/2;
const cam=new THREE.PerspectiveCamera(25,1,1,500);cam.position.set(cx+1,92,cz+62);cam.lookAt(new THREE.Vector3(cx,0,cz-1));
scene.add(new THREE.AmbientLight(0xffffff,0.25));
const hemi=new THREE.HemisphereLight(0xe8f0ff,0x6b7a88,0.35);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffffff,0.75);sun.position.set(cx-35,70,cz+30);sun.castShadow=true;sun.shadow.mapSize.set(4096,4096);const s=sun.shadow.camera;s.left=-40;s.right=40;s.top=40;s.bottom=-40;s.near=1;s.far=250;sun.shadow.bias=-0.0005;scene.add(sun);
const loader=new THREE.TextureLoader();
loader.load('${tex}',t=>{t.encoding=THREE.sRGBEncoding;t.anisotropy=8;
  // floor: plan texture, slightly warmed, only under the unit footprint (walls cover edges)
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(Wft,Hft),new THREE.MeshStandardMaterial({map:t,roughness:0.9}));floor.rotation.x=-Math.PI/2;floor.position.set(Wft/2,0,Hft/2);floor.receiveShadow=true;scene.add(floor);
  // mask everything outside the floor/balcony with dark slabs? simpler: dark ground plane slightly below and cut floor by runs
  floor.visible=false;
  const fm=new THREE.MeshStandardMaterial({map:t,roughness:0.9});
  const addFloor=(runs,y)=>{runs.forEach(([x,z,w])=>{const g=new THREE.PlaneGeometry(w,CELL);const m=new THREE.Mesh(g,fm.clone());
    // uv remap to the global texture
    const uv=g.attributes.uv;for(let i=0;i<uv.count;i++){const u=uv.getX(i),v=uv.getY(i);uv.setXY(i,(x+u*w)/Wft,1-(z+(1-v)*CELL)/Hft);}
    m.rotation.x=-Math.PI/2;m.position.set(x+w/2,y,z+CELL/2);m.receiveShadow=true;scene.add(m);});};
  addFloor(U.floor,0);addFloor(U.balcony,-0.05);
  // thin white base slab under everything for the "model" look
  const WALLH=3.0;
  const side=new THREE.MeshStandardMaterial({color:0xcfd1cf,roughness:0.7});const top=new THREE.MeshStandardMaterial({color:0xf6f6f4,roughness:0.6});const wallMat=[side,side,top,side,side,side];
  const addRuns=(runs,mat,h,y0,shadow)=>{runs.forEach(([x,z,w])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,CELL),mat);m.position.set(x+w/2,y0+h/2,z+CELL/2);m.castShadow=shadow;m.receiveShadow=true;scene.add(m);});};
  addRuns(U.walls,wallMat,WALLH,0,true);
  addRuns(U.glass,new THREE.MeshPhysicalMaterial({color:0xbfe3ee,transparent:true,opacity:0.35,roughness:0.1,metalness:0.1}),WALLH,0,false);
  addRuns(U.rail,new THREE.MeshStandardMaterial({color:0x3a3f47,transparent:true,opacity:0.8}),3.4,0,true);
  // built-ins: counter + island
  const bi=new THREE.MeshStandardMaterial({color:0xe3e4e2,roughness:0.5});
  [[1.53,19.05,2.13,16.35,3],[8.02,23.56,3.05,5.86,3]].forEach(([x,z,w,d,h])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),bi);m.position.set(x+w/2,h/2,z+d/2);m.castShadow=true;m.receiveShadow=true;scene.add(m);});
  const bed=buildFurniture({k:'bed',w:88,d:88.75,h:43.25,c:'#f2f2ef'},THREE);bed.position.set(29.63,0,6.25);scene.add(bed);
  renderer.render(scene,cam);window.__done=true;});
</script></body></html>`;
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
  const p=await b.newPage({viewport:{width:1800,height:1800}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.setContent(html,{waitUntil:'load'});await p.waitForFunction(()=>window.__done===true,{timeout:120000});await p.waitForTimeout(500);
  const data=await p.evaluate(()=>document.querySelector('canvas').toDataURL('image/png'));fs.writeFileSync('images/unit-2607-dollhouse-render.png',Buffer.from(data.split(',')[1],'base64'));
  console.log('errors',errs);await b.close();})();
