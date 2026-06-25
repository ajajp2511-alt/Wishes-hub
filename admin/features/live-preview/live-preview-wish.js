// ==========================================================
// 🚀 WISHES HUB ADMIN - AUTOMATIC SUBMISSION & LIVE PREVIEW
// ==========================================================

function initLivePreviewFeature() {
    const submitBtn = document.getElementById('submit-wish-btn');
    const previewBox = document.getElementById('live-preview-box');

    if (!submitBtn) {
        console.warn("Target element #submit-wish-btn nahi mila! DOM load hone ka wait kar rahe hain...");
        return;
    }

    // Purane listeners clear karne ke liye clone logic takki double submit na ho
    const newSubmitBtn = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);

    newSubmitBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const mainCategory = document.getElementById('main-category').value;
        const subCategory = document.getElementById('sub-category').value;
        const wishText = document.getElementById('wish-text').value.trim();
        const imageFile = document.getElementById('wish-image').files[0];

        // Validation Checks
        if (!mainCategory || !subCategory || !wishText) {
            alert("⚠️ Please fill out Main Category, Sub Category, and Wish Text!");
            return;
        }

        newSubmitBtn.innerText = "⏳ Submitting...";
        newSubmitBtn.disabled = true;

        const formData = new FormData();
        formData.append('mainCategory', mainCategory);
        formData.append('subCategory', subCategory);
        formData.append('wishText', wishText);
        if (imageFile) {
            formData.append('wishImage', imageFile);
        }

        try {
            // Direct call to Vercel Serverless Function
            const response = await fetch('/api/add-wish-to-db', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.status === 200 || result.success) {
                alert("🎉 Wish successfully uploaded and added to Database!");
                
                // Live preview render pipeline
                if (previewBox) {
                    previewBox.innerHTML = `
                        <div style="font-family: system-ui, sans-serif; line-height: 1.6;">
                            <p style="margin: 4px 0; font-size: 14px;"><strong>📁 Category:</strong> <span style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:500;">${mainCategory}</span> &gt; <span style="background:#f3e8ff; color:#6b21a8; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:500;">${subCategory}</span></p>
                            <p style="margin: 12px 0 4px 0; font-size: 14px;"><strong>📝 Submitted Content:</strong></p>
                            <div style="background: #ffffff; padding: 14px; border-left: 4px solid #4f46e5; border-radius: 4px; font-size: 14px; white-space: pre-wrap; border: 1px solid #e2e8f0; border-left-width: 4px; border-left-color: #4f46e5; color:#0f172a;">${wishText}</div>
                            ${imageFile ? `<p style="margin: 12px 0 0 0; color:#16a34a; font-size:13px;"><strong>📸 Image:</strong> ${imageFile.name} attached</p>` : ''}
                        </div>
                    `;
                }
                
                // Clear Fields
                document.getElementById('wish-text').value = "";
                document.getElementById('wish-image').value = "";
                document.getElementById('main-category').value = "";
                document.getElementById('sub-category').innerHTML = '<option value="">Select Sub Category</option>';
            } else {
                alert(`❌ Server Error: ${result.message || 'Submission failed.'}`);
            }
        } catch (error) {
            console.error("Form Submission Error:", error);
            alert("🚨 Network Error: Backend server properly response nahi de raha!");
        } finally {
            newSubmitBtn.innerText = "Submit Wish";
            newSubmitBtn.disabled = false;
        }
    });
}
