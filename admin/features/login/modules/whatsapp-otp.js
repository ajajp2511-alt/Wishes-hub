/**
 * Wishes Hub - WhatsApp OTP Module
 * Handles sending and verifying OTP via WhatsApp Cloud API / Gateway integration.
 */

import { LoginConfig } from '../login-config.js';

export class WhatsappOtpModule {
    constructor() {
        // Initialization state for WhatsApp service
        this.defaultEndpoint = '/api/auth/whatsapp/send-otp';
        this.verifyEndpoint = '/api/auth/whatsapp/verify-otp';
    }

    /**
     * Send OTP code to admin's registered WhatsApp number
     */
    async sendWhatsAppOtp(userId, phoneNumber) {
        try {
            if (!phoneNumber) {
                return { success: false, message: 'Phone number is required for WhatsApp OTP.' };
            }

            // Sanitize phone number (remove spaces, dashes)
            const sanitizedPhone = phoneNumber.replace(/[\s-]/g, '');

            const payload = {
                userId,
                phoneNumber: sanitizedPhone,
                timestamp: Date.now()
            };

            const endpoint = LoginConfig?.endpoints?.sendOtpWhatsapp || this.defaultEndpoint;

            // Simulating API call to WhatsApp Cloud Gateway endpoint
            // const response = await fetch(endpoint, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(payload)
            // });

            await new Promise((resolve) => setTimeout(resolve, 800));

            console.log(`WhatsApp OTP successfully dispatched to ${sanitizedPhone}`);
            return {
                success: true,
                message: 'OTP sent to WhatsApp successfully.'
            };
        } catch (error) {
            console.error('WhatsApp OTP Error:', error);
            return {
                success: false,
                message: 'Failed to dispatch WhatsApp OTP.'
            };
        }
    }

    /**
     * Verify WhatsApp OTP code entered by admin
     */
    async verifyWhatsAppOtp(userId, otpCode) {
        try {
            if (!otpCode) {
                return { success: false, message: 'Please enter the OTP code.' };
            }

            const endpoint = LoginConfig?.endpoints?.verifyOtpWhatsapp || this.verifyEndpoint;

            // Simulating verification API call
            // const response = await fetch(endpoint, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ userId, otpCode })
            // });

            await new Promise((resolve) => setTimeout(resolve, 600));

            // Mock verification check (Accepts '123456' for simulation)
            if (otpCode.trim() === '123456') {
                return {
                    success: true,
                    message: 'WhatsApp OTP verified successfully.'
                };
            } else {
                return {
                    success: false,
                    message: 'Invalid WhatsApp OTP code.'
                };
            }
        } catch (error) {
            console.error('WhatsApp Verification Error:', error);
            return {
                success: false,
                message: 'Verification process failed.'
            };
        }
    }
}
