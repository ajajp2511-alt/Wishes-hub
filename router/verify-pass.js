/**
 * Admin Pass Verification & OTP Trigger Router
 * Path: router/verify-pass.js
 */

import express from 'express';
import admin from 'firebase-admin';
import nodemailer from 'nodemailer';

const router = express.Router();

// In-memory OTP store (shared across routers if imported, or handled here)
// Make sure this aligns with your send-email-otp.js and verify-otp.js store
export const otpStore = new Map();

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

        // ✅ Password is correct! Now trigger 2FA OTP via Brevo SMTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000; // Valid for 5 minutes

        // Store OTP temporarily
        otpStore.set(email, { otp, expiresAt, role: userRole });

        // Configure Brevo Transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
            port: Number(process.env.SMTP_PORT) || 587,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM || 'admin@wisheshub.com',
            to: email,
            subject: 'Wishes Hub Admin - Verification OTP',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4; border-radius: 8px;">
                    <h2 style="color: #4f46e5;">Wishes Hub Security</h2>
                    <p>Hello Admin,</p>
                    <p>Your One-Time Password (OTP) for secure admin login is:</p>
                    <h1 style="background: #e0e7ff; color: #312e81; padding: 10px 20px; display: inline-block; letter-spacing: 4px; border-radius: 6px;">${otp}</h1>
                    <p>This code is valid for 5 minutes. Do not share it with anyone.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 [OTP SENT] Successfully sent OTP to ${email}`);

        return.status(200).json({ 
            ok: true, 
            requireOtp: true, 
            message: 'Password verified. OTP sent to your email.' 
        });

    } catch (error) {
        console.error("❌ Verify Pass Server Error:", error);
        return.status(500).json({ ok: false, error: 'Server Error: ' + error.message });
    }
});

export default router;
