let auth;
let allowedAdminUid = "";
let isLoginMode = true;

// 1. Ek dum basic check
console.log("Script loaded successfully!");

window.onload = async function() {
    const statusDiv = document.getElementById('status');
    statusDiv.innerText = "⏳ Loading System...";

    try {
        // 2. Vercel Backend se config fetch karna
        const response = await fetch('/api/get-config');
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}. Check if /api/get-config.js exists.`);
        }
        
        const config = await response.json();
        allowedAdminUid = config.adminUid;

        // 3. Check if variables are empty
        if (!config.apiKey || config.apiKey === "undefined") {
            throw new Error("Vercel Variables miss ho rahe hain. Check Dashboard!");
        }

        // 4. Firebase Initialize
        if (typeof firebase === 'undefined') {
            throw new Error("Firebase Library load nahi hui. Check Internet/HTML scripts.");
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        auth = firebase.auth();

        // 5. Auth Monitor
        auth.onAuthStateChanged((user) => {
            if (user) {
                if (user.uid === allowedAdminUid) {
                    document.getElementById('login-module').style.display = 'none';
                    document.getElementById('main-panel').style.display = 'block';
                    statusDiv.innerText = "";
                } else {
                    statusDiv.innerText = "❌ Unauthorized Admin ID!";
                    auth.signOut();
                }
            } else {
                document.getElementById('login-module').style.display = 'block';
                document.getElementById('main-panel').style.display = 'none';
                statusDiv.innerText = "";
            }
        });

        console.log("Firebase Ready!");
        statusDiv.innerText = "✅ System Ready";
        setTimeout(() => { if(!auth.currentUser) statusDiv.innerText = ""; }, 2000);

    } catch (err) {
        console.error("Critical Error:", err);
        statusDiv.style.color = "#ff4b4b";
        statusDiv.innerText = "🚨 Error: " + err.message;
    }
};

// Toggle & HandleAuth functions (Same as before)
window.toggleMode = () => {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "Admin Login" : "Admin Sign-Up";
    document.getElementById('auth-btn').innerText = isLoginMode ? "Unlock System" : "Create Account";
};

window.handleAuth = async () => {
    const email = document.getElementById('admin-email').value.trim();
    const pass = document.getElementById('admin-pass').value;
    const btn = document.getElementById('auth-btn');
    const statusDiv = document.getElementById('status');

    if (!auth) return alert("System abhi load ho raha hai, wait karein.");

    btn.disabled = true;
    btn.innerText = "⏳ Wait...";

    try {
        if (isLoginMode) {
            await auth.signInWithEmailAndPassword(email, pass);
        } else {
            await auth.createUserWithEmailAndPassword(email, pass);
            alert("Success! Ab login karein.");
            toggleMode();
        }
    } catch (err) {
        statusDiv.innerText = "❌ " + err.message;
    } finally {
        btn.disabled = false;
        btn.innerText = isLoginMode ? "Unlock System" : "Create Account";
    }
};

window.logout = () => auth.signOut();
