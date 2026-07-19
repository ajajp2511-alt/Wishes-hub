const CategoriesMain = {
    init(containerSelector, allWishesData, onFilter, categoriesList) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        container.innerHTML = ""; // Purane buttons clear karein

        // 'All' button add karein
        this.createButton(container, 'All', () => onFilter('all'));

        // Aapki 2 categories ke buttons
        categoriesList.forEach(cat => {
            this.createButton(container, cat, () => onFilter(cat));
        });
    },

    createButton(container, label, onClick) {
        const btn = document.createElement('button');
        btn.innerText = label;
        btn.style.margin = "5px";
        btn.onclick = onClick;
        container.appendChild(btn);
    }
};

export default CategoriesMain;
