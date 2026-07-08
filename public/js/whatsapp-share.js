/**
 * Wishes Hub - WhatsApp Share Handler
 * Developed by Patel Studio
 */
function shareDailyWish() {
    const wishText = document.getElementById('daily-wish-text')?.innerText || '';
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(wishText + '\n\n👉 See More Here: ' + window.location.origin)}`;
    window.open(shareUrl, '_blank');
}
