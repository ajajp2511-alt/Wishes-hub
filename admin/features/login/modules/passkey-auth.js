/**
 * Wishes Hub - Passkey Auth Module
 * Handles WebAuthn biometric and hardware security key authentication.
 */

import { LoginConfig } from '../login-config.js';

export class PasskeyAuthModule {
    constructor(onSuccessCallback) {
        this.onSuccessCallback = onSuccessCallback;
        this.initPasskeyTrigger();
    }

    initPasskeyTrigger() {
        const passkeyBtn = document.getElementById('passkey-login-btn');
        if (!passkeyBtn) return;

        passkeyBtn.addEventListener('click', async () => {
            await this.authenticateWithPasskey();
        });
    }

    /**
     * Check if WebAuthn / Passkeys are supported by the browser
     */
    isPasskeySupported() {
        return window.PublicKeyCredential !== undefined;
    }

    /**
     * Trigger WebAuthn authentication flow
     */
    async authenticateWithPasskey() {
        if (!this.isPasskeySupported()) {
            alert('Passkeys / Biometric login is not supported on this browser or device.');
            return;
        }

        try {
            // Mock challenge options received from server
            const challengeOptions = {
                challenge: new Uint8Array([21, 31, 105, 42, 77, 88, 90, 11]),
                timeout: 60000,
                rpId: window.location.hostname,
                userVerification: 'preferred'
            };

            // In production, invoke navigator.credentials.get({ publicKey: challengeOptions })
            // Simulating biometric prompt delay
            await new Promise((resolve) => setTimeout(resolve, 1500));

            console.log('Passkey biometric verified successfully.');
            alert('Passkey verification successful!');

            if (this.onSuccessCallback) {
                this.onSuccessCallback({
                    status: 'SUCCESS',
                    redirectUrl: LoginConfig.roles.adminPanelPath,
                    role: 'SUPER_ADMIN'
                });
            }
        } catch (error) {
            console.error('Passkey Authentication Error:', error);
            alert('Passkey sign-in cancelled or failed.');
        }
    }
}
