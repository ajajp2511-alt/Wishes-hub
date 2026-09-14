/**
 * modules/manage-home-actions.js
 * Shortcut routing and quick trigger handlers
 */
export const HomeActions = {
  bindShortcuts() {
    const grid = document.getElementById('wh-widgets-grid');
    if (!grid) return;

    const actionsBox = document.createElement('div');
    actionsBox.id = 'wh-actions-widget';
    actionsBox.className = 'wh-widget-card';
    actionsBox.innerHTML = `
      <h3>Quick Actions</h3>
      <div class="wh-actions-grid">
        <button onclick="window.location.href='../wishes/'">Manage Wishes</button>
        <button onclick="window.location.href='../config/'">Loading Config</button>
        <button onclick="window.WishesHome.exportReport()">Export Report</button>
      </div>
    `;
    grid.appendChild(actionsBox);
  }
};
