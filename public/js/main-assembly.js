// Wishes Hub: Master Assembly Script
// Patel Studio - 2026

async function startApp() {
    console.log("Wishes Hub: System Booting...");
    const grid = document.getElementById('wishes-grid');
    
    if(grid) {
        grid.innerHTML = "<p style='color:#00f2ff; padding:20px;'>Initializing Wishes Hub Engine...</p>";
    }

    try {
        // Module checks (Jaise aapke pehle the)
        if (typeof initStorage === 'function') {
            await initStorage();
            console.log("Storage: Loaded");
        } else {
            console.warn("initStorage function nahi mila.");
        }

        if (typeof loadCategories === 'function') {
            await loadCategories();
            console.log("Categories: Loaded");
        }
        
        // Vercel Backend API se connect karke wishes load karna
        if (grid) {
            await fetchWishesFromServer(grid);
        }
        
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

// Backend API se data lekar HTML me render karne ka function
async function fetchWishesFromServer(gridElement) {
    try {
        // Humne Vercel ki banayi hui naye route ko hit kiya
        const response = await fetch('/api/get-wishes');
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Server error occurred.");
        }

        if (data.wishes.length === 0) {
            gridElement.innerHTML = "<p style='color:#fff; padding:20px;'>Abhi tak koi wishes available nahi hain.</p>";
            return;
        }

        gridElement.innerHTML = ""; // Initializing text remove karne ke liye

        // Loop chalakar ek ek wish card screen par banana
        data.wishes.forEach(wish => {
            const card = document.createElement('div');
            card.className = 'wish-card'; 
            card.style.cssText = "background:#121212; border:1px solid #333; border-radius:12px; padding:15px; margin:10px; box-shadow: 0 4px 15px rgba(0,0,0,0.5);";

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <span style="background:#00f2ff; color:#000; font-size:12px; padding:3px 8px; border-radius:20px; font-weight:bold;">
                        ${wish.category || 'General'}
                    </span>
                </div>
                <p style="color:#fff; font-size:16px; line-height:1.5; margin:15px 0; white-space: pre-wrap;">
                    ${wish.title || 'No Text'}
                </p>
                <div style="text-align:right;">
                    <button class="copy-btn" 
                            style="background:#222; color:#00f2ff; border:1px solid #00f2ff; padding:5px 12px; border-radius:6px; cursor:pointer; font-weight:bold;"
                            onclick="navigator.clipboard.writeText(\`${wish.title}\`); alert('Wish copied!');">
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

// Start the engine
document.addEventListener('DOMContentLoaded', startApp);
