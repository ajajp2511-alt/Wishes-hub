async function uploadWish() {
    const wishText = document.getElementById('wish-text').value;
    const imageFile = document.getElementById('media-upload').files[0];
    const statusDiv = document.getElementById('upload-status');
    const btn = document.getElementById('publish-btn');

    if (!wishText || !imageFile) {
        alert("Kripya Wish text aur Photo dono select karein!");
        return;
    }

    btn.disabled = true;
    btn.innerText = "⏳ Processing...";
    statusDiv.innerText = "Sending to Telegram...";

    const formData = new FormData();
    formData.append('wish', wishText);
    formData.append('image', imageFile);

    try {
        // Universal path logic: Ye hamesha root /api dhoondega
        const response = await fetch('/api/upload-to-tg', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok && result.success) {
            statusDiv.style.color = "#238636";
            statusDiv.innerText = "✅ Wish successfully publish ho gayi!";
            document.getElementById('wish-text').value = "";
            document.getElementById('media-upload').value = "";
        } else {
            statusDiv.style.color = "#f85149";
            statusDiv.innerText = "❌ Error: " + (result.message || "Upload fail ho gaya");
        }
    } catch (err) {
        statusDiv.style.color = "#f85149";
        statusDiv.innerText = "❌ Server error. Check internet.";
    } finally {
        btn.disabled = false;
        btn.innerText = "Publish Wish";
    }
}

window.uploadWish = uploadWish;
