const fs = require('fs');

fs.copyFileSync('./afterBuild/package.json', './build/package.json');

console.log('package.json copied to build output')