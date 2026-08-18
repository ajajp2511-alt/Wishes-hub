export class MessageTemplatesModule {
  static render(container, core) {
    const tpls = core.getTemplates();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📝 Push Message Templates</h4>
        <p style="font-size:13px; color:#586069;">Create and edit push notification layouts, hero banners, and dynamic placeholders.</p>

        <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:12px; margin-top:15px;">
          ${tpls.map(t => `
            <div style="border:1px solid #e1e4e8; padding:12px; border-radius:6px; background:#f8f9fa;">
              <div style="font-size:11px; color:#6e7681; font-weight:bold;">${t.id}</div>
              <div style="font-size:14px; font-weight:bold; margin-top:4px;">${t.title}</div>
              <div style="font-size:12px; color:#333; margin-top:4px;">${t.body}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
