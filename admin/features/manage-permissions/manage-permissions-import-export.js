/**
 * Manage Permissions - Import & Export
 * Allows backing up and restoring permission matrices via JSON.
 */

import { permissionCore } from './manage-permissions-core.js';

export class PermissionImportExport {
    static exportConfig() {
        const data = JSON.stringify(permissionCore.state, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `wishes-hub-permissions-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    static importConfig(jsonString, adminId) {
        try {
            const parsed = JSON.parse(jsonString);
            if (parsed.roles && parsed.matrix) {
                permissionCore.state = parsed;
                permissionCore.saveState();
                permissionCore.logAudit(adminId, 'IMPORT_CONFIG', 'Imported permission configurations successfully.');
                return { success: true, message: 'Permissions imported successfully!' };
            }
            throw new Error('Invalid JSON schema structure.');
        } catch (e) {
            return { success: false, message: e.message };
        }
    }
}
