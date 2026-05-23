window.playMusic = (videoId) => {
    if (!videoId) return;
    
    // Hidden Iframe for Background Audio
    const playerHtml = `
        <div style="display:none;">
            <iframe width="0" height="0" 
                src="https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}" 
                frameborder="0" allow="autoplay">
            </iframe>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', playerHtml);
};
