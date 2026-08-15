export class FestiveCountdownModule {
  static render(container, core) {
    const countdowns = core.getCountdowns();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">⏳ Festive Countdown Engine</h4>
        <p style="font-size:13px; color:#586069;">Set T-minus event timers and auto-trigger festive banners.</p>
        <div style="margin-top:15px; font-size:13px;">
          ${countdowns.map(c => `
            <div style="padding:10px; background:#f6f8fa; border-radius:6px; margin-bottom:8px;">
              <strong>${c.event}</strong> — Target: <code>${c.targetDate}</code> [${c.status}]
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
