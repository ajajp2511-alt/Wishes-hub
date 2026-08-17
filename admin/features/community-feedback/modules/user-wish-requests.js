export class UserWishRequestsModule {
  static render(container, core) {
    const requests = core.getWishRequests();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">💡 User Wish Requests Queue</h4>
        <p style="font-size:13px; color:#586069;">Manage and approve custom greeting template requests submitted by users.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Request ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">User</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Requested Theme</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Upvotes</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${requests.map(r => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${r.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${r.user}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><strong>${r.theme}</strong></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">👍 ${r.upvotes}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:${r.status === 'Approved' ? '#28a745' : '#d73a49'}; font-weight:bold;">${r.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
