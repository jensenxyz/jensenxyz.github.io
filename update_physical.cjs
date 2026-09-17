const fs = require('fs');
let html = fs.readFileSync('scantrust/index.html', 'utf8');

const targetStr = '<section class="scantrust-subsection scantrust-physical-products-section" id="physicalProductsSection">';
const endTargetStr = '<!-- The Impact / Metrics Section -->';

const startIdx = html.indexOf(targetStr);
const endIdx = html.indexOf(endTargetStr, startIdx);

console.log(startIdx, endIdx);
