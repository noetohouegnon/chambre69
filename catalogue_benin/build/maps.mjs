import {geoMercator, geoPath} from '/tmp/claude-0/work/npm/node_modules/d3-geo/dist/d3-geo.mjs';
import {feature} from '/tmp/claude-0/work/npm/node_modules/topojson-client/src/index.js';
import fs from 'fs';
const topo = JSON.parse(fs.readFileSync('/tmp/claude-0/work/npm/node_modules/world-atlas/countries-10m.json'));
const countries = feature(topo, topo.objects.countries).features;
const byName = n => countries.find(c => c.properties.name === n);
const BEN = byName('Benin');
const OUT = process.argv[2];
const GREEN='#0F4C3A', IVORY='#F7F1E3', SAND='#E4D5B7', TERRA='#B5502F', GOLD='#B8914A', INK='#1F2A24';
const VILLES = JSON.parse(fs.readFileSync(process.argv[3]));
function frame(w,h,fitFeats,pad){
  const proj = geoMercator().fitExtent([[pad,pad],[w-pad,h-pad]],{type:'FeatureCollection',features:fitFeats});
  return {proj, path: geoPath(proj)};
}
const neighbours = ['Togo','Nigeria','Burkina Faso','Niger','Ghana','Mali',"Côte d'Ivoire",'Algeria','Cameroon','Chad','Guinea'].map(byName).filter(Boolean);
const sea = (w,h)=>`<rect width="${w}" height="${h}" fill="#DCE8E4"/>`;
const defs = `<style>text{font-family:Inter,Arial,sans-serif}</style>`;
// ── Carte 1 : Bénin en Afrique de l'Ouest
function westAfrica(){
  const w=900,h=700;
  const bbox = {type:'Feature',geometry:{type:'MultiPoint',coordinates:[[-7.5,3.5],[9.5,3.5],[9.5,16],[-7.5,16]]}};
  const {proj,path}=frame(w,h,[bbox],10);
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${defs}${sea(w,h)}`;
  const WA=['Togo','Nigeria','Burkina Faso','Niger','Ghana','Mali',"Côte d'Ivoire",'Algeria','Cameroon','Chad','Guinea','Senegal','Mauritania','Gambia','Guinea-Bissau','Sierra Leone','Liberia','Eq. Guinea','Gabon','Libya','Central African Rep.','Sudan','Congo'].map(byName).filter(Boolean);
  WA.forEach((c,i)=>{ const d=path(c); if(d) s+=`<path d="${d}" fill="${i%2?'#E9DCC0':SAND}" stroke="#fff" stroke-width="2.2"/>`;});
  s+=`<path d="${path(BEN)}" fill="${GREEN}" stroke="#fff" stroke-width="1.5"/>`;
  const L=[['TOGO',[1.0,8.0]],['NIGERIA',[7.8,9.2]],['BURKINA FASO',[-1.4,12.2]],['NIGER',[7.5,15]],['GHANA',[-1.1,7.6]],['MALI',[-4.4,15]],["CÔTE D'IVOIRE",[-5.2,7.2]],['CAMEROUN',[9.5,5.4]]];
  L.forEach(([t,[lo,la]])=>{const [x,y]=proj([lo,la]); s+=`<text x="${x}" y="${y}" font-size="14" letter-spacing="2" fill="#7B6B49" text-anchor="middle" font-weight="500">${t}</text>`;});
  const [bx,by]=proj([2.3,9.6]); s+=`<text x="${bx}" y="${by}" font-size="26" fill="#fff" text-anchor="middle" font-weight="700" letter-spacing="4" font-family="Playfair Display,serif" transform="rotate(-90 ${bx} ${by})">BÉNIN</text>`;
  const [ox,oy]=proj([1.5,4.2]); s+=`<text x="${ox}" y="${oy}" font-size="18" fill="#4F7F76" text-anchor="middle" font-style="italic" letter-spacing="3">Golfe de Guinée</text>`;
  const [cx,cy]=proj(VILLES['Cotonou']); s+=`<circle cx="${cx}" cy="${cy}" r="6" fill="${TERRA}" stroke="#fff" stroke-width="2"/><text x="${cx+10}" y="${cy+4}" font-size="14" fill="${INK}" font-weight="700">Cotonou</text>`;
  const [px,py]=proj(VILLES['Porto-Novo']);
  s+=`</svg>`; return s;
}
// ── Carte 2 : Bénin, villes principales et chefs-lieux
const LABEL_OFF = {'Cotonou':[8,20,'start'],'Porto-Novo':[10,-6,'start'],'Ouidah':[-8,-8,'end'],'Grand-Popo':[-8,16,'end'],'Abomey':[-10,-6,'end'],'Dassa-Zoumè':[10,4,'start'],'Parakou':[10,4,'start'],'Nikki':[10,4,'start'],'Natitingou':[-10,4,'end'],'Djougou':[-10,4,'end'],'Kandi':[10,4,'start'],'Malanville':[10,4,'start'],'Lokossa':[-10,-4,'end'],'Allada':[-10,-6,'end'],'Boukoumbé':[-10,4,'end'],'Tanguiéta':[-10,4,'end'],'Savalou':[-10,4,'end'],'Ganvié':[10,-8,'start'],'Bohicon':[10,14,'start'],'Adjarra':[10,0,'start']};
function baseBenin(w,h,pad=30){
  const proj=geoMercator().fitExtent([[pad,pad],[w-pad,h-pad-70]],BEN); const path=geoPath(proj);
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${defs}${sea(w,h)}`;
  neighbours.forEach(c=>{const d=path(c); if(d) s+=`<path d="${d}" fill="#EFE7D3" stroke="#fff" stroke-width="1"/>`;});
  s+=`<path d="${path(BEN)}" fill="${IVORY}" stroke="${GREEN}" stroke-width="2.2"/>`;
  return {s,proj,path};
}
function cityLayer(proj,names,opts={}){
  let s='';
  names.forEach(n=>{const p=VILLES[n]; if(!p) return; const [x,y]=proj([p[1],p[0]]); const [dx,dy,an]=LABEL_OFF[n]||[8,4,'start'];
    const major=opts.major&&opts.major.includes(n);
    s+=`<circle cx="${x}" cy="${y}" r="${major?6:4}" fill="${major?TERRA:GREEN}" stroke="#fff" stroke-width="1.6"/><text x="${x+dx}" y="${y+dy}" font-size="${major?15:12.5}" fill="${INK}" text-anchor="${an}" font-weight="${major?700:500}" paint-order="stroke" stroke="${IVORY}" stroke-width="3.5">${n}</text>`;});
  return s;
}
const fixV = {}; for(const k in VILLES){ fixV[k]=VILLES[k]; }
function cities(){
  const w=700,h=980; const {s,proj}=baseBenin(w,h,40);
  let out=s;
  out+=cityLayer(proj,['Cotonou','Porto-Novo','Parakou','Abomey','Natitingou','Ouidah','Grand-Popo','Dassa-Zoumè','Nikki','Djougou','Kandi','Lokossa','Allada','Malanville'],{major:['Cotonou','Porto-Novo','Parakou']});
  const [lx,ly]=proj([1.2,6.0]); out+=`<text x="${lx+40}" y="${ly}" font-size="16" fill="#4F7F76" font-style="italic" letter-spacing="3">Océan Atlantique</text>`;
  out+=`<text x="${w-20}" y="${h-20}" font-size="11" fill="#6B6B5F" text-anchor="end">Fond cartographique : Natural Earth (domaine public)</text></svg>`;
  return out;
}
function attractions(){
  const w=700,h=980; const {s,proj}=baseBenin(w,h,40); let out=s;
  const groups=[['Cotonou',TERRA],['Ouidah',TERRA],['Ganvié',GOLD],['Porto-Novo',TERRA],['Grand-Popo',GOLD],['Abomey',TERRA],['Dassa-Zoumè',GREEN],['Parakou',GREEN],['Nikki',GREEN],['Natitingou',GREEN]];
  const AOFF={'Cotonou':[16,22,'start'],'Ouidah':[-14,-10,'end'],'Ganvié':[-6,-18,'end'],'Porto-Novo':[16,-6,'start'],'Grand-Popo':[-14,22,'end'],'Abomey':[-16,-4,'end'],'Dassa-Zoumè':[16,4,'start'],'Parakou':[16,4,'start'],'Nikki':[16,4,'start'],'Natitingou':[-16,4,'end']};
  groups.forEach(([n,c],i)=>{const p=VILLES[n]; const [x,y]=proj([p[1],p[0]]); const [dx,dy,an]=AOFF[n];
    out+=`<circle cx="${x}" cy="${y}" r="9" fill="${c}" stroke="#fff" stroke-width="2"/><text x="${x}" y="${y+4}" font-size="11" fill="#fff" text-anchor="middle" font-weight="700">${i+1}</text><text x="${x+dx}" y="${y+dy}" font-size="13.5" fill="${INK}" text-anchor="${an}" font-weight="600" paint-order="stroke" stroke="${IVORY}" stroke-width="3.5">${n}</text>`;});
  out+=`<g transform="translate(18,18)"><rect width="260" height="92" rx="8" fill="#fff" opacity=".9"/><circle cx="18" cy="22" r="7" fill="${TERRA}"/><text x="34" y="26" font-size="12.5" fill="${INK}">Sud : villes historiques</text><circle cx="18" cy="46" r="7" fill="${GOLD}"/><text x="34" y="50" font-size="12.5" fill="${INK}">Eau et littoral</text><circle cx="18" cy="70" r="7" fill="${GREEN}"/><text x="34" y="74" font-size="12.5" fill="${INK}">Centre et Nord (avis de sécurité : voir p. dédiée)</text></g></svg>`;
  return out;
}
// ── Cartes de circuits (tracé schématique)
function circuit(route,label){
  const w=620,h=560;
  const pts=route.map(n=>VILLES[n]);
  const south={type:'Feature',geometry:{type:'MultiPoint',coordinates:pts.map(p=>[p[1],p[0]])}};
  const lons=pts.map(p=>p[1]), lats=pts.map(p=>p[0]); const padLon=0.35,padLat=0.28;
  const box={type:'Feature',geometry:{type:'MultiPoint',coordinates:[[Math.min(...lons)-padLon,Math.min(...lats)-padLat],[Math.max(...lons)+padLon,Math.min(...lats)-padLat],[Math.max(...lons)+padLon,Math.max(...lats)+padLat],[Math.min(...lons)-padLon,Math.max(...lats)+padLat]]}};
  const {proj,path}=frame(w,h,[box],30);
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${defs}${sea(w,h)}`;
  neighbours.forEach(c=>{const d=path(c); if(d) s+=`<path d="${d}" fill="#EFE7D3" stroke="#fff"/>`;});
  s+=`<path d="${path(BEN)}" fill="${IVORY}" stroke="${GREEN}" stroke-width="2"/>`;
  const xy=route.map(n=>proj([VILLES[n][1],VILLES[n][0]]));
  s+=`<polyline points="${xy.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${TERRA}" stroke-width="3.2" stroke-dasharray="9 6" stroke-linejoin="round"/>`;
  route.forEach((n,i)=>{const [x,y]=xy[i]; const [dx,dy,an]=LABEL_OFF[n]||[10,4,'start'];
    s+=`<circle cx="${x}" cy="${y}" r="11" fill="${GREEN}" stroke="#fff" stroke-width="2"/><text x="${x}" y="${y+4.5}" font-size="12" fill="#fff" text-anchor="middle" font-weight="700">${i+1}</text><text x="${x+dx*1.7}" y="${y+dy}" font-size="14" fill="${INK}" text-anchor="${an}" font-weight="600" paint-order="stroke" stroke="${IVORY}" stroke-width="4">${n}</text>`;});
  s+=`<text x="${w-12}" y="${h-10}" font-size="10.5" fill="#6B6B5F" text-anchor="end">Tracé schématique — ne figure pas le tracé routier réel</text></svg>`;
  return s;
}
fs.mkdirSync(OUT,{recursive:true});
fs.writeFileSync(OUT+'/map_westafrica.svg',westAfrica());
fs.writeFileSync(OUT+'/map_cities.svg',cities());
fs.writeFileSync(OUT+'/map_attractions.svg',attractions());
const ROUTES = JSON.parse(fs.readFileSync(process.argv[4]));
for(const [id,r] of Object.entries(ROUTES)) fs.writeFileSync(OUT+`/map_circuit_${id}.svg`,circuit(r,id));
console.log('maps ok');
