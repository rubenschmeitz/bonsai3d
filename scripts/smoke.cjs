const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const out = path.join(root, '.artifacts'); fs.mkdirSync(out, { recursive: true });
const backend = fs.existsSync(path.join(root, 'server.py'));
const publicRoot = backend ? path.join(root, 'public') : root;
const port = Number(process.env.TEST_PORT || 18851);
const base = `http://127.0.0.1:${port}/`;
const server = spawn(process.env.PYTHON || (process.platform==='win32'?'python':'python3'), backend ? ['server.py', '--port', String(port), '--runtime', path.join(out, 'test-runtime')] : ['scripts/preview.py', '--port', String(port)], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
let log = ''; server.stdout.on('data', x => log += x); server.stderr.on('data', x => log += x);
let browser; const report = { pages: [], errors: [], checks: 0 };
(async () => { try {
  for (let i=0; i<100; i++) { try { const r=await fetch(base); if (r.ok) break; } catch {} if(i===99) throw new Error('Preview failed to start: '+log); await new Promise(r=>setTimeout(r,100)); }
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox','--renderer-process-limit=2'] });
  const page = await browser.newPage();
  // External services are outside the preview test; never submit a real enquiry.
  await page.route('**/*', route => { const url=new URL(route.request().url()); return url.hostname==='127.0.0.1' || ['data:','blob:'].includes(url.protocol) ? route.continue() : route.fulfill({status:200,contentType:'application/json',body:'[]'}); });
  page.on('pageerror', e => report.errors.push(e.message));
  page.on('response', r => { if (r.url().startsWith(base) && r.status()>=400) report.errors.push(`${r.status()} ${r.url()}`); });
  let urls=fs.readdirSync(publicRoot).filter(x=>x.endsWith('.html'));
  if (backend) urls=['yori3d/','bonsai3d/','atelier/','brief.html','brandboard.html'];
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({width,height:900});
    for (const url of urls) {
      const response=await page.goto(base+url, {waitUntil:'networkidle'});
      assert(response.ok(), `HTTP ${response.status()} ${url}`); report.checks++;
      assert((await page.title()).trim(), `Missing title: ${url}`); report.checks++;
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1 ? [...document.querySelectorAll('body *')].filter(el=>el.getBoundingClientRect().right>innerWidth+1).slice(0,10).map(el=>({tag:el.tagName,cls:el.className,right:el.getBoundingClientRect().right,text:el.textContent.slice(0,90)})) : []);
      if(overflow.length)await page.screenshot({path:path.join(out,'overflow-'+width+'-'+url+'.png'),fullPage:true});
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1), `No horizontal overflow at ${width}px: ${url}: ${JSON.stringify(overflow)}`); report.checks++;
      await page.evaluate(async()=> { for (const img of document.images) img.loading='eager'; await Promise.all([...document.images].filter(x=>x.src).map(x=>x.decode().catch(()=>{}))); });
      const broken=await page.evaluate(()=>[...document.images].filter(i=>i.src && !i.naturalWidth).map(i=>i.src));
      assert.deepEqual(broken, [], `Broken images on ${url}`); report.checks++;
      if (await page.locator('.interest-banner').count()) {assert(!/overige objecten op aanvraag|other objects on enquiry/i.test(await page.locator('body').innerText()),'No old sales availability text '+url);report.checks++;assert(await page.locator('.interest-banner').isVisible(),'Interest phase on '+url);report.checks++;}
      if (await page.locator('footer .business-status').count()) { assert(await page.locator('footer .business-status').isVisible(), 'Preparation status visible '+url); report.checks++; }
      if (['service.html','privacy.html'].includes(url)) { assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1), 'No overflow '+url); report.checks++; await page.screenshot({path:path.join(out, `${width}-${url.replace(/[^a-z0-9]/gi,'-')}.png`),fullPage:true}); }
      if (url==='index.html' || url==='bonsai3d/' || url==='yori3d/' || url==='galerij.html') await page.screenshot({path:path.join(out, `${width}-${url.replace(/[^a-z0-9]/gi,'-')}.png`),fullPage:true});
      report.pages.push({width,url});
    }
  }
  if (fs.existsSync(path.join(publicRoot,'assets','business-config.json'))) {
    const interestOnly=JSON.parse(fs.readFileSync(path.join(publicRoot,'assets','business-config.json'),'utf8')).status==='interest';
    const writes=[]; page.on('request', r=> { if(!['GET','HEAD'].includes(r.method())) writes.push(r.method()+' '+r.url()); });
    function checked(value,message){assert.ok(value,message);report.checks++;}
    for(const lang of ['nl','en']) {
      await page.goto(base+'service.html?lang='+lang+'&style=wood',{waitUntil:'networkidle'});
      checked(await page.locator('footer a[data-page=privacy]').count()===1,'Privacy link available');
      if(interestOnly){checked(await page.locator('.interest-explanation').count()===1,'One concise explanation on service');checked(await page.locator('.interest-banner,footer .business-status').count()===0,'No repeated survey notices');}else checked(await page.locator('#retour').count()===1,'Returns information reachable');
      checked((await page.locator('.business-status').first().textContent()).includes(interestOnly?(lang==='nl'?'Interessepeiling':'Interest survey'):(lang==='nl'?'voorbereiding':'preparation')),'Preparation status visible');
      await page.goto(base+'maatwerk.html?lang='+lang+'&style=wood',{waitUntil:'networkidle'});
      await page.locator('.custom-calculator > summary').click();
      await page.locator('#quote-enquiry').click();
      checked(await page.locator('#inquiry-dialog').evaluate(d=>d.open),'Custom estimate opens draft');
      checked(await page.locator('#inquiry-form input[name=name]').evaluate(input=>!input.required),'Name optional for local draft');
      checked(await page.locator('#inquiry-form input[name=email]').evaluate(input=>!input.required),'Email optional for local draft');
      await page.locator('#selection-items [name=quantity]').first().fill('2');await page.locator('#selection-items [name=quantity]').first().press('Tab');
      checked(await page.locator('#selection-items [name=quantity]').first().inputValue()==='2','Structured custom cart quantity editable');
      await page.locator('#selection-items [name=finish]').first().selectOption('grey');checked(await page.locator('#selection-items [name=finish]').first().inputValue()==='grey','Cart finish editable');
      if(interestOnly) {
        checked(await page.locator('#inquiry-form input[name=name]').isHidden(),'No contact details requested');
        checked(await page.locator('#inquiry-form select[name=delivery]').isHidden(),'No shipping choice in survey');
        checked((await page.locator('#inquiry-title').textContent()).includes(lang==='nl'?'spreekt':'appeals'),'Interest language in dialog');
        await page.locator('.interest-options summary').click();
        await page.locator('[name=interestLevel]').selectOption('interested');
        await page.locator('[name=budget]').fill('45');
      } else await page.locator('#inquiry-form select[name=delivery]').selectOption('shipping');
      await page.locator('#inquiry-form button[type=submit]').click();
      let draft=await page.locator('#request-text').textContent();
      if(interestOnly){checked(draft.includes(lang==='nl'?'Mijn selectie voor BONSAI3D':'My selection for BONSAI3D'),'Export describes a selection');checked(draft.includes(lang==='nl'?'niet verstuurd':'not been sent'),'Export has not been submitted');}else checked(draft.includes(lang==='nl'?'geen bestelling':'not an order'),'Draft cannot imply an order');
      if(interestOnly) {
        checked(draft.includes(lang==='nl'?'Dit spreekt mij aan':'This appeals to me'),'Interest level exported');
        checked(draft.includes('45'),'Suggested price exported');
        checked(!draft.includes(lang==='nl'?'Leveringsvoorkeur':'Delivery preference'),'No delivery contract in feedback');
        checked(!draft.includes(lang==='nl'?'Naam':'Name'),'No contact details in feedback');
      } else checked(draft.includes(lang==='nl'?'Verzending bespreken':'Discuss delivery'),'Delivery preference exported');
      if(!interestOnly)checked(draft.includes(lang==='nl'?'Nog niet ingevuld':'Not yet entered'),'Blank contact fields supported');
      if(interestOnly)await page.locator('[name=budget]').fill('50');
      else await page.locator('#inquiry-form input[name=name]').fill('Testklant');
      checked(await page.locator('.request-output').isHidden(),'Editing invalidates previous draft');
      if(!interestOnly)await page.locator('#inquiry-form input[name=email]').fill('voorbeeld@example.invalid');
      await page.locator('#inquiry-form textarea[name=idea]').fill('Synthetisch testidee, geen echte aanvraag.');
      await page.locator('#inquiry-form button[type=submit]').click();
      const event=page.waitForEvent('download');await page.locator('#download-request').click();
      const download=await event;const file=path.join(out,'draft-'+lang+'.txt');await download.saveAs(file);
      checked(fs.readFileSync(file,'utf8').includes(interestOnly?'Synthetisch testidee':'voorbeeld@example.invalid'),'Download includes explicitly entered feedback');
      checked(!(await page.evaluate(()=>Object.values(localStorage).join(' '))).includes(interestOnly?'Synthetisch testidee':'voorbeeld@example.invalid'),'Feedback/contact details not stored in browser preferences');
      if(interestOnly){
        checked(!/winkelwagen|add to cart/i.test(await page.locator('body').innerText()),'No cart sales language visible');
        checked(await page.locator('.cart-shipping').count()===0,'No shipping subtotal in survey');
      }
      await page.screenshot({path:path.join(out,'draft-'+lang+'.png')});
      await page.locator('#inquiry-dialog .dialog-close').click();
    }
    await page.goto(base+'privacy.html?lang=nl',{waitUntil:'networkidle'});
    await page.evaluate(()=>{for(const key of ['bonsai3d-selection','loof3d-selection','tak-selection','tak-en-vorm-selection'])localStorage.setItem(key,JSON.stringify([{id:'bonsai-classic-table',finish:'black',quantity:1}]));localStorage.setItem('unrelated-preference','keep');});
    await page.reload({waitUntil:'networkidle'});
    checked(await page.locator('.selection-toggle .count').textContent()==='1','Existing selection restored');
    await page.locator('#clear-site-data').click();
    checked(await page.locator('.selection-toggle .count').textContent()==='0','Cleared selection reflected immediately');
    checked(await page.evaluate(()=>['ruben-shop-language','bonsai3d-style','bonsai3d-selection','bonsai3d-custom','loof3d-selection','tak-selection','tak-en-vorm-selection'].every(k=>localStorage.getItem(k)===null)),'Current and legacy preferences removed');
    checked(await page.evaluate(()=>localStorage.getItem('unrelated-preference'))==='keep','Unrelated browser data preserved');
    checked((await page.locator('#privacy-status').textContent()).includes('gewist'),'Clear confirmation visible');
    checked(writes.length===0,'No enquiry/order/return sent by site');
    report.businessPreparation={status:'passed',contactFields:'optional',export:'local only',privacyClear:'current and legacy keys',networkWrites:writes};
  }
  assert.deepEqual(report.errors, [], 'Browser errors'); report.checks++; report.status='passed';
} catch(e) { report.status='failed'; report.failure=e.stack; process.exitCode=1; }
finally { if(browser) await browser.close(); server.kill(); fs.writeFileSync(path.join(out,'server.log'),log); fs.writeFileSync(path.join(out,'smoke.json'),JSON.stringify(report,null,2)); console.log(JSON.stringify({status:report.status,checks:report.checks,pages:report.pages.length,errors:report.errors,failure:report.failure,report:path.join(out,'smoke.json')},null,2)); }
})();
