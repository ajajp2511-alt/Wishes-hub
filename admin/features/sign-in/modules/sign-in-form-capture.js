/**
 * Admin Sign-In Module - Request Form Handler
 * Captures personal details, optional social profiles, and cover note for Super Admin review.
 */

import { SIGN_IN_CONFIG } from '../sign-in-config.js';

export class SignInFormCapture {
    static collectFormData(formElement) {
        const formData = new FormData(formElement);
        
        const socialProfiles = {};
        SIGN_IN_CONFIG.socialPlatforms.forEach(platform => {
            const val = formData.get(`social_${platform.id}`);
            if (val && val.trim() !== '') {
                socialProfiles[platform.id] = val.trim();
            }
        });

        return {
            requestId: 'req_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
            fullName: formData.get('fullName')?.trim(),
            email: formData.get('email')?.trim(),
            mobile: formData.get('mobile')?.trim(),
            govtIdRef: formData.get('govtIdRef')?.trim() || null,
            emergencyContact: formData.get('emergencyContact')?.trim() || null,
            requestedRole: formData.get('requestedRole'),
            entityName: formData.get('entityName')?.trim() || 'Wishes Hub',
            inviteToken: formData.get('inviteToken')?.trim() || null,
            coverNote: formData.get('coverNote')?.trim(),
            socialProfiles,
            submittedAt: new Date().toISOString(),
            status: 'PENDING_APPROVAL'
        };
    }

    static validateRequestData(data) {
        if (!data.fullName || data.fullName.length < 3) {
            return { valid: false, error: 'Kripya apna poora official naam enter karein.' };
        }
        if (!data.email || !data.email.includes('@')) {
            return { valid: false, error: 'Sahi official email ID enter karein.' };
        }
        if (!data.mobile || data.mobile.length < 10) {
            return { valid: false, error: 'Valid mobile number enter karein.' };
        }
        if (!data.coverNote || data.coverNote.length < 20) {
            return { valid: false, error: 'Detailed cover note/description likhna anivarya hai (at least 20 chars).' };
        }
        return { valid: true };
    }

    static async submitAccessRequest(requestData) {
        const validation = this.validateRequestData(requestData);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }

        try {
            // Mock submission save (Replace with backend API endpoint)
            const existingRequests = JSON.parse(localStorage.getItem('wishes_hub_admin_requests') || '[]');
            existingRequests.push(requestData);
            localStorage.setItem('wishes_hub_admin_requests', JSON.stringify(existingRequests));

            return {
                success: true,
                requestId: requestData.requestId,
                message: 'Access request successfully submit ho gayi hai. Super Admin review ke baad aapko intimate kiya jayega.'
            };
        } catch (err) {
            return { success: false, error: 'Form save karne mein dikkat aayi: ' + err.message };
        }
    }
}
