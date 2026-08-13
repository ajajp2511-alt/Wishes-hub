export class EmailNewslettersModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">Email Newsletters & Abandoned Wish Recovery</h4>
        <p style="font-size:13px; color:#586069;">Automated re-engagement emails for un-shared wish cards.</p>
        <div style="display:flex; gap:15px; margin-top:15px;">
          <div style="flex:1; padding:15px; background:#f6f8fa; border-radius:6px; text-align:center;">
            <strong>Avg Open Rate</strong>
            <div style="font-size:20px; color:#2da44e; margin-top:5px;">38.5%</div>
          </div>
          <div style="flex:1; padding:15px; background:#f6f8fa; border-radius:6px; text-align:center;">
            <strong>Wishes Recovered</strong>
            <div style="font-size:20px; color:#0366d6; margin-top:5px;">1,240</div>
          </div>
        </div>
      </div>
    `;
  }
}
