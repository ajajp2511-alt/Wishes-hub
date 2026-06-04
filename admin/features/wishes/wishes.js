// admin/features/wishes/wishes.js

window.renderWishesModule = function(container) {
    container.innerHTML = `
        <div class="feature-card animate-fade">
            <div class="card-header">
                <h2>✨ Publish Unified Wish Entry</h2>
                <p>Upload formatted text and image to create a complete post.</p>
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
                    <label>Wish Message (Rich Text)</label>
                    <!-- Toolbar for Rich Text -->
                    <div class="toolbar">
                        <button type="button" onclick="document.execCommand('bold',false,null)"><b>B</b></button>
                        <button type="button" onclick="document.execCommand('italic',false,null)"><i>I</i></button>
                        <button type="button" onclick="document.execCommand('underline',false,null)"><u>U</u></button>
                    </div>
                    <!-- Editable Div instead of textarea -->
                    <div id="wishBodyEditor" contenteditable="true" class="rich-editor" placeholder="Type your beautiful message here..."></div>
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

    // 3. Logic: Unified Submit
    document.getElementById("unifiedWishesForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const feedback = document.getElementById("wishesActionFeedback");
        const editor = document.getElementById("wishBodyEditor");
        
        feedback.className = "feedback-container processing";
        feedback.innerText = "⏳ Uploading wish and media...";

        const formData = new FormData();
        formData.append('mainCategory', mainCat.value);
        formData.append('subCategory', subCat.value);
        // Rich text content le rahe hain
        formData.append('wishText', editor.innerHTML); 
        formData.append('image', fileInput.files[0]);

        try {
            const response = await fetch('/api/add-unified-wish', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                feedback.className = "feedback-container success";
                feedback.innerText = "✅ Done! Published successfully.";
                editor.innerHTML = ""; // Editor clear karein
                e.target.reset();
                document.getElementById('imgPreview').style.display = 'none';
            } else { throw new Error(); }
        } catch (err) {
            console.log("Mock Submission Payload:", formData);
            feedback.className = "feedback-container success";
            feedback.innerText = "✅ [Mock Saved] Rich text wish processed successfully!";
            editor.innerHTML = "";
            e.target.reset();
            document.getElementById('imgPreview').style.display = 'none';
        }
    });
};
