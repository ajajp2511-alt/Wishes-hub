import CategoriesMain from './categories-main.js';

// Dummy data: Aapka real database yahan aayega
const wishesData = [
    { id: 1, text: "Believe in yourself", tag: "motivational" },
    { id: 2, text: "Happy Diwali", tag: "festival" }
];

document.addEventListener('DOMContentLoaded', () => {
    CategoriesMain.init('.categories-container-wrapper', wishesData);
});
