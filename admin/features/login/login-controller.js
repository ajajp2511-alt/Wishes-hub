// admin/features/login/login-controller.js
import { LoginSecurity } from './modules/login-security.js';

export const LoginController = {
    init() {
        const lockoutSec = LoginSecurity.checkLockout();
        if (lockoutSec > 0) {
            this.handleLockoutState(lockoutSec);
            return;
        }

        this.bindEvents();
    },

    bindEvents() {
        const form = document.getElementById("adminLoginForm");
        const toggleBtn = document.getElementById("togglePassBtn");
        const passInput = document.getElementById("adminPass");

        if (toggleBtn && passInput) {
            toggleBtn.addEventListener("click", () => {
                const type = passInput.getAttribute("type") === "password" ? "text" : "password";
                passInput.setAttribute("type", type);
                toggleBtn.textContent = type === "password" ? "👁️" : "🙈";
            });
        }

        if (passInput) {
            passInput.addEventListener("input", (e) => {
                this.updatePasswordStrength(e.target.value);
            });
        }

        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                this.handleSubmission();
            });
        }
    },

    updatePasswordStrength(password) {
        const meterSpan = document.querySelector("#strengthMeter span");
        if (!meterSpan) return;

        let score = 0;
        if (password.length > 6) score++;
        if (password.length > 10) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        meterSpan.className = "";
        if (score <= 2) meterSpan.classList.add("weak");
        else if (score <= 4) meterSpan.classList.add("medium");
        else meterSpan.classList.add("strong");
    },

    handleSubmission() {
        const userField = document.getElementById("adminUser").value.trim();
        const passField = document.getElementById("adminPass").value.trim();
        const submitBtn = document.getElementById("loginSubmitBtn");
        const spinner = submitBtn.querySelector(".spinner");
        const btnText = submitBtn.querySelector(".btn-text");

        if (!userField || !passField) {
            alert("Please fill in all required credentials.");
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        if (spinner) spinner.style.display = "inline-block";
        if (btnText) btnText.textContent = "Authenticating...";

        setTimeout(() => {
            // Simulated secure validation check
            if (userField === "admin" && passField === "secret123") {
                LoginSecurity.resetAttempts();
                localStorage.setItem("patel_admin_session_token", "token_" + Math.random().toString(36).substring(2));
                localStorage.setItem("patel_admin_session_expiry", new Date().getTime() + (2 * 60 * 60 * 1000)); // 2 Hours
                
                window.location.href = "/admin/dashboard.html";
            } else {
                const isLocked = LoginSecurity.recordFailedAttempt();
                submitBtn.disabled = false;
                if (spinner) spinner.style.display = "none";
                if (btnText) btnText.textContent = "Sign In securely";

                if (isLocked) {
                    alert("Too many failed attempts. Account locked for 30 seconds.");
                    location.reload();
                } else {
                    alert("Invalid credentials. Please check your username and password.");
                }
            }
        }, 1200);
    },

    handleLockoutState(seconds) {
        const form = document.getElementById("adminLoginForm");
        if (form) {
            form.innerHTML = `<div class="lockout-notice"><h3>⚠️ Security Lockout</h3><p>Too many failed attempts. Try again in <span id="countdown">${seconds}</span> seconds.</p></div>`;
            
            const timer = setInterval(() => {
                seconds--;
                const counter = document.getElementById("countdown");
                if (counter) counter.textContent = seconds;
                if (seconds <= 0) {
                    clearInterval(timer);
                    location.reload();
                }
            }, 1000);
        }
    }
};
