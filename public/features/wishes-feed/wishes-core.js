// public/features/wishes-feed/wishes-core.js
const WishesCore = {
    async loadWishes() {
        try {
            // Path check karein: agar ye file public/features/wishes-feed/wishes-core.js hai
            // aur JSON public/features/wishes-feed/data/wishes.json mein hai, 
            // toh ye path sahi hona chahiye.
            const response = await fetch('./data/wishes.json'); 
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const wishes = await response.json();
            
            const grid = document.getElementById('wishes-grid');
            if (grid) {
                // Pehle "Initializing" hata dein
                grid.innerHTML = wishes.map(wish => `
                    <div class="wish-card" style="border: 1px solid #444; padding: 10px; margin: 10px; border-radius: 8px;">
                        <p>${wish.text || 'No text'}</p>
                        <button class="share-btn" onclick="alert('Shared: ${wish.text}')">Share</button>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error("Wishes load nahi ho paya, error:", error);
            const grid = document.getElementById('wishes-grid');
            if (grid) grid.innerHTML = "<p>Error loading wishes. Check console.</p>";
        }
    }
};
export default WishesCore;
