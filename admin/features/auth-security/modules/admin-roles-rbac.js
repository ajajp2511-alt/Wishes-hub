export class AdminRolesRbacModule {
  static render(container, core) {
    const roles = core.getAdminRoles();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">👥 Admin Roles & RBAC Matrix</h4>
        <p style="font-size:13px; color:#586069;">Configure granular role permissions and admin team assignments.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Role ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Role Name</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Permissions Scope</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Assigned Admins</th>
            </tr>
          </thead>
          <tbody>
            ${roles.map(r => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${r.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><b>${r.name}</b></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${r.permissions.join(', ')}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${r.members} Users</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
