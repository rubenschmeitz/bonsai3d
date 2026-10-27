const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {spawn}=require('node:child_process');
const port=18873,base=`http://127.0.0.1:${port}/`,server=spawn('python3',['scripts/preview.py','--port',String(port)]);
let browser,checks=0;function check(v,m){assert(v,m);checks++;}
(async()=>{try{
 for(let i=0;i<100;i++){try{if((await fetch(base)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({headless:true});
 for(const lang of ['nl','en'])for(const width of [390,1440]){
  const page=await browser.newPage({viewport:{width,height:1000}});let posts=0,body='',replyStatus=200,replyBody={ok:true};
  await page.route('**/*',async route=>{const u=route.request().url();
   if(u.includes('/assets/contact-config.js'))return route.fulfill({contentType:'text/javascript',body:"window.BonsaiContactConfig={endpoint:'https://contact.bonsai3d.nl/contact',sitekey:'synthetic'}"});
   if(u.startsWith('https://challenges.cloudflare.com/'))return route.fulfill({contentType:'text/javascript',body:"window.turnstile={render:(selector,options)=>{window.testChallenge=options;options.callback('synthetic');return 'widget'},reset:()=>{window.resetCount=(window.resetCount||0)+1}};window.bonsaiContactReady();"});
   if(u==='https://contact.bonsai3d.nl/contact'){posts++;body=route.request().postData();return route.fulfill({status:replyStatus,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(replyBody)});}
   if(u.startsWith(base))return route.continue();return route.abort();
  });
  await page.goto(base+'maatwerk.html?lang='+lang);await page.locator('#contact-form').waitFor();
  check(await page.locator('h1').count()===1,'One main heading');
  await page.screenshot({path:`.artifacts/contact-initial-${lang}-${width}.png`,fullPage:true});
  const overflow=await page.evaluate(()=>Array.from(document.querySelectorAll('body *')).filter(n=>n.getBoundingClientRect().right>innerWidth+1).map(n=>({tag:n.tagName,class:n.className,w:n.getBoundingClientRect().width})).slice(0,12));
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Page fits viewport: '+JSON.stringify(overflow));
  check(!await page.locator('.custom-calculator').evaluate(n=>n.open),'Calculator optional');
  await page.locator('#contact-name').fill('Synthetic visitor');await page.locator('#contact-email').fill('visitor@example.invalid');await page.locator('#contact-message').fill('Synthetic test message about a custom bonsai stand.');
  await page.locator('[name=privacy]').check();
  const pixel=Buffer.from(await page.evaluate(()=>{const c=document.createElement('canvas');c.width=16;c.height=16;return c.toDataURL('image/png').split(',')[1];}),'base64');
  await page.locator('#contact-photo').setInputFiles({name:'test.png',mimeType:'image/png',buffer:pixel});
  await page.locator('.contact-preview').waitFor({state:'visible'});
  check(await page.locator('.contact-preview img').evaluate(n=>n.naturalWidth>0),'Photo preview decodes');
  await page.screenshot({path:`.artifacts/contact-${lang}-${width}.png`,fullPage:true});
  await page.locator('#contact-send').click();await page.waitForFunction(()=>window.resetCount===1);
  check(posts===1,'Exactly one mocked request');check(body.includes('filename="voorbeeld.jpg"'),'Re-encoded attachment uses neutral filename');check(!body.includes('test.png'),'Original filename not transmitted');
  check(await page.locator('#contact-message').inputValue()==='','Clear only on accepted send');
  check(await page.locator('#contact-send').isDisabled(),'No reused token after send');
  check(!await page.evaluate(()=>JSON.stringify(localStorage).includes('visitor@example.invalid')),'No contact data in local storage');
  await page.locator('#contact-name').fill('Synthetic visitor');await page.locator('#contact-email').fill('visitor@example.invalid');
  await page.locator('#contact-message').fill('This synthetic message must remain after a delivery failure.');
  await page.locator('[name=privacy]').check();
  await page.locator('#contact-photo').setInputFiles({name:'unsafe.svg',mimeType:'image/svg+xml',buffer:Buffer.from('<svg/>')});
  check(await page.locator('.contact-preview').isHidden(),'Unsupported image is rejected');
  replyStatus=503;replyBody={ok:false,error:'delivery_unconfirmed'};
  await page.evaluate(()=>window.testChallenge.callback('synthetic-new'));
  await page.locator('#contact-send').click();await page.waitForFunction(()=>window.resetCount===2);
  check(await page.locator('#contact-message').inputValue()==='This synthetic message must remain after a delivery failure.','Failed delivery preserves draft');
  check((await page.locator('#contact-status').textContent()).includes(lang==='nl'?'niet worden bevestigd':'could not be confirmed'),'Uncertain delivery is explained');
  check(await page.locator('#contact-send').isDisabled(),'Failed delivery still requires a fresh token');
  await page.close();
 }
 console.log(JSON.stringify({passed:true,checks,network:'All email and Turnstile calls mocked; no messages sent'}));
}finally{if(browser)await browser.close();server.kill();}})().catch(e=>{console.error(e);process.exitCode=1;});
