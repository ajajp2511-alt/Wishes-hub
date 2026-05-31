// 1. Firebase Init
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

// 2. Updated Login Function (Ab ye backend se verify karega)
window.login = async function() {
    const passInput = document.getElementById('auth-key').value;
    const output = document.getElementById('console-output');
    
    try {
        // Backend API call to verify-pass.js
        const response = await fetch('/api/verify-pass', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passInput })
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('login-module').style.display = 'none';
            document.getElementById('main-panel').style.display = 'block';
            console.log("Access Granted");
        } else {
            alert("Access Denied: " + (data.message || "Galat Key Hai"));
        }
    } catch (err) {
        console.error("Login Error:", err);
        alert("Server Connection Error!");
    }
}

// 3. Publish Logic
document.addEventListener('click', async (e) => {
    if (e.target && e.target.id === 'publish-btn') {
        const fileInput = document.getElementById('media-upload');
        const file = fileInput.files[0];
        const text = document.getElementById('caption-text').value;
        const output = document.getElementById('console-output');

        if(!file || !text) return alert("Photo aur Message dono zaroori hain!");

        output.innerText = "⏳ System Connecting...";
        
        try {
            const formData = new FormData();
            formData.append('photo', file);
            // Caption ko backend handle karega ya aap params mein bhej sakte hain

            // Vercel API Call for Telegram
            const res = await fetch('/api/upload-to-tg', {
                method: 'POST',
                body: formData
                // Note: Multipart form data mein headers browser khud set karta hai
            });

            const data = await res.json();

            if(data.ok) {
                output.innerText = "📡 Telegram Sent. Syncing Firestore...";
                
                // Firestore Update
                await db.collection('wishes').add({
                    text: text,
                    tgFileId: data.fileId,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                output.innerText = "✅ Mubarak Ho! Content Live Ho Gaya.";
                fileInput.value = ""; // Clear after success
                document.getElementById('caption-text').value = "";
                alert("Task Successful!");
            } else {
                throw new Error(data.error || "Upload Failed");
            }
        } catch (error) {
            output.innerText = "❌ Error: " + error.message;
            console.error("Launch Error:", error);
        }
    }
});
