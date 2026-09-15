const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The scrollAmount is currently fixed at 410 or something in the script.
// Let's modify the scroll step in the JS to work with the new gaps and width.
// But wait, the current JS dynamically gets width. Let's check it.
let jsMatch = html.match(/const scrollAmount = firstCard \? firstCard.offsetWidth \+ gap : [0-9]+;/g);
console.log(jsMatch);
