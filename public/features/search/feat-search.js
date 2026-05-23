// Feature: Real-time Search Engine
window.initSearch = () => {
    const searchInput = document.getElementById('search-input');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query === "") {
            renderWishes(allWishes); // Agar search khali hai toh sab dikhao
            return;
        }

        const matchedWishes = allWishes.filter(wish => 
            wish.text.toLowerCase().includes(query) || 
            (wish.category && wish.category.toLowerCase().includes(query))
        );

        renderWishes(matchedWishes);
    });
};
