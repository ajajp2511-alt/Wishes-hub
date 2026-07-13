// ==========================================================
// 🚀 MODULE: YOUTUBE SEARCH ENGINE & DYNAMIC PREVIEW PLAYER
// ==========================================================
// Wishes Hub - Patel Studio (2026)

// --- PART 1: YOUTUBE API CONNECTOR ---
async function searchYouTubeSongs(query) {
    if (!query) {
        alert("Please enter a song name or YouTube link!");
        return [];
    }

    try {
        // Absolute dynamic path configuration to prevent route block or relative network drop
        const currentOrigin = window.location.origin;
        const targetUrl = `${currentOrigin}/api/get-youtube-song?query=${encodeURIComponent(query)}`;
        
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();

        if (response.ok && data.items) {
            return data.items.map(item => {
                const videoId = typeof item.id === 'string' ? item.id : item.id.videoId;
                return {
                    videoId: videoId,
                    title: item.snippet.title,
                    thumbnail: item.snippet.thumbnails.default.url
                };
            });
        } else {
            alert(data.message || "Failed to fetch results from backend.");
            return [];
        }
    } catch (error) {
        console.error("Network Error Details:", error);
        alert("Network error or route block. Please make sure api/get-youtube-song.js is in your root api/ folder.");
        return [];
    }
}

// --- PART 2: DYNAMIC PREVIEW PLAYER UTILITY & LIVE DB LINKER ---
let currentPlayingIframe = null;

function attachYouTubePreviewFields(track, containerRow) {
    if (!track || !containerRow) return;

    const playBtn = document.createElement('button');
    playBtn.type = "button";
    playBtn.innerText = "▶️ Listen";
    playBtn.style.cssText = "margin-left: auto; padding: 4px 8px; font-size: 11px; background: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;";

    const playerWrapper = document.createElement('div');
    playerWrapper.style.display = "none";

    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        if (currentPlayingIframe === playerWrapper) {
            playerWrapper.innerHTML = "";
            playerWrapper.style.display = "none";
            playBtn.innerText = "▶️ Listen";
            currentPlayingIframe = null;
            return;
        }

        if (currentPlayingIframe) {
            currentPlayingIframe.innerHTML = "";
            currentPlayingIframe.style.display = "none";
            const openBtns = containerRow.parentNode.querySelectorAll('button');
            openBtns.forEach(b => { if(b.innerText === "⏹️ Stop") b.innerText = "▶️ Listen"; });
        }

        playerWrapper.innerHTML = `
            <iframe width="100" height="40" src="https://www.youtube.com/embed/${track.videoId}?autoplay=1" frameborder="0" allow="autoplay" style="border:none; margin-top:5px; border-radius:4px;"></iframe>
        `;
        playerWrapper.style.display = "block";
        playBtn.innerText = "⏹️ Stop";
        currentPlayingIframe = playerWrapper;
    });

    containerRow.appendChild(playBtn);
    containerRow.appendChild(playerWrapper);

    const selectBtn = document.createElement('button');
    selectBtn.type = "button";
    selectBtn.innerText = "📌 Select";
    selectBtn.style.cssText = "margin-left: 8px; padding: 4px 8px; font-size: 11px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;";

    selectBtn.addEventListener('click', async (e) => {
        e.stopPropagation();

        const ytUrlInput = Array.from(document.querySelectorAll('input')).find(el => {
            return el.value.includes('youtube.com') || el.placeholder.includes('youtube.com') || (el.previousElementSibling && el.previousElementSibling.textContent.includes('YouTube URL'));
        }) || document.querySelectorAll('input')[0]; 

        if (ytUrlInput) {
            ytUrlInput.value = `https://www.youtube.com/watch?v=${track.videoId}`;
            ytUrlInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        const currentWishId = window.currentEditingWishId; 
        if (currentWishId) {
            selectBtn.innerText = "⏳ Saving...";
            selectBtn.disabled = true;
            const success = await linkSongToWishAndCache(currentWishId, track);
            if (success) {
                selectBtn.innerText = "✅ Saved";
                selectBtn.style.background = "#059669";
            } else {
                selectBtn.innerText = "📌 Select";
                selectBtn.disabled = false;
            }
        } else {
            selectBtn.innerText = "✅ Selected";
            selectBtn.style.background = "#3b82f6";
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
        const response = await fetch(`${window.location.origin}/api/add-wish-to-db`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const resData = await response.json();
        return resData.success;
    } catch (error) {
        console.error("Error connecting to save API:", error);
        return false;
    }
}

// ==========================================================
// 🔗 CONNECTION: DYNAMIC EVENT DELEGATION
// ==========================================================
document.addEventListener("click", async (e) => {
    if (e.target && e.target.tagName === "BUTTON" && e.target.textContent.trim() === "Search") {
        
        const parentRow = e.target.closest('div');
        if (!parentRow) return;

        const searchInput = parentRow.querySelector('input');
        if (!searchInput) return;

        const sectionText = parentRow.parentNode?.textContent || "";
        if (!sectionText.includes("Search Song")) {
            const allInputs = document.querySelectorAll('input');
            if (allInputs.length > 0) {
                var fallbackInput = Array.from(allInputs).find(i => i.value.trim().length > 0 && !i.value.includes('http'));
            }
        }

        const activeInput = searchInput || fallbackInput;
        if (!activeInput) return;

        const query = activeInput.value.trim();
        if (!query) {
            alert("Please enter a track name!");
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        let resultsDiv = document.getElementById("youtubeSearchResultsArea");
        if (!resultsDiv) {
            resultsDiv = document.createElement("div");
            resultsDiv.id = "youtubeSearchResultsArea";
            resultsDiv.style.cssText = "margin-top: 12px; margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px; max-height: 250px; overflow-y: auto; width: 100%; text-align: left; padding: 2px;";
            
            parentRow.parentNode.appendChild(resultsDiv);
        }

        resultsDiv.innerHTML = "<p style='font-size: 13px; color: #4f46e5; font-weight: 600; margin: 8px 0;'>🔍 Fetching from stream channels...</p>";
        
        const songs = await searchYouTubeSongs(query);
        resultsDiv.innerHTML = ""; 

        if (songs.length === 0) {
            resultsDiv.innerHTML = "<p style='font-size: 13px; color: #ef4444; margin: 8px 0;'>❌ No matching tracks found.</p>";
            return;
        }

        songs.forEach(track => {
            const row = document.createElement("div");
            row.style.cssText = "display: flex; align-items: center; padding: 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: #ffffff; gap: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 4px;";
            row.innerHTML = `
                <img src="${track.thumbnail}" style="width: 48px; height: 34px; border-radius: 4px; object-fit: cover; flex-shrink: 0;">
                <span style="font-size: 12px; font-weight: 500; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px;" title="${track.title}">${track.title}</span>
            `;
            
            attachYouTubePreviewFields(track, row);
            resultsDiv.appendChild(row);
        });
    }
});
