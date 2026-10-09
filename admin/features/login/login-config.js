/**
 * Wishes Hub - Admin Login Configuration
 * Centralized settings for authentication, security limits, and feature toggles.
 */

const BACKEND_URL = 'https://wishes-hub.onrender.com';

export const LoginConfig = Object.freeze({
    // API Endpoints with full Render backend URL
    endpoints: {
        authenticate: `${BACKEND_URL}/api/verify-pass`, // ✅ Updated to match backend verifyPassRouter path
        sendOtpEmail: `${BACKEND_URL}/api/admin/auth/send-email-otp`,
        sendOtpWhatsapp: `${BACKEND_URL}/api/admin/auth/send-whatsapp-otp`,
        verifyOtp: `${BACKEND_URL}/api/admin/auth/verify-otp`,
        forgotPassword: `${BACKEND_URL}/api/admin/auth/forgot-password`,
        passkeyChallenge: `${BACKEND_URL}/api/admin/auth/passkey-challenge`,
        validateSession: `${BACKEND_URL}/api/admin/auth/validate-session`,
        revokeAll: `${BACKEND_URL}/api/admin/auth/remote-revoke`
    },

    // Security & Brute-Force Thresholds
    security: {
        maxLoginAttempts: 5,               // Lock account after 5 failed attempts
        lockoutDurationMinutes: 15,      // Temporary lockout duration
        captchaTriggerAttempts: 3,       // Show captcha after 3 wrong attempts
        sessionTimeoutMinutes: 30,       // Auto-logout after inactivity
        inactivityWarningSeconds: 120,   // Show warning 2 minutes before timeout
        trustedDeviceDays: 30,           // Days to remember trusted device
        rateLimitMaxRequests: 10,        // Max requests allowed in the time window (for rate-gate.js)
        rateLimitWindowMs: 60000         // Time window in milliseconds (1 minute)
    },

    // Feature Toggles (Enable/Disable modules dynamically)
    features: {
        whatsappOtpEnabled: true,
        emailOtpEnabled: true,
        passkeyEnabled: true,
        biometricEnabled: true,
        backupCodesEnabled: true,
        ipWhitelistEnabled: true,
        maintenanceMode: false           // Emergency global login lock
    },

    // Role & Redirection Rules
    roles: {
        superAdminRole: 'SUPER_ADMIN',
        subAdminRole: 'SUB_ADMIN',
        userRole: 'USER',
        adminPanelPath: '/admin/index.html',  // Fixed to point directly to admin index file
        userPanelPath: '/user/dashboard.html',
        loginPath: '/admin/features/login/login.html' // ✅ Centralized login path added
    },

    // UI Preferences
    ui: {
        defaultTheme: 'dark',            // 'dark' or 'light'
        animationSpeedMs: 300
    }
});
