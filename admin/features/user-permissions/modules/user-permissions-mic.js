/**
 * User Permissions - Microphone Sub-Module (Enhanced)
 * Manages audio recording permissions for custom voice greetings.
 */

import { userPermissionsCore } from '../user-permissions-core.js';
import { PERMISSION_TYPES } from '../user-permissions-config.js';

export class UserPermissionsMic {
    static async requestMicrophone() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            userPermissionsCore.setPermissionState(PERMISSION_TYPES.MICROPHONE, 'unsupported');
            return { success: false, reason: 'unsupported' };
        }

        try {
            // Enhanced with standard audio constraints for cleaner recordings
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: { 
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true 
                } 
            });
            
            userPermissionsCore.setPermissionState(PERMISSION_TYPES.MICROPHONE, 'granted');
            return { success: true, stream };
        } catch (err) {
            userPermissionsCore.setPermissionState(PERMISSION_TYPES.MICROPHONE, 'denied');
            return { success: false, error: err.message };
        }
    }

    static checkStatus() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            return 'unsupported';
        }
        return userPermissionsCore.getPermissionState(PERMISSION_TYPES.MICROPHONE);
    }
}
