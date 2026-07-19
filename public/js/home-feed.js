// js/home-feed.js
import initCategories from '../public/features/categories-manager/categories-assembly.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM loaded, initializing...");
    const gridContainer = document.getElementById('wishes-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = "Fetching...";

    try {
        const response = await fetch('/api/get-wishes');
        const data = await response.json();

        if (data && data.wishes) {
            console.log("Data received:", data.wishes);
            renderCardsToGrid(data.wishes);

            // Yahan check karein ki kya ye function call ho raha hai
            console.log("Calling initCategories...");
            initCategories(data.wishes, (filteredData) => {
                renderCardsToGrid(filteredData);
            });
        } else {
            gridContainer.innerHTML = "No wishes found.";
        }
    } catch (err) {
        gridContainer.innerHTML = "Error: " + err.message;
        console.error("Fetch Error:", err);
    }
});

function renderCardsToGrid(wishesArray) {
    const gridContainer = document.getElementById('wishes-grid');
    if (!gridContainer) return;
    
    gridContainer.innerHTML = ""; 
    wishesArray.forEach(wish => {
        const card = document.createElement('div');
        card.className = 'wish-item-card';
        card.style.cssText = "background: #1e1e1e; padding: 15px; border-radius: 15px; margin-bottom: 10px; border: 1px solid #333;";
        card.innerHTML = `<h3 style="color:#fff; margin:0;">${wish.title || 'Untitled'}</h3>
                          <p style="color:#aaa; font-size: 0.8em;">Category: ${wish.category || 'General'}</p>`;
        gridContainer.appendChild(card);
    });
}
