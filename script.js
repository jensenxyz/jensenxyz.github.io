// ==========================================
// Jensen Portfolio - Unified Core Scripts
// ==========================================

// --- Scroll Lock Utility (iOS Safari & Cross-Platform Safe) ---
let savedScrollY = 0;
let isScrollLocked = false;

function lockBodyScroll() {
    if (isScrollLocked) return;
    savedScrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    
    isScrollLocked = true;
}

function unlockBodyScroll() {
    if (!isScrollLocked) return;
    
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    
    window.scrollTo(0, savedScrollY);
    isScrollLocked = false;
}

// --- Image Overlay / Lightbox Logic ---
const mockupImages = [
    "assets/howfar_mockup_1.webp",
    "assets/howfar_mockup_2.webp",
    "assets/howfar_mockup_3.webp",
    "assets/howfar_mockup_4.webp"
];
let currentImageIndex = 0;

function updateOverlayImage() {
    const imgElem = document.getElementById('overlay-img');
    if (imgElem && mockupImages[currentImageIndex]) {
        imgElem.src = mockupImages[currentImageIndex];
    }
}

function openOverlay(src) {
    if (src) {
        const filename = src.substring(src.lastIndexOf('/') + 1);
        currentImageIndex = mockupImages.findIndex(img => img.includes(filename));
        if (currentImageIndex === -1) currentImageIndex = 0;
    }
    
    updateOverlayImage();
    const overlay = document.getElementById('image-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        lockBodyScroll();
    }
}

function closeOverlay() {
    const overlay = document.getElementById('image-overlay');
    if (overlay) {
        overlay.style.display = 'none';
        unlockBodyScroll();
    }
}

function navigateOverlay(direction) {
    currentImageIndex += direction;
    if (currentImageIndex < 0) {
        currentImageIndex = mockupImages.length - 1;
    } else if (currentImageIndex >= mockupImages.length) {
        currentImageIndex = 0;
    }
    updateOverlayImage();
}

