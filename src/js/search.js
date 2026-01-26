document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const postsContainer = document.querySelector('.space-y-8');
    const posts = Array.from(postsContainer.querySelectorAll('.card'));

    let searchIndex = null;

    const fetchIndex = async () => {
        try {
            const response = await fetch('/search-index.json');
            searchIndex = await response.json();
        } catch (error) {
            console.error('Error fetching search index:', error);
        }
    };

    const performSearch = (query) => {
        if (!searchIndex) return;

        const filteredPosts = searchIndex.filter(post => {
            const searchStr = `${post.title} ${post.excerpt} ${post.content}`.toLowerCase();
            return searchStr.includes(query.toLowerCase());
        });

        const filteredUrls = new Set(filteredPosts.map(post => post.url));

        posts.forEach(post => {
            const postUrl = post.querySelector('a').getAttribute('href');
            if (filteredUrls.has(postUrl) || query === '') {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });

        // Show "no results" message if needed
        let noResultsMsg = document.getElementById('no-results-message');
        if (filteredUrls.size === 0 && query !== '') {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('p');
                noResultsMsg.id = 'no-results-message';
                noResultsMsg.className = 'text-center text-gray-500 py-12';
                noResultsMsg.textContent = 'No articles found matching your search.';
                postsContainer.appendChild(noResultsMsg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    };

    if (searchInput) {
        fetchIndex();
        searchInput.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });
    }
});
