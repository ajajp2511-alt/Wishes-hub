// 1. Admin Config
const ADMIN_PASS = "PatelStudio@2026"; 

// 2. Firebase Init (Make sure this matches your Firebase Console exactly)
const firebaseConfig = {
    apiKey: "AIzaSyDhqqHLeWTKGRc4-cHG2n8ALBt7zZFr8GQ",
    authDomain: "wishes-hub.firebaseapp.com",
    projectId: "wishes-hub",
    storageBucket: "wishes-hub.appspot.com",
    messagingSenderId: "389270546123",
    appId: "1:389270546123:web:757e79396e6d191295" 
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// 3. Login Function (Window object se bind kiya taaki HTML ise dhund sake)
window.login = function() {
    const val = document.getElementById('auth-key').value;
    if(val === ADMIN_PASS) {
        document.getElementById('login-module').style.display = 'none';
        document.getElementById('main-panel').style.display = 'block';
    } else {
        alert("Access Denied: Galat Key Hai");
    }
}

// 4. Publish Logic
document.addEventListener('click', async (e) => {
    if (e.target && e.target.id === 'publish-btn') {
        const file = document.getElementById('media-upload').files[0];
        const text = document.getElementById('caption-text').value;
        const output = document.getElementById('console-output');

        if(!file || !text) return alert("Photo aur Message dono zaroori hain!");

        output.innerText = "⏳ System Connecting...";
        
        try {
            const formData = new FormData();
            formData.append('photo', file);
            formData.append('caption', text);

            // Vercel API Call (Yahan Vercel apne environment variables use karega)
            const res = await fetch('/api/upload-to-tg', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if(data.ok) {
                output.innerText = "📡 Telegram Sent. Syncing Firestore...";
                
                await db.collection('wishes').add({
                    text: text,
                    tgFileId: data.fileId,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                output.innerText = "✅ Mubarak Ho! Content Live Ho Gaya.";
                alert("Task Successful!");
            } else {
                throw new Error(data.message || "Upload Failed");
            }
        } catch (error) {
            output.innerText = "❌ Error: " + error.message;
            console.error("Launch Error:", error);
        }
    }
});
