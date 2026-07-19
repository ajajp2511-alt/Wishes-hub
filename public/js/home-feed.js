import initCategories from '../features/categories-manager/categories-assembly.js';

let allWishesData = []; 

document.addEventListener('DOMContentLoaded', () => {
    fetchLiveWishes();
    setInterval(fetchLiveWishes, 10000); // 10 seconds refresh
});

async function fetchLiveWishes() {
    const gridContainer = document.getElementById('wishes-grid');
    
    try {
        const response = await fetch(`/api/get-wishes?t=${new Date().getTime()}`);
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !result.wishes || result.wishes.length === 0) {
            gridContainer.innerHTML = "<p style='color:#666;'>No wishes available at the moment.</p>";
            return;
        }

        allWishesData = result.wishes.map(item => ({
            id: item.id || item._id,
            title: item.title || item.wishText || 'Untitled Wish',
            category: item.category || 'General',
            image: item.image || item.fileUrl || '',
            tag: (item.category || 'General').toLowerCase().trim()
        }));

        renderCardsToGrid(allWishesData);
        
        // Categories Initialize
        initCategories(allWishesData, (filteredData) => {
            renderCardsToGrid(filteredData);
        });

    } catch (error) {
        console.error("Feed Error:", error);
        gridContainer.innerHTML = `<p style="color:red; text-align:center;">Failed to load wishes. Please try again later.</p>`;
    }
}

window.renderCardsToGrid = function(wishesArray) {
    const gridContainer = document.getElementById('wishes-grid');
    if (!gridContainer) return;
    
    gridContainer.innerHTML = ""; 
    
    wishesArray.forEach(wish => {
        const card = document.createElement('div');
        card.className = 'wish-item-card'; 
        card.style.cssText = "background: #1e1e1e; padding: 15px; border-radius: 15px; border: 1px solid #333; margin-bottom: 10px;";
        card.innerHTML = `<p style="color:#fff; font-weight:bold;">${wish.title}</p>`;
        gridContainer.appendChild(card);
    });
};
