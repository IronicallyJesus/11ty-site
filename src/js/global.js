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

// --- Mobile Menu Toggle ---
if (mobileMenuButton && mobileMenu && header) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        header.classList.toggle('menu-open');
    });
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
        const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';
        const targetId = this.getAttribute('href').split('#')[1];

        // Check if we are on the homepage and the link is an anchor on the current page
        if (isHomePage) {
            e.preventDefault();

            // 1. Close mobile menu FIRST if it's open
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                header.classList.remove('menu-open');
            }

            // 2. Wait for the next animation frame so the layout/header height updates
            requestAnimationFrame(() => {
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
            });
        } else {
            // If not on homepage, the browser will navigate to /#id
            // the 'load' event listener below will handle the jump with correct offset
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                header.classList.remove('menu-open');
            }
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

        // Dispatch custom event for other scripts to react
        window.dispatchEvent(new CustomEvent('theme-changed', {
            detail: { isLight: nextIsLight }
        }));
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
            // Only update nav links if we are NOT on mobile (mobile uses simplified menu)
            // or if needed, but the original logic was for desktop primarily.
            let selector = `.nav-link[href="/#${id}"]`;
            if (id === 'experience') selector = `.nav-link[href="/experience"]`;
            if (id === 'blog') selector = `.nav-link[href="/blog"]`;

            if (entry.isIntersecting) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                document.querySelectorAll(selector).forEach(activeLink => {
                    activeLink.classList.add('active');
                });
            } else {
                document.querySelectorAll(selector).forEach(activeLink => {
                    activeLink.classList.remove('active');
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = document.querySelectorAll('section[id]');
    const specificSections = ['experience', 'blog', 'skills', 'contact'];
    specificSections.forEach(id => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
    });
}

// --- Scroll-Driven Card Highlighting ---
const cardObserverOptions = {
    root: null,
    // Trigger when the element is in the middle 10% of the screen
    rootMargin: '-45% 0px -45% 0px',
    threshold: 0
};

const cardObserverCallback = (entries) => {
    entries.forEach(entry => {
        const card = entry.target;
        // Check for a sibling icon (common in experience cards)
        const icon = card.parentElement ? card.parentElement.querySelector('.card-icon-bg') : null;

        if (entry.isIntersecting) {
            card.classList.add('active');
            if (icon) icon.classList.add('active');
        } else {
            card.classList.remove('active');
            if (icon) icon.classList.remove('active');
        }
    });
};

const cardObserver = new IntersectionObserver(cardObserverCallback, cardObserverOptions);
// Target specific cards on the homepage: skills, experience (if any), blog posts, service cards
const cards = document.querySelectorAll('.card');
cards.forEach(card => cardObserver.observe(card));

// --- Hero Adjective Scrolling ---
const adjectiveElement = document.getElementById('hero-adjective');
if (adjectiveElement) {
    const adjectives = ["Resilient", "Scalable", "Reliable", "Optimized", "Secure", "Efficient", "Advanced"];
    let adjectiveIndex = 0;

    // Calculate max width to prevent layout shift
    const measureAdjectives = () => {
        const span = document.createElement('span');
        span.style.visibility = 'hidden';
        span.style.position = 'absolute';
        span.style.whiteSpace = 'nowrap';
        // Inherit styles from the actual element
        span.className = adjectiveElement.className;

        // Append to parent to inherit font styles correctly
        if (adjectiveElement.parentElement) {
            adjectiveElement.parentElement.appendChild(span);
        } else {
            document.body.appendChild(span);
        }

        let maxWidth = 0;
        adjectives.forEach(adj => {
            span.textContent = adj;
            maxWidth = Math.max(maxWidth, span.offsetWidth);
        });

        if (adjectiveElement.parentElement) {
            adjectiveElement.parentElement.removeChild(span);
        } else {
            document.body.removeChild(span);
        }

        // Set fixed width + small buffer
        adjectiveElement.style.width = `${maxWidth + 4}px`;
        adjectiveElement.style.textAlign = 'center';
        adjectiveElement.style.display = 'inline-block';
        adjectiveElement.style.whiteSpace = 'nowrap';
    };


    // Calculate on load and on transition end to be safe
    if (document.fonts) {
        document.fonts.ready.then(measureAdjectives);
    } else {
        measureAdjectives();
    }

    window.addEventListener('load', measureAdjectives);
    window.addEventListener('resize', measureAdjectives);

    function rotateAdjective() {
        // Start fade out
        adjectiveElement.classList.add('hero-adjective-fade');

        setTimeout(() => {
            // Update text after fade out
            adjectiveIndex = (adjectiveIndex + 1) % adjectives.length;
            adjectiveElement.textContent = adjectives[adjectiveIndex];

            // Fade back in
            adjectiveElement.classList.remove('hero-adjective-fade');
        }, 500); // Should match CSS transition duration
    }

    // Initialize rotation interval
    setInterval(rotateAdjective, 3000);
}
