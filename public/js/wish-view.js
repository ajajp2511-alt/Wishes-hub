// ==========================================================
// 🌐 WISHES HUB USER PANEL - LIGHTWEIGHT BACKGROUND REFRESH ENGINE
// Patel Studio - 2026
// ==========================================================

let allWishesData = []; 
let lastDataHash = ""; // Data change detect karne ke liye tracker

document.addEventListener('DOMContentLoaded', () => {
    // Pehli baar page load hote hi immediately data fetch karein
    fetchLiveWishes();

    // 🔥 REAL-TIME ENGINE: Har 4 seconds me background me automatic naya data check hoga
    setInterval(() => {
        fetchLiveWishes(true); // true matlab background silent check
    }, 4000);

    // Live Search Input Listener setup
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            filterWishes(query, 'All');
        });
    }
});

// Main Core Fetch Pipeline
async function fetchLiveWishes(isBackground = false) {
    const gridContainer = document.getElementById('wishes-grid');
    if (!gridContainer) return;

    // Agar pehli baar load ho raha ho toh screen par syncing dikhayein
    if (!isBackground && allWishesData.length === 0) {
        gridContainer.innerHTML = `<p style="color: #666; text-align: center; grid-column: 1/-1; padding: 20px;">📡 Syncing with Patel Studio live cloud feeds...</p>`;
    }

    try {
        // Cache bypass timestamp taaki har scan me bilkul fresh entry mile
        const endpoint = `https://wishes-hub-default-rtdb.firebaseio.com/wishes.json?t=${new Date().getTime()}`;
        const response = await fetch(endpoint);
        
        if (!response.ok) throw new Error("Cloud database rejected the payload request.");
        const data = await response.json();

        if (!data) {
            gridContainer.innerHTML = `<p style="color: #888; text-align: center; grid-column: 1/-1; padding: 20px;">✨ No wishes found. Add some from Admin Panel!</p>`;
            return;
        }

        // Data hashing checking - Agar database me koi naya change nahi hua toh re-render nahi karega (Performance optimization)
        const currentDataHash = JSON.stringify(data);
        if (currentDataHash === lastDataHash) {
            return; // No new data, exit silently
        }
        lastDataHash = currentDataHash;

        // Convert Object Matrix into Array Format (Latest First)
        allWishesData = Object.keys(data).map(key => {
            return {
                id: key,
                title: data[key].title || data[key].text || data[key].wishText || '',
                category: data[key].category || '',
                image: data[key].image || null,
                createdAt: data[key].createdAt || new Date().toISOString()
            };
        }).reverse();

        // Wish of the Day Banner Auto sync
        if (allWishesData.length > 0 && document.getElementById('daily-wish-text')) {
            document.getElementById('daily-wish-text').innerText = allWishesData[0].title;
        }

        // Fresh dynamic cards inject karein
        renderCardsToGrid(allWishesData);
        console.log("⚡ Live Cloud Feed Synced successfully.");

    } catch (error) {
        console.error("🚨 Cloud Engine Error:", error);
        // Agar connection error background me aaye toh running cards ko crash mat hone dena
        if (allWishesData.length === 0) {
            gridContainer.innerHTML = `<p style="color: #ef4444; text-align: center; grid-column: 1/-1; padding: 20px;">❌ Connection Error: Unable to sync live feeds.</p>`;
        }
    }
}

// UI HTML Card Generator Layout
function renderCardsToGrid(wishesArray) {
    const gridContainer = document.getElementById('wishes-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = ""; 

    wishesArray.forEach(wish => {
        const card = document.createElement('div');
        card.className = 'wish-item-card'; 
        card.style.cssText = "background: #fff; padding: 18px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 10px; border: 1px solid #eaeaea; text-align: left;";

        const tagHtml = wish.category ? `<span class="wish-tag" style="font-size: 11px; font-weight: bold; color: #4f46e5; background: #eeebff; padding: 3px 8px; border-radius: 4px; width: max-content;">#${wish.category.replace(/\s+/g, '')}</span>` : '';
        const imageHtml = wish.image ? `<img src="${wish.image}" alt="Wish Banner" style="width: 100%; border-radius: 8px; max-height: 180px; object-fit: cover; display: block;">` : '';
        const encodedText = encodeURIComponent(`${wish.title}\n\nRead more special wishes on Wishes Hub! ✨`);

        card.innerHTML = `
            ${tagHtml}
            ${imageHtml}
            <p style="font-size: 15px; color: #333; line-height: 1.5; margin: 5px 0; white-space: pre-wrap;">${wish.title}</p>
            <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid #f5f5f5;">
                <small style="color: #aaa; font-size: 11px;">📅 ${new Date(wish.createdAt).toLocaleDateString()}</small>
                <a href="https://api.whatsapp.com/send?text=${encodedText}" target="_blank" style="font-size: 12px; color: #25d366; font-weight: bold; text-decoration: none;">Share 🟢</a>
            </div>
        `;

        gridContainer.appendChild(card);
    });
}

// Filters Matrix
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
