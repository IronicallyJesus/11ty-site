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
            // Try to get the plain text message from the response body
            const errorText = await response.text();
            errorMessage = errorText || 'Too many requests. Please try again later.';
        } else {
            errorMessage = `Server responded with status ${response.status}`;
        }
        // Throw an error with our improved message
        throw new Error(errorMessage);
    }

    // If the response is OK, try to parse it as JSON.
    // A SyntaxError here would indicate an API problem (e.g., returning non-JSON on a 200 OK).
    return response.json();
};

document.addEventListener('DOMContentLoaded', () => {
    // Select all elements that are designated to display view counts.
    const viewCountElements = document.querySelectorAll('[data-view-count]');

    // If no such elements are found, do nothing.
    if (viewCountElements.length === 0) return;

    // Process each view count element found on the page.
    viewCountElements.forEach(async (element) => {
        const slug = element.dataset.slug;
        if (!slug) return;

        // Check if the element is on a single post page by looking for a `.post-meta` parent.
        // This distinguishes a single post view (which should be counted) from a list view.
        const isSinglePost = element.closest('.post-meta');
        const shouldIncrement = isSinglePost && !localStorage.getItem(`viewed-${slug}`);
        const apiUrl = `/api/views/${slug}`;

        try {
            const options = shouldIncrement ? { method: 'POST' } : {};
            const data = await fetchViewData(apiUrl, options);

            if (shouldIncrement) {
                // Mark as viewed to prevent re-counting on refresh.
                localStorage.setItem(`viewed-${slug}`, 'true');
            }

            // Update UI based on context (single post vs. list)
            if (isSinglePost) {
                // On a post, show "N views". Use 'Error' as a fallback if incrementing returns bad data.
                const count = data.count ?? (shouldIncrement ? 'Error' : 0);
                element.textContent = `${count} ${count === 1 ? 'view' : 'views'}`;
            } else {
                // On a list, just show the number.
                element.textContent = data.count ?? 0;
            }
        } catch (error) {
            console.error(`Error processing view count for slug ${slug}:`, error.message);
            element.textContent = 'N/A';
        }
    });
});