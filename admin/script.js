async function uploadWish() {
    const wishText = document.getElementById('wish-text').value;
    const imageFile = document.getElementById('media-upload').files[0];
    const statusDiv = document.getElementById('upload-status');
    const btn = document.getElementById('publish-btn');

    if (!wishText || !imageFile) {
        alert("Wish text aur Photo dono zaroori hain!");
        return;
    }

    btn.disabled = true;
    btn.innerText = "⏳ Uploading...";
    statusDiv.innerText = "Processing...";

    const formData = new FormData();
    formData.append('wish', wishText);
    formData.append('image', imageFile);

    try {
        const response = await fetch('/api/upload-to-tg', {
            method: 'POST',
            body: formData // FormData automatic headers set kar deta hai
        });

        const result = await response.json();

        if (response.ok && result.success) {
            statusDiv.style.color = "#238636";
            statusDiv.innerText = "✅ Wish successfully publish ho gayi!";
            document.getElementById('wish-text').value = ""; // Clear box
            document.getElementById('media-upload').value = ""; // Clear file
        } else {
            statusDiv.style.color = "#f85149";
            statusDiv.innerText = "❌ Error: " + (result.message || "Upload fail ho gaya");
        }
    } catch (err) {
        statusDiv.style.color = "#f85149";
        statusDiv.innerText = "❌ Server error. Check internet.";
        console.error(err);
    } finally {
        btn.disabled = false;
        btn.innerText = "Publish Wish";
    }
}

// Ensure this function is available globally
window.uploadWish = uploadWish;
