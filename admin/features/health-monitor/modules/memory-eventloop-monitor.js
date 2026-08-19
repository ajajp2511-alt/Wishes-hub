export class MemoryEventloopMonitorModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🧠 Memory Leak & Event Loop Lag Monitor</h4>
        <p style="font-size:13px; color:#586069;">Node.js heap memory consumption, garbage collection metrics, and loop delay charts.</p>
      </div>
    `;
  }
}
