// ==========================================================
// 🚀 ENGINE: AUTOMATIC YOUTUBE URL INSTANT PREVIEW LINKER
// ==========================================================
// Wishes Hub - Patel Studio (2026)

(function() {
    // URL se 11-digit YouTube Video ID nikaalne ka unique utility function
    function extractYouTubeVideoId(url) {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // Main controller jo input box par nazar rakhega aur player generate karega
    function initYoutubeUrlLinker() {
        // Pure page par check karega ki YouTube URL waala input box kahan hai
        const ytUrlInput = Array.from(document.querySelectorAll('input')).find(el => {
            return el.value.includes('youtube.com') || 
                   el.placeholder.includes('youtube.com') || 
                   (el.previousElementSibling && el.previousElementSibling.textContent.includes('YouTube URL'));
        });

        if (!ytUrlInput) return;

        // Input box ke thik niche ek clean aur responsive preview frame banana
        let previewContainer = document.getElementById("instantYtUrlPreviewBox");
        if (!previewContainer) {
            previewContainer = document.createElement("div");
            previewContainer.id = "instantYtUrlPreviewBox";
            // Patel Studio Brand Design Rules: Clean styling with zero layout shift
            previewContainer.style.cssText = "margin-top: 12px; display: none; width: 100%; max-width: 400px; height: 75px; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 2px 5px rgba(0,0,0,0.06); transition: all 0.3s ease-in-out;";
            ytUrlInput.parentNode.insertBefore(previewContainer, ytUrlInput.nextSibling);
        }

        // Live preview ko dynamically content dene wala function
        function syncPlayerFrame() {
            const currentUrl = ytUrlInput.value.trim();
            const videoId = extractYouTubeVideoId(currentUrl);

            if (videoId) {
                // Iframe content insertion without disturbing focus states
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

        // Event triggers: Har tarah ke interaction par dynamic sync chalega
        ytUrlInput.addEventListener('input', syncPlayerFrame);
        ytUrlInput.addEventListener('change', syncPlayerFrame);
        ytUrlInput.addEventListener('paste', () => setTimeout(syncPlayerFrame, 120));

        // Edge case handle karne ke liye: Agar edit mode me URL database se pehle se fill ho
        if (ytUrlInput.value) {
            syncPlayerFrame();
        }
    }

    // DOM Lifecycle integration taaki bina kisi failure ke function hamesha bind ho sake
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initYoutubeUrlLinker);
    } else {
        initYoutubeUrlLinker();
    }
})();