// Expose overlay methods to window for inline onclick handlers
window.openOverlay = openOverlay;
window.closeOverlay = closeOverlay;
window.navigateOverlay = navigateOverlay;

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Overlay Event Listeners & Touch Gestures ---
    const overlay = document.getElementById('image-overlay');
    if (overlay) {
        // Prevent touchmove from dragging the background page on mobile
        overlay.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });

        // Close when clicking outside image
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeOverlay();
            }
        });

        // Swipe Left/Right gesture support on mobile
        let touchStartX = 0;
        let touchStartY = 0;

        overlay.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length > 0) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        overlay.addEventListener('touchend', (e) => {
            if (e.changedTouches && e.changedTouches.length > 0) {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const diffX = touchEndX - touchStartX;
                const diffY = touchEndY - touchStartY;
                
                // Dominant horizontal swipe of at least 35px
                if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) * 1.2) {
                    if (diffX < 0) {
                        navigateOverlay(1); // Swipe left -> Next
                    } else {
                        navigateOverlay(-1); // Swipe right -> Previous
                    }
                }
            }
        }, { passive: true });
    }

    // Close on Escape, navigate with keyboard arrows
    document.addEventListener('keydown', (event) => {
        const overlay = document.getElementById('image-overlay');
        if (overlay && overlay.style.display === 'flex') {
            if (event.key === "Escape") {
                closeOverlay();
            } else if (event.key === "ArrowLeft") {
                navigateOverlay(-1);
            } else if (event.key === "ArrowRight") {
                navigateOverlay(1);
            }
        }
    });

    // --- 2. Project Carousel Controller ---
    const carousel = document.getElementById("project-carousel");
    const scrollLeftBtn = document.getElementById("scroll-left");
    const scrollRightBtn = document.getElementById("scroll-right");

    if (carousel && scrollLeftBtn && scrollRightBtn) {
        
        const getScrollAmount = () => {
            const firstCard = carousel.querySelector('.project-card');
            if (!firstCard) return 320;
            const carouselStyle = window.getComputedStyle(carousel);
            const gap = parseFloat(carouselStyle.gap) || 20;
            return firstCard.offsetWidth + gap;
        };

        const getMaxScroll = () => {
            const cards = carousel.querySelectorAll('.project-card');
            if (!cards.length) return 0;
            const lastCard = cards[cards.length - 1];
            const carouselStyle = window.getComputedStyle(carousel);
            const paddingRight = parseFloat(carouselStyle.paddingRight) || 0;
            
            // Exact point where the right edge of the last card touches the carousel's right padding
            const lastCardMax = (lastCard.offsetLeft + lastCard.offsetWidth + paddingRight) - carousel.clientWidth;
            const standardMax = carousel.scrollWidth - carousel.clientWidth;
            return Math.max(0, Math.min(lastCardMax, standardMax));
        };

        const updateButtonStates = () => {
            const maxScroll = getMaxScroll();
            const scrollLeft = carousel.scrollLeft;
            
            // Check if at the very beginning
            const isAtStart = scrollLeft <= 8;
            
            // Check if at the very end
            let isAtEnd = scrollLeft >= maxScroll - 8;
            
            const cards = carousel.querySelectorAll('.project-card');
            const lastCard = cards[cards.length - 1];
            if (lastCard) {
                const carouselRect = carousel.getBoundingClientRect();
                const lastCardRect = lastCard.getBoundingClientRect();
                // If last card's trailing edge is within or at the right boundary
                if (lastCardRect.right <= carouselRect.right + 12) {
                    isAtEnd = true;
                }
            }
            
            // Left Button State
            scrollLeftBtn.disabled = isAtStart;
            if (isAtStart) {
                scrollLeftBtn.classList.add('disabled');
                scrollLeftBtn.style.opacity = '0.15';
                scrollLeftBtn.style.cursor = 'not-allowed';
                scrollLeftBtn.style.pointerEvents = 'none';
            } else {
                scrollLeftBtn.classList.remove('disabled');
                scrollLeftBtn.style.opacity = '1';
                scrollLeftBtn.style.cursor = 'pointer';
                scrollLeftBtn.style.pointerEvents = 'auto';
            }
            
            // Right Button State
            scrollRightBtn.disabled = isAtEnd;
            if (isAtEnd) {
                scrollRightBtn.classList.add('disabled');
                scrollRightBtn.style.opacity = '0.15';
                scrollRightBtn.style.cursor = 'not-allowed';
                scrollRightBtn.style.pointerEvents = 'none';
            } else {
                scrollRightBtn.classList.remove('disabled');
                scrollRightBtn.style.opacity = '1';
                scrollRightBtn.style.cursor = 'pointer';
                scrollRightBtn.style.pointerEvents = 'auto';
            }
        };

        // Arrow Buttons Smooth Scrolling with Boundary Safety
        scrollLeftBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (scrollLeftBtn.disabled || carousel.scrollLeft <= 5) return;
            const step = getScrollAmount();
            const target = Math.max(0, carousel.scrollLeft - step);
            carousel.scrollTo({ left: target, behavior: "smooth" });
        });

        scrollRightBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const maxScroll = getMaxScroll();
            if (scrollRightBtn.disabled || carousel.scrollLeft >= maxScroll - 5) return;
            const step = getScrollAmount();
            const target = Math.min(maxScroll, carousel.scrollLeft + step);
            carousel.scrollTo({ left: target, behavior: "smooth" });
        });

        // Event listeners to keep states synchronized
        carousel.addEventListener("scroll", updateButtonStates, { passive: true });
        window.addEventListener("resize", updateButtonStates);
        
        // Initial state update
        updateButtonStates();
        window.addEventListener("load", updateButtonStates);
    }

    // --- 3. Expertise Accordion Logic ---
    const accordionTitles = document.querySelectorAll(".accordion-title");

    accordionTitles.forEach(title => {
        title.addEventListener("click", () => {
            const parentItem = title.parentElement;
            
            // Close other items in the same column
            const siblingItems = parentItem.parentElement.querySelectorAll(".accordion-item");
            siblingItems.forEach(item => {
                if (item !== parentItem && item.classList.contains("active")) {
                    item.classList.remove("active");
                }
            });

            // Toggle active state
            parentItem.classList.toggle("active");
        });
    });

    // --- 4. Rainbow Rain Easter Egg Initialization ---
    if (typeof window.initRainbowRain === 'function') {
        window.initRainbowRain();
    }
});
