/**
 * User Permissions - Native Share Sub-Module
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

        try {
            await navigator.share(shareData);
            userPermissionsCore.setPermissionState(PERMISSION_TYPES.SHARE, 'granted');
            return { success: true };
        } catch (err) {
            if (err.name !== 'AbortError') {
                userPermissionsCore.setPermissionState(PERMISSION_TYPES.SHARE, 'denied');
            }
            return { success: false, error: err.message };
        }
    }
}
