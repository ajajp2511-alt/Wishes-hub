import { CATEGORY_CONFIG } from './category-config.js';

export class CategoryCore {
    constructor() {
        this.categories = [
            { id: 1, name: 'Birthday Wishes', type: 'Wishes', slug: 'birthday-wishes', icon: '🎂', status: 'Active', count: 45 },
            { id: 2, name: 'Anniversary Wishes', type: 'Wishes', slug: 'anniversary-wishes', icon: '💍', status: 'Active', count: 20 },
            { id: 3, name: 'Love Shayari', type: 'Shayari', slug: 'love-shayari', icon: '❤️', status: 'Active', count: 35 },
            { id: 4, name: 'Sad Shayari', type: 'Shayari', slug: 'sad-shayari', icon: '😢', status: 'Inactive', count: 18 }
        ];
        this.activeTab = 'Wishes';
    }

    getCategoriesByType(type) {
        return this.categories.filter(c => c.type === type);
    }

    addCategory(categoryData) {
        const newId = this.categories.length ? this.categories[this.categories.length - 1].id + 1 : 1;
        const slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        
        const newCat = {
            id: newId,
            name: categoryData.name,
            type: categoryData.type,
            slug: slug,
            icon: categoryData.icon || '📁',
            status: categoryData.status || CATEGORY_CONFIG.DEFAULT_STATUS,
            count: 0
        };
        this.categories.push(newCat);
        return newCat;
    }

    deleteCategory(id) {
        this.categories = this.categories.filter(c => c.id !== id);
    }

    toggleStatus(id) {
        const cat = this.categories.find(c => c.id === id);
        if (cat) {
            cat.status = cat.status === 'Active' ? 'Inactive' : 'Active';
        }
    }
          }
