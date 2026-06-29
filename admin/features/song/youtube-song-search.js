// ==========================================================
// 🚀 MODULE: YOUTUBE DYNAMIC PREVIEW PLAYER UTILITY
// ==========================================================

let currentPlayingIframe = null;

function attachYouTubePreviewFields(track, containerRow) {
    if (!track || !containerRow) return;

    // Create a mini play button container inside the row
    const playBtn = document.createElement('button');
    playBtn.type = "button";
    playBtn.innerText = "▶️ Listen";
    playBtn.style.cssText = "margin-left: auto; padding: 4px 8px; font-size: 11px; background: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;";

    // Hidden container for the embedded dynamic audio/video stream
    const playerWrapper = document.createElement('div');
    playerWrapper.style.display = "none";

    playBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Stops row selection trigger logic

        // Toggle condition if clicked again on the same video
        if (currentPlayingIframe === playerWrapper) {
            playerWrapper.innerHTML = "";
            playerWrapper.style.display = "none";
            playBtn.innerText = "▶️ Listen";
            currentPlayingIframe = null;
            return;
        }

        // Stop any other currently playing video stream
        if (currentPlayingIframe) {
            currentPlayingIframe.innerHTML = "";
            currentPlayingIframe.style.display = "none";
            const openBtns = containerRow.parentNode.querySelectorAll('button');
            openBtns.forEach(b => { if(b.innerText === "⏹️ Stop") b.innerText = "▶️ Listen"; });
        }

        // Inject background minimal invisible/tiny iframe to hear preview track
        playerWrapper.innerHTML = `
            <iframe width="100" height="40" src="https://www.youtube.com/embed/${track.videoId}?autoplay=1" frameborder="0" allow="autoplay" style="border:none; margin-top:5px; border-radius:4px;"></iframe>
        `;
        playerWrapper.style.display = "block";
        playBtn.innerText = "⏹️ Stop";
        currentPlayingIframe = playerWrapper;
    });

    containerRow.appendChild(playBtn);
    containerRow.appendChild(playerWrapper);
}
