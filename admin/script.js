let auth;
let isLoginMode = true;

// 1. Vercel se Config mangwana aur Firebase chalu karna
async function startSystem() {
    const status = document.getElementById('status');
    try {
        const response = await fetch('/api/get-config');
        const config = await response.json();
        
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        auth = firebase.auth();
        
        // Check karna ki koi pehle se login toh nahi
        auth.onAuthStateChanged(user => {
            if (user) {
                document.getElementById('login-module').style.display = 'none';
                document.getElementById('main-panel').style.display = 'block';
            } else {
                document.getElementById('login-module').style.display = 'block';
                document.getElementById('main-panel').style.display = 'none';
            }
        });
    } catch (err) {
        status.innerText = "❌ Config Error: Check Vercel Keys";
    }
}

// 2. Login/Sign-up switch
window.toggleMode = function() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "Control Center" : "New Admin";
    document.getElementById('auth-btn').innerText = isLoginMode ? "Unlock System" : "Register";
    document.getElementById('toggle-auth').innerText = isLoginMode ? "Create Admin Account" : "Back to Login";
};

// 3. Main Auth Logic
window.handleAuth = async function() {
    const email = document.getElementById('admin-email').value;
    const pass = document.getElementById('admin-pass').value;
    const btn = document.getElementById('auth-btn');

    if (!email || !pass) return alert("Email & Password bhariye!");

    btn.innerText = "⏳ Connecting...";
    btn.disabled = true;

    try {
        if (isLoginMode) {
            await auth.signInWithEmailAndPassword(email, pass);
        } else {
            await auth.createUserWithEmailAndPassword(email, pass);
            alert("Admin Account Created!");
        }
    } catch (error) {
        alert("Error: " + error.message);
        btn.innerText = isLoginMode ? "Unlock System" : "Register";
        btn.disabled = false;
    }
};

window.logout = () => auth.signOut();

// System start karein
startSystem();
