export class CriticalCssLazyloadModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🎨 Critical CSS & Script Lazy Loading</h4>
        <p style="font-size:13px; color:#586069;">Inline above-the-fold styles and defer non-essential JavaScript execution.</p>
      </div>
    `;
  }
}
