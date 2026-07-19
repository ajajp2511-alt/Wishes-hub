/**
 * categories-assembly.js
 * Yeh file categories ko initialize aur manage karti hai.
 */

import CategoriesMain from './categories-main.js';

export default function initCategories(allWishesData, onFilterCallback) {
    const selector = '.categories-container-wrapper';
    
    // Check karein ki wrapper exist karta hai ya nahi
    const wrapper = document.querySelector(selector);
    if (!wrapper) {
        console.error("Categories wrapper element not found:", selector);
        return;
    }

    try {
        // Categories initialize karein
        CategoriesMain.init(selector, allWishesData, (selectedTag) => {
            if (selectedTag === 'all') {
                onFilterCallback(allWishesData);
            } else {
                const filtered = allWishesData.filter(wish => wish.tag === selectedTag);
                onFilterCallback(filtered);
            }
        });
        console.log("Categories initialized successfully.");
    } catch (error) {
        console.error("Error initializing categories:", error);
    }
}
