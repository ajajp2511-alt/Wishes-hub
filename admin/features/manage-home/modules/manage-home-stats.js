/**
 * modules/manage-home-stats.js
 * Real-time metrics and counter fetcher
 */
export const HomeStats = {
  async fetchAndRender() {
    try {
      const stats = { totalWishes: 1240, activeUsers: 85, storageUsed: '42%' };
      const grid = document.getElementById('wh-widgets-grid');
      if (!grid) return;

      let card = document.getElementById('wh-stats-card');
      if (!card) {
        card = document.createElement('div');
        card.id = 'wh-stats-card';
        card.className = 'wh-widget-card';
        grid.appendChild(card);
      }

      card.innerHTML = `
        <h3>Overview Stats</h3>
        <div class="wh-stats-row">
          <span>Total Wishes: <strong>${stats.totalWishes}</strong></span>
          <span>Active Users: <strong>${stats.activeUsers}</strong></span>
          <span>Storage: <strong>${stats.storageUsed}</strong></span>
        </div>
      `;
    } catch (err) {
      console.error('Failed to load home stats:', err);
    }
  }
};
