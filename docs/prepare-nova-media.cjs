const sharp = require('sharp');
const fs = require('node:fs/promises');
(async()=>{
 const manifest=JSON.parse(await fs.readFile('docs/project-image-manifest.json','utf8'));
 for(const [name,file] of [['hero','dashboard-capture.png'],['landing','desktop-capture.png'],['mobile','mobile-capture.png']]){
  const source='public/projects/nova-learning/'+file;
  const output='public/projects/nova-learning/'+name+'.webp';
  const info=await sharp(source).resize({width:1600,withoutEnlargement:true}).webp({quality:88,effort:5}).toFile(output);
  manifest.push({source,output,width:info.width,height:info.height,bytes:info.size});
  if(name==='hero')await sharp(source).resize({width:800}).webp({quality:84}).toFile('public/projects/nova-learning/thumbnail.webp');
 }
 await fs.writeFile('docs/project-image-manifest.json',JSON.stringify(manifest,null,2));
})();
