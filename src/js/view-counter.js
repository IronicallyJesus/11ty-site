/**
 * Helper function to handle fetch requests, parse the response, and manage common errors.
 * @param {string} url - The URL to fetch.
 * @param {object} options - The options for the fetch request.
 * @returns {Promise<object>} - A promise that resolves to the JSON response data.
 */
const fetchViewData = async (url, options = {}) => {
    const response = await fetch(url, options);

    if (!response.ok) {
        let errorMessage;
        // Specifically handle the "Too Many Requests" error
        if (response.status === 429) {
            const errorText = await response.text();
            errorMessage = errorText || 'Too many requests. Please try again later.';
        } else {
            errorMessage = `Server responded with status ${response.status}`;
        }
        throw new Error(errorMessage);
    }

    return response.json();
};

/**
 * Tracks a view for a given slug if it hasn't been viewed in this session.
 * @param {string} slug - The slug to track.
 */
const trackView = async (slug) => {
    if (!slug) return;

    const viewedKey = `viewed-${slug}`;
    if (localStorage.getItem(viewedKey)) return;

    try {
        const response = await fetch(`/api/views/${slug}`, { method: 'POST' });
        if (response.ok) {
            localStorage.setItem(viewedKey, 'true');
        }
    } catch (error) {
        console.error(`Error tracking view for slug ${slug}:`, error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Automatically track the current page view
    const currentPageSlug = document.body.dataset.pageSlug;
    if (currentPageSlug) {
        trackView(currentPageSlug);
    }

    // 2. Update any view count elements on the page
    const viewCountElements = document.querySelectorAll('[data-view-count]');

    viewCountElements.forEach(async (element) => {
        const slug = element.dataset.slug;
        if (!slug) return;

        // Special case: if this element is for the current page, 
        // we might have already incremented it, so we just want to GET the count now.
        // But the API handles POST as "increment and return new count",
        // and GET as "just return current count".

        const apiUrl = `/api/views/${slug}`;

        try {
            // If it's the current page's primary view counter, we could have tracked it above.
            // But we still need to fetch the count to display it.
            const data = await fetchViewData(apiUrl);
            const count = data.count ?? 0;

            // Check if it's a single post/page display or a list
            const isDetailedView = element.closest('.post-meta') || element.id === 'main-view-count';

            if (isDetailedView) {
                element.textContent = `${count} ${count === 1 ? 'view' : 'views'}`;
            } else {
                element.textContent = count;
            }
        } catch (error) {
            console.error(`Error fetching view count for slug ${slug}:`, error.message);
            element.textContent = 'N/A';
        }
    });
});