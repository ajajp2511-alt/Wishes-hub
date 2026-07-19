// public/features/categories-manager/categories-main.js

const CategoriesMain = {
    init(containerSelector, allWishesData, onFilter, categoriesList) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error("Categories container not found: " + containerSelector);
            return;
        }

        // Container ko style class dein (jo aapki categories-css.css mein hai)
        container.innerHTML = "";
        container.className = 'cat-grid'; 

        // 'All' button create karein
        this.createButton(container, 'All', () => onFilter('all'));

        // Baki categories ke liye buttons create karein
        categoriesList.forEach(cat => {
            this.createButton(container, cat, () => onFilter(cat));
        });
    },

    createButton(container, label, onClick) {
        const btn = document.createElement('button');
        btn.innerText = label;
        // CSS class ka use, inline style nahi
        btn.className = 'cat-btn'; 
        btn.onclick = onClick;
        container.appendChild(btn);
    }
};

export default CategoriesMain;
