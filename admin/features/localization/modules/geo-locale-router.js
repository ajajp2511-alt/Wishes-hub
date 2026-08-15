export class GeoLocaleRouterModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📍 Geo IP Location Auto-Router</h4>
        <p style="font-size:13px; color:#586069;">Auto-detect visitor state/location to route default language & festival greetings.</p>
      </div>
    `;
  }
}
