const YT_API_KEY = "AIzaSyAcgg1d3F96M1CppkBSg27NcrXJvEgUnLk";
let selectedVideoId = "";

// 1. Switch Mode Toggle
window.switchMusicMode = () => {
    const isSearch = document.getElementById('ytModeToggle').checked;
    document.getElementById('apiSearchBox').style.display = isSearch ? 'block' : 'none';
    document.getElementById('directLinkBox').style.display = isSearch ? 'none' : 'block';
    document.getElementById('modeIndicator').innerText = isSearch ? "Mode: YouTube Search (API)" : "Mode: Direct YouTube Link";
};

// 2. Extract ID from Link
function extractVideoID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// 3. Search API Logic
let searchTimer;
window.handleYTSearch = () => {
    clearTimeout(searchTimer);
    const query = document.getElementById('ytQuery').value;
    if (query.length < 3) return;

    searchTimer = setTimeout(async () => {
        try {
            const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${query}&type=video&key=${YT_API_KEY}`);
            const data = await res.json();
            renderYTSuggestions(data.items);
        } catch (err) { console.error("YT API Error", err); }
    }, 600);
};

function renderYTSuggestions(items) {
    const box = document.getElementById('ytSearchResults');
    box.innerHTML = items.map(item => `
        <div class="search-item" onclick="confirmSong('${item.id.videoId}', '${item.snippet.title}')">
            <img src="${item.snippet.thumbnails.default.url}" width="40">
            <p>${item.snippet.title}</p>
        </div>
    `).join('');
}

window.confirmSong = (id, title) => {
    selectedVideoId = id;
    document.getElementById('ytQuery').value = "✅ Selected: " + title;
    document.getElementById('ytSearchResults').innerHTML = "";
};

// 4. Getting Final ID for Firebase
window.getFinalYTId = () => {
    const isSearch = document.getElementById('ytModeToggle').checked;
    if (isSearch) return selectedVideoId;
    return extractVideoID(document.getElementById('directYtUrl').value);
};
