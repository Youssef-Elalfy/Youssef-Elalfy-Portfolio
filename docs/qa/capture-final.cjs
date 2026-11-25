const {chromium}=require('playwright');
const fs=require('node:fs/promises');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3300',{waitUntil:'networkidle'});
 await page.locator('canvas').waitFor();await page.waitForTimeout(3000);
 for(const section of ['portfolio','services','about','contact']){
  await page.locator('#'+section).scrollIntoViewIfNeeded();await page.waitForTimeout(900);
  await page.screenshot({path:'docs/qa/final-'+section+'-1440.png'});
 }
 await page.goto('http://127.0.0.1:3300/projects/nova-learning',{waitUntil:'networkidle'});
 await page.screenshot({path:'docs/qa/final-case-nova.png'});
 await page.setViewportSize({width:390,height:844});
 await page.goto('http://127.0.0.1:3300',{waitUntil:'networkidle'});
 await page.locator('canvas').waitFor();await page.waitForTimeout(2200);await page.evaluate(()=>window.scrollTo(0,330));await page.waitForTimeout(800);
 await page.screenshot({path:'docs/qa/final-mobile-studio.png'});
 await fs.writeFile('docs/qa/visual-capture-results.json',JSON.stringify({errors,viewports:[1440,390],sections:['portfolio','services','about','contact','nova case study','mobile hero stage']},null,2));
 console.log(JSON.stringify({errors}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
