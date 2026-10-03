/**
 * Wishes Hub - Security Guard Module
 * Handles brute-force protection, wrong attempt tracking, account lockout, and captcha triggers.
 */

import { LoginConfig } from '../login-config.js';

export class SecurityGuard {
    constructor() {
        this.storageKey = 'wh_sec_guard_attempts';
        this.lockoutKey = 'wh_sec_lockout_until';
    }

    /**
     * Check if the account is currently locked out due to multiple failed attempts
     */
    isLockedOut() {
        const lockoutUntil = localStorage.getItem(this.lockoutKey);
        if (!lockoutUntil) return false;

        const now = Date.now();
        if (now < parseInt(lockoutUntil, 10)) {
            return true;
        } else {
            // Lockout expired, clear records
            localStorage.removeItem(this.lockoutKey);
            this.resetAttempts();
            return false;
        }
    }

    /**
     * Get remaining lockout time in minutes
     */
    getRemainingLockoutMinutes() {
        const lockoutUntil = localStorage.getItem(this.lockoutKey);
        if (!lockoutUntil) return 0;
        const diff = parseInt(lockoutUntil, 10) - Date.now();
        return diff > 0 ? Math.ceil(diff / (60 * 1000)) : 0;
    }

    /**
     * Record a failed login attempt and check for lockout threshold
     */
    recordFailedAttempt() {
        let attempts = this.getAttemptCount();
        attempts += 1;
        localStorage.setItem(this.storageKey, attempts.toString());

        const maxAttempts = LoginConfig.security.maxLoginAttempts || 5;

        if (attempts >= maxAttempts) {
            // Trigger Lockout
            const lockoutDurationMs = (LoginConfig.security.lockoutDurationMinutes || 15) * 60 * 1000;
            const lockoutUntil = Date.now() + lockoutDurationMs;
            localStorage.setItem(this.lockoutKey, lockoutUntil.toString());
            return { locked: true, attempts };
        }

        return { locked: false, attempts };
    }

    /**
     * Check if captcha should be displayed based on wrong attempts
     */
    shouldShowCaptcha() {
        const attempts = this.getAttemptCount();
        const captchaThreshold = LoginConfig.security.captchaTriggerAttempts || 3;
        return attempts >= captchaThreshold;
    }

    getAttemptCount() {
        const val = localStorage.getItem(this.storageKey);
        return val ? parseInt(val, 10) : 0;
    }

    /**
     * Reset attempt counters and lockout state upon successful login
     */
    resetAttempts() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.lockoutKey);
    }
}
