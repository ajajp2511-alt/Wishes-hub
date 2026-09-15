/**
 * manage-home-core.js
 * Render lifecycle, DOM binding, and event listeners for Home Dashboard
 */
import { HomeConfig } from './manage-home-config.js';
import { HomeWidgets } from './modules/manage-home-widgets.js';
import { HomePalette } from './modules/manage-home-palette.js';
import { HomeRefresh } from './modules/manage-home-refresh.js';
import { HomeNotes } from './modules/manage-home-notes.js';

class HomeDashboardManager {
  constructor() {
    this.isInitialized = false;
  }

  init(containerSelector = '#dynamic-content-root') {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = `
      <div class="wh-home-wrapper">
        <div id="wh-announcement-banner"></div>
        <div class="wh-dashboard-header">
          <h1>Admin Dashboard</h1>
          <div class="wh-dashboard-controls">
            <button id="wh-palette-trigger" class="wh-btn-secondary">Quick Search (Ctrl+K)</button>
            <div id="wh-health-badge" class="wh-health-ok">System Healthy</div>
          </div>
        </div>
        <div id="wh-widgets-grid" class="wh-widgets-grid"></div>
      </div>
    `;

    HomeWidgets.init();
    HomePalette.init();
    HomeNotes.init();
    HomeRefresh.startPolling();

    this.isInitialized = true;
    window.dispatchEvent(new CustomEvent('wishes-home:initialized'));
  }

  destroy() {
    HomeRefresh.stopPolling();
    this.isInitialized = false;
  }
}

export const homeDashboard = new HomeDashboardManager();
