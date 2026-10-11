/**
 * Auth & Security Configuration (Enhanced)
 * Path: admin/features/auth-security/auth-config.js
 */

export const AUTH_CONFIG = {
  version: '1.1.0',
  maxFailedLoginsBeforeLockout: 5,
  lockoutDurationMinutes: 15,          // Added: Brute-force lockout duration
  jwtExpirationHours: 24,
  sessionIdleTimeoutMinutes: 60,      // Added: Inactivity timeout for dashboards
  mfaRequiredForAdmins: true,
  minPasswordLength: 12,
  passwordComplexity: {               // Added: Detailed password rules
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  }
};
