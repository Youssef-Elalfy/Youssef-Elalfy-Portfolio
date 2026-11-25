const fs = require('node:fs');
const sharp = require('sharp');
(async()=>{
 let data=fs.readFileSync('data/projects.ts','utf8');
 for(const slug of ['ai-labs','soleuxe','sakeena']) {
  const source='/images/projects/'+slug+'-showcase.png';
  const metadata=await sharp('public'+source).metadata();
  const line=data.split('\n').find(line=>line.includes("src: '"+source+"'"));
  if(line) data=data.replace(line,line.replace(/width: \d+, height: \d+/,`width: ${metadata.width}, height: ${metadata.height}`));
 }
 fs.writeFileSync('data/projects.ts',data);
})();
