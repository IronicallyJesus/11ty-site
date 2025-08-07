// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Typewriter Effect
const typewriterElement = document.getElementById('typewriter');
const text = "Specializing in ISP Environments";
let index = 0;
let isDeleting = false;

function type() {
    const currentText = text.substring(0, index);
    if (typewriterElement) {
        typewriterElement.textContent = currentText;
    }
    if (!isDeleting && index < text.length) {
        index++;
        setTimeout(type, 100);
    } else {
        // Keep the full text visible
    }
}

// Start typing effect on load
document.addEventListener('DOMContentLoaded', () => {
    if (typewriterElement) {
        setTimeout(type, 500);
    }
});

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

// Smooth scrolling for the main home link
document.querySelectorAll('a[href="/"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // If we are already on the homepage
        if (window.location.pathname === '/') {
            e.preventDefault(); // Prevent the page from reloading
            // Scroll smoothly to the top of the page
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
});
