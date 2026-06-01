window.login = async function() {
    const passInput = document.getElementById('auth-key').value;
    const btn = document.querySelector('#login-module button');
    
    if(!passInput) return alert("Password enter kijiye!");

    // Loading State
    btn.innerText = "⏳ Firebase Connecting...";
    btn.disabled = true;

    try {
        // Firestore se security document fetch karna
        const doc = await db.collection('admin_config').doc('security').get();
        
        if (doc.exists) {
            const firebasePassword = doc.data().passkey;

            if (passInput === firebasePassword) {
                // SUCCESS: Panel Unlock
                document.getElementById('login-module').style.display = 'none';
                document.getElementById('main-panel').style.display = 'block';
                console.log("Access Granted via Firebase");
            } else {
                alert("Ghalat Password! Try again.");
                resetBtn();
            }
        } else {
            alert("Error: Firebase mein password document nahi mila!");
            resetBtn();
        }
    } catch (err) {
        console.error("Firestore Error:", err);
        alert("Connection Error! Rules check karein.");
        resetBtn();
    }

    function resetBtn() {
        btn.innerText = "Unlock System";
        btn.disabled = false;
    }
}
