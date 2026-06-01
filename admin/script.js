window.login = async function() {
    const passInput = document.getElementById('auth-key').value;
    const btn = document.querySelector('#login-module button'); 
    const statusDiv = document.getElementById('status');
    
    if(!passInput) {
        alert("Please enter the admin key.");
        return;
    }

    // --- Loading State Start ---
    const originalText = btn.innerText;
    btn.innerText = "⏳ Verifying..."; 
    btn.disabled = true; 
    if(statusDiv) statusDiv.innerText = "Checking credentials...";
    // ------------------------------

    try {
        const response = await fetch('/api/verify-pass', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ password: passInput })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Success: Login panel chhupao aur main panel dikhao
            document.getElementById('login-module').style.display = 'none';
            document.getElementById('main-panel').style.display = 'block';
            if(statusDiv) statusDiv.innerText = "Access Granted!";
            console.log("Access Granted");
        } else {
            // Galat password ya unauthorized
            alert(data.message || "Access Denied: Galat key dali hai.");
            btn.innerText = originalText;
            btn.disabled = false;
            if(statusDiv) statusDiv.innerText = "Error: Invalid Key.";
        }
    } catch (err) {
        // Network connectivity ya server crash
        console.error("Login Error:", err);
        alert("Server Error: Backend se connection nahi ho raha. Check if API is deployed.");
        btn.innerText = originalText;
        btn.disabled = false;
        if(statusDiv) statusDiv.innerText = "Server Connection Failed.";
    }
}
