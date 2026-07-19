import CategoriesUI from './categories-ui.js';

const CategoriesMain = {
    /**
     * @param {string} containerSelector - HTML element selector
     * @param {Array} allWishesData - Data array
     * @param {Function} onFilter - Callback function to update the main grid
     */
    init(containerSelector, allWishesData, onFilter) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error("Categories container not found:", containerSelector);
            return;
        }
        
        // UI ko render karein aur filter logic pass karein
        CategoriesUI.render(container, (selectedTag) => {
            if (selectedTag === 'all') {
                onFilter(allWishesData);
            } else {
                const filteredWishes = allWishesData.filter(wish => wish.tag === selectedTag);
                console.log("Filtered Wishes:", filteredWishes);
                onFilter(filteredWishes);
            }
        });
    }
};

export default CategoriesMain;
