/**
 * Manage Permissions - Security & IP Sub-Module
 * Restricts sensitive roles to specific Trusted IPs or Devices.
 */

import { permissionCore } from '../manage-permissions-core.js';

export class PermissionSecurity {
    constructor() {
        this.trustedIPs = {
            'super_admin': ['192.168.1.1', '10.0.0.5'], // Example Office IPs
            'regional_admin': ['*'] // Any IP allowed by default
        };
    }

    verifyIPAccess(roleId, currentIP) {
        const allowedIPs = this.trustedIPs[roleId];
        
        if (!allowedIPs || allowedIPs.includes('*')) {
            return true; 
        }

        if (!allowedIPs.includes(currentIP)) {
            permissionCore.logAudit('system', 'SECURITY_VIOLATION', `Blocked unauthorized IP ${currentIP} for role ${roleId}`);
            return false;
        }
        return true;
    }
}
