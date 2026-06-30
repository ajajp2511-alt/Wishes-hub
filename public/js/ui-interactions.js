/* ==========================================================================
   Wishes Hub: Core UI & Interaction Handlers
   ========================================================================== */

function filterByTag(tagName) {
    const searchInput = document.getElementById('search-input');
    if(!searchInput) return;
    
    // Chips active state switch handler
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    if(event && event.target) {
        event.target.classList.add('active');
    }

    if(tagName === 'All') {
        searchInput.value = '';
    } else {
        searchInput.value = tagName;
    }
    // Trigger input event to let main search filter everything instantly
    searchInput.dispatchEvent(new Event('input'));
}

function shareDailyWish() {
    const text = document.getElementById('daily-wish-text').innerText;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + "\n\n👉 More Wishes: " + window.location.href)}`;
    window.open(waUrl, '_blank');
}
