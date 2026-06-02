let auth;
let allowedAdminUid = "";
let isLoginMode = true;

// Jab poora page load ho jaye tabhi system chalu hoga
window.onload = async function() {
    const statusDiv = document.getElementById('status');
    try {
        // 1. Vercel Backend API se config fetch karna
        const response = await fetch('/api/get-config');
        if (!response.ok) throw new Error("Backend API se configuration nahi mil saki!");
        
        const config = await response.json();
        allowedAdminUid = config.adminUid; // Vercel dashboard ka ADMIN_UID

        // 2. Firebase Initialize karna
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        auth = firebase.auth();

        // 3. Real-time Authentication State Check
        auth.onAuthStateChanged((user) => {
            if (user) {
                // Check ki login karne wala admin hi hai na
                if (user.uid === allowedAdminUid) {
                    document.getElementById('login-module').style.display = 'none';
                    document.getElementById('main-panel').style.display = 'block';
                    statusDiv.innerText = "";
                } else {
                    statusDiv.style.color = "#f85149";
                    statusDiv.innerText = "❌ Access Denied: Aap authorised admin nahi hain.";
                    auth.signOut();
                }
            } else {
                document.getElementById('login-module').style.display = 'block';
                document.getElementById('main-panel').style.display = 'none';
            }
        });

    } catch (error) {
        console.error("Boot Error:", error);
        statusDiv.style.color = "#f85149";
        statusDiv.innerText = "❌ System Boot Error: " + error.message;
    }
};

// Login / Sign-Up Mode Switcher
window.toggleMode = function() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "Admin Login" : "Admin Sign-Up";
    document.getElementById('auth-btn').innerText = isLoginMode ? "Unlock System" : "Create Account";
    document.getElementById('toggle-text').innerText = isLoginMode ? "Naya account banayein (Sign Up)" : "Purana account login karein";
};

// Handle Authentication (Login/Signup Button)
window.handleAuth = async function() {
    const email = document.getElementById('admin-email').value.trim();
    const pass = document.getElementById('admin-pass').value;
    const btn = document.getElementById('auth-btn');
    const statusDiv = document.getElementById('status');

    if (!email || !pass) return alert("Email aur Password dono bhariye!");

    btn.disabled = true;
    btn.innerText = "⏳ Connecting...";
    statusDiv.innerText = "";

    try {
        if (isLoginMode) {
            // Login process
            await auth.signInWithEmailAndPassword(email, pass);
        } else {
            // Sign-up process
            await auth.createUserWithEmailAndPassword(email, pass);
            alert("Account successfully bana liya hai! Ab direct login karein.");
            toggleMode();
        }
    } catch (err) {
        console.error("Auth Error:", err);
        statusDiv.style.color = "#f85149";
        statusDiv.innerText = "❌ " + err.message;
    } finally {
        btn.disabled = false;
        btn.innerText = isLoginMode ? "Unlock System" : "Create Account";
    }
};

// Logout Function
window.logout = function() {
    if (auth) auth.signOut();
};
