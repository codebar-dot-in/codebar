/**
 * Typewriter animation for logo and hero text
 * Preserves original logo typography: "cod≡bar" with "≡bar" in blue-600
 */

const logoText = "cod≡bar";
const heroText = "We build apps.\nWe grow brands.";

export function initTypewriter() {
    const logoTypewriter = document.getElementById('logo-typewriter');
    const heroElement = document.getElementById('hero-typewriter');
    const subtextElement = document.getElementById('hero-subtext');
    const heroTags = document.querySelector('.hero-tags');
    const introOverlay = document.getElementById('intro-overlay');
    const animatingLogo = document.getElementById('animating-logo');
    const mainContent = document.getElementById('main-content');

    function typeLogo(index = 0) {
        if (index < logoText.length) {
            const char = logoText[index];
            // Original styling: "≡" and "bar" (index >= 3) in blue-600 (#2563eb)
            // Add space around ≡ for breathing room
            if (char === '≡') {
                logoTypewriter.innerHTML += `<span style="color: #2563eb; margin-left: 5px; letter-spacing: 0.05em">${char}</span>`;
            } else if (index > 3) {
                logoTypewriter.innerHTML += `<span style="color: #2563eb">${char}</span>`;
            } else {
                logoTypewriter.innerHTML += char;
            }
            setTimeout(() => typeLogo(index + 1), 100);
        } else {
            setTimeout(moveLogoToNav, 800);
        }
    }

    function moveLogoToNav() {
        animatingLogo.classList.add('logo-moved');
        introOverlay.style.opacity = '0';
        mainContent.style.opacity = '1';

        setTimeout(() => {
            introOverlay.style.display = 'none';
            startHeroTypewriter();
        }, 800);
    }

    function startHeroTypewriter(index = 0) {
        if (index < heroText.length) {
            const currentText = heroText.substring(0, index + 1).replace(/\n/g, '<br>');
            heroElement.innerHTML = currentText + '<span class="cursor"></span>';
            setTimeout(() => startHeroTypewriter(index + 1), 50);
        } else {
            heroElement.innerHTML = heroText.replace(/\n/g, '<br>') + '<span class="cursor"></span>';
            // Show subtext and tags
            subtextElement.classList.add('visible');
            if (heroTags) heroTags.classList.add('visible');
        }
    }

    // If URL has a hash (e.g. from service page CTA), skip the intro animation
    if (window.location.hash) {
        // Instantly set up the final state without animation
        logoTypewriter.innerHTML = 'cod<span style="color: #2563eb; margin-left: 14px; letter-spacing: 0.05em">≡</span><span style="color: #2563eb">b</span><span style="color: #2563eb">a</span><span style="color: #2563eb">r</span>';
        if (animatingLogo) animatingLogo.classList.add('logo-moved');
        if (introOverlay) {
            introOverlay.style.opacity = '0';
            introOverlay.style.display = 'none';
        }
        if (mainContent) mainContent.style.opacity = '1';
        // Show hero text instantly
        heroElement.innerHTML = heroText.replace(/\n/g, '<br>') + '<span class="cursor"></span>';
        if (subtextElement) subtextElement.classList.add('visible');
        if (heroTags) heroTags.classList.add('visible');
        // Scroll to the hash target after a brief paint
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return;
    }

    // Start the sequence (normal first visit)
    setTimeout(typeLogo, 400);
}
