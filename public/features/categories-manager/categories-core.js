const CategoriesCore = {
    async loadCategories() {
        try {
            // Absolute path: root se start karein
            const response = await fetch('/public/features/categories-manager/data/categories.json');
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const categories = await response.json();
            
            const container = document.querySelector('.categories-container-wrapper');
            if (container) {
                container.innerHTML = categories.map(cat => `
                    <a href="#" class="festival-item-card" style="text-decoration: none; color: inherit; display: inline-block; margin: 10px;">
                        <div class="festival-icon-circle">${cat.icon}</div>
                        <span class="festival-name">${cat.name}</span>
                    </a>
                `).join('');
            }
        } catch (error) {
            console.error("Categories load error:", error);
        }
    }
};

export default CategoriesCore;
