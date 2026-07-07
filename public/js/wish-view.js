// ==========================================================
// 🌐 WISHES HUB USER PANEL - REAL-TIME LIVE STREAM ENGINE
// Patel Studio - 2026
// ==========================================================

let allWishesData = []; 

// 1. Firebase Cdn Scripts ko dynamically load karne ka system (Taaki SDK install na karna pade)
document.addEventListener('DOMContentLoaded', () => {
    injectFirebaseSDKAndListen();

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            filterWishes(query, 'All');
        });
    }
});

function injectFirebaseSDKAndListen() {
    const gridContainer = document.getElementById('wishes-grid');
    if (!gridContainer) return;

    // Loader State
    gridContainer.innerHTML = `<p style="color: #666; text-align: center; grid-column: 1/-1;">📡 Establishing live connection stream...</p>`;

    // Firebase App aur Database scripts dynamically attach kar rahe hain
    const fbApp = document.createElement('script');
    fbApp.src = "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js";
    document.head.appendChild(fbApp);

    fbApp.onload = () => {
        const fbDb = document.createElement('script');
        fbDb.src = "https://www.gstatic.com/firebasejs/10.8.0/firebase-database-compat.js";
        document.head.appendChild(fbDb);

        fbDb.onload = () => {
            // Live connection initialization
            startFirebaseLiveListener();
        };
    };
}

// 2. Real-time Listener Engine (Main Magic)
function startFirebaseLiveListener() {
    const gridContainer = document.getElementById('wishes-grid');

    // Aapke project ke configs setup
    const firebaseConfig = {
        databaseURL: "https://wishes-hub-default-rtdb.firebaseio.com/"
    };

    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const dbRef = firebase.database().ref('wishes');

    // 🔥 '.on' lagane se database me kuch bhi badlega, ye function automatic chalega bina refresh ke!
    dbRef.on('value', (snapshot) => {
        const data = snapshot.val();

        if (!data) {
            gridContainer.innerHTML = `<p style="color: #888; text-align: center; grid-column: 1/-1; padding: 20px;">✨ No wishes found. Add some from Admin Panel!</p>`;
            return;
        }

        // Convert object to array and reverse (Latest First)
        allWishesData = Object.keys(data).map(key => {
            return {
                id: key,
                title: data[key].title || data[key].text || data[key].wishText || '',
                category: data[key].category || '',
                image: data[key].image || null,
                createdAt: data[key].createdAt || new Date().toISOString()
            };
        }).reverse();

        // Wish of the Day automatic update
        if (allWishesData.length > 0 && document.getElementById('daily-wish-text')) {
            document.getElementById('daily-wish-text').innerText = allWishesData[0].title;
        }

        // Live Grid Render
        renderCardsToGrid(allWishesData);
        console.log("⚡ Live Feed Synced! Total Records:", allWishesData.length);

    }, (error) => {
        console.error("🚨 Live Stream Error:", error);
        gridContainer.innerHTML = `<p style="color: #ef4444; text-align: center; grid-column: 1/-1;">❌ Sync Failed. Reconnecting...</p>`;
    });
}

// 3. Grid UI Builder Matrix
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
        const encodedText = encodeURIComponent(`${wish.title}\n\nRead more on Wishes Hub! ✨`);

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

// 4. Search and Filter Engine
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
