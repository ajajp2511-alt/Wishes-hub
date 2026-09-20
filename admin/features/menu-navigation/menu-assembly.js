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

  getActiveSubItem() {
    return this.activeSubItemId;
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

  // 2. Hamburger button handling (matching index.html toggle-sidebar-btn)
  const hamburgerBtn = document.getElementById('toggle-sidebar-btn') || document.querySelector('header .hamburger, .menu-toggle, [aria-label="Menu"]');
  const sidebar = document.getElementById('menu-navigation-root') || document.querySelector('.sidebar, aside, #sidebar');

  if (hamburgerBtn && sidebar) {
    hamburgerBtn.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-mobile-open');
      console.log("Hamburger clicked, brand:", menuInstance.getBrand().NAME);
    });
  }

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
    const isExpanded = menuInstance.isExpanded(item.id);
    
    html += `
      <li class="menu-item" style="margin-bottom: 5px;">
        <div class="menu-main-link" data-id="${item.id}" style="padding: 10px 15px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
          <span>${item.icon || ''} ${item.label}</span>
          ${hasSubItems ? `<span class="arrow" style="transform: rotate(${isExpanded ? '180deg' : '0deg'}); transition: transform 0.2s;">▼</span>` : ''}
        </div>
    `;

    if (hasSubItems) {
      html += `<ul class="sub-menu-list" style="list-style: none; padding-left: 20px; display: ${isExpanded ? 'block' : 'none'};">`;
      item.subItems.forEach(sub => {
        const isActive = menuInstance.getActiveSubItem() === sub.id;
        html += `
          <li style="padding: 6px 10px;">
            <a href="#" class="sub-item-link ${isActive ? 'active-sub-item' : ''}" data-subid="${sub.id}" style="text-decoration: none; color: inherit; ${isActive ? 'font-weight: bold; color: var(--accent-color, #007bff);' : ''}">${sub.label}</a>
          </li>
        `;
      });
      html += `</ul>`;
    }

    html += `</li>`;
  });

  html += `</ul>`;
  navContainer.innerHTML = html;

  // Event listeners for accordion toggle and navigation clicks
  navContainer.querySelectorAll('.menu-main-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const mainId = link.getAttribute('data-id');
      const subList = link.nextElementSibling;
      
      if (subList && subList.classList.contains('sub-menu-list')) {
        const isExpanded = menuInstance.toggleAccordion(mainId);
        subList.style.display = isExpanded ? 'block' : 'none';
        
        // Rotate arrow icon smoothly if present
        const arrow = link.querySelector('.arrow');
        if (arrow) {
          arrow.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      } else {
        // Fallback for Main items that do NOT have subItems (direct navigation click)
        const event = new CustomEvent('menu-navigate', {
          detail: { mainId }
        });
        document.dispatchEvent(event);
      }
    });
  });

  navContainer.querySelectorAll('.sub-item-link').forEach(subLink => {
    subLink.addEventListener('click', (e) => {
      e.preventDefault();
      const subId = subLink.getAttribute('data-subid');
      menuInstance.setActiveSubItem(subId);

      // Update active classes visually without full re-render
      navContainer.querySelectorAll('.sub-item-link').forEach(l => {
        l.classList.remove('active-sub-item');
        l.style.fontWeight = 'normal';
        l.style.color = 'inherit';
      });
      subLink.classList.add('active-sub-item');
      subLink.style.fontWeight = 'bold';
      subLink.style.color = 'var(--accent-color, #007bff)';

      // Dispatch custom event for FeaturesAssembly
      const event = new CustomEvent('menu-navigate', {
        detail: { subId }
      });
      document.dispatchEvent(event);
    });
  });
}
