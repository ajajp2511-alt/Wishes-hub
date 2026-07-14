// ==========================================================
// 🚀 ENGINE: PRODUCTION-READY DYNAMIC VOICE RECORDER
// ==========================================================
// Wishes Hub - Patel Studio (2026)

(function() {
    let activeVoiceListener = null;
    let mediaRecorder = null;
    let audioChunks = [];
    window.currentRecordedAudioBlob = null; // Binary storage for form submissions

    // Conflict Control: Recording shuru hone par YouTube player ko rokna
    function pauseBackgroundMusic() {
        if (typeof window.ytPlayer !== 'undefined' && window.ytPlayer && typeof window.ytPlayer.pauseVideo === 'function') {
            window.ytPlayer.pauseVideo();
            
            // YouTube trimmer button text ko bhi reset karein agar active ho
            const playPauseBtn = document.getElementById('mp3PlayPauseBtn');
            if (playPauseBtn) playPauseBtn.textContent = 'Play';
        }
    }

    function initVoiceRecorderFeature() {
        // DOM dynamic query scanning via Text Content mapping
        const allButtons = Array.from(document.querySelectorAll('button'));
        
        const startBtn = allButtons.find(el => el.textContent.includes('Record Voice'));
        const stopBtn = allButtons.find(el => el.textContent.includes('Stop'));

        if (!startBtn || !stopBtn) return;
        
        // Agar listener pehle se mapped hai, toh runtime processing skip karein
        if (activeVoiceListener === startBtn) return;
        activeVoiceListener = startBtn;

        // Dynamic preview holder inject karna (Agar pehle se maujood nahi hai)
        let previewContainer = document.getElementById('voice-preview-container');
        if (!previewContainer) {
            previewContainer = document.createElement('div');
            previewContainer.id = 'voice-preview-container';
            previewContainer.style.cssText = "width: 100%; margin-top: 15px; display: none; transition: all 0.2s ease-in-out;";
            
            // Buttons ke wrapper container ke thik niche insert karna
            const buttonRow = startBtn.parentElement;
            if (buttonRow) {
                buttonRow.parentNode.insertBefore(previewContainer, buttonRow.nextSibling);
            }
        }

        // 🔴 START RECORDING HANDLER
        startBtn.onclick = async (e) => {
            e.preventDefault();
            audioChunks = [];
            
            try {
                // Background clash dynamic checking
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
                    
                    previewContainer.innerHTML = `
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; font-family: sans-serif;">
                            <p style="font-size: 12px; color: #10b981; margin: 0 0 6px 0; font-weight: 600;">✅ Voice Recording Captured!</p>
                            <audio src="${audioUrl}" controls style="width: 100%; height: 40px; display: block;"></audio>
                        </div>
                    `;
                    previewContainer.style.display = "block";
                    
                    // Release hardware mic components
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorder.start();
                
                // UI Interactive Updates
                startBtn.disabled = true;
                startBtn.textContent = "🎙️ Recording...";
                startBtn.style.opacity = "0.6";
                
                stopBtn.disabled = false;
                stopBtn.style.opacity = "1";

            } catch (err) {
                console.error("Microphone integration failed:", err);
                alert("🚨 Mic Error: Please grant permission or check your device settings.");
            }
        };

        // ⏹️ STOP RECORDING HANDLER
        stopBtn.onclick = (e) => {
            e.preventDefault();
            if (mediaRecorder && mediaRecorder.state !== "inactive") {
                mediaRecorder.stop();
                
                // Reset UI Target states
                startBtn.disabled = false;
                startBtn.textContent = "Record Voice";
                startBtn.style.opacity = "1";
                
                stopBtn.disabled = true;
                stopBtn.style.opacity = "0.6";
            }
        };
    }

    // SPA Core Engine Watcher Loop: Runs every 1 second
    setInterval(initVoiceRecorderFeature, 1000);
})();
