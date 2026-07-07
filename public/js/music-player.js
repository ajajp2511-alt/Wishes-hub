// Wishes Hub: Public Background Audio Streamer
// Patel Studio - 2026

function initBackgroundMusic(youtubeId) {
    if (!youtubeId) {
        console.log("No background music linked to this wish.");
        return;
    }

    // Ek invisible div/container create karna agar page par pehle se na ho
    let audioContainer = document.getElementById('wishes-audio-container');
    if (!audioContainer) {
        audioContainer = document.createElement('div');
        audioContainer.id = 'wishes-audio-container';
        // Isko poori tarah hide kar dena taaki video na dikhe, sirf audio sunai de
        audioContainer.style.cssText = "position: absolute; width: 0; height: 0; opacity: 0; pointer-events: none; overflow: hidden;";
        document.body.appendChild(audioContainer);
    }

    // HTML5 Autoplay Policies ke chalte, YouTube embed parameters perfectly set hone chahiye:
    // enablejsapi=1, autoplay=1, loop=1, aur playlist=${youtubeId} loop chalane ke liye zaroori hai.
    audioContainer.innerHTML = `
        <iframe 
            src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&enablejsapi=1&mute=0" 
            allow="autoplay; encrypted-media" 
            frameborder="0">
        </iframe>
    `;
    
    console.log("🎵 Wishes Hub: Background music initialized for ID:", youtubeId);
}
