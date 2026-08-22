export class BulkLinkApiSyncModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📁 Bulk CSV Import & REST API Sync</h4>
        <p style="font-size:13px; color:#586069;">Import thousands of URLs via CSV or integrate REST API for automated link creation.</p>
      </div>
    `;
  }
}
