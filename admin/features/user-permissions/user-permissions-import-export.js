/**
 * User Permissions - Import/Export Utility
 * Allows backing up and restoring user permission states and logs.
 */

import { userPermissionsCore } from './user-permissions-core.js';

export class UserPermissionsImportExport {
    static exportData() {
        const data = JSON.stringify(userPermissionsCore.state, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `wishes-hub-permissions-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    static importData(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (parsed && parsed.grants) {
                userPermissionsCore.state = parsed;
                userPermissionsCore.saveState();
                return { success: true };
            }
            return { success: false, error: 'Invalid structure' };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }
}
