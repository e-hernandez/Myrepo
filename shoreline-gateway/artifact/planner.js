(function(){
const U = window.__UNIT3D__;
const CELL=U.cell, Wft=U.W, Hft=U.H;
// floor/ok grid from runs
const rows=U.wallgrid.length, cols=U.wallgrid[0].length;
const ok=Array.from({length:rows},()=>new Uint8Array(cols));
for(const [x,y,w] of U.floor.concat(U.balcony)){const j=Math.round(y/CELL),i0=Math.round(x/CELL),n=Math.round(w/CELL);for(let i=i0;i<i0+n;i++) if(ok[j]) ok[j][i]=1;}
const FIXED=[{n:'Kitchen counter',x:1.53,y:19.05,w:2.13,d:16.35,h:3},{n:'Island',x:8.02,y:23.56,w:3.05,d:5.86,h:3}];
const isWall=(x,y)=>{const i=Math.floor(x/CELL),j=Math.floor(y/CELL);if(j<0||j>=rows||i<0||i>=cols)return true;if(U.wallgrid[j][i]==='1'||!ok[j][i])return true;for(const f of FIXED)if(x>=f.x&&x<=f.x+f.w&&y>=f.y&&y<=f.y+f.d)return true;return false;};
const PRESETS=[
 {n:'Jessica king platform bed (Coaster 202990KE)',k:'bed',w:88,d:88.75,h:43.25,c:'#e9e4d8'},
 {n:'Jessica queen platform bed (202990Q)',k:'bed',w:72,d:88.75,h:43.25,c:'#e9e4d8'},
 {n:'King mattress only',k:'generic',w:76,d:80,h:12,c:'#f1ede6'},
 {n:'Queen mattress only',k:'generic',w:60,d:80,h:12,c:'#f1ede6'},
 {n:'Caravana Mid-Century 48" TV stand (13.5" deep)',k:'storage',w:48,d:13.5,h:17,c:'#8b6b4e'},
 {n:'Caravana 46" Walnut slatted TV stand',k:'storage',w:46,d:15.5,h:17.5,c:'#7a5a40'},
 {n:'Caravana Rectangular mango console table',k:'desk',w:46,d:14,h:30,c:'#b08a63'},
 {n:'TV 55" wall-mounted',k:'generic',w:48.5,d:3,h:28,c:'#1f2326'},
 {n:'TV 65" wall-mounted',k:'generic',w:57,d:3,h:33,c:'#1f2326'},
 {n:'PS5 (horizontal)',k:'generic',w:15.4,d:10.2,h:4.1,c:'#f0f0f0'},
 {n:'Nightstand',k:'storage',w:24,d:18,h:24,c:'#b89b7a'},
 {n:'Dresser 6-drawer',k:'storage',w:60,d:18,h:34,c:'#b89b7a'},
 {n:'Sofa 90"',k:'sofa',w:90,d:38,h:33,c:'#6f8a99'},
 {n:'Loveseat 64"',k:'sofa',w:64,d:36,h:33,c:'#6f8a99'},
 {n:'Sectional L 100"x64"',k:'sofa',w:100,d:64,h:33,c:'#6f8a99'},
 {n:'Coffee table',k:'table',w:48,d:24,h:17,c:'#8b6b4e'},
 {n:'TV console 70"',k:'storage',w:70,d:16,h:20,c:'#8b6b4e'},
 {n:'Round dining table 48"',k:'roundtable',w:48,d:48,h:30,c:'#c9a877'},
 {n:'Dining table 60"x36"',k:'table',w:60,d:36,h:30,c:'#c9a877'},
 {n:'Dining chair',k:'chair',w:18,d:20,h:34,c:'#d9c6a3'},
 {n:'Secretlab MAGNUS Pro XL 67"x31.5" (white)',k:'desk',w:67,d:31.5,h:29,c:'#f2f2f0'},
 {n:'Secretlab MAGNUS Pro 59"x27.6" (white)',k:'desk',w:59.1,d:27.6,h:29,c:'#f2f2f0'},
 {n:'FlexiSpot E7 72"x30"',k:'desk',w:72,d:30,h:29,c:'#d9c7a0'},
 {n:'Standing desk 80"x30"',k:'desk',w:80,d:30,h:29,c:'#d9c7a0'},
 {n:'Standing desk 96"x30"',k:'desk',w:96,d:30,h:29,c:'#d9c7a0'},
 {n:'Vernal Executive L-desk main run 78.7"x29.5" (walnut)',k:'desk',w:78.7,d:29.5,h:29,c:'#5a4034'},
 {n:'Vernal Executive L-desk return 59"x27.5"',k:'desk',w:27.5,d:59,h:29,c:'#5a4034'},
 {n:'Vernal Core3 L-desk main run 79"x27.5"',k:'desk',w:79,d:27.5,h:29,c:'#f2f2f0'},
 {n:'Vernal Core3 L-desk return 59"x27.5"',k:'desk',w:27.5,d:59,h:29,c:'#f2f2f0'},
 {n:'FlexiSpot E7L main run 76"x24"',k:'desk',w:76,d:24,h:29,c:'#f2f2f0'},
 {n:'FlexiSpot E7L return 55"x28"',k:'desk',w:28,d:55,h:29,c:'#f2f2f0'},
 {n:'FlexiSpot E7 Pro 60"x30"',k:'desk',w:60,d:30,h:29,c:'#d9c7a0'},
 {n:'Secretlab TITAN Evo chair',k:'chair',w:27,d:27,h:51,c:'#f2f2f0'},
 {n:'Lift-top round coffee table 35"',k:'roundtable',w:35,d:35,h:16,c:'#c9b08a'},
 {n:'Glossy lift-top coffee table 47"x20"',k:'table',w:47,d:20,h:14,c:'#eeeeee'},
 {n:'Desk 60"x30"',k:'desk',w:60,d:30,h:30,c:'#9aa7b0'},
 {n:'Office chair',k:'chair',w:26,d:26,h:40,c:'#7c8790'},
 {n:'Bookcase 36"x12"',k:'storage',w:36,d:12,h:72,c:'#9aa7b0'},
 {n:'Rug 8x10',k:'rug',w:96,d:120,h:0.5,c:'#d6cbb8'},
 {n:'Rug 5x8',k:'rug',w:60,d:96,h:0.5,c:'#d6cbb8'},
 {n:'Bar stool',k:'stool',w:16,d:16,h:30,c:'#7c8790'},
 {n:'Balcony chair',k:'chair',w:26,d:28,h:32,c:'#7c9a7c'},
 {n:'Bistro table 28"',k:'roundtable',w:28,d:28,h:28,c:'#7c9a7c'}
];
// default layout: bed on the head wall, pushed toward the window so the closet door clears
const DEFAULT=[
 {n:'Jessica king platform bed (Coaster 202990KE)',k:'bed',w:88,d:88.75,h:43.25,c:'#e9e4d8',cx:29.13,cy:6.25,r:0},
 {n:'Jessica nightstand 26×15',k:'storage',w:26,d:15,h:23,c:'#e9e4d8',cx:33.95,cy:3.15,r:0},
 {n:'FlexiSpot E7 72"x30"',k:'desk',w:72,d:30,h:29,c:'#d9c7a0',cx:28.4,cy:15.35,r:0},
 {n:'Secretlab TITAN Evo chair',k:'chair',w:27,d:27,h:51,c:'#f2f2f0',cx:28.3,cy:18.1,r:0},
 {n:'Sofa 90"',k:'sofa',w:90,d:38,h:33,c:'#6f8a99',cx:18.5,cy:27.0,r:0},
 {n:'Coffee table',k:'table',w:48,d:24,h:17,c:'#8b6b4e',cx:18.5,cy:30.3,r:0},
 {n:'Rug 8x10',k:'rug',w:96,d:120,h:0.5,c:'#d6cbb8',cx:18.5,cy:29.5,r:90},
 {n:'TV console 70"',k:'storage',w:70,d:16,h:20,c:'#8b6b4e',cx:17.5,cy:21.8,r:0},
 {n:'Round dining table 48"',k:'roundtable',w:48,d:48,h:30,c:'#c9a877',cx:10.5,cy:33.3,r:0},
 {n:'Bar stool',k:'stool',w:16,d:16,h:30,c:'#7c8790',cx:11.9,cy:24.6,r:0},
 {n:'Bar stool',k:'stool',w:16,d:16,h:30,c:'#7c8790',cx:11.9,cy:27.0,r:0},
 {n:'Balcony chair',k:'chair',w:26,d:28,h:32,c:'#7c9a7c',cx:36.5,cy:7,r:0},
 {n:'Balcony chair',k:'chair',w:26,d:28,h:32,c:'#7c9a7c',cx:37.8,cy:8.6,r:0}
];
const DEN={x1:18.125,y1:19.655,x2:28.875,y2:23.141};
const DENA=Math.atan2(DEN.y2-DEN.y1,DEN.x2-DEN.x1), DENANG=DENA*180/Math.PI;
function snapDen(it,shift){const nx=-Math.sin(DENA),ny=Math.cos(DENA),tx=Math.cos(DENA),ty=Math.sin(DENA);const sh=(shift==null?-1.5:shift);const mx=(DEN.x1+DEN.x2)/2+tx*sh,my=(DEN.y1+DEN.y2)/2+ty*sh;const off=it.d/24+0.3;it.r=Math.round(DENANG*10)/10;it.cx=Math.round((mx+nx*off)*12)/12;it.cy=Math.round((my+ny*off)*12)/12;}
function inFront(base,dist){const nx=-Math.sin(DENA),ny=Math.cos(DENA);return {cx:Math.round((base.cx+nx*dist)*12)/12,cy:Math.round((base.cy+ny*dist)*12)/12};}
const WALLSOFA=[
 DEFAULT[0],
 {n:'Jessica nightstand 26×15',k:'storage',w:26,d:15,h:23,c:'#e9e4d8',cx:33.95,cy:3.15,r:0},
 {n:'FlexiSpot E7 72"x30"',k:'desk',w:72,d:30,h:29,c:'#d9c7a0',cx:28.4,cy:15.35,r:0},
 {n:'Secretlab TITAN Evo chair',k:'chair',w:27,d:27,h:51,c:'#f2f2f0',cx:28.3,cy:18.1,r:0},
 {n:'Modern Neutral Chenille Sectional (Gray or Black)',k:'sectional',w:119.25,d:79.5,h:35.5,c:'#8f8f8a',cx:24.5,cy:24.8,r:14},
 {n:'Rug 8x10',k:'rug',w:96,d:120,h:0.5,c:'#d6cbb8',cx:22.3,cy:27.6,r:104},
 {n:'Glossy lift-top coffee table 47"x20"',k:'table',w:47,d:20,h:14,c:'#eeeeee',cx:21.6,cy:28.6,r:14},
 {n:'Round dining table 48"',k:'roundtable',w:48,d:48,h:30,c:'#c9a877',cx:10.5,cy:33.3,r:0},
 {n:'Bar stool',k:'stool',w:16,d:16,h:30,c:'#7c8790',cx:11.9,cy:24.6,r:0},
 {n:'Bar stool',k:'stool',w:16,d:16,h:30,c:'#7c8790',cx:11.9,cy:27,r:0},
 {n:'Balcony chair',k:'chair',w:26,d:28,h:32,c:'#7c9a7c',cx:36.5,cy:7,r:0},
 {n:'Balcony chair',k:'chair',w:26,d:28,h:32,c:'#7c9a7c',cx:37.8,cy:8.6,r:0}
];
const VIEWDESK=DEFAULT.map(x=>Object.assign({},x));
VIEWDESK[2]={n:'FlexiSpot E7 72"x30" (facing the glass)',k:'desk',w:72,d:30,h:29,c:'#d9c7a0',cx:28.98,cy:18.0,r:117};
VIEWDESK[3]={n:'Secretlab TITAN Evo chair',k:'chair',w:27,d:27,h:51,c:'#f2f2f0',cx:26.57,cy:16.77,r:117};
const LDESK=DEFAULT.map(x=>Object.assign({},x));
LDESK[2]={n:'Vernal Executive L-desk main run 78.7"x29.5" (walnut)',k:'desk',w:78.7,d:29.5,h:29,c:'#5a4034',cx:26.42,cy:15.08,r:0};
LDESK[3]={n:'Secretlab TITAN Evo chair',k:'chair',w:27,d:27,h:51,c:'#f2f2f0',cx:25.81,cy:17.71,r:0};
LDESK.splice(4,0,{n:'Vernal Executive L-desk return 59"x27.5" (laptops)',k:'desk',w:27.5,d:59,h:29,c:'#5a4034',cx:28.55,cy:16.31,r:0});
const BEDONLY=[DEFAULT[0]];
let items=[], sel=-1;
const KEY='sg2607-layout-v1';
function load(){try{const s=localStorage.getItem(KEY);if(s){const j=JSON.parse(s);if(Array.isArray(j)&&j.length){items=j;return;}}}catch(e){} items=JSON.parse(JSON.stringify(DEFAULT));}
function save(){try{localStorage.setItem(KEY,JSON.stringify(items));}catch(e){}}
const rad=it=>(it.r||0)*Math.PI/180;
const toWorld=(it,lx,ly)=>{const a=rad(it),c=Math.cos(a),s=Math.sin(a);return {x:it.cx+lx*c-ly*s,y:it.cy+lx*s+ly*c};};
const toLocal=(it,x,y)=>{const a=rad(it),c=Math.cos(a),s=Math.sin(a),dx=x-it.cx,dy=y-it.cy;return {x:dx*c+dy*s,y:-dx*s+dy*c};};
const corners=it=>{const w=it.w/12,d=it.d/12;return [[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]].map(([lx,ly])=>toWorld(it,lx,ly));};
const fp=it=>{const cs=corners(it);const xs=cs.map(p=>p.x),ys=cs.map(p=>p.y);const x=Math.min(...xs),y=Math.min(...ys);return {x,y,w:Math.max(...xs)-x,d:Math.max(...ys)-y};};
function collides(it){const w=it.w/12,d=it.d/12,step=0.2,m=0.1;for(let lx=-w/2+m;lx<=w/2-m;lx+=step)for(let ly=-d/2+m;ly<=d/2-m;ly+=step){const p=toWorld(it,lx,ly);if(isWall(p.x,p.y))return true;}return false;}
// ---------- 2D ----------
const c2=document.getElementById('plan2d'), ctx=c2.getContext('2d');
const tex=new Image(); tex.src=document.getElementById('floortex').src;
let scale=1;
function size2d(){const w=c2.parentElement.clientWidth;if(!w)return;c2.width=w*devicePixelRatio;c2.height=w*(Hft/Wft)*devicePixelRatio;c2.style.height=(w*Hft/Wft)+'px';scale=c2.width/Wft;draw2d();}
function draw2d(){
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,c2.width,c2.height);
  if(tex.complete&&tex.naturalWidth)ctx.drawImage(tex,0,0,c2.width,c2.height);
  ctx.scale(scale,scale);
  ctx.fillStyle='#3b4556';U.walls.forEach(([x,y,w])=>ctx.fillRect(x,y,w,CELL));ctx.fillStyle='#9fd3e0';U.glass.forEach(([x,y,w])=>ctx.fillRect(x,y,w,CELL));ctx.fillStyle='#555b66';U.rail.forEach(([x,y,w])=>ctx.fillRect(x,y,w,CELL));
  FIXED.forEach(f=>{ctx.fillStyle='rgba(120,130,140,0.35)';ctx.fillRect(f.x,f.y,f.w,f.d);ctx.strokeStyle='#666';ctx.lineWidth=1/scale;ctx.strokeRect(f.x,f.y,f.w,f.d);});
  items.forEach((it,i)=>{const w=it.w/12,d=it.d/12;const bad=collides(it);
    ctx.save();ctx.translate(it.cx,it.cy);ctx.rotate(rad(it));ctx.globalAlpha=it.h<2?0.55:0.9;ctx.fillStyle=bad?'#e0665f':it.c;ctx.fillRect(-w/2,-d/2,w,d);
    ctx.globalAlpha=1;ctx.lineWidth=(i===sel?3:1.2)/scale;ctx.strokeStyle=i===sel?'#0d6b7a':bad?'#8a1f1f':'#444';ctx.strokeRect(-w/2,-d/2,w,d);
    if(it.k==='sofa'||it.k==='sectional'||it.k==='bed'||it.k==='chair'){ctx.fillStyle='rgba(0,0,0,0.18)';ctx.fillRect(-w/2,-d/2,w,Math.min(0.5,d/4));}
    ctx.fillStyle='#15222b';ctx.font=(0.55)+'px IBM Plex Sans, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    const lab=it.n.replace(/\s*\(.*\)/,'').slice(0,22);ctx.fillText(lab,0,0);ctx.restore();});
}
let drag=null;
function pt(e){const r=c2.getBoundingClientRect();return {x:(e.clientX-r.left)*devicePixelRatio/scale,y:(e.clientY-r.top)*devicePixelRatio/scale};}
c2.addEventListener('pointerdown',e=>{const p=pt(e);let hit=-1;for(let i=items.length-1;i>=0;i--){const it=items[i],l=toLocal(it,p.x,p.y);if(Math.abs(l.x)<=it.w/24&&Math.abs(l.y)<=it.d/24){hit=i;break;}}
  sel=hit;if(hit>=0){drag={dx:items[hit].cx-p.x,dy:items[hit].cy-p.y};c2.setPointerCapture(e.pointerId);}renderList();draw2d();});
c2.addEventListener('pointermove',e=>{if(!drag||sel<0)return;const p=pt(e);const it=items[sel];it.cx=Math.round((p.x+drag.dx)*12)/12;it.cy=Math.round((p.y+drag.dy)*12)/12;draw2d();sync3d();});
c2.addEventListener('pointerup',()=>{if(drag){drag=null;save();renderList();}});
c2.addEventListener('pointercancel',()=>{drag=null;});
// ---------- list ----------
const listEl=document.getElementById('itemlist');
function fmt(ft){const i=Math.round(ft*12);return Math.floor(i/12)+"'"+(i%12)+'"';}
function renderList(){listEl.innerHTML=items.map((it,i)=>{const bad=collides(it);const f=fp(it);
  return '<li class="pi'+(i===sel?' on':'')+'" data-i="'+i+'"><div><b>'+esc(it.n)+'</b><span class="pm">'+it.w+'" × '+it.d+'" × '+it.h+'" · at '+fmt(f.x)+', '+fmt(f.y)+' from the top-left corner'+(bad?' · <em class="bad">overlaps a wall</em>':' · <em class="good">clear</em>')+'</span></div><div class="pb"><button data-a="rot" title="Rotate 90°">⟳90</button><button data-a="r5" title="Rotate 5°">+5°</button><button data-a="l5" title="Rotate −5°">−5°</button><button data-a="den" title="Set against the den wall">Den wall</button><button data-a="del" title="Remove">✕</button></div></li>';}).join('')||'<li class="pm">No items yet. Add one below.</li>';
  document.getElementById('fitsum').textContent=items.length?items.filter(collides).length+' of '+items.length+' items overlap a wall':'';}
listEl.addEventListener('click',e=>{const li=e.target.closest('li');if(!li)return;const i=+li.dataset.i;const a=e.target.dataset.a;
  if(a==='rot'){items[i].r=(items[i].r+90)%360;}else if(a==='r5'){items[i].r=(items[i].r+5)%360;}else if(a==='l5'){items[i].r=(items[i].r+355)%360;}else if(a==='den'){snapDen(items[i]);}else if(a==='del'){items.splice(i,1);sel=-1;}else{sel=i;}
  save();renderList();draw2d();sync3d();});
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
// add form
const ps=document.getElementById('preset');PRESETS.forEach((p,i)=>{const o=document.createElement('option');o.value=i;o.textContent=p.n+' ('+p.w+'×'+p.d+'×'+p.h+'")';ps.appendChild(o);});
ps.addEventListener('change',()=>{const p=PRESETS[ps.value];if(!p)return;document.getElementById('fn').value=p.n;document.getElementById('fw').value=p.w;document.getElementById('fd').value=p.d;document.getElementById('fh').value=p.h;document.getElementById('fc').value=p.c;document.getElementById('fk').value=p.k||'generic';});
document.getElementById('addform').addEventListener('submit',e=>{e.preventDefault();const n=document.getElementById('fn').value.trim()||'Item';const w=+document.getElementById('fw').value,d=+document.getElementById('fd').value,h=+document.getElementById('fh').value||1;
  if(!(w>0&&d>0))return;items.push({n,k:document.getElementById('fk').value,w,d,h,c:document.getElementById('fc').value,cx:20,cy:26,r:0});sel=items.length-1;save();renderList();draw2d();sync3d();});
document.getElementById('reset').addEventListener('click',()=>{items=JSON.parse(JSON.stringify(DEFAULT));sel=-1;save();renderList();draw2d();sync3d();});
document.getElementById('wallsofa').addEventListener('click',()=>{items=JSON.parse(JSON.stringify(WALLSOFA));const s=items[4];snapDen(s);const rug=items[5],ct=items[6];Object.assign(rug,inFront(s,s.d/24+0.7));rug.r=Math.round((DENANG+90)*10)/10;Object.assign(ct,inFront(s,s.d/24+2.2));ct.r=s.r;sel=4;save();renderList();draw2d();sync3d();});
document.getElementById('viewdesk').addEventListener('click',()=>{items=JSON.parse(JSON.stringify(VIEWDESK));sel=2;save();renderList();draw2d();sync3d();});
document.getElementById('ldesk').addEventListener('click',()=>{items=JSON.parse(JSON.stringify(LDESK));sel=2;save();renderList();draw2d();sync3d();});
document.getElementById('bedonly').addEventListener('click',()=>{items=JSON.parse(JSON.stringify(BEDONLY));sel=-1;save();renderList();draw2d();sync3d();});
document.getElementById('dollhouse').addEventListener('click',()=>{if(three&&three.reset)three.reset();});
document.getElementById('clear').addEventListener('click',()=>{items=[];sel=-1;save();renderList();draw2d();sync3d();});
document.getElementById('copy').addEventListener('click',()=>{const t=JSON.stringify(items);const ta=document.getElementById('io');ta.value=t;const done=()=>{document.getElementById('copymsg').textContent='Copied. Paste it into a chat with Claude or back into this box later.';};
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done).catch(()=>{ta.select();done();});}else{ta.select();done();}});
document.getElementById('paste').addEventListener('click',()=>{try{const j=JSON.parse(document.getElementById('io').value);if(Array.isArray(j)){items=j.filter(x=>x&&x.w&&x.d).map(x=>({n:String(x.n||'Item'),k:x.k||'generic',w:+x.w,d:+x.d,h:+x.h||1,c:x.c||'#999',cx:+x.cx||20,cy:+x.cy||26,r:+x.r||0}));sel=-1;save();renderList();draw2d();sync3d();document.getElementById('copymsg').textContent='Layout loaded.';}}catch(e){document.getElementById('copymsg').textContent='That is not a layout. Paste the JSON that Copy produced.';}});
// ---------- 3D ----------
let three=null;
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
  }else if(k==='sectional'){ // sofa run along the back (-z) plus a chaise block on the right end
    const back=0.6, sd=Math.min(3.2,d), ch=Math.min(3.0,w*0.33);
    box(w,1.4,sd,0,0,-d/2+sd/2,mat(col,0.9)); box(w,Math.max(h,2.6),back,0,0,-d/2+back/2,mat(col,0.9));
    box(0.5,1.9,sd,-w/2+0.25,0,-d/2+sd/2,mat(col,0.9));
    box(ch,1.4,d-sd,w/2-ch/2,0,sd/2,mat(col,0.9)); box(0.5,1.9,d-sd,w/2-0.25,0,sd/2,mat(col,0.9));
    const n=Math.max(2,Math.round((w-ch-0.5)/2.6)), cw=(w-ch-0.5)/n;for(let i=0;i<n;i++)box(cw-0.08,0.35,sd-back-0.1,-w/2+0.5+cw*(i+0.5),1.4,-d/2+back+(sd-back)/2,mat(light,1));
    box(ch-0.1,0.35,d-sd-0.1,w/2-ch/2,1.4,sd/2,mat(light,1));
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

function init3d(){
  if(!window.THREE){document.getElementById('v3d').innerHTML='<p class="pm">3D view could not load (the three.js script was blocked). The 2D plan still works.</p>';return;}
  const host=document.getElementById('v3d');const W=host.clientWidth,H=Math.max(340,Math.round(W*0.8));
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(W,H);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;host.innerHTML='';host.appendChild(renderer.domElement);
  const scene=new THREE.Scene();
  const dark=(matchMedia('(prefers-color-scheme: dark)').matches&&document.documentElement.dataset.theme!=='light')||document.documentElement.dataset.theme==='dark';
  scene.background=new THREE.Color(dark?0x0f1a22:0xe4e7e9);
  const cx=Wft/2-1,cz=Hft/2;const ctr=new THREE.Vector3(cx,0,cz-1);
  const cam=new THREE.PerspectiveCamera(28,W/H,0.5,500);
  const home=()=>{cam.position.set(cx+1,74,cz+50);cam.lookAt(ctr);if(controls){controls.target.copy(ctr);controls.update();}};
  let controls=null;if(THREE.OrbitControls){controls=new THREE.OrbitControls(cam,renderer.domElement);controls.maxPolarAngle=Math.PI/2-0.08;controls.minDistance=20;controls.maxDistance=200;}
  home();
  scene.add(new THREE.AmbientLight(0xffffff,0.25));scene.add(new THREE.HemisphereLight(0xe8f0ff,0x6b7a88,0.35));
  const sun=new THREE.DirectionalLight(0xffffff,0.75);sun.position.set(cx-35,70,cz+30);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);const s=sun.shadow.camera;s.left=-40;s.right=40;s.top=40;s.bottom=-40;s.near=1;s.far=250;sun.shadow.bias=-0.0005;scene.add(sun);
  const t=new THREE.TextureLoader().load(tex.src);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;
  const fm=new THREE.MeshStandardMaterial({map:t,roughness:0.9});
  const addFloor=(runs,y)=>{runs.forEach(([x,z,w])=>{const g=new THREE.PlaneGeometry(w,CELL);const uv=g.attributes.uv;for(let i=0;i<uv.count;i++){const u=uv.getX(i),v=uv.getY(i);uv.setXY(i,(x+u*w)/Wft,1-(z+(1-v)*CELL)/Hft);}const m=new THREE.Mesh(g,fm);m.rotation.x=-Math.PI/2;m.position.set(x+w/2,y,z+CELL/2);m.receiveShadow=true;scene.add(m);});};
  addFloor(U.floor,0);addFloor(U.balcony,-0.05);
  const WALLH=3.0;const side=new THREE.MeshStandardMaterial({color:0xcfd1cf,roughness:0.7}),top=new THREE.MeshStandardMaterial({color:0xf6f6f4,roughness:0.6});const wallMat=[side,side,top,side,side,side];
  const addRuns=(runs,mat,h,y0,shadow)=>{runs.forEach(([x,z,w])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,CELL),mat);m.position.set(x+w/2,y0+h/2,z+CELL/2);m.castShadow=shadow;m.receiveShadow=true;scene.add(m);});};
  addRuns(U.walls,wallMat,WALLH,0,true);
  addRuns(U.glass,new THREE.MeshPhysicalMaterial({color:0xbfe3ee,transparent:true,opacity:0.35,roughness:0.1}),WALLH,0,false);
  addRuns(U.rail,new THREE.MeshStandardMaterial({color:0x3a3f47,transparent:true,opacity:0.8}),3.4,0,true);
  const bi=new THREE.MeshStandardMaterial({color:0xe3e4e2,roughness:0.5});
  FIXED.forEach(f=>{const m=new THREE.Mesh(new THREE.BoxGeometry(f.w,f.h,f.d),bi);m.position.set(f.x+f.w/2,f.h/2,f.y+f.d/2);m.castShadow=true;m.receiveShadow=true;scene.add(m);});
  const grp=new THREE.Group();scene.add(grp);
  three={scene,cam,renderer,grp,controls,reset:home};
  (function loop(){requestAnimationFrame(loop);if(controls)controls.update();renderer.render(scene,cam);})();
  sync3d();
}
function sync3d(){if(!three)return;const g=three.grp;while(g.children.length)g.remove(g.children[0]);
  items.forEach((it,i)=>{const f=fp(it);const bad=collides(it);
    const obj=buildFurniture(bad?Object.assign({},it,{c:'#e0665f'}):it,THREE);obj.position.set(f.x+f.w/2,0,f.y+f.d/2);obj.rotation.y=-it.r*Math.PI/180;g.add(obj);
    if(i===sel){const ring=new THREE.Mesh(new THREE.RingGeometry(Math.max(f.w,f.d)/2+0.2,Math.max(f.w,f.d)/2+0.35,48),new THREE.MeshBasicMaterial({color:0x0d6b7a,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(f.x+f.w/2,0.03,f.y+f.d/2);g.add(ring);}});}
function resize3d(){if(!three)return;const host=document.getElementById('v3d');const W=host.clientWidth;if(!W)return;const H=Math.max(340,Math.round(W*0.8));three.renderer.setSize(W,H);three.cam.aspect=W/H;three.cam.updateProjectionMatrix();}
load();renderList();tex.onload=draw2d;
window.__plannerAdd=function(it){items.push({n:String(it.n),k:it.k||'generic',w:+it.w,d:+it.d,h:+it.h||1,c:it.c||'#999',cx:20,cy:26,r:0});sel=items.length-1;save();renderList();draw2d();sync3d();};
window.__plannerShow=function(){size2d();if(!three)init3d();else resize3d();draw2d();};
addEventListener('resize',()=>{size2d();resize3d();});
})();
