export class DbQueryCacheModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🗄️ Database Query Caching & Indexing</h4>
        <p style="font-size:13px; color:#586069;">Cache frequent MongoDB/PostgreSQL queries to eliminate redundant DB reads.</p>
      </div>
    `;
  }
}
