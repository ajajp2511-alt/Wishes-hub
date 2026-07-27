/* Wishes Search & Filter Engine */
export function initSearchLogic() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.wish-card');

        cards.forEach(card => {
            const cardBody = card.querySelector('.wish-text');
            const cardText = cardBody ? cardBody.innerText.toLowerCase() : '';
            const cardCategory = card.getAttribute('data-category') || '';

            const matchesCategory = (typeof window.activeCategory === 'undefined' || window.activeCategory === "All" || cardCategory === window.activeCategory);
            const matchesSearch = cardText.includes(query);

            if (matchesCategory && matchesSearch) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
}
