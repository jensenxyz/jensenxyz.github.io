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
});
