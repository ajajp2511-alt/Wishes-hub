// Admin Configuration & Controller
const ADMIN_PASS = "PatelStudio@2026"; 

// Firebase Init
const firebaseConfig = {
    apiKey: "AIzaSyDhqqHLeWTKGRc4-cHG2n8ALBt7zZFr8GQ",
    authDomain: "wishes-hub.firebaseapp.com",
    projectId: "wishes-hub"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

function login() {
    const val = document.getElementById('auth-key').value;
    if(val === ADMIN_PASS) {
        document.getElementById('login-module').style.display = 'none';
        document.getElementById('main-panel').style.display = 'block';
    } else {
        alert("Incorrect Key");
    }
}

// Publish Button Logic
document.getElementById('publish-btn')?.addEventListener('click', async () => {
    const file = document.getElementById('media-upload').files[0];
    const text = document.getElementById('caption-text').value;
    const output = document.getElementById('console-output');

    if(!file || !text) return alert("All fields required");

    output.innerText = "Connecting to Telegram...";
    
    try {
        // Calling your Vercel API
        const formData = new FormData();
        formData.append('photo', file);

        const res = await fetch('/api/upload-to-tg', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if(data.ok) {
            output.innerText = "Telegram Success. Syncing Firebase...";
            await db.collection('wishes').add({
                text: text,
                tgFileId: data.fileId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            output.innerText = "✅ Content Live!";
        }
    } catch (e) {
        output.innerText = "❌ Error: " + e.message;
    }
});
