import {createRequire} from 'module'; const require=createRequire('/opt/node-tools/node_modules/'); const {chromium}=require('playwright');
const [,, html]=process.argv;
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:900,height:1200}});
await p.goto('file://'+html,{waitUntil:'load',timeout:180000}); await p.evaluate(()=>document.fonts.ready);
const res=await p.evaluate(()=>{
  const out=[];
  document.querySelectorAll('section.page').forEach(pg=>{
    const n=pg.dataset.n; const pr=pg.getBoundingClientRect();
    const m=pg.querySelector('.m');
    let maxBottom=0; 
    pg.querySelectorAll('.m *').forEach(el=>{ if(el.closest('svg')) return; const r=el.getBoundingClientRect(); if(r.height>0) maxBottom=Math.max(maxBottom,r.bottom-pr.top); });
    const limit=pr.height-0.058*pr.height; // ~ 17 mm bottom margin from foot
    // 297mm => px ratio
    const mm=pr.height/297;
    const over=(maxBottom/mm);
    const noImg=[...pg.querySelectorAll('.ph-empty')].length;
    if(m && over>281) out.push({page:n,type:'overflow',bottom_mm:Math.round(over)});
    if(noImg) out.push({page:n,type:'photo-manquante',count:noImg});
    pg.querySelectorAll('.m p, .m td, .m dd, .m h3').forEach(el=>{ const fs=parseFloat(getComputedStyle(el).fontSize)*0.75; if(fs<6.5) out.push({page:n,type:'texte-petit',pt:fs.toFixed(1),txt:el.textContent.slice(0,30)}); });
  });
  return out;
});
console.log(JSON.stringify(res,null,0).replace(/\},\{/g,'},\n{'));
await b.close();
