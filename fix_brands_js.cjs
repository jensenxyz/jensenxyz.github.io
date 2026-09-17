const fs = require('fs');
let html = fs.readFileSync('scantrust/index.html', 'utf8');

// Replace dots container id
html = html.replace('id="brandsProgressDots"', 'id="brandsDotsContainer"');
html = html.replace('class="brands-progress-dots"', 'class="brands-dots-container"');

// Fix the js
const jsOld = `            const dotsContainer = document.getElementById('brandsProgressDots');`;
const jsNew = `            const dotsContainer = document.getElementById('brandsDotsContainer');`;
html = html.replace(jsOld, jsNew);

const dotDot = `dot.classList.add('brand-dot');`; // it already used brand-dot? let's check
fs.writeFileSync('scantrust/index.html', html);
