/**
 * Menu Core & Navigation Module
 * Path: admin/features/menu-navigation/menu-core.js
 */

import { MENU_CONFIG } from './menu-config.js';

export class MenuCore {
  constructor() {
    this.config = MENU_CONFIG;
    this.activeSubItemId = null;
    this.activeMainId = null;
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
    this.activeMainId = null;
  }

  setActiveMainItem(mainId) {
    this.activeMainId = mainId;
    this.activeSubItemId = null;
  }

  getActiveSubItem() {
    return this.activeSubItemId;
  }

  getActiveMainItem() {
    return this.activeMainId;
  }

  isExpanded(mainItemId) {
    return this.expandedMenus.has(mainItemId);
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
  
  // 1. Render Menu UI into the Sidebar / Nav container
  renderMenuUI(menuInstance);

  // 2. Setup Live Search Filtering listener
  setupSearchListener(menuInstance);

  return menuInstance;
}

// Helper function to build and insert HTML into the DOM
function renderMenuUI(menuInstance, itemsToRender = null) {
  const navContainer = document.getElementById('menu-navigation-root') || document.querySelector('.admin-sidebar, .sidebar-nav, #sidebar-menu, aside nav');
  
  if (!navContainer) {
    console.warn("⚠️ Sidebar container element not found in DOM for rendering menu.");
    return;
  }

  const items = itemsToRender || menuInstance.getNavItems();

  let html = '<ul class="main-menu-list" style="list-style: none; padding: 0; margin: 0;">';
  
  items.forEach(item => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = menuInstance.isExpanded(item.id);
    const isMainActive = menuInstance.getActiveMainItem() === item.id;
    
    html += `
      <li class="main-menu-item ${isExpanded ? 'open' : ''}" style="margin-bottom: 5px;">
        <div class="main-menu-header ${isMainActive ? 'active-main' : ''}" data-id="${item.id}" style="${isMainActive ? 'background-color: #e2e8f0; font-weight: bold;' : ''}">
          <span>${item.icon || ''} ${item.label}</span>
          ${hasSubItems ? '<span class="arrow">▼</span>' : ''}
        </div>
    `;

    if (hasSubItems) {
      html += `<ul class="sub-menu-list" style="display: ${isExpanded ? 'block' : 'none'};">`;
      item.subItems.forEach(sub => {
        const isSubActive = menuInstance.getActiveSubItem() === sub.id;
        html += `
          <li class="sub-menu-item">
            <a href="#" class="sub-item-link ${isSubActive ? 'active' : ''}" data-subid="${sub.id}" style="${isSubActive ? 'font-weight: bold; color: #1e40af; background-color: #e2e8f0;' : ''}">${sub.label}</a>
          </li>
        `;
      });
      html += `</ul>`;
    }

    html += `</li>`;
  });

  html += `</ul>`;
  navContainer.innerHTML = html;

  // Bind event listeners
  bindMenuEvents(navContainer, menuInstance);
}

// Bind event listeners for accordion toggle, leaf items, sub-items, and mobile auto-close
function bindMenuEvents(navContainer, menuInstance) {
  navContainer.querySelectorAll('.main-menu-header').forEach(header => {
    header.addEventListener('click', () => {
      const parentLi = header.closest('.main-menu-item');
      const mainId = header.getAttribute('data-id');
      const subList = parentLi.querySelector('.sub-menu-list');
      
      if (subList) {
        const isExpanded = menuInstance.toggleAccordion(mainId);
        if (isExpanded) {
          parentLi.classList.add('open');
          subList.style.display = 'block';
        } else {
          parentLi.classList.remove('open');
          subList.style.display = 'none';
        }
      } else {
        // Fallback for Main items without subItems (Leaf items direct navigation)
        menuInstance.setActiveMainItem(mainId);
        
        navContainer.querySelectorAll('.main-menu-header').forEach(h => {
          h.classList.remove('active-main');
          h.style.backgroundColor = '';
        });
        header.classList.add('active-main');
        header.style.backgroundColor = '#e2e8f0';

        const event = new CustomEvent('menu-navigate', {
          detail: { mainId }
        });
        document.dispatchEvent(event);

        closeMobileSidebar();
      }
    });
  });

  navContainer.querySelectorAll('.sub-item-link').forEach(subLink => {
    subLink.addEventListener('click', (e) => {
      e.preventDefault();
      const subId = subLink.getAttribute('data-subid');
      menuInstance.setActiveSubItem(subId);

      // Update visual active classes
      navContainer.querySelectorAll('.sub-item-link').forEach(l => {
        l.classList.remove('active');
        l.style.fontWeight = 'normal';
        l.style.color = '';
        l.style.backgroundColor = '';
      });
      subLink.classList.add('active');
      subLink.style.fontWeight = 'bold';
      subLink.style.color = '#1e40af';
      subLink.style.backgroundColor = '#e2e8f0';

      // Dispatch custom event for FeaturesAssembly
      const event = new CustomEvent('menu-navigate', {
        detail: { subId }
      });
      document.dispatchEvent(event);

      closeMobileSidebar();
    });
  });
}

// Setup live search filtering input listener
function setupSearchListener(menuInstance) {
  const searchInput = document.querySelector('.sidebar-search input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      const filteredItems = menuInstance.filterMenuItems(query);
      renderMenuUI(menuInstance, filteredItems);
    });
  }
}

// Helper to close mobile sidebar
function closeMobileSidebar() {
  document.body.classList.remove('sidebar-mobile-open');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (backdrop) {
    backdrop.classList.remove('backdrop-active');
  }
}
