// Main entry point — import all styles and initialize modules

// Styles
import './styles/base.css';
import './styles/animations.css';
import './styles/nav.css';
import './styles/hero.css';
import './styles/sections.css';
import './styles/services.css';

// Modules
import { initTypewriter } from './utils/typewriter.js';
import { initCounters } from './utils/counter.js';
import { initScrollReveal, initNavScroll } from './utils/scroll-reveal.js';
import { initServiceAnimations } from './utils/service-animations.js';
import { initHeroWave } from './utils/hero-wave.js';

// ========================================
// Mobile Menu
// ========================================
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if (closeBtn) closeBtn.addEventListener('click', toggleMenu);

    // Regular links close the menu
    document.querySelectorAll('.mobile-link:not(.mobile-dropdown-toggle)').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // Sublinks close the menu
    document.querySelectorAll('.mobile-sublink').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // Dropdown toggle expands accordion
    const dropdownToggle = document.querySelector('.mobile-dropdown-toggle');
    const dropdown = document.querySelector('.mobile-dropdown');

    if (dropdownToggle && dropdown) {
        dropdownToggle.addEventListener('click', () => {
            dropdownToggle.classList.toggle('active');
            dropdown.classList.toggle('open');
        });
    }
}

// ========================================
// FAQ Accordion
// ========================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close others
            faqItems.forEach(other => {
                if (other !== item) other.classList.remove('active');
            });
            // Toggle current
            item.classList.toggle('active');
        });
    });
}

// ========================================
// Initialize everything on DOM ready
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initMobileMenu();
    initFAQ();
    initNavScroll();

    // Delay scroll reveals slightly so intro animation plays first
    setTimeout(() => {
        initScrollReveal();
        initCounters();
        initServiceAnimations();
        initHeroWave();
        initBubbleTilt();
    }, 2500);
});

// ========================================
// Floating bubble tilt for mini-service cards
// ========================================
function initBubbleTilt() {
    const cards = document.querySelectorAll('.mini-service, .glass-card, .why-card, .value-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Tilt angle based on cursor offset from center
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `translateY(-12px) scale(1.03) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}
