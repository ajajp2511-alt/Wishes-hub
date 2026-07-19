import initCategories from '/features/categories-manager/categories-assembly.js';

let allWishesData = []; 

document.addEventListener('DOMContentLoaded', () => {
    // Jaldi feedback ke liye message change karein
    const gridContainer = document.getElementById('wishes-grid');
    if (gridContainer) gridContainer.innerHTML = "<p>Loading wishes...</p>";
    
    fetchLiveWishes();
});

async function fetchLiveWishes() {
    const gridContainer = document.getElementById('wishes-grid');
    try {
        const response = await fetch('/api/get-wishes');
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const result = await response.json();

        if (result && result.wishes) {
            allWishesData = result.wishes;
            renderCardsToGrid(allWishesData);
            initCategories(allWishesData, (filteredData) => renderCardsToGrid(filteredData));
        } else {
            throw new Error("Invalid API response format");
        }
    } catch (error) {
        // Agar error aaye, toh screen par dikhayein
        if (gridContainer) {
            gridContainer.innerHTML = `<p style="color:red;">Error: ${error.message}. API check karein.</p>`;
        }
    }
}

window.renderCardsToGrid = function(wishesArray) {
    const gridContainer = document.getElementById('wishes-grid');
    if (!gridContainer) return;
    
    gridContainer.innerHTML = ""; 
    wishesArray.forEach(wish => {
        const card = document.createElement('div');
        card.style.cssText = "background: #1e1e1e; padding: 15px; border-radius: 15px; margin-bottom: 10px;";
        card.innerHTML = `<p style="color:#fff;">${wish.title || wish.wishText || 'No Title'}</p>`;
        gridContainer.appendChild(card);
    });
};
