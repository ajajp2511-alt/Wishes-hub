/**
 * User Permissions - Battery Status Sub-Module (Enhanced with Real-time Listeners)
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
            
            const evaluateAndSave = (bat) => {
                const isLow = bat.level <= userPermissionsCore.config.batterySaverThreshold;
                
                userPermissionsCore.setPermissionState(
                    PERMISSION_TYPES.BATTERY, 
                    isLow ? 'power-saver-active' : 'normal'
                );

                return {
                    supported: true,
                    level: bat.level,
                    charging: bat.charging,
                    isLowPower: isLow
                };
            };

            // Listen to real-time changes in battery level or charging state
            battery.addEventListener('levelchange', () => evaluateAndSave(battery));
            battery.addEventListener('chargingchange', () => evaluateAndSave(battery));

            return evaluateAndSave(battery);
        } catch (e) {
            console.error('Battery API error', e);
            return { supported: false, error: e.message };
        }
    }
}
