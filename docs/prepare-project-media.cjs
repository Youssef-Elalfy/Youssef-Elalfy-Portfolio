const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
const base = 'D:/My Works/Projects_Websites/';
const uni = 'D:/My Works/UniFlow_Behance_Full_Case_Study_2026/UniFlow_Behance_Editorial_2026/assets/';
const entries = [
 ['sayntra/hero', base+'sayntra/frontend/test-results/story/en-1440-stage1.png'],
 ['sayntra/story', base+'sayntra/frontend/test-results/story/en-1440-stage4.png'],
 ['sayntra/mobile', base+'sayntra/frontend/test-results/story/ar-390-stage1.png'],
 ['uniflow/hero',uni+'dashboard.webp'], ['uniflow/courses',uni+'courses.webp'], ['uniflow/schedule',uni+'schedule.webp'],
 ['uniflow/desktop','public/projects/uniflow/desktop-capture.png'], ['uniflow/mobile','public/projects/uniflow/mobile-capture.png'],
 ['merchantflow/hero',base+'MerchantFlow_Real_Screenshots_For_Mohimtak/01_Real_Workspace_Dashboard.png'],
 ['merchantflow/storefront',base+'MerchantFlow_Real_Screenshots_For_Mohimtak/03_Noura_Fashion_Storefront.png'],
 ['merchantflow/desktop','public/projects/merchantflow/desktop-capture.png'], ['merchantflow/mobile','public/projects/merchantflow/mobile-capture.png'],
 ['bella-tavola/hero','public/projects/bella-tavola/desktop-capture.png'],
 ['bella-tavola/menu',base+'Bella_Tavola_Real_Screenshots_For_Mohimtak/03_Interactive_Menu.png'],
 ['bella-tavola/mobile','public/projects/bella-tavola/mobile-capture.png'],
];
(async()=>{
 let results=[];
 for(const [name,source] of entries){
  const output='public/projects/'+name+'.webp';
  await fs.mkdir(path.dirname(output),{recursive:true});
  const info = await sharp(source).resize({width:1600,withoutEnlargement:true}).webp({quality:88,effort:5}).toFile(output);
  results.push({source,output,width:info.width,height:info.height,bytes:info.size});
  if(name.endsWith('/hero')) await sharp(source).resize({width:800,withoutEnlargement:true}).webp({quality:84}).toFile('public/projects/'+name.replace('/hero','/thumbnail')+'.webp');
 }
 await fs.writeFile('docs/project-image-manifest.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results.map(({output,width,height,bytes})=>({output,width,height,bytes})),null,2));
})();
