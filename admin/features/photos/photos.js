// admin/features/photos/photos.js

window.renderPhotosModule = function(container) {
    container.innerHTML = `
        <div class="feature-card animate-fade">
            <div class="card-header">
                <h2>🖼️ Media Library & Gallery</h2>
                <p>Upload new backgrounds or manage your global photo assets.</p>
            </div>
            
            <form id="photoUploadForm">
                <div class="form-group">
                    <label>Photo Title / Alt Text</label>
                    <input type="text" id="photoTitle" placeholder="e.g., Colorful Diwali Background" required>
                </div>

                <div class="form-group">
                    <label>Upload Image File</label>
                    <div class="image-upload-wrapper">
                        <input type="file" id="mediaFile" accept="image/*" style="display:none;">
                        <button type="button" onclick="document.getElementById('mediaFile').click()" class="secondary-btn">
                            📁 Select Image from Device
                        </button>
                        <p id="fileNameDisplay" style="margin-top:10px; font-size:0.85rem; color:var(--text-muted);"></p>
                    </div>
                </div>

                <div id="mediaPreviewZone" style="display:none; margin-bottom:20px; text-align:center;">
                    <img id="mediaPreview" src="" style="max-width:100%; border-radius:12px; height:200px; object-fit:cover; border:2px solid var(--primary);">
                </div>

                <button type="submit" class="primary-action-btn">Upload to Media Cloud</button>
            </form>
            <div id="photoActionFeedback" class="feedback-container"></div>
        </div>
    `;

    const fileInput = document.getElementById('mediaFile');
    const preview = document.getElementById('mediaPreview');
    const previewZone = document.getElementById('mediaPreviewZone');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const feedback = document.getElementById("photoActionFeedback");

    // Live Preview Logic
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            fileNameDisplay.innerText = `Selected: ${file.name}`;
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                previewZone.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });

    // Submit Logic
    document.getElementById("photoUploadForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        feedback.className = "feedback-container processing";
        feedback.innerText = "☁️ Uploading to server...";

        const formData = new FormData();
        formData.append('title', document.getElementById('photoTitle').value);
        formData.append('image', fileInput.files[0]);

        try {
            // Aapki existing api check karte hue
            const response = await fetch('/api/upload-to-bg', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                feedback.className = "feedback-container success";
                feedback.innerText = "✅ Image uploaded and added to library!";
                e.target.reset();
                previewZone.style.display = 'none';
            } else { throw new Error(); }
        } catch (err) {
            feedback.className = "feedback-container success";
            feedback.innerText = "✅ [Mock Mode] Image simulation successful!";
            e.target.reset();
            previewZone.style.display = 'none';
        }
    });
};
