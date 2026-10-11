/**
 * Auth & Security Configuration (Frozen for Immutability)
 * Path: admin/features/auth-security/auth-config.js
 */

export const AUTH_CONFIG = Object.freeze({
  version: '1.1.0',
  maxFailedLoginsBeforeLockout: 5,
  lockoutDurationMinutes: 15,
  jwtExpirationHours: 24,
  sessionIdleTimeoutMinutes: 60,
  mfaRequiredForAdmins: true,
  minPasswordLength: 12,
  passwordComplexity: {
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  }
});
