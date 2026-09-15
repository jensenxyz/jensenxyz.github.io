document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Infinite Project Carousel Logic ---
    const carousel = document.getElementById("project-carousel");
    const scrollLeftBtn = document.getElementById("scroll-left");
    const scrollRightBtn = document.getElementById("scroll-right");

    if (carousel && scrollLeftBtn && scrollRightBtn) {
        
        // Find actual distance to scroll by taking the width of the first card + gap
        const getScrollAmount = () => {
            const firstCard = carousel.querySelector('.project-card');
            if (!firstCard) return 320;
            const cardStyle = window.getComputedStyle(firstCard);
            const carouselStyle = window.getComputedStyle(carousel);
            const gap = parseFloat(carouselStyle.gap) || 0;
            return firstCard.offsetWidth + gap;
        };

        // Arrow Buttons Smooth Scrolling
        scrollLeftBtn.addEventListener("click", () => {
            carousel.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
        });

        scrollRightBtn.addEventListener("click", () => {
            carousel.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
        });
    }

    // --- 2. Expertise Accordion Logic ---
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
});
