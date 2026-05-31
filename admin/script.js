// Admin Login Function
window.login = async function() {
    const passInput = document.getElementById('auth-key').value;
    const btn = document.querySelector('#login-module button');
    const status = document.getElementById('status');
    
    if(!passInput) {
        alert("Please enter the admin key.");
        return;
    }

    // Loading State Start
    const originalText = btn.innerText;
    btn.innerText = "⏳ Verifying..."; 
    btn.disabled = true;

    try {
        const response = await fetch('/api/verify-pass', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passInput })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Success: Login module hide karein aur main panel dikhayein
            document.getElementById('login-module').style.display = 'none';
            document.getElementById('main-panel').style.display = 'block';
            status.innerText = "✅ Welcome, Admin!";
            console.log("Access Granted");
            
            // लॉगिन के बाद ही पब्लिश बटन का फंक्शन एक्टिव करें
            initPublishLogic();
        } else {
            // Galat password par alert
            alert("Access Denied: " + (data.message || "Galat key dali hai."));
            btn.innerText = originalText;
            btn.disabled = false;
        }
    } catch (err) {
        console.error("Login Error:", err);
        alert("Server Error: Backend se connection nahi ho raha.");
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// Telegram Publish Logic (Function के अंदर ताकि एरर न आए)
function initPublishLogic() {
    const publishBtn = document.getElementById('publish-btn');
    if (!publishBtn) return;

    publishBtn.addEventListener('click', async () => {
        const fileInput = document.getElementById('media-upload');
        const status = document.getElementById('status');

        if (fileInput.files.length === 0) {
            alert("Pehle ek image select karein.");
            return;
        }

        status.innerText = "🚀 Telegram par bhej rahe hain...";
        publishBtn.disabled = true;
        
        const file = fileInput.files[0];

        try {
            // upload-to-tg.js binary stream handle karta hai
            const response = await fetch('/api/upload-to-tg', {
                method: 'POST',
                body: file, 
                headers: {
                    'content-type': file.type
                }
            });

            const data = await response.json();

            if (data.ok) {
                status.innerText = "✅ Telegram par successfully upload ho gaya!";
                fileInput.value = ""; 
            } else {
                status.innerText = "❌ Error: " + (data.error || "Upload fail ho gaya.");
            }
        } catch (err) {
            console.error("Upload Error:", err);
            status.innerText = "❌ Connection Failed. Check your API settings.";
        } finally {
            publishBtn.disabled = false;
        }
    });
}
