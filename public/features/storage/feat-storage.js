// Upgrade: Lazy Loading Logic
let lastVisibleDoc = null; // Last fetched document tracker

window.loadMoreWishes = async () => {
    let query = db.collection("wishes").orderBy("timestamp", "desc").limit(20);
    
    if (lastVisibleDoc) {
        query = query.startAfter(lastVisibleDoc);
    }

    const snapshot = await query.get();
    if (!snapshot.empty) {
        lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
        const newWishes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        appendWishesToGrid(newWishes); // Nayi wishes purani grid mein jodna
    }
};

// Scroll Detection (Unlimited Scroll)
window.onscroll = function() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
        loadMoreWishes();
    }
};
