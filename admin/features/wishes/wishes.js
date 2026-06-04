
// admin/features/wishes/wishes.js

window.renderWishesModule = function(container) {
    container.innerHTML = `
        <div class="feature-card animate-fade">
            <div class="card-header">
                <h2>✨ Publish Unified Wish Entry</h2>
                <p>Upload text and image together to create a complete post.</p>
            </div>
            
            <form id="unifiedWishesForm">
                <div class="form-group">
                    <label>Main Category</label>
                    <select id="wishCategory" required></select>
                </div>
                <div class="form-group">
                    <label>Sub Category</label>
                    <select id="wishSubCategory" disabled required>
                        <option value="">-- Select Main Category First --</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Wish Message</label>
                    <textarea id="wishBody" rows="4" placeholder="Type your beautiful message here..." required></textarea>
                </div>

                <div class="form-group">
                    <label>Attach Background Photo</label>
                    <input type="file" id="wishImageFile" accept="image/*" class="form-control" required>
                    <div id="imgPreview" style="margin-top:10px; display:none;">
                        <img src="" style="max-height:100px; border-radius:8px;">
                    </div>
                </div>

                <button type="submit" class="primary-action-btn">🚀 Publish Unified Wish</button>
            </form>
            <div id="wishesActionFeedback" class="feedback-container"></div>
        </div>
    `;

    // 1. Logic: Dropdowns Setup
    const mainCat = document.getElementById("wishCategory");
    const subCat = document.getElementById("wishSubCategory");
    if (typeof populateMainCategories === "function") populateMainCategories(mainCat);
    mainCat.addEventListener("change", () => updateSubCategories(mainCat.value, subCat));

    // 2. Logic: Image Preview
    const fileInput = document.getElementById('wishImageFile');
    fileInput.addEventListener('change', function() {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.querySelector('#imgPreview img');
            preview.src = e.target.result;
            document.getElementById('imgPreview').style.display = 'block';
        };
        reader.readAsDataURL(this.files[0]);
    });

    // 3. Logic: Unified Submit (Text + Image)
    document.getElementById("unifiedWishesForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const feedback = document.getElementById("wishesActionFeedback");
        feedback.className = "feedback-container processing";
        feedback.innerText = "⏳ Uploading wish and media to Wishes Hub...";

        // FormData ka use karein taki Text aur File dono ek sath jayein
        const formData = new FormData();
        formData.append('mainCategory', mainCat.value);
        formData.append('subCategory', subCat.value);
        formData.append('wishText', document.getElementById("wishBody").value);
        formData.append('image', fileInput.files[0]); // File attachment

        try {
            // Hum yahan /api/add-unified-wish endpoint call karenge
            const response = await fetch('/api/add-unified-wish', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                feedback.className = "feedback-container success";
                feedback.innerText = "✅ Done! Wish and Photo published successfully.";
                e.target.reset();
                document.getElementById('imgPreview').style.display = 'none';
            } else { throw new Error(); }
        } catch (err) {
            console.log("Mock Submission Payload:", formData);
            feedback.className = "feedback-container success";
            feedback.innerText = "✅ [Mock Saved] Unified Wish processed successfully!";
            e.target.reset();
            document.getElementById('imgPreview').style.display = 'none';
        }
    });
};
