// ==========================================================
// 🌐 WISHES HUB USER PANEL - LIVE RENDER & SEARCH ENGINE
// Patel Studio - 2026
// ==========================================================

let allWishesData = []; // Pure database ka backup search/filter ke liye

document.addEventListener('DOMContentLoaded', () => {
    // Page open hote hi Firebase database se wishes uthayenge
    loadWishesFromFirebase();

    // Live Search Input Listener setup
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            filterWishes(query, 'All');
        });
    }
});

// 1. Firebase database se live data read pipeline
async function loadWishesFromFirebase() {
    const gridContainer = document.getElementById('wishes-grid');
    if (!gridContainer) return;

    try {
        const endpoint = "https://wishes-hub-default-rtdb.firebaseio.com/wishes.json";
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to connect with database endpoint.");

        const data = await response.json();

        if (!data) {
            gridContainer.innerHTML = `<p style="color: #888; text-align: center; grid-column: 1/-1;">✨ No wishes found. Add some from Admin Panel!</p>`;
            return;
        }

        // Object data ko standard array format me convert karke reverse (Latest First) kar rahe hain
        allWishesData = Object.keys(data).map(key => data[key]).reverse();

        // Pehli wish ko 'Wish of the Day' banner me automatic lagane ke liye (Optional)
        if (allWishesData.length > 0 && document.getElementById('daily-wish-text')) {
            document.getElementById('daily-wish-text').innerText = allWishesData[0].title;
        }

        // Cards layout render trigger karein
        renderCardsToGrid(allWishesData);

    } catch (error) {
        console.error("🚨 Grid Loader Error:", error);
        gridContainer.innerHTML = `<p style="color: #ef4444; text-align: center; grid-column: 1/-1;">❌ Connection Error: Unable to sync live feeds.</p>`;
    }
}

// 2. DOM Display/Card Matrix Generator
function renderCardsToGrid(wishesArray) {
    const gridContainer = document.getElementById('wishes-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = ""; // Purana status clear karein

    if (wishesArray.length === 0) {
        gridContainer.innerHTML = `<p style="color: #888; text-align: center; grid-column: 1/-1;">No matching wishes found.</p>`;
        return;
    }

    wishesArray.forEach(wish => {
        // Element Wrapper Card creation
        const card = document.createElement('div');
        card.className = 'wish-item-card'; // Aapke style-ui.css ke element card match karne ke liye
        card.style.cssText = "background: #fff; padding: 18px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 10px; border: 1px solid #eaeaea;";

        // Category indicator tag layout
        const tagHtml = wish.category ? `<span class="wish-tag" style="font-size: 11px; font-weight: bold; color: #4f46e5; background: #eeebff; padding: 3px 8px; border-radius: 4px; width: max-content;">#${wish.category.replace(/\s+/g, '')}</span>` : '';
        
        // Image layout banner handle
        const imageHtml = wish.image ? `<img src="${wish.image}" alt="Wish Banner" style="width: 100%; border-radius: 8px; max-height: 18px0px; object-fit: cover; display: block;">` : '';

        // Dynamic Text sharing logic for WhatsApp button
        const encodedText = encodeURIComponent(`${wish.title}\n\nRead more special wishes on Wishes Hub! ✨`);

        card.innerHTML = `
            ${tagHtml}
            ${imageHtml}
            <p style="font-size: 15px; color: #333; line-height: 1.5; margin: 5px 0; white-space: pre-wrap;">${wish.title}</p>
            <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid #f5f5f5;">
                <small style="color: #aaa; font-size: 11px;">📅 ${wish.createdAt ? new Date(wish.createdAt).toLocaleDateString() : 'Today'}</small>
                <a href="https://api.whatsapp.com/send?text=${encodedText}" target="_blank" style="font-size: 12px; color: #25d366; font-weight: bold; text-decoration: none;">Share 🟢</a>
            </div>
        `;

        gridContainer.appendChild(card);
    });
}

// 3. Search input & Category Chips processing switcher
function filterWishes(searchQuery, tagQuery) {
    let filtered = allWishesData;

    // Search bar filtration logic
    if (searchQuery) {
        filtered = filtered.filter(wish => 
            (wish.title && wish.title.toLowerCase().includes(searchQuery)) ||
            (wish.category && wish.category.toLowerCase().includes(searchQuery))
        );
    }

    // Top Category chips filtration logic
    if (tagQuery && tagQuery !== 'All') {
        filtered = filtered.filter(wish => wish.category && wish.category.toLowerCase() === tagQuery.toLowerCase());
    }

    renderCardsToGrid(filtered);
}

// 4. Global category chip click catcher
window.filterByTag = function(tagName) {
    // Active chip highlight state toggle style setup
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

// Daily wish share module click launcher
window.shareDailyWish = function() {
    const text = document.getElementById('daily-wish-text')?.innerText || "";
    if (text) {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + "\n\nDownloaded via Wishes Hub! 🌸")}`, '_blank');
    }
};
