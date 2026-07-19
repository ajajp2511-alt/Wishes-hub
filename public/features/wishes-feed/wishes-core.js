const WishesCore = {
    async loadWishes() {
        try {
            // Hum direct file ka path use kar rahe hain
            const response = await fetch('./public/features/wishes-feed/data/wishes.json');
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const wishes = await response.json();
            
            const grid = document.getElementById('wishes-grid');
            if (grid) {
                grid.innerHTML = wishes.map(wish => `
                    <div class="wish-card" style="border: 1px solid #444; padding: 15px; margin: 10px; border-radius: 12px; background: #222; color: #fff;">
                        <p style="margin: 0; font-size: 1.1em;">${wish.text}</p>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error("WishesCore Error:", error);
        }
    }
};
export default WishesCore;
