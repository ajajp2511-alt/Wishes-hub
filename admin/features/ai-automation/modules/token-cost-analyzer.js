export class TokenCostAnalyzerModule {
  static render(container, core) {
    const stats = core.getUsageStats();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📊 Vercel AI Token & Cost Analytics</h4>
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-top:15px; text-align:center;">
          <div style="padding:10px; background:#f6f8fa; border-radius:6px;">
            <strong style="font-size:18px; color:#0366d6;">${stats.totalTokens}</strong>
            <small style="display:block; color:#586069;">Total Tokens</small>
          </div>
          <div style="padding:10px; background:#f6f8fa; border-radius:6px;">
            <strong style="font-size:18px; color:#28a745;">${stats.totalRequests}</strong>
            <small style="display:block; color:#586069;">Total Requests</small>
          </div>
          <div style="padding:10px; background:#f6f8fa; border-radius:6px;">
            <strong style="font-size:18px; color:#6f42c1;">${stats.estimatedCost}</strong>
            <small style="display:block; color:#586069;">Est. Cost</small>
          </div>
        </div>
      </div>
    `;
  }
}
