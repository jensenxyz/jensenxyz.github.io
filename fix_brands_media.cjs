const fs = require('fs');
let html = fs.readFileSync('scantrust/index.html', 'utf8');

// The mobile media block
html = html.replace('.brands-slideshow-card {\n                padding: 32px 20px;\n                min-height: 200px;\n            }', '');
html = html.replace('.brands-slideshow-card {\n                padding: 32px 20px;\n                min-height: 200px;\n            }', '');

// It looks like `dotsContainer` uses `document.getElementById("brandsProgressDots");` but I replaced the ID, so need to ensure JS matches.
html = html.replace('document.getElementById("brandsProgressDots");', 'document.getElementById("brandsDotsContainer");');

fs.writeFileSync('scantrust/index.html', html);
