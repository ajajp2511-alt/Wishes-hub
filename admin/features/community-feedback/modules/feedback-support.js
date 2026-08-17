export class FeedbackSupportModule {
  static render(container, core) {
    const tickets = core.getTickets();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🎫 Feedback & Support Ticket Desk</h4>
        <p style="font-size:13px; color:#586069;">Handle customer support inquiries, bug reports, and platform inquiries.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Ticket ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">User</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Subject</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Priority</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${tickets.map(t => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${t.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${t.user}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${t.subject}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${t.priority}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; font-weight:bold;">${t.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
