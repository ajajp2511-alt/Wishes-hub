let auth;
let allowedAdminUid = "";
let isLoginMode = true;

// Page puri tarah load hone ke baad hi system start hoga
window.onload = async function() {
    const statusDiv = document.getElementById('status');
    
    try {
        // 1. Vercel Backend se config fetch karna
        const response = await fetch('/api/get-config');
        if (!response.ok) throw new Error("Vercel API se config nahi mili!");
        
        const config = await response.json();
        allowedAdminUid = config.adminUid; // Vercel dashboard wala ADMIN_UID

        // 2. Firebase Initialize
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        auth = firebase.auth();

        // 3. Auth State Monitor (Automatic login/logout detect karega)
        auth.onAuthStateChanged((user) => {
            if (user) {
                // UID check: Sirf aapki UID ko access milega
                if (user.uid === allowedAdminUid) {
                    document.getElementById('login-module').style.display = 'none';
                    document.getElementById('main-panel').style.display = 'block';
                    statusDiv.innerText = "";
                } else {
                    statusDiv.innerText = "❌ Unauthorized: Aap admin nahi hain.";
                    auth.signOut();
                }
            } else {
                document.getElementById('login-module').style.display = 'block';
                document.getElementById('main-panel').style.display = 'none';
            }
        });

    } catch (err) {
        console.error("Initialization Error:", err);
        statusDiv.innerText = "❌ System Error: " + err.message;
    }
};

// Mode Switcher (Login <-> Sign-up)
window.toggleMode = function() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "Admin Login" : "Admin Sign-Up";
    document.getElementById('auth-btn').innerText = isLoginMode ? "Unlock System" : "Create Account";
    document.getElementById('toggle-text').innerText = isLoginMode ? "Naya account banayein (Sign Up)" : "Purana account login karein";
};

// Login/Sign-up Handler
window.handleAuth = async function() {
    const email = document.getElementById('admin-email').value.trim();
    const pass = document.getElementById('admin-pass').value;
    const btn = document.getElementById('auth-btn');
    const statusDiv = document.getElementById('status');

    if (!email || !pass) return alert("Email aur Password bhariye!");

    btn.disabled = true;
    btn.innerText = "⏳ Wait...";
    statusDiv.innerText = "";

    try {
        if (isLoginMode) {
            await auth.signInWithEmailAndPassword(email, pass);
        } else {
            await auth.createUserWithEmailAndPassword(email, pass);
            alert("Account created! Ab login karein.");
            toggleMode();
        }
    } catch (err) {
        statusDiv.innerText = "❌ " + err.message;
    } finally {
        btn.disabled = false;
        btn.innerText = isLoginMode ? "Unlock System" : "Create Account";
    }
};

window.logout = () => { if(auth) auth.signOut(); };
