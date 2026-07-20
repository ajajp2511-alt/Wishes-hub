const CategoriesCore = {
    render() {
        const container = document.querySelector('.categories-container-wrapper');
        if (!container) return;

        const data = [
            { "name": "Diwali", "icon": "🌸" },
            { "name": "Makar S.", "icon": "🪁" },
            { "name": "Rakhi", "icon": "❤️" },
            { "name": "Holi", "icon": "🎨" }
        ];

        container.innerHTML = data.map(cat => `
            <div class="category-item" style="display:inline-block; margin:10px; padding:15px; border:1px solid #000; border-radius:10px;">
                <div style="font-size: 24px;">${cat.icon}</div>
                <div>${cat.name}</div>
            </div>
        `).join('');
    }
};

export default CategoriesCore;
