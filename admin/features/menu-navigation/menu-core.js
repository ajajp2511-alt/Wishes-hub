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
