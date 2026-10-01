/**
 * Login & Authentication - Configuration & Constants
 * Defines routes, storage keys, and system-wide messages for both Admin & User panels.
 */

export const LOGIN_CONFIG = {
    storageKey: 'wishes_hub_auth_session_v1',
    inactiveTimeoutMs: 15 * 60 * 1000, // 15 Minutes inactivity lock
    routes: {
        adminDashboard: '/admin/dashboard.html',
        userDashboard: '/dashboard.html',
        adminLogin: '/admin/login.html',
        userLogin: '/login.html'
    },
    defaultWalletBonus: 50 // Welcome reward credits for new sign-ups
};

export const AUTH_ERRORS = {
    invalidCredentials: 'Email ya password galat hai. Kripya dobara koshish karein.',
    unauthorizedAdmin: 'Aapke paas admin panel access karne ki permission nahi hai. Aapko User Panel par redirect kiya ja raha hai...',
    geoSuspicious: 'Naye location se login detect hua hai. Kripya 2FA / OTP verify karein.',
    lockedOut: 'Bar-bar galat koshish karne ke karan account temporary lock kar diya gaya hai.'
};
