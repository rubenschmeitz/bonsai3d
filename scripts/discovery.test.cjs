const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {spawn} = require('node:child_process');
const {chromium} = require('playwright');
const root = path.resolve(__dirname, '..');
const out = path.join(root, '.artifacts');
const port = Number(process.env.DISCOVERY_TEST_PORT || 18863);
let checks = 0, browser;
const errors = [];
const consoleErrors = [];
function check(value, message) { assert(value, message); checks++; }
const code = fs.readFileSync(path.join(root, 'assets/site-discovery.js'), 'utf8');
const paths = ['index.html','collectie.html','atelier.html','maatwerk.html','service.html','privacy.html'];
for (const name of paths) {
  const text = fs.readFileSync(path.join(root, name), 'utf8');
  const url = 'https://bonsai3d.nl/' + (name === 'index.html' ? '' : name);
  check(text.includes(`rel="canonical" href="${url}"`), name + ' has its own canonical');
  check(text.includes(name === 'privacy.html' ? 'content="noindex,follow"' : 'content="index,follow,max-image-preview:large"'), 'Intended indexing: ' + name);
  check((text.match(/rel="canonical"/g) || []).length === 1, 'Only one canonical: ' + name);
}
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
check((sitemap.match(/<loc>/g) || []).length === 5, 'Sitemap has five content pages');
check([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].every(match => !/privacy|afwerkingen|\?/.test(match[1])), 'No excluded or filtered URLs in sitemap');
check(fs.readFileSync(path.join(root, 'robots.txt'), 'utf8').includes('Sitemap: https://bonsai3d.nl/sitemap.xml'), 'Robots declares sitemap');

function simulate(options) {
  const injected = [];
  const context = {
    window: {BonsaiSiteConfig: {cloudflareToken: options.token}},
    location: {hostname: options.host || 'bonsai3d.nl', protocol: options.protocol || 'https:'},
    navigator: {doNotTrack: options.dnt, globalPrivacyControl: options.gpc},
    document: {head: {appendChild: node => injected.push(node)}, createElement: () => ({setAttribute(k,v) {this[k] = v;}})}
  };
  vm.runInNewContext(code, context);
  return {context, injected};
}
const token = '0123456789abcdef0123456789abcdef';
for (const options of [{token:null}, {token:'invalid'}, {token,host:'127.0.0.1'},
  {token,host:'rubenschmeitz.github.io'}, {token,protocol:'http:'}, {token,dnt:'1'}, {token,gpc:true}]) {
  check(simulate(options).injected.length === 0, 'Analytics is disabled for ' + JSON.stringify(options));
}
const enabled = simulate({token});
check(enabled.injected.length === 1, 'Valid production token loads one beacon');
check(enabled.injected[0].src === 'https://static.cloudflareinsights.com/beacon.min.js', 'Only the expected analytics endpoint is loaded');
check(JSON.parse(enabled.injected[0]['data-cf-beacon']).token === token, 'Public measurement token passed to beacon');
check(simulate({token,host:'www.bonsai3d.nl'}).injected.length === 1, 'www is covered');

const server = spawn(process.env.PYTHON || 'python3', ['scripts/preview.py','--port',String(port)], {cwd:root,stdio:'ignore'});
(async () => { try {
  for (let i=0;i<100;i++) {try {if ((await fetch(`http://127.0.0.1:${port}/`)).ok) break;} catch {} if(i===99) throw Error('Preview did not start'); await new Promise(r=>setTimeout(r,100));}
  browser = await chromium.launch({headless:true});
  const page = await browser.newPage();
  const external = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {if (message.type() === 'error') consoleErrors.push(message.text());});
  await page.route('**/*', route => {
    if (new URL(route.request().url()).hostname === '127.0.0.1') return route.continue();
    external.push(route.request().url()); return route.abort();
  });
  for (const name of paths) for (const lang of ['nl','en']) {
    await page.goto(`http://127.0.0.1:${port}/${name}?lang=${lang}`, {waitUntil:'networkidle'});
    await page.locator('#main').waitFor({state:'attached'});
    check((await page.title()).endsWith('| BONSAI3D'), 'Discovery title survives app rendering');
    check(await page.locator('meta[property="og:title"]').getAttribute('content') === await page.title(), 'Social title follows page language');
    check((await page.locator('meta[name="description"]').getAttribute('content')).length > 70, 'Page-specific description survives rendering');
    check(await page.locator('link[rel="canonical"]').getAttribute('href') === 'https://bonsai3d.nl/' + (name === 'index.html' ? '' : name), 'Canonical never picks up query parameters');
    if (name === 'privacy.html') check((await page.locator('body').innerText()).includes(lang==='nl'?'staat hier nog uit':'currently disabled here'), 'Privacy accurately describes disabled measurement');
  }
  check(external.length === 0, 'Unconfigured site makes no external analytics requests');
  check(errors.length === 0, 'No browser exceptions');
  fs.mkdirSync(out, {recursive:true});
  const report = {status:'passed',checks,errors,external_requests:external};
  fs.writeFileSync(path.join(out,'discovery-tests.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));
} catch(error) {console.error(error.stack); console.error(JSON.stringify({errors,consoleErrors,url:browser?.contexts()[0]?.pages()[0]?.url()})); process.exitCode=1;}
finally {if(browser) await browser.close(); server.kill();} })();
