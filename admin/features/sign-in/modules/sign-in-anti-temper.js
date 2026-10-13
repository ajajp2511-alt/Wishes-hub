/**
 * Admin Sign-In Module - Anti-Tamper & Intrusion Guard
 * Detects browser console tampering, DOM injection, and clears session data on security breach.
 */

import { signInCore } from '../sign-in-core.js';
import { SIGN_IN_ERRORS } from '../sign-in-config.js';

export class SignInAntiTamper {
    static initializeGuard(onBreachCallback) {
        // Detect DevTools console open timing anomaly
        let start = Date.now();
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J'))) {
                this.triggerPurge('Console keys detected', onBreachCallback);
            }
        });

        // Monitor DOM mutations on critical sign-in elements
        const formElement = document.querySelector('#adminSignInForm');
        if (formElement) {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'action') {
                        this.triggerPurge('Form action tampering detected', onBreachCallback);
                    }
                }
            });
            observer.observe(formElement, { attributes: true });
        }
    }

    static triggerPurge(reason, callback) {
        console.warn(`[Anti-Tamper Security Triggered]: ${reason}`);
        signInCore.clearSession();
        if (typeof callback === 'function') {
            callback(SIGN_IN_ERRORS.tampered);
        }
    }
    }
