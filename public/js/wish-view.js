// ==========================================================
// 🌐 WISHES HUB USER PANEL - UNIVERSAL PATH SYNC ENGINE
// Patel Studio - 2026
// ==========================================================

let allWishesData = []; 
let lastDataHash = ""; 

document.addEventListener('DOMContentLoaded', () => {
    fetchLiveWishes();

    // Har 4 seconds me background scanning active rakhein (Real-time syncing)
    setInterval(() => {
        fetchLiveWishes(true); 
    }, 4000);

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            filterWishes(query, 'All');
        });
    }
});

async function fetchLiveWishes(isBackground = false) {
    const gridContainer = document.getElementById('wishes-grid');
    if (!gridContainer) return;

    if (!isBackground && allWishesData.length === 0) {
        gridContainer.innerHTML = `<p style="color: #666; text-align: center; grid-column: 1/-1; padding: 20px;">📡 Fetching live updates from cloud feeds...</p>`;
    }

    try {
        // Vercel serverless endpoint + Cache busting timestamp
        const endpoint = `/api/get-wishes?t=${new Date().getTime()}`;
        const response = await fetch(endpoint);
        
        if (!response.ok) throw new Error("Cloud network refused response.");
        let result = await response.json();

        // Agar response sahi na ho ya wishes array empty ho
        if (!result.success || !result.wishes || result.wishes.length === 0) {
            if (allWishesData.length === 0) {
                gridContainer.innerHTML = `<p style="color: #888; text-align: center; grid-column: 1/-1; padding: 20px;">✨ No database entries found.</p>`;
            }
            return;
        }

        // Data hash check taaki bar-bar UI reload na ho agar data me change na ho
        const currentDataHash = JSON.stringify(result.wishes);
        if (currentDataHash === lastDataHash) return; 
        lastDataHash = currentDataHash;

        console.log("Raw Frontend Received Wishes Sample:", result.wishes[0]);

        // 🟢 UNIVERSAL FALLBACK FIELD MAPPING (Admin panel ke kisi bhi variation ko padhne ke liye)
        allWishesData = result.wishes.map(item => {
            // Check karein ki string kis key me chupi hai
            let extractedTitle = item.title || item.text || item.wishText || item.message || item.wish || '';
            
            // Agar poora item hi direct ek string hai
            if (typeof item === 'string') extractedTitle = item;

            return {
                id: item.id,
                title: extractedTitle.toString().trim(),
                category: item.category || 'General',
                image: item.image || null,
                createdAt: item.createdAt || new Date().toISOString()
            };
        });

        // Agar kuch bhi match nahi hua, toh filtration hata kar check karein
        console.log("⚡ Total Processed Cards for UI:", allWishesData.length);

        if (allWishesData.length > 0) {
            if (document.getElementById('daily-wish-text')) {
                document.getElementById('daily-wish-text').innerText = allWishesData[0].title;
            }
            renderCardsToGrid(allWishesData);
        } else {
            gridContainer.innerHTML = `<p style="color: #888; text-align: center; grid-column: 1/-1; padding: 20px;">⚠️ Fields mismatch: Title keys are empty in Firestore.</p>`;
        }

    } catch (error) {
        console.error("🚨 Cloud Engine Error:", error);
        if (allWishesData.length === 0) {
            gridContainer.innerHTML = `<p style="color: #ef4444; text-align: center; grid-column: 1/-1; padding: 20px;">❌ Sync Error: Database structural mismatch.</p>`;
        }
    }
}

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
            <p style="font-size: 15px; color: #333; line-height: 1.5; margin: 5px 0; white-space: pre-wrap;">${wish.title || 'Empty Wish Content'}</p>
            <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid #f5f5f5;">
                <small style="color: #aaa; font-size: 11px;">📅 ${new Date(wish.createdAt).toLocaleDateString()}</small>
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
