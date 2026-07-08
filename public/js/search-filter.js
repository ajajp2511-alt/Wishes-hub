// Wishes Hub - Live Search & Tag Filter Logic by Patel Studio

// Global function jo HTML chips ke onclick se direct connect hogi
function filterByTag(tagName) {
    const chips = document.querySelectorAll('.chip');
    const wishesGrid = document.getElementById('wishes-grid');
    const cards = wishesGrid ? wishesGrid.querySelectorAll('.wish-card') : []; // Assuming your grid has .wish-card items

    // 1. Update Active Class on Chips
    chips.forEach(chip => {
        if (chip.textContent.replace('#', '').trim().toLowerCase() === tagName.toLowerCase() || 
            (tagName === 'All' && chip.textContent.trim() === 'All')) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });

    // 2. Filter Logic for Cards
    cards.forEach(card => {
        // Card ke andar hidden data-tag attribute ya text se match karne ke liye
        const cardTag = card.getAttribute('data-tag') || ''; 
        if (tagName === 'All' || cardTag.toLowerCase() === tagName.toLowerCase()) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Search Bar Input Filter Logic
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const wishesGrid = document.getElementById('wishes-grid');
            const cards = wishesGrid ? wishesGrid.querySelectorAll('.wish-card') : [];

            cards.forEach(card => {
                const text = card.innerText.toLowerCase();
                if (text.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});
