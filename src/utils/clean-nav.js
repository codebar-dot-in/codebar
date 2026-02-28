/**
 * Clean URL Navigation
 * Intercepts anchor (#section) and (/#section) clicks, smooth-scrolls to the target,
 * and removes the hash from the URL bar for a clean look.
 */

export function initCleanNav() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // Match both "#section" and "/#section" patterns
        let sectionId = null;
        if (href.startsWith('#') && href.length > 1) {
            sectionId = href; // e.g. "#story"
        } else if (href.startsWith('/#')) {
            sectionId = href.substring(1); // "/#story" → "#story"
        }

        if (!sectionId) return;

        const target = document.querySelector(sectionId);
        if (!target) return;

        e.preventDefault();
        e.stopPropagation();

        // Smooth scroll to the section
        target.scrollIntoView({ behavior: 'smooth' });

        // Clean up the URL — remove the hash fragment completely
        history.replaceState(null, '', window.location.pathname);

        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, true); // Use capture phase to fire before other handlers

    // On page load, if there's a hash from an external link (e.g. /#story from a service page),
    // scroll to the section and clean the URL
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth' });
                history.replaceState(null, '', window.location.pathname);
            }, 300);
        }
    }
}
