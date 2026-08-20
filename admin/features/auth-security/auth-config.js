/**
 * Auth & Security Configuration
 * Path: admin/features/auth-security/auth-config.js
 */

export const AUTH_CONFIG = {
  version: '1.0.0',
  maxFailedLoginsBeforeLockout: 5,
  jwtExpirationHours: 24,
  mfaRequiredForAdmins: true,
  minPasswordLength: 12
};
