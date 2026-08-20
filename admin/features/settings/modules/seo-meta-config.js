export class SeoMetaConfigModule {
  static render(container, core) {
    const seo = core.getSeoSettings();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🔍 SEO & Meta Tags Configuration</h4>
        <p style="font-size:13px; color:#586069;">Configure site-wide meta titles, descriptions, canonical URLs, and Open Graph share cards.</p>

        <div style="margin-top:15px; font-size:13px; display:flex; flex-direction:column; gap:10px;">
          <label><strong>Site Title:</strong><br><input type="text" value="${seo.siteTitle}" style="width:100%; padding:6px; margin-top:4px;"></label>
          <label><strong>Meta Description:</strong><br><textarea style="width:100%; padding:6px; margin-top:4px;">${seo.metaDescription}</textarea></label>
          <label><strong>Canonical URL:</strong><br><input type="text" value="${seo.canonicalUrl}" style="width:100%; padding:6px; margin-top:4px;"></label>
        </div>
      </div>
    `;
  }
}
