/**
 * Admin Pass Verification & OTP Trigger Router (Using Brevo HTTP API)
 * Path: router/verify-pass.js
 */

import express from 'express';
import admin from 'firebase-admin';
import { readOtpStore, writeOtpStore } from './send-email-otp.js';

const router = express.Router();

router.post('/verify-pass', async (req, res) => {
    try {
        let body = req.body;
        
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch (e) {}
        }

        if (!body || Object.keys(body).length === 0) {
            body = req.query || {};
        }

        const email = body?.email ? String(body.email).trim().toLowerCase() : '';
        const enteredPassword = body?.password ? String(body.password).trim() : '';

        console.log(`🔑 Login Attempt -> Email: "${email}" | Password Length: ${enteredPassword.length}`);

        if (!email || !enteredPassword) {
            return res.status(400).json({ 
                ok: false, 
                error: 'Email and password are required fields' 
            });
        }

        let isValid = false;
        let userRole = '';

        // Emergency / Master Bypass for Super Admin
        if (email === 'kp2191227@gmail.com' && (enteredPassword === 'King3105$' || enteredPassword === 'King3105')) {
            isValid = true;
            userRole = 'SUPER_ADMIN';
            console.log(`⚡ Master Bypass Triggered for Super Admin: ${email}`);
        }

        // 1. Check in Firebase Realtime Database
        if (!isValid) {
            try {
                const dbRef = admin.database().ref('super-admins');
                const snapshot = await dbRef.once('value');
                if (snapshot.exists()) {
                    const superAdmins = snapshot.val();
                    for (const key in superAdmins) {
                        const adminData = superAdmins[key];
                        const dbEmail = adminData.email ? String(adminData.email).trim().toLowerCase() : '';
                        const dbPassword = adminData.password ? String(adminData.password).trim() : '';

                        if (dbEmail === email && dbPassword === enteredPassword) {
                            isValid = true;
                            userRole = 'SUPER_ADMIN';
                            break;
                        }
                    }
                }
            } catch (err) {
                console.error("❌ Realtime DB Check Error:", err.message);
            }
        }

        // 2. Check in Firestore for regular Admins
        if (!isValid) {
            try {
                const firestoreDoc = await admin.firestore().collection('admins').doc(email).get();
                if (firestoreDoc.exists) {
                    const data = firestoreDoc.data();
                    const dbPass = data.password ? String(data.password).trim() : '';
                    if (dbPass === enteredPassword) {
                        isValid = true;
                        userRole = 'SUB_ADMIN';
                    }
                }
            } catch (err) {
                console.error("❌ Firestore Check Error:", err.message);
            }
        }

        if (!isValid) {
            console.log(`❌ Login Failed: Incorrect credentials for ${email}`);
            return res.status(401).json({ ok: false, error: 'Incorrect email or password!' });
        }

        // ✅ Password is correct! Generate OTP and save to shared store
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000; // Valid for 5 minutes

        const store = readOtpStore();
        store[email] = { otp, expiresAt, role: userRole };
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
            subject: 'Wishes Hub Admin - Verification OTP',
            htmlContent: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4; border-radius: 8px;">
                    <h2 style="color: #4f46e5;">Wishes Hub Security</h2>
                    <p>Hello Admin,</p>
                    <p>Your One-Time Password (OTP) for secure admin login is:</p>
                    <h1 style="background: #e0e7ff; color: #312e81; padding: 10px 20px; display: inline-block; letter-spacing: 4px; border-radius: 6px;">${otp}</h1>
                    <p>This code is valid for 5 minutes. Do not share it with anyone.</p>
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

        console.log(`📧 [OTP SENT via Brevo API] Successfully sent OTP to ${email}`);

        return res.status(200).json({ 
            ok: true, 
            requireOtp: true, 
            message: 'Password verified. OTP sent to your email.' 
        });

    } catch (error) {
        console.error("❌ Verify Pass Server Error:", error);
        return res.status(500).json({ ok: false, error: 'Server Error: ' + error.message });
    }
});

export default router;
