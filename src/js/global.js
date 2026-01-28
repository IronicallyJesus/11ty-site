/**
 * Global helper to handle fetch requests, parse JSON, and handle errors (e.g., 429 Too Many Requests).
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

// Initialize icon based on current body class (set by inline script)
const isLightInitialized = document.body.classList.contains('light-theme');
applyTheme(isLightInitialized);


// --- Intersection Observer for Active Nav State on Homepage ---
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section is near top/center
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            let selector = `.nav-link[href="/#${id}"]`;
            if (id === 'experience') selector = `.nav-link[href="/experience"]`;
            if (id === 'blog') selector = `.nav-link[href="/blog"]`;

            if (entry.isIntersecting) {
                // When a section is intersecting, remove active class from all links
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                // And add it to the correct one
                document.querySelectorAll(selector).forEach(activeLink => {
                    activeLink.classList.add('active');
                });
            } else {
                // When a section is not intersecting, just remove its active class.
                document.querySelectorAll(selector).forEach(activeLink => {
                    activeLink.classList.remove('active');
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = document.querySelectorAll('section[id]'); // Assuming sections have IDs like 'skills', 'contact'

    // Specifically target skills and contact if they are not generic sections
    const specificSections = ['experience', 'blog', 'skills', 'contact'];
    specificSections.forEach(id => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
    });
}

