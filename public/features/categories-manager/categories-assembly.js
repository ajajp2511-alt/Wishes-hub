import CategoriesMain from './categories-main.js';

export default function initCategories(allWishesData, onFilterCallback) {
    const selector = '.categories-container-wrapper';
    
    // Aapki 2 categories fix ho gayi
    const myCategories = ['Text wishes', 'Image wishes'];

    CategoriesMain.init(selector, allWishesData, (selectedTag) => {
        if (selectedTag === 'all') {
            onFilterCallback(allWishesData);
        } else {
            // Filter logic: category ya tag field se match karega
            const filtered = allWishesData.filter(wish => 
                (wish.category || '').toLowerCase() === selectedTag.toLowerCase()
            );
            onFilterCallback(filtered);
        }
    }, myCategories);
}
