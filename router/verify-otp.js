import express from 'express';
import { otpStore } from './send-email-otp.js';

const router = express.Router();

router.post('/admin/auth/verify-otp', async (req, res) => {
    try {
        let { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ ok: false, error: 'Email and OTP are required.' });
        }

        // ✅ FIX: Email ko lowercase aur trim karein taaki send-email-otp se match ho sake
        email = email.toLowerCase().trim();

        const record = otpStore.get(email);

        if (!record) {
            return res.status(400).json({ ok: false, error: 'No OTP requested or OTP expired.' });
        }

        // Check Expiry
        if (Date.now() > record.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ ok: false, error: 'OTP has expired. Please request a new one.' });
        }

        // Verify OTP value
        if (record.otp !== otp.toString().trim()) {
            return res.status(400).json({ ok: false, error: 'Invalid OTP code entered.' });
        }

        // Clear OTP after successful verification (Single use)
        otpStore.delete(email);

        console.log(`[OTP VERIFIED] Admin ${email} authenticated successfully via MFA.`);
        return res.status(200).json({
            ok: true,
            message: 'OTP verified successfully.',
            token: 'wh_secure_jwt_token_2026',
            role: 'SUPER_ADMIN'
        });

    } catch (error) {
        console.error('Verify OTP Error:', error);
        return res.status(500).json({ ok: false, error: 'Internal server error during OTP verification.' });
    }
});

export default router;
