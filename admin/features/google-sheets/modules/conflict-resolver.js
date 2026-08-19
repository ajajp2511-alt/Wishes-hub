export class ConflictResolverModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">⚔️ Sync Conflict & Collision Resolver</h4>
        <p style="font-size:13px; color:#586069;">Define master precedence (Database Overwrites Sheet vs Sheet Overwrites DB) when records clash.</p>
      </div>
    `;
  }
}
