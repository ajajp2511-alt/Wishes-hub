// js/home-feed.js
import initCategories from '../public/features/categories-manager/categories-assembly.js';

export async function initHomeFeed() {
    console.log("Initializing Home Feed...");
    const gridContainer = document.getElementById('wishes-grid');
    
    if (!gridContainer) {
        console.error("Grid container not found!");
        return;
    }

    // Pehle loading state show karein
    gridContainer.innerHTML = "<p>Loading wishes...</p>";

    try {
        const response = await fetch('/api/get-wishes');
        const data = await response.json();

        if (data && data.wishes && data.wishes.length > 0) {
            console.log("Data successfully received:", data.wishes);
            renderCardsToGrid(data.wishes);

            // Categories initialize karein
            initCategories(data.wishes, (filteredData) => {
                renderCardsToGrid(filteredData);
            });
        } else {
            gridContainer.innerHTML = "<p>No wishes available at the moment.</p>";
        }
    } catch (err) {
        console.error("Home Feed Fetch Error:", err);
        gridContainer.innerHTML = `<p style="color:red">Failed to load wishes. Please try again later.</p>`;
    }
}

function renderCardsToGrid(wishesArray) {
    const gridContainer = document.getElementById('wishes-grid');
    if (!gridContainer) return;
    
    // Grid saaf karein
    gridContainer.innerHTML = ""; 
    
    wishesArray.forEach(wish => {
        const card = document.createElement('div');
        card.className = 'wish-item-card';
        // Basic styling jo aapne use ki thi
        card.style.cssText = "background: #1e1e1e; padding: 15px; border-radius: 15px; margin-bottom: 10px; border: 1px solid #333; color: white;";
        
        card.innerHTML = `
            <h3 style="margin:0; font-size: 1.2em;">${wish.title || 'Untitled Wish'}</h3>
            <p style="color:#aaa; font-size: 0.8em; margin-top: 5px;">Category: ${wish.category || 'General'}</p>
        `;
        gridContainer.appendChild(card);
    });
}
