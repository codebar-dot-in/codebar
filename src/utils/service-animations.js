/**
 * Service showcase scroll-driven animations
 * Inspired by Apple Siri's sticky-scroll section pattern
 */

export function initServiceAnimations() {
    const showcases = document.querySelectorAll('.service-showcase');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const animElements = entry.target.querySelectorAll('.service-anim, .service-img-anim');
            if (entry.isIntersecting) {
                animElements.forEach(el => el.classList.add('animate-in'));
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });

    showcases.forEach(showcase => observer.observe(showcase));
}
