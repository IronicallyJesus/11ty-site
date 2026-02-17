/**
 * Handles automatic view tracking and initializes stats (views/likes) for elements on the page.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Automatically track the current page view
    const trackView = () => {
        const currentPageSlug = document.body.dataset.pageSlug;
        if (currentPageSlug && localStorage.getItem('privacy-consent')) {
            const viewedKey = `viewed-${currentPageSlug}`;
            if (!localStorage.getItem(viewedKey)) {
                fetchApiData(`/api/views/${currentPageSlug}`, { method: 'POST' })
                    .then(() => localStorage.setItem(viewedKey, 'true'))
                    .catch(err => console.error(`Error tracking view:`, err));
            }
        }
    };

    // Initial attempt
    trackView();

    // Listen for consent acceptance
    window.addEventListener('consent-accepted', () => {
        trackView();
    });

    // 2. Initialize all Stats (Views and Likes) found on the page
    const statsElements = document.querySelectorAll('[data-view-count], [data-like-count]');

    statsElements.forEach(async (element) => {
        const slug = element.dataset.slug;
        if (!slug) return;

        const isView = 'viewCount' in element.dataset;
        const apiUrl = isView ? `/api/views/${slug}` : `/api/likes/${slug}`;

        try {
            const data = await fetchApiData(apiUrl);
            const count = data.count ?? 0;

            // Check if it's a detailed display (with text) or a simple number (like in a list)
            const isDetailed = element.closest('.post-meta') || element.dataset.detailed !== undefined;

            if (isView) {
                element.textContent = isDetailed ? `${count} ${count === 1 ? 'view' : 'views'}` : count;
            } else {
                element.textContent = isDetailed ? `${count === 0 ? 'No likes' : count === 1 ? '1 like' : count + ' likes'}` : count;
            }
        } catch (error) {
            console.error(`Error fetching stats for ${slug}:`, error.message);
            element.textContent = 'N/A';
        }
    });
});