const fs = require('fs');
let html = fs.readFileSync('scantrust/index.html', 'utf8');

const targetStr = '<h2 class="scantrust-subsection-title">2. Digital Products</h2>';
const startIdx = html.indexOf(targetStr);
const endIdx = html.indexOf('<!-- Carousel Controls -->', startIdx);

const newHTML = `<h2 class="scantrust-subsection-title">2. Digital Products</h2>
                
                <p class="scantrust-intro-text">
                    I led the end-to-end UI and UX design for the entire Scantrust web and mobile systems, including the Customer Login Portal (B2B), white-label software, windows application for industrial use, and the core digital products/offering listed below:
                </p>

                <div class="carousel-wrapper">
                    <div class="carousel-container" id="digital-products-carousel">
                        <!-- Project 1: Enterprise QR Code Generator -->
                        <div class="project-card">
                            <img src="/assets/scantrust/qr-manager.png" alt="Enterprise QR Code Generator" width="800" height="500" loading="lazy">
                            <div class="project-info">
                                <h3>Enterprise QR Code Generator</h3>
                                <ul style="font-weight: 400; padding-left: 20px; list-style-type: disc; margin: 0; color: #4B5563; font-size: 0.94rem; line-height: 1.62;">
                                    <li>Built-in intelligent redirection engine.</li>
                                    <li>Non-coding environment.</li>
                                </ul>
                            </div>
                        </div>

                        <!-- Project 2: QR Code Landing Page Builder -->
                        <div class="project-card">
                            <img src="/assets/scantrust/no-code-lp-builder.png" alt="QR Code Landing Page Builder" width="800" height="500" loading="lazy">
                            <div class="project-info">
                                <h3>QR Code Landing Page Builder</h3>
                                <ul style="font-weight: 400; padding-left: 20px; list-style-type: disc; margin: 0; color: #4B5563; font-size: 0.94rem; line-height: 1.62;">
                                    <li>No-code tools designed for enterprise.</li>
                                    <li>Scalable landing page designs.</li>
                                </ul>
                            </div>
                        </div>

                        <!-- Project 3: Branded Mobile Apps -->
                        <div class="project-card">
                            <img src="/assets/scantrust/remy-martin-auth.png" alt="Branded Mobile Apps" width="800" height="500" loading="lazy">
                            <div class="project-info">
                                <h3>Branded Mobile Apps</h3>
                                <ul style="font-weight: 400; padding-left: 20px; list-style-type: disc; margin: 0; color: #4B5563; font-size: 0.94rem; line-height: 1.62;">
                                    <li>iOS, Android, Web PWA.</li>
                                    <li>Product authentication.</li>
                                    <li>Loyalty modules, multi-national.</li>
                                </ul>
                            </div>
                        </div>

                        <!-- Project 4: Supply Chain Workflow App -->
                        <div class="project-card">
                            <img src="/assets/scantrust/traceability-dashboard.png" alt="Supply Chain Workflow App" width="800" height="500" loading="lazy">
                            <div class="project-info">
                                <h3>Supply Chain Workflow App</h3>
                                <ul style="font-weight: 400; padding-left: 20px; list-style-type: disc; margin: 0; color: #4B5563; font-size: 0.94rem; line-height: 1.62;">
                                    <li>Batch Scan/NFC UX</li>
                                    <li>Parent-child Code Association</li>
                                    <li>Task Management</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    `;

const oldHTML = html.substring(startIdx, endIdx);
html = html.replace(oldHTML, newHTML);
fs.writeFileSync('scantrust/index.html', html);
console.log('Digital products updated');
