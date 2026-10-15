/**
 * Approval & Problem Management Navigation Item
 * Path: admin/features/menu-navigation/items/approvals-nav.js
 */

export const approvalsNavItem = {
  id: 'approvals-module',
  label: 'Approvals & Problems',
  icon: '✅',
  subItems: [
    { id: 'approvals-dashboard', label: 'Approval Queue' },
    { id: 'approvals-admin-scope', label: 'Admin Access Requests' },
    { id: 'approvals-custom-scope', label: 'Heavy Design & Templates' },
    { id: 'approvals-user-scope', label: 'User Reports & Problems' },
    { id: 'approvals-audit-log', label: 'Audit Logs & SLA' }
  ]
};
