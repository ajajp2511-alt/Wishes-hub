export class WishGenerationsModule {
  static render(container, core) {
    const data = core.getLiveData();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">✨ Wish Generation Volume</h4>
        <p style="font-size:13px; color:#586069;">Daily card creations and conversion metrics.</p>
        
        <div style="margin-top:15px; background:#f6f8fa; padding:15px; border-radius:6px;">
          <strong style="font-size:20px; color:#28a745;">${data.todayWishes}</strong>
          <span style="font-size:13px; color:#586069; display:block;">Total Wishes Generated Today</span>
        </div>
      </div>
    `;
  }
}
