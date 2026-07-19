import CategoriesMain from './categories-main.js';

export default function initCategories(allWishesData, onFilterCallback) {
    const selector = '.categories-container-wrapper';
    
    // Buttons ke naam
    const myCategories = ['Text wishes', 'Image wishes'];

    CategoriesMain.init(selector, allWishesData, (selectedTag) => {
        if (selectedTag === 'all') {
            onFilterCallback(allWishesData);
        } else if (selectedTag === 'Text wishes') {
            // Sirf wahi wishes jahan image null ya empty hai
            const filtered = allWishesData.filter(wish => !wish.image);
            onFilterCallback(filtered);
        } else if (selectedTag === 'Image wishes') {
            // Sirf wahi wishes jahan image field mein link hai
            const filtered = allWishesData.filter(wish => wish.image && wish.image.length > 5);
            onFilterCallback(filtered);
        }
    }, myCategories);
}
