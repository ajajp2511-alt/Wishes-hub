// ==========================================================
// 🚀 ENGINE: SPA YOUTUBE TO MP3 AUDIO TRIMMER & LINKER
// ==========================================================
// Wishes Hub - Patel Studio (2026)

(function() {
    let activeInputListener = null;
    let ytPlayer = null;
    let durationCheckInterval = null;
    let totalDuration = 0;

    // YouTube API Core Script Dynamic Injection (Sirf ek baar load hoga)
    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // URL parser for standard and Shorts format
    function extractYouTubeVideoId(url) {
        if (!url) return null;
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
        const match = url.match(regExp);
        return (match && match[1]) ? match[1] : null;
    }

    // Samay ko MM:SS format me badalne ke liye helper function
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Custom MP3 Control Dashboard Structure UI Injection
    function createMp3TrimmerUI(previewContainer) {
        previewContainer.innerHTML = `
            <!-- Hidden YouTube Player Frame Element -->
            <div id="hiddenYtPlayerNode" style="display:none; width:0; height:0;"></div>

            <!-- Patel Studio Custom MP3 Player Box UI -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; font-family: 'Segoe UI', sans-serif;">
                
                <!-- Audio Header Status -->
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                    <span style="font-size: 14px; color: #334155; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                        🎵 Audio Preview Loaded
                    </span>
                    <button id="mp3PlayPauseBtn" style="background: #3b82f6; color: white; border: none; padding: 6px 14px; border-radius: 4px; font-size: 12px; cursor: pointer; font-weight: bold;">Play</button>
                </div>

                <!-- Slider 1: START TIME SELECTOR -->
                <div style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748b; margin-bottom: 2px;">
                        <span>Start Position:</span>
                        <span id="startTimeLabel" style="font-weight: bold; color: #1e293b;">0:00</span>
                    </div>
                    <input type="range" id="mp3StartSlider" min="0" max="100" value="0" style="width: 100%; accent-color: #10b981; cursor: pointer;">
                </div>

                <!-- Slider 2: END TIME SELECTOR -->
                <div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748b; margin-bottom: 2px;">
                        <span>End Position:</span>
                        <span id="endTimeLabel" style="font-weight: bold; color: #1e293b;">0:00</span>
                    </div>
                    <input type="range" id="mp3EndSlider" min="0" max="100" value="100" style="width: 100%; accent-color: #ef4444; cursor: pointer;">
                </div>

                <!-- Hidden inputs to submit values along with the main form data -->
                <input type="hidden" id="audioStartTimeField" name="audio_start_time" value="0">
                <input type="hidden" id="audioEndTimeField" name="audio_end_time" value="0">
            </div>
        `;
    }

    // Audio binding, trimming logic aur interface synchronization
    function bindTrimmerControls(previewContainer) {
        const playPauseBtn = document.getElementById('mp3PlayPauseBtn');
        const startSlider = document.getElementById('mp3StartSlider');
        const endSlider = document.getElementById('mp3EndSlider');
        const startTimeLabel = document.getElementById('startTimeLabel');
        const endTimeLabel = document.getElementById('endTimeLabel');
        const audioStartField = document.getElementById('audioStartTimeField');
        const audioEndField = document.getElementById('audioEndTimeField');

        if (!playPauseBtn) return;

        // Play and Pause Toggle Control
        playPauseBtn.addEventListener('click', () => {
            if (!ytPlayer || typeof ytPlayer.getPlayerState !== 'function') return;
            
            const state = ytPlayer.getPlayerState();
            if (state === 1) { // 1 means Playing
                ytPlayer.pauseVideo();
                playPauseBtn.textContent = 'Play';
            } else {
                // Agar loop start time se aage nikal gaya ho ya bahar ho toh pehle reset karein
                const currentTime = ytPlayer.getCurrentTime();
                const startTime = parseFloat(startSlider.value);
                const endTime = parseFloat(endSlider.value);
                
                if (currentTime < startTime || currentTime >= endTime) {
                    ytPlayer.seekTo(startTime, true);
                }
                ytPlayer.playVideo();
                playPauseBtn.textContent = 'Pause';
            }
        });

        // Start Slider Event Logic
        startSlider.addEventListener('input', () => {
            let startVal = parseFloat(startSlider.value);
            let endVal = parseFloat(endSlider.value);
            
            if (startVal >= endVal) {
                startVal = endVal - 1;
                startSlider.value = startVal;
            }
            
            startTimeLabel.textContent = formatTime(startVal);
            audioStartField.value = startVal;
            
            if (ytPlayer && typeof ytPlayer.seekTo === 'function') {
                ytPlayer.seekTo(startVal, true);
            }
        });

        // End Slider Event Logic
        endSlider.addEventListener('input', () => {
            let startVal = parseFloat(startSlider.value);
            let endVal = parseFloat(endSlider.value);
            
            if (endVal <= startVal) {
                endVal = startVal + 1;
                endSlider.value = endVal;
            }
            
            endTimeLabel.textContent = formatTime(endVal);
            audioEndField.value = endVal;
        });

        // Loop controller interval framework logic
        if (durationCheckInterval) clearInterval(durationCheckInterval);
        
        durationCheckInterval = setInterval(() => {
            if (ytPlayer && typeof ytPlayer.getPlayerState === 'function') {
                if (ytPlayer.getPlayerState() === 1) { // Running
                    const current = ytPlayer.getCurrentTime();
                    const startVal = parseFloat(startSlider.value);
                    const endVal = parseFloat(endSlider.value);

                    // Loop dynamic controller injection
                    if (current >= endVal || current < startVal) {
                        ytPlayer.seekTo(startVal, true);
                    }
                }
            }
        }, 300);
    }

    // Main API Frame Init Trigger Pipeline
    function loadAudioEngine(videoId, previewContainer) {
        createMp3TrimmerUI(previewContainer);

        // Naya global window script node generate karke API hook active karna
        ytPlayer = new YT.Player('hiddenYtPlayerNode', {
            videoId: videoId,
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'disablekb': 1,
                'fs': 0,
                'modestbranding': 1,
                'rel': 0
            },
            events: {
                'onReady': function(event) {
                    totalDuration = event.target.getDuration();
                    
                    const startSlider = document.getElementById('mp3StartSlider');
                    const endSlider = document.getElementById('mp3EndSlider');
                    const endTimeLabel = document.getElementById('endTimeLabel');
                    const audioEndField = document.getElementById('audioEndTimeField');

                    if (startSlider && endSlider) {
                        startSlider.max = totalDuration;
                        endSlider.max = totalDuration;
                        endSlider.value = totalDuration;

                        endTimeLabel.textContent = formatTime(totalDuration);
                        audioEndField.value = totalDuration;
                        
                        bindTrimmerControls(previewContainer);
                    }
                },
                'onStateChange': function(event) {
                    const playPauseBtn = document.getElementById('mp3PlayPauseBtn');
                    if (playPauseBtn) {
                        if (event.data === 1) playPauseBtn.textContent = 'Pause';
                        else playPauseBtn.textContent = 'Play';
                    }
                }
            }
        });
    }

    // Input configuration check dynamic setup execution loop
    function watchForDynamicInput() {
        const ytUrlInput = Array.from(document.querySelectorAll('input')).find(el => {
            return el.value.includes('youtube.com') || 
                   el.placeholder.includes('youtube.com') || 
                   (el.id && el.id.toLowerCase().includes('youtube')) ||
                   (el.previousElementSibling && el.previousElementSibling.textContent.includes('YouTube URL'));
        });

        if (!ytUrlInput) {
            activeInputListener = null;
            if (durationCheckInterval) {
                clearInterval(durationCheckInterval);
                durationCheckInterval = null;
            }
            return;
        }

        if (activeInputListener === ytUrlInput) return;
        activeInputListener = ytUrlInput;

        let previewContainer = document.getElementById("instantYtUrlPreviewBox");
        if (!previewContainer) {
            previewContainer = document.createElement("div");
            previewContainer.id = "instantYtUrlPreviewBox";
            previewContainer.style.cssText = "margin-top: 12px; display: none; width: 100%; max-width: 400px; transition: all 0.2s ease-in-out;";
            ytUrlInput.parentNode.insertBefore(previewContainer, ytUrlInput.nextSibling);
        }

        const handleUrlChange = () => {
            const currentUrl = ytUrlInput.value.trim();
            const videoId = extractYouTubeVideoId(currentUrl);

            if (videoId) {
                previewContainer.style.display = "block";
                loadAudioEngine(videoId, previewContainer);
            } else {
                previewContainer.style.display = "none";
                previewContainer.innerHTML = "";
                if (durationCheckInterval) clearInterval(durationCheckInterval);
            }
        };

        ytUrlInput.addEventListener('input', handleUrlChange);
        ytUrlInput.addEventListener('change', handleUrlChange);
        ytUrlInput.addEventListener('paste', () => setTimeout(handleUrlChange, 120));

        if (ytUrlInput.value) {
            handleUrlChange();
        }
    }

    setInterval(watchForDynamicInput, 1000);
})();
