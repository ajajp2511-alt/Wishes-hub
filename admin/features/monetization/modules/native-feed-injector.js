export class NativeFeedInjectorModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📰 Contextual In-Feed Native Ad Injector</h4>
        <p style="font-size:13px; color:#586069;">Inject native-formatted ad cards seamlessly between wish template grids.</p>
      </div>
    `;
  }
}
