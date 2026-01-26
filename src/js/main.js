// --- Element Selectors ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const header = document.querySelector('header');
const typewriterElement = document.getElementById('typewriter');

// --- Mobile Menu Toggle ---
if (mobileMenuButton && mobileMenu && header) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        header.classList.toggle('menu-open');
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
            if (targetElement) {
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
            header.classList.remove('menu-open');
        }
    });
});

// 2. Handle clicks on the main home link (e.g., /)
document.querySelectorAll('a[href="/"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// --- Scroll Progress Bar ---
const scrollProgressBar = document.getElementById('scroll-progress-bar');
const scrollToTopBtn = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
    // Scroll Progress Bar
    if (scrollProgressBar) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgressBar.style.width = scrolled + "%";
    }

    // Scroll to Top Button
    if (scrollToTopBtn) {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.remove('opacity-0', 'translate-y-12', 'pointer-events-none');
        } else {
            scrollToTopBtn.classList.add('opacity-0', 'translate-y-12', 'pointer-events-none');
        }
    }
});

if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// --- Theme Toggle ---
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-toggle-icon');

const applyTheme = (isLight) => {
    if (isLight) {
        document.body.classList.add('light-theme');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    } else {
        document.body.classList.remove('light-theme');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
    // Re-initialize mermaid if it exists
    if (window.mermaid) {
        window.mermaid.initialize({ theme: isLight ? 'default' : 'dark' });
        window.mermaid.contentLoaded();
    }
};

const setInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isLight = savedTheme === 'light' || (!savedTheme && !prefersDark);
    applyTheme(isLight);
};

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isCurrentlyLight = document.body.classList.contains('light-theme');
        const nextIsLight = !isCurrentlyLight;
        localStorage.setItem('theme', nextIsLight ? 'light' : 'dark');
        applyTheme(nextIsLight);
    });
}

setInitialTheme();
