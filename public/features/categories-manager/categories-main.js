const CategoriesMain = {
    init(containerSelector, allWishesData, onFilter, categoriesList) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        container.innerHTML = "";
        container.style.cssText = "display: flex; gap: 10px; justify-content: center; padding: 10px;";

        this.createButton(container, 'All', () => onFilter('all'));

        categoriesList.forEach(cat => {
            this.createButton(container, cat, () => onFilter(cat));
        });
    },

    createButton(container, label, onClick) {
        const btn = document.createElement('button');
        btn.innerText = label;
        btn.style.cssText = "padding: 8px 15px; border-radius: 20px; border: none; background: #333; color: white;";
        btn.onclick = onClick;
        container.appendChild(btn);
    }
};
export default CategoriesMain;
