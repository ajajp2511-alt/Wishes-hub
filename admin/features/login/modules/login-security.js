// admin/features/login/modules/login-security.js

export const LoginSecurity = {
    MAX_ATTEMPTS: 3,
    LOCKOUT_TIME_MS: 30000, // 30 seconds cooldown

    checkLockout() {
        const lockoutTime = localStorage.getItem("patel_login_lockout");
        if (lockoutTime) {
            const remaining = parseInt(lockoutTime, 10) - new Date().getTime();
            if (remaining > 0) {
                return Math.ceil(remaining / 1000); // returns seconds remaining
            } else {
                localStorage.removeItem("patel_login_lockout");
                localStorage.setItem("patel_login_attempts", "0");
            }
        }
        return 0;
    },

    recordFailedAttempt() {
        let attempts = parseInt(localStorage.getItem("patel_login_attempts") || "0", 10) + 1;
        localStorage.setItem("patel_login_attempts", attempts);

        if (attempts >= this.MAX_ATTEMPTS) {
            const lockoutExpiry = new Date().getTime() + this.LOCKOUT_TIME_MS;
            localStorage.setItem("patel_login_lockout", lockoutExpiry);
            return true; // Locked out
        }
        return false;
    },

    resetAttempts() {
        localStorage.removeItem("patel_login_attempts");
        localStorage.removeItem("patel_login_lockout");
    }
};
