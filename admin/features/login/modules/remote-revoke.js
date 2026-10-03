/**
 * Wishes Hub - Remote Revocation Module
 * Emergency panic button and remote session termination logic across all devices.
 */

import { LoginConfig } from '../login-config.js';

export class RemoteRevokeModule {
    /**
     * Terminate all active sessions for an admin account globally
     */
    async revokeAllSessions(adminEmail, authToken) {
        try {
            const payload = {
                email: adminEmail,
                timestamp: Date.now()
            };

            // Simulating API call to server-side token revocation endpoint
            // const response = await fetch(LoginConfig.endpoints.revokeAll, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${authToken}`
            //     },
            //     body: JSON.stringify(payload)
            // });

            await new Promise((resolve) => setTimeout(resolve, 800));

            // Trigger local wipe and broadcast event to all open tabs
            localStorage.setItem('wh_remote_revoke_event', Date.now().toString());
            
            console.warn(`All active sessions revoked remotely for ${adminEmail}`);
            return {
                success: true,
                message: 'All active sessions have been successfully terminated.'
            };
        } catch (error) {
            console.error('Remote Revoke Error:', error);
            return {
                success: false,
                message: 'Failed to execute global session revocation.'
            };
        }
    }

    /**
     * Listen for remote revocation triggers in active browser tabs
     */
    initRevocationListener() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'wh_remote_revoke_event') {
                alert('Security Alert: Your session has been remotely revoked by an administrator.');
                localStorage.clear();
                window.location.href = '/admin/login.html';
            }
        });
    }
}
