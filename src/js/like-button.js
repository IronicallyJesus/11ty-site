/**
 * Helper function to handle fetch requests, parse the response, and manage common errors.
 * @param {string} url - The URL to fetch.
 * @param {object} options - The options for the fetch request.
 * @returns {Promise<object>} - A promise that resolves to the JSON response data.
 */
const fetchApiData = async (url, options = {}) => {
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
    return response.json();
};

document.addEventListener('DOMContentLoaded', () => {
    const likeIcon = document.querySelector('[data-like-button]');
    if (!likeIcon) return;

    const slug = likeIcon.dataset.slug;
    const likeCountSpan = document.querySelector(`[data-like-count][data-slug="${slug}"]`);
    const storageKey = `liked-${slug}`;
    let isRequestInProgress = false;

    // Function to update the UI based on liked state and count
    const updateUI = (isLiked, count) => {
        if (likeCountSpan) {
            if (count === 0) {
                likeCountSpan.textContent = 'No likes';
            } else if (count === 1) {
                likeCountSpan.textContent = '1 like';
            } else {
                likeCountSpan.textContent = `${count} likes`;
            }
        }
        if (isLiked) {
            likeIcon.classList.add('liked');
        } else {
            likeIcon.classList.remove('liked');
        }
    };

    // Fetch and display the initial like count and set the initial state
    const getInitialState = async () => {
        try {
            const data = await fetchApiData(`/api/likes/${slug}`);
            const isLiked = localStorage.getItem(storageKey) === 'true';
            updateUI(isLiked, data.count || 0);
            // Check if the user has ever interacted with this button before
            if (localStorage.getItem(storageKey) === null) {
                // If not, add the animation class
                likeIcon.classList.add('hint-animation');
                // Remove the animation after it runs to prevent it from looping
                setTimeout(() => {
                    likeIcon.classList.remove('hint-animation');
                }, 2000); // Animation duration is 2s
            }
        } catch (error) {
            console.error(`Error fetching initial like state for slug ${slug}:`, error.message);
        }
    };

    // Add click event listener to the icon
    likeIcon.addEventListener('click', async () => {
        // If a request is already in progress, do nothing.
        if (isRequestInProgress) {
            return;
        }
        isRequestInProgress = true;

        // Stop the hint animation if it's running
        likeIcon.classList.remove('hint-animation');
        // Toggle the liked state
        const isCurrentlyLiked = likeIcon.classList.contains('liked');
        const method = isCurrentlyLiked ? 'DELETE' : 'POST';

        try {
            const data = await fetchApiData(`/api/likes/${slug}`, { method });

            const isNowLiked = !isCurrentlyLiked;
            // Update localStorage to remember the user's choice
            localStorage.setItem(storageKey, isNowLiked);
            // Update the button and count on the page
            updateUI(isNowLiked, data.count);
        } catch (error) {
            console.error(`Error submitting like/unlike for slug ${slug}:`, error.message);
        } finally {
            isRequestInProgress = false;
        }
    });

    // Load the initial state when the page loads
    getInitialState();
});