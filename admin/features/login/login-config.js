/**
 * Wishes Hub - Admin Login Configuration
 * Centralized settings for authentication, security limits, and feature toggles.
 */

export const LoginConfig = {
    // API Endpoints
    endpoints: {
        authenticate: '/api/admin/auth/signin',
        sendOtpEmail: '/api/admin/auth/send-email-otp',
        sendOtpWhatsapp: '/api/admin/auth/send-whatsapp-otp',
        verifyOtp: '/api/admin/auth/verify-otp',
        forgotPassword: '/api/admin/auth/forgot-password',
        passkeyChallenge: '/api/admin/auth/passkey-challenge',
        validateSession: '/api/admin/auth/validate-session',
        revokeAll: '/api/admin/auth/remote-revoke'
    },

    // Security & Brute-Force Thresholds
    security: {
        maxLoginAttempts: 5,               // Lock account after 5 failed attempts
        lockoutDurationMinutes: 15,        // Temporary lockout duration
        captchaTriggerAttempts: 3,         // Show captcha after 3 wrong attempts
        sessionTimeoutMinutes: 30,         // Auto-logout after inactivity
        inactivityWarningSeconds: 120,     // Show warning 2 minutes before timeout
        trustedDeviceDays: 30              // Days to remember trusted device
    },

    // Feature Toggles (Enable/Disable modules dynamically)
    features: {
        whatsappOtpEnabled: true,
        emailOtpEnabled: true,
        passkeyEnabled: true,
        biometricEnabled: true,
        backupCodesEnabled: true,
        ipWhitelistEnabled: true,
        maintenanceMode: false             // Emergency global login lock
    },

    // Role & Redirection Rules
    roles: {
        superAdminRole: 'SUPER_ADMIN',
        subAdminRole: 'SUB_ADMIN',
        userRole: 'USER',
        adminPanelPath: '/admin/dashboard.html',
        userPanelPath: '/user/dashboard.html'
    },

    // UI Preferences
    ui: {
        defaultTheme: 'dark',              // 'dark' or 'light'
        animationSpeedMs: 300
    }
};
