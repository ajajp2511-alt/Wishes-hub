import initCategories from '/features/categories-manager/categories-assembly.js'; 

// Script load check
console.log("Feed Script Loaded");

let allWishesData = []; 

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded - Fetching data...");
    fetchLiveWishes();
});

async function fetchLiveWishes() {
    const gridContainer = document.getElementById('wishes-grid');
    
    try {
        const response = await fetch('/api/get-wishes');
        const result = await response.json();

        if (result && result.wishes) {
            console.log("Data mila:", result.wishes);
            renderCardsToGrid(result.wishes);
            initCategories(result.wishes, (filtered) => renderCardsToGrid(filtered));
        } else {
            console.log("Data format galat hai");
            gridContainer.innerHTML = "<p>Data format error.</p>";
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        gridContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

function renderCardsToGrid(wishesArray) {
    const gridContainer = document.getElementById('wishes-grid');
    if (!gridContainer) return;
    
    gridContainer.innerHTML = ""; 
    wishesArray.forEach(wish => {
        const card = document.createElement('div');
        card.style.cssText = "background: #1e1e1e; padding: 15px; border-radius: 15px; margin-bottom: 10px;";
        card.innerHTML = `<p style="color:#fff;">${wish.title || 'Untitled'}</p>`;
        gridContainer.appendChild(card);
    });
}
