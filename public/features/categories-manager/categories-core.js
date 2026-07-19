// Wishes-hub: Categories Logic
const CategoriesCore = {
    async loadCategories() {
        try {
            const response = await fetch('./public/features/categories-manager/data/categories.json');
            const categories = await response.json();
            
            const container = document.querySelector('.categories-container-wrapper');
            if (container) {
                container.innerHTML = categories.map(cat => `
                    <a href="#" class="festival-item-card">
                        <div class="festival-icon-circle">${cat.icon}</div>
                        <span class="festival-name">${cat.name}</span>
                    </a>
                `).join('');
            }
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    }
};

export default CategoriesCore;
