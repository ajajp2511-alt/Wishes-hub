// ==========================================================
// 🌐 WISHES HUB USER PANEL - LIVE DATA FETCH & AUDIO ENGINE
// Patel Studio - 2026
// ==========================================================

// Global variable database se aaya hua data store karne ke liye
window.currentWishData = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sabse pehle URL se specific wish ki ID uthayenge (E.g., wishes-hub.vercel.app/?id=-O1abcde...)
    const urlParams = new URLSearchParams(window.location.search);
    const wishId = urlParams.get('id');

    if (wishId) {
        // Agar URL me specific wish ID hai, toh use fetch karenge
        fetchSingleWishFromDatabase(wishId);
    } else {
        // Agar ID nahi hai, toh check karenge ki kya sabhi wishes dikhani hain ya koi latest default load karni hai
        fetchLatestWishDefault();
    }

    // 2. Browser ki Autoplay Policy bypass karne ke liye Open Button par Event Listener
    const openButton = document.getElementById('open-wish-btn');
    if (openButton) {
        openButton.addEventListener('click', () => {
            console.log("👉 Open Wish button clicked!");

            // Check karenge ki data load hua hai aur usme youtube URL/ID hai ya nahi
            if (window.currentWishData && window.currentWishData.youtubeUrl) {
                // YouTube URL se 11 character ki Video ID nikalenge
                const videoId = extractYouTubeId(window.currentWishData.youtubeUrl);
                if (videoId) {
                    initBackgroundMusic(videoId);
                }
            } else {
                console.log("ℹ️ No background music linked or data not loaded yet.");
            }

            // Aapka greeting card reveal karne ka animation function agar koi hai toh use yahan call karein:
            // revealCardAnimation();
        });
    }
});

// 3. Specific Wish Data Fetch karne ka dynamic pipeline
async function fetchSingleWishFromDatabase(id) {
    try {
        const targetDatabaseEndpoint = `https://wishes-hub-default-rtdb.firebaseio.com/wishes/${id}.json`;
        
        const response = await fetch(targetDatabaseEndpoint);
        if (!response.ok) throw new Error("Database network pipeline failed.");

        const data = await response.json();

        if (!data) {
            console.error("🚨 Wish data not found in database for ID:", id);
            showErrorOnUI("Wish not found!");
            return;
        }

        // Data ko global variable me set kar rahe hain taaki click event access kar sake
        window.currentWishData = data;
        
        // UI render function ko trigger karein (Text aur Image set karne ke liye)
        renderWishContentToUI(data);

    } catch (error) {
        console.error("🚨 Fetch single wish exception:", error);
        showErrorOnUI("Failed to connect to database stream.");
    }
}

// 4. Fallback: Agar link me ID na ho toh latest wish default load karne ke liye
async function fetchLatestWishDefault() {
    try {
        const targetDatabaseEndpoint = "https://wishes-hub-default-rtdb.firebaseio.com/wishes.json?orderBy=\"$key\"&limitToLast=1";
        const response = await fetch(targetDatabaseEndpoint);
        const data = await response.json();

        if (data) {
            const key = Object.keys(data)[0];
            window.currentWishData = data[key];
            renderWishContentToUI(window.currentWishData);
        }
    } catch (error) {
        console.log("No default wish loaded:", error);
    }
}

// 5. Database ka text aur image screen par fit karne ka engine
function renderWishContentToUI(wish) {
    // HTML Elements jahan data dikhana hai (Aap apne actual selectors ke hisab se badal sakte hain)
    const textNode = document.getElementById('wish-text-display') || document.querySelector('.wish-text');
    const imageNode = document.getElementById('wish-image-display') || document.querySelector('.wish-banner');

    if (textNode && wish.title) {
        textNode.innerText = wish.title;
    }
    if (imageNode && wish.image) {
        imageNode.src = wish.image;
        imageNode.style.display = 'block';
    }
    console.log("✅ Dynamic wish text and assets successfully rendered on UI nodes.");
}

// 6. Audio Player / Iframe Injection Engine
function initBackgroundMusic(youtubeId) {
    let audioContainer = document.getElementById('wishes-audio-container');
    if (!audioContainer) {
        audioContainer = document.createElement('div');
        audioContainer.id = 'wishes-audio-container';
        audioContainer.style.cssText = "position: absolute; width: 0; height: 0; opacity: 0; pointer-events: none; overflow: hidden;";
        document.body.appendChild(audioContainer);
    }

    audioContainer.innerHTML = `
        <iframe 
            src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&enablejsapi=1&mute=0" 
            allow="autoplay; encrypted-media" 
            frameborder="0">
        </iframe>
    `;
    console.log("🎵 Background music channel started for YouTube Video ID:", youtubeId);
}

// Helper: Pura YouTube URL (`https://...`) se id extract karne ke liye safe regex helper
function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Helper: Frontend par error flash karne ke liye
function showErrorOnUI(msg) {
    const textNode = document.getElementById('wish-text-display') || document.querySelector('.wish-text');
    if (textNode) {
        textNode.innerText = `❌ ${msg}`;
    }
}
