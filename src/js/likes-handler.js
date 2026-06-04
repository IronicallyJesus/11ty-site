/**
 * Like button handler — POST/DELETE with optimistic UI.
 */
document.addEventListener('DOMContentLoaded', () => {
    const likeBtn = document.querySelector('.like-btn');
    if (!likeBtn) return;

    const slug = likeBtn.dataset.slug;
    const storageKey = 'liked-' + slug;
    let busy = false;

    if (localStorage.getItem(storageKey) === 'true') {
        likeBtn.classList.add('liked');
    }

    likeBtn.addEventListener('click', async () => {
        if (busy) return;

        if (!localStorage.getItem('privacy-consent')) {
            const banner = document.getElementById('consent-banner');
            if (banner) banner.classList.remove('hidden');
            return;
        }

        busy = true;
        const wasLiked = likeBtn.classList.contains('liked');
        const method = wasLiked ? 'DELETE' : 'POST';

        try {
            likeBtn.classList.toggle('liked', !wasLiked);
            localStorage.setItem(storageKey, !wasLiked);

            const data = await fetchApiData('/api/likes/' + slug, { method });

            document.querySelectorAll('[data-like-count][data-slug="' + slug + '"]').forEach(el => {
                el.textContent = data.count;
            });
        } catch (e) {
            console.error('Like error:', e.message);
            likeBtn.classList.toggle('liked', wasLiked);
            localStorage.setItem(storageKey, wasLiked);
        } finally {
            busy = false;
        }
    });
});
