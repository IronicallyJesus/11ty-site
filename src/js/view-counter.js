document.addEventListener('DOMContentLoaded', () => {
    const viewCountElement = document.querySelector('[data-view-count]');

    if (viewCountElement) {
        const slug = viewCountElement.dataset.slug;

        // Function to fetch and display the view count
        const getViews = async () => {
            try {
                const response = await fetch(`/api/views/${slug}`);
                if (!response.ok) throw new Error('Failed to fetch views');
                const data = await response.json();
                viewCountElement.textContent = `${data.count} views`;
            } catch (error) {
                console.error('Error getting views:', error);
                viewCountElement.textContent = 'Could not load views';
            }
        };

        // Function to increment the view count
        const incrementView = async () => {
            try {
                // Use a flag in localStorage to prevent incrementing on every refresh
                const viewed = localStorage.getItem(`viewed-${slug}`);
                if (!viewed) {
                    await fetch(`/api/views/${slug}`, { method: 'POST' });
                    localStorage.setItem(`viewed-${slug}`, 'true');
                }
            } catch (error) {
                console.error('Error incrementing view:', error);
            }
        };

        // Run the functions
        incrementView().then(getViews);
    }
});
