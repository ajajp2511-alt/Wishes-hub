window.login = async function() {
    const passInput = document.getElementById('auth-key').value;
    const btn = document.querySelector('#login-module button');
    const statusDiv = document.getElementById('status');
    
    if(!passInput) {
        alert("Please enter the admin key.");
        return;
    }

    // Loading State
    const originalText = btn.innerText;
    btn.innerText = "⏳ Verifying..."; 
    btn.disabled = true;
    if(statusDiv) statusDiv.innerText = "Connecting to server...";

    try {
        // Path fix: Ensure it calls the root API
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
            document.getElementById('login-module').style.display = 'none';
            document.getElementById('main-panel').style.display = 'block';
            if(statusDiv) statusDiv.innerText = "Access Granted ✅";
        } else {
            alert(data.message || "Access Denied: Galat key dali hai.");
            btn.innerText = originalText;
            btn.disabled = false;
            if(statusDiv) statusDiv.innerText = "Error: Invalid Key.";
        }
    } catch (err) {
        console.error("Login Error:", err);
        alert("Server Error: Backend se connection nahi ho raha.");
        btn.innerText = originalText;
        btn.disabled = false;
    }
                }
