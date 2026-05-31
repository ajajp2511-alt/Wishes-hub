// Login Function that connects to your Vercel API
window.login = async function() {
    const passInput = document.getElementById('auth-key').value;
    
    try {
        const response = await fetch('/api/verify-pass', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passInput })
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('login-module').style.display = 'none';
            document.getElementById('main-panel').style.display = 'block';
        } else {
            alert("Ghalat Password! Patel, please try again.");
        }
    } catch (err) {
        alert("Server connection error! Check Vercel logs.");
    }
}
