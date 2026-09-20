import { MENU_CONFIG } from './menu-config.js';

export class MenuCore {
  constructor() {
    this.config = MENU_CONFIG;
    this.activeSubItemId = null;
    this.expandedMenus = new Set();
  }

  getBrand() {
    return this.config.BRAND;
  }

  getNavItems() {
    return this.config.NAV_ITEMS;
  }

  toggleAccordion(mainItemId) {
    if (this.expandedMenus.has(mainItemId)) {
      this.expandedMenus.delete(mainItemId);
    } else {
      this.expandedMenus.add(mainItemId);
    }
    return this.expandedMenus.has(mainItemId);
  }

  setActiveSubItem(subItemId) {
    this.activeSubItemId = subItemId;
  }

  filterMenuItems(query) {
    const q = query.toLowerCase().trim();
    if (!q) return this.config.NAV_ITEMS;

    return this.config.NAV_ITEMS.map(main => {
      const mainMatch = main.label.toLowerCase().includes(q);
      const matchingSubItems = main.subItems ? main.subItems.filter(sub => sub.label.toLowerCase().includes(q)) : [];

      if (mainMatch || matchingSubItems.length > 0) {
        return {
          ...main,
          subItems: mainMatch ? main.subItems : matchingSubItems
        };
      }
      return null;
    }).filter(Boolean);
  }
}

export function initMenu(containerId = 'dynamic-content-root') {
  const menuInstance = new MenuCore();
  
  // Render Menu UI into the Sidebar / Nav container
  renderMenuUI(menuInstance);

  return menuInstance;
}

// Helper function to build and insert HTML into the DOM
function renderMenuUI(menuInstance) {
  const navContainer = document.getElementById('menu-navigation-root') || document.querySelector('.admin-sidebar, .sidebar-nav, #sidebar-menu, aside nav');
  
  if (!navContainer) {
    console.warn("⚠️ Sidebar container element not found in DOM for rendering menu.");
    return;
  }

  const items = menuInstance.getNavItems();

  let html = '<ul class="main-menu-list" style="list-style: none; padding: 0; margin: 0;">';
  
  items.forEach(item => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    
    // Updated classes (.main-menu-item and .main-menu-header) to match CSS
    html += `
      <li class="main-menu-item" style="margin-bottom: 5px;">
        <div class="main-menu-header" data-id="${item.id}">
          <span>${item.icon || ''} ${item.label}</span>
          ${hasSubItems ? '<span class="arrow">▼</span>' : ''}
        </div>
    `;

    if (hasSubItems) {
      html += `<ul class="sub-menu-list">`;
      item.subItems.forEach(sub => {
        html += `
          <li class="sub-menu-item">
            <a href="#" class="sub-item-link" data-subid="${sub.id}" style="text-decoration: none; color: inherit; display: block;">${sub.label}</a>
          </li>
        `;
      });
      html += `</ul>`;
    }

    html += `</li>`;
  });

  html += `</ul>`;
  navContainer.innerHTML = html;

  // Event listeners for accordion toggle using .open class and .main-menu-header
  navContainer.querySelectorAll('.main-menu-header').forEach(header => {
    header.addEventListener('click', () => {
      const parentLi = header.closest('.main-menu-item');
      const mainId = header.getAttribute('data-id');
      
      const isExpanded = menuInstance.toggleAccordion(mainId);
      
      if (isExpanded) {
        parentLi.classList.add('open');
      } else {
        parentLi.classList.remove('open');
      }
    });
  });

  // Event listeners for subItem clicks (Auto-hide sidebar when any submenu is tapped)
  navContainer.querySelectorAll('.sub-item-link').forEach(subLink => {
    subLink.addEventListener('click', (e) => {
      e.preventDefault();
      const subId = subLink.getAttribute('data-subid');
      menuInstance.setActiveSubItem(subId);

      // Dispatch custom event for FeaturesAssembly
      const event = new CustomEvent('menu-navigate', {
        detail: { subId }
      });
      document.dispatchEvent(event);

      // Automatically hide mobile sidebar and backdrop
      document.body.classList.remove('sidebar-mobile-open');
      const backdrop = document.getElementById('sidebar-backdrop');
      if (backdrop) {
        backdrop.classList.remove('backdrop-active');
      }
    });
  });
}
