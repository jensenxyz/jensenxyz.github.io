const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
console.log(html.match(/class="project-card"/g).length);
