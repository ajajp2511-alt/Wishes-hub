// ==========================================================
// 🚀 MODULE: YOUTUBE SONG SEARCH ENGINE & TAB CONTROLLER
// ==========================================================

function initMediaUploaderFeature() {
    const ytTabBtn = document.getElementById('tab-yt-search');
    const voiceTabBtn = document.getElementById('tab-voice-record');
    const ytPanel = document.getElementById('panel-yt-search');
    const voicePanel = document.getElementById('panel-voice-record');

    const searchBtn = document.getElementById('yt-search-btn');
    const searchInput = document.getElementById('yt-search-input');
    const resultsBox = document.getElementById('yt-search-results');
    const selectedIdInput = document.getElementById('selected-yt-video-id');
    const submitBtn = document.getElementById('submit-wish-btn');
    const previewBox = document.getElementById('live-preview-box');

    if (!ytTabBtn || !searchBtn) return;

    // 🎛️ 1. TABS TOGGLE MANAGEMENT LOGIC
    ytTabBtn.addEventListener('click', () => {
        ytTabBtn.style.background = "#4f46e5"; ytTabBtn.style.color = "white";
        voiceTabBtn.style.background = "#e2e8f0"; voiceTabBtn.style.color = "#475569";
        ytPanel.style.display = "block";
        voicePanel.style.display = "none";
    });

    voiceTabBtn.addEventListener('click', () => {
        voiceTabBtn.style.background = "#4f46e5"; voiceTabBtn.style.color = "white";
        ytTabBtn.style.background = "#e2e8f0"; ytTabBtn.style.color = "#475569";
        voicePanel.style.display = "block";
        ytPanel.style.display = "none";
    });

    // 🔍 2. YOUTUBE API CLIENT SEARCH WIRE
    searchBtn.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (!query) {
            alert("Please type a song name to search!");
            return;
        }

        searchBtn.innerText = "⏳...";
        searchBtn.disabled = true;
        resultsBox.innerHTML = `<p style="font-size:13px; color:#64748b; padding:5px;">Searching tracks on YouTube...</p>`;
        resultsBox.style.display = "block";

        try {
            // Server API endpoint standard format parsing
            const response = await fetch(`/api/youtube-search?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data.success && data.tracks && data.tracks.length > 0) {
                resultsBox.innerHTML = "";
                data.tracks.forEach(track => {
                    const item = document.createElement('div');
                    item.style.cssText = "display:flex; align-items:center; gap:10px; padding:8px; margin-bottom:6px; background:#fff; border:1px solid #e2e8f0; border-radius:4px; cursor:pointer; transition:all 0.2s;";
                    
                    item.innerHTML = `
                        <img src="${track.thumbnail}" style="width:50px; height:38px; object-fit:cover; border-radius:3px;">
                        <div style="flex:1; overflow:hidden;">
                            <p style="margin:0; font-size:13px; font-weight:600; color:#1e293b; white-space:nowrap; text-overflow:ellipsis;">${track.title}</p>
                            <p style="margin:0; font-size:11px; color:#64748b;">${track.channelTitle}</p>
                        </div>
                    `;

                    // Row Selection State Handler
                    item.addEventListener('click', () => {
                        // Reset all sibling items styles
                        Array.from(resultsBox.children).forEach(el => el.style.borderColor = "#e2e8f0");
                        item.style.borderColor = "#4f46e5";
                        item.style.background = "#f0fdf4";
                        
                        selectedIdInput.value = track.videoId;
                        console.log("Selected Target Song YouTube ID:", track.videoId);
                    });

                    resultsBox.appendChild(item);
                });
            } else {
                resultsBox.innerHTML = `<p style="font-size:13px; color:#ef4444; padding:5px;">❌ No songs found. Try different keywords.</p>`;
            }
        } catch (error) {
            console.error("YouTube search pipe broken:", error);
            resultsBox.innerHTML = `<p style="font-size:13px; color:#ef4444; padding:5px;">🚨 Error connecting to YouTube API pipeline.</p>`;
        } finally {
            searchBtn.innerText = "Search";
            searchBtn.disabled = false;
        }
    });

    // 📤 3. CORE SUBMIT CHAIN INTERCEPTOR
    const newSubmitBtn = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);

    newSubmitBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const mainCategory = document.getElementById('main-category').value;
        const subCategory = document.getElementById('sub-category').value;
        const wishText = document.getElementById('wish-text').value.trim();
        const selectedVideoId = selectedIdInput.value;

        if (!mainCategory || !subCategory || !wishText) {
            alert("⚠️ Please fill out Category fields and Wish Content Text!");
            return;
        }

        newSubmitBtn.innerText = "⏳ Saving Wish...";
        newSubmitBtn.disabled = true;

        const formData = new FormData();
        formData.append('mainCategory', mainCategory);
        formData.append('subCategory', subCategory);
        formData.append('wishText', wishText);
        
        // Check current selection method context
        if (ytPanel.style.display !== "none" && selectedVideoId) {
            formData.append('detectedFileType', 'youtube-song');
            formData.append('youtubeVideoId', selectedVideoId);
        } else if (window.currentRecordedAudioBlob) {
            // Handled safely by next file integration
            formData.append('detectedFileType', 'voice-record');
            formData.append('wishImage', window.currentRecordedAudioBlob, 'voice-recording.wav');
        } else {
            formData.append('detectedFileType', 'text-only');
        }

        try {
            const response = await fetch('/api/add-wish-to-db', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.status === 200 || result.success) {
                alert("🎉 Success! Multi-media data saved flawlessly.");
                
                // Set Render Preview Box Interface Layout
                if (previewBox) {
                    let mediaSnippet = "";
                    if (selectedVideoId && ytPanel.style.display !== "none") {
                        mediaSnippet = `<p style="margin: 10px 0 4px 0;"><strong>🎵 Linked YouTube Music Track:</strong></p>
                                        <iframe width="100%" height="180" src="https://www.youtube.com/embed/${selectedVideoId}" frameborder="0" allowfullscreen style="border-radius:6px; background:#000;"></iframe>`;
                    } else if (window.currentRecordedAudioBlob) {
                        const tempAudioUrl = URL.createObjectURL(window.currentRecordedAudioBlob);
                        mediaSnippet = `<p style="margin: 10px 0 4px 0;"><strong>🎙️ Linked Voice Recording:</strong></p>
                                        <audio src="${tempAudioUrl}" controls style="width:100%;"></audio>`;
                    }

                    previewBox.innerHTML = `
                        <div style="font-family: system-ui, sans-serif; line-height: 1.6;">
                            <p style="margin: 4px 0; font-size: 14px;"><strong>📁 Category:</strong> <span style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:500;">${mainCategory}</span> &gt; <span style="background:#f3e8ff; color:#6b21a8; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:500;">${subCategory}</span></p>
                            <p style="margin: 12px 0 4px 0; font-size: 14px;"><strong>📝 Text:</strong></p>
                            <div style="background: #ffffff; padding: 14px; border: 1px solid #e2e8f0; border-left: 4px solid #4f46e5; border-radius: 4px; font-size: 14px; white-space: pre-wrap; color:#0f172a; margin-bottom:10px;">${wishText}</div>
                            ${mediaSnippet}
                        </div>
                    `;
                }

                // Global State Clear Loops
                document.getElementById('wish-text').value = "";
                searchInput.value = "";
                selectedIdInput.value = "";
                resultsBox.innerHTML = "";
                resultsBox.style.display = "none";
                window.currentRecordedAudioBlob = null;
                const recPreview = document.getElementById('voice-preview-container');
                if (recPreview) recPreview.innerHTML = "";
            } else {
                alert(`❌ Error: ${result.message || 'Submission failed.'}`);
            }
        } catch (error) {
            console.error("Submission interrupted:", error);
            alert("🚨 Network Error: Data pipeline down.");
        } finally {
            newSubmitBtn.innerText = "Submit Wish";
            newSubmitBtn.disabled = false;
        }
    });

    // 🔴 Initialize dynamic module connection listener hook for Voice Record file side effects
    if (typeof initVoiceRecorderFeature === 'function') {
        initVoiceRecorderFeature();
    }
                                   }
