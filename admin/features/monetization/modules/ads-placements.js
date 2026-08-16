export class AdsPlacementsModule {
  static render(container, core) {
    const slots = core.getPlacements();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📌 Global Ads Placements Manager</h4>
        <p style="font-size:13px; color:#586069;">Configure multi-network ad slot scripts, positions, and global toggles.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Slot ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Location</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Network Type</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${slots.map(s => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${s.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><strong>${s.location}</strong></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${s.network}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#28a745; font-weight:bold;">${s.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
