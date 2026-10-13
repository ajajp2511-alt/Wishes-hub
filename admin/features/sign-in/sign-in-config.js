/**
 * Admin Sign-In Module - Configuration & Constants
 * Defines strict security rules, endpoints, and error thresholds.
 */

export const SIGN_IN_CONFIG = {
    storageKey: 'wishes_hub_admin_secure_session_v1',
    maxFailedAttempts: 5,
    lockoutDurationMs: 15 * 60 * 1000, // 15 Minutes
    requestExpiryDays: 7,
    routes: {
        adminDashboard: '/admin/dashboard.html',
        unauthorizedRedirect: '/login.html'
    },
    allowedCountries: ['IN'], // Geofencing rule
    socialPlatforms: [
        { id: 'telegram', label: 'Telegram Username (@username)', type: 'text' },
        { id: 'github', label: 'GitHub Profile URL', type: 'url' },
        { id: 'linkedin', label: 'LinkedIn Profile URL', type: 'url' },
        { id: 'twitter', label: 'Twitter / X Profile URL', type: 'url' },
        { id: 'instagram', label: 'Instagram Profile URL', type: 'url' },
        { id: 'facebook', label: 'Facebook Profile URL', type: 'url' },
        { id: 'portfolio', label: 'YouTube / Portfolio URL', type: 'url' }
    ]
};

export const SIGN_IN_ERRORS = {
    unauthorized: 'Aapke paas admin panel access ki permission nahi hai.',
    pendingApproval: 'Aapki Admin Access Request pending hai. Super Admin approval ka intezaar karein.',
    invalidCredentials: 'Admin credentials Sahi nahi hain.',
    lockout: 'Zyada galat koshishon ke karan Sign-In temporary block kar diya gaya hai.',
    ipBlocked: 'Aapka IP address whitelisted list mein nahi hai.',
    tampered: 'Security Violation: Tampering detect hui hai. Session reset kar diya gaya hai.'
};
