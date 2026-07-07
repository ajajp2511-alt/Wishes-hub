// ==========================================================
// 🌐 WISHES HUB USER PANEL - LIVE RENDER & CORS ENGINE
// Patel Studio - 2026
// ==========================================================

let allWishesData = []; 

document.addEventListener('DOMContentLoaded', () => {
    loadWishesFromFirebase();

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            filterWishes(query, 'All');
        });
    }
});

async function loadWishesFromFirebase() {
    const gridContainer = document.getElementById('wishes-grid');
    if (!gridContainer) return;

    try {
        // 🔥 FIX: Agar aapka default Firebase projects block ho raha hai, toh fetch mode defaults open rakhein
        const endpoint = "https://wishes-hub-default-rtdb.firebaseio.com/wishes.json";
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);

        const data = await response.json();

        if (!data) {
            gridContainer.innerHTML = `<p style="color: #888; text-align: center; grid-column: 1/-1; padding: 20px;">✨ No wishes found. Add some from Admin Panel!</p>`;
            return;
        }

        allWishesData = Object.keys(data).map(key => data[key]).reverse();

        if (allWishesData.length > 0 && document.getElementById('daily-wish-text')) {
            document.getElementById('daily-wish-text').innerText = allWishesData[0].title;
        }

        renderCardsToGrid(allWishesData);

    } catch (error) {
        console.error("🚨 Grid Loader Error:", error);
        
        // 🛠️ FALLBACK: Agar aapka database local ya test entries check kar raha ho
        gridContainer.innerHTML = `
            <div style="text-align: center; grid-column: 1/-1; padding: 20px;">
                <p style="color: #ef4444; margin-bottom: 10px;">❌ Database Connection Refused.</p>
                <button onclick="loadWishesFromFirebase()" style="background: #4f46e5; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px;">Retry Connection 🔄</button>
            </div>
        `;
    }
}

function renderCardsToGrid(wishesArray) {
    const gridContainer = document.getElementById('wishes-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = ""; 

    if (wishesArray.length === 0) {
        gridContainer.innerHTML = `<p style="color: #888; text-align: center; grid-column: 1/-1; padding: 20px;">No matching wishes found.</p>`;
        return;
    }

    wishesArray.forEach(wish => {
        const card = document.createElement('div');
        card.className = 'wish-item-card'; 
        card.style.cssText = "background: #fff; padding: 18px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 10px; border: 1px solid #eaeaea; text-align: left;";

        const tagHtml = wish.category ? `<span class="wish-tag" style="font-size: 11px; font-weight: bold; color: #4f46e5; background: #eeebff; padding: 3px 8px; border-radius: 4px; width: max-content;">#${wish.category.replace(/\s+/g, '')}</span>` : '';
        const imageHtml = wish.image ? `<img src="${wish.image}" alt="Wish Banner" style="width: 100%; border-radius: 8px; max-height: 180px; object-fit: cover; display: block;">` : '';
        const encodedText = encodeURIComponent(`${wish.title || ''}\n\nRead more on Wishes Hub! ✨`);

        card.innerHTML = `
            ${tagHtml}
            ${imageHtml}
            <p style="font-size: 15px; color: #333; line-height: 1.5; margin: 5px 0; white-space: pre-wrap;">${wish.title || 'Special Wish'}</p>
            <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid #f5f5f5;">
                <small style="color: #aaa; font-size: 11px;">📅 ${wish.createdAt ? new Date(wish.createdAt).toLocaleDateString() : 'Today'}</small>
                <a href="https://api.whatsapp.com/send?text=${encodedText}" target="_blank" style="font-size: 12px; color: #25d366; font-weight: bold; text-decoration: none;">Share 🟢</a>
            </div>
        `;

        gridContainer.appendChild(card);
    });
}

function filterWishes(searchQuery, tagQuery) {
    let filtered = allWishesData;

    if (searchQuery) {
        filtered = filtered.filter(wish => 
            (wish.title && wish.title.toLowerCase().includes(searchQuery)) ||
            (wish.category && wish.category.toLowerCase().includes(searchQuery))
        );
    }

    if (tagQuery && tagQuery !== 'All') {
        filtered = filtered.filter(wish => wish.category && wish.category.toLowerCase() === tagQuery.toLowerCase());
    }

    renderCardsToGrid(filtered);
}

window.filterByTag = function(tagName) {
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        chip.classList.remove('active');
        if (chip.innerText.replace('#', '').toLowerCase() === tagName.toLowerCase() || (tagName === 'All' && chip.innerText === 'All')) {
            chip.classList.add('active');
        }
    });

    const currentSearch = document.getElementById('search-input')?.value.toLowerCase().trim() || "";
    filterWishes(currentSearch, tagName);
};

window.shareDailyWish = function() {
    const text = document.getElementById('daily-wish-text')?.innerText || "";
    if (text) {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + "\n\nDownloaded via Wishes Hub! 🌸")}`, '_blank');
    }
};
