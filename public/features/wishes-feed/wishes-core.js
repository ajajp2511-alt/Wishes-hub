const WishesCore = {
    async loadWishes() {
        try {
            const response = await fetch('./public/features/wishes-feed/data/wishes.json');
            const wishes = await response.json();
            
            const grid = document.getElementById('wishes-grid');
            if (grid) {
                grid.innerHTML = wishes.map(wish => `
                    <div class="wish-card">
                        <p>${wish.text}</p>
                        <button class="share-btn" onclick="alert('Shared: ${wish.text}')">Share</button>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error("Wishes load nahi ho paya:", error);
        }
    }
};
export default WishesCore;
