export class LinkTrackingUtmModule {
  static render(container, core) {
    const links = core.getLinks();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">UTM Generator & Dynamic Short Links</h4>
        <div style="margin-top:15px;">
          ${links.map(l => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border:1px solid #e1e4e8; border-radius:6px; margin-bottom:8px;">
              <div>
                <strong>Short Link:</strong> <code>https://hub.vercel.app/s/${l.shortCode}</code>
                <small style="display:block; color:#586069;">Target: ${l.originalUrl}</small>
              </div>
              <span style="background:#dafbe1; color:#1a7f37; font-weight:bold; padding:4px 10px; border-radius:12px; font-size:12px;">
                ${l.clicks} Clicks
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
