import { SEARCH_CONFIG } from './search-config.js';
import { SearchCore } from './search-core.js';

export class SearchAssembly {
  constructor(renderCallback) {
    this.core = new SearchCore();
    this.renderCallback = renderCallback;
  }

  init(initialItems = []) {
    this.core.setItems(initialItems);
    this.bindEvents();
    this.triggerRender();
  }

  triggerRender() {
    const filteredResults = this.core.filterData();
    if (typeof this.renderCallback === 'function') {
      this.renderCallback(filteredResults);
    }
  }

  bindEvents() {
    const searchInput = document.querySelector(SEARCH_CONFIG.SELECTORS.SEARCH_INPUT);
    const clearBtn = document.querySelector(SEARCH_CONFIG.SELECTORS.CLEAR_BTN);

    // Debounced Search Input Event
    if (searchInput) {
      const debouncedSearch = this.core.debounce((e) => {
        this.core.currentQuery = e.target.value;
        this.triggerRender();
      });
      searchInput.addEventListener('input', debouncedSearch);
    }

    // Clear Button Event
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        this.core.currentQuery = '';
        this.triggerRender();
      });
    }

    // Event Delegation for Category Filter Buttons
    document.addEventListener('click', (e) => {
      const filterBtn = e.target.closest(SEARCH_CONFIG.SELECTORS.CATEGORY_FILTER);
      if (filterBtn) {
        document.querySelectorAll(SEARCH_CONFIG.SELECTORS.CATEGORY_FILTER).forEach(btn => {
          btn.classList.remove(SEARCH_CONFIG.ACTIVE_CATEGORY_CLASS);
        });
        filterBtn.classList.add(SEARCH_CONFIG.ACTIVE_CATEGORY_CLASS);

        const category = filterBtn.getAttribute('data-category') || filterBtn.textContent.trim().toLowerCase();
        this.core.currentCategory = category;
        this.triggerRender();
      }
    });
  }
}
