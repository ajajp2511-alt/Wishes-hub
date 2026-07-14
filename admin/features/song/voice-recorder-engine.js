// ==========================================================
// 🚀 ENGINE: SPA-COMPATIBLE VOICE RECORDER (Auto-Pause Conflict Logic)
// ==========================================================
// Wishes Hub - Patel Studio (2026)

(function() {
    let activeVoiceListener = null;
    let mediaRecorder = null;
    let audioChunks = [];

    // Helper: YouTube Player ko pause karne ke liye (Agar active ho)
    function pauseBackgroundMusic() {
        if (typeof window.ytPlayer !== 'undefined' && window.ytPlayer && typeof window.ytPlayer.pauseVideo === 'function') {
            window.ytPlayer.pauseVideo();
            console.log("System: Background music paused for recording.");
        }
    }

    function initVoiceRecorder() {
        // Dynamic DOM lookup: Buttons dhundhna
        const startBtn = document.getElementById('start-rec-btn');
        const stopBtn = document.getElementById('stop-rec-btn');
        const previewContainer = document.getElementById('voice-preview-container');

        if (!startBtn || !stopBtn) return;
        if (activeVoiceListener === startBtn) return; // Pehle se bind hai
        activeVoiceListener = startBtn;

        // Start Recording Event
        startBtn.onclick = async () => {
            audioChunks = [];
            try {
                // Conflict Management: Recording shuru karne se pehle gaana pause
                pauseBackgroundMusic();

                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                
                mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
                
                mediaRecorder.onstop = () => {
                    window.currentRecordedAudioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(window.currentRecordedAudioBlob);
                    
                    if (previewContainer) {
                        previewContainer.innerHTML = `
                            <div style="margin-top:10px; padding:10px; background:#f1f5f9; border-radius:8px;">
                                <p style="font-size:12px; color:#10b981; margin:0 0 5px 0;">✅ Recording Captured!</p>
                                <audio src="${audioUrl}" controls style="width:100%; height:40px;"></audio>
                            </div>
                        `;
                    }
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorder.start();
                startBtn.disabled = true;
                startBtn.innerText = "🎙️ Recording...";
                startBtn.style.background = "#94a3b8";
                stopBtn.disabled = false;
                stopBtn.style.background = "#1e293b";

            } catch (err) {
                alert("🚨 Microphome access denied! Settings check karein.");
            }
        };

        // Stop Recording Event
        stopBtn.onclick = () => {
            if (mediaRecorder && mediaRecorder.state !== "inactive") {
                mediaRecorder.stop();
                startBtn.disabled = false;
                startBtn.innerText = "🔴 Start Record";
                startBtn.style.background = "#ef4444";
                stopBtn.disabled = true;
                stopBtn.style.background = "#64748b";
            }
        };
    }

    // SPA Wrapper Loop: Har 1 second mein active buttons dhoondhna
    setInterval(initVoiceRecorder, 1000);
})();
