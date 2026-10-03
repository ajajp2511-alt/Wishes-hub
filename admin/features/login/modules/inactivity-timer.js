/**
 * Wishes Hub - Inactivity Timer Module
 * Monitors idle state, displays session timeout warning modal, and auto-locks session.
 */

import { LoginConfig } from '../login-config.js';

export class InactivityTimerModule {
    constructor(onTimeoutCallback) {
        this.onTimeoutCallback = onTimeoutCallback;
        this.warningSeconds = LoginConfig.security.inactivityWarningSeconds || 120;
        this.timeoutMinutes = LoginConfig.security.sessionTimeoutMinutes || 30;
        this.idleTimer = null;
        this.warningTimer = null;
        this.initActivityMonitors();
    }

    initActivityMonitors() {
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
        
        const resetCounters = () => {
            this.resetTimers();
        };

        events.forEach(event => {
            window.addEventListener(event, resetCounters, { passive: true });
        });

        this.resetTimers();
    }

    resetTimers() {
        this.clearAllTimers();

        const warningMs = (this.timeoutMinutes * 60 * 1000) - (this.warningSeconds * 1000);
        const totalMs = this.timeoutMinutes * 60 * 1000;

        // Trigger warning modal before actual timeout
        this.warningTimer = setTimeout(() => {
            this.showWarningModal();
        }, warningMs > 0 ? warningMs : 60000);

        // Trigger session termination
        this.idleTimer = setTimeout(() => {
            this.triggerTimeout();
        }, totalMs);
    }

    clearAllTimers() {
        if (this.warningTimer) clearTimeout(this.warningTimer);
        if (this.idleTimer) clearTimeout(this.idleTimer);
    }

    showWarningModal() {
        let modal = document.getElementById('idle-warning-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'idle-warning-modal';
            modal.className = 'modal-overlay active';
            modal.innerHTML = `
                <div class="modal-card">
                    <h3>Are you still there? ⏳</h3>
                    <p>You have been inactive for a while. For security reasons, your session will expire soon.</p>
                    <div class="modal-actions">
                        <button id="extend-session-btn" class="btn-primary">Stay Connected</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById('extend-session-btn').addEventListener('click', () => {
                modal.classList.remove('active');
                this.resetTimers();
            });
        } else {
            modal.classList.add('active');
        }
    }

    triggerTimeout() {
        const modal = document.getElementById('idle-warning-modal');
        if (modal) modal.remove();

        alert('Session expired due to prolonged inactivity.');
        if (this.onTimeoutCallback) {
            this.onTimeoutCallback();
        } else {
            localStorage.clear();
            window.location.href = '/admin/login.html';
        }
    }
}
