export class ActiveLanguagesModule {
  static render(container, core) {
    const locales = core.getLocales();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🌐 Active Languages & Locales</h4>
        <p style="font-size:13px; color:#586069;">Enable/disable regional language support and set fallback rules.</p>

        <div style="margin-top:15px; display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:12px;">
          ${locales.map(l => `
            <div style="border:1px solid #e1e4e8; padding:12px; border-radius:6px; background:${l.active ? '#f6f8fa' : '#fff'}; display:flex; justify-space-between; align-items:center;">
              <div>
                <strong>${l.name}</strong>
                <small style="display:block; color:#586069;">${l.region}</small>
              </div>
              <input type="checkbox" data-code="${l.code}" ${l.active ? 'checked' : ''} class="locale-toggle" />
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.locale-toggle').forEach(chk => {
      chk.addEventListener('change', (e) => {
        core.toggleLocaleStatus(e.target.dataset.code);
      });
    });
  }
}
