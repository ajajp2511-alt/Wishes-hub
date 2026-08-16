export class AiHypothesisGeneratorModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">💡 AI Test Hypothesis Generator</h4>
        <p style="font-size:13px; color:#586069;">Analyze drop-off points and automatically receive AI recommendations for new tests.</p>
      </div>
    `;
  }
}
