const fs = require('fs');
let css = fs.readFileSync('scantrust/index.html', 'utf8');

const allowedMontserrat = [
    '.scantrust-story-title',
    '.challenge-title',
    '.platform-card-title',
    '.scantrust-subsection-title',
    '.impact-title',
    '.brands-subsection-title',
    '.exec-summary-title'
];

let lines = css.split('\n');
let currentSelector = '';

for (let i = 0; i < lines.length; i++) {
    // very naive parsing: look for {
    if (lines[i].includes('{')) {
        currentSelector = lines[i].split('{')[0].trim();
    }
    
    if (lines[i].includes("font-family: 'Montserrat', sans-serif;")) {
        let isAllowed = false;
        for (const selector of allowedMontserrat) {
            if (currentSelector.includes(selector)) {
                isAllowed = true;
                break;
            }
        }
        
        if (!isAllowed) {
            lines[i] = lines[i].replace(
                "font-family: 'Montserrat', sans-serif;",
                'font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;'
            );
        }
    }
}

fs.writeFileSync('scantrust/index.html', lines.join('\n'));
console.log('Fixed fonts in scantrust/index.html');
