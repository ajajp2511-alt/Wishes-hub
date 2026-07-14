// ==========================================================
// 🚀 ENGINE: STRUCTURAL DOM-PROXIMITY VOICE RECORDER (Patel Studio)
// ==========================================================
// Wishes Hub - Patel Studio (2026)

(function() {
    let mediaRecorder = null;
    let audioChunks = [];
    window.currentRecordedAudioBlob = null; // Holds recorded binary file

    // Background YouTube Music Pause Helper
    function pauseBackgroundMusic() {
        if (typeof window.ytPlayer !== 'undefined' && window.ytPlayer && typeof window.ytPlayer.pauseVideo === 'function') {
            window.ytPlayer.pauseVideo();
            console.log("System: Background music paused for recording.");
            const playPauseBtn = document.getElementById('mp3PlayPauseBtn');
            if (playPauseBtn) playPauseBtn.textContent = 'Play';
        }
    }

    // Dynamic Preview Container Generator
    function getOrCreatePreviewContainer(clickedBtn) {
        let previewContainer = document.getElementById('voice-preview-container');
        if (!previewContainer) {
            previewContainer = document.createElement('div');
            previewContainer.id = 'voice-preview-container';
            previewContainer.style.cssText = "width: 100%; margin-top: 15px; display: none; transition: all 0.2s ease-in-out;";
            
            // Is container ko buttons row ke thik niche inject karein
            const buttonRow = clickedBtn.parentElement;
            if (buttonRow) {
                buttonRow.parentNode.insertBefore(previewContainer, buttonRow.nextSibling);
            }
        }
        return previewContainer;
    }

    // 🎙️ START RECORDING LOGIC
    async function startRecording(startBtn, stopBtn) {
        audioChunks = [];
        try {
            pauseBackgroundMusic();

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                window.currentRecordedAudioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(window.currentRecordedAudioBlob);
                
                const previewContainer = getOrCreatePreviewContainer(startBtn);
                previewContainer.innerHTML = `
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; font-family: sans-serif; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-top: 10px;">
                        <p style="font-size: 12px; color: #10b981; margin: 0 0 6px 0; font-weight: 600;">✅ Voice Recording Captured!</p>
                        <audio src="${audioUrl}" controls style="width: 100%; height: 40px; display: block;"></audio>
                    </div>
                `;
                previewContainer.style.display = "block";
                
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            
            // UI Visual Feedback
            startBtn.disabled = true;
            startBtn.style.opacity = "0.5";
            
            if (stopBtn) {
                stopBtn.disabled = false;
                stopBtn.style.opacity = "1";
            }

        } catch (err) {
            console.error("Microphone Integration Failed:", err);
            alert("🚨 Mic Error: Mic allow kijiye ya settings check kijiye.");
        }
    }

    // ⏹️ STOP RECORDING LOGIC
    function stopRecording(startBtn, stopBtn) {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
            
            startBtn.disabled = false;
            startBtn.style.opacity = "1";
            
            if (stopBtn) {
                stopBtn.disabled = true;
                stopBtn.style.opacity = "0.5";
            }
        }
    }

    // ⚡ INTERACTIVE CLICK SCANNERS (DOM Structural Mapping)
    document.addEventListener('click', function(e) {
        // Kisi bhi click target element (div, span, button, a) ko find karna
        const clickedEl = e.target.closest('button, div, a, span');
        if (!clickedEl) return;

        // 🔍 STEP 1: YouTube input field dhoondhein
        const ytInput = Array.from(document.querySelectorAll('input')).find(el => {
            return el.value.includes('youtube.com') || 
                   el.placeholder.includes('youtube.com') || 
                   (el.id && el.id.toLowerCase().includes('youtube')) ||
                   (el.previousElementSibling && el.previousElementSibling.textContent.includes('YouTube URL'));
        });

        if (!ytInput) return; // Agar form hi screen par nahi hai toh skip karein

        // 🔍 STEP 2: YouTube Input ke parent div ke andar ke saare buttons/divs nikalen
        // Yeh hume pure button row (Search, Record, Stop) ki access dega
        const buttonRow = ytInput.parentElement ? ytInput.parentElement.querySelector('div, .buttons-row') || ytInput.nextElementSibling : null;
        if (!buttonRow) return;

        // Row ke andar ke saare clickable child elements
        const rowClickables = Array.from(buttonRow.querySelectorAll('button, div, a, span'));
        if (rowClickables.length < 2) return;

        // 🎨 STEP 3: Background color ya style ke base par components identify karna
        // Record Button (Red background wala color range)
        const recordBtn = rowClickables.find(el => {
            const bg = window.getComputedStyle(el).backgroundColor;
            // Matches red tones: rgb(239, 68, 68), hex #EF4444, etc.
            return bg.includes('239') || bg.includes('244') || bg.includes('255') || el.textContent.toLowerCase().includes('record');
        });

        // Stop Button (Gray/Slate background color range ya Red button ke immediate right wala sibling)
        const stopBtn = rowClickables.find(el => {
            const bg = window.getComputedStyle(el).backgroundColor;
            // Matches slate/gray: rgb(100, 116, 139), etc.
            return bg.includes('100') || bg.includes('116') || bg.includes('139') || el.textContent.toLowerCase().includes('step') || el.textContent.toLowerCase().includes('stop');
        });

        if (!recordBtn || !stopBtn) return;

        // ⚡ Click Verification
        if (clickedEl === recordBtn || recordBtn.contains(e.target)) {
            e.preventDefault();
            console.log("System: Structural 'Record Voice' click validated!");
            startRecording(recordBtn, stopBtn);
        }

        if (clickedEl === stopBtn || stopBtn.contains(e.target)) {
            e.preventDefault();
            console.log("System: Structural 'Stop' click validated!");
            stopRecording(recordBtn, stopBtn);
        }
    });

    console.log("System: Proximity-Based Structural Voice Engine Active.");
})();
