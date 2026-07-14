// ==========================================================
// 🚀 ENGINE: FOOLPROOF DYNAMIC VOICE RECORDER (Patel Studio)
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
        const allButtons = Array.from(document.querySelectorAll('button'));
        
        // 🔍 MULTI-LAYER SCANNING: Buttons dhoondhne ka sabse solid tarika
        let startBtn = document.getElementById('start-rec-btn');
        let stopBtn = document.getElementById('stop-rec-btn');

        if (!startBtn) {
            // Text Content matching (Case-insensitive aur trim ke sath)
            startBtn = allButtons.find(el => {
                const text = el.textContent.trim().toLowerCase();
                return text.includes('record') || text.includes('voice');
            });
        }

        if (!stopBtn) {
            stopBtn = allButtons.find(el => {
                const text = el.textContent.trim().toLowerCase();
                return text === 'stop' || text.includes('stop');
            });
        }

        // AGAR AB BHI NAHI MILA: Toh unke position/sequence ke aadhar par pakdenge (Red aur Gray buttons)
        if (!startBtn && allButtons.length >= 3) {
            // UI design ke mutabik: 1st search on YT (blue), 2nd record (red), 3rd stop (gray)
            // Hum unke inline styles ya placement se track karte hain
            startBtn = allButtons.find(el => el.style.backgroundColor?.includes('red') || el.style.background?.includes('red') || el.textContent.includes('Voice'));
        }

        if (!startBtn || !stopBtn) return;
        
        // Agar listener pehle se mapped hai, toh repeat execution rokein
        if (activeVoiceListener === startBtn) return;
        activeVoiceListener = startBtn;

        console.log("System: Voice recorder successfully hooked onto elements!", startBtn, stopBtn);

        // Dynamic preview holder container inject karna
        let previewContainer = document.getElementById('voice-preview-container');
        if (!previewContainer) {
            previewContainer = document.createElement('div');
            previewContainer.id = 'voice-preview-container';
            previewContainer.style.cssText = "width: 100%; margin-top: 15px; display: none; transition: all 0.2s ease-in-out;";
            
            // Buttons ke immediate parent div ke niche attach karna
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
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; font-family: sans-serif; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
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
                startBtn.innerHTML = "🎙️ Recording...";
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
                startBtn.innerHTML = "Record Voice";
                startBtn.style.opacity = "1";
                
                stopBtn.disabled = true;
                stopBtn.style.opacity = "0.6";
            }
        };
    }

    // SPA Core Engine Watcher Loop: Runs every 1 second
    setInterval(initVoiceRecorderFeature, 1000);
})();
