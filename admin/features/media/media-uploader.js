// ==========================================================
// 🚀 WISHES HUB ADMIN - MULTI-MEDIA SMART UPLOADER ENGINE
// ==========================================================

function initMediaUploaderFeature() {
    const submitBtn = document.getElementById('submit-wish-btn');
    const previewBox = document.getElementById('live-preview-box');

    if (!submitBtn) {
        console.warn("Uploader trigger targets missing from current view. Retrying...");
        return false; // Return false taaki pta chale load nahi hua
    }

    // Double binding events reset clear tool
    const newSubmitBtn = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);

    newSubmitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation(); 

        const mainCategory = document.getElementById('main-category').value;
        const subCategory = document.getElementById('sub-category').value;
        const wishText = document.getElementById('wish-text').value.trim();
        const fileInput = document.getElementById('wish-image');
        const uploadedFile = fileInput ? fileInput.files[0] : null;
        const youtubeUrl = document.getElementById('youtube-url') ? document.getElementById('youtube-url').value.trim() : "";

        const recordedVoiceBlob = window.currentRecordedAudioBlob;

        if (!mainCategory || !subCategory || !wishText) {
            alert("⚠️ Please fill out Main Category, Sub Category, and Wish Text!");
            return;
        }

        newSubmitBtn.innerText = "⏳ Uploading Media...";
        newSubmitBtn.disabled = true;

        let detectedType = "none";
        let previewHtmlSnippet = "";

        if (youtubeUrl) {
            detectedType = "youtube";
            let videoId = "";
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = youtubeUrl.match(regExp);
            if (match && match[2].length === 11) {
                videoId = match[2];
                previewHtmlSnippet = `<p style="margin: 10px 0 4px 0;"><strong>📺 YouTube Video Preview:</strong></p>
                                      <iframe width="100%" height="220" src="https://www.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F${videoId}&url=${encodeURIComponent(youtubeUrl)}" frameborder="0" allowfullscreen style="border-radius:6px; background:#000;"></iframe>`;
            } else {
                previewHtmlSnippet = `<p style="margin: 10px 0 0 0; color:#dc2626;">⚠️ Invalid YouTube Link Provided!</p>`;
            }
        } 
        else if (recordedVoiceBlob) {
            detectedType = "voice";
            const tempVoiceUrl = URL.createObjectURL(recordedVoiceBlob);
            previewHtmlSnippet = `<p style="margin: 10px 0 4px 0;"><strong>🎙️ Recorded Voice Preview:</strong></p>
                                  <audio src="${tempVoiceUrl}" controls style="width: 100%; margin-top:5px;"></audio>`;
        }
        else if (uploadedFile) {
            const mime = uploadedFile.type;
            const tempUrl = URL.createObjectURL(uploadedFile);
            
            if (mime.startsWith('image/')) {
                detectedType = "image";
                previewHtmlSnippet = `<p style="margin: 10px 0 4px 0;"><strong>📸 Image Preview:</strong></p>
                                      <img src="${tempUrl}" style="max-width: 100%; max-height: 200px; border-radius: 6px; border: 1px solid #e2e8f0;" />`;
            } else if (mime.startsWith('video/')) {
                detectedType = "video";
                previewHtmlSnippet = `<p style="margin: 10px 0 4px 0;"><strong>🎥 Video Player Preview:</strong></p>
                                      <video src="${tempUrl}" controls style="max-width: 100%; max-height: 220px; border-radius: 6px; background:#000;"></video>`;
            } else if (mime.startsWith('audio/')) {
                detectedType = "audio";
                previewHtmlSnippet = `<p style="margin: 10px 0 4px 0;"><strong>🎵 Song / Audio Player Preview:</strong></p>
                                      <audio src="${tempUrl}" controls style="width: 100%; margin-top:5px;"></audio>
                                      <span style="font-size:12px; color:#64748b; display:block; margin-top:4px;">File: ${uploadedFile.name}</span>`;
            } else {
                detectedType = "document";
                previewHtmlSnippet = `<p style="margin: 10px 0 0 0; color:#0284c7; font-size:13px;">
                                        📄 <strong>Document:</strong> ${uploadedFile.name} (${(uploadedFile.size / (1024*1024)).toFixed(2)} MB)
                                      </p>`;
            }
        }

        const formData = new FormData();
        formData.append('mainCategory', mainCategory);
        formData.append('subCategory', subCategory);
        formData.append('wishText', wishText);
        formData.append('detectedFileType', detectedType);
        formData.append('youtubeUrl', youtubeUrl);
        
        if (recordedVoiceBlob) {
            formData.append('wishImage', recordedVoiceBlob, 'recorded-voice.wav'); 
        } else if (uploadedFile) {
            formData.append('wishImage', uploadedFile); 
        }

        try {
            const response = await fetch('/api/add-wish-to-db', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.status === 200 || result.success) {
                alert(`🎉 Successfully saved! Detected Format: ${detectedType.toUpperCase()}`);
                
                if (previewBox) {
                    previewBox.innerHTML = `
                        <div style="font-family: system-ui, sans-serif; line-height: 1.6;">
                            <p style="margin: 4px 0; font-size: 14px;"><strong>📁 Category:</strong> <span style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:500;">${mainCategory}</span> &gt; <span style="background:#f3e8ff; color:#6b21a8; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:500;">${subCategory}</span></p>
                            <p style="margin: 12px 0 4px 0; font-size: 14px;"><strong>📝 Content:</strong></p>
                            <div style="background: #ffffff; padding: 14px; border: 1px solid #e2e8f0; border-left: 4px solid #4f46e5; border-radius: 4px; font-size: 14px; white-space: pre-wrap; color:#0f172a; margin-bottom:10px;">${wishText}</div>
                            ${previewHtmlSnippet}
                        </div>
                    `;
                }
                
                document.getElementById('wish-text').value = "";
                if (fileInput) fileInput.value = "";
                if (document.getElementById('youtube-url')) document.getElementById('youtube-url').value = "";
                document.getElementById('main-category').value = "";
                document.getElementById('sub-category').innerHTML = '<option value="">Select Sub Category</option>';
                
                window.currentRecordedAudioBlob = null;
                const voicePreview = document.getElementById('voice-preview-container');
                if (voicePreview) voicePreview.innerHTML = "";
            } else {
                alert(`❌ Server Error: ${result.message || 'Submission failed.'}`);
            }
        } catch (error) {
            console.error("Critical Stream Interrupted:", error);
            alert("🚨 Network Error: Backend server properly response nahi de raha!");
        } finally {
            newSubmitBtn.innerText = "Submit Wish";
            newSubmitBtn.disabled = false;
        }
    });

    return true;
}

// 🔌 SMART DELAY INITIALIZATION TRIGGER
// Yeh dashboard-init.js ke overwrite hone ke baad hi chalega taaki elements gayab na hon
document.addEventListener("DOMContentLoaded", () => {
    // Pehle turant chalane ki koshish karein
    const success = initMediaUploaderFeature();
    
    // Agar 2 second baad dashboard-init dubara overwrite karta hai, toh hum dobara bind karenge
    setTimeout(() => {
        console.log("Re-binding features to ensure persistent dashboard injection...");
        initMediaUploaderFeature();
        if (typeof initVoiceRecorderFeature === "function") {
            initVoiceRecorderFeature(); // Voice module ko bhi dubara check karega
        }
    }, 2500); // 2.5 seconds ka delay taaki dashboard fully reset hona band ho jaye
});
