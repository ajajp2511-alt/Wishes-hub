window.login = async function() {
    const passInput = document.getElementById('auth-key').value;
    
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
        alert("Access Denied!");
    }
}
