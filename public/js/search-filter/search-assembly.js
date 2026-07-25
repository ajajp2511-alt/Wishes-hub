import { SEARCH_CONFIG } from './search-config.js';
import { SearchCore } from './search-core.js';

export class SearchAssembly {
  constructor(renderCallback) {
    this.core = new SearchCore();
    this.renderCallback = renderCallback; // Function to render filtered list
  }

  init(dataList) {
    this.core.setItems(dataList);
    this.bindEvents();
  }

  bindEvents() {
    const searchInput = document.querySelector(SEARCH_CONFIG.SELECTORS.SEARCH_INPUT);
    const categoryBtns = document.querySelectorAll(SEARCH_CONFIG.SELECTORS.CATEGORY_FILTER);
    const clearBtn = document.querySelector(SEARCH_CONFIG.SELECTORS.CLEAR_BTN);

    if (searchInput) {
      const handleInput = this.core.debounce((e) => {
        const filtered = this.core.filterData(e.target.value);
        if (this.renderCallback) this.renderCallback(filtered);
      });

      searchInput.addEventListener('input', handleInput);
    }

    if (categoryBtns.length > 0) {
      categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          categoryBtns.forEach(b => b.classList.remove(SEARCH_CONFIG.ACTIVE_CATEGORY_CLASS));
          e.currentTarget.classList.add(SEARCH_CONFIG.ACTIVE_CATEGORY_CLASS);

          const category = e.currentTarget.dataset.category || 'all';
          const filtered = this.core.filterData(undefined, category);
          if (this.renderCallback) this.renderCallback(filtered);
        });
      });
    }

    if (clearBtn && searchInput) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        const filtered = this.core.filterData('');
        if (this.renderCallback) this.renderCallback(filtered);
      });
    }
  }
        }
