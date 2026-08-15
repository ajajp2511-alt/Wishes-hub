export class ProgrammaticSeoModule {
  static render(container, core) {
    const pages = core.getProgrammaticPages();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">⚡ Programmatic SEO Page Builder</h4>
        <p style="font-size:13px; color:#586069;">Mass generate localized festival landing pages with dynamic parameters.</p>
        <div style="margin-top:15px; font-size:13px;">
          ${pages.map(p => `<div><code>${p.slug}</code> - <strong style="color:#28a745;">${p.status}</strong></div>`).join('')}
        </div>
      </div>
    `;
  }
}
