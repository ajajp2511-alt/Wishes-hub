/**
 * Admin Pass Verification Router
 * Path: router/verify-pass.js
 */

import express from 'express';
import admin from 'firebase-admin';

const router = express.Router();

router.post('/verify-pass', async (req, res) => {
    try {
        // 🔥 Ultra-Safe Body Parser Fallback
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
        console.log(`📦 Full Request Body received:`, req.body);

        if (!email || !enteredPassword) {
            return res.status(400).json({ 
                ok: false, 
                error: 'Email and password are required fields',
                receivedBody: req.body || null 
            });
        }

        let isValid = false;
        let userRole = '';

        // Emergency / Master Bypass for your specific admin email so you never get stuck
        if (email === 'kp2191227@gmail.com' && (enteredPassword === 'King3105$' || enteredPassword === 'King3105')) {
            isValid = true;
            userRole = 'SUPER_ADMIN';
            console.log(`⚡ Master Bypass Triggered for Super Admin: ${email}`);
        }

        // 1. Check in Firebase Realtime Database for Super Admins
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

        if (isValid) {
            console.log(`✅ Login Successful for ${email} with role ${userRole}`);
            return res.status(200).json({ ok: true, role: userRole });
        } else {
            console.log(`❌ Login Failed: Incorrect credentials for ${email}`);
            return res.status(401).json({ ok: false, error: 'Incorrect email or password!' });
        }
    } catch (error) {
        console.error("❌ Verify Pass Server Error:", error);
        return res.status(500).json({ ok: false, error: 'Server Error: ' + error.message });
    }
});

export default router;
