// ==========================================================
// 🌐 WISHES HUB USER PANEL - HOME FEED ENGINE (CACHE BUSTER)
// Patel Studio - 2026
// ==========================================================

let allWishesData = []; 
let lastDataHash = ""; 
let currentSelectedTag = "All"; 

document.addEventListener('DOMContentLoaded', () => {
    fetchLiveWishes();
    setInterval(() => { fetchLiveWishes(true); }, 4000);

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterWishes(e.target.value.toLowerCase().trim(), currentSelectedTag);
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

        // Forced backup injected to storage engine
        localStorage.setItem('wishes_hub_db_cache', currentDataHash);

        allWishesData = result.wishes.map(item => {
            if (!item) return null;
            const cleanId = item.id || item._id || item.key || null;
            let extractedTitle = item.title || item.wishText || item.text || '';
            let finalImage = item.image || item.fileUrl || item.imageUrl || null;

            return {
                id: cleanId ? String(cleanId).trim() : null,
                title: extractedTitle.toString().trim(),
                category: item.category || item.mainCategory || 'General',
                image: finalImage
            };
        }).filter(item => item && item.id);

        if (allWishesData.length > 0) {
            filterWishes(document.getElementById('search-input')?.value.toLowerCase().trim() || "", currentSelectedTag);
        }
    } catch (error) {
        console.error("🚨 Feed Error:", error);
    }
}

function renderCardsToGrid(wishesArray) {
    const gridContainer = document.getElementById('wishes-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = ""; 
    gridContainer.style.cssText = "display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; padding: 10px 0;";

    wishesArray.forEach(wish => {
        const card = document.createElement('div');
        card.className = 'wish-item-card'; 
        card.style.cssText = "background: #1e1e1e; padding: 16px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); display: flex; flex-direction: column; gap: 12px; border: 1px solid #333; text-align: left; cursor: pointer;";
        
        // Anti-cache wrapper logic triggered safely
        card.setAttribute('onclick', `navigateToWish(event, \`${wish.id}\`)`);

        const tagHtml = wish.category ? `<span class="wish-tag" style="font-size: 11px; font-weight: bold; color: #00e5ff; background: rgba(0,229,255,0.1); padding: 4px 10px; border-radius: 20px; width: max-content;">#${wish.category.replace(/\s+/g, '')}</span>` : '';
        
        let imageHtml = '';
        if (wish.image) {
            let srcUrl = wish.image;
            if (srcUrl.includes('api.telegram.org/file/bot')) {
                srcUrl = `https://images.weserv.nl/?url=${encodeURIComponent(srcUrl)}`;
            }
            imageHtml = `<img src="${srcUrl}" alt="Wish Banner" style="width: 100%; height: 180px; border-radius: 12px; object-fit: cover; display: block; background: #2a2a2a;">`;
        } else {
            imageHtml = `<div style="width: 100%; height: 120px; background: #2a2a2a; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 13px;">✨ Special Wish</div>`;
        }

        const encodedText = encodeURIComponent(`${wish.title}\n\nRead more special wishes on Wishes Hub! ✨`);

        card.innerHTML = `
            ${imageHtml}
            ${tagHtml}
            <p style="font-size: 16px; color: #ffffff; line-height: 1.5; margin: 5px 0; white-space: pre-wrap; font-weight: bold;">${wish.title}</p>
            
            <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid #333;">
                <span class="view-details-text" style="font-size: 13px; color: #00e5ff; font-weight: bold;">View Details →</span>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <button onclick="event.stopPropagation(); copyTextToClipboard('${wish.title.replace(/'/g, "\\'")}')" style="font-size: 12px; background: #333; color: #fff; border: none; padding: 6px 12px; border-radius: 8px; font-weight: bold; cursor: pointer;">Copy</button>
                    <a href="https://api.whatsapp.com/send?text=${encodedText}" target="_blank" onclick="event.stopPropagation();" style="font-size: 12px; background: #25d366; color: #fff; font-weight: bold; padding: 6px 12px; border-radius: 8px; text-decoration: none;">Share</a>
                </div>
            </div>
        `;
        gridContainer.appendChild(card);
    });
}

window.navigateToWish = function(event, wishId) {
    if (event.target.tagName === 'BUTTON' || event.target.tagName === 'A' || event.target.closest('a')) return; 
    // 🚨 CACHE BUSTER INJECTION: Appends dynamic timestamp token to instantly burst vercel cache layers
    window.location.href = `/page/wish.html?id=${encodeURIComponent(wishId)}&v=${new Date().getTime()}`;
};

window.copyTextToClipboard = function(text) {
    navigator.clipboard.writeText(text);
    alert('Wish text successfully copy ho gaya! 🔥');
};

function filterWishes(searchQuery, tagQuery) {
    let filtered = allWishesData;
    if (searchQuery) {
        filtered = filtered.filter(wish => wish.title.toLowerCase().includes(searchQuery) || wish.category.toLowerCase().includes(searchQuery));
    }
    if (tagQuery && tagQuery !== 'All') {
        filtered = filtered.filter(wish => wish.category.toLowerCase() === tagQuery.toLowerCase());
    }
    renderCardsToGrid(filtered);
}

window.filterByTag = function(tagName) {
    currentSelectedTag = tagName;
    document.querySelectorAll('.chip').forEach(chip => {
        chip.classList.remove('active');
        if (chip.innerText.replace('#', '').toLowerCase() === tagName.toLowerCase() || (tagName === 'All' && chip.innerText === 'All')) {
            chip.classList.add('active');
        }
    });
    filterWishes(document.getElementById('search-input')?.value.toLowerCase().trim() || "", tagName);
};
