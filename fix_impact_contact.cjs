const fs = require('fs');
let html = fs.readFileSync('scantrust/index.html', 'utf8');

// Fix impact > characters
html = html.replace(/&gt;\s*More than/g, 'More than');
html = html.replace(/&gt;\s*Scantrust codes/g, 'Scantrust codes');
html = html.replace(/&gt;\s*80\+ projects/g, '80+ projects');

// Fix contact padding and alignment
const oldContact = `<section id="contact" class="contact-section scantrust-contact-section bg-white text-center">
            <div class="container">
                <h2 class="section-title text-left">Contact Me:</h2>`;
const newContact = `<section id="contact" class="contact-section scantrust-contact-section text-center">
            <div>
                <h2 class="section-title text-left" style="margin-left: 0;">Contact Me:</h2>`;

html = html.replace(oldContact, newContact);

// Also fix in style.css the scantrust-contact-section padding
