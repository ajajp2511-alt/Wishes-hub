export class HomepageHeroModule {
  static render(container, core) {
    const banners = core.getHeroBanners();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🌟 Homepage Hero Manager</h4>
        <p style="font-size:13px; color:#586069;">Configure top featured banners and Hero slotting order.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Title</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Position</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${banners.map(b => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><strong>${b.title}</strong></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">Slot #${b.position}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:${b.status === 'Active' ? '#28a745' : '#e67e22'}; font-weight:bold;">${b.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
