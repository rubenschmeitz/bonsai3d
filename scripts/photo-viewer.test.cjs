const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {spawn} = require('node:child_process');
const root = path.resolve(__dirname, '..'), out = path.join(root, '.artifacts');
const port = Number(process.env.PHOTO_TEST_PORT || 18859), base = `http://127.0.0.1:${port}/`;
const server = spawn('python3', ['scripts/preview.py','--port',String(port)], {cwd:root, stdio:'ignore'});
let browser, checks = 0; const errors = [];
function ok(value, message) { assert(value, message); checks++; }
(async()=>{try {
  for(let i=0;i<100;i++){try{if((await fetch(base)).ok)break;}catch{} if(i===99)throw new Error('Preview did not start');await new Promise(r=>setTimeout(r,100));}
  browser = await chromium.launch({headless:true,args:['--no-sandbox']});
  for(const lang of ['nl','en']) for(const width of [320,390,768,1440]) {
    const page = await browser.newPage({viewport:{width,height:1000}});
    page.on('pageerror', e=>errors.push(e.message));
    await page.goto(`${base}collectie.html?lang=${lang}&product=bonsai-oval-jita&finish=wood`);
    await page.locator('#product-dialog[open]').waitFor();
    const total=await page.locator('[data-image-index]').count();
    ok(total>=2,'Product and arrangement photographs are available');
    ok(await page.locator('[data-image-index]:visible').count()===Math.min(4,total),'At most four previews visible');
    if(lang==='nl' && [390,1440].includes(width)) await page.screenshot({path:path.join(out,`product-gallery-${width===390?'mobile':'desktop'}.jpg`)});
    const sources=await page.locator('[data-image-index] img').evaluateAll(nodes=>nodes.map(n=>n.src));
    await page.locator('.product-photo-enlarge').click();
    await page.locator('#photo-viewer[open]').waitFor();
    ok(await page.locator('#product-dialog').evaluate(n=>n.open),'Product remains open behind viewer');
    await page.locator('[data-viewer-action=in]').click();
    ok(await page.locator('[data-viewer-action=fit]').innerText()==='150%','Zoom control works');
    await page.keyboard.press('0');
    ok(await page.locator('[data-viewer-action=fit]').innerText()==='100%','Fit shortcut works');
    await page.locator('.photo-viewer-stage').dblclick();
    ok(await page.locator('[data-viewer-action=fit]').innerText()==='200%','Double click zooms');
    await page.keyboard.press('ArrowRight');
    ok(await page.locator('.photo-viewer-count').innerText()===`2 / ${total}`,'Keyboard photo navigation works');
    ok(await page.locator('.photo-viewer-stage img').evaluate(n=>n.src)===sources[1],'Full image matches second preview');
    await page.locator('[data-viewer-step="-1"]').click();
    ok(await page.locator('.photo-viewer-count').innerText()===`1 / ${total}`,'Previous photo control works');
    await page.keyboard.press('ArrowLeft');
    ok(await page.locator('.photo-viewer-count').innerText()===`${total} / ${total}`,'Gallery wraps to last photograph');
    await page.keyboard.press('Escape');
    ok(await page.locator('#photo-viewer').evaluate(n=>!n.open),'Escape closes enlargement only');
    ok(await page.locator('#product-dialog').evaluate(n=>n.open),'Escape preserves product details');
    ok(await page.locator('.product-photo-enlarge').evaluate(n=>n===document.activeElement),'Focus returns to enlarged photograph');
    ok(await page.locator('.gallery-count').innerText()===`${total} / ${total}`,'Underlying gallery follows viewer');
    if(total>4) {
      await page.locator('.gallery-step').last().click();
      ok(await page.locator('.gallery-count').innerText()===`1 / ${total}`,'Compact row reaches all photographs');
    } else {
      ok(await page.locator('.gallery-step:visible').count()===0,'Short galleries need no extra row controls');
    }
    await page.locator('select[name=finish]').selectOption('black');
    await page.locator('.product-photo-enlarge').click();
    ok((await page.locator('.photo-viewer-stage img').getAttribute('src')).includes('black'),'Finish changes refresh viewer');
    if(width===390&&lang==='nl') await page.screenshot({path:path.join(out,'photo-viewer-mobile.jpg')});
    await page.locator('[data-viewer-action=close]').click();
    await page.keyboard.press('Escape');
    await page.goto(`${base}index.html?lang=${lang}`);
    await page.locator('.home-gallery-image').first().click();
    ok(await page.locator('#photo-viewer').evaluate(n=>n.open),'Homepage photograph enlarges directly');
    await page.keyboard.press('Tab');
    ok(await page.locator('#photo-viewer').evaluate(n=>n.contains(document.activeElement)),'Focus stays inside modal');
    await page.locator('[data-viewer-step="1"]').click();
    ok((await page.locator('.photo-viewer-count').innerText()).startsWith('2 /'),'Homepage images can be browsed');
    if(width===1440&&lang==='nl') await page.screenshot({path:path.join(out,'photo-viewer-desktop.jpg')});
    ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No page overflow');
    await page.keyboard.press('Escape');
    ok(!await page.locator('html').evaluate(n=>n.classList.contains('photo-viewer-open')),'Scroll lock removed on close');
    await page.close();
  }
  // A test-only long gallery keeps overflow navigation covered as photo selections change.
  const long=await browser.newPage({viewport:{width:390,height:844}});
  await long.route('**/catalogue.json*',async route=>{
    const fixture=JSON.parse(fs.readFileSync(path.join(root,'assets/catalogue.json'),'utf8'));
    const jita=fixture.bonsai.products.find(p=>p.id==='bonsai-oval-jita');
    jita.gallery.push(...fixture.bonsai.products.find(p=>p.id==='bonsai-classic-table').gallery);
    await route.fulfill({json:fixture});
  });
  await long.goto(base+'collectie.html?product=bonsai-oval-jita&finish=wood');
  await long.locator('#product-dialog[open]').waitFor();
  const longTotal=await long.locator('[data-image-index]').count();
  ok(longTotal>4,'Long-gallery fixture exercises overflow');
  ok(await long.locator('[data-image-index]:visible').count()===4,'Long gallery still shows only four previews');
  for(let i=0;i<longTotal-1;i++)await long.locator('.gallery-step').last().click();
  ok(await long.locator('.gallery-count').innerText()===`${longTotal} / ${longTotal}`,'Compact arrows reach the last photograph');
  await long.locator('.gallery-step').last().click();
  ok(await long.locator('.gallery-count').innerText()===`1 / ${longTotal}`,'Compact arrows wrap to the first photograph');
  await long.close();
  const touch=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  touch.on('pageerror', e=>errors.push(e.message));
  await touch.goto(base+'index.html'); await touch.locator('.home-gallery-image').first().click();
  const stage=touch.locator('.photo-viewer-stage'),box=await stage.boundingBox();
  const cy=box.y+box.height/2;
  const client=await touch.context().newCDPSession(touch);
  await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:260,y:cy,id:1}]});
  await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:100,y:cy,id:1}]});
  await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  ok((await touch.locator('.photo-viewer-count').innerText()).startsWith('2 /'),'Touch swipe moves to next photograph');
  await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:150,y:cy,id:2},{x:250,y:cy,id:3}]});
  await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:150,y:cy,id:2},{x:350,y:cy,id:3}]});
  await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  ok(await touch.locator('[data-viewer-action=fit]').innerText()==='200%','Two-pointer pinch zooms');
  await touch.close(); ok(!errors.length,errors.join('\n'));
  fs.writeFileSync(path.join(out,'photo-viewer-tests.json'),JSON.stringify({passed:true,checks,errors},null,2));
  console.log(JSON.stringify({passed:true,checks,errors}));
}finally{if(browser)await browser.close();server.kill();}})().catch(e=>{console.error(e,errors);process.exitCode=1;});
