export class CachePerformanceModule {
  static render(container, core) {
    const cache = core.getCacheStats();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🎯 Edge Cache Performance & Offload</h4>
        <p style="font-size:13px; color:#586069;">Cache hit rates, bandwidth savings, and edge latency reduction metrics.</p>

        <div style="margin-top:15px; font-size:13px;">
          <p><strong>Edge Cache Hit Ratio:</strong> <span style="color:#28a745; font-weight:bold;">${cache.edgeHitRatio}</span></p>
          <p><strong>Egress Bandwidth Saved:</strong> ${cache.bandwidthSaved}</p>
          <p><strong>Avg Edge Response Time:</strong> ${cache.avgEdgeLatency}</p>
        </div>
      </div>
    `;
  }
}
