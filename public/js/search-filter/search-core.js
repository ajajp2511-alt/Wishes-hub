import { SEARCH_CONFIG } from './search-config.js';

export class SearchCore {
  constructor(items = []) {
    this.items = items;
    this.currentQuery = '';
    this.currentCategory = 'all';
  }

  setItems(items) {
    this.items = items;
  }

  filterData(query = this.currentQuery, category = this.currentCategory) {
    this.currentQuery = query.toLowerCase().trim();
    this.currentCategory = category.toLowerCase().trim();

    return this.items.filter(item => {
      const matchesQuery = !this.currentQuery || 
        (item.title && item.title.toLowerCase().includes(this.currentQuery)) ||
        (item.message && item.message.toLowerCase().includes(this.currentQuery)) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(this.currentQuery)));

      const matchesCategory = this.currentCategory === 'all' || 
        (item.category && item.category.toLowerCase() === this.currentCategory);

      return matchesQuery && matchesCategory;
    });
  }

  debounce(func, delay = SEARCH_CONFIG.DEBOUNCE_DELAY) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }
}
