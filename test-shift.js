const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
// check if there are 7 project cards
console.log(html.match(/class="project-card"/g).length);
