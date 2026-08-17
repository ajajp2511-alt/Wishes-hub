export class LiveFeedbackPopupsModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">⭐ Live Exit-Intent & In-Page NPS Surveys</h4>
        <p style="font-size:13px; color:#586069;">Trigger post-creation rating pop-ups to measure overall user satisfaction.</p>
      </div>
    `;
  }
}
