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

        // Check if the target exists on the current page before preventing default navigation
        let target = null;
        if (sectionId !== '#top') {
            target = document.querySelector(sectionId);
            // If the element doesn't exist on this page, do nothing here.
            // The browser will natively navigate to the URL (e.g. to the homepage).
            if (!target) return;
        }

        e.preventDefault();
        e.stopPropagation();

        // Special case: #top scrolls to the very top of the page
        if (sectionId === '#top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            target.scrollIntoView({ behavior: 'smooth' });
        }

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
