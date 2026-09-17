const fs = require('fs');

const labels = [
    { num: 1, title: 'WWF Gifts', subtitle: 'Traceable Security Label For Authenticity' },
    { num: 2, title: 'Wine Label', subtitle: 'Multiple Secure Features Built-In' },
    { num: 3, title: 'Coffee Beans', subtitle: 'Fair Trade And Sustainability' },
    { num: 4, title: 'Vorsteiner Luxury Wheels', subtitle: 'Authentication For Personalized Wheels' },
    { num: 5, title: 'Zippo One Label™', subtitle: 'Limited Edition Zippo Lighter' },
    { num: 6, title: 'Zippo One Label™', subtitle: 'Design Variant Under UV Light' },
    { num: 7, title: 'WWF Gifts', subtitle: 'Unique Label Design' },
    { num: 8, title: 'Middle School Textbooks', subtitle: 'Oxford University Press Pakistan' },
    { num: 9, title: 'Covid-19 Response', subtitle: 'Rapid Test Kit' },
    { num: 10, title: 'Genuine Medications', subtitle: 'Pharma-Tech In Nigeria' },
    { num: 11, title: 'Medical Gloves', subtitle: 'High-Performance During Pandemic' },
    { num: 12, title: 'DuPont Water Filters', subtitle: 'Residential & Industrial Product Lines' },
    { num: 13, title: 'TASA Fishmeal', subtitle: 'Quality Certificate' },
    { num: 14, title: 'Inspection Certificate', subtitle: 'SGS Singapore & APAC' }
];

let labelsHtml = `<div class="labels-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; margin-top: 20px;">`;
for (const l of labels) {
    labelsHtml += `
        <div class="label-card" style="border: 1px solid rgba(0,0,0,0.1); border-radius: 16px; overflow: hidden; background: #FFF;">
            <img src="/assets/scantrust/label-designs-${l.num}.jpg" alt="${l.title}" style="width: 100%; height: auto; display: block;" loading="lazy">
            <div style="padding: 16px;">
                <h4 style="margin: 0 0 4px 0; font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; font-size: 1.05rem; font-weight: 700; color: #111827;">${l.title}</h4>
                <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 400; color: #4B5563;">${l.subtitle}</p>
            </div>
        </div>`;
}
labelsHtml += `</div>`;

// Now let's fetch index.html and update the physicalProductsSection entirely.
let html = fs.readFileSync('scantrust/index.html', 'utf8');

const targetStr = '<section class="scantrust-subsection scantrust-physical-products-section" id="physicalProductsSection">';
const endTargetStr = '<!-- The Impact / Metrics Section -->';

const startIdx = html.indexOf(targetStr);
const endIdx = html.indexOf(endTargetStr, startIdx);

const replacement = `
            <section class="scantrust-subsection scantrust-physical-products-section" id="physicalProductsSection">
                <h2 class="scantrust-subsection-title">3. Physical Products</h2>
                
                <p class="scantrust-intro-text">
                    Scantrust’s physical products are the printed Secure QR codes, which are essential catalysts connecting tangible goods to Scantrust's digital platform, enabling a range of solutions from authentication and traceability to compliance and customer engagement.
                </p>
                <p class="scantrust-intro-text" style="margin-top: 14px; margin-bottom: 32px;">
                    I designed a wide range of Security Labels, i.e. Anti-Counterfeit Labels, which feature technologies such as the ScanTrust Secure QR codes to prevent fakes and ensure product integrity.
                </p>

                <hr class="physical-thin-divider">

                <details class="physical-expandable" id="antiCounterfeitExpandable">
                    <summary class="physical-expandable-summary" style="display: flex; align-items: center; cursor: pointer; list-style: none; padding: 16px 0;">
                        <span class="icon" style="font-weight: 900; font-size: 1.4rem; font-family: monospace; margin-right: 12px; width: 24px; text-align: center;">+</span>
                        <span class="expandable-heading-text">Anti-counterfeit Technologies</span>
                    </summary>
                    <div class="physical-expandable-content" style="padding: 0 0 20px 36px;">
                        <p class="physical-tech-intro">
                            I’ve experience designing and working with these Anti-counterfeit Technologies:
                        </p>
                        <ol class="physical-tech-list">
                            <li>Holograms</li>
                            <li>Tamper-evident features (“void”, self-destructing)</li>
                            <li>Special inks and printing (heat, UV, infrared)</li>
                            <li>Serialized barcodes or QR codes (tracking, tracing, individual product authentication)</li>
                            <li>RFID/NFC tags/chips</li>
                            <li>Micro-text or nano-text</li>
                        </ol>
                    </div>
                </details>

                <hr class="physical-thin-divider">

                <details class="physical-expandable" id="securityLabelsExpandable">
                    <summary class="physical-expandable-summary" style="display: flex; align-items: center; cursor: pointer; list-style: none; padding: 16px 0;">
                        <span class="icon" style="font-weight: 900; font-size: 1.4rem; font-family: monospace; margin-right: 12px; width: 24px; text-align: center;">+</span>
                        <span class="expandable-heading-text">State-of-the-art Security Labels</span>
                    </summary>
                    <div class="physical-expandable-content" style="padding: 0 0 20px 36px;">
                        ${labelsHtml}
                    </div>
                </details>

                <hr class="physical-thin-divider">
            </section>
            
            `;

html = html.substring(0, startIdx) + replacement + html.substring(endIdx);

fs.writeFileSync('scantrust/index.html', html);
console.log('Replaced successfully');
