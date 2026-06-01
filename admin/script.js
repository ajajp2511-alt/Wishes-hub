// Auth Toggle (Login aur Sign-up ke beech switch karne ke liye)
window.toggleAuth = function(isSignUp) {
    const title = document.getElementById('auth-title');
    const btn = document.getElementById('login-btn');
    if(isSignUp) {
        title.innerText = "Admin Registration";
        btn.innerText = "Create Admin Account";
        btn.setAttribute('onclick', "handleAuth('signup')");
    } else {
        title.innerText = "Admin Login";
        btn.innerText = "Login";
        btn.setAttribute('onclick', "handleAuth('login')");
    }
}

// Main Auth Function
window.handleAuth = async function(type) {
    const email = document.getElementById('admin-email').value;
    const pass = document.getElementById('admin-password').value;
    const btn = document.getElementById('login-btn');

    if(!email || !pass) return alert("Email aur Password dono bhariye!");

    btn.innerText = "⏳ Processing...";
    btn.disabled = true;

    try {
        let userCredential;
        if(type === 'signup') {
            // Naya admin banane ke liye
            userCredential = await firebase.auth().createUserWithEmailAndPassword(email, pass);
            alert("Admin Account Created!");
        } else {
            // Login karne ke liye
            userCredential = await firebase.auth().signInWithEmailAndPassword(email, pass);
        }

        // Agar login successful hua toh panel dikhao
        document.getElementById('auth-module').style.display = 'none';
        document.getElementById('main-panel').style.display = 'block';
        console.log("Logged in as:", userCredential.user.uid);

    } catch (error) {
        alert("Auth Error: " + error.message);
        btn.innerText = (type === 'signup') ? "Create Account" : "Login";
        btn.disabled = false;
    }
}
