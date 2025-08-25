document.addEventListener('DOMContentLoaded', () => {
    const likeIcon = document.querySelector('[data-like-button]');
    if (!likeIcon) return;

    const slug = likeIcon.dataset.slug;
    const likeCountSpan = document.querySelector(`[data-like-count][data-slug="${slug}"]`);
    const storageKey = `liked-${slug}`;

    // Function to update the UI based on liked state and count
    const updateUI = (isLiked, count) => {
        if (likeCountSpan) {
            likeCountSpan.textContent = count;
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
            const response = await fetch(`/api/likes/${slug}`);
            if (!response.ok) return;
            const data = await response.json();
            const isLiked = localStorage.getItem(storageKey) === 'true';
            updateUI(isLiked, data.count || 0);
        } catch (error) {
            console.error('Error fetching likes:', error);
        }
    };

    // Add click event listener to the icon
    likeIcon.addEventListener('click', async () => {
        const isCurrentlyLiked = likeIcon.classList.contains('liked');
        const method = isCurrentlyLiked ? 'DELETE' : 'POST';

        try {
            const response = await fetch(`/api/likes/${slug}`, { method });
            if (!response.ok) return;
            const data = await response.json();

            const isNowLiked = !isCurrentlyLiked;
            // Update localStorage to remember the user's choice
            localStorage.setItem(storageKey, isNowLiked);
            // Update the button and count on the page
            updateUI(isNowLiked, data.count);

        } catch (error) {
            console.error('Error submitting like/unlike:', error);
        }
    });

    // Load the initial state when the page loads
    getInitialState();
});