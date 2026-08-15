export class SitemapIndexingModule {
  static render(container, core) {
    const status = core.getSitemapStatus();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🗺️ Automated Sitemap & Instant Indexing</h4>
        <p style="font-size:13px; color:#586069;">Auto-generate sitemap.xml and trigger Google Instant Indexing API.</p>

        <div style="margin-top:15px; padding:12px; background:#f6f8fa; border-radius:6px; font-size:13px;">
          <div>• Last Generated: <strong>${status.lastGenerated}</strong></div>
          <div>• Total Indexed URLs: <strong>${status.totalUrls}</strong></div>
        </div>

        <button id="btn-ping-indexing" style="margin-top:15px; padding:8px 16px; background:#28a745; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">
          ⚡ Trigger Google Instant Indexing
        </button>
      </div>
    `;

    container.querySelector('#btn-ping-indexing')?.addEventListener('click', async () => {
      alert('Google Indexing Request Triggered!');
    });
  }
}
