/**
 * Global Actions for Wish Cards
 * Inhe aap window object par attach kar sakte hain taaki inline onclick kaam karein.
 */

// 1. Text Copy Karne ke liye
window.copyWishText = function(id) {
    // Card se text dhoodhna
    const card = document.querySelector(`[data-id="${id}"]`);
    const text = card.querySelector('.wish-text').innerText;
    
    navigator.clipboard.writeText(text).then(() => {
        // Ek chota sa user feedback message
        const copyBtn = card.querySelector('.copy-btn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✅ Copied!';
        setTimeout(() => copyBtn.innerHTML = originalText, 2000);
    }).catch(err => {
        console.error('Text copy nahi ho paya: ', err);
    });
};

// 2. WhatsApp par Share karne ke liye
window.shareOnWhatsApp = function(id) {
    const card = document.querySelector(`[data-id="${id}"]`);
    const text = card.querySelector('.wish-text').innerText;
    
    // Website ka link bhi message ke sath jodne ke liye (SEO optimization)
    const shareMessage = `${text}\n\n👉 Aur zyada wishes ke liye visit karein: ${window.location.origin}`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, '_blank');
};

// 3. Like Button Handle Karne ke liye
window.handleLike = function(id) {
    const card = document.querySelector(`[data-id="${id}"]`);
    const likeCountElem = card.querySelector('.like-count');
    let currentLikes = parseInt(likeCountElem.innerText);
    
    // Simple frontend logic: User click kare to temporary +1 dikh jaye
    // (Real database integration baad me lagayenge)
    if (!card.classList.contains('liked')) {
        card.classList.add('liked');
        likeCountElem.innerText = currentLikes + 1;
        card.querySelector('.heart-icon').innerText = '❤️'; // Red heart
    } else {
        card.classList.remove('liked');
        likeCountElem.innerText = currentLikes - 1;
        card.querySelector('.heart-icon').innerText = '🤍'; // Empty heart
    }
};
