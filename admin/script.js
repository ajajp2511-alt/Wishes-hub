window.login = async function() {
    const passInput = document.getElementById('auth-key').value;
    const btn = document.querySelector('#login-module button'); // Login button select kiya
    
    if(!passInput) {
        alert("Please enter the admin key.");
        return;
    }

    // --- 1. Loading State Start ---
    const originalText = btn.innerText;
    btn.innerText = "⏳ Verifying..."; 
    btn.disabled = true; // Multiple clicks rokne ke liye
    // ------------------------------

    try {
        const response = await fetch('/api/verify-pass', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passInput })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Success: Panel dikhao
            document.getElementById('login-module').style.display = 'none';
            document.getElementById('main-panel').style.display = 'block';
            console.log("Access Granted");
        } else {
            // Galat password
            alert("Access Denied: Galat key dali hai.");
            btn.innerText = originalText;
            btn.disabled = false;
        }
    } catch (err) {
        // Network ya Server error
        console.error("Login Error:", err);
        alert("Server Error: Backend se connection nahi ho raha.");
        btn.innerText = originalText;
        btn.disabled = false;
    }
}
