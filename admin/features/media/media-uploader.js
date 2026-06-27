// ==========================================================
// 🚀 WISHES HUB ADMIN - MULTI-MEDIA SMART UPLOADER ENGINE
// ==========================================================

function initMediaUploaderFeature() {
    const submitBtn = document.getElementById('submit-wish-btn');
    const previewBox = document.getElementById('live-preview-box');

    if (!submitBtn) {
        console.warn("Uploader trigger targets missing from current view.");
        return;
    }

    // Double binding events reset clear tool
    const newSubmitBtn = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);

    newSubmitBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const mainCategory = document.getElementById('main-category').value;
        const subCategory = document.getElementById('sub-category').value;
        const wishText = document.getElementById('wish-text').value.trim();
        const fileInput = document.getElementById('wish-image');
        const uploadedFile = fileInput ? fileInput.files[0] : null;

        // Validation Checks
        if (!mainCategory || !subCategory || !wishText) {
            alert("⚠️ Please fill out Main Category, Sub Category, and Wish Text!");
            return;
        }

        newSubmitBtn.innerText = "⏳ Uploading Media...";
        newSubmitBtn.disabled = true;

        // 🧠 AUTOMATIC FILE DETECTOR LAYER
        let detectedType = "none";
        let previewHtmlSnippet = "";

        if (uploadedFile) {
            const mime = uploadedFile.type;
            
            if (mime.startsWith('image/')) {
                detectedType = "image";
                const tempUrl = URL.createObjectURL(uploadedFile);
                previewHtmlSnippet = `<p style="margin: 10px 0 4px 0;"><strong>📸 Image Preview:</strong></p>
                                      <img src="${tempUrl}" style="max-width: 100%; max-height: 200px; border-radius: 6px; border: 1px solid #e2e8f0;" />`;
            } else if (mime.startsWith('video/')) {
                detectedType = "video";
                const tempUrl = URL.createObjectURL(uploadedFile);
                previewHtmlSnippet = `<p style="margin: 10px 0 4px 0;"><strong>🎥 Video Player Preview:</strong></p>
                                      <video src="${tempUrl}" controls style="max-width: 100%; max-height: 220px; border-radius: 6px; background:#000;"></video>`;
            } else {
                detectedType = "document";
                previewHtmlSnippet = `<p style="margin: 10px 0 0 0; color:#0284c7; font-size:13px; display:flex; align-items:center; gap:6px;">
                                        📄 <strong>Document Detected:</strong> ${uploadedFile.name} (${(uploadedFile.size / (1024*1024)).toFixed(2)} MB)
                                      </p>`;
            }
        }

        const formData = new FormData();
        formData.append('mainCategory', mainCategory);
        formData.append('subCategory', subCategory);
        formData.append('wishText', wishText);
        formData.append('detectedFileType', detectedType); // Server ko auto report pass karein
        if (uploadedFile) {
            formData.append('wishImage', uploadedFile); // File append payload
        }

        try {
            // Serverless configuration endpoint integration
            const response = await fetch('/api/add-wish-to-db', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.status === 200 || result.success) {
                alert(`🎉 Successfully saved! Detected media: ${detectedType.toUpperCase()}`);
                
                // Dynamic Master Live Preview Switcher Injections
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
                
                // Fields State Cleaning Loops
                document.getElementById('wish-text').value = "";
                if (fileInput) fileInput.value = "";
                document.getElementById('main-category').value = "";
                document.getElementById('sub-category').innerHTML = '<option value="">Select Sub Category</option>';
            } else {
                alert(`❌ Server Error: ${result.message || 'Submission failed.'}`);
            }
        } catch (error) {
            console.error("Critical Stream Interrupted:", error);
            alert("🚨 Network Error: Backend pipeline response nahi de raha!");
        } finally {
            newSubmitBtn.innerText = "Submit Wish";
            newSubmitBtn.disabled = false;
        }
    });
}
