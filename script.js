document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Infinite Project Carousel Logic ---
    const carousel = document.getElementById("project-carousel");
    const scrollLeftBtn = document.getElementById("scroll-left");
    const scrollRightBtn = document.getElementById("scroll-right");

    if (carousel && scrollLeftBtn && scrollRightBtn) {
        
        // Clone the original items and append them to create the infinite track
        const originalCards = Array.from(carousel.children);
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            carousel.appendChild(clone);
        });

        // The exact distance to scroll horizontally for 1 card
        const scrollAmount = 410; // Card width (380) + gap (30)

        // Arrow Buttons Smooth Scrolling
        scrollLeftBtn.addEventListener("click", () => {
            if (carousel.scrollLeft === 0) {
                // If at the very beginning, jump instantly to the cloned mirrored position before scrolling
                carousel.scrollLeft = carousel.scrollWidth / 2;
            }
            carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        });

        scrollRightBtn.addEventListener("click", () => {
            carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
        });

        // Seamless Jump Listener
        carousel.addEventListener("scroll", () => {
            // Once the user has scrolled past the original set of cards,
            // jump back silently (auto without smooth behavior) to the exact same visual spot at the start
            if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
                carousel.scrollLeft = carousel.scrollLeft - (carousel.scrollWidth / 2);
            }
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
