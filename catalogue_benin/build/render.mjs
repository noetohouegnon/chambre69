import {createRequire} from 'module'; const require=createRequire('/opt/node-tools/node_modules/'); const {chromium}=require('playwright');
const [,, html, pdf]=process.argv;
const b=await chromium.launch(); const p=await b.newPage();
await p.goto('file://'+html, {waitUntil:'load', timeout:180000});
await p.evaluate(()=>document.fonts.ready);
await p.pdf({path:pdf, width:'210mm', height:'297mm', printBackground:true, preferCSSPageSize:true, margin:{top:0,right:0,bottom:0,left:0}, timeout:600000});
await b.close(); console.log('pdf ok', pdf);
