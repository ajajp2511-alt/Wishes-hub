let auth;
let allowedAdminUid = "";
let isLoginMode = true;

// 1. Page aur all backend assets load hone ke baad system trigger hoga
window.onload = async function() {
    const statusDiv = document.getElementById('status');
    
    try {
        statusDiv.style.color = "#00f2ff";
        statusDiv.innerText = "⏳ Initializing Secure Connection...";

        // Vercel Backend API se credentials fetch karna
        const response = await fetch('/api/get-config');
        if (!response.ok) throw new Error("Vercel environment variables securely load nahi ho paaye.");
        
        const config = await response.json();
        allowedAdminUid = config.adminUid; // Vercel dashboard wala ADMIN_UID

        // Firebase Client App Bootstrapping
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        auth = firebase.auth();

        // Status clear jab system ready ho jaye
        statusDiv.innerText = "";

        // Real-time Auth State Monitoring
        auth.onAuthStateChanged((user) => {
            if (user) {
                // strict UID Cross-matching check
                if (user.uid === allowedAdminUid) {
                    document.getElementById('login-module').style.display = 'none';
                    document.getElementById('main-panel').style.display = 'block';
                    statusDiv.innerText = "";
                } else {
                    statusDiv.style.color = "#f85149";
                    statusDiv.innerText = "❌ Access Denied: Unauthorized UID detected.";
                    auth.signOut();
                }
            } else {
                document.getElementById('login-module').style.display = 'block';
                document.getElementById('main-panel').style.display = 'none';
            }
        });

    } catch (err) {
        console.error("Boot Failure:", err);
        statusDiv.style.color = "#f85149";
        statusDiv.innerText = "❌ System Error: " + err.message;
    }
};

// Mode Switcher (Login / Registration)
window.toggleMode = function() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "Admin Login" : "Admin Sign-Up";
    document.getElementById('auth-btn').innerText = isLoginMode ? "Unlock System" : "Create Account";
    document.getElementById('toggle-text').innerText = isLoginMode ? "Naya account banayein (Sign Up)" : "Purana account login karein";
};

// Core Execution Login / Signup
window.handleAuth = async function() {
    const email = document.getElementById('admin-email').value.trim();
    const pass = document.getElementById('admin-pass').value;
    const btn = document.getElementById('auth-btn');
    const statusDiv = document.getElementById('status');

    if (!email || !pass) return alert("Kripya saari details sahi se bhariye!");

    btn.disabled = true;
    btn.innerText = "⏳ Authenticating...";
    statusDiv.innerText = "";

    try {
        if (isLoginMode) {
            await auth.signInWithEmailAndPassword(email, pass);
        } else {
            await auth.createUserWithEmailAndPassword(email, pass);
            alert("Account authentication base me register ho gaya hai. Ab login karein!");
            toggleMode();
        }
    } catch (err) {
        console.error("Authentication Exception:", err);
        statusDiv.style.color = "#f85149";
        statusDiv.innerText = "❌ " + err.message;
    } finally {
        btn.disabled = false;
        btn.innerText = isLoginMode ? "Unlock System" : "Create Account";
    }
};

// Dashboard Session Control
window.logout = function() {
    if (auth) auth.signOut();
};
