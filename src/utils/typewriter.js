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
            if (index >= 3) {
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

    // Start the sequence
    setTimeout(typeLogo, 400);
}
