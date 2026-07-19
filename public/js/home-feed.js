// home-feed.js (Final Fix)
document.addEventListener('DOMContentLoaded', async () => {
    const gridContainer = document.getElementById('wishes-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = "Fetching...";

    try {
        const response = await fetch('/api/get-wishes');
        const data = await response.json();

        if (data && data.wishes) {
            gridContainer.innerHTML = ""; // Clear "Initializing" message
            data.wishes.forEach(wish => {
                const div = document.createElement('div');
                div.style.border = "1px solid #333";
                div.style.padding = "10px";
                div.style.margin = "10px";
                div.innerHTML = `<h3>${wish.title || 'No Title'}</h3>`;
                gridContainer.appendChild(div);
            });
        } else {
            gridContainer.innerHTML = "No wishes found in data.";
        }
    } catch (err) {
        gridContainer.innerHTML = "Error loading data: " + err.message;
    }
});
