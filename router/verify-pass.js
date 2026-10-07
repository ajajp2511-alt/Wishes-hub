/**
 * Admin Pass Verification Router
 * Path: router/verify-pass.js
 */

import express from 'express';
import admin from 'firebase-admin';

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
        const enteredPassword = body?.password ? String(body.password) : ''; // Do not trim password abruptly if spaces are intended, but keep it clean

        console.log(`🔑 Login Attempt for Email: "${email}" | Entered Password Length: ${enteredPassword.length}`);

        if (!email || !enteredPassword) {
            console.log("❌ Missing email or password in request body:", req.body);
            return res.status(400).json({ ok: false, error: 'Email and password are required fields' });
        }

        let isValid = false;
        let userRole = '';

        // 1. Check in Firebase Realtime Database for Super Admins
        try {
            const dbRef = admin.database().ref('super-admins');
            const snapshot = await dbRef.once('value');
            if (snapshot.exists()) {
                const superAdmins = snapshot.val();
                for (const key in superAdmins) {
                    const adminData = superAdmins[key];
                    const dbEmail = adminData.email ? String(adminData.email).trim().toLowerCase() : '';
                    const dbPassword = adminData.password ? String(adminData.password) : '';

                    console.log(`🔎 Checking DB Node [${key}] -> DB Email: "${dbEmail}" | DB Pass Length: ${dbPassword.length}`);

                    if (dbEmail === email && dbPassword === enteredPassword) {
                        isValid = true;
                        userRole = 'SUPER_ADMIN';
                        break;
                    }
                }
            } else {
                console.log("⚠️ 'super-admins' node does not exist in Realtime Database!");
            }
        } catch (err) {
            console.error("❌ Realtime DB Check Error:", err.message);
        }

        // 2. If not found in Realtime DB, check in Firestore for regular Admins
        if (!isValid) {
            try {
                const firestoreDoc = await admin.firestore().collection('admins').doc(email).get();
                if (firestoreDoc.exists) {
                    const data = firestoreDoc.data();
                    const dbPass = data.password ? String(data.password) : '';
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
