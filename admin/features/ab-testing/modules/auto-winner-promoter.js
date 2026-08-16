export class AutoWinnerPromoterModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🏆 Auto-Winner Promoter Engine</h4>
        <p style="font-size:13px; color:#586069;">Automatically roll out the winning variant to 100% traffic upon reaching 95%+ confidence.</p>
      </div>
    `;
  }
}
