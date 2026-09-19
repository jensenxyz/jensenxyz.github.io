const fs = require('fs');
let html = fs.readFileSync('scantrust/index.html', 'utf8');

// Replace the initPillarSwiper logic with an infinite loop version
const oldScriptStart = html.indexOf('(function initPillarSwiper() {');
const oldScriptEnd = html.indexOf('})();', oldScriptStart) + 5;

const oldScript = html.substring(oldScriptStart, oldScriptEnd);

const newScript = `(function initPillarSwiper() {
            const viewport = document.getElementById('pillarViewport');
            const track = document.getElementById('pillarTrack');
            const titleEl = document.getElementById('pillarActiveTitle');
            const prevBtn = document.getElementById('pillarPrevBtn');
            const nextBtn = document.getElementById('pillarNextBtn');
            if (!viewport || !track || !titleEl || !prevBtn || !nextBtn) return;

            const pillars = [
                { title: "1. Core Technology", index: 0 },
                { title: "2. Digital Products", index: 1 },
                { title: "3. Physical Products", index: 2 }
            ];
            const total = pillars.length;
            let currentIndex = 0;

            // Clone slides for infinite loop
            const slides = Array.from(track.querySelectorAll('.pillar-slide'));
            if (slides.length !== total) return;
            
            const firstClone = slides[0].cloneNode(true);
            const lastClone = slides[total - 1].cloneNode(true);
            
            firstClone.setAttribute('aria-hidden', 'true');
            lastClone.setAttribute('aria-hidden', 'true');
            
            track.appendChild(firstClone);
            track.insertBefore(lastClone, slides[0]);
            
            // Adjust track to show the actual first slide (index 1 in the new DOM)
            track.style.transition = 'none';
            track.style.transform = \`translateX(-100%)\`;

            let isTransitioning = false;

            function updateUI(newIndex) {
                if (isTransitioning) return;
                isTransitioning = true;
                
                // newIndex is the logical index (0 to total-1), but we also accept -1 and total
                let actualIndex = newIndex + 1; // +1 because of the clone at the start
                
                track.style.transition = 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)';
                track.style.transform = \`translateX(-\${actualIndex * 100}%)\`;

                let displayIndex = newIndex;
                if (newIndex === -1) displayIndex = total - 1;
                if (newIndex === total) displayIndex = 0;
                
                currentIndex = displayIndex;

                titleEl.style.opacity = '0';
                titleEl.style.transform = 'translateY(2px)';
                setTimeout(() => {
                    titleEl.textContent = pillars[currentIndex].title;
                    titleEl.style.opacity = '1';
                    titleEl.style.transform = 'translateY(0)';
                }, 120);

                setTimeout(() => {
                    isTransitioning = false;
                    // Snap back if we hit a clone
                    if (newIndex === -1) {
                        track.style.transition = 'none';
                        track.style.transform = \`translateX(-\${total * 100}%)\`;
                    } else if (newIndex === total) {
                        track.style.transition = 'none';
                        track.style.transform = \`translateX(-100%)\`;
                    }
                }, 350);
            }

            const sectionIds = [
                'coreTechnologySection',
                'digitalProductsSection',
                'physicalProductsSection'
            ];

            // Make active title clickable to scroll to section
            titleEl.style.cursor = 'pointer';
            titleEl.title = 'Click to jump to this section';
            titleEl.addEventListener('click', () => {
                const targetEl = document.getElementById(sectionIds[currentIndex]);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });

            // Make slides clickable
            track.addEventListener('click', (e) => {
                const slide = e.target.closest('.pillar-slide');
                if (!slide) return;
                
                // Find logical index
                const allSlides = Array.from(track.children);
                const domIndex = allSlides.indexOf(slide);
                const logicalIdx = domIndex - 1; // subtract the clone
                
                if (logicalIdx >= 0 && logicalIdx < total) {
                    if (currentIndex !== logicalIdx) {
                        updateUI(logicalIdx);
                    } else {
                        const targetEl = document.getElementById(sectionIds[logicalIdx]);
                        if (targetEl) {
                            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                }
            });

            prevBtn.addEventListener('click', () => updateUI(currentIndex - 1));
            nextBtn.addEventListener('click', () => updateUI(currentIndex + 1));

            // Keyboard navigation
            viewport.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    updateUI(currentIndex - 1);
                } else if (e.key === 'ArrowRight') {
                    updateUI(currentIndex + 1);
                } else if (e.key === 'Enter') {
                    const targetEl = document.getElementById(sectionIds[currentIndex]);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });

            // Touch & Mouse Drag swiping
            let isDragging = false;
            let startX = 0;
            let currentX = 0;
            let diffX = 0;

            function onPointerDown(e) {
                if (isTransitioning) return;
                isDragging = true;
                startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
                diffX = 0;
                track.style.transition = 'none';
                viewport.classList.add('is-dragging');
            }

            function onPointerMove(e) {
                if (!isDragging || isTransitioning) return;
                currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
                diffX = currentX - startX;
                const width = viewport.offsetWidth || 280;
                
                let actualIndex = currentIndex + 1;
                const percent = -actualIndex * 100 + (diffX / width) * 100;
                track.style.transform = \`translateX(\${percent}%)\`;
            }

            function onPointerUp() {
                if (!isDragging) return;
                isDragging = false;
                viewport.classList.remove('is-dragging');
                
                const width = viewport.offsetWidth || 280;
                const threshold = width * 0.2; // 20% swipe threshold

                if (diffX < -threshold) {
                    updateUI(currentIndex + 1);
                } else if (diffX > threshold) {
                    updateUI(currentIndex - 1);
                } else {
                    updateUI(currentIndex);
                }
                diffX = 0;
            }

            viewport.addEventListener('mousedown', onPointerDown);
            window.addEventListener('mousemove', onPointerMove);
            window.addEventListener('mouseup', onPointerUp);
            
            viewport.addEventListener('touchstart', onPointerDown, { passive: true });
            viewport.addEventListener('touchmove', onPointerMove, { passive: true });
            viewport.addEventListener('touchend', onPointerUp);
            viewport.addEventListener('touchcancel', onPointerUp);
        })();`;

html = html.replace(oldScript, newScript);
fs.writeFileSync('scantrust/index.html', html);
console.log('Swiper script updated for infinite loop.');
