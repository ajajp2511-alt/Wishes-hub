// 1. Apni Firebase Configuration Direct Daalein
const firebaseConfig = {
    apiKey: "AIzaSy...", // 👈 Yahan apni asli API Key daalein
    authDomain: "wishes-hub-xxxxx.firebaseapp.com", // 👈 Apna Auth Domain daalein
    projectId: "wishes-hub-xxxxx", // 👈 Apna Project ID daalein
    storageBucket: "wishes-hub-xxxxx.appspot.com",
    messagingSenderId: "xxxxxxxxxxxx",
    appId: "1:xxxxxxxxx:web:xxxxxxxxxxxx"
};

const allowedAdminUid = "fDp1cb1RAsWm8QfyuW2BDeYJyJw1"; // Aapki ID
let auth = null;
let isLoginMode = true;

// Safe Initialization
function initializeAdminPanel() {
    const statusDiv = document.getElementById('status');
    try {
        // Firebase Setup
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        
        auth = firebase.auth();
        statusDiv.innerText = "✅ System Connected"; // UI confirm karega ki Firebase chal gaya
        setTimeout(() => { statusDiv.innerText = ""; }, 2000);

        // Auth Monitor
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
        statusDiv.innerText = "❌ Firebase Fail: " + err.message;
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

document.addEventListener("DOMContentLoaded", initializeAdminPanel);
