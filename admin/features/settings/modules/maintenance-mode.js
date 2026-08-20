export class MaintenanceModeModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🚧 Maintenance Mode & Site Status Control</h4>
        <p style="font-size:13px; color:#586069;">Toggle single-click site offline status and display custom downtime messages.</p>
      </div>
    `;
  }
}
