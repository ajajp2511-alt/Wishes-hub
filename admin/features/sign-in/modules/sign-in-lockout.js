/**
 * Admin Sign-In Module - Lockout Guard
 * Prevents brute-force attempts by enforcing temporary lockout rules.
 */

import { SIGN_IN_CONFIG, SIGN_IN_ERRORS } from '../sign-in-config.js';

export class SignInLockout {
    static getLockoutState(identifier) {
        const key = `wishes_hub_lockout_${identifier}`;
        const record = JSON.parse(localStorage.getItem(key) || '{"attempts": 0, "lockedUntil": 0}');

        const now = Date.now();
        if (record.lockedUntil > now) {
            const remainingMinutes = Math.ceil((record.lockedUntil - now) / 60000);
            return { isLocked: true, remainingMinutes, reason: SIGN_IN_ERRORS.lockout };
        }

        return { isLocked: false, attempts: record.attempts };
    }

    static registerFailedAttempt(identifier) {
        const key = `wishes_hub_lockout_${identifier}`;
        const record = JSON.parse(localStorage.getItem(key) || '{"attempts": 0, "lockedUntil": 0}');

        record.attempts += 1;
        if (record.attempts >= SIGN_IN_CONFIG.maxFailedAttempts) {
            record.lockedUntil = Date.now() + SIGN_IN_CONFIG.lockoutDurationMs;
        }

        localStorage.setItem(key, JSON.stringify(record));
        return this.getLockoutState(identifier);
    }

    static clearLockout(identifier) {
        localStorage.removeItem(`wishes_hub_lockout_${identifier}`);
    }
}
