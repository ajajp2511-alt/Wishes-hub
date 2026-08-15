export class TranslationKeysModule {
  static render(container, core) {
    const keys = core.getTranslationKeys();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🔑 Translation Keys Dictionary (i18n)</h4>
        <p style="font-size:13px; color:#586069;">Manage key-value translations across all enabled languages.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Key ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Hindi (hi)</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">English (en)</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Marathi (mr)</th>
            </tr>
          </thead>
          <tbody>
            ${Object.keys(keys).map(k => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${k}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${keys[k].hi || '-'}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${keys[k].en || '-'}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${keys[k].mr || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
