import express from 'express';
import admin from 'firebase-admin';

const router = express.Router();

router.post('/verify-pass', async (req, res) => {
    try {
        let body = req.body;
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        const email = body?.email ? String(body.email).trim().toLowerCase() : '';
        const enteredPassword = body?.password ? String(body.password).trim() : '';

        if (!email || !enteredPassword) {
            return res.status(400).json({ ok: false, error: 'Email and password are required' });
        }

        let isValid = false;
        let userRole = '';

        // 1. Check in Firebase Realtime Database for Super Admins
        try {
            const dbRef = admin.database().ref('super-admins');
            const snapshot = await dbRef.once('value');
            if (snapshot.exists()) {
                const superAdmins = snapshot.val();
                // Find matching email key or field
                for (const key in superAdmins) {
                    const adminData = superAdmins[key];
                    if (adminData.email && adminData.email.toLowerCase() === email && adminData.password === enteredPassword) {
                        isValid = true;
                        userRole = 'SUPER_ADMIN';
                        break;
                    }
                }
            }
        } catch (err) {
            console.error("Realtime DB Check Error:", err);
        }

        // 2. If not found in Realtime DB, check in Firestore for regular Admins
        if (!isValid) {
            try {
                const firestoreDoc = await admin.firestore().collection('admins').doc(email).get();
                if (firestoreDoc.exists) {
                    const data = firestoreDoc.data();
                    if (data.password === enteredPassword) {
                        isValid = true;
                        userRole = 'SUB_ADMIN';
                    }
                }
            } catch (err) {
                console.error("Firestore Check Error:", err);
            }
        }

        if (isValid) {
            return res.status(200).json({ ok: true, role: userRole });
        } else {
            return res.status(401).json({ ok: false, error: 'Incorrect email or password!' });
        }
    } catch (error) {
        console.error("Verify Pass Error:", error);
        return res.status(500).json({ ok: false, error: 'Server Error' });
    }
});

export default router;
