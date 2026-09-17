/**
 * User Permissions - Battery Status Sub-Module
 * Checks device battery level to toggle power-saving mode for animations.
 */

import { userPermissionsCore } from '../user-permissions-core.js';
import { PERMISSION_TYPES } from '../user-permissions-config.js';

export class UserPermissionsBattery {
    static async checkBatteryStatus() {
        if (!('getBattery' in navigator)) {
            return { supported: false };
        }

        try {
            const battery = await navigator.getBattery();
            const isLow = battery.level <= userPermissionsCore.config.batterySaverThreshold;
            
            userPermissionsCore.setPermissionState(
                PERMISSION_TYPES.BATTERY, 
                isLow ? 'power-saver-active' : 'normal'
            );

            return {
                supported: true,
                level: battery.level,
                charging: battery.charging,
                isLowPower: isLow
            };
        } catch (e) {
            console.error('Battery API error', e);
            return { supported: false, error: e.message };
        }
    }
}
