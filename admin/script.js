let auth;
let allowedAdminUid = "";

async function init() {
    const status = document.getElementById('status');
    try {
        // 1. Config fetch karna
        const res = await fetch('/api/get-config');
        if (!res.ok) throw new Error("Config API fail ho gayi");
        
        const config = await res.json();
        allowedAdminUid = config.adminUid;
        
        // 2. Firebase Initialize
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        auth = firebase.auth();

        // 3. Auth State Monitor
        auth.onAuthStateChanged(user => {
            if (user) {
                if (user.uid === allowedAdminUid) {
                    document.getElementById('login-module').style.display = 'none';
                    document.getElementById('main-panel').style.display = 'block';
                    status.innerText = "";
                } else {
                    status.innerText = "❌ Unauthorized: Aap admin nahi hain.";
                    auth.signOut();
                }
            } else {
                document.getElementById('login-module').style.display = 'block';
                document.getElementById('main-panel').style.display = 'none';
            }
        });
    } catch (e) {
        console.error("Initialization Error:", e);
        status.innerText = "❌ System Error: " + e.message;
    }
}

// Login/Sign-up switch
let isLoginMode = true;
window.toggleMode = () => {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "Admin Login" : "Admin Sign-Up";
    document.getElementById('auth-btn').innerText = isLoginMode ? "Unlock System" : "Create Account";
    document.getElementById('toggle-text').innerText = isLoginMode ? "Naya account (Sign Up)" : "Login karein";
};

// Handle Auth
window.handleAuth = async () => {
    const email = document.getElementById('admin-email').value;
    const pass = document.getElementById('admin-pass').value;
    const btn = document.getElementById('auth-btn');

    if (!email || !pass) return alert("Details bhariye!");

    btn.disabled = true;
    btn.innerText = "⏳ Wait...";

    try {
        if (isLoginMode) {
            await auth.signInWithEmailAndPassword(email, pass);
        } else {
            await auth.createUserWithEmailAndPassword(email, pass);
            alert("Account Created! Ab login karein.");
            toggleMode();
        }
    } catch (err) {
        document.getElementById('status').innerText = "❌ " + err.message;
    }
    btn.disabled = false;
    btn.innerText = isLoginMode ? "Unlock System" : "Create Account";
};

window.logout = () => auth.signOut();

init();
