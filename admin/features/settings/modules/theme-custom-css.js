export class ThemeCustomCssModule {
  static render(container, core) {
    const theme = core.getThemeSettings();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🎨 Theme Styling & Custom CSS Overrides</h4>
        <p style="font-size:13px; color:#586069;">Configure platform brand colors, light/dark themes, and inline CSS scripts.</p>

        <div style="margin-top:15px; font-size:13px;">
          <p><strong>Primary Brand Color:</strong> <span style="background:${theme.primaryColor}; color:#fff; padding:2px 8px; border-radius:4px;">${theme.primaryColor}</span></p>
          <p><strong>Custom Global CSS:</strong></p>
          <pre style="background:#f6f8fa; padding:10px; border:1px solid #e1e4e8; border-radius:4px;"><code>${theme.customCss}</code></pre>
        </div>
      </div>
    `;
  }
}
