// 1. Password Verification (Backend Integration)
async function login() {
    const passInput = document.getElementById('auth-key').value;
    const statusDiv = document.getElementById('status'); // Output ke liye ek div rakhein

    try {
        const response = await fetch('/api/verify-pass', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passInput })
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('login-module').style.display = 'none';
            document.getElementById('main-panel').style.display = 'block';
            console.log("Access Granted: Session Active");
        } else {
            alert("Ghalat Password! " + data.message);
        }
    } catch (err) {
        alert("Server se connection nahi ho paa raha!");
    }
}

// 2. Publish Function (Backend: upload-to-tg.js call)
document.getElementById('publish-btn')?.addEventListener('click', async () => {
    const file = document.getElementById('media-upload').files[0];
    const text = document.getElementById('caption-text').value;
    const status = document.getElementById('status');

    if (!file || !text) return alert("Photo aur Message dono bhariye!");

    status.innerText = "⏳ Processing...";

    try {
        const formData = new FormData();
        formData.append('photo', file);

        const res = await fetch('/api/upload-to-tg', {
            method: 'POST',
            body: formData // Headers browser auto-handle karega
        });

        const data = await res.json();

        if (data.ok) {
            status.innerText = "✅ Successfully Published!";
            // Baaki ka Firebase logic yahan daal sakte hain
        } else {
            throw new Error(data.error);
        }
    } catch (e) {
        status.innerText = "❌ Error: " + e.message;
    }
});
