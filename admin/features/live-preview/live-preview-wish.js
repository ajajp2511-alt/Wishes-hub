// ==========================================================
// 🚀 WISHES HUB ADMIN - SUBMISSION & LIVE PREVIEW ENGINE
// ==========================================================

function initLivePreviewFeature() {
    const submitBtn = document.getElementById('submit-wish-btn');
    const previewBox = document.getElementById('live-preview-box');

    if (!submitBtn) {
        console.warn("Wishes Feature trigger targets missing from current DOM view.");
        return;
    }

    submitBtn.addEventListener('click', async () => {
        const mainCategory = document.getElementById('main-category').value;
        const subCategory = document.getElementById('sub-category').value;
        const wishText = document.getElementById('wish-text').value.trim();
        const imageFile = document.getElementById('wish-image').files[0];

        // Form Validation Checks
        if (!mainCategory || !subCategory || !wishText) {
            alert("⚠️ Please fill out Main Category, Sub Category, and Wish Text!");
            return;
        }

        submitBtn.innerText = "⏳ Submitting...";
        submitBtn.disabled = true;

        const formData = new FormData();
        formData.append('mainCategory', mainCategory);
        formData.append('subCategory', subCategory);
        formData.append('wishText', wishText);
        if (imageFile) {
            formData.append('wishImage', imageFile);
        }

        try {
            // Directhit target to serverless endpoint
            const response = await fetch('/api/add-wish-to-db', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.status === 200 || result.success) {
                alert("🎉 Wish successfully uploaded and added to Database!");
                
                // Realtime screen data display generator engine
                if (previewBox) {
                    previewBox.innerHTML = `
                        <div style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6;">
                            <p style="margin: 4px 0; font-size: 14px;"><strong>📁 Category:</strong> <span style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:500;">${mainCategory}</span> &gt; <span style="background:#f3e8ff; color:#6b21a8; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:500;">${subCategory}</span></p>
                            <p style="margin: 12px 0 4px 0; font-size: 14px;"><strong>📝 Submitted Content:</strong></p>
                            <div style="background: #ffffff; padding: 14px; border-left: 4px solid #4f46e5; border-radius: 4px; font-size: 14px; white-wrap: pre-wrap; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; color:#0f172a;">${wishText}</div>
                            ${imageFile ? `<p style="margin: 12px 0 0 0; color:#16a34a; font-size:13px; display:flex; align-items:center; gap:4px;"><strong>📸 Image:</strong> Attached & uploaded successfully</p>` : ''}
                        </div>
                    `;
                }
                
                // Clear Form Fields inputs values
                document.getElementById('wish-text').value = "";
                document.getElementById('wish-image').value = "";
                document.getElementById('main-category').value = "";
                document.getElementById('sub-category').innerHTML = '<option value="">Select Sub Category</option>';
            } else {
                alert(`❌ Server Error: ${result.message || 'Submission failed.'}`);
            }
        } catch (error) {
            console.error("Form Submission Error:", error);
            alert("🚨 Network Error: Backend server response nahi de raha!");
        } finally {
            submitBtn.innerText = "Submit Wish";
            submitBtn.disabled = false;
        }
    });
}
