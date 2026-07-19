import CategoriesUI from './categories-ui.js';

const CategoriesMain = {
    init(containerSelector, allWishesData) {
        const container = document.querySelector(containerSelector);
        
        CategoriesUI.render(container, (selectedTag) => {
            // Automatic Filtering
            const filteredWishes = allWishesData.filter(wish => wish.tag === selectedTag);
            console.log("Filtered Wishes:", filteredWishes);
            // Yahan par aap apne main feed ko update karne ka function call karein
            // Example: window.renderFeed(filteredWishes);
        });
    }
};
export default CategoriesMain;
