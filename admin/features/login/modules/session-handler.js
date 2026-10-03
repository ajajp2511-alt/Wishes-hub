/**
 * Wishes Hub - Session Handler Module
 * Manages session timeout, auto-logout on inactivity, and multi-tab synchronization.
 */

import { LoginConfig } from '../login-config.js';

export class SessionHandler {
    constructor() {
        this.inactivityTimeout = null;
        this.warningTimeout = null;
        this.timeoutMinutes = LoginConfig?.security?.sessionTimeoutMinutes || 30;
        this.lastActivityTime = Date.now();
        this.initSessionTracking();
        this.initTabSync();
    }

    /**
     * Track user activity and set auto-logout timers with throttling
     */
    initSessionTracking() {
        const events = ['mousedown', 'keydown', 'click', 'scroll', 'touchstart'];
        
        const handleActivity = () => {
            const now = Date.now();
            if (now - this.lastActivityTime > 5000) { // Reset at most once every 5 seconds
                this.lastActivityTime = now;
                this.clearTimers();
                this.startTimers();
            }
        };

        events.forEach(event => {
            window.addEventListener(event, handleActivity, { passive: true });
        });

        this.startTimers();
    }

    startTimers() {
        const warningMs = (this.timeoutMinutes - 2) * 60 * 1000; // Warning 2 mins before timeout
        const totalMs = this.timeoutMinutes * 60 * 1000;

        this.warningTimeout = setTimeout(() => {
            this.showInactivityWarning();
        }, warningMs > 0 ? warningMs : totalMs - 30000);

        this.inactivityTimeout = setTimeout(() => {
            this.terminateSession('Session expired due to inactivity.');
        }, totalMs);
    }

    clearTimers() {
        if (this.warningTimeout) {
            clearTimeout(this.warningTimeout);
            this.warningTimeout = null;
        }
        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
            this.inactivityTimeout = null;
        }
    }

    showInactivityWarning() {
        let warningModal = document.getElementById('inactivity-warning-modal');
        if (!warningModal) {
            warningModal = document.createElement('div');
            warningModal.id = 'inactivity-warning-modal';
            warningModal.className = 'modal-overlay active';
            warningModal.innerHTML = `
                <div class="modal-card">
                    <h3>Inactivity Warning ⚠️</h3>
                    <p>Your session is about to expire due to inactivity. Do you want to stay logged in?</p>
                    <div class="modal-actions">
                        <button id="stay-logged-in-btn" class="btn-primary">Stay Logged In</button>
                    </div>
                </div>
            `;
            document.body.appendChild(warningModal);

            document.getElementById('stay-logged-in-btn').addEventListener('click', () => {
                if (warningModal && warningModal.parentNode) {
                    warningModal.remove();
                }
                this.lastActivityTime = Date.now();
                this.clearTimers();
                this.startTimers();
            });
        } else {
            warningModal.classList.add('active');
        }
    }

    terminateSession(reason) {
        this.clearTimers();
        localStorage.removeItem('wh_admin_token');
        localStorage.removeItem('wh_user_role');
        
        // Broadcast logout event to other tabs
        localStorage.setItem('wh_logout_event', Date.now().toString());

        alert(reason);
        window.location.href = LoginConfig?.roles?.loginPath || '/admin/login.html';
    }

    /**
     * Sync session state across multiple browser tabs
     */
    initTabSync() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'wh_logout_event') {
                alert('You have been logged out from another tab.');
                window.location.href = LoginConfig?.roles?.loginPath || '/admin/login.html';
            }
        });
    }
}
