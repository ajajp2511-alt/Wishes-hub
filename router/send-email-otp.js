import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// ✅ FIX 1: Global store use karein taaki server restart hone par OTP wipe na ho
if (!global.otpStore) {
    global.otpStore = new Map();
}
export const otpStore = global.otpStore;

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.brevo.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

router.post('/admin/auth/send-email-otp', async (req, res) => {
    try {
        let { email } = req.body;

        if (!email) {
            return res.status(400).json({ ok: false, error: 'Email is required to send OTP.' });
        }

        // ✅ FIX 2: Email ko lowercase aur trim karein
        email = email.toLowerCase().trim();

        // 6-digit random OTP generation
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000; // Valid for 5 minutes

        // Store OTP temporarily
        otpStore.set(email, { otp, expiresAt });

        // Email Content Options
        const mailOptions = {
            from: process.env.EMAIL_FROM || '"Wishes Hub Security" <no-reply@wisheshub.com>',
            to: email,
            subject: '🔐 Your Wishes Hub Admin OTP Code',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
                    <h2 style="color: #4f46e5;">Wishes Hub Admin Portal</h2>
                    <p>Hello Admin,</p>
                    <p>Your one-time verification code (OTP) for secure login is:</p>
                    <h1 style="background: #e0e7ff; color: #3730a3; padding: 10px 20px; display: inline-block; letter-spacing: 5px; border-radius: 6px;">${otp}</h1>
                    <p>This code is valid for <strong>5 minutes</strong>. Do not share this code with anyone.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="font-size: 12px; color: #666;">Wishes Hub Security System — Automated Notification</p>
                </div>
            `
        };

        // Send Email via SMTP
        await transporter.sendMail(mailOptions);

        console.log(`[OTP SENT] 6-digit OTP successfully sent to ${email}`);
        return res.status(200).json({ ok: true, message: 'OTP sent successfully to email.' });

    } catch (error) {
        console.error('Send Email OTP Error:', error);
        return res.status(500).json({ ok: false, error: 'Failed to send OTP email. Check SMTP configuration.' });
    }
});

export default router;
