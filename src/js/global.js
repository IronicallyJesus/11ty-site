/**
 * Global helpers and UI interactions for the portfolio site.
 */
window.fetchApiData = async (url, options = {}) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        let errorMessage = `Server responded with status ${response.status}`;
        if (response.status === 429) {
            const errorText = await response.text();
            errorMessage = errorText || 'Too many requests. Please try again later.';
        }
        throw new Error(errorMessage);
    }
    return response.json();
};

// --- Element Selectors ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const header = document.querySelector('.site-header');

// --- Mobile Menu Toggle ---
if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const isOpen = mobileMenu.classList.contains('open');
        mobileMenuBtn.querySelector('i').className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });
}

// --- Section link scrolling ---
document.querySelectorAll('a[href^="/#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const isHomePage = window.location.pathname === '/';
        const targetId = this.getAttribute('href').split('#')[1];

        if (isHomePage) {
            e.preventDefault();
            if (mobileMenu) mobileMenu.classList.remove('open');
            requestAnimationFrame(() => {
                const target = document.getElementById(targetId);
                if (target) {
                    const offset = header ? header.offsetHeight : 0;
                    window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset - 16, behavior: 'smooth' });
                }
            });
        } else {
            if (mobileMenu) mobileMenu.classList.remove('open');
        }
    });
});

// Home link scroll to top
document.querySelectorAll('a[href="/"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (window.location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});

// Hash scroll on load
window.addEventListener('load', () => {
    if (window.location.hash) {
        const target = document.getElementById(window.location.hash.substring(1));
        if (target) {
            const offset = header ? header.offsetHeight : 0;
            window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset - 16, behavior: 'auto' });
        }
    }
});

// --- Scroll Progress Bar ---
const scrollProgressBar = document.getElementById('scroll-progress-bar');
const scrollToTopBtn = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
    if (scrollProgressBar) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        scrollProgressBar.style.width = (winScroll / height) * 100 + '%';
    }
    if (scrollToTopBtn) {
        scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
    }
});

if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// --- Theme Toggle ---
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-toggle-icon');

const applyTheme = (isLight) => {
    if (isLight) {
        document.body.classList.add('light-theme');
        if (themeIcon) { themeIcon.className = 'fa-solid fa-moon'; }
    } else {
        document.body.classList.remove('light-theme');
        if (themeIcon) { themeIcon.className = 'fa-solid fa-sun'; }
    }
};

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const next = !document.body.classList.contains('light-theme');
        localStorage.setItem('theme', next ? 'light' : 'dark');
        applyTheme(next);
        window.dispatchEvent(new CustomEvent('theme-changed', { detail: { isLight: next } }));
    });
}

const lightInitial = document.body.classList.contains('light-theme');
applyTheme(lightInitial);
