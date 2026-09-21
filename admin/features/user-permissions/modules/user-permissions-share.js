/**
 * User Permissions - Native Share Sub-Module (Enhanced)
 * Manages native device sharing permissions for wishes and greetings.
 */

import { userPermissionsCore } from '../user-permissions-core.js';
import { PERMISSION_TYPES } from '../user-permissions-config.js';

export class UserPermissionsShare {
    static async shareContent(shareData) {
        if (!navigator.share) {
            userPermissionsCore.setPermissionState(PERMISSION_TYPES.SHARE, 'unsupported');
            return { success: false, reason: 'unsupported' };
        }

        // Optional: Validate if specific share data can be shared
        if (navigator.canShare && !navigator.canShare(shareData)) {
            return { success: false, reason: 'invalid_share_data' };
        }

        try {
            await navigator.share(shareData);
            userPermissionsCore.setPermissionState(PERMISSION_TYPES.SHARE, 'granted');
            return { success: true };
        } catch (err) {
            // AbortError happens when user cancels the share dialog, which is not an error/denial
            if (err.name !== 'AbortError') {
                userPermissionsCore.setPermissionState(PERMISSION_TYPES.SHARE, 'failed');
                return { success: false, error: err.message };
            }
            return { success: false, reason: 'cancelled' };
        }
    }
}
