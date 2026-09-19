document.addEventListener('DOMContentLoaded', () => {
    const breadcrumb = document.querySelector('.breadcrumb');
    const backBtn = document.querySelector('.back-to-home');
    
    if (breadcrumb && backBtn) {
        // Observe when the breadcrumb scrolls past the sticky header
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.offsetHeight : 60;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    backBtn.classList.add('visible');
                } else {
                    backBtn.classList.remove('visible');
                }
            });
        }, { rootMargin: `-${headerHeight}px 0px 0px 0px` });
        
        observer.observe(breadcrumb);
    } else if (backBtn) {
        // Fallback if no breadcrumb exists on the page
        backBtn.classList.add('visible');
    }

    // Initialize Rainbow Rain Easter Egg
    initRainbowRain();
});

// ==========================================
// Rainbow Emoji Rain Effect
// ==========================================
function triggerRainbowRain() {
    let container = document.getElementById('emoji-rain-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'emoji-rain-container';
        container.setAttribute('aria-hidden', 'true');
        document.body.appendChild(container);
    }

    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    const count = isMobile ? 36 : (isTablet ? 45 : 55);
    const emojis = ['🌈', '🌈', '🌈', '🌈', '🌈', '✨'];

    for (let i = 0; i < count; i++) {
        const drop = document.createElement('div');
        drop.className = 'emoji-raindrop';
        drop.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        // Spread across full screen width
        const left = Math.random() * 94 + 3; // 3% to 97%
        const minSize = isMobile ? 18 : 22;
        const maxSize = isMobile ? 36 : 46;
        const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
        const duration = (Math.random() * 1.4 + 1.8).toFixed(2); // 1.8s - 3.2s
        const delay = (Math.random() * 1.5).toFixed(2); // 0s - 1.5s cascade
        const driftX = Math.round((Math.random() - 0.5) * 90); // -45px to +45px
        const rotStart = Math.round((Math.random() - 0.5) * 40);
        const rotEnd = Math.round((Math.random() - 0.5) * 80 + (Math.random() > 0.5 ? 45 : -45));

        drop.style.left = `${left}%`;
        drop.style.fontSize = `${size}px`;
        drop.style.animationDuration = `${duration}s`;
        drop.style.animationDelay = `${delay}s`;
        drop.style.setProperty('--drift-x', `${driftX}px`);
        drop.style.setProperty('--rot-start', `${rotStart}deg`);
        drop.style.setProperty('--rot-end', `${rotEnd}deg`);

        const cleanup = () => {
            if (drop.parentNode) {
                drop.remove();
            }
            if (container && container.childElementCount === 0 && container.parentNode) {
                container.remove();
            }
        };

        drop.addEventListener('animationend', cleanup);
        setTimeout(cleanup, (parseFloat(delay) + parseFloat(duration) + 0.5) * 1000);

        container.appendChild(drop);
    }
}

function initRainbowRain() {
    // Helper to wire up trigger
    const wireTrigger = (elem) => {
        if (!elem || elem.dataset.rainbowBound === 'true') return;
        elem.dataset.rainbowBound = 'true';
        elem.setAttribute('role', 'button');
        elem.setAttribute('tabindex', '0');
        elem.setAttribute('title', 'Make it rain rainbows! 🌈');
        elem.setAttribute('aria-label', 'Make it rain rainbows');

        const activate = (e) => {
            if (e) {
                if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') {
                    return;
                }
                e.preventDefault();
            }

            // Haptic vibration feedback on supported mobile devices
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                try { navigator.vibrate(25); } catch (_) {}
            }

            // Pop bounce animation on the trigger
            elem.classList.remove('rainbow-popping');
            // Force reflow
            void elem.offsetWidth;
            elem.classList.add('rainbow-popping');

            triggerRainbowRain();
        };

        elem.addEventListener('click', activate);
        elem.addEventListener('keydown', activate);
    };

    // 1. Find existing .footer-rainbow triggers
    const explicitTriggers = document.querySelectorAll('.footer-rainbow');
    explicitTriggers.forEach(wireTrigger);

    // 2. Fallback: wrap raw 🌈 emoji in .footer-copy if not already wrapped
    const footerCopies = document.querySelectorAll('.footer-copy');
    footerCopies.forEach(copy => {
        if (!copy.querySelector('.footer-rainbow') && copy.innerHTML.includes('🌈')) {
            copy.innerHTML = copy.innerHTML.replace(
                '🌈',
                '<span class="footer-rainbow" role="button" tabindex="0" title="Make it rain rainbows! 🌈" aria-label="Make it rain rainbows">🌈</span>'
            );
            const newTrigger = copy.querySelector('.footer-rainbow');
            if (newTrigger) wireTrigger(newTrigger);
        }
    });
}

// Expose globally
window.triggerRainbowRain = triggerRainbowRain;
window.initRainbowRain = initRainbowRain;

