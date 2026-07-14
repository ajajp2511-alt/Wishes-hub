// ==========================================================
// 🚀 ENGINE: ULTRA-ROBUST TEXT-NORMALIZED VOICE RECORDER (Patel Studio)
// ==========================================================
// Wishes Hub - Patel Studio (2026)

(function() {
    let mediaRecorder = null;
    let audioChunks = [];
    window.currentRecordedAudioBlob = null; // Save binary for form submit

    // YouTube background music auto-pause helper
    function pauseBackgroundMusic() {
        if (typeof window.ytPlayer !== 'undefined' && window.ytPlayer && typeof window.ytPlayer.pauseVideo === 'function') {
            window.ytPlayer.pauseVideo();
            console.log("System: Background music paused for recording.");
            const playPauseBtn = document.getElementById('mp3PlayPauseBtn');
            if (playPauseBtn) playPauseBtn.textContent = 'Play';
        }
    }

    // Clean text helper: Emojis, spaces, aur special characters ko hatakar sirf normal letters bachaata hai
    function normalizeText(str) {
        if (!str) return "";
        return str.replace(/[^a-zA-Z]/g, '').toLowerCase();
    }

    // Dynamic Preview box generation and injection
    function getOrCreatePreviewContainer(clickedElement) {
        let previewContainer = document.getElementById('voice-preview-container');
        if (!previewContainer) {
            previewContainer = document.createElement('div');
            previewContainer.id = 'voice-preview-container';
            previewContainer.style.cssText = "width: 100%; margin-top: 15px; display: none; transition: all 0.2s ease-in-out;";
            
            // Hum is container ko buttons ke parent wrapper row ke niche insert karenge
            const buttonRow = clickedElement.parentElement;
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
            // Background audio clash clear karein
            pauseBackgroundMusic();

            // Native browser microphone permissions prompt
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
                
                // Hardware mic streams stop karein
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            
            // Button states toggle
            startBtn.disabled = true;
            startBtn.style.opacity = "0.5";
            
            if (stopBtn) {
                stopBtn.disabled = false;
                stopBtn.style.opacity = "1";
            }

        } catch (err) {
            console.error("Microphone Access Error:", err);
            alert("🚨 Mic Error: Please allow microphone permissions or make sure you are using an HTTPS secure connection.");
        }
    }

    // ⏹️ STOP RECORDING LOGIC
    function stopRecording(startBtn, stopBtn) {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
            
            // Reset state parameters
            startBtn.disabled = false;
            startBtn.style.opacity = "1";
            
            if (stopBtn) {
                stopBtn.disabled = true;
                stopBtn.style.opacity = "0.5";
            }
        }
    }

    // ⚡ SUPER DELEGATION LISTENER (Pure page par click track karega)
    document.addEventListener('click', function(e) {
        // Kisi bhi clicked element ke upar target identify karna (Chahe div ho, span ho, button ya anchor)
        const targetElement = e.target.closest('button, div, a, span');
        if (!targetElement) return;

        // Clean match check karein
        const cleanedText = normalizeText(targetElement.textContent);

        // 1. Agar user ne Record Voice button click kiya
        if (cleanedText === "recordvoice" || cleanedText.includes("recordvoice")) {
            e.preventDefault();
            
            // Usi same div row ke andar "Stop" button dhoondhein
            const parentRow = targetElement.parentElement;
            let stopBtn = null;
            if (parentRow) {
                stopBtn = Array.from(parentRow.querySelectorAll('button, div, a, span')).find(el => {
                    return normalizeText(el.textContent) === "stop";
                });
            }

            console.log("System: Normalized 'Record Voice' click detected!");
            startRecording(targetElement, stopBtn);
        }

        // 2. Agar user ne Stop button click kiya
        if (cleanedText === "stop") {
            e.preventDefault();
            
            // Usi same div row ke andar "Record Voice" button dhoondhein
            const parentRow = targetElement.parentElement;
            let startBtn = null;
            if (parentRow) {
                startBtn = Array.from(parentRow.querySelectorAll('button, div, a, span')).find(el => {
                    return normalizeText(el.textContent) === "recordvoice";
                });
            }

            if (startBtn) {
                console.log("System: Normalized 'Stop' click detected!");
                stopRecording(startBtn, targetElement);
            }
        }
    });

    console.log("System: Dynamic Text-Normalized Voice Recorder Engine Online.");
})();
