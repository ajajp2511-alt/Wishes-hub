// ==========================================================
// 🚀 MODULE: YOUTUBE SEARCH ENGINE & DYNAMIC PREVIEW PLAYER
// ==========================================================

// --- PART 1: YOUTUBE API CONNECTOR ---
async function searchYouTubeSongs(query) {
    if (!query) {
        alert("Please enter a song name or YouTube link!");
        return [];
    }

    try {
        // Aapki banayi hui alag backend file ko hit karega
        const response = await fetch(`/api/get-youtube-song?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            // YouTube response ko format karke return karna taaki easy use ho sake
            return data.items.map(item => {
                // Agar direct ID search hai toh item.id direct string hoti hai, agar text search hai toh item.id.videoId hoti hai
                const videoId = typeof item.id === 'string' ? item.id : item.id.videoId;
                return {
                    videoId: videoId,
                    title: item.snippet.title,
                    thumbnail: item.snippet.thumbnails.default.url
                };
            });
        }
        return [];
    } catch (error) {
        console.error("Error fetching from YouTube API:", error);
        alert("Failed to search song. Check server log.");
        return [];
    }
}

// --- PART 2: DYNAMIC PREVIEW PLAYER UTILITY & LIVE DB LINKER ---
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

    // ==========================================================
    // ➕ MODIFICATION: GAANA SELECT KARNE KA NAYA BUTTON
    // ==========================================================
    const selectBtn = document.createElement('button');
    selectBtn.type = "button";
    selectBtn.innerText = "📌 Select Song";
    selectBtn.style.cssText = "margin-left: 8px; padding: 4px 8px; font-size: 11px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;";

    selectBtn.addEventListener('click', async (e) => {
        e.stopPropagation();

        // Admin panel me jo active editing wishId hai, use global variable ya modal se uthana hoga
        const currentWishId = window.currentEditingWishId; 
        
        if (!currentWishId) {
            alert("Error: Active Wish ID missing! Please select or create a wish first.");
            return;
        }

        selectBtn.innerText = "⏳ Saving...";
        selectBtn.disabled = true;

        const success = await linkSongToWishAndCache(currentWishId, track);

        if (success) {
            selectBtn.innerText = "✅ Selected";
            selectBtn.style.background = "#059669";
        } else {
            selectBtn.innerText = "📌 Select Song";
            selectBtn.disabled = false;
        }
    });

    containerRow.appendChild(selectBtn);
}

// --- PART 3: BACKEND API PIPE INTEGRATION ---
async function linkSongToWishAndCache(wishId, track) {
    const payload = {
        wishId: wishId,
        youtubeId: track.videoId,
        songTitle: track.title,
        thumbnail: track.thumbnail
    };

    try {
        const response = await fetch('/api/add-wish-to-db', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const resData = await response.json();
        if (resData.success) {
            alert("Song successfully saved to Collection & linked to Wish!");
            return true;
        } else {
            alert("Database Error: " + resData.message);
            return false;
        }
    } catch (error) {
        console.error("Error connecting to save API:", error);
        alert("Failed to save song to database.");
        return false;
    }
}
