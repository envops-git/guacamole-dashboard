const fs = require('fs');

fs.copyFileSync('./afterBuild/package.json', './build/package.json');
