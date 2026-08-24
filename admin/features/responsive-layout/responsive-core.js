import { RESPONSIVE_CONFIG } from './responsive-config.js';

export class ResponsiveCore {
  constructor() {
    this.config = RESPONSIVE_CONFIG;
    this.isMobile = this.checkIsMobile();
    this.isSidebarOpen = !this.isMobile;
  }

  checkIsMobile() {
    return window.innerWidth <= this.config.breakpoints.mobileMax;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    return this.isSidebarOpen;
  }

  closeSidebarOnMobile() {
    if (this.checkIsMobile()) {
      this.isSidebarOpen = false;
    }
  }

  updateScreenState() {
    const wasMobile = this.isMobile;
    this.isMobile = this.checkIsMobile();
    
    // Auto adjust state on screen resize
    if (wasMobile !== this.isMobile) {
      this.isSidebarOpen = !this.isMobile;
    }
    return { isMobile: this.isMobile, isOpen: this.isSidebarOpen };
  }
}
