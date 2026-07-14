// ==========================================================
// 🚀 ENGINE: SPA-COMPATIBLE YOUTUBE URL INSTANT PREVIEW LINKER
// ==========================================================
// Wishes Hub - Patel Studio (2026)

(function() {
    let activeInputListener = null;

    // URL se 11-digit YouTube Video ID nikaalne ka utility function
    function extractYouTubeVideoId(url) {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // Dynamic Preview Box ko render aur update karne ka logic
    function syncPlayerFrame(ytUrlInput, previewContainer) {
        const currentUrl = ytUrlInput.value.trim();
        const videoId = extractYouTubeVideoId(currentUrl);

        if (videoId) {
            // Agar iframe pehle se wahi video load kiye hue hai toh bar-bar reload na karein
            const currentIframe = previewContainer.querySelector('iframe');
            if (currentIframe && currentIframe.src.includes(videoId)) return;

            previewContainer.innerHTML = `
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0&controls=1&modestbranding=1&rel=0" 
                    frameborder="0" 
                    allow="autoplay; encrypted-media" 
                    allowfullscreen
                    style="border: none; width: 100%; height: 100%; display: block;">
                </iframe>
            `;
            previewContainer.style.display = "block";
        } else {
            previewContainer.style.display = "none";
            previewContainer.innerHTML = "";
        }
    }

    // Main Engine Loop: Jo lagatar check karega ki input screen par aaya ya nahi
    function watchForDynamicInput() {
        // Pure active dynamic view mein input box ko dhoondna
        const ytUrlInput = Array.from(document.querySelectorAll('input')).find(el => {
            return el.value.includes('youtube.com') || 
                   el.placeholder.includes('youtube.com') || 
                   (el.id && el.id.toLowerCase().includes('youtube')) ||
                   (el.previousElementSibling && el.previousElementSibling.textContent.includes('YouTube URL'));
        });

        // Agar input box abhi screen par nahi aaya hai, toh display reset karke waapas check karein
        if (!ytUrlInput) {
            activeInputListener = null;
            return;
        }

        // Agar hum pehle se isi input box ko track kar rahe hain, toh dubara event bind na karein
        if (activeInputListener === ytUrlInput) return;
        activeInputListener = ytUrlInput;

        // Preview box banana agar pehle se nahi bana hai
        let previewContainer = document.getElementById("instantYtUrlPreviewBox");
        if (!previewContainer) {
            previewContainer = document.createElement("div");
            previewContainer.id = "instantYtUrlPreviewBox";
            previewContainer.style.cssText = "margin-top: 12px; display: none; width: 100%; max-width: 400px; height: 75px; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 2px 5px rgba(0,0,0,0.06); transition: all 0.2s ease-in-out;";
            ytUrlInput.parentNode.insertBefore(previewContainer, ytUrlInput.nextSibling);
        }

        // Event handler functions ko map karna
        const handler = () => syncPlayerFrame(ytUrlInput, previewContainer);

        ytUrlInput.addEventListener('input', handler);
        ytUrlInput.addEventListener('change', handler);
        ytUrlInput.addEventListener('paste', () => setTimeout(handler, 120));

        // Agar input mein pehle se koi URL load hokar aaya hai (Edit State)
        if (ytUrlInput.value) {
            handler();
        }
    }

    // SPA dynamic root checking: Har 1 second mein input box ki presence check karega
    setInterval(watchForDynamicInput, 1000);
})();
