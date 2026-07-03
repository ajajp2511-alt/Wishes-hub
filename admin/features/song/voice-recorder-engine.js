// ==========================================================
// 🚀 MODULE: VOICE RECORDER ENGINE (Media API Connector)
// ==========================================================

window.currentRecordedAudioBlob = null; // Holds binary audio safely globally

function initVoiceRecorderFeature() {
    const startBtn = document.getElementById('start-rec-btn');
    const stopBtn = document.getElementById('stop-rec-btn');
    const previewContainer = document.getElementById('voice-preview-container');

    if (!startBtn || !stopBtn) return;

    let mediaRecorder = null;
    let audioChunks = [];

    // 🔴 1. START RECORDING LOGIC
    startBtn.addEventListener('click', async () => {
        audioChunks = []; // Clear previous garbage session chunks
        
        try {
            // Request native microphone access permission
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            mediaRecorder = new MediaRecorder(stream);
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                // Compile raw audio chunks into standard WAV/WebM blob structure
                window.currentRecordedAudioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                
                // Render instant audio playback control inside panel box
                const audioUrl = URL.createObjectURL(window.currentRecordedAudioBlob);
                previewContainer.innerHTML = `
                    <p style="font-size:12px; color:#10b981; margin: 4px 0; font-weight:600;">✅ Recording Captured successfully!</p>
                    <audio src="${audioUrl}" controls style="width:100%; height:40px; margin-top:5px;"></audio>
                `;

                // Stop hardware mic stream track components properly
                stream.getTracks().forEach(track => track.stop());
            };

            // Begin dynamic pipeline streaming
            mediaRecorder.start();
            
            // Toggle controller UI interactive statuses
            startBtn.disabled = true;
            startBtn.innerText = "🎙️ Recording...";
            startBtn.style.background = "#94a3b8";
            
            stopBtn.disabled = false;
            stopBtn.style.background = "#1e293b";

        } catch (err) {
            console.error("Mic pipeline initialization failed:", err);
            alert("🚨 Error: Mic permission denied or system connection failed.");
        }
    });

    // ⏹️ 2. STOP RECORDING LOGIC
    stopBtn.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
            
            // Reset state interactive UI targets
            startBtn.disabled = false;
            startBtn.innerText = "🔴 Start Record";
            startBtn.style.background = "#ef4444";
            
            stopBtn.disabled = true;
            stopBtn.style.background = "#64748b";
        }
    });
}

// 🔌 VOICE ENGINE INITIALIZATION TRIGGER
document.addEventListener("DOMContentLoaded", () => {
    initVoiceRecorderFeature();
});
