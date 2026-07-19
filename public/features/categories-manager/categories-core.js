const CategoriesCore = {
    async loadCategories() {
        try {
            const response = await fetch('/public/features/categories-manager/data/categories.json');
            const categories = await response.json();
            
            console.log("Categories Loaded:", categories); // Ye console mein check karein
            
            const container = document.querySelector('.categories-container-wrapper');
            if (container) {
                container.innerHTML = categories.map(cat => `
                    <a href="#" class="festival-item-card">
                        <div class="festival-icon-circle">${cat.icon}</div>
                        <span class="festival-name">${cat.name}</span>
                    </a>
                `).join('');
            } else {
                console.error("Container .categories-container-wrapper nahi mila!");
            }
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    }
};
export default CategoriesCore;
