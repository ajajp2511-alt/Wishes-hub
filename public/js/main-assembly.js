// Wishes Hub: Master Assembly Script
// Patel Studio - 2026

async function startApp() {
    console.log("Wishes Hub: System Booting...");
    const grid = document.getElementById('wishes-grid');
    
    if(grid) {
        grid.innerHTML = "<p style='color:#00f2ff; padding:20px;'>Initializing Patel Studio Engine...</p>";
    }

    try {
        // 1. Storage Check (Jaise aapka pehle ka module logic tha)
        if (typeof initStorage === 'function') {
            await initStorage();
            console.log("Storage: Loaded");
        } else {
            console.warn("initStorage function nahi mila.");
        }

        // 2. Dynamic Categories Load Check (Jo aapne nayi file banayi hai)
        if (typeof loadCategories === 'function') {
            loadCategories(); // Yeh function 'feat-categories.js' se aa raha hai
            console.log("Categories Navigation: Loaded");
        } else {
            console.warn("loadCategories function nahi mila. HTML me script check karein.");
        }
        
        // 3. Vercel Backend API se connect karke wishes load karna
        if (grid) {
            await fetchWishesFromServer(grid);
        }
        
        // 4. Live Search Setup
        setupSearchLogic();
        
        console.log("Wishes Hub: All Systems Online");

    } catch (error) {
        console.error("Boot Error:", error);
        if(grid) {
            grid.innerHTML = `
                <div style="color:#ff4444; padding:20px; border:1px solid #ff4444; border-radius:10px;">
                    <h3>Launch Error</h3>
                    <p>${error.message}</p>
                </div>`;
        }
    }
}

// Backend API se data aur media lekar HTML me render karne ka function
async function fetchWishesFromServer(gridElement) {
    try {
        // Vercel ka naya route call kiya data ke liye
        const response = await fetch('/api/get-wishes');
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Server error occurred.");
        }

        if (data.wishes.length === 0) {
            gridElement.innerHTML = "<p style='color:#fff; padding:20px;'>Abhi tak koi wishes available nahi hain.</p>";
            return;
        }

        gridElement.innerHTML = ""; // Loader text clear kiya

        // Loop chalakar har ek wish ko screen par show karna
        data.wishes.forEach(wish => {
            const card = document.createElement('div');
            card.className = 'wish-card'; 
            // Dataset attributes set kar rahe hain taaki filters aur search unhe read kar sakein
            card.setAttribute('data-category', wish.category || 'General');
            card.setAttribute('data-text', (wish.title || '').toLowerCase());

            card.style.cssText = "background:#121212; border:1px solid #333; border-radius:12px; padding:15px; margin:10px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 10px;";

            // Media Element check karne ka logic (Photo vs Video)
            let mediaHtml = '';
            if (wish.telegramFileId) {
                // Hamari naye 'get-media' proxy endpoint ka secure url banaya
                const proxyMediaUrl = `/api/get-media?fileId=${wish.telegramFileId}&type=${wish.fileType || 'photo'}`;

                if (wish.fileType === 'video' || wish.fileType === 'animation') {
                    mediaHtml = `
                        <div style="width:100%; border-radius:8px; overflow:hidden; background:#000;">
                            <video src="${proxyMediaUrl}" controls preload="metadata" style="width:100%; max-height:300px; display:block;"></video>
                        </div>`;
                } else {
                    mediaHtml = `
                        <div style="width:100%; border-radius:8px; overflow:hidden; background:#000; text-align:center;">
                            <img src="${proxyMediaUrl}" alt="Wish Media" loading="lazy" style="max-width:100%; max-height:300px; object-fit:contain; display:inline-block;">
                        </div>`;
                }
            }

            // Card HTML Layout setup
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="background:#00f2ff; color:#000; font-size:12px; padding:3px 8px; border-radius:20px; font-weight:bold;">
                        ${wish.category || 'General'}
                    </span>
                </div>
                
                <!-- Media Section -->
                ${mediaHtml}

                <p style="color:#fff; font-size:16px; line-height:1.5; margin:5px 0; white-space: pre-wrap;">
                    ${wish.title || 'No Text'}
                </p>
                
                <div style="text-align:right; margin-top:5px;">
                    <button class="copy-btn" 
                            style="background:#222; color:#00f2ff; border:1px solid #00f2ff; padding:5px 12px; border-radius:6px; cursor:pointer; font-weight:bold;"
                            onclick="navigator.clipboard.writeText(\`${wish.title.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`); alert('Wish text copied!');">
                        Copy Wish
                    </button>
                </div>
            `;
            gridElement.appendChild(card);
        });

    } catch (error) {
        console.error("Fetch Error:", error);
        gridElement.innerHTML = `<p style='color:#ff4444; padding:20px;'>Wishes load nahi ho payi: ${error.message}</p>`;
    }
}

// Real-time Search Box Code Integration
function setupSearchLogic() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.wish-card');

        cards.forEach(card => {
            const cardText = card.getAttribute('data-text') || '';
            const cardCategory = card.getAttribute('data-category') || '';
            
            // Agar koi active category filter set hai, toh hum check karenge 'activeCategory' global variable (jo feat-categories.js me hai)
            const matchesCategory = (typeof activeCategory === 'undefined' || activeCategory === "All" || cardCategory === activeCategory);
            const matchesSearch = cardText.includes(query);

            if (matchesCategory && matchesSearch) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    });
}

// Start the engine
document.addEventListener('DOMContentLoaded', startApp);
