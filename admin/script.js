let auth = null;
let allowedAdminUid = "";
let isLoginMode = true;

// Safe Initialization function
async function initializeAdminPanel() {
    const statusDiv = document.getElementById('status');
    try {
        // 1. Config fetch karna
        const response = await fetch('/api/get-config');
        if (!response.ok) {
            statusDiv.style.color = "#f85149";
            statusDiv.innerText = "❌ Error: API/Backend issue (404/500)";
            return;
        }
        
        const config = await response.json();
        allowedAdminUid = config.adminUid;

        // 2. Firebase check aur initialization
        if (typeof firebase === 'undefined') {
            statusDiv.style.color = "#f85149";
            statusDiv.innerText = "❌ Error: Firebase CDN blocked or failed!";
            return;
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        
        auth = firebase.auth();
        statusDiv.innerText = ""; // Clear loader once ready

        // 3. Auth Listener
        auth.onAuthStateChanged((user) => {
            const loginModule = document.getElementById('login-module');
            const mainPanel = document.getElementById('main-panel');
            
            if (user) {
                if (user.uid === allowedAdminUid) {
                    loginModule.style.display = 'none';
                    mainPanel.style.display = 'block';
                    statusDiv.innerText = "";
                } else {
                    statusDiv.style.color = "#f85149";
                    statusDiv.innerText = "❌ Unauthorized Admin Account.";
                    auth.signOut();
                }
            } else {
                loginModule.style.display = 'block';
                mainPanel.style.display = 'none';
            }
        });

    } catch (err) {
        statusDiv.style.color = "#f85149";
        statusDiv.innerText = "❌ Connection Fail: " + err.message;
    }
}

// Switch Mode Logic
window.toggleMode = function() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "Admin Login" : "Admin Sign-Up";
    document.getElementById('auth-btn').innerText = isLoginMode ? "Unlock System" : "Create Account";
    document.getElementById('toggle-text').innerText = isLoginMode ? "Naya account banayein (Sign Up)" : "Purana account login karein";
};

// Form submit handler
window.handleAuth = async function() {
    if (!auth) return alert("System abhi ready nahi hai, thoda rukiye.");
    
    const email = document.getElementById('admin-email').value.trim();
    const pass = document.getElementById('admin-pass').value;
    const btn = document.getElementById('auth-btn');
    const statusDiv = document.getElementById('status');

    if (!email || !pass) return alert("Kripya dono fields ko bhariye!");

    btn.disabled = true;
    btn.innerText = "⏳ Processing...";
    statusDiv.innerText = "";

    try {
        if (isLoginMode) {
            await auth.signInWithEmailAndPassword(email, pass);
        } else {
            await auth.createUserWithEmailAndPassword(email, pass);
            alert("Account ban gaya! Ab login karein.");
            toggleMode();
        }
    } catch (error) {
        statusDiv.style.color = "#f85149";
        statusDiv.innerText = "❌ " + error.message;
    } finally {
        btn.disabled = false;
        btn.innerText = isLoginMode ? "Unlock System" : "Create Account";
    }
};

window.logout = function() {
    if (auth) auth.signOut();
};

// Page load sequence par execute karein
document.addEventListener("DOMContentLoaded", initializeAdminPanel);
