let isLoginMode = true;

// Login aur Sign-up ke beech switch karne ke liye
window.toggleMode = function() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById('auth-title');
    const btn = document.getElementById('auth-btn');
    const toggleText = document.getElementById('toggle-text');

    if (isLoginMode) {
        title.innerText = "Control Center";
        btn.innerText = "Unlock System";
        toggleText.innerHTML = 'Naya account chahiye? <span onclick="toggleMode()" style="color: #00f2ff; cursor: pointer;">Sign Up</span>';
    } else {
        title.innerText = "Admin Registration";
        btn.innerText = "Create Account";
        toggleText.innerHTML = 'Account hai? <span onclick="toggleMode()" style="color: #00f2ff; cursor: pointer;">Login karein</span>';
    }
};

// Firebase Auth Logic
window.handleAuth = async function() {
    const email = document.getElementById('admin-email').value;
    const pass = document.getElementById('admin-pass').value;
    const status = document.getElementById('status');
    const btn = document.getElementById('auth-btn');

    if (!email || !pass) return alert("Email aur Password bhariye!");

    btn.innerText = "⏳ Processing...";
    btn.disabled = true;

    try {
        if (isLoginMode) {
            // Login process
            await firebase.auth().signInWithEmailAndPassword(email, pass);
        } else {
            // Sign-up process
            await firebase.auth().createUserWithEmailAndPassword(email, pass);
            alert("Admin Account Created Successfully!");
        }
    } catch (error) {
        alert("Error: " + error.message);
        btn.disabled = false;
        btn.innerText = isLoginMode ? "Unlock System" : "Create Account";
    }
};

// Auth State Observer (Login hone par panel dikhayega)
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        document.getElementById('login-module').style.display = 'none';
        document.getElementById('main-panel').style.display = 'block';
    } else {
        document.getElementById('login-module').style.display = 'block';
        document.getElementById('main-panel').style.display = 'none';
    }
});

// Logout Function
window.logout = function() {
    firebase.auth().signOut();
};
