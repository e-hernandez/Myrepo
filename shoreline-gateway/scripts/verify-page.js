// Run from the shoreline-gateway folder: node scripts/verify-page.js  (loads the page with #planner, clicks each layout, reports overlaps and JS errors)
const { chromium } = require('playwright');const fs=require('fs');const path=require('path');
(async()=>{fs.writeFileSync('test-page.html','<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body>'+fs.readFileSync('artifact/shoreline-gateway-guide.html','utf8')+'</body></html>');
const url='file://'+path.resolve('test-page.html');const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});const p=await b.newPage({viewport:{width:1200,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(url+'#planner',{waitUntil:'load'});await p.waitForTimeout(2500);
for(const id of ['reset','ldesk','viewdesk','wallsofa','bedonly']){await p.click('#'+id);await p.waitForTimeout(600);console.log(id,await p.evaluate(()=>document.getElementById('fitsum').textContent));if(id==='ldesk'){await p.evaluate(()=>document.querySelector('#plan2d').scrollIntoView());await p.waitForTimeout(500);await p.screenshot({path:'ldesk.png'});}}
console.log('errors',errs);await b.close();})();
