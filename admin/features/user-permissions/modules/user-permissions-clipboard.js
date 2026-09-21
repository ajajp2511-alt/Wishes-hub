/**
 * User Permissions - Clipboard Sub-Module (Enhanced with Fallback)
 * Handles copying customized wishes text securely to the clipboard.
 */

import { userPermissionsCore } from '../user-permissions-core.js';
import { PERMISSION_TYPES } from '../user-permissions-config.js';

export class UserPermissionsClipboard {
    static async writeText(text) {
        if (!navigator.clipboard) {
            // Fallback for older browsers or non-secure contexts
            try {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed'; // Avoid scrolling to bottom
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                const successful = document.execCommand('copy');
                document.body.removeChild(textarea);
                
                if (successful) {
                    userPermissionsCore.setPermissionState(PERMISSION_TYPES.CLIPBOARD, 'granted-fallback');
                    return { success: true, method: 'fallback' };
                }
            } catch (fallbackErr) {
                console.error('Clipboard fallback error', fallbackErr);
            }

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
