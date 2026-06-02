let isLoginMode = true;

// 1. Vercel se Config mangwana
async function init() {
    try {
        const res = await fetch('/api/get-config');
        const config = await res.json();
        if (!firebase.apps.length) firebase.initializeApp(config);
        
        // Check Login Status
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                document.getElementById('login-module').style.display = 'none';
                document.getElementById('main-panel').style.display = 'block';
            } else {
                document.getElementById('login-module').style.display = 'block';
                document.getElementById('main-panel').style.display = 'none';
            }
        });
    } catch (e) {
        document.getElementById('status').innerText = "❌ Connection Error";
    }
}

// 2. Login/Sign-up switch
window.toggleMode = function() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "Admin Login" : "Admin Sign-Up";
    document.getElementById('auth-btn').innerText = isLoginMode ? "Unlock System" : "Create Account";
    document.getElementById('toggle-text').innerText = isLoginMode ? "Naya account banayein (Sign Up)" : "Purana account login karein";
};

// 3. Auth Logic
window.handleAuth = async function() {
    const email = document.getElementById('admin-email').value;
    const pass = document.getElementById('admin-pass').value;
    const btn = document.getElementById('auth-btn');
    const status = document.getElementById('status');

    if(!email || !pass) return alert("Details bhariye!");

    btn.innerText = "⏳ Processing...";
    btn.disabled = true;
    status.innerText = "";

    try {
        if (isLoginMode) {
            await firebase.auth().signInWithEmailAndPassword(email, pass);
        } else {
            await firebase.createUserWithEmailAndPassword(email, pass);
            alert("Account Created!");
        }
    } catch (err) {
        status.innerText = "❌ " + err.message;
        btn.innerText = isLoginMode ? "Unlock System" : "Create Account";
        btn.disabled = false;
    }
};

window.logout = () => firebase.auth().signOut();

init();
