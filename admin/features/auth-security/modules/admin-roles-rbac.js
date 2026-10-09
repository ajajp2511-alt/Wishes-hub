/**
 * Admin Roles & RBAC Module (Optimized & Robust)
 * Path: admin/features/auth-security/modules/admin-roles-rbac.js
 */

export const AdminRolesRbacModule = {
  render(container, core) {
    const roles = core.getAdminRoles();
    
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h4 style="margin:0; font-size: 16px; color: #24292e;">👥 Admin Roles & RBAC Matrix</h4>
            <p style="font-size:13px; color:#586069; margin: 5px 0 0 0;">Configure granular role permissions and admin team assignments.</p>
          </div>
          <button id="btn-add-role" style="background: #2ea44f; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; font-size: 13px; cursor: pointer; font-weight: 500;">+ Add New Role</button>
        </div>

        <div style="overflow-x: auto;">
          <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px; min-width: 600px;">
            <thead>
              <tr style="background:#f6f8fa; text-align:left;">
                <th style="padding:10px; border:1px solid #e1e4e8; color: #24292e;">Role ID</th>
                <th style="padding:10px; border:1px solid #e1e4e8; color: #24292e;">Role Name</th>
                <th style="padding:10px; border:1px solid #e1e4e8; color: #24292e;">Permissions Scope</th>
                <th style="padding:10px; border:1px solid #e1e4e8; color: #24292e;">Assigned Admins</th>
                <th style="padding:10px; border:1px solid #e1e4e8; text-align: right; color: #24292e;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${roles.map(r => `
                <tr>
                  <td style="padding:10px; border:1px solid #e1e4e8;"><code>${r.id}</code></td>
                  <td style="padding:10px; border:1px solid #e1e4e8;"><b>${r.name}</b></td>
                  <td style="padding:10px; border:1px solid #e1e4e8;"><code style="background: #f1f8ff; padding: 2px 6px; border-radius: 4px; color: #0366d6;">${Array.isArray(r.permissions) ? r.permissions.join(', ') : r.permissions}</code></td>
                  <td style="padding:10px; border:1px solid #e1e4e8;">${r.members || 0} Users</td>
                  <td style="padding:10px; border:1px solid #e1e4e8; text-align: right;">
                    <button class="btn-delete-role" data-id="${r.id}" style="background: transparent; color: #d73a49; border: 1px solid #d73a49; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500;">Remove</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.bindEvents(container, core);
  },

  bindEvents(container, core, onUpdate) {
    const addBtn = container.querySelector('#btn-add-role');
    addBtn?.addEventListener('click', () => {
      const roleName = prompt('Enter new role name (e.g., Senior Editor):');
      if (!roleName || roleName.trim() === '') return;
      
      const permissionsInput = prompt('Enter permissions comma-separated (e.g., WISHES_READ, WISHES_WRITE):', 'WISHES_READ');
      const permissions = permissionsInput ? permissionsInput.split(',').map(p => p.trim()).filter(Boolean) : ['WISHES_READ'];

      const newRole = {
        id: `ROLE-${Date.now().toString().slice(-4)}`,
        name: roleName.trim(),
        permissions: permissions,
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
