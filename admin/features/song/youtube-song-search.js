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

        if (response.ok && data.success && data.items) {
            return data.items.map(item => {
                const videoId = typeof item.id === 'string' ? item.id : item.id.videoId;
                return {
                    videoId: videoId,
                    title: item.snippet.title,
                    thumbnail: item.snippet.thumbnails.default.url
                };
            });
        } else {
            alert(data.message || "Failed to parse matching tracks. Check keys.");
            return [];
        }
    } catch (error) {
        console.error("Network Error Details:", error);
        alert("Network processing failed on dynamic resolution.");
        return [];
    }
}

// --- PART 2: DYNAMIC PREVIEW PLAYER UTILITY & LIVE DB LINKER ---
let currentPlayingIframe = null;

function attachYouTubePreviewFields(track, containerRow) {
    if (!track || !containerRow) return;

    // Actions Wrapper to hold buttons and player neatly
    const actionWrapper = document.createElement('div');
    actionWrapper.style.cssText = "display: flex; align-items: center; gap: 8px; margin-left: auto; flex-shrink: 0;";

    const playBtn = document.createElement('button');
    playBtn.type = "button";
    playBtn.innerText = "▶️ Listen";
    playBtn.style.cssText = "padding: 6px 10px; font-size: 11px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; white-space: nowrap; transition: background 0.2s;";

    const playerWrapper = document.createElement('div');
    playerWrapper.style.cssText = "display: none; width: 120px; height: 40px; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);";

    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        if (currentPlayingIframe === playerWrapper) {
            playerWrapper.innerHTML = "";
            playerWrapper.style.display = "none";
            playBtn.innerText = "▶️ Listen";
            playBtn.style.background = "#4f46e5";
            currentPlayingIframe = null;
            return;
        }

        if (currentPlayingIframe) {
            currentPlayingIframe.innerHTML = "";
            currentPlayingIframe.style.display = "none";
            const openBtns = containerRow.parentNode.querySelectorAll('button');
            openBtns.forEach(b => { 
                if(b.innerText === "⏹️ Stop") {
                    b.innerText = "▶️ Listen";
                    b.style.background = "#4f46e5";
                }
            });
        }

        playerWrapper.innerHTML = `
            <iframe width="120" height="40" src="https://www.youtube.com/embed/${track.videoId}?autoplay=1" frameborder="0" allow="autoplay" style="border:none; width: 100%; height: 100%;"></iframe>
        `;
        playerWrapper.style.display = "block";
        playBtn.innerText = "⏹️ Stop";
        playBtn.style.background = "#ef4444";
        currentPlayingIframe = playerWrapper;
    });

    const selectBtn = document.createElement('button');
    selectBtn.type = "button";
    selectBtn.innerText = "📌 Select";
    selectBtn.style.cssText = "padding: 6px 10px; font-size: 11px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; white-space: nowrap; transition: background 0.2s;";

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

    // Add everything inside action wrapper smoothly
    actionWrapper.appendChild(playBtn);
    actionWrapper.appendChild(playerWrapper);
    actionWrapper.appendChild(selectBtn);
    containerRow.appendChild(actionWrapper);
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

        const query = searchInput.value.trim();
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
            resultsDiv.style.cssText = "margin-top: 14px; margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow-y: auto; width: 100%; text-align: left; padding: 4px; border-radius: 8px;";
            
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
            row.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: #ffffff; gap: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 2px;";
            
            // Content Wrapper for Text and Thumbnail to prevent squeeze
            const metaWrapper = document.createElement('div');
            metaWrapper.style.cssText = "display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;";
            metaWrapper.innerHTML = `
                <img src="${track.thumbnail}" style="width: 48px; height: 34px; border-radius: 4px; object-fit: cover; flex-shrink: 0;">
                <span style="font-size: 12px; font-weight: 500; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;" title="${track.title}">${track.title}</span>
            `;
            
            row.appendChild(metaWrapper);
            attachYouTubePreviewFields(track, row);
            resultsDiv.appendChild(row);
        });
    }
});
