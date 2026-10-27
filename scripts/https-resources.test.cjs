const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');
const root = path.resolve(__dirname, '..');
const pages = fs.readdirSync(root).filter(name => name.endsWith('.html'));
const policyPattern = /<meta http-equiv="Content-Security-Policy" content="([^"]+)">/;
const policyTag = fs.readFileSync(path.join(root, 'index.html'), 'utf8').match(policyPattern)[0];
let checks = 0, browser;
function check(value, message) {assert(value, message); checks++;}
for (const name of pages) {
  const html = fs.readFileSync(path.join(root, name), 'utf8');
  const pagePolicy = html.match(policyPattern);
  check(pagePolicy && pagePolicy[1].split(';').some(value=>value.trim()==='upgrade-insecure-requests'), name + ' enforces HTTPS subresources');
  const firstResource = html.search(/<script\b|<link\b|<style\b/i);
  check(firstResource < 0 || html.indexOf(pagePolicy[0]) < firstResource, name + ' sets policy before loading resources');
}
(async()=>{try {
  browser = await chromium.launch({headless:true});
  const page = await browser.newPage();
  const requests = [];
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    requests.push(url.href);
    if (url.protocol !== 'https:' || url.hostname !== 'bonsai3d.test') return route.abort();
    if (url.pathname === '/') return route.fulfill({contentType:'text/html',body:
      '<!doctype html><html><head><meta charset="utf-8">'+policyTag+'</head><body><p id="result">waiting</p>'+
      '<img id="probe" src="http://bonsai3d.test/probe.svg"><script src="http://bonsai3d.test/probe.js"></script></body></html>'});
    if (url.pathname === '/probe.svg') return route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1"/></svg>'});
    if (url.pathname === '/probe.js') return route.fulfill({contentType:'application/javascript',body:'document.querySelector("#result").textContent="loaded securely";'});
    return route.fulfill({status:404,body:''});
  });
  await page.goto('https://bonsai3d.test/',{waitUntil:'load'});
  check(await page.locator('#result').innerText() === 'loaded securely','Legacy HTTP script loads through its HTTPS URL');
  check(await page.locator('#probe').evaluate(img=>img.complete && img.naturalWidth===1),'Legacy HTTP image loads through its HTTPS URL');
  check(requests.includes('https://bonsai3d.test/probe.svg'),'Image request upgraded');
  check(requests.includes('https://bonsai3d.test/probe.js'),'Script request upgraded');
  check(requests.every(url=>url.startsWith('https://')),'No insecure network request escapes the browser');
  // An HTTPS failure must never fall back to the original cleartext image URL.
  const failedPage = await browser.newPage();
  const failedRequests = [];
  await failedPage.route('**/*',route=>{
    const url = route.request().url(); failedRequests.push(url);
    if (url === 'https://bonsai3d.test/') return route.fulfill({contentType:'text/html',body:'<!doctype html><html><head>'+policyTag+'</head><body><img id="failed" src="http://bonsai3d.test/unavailable.svg"></body></html>'});
    return route.abort();
  });
  await failedPage.goto('https://bonsai3d.test/',{waitUntil:'load'});
  check(failedRequests.includes('https://bonsai3d.test/unavailable.svg'),'Unavailable image was attempted over HTTPS');
  check(failedRequests.every(url=>url.startsWith('https://')),'Failed HTTPS resource never falls back to HTTP');
  const report = {status:'passed',checks,html_pages:pages.length,requests,failed_requests:failedRequests,
    scope:'Synthetic policy tests; no real external requests and no certificate-validation bypass'};
  fs.mkdirSync(path.join(root,'.artifacts'),{recursive:true});
  fs.writeFileSync(path.join(root,'.artifacts/https-resources-tests.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));
}catch(error){console.error(error.stack);process.exitCode=1;}finally{if(browser)await browser.close();}})();
