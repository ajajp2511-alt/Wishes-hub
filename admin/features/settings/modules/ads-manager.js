export class AdsManagerModule {
  static render(container, core) {
    const ads = core.getAdsenseSettings();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">💰 Google AdSense & Monetization Settings</h4>
        <p style="font-size:13px; color:#586069;">Manage AdSense publisher IDs, ads.txt files, and dynamic banner slots.</p>

        <div style="margin-top:15px; font-size:13px; display:flex; flex-direction:column; gap:10px;">
          <label><strong>AdSense Publisher ID:</strong><br><code>${ads.publisherId}</code></label>
          <label><strong>Auto Ads Injection:</strong> <b>${ads.autoAdsEnabled ? 'Enabled' : 'Disabled'}</b></label>
          <label><strong>Header Banner Slot ID:</strong> <code>${ads.headerAdSlot}</code></label>
        </div>
      </div>
    `;
  }
}
