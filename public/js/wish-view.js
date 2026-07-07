// public/js/wish-view.js (Ya jo bhi aapki public loader file hai)

// 1. Pehle hum background music ka function bana lenge jo iframe inject karega
function initBackgroundMusic(youtubeId) {
    if (!youtubeId) {
        console.log("No background music linked to this wish.");
        return;
    }

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
    console.log("🎵 Background music started for ID:", youtubeId);
}

// 2. Browser ki Autoplay Policy bypass karne ke liye user click par trigger karna
// Maan lijiye aapke HTML me lifafa ya card kholne ka button hai jiski ID 'open-wish-btn' hai
const openButton = document.getElementById('open-wish-btn');

if (openButton) {
    openButton.addEventListener('click', () => {
        
        // ⚠️ YAHA DHYAN DEIN: 
        // Firebase se fetch kiya hua data jisme 'backgroundMusicId' aa raha hai, use yahan pass karna hai.
        // Agar aapne use global variable 'currentWishData' me rakha hai, toh code aisa dikhega:
        if (window.currentWishData && window.currentWishData.backgroundMusicId) {
            initBackgroundMusic(window.currentWishData.backgroundMusicId);
        }

        // Aapka pehle se chal raha wish opening/animation/card reveal ka code yahan rahega:
        // openWishAnimation();
        // hideEnvelope();
    });
}
