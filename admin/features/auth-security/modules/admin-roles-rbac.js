/**
 * Admin Roles & RBAC Module (Fixed for Direct Object Export)
 * Path: admin/features/auth-security/modules/admin-roles-rbac.js
 */

export const AdminRolesRbacModule = {
  render(container, core) {
    const roles = core.getAdminRoles();
    
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div>
            <h4 style="margin:0; font-size: 16px;">👥 Admin Roles & RBAC Matrix</h4>
            <p style="font-size:13px; color:#586069; margin: 5px 0 0 0;">Configure granular role permissions and admin team assignments.</p>
          </div>
          <button id="btn-add-role" style="background: #2ea44f; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-size: 13px; cursor: pointer; font-weight: 500;">+ Add New Role</button>
        </div>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Role ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Role Name</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Permissions Scope</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Assigned Admins</th>
              <th style="padding:8px; border:1px solid #e1e4e8; text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${roles.map(r => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${r.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><b>${r.name}</b></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${r.permissions.join(', ')}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${r.members} Users</td>
                <td style="padding:8px; border:1px solid #e1e4e8; text-align: right;">
                  <button class="btn-delete-role" data-id="${r.id}" style="background: transparent; color: #d73a49; border: 1px solid #d73a49; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">Remove</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    this.bindEvents(container, core);
  },

  bindEvents(container, core, onUpdate) {
    const addBtn = container.querySelector('#btn-add-role');
    addBtn?.addEventListener('click', () => {
      const roleName = prompt('Enter new role name:');
      if (!roleName) return;
      
      const newRole = {
        id: `ROLE-0${core.getAdminRoles().length + 1}`,
        name: roleName,
        permissions: ['WISHES_READ'],
        members: 0
      };

      if (core.addAdminRole(newRole)) {
        this.render(container, core);
        if (typeof onUpdate === 'function') onUpdate({ action: 'ROLE_ADDED', role: newRole });
      }
    });

    container.querySelectorAll('.btn-delete-role').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const roleId = e.target.getAttribute('data-id');
        if (confirm(`Are you sure you want to delete role ${roleId}?`)) {
          core.removeAdminRole(roleId);
          this.render(container, core);
          if (typeof onUpdate === 'function') onUpdate({ action: 'ROLE_REMOVED', roleId });
        }
      });
    });
  }
};
