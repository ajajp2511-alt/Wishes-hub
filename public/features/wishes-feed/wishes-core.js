const WishesCore = {
    async loadWishes() {
        console.log("WishesCore: Attempting to fetch JSON...");
        try {
            // Absolute path: `/` root directory se shuru hota hai
            const response = await fetch('/public/features/wishes-feed/data/wishes.json');
            
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            
            const wishes = await response.json();
            console.log("WishesCore: Data received:", wishes);
            
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
            console.error("WishesCore Error:", error);
            const grid = document.getElementById('wishes-grid');
            if (grid) {
                grid.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
            }
        }
    }
};
export default WishesCore;
