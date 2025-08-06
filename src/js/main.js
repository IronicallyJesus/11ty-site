// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="/#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Check if the current page is the homepage.
        const isHomePage = window.location.pathname === '/';
        const targetId = this.getAttribute('href').substring(2);
        const targetElement = document.getElementById(targetId);

        // If we are on the homepage AND the target element exists, then smooth scroll.
        if (isHomePage && targetElement) {
            e.preventDefault(); // Stop the browser from navigating.
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
        // If we are on any other page (like /blog/), this 'if' condition is false,
        // so e.preventDefault() is NOT called, and the browser performs its
        // default action: navigating to the homepage and jumping to the hash.

        // Close mobile menu on any nav link click
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    });
});
