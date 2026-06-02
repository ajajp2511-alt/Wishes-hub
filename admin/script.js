let auth;
let allowedAdminUid = ""; // Ye Vercel se aayega

async function init() {
    try {
        const res = await fetch('/api/get-config');
        const config = await res.json();
        
        allowedAdminUid = config.adminUid; // Vercel se UID yahan aayi
        
        if (!firebase.apps.length) firebase.initializeApp(config);
        auth = firebase.auth();

        auth.onAuthStateChanged(user => {
            if (user && user.uid === allowedAdminUid) {
                // Sirf Patel (Vercel wali UID) ko access milega
                document.getElementById('login-module').style.display = 'none';
                document.getElementById('main-panel').style.display = 'block';
            } else if (user) {
                alert("Unauthorized Access!");
                auth.signOut();
            } else {
                document.getElementById('login-module').style.display = 'block';
                document.getElementById('main-panel').style.display = 'none';
            }
        });
    } catch (e) { console.error("Initialization error", e); }
}

// Baki handleAuth aur logout functions pehle jaise hi rahenge...
init();
