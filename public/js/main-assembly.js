// Wishes Hub: Master Assembly Script (Upgraded for Modular Rows)
// Patel Studio - 2026

// 1. Naye UI layout modules ko top par import karein
import { renderWishOfTheDay, renderFestivalSlider } from '../features/highlights/highlights-handlers.js';
import { renderTrendingRow, renderLatestGrid } from '../features/wishes/home-rows.js';

async function startApp() {
    console.log("Wishes Hub: System Booting...");
    
    // Main components ke divs ko check karna
    const containerCheck = document.getElementById('trending-wishes-section');
    if(containerCheck) {
        console.log("Initializing Patel Studio Modular UI Engine...");
    }

    try {
        // 1. Storage Check
        if (typeof initStorage === 'function') {
            await initStorage();
            console.log("Storage: Loaded");
        } else {
            console.warn("initStorage function nahi mila.");
        }

        // 2. Dynamic Categories Load Check
        if (typeof loadCategories === 'function') {
            loadCategories(); 
            console.log("Categories Navigation: Loaded");
        } else {
            console.warn("loadCategories function nahi mila. HTML me script check karein.");
        }
        
        // 3. Modular Server Fetch and Render (Vercel Backend API Connection)
        await fetchAndAssembleHomeSections();
        
        // 4. Live Search Setup
        setupSearchLogic();
        
        console.log("Wishes Hub: All Systems Online");

    } catch (error) {
        console.error("Boot Error:", error);
        const errorContainer = document.getElementById('wish-of-the-day-section');
        if(errorContainer) {
            errorContainer.innerHTML = `
                <div style="color:#ff4444; padding:20px; border:1px solid #ff4444; border-radius:10px; background:#121212;">
                    <h3>Launch Error</h3>
                    <p>${error.message}</p>
                </div>`;
        }
    }
}

// Data ko fetch karke sahi rows me distribute karne ka intelligent function
async function fetchAndAssembleHomeSections() {
    try {
        const response = await fetch('/api/get-wishes');
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Server error occurred.");
        }

        if (!data.wishes || data.wishes.length === 0) {
            console.warn("Server par koi wishes data nahi mila.");
            return;
        }

        // 📸 DUAL MEDIA PROCESSING ENGINE (Aapka original logic optimized for cards)
        const processedWishes = data.wishes.map(wish => {
            let finalMediaUrl = wish.imageUrl || null;
            if (!finalMediaUrl && wish.telegramFileId) {
                finalMediaUrl = `/api/get-media?fileId=${wish.telegramFileId}&type=${wish.fileType || 'photo'}`;
            }
            if (finalMediaUrl && finalMediaUrl.includes('api.telegram.org/file/bot')) {
                const rawTokenPath = finalMediaUrl.split('bot')[1];
                finalMediaUrl = `https://imtqy.com/bot${rawTokenPath}`;
            }
            
            return {
                id: wish._id || Math.random().toString(36).substr(2, 9),
                text: wish.title || 'No Text',
                category: wish.category || 'General',
                likes: wish.likes || 0,
                mediaUrl: finalMediaUrl,
                fileType: wish.fileType || 'photo'
            };
        });

        // 🧠 SECTION SEPARATION LOGIC (Pure data ko algorithms ke through filter karna)
        
        // A. Wish of the Day (Pehla wish banner banega)
        const wishOfTheDayData = processedWishes[0]; 

        // B. Dynamic Upcoming Festivals (Mocking via categories present or custom array)
        const dynamicFestivals = [
            { name: "Raksha Bandhan", slug: "raksha-bandhan", icon: "✨" },
            { name: "Independence Day", slug: "independence-day", icon: "🇮🇳" },
            { name: "Janmashtami", slug: "janmashtami", icon: "🍯" }
        ];

        // C. Trending Wishes (Wishes jinpe highest likes hon)
        const trendingWishes = [...processedWishes]
            .sort((a, b) => b.likes - a.likes)
            .slice(0, 6); // Top 6 for Horizontal Slider

        // D. Latest Wishes (Peeche se naye elements)
        const latestWishes = [...processedWishes]
            .reverse()
            .slice(0, 8); // Top 8 for Grid Layout

        // 3. Modular Rendering Call (Har file me data inject karna)
        renderWishOfTheDay('wish-of-the-day-section', wishOfTheDayData);
        renderFestivalSlider('upcoming-festivals-section', dynamicFestivals);
        renderTrendingRow('trending-wishes-section', trendingWishes);
        renderLatestGrid('latest-wishes-section', latestWishes);

    } catch (error) {
        console.error("Fetch and Assembly Error:", error);
        throw error;
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
            const cardBody = card.querySelector('.wish-text');
            const cardText = cardBody ? cardBody.innerText.toLowerCase() : '';
            const cardCategory = card.getAttribute('data-category') || '';
            
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

// Boot the Patel Studio Core Engine
document.addEventListener('DOMContentLoaded', startApp);
