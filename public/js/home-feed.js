// ==========================================================
// 🌐 WISHES HUB USER PANEL - HOME FEED ENGINE (UPDATED)
// Patel Studio - 2026
// ==========================================================

import initCategories from '../features/categories-manager/categories-assembly.js';

let allWishesData = []; 
let lastDataHash = ""; 

document.addEventListener('DOMContentLoaded', () => {
    fetchLiveWishes();
    setInterval(() => { fetchLiveWishes(true); }, 4000);

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterWishes(e.target.value.toLowerCase().trim(), "All");
        });
    }
});

async function fetchLiveWishes(isBackground = false) {
    const gridContainer = document.getElementById('wishes-grid');
    if (!gridContainer) return;

    try {
        const response = await fetch(`/api/get-wishes?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error("Network response error");
        let result = await response.json();

        if (!result.success || !result.wishes || result.wishes.length === 0) return;

        const currentDataHash = JSON.stringify(result.wishes);
        if (currentDataHash === lastDataHash) return; 
        lastDataHash = currentDataHash;

        allWishesData = result.wishes.map(item => {
            if (!item) return null;
            const cleanId = item.id || item._id || item.key || null;
            let extractedTitle = item.title || item.wishText || item.text || '';
            let finalImage = item.image || item.fileUrl || item.imageUrl || null;

            return {
                id: cleanId ? String(cleanId).trim() : null,
                title: extractedTitle.toString().trim(),
                category: item.category || item.mainCategory || 'General',
                image: finalImage,
                // Naya field: Filter karne ke liye tag
                tag: (item.category || 'General').toLowerCase().trim()
            };
        }).filter(item => item && item.id);

        if (allWishesData.length > 0) {
            // Data aane ke baad Categories Feature initialize karein
            initCategories(allWishesData, (filteredData) => {
                renderCardsToGrid(filteredData);
            });
            renderCardsToGrid(allWishesData);
        }
    } catch (error) {
        console.error("🚨 Feed Error:", error);
    }
}

// Window global functions
window.renderCardsToGrid = function(wishesArray) {
    const gridContainer = document.getElementById('wishes-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = ""; 
    gridContainer.style.cssText = "display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; padding: 10px 0;";

    wishesArray.forEach(wish => {
        const card = document.createElement('div');
        card.className = 'wish-item-card'; 
        card.style.cssText = "background: #1e1e1e; padding: 16px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); display: flex; flex-direction: column; gap: 12px; border: 1px solid #333; text-align: left; cursor: pointer;";
        card.setAttribute('onclick', `navigateToWish(event, '${encodeURIComponent(wish.id)}')`);

        const tagHtml = wish.category ? `<span class="wish-tag" style="font-size: 11px; font-weight: bold; color: #00e5ff; background: rgba(0,229,255,0.1); padding: 4px 10px; border-radius: 20px; width: max-content;">#${wish.category}</span>` : '';
        
        let imageHtml = wish.image 
            ? `<img src="${wish.image.includes('telegram') ? 'https://images.weserv.nl/?url=' + encodeURIComponent(wish.image) : wish.image}" alt="Wish" style="width: 100%; height: 180px; border-radius: 12px; object-fit: cover; display: block; background: #2a2a2a;">`
            : `<div style="width: 100%; height: 120px; background: #2a2a2a; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 13px;">✨ Special Wish</div>`;

        const encodedText = encodeURIComponent(`${wish.title}\n\nRead more on Wishes Hub! ✨`);

        card.innerHTML = `
            ${imageHtml}
            ${tagHtml}
            <p style="font-size: 16px; color: #ffffff; line-height: 1.5; margin: 5px 0; font-weight: bold;">${wish.title}</p>
            <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid #333;">
                <span style="font-size: 13px; color: #00e5ff; font-weight: bold;">View Details →</span>
                <div style="display: flex; gap: 8px;">
                    <button onclick="event.stopPropagation(); copyTextToClipboard('${wish.title.replace(/'/g, "\\'")}')" style="background: #333; color: #fff; border: none; padding: 6px 12px; border-radius: 8px; cursor: pointer;">Copy</button>
                    <a href="https://api.whatsapp.com/send?text=${encodedText}" target="_blank" onclick="event.stopPropagation();" style="background: #25d366; color: #fff; padding: 6px 12px; border-radius: 8px; text-decoration: none;">Share</a>
                </div>
            </div>
        `;
        gridContainer.appendChild(card);
    });
};

window.navigateToWish = function(event, encodedWishId) {
    if (event.target.tagName === 'BUTTON' || event.target.tagName === 'A' || event.target.closest('a')) return; 
    window.location.href = `/page/wish.html?id=${encodedWishId}`;
};

window.copyTextToClipboard = function(text) {
    navigator.clipboard.writeText(text);
    alert('Copied! 🔥');
};

function filterWishes(searchQuery, tagQuery) {
    let filtered = allWishesData;
    if (searchQuery) {
        filtered = filtered.filter(wish => wish.title.toLowerCase().includes(searchQuery) || wish.category.toLowerCase().includes(searchQuery));
    }
    renderCardsToGrid(filtered);
}
