/**
 * Admin Sign-In Module - Whitelist & Super Admin Gate
 * Ensures only Super Admin approved users can proceed with authentication.
 */

import { SIGN_IN_ERRORS } from '../sign-in-config.js';

export class SignInWhitelist {
    static async verifyPermission(identifier) {
        try {
            if (!identifier) {
                return { isAllowed: false, reason: SIGN_IN_ERRORS.unauthorized };
            }

            // Mock database check for approved admins (Replace with real API endpoint)
            const approvedAdmins = JSON.parse(localStorage.getItem('wishes_hub_approved_admins') || '[]');
            const pendingRequests = JSON.parse(localStorage.getItem('wishes_hub_admin_requests') || '[]');

            const matchedAdmin = approvedAdmins.find(
                adm => adm.email === identifier || adm.username === identifier
            );

            if (matchedAdmin) {
                if (matchedAdmin.status === 'ACTIVE' || matchedAdmin.isApproved) {
                    return { isAllowed: true, adminData: matchedAdmin };
                }
                if (matchedAdmin.status === 'SUSPENDED') {
                    return { isAllowed: false, reason: 'Aapka admin account suspend kar diya gaya hai.' };
                }
            }

            const matchedPending = pendingRequests.find(req => req.email === identifier);
            if (matchedPending) {
                return { isAllowed: false, reason: SIGN_IN_ERRORS.pendingApproval };
            }

            return { isAllowed: false, reason: SIGN_IN_ERRORS.unauthorized };
        } catch (err) {
            return { isAllowed: false, reason: 'Gatekeeper verification failed: ' + err.message };
        }
    }
}
