/**
 * manage-home-actions.js
 * Shortcut routing and quick trigger handlers with event-driven architecture
 */
export const HomeActions = {
  bindShortcuts() {
    const grid = document.getElementById('wh-widgets-grid');
    if (!grid) {
      console.warn("⚠️ Warning: #wh-widgets-grid not found for HomeActions.");
      return;
    }

    // Prevent duplicate injection if already rendered
    if (document.getElementById('wh-actions-widget')) return;

    const actionsBox = document.createElement('div');
    actionsBox.id = 'wh-actions-widget';
    actionsBox.className = 'wh-widget-card';
    actionsBox.innerHTML = `
      <h3>Quick Actions</h3>
      <div class="wh-actions-grid">
        <button type="button" data-action="manage-wishes" class="wh-action-btn">Manage Wishes</button>
        <button type="button" data-action="loading-config" class="wh-action-btn">Loading Config</button>
        <button type="button" data-action="export-report" class="wh-action-btn">Export Report</button>
      </div>
    `;
    grid.appendChild(actionsBox);

    // Bind event listeners safely
    actionsBox.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;

      const action = button.getAttribute('data-action');

      switch (action) {
        case 'manage-wishes':
          // Trigger custom router event or fallback to location change
          const wishNavEvent = new CustomEvent('menu-navigate', { detail: { subId: 'wishes-all' } });
          document.dispatchEvent(wishNavEvent);
          break;

        case 'loading-config':
          const configNavEvent = new CustomEvent('menu-navigate', { detail: { subId: 'loading-spinner' } });
          document.dispatchEvent(configNavEvent);
          break;

        case 'export-report':
          if (window.WishesHome && typeof window.WishesHome.exportReport === 'function') {
            window.WishesHome.exportReport();
          } else {
            console.error("❌ exportReport function is not available on window.WishesHome");
          }
          break;

        default:
          console.log(`ℹ️ Unhandled action: ${action}`);
      }
    });

    console.log("⚡ HomeActions shortcuts bound successfully.");
  }
};
