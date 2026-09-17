/**
 * User Permissions - Clipboard Sub-Module
 * Handles copying customized wishes text securely to the clipboard.
 */

import { userPermissionsCore } from '../user-permissions-core.js';
import { PERMISSION_TYPES } from '../user-permissions-config.js';

export class UserPermissionsClipboard {
    static async writeText(text) {
        if (!navigator.clipboard) {
            userPermissionsCore.setPermissionState(PERMISSION_TYPES.CLIPBOARD, 'unsupported');
            return { success: false, reason: 'unsupported' };
        }

        try {
            await navigator.clipboard.writeText(text);
            userPermissionsCore.setPermissionState(PERMISSION_TYPES.CLIPBOARD, 'granted');
            return { success: true };
        } catch (err) {
            userPermissionsCore.setPermissionState(PERMISSION_TYPES.CLIPBOARD, 'denied');
            return { success: false, error: err.message };
        }
    }
}
