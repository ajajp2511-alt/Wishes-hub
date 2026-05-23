// Feature: Category & Sub-Category Filtering
window.currentCategory = 'All';

// 1. Category Chips Render Karna
function setupCategoryChips(categories) {
    const nav = document.getElementById('category-bar');
    nav.innerHTML = categories.map(cat => `
        <button class="chip ${cat === 'All' ? 'active' : ''}" 
                onclick="applyFilter('${cat}', this)">
            ${cat}
        </button>
    `).join('');
}

// 2. Filter Apply Karne Ka Logic
window.applyFilter = (category, element) => {
    // UI Update: Active class badalna
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    element.classList.add('active');

    window.currentCategory = category;

    // Data Filtering
    const filteredData = (category === 'All') 
        ? allWishes 
        : allWishes.filter(wish => wish.category === category);

    // Grid ko reload karna (Ye function feat-storage.js mein hai)
    renderWishes(filteredData);
};

// 3. Search Feature (Directly Integrated)
window.searchWishes = (query) => {
    const q = query.toLowerCase();
    const searchedData = allWishes.filter(wish => 
        wish.text.toLowerCase().includes(q) || 
        wish.category.toLowerCase().includes(q)
    );
    renderWishes(searchedData);
};
