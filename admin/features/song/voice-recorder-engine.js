// ==========================================================
// 🚀 ENGINE: ULTRA-ROBUST EVENT-DELEGATED VOICE RECORDER
// ==========================================================
// Wishes Hub - Patel Studio (2026)

(function() {
    let mediaRecorder = null;
    let audioChunks = [];
    window.currentRecordedAudioBlob = null; // Binary storage for form submissions

    // Helper: YouTube Player ko pause karne ke liye (Agar active ho)
    function pauseBackgroundMusic() {
        if (typeof window.ytPlayer !== 'undefined' && window.ytPlayer && typeof window.ytPlayer.pauseVideo === 'function') {
            window.ytPlayer.pauseVideo();
            console.log("System: Background music paused for recording.");
            const playPauseBtn = document.getElementById('mp3PlayPauseBtn');
            if (playPauseBtn) playPauseBtn.textContent = 'Play';
        }
    }

    // Dynamic Preview Box generator
    function getOrCreatePreviewContainer(clickedButton) {
        let previewContainer = document.getElementById('voice-preview-container');
        if (!previewContainer) {
            previewContainer = document.createElement('div');
            previewContainer.id = 'voice-preview-container';
            previewContainer.style.cssText = "width: 100%; margin-top: 15px; display: none; transition: all 0.2s ease-in-out;";
            
            // Buttons ke row waale parent container ke thik niche inject karein
            const buttonRow = clickedButton.parentElement;
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
            // Audio conflict clear karein
            pauseBackgroundMusic();

            // Microphone permission request
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
                
                // Mic hardware off karein
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            
            // UI Status Update
            startBtn.disabled = true;
            startBtn.dataset.originalText = startBtn.innerHTML; // Purana state save karein
            startBtn.innerHTML = "🎙️ Recording...";
            startBtn.style.opacity = "0.6";
            
            if (stopBtn) {
                stopBtn.disabled = false;
                stopBtn.style.opacity = "1";
            }

        } catch (err) {
            console.error("Microphone Access Error:", err);
            alert("🚨 Mic Error: Please check device permissions or use HTTPS secure connection.");
        }
    }

    // ⏹️ STOP RECORDING LOGIC
    function stopRecording(startBtn, stopBtn) {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
            
            // Reset UI State
            startBtn.disabled = false;
            startBtn.innerHTML = startBtn.dataset.originalText || "🔴 Record Voice";
            startBtn.style.opacity = "1";
            
            if (stopBtn) {
                stopBtn.disabled = true;
                stopBtn.style.opacity = "0.6";
            }
        }
    }

    // ⚡ EVENT DELEGATION: Screen par kahi bhi click ho, hum target dhoond lenge
    document.addEventListener('click', function(e) {
        // Sabse pehle check karein ki click kisi button par hua hai ya button ke andar ke text/icon par
        const button = e.target.closest('button');
        if (!button) return;

        const buttonText = button.textContent.trim().toLowerCase();

        // 1. Agar RECORD button click hua hai
        if (buttonText.includes('record') || buttonText.includes('voice')) {
            e.preventDefault();
            
            // Stop button ko dhoondhein jo isi row mein hai
            const parentRow = button.parentElement;
            const stopBtn = parentRow ? Array.from(parentRow.querySelectorAll('button')).find(el => {
                return el.textContent.trim().toLowerCase().includes('stop');
            }) : null;

            console.log("System: Record Voice trigger detected!");
            startRecording(button, stopBtn);
        }

        // 2. Agar STOP button click hua hai
        if (buttonText === 'stop' || buttonText.includes('stop')) {
            e.preventDefault();
            
            // Start button ko dhoondhein jo isi row mein hai
            const parentRow = button.parentElement;
            const startBtn = parentRow ? Array.from(parentRow.querySelectorAll('button')).find(el => {
                const txt = el.textContent.trim().toLowerCase();
                return txt.includes('record') || txt.includes('voice');
            }) : null;

            if (startBtn) {
                console.log("System: Stop Recording trigger detected!");
                stopRecording(startBtn, button);
            }
        }
    });

    console.log("System: Ultra-Robust Voice Recorder Engine Initialized.");
})();
