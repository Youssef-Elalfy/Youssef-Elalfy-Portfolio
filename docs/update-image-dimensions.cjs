const fs = require('node:fs');
const manifest = JSON.parse(fs.readFileSync('docs/project-image-manifest.json'));
let data = fs.readFileSync('data/projects.ts','utf8');
for (const item of manifest) {
 const src = '/'+item.output.replace('public/','');
 const line = data.split('\n').find(line=>line.includes("src: '"+src+"'"));
 if(line) data = data.replace(line,line.replace(/width: \d+, height: \d+/,`width: ${item.width}, height: ${item.height}`));
}
fs.writeFileSync('data/projects.ts',data);
console.log('Updated gallery dimensions from Sharp metadata');
