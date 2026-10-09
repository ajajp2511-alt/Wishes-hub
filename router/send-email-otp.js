/**
 * Admin Send Email OTP Router (Using Brevo HTTP API - Port 443)
 * Path: router/send-email-otp.js
 */

import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// JSON file ka path jahan OTP store hoga
const STORAGE_FILE = path.resolve('otpStore.json');

// Helper function: Read OTPs from file
export const readOtpStore = () => {
    try {
        if (fs.existsSync(STORAGE_FILE)) {
            const data = fs.readFileSync(STORAGE_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading OTP store file:', error);
    }
    return {};
};

// Helper function: Write OTPs to file
export const writeOtpStore = (store) => {
    try {
        fs.writeFileSync(STORAGE_FILE, JSON.stringify(store, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing OTP store file:', error);
    }
};

router.post('/admin/auth/send-email-otp', async (req, res) => {
    try {
        let { email } = req.body;

        if (!email) {
            return res.status(400).json({ ok: false, error: 'Email is required to send OTP.' });
        }

        email = email.toLowerCase().trim();

        // 6-digit random OTP generation
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000; // Valid for 5 minutes

        // Read store, update, and write back
        const store = readOtpStore();
        store[email] = { otp, expiresAt };
        writeOtpStore(store);

        // Send Email via Brevo HTTP API (Port 443 - Never blocked on Render)
        const brevoApiKey = process.env.SMTP_PASS || process.env.BREVO_API_KEY;
        if (!brevoApiKey) {
            console.error("❌ Critical Error: Brevo API Key is missing in environment variables.");
            return res.status(500).json({ ok: false, error: 'Server email configuration error.' });
        }

        const senderEmail = process.env.EMAIL_FROM || 'admin@wisheshub.com';

        const emailPayload = {
            sender: { name: 'Wishes Hub Security', email: senderEmail },
            to: [{ email: email }],
            subject: '🔐 Your Wishes Hub Admin OTP Code',
            htmlContent: `
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

        const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': brevoApiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify(emailPayload)
        });

        if (!brevoResponse.ok) {
            const errData = await brevoResponse.text();
            console.error("❌ Brevo API Error:", errData);
            return res.status(500).json({ ok: false, error: 'Failed to send OTP email via API.' });
        }

        console.log(`📧 [OTP SENT via Brevo HTTP API] Successfully sent OTP to ${email}`);
        return res.status(200).json({ ok: true, message: 'OTP sent successfully to email.' });

    } catch (error) {
        console.error('Send Email OTP Error:', error);
        return res.status(500).json({ ok: false, error: 'Failed to send OTP email. Server error.' });
    }
});

export default router;
