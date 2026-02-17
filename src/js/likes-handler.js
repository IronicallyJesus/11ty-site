/**
 * Handles the interactive like button logic (POST/DELETE) and immediate UI feedback.
 */
document.addEventListener('DOMContentLoaded', () => {
    const likeIcon = document.querySelector('[data-like-button]');
    if (!likeIcon) return;

    const slug = likeIcon.dataset.slug;
    const storageKey = `liked-${slug}`;
    let isRequestInProgress = false;

    // 1. Initial State Check (for the heart icon color and hint animation)
    const isLikedInStorage = localStorage.getItem(storageKey) === 'true';
    if (isLikedInStorage) {
        likeIcon.classList.add('liked');
    } else if (localStorage.getItem(storageKey) === null) {
        // Show hint animation ONLY if the user has never interacted with this slug before
        likeIcon.classList.add('hint-animation');
        setTimeout(() => likeIcon.classList.remove('hint-animation'), 2000);
    }

    // 2. Click Handler
    likeIcon.addEventListener('click', async () => {
        if (isRequestInProgress) return;

        // Check for privacy consent
        if (!localStorage.getItem('privacy-consent')) {
            const banner = document.getElementById('cookie-consent-banner');
            if (banner) {
                banner.classList.remove('translate-y-full');
                // Pulse effect to draw attention
                banner.classList.add('scale-105');
                setTimeout(() => banner.classList.remove('scale-105'), 1000);
            }
            return;
        }

        isRequestInProgress = true;

        likeIcon.classList.remove('hint-animation');
        const isCurrentlyLiked = likeIcon.classList.contains('liked');
        const method = isCurrentlyLiked ? 'DELETE' : 'POST';

        try {
            // Optimistic UI update
            const newLikedState = !isCurrentlyLiked;
            likeIcon.classList.toggle('liked', newLikedState);
            localStorage.setItem(storageKey, newLikedState);

            const data = await fetchApiData(`/api/likes/${slug}`, { method });

            // Update all like count displays for this slug (including the global ones)
            const countElements = document.querySelectorAll(`[data-like-count][data-slug="${slug}"]`);
            countElements.forEach(el => {
                const count = data.count;
                const isDetailed = el.closest('.post-meta') || el.dataset.detailed !== undefined;
                el.textContent = isDetailed ? `${count === 0 ? 'No likes' : count === 1 ? '1 like' : count + ' likes'}` : count;
            });

        } catch (error) {
            console.error(`Error toggling like for ${slug}:`, error.message);
            // Revert on error
            likeIcon.classList.toggle('liked', isCurrentlyLiked);
            localStorage.setItem(storageKey, isCurrentlyLiked);
        } finally {
            isRequestInProgress = false;
        }
    });
});