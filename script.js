document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Project Carousel Logic ---
    const carousel = document.getElementById("project-carousel");
    const scrollLeftBtn = document.getElementById("scroll-left");
    const scrollRightBtn = document.getElementById("scroll-right");

    if(carousel && scrollLeftBtn && scrollRightBtn) {
        // Calculate scroll amount based on card width + gap
        const scrollAmount = 410; // Approx card width (380) + gap (30)

        scrollLeftBtn.addEventListener("click", () => {
            carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        });

        scrollRightBtn.addEventListener("click", () => {
            carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
        });
    }

    // --- 2. Expertise Accordion Logic ---
    const accordionTitles = document.querySelectorAll(".accordion-title");

    accordionTitles.forEach(title => {
        title.addEventListener("click", () => {
            // Find the parent item (.accordion-item)
            const parentItem = title.parentElement;
            
            // Optional: Close other active items in the same card
            const siblingItems = parentItem.parentElement.querySelectorAll(".accordion-item");
            siblingItems.forEach(item => {
                if (item !== parentItem && item.classList.contains("active")) {
                    item.classList.remove("active");
                    item.querySelector(".icon").textContent = "+";
                }
            });

            // Toggle active class on clicked item
            parentItem.classList.toggle("active");
            
            // Toggle + / - Icon
            const icon = title.querySelector(".icon");
            if (parentItem.classList.contains("active")) {
                icon.textContent = "-";
            } else {
                icon.textContent = "+";
            }
        });
    });
});
