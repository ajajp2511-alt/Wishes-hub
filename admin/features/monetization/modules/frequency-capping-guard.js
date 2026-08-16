export class FrequencyCappingGuardModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">⏱️ Per-User Frequency Capping Guard</h4>
        <p style="font-size:13px; color:#586069;">Cap interstitial views per hour to maintain optimal user experience.</p>
      </div>
    `;
  }
}
