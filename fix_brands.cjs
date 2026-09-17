const fs = require('fs');
let html = fs.readFileSync('scantrust/index.html', 'utf8');

const replacement = `
        .brands-slideshow-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            margin: 0 auto;
            max-width: 900px; /* Max width for desktop */
            width: 100vw;
            margin-left: calc(-50vw + 50%);
            margin-right: calc(-50vw + 50%);
        }
        @media (min-width: 768px) {
            .brands-slideshow-card {
                width: 100%;
                margin-left: auto;
                margin-right: auto;
            }
        }
        .brands-logo-viewport {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            padding-bottom: 24px; /* Space for dots overlay */
        }
        .brand-logo-slide {
            max-width: 90%;
            max-height: 140px;
            object-fit: contain;
            display: none;
            opacity: 0;
            transition: opacity 0.4s ease-in-out;
            margin: 0 auto;
        }
        .brand-logo-slide.active {
            display: block;
            opacity: 1;
        }
        /* Dots Navigation */
        .brands-dots-container {
            position: absolute;
            bottom: 0px;
            left: 0;
            width: 100%;
            display: flex;
            justify-content: center;
            gap: 8px;
            z-index: 10;
        }
        .brand-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.2);
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        .brand-dot.active {
            background-color: rgba(0, 0, 0, 0.8);
        }
`;

// we need to replace the brands-slideshow-card block
const startStr = '.brands-slideshow-card {';
const endStr = '.exec-summary-subsection {'; // right after

let startIdx = html.indexOf(startStr);
let endIdx = html.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
    html = html.substring(0, startIdx) + replacement + '\n        ' + html.substring(endIdx);
    fs.writeFileSync('scantrust/index.html', html);
    console.log('Replaced brands css');
} else {
    console.log('Could not find boundaries');
}
