/**
 * modules/manage-home-announcements.js
 * Banner and broadcast message control
 */
export const HomeAnnouncements = {
  render() {
    const banner = document.getElementById('wh-announcement-banner');
    if (!banner) return;
    
    banner.innerHTML = `
      <div class="wh-banner">
        <span>🚀 Wishes Hub Admin v2.5 is running smoothly on Vercel.</span>
        <button onclick="this.parentElement.remove()">×</button>
      </div>
    `;
  }
};
