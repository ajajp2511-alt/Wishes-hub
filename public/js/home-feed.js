// ==========================================================
// 🌐 WISHES HUB USER PANEL - HOME FEED ENGINE
// Patel Studio - 2026
// ==========================================================

let allWishesData = []; 
let lastDataHash = ""; 
let currentSelectedTag = "All"; 

document.addEventListener('DOMContentLoaded', () => {
    fetchLiveWishes();

    // Background live syncing loop (Every 4 seconds)
    setInterval(() => {
        fetchLiveWishes(true); 
    }, 4000);

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            filterWishes(query, currentSelectedTag);
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
        const endpoint = `/api/get-wishes?t=${new Date().getTime()}`;
        const response = await fetch(endpoint);
        
        if (!response.ok) throw new Error("Cloud network refused response.");
        let result = await response.json();

        if (!result.success || !result.wishes || result.wishes.length === 0) {
            if (allWishesData.length === 0) {
                gridContainer.innerHTML = `<p style="color: #888; text-align: center; grid-column: 1/-1; padding: 20px;">✨ No database entries found.</p>`;
            }
            return;
        }

        const currentDataHash = JSON.stringify(result.wishes);
        if (currentDataHash === lastDataHash) return; 
        lastDataHash = currentDataHash;

        console.log("Raw Sync Data Sample:", result.wishes[0]);

        // UNIVERSAL FIELD MAPPING ENGINE
        allWishesData = result.wishes.map(item => {
            if (!item) return null;

            let extractedTitle = '';
            if (typeof item === 'string') {
                extractedTitle = item;
            } else {
                extractedTitle = item.title || item.wishText || item.text || '';
            }

            // Image handling safely for proxy or direct URL
            let finalImage = item.image || item.fileUrl || item.imageUrl || null;

            return {
                id: item.id || item._id || Math.random().toString(36).substr(2, 9),
                title: extractedTitle.toString().trim(),
                category: item.category || item.mainCategory || 'General',
                image: finalImage,
                createdAt: item.createdAt || new Date().toISOString()
            };
        }).filter(Boolean);

        if (allWishesData.length > 0) {
            if (document.getElementById('daily-wish-text')) {
                document.getElementById('daily-wish-text').innerText = allWishesData[0].title;
            }
            const currentSearch = document.getElementById('search-input')?.value.toLowerCase().trim() || "";
            filterWishes(currentSearch, currentSelectedTag);
        }

    } catch (error) {
        console.error("🚨 Cloud Engine Error:", error);
    }
}

function renderCardsToGrid(wishesArray) {
    const gridContainer = document.getElementById('wishes-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = ""; 

    wishesArray.forEach(wish => {
        const card = document.createElement('div');
        card.className = 'wish-item-card'; 
        card.style.cssText = "background: #fff; padding: 18px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 12px; border: 1px solid #eaeaea; text-align: left; cursor: pointer; transition: transform 0.2s;";
        
        // CARD TAP LOGIC: Pure card ya image par tap karne se page open hoga
        card.setAttribute('onclick', `navigateToWish(event, '${wish.id}')`);

        const tagHtml = wish.category ? `<span class="wish-tag" style="font-size: 11px; font-weight: bold; color: #4f46e5; background: #eeebff; padding: 4px 8px; border-radius: 4px; width: max-content;">#${wish.category.replace(/\s+/g, '')}</span>` : '';
        
        // IMAGE DISPLAY RENDERER WITH TELEGRAM BYPASS
        let imageHtml = '';
        if (wish.image) {
            let srcUrl = wish.image;
            if (srcUrl.includes('api.telegram.org/file/bot')) {
                const rawPath = srcUrl.split('bot')[1];
                srcUrl = `https://imtqy.com/bot${rawPath}`;
            }
            imageHtml = `<img src="${srcUrl}" alt="Wish Banner" style="width: 100%; border-radius: 8px; max-height: 200px; object-fit: cover; display: block; margin-bottom: 4px;">`;
        }

        const encodedText = encodeURIComponent(`${wish.title}\n\nRead more special wishes on Wishes Hub! ✨`);

        card.innerHTML = `
            ${tagHtml}
            ${imageHtml}
            <p style="font-size: 15px; color: #333; line-height: 1.5; margin: 5px 0; white-space: pre-wrap; font-weight: 500;">${wish.title || 'Empty Wish Content'}</p>
            
            <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid #f5f5f5;">
                <span class="view-details-text" style="font-size: 13px; color: #4f46e5; font-weight: bold;">View Details →</span>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <button onclick="event.stopPropagation(); copyTextToClipboard('${wish.title.replace(/'/g, "\\'")}')" style="font-size: 12px; background: #eeebff; color: #4f46e5; border: none; padding: 4px 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">Copy</button>
                    <a href="https://api.whatsapp.com/send?text=${encodedText}" target="_blank" onclick="event.stopPropagation();" style="font-size: 13px; color: #25d366; font-weight: bold; text-decoration: none;">Share 🟢</a>
                </div>
            </div>
        `;

        gridContainer.appendChild(card);
    });
}

// REDIRECTION MANAGER
window.navigateToWish = function(event, wishId) {
    if (event.target.tagName === 'BUTTON' || event.target.tagName === 'A' || event.target.closest('a')) {
        return; 
    }
    window.location.href = `/page/wish.html?id=${wishId}`;
};

// QUICK COPY ENGINE
window.copyTextToClipboard = function(text) {
    navigator.clipboard.writeText(text);
    alert('Wish text successfully copy ho gaya! 🔥');
};

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
    currentSelectedTag = tagName; 
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
