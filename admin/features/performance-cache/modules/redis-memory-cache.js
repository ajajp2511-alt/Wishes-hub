export class RedisMemoryCacheModule {
  static render(container, core) {
    const stats = core.getCacheStats();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🧠 Redis & In-Memory Cache Manager</h4>
        <p style="font-size:13px; color:#586069;">Key-value database query cache, hit/miss ratios, and memory store controls.</p>

        <div style="margin-top:15px; font-size:13px;">
          <p><strong>Hit Ratio:</strong> ${stats.hitRatio}</p>
          <p><strong>Memory Usage:</strong> ${stats.memoryUsed}</p>
          <p><strong>Cached Keys Count:</strong> ${stats.keysCached.toLocaleString()}</p>
        </div>
      </div>
    `;
  }
}
