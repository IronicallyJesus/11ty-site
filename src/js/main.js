// --- Element Selectors ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const header = document.querySelector('header');
const typewriterElement = document.getElementById('typewriter');

// --- Mobile Menu Toggle ---
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// --- Typewriter Effect ---
if (typewriterElement) {
    const text = "Specializing in ISP Environments";
    let index = 0;
    
    function type() {
        const currentText = text.substring(0, index);
        typewriterElement.textContent = currentText;
        if (index < text.length) {
            index++;
            setTimeout(type, 100);
        }
    }
    // Start typing effect after a short delay
    setTimeout(type, 500);
}

// --- Reusable Scroll Function ---
/**
 * Instantly scrolls to a target element, accounting for the sticky header.
 * @param {string} targetId The ID of the element to scroll to.
 */
function jumpToTarget(targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    const headerOffset = header ? header.offsetHeight : 0;
    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    // Use 'auto' behavior for an instant jump
    window.scrollTo({
        top: offsetPosition,
        behavior: 'auto' 
    });
}

// --- Event Listeners for Scrolling ---

// 1. Handle clicks on section links (e.g., /#about)
document.querySelectorAll('a[href^="/#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const isHomePage = window.location.pathname === '/';
        const targetId = this.getAttribute('href').substring(2);

        if (isHomePage) {
            e.preventDefault();
            // For on-page clicks, we still want a smooth scroll
            const targetElement = document.getElementById(targetId);
            if(targetElement) {
                const headerOffset = header ? header.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
        // If not on the homepage, let the browser navigate.
        // The 'load' event listener below will handle the final positioning.

        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    });
});

// 2. Handle clicks on the main home link (e.g., /)
document.querySelectorAll('a[href="/"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (window.location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
});

// 3. Handle positioning after page load if there's a hash in the URL
// We use the 'load' event to ensure all assets (like images) are loaded
// and the page dimensions are final before we calculate the scroll.
window.addEventListener('load', () => {
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        jumpToTarget(targetId);
    }
});
