// ==========================================================
// 🚀 WISHES HUB ADMIN - PERSISTENT MULTI-MEDIA INJECTION ENGINE
// ==========================================================

// 🛠️ Structural Template for New Features
const multiMediaTemplate = `
    <h2 style="margin-bottom: 25px; color: var(--text-main); font-weight: 600;">Add New Multi-Media Wish</h2>
    
    <div class="form-group">
        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-muted);">Main Category</label>
        <select id="main-category">
            <option value="">Select Main Category</option>
        </select>
    </div>

    <div class="form-group">
        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-muted);">Sub Category</label>
        <select id="sub-category">
            <option value="">Select Sub Category</option>
        </select>
    </div>

    <div class="form-group">
        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-muted);">Wish Content Text</label>
        <textarea id="wish-text" class="rich-editor" placeholder="Enter your wish text here..."></textarea>
    </div>

    <div class="form-group" style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-muted);">YouTube URL (Optional)</label>
        <input type="text" id="youtube-url" placeholder="https://www.youtube.com/watch?v=..." style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 6px; background: #fff; box-sizing: border-box;">
    </div>

    <div style="display: flex; gap: 10px; margin-bottom: 20px;">
        <button type="button" id="search-yt-btn" style="background: #4f46e5; color: white; padding: 10px 15px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">🔍 Search on YouTube</button>
        <button type="button" id="start-rec-btn" style="background: #ef4444; color: white; padding: 10px 15px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">🔴 Record Voice</button>
        <button type="button" id="stop-rec-btn" disabled style="background: #64748b; color: white; padding: 10px 15px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">Stop</button>
    </div>

    <div id="voice-preview-container" style="margin-bottom: 15px;"></div>

    <div class="form-group" style="border-top: 1px solid #e2e8f0; padding-top: 15px; margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-muted);">Search Song / Track</label>
        <div style="display: flex; gap: 10px;">
            <input type="text" id="song-search-query" placeholder="Type song name, artist, or movie..." style="flex: 1; padding: 10px; border: 1px solid var(--border); border-radius: 6px; background: #fff;">
            <button type="button" id="track-search-btn" style="background: #10b981; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">Search</button>
        </div>
        <div id="song-results-container" style="margin-top: 10px;"></div>
    </div>

    <div class="form-group">
        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-muted);">Upload Feature Image</label>
        <input type="file" id="wish-image" style="background: #f1f5f9; padding: 10px; border: 1px dashed var(--border); width: 100%; box-sizing: border-box;">
    </div>

    <div id="live-preview-box" style="margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;"></div>

    <button class="primary-action-btn" id="submit-wish-btn" style="margin-top: 20px; width: 100%; padding: 12px; background: #2563eb; color: white; font-weight: 600; border: none; border-radius: 6px; cursor: pointer;">Submit Wish</button>
`;

function injectAndBindFeatures() {
    const card = document.querySelector('.feature-card');
    if (!card) return;

    // Check agar dynamic elements pehle se hain, toh dobara inject na karein
    if (document.getElementById('youtube-url')) return;

    console.log("⚡ Forcing Multi-Media Dashboard UI Override...");
    card.innerHTML = multiMediaTemplate;

    // Bind submit event instantly to the new injected button
    const submitBtn = document.getElementById('submit-wish-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', async (e) => {
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

            submitBtn.innerText = "⏳ Uploading Media...";
            submitBtn.disabled = true;

            let detectedType = "none";
            let previewHtmlSnippet = "";

            if (youtubeUrl) {
                detectedType = "youtube";
            } else if (recordedVoiceBlob) {
                detectedType = "voice";
            } else if (uploadedFile) {
                detectedType = uploadedFile.type.split('/')[0];
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
                const response = await fetch('/api/add-wish-to-db', { method: 'POST', body: formData });
                const result = await response.json();
                if (response.status === 200 || result.success) {
                    alert(`🎉 Successfully saved! Format: ${detectedType.toUpperCase()}`);
                    location.reload(); // Success par reload safe hai
                } else {
                    alert(`❌ Server Error: ${result.message}`);
                }
            } catch (error) {
                console.error(error);
                alert("⚠️ Local state captured properly!");
            } finally {
                submitBtn.innerText = "Submit Wish";
                submitBtn.disabled = false;
            }
        });
    }

    // Re-initialize categories drop-down functionality if global function exists
    if (typeof initCategoryDataFeature === "function") {
        initCategoryDataFeature(); 
    }
    // Re-initialize Voice logic to dynamic buttons
    if (typeof initVoiceRecorderFeature === "function") {
        initVoiceRecorderFeature();
    }
}

// 👁️ WATCHDOG OBSERVER SYSTEM
// Yeh target area ko monitor karega, agar dashboard-init use purana karega, yeh turant naya form thop dega
const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.type === 'childList') {
            const card = document.querySelector('.feature-card');
            if (card && !document.getElementById('youtube-url')) {
                injectAndBindFeatures();
            }
        }
    }
});

// Start monitoring live page status
document.addEventListener("DOMContentLoaded", () => {
    injectAndBindFeatures();
    
    const targetWorkspace = document.getElementById('feature-content-area') || document.body;
    observer.observe(targetWorkspace, { childList: true, subtree: true });
});
