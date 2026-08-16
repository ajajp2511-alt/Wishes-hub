export class CampaignSchedulerModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📅 Sponsorship Campaign Scheduler</h4>
        <p style="font-size:13px; color:#586069;">Set automated start/end dates and maximum impression caps for direct sponsors.</p>
      </div>
    `;
  }
}
