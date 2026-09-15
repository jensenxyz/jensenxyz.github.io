const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// The regex will find <div class="project-card"> and its contents up to the closing </div>
// Since we have nested divs (project-info), a simple regex is risky. 
// Let's use a replacement function instead.

html = html.replace(/<div class="project-card">([\s\S]*?)<\/div>\s*<\/div>\s*<!-- Project/g, (match) => {
    // wait, this is hard because of the nested </div>
    return match;
});

// A safer way: split by '<!-- Project '
let parts = html.split(/<!-- Project \d: [^>]+ -->/);
// This split gives us the content before the first project, then the content of each project, etc.
// Actually, let's just do it cleanly by replacing exactly what we know.
