import { ResponsiveCore } from './responsive-core.js';

export class ResponsiveAssembly {
  constructor(headerContainerId) {
    this.container = document.getElementById(headerContainerId);
    this.core = new ResponsiveCore();
    if (this.container) {
      this.init();
    }
  }

  init() {
    this.renderHeader();
    this.renderBackdrop();
    this.bindEvents();
    this.syncUI();
  }

  renderHeader() {
    const headerHTML = `
      <header class="responsive-header">
        <button id="hamburger-toggle-btn" class="hamburger-btn" aria-label="Toggle Navigation">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
        <div class="header-title">Admin Dashboard</div>
      </header>
    `;
    this.container.insertAdjacentHTML('afterbegin', headerHTML);
  }

  renderBackdrop() {
    if (!document.getElementById('sidebar-backdrop')) {
      const backdrop = document.createElement('div');
      backdrop.id = 'sidebar-backdrop';
      backdrop.className = 'sidebar-backdrop';
      document.body.appendChild(backdrop);
    }
  }

  syncUI() {
    const body = document.body;
    const backdrop = document.getElementById('sidebar-backdrop');
    const { mobileOpen, backdropActive } = this.core.config.classes;

    if (this.core.isMobile && this.core.isSidebarOpen) {
      body.classList.add(mobileOpen);
      if (backdrop) backdrop.classList.add(backdropActive);
    } else {
      body.classList.remove(mobileOpen);
      if (backdrop) backdrop.classList.remove(backdropActive);
    }
  }

  bindEvents() {
    // Hamburger click
    const btn = document.getElementById('hamburger-toggle-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        this.core.toggleSidebar();
        this.syncUI();
      });
    }

    // Backdrop click to close menu on mobile
    const backdrop = document.getElementById('sidebar-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        this.core.closeSidebarOnMobile();
        this.syncUI();
      });
    }

    // Screen resize listener
    window.addEventListener('resize', () => {
      this.core.updateScreenState();
      this.syncUI();
    });
  }
}
