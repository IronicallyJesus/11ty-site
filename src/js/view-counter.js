document.addEventListener('DOMContentLoaded', () => {
    // Select all elements that are designated to display view counts.
    const viewCountElements = document.querySelectorAll('[data-view-count]');

    // If no such elements are found, do nothing.
    if (viewCountElements.length === 0) {
        return;
    }

    // Process each view count element found on the page.
    viewCountElements.forEach(element => {
        const slug = element.dataset.slug;
        if (!slug) {
            // Skip if the element is missing the data-slug attribute.
            return;
        }

        // Check if the element is on a single post page by looking for a `.post-meta` parent.
        // This distinguishes a single post view (which should be counted) from a list view.
        const isSinglePost = element.closest('.post-meta');

        if (isSinglePost) {
            // On a single post page, increment the view count.
            const viewed = localStorage.getItem(`viewed-${slug}`);

            // Only increment if the user hasn't viewed this post in the current session.
            if (!viewed) {
                fetch(`/api/views/${slug}`, { method: 'POST' })
                    .then(response => {
                        if (!response.ok) throw new Error('Network response was not ok');
                        return response.json();
                    })
                    .then(data => {
                        element.textContent = data.count ?? 'Error';
                        // Mark as viewed to prevent re-counting on refresh.
                        localStorage.setItem(`viewed-${slug}`, 'true');
                    })
                    .catch(error => {
                        console.error(`Error incrementing view count for slug ${slug}:`, error);
                        element.textContent = 'N/A';
                    });
            } else {
                // If already viewed in this session, just fetch the count without incrementing.
                fetch(`/api/views/${slug}`)
                    .then(response => {
                        if (!response.ok) throw new Error('Network response was not ok');
                        return response.json();
                    })
                    .then(data => {
                        element.textContent = data.count ?? 0;
                    })
                    .catch(error => {
                        console.error(`Error fetching view count for slug ${slug}:`, error);
                        element.textContent = 'N/A';
                    });
            }
        } else {
            // On a list page (like the main blog page), just fetch and display the count.
            fetch(`/api/views/${slug}`)
                .then(response => response.json())
                .then(data => {
                    element.textContent = data.count ?? 0;
                })
                .catch(error => {
                    console.error(`Error fetching view count for slug ${slug}:`, error);
                    element.textContent = 'N/A';
                });
        }
    });
});