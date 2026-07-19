const WishesCore = {
    async loadWishes() {
        try {
            // Absolute path use karein taaki kahin se bhi load ho
            const response = await fetch('/public/features/wishes-feed/data/wishes.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const wishes = await response.json();
            
            const grid = document.getElementById('wishes-grid');
            if (grid) {
                grid.innerHTML = wishes.map(wish => `
                    <div class="wish-card" style="border: 1px solid #444; padding: 15px; margin: 10px; border-radius: 12px; background: #222; color: #fff;">
                        <p style="margin: 0; font-size: 1.1em;">${wish.text}</p>
                        <button class="share-btn" onclick="alert('Shared: ${wish.text}')" style="margin-top: 10px; cursor: pointer;">Share</button>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error("Wishes load nahi ho paya:", error);
            const grid = document.getElementById('wishes-grid');
            if (grid) grid.innerHTML = "<p>Error loading wishes.</p>";
        }
    }
};
export default WishesCore;
