import { MenuCore } from './menu-core.js';

export class MenuAssembly {
  constructor(containerId = 'menu-navigation-root') {
    this.container = document.getElementById(containerId);
    this.core = new MenuCore();
    if (this.container) {
      this.init();
    }
  }

  init() {
    this.render();
    this.bindEvents();
    this.bindTopNavToggle();
  }

  // Top Right Hamburger Button Toggle Handler
  bindTopNavToggle() {
    const hamburgerBtn = document.querySelector('.navbar-toggler, .menu-toggle, header button');
    
    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.container.classList.toggle('active');
        document.body.classList.toggle('menu-open');
      });
    }
  }

  render(filteredItems = null) {
    const brand = this.core.getBrand();
    const navItems = filteredItems || this.core.getNavItems();

    this.container.innerHTML = `
      <aside class="admin-sidebar">
        <div class="sidebar-brand">
          <span class="brand-icon">${brand.LOGO_ICON}</span>
          <h2 class="brand-name">${brand.NAME}</h2>
        </div>

        <div class="sidebar-search">
          <input type="text" id="menu-search-input" placeholder="Search feature..." />
        </div>

        <nav class="sidebar-nav">
          <ul class="main-menu-list">
            ${navItems.map(main => `
              <li class="main-menu-item ${this.core.expandedMenus.has(main.id) ? 'open' : ''}" data-id="${main.id}">
                <div class="main-menu-header">
                  <span class="menu-icon">${main.icon}</span>
                  <span class="menu-label">${main.label}</span>
                  ${main.subItems ? '<span class="accordion-arrow">❯</span>' : ''}
                </div>
                ${main.subItems ? `
                  <ul class="sub-menu-list">
                    ${main.subItems.map(sub => `
                      <li class="sub-menu-item ${this.core.activeSubItemId === sub.id ? 'active' : ''}" data-sub-id="${sub.id}">
                        <span class="sub-label">${sub.label}</span>
                      </li>
                    `).join('')}
                  </ul>
                ` : ''}
              </li>
            `).join('')}
          </ul>
        </nav>
      </aside>
    `;
  }

  bindEvents() {
    // Search Handler
    const searchInput = this.container.querySelector('#menu-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        const filtered = this.core.filterMenuItems(query);
        
        if (query.trim()) {
          filtered.forEach(item => this.core.expandedMenus.add(item.id));
        }
        
        this.render(filtered);
        this.bindEvents();
        
        const newSearchInput = this.container.querySelector('#menu-search-input');
        if (newSearchInput) {
          newSearchInput.focus();
          newSearchInput.value = query;
        }
      });
    }

    // Main Menu Click (Accordion Toggle)
    this.container.querySelectorAll('.main-menu-header').forEach(header => {
      header.addEventListener('click', (e) => {
        const mainItem = e.target.closest('.main-menu-item');
        const mainId = mainItem.dataset.id;
        this.core.toggleAccordion(mainId);
        this.render();
        this.bindEvents();
      });
    });

    // Sub Menu Click (Active Selection)
    this.container.querySelectorAll('.sub-menu-item').forEach(subItem => {
      subItem.addEventListener('click', (e) => {
        e.stopPropagation();
        const subId = e.currentTarget.dataset.subId;
        this.core.setActiveSubItem(subId);
        this.render();
        this.bindEvents();
      });
    });
  }
}

// FeaturesAssembly boot process ke liye exported runner function
export const initMenu = () => {
  return new MenuAssembly();
};
