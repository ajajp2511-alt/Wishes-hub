export class KvSubrequestTrackerModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🔑 Subrequest & KV/D1 Store Operations</h4>
        <p style="font-size:13px; color:#586069;">Monitor subrequests count, KV store read/write operations, and edge database queries.</p>
      </div>
    `;
  }
}
