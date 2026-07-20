const ShareCore = {
    init() {
        console.log("ShareManager: Ready.");
    },

    shareWish(text) {
        if (navigator.share) {
            navigator.share({
                title: 'Wishes Hub',
                text: text,
                url: window.location.href
            }).catch(err => console.error("Share failed", err));
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(text);
            alert("Wish copied to clipboard!");
        }
    }
};

export default ShareCore;
